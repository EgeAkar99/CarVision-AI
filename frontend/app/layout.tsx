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
  title: "CarVision AI | Yapay Zeka Destekli Araç Analizi",
  description:
    "CarVision AI, ikinci el araç ilanlarını yapay zeka ile analiz ederek fiyat değerlendirmesi, emsal karşılaştırması, satın alma riski ve detaylı araç raporu sunar.",
  keywords: [
    "CarVision AI",
    "araç analizi",
    "ikinci el araç",
    "sahibinden analiz",
    "yapay zeka",
    "araç ekspertiz",
    "araç fiyat analizi",
  ],
  authors: [{ name: "Ege Akar" }],
  creator: "Ege Akar",
  applicationName: "CarVision AI",
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
