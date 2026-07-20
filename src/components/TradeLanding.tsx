import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LangHtml from "@/components/LangHtml";
import QuoteForm from "@/components/QuoteForm";
import type { Lang } from "@/lib/i18n";
import type { TradeLanding as TradeLandingType } from "@/lib/seo";
import { DIRECTORY_TRADES } from "@/lib/directory";
import { hrefFor } from "@/lib/paths";

export default function TradeLandingPage({
  lang,
  trade,
}: {
  lang: Lang;
  trade: TradeLandingType;
}) {
  const dirTrade = DIRECTORY_TRADES.find((t) => t.id === trade.tradeId);
  const directoryHref = dirTrade
    ? lang === "en"
      ? `/en/annuaire/${dirTrade.slugEn}`
      : `/annuaire/${dirTrade.slugFr}`
    : hrefFor(lang, "annuaire");

  return (
    <div className="flex min-h-full flex-col bg-[#0c0c0c] text-zinc-100">
      <LangHtml lang={lang} />
      <Navbar lang={lang} />
      <main className="flex-1">
        <section className="relative overflow-hidden border-b border-white/5">
          <div
            className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-50"
            style={{ backgroundImage: "url('/hero-montreal.jpg')" }}
            aria-hidden
          />
          <div className="pointer-events-none absolute inset-0 bg-[#0c0c0c]/55" aria-hidden />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#0c0c0c]/90 via-[#0c0c0c]/50 to-transparent" aria-hidden />

          <div className="relative mx-auto grid max-w-5xl gap-12 px-4 py-16 lg:grid-cols-2 lg:py-20">
            <div>
              <p className="mb-3 text-xs font-black uppercase tracking-widest text-amber-400">
                MTLTrades · Grand Montréal
              </p>
              <h1 className="text-3xl font-black leading-tight sm:text-4xl">
                {lang === "fr" ? trade.h1Fr : trade.h1En}
              </h1>
              <p className="mt-4 text-lg text-zinc-300 leading-relaxed">
                {lang === "fr" ? trade.bodyFr : trade.bodyEn}
              </p>
              <ul className="mt-6 space-y-2 text-sm text-zinc-400">
                <li>✓ {lang === "fr" ? "Gratuit pour les propriétaires" : "Free for homeowners"}</li>
                <li>✓ {lang === "fr" ? "Île, Laval, Rive-Sud" : "Island, Laval, South Shore"}</li>
                <li>✓ {lang === "fr" ? "Rappel souvent le jour même" : "Often same-day callback"}</li>
              </ul>
              <div className="mt-6 flex flex-wrap gap-x-4 gap-y-2">
                <Link
                  href={directoryHref}
                  className="inline-block text-sm text-amber-400 hover:underline"
                >
                  {lang === "fr"
                    ? "Voir l'annuaire de ce métier →"
                    : "Browse directory for this trade →"}
                </Link>
                <Link
                  href={hrefFor(lang, "zones")}
                  className="inline-block text-sm text-zinc-400 hover:text-amber-400 hover:underline"
                >
                  {lang === "fr" ? "Voir toutes les zones →" : "See all areas →"}
                </Link>
              </div>
            </div>
            <QuoteForm lang={lang} defaultTrade={trade.tradeId} />
          </div>
        </section>
      </main>
      <Footer lang={lang} />
    </div>
  );
}
