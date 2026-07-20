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
  if (!trade || !zone) return { title: "Not found | MTLTrades" };

  const noun = tradeSeoNoun(trade.id, "en");
  const zName = zoneLabel(zone, "en");
  return buildDirectoryMetadata({
    lang: "en",
    title: `${noun} ${zName} — directory | MTLTrades`,
    description: `${noun} in ${zName} and Greater Montreal. RBQ licence, service areas, direct contact via MTLTrades.`,
    pathFr: `/annuaire/${trade.slugFr}/${zone.slug}`,
    pathEn: `/en/annuaire/${trade.slugEn}/${zone.slug}`,
  });
}

export default async function EnAnnuaireMetierZonePage({ params }: Props) {
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
      lang="en"
      trade={trade}
      zone={zone}
      listings={listings}
    />
  );
}
