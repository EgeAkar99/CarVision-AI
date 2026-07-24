import type { VehicleRiskProfile } from "../vehicleRiskProfiles";

export const peugeotRiskProfiles: VehicleRiskProfile[] = [
  {
    id: "peugeot-puretech-2014-2026",
    brand: "Peugeot",
    modelKeywords: [
      "208",
      "2008",
      "308",
      "3008",
      "508",
    ],
    yearMin: 2014,
    yearMax: 2026,
    fuelKeywords: ["benzin"],
    engineKeywords: [
      "puretech",
      "1.2",
    ],
    risks: [
      {
        title: "Islak Triger Kayışı",
        description:
          "Bazı PureTech motorlarda yağ içinde çalışan triger kayışı aşınarak yağlama sistemini etkileyebilir.",
        severity: "high",
        estimatedCostMin: 20_000,
        estimatedCostMax: 120_000,
        checks: [
          "Triger kayışı fiziksel olarak kontrol edilmeli.",
          "Yağ basıncı ve yağ süzgeci incelenmeli.",
          "Triger değişim geçmişi belgelenmeli.",
        ],
      },
      {
        title: "Yağ Tüketimi",
        description:
          "Bazı araçlarda yağ eksiltme ve düzensiz yanma görülebilir.",
        severity: "medium",
        estimatedCostMin: 10_000,
        estimatedCostMax: 80_000,
        checks: [
          "Yağ seviyesi ve bakım kayıtları kontrol edilmeli.",
          "Egzoz dumanı gözlemlenmeli.",
          "Kompresyon testi yapılmalı.",
        ],
      },
    ],
  },
  {
    id: "peugeot-bluehdi-2014-2026",
    brand: "Peugeot",
    modelKeywords: [
      "208",
      "2008",
      "308",
      "3008",
      "508",
    ],
    yearMin: 2014,
    yearMax: 2026,
    fuelKeywords: ["dizel"],
    engineKeywords: [
      "bluehdi",
      "hdi",
    ],
    risks: [
      {
        title: "AdBlue ve Emisyon Sistemi",
        description:
          "AdBlue deposu, pompası ve NOx sensörü arızaları görülebilir.",
        severity: "high",
        estimatedCostMin: 20_000,
        estimatedCostMax: 100_000,
        checks: [
          "AdBlue arıza kayıtları taranmalı.",
          "NOx sensörü değerleri kontrol edilmeli.",
          "DPF doluluk oranı incelenmeli.",
        ],
      },
    ],
  },
];
