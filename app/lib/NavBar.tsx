"use client";

import Link from "next/link";
import Image from "next/image";
import { useLang, t } from "./LanguageContext";

export default function NavBar() {
  const { lang, toggle } = useLang();

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/90 backdrop-blur">
      <div className="max-w-6xl mx-auto pl-2 pr-6 md:pr-10 py-2 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="hover:opacity-80 transition">
          <Image
            src="/logo.png"
            alt="Garcia's Auto Sales RGV"
            width={220}
            height={88}
            className="object-contain w-40 md:w-56"
            priority
          />
        </Link>

        {/* Links + toggle */}
        <nav className="flex items-center gap-1 md:gap-2">
          <Link
            href="/"
            className="rounded-xl border border-gray-200 bg-white text-gray-900 px-3 py-1.5 text-xs font-semibold md:px-4 md:py-2 md:text-sm hover:bg-gray-100 transition"
          >
            {t.nav.home[lang]}
          </Link>

          <Link
            href="/inventory"
            className="rounded-xl border border-gray-200 bg-white text-gray-900 px-3 py-1.5 text-xs font-semibold md:px-4 md:py-2 md:text-sm hover:bg-gray-100 transition"
          >
            {t.nav.inventory[lang]}
          </Link>

          <Link
            href="/contact"
            className="rounded-xl border border-gray-200 bg-white text-gray-900 px-3 py-1.5 text-xs font-semibold md:px-4 md:py-2 md:text-sm hover:bg-gray-100 transition"
          >
            {t.nav.contact[lang]}
          </Link>

          {/* Language toggle */}
          <button
            onClick={toggle}
            className="rounded-xl bg-red-600 text-white px-3 py-1.5 text-xs font-semibold md:px-4 md:py-2 md:text-sm hover:bg-red-700 transition"
          >
            {lang === "en" ? "ES" : "EN"}
          </button>
        </nav>
      </div>
    </header>
  );
}