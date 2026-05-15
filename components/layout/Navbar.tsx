"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { signOut } from "@/app/actions/session";

const LINKS = [
  { href: "/pionniers", label: "Pionniers" },
  { href: "/fil-editorial", label: "Fil éditorial" },
  { href: "/opportunites", label: "Opportunités" },
];

export function Navbar({ user }: { user: { prenom: string } | null }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  return (
    <nav className="sticky top-0 z-50 border-b border-line bg-ivory/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1240px] items-center justify-between px-5 py-4 sm:px-8">
        <Link
          href="/"
          className="flex items-center gap-2.5 font-display text-[22px] font-semibold tracking-tight text-indigo"
          onClick={() => setOpen(false)}
        >
          <span className="inline-block h-2 w-2 rounded-full bg-gold shadow-[0_0_0_3px_rgba(201,162,39,0.18)]" />
          AfriMentor
        </Link>

        {/* Liens — desktop */}
        <div className="hidden items-center gap-7 md:flex">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`relative text-sm font-medium transition-colors ${
                isActive(l.href)
                  ? "text-indigo"
                  : "text-ink-soft hover:text-indigo"
              }`}
            >
              {l.label}
              {isActive(l.href) && (
                <span className="absolute -bottom-[22px] left-0 right-0 h-0.5 bg-gold" />
              )}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <div className="hidden items-center gap-3 sm:flex">
              <Link
                href="/tableau-de-bord"
                className="text-sm font-medium text-indigo hover:text-terra"
              >
                {user.prenom} · Tableau de bord
              </Link>
              <form action={signOut}>
                <button
                  type="submit"
                  className="text-sm text-ink-soft transition-colors hover:text-terra"
                >
                  Déconnexion
                </button>
              </form>
            </div>
          ) : (
            <Link
              href="/inscription"
              className="hidden rounded-sm bg-indigo px-5 py-2.5 text-sm font-medium tracking-wide text-ivory transition-colors hover:bg-indigo-deep sm:inline-block"
            >
              Rejoindre
            </Link>
          )}

          {/* Hamburger — mobile */}
          <button
            type="button"
            aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="flex h-10 w-10 items-center justify-center rounded-sm border border-line text-indigo md:hidden"
          >
            <span className="text-xl leading-none">{open ? "✕" : "☰"}</span>
          </button>
        </div>
      </div>

      {/* Panneau mobile */}
      {open && (
        <div className="border-t border-line bg-ivory px-5 py-4 md:hidden">
          <div className="flex flex-col gap-1">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className={`rounded-sm px-3 py-3 text-[15px] font-medium ${
                  isActive(l.href)
                    ? "bg-ivory-soft text-indigo"
                    : "text-ink-soft"
                }`}
              >
                {l.label}
              </Link>
            ))}

            {user ? (
              <>
                <Link
                  href="/tableau-de-bord"
                  onClick={() => setOpen(false)}
                  className="rounded-sm px-3 py-3 text-[15px] font-medium text-indigo"
                >
                  {user.prenom} · Tableau de bord
                </Link>
                <form action={signOut}>
                  <button
                    type="submit"
                    className="w-full rounded-sm px-3 py-3 text-left text-[15px] text-ink-soft"
                  >
                    Déconnexion
                  </button>
                </form>
              </>
            ) : (
              <Link
                href="/inscription"
                onClick={() => setOpen(false)}
                className="mt-2 rounded-sm bg-indigo px-3 py-3 text-center text-[15px] font-medium text-ivory"
              >
                Rejoindre
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
