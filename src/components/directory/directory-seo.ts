import type { Metadata } from "next";
import { SITE_URL } from "@/lib/seo";
import type { Lang } from "@/lib/i18n";

/** Human-friendly trade noun for SEO titles (e.g. Plombier / Plumber). */
export function tradeSeoNoun(tradeId: string, lang: Lang): string {
  const map: Record<string, { fr: string; en: string }> = {
    plumbing: { fr: "Plombier", en: "Plumber" },
    electrical: { fr: "Électricien", en: "Electrician" },
    roofing: { fr: "Couvreur", en: "Roofer" },
    hvac: { fr: "CVAC", en: "HVAC" },
    renovations: { fr: "Rénovation", en: "Renovation" },
    general: { fr: "Entrepreneur", en: "Contractor" },
    other: { fr: "Entrepreneur", en: "Contractor" },
  };
  const entry = map[tradeId];
  if (!entry) return lang === "fr" ? "Entrepreneur" : "Contractor";
  return lang === "fr" ? entry.fr : entry.en;
}

export function buildDirectoryMetadata(opts: {
  lang: Lang;
  title: string;
  description: string;
  pathFr: string;
  pathEn: string;
}): Metadata {
  const canonical =
    opts.lang === "fr"
      ? `${SITE_URL}${opts.pathFr}`
      : `${SITE_URL}${opts.pathEn}`;

  return {
    title: opts.title,
    description: opts.description,
    alternates: {
      canonical,
      languages: {
        "fr-CA": `${SITE_URL}${opts.pathFr}`,
        "en-CA": `${SITE_URL}${opts.pathEn}`,
        "x-default": `${SITE_URL}${opts.pathFr}`,
      },
    },
    openGraph: {
      title: opts.title,
      description: opts.description,
      url: canonical,
      siteName: "MTLTrades",
      locale: opts.lang === "fr" ? "fr_CA" : "en_CA",
      type: "website",
    },
  };
}
