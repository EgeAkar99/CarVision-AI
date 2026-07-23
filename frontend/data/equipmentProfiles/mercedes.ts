import type { EquipmentProfile } from "../equipmentProfiles";

export const mercedesEquipmentProfiles: EquipmentProfile[] = [
  {
    id: "mercedes-amg-package",
    brand: "Mercedes-Benz",
    packageKeywords: [
      "amg",
      "amg line",
      "amg paket",
    ],
    title: "Mercedes AMG Donanım Paketi",
    description:
      "AMG dış görünüm, iç trim, jant, direksiyon ve süspansiyon bileşenlerinin araçla uyumlu ve orijinal olması önemlidir.",
    checks: [
      "AMG tampon ve marşpiyellerin orijinalliği kontrol edilmeli.",
      "AMG jantların ölçü ve parça kodları doğrulanmalı.",
      "Direksiyon, koltuk ve iç trim parçalarının paketle uyumu incelenmeli.",
      "Spor süspansiyon varsa yürüyen aksam sesleri kontrol edilmeli.",
    ],
    positiveSignals: [
      "AMG donanım paketi ikinci el talebini artırabilir.",
      "Orijinal AMG iç ve dış donanımlar aracın piyasa değerini destekleyebilir.",
    ],
  },
  {
    id: "mercedes-exclusive-package",
    brand: "Mercedes-Benz",
    packageKeywords: [
      "exclusive",
      "exclusive paket",
    ],
    title: "Mercedes Exclusive Donanım Paketi",
    description:
      "Exclusive paket konfor ve iç mekân donanımlarına odaklanır. Deri, ahşap trim ve elektronik konfor ekipmanları kontrol edilmelidir.",
    checks: [
      "Deri koltuklarda yıpranma ve elektrikli ayar sistemi kontrol edilmeli.",
      "Ahşap veya dekoratif trim parçalarında çatlak ve deformasyon incelenmeli.",
      "Hafıza, ısıtma ve konfor fonksiyonları test edilmeli.",
    ],
    positiveSignals: [
      "Exclusive paket konfor donanımı açısından avantaj sağlayabilir.",
      "Bakımlı iç mekân, ikinci el değerini olumlu etkileyebilir.",
    ],
  },
];
