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
          <p className="mt-4 max-w-2xl text-lg text-gray-100 md:text-xl">{t.hero.sub[lang]}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/inventory" className="inline-flex items-center justify-center rounded-2xl bg-red-600 px-6 py-4 text-base font-semibold text-white hover:bg-red-700 transition">
              {t.hero.viewInv[lang]}
            </Link>
            <Link href="/contact" className="inline-flex items-center justify-center rounded-2xl border border-white/40 bg-black/30 px-6 py-4 text-base font-semibold text-white hover:bg-black/50 transition">
              {t.hero.contactUs[lang]}
            </Link>
          </div>
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