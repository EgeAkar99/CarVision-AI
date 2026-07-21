import type {
  AnalysisResult,
  ComparableVehicle,
} from "../types/analysis";
import type { Vehicle } from "../types/vehicle";
import { createComparableMarketAnalysis } from "./comparables";
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
  marketAnalysis: AnalysisResult["marketAnalysis"]
): string {
  const brand = getString(
    vehicle,
    ["brand", "make", "marka"],
    "Bu araç"
  );
  const model = getString(vehicle, ["model"]);
  const mileage = getNumber(vehicle, [
    "mileage",
    "kilometers",
    "kilometre",
    "km",
  ]);

  const vehicleName = `${brand} ${model}`.trim();

  let priceComment: string;

  if (differencePercentage <= -8) {
    priceComment =
      "İlan fiyatı tahmini piyasa değerinin belirgin şekilde altında görünüyor.";
  } else if (differencePercentage <= -3) {
    priceComment =
      "İlan fiyatı tahmini piyasa değerinin bir miktar altında.";
  } else if (differencePercentage < 6) {
    priceComment =
      "İlan fiyatı tahmini piyasa değeriyle yakın seviyede.";
  } else {
    priceComment =
      "İlan fiyatı tahmini piyasa değerinin üzerinde görünüyor.";
  }

  let conditionComment: string;

  if (score >= 85) {
    conditionComment =
      "İlan bilgileri genel olarak olumlu ve araç güçlü bir seçenek oluşturuyor.";
  } else if (score >= 70) {
    conditionComment =
      "Araç değerlendirilebilir ancak bakım ve ekspertiz sonuçları karar üzerinde belirleyici olmalı.";
  } else if (score >= 55) {
    conditionComment =
      "Araçta dikkat edilmesi gereken riskler bulunuyor ve detaylı ekspertiz gerekiyor.";
  } else {
    conditionComment =
      "Mevcut veriler aracı riskli gösteriyor; alternatif ilanlara bakılması daha doğru olabilir.";
  }

  const mileageComment =
    mileage > 220_000
      ? " Yüksek kilometre nedeniyle motor, turbo, şanzıman ve bakım geçmişi özellikle incelenmeli."
      : mileage > 140_000
        ? " Kilometre seviyesi nedeniyle düzenli bakım kayıtları doğrulanmalı."
        : " Kilometre seviyesi ilan bilgilerine göre makul görünüyor.";

  const comparableComment =
    marketAnalysis.comparableCount >= 3
      ? ` Değerlendirme ${marketAnalysis.comparableCount} emsal ilan üzerinden, %${marketAnalysis.confidence} güven oranıyla yapıldı. Emsal medyan fiyatı ${marketAnalysis.medianPrice.toLocaleString(
          "tr-TR"
        )} TL olarak hesaplandı.`
      : " Yeterli sayıda gerçek emsal bulunamadığı için piyasa tahmini araç özelliklerine göre hesaplandı.";

  return `${vehicleName} için yapılan değerlendirmede ${priceComment} ${conditionComment}${mileageComment}${comparableComment}`;
}

function createNegotiationAdvice(
  listingPrice: number,
  estimatedMarketPrice: number,
  score: number
): string {
  const difference = listingPrice - estimatedMarketPrice;

  let minimumDiscountRate = 0.02;
  let maximumDiscountRate = 0.04;

  if (score < 70) {
    minimumDiscountRate = 0.04;
    maximumDiscountRate = 0.07;
  }

  if (difference > 0) {
    minimumDiscountRate += Math.min(
      difference / Math.max(listingPrice, 1),
      0.05
    );
    maximumDiscountRate += Math.min(
      difference / Math.max(listingPrice, 1),
      0.06
    );
  }

  const minimumDiscount =
    Math.round((listingPrice * minimumDiscountRate) / 5_000) * 5_000;

  const maximumDiscount =
    Math.round((listingPrice * maximumDiscountRate) / 5_000) * 5_000;

  return `Ekspertiz bulguları, yaklaşan bakımlar ve piyasa farkı gerekçe gösterilerek ${minimumDiscount.toLocaleString(
    "tr-TR"
  )} TL ile ${maximumDiscount.toLocaleString(
    "tr-TR"
  )} TL arasında pazarlık denenebilir.`;
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

  const difference =
    listingPrice - estimatedMarketPrice;

  const differencePercentage =
    (difference / Math.max(estimatedMarketPrice, 1)) * 100;

  const score = calculateScore(
    vehicleData,
    estimatedMarketPrice,
    marketAnalysis.confidence
  );

  return {
    vehicle,

    score,

    purchaseRecommendation:
      getPurchaseRecommendation(score),

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

    chronicProblems:
      createChronicProblems(vehicleData),

    advantages: createAdvantages(
      vehicleData,
      differencePercentage
    ),

    disadvantages:
      createDisadvantages(vehicleData),

    aiComment: createAiComment(
      vehicleData,
      score,
      differencePercentage,
      marketAnalysis
    ),

    negotiationAdvice: createNegotiationAdvice(
      listingPrice,
      estimatedMarketPrice,
      score
    ),

    importantChecks:
      createImportantChecks(vehicleData),
  };
}