import type { VehicleProvider } from "../provider";
import type { Vehicle } from "../../types/vehicle";

export class FakeProvider implements VehicleProvider {
  async getVehicle(): Promise<Vehicle> {
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
}

export const fakeProvider = new FakeProvider();