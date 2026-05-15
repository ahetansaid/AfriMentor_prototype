/**
 * Bandeau défilant — pure CSS, pas de JS.
 * On répète le contenu une fois pour permettre la translation -50% en boucle.
 */
export function Marquee({ items }: { items: string[] }) {
  const all = [...items, ...items];
  return (
    <div
      className="group/marquee relative flex overflow-hidden border-y border-line bg-ivory py-7"
      aria-label="Soutiens et partenaires"
    >
      <div className="flex shrink-0 animate-[marquee_45s_linear_infinite] items-center gap-16 px-8 group-hover/marquee:[animation-play-state:paused]">
        {all.map((label, i) => (
          <span
            key={i}
            className="whitespace-nowrap font-display text-2xl tracking-tight text-ink-soft/80 sm:text-3xl"
          >
            {label}
            <span className="ml-16 text-gold">·</span>
          </span>
        ))}
      </div>
    </div>
  );
}
