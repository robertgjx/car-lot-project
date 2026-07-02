"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, Suspense, useCallback } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { vehicles, VehicleType } from "@/app/lib/vehicles";
import { useLang, t } from "@/app/lib/LanguageContext";
import { useState, useEffect } from "react";
import type { MouseEvent as ReactMouseEvent } from "react";

function formatMoney(n: number | null | undefined) {
  if (n == null) return "N/A";
  return n.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

function calcMonthly(
  price: number | null | undefined,
  down: number | null | undefined,
  term?: number | null,
  fee?: number | null
): string {
  if (price == null) return "N/A";
  const d = down ?? 0;
  const t = term ?? 24;
  const f = fee ?? 3000;
  const monthly = (price + f - d) / t;
  return monthly.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}

const fullYear = (year?: number | null) => {
  if (!year) return "";
  if (year < 100) return year >= 90 ? 1900 + year : 2000 + year;
  return year;
};

// ─── Vehicle type icons ───────────────────────────────────────────────────────

const TypeIcon = ({ type, size = 18 }: { type: VehicleType; size?: number }) => {
  const h = Math.round(size * 0.67);
  switch (type) {
    case "Truck":
      return (
        <svg width={size} height={h} viewBox="0 0 18 12" fill="currentColor">
          <rect x="0" y="4" width="8" height="6" rx="1.5" />
          <path d="M3 4 L4.5 1 L8 1 L8 4Z" />
          <rect x="9" y="5" width="9" height="5" rx="1.5" />
          <circle cx="3.5" cy="10.5" r="1.5" />
          <circle cx="14.5" cy="10.5" r="1.5" />
        </svg>
      );
    case "SUV":
      return (
        <svg width={size} height={h} viewBox="0 0 18 12" fill="currentColor">
          <rect x="0" y="3" width="18" height="7" rx="2" />
          <rect x="2" y="0" width="12" height="5" rx="1.5" />
          <circle cx="4.5" cy="10.5" r="1.5" />
          <circle cx="13.5" cy="10.5" r="1.5" />
        </svg>
      );
    case "Van":
      return (
        <svg width={size} height={h} viewBox="0 0 18 12" fill="currentColor">
          <rect x="0" y="2" width="18" height="8" rx="2" />
          <rect x="1" y="3.5" width="6" height="4" rx="1" fill="white" opacity="0.4" />
          <rect x="8" y="3.5" width="6" height="4" rx="1" fill="white" opacity="0.4" />
          <circle cx="4.5" cy="10.5" r="1.5" />
          <circle cx="13.5" cy="10.5" r="1.5" />
        </svg>
      );
    default:
      return (
        <svg width={size} height={h} viewBox="0 0 18 12" fill="currentColor">
          <rect x="0" y="4" width="18" height="6" rx="2" />
          <path d="M3 4 L5.5 0 L12.5 0 L15 4Z" />
          <circle cx="4.5" cy="10.5" r="1.5" />
          <circle cx="13.5" cy="10.5" r="1.5" />
        </svg>
      );
  }
};

// ─── VIN lookup ───────────────────────────────────────────────────────────────

interface VinResult {
  year: string; make: string; model: string; trim: string;
  engine: string; bodyStyle: string; driveType: string;
  transmission: string; doors: string; fuel: string;
}

function VinModal({ lang, vin, result, onClose }: { lang: string; vin: string; result: VinResult; onClose: () => void }) {
  const inventoryMatch = vehicles.find((v) => v.vin?.toUpperCase() === vin.toUpperCase());
  const rows = [
    { label: lang === "en" ? "Year" : "Año",               value: result.year },
    { label: lang === "en" ? "Make" : "Marca",              value: result.make },
    { label: lang === "en" ? "Model" : "Modelo",            value: result.model },
    { label: lang === "en" ? "Trim" : "Versión",            value: result.trim },
    { label: lang === "en" ? "Engine" : "Motor",            value: result.engine },
    { label: lang === "en" ? "Body Style" : "Carrocería",   value: result.bodyStyle },
    { label: lang === "en" ? "Drive Type" : "Tracción",     value: result.driveType },
    { label: lang === "en" ? "Transmission" : "Transmisión",value: result.transmission },
    { label: lang === "en" ? "Doors" : "Puertas",           value: result.doors },
    { label: lang === "en" ? "Fuel" : "Combustible",        value: result.fuel },
  ].filter((r) => r.value);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div
        className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-start justify-between rounded-t-3xl">
          <div>
            <h2 className="text-xl font-extrabold text-gray-900">
              {result.year} {result.make} {result.model}
            </h2>
            {result.trim && <p className="text-sm text-gray-500 mt-0.5">{result.trim}</p>}
            <p className="text-xs font-mono text-gray-400 mt-1">VIN: {vin}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 transition ml-4 mt-1">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
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
                <p className="text-green-600 text-sm mt-0.5">
                  {lang === "en" ? "Down" : "Enganche"}: ${inventoryMatch.down.toLocaleString()}
                </p>
              )}
              <Link
                href={`/inventory/${inventoryMatch.id}`}
                onClick={onClose}
                className="mt-3 inline-flex items-center justify-center w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl transition text-sm"
              >
                {lang === "en" ? "View Our Listing →" : "Ver Nuestro Listado →"}
              </Link>
            </div>
          ) : (
            <div className="rounded-2xl bg-gray-50 border border-gray-200 px-4 py-3 text-sm text-gray-500">
              {lang === "en"
                ? "This vehicle is not currently in our inventory."
                : "Este vehículo no está en nuestro inventario actualmente."}
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
          <button
            onClick={onClose}
            className="w-full border-2 border-gray-200 text-gray-600 font-semibold py-3 rounded-2xl hover:bg-gray-50 transition text-sm"
          >
            {lang === "en" ? "Close" : "Cerrar"}
          </button>
        </div>
      </div>
    </div>
  );
}

