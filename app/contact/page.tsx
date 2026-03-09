"use client";

import { useLang, t } from "@/app/lib/LanguageContext";

export default function ContactPage() {
  const { lang } = useLang();

  return (
    <main className="min-h-screen">
      <h1 className="text-4xl font-bold text-gray-900">{t.nav.contact[lang]}</h1>
      <p className="mt-2 text-gray-500">
        {lang === "en"
          ? "Call to ask about a vehicle or in-house financing."
          : "Llama para preguntar sobre un vehículo o financiamiento propio."}
      </p>

      <div className="mt-6 bg-gray-50 border border-gray-200 rounded-2xl p-6 space-y-4 shadow-sm">
        <p>
          <span className="text-gray-400">{lang === "en" ? "Office Phone:" : "Teléfono de oficina:"}</span>{" "}
          <a href="tel:9565810455" className="text-red-600 font-semibold hover:underline">
            (956) 581-0455
          </a>
        </p>

        {/* LOCATIONS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-widest text-red-500 mb-1">
              {lang === "en" ? "Location 1" : "Ubicación 1"}
            </p>
            <p className="text-gray-900 font-medium">1801 W Palma Vista Dr.</p>
            <p className="text-gray-500 text-sm">Palmview, TX 78572</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-widest text-red-500 mb-1">
              {lang === "en" ? "Location 2" : "Ubicación 2"}
            </p>
            <p className="text-gray-900 font-medium">1800 W Veterans Blvd.</p>
            <p className="text-gray-500 text-sm">Palmview, TX 78572</p>
          </div>
        </div>

        <hr className="border-gray-200" />

        <div>
          <p className="text-gray-500 text-sm font-semibold uppercase tracking-wide">
            {lang === "en"
              ? "For any questions, please call one of our inventory associates:"
              : "Para cualquier pregunta, por favor llama a uno de nuestros asociados de inventario:"}
          </p>
          <div className="mt-3 bg-white border border-gray-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 shadow-sm">
            <span className="text-gray-900 font-semibold text-lg">Caesar</span>
            <a href="tel:9564789359" className="text-red-600 font-semibold hover:underline">
              (956) 478-9359
            </a>
          </div>
        </div>

        <hr className="border-gray-200" />

        <div className="flex flex-col items-center gap-3 pt-2">
          <p className="text-sm text-gray-400">
            {lang === "en" ? "Follow us on Facebook" : "Síguenos en Facebook"}
          </p>
          <a
            href="https://facebook.com/garciasautosalesrgvllc"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-3 rounded-2xl bg-red-600 px-5 py-4 hover:bg-red-700 transition"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
            </svg>
            <span className="font-semibold text-white">Garcia&apos;s Auto Sales RGV</span>
          </a>
        </div>
      </div>

      {/* MAP 1 */}
      <div className="mt-8">
        <h2 className="text-xl font-bold text-gray-900 mb-1">
          {lang === "en" ? "Location 1" : "Ubicación 1"}
        </h2>
        <p className="text-sm text-gray-500 mb-3">1801 W Palma Vista Dr, Palmview, TX 78572</p>
        <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3597.5!2d-98.37416!3d26.22896!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8665890b7a3c9a1f%3A0xa2b3c4d5e6f70819!2s1801+W+Palma+Vista+Dr%2C+Palmview%2C+TX+78572!5e0!3m2!1sen!2sus!4v1709000000000!5m2!1sen!2sus"
            width="100%"
            height="380"
            style={{ border: 0, display: "block" }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Garcia's Auto Sales RGV - Location 1"
          />
        </div>
        <a
          href="https://maps.google.com/?q=1801+W+Palma+Vista+Dr+Palmview+TX+78572"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 w-full inline-flex items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white px-5 py-3 font-semibold text-gray-900 hover:bg-gray-100 transition"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
          {lang === "en" ? "Open in Google Maps" : "Abrir en Google Maps"}
        </a>
      </div>

      {/* MAP 2 */}
      <div className="mt-8">
        <h2 className="text-xl font-bold text-gray-900 mb-1">
          {lang === "en" ? "Location 2" : "Ubicación 2"}
        </h2>
        <p className="text-sm text-gray-500 mb-3">1800 W Veterans Blvd, Palmview, TX 78572</p>
        <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3597.5!2d-98.37500!3d26.23100!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8665890b00000000%3A0x0000000000000000!2s1800+W+Veterans+Blvd%2C+Palmview%2C+TX+78572!5e0!3m2!1sen!2sus!4v1709000000001!5m2!1sen!2sus"
            width="100%"
            height="380"
            style={{ border: 0, display: "block" }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Garcia's Auto Sales RGV - Location 2"
          />
        </div>
        <a
          href="https://maps.google.com/?q=1800+W+Veterans+Blvd+Palmview+TX+78572"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 w-full inline-flex items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white px-5 py-3 font-semibold text-gray-900 hover:bg-gray-100 transition"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
          {lang === "en" ? "Open in Google Maps" : "Abrir en Google Maps"}
        </a>
      </div>

      {/* FOOTER SPACE */}
      <div className="pb-10" />
    </main>
  );
}