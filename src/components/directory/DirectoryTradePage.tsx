import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LangHtml from "@/components/LangHtml";
import DirectoryList from "@/components/directory/DirectoryList";
import type { DirectoryListing } from "@/lib/directory";
import { tradeLabel } from "@/lib/directory";
import { zoneLabel, type Zone } from "@/lib/zones";
import { ZONE_GROUPS } from "@/lib/zones";
import type { Lang } from "@/lib/i18n";
import { hrefFor } from "@/lib/paths";

type TradeMeta = {
  id: string;
  slugFr: string;
  slugEn: string;
  nameFr: string;
  nameEn: string;
};

export default function DirectoryTradePage({
  lang,
  trade,
  zone,
  listings,
}: {
  lang: Lang;
  trade: TradeMeta;
  zone?: Zone;
  listings: DirectoryListing[];
}) {
  const tradeSlug = lang === "fr" ? trade.slugFr : trade.slugEn;
  const tradeName = lang === "fr" ? trade.nameFr : trade.nameEn;
  const annuaireBase = lang === "en" ? "/en/annuaire" : "/annuaire";
  const zoneName = zone ? zoneLabel(zone, lang) : null;

  const title = zoneName
    ? lang === "fr"
      ? `${tradeName} — ${zoneName}`
      : `${tradeName} — ${zoneName}`
    : tradeName;

  const subtitle = zoneName
    ? lang === "fr"
      ? `Entrepreneurs en ${tradeLabel(trade.id, lang).toLowerCase()} desservant ${zoneName}.`
      : `${tradeLabel(trade.id, lang)} contractors serving ${zoneName}.`
    : lang === "fr"
      ? `Entrepreneurs en ${tradeName.toLowerCase()} sur le Grand Montréal.`
      : `${tradeName} contractors across Greater Montreal.`;

  const emptyMessage = lang === "fr"
    ? "Aucun entrepreneur listé pour le moment. Revenez bientôt ou demandez une soumission."
    : "No contractors listed yet. Check back soon or request a free quote.";

  return (
    <div className="flex min-h-full flex-col bg-[#0c0c0c] text-zinc-100">
      <LangHtml lang={lang} />
      <Navbar lang={lang} />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-12">
        <nav className="mb-6 text-sm text-zinc-500">
          <Link href={annuaireBase} className="hover:text-amber-400">
            {lang === "fr" ? "Annuaire" : "Directory"}
          </Link>
          <span className="mx-2">/</span>
          {zone ? (
            <>
              <Link
                href={`${annuaireBase}/${tradeSlug}`}
                className="hover:text-amber-400"
              >
                {tradeName}
              </Link>
              <span className="mx-2">/</span>
              <span className="text-zinc-300">{zoneName}</span>
            </>
          ) : (
            <span className="text-zinc-300">{tradeName}</span>
          )}
        </nav>

        <h1 className="text-3xl font-black text-white">{title}</h1>
        <p className="mt-2 max-w-2xl text-zinc-400">{subtitle}</p>

        <div className="mt-8">
          <DirectoryList
            listings={listings}
            lang={lang}
            emptyMessage={emptyMessage}
          />
        </div>

        {!zone && (
          <section className="mt-12">
            <h2 className="text-lg font-bold text-amber-400">
              {lang === "fr" ? "Par zone" : "By area"}
            </h2>
            <div className="mt-4 space-y-6">
              {ZONE_GROUPS.map((g) => (
                <div key={g.id}>
                  <h3 className="text-sm font-semibold text-zinc-300">
                    {lang === "fr" ? g.labelFr : g.labelEn}
                  </h3>
                  <ul className="mt-2 flex flex-wrap gap-2">
                    {g.zones.map((z) => (
                      <li key={z.slug}>
                        <Link
                          href={`${annuaireBase}/${tradeSlug}/${z.slug}`}
                          className="inline-block rounded-lg border border-white/10 px-3 py-1.5 text-xs text-zinc-300 hover:border-amber-500/40 hover:text-amber-400"
                        >
                          {zoneLabel(z, lang)}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            href={`${hrefFor(lang, "soumission")}?trade=${trade.id}${zone ? `&zone=${zone.slug}` : ""}`}
            className="inline-flex rounded-xl bg-amber-500 px-6 py-3 text-sm font-bold text-black hover:bg-amber-400"
          >
            {lang === "fr" ? "Demander une soumission" : "Request a free quote"}
          </Link>
          <Link
            href={lang === "en" ? "/en/inscription" : "/inscription"}
            className="inline-flex rounded-xl border border-white/15 px-6 py-3 text-sm font-bold text-zinc-200 hover:border-white/30"
          >
            {lang === "fr" ? "Publier mon profil" : "List my business"}
          </Link>
        </div>
      </main>
      <Footer lang={lang} />
    </div>
  );
}
