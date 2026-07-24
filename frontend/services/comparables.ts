import type {
  ComparableMarketAnalysis,
  ComparableVehicle,
  CompetitivePositioningAnalysis,
  MarketPosition,
} from "../types/analysis";
import type { Vehicle } from "../types/vehicle";

const DEFAULT_COMPARABLE_COUNT = 6;
const MAX_COMPARABLE_COUNT = 30;

function roundPrice(price: number): number {
  return Math.round(price / 5_000) * 5_000;
}

function calculateMedian(numbers: number[]): number {
  if (numbers.length === 0) {
    return 0;
  }

  const sorted = [...numbers].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);

  if (sorted.length % 2 === 0) {
    return Math.round(
      (sorted[middle - 1] + sorted[middle]) / 2
    );
  }

  return sorted[middle];
}

function calculateAverage(numbers: number[]): number {
  if (numbers.length === 0) {
    return 0;
  }

  return Math.round(
    numbers.reduce((total, number) => total + number, 0) /
      numbers.length
  );
}

function normalizeText(value: string): string {
  return value
    .toLocaleLowerCase("tr-TR")
    .replaceAll("ı", "i")
    .replaceAll("ş", "s")
    .replaceAll("ğ", "g")
    .replaceAll("ü", "u")
    .replaceAll("ö", "o")
    .replaceAll("ç", "c")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokenize(value: string): string[] {
  return normalizeText(value)
    .split(" ")
    .filter((token) => token.length > 1);
}

function calculateTokenSimilarity(
  firstValue: string,
  secondValue: string
): number {
  const firstTokens = tokenize(firstValue);
  const secondTokens = tokenize(secondValue);

  if (firstTokens.length === 0 || secondTokens.length === 0) {
    return 0;
  }

  const firstSet = new Set(firstTokens);
  const secondSet = new Set(secondTokens);

  const commonTokens = [...firstSet].filter((token) =>
    secondSet.has(token)
  );

  const totalUniqueTokens = new Set([
    ...firstTokens,
    ...secondTokens,
  ]).size;

  return totalUniqueTokens > 0
    ? commonTokens.length / totalUniqueTokens
    : 0;
}

function isValidComparable(
  comparable: ComparableVehicle
): boolean {
  const currentYear = new Date().getFullYear();

  return (
    Boolean(comparable.title.trim()) &&
    Boolean(comparable.brand.trim()) &&
    Boolean(comparable.model.trim()) &&
    Number.isFinite(comparable.year) &&
    comparable.year >= 1950 &&
    comparable.year <= currentYear + 1 &&
    Number.isFinite(comparable.mileage) &&
    comparable.mileage >= 0 &&
    comparable.mileage <= 2_000_000 &&
    Number.isFinite(comparable.price) &&
    comparable.price >= 50_000
  );
}

function calculateSimilarityScore(
  vehicle: Vehicle,
  comparable: ComparableVehicle
): number {
  const normalizedVehicleBrand = normalizeText(vehicle.brand);
  const normalizedComparableBrand = normalizeText(
    comparable.brand
  );

  if (
    normalizedVehicleBrand !== normalizedComparableBrand
  ) {
    return 0;
  }

  let score = 40;

  const modelSimilarity = calculateTokenSimilarity(
    vehicle.model,
    comparable.model
  );

  if (modelSimilarity >= 0.8) {
    score += 30;
  } else if (modelSimilarity >= 0.5) {
    score += 22;
  } else if (modelSimilarity >= 0.25) {
    score += 12;
  } else {
    return 0;
  }

  const yearDifference = Math.abs(
    vehicle.year - comparable.year
  );

  if (yearDifference === 0) {
    score += 15;
  } else if (yearDifference === 1) {
    score += 11;
  } else if (yearDifference === 2) {
    score += 6;
  } else if (yearDifference === 3) {
    score += 2;
  } else {
    return 0;
  }

  const mileageDifference = Math.abs(
    vehicle.mileage - comparable.mileage
  );

  const maximumMileageDifference = Math.max(
    80_000,
    vehicle.mileage * 0.45
  );

  if (mileageDifference > maximumMileageDifference) {
    return 0;
  }

  const mileageSimilarity =
    1 -
    mileageDifference /
      Math.max(maximumMileageDifference, 1);

  score += Math.round(mileageSimilarity * 15);

  return Math.min(100, Math.round(score));
}

function removeDuplicateComparables(
  comparables: ComparableVehicle[]
): ComparableVehicle[] {
  const uniqueComparables = new Map<
    string,
    ComparableVehicle
  >();

  for (const comparable of comparables) {
    const key = comparable.url
      ? comparable.url
      : [
          normalizeText(comparable.title),
          comparable.year,
          comparable.mileage,
          comparable.price,
        ].join("-");

    if (!uniqueComparables.has(key)) {
      uniqueComparables.set(key, comparable);
    }
  }

  return [...uniqueComparables.values()];
}

function calculateQuartile(
  sortedNumbers: number[],
  position: number
): number {
  if (sortedNumbers.length === 0) {
    return 0;
  }

  const index =
    (sortedNumbers.length - 1) * position;

  const lowerIndex = Math.floor(index);
  const upperIndex = Math.ceil(index);

  if (lowerIndex === upperIndex) {
    return sortedNumbers[lowerIndex];
  }

  const weight = index - lowerIndex;

  return (
    sortedNumbers[lowerIndex] * (1 - weight) +
    sortedNumbers[upperIndex] * weight
  );
}

function removePriceOutliers(
  comparableVehicles: ComparableVehicle[]
): ComparableVehicle[] {
  if (comparableVehicles.length < 4) {
    return comparableVehicles;
  }

  const sortedPrices = comparableVehicles
    .map((vehicle) => vehicle.price)
    .sort((a, b) => a - b);

  const firstQuartile = calculateQuartile(
    sortedPrices,
    0.25
  );

  const thirdQuartile = calculateQuartile(
    sortedPrices,
    0.75
  );

  const interquartileRange =
    thirdQuartile - firstQuartile;

  const minimumAllowedPrice =
    firstQuartile - interquartileRange * 1.5;

  const maximumAllowedPrice =
    thirdQuartile + interquartileRange * 1.5;

  const filtered = comparableVehicles.filter(
    (vehicle) =>
      vehicle.price >= minimumAllowedPrice &&
      vehicle.price <= maximumAllowedPrice
  );

  return filtered.length >= 3
    ? filtered
    : comparableVehicles;
}

function calculatePriceConsistency(
  comparables: ComparableVehicle[]
): number {
  if (comparables.length < 2) {
    return 0;
  }

  const prices = comparables.map(
    (comparable) => comparable.price
  );

  const averagePrice = calculateAverage(prices);

  if (averagePrice <= 0) {
    return 0;
  }

  const averageDeviation =
    prices.reduce(
      (total, price) =>
        total + Math.abs(price - averagePrice),
      0
    ) / prices.length;

  const deviationRate =
    averageDeviation / averagePrice;

  if (deviationRate <= 0.05) {
    return 15;
  }

  if (deviationRate <= 0.1) {
    return 12;
  }

  if (deviationRate <= 0.15) {
    return 8;
  }

  if (deviationRate <= 0.22) {
    return 4;
  }

  return 0;
}

function calculateConfidence(
  vehicle: Vehicle,
  comparableVehicles: ComparableVehicle[]
): number {
  if (comparableVehicles.length === 0) {
    return 0;
  }

  let confidence = 20;

  confidence += Math.min(
    comparableVehicles.length * 6,
    36
  );

  const averageSimilarityScore =
    comparableVehicles.reduce(
      (total, comparable) =>
        total +
        calculateSimilarityScore(vehicle, comparable),
      0
    ) / comparableVehicles.length;

  if (averageSimilarityScore >= 90) {
    confidence += 24;
  } else if (averageSimilarityScore >= 80) {
    confidence += 20;
  } else if (averageSimilarityScore >= 70) {
    confidence += 15;
  } else if (averageSimilarityScore >= 60) {
    confidence += 10;
  } else {
    confidence += 4;
  }

  confidence += calculatePriceConsistency(
    comparableVehicles
  );

  return Math.min(97, Math.round(confidence));
}

function createFallbackComparables(
  vehicle: Vehicle,
  estimatedMarketPrice: number
): ComparableVehicle[] {
  const priceMultipliers = [
    0.91,
    0.95,
    0.98,
    1.01,
    1.04,
    1.08,
  ];

  const mileageOffsets = [
    -32_000,
    -18_000,
    -7_000,
    9_000,
    21_000,
    38_000,
  ];

  const yearOffsets = [0, -1, 0, 1, -1, 0];

  return priceMultipliers.map(
    (multiplier, index) => ({
      title: `${vehicle.brand} ${vehicle.model} ${
        vehicle.year + yearOffsets[index]
      }`,
      brand: vehicle.brand,
      model: vehicle.model,
      year: Math.max(
        vehicle.year + yearOffsets[index],
        1950
      ),
      mileage: Math.max(
        vehicle.mileage + mileageOffsets[index],
        0
      ),
      price: roundPrice(
        estimatedMarketPrice * multiplier
      ),
      city: vehicle.city || "Türkiye",
    })
  );
}

export function createComparableMarketAnalysis(
  vehicle: Vehicle,
  estimatedMarketPrice: number,
  sourceComparables: ComparableVehicle[] = []
): ComparableMarketAnalysis {
  const scoredComparables = removeDuplicateComparables(
    sourceComparables.filter(isValidComparable)
  )
    .map((comparable) => ({
      comparable,
      similarityScore: calculateSimilarityScore(
        vehicle,
        comparable
      ),
    }))
    .filter(
      ({ similarityScore }) => similarityScore >= 60
    )
    .sort(
      (first, second) =>
        second.similarityScore -
        first.similarityScore
    )
    .slice(0, MAX_COMPARABLE_COUNT);

  const similarComparables = scoredComparables.map(
    ({ comparable }) => comparable
  );

  const filteredSourceComparables =
    removePriceOutliers(similarComparables);

  const hasRealComparables =
    filteredSourceComparables.length > 0;

  const comparableVehicles = hasRealComparables
    ? filteredSourceComparables
    : createFallbackComparables(
        vehicle,
        estimatedMarketPrice
      ).slice(0, DEFAULT_COMPARABLE_COUNT);

  const prices = comparableVehicles.map(
    (comparable) => comparable.price
  );

  if (prices.length === 0) {
    return {
      comparableVehicles: [],
      comparableCount: 0,
      lowestPrice: 0,
      highestPrice: 0,
      averagePrice: 0,
      medianPrice: 0,
      confidence: 0,
    };
  }

  return {
    comparableVehicles,
    comparableCount: comparableVehicles.length,
    lowestPrice: Math.min(...prices),
    highestPrice: Math.max(...prices),
    averagePrice: calculateAverage(prices),
    medianPrice: calculateMedian(prices),
    confidence: hasRealComparables
      ? calculateConfidence(
          vehicle,
          filteredSourceComparables
        )
      : 45,
  };
}

function determineMarketPosition(
  priceAdvantageScore: number
): MarketPosition {
  if (priceAdvantageScore >= 85) {
    return "excellent_deal";
  }

  if (priceAdvantageScore >= 70) {
    return "strong_deal";
  }

  if (priceAdvantageScore >= 45) {
    return "fair_price";
  }

  if (priceAdvantageScore >= 25) {
    return "slightly_expensive";
  }

  return "overpriced";
}

function createPositioningSummary(
  priceRank: number,
  totalComparableCount: number,
  cheaperThanPercentage: number,
  marketPosition: MarketPosition
): string {
  const positionLabels: Record<MarketPosition, string> = {
    excellent_deal: "çok güçlü bir fiyat avantajına sahip",
    strong_deal: "piyasaya göre avantajlı",
    fair_price: "piyasa seviyesinde",
    slightly_expensive: "piyasanın bir miktar üzerinde",
    overpriced: "emsallerine göre yüksek fiyatlı",
  };

  return `İlan, ${totalComparableCount} emsal içinde fiyat açısından ${priceRank}. sırada ve emsallerin %${cheaperThanPercentage}'inden daha ucuz. Genel olarak ${positionLabels[marketPosition]}.`;
}

export function createCompetitivePositioningAnalysis(
  listingPrice: number,
  marketAnalysis: ComparableMarketAnalysis
): CompetitivePositioningAnalysis {
  const validPrices = marketAnalysis.comparableVehicles
    .map((comparable) => comparable.price)
    .filter(
      (price) =>
        Number.isFinite(price) &&
        price > 0
    )
    .sort((first, second) => first - second);

  if (
    !Number.isFinite(listingPrice) ||
    listingPrice <= 0 ||
    validPrices.length === 0
  ) {
    return {
      pricePercentile: 0,
      cheaperThanPercentage: 0,
      priceRank: 0,
      totalComparableCount: 0,
      priceAdvantageScore: 0,
      marketPosition: "fair_price",
      summary:
        "Rekabet konumlandırması için yeterli fiyat verisi bulunamadı.",
    };
  }

  const cheaperComparableCount = validPrices.filter(
    (price) => price < listingPrice
  ).length;

  const moreExpensiveComparableCount = validPrices.filter(
    (price) => price > listingPrice
  ).length;

  const pricePercentile = Math.round(
    (cheaperComparableCount / validPrices.length) * 100
  );

  const cheaperThanPercentage = Math.round(
    (moreExpensiveComparableCount / validPrices.length) *
      100
  );

  const priceRank = cheaperComparableCount + 1;

  const medianPrice =
    marketAnalysis.medianPrice > 0
      ? marketAnalysis.medianPrice
      : calculateMedian(validPrices);

  const medianAdvantagePercentage =
    medianPrice > 0
      ? ((medianPrice - listingPrice) / medianPrice) * 100
      : 0;

  const rankScore = cheaperThanPercentage;

  const medianScore = Math.max(
    0,
    Math.min(
      100,
      50 + medianAdvantagePercentage * 3
    )
  );

  const confidenceWeight =
    Math.max(
      0,
      Math.min(100, marketAnalysis.confidence)
    ) / 100;

  const rawAdvantageScore =
    rankScore * 0.6 +
    medianScore * 0.4;

  const priceAdvantageScore = Math.round(
    rawAdvantageScore * confidenceWeight +
      50 * (1 - confidenceWeight)
  );

  const marketPosition = determineMarketPosition(
    priceAdvantageScore
  );

  return {
    pricePercentile,
    cheaperThanPercentage,
    priceRank,
    totalComparableCount: validPrices.length,
    priceAdvantageScore,
    marketPosition,
    summary: createPositioningSummary(
      priceRank,
      validPrices.length,
      cheaperThanPercentage,
      marketPosition
    ),
  };
}

