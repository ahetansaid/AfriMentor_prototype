"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import type { Pioneer } from "@/lib/types";

const AUTO_MS = 6500;

interface Slide {
  pioneer: Pioneer;
  eyebrow: string;
  title: string;
  subtitle: string;
}

export function HeroCarousel({ pioneers }: { pioneers: Pioneer[] }) {
  const slides: Slide[] = pioneers
    .filter((p) => p.photoUrl)
    .slice(0, 3)
    .map((p) => ({
      pioneer: p,
      eyebrow: `${p.sector} · ${p.region}`,
      title: p.name,
      subtitle: p.headline,
    }));

  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const go = useCallback(
    (i: number) => setIndex(((i % slides.length) + slides.length) % slides.length),
    [slides.length],
  );

  useEffect(() => {
    if (paused || slides.length < 2) return;
    const t = setTimeout(() => go(index + 1), AUTO_MS);
    return () => clearTimeout(t);
  }, [index, paused, slides.length, go]);

  if (slides.length === 0) return null;
  const current = slides[index];

  return (
    <section
      className="relative h-[78vh] min-h-[560px] w-full overflow-hidden bg-indigo-deep text-ivory"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-label="Pionniers vedettes"
    >
      {/* Fond — image + overlay */}
      <AnimatePresence mode="sync">
        <motion.div
          key={current.pioneer.id}
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.06 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <Image
            src={current.pioneer.photoUrl!}
            alt={current.pioneer.name}
            fill
            sizes="100vw"
            priority={index === 0}
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-deep/90 via-indigo-deep/70 to-indigo-deep/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-indigo-deep/80 via-transparent to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Contenu */}
      <div className="relative z-10 flex h-full items-center">
        <div className="mx-auto w-full max-w-[1240px] px-5 sm:px-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.pioneer.id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-2xl"
            >
              <div className="mb-5 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-gold">
                <span className="h-px w-8 bg-gold" />
                {current.eyebrow}
              </div>
              <h1 className="font-display text-4xl font-light leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
                {current.title}
              </h1>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-ivory-shadow/90 sm:text-lg">
                {current.subtitle}
              </p>
              <div className="mt-9 flex flex-wrap items-center gap-4">
                <Link
                  href={`/pionniers/${current.pioneer.id}`}
                  className="group inline-flex items-center gap-3 rounded-sm bg-gold px-7 py-3.5 text-sm font-semibold tracking-wide text-indigo-deep transition-transform hover:translate-y-[-1px]"
                >
                  Découvrir son parcours
                  <span className="transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </Link>
                <Link
                  href="/pionniers"
                  className="rounded-sm border border-ivory/30 px-6 py-3.5 text-sm font-medium text-ivory transition-colors hover:bg-ivory hover:text-indigo-deep"
                >
                  Tous les pionniers
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Pagination */}
      <div className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 items-center gap-3">
        {slides.map((s, i) => (
          <button
            key={s.pioneer.id}
            type="button"
            onClick={() => go(i)}
            aria-label={`Aller au pionnier ${i + 1}`}
            aria-current={i === index}
            className="group relative h-[3px] w-12 overflow-hidden bg-ivory/25"
          >
            <motion.span
              className="absolute inset-0 origin-left bg-gold"
              initial={false}
              animate={{
                scaleX: i === index ? 1 : i < index ? 1 : 0,
              }}
              transition={
                i === index && !paused
                  ? { duration: AUTO_MS / 1000, ease: "linear" }
                  : { duration: 0.3 }
              }
            />
          </button>
        ))}
      </div>

      {/* Numéros / nom courant en haut à droite */}
      <div className="absolute right-5 top-8 z-20 hidden items-center gap-3 text-[11px] uppercase tracking-[0.18em] text-ivory-shadow/70 sm:right-8 sm:flex">
        <span className="font-display text-base text-gold">
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className="h-px w-10 bg-ivory/30" />
        <span>{String(slides.length).padStart(2, "0")}</span>
      </div>

      {/* Flèches */}
      <button
        type="button"
        onClick={() => go(index - 1)}
        aria-label="Pionnier précédent"
        className="absolute left-3 top-1/2 z-20 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-ivory/20 text-xl text-ivory/80 transition-colors hover:border-gold hover:text-gold sm:flex"
      >
        ‹
      </button>
      <button
        type="button"
        onClick={() => go(index + 1)}
        aria-label="Pionnier suivant"
        className="absolute right-3 top-1/2 z-20 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-ivory/20 text-xl text-ivory/80 transition-colors hover:border-gold hover:text-gold sm:flex"
      >
        ›
      </button>
    </section>
  );
}
