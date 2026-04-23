"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { vehicles, Vehicle } from "./lib/vehicles";
import { useLang, t } from "./lib/LanguageContext";

function formatMoney(n: number | null | undefined) {
  if (n == null) return "N/A";
  return n.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

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
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      {/* Modal */}
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
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
          {/* Inventory status */}
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

          {/* Specs table */}
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

interface VinLookupProps { lang: string; }
function VinLookup({ lang }: VinLookupProps) {
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
      setStatus("found");
      setShowModal(true);
    } catch { setStatus("error"); }
  }

  return (
    <>
      {showModal && result && (
        <VinModal lang={lang} vin={input} result={result} onClose={() => setShowModal(false)} />
      )}
      <div className="rounded-3xl border border-gray-200 bg-gray-50 px-6 py-5">
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">
          {lang === "en" ? "🔍 VIN Lookup" : "🔍 Buscar por VIN"}
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
            className="bg-red-600 hover:bg-red-700 disabled:bg-gray-200 disabled:text-gray-400 text-white font-bold px-5 py-3 rounded-xl transition text-sm">
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
              <p className="text-xs text-red-500 font-semibold mt-0.5">{lang === "en" ? "Click to view full details" : "Toca para ver detalles completos"}</p>
            </div>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 group-hover:text-red-500 transition">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </button>
        )}
        {status === "notfound" && <p className="mt-2 text-sm text-red-500">{lang === "en" ? "VIN not found. Check and try again." : "VIN no encontrado. Verifica e intenta de nuevo."}</p>}
        {status === "error" && <p className="mt-2 text-sm text-red-500">{lang === "en" ? "Network error. Try again." : "Error de red. Intenta de nuevo."}</p>}
      </div>
    </>
  );
}

