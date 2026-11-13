/**
 * API do IFOMME sobre o Cloudflare D1.
 *
 * O aplicativo fala a língua de um banco de documentos: coleção, documento,
 * mesclar campos. Esta função traduz isso para SQL e, de quebra, resolve do
 * lado do servidor o que antes dependia de política no banco: quem está
 * pedindo, e a que dados essa pessoa tem direito.
 *
 * Rotas, todas sob /api:
 *   GET    /api/me                 quem sou eu nesta visita
 *   GET    /api/rev                versão de cada coleção, para saber se mudou
 *   GET    /api/col/<colecao>      a coleção inteira
 *   PUT    /api/doc/<colecao>/<id> grava o documento
 *   PATCH  /api/doc/<colecao>/<id> mescla campos no documento
 *   DELETE /api/doc/<colecao>/<id> apaga o documento
 *
 * A coleção "me" são os dados privados de quem está visitando. Ela nunca
 * aceita um dono vindo do cliente: o dono é sempre o do cookie.
 */

const COLECOES = new Set([
  "ongs",
  "posts",
  "perfis",
  "aprov",
  "chats",
  "doacoes",
  "receb",
]);

const COOKIE = "ifomme_uid";
const ANO_EM_SEGUNDOS = 60 * 60 * 24 * 365;

function json(corpo, init = {}) {
  return new Response(JSON.stringify(corpo), {
    ...init,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
      ...(init.headers || {}),
    },
  });
}

function erro(mensagem, status = 400) {
  return json({ erro: mensagem }, { status });
}

function lerCookie(request, nome) {
  const bruto = request.headers.get("cookie") || "";
  for (const parte of bruto.split(";")) {
    const [chave, ...resto] = parte.trim().split("=");
    if (chave === nome) return decodeURIComponent(resto.join("="));
  }
  return null;
}

function cookieDeVisita(uid) {
  return `${COOKIE}=${uid}; Path=/; Max-Age=${ANO_EM_SEGUNDOS}; SameSite=Lax; Secure; HttpOnly`;
}

/** Identifica a visita. Quem chega sem cookie ganha um identificador novo. */
function identificar(request) {
  const existente = lerCookie(request, COOKIE);
  if (existente && /^[0-9a-f-]{36}$/.test(existente)) {
    return { uid: existente, novo: false };
  }
  return { uid: crypto.randomUUID(), novo: true };
}

function ehObjetoSimples(v) {
  return !!v && typeof v === "object" && !Array.isArray(v);
}

/**
 * Mescla em profundidade. É o que o aplicativo espera de um update: gravar
 * `{items:{abc:...}}` acrescenta uma doação em vez de substituir a lista.
 */
function mesclar(base, novo) {
  const saida = { ...base };
  for (const chave of Object.keys(novo)) {
    const atual = saida[chave];
    const valor = novo[chave];
    saida[chave] =
      ehObjetoSimples(atual) && ehObjetoSimples(valor)
        ? mesclar(atual, valor)
        : valor;
  }
  return saida;
}

function analisar(texto) {
  try {
    return JSON.parse(texto || "{}");
  } catch {
    return {};
  }
}

async function ehAdmin(db, uid) {
  const linha = await db
    .prepare("select uid from admins where uid = ?")
    .bind(uid)
    .first();
  return !!linha;
}

async function lerColecao(db, nome, uid) {
  if (nome === "me") {
    const { results } = await db
      .prepare("select id, data from user_data where uid = ?")
      .bind(uid)
      .all();
    return results || [];
  }
  const { results } = await db
    .prepare(`select id, data from ${nome}`)
    .all();
  return results || [];
}

async function lerDocumento(db, nome, id, uid) {
  if (nome === "me") {
    return db
      .prepare("select data from user_data where uid = ? and id = ?")
      .bind(uid, id)
      .first();
  }
  return db.prepare(`select data from ${nome} where id = ?`).bind(id).first();
}

async function gravar(db, nome, id, uid, dados) {
  const texto = JSON.stringify(dados);
  const agora = Date.now();
  if (nome === "me") {
    await db
      .prepare(
        `insert into user_data (uid, id, data, updated_at) values (?, ?, ?, ?)
         on conflict (uid, id) do update set data = excluded.data, updated_at = excluded.updated_at`,
      )
      .bind(uid, id, texto, agora)
      .run();
    return;
  }
  await db
    .prepare(
      `insert into ${nome} (id, data, updated_at) values (?, ?, ?)
       on conflict (id) do update set data = excluded.data, updated_at = excluded.updated_at`,
    )
    .bind(id, texto, agora)
    .run();
}

/** Carimbo de versão por coleção. O cliente só busca de novo o que mudou. */
async function versoes(db, uid) {
  const saida = {};
  for (const nome of COLECOES) {
    const linha = await db
      .prepare(`select coalesce(max(updated_at), 0) as v, count(*) as n from ${nome}`)
      .first();
    saida[nome] = `${linha.v}:${linha.n}`;
  }
  const meu = await db
    .prepare(
      "select coalesce(max(updated_at), 0) as v, count(*) as n from user_data where uid = ?",
    )
    .bind(uid)
    .first();
  saida.me = `${meu.v}:${meu.n}`;
  return saida;
}

export async function onRequest(context) {
  const { request, env } = context;
  const db = env.DB;

  if (!db) return erro("Banco de dados não está ligado a este site.", 503);

  const url = new URL(request.url);
  const partes = url.pathname.replace(/^\/api\/?/, "").split("/").filter(Boolean);
  const { uid, novo } = identificar(request);
  const cabecalhos = novo ? { "set-cookie": cookieDeVisita(uid) } : {};

  try {
    if (partes[0] === "me" && partes.length === 1) {
      return json({ uid, admin: await ehAdmin(db, uid) }, { headers: cabecalhos });
    }

    if (partes[0] === "rev" && partes.length === 1) {
      return json(await versoes(db, uid), { headers: cabecalhos });
    }

    if (partes[0] === "col" && partes.length === 2) {
      const nome = partes[1];
      if (nome !== "me" && !COLECOES.has(nome)) return erro("Coleção desconhecida.", 404);
      const linhas = await lerColecao(db, nome, uid);
      return json(
        { docs: linhas.map((l) => ({ id: l.id, data: analisar(l.data) })) },
        { headers: cabecalhos },
      );
    }

    if (partes[0] === "doc" && partes.length === 3) {
      const [, nome, id] = partes;
      if (nome !== "me" && !COLECOES.has(nome)) return erro("Coleção desconhecida.", 404);
      if (!id || id.length > 200) return erro("Identificador inválido.");

      if (request.method === "PUT") {
        const corpo = await request.json();
        await gravar(db, nome, id, uid, corpo);
        return json({ ok: true }, { headers: cabecalhos });
      }

      if (request.method === "PATCH") {
        const corpo = await request.json();
        const atual = await lerDocumento(db, nome, id, uid);
        await gravar(db, nome, id, uid, mesclar(analisar(atual && atual.data), corpo));
        return json({ ok: true }, { headers: cabecalhos });
      }

      if (request.method === "DELETE") {
        if (nome === "me") {
          await db
            .prepare("delete from user_data where uid = ? and id = ?")
            .bind(uid, id)
            .run();
        } else {
          await db.prepare(`delete from ${nome} where id = ?`).bind(id).run();
        }
        return json({ ok: true }, { headers: cabecalhos });
      }

      return erro("Método não suportado nesta rota.", 405);
    }

    return erro("Rota desconhecida.", 404);
  } catch (e) {
    return erro(`Falha no banco de dados: ${e.message}`, 500);
  }
}
