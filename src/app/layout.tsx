import type { Metadata } from "next";
import { Bricolage_Grotesque, Manrope, IBM_Plex_Mono, Mukta } from "next/font/google";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

const mukta = Mukta({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin", "devanagari"],
  variable: "--font-mukta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SafeSpeak — Anonymous Multilingual Peer Support",
  description:
    "An anonymous peer-support chat for sensitive conversations with real-time English and Hindi translation and gentle safety guardrails.",
  keywords: [
    "anonymous chat",
    "peer support",
    "mental health",
    "multilingual chat",
    "hindi english translation",
    "privacy",
  ],
  authors: [{ name: "SafeSpeak Team" }],
  openGraph: {
    title: "SafeSpeak — Anonymous Multilingual Peer Support",
    description:
      "Talk about what you're going through without revealing who you are. Auto-translated between English and Hindi.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${bricolage.variable} ${manrope.variable} ${ibmPlexMono.variable} ${mukta.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
