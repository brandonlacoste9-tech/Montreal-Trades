import type { Metadata } from "next";
import TradeLandingPage from "@/components/TradeLanding";
import { buildMetadata, getTradeBySlug } from "@/lib/seo";

const trade = getTradeBySlug("renovation-montreal")!;

export const metadata: Metadata = buildMetadata("fr", {
  titleFr: trade.titleFr,
  titleEn: trade.titleEn,
  descFr: trade.descFr,
  descEn: trade.descEn,
  pathFr: `/${trade.slugFr}`,
  pathEn: `/en/${trade.slugEn}`,
});

export default function Page() {
  return <TradeLandingPage lang="fr" trade={trade} />;
}
