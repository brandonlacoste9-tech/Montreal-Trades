import type { Lang } from "@/lib/i18n";
import type { DirectoryListing } from "@/lib/directory";
import { isFeaturedActive, tradeLabel } from "@/lib/directory";
import { getZoneBySlug, zoneLabel } from "@/lib/zones";
import { hrefFor } from "@/lib/paths";
import { cn } from "@/lib/cn";

export default function ContractorCard({
  listing,
  lang,
}: {
  listing: DirectoryListing;
  lang: Lang;
}) {
  const featured = isFeaturedActive(listing);
  const profileHref =
    lang === "en"
      ? `/en/entrepreneur/${listing.slug}`
      : `/entrepreneur/${listing.slug}`;

  return (
    <article
      className={cn(
        "rounded-2xl border p-5",
        featured
          ? "border-amber-500/60 bg-amber-500/5"
          : "border-white/10 bg-white/[0.02]"
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h2 className="text-lg font-bold text-white">
            <a href={profileHref} className="hover:text-amber-400">
              {listing.name}
            </a>
          </h2>
          <p className="mt-1 text-sm text-zinc-400">
            {listing.trades.map((t) => tradeLabel(t, lang)).join(" · ")}
          </p>
        </div>
        {featured && (
          <span className="rounded-full bg-amber-500 px-2.5 py-0.5 text-xs font-bold text-black">
            {lang === "fr" ? "En vedette" : "Featured"}
          </span>
        )}
      </div>
      {listing.zones?.length > 0 && (
        <p className="mt-2 text-xs text-zinc-500">
          {listing.zones
            .slice(0, 4)
            .map((z) => {
              const zone = getZoneBySlug(z);
              return zone ? zoneLabel(zone, lang) : z;
            })
            .join(", ")}
          {listing.zones.length > 4 ? "…" : ""}
        </p>
      )}
      {listing.rbq_number && (
        <p className="mt-2 text-xs text-zinc-400">RBQ {listing.rbq_number}</p>
      )}
      <div className="mt-4 flex flex-wrap gap-2">
        {listing.phone && (
          <a
            href={`tel:${listing.phone}`}
            className="rounded-lg bg-amber-500 px-3 py-2 text-xs font-bold text-black hover:bg-amber-400"
          >
            {lang === "fr" ? "Appeler" : "Call"}
          </a>
        )}
        <a
          href={profileHref}
          className="rounded-lg border border-white/15 px-3 py-2 text-xs font-bold text-zinc-200 hover:border-white/30"
        >
          {lang === "fr" ? "Voir le profil" : "View profile"}
        </a>
        <a
          href={`${hrefFor(lang, "soumission")}?trade=${listing.trades[0] || ""}`}
          className="rounded-lg border border-white/15 px-3 py-2 text-xs text-zinc-400 hover:text-white"
        >
          {lang === "fr" ? "Soumission" : "Get quote"}
        </a>
      </div>
    </article>
  );
}
