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
};

export type VehicleInput = {
  listingUrl?: string;
  brand?: string;
  model?: string;
  year?: number;
  mileage?: number;
  fuel?: string;
  transmission?: string;
  price?: number;
  city?: string;
  description?: string;
};