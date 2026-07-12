import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import QuoteForm from "@/components/QuoteForm";
import LangHtml from "@/components/LangHtml";
import { buildMetadata, QUOTE_SEO } from "@/lib/seo";

export const metadata: Metadata = buildMetadata("fr", QUOTE_SEO);

export default function SoumissionPage() {
  const lang = "fr" as const;
  return (
    <div className="flex min-h-full flex-col bg-[#0c0c0c] text-zinc-100">
      <LangHtml lang={lang} />
      <Navbar lang={lang} />
      <main className="mx-auto w-full max-w-lg flex-1 px-4 py-12">
        <QuoteForm lang={lang} />
      </main>
      <Footer lang={lang} />
    </div>
  );
}
