import type { VehicleRiskProfile } from "../vehicleRiskProfiles";

export const renaultRiskProfiles: VehicleRiskProfile[] = [
  {
    id: "renault-15-dci-2008-2026",
    brand: "Renault",
    modelKeywords: [
      "clio",
      "megane",
      "fluence",
      "symbol",
      "captur",
    ],
    yearMin: 2008,
    yearMax: 2026,
    fuelKeywords: ["dizel"],
    engineKeywords: [
      "1.5 dci",
      "dci",
    ],
    risks: [
      {
        title: "Enjektör ve Yakıt Sistemi",
        description:
          "Yüksek kilometrede enjektör, yakıt basınç sistemi ve pompa sorunları görülebilir.",
        severity: "high",
        estimatedCostMin: 15_000,
        estimatedCostMax: 80_000,
        checks: [
          "Soğuk çalıştırma testi yapılmalı.",
          "Enjektör geri dönüş değerleri kontrol edilmeli.",
          "Yakıt basıncı incelenmeli.",
        ],
      },
      {
        title: "Turbo ve Yağlama",
        description:
          "Bakımı geciken araçlarda turbo aşınması ve yağlama kaynaklı sorunlar oluşabilir.",
        severity: "medium",
        estimatedCostMin: 18_000,
        estimatedCostMax: 60_000,
        checks: [
          "Turbo sesi ve basıncı kontrol edilmeli.",
          "Yağ bakım geçmişi doğrulanmalı.",
          "Egzoz dumanı gözlemlenmeli.",
        ],
      },
      {
        title: "EDC Şanzıman",
        description:
          "EDC şanzımanlı araçlarda kavrama aşınması ve düşük hızda titreme görülebilir.",
        severity: "high",
        estimatedCostMin: 30_000,
        estimatedCostMax: 120_000,
        checks: [
          "Kalkış ve düşük hız geçişleri test edilmeli.",
          "Şanzıman arıza kayıtları taranmalı.",
          "Kavrama adaptasyon değerleri kontrol edilmeli.",
        ],
      },
    ],
  },
];
