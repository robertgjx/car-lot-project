"use client";
import { useState } from "react";
import { useLang, t } from "@/app/lib/LanguageContext";

const FRAZER_PAY_URL = "https://garciasautosalesrgv.paymycar.com";

const LOCATIONS = [
  {
    address: "1801 W Palma Vista Dr",
    cityState: "Palmview, TX 78572",
    phone: "(956) 581-0455",
    tel: "9565810455",
    mapsUrl: "https://www.google.com/maps/dir/?api=1&destination=1801+W+Palma+Vista+Dr,+Palmview,+TX+78572",
  },
  {
    address: "1800 W Veterans Blvd",
    cityState: "Palmview, TX 78572",
    phone: "(956) 599-9025",
    tel: "9565999025",
    mapsUrl: "https://www.google.com/maps/dir/?api=1&destination=1800+W+Veterans+Blvd,+Palmview,+TX+78572",
  },
];

export default function CustomersPage() {
  const { lang } = useLang();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const steps = [
    lang === "en" ? "Click below" : "Haz clic abajo",
    lang === "en" ? "Enter payment details" : "Ingresa tus datos de pago",
    lang === "en" ? "Done — confirmed instantly" : "Listo — confirmado al instante",
  ];

  const resources = [
    {
      icon: (
        <path d="M12 2 4 5v6c0 5 3.5 9 8 11 4.5-2 8-6 8-11V5l-8-3z" />
      ),
      title: lang === "en" ? "Insurance requirement" : "Requisito de seguro",
      desc:
        lang === "en"
          ? "Texas state minimum liability coverage is required at all times — you're welcome to carry more."
          : "Se requiere el seguro de responsabilidad civil mínimo del estado de Texas en todo momento — puedes tener más cobertura si lo deseas.",
    },
    {
      icon: (
        <>
          <rect x="2" y="5" width="20" height="14" rx="2" />
          <circle cx="8" cy="12" r="2" />
          <line x1="14" y1="10" x2="18" y2="10" />
          <line x1="14" y1="14" x2="18" y2="14" />
        </>
      ),
      title: lang === "en" ? "Valid Texas ID required" : "Se requiere ID válido de Texas",
      desc:
        lang === "en"
          ? "We accept a valid Texas ID or passport only. We're unable to accept Mexican ID or out-of-state ID."
          : "Aceptamos únicamente una identificación válida de Texas o pasaporte. No podemos aceptar identificación mexicana o de otro estado.",
    },
    {
      icon: (
        <>
          <path d="M12 22s7-6.5 7-12a7 7 0 0 0-14 0c0 5.5 7 12 7 12z" />
          <circle cx="12" cy="10" r="2.5" />
        </>
      ),
      title: lang === "en" ? "GPS tracking" : "Rastreo GPS",
      desc:
        lang === "en"
          ? "Selected vehicles may include a GPS tracking device as part of your financing agreement."
          : "Algunos vehículos seleccionados pueden incluir un dispositivo de rastreo GPS como parte de tu contrato de financiamiento.",
    },
    {
      icon: (
        <>
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </>
      ),
      title: lang === "en" ? "Vehicles sold as-is" : "Vehículos vendidos tal como están",
      desc:
        lang === "en"
          ? "All vehicles are sold as-is. Notice a maintenance issue? Contact us right away so we can help you out."
          : "Todos los vehículos se venden tal como están. ¿Notas un problema mecánico? Contáctanos de inmediato para ayudarte.",
    },
    {
      icon: (
        <>
          <path d="M2 10h20" />
          <rect x="3" y="6" width="18" height="14" rx="2" />
          <path d="M8 14h.01M12 14h.01M16 14h.01" />
        </>
      ),
      title: lang === "en" ? "Flexible financing" : "Financiamiento flexible",
      desc:
        lang === "en"
          ? "We're a buy here, pay here dealer with in-house financing — or bring your own outside bank loan if you'd rather finance that way."
          : "Somos un dealer de compra aquí, paga aquí con financiamiento interno — o trae tu propio préstamo bancario si prefieres financiar de esa manera.",
    },
    {
      icon: (
        <>
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
        </>
      ),
      title: lang === "en" ? "Registration & plates" : "Registro y placas",
      desc:
        lang === "en"
          ? "We take care of your initial plate registration when you purchase your vehicle with us."
          : "Nos encargamos del registro inicial de tus placas cuando compras tu vehículo con nosotros.",
    },
  ];

  const faqs = [
    { q: t.customers.q1[lang], a: t.customers.a1[lang] },
    { q: t.customers.q2[lang], a: t.customers.a2[lang] },
    { q: t.customers.q3[lang], a: t.customers.a3[lang] },
    {
      q: lang === "en" ? "What insurance do I need to carry?" : "¿Qué seguro debo tener?",
      a:
        lang === "en"
          ? "Texas state minimum liability coverage, at minimum. You're welcome to carry additional coverage."
          : "El seguro de responsabilidad civil mínimo del estado de Texas, como mínimo. Puedes tener cobertura adicional si lo deseas.",
    },
    {
      q: lang === "en" ? "What ID do I need to buy or finance a vehicle?" : "¿Qué identificación necesito para comprar o financiar un vehículo?",
      a:
        lang === "en"
          ? "A valid Texas ID or a passport. We're unable to accept Mexican ID or out-of-state ID."
          : "Una identificación válida de Texas o un pasaporte. No podemos aceptar identificación mexicana o de otro estado.",
    },
    {
      q: lang === "en" ? "Can I use my own bank loan instead of in-house financing?" : "¿Puedo usar mi propio préstamo bancario en lugar del financiamiento interno?",
      a:
        lang === "en"
          ? "Yes — we're a buy here, pay here dealer, but you're welcome to bring your own outside bank loan if you'd rather finance that route."
          : "Sí — somos un dealer de compra aquí, paga aquí, pero puedes traer tu propio préstamo bancario si prefieres financiar de esa manera.",
    },
    {
      q: lang === "en" ? "What if I notice a problem with my vehicle?" : "¿Qué pasa si noto un problema con mi vehículo?",
      a:
        lang === "en"
          ? "All vehicles are sold as-is, but we want you driving with peace of mind — contact us immediately if you notice any maintenance issues."
          : "Todos los vehículos se venden tal como están, pero queremos que manejes con tranquilidad — contáctanos de inmediato si notas algún problema mecánico.",
    },
  ];

  return (
    <main className="min-h-screen bg-white text-gray-900">

      {/* HERO — full-bleed, edge to edge */}
      <section className="relative w-full min-h-[280px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img src="/lot.PNG" alt="Garcia's Auto Sales lot" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-br from-red-900/80 via-black/60 to-gray-900/80" />
        </div>
        <div className="relative z-10 text-center px-4 py-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
            {t.customers.title[lang]}
          </h1>
          <p className="mt-3 text-white/80 max-w-lg mx-auto">
            {t.customers.sub[lang]}
          </p>
        </div>
      </section>

      <div className="max-w-[1400px] mx-auto px-4 md:px-6 pb-8">

      {/* MAIN GRID — overlaps the hero, same pattern as the Contact page */}
      <div className="-mt-16 relative z-20 grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* LEFT / MAIN COLUMN */}
        <div className="lg:col-span-2 flex flex-col gap-6">

          {/* MAKE A PAYMENT */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-red-600 rounded-xl p-2.5 shrink-0">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="1" y="4" width="22" height="16" rx="2" />
                  <line x1="1" y1="10" x2="23" y2="10" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-900">{t.customers.payTitle[lang]}</h2>
            </div>
            <p className="text-gray-500 text-sm mb-6">{t.customers.payDesc[lang]}</p>

            <div className="relative grid grid-cols-3 gap-3 mb-7">
              <div className="absolute top-[18px] left-[16.6%] right-[16.6%] h-px bg-gray-200" />
              {steps.map((label, i) => (
                <div key={i} className="relative flex flex-col items-center text-center">
                  <div className="mb-2 w-9 h-9 rounded-full bg-white border-2 border-red-500 text-red-600 font-bold flex items-center justify-center text-sm">
                    {i + 1}
                  </div>
                  <p className="text-xs text-gray-500 leading-snug px-1">{label}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <a
                href={FRAZER_PAY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2.5 rounded-xl bg-red-600 px-6 py-3.5 hover:bg-red-700 transition shadow-sm self-start"
              >
                <span className="font-bold text-white text-base">
                  {lang === "en" ? "Continue to Frazer Pay" : "Continuar a Frazer Pay"}
                </span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
              </a>
              <p className="flex items-center gap-1.5 text-xs text-gray-400">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="10" rx="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                {t.customers.secured[lang]}
              </p>
            </div>
          </div>

          {/* RESOURCES */}
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-3">
              {lang === "en" ? "Things to know" : "Cosas que debes saber"}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {resources.map((r, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm flex gap-3">
                  <div className="bg-gray-100 rounded-lg p-2 h-fit shrink-0">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#D85A30" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      {r.icon}
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm mb-1">{r.title}</p>
                    <p className="text-gray-500 text-xs leading-relaxed">{r.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* FAQ */}
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-3">{t.customers.faqTitle[lang]}</h2>
            <div className="space-y-3">
              {faqs.map((faq, i) => {
                const isOpen = openFaq === i;
                return (
                  <div key={i} className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : i)}
                      className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-gray-50 transition"
                    >
                      <p className="font-semibold text-gray-900 text-sm">{faq.q}</p>
                      <svg
                        width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                        strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                        className={`shrink-0 text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180 text-red-600" : ""}`}
                      >
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-4 -mt-1">
                        <p className="text-gray-500 text-sm">{faq.a}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT / SIDEBAR */}
        <div className="flex flex-col gap-4">
          <h2 className="text-lg font-bold text-gray-900 -mb-1">
            {lang === "en" ? "Our locations" : "Nuestras ubicaciones"}
          </h2>
          {LOCATIONS.map((loc, i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
              <p className="font-semibold text-gray-900">{loc.address}</p>
              <p className="text-gray-500 text-sm mb-3">{loc.cityState}</p>
              <a href={`tel:${loc.tel}`} className="flex items-center gap-2 text-red-600 font-bold text-sm mb-4 hover:underline">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                {loc.phone}
              </a>
              <a
                href={loc.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 rounded-full border-2 border-gray-900 text-gray-900 font-semibold text-sm py-2.5 hover:bg-gray-900 hover:text-white transition"
              >
                {lang === "en" ? "Get directions" : "Cómo llegar"}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </a>
            </div>
          ))}

          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
            <p className="text-gray-500 text-xs">
              {lang === "en"
                ? "Feel free to call either location with questions about your account."
                : "Puedes llamar a cualquiera de las dos ubicaciones si tienes preguntas sobre tu cuenta."}
            </p>
          </div>
        </div>
      </div>

      </div>
    </main>
  );
}