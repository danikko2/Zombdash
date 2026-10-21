-- Zombdash online setup: paste this whole file into Supabase → SQL Editor → New query → Run.
-- Safe to run more than once.

-- 1) Cloud saves: one row per player, only that player can read or change it
create table if not exists public.saves (
  user_id    uuid primary key references auth.users on delete cascade default auth.uid(),
  name       text not null check (char_length(name) between 1 and 16),
  data       jsonb not null,
  updated_at timestamptz not null default now(),
  constraint save_size check (pg_column_size(data) < 200000)
);
alter table public.saves enable row level security;
drop policy if exists "read own save"   on public.saves;
drop policy if exists "insert own save" on public.saves;
drop policy if exists "update own save" on public.saves;
create policy "read own save"   on public.saves for select using (auth.uid() = user_id);
create policy "insert own save" on public.saves for insert with check (auth.uid() = user_id);
create policy "update own save" on public.saves for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- 2) Scores: everyone can read, players can only add their own, with sanity checks against fake scores
create table if not exists public.scores (
  id         bigint generated always as identity primary key,
  user_id    uuid not null default auth.uid() references auth.users on delete cascade,
  name       text not null check (char_length(name) between 1 and 16),
  map        smallint not null check (map between 0 and 63),
  mode       text not null default 'f' check (mode in ('f','c')),
  diff       smallint not null check (diff between 0 and 2),
  wave       int not null check (wave between 2 and 500),
  kills      int not null check (kills >= 0 and kills <= wave * 300),
  survivor   smallint not null default 0 check (survivor between 0 and 63),
  start      int not null default 1 check (start >= 1 and start <= wave),
  secs       int not null check (secs >= (wave - start) * 5 and secs < 86400),
  created_at timestamptz not null default now()
);
alter table public.scores enable row level security;
drop policy if exists "anyone reads scores" on public.scores;
drop policy if exists "add own scores"      on public.scores;
create policy "anyone reads scores" on public.scores for select using (true);
create policy "add own scores"      on public.scores for insert with check (auth.uid() = user_id);
create index if not exists scores_board on public.scores (mode, diff, map, wave desc, kills desc);

-- custom maps made in the Map Workshop: map 63 plus the map's own id in cmap (added Oct 2026)
alter table public.scores add column if not exists cmap text;
alter table public.scores drop constraint if exists scores_cmap_ok;
alter table public.scores add constraint scores_cmap_ok check ((map = 63) = (cmap is not null) and (cmap is null or char_length(cmap) between 1 and 40));
create index if not exists scores_board_custom on public.scores (mode, diff, cmap, wave desc, kills desc) where cmap is not null;

-- no more than 30 scores per player per hour
create or replace function public.score_rate() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if (select count(*) from public.scores where user_id = new.user_id and created_at > now() - interval '1 hour') >= 30 then
    raise exception 'too many scores, slow down';
  end if;
  return new;
end $$;
drop trigger if exists score_rate on public.scores;
create trigger score_rate before insert on public.scores for each row execute function public.score_rate();

-- 3) Leaderboard: each player's best run per map + difficulty
-- (custom maps each get their own board: one row per player per custom map id)
create or replace view public.leaderboard with (security_invoker = true) as
select distinct on (user_id, mode, map, cmap, diff)
  user_id, name, mode, map, diff, wave, kills, survivor, created_at, cmap
from public.scores
order by user_id, mode, map, cmap, diff, wave desc, kills desc, created_at asc;
grant select on public.leaderboard to anon, authenticated;
