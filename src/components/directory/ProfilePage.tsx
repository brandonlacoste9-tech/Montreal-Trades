import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LangHtml from "@/components/LangHtml";
import type { DirectoryListing } from "@/lib/directory";
import { isFeaturedActive, tradeLabel } from "@/lib/directory";
import { FEATURED_PLAN } from "@/lib/directory-pricing";
import { getZoneBySlug, zoneLabel } from "@/lib/zones";
import type { Lang } from "@/lib/i18n";
import { hrefFor } from "@/lib/paths";
import { cn } from "@/lib/cn";
import FeaturedCheckoutButton from "./FeaturedCheckoutButton";

export default function ProfilePage({
  lang,
  listing,
}: {
  lang: Lang;
  listing: DirectoryListing;
}) {
  const featured = isFeaturedActive(listing);
  const annuaireHref = lang === "en" ? "/en/annuaire" : "/annuaire";
  const primaryTrade = listing.trades[0] || "general";
  const quoteHref = `${hrefFor(lang, "soumission")}?trade=${primaryTrade}`;

  return (
    <div className="flex min-h-full flex-col bg-[#0c0c0c] text-zinc-100">
      <LangHtml lang={lang} />
      <Navbar lang={lang} />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-12">
        <nav className="mb-6 text-sm text-zinc-500">
          <Link href={annuaireHref} className="hover:text-amber-400">
            {lang === "fr" ? "Annuaire" : "Directory"}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-zinc-300">{listing.name}</span>
        </nav>

        <article
          className={cn(
            "rounded-2xl border p-6 sm:p-8",
            featured
              ? "border-amber-500/60 bg-amber-500/5"
              : "border-white/10 bg-white/[0.02]"
          )}
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h1 className="text-3xl font-black text-white">{listing.name}</h1>
              <p className="mt-2 text-zinc-400">
                {listing.trades.map((t) => tradeLabel(t, lang)).join(" · ")}
              </p>
            </div>
            {featured && (
              <span className="rounded-full bg-amber-500 px-3 py-1 text-xs font-bold text-black">
                {lang === "fr" ? "En vedette" : "Featured"}
              </span>
            )}
          </div>

          {listing.bio && (
            <p className="mt-6 whitespace-pre-wrap text-zinc-300 leading-relaxed">
              {listing.bio}
            </p>
          )}

          <dl className="mt-8 grid gap-4 sm:grid-cols-2">
            {listing.phone && (
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                  {lang === "fr" ? "Téléphone" : "Phone"}
                </dt>
                <dd className="mt-1">
                  <a
                    href={`tel:${listing.phone}`}
                    className="font-bold text-amber-400 hover:underline"
                  >
                    {listing.phone}
                  </a>
                </dd>
              </div>
            )}
            {listing.rbq_number && (
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                  RBQ
                </dt>
                <dd className="mt-1 font-medium text-zinc-200">
                  {listing.rbq_number}
                </dd>
              </div>
            )}
            {listing.zones?.length > 0 && (
              <div className="sm:col-span-2">
                <dt className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                  {lang === "fr" ? "Zones desservies" : "Service areas"}
                </dt>
                <dd className="mt-2 flex flex-wrap gap-2">
                  {listing.zones.map((z) => {
                    const zone = getZoneBySlug(z);
                    return (
                      <span
                        key={z}
                        className="rounded-lg border border-white/10 px-2.5 py-1 text-xs text-zinc-300"
                      >
                        {zone ? zoneLabel(zone, lang) : z}
                      </span>
                    );
                  })}
                </dd>
              </div>
            )}
          </dl>

          <div className="mt-8 flex flex-wrap gap-3">
            {listing.phone && (
              <a
                href={`tel:${listing.phone}`}
                className="inline-flex rounded-xl bg-amber-500 px-6 py-3 text-sm font-bold text-black hover:bg-amber-400"
              >
                {lang === "fr" ? "Appeler" : "Call"}
              </a>
            )}
            <Link
              href={quoteHref}
              className="inline-flex rounded-xl border border-white/15 px-6 py-3 text-sm font-bold text-zinc-200 hover:border-white/30"
            >
              {lang === "fr" ? "Demander une soumission" : "Request a quote"}
            </Link>
          </div>
        </article>

        {!featured && listing.slug && (
          <div className="mt-8 rounded-2xl border border-amber-500/40 bg-amber-500/10 p-6 text-center">
            <p className="text-sm font-medium text-zinc-200">
              {lang === "fr"
                ? `Soyez #1 dans votre zone — ${FEATURED_PLAN.priceCad} $/mois. Pas de minimum de leads requis.`
                : `Be #1 in your zone — $${FEATURED_PLAN.priceCad}/mo. No lead minimum required.`}
            </p>
            <p className="mt-2 text-xs text-zinc-500">
              {lang === "fr"
                ? "Vous êtes le propriétaire de ce profil ?"
                : "Own this profile?"}
            </p>
            <div className="mt-4 flex justify-center">
              <FeaturedCheckoutButton
                lang={lang}
                slug={listing.slug}
                className="px-6 py-3"
              />
            </div>
          </div>
        )}

        {featured && (
          <p className="mt-8 text-center text-sm text-zinc-500">
            {lang === "fr"
              ? "Profil en vedette actif."
              : "Featured profile is active."}{" "}
            <Link
              href={hrefFor(lang, "entrepreneurs")}
              className="text-amber-400 underline"
            >
              {lang === "fr" ? "Voir les forfaits leads" : "See lead plans"}
            </Link>
          </p>
        )}
      </main>
      <Footer lang={lang} />
    </div>
  );
}
