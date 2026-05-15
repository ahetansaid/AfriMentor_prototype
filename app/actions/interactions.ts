"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  FOLLOWS_COOKIE,
  MENTORSHIP_COOKIE,
  SAVED_OPPS_COOKIE,
  type MentorshipRequest,
} from "@/lib/interactions";
import { getPioneer } from "@/lib/queries";
import { getCurrentUser } from "@/lib/session";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

const cookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  path: "/",
  maxAge: 60 * 60 * 24 * 365,
};

async function readList(name: string): Promise<string[]> {
  const store = await cookies();
  const raw = store.get(name)?.value;
  if (!raw) return [];
  try {
    const v = JSON.parse(raw);
    return Array.isArray(v) ? v.map(String) : [];
  } catch {
    return [];
  }
}

// ---------------------------------------------------------------------------
// Suivis
// ---------------------------------------------------------------------------
export async function toggleFollow(pioneerId: string) {
  const user = await getCurrentUser();
  if (!user) redirect(`/inscription?next=/pionniers/${pioneerId}`);

  if (isSupabaseConfigured) {
    const supabase = await createClient();
    const {
      data: { user: au },
    } = await supabase.auth.getUser();
    if (!au) return;
    const { data: existing } = await supabase
      .from("follows")
      .select("id")
      .eq("user_id", au.id)
      .eq("pioneer_id", pioneerId)
      .maybeSingle();
    if (existing) {
      await supabase.from("follows").delete().eq("id", existing.id);
    } else {
      await supabase
        .from("follows")
        .insert({ user_id: au.id, pioneer_id: pioneerId });
    }
  } else {
    const store = await cookies();
    let list = await readList(FOLLOWS_COOKIE);
    list = list.includes(pioneerId)
      ? list.filter((id) => id !== pioneerId)
      : [...list, pioneerId];
    store.set(FOLLOWS_COOKIE, JSON.stringify(list), cookieOptions);
  }

  revalidatePath("/", "layout");
}

// ---------------------------------------------------------------------------
// Opportunités enregistrées
// ---------------------------------------------------------------------------
export async function toggleSavedOpportunity(opportunityId: string) {
  const user = await getCurrentUser();
  if (!user) redirect(`/inscription?next=/opportunites/${opportunityId}`);

  if (isSupabaseConfigured) {
    const supabase = await createClient();
    const {
      data: { user: au },
    } = await supabase.auth.getUser();
    if (!au) return;
    const { data: existing } = await supabase
      .from("saved_opportunities")
      .select("id")
      .eq("user_id", au.id)
      .eq("opportunity_id", opportunityId)
      .maybeSingle();
    if (existing) {
      await supabase
        .from("saved_opportunities")
        .delete()
        .eq("id", existing.id);
    } else {
      await supabase
        .from("saved_opportunities")
        .insert({ user_id: au.id, opportunity_id: opportunityId });
    }
  } else {
    const store = await cookies();
    let list = await readList(SAVED_OPPS_COOKIE);
    list = list.includes(opportunityId)
      ? list.filter((id) => id !== opportunityId)
      : [...list, opportunityId];
    store.set(SAVED_OPPS_COOKIE, JSON.stringify(list), cookieOptions);
  }

  revalidatePath("/", "layout");
}

// ---------------------------------------------------------------------------
// Demandes de mentorat
// ---------------------------------------------------------------------------
export interface MentorshipResult {
  ok: boolean;
  errors?: Record<string, string>;
  message?: string;
}

export async function submitMentorshipRequest(
  _prev: MentorshipResult | null,
  formData: FormData,
): Promise<MentorshipResult> {
  const pioneerId = String(formData.get("pioneerId") ?? "");
  const user = await getCurrentUser();
  if (!user) {
    redirect(`/inscription?next=/pionniers/${pioneerId}/mentorat`);
  }

  const type = String(formData.get("type") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();
  const dispo = String(formData.get("dispo") ?? "").trim();
  const format = String(formData.get("format") ?? "").trim();

  const errors: Record<string, string> = {};
  if (!type) errors.type = "Choisissez un type d'échange.";
  if (message.length < 40)
    errors.message =
      "Décrivez votre demande en au moins 40 caractères pour qu'elle soit utile.";
  if (Object.keys(errors).length > 0) return { ok: false, errors };

  const pioneer = await getPioneer(pioneerId);
  if (!pioneer) return { ok: false, message: "Pionnier introuvable." };

  if (isSupabaseConfigured) {
    const supabase = await createClient();
    const {
      data: { user: au },
    } = await supabase.auth.getUser();
    if (!au) return { ok: false, message: "Session expirée." };
    const { error } = await supabase.from("mentorship_requests").insert({
      requester_user_id: au.id,
      pioneer_id: pioneerId,
      type,
      message,
      dispo,
      format,
    });
    if (error) return { ok: false, message: error.message };
  } else {
    const store = await cookies();
    const raw = store.get(MENTORSHIP_COOKIE)?.value;
    let list: MentorshipRequest[] = [];
    try {
      list = raw ? (JSON.parse(raw) as MentorshipRequest[]) : [];
    } catch {
      list = [];
    }
    const newReq: MentorshipRequest = {
      id:
        typeof crypto !== "undefined" && crypto.randomUUID
          ? crypto.randomUUID()
          : Math.random().toString(36).slice(2),
      pioneerId,
      pioneerName: pioneer.name,
      type,
      message,
      dispo,
      format,
      status: "envoyée",
      createdAt: new Date().toISOString(),
    };
    list = [newReq, ...list].slice(0, 10);
    store.set(MENTORSHIP_COOKIE, JSON.stringify(list), cookieOptions);
  }

  redirect(`/pionniers/${pioneerId}/mentorat/envoyee`);
}
