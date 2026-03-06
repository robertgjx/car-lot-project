import Image from "next/image";

export default function ContactPage() {
  return (
    <main className="min-h-screen">
      <h1 className="text-4xl font-bold">Contact</h1>
      <p className="mt-2 text-gray-400">
        Call to ask about a vehicle or in-house financing.
      </p>

      <div className="mt-6 bg-zinc-900 rounded-2xl p-6 space-y-4">
        <p>
          <span className="text-gray-400">Office Phone:</span>{" "}
          <a href="tel:9565810455" className="text-white hover:underline">
            (956) 581-0455
          </a>
        </p>

        <p>
          <span className="text-gray-400">Location:</span>{" "}
          <span className="text-white">1801 W Palma Vista Dr. Palmview, TX 78572</span>
        </p>

        <hr className="border-zinc-700" />

        <div>
          <p className="text-gray-400 text-sm font-semibold uppercase tracking-wide">
            For any questions, please call one of our inventory associates:
          </p>
          <div className="mt-3 bg-zinc-800 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <span className="text-white font-semibold text-lg">Caesar</span>
            <a href="tel:9564789359" className="text-white font-medium hover:underline">
              (956) 478-9359
            </a>
          </div>
        </div>

        <hr className="border-zinc-700" />

        <div className="flex flex-col items-center gap-3 pt-2">
          <p className="text-sm text-white/60">Follow us on Facebook</p>
          <a
            href="https://facebook.com/garciasautosalesrgvllc"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-3 rounded-2xl bg-zinc-800 px-5 py-4 hover:bg-zinc-700 transition"
          >
            <Image src="/facebook.svg" alt="Facebook" width={24} height={24} />
            <span className="font-semibold text-white">Garcia&apos;s Auto Sales RGV</span>
          </a>
        </div>
      </div>
    </main>
  );
} 