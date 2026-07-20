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
  if (!listing) return { title: "Introuvable | MTLTrades" };

  const trades = listing.trades.map((t) => tradeLabel(t, "fr")).join(", ");
  const title = `${listing.name} — ${trades || "Entrepreneur"} | MTLTrades`;
  const description =
    listing.bio?.slice(0, 155) ||
    `${listing.name} — entrepreneur sur le Grand Montréal. Contact et soumission via MTLTrades.`;

  return buildDirectoryMetadata({
    lang: "fr",
    title,
    description,
    pathFr: `/entrepreneur/${listing.slug}`,
    pathEn: `/en/entrepreneur/${listing.slug}`,
  });
}

export default async function EntrepreneurProfilePage({ params }: Props) {
  const { slug } = await params;
  const listing = await getContractorBySlug(slug);
  if (!listing) notFound();

  return <ProfilePage lang="fr" listing={listing} />;
}
