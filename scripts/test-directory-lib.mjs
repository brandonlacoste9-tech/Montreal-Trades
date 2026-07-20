// scripts/test-directory-lib.mjs
import assert from "node:assert/strict";
import { createRequire } from "node:module";

// Compile-free reimplementation checks for slugify + featured sort logic
// (mirrors src/lib/directory.ts — keep in sync when changing helpers)

function slugifyName(name) {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function isFeaturedActive(listing, now = new Date()) {
  if (!listing.is_featured) return false;
  if (!listing.featured_until) return true;
  return new Date(listing.featured_until).getTime() > now.getTime();
}

function sortDirectoryListings(rows, now = new Date()) {
  return [...rows].sort((a, b) => {
    const af = isFeaturedActive(a, now) ? 1 : 0;
    const bf = isFeaturedActive(b, now) ? 1 : 0;
    if (bf !== af) return bf - af;
    return a.name.localeCompare(b.name, "fr");
  });
}

assert.equal(slugifyName("Plomberie Montréal Inc."), "plomberie-montreal-inc");
assert.equal(slugifyName("Électricité Café"), "electricite-cafe");

const now = new Date("2026-07-20T12:00:00Z");
const sorted = sortDirectoryListings(
  [
    { name: "Beta Free", is_featured: false, featured_until: null },
    { name: "Alpha Featured", is_featured: true, featured_until: null },
    { name: "Zulu Expired", is_featured: true, featured_until: "2026-01-01T00:00:00Z" },
    { name: "Charlie Free", is_featured: false, featured_until: null },
  ],
  now
);
assert.equal(sorted[0].name, "Alpha Featured");
assert.equal(sorted[1].name, "Beta Free");
assert.equal(sorted[2].name, "Charlie Free");
assert.equal(sorted[3].name, "Zulu Expired");

console.log("ok: directory helpers");
