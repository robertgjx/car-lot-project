"use client";
import { useState } from "react";
import { useLang, t } from "@/app/lib/LanguageContext";

const FRAZER_PAY_URL = "https://garciasautosalesrgv.paymycar.com";

export default function CustomersPage() {
  const { lang } = useLang();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    { q: t.customers.q1[lang], a: t.customers.a1[lang] },
    { q: t.customers.q2[lang], a: t.customers.a2[lang] },
    { q: t.customers.q3[lang], a: t.customers.a3[lang] },
  ];

  const steps = [
    lang === "en" ? "Click below" : "Haz clic abajo",
    lang === "en" ? "Enter payment details" : "Ingresa tus datos de pago",
    lang === "en" ? "Done — confirmed instantly" : "Listo — confirmado al instante",
  ];

  return (
    <main className="min-h-screen max-w-[1800px] mx-auto px-4 md:px-6 py-8">

      {/* HEADER BANNER */}
      <div className="mb-8 relative overflow-hidden rounded-3xl bg-gradient-to-br from-red-600 to-red-800 px-6 py-9 md:px-10 md:py-12 shadow-sm">
        <div className="pointer-events-none absolute -right-8 -top-10 w-44 h-44 rounded-full bg-white/10" />
        <div className="pointer-events-none absolute right-16 bottom-[-3rem] w-40 h-40 rounded-full bg-white/5" />
        <div className="relative flex items-center gap-4">
          <div className="hidden sm:flex items-center justify-center w-14 h-14 shrink-0 rounded-2xl bg-white/15 backdrop-blur-sm">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white">{t.customers.title[lang]}</h1>
            <p className="mt-1 text-white/80">{t.customers.sub[lang]}</p>
          </div>
        </div>
      </div>

      {/* MAKE A PAYMENT */}
      <div className="bg-white border border-gray-200 rounded-3xl p-6 md:p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-red-600 rounded-xl p-2.5 shrink-0">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="1" y="4" width="22" height="16" rx="2" />
              <line x1="1" y1="10" x2="23" y2="10" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900">{t.customers.payTitle[lang]}</h2>
        </div>
        <p className="text-gray-500 text-sm mb-6">{t.customers.payDesc[lang]}</p>

        {/* Steps */}
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

        <a
          href={FRAZER_PAY_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center gap-3 rounded-2xl bg-red-600 px-5 py-4 hover:bg-red-700 transition shadow-sm"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="1" y="4" width="22" height="16" rx="2" />
            <line x1="1" y1="10" x2="23" y2="10" />
          </svg>
          <span className="font-bold text-white text-lg">{t.customers.payBtn[lang]}</span>
        </a>

        <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-gray-400">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="10" rx="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          {t.customers.secured[lang]}
        </p>
      </div>

      {/* CALL US */}
      <div className="mt-6 bg-white border border-gray-200 rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="bg-gray-100 rounded-xl p-2.5 shrink-0">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="text-red-600">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
          </div>
          <p className="text-gray-500 font-medium">{t.customers.callUs[lang]}</p>
        </div>
        <a href="tel:9565810455" className="text-red-600 font-bold text-xl hover:underline">(956) 581-0455</a>
      </div>

      {/* FAQ — accordion */}
      <div className="mt-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">{t.customers.faqTitle[lang]}</h2>
        <div className="space-y-3">
          {faqs.map((faq, i) => {
            const isOpen = openFaq === i;
            return (
              <div key={i} className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                <button
                  onClick={() => setOpenFaq(isOpen ? null : i)}
                  className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-gray-50 transition"
                >
                  <p className="font-semibold text-gray-900">{faq.q}</p>
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

      <div className="pb-10" />
    </main>
  );
}