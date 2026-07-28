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
  metadataBase: new URL("https://carvision-ai.vercel.app"),

  title: {
    default: "CarVision AI | Yapay Zeka Destekli Araç Analizi",
    template: "%s | CarVision AI",
  },

  description:
    "CarVision AI, ikinci el araç ilanlarını yapay zeka ile analiz ederek fiyat değerlendirmesi, emsal karşılaştırması, satın alma riski ve detaylı araç raporu sunar.",

  keywords: [
    "CarVision AI",
    "araç analizi",
    "ikinci el araç",
    "sahibinden",
    "araç fiyat analizi",
    "yapay zeka",
    "ekspertiz",
  ],

  authors: [{ name: "Ege Akar" }],
  creator: "Ege Akar",
  applicationName: "CarVision AI",

  openGraph: {
    title: "CarVision AI",
    description:
      "Yapay zeka destekli ikinci el araç analiz platformu.",
    url: "https://carvision-ai.vercel.app",
    siteName: "CarVision AI",
    locale: "tr_TR",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "CarVision AI",
    description:
      "Yapay zeka destekli ikinci el araç analiz platformu.",
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="tr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
