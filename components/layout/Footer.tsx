import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-line bg-ivory-soft px-5 pb-10 pt-14 sm:px-8">
      <div className="mx-auto max-w-[1240px]">
        <div className="grid gap-12 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <div className="mb-3 font-display text-[22px] text-indigo">
              AfriMentor
            </div>
            <p className="max-w-xs text-[13px] leading-relaxed text-muted">
              Préserver, connecter et propulser le patrimoine intellectuel des
              pionniers d&apos;Afrique. Un bien public numérique porté depuis le
              Bénin.
            </p>
          </div>

          <FooterCol
            title="Plateforme"
            links={[
              { href: "/pionniers", label: "Pionniers" },
              { href: "/fil-editorial", label: "Fil éditorial" },
              { href: "/opportunites", label: "Opportunités" },
              { href: "/inscription", label: "Rejoindre" },
            ]}
          />
          <FooterCol
            title="Projet"
            links={[
              { href: "/", label: "À propos" },
              { href: "/", label: "Charte éditoriale" },
              { href: "/", label: "Soutiens & partenaires" },
              { href: "/", label: "Mesure d'impact" },
            ]}
          />
          <div>
            <h4 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.1em] text-ink">
              Contact
            </h4>
            <p className="text-[13px] leading-loose text-ink-soft">
              Porto-Novo, Bénin
              <br />
              contact@afrimentor.bj
            </p>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-line pt-6 text-xs text-muted sm:flex-row sm:justify-between">
          <span>© 2026 AfriMentor</span>
          <span>Prototype interactif · Tous droits réservés</span>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  links,
}: {
  title: string;
  links: { href: string; label: string }[];
}) {
  return (
    <div>
      <h4 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.1em] text-ink">
        {title}
      </h4>
      <ul className="space-y-2.5">
        {links.map((l, i) => (
          <li key={i}>
            <Link
              href={l.href}
              className="text-[13px] text-ink-soft transition-colors hover:text-terra"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
