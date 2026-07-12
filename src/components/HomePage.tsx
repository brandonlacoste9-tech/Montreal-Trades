import Link from "next/link";
import type { Lang } from "@/lib/i18n";
import { t } from "@/lib/i18n";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import QuoteForm from "@/components/QuoteForm";
import LangHtml from "@/components/LangHtml";
import { ZONE_GROUPS } from "@/lib/zones";
import { hrefFor } from "@/lib/paths";

export default function HomePage({ lang }: { lang: Lang }) {
  const zoneCount = ZONE_GROUPS.reduce((n, g) => n + g.zones.length, 0);

  return (
    <div className="flex min-h-full flex-col bg-[#0c0c0c] text-zinc-100">
      <LangHtml lang={lang} />
      <Navbar lang={lang} />
      <main className="flex-1">
        <section className="relative overflow-hidden border-b border-white/5">
          {/* Sunlit Montreal construction hero — more visible, still readable text */}
          <div
            className="pointer-events-none absolute inset-0 bg-cover bg-center bg-no-repeat opacity-[0.55] sm:opacity-[0.62]"
            style={{ backgroundImage: "url('/hero-montreal.jpg')" }}
            aria-hidden
          />
          <div className="pointer-events-none absolute inset-0 bg-[#0c0c0c]/40" aria-hidden />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#0c0c0c]/85 via-[#0c0c0c]/45 to-transparent" aria-hidden />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0c0c0c]/70 via-transparent to-[#0c0c0c]/25" aria-hidden />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(245,158,11,0.12),_transparent_55%)]" aria-hidden />
          <div className="relative mx-auto grid max-w-5xl gap-12 px-4 py-16 lg:grid-cols-2 lg:py-24">
            <div>
              <p className="mb-4 inline-flex rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-amber-400">
                {t(lang, "tagline")}
              </p>
              <h1 className="text-4xl font-black leading-tight tracking-tight sm:text-5xl">
                <span className="text-white">{t(lang, "home.h1a")}</span>
                <br />
                <span className="text-amber-400">{t(lang, "home.h1b")}</span>
              </h1>
              <p className="mt-5 max-w-md text-lg text-zinc-400">{t(lang, "home.sub")}</p>
              <ul className="mt-8 space-y-3 text-sm text-zinc-300">
                {[t(lang, "home.trust1"), t(lang, "home.trust2"), t(lang, "home.trust3")].map(
                  (item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="mt-0.5 text-amber-400">✓</span>
                      {item}
                    </li>
                  )
                )}
              </ul>
              <p className="mt-6 text-xs text-zinc-500">
                {zoneCount}{" "}
                {lang === "fr" ? "zones couvertes (Grand Montréal)" : "zones covered (Greater Montreal)"}
              </p>
              <div className="mt-8 flex flex-wrap gap-3 lg:hidden">
                <a
                  href="#soumission"
                  className="rounded-xl bg-amber-500 px-5 py-3 text-sm font-bold text-black hover:bg-amber-400"
                >
                  {t(lang, "cta.homeowner")}
                </a>
              </div>
            </div>
            <QuoteForm lang={lang} />
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-4 py-16">
          <h2 className="text-2xl font-bold">{t(lang, "zones.title")}</h2>
          <p className="mt-2 text-zinc-400">{t(lang, "zones.sub")}</p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {ZONE_GROUPS.map((g) => (
              <div
                key={g.id}
                className="rounded-2xl border border-white/10 bg-white/[0.02] p-5"
              >
                <p className="text-sm font-bold text-amber-400">
                  {lang === "fr" ? g.labelFr : g.labelEn}
                </p>
                <p className="mt-2 text-xs leading-relaxed text-zinc-500">
                  {g.zones
                    .slice(0, 6)
                    .map((z) => (lang === "fr" ? z.nameFr : z.nameEn))
                    .join(" · ")}
                  {g.zones.length > 6 ? "…" : ""}
                </p>
              </div>
            ))}
          </div>
          <Link
            href={hrefFor(lang, "zones")}
            className="mt-6 inline-block text-sm font-semibold text-amber-400 hover:underline"
          >
            {lang === "fr" ? "Voir toutes les zones →" : "See all areas →"}
          </Link>
        </section>

        <section className="border-t border-white/5 bg-white/[0.02]">
          <div className="mx-auto max-w-5xl px-4 py-16 text-center">
            <h2 className="text-2xl font-bold">{t(lang, "join.title")}</h2>
            <p className="mx-auto mt-3 max-w-lg text-zinc-400">{t(lang, "join.sub")}</p>
            <Link
              href={hrefFor(lang, "entrepreneurs")}
              className="mt-6 inline-flex rounded-xl border border-amber-500/40 px-6 py-3 text-sm font-bold text-amber-400 hover:bg-amber-500/10"
            >
              {t(lang, "cta.contractor")}
            </Link>
          </div>
        </section>
      </main>
      <Footer lang={lang} />
    </div>
  );
}
