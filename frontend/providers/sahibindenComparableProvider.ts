import { chromium, type Browser } from "playwright";
import type { ComparableVehicle } from "../types/analysis";
import type { Vehicle } from "../types/vehicle";
import type { ComparableProvider } from "./comparableProvider";

function createSearchUrl(vehicle: Vehicle): string {
  const query = [
    vehicle.brand,
    vehicle.series,
    vehicle.model,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    "https://www.sahibinden.com/otomobil" +
    `?query_text=${encodeURIComponent(query)}`
  );
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
          "Mozilla/5.0 (Macintosh; Apple Silicon Mac OS X 10_15_7) " +
          "AppleWebKit/537.36 (KHTML, like Gecko) " +
          "Chrome/149.0.0.0 Safari/537.36",
      });

      const page = await context.newPage();

      await page.goto(createSearchUrl(vehicle), {
        waitUntil: "domcontentloaded",
        timeout: 30_000,
      });

      await page
        .waitForSelector(
          "tr.searchResultsItem, .searchResultsItem",
          {
            timeout: 10_000,
          }
        )
        .catch(() => undefined);

      const comparables = await page.evaluate(
        ({ brand, model }) => {
          function parseNumber(value: string): number {
            return (
              Number(value.replace(/[^\d]/g, "")) || 0
            );
          }

          function getText(
            element: Element,
            selectors: string[]
          ): string {
            for (const selector of selectors) {
              const target =
                element.querySelector(selector);

              const value =
                target?.textContent?.trim();

              if (value) {
                return value;
              }
            }

            return "";
          }

          const rows = [
            ...document.querySelectorAll(
              "tr.searchResultsItem, .searchResultsItem"
            ),
          ];

          const currentYear =
            new Date().getFullYear();

          return rows
            .map((row) => {
              const title = getText(row, [
                ".classifiedTitle",
                "a[href*='/ilan/']",
              ]);

              const priceText = getText(row, [
                ".searchResultsPriceValue",
                ".classifiedPrice",
              ]);

              const locationText = getText(row, [
                ".searchResultsLocationValue",
                ".classifiedLocation",
              ]);

              const link = row.querySelector<HTMLAnchorElement>(
                "a.classifiedTitle[href], a[href*='/ilan/']"
              );

              const values = [
                ...row.querySelectorAll(
                  "td.searchResultsAttributeValue, .searchResultsAttributeValue"
                ),
              ].map((cell) => ({
                text: cell.textContent?.trim() || "",
                value: parseNumber(
                  cell.textContent || ""
                ),
              }));

              const yearIndex = values.findIndex(
                ({ value }) =>
                  value >= 1950 &&
                  value <= currentYear + 1
              );

              const year =
                yearIndex >= 0
                  ? values[yearIndex].value
                  : 0;

              const mileage =
                values
                  .slice(
                    yearIndex >= 0
                      ? yearIndex + 1
                      : 0
                  )
                  .find(
                    ({ text, value }) =>
                      (/km/i.test(text) ||
                        value > currentYear + 1) &&
                      value <= 2_000_000 &&
                      value !==
                        parseNumber(priceText)
                  )?.value || 0;

              let url = "";

              if (link?.href) {
                url = link.href;
              }

              return {
                title,
                brand,
                model,
                year,
                mileage,
                price: parseNumber(priceText),
                city:
                  locationText
                    .split("/")[0]
                    ?.trim() || "",
                url,
              };
            })
            .filter(
              (item) =>
                item.title &&
                item.year > 0 &&
                item.price > 0 &&
                item.url
            )
            .slice(0, 50);
        },
        {
          brand: vehicle.brand,
          model: vehicle.model,
        }
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
