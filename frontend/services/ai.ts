import type {
  AnalysisResult,
  ComparableVehicle,
} from "../types/analysis";
import type { Vehicle } from "../types/vehicle";
import {
  createComparableMarketAnalysis,
  createCompetitivePositioningAnalysis,
} from "./comparables";
import { getVehicleSpecificRisks } from "./vehicleRiskEngine";
import { analyzeEquipment } from "./equipment";
import { createComparableProvider } from "../providers/comparableProviderFactory";

type VehicleData = Vehicle & Record<string, unknown>;

type PriceEvaluation = AnalysisResult["priceAnalysis"]["evaluation"];
type PurchaseRecommendation = AnalysisResult["purchaseRecommendation"];

const CURRENT_YEAR = new Date().getFullYear();
const comparableProvider = createComparableProvider(
  process.env.COMPARABLE_PROVIDER === "sahibinden"
    ? "sahibinden"
    : "fake"
);

function getString(
  vehicle: VehicleData,
  keys: string[],
  fallback = ""
): string {
  for (const key of keys) {
    const value = vehicle[key];

    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }

  return fallback;
}

function getNumber(
  vehicle: VehicleData,
  keys: string[],
  fallback = 0
): number {
  for (const key of keys) {
    const value = vehicle[key];

    if (typeof value === "number" && Number.isFinite(value)) {
      return value;
    }

    if (typeof value === "string") {
      const normalizedValue = Number(
        value.replace(/[^\d,-]/g, "").replace(",", ".")
      );

      if (Number.isFinite(normalizedValue)) {
        return normalizedValue;
      }
    }
  }

  return fallback;
}

function getArray(vehicle: VehicleData, keys: string[]): string[] {
  for (const key of keys) {
    const value = vehicle[key];

    if (Array.isArray(value)) {
      return value
        .filter((item): item is string => typeof item === "string")
        .map((item) => item.trim())
        .filter(Boolean);
    }
  }

  return [];
}

function normalizeText(value: string): string {
  return value
    .toLocaleLowerCase("tr-TR")
    .replaceAll("ı", "i")
    .replaceAll("ş", "s")
    .replaceAll("ğ", "g")
    .replaceAll("ü", "u")
    .replaceAll("ö", "o")
    .replaceAll("ç", "c");
}

function createVehicleSeed(vehicle: VehicleData): number {
  const vehicleText = [
    getString(vehicle, ["brand", "make", "marka"]),
    getString(vehicle, ["model"]),
    getString(vehicle, ["trim", "package", "paket"]),
  ].join("-");

  return vehicleText.split("").reduce((total, character) => {
    return total + character.charCodeAt(0);
  }, 0);
}

function estimateMarketPrice(vehicle: VehicleData): number {
  const listingPrice = getNumber(vehicle, ["price", "listingPrice", "fiyat"]);
  const year = getNumber(vehicle, ["year", "modelYear", "yil"]);
  const mileage = getNumber(vehicle, [
    "mileage",
    "kilometers",
    "kilometre",
    "km",
  ]);
  const damageRecord = getNumber(vehicle, [
    "damageRecord",
    "tramer",
    "damageAmount",
    "hasarKaydi",
  ]);
  const paintedParts = getArray(vehicle, [
    "paintedParts",
    "painted",
    "boyaliParcalar",
  ]);
  const changedParts = getArray(vehicle, [
    "changedParts",
    "changed",
    "degisenParcalar",
  ]);

  const transmission = normalizeText(
    getString(vehicle, ["transmission", "gear", "vites"])
  );

  const fuelType = normalizeText(
    getString(vehicle, ["fuelType", "fuel", "yakit"])
  );

  const vehicleAge = year > 0 ? Math.max(CURRENT_YEAR - year, 0) : 8;
  const expectedMileage = Math.max(vehicleAge * 15_000, 30_000);
  const mileageDifference = mileage - expectedMileage;

  let multiplier = 1;

  if (mileageDifference > 0) {
    multiplier += Math.min(mileageDifference / 1_000_000, 0.18);
  } else {
    multiplier -= Math.min(Math.abs(mileageDifference) / 1_500_000, 0.08);
  }

  multiplier += changedParts.length * 0.018;
  multiplier += paintedParts.length * 0.007;

  if (damageRecord > 0) {
    multiplier += Math.min(damageRecord / Math.max(listingPrice, 1), 0.08);
  }

  if (
    transmission.includes("otomatik") ||
    transmission.includes("automatic")
  ) {
    multiplier -= 0.015;
  }

  if (fuelType.includes("dizel") && mileage > 220_000) {
    multiplier += 0.025;
  }

  const seedVariation = (createVehicleSeed(vehicle) % 7) / 1000;
  multiplier += seedVariation;

  const estimatedPrice = listingPrice / Math.max(multiplier, 0.75);

  return Math.round(estimatedPrice / 5_000) * 5_000;
}

