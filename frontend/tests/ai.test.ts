import { describe, expect, it } from "vitest";
import { analyzeVehicle } from "../services/ai";
import type { ComparableVehicle } from "../types/analysis";
import type { Vehicle } from "../types/vehicle";

const baseVehicle: Vehicle = {
  brand: "BMW",
  model: "320i",
  year: 2018,
  mileage: 120000,
  fuel: "Benzin",
  transmission: "Otomatik",
  price: 1250000,
  city: "Ankara",
  description:
    "Bakımları düzenli yapılmıştır. Tramer kaydı yoktur. Değişen yok, lokal boya bulunmaktadır.",
};

const comparables: ComparableVehicle[] = [
  {
    title: "BMW 320i 2018",
    brand: "BMW",
    model: "320i",
    year: 2018,
    mileage: 110000,
    price: 1300000,
    city: "Ankara",
  },
  {
    title: "BMW 320i 2018",
    brand: "BMW",
    model: "320i",
    year: 2018,
    mileage: 125000,
    price: 1280000,
    city: "İstanbul",
  },
  {
    title: "BMW 320i 2019",
    brand: "BMW",
    model: "320i",
    year: 2019,
    mileage: 118000,
    price: 1350000,
    city: "İzmir",
  },
];

describe("analyzeVehicle", () => {
  it("güvenilir emsallerle doğru analiz üretir", async () => {
    const result = await analyzeVehicle(
      baseVehicle,
      comparables
    );

    expect(result.priceAnalysis.listingPrice).toBe(
      1250000
    );

    expect(
      result.priceAnalysis.estimatedMarketPrice
    ).toBeGreaterThan(0);

    expect(result.marketAnalysis.comparableCount).toBe(
      3
    );

    expect(result.analysisConfidence).toBeGreaterThan(
      0
    );

    expect(result.score).toBeGreaterThanOrEqual(25);
    expect(result.score).toBeLessThanOrEqual(98);

    expect([
      "strong_buy",
      "buy",
      "consider",
      "avoid",
    ]).toContain(result.purchaseRecommendation);
  });

  it("emsal verilmediğinde de analiz üretir", async () => {
    const result = await analyzeVehicle(baseVehicle);

    expect(result.marketAnalysis.comparableCount).toBeGreaterThan(
      0
    );

    expect(
      result.priceAnalysis.estimatedMarketPrice
    ).toBeGreaterThan(0);

    expect(result.negotiationAnalysis).toBeDefined();
    expect(result.purchaseRiskAnalysis).toBeDefined();
  });

  it("riskli açıklamayı tespit eder", async () => {
    const riskyVehicle: Vehicle = {
      ...baseVehicle,
      description:
        "Araç ağır hasar kayıtlıdır. Şase işlemli, podye düzeltmeli ve direk işlem görmüştür.",
    };

    const result = await analyzeVehicle(
      riskyVehicle,
      comparables
    );

    expect(
      result.descriptionAnalysis.riskLevel
    ).toBe("high");

    expect(
      result.descriptionAnalysis.riskScore
    ).toBeGreaterThanOrEqual(50);
  });

  it("pazarlık analizi üretir", async () => {
    const result = await analyzeVehicle(
      baseVehicle,
      comparables
    );

    expect(
      result.negotiationAnalysis.suggestedOfferPrice
    ).toBeGreaterThan(0);

    expect(
      result.negotiationAnalysis.targetPurchasePrice
    ).toBeGreaterThan(0);

    expect(
      result.negotiationAnalysis.maximumPurchasePrice
    ).toBeGreaterThan(0);

    expect(
      result.negotiationAnalysis.negotiationMargin
    ).toBeGreaterThanOrEqual(0);

    expect(
      result.negotiationAnalysis.negotiationPower
    ).toBeGreaterThanOrEqual(0);

    expect(
      result.negotiationAnalysis.arguments.length
    ).toBeGreaterThan(0);

    expect(
      result.negotiationAnalysis.suggestedOfferPrice
    ).toBeLessThanOrEqual(
      result.priceAnalysis.listingPrice
    );
  });
});