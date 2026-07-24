import {
  vehicleRiskProfiles,
  type VehicleRiskItem,
  type VehicleRiskProfile,
} from "../data/vehicleRiskProfiles";
import type { Vehicle } from "../types/vehicle";

function normalizeText(value: string | undefined): string {
  return (value || "")
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

function includesAny(
  source: string,
  keywords: string[] | undefined
): boolean {
  if (!keywords || keywords.length === 0) {
    return true;
  }

  return keywords.some((keyword) =>
    source.includes(normalizeText(keyword))
  );
}

function matchesProfile(
  vehicle: Vehicle,
  profile: VehicleRiskProfile
): boolean {
  const brand = normalizeText(vehicle.brand);
  const modelText = normalizeText(
    [
      vehicle.model,
      vehicle.series,
      vehicle.title,
      vehicle.engineVolume,
      vehicle.enginePower,
      vehicle.description,
    ]
      .filter(Boolean)
      .join(" ")
  );

  const fuel = normalizeText(vehicle.fuel);
  const transmission = normalizeText(vehicle.transmission);

  if (brand !== normalizeText(profile.brand)) {
    return false;
  }

  if (!includesAny(modelText, profile.modelKeywords)) {
    return false;
  }

  if (
    profile.yearMin !== undefined &&
    vehicle.year < profile.yearMin
  ) {
    return false;
  }

  if (
    profile.yearMax !== undefined &&
    vehicle.year > profile.yearMax
  ) {
    return false;
  }

  if (!includesAny(fuel, profile.fuelKeywords)) {
    return false;
  }

  if (
    !includesAny(
      transmission,
      profile.transmissionKeywords
    )
  ) {
    return false;
  }

  if (!includesAny(modelText, profile.engineKeywords)) {
    return false;
  }

  return true;
}

export function findVehicleRiskProfile(
  vehicle: Vehicle
): VehicleRiskProfile | null {
  const matchedProfile =
    vehicleRiskProfiles.find((profile) =>
      matchesProfile(vehicle, profile)
    ) ?? null;

  return matchedProfile;
}

export function getVehicleSpecificRisks(
  vehicle: Vehicle
): VehicleRiskItem[] {
  return findVehicleRiskProfile(vehicle)?.risks ?? [];
}
