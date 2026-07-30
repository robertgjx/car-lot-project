import { notFound } from "next/navigation";
import { getVehicleById, getAllVehicles } from "@/app/lib/vehicles";
import VehicleDetailsClient from "./VehicleDetailsClient";

export const revalidate = 3600; // regenerate pages every hour

// Any id NOT returned by generateStaticParams below will 404 instead of
// being generated + written to the ISR cache on demand. This is what stops
// bots/crawlers probing random or sequential ids from burning ISR writes.
export const dynamicParams = false;

export async function generateStaticParams() {
  return getAllVehicles().map((v) => ({ id: v.id }));
}

export default async function VehicleDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const decodedId = decodeURIComponent(id);
  const vehicle = getVehicleById(decodedId);

  if (!vehicle) {
    notFound();
  }

  return <VehicleDetailsClient vehicle={vehicle} decodedId={decodedId} />;
}