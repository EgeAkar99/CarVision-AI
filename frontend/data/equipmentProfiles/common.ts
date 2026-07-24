import type { EquipmentProfile } from "../equipmentProfiles";

export const commonEquipmentProfiles: EquipmentProfile[] = [
  {
    id: "common-advanced-safety",
    brand: "*",
    packageKeywords: [
      "adaptif cruise",
      "adaptive cruise",
      "şerit takip",
      "serit takip",
      "kör nokta",
      "kor nokta",
      "360 kamera",
    ],
    title: "Gelişmiş Sürüş Destek Sistemleri",
    description:
      "Araçta gelişmiş sürüş destek donanımları ilan metninde belirtiliyor.",
    checks: [
      "Adaptif hız sabitleyici radar kalibrasyonu kontrol edilmeli.",
      "Şerit takip kamerası ve ön cam değişim geçmişi incelenmeli.",
      "Kör nokta sensörleri test edilmeli.",
      "360 derece kamera görüntüleri kontrol edilmeli.",
    ],
    positiveSignals: [
      "Gelişmiş güvenlik donanımları kullanım konforunu artırabilir.",
      "Bu donanımlar ikinci el değerini destekleyebilir.",
    ],
  },
  {
    id: "common-premium-comfort",
    brand: "*",
    packageKeywords: [
      "head up display",
      "hud",
      "hafızalı koltuk",
      "hafizali koltuk",
      "ısıtmalı koltuk",
      "isitmali koltuk",
      "soğutmalı koltuk",
      "sogutmali koltuk",
      "panoramik cam tavan",
      "elektrikli bagaj",
    ],
    title: "Premium Konfor Donanımları",
    description:
      "İlanda premium konfor ekipmanları tespit edildi.",
    checks: [
      "Elektrikli koltuk ve hafıza fonksiyonları test edilmeli.",
      "Koltuk ısıtma ve soğutma fonksiyonları kontrol edilmeli.",
      "Panoramik tavanın su tahliyeleri ve mekanizması incelenmeli.",
      "Elektrikli bagaj motoru ve sensörleri test edilmeli.",
    ],
    positiveSignals: [
      "Premium konfor donanımları aracın kullanım değerini artırabilir.",
      "Zengin donanım paketi satış hızını destekleyebilir.",
    ],
  },
  {
    id: "common-premium-media-lighting",
    brand: "*",
    packageKeywords: [
      "matrix led",
      "harman kardon",
      "bose",
      "burmester",
      "kablosuz carplay",
      "wireless carplay",
      "android auto",
    ],
    title: "Premium Multimedya ve Aydınlatma",
    description:
      "İlanda gelişmiş aydınlatma veya premium ses sistemi belirtiliyor.",
    checks: [
      "Matrix LED far modülleri ve adaptif fonksiyonlar test edilmeli.",
      "Ses sistemi hoparlörleri ve amfi kontrol edilmeli.",
      "CarPlay ve Android Auto bağlantısı denenmeli.",
    ],
    positiveSignals: [
      "Premium ses sistemi ve gelişmiş farlar donanım değerini artırabilir.",
      "Kablosuz telefon entegrasyonu günlük kullanım konforu sağlar.",
    ],
  },
];
