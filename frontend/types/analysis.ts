import type { Vehicle } from "./vehicle";

export type PurchaseRecommendation =
  | "strong_buy"
  | "buy"
  | "consider"
  | "avoid";

export type PriceEvaluation =
  | "very_good"
  | "good"
  | "fair"
  | "expensive"
  | "very_expensive";

export type ComparableVehicle = {
  title: string;
  brand: string;
  model: string;
  year: number;
  mileage: number;
  price: number;
  city: string;
  url?: string;
};

export type ComparableMarketAnalysis = {
  comparableVehicles: ComparableVehicle[];

  comparableCount: number;

  lowestPrice: number;
  highestPrice: number;
  averagePrice: number;
  medianPrice: number;

  confidence: number;
};

export type DescriptionRiskLevel =
  | "low"
  | "medium"
  | "high";

export type DescriptionAnalysis = {
  riskLevel: DescriptionRiskLevel;

  riskScore: number;

  detectedKeywords: string[];

  detectedClaims: string[];

  warnings: string[];

  positiveSignals: string[];

  summary: string;
};

export type PhotoConditionLevel =
  | "good"
  | "medium"
  | "poor"
  | "unknown";

export type PhotoAnalysis = {
  photoCount: number;

  exteriorPhotoCount: number;

  interiorPhotoCount: number;

  coverageScore: number;

  conditionLevel: PhotoConditionLevel;

  warnings: string[];

  positiveSignals: string[];

  visualFindings: string[];

  summary: string;
};

export type AnalysisResult = {
  vehicle: Vehicle;

  score: number;

  purchaseRecommendation: PurchaseRecommendation;

  priceAnalysis: {
    listingPrice: number;
    estimatedMarketPrice: number;
    difference: number;
    differencePercentage: number;
    evaluation: PriceEvaluation;
  };

  marketAnalysis: ComparableMarketAnalysis;

  descriptionAnalysis: DescriptionAnalysis;

  photoAnalysis: PhotoAnalysis;

  chronicProblems: string[];

  advantages: string[];

  disadvantages: string[];

  aiComment: string;

  negotiationAdvice: string;

  importantChecks: string[];
};