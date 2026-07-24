function getText(selector) {
  const element = document.querySelector(selector);

  if (!element) {
    return "";
  }

  return element.textContent?.trim() || "";
}

function normalizeLabel(value) {
  return value
    .replace(/\s+/g, " ")
    .replace(/:$/, "")
    .trim();
}

function getAttribute(label) {
  const normalizedTarget = normalizeLabel(label);

  const rows = [
    ...document.querySelectorAll(
      ".classifiedInfoList li, .classifiedInfo li, li"
    ),
  ];

  for (const row of rows) {
    const strong = row.querySelector("strong");
    const spans = row.querySelectorAll("span");

    if (!strong) {
      continue;
    }

    const rowLabel = normalizeLabel(
      strong.textContent || ""
    );

    if (rowLabel !== normalizedTarget) {
      continue;
    }

    for (const span of spans) {
      const value = span.textContent?.trim();

      if (value) {
        return value;
      }
    }

    const rowText = row.textContent
      ?.replace(strong.textContent || "", "")
      .trim();

    if (rowText) {
      return rowText;
    }
  }

  return "";
}

function getLocationParts() {
  const locationText =
    getText(".classifiedInfo h2") ||
    getText(".classifiedInfo .classifiedInfoLocation") ||
    getText("[data-testid='location']");

  const parts = locationText
    .split("/")
    .map((part) => part.trim())
    .filter(Boolean);

  return {
    city: parts[0] || "",
    district: parts[1] || "",
    neighborhood: parts[2] || "",
  };
}

function normalizeImageUrl(value) {
  if (!value) {
    return "";
  }

  const candidate = value
    .split(",")[0]
    .trim()
    .split(/\s+/)[0];

  if (!candidate) {
    return "";
  }

  try {
    return new URL(candidate, location.href).href;
  } catch {
    return "";
  }
}

function normalizePhotoKey(url) {
  try {
    const parsed = new URL(url);
    const name = parsed.pathname
      .split("/")
      .pop()
      ?.replace(/_(?:small|medium|large|thumb|thumbnail|[0-9]+x[0-9]+)(?=\.)/gi, "")
      .toLowerCase();

    return name || parsed.pathname.toLowerCase();
  } catch {
    return url.toLowerCase();
  }
}

function getImageSource(element) {
  const candidates = [
    element.getAttribute("data-src"),
    element.getAttribute("data-original"),
    element.getAttribute("data-lazy"),
    element.getAttribute("src"),
    element.getAttribute("srcset")?.split(",")[0]?.trim()?.split(" ")[0],
  ];

  for (const candidate of candidates) {
    const url = normalizeImageUrl(candidate || "");

    if (
      url &&
      !url.startsWith("data:") &&
      !url.includes("placeholder")
    ) {
      return url;
    }
  }

  return "";
}

function getMainImage() {
  const selectors = [
    "#showcaseDetailMainImage",
    ".classifiedDetailMainPhoto img",
    ".classifiedDetailMainPhoto source",
    ".classifiedDetailMainPhoto",
    "[data-testid='main-image'] img",
  ];

  for (const selector of selectors) {
    const element = document.querySelector(selector);

    if (!element) {
      continue;
    }

    const source = getImageSource(element);

    if (source) {
      return source;
    }
  }

  return "";
}

function upgradeImageUrl(url) {
  return url
    .replace(/\/thmb_/i, "/x5_")
    .replace(/\/(?:x1|x2|x3|x4)_/i, "/x5_");
}

function getImages() {
  const urls = new Set();

  const links = document.querySelectorAll(
    ".classifiedDetailThumbList a[href]"
  );

  for (const link of links) {
    const image = link.querySelector("img");

    const href = normalizeImageUrl(
      link.getAttribute("href") || ""
    );

    const source = image
      ? getImageSource(image)
      : "";

    const selected =
      [
        link.getAttribute("data-original"),
        link.getAttribute("data-src"),
        link.getAttribute("data-image"),
        link.getAttribute("data-large"),
        href,
        source,
      ]
        .map((value) => normalizeImageUrl(value || ""))
        .find((value) =>
          /\.(jpg|jpeg|png|webp)(\?|$)/i.test(value)
        ) || "";

    if (selected) {
      urls.add(
        selected
          .replace("/thmb_", "/x5_")
          .replace("/x1_", "/x5_")
          .replace("/x2_", "/x5_")
          .replace("/x3_", "/x5_")
          .replace("/x4_", "/x5_")
      );
    }
  }

  if (urls.size === 0) {
    const images = document.querySelectorAll(
      ".classifiedDetailThumbList img"
    );

    for (const image of images) {
      const source = getImageSource(image);

      if (source) {
        urls.add(source);
      }
    }
  }

  const mainImage = getMainImage();

  if (urls.size === 0 && mainImage) {
    urls.add(mainImage);
  }

  return [...urls];
}

