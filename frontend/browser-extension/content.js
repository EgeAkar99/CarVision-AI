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

function getImageSource(element) {
  const candidates = [
    element.getAttribute("data-src"),
    element.getAttribute("data-original"),
    element.getAttribute("data-lazy"),
    element.getAttribute("src"),
    element.getAttribute("srcset"),
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

function getImages() {
  const urls = new Set();

  const elements = document.querySelectorAll(
    "#showcaseDetailMainImage, " +
      ".classifiedDetailMainPhoto img, " +
      ".classifiedDetailMainPhoto source, " +
      ".classifiedDetailPhotos img, " +
      ".classifiedDetailPhotos source, " +
      ".classifiedDetailThumbList img, " +
      ".classifiedDetailThumbList source, " +
      ".classifiedDetailThumbList a, " +
      "ul[class*='thumb'] img, " +
      "ul[class*='gallery'] img, " +
      "[data-testid='gallery'] img, " +
      "[data-testid='gallery'] source"
  );

  for (const element of elements) {
    const source = getImageSource(element);

    if (source) {
      urls.add(source);
    }

    const href = normalizeImageUrl(
      element.getAttribute("href") || ""
    );

    if (href && /\.(jpg|jpeg|png|webp)(\?|$)/i.test(href)) {
      urls.add(href);
    }
  }

  const mainImage = getMainImage();

  if (mainImage) {
    urls.add(mainImage);
  }

  return [...urls].slice(0, 30);
}

const locationData = getLocationParts();
const allImages = getImages();

const interiorImages = allImages.filter((url) =>
  /interior|kabin|kokpit|torpido|direksiyon|koltuk|vites/i.test(url)
);

const exteriorImages = allImages.filter(
  (url) => !interiorImages.includes(url)
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
