"use client";

import Link from "next/link";
import Image from "next/image";
import { vehicles } from "./lib/vehicles";
import { useLang, t } from "./lib/LanguageContext";

function formatMoney(n: number | null | undefined) {
  if (n == null) return "N/A";
  return n.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

export default function Home() {
  const { lang } = useLang();
  const featured = vehicles.slice(0, 3);

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
          <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-white md:text-6xl">Garcia&apos;s Auto Sales RGV</h1>
          {/* subtitle removed */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
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
        <div className="flex items-center justify-around gap-4 flex-wrap">

          {/* CHEVROLET */}
          <Link href="/inventory?make=Chevrolet" className="flex flex-col items-center gap-2 group">
            <div className="flex items-center justify-center w-16 h-16 rounded-2xl border border-gray-200 bg-white shadow-sm group-hover:border-red-400 group-hover:shadow-md transition">
              <svg viewBox="0 0 100 60" className="w-12 h-8" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 20h30v20H0V20z" fill="#D4A017"/>
                <path d="M35 0h30v20H35V0z" fill="#D4A017"/>
                <path d="M35 40h30v20H35V40z" fill="#D4A017"/>
                <path d="M70 20h30v20H70V20z" fill="#D4A017"/>
              </svg>
            </div>
            <span className="text-xs font-semibold text-gray-500 group-hover:text-red-600 transition">Chevrolet</span>
          </Link>

          {/* FORD */}
          <Link href="/inventory?make=Ford" className="flex flex-col items-center gap-2 group">
            <div className="flex items-center justify-center w-16 h-16 rounded-2xl border border-gray-200 bg-white shadow-sm group-hover:border-red-400 group-hover:shadow-md transition">
              <svg viewBox="0 0 120 50" className="w-14 h-8" xmlns="http://www.w3.org/2000/svg">
                <ellipse cx="60" cy="25" rx="58" ry="23" fill="#003478"/>
                <text x="60" y="33" textAnchor="middle" fontFamily="serif" fontStyle="italic" fontWeight="bold" fontSize="28" fill="white">Ford</text>
              </svg>
            </div>
            <span className="text-xs font-semibold text-gray-500 group-hover:text-red-600 transition">Ford</span>
          </Link>

          {/* GMC */}
          <Link href="/inventory?make=GMC" className="flex flex-col items-center gap-2 group">
            <div className="flex items-center justify-center w-16 h-16 rounded-2xl border border-gray-200 bg-white shadow-sm group-hover:border-red-400 group-hover:shadow-md transition">
              <svg viewBox="0 0 80 40" className="w-12 h-8" xmlns="http://www.w3.org/2000/svg">
                <rect x="1" y="1" width="78" height="38" rx="4" fill="white" stroke="#CC0000" strokeWidth="2"/>
                <text x="40" y="28" textAnchor="middle" fontFamily="Arial Black, sans-serif" fontWeight="900" fontSize="22" fill="#CC0000" letterSpacing="2">GMC</text>
              </svg>
            </div>
            <span className="text-xs font-semibold text-gray-500 group-hover:text-red-600 transition">GMC</span>
          </Link>

          {/* DODGE */}
          <Link href="/inventory?make=Dodge" className="flex flex-col items-center gap-2 group">
            <div className="flex items-center justify-center w-16 h-16 rounded-2xl border border-gray-200 bg-white shadow-sm group-hover:border-red-400 group-hover:shadow-md transition">
              <svg viewBox="0 0 60 60" className="w-10 h-10" xmlns="http://www.w3.org/2000/svg">
                <polygon points="30,2 58,15 58,45 30,58 2,45 2,15" fill="#CC0000"/>
                <polygon points="30,10 50,20 50,40 30,50 10,40 10,20" fill="white"/>
                <text x="30" y="34" textAnchor="middle" fontFamily="Arial Black, sans-serif" fontWeight="900" fontSize="11" fill="#CC0000">DODGE</text>
              </svg>
            </div>
            <span className="text-xs font-semibold text-gray-500 group-hover:text-red-600 transition">Dodge</span>
          </Link>

          {/* TOYOTA */}
          <Link href="/inventory?make=Toyota" className="flex flex-col items-center gap-2 group">
            <div className="flex items-center justify-center w-16 h-16 rounded-2xl border border-gray-200 bg-white shadow-sm group-hover:border-red-400 group-hover:shadow-md transition">
              <svg viewBox="0 0 100 60" className="w-12 h-8" xmlns="http://www.w3.org/2000/svg">
                <ellipse cx="50" cy="30" rx="22" ry="28" fill="none" stroke="#CC0000" strokeWidth="6"/>
                <ellipse cx="50" cy="30" rx="42" ry="18" fill="none" stroke="#CC0000" strokeWidth="6"/>
                <ellipse cx="50" cy="12" rx="14" ry="10" fill="none" stroke="#CC0000" strokeWidth="6"/>
              </svg>
            </div>
            <span className="text-xs font-semibold text-gray-500 group-hover:text-red-600 transition">Toyota</span>
          </Link>

        </div>
      </section>

      {/* WHY US */}
      <section className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">

        {/* FAMILY OWNED — photo background with overlay */}
        <div className="relative overflow-hidden rounded-3xl border border-gray-200 min-h-[180px] p-6">
          <div className="absolute inset-0 z-0">
            <img src="/FamilyOwnedPhoto.jpg" alt="Family Owned" className="h-full w-full object-cover opacity-40" />
            <div className="absolute inset-0 bg-white/40" />
          </div>
          <div className="relative z-10">
            <h2 className="text-xl font-bold text-gray-900">{t.why.familyTitle[lang]}</h2>
            <p className="mt-2 text-gray-700">{t.why.familyDesc[lang]}</p>
          </div>
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
              <Link href="/inventory" className="inline-flex items-center justify-center rounded-2xl border border-gray-300 bg-white px-6 py-4 text-base font-semibold text-gray-900 hover:bg-gray-100 transition">
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