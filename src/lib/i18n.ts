export type Lang = "fr" | "en";

export const defaultLang: Lang = "fr";

export function isLang(v: string): v is Lang {
  return v === "fr" || v === "en";
}

const dict = {
  fr: {
    brand: "Montreal Trades",
    tagline: "Soumissions gratuites — Grand Montréal",
    "nav.quote": "Obtenir des soumissions",
    "nav.zones": "Zones",
    "nav.contractors": "Entrepreneurs",
    "nav.home": "Accueil",
    "cta.homeowner": "Obtenir des soumissions gratuites",
    "cta.contractor": "Recevoir des leads",
    "form.title": "Demande de soumission gratuite",
    "form.sub":
      "Décrivez votre projet. Des entrepreneurs locaux vous contactent — sans engagement.",
    "form.name": "Nom complet",
    "form.phone": "Téléphone",
    "form.email": "Courriel",
    "form.trade": "Type de travaux",
    "form.zone": "Arrondissement ou ville",
    "form.message": "Détails du projet (optionnel)",
    "form.submit": "Envoyer ma demande",
    "form.success": "Demande reçue!",
    "form.successBody":
      "Un entrepreneur local vous contactera sous peu — souvent le jour même.",
    "form.error": "Une erreur est survenue. Réessayez ou écrivez-nous.",
    "home.h1a": "Des entrepreneurs locaux",
    "home.h1b": "pour votre projet",
    "home.sub":
      "Grand Montréal : île, Laval et Rive-Sud. Une demande — des appels de pros. Gratuit pour les propriétaires.",
    "home.trust1": "Gratuit pour les propriétaires",
    "home.trust2": "Zones locales seulement",
    "home.trust3": "Réponse souvent le jour même",
    "zones.title": "Grand Montréal",
    "zones.sub":
      "Nous couvrons les arrondissements de Montréal, les villes de l'île, Laval et la Rive-Sud.",
    "join.title": "Recevez des leads exclusifs",
    "join.sub":
      "Des propriétaires de votre zone qui demandent des soumissions. Premier arrivé, accès exclusif.",
    "footer.rights": "Tous droits réservés.",
  },
  en: {
    brand: "Montreal Trades",
    tagline: "Free quotes — Greater Montreal",
    "nav.quote": "Get free quotes",
    "nav.zones": "Areas",
    "nav.contractors": "Contractors",
    "nav.home": "Home",
    "cta.homeowner": "Get free quotes",
    "cta.contractor": "Get leads",
    "form.title": "Free quote request",
    "form.sub":
      "Describe your project. Local licensed trades contact you — no obligation.",
    "form.name": "Full name",
    "form.phone": "Phone",
    "form.email": "Email",
    "form.trade": "Type of work",
    "form.zone": "Borough or city",
    "form.message": "Project details (optional)",
    "form.submit": "Submit request",
    "form.success": "Request received!",
    "form.successBody":
      "A local contractor will contact you shortly — often the same day.",
    "form.error": "Something went wrong. Please try again or email us.",
    "home.h1a": "Local contractors",
    "home.h1b": "for your project",
    "home.sub":
      "Greater Montreal: island, Laval & South Shore. One form — calls from licensed pros. Free for homeowners.",
    "home.trust1": "Free for homeowners",
    "home.trust2": "Local zones only",
    "home.trust3": "Often same-day response",
    "zones.title": "Greater Montreal",
    "zones.sub":
      "We cover Montreal boroughs, island cities, Laval, and the South Shore.",
    "join.title": "Get exclusive leads",
    "join.sub":
      "Homeowners in your zone requesting quotes. First claim gets exclusive access.",
    "footer.rights": "All rights reserved.",
  },
} as const;

export type DictKey = keyof (typeof dict)["fr"];

export function t(lang: Lang, key: DictKey): string {
  return dict[lang][key] ?? dict.fr[key];
}
