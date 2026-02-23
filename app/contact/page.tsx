export default function ContactPage() {
    return (
      <main className="min-h-screen">
        <h1 className="text-4xl font-bold">Contact</h1>
        <p className="mt-2 text-gray-400">
          Call or text us to ask about a vehicle or in-house financing.
        </p>
  
        <div className="mt-6 bg-zinc-900 rounded-2xl p-6 space-y-3">
          <p>
            <span className="text-gray-400">Phone:</span>{" "}
            <span className="text-white">(956)-581-0455</span>
          </p>
          <p>
            <span className="text-gray-400">Location:</span>{" "}
            <span className="text-white">1801 W Palma Vista Dr. Palmview, TX 78572</span>
          </p>
        </div>
      </main>
    );
  }