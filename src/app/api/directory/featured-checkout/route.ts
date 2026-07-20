import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getStripe, isStripeConfigured } from "@/lib/stripe";
import { featuredPaymentLink, featuredPriceId } from "@/lib/directory-pricing";
import { sbFetch } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const Body = z.object({
  contractorId: z.string().uuid().optional(),
  email: z.string().email().optional(),
  slug: z.string().min(1).optional(),
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

    let contractorId = parsed.data.contractorId;

    if (!contractorId && parsed.data.slug) {
      const r = await sbFetch<{ id: string }[]>(
        `contractors?slug=eq.${encodeURIComponent(parsed.data.slug)}&select=id&limit=1`
      );
      contractorId = r.data?.[0]?.id;
    }

    if (!contractorId && parsed.data.email) {
      const emailNorm = parsed.data.email.trim().toLowerCase();
      const r = await sbFetch<{ id: string }[]>(
        `contractors?email=eq.${encodeURIComponent(emailNorm)}&select=id&limit=1`
      );
      contractorId = r.data?.[0]?.id;
    }

    if (!contractorId) {
      return NextResponse.json({ error: "Contractor not found" }, { status: 404 });
    }

    const priceId = featuredPriceId();
    if (!isStripeConfigured() || !priceId) {
      const link = featuredPaymentLink();
      if (link) {
        const emailQ = parsed.data.email
          ? `?prefilled_email=${encodeURIComponent(parsed.data.email.trim().toLowerCase())}`
          : "";
        return NextResponse.json({ url: `${link}${emailQ}`, mode: "payment_link" });
      }
      return NextResponse.json(
        { error: "Featured Stripe price not configured", code: "STRIPE_NOT_CONFIGURED" },
        { status: 503 }
      );
    }

    const stripe = getStripe()!;
    const origin =
      req.headers.get("origin") ||
      process.env.NEXT_PUBLIC_SITE_URL ||
      "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer_email: parsed.data.email?.trim().toLowerCase(),
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${origin}/entrepreneur/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/entrepreneurs?canceled=1`,
      metadata: {
        contractor_id: contractorId,
        product: "featured",
        plan: "featured",
      },
      subscription_data: {
        metadata: {
          contractor_id: contractorId,
          product: "featured",
          plan: "featured",
        },
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("[featured-checkout]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Checkout failed" },
      { status: 500 }
    );
  }
}
