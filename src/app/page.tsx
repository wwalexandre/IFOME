import Link from "next/link";

const VISOES = [
  {
    href: "/doador",
    titulo: "Doador",
    descricao: "Mercado, padaria ou restaurante publica o lote em 30 segundos.",
  },
  {
    href: "/ong",
    titulo: "ONG",
    descricao: "Recebe a oferta certa, perto e no horário, e confirma o recebimento.",
  },
  {
    href: "/voluntario",
    titulo: "Voluntário",
    descricao: "Pega uma missão curta de coleta e leva o lote até a ONG.",
  },
  {
    href: "/verificar",
    titulo: "Verificar",
    descricao: "Qualquer pessoa confere que o registro de entrega não foi alterado.",
  },
];

const FLUXO = [
  "oferta criada",
  "validada pela IA",
  "casada com a ONG",
  "coleta aceita",
  "retirada no QR",
  "entrega confirmada",
  "crédito emitido",
];

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-16 px-4 py-16 sm:px-6">
      <header className="flex flex-col gap-6">
        <span className="w-fit rounded-full border border-emerald-600/40 bg-emerald-600/10 px-3 py-1 text-xs font-medium tracking-wide text-emerald-700 dark:text-emerald-400">
          Hack Brasil 2026 · logística e automação
        </span>
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          Resgata
        </h1>
        <p className="max-w-2xl text-lg text-balance opacity-80">
          Alimento bom vai para o lixo enquanto milhões de pessoas vivem em
          insegurança alimentar. O gargalo não é vontade de doar. É tempo,
          logística pequena e falta de prova.
        </p>
        <p className="max-w-2xl text-lg text-balance opacity-80">
          O mercado publica o lote. Em minutos o sistema acha a ONG e o
          voluntário. Na entrega, dupla confirmação. Cada quilo entregue vira um
          comprovante de impacto que qualquer pessoa pode verificar.
        </p>
      </header>

      <section aria-labelledby="fluxo" className="flex flex-col gap-4">
        <h2 id="fluxo" className="text-sm font-medium uppercase tracking-wide opacity-60">
          O fluxo
        </h2>
        <ol className="flex flex-wrap items-center gap-x-2 gap-y-3 font-mono text-sm">
          {FLUXO.map((passo, i) => (
            <li key={passo} className="flex items-center gap-2">
              <span className="rounded-md border border-black/10 px-2 py-1 dark:border-white/15">
                {passo}
              </span>
              {i < FLUXO.length - 1 && <span aria-hidden className="opacity-40">→</span>}
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="visoes" className="flex flex-col gap-4">
        <h2 id="visoes" className="text-sm font-medium uppercase tracking-wide opacity-60">
          As visões
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {VISOES.map((visao) => (
            <Link
              key={visao.href}
              href={visao.href}
              className="group rounded-xl border border-black/10 p-5 transition-colors hover:border-emerald-600/60 dark:border-white/15"
            >
              <h3 className="font-medium group-hover:text-emerald-700 dark:group-hover:text-emerald-400">
                {visao.titulo}
              </h3>
              <p className="mt-1 text-sm opacity-70">{visao.descricao}</p>
            </Link>
          ))}
        </div>
      </section>

      <footer className="mt-auto border-t border-black/10 pt-6 text-sm opacity-60 dark:border-white/15">
        <p>
          O crédito de impacto não é transferível, não é resgatável em dinheiro e
          não tem promessa de valorização. É comprovante e reconhecimento.
        </p>
      </footer>
    </main>
  );
}