function calculateScore(
  vehicle: VehicleData,
  estimatedMarketPrice: number,
  comparableConfidence = 0
): number {
  const listingPrice = getNumber(vehicle, ["price", "listingPrice", "fiyat"]);
  const year = getNumber(vehicle, ["year", "modelYear", "yil"]);
  const mileage = getNumber(vehicle, [
    "mileage",
    "kilometers",
    "kilometre",
    "km",
  ]);
  const damageRecord = getNumber(vehicle, [
    "damageRecord",
    "tramer",
    "damageAmount",
    "hasarKaydi",
  ]);
  const paintedParts = getArray(vehicle, [
    "paintedParts",
    "painted",
    "boyaliParcalar",
  ]);
  const changedParts = getArray(vehicle, [
    "changedParts",
    "changed",
    "degisenParcalar",
  ]);

  const vehicleAge = year > 0 ? Math.max(CURRENT_YEAR - year, 0) : 10;

  let score = 82;

  if (vehicleAge <= 3) {
    score += 8;
  } else if (vehicleAge <= 7) {
    score += 4;
  } else if (vehicleAge >= 15) {
    score -= 8;
  }

  if (mileage <= 80_000) {
    score += 8;
  } else if (mileage <= 150_000) {
    score += 4;
  } else if (mileage <= 220_000) {
    score -= 3;
  } else if (mileage <= 300_000) {
    score -= 10;
  } else {
    score -= 18;
  }

  score -= paintedParts.length * 2;
  score -= changedParts.length * 5;

  if (damageRecord > 0) {
    const damageRatio = damageRecord / Math.max(listingPrice, 1);

    if (damageRatio > 0.1) {
      score -= 12;
    } else if (damageRatio > 0.04) {
      score -= 7;
    } else {
      score -= 3;
    }
  }

  const differencePercentage =
    ((listingPrice - estimatedMarketPrice) /
      Math.max(estimatedMarketPrice, 1)) *
    100;

  if (differencePercentage <= -8) {
    score += 7;
  } else if (differencePercentage <= -3) {
    score += 4;
  } else if (differencePercentage >= 12) {
    score -= 12;
  } else if (differencePercentage >= 5) {
    score -= 6;
  }

  if (comparableConfidence >= 90) {
    score += 2;
  } else if (comparableConfidence >= 75) {
    score += 1;
  } else if (comparableConfidence > 0 && comparableConfidence < 50) {
    score -= 2;
  }

  return Math.max(25, Math.min(98, Math.round(score)));
}

function getPriceEvaluation(
  differencePercentage: number
): PriceEvaluation {
  if (differencePercentage <= -8) {
    return "very_good";
  }

  if (differencePercentage <= -3) {
    return "good";
  }

  if (differencePercentage < 6) {
    return "fair";
  }

  if (differencePercentage < 12) {
    return "expensive";
  }

  return "very_expensive";
}

function getPurchaseRecommendation(
  score: number
): PurchaseRecommendation {
  if (score >= 90) {
    return "strong_buy";
  }

  if (score >= 80) {
    return "buy";
  }

  if (score >= 60) {
    return "consider";
  }

  return "avoid";
}

function createChronicProblems(vehicle: VehicleData): string[] {
  const brand = normalizeText(
    getString(vehicle, ["brand", "make", "marka"])
  );
  const fuelType = normalizeText(
    getString(vehicle, ["fuelType", "fuel", "yakit"])
  );
  const transmission = normalizeText(
    getString(vehicle, ["transmission", "gear", "vites"])
  );
  const mileage = getNumber(vehicle, [
    "mileage",
    "kilometers",
    "kilometre",
    "km",
  ]);

  const problems: string[] = [];

  if (fuelType.includes("dizel")) {
    problems.push(
      "DPF, EGR ve turbo sistemi kurumlanma ve yağ kaçağı açısından kontrol edilmelidir."
    );
  }

  if (fuelType.includes("benzin")) {
    problems.push(
      "Ateşleme bobinleri, bujiler ve motorun yağ tüketimi kontrol edilmelidir."
    );
  }

  if (
    transmission.includes("otomatik") ||
    transmission.includes("automatic")
  ) {
    problems.push(
      "Otomatik şanzımanın bakım geçmişi ve geçişleri test sürüşünde incelenmelidir."
    );
  } else {
    problems.push(
      "Debriyaj, baskı balata ve volan durumu test sürüşünde kontrol edilmelidir."
    );
  }

  if (
    brand.includes("bmw") ||
    brand.includes("audi") ||
    brand.includes("volkswagen")
  ) {
    problems.push(
      "Turbo, soğutma sistemi ve motor çevresindeki yağ kaçakları detaylı incelenmelidir."
    );
  } else if (
    brand.includes("fiat") ||
    brand.includes("renault") ||
    brand.includes("ford")
  ) {
    problems.push(
      "Enjektörler, motor takozları ve ön takım parçaları kontrol edilmelidir."
    );
  } else if (
    brand.includes("toyota") ||
    brand.includes("honda")
  ) {
    problems.push(
      "Motor genel olarak dayanıklı olsa da yağ tüketimi ve soğutma sistemi kontrol edilmelidir."
    );
  }

  if (mileage > 200_000) {
    problems.push(
      "Yüksek kilometre nedeniyle enjektör, turbo, zincir veya triger bakım geçmişi belgelerle doğrulanmalıdır."
    );
  }

  return [...new Set(problems)].slice(0, 4);
}

function createAdvantages(
  vehicle: VehicleData,
  differencePercentage: number
): string[] {
  const advantages: string[] = [];
  const year = getNumber(vehicle, ["year", "modelYear", "yil"]);
  const mileage = getNumber(vehicle, [
    "mileage",
    "kilometers",
    "kilometre",
    "km",
  ]);
  const transmission = normalizeText(
    getString(vehicle, ["transmission", "gear", "vites"])
  );

  if (differencePercentage <= -4) {
    advantages.push(
      "İlan fiyatı hesaplanan tahmini piyasa değerinin altında."
    );
  } else if (differencePercentage < 4) {
    advantages.push(
      "İlan fiyatı tahmini piyasa değerine yakın görünüyor."
    );
  }

  if (year >= CURRENT_YEAR - 5) {
    advantages.push(
      "Model yılı güncel olduğu için ikinci el talebi güçlü olabilir."
    );
  }

  if (mileage > 0 && mileage < 120_000) {
    advantages.push(
      "Kilometresi model yılına göre makul seviyede."
    );
  }

  if (
    transmission.includes("otomatik") ||
    transmission.includes("automatic")
  ) {
    advantages.push(
      "Otomatik şanzıman ikinci el piyasasında önemli bir tercih avantajı sağlıyor."
    );
  }

  advantages.push(
    "Ekspertiz sonucu temiz çıkarsa günlük kullanım için değerlendirilebilir."
  );

  return [...new Set(advantages)].slice(0, 3);
}

