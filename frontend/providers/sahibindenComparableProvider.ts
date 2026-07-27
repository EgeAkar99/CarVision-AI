import { chromium, type Browser } from "playwright";
import type { ComparableVehicle } from "../types/analysis";
import type { Vehicle } from "../types/vehicle";
import type { ComparableProvider } from "./comparableProvider";

const MAX_RESULT_COUNT = 50;

function normalizeText(value: string): string {
  return value
    .toLocaleLowerCase("tr-TR")
    .replaceAll("ı", "i")
    .replaceAll("ş", "s")
    .replaceAll("ğ", "g")
    .replaceAll("ü", "u")
    .replaceAll("ö", "o")
    .replaceAll("ç", "c")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokenize(value: string): string[] {
  return normalizeText(value)
    .split(" ")
    .filter((token) => token.length >= 2);
}

function createSearchUrl(vehicle: Vehicle): string {
  const query = [
    vehicle.brand,
    vehicle.series,
    vehicle.model,
  ]
    .filter(Boolean)
    .join(" ");

  const searchParams = new URLSearchParams({
    query_text: query,
    sorting: "price_asc",
  });

  return `https://www.sahibinden.com/otomobil?${searchParams.toString()}`;
}

function normalizeListingUrl(value: string): string {
  try {
    const parsedUrl = new URL(value);

    parsedUrl.search = "";
    parsedUrl.hash = "";

    return parsedUrl.href.replace(/\/$/, "");
  } catch {
    return value.split("?")[0].replace(/\/$/, "");
  }
}

function isSimilarTitle(
  title: string,
  vehicle: Vehicle
): boolean {
  const normalizedTitle = normalizeText(title);

  const brandTokens = tokenize(vehicle.brand);
  const seriesTokens = tokenize(vehicle.series || "");
  const modelTokens = tokenize(vehicle.model);

  const hasBrand =
    brandTokens.length === 0 ||
    brandTokens.every((token) =>
      normalizedTitle.includes(token)
    );

  const seriesMatchCount = seriesTokens.filter((token) =>
    normalizedTitle.includes(token)
  ).length;

  const modelMatchCount = modelTokens.filter((token) =>
    normalizedTitle.includes(token)
  ).length;

  const hasSeries =
    seriesTokens.length === 0 ||
    seriesMatchCount >= Math.min(1, seriesTokens.length);

  const hasModel =
    modelTokens.length === 0 ||
    modelMatchCount >= Math.ceil(modelTokens.length * 0.5);

  return hasBrand && hasSeries && hasModel;
}

function isWithinVehicleRange(
  comparable: ComparableVehicle,
  vehicle: Vehicle
): boolean {
  const yearDifference = Math.abs(
    comparable.year - vehicle.year
  );

  const mileageDifference = Math.abs(
    comparable.mileage - vehicle.mileage
  );

  const allowedMileageDifference = Math.max(
    80_000,
    vehicle.mileage * 0.45
  );

  return (
    yearDifference <= 3 &&
    mileageDifference <= allowedMileageDifference
  );
}

function removeDuplicateComparables(
  comparables: ComparableVehicle[]
): ComparableVehicle[] {
  const uniqueComparables = new Map<
    string,
    ComparableVehicle
  >();

  for (const comparable of comparables) {
    const normalizedUrl = normalizeListingUrl(
      comparable.url || ""
    );

    const key =
      normalizedUrl ||
      [
        normalizeText(comparable.title),
        comparable.year,
        comparable.mileage,
        comparable.price,
      ].join("-");

    if (!uniqueComparables.has(key)) {
      uniqueComparables.set(key, {
        ...comparable,
        url: normalizedUrl,
      });
    }
  }

  return [...uniqueComparables.values()];
}

export class SahibindenComparableProvider
  implements ComparableProvider
{
  name = "sahibinden-comparable-provider";

  async findComparables(
    vehicle: Vehicle
  ): Promise<ComparableVehicle[]> {
    let browser: Browser | undefined;

    try {
      browser = await chromium.launch({
        headless: true,
      });

      const context = await browser.newContext({
        locale: "tr-TR",
        timezoneId: "Europe/Istanbul",
        viewport: {
          width: 1440,
          height: 1000,
        },
        userAgent:
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) " +
          "AppleWebKit/537.36 (KHTML, like Gecko) " +
          "Chrome/149.0.0.0 Safari/537.36",
        extraHTTPHeaders: {
          "Accept-Language":
            "tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7",
        },
      });

      const page = await context.newPage();

      await page.goto(createSearchUrl(vehicle), {
        waitUntil: "domcontentloaded",
        timeout: 30_000,
      });

      await page
        .waitForSelector(
          [
            "tr.searchResultsItem",
            ".searchResultsItem",
            "[data-id]",
          ].join(", "),
          {
            timeout: 12_000,
          }
        )
        .catch(() => undefined);

      await page.waitForTimeout(1_500);

      const extractedComparables =
        await page.evaluate(
          ({ brand, model }) => {
            function parseNumber(
              value: string
            ): number {
              const normalizedValue = value
                .replace(/\./g, "")
                .replace(/[^\d]/g, "");

              return Number(normalizedValue) || 0;
            }

            function getText(
              element: Element,
              selectors: string[]
            ): string {
              for (const selector of selectors) {
                const target =
                  element.querySelector(selector);

                const value =
                  target?.textContent
                    ?.replace(/\s+/g, " ")
                    .trim();

                if (value) {
                  return value;
                }
              }

              return "";
            }

            function getListingUrl(
              row: Element
            ): string {
              const link =
                row.querySelector<HTMLAnchorElement>(
                  [
                    "a.classifiedTitle[href]",
                    "a[href*='/ilan/']",
                  ].join(", ")
                );

              if (!link?.href) {
                return "";
              }

              try {
                const parsedUrl = new URL(link.href);

                parsedUrl.search = "";
                parsedUrl.hash = "";

                return parsedUrl.href.replace(
                  /\/$/,
                  ""
                );
              } catch {
                return link.href;
              }
            }

            function getYearAndMileage(
              row: Element,
              price: number
            ): {
              year: number;
              mileage: number;
            } {
              const currentYear =
                new Date().getFullYear();

              const attributeTexts = [
                ...row.querySelectorAll(
                  [
                    "td.searchResultsAttributeValue",
                    ".searchResultsAttributeValue",
                    "[data-label]",
                  ].join(", ")
                ),
              ]
                .map((element) =>
                  element.textContent
                    ?.replace(/\s+/g, " ")
                    .trim() || ""
                )
                .filter(Boolean);

              const numericValues =
                attributeTexts.map((text) => ({
                  text,
                  value: parseNumber(text),
                }));

              const yearItem =
                numericValues.find(
                  ({ value }) =>
                    value >= 1950 &&
                    value <= currentYear + 1
                );

              const year =
                yearItem?.value || 0;

              const mileageItem =
                numericValues.find(
                  ({ text, value }) => {
                    if (
                      value <= currentYear + 1 ||
                      value === price ||
                      value > 2_000_000
                    ) {
                      return false;
                    }

                    return (
                      /km|kilometre/i.test(text) ||
                      value >= 1_000
                    );
                  }
                );

              return {
                year,
                mileage:
                  mileageItem?.value || 0,
              };
            }

            const rows = [
              ...document.querySelectorAll(
                [
                  "tr.searchResultsItem",
                  ".searchResultsItem",
                  "tbody.searchResultsRowClass tr",
                ].join(", ")
              ),
            ];

            return rows
              .map((row) => {
                const title = getText(row, [
                  ".classifiedTitle",
                  "a.classifiedTitle",
                  "a[href*='/ilan/']",
                ]);

                const priceText = getText(row, [
                  ".searchResultsPriceValue",
                  ".classifiedPrice",
                  "[data-label='Fiyat']",
                ]);

                const price =
                  parseNumber(priceText);

                const locationText = getText(row, [
                  ".searchResultsLocationValue",
                  ".classifiedLocation",
                  "[data-label='İl / İlçe']",
                ]);

                const { year, mileage } =
                  getYearAndMileage(row, price);

                return {
                  title,
                  brand,
                  model,
                  year,
                  mileage,
                  price,
                  city:
                    locationText
                      .split("/")
                      .map((part) => part.trim())
                      .filter(Boolean)[0] || "",
                  url: getListingUrl(row),
                };
              })
              .filter(
                (item) =>
                  item.title &&
                  item.year > 0 &&
                  item.mileage > 0 &&
                  item.price > 0 &&
                  item.url
              );
          },
          {
            brand: vehicle.brand,
            model: vehicle.model,
          }
        );

      const currentListingUrl =
        normalizeListingUrl(
          vehicle.listingUrl || ""
        );

      const comparables =
        removeDuplicateComparables(
          extractedComparables
        )
          .filter((comparable) => {
            const comparableUrl =
              normalizeListingUrl(
                comparable.url || ""
              );

            return (
              !currentListingUrl ||
              comparableUrl !== currentListingUrl
            );
          })
          .filter((comparable) =>
            isSimilarTitle(
              comparable.title,
              vehicle
            )
          )
          .filter((comparable) =>
            isWithinVehicleRange(
              comparable,
              vehicle
            )
          )
          .sort((first, second) => {
            const firstYearDifference =
              Math.abs(
                first.year - vehicle.year
              );

            const secondYearDifference =
              Math.abs(
                second.year - vehicle.year
              );

            if (
              firstYearDifference !==
              secondYearDifference
            ) {
              return (
                firstYearDifference -
                secondYearDifference
              );
            }

            return (
              Math.abs(
                first.mileage -
                  vehicle.mileage
              ) -
              Math.abs(
                second.mileage -
                  vehicle.mileage
              )
            );
          })
          .slice(0, MAX_RESULT_COUNT);

      console.log(
        `[${this.name}] ${extractedComparables.length} ilan okundu, ${comparables.length} uygun emsal bulundu.`
      );

      return comparables;
    } catch (error) {
      console.error(
        `[${this.name}] Emsal alınamadı:`,
        error
      );

      return [];
    } finally {
      await browser
        ?.close()
        .catch(() => undefined);
    }
  }
}