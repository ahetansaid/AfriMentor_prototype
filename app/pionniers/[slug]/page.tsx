import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Portrait } from "@/components/ui/Portrait";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/Reveal";
import { FollowButton } from "@/components/pioneer/FollowButton";
import {
  getAllPioneerIds,
  getPioneer,
  getRelatedPioneers,
} from "@/lib/queries";
import { getFollowedIds } from "@/lib/interactions";

export async function generateStaticParams() {
  const ids = await getAllPioneerIds();
  return ids.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const pioneer = await getPioneer(slug);
  if (!pioneer) return { title: "Pionnier introuvable" };
  return {
    title: pioneer.name,
    description: pioneer.headline,
    openGraph: {
      title: pioneer.name,
      description: pioneer.headline,
      images: pioneer.photoUrl ? [pioneer.photoUrl] : undefined,
    },
  };
}

const SECTION_LABELS: Record<string, string> = {
  parcours: "Le parcours",
  fiertes: "Fiertés",
  capsules: "Capsules patrimoniales",
  oeuvres: "Œuvres référencées",
  temoignages: "Témoignages",
  heritage: "L'héritage",
};

export default async function PioneerProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const pioneer = await getPioneer(slug);
  if (!pioneer) notFound();

  const [related, followedIds] = await Promise.all([
    getRelatedPioneers(pioneer),
    getFollowedIds(),
  ]);
  const isFollowed = followedIds.includes(pioneer.id);

  const sections = [
    "parcours",
    ...(pioneer.fiertes.length ? ["fiertes"] : []),
    "capsules",
    "oeuvres",
    ...(pioneer.testimonials.length ? ["temoignages"] : []),
    ...(pioneer.legacy ? ["heritage"] : []),
  ];

  const hasPhoto = Boolean(pioneer.photoUrl);

  return (
    <>
      {/* ---------- HERO IMMERSIF ---------- */}
      <section className="relative min-h-[640px] overflow-hidden bg-indigo-deep text-ivory lg:min-h-[720px]">
        {/* Fond — photo (couleurs originales) ou pattern */}
        {hasPhoto ? (
          <div className="absolute inset-0">
            <Portrait
              seed={pioneer.id}
              photoUrl={pioneer.photoUrl}
              fill
              priority
              width={1600}
              height={900}
              alt={`Portrait de ${pioneer.name}`}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-indigo-deep via-indigo-deep/80 to-indigo-deep/30" />
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-deep/85 via-indigo-deep/40 to-indigo-deep/10 lg:from-indigo-deep/80 lg:via-indigo-deep/30 lg:to-transparent" />
          </div>
        ) : (
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(circle at 25% 30%, rgba(201,162,39,0.18) 0%, transparent 55%), radial-gradient(circle at 75% 70%, rgba(139,58,31,0.20) 0%, transparent 50%)",
            }}
          />
        )}

        {/* Fil d'Ariane */}
        <Container className="relative z-10 pt-7">
          <Link
            href="/pionniers"
            className="text-[13px] text-ivory/70 transition-colors hover:text-gold"
          >
            ← Annuaire des pionniers
          </Link>
        </Container>

        {/* Contenu */}
        <Container className="relative z-10 flex flex-col justify-end pb-14 pt-16 sm:pb-20 sm:pt-24 lg:min-h-[640px]">
          <Reveal>
            <div className="max-w-3xl">
              <div className="mb-5 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-gold">
                <span className="h-px w-8 bg-gold" />
                {pioneer.prefix} · {pioneer.sector} · {pioneer.region}
              </div>
              <h1 className="font-display text-4xl font-light leading-[1.05] tracking-tight sm:text-5xl lg:text-7xl">
                {pioneer.name}
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-relaxed text-ivory-shadow/90 sm:text-lg">
                {pioneer.long}
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="mt-10 grid grid-cols-2 gap-x-8 gap-y-5 border-t border-ivory/15 pt-7 sm:flex sm:flex-wrap sm:gap-x-12">
              <Attr label="Région" value={`${pioneer.region}, Bénin`} />
              <Attr label="Expérience" value={`${pioneer.experience} ans`} />
              <Attr label="Statut" value={pioneer.status} />
              <Attr label="Disponibilité" value={pioneer.availability} />
            </div>
          </Reveal>

          <Reveal delay={0.25}>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link
                href={`/pionniers/${pioneer.id}/mentorat`}
                className="group inline-flex items-center gap-3 rounded-sm bg-gold px-7 py-3.5 text-sm font-semibold tracking-wide text-indigo-deep transition-transform hover:-translate-y-0.5"
              >
                Demander un mentorat
                <span className="transition-transform group-hover:translate-x-1">
                  →
                </span>
              </Link>
              <Link
                href="/fil-editorial"
                className="rounded-sm border border-ivory/30 px-6 py-3.5 text-sm font-medium text-ivory transition-colors hover:bg-ivory hover:text-indigo-deep"
              >
                Lire ses publications
              </Link>
              <FollowButton
                pioneerId={pioneer.id}
                initialFollowed={isFollowed}
                variant="tool"
              />
            </div>
          </Reveal>

          {/* Barre de complétion en bas à droite, discrète */}
          <div className="mt-10 flex max-w-md items-center gap-3 sm:mt-12">
            <div className="h-1 flex-1 overflow-hidden rounded-full bg-ivory/15">
              <span
                className="block h-full bg-gradient-to-r from-gold to-terra"
                style={{ width: `${pioneer.completion}%` }}
              />
            </div>
            <span className="whitespace-nowrap text-[11px] font-semibold uppercase tracking-[0.1em] text-gold">
              Profil {pioneer.completion}% complété
            </span>
          </div>
        </Container>
      </section>

      {/* ---------- CORPS ---------- */}
      <Container className="py-16 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[200px_1fr_280px] lg:gap-16">
          {/* Table des matières */}
          <nav className="hidden lg:block lg:sticky lg:top-24 lg:self-start">
            <h2 className="mb-5 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">
              Le profil
            </h2>
            <ul className="space-y-1">
              {sections.map((key) => (
                <li key={key}>
                  <a
                    href={`#${key}`}
                    className="block border-l-2 border-transparent py-2 pl-4 text-[13.5px] text-ink-soft transition-colors hover:border-gold hover:text-indigo"
                  >
                    {SECTION_LABELS[key]}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contenu */}
          <div className="min-w-0">
            {/* Parcours */}
            <Reveal as="section" className="mb-16 scroll-mt-24">
              <div id="parcours" className="scroll-mt-24">
                <h2 className="mb-7 font-display text-3xl font-normal text-indigo">
                  Le parcours
                </h2>
                <div className="ml-2 border-l border-line pl-8">
                  {pioneer.timeline.map((t, i) => (
                    <div key={i} className="relative pb-8 last:pb-0">
                      <span className="absolute -left-[38px] top-1.5 h-3 w-3 rounded-full border-2 border-gold bg-ivory" />
                      <div className="mb-1.5 text-xs font-semibold tracking-wide text-terra">
                        {t.period}
                      </div>
                      <div className="font-display text-[19px] font-medium text-indigo">
                        {t.role}
                      </div>
                      <div className="text-[13px] italic text-muted">
                        {t.org}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            {/* Fiertés */}
            {pioneer.fiertes.length > 0 && (
              <Reveal as="section" className="mb-16 scroll-mt-24">
                <div id="fiertes" className="scroll-mt-24">
                  <h2 className="mb-7 font-display text-3xl font-normal text-indigo">
                    Fiertés
                  </h2>
                  {pioneer.fiertes.map((f, i) => (
                    <p
                      key={i}
                      className="mb-4 text-base leading-relaxed text-ink"
                    >
                      — {f}
                    </p>
                  ))}
                </div>
              </Reveal>
            )}

            {/* Capsules */}
            <Reveal as="section" className="mb-16 scroll-mt-24">
              <div id="capsules" className="scroll-mt-24">
                <h2 className="mb-7 font-display text-3xl font-normal text-indigo">
                  Capsules patrimoniales
                </h2>
                {pioneer.capsules.length > 0 ? (
                  <Stagger className="grid gap-5 sm:grid-cols-2">
                    {pioneer.capsules.map((c, i) => (
                      <StaggerItem key={i}>
                        <div className="group h-full border border-line bg-white p-6 transition-all hover:-translate-y-0.5 hover:border-gold hover:shadow-[0_15px_30px_rgba(15,27,47,0.08)]">
                          <div className="mb-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-terra">
                            {c.type}
                          </div>
                          <div className="mb-3.5 font-display text-lg font-medium leading-snug text-indigo">
                            {c.title}
                          </div>
                          <div className="text-xs text-muted">
                            {c.duration}
                          </div>
                        </div>
                      </StaggerItem>
                    ))}
                  </Stagger>
                ) : (
                  <EmptySection text="Ce pionnier n'a pas encore publié de capsule patrimoniale." />
                )}
              </div>
            </Reveal>

            {/* Œuvres */}
            <Reveal as="section" className="mb-16 scroll-mt-24">
              <div id="oeuvres" className="scroll-mt-24">
                <h2 className="mb-7 font-display text-3xl font-normal text-indigo">
                  Œuvres référencées
                </h2>
                {pioneer.works.length > 0 ? (
                  <div className="border-t border-line">
                    {pioneer.works.map((w, i) => (
                      <div
                        key={i}
                        className="group grid grid-cols-[70px_1fr_auto] items-center gap-5 border-b border-line py-5 transition-colors hover:bg-ivory-soft sm:grid-cols-[100px_1fr_auto]"
                      >
                        <div className="font-display text-2xl text-gold">
                          {w.year}
                        </div>
                        <div>
                          <div className="font-display text-base font-medium text-indigo">
                            {w.title}
                          </div>
                          <div className="text-[12.5px] italic text-muted">
                            {w.meta}
                          </div>
                        </div>
                        <div className="border border-terra-soft px-2.5 py-1 text-[10px] uppercase tracking-[0.1em] text-terra">
                          {w.type}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptySection text="Aucune œuvre référencée pour le moment." />
                )}
              </div>
            </Reveal>

            {/* Témoignages */}
            {pioneer.testimonials.length > 0 && (
              <Reveal as="section" className="mb-16 scroll-mt-24">
                <div id="temoignages" className="scroll-mt-24">
                  <h2 className="mb-7 font-display text-3xl font-normal text-indigo">
                    Témoignages des pairs
                  </h2>
                  {pioneer.testimonials.map((t, i) => (
                    <blockquote
                      key={i}
                      className="mb-4 border-l-[3px] border-gold bg-ivory-soft p-7"
                    >
                      <span className="font-display text-3xl leading-none text-gold">
                        “
                      </span>
                      <p className="mb-3 mt-2 font-display text-[17px] italic leading-snug text-ink">
                        {t.text}
                      </p>
                      <footer className="text-xs font-medium text-indigo">
                        {t.author}{" "}
                        <span className="font-normal italic text-muted">
                          — {t.role}
                        </span>
                      </footer>
                    </blockquote>
                  ))}
                </div>
              </Reveal>
            )}

            {/* Héritage */}
            {pioneer.legacy && (
              <Reveal as="section" className="scroll-mt-24">
                <div id="heritage" className="scroll-mt-24">
                  <h2 className="mb-7 font-display text-3xl font-normal text-indigo">
                    L&apos;héritage que je veux transmettre
                  </h2>
                  <p className="border-l-[3px] border-gold bg-ivory-soft p-7 font-display text-[19px] italic leading-relaxed text-indigo">
                    &laquo;&nbsp;{pioneer.legacy}&nbsp;&raquo;
                  </p>
                </div>
              </Reveal>
            )}
          </div>

          {/* Aside */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="mb-4 border border-line bg-ivory-soft p-7">
              <h2 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-terra">
                Activité du profil
              </h2>
              {Object.entries(pioneer.stats).map(([k, v]) => (
                <div
                  key={k}
                  className="flex justify-between py-2 text-[13px]"
                >
                  <span className="text-muted">{k}</span>
                  <span className="font-medium text-indigo">{v}</span>
                </div>
              ))}
              <Link
                href={`/pionniers/${pioneer.id}/mentorat`}
                className="mt-4 block bg-indigo py-3 text-center text-[13px] text-ivory transition-colors hover:bg-indigo-deep"
              >
                Demander un mentorat
              </Link>
            </div>
            {related.length > 0 && (
              <div className="border border-line bg-ivory-soft p-7">
                <h2 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-terra">
                  Profils proches
                </h2>
                <div className="space-y-1">
                  {related.map((r) => (
                    <Link
                      key={r.id}
                      href={`/pionniers/${r.id}`}
                      className="block py-1.5 text-[13px] font-medium text-indigo transition-colors hover:text-terra"
                    >
                      {r.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </Container>
    </>
  );
}

function Attr({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[10.5px] uppercase tracking-[0.1em] text-ivory/60">
        {label}
      </span>
      <span className="text-sm font-medium text-ivory">{value}</span>
    </div>
  );
}

function EmptySection({ text }: { text: string }) {
  return (
    <div className="border border-dashed border-line bg-ivory-soft px-7 py-7 text-center text-sm italic text-muted">
      {text}
    </div>
  );
}
