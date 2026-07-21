import type { Vehicle } from "../../types/vehicle";

type JsonLdProduct = {
  name?: string;
  description?: string;
  brand?: {
    name?: string;
  };
  offers?: {
    price?: string | number;
    priceCurrency?: string;
  };
};

function decodeHtml(value: string): string {
  return value
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'")
    .replaceAll("&amp;", "&")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&nbsp;", " ")
    .trim();
}

function stripHtml(value: string): string {
  return decodeHtml(
    value
      .replace(/<script[\s\S]*?<\/script>/gi, "")
      .replace(/<style[\s\S]*?<\/style>/gi, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
  );
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function getMetaContent(
  html: string,
  property: string
): string | undefined {
  const escapedProperty = escapeRegex(property);

  const patterns = [
    new RegExp(
      `<meta[^>]+property=["']${escapedProperty}["'][^>]+content=["']([^"']*)["'][^>]*>`,
      "i"
    ),
    new RegExp(
      `<meta[^>]+content=["']([^"']*)["'][^>]+property=["']${escapedProperty}["'][^>]*>`,
      "i"
    ),
    new RegExp(
      `<meta[^>]+name=["']${escapedProperty}["'][^>]+content=["']([^"']*)["'][^>]*>`,
      "i"
    ),
    new RegExp(
      `<meta[^>]+content=["']([^"']*)["'][^>]+name=["']${escapedProperty}["'][^>]*>`,
      "i"
    ),
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern);

    if (match?.[1]) {
      return decodeHtml(match[1]);
    }
  }

  return undefined;
}

function isJsonLdProduct(value: unknown): value is JsonLdProduct {
  if (!value || typeof value !== "object") {
    return false;
  }

  const entry = value as Record<string, unknown>;

  return (
    "offers" in entry ||
    "brand" in entry ||
    "name" in entry
  );
}

function getJsonLd(html: string): JsonLdProduct | undefined {
  const matches = html.matchAll(
    /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi
  );

  for (const match of matches) {
    try {
      const parsed: unknown = JSON.parse(match[1].trim());

      let entries: unknown[] = [];

      if (Array.isArray(parsed)) {
        entries = parsed;
      } else if (parsed && typeof parsed === "object") {
        const object = parsed as Record<string, unknown>;

        if (Array.isArray(object["@graph"])) {
          entries = object["@graph"];
        } else {
          entries = [parsed];
        }
      }

      const product = entries.find(isJsonLdProduct);

      if (product) {
        return product;
      }
    } catch {
      continue;
    }
  }

  return undefined;
}

function parsePrice(value?: string | number): number {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : 0;
  }

  if (!value) {
    return 0;
  }

  const normalized = value.replace(/[^\d]/g, "");

  return Number(normalized) || 0;
}

function parseNumericValue(value?: string): number {
  if (!value) {
    return 0;
  }

  const normalized = value.replace(/[^\d]/g, "");

  return Number(normalized) || 0;
}

function extractYear(text: string): number {
  const match = text.match(/\b(19|20)\d{2}\b/);

  return match ? Number(match[0]) : 0;
}

function extractMileage(text: string): number {
  const match = text.match(
    /([\d.,]+)\s*(?:km|kilometre)\b/i
  );

  return match ? parseNumericValue(match[1]) : 0;
}

