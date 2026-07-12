import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LangHtml from "@/components/LangHtml";
import { ZONE_GROUPS, zoneLabel } from "@/lib/zones";
import { t } from "@/lib/i18n";
import { buildMetadata, ZONES_SEO } from "@/lib/seo";

export const metadata: Metadata = buildMetadata("en", ZONES_SEO);

export default function EnZonesPage() {
  const lang = "en" as const;
  return (
    <div className="flex min-h-full flex-col bg-[#0c0c0c] text-zinc-100">
      <LangHtml lang={lang} />
      <Navbar lang={lang} />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-12">
        <h1 className="text-3xl font-black">{t(lang, "zones.title")}</h1>
        <p className="mt-2 max-w-2xl text-zinc-400">{t(lang, "zones.sub")}</p>
        <div className="mt-10 space-y-10">
          {ZONE_GROUPS.map((g) => (
            <section key={g.id}>
              <h2 className="text-lg font-bold text-amber-400">{g.labelEn}</h2>
              <ul className="mt-3 grid gap-2 sm:grid-cols-2 md:grid-cols-3">
                {g.zones.map((z) => (
                  <li
                    key={z.slug}
                    className="rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 text-sm"
                  >
                    {zoneLabel(z, lang)}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
        <Link
          href="/en/soumission"
          className="mt-12 inline-flex rounded-xl bg-amber-500 px-6 py-3 text-sm font-bold text-black hover:bg-amber-400"
        >
          {t(lang, "cta.homeowner")}
        </Link>
      </main>
      <Footer lang={lang} />
    </div>
  );
}
