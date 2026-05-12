"use client";
import { useLang, t } from "@/app/lib/LanguageContext";
const FRAZER_PAY_URL = "https://garciasautosalesrgv.paymycar.com";
export default function CustomersPage() {
  const { lang } = useLang();
  const faqs = [
    { q: t.customers.q1[lang], a: t.customers.a1[lang] },
    { q: t.customers.q2[lang], a: t.customers.a2[lang] },
    { q: t.customers.q3[lang], a: t.customers.a3[lang] },
  ];
  return (
    <main className="min-h-screen max-w-6xl mx-auto px-4 md:px-10 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900">{t.customers.title[lang]}</h1>
        <p className="mt-2 text-gray-500">{t.customers.sub[lang]}</p>
      </div>
      <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-3">
          <div className="bg-red-600 rounded-xl p-2.5">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="1" y="4" width="22" height="16" rx="2" />
              <line x1="1" y1="10" x2="23" y2="10" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900">{t.customers.payTitle[lang]}</h2>
        </div>
        <p className="text-gray-500 text-sm">{t.customers.payDesc[lang]}</p>
        <a href={FRAZER_PAY_URL} target="_blank" rel="noopener noreferrer" className="w-full flex items-center justify-center gap-3 rounded-2xl bg-red-600 px-5 py-4 hover:bg-red-700 transition">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="1" y="4" width="22" height="16" rx="2" />
            <line x1="1" y1="10" x2="23" y2="10" />
          </svg>
          <span className="font-bold text-white text-lg">{t.customers.payBtn[lang]}</span>
        </a>
        <p className="text-xs text-gray-400 text-center">🔒 {t.customers.secured[lang]}</p>
      </div>
      <div className="mt-6 bg-white border border-gray-200 rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <p className="text-gray-500 font-medium">{t.customers.callUs[lang]}</p>
        <a href="tel:9565810455" className="text-red-600 font-bold text-xl hover:underline">(956) 581-0455</a>
      </div>
      <div className="mt-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">{t.customers.faqTitle[lang]}</h2>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-gray-50 border border-gray-200 rounded-2xl p-5 shadow-sm">
              <p className="font-semibold text-gray-900">{faq.q}</p>
              <p className="text-gray-500 text-sm mt-1">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="pb-10" />
    </main>
  );
}