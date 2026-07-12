"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Lang } from "@/lib/i18n";
import { getZoneBySlug, zoneLabel } from "@/lib/zones";
import { TRADES } from "@/lib/trades";

type OpenLead = {
  id: string;
  project_type: string;
  city: string | null;
  language: string;
  created_at: string;
  message: string | null;
};

type ClaimedLead = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  project_type: string;
  city: string | null;
  message: string | null;
  claimed_at: string | null;
};

function tradeName(id: string, lang: Lang) {
  const t = TRADES.find((x) => x.id === id);
  return t ? (lang === "fr" ? t.fr : t.en) : id;
}

function zoneName(slug: string | null, lang: Lang) {
  if (!slug) return "—";
  const z = getZoneBySlug(slug);
  return z ? zoneLabel(z, lang) : slug;
}

export default function DashboardClient({
  lang,
  welcome,
}: {
  lang: Lang;
  welcome?: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [contractor, setContractor] = useState<{
    name: string;
    trade: string;
    plan: string;
  } | null>(null);
  const [open, setOpen] = useState<OpenLead[]>([]);
  const [claimed, setClaimed] = useState<ClaimedLead[]>([]);
  const [claiming, setClaiming] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError("");
    const res = await fetch("/api/leads/available");
    if (res.status === 401 || res.status === 403) {
      router.push("/dashboard/login");
      return;
    }
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Error");
      setLoading(false);
      return;
    }
    setContractor(data.contractor);
    setOpen(data.open || []);
    setClaimed(data.claimed || []);
    setLoading(false);
  }, [router]);

  useEffect(() => {
    load();
  }, [load]);

  async function claim(leadId: string) {
    setClaiming(leadId);
    setError("");
    try {
      const res = await fetch("/api/leads/claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadId }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(
          data.code === "TAKEN"
            ? lang === "fr"
              ? "Déjà réclamé par un autre"
              : "Already taken"
            : data.code === "LIMIT"
              ? lang === "fr"
                ? "Limite mensuelle atteinte — passez au Pro"
                : "Monthly limit hit — upgrade to Pro"
              : data.error || "Claim failed"
        );
        await load();
        return;
      }
      await load();
    } finally {
      setClaiming(null);
    }
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/dashboard/login");
  }

  if (loading) {
    return <p className="text-zinc-400 text-sm">…</p>;
  }

  return (
    <div className="space-y-10">
      {welcome && (
        <div className="rounded-2xl border border-green-500/30 bg-green-500/10 p-4 text-sm text-green-300">
          {lang === "fr"
            ? "Paiement reçu — bienvenue! Réclamez vos premiers leads ci-dessous."
            : "Payment received — welcome! Claim your first leads below."}
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white">
            {lang === "fr" ? "Tableau de bord" : "Dashboard"}
          </h1>
          {contractor && (
            <p className="text-sm text-zinc-400 mt-1">
              {contractor.name} · {tradeName(contractor.trade, lang)} ·{" "}
              <span className="text-amber-400 uppercase">{contractor.plan}</span>
            </p>
          )}
        </div>
        <button
          onClick={logout}
          className="text-xs font-bold uppercase tracking-wider text-zinc-500 hover:text-white"
        >
          {lang === "fr" ? "Déconnexion" : "Log out"}
        </button>
      </div>

      {error && (
        <p className="text-sm text-red-400 border border-red-500/20 rounded-xl p-3">{error}</p>
      )}

      <section>
        <h2 className="text-lg font-bold text-amber-400 mb-4">
          {lang === "fr" ? "Leads ouverts (réclamez pour le téléphone)" : "Open leads (claim for phone)"}
        </h2>
        {open.length === 0 ? (
          <p className="text-sm text-zinc-500">
            {lang === "fr"
              ? "Aucun lead ouvert pour l'instant. On vous envoie un Telegram dès qu'il y en a."
              : "No open leads right now. You'll get Telegram when one lands."}
          </p>
        ) : (
          <ul className="space-y-3">
            {open.map((l) => (
              <li
                key={l.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4"
              >
                <div>
                  <p className="font-bold text-white">
                    {tradeName(l.project_type, lang)} · {zoneName(l.city, lang)}
                  </p>
                  <p className="text-xs text-zinc-500 mt-1">
                    {new Date(l.created_at).toLocaleString(lang === "fr" ? "fr-CA" : "en-CA")}
                    {l.message ? ` · ${l.message.slice(0, 80)}` : ""}
                  </p>
                  <p className="text-[10px] text-zinc-600 mt-1 uppercase tracking-widest">
                    {lang === "fr" ? "Contact verrouillé jusqu'à réclamation" : "Contact locked until claim"}
                  </p>
                </div>
                <button
                  onClick={() => claim(l.id)}
                  disabled={claiming === l.id}
                  className="shrink-0 rounded-xl bg-amber-500 px-5 py-2.5 text-xs font-bold text-black hover:bg-amber-400 disabled:opacity-60"
                >
                  {claiming === l.id
                    ? "…"
                    : lang === "fr"
                      ? "Réclamer (exclusif)"
                      : "Claim exclusive"}
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="text-lg font-bold text-green-400 mb-4">
          {lang === "fr" ? "Vos leads réclamés" : "Your claimed leads"}
        </h2>
        {claimed.length === 0 ? (
          <p className="text-sm text-zinc-500">
            {lang === "fr" ? "Aucun encore." : "None yet."}
          </p>
        ) : (
          <ul className="space-y-3">
            {claimed.map((l) => (
              <li
                key={l.id}
                className="rounded-2xl border border-green-500/20 bg-green-500/5 p-4 space-y-1"
              >
                <p className="font-bold text-white">{l.name}</p>
                <p className="text-sm text-green-300">
                  <a href={`tel:${l.phone}`} className="hover:underline">
                    {l.phone}
                  </a>
                  {" · "}
                  <a href={`mailto:${l.email}`} className="hover:underline">
                    {l.email}
                  </a>
                </p>
                <p className="text-xs text-zinc-500">
                  {tradeName(l.project_type, lang)} · {zoneName(l.city, lang)}
                </p>
                {l.message && (
                  <p className="text-xs text-zinc-400 italic">{l.message}</p>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