function createDisadvantages(vehicle: VehicleData): string[] {
  const disadvantages: string[] = [];
  const mileage = getNumber(vehicle, [
    "mileage",
    "kilometers",
    "kilometre",
    "km",
  ]);
  const damageRecord = getNumber(vehicle, [
    "damageRecord",
    "tramer",
    "damageAmount",
    "hasarKaydi",
  ]);
  const paintedParts = getArray(vehicle, [
    "paintedParts",
    "painted",
    "boyaliParcalar",
  ]);
  const changedParts = getArray(vehicle, [
    "changedParts",
    "changed",
    "degisenParcalar",
  ]);

  if (mileage > 220_000) {
    disadvantages.push(
      "Yüksek kilometre, motor ve yürüyen aksamda masraf riskini artırıyor."
    );
  } else if (mileage > 150_000) {
    disadvantages.push(
      "Kilometresi nedeniyle bakım geçmişi detaylı incelenmeli."
    );
  }

  if (changedParts.length > 0) {
    disadvantages.push(
      `${changedParts.length} değişen parça bulunduğu için şasi ve bağlantı noktaları kontrol edilmeli.`
    );
  }

  if (paintedParts.length >= 3) {
    disadvantages.push(
      `${paintedParts.length} boyalı parça aracın ikinci el değerini etkileyebilir.`
    );
  }

  if (damageRecord > 0) {
    disadvantages.push(
      "Hasar kaydının hangi kazalardan oluştuğu belgelerle doğrulanmalı."
    );
  }

  disadvantages.push(
    "Ekspertiz yapılmadan yalnızca ilan bilgileriyle kesin karar verilmemeli."
  );

  return [...new Set(disadvantages)].slice(0, 3);
}

function createAiComment(
  vehicle: VehicleData,
  score: number,
  differencePercentage: number,
  marketAnalysis: AnalysisResult["marketAnalysis"],
  competitivePositioning: AnalysisResult["competitivePositioning"],
  negotiationAnalysis: AnalysisResult["negotiationAnalysis"]
): string {
  const brand = getString(vehicle, ["brand", "make", "marka"], "Araç");
  const model = getString(vehicle, ["model"]);
  const year = getNumber(vehicle, ["year", "modelYear", "yil"]);
  const mileage = getNumber(vehicle, ["mileage", "kilometers", "kilometre", "km"]);
  const price = getNumber(vehicle, ["price", "listingPrice", "fiyat"]);
  const vehicleName = [brand, model, year].filter(Boolean).join(" ");

  const marketReference =
    marketAnalysis.comparableCount >= 3
      ? `${marketAnalysis.comparableCount} emsal ilanın medyanı ${marketAnalysis.medianPrice.toLocaleString("tr-TR")} TL, ortalaması ${marketAnalysis.averagePrice.toLocaleString("tr-TR")} TL ve analiz güveni %${marketAnalysis.confidence}.`
      : "Yeterli sayıda gerçek emsal bulunamadığı için piyasa değeri araç özelliklerinden tahmin edildi.";

  let priceComment: string;

  if (differencePercentage <= -10) {
    priceComment =
      "Fiyat emsal piyasanın belirgin altında. Bu durum alım fırsatı olabileceği gibi gizli hasar, acil satış veya eksik ilan bilgisi ihtimalini de artırır.";
  } else if (differencePercentage <= -4) {
    priceComment =
      "Fiyat emsal piyasanın altında ve ekspertiz sonucu temiz çıkarsa avantajlı bir alım olabilir.";
  } else if (differencePercentage < 5) {
    priceComment =
      "Fiyat emsal piyasa aralığıyla uyumlu. Kararı aracın kondisyonu ve bakım geçmişi belirlemeli.";
  } else if (differencePercentage < 12) {
    priceComment =
      "Fiyat emsal piyasanın üzerinde. Donanım, hasarsızlık veya düşük kilometre gibi somut bir gerekçe yoksa pazarlık yapılmalı.";
  } else {
    priceComment =
      "Fiyat emsal piyasanın belirgin üzerinde. Güçlü bir fiyat indirimi olmadan alternatif ilanlar daha mantıklı görünüyor.";
  }

  const scoreComment =
    score >= 85
      ? "Genel puan aracı güçlü bir aday olarak gösteriyor."
      : score >= 70
        ? "Genel puan aracı değerlendirilebilir seviyede gösteriyor."
        : score >= 55
          ? "Genel puan önemli kontroller yapılmadan karar verilmemesi gerektiğini gösteriyor."
          : "Genel puan risk seviyesinin yüksek olduğunu ve alternatiflerin incelenmesi gerektiğini gösteriyor.";

  const mileageComment =
    mileage >= 220_000
      ? "Kilometre yüksek olduğu için motor, turbo, enjektör, şanzıman ve ağır bakım kayıtları kritik."
      : mileage >= 140_000
        ? "Kilometre seviyesi nedeniyle periyodik bakım ve parça değişim kayıtları doğrulanmalı."
        : "Kilometre seviyesi yaşına göre makul görünse de kayıtlarla doğrulanmalı.";

  const competitiveComment =
    competitivePositioning.totalComparableCount > 0
      ? `Araç ${competitivePositioning.totalComparableCount} emsal içinde fiyat açısından ${competitivePositioning.priceRank}. sırada ve emsallerin %${competitivePositioning.cheaperThanPercentage}'inden daha ucuz. Fiyat avantaj skoru ${competitivePositioning.priceAdvantageScore}/100.`
      : "Rekabet sıralaması için yeterli emsal verisi bulunamadı.";

  const negotiationComment =
    `Önerilen ilk teklif ${negotiationAnalysis.suggestedOfferPrice.toLocaleString("tr-TR")} TL, hedef alım fiyatı ${negotiationAnalysis.targetPurchasePrice.toLocaleString("tr-TR")} TL ve aşılmaması önerilen maksimum fiyat ${negotiationAnalysis.maximumPurchasePrice.toLocaleString("tr-TR")} TL.`;

  return [
    `Fiyat Analizi: ${vehicleName} için ${price.toLocaleString("tr-TR")} TL ilan fiyatı değerlendirildi. ${marketReference} ${priceComment}`,
    `Rekabet Konumu: ${competitiveComment}`,
    `Mekanik Değerlendirme: ${mileageComment}`,
    `Pazarlık Stratejisi: ${negotiationComment} ${negotiationAnalysis.strategy}`,
    `Donanım Değerlendirmesi: İlanda tespit edilen donanımlar kullanım konforu ve ikinci el değerini etkileyebilir; tüm fonksiyonlar fiziksel olarak test edilmelidir.`,
    `Genel Sonuç: ${scoreComment} Nihai karar bağımsız ekspertiz, tramer ve servis geçmişi kontrolünden sonra verilmelidir.`,
  ].join(" | ");
}

