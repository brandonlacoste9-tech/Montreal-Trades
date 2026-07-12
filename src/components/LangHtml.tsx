"use client";

import { useEffect } from "react";
import type { Lang } from "@/lib/i18n";

const COOKIE = "mt_lang";

/** Sets <html lang> + cookie so language sticks across pages. */
export default function LangHtml({ lang }: { lang: Lang }) {
  useEffect(() => {
    document.documentElement.lang = lang === "fr" ? "fr-CA" : "en-CA";
    document.documentElement.setAttribute("data-lang", lang);
    // 1 year
    document.cookie = `${COOKIE}=${lang};path=/;max-age=31536000;samesite=lax`;
  }, [lang]);
  return null;
}

export function readLangCookie(): Lang | null {
  if (typeof document === "undefined") return null;
  const m = document.cookie.match(/(?:^|; )mt_lang=(fr|en)(?:;|$)/);
  return m ? (m[1] as Lang) : null;
}
