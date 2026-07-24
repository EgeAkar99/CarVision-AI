import type { VehicleRiskProfile } from "../vehicleRiskProfiles";

export const opelRiskProfiles: VehicleRiskProfile[] = [
  {
    id: "opel-14-turbo-2010-2020",
    brand: "Opel",
    modelKeywords: [
      "astra",
      "corsa",
      "insignia",
      "mokka",
    ],
    yearMin: 2010,
    yearMax: 2020,
    fuelKeywords: ["benzin"],
    engineKeywords: [
      "1.4 turbo",
      "turbo",
    ],
    risks: [
      {
        title: "Soğutma Sistemi",
        description:
          "Termostat, devirdaim ve soğutma hattında kaçak kaynaklı hararet riski görülebilir.",
        severity: "high",
        estimatedCostMin: 12_000,
        estimatedCostMax: 70_000,
        checks: [
          "Soğutma sistemi basınç testi yapılmalı.",
          "Termostat çalışma değeri kontrol edilmeli.",
          "Hararet geçmişi sorgulanmalı.",
        ],
      },
      {
        title: "Turbo ve PCV Sistemi",
        description:
          "Turbo basınç hattı ve PCV sistemi kaynaklı düzensiz çalışma görülebilir.",
        severity: "medium",
        estimatedCostMin: 8_000,
        estimatedCostMax: 60_000,
        checks: [
          "Turbo basıncı kontrol edilmeli.",
          "Rölanti düzensizliği incelenmeli.",
          "PCV sistemi ve supap kapağı kontrol edilmeli.",
        ],
      },
    ],
  },
  {
    id: "opel-dizel-2010-2022",
    brand: "Opel",
    modelKeywords: [
      "astra",
      "corsa",
      "insignia",
      "mokka",
    ],
    yearMin: 2010,
    yearMax: 2022,
    fuelKeywords: ["dizel"],
    engineKeywords: [
      "cdti",
      "1.3",
      "1.6",
      "2.0",
    ],
    risks: [
      {
        title: "DPF ve EGR Sistemi",
        description:
          "Şehir içi kullanımda DPF doluluğu ve EGR kurumlanması görülebilir.",
        severity: "medium",
        estimatedCostMin: 10_000,
        estimatedCostMax: 55_000,
        checks: [
          "DPF doluluk oranı kontrol edilmeli.",
          "EGR çalışma değerleri incelenmeli.",
          "Rejenerasyon geçmişi sorgulanmalı.",
        ],
      },
    ],
  },
];
