"use client";

import Image from "next/image";
import { useState } from "react";
import { genPortrait } from "@/lib/portrait";

interface PortraitProps {
  /** Identifiant stable (slug du pionnier) — détermine le portrait généré. */
  seed: string;
  /** URL d'une vraie photo. Si absente ou en erreur, le portrait SVG est utilisé. */
  photoUrl?: string | null;
  width: number;
  height: number;
  alt: string;
  className?: string;
  /** Si vrai, l'image utilise sizes="100vw" et fill — utile pour les héros. */
  fill?: boolean;
  /** Si vrai, charge l'image avec priority (LCP). */
  priority?: boolean;
}

/**
 * Affiche le portrait d'un pionnier : photo réelle si disponible,
 * sinon portrait SVG généré de façon déterministe. Repli automatique
 * si la photo échoue à charger.
 */
export function Portrait({
  seed,
  photoUrl,
  width,
  height,
  alt,
  className,
  fill = false,
  priority = false,
}: PortraitProps) {
  const [failed, setFailed] = useState(false);

  if (photoUrl && !failed) {
    if (fill) {
      return (
        <Image
          src={photoUrl}
          alt={alt}
          fill
          sizes="(min-width: 1024px) 50vw, 100vw"
          priority={priority}
          onError={() => setFailed(true)}
          className={`object-cover ${className ?? ""}`}
        />
      );
    }
    return (
      <Image
        src={photoUrl}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        onError={() => setFailed(true)}
        className={`h-full w-full object-cover ${className ?? ""}`}
      />
    );
  }

  return (
    <span
      role="img"
      aria-label={alt}
      className={className}
      style={{ display: "block", width: "100%", height: "100%" }}
      dangerouslySetInnerHTML={{ __html: genPortrait(seed, width, height) }}
    />
  );
}
