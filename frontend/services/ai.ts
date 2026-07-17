import type { AnalysisResult } from "../types/analysis";
import type { Vehicle } from "../types/vehicle";

export async function analyzeVehicle(
  vehicle: Vehicle
): Promise<AnalysisResult> {
  return {
    vehicle,

    score: 91,

    purchaseRecommendation: "buy",

    priceAnalysis: {
      listingPrice: vehicle.price,
      estimatedMarketPrice: 1285000,
      difference: vehicle.price - 1285000,
      differencePercentage:
        ((vehicle.price - 1285000) / 1285000) * 100,
      evaluation: "good",
    },

    chronicProblems: [
      "Soğutma sistemi parçaları yaşa bağlı kontrol edilmelidir.",
      "Otomatik şanzımanın bakım geçmişi incelenmelidir.",
      "Turbo ve yağ kaçakları ekspertizde kontrol edilmelidir.",
    ],

    advantages: [
      "İlan fiyatı tahmini piyasa değerinin altında.",
      "Motor ve donanım kombinasyonu piyasada talep görüyor.",
      "Yakıt tüketimi sınıfına göre makul seviyede.",
    ],

    disadvantages: [
      "Kilometresi yaşıyla birlikte detaylı kontrol gerektiriyor.",
      "Bakım geçmişi belgelerle doğrulanmalı.",
      "Ekspertiz yapılmadan kesin karar verilmemeli.",
    ],

    aiComment:
      "Araç, ilan bilgilerine göre piyasa değerinin bir miktar altında görünüyor. Bakım geçmişi doğrulanır ve ekspertizde önemli bir sorun çıkmazsa değerlendirilebilir.",

    negotiationAdvice:
      "Ekspertiz ve bakım masrafları gerekçe gösterilerek 20.000 TL ile 35.000 TL arasında pazarlık denenebilir.",

    importantChecks: [
      "Tramer ve hasar kaydı doğrulanmalı.",
      "Motor, turbo ve soğutma sistemi kontrol edilmeli.",
      "Şanzıman geçişleri test sürüşünde incelenmeli.",
      "Boya ve değişen parçalar ekspertizle doğrulanmalı.",
    ],
  };
}