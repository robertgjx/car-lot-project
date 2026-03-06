import Link from "next/link";
import Image from "next/image";
import { vehicles } from "./lib/vehicles";

function formatMoney(n: number | null | undefined) {
  if (n == null) return "N/A";
  return n.toLocaleString("en-US", { style: "currency", currency: "USD" });
}
export default function Home() {
  const featured = vehicles.slice(0, 3);

  return (
    <main className="min-h-screen bg-black text-white">
      {/* HERO */}
      <section className="relative overflow-hidden rounded-3xl border border-zinc-800 bg-gradient-to-b from-zinc-950 to-black p-8 md:p-14">
        {/* Background Image */}
<div className="absolute inset-0 z-10">
  <img
    src="/palmtrees.jpg"
    alt="Background"
    className="h-full w-full object-cover opacity-60"
  />
  {/* Dark overlay for readability */}
  <div className="absolute inset-0 bg-black/40" />
</div>
        {/* subtle glow */}
        <div className="pointer-events-none absolute -top-40 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-white/10 blur-3xl" />

        <div className="relative z-10">
          <p className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-black/40 px-4 py-2 text-sm text-gray-300">
            <span className="h-2 w-2 rounded-full bg-green-400" />
            Rio Grande Valley • In-house financing available
          </p>

          <h1 className="mt-6 text-4xl font-extrabold tracking-tight md:text-6xl">
            Garcia&apos;s Auto Sales RGV
          </h1>

          <p className="mt-4 max-w-2xl text-lg text-gray-300 md:text-xl">
            Quality vehicles, fair prices, and simple approvals. We make it easy
            to get on the road with in-house financing.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/inventory"
              className="inline-flex items-center justify-center rounded-2xl border border-zinc-700 bg-black/40 px-6 py-4 text-base font-semibold text-white hover:bg-zinc-900 transition"
            >
              View Inventory
            </Link>

            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-2xl border border-zinc-700 bg-black/40 px-6 py-4 text-base font-semibold text-white hover:bg-zinc-900 transition"
            >
              Contact Us
            </Link>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
              <p className="text-sm text-gray-400">Fast approvals</p>
              <p className="mt-1 text-lg font-semibold">Simple process</p>
            </div>
            <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
              <p className="text-sm text-gray-400">Flexible financing</p>
              <p className="mt-1 text-lg font-semibold">In-house options</p>
            </div>
            <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
              <p className="text-sm text-gray-400">Transparent pricing</p>
              <p className="mt-1 text-lg font-semibold">No surprises</p>
            </div>
          </div>
        </div>
      </section>

      {/* WHY US */}
      <section className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
          <h2 className="text-xl font-bold">Family Owned and Operated</h2>
          <p className="mt-2 text-gray-300">
            Serving the city of Palmview since 1984. More than 40 years 
            providing customers with quality vehicles.
          </p>
        </div>

        <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
          <h2 className="text-xl font-bold">In-house financing</h2>
          <p className="mt-2 text-gray-300">
            We offer financing options designed to help you get approved and
            move forward.
          </p>
        </div>

        <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
          <h2 className="text-xl font-bold">Support</h2>
          <p className="mt-2 text-gray-300">
            Got questions? We’re here to help you.
          </p>
        </div>
      </section>
{/*
      {/* HOW IT WORKS 
      <section className="mt-10 rounded-3xl border border-zinc-800 bg-zinc-950 p-8">
        <h2 className="text-2xl font-extrabold">How it works</h2>
        <p className="mt-2 text-gray-300">
          A simple process from browsing to driving away.
        </p>

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-zinc-800 bg-black p-6">
            <p className="text-sm text-gray-400">Step 1</p>
            <p className="mt-1 text-lg font-semibold">Browse inventory</p>
            <p className="mt-2 text-gray-300">
              Find something you like and check the details.
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-black p-6">
            <p className="text-sm text-gray-400">Step 2</p>
            <p className="mt-1 text-lg font-semibold">Contact us</p>
            <p className="mt-2 text-gray-300">
              Ask about financing options.
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-black p-6">
            <p className="text-sm text-gray-400">Step 3</p>
            <p className="mt-1 text-lg font-semibold">Drive away</p>
            <p className="mt-2 text-gray-300">
              Get approved and leave with confidence.
            </p>
          </div>
        </div>
      </section>
*/}
      {/* FEATURED VEHICLES */}
      <section className="mt-10">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold">Featured vehicles</h2>
            <p className="mt-1 text-gray-300">
              A few picks from our current inventory.
            </p>
          </div>

          <Link
            href="/inventory"
            className="hidden md:inline-flex rounded-2xl border border-zinc-700 bg-black/40 px-5 py-3 font-semibold hover:bg-zinc-900 transition"
          >
            View all →
          </Link>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
          {featured.map((v) => (
            <div
              key={v.id}
              className="overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-950"
            >
              <div className="relative h-52 w-full bg-zinc-900">
                <Image
                  src={v.images?.[0] ?? v.image ?? "/cars/placeholder.jpg"}
                  alt={`${v.year} ${v.make} ${v.model}`}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="p-6">
                <p className="text-lg font-bold">
                  {v.year} {v.make} {v.model}›
                </p>
                <p className="mt-1 text-gray-300">{formatMoney(v.price)}</p>
                <p className="mt-1 text-sm text-gray-400">
                  {v.miles != null ? v.miles.toLocaleString() : "N/A"} miles
                </p>

                <Link
                  href={`/inventory/${v.id}`}
                  className="inline-flex mt-4 rounded-2xl bg-white px-5 py-3 font-semibold text-black hover:opacity-90 transition"
                >
                  View details
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 md:hidden">
          <Link
            href="/inventory"
            className="inline-flex w-full items-center justify-center rounded-2xl border border-zinc-700 bg-black/40 px-5 py-3 font-semibold hover:bg-zinc-900 transition"
          >
            View all inventory →
          </Link>
        </div>
      </section>

      {/* CONTACT */}
      <section className="mt-10 rounded-3xl border border-zinc-800 bg-zinc-950 p-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div>
            <h2 className="text-2xl font-extrabold">Contact us</h2>
            <p className="mt-2 text-gray-300">
              Want to ask about financing? Reach out and
              we’ll help you out.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-2xl bg-white px-6 py-4 text-base font-semibold text-black hover:opacity-90 transition"
              >
                Contact page
              </Link>

              <Link
                href="/inventory"
                className="inline-flex items-center justify-center rounded-2xl border border-zinc-700 bg-black/40 px-6 py-4 text-base font-semibold text-white hover:bg-zinc-900 transition"
              >
                Browse inventory
              </Link>
            </div>
          </div>

          <div className="rounded-3xl border border-zinc-800 bg-black p-6">
            <div className="mt-4 space-y-3 text-gray-200">
              <p>
                <span className="text-gray-400">Phone:</span> (956) 581-0455
              </p>
              <p>
                <span className="text-gray-400">Location:</span> Palmview, TX
              </p>
              <p>
                <span className="text-gray-400">Hours:</span> Mon–Fri 9AM–6PM, 
                Sat 9AM-3PM, 
                Sun Closed
              </p>
            </div>
            
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="mt-10 pb-10 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Garcia&apos;s Auto Sales RGV. All rights
        reserved.
      </footer>
    </main>
  );
}