import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllPioneerIds, getPioneer } from "@/lib/queries";

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
  return {
    title: pioneer ? `Demande envoyée — ${pioneer.name}` : "Demande envoyée",
  };
}

export default async function MentoratEnvoyeePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const pioneer = await getPioneer(slug);
  if (!pioneer) notFound();

  return (
    <div className="flex min-h-[calc(100vh-73px)] items-center justify-center bg-gradient-to-b from-ivory to-ivory-soft px-5 py-20">
      <div className="max-w-[540px] border border-line bg-white p-10 text-center shadow-[0_30px_80px_rgba(26,47,78,0.08)] sm:p-14">
        <div className="mx-auto mb-7 flex h-14 w-14 items-center justify-center rounded-full bg-gold text-2xl text-indigo-deep">
          ✓
        </div>
        <h1 className="font-display text-3xl font-normal text-indigo">
          Demande envoyée.
        </h1>
        <p className="mx-auto mt-4 max-w-md text-[15px] leading-relaxed text-ink-soft">
          {pioneer.name} recevra votre demande par email. Vous serez notifié
          dès qu&apos;une réponse arrive — sous 14 jours au maximum.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/pionniers"
            className="rounded-sm bg-indigo px-5 py-2.5 text-sm font-medium text-ivory transition-colors hover:bg-indigo-deep"
          >
            Explorer d&apos;autres pionniers
          </Link>
          <Link
            href="/tableau-de-bord"
            className="rounded-sm border border-indigo px-5 py-2.5 text-sm font-medium text-indigo transition-colors hover:bg-indigo hover:text-ivory"
          >
            Mon tableau de bord
          </Link>
        </div>
      </div>
    </div>
  );
}
