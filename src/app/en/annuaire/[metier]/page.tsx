import type { Metadata } from "next";
import { notFound } from "next/navigation";
import DirectoryTradePage from "@/components/directory/DirectoryTradePage";
import {
  buildDirectoryMetadata,
  tradeSeoNoun,
} from "@/components/directory/directory-seo";
import { getDirectoryTradeBySlug } from "@/lib/directory";
import { listLiveContractors } from "@/lib/directory-queries";

type Props = { params: Promise<{ metier: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { metier } = await params;
  const trade = getDirectoryTradeBySlug(metier);
  if (!trade) return { title: "Not found | MTLTrades" };

  const noun = tradeSeoNoun(trade.id, "en");
  return buildDirectoryMetadata({
    lang: "en",
    title: `${noun} Greater Montreal — directory | MTLTrades`,
    description: `Find a ${noun.toLowerCase()} in Greater Montreal. Profiles with RBQ licence, service areas, and direct contact.`,
    pathFr: `/annuaire/${trade.slugFr}`,
    pathEn: `/en/annuaire/${trade.slugEn}`,
  });
}

export default async function EnAnnuaireMetierPage({ params }: Props) {
  const { metier } = await params;
  const trade = getDirectoryTradeBySlug(metier);
  // Prefer EN slugs on EN routes; still accept known FR slug to avoid hard 404
  if (!trade) notFound();

  const listings = await listLiveContractors({ tradeId: trade.id });

  return (
    <DirectoryTradePage lang="en" trade={trade} listings={listings} />
  );
}
