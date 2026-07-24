import { equipmentProfiles } from "../data/equipmentProfiles";
import type { Vehicle } from "../types/vehicle";

export type EquipmentAnalysis = {
  title: string;
  description: string;
  checks: string[];
  positiveSignals: string[];
};

function containsKeyword(
  text: string,
  keywords: string[]
): boolean {
  const normalized = text.toLocaleLowerCase("tr-TR");

  return keywords.some((keyword) =>
    normalized.includes(
      keyword.toLocaleLowerCase("tr-TR")
    )
  );
}

export function analyzeEquipment(
  vehicle: Vehicle
): EquipmentAnalysis[] {
  const searchableText = [
    vehicle.brand,
    vehicle.model,
    vehicle.description,
  ]
    .filter(Boolean)
    .join(" ");

  return equipmentProfiles
    .filter((profile) => {
      const profileBrand =
        profile.brand.toLocaleLowerCase("tr-TR");

      const vehicleBrand =
        vehicle.brand.toLocaleLowerCase("tr-TR");

      if (
        profileBrand !== "*" &&
        profileBrand !== vehicleBrand
      ) {
        return false;
      }

      return containsKeyword(
        searchableText,
        profile.packageKeywords
      );
    })
    .map((profile) => ({
      title: profile.title,
      description: profile.description,
      checks: profile.checks,
      positiveSignals: profile.positiveSignals,
    }));
}
