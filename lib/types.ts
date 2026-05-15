/** Types métier AfriMentor — partagés entre la couche données (seed/Supabase) et l'UI. */

export const SECTORS = [
  "Santé",
  "Ingénierie",
  "Éducation",
  "Droit",
  "Agriculture",
  "Administration",
  "Finance",
  "Recherche",
] as const;
export type Sector = (typeof SECTORS)[number];

export interface TimelineEntry {
  period: string;
  role: string;
  org: string;
}

export interface Capsule {
  type: string;
  title: string;
  duration: string;
}

export interface Work {
  year: string;
  title: string;
  meta: string;
  type: string;
}

export interface Testimonial {
  text: string;
  author: string;
  role: string;
}

export interface Pioneer {
  id: string; // slug
  name: string;
  prefix: string;
  sector: Sector;
  region: string;
  headline: string;
  long: string;
  experience: number;
  status: string;
  availability: string;
  views: number;
  completion: number; // 0–100
  photoUrl?: string | null;
  tags: string[];
  timeline: TimelineEntry[];
  fiertes: string[];
  capsules: Capsule[];
  works: Work[];
  testimonials: Testimonial[];
  legacy: string;
  stats: Record<string, string>;
  related: string[];
}

export interface Article {
  id: string; // slug
  authorId: string;
  sector: Sector;
  kind: string;
  read: string;
  date: string;
  reads: string;
  title: string;
  excerpt: string;
  body: string[];
}

export interface Opportunity {
  id: string; // slug
  kind: string;
  sector: Sector;
  place: string;
  placeLabel: string;
  dur: string;
  title: string;
  org: string;
  deadline: string;
  desc: string;
  tags: string[];
  missions: string[];
  profil: string[];
}

/** Profil de compte (Supabase `profiles`, étend `auth.users`). */
export interface AccountProfile {
  id: string;
  role: "visiteur" | "pionnier" | "admin";
  prenom: string;
  nom: string;
  ville: string;
  anneeNaissance: string;
  bio: string;
  quests: boolean[]; // 7 quêtes
}
