import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { QuestTracker } from "@/components/dashboard/QuestTracker";
import {
  getOpportunities,
  getOpportunity,
  getPioneer,
} from "@/lib/queries";
import {
  getFollowedIds,
  getMentorshipRequests,
  getSavedOpportunityIds,
} from "@/lib/interactions";
import { getCurrentUser } from "@/lib/session";

export const metadata: Metadata = {
  title: "Tableau de bord",
};

const STATS = [
  { label: "Vues du profil", value: "2 847", detail: "+ 312 cette semaine" },
  { label: "Capsules vues", value: "3 542", detail: "+ 198 cette semaine" },
  { label: "Téléchargements PDF", value: "128", detail: "+ 14 cette semaine" },
  { label: "Mentorés actifs", value: "7", detail: "2 cycles structurés" },
];

const ACTIVITY = [
  {
    text: "Bénédicte Tognan souhaite vous remercier après votre session de mentorat sur la santé publique rurale.",
    time: "Il y a 2 heures · Demande de témoignage",
  },
  {
    text: "Votre capsule « Trois leçons que la zone rurale m'a apprises » a été partagée 8 fois sur LinkedIn.",
    time: "Il y a 6 heures",
  },
  {
    text: "L'OMS Bénin a soumis une opportunité de consultance qui correspond à votre profil.",
    time: "Il y a 1 jour · Opportunité curatée",
  },
  {
    text: "Votre article « L'épidémie de méningite de 1996 » a été approuvé et publié.",
    time: "Il y a 2 jours · Fil éditorial",
  },
];

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/inscription?next=/tableau-de-bord");

  const [opportunities, followedIds, savedOppIds, requests] =
    await Promise.all([
      getOpportunities(),
      getFollowedIds(),
      getSavedOpportunityIds(),
      getMentorshipRequests(),
    ]);
  const followed = (
    await Promise.all(followedIds.map((id) => getPioneer(id)))
  ).filter((p): p is NonNullable<typeof p> => Boolean(p));
  const savedOpps = (
    await Promise.all(savedOppIds.map((id) => getOpportunity(id)))
  ).filter((o): o is NonNullable<typeof o> => Boolean(o));

  const fullName = `${user.prenom} ${user.nom}`.trim() || "pionnier";

  return (
    <Container className="py-12 sm:py-14">
      <header className="mb-10 flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="mb-2 text-sm tracking-wide text-terra">
            Bonjour, {fullName}
          </p>
          <h1 className="font-display text-3xl font-normal tracking-tight text-indigo sm:text-4xl">
            Votre tableau de bord
          </h1>
        </div>
        <Link
          href="/pionniers/cecile"
          className="rounded-sm border border-indigo px-5 py-2.5 text-sm font-medium text-indigo transition-colors hover:bg-indigo hover:text-ivory"
        >
          Voir un profil public →
        </Link>
      </header>

      <QuestTracker quests={user.quests} />

      <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
        <div>
          {/* Statistiques */}
          <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {STATS.map((s) => (
              <div key={s.label} className="border border-line bg-white p-6">
                <div className="mb-3 text-[11px] uppercase tracking-[0.1em] text-muted">
                  {s.label}
                </div>
                <div className="font-display text-3xl font-normal leading-none text-indigo">
                  {s.value}
                </div>
                <div className="mt-1.5 text-xs text-terra">{s.detail}</div>
              </div>
            ))}
          </div>

          {/* Activité */}
          <section className="mb-6 border border-line bg-white p-7 sm:p-8">
            <h2 className="mb-5 font-display text-xl font-medium text-indigo">
              Activité récente
            </h2>
            {ACTIVITY.map((a, i) => (
              <div
                key={i}
                className="flex gap-4 border-b border-line py-3.5 last:border-0"
              >
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                <div>
                  <p className="text-sm leading-snug text-ink">{a.text}</p>
                  <p className="mt-1 text-xs text-muted">{a.time}</p>
                </div>
              </div>
            ))}
          </section>

          {/* Demandes de mentorat envoyées */}
          {requests.length > 0 && (
            <section className="mb-6 border border-line bg-white p-7 sm:p-8">
              <h2 className="mb-5 font-display text-xl font-medium text-indigo">
                Demandes de mentorat envoyées
              </h2>
              <div className="space-y-4">
                {requests.slice(0, 5).map((r) => (
                  <Link
                    key={r.id}
                    href={`/pionniers/${r.pioneerId}`}
                    className="block border-b border-line pb-4 last:border-0"
                  >
                    <div className="mb-1.5 flex flex-wrap items-baseline justify-between gap-2">
                      <div className="font-display text-base font-medium text-indigo">
                        {r.pioneerName || "Pionnier"}
                      </div>
                      <span className="rounded-sm bg-gold/15 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-terra">
                        {r.status}
                      </span>
                    </div>
                    <div className="text-[12.5px] italic text-muted">
                      {r.type}
                    </div>
                    <p className="mt-2 line-clamp-2 text-[13px] text-ink-soft">
                      {r.message}
                    </p>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Opportunités */}
          <section className="border border-line bg-white p-7 sm:p-8">
            <div className="mb-5 flex items-baseline justify-between">
              <h2 className="font-display text-xl font-medium text-indigo">
                Opportunités qui vous correspondent
              </h2>
              <Link
                href="/opportunites"
                className="text-[12.5px] text-terra hover:underline"
              >
                Toutes →
              </Link>
            </div>
            {opportunities.slice(0, 2).map((o) => (
              <Link
                key={o.id}
                href={`/opportunites/${o.id}`}
                className="block border-b border-line py-4 last:border-0"
              >
                <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-terra">
                  {o.kind} · {o.dur}
                </div>
                <div className="font-display text-lg font-medium text-indigo">
                  {o.title}
                </div>
                <div className="mt-1 text-[12.5px] italic text-muted">
                  Candidature jusqu&apos;au {o.deadline}
                </div>
              </Link>
            ))}
          </section>
        </div>

        {/* Aside */}
        <aside className="flex flex-col gap-4">
          <div className="border border-line bg-ivory-soft p-7">
            <h2 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-terra">
              Prochain rendez-vous
            </h2>
            <div className="text-sm font-medium text-indigo">
              Bénédicte Tognan
            </div>
            <div className="mb-4 text-xs text-muted">
              Session de mentorat n°4 · Cycle structuré
            </div>
            <div className="font-display text-lg text-terra">
              jeudi 28 mai · 16h00
            </div>
          </div>

          {/* Pionniers suivis */}
          <div className="border border-line bg-ivory-soft p-7">
            <h2 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-terra">
              Pionniers suivis
            </h2>
            {followed.length === 0 ? (
              <p className="text-[13px] leading-relaxed text-muted">
                Vous ne suivez encore aucun pionnier.{" "}
                <Link
                  href="/pionniers"
                  className="font-semibold text-terra hover:underline"
                >
                  Explorer l&apos;annuaire →
                </Link>
              </p>
            ) : (
              <ul className="space-y-1">
                {followed.slice(0, 6).map((p) => (
                  <li key={p.id}>
                    <Link
                      href={`/pionniers/${p.id}`}
                      className="block py-1.5 text-[13px] font-medium text-indigo transition-colors hover:text-terra"
                    >
                      {p.name}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Opportunités enregistrées */}
          {savedOpps.length > 0 && (
            <div className="border border-line bg-ivory-soft p-7">
              <h2 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-terra">
                Opportunités enregistrées
              </h2>
              <ul className="space-y-3">
                {savedOpps.slice(0, 4).map((o) => (
                  <li key={o.id}>
                    <Link
                      href={`/opportunites/${o.id}`}
                      className="block text-[13px] font-medium leading-snug text-indigo transition-colors hover:text-terra"
                    >
                      {o.title}
                    </Link>
                    <span className="text-[11.5px] italic text-muted">
                      Échéance : {o.deadline}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="border border-line bg-indigo p-7 text-ivory">
            <h2 className="mb-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-gold">
              Votre compte
            </h2>
            <p className="text-[13px] leading-relaxed text-ivory-shadow/90">
              {user.email}
              <br />
              {user.ville && `${user.ville} · `}
              {user.source === "demo"
                ? "session de démonstration"
                : "compte vérifié"}
            </p>
          </div>
        </aside>
      </div>
    </Container>
  );
}
