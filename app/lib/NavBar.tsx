"use client";

import Link from "next/link";
import Image from "next/image";
import { useLang, t } from "./LanguageContext";

export default function NavBar() {
  const { lang, toggle } = useLang();

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-800 bg-neutral-900/80 backdrop-blur">
      <div className="max-w-6xl mx-auto px-6 md:px-10 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="hover:opacity-80 transition">
          <Image
            src="/logo.png"
            alt="Garcia's Auto Sales RGV"
            width={180}
            height={72}
            className="object-contain w-32 md:w-44"
            priority
          />
        </Link>

        {/* Links + toggle */}
        <nav className="flex items-center gap-1 md:gap-2">
          <Link
            href="/"
            className="rounded-xl bg-white text-black px-3 py-1.5 text-xs font-semibold md:px-4 md:py-2 md:text-sm hover:opacity-80 transition"
          >
            {t.nav.home[lang]}
          </Link>

          <Link
            href="/inventory"
            className="rounded-xl bg-white text-black px-3 py-1.5 text-xs font-semibold md:px-4 md:py-2 md:text-sm hover:opacity-80 transition"
          >
            {t.nav.inventory[lang]}
          </Link>

          <Link
            href="/contact"
            className="rounded-xl bg-white text-black px-3 py-1.5 text-xs font-semibold md:px-4 md:py-2 md:text-sm hover:opacity-80 transition"
          >
            {t.nav.contact[lang]}
          </Link>

          {/* Language toggle */}
          <button
            onClick={toggle}
            className="rounded-xl border border-zinc-600 bg-zinc-800 text-white px-3 py-1.5 text-xs font-semibold md:px-4 md:py-2 md:text-sm hover:bg-zinc-700 transition"
          >
            {lang === "en" ? "ES" : "EN"}
          </button>
        </nav>
      </div>
    </header>
  );
}