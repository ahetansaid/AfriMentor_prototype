"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";
import { DEFAULT_QUESTS, SESSION_COOKIE } from "@/lib/session";

const ONE_YEAR = 60 * 60 * 24 * 365;

const cookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  path: "/",
  maxAge: ONE_YEAR,
};

export interface InscriptionResult {
  ok: boolean;
  mode?: "demo" | "email-sent";
  errors?: Record<string, string>;
  message?: string;
}

/**
 * Inscription : envoie un lien magique si Supabase est configuré,
 * sinon ouvre une session démo locale et redirige vers le tableau de bord.
 */
export async function submitInscription(
  _prev: InscriptionResult | null,
  formData: FormData,
): Promise<InscriptionResult> {
  const prenom = String(formData.get("prenom") ?? "").trim();
  const nom = String(formData.get("nom") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const annee = String(formData.get("annee") ?? "").trim();
  const ville = String(formData.get("ville") ?? "").trim();
  const bio = String(formData.get("bio") ?? "").trim();

  const errors: Record<string, string> = {};
  if (!prenom) errors.prenom = "Indiquez votre prénom.";
  if (!nom) errors.nom = "Indiquez votre nom.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    errors.email = "Adresse email invalide.";
  const year = Number.parseInt(annee, 10);
  if (!annee || Number.isNaN(year) || year < 1930 || year > 1985)
    errors.annee = "Année de naissance entre 1930 et 1985.";
  if (!ville) errors.ville = "Indiquez votre ville.";

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }

  if (isSupabaseConfigured) {
    const supabase = await createClient();
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "";
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        data: { prenom, nom, ville, annee_naissance: annee, bio },
        emailRedirectTo: `${siteUrl}/auth/callback`,
      },
    });
    if (error) return { ok: false, message: error.message };
    return { ok: true, mode: "email-sent" };
  }

  // Mode démo
  const store = await cookies();
  store.set(
    SESSION_COOKIE,
    JSON.stringify({
      prenom,
      nom,
      email,
      ville,
      anneeNaissance: annee,
      bio,
      quests: DEFAULT_QUESTS,
    }),
    cookieOptions,
  );
  redirect("/tableau-de-bord");
}

export async function signOut() {
  if (isSupabaseConfigured) {
    const supabase = await createClient();
    await supabase.auth.signOut();
  } else {
    const store = await cookies();
    store.delete(SESSION_COOKIE);
  }
  redirect("/");
}

/** Bascule l'état d'une quête (0–6) du profil patrimonial. */
export async function toggleQuest(index: number) {
  if (index < 0 || index > 6) return;

  if (isSupabaseConfigured) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;
    const { data: profile } = await supabase
      .from("profiles")
      .select("quests")
      .eq("id", user.id)
      .single();
    const quests = Array.isArray(profile?.quests)
      ? [...(profile.quests as boolean[])]
      : [...DEFAULT_QUESTS];
    quests[index] = !quests[index];
    await supabase.from("profiles").update({ quests }).eq("id", user.id);
  } else {
    const store = await cookies();
    const raw = store.get(SESSION_COOKIE)?.value;
    if (!raw) return;
    const u = JSON.parse(raw) as { quests?: boolean[] };
    const quests = Array.isArray(u.quests)
      ? [...u.quests]
      : [...DEFAULT_QUESTS];
    quests[index] = !quests[index];
    store.set(
      SESSION_COOKIE,
      JSON.stringify({ ...u, quests }),
      cookieOptions,
    );
  }

  revalidatePath("/tableau-de-bord");
}
