import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/Reveal";
import { HeroCarousel } from "@/components/home/HeroCarousel";
import { Marquee } from "@/components/home/Marquee";
import { PioneerCard } from "@/components/pioneer/PioneerCard";
import { Portrait } from "@/components/ui/Portrait";
import {
  getArticles,
  getFeaturedPioneers,
  getPioneers,
} from "@/lib/queries";
import { getFollowedIds } from "@/lib/interactions";

const PILLARS = [
  {
    num: "01",
    name: "Préserver",
    desc: "Profils enrichis, capsules vidéo et audio, œuvres référencées. Chaque pionnier construit son coffre-fort patrimonial avec un Portrait PDF exportable.",
  },
  {
    num: "02",
    name: "Connecter",
    desc: "Mentorat hybride à trois niveaux d'engagement. De la mise en relation simple au cycle structuré avec attestation finale.",
  },
  {
    num: "03",
    name: "Propulser",
    desc: "Une scène éditoriale digne pour s'exprimer, des opportunités curatées, une visibilité publique optimisée.",
  },
  {
    num: "04",
    name: "Transmettre",
    desc: "Un corpus pédagogique progressivement exploitable par les universités africaines, avec rémunération des pionniers créateurs.",
  },
];

const PARTNERS = [
  "OMS Bénin",
  "PNUD",
  "UEMOA",
  "Université d'Abomey-Calavi",
  "Présence Africaine",
  "Karthala Éditions",
  "Ministère de la Santé",
  "INRAB",
  "BCEAO",
];

