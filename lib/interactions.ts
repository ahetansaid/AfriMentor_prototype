import { cookies } from "next/headers";
import { isSupabaseConfigured } from "./supabase/config";
import { createClient } from "./supabase/server";

/**
 * Couche d'accès aux interactions utilisateur (suivis, opportunités
 * enregistrées, demandes de mentorat). Comme la couche `queries`, elle
 * fonctionne en mode démo (cookies) tant que Supabase n'est pas configuré.
 */

export const FOLLOWS_COOKIE = "am_follows";
export const SAVED_OPPS_COOKIE = "am_saved_opps";
export const MENTORSHIP_COOKIE = "am_mentorship_requests";

export interface MentorshipRequest {
  id: string;
  pioneerId: string;
  pioneerName: string;
  type: string;
  message: string;
  dispo: string;
  format: string;
  status: string;
  createdAt: string;
}

async function readJSON<T>(name: string, fallback: T): Promise<T> {
  const store = await cookies();
  const raw = store.get(name)?.value;
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export async function getFollowedIds(): Promise<string[]> {
  if (isSupabaseConfigured) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return [];
    const { data } = await supabase
      .from("follows")
      .select("pioneer_id")
      .eq("user_id", user.id);
    return (data ?? []).map((r) => r.pioneer_id as string);
  }
  return readJSON<string[]>(FOLLOWS_COOKIE, []);
}

export async function getSavedOpportunityIds(): Promise<string[]> {
  if (isSupabaseConfigured) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return [];
    const { data } = await supabase
      .from("saved_opportunities")
      .select("opportunity_id")
      .eq("user_id", user.id);
    return (data ?? []).map((r) => r.opportunity_id as string);
  }
  return readJSON<string[]>(SAVED_OPPS_COOKIE, []);
}

export async function getMentorshipRequests(): Promise<MentorshipRequest[]> {
  if (isSupabaseConfigured) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return [];
    const { data } = await supabase
      .from("mentorship_requests")
      .select(
        "id, pioneer_id, type, message, dispo, format, status, created_at, pioneers(name)",
      )
      .eq("requester_user_id", user.id)
      .order("created_at", { ascending: false });
    return (data ?? []).map((r) => {
      const pioneer = r.pioneers as { name?: string } | null;
      return {
        id: String(r.id),
        pioneerId: String(r.pioneer_id),
        pioneerName: pioneer?.name ?? "",
        type: String(r.type ?? ""),
        message: String(r.message ?? ""),
        dispo: String(r.dispo ?? ""),
        format: String(r.format ?? ""),
        status: String(r.status ?? "envoyée"),
        createdAt: String(r.created_at ?? ""),
      };
    });
  }
  return readJSON<MentorshipRequest[]>(MENTORSHIP_COOKIE, []);
}
