import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "CarVision AI",
    short_name: "CarVision AI",
    description:
      "Yapay zeka destekli ikinci el araç analiz ve değerlendirme platformu.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait-primary",
    background_color: "#020617",
    theme_color: "#020617",
    lang: "tr",
    categories: ["automotive", "utilities"],
    shortcuts: [
      {
        name: "Araç Analizi",
        short_name: "Analiz",
        description: "Yeni bir araç ilanını analiz et.",
        url: "/#analysis",
        icons: [
          {
            src: "/android-chrome-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
        ],
      },
      {
        name: "Gizlilik Politikası",
        short_name: "Gizlilik",
        description: "CarVision AI gizlilik politikasını görüntüle.",
        url: "/privacy",
        icons: [
          {
            src: "/android-chrome-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
        ],
      },
    ],
    icons: [
      {
        src: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
