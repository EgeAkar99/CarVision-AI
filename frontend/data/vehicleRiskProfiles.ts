import { mercedesRiskProfiles } from "./riskProfiles/mercedes";
import { bmwRiskProfiles } from "./riskProfiles/bmw";

export type RiskSeverity =
  | "low"
  | "medium"
  | "high";

export type VehicleRiskItem = {
  title: string;
  description: string;
  severity: RiskSeverity;
  estimatedCostMin?: number;
  estimatedCostMax?: number;
  checks: string[];
};

export type VehicleRiskProfile = {
  id: string;
  brand: string;
  modelKeywords: string[];
  yearMin?: number;
  yearMax?: number;
  fuelKeywords?: string[];
  transmissionKeywords?: string[];
  engineKeywords?: string[];
  risks: VehicleRiskItem[];
};

export const vehicleRiskProfiles: VehicleRiskProfile[] = [
  ...mercedesRiskProfiles,
  ...bmwRiskProfiles,
];
