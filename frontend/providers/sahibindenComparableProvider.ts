import type { ComparableVehicle } from "../types/analysis";
import type { Vehicle } from "../types/vehicle";
import type { ComparableProvider } from "./comparableProvider";

export class SahibindenComparableProvider
  implements ComparableProvider
{
  name = "sahibinden-comparable-provider";

  async findComparables(
    vehicle: Vehicle
  ): Promise<ComparableVehicle[]> {
    console.log(
      `[${this.name}] Emsal arama hazırlanıyor:`,
      vehicle.brand,
      vehicle.model,
      vehicle.year
    );

    return [];
  }
}