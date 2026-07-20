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
  if (!trade) return { title: "Introuvable | MTLTrades" };

  const noun = tradeSeoNoun(trade.id, "fr");
  return buildDirectoryMetadata({
    lang: "fr",
    title: `${noun} Grand Montréal — annuaire | MTLTrades`,
    description: `Trouvez un ${noun.toLowerCase()} sur le Grand Montréal. Profils avec licence RBQ, zones desservies et contact direct.`,
    pathFr: `/annuaire/${trade.slugFr}`,
    pathEn: `/en/annuaire/${trade.slugEn}`,
  });
}

export default async function AnnuaireMetierPage({ params }: Props) {
  const { metier } = await params;
  const trade = getDirectoryTradeBySlug(metier);
  if (!trade) notFound();

  const listings = await listLiveContractors({ tradeId: trade.id });

  return (
    <DirectoryTradePage lang="fr" trade={trade} listings={listings} />
  );
}
