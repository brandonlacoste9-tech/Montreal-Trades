import type { MetadataRoute } from "next";

const BASE = "https://mtltrades.com";

/** Public marketing pages only (no dashboard / API). */
const routes: { path: string; enPath: string; priority: number; change: MetadataRoute.Sitemap[0]["changeFrequency"] }[] = [
  { path: "", enPath: "/en", priority: 1, change: "weekly" },
  { path: "/soumission", enPath: "/en/soumission", priority: 0.95, change: "weekly" },
  { path: "/zones", enPath: "/en/zones", priority: 0.85, change: "monthly" },
  { path: "/entrepreneurs", enPath: "/en/entrepreneurs", priority: 0.9, change: "weekly" },
  { path: "/annuaire", enPath: "/en/annuaire", priority: 0.9, change: "weekly" },
  { path: "/inscription", enPath: "/en/inscription", priority: 0.85, change: "monthly" },
  // Directory trade pages
  { path: "/annuaire/plomberie", enPath: "/en/annuaire/plumbing", priority: 0.85, change: "weekly" },
  { path: "/annuaire/electricite", enPath: "/en/annuaire/electrical", priority: 0.85, change: "weekly" },
  { path: "/annuaire/toiture", enPath: "/en/annuaire/roofing", priority: 0.85, change: "weekly" },
  // High-intent trade landings
  { path: "/plombier-montreal", enPath: "/en/plumber-montreal", priority: 0.9, change: "weekly" },
  { path: "/electricien-montreal", enPath: "/en/electrician-montreal", priority: 0.9, change: "weekly" },
  { path: "/toiture-montreal", enPath: "/en/roofing-montreal", priority: 0.9, change: "weekly" },
  { path: "/renovation-montreal", enPath: "/en/renovation-montreal", priority: 0.85, change: "weekly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return routes.flatMap(({ path, enPath, priority, change }) => [
    {
      url: `${BASE}${path || "/"}`,
      lastModified: now,
      changeFrequency: change,
      priority,
      alternates: {
        languages: {
          "fr-CA": `${BASE}${path || "/"}`,
          "en-CA": `${BASE}${enPath}`,
          "x-default": `${BASE}${path || "/"}`,
        },
      },
    },
    {
      url: `${BASE}${enPath}`,
      lastModified: now,
      changeFrequency: change,
      priority: priority * 0.95,
      alternates: {
        languages: {
          "fr-CA": `${BASE}${path || "/"}`,
          "en-CA": `${BASE}${enPath}`,
          "x-default": `${BASE}${path || "/"}`,
        },
      },
    },
  ]);
}
