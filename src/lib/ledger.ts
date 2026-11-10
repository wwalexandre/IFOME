/**
 * Ledger append-only com hash encadeado.
 *
 * Cada evento guarda o hash do evento anterior. Alterar qualquer registro
 * antigo quebra a verificação de todos os eventos seguintes, o que dá prova
 * de integridade sem blockchain.
 *
 * Usa Web Crypto, então o mesmo código roda no servidor e no navegador.
 */

export const EVENT_TYPES = [
  "offer_created",
  "offer_validated",
  "offer_matched",
  "pickup_assigned",
  "pickup_confirmed",
  "delivery_confirmed",
  "credits_issued",
] as const;

export type LedgerEventType = (typeof EVENT_TYPES)[number];

export type LedgerEventInput = {
  lotId: string;
  type: LedgerEventType;
  actorId: string;
  payload: Record<string, unknown>;
  createdAt: string;
};

export type LedgerEvent = LedgerEventInput & {
  prevHash: string;
  hash: string;
};

/** Hash do primeiro evento de uma cadeia. */
export const GENESIS_HASH = "0".repeat(64);

function toHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * Serializa o evento de forma estável. As chaves do payload são ordenadas
 * para que o mesmo conteúdo gere sempre o mesmo hash.
 */
function serialize(event: LedgerEventInput, prevHash: string): string {
  const payload = JSON.stringify(event.payload, Object.keys(event.payload).sort());
  return [prevHash, event.type, event.lotId, event.actorId, payload, event.createdAt].join("|");
}

export async function hashEvent(
  event: LedgerEventInput,
  prevHash: string,
): Promise<string> {
  const data = new TextEncoder().encode(serialize(event, prevHash));
  return toHex(await crypto.subtle.digest("SHA-256", data));
}

/** Encadeia um evento novo no fim da cadeia. */
export async function appendEvent(
  chain: readonly LedgerEvent[],
  input: LedgerEventInput,
): Promise<LedgerEvent> {
  const prevHash = chain.length === 0 ? GENESIS_HASH : chain[chain.length - 1].hash;
  return { ...input, prevHash, hash: await hashEvent(input, prevHash) };
}

export type VerificationResult =
  | { valid: true; length: number }
  | { valid: false; length: number; brokenAt: number; reason: string };

/**
 * Recalcula a cadeia inteira e devolve o índice do primeiro evento adulterado.
 * É o que a página pública de verificação roda.
 */
export async function verifyChain(
  chain: readonly LedgerEvent[],
): Promise<VerificationResult> {
  let prevHash = GENESIS_HASH;

  for (let i = 0; i < chain.length; i++) {
    const event = chain[i];

    if (event.prevHash !== prevHash) {
      return {
        valid: false,
        length: chain.length,
        brokenAt: i,
        reason: "O evento não aponta para o hash do evento anterior",
      };
    }

    if ((await hashEvent(event, prevHash)) !== event.hash) {
      return {
        valid: false,
        length: chain.length,
        brokenAt: i,
        reason: "O conteúdo do evento não corresponde ao hash registrado",
      };
    }

    prevHash = event.hash;
  }

  return { valid: true, length: chain.length };
}

/** Pesos do crédito de impacto. Ficam aqui, não espalhados pelo código. */
export const CATEGORY_WEIGHTS = {
  in_natura: 1.5,
  proteina: 1.5,
  padaria: 1.2,
  mercearia: 1.0,
  ultraprocessado: 0.5,
} as const;

export type Category = keyof typeof CATEGORY_WEIGHTS;

/**
 * Crédito de impacto. Não é transferível, não é resgatável em dinheiro e não
 * tem promessa de valorização. É comprovante e reconhecimento.
 */
export function calculateCredits(
  kgVerified: number,
  category: Category,
  urgencyFactor = 1,
): number {
  const factor = Math.min(Math.max(urgencyFactor, 1), 1.3);
  return Math.round(kgVerified * CATEGORY_WEIGHTS[category] * factor * 100) / 100;
}
