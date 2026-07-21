import type { ComparableVehicle } from "../types/analysis";
import type { Vehicle } from "../types/vehicle";

export interface ComparableProvider {
  name: string;

  findComparables(
    vehicle: Vehicle
  ): Promise<ComparableVehicle[]>;
}