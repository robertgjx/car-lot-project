"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { vehicles } from "@/app/lib/vehicles";
import { useLang, t } from "@/app/lib/LanguageContext";

function formatMoney(n: number | null | undefined) {
  if (n == null) return "N/A";
  return n.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

function calcMonthly(price: number | null | undefined, down: number | null | undefined): string {
  if (price == null) return "N/A";
  const d = down ?? 0;
  const monthly = ((price + 3000) - d) / 24;
  return monthly.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

const fullYear = (year?: number | null) => {
  if (!year) return "";
  if (year < 100) return year >= 90 ? 1900 + year : 2000 + year;
  return year;
};

function InventoryInner() {
  const { lang } = useLang();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState("");
  const [make, setMake] = useState(() => searchParams.get("make") ?? "all");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  useEffect(() => {
    const m = searchParams.get("make");
    if (m) setMake(m);
  }, [searchParams]);

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

  const ITEMS_PER_PAGE = 25;
  const [page, setPage] = useState(1);

  // Reset to page 1 when filters change
  useEffect(() => { setPage(1); }, [query, make, minPrice, maxPrice]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const estLabel   = lang === "en" ? "Est. Payment"                              : "Pago Est.";
  const estNote    = lang === "en" ? "Based on listed down • 24 mo financing"    : "Con enganche indicado • 24 meses";

  return (
    <main className="min-h-screen bg-white text-gray-900 p-6 md:p-10">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold text-gray-900">{t.inv.title[lang]}</h1>
          <Link href="/" className="rounded-xl border border-gray-200 bg-white px-5 py-3 font-semibold text-gray-900 hover:bg-gray-100 transition">
            {t.inv.backHome[lang]}
          </Link>
        </div>

        <p className="mt-2 text-gray-500">{t.inv.sub[lang]}</p>

        {/* Filters Bar */}
        <div className="mt-6 bg-gray-50 border border-gray-200 rounded-2xl p-4 md:p-5 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="md:col-span-2">
              <label className="text-xs text-gray-500 font-semibold uppercase tracking-wide">{t.inv.search[lang]}</label>
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t.inv.searchPh[lang]} className="mt-1 w-full rounded-xl bg-white border border-gray-200 px-4 py-3 text-gray-900 outline-none focus:border-red-400 transition placeholder-gray-400" />
            </div>
            <div>
              <label className="text-xs text-gray-500 font-semibold uppercase tracking-wide">{t.inv.make[lang]}</label>
              <select value={make} onChange={(e) => setMake(e.target.value)} className="mt-1 w-full rounded-xl bg-white border border-gray-200 px-4 py-3 text-gray-900 outline-none focus:border-red-400 transition">
                <option value="all">{t.inv.all[lang]}</option>
                {makes.map((m) => (<option key={m} value={m}>{m}</option>))}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 font-semibold uppercase tracking-wide">{t.inv.minPrice[lang]}</label>
              <input value={minPrice} onChange={(e) => setMinPrice(e.target.value)} inputMode="numeric" placeholder="0" className="mt-1 w-full rounded-xl bg-white border border-gray-200 px-4 py-3 text-gray-900 outline-none focus:border-red-400 transition placeholder-gray-400" />
            </div>
            <div>
              <label className="text-xs text-gray-500 font-semibold uppercase tracking-wide">{t.inv.maxPrice[lang]}</label>
              <input value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} inputMode="numeric" placeholder={maxInventoryPrice.toLocaleString()} className="mt-1 w-full rounded-xl bg-white border border-gray-200 px-4 py-3 text-gray-900 outline-none focus:border-red-400 transition placeholder-gray-400" />
            </div>
            <div className="md:col-span-2 flex items-end gap-3">
              <button onClick={() => { setQuery(""); setMake("all"); setMinPrice(""); setMaxPrice(""); }} className="w-full rounded-xl bg-red-600 text-white px-5 py-3 font-semibold hover:bg-red-700 transition">
                {t.inv.reset[lang]}
              </button>
              <div className="w-full text-sm text-gray-600">
                <div className="bg-white border border-gray-200 rounded-xl px-4 py-3">
                  {t.inv.showing[lang]} <span className="font-semibold text-gray-900">{filtered.length}</span>{" "}
                  {t.inv.of[lang]} <span className="font-semibold text-gray-900">{vehicles.length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Vehicle Grid */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginated.map((vehicle) => {
            const mainImg = vehicle.images?.[0] ?? (vehicle as any).image ?? "/cars/placeholder.jpg";
            return (
              <div key={vehicle.id} className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition">
                <div className="relative w-full h-52 bg-gray-100">
                  <Image src={mainImg} alt={`${fullYear(vehicle.year)} ${vehicle.make} ${vehicle.model}`} fill className="object-cover" />
                </div>
                <div className="p-5">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {fullYear(vehicle.year)} {vehicle.make} {vehicle.model}
                  </h2>
                  <p className="mt-2 text-lg font-bold text-red-600">{formatMoney(vehicle.price)}</p>
                  <p className="mt-1 text-sm text-gray-500">
                    {t.inv.miles[lang]}{" "}{vehicle.miles != null ? vehicle.miles.toLocaleString() : "N/A"}
                  </p>

                  {/* Est. Monthly Payment */}
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-xs text-gray-400 uppercase tracking-wide font-medium">{estLabel}</span>
                    <span className="text-sm font-bold text-gray-900">{calcMonthly(vehicle.price, vehicle.down)}/mo</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">{estNote}</p>

                  <Link href={`/inventory/${encodeURIComponent(vehicle.id)}`} className="inline-block mt-4 rounded-xl bg-red-600 text-white px-5 py-3 font-semibold hover:bg-red-700 transition">
                    {t.inv.viewDet[lang]}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="mt-10 text-gray-500 bg-gray-50 border border-gray-200 rounded-2xl p-6">
            {t.inv.noResults[lang]}
          </div>
        )}

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="mt-10 flex items-center justify-center gap-4">
            <button
              onClick={() => { setPage(p => Math.max(1, p - 1)); window.scrollTo({ top: 0, behavior: "smooth" }); }}
              disabled={page === 1}
              className="rounded-xl border border-gray-200 bg-white px-5 py-3 font-semibold text-gray-900 hover:bg-gray-100 transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {lang === "en" ? "← Previous" : "← Anterior"}
            </button>
            <span className="text-sm text-gray-500 font-medium">
              {lang === "en" ? `Page ${page} of ${totalPages}` : `Página ${page} de ${totalPages}`}
            </span>
            <button
              onClick={() => { setPage(p => Math.min(totalPages, p + 1)); window.scrollTo({ top: 0, behavior: "smooth" }); }}
              disabled={page === totalPages}
              className="rounded-xl border border-gray-200 bg-white px-5 py-3 font-semibold text-gray-900 hover:bg-gray-100 transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {lang === "en" ? "Next →" : "Siguiente →"}
            </button>
          </div>
        )}
      </div>
    </main>
  );
}

export default function InventoryPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center text-gray-400">Loading...</div>}>
      <InventoryInner />
    </Suspense>
  );
}