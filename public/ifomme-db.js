/**
 * Camada de dados do IFOMME.
 *
 * O aplicativo foi escrito contra uma API de documentos: coleção, documento,
 * escuta. Este módulo entrega essa API falando com /api, que é uma função do
 * Cloudflare Pages em cima do banco D1.
 *
 * Quem é o visitante não vem daqui. Vem de um cookie que o servidor emite e
 * que o navegador não consegue ler, então não dá para se passar por outra
 * pessoa mexendo no console. Os dados privados são filtrados no servidor.
 *
 * Atualização: o D1 não empurra mudança para o navegador. Em vez de abrir uma
 * conexão permanente, o módulo pergunta a cada 3 segundos qual a versão de
 * cada coleção, e só busca de novo a que mudou. A pergunta é uma linha por
 * tabela, e na maior parte das vezes a resposta é "nada mudou".
 */

const INTERVALO_MS = 3000;
const PREFIXO_USUARIO = "data/users/";

/** Coleções nomeadas pelo caminho que o aplicativo usa. */
function resolver(caminho) {
  return caminho.startsWith(PREFIXO_USUARIO) ? "me" : caminho;
}

async function pedir(caminho, opcoes = {}) {
  const resposta = await fetch(`/api/${caminho}`, {
    credentials: "same-origin",
    ...opcoes,
    headers: { "content-type": "application/json", ...(opcoes.headers || {}) },
  });
  if (!resposta.ok) {
    const corpo = await resposta.json().catch(() => ({}));
    throw new Error(corpo.erro || `Falha na requisição (${resposta.status})`);
  }
  return resposta.json();
}

/**
 * Um único relógio para todas as escutas. Pergunta as versões, e avisa só
 * quem assina uma coleção que mudou.
 */
function criarVigia() {
  const assinantes = new Map(); // coleção -> Set de funções
  const versoes = new Map();
  let rodando = false;

  async function rodada() {
    if (assinantes.size === 0) return;
    const atual = await pedir("rev");
    for (const [colecao, ouvintes] of assinantes) {
      const versao = atual[colecao];
      if (versao === undefined || versoes.get(colecao) === versao) continue;
      versoes.set(colecao, versao);
      for (const ouvinte of ouvintes) ouvinte();
    }
  }

  function ligar() {
    if (rodando) return;
    rodando = true;
    setInterval(() => {
      rodada().catch(() => {
        /* uma rodada que falha não derruba as próximas */
      });
    }, INTERVALO_MS);
    // Volta a olhar assim que a aba volta para a frente.
    document.addEventListener("visibilitychange", () => {
      if (!document.hidden) rodada().catch(() => {});
    });
  }

  return {
    assinar(colecao, aoMudar) {
      if (!assinantes.has(colecao)) assinantes.set(colecao, new Set());
      assinantes.get(colecao).add(aoMudar);
      ligar();
      return () => {
        const ouvintes = assinantes.get(colecao);
        if (!ouvintes) return;
        ouvintes.delete(aoMudar);
        if (ouvintes.size === 0) assinantes.delete(colecao);
      };
    },
    /** Depois de escrever, não espera o relógio: confere agora. */
    conferirAgora() {
      rodada().catch(() => {});
    },
  };
}

function criarDb() {
  const vigia = criarVigia();

  const db = {
    /** Atalho por caminho, como em `db.doc("aprov/abc")`. */
    doc(caminho) {
      const corte = caminho.lastIndexOf("/");
      return db.collection(caminho.slice(0, corte)).doc(caminho.slice(corte + 1));
    },

    collection(caminho) {
      const colecao = resolver(caminho);

      return {
        doc(id) {
          const rota = `doc/${colecao}/${encodeURIComponent(id)}`;
          const depois = (r) => {
            vigia.conferirAgora();
            return r;
          };

          return {
            set(valor) {
              return pedir(rota, { method: "PUT", body: JSON.stringify(valor) }).then(depois);
            },
            update(parcial) {
              return pedir(rota, { method: "PATCH", body: JSON.stringify(parcial) }).then(depois);
            },
            delete() {
              return pedir(rota, { method: "DELETE" }).then(depois);
            },
          };
        },

        onSnapshot(aoReceber, aoFalhar) {
          let vivo = true;

          const emitir = () =>
            pedir(`col/${colecao}`).then(
              (corpo) => {
                if (!vivo) return;
                aoReceber({
                  docs: corpo.docs.map((d) => ({ id: d.id, data: () => d.data })),
                  metadata: { fromCache: false },
                });
              },
              (e) => vivo && aoFalhar && aoFalhar(e),
            );

          emitir();
          const cancelarVigia = vigia.assinar(colecao, emitir);

          return () => {
            vivo = false;
            cancelarVigia();
          };
        },
      };
    },
  };

  return db;
}

async function conectar() {
  const eu = await pedir("me");

  const user = {
    async id() {
      return eu.uid;
    },
    async canEdit() {
      return !!eu.admin;
    },
  };

  return { db: criarDb(), user };
}

conectar().then(
  (conexao) => window.__ifommeConectado(conexao),
  (erro) => {
    console.error("IFOMME: não foi possível falar com a API.", erro);
    window.__ifommeConectado({ db: null, user: null });
  },
);
