import { notFound } from "next/navigation";
import { getVehicleById, getAllVehicles } from "@/app/lib/vehicles";
import VehicleDetailsClient from "./VehicleDetailsClient";

// Vehicle listings don't change often (price, photos, status) so a full day
// between regenerations is plenty. This was previously 3600 (1 hour), which
// meant every vehicle page regenerated ~24x/day. Each regeneration writes
// several cache segments (page, head, tree, etc.), so with ~150-200 vehicles
// that alone was generating tens of thousands of ISR writes per day. Bumping
// this to 24 hours cuts that by roughly 24x.
export const revalidate = 86400; // regenerate pages once a day

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