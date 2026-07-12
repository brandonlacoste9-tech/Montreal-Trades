import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LangHtml from "@/components/LangHtml";
import ContractorSignup from "@/components/ContractorSignup";

export const metadata: Metadata = {
  title: "Buy exclusive leads | Montreal Trades",
  description:
    "Exclusive homeowner leads in Greater Montreal. Name, phone, email. Plans from $149 CAD/month.",
};

export default function EnContractorsPage() {
  const lang = "en" as const;
  return (
    <div className="flex min-h-full flex-col bg-[#0c0c0c] text-zinc-100">
      <LangHtml lang={lang} />
      <Navbar lang={lang} />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-12">
        <p className="text-xs font-black uppercase tracking-widest text-amber-400 mb-3">
          For contractors
        </p>
        <h1 className="text-3xl sm:text-4xl font-black leading-tight">
          Real homeowner calls.
          <span className="block text-amber-400">Exclusive. Greater Montreal.</span>
        </h1>
        <p className="mt-4 text-lg text-zinc-400 max-w-xl">
          Homeowners fill the free form. You pay a monthly plan and claim leads —
          phone included, not sold to five competitors.
        </p>

        <div className="mt-6 flex flex-wrap gap-4 text-sm">
          <Link href="/dashboard/login" className="text-amber-400 font-bold hover:underline">
            Already subscribed? Log in →
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
