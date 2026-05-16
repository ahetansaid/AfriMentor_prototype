"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { SECTORS } from "@/lib/types";

interface Props {
  sector: string;
  search: string;
  sort: string;
}

const SORTS = [
  { value: "relevance", label: "pertinence" },
  { value: "experience", label: "expérience" },
  { value: "name", label: "nom (A→Z)" },
  { value: "views", label: "plus consultés" },
];

export function DirectoryControls({ sector, search, sort }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [searchInput, setSearchInput] = useState(search);

  function navigate(next: Partial<Props>) {
    const s = next.sector ?? sector;
    const q = next.search ?? searchInput;
    const so = next.sort ?? sort;
    const params = new URLSearchParams();
    if (s && s !== "Tous") params.set("secteur", s);
    if (q.trim()) params.set("q", q.trim());
    if (so && so !== "relevance") params.set("tri", so);
    const qs = params.toString();
    startTransition(() => router.push(qs ? `/pionniers?${qs}` : "/pionniers"));
  }

  return (
    <div data-pending={isPending ? "" : undefined}>
      {/* Recherche */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          navigate({ search: searchInput });
        }}
        className="mb-6 flex max-w-2xl flex-col border-[1.5px] border-indigo bg-white sm:flex-row"
      >
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Rechercher : santé publique, hydraulique, Ouémé…"
          aria-label="Rechercher un pionnier"
          className="min-w-0 flex-1 bg-transparent px-4 py-3 text-[15px] outline-none placeholder:italic placeholder:text-muted sm:px-5 sm:py-3.5"
        />
        <button
          type="submit"
          className="shrink-0 border-t border-indigo bg-indigo px-6 py-3 text-sm font-medium tracking-wide text-ivory transition-colors hover:bg-indigo-deep sm:border-t-0 sm:py-3.5"
        >
          Rechercher
        </button>
      </form>

      {/* Filtres secteur */}
      <div className="mb-10 flex flex-wrap gap-2.5">
        {["Tous", ...SECTORS].map((s) => {
          const active = s === sector || (s === "Tous" && sector === "Tous");
          return (
            <button
              key={s}
              type="button"
              onClick={() => navigate({ sector: s })}
              className={`rounded-sm border px-4 py-2 text-[13px] transition-colors ${
                active
                  ? "border-indigo bg-indigo text-ivory"
                  : "border-line bg-white text-ink-soft hover:border-indigo"
              }`}
            >
              {s === "Tous" ? "Tous les secteurs" : s}
            </button>
          );
        })}
      </div>

      {/* Tri */}
      <div className="mb-8 flex items-center justify-end border-b border-line pb-4 text-[13px] text-muted">
        Trier par&nbsp;
        <select
          value={sort}
          onChange={(e) => navigate({ sort: e.target.value })}
          aria-label="Trier les résultats"
          className="cursor-pointer bg-transparent font-medium text-indigo outline-none"
        >
          {SORTS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
