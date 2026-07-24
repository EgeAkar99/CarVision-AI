import type { VehicleRiskProfile } from "../vehicleRiskProfiles";

export const fiatRiskProfiles: VehicleRiskProfile[] = [
  {
    id: "fiat-egea-13-multijet-2015-2026",
    brand: "Fiat",
    modelKeywords: ["egea"],
    yearMin: 2015,
    yearMax: 2026,
    fuelKeywords: ["dizel"],
    engineKeywords: [
      "1.3 multijet",
      "1.3 mjet",
      "multijet",
    ],
    risks: [
      {
        title: "EGR ve DPF Riski",
        description:
          "Kısa mesafe ve yoğun şehir kullanımında EGR ile DPF sisteminde kurumlanma görülebilir.",
        severity: "medium",
        estimatedCostMin: 8_000,
        estimatedCostMax: 45_000,
        checks: [
          "DPF doluluk oranı kontrol edilmeli.",
          "EGR sistemi ve egzoz basınç değerleri incelenmeli.",
          "Rejenerasyon geçmişi sorgulanmalı.",
        ],
      },
      {
        title: "Enjektör ve Yakıt Sistemi",
        description:
          "Yüksek kilometrede enjektör geri dönüş değerlerinde bozulma ve zor çalışma görülebilir.",
        severity: "high",
        estimatedCostMin: 15_000,
        estimatedCostMax: 70_000,
        checks: [
          "Soğuk çalıştırma testi yapılmalı.",
          "Enjektör geri dönüş testi yapılmalı.",
          "Yakıt basıncı ve pompa değerleri kontrol edilmeli.",
        ],
      },
      {
        title: "Debriyaj ve Volan",
        description:
          "Yüksek kilometreli manuel araçlarda debriyaj ve çift kütleli volan aşınabilir.",
        severity: "medium",
        estimatedCostMin: 20_000,
        estimatedCostMax: 65_000,
        checks: [
          "Kalkışta titreme kontrol edilmeli.",
          "Debriyaj kavrama noktası incelenmeli.",
          "Rölantide volan sesi dinlenmeli.",
        ],
      },
    ],
  },
];