function createNegotiationAdvice(
  listingPrice: number,
  estimatedMarketPrice: number,
  score: number
): string {
  const marketDifference = Math.max(0, listingPrice - estimatedMarketPrice);

  let baseRate = score >= 80 ? 0.025 : score >= 65 ? 0.04 : 0.06;
  const marketRate = marketDifference / Math.max(listingPrice, 1);

  const minimumRate = Math.min(0.15, baseRate + marketRate * 0.6);
  const maximumRate = Math.min(0.20, baseRate + 0.03 + marketRate);

  const minimumDiscount =
    Math.round((listingPrice * minimumRate) / 5_000) * 5_000;
  const maximumDiscount =
    Math.round((listingPrice * maximumRate) / 5_000) * 5_000;

  const minimumOffer = Math.max(0, listingPrice - maximumDiscount);
  const maximumOffer = Math.max(0, listingPrice - minimumDiscount);

  return `İlk teklif ${minimumOffer.toLocaleString("tr-TR")} TL civarında verilebilir. Ekspertiz ve bakım durumuna göre ${maximumOffer.toLocaleString("tr-TR")} TL seviyesine kadar çıkılabilir. Hedef pazarlık indirimi ${minimumDiscount.toLocaleString("tr-TR")}–${maximumDiscount.toLocaleString("tr-TR")} TL aralığında olmalıdır.`;
}

function createNegotiationAnalysis(args: {
  listingPrice: number;
  estimatedMarketPrice: number;
  marketConfidence: number;
  priceAdvantageScore: number;
  purchaseRiskScore: number;
  descriptionRiskScore: number;
  chronicRiskCount: number;
}): AnalysisResult["negotiationAnalysis"] {
  const {
    listingPrice,
    estimatedMarketPrice,
    marketConfidence,
    priceAdvantageScore,
    purchaseRiskScore,
    descriptionRiskScore,
    chronicRiskCount,
  } = args;

  const riskDiscountRate =
    Math.min(
      0.12,
      purchaseRiskScore * 0.0005 +
        descriptionRiskScore * 0.00025 +
        chronicRiskCount * 0.005
    );

  const marketDiscountRate =
    listingPrice > estimatedMarketPrice
      ? Math.min(
          0.15,
          (listingPrice - estimatedMarketPrice) /
            Math.max(listingPrice, 1)
        )
      : 0;

  const initialDiscountRate = Math.min(
    0.18,
    Math.max(
      0.03,
      0.04 + riskDiscountRate + marketDiscountRate
    )
  );

  const targetDiscountRate = Math.min(
    initialDiscountRate,
    Math.max(
      0.02,
      initialDiscountRate * 0.65
    )
  );

  const maximumDiscountRate = Math.max(
    0,
    Math.min(
      targetDiscountRate * 0.4,
      listingPrice > estimatedMarketPrice
        ? (listingPrice - estimatedMarketPrice) /
            Math.max(listingPrice, 1)
        : 0.03
    )
  );

  const roundToFiveThousand = (value: number) =>
    Math.max(
      0,
      Math.round(value / 5_000) * 5_000
    );

  const suggestedOfferPrice = roundToFiveThousand(
    listingPrice * (1 - initialDiscountRate)
  );

  const targetPurchasePrice = roundToFiveThousand(
    Math.min(
      listingPrice * (1 - targetDiscountRate),
      estimatedMarketPrice
    )
  );

  const maximumPurchasePrice = roundToFiveThousand(
    Math.min(
      listingPrice * (1 - maximumDiscountRate),
      estimatedMarketPrice * 1.02
    )
  );

  const negotiationMargin = Math.max(
    0,
    listingPrice - targetPurchasePrice
  );

  let negotiationPower = 50;

  negotiationPower += Math.max(
    0,
    70 - priceAdvantageScore
  ) * 0.35;

  negotiationPower += purchaseRiskScore * 0.2;
  negotiationPower += descriptionRiskScore * 0.15;
  negotiationPower += chronicRiskCount * 3;
  negotiationPower += Math.max(
    0,
    75 - marketConfidence
  ) * 0.1;

  negotiationPower = Math.max(
    15,
    Math.min(95, Math.round(negotiationPower))
  );

  const argumentsList: string[] = [];

  if (listingPrice > estimatedMarketPrice) {
    argumentsList.push(
      `İlan fiyatı tahmini piyasa değerinin ${Math.round(
        listingPrice - estimatedMarketPrice
      ).toLocaleString("tr-TR")} TL üzerinde.`
    );
  }

  if (purchaseRiskScore >= 55) {
    argumentsList.push(
      "Satın alma risk skoru yüksek olduğu için ekspertiz sonrası ek indirim talep edilmeli."
    );
  }

  if (descriptionRiskScore >= 40) {
    argumentsList.push(
      "İlan açıklamasındaki eksik veya riskli ifadeler pazarlık gerekçesi olarak kullanılabilir."
    );
  }

  if (chronicRiskCount > 0) {
    argumentsList.push(
      `${chronicRiskCount} adet araç özel risk bulunduğu için olası bakım maliyetleri fiyata yansıtılmalı.`
    );
  }

  if (marketConfidence < 65) {
    argumentsList.push(
      "Emsal güveni sınırlı olduğu için fiyat kesinleştirilmeden önce ek ilan karşılaştırması yapılmalı."
    );
  }

  if (argumentsList.length === 0) {
    argumentsList.push(
      "Araç piyasa seviyesinde görünüyor; pazarlık servis geçmişi, lastikler ve yaklaşan bakımlar üzerinden yürütülmeli."
    );
  }

  const strategy =
    negotiationPower >= 75
      ? "Güçlü pazarlık yapılabilir. İlk teklif düşük tutulmalı ve ekspertiz bulguları üzerinden ilerlenmelidir."
      : negotiationPower >= 55
        ? "Orta seviyede pazarlık yapılabilir. Piyasa farkı ve bakım maliyetleri öne çıkarılmalıdır."
        : "Pazarlık alanı sınırlı görünüyor. Makul bir teklif verilip maksimum fiyat aşılmamalıdır.";

  return {
    suggestedOfferPrice,
    targetPurchasePrice,
    maximumPurchasePrice,
    negotiationMargin,
    negotiationPower,
    strategy,
    arguments: argumentsList,
  };
}

