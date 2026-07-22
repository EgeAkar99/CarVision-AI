export const runtime = "nodejs";

import { analyzeVehicle } from "../../../services/ai";
import { getVehicleFromListing } from "../../../services/vehicle";
import { SahibindenClientError } from "../../../providers/sahibinden/client";
import type {
  BrowserExtensionComparableInput,
  BrowserExtensionVehicleInput,
  ManualVehicleInput,
  Vehicle,
  VehicleInput,
} from "../../../types/vehicle";
import type { ComparableVehicle } from "../../../types/analysis";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders,
  });
}

function parseNumber(value: string | number | undefined): number {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : 0;
  }

  if (!value) {
    return 0;
  }

  const normalized = value.replace(/[^\d]/g, "");

  return Number(normalized) || 0;
}

function cleanOptionalString(
  value: string | undefined
): string | undefined {
  const normalized = value?.trim();

  return normalized || undefined;
}

function validateManualVehicle(
  vehicle: ManualVehicleInput
): Vehicle {
  const brand = vehicle.brand?.trim();
  const model = vehicle.model?.trim();
  const fuel = vehicle.fuel?.trim();
  const transmission = vehicle.transmission?.trim();
  const city = vehicle.city?.trim();
  const description = vehicle.description?.trim();

  if (!brand || !model) {
    throw new Error("Marka ve model zorunludur.");
  }

  if (!Number.isInteger(vehicle.year) || vehicle.year < 1900) {
    throw new Error("Geçerli bir model yılı giriniz.");
  }

  if (!Number.isFinite(vehicle.mileage) || vehicle.mileage < 0) {
    throw new Error("Geçerli bir kilometre değeri giriniz.");
  }

  if (!fuel || !transmission) {
    throw new Error("Yakıt ve vites bilgileri zorunludur.");
  }

  if (!Number.isFinite(vehicle.price) || vehicle.price <= 0) {
    throw new Error("Geçerli bir araç fiyatı giriniz.");
  }

  if (!city) {
    throw new Error("Şehir bilgisi zorunludur.");
  }

  return {
    brand,
    model,
    year: vehicle.year,
    mileage: vehicle.mileage,
    fuel,
    transmission,
    price: vehicle.price,
    city,
    description: description || undefined,
  };
}

function validateBrowserExtensionVehicle(
  vehicle: BrowserExtensionVehicleInput
): Vehicle {
  const brand = vehicle.brand?.trim();
  const series = vehicle.series?.trim();
  const model = vehicle.model?.trim();
  const fuel = vehicle.fuel?.trim();
  const transmission = vehicle.transmission?.trim();
  const city = vehicle.city?.trim();
  const description = vehicle.description?.trim();

  const year = parseNumber(vehicle.year);
  const mileage = parseNumber(vehicle.mileage);
  const price = parseNumber(vehicle.price);

  const fullModel = [series, model]
    .filter((value): value is string => Boolean(value))
    .join(" ")
    .trim();

  if (!brand) {
    throw new Error(
      "Tarayıcı eklentisi ilandaki marka bilgisini okuyamadı."
    );
  }

  if (!fullModel) {
    throw new Error(
      "Tarayıcı eklentisi ilandaki model bilgisini okuyamadı."
    );
  }

  if (!Number.isInteger(year) || year < 1900) {
    throw new Error(
      "Tarayıcı eklentisi geçerli model yılı bilgisi okuyamadı."
    );
  }

  if (!Number.isFinite(mileage) || mileage < 0) {
    throw new Error(
      "Tarayıcı eklentisi geçerli kilometre bilgisi okuyamadı."
    );
  }

  if (!fuel) {
    throw new Error(
      "Tarayıcı eklentisi yakıt bilgisini okuyamadı."
    );
  }

  if (!transmission) {
    throw new Error(
      "Tarayıcı eklentisi vites bilgisini okuyamadı."
    );
  }

  if (!Number.isFinite(price) || price <= 0) {
    throw new Error(
      "Tarayıcı eklentisi geçerli fiyat bilgisini okuyamadı."
    );
  }

  function cleanImageArray(
    value: string[] | undefined
  ): string[] | undefined {
    if (!Array.isArray(value)) {
      return undefined;
    }

    const images = [
      ...new Set(
        value
          .filter(
            (image): image is string =>
              typeof image === "string" &&
              image.trim().length > 0
          )
          .map((image) => image.trim())
      ),
    ];

    return images.length ? images : undefined;
  }

  const images = cleanImageArray(vehicle.images);
  const thumbnailImages = cleanImageArray(
    vehicle.thumbnailImages
  );
  const interiorImages = cleanImageArray(
    vehicle.interiorImages
  );
  const exteriorImages = cleanImageArray(
    vehicle.exteriorImages
  );

  const photoCount =
    typeof vehicle.photoCount === "number" &&
    Number.isFinite(vehicle.photoCount) &&
    vehicle.photoCount >= 0
      ? Math.floor(vehicle.photoCount)
      : images?.length ?? 0;

  return {
    brand,
    model: fullModel,
    year,
    mileage,
    fuel,
    transmission,
    price,
    city: city || "Bilinmiyor",
    description: description || undefined,

    title: cleanOptionalString(vehicle.title),
    listingNumber: cleanOptionalString(vehicle.listingNumber),
    listingDate: cleanOptionalString(vehicle.listingDate),
    series: series || undefined,
    district: cleanOptionalString(vehicle.district),
    neighborhood: cleanOptionalString(vehicle.neighborhood),
    vehicleCondition: cleanOptionalString(
      vehicle.vehicleCondition
    ),
    bodyType: cleanOptionalString(vehicle.bodyType),
    enginePower: cleanOptionalString(vehicle.enginePower),
    engineVolume: cleanOptionalString(vehicle.engineVolume),
    traction: cleanOptionalString(vehicle.traction),
    color: cleanOptionalString(vehicle.color),
    warranty: cleanOptionalString(vehicle.warranty),
    heavyDamage: cleanOptionalString(vehicle.heavyDamage),
    plateNationality: cleanOptionalString(
      vehicle.plateNationality
    ),
    sellerType: cleanOptionalString(vehicle.sellerType),
    exchange: cleanOptionalString(vehicle.exchange),
    mainImage: cleanOptionalString(vehicle.mainImage),
    images,
    photoCount,
    thumbnailImages,
    interiorImages,
    exteriorImages,
    listingUrl: cleanOptionalString(vehicle.url),
  };
}


