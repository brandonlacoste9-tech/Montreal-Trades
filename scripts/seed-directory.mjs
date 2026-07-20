// Requires env: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
// Usage: node --env-file=.env.local scripts/seed-directory.mjs
//
// Seeds free, live directory contractor profiles (password_hash null / unclaimed).
// Uses only .invalid emails from seed-directory-data.json — do not email them.

import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error(
    "Missing Supabase env (NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)"
  );
  process.exit(1);
}

const dataPath = resolve(__dirname, "seed-directory-data.json");
const rows = JSON.parse(readFileSync(dataPath, "utf8"));

if (!Array.isArray(rows) || rows.length === 0) {
  console.error("seed-directory-data.json is empty or invalid");
  process.exit(1);
}

function slugify(name) {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

const slugCounts = new Map();
function uniqueSlug(name) {
  const base = slugify(name) || "entrepreneur";
  const n = (slugCounts.get(base) || 0) + 1;
  slugCounts.set(base, n);
  return n === 1 ? base : `${base}-${n}`;
}

let ok = 0;
let fail = 0;

for (const row of rows) {
  if (!row?.name || !row?.email || !Array.isArray(row.trades) || !row.trades[0]) {
    console.error("skip invalid row", row?.email || row?.name);
    fail++;
    continue;
  }

  const slug = uniqueSlug(row.name);
  const body = {
    email: String(row.email).toLowerCase(),
    password_hash: null,
    name: row.name,
    phone: row.phone || null,
    trade: row.trades[0] || "general",
    trades: row.trades,
    zones: row.zones || [],
    rbq_number: row.rbq_number || null,
    bio: row.bio || null,
    slug,
    listing_status: "live",
    directory_plan: "free",
    is_featured: false,
    plan: "starter",
    status: "pending",
    market: "grand-montreal",
  };

  const res = await fetch(`${url}/rest/v1/contractors`, {
    method: "POST",
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      Prefer: "return=representation,resolution=merge-duplicates",
    },
    body: JSON.stringify(body),
  });

  const text = await res.text();
  if (res.ok) {
    ok++;
    console.log(res.status, "OK", row.name, `(${slug})`);
  } else {
    fail++;
    console.error(res.status, "FAIL", row.name, text.slice(0, 200));
  }
}

console.log(`\nDone: ${ok} ok, ${fail} failed, ${rows.length} rows in file`);
if (fail > 0) process.exitCode = 1;
