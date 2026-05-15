import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { SaveOpportunityButton } from "@/components/opportunity/SaveOpportunityButton";
import { getAllOpportunityIds, getOpportunity } from "@/lib/queries";
import { getSavedOpportunityIds } from "@/lib/interactions";

export async function generateStaticParams() {
  const ids = await getAllOpportunityIds();
  return ids.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const o = await getOpportunity(slug);
  if (!o) return { title: "Opportunité introuvable" };
  return {
    title: o.title,
    description: o.desc,
    openGraph: { title: o.title, description: o.desc },
  };
}

export default async function OpportunityDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const o = await getOpportunity(slug);
  if (!o) notFound();

  const savedIds = await getSavedOpportunityIds();
  const isSaved = savedIds.includes(o.id);

  return (
    <Container className="py-6 pb-24">
      <Link
        href="/opportunites"
        className="text-[13px] text-terra hover:underline"
      >
        ← Toutes les opportunités
      </Link>

      <div className="mt-8 grid gap-12 lg:grid-cols-[1fr_320px] lg:gap-14">
        <div>
          <div className="mb-3.5 text-[11px] font-semibold uppercase tracking-wide text-terra">
            {o.kind} · {o.sector}
          </div>
          <h1 className="font-display text-3xl font-normal leading-tight text-indigo sm:text-[2.6rem]">
            {o.title}
          </h1>
          <p className="mt-3 text-[15px] italic text-muted">{o.org}</p>
          <p className="mt-6 text-[15.5px] leading-relaxed text-ink">
            {o.desc}
          </p>

          <h2 className="mb-3.5 mt-8 font-display text-xl font-medium text-indigo">
            La mission
          </h2>
          <ul className="list-disc space-y-2 pl-5 text-[15.5px] leading-relaxed text-ink">
            {o.missions.map((m, i) => (
              <li key={i}>{m}</li>
            ))}
          </ul>

          <h2 className="mb-3.5 mt-8 font-display text-xl font-medium text-indigo">
            Profil recherché
          </h2>
          <ul className="list-disc space-y-2 pl-5 text-[15.5px] leading-relaxed text-ink">
            {o.profil.map((m, i) => (
              <li key={i}>{m}</li>
            ))}
          </ul>

          <h2 className="mb-3.5 mt-8 font-display text-xl font-medium text-indigo">
            Modalités
          </h2>
          <p className="text-[15.5px] leading-relaxed text-ink">
            Aucune transaction n&apos;a lieu sur AfriMentor. En postulant, vous
            êtes mis en relation avec l&apos;organisation émettrice qui gère
            seule sa sélection. AfriMentor ne perçoit aucune commission.
          </p>
        </div>

        {/* Carte candidature */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="border border-line bg-white p-7">
            <div className="mb-5 font-display text-xl text-indigo">
              Cette mission en bref
            </div>
            <Row label="Type" value={o.kind} />
            <Row label="Secteur" value={o.sector} />
            <Row label="Durée" value={o.dur} />
            <Row label="Lieu" value={o.placeLabel} />
            <Row label="Échéance" value={o.deadline} accent />
            <Link
              href="/inscription"
              className="mt-5 block rounded-sm bg-indigo py-3 text-center text-sm font-medium text-ivory transition-colors hover:bg-indigo-deep"
            >
              Postuler à cette mission
            </Link>
            <SaveOpportunityButton
              opportunityId={o.id}
              initialSaved={isSaved}
            />
            <div className="mt-4 flex flex-wrap gap-2">
              {o.tags.map((t) => (
                <span
                  key={t}
                  className="rounded-sm border border-line px-2.5 py-1 text-[11px] text-ink-soft"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </Container>
  );
}

function Row({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="flex justify-between gap-4 border-b border-line py-2.5 text-[13px] last:border-0">
      <span className="text-muted">{label}</span>
      <span
        className={`text-right font-medium ${accent ? "text-terra" : "text-indigo"}`}
      >
        {value}
      </span>
    </div>
  );
}
