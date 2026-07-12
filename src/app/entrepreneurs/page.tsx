import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LangHtml from "@/components/LangHtml";
import ContractorSignup from "@/components/ContractorSignup";

export const metadata: Metadata = {
  title: "Acheter des leads exclusifs | Montreal Trades",
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
          Pour entrepreneurs
        </p>
        <h1 className="text-3xl sm:text-4xl font-black leading-tight">
          Des appels de vrais propriétaires.
          <span className="block text-amber-400">Exclusifs. Grand Montréal.</span>
        </h1>
        <p className="mt-4 text-lg text-zinc-400 max-w-xl">
          Les propriétaires remplissent le formulaire gratuit. Vous payez un forfait
          mensuel et réclamez les leads — téléphone inclus, pas de partage à 5 concurrents.
        </p>

        <div className="mt-6 flex flex-wrap gap-4 text-sm">
          <Link href="/dashboard/login" className="text-amber-400 font-bold hover:underline">
            Déjà abonné? Connexion →
          </Link>
        </div>

        <div className="mt-12">
          <ContractorSignup lang={lang} />
        </div>

        <p className="mt-10 text-xs text-zinc-600">
          Questions?{" "}
          <a href="mailto:hello@montreal-trades.com" className="text-zinc-400 hover:text-white">
            hello@montreal-trades.com
          </a>
        </p>
      </main>
      <Footer lang={lang} />
    </div>
  );
}
