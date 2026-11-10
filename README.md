# Resgata

Plataforma de resgate de alimentos com comprovante de impacto verificável.

Projeto do **Hack Brasil 2026**, trilha de logística e automação.

> Nome provisório. Pode mudar antes da submissão.

## O problema

Alimento bom vai para o lixo enquanto milhões de pessoas vivem em insegurança alimentar. O gargalo não é falta de vontade de doar, são três fricções:

1. **Tempo.** Alimento perto do vencimento tem janela de horas, e a ONG não consegue buscar a tempo.
2. **Logística pequena.** Coletar 20 kg em um mercado de bairro não paga um frete.
3. **Falta de prova.** Doação sem registro auditável não vira relatório nem comprovante para o contador.

## A solução

O mercado publica o lote em 30 segundos. O sistema casa a oferta com uma ONG próxima e com um voluntário, em minutos. Na retirada e na entrega, QR e dupla confirmação. Cada entrega confirmada vira um **crédito de impacto** registrado em um ledger com hash encadeado, que qualquer pessoa pode verificar.

**O crédito de impacto não é transferível, não é resgatável em dinheiro e não tem promessa de valorização.** Ele é comprovante e reconhecimento, não ativo financeiro.

## Fluxo

```
oferta criada
  -> validada (IA lê o rótulo, confere a validade)
  -> casada com a ONG (3 melhores, prazo curto de aceite)
  -> missão de coleta aceita por um voluntário
  -> retirada confirmada no mercado (QR do lote)
  -> entrega confirmada na ONG (peso e condição)
  -> crédito emitido e registrado no ledger
```

Cada passo vira um evento imutável, encadeado por hash ao evento anterior.

## Como rodar

```bash
npm install
npm run dev
```

Abre em http://localhost:3000

Variáveis de ambiente: copie `.env.example` para `.env.local` e preencha.

## Stack

| Camada | Escolha |
|---|---|
| Front | Next.js 16, React 19, Tailwind 4, PWA |
| Banco | Supabase (Postgres, PostGIS, Auth, Storage, Realtime) |
| IA | Modelo multimodal para leitura de rótulo, com revisão humana |
| Mapa | Leaflet e OpenStreetMap |
| Deploy | Vercel |

## Estrutura

```
src/app/            rotas (doador, ong, voluntario, verificar)
src/lib/ledger.ts   cadeia de eventos com hash encadeado
docs/escopo.md      o que entra e o que fica de fora
docs/arquitetura.md modelo de dados e eventos
```

## Escopo

Ver [docs/escopo.md](docs/escopo.md). Resumo: um fluxo só, da oferta ao crédito emitido. Sem revenda, sem blockchain, sem pagamentos.

## Licença

MIT. Ver [LICENSE](LICENSE).
