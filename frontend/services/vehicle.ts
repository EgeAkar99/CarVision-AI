import { sahibindenProvider } from "../providers/sahibinden/provider";
import type { VehicleProvider } from "../providers/provider";
import type { Vehicle } from "../types/vehicle";

function parseListingUrl(listingUrl: string): URL {
  const trimmedUrl = listingUrl.trim();

  if (!trimmedUrl) {
    throw new Error("İlan linki boş olamaz.");
  }

  try {
    return new URL(trimmedUrl);
  } catch {
    throw new Error("Geçerli bir ilan linki giriniz.");
  }
}

function getProvider(url: URL): VehicleProvider {
  const hostname = url.hostname.toLowerCase();

  if (
    hostname === "sahibinden.com" ||
    hostname.endsWith(".sahibinden.com")
  ) {
    return sahibindenProvider;
  }

  throw new Error(
    "Şimdilik yalnızca Sahibinden ilanları desteklenmektedir."
  );
}

export async function getVehicleFromListing(
  listingUrl: string
): Promise<Vehicle> {
  const url = parseListingUrl(listingUrl);
  const provider = getProvider(url);

  return provider.getVehicle(url.toString());
}