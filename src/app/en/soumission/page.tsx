import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import QuoteForm from "@/components/QuoteForm";
import LangHtml from "@/components/LangHtml";
import { buildMetadata, QUOTE_SEO } from "@/lib/seo";

export const metadata: Metadata = buildMetadata("en", QUOTE_SEO);

export default function EnQuotePage() {
  return (
    <div className="flex min-h-full flex-col bg-[#0c0c0c] text-zinc-100">
      <LangHtml lang="en" />
      <Navbar lang="en" />
      <main className="mx-auto w-full max-w-lg flex-1 px-4 py-12">
        <QuoteForm lang="en" />
      </main>
      <Footer lang="en" />
    </div>
  );
}
