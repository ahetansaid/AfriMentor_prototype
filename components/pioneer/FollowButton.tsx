"use client";

import { useState, useTransition } from "react";
import { toggleFollow } from "@/app/actions/interactions";

interface Props {
  pioneerId: string;
  initialFollowed: boolean;
  variant?: "card" | "tool";
}

/**
 * Bouton ★ « suivre ce pionnier ». Mise à jour optimiste, server action
 * en transition. Sans session, l'action redirige vers /inscription.
 */
export function FollowButton({
  pioneerId,
  initialFollowed,
  variant = "card",
}: Props) {
  const [isPending, startTransition] = useTransition();
  const [followed, setFollowed] = useState(initialFollowed);

  function onClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setFollowed((v) => !v);
    startTransition(() => toggleFollow(pioneerId));
  }

  const label = followed ? "Retirer des suivis" : "Suivre ce pionnier";

  if (variant === "tool") {
    return (
      <button
        type="button"
        onClick={onClick}
        disabled={isPending}
        aria-label={label}
        aria-pressed={followed}
        className={`flex h-10 items-center gap-2 rounded-sm border px-3.5 text-sm font-medium transition-colors disabled:opacity-60 ${
          followed
            ? "border-gold bg-gold text-indigo-deep"
            : "border-line bg-white text-ink-soft hover:border-indigo hover:text-indigo"
        }`}
      >
        <span>{followed ? "★" : "☆"}</span>
        <span className="hidden sm:inline">
          {followed ? "Suivi" : "Suivre"}
        </span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isPending}
      aria-label={label}
      aria-pressed={followed}
      className={`absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-base shadow-sm transition-colors disabled:opacity-60 ${
        followed
          ? "text-gold hover:text-terra"
          : "text-muted hover:text-gold"
      }`}
    >
      {followed ? "★" : "☆"}
    </button>
  );
}
