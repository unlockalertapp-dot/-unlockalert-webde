import type { Metadata, Viewport } from "next";
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
  // ─── Titre & description ─────────────────────────────────────
  title: {
    default: "UnlockAlert – Rejoins la bataille N'LOCK vs N'LUCK",
    template: "%s | UnlockAlert",
  },
  description:
    "Compte tes déverrouillages, rejoins ta faction et défie tes amis. N'LOCK (discipline) vs N'LUCK (instinct) — L'app Android qui transforme ton smartphone en arène. Dispo sur Google Play.",

  // ─── Mots clés SEO ───────────────────────────────────────────
  keywords: [
    "UnlockAlert",
    "compteur déverrouillage",
    "addiction smartphone",
    "app productivité",
    "N'LOCK",
    "N'LUCK",
    "gamification",
    "défi smartphone",
    "Android",
    "JOY ENTREPRISES",
    "Julien Aler",
  ],

  // ─── Auteur & créateur ───────────────────────────────────────
  authors: [{ name: "Julien Aler", url: "https://unlockalert.app" }],
  creator: "Julien Aler",
  publisher: "JOY ENTREPRISES",

  // ─── URL canonique ───────────────────────────────────────────
  metadataBase: new URL("https://unlockalert.app"),
  alternates: {
    canonical: "/",
  },

  // ─── Open Graph (partages Facebook, LinkedIn, WhatsApp) ──────
  openGraph: {
    title: "UnlockAlert – Rejoins la bataille N'LOCK vs N'LUCK",
    description:
      "Compte tes déverrouillages, rejoins ta faction et défie tes amis. Disponible sur Android.",
    url: "https://unlockalert.app",
    siteName: "UnlockAlert",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "UnlockAlert — N'LOCK vs N'LUCK",
      },
    ],
    locale: "fr_FR",
    type: "website",
  },

  // ─── Twitter / X Cards ───────────────────────────────────────
  twitter: {
    card: "summary_large_image",
    title: "UnlockAlert – Rejoins la bataille N'LOCK vs N'LUCK",
    description:
      "Compte tes déverrouillages. Choisis ton camp. Dispo sur Android.",
    images: ["/og-image.png"],
    creator: "@unlockalert",
  },

  // ─── Robots & indexation ─────────────────────────────────────
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // ─── Icônes ──────────────────────────────────────────────────
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },

  // ─── Manifest PWA (optionnel mais propre) ────────────────────
  manifest: "/manifest.json",

  // ─── Catégorie ───────────────────────────────────────────────
  category: "productivity",
};

// ─── Viewport (séparé depuis Next.js 14) ───────────────────────
export const viewport: Viewport = {
  themeColor: "#9D00FF",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
