import { mercedesRiskProfiles } from "./riskProfiles/mercedes";
import { bmwRiskProfiles } from "./riskProfiles/bmw";
import { volkswagenRiskProfiles } from "./riskProfiles/volkswagen";
import { fiatRiskProfiles } from "./riskProfiles/fiat";
import { renaultRiskProfiles } from "./riskProfiles/renault";
import { peugeotRiskProfiles } from "./riskProfiles/peugeot";
import { fordRiskProfiles } from "./riskProfiles/ford";
import { opelRiskProfiles } from "./riskProfiles/opel";
import { japaneseRiskProfiles } from "./riskProfiles/japanese";
import { koreanRiskProfiles } from "./riskProfiles/korean";
import { vagRiskProfiles } from "./riskProfiles/vag";

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
  ...volkswagenRiskProfiles,
  ...fiatRiskProfiles,
  ...renaultRiskProfiles,
  ...peugeotRiskProfiles,
  ...fordRiskProfiles,
  ...opelRiskProfiles,
  ...japaneseRiskProfiles,
  ...koreanRiskProfiles,
  ...vagRiskProfiles,
];