function createImportantChecks(vehicle: VehicleData): string[] {
  const fuelType = normalizeText(
    getString(vehicle, ["fuelType", "fuel", "yakit"])
  );
  const transmission = normalizeText(
    getString(vehicle, ["transmission", "gear", "vites"])
  );

  const checks = [
    "Tramer kaydı, hasar geçmişi ve kilometre bilgisi doğrulanmalı.",
    "Şasi, podye, direkler, airbagler ve değişen parçalar ekspertizde kontrol edilmeli.",
  ];

  if (fuelType.includes("dizel")) {
    checks.push(
      "Turbo, enjektör, DPF ve EGR sistemi kontrol edilmeli."
    );
  } else {
    checks.push(
      "Motor kompresyonu, ateşleme sistemi ve yağ tüketimi kontrol edilmeli."
    );
  }

  if (
    transmission.includes("otomatik") ||
    transmission.includes("automatic")
  ) {
    checks.push(
      "Şanzıman geçişleri, kavrama durumu ve şanzıman yağı geçmişi incelenmeli."
    );
  } else {
    checks.push(
      "Debriyaj, baskı balata ve volan durumu test edilmeli."
    );
  }

  return checks;
}

function createPurchaseRiskAnalysis(args: {
  score: number;
  mileage: number;
  vehicleAge: number;
  descriptionRisk: number;
  photoCoverage: number;
  marketConfidence: number;
  damageRecord: number;
  chronicRiskCount: number;
}): AnalysisResult["purchaseRiskAnalysis"] {
  let risk = 50;

  risk += args.descriptionRisk * 0.25;
  risk += Math.max(0, 70 - args.photoCoverage) * 0.20;
  risk += Math.max(0, 80 - args.marketConfidence) * 0.20;
  risk += args.chronicRiskCount * 4;
  risk += Math.min(args.mileage / 15000, 20);
  risk += Math.min(args.vehicleAge, 20);
  risk += Math.min(args.damageRecord / 20000, 15);

  risk -= args.score * 0.45;

  risk = Math.max(0, Math.min(100, Math.round(risk)));

  const riskLevel =
    risk >= 75
      ? "very_high"
      : risk >= 55
        ? "high"
        : risk >= 35
          ? "medium"
          : "low";

  const summary =
    riskLevel === "low"
      ? "Satın alma riski düşük görünüyor."
      : riskLevel === "medium"
        ? "Satın alma öncesinde ekspertiz önerilir."
        : riskLevel === "high"
          ? "Araç dikkatli incelenmeden satın alınmamalıdır."
          : "Risk seviyesi oldukça yüksek. Alternatif ilanlar değerlendirilmelidir.";

  return {
    riskScore: risk,
    riskLevel,
    summary,
  };
}

function createLifetimeAnalysis(
  vehicle: VehicleData,
  riskCount: number
): AnalysisResult["lifetimeAnalysis"] {
  const mileage = getNumber(vehicle, [
    "mileage",
    "kilometre",
    "km",
  ]);

  const transmission = normalizeText(
    getString(vehicle, ["transmission", "vites"])
  );

  const engineReferenceLife = 400000;
  const transmissionReferenceLife =
    transmission.includes("otomatik") ||
    transmission.includes("automatic")
      ? 300000
      : 350000;

  const remainingEngineLifeKm = Math.max(
    0,
    engineReferenceLife - mileage
  );

  const remainingTransmissionLifeKm = Math.max(
    0,
    transmissionReferenceLife - mileage
  );

  const criticalRepairProbability = Math.min(
    95,
    Math.round(
      (mileage / 400000) * 60 +
      riskCount * 8
    )
  );

  const majorMaintenanceRisk =
    criticalRepairProbability >= 70
      ? "high"
      : criticalRepairProbability >= 40
        ? "medium"
        : "low";

  const overallLifetimeScore = Math.max(
    10,
    Math.min(
      100,
      Math.round(
        100 -
        criticalRepairProbability +
        remainingEngineLifeKm / 20000
      )
    )
  );

  return {
    remainingEngineLifeKm,
    remainingTransmissionLifeKm,
    majorMaintenanceRisk,
    criticalRepairProbability,
    overallLifetimeScore,
  };
}

