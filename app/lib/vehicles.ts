import inventory from "@/data/inventory.json";

export type Vehicle = {
  id: string;
  year: number;
  make: string;
  model: string;

  // Core
  driveTrain: string | null;
  price: number | null;
  down: number | null;
  vin: string | null;
  miles: number | null;
  fuel: string | null;
  status: string;

  // Extended (from VIN decode)
  trim?: string | null;
  engine?: string | null;
  transmission?: string | null;
  bodyStyle?: string | null;
  doors?: number | null;
  color?: string | null;

  // Legacy image field
  image?: string;

  // Images
  images?: string[];
};

const PLACEHOLDER = "/cars/placeholder.jpg";

export const vehicles: Vehicle[] = (inventory as Vehicle[]).map((v) => {
  const images =
    Array.isArray(v.images) && v.images.length > 0
      ? v.images
      : v.image
      ? [v.image]
      : [PLACEHOLDER];

  return { ...v, images };
});

export const getVehicleById = (id: string) => {
  const target = decodeURIComponent(id).trim();
  return vehicles.find((v) => v.id.trim() === target);
};