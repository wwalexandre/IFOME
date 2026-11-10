# Arquitetura

## Eventos do ledger

A cadeia é append-only. Cada evento guarda o hash do evento anterior, então alterar qualquer registro antigo quebra todos os hashes seguintes.

```
offer_created
  -> offer_validated
  -> offer_matched
  -> pickup_assigned
  -> pickup_confirmed
  -> delivery_confirmed
  -> credits_issued
```

Campos de cada evento:

| Campo | Descrição |
|---|---|
| `id` | identificador do evento |
| `lotId` | lote a que o evento pertence |
| `type` | um dos tipos acima |
| `actorId` | quem gerou o evento |
| `payload` | dados do evento, em JSON |
| `createdAt` | data e hora em ISO 8601 |
| `prevHash` | hash do evento anterior da cadeia |
| `hash` | `sha256(prevHash + type + lotId + actorId + payload + createdAt)` |

A implementação está em `src/lib/ledger.ts` e usa Web Crypto, então roda igual no servidor e no navegador.

**O crédito só é emitido depois da dupla confirmação** (voluntário e ONG). É a regra antifraude central.

## Modelo de dados

```sql
organizations (id, type, name, address, geo, created_at)
  -- type: donor | receiver

receiver_profiles (org_id, accepted_categories[], cold_chain, capacity_kg, hours)

volunteers (id, name, radius_km, vehicle, geo)

donation_offers (id, donor_org_id, status, window_start, window_end, geo, created_at)
  -- status: open | matched | in_transit | delivered | expired

donation_items (id, offer_id, category, kg_est, kg_verified, expiry_date, photo_url, label_ocr)

matches (id, offer_id, receiver_org_id, status, expires_at)

pickups (id, offer_id, volunteer_id, status, picked_at, delivered_at, proof)

ledger_events (id, lot_id, type, actor_id, payload, prev_hash, hash, created_at)

credit_balances (owner_id, owner_type, balance, updated_at)
  -- derivado do ledger, nunca escrito à mão
```

## Matching

Filtro duro primeiro: categoria aceita, cadeia de frio quando necessário, janela de retirada compatível.

Depois, pontuação:

```
score = w1 * proximidade
      + w2 * capacidade_livre
      + w3 * cadeia_fria_ok
      + w4 * reputacao
      + w5 * janela_horaria
```

Oferta às 3 melhores com prazo curto de aceite. Se ninguém aceitar, escala para o raio seguinte.

## Crédito de impacto

```
creditos = kg_verificados * multiplicador_categoria * fator_urgencia
```

| Categoria | Multiplicador |
|---|---|
| In natura | 1,5 |
| Proteína e laticínio | 1,5 |
| Pão e refeição pronta | 1,2 |
| Mercearia básica | 1,0 |
| Ultraprocessado | 0,5 |

`fator_urgencia` vai de 1,0 a 1,3 conforme o tempo restante de validade.

Os pesos ficam em configuração, não no código espalhado.
