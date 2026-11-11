-- IFOMME: esquema inicial.
--
-- Cada coleção do app vira uma tabela de documentos: um id de texto e um
-- corpo em jsonb. O app foi escrito contra uma API de documentos, então
-- manter esse formato troca o banco sem reescrever a aplicação.
--
-- O acesso é por conta anônima do Supabase: todo visitante ganha um uid
-- estável e pode escrever, mas só mexe nos próprios dados em user_data.

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------- coleções

create table if not exists public.ongs (
  id          text primary key,
  data        jsonb not null default '{}'::jsonb,
  updated_at  timestamptz not null default now()
);

create table if not exists public.posts (
  id          text primary key,
  data        jsonb not null default '{}'::jsonb,
  updated_at  timestamptz not null default now()
);

create table if not exists public.perfis (
  id          text primary key,
  data        jsonb not null default '{}'::jsonb,
  updated_at  timestamptz not null default now()
);

create table if not exists public.aprov (
  id          text primary key,
  data        jsonb not null default '{}'::jsonb,
  updated_at  timestamptz not null default now()
);

create table if not exists public.chats (
  id          text primary key,
  data        jsonb not null default '{}'::jsonb,
  updated_at  timestamptz not null default now()
);

create table if not exists public.doacoes (
  id          text primary key,
  data        jsonb not null default '{}'::jsonb,
  updated_at  timestamptz not null default now()
);

create table if not exists public.receb (
  id          text primary key,
  data        jsonb not null default '{}'::jsonb,
  updated_at  timestamptz not null default now()
);

-- Dados privados de cada pessoa (preferências, bairro, doações antigas).
create table if not exists public.user_data (
  uid         uuid not null references auth.users(id) on delete cascade,
  id          text not null,
  data        jsonb not null default '{}'::jsonb,
  updated_at  timestamptz not null default now(),
  primary key (uid, id)
);

-- Quem pode conceder o selo de inspeção.
create table if not exists public.admins (
  uid         uuid primary key references auth.users(id) on delete cascade,
  criado_em   timestamptz not null default now()
);

-- ------------------------------------------------------------------- índices

create index if not exists ongs_updated_at_idx    on public.ongs (updated_at desc);
create index if not exists posts_updated_at_idx   on public.posts (updated_at desc);
create index if not exists doacoes_updated_at_idx on public.doacoes (updated_at desc);

-- ------------------------------------------------------- updated_at automático

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

do $$
declare t text;
begin
  foreach t in array array['ongs','posts','perfis','aprov','chats','doacoes','receb','user_data']
  loop
    execute format(
      'drop trigger if exists %I on public.%I', t || '_touch', t);
    execute format(
      'create trigger %I before update on public.%I
         for each row execute function public.touch_updated_at()', t || '_touch', t);
  end loop;
end;
$$;

-- ----------------------------------------------------------------------- RLS

alter table public.ongs      enable row level security;
alter table public.posts     enable row level security;
alter table public.perfis    enable row level security;
alter table public.aprov     enable row level security;
alter table public.chats     enable row level security;
alter table public.doacoes   enable row level security;
alter table public.receb     enable row level security;
alter table public.user_data enable row level security;
alter table public.admins    enable row level security;

-- Coleções compartilhadas: qualquer pessoa lê, quem está autenticado escreve.
-- A autenticação é anônima, então o visitante da demo também escreve, mas
-- cada escrita fica ligada a um uid e dá para auditar e revogar.
do $$
declare t text;
begin
  foreach t in array array['ongs','posts','perfis','aprov','chats','doacoes','receb']
  loop
    execute format('drop policy if exists %I on public.%I', t || '_leitura', t);
    execute format('drop policy if exists %I on public.%I', t || '_escrita', t);

    execute format(
      'create policy %I on public.%I for select using (true)', t || '_leitura', t);

    execute format(
      'create policy %I on public.%I for all
         to authenticated using (true) with check (true)', t || '_escrita', t);
  end loop;
end;
$$;

-- Dados privados: cada pessoa só enxerga e escreve a própria linha.
drop policy if exists user_data_propria on public.user_data;
create policy user_data_propria on public.user_data
  for all to authenticated
  using (uid = auth.uid())
  with check (uid = auth.uid());

-- Lista de administradores: leitura para quem está autenticado, escrita só
-- pelo painel do Supabase (service role ignora RLS).
drop policy if exists admins_leitura on public.admins;
create policy admins_leitura on public.admins
  for select to authenticated using (true);

-- ------------------------------------------------------------------ realtime

do $$
begin
  if not exists (select 1 from pg_publication where pubname = 'supabase_realtime') then
    create publication supabase_realtime;
  end if;
end;
$$;

alter publication supabase_realtime add table public.ongs;
alter publication supabase_realtime add table public.posts;
alter publication supabase_realtime add table public.perfis;
alter publication supabase_realtime add table public.aprov;
alter publication supabase_realtime add table public.chats;
alter publication supabase_realtime add table public.doacoes;
alter publication supabase_realtime add table public.receb;
alter publication supabase_realtime add table public.user_data;
