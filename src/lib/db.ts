import { getSupabaseConfig } from "@/lib/supabase";

/** REST helpers for service-role Supabase */
export async function sbFetch<T = unknown>(
  path: string,
  init?: RequestInit & { prefer?: string }
): Promise<{ ok: boolean; status: number; data: T; text: string }> {
  const sb = getSupabaseConfig();
  const key = sb?.serviceKey;
  if (!sb?.url || !key) {
    return { ok: false, status: 0, data: null as T, text: "missing supabase" };
  }

  const headers: Record<string, string> = {
    apikey: key,
    Authorization: `Bearer ${key}`,
    "Content-Type": "application/json",
    ...(init?.headers as Record<string, string>),
  };
  if (init?.prefer) headers.Prefer = init.prefer;

  const res = await fetch(`${sb.url}/rest/v1/${path}`, {
    ...init,
    headers,
  });
  const text = await res.text();
  let data: T = null as T;
  try {
    data = text ? (JSON.parse(text) as T) : (null as T);
  } catch {
    /* raw */
  }
  return { ok: res.ok, status: res.status, data, text };
}
