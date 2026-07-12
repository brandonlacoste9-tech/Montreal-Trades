export type Lang = "fr" | "en";

export const defaultLang: Lang = "fr";

export function isLang(v: string): v is Lang {
  return v === "fr" || v === "en";
}

/** Detect lang from pathname: /en... → en, else fr */
export function langFromPath(pathname: string): Lang {
  return pathname === "/en" || pathname.startsWith("/en/") ? "en" : "fr";
}

const dict = {
  fr: {
    brand: "MTLTrades",
    tagline: "Soumissions gratuites — Grand Montréal",
    "nav.quote": "Obtenir des soumissions",
    "nav.zones": "Zones",
    "nav.contractors": "Entrepreneurs",
    "nav.home": "Accueil",
    "nav.login": "Connexion",
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
    "join.badge": "Pour entrepreneurs",
    "join.h1a": "Des appels de vrais propriétaires.",
    "join.h1b": "Exclusifs. Grand Montréal.",
    "join.body":
      "Les propriétaires remplissent le formulaire gratuit. Vous payez un forfait mensuel et réclamez les leads — téléphone inclus, pas de partage à 5 concurrents.",
    "join.login": "Déjà abonné? Connexion →",
    "login.title": "Connexion entrepreneur",
    "login.sub": "Pas de compte?",
    "login.seePlans": "Voir les plans",
    "login.email": "Courriel",
    "login.password": "Mot de passe",
    "login.submit": "Se connecter",
    "login.inactive": "Abonnement inactif — complétez le paiement.",
    "login.error": "Courriel ou mot de passe invalide",
    "login.network": "Erreur réseau",
    "footer.rights": "Tous droits réservés.",
    "lang.label": "Langue",
  },
  en: {
    brand: "MTLTrades",
    tagline: "Free quotes — Greater Montreal",
    "nav.quote": "Get free quotes",
    "nav.zones": "Areas",
    "nav.contractors": "Contractors",
    "nav.home": "Home",
    "nav.login": "Log in",
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
    "join.badge": "For contractors",
    "join.h1a": "Real homeowner calls.",
    "join.h1b": "Exclusive. Greater Montreal.",
    "join.body":
      "Homeowners fill the free form. You pay a monthly plan and claim leads — phone included, not sold to five competitors.",
    "join.login": "Already subscribed? Log in →",
    "login.title": "Contractor login",
    "login.sub": "No account?",
    "login.seePlans": "See plans",
    "login.email": "Email",
    "login.password": "Password",
    "login.submit": "Log in",
    "login.inactive": "Subscription inactive — complete payment first.",
    "login.error": "Invalid email or password",
    "login.network": "Network error",
    "footer.rights": "All rights reserved.",
    "lang.label": "Language",
  },
} as const;

export type DictKey = keyof (typeof dict)["fr"];

export function t(lang: Lang, key: DictKey): string {
  return dict[lang][key] ?? dict.fr[key];
}
