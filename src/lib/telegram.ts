import { getZoneBySlug, zoneLabel } from "@/lib/zones";
import { TRADES } from "@/lib/trades";

export type LeadAlert = {
  id?: string;
  name: string;
  phone: string;
  email: string;
  trade: string;
  zone: string;
  message?: string | null;
  language?: string;
};

function isPlaceholder(value: string | undefined): boolean {
  if (!value) return true;
  return /your-|placeholder|change-me/i.test(value);
}

export function isTelegramConfigured(): boolean {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chat = process.env.TELEGRAM_CHAT_ID;
  return !!(token && chat && !isPlaceholder(token) && !isPlaceholder(chat));
}

function tradeLabel(tradeId: string, lang: "fr" | "en"): string {
  const t = TRADES.find((x) => x.id === tradeId);
  if (!t) return tradeId;
  return lang === "fr" ? t.fr : t.en;
}

function formatAlert(lead: LeadAlert): string {
  const zone = getZoneBySlug(lead.zone);
  const zoneName = zone ? zoneLabel(zone, "fr") : lead.zone;
  const trade = tradeLabel(lead.trade, "fr");
  const msg = (lead.message || "").trim();

  const lines = [
    "🔨 *Nouveau lead — Montreal Trades*",
    "",
    `👤 *${escapeMd(lead.name)}*`,
    `📞 \`${escapeMd(lead.phone)}\``,
    `✉️ ${escapeMd(lead.email)}`,
    `🔧 ${escapeMd(trade)}`,
    `📍 ${escapeMd(zoneName)}`,
    `🌐 ${(lead.language || "fr").toUpperCase()}`,
  ];

  if (msg) {
    lines.push("", `💬 ${escapeMd(msg.slice(0, 500))}`);
  }

  if (lead.id) {
    lines.push("", `ID: \`${escapeMd(lead.id)}\``);
  }

  lines.push("", "_Appelle vite — speed wins._");
  return lines.join("\n");
}

/** Escape Telegram MarkdownV2 special chars (use Markdown legacy for simplicity) */
function escapeMd(s: string): string {
  return s.replace(/([_*`\[\]])/g, "\\$1");
}

/**
 * Fire-and-forget style notify. Never throws to caller — logs only.
 * Requires TELEGRAM_BOT_TOKEN + TELEGRAM_CHAT_ID.
 */
export async function notifyNewLead(lead: LeadAlert): Promise<boolean> {
  if (!isTelegramConfigured()) return false;

  const token = process.env.TELEGRAM_BOT_TOKEN!;
  const chatId = process.env.TELEGRAM_CHAT_ID!;
  const text = formatAlert(lead);

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: "Markdown",
        disable_web_page_preview: true,
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      console.error("[telegram] send failed", res.status, body.slice(0, 300));
      return false;
    }
    return true;
  } catch (err) {
    console.error("[telegram] error", err);
    return false;
  }
}
