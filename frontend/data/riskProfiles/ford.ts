import type { VehicleRiskProfile } from "../vehicleRiskProfiles";

export const fordRiskProfiles: VehicleRiskProfile[] = [
  {
    id: "ford-10-ecoboost-2012-2026",
    brand: "Ford",
    modelKeywords: [
      "focus",
      "fiesta",
      "puma",
      "ecosport",
    ],
    yearMin: 2012,
    yearMax: 2026,
    fuelKeywords: ["benzin"],
    engineKeywords: [
      "1.0 ecoboost",
      "ecoboost",
    ],
    risks: [
      {
        title: "Islak Triger Kayışı",
        description:
          "Yağ içinde çalışan triger kayışında aşınma ve parçalanma görülebilir.",
        severity: "high",
        estimatedCostMin: 20_000,
        estimatedCostMax: 130_000,
        checks: [
          "Triger kayışı durumu kontrol edilmeli.",
          "Yağ pompası süzgeci incelenmeli.",
          "Triger değişim geçmişi belgelenmeli.",
        ],
      },
      {
        title: "Soğutma Sistemi",
        description:
          "Soğutma sıvısı eksiltme ve hararet kaynaklı motor hasarı riski oluşabilir.",
        severity: "high",
        estimatedCostMin: 15_000,
        estimatedCostMax: 150_000,
        checks: [
          "Soğutma sistemi kaçak testi yapılmalı.",
          "Hararet geçmişi sorgulanmalı.",
          "Genleşme kabı ve hortumlar kontrol edilmeli.",
        ],
      },
    ],
  },
];
