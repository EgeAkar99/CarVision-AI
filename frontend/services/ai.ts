import type {
  AnalysisResult,
  ComparableVehicle,
} from "../types/analysis";
import type { Vehicle } from "../types/vehicle";
import { createComparableMarketAnalysis } from "./comparables";
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
  marketAnalysis: AnalysisResult["marketAnalysis"]
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

  return `${vehicleName} için ${price.toLocaleString("tr-TR")} TL ilan fiyatı değerlendirildi. ${marketReference} ${priceComment} ${scoreComment} ${mileageComment} Nihai karar bağımsız ekspertiz, tramer ve servis geçmişi kontrolünden sonra verilmelidir.`;
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

  return {
    vehicle,

    score: adjustedScore,

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
      marketAnalysis
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
