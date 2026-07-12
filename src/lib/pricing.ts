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
