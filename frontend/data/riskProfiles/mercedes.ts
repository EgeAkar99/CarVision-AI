import type { VehicleRiskProfile } from "../vehicleRiskProfiles";

export const mercedesRiskProfiles: VehicleRiskProfile[] = [
  {
    id: "mercedes-e200d-2016-2024",
    brand: "Mercedes-Benz",
    modelKeywords: [
      "e 200 d",
      "e200d",
      "e serisi",
    ],
    yearMin: 2016,
    yearMax: 2024,
    fuelKeywords: ["dizel"],
    transmissionKeywords: [
      "otomatik",
      "9g-tronic",
    ],
    engineKeywords: [
      "om654",
      "1.6 dizel",
      "2.0 dizel",
    ],
    risks: [
      {
        title: "AdBlue ve SCR Sistemi",
        description:
          "AdBlue pompası, enjektörü ve NOx sensörlerinde yaşa ve kilometreye bağlı arızalar görülebilir.",
        severity: "medium",
        estimatedCostMin: 15000,
        estimatedCostMax: 40000,
        checks: [
          "Arıza kayıtlarında AdBlue ve SCR hataları kontrol edilmeli.",
          "NOx sensörlerinin çalışma değerleri incelenmeli.",
          "AdBlue pompası ve enjektörü test edilmeli.",
        ],
      },
      {
        title: "DPF ve EGR Sistemi",
        description:
          "Kısa mesafe kullanımında DPF doluluğu ve EGR kurumlanması görülebilir.",
        severity: "medium",
        estimatedCostMin: 10000,
        estimatedCostMax: 35000,
        checks: [
          "DPF doluluk oranı ölçülmeli.",
          "Rejenerasyon geçmişi kontrol edilmeli.",
          "EGR valfi ve emme sistemi incelenmeli.",
        ],
      },
      {
        title: "9G-Tronic Şanzıman",
        description:
          "Şanzıman genel olarak dayanıklıdır ancak yağ bakımı ihmal edilmiş araçlarda geçiş sorunları oluşabilir.",
        severity: "low",
        estimatedCostMin: 8000,
        estimatedCostMax: 30000,
        checks: [
          "Soğuk ve sıcak kullanımda vites geçişleri test edilmeli.",
          "Şanzıman yağı ve filtre bakım geçmişi sorgulanmalı.",
          "Vuruntu, gecikme ve kaydırma kontrol edilmeli.",
        ],
      },
      {
        title: "Soğutma Sistemi",
        description:
          "Termostat, su pompası ve bağlantı ekipmanlarında zamanla kaçak veya çalışma problemi oluşabilir.",
        severity: "medium",
        estimatedCostMin: 8000,
        estimatedCostMax: 25000,
        checks: [
          "Soğutma suyu seviyesi ve kaçaklar kontrol edilmeli.",
          "Termostat çalışma sıcaklığı incelenmeli.",
          "Su pompası ve hortum bağlantıları kontrol edilmeli.",
        ],
      },
    ],
  },
];
