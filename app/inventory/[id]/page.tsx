import Image from "next/image";
import Link from "next/link";
import { getVehicleById } from "@/app/lib/vehicles";

function formatMoney(n: number | null | undefined) {
  if (n == null) return "N/A";
  return n.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

export default function VehicleDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  // ✅ Make sure the id matches what’s in inventory.json
  const decodedId = decodeURIComponent(params.id);

  // Try decoded first, then raw as a fallback
  const vehicle = getVehicleById(decodeURIComponent(params.id));

  if (!vehicle) {
    return (
      <main className="min-h-screen bg-black text-white p-6 md:p-10">
        <div className="max-w-5xl mx-auto">
          <Link
            href="/inventory"
            className="inline-block rounded-xl bg-zinc-800 px-5 py-3 font-semibold hover:opacity-90"
          >
            ← Back to Inventory
          </Link>

          <div className="mt-8 bg-zinc-900 rounded-2xl p-6">
            <div className="text-xl font-semibold">Vehicle not found.</div>
            <div className="mt-2 text-sm text-gray-300">
              Tried ID: <span className="font-mono">{decodedId}</span>
            </div>
          </div>
        </div>
      </main>
    );
  }

  const mainImg =
    vehicle.images?.[0] ?? (vehicle as any).image ?? "/cars/placeholder.jpg";

  const restImgs = (vehicle.images ?? []).slice(1);

  return (
    <main className="min-h-screen bg-black text-white p-6 md:p-10">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between">
          <Link
            href="/inventory"
            className="rounded-xl bg-zinc-800 px-5 py-3 font-semibold hover:opacity-90 transition"
          >
            ← Back to Inventory
          </Link>

          <div className="text-sm text-gray-300">
            Status:{" "}
            <span className="font-semibold">{vehicle.status ?? "N/A"}</span>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Main Image */}
          <div className="relative w-full h-[320px] md:h-[420px] rounded-2xl overflow-hidden bg-zinc-900">
            <Image
              src={mainImg}
              alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Details */}
          <div className="bg-zinc-900 rounded-2xl p-6 md:p-8">
            <h1 className="text-3xl md:text-4xl font-bold">
              {vehicle.year} {vehicle.make} {vehicle.model}
            </h1>

            <p className="mt-4 text-2xl font-bold">
              {formatMoney(vehicle.price)}
            </p>

            <div className="mt-6 space-y-2 text-gray-200">
              <div>
                VIN:{" "}
                <span className="text-white font-semibold">
                  {vehicle.vin ?? "N/A"}
                </span>
              </div>

              <div>
                Miles:{" "}
                <span className="text-white font-semibold">
                  {vehicle.miles != null
                    ? vehicle.miles.toLocaleString()
                    : "N/A"}
                </span>
              </div>

              <div>
                Drive Train:{" "}
                <span className="text-white font-semibold">
                  {vehicle.driveTrain ?? "N/A"}
                </span>
              </div>

              <div>
                Fuel:{" "}
                <span className="text-white font-semibold">
                  {vehicle.fuel ?? "N/A"}
                </span>
              </div>

              <div>
                Down:{" "}
                <span className="text-white font-semibold">
                  {formatMoney(vehicle.down)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Gallery */}
        {restImgs.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold">More Photos</h2>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {restImgs.map((src) => (
                <div
                  key={src}
                  className="relative w-full h-56 rounded-2xl overflow-hidden bg-zinc-900"
                >
                  <Image
                    src={src}
                    alt="Vehicle photo"
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}