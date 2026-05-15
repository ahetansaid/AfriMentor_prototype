"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import {
  submitMentorshipRequest,
  type MentorshipResult,
} from "@/app/actions/interactions";

const TYPES = [
  {
    value: "Question ponctuelle",
    title: "Question ponctuelle",
    desc: "Vous avez une question précise et souhaitez un éclairage. Pas d'engagement long terme.",
  },
  {
    value: "Mentorat récurrent",
    title: "Mentorat récurrent",
    desc: "Accompagnement régulier sur plusieurs mois. Activation possible du cycle structuré si la chimie passe.",
  },
  {
    value: "Conseil d'orientation",
    title: "Conseil d'orientation",
    desc: "Vous êtes en début de carrière ou en reconversion et cherchez un avis structurant.",
  },
];

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-sm bg-indigo px-6 py-3 text-sm font-medium text-ivory transition-colors hover:bg-indigo-deep disabled:cursor-not-allowed disabled:opacity-50"
    >
      {pending ? "Envoi…" : "Envoyer ma demande"}
    </button>
  );
}

export function MentorRequestForm({
  pioneerId,
  pioneerName,
}: {
  pioneerId: string;
  pioneerName: string;
}) {
  const [state, formAction] = useActionState<
    MentorshipResult | null,
    FormData
  >(submitMentorshipRequest, null);
  const [type, setType] = useState(TYPES[0].value);
  const [msgLen, setMsgLen] = useState(0);
  const errors = state?.errors ?? {};

  return (
    <form action={formAction}>
      <input type="hidden" name="pioneerId" value={pioneerId} />

      <h2 className="font-display text-2xl font-normal text-indigo sm:text-3xl">
        Présentez-vous, et dites ce que vous cherchez.
      </h2>
      <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">
        {pioneerName.split(" ").slice(0, 2).join(" ")} recevra votre demande
        par email. Le pionnier est libre de répondre, de proposer un échange
        préliminaire, ou d&apos;orienter vers un autre profil. Aucune relance
        automatique ne sera envoyée.
      </p>

      {state?.message && (
        <p className="mt-5 rounded-sm border border-err/30 bg-err/5 px-4 py-3 text-[13px] text-err">
          {state.message}
        </p>
      )}

      <div className="mt-7">
        <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-ink-soft">
          Quel type d&apos;échange recherchez-vous ?
        </label>
        <div className="space-y-2.5">
          {TYPES.map((t) => (
            <label
              key={t.value}
              className={`flex cursor-pointer gap-3 border p-4 transition-colors ${
                type === t.value
                  ? "border-indigo bg-ivory-soft"
                  : "border-line hover:border-indigo"
              }`}
            >
              <input
                type="radio"
                name="type"
                value={t.value}
                checked={type === t.value}
                onChange={() => setType(t.value)}
                className="mt-0.5 accent-indigo"
              />
              <div>
                <div className="text-sm font-semibold text-indigo">
                  {t.title}
                </div>
                <div className="text-[12.5px] leading-snug text-muted">
                  {t.desc}
                </div>
              </div>
            </label>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <label
          htmlFor="me-msg"
          className="mb-2 block text-xs font-medium uppercase tracking-wide text-ink-soft"
        >
          Message d&apos;introduction · 500 caractères maximum
        </label>
        <textarea
          id="me-msg"
          name="message"
          maxLength={600}
          onChange={(e) => setMsgLen(e.target.value.length)}
          aria-invalid={errors.message ? true : undefined}
          placeholder="Présentez-vous brièvement, expliquez ce qui vous amène, et ce que vous attendez de cet échange. Soyez précis : cela aide le pionnier à juger de la pertinence."
          className={`min-h-[140px] w-full resize-y rounded-sm border bg-white px-4 py-3 text-[15px] outline-none transition-colors focus:border-indigo ${
            errors.message ? "border-err bg-err/5" : "border-line"
          }`}
        />
        <div
          className={`mt-1.5 text-right text-[11px] ${
            msgLen > 500
              ? "text-err"
              : msgLen >= 40
                ? "text-ok"
                : "text-muted"
          }`}
        >
          {msgLen} / 500 (min. 40)
        </div>
        {errors.message && (
          <p className="mt-1 text-[12px] text-err">{errors.message}</p>
        )}
      </div>

      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <input
          name="dispo"
          type="text"
          placeholder="Disponibilités : lundi-mercredi après 16h"
          className="w-full rounded-sm border border-line bg-white px-4 py-3 text-[15px] outline-none transition-colors focus:border-indigo"
        />
        <input
          name="format"
          type="text"
          placeholder="Format : visio, téléphone, en personne"
          className="w-full rounded-sm border border-line bg-white px-4 py-3 text-[15px] outline-none transition-colors focus:border-indigo"
        />
      </div>

      <div className="mt-9 flex flex-wrap items-center gap-4">
        <Submit />
        <Link
          href={`/pionniers/${pioneerId}`}
          className="text-sm text-ink-soft hover:text-indigo"
        >
          Retour au profil
        </Link>
      </div>

      <div className="mt-6 bg-ivory-soft p-4 text-xs leading-snug text-muted">
        <strong className="text-indigo">Trois bonnes pratiques.</strong> Vous
        avez 3 demandes actives maximum à un instant donné — pour préserver la
        qualité des échanges. Le pionnier dispose de 14 jours pour répondre.
        En cas de non-réponse, l&apos;algorithme vous suggérera d&apos;autres
        profils compatibles.
      </div>
    </form>
  );
}
