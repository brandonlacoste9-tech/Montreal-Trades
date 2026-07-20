import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LangHtml from "@/components/LangHtml";
import { DIRECTORY_TRADES } from "@/lib/directory";
import type { Lang } from "@/lib/i18n";

export default function DirectoryIndex({ lang }: { lang: Lang }) {
  const week1 = DIRECTORY_TRADES.filter((t) => t.week1);
  const base = lang === "en" ? "/en/annuaire" : "/annuaire";
  const inscriptionHref = lang === "en" ? "/en/inscription" : "/inscription";

  return (
    <div className="flex min-h-full flex-col bg-[#0c0c0c] text-zinc-100">
      <LangHtml lang={lang} />
      <Navbar lang={lang} />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-12">
        <h1 className="text-3xl font-black text-white">
          {lang === "fr"
            ? "Annuaire des entrepreneurs"
            : "Contractor directory"}
        </h1>
        <p className="mt-2 text-zinc-400">
          {lang === "fr"
            ? "Grand Montréal — plomberie, électricité, toiture."
            : "Greater Montreal — plumbing, electrical, roofing."}
        </p>
        <ul className="mt-8 grid gap-4 sm:grid-cols-3">
          {week1.map((t) => {
            const slug = lang === "fr" ? t.slugFr : t.slugEn;
            const name = lang === "fr" ? t.nameFr : t.nameEn;
            return (
              <li key={t.id}>
                <Link
                  href={`${base}/${slug}`}
                  className="block rounded-2xl border border-white/10 p-5 font-bold text-amber-400 hover:border-amber-500/50"
                >
                  {name}
                </Link>
              </li>
            );
          })}
        </ul>
        <p className="mt-10 text-sm text-zinc-500">
          {lang === "fr" ? "Entrepreneur ?" : "Contractor?"}{" "}
          <Link href={inscriptionHref} className="text-amber-400 underline">
            {lang === "fr"
              ? "Publiez votre profil gratuit"
              : "List your profile free"}
          </Link>
        </p>
      </main>
      <Footer lang={lang} />
    </div>
  );
}
