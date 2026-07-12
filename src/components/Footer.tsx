"use client";

import { t } from "@/lib/i18n";
import { hrefFor } from "@/lib/paths";
import { useLang } from "@/hooks/useLang";

export default function Footer({ lang: langProp }: { lang?: "fr" | "en" }) {
  const lang = useLang() || langProp || "fr";

  return (
    <footer className="mt-auto border-t border-white/10 bg-[#0a0a0a]">
      <div className="mx-auto flex max-w-5xl flex-col gap-4 px-4 py-10 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-bold text-amber-400">{t(lang, "brand")}</p>
          <p className="text-sm text-zinc-500">{t(lang, "tagline")}</p>
        </div>
        <div className="flex flex-wrap gap-4 text-sm text-zinc-400">
          <a href={hrefFor(lang, "soumission")} className="hover:text-white">
            {t(lang, "nav.quote")}
          </a>
          <a href={hrefFor(lang, "zones")} className="hover:text-white">
            {t(lang, "nav.zones")}
          </a>
          <a href={hrefFor(lang, "entrepreneurs")} className="hover:text-white">
            {t(lang, "nav.contractors")}
          </a>
          <a
            href={lang === "fr" ? "/en" : "/"}
            className="text-amber-400/80 hover:text-amber-400 font-semibold"
          >
            {lang === "fr" ? "English" : "Français"}
          </a>
        </div>
        <p className="text-xs text-zinc-600">
          © {new Date().getFullYear()} MTLTrades. {t(lang, "footer.rights")}
        </p>
      </div>
    </footer>
  );
}
