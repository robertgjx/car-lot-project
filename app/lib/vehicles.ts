import inventory from "@/data/inventory.json";

export type VehicleType = "Truck" | "SUV" | "Car" | "Van" | "Other";

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
  milesExempt?: boolean; // true when odometer is legally exempt (older vehicles)
  fuel: string | null;
  status: string;

  // Extended (from VIN decode)
  trim?: string | null;
  engine?: string | null;
  transmission?: string | null;
  bodyStyle?: string | null;
  doors?: number | null;
  color?: string | null;

  // Derived at runtime — do not add to JSON
  type: VehicleType;

  // Images
  image?: string;
  images?: string[];

  // Location
  location?: string | null;

  // Financing
  term?: number | null;
  fee?: number | null;
};

function deriveType(bodyStyle?: string | null): VehicleType {
  if (!bodyStyle) return "Other";
  const b = bodyStyle.toLowerCase();
  if (b.includes("pickup") || b.includes("truck")) return "Truck";
  if (b.includes("suv") || b.includes("sport utility") || b.includes("crossover")) return "SUV";
  if (b.includes("van") || b.includes("minivan")) return "Van";
  if (
    b.includes("sedan") ||
    b.includes("coupe") ||
    b.includes("hatchback") ||
    b.includes("convertible") ||
    b.includes("wagon") ||
    b.includes("saloon")
  ) return "Car";
  return "Other";
}

const PLACEHOLDER = "/cars/placeholder.jpg";

export const vehicles: Vehicle[] = (inventory as any[]).map((v) => {
  const images =
    Array.isArray(v.images) && v.images.length > 0
      ? v.images
      : v.image
      ? [v.image]
      : [PLACEHOLDER];

  // Some older vehicles have "EXPT" (exempt) instead of a numeric odometer reading.
  // Normalize here so `miles` stays number | null everywhere downstream.
  const milesExempt = typeof v.miles === "string";
  const miles = milesExempt ? null : v.miles;

  return { ...v, images, miles, milesExempt, type: deriveType(v.bodyStyle) };
});

export const getVehicleById = (id: string) => {
  const target = decodeURIComponent(id).trim();
  return vehicles.find((v) => v.id.trim() === target);
};

export const getAllVehicles = () => vehicles;