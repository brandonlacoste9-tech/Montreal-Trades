import type { Lang } from "@/lib/i18n";
import { TRADE_LANDINGS } from "@/lib/seo";

/**
 * Strip `/en` prefix → bare path without leading slash.
 * Examples: /en → "" ; /en/soumission → "soumission" ; /plombier-montreal → "plombier-montreal"
 */
export function barePath(pathname: string): string {
  let p = pathname.split("?")[0].split("#")[0] || "/";
  if (p.length > 1 && p.endsWith("/")) p = p.slice(0, -1);
  if (p === "/en") return "";
  if (p.startsWith("/en/")) p = p.slice(4); // remove "/en/"
  else if (p.startsWith("/")) p = p.slice(1);
  return p;
}

/** Logical route pairs that differ by language (FR slug ↔ EN slug). */
function pathPairs(): { fr: string; en: string }[] {
  const base = [
    { fr: "", en: "" },
    { fr: "soumission", en: "soumission" },
    { fr: "zones", en: "zones" },
    { fr: "entrepreneurs", en: "entrepreneurs" },
    { fr: "annuaire", en: "annuaire" },
    { fr: "inscription", en: "inscription" },
    { fr: "dashboard", en: "dashboard" },
    { fr: "dashboard/login", en: "dashboard/login" },
  ];
  const trades = TRADE_LANDINGS.map((t) => ({
    fr: t.slugFr,
    en: t.slugEn,
  }));
  return [...base, ...trades];
}

/** Resolve bare path to FR and EN slugs (without /en prefix). */
function resolvePair(bare: string): { fr: string; en: string } {
  for (const pair of pathPairs()) {
    if (bare === pair.fr || bare === pair.en) return pair;
  }
  // Unknown path: same slug both languages
  return { fr: bare, en: bare };
}

/** Build href for a logical route in a given language. */
export function hrefFor(lang: Lang, route: string = ""): string {
  const bare = route.replace(/^\//, "");
  const pair = resolvePair(bare);
  // If caller passed EN slug while requesting FR (or vice versa), map it
  const slug = lang === "fr" ? pair.fr : pair.en;
  if (lang === "en") {
    return slug ? `/en/${slug}` : "/en";
  }
  return slug ? `/${slug}` : "/";
}

/**
 * Switch language while staying on the same page.
 * Maps FR trade URLs ↔ EN trade URLs (plombier-montreal ↔ plumber-montreal).
 */
export function switchLangHref(pathname: string, target: Lang): string {
  const bare = barePath(pathname);
  const pair = resolvePair(bare);
  const slug = target === "fr" ? pair.fr : pair.en;
  if (target === "en") {
    return slug ? `/en/${slug}` : "/en";
  }
  return slug ? `/${slug}` : "/";
}

export function isKnownRoute(route: string): boolean {
  const bare = route.replace(/^\//, "");
  return pathPairs().some((p) => p.fr === bare || p.en === bare);
}
