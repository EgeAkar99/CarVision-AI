import type { EquipmentProfile } from "../equipmentProfiles";

export const bmwEquipmentProfiles: EquipmentProfile[] = [
  {
    id: "bmw-m-sport-package",
    brand: "BMW",
    packageKeywords: [
      "m sport",
      "m paket",
      "m-sport",
    ],
    title: "BMW M Sport Donanım Paketi",
    description:
      "M Sport paketinde tampon, jant, direksiyon, koltuk ve süspansiyon bileşenlerinin orijinalliği doğrulanmalıdır.",
    checks: [
      "M Sport tampon ve marşpiyellerin orijinalliği kontrol edilmeli.",
      "M direksiyon ve spor koltukların araçla uyumu incelenmeli.",
      "M jantların ölçüsü, kaynak ve eğrilik durumu kontrol edilmeli.",
      "Spor süspansiyon ve yürüyen aksam test edilmeli.",
    ],
    positiveSignals: [
      "M Sport paket ikinci el talebini artırabilir.",
      "Orijinal paket donanımları aracın piyasa değerini destekleyebilir.",
    ],
  },
];
