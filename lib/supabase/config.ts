/**
 * Détecte si Supabase est configuré (variables d'environnement présentes).
 * Tant que ce n'est pas le cas, la couche données (`lib/queries.ts`) utilise
 * le jeu de données local `lib/data/seed.ts` — l'application reste donc
 * entièrement testable hors-ligne, sans projet Supabase.
 */
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

export const isSupabaseConfigured =
  SUPABASE_URL.length > 0 && SUPABASE_ANON_KEY.length > 0;
