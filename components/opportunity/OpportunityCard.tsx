import Link from "next/link";
import type { Opportunity } from "@/lib/types";

export function OpportunityCard({
  opportunity: o,
}: {
  opportunity: Opportunity;
}) {
  return (
    <Link
      href={`/opportunites/${o.id}`}
      className="block border border-line bg-white p-6 transition-all hover:translate-x-0.5 hover:border-indigo sm:p-7"
    >
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div className="text-[11px] font-semibold uppercase tracking-wide text-terra">
          {o.kind} · {o.dur} · {o.placeLabel}
        </div>
        <div className="bg-ivory-soft px-3 py-1.5 text-[11px] font-medium text-ink-soft">
          Candidature jusqu&apos;au{" "}
          <strong className="text-terra">{o.deadline}</strong>
        </div>
      </div>
      <h3 className="font-display text-2xl font-medium leading-snug text-indigo">
        {o.title}
      </h3>
      <p className="mt-2 text-sm italic text-muted">{o.org}</p>
      <p className="mt-4 text-sm leading-relaxed text-ink">{o.desc}</p>
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-5">
        <div className="flex flex-wrap gap-2">
          {o.tags.map((t) => (
            <span
              key={t}
              className="rounded-sm border border-line px-2.5 py-1 text-[11px] text-ink-soft"
            >
              {t}
            </span>
          ))}
        </div>
        <span className="text-[13px] font-semibold text-terra">
          Voir l&apos;opportunité →
        </span>
      </div>
    </Link>
  );
}
