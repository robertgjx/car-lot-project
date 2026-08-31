"use client";

import { useLang, t } from "@/app/lib/LanguageContext";
import { Phone, MapPin, Clock, User, ExternalLink, Navigation } from "lucide-react";

const associates = [
  { name: "Cesar", phone: "9564789359", display: "(956) 478-9359" },
];

const weeklyHours = [
  { day: { en: "Monday", es: "Lunes" }, hours: "9:00 AM – 6:00 PM" },
  { day: { en: "Tuesday", es: "Martes" }, hours: "9:00 AM – 6:00 PM" },
  { day: { en: "Wednesday", es: "Miércoles" }, hours: "9:00 AM – 6:00 PM" },
  { day: { en: "Thursday", es: "Jueves" }, hours: "9:00 AM – 6:00 PM" },
  { day: { en: "Friday", es: "Viernes" }, hours: "9:00 AM – 6:00 PM" },
  { day: { en: "Saturday", es: "Sábado" }, hours: "10:00 AM – 4:00 PM" },
  { day: { en: "Sunday", es: "Domingo" }, hours: "Closed" },
];

function WeeklyHoursCard({ lang }: { lang: string }) {
  // getDay(): 0 = Sunday ... 6 = Saturday. Our array is Monday-first, so shift by 1.
  const todayIndex = (new Date().getDay() + 6) % 7;

  return (
    <div className="rounded-3xl border border-gray-200 bg-gray-50 p-6">
      <div className="flex flex-col gap-1.5">
        {weeklyHours.map((row, i) => {
          const isToday = i === todayIndex;
          const hoursLabel =
            row.hours === "Closed" ? (lang === "en" ? "Closed" : "Cerrado") : row.hours;
          return (
            <div
              key={row.day.en}
              className={`flex items-center justify-between rounded-xl px-3 py-2 transition ${
                isToday ? "bg-green-100 text-green-800 font-semibold" : "text-gray-700"
              }`}
            >
              <span>{row.day[lang as "en" | "es"]}</span>
              <span>{hoursLabel}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function ContactPage() {
  const { lang } = useLang();

  const locations = [
    {
      key: "loc1",
      label: lang === "en" ? "Location 1" : "Ubicación 1",
      address: "1801 W Palma Vista Dr.",
      cityState: "Palmview, TX 78572",
      phone: "9565810455",
      phoneDisplay: "(956) 581-0455",
      mapsQuery: "1801+W+Palma+Vista+Dr+Palmview+TX+78572",
    },
    {
      key: "loc2",
      label: lang === "en" ? "Location 2" : "Ubicación 2",
      address: "1800 W Veterans Blvd.",
      cityState: "Palmview, TX 78572",
      phone: "9565999025",
      phoneDisplay: "(956) 599-9025",
      mapsQuery: "1800+W+Veterans+Blvd+Palmview+TX+78572",
    },
  ];

  return (
    <main className="min-h-screen bg-white text-gray-900">

      {/* HERO */}
      <section className="relative w-full min-h-[360px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img src="/lot.PNG" alt="Garcia's Auto Sales lot" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-br from-red-900/80 via-black/60 to-gray-900/80" />
        </div>
        <div className="relative z-10 text-center px-4 py-20">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
            {lang === "en" ? "Get in Touch" : "Ponte en Contacto"}
          </h1>
          <p className="mt-3 text-white/80 max-w-lg mx-auto">
            {lang === "en"
              ? "Want to ask about a vehicle or in-house financing? Here's how to reach us."
              : "¿Preguntas sobre un vehículo o financiamiento propio? Así puedes contactarnos."}
          </p>
        </div>
      </section>

      <div className="max-w-[1800px] mx-auto p-4 md:p-6">

        {/* LOCATIONS — overlapping the hero */}
        <section className="-mt-20 relative z-20 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {locations.map((loc) => (
            <div key={loc.key} className="relative overflow-hidden rounded-3xl bg-white shadow-xl p-6 text-center">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-red-600" />
              <span className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-red-50 text-red-600 mb-4">
                <MapPin className="w-6 h-6" strokeWidth={2} />
              </span>
              <p className="text-xs font-bold uppercase tracking-widest text-red-500">{loc.label}</p>
              <p className="mt-1 text-gray-900 font-bold text-lg">{loc.address}</p>
              <p className="text-gray-500 text-sm">{loc.cityState}</p>
              <a href={`tel:${loc.phone}`} className="mt-3 inline-flex items-center justify-center gap-1.5 text-red-600 font-bold hover:underline text-sm">
                <Phone className="w-3.5 h-3.5" strokeWidth={2.5} />
                {loc.phoneDisplay}
              </a>
              <div>
                <a
                  href={`https://maps.google.com/?q=${loc.mapsQuery}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center justify-center gap-2 rounded-full border-2 border-gray-200 text-gray-600 font-semibold px-5 py-2.5 hover:border-red-300 hover:text-red-600 transition text-sm"
                >
                  <Navigation className="w-4 h-4" strokeWidth={2} />
                  {lang === "en" ? "Get Directions" : "Cómo Llegar"}
                </a>
              </div>
            </div>
          ))}
        </section>

        {/* HOURS */}
        <section className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3 px-1">
              {lang === "en" ? "Hours" : "Horario"}
            </p>
            <WeeklyHoursCard lang={lang} />
          </div>

          <div className="md:col-span-2 rounded-3xl border border-gray-200 bg-gray-50 p-6 h-fit">
            <p className="text-gray-500 text-sm font-semibold uppercase tracking-wide mb-4">
              {lang === "en"
                ? "For inventory questions, please call one of our inventory associates:"
                : "Para preguntas sobre el inventario, por favor llame a uno de nuestros asesores de inventario:"}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {associates.map((a) => (
                <a
                  key={a.name}
                  href={`tel:${a.phone}`}
                  className="flex items-center gap-4 bg-white border border-gray-200 rounded-2xl p-4 hover:border-red-300 hover:shadow-sm transition"
                >
                  <span className="flex items-center justify-center w-11 h-11 rounded-full bg-gray-900 text-white font-bold text-sm shrink-0">
                    {a.name.charAt(0)}
                  </span>
                  <span className="flex-1">
                    <span className="block text-gray-900 font-semibold">{a.name}</span>
                    <span className="block text-red-600 font-bold text-sm">{a.display}</span>
                  </span>
                  <Phone className="w-4 h-4 text-gray-300 shrink-0" strokeWidth={2} />
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* FACEBOOK */}
        <section className="mt-6">
          <a
            href="https://facebook.com/garciasautosalesrgvllc"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 rounded-2xl bg-red-600 hover:bg-red-700 transition px-5 py-4"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
            </svg>
            <span className="font-semibold text-white">
              {lang === "en" ? "Follow us on Facebook — Garcia's Auto Sales RGV" : "Síguenos en Facebook — Garcia's Auto Sales RGV"}
            </span>
          </a>
        </section>

        {/* MAP 1 */}
        <section className="mt-10 grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-0 rounded-3xl overflow-hidden border border-gray-200 shadow-sm">
          <div className="bg-gray-900 p-6 flex flex-col justify-center">
            <span className="flex items-center justify-center w-11 h-11 rounded-full bg-white/10 text-white mb-3">
              <MapPin className="w-5 h-5" strokeWidth={2} />
            </span>
            <p className="text-xs font-bold uppercase tracking-widest text-red-400">
              {lang === "en" ? "Location 1" : "Ubicación 1"}
            </p>
            <h2 className="mt-1 text-xl font-bold text-white">1801 W Palma Vista Dr.</h2>
            <p className="text-white/60 text-sm">Palmview, TX 78572</p>
            <a
              href="https://maps.google.com/?q=1801+W+Palma+Vista+Dr+Palmview+TX+78572"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-2 rounded-full border-2 border-white/30 text-white font-semibold px-5 py-2.5 hover:bg-white/10 transition text-sm w-fit"
            >
              <ExternalLink className="w-4 h-4" strokeWidth={2} />
              {lang === "en" ? "Open in Google Maps" : "Abrir en Google Maps"}
            </a>
          </div>
          <div className="h-[280px] lg:h-auto">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4864.939344059251!2d-98.39241568016485!3d26.235493877712752!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8665a9648d9c1fdd%3A0x3af67e5f82db73ec!2s1801%20W%20Palma%20Vista%20Dr%2C%20Palmview%2C%20TX%2078572!5e1!3m2!1sen!2sus!4v1773041473618!5m2!1sen!2sus"
              width="100%"
              height="100%"
              style={{ border: 0, display: "block", minHeight: 280 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Garcia's Auto Sales RGV - Location 1"
            />
          </div>
        </section>

        {/* MAP 2 */}
        <section className="mt-6 grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-0 rounded-3xl overflow-hidden border border-gray-200 shadow-sm">
          <div className="bg-gray-900 p-6 flex flex-col justify-center">
            <span className="flex items-center justify-center w-11 h-11 rounded-full bg-white/10 text-white mb-3">
              <MapPin className="w-5 h-5" strokeWidth={2} />
            </span>
            <p className="text-xs font-bold uppercase tracking-widest text-red-400">
              {lang === "en" ? "Location 2" : "Ubicación 2"}
            </p>
            <h2 className="mt-1 text-xl font-bold text-white">1800 W Veterans Blvd.</h2>
            <p className="text-white/60 text-sm">Palmview, TX 78572</p>
            <a
              href="https://maps.google.com/?q=1800+W+Veterans+Blvd+Palmview+TX+78572"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-2 rounded-full border-2 border-white/30 text-white font-semibold px-5 py-2.5 hover:bg-white/10 transition text-sm w-fit"
            >
              <ExternalLink className="w-4 h-4" strokeWidth={2} />
              {lang === "en" ? "Open in Google Maps" : "Abrir en Google Maps"}
            </a>
          </div>
          <div className="h-[280px] lg:h-auto">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4794.762200358663!2d-98.39107690056335!3d26.24007933741016!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8665a966a1120bfd%3A0x6eaaf9d8a5f8e37c!2s1800%20W%20Veterans%20Blvd%2C%20Mission%2C%20TX%2078572!5e1!3m2!1sen!2sus!4v1773041205710!5m2!1sen!2sus"
              width="100%"
              height="100%"
              style={{ border: 0, display: "block", minHeight: 280 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Garcia's Auto Sales RGV - Location 2"
            />
          </div>
        </section>

        {/* FOOTER SPACE */}
        <div className="pb-10" />

      </div>
    </main>
  );
}