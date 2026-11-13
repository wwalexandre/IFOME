-- IFOMME: esquema do banco D1.
--
-- Cada coleção do aplicativo é uma tabela de documentos: um id de texto e um
-- corpo em JSON. O aplicativo foi escrito contra uma API de documentos, e
-- manter esse formato foi o que permitiu trocar o banco sem reescrevê-lo.
--
-- Quem protege os dados não é o banco, é a função em functions/api: ela lê o
-- cookie da visita, decide o que a pessoa pode ver e nunca aceita um dono
-- vindo do cliente.
--
-- Aplicar com: npm run db:schema

create table if not exists ongs (
  id          text primary key,
  data        text not null default '{}',
  updated_at  integer not null default (unixepoch()*1000)
);

create table if not exists posts (
  id          text primary key,
  data        text not null default '{}',
  updated_at  integer not null default (unixepoch()*1000)
);

create table if not exists perfis (
  id          text primary key,
  data        text not null default '{}',
  updated_at  integer not null default (unixepoch()*1000)
);

create table if not exists aprov (
  id          text primary key,
  data        text not null default '{}',
  updated_at  integer not null default (unixepoch()*1000)
);

create table if not exists chats (
  id          text primary key,
  data        text not null default '{}',
  updated_at  integer not null default (unixepoch()*1000)
);

create table if not exists doacoes (
  id          text primary key,
  data        text not null default '{}',
  updated_at  integer not null default (unixepoch()*1000)
);

create table if not exists receb (
  id          text primary key,
  data        text not null default '{}',
  updated_at  integer not null default (unixepoch()*1000)
);

-- Dados privados de cada visitante. O uid vem do cookie, nunca do corpo da
-- requisição, então uma pessoa não alcança a linha de outra.
create table if not exists user_data (
  uid         text not null,
  id          text not null,
  data        text not null default '{}',
  updated_at  integer not null default (unixepoch()*1000),
  primary key (uid, id)
);

-- Quem pode inspecionar instituições e conceder o selo.
create table if not exists admins (
  uid         text primary key,
  criado_em   integer not null default (unixepoch()*1000)
);

create index if not exists ongs_atualizado  on ongs  (updated_at desc);
create index if not exists posts_atualizado on posts (updated_at desc);
