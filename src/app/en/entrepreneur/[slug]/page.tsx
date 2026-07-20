import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProfilePage from "@/components/directory/ProfilePage";
import { buildDirectoryMetadata } from "@/components/directory/directory-seo";
import { getContractorBySlug } from "@/lib/directory-queries";
import { tradeLabel } from "@/lib/directory";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const listing = await getContractorBySlug(slug);
  if (!listing) return { title: "Not found | MTLTrades" };

  const trades = listing.trades.map((t) => tradeLabel(t, "en")).join(", ");
  const title = `${listing.name} — ${trades || "Contractor"} | MTLTrades`;
  const description =
    listing.bio?.slice(0, 155) ||
    `${listing.name} — contractor in Greater Montreal. Contact and free quote via MTLTrades.`;

  return buildDirectoryMetadata({
    lang: "en",
    title,
    description,
    pathFr: `/entrepreneur/${listing.slug}`,
    pathEn: `/en/entrepreneur/${listing.slug}`,
  });
}

export default async function EnEntrepreneurProfilePage({ params }: Props) {
  const { slug } = await params;
  const listing = await getContractorBySlug(slug);
  if (!listing) notFound();

  return <ProfilePage lang="en" listing={listing} />;
}
