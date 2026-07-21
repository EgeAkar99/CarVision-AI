import type {
  ComparableMarketAnalysis,
  ComparableVehicle,
} from "../types/analysis";
import type { Vehicle } from "../types/vehicle";

const DEFAULT_COMPARABLE_COUNT = 6;

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

function normalizeText(value: string): string {
  return value
    .toLocaleLowerCase("tr-TR")
    .replaceAll("ı", "i")
    .replaceAll("ş", "s")
    .replaceAll("ğ", "g")
    .replaceAll("ü", "u")
    .replaceAll("ö", "o")
    .replaceAll("ç", "c")
    .trim();
}

function isValidComparable(
  comparable: ComparableVehicle
): boolean {
  return (
    Boolean(comparable.brand.trim()) &&
    Boolean(comparable.model.trim()) &&
    Number.isFinite(comparable.year) &&
    comparable.year > 1950 &&
    Number.isFinite(comparable.mileage) &&
    comparable.mileage >= 0 &&
    Number.isFinite(comparable.price) &&
    comparable.price > 0
  );
}

function isSimilarVehicle(
  vehicle: Vehicle,
  comparable: ComparableVehicle
): boolean {
  const sameBrand =
    normalizeText(vehicle.brand) ===
    normalizeText(comparable.brand);

  const sameModel =
    normalizeText(vehicle.model) ===
    normalizeText(comparable.model);

  const yearDifference = Math.abs(
    vehicle.year - comparable.year
  );

  const mileageDifference = Math.abs(
    vehicle.mileage - comparable.mileage
  );

  const maximumMileageDifference = Math.max(
    60_000,
    vehicle.mileage * 0.35
  );

  return (
    sameBrand &&
    sameModel &&
    yearDifference <= 2 &&
    mileageDifference <= maximumMileageDifference
  );
}

function removePriceOutliers(
  comparableVehicles: ComparableVehicle[]
): ComparableVehicle[] {
  if (comparableVehicles.length < 4) {
    return comparableVehicles;
  }

  const prices = comparableVehicles
    .map((vehicle) => vehicle.price)
    .sort((a, b) => a - b);

  const priceMedian = calculateMedian(prices);

  const minimumAllowedPrice = priceMedian * 0.65;
  const maximumAllowedPrice = priceMedian * 1.35;

  return comparableVehicles.filter(
    (vehicle) =>
      vehicle.price >= minimumAllowedPrice &&
      vehicle.price <= maximumAllowedPrice
  );
}

function calculateConfidence(
  vehicle: Vehicle,
  comparableVehicles: ComparableVehicle[]
): number {
  if (comparableVehicles.length === 0) {
    return 0;
  }

  let confidence = 35;

  confidence += Math.min(
    comparableVehicles.length * 7,
    35
  );

  const averageYearDifference =
    comparableVehicles.reduce(
      (total, comparable) =>
        total +
        Math.abs(vehicle.year - comparable.year),
      0
    ) / comparableVehicles.length;

  const averageMileageDifference =
    comparableVehicles.reduce(
      (total, comparable) =>
        total +
        Math.abs(
          vehicle.mileage - comparable.mileage
        ),
      0
    ) / comparableVehicles.length;

  if (averageYearDifference <= 0.5) {
    confidence += 12;
  } else if (averageYearDifference <= 1) {
    confidence += 8;
  } else {
    confidence += 3;
  }

  if (averageMileageDifference <= 20_000) {
    confidence += 12;
  } else if (averageMileageDifference <= 40_000) {
    confidence += 8;
  } else {
    confidence += 3;
  }

  return Math.min(95, Math.round(confidence));
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
  const validSourceComparables = sourceComparables
    .filter(isValidComparable)
    .filter((comparable) =>
      isSimilarVehicle(vehicle, comparable)
    );

  const filteredSourceComparables =
    removePriceOutliers(validSourceComparables);

  const comparableVehicles =
    filteredSourceComparables.length > 0
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

  const averagePrice = Math.round(
    prices.reduce(
      (total, price) => total + price,
      0
    ) / prices.length
  );

  const confidence =
    filteredSourceComparables.length > 0
      ? calculateConfidence(
          vehicle,
          filteredSourceComparables
        )
      : 55;

  return {
    comparableVehicles,
    comparableCount: comparableVehicles.length,
    lowestPrice: Math.min(...prices),
    highestPrice: Math.max(...prices),
    averagePrice,
    medianPrice: calculateMedian(prices),
    confidence,
  };
}