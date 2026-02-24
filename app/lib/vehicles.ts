import inventory from "@/data/inventory.json";

export type Vehicle = {
  id: string;
  year: number;
  make: string;
  model: string;

  driveTrain: string | null;
  price: number | null;
  down: number | null;
  vin: string | null;
  miles: number | null;
  fuel: string | null;

  // old field
  image?: string;

  // new field
  images?: string[];

  status: string;
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

export const getVehicleById = (id: string) =>
  vehicles.find((v) => v.id === id);