import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LangHtml from "@/components/LangHtml";
import DirectoryRegisterForm from "@/components/directory/DirectoryRegisterForm";
import { buildDirectoryMetadata } from "@/components/directory/directory-seo";

export const metadata: Metadata = buildDirectoryMetadata({
  lang: "en",
  title: "Free listing — contractor directory | MTLTrades",
  description:
    "Publish your contractor profile free on Greater Montreal. Plumbing, electrical, roofing, and more.",
  pathFr: "/inscription",
  pathEn: "/en/inscription",
});

export default function EnInscriptionPage() {
  const lang = "en" as const;
  return (
    <div className="flex min-h-full flex-col bg-[#0c0c0c] text-zinc-100">
      <LangHtml lang={lang} />
      <Navbar lang={lang} />
      <main className="mx-auto w-full max-w-xl flex-1 px-4 py-12">
        <p className="mb-3 text-xs font-black uppercase tracking-widest text-amber-400">
          Free
        </p>
        <h1 className="text-3xl font-black leading-tight">
          List your business
          <span className="block text-amber-400">in the directory</span>
        </h1>
        <p className="mt-4 text-zinc-400">
          Appear in the MTLTrades directory — Greater Montreal. Free basic
          profile.
        </p>
        <div className="mt-8">
          <DirectoryRegisterForm lang={lang} />
        </div>
        <p className="mt-6 text-center text-sm text-zinc-500">
          Looking for exclusive leads?{" "}
          <Link href="/en/entrepreneurs" className="text-amber-400 underline">
            See plans
          </Link>
        </p>
      </main>
      <Footer lang={lang} />
    </div>
  );
}
