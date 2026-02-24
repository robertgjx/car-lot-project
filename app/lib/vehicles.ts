export type Vehicle = {
  id: string;
  year: number;
  make: string;
  model: string;

  price: number | null;
  miles: number | null;

  // New sheet fields
  driveTrain: string | null;
  down: number | null;
  fuel: string | null;

  // Website fields
  image: string;
  status: "available" | "pending" | "sold" | string;
};
  
  import inventory from "@/data/inventory.json";

  export const vehicles = inventory as Vehicle[];
