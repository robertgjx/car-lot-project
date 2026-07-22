"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useLang, t } from "./LanguageContext";

export default function NavBar() {
  const { lang, toggle } = useLang();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      {/* TOP INFO BAR — desktop only */}
      <div className="hidden md:block bg-red-600 text-white text-xs">
        <div className="max-w-[1800px] mx-auto px-4 md:px-6 py-2 flex flex-wrap items-center justify-between gap-y-1 gap-x-4">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <span className="flex items-center gap-1">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
              </svg>
              1801 W Palma Vista Dr &amp; 1800 W Veterans Blvd — Palmview, TX
            </span>
          </div>
          <div className="flex items-center gap-4">
            <a href="tel:9565810455" className="flex items-center gap-1 hover:text-red-200 transition">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.82a16 16 0 0 0 6.29 6.29l.96-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
              (956) 581-0455
            </a>
            <span className="flex items-center gap-1">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
              </svg>
              {t.contact.hoursVal[lang]}
            </span>
          </div>
        </div>
      </div>

      {/* MAIN NAVBAR */}
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white">

        {/* MOBILE NAV */}
        <div className="flex md:hidden items-center justify-between px-3 py-1">
          <div className="relative">
            <style>{`
              @keyframes orbitFadeInMobile {
                from { opacity: 0; }
                to   { opacity: 1; }
              }
              @keyframes orbitSpinMobile {
                from { transform: rotate(0deg); }
                to   { transform: rotate(360deg); }
              }
              @keyframes orbitCounterSpinMobile {
                from { transform: rotate(0deg); }
                to   { transform: rotate(-360deg); }
              }
              .logo-hood-orbit-mobile {
                position: absolute;
                top: 0px;
                right: 8px;
                width: 0;
                height: 0;
                pointer-events: none;
                z-index: 20;
                opacity: 0;
                animation: orbitFadeInMobile 0.8s ease-out 300ms forwards;
              }
              .orbit-ring-mobile {
                position: absolute;
                top: 0;
                left: 0;
                width: 38px;
                height: 38px;
                margin-left: -19px;
                margin-top: -19px;
                animation: orbitSpinMobile 6.5s linear infinite;
              }
              .orbit-item-mobile {
                position: absolute;
                top: 50%;
                left: 50%;
                width: 16px;
                height: 16px;
                margin: -8px;
              }
              .orbit-item-apple-mobile { transform: translateY(-16px); }
              .orbit-item-ruler-mobile { transform: translateY(16px); }
              .orbit-counter-mobile {
                width: 100%;
                height: 100%;
                animation: orbitCounterSpinMobile 6.5s linear infinite;
                filter: drop-shadow(0 1px 2px rgba(0,0,0,0.25));
              }
              @media (prefers-reduced-motion: reduce) {
                .logo-hood-orbit-mobile { animation: none; opacity: 0; }
                .orbit-ring-mobile, .orbit-counter-mobile { animation: none; }
              }
            `}</style>
            <div className="logo-hood-orbit-mobile" aria-hidden="true">
              <div className="orbit-ring-mobile">
                <div className="orbit-item-mobile orbit-item-apple-mobile">
                  <div className="orbit-counter-mobile">
                    <svg viewBox="0 0 100 100" width="16" height="16">
                      <defs>
                        <radialGradient id="appleGradOrbitMobile" cx="35%" cy="30%" r="75%">
                          <stop offset="0%" stopColor="#fca5a5" />
                          <stop offset="45%" stopColor="#dc2626" />
                          <stop offset="100%" stopColor="#7f1d1d" />
                        </radialGradient>
                      </defs>
                      <path d="M50,32 C33,20 15,33 15,55 C15,76 31,90 50,90 C69,90 85,76 85,55 C85,33 67,20 50,32 Z" fill="url(#appleGradOrbitMobile)" stroke="#7f1d1d" strokeWidth="2.5" />
                      <path d="M40,30 Q50,20 60,30" fill="none" stroke="#7f1d1d" strokeWidth="2.5" strokeLinecap="round" />
                      <path d="M50,24 Q53,12 61,7" fill="none" stroke="#78350f" strokeWidth="4.5" strokeLinecap="round" />
                      <ellipse cx="65" cy="13" rx="11" ry="6.5" fill="#16a34a" transform="rotate(-28 65 13)" />
                      <ellipse cx="34" cy="46" rx="9" ry="13" fill="white" opacity="0.3" />
                    </svg>
                  </div>
                </div>
                <div className="orbit-item-mobile orbit-item-ruler-mobile">
                  <div className="orbit-counter-mobile">
                    <svg viewBox="0 0 100 34" width="16" height="6">
                      <rect x="2" y="6" width="96" height="22" rx="3" fill="#fbbf24" stroke="#92400e" strokeWidth="2" />
                      <line x1="12" y1="6" x2="12" y2="19" stroke="#92400e" strokeWidth="2" />
                      <line x1="24" y1="6" x2="24" y2="14" stroke="#92400e" strokeWidth="1.5" />
                      <line x1="36" y1="6" x2="36" y2="19" stroke="#92400e" strokeWidth="2" />
                      <line x1="48" y1="6" x2="48" y2="14" stroke="#92400e" strokeWidth="1.5" />
                      <line x1="60" y1="6" x2="60" y2="19" stroke="#92400e" strokeWidth="2" />
                      <line x1="72" y1="6" x2="72" y2="14" stroke="#92400e" strokeWidth="1.5" />
                      <line x1="84" y1="6" x2="84" y2="19" stroke="#92400e" strokeWidth="2" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            <Link href="/" onClick={() => setMenuOpen(false)} className="inline-block transition-transform duration-300 ease-out hover:scale-[1.04] active:scale-[0.98]">
              <Image
                src="/logo.jpg"
                alt="Garcia's Auto Sales RGV"
                width={220}
                height={88}
                className="object-contain w-36"
                style={{ maxHeight: '52px' }}
                priority
              />
            </Link>
          </div>
          <div className="flex items-center gap-4 pr-1">
            <Link href="/scan" className="text-gray-700 hover:text-red-600 transition" aria-label="VIN Scanner">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/>
                <path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/>
                <line x1="7" y1="8" x2="7" y2="16"/><line x1="10" y1="8" x2="10" y2="16"/>
                <line x1="13" y1="8" x2="13" y2="16"/><line x1="16" y1="8" x2="16" y2="16"/>
              </svg>
            </Link>
            <a href="tel:9565810455" className="text-red-600 hover:text-red-700 transition">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.82a16 16 0 0 0 6.29 6.29l.96-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
            </a>
            <button onClick={() => setMenuOpen(!menuOpen)} className="text-gray-700 hover:text-gray-900 transition" aria-label="Toggle menu">
              {menuOpen ? (
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              ) : (
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* MOBILE DROPDOWN */}
        {menuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white px-4 pb-5 pt-2 flex flex-col gap-1">
            <Link href="/" onClick={() => setMenuOpen(false)}
              className="px-4 py-3 rounded-xl font-semibold text-gray-900 hover:bg-gray-100 transition">
              {t.nav.home[lang]}
            </Link>
            <Link href="/inventory" onClick={() => setMenuOpen(false)}
              className="px-4 py-3 rounded-xl font-semibold text-gray-900 hover:bg-gray-100 transition">
              {t.nav.inventory[lang]}
            </Link>
            <Link href="/contact" onClick={() => setMenuOpen(false)}
              className="px-4 py-3 rounded-xl font-semibold text-gray-900 hover:bg-gray-100 transition">
              {t.nav.contact[lang]}
            </Link>
            <Link href="/customers" onClick={() => setMenuOpen(false)}
              className="px-4 py-3 rounded-xl font-semibold text-gray-900 hover:bg-gray-100 transition">
              {t.nav.customers[lang]}
            </Link>
            <button onClick={() => { toggle(); setMenuOpen(false); }}
              className="px-4 py-3 rounded-xl font-semibold text-white bg-red-600 hover:bg-red-700 transition text-left">
              {lang === "en" ? "🌐 Español" : "🌐 English"}
            </button>
            <div className="mt-3 px-4 text-xs text-gray-400 flex flex-col gap-1">
              <span>📍 1801 W Palma Vista Dr & 1800 W Veterans Blvd — Palmview, TX</span>
              <span>🕐 {t.contact.hoursVal[lang]}</span>
            </div>
          </div>
        )}

        {/* DESKTOP NAV */}
        <div className="hidden md:flex max-w-[1800px] mx-auto pl-2 pr-4 md:pr-6 py-2 items-center justify-between">
          <div className="relative">
            <style>{`
              @keyframes orbitFadeIn {
                from { opacity: 0; }
                to   { opacity: 1; }
              }
              @keyframes orbitSpin {
                from { transform: rotate(0deg); }
                to   { transform: rotate(360deg); }
              }
              @keyframes orbitCounterSpin {
                from { transform: rotate(0deg); }
                to   { transform: rotate(-360deg); }
              }
              .logo-hood-orbit {
                position: absolute;
                top: 4px;
                right: 30px;
                width: 0;
                height: 0;
                pointer-events: none;
                z-index: 20;
                opacity: 0;
                animation: orbitFadeIn 0.8s ease-out 300ms forwards;
              }
              .orbit-ring {
                position: absolute;
                top: 0;
                left: 0;
                width: 56px;
                height: 56px;
                margin-left: -28px;
                margin-top: -28px;
                animation: orbitSpin 7s linear infinite;
              }
              .orbit-item {
                position: absolute;
                top: 50%;
                left: 50%;
                width: 22px;
                height: 22px;
                margin: -11px;
              }
              .orbit-item-apple { transform: translateY(-24px); }
              .orbit-item-ruler { transform: translateY(24px); }
              .orbit-counter {
                width: 100%;
                height: 100%;
                animation: orbitCounterSpin 7s linear infinite;
                filter: drop-shadow(0 2px 3px rgba(0,0,0,0.25));
              }
              @media (prefers-reduced-motion: reduce) {
                .logo-hood-orbit { animation: none; opacity: 0; }
                .orbit-ring, .orbit-counter { animation: none; }
              }
            `}</style>
            <div className="logo-hood-orbit" aria-hidden="true">
              <div className="orbit-ring">
                <div className="orbit-item orbit-item-apple">
                  <div className="orbit-counter">
                    <svg viewBox="0 0 100 100" width="22" height="22">
                      <defs>
                        <radialGradient id="appleGradOrbitDesktop" cx="35%" cy="30%" r="75%">
                          <stop offset="0%" stopColor="#fca5a5" />
                          <stop offset="45%" stopColor="#dc2626" />
                          <stop offset="100%" stopColor="#7f1d1d" />
                        </radialGradient>
                      </defs>
                      <path d="M50,32 C33,20 15,33 15,55 C15,76 31,90 50,90 C69,90 85,76 85,55 C85,33 67,20 50,32 Z" fill="url(#appleGradOrbitDesktop)" stroke="#7f1d1d" strokeWidth="2.5" />
                      <path d="M40,30 Q50,20 60,30" fill="none" stroke="#7f1d1d" strokeWidth="2.5" strokeLinecap="round" />
                      <path d="M50,24 Q53,12 61,7" fill="none" stroke="#78350f" strokeWidth="4.5" strokeLinecap="round" />
                      <ellipse cx="65" cy="13" rx="11" ry="6.5" fill="#16a34a" transform="rotate(-28 65 13)" />
                      <ellipse cx="34" cy="46" rx="9" ry="13" fill="white" opacity="0.3" />
                    </svg>
                  </div>
                </div>
                <div className="orbit-item orbit-item-ruler">
                  <div className="orbit-counter">
                    <svg viewBox="0 0 100 34" width="22" height="8">
                      <rect x="2" y="6" width="96" height="22" rx="3" fill="#fbbf24" stroke="#92400e" strokeWidth="2" />
                      <line x1="12" y1="6" x2="12" y2="19" stroke="#92400e" strokeWidth="2" />
                      <line x1="24" y1="6" x2="24" y2="14" stroke="#92400e" strokeWidth="1.5" />
                      <line x1="36" y1="6" x2="36" y2="19" stroke="#92400e" strokeWidth="2" />
                      <line x1="48" y1="6" x2="48" y2="14" stroke="#92400e" strokeWidth="1.5" />
                      <line x1="60" y1="6" x2="60" y2="19" stroke="#92400e" strokeWidth="2" />
                      <line x1="72" y1="6" x2="72" y2="14" stroke="#92400e" strokeWidth="1.5" />
                      <line x1="84" y1="6" x2="84" y2="19" stroke="#92400e" strokeWidth="2" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            <Link href="/" className="inline-flex flex-col transition-transform duration-300 ease-out hover:scale-[1.03] active:scale-[0.98]">
              <Image
                src="/logo.jpg"
                alt="Garcia's Auto Sales RGV"
                width={220}
                height={88}
                className="object-contain w-56 md:w-72"
                style={{ maxHeight: '80px' }}
                priority
              />
              <span className="text-xs font-semibold tracking-widest text-gray-400 uppercase pl-1">Est. 1984</span>
            </Link>
          </div>
          <nav className="flex items-center gap-1 md:gap-2">
            <Link href="/" className="rounded-xl border border-gray-200 bg-white text-gray-900 px-3 py-1.5 text-xs font-semibold md:px-4 md:py-2 md:text-sm hover:bg-gray-100 transition">
              {t.nav.home[lang]}
            </Link>
            <div className="relative group">
              <Link
                href="/inventory"
                className="inline-flex items-center gap-1 rounded-xl border border-gray-200 bg-white text-gray-900 px-3 py-1.5 text-xs font-semibold md:px-4 md:py-2 md:text-sm hover:bg-gray-100 transition"
              >
                {t.nav.inventory[lang]}
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-200 group-hover:rotate-180">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </Link>
              <div className="absolute left-0 top-full pt-2 opacity-0 invisible translate-y-1 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-200 z-50">
                <div className="w-48 rounded-2xl border border-gray-200 bg-white shadow-lg py-2 overflow-hidden">
                  <Link href="/inventory" className="block px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:text-red-600 transition">
                    {lang === "en" ? "All Inventory" : "Todo el Inventario"}
                  </Link>
                  <Link href="/inventory?type=Car" className="block px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:text-red-600 transition">
                    {lang === "en" ? "Cars" : "Carros"}
                  </Link>
                  <Link href="/inventory?type=Truck" className="block px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:text-red-600 transition">
                    {lang === "en" ? "Trucks" : "Trocas"}
                  </Link>
                  <Link href="/inventory?type=SUV" className="block px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:text-red-600 transition">
                    SUVs
                  </Link>
                  <Link href="/inventory?type=Van" className="block px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:text-red-600 transition">
                    Vans
                  </Link>
                  <Link href="/inventory?type=Other" className="block px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:text-red-600 transition">
                    {lang === "en" ? "Other" : "Otros"}
                  </Link>
                </div>
              </div>
            </div>
            <Link href="/contact" className="rounded-xl border border-gray-200 bg-white text-gray-900 px-3 py-1.5 text-xs font-semibold md:px-4 md:py-2 md:text-sm hover:bg-gray-100 transition">
              {t.nav.contact[lang]}
            </Link>
            <Link href="/customers" className="rounded-xl border border-gray-200 bg-white text-gray-900 px-3 py-1.5 text-xs font-semibold md:px-4 md:py-2 md:text-sm hover:bg-gray-100 transition">
              {t.nav.customers[lang]}
            </Link>
            <button onClick={toggle}
              className="rounded-xl bg-red-600 text-white px-3 py-1.5 text-xs font-semibold md:px-4 md:py-2 md:text-sm hover:bg-red-700 transition">
              {lang === "en" ? "ES" : "EN"}
            </button>
          </nav>
        </div>

      </header>
    </>
  );
}