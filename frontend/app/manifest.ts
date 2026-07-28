import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "CarVision AI",
    short_name: "CarVision AI",
    description:
      "Yapay zeka destekli ikinci el araç analiz ve değerlendirme platformu.",
    start_url: "/",
    display: "standalone",
    background_color: "#020617",
    theme_color: "#020617",
    lang: "tr",
  };
}