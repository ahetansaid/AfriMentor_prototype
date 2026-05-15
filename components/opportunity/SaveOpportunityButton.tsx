"use client";

import { useState, useTransition } from "react";
import { toggleSavedOpportunity } from "@/app/actions/interactions";

export function SaveOpportunityButton({
  opportunityId,
  initialSaved,
}: {
  opportunityId: string;
  initialSaved: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(initialSaved);

  function onClick() {
    setSaved((v) => !v);
    startTransition(() => toggleSavedOpportunity(opportunityId));
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isPending}
      aria-pressed={saved}
      className={`mt-3 block w-full rounded-sm border px-5 py-3 text-center text-sm font-medium transition-colors disabled:opacity-60 ${
        saved
          ? "border-gold bg-gold text-indigo-deep"
          : "border-line bg-white text-ink-soft hover:border-indigo hover:text-indigo"
      }`}
    >
      {saved ? "★ Mission enregistrée" : "Enregistrer pour plus tard"}
    </button>
  );
}
