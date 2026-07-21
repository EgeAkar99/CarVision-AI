import type { VehicleProvider } from "../provider";
import type { Vehicle } from "../../types/vehicle";
import { fetchSahibindenListing } from "./client";
import { parseSahibindenListing } from "./parser";

export class SahibindenProvider implements VehicleProvider {
  async getVehicle(listingUrl: string): Promise<Vehicle> {
    const { html } = await fetchSahibindenListing(listingUrl);

    return parseSahibindenListing(html);
  }
}

export const sahibindenProvider = new SahibindenProvider();