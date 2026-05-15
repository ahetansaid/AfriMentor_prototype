/**
 * Générateur de portraits SVG déterministes (porté du prototype v2).
 * Chaque pionnier obtient un portrait stylisé stable, dérivé de son identifiant.
 * Un champ `photoUrl` peut le remplacer par une vraie photo (cf. composant Portrait).
 */

function hashStr(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h << 5) - h + s.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

/** Renvoie le markup SVG d'un portrait généré, en `slice` (object-fit: cover). */
export function genPortrait(seed: string, w: number, h: number): string {
  const r = hashStr(seed);
  const skins = ["#8B5E3C", "#6B4423", "#A67C52", "#7A5230", "#9C6B3E"];
  const bgs: [string, string][] = [
    ["#FAF6EE", "#E8DFCB"],
    ["#F5EFE2", "#E8DFCB"],
    ["#E8DFCB", "#D8CFB8"],
    ["#1A2F4E", "#0F1B2F"],
    ["#8B3A1F", "#5A2412"],
  ];
  const skin = skins[r % skins.length];
  const bg = bgs[(r >> 3) % bgs.length];
  const hairType = (r >> 5) % 4; // 0 argenté · 1 foulard · 2 sombre · 3 dégarni
  const suit = ["#1A2F4E", "#8B3A1F", "#C9A227"][(r >> 7) % 3];
  const lapel = suit === "#C9A227" ? "#1A2F4E" : "#FAF6EE";
  const cx = w / 2;
  const cy = h * 0.42;
  const rx = w * 0.27;
  const ry = h * 0.32;

  let hair = "";
  if (hairType === 0)
    hair = `<path d="M ${cx - rx * 1.05} ${cy - ry * 0.4} Q ${cx - rx} ${cy - ry * 1.2} ${cx} ${cy - ry * 1.25} Q ${cx + rx} ${cy - ry * 1.2} ${cx + rx * 1.05} ${cy - ry * 0.35} L ${cx + rx} ${cy - ry * 0.55} L ${cx - rx} ${cy - ry * 0.55} Z" fill="#E8DFCB"/>`;
  else if (hairType === 1)
    hair = `<path d="M ${cx - rx * 1.05} ${cy - ry * 0.3} Q ${cx - rx} ${cy - ry * 1.25} ${cx} ${cy - ry * 1.3} Q ${cx + rx} ${cy - ry * 1.25} ${cx + rx * 1.05} ${cy - ry * 0.3} Q ${cx + rx * 1.05} ${cy + ry * 0.1} ${cx} ${cy + ry * 0.14} Q ${cx - rx * 1.05} ${cy + ry * 0.1} ${cx - rx * 1.05} ${cy - ry * 0.3} Z" fill="#C9A227"/><path d="M ${cx - rx * 0.55} ${cy - ry * 0.75} Q ${cx} ${cy - ry * 0.5} ${cx + rx * 0.55} ${cy - ry * 0.75}" stroke="#8B3A1F" stroke-width="${w * 0.006}" fill="none"/>`;
  else if (hairType === 2)
    hair = `<path d="M ${cx - rx * 1.02} ${cy - ry * 0.35} Q ${cx - rx} ${cy - ry * 1.2} ${cx} ${cy - ry * 1.25} Q ${cx + rx} ${cy - ry * 1.2} ${cx + rx * 1.02} ${cy - ry * 0.35} L ${cx + rx * 0.95} ${cy - ry * 0.55} L ${cx - rx * 0.95} ${cy - ry * 0.55} Z" fill="#1F1F1F"/>`;
  else
    hair = `<path d="M ${cx - rx * 0.9} ${cy - ry * 0.7} Q ${cx} ${cy - ry * 1.08} ${cx + rx * 0.9} ${cy - ry * 0.7}" stroke="#3D2418" stroke-width="${w * 0.02}" fill="none"/>`;

  const glasses =
    (r >> 9) % 2
      ? `<circle cx="${cx - rx * 0.42}" cy="${cy + ry * 0.08}" r="${w * 0.05}" fill="none" stroke="#1F1F1F" stroke-width="${w * 0.009}"/><circle cx="${cx + rx * 0.42}" cy="${cy + ry * 0.08}" r="${w * 0.05}" fill="none" stroke="#1F1F1F" stroke-width="${w * 0.009}"/><line x1="${cx - rx * 0.1}" y1="${cy + ry * 0.08}" x2="${cx + rx * 0.1}" y2="${cy + ry * 0.08}" stroke="#1F1F1F" stroke-width="${w * 0.007}"/>`
      : `<ellipse cx="${cx - rx * 0.42}" cy="${cy + ry * 0.08}" rx="${w * 0.012}" ry="${w * 0.009}" fill="#1F1F1F"/><ellipse cx="${cx + rx * 0.42}" cy="${cy + ry * 0.08}" rx="${w * 0.012}" ry="${w * 0.009}" fill="#1F1F1F"/>`;

  const isDark = bg[0] === "#1A2F4E" || bg[0] === "#8B3A1F";
  const gid = `amg-${r}`;

  return `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" role="img" aria-hidden="true">
    <defs><linearGradient id="${gid}" x1="0" y1="0" x2="${isDark ? 1 : 0}" y2="1"><stop offset="0%" stop-color="${bg[0]}"/><stop offset="100%" stop-color="${bg[1]}"/></linearGradient></defs>
    <rect width="${w}" height="${h}" fill="url(#${gid})"/>
    <ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${skin}"/>
    ${hair}${glasses}
    <path d="M ${cx - rx * 0.4} ${cy + ry * 0.62} Q ${cx} ${cy + ry * 0.78} ${cx + rx * 0.4} ${cy + ry * 0.62}" fill="none" stroke="#3D2418" stroke-width="${w * 0.008}" stroke-linecap="round"/>
    <path d="M ${cx - rx * 1.4} ${h} L ${cx - rx * 0.7} ${cy + ry * 1.05} L ${cx} ${cy + ry * 1.3} L ${cx + rx * 0.7} ${cy + ry * 1.05} L ${cx + rx * 1.4} ${h} Z" fill="${suit}"/>
    <path d="M ${cx - rx * 0.7} ${cy + ry * 1.05} L ${cx} ${cy + ry * 1.3} L ${cx + rx * 0.7} ${cy + ry * 1.05} L ${cx} ${h} Z" fill="${lapel}"/>
  </svg>`;
}

/** Visuel abstrait déterministe pour les couvertures d'articles. */
export function genCover(seed: string, w = 800, h = 360): string {
  const r = hashStr(seed);
  const gid = `amc-${r}`;
  return `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" role="img" aria-hidden="true">
    <defs><linearGradient id="${gid}" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#1A2F4E"/><stop offset="100%" stop-color="#8B3A1F"/></linearGradient></defs>
    <rect width="${w}" height="${h}" fill="url(#${gid})"/>
    <circle cx="${w * 0.2 + (r % 200)}" cy="${h * 0.3}" r="${h * 0.22}" fill="#C9A227" opacity="0.8"/>
    <circle cx="${w * 0.78}" cy="${h * 0.78}" r="${h * 0.36}" fill="#E5C654" opacity="0.35"/>
    <rect x="${w * 0.38}" y="${h * 0.42}" width="${w * 0.25}" height="${w * 0.25}" fill="none" stroke="#FAF6EE" stroke-width="2" opacity="0.5"/>
    <path d="M ${w * 0.1} ${h * 0.88} Q ${w * 0.5} ${h * 0.66} ${w * 0.92} ${h * 0.94}" fill="none" stroke="#C9A227" stroke-width="2"/>
  </svg>`;
}
