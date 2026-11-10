import Link from "next/link";
import type { ReactNode } from "react";

type Props = {
  titulo: string;
  resumo: string;
  children?: ReactNode;
};

export function Tela({ titulo, resumo, children }: Props) {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-4 py-12 sm:px-6">
      <Link href="/" className="w-fit text-sm opacity-60 hover:opacity-100">
        ← Resgata
      </Link>
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight">{titulo}</h1>
        <p className="opacity-70">{resumo}</p>
      </header>
      {children}
    </main>
  );
}

export function Pendencias({ itens }: { itens: string[] }) {
  return (
    <section className="rounded-xl border border-black/10 p-5 dark:border-white/15">
      <h2 className="text-sm font-medium uppercase tracking-wide opacity-60">
        A construir
      </h2>
      <ul className="mt-3 flex flex-col gap-2 text-sm">
        {itens.map((item) => (
          <li key={item} className="flex gap-2">
            <span aria-hidden className="opacity-40">▢</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
