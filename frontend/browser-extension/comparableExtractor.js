function parseNumber(value) {
  if (!value) {
    return 0;
  }

  const normalized = value.replace(/[^\d]/g, "").trim();

  return Number(normalized) || 0;
}

function getElementText(element, selectors) {
  for (const selector of selectors) {
    const target = element.querySelector(selector);
    const value = target?.textContent?.trim();

    if (value) {
      return value;
    }
  }

  return "";
}

function getComparableUrl(element) {
  const directLink =
    element.querySelector("a.classifiedTitle[href]") ||
    element.querySelector("a[href*='/ilan/'][href]") ||
    element.querySelector("a[href*='/detay'][href]");

  let href = directLink?.getAttribute("href") || "";

  if (!href) {
    href =
      element.getAttribute("data-href") ||
      element.getAttribute("data-url") ||
      "";
  }

  if (!href) {
    const clickableElement = element.querySelector(
      "[data-href], [data-url]"
    );

    href =
      clickableElement?.getAttribute("data-href") ||
      clickableElement?.getAttribute("data-url") ||
      "";
  }

  if (!href) {
    const onclick =
      element.getAttribute("onclick") ||
      element.querySelector("[onclick]")?.getAttribute("onclick") ||
      "";

    const match = onclick.match(
      /(?:location(?:\.href)?\s*=\s*|window\.open\()\s*['"]([^'"]+)/
    );

    href = match?.[1] || "";
  }

  if (!href) {
    return "";
  }

  try {
    return new URL(href, location.origin).href;
  } catch {
    return "";
  }
}

function extractComparableVehicles() {
  const rows = [
    ...document.querySelectorAll(
      "tr.searchResultsItem, " +
        ".searchResultsItem, " +
        "[data-id].searchResultsItem"
    ),
  ];

  const comparables = rows
    .map((row) => {
      const title = getElementText(row, [
        ".classifiedTitle",
        "a[href*='/ilan/']",
      ]);

      const priceText = getElementText(row, [
        ".searchResultsPriceValue",
        ".classifiedPrice",
        "[data-testid='price']",
      ]);

      const locationText = getElementText(row, [
        ".searchResultsLocationValue",
        ".classifiedLocation",
        "[data-testid='location']",
      ]);

      const cells = [...row.querySelectorAll("td")].map(
        (cell) => cell.textContent?.trim() || ""
      );

      const currentYear = new Date().getFullYear();

      const attributeCells = [
        ...row.querySelectorAll(
          "td.searchResultsAttributeValue, .searchResultsAttributeValue"
        ),
      ].map((cell) => ({
        text: cell.textContent?.trim() || "",
        value: parseNumber(cell.textContent || ""),
      }));

      const sourceCells =
        attributeCells.length > 0
          ? attributeCells
          : cells.map((cell) => ({
              text: cell,
              value: parseNumber(cell),
            }));

      const yearIndex = sourceCells.findIndex(
        ({ value }) => value >= 1950 && value <= currentYear + 1
      );

      const year = yearIndex >= 0 ? sourceCells[yearIndex].value : 0;

      const cellsAfterYear =
        yearIndex >= 0
          ? sourceCells.slice(yearIndex + 1)
          : sourceCells;

      const mileage =
        cellsAfterYear.find(
          ({ text, value }) =>
            /km/i.test(text) &&
            value > currentYear + 1 &&
            value <= 2_000_000
        )?.value ||
        cellsAfterYear.find(
          ({ value }) =>
            value > currentYear + 1 &&
            value <= 2_000_000 &&
            value !== parseNumber(priceText)
        )?.value ||
        0;

      return {
        title,
        year: year || 0,
        mileage: mileage || 0,
        price: parseNumber(priceText),
        city: locationText.split("/")[0]?.trim() || "",
        url: getComparableUrl(row),
      };
    })
    .filter(
      (vehicle) =>
        vehicle.title &&
        vehicle.price > 0 &&
        vehicle.url
    );

  return comparables.slice(0, 50);
}

window.__CARVISION_COMPARABLES__ =
  extractComparableVehicles();