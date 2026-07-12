import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "MTLTrades — Soumissions gratuites Grand Montréal",
    template: "%s | MTLTrades",
  },
  description:
    "Soumissions gratuites d'entrepreneurs au Grand Montréal. Arrondissements, Laval, Rive-Sud. Plomberie, électricité, toiture, rénovations.",
  metadataBase: new URL("https://mtltrades.com"),
  openGraph: {
    locale: "fr_CA",
    alternateLocale: "en_CA",
    type: "website",
    siteName: "MTLTrades",
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
        {children}
      </body>
    </html>
  );
}
