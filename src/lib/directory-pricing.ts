export const FEATURED_PLAN = {
  id: "featured" as const,
  nameFr: "En vedette",
  nameEn: "Featured",
  priceCad: 79,
  featuresFr: [
    "En tête des listes métier × zone",
    "Badge En vedette",
    "Profil public prioritaire",
    "Annulation en tout temps",
  ],
  featuresEn: [
    "Top of trade × zone lists",
    "Featured badge",
    "Priority public profile",
    "Cancel anytime",
  ],
};

/** Set STRIPE_PRICE_FEATURED in env; optional public payment link fallback. */
export function featuredPriceId(): string | null {
  return process.env.STRIPE_PRICE_FEATURED || process.env.NEXT_PUBLIC_STRIPE_PRICE_FEATURED || null;
}

export function featuredPaymentLink(): string | null {
  return process.env.NEXT_PUBLIC_STRIPE_LINK_FEATURED || null;
}
