"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { langFromPath } from "@/lib/i18n";

/** Syncs document language from the URL on every navigation. */
export default function LangHtml({ lang: langProp }: { lang?: "fr" | "en" }) {
  const pathname = usePathname() || "/";
  const lang = langFromPath(pathname) || langProp || "fr";

  useEffect(() => {
    document.documentElement.lang = lang === "fr" ? "fr-CA" : "en-CA";
    document.documentElement.setAttribute("data-lang", lang);
    document.cookie = `mt_lang=${lang};path=/;max-age=31536000;samesite=lax`;
  }, [lang]);

  return null;
}
