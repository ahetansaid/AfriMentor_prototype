import Link from "next/link";
import { FollowButton } from "@/components/pioneer/FollowButton";
import { Portrait } from "@/components/ui/Portrait";
import type { Pioneer } from "@/lib/types";

export function PioneerCard({
  pioneer,
  isFollowed = false,
}: {
  pioneer: Pioneer;
  isFollowed?: boolean;
}) {
  return (
    <article className="group relative isolate overflow-hidden border border-line bg-white transition-all duration-500 hover:border-indigo/40 hover:shadow-[0_30px_60px_rgba(15,27,47,0.14)]">
      <FollowButton
        pioneerId={pioneer.id}
        initialFollowed={isFollowed}
        variant="card"
      />

      <Link href={`/pionniers/${pioneer.id}`} className="block">
        {/* Image avec zoom au hover */}
        <div className="relative h-72 overflow-hidden bg-ivory-shadow sm:h-80">
          <div className="absolute inset-0 transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110">
            <Portrait
              seed={pioneer.id}
              photoUrl={pioneer.photoUrl}
              width={500}
              height={360}
              alt={`Portrait de ${pioneer.name}`}
            />
          </div>
          {/* Gradient bas — donne du contraste au texte sur la photo */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-indigo-deep/60 via-indigo-deep/15 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          {/* Badge secteur */}
          <span className="absolute left-4 top-4 z-10 bg-white/95 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-terra backdrop-blur">
            {pioneer.sector}
          </span>
          {/* Région — apparaît au hover */}
          <span className="absolute bottom-4 left-4 z-10 translate-y-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-ivory opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
            {pioneer.region}, Bénin
          </span>
        </div>

        {/* Corps */}
        <div className="relative p-6 sm:p-7">
          <h3 className="font-display text-xl font-medium text-indigo transition-colors group-hover:text-terra sm:text-2xl">
            {pioneer.name}
          </h3>
          <p className="mt-2 text-[13px] leading-snug text-muted">
            {pioneer.headline}
          </p>
          <div className="mt-5 flex items-center justify-between gap-3">
            <div className="flex flex-wrap gap-1.5">
              {pioneer.tags.slice(0, 2).map((t) => (
                <span
                  key={t}
                  className="rounded-sm border border-line px-2.5 py-1 text-[11px] text-ink-soft"
                >
                  {t}
                </span>
              ))}
            </div>
            <span
              className="font-display text-base text-gold opacity-0 transition-all duration-500 group-hover:translate-x-1 group-hover:opacity-100"
              aria-hidden="true"
            >
              →
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
