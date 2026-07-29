import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import ServiceWorkerRegistration from "@/components/pwa/ServiceWorkerRegistration";
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
  metadataBase: new URL("https://carvision-ai-delta.vercel.app"),

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
  manifest: "/manifest.webmanifest",

  appleWebApp: {
    capable: true,
    title: "CarVision AI",
    statusBarStyle: "black-translucent",
  },

  icons: {
    icon: [
      { url: "/favicon.ico" },
      {
        url: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        url: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    apple: [
      {
        url: "/apple-icon.png",
        sizes: "192x192",
        type: "image/png",
      },
    ],
  },

  openGraph: {
    title: "CarVision AI",
    description: "Yapay zeka destekli ikinci el araç analiz platformu.",
    url: "https://carvision-ai-delta.vercel.app",
    siteName: "CarVision AI",
    locale: "tr_TR",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "CarVision AI",
    description: "Yapay zeka destekli ikinci el araç analiz platformu.",
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
      <body className="min-h-full flex flex-col">
        {children}
        <ServiceWorkerRegistration />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}