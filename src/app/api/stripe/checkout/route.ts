import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { getStripe, isStripeConfigured } from "@/lib/stripe";
import { type PlanId, priceEnvKey, STRIPE_PRICE_IDS, STRIPE_LINKS } from "@/lib/pricing";
import { TRADES } from "@/lib/trades";
import { sbFetch } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const tradeIds = TRADES.map((t) => t.id) as string[];

const Body = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(100),
  name: z.string().min(1).max(200),
  phone: z.string().max(40).optional(),
  trade: z.string().refine((v) => tradeIds.includes(v)),
  plan: z.enum(["starter", "pro"]),
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

    const { email, password, name, phone, trade, plan } = parsed.data;
    const planId = plan as PlanId;
    const priceId =
      process.env[priceEnvKey(planId)] || STRIPE_PRICE_IDS[planId];

    // No secret key yet → return Payment Link (still collects money)
    if (!isStripeConfigured()) {
      const link = STRIPE_LINKS[planId];
      const emailQ = encodeURIComponent(email.trim().toLowerCase());
      return NextResponse.json({
        url: `${link}?prefilled_email=${emailQ}`,
        mode: "payment_link",
        note: "Account created after you add STRIPE_SECRET_KEY + webhook; payment link works now.",
      });
    }

    const password_hash = await bcrypt.hash(password, 10);
    const emailNorm = email.trim().toLowerCase();

    // Existing contractor?
    const existing = await sbFetch<
      { id: string; status: string; stripe_customer_id: string | null }[]
    >(`contractors?email=eq.${encodeURIComponent(emailNorm)}&select=id,status,stripe_customer_id`);

    let contractorId: string;

    if (existing.ok && Array.isArray(existing.data) && existing.data[0]) {
      const row = existing.data[0];
      if (row.status === "active") {
        return NextResponse.json(
          {
            error: "Already subscribed",
            code: "ALREADY_ACTIVE",
            message: "Connectez-vous à /dashboard",
          },
          { status: 409 }
        );
      }
      contractorId = row.id;
      await sbFetch(`contractors?id=eq.${contractorId}`, {
        method: "PATCH",
        body: JSON.stringify({
          password_hash,
          name,
          phone: phone || null,
          trade,
          plan: planId,
        }),
        prefer: "return=minimal",
      });
    } else {
      const created = await sbFetch<{ id: string }[]>(`contractors`, {
        method: "POST",
        prefer: "return=representation",
        body: JSON.stringify({
          email: emailNorm,
          password_hash,
          name,
          phone: phone || null,
          trade,
          plan: planId,
          status: "pending",
        }),
      });
      if (!created.ok || !Array.isArray(created.data) || !created.data[0]) {
        console.error("[checkout] create contractor", created.status, created.text);
        return NextResponse.json(
          { error: "Could not create account", details: created.text.slice(0, 200) },
          { status: 502 }
        );
      }
      contractorId = created.data[0].id;
    }

    const stripe = getStripe()!;
    const origin =
      req.headers.get("origin") ||
      process.env.NEXT_PUBLIC_SITE_URL ||
      "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer_email: emailNorm,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${origin}/dashboard?welcome=1`,
      cancel_url: `${origin}/entrepreneurs?canceled=1`,
      metadata: {
        contractor_id: contractorId,
        plan: planId,
      },
      subscription_data: {
        metadata: {
          contractor_id: contractorId,
          plan: planId,
        },
      },
    });

    return NextResponse.json({ url: session.url, contractorId });
  } catch (err) {
    console.error("[checkout]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Checkout failed" },
      { status: 500 }
    );
  }
}
