import type { Vehicle } from "../types/vehicle";

export type VehicleAnalysis = {
  vehicle: Vehicle;
  marketPrice: number;
  score: number;
  verdict: "Satın Alınabilir" | "Dikkatli İncelenmeli" | "Önerilmez";
};

export async function analyzeVehicle(
  listingUrl: string
): Promise<VehicleAnalysis> {
  if (!listingUrl.trim()) {
    throw new Error("İlan linki zorunludur.");
  }

  const vehicle: Vehicle = {
    brand: "BMW",
    model: "320i ED",
    year: 2018,
    mileage: 120000,
    fuel: "Benzin",
    transmission: "Otomatik",
    price: 1250000,
    city: "Ankara",
  };

  return {
    vehicle,
    marketPrice: 1285000,
    score: 91,
    verdict: "Satın Alınabilir",
  };
}