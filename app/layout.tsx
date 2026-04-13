import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

export const metadata: Metadata = {
  title: "WebIntel AI - Analyse intelligente de sites web",
  description:
    "Plateforme SaaS d'analyse de sites web basée sur l'IA. Détectez les problèmes UX, bugs techniques et opportunités d'optimisation.",
  keywords: [
    "analyse web",
    "UX",
    "IA",
    "bugs",
    "performance",
    "SEO",
    "intelligence artificielle",
  ],
};

export const viewport: Viewport = {
  themeColor: "#0ea5e9",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="fr"
      className={`${inter.variable} ${jetbrainsMono.variable} bg-background`}
    >
      <body className="min-h-screen font-sans">{children}</body>
    </html>
  );
}
