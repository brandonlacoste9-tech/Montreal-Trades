import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LangHtml from "@/components/LangHtml";
import DirectoryRegisterForm from "@/components/directory/DirectoryRegisterForm";
import { buildDirectoryMetadata } from "@/components/directory/directory-seo";

export const metadata: Metadata = buildDirectoryMetadata({
  lang: "fr",
  title: "Inscription gratuite — annuaire entrepreneurs | MTLTrades",
  description:
    "Publiez votre profil d'entrepreneur gratuitement sur le Grand Montréal. Plomberie, électricité, toiture et plus.",
  pathFr: "/inscription",
  pathEn: "/en/inscription",
});

export default function InscriptionPage() {
  const lang = "fr" as const;
  return (
    <div className="flex min-h-full flex-col bg-[#0c0c0c] text-zinc-100">
      <LangHtml lang={lang} />
      <Navbar lang={lang} />
      <main className="mx-auto w-full max-w-xl flex-1 px-4 py-12">
        <p className="mb-3 text-xs font-black uppercase tracking-widest text-amber-400">
          Gratuit
        </p>
        <h1 className="text-3xl font-black leading-tight">
          Publiez votre profil
          <span className="block text-amber-400">sur l&apos;annuaire</span>
        </h1>
        <p className="mt-4 text-zinc-400">
          Apparaissez dans l&apos;annuaire MTLTrades — Grand Montréal. Aucun
          frais pour le profil de base.
        </p>
        <div className="mt-8">
          <DirectoryRegisterForm lang={lang} />
        </div>
        <p className="mt-6 text-center text-sm text-zinc-500">
          Vous cherchez des leads exclusifs ?{" "}
          <Link href="/entrepreneurs" className="text-amber-400 underline">
            Voir les forfaits
          </Link>
        </p>
      </main>
      <Footer lang={lang} />
    </div>
  );
}
