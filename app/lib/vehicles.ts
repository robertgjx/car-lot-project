export type Vehicle = {
    id: string;
    year?: number| null;
    make: string;
    model: string;
    price?: number| null;
    miles?: number| null;
    transmission: string;
    fuel: string;
    image: string; // ex: "/cars/maroon-chevy.JPG"
  };
  
  import inventory from "@/data/inventory.json";

  export const vehicles = inventory;