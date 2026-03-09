"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Vehicle } from "@/app/lib/vehicles";
import { useLang, t } from "@/app/lib/LanguageContext";

function formatMoney(n: number | null | undefined) {
  if (n == null) return "N/A";
  return n.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

function LightboxGallery({ images, alt }: { images: string[]; alt: string }) {
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
      <div
        className="relative w-full h-[320px] md:h-[420px] rounded-2xl overflow-hidden bg-gray-100 cursor-zoom-in"
        onClick={() => openLightbox(0)}
      >
        <Image src={mainImg} alt={alt} fill className="object-cover" priority />
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
              <div
                key={src}
                className="relative w-full h-56 rounded-2xl overflow-hidden bg-gray-100 cursor-zoom-in"
                onClick={() => openLightbox(i + 1)}
              >
                <Image src={src} alt="Vehicle photo" fill className="object-cover hover:scale-105 transition-transform duration-200" />
                <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded-lg">
                  {i + 2} / {images.length}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Lightbox stays dark — intentional for photo viewing */}
      {lightboxIndex !== null && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center" onClick={closeLightbox}>
          <button
            className="absolute top-4 right-4 z-50 bg-zinc-800 hover:bg-zinc-700 text-white rounded-full w-10 h-10 flex items-center justify-center text-xl font-bold transition"
            onClick={closeLightbox}
          >
            ✕
          </button>
          <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/60 text-white text-sm px-3 py-1 rounded-full">
            {lightboxIndex + 1} / {images.length}
          </div>
          {images.length > 1 && (
            <button
              className="absolute left-4 bg-zinc-800 hover:bg-zinc-700 text-white rounded-full w-10 h-10 flex items-center justify-center text-xl transition"
              onClick={(e) => { e.stopPropagation(); prev(); }}
            >
              ‹
            </button>
          )}
          <div
            className="relative mx-12 md:mx-16"
            style={{ width: "calc(100vw - 96px)", height: "calc(100vh - 80px)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[lightboxIndex]}
              alt={`${alt} photo ${lightboxIndex + 1}`}
              fill
              className="object-contain"
              priority
            />
          </div>
          {images.length > 1 && (
            <button
              className="absolute right-4 bg-zinc-800 hover:bg-zinc-700 text-white rounded-full w-10 h-10 flex items-center justify-center text-xl transition"
              onClick={(e) => { e.stopPropagation(); next(); }}
            >
              ›
            </button>
          )}
        </div>
      )}
    </>
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

  return (
    <main className="min-h-screen bg-white text-gray-900 p-6 md:p-10">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between">
          <Link href="/inventory" className="rounded-xl border border-gray-200 bg-white px-5 py-3 font-semibold text-gray-900 hover:bg-gray-100 transition">
            {t.det.back[lang]}
          </Link>
          <div className="text-sm text-gray-500">
            {t.det.status[lang]}{" "}
            <span className="font-semibold text-gray-900">{vehicle.status ?? "N/A"}</span>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-8">
          <LightboxGallery
            images={images}
            alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
          />
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 md:p-8 shadow-sm">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              {vehicle.year} {vehicle.make} {vehicle.model}
            </h1>
            <p className="mt-4 text-2xl font-bold text-red-600">{formatMoney(vehicle.price)}</p>
            <div className="mt-6 space-y-3 text-gray-600">
              <div className="flex justify-between border-b border-gray-100 pb-2">
                <span>{t.det.vin[lang]}</span>
                <span className="font-semibold text-gray-900">{vehicle.vin ?? "N/A"}</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 pb-2">
                <span>{t.det.miles[lang]}</span>
                <span className="font-semibold text-gray-900">{vehicle.miles != null ? vehicle.miles.toLocaleString() : "N/A"}</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 pb-2">
                <span>{t.det.drive[lang]}</span>
                <span className="font-semibold text-gray-900">{vehicle.driveTrain ?? "N/A"}</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 pb-2">
                <span>{t.det.fuel[lang]}</span>
                <span className="font-semibold text-gray-900">{vehicle.fuel ?? "N/A"}</span>
              </div>
              <div className="flex justify-between">
                <span>{t.det.down[lang]}</span>
                <span className="font-semibold text-red-600">{formatMoney(vehicle.down)}</span>
              </div>
            </div>
            <Link
              href="/contact"
              className="mt-8 w-full inline-flex items-center justify-center rounded-xl bg-red-600 px-6 py-4 text-base font-semibold text-white hover:bg-red-700 transition"
            >
              {lang === "en" ? "Contact Us About This Vehicle" : "Contáctanos Sobre Este Vehículo"}
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}