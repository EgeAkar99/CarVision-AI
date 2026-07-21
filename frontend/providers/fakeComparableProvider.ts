import type { ComparableVehicle } from "../types/analysis";
import type { Vehicle } from "../types/vehicle";
import type { ComparableProvider } from "./comparableProvider";

function roundPrice(price: number): number {
  return Math.round(price / 5_000) * 5_000;
}

export class FakeComparableProvider
  implements ComparableProvider
{
  name = "fake-comparable-provider";

  async findComparables(
    vehicle: Vehicle
  ): Promise<ComparableVehicle[]> {
    const priceMultipliers = [
      0.91,
      0.95,
      0.98,
      1.01,
      1.04,
      1.08,
    ];

    const mileageOffsets = [
      -32_000,
      -18_000,
      -7_000,
      9_000,
      21_000,
      38_000,
    ];

    const yearOffsets = [0, -1, 0, 1, -1, 0];

    return priceMultipliers.map(
      (multiplier, index) => ({
        title: `${vehicle.brand} ${vehicle.model} ${
          vehicle.year + yearOffsets[index]
        }`,
        brand: vehicle.brand,
        model: vehicle.model,
        year: Math.max(
          vehicle.year + yearOffsets[index],
          1950
        ),
        mileage: Math.max(
          vehicle.mileage + mileageOffsets[index],
          0
        ),
        price: roundPrice(
          vehicle.price * multiplier
        ),
        city: vehicle.city || "Türkiye",
        url: undefined,
      })
    );
  }
}