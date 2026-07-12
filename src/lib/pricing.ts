export type PlanId = "starter" | "pro";

export const PLANS: Record<
  PlanId,
  {
    id: PlanId;
    nameFr: string;
    nameEn: string;
    priceCad: number;
    claimLimit: number | null; // null = unlimited
    featuresFr: string[];
    featuresEn: string[];
  }
> = {
  starter: {
    id: "starter",
    nameFr: "Starter",
    nameEn: "Starter",
    priceCad: 149,
    claimLimit: 15,
    featuresFr: [
      "15 leads exclusifs / mois",
      "Nom, téléphone, courriel",
      "Grand Montréal",
      "Alerte dès qu'un lead sort",
    ],
    featuresEn: [
      "15 exclusive leads / month",
      "Name, phone, email",
      "Greater Montreal",
      "Alert when a lead drops",
    ],
  },
  pro: {
    id: "pro",
    nameFr: "Pro",
    nameEn: "Pro",
    priceCad: 299,
    claimLimit: null,
    featuresFr: [
      "Leads exclusifs illimités",
      "Priorité sur le plan Starter",
      "Tous métiers / zones",
      "Support prioritaire",
    ],
    featuresEn: [
      "Unlimited exclusive leads",
      "Priority over Starter",
      "All trades / zones",
      "Priority support",
    ],
  },
};

export function priceEnvKey(plan: PlanId): string {
  return plan === "pro" ? "STRIPE_PRICE_PRO" : "STRIPE_PRICE_STARTER";
}

/** Public Stripe Payment Links (fallback when Checkout API secret not set). */
export function paymentLink(plan: PlanId): string | null {
  if (typeof window !== "undefined") {
    const v =
      plan === "pro"
        ? process.env.NEXT_PUBLIC_STRIPE_LINK_PRO
        : process.env.NEXT_PUBLIC_STRIPE_LINK_STARTER;
    return v || null;
  }
  const v =
    plan === "pro"
      ? process.env.NEXT_PUBLIC_STRIPE_LINK_PRO
      : process.env.NEXT_PUBLIC_STRIPE_LINK_STARTER;
  return v || null;
}

export const STRIPE_LINKS = {
  starter: "https://buy.stripe.com/5kQ3cu6hnbSlc0e6Xn1Fe1j",
  pro: "https://buy.stripe.com/8x24gydJP8G9ggu1D31Fe1k",
} as const;

export const STRIPE_PRICE_IDS = {
  starter: "price_1TsP50CzqBvMqSYFRoQ2kg0G",
  pro: "price_1TsP51CzqBvMqSYF1nKMP9oN",
} as const;