export default async function HomePage() {
  const [allPioneers, featured, articles, followedIds] = await Promise.all([
    getPioneers(),
    getFeaturedPioneers(),
    getArticles(),
    getFollowedIds(),
  ]);
  const followedSet = new Set(followedIds);

  // Carrousel — 3 pionniers avec photos
  const heroPioneers = allPioneers.filter((p) => p.photoUrl).slice(0, 3);

  // Grille 2×2 — 4 pionniers (priorité aux profils 100 %)
  const gridPioneers = [
    ...allPioneers.filter((p) => p.completion === 100),
    ...allPioneers.filter((p) => p.completion < 100),
  ].slice(0, 4);

  // Témoignages — extraits des deux profils les plus complets
  const testimonialPioneers = featured.filter(
    (p) => p.testimonials.length > 0,
  );

  const totalCapsules = allPioneers.reduce(
    (n, p) => n + p.capsules.length,
    0,
  );
  const mainArticle = articles[0];
  const sideArticles = articles.slice(1, 4);

  return (
    <>
      {/* ---------- 1. HERO CAROUSEL ---------- */}
      <HeroCarousel pioneers={heroPioneers} />

      {/* ---------- 2. BANDEAU CHIFFRES ---------- */}
      <section className="border-b border-line bg-ivory-soft">
        <Container className="grid grid-cols-1 divide-y divide-line py-10 sm:grid-cols-3 sm:divide-x sm:divide-y-0 sm:py-0">
          <Stat n={allPioneers.length} label="pionniers référencés" />
          <Stat n={totalCapsules} label="capsules patrimoniales" />
          <Stat n={8} label="secteurs couverts" />
        </Container>
      </section>

      {/* ---------- 3. PILIERS ---------- */}
      <section className="bg-white py-24 lg:py-28">
        <Container>
          <Reveal>
            <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-terra">
              Quatre piliers
            </p>
            <h2 className="mb-14 max-w-3xl font-display text-3xl font-normal tracking-tight text-indigo sm:text-5xl">
              Une architecture pensée pour{" "}
              <em className="font-medium text-gold">la transmission durable</em>
              .
            </h2>
          </Reveal>
          <Stagger className="grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-4">
            {PILLARS.map((p) => (
              <StaggerItem
                key={p.num}
                className="group relative overflow-hidden bg-white p-8 transition-colors hover:bg-ivory lg:p-10"
              >
                <div className="mb-7 flex items-baseline gap-3">
                  <span className="font-display text-3xl font-light text-gold transition-transform group-hover:-translate-y-1">
                    {p.num}
                  </span>
                  <span className="h-px flex-1 bg-line transition-colors group-hover:bg-gold" />
                </div>
                <h3 className="mb-4 font-display text-2xl font-normal text-indigo">
                  {p.name}
                </h3>
                <p className="text-[14.5px] leading-relaxed text-ink-soft">
                  {p.desc}
                </p>
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </section>

      {/* ---------- 4. PIONNIERS — GRILLE 2×2 ---------- */}
      <section className="bg-ivory py-24 lg:py-28">
        <Container>
          <div className="mb-14 flex flex-wrap items-end justify-between gap-6">
            <Reveal>
              <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-terra">
                Voix de pionniers
              </p>
              <h2 className="font-display text-3xl font-normal tracking-tight text-indigo sm:text-5xl">
                Quatre figures qui transmettent.
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <Link
                href="/pionniers"
                className="group inline-flex items-center gap-3 border-b border-indigo pb-1 text-sm font-medium text-indigo"
              >
                Tous les pionniers
                <span className="transition-transform group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </Reveal>
          </div>
          <Stagger className="grid gap-6 sm:grid-cols-2 lg:gap-8">
            {gridPioneers.map((p) => (
              <StaggerItem key={p.id}>
                <PioneerCard pioneer={p} isFollowed={followedSet.has(p.id)} />
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </section>

      {/* ---------- 5. TÉMOIGNAGES ---------- */}
      {testimonialPioneers.length > 0 && (
        <section className="bg-ivory-soft py-24 lg:py-28">
          <Container>
            <Reveal>
              <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-terra">
                Témoignages
              </p>
              <h2 className="mb-14 max-w-3xl font-display text-3xl font-normal tracking-tight text-indigo sm:text-5xl">
                Ce que les pairs <em className="font-medium text-gold">disent d&apos;eux</em>.
              </h2>
            </Reveal>
            <Stagger className="grid gap-8 lg:grid-cols-2">
              {testimonialPioneers.slice(0, 2).map((p) => {
                const t = p.testimonials[0];
                return (
                  <StaggerItem
                    key={p.id}
                    className="border border-line bg-white p-8 lg:p-10"
                  >
                    <span className="font-display text-5xl leading-none text-gold">
                      “
                    </span>
                    <p className="mt-3 font-display text-xl font-light italic leading-snug text-indigo sm:text-2xl">
                      {t.text}
                    </p>
                    <div className="mt-7 flex items-center gap-4 border-t border-line pt-6">
                      <Link
                        href={`/pionniers/${p.id}`}
                        className="h-12 w-12 shrink-0 overflow-hidden rounded-full bg-ivory-shadow"
                      >
                        <Portrait
                          seed={p.id}
                          photoUrl={p.photoUrl}
                          width={48}
                          height={48}
                          alt={p.name}
                        />
                      </Link>
                      <div>
                        <div className="text-sm font-medium text-indigo">
                          {t.author}
                        </div>
                        <div className="text-xs italic text-muted">
                          {t.role} · à propos de {p.name.split(" ").slice(-2).join(" ")}
                        </div>
                      </div>
                    </div>
                  </StaggerItem>
                );
              })}
            </Stagger>
          </Container>
        </section>
      )}

      {/* ---------- 6. FIL ÉDITORIAL ---------- */}
      {mainArticle && (
        <section className="border-y border-line bg-white py-24 lg:py-28">
          <Container>
            <Reveal>
              <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-terra">
                Le fil éditorial
              </p>
              <h2 className="mb-14 font-display text-3xl font-normal tracking-tight text-indigo sm:text-5xl">
                Ce que <em className="font-medium text-gold">les pionniers</em>{" "}
                écrivent.
              </h2>
            </Reveal>
            <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:gap-20">
              <Reveal delay={0.1}>
                <div className="mb-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-terra">
                  {mainArticle.kind} — {mainArticle.sector}
                </div>
                <Link href={`/fil-editorial/${mainArticle.id}`}>
                  <h3 className="font-display text-3xl font-normal leading-tight text-indigo transition-colors hover:text-terra sm:text-[2.5rem]">
                    {mainArticle.title}
                  </h3>
                </Link>
                <p className="mt-5 text-[17px] leading-relaxed text-ink-soft">
                  {mainArticle.excerpt}
                </p>
                <Link
                  href={`/fil-editorial/${mainArticle.id}`}
                  className="mt-7 inline-flex items-center gap-3 rounded-sm bg-indigo px-6 py-3 text-sm font-medium text-ivory transition-colors hover:bg-indigo-deep"
                >
                  Lire l&apos;article →
                </Link>
              </Reveal>
              <div>
                <Reveal>
                  <h4 className="mb-6 text-[11px] font-semibold uppercase tracking-[0.12em] text-terra">
                    À lire également
                  </h4>
                </Reveal>
                <Stagger className="flex flex-col">
                  {sideArticles.map((a) => (
                    <StaggerItem key={a.id}>
                      <Link
                        href={`/fil-editorial/${a.id}`}
                        className="group block border-b border-line py-6 first:pt-0 last:border-0"
                      >
                        <div className="mb-2 text-[11px] uppercase tracking-[0.1em] text-muted">
                          {a.kind} — {a.read}
                        </div>
                        <h4 className="font-display text-[19px] font-medium leading-snug text-indigo transition-colors group-hover:text-terra">
                          {a.title}
                        </h4>
                      </Link>
                    </StaggerItem>
                  ))}
                </Stagger>
              </div>
            </div>
          </Container>
        </section>
      )}

      {/* ---------- 7. PARTENAIRES — MARQUEE ---------- */}
      <Marquee items={PARTNERS} />

      {/* ---------- 8. MANIFESTE / CTA ---------- */}
      <section className="relative overflow-hidden bg-indigo py-28 text-ivory lg:py-32">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 50%, rgba(201,162,39,0.10) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(139,58,31,0.12) 0%, transparent 50%)",
          }}
        />
        <Container>
          <Reveal>
            <div className="relative max-w-4xl">
              <p className="mb-8 text-xs font-semibold uppercase tracking-[0.2em] text-gold">
                Notre engagement
              </p>
              <p className="font-display text-2xl font-light leading-snug tracking-tight sm:text-4xl lg:text-[2.6rem]">
                AfriMentor est et restera gratuit pour les pionniers et les
                jeunes professionnels. Préserver le patrimoine intellectuel de
                l&apos;Afrique{" "}
                <em className="font-normal text-gold-soft">
                  n&apos;est pas un projet
                </em>{" "}
                : c&apos;est un devoir.
              </p>
              <div className="mt-12 flex flex-wrap items-center gap-4">
                <Link
                  href="/inscription"
                  className="rounded-sm bg-gold px-7 py-4 text-sm font-semibold tracking-wide text-indigo-deep transition-transform hover:-translate-y-0.5"
                >
                  Rejoindre la communauté
                </Link>
                <Link
                  href="/pionniers"
                  className="rounded-sm border border-ivory/30 px-6 py-4 text-sm font-medium text-ivory transition-colors hover:bg-ivory hover:text-indigo-deep"
                >
                  Explorer l&apos;annuaire
                </Link>
              </div>
              <div className="mt-12 text-[13px] uppercase tracking-[0.08em] text-gold">
                — Drwintech SaaS Solutions, Porto-Novo · Avril 2026
              </div>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}

function Stat({ n, label }: { n: number; label: string }) {
  return (
    <div className="px-4 py-6 text-center sm:px-8 sm:py-10 sm:text-left">
      <span className="block font-display text-4xl font-light leading-none text-indigo sm:text-5xl">
        {n}
      </span>
      <span className="mt-2 block text-xs uppercase tracking-[0.12em] text-muted">
        {label}
      </span>
    </div>
  );
}
