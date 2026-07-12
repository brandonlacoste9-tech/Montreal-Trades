import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { appendFile, mkdir } from "fs/promises";
import path from "path";
import { ALL_ZONES } from "@/lib/zones";
import { TRADES } from "@/lib/trades";
import { getSupabaseConfig } from "@/lib/supabase";
import { isTelegramConfigured, notifyNewLead } from "@/lib/telegram";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const zoneSlugs = ALL_ZONES.map((z) => z.slug);
const tradeIds = TRADES.map((t) => t.id) as string[];

const LeadSchema = z.object({
  name: z.string().min(1).max(200),
  // Allow spaces/dashes; normalize later
  phone: z
    .string()
    .min(7)
    .max(40)
    .transform((v) => v.replace(/[^\d+]/g, ""))
    .refine((v) => v.replace(/\D/g, "").length >= 7, "phone too short"),
  email: z.string().email(),
  trade: z.string().refine((v) => tradeIds.includes(v), "invalid trade"),
  zone: z.string().refine((v) => zoneSlugs.includes(v), "invalid zone"),
  message: z.string().max(2000).nullable().optional(),
  language: z.enum(["fr", "en"]).optional(),
  website: z.string().max(200).optional(),
});

export async function GET() {
  const sb = getSupabaseConfig();
  return NextResponse.json({
    ok: true,
    supabaseUrl: !!sb?.url,
    hasServiceKey: !!sb?.serviceKey,
    hasAnonKey: !!sb?.anonKey,
    telegram: isTelegramConfigured(),
    table: "quote_leads",
  });
}

export async function POST(req: NextRequest) {
  try {
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON body", code: "BAD_JSON" },
        { status: 400 }
      );
    }

    const parsed = LeadSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Invalid form data",
          code: "VALIDATION",
          details: parsed.error.flatten(),
        },
        { status: 422 }
      );
    }

    // Bot honeypot
    if (parsed.data.website) {
      return NextResponse.json({ success: true, id: "ok" });
    }

    const lead = parsed.data;
    const sb = getSupabaseConfig();
    const key = sb?.serviceKey ?? sb?.anonKey ?? null;

    if (!sb?.url || !key) {
      // Netlify/serverless: do not rely on writable disk
      console.error("[leads] missing Supabase env on server");
      return NextResponse.json(
        {
          error: "Server not configured",
          code: "MISSING_SUPABASE_ENV",
          message:
            "Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY on the host, then redeploy.",
        },
        { status: 503 }
      );
    }

    const res = await fetch(`${sb.url}/rest/v1/quote_leads`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: key,
        Authorization: `Bearer ${key}`,
        Prefer: "return=representation",
      },
      body: JSON.stringify({
        name: lead.name.trim(),
        email: lead.email.trim().toLowerCase(),
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
      const rows = (await res.json()) as { id?: string }[] | { id?: string };
      const id = Array.isArray(rows) ? rows[0]?.id : rows?.id;

      // Telegram alert (does not block success if Telegram fails)
      const telegramOk = await notifyNewLead({
        id,
        name: lead.name.trim(),
        phone: lead.phone,
        email: lead.email.trim().toLowerCase(),
        trade: lead.trade,
        zone: lead.zone,
        message: lead.message,
        language: lead.language ?? "fr",
      });

      return NextResponse.json({
        success: true,
        id: id ?? "supabase",
        storage: "supabase",
        telegram: telegramOk,
      });
    }

    const errText = await res.text();
    console.error("[leads] supabase insert failed", res.status, errText);

    // Local/dev only fallback
    if (process.env.NODE_ENV === "development") {
      try {
        const dir =
          process.env.NETLIFY || process.env.AWS_LAMBDA_FUNCTION_NAME
            ? "/tmp"
            : path.join(process.cwd(), "data");
        await mkdir(dir, { recursive: true });
        await appendFile(
          path.join(dir, "leads.jsonl"),
          JSON.stringify({ ...lead, err: errText, at: new Date().toISOString() }) +
            "\n",
          "utf8"
        );
      } catch {
        /* ignore */
      }
    }

    return NextResponse.json(
      {
        error: "Could not save lead",
        code: "SUPABASE_INSERT_FAILED",
        status: res.status,
        details: errText.slice(0, 400),
      },
      { status: 502 }
    );
  } catch (err) {
    console.error("[leads]", err);
    return NextResponse.json(
      {
        error: "Server error",
        code: "INTERNAL",
        message: err instanceof Error ? err.message : "unknown",
      },
      { status: 500 }
    );
  }
}
