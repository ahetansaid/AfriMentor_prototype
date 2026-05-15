"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

type Group = "kind" | "sector" | "place";

interface Props {
  facets: { kinds: string[]; sectors: string[]; places: string[] };
  selected: { kind: string[]; sector: string[]; place: string[] };
}

export function OpportunityFilters({ facets, selected }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function pushSelection(sel: Props["selected"]) {
    const params = new URLSearchParams();
    if (sel.kind.length) params.set("type", sel.kind.join(","));
    if (sel.sector.length) params.set("secteur", sel.sector.join(","));
    if (sel.place.length) params.set("lieu", sel.place.join(","));
    const qs = params.toString();
    startTransition(() =>
      router.push(qs ? `/opportunites?${qs}` : "/opportunites"),
    );
  }

  function toggle(group: Group, value: string) {
    const current = selected[group];
    const next = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    pushSelection({ ...selected, [group]: next });
  }

  const hasFilters =
    selected.kind.length + selected.sector.length + selected.place.length > 0;

  return (
    <div
      data-pending={isPending ? "" : undefined}
      className="lg:sticky lg:top-24 lg:self-start"
    >
      <h2 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">
        Filtrer les missions
      </h2>
      <FilterGroup
        title="Type de mission"
        options={facets.kinds}
        selected={selected.kind}
        onToggle={(v) => toggle("kind", v)}
      />
      <FilterGroup
        title="Secteur"
        options={facets.sectors}
        selected={selected.sector}
        onToggle={(v) => toggle("sector", v)}
      />
      <FilterGroup
        title="Lieu"
        options={facets.places}
        selected={selected.place}
        onToggle={(v) => toggle("place", v)}
      />
      {hasFilters && (
        <button
          type="button"
          onClick={() => pushSelection({ kind: [], sector: [], place: [] })}
          className="text-[13px] font-medium text-terra hover:underline"
        >
          Réinitialiser les filtres
        </button>
      )}
    </div>
  );
}

function FilterGroup({
  title,
  options,
  selected,
  onToggle,
}: {
  title: string;
  options: string[];
  selected: string[];
  onToggle: (value: string) => void;
}) {
  return (
    <div className="mb-7 border-b border-line pb-6 last:border-0">
      <h3 className="mb-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">
        {title}
      </h3>
      <div className="space-y-2.5">
        {options.map((opt) => (
          <label
            key={opt}
            className="flex cursor-pointer items-center gap-2.5 text-[13.5px] text-ink-soft"
          >
            <input
              type="checkbox"
              checked={selected.includes(opt)}
              onChange={() => onToggle(opt)}
              className="accent-indigo"
            />
            {opt}
          </label>
        ))}
      </div>
    </div>
  );
}
