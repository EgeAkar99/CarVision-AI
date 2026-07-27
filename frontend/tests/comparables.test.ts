import { describe, expect, it } from "vitest";
import {
  createComparableMarketAnalysis,
  createCompetitivePositioningAnalysis,
} from "../services/comparables";
import type { ComparableVehicle } from "../types/analysis";
import type { Vehicle } from "../types/vehicle";

const vehicle: Vehicle = {
  brand: "Mercedes-Benz",
  model: "CLA 180 d AMG",
  year: 2015,
  mileage: 175000,
  fuel: "Dizel",
  transmission: "Otomatik",
  price: 1600000,
  city: "Ankara",
};

const comparables: ComparableVehicle[] = [
  {
    title: "Mercedes CLA 180 d AMG 2015",
    brand: "Mercedes-Benz",
    model: "CLA 180 d AMG",
    year: 2015,
    mileage: 170000,
    price: 1580000,
    city: "Ankara",
    url: "https://example.com/1",
  },
  {
    title: "Mercedes CLA 180 d AMG 2014",
    brand: "Mercedes-Benz",
    model: "CLA 180 d AMG",
    year: 2014,
    mileage: 185000,
    price: 1540000,
    city: "İstanbul",
    url: "https://example.com/2",
  },
  {
    title: "Mercedes CLA 180 d AMG 2016",
    brand: "Mercedes-Benz",
    model: "CLA 180 d AMG",
    year: 2016,
    mileage: 160000,
    price: 1660000,
    city: "İzmir",
    url: "https://example.com/3",
  },
  {
    title: "Mercedes CLA 180 d AMG 2015",
    brand: "Mercedes-Benz",
    model: "CLA 180 d AMG",
    year: 2015,
    mileage: 180000,
    price: 1620000,
    city: "Bursa",
    url: "https://example.com/4",
  },
];

describe("createComparableMarketAnalysis", () => {
  it("gerçek emsallerden doğru piyasa istatistikleri üretir", () => {
    const result = createComparableMarketAnalysis(
      vehicle,
      1600000,
      comparables
    );

    expect(result.comparableCount).toBe(4);
    expect(result.lowestPrice).toBe(1540000);
    expect(result.highestPrice).toBe(1660000);
    expect(result.averagePrice).toBe(1600000);
    expect(result.medianPrice).toBe(1600000);
    expect(result.confidence).toBeGreaterThan(0);
  });

  it("uygun emsal yoksa sentetik emsal oluşturur", () => {
    const result = createComparableMarketAnalysis(
      vehicle,
      1600000,
      []
    );

    expect(result.comparableCount).toBe(6);
    expect(result.confidence).toBe(45);
    expect(result.medianPrice).toBeGreaterThan(0);
  });

  it("aynı URL'ye sahip tekrar eden emsalleri kaldırır", () => {
    const duplicatedComparables = [
      ...comparables,
      comparables[0],
    ];

    const result = createComparableMarketAnalysis(
      vehicle,
      1600000,
      duplicatedComparables
    );

    expect(result.comparableCount).toBe(4);
  });

  it("farklı marka ve alakasız modeli filtreler", () => {
    const invalidComparable: ComparableVehicle = {
      title: "BMW 320i",
      brand: "BMW",
      model: "320i",
      year: 2015,
      mileage: 175000,
      price: 1600000,
      city: "Ankara",
    };

    const result = createComparableMarketAnalysis(
      vehicle,
      1600000,
      [invalidComparable]
    );

    expect(result.comparableCount).toBe(6);
    expect(result.confidence).toBe(45);
  });
});

describe("createCompetitivePositioningAnalysis", () => {
  it("ilanın emsaller içindeki fiyat sıralamasını hesaplar", () => {
    const marketAnalysis =
      createComparableMarketAnalysis(
        vehicle,
        1600000,
        comparables
      );

    const result =
      createCompetitivePositioningAnalysis(
        1550000,
        marketAnalysis
      );

    expect(result.totalComparableCount).toBe(4);
    expect(result.priceRank).toBe(2);
    expect(result.cheaperThanPercentage).toBe(75);
    expect(result.priceAdvantageScore).toBeGreaterThan(50);
  });

  it("geçersiz fiyat verisinde güvenli varsayılan döndürür", () => {
    const result =
      createCompetitivePositioningAnalysis(0, {
        comparableVehicles: [],
        comparableCount: 0,
        lowestPrice: 0,
        highestPrice: 0,
        averagePrice: 0,
        medianPrice: 0,
        confidence: 0,
      });

    expect(result.priceRank).toBe(0);
    expect(result.totalComparableCount).toBe(0);
    expect(result.priceAdvantageScore).toBe(0);
  });
});
