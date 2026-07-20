import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { TRADES } from "@/lib/trades";
import { ALL_ZONES } from "@/lib/zones";
import { insertFreeListing } from "@/lib/directory-queries";
import { notifyNewLead } from "@/lib/telegram";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const tradeIds = TRADES.map((t) => t.id) as string[];
const zoneSlugs = ALL_ZONES.map((z) => z.slug) as string[];

const Body = z.object({
  name: z.string().min(2).max(200),
  email: z.string().email(),
  phone: z.string().min(7).max(40),
  trades: z.array(z.string().refine((v) => tradeIds.includes(v))).min(1).max(5),
  zones: z.array(z.string().refine((v) => zoneSlugs.includes(v))).min(1).max(15),
  rbq_number: z.string().max(40).optional(),
  bio: z.string().max(1000).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const parsed = Body.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid data", details: parsed.error.flatten() },
        { status: 422 }
      );
    }
    const d = parsed.data;
    const result = await insertFreeListing({
      name: d.name,
      email: d.email,
      phone: d.phone,
      trades: d.trades,
      zones: d.zones,
      rbq_number: d.rbq_number,
      bio: d.bio,
    });
    if (!result.ok) {
      console.error("[directory/register]", result.error);
      // Unique email conflict often returns 409 from PostgREST
      if (/duplicate|unique/i.test(result.error)) {
        return NextResponse.json(
          { error: "Email already registered", code: "EMAIL_EXISTS" },
          { status: 409 }
        );
      }
      return NextResponse.json({ error: "Could not create listing" }, { status: 502 });
    }

    await notifyNewLead({
      name: `DIR free: ${d.name}`,
      phone: d.phone,
      email: d.email,
      trade: d.trades.join(","),
      zone: d.zones.slice(0, 3).join(","),
      message: `Nouvelle inscription annuaire. slug=${result.slug}`,
      language: "fr",
    }).catch(() => {});

    return NextResponse.json({
      ok: true,
      id: result.id,
      slug: result.slug,
      url: `/entrepreneur/${result.slug}`,
    });
  } catch (err) {
    console.error("[directory/register]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
