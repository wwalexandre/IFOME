# Ligar o banco de dados

São quatro passos. Leva uns 15 minutos, e a maior parte é esperar o projeto subir.

## 1. Criar o projeto

Em [supabase.com/dashboard](https://supabase.com/dashboard), **New project**.

- **Name:** `ifomme`
- **Region:** South America (São Paulo)
- **Database password:** gere uma e guarde no gerenciador de senhas. Ela não entra no repositório

O plano gratuito já dá conta da demo. O projeto leva alguns minutos para ficar pronto.

> Não use o projeto `antgravity`. Ele é o banco do site pessoal, com as tabelas `leads`, `visitas` e `mensagens_contato`.

## 2. Criar as tabelas

No painel, **SQL Editor**, cole e rode, nesta ordem:

1. o conteúdo de [`supabase/migrations/0001_schema.sql`](../supabase/migrations/0001_schema.sql)
2. o conteúdo de [`supabase/seed.sql`](../supabase/seed.sql)

O primeiro cria as tabelas, as políticas de RLS e a publicação de tempo real. O segundo popula as instituições e as publicações de exemplo.

## 3. Ligar a conta anônima

Em **Authentication**, **Sign In / Providers**, ative **Anonymous sign-ins**.

É isso que deixa o visitante da demo usar o app sem cadastro e, ao mesmo tempo, ter um `uid` estável, que é do que o RLS depende para separar os dados privados de cada pessoa.

## 4. Preencher a configuração

Em **Project Settings**, **API**, copie a **Project URL** e a **chave publicável**. Cole em [`public/config.js`](../public/config.js):

```js
window.IFOMME_CONFIG = {
  supabaseUrl: "https://SEU-PROJETO.supabase.co",
  supabaseKey: "sb_publishable_...",
};
```

A chave publicável nasce para ficar no navegador. Quem protege os dados é o RLS. **Nunca** coloque aqui a `service_role`.

## Conferir

```bash
npm run dev
```

Abra http://localhost:3000/prototipo.html. O aviso "Banco de dados indisponível" tem que sumir e as seis instituições têm que aparecer em "ONGs perto de você".

Para provar que o tempo real funciona, abra a mesma página em duas janelas, faça uma doação em uma e veja aparecer na outra sem recarregar. Esse é um bom trecho para o vídeo.

## Quem é inspetor

A tela de inspeção só abre para quem está na tabela `admins`. Para liberar alguém, pegue o `uid` da pessoa em **Authentication**, **Users**, e rode no SQL Editor:

```sql
insert into public.admins (uid) values ('COLE-O-UID-AQUI');
```

## Desenho das tabelas

Cada coleção do app é uma tabela com `id` de texto e `data` em jsonb. É um banco de documentos sobre o Postgres, escolhido de propósito: o aplicativo já falava a língua de documentos, e trocar o formato dos dados no meio de um hackathon custaria mais do que entrega.

| Tabela | Guarda |
|---|---|
| `ongs` | Instituições, com necessidades, horário e status de inspeção |
| `posts` | Mural de ações |
| `perfis` | Que papel cada pessoa escolheu |
| `aprov` | Pedidos de acesso aguardando a equipe |
| `chats` | Conversas entre doador e instituição |
| `doacoes` | Doações, agrupadas por quem doou |
| `receb` | Confirmações de recebimento |
| `user_data` | Dados privados de cada pessoa. RLS por `uid` |
| `admins` | Quem pode inspecionar |
