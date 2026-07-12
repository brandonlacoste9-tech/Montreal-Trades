import Link from "next/link";
import type { Lang } from "@/lib/i18n";
import { t } from "@/lib/i18n";

export default function Footer({ lang }: { lang: Lang }) {
  const prefix = lang === "fr" ? "" : "/en";
  return (
    <footer className="mt-auto border-t border-white/10 bg-[#0a0a0a]">
      <div className="mx-auto flex max-w-5xl flex-col gap-4 px-4 py-10 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-bold text-amber-400">{t(lang, "brand")}</p>
          <p className="text-sm text-zinc-500">{t(lang, "tagline")}</p>
        </div>
        <div className="flex gap-4 text-sm text-zinc-400">
          <Link href={`${prefix}/soumission`} className="hover:text-white">
            {t(lang, "nav.quote")}
          </Link>
          <Link href={`${prefix}/zones`} className="hover:text-white">
            {t(lang, "nav.zones")}
          </Link>
          <Link href={`${prefix}/entrepreneurs`} className="hover:text-white">
            {t(lang, "nav.contractors")}
          </Link>
        </div>
        <p className="text-xs text-zinc-600">
          © {new Date().getFullYear()} Montreal Trades. {t(lang, "footer.rights")}
        </p>
      </div>
    </footer>
  );
}
