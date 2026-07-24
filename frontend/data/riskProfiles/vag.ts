import type { VehicleRiskProfile } from "../vehicleRiskProfiles";

export const vagRiskProfiles: VehicleRiskProfile[] = [
  {
    id: "audi-s-tronic-2008-2026",
    brand: "Audi",
    modelKeywords: ["a3", "a4", "a5", "a6", "q3", "q5"],
    yearMin: 2008,
    yearMax: 2026,
    transmissionKeywords: ["otomatik", "s tronic", "dsg"],
    risks: [
      {
        title: "S Tronic Kavrama ve Mekatronik",
        description:
          "Kavrama aşınması ve mekatronik arızaları görülebilir.",
        severity: "high",
        estimatedCostMin: 35_000,
        estimatedCostMax: 150_000,
        checks: [
          "Kalkışta titreme kontrol edilmeli.",
          "D-R geçişleri test edilmeli.",
          "Şanzıman hata kayıtları taranmalı.",
        ],
      },
    ],
  },
  {
    id: "skoda-dsg-2008-2026",
    brand: "Skoda",
    modelKeywords: ["octavia", "superb", "fabia", "karoq", "kodiaq"],
    yearMin: 2008,
    yearMax: 2026,
    transmissionKeywords: ["otomatik", "dsg"],
    risks: [
      {
        title: "DSG Kavrama ve Mekatronik",
        description:
          "Yoğun şehir kullanımında kavrama ve mekatronik sorunları görülebilir.",
        severity: "high",
        estimatedCostMin: 30_000,
        estimatedCostMax: 120_000,
        checks: [
          "Kalkışta silkeleme kontrol edilmeli.",
          "Düşük hız geçişleri test edilmeli.",
          "Şanzıman adaptasyon değerleri incelenmeli.",
        ],
      },
    ],
  },
];
