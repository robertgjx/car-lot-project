"use client";

import Link from "next/link";
import Image from "next/image";
import { vehicles } from "./vehicles";
import { useLang } from "./LanguageContext";

function formatMoney(n: number | null | undefined) {
  if (n == null) return "N/A";
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

// ✏️ UPDATE THESE TWO LINES EACH MONTH
const SPOTLIGHT_ID = "2010-ford-ranger-apa35570";
const PRICE_BEFORE: number | null = 8900;

export default function SpotlightSidebar() {
  const { lang } = useLang();

  const v = vehicles.find((v) => v.id === SPOTLIGHT_ID && v.status !== "sold");
  if (!v) return null;

  const savings = PRICE_BEFORE && v.price ? PRICE_BEFORE - v.price : null;

  return (
    <aside className="hidden xl:flex flex-col w-[260px] shrink-0">
      <div className="sticky top-8">
        <div className="rounded-2xl border-2 border-red-600 bg-white overflow-hidden shadow-sm">

          {/* Top bar */}
          <div className="bg-red-600 flex items-center justify-between px-4 py-2.5">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-300 animate-pulse" />
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-white">
                {lang === "en" ? "Vehicle of the Month" : "Vehículo del Mes"}
              </span>
            </div>
          </div>

          {/* Photo — natural aspect ratio */}
          <div className="relative w-full bg-gray-100">
            <Image
              src={v.images?.[0] ?? "/cars/placeholder.jpg"}
              alt={`${v.year} ${v.make} ${v.model}`}
              width={260}
              height={0}
              sizes="260px"
              style={{ width: "100%", height: "auto" }}
              className="object-cover"
            />
            {/* On Special ribbon */}
            <div className="absolute bottom-3 left-0 bg-red-600 text-white text-[9px] font-extrabold uppercase tracking-widest px-3 py-1.5 rounded-r">
              {lang === "en" ? "On Special" : "En Especial"}
            </div>
          </div>

          {/* Info */}
          <div className="px-4 pt-4 pb-4 flex flex-col gap-3">

            {/* Title */}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-red-600 mb-0.5">
                {v.year} {v.make}
              </p>
              <p className="text-[17px] font-extrabold text-gray-900 leading-tight">
                {v.model}{v.trim ? ` ${v.trim}` : ""}
              </p>
              {typeof v.miles === "number" && (
                <p className="text-[11px] text-gray-500 mt-0.5">
                  {v.miles.toLocaleString()} {lang === "en" ? "miles" : "millas"}
                  {v.transmission ? ` · ${v.transmission}` : ""}
                </p>
              )}
            </div>

            {/* Price box */}
            <div className="bg-red-50 border border-red-200 rounded-xl px-3 py-3">
              <p className="text-[9px] font-bold uppercase tracking-widest text-red-400 mb-1">
                {lang === "en" ? "This month's price" : "Precio este mes"}
              </p>
              {PRICE_BEFORE && (
                <p className="text-[11px] text-gray-400 line-through leading-none mb-1">
                  {formatMoney(PRICE_BEFORE)}
                </p>
              )}
              <p className="text-[24px] font-extrabold text-red-600 leading-none">
                {formatMoney(v.price)}
              </p>
              {savings && savings > 0 && (
                <div className="inline-flex items-center gap-1.5 mt-2 bg-white border border-red-200 rounded-full px-2.5 py-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                  <span className="text-[10px] font-bold text-red-600">
                    {lang === "en" ? `Save ${formatMoney(savings)}` : `Ahorras ${formatMoney(savings)}`}
                  </span>
                </div>
              )}
            </div>

            {/* Specs */}
            <div className="grid grid-cols-2 gap-1.5">
              {[
                { l: lang === "en" ? "Engine"  : "Motor",       v: v.engine    ?? "—" },
                { l: lang === "en" ? "Color"   : "Color",       v: v.color     ?? "—" },
                { l: lang === "en" ? "Body"    : "Carrocería",  v: v.bodyStyle ?? "—" },
                { l: lang === "en" ? "Down"    : "Enganche",    v: formatMoney(v.down) },
              ].map(({ l, v: val }) => (
                <div key={l} className="bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-2">
                  <p className="text-[8px] font-bold uppercase tracking-widest text-gray-400 mb-0.5">{l}</p>
                  <p className="text-[11px] font-bold text-gray-900 leading-tight">{val}</p>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-col gap-2">
              <Link
                href={`/inventory/${v.id}`}
                className="w-full inline-flex items-center justify-center bg-red-600 hover:bg-red-700 text-white font-extrabold text-[12px] rounded-xl py-3 transition"
              >
                {lang === "en" ? "View This Vehicle →" : "Ver Vehículo →"}
              </Link>
              <Link
                href="/contact"
                className="w-full inline-flex items-center justify-center bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 font-semibold text-[12px] rounded-xl py-2.5 transition"
              >
                {lang === "en" ? "Contact Us" : "Contáctanos"}
              </Link>
            </div>

          </div>
        </div>
      </div>
    </aside>
  );
}