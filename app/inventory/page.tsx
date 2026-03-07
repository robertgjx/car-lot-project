"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { vehicles } from "@/app/lib/vehicles";
import { useLang, t } from "@/app/lib/LanguageContext";

function formatMoney(n: number | null | undefined) {
  if (n == null) return "N/A";
  return n.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

const fullYear = (year?: number | null) => {
  if (!year) return "";
  if (year < 100) return year >= 90 ? 1900 + year : 2000 + year;
  return year;
};

export default function InventoryPage() {
  const { lang } = useLang();
  const [query, setQuery] = useState("");
  const [make, setMake] = useState("all");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const makes = useMemo(() => {
    return Array.from(new Set(vehicles.map((v) => v.make))).sort();
  }, []);

  const maxInventoryPrice = useMemo(() => {
    const prices = vehicles.map((v) => v.price).filter((p): p is number => p != null);
    return prices.length > 0 ? Math.max(...prices) : 50000;
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const min = minPrice.trim() === "" ? null : Number(minPrice);
    const max = maxPrice.trim() === "" ? null : Number(maxPrice);

    const list = vehicles.filter((v) => {
      const haystack = `${v.year ?? ""} ${v.make ?? ""} ${v.model ?? ""}`.toLowerCase();
      const matchesQuery = q === "" ? true : haystack.includes(q);
      const matchesMake = make === "all" ? true : v.make === make;
      const price = v.price ?? null;
      const matchesMin = min === null ? true : price !== null && price >= min;
      const matchesMax = max === null ? true : price !== null && price <= max;
      return matchesQuery && matchesMake && matchesMin && matchesMax;
    });

    return list;
  }, [query, make, minPrice, maxPrice]);

  return (
    <main className="min-h-screen bg-black text-white p-6 md:p-10">
      <div className="max-w-6xl mx-auto">
        {/* Top Navigation */}
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold">{t.inv.title[lang]}</h1>
          <Link
            href="/"
            className="rounded-xl bg-zinc-800 px-5 py-3 font-semibold hover:opacity-90 transition"
          >
            {t.inv.backHome[lang]}
          </Link>
        </div>

        <p className="mt-2 text-gray-400">{t.inv.sub[lang]}</p>

        {/* Filters Bar */}
        <div className="mt-6 bg-zinc-900 rounded-2xl p-4 md:p-5">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            {/* Search */}
            <div className="md:col-span-2">
              <label className="text-xs text-gray-400">{t.inv.search[lang]}</label>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t.inv.searchPh[lang]}
                className="mt-1 w-full rounded-xl bg-black border border-zinc-800 px-4 py-3 text-white outline-none focus:border-zinc-600"
              />
            </div>

            {/* Make */}
            <div>
              <label className="text-xs text-gray-400">{t.inv.make[lang]}</label>
              <select
                value={make}
                onChange={(e) => setMake(e.target.value)}
                className="mt-1 w-full rounded-xl bg-black border border-zinc-800 px-4 py-3 text-white outline-none focus:border-zinc-600"
              >
                <option value="all">{t.inv.all[lang]}</option>
                {makes.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>

            {/* Min Price */}
            <div>
              <label className="text-xs text-gray-400">{t.inv.minPrice[lang]}</label>
              <input
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                inputMode="numeric"
                placeholder="0"
                className="mt-1 w-full rounded-xl bg-black border border-zinc-800 px-4 py-3 text-white outline-none focus:border-zinc-600"
              />
            </div>

            {/* Max Price */}
            <div>
              <label className="text-xs text-gray-400">{t.inv.maxPrice[lang]}</label>
              <input
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                inputMode="numeric"
                placeholder={maxInventoryPrice.toLocaleString()}
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
                }}
                className="w-full rounded-xl bg-zinc-800 px-5 py-3 font-semibold hover:opacity-90"
              >
                {t.inv.reset[lang]}
              </button>

              <div className="w-full text-sm text-gray-300">
                <div className="bg-black border border-zinc-800 rounded-xl px-4 py-3">
                  {t.inv.showing[lang]} <span className="font-semibold">{filtered.length}</span>{" "}
                  {t.inv.of[lang]} <span className="font-semibold">{vehicles.length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Vehicle Grid */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((vehicle) => {
            const mainImg = vehicle.images?.[0] ?? (vehicle as any).image ?? "/cars/placeholder.jpg";
            return (
              <div key={vehicle.id} className="bg-zinc-900 rounded-2xl overflow-hidden shadow-lg">
                <div className="relative w-full h-52 bg-zinc-800">
                  <Image
                    src={mainImg}
                    alt={`${fullYear(vehicle.year)} ${vehicle.make} ${vehicle.model}`}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-5">
                  <h2 className="text-xl font-semibold">
                    {fullYear(vehicle.year)} {vehicle.make} {vehicle.model}
                  </h2>
                  <p className="mt-2 text-lg font-bold">{formatMoney(vehicle.price)}</p>
                  <p className="mt-1 text-sm text-gray-300">
                    {t.inv.miles[lang]}{" "}
                    {vehicle.miles != null ? vehicle.miles.toLocaleString() : "N/A"}
                  </p>
                  <Link
                    href={`/inventory/${encodeURIComponent(vehicle.id)}`}
                    className="inline-block mt-4 rounded-xl bg-white text-black px-5 py-3 font-semibold hover:opacity-90 transition"
                  >
                    {t.inv.viewDet[lang]}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty state */}
        {filtered.length === 0 && (
          <div className="mt-10 text-gray-300 bg-zinc-900 rounded-2xl p-6">
            {t.inv.noResults[lang]}
          </div>
        )}
      </div>
    </main>
  );
}