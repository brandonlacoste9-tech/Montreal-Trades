import type { Lang } from "@/lib/i18n";

/** Paths without language prefix (FR is unprefixed). */
const ROUTES = ["", "soumission", "zones", "entrepreneurs"] as const;

/**
 * Strip `/en` prefix and normalize to a bare path key: "" | "soumission" | ...
 */
export function barePath(pathname: string): string {
  let p = pathname.split("?")[0].split("#")[0] || "/";
  if (p.length > 1 && p.endsWith("/")) p = p.slice(0, -1);
  if (p === "/en") return "";
  if (p.startsWith("/en/")) p = p.slice(3);
  if (p.startsWith("/")) p = p.slice(1);
  return p;
}

/** Build href for a logical route in a given language. */
export function hrefFor(lang: Lang, route: string = ""): string {
  const r = route.replace(/^\//, "");
  if (lang === "en") {
    return r ? `/en/${r}` : "/en";
  }
  return r ? `/${r}` : "/";
}

/** Switch language while staying on the same page. */
export function switchLangHref(pathname: string, target: Lang): string {
  return hrefFor(target, barePath(pathname));
}

export function isKnownRoute(route: string): boolean {
  return (ROUTES as readonly string[]).includes(route);
}
