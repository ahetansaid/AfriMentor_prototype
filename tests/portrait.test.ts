import { describe, expect, it } from "vitest";
import { genCover, genPortrait } from "@/lib/portrait";

describe("genPortrait", () => {
  it("est déterministe pour un même seed", () => {
    const a = genPortrait("cecile", 200, 280);
    const b = genPortrait("cecile", 200, 280);
    expect(a).toBe(b);
  });

  it("produit des sorties différentes pour des seeds différents", () => {
    const a = genPortrait("cecile", 200, 280);
    const b = genPortrait("mathias", 200, 280);
    expect(a).not.toBe(b);
  });

  it("renvoie un SVG valide", () => {
    const svg = genPortrait("anastasie", 400, 500);
    expect(svg.trim().startsWith("<svg")).toBe(true);
    expect(svg).toContain('viewBox="0 0 400 500"');
    expect(svg).toContain('aria-hidden="true"');
  });

  it("respecte les dimensions demandées", () => {
    const svg = genPortrait("emile", 320, 420);
    expect(svg).toContain('width="320"');
    expect(svg).toContain('height="420"');
  });
});

describe("genCover", () => {
  it("est déterministe pour un même seed", () => {
    expect(genCover("article-1")).toBe(genCover("article-1"));
  });

  it("renvoie un SVG aux dimensions par défaut 800x360", () => {
    const svg = genCover("article-1");
    expect(svg).toContain('viewBox="0 0 800 360"');
  });
});
