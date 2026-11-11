/**
 * Camada de dados do IFOMME.
 *
 * O protótipo foi escrito contra uma API de documentos (coleção, documento,
 * escuta em tempo real). Este módulo entrega a mesma API sobre o Supabase,
 * então o aplicativo não precisa saber qual banco está embaixo.
 *
 * Cada coleção é uma tabela com duas colunas que importam: `id` de texto e
 * `data` em jsonb. Os dados privados de cada pessoa ficam em `user_data`,
 * com o uid na chave e protegidos por RLS.
 *
 * Se não houver configuração do Supabase, o módulo tenta o ambiente do
 * Claude, e se nem isso existir devolve null, que é o modo somente leitura
 * que o aplicativo já sabe tratar.
 */

import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/+esm";

const PREFIXO_USUARIO = "data/users/";

/** Traduz o caminho da coleção para tabela e, quando for o caso, dono. */
function resolver(caminho) {
  if (caminho.startsWith(PREFIXO_USUARIO)) {
    return { tabela: "user_data", uid: caminho.slice(PREFIXO_USUARIO.length) };
  }
  return { tabela: caminho, uid: null };
}

function criarDb(supabase) {
  return {
    collection(caminho) {
      const { tabela, uid } = resolver(caminho);

      /** Restringe a consulta ao dono, quando a tabela tem dono. */
      const escopo = (consulta) => (uid ? consulta.eq("uid", uid) : consulta);

      const buscarTudo = async () => {
        const { data, error } = await escopo(
          supabase.from(tabela).select("id, data"),
        );
        if (error) throw error;
        return {
          docs: (data || []).map((linha) => ({
            id: linha.id,
            data: () => linha.data || {},
          })),
          metadata: { fromCache: false },
        };
      };

      return {
        doc(id) {
          const chave = uid ? { uid, id } : { id };

          return {
            async set(valor) {
              const { error } = await supabase
                .from(tabela)
                .upsert({ ...chave, data: valor });
              if (error) throw error;
            },

            /** Mescla campos no documento, como um update de documento faz. */
            async update(parcial) {
              const { data: atual, error: erroLeitura } = await escopo(
                supabase.from(tabela).select("data").eq("id", id),
              ).maybeSingle();
              if (erroLeitura) throw erroLeitura;

              const { error } = await supabase
                .from(tabela)
                .upsert({ ...chave, data: { ...(atual?.data || {}), ...parcial } });
              if (error) throw error;
            },

            async delete() {
              const { error } = await escopo(
                supabase.from(tabela).delete().eq("id", id),
              );
              if (error) throw error;
            },
          };
        },

        /**
         * Entrega a coleção inteira agora e de novo a cada mudança.
         * Devolve a função que cancela a escuta.
         */
        onSnapshot(aoReceber, aoFalhar) {
          let vivo = true;

          const emitir = () =>
            buscarTudo().then(
              (snapshot) => vivo && aoReceber(snapshot),
              (erro) => vivo && aoFalhar && aoFalhar(erro),
            );

          emitir();

          const canal = supabase
            .channel(`ifomme:${tabela}:${uid || "todos"}`)
            .on(
              "postgres_changes",
              {
                event: "*",
                schema: "public",
                table: tabela,
                ...(uid ? { filter: `uid=eq.${uid}` } : {}),
              },
              emitir,
            )
            .subscribe();

          return () => {
            vivo = false;
            supabase.removeChannel(canal);
          };
        },
      };
    },
  };
}

async function conectar() {
  const config = window.IFOMME_CONFIG || {};

  if (!config.supabaseUrl || !config.supabaseKey) {
    // Sem Supabase configurado, tenta o ambiente de origem do protótipo.
    if (window.claude && window.claude.use) {
      return {
        db: await window.claude.use("db"),
        user: await window.claude.use("user"),
      };
    }
    return { db: null, user: null };
  }

  const supabase = createClient(config.supabaseUrl, config.supabaseKey);

  // Conta anônima: o visitante não precisa se cadastrar para experimentar,
  // mas tem um uid estável, que é o que o RLS usa.
  let { data: sessao } = await supabase.auth.getSession();
  if (!sessao.session) {
    const { error } = await supabase.auth.signInAnonymously();
    if (error) throw error;
    ({ data: sessao } = await supabase.auth.getSession());
  }

  const uid = sessao.session?.user?.id || null;

  const user = {
    async id() {
      return uid;
    },
    async canEdit() {
      if (!uid) return false;
      const { data } = await supabase
        .from("admins")
        .select("uid")
        .eq("uid", uid)
        .maybeSingle();
      return !!data;
    },
  };

  return { db: criarDb(supabase), user };
}

conectar().then(
  (conexao) => window.__ifommeConectado(conexao),
  (erro) => {
    console.error("IFOMME: não foi possível conectar ao banco.", erro);
    window.__ifommeConectado({ db: null, user: null });
  },
);
