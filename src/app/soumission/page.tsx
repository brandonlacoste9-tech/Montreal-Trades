import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import QuoteForm from "@/components/QuoteForm";

export const metadata: Metadata = {
  title: "Soumission gratuite | Montreal Trades",
  description:
    "Obtenez des soumissions gratuites d'entrepreneurs au Grand Montréal. Plomberie, électricité, toiture, rénovations.",
};

export default function SoumissionPage() {
  const lang = "fr" as const;
  return (
    <div className="flex min-h-full flex-col bg-[#0c0c0c] text-zinc-100">
      <Navbar lang={lang} />
      <main className="mx-auto w-full max-w-lg flex-1 px-4 py-12">
        <QuoteForm lang={lang} />
      </main>
      <Footer lang={lang} />
    </div>
  );
}