function extractProperty(
  html: string,
  label: string
): string | undefined {
  const escapedLabel = escapeRegex(label);

  const patterns = [
    new RegExp(
      `<li[^>]*>[\\s\\S]{0,300}?<strong[^>]*>\\s*${escapedLabel}\\s*:?\\s*<\\/strong>[\\s\\S]{0,100}?<span[^>]*>([\\s\\S]*?)<\\/span>[\\s\\S]*?<\\/li>`,
      "i"
    ),
    new RegExp(
      `<li[^>]*>[\\s\\S]{0,300}?<span[^>]*>\\s*${escapedLabel}\\s*:?\\s*<\\/span>[\\s\\S]{0,100}?<span[^>]*>([\\s\\S]*?)<\\/span>[\\s\\S]*?<\\/li>`,
      "i"
    ),
    new RegExp(
      `<th[^>]*>\\s*${escapedLabel}\\s*:?\\s*<\\/th>[\\s\\S]{0,100}?<td[^>]*>([\\s\\S]*?)<\\/td>`,
      "i"
    ),
    new RegExp(
      `<dt[^>]*>\\s*${escapedLabel}\\s*:?\\s*<\\/dt>[\\s\\S]{0,100}?<dd[^>]*>([\\s\\S]*?)<\\/dd>`,
      "i"
    ),
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern);

    if (!match?.[1]) {
      continue;
    }

    const value = stripHtml(match[1]);

    if (value) {
      return value;
    }
  }

  return undefined;
}

function extractCity(html: string): string {
  const propertyCity =
    extractProperty(html, "İl") ??
    extractProperty(html, "Şehir");

  if (propertyCity) {
    return propertyCity;
  }

  const locationMatch = html.match(
    /<div[^>]+class=["'][^"']*(?:classifiedInfo|location)[^"']*["'][^>]*>([\s\S]*?)<\/div>/i
  );

  if (locationMatch?.[1]) {
    const location = stripHtml(locationMatch[1])
      .split(/[\/,-]/)[0]
      ?.trim();

    if (location) {
      return location;
    }
  }

  return "Bilinmiyor";
}

function cleanTitle(title: string): string {
  return title
    .replace(/\s*-\s*sahibinden\.com.*$/i, "")
    .replace(/\s*\|\s*sahibinden\.com.*$/i, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function parseSahibindenListing(
  html: string
): Vehicle {
  if (!html.trim()) {
    throw new Error("İlan HTML içeriği boş.");
  }

  const jsonLd = getJsonLd(html);

  const rawTitle =
    jsonLd?.name ??
    getMetaContent(html, "og:title") ??
    getMetaContent(html, "twitter:title") ??
    getMetaContent(html, "title");

  const description =
    jsonLd?.description ??
    getMetaContent(html, "og:description") ??
    getMetaContent(html, "description");

  const title = rawTitle ? cleanTitle(rawTitle) : undefined;

  if (!title) {
    throw new Error(
      "İlan başlığı HTML içinden çıkarılamadı."
    );
  }

  const price =
    parsePrice(jsonLd?.offers?.price) ||
    parsePrice(
      getMetaContent(html, "product:price:amount")
    ) ||
    parsePrice(extractProperty(html, "Fiyat"));

  const titleParts = title.split(/\s+/);

  const brand =
    jsonLd?.brand?.name ??
    extractProperty(html, "Marka") ??
    titleParts[0] ??
    "Bilinmiyor";

  const year =
    parseNumericValue(extractProperty(html, "Yıl")) ||
    extractYear(title);

  const mileage =
    parseNumericValue(extractProperty(html, "KM")) ||
    parseNumericValue(
      extractProperty(html, "Kilometre")
    ) ||
    extractMileage(`${title} ${description ?? ""}`);

  const explicitModel =
    extractProperty(html, "Model") ??
    extractProperty(html, "Seri");

  const modelFromTitle = title
    .replace(
      new RegExp(`\\b${escapeRegex(brand)}\\b`, "i"),
      ""
    )
    .replace(
      year > 0
        ? new RegExp(`\\b${year}\\b`, "g")
        : /$^/,
      ""
    )
    .replace(/\s+/g, " ")
    .trim();

  return {
    brand,
    model:
      explicitModel ??
      modelFromTitle ??
      "Bilinmiyor",
    year,
    mileage,
    fuel:
      extractProperty(html, "Yakıt") ??
      extractProperty(html, "Yakıt Tipi") ??
      "Bilinmiyor",
    transmission:
      extractProperty(html, "Vites") ??
      extractProperty(html, "Vites Tipi") ??
      "Bilinmiyor",
    price,
    city: extractCity(html),
    description,
  };
}