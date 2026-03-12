"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
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

interface VinResult {
  year: string; make: string; model: string; trim: string;
  engine: string; bodyStyle: string; driveType: string;
  transmission: string; doors: string; fuel: string;
}

function VinModal({ lang, vin, result, onClose }: { lang: string; vin: string; result: VinResult; onClose: () => void }) {
  const inventoryMatch = vehicles.find((v) => v.vin?.toUpperCase() === vin.toUpperCase());
  const rows = [
    { label: lang === "en" ? "Year" : "Año", value: result.year },
    { label: lang === "en" ? "Make" : "Marca", value: result.make },
    { label: lang === "en" ? "Model" : "Modelo", value: result.model },
    { label: lang === "en" ? "Trim" : "Versión", value: result.trim },
    { label: lang === "en" ? "Engine" : "Motor", value: result.engine },
    { label: lang === "en" ? "Body Style" : "Carrocería", value: result.bodyStyle },
    { label: lang === "en" ? "Drive Type" : "Tracción", value: result.driveType },
    { label: lang === "en" ? "Transmission" : "Transmisión", value: result.transmission },
    { label: lang === "en" ? "Doors" : "Puertas", value: result.doors },
    { label: lang === "en" ? "Fuel" : "Combustible", value: result.fuel },
  ].filter((r) => r.value);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-start justify-between rounded-t-3xl">
          <div>
            <h2 className="text-xl font-extrabold text-gray-900">{result.year} {result.make} {result.model}</h2>
            {result.trim && <p className="text-sm text-gray-500 mt-0.5">{result.trim}</p>}
            <p className="text-xs font-mono text-gray-400 mt-1">VIN: {vin}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 transition ml-4 mt-1">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        <div className="px-6 py-4 flex flex-col gap-4">
          {inventoryMatch ? (
            <div className="rounded-2xl bg-green-50 border-2 border-green-400 p-4">
              <p className="font-bold text-green-700 text-sm mb-1">
                ✅ {lang === "en" ? "We have this vehicle in stock!" : "¡Tenemos este vehículo en inventario!"}
              </p>
              <p className="text-green-800 font-extrabold text-2xl">
                {inventoryMatch.price ? `$${inventoryMatch.price.toLocaleString()}` : lang === "en" ? "Call for price" : "Llame para precio"}
              </p>
              {inventoryMatch.down && (
                <p className="text-green-600 text-sm mt-0.5">{lang === "en" ? "Down" : "Enganche"}: ${inventoryMatch.down.toLocaleString()}</p>
              )}
              <Link href={`/inventory/${inventoryMatch.id}`} onClick={onClose}
                className="mt-3 inline-flex items-center justify-center w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl transition text-sm">
                {lang === "en" ? "View Our Listing →" : "Ver Nuestro Listado →"}
              </Link>
            </div>
          ) : (
            <div className="rounded-2xl bg-gray-50 border border-gray-200 px-4 py-3 text-sm text-gray-500">
              {lang === "en" ? "This vehicle is not currently in our inventory." : "Este vehículo no está en nuestro inventario actualmente."}
            </div>
          )}
          <div className="rounded-2xl border border-gray-200 overflow-hidden">
            <p className="px-4 py-2 text-xs font-semibold uppercase tracking-widest text-gray-400 bg-gray-50 border-b border-gray-200">
              {lang === "en" ? "Vehicle Specs" : "Especificaciones"}
            </p>
            {rows.map((row, i) => (
              <div key={row.label} className={`flex justify-between px-4 py-3 text-sm ${i % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>
                <span className="text-gray-500 font-medium">{row.label}</span>
                <span className="text-gray-900 font-semibold text-right max-w-[55%]">{row.value}</span>
              </div>
            ))}
          </div>
          <button onClick={onClose}
            className="w-full border-2 border-gray-200 text-gray-600 font-semibold py-3 rounded-2xl hover:bg-gray-50 transition text-sm">
            {lang === "en" ? "Close" : "Cerrar"}
          </button>
        </div>
      </div>
    </div>
  );
}

function VinLookupBar({ lang }: { lang: string }) {
  const [input, setInput] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "found" | "notfound" | "error">("idle");
  const [result, setResult] = useState<VinResult | null>(null);
  const [showModal, setShowModal] = useState(false);

  async function lookup() {
    if (input.length !== 17) return;
    setStatus("loading"); setResult(null); setShowModal(false);
    try {
      const res = await fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/decodevin/${input}?format=json`);
      const data = await res.json();
      const get = (label: string) => data.Results.find((r: any) => r.Variable === label)?.Value || "";
      const year = get("Model Year"); const make = get("Make"); const model = get("Model");
      if (!make || !year) { setStatus("notfound"); return; }
      setResult({
        year, make, model, trim: get("Trim"),
        engine: [get("Displacement (L)") && `${get("Displacement (L)")}L`, get("Engine Number of Cylinders") && `${get("Engine Number of Cylinders")} cyl`].filter(Boolean).join(" "),
        bodyStyle: get("Body Class"), driveType: get("Drive Type"),
        transmission: get("Transmission Style"), doors: get("Doors"), fuel: get("Fuel Type - Primary"),
      });
      setStatus("found"); setShowModal(true);
    } catch { setStatus("error"); }
  }

  return (
    <>
      {showModal && result && <VinModal lang={lang} vin={input} result={result} onClose={() => setShowModal(false)} />}
      <div className="hidden md:block rounded-2xl border border-gray-200 bg-gray-50 px-5 py-4 mb-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">
          {lang === "en" ? "🔍 VIN Lookup" : "🔍 Buscar por VIN"}
        </p>
        <p className="text-xs text-gray-400 italic mb-3">
          {lang === "en" ? "Added for your convenience" : "Agregado para su conveniencia"}
        </p>
        <div className="flex gap-2">
          <input
            type="text" maxLength={17} value={input}
            onChange={(e) => { setInput(e.target.value.toUpperCase().replace(/[^A-HJ-NPR-Z0-9]/g, "")); setStatus("idle"); }}
            onKeyDown={(e) => e.key === "Enter" && lookup()}
            placeholder={lang === "en" ? "Enter 17-character VIN..." : "Ingresa el VIN de 17 caracteres..."}
            className="flex-1 border-2 border-gray-200 focus:border-red-500 rounded-xl px-4 py-3 text-sm font-mono tracking-widest outline-none transition bg-white"
            autoCorrect="off" autoCapitalize="characters"
          />
          <button onClick={lookup} disabled={input.length !== 17 || status === "loading"}
            className="bg-red-600 hover:bg-red-700 disabled:bg-gray-200 disabled:text-gray-400 text-white font-bold px-5 py-3 rounded-xl transition text-sm whitespace-nowrap">
            {status === "loading" ? (
              <span className="flex items-center gap-1">
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25"/><path fill="currentColor" className="opacity-75" d="M4 12a8 8 0 018-8v8z"/></svg>
              </span>
            ) : (lang === "en" ? "Look Up →" : "Buscar →")}
          </button>
        </div>
        {status === "found" && result && (
          <button onClick={() => setShowModal(true)}
            className="mt-3 w-full flex items-center justify-between bg-white border border-gray-200 hover:border-red-400 rounded-xl px-4 py-3 transition group">
            <div className="text-left">
              <p className="font-bold text-gray-900">{result.year} {result.make} {result.model}</p>
              <p className="text-xs text-red-500 font-semibold mt-0.5">{lang === "en" ? "Click to view full details" : "Clic para ver detalles completos"}</p>
            </div>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 group-hover:text-red-500 transition">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </button>
        )}
        {status === "notfound" && <p className="mt-2 text-sm text-red-500">{lang === "en" ? "VIN not found. Check and try again." : "VIN no encontrado."}</p>}
        {status === "error" && <p className="mt-2 text-sm text-red-500">{lang === "en" ? "Network error. Try again." : "Error de red."}</p>}
      </div>
    </>
  );
}

function InventoryInner() {
  const { lang } = useLang();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState("");
  const [make, setMake] = useState(() => searchParams.get("make") ?? "all");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [location, setLocation] = useState("all");

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
      const matchesLocation = location === "all" ? true : (v as any).location === location;
      return matchesQuery && matchesMake && matchesMin && matchesMax && matchesLocation;
    });

    return list;
  }, [query, make, minPrice, maxPrice, location]);

  const ITEMS_PER_PAGE = 25;
  const [page, setPage] = useState(1);

  // Reset to page 1 when filters change
  useEffect(() => { setPage(1); }, [query, make, minPrice, maxPrice, location]);

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

        {/* UPDATED subtitle */}
        <p className="mt-2 text-gray-500">
          {lang === "en" ? "Browse our selected inventory." : "Explora nuestro inventario seleccionado."}
        </p>

        {/* VIN Lookup — desktop only */}
        <div className="mt-6">
          <VinLookupBar lang={lang} />
        </div>

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
              <label className="text-xs text-gray-500 font-semibold uppercase tracking-wide">
                {lang === "en" ? "Location" : "Ubicación"}
              </label>
              <select value={location} onChange={(e) => setLocation(e.target.value)} className="mt-1 w-full rounded-xl bg-white border border-gray-200 px-4 py-3 text-gray-900 outline-none focus:border-red-400 transition">
                <option value="all">{lang === "en" ? "All Locations" : "Todas"}</option>
                <option value="Palma Vista">📍 Palma Vista</option>
                <option value="Veterans Blvd">📍 Veterans Blvd</option>
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
              <button onClick={() => { setQuery(""); setMake("all"); setMinPrice(""); setMaxPrice(""); setLocation("all"); }} className="w-full rounded-xl bg-red-600 text-white px-5 py-3 font-semibold hover:bg-red-700 transition">
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
  <Image src={mainImg} alt={`${fullYear(vehicle.year)} ${vehicle.make} ${vehicle.model}`} fill className={`object-cover ${vehicle.status === "sold" ? "opacity-60 grayscale" : ""}`} />
  {vehicle.status === "sold" && (
    <div className="absolute inset-0 flex items-center justify-center">
      <span className="bg-red-600 text-white font-extrabold text-xl px-6 py-2 rounded-2xl shadow-lg rotate-[-12deg] tracking-widest uppercase">
        {lang === "en" ? "Sold" : "Vendido"}
      </span>
    </div>
  )}
  {vehicle.status === "available" && (
    <div className="absolute top-3 left-3">
      <span className="bg-green-500 text-white font-bold text-xs px-2.5 py-1 rounded-full shadow">
        {lang === "en" ? "Available" : "Disponible"}
      </span>
    </div>
  )}
</div>
                <div className="p-5">
                  <div className="flex items-start justify-between gap-2">
                    <h2 className="text-xl font-semibold text-gray-900">
                      {fullYear(vehicle.year)} {vehicle.make} {vehicle.model}
                    </h2>
                    {(vehicle as any).location && (
                      <span className="shrink-0 inline-flex items-center gap-1 bg-gray-100 text-gray-500 text-xs font-semibold px-2.5 py-1 rounded-full">
                        📍 {(vehicle as any).location}
                      </span>
                    )}
                  </div>
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

        {/* More inventory coming soon banner */}
        <div className="mt-12 rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 px-6 py-8 text-center">
          <p className="text-2xl mb-2">🚘</p>
          <p className="text-lg font-bold text-gray-800">
            {lang === "en" ? "More inventory coming soon!" : "¡Más inventario próximamente!"}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            {lang === "en"
              ? "We're always adding new vehicles. Check back often or give us a call!"
              : "Siempre estamos agregando vehículos nuevos. ¡Visítanos pronto o llámanos!"}
          </p>
        </div>

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