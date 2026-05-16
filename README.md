# AfriMentor — Prototype

Plateforme web pour **préserver, connecter et propulser** le patrimoine
intellectuel des pionniers d'Afrique. Reconstruction du prototype HTML en
application Next.js réaliste, testable et déployable sur Vercel.

## Stack

| Couche | Choix |
|---|---|
| Framework | Next.js 16 (App Router) + TypeScript |
| Style | Tailwind CSS v4 (design system éditorial-patrimonial) |
| Animations | Framer Motion (révélations au scroll, hero carousel) |
| Polices | Fraunces (titres) · Inter Tight (corps) |
| Images | next/image + Unsplash (avec repli SVG généré) |
| Backend | Supabase (Postgres + Auth lien magique + Storage) |
| Tests | Vitest |
| Hébergement | Vercel + Supabase Cloud |

## Démarrer

```bash
npm install
cp .env.local.example .env.local   # facultatif — voir ci-dessous
npm run dev                        # http://localhost:3000
```

> **Sans Supabase configuré**, l'application fonctionne avec le jeu de
> données local (`lib/data/seed.ts`) et un mode démo (session, suivis,
> demandes, opportunités enregistrées dans des cookies httpOnly). L'app est
> donc **immédiatement testable de bout en bout**, sur n'importe quel écran,
> sans projet Supabase.
> Renseigner `.env.local` active la persistance réelle et l'authentification
> par lien magique.

## Scripts

```bash
npm run dev          # serveur de développement
npm run build        # build de production
npm run start        # serveur de production
npm run lint         # ESLint
npm run test         # Vitest en mode watch
npm run test:run     # Vitest une seule fois (CI)
npm run db:seed-sql  # regénère supabase/seed.sql depuis lib/data/seed.ts
```

## Structure

```
app/              routes (App Router)
  actions/        server actions (auth, interactions)
  auth/callback   handler du lien magique Supabase
components/
  home/           HeroCarousel, Marquee
  layout/         Navbar (responsive), Footer
  ui/             Container, Portrait, Reveal, Stagger
  pioneer/        PioneerCard, FollowButton, DirectoryControls
  article/        ArticleCard
  opportunity/    OpportunityCard, OpportunityFilters, SaveOpportunityButton
  mentorship/     MentorRequestForm
  auth/           InscriptionForm
  dashboard/      QuestTracker
lib/
  supabase/       clients navigateur + serveur + helper proxy
  data/           jeu de données local (seed)
  portrait.ts     générateur de portraits SVG déterministes + couvertures
  queries.ts      couche d'accès aux données (Supabase ou seed)
  interactions.ts suivis, opportunités enregistrées, demandes de mentorat
  session.ts      utilisateur courant (Supabase ou cookie démo)
  types.ts        types métier
supabase/         migrations SQL + seed.sql (généré)
tests/            tests Vitest unitaires
proxy.ts          rafraîchissement de session + protection routes privées
```

## Déploiement

### 1. Vercel (front)

```bash
# Une seule fois — créer le projet sur Vercel
npx vercel link
# Ou via l'UI : importer le repo GitHub depuis vercel.com/new
```

L'application se déploie sans configuration : Vercel détecte Next.js, build,
et expose une URL `https://<projet>.vercel.app`. Chaque push sur une branche
crée un **preview deploy** automatique.

**Variables d'environnement** à renseigner (Settings → Environment Variables) :

| Variable | Quand | Valeur |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Toujours | URL publique du site (ex. `https://afrimentor.vercel.app`) |
| `NEXT_PUBLIC_SUPABASE_URL` | Quand Supabase | URL du projet Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Quand Supabase | Clé anonyme |
| `SUPABASE_SERVICE_ROLE_KEY` | Seed uniquement | Clé service-role (NE PAS exposer côté client) |

### 2. Supabase (backend)

```bash
# Installer la CLI Supabase
npm install -g supabase

# Lier le projet local au projet Supabase
supabase link --project-ref <votre-ref>

# Pousser le schéma + RLS
supabase db push

# Charger le jeu de données
psql <connection-string> -f supabase/seed.sql
# ou via le SQL Editor du dashboard Supabase
```

**Configuration Auth** dans le dashboard Supabase :

1. Authentication → Providers → activer **Email** (Magic Link)
2. Authentication → URL Configuration :
   - Site URL : `https://<projet>.vercel.app`
   - Redirect URLs : ajouter `https://<projet>.vercel.app/auth/callback`

Tant que Supabase n'est pas branché, l'app reste fonctionnelle en **mode démo**
(cookies httpOnly). Le passage est transparent : il suffit de renseigner les
variables d'environnement.

## Avancement

- [x] **Phase 0** — Scaffold Next.js, design system, fonts, clients Supabase
- [x] **Phase 1** — Schéma de données + RLS + seed (12 pionniers, 7 articles, 6 opportunités)
- [x] **Phase 2** — Écrans publics (accueil, annuaire, profils, fil éditorial, opportunités)
- [x] **Phase 3** — Auth lien magique, inscription, tableau de bord, quêtes
- [x] **Phase 4** — Interactions (suivis, demandes de mentorat, opportunités enregistrées)
- [x] **Refonte design moderne** — photos réelles, hero carousel, animations Framer Motion
- [x] **Phase 5** — Tests Vitest, accessibilité (skip link, focus visible), SEO (sitemap, robots, manifest, OG)
- [ ] **Phase 6** — Déploiement Vercel + branchement Supabase prod

---

Projet privé — Porto-Novo, Bénin.
