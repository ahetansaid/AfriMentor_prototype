import type { MetadataRoute } from "next";
import {
  getAllArticleIds,
  getAllOpportunityIds,
  getAllPioneerIds,
} from "@/lib/queries";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://afrimentor.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [pioneerIds, articleIds, opportunityIds] = await Promise.all([
    getAllPioneerIds(),
    getAllArticleIds(),
    getAllOpportunityIds(),
  ]);

  const now = new Date();

  const staticPaths: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/pionniers`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/fil-editorial`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/opportunites`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { url: `${SITE_URL}/inscription`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
  ];

  const pioneerPaths: MetadataRoute.Sitemap = pioneerIds.map((id) => ({
    url: `${SITE_URL}/pionniers/${id}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const articlePaths: MetadataRoute.Sitemap = articleIds.map((id) => ({
    url: `${SITE_URL}/fil-editorial/${id}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const opportunityPaths: MetadataRoute.Sitemap = opportunityIds.map((id) => ({
    url: `${SITE_URL}/opportunites/${id}`,
    lastModified: now,
    changeFrequency: "daily",
    priority: 0.6,
  }));

  return [
    ...staticPaths,
    ...pioneerPaths,
    ...articlePaths,
    ...opportunityPaths,
  ];
}