function isInteriorImage(url) {
  const keywords =
    /interior|iç\s*mek[aâ]n|kabin|kokpit|cockpit|dashboard|torpido|direksiyon|steering|koltuk|seat|vites|console|konsol|pedal/i;

  if (keywords.test(url)) {
    return true;
  }

  const elements = document.querySelectorAll(
    "img, source, a[href]"
  );

  for (const element of elements) {
    const source =
      getImageSource(element) ||
      normalizeImageUrl(
        element.getAttribute("href") || ""
      );

    if (!source || source !== url) {
      continue;
    }

    const context = [
      element.getAttribute("alt"),
      element.getAttribute("title"),
      element.getAttribute("aria-label"),
      element.getAttribute("data-title"),
      element.getAttribute("data-caption"),
      element.closest("li, a, figure, div")
        ?.textContent,
    ]
      .filter(Boolean)
      .join(" ");

    if (keywords.test(context)) {
      return true;
    }
  }

  return false;
}

const locationData = getLocationParts();
const allImages = getImages();

const interiorImages = allImages.filter(isInteriorImage);

const exteriorImages = allImages.filter((url) =>
  /exterior|dis|ön|on|arka|yan|front|rear|side|outside/i.test(url)
);

const vehicle = {
  url: location.href,

  title:
    getText("h1") ||
    document.title,

  listingNumber:
    getAttribute("İlan No"),

  listingDate:
    getAttribute("İlan Tarihi"),

  price:
    getText('[data-testid="price"]') ||
    getText(".classifiedInfo h3"),

  brand:
    getAttribute("Marka"),

  series:
    getAttribute("Seri"),

  model:
    getAttribute("Model"),

  year:
    getAttribute("Yıl"),

  mileage:
    getAttribute("KM") ||
    getAttribute("Kilometre"),

  fuel:
    getAttribute("Yakıt") ||
    getAttribute("Yakıt Tipi"),

  transmission:
    getAttribute("Vites") ||
    getAttribute("Vites Tipi"),

  vehicleCondition:
    getAttribute("Araç Durumu"),

  bodyType:
    getAttribute("Kasa Tipi"),

  enginePower:
    getAttribute("Motor Gücü"),

  engineVolume:
    getAttribute("Motor Hacmi"),

  traction:
    getAttribute("Çekiş"),

  color:
    getAttribute("Renk"),

  warranty:
    getAttribute("Garanti"),

  heavyDamage:
    getAttribute("Ağır Hasar Kayıtlı"),

  plateNationality:
    getAttribute("Plaka / Uyruk"),

  sellerType:
    getAttribute("Kimden"),

  exchange:
    getAttribute("Takas"),

  city:
    locationData.city ||
    getAttribute("İl") ||
    getAttribute("Şehir"),

  district:
    locationData.district,

  neighborhood:
    locationData.neighborhood,

  description:
    getText("#classifiedDescription") ||
    getText(".classifiedDescription"),

  mainImage:
    getMainImage(),

  images:
    allImages,

  photoCount:
    allImages.length,

  thumbnailImages:
    allImages.slice(0, 8),

  interiorImages,

  exteriorImages,
};

window.__CARVISION_DATA__ = vehicle;

console.log("CarVision AI vehicle data:", vehicle);
chrome.runtime.onMessage.addListener(
  (message, _sender, sendResponse) => {
    if (message?.type !== "CARVISION_GET_PAGE_DATA") {
      return;
    }

    const comparables = Array.isArray(
      window.__CARVISION_COMPARABLES__
    )
      ? window.__CARVISION_COMPARABLES__
      : [];

    sendResponse({
      vehicle: window.__CARVISION_DATA__ || null,
      comparables,
    });
  }
);
