import type { TradeId } from "@/lib/trades";
import { TRADES } from "@/lib/trades";
import { getZoneBySlug, type Zone } from "@/lib/zones";

/** URL slug for trade in directory (French path segment). */
export const DIRECTORY_TRADES: {
  id: TradeId;
  slugFr: string;
  slugEn: string;
  nameFr: string;
  nameEn: string;
  week1: boolean;
}[] = [
  { id: "plumbing", slugFr: "plomberie", slugEn: "plumbing", nameFr: "Plomberie", nameEn: "Plumbing", week1: true },
  { id: "electrical", slugFr: "electricite", slugEn: "electrical", nameFr: "Électricité", nameEn: "Electrical", week1: true },
  { id: "roofing", slugFr: "toiture", slugEn: "roofing", nameFr: "Toiture", nameEn: "Roofing", week1: true },
  { id: "hvac", slugFr: "cvac", slugEn: "hvac", nameFr: "CVAC", nameEn: "HVAC", week1: false },
  { id: "renovations", slugFr: "renovation", slugEn: "renovation", nameFr: "Rénovation", nameEn: "Renovations", week1: false },
  { id: "general", slugFr: "general", slugEn: "general", nameFr: "Général", nameEn: "General", week1: false },
  { id: "other", slugFr: "autre", slugEn: "other", nameFr: "Autre", nameEn: "Other", week1: false },
];

export type DirectoryListing = {
  id: string;
  slug: string;
  name: string;
  phone: string | null;
  trades: string[];
  zones: string[];
  rbq_number: string | null;
  bio: string | null;
  photo_url: string | null;
  is_featured: boolean;
  featured_until: string | null;
  listing_status: string;
  directory_plan: string;
};

export function slugifyName(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function isFeaturedActive(
  listing: Pick<DirectoryListing, "is_featured" | "featured_until">,
  now: Date = new Date()
): boolean {
  if (!listing.is_featured) return false;
  if (!listing.featured_until) return true;
  return new Date(listing.featured_until).getTime() > now.getTime();
}

export function sortDirectoryListings<T extends Pick<DirectoryListing, "is_featured" | "featured_until" | "name">>(
  rows: T[],
  now: Date = new Date()
): T[] {
  return [...rows].sort((a, b) => {
    const af = isFeaturedActive(a, now) ? 1 : 0;
    const bf = isFeaturedActive(b, now) ? 1 : 0;
    if (bf !== af) return bf - af;
    return a.name.localeCompare(b.name, "fr");
  });
}

export function getDirectoryTradeBySlug(slug: string) {
  return DIRECTORY_TRADES.find((t) => t.slugFr === slug || t.slugEn === slug);
}

export function getDirectoryTradeById(id: string) {
  return DIRECTORY_TRADES.find((t) => t.id === id);
}

export function tradeLabel(id: string, lang: "fr" | "en"): string {
  const t = getDirectoryTradeById(id) || TRADES.find((x) => x.id === id);
  if (!t) return id;
  return lang === "fr" ? ("nameFr" in t ? t.nameFr : t.fr) : ("nameEn" in t ? t.nameEn : t.en);
}

export function resolveZone(slug: string): Zone | undefined {
  return getZoneBySlug(slug);
}
