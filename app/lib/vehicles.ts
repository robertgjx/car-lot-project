import inventory from "@/data/inventory.json";

export type Vehicle = {
  id: string;
  year: number;
  make: string;
  model: string;

  price: number | null;
  miles: number | null;

  driveTrain: string | null;
  down: number | null;
  fuel: string | null;

  // ✅ Support the old single image field (some vehicles still have it)
  image?: string | null;

  // ✅ New multiple images field
  images?: string[] | null;

  status: "available" | "pending" | "sold" | string;
};

const PLACEHOLDER = "/cars/placeholder.jpg";

// ✅ Normalize so EVERY vehicle always has a usable images array
export const vehicles: Vehicle[] = (inventory as Vehicle[]).map((v) => {
  const normalizedImages =
    Array.isArray(v.images) && v.images.length > 0
      ? v.images
      : v.image
      ? [v.image]
      : [PLACEHOLDER];

  return {
    ...v,
    images: normalizedImages,
  };
});