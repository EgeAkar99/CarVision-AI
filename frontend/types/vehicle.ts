export type Vehicle = {
  brand: string;
  model: string;
  year: number;
  mileage: number;
  fuel: string;
  transmission: string;
  price: number;
  city: string;
  description?: string;

  title?: string;
  listingNumber?: string;
  listingDate?: string;
  series?: string;
  district?: string;
  neighborhood?: string;
  vehicleCondition?: string;
  bodyType?: string;
  enginePower?: string;
  engineVolume?: string;
  traction?: string;
  color?: string;
  warranty?: string;
  heavyDamage?: string;
  plateNationality?: string;
  sellerType?: string;
  exchange?: string;

  mainImage?: string;
  images?: string[];

  photoCount?: number;

  thumbnailImages?: string[];

  interiorImages?: string[];

  exteriorImages?: string[];

  listingUrl?: string;
};

export type ManualVehicleInput = {
  brand: string;
  model: string;
  year: number;
  mileage: number;
  fuel: string;
  transmission: string;
  price: number;
  city: string;
  description?: string;
};

export type BrowserExtensionVehicleInput = {
  title?: string;
  listingNumber?: string;
  listingDate?: string;
  brand?: string;
  series?: string;
  model?: string;
  year?: string | number;
  mileage?: string | number;
  fuel?: string;
  transmission?: string;
  price?: string | number;
  city?: string;
  district?: string;
  neighborhood?: string;
  description?: string;
  vehicleCondition?: string;
  bodyType?: string;
  enginePower?: string;
  engineVolume?: string;
  traction?: string;
  color?: string;
  warranty?: string;
  heavyDamage?: string;
  plateNationality?: string;
  sellerType?: string;
  exchange?: string;

  mainImage?: string;
  images?: string[];

  photoCount?: number;

  thumbnailImages?: string[];

  interiorImages?: string[];

  exteriorImages?: string[];

  url?: string;
};

export type BrowserExtensionComparableInput = {
  title?: string;
  brand?: string;
  model?: string;
  year?: string | number;
  mileage?: string | number;
  price?: string | number;
  city?: string;
  url?: string;
};

export type VehicleInput =
  | {
      source: "listing";
      listingUrl: string;
    }
  | {
      source: "manual";
      vehicle: ManualVehicleInput;
      listingUrl?: string;
    }
  | {
      source: "browser-extension";
      vehicle: BrowserExtensionVehicleInput;
      comparables?: BrowserExtensionComparableInput[];
    };