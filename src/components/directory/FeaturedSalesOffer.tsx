import Link from "next/link";
import { FEATURED_PLAN } from "@/lib/directory-pricing";
import type { Lang } from "@/lib/i18n";
import { hrefFor } from "@/lib/paths";
import FeaturedCheckoutButton from "./FeaturedCheckoutButton";

/**
 * Featured $79 plan card for the entrepreneurs sales page.
 * When slug/email is known → Stripe checkout; otherwise → inscription first.
 */
export default function FeaturedSalesOffer({
  lang,
  slug,
  email,
}: {
  lang: Lang;
  slug?: string;
  email?: string;
}) {
  const inscriptionHref = hrefFor(lang, "inscription");
  const canCheckout = Boolean(slug || email);
  const features = lang === "fr" ? FEATURED_PLAN.featuresFr : FEATURED_PLAN.featuresEn;

  return (
    <section className="rounded-2xl border border-amber-500/50 bg-amber-500/10 p-6 sm:p-7">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-widest text-amber-400">
            {lang === "fr" ? "Visibilité" : "Visibility"}
          </p>
          <h2 className="mt-1 text-xl font-black text-white sm:text-2xl">
            {lang === "fr" ? FEATURED_PLAN.nameFr : FEATURED_PLAN.nameEn}
          </h2>
        </div>
        <p className="text-2xl font-black text-amber-400">
          {FEATURED_PLAN.priceCad}&nbsp;$
          <span className="text-sm font-medium text-zinc-400">
            {lang === "fr" ? "/mois" : "/mo"}
          </span>
        </p>
      </div>

      <p className="mt-3 text-base font-medium text-zinc-200">
        {lang === "fr"
          ? `Soyez #1 dans votre zone — ${FEATURED_PLAN.priceCad} $/mois. Pas de minimum de leads requis.`
          : `Be #1 in your zone — $${FEATURED_PLAN.priceCad}/mo. No lead minimum required.`}
      </p>

      <ul className="mt-4 space-y-1.5 text-sm text-zinc-400">
        {features.map((f) => (
          <li key={f}>✓ {f}</li>
        ))}
      </ul>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        {canCheckout ? (
          <FeaturedCheckoutButton
            lang={lang}
            slug={slug}
            email={email}
            className="px-6 py-3"
          />
        ) : (
          <Link
            href={inscriptionHref}
            className="inline-flex rounded-xl bg-amber-500 px-6 py-3 text-sm font-bold text-black transition hover:bg-amber-400"
          >
            {lang === "fr"
              ? `Passer en vedette — ${FEATURED_PLAN.priceCad} $/mois`
              : `Go featured — $${FEATURED_PLAN.priceCad}/mo`}
          </Link>
        )}
        <Link
          href={inscriptionHref}
          className="text-sm font-bold text-amber-400 hover:underline"
        >
          {lang === "fr"
            ? "Inscription gratuite d'abord →"
            : "Free listing first →"}
        </Link>
      </div>
    </section>
  );
}
