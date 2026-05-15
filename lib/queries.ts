import { ARTICLES, OPPORTUNITIES, PIONEERS } from "@/lib/data/seed";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import type { Article, Opportunity, Pioneer, Sector } from "@/lib/types";

/**
 * Couche d'accès aux données.
 *
 * Tant que Supabase n'est pas configuré, tout est servi depuis `seed.ts`.
 * Les fonctions sont `async` dès maintenant pour que le branchement vers
 * Supabase (Phase 6) soit transparent côté composants — aucun changement
 * d'appel à prévoir.
 */

// ----------------------------------------------------------------------------
// Pionniers
// ----------------------------------------------------------------------------

export interface PioneerQuery {
  sector?: Sector | "Tous";
  search?: string;
  sort?: "relevance" | "experience" | "name" | "views";
}

export async function getPioneers(
  query: PioneerQuery = {},
): Promise<Pioneer[]> {
  if (isSupabaseConfigured) {
    // Phase 6 — requête Supabase. Repli sur le seed en attendant.
  }

  const { sector = "Tous", search = "", sort = "relevance" } = query;
  const q = search.toLowerCase().trim();

  let list = PIONEERS.filter((p) => {
    if (sector !== "Tous" && p.sector !== sector) return false;
    if (!q) return true;
    const haystack = [
      p.name,
      p.headline,
      p.sector,
      p.region,
      p.long,
      ...p.tags,
    ]
      .join(" ")
      .toLowerCase();
    return q.split(/\s+/).every((token) => haystack.includes(token));
  });

  list = [...list];
  if (sort === "experience") list.sort((a, b) => b.experience - a.experience);
  else if (sort === "name") list.sort((a, b) => a.name.localeCompare(b.name, "fr"));
  else if (sort === "views") list.sort((a, b) => b.views - a.views);

  return list;
}

export async function getPioneer(id: string): Promise<Pioneer | null> {
  return PIONEERS.find((p) => p.id === id) ?? null;
}

export async function getFeaturedPioneers(): Promise<Pioneer[]> {
  const ids = ["cecile", "mathias", "henriette"];
  return ids
    .map((id) => PIONEERS.find((p) => p.id === id))
    .filter((p): p is Pioneer => Boolean(p));
}

export async function getRelatedPioneers(
  pioneer: Pioneer,
): Promise<Pioneer[]> {
  return pioneer.related
    .map((id) => PIONEERS.find((p) => p.id === id))
    .filter((p): p is Pioneer => Boolean(p));
}

export async function getAllPioneerIds(): Promise<string[]> {
  return PIONEERS.map((p) => p.id);
}

// ----------------------------------------------------------------------------
// Articles
// ----------------------------------------------------------------------------

export async function getArticles(): Promise<Article[]> {
  return ARTICLES;
}

export async function getArticle(id: string): Promise<Article | null> {
  return ARTICLES.find((a) => a.id === id) ?? null;
}

export async function getAllArticleIds(): Promise<string[]> {
  return ARTICLES.map((a) => a.id);
}

// ----------------------------------------------------------------------------
// Opportunités
// ----------------------------------------------------------------------------

export interface OpportunityQuery {
  kind?: string[];
  sector?: string[];
  place?: string[];
}

export async function getOpportunities(
  query: OpportunityQuery = {},
): Promise<Opportunity[]> {
  const { kind = [], sector = [], place = [] } = query;
  return OPPORTUNITIES.filter((o) => {
    if (kind.length && !kind.includes(o.kind)) return false;
    if (sector.length && !sector.includes(o.sector)) return false;
    if (place.length && !place.includes(o.place)) return false;
    return true;
  });
}

export async function getOpportunity(
  id: string,
): Promise<Opportunity | null> {
  return OPPORTUNITIES.find((o) => o.id === id) ?? null;
}

export async function getAllOpportunityIds(): Promise<string[]> {
  return OPPORTUNITIES.map((o) => o.id);
}

/** Facettes distinctes pour les filtres d'opportunités. */
export async function getOpportunityFacets(): Promise<{
  kinds: string[];
  sectors: string[];
  places: string[];
}> {
  return {
    kinds: [...new Set(OPPORTUNITIES.map((o) => o.kind))],
    sectors: [...new Set(OPPORTUNITIES.map((o) => o.sector))],
    places: [...new Set(OPPORTUNITIES.map((o) => o.place))],
  };
}
