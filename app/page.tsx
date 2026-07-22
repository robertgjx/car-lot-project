"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { vehicles, Vehicle } from "./lib/vehicles";
import { useLang, t } from "./lib/LanguageContext";
import { Star, Heart, Shield, Car, GraduationCap, Backpack, BookOpen } from "lucide-react";

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
              <p className="flex items-center gap-1.5 font-bold text-green-700 text-sm mb-1">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                  <circle cx="12" cy="12" r="9" />
                  <polyline points="8 12.5 10.5 15 16 9" />
                </svg>
                {lang === "en" ? "We have this vehicle in stock!" : "¡Tenemos este vehículo en inventario!"}
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
  const router = useRouter();
  const [heroQuery, setHeroQuery] = useState("");
  const [showFlyer, setShowFlyer] = useState(false);
  const [featured, setFeatured] = useState<Vehicle[]>(vehicles.filter((v) => v.status !== "sold").slice(0, 3));

  const handleHeroSearch = (e: FormEvent) => {
    e.preventDefault();
    const q = heroQuery.trim();
    router.push(q ? `/inventory?q=${encodeURIComponent(q)}` : "/inventory");
  };

  useEffect(() => {
    fetch("/api/track-view")
      .then((r) => r.json())
      .then(({ top }) => {
        if (top && top.length > 0) {
          const topVehicles: Vehicle[] = top.reduce((acc: Vehicle[], id: string) => {
            const found = vehicles.find((v) => v.id === id);
            if (found && found.status !== "sold") acc.push(found);
            return acc;
          }, []);
          const fallbacks = vehicles.filter((v) => !top.includes(v.id) && v.status !== "sold");
          const combined = [...topVehicles, ...fallbacks].slice(0, 3);
          setFeatured(combined);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <main className="min-h-screen bg-white text-gray-900">

      {/* HERO */}
      <section className="relative w-screen -ml-[var(--sidebar-w,0px)] min-h-[540px] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/lot.PNG"
            alt="Garcia's Auto Sales lot"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-black/30" />
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-red-900/40 via-transparent to-transparent" />
        </div>
        <div className="relative z-10 w-full px-8 md:px-16 py-16">
          <style>{`
            @keyframes heroFadeUp {
              from { opacity: 0; transform: translateY(14px); }
              to   { opacity: 1; transform: translateY(0); }
            }
            .hero-in {
              opacity: 0;
              animation: heroFadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
            }
            @media (prefers-reduced-motion: reduce) {
              .hero-in { opacity: 1; animation: none; }
            }
          `}</style>
          <p
            className="hero-in inline-flex items-center gap-2 rounded-full border border-white/30 bg-black/30 px-4 py-2 text-sm text-white"
            style={{ animationDelay: "0ms" }}
          >
            <span className="h-2 w-2 rounded-full bg-green-400" />
            {t.hero.badge[lang]}
          </p>
          <p
            className="hero-in mt-6 text-sm font-semibold uppercase tracking-widest text-white/70"
            style={{ animationDelay: "120ms" }}
          >
            {lang === "en" ? "Welcome to" : "Bienvenidos a"}
          </p>
          <h1
            className="hero-in mt-1 text-4xl font-extrabold tracking-tight text-white md:text-6xl"
            style={{ animationDelay: "240ms" }}
          >
            Garcia&apos;s Auto Sales RGV
          </h1>
          <div
            className="hero-in mt-6 inline-flex flex-wrap items-center gap-3"
            style={{ animationDelay: "380ms" }}
          >
            <span className="inline-flex items-center gap-2 rounded-2xl bg-red-600 px-5 py-2.5 text-sm font-extrabold text-white uppercase tracking-widest shadow-lg">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                <rect x="1" y="4" width="22" height="16" rx="2" />
                <line x1="1" y1="10" x2="23" y2="10" />
              </svg>
              {lang === "en" ? "Buy Here Pay Here" : "Compra Aquí Paga Aquí"}
            </span>
            <span className="inline-flex items-center gap-2 rounded-2xl bg-white/20 border border-white/40 px-5 py-2.5 text-sm font-bold text-white">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                <circle cx="12" cy="12" r="9" />
                <polyline points="8 12.5 10.5 15 16 9" />
              </svg>
              {lang === "en" ? "No Credit? No Problem!" : "¿Sin Crédito? ¡No Hay Problema!"}
            </span>
          </div>
          <div
            className="hero-in mt-4 flex flex-col gap-3 sm:flex-row"
            style={{ animationDelay: "500ms" }}
          >
            <Link href="/inventory" className="inline-flex items-center justify-center rounded-2xl border border-white/40 bg-black/30 px-6 py-4 text-base font-semibold text-white hover:bg-black/50 transition">
              {t.hero.viewInv[lang]}
            </Link>
            <Link href="/contact" className="inline-flex items-center justify-center rounded-2xl border border-white/40 bg-black/30 px-6 py-4 text-base font-semibold text-white hover:bg-black/50 transition">
              {t.hero.contactUs[lang]}
            </Link>
          </div>
          <form
            onSubmit={handleHeroSearch}
            className="hero-in mt-6 w-full max-w-xl"
            style={{ animationDelay: "620ms" }}
          >
            <div className="flex items-center gap-2 rounded-2xl bg-white shadow-lg p-2">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="ml-2 text-gray-400 shrink-0">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                value={heroQuery}
                onChange={(e) => setHeroQuery(e.target.value)}
                placeholder={lang === "en" ? "Search by year, make, model..." : "Busca por año, marca, modelo..."}
                className="flex-1 min-w-0 bg-transparent outline-none text-gray-900 placeholder-gray-400 px-1 py-2.5 text-sm md:text-base"
              />
              <button
                type="submit"
                className="shrink-0 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold px-5 py-2.5 text-sm whitespace-nowrap transition"
              >
                {lang === "en" ? "Search" : "Buscar"}
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* REST OF PAGE */}
      <div className="max-w-[1800px] mx-auto px-4 md:px-6">

        {/* BRAND STRIP */}
        <section className="mt-8 rounded-3xl border border-gray-200 bg-gray-50 px-6 py-5">
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

      </div>
      {/* ↑ container closed so this banner can go full-bleed edge-to-edge, like the hero ↑ */}

      {/* TWO-PANEL PROMO BANNER — Back to School + July Meat Market offer */}
      <section className="relative w-screen -ml-[var(--sidebar-w,0px)] mt-6">
        <style>{`
          @keyframes emblemFloat {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-7px); }
          }
          .flag-emblem { animation: emblemFloat 3s ease-in-out infinite; }
        `}</style>
        <div className="grid grid-cols-1 md:grid-cols-2">

          {/* Left panel — Back to School Season */}
          <div className="relative overflow-hidden bg-gradient-to-br from-red-700 to-red-900 px-8 py-14 md:py-20 flex flex-col items-center text-center gap-4">
            <div className="flex items-center justify-center gap-3">
              <div
                className="flag-emblem flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/15 border-2 border-white/50 shadow-lg"
                style={{ animationDelay: "0ms" }}
              >
                <Backpack className="w-6 h-6 md:w-7 md:h-7 text-white" strokeWidth={2} />
              </div>
              <GraduationCap className="w-8 h-8 text-amber-400" strokeWidth={2} />
              <div
                className="flag-emblem flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/15 border-2 border-white/50 shadow-lg"
                style={{ animationDelay: "500ms" }}
              >
                <BookOpen className="w-6 h-6 md:w-7 md:h-7 text-white" strokeWidth={2} />
              </div>
            </div>
            <p className="text-2xl md:text-3xl font-extrabold text-white tracking-tight max-w-md">
              {lang === "en" ? "Back to School Season is here 🎒" : "¡Ya llegó la Temporada de Regreso a Clases! 🎒"}
            </p>
            <p className="text-white/75 max-w-sm">
              {lang === "en"
                ? "Get ready for the new school year — check out our full lineup of trucks, SUVs, and cars."
                : "Prepárate para el nuevo ciclo escolar — mira toda nuestra selección de trocas, SUVs y carros."}
            </p>
            <Link
              href="/inventory"
              className="mt-2 inline-flex items-center gap-2 rounded-full border-2 border-white/70 text-white font-semibold px-6 py-3 hover:bg-white/10 transition"
            >
              {lang === "en" ? "View Inventory" : "Ver Inventario"}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </Link>
          </div>

          {/* Right panel — July $50 Meat Market offer */}
          <div className="relative overflow-hidden bg-gray-900 px-8 py-14 md:py-20 flex flex-col items-center text-center gap-4">
            <div className="flex items-center justify-center w-16 h-16 rounded-full border-2 border-white/30">
              <span className="text-white font-extrabold text-sm">$50</span>
            </div>
            <p className="text-2xl md:text-3xl font-extrabold text-white tracking-tight max-w-md">
              {lang === "en" ? "$50 Towards the Meat Market" : "$50 Para la Carnicería"}
            </p>
            <p className="text-white/70 max-w-sm">
              {lang === "en"
                ? "Buy any vehicle in July and get $50 to Carnes Finas Del Valle. Local dealer, real savings."
                : "Compra cualquier vehículo en julio y recibe $50 para Carnes Finas Del Valle. Distribuidor local, ahorros reales."}
            </p>
            <button
              type="button"
              onClick={() => setShowFlyer(true)}
              className="mt-2 inline-flex items-center gap-2 rounded-full border-2 border-white/70 text-white font-semibold px-6 py-3 hover:bg-white/10 transition"
            >
              {lang === "en" ? "View Offer" : "Ver Oferta"}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>

        </div>
      </section>

      {/* July flyer popup */}
      {showFlyer && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={() => setShowFlyer(false)}
        >
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          <div
            className="relative bg-white rounded-3xl shadow-2xl w-full max-w-sm max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowFlyer(false)}
              aria-label={lang === "en" ? "Close" : "Cerrar"}
              className="absolute top-3 right-3 z-10 flex items-center justify-center w-9 h-9 rounded-full bg-black/50 text-white hover:bg-black/70 transition"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
            <Image
              src="/july-meat-market-promo.png"
              alt={lang === "en"
                ? "Get $50 towards the meat market at Carnes Finas Del Valle when you buy any vehicle from Garcia's Auto Sales RGV in July"
                : "Recibe $50 para la carnicería Carnes Finas Del Valle al comprar cualquier vehículo de Garcia's Auto Sales RGV en julio"}
              width={1114}
              height={1400}
              className="w-full h-auto rounded-3xl"
            />
          </div>
        </div>
      )}


      {/* container reopened for the rest of the page */}
      <div className="max-w-[1800px] mx-auto px-4 md:px-6">

        {/* FEATURED VEHICLES */}
        <section className="mt-10">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-extrabold text-gray-900">
                {lang === "en" ? "Check Out Our Most Viewed Vehicles" : "Mira Nuestros Vehículos Más Vistos"}
              </h2>
              <p className="mt-1 text-gray-600">
                {lang === "en" ? "The vehicles catching the most attention right now." : "Los vehículos que más atención están recibiendo ahora mismo."}
              </p>
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

      </div>
    </main>
  );
}