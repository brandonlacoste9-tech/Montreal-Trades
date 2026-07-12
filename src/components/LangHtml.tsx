"use client";

import { useEffect } from "react";
import type { Lang } from "@/lib/i18n";

/** Sets <html lang="..."> for the current page language. */
export default function LangHtml({ lang }: { lang: Lang }) {
  useEffect(() => {
    document.documentElement.lang = lang === "fr" ? "fr-CA" : "en-CA";
  }, [lang]);
  return null;
}
