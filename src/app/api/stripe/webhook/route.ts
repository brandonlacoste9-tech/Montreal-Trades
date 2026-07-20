import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { sbFetch } from "@/lib/db";
import { notifyNewLead } from "@/lib/telegram";
import type Stripe from "stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const stripe = getStripe();
  const whSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripe || !whSecret) {
    return NextResponse.json({ error: "Webhook not configured" }, { status: 503 });
  }

  const raw = await req.text();
  const sig = req.headers.get("stripe-signature");
  if (!sig) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(raw, sig, whSecret);
  } catch (err) {
    console.error("[webhook] signature", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const contractorId = session.metadata?.contractor_id;
      const product = session.metadata?.product;
      const plan = session.metadata?.plan || "starter";

      if (contractorId && product === "featured") {
        const until = new Date();
        until.setMonth(until.getMonth() + 1);
        await sbFetch(`contractors?id=eq.${contractorId}`, {
          method: "PATCH",
          prefer: "return=minimal",
          body: JSON.stringify({
            is_featured: true,
            directory_plan: "featured",
            featured_until: until.toISOString(),
            stripe_featured_subscription_id: session.subscription,
            listing_status: "live",
          }),
        });
        await notifyNewLead({
          name: `FEATURED contractor`,
          phone: "—",
          email: session.customer_email || "—",
          trade: "featured",
          zone: "grand-montreal",
          message: `Nouveau abonnement En vedette. contractor_id=${contractorId}`,
          language: "fr",
        });
      } else if (contractorId) {
        // Lead plan path (starter/pro) — do not touch directory featured fields
        await sbFetch(`contractors?id=eq.${contractorId}`, {
          method: "PATCH",
          prefer: "return=minimal",
          body: JSON.stringify({
            status: "active",
            plan,
            stripe_customer_id: session.customer,
            stripe_subscription_id: session.subscription,
          }),
        });
        await notifyNewLead({
          name: `PAID contractor (${plan})`,
          phone: "—",
          email: session.customer_email || "—",
          trade: "subscription",
          zone: "grand-montreal",
          message: `Nouveau abonnement ${plan}. contractor_id=${contractorId}`,
          language: "fr",
        });
      }
    }

    if (
      event.type === "customer.subscription.deleted" ||
      event.type === "customer.subscription.updated"
    ) {
      const sub = event.data.object as Stripe.Subscription;
      const contractorId = sub.metadata?.contractor_id;
      const product = sub.metadata?.product;

      if (contractorId && product === "featured") {
        // Featured-only path: never clobber lead plan/status
        const isActive = sub.status === "active" || sub.status === "trialing";
        if (isActive) {
          // Stripe API 2025+: period end lives on subscription items
          const periodEnd = sub.items?.data?.[0]?.current_period_end;
          const until = periodEnd
            ? new Date(periodEnd * 1000).toISOString()
            : null;
          await sbFetch(`contractors?id=eq.${contractorId}`, {
            method: "PATCH",
            prefer: "return=minimal",
            body: JSON.stringify({
              is_featured: true,
              directory_plan: "featured",
              featured_until: until,
              stripe_featured_subscription_id: sub.id,
            }),
          });
        } else {
          await sbFetch(`contractors?id=eq.${contractorId}`, {
            method: "PATCH",
            prefer: "return=minimal",
            body: JSON.stringify({
              is_featured: false,
              directory_plan: "free",
              featured_until: null,
              stripe_featured_subscription_id: null,
            }),
          });
        }
      } else if (contractorId) {
        // Lead plan path
        const status =
          sub.status === "active" || sub.status === "trialing"
            ? "active"
            : sub.status === "past_due"
              ? "past_due"
              : "canceled";
        await sbFetch(`contractors?id=eq.${contractorId}`, {
          method: "PATCH",
          prefer: "return=minimal",
          body: JSON.stringify({
            status,
            stripe_subscription_id: sub.id,
          }),
        });
      }
    }
  } catch (err) {
    console.error("[webhook] handler", err);
    return NextResponse.json({ error: "Handler failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
