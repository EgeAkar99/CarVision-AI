import type { VehicleRiskProfile } from "../vehicleRiskProfiles";

export const volkswagenRiskProfiles: VehicleRiskProfile[] = [
  {
    id: "vw-dsg-2008-2026",
    brand: "Volkswagen",
    modelKeywords: [
      "golf",
      "passat",
      "polo",
      "jetta",
      "scirocco",
      "tiguan",
    ],
    yearMin: 2008,
    yearMax: 2026,
    transmissionKeywords: [
      "otomatik",
      "dsg",
    ],
    risks: [
      {
        title: "DSG Kavrama ve Mekatronik",
        description:
          "Özellikle yoğun şehir kullanımında kavrama ve mekatronik sorunları görülebilir.",
        severity: "high",
        estimatedCostMin: 30_000,
        estimatedCostMax: 120_000,
        checks: [
          "Kalkışta titreme ve silkeleme kontrol edilmeli.",
          "D-R geçişleri ve düşük hız manevraları test edilmeli.",
          "Şanzıman arıza kayıtları taranmalı.",
        ],
      },
    ],
  },
  {
    id: "vw-tsi-2008-2016",
    brand: "Volkswagen",
    modelKeywords: [
      "golf",
      "passat",
      "polo",
      "jetta",
      "scirocco",
    ],
    yearMin: 2008,
    yearMax: 2016,
    fuelKeywords: ["benzin"],
    engineKeywords: [
      "tsi",
      "1.2",
      "1.4",
    ],
    risks: [
      {
        title: "Zincir ve Yağ Tüketimi",
        description:
          "Bazı TSI motorlarda zincir uzaması ve yağ tüketimi görülebilir.",
        severity: "high",
        estimatedCostMin: 20_000,
        estimatedCostMax: 90_000,
        checks: [
          "Soğuk çalıştırmada zincir sesi dinlenmeli.",
          "Yağ eksiltme geçmişi sorgulanmalı.",
          "Kompresyon testi yapılmalı.",
        ],
      },
    ],
  },
];
