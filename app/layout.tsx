import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Garcia's Auto Sales",
  description: "Vehicle inventory and in-house financing",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-black text-white">
        {/* Navbar */}
        <header className="sticky top-0 z-50 border-b border-zinc-800 bg-neutral-900/80 backdrop-blur">
          <div className="max-w-6xl mx-auto px-6 md:px-10 py-4 flex items-center justify-between">
            {/* Brand */}
            <Link href="/" className="font-extrabold text-xl md:text-2xl tracking-wide text-white hover:opacity-80 transition">
              Garcia&apos;s Auto Sales RGV
            </Link>

            {/* Links */}
            <nav className="flex items-center gap-2">
              <Link
                href="/"
                className="rounded-xl bg-white text-black px-4 py-2 font-semibold hover:opacity-80 transition"
              >
                Home
              </Link>
              {/*
              <Link
                href="/inventory"
                className="rounded-xl px-4 py-2 font-semibold border border-white text-white hover:bg-white hover:text-black transition"
              >
                Inventory
              </Link>
                */}
              <Link
                href="/contact"
                className="rounded-xl bg-white text-black px-4 py-2 font-semibold hover:opacity-80 transition"
              >
                Contact Us
              </Link>
            </nav>
          </div>
        </header>

        {/* Page content */}
        <div className="max-w-6xl mx-auto px-6 md:px-10 py-8">{children}</div>
      </body>
    </html>
  );
}
