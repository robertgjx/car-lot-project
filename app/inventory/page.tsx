"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { vehicles } from "../lib/vehicles";

function formatMoney(n: number | null | undefined) {
  if (n == null) return "N/A";
  return n.toLocaleString("en-US", { style: "currency", currency: "USD" });
}
const fullYear = (year?: number | null) => {
  if (!year) return "";
  if (year < 100) {
    return year >= 90 ? 1900 + year : 2000 + year;
  }
  return year;
};

type SortOption =
  | "default"
  | "price-asc"
  | "price-desc"
  | "miles-asc"
  | "miles-desc"
  | "year-desc"
  | "year-asc";

export default function InventoryPage() {
  const [query, setQuery] = useState("");
  const [make, setMake] = useState("all");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sort, setSort] = useState<SortOption>("default");

  const makes = useMemo(() => {
    const unique = Array.from(new Set(vehicles.map((v) => v.make))).sort();
    return unique;
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const min = minPrice.trim() === "" ? null : Number(minPrice);
    const max = maxPrice.trim() === "" ? null : Number(maxPrice);

    let list = vehicles.filter((v) => {
      // search match
      const haystack = `${v.year ?? ""} ${v.make ?? ""} ${v.model ?? ""}`.toLowerCase();
      const matchesQuery = q === "" ? true : haystack.includes(q);

      // make match
      const matchesMake = make === "all" ? true : v.make === make;

      // price match
      const price = v.price ?? null;

      const matchesMin = min === null ? true : price !== null && price >= min;
      const matchesMax = max === null ? true : price !== null && price <= max;

      return matchesQuery && matchesMake && matchesMin && matchesMax;
    });

    // sort
    const sorters: Record<SortOption, (a: typeof vehicles[number], b: typeof vehicles[number]) => number> =
      {
        default: () => 0,
        "price-asc": (a, b) => (a.price ?? Number.POSITIVE_INFINITY) - (b.price ?? Number.POSITIVE_INFINITY),
        "price-desc": (a, b) => (b.price ?? -1) - (a.price ?? -1),
        "miles-asc": (a, b) => (a.miles ?? Number.POSITIVE_INFINITY) - (b.miles ?? Number.POSITIVE_INFINITY),
        "miles-desc": (a, b) => (b.miles ?? -1) - (a.miles ?? -1),
        "year-desc": (a, b) => (b.year ?? -1) - (a.year ?? -1),
        "year-asc": (a, b) => (a.year ?? Number.POSITIVE_INFINITY) - (b.year ?? Number.POSITIVE_INFINITY),
      };

    if (sort !== "default") {
      list = [...list].sort(sorters[sort]);
    }

    return list;
  }, [query, make, minPrice, maxPrice, sort]);

  return (
    <main className="min-h-screen bg-black text-white p-6 md:p-10">
      <div className="max-w-6xl mx-auto">
        {/* Top Navigation */}
<div className="flex items-center justify-between">
  <h1 className="text-4xl font-bold">Inventory</h1>

  <Link
    href="/"
    className="rounded-xl bg-zinc-800 px-5 py-3 font-semibold hover:opacity-90 transition"
  >
    ← Back Home
  </Link>
</div>

<p className="mt-2 text-gray-400">
  Search and filter vehicles, then tap View Details.
</p>

        {/* Filters Bar */}
        <div className="mt-6 bg-zinc-900 rounded-2xl p-4 md:p-5">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            {/* Search */}
            <div className="md:col-span-2">
              <label className="text-xs text-gray-400">Search</label>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search year, make, model..."
                className="mt-1 w-full rounded-xl bg-black border border-zinc-800 px-4 py-3 text-white outline-none focus:border-zinc-600"
              />
            </div>

            {/* Make */}
            <div>
              <label className="text-xs text-gray-400">Make</label>
              <select
                value={make}
                onChange={(e) => setMake(e.target.value)}
                className="mt-1 w-full rounded-xl bg-black border border-zinc-800 px-4 py-3 text-white outline-none focus:border-zinc-600"
              >
                <option value="all">All</option>
                {makes.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div>
              <label className="text-xs text-gray-400">Sort</label>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortOption)}
                className="mt-1 w-full rounded-xl bg-black border border-zinc-800 px-4 py-3 text-white outline-none focus:border-zinc-600"
              >
                <option value="default">Default</option>
                <option value="price-asc">Price: Low → High</option>
                <option value="price-desc">Price: High → Low</option>
                <option value="miles-asc">Miles: Low → High</option>
                <option value="miles-desc">Miles: High → Low</option>
                <option value="year-desc">Year: New → Old</option>
                <option value="year-asc">Year: Old → New</option>
              </select>
            </div>

            {/* Price range */}
            <div>
              <label className="text-xs text-gray-400">Min Price</label>
              <input
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                inputMode="numeric"
                placeholder="0"
                className="mt-1 w-full rounded-xl bg-black border border-zinc-800 px-4 py-3 text-white outline-none focus:border-zinc-600"
              />
            </div>

            <div>
              <label className="text-xs text-gray-400">Max Price</label>
              <input
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                inputMode="numeric"
                placeholder="20000"
                className="mt-1 w-full rounded-xl bg-black border border-zinc-800 px-4 py-3 text-white outline-none focus:border-zinc-600"
              />
            </div>

            {/* Buttons */}
            <div className="md:col-span-2 flex items-end gap-3">
              <button
                onClick={() => {
                  setQuery("");
                  setMake("all");
                  setMinPrice("");
                  setMaxPrice("");
                  setSort("default");
                }}
                className="w-full rounded-xl bg-zinc-800 px-5 py-3 font-semibold hover:opacity-90"
              >
                Reset
              </button>

              <div className="w-full text-sm text-gray-300">
                <div className="bg-black border border-zinc-800 rounded-xl px-4 py-3">
                  Showing <span className="font-semibold">{filtered.length}</span>{" "}
                  of <span className="font-semibold">{vehicles.length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Vehicle Grid */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((vehicle) => (
            <div
              key={vehicle.id}
              className="bg-zinc-900 rounded-2xl overflow-hidden shadow-lg"
            >
              <div className="relative w-full h-52 bg-zinc-800">
              <Image
              src={vehicle.image || "/cars/placeholder.jpg"}
              alt={`${fullYear(vehicle.year)} ${vehicle.make} ${vehicle.model}`}
              fill
              className="object-cover"
              onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = "/cars/placeholder.jpg";
               }}
              />
              </div>

              <div className="p-5">
                <h2 className="text-xl font-semibold">
                  {fullYear(vehicle.year)} {vehicle.make} {vehicle.model}
                </h2>

                <p className="mt-2 text-lg font-bold">
                  {formatMoney(vehicle.price)}
                </p>

                <p className="mt-1 text-sm text-gray-300">
                  Miles: {vehicle.miles != null ? vehicle.miles.toLocaleString() : "N/A"}
                </p>

                <Link
                  href={`/inventory/${vehicle.id}`}
                  className="inline-block mt-4 rounded-xl bg-white text-black px-5 py-3 font-semibold hover:opacity-90 transition"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Empty state */}
        {filtered.length === 0 && (
          <div className="mt-10 text-gray-300 bg-zinc-900 rounded-2xl p-6">
            No vehicles match your filters. Try resetting.
          </div>
        )}
      </div>
    </main>
  );
}