import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/Reveal";
import { OpportunityCard } from "@/components/opportunity/OpportunityCard";
import { OpportunityFilters } from "@/components/opportunity/OpportunityFilters";
import { getOpportunities, getOpportunityFacets } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Opportunités",
  description:
    "Missions, consultances et conférences curatées pour les pionniers d'Afrique — vérifiées par l'équipe éditoriale AfriMentor.",
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function list(v: string | string[] | undefined): string[] {
  const raw = Array.isArray(v) ? v.join(",") : (v ?? "");
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export default async function OpportunitiesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;
  const selected = {
    kind: list(sp.type),
    sector: list(sp.secteur),
    place: list(sp.lieu),
  };

  const [opportunities, facets] = await Promise.all([
    getOpportunities(selected),
    getOpportunityFacets(),
  ]);

  return (
    <>
      {/* ---------- HERO SOMBRE ---------- */}
      <section className="relative overflow-hidden bg-indigo-deep text-ivory">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 25% 35%, rgba(201,162,39,0.10) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(139,58,31,0.13) 0%, transparent 50%)",
          }}
        />
        <Container className="relative z-10 py-16 sm:py-20 lg:py-24">
          <Reveal>
            <div className="mb-5 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-gold">
              <span className="h-px w-8 bg-gold" />
              Opportunités curatées
            </div>
            <h1 className="font-display text-4xl font-light leading-[1.05] tracking-tight sm:text-5xl lg:text-7xl">
              Des missions{" "}
              <em className="font-normal text-gold-soft">qui méritent</em> votre
              expertise.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-ivory-shadow/85 sm:text-lg">
              Notre équipe éditoriale identifie, vérifie et publie les
              opportunités pertinentes. Aucune transaction n&apos;a lieu sur
              AfriMentor : vous postulez directement auprès de
              l&apos;organisation émettrice.
            </p>
          </Reveal>
        </Container>
      </section>

      {/* ---------- LISTE ---------- */}
      <Container className="py-14 pb-24 sm:py-16">
        <div className="grid gap-10 lg:grid-cols-[260px_1fr]">
          <OpportunityFilters facets={facets} selected={selected} />

          <div>
            <p className="mb-6 text-sm text-ink-soft">
              <strong className="text-indigo">
                {opportunities.length} opportunité
                {opportunities.length > 1 ? "s" : ""}
              </strong>{" "}
              publiée{opportunities.length > 1 ? "s" : ""} et vérifiée
              {opportunities.length > 1 ? "s" : ""}
            </p>

            {opportunities.length === 0 ? (
              <div className="border border-dashed border-line bg-ivory-soft px-8 py-16 text-center">
                <h2 className="font-display text-2xl text-indigo">
                  Aucune opportunité
                </h2>
                <p className="mt-3 text-sm text-muted">
                  Aucune mission ne correspond à ces filtres.
                </p>
                <Link
                  href="/opportunites"
                  className="mt-5 inline-block rounded-sm border border-indigo px-5 py-2.5 text-[13px] font-medium text-indigo transition-colors hover:bg-indigo hover:text-ivory"
                >
                  Réinitialiser
                </Link>
              </div>
            ) : (
              <Stagger className="flex flex-col gap-5">
                {opportunities.map((o) => (
                  <StaggerItem key={o.id}>
                    <OpportunityCard opportunity={o} />
                  </StaggerItem>
                ))}
              </Stagger>
            )}
          </div>
        </div>
      </Container>
    </>
  );
}