function createOwnershipCostAnalysis(
  vehicle: VehicleData,
  estimatedMarketPrice: number,
  riskCount: number
): AnalysisResult["ownershipCostAnalysis"] {
  const fuel = normalizeText(
    getString(vehicle, ["fuel", "fuelType", "yakit"])
  );

  const mileage = getNumber(vehicle, [
    "mileage",
    "kilometre",
    "km",
  ]);

  const year = getNumber(vehicle, [
    "year",
    "modelYear",
    "yil",
  ]);

  const vehicleAge = Math.max(CURRENT_YEAR - year, 0);

  const annualMaintenanceCost = Math.round(
    (
      18000 +
      vehicleAge * 1500 +
      Math.min(mileage / 10, 30000) +
      riskCount * 7000
    ) / 1000
  ) * 1000;

  const annualFuelCost =
    fuel.includes("dizel")
      ? 72000
      : fuel.includes("hibrit")
        ? 52000
        : fuel.includes("elektrik")
          ? 30000
          : 85000;

  const annualTaxEstimate = Math.round(
    Math.max(3500, estimatedMarketPrice * 0.008) / 500
  ) * 500;

  const annualInsuranceEstimate = Math.round(
    Math.max(15000, estimatedMarketPrice * 0.035) / 1000
  ) * 1000;

  const potentialMajorRepairCost = Math.round(
    (
      riskCount * 25000 +
      (mileage > 200000 ? 30000 : 0)
    ) / 5000
  ) * 5000;

  const threeYearDepreciation = Math.round(
    estimatedMarketPrice *
      (vehicleAge <= 3 ? 0.24 : vehicleAge <= 8 ? 0.18 : 0.12) /
      5000
  ) * 5000;

  const annualTotalCost =
    annualMaintenanceCost +
    annualFuelCost +
    annualTaxEstimate +
    annualInsuranceEstimate +
    Math.round(threeYearDepreciation / 3);

  return {
    annualMaintenanceCost,
    annualFuelCost,
    annualTaxEstimate,
    annualInsuranceEstimate,
    potentialMajorRepairCost,
    threeYearDepreciation,
    annualTotalCost,
  };
}

function analyzeDescription(
  vehicle: VehicleData
): AnalysisResult["descriptionAnalysis"] {
  const description = normalizeText(
    getString(vehicle, ["description", "aciklama"])
  );

  if (!description) {
    return {
      riskLevel: "medium",
      riskScore: 45,
      detectedKeywords: [],
      detectedClaims: [],
      warnings: [
        "İlan açıklaması bulunmadığı için araç geçmişi yeterince değerlendirilemedi.",
      ],
      positiveSignals: [],
      summary:
        "İlan açıklaması bulunmuyor. Hasar, bakım ve kullanım geçmişi satıcıdan belgeleriyle istenmelidir.",
    };
  }

  const riskPatterns = [
    {
      keywords: ["agir hasar", "pert", "hurda"],
      warning:
        "Ağır hasar veya ciddi kaza geçmişine işaret eden ifade tespit edildi.",
      score: 35,
    },
    {
      keywords: ["sase", "podye", "direk", "tavan"],
      warning:
        "Taşıyıcı veya kritik gövde parçalarıyla ilgili ifade tespit edildi.",
      score: 24,
    },
    {
      keywords: [
        "motor yapildi",
        "motor rektefiye",
        "sandik motor",
      ],
      warning:
        "Motorun geçmişte kapsamlı işlem gördüğüne dair ifade tespit edildi.",
      score: 18,
    },
    {
      keywords: ["degisen", "boyali", "lokal boya"],
      warning:
        "Kaporta işlemi veya değişen parça bilgisi tespit edildi.",
      score: 10,
    },
    {
      keywords: ["masrafli", "masraf vardir", "arizali"],
      warning:
        "Araçta mevcut veya yakın zamanda oluşabilecek masraf ifadesi tespit edildi.",
      score: 20,
    },
    {
      keywords: [
        "taksi cikmasi",
        "ticari cikmasi",
        "kiralik cikmasi",
      ],
      warning:
        "Yoğun kullanım geçmişine işaret eden ifade tespit edildi.",
      score: 28,
    },
    {
      keywords: ["kilometre dusurulmus", "km dusurulmus"],
      warning:
        "Kilometre güvenilirliğiyle ilgili ciddi risk ifadesi tespit edildi.",
      score: 40,
    },
  ];

  const positivePatterns = [
    {
      keywords: ["bakimlari yapildi", "bakimlari yeni"],
      signal: "Bakımların yapıldığı belirtilmiş.",
    },
    {
      keywords: ["yetkili servis", "servis bakimli"],
      signal:
        "Servis bakım geçmişiyle ilgili olumlu ifade bulunuyor.",
    },
    {
      keywords: ["ekspertiz raporu", "ekspertiz mevcut"],
      signal: "Ekspertiz raporu bulunduğu belirtilmiş.",
    },
    {
      keywords: ["tramer yok", "hasar kaydi yok"],
      signal: "Hasar kaydı olmadığı belirtilmiş.",
    },
    {
      keywords: ["km orijinal", "kilometre orijinal"],
      signal: "Kilometrenin orijinal olduğu belirtilmiş.",
    },
    {
      keywords: ["tek el", "ilk sahibinden"],
      signal:
        "Sahiplik geçmişiyle ilgili olumlu ifade bulunuyor.",
    },
  ];

  const detectedKeywords: string[] = [];
  const detectedClaims: string[] = [];
  const warnings: string[] = [];
  const positiveSignals: string[] = [];

  let riskScore = 15;

  for (const pattern of riskPatterns) {
    const matchedKeywords = pattern.keywords.filter((keyword) =>
      description.includes(keyword)
    );

    if (matchedKeywords.length > 0) {
      detectedKeywords.push(...matchedKeywords);
      warnings.push(pattern.warning);
      riskScore += pattern.score;
    }
  }

  for (const pattern of positivePatterns) {
    const matchedKeywords = pattern.keywords.filter((keyword) =>
      description.includes(keyword)
    );

    if (matchedKeywords.length > 0) {
      detectedKeywords.push(...matchedKeywords);
      detectedClaims.push(pattern.signal);
      positiveSignals.push(pattern.signal);
      riskScore -= 5;
    }
  }

  riskScore = Math.max(5, Math.min(100, riskScore));

  const riskLevel =
    riskScore >= 65
      ? "high"
      : riskScore >= 35
        ? "medium"
        : "low";

  const summary =
    riskLevel === "high"
      ? "İlan açıklamasında ciddi risk ifadeleri bulunuyor. Ekspertiz ve belge kontrolü yapılmadan araç için karar verilmemelidir."
      : riskLevel === "medium"
        ? "İlan açıklamasında dikkat edilmesi gereken bazı ifadeler bulunuyor. Satıcı beyanları ekspertiz ve belgelerle doğrulanmalıdır."
        : "İlan açıklamasında belirgin bir yüksek risk ifadesi bulunmadı. Yine de tüm bilgiler ekspertizle doğrulanmalıdır.";

  return {
    riskLevel,
    riskScore,
    detectedKeywords: [...new Set(detectedKeywords)],
    detectedClaims: [...new Set(detectedClaims)],
    warnings: [...new Set(warnings)],
    positiveSignals: [...new Set(positiveSignals)],
    summary,
  };
}

