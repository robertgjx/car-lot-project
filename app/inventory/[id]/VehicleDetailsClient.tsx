"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Vehicle } from "@/app/lib/vehicles";
import { useLang, t } from "@/app/lib/LanguageContext";

function formatMoney(n: number | null | undefined) {
  if (n == null) return "N/A";
  return n.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

function calcMonthly(price: number | null | undefined, down: number | null | undefined, term?: number | null): string {
  if (price == null) return "N/A";
  const d = down ?? 0;
  const t = term ?? 24;
  const monthly = ((price + 3000) - d) / t;
  return monthly.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

function val(v: string | number | null | undefined): string {
  if (v === null || v === undefined || v === "") return "N/A";
  return String(v);
}

function LightboxGallery({ images, alt, onShare }: { images: string[]; alt: string; onShare: () => void }) {
  const { lang } = useLang();
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const mainImg = images[0] ?? "/cars/placeholder.jpg";
  const restImgs = images.slice(1);

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);
  const prev = () => setLightboxIndex((i) => (i !== null ? (i - 1 + images.length) % images.length : 0));
  const next = () => setLightboxIndex((i) => (i !== null ? (i + 1) % images.length : 0));

  return (
    <>
      <div className="relative w-full h-[320px] md:h-[420px] rounded-2xl overflow-hidden bg-gray-100 cursor-zoom-in" onClick={() => openLightbox(0)}>
        <Image src={mainImg} alt={alt} fill className="object-cover" priority />
        <button
          onClick={(e) => { e.stopPropagation(); onShare(); }}
          className="absolute top-3 right-3 z-10 bg-white/90 hover:bg-white text-gray-700 p-2 rounded-xl shadow-md transition backdrop-blur-sm">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
          </svg>
        </button>
        {images.length > 1 && (
          <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded-lg">
            1 / {images.length}
          </div>
        )}
      </div>

      {restImgs.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-900">{t.det.photos[lang]}</h2>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {restImgs.map((src, i) => (
              <div key={src} className="relative w-full h-56 rounded-2xl overflow-hidden bg-gray-100 cursor-zoom-in" onClick={() => openLightbox(i + 1)}>
                <Image src={src} alt="Vehicle photo" fill className="object-cover hover:scale-105 transition-transform duration-200" />
                <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded-lg">
                  {i + 2} / {images.length}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {lightboxIndex !== null && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center" onClick={closeLightbox}>
          <button className="absolute top-4 right-4 z-50 bg-zinc-800 hover:bg-zinc-700 text-white rounded-full w-10 h-10 flex items-center justify-center text-xl font-bold transition" onClick={closeLightbox}>✕</button>
          <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/60 text-white text-sm px-3 py-1 rounded-full">
            {lightboxIndex + 1} / {images.length}
          </div>
          {images.length > 1 && (
            <button className="absolute left-4 bg-zinc-800 hover:bg-zinc-700 text-white rounded-full w-10 h-10 flex items-center justify-center text-xl transition" onClick={(e) => { e.stopPropagation(); prev(); }}>‹</button>
          )}
          <div className="relative mx-12 md:mx-16" style={{ width: "calc(100vw - 96px)", height: "calc(100vh - 80px)" }} onClick={(e) => e.stopPropagation()}>
            <Image src={images[lightboxIndex]} alt={`${alt} photo ${lightboxIndex + 1}`} fill className="object-contain" priority />
          </div>
          {images.length > 1 && (
            <button className="absolute right-4 bg-zinc-800 hover:bg-zinc-700 text-white rounded-full w-10 h-10 flex items-center justify-center text-xl transition" onClick={(e) => { e.stopPropagation(); next(); }}>›</button>
          )}
        </div>
      )}
    </>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between border-b border-gray-100 pb-2">
      <span className="text-gray-500">{label}</span>
      <span className={`font-semibold ${value === "N/A" ? "text-gray-400" : "text-gray-900"}`}>{value}</span>
    </div>
  );
}

export default function VehicleDetailsClient({
  vehicle,
  decodedId,
}: {
  vehicle: Vehicle | undefined;
  decodedId: string;
}) {
  const { lang } = useLang();

  useEffect(() => {
    if (vehicle?.id) {
      fetch("/api/track-view", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: vehicle.id }),
      }).catch(() => {});
    }
  }, [vehicle?.id]);

  const estLabel = lang === "en" ? "Est. Monthly Payment" : "Pago Mensual Est.";
  const moLabel  = lang === "en" ? "/mo" : "/mes";
  const contactBtn = lang === "en" ? "Contact Us About This Vehicle" : "Contáctanos Sobre Este Vehículo";

  async function handleShare() {
    if (!vehicle) return;
    const title = `${vehicle.year} ${vehicle.make} ${vehicle.model}`;
    const url = window.location.href;
    const text = lang === "en"
      ? `Check out this ${title} at Garcia's Auto Sales RGV!`
      : `¡Mira este ${title} en Garcia's Auto Sales RGV!`;
    if (navigator.share) {
      await navigator.share({ title, text, url });
    } else {
      await navigator.clipboard.writeText(url);
      alert(lang === "en" ? "Link copied!" : "¡Enlace copiado!");
    }
  }

  if (!vehicle) {
    return (
      <main className="min-h-screen bg-white text-gray-900 p-6 md:p-10">
        <div className="max-w-5xl mx-auto">
          <Link href="/inventory" className="inline-block rounded-xl border border-gray-200 bg-white px-5 py-3 font-semibold text-gray-900 hover:bg-gray-100 transition">
            {t.det.back[lang]}
          </Link>
          <div className="mt-8 bg-gray-50 border border-gray-200 rounded-2xl p-6">
            <div className="text-xl font-semibold text-gray-900">{t.det.notFound[lang]}</div>
            <div className="mt-2 text-sm text-gray-500">
              {t.det.triedId[lang]} <span className="font-mono">{decodedId}</span>
            </div>
          </div>
        </div>
      </main>
    );
  }

  const images =
    Array.isArray(vehicle.images) && vehicle.images.length > 0
      ? vehicle.images
      : (vehicle as any).image
      ? [(vehicle as any).image]
      : ["/cars/placeholder.jpg"];

  const estNote = lang === "en"
    ? `Based on listed down payment • ${vehicle.term ?? 24} month financing`
    : `Con el enganche indicado • Financiamiento a ${vehicle.term ?? 24} meses`;

  return (
    <main className="min-h-screen bg-white text-gray-900 p-6 md:p-10">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between">
          <Link href="/inventory" className="rounded-xl border border-gray-200 bg-white px-5 py-3 font-semibold text-gray-900 hover:bg-gray-100 transition">
            {t.det.back[lang]}
          </Link>
          <div className="flex items-center gap-2">
            {vehicle.status === "sold" ? (
              <span className="bg-red-600 text-white font-extrabold text-sm px-4 py-2 rounded-xl tracking-widest uppercase shadow">
                🔴 {lang === "en" ? "Sold" : "Vendido"}
              </span>
            ) : vehicle.status === "available" ? (
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-green-500 shadow-sm shadow-green-400 animate-pulse inline-block" />
                <span className="hidden sm:inline font-extrabold text-sm text-green-600 uppercase tracking-widest">
                  {lang === "en" ? "Available" : "Disponible"}
                </span>
              </span>
            ) : (
              <span className="bg-yellow-500 text-white font-extrabold text-sm px-4 py-2 rounded-xl tracking-widest uppercase shadow">
                🟡 {vehicle.status}
              </span>
            )}
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-8">
          <LightboxGallery images={images} alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`} onShare={handleShare} />

          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 md:p-8 shadow-sm">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              {vehicle.year} {vehicle.make} {vehicle.model}
              {vehicle.trim ? <span className="text-xl font-medium text-gray-400 ml-2">{vehicle.trim}</span> : null}
            </h1>

            <p className="mt-3 text-2xl font-bold text-red-600">{formatMoney(vehicle.price)}</p>

            <div className="mt-2 flex items-center gap-2">
              <span className="text-xs text-gray-400 uppercase tracking-wide font-medium">{estLabel}</span>
              <span className="text-lg font-bold text-gray-900">{calcMonthly(vehicle.price, vehicle.down, vehicle.term)}{moLabel}</span>
            </div>
            <p className="text-xs text-gray-400 mt-0.5">{estNote}</p>

            <div className="mt-6">
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">
                {lang === "en" ? "Pricing" : "Precios"}
              </p>
              <div className="space-y-2">
                <Row label={lang === "en" ? "Price" : "Precio"} value={formatMoney(vehicle.price)} />
                <Row label={lang === "en" ? "Down Payment" : "Enganche"} value={formatMoney(vehicle.down)} />
              </div>
            </div>

            <div className="mt-6">
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">
                {lang === "en" ? "Vehicle Info" : "Información del Vehículo"}
              </p>
              <div className="space-y-2">
                <Row label="VIN" value={val(vehicle.vin)} />
                <Row label={lang === "en" ? "Miles" : "Millas"} value={vehicle.miles != null ? vehicle.miles.toLocaleString() : "N/A"} />
                <Row label={lang === "en" ? "Trim" : "Versión"} value={val(vehicle.trim)} />
                <Row label={lang === "en" ? "Body Style" : "Tipo de Carrocería"} value={val(vehicle.bodyStyle)} />
                <Row label={lang === "en" ? "Doors" : "Puertas"} value={val(vehicle.doors)} />
                <Row label={lang === "en" ? "Color" : "Color"} value={val(vehicle.color)} />
              </div>
            </div>

            <div className="mt-6">
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">
                {lang === "en" ? "Mechanical" : "Mecánica"}
              </p>
              <div className="space-y-2">
                <Row label={lang === "en" ? "Engine" : "Motor"} value={val(vehicle.engine)} />
                <Row label={lang === "en" ? "Transmission" : "Transmisión"} value={val(vehicle.transmission)} />
                <Row label={lang === "en" ? "Drive Train" : "Tracción"} value={val(vehicle.driveTrain)} />
                <Row label={lang === "en" ? "Fuel Type" : "Combustible"} value={val(vehicle.fuel)} />
              </div>
            </div>

            <Link href="/contact" className="mt-8 w-full inline-flex items-center justify-center rounded-xl bg-red-600 px-6 py-4 text-base font-semibold text-white hover:bg-red-700 transition">
              {contactBtn}
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}