import Link from "next/link";
import type { Lang } from "@/lib/i18n";
import { t } from "@/lib/i18n";

export default function Navbar({ lang }: { lang: Lang }) {
  const other: Lang = lang === "fr" ? "en" : "fr";
  const prefix = lang === "fr" ? "" : "/en";

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0c0c0c]/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-4 px-4">
        <Link href={prefix || "/"} className="font-bold tracking-tight text-amber-400">
          {t(lang, "brand")}
        </Link>
        <nav className="flex items-center gap-3 text-sm sm:gap-5">
          <Link href={`${prefix}/zones`} className="text-zinc-300 hover:text-white hidden sm:inline">
            {t(lang, "nav.zones")}
          </Link>
          <Link href={`${prefix}/entrepreneurs`} className="text-zinc-300 hover:text-white hidden sm:inline">
            {t(lang, "nav.contractors")}
          </Link>
          <Link
            href={lang === "fr" ? "/en" : "/"}
            className="text-zinc-500 hover:text-zinc-300 uppercase text-xs font-semibold"
          >
            {other}
          </Link>
          <Link
            href={`${prefix}/soumission`}
            className="rounded-lg bg-amber-500 px-3 py-2 text-xs font-bold text-black hover:bg-amber-400 sm:text-sm"
          >
            {t(lang, "nav.quote")}
          </Link>
        </nav>
      </div>
    </header>
  );
}
