import { describe, expect, it } from "vitest";
import {
  getAllPioneerIds,
  getOpportunities,
  getOpportunityFacets,
  getPioneer,
  getPioneers,
} from "@/lib/queries";

describe("getPioneers", () => {
  it("renvoie les 12 pionniers du seed sans filtre", async () => {
    const all = await getPioneers();
    expect(all.length).toBe(12);
  });

  it("filtre par secteur", async () => {
    const sante = await getPioneers({ sector: "Santé" });
    expect(sante.length).toBeGreaterThan(0);
    expect(sante.every((p) => p.sector === "Santé")).toBe(true);
  });

  it("retourne tous les profils quand le secteur est 'Tous'", async () => {
    const all = await getPioneers({ sector: "Tous" });
    expect(all.length).toBe(12);
  });

  it("recherche multi-mots dans le nom, le headline et les tags", async () => {
    const r = await getPioneers({ search: "magistrate cotonou" });
    expect(r.length).toBe(1);
    expect(r[0].id).toBe("henriette");
  });

  it("renvoie une liste vide quand aucun résultat", async () => {
    const r = await getPioneers({ search: "xyz_inexistant" });
    expect(r).toEqual([]);
  });

  it("trie par expérience décroissante", async () => {
    const r = await getPioneers({ sort: "experience" });
    for (let i = 1; i < r.length; i++) {
      expect(r[i - 1].experience).toBeGreaterThanOrEqual(r[i].experience);
    }
  });

  it("trie par nom alphabétique français", async () => {
    const r = await getPioneers({ sort: "name" });
    for (let i = 1; i < r.length; i++) {
      expect(r[i - 1].name.localeCompare(r[i].name, "fr")).toBeLessThanOrEqual(0);
    }
  });
});

describe("getPioneer", () => {
  it("trouve un pionnier par slug", async () => {
    const p = await getPioneer("cecile");
    expect(p?.name).toBe("Dr Cécile Adjovi-Mensah");
  });

  it("renvoie null pour un slug inconnu", async () => {
    expect(await getPioneer("inconnu")).toBeNull();
  });
});

describe("getAllPioneerIds", () => {
  it("retourne les 12 slugs", async () => {
    const ids = await getAllPioneerIds();
    expect(ids.length).toBe(12);
    expect(ids).toContain("cecile");
  });
});

describe("getOpportunities + facets", () => {
  it("filtre par type", async () => {
    const r = await getOpportunities({ kind: ["Formation"] });
    expect(r.every((o) => o.kind === "Formation")).toBe(true);
  });

  it("retourne des facettes uniques", async () => {
    const facets = await getOpportunityFacets();
    expect(new Set(facets.kinds).size).toBe(facets.kinds.length);
    expect(facets.kinds.length).toBeGreaterThan(0);
  });
});
