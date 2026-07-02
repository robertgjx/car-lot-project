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
              @keyframes ballWrapXMobile {
                0%   { transform: translateX(-76px); opacity: 0; animation-timing-function: ease-out; }
                5%   { opacity: 1; }
                20%  { transform: translateX(-9px); animation-timing-function: ease; }
                46%  { transform: translateX(46px); animation-timing-function: ease; }
                63%  { transform: translateX(61px); animation-timing-function: ease-in; }
                88%  { transform: translateX(150px); opacity: 1; }
                100% { transform: translateX(182px); opacity: 0; }
              }
              @keyframes ballBounceYMobile {
                0%   { transform: translateY(0) rotate(0deg); animation-timing-function: ease-out; }
                20%  { transform: translateY(0) rotate(340deg); animation-timing-function: ease-out; }
                33%  { transform: translateY(-41px) rotate(430deg); animation-timing-function: ease-in; }
                46%  { transform: translateY(0) rotate(560deg); animation-timing-function: ease-out; }
                55%  { transform: translateY(-17px) rotate(620deg); animation-timing-function: ease-in; }
                63%  { transform: translateY(0) rotate(680deg); animation-timing-function: linear; }
                100% { transform: translateY(0) rotate(1080deg); }
              }
              @keyframes ballShadowScaleMobile {
                0%   { opacity: 0; transform: scaleX(0.7); }
                18%  { opacity: 0.16; transform: scaleX(1); }
                33%  { opacity: 0.03; transform: scaleX(0.4); }
                46%  { opacity: 0.16; transform: scaleX(1); }
                55%  { opacity: 0.06; transform: scaleX(0.55); }
                63%  { opacity: 0.15; transform: scaleX(1); }
                88%  { opacity: 0.14; transform: scaleX(1); }
                100% { opacity: 0; transform: scaleX(0.8); }
              }
              .ball-wrap-mobile {
                position: absolute;
                left: 0;
                top: 50%;
                width: 24px;
                height: 24px;
                margin-top: -12px;
                animation: ballWrapXMobile 3.8s 500ms 1 forwards;
                pointer-events: none;
                z-index: 20;
              }
              .ball-inner-mobile {
                width: 100%;
                height: 100%;
                animation: ballBounceYMobile 3.8s 500ms 1 forwards;
              }
              .ball-shadow-mobile {
                position: absolute;
                left: 3px;
                bottom: -5px;
                width: 18px;
                height: 5px;
                border-radius: 9999px;
                background: black;
                animation: ballShadowScaleMobile 3.8s 500ms 1 forwards;
              }
              @keyframes logoReactMobile {
                0%, 43%  { transform: translateY(0) rotate(0deg); animation-timing-function: cubic-bezier(0.34, 1.56, 0.64, 1); }
                46%  { transform: translateY(2px) rotate(-1.5deg); animation-timing-function: cubic-bezier(0.34, 1.56, 0.64, 1); }
                52%  { transform: translateY(0) rotate(0.6deg); animation-timing-function: linear; }
                60%  { transform: translateY(0) rotate(0deg); animation-timing-function: cubic-bezier(0.34, 1.56, 0.64, 1); }
                63%  { transform: translateY(1px) rotate(-0.8deg); animation-timing-function: cubic-bezier(0.34, 1.56, 0.64, 1); }
                70%  { transform: translateY(0) rotate(0deg); }
                100% { transform: translateY(0) rotate(0deg); }
              }
              .logo-bump-mobile {
                animation: logoReactMobile 3.8s 500ms 1;
                transform-origin: bottom center;
              }
              @media (prefers-reduced-motion: reduce) {
                .ball-wrap-mobile, .ball-shadow-mobile { animation: none; opacity: 0; }
                .logo-bump-mobile { animation: none; }
              }
            `}</style>
            <div className="ball-wrap-mobile" aria-hidden="true">
              <div className="ball-shadow-mobile" />
              <div className="ball-inner-mobile">
                <svg viewBox="0 0 100 100" width="24" height="24">
                  <defs>
                    <radialGradient id="redBallGradMobile" cx="35%" cy="30%" r="75%">
                      <stop offset="0%" stopColor="#fca5a5" />
                      <stop offset="45%" stopColor="#dc2626" />
                      <stop offset="100%" stopColor="#7f1d1d" />
                    </radialGradient>
                  </defs>
                  <circle cx="50" cy="50" r="46" fill="url(#redBallGradMobile)" stroke="#7f1d1d" strokeWidth="2" />
                  <polygon points="50,28 68,41 61,62 39,62 32,41" fill="none" stroke="white" strokeWidth="3.2" opacity="0.9" />
                  <path d="M50,28 L50,10 M68,41 L84,29 M61,62 L67,82 M39,62 L33,82 M32,41 L16,29"
                    stroke="white" strokeWidth="2.6" fill="none" strokeLinecap="round" opacity="0.75" />
                  <ellipse cx="38" cy="32" rx="11" ry="7" fill="white" opacity="0.35" />
                </svg>
              </div>
            </div>
            <Link href="/" onClick={() => setMenuOpen(false)} className="logo-bump-mobile inline-block transition-transform duration-300 ease-out hover:scale-[1.04] active:scale-[0.98]">
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
              @keyframes ballWrapX {
                0%   { transform: translateX(-120px); opacity: 0; animation-timing-function: ease-out; }
                5%   { opacity: 1; }
                20%  { transform: translateX(-14px); animation-timing-function: ease; }
                46%  { transform: translateX(72px); animation-timing-function: ease; }
                63%  { transform: translateX(96px); animation-timing-function: ease-in; }
                88%  { transform: translateX(235px); opacity: 1; }
                100% { transform: translateX(285px); opacity: 0; }
              }
              @keyframes ballBounceY {
                0%   { transform: translateY(0) rotate(0deg); animation-timing-function: ease-out; }
                20%  { transform: translateY(0) rotate(340deg); animation-timing-function: ease-out; }
                33%  { transform: translateY(-64px) rotate(430deg); animation-timing-function: ease-in; }
                46%  { transform: translateY(0) rotate(560deg); animation-timing-function: ease-out; }
                55%  { transform: translateY(-26px) rotate(620deg); animation-timing-function: ease-in; }
                63%  { transform: translateY(0) rotate(680deg); animation-timing-function: linear; }
                100% { transform: translateY(0) rotate(1080deg); }
              }
              @keyframes ballShadowScale {
                0%   { opacity: 0; transform: scaleX(0.7); }
                18%  { opacity: 0.16; transform: scaleX(1); }
                33%  { opacity: 0.03; transform: scaleX(0.4); }
                46%  { opacity: 0.16; transform: scaleX(1); }
                55%  { opacity: 0.06; transform: scaleX(0.55); }
                63%  { opacity: 0.15; transform: scaleX(1); }
                88%  { opacity: 0.14; transform: scaleX(1); }
                100% { opacity: 0; transform: scaleX(0.8); }
              }
              .ball-wrap {
                position: absolute;
                left: 0;
                top: 50%;
                width: 34px;
                height: 34px;
                margin-top: -17px;
                animation: ballWrapX 3.8s 500ms 1 forwards;
                pointer-events: none;
                z-index: 20;
              }
              .ball-inner {
                width: 100%;
                height: 100%;
                animation: ballBounceY 3.8s 500ms 1 forwards;
              }
              .ball-shadow {
                position: absolute;
                left: 4px;
                bottom: -7px;
                width: 26px;
                height: 7px;
                border-radius: 9999px;
                background: black;
                animation: ballShadowScale 3.8s 500ms 1 forwards;
              }
              @keyframes logoReact {
                0%, 43%  { transform: translateY(0) rotate(0deg); animation-timing-function: cubic-bezier(0.34, 1.56, 0.64, 1); }
                46%  { transform: translateY(3px) rotate(-1.5deg); animation-timing-function: cubic-bezier(0.34, 1.56, 0.64, 1); }
                52%  { transform: translateY(0) rotate(0.6deg); animation-timing-function: linear; }
                60%  { transform: translateY(0) rotate(0deg); animation-timing-function: cubic-bezier(0.34, 1.56, 0.64, 1); }
                63%  { transform: translateY(1.5px) rotate(-0.8deg); animation-timing-function: cubic-bezier(0.34, 1.56, 0.64, 1); }
                70%  { transform: translateY(0) rotate(0deg); }
                100% { transform: translateY(0) rotate(0deg); }
              }
              .logo-bump {
                animation: logoReact 3.8s 500ms 1;
                transform-origin: bottom center;
              }
              @media (prefers-reduced-motion: reduce) {
                .ball-wrap, .ball-shadow { animation: none; opacity: 0; }
                .logo-bump { animation: none; }
              }
            `}</style>
            <div className="ball-wrap" aria-hidden="true">
              <div className="ball-shadow" />
              <div className="ball-inner">
                <svg viewBox="0 0 100 100" width="34" height="34">
                  <defs>
                    <radialGradient id="redBallGradDesktop" cx="35%" cy="30%" r="75%">
                      <stop offset="0%" stopColor="#fca5a5" />
                      <stop offset="45%" stopColor="#dc2626" />
                      <stop offset="100%" stopColor="#7f1d1d" />
                    </radialGradient>
                  </defs>
                  <circle cx="50" cy="50" r="46" fill="url(#redBallGradDesktop)" stroke="#7f1d1d" strokeWidth="2" />
                  <polygon points="50,28 68,41 61,62 39,62 32,41" fill="none" stroke="white" strokeWidth="3.2" opacity="0.9" />
                  <path d="M50,28 L50,10 M68,41 L84,29 M61,62 L67,82 M39,62 L33,82 M32,41 L16,29"
                    stroke="white" strokeWidth="2.6" fill="none" strokeLinecap="round" opacity="0.75" />
                  <ellipse cx="38" cy="32" rx="11" ry="7" fill="white" opacity="0.35" />
                </svg>
              </div>
            </div>
            <Link href="/" className="logo-bump inline-flex flex-col transition-transform duration-300 ease-out hover:scale-[1.03] active:scale-[0.98]">
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