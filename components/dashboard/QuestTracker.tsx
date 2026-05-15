"use client";

import { useTransition } from "react";
import { toggleQuest } from "@/app/actions/session";

const QUEST_LABELS = [
  "Mon parcours",
  "Mes trois fiertés",
  "Ma bibliothèque",
  "Mes domaines",
  "Ma capsule signature",
  "Ma disponibilité",
  "Mon héritage",
];

export function QuestTracker({ quests }: { quests: boolean[] }) {
  const [isPending, startTransition] = useTransition();
  const done = quests.filter(Boolean).length;
  const pct = Math.round((done / quests.length) * 100);

  return (
    <div
      className="mb-10 bg-ivory-soft p-7 sm:p-8"
      data-pending={isPending ? "" : undefined}
    >
      <div className="mb-5 flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="font-display text-xl text-indigo sm:text-[22px]">
          Votre profil patrimonial — {done} quête{done > 1 ? "s" : ""} sur{" "}
          {quests.length}
        </h2>
        <span className="text-sm font-semibold text-terra">
          {pct}&nbsp;% complété
        </span>
      </div>

      <div className="mb-7 h-2 overflow-hidden bg-ivory-shadow">
        <div
          className="h-full bg-gradient-to-r from-gold to-terra transition-[width] duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {QUEST_LABELS.map((label, i) => {
          const isDone = quests[i];
          return (
            <button
              key={label}
              type="button"
              onClick={() => startTransition(() => toggleQuest(i))}
              disabled={isPending}
              className="flex items-center gap-3.5 border border-line bg-white px-4 py-4 text-left transition-colors hover:border-gold disabled:opacity-60"
            >
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-display text-sm font-semibold ${
                  isDone
                    ? "bg-gold text-indigo-deep"
                    : "bg-ivory-shadow text-ink-soft"
                }`}
              >
                {isDone ? "✓" : i + 1}
              </span>
              <span
                className={`text-sm ${
                  isDone
                    ? "font-medium text-indigo"
                    : "text-ink-soft"
                }`}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
