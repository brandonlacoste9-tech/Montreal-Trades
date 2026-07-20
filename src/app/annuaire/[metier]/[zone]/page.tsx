import type { Metadata } from "next";
import { notFound } from "next/navigation";
import DirectoryTradePage from "@/components/directory/DirectoryTradePage";
import {
  buildDirectoryMetadata,
  tradeSeoNoun,
} from "@/components/directory/directory-seo";
import { getDirectoryTradeBySlug } from "@/lib/directory";
import { listLiveContractors } from "@/lib/directory-queries";
import { getZoneBySlug, zoneLabel } from "@/lib/zones";

type Props = { params: Promise<{ metier: string; zone: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { metier, zone: zoneSlug } = await params;
  const trade = getDirectoryTradeBySlug(metier);
  const zone = getZoneBySlug(zoneSlug);
  if (!trade || !zone) return { title: "Introuvable | MTLTrades" };

  const noun = tradeSeoNoun(trade.id, "fr");
  const zName = zoneLabel(zone, "fr");
  return buildDirectoryMetadata({
    lang: "fr",
    title: `${noun} ${zName} — annuaire | MTLTrades`,
    description: `${noun} à ${zName} et Grand Montréal. Licence RBQ, zones desservies, contact direct via MTLTrades.`,
    pathFr: `/annuaire/${trade.slugFr}/${zone.slug}`,
    pathEn: `/en/annuaire/${trade.slugEn}/${zone.slug}`,
  });
}

export default async function AnnuaireMetierZonePage({ params }: Props) {
  const { metier, zone: zoneSlug } = await params;
  const trade = getDirectoryTradeBySlug(metier);
  const zone = getZoneBySlug(zoneSlug);
  if (!trade || !zone) notFound();

  const listings = await listLiveContractors({
    tradeId: trade.id,
    zoneSlug: zone.slug,
  });

  return (
    <DirectoryTradePage
      lang="fr"
      trade={trade}
      zone={zone}
      listings={listings}
    />
  );
}
