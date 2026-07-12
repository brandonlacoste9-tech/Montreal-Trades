import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { t } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Contractors | Montreal Trades",
  description: "Exclusive homeowner leads in Greater Montreal.",
};

export default function EnContractorsPage() {
  const lang = "en" as const;
  return (
    <div className="flex min-h-full flex-col bg-[#0c0c0c] text-zinc-100">
      <Navbar lang={lang} />
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-16">
        <h1 className="text-3xl font-black">{t(lang, "join.title")}</h1>
        <p className="mt-4 text-lg text-zinc-400">{t(lang, "join.sub")}</p>
        <ul className="mt-8 space-y-3 text-sm text-zinc-300">
          <li>✓ Leads with name, phone, and email</li>
          <li>✓ Zones: Montreal island, Laval, South Shore</li>
          <li>✓ Exclusive claim — not sold to 5 competitors</li>
          <li>✓ French-first market (English supported)</li>
        </ul>
        <div className="mt-10 rounded-2xl border border-amber-500/20 bg-amber-500/5 p-6">
          <p className="text-sm text-zinc-300">
            To join the network, email us with your trade and service areas:
          </p>
          <a
            href="mailto:hello@montreal-trades.com?subject=Contractor%20Greater%20Montreal"
            className="mt-3 inline-block font-bold text-amber-400 hover:underline"
          >
            hello@montreal-trades.com
          </a>
        </div>
        <Link
          href="/en/soumission"
          className="mt-8 inline-block text-sm text-zinc-500 hover:text-zinc-300"
        >
          ← Back to homeowner form
        </Link>
      </main>
      <Footer lang={lang} />
    </div>
  );
}
