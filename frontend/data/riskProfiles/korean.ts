import type { VehicleRiskProfile } from "../vehicleRiskProfiles";

export const koreanRiskProfiles: VehicleRiskProfile[] = [
  {
    id: "hyundai-dct-2015-2026",
    brand: "Hyundai",
    modelKeywords: ["i20", "i30", "elantra", "tucson", "kona"],
    yearMin: 2015,
    yearMax: 2026,
    transmissionKeywords: ["otomatik", "dct"],
    risks: [
      {
        title: "DCT Kavrama Riski",
        description:
          "Yoğun şehir kullanımında çift kavramalı şanzımanda titreme ve kavrama aşınması görülebilir.",
        severity: "high",
        estimatedCostMin: 25_000,
        estimatedCostMax: 110_000,
        checks: [
          "Kalkışta titreme kontrol edilmeli.",
          "Düşük hız geçişleri test edilmeli.",
          "Şanzıman hata kodları taranmalı.",
        ],
      },
    ],
  },
  {
    id: "kia-dct-2015-2026",
    brand: "Kia",
    modelKeywords: ["ceed", "rio", "sportage", "stonic"],
    yearMin: 2015,
    yearMax: 2026,
    transmissionKeywords: ["otomatik", "dct"],
    risks: [
      {
        title: "DCT Kavrama Riski",
        description:
          "Kavrama ısınması, titreme ve düşük hız geçiş sorunları görülebilir.",
        severity: "high",
        estimatedCostMin: 25_000,
        estimatedCostMax: 110_000,
        checks: [
          "Yoğun trafikte kavrama davranışı test edilmeli.",
          "Kalkış ve geri manevra kontrol edilmeli.",
          "Şanzıman adaptasyon değerleri incelenmeli.",
        ],
      },
    ],
  },
];
