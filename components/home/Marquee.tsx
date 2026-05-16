/**
 * Bandeau défilant — pure CSS, pas de JS.
 * On répète le contenu une fois pour permettre la translation -50% en boucle.
 */
export function Marquee({ items }: { items: string[] }) {
  const all = [...items, ...items];
  return (
    <div
      className="group/marquee relative flex overflow-hidden border-y border-line bg-ivory py-5 sm:py-7"
      aria-label="Soutiens et partenaires"
    >
      <div className="flex shrink-0 animate-[marquee_45s_linear_infinite] items-center gap-8 px-4 group-hover/marquee:[animation-play-state:paused] sm:gap-16 sm:px-8">
        {all.map((label, i) => (
          <span
            key={i}
            className="whitespace-nowrap font-display text-lg tracking-tight text-ink-soft/80 sm:text-2xl lg:text-3xl"
          >
            {label}
            <span className="ml-8 text-gold sm:ml-16">·</span>
          </span>
        ))}
      </div>
    </div>
  );
}
