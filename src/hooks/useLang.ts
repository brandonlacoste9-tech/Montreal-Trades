"use client";

import { usePathname } from "next/navigation";
import type { Lang } from "@/lib/i18n";
import { langFromPath } from "@/lib/i18n";

/** Always trust the URL — never a stale prop. */
export function useLang(): Lang {
  const pathname = usePathname() || "/";
  return langFromPath(pathname);
}