export default function Home() {
  const { lang } = useLang();
  const [featured, setFeatured] = useState<Vehicle[]>(vehicles.filter((v) => v.status !== "sold").slice(0, 3));

  useEffect(() => {
    fetch("/api/track-view")
      .then((r) => r.json())
      .then(({ top }) => {
        if (top && top.length > 0) {
          const topVehicles: Vehicle[] = top
  .reduce((acc: Vehicle[], id: string) => {
    const found = vehicles.find((v) => v.id === id);
    if (found && found.status !== "sold") acc.push(found);
    return acc;
  }, []);
          // Fill up to 3 with fallbacks if needed
          const fallbacks = vehicles.filter((v) => !top.includes(v.id) && v.status !== "sold");
          const combined = [...topVehicles, ...fallbacks].slice(0, 3);
          setFeatured(combined);
        }
      })
      .catch(() => {}); // fallback to default
  }, []);

  return (
    <main className="min-h-screen bg-white text-gray-900">
      {/* HERO */}
      <section className="relative overflow-hidden rounded-3xl border border-gray-200 p-8 md:p-14 min-h-[500px]">
        <div className="absolute inset-0 z-10">
          <img src="/garcias.png" alt="Background" className="h-full w-full object-cover opacity-90" />
          <div className="absolute inset-0 bg-black/20" />
        </div>
        <div className="pointer-events-none absolute -top-40 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-red-600/10 blur-3xl" />
        <div className="relative z-10">
          <p className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-black/30 px-4 py-2 text-sm text-white">
            <span className="h-2 w-2 rounded-full bg-green-400" />
            {t.hero.badge[lang]}
          </p>
          <p className="mt-6 text-sm font-semibold uppercase tracking-widest text-white/70">
          {lang === "en" ? "Welcome to" : "Bienvenidos a"}
          </p>
          <h1 className="mt-1 text-4xl font-extrabold tracking-tight text-white md:text-6xl">Garcia&apos;s Auto Sales RGV</h1>
          {/* subtitle removed */}
          <div className="mt-6 inline-flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-2xl bg-red-600 px-5 py-2.5 text-sm font-extrabold text-white uppercase tracking-widest shadow-lg">
              💳 {lang === "en" ? "Buy Here Pay Here" : "Compra Aquí Paga Aquí"}
            </span>
            <span className="inline-flex items-center gap-2 rounded-2xl bg-white/20 border border-white/40 px-5 py-2.5 text-sm font-bold text-white">
              ✅ {lang === "en" ? "No Credit? No Problem!" : "¿Sin Crédito? ¡No Hay Problema!"}
            </span>
          </div>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <Link href="/inventory" className="inline-flex items-center justify-center rounded-2xl border border-white/40 bg-black/30 px-6 py-4 text-base font-semibold text-white hover:bg-black/50 transition">
              {t.hero.viewInv[lang]}
            </Link>
            <Link href="/contact" className="inline-flex items-center justify-center rounded-2xl border border-white/40 bg-black/30 px-6 py-4 text-base font-semibold text-white hover:bg-black/50 transition">
              {t.hero.contactUs[lang]}
            </Link>
          </div>
        </div>
      </section>

      {/* BRAND STRIP */}
      <section className="mt-6 rounded-3xl border border-gray-200 bg-gray-50 px-6 py-5">
        <p className="text-center text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">
          {lang === "en" ? "Shop by Brand" : "Buscar por Marca"}
        </p>
        <div className="flex items-center justify-around gap-6 flex-wrap">

          <Link href="/inventory?make=Chevrolet" className="flex flex-col items-center gap-2 group">
            <div className="flex items-center justify-center w-20 h-16 rounded-2xl border border-gray-200 bg-white shadow-sm group-hover:border-red-400 group-hover:shadow-md transition p-2">
              <img src="/brand-chevrolet.jpg" alt="Chevrolet" className="w-full h-full object-contain" />
            </div>
            <span className="text-xs font-semibold text-gray-500 group-hover:text-red-600 transition">Chevrolet</span>
          </Link>

          <Link href="/inventory?make=Ford" className="flex flex-col items-center gap-2 group">
            <div className="flex items-center justify-center w-20 h-16 rounded-2xl border border-gray-200 bg-white shadow-sm group-hover:border-red-400 group-hover:shadow-md transition p-2">
              <img src="/brand-ford.png" alt="Ford" className="w-full h-full object-contain" />
            </div>
            <span className="text-xs font-semibold text-gray-500 group-hover:text-red-600 transition">Ford</span>
          </Link>

          <Link href="/inventory?make=GMC" className="flex flex-col items-center gap-2 group">
            <div className="flex items-center justify-center w-20 h-16 rounded-2xl border border-gray-200 bg-white shadow-sm group-hover:border-red-400 group-hover:shadow-md transition p-2">
              <img src="/brand-gmc.jpg" alt="GMC" className="w-full h-full object-contain" />
            </div>
            <span className="text-xs font-semibold text-gray-500 group-hover:text-red-600 transition">GMC</span>
          </Link>

          <Link href="/inventory?make=Dodge" className="flex flex-col items-center gap-2 group">
            <div className="flex items-center justify-center w-20 h-16 rounded-2xl border border-gray-200 bg-white shadow-sm group-hover:border-red-400 group-hover:shadow-md transition p-2">
              <img src="/brand-dodge.png" alt="Dodge" className="w-full h-full object-contain" />
            </div>
            <span className="text-xs font-semibold text-gray-500 group-hover:text-red-600 transition">Dodge</span>
          </Link>

          <Link href="/inventory?make=Toyota" className="flex flex-col items-center gap-2 group">
            <div className="flex items-center justify-center w-20 h-16 rounded-2xl border border-gray-200 bg-white shadow-sm group-hover:border-red-400 group-hover:shadow-md transition p-2">
              <img src="/brand-toyota.png" alt="Toyota" className="w-full h-full object-contain" />
            </div>
            <span className="text-xs font-semibold text-gray-500 group-hover:text-red-600 transition">Toyota</span>
          </Link>

        </div>
      </section>

      {/* VIN LOOKUP — desktop only 
      <section className="hidden md:block mt-6">
        <VinLookup lang={lang} />
      </section>
      */}

      {/* WHY US */}
      <section className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">

        <div className="rounded-3xl border border-gray-200 bg-gray-50 p-6">
          <h2 className="text-xl font-bold text-gray-900">{t.why.familyTitle[lang]}</h2>
          <p className="mt-2 text-gray-600">{t.why.familyDesc[lang]}</p>
        </div>
        <div className="rounded-3xl border border-gray-200 bg-gray-50 p-6">
          <h2 className="text-xl font-bold text-gray-900">{t.why.finTitle[lang]}</h2>
          <p className="mt-2 text-gray-600">{t.why.finDesc[lang]}</p>
        </div>
        <div className="rounded-3xl border border-gray-200 bg-gray-50 p-6">
          <h2 className="text-xl font-bold text-gray-900">{t.why.suppTitle[lang]}</h2>
          <p className="mt-2 text-gray-600">{t.why.suppDesc[lang]}</p>
        </div>
      </section>

      {/* SEASONAL ANNOUNCEMENT */}
<section className="mt-6">
  <div className="relative overflow-hidden rounded-3xl border-2 border-pink-300 bg-gradient-to-br from-pink-100 via-rose-50 to-purple-100 px-8 py-6 shadow-md text-center">

    <style>{`
      @keyframes floatHeart {
        0% { transform: translateY(0px) rotate(-8deg); }
        50% { transform: translateY(-8px) rotate(8deg); }
        100% { transform: translateY(0px) rotate(-8deg); }
      }
      @keyframes glowPulsePink {
        0%, 100% { box-shadow: 0 0 8px 2px rgba(244,114,182,0.3); border-color: #f9a8d4; }
        50% { box-shadow: 0 0 22px 6px rgba(192,132,252,0.3); border-color: #d8b4fe; }
      }
      @keyframes twinklePink {
        0%, 100% { opacity: 0.15; transform: scale(0.8); }
        50% { opacity: 1; transform: scale(1.2); }
      }
      .float-heart {
        animation: floatHeart 6s ease-in-out infinite;
        display: inline-block;
      }
      .glow-pink {
        animation: glowPulsePink 3s ease-in-out infinite;
      }
      .twinkle-petal {
        position: absolute;
        pointer-events: none;
        user-select: none;
        animation: twinklePink ease-in-out infinite;
      }
    `}</style>

    {/* Glowing border */}
    <div className="glow-pink absolute inset-0 rounded-3xl pointer-events-none" />

    {/* Big floating heart watermark */}
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none opacity-10">
      <span className="float-heart text-[220px] leading-none">🌸</span>
    </div>

    {/* Twinkling petals */}
    <span className="twinkle-petal text-lg" style={{ top: "10%", left: "2%", animationDuration: "2s", animationDelay: "0s" }}>🌸</span>
    <span className="twinkle-petal text-sm" style={{ top: "60%", left: "5%", animationDuration: "3s", animationDelay: "0.4s" }}>🌷</span>
    <span className="twinkle-petal text-lg" style={{ top: "25%", left: "10%", animationDuration: "2.5s", animationDelay: "0.8s" }}>💐</span>
    <span className="twinkle-petal text-sm" style={{ top: "75%", left: "3%", animationDuration: "3.5s", animationDelay: "1.2s" }}>🌺</span>
    <span className="twinkle-petal text-lg" style={{ top: "10%", right: "2%", animationDuration: "2.8s", animationDelay: "0.2s" }}>🌸</span>
    <span className="twinkle-petal text-sm" style={{ top: "60%", right: "5%", animationDuration: "2s", animationDelay: "0.6s" }}>🌷</span>
    <span className="twinkle-petal text-lg" style={{ top: "25%", right: "10%", animationDuration: "3s", animationDelay: "1s" }}>💐</span>
    <span className="twinkle-petal text-sm" style={{ top: "75%", right: "3%", animationDuration: "2.5s", animationDelay: "1.4s" }}>🌺</span>

    <div className="relative z-10">
      <p className="text-3xl md:text-4xl font-extrabold text-gray-800 tracking-tight">
        {lang === "en"
          ? "🌸 Happy Mother's Day! 💐"
          : "🌸 ¡Feliz Día de las Madres! 💐"}
      </p>
      <p className="mt-2 text-gray-600 text-sm font-medium">
        {lang === "en"
          ? "Celebrating all the incredible moms out there today and every day."
          : "Celebrando a todas las mamás increíbles hoy y siempre."}
      </p>
      <p className="mt-1 text-gray-500 text-xs">
        {lang === "en"
          ? "From all of us at Garcia's Auto Sales RGV"
          : "De parte de todo el equipo de Garcia's Auto Sales RGV"}
      </p>
    </div>
  </div>
</section>

{/* VEHICLE SPOTLIGHT */}
{(() => {
  // ✏️ UPDATE THIS EACH MONTH — just change the id and optional overrides
  const spotlightId = "2004-chevrolet-silverado-41337270";
  const priceBefore = 22000; // optional: crossed-out "was" price

  const v = vehicles.find((v) => v.id === spotlightId && v.status !== "sold");
  if (!v) return null;

  const savings = priceBefore && v.price ? priceBefore - v.price : null;

  return (
    <section className="mt-6">
      <div className="relative overflow-hidden rounded-3xl border border-gray-200 bg-gray-50">
        <div className="p-7">

          {/* Header row */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">
              {lang === "en" ? "May 2025" : "Mayo 2025"}
            </span>
            <span className="inline-flex items-center gap-2 bg-red-600 text-white text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-red-300 animate-pulse" />
              {lang === "en" ? "Vehicle of the Month" : "Vehículo del Mes"}
            </span>
          </div>

          {/* Image */}
          <div className="relative rounded-2xl bg-white border border-gray-200 h-52 overflow-hidden mb-5">
            <div className="absolute top-3.5 right-0 z-10 bg-red-600 text-white text-[10px] font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-l shadow-md">
              {lang === "en" ? "On Special" : "En Especial"}
            </div>
            <Image
              src={v.images?.[0] ?? "/cars/placeholder.jpg"}
              alt={`${v.year} ${v.make} ${v.model}`}
              fill
              className="object-cover"
            />
          </div>

          {/* Title + Price */}
          <div className="flex items-start justify-between gap-3 mb-1">
            <h2 className="text-xl font-extrabold text-gray-900 leading-tight">
              {v.year} {v.make} {v.model}{v.trim ? ` ${v.trim}` : ""}
            </h2>
            <div className="text-right shrink-0">
              {priceBefore && (
                <p className="text-xs text-gray-400 line-through mb-0.5">
                  {formatMoney(priceBefore)}
                </p>
              )}
              <p className="text-[22px] font-extrabold text-red-600 leading-none">
                {formatMoney(v.price)}
              </p>
            </div>
          </div>

          <p className="text-[13px] text-gray-500 mb-3">
            {v.miles != null && typeof v.miles === "number"
              ? `${v.miles.toLocaleString()} ${lang === "en" ? "miles" : "millas"} · `
              : ""}
            {v.transmission ?? ""}{v.driveTrain ? ` · ${v.driveTrain}` : ""}
          </p>

          {/* Savings pill */}
          {savings && savings > 0 && (
            <div className="inline-flex items-center gap-1.5 bg-red-50 border border-red-200 rounded-lg px-3 py-1.5 text-[11px] font-bold text-red-600 mb-4">
              🏷️ {lang === "en"
                ? `You save ${formatMoney(savings)} this month`
                : `Ahorras ${formatMoney(savings)} este mes`}
            </div>
          )}

          <div className="h-px bg-gray-200 mb-4" />

          {/* Specs */}
          <div className="grid grid-cols-3 gap-2.5 mb-3.5">
            {[
              { label: lang === "en" ? "Engine"    : "Motor",        val: v.engine ?? "—" },
              { label: lang === "en" ? "Color"     : "Color",        val: v.color  ?? "—" },
              { label: lang === "en" ? "Drive"     : "Tracción",     val: v.driveTrain ?? v.bodyStyle ?? "—" },
            ].map(({ label, val }) => (
              <div key={label} className="bg-white border border-gray-200 rounded-2xl px-3 py-2.5">
                <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-0.5">{label}</p>
                <p className="text-[13px] font-bold text-gray-900">{val}</p>
              </div>
            ))}
          </div>

          {/* Down payment info */}
          {v.down && (
            <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3 mb-4 flex items-center justify-between">
              <span className="text-sm text-gray-500 font-medium">
                {lang === "en" ? "Down payment" : "Enganche"}
              </span>
              <span className="text-sm font-extrabold text-gray-900">
                {formatMoney(v.down)}
              </span>
            </div>
          )}

          {/* CTAs */}
          <div className="flex gap-2.5">
            <Link
              href={`/inventory/${v.id}`}
              className="flex-1 inline-flex items-center justify-center bg-red-600 hover:bg-red-700 text-white font-bold text-sm rounded-2xl py-3.5 transition"
            >
              {lang === "en" ? "View This Vehicle →" : "Ver Vehículo →"}
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 font-semibold text-sm rounded-2xl py-3.5 px-5 transition"
            >
              {lang === "en" ? "Contact Us" : "Contáctanos"}
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
})()}

      {/* FEATURED VEHICLES */} 
      <section className="mt-10">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold text-gray-900">{t.featured.title[lang]}</h2>
            <p className="mt-1 text-gray-600">{t.featured.sub[lang]}</p>
          </div>
          <Link href="/inventory" className="hidden md:inline-flex rounded-2xl border border-gray-200 bg-white px-5 py-3 font-semibold text-gray-900 hover:bg-gray-100 transition">
            {t.featured.viewAll[lang]}
          </Link>
        </div>
        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
          {featured.map((v) => (
            <div key={v.id} className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
              <div className="relative h-52 w-full bg-gray-100">
                <Image src={v.images?.[0] ?? (v as any).image ?? "/cars/placeholder.jpg"} alt={`${v.year} ${v.make} ${v.model}`} fill className="object-cover" />
              </div>
              <div className="p-6">
                <p className="text-lg font-bold text-gray-900">{v.year} {v.make} {v.model}</p>
                <p className="mt-1 text-red-600 font-semibold">{formatMoney(v.price)}</p>
                <p className="mt-1 text-sm text-gray-500">{v.miles != null ? v.miles.toLocaleString() : "N/A"} {t.featured.miles[lang]}</p>
                <Link href={`/inventory/${v.id}`} className="inline-flex mt-4 rounded-2xl bg-red-600 px-5 py-3 font-semibold text-white hover:bg-red-700 transition">
                  {t.featured.viewDet[lang]}
                </Link>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 md:hidden">
          <Link href="/inventory" className="inline-flex w-full items-center justify-center rounded-2xl border border-gray-200 bg-white px-5 py-3 font-semibold text-gray-900 hover:bg-gray-100 transition">
            {t.featured.viewAllMobile[lang]}
          </Link>
        </div>
      </section>

      {/* CONTACT */}
      <section className="mt-10 rounded-3xl border border-gray-200 bg-gray-50 p-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div>
            <h2 className="text-2xl font-extrabold text-gray-900">{t.contact.title[lang]}</h2>
            <p className="mt-2 text-gray-600">{t.contact.sub[lang]}</p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link href="/contact" className="inline-flex items-center justify-center rounded-2xl bg-red-600 px-6 py-4 text-base font-semibold text-white hover:bg-red-700 transition">
                {t.contact.page[lang]}
              </Link>
              <Link href="/inventory" className="inline-flex items-center justify-center rounded-2xl bg-red-600 px-6 py-4 text-base font-semibold text-white hover:bg-red-700 transition">
                {t.contact.browse[lang]}
              </Link>
            </div>
          </div>
          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500 font-semibold uppercase tracking-wide">{t.contact.details[lang]}</p>
            <div className="mt-4 space-y-3 text-gray-700">
              <p><span className="text-gray-400">{t.contact.phone[lang]}</span> (956) 581-0455</p>
              <p><span className="text-gray-400">{t.contact.location[lang]}</span> Palmview, TX</p>
              <p><span className="text-gray-400">{t.contact.hours[lang]}</span> {t.contact.hoursVal[lang]}</p>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="mt-10 pb-10 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} Garcia&apos;s Auto Sales RGV LLC. {t.footer.rights[lang]}
      </footer>
    </main>
  );
}