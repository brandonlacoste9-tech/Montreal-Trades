import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { appendFile, mkdir } from "fs/promises";
import path from "path";
import { ALL_ZONES } from "@/lib/zones";
import { TRADES } from "@/lib/trades";
import { getSupabaseConfig } from "@/lib/supabase";

export const runtime = "nodejs";

const zoneSlugs = ALL_ZONES.map((z) => z.slug);
const tradeIds = TRADES.map((t) => t.id);

const LeadSchema = z.object({
  name: z.string().min(1).max(200),
  phone: z.string().min(7).max(30),
  email: z.string().email(),
  trade: z.string().refine((v) => tradeIds.includes(v as (typeof tradeIds)[number])),
  zone: z.string().refine((v) => zoneSlugs.includes(v)),
  message: z.string().max(2000).nullable().optional(),
  language: z.enum(["fr", "en"]).optional(),
  website: z.string().max(200).optional(), // honeypot
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = LeadSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid form data", details: parsed.error.flatten() },
        { status: 422 }
      );
    }

    // Bot honeypot
    if (parsed.data.website) {
      return NextResponse.json({ success: true, id: "ok" });
    }

    const lead = {
      ...parsed.data,
      website: undefined,
      created_at: new Date().toISOString(),
      source: "web",
      market: "grand-montreal",
    };

    const sb = getSupabaseConfig();
    const key = sb?.serviceKey ?? sb?.anonKey ?? null;

    if (sb?.url && key) {
      try {
        const res = await fetch(`${sb.url}/rest/v1/leads`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: key,
            Authorization: `Bearer ${key}`,
            Prefer: "return=representation",
          },
          body: JSON.stringify({
            name: lead.name,
            email: lead.email,
            phone: lead.phone,
            project_type: lead.trade,
            city: lead.zone,
            message: lead.message ?? null,
            language: lead.language ?? "fr",
            source: "web",
            status: "new",
            market: "grand-montreal",
          }),
        });
        if (res.ok) {
          const rows = (await res.json()) as { id?: string }[];
          return NextResponse.json({
            success: true,
            id: rows?.[0]?.id ?? "supabase",
            storage: "supabase",
          });
        }
        const errText = await res.text();
        console.error("[leads] supabase insert failed", res.status, errText);
        return NextResponse.json(
          {
            error: "Could not save lead to database",
            code: "SUPABASE_INSERT_FAILED",
            details: errText.slice(0, 300),
          },
          { status: 502 }
        );
      } catch (err) {
        console.error("[leads] supabase error", err);
        return NextResponse.json(
          { error: "Database connection failed", code: "SUPABASE_ERROR" },
          { status: 502 }
        );
      }
    }

    // Local fallback when keys not set yet
    const dataDir = path.join(process.cwd(), "data");
    await mkdir(dataDir, { recursive: true });
    const file = path.join(dataDir, "leads.jsonl");
    await appendFile(file, JSON.stringify(lead) + "\n", "utf8");

    return NextResponse.json({ success: true, id: "local", storage: "file" });
  } catch (err) {
    console.error("[leads]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
