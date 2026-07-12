"use client";

import type { Lang } from "@/lib/i18n";
import { t } from "@/lib/i18n";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import QuoteForm from "@/components/QuoteForm";
import LangHtml from "@/components/LangHtml";
import { ZONE_GROUPS } from "@/lib/zones";
import { hrefFor } from "@/lib/paths";
import { useLang } from "@/hooks/useLang";

export default function HomePage({ lang: langProp }: { lang: Lang }) {
  const lang = useLang() || langProp;
  const zoneCount = ZONE_GROUPS.reduce((n, g) => n + g.zones.length, 0);

  return (
    <div className="flex min-h-full flex-col bg-[#0c0c0c] text-zinc-100">
      <LangHtml lang={lang} />
      <Navbar lang={lang} />
      <main className="flex-1">
        <section className="relative overflow-hidden border-b border-white/5">
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
              {/* Explicit language badge so user always knows which mode */}
              <p className="mb-3 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
                {lang === "fr" ? "Version française" : "English version"} ·{" "}
                <a
                  href={lang === "fr" ? "/en" : "/"}
                  className="text-amber-400 hover:underline"
                >
                  {lang === "fr" ? "Switch to English" : "Passer en français"}
                </a>
              </p>
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
                {lang === "fr"
                  ? "zones couvertes (Grand Montréal)"
                  : "zones covered (Greater Montreal)"}
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
          <a
            href={hrefFor(lang, "zones")}
            className="mt-6 inline-block text-sm font-semibold text-amber-400 hover:underline"
          >
            {lang === "fr" ? "Voir toutes les zones →" : "See all areas →"}
          </a>
        </section>

        <section className="border-t border-white/5 bg-white/[0.02]">
          <div className="mx-auto max-w-5xl px-4 py-16 text-center">
            <h2 className="text-2xl font-bold">{t(lang, "join.title")}</h2>
            <p className="mx-auto mt-3 max-w-lg text-zinc-400">{t(lang, "join.sub")}</p>
            <a
              href={hrefFor(lang, "entrepreneurs")}
              className="mt-6 inline-flex rounded-xl border border-amber-500/40 px-6 py-3 text-sm font-bold text-amber-400 hover:bg-amber-500/10"
            >
              {t(lang, "cta.contractor")}
            </a>
          </div>
        </section>

        <section className="border-t border-white/5">
          <div className="mx-auto max-w-3xl px-4 py-16">
            <h2 className="text-xl font-black mb-6">
              {lang === "fr" ? "Questions fréquentes" : "Frequently asked questions"}
            </h2>
            <div className="space-y-6 text-sm text-zinc-400 leading-relaxed">
              {lang === "fr" ? (
                <>
                  <div>
                    <h3 className="font-bold text-zinc-200 mb-1">
                      Comment obtenir une soumission gratuite?
                    </h3>
                    <p>
                      Remplissez le formulaire avec nom, téléphone, type de travaux et zone. Un
                      entrepreneur local vous contacte — souvent le jour même. Gratuit pour les
                      propriétaires.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-bold text-zinc-200 mb-1">Quelles zones?</h3>
                    <p>Grand Montréal : arrondissements, villes de l&apos;île, Laval et Rive-Sud.</p>
                  </div>
                  <div>
                    <h3 className="font-bold text-zinc-200 mb-1">Services populaires</h3>
                    <p className="flex flex-wrap gap-x-3 gap-y-1">
                      <a href="/plombier-montreal" className="text-amber-400 hover:underline">
                        Plombier Montréal
                      </a>
                      <a href="/electricien-montreal" className="text-amber-400 hover:underline">
                        Électricien Montréal
                      </a>
                      <a href="/toiture-montreal" className="text-amber-400 hover:underline">
                        Toiture Montréal
                      </a>
                      <a href="/renovation-montreal" className="text-amber-400 hover:underline">
                        Rénovation Montréal
                      </a>
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <h3 className="font-bold text-zinc-200 mb-1">How do I get a free quote?</h3>
                    <p>
                      Fill the form with name, phone, job type, and area. A local contractor contacts
                      you — often the same day. Free for homeowners.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-bold text-zinc-200 mb-1">What areas?</h3>
                    <p>
                      Greater Montreal: boroughs, island cities, Laval, and the South Shore.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-bold text-zinc-200 mb-1">Popular services</h3>
                    <p className="flex flex-wrap gap-x-3 gap-y-1">
                      <a href="/en/plumber-montreal" className="text-amber-400 hover:underline">
                        Plumber Montreal
                      </a>
                      <a href="/en/electrician-montreal" className="text-amber-400 hover:underline">
                        Electrician Montreal
                      </a>
                      <a href="/en/roofing-montreal" className="text-amber-400 hover:underline">
                        Roofing Montreal
                      </a>
                      <a href="/en/renovation-montreal" className="text-amber-400 hover:underline">
                        Renovation Montreal
                      </a>
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer lang={lang} />
    </div>
  );
}
