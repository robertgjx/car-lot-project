import { getVehicleById, getAllVehicles } from "@/app/lib/vehicles";
import VehicleDetailsClient from "./VehicleDetailsClient";

export const revalidate = 3600; // regenerate pages every hour

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

  return <VehicleDetailsClient vehicle={vehicle} decodedId={decodedId} />;
}