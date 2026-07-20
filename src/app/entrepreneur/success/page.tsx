import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LangHtml from "@/components/LangHtml";

export const metadata: Metadata = {
  title: "Merci — En vedette | MTLTrades",
  robots: { index: false, follow: false },
};

export default async function FeaturedSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const lang = "fr" as const;
  const sp = await searchParams;
  void sp.session_id;

  return (
    <div className="flex min-h-full flex-col bg-[#0c0c0c] text-zinc-100">
      <LangHtml lang={lang} />
      <Navbar lang={lang} />
      <main className="mx-auto w-full max-w-xl flex-1 px-4 py-16 text-center">
        <p className="text-xs font-black uppercase tracking-widest text-amber-400 mb-3">
          Abonnement
        </p>
        <h1 className="text-3xl sm:text-4xl font-black leading-tight">
          Merci — votre profil est{" "}
          <span className="text-amber-400">en vedette</span>
        </h1>
        <p className="mt-4 text-lg text-zinc-400">
          Le paiement a été reçu. Votre fiche apparaîtra en tête des listes métier × zone
          sous peu (activation via webhook Stripe).
        </p>
        <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/annuaire"
            className="rounded-xl bg-amber-500 px-5 py-3 font-bold text-black hover:bg-amber-400"
          >
            Voir l&apos;annuaire
          </Link>
          <Link
            href="/dashboard"
            className="rounded-xl border border-white/15 px-5 py-3 font-bold text-white hover:border-amber-500/50"
          >
            Tableau de bord
          </Link>
        </div>
      </main>
      <Footer lang={lang} />
    </div>
  );
}
