"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import {
  submitInscription,
  type InscriptionResult,
} from "@/app/actions/session";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-sm bg-indigo px-6 py-3 text-sm font-medium text-ivory transition-colors hover:bg-indigo-deep disabled:cursor-not-allowed disabled:opacity-50"
    >
      {pending ? "Envoi…" : "Recevoir mon lien de confirmation"}
    </button>
  );
}

export function InscriptionForm({
  supabaseMode,
}: {
  supabaseMode: boolean;
}) {
  const [state, formAction] = useActionState<
    InscriptionResult | null,
    FormData
  >(submitInscription, null);
  const [bioLen, setBioLen] = useState(0);

  const errors = state?.errors ?? {};

  // Lien magique envoyé (mode Supabase)
  if (state?.ok && state.mode === "email-sent") {
    return (
      <div className="w-full max-w-md">
        <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-gold text-2xl text-indigo-deep">
          ✓
        </div>
        <h2 className="font-display text-3xl font-normal text-indigo">
          Vérifiez votre boîte mail.
        </h2>
        <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">
          Un lien de confirmation vient d&apos;être envoyé. Cliquez dessus pour
          ouvrir votre tableau de bord — aucun mot de passe à retenir.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="w-full max-w-md" noValidate>
      <div className="mb-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-terra">
        Étape 1 — Inscription éclair
      </div>
      <h2 className="font-display text-3xl font-normal text-indigo sm:text-4xl">
        Commençons par vous.
      </h2>
      <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">
        Le strict nécessaire pour ouvrir votre compte. Les sept quêtes du
        profil viendront ensuite, à votre rythme.
      </p>

      {state?.message && (
        <p className="mt-5 rounded-sm border border-err/30 bg-err/5 px-4 py-3 text-[13px] text-err">
          {state.message}
        </p>
      )}

      <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field
          name="prenom"
          label="Prénom"
          placeholder="Cécile"
          error={errors.prenom}
        />
        <Field
          name="nom"
          label="Nom"
          placeholder="Adjovi-Mensah"
          error={errors.nom}
        />
      </div>
      <Field
        name="email"
        type="email"
        label="Adresse email"
        placeholder="votre.adresse@email.com"
        error={errors.email}
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field
          name="annee"
          label="Année de naissance"
          placeholder="1962"
          error={errors.annee}
        />
        <Field
          name="ville"
          label="Ville"
          placeholder="Porto-Novo"
          error={errors.ville}
        />
      </div>

      <div className="mb-5">
        <label
          htmlFor="bio"
          className="mb-2 block text-xs font-medium uppercase tracking-wide text-ink-soft"
        >
          Mini-biographie · 280 caractères
        </label>
        <textarea
          id="bio"
          name="bio"
          maxLength={320}
          onChange={(e) => setBioLen(e.target.value.length)}
          placeholder="Présentez-vous en quelques mots — vous pourrez l'enrichir plus tard."
          className="min-h-[90px] w-full resize-y rounded-sm border border-line bg-white px-4 py-3 text-[15px] outline-none transition-colors focus:border-indigo"
        />
        <div
          className={`mt-1.5 text-right text-[11px] ${
            bioLen > 280 ? "text-err" : "text-muted"
          }`}
        >
          {bioLen} / 280
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <SubmitButton />
        <span className="text-xs text-muted">
          {supabaseMode
            ? "Lien magique — aucun mot de passe"
            : "Mode démo — session locale, aucun email envoyé"}
        </span>
      </div>

      <p className="mt-7 text-xs leading-relaxed text-muted">
        En vous inscrivant, vous acceptez la{" "}
        <strong className="text-indigo">Charte AfriMentor</strong> qui garantit
        la gratuité du service, la propriété de vos contenus et la
        confidentialité de vos données.
      </p>
    </form>
  );
}

function Field({
  name,
  label,
  placeholder,
  type = "text",
  error,
}: {
  name: string;
  label: string;
  placeholder: string;
  type?: string;
  error?: string;
}) {
  return (
    <div className="mb-5">
      <label
        htmlFor={name}
        className="mb-2 block text-xs font-medium uppercase tracking-wide text-ink-soft"
      >
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        aria-invalid={error ? true : undefined}
        className={`w-full rounded-sm border bg-white px-4 py-3 text-[15px] outline-none transition-colors focus:border-indigo ${
          error ? "border-err bg-err/5" : "border-line"
        }`}
      />
      {error && <p className="mt-1.5 text-[12px] text-err">{error}</p>}
    </div>
  );
}
