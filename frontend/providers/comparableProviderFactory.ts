import type { ComparableProvider } from "./comparableProvider";
import { FakeComparableProvider } from "./fakeComparableProvider";
import { SahibindenComparableProvider } from "./sahibindenComparableProvider";

export type ComparableProviderType =
  | "fake"
  | "sahibinden";

export function createComparableProvider(
  type: ComparableProviderType = "fake"
): ComparableProvider {
  switch (type) {
    case "sahibinden":
      return new SahibindenComparableProvider();

    case "fake":
    default:
      return new FakeComparableProvider();
  }
}