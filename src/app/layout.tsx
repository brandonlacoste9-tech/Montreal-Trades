import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Analytics from "@/components/Analytics";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://mtltrades.com"),
  title: {
    default: "MTLTrades — Soumissions gratuites Grand Montréal",
    template: "%s | MTLTrades",
  },
  description:
    "Soumissions gratuites d'entrepreneurs au Grand Montréal. Arrondissements, Laval, Rive-Sud. Plomberie, électricité, toiture, rénovations.",
  applicationName: "MTLTrades",
  authors: [{ name: "MTLTrades", url: "https://mtltrades.com" }],
  creator: "MTLTrades",
  openGraph: {
    locale: "fr_CA",
    alternateLocale: "en_CA",
    type: "website",
    siteName: "MTLTrades",
    images: [{ url: "/hero-montreal.jpg", width: 1200, height: 630, alt: "MTLTrades Grand Montréal" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "MTLTrades",
    description: "Free contractor quotes & exclusive trade leads — Greater Montreal",
    images: ["/hero-montreal.jpg"],
  },
  robots: { index: true, follow: true },
  icons: { icon: "/favicon.ico" },
  verification: {
    google: "6DUbt7_nMIDzu-TDS0DW3nswHDSnDyU8nHHYJXyXFS0",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr-CA"
      className={`${geistSans.variable} ${geistMono.variable} h-full`}
      suppressHydrationWarning
    >
      <head>
        <meta charSet="utf-8" />
      </head>
      <body className={`${geistSans.className} min-h-full bg-[#0c0c0c] text-zinc-100 antialiased`}>
        <Analytics />
        {children}
      </body>
    </html>
  );
}
