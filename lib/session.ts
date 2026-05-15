import { cookies } from "next/headers";
import { isSupabaseConfigured } from "./supabase/config";
import { createClient } from "./supabase/server";

/**
 * Session utilisateur normalisée.
 *
 * Deux sources possibles, transparentes pour les composants :
 *  - `supabase` : compte réel, authentifié par lien magique
 *  - `demo`     : session locale (cookie) quand Supabase n'est pas configuré,
 *                 pour garder l'application testable de bout en bout.
 */
export interface SessionUser {
  prenom: string;
  nom: string;
  email: string;
  ville: string;
  anneeNaissance: string;
  bio: string;
  quests: boolean[];
  source: "supabase" | "demo";
}

export const DEFAULT_QUESTS: boolean[] = [
  true,
  true,
  true,
  true,
  false,
  false,
  false,
];

export const SESSION_COOKIE = "am_session";

export async function getCurrentUser(): Promise<SessionUser | null> {
  if (isSupabaseConfigured) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;

    const { data: profile } = await supabase
      .from("profiles")
      .select("prenom, nom, ville, annee_naissance, bio, quests")
      .eq("id", user.id)
      .single();

    return {
      prenom: profile?.prenom ?? "",
      nom: profile?.nom ?? "",
      email: user.email ?? "",
      ville: profile?.ville ?? "",
      anneeNaissance: profile?.annee_naissance ?? "",
      bio: profile?.bio ?? "",
      quests: Array.isArray(profile?.quests)
        ? (profile.quests as boolean[])
        : DEFAULT_QUESTS,
      source: "supabase",
    };
  }

  // Mode démo — session locale stockée dans un cookie httpOnly.
  const store = await cookies();
  const raw = store.get(SESSION_COOKIE)?.value;
  if (!raw) return null;
  try {
    const u = JSON.parse(raw) as Partial<SessionUser>;
    return {
      prenom: u.prenom ?? "",
      nom: u.nom ?? "",
      email: u.email ?? "",
      ville: u.ville ?? "",
      anneeNaissance: u.anneeNaissance ?? "",
      bio: u.bio ?? "",
      quests: Array.isArray(u.quests) ? u.quests : DEFAULT_QUESTS,
      source: "demo",
    };
  } catch {
    return null;
  }
}
