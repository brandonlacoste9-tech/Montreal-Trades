import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LangHtml from "@/components/LangHtml";
import { t } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Entrepreneurs | Montreal Trades",
  description:
    "Recevez des leads exclusifs de propriétaires au Grand Montréal.",
};

export default function EntrepreneursPage() {
  const lang = "fr" as const;
  return (
    <div className="flex min-h-full flex-col bg-[#0c0c0c] text-zinc-100">
      <LangHtml lang={lang} />
      <Navbar lang={lang} />
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-16">
        <h1 className="text-3xl font-black">{t(lang, "join.title")}</h1>
        <p className="mt-4 text-lg text-zinc-400">{t(lang, "join.sub")}</p>
        <ul className="mt-8 space-y-3 text-sm text-zinc-300">
          <li>✓ Leads avec nom, téléphone et courriel</li>
          <li>✓ Zones : île de Montréal, Laval, Rive-Sud</li>
          <li>✓ Réclamation exclusive — pas de lead partagé à 5 concurrents</li>
          <li>✓ Français d&apos;abord (anglais disponible)</li>
        </ul>
        <div className="mt-10 rounded-2xl border border-amber-500/20 bg-amber-500/5 p-6">
          <p className="text-sm text-zinc-300">
            Pour rejoindre le réseau, écrivez-nous avec votre métier et vos zones :
          </p>
          <a
            href="mailto:hello@montreal-trades.com?subject=Entrepreneur%20Grand%20Montréal"
            className="mt-3 inline-block font-bold text-amber-400 hover:underline"
          >
            hello@montreal-trades.com
          </a>
        </div>
        <Link
          href="/soumission"
          className="mt-8 inline-block text-sm text-zinc-500 hover:text-zinc-300"
        >
          ← Retour propriétaires
        </Link>
      </main>
      <Footer lang={lang} />
    </div>
  );
}
