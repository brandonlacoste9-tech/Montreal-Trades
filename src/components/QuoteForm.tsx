"use client";

import { useState } from "react";
import type { Lang } from "@/lib/i18n";
import { t } from "@/lib/i18n";
import { TRADES } from "@/lib/trades";
import { ZONE_GROUPS, zoneLabel } from "@/lib/zones";

interface QuoteFormProps {
  lang: Lang;
  defaultZone?: string;
}

export default function QuoteForm({ lang, defaultZone }: QuoteFormProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [trade, setTrade] = useState("plumbing");
  const [zone, setZone] = useState(defaultZone ?? "");
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!zone) {
      setError(
        lang === "fr"
          ? "Choisissez votre arrondissement ou ville."
          : "Please select your borough or city."
      );
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          email: email.trim(),
          trade,
          zone,
          message: message.trim() || null,
          language: lang,
          website,
        }),
      });

      const data = (await res.json().catch(() => ({}))) as {
        error?: string;
        code?: string;
        details?: unknown;
        success?: boolean;
      };

      if (!res.ok) {
        if (data.code === "VALIDATION") {
          setError(
            lang === "fr"
              ? "Vérifiez le nom, téléphone, courriel et la zone."
              : "Check name, phone, email, and area."
          );
          return;
        }
        if (data.code === "MISSING_SUPABASE_ENV") {
          setError(
            lang === "fr"
              ? "Configuration serveur incomplète. Contactez le support."
              : "Server not configured. Please contact support."
          );
          return;
        }
        if (data.code === "SUPABASE_INSERT_FAILED") {
          setError(
            lang === "fr"
              ? "Impossible d'enregistrer la demande. Réessayez dans une minute."
              : "Could not save your request. Try again in a minute."
          );
          return;
        }
        throw new Error(data.error || `HTTP ${res.status}`);
      }

      setSuccess(true);
    } catch {
      setError(t(lang, "form.error"));
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-8 text-center">
        <p className="text-xl font-bold text-amber-400">{t(lang, "form.success")}</p>
        <p className="mt-2 text-sm text-zinc-300">{t(lang, "form.successBody")}</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-4 rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:p-8"
      id="soumission"
    >
      <div>
        <h2 className="text-xl font-bold text-white">{t(lang, "form.title")}</h2>
        <p className="mt-1 text-sm text-zinc-400">{t(lang, "form.sub")}</p>
      </div>

      {/* honeypot */}
      <input
        type="text"
        name="website"
        value={website}
        onChange={(e) => setWebsite(e.target.value)}
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
      />

      <input
        required
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder={t(lang, "form.name")}
        className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-zinc-500 outline-none focus:border-amber-500/50"
        autoComplete="name"
      />
      <input
        required
        type="tel"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder={`${t(lang, "form.phone")} *`}
        className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-zinc-500 outline-none focus:border-amber-500/50"
        autoComplete="tel"
      />
      <input
        required
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={t(lang, "form.email")}
        className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-zinc-500 outline-none focus:border-amber-500/50"
        autoComplete="email"
      />
      <select
        required
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
      <select
        required
        value={zone}
        onChange={(e) => setZone(e.target.value)}
        className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none focus:border-amber-500/50"
      >
        <option value="" disabled className="bg-zinc-900">
          {t(lang, "form.zone")}
        </option>
        {ZONE_GROUPS.map((g) => (
          <optgroup key={g.id} label={lang === "fr" ? g.labelFr : g.labelEn} className="bg-zinc-900">
            {g.zones.map((z) => (
              <option key={z.slug} value={z.slug} className="bg-zinc-900">
                {zoneLabel(z, lang)}
              </option>
            ))}
          </optgroup>
        ))}
      </select>
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder={t(lang, "form.message")}
        rows={3}
        className="w-full resize-none rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-zinc-500 outline-none focus:border-amber-500/50"
      />

      {error && <p className="text-sm text-red-400">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-amber-500 py-3.5 text-sm font-bold text-black hover:bg-amber-400 disabled:opacity-60"
      >
        {loading ? "…" : t(lang, "form.submit")}
      </button>
      <p className="text-center text-xs text-zinc-500">
        {lang === "fr"
          ? "Gratuit. Vos coordonnées sont partagées avec des entrepreneurs jumelés seulement."
          : "Free. Your contact is shared only with matched contractors."}
      </p>
    </form>
  );
}
