"use client";

import { useState } from "react";
import type { Lang } from "@/lib/i18n";
import { TRADES } from "@/lib/trades";
import { ALL_ZONES, zoneLabel } from "@/lib/zones";
import { cn } from "@/lib/cn";

const inputClass =
  "w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-zinc-500 outline-none focus:border-amber-500/50";

export default function DirectoryRegisterForm({ lang }: { lang: Lang }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [trade, setTrade] = useState("plumbing");
  const [zones, setZones] = useState<string[]>(["plateau"]);
  const [rbq, setRbq] = useState("");
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [doneSlug, setDoneSlug] = useState("");

  function toggleZone(slug: string) {
    setZones((z) =>
      z.includes(slug) ? z.filter((x) => x !== slug) : z.length >= 15 ? z : [...z, slug]
    );
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/directory/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          trades: [trade],
          zones,
          rbq_number: rbq || undefined,
          bio: bio || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Error");
        return;
      }
      setDoneSlug(data.slug as string);
    } catch {
      setError(lang === "fr" ? "Erreur réseau" : "Network error");
    } finally {
      setLoading(false);
    }
  }

  if (doneSlug) {
    const href =
      lang === "en" ? `/en/entrepreneur/${doneSlug}` : `/entrepreneur/${doneSlug}`;
    return (
      <div className="rounded-2xl border border-amber-500/40 bg-amber-500/10 p-6 text-center">
        <p className="font-bold text-white">
          {lang === "fr" ? "Profil publié !" : "Profile live!"}
        </p>
        <a href={href} className="mt-3 inline-block text-amber-400 underline">
          {href}
        </a>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-4 rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:p-8"
    >
      <input
        required
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder={lang === "fr" ? "Nom de l'entreprise" : "Business name"}
        className={inputClass}
        autoComplete="organization"
      />
      <input
        required
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={lang === "fr" ? "Courriel" : "Email"}
        className={inputClass}
        autoComplete="email"
      />
      <input
        required
        type="tel"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder={lang === "fr" ? "Téléphone" : "Phone"}
        className={inputClass}
        autoComplete="tel"
      />
      <select
        value={trade}
        onChange={(e) => setTrade(e.target.value)}
        className={inputClass}
      >
        {TRADES.map((t) => (
          <option key={t.id} value={t.id} className="bg-zinc-900">
            {lang === "fr" ? t.fr : t.en}
          </option>
        ))}
      </select>
      <input
        value={rbq}
        onChange={(e) => setRbq(e.target.value)}
        placeholder={lang === "fr" ? "RBQ (optionnel)" : "RBQ (optional)"}
        className={inputClass}
      />
      <textarea
        value={bio}
        onChange={(e) => setBio(e.target.value)}
        placeholder={lang === "fr" ? "Courte description" : "Short bio"}
        rows={3}
        className={cn(inputClass, "resize-none")}
      />
      <fieldset>
        <legend className="mb-2 text-sm text-zinc-400">
          {lang === "fr" ? "Zones (max 15)" : "Zones (max 15)"}
        </legend>
        <div className="grid max-h-48 grid-cols-2 gap-2 overflow-y-auto sm:grid-cols-3">
          {ALL_ZONES.map((z) => (
            <label
              key={z.slug}
              className="flex items-center gap-2 text-xs text-zinc-300"
            >
              <input
                type="checkbox"
                checked={zones.includes(z.slug)}
                onChange={() => toggleZone(z.slug)}
                className="accent-amber-500"
              />
              {zoneLabel(z, lang)}
            </label>
          ))}
        </div>
      </fieldset>
      {error && <p className="text-sm text-red-400">{error}</p>}
      <button
        type="submit"
        disabled={loading || zones.length === 0}
        className={cn(
          "w-full rounded-xl bg-amber-500 py-3.5 text-sm font-bold text-black hover:bg-amber-400 disabled:opacity-60"
        )}
      >
        {loading
          ? "…"
          : lang === "fr"
            ? "Publier mon profil gratuit"
            : "Publish free profile"}
      </button>
    </form>
  );
}
