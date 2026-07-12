"use client";

import { usePathname } from "next/navigation";
import { t } from "@/lib/i18n";
import { hrefFor, switchLangHref } from "@/lib/paths";
import { useLang } from "@/hooks/useLang";
import { cn } from "@/lib/cn";

export default function Navbar({ lang: langProp }: { lang?: "fr" | "en" }) {
  const pathname = usePathname() || "/";
  // URL is source of truth (fixes stuck EN after soft navigation)
  const lang = useLang() || langProp || "fr";

  const frHref = switchLangHref(pathname, "fr");
  const enHref = switchLangHref(pathname, "en");

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0c0c0c]/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-4 px-4">
        <a href={hrefFor(lang)} className="font-bold tracking-tight text-amber-400">
          {t(lang, "brand")}
        </a>

        <nav className="flex items-center gap-2 sm:gap-4 text-sm">
          <a
            href={hrefFor(lang, "zones")}
            className="hidden text-zinc-300 hover:text-white sm:inline"
          >
            {t(lang, "nav.zones")}
          </a>
          <a
            href={hrefFor(lang, "entrepreneurs")}
            className="hidden text-zinc-300 hover:text-white sm:inline"
          >
            {t(lang, "nav.contractors")}
          </a>

          {/* Hard navigation <a> — full reload so language always switches */}
          <div
            className="flex items-center rounded-lg border border-white/15 p-0.5 text-xs font-bold uppercase"
            role="group"
            aria-label={t(lang, "lang.label")}
          >
            <a
              href={frHref}
              className={cn(
                "rounded-md px-2.5 py-1 transition-colors",
                lang === "fr"
                  ? "bg-amber-500 text-black"
                  : "text-zinc-400 hover:text-white"
              )}
              hrefLang="fr-CA"
              lang="fr"
              title="Français"
              aria-current={lang === "fr" ? "page" : undefined}
            >
              FR
            </a>
            <a
              href={enHref}
              className={cn(
                "rounded-md px-2.5 py-1 transition-colors",
                lang === "en"
                  ? "bg-amber-500 text-black"
                  : "text-zinc-400 hover:text-white"
              )}
              hrefLang="en-CA"
              lang="en"
              title="English"
              aria-current={lang === "en" ? "page" : undefined}
            >
              EN
            </a>
          </div>

          <a
            href={hrefFor(lang, "soumission")}
            className="rounded-lg bg-amber-500 px-3 py-2 text-xs font-bold text-black hover:bg-amber-400 sm:text-sm"
          >
            {t(lang, "nav.quote")}
          </a>
        </nav>
      </div>
    </header>
  );
}
