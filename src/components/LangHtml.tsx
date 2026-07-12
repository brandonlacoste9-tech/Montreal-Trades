"use client";

import { useEffect } from "react";
import type { Lang } from "@/lib/i18n";

const COOKIE = "mt_lang";

/**
 * Sets <html lang> for the page.
 * Cookie is only set to match the *current page* (not used to force redirects).
 */
export default function LangHtml({ lang }: { lang: Lang }) {
  useEffect(() => {
    document.documentElement.lang = lang === "fr" ? "fr-CA" : "en-CA";
    document.documentElement.setAttribute("data-lang", lang);
    // Prefer page URL as source of truth; cookie is for analytics only
    document.cookie = `${COOKIE}=${lang};path=/;max-age=31536000;samesite=lax`;

    // If browser auto-translate is on, user may think FR is "broken"
    // Hint: leave page language explicit
  }, [lang]);
  return null;
}
