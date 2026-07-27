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

    const fileName = parsed.pathname
      .split("/")
      .pop()
      ?.replace(
        /_(?:small|medium|large|thumb|thumbnail|[0-9]+x[0-9]+)(?=\.)/gi,
        ""
      )
      .replace(
        /^(?:thmb|x1|x2|x3|x4|x5)_/i,
        ""
      )
      .toLowerCase();

    return fileName || parsed.pathname.toLowerCase();
  } catch {
    return url.toLowerCase();
  }
}

function getImageSource(element) {
  const candidates = [
    element.getAttribute("data-src"),
    element.getAttribute("data-original"),
    element.getAttribute("data-lazy"),
    element.getAttribute("data-image"),
    element.getAttribute("data-large"),
    element.getAttribute("src"),
    element
      .getAttribute("srcset")
      ?.split(",")[0]
      ?.trim()
      ?.split(" ")[0],
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

function upgradeImageUrl(url) {
  return url
    .replace(/\/thmb_/i, "/x5_")
    .replace(/\/(?:x1|x2|x3|x4)_/i, "/x5_");
}

function isValidVehicleImage(url) {
  return (
    /\.(jpg|jpeg|png|webp)(\?|$)/i.test(url) &&
    !/logo|icon|sprite|avatar|banner|placeholder|loading/i.test(url)
  );
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
      return upgradeImageUrl(source);
    }

    const backgroundImage =
      window.getComputedStyle(element).backgroundImage;

    const backgroundMatch = backgroundImage?.match(
      /url\(["']?(.*?)["']?\)/
    );

    if (backgroundMatch?.[1]) {
      return upgradeImageUrl(
        normalizeImageUrl(backgroundMatch[1])
      );
    }
  }

  return "";
}

function getImages() {
  const imageMap = new Map();

  function addImage(value) {
    const normalized = normalizeImageUrl(value || "");

    if (!normalized) {
      return;
    }

    const upgraded = upgradeImageUrl(normalized);

    if (!isValidVehicleImage(upgraded)) {
      return;
    }

    const key = normalizePhotoKey(upgraded);

    if (!imageMap.has(key)) {
      imageMap.set(key, upgraded);
    }
  }

  const thumbnailLinks = document.querySelectorAll(
    ".classifiedDetailThumbList a"
  );

  for (const link of thumbnailLinks) {
    const image = link.querySelector("img, source");

    const candidates = [
      link.getAttribute("href"),
      link.getAttribute("data-original"),
      link.getAttribute("data-src"),
      link.getAttribute("data-image"),
      link.getAttribute("data-large"),
      image ? getImageSource(image) : "",
    ];

    for (const candidate of candidates) {
      addImage(candidate);
    }
  }

  const thumbnailImages = document.querySelectorAll(
    ".classifiedDetailThumbList img, .classifiedDetailThumbList source"
  );

  for (const image of thumbnailImages) {
    addImage(getImageSource(image));
  }

  if (imageMap.size === 0) {
    const galleryImages = document.querySelectorAll(
      ".classifiedDetailMainPhoto img, .classifiedDetailMainPhoto source, [data-testid='gallery'] img"
    );

    for (const image of galleryImages) {
      addImage(getImageSource(image));
    }
  }

  const mainImage = getMainImage();

  if (mainImage) {
    const mainKey = normalizePhotoKey(mainImage);

    if (!imageMap.has(mainKey)) {
      imageMap.set(mainKey, mainImage);
    }
  }

  return [...imageMap.values()].slice(0, 30);
}

function getImageContext(url) {
  const contextParts = [];
  const normalizedTarget = normalizePhotoKey(url);

  const elements = document.querySelectorAll(
    ".classifiedDetailThumbList a, .classifiedDetailThumbList img, img, source, figure"
  );

  for (const element of elements) {
    const candidates = [
      getImageSource(element),
      normalizeImageUrl(
        element.getAttribute("href") || ""
      ),
      normalizeImageUrl(
        element.getAttribute("data-src") || ""
      ),
      normalizeImageUrl(
        element.getAttribute("data-original") || ""
      ),
      normalizeImageUrl(
        element.getAttribute("data-image") || ""
      ),
      normalizeImageUrl(
        element.getAttribute("data-large") || ""
      ),
    ].filter(Boolean);

    const matches = candidates.some(
      (candidate) =>
        normalizePhotoKey(candidate) === normalizedTarget
    );

    if (!matches) {
      continue;
    }

    const closestContainer = element.closest(
      "li, a, figure, .classifiedDetailThumb"
    );

    contextParts.push(
      element.getAttribute("alt") || "",
      element.getAttribute("title") || "",
      element.getAttribute("aria-label") || "",
      element.getAttribute("data-title") || "",
      element.getAttribute("data-caption") || "",
      element.getAttribute("data-category") || "",
      closestContainer?.getAttribute("title") || "",
      closestContainer?.getAttribute("aria-label") || "",
      closestContainer?.textContent || ""
    );
  }

  return contextParts
    .filter(Boolean)
    .join(" ")
    .replace(/\s+/g, " ")
    .toLocaleLowerCase("tr-TR");
}

function isInteriorImage(url) {
  const context =
    `${url} ${getImageContext(url)}`.toLocaleLowerCase(
      "tr-TR"
    );

  const interiorKeywords =
    /interior|iç\s*mek[aâ]n|iç\s*görünüm|kabin|kokpit|cockpit|dashboard|torpido|direksiyon|steering|koltuk|seat|vites|gear|konsol|console|pedal|multimedya|gösterge|gosterge|ön\s*panel|on\s*panel|arka\s*koltuk|kapı\s*içi|kapi\s*ici|tavan\s*döşeme|tavan\s*doseme|döşeme|doseme|iç\s*dizayn|ic\s*dizayn/i;

  return interiorKeywords.test(context);
}

function isExteriorImage(url) {
  const context =
    `${url} ${getImageContext(url)}`.toLocaleLowerCase(
      "tr-TR"
    );

  const exteriorKeywords =
    /exterior|outside|dış\s*görünüm|dis\s*gorunum|ön\s*görünüm|on\s*gorunum|arka\s*görünüm|arka\s*gorunum|sağ\s*yan|sag\s*yan|sol\s*yan|front|rear|side|kaput|tampon|çamurluk|camurluk|jant|lastik|far|stop|ızgara|izgara|tavan|motor\s*bölümü|motor\s*bolumu/i;

  return exteriorKeywords.test(context);
}

function classifyImages(images) {
  const explicitInterior = images.filter(
    isInteriorImage
  );

  const explicitExterior = images.filter(
    (url) =>
      !isInteriorImage(url) && isExteriorImage(url)
  );

  let interiorImages = [...explicitInterior];

  if (
    interiorImages.length === 0 &&
    images.length >= 8
  ) {
    const fallbackStart = Math.max(
      4,
      Math.floor(images.length * 0.6)
    );

    interiorImages = images.slice(fallbackStart);
  }

  const interiorKeys = new Set(
    interiorImages.map(normalizePhotoKey)
  );

  let exteriorImages = images.filter(
    (url) =>
      !interiorKeys.has(normalizePhotoKey(url))
  );

  if (explicitExterior.length > 0) {
    const explicitExteriorKeys = new Set(
      explicitExterior.map(normalizePhotoKey)
    );

    const remainingUnclassified = images.filter(
      (url) =>
        !interiorKeys.has(normalizePhotoKey(url)) &&
        !explicitExteriorKeys.has(normalizePhotoKey(url))
    );

    exteriorImages = [
      ...explicitExterior,
      ...remainingUnclassified,
    ];
  }

  return {
    interiorImages,
    exteriorImages,
  };
}

const locationData = getLocationParts();
const allImages = getImages();

const {
  interiorImages,
  exteriorImages,
} = classifyImages(allImages);

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

console.log(
  "CarVision AI vehicle data:",
  vehicle
);

chrome.runtime.onMessage.addListener(
  (message, _sender, sendResponse) => {
    if (
      message?.type !==
      "CARVISION_GET_PAGE_DATA"
    ) {
      return;
    }

    const comparables = Array.isArray(
      window.__CARVISION_COMPARABLES__
    )
      ? window.__CARVISION_COMPARABLES__
      : [];

    sendResponse({
      vehicle:
        window.__CARVISION_DATA__ || null,
      comparables,
    });
  }
);