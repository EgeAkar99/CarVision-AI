import type { VehicleRiskProfile } from "../vehicleRiskProfiles";

export const bmwRiskProfiles: VehicleRiskProfile[] = [
  {
    id: "bmw-320i-2012-2026",
    brand: "BMW",
    modelKeywords: [
      "320i",
      "3 serisi",
    ],
    yearMin: 2012,
    yearMax: 2026,
    fuelKeywords: ["benzin"],
    transmissionKeywords: ["otomatik"],
    engineKeywords: [
      "n20",
      "b48",
      "1.6 benzin",
      "2.0 benzin",
    ],
    risks: [
      {
        title: "Yağ Kaçağı Riski",
        description:
          "Supap kapağı contası, yağ filtre gövdesi ve çevresinde zamanla yağ kaçakları görülebilir.",
        severity: "medium",
        estimatedCostMin: 8_000,
        estimatedCostMax: 30_000,
        checks: [
          "Motor çevresinde yağ kaçağı kontrol edilmeli.",
          "Yağ filtre gövdesi ve supap kapağı incelenmeli.",
        ],
      },
      {
        title: "Turbo ve Basınç Sistemi",
        description:
          "Turbo hortumları, wastegate ve basınç hattında performans kaybına yol açan sorunlar oluşabilir.",
        severity: "medium",
        estimatedCostMin: 12_000,
        estimatedCostMax: 50_000,
        checks: [
          "Turbo basınç değerleri kontrol edilmeli.",
          "Wastegate sesi ve turbo hortumları incelenmeli.",
        ],
      },
      {
        title: "Soğutma Sistemi",
        description:
          "Elektrikli su pompası ve termostat arızaları yaşa ve kilometreye bağlı görülebilir.",
        severity: "high",
        estimatedCostMin: 18_000,
        estimatedCostMax: 45_000,
        checks: [
          "Su pompası çalışma değerleri kontrol edilmeli.",
          "Termostat ve soğutma suyu sıcaklığı incelenmeli.",
          "Soğutma sistemi kaçak testi yapılmalı.",
        ],
      },
      {
        title: "Otomatik Şanzıman",
        description:
          "Şanzıman genel olarak dayanıklı olsa da yağ bakımı ihmal edilmiş araçlarda geçiş sorunları görülebilir.",
        severity: "low",
        estimatedCostMin: 10_000,
        estimatedCostMax: 35_000,
        checks: [
          "Soğuk ve sıcak vites geçişleri test edilmeli.",
          "Şanzıman yağı bakım geçmişi sorgulanmalı.",
        ],
      },
    ],
  },
];
