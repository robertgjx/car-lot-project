"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useLang, t } from "./LanguageContext";

function PumpkinIcon({ id }: { id: string }) {
  return (
    <svg viewBox="0 0 100 100" width="100%" height="100%">
      <defs>
        <radialGradient id={id} cx="35%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#fdba74" />
          <stop offset="45%" stopColor="#ea580c" />
          <stop offset="100%" stopColor="#7c2d12" />
        </radialGradient>
      </defs>
      {/* vine curl */}
      <path d="M66,16 C73,11 78,15 73,20 C68,25 75,27 70,32" fill="none" stroke="#16a34a" strokeWidth="3" strokeLinecap="round" />
      {/* small leaf */}
      <ellipse cx="63" cy="12" rx="9" ry="5.5" fill="#16a34a" transform="rotate(-24 63 12)" />
      {/* stem */}
      <path d="M45,28 Q43,16 47,9 Q50,7 53,9 Q56,16 55,28 Z" fill="#78350f" />
      {/* pumpkin body */}
      <path d="M50,30 C31,20 15,34 15,56 C15,77 31,91 50,91 C69,91 85,77 85,56 C85,34 69,20 50,30 Z" fill={`url(#${id})`} stroke="#7c2d12" strokeWidth="2.5" />
      {/* ridges */}
      <path d="M34,33 C28,50 28,73 37,89" fill="none" stroke="#9a3412" strokeWidth="2" opacity="0.55" />
      <path d="M50,30 C50,50 50,72 50,91" fill="none" stroke="#9a3412" strokeWidth="2" opacity="0.55" />
      <path d="M66,33 C72,50 72,73 63,89" fill="none" stroke="#9a3412" strokeWidth="2" opacity="0.55" />
      {/* shine */}
      <ellipse cx="33" cy="47" rx="8" ry="12" fill="white" opacity="0.28" />
    </svg>
  );
}

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
              @keyframes pumpkinPatchPop {
                0%   { transform: scale(0) rotate(-10deg); opacity: 0; animation-timing-function: cubic-bezier(0.34, 1.56, 0.64, 1); }
                55%  { transform: scale(1.14) rotate(5deg); opacity: 1; }
                75%  { transform: scale(0.94) rotate(-2deg); }
                100% { transform: scale(1) rotate(0deg); opacity: 1; }
              }
              @keyframes pumpkinPatchGroundFade {
                0%, 30% { opacity: 0; }
                100% { opacity: 1; }
              }
              .patch-wrap-mobile {
                position: absolute;
                left: 100%;
                bottom: 4%;
                margin-left: -38px;
                width: 42px;
                height: 26px;
                pointer-events: none;
                z-index: 20;
              }
              .patch-vine-mobile {
                position: absolute;
                left: 0; right: 0; bottom: 1px;
                width: 100%; height: 8px;
                animation: pumpkinPatchGroundFade 0.6s 900ms both;
              }
              .patch-pumpkin-mobile {
                position: absolute;
                bottom: 0;
                transform-origin: 50% 100%;
                filter: drop-shadow(0 1.5px 1.5px rgba(0,0,0,0.2));
              }
              .patch-pumpkin-mobile.small  { left: 0px;   width: 11px; height: 11px; animation: pumpkinPatchPop 0.65s 300ms both; }
              .patch-pumpkin-mobile.medium { left: 11px;  width: 15px; height: 15px; animation: pumpkinPatchPop 0.65s 520ms both; }
              .patch-pumpkin-mobile.large  { left: 24px;  width: 20px; height: 20px; animation: pumpkinPatchPop 0.65s 740ms both; }
              @media (prefers-reduced-motion: reduce) {
                .patch-pumpkin-mobile, .patch-vine-mobile { animation: none !important; opacity: 1 !important; transform: none !important; }
              }
            `}</style>
            <div className="patch-wrap-mobile" aria-hidden="true">
              <svg className="patch-vine-mobile" viewBox="0 0 100 20" preserveAspectRatio="none">
                <path d="M2,14 Q20,6 38,13 T74,10 T98,14" fill="none" stroke="#16a34a" strokeWidth="3" strokeLinecap="round" opacity="0.7" />
              </svg>
              <div className="patch-pumpkin-mobile small"><PumpkinIcon id="pumpkinPatchSmallMobile" /></div>
              <div className="patch-pumpkin-mobile medium"><PumpkinIcon id="pumpkinPatchMediumMobile" /></div>
              <div className="patch-pumpkin-mobile large"><PumpkinIcon id="pumpkinPatchLargeMobile" /></div>
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
              @keyframes pumpkinPatchPopDesktop {
                0%   { transform: scale(0) rotate(-10deg); opacity: 0; animation-timing-function: cubic-bezier(0.34, 1.56, 0.64, 1); }
                55%  { transform: scale(1.14) rotate(5deg); opacity: 1; }
                75%  { transform: scale(0.94) rotate(-2deg); }
                100% { transform: scale(1) rotate(0deg); opacity: 1; }
              }
              @keyframes pumpkinPatchGroundFadeDesktop {
                0%, 30% { opacity: 0; }
                100% { opacity: 1; }
              }
              .patch-wrap {
                position: absolute;
                left: 100%;
                bottom: 4%;
                margin-left: -58px;
                width: 64px;
                height: 40px;
                pointer-events: none;
                z-index: 20;
              }
              .patch-vine {
                position: absolute;
                left: 0; right: 0; bottom: 2px;
                width: 100%; height: 12px;
                animation: pumpkinPatchGroundFadeDesktop 0.6s 900ms both;
              }
              .patch-pumpkin {
                position: absolute;
                bottom: 0;
                transform-origin: 50% 100%;
                filter: drop-shadow(0 2px 2px rgba(0,0,0,0.2));
              }
              .patch-pumpkin.small  { left: 0px;   width: 17px; height: 17px; animation: pumpkinPatchPopDesktop 0.65s 300ms both; }
              .patch-pumpkin.medium { left: 16px;  width: 23px; height: 23px; animation: pumpkinPatchPopDesktop 0.65s 520ms both; }
              .patch-pumpkin.large  { left: 36px;  width: 30px; height: 30px; animation: pumpkinPatchPopDesktop 0.65s 740ms both; }
              @media (prefers-reduced-motion: reduce) {
                .patch-pumpkin, .patch-vine { animation: none !important; opacity: 1 !important; transform: none !important; }
              }
            `}</style>
            <div className="patch-wrap" aria-hidden="true">
              <svg className="patch-vine" viewBox="0 0 100 20" preserveAspectRatio="none">
                <path d="M2,14 Q20,6 38,13 T74,10 T98,14" fill="none" stroke="#16a34a" strokeWidth="3" strokeLinecap="round" opacity="0.7" />
              </svg>
              <div className="patch-pumpkin small"><PumpkinIcon id="pumpkinPatchSmallDesktop" /></div>
              <div className="patch-pumpkin medium"><PumpkinIcon id="pumpkinPatchMediumDesktop" /></div>
              <div className="patch-pumpkin large"><PumpkinIcon id="pumpkinPatchLargeDesktop" /></div>
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