import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      {/* Background glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-[-220px] left-[-220px] h-[520px] w-[520px] rounded-full bg-white/5 blur-3xl" />
        <div className="absolute top-[35%] right-[-260px] h-[560px] w-[560px] rounded-full bg-white/5 blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center px-6 py-16">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="relative h-14 w-14 overflow-hidden rounded-2xl bg-white/10 ring-1 ring-white/15">
            {/* Change src if your logo file name is different */}
            <Image
              src="/logo.png"
              alt="Garcia's Auto Sales RGV logo"
              fill
              className="object-contain p-2"
              priority
            />
          </div>
          <div className="text-left">
            <p className="text-sm text-white/70">Garcia&apos;s Auto Sales RGV</p>
            <p className="text-xs text-white/50">Mission, TX</p>
          </div>
        </div>

        {/* Heading */}
        <h1 className="mt-10 text-center text-4xl font-bold tracking-tight md:text-6xl">
          Something new is
          <span className="block bg-gradient-to-r from-white to-white/50 bg-clip-text text-transparent">
            coming soon
          </span>
        </h1>

        <p className="mt-5 max-w-2xl text-center text-base text-white/70 md:text-lg">
          We&apos;re building a new inventory experience for Garcia&apos;s Auto Sales RGV.
          Browse vehicles, view details, and contact us — all in one place.
        </p>

        {/* Status pill + animated dots */}
        <div className="mt-8 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm text-white/80 ring-1 ring-white/15">
          <span className="h-2 w-2 rounded-full bg-green-400" />
          Building the new site
          <span className="ml-2 inline-flex items-center gap-1">
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-white/60 [animation-delay:0ms]" />
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-white/60 [animation-delay:150ms]" />
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-white/60 [animation-delay:300ms]" />
          </span>
        </div>

        {/* Buttons */}
        <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row">
          <Link
            href="/inventory"
            className="inline-flex items-center justify-center rounded-2xl bg-white px-6 py-3 text-sm font-semibold text-black shadow-lg transition hover:opacity-90"
          >
            Browse Inventory
          </Link>

          <Link
            href="/contact"
            className="inline-flex items-center justify-center rounded-2xl bg-white/10 px-6 py-3 text-sm font-semibold text-white ring-1 ring-white/15 transition hover:bg-white/15"
          >
            Contact Us
          </Link>
        </div>

        {/* Footer microcopy */}
        <div className="mt-10 text-center text-xs text-white/45">
          © {new Date().getFullYear()} Garcia&apos;s Auto Sales RGV • All rights reserved
        </div>
      </div>
    </main>
  );
}