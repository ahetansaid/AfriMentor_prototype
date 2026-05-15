-- =============================================================================
-- AfriMentor — schéma initial
-- Postgres / Supabase · Phase 1
--
-- Contenu :
--   1. Tables de contenu public (pionniers + enfants, articles, opportunités)
--   2. Tables de comptes (profiles) et d'interactions (follows, demandes, etc.)
--   3. Row Level Security (RLS) sur l'ensemble
--   4. Trigger de création de profil à l'inscription
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. CONTENU PUBLIC
-- -----------------------------------------------------------------------------

-- Profil patrimonial public d'un pionnier.
-- `user_id` est nul pour les profils seedés ; renseigné quand un compte le revendique.
create table public.pioneers (
  id            text primary key,                       -- slug
  user_id       uuid references auth.users on delete set null,
  name          text not null,
  prefix        text not null,
  sector        text not null,
  region        text not null,
  headline      text not null,
  long_bio      text not null default '',
  experience    int  not null default 0,
  status        text not null default '',
  availability  text not null default '',
  views         int  not null default 0,
  completion    int  not null default 0,
  photo_url     text,
  tags          text[] not null default '{}',
  fiertes       text[] not null default '{}',
  related_ids   text[] not null default '{}',
  legacy        text not null default '',
  stats         jsonb not null default '{}'::jsonb,
  published     boolean not null default true,
  created_at    timestamptz not null default now()
);

create table public.timeline_entries (
  id          uuid primary key default gen_random_uuid(),
  pioneer_id  text not null references public.pioneers on delete cascade,
  period      text not null,
  role        text not null,
  org         text not null,
  sort_order  int  not null default 0
);

create table public.capsules (
  id          uuid primary key default gen_random_uuid(),
  pioneer_id  text not null references public.pioneers on delete cascade,
  type        text not null,
  title       text not null,
  duration    text not null,
  sort_order  int  not null default 0
);

create table public.works (
  id          uuid primary key default gen_random_uuid(),
  pioneer_id  text not null references public.pioneers on delete cascade,
  year        text not null,
  title       text not null,
  meta        text not null,
  type        text not null,
  sort_order  int  not null default 0
);

create table public.testimonials (
  id          uuid primary key default gen_random_uuid(),
  pioneer_id  text not null references public.pioneers on delete cascade,
  text        text not null,
  author      text not null,
  role        text not null,
  sort_order  int  not null default 0
);

create table public.articles (
  id                 text primary key,                  -- slug
  author_pioneer_id  text not null references public.pioneers on delete cascade,
  sector             text not null,
  kind               text not null,
  read_time          text not null,
  article_date       text not null,
  reads              text not null default '0',
  title              text not null,
  excerpt            text not null,
  body               jsonb not null default '[]'::jsonb,  -- string[]
  published          boolean not null default true,
  created_at         timestamptz not null default now()
);

create table public.opportunities (
  id           text primary key,                        -- slug
  kind         text not null,
  sector       text not null,
  place        text not null,
  place_label  text not null,
  duration     text not null,
  title        text not null,
  org          text not null,
  deadline     text not null,
  description  text not null,
  tags         text[] not null default '{}',
  missions     text[] not null default '{}',
  profil       text[] not null default '{}',
  status       text not null default 'publié',
  created_at   timestamptz not null default now()
);

create index on public.pioneers (sector);
create index on public.timeline_entries (pioneer_id);
create index on public.capsules (pioneer_id);
create index on public.works (pioneer_id);
create index on public.testimonials (pioneer_id);
create index on public.articles (author_pioneer_id);
create index on public.opportunities (sector);

-- -----------------------------------------------------------------------------
-- 2. COMPTES & INTERACTIONS
-- -----------------------------------------------------------------------------

-- Étend auth.users. Une ligne par compte.
create table public.profiles (
  id                uuid primary key references auth.users on delete cascade,
  role              text not null default 'visiteur'
                      check (role in ('visiteur', 'pionnier', 'admin')),
  prenom            text not null default '',
  nom               text not null default '',
  ville             text not null default '',
  annee_naissance   text not null default '',
  bio               text not null default '',
  quests            jsonb not null default '[true,true,true,true,false,false,false]'::jsonb,
  created_at        timestamptz not null default now()
);

