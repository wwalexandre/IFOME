import { Tela } from "@/components/Tela";
import {
  appendEvent,
  calculateCredits,
  verifyChain,
  type LedgerEvent,
  type LedgerEventInput,
} from "@/lib/ledger";

export const metadata = { title: "Verificar · Resgata" };

const LOTE = "lote-demo-0001";

const EVENTOS: LedgerEventInput[] = [
  {
    lotId: LOTE,
    type: "offer_created",
    actorId: "mercado-vila-nova",
    payload: { categoria: "in_natura", kgEstimado: 18, validade: "2026-11-11" },
    createdAt: "2026-11-09T11:02:00-03:00",
  },
  {
    lotId: LOTE,
    type: "offer_validated",
    actorId: "sistema",
    payload: { leituraRotulo: "ok", confianca: 0.94 },
    createdAt: "2026-11-09T11:02:09-03:00",
  },
  {
    lotId: LOTE,
    type: "offer_matched",
    actorId: "casa-de-apoio-sao-jorge",
    payload: { distanciaKm: 1.4, aceiteEmSegundos: 96 },
    createdAt: "2026-11-09T11:03:45-03:00",
  },
  {
    lotId: LOTE,
    type: "pickup_assigned",
    actorId: "voluntario-marina",
    payload: { modal: "bicicleta" },
    createdAt: "2026-11-09T11:06:12-03:00",
  },
  {
    lotId: LOTE,
    type: "pickup_confirmed",
    actorId: "voluntario-marina",
    payload: { qr: "lido", kgPesado: 17.4 },
    createdAt: "2026-11-09T11:31:00-03:00",
  },
  {
    lotId: LOTE,
    type: "delivery_confirmed",
    actorId: "casa-de-apoio-sao-jorge",
    payload: { kgVerificado: 17.4, condicao: "boa" },
    createdAt: "2026-11-09T11:48:30-03:00",
  },
  {
    lotId: LOTE,
    type: "credits_issued",
    actorId: "sistema",
    payload: {
      kgVerificado: 17.4,
      categoria: "in_natura",
      creditos: calculateCredits(17.4, "in_natura", 1.2),
    },
    createdAt: "2026-11-09T11:48:31-03:00",
  },
];

async function montarCadeia(): Promise<LedgerEvent[]> {
  const cadeia: LedgerEvent[] = [];
  for (const evento of EVENTOS) {
    cadeia.push(await appendEvent(cadeia, evento));
  }
  return cadeia;
}

export default async function VerificarPage() {
  // A cadeia de demonstração é determinística, então pode ser pré-renderizada.
  "use cache";

  const cadeia = await montarCadeia();
  const resultado = await verifyChain(cadeia);

  return (
    <Tela
      titulo="Verificar"
      resumo="Cada entrega gera uma cadeia de eventos encadeados por hash. Alterar um registro antigo quebra todos os hashes seguintes."
    >
      <div
        className={`rounded-xl border p-5 ${
          resultado.valid
            ? "border-emerald-600/40 bg-emerald-600/5"
            : "border-red-600/40 bg-red-600/5"
        }`}
      >
        <p className="font-medium">
          {resultado.valid
            ? `Cadeia íntegra, ${resultado.length} eventos verificados`
            : `Cadeia adulterada no evento ${resultado.brokenAt + 1}`}
        </p>
        <p className="mt-1 text-sm opacity-70">
          {resultado.valid
            ? "Os hashes foram recalculados agora, neste carregamento da página."
            : resultado.reason}
        </p>
      </div>

      <ol className="flex flex-col gap-3">
        {cadeia.map((evento, i) => (
          <li
            key={evento.hash}
            className="rounded-xl border border-black/10 p-4 dark:border-white/15"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <span className="font-mono text-sm font-medium">
                {i + 1}. {evento.type}
              </span>
              <span className="text-xs opacity-60">
                {new Date(evento.createdAt).toLocaleString("pt-BR")}
              </span>
            </div>
            <p className="mt-1 text-sm opacity-70">por {evento.actorId}</p>
            <pre className="mt-2 overflow-x-auto font-mono text-xs opacity-60">
              {JSON.stringify(evento.payload)}
            </pre>
            <p className="mt-2 break-all font-mono text-xs opacity-50">
              hash {evento.hash}
            </p>
          </li>
        ))}
      </ol>

      <p className="text-sm opacity-60">
        Esta página usa um lote de demonstração com dados sintéticos. Na versão
        final, o identificador do lote vem da URL e a cadeia vem do banco.
      </p>
    </Tela>
  );
}
