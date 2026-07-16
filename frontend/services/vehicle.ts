import type { Vehicle } from "../types/vehicle";

export async function getVehicleFromListing(
  listingUrl: string
): Promise<Vehicle> {
  if (!listingUrl.trim()) {
    throw new Error("İlan linki boş olamaz.");
  }

  return {
    brand: "BMW",
    model: "320i ED",
    year: 2018,
    mileage: 120000,
    fuel: "Benzin",
    transmission: "Otomatik",
    price: 1250000,
    city: "Ankara",
    description:
      "Bakımları tam. Boya ve değişen bilgileri ilanda belirtilmiştir.",
  };
}