function VinLookupBar({ lang }: { lang: string }) {
  const [expanded, setExpanded] = useState(false);
  const [input, setInput] = useState("");
  const [vinStatus, setVinStatus] = useState<"idle" | "loading" | "found" | "notfound" | "error">("idle");
  const [result, setResult] = useState<VinResult | null>(null);
  const [showModal, setShowModal] = useState(false);

  async function lookup() {
    if (input.length !== 17) return;
    setVinStatus("loading"); setResult(null); setShowModal(false);
    try {
      const res = await fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/decodevin/${input}?format=json`);
      const data = await res.json();
      const get = (label: string) => data.Results.find((r: any) => r.Variable === label)?.Value || "";
      const year = get("Model Year"); const make = get("Make"); const model = get("Model");
      if (!make || !year) { setVinStatus("notfound"); return; }
      setResult({
        year, make, model, trim: get("Trim"),
        engine: [
          get("Displacement (L)") && `${get("Displacement (L)")}L`,
          get("Engine Number of Cylinders") && `${get("Engine Number of Cylinders")} cyl`,
        ].filter(Boolean).join(" "),
        bodyStyle: get("Body Class"), driveType: get("Drive Type"),
        transmission: get("Transmission Style"), doors: get("Doors"), fuel: get("Fuel Type - Primary"),
      });
      setVinStatus("found"); setShowModal(true);
    } catch { setVinStatus("error"); }
  }

  function collapse() {
    setExpanded(false);
    setInput("");
    setVinStatus("idle");
    setResult(null);
    setShowModal(false);
  }

  return (
    <>
      {showModal && result && (
        <VinModal lang={lang} vin={input} result={result} onClose={() => setShowModal(false)} />
      )}
      <div className="hidden md:block mb-6">
        {!expanded ? (
          <button
            onClick={() => setExpanded(true)}
            className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2.5 rounded-xl transition text-xs uppercase tracking-widest shadow-sm"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            {lang === "en" ? "Look Up by VIN" : "Buscar por VIN"}
          </button>
        ) : (
          <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-gray-50 px-5 py-4 shadow-sm">
            <div className="flex items-start justify-between mb-1">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">
                  {lang === "en" ? "🔍 VIN Lookup" : "🔍 Buscar por VIN"}
                </p>
                <p className="text-xs text-gray-400 italic">
                  {lang === "en" ? "Added for your convenience" : "Agregado para su conveniencia"}
                </p>
              </div>
              <button
                onClick={collapse}
                className="text-gray-400 hover:text-gray-700 transition text-xs font-semibold flex items-center gap-1 mt-0.5"
              >
                {lang === "en" ? "Close" : "Cerrar"}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <div className="flex gap-2 mt-3">
              <input
                type="text" maxLength={17} value={input} autoFocus
                onChange={(e) => {
                  setInput(e.target.value.toUpperCase().replace(/[^A-HJ-NPR-Z0-9]/g, ""));
                  setVinStatus("idle");
                }}
                onKeyDown={(e) => e.key === "Enter" && lookup()}
                placeholder={lang === "en" ? "Enter 17-character VIN..." : "Ingresa el VIN de 17 caracteres..."}
                className="flex-1 border-2 border-gray-200 focus:border-red-500 rounded-xl px-4 py-3 text-sm font-mono tracking-widest outline-none transition bg-white"
                autoCorrect="off" autoCapitalize="characters"
              />
              <button
                onClick={lookup}
                disabled={input.length !== 17 || vinStatus === "loading"}
                className="bg-red-600 hover:bg-red-700 disabled:bg-gray-200 disabled:text-gray-400 text-white font-bold px-5 py-3 rounded-xl transition text-sm whitespace-nowrap"
              >
                {vinStatus === "loading" ? (
                  <span className="flex items-center gap-1">
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
                      <path fill="currentColor" className="opacity-75" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                  </span>
                ) : lang === "en" ? "Look Up →" : "Buscar →"}
              </button>
            </div>
            {vinStatus === "found" && result && (
              <button
                onClick={() => setShowModal(true)}
                className="mt-3 w-full flex items-center justify-between bg-white border border-gray-200 hover:border-red-400 rounded-xl px-4 py-3 transition group"
              >
                <div className="text-left">
                  <p className="font-bold text-gray-900">{result.year} {result.make} {result.model}</p>
                  <p className="text-xs text-red-500 font-semibold mt-0.5">
                    {lang === "en" ? "Click to view full details" : "Clic para ver detalles completos"}
                  </p>
                </div>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 group-hover:text-red-500 transition">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            )}
            {vinStatus === "notfound" && (
              <p className="mt-2 text-sm text-red-500">{lang === "en" ? "VIN not found. Check and try again." : "VIN no encontrado."}</p>
            )}
            {vinStatus === "error" && (
              <p className="mt-2 text-sm text-red-500">{lang === "en" ? "Network error. Try again." : "Error de red."}</p>
            )}
          </div>
        )}
      </div>
    </>
  );
}

// ─── Pagination ───────────────────────────────────────────────────────────────

function Pagination({ page, totalPages, lang, onPageChange }: {
  page: number; totalPages: number; lang: string; onPageChange: (p: number) => void;
}) {
  if (totalPages <= 1) return null;
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  return (
    <div className="flex items-center justify-center gap-2 flex-wrap">
      <button
        onClick={() => onPageChange(Math.max(1, page - 1))} disabled={page === 1}
        className="rounded-xl border border-gray-200 bg-white px-4 py-2 font-semibold text-gray-900 hover:bg-gray-100 transition disabled:opacity-40 disabled:cursor-not-allowed"
      >
        ←
      </button>
      {pages.map((p) => (
        <button key={p} onClick={() => onPageChange(p)}
          className={`rounded-xl px-4 py-2 font-semibold transition ${p === page ? "bg-red-600 text-white" : "border border-gray-200 bg-white text-gray-900 hover:bg-gray-100"}`}
        >
          {p}
        </button>
      ))}
      <button
        onClick={() => onPageChange(Math.min(totalPages, page + 1))} disabled={page === totalPages}
        className="rounded-xl border border-gray-200 bg-white px-4 py-2 font-semibold text-gray-900 hover:bg-gray-100 transition disabled:opacity-40 disabled:cursor-not-allowed"
      >
        →
      </button>
    </div>
  );
}

// ─── Vehicle card ───────────────────────────────────────────────────────────────

function VehicleCard({ vehicle, lang, highlight = false }: { vehicle: (typeof vehicles)[number]; lang: "en" | "es"; highlight?: boolean }) {
  const images = vehicle.images && vehicle.images.length > 0 ? vehicle.images : ["/cars/placeholder.jpg"];
  const [imgIndex, setImgIndex] = useState(0);
  const isSold  = vehicle.status === "sold";
  const hasMultiple = images.length > 1;

  const prevImage = (e: ReactMouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setImgIndex((i) => (i - 1 + images.length) % images.length);
  };
  const nextImage = (e: ReactMouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setImgIndex((i) => (i + 1) % images.length);
  };

  return (
    <div
      className={`bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition flex flex-col ${
        highlight ? "border-2 border-red-500 ring-2 ring-red-100" : "border border-gray-200"
      }`}
    >
      {/* Image */}
      <div className="relative w-full h-52 bg-gray-100 shrink-0 group/img overflow-hidden">
        <Image
          src={images[imgIndex]}
          alt={`${fullYear(vehicle.year)} ${vehicle.make} ${vehicle.model}`}
          fill
          className={`object-cover transition-opacity duration-150 ${isSold ? "opacity-50 grayscale" : ""}`}
        />

        {hasMultiple && (
          <>
            <button
              type="button"
              onClick={prevImage}
              aria-label={lang === "en" ? "Previous photo" : "Foto anterior"}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-8 h-8 rounded-full bg-black/40 text-white opacity-0 group-hover/img:opacity-100 hover:bg-black/60 transition"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <button
              type="button"
              onClick={nextImage}
              aria-label={lang === "en" ? "Next photo" : "Siguiente foto"}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-8 h-8 rounded-full bg-black/40 text-white opacity-0 group-hover/img:opacity-100 hover:bg-black/60 transition"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
            <span className="absolute bottom-2 right-2 z-10 bg-black/55 text-white text-[11px] font-semibold px-2 py-0.5 rounded-full">
              {imgIndex + 1}/{images.length}
            </span>
          </>
        )}

        {highlight && (
          <span className="absolute top-3 right-3 bg-red-600 text-white text-xs font-extrabold px-2.5 py-1 rounded-full shadow uppercase tracking-wide">
            {lang === "en" ? "New" : "Nuevo"}
          </span>
        )}
        {isSold ? (
          <span className="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow">
            {lang === "en" ? "Sold" : "Vendido"}
          </span>
        ) : (
          <span className="absolute top-3 left-3 bg-green-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow">
            {lang === "en" ? "Available" : "Disponible"}
          </span>
        )}
      </div>

      {/* Card body */}
      <div className="p-5 flex flex-col flex-1">

        {/* Type pill + location */}
        <div className="flex items-center gap-1.5 mb-2 flex-wrap">
          {vehicle.type && vehicle.type !== "Other" && (
            <span className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-500 text-xs font-semibold px-2.5 py-1 rounded-full">
              <TypeIcon type={vehicle.type} size={13} />
              {vehicle.type === "Truck" ? (lang === "en" ? "Truck" : "Troca") :
               vehicle.type === "SUV"   ? "SUV" :
               vehicle.type === "Van"   ? "Van" :
               (lang === "en" ? "Car" : "Carro")}
            </span>
          )}
          {vehicle.location && (
            <span className="inline-flex items-center gap-1 bg-gray-50 text-gray-400 text-xs px-2.5 py-1 rounded-full border border-gray-100">
              📍 {vehicle.location}
            </span>
          )}
        </div>

        {/* Name + trim */}
        <h2 className="text-lg font-semibold text-gray-900 leading-snug">
          {fullYear(vehicle.year)} {vehicle.make} {vehicle.model}
          {vehicle.trim && (
            <span className="text-gray-400 font-normal text-sm"> · {vehicle.trim}</span>
          )}
        </h2>

        {/* Price */}
        <p className={`mt-2 text-2xl font-bold ${isSold ? "text-gray-400" : "text-red-600"}`}>
          {formatMoney(vehicle.price)}
        </p>

        {/* Miles */}
        <p className="mt-1 text-sm text-gray-400">
          {vehicle.miles != null ? vehicle.miles.toLocaleString() : "N/A"}{" "}
          {lang === "en" ? "miles" : "millas"}
        </p>

        <div className="mt-auto">
          <div className="my-3 border-t border-gray-100" />

          {/* Down + monthly or sold message */}
          {!isSold ? (
            <div className="flex items-end justify-between">
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide">
                  {lang === "en" ? "Down" : "Enganche"}
                </p>
                <p className="text-sm font-semibold text-gray-700">
                  {vehicle.down != null ? formatMoney(vehicle.down) : "—"}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-400 uppercase tracking-wide">
                  {lang === "en" ? "Est. monthly" : "Pago est."}
                </p>
                <p className="text-sm font-bold text-gray-900">
                  {calcMonthly(vehicle.price, vehicle.down, vehicle.term, vehicle.fee)}/mo
                </p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-400 text-center py-1">
              {lang === "en" ? "This vehicle has been sold" : "Este vehículo fue vendido"}
            </p>
          )}

          {/* CTA */}
          <Link
            href={`/inventory/${encodeURIComponent(vehicle.id)}`}
            className="mt-3 block w-full text-center rounded-xl bg-red-600 text-white px-5 py-3 font-semibold hover:bg-red-700 transition text-sm"
          >
            {t.inv.viewDet[lang]}
          </Link>
        </div>
      </div>
    </div>
  );
}

// ─── Main inventory component ─────────────────────────────────────────────────

function InventoryInner() {
  const { lang } = useLang();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // URL filter state
  const query    = searchParams.get("q")      ?? "";
  const make     = searchParams.get("make")   ?? "all";
  const minDown  = searchParams.get("minDown") ?? "";
  const maxDown  = searchParams.get("maxDown") ?? "";
  const location = searchParams.get("loc")    ?? "all";
  const status   = searchParams.get("status") ?? "all";
  const type     = searchParams.get("type")   ?? "all";  // ← new
  const page     = Number(searchParams.get("page") ?? "1");

  const updateParams = useCallback((updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value === "" || value === "all") {
        params.delete(key);
      } else if (key === "page" && value === "1") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [searchParams, router, pathname]);

  const setQuery    = (v: string) => updateParams({ q: v,       page: "1" });
  const setMake     = (v: string) => updateParams({ make: v,    page: "1" });
  const setMinDown  = (v: string) => updateParams({ minDown: v, page: "1" });
  const setMaxDown  = (v: string) => updateParams({ maxDown: v, page: "1" });
  const setLocation = (v: string) => updateParams({ loc: v,     page: "1" });
  const setStatus   = (v: string) => updateParams({ status: v,  page: "1" });
  const setType     = (v: string) => updateParams({ type: v,    page: "1" });  // ← new
  const setPage     = (p: number) => {
    updateParams({ page: String(p) });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const resetAll = () => router.replace(pathname, { scroll: false });

  const makes = useMemo(() => {
    return Array.from(new Set(vehicles.map((v) => v.make))).sort();
  }, []);

  const maxInventoryDown = useMemo(() => {
    const downs = vehicles.map((v) => v.down).filter((d): d is number => d != null);
    return downs.length > 0 ? Math.max(...downs) : 10000;
  }, []);

  // First 3 vehicles in inventory.json order → "New Inventory"
  const newInventory = useMemo(() => vehicles.slice(0, 3), []);
  const newInventoryIds = useMemo(() => new Set(newInventory.map((v) => v.id)), [newInventory]);

  // Count per type across full inventory (not filtered) for tab badges
  const typeCounts = useMemo(() => ({
    all:   vehicles.length,
    Car:   vehicles.filter((v) => v.type === "Car").length,
    SUV:   vehicles.filter((v) => v.type === "SUV").length,
    Truck: vehicles.filter((v) => v.type === "Truck").length,
    Van:   vehicles.filter((v) => v.type === "Van").length,
    Other: vehicles.filter((v) => v.type === "Other").length,
  }), []);

  const filtered = useMemo(() => {
    const q   = query.trim().toLowerCase();
    const min = minDown.trim() === "" ? null : Number(minDown);
    const max = maxDown.trim() === "" ? null : Number(maxDown);

    return vehicles.filter((v) => {
      if (newInventoryIds.has(v.id)) return false; // shown separately above
      const haystack      = `${v.year ?? ""} ${v.make ?? ""} ${v.model ?? ""}`.toLowerCase();
      const matchesQuery  = q === "" || haystack.includes(q);
      const matchesMake   = make === "all" || v.make === make;
      const down          = v.down ?? null;
      const matchesMin    = min === null || (down !== null && down >= min);
      const matchesMax    = max === null || (down !== null && down <= max);
      const matchesLoc    = location === "all" || (v as any).location === location;
      const matchesStatus = status === "all" || v.status === status;
      const matchesType   = type === "all" || v.type === type;  // ← new
      return matchesQuery && matchesMake && matchesMin && matchesMax && matchesLoc && matchesStatus && matchesType;
    });
  }, [query, make, minDown, maxDown, location, status, type, newInventoryIds]);

  const ITEMS_PER_PAGE = 27;
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated  = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  // Tab definitions
  const typeTabs: { key: string; labelKey: keyof typeof t.inv; vtype?: VehicleType }[] = [
    { key: "all",   labelKey: "typeAll" },
    { key: "Car",   labelKey: "typeCar",   vtype: "Car" },
    { key: "SUV",   labelKey: "typeSUV",   vtype: "SUV" },
    { key: "Truck", labelKey: "typeTruck", vtype: "Truck" },
    { key: "Van",   labelKey: "typeVan",   vtype: "Van" },
    { key: "Other", labelKey: "typeOther", vtype: "Other" },
  ];

  return (
    <main className="min-h-screen bg-white text-gray-900 p-6 md:p-10">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold text-gray-900">{t.inv.title[lang]}</h1>
          <Link href="/" className="rounded-xl border border-gray-200 bg-white px-5 py-3 font-semibold text-gray-900 hover:bg-gray-100 transition">
            {t.inv.backHome[lang]}
          </Link>
        </div>

        <p className="mt-2 text-gray-500">
          {lang === "en" ? "Browse our selected inventory." : "Explora nuestro inventario seleccionado."}
        </p>

        <div className="mt-3 flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1.5 bg-red-600 text-white text-xs font-extrabold px-3 py-1.5 rounded-full uppercase tracking-widest shadow-sm">
            💳 {lang === "en" ? "Buy Here Pay Here" : "Compra Aquí Paga Aquí"}
          </span>
          <span className="inline-flex items-center gap-1.5 bg-green-100 text-green-800 text-xs font-bold px-3 py-1.5 rounded-full">
            ✅ {lang === "en" ? "No Credit? No Problem!" : "¿Sin Crédito? ¡No Hay Problema!"}
          </span>
        </div>

        {/* VIN Lookup */}
        <div className="mt-6">
          <VinLookupBar lang={lang} />
        </div>

        {/* ── New Inventory ── */}
        {newInventory.length > 0 && (
          <div className="mt-2 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="inline-flex items-center gap-1.5 bg-red-600 text-white text-xs font-extrabold px-3 py-1.5 rounded-full uppercase tracking-widest shadow-sm whitespace-nowrap">
                🆕 {lang === "en" ? "New Inventory" : "Inventario Nuevo"}
              </span>
              <div className="h-px flex-1 bg-gray-200" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {newInventory.map((vehicle) => (
                <VehicleCard key={vehicle.id} vehicle={vehicle} lang={lang} highlight />
              ))}
            </div>
          </div>
        )}

        {/* ── Vehicle Type Tabs ── */}
        <div className="mt-2 flex gap-2 flex-wrap">
          {typeTabs.map(({ key, labelKey, vtype }) => {
            const count = typeCounts[key as keyof typeof typeCounts] ?? 0;
            const isActive = type === key;
            return (
              <button
                key={key}
                onClick={() => setType(key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full border font-semibold text-sm transition
                  ${isActive
                    ? "bg-red-600 border-red-600 text-white"
                    : "bg-white border-gray-200 text-gray-600 hover:border-gray-400 hover:text-gray-900"
                  }`}
              >
                <TypeIcon type={vtype ?? "Car"} size={18} />
                {t.inv[labelKey][lang]}
                <span className={`text-xs font-normal ${isActive ? "opacity-70" : "text-gray-400"}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* ── Filters Bar ── */}
        <div className="mt-4 bg-gray-50 border border-gray-200 rounded-2xl p-4 md:p-5 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">

            <div className="md:col-span-2">
              <label className="text-xs text-gray-500 font-semibold uppercase tracking-wide">{t.inv.search[lang]}</label>
              <input
                value={query} onChange={(e) => setQuery(e.target.value)}
                placeholder={t.inv.searchPh[lang]}
                className="mt-1 w-full rounded-xl bg-white border border-gray-200 px-4 py-3 text-gray-900 outline-none focus:border-red-400 transition placeholder-gray-400"
              />
            </div>

            <div>
              <label className="text-xs text-gray-500 font-semibold uppercase tracking-wide">{t.inv.make[lang]}</label>
              <select value={make} onChange={(e) => setMake(e.target.value)}
                className="mt-1 w-full rounded-xl bg-white border border-gray-200 px-4 py-3 text-gray-900 outline-none focus:border-red-400 transition">
                <option value="all">{t.inv.all[lang]}</option>
                {makes.map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>

            <div>
              <label className="text-xs text-gray-500 font-semibold uppercase tracking-wide">
                {lang === "en" ? "Location" : "Ubicación"}
              </label>
              <select value={location} onChange={(e) => setLocation(e.target.value)}
                className="mt-1 w-full rounded-xl bg-white border border-gray-200 px-4 py-3 text-gray-900 outline-none focus:border-red-400 transition">
                <option value="all">{lang === "en" ? "All Locations" : "Todas"}</option>
                <option value="Palma Vista">📍 Palma Vista</option>
                <option value="Veterans Blvd">📍 Veterans Blvd</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-gray-500 font-semibold uppercase tracking-wide">
                {lang === "en" ? "Status" : "Estado"}
              </label>
              <select value={status} onChange={(e) => setStatus(e.target.value)}
                className="mt-1 w-full rounded-xl bg-white border border-gray-200 px-4 py-3 text-gray-900 outline-none focus:border-red-400 transition">
                <option value="all">{lang === "en" ? "All" : "Todos"}</option>
                <option value="available">{lang === "en" ? "✅ Available" : "✅ Disponible"}</option>
                <option value="sold">{lang === "en" ? "🔴 Sold" : "🔴 Vendido"}</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-gray-500 font-semibold uppercase tracking-wide">
                {lang === "en" ? "Min Down Payment" : "Enganche Mínimo"}
              </label>
              <input value={minDown} onChange={(e) => setMinDown(e.target.value)} inputMode="numeric" placeholder="$0"
                className="mt-1 w-full rounded-xl bg-white border border-gray-200 px-4 py-3 text-gray-900 outline-none focus:border-red-400 transition placeholder-gray-400" />
            </div>

            <div>
              <label className="text-xs text-gray-500 font-semibold uppercase tracking-wide">
                {lang === "en" ? "Max Down Payment" : "Enganche Máximo"}
              </label>
              <input value={maxDown} onChange={(e) => setMaxDown(e.target.value)} inputMode="numeric"
                placeholder={`$${maxInventoryDown.toLocaleString()}`}
                className="mt-1 w-full rounded-xl bg-white border border-gray-200 px-4 py-3 text-gray-900 outline-none focus:border-red-400 transition placeholder-gray-400" />
            </div>

            <div className="md:col-span-2 flex items-end gap-3">
              <button onClick={resetAll}
                className="w-full rounded-xl bg-red-600 text-white px-5 py-3 font-semibold hover:bg-red-700 transition">
                {t.inv.reset[lang]}
              </button>
              <div className="w-full text-sm text-gray-600">
                <div className="bg-white border border-gray-200 rounded-xl px-4 py-3">
                  {t.inv.showing[lang]}{" "}
                  <span className="font-semibold text-gray-900">{filtered.length}</span>{" "}
                  {t.inv.of[lang]}{" "}
                  <span className="font-semibold text-gray-900">{vehicles.length}</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Pagination top */}
        {totalPages > 1 && (
          <div className="mt-6 mb-4">
            <Pagination page={page} totalPages={totalPages} lang={lang} onPageChange={setPage} />
          </div>
        )}

        {/* ── Vehicle Grid ── */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginated.map((vehicle) => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} lang={lang} />
          ))}
        </div>

        {/* No results */}
        {filtered.length === 0 && (
          <div className="mt-10 text-gray-500 bg-gray-50 border border-gray-200 rounded-2xl p-6">
            {t.inv.noResults[lang]}
          </div>
        )}

        {/* Pagination bottom */}
        {totalPages > 1 && (
          <div className="mt-10">
            <Pagination page={page} totalPages={totalPages} lang={lang} onPageChange={setPage} />
          </div>
        )}

        {/* Coming soon banner */}
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