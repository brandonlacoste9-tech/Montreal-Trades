import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { appendFile, mkdir } from "fs/promises";
import path from "path";
import { ALL_ZONES } from "@/lib/zones";
import { TRADES } from "@/lib/trades";

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

    // Optional Supabase when configured
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (url && key && !/your-|placeholder/i.test(url) && !/your-|placeholder/i.test(key)) {
      try {
        const res = await fetch(`${url}/rest/v1/leads`, {
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
            message: lead.message,
            language: lead.language ?? "fr",
            source: "web",
            status: "new",
          }),
        });
        if (res.ok) {
          const rows = (await res.json()) as { id?: string }[];
          return NextResponse.json({ success: true, id: rows?.[0]?.id ?? "supabase" });
        }
        console.error("[leads] supabase insert failed", res.status, await res.text());
      } catch (err) {
        console.error("[leads] supabase error", err);
      }
    }

    // Local fallback — JSONL under data/ (gitignored)
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
