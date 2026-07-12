/**
 * Server-side Supabase REST helpers for Montreal Trades.
 * Prefer SUPABASE_SERVICE_ROLE_KEY for inserts (bypasses RLS).
 */

function isPlaceholder(value: string | undefined): boolean {
  if (!value) return true;
  return /your-|placeholder|change-me/i.test(value);
}

export function getSupabaseConfig(): {
  url: string;
  serviceKey: string | null;
  anonKey: string | null;
} | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url || isPlaceholder(url)) return null;

  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  return {
    url: url.replace(/\/$/, ""),
    serviceKey:
      serviceKey && !isPlaceholder(serviceKey) ? serviceKey : null,
    anonKey: anonKey && !isPlaceholder(anonKey) ? anonKey : null,
  };
}

export function isSupabaseReady(): boolean {
  const cfg = getSupabaseConfig();
  return !!(cfg?.url && cfg.serviceKey);
}
