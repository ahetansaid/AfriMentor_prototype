/**
 * Génère `supabase/seed.sql` à partir de `lib/data/seed.ts`.
 * `lib/data/seed.ts` reste la source unique de vérité du contenu.
 *
 *   npm run db:seed-sql
 */
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { ARTICLES, OPPORTUNITIES, PIONEERS } from "../lib/data/seed";

/** Échappe une chaîne pour un littéral SQL. */
function s(value: string): string {
  return `'${value.replace(/'/g, "''")}'`;
}

/** Tableau Postgres text[], échappé pour un littéral SQL. */
function arr(values: string[]): string {
  if (values.length === 0) return "'{}'";
  const inner = values
    .map((v) => `"${v.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`)
    .join(",");
  // s() double les apostrophes et entoure de quotes — indispensable car
  // le contenu du tableau peut contenir des apostrophes (d'évaluation, etc.).
  return s(`{${inner}}`);
}

/** Littéral jsonb. */
function json(value: unknown): string {
  return `${s(JSON.stringify(value))}::jsonb`;
}

const lines: string[] = [
  "-- =============================================================================",
  "-- AfriMentor — données initiales (généré depuis lib/data/seed.ts)",
  "-- Ne pas éditer à la main : lancer `npm run db:seed-sql`.",
  "-- =============================================================================",
  "",
  "truncate table public.mentorship_requests, public.follows,",
  "  public.saved_opportunities, public.testimonials, public.works,",
  "  public.capsules, public.timeline_entries, public.articles,",
  "  public.opportunities, public.pioneers restart identity cascade;",
  "",
];

// --- Pionniers ---------------------------------------------------------------
lines.push("-- Pionniers");
for (const p of PIONEERS) {
  lines.push(
    `insert into public.pioneers (id, name, prefix, sector, region, headline, long_bio, experience, status, availability, views, completion, photo_url, tags, fiertes, related_ids, legacy, stats, published) values (` +
      `${s(p.id)}, ${s(p.name)}, ${s(p.prefix)}, ${s(p.sector)}, ${s(p.region)}, ` +
      `${s(p.headline)}, ${s(p.long)}, ${p.experience}, ${s(p.status)}, ${s(p.availability)}, ` +
      `${p.views}, ${p.completion}, ${p.photoUrl ? s(p.photoUrl) : "null"}, ` +
      `${arr(p.tags)}, ${arr(p.fiertes)}, ${arr(p.related)}, ${s(p.legacy)}, ${json(p.stats)}, true);`,
  );
}
lines.push("");

// --- Tables enfants ----------------------------------------------------------
lines.push("-- Parcours, capsules, œuvres, témoignages");
for (const p of PIONEERS) {
  p.timeline.forEach((t, i) => {
    lines.push(
      `insert into public.timeline_entries (pioneer_id, period, role, org, sort_order) values (` +
        `${s(p.id)}, ${s(t.period)}, ${s(t.role)}, ${s(t.org)}, ${i});`,
    );
  });
  p.capsules.forEach((c, i) => {
    lines.push(
      `insert into public.capsules (pioneer_id, type, title, duration, sort_order) values (` +
        `${s(p.id)}, ${s(c.type)}, ${s(c.title)}, ${s(c.duration)}, ${i});`,
    );
  });
  p.works.forEach((w, i) => {
    lines.push(
      `insert into public.works (pioneer_id, year, title, meta, type, sort_order) values (` +
        `${s(p.id)}, ${s(w.year)}, ${s(w.title)}, ${s(w.meta)}, ${s(w.type)}, ${i});`,
    );
  });
  p.testimonials.forEach((t, i) => {
    lines.push(
      `insert into public.testimonials (pioneer_id, text, author, role, sort_order) values (` +
        `${s(p.id)}, ${s(t.text)}, ${s(t.author)}, ${s(t.role)}, ${i});`,
    );
  });
}
lines.push("");

// --- Articles ----------------------------------------------------------------
lines.push("-- Articles");
for (const a of ARTICLES) {
  lines.push(
    `insert into public.articles (id, author_pioneer_id, sector, kind, read_time, article_date, reads, title, excerpt, body, published) values (` +
      `${s(a.id)}, ${s(a.authorId)}, ${s(a.sector)}, ${s(a.kind)}, ${s(a.read)}, ` +
      `${s(a.date)}, ${s(a.reads)}, ${s(a.title)}, ${s(a.excerpt)}, ${json(a.body)}, true);`,
  );
}
lines.push("");

// --- Opportunités ------------------------------------------------------------
lines.push("-- Opportunités");
for (const o of OPPORTUNITIES) {
  lines.push(
    `insert into public.opportunities (id, kind, sector, place, place_label, duration, title, org, deadline, description, tags, missions, profil, status) values (` +
      `${s(o.id)}, ${s(o.kind)}, ${s(o.sector)}, ${s(o.place)}, ${s(o.placeLabel)}, ${s(o.dur)}, ` +
      `${s(o.title)}, ${s(o.org)}, ${s(o.deadline)}, ${s(o.desc)}, ` +
      `${arr(o.tags)}, ${arr(o.missions)}, ${arr(o.profil)}, 'publié');`,
  );
}
lines.push("");

const out = join(process.cwd(), "supabase", "seed.sql");
writeFileSync(out, lines.join("\n"), "utf8");
console.log(
  `✓ supabase/seed.sql généré — ${PIONEERS.length} pionniers, ${ARTICLES.length} articles, ${OPPORTUNITIES.length} opportunités.`,
);
