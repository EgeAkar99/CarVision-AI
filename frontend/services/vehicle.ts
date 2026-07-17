import { getFakeVehicle } from "../providers/fakeProvider";
import type { Vehicle } from "../types/vehicle";

function validateListingUrl(listingUrl: string) {
  const trimmedUrl = listingUrl.trim();

  if (!trimmedUrl) {
    throw new Error("İlan linki boş olamaz.");
  }

  try {
    const url = new URL(trimmedUrl);

    if (!url.hostname.includes("sahibinden.com")) {
      throw new Error(
        "Şimdilik yalnızca Sahibinden ilanları desteklenmektedir."
      );
    }

    return trimmedUrl;
  } catch {
    throw new Error("Geçerli bir ilan linki giriniz.");
  }
}

export async function getVehicleFromListing(
  listingUrl: string
): Promise<Vehicle> {
  validateListingUrl(listingUrl);

  // Şimdilik sahte provider kullanıyoruz.
  // Daha sonra burada gerçek Sahibinden provider'ı çalışacak.
  return getFakeVehicle();
}