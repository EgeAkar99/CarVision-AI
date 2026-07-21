import type { Vehicle } from "../types/vehicle";

export interface VehicleProvider {
  getVehicle(listingUrl: string): Promise<Vehicle>;
}