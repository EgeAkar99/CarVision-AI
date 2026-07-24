import type { VehicleRiskProfile } from "../vehicleRiskProfiles";

export const japaneseRiskProfiles: VehicleRiskProfile[] = [
  {
    id: "toyota-cvt-2010-2026",
    brand: "Toyota",
    modelKeywords: ["corolla", "auris", "c-hr", "yaris"],
    yearMin: 2010,
    yearMax: 2026,
    transmissionKeywords: ["otomatik", "cvt"],
    risks: [
      {
        title: "CVT Bakım Geçmişi",
        description:
          "CVT şanzıman genel olarak dayanıklı olsa da yağ bakımı ihmal edilmiş araçlarda uğultu ve geçiş sorunları görülebilir.",
        severity: "medium",
        estimatedCostMin: 15_000,
        estimatedCostMax: 90_000,
        checks: [
          "CVT yağı değişim geçmişi sorgulanmalı.",
          "Hızlanmada uğultu ve devir dalgalanması kontrol edilmeli.",
          "Şanzıman hata kodları taranmalı.",
        ],
      },
    ],
  },
  {
    id: "honda-civic-automatic-2007-2026",
    brand: "Honda",
    modelKeywords: ["civic", "city", "jazz"],
    yearMin: 2007,
    yearMax: 2026,
    transmissionKeywords: ["otomatik", "cvt"],
    risks: [
      {
        title: "Otomatik Şanzıman Bakımı",
        description:
          "Şanzıman yağı geciktirilen araçlarda vuruntu ve geçiş problemleri görülebilir.",
        severity: "medium",
        estimatedCostMin: 12_000,
        estimatedCostMax: 80_000,
        checks: [
          "Şanzıman yağı geçmişi doğrulanmalı.",
          "Soğuk ve sıcak geçişler test edilmeli.",
          "Kalkışta titreme kontrol edilmeli.",
        ],
      },
    ],
  },
];
