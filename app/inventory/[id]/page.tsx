import { getVehicleById } from "@/app/lib/vehicles";
import VehicleDetailsClient from "./VehicleDetailsClient";

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
