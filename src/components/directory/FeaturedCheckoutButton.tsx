"use client";

import { useState } from "react";
import type { Lang } from "@/lib/i18n";
import { FEATURED_PLAN } from "@/lib/directory-pricing";
import { cn } from "@/lib/cn";

export default function FeaturedCheckoutButton({
  slug,
  email,
  contractorId,
  lang,
  className,
}: {
  slug?: string;
  email?: string;
  contractorId?: string;
  lang: Lang;
  className?: string;
}) {
  const [loading, setLoading] = useState(false);

  async function buy() {
    setLoading(true);
    try {
      const res = await fetch("/api/directory/featured-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, email, contractorId }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
        return;
      }
      alert(data.error || (lang === "fr" ? "Erreur" : "Error"));
    } catch {
      alert(lang === "fr" ? "Erreur réseau" : "Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={buy}
      disabled={loading}
      className={cn(
        "rounded-xl bg-amber-500 px-4 py-2 font-bold text-black transition hover:bg-amber-400 disabled:opacity-60",
        className
      )}
    >
      {loading
        ? lang === "fr"
          ? "Redirection…"
          : "Redirecting…"
        : lang === "fr"
          ? `Passer en vedette — ${FEATURED_PLAN.priceCad} $/mois`
          : `Go featured — $${FEATURED_PLAN.priceCad}/mo`}
    </button>
  );
}
