import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LangHtml from "@/components/LangHtml";
import ContractorSignup from "@/components/ContractorSignup";
import { t } from "@/lib/i18n";
import { hrefFor } from "@/lib/paths";

export const metadata: Metadata = {
  title: "Acheter des leads exclusifs | MTLTrades",
  description:
    "Leads propriétaires exclusifs au Grand Montréal. Nom, téléphone, courriel. Plans dès 149 $ CAD/mois.",
};

export default function EntrepreneursPage() {
  const lang = "fr" as const;
  return (
    <div className="flex min-h-full flex-col bg-[#0c0c0c] text-zinc-100">
      <LangHtml lang={lang} />
      <Navbar lang={lang} />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-12">
        <p className="text-xs font-black uppercase tracking-widest text-amber-400 mb-3">
          {t(lang, "join.badge")}
        </p>
        <h1 className="text-3xl sm:text-4xl font-black leading-tight">
          {t(lang, "join.h1a")}
          <span className="block text-amber-400">{t(lang, "join.h1b")}</span>
        </h1>
        <p className="mt-4 text-lg text-zinc-400 max-w-xl">{t(lang, "join.body")}</p>

        <div className="mt-6 flex flex-wrap gap-4 text-sm">
          <Link
            href={hrefFor(lang, "dashboard/login")}
            className="text-amber-400 font-bold hover:underline"
          >
            {t(lang, "join.login")}
          </Link>
        </div>

        <div className="mt-12">
          <ContractorSignup lang={lang} />
        </div>
      </main>
      <Footer lang={lang} />
    </div>
  );
}
