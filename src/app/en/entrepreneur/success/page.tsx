import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LangHtml from "@/components/LangHtml";

export const metadata: Metadata = {
  title: "Thank you — Featured | MTLTrades",
  robots: { index: false, follow: false },
};

export default async function FeaturedSuccessPageEn({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const lang = "en" as const;
  const sp = await searchParams;
  void sp.session_id;

  return (
    <div className="flex min-h-full flex-col bg-[#0c0c0c] text-zinc-100">
      <LangHtml lang={lang} />
      <Navbar lang={lang} />
      <main className="mx-auto w-full max-w-xl flex-1 px-4 py-16 text-center">
        <p className="text-xs font-black uppercase tracking-widest text-amber-400 mb-3">
          Subscription
        </p>
        <h1 className="text-3xl sm:text-4xl font-black leading-tight">
          Thank you — your profile is{" "}
          <span className="text-amber-400">featured</span>
        </h1>
        <p className="mt-4 text-lg text-zinc-400">
          Payment received. Your listing will appear at the top of trade × zone lists
          shortly (activated via Stripe webhook).
        </p>
        <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/en/annuaire"
            className="rounded-xl bg-amber-500 px-5 py-3 font-bold text-black hover:bg-amber-400"
          >
            Browse directory
          </Link>
          <Link
            href="/en/dashboard"
            className="rounded-xl border border-white/15 px-5 py-3 font-bold text-white hover:border-amber-500/50"
          >
            Dashboard
          </Link>
        </div>
      </main>
      <Footer lang={lang} />
    </div>
  );
}
