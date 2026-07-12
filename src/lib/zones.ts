/** Grand Montréal geo — Island boroughs + island cities + Laval + South Shore */

export type ZoneRing = "montreal_borough" | "island_city" | "north" | "south";

export interface Zone {
  slug: string;
  nameFr: string;
  nameEn: string;
  ring: ZoneRing;
}

/** Ville de Montréal — 19 boroughs */
export const MONTREAL_BOROUGHS: Zone[] = [
  { slug: "ahuntsic-cartierville", nameFr: "Ahuntsic-Cartierville", nameEn: "Ahuntsic-Cartierville", ring: "montreal_borough" },
  { slug: "anjou", nameFr: "Anjou", nameEn: "Anjou", ring: "montreal_borough" },
  { slug: "cdn-ndg", nameFr: "Côte-des-Neiges–Notre-Dame-de-Grâce", nameEn: "Côte-des-Neiges–NDG", ring: "montreal_borough" },
  { slug: "lachine", nameFr: "Lachine", nameEn: "Lachine", ring: "montreal_borough" },
  { slug: "lasalle", nameFr: "LaSalle", nameEn: "LaSalle", ring: "montreal_borough" },
  { slug: "plateau", nameFr: "Le Plateau-Mont-Royal", nameEn: "Plateau-Mont-Royal", ring: "montreal_borough" },
  { slug: "sud-ouest", nameFr: "Le Sud-Ouest", nameEn: "Southwest", ring: "montreal_borough" },
  { slug: "ile-bizard", nameFr: "L'Île-Bizard–Sainte-Geneviève", nameEn: "Île-Bizard–Ste-Geneviève", ring: "montreal_borough" },
  { slug: "hochelaga", nameFr: "Mercier–Hochelaga-Maisonneuve", nameEn: "Mercier–Hochelaga-Maisonneuve", ring: "montreal_borough" },
  { slug: "montreal-nord", nameFr: "Montréal-Nord", nameEn: "Montreal North", ring: "montreal_borough" },
  { slug: "outremont", nameFr: "Outremont", nameEn: "Outremont", ring: "montreal_borough" },
  { slug: "pierrefonds", nameFr: "Pierrefonds-Roxboro", nameEn: "Pierrefonds-Roxboro", ring: "montreal_borough" },
  { slug: "rdp-pat", nameFr: "Rivière-des-Prairies–Pointe-aux-Trembles", nameEn: "RDP–Pointe-aux-Trembles", ring: "montreal_borough" },
  { slug: "rosemont", nameFr: "Rosemont–La Petite-Patrie", nameEn: "Rosemont–La Petite-Patrie", ring: "montreal_borough" },
  { slug: "saint-laurent", nameFr: "Saint-Laurent", nameEn: "Saint-Laurent", ring: "montreal_borough" },
  { slug: "saint-leonard", nameFr: "Saint-Léonard", nameEn: "Saint-Léonard", ring: "montreal_borough" },
  { slug: "verdun", nameFr: "Verdun", nameEn: "Verdun", ring: "montreal_borough" },
  { slug: "ville-marie", nameFr: "Ville-Marie", nameEn: "Ville-Marie", ring: "montreal_borough" },
  { slug: "villeray", nameFr: "Villeray–Saint-Michel–Parc-Extension", nameEn: "Villeray–St-Michel–Parc-Ex", ring: "montreal_borough" },
];

/** Independent island municipalities */
export const ISLAND_CITIES: Zone[] = [
  { slug: "baie-durfe", nameFr: "Baie-D'Urfé", nameEn: "Baie-D'Urfé", ring: "island_city" },
  { slug: "beaconsfield", nameFr: "Beaconsfield", nameEn: "Beaconsfield", ring: "island_city" },
  { slug: "cote-saint-luc", nameFr: "Côte-Saint-Luc", nameEn: "Côte-Saint-Luc", ring: "island_city" },
  { slug: "dollard", nameFr: "Dollard-des-Ormeaux", nameEn: "Dollard-des-Ormeaux", ring: "island_city" },
  { slug: "dorval", nameFr: "Dorval", nameEn: "Dorval", ring: "island_city" },
  { slug: "hampstead", nameFr: "Hampstead", nameEn: "Hampstead", ring: "island_city" },
  { slug: "kirkland", nameFr: "Kirkland", nameEn: "Kirkland", ring: "island_city" },
  { slug: "montreal-est", nameFr: "Montréal-Est", nameEn: "Montreal East", ring: "island_city" },
  { slug: "montreal-ouest", nameFr: "Montréal-Ouest", nameEn: "Montreal West", ring: "island_city" },
  { slug: "mont-royal", nameFr: "Mont-Royal", nameEn: "Town of Mount Royal", ring: "island_city" },
  { slug: "pointe-claire", nameFr: "Pointe-Claire", nameEn: "Pointe-Claire", ring: "island_city" },
  { slug: "sainte-anne", nameFr: "Sainte-Anne-de-Bellevue", nameEn: "Sainte-Anne-de-Bellevue", ring: "island_city" },
  { slug: "senneville", nameFr: "Senneville", nameEn: "Senneville", ring: "island_city" },
  { slug: "westmount", nameFr: "Westmount", nameEn: "Westmount", ring: "island_city" },
];

/** North shore — Laval (phase 1) */
export const NORTH_RING: Zone[] = [
  { slug: "laval", nameFr: "Laval", nameEn: "Laval", ring: "north" },
];

/** South Shore inner ring */
export const SOUTH_RING: Zone[] = [
  { slug: "boucherville", nameFr: "Boucherville", nameEn: "Boucherville", ring: "south" },
  { slug: "brossard", nameFr: "Brossard", nameEn: "Brossard", ring: "south" },
  { slug: "longueuil", nameFr: "Longueuil", nameEn: "Longueuil", ring: "south" },
  { slug: "saint-bruno", nameFr: "Saint-Bruno-de-Montarville", nameEn: "Saint-Bruno", ring: "south" },
  { slug: "saint-lambert", nameFr: "Saint-Lambert", nameEn: "Saint-Lambert", ring: "south" },
];

export const ALL_ZONES: Zone[] = [
  ...MONTREAL_BOROUGHS,
  ...ISLAND_CITIES,
  ...NORTH_RING,
  ...SOUTH_RING,
];

export function getZoneBySlug(slug: string): Zone | undefined {
  return ALL_ZONES.find((z) => z.slug === slug);
}

export function zoneLabel(zone: Zone, lang: "fr" | "en"): string {
  return lang === "fr" ? zone.nameFr : zone.nameEn;
}

/** Grouped for form <optgroup> */
export const ZONE_GROUPS: { id: string; labelFr: string; labelEn: string; zones: Zone[] }[] = [
  { id: "boroughs", labelFr: "Arrondissements de Montréal", labelEn: "Montreal boroughs", zones: MONTREAL_BOROUGHS },
  { id: "island", labelFr: "Villes de l'île", labelEn: "Island cities", zones: ISLAND_CITIES },
  { id: "north", labelFr: "Rive-Nord", labelEn: "North Shore", zones: NORTH_RING },
  { id: "south", labelFr: "Rive-Sud", labelEn: "South Shore", zones: SOUTH_RING },
];
