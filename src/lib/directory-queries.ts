import { sbFetch } from "@/lib/db";
import {
  type DirectoryListing,
  isFeaturedActive,
  sortDirectoryListings,
  slugifyName,
} from "@/lib/directory";

const SELECT =
  "id,slug,name,phone,trades,zones,rbq_number,bio,photo_url,is_featured,featured_until,listing_status,directory_plan";

export async function listLiveContractors(opts?: {
  tradeId?: string;
  zoneSlug?: string;
}): Promise<DirectoryListing[]> {
  // PostgREST: listing_status=eq.live
  let path = `contractors?listing_status=eq.live&select=${SELECT}`;
  if (opts?.tradeId) {
    path += `&trades=cs.{${opts.tradeId}}`;
  }
  if (opts?.zoneSlug) {
    path += `&zones=cs.{${opts.zoneSlug}}`;
  }
  path += `&order=name.asc`;

  const res = await sbFetch<DirectoryListing[]>(path);
  if (!res.ok || !Array.isArray(res.data)) return [];
  return sortDirectoryListings(res.data);
}

export async function getContractorBySlug(
  slug: string
): Promise<DirectoryListing | null> {
  const res = await sbFetch<DirectoryListing[]>(
    `contractors?slug=eq.${encodeURIComponent(slug)}&listing_status=eq.live&select=${SELECT}&limit=1`
  );
  if (!res.ok || !Array.isArray(res.data) || !res.data[0]) return null;
  return res.data[0];
}

export async function ensureUniqueSlug(base: string): Promise<string> {
  let slug = slugifyName(base) || "entrepreneur";
  for (let i = 0; i < 20; i++) {
    const candidate = i === 0 ? slug : `${slug}-${i + 1}`;
    const res = await sbFetch<{ id: string }[]>(
      `contractors?slug=eq.${encodeURIComponent(candidate)}&select=id&limit=1`
    );
    if (!res.ok || !Array.isArray(res.data) || res.data.length === 0) {
      return candidate;
    }
  }
  return `${slug}-${Date.now().toString(36)}`;
}

export async function insertFreeListing(input: {
  name: string;
  email: string;
  phone?: string | null;
  trades: string[];
  zones: string[];
  rbq_number?: string | null;
  bio?: string | null;
}): Promise<{ ok: true; id: string; slug: string } | { ok: false; error: string }> {
  const emailNorm = input.email.trim().toLowerCase();
  const slug = await ensureUniqueSlug(input.name);
  const primaryTrade = input.trades[0] || "general";

  const created = await sbFetch<{ id: string; slug: string }[]>("contractors", {
    method: "POST",
    prefer: "return=representation",
    body: JSON.stringify({
      email: emailNorm,
      password_hash: null,
      name: input.name.trim(),
      phone: input.phone || null,
      trade: primaryTrade,
      trades: input.trades,
      zones: input.zones,
      rbq_number: input.rbq_number || null,
      bio: input.bio || null,
      slug,
      listing_status: "live",
      directory_plan: "free",
      is_featured: false,
      plan: "starter",
      status: "pending",
    }),
  });

  if (!created.ok || !Array.isArray(created.data) || !created.data[0]) {
    return { ok: false, error: created.text.slice(0, 300) || "insert failed" };
  }
  return { ok: true, id: created.data[0].id, slug: created.data[0].slug || slug };
}

export { isFeaturedActive };
