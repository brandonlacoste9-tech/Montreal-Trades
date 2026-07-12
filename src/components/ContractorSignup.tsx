"use client";

import { useState } from "react";
import type { Lang } from "@/lib/i18n";
import { PLANS, type PlanId, STRIPE_LINKS } from "@/lib/pricing";
import { TRADES } from "@/lib/trades";
import { cn } from "@/lib/cn";

export default function ContractorSignup({ lang }: { lang: Lang }) {
  const [plan, setPlan] = useState<PlanId>("starter");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [trade, setTrade] = useState("plumbing");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone: phone || undefined,
          password,
          trade,
          plan,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.code === "ALREADY_ACTIVE") {
          setError(
            lang === "fr"
              ? "Compte déjà actif — connectez-vous au tableau de bord."
              : "Already active — log in to the dashboard."
          );
          return;
        }
        // Fallback: open Stripe Payment Link directly
        if (data.code === "STRIPE_NOT_CONFIGURED" || res.status >= 500) {
          const link = STRIPE_LINKS[plan];
          const q = email.trim()
            ? `?prefilled_email=${encodeURIComponent(email.trim())}`
            : "";
          window.location.href = `${link}${q}`;
          return;
        }
        setError(data.message || data.error || "Error");
        return;
      }
      if (data.url) {
        window.location.href = data.url as string;
        return;
      }
      // Ultimate fallback
      window.location.href = STRIPE_LINKS[plan];
    } catch {
      // Network fail → still try payment link so you can take money
      window.location.href = STRIPE_LINKS[plan];
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2">
        {(Object.keys(PLANS) as PlanId[]).map((id) => {
          const p = PLANS[id];
          const selected = plan === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => setPlan(id)}
              className={cn(
                "rounded-2xl border p-5 text-left transition",
                selected
                  ? "border-amber-500 bg-amber-500/10"
                  : "border-white/10 bg-white/[0.02] hover:border-white/25"
              )}
            >
              <div className="flex items-baseline justify-between gap-2">
                <span className="font-black text-lg text-white">
                  {lang === "fr" ? p.nameFr : p.nameEn}
                </span>
                <span className="text-amber-400 font-bold">
                  ${p.priceCad}
                  <span className="text-xs text-zinc-500 font-medium">
                    {lang === "fr" ? "/mois" : "/mo"}
                  </span>
                </span>
              </div>
              <ul className="mt-3 space-y-1.5 text-xs text-zinc-400">
                {(lang === "fr" ? p.featuresFr : p.featuresEn).map((f) => (
                  <li key={f}>✓ {f}</li>
                ))}
              </ul>
            </button>
          );
        })}
      </div>

      <form onSubmit={onSubmit} className="space-y-3 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
        <h3 className="font-bold text-white">
          {lang === "fr" ? "Créer mon compte entrepreneur" : "Create contractor account"}
        </h3>
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={lang === "fr" ? "Nom / entreprise" : "Name / company"}
          className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none focus:border-amber-500/50"
        />
        <input
          required
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={lang === "fr" ? "Courriel" : "Email"}
          className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none focus:border-amber-500/50"
        />
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder={lang === "fr" ? "Téléphone" : "Phone"}
          className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none focus:border-amber-500/50"
        />
        <input
          required
          type="password"
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={lang === "fr" ? "Mot de passe (8+)" : "Password (8+)"}
          className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none focus:border-amber-500/50"
        />
        <select
          value={trade}
          onChange={(e) => setTrade(e.target.value)}
          className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none focus:border-amber-500/50"
        >
          {TRADES.map((tr) => (
            <option key={tr.id} value={tr.id} className="bg-zinc-900">
              {lang === "fr" ? tr.fr : tr.en}
            </option>
          ))}
        </select>

        {error && <p className="text-sm text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-amber-500 py-3.5 text-sm font-bold text-black hover:bg-amber-400 disabled:opacity-60"
        >
          {loading
            ? "…"
            : lang === "fr"
              ? `Payer ${PLANS[plan].priceCad} $ CAD / mois →`
              : `Pay $${PLANS[plan].priceCad} CAD / month →`}
        </button>
        <p className="text-center text-xs text-zinc-500">
          {lang === "fr"
            ? "Paiement sécurisé Stripe. Annulable en tout temps."
            : "Secure Stripe checkout. Cancel anytime."}
        </p>
      </form>
    </div>
  );
}
