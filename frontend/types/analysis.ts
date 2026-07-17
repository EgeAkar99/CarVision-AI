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

  chronicProblems: string[];
  advantages: string[];
  disadvantages: string[];

  aiComment: string;
  negotiationAdvice: string;
  importantChecks: string[];
};