import type { Metadata } from "next";

export const SITE_URL = "https://mtltrades.com";
export const SITE_NAME = "MTLTrades";

type PageSeo = {
  titleFr: string;
  titleEn: string;
  descFr: string;
  descEn: string;
  pathFr: string;
  pathEn: string;
};

export function buildMetadata(lang: "fr" | "en", page: PageSeo): Metadata {
  const title = lang === "fr" ? page.titleFr : page.titleEn;
  const description = lang === "fr" ? page.descFr : page.descEn;
  const canonical = `${SITE_URL}${lang === "fr" ? page.pathFr : page.pathEn}`;

  return {
    title,
    description,
    keywords:
      lang === "fr"
        ? [
            "soumission gratuite Montréal",
            "plombier Montréal",
            "électricien Montréal",
            "toiture Montréal",
            "entrepreneur Grand Montréal",
            "leads entrepreneurs Montréal",
            "MTLTrades",
          ]
        : [
            "free contractor quote Montreal",
            "plumber Montreal",
            "electrician Montreal",
            "roofer Montreal",
            "Greater Montreal contractors",
            "exclusive trade leads Montreal",
            "MTLTrades",
          ],
    alternates: {
      canonical,
      languages: {
        "fr-CA": `${SITE_URL}${page.pathFr || "/"}`,
        "en-CA": `${SITE_URL}${page.pathEn}`,
        "x-default": `${SITE_URL}${page.pathFr || "/"}`,
      },
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: SITE_NAME,
      locale: lang === "fr" ? "fr_CA" : "en_CA",
      alternateLocale: lang === "fr" ? "en_CA" : "fr_CA",
      type: "website",
      images: [
        {
          url: "/hero-montreal.jpg",
          width: 1200,
          height: 630,
          alt:
            lang === "fr"
              ? "Entrepreneurs et travaux au Grand Montréal — MTLTrades"
              : "Construction workers Greater Montreal — MTLTrades",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/hero-montreal.jpg"],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true },
    },
  };
}

export const HOME_SEO: PageSeo = {
  titleFr: "MTLTrades — Soumissions gratuites Grand Montréal",
  titleEn: "MTLTrades — Free contractor quotes Greater Montreal",
  descFr:
    "Obtenez des soumissions gratuites de plombiers, électriciens, toiture et rénovation au Grand Montréal. Formulaire rapide — entrepreneurs locaux vous appellent.",
  descEn:
    "Get free quotes from plumbers, electricians, roofers and renovators in Greater Montreal. Fast form — local licensed contractors call you back.",
  pathFr: "/",
  pathEn: "/en",
};

export const QUOTE_SEO: PageSeo = {
  titleFr: "Soumission gratuite entrepreneur Montréal | MTLTrades",
  titleEn: "Free contractor quote Montreal | MTLTrades",
  descFr:
    "Demandez une soumission gratuite : plomberie, électricité, toiture, CVAC, rénovations. Grand Montréal, Laval, Rive-Sud.",
  descEn:
    "Request a free quote: plumbing, electrical, roofing, HVAC, renovations. Greater Montreal, Laval, South Shore.",
  pathFr: "/soumission",
  pathEn: "/en/soumission",
};

export const ZONES_SEO: PageSeo = {
  titleFr: "Zones Grand Montréal — arrondissements et Rive-Sud | MTLTrades",
  titleEn: "Greater Montreal areas — boroughs and South Shore | MTLTrades",
  descFr:
    "MTLTrades couvre les 19 arrondissements de Montréal, les villes de l'île, Laval et la Rive-Sud.",
  descEn:
    "MTLTrades covers Montreal's 19 boroughs, island cities, Laval, and the South Shore.",
  pathFr: "/zones",
  pathEn: "/en/zones",
};

export const CONTRACTOR_SEO: PageSeo = {
  titleFr: "Acheter des leads exclusifs Montréal | MTLTrades",
  titleEn: "Buy exclusive contractor leads Montreal | MTLTrades",
  descFr:
    "Leads propriétaires exclusifs au Grand Montréal. Nom, téléphone, courriel. Plans 149 $ et 299 $ CAD/mois.",
  descEn:
    "Exclusive homeowner leads in Greater Montreal. Name, phone, email. Plans $149 and $299 CAD/month.",
  pathFr: "/entrepreneurs",
  pathEn: "/en/entrepreneurs",
};

export type TradeLanding = {
  slugFr: string;
  slugEn: string;
  tradeId: string;
  titleFr: string;
  titleEn: string;
  h1Fr: string;
  h1En: string;
  descFr: string;
  descEn: string;
  bodyFr: string;
  bodyEn: string;
};

export const TRADE_LANDINGS: TradeLanding[] = [
  {
    slugFr: "plombier-montreal",
    slugEn: "plumber-montreal",
    tradeId: "plumbing",
    titleFr: "Plombier Montréal — soumission gratuite | MTLTrades",
    titleEn: "Plumber Montreal — free quote | MTLTrades",
    h1Fr: "Plombier à Montréal — soumission gratuite",
    h1En: "Plumber in Montreal — free quote",
    descFr:
      "Trouvez un plombier au Grand Montréal. Formulaire gratuit — un pro local vous appelle. Plateau, Laval, Rive-Sud et plus.",
    descEn:
      "Find a plumber in Greater Montreal. Free form — a local pro calls you. Plateau, Laval, South Shore and more.",
    bodyFr:
      "Fuite, chauffe-eau, salle de bain ou drain? Décrivez votre projet. MTLTrades met en relation les propriétaires du Grand Montréal avec des plombiers locaux — gratuit pour vous.",
    bodyEn:
      "Leak, water heater, bathroom, or drain? Describe your project. MTLTrades connects Greater Montreal homeowners with local plumbers — free for you.",
  },
  {
    slugFr: "electricien-montreal",
    slugEn: "electrician-montreal",
    tradeId: "electrical",
    titleFr: "Électricien Montréal — soumission gratuite | MTLTrades",
    titleEn: "Electrician Montreal — free quote | MTLTrades",
    h1Fr: "Électricien à Montréal — soumission gratuite",
    h1En: "Electrician in Montreal — free quote",
    descFr:
      "Électricien au Grand Montréal : panneau, prises, éclairage, VÉ. Soumission gratuite — rappel d'un pro local.",
    descEn:
      "Electrician in Greater Montreal: panel, outlets, lighting, EV. Free quote — a local pro calls back.",
    bodyFr:
      "Mise à niveau électrique, panneau 200A, ou installation? Envoyez votre demande. Un électricien de votre zone peut vous contacter rapidement.",
    bodyEn:
      "Panel upgrade, 200A service, or install? Send your request. An electrician in your area can contact you quickly.",
  },
  {
    slugFr: "toiture-montreal",
    slugEn: "roofing-montreal",
    tradeId: "roofing",
    titleFr: "Toiture Montréal — soumission gratuite | MTLTrades",
    titleEn: "Roofing Montreal — free quote | MTLTrades",
    h1Fr: "Toiture à Montréal — soumission gratuite",
    h1En: "Roofing in Montreal — free quote",
    descFr:
      "Couvreur Grand Montréal : bardeaux, membrane, réparation. Soumission gratuite — entrepreneur local.",
    descEn:
      "Roofer Greater Montreal: shingles, membrane, repairs. Free quote — local contractor.",
    bodyFr:
      "Toiture endommagée ou remplacement? Demandez une soumission gratuite. MTLTrades dessert l'île, Laval et la Rive-Sud.",
    bodyEn:
      "Damaged roof or full replacement? Request a free quote. MTLTrades serves the island, Laval, and the South Shore.",
  },
  {
    slugFr: "renovation-montreal",
    slugEn: "renovation-montreal",
    tradeId: "renovations",
    titleFr: "Rénovation Montréal — soumission gratuite | MTLTrades",
    titleEn: "Renovation Montreal — free quote | MTLTrades",
    h1Fr: "Rénovation à Montréal — soumission gratuite",
    h1En: "Renovation in Montreal — free quote",
    descFr:
      "Rénovation cuisine, sous-sol, condo au Grand Montréal. Formulaire gratuit — entrepreneurs locaux.",
    descEn:
      "Kitchen, basement, condo renovation in Greater Montreal. Free form — local contractors.",
    bodyFr:
      "Projet de rénovation? Décrivez les travaux. Un entrepreneur du Grand Montréal peut vous rappeler pour une estimation.",
    bodyEn:
      "Planning a renovation? Describe the work. A Greater Montreal contractor can call you back for an estimate.",
  },
];

export function getTradeBySlug(slug: string): TradeLanding | undefined {
  return TRADE_LANDINGS.find((t) => t.slugFr === slug || t.slugEn === slug);
}
