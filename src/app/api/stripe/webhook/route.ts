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
      const plan = session.metadata?.plan || "starter";
      if (contractorId) {
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
        // Ping owner on Telegram
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
      if (contractorId) {
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
