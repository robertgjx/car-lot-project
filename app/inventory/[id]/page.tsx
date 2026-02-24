import Image from "next/image";
import Link from "next/link";
import { vehicles } from "../../lib/vehicles";

function formatMoney(n: number | null | undefined) {
  if (n == null) return "N/A";
  return n.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

export default async function VehicleDetailsPage({
  params,
}: {
  // ✅ Next 15 can pass params as a Promise
  params: Promise<{ id: string }>;
}) {
  // ✅ IMPORTANT: await params
  const resolvedParams = await params;

  // ✅ Debugging
  console.log("PARAMS OBJECT:", resolvedParams);

  const rawId = resolvedParams?.id;
  console.log("RAW PARAM ID:", rawId);

  const id = decodeURIComponent(String(rawId)).trim();
  console.log("DECODED ID:", id);

  console.log("TOTAL VEHICLES:", vehicles.length);
  console.log("VEHICLE IDS:", vehicles.map((v) => String(v.id).trim()));

  const vehicle = vehicles.find((v) => {
    const vid = String(v.id).trim();
    const match = vid === id;
    console.log("CHECK:", { vid, id, match });
    return match;
  });

  console.log("FOUND VEHICLE:", vehicle);

  if (!vehicle) {
    return (
      <main className="min-h-screen bg-black text-white p-10">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold">Vehicle not found</h1>
          <p className="mt-2 text-gray-400">
            This listing may have been removed, or the ID in the URL doesn’t
            match.
          </p>

          <div className="mt-6">
            <p className="text-sm text-gray-400">Debug info:</p>
            <pre className="mt-2 p-4 bg-zinc-900 rounded-xl overflow-auto text-xs">
              {JSON.stringify(
                {
                  rawId,
                  decodedId: id,
                  totalVehicles: vehicles.length,
                  ids: vehicles.map((v) => String(v.id).trim()),
                },
                null,
                2
              )}
            </pre>
          </div>

          <Link
            href="/inventory"
            className="inline-block mt-6 rounded-xl bg-white text-black px-5 py-3 font-semibold hover:opacity-90"
          >
            Back to Inventory
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white p-6 md:p-10">
      <div className="max-w-5xl mx-auto">
        <Link href="/inventory" className="text-gray-300 hover:text-white">
          ← Back to Inventory
        </Link>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="relative w-full h-[300px] md:h-[420px] rounded-2xl overflow-hidden bg-zinc-900">
            <Image
              src={vehicle.images?.[0] ?? "/cars/placeholder.jpg"}
              alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
              fill
              className="object-cover"
              priority
            />
            {(vehicle.images?.length ?? 0) > 1 && (
  <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
    {vehicle.images!.slice(1).map((src) => (
      <div key={src} className="relative w-full h-56 rounded-2xl overflow-hidden">
        <Image src={src} alt="Vehicle photo" fill className="object-cover" />
      </div>
    ))}
  </div>
)}
          </div>

          <div className="bg-zinc-900 rounded-2xl p-6 md:p-8">
            <h1 className="text-3xl md:text-4xl font-bold">
              {vehicle.year ?? ""} {vehicle.make} {vehicle.model}
            </h1>

            <p className="mt-3 text-2xl font-semibold">
              {formatMoney(vehicle.price)}
            </p>

            <div className="mt-6 space-y-3 text-gray-200">
              <p>
                <span className="text-gray-400">Miles:</span>{" "}
                {vehicle.miles != null ? vehicle.miles.toLocaleString() : "N/A"}
              </p>
              <p>
                <span className="text-gray-400">Transmission:</span>{" "}
                {}
              </p>
              <p>
                <span className="text-gray-400">Fuel:</span> {}
              </p>
            </div>

            <div className="mt-8 border-t border-zinc-800 pt-6">
              <p className="text-gray-400 text-sm">
                Vehicle ID: <span className="text-gray-200">{vehicle.id}</span>
              </p>
              <p className="text-gray-400 text-sm mt-1">
                URL ID: <span className="text-gray-200">{id}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}