create table public.follows (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.profiles on delete cascade,
  pioneer_id  text not null references public.pioneers on delete cascade,
  created_at  timestamptz not null default now(),
  unique (user_id, pioneer_id)
);

create table public.mentorship_requests (
  id                  uuid primary key default gen_random_uuid(),
  requester_user_id   uuid references public.profiles on delete set null,
  pioneer_id          text not null references public.pioneers on delete cascade,
  type                text not null,
  message             text not null,
  dispo               text not null default '',
  format              text not null default '',
  status              text not null default 'envoyée'
                        check (status in ('envoyée', 'acceptée', 'déclinée', 'close')),
  created_at          timestamptz not null default now()
);

create table public.saved_opportunities (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references public.profiles on delete cascade,
  opportunity_id  text not null references public.opportunities on delete cascade,
  created_at      timestamptz not null default now(),
  unique (user_id, opportunity_id)
);

create index on public.follows (user_id);
create index on public.mentorship_requests (pioneer_id);
create index on public.mentorship_requests (requester_user_id);
create index on public.saved_opportunities (user_id);

-- -----------------------------------------------------------------------------
-- 3. ROW LEVEL SECURITY
-- -----------------------------------------------------------------------------

alter table public.pioneers          enable row level security;
alter table public.timeline_entries  enable row level security;
alter table public.capsules          enable row level security;
alter table public.works             enable row level security;
alter table public.testimonials      enable row level security;
alter table public.articles          enable row level security;
alter table public.opportunities     enable row level security;
alter table public.profiles          enable row level security;
alter table public.follows           enable row level security;
alter table public.mentorship_requests enable row level security;
alter table public.saved_opportunities enable row level security;

-- Contenu public : lecture ouverte à tous (publié uniquement) ; écriture
-- réservée au propriétaire du profil pionnier ou à un admin.
create policy "pioneers_public_read" on public.pioneers
  for select using (published = true);
create policy "pioneers_owner_write" on public.pioneers
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "timeline_public_read" on public.timeline_entries for select using (true);
create policy "capsules_public_read" on public.capsules for select using (true);
create policy "works_public_read" on public.works for select using (true);
create policy "testimonials_public_read" on public.testimonials for select using (true);
create policy "articles_public_read" on public.articles
  for select using (published = true);
create policy "opportunities_public_read" on public.opportunities
  for select using (status = 'publié');

-- Profils : chacun lit et modifie le sien. L'insertion passe par le trigger.
create policy "profiles_self_read" on public.profiles
  for select using (auth.uid() = id);
create policy "profiles_self_update" on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

-- Suivis : strictement propriétaire.
create policy "follows_owner_all" on public.follows
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Opportunités enregistrées : strictement propriétaire.
create policy "saved_opps_owner_all" on public.saved_opportunities
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Demandes de mentorat : le demandeur insère et lit les siennes ;
-- le pionnier destinataire lit celles qui le concernent.
create policy "mentorship_requester_insert" on public.mentorship_requests
  for insert with check (auth.uid() = requester_user_id);
create policy "mentorship_requester_read" on public.mentorship_requests
  for select using (auth.uid() = requester_user_id);
create policy "mentorship_pioneer_read" on public.mentorship_requests
  for select using (
    exists (
      select 1 from public.pioneers p
      where p.id = mentorship_requests.pioneer_id
        and p.user_id = auth.uid()
    )
  );

-- -----------------------------------------------------------------------------
-- 4. TRIGGER — création du profil à l'inscription
-- -----------------------------------------------------------------------------

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, prenom, nom, ville, annee_naissance, bio)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'prenom', ''),
    coalesce(new.raw_user_meta_data ->> 'nom', ''),
    coalesce(new.raw_user_meta_data ->> 'ville', ''),
    coalesce(new.raw_user_meta_data ->> 'annee_naissance', ''),
    coalesce(new.raw_user_meta_data ->> 'bio', '')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
