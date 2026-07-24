import { bmwEquipmentProfiles } from "./equipmentProfiles/bmw";
import { mercedesEquipmentProfiles } from "./equipmentProfiles/mercedes";
import { commonEquipmentProfiles } from "./equipmentProfiles/common";

export type EquipmentProfile = {
  id: string;
  brand: string;
  packageKeywords: string[];
  title: string;
  description: string;
  checks: string[];
  positiveSignals: string[];
};

export const equipmentProfiles: EquipmentProfile[] = [
  ...bmwEquipmentProfiles,
  ...mercedesEquipmentProfiles,
  ...commonEquipmentProfiles,
];
