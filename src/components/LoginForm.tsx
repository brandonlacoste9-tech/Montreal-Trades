"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { Lang } from "@/lib/i18n";
import { t } from "@/lib/i18n";
import { hrefFor } from "@/lib/paths";

export default function LoginForm({ lang }: { lang: Lang }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(
          data.code === "INACTIVE"
            ? t(lang, "login.inactive")
            : data.error === "Invalid email or password"
              ? t(lang, "login.error")
              : data.error || t(lang, "login.error")
        );
        return;
      }
      router.push(hrefFor(lang, "dashboard"));
    } catch {
      setError(t(lang, "login.network"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <h1 className="text-2xl font-black">{t(lang, "login.title")}</h1>
      <p className="mt-2 text-sm text-zinc-400">
        {t(lang, "login.sub")}{" "}
        <Link
          href={hrefFor(lang, "entrepreneurs")}
          className="text-amber-400 hover:underline"
        >
          {t(lang, "login.seePlans")}
        </Link>
      </p>
      <form onSubmit={onSubmit} className="mt-8 space-y-3">
        <input
          required
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t(lang, "login.email")}
          className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none focus:border-amber-500/50"
        />
        <input
          required
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={t(lang, "login.password")}
          className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none focus:border-amber-500/50"
        />
        {error && <p className="text-sm text-red-400">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-amber-500 py-3 text-sm font-bold text-black hover:bg-amber-400 disabled:opacity-60"
        >
          {loading ? "…" : t(lang, "login.submit")}
        </button>
      </form>
    </>
  );
}
