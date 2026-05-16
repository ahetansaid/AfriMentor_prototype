import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Portrait } from "@/components/ui/Portrait";
import { MentorRequestForm } from "@/components/mentorship/MentorRequestForm";
import { getAllPioneerIds, getPioneer } from "@/lib/queries";
import { getCurrentUser } from "@/lib/session";

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
  return { title: pioneer ? `Mentorat — ${pioneer.name}` : "Mentorat" };
}

export default async function MentoratPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const pioneer = await getPioneer(slug);
  if (!pioneer) notFound();

  const user = await getCurrentUser();
  if (!user) redirect(`/inscription?next=/pionniers/${slug}/mentorat`);

  return (
    <div className="bg-gradient-to-b from-ivory to-ivory-soft py-14 sm:py-16">
      <Container>
        <Link
          href={`/pionniers/${pioneer.id}`}
          className="text-[13px] text-terra hover:underline"
        >
          ← Retour au profil
        </Link>
        <div className="mx-auto mt-6 max-w-[720px] border border-line bg-white p-5 shadow-[0_30px_80px_rgba(26,47,78,0.08)] sm:p-8 lg:p-12">
          <header className="mb-7 flex flex-col items-start gap-4 border-b border-line pb-7 sm:flex-row sm:items-center sm:gap-5">
            <div className="h-20 w-20 shrink-0 overflow-hidden rounded-full bg-ivory-shadow">
              <Portrait
                seed={pioneer.id}
                photoUrl={pioneer.photoUrl}
                width={88}
                height={88}
                alt={pioneer.name}
              />
            </div>
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-terra">
                Demande de mentorat à
              </div>
              <div className="font-display text-2xl font-medium text-indigo">
                {pioneer.name}
              </div>
              <div className="text-[13px] italic text-muted">
                {pioneer.headline}
              </div>
            </div>
          </header>
          <MentorRequestForm
            pioneerId={pioneer.id}
            pioneerName={pioneer.name}
          />
        </div>
      </Container>
    </div>
  );
}
