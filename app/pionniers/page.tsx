import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/Reveal";
import { DirectoryControls } from "@/components/pioneer/DirectoryControls";
import { PioneerCard } from "@/components/pioneer/PioneerCard";
import { getPioneers, type PioneerQuery } from "@/lib/queries";
import { getFollowedIds } from "@/lib/interactions";

export const metadata: Metadata = {
  title: "Annuaire des pionniers",
  description:
    "Explorez l'annuaire curaté des pionniers d'Afrique francophone — filtrez par secteur, recherchez par expertise.",
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function first(v: string | string[] | undefined): string | undefined {
  return Array.isArray(v) ? v[0] : v;
}

export default async function DirectoryPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;
  const sector = first(sp.secteur) ?? "Tous";
  const search = first(sp.q) ?? "";
  const sort = first(sp.tri) ?? "relevance";

  const [pioneers, followedIds] = await Promise.all([
    getPioneers({
      sector: sector as PioneerQuery["sector"],
      search,
      sort: sort as PioneerQuery["sort"],
    }),
    getFollowedIds(),
  ]);
  const followedSet = new Set(followedIds);

  const hasQuery = search.trim() !== "" || sector !== "Tous";

  return (
    <>
      {/* ---------- HERO SOMBRE ---------- */}
      <section className="relative overflow-hidden bg-indigo-deep text-ivory">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 40%, rgba(201,162,39,0.10) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(139,58,31,0.14) 0%, transparent 50%)",
          }}
        />
        <Container className="relative z-10 py-16 sm:py-20 lg:py-24">
          <Reveal>
            <div className="mb-5 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-gold">
              <span className="h-px w-8 bg-gold" />
              L&apos;annuaire AfriMentor
            </div>
            <h1 className="font-display text-4xl font-light leading-[1.05] tracking-tight sm:text-5xl lg:text-7xl">
              Les pionniers,{" "}
              <em className="font-normal text-gold-soft">
                une mémoire vivante
              </em>
              .
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-ivory-shadow/85 sm:text-lg">
              Explorez l&apos;annuaire curaté des pionniers d&apos;Afrique
              francophone. Filtrez par secteur, recherchez en langage naturel —
              chaque profil est une porte d&apos;entrée vers un parcours
              singulier.
            </p>
          </Reveal>
        </Container>
      </section>

      {/* ---------- CONTRÔLES ---------- */}
      <section className="border-b border-line bg-white py-10 sm:py-12">
        <Container>
          <DirectoryControls sector={sector} search={search} sort={sort} />
        </Container>
      </section>

      {/* ---------- GRILLE ---------- */}
      <Container className="py-12 pb-24 sm:py-14">
        <div className="mb-8 flex flex-wrap items-baseline justify-between gap-3 text-sm text-ink-soft">
          <span>
            <strong className="text-indigo">
              {pioneers.length} pionnier{pioneers.length > 1 ? "s" : ""}
            </strong>{" "}
            {hasQuery
              ? "correspondent à votre recherche"
              : "référencés dans l'annuaire"}
          </span>
          {hasQuery && (
            <Link
              href="/pionniers"
              className="text-[13px] text-terra hover:underline"
            >
              Réinitialiser
            </Link>
          )}
        </div>

        {pioneers.length === 0 ? (
          <div className="border border-dashed border-line bg-ivory-soft px-8 py-20 text-center">
            <h2 className="font-display text-2xl text-indigo">
              Aucun pionnier trouvé
            </h2>
            <p className="mx-auto mt-3 max-w-md text-sm text-muted">
              Aucun profil ne correspond à ces critères. Essayez un autre
              secteur ou élargissez votre recherche.
            </p>
            <Link
              href="/pionniers"
              className="mt-5 inline-block rounded-sm border border-indigo px-5 py-2.5 text-[13px] font-medium text-indigo transition-colors hover:bg-indigo hover:text-ivory"
            >
              Réinitialiser la recherche
            </Link>
          </div>
        ) : (
          <Stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {pioneers.map((p) => (
              <StaggerItem key={p.id}>
                <PioneerCard
                  pioneer={p}
                  isFollowed={followedSet.has(p.id)}
                />
              </StaggerItem>
            ))}
          </Stagger>
        )}
      </Container>
    </>
  );
}
