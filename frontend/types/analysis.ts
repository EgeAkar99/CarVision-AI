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

export type OwnershipCostAnalysis = {
  annualMaintenanceCost: number;
  annualFuelCost: number;
  annualTaxEstimate: number;
  annualInsuranceEstimate: number;
  potentialMajorRepairCost: number;
  threeYearDepreciation: number;
  annualTotalCost: number;
};

export type LifetimeAnalysis = {
  remainingEngineLifeKm: number;
  remainingTransmissionLifeKm: number;
  majorMaintenanceRisk: "low" | "medium" | "high";
  criticalRepairProbability: number;
  overallLifetimeScore: number;
};

export type PurchaseRiskAnalysis = {
  riskScore: number;
  riskLevel: "low" | "medium" | "high" | "very_high";
  summary: string;
};

export type MarketPosition =
  | "excellent_deal"
  | "strong_deal"
  | "fair_price"
  | "slightly_expensive"
  | "overpriced";

export type CompetitivePositioningAnalysis = {
  pricePercentile: number;
  cheaperThanPercentage: number;
  priceRank: number;
  totalComparableCount: number;
  priceAdvantageScore: number;
  marketPosition: MarketPosition;
  summary: string;
};

export type NegotiationAnalysis = {
  suggestedOfferPrice: number;
  targetPurchasePrice: number;
  maximumPurchasePrice: number;
  negotiationMargin: number;
  negotiationPower: number;
  strategy: string;
  arguments: string[];
};

export type AnalysisResult = {
  vehicle: Vehicle;

  score: number;

  analysisConfidence: number;

  purchaseRecommendation: PurchaseRecommendation;

  priceAnalysis: {
    listingPrice: number;
    estimatedMarketPrice: number;
    difference: number;
    differencePercentage: number;
    evaluation: PriceEvaluation;
  };

  marketAnalysis: ComparableMarketAnalysis;

  ownershipCostAnalysis: OwnershipCostAnalysis;

  lifetimeAnalysis: LifetimeAnalysis;

  purchaseRiskAnalysis: PurchaseRiskAnalysis;

  competitivePositioning: CompetitivePositioningAnalysis;

  negotiationAnalysis: NegotiationAnalysis;

  descriptionAnalysis: DescriptionAnalysis;

  photoAnalysis: PhotoAnalysis;

  chronicProblems: string[];

  advantages: string[];

  disadvantages: string[];

  aiComment: string;

  negotiationAdvice: string;

  importantChecks: string[];
};