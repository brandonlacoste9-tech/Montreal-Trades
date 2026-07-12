/** JSON-LD structured data for Google / AI search */

export function OrganizationJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "MTLTrades",
    url: "https://mtltrades.com",
    logo: "https://mtltrades.com/hero-montreal.jpg",
    description:
      "Soumissions gratuites et leads exclusifs pour les métiers du Grand Montréal. Free contractor quotes and exclusive trade leads in Greater Montreal.",
    areaServed: {
      "@type": "AdministrativeArea",
      name: "Grand Montréal / Greater Montreal",
    },
    sameAs: [],
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function LocalServiceJsonLd({ lang }: { lang: "fr" | "en" }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "Service",
    name:
      lang === "fr"
        ? "Soumissions gratuites entrepreneurs Grand Montréal"
        : "Free contractor quotes Greater Montreal",
    provider: {
      "@type": "Organization",
      name: "MTLTrades",
      url: "https://mtltrades.com",
    },
    areaServed: [
      "Montréal",
      "Laval",
      "Longueuil",
      "Brossard",
      "Rive-Sud",
      "Greater Montreal",
    ],
    serviceType: [
      "Plumbing",
      "Electrical",
      "Roofing",
      "HVAC",
      "Renovations",
      "Plomberie",
      "Électricité",
      "Toiture",
      "CVAC",
      "Rénovations",
    ],
    url: lang === "fr" ? "https://mtltrades.com/soumission" : "https://mtltrades.com/en/soumission",
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function FaqJsonLd({ lang }: { lang: "fr" | "en" }) {
  const faqs =
    lang === "fr"
      ? [
          {
            q: "Comment obtenir une soumission gratuite à Montréal?",
            a: "Remplissez le formulaire MTLTrades avec votre nom, téléphone, type de travaux et arrondissement. Un entrepreneur local vous contacte — souvent le jour même. Gratuit pour les propriétaires.",
          },
          {
            q: "Quelles zones couvrez-vous?",
            a: "Le Grand Montréal : arrondissements de Montréal, villes de l'île, Laval et la Rive-Sud (Longueuil, Brossard, etc.).",
          },
          {
            q: "Comment les entrepreneurs reçoivent-ils des leads?",
            a: "Les entrepreneurs s'abonnent sur MTLTrades (Starter 149 $ ou Pro 299 $ CAD/mois) et réclament des leads exclusifs avec nom, téléphone et courriel.",
          },
          {
            q: "Les leads sont-ils exclusifs?",
            a: "Oui. Lorsqu'un entrepreneur réclame un lead, le contact lui est réservé — pas revendu à cinq concurrents.",
          },
        ]
      : [
          {
            q: "How do I get a free contractor quote in Montreal?",
            a: "Fill out the MTLTrades form with your name, phone, job type, and borough. A local contractor contacts you — often the same day. Free for homeowners.",
          },
          {
            q: "What areas do you cover?",
            a: "Greater Montreal: Montreal boroughs, island cities, Laval, and the South Shore (Longueuil, Brossard, etc.).",
          },
          {
            q: "How do contractors get leads?",
            a: "Contractors subscribe on MTLTrades (Starter $149 or Pro $299 CAD/month) and claim exclusive leads with name, phone, and email.",
          },
          {
            q: "Are leads exclusive?",
            a: "Yes. When a contractor claims a lead, that contact is reserved for them — not sold to five competitors.",
          },
        ];

  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
