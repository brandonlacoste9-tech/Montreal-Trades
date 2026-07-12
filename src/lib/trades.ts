export const TRADES = [
  { id: "plumbing", fr: "Plomberie", en: "Plumbing" },
  { id: "electrical", fr: "Électricité", en: "Electrical" },
  { id: "hvac", fr: "CVAC / chauffage", en: "HVAC / heating" },
  { id: "roofing", fr: "Toiture", en: "Roofing" },
  { id: "renovations", fr: "Rénovations", en: "Renovations" },
  { id: "general", fr: "Entrepreneur général", en: "General contracting" },
  { id: "other", fr: "Autre", en: "Other" },
] as const;

export type TradeId = (typeof TRADES)[number]["id"];