function validateBrowserExtensionComparables(
  comparables: BrowserExtensionComparableInput[] | undefined,
  vehicle: Vehicle
): ComparableVehicle[] {
  if (!Array.isArray(comparables)) {
    return [];
  }

  return comparables
    .map((comparable) => {
      const title = comparable.title?.trim() || "";
      const parsedYear = parseNumber(comparable.year);
      const parsedMileage = parseNumber(comparable.mileage);
      const price = parseNumber(comparable.price);
      const city = comparable.city?.trim() || vehicle.city;
      const url = comparable.url?.trim() || undefined;

      const currentYear = new Date().getFullYear();

      const mileageLooksLikeYear =
        parsedMileage >= 1950 &&
        parsedMileage <= currentYear + 1;

      const year =
        parsedYear >= 1950 && parsedYear <= currentYear + 1
          ? parsedYear
          : mileageLooksLikeYear
            ? parsedMileage
            : 0;

      const mileage = mileageLooksLikeYear
        ? 0
        : parsedMileage;

      return {
        title,
        brand: comparable.brand?.trim() || vehicle.brand,
        model: comparable.model?.trim() || vehicle.model,
        year,
        mileage,
        price,
        city,
        url,
      };
    })
    .filter(
      (comparable) =>
        comparable.title.length > 0 &&
        comparable.year >= 1900 &&
        comparable.mileage >= 0 &&
        comparable.price > 0
    )
    .slice(0, 50);
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as VehicleInput;

    let vehicle: Vehicle;
    let listingUrl: string | undefined;
    let comparables: ComparableVehicle[] = [];

    if (body.source === "listing") {
      listingUrl = body.listingUrl?.trim();

      if (!listingUrl) {
        return Response.json(
          {
            success: false,
            message: "İlan linki zorunludur.",
          },
          {
            status: 400,
            headers: corsHeaders,
          }
        );
      }

      vehicle = await getVehicleFromListing(listingUrl);
    } else if (body.source === "manual") {
      vehicle = validateManualVehicle(body.vehicle);
      listingUrl = body.listingUrl?.trim() || undefined;
    } else if (body.source === "browser-extension") {
      vehicle = validateBrowserExtensionVehicle(body.vehicle);
      listingUrl = body.vehicle.url?.trim() || undefined;
      comparables = validateBrowserExtensionComparables(
        body.comparables,
        vehicle
      );
    } else {
      return Response.json(
        {
          success: false,
          message: "Geçersiz analiz kaynağı.",
        },
        {
          status: 400,
          headers: corsHeaders,
        }
      );
    }

    const result = await analyzeVehicle(vehicle, comparables);

    return Response.json(
      {
        success: true,
        source: body.source,
        listingUrl,
        result,
      },
      {
        headers: corsHeaders,
      }
    );
  } catch (error) {
    if (error instanceof SahibindenClientError) {
      return Response.json(
        {
          success: false,
          code: error.code,
          message: error.message,
        },
        {
          status: error.statusCode,
          headers: corsHeaders,
        }
      );
    }

    const message =
      error instanceof Error
        ? error.message
        : "Analiz sırasında bir hata oluştu.";

    return Response.json(
      {
        success: false,
        message,
      },
      {
        status: 400,
        headers: corsHeaders,
      }
    );
  }
}