function analyzePhotos(
  vehicle: VehicleData
): AnalysisResult["photoAnalysis"] {
  const images = getArray(vehicle, ["images"]);
  const interiorImages = getArray(vehicle, [
    "interiorImages",
  ]);
  const exteriorImages = getArray(vehicle, [
    "exteriorImages",
  ]);

  const storedPhotoCount = getNumber(
    vehicle,
    ["photoCount"],
    images.length
  );

  const photoCount = Math.max(
    storedPhotoCount,
    images.length
  );

  const warnings: string[] = [];
  const positiveSignals: string[] = [];

  let coverageScore = 0;

  if (photoCount >= 20) {
    coverageScore += 50;
    positiveSignals.push(
      "İlanda aracı farklı açılardan değerlendirmeye yetecek sayıda fotoğraf bulunuyor."
    );
  } else if (photoCount >= 12) {
    coverageScore += 40;
    positiveSignals.push(
      "İlanda genel değerlendirme için yeterli sayıda fotoğraf bulunuyor."
    );
  } else if (photoCount >= 6) {
    coverageScore += 25;
    warnings.push(
      "Fotoğraf sayısı sınırlı olduğu için aracın tüm bölümleri değerlendirilemiyor."
    );
  } else {
    coverageScore += 10;
    warnings.push(
      "Fotoğraf sayısı çok düşük. Araç kondisyonu fotoğraflardan güvenilir şekilde değerlendirilemez."
    );
  }

  if (exteriorImages.length >= 6) {
    coverageScore += 25;
    positiveSignals.push(
      "Dış görünüşü gösteren birden fazla fotoğraf tespit edildi."
    );
  } else if (exteriorImages.length > 0) {
    coverageScore += 12;
    warnings.push(
      "Dış görünüş fotoğrafları aracın tüm yönlerini göstermiyor olabilir."
    );
  } else {
    warnings.push(
      "Dış görünüş fotoğrafları otomatik olarak sınıflandırılamadı."
    );
  }

  if (interiorImages.length >= 3) {
    coverageScore += 25;
    positiveSignals.push(
      "İç mekân kondisyonunu değerlendirebilecek fotoğraflar bulunuyor."
    );
  } else if (interiorImages.length > 0) {
    coverageScore += 12;
    warnings.push(
      "İç mekân fotoğrafları sınırlı olduğu için yıpranma seviyesi net değerlendirilemeyebilir."
    );
  } else {
    warnings.push(
      "İç mekân fotoğrafı otomatik olarak tespit edilemedi."
    );
  }

  coverageScore = Math.max(
    0,
    Math.min(100, Math.round(coverageScore))
  );

  const visualFindings: string[] = [];

  if (photoCount >= 12) {
    visualFindings.push(
      "Fotoğraf sayısı genel gövde ve kondisyon incelemesi için yeterli seviyede."
    );
  }

  if (exteriorImages.length >= 6) {
    visualFindings.push(
      "Dış gövdenin birden fazla açıdan görüntülendiği tespit edildi."
    );
  } else {
    visualFindings.push(
      "Kaput, tampon, çamurluk ve kapı hizaları fotoğraflardan güvenilir şekilde değerlendirilemiyor."
    );
  }

  if (interiorImages.length >= 3) {
    visualFindings.push(
      "Direksiyon, koltuk ve iç trim yıpranmasını değerlendirebilecek iç mekân fotoğrafları mevcut."
    );
  } else {
    visualFindings.push(
      "Direksiyon, koltuk ve iç trim yıpranması için yeterli iç mekân fotoğrafı bulunamadı."
    );
  }

  if (photoCount < 8) {
    visualFindings.push(
      "Jant, lastik, motor bölmesi ve bagaj için ek fotoğraf istenmeli."
    );
  }

  const conditionLevel =
    photoCount === 0
      ? "unknown"
      : coverageScore >= 75
        ? "good"
        : coverageScore >= 40
          ? "medium"
          : "poor";

  const summary =
    conditionLevel === "good"
      ? "İlanın fotoğraf kapsamı genel kondisyon değerlendirmesi için yeterli görünüyor. Görseller yine de fiziksel ekspertizin yerini tutmaz."
      : conditionLevel === "medium"
        ? "Fotoğraflar aracın bazı bölümlerini değerlendirmeye imkân veriyor ancak eksik açılar nedeniyle kesin kondisyon sonucu çıkarılamaz."
        : conditionLevel === "poor"
          ? "Fotoğraf kapsamı yetersiz. Satıcıdan dış gövde, iç mekân, motor bölmesi, jantlar ve hasarlı bölgeler için ek fotoğraflar istenmelidir."
          : "İlan fotoğrafları alınamadığı için görsel kondisyon değerlendirmesi yapılamadı.";

  return {
    photoCount,
    exteriorPhotoCount: exteriorImages.length,
    interiorPhotoCount: interiorImages.length,
    coverageScore,
    conditionLevel,
    warnings: [...new Set(warnings)],
    positiveSignals: [...new Set(positiveSignals)],
    visualFindings: [...new Set(visualFindings)],
    summary,
  };
}

