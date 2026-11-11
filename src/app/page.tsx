const PARA_QUEM = [
  {
    titulo: "Quem doa",
    texto:
      "Pessoa física, supermercado, restaurante, padaria, hospital, cooperativa ou indústria. Publica o que tem, declara que o alimento está próprio para consumo e escolhe se leva, se busca ou se usa um ponto de coleta.",
  },
  {
    titulo: "Instituições",
    texto:
      "ONGs, cozinhas comunitárias e casas de apoio dizem o que precisam, em que horário recebem e se fazem coleta. Passam por inspeção antes de aparecer na rede.",
  },
  {
    titulo: "Quem acompanha",
    texto:
      "Cada doação tem quatro etapas confirmadas pela instituição, do aceite ao relato de impacto. O doador vê tudo em Meu impacto.",
  },
];

const O_QUE_RESOLVE = [
  {
    titulo: "Achar quem precisa, perto",
    texto:
      "A busca é por bairro e por necessidade declarada, não por lista genérica de instituições.",
  },
  {
    titulo: "Tirar o medo jurídico",
    texto:
      "A Lei 15.224/2025 diz que doador e instituição só respondem por danos se houver dolo, e que a doação não configura relação de consumo. O app explica a regra na hora da doação e registra a declaração.",
  },
  {
    titulo: "Não parar na intenção",
    texto:
      "Coleta, entrega e recebimento ficam combinados dentro do app, com conversa direta entre doador e instituição.",
  },
  {
    titulo: "Ir além do alimento",
    texto:
      "Alimentos, roupas, material escolar, higiene, horas de voluntariado e doação direta para a chave Pix da instituição. O IFOMME não processa pagamentos.",
  },
];

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-16 px-5 py-16 sm:px-6">
      <header className="flex flex-col gap-6">
        <span className="w-fit rounded-full bg-red-600/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-red-600 dark:text-red-400">
          Hack Brasil 2026
        </span>
        <h1
          className="text-5xl font-black tracking-tight sm:text-6xl"
          style={{ fontFamily: "var(--font-display)" }}
        >
          IFOMME
        </h1>
        <p className="max-w-2xl text-xl text-pretty opacity-80">
          Doe o que sobra para quem precisa, perto de você, com as regras de
          segurança alimentar explicadas e cada etapa confirmada.
        </p>
        <div className="flex flex-wrap gap-3">
          <a
            href="/prototipo.html"
            className="rounded-full bg-red-600 px-6 py-3 font-bold text-white transition hover:brightness-110"
          >
            Abrir o protótipo
          </a>
          <a
            href="https://github.com/wwalexandre/IFOME"
            className="rounded-full border border-neutral-300 px-6 py-3 font-bold transition hover:border-neutral-500 dark:border-neutral-700"
          >
            Ver o código
          </a>
        </div>
      </header>

      <section className="flex flex-col gap-5">
        <h2
          className="text-2xl font-extrabold"
          style={{ fontFamily: "var(--font-display)" }}
        >
          O problema
        </h2>
        <p className="max-w-2xl text-pretty opacity-80">
          Comida boa vai para o lixo enquanto milhões de pessoas vivem em
          insegurança alimentar. Quem quer doar não sabe para quem, tem medo de
          responder por um problema sanitário e desiste na parte chata, que é
          combinar a entrega. Quem recebe não tem como avisar do que precisa
          hoje.
        </p>
      </section>

      <section className="flex flex-col gap-5">
        <h2
          className="text-2xl font-extrabold"
          style={{ fontFamily: "var(--font-display)" }}
        >
          O que o IFOMME resolve
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {O_QUE_RESOLVE.map((item) => (
            <div
              key={item.titulo}
              className="rounded-xl border border-neutral-200 p-5 dark:border-neutral-800"
            >
              <h3 className="font-bold">{item.titulo}</h3>
              <p className="mt-1 text-sm opacity-70">{item.texto}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-5">
        <h2
          className="text-2xl font-extrabold"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Para quem é
        </h2>
        <div className="flex flex-col gap-4">
          {PARA_QUEM.map((item) => (
            <div
              key={item.titulo}
              className="rounded-xl bg-neutral-100 p-5 dark:bg-neutral-900"
            >
              <h3 className="font-bold">{item.titulo}</h3>
              <p className="mt-1 text-sm opacity-70">{item.texto}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="mt-auto flex flex-col gap-2 border-t border-neutral-200 pt-6 text-sm opacity-60 dark:border-neutral-800">
        <p>
          Projeto do Hack Brasil 2026, trilha de logística e automação. Os dados
          mostrados no protótipo são de exemplo.
        </p>
        <p>Código aberto sob licença MIT.</p>
      </footer>
    </main>
  );
}
