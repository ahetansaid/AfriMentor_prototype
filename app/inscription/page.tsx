import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { InscriptionForm } from "@/components/auth/InscriptionForm";
import { Container } from "@/components/ui/Container";
import { getCurrentUser } from "@/lib/session";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export const metadata: Metadata = {
  title: "Rejoindre AfriMentor",
  description:
    "Ouvrez votre profil patrimonial — inscription éclair, lien magique, gratuité totale.",
};

const FEATURES = [
  "Profil public avec URL personnalisée et QR code",
  "Sept quêtes progressives à votre rythme",
  "Portrait Complet PDF exportable à tout moment",
  "Confidentialité à trois niveaux dont coffre-fort privé",
  "Aucune publicité, aucune commission, gratuité totale",
];

export default async function InscriptionPage() {
  const user = await getCurrentUser();
  if (user) redirect("/tableau-de-bord");

  return (
    <div className="grid min-h-[calc(100vh-73px)] lg:grid-cols-2">
      {/* Volet gauche */}
      <div className="relative flex flex-col justify-between overflow-hidden bg-indigo p-12 text-ivory lg:p-16">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 70% 30%, rgba(201,162,39,0.12) 0%, transparent 60%)",
          }}
        />
        <div className="relative">
          <p className="mb-8 text-[11px] font-semibold uppercase tracking-[0.18em] text-gold">
            Inscription pionnier
          </p>
          <h1 className="font-display text-3xl font-light leading-tight tracking-tight sm:text-4xl">
            En moins de trois minutes, votre{" "}
            <em className="text-gold-soft">seconde scène professionnelle</em>{" "}
            commence ici.
          </h1>
          <ul className="mt-10 space-y-3.5">
            {FEATURES.map((f) => (
              <li key={f} className="flex gap-3 text-sm">
                <span className="shrink-0 text-gold">→</span>
                {f}
              </li>
            ))}
          </ul>
        </div>
        <p className="relative mt-10 text-xs text-ivory-shadow/60">
          Vous représentez une organisation et cherchez à contacter un
          pionnier ? Aucun compte requis — soumettez une opportunité.
        </p>
      </div>

      {/* Volet droit — formulaire */}
      <Container className="flex items-center py-14">
        <InscriptionForm supabaseMode={isSupabaseConfigured} />
      </Container>
    </div>
  );
}