export async function analyzeVehicle(
  vehicle: Vehicle,
  providedComparables: ComparableVehicle[] = []
): Promise<AnalysisResult> {
  const vehicleData = vehicle as VehicleData;

  const listingPrice = getNumber(vehicleData, [
    "price",
    "listingPrice",
    "fiyat",
  ]);

  const calculatedMarketPrice =
    estimateMarketPrice(vehicleData);

  const sourceComparables =
    providedComparables.length > 0
      ? providedComparables
      : await comparableProvider.findComparables(vehicle);

  const marketAnalysis =
    createComparableMarketAnalysis(
      vehicle,
      calculatedMarketPrice,
      sourceComparables
    );

  const hasReliableComparables =
    marketAnalysis.comparableCount >= 3 &&
    marketAnalysis.medianPrice > 0;

  const estimatedMarketPrice =
    hasReliableComparables
      ? marketAnalysis.medianPrice
      : calculatedMarketPrice;

  const competitivePositioning =
    createCompetitivePositioningAnalysis(
      listingPrice,
      marketAnalysis
    );

  const difference =
    listingPrice - estimatedMarketPrice;

  const differencePercentage =
    (difference / Math.max(estimatedMarketPrice, 1)) * 100;

  const score = calculateScore(
    vehicleData,
    estimatedMarketPrice,
    marketAnalysis.confidence
  );

  const descriptionAnalysis =
    analyzeDescription(vehicleData);

  const photoAnalysis =
    analyzePhotos(vehicleData);

  const vehicleSpecificRisks =
    getVehicleSpecificRisks(vehicle);

  const equipmentAnalysis =
    analyzeEquipment(vehicle);

  const ownershipCostAnalysis =
    createOwnershipCostAnalysis(
      vehicleData,
      estimatedMarketPrice,
      vehicleSpecificRisks.length
    );

  const lifetimeAnalysis =
    createLifetimeAnalysis(
      vehicleData,
      vehicleSpecificRisks.length
    );

  const purchaseRiskAnalysis =
    createPurchaseRiskAnalysis({
      score,
      mileage: getNumber(vehicleData, ["mileage","km","kilometre"]),
      vehicleAge: Math.max(
        CURRENT_YEAR -
        getNumber(vehicleData, ["year","modelYear","yil"]),
        0
      ),
      descriptionRisk: descriptionAnalysis.riskScore,
      photoCoverage: photoAnalysis.coverageScore,
      marketConfidence: marketAnalysis.confidence,
      damageRecord: getNumber(vehicleData, ["damageRecord","tramer","damageAmount"]),
      chronicRiskCount: vehicleSpecificRisks.length,
    });

  const negotiationAnalysis =
    createNegotiationAnalysis({
      listingPrice,
      estimatedMarketPrice,
      marketConfidence: marketAnalysis.confidence,
      priceAdvantageScore:
        competitivePositioning.priceAdvantageScore,
      purchaseRiskScore:
        purchaseRiskAnalysis.riskScore,
      descriptionRiskScore:
        descriptionAnalysis.riskScore,
      chronicRiskCount:
        vehicleSpecificRisks.length,
    });

  let adjustedScore = score;

  if (descriptionAnalysis.riskLevel === "high") {
    adjustedScore -= 10;
  } else if (descriptionAnalysis.riskLevel === "medium") {
    adjustedScore -= 4;
  } else {
    adjustedScore += 2;
  }

  if (photoAnalysis.coverageScore >= 75) {
    adjustedScore += 2;
  } else if (photoAnalysis.coverageScore < 40) {
    adjustedScore -= 3;
  }

  adjustedScore -= Math.min(
    vehicleSpecificRisks.length * 2,
    8
  );

  adjustedScore += Math.min(
    equipmentAnalysis.length * 2,
    6
  );

  adjustedScore = Math.max(
    25,
    Math.min(98, Math.round(adjustedScore))
  );

  const analysisConfidence = Math.max(
    20,
    Math.min(
      98,
      Math.round(
        marketAnalysis.confidence * 0.5 +
          photoAnalysis.coverageScore * 0.25 +
          (100 - descriptionAnalysis.riskScore) * 0.15 +
          Math.min(equipmentAnalysis.length * 10, 30) * 0.1
      )
    )
  );

  return {
    vehicle,

    score: adjustedScore,

    analysisConfidence,

    purchaseRecommendation:
      getPurchaseRecommendation(adjustedScore),

    priceAnalysis: {
      listingPrice,
      estimatedMarketPrice,
      difference,
      differencePercentage,
      evaluation: getPriceEvaluation(
        differencePercentage
      ),
    },

    marketAnalysis,

    ownershipCostAnalysis,

    lifetimeAnalysis,

    purchaseRiskAnalysis,

    competitivePositioning,

    negotiationAnalysis,

    descriptionAnalysis,

    photoAnalysis,

    chronicProblems: [
      ...createChronicProblems(vehicleData),
      ...vehicleSpecificRisks.map(
        (risk) => `${risk.title}: ${risk.description}`
      ),
    ].filter(
      (item, index, items) =>
        items.indexOf(item) === index
    ),

    advantages: [
      ...createAdvantages(
        vehicleData,
        differencePercentage
      ),
      ...equipmentAnalysis.flatMap(
        (equipment) => equipment.positiveSignals
      ),
    ].filter(
      (item, index, items) =>
        items.indexOf(item) === index
    ),

    disadvantages:
      createDisadvantages(vehicleData),

    aiComment: createAiComment(
      vehicleData,
      adjustedScore,
      differencePercentage,
      marketAnalysis,
      competitivePositioning,
      negotiationAnalysis
    ),

    negotiationAdvice: createNegotiationAdvice(
      listingPrice,
      estimatedMarketPrice,
      adjustedScore
    ),

    importantChecks: [
      ...createImportantChecks(vehicleData),
      ...vehicleSpecificRisks.flatMap(
        (risk) => risk.checks
      ),
      ...equipmentAnalysis.flatMap(
        (equipment) => equipment.checks
      ),
    ].filter(
      (item, index, items) =>
        items.indexOf(item) === index
    ),
  };
}
