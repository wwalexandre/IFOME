# Publicar e administrar

Tudo roda no Cloudflare, no plano gratuito. O endereço é `ifomme.pages.dev`, sem nome de pessoa.

## O que já existe

| Recurso | Nome | Identificador |
|---|---|---|
| Banco D1 | `ifomme` | `0334f39d-0e6d-450c-988d-52473bc47a51` |

O esquema e os dados de exemplo já foram aplicados no banco de produção.

## Publicar pela primeira vez

Uma vez só, autentique o wrangler. Ele abre o navegador e pede autorização na sua conta Cloudflare:

```bash
npx wrangler login
```

Depois:

```bash
npm run deploy
```

Na primeira execução ele pergunta o nome do projeto. Responda **ifomme**, que é o que dá o endereço `ifomme.pages.dev`.

## Publicar a cada mudança

Duas opções.

**Pelo terminal**, sempre que quiser:

```bash
npm run deploy
```

**Ligado ao GitHub**, para publicar sozinho a cada push: no painel da Cloudflare, em Workers & Pages, abra o projeto `ifomme`, vá em Settings, Builds, e conecte o repositório. Configure:

- Framework preset: nenhum
- Build command: deixe vazio
- Build output directory: `public`

Não há etapa de build. O site é estático e a API são funções, então a Cloudflare só precisa copiar os arquivos.

## Ligar o banco ao site

O arquivo `wrangler.toml` já declara a ligação, então o `npm run deploy` leva o banco junto. Se o projeto for criado pelo painel em vez do terminal, confirme em Settings, Bindings, que existe uma ligação D1 com:

- Variable name: `DB`
- D1 database: `ifomme`

Sem isso a API responde `503` e o aplicativo abre vazio.

## Mexer no banco

```bash
npx wrangler d1 execute ifomme --remote --command "select count(*) from ongs"
```

Sem `--remote` o comando vai para o banco local da sua máquina, que é o que o `npm run dev` usa.

Para repopular os dados de exemplo em produção:

```bash
npx wrangler d1 execute ifomme --remote --file=./db/seed.sql
```

## Quem é inspetor

A tela de inspeção só abre para quem está na tabela `admins`. Pegue o seu identificador abrindo `https://ifomme.pages.dev/api/me` no navegador e copie o campo `uid`. Depois:

```bash
npx wrangler d1 execute ifomme --remote --command "insert into admins (uid) values ('COLE-O-UID-AQUI')"
```

## Como a atualização automática funciona

O D1 não empurra mudança para o navegador, diferente de um banco com canal de tempo real. Em vez de abrir uma conexão permanente, o aplicativo pergunta a cada 3 segundos, numa única requisição, qual a versão de cada coleção, e só busca de novo a que mudou.

Na prática: uma doação feita numa janela aparece na outra em até 3 segundos, sem recarregar. O custo é uma consulta de contagem por coleção a cada 3 segundos, por aba aberta. Para a escala de uma demonstração isso é barato, e evita a complexidade de manter conexão aberta.

Se o volume crescer, o caminho é trocar o relógio por Durable Objects com WebSocket, sem mexer no aplicativo: quem muda é só o adaptador em `public/ifomme-db.js`.
