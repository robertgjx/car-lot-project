"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { vehicles } from "@/app/lib/vehicles";
import { useLang } from "@/app/lib/LanguageContext";

interface NHTSAResult {
  Variable: string;
  Value: string | null;
}

interface DecodedVehicle {
  year: string;
  make: string;
  model: string;
  trim: string;
  engine: string;
  bodyStyle: string;
  driveType: string;
  transmission: string;
  doors: string;
  fuel: string;
}

function parseNHTSA(results: NHTSAResult[]): DecodedVehicle {
  const get = (label: string) =>
    results.find((r) => r.Variable === label)?.Value || "";
  return {
    year: get("Model Year"),
    make: get("Make"),
    model: get("Model"),
    trim: get("Trim"),
    engine: [get("Displacement (L)") && `${get("Displacement (L)")}L`, get("Engine Number of Cylinders") && `${get("Engine Number of Cylinders")} cyl`].filter(Boolean).join(" "),
    bodyStyle: get("Body Class"),
    driveType: get("Drive Type"),
    transmission: get("Transmission Style"),
    doors: get("Doors"),
    fuel: get("Fuel Type - Primary"),
  };
}

export default function ScanPage() {
  const { lang } = useLang();
  const [mode, setMode] = useState<"idle" | "camera" | "manual" | "loading" | "result" | "error">("idle");
  const [vin, setVin] = useState("");
  const [manualInput, setManualInput] = useState("");
  const [decoded, setDecoded] = useState<DecodedVehicle | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animFrameRef = useRef<number | null>(null);

  const txt = {
    title: lang === "en" ? "VIN Scanner" : "Escáner de VIN",
    subtitle: lang === "en" ? "Scan a vehicle's barcode or enter the VIN manually to get full details." : "Escanea el código de barras o ingresa el VIN para ver los detalles.",
    scanBtn: lang === "en" ? "Scan Barcode" : "Escanear Código",
    manualBtn: lang === "en" ? "Enter VIN Manually" : "Ingresar VIN Manual",
    placeholder: lang === "en" ? "Enter 17-character VIN..." : "Ingresa el VIN de 17 caracteres...",
    lookupBtn: lang === "en" ? "Look Up Vehicle" : "Buscar Vehículo",
    inInventory: lang === "en" ? "✅ We have this vehicle in stock!" : "✅ ¡Tenemos este vehículo en inventario!",
    notInventory: lang === "en" ? "This vehicle is not currently in our inventory." : "Este vehículo no está en nuestro inventario actualmente.",
    viewListing: lang === "en" ? "View Our Listing →" : "Ver Nuestro Listado →",
    tryAnother: lang === "en" ? "Scan Another" : "Escanear Otro",
    back: lang === "en" ? "← Back" : "← Regresar",
    scanning: lang === "en" ? "Point camera at the barcode on the window sticker" : "Apunta la cámara al código de barras en el sticker",
    loading: lang === "en" ? "Looking up vehicle..." : "Buscando vehículo...",
    errorTitle: lang === "en" ? "Could not decode VIN" : "No se pudo decodificar el VIN",
  };

  // Cleanup camera on unmount
  useEffect(() => {
    return () => stopCamera();
  }, []);

  function stopCamera() {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    if (streamRef.current) streamRef.current.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }

  async function startCamera() {
    setMode("camera");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        scanFrame();
      }
    } catch {
      setErrorMsg(lang === "en" ? "Camera access denied. Please allow camera access and try again." : "Acceso a cámara denegado. Por favor permite el acceso e intenta de nuevo.");
      setMode("error");
    }
  }

  function scanFrame() {
    if (!videoRef.current) return;
    const video = videoRef.current;
    if (video.readyState === video.HAVE_ENOUGH_DATA) {
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.drawImage(video, 0, 0);
      // @ts-ignore — BarcodeDetector is available on modern mobile browsers
      if ("BarcodeDetector" in window) {
        // @ts-ignore
        const detector = new BarcodeDetector({ formats: ["code_39", "code_128", "qr_code", "pdf417"] });
        detector.detect(canvas).then((barcodes: any[]) => {
          if (barcodes.length > 0) {
            const raw = barcodes[0].rawValue;
            // VINs are 17 chars, sometimes barcode has leading I
            const extracted = raw.replace(/^I/, "").trim().toUpperCase();
            if (extracted.length === 17) {
              stopCamera();
              lookupVIN(extracted);
              return;
            }
          }
          animFrameRef.current = requestAnimationFrame(scanFrame);
        }).catch(() => {
          animFrameRef.current = requestAnimationFrame(scanFrame);
        });
      } else {
        // BarcodeDetector not supported — fall back to manual
        stopCamera();
        setMode("manual");
        setErrorMsg(lang === "en" ? "Barcode scanning not supported on this browser. Please enter the VIN manually." : "Escaneo no compatible con este navegador. Ingresa el VIN manualmente.");
      }
    } else {
      animFrameRef.current = requestAnimationFrame(scanFrame);
    }
  }

  async function lookupVIN(v: string) {
    setVin(v);
    setMode("loading");
    try {
      const res = await fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/decodevin/${v}?format=json`);
      const data = await res.json();
      const results: NHTSAResult[] = data.Results;
      const parsed = parseNHTSA(results);
      if (!parsed.make || !parsed.year) {
        setErrorMsg(lang === "en" ? "Invalid VIN or vehicle not found." : "VIN inválido o vehículo no encontrado.");
        setMode("error");
        return;
      }
      setDecoded(parsed);
      setMode("result");
    } catch {
      setErrorMsg(lang === "en" ? "Network error. Please check your connection." : "Error de red. Verifica tu conexión.");
      setMode("error");
    }
  }

  function reset() {
    setMode("idle");
    setVin("");
    setManualInput("");
    setDecoded(null);
    setErrorMsg("");
  }

  // Check if VIN is in our inventory
  const inventoryMatch = vin ? vehicles.find((v) => v.vin?.toUpperCase() === vin.toUpperCase()) : null;

  const rows = decoded ? [
    { label: lang === "en" ? "Year" : "Año", value: decoded.year },
    { label: lang === "en" ? "Make" : "Marca", value: decoded.make },
    { label: lang === "en" ? "Model" : "Modelo", value: decoded.model },
    { label: lang === "en" ? "Trim" : "Versión", value: decoded.trim },
    { label: lang === "en" ? "Engine" : "Motor", value: decoded.engine },
    { label: lang === "en" ? "Body Style" : "Carrocería", value: decoded.bodyStyle },
    { label: lang === "en" ? "Drive Type" : "Tracción", value: decoded.driveType },
    { label: lang === "en" ? "Transmission" : "Transmisión", value: decoded.transmission },
    { label: lang === "en" ? "Doors" : "Puertas", value: decoded.doors },
    { label: lang === "en" ? "Fuel" : "Combustible", value: decoded.fuel },
  ].filter((r) => r.value) : [];

  return (
    <main className="min-h-screen bg-white text-gray-900 px-4 py-6 max-w-lg mx-auto">

      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link href="/" className="text-gray-400 hover:text-gray-700 transition">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </Link>
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">{txt.title}</h1>
          <p className="text-sm text-gray-500 mt-0.5">{txt.subtitle}</p>
        </div>
      </div>

      {/* IDLE */}
      {mode === "idle" && (
        <div className="flex flex-col gap-4">
          <button onClick={startCamera}
            className="w-full flex items-center justify-center gap-3 bg-red-600 hover:bg-red-700 text-white font-bold py-5 rounded-2xl text-lg transition shadow-md">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 2l-4 5-4-5"/>
              <line x1="7" y1="12" x2="7" y2="17"/><line x1="10" y1="12" x2="10" y2="17"/>
              <line x1="13" y1="12" x2="13" y2="17"/><line x1="16" y1="12" x2="16" y2="17"/>
            </svg>
            {txt.scanBtn}
          </button>
          <button onClick={() => setMode("manual")}
            className="w-full flex items-center justify-center gap-3 border-2 border-gray-200 hover:border-red-400 text-gray-800 font-bold py-5 rounded-2xl text-lg transition">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
            {txt.manualBtn}
          </button>

          {/* Tip card */}
          <div className="mt-2 rounded-2xl bg-gray-50 border border-gray-200 p-4 text-sm text-gray-500">
            <p className="font-semibold text-gray-700 mb-1">💡 {lang === "en" ? "Tip" : "Consejo"}</p>
            <p>{lang === "en" ? "The VIN barcode is usually found on the driver's side door jamb sticker or the bottom of the windshield." : "El código de barras del VIN generalmente está en la pegatina del pilar de la puerta del conductor o en la parte inferior del parabrisas."}</p>
          </div>
        </div>
      )}

      {/* CAMERA */}
      {mode === "camera" && (
        <div className="flex flex-col gap-4">
          <div className="relative rounded-2xl overflow-hidden bg-black aspect-video">
            <video ref={videoRef} className="w-full h-full object-cover" playsInline muted />
            {/* Scanning overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <div className="w-64 h-20 border-2 border-red-500 rounded-lg relative">
                <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-red-500 rounded-tl" />
                <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-red-500 rounded-tr" />
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-red-500 rounded-bl" />
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-red-500 rounded-br" />
                {/* Scanning line animation */}
                <div className="absolute inset-x-0 top-1/2 h-0.5 bg-red-500 opacity-80 animate-pulse" />
              </div>
            </div>
          </div>
          <p className="text-center text-sm text-gray-500">{txt.scanning}</p>
          <button onClick={() => { stopCamera(); reset(); }}
            className="w-full border-2 border-gray-200 text-gray-700 font-semibold py-3 rounded-2xl hover:bg-gray-50 transition">
            {lang === "en" ? "Cancel" : "Cancelar"}
          </button>
        </div>
      )}

      {/* MANUAL */}
      {mode === "manual" && (
        <div className="flex flex-col gap-4">
          {errorMsg && (
            <div className="rounded-2xl bg-yellow-50 border border-yellow-200 px-4 py-3 text-sm text-yellow-800">{errorMsg}</div>
          )}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">VIN</label>
            <input
              type="text"
              maxLength={17}
              value={manualInput}
              onChange={(e) => setManualInput(e.target.value.toUpperCase())}
              placeholder={txt.placeholder}
              className="w-full border-2 border-gray-200 focus:border-red-500 rounded-2xl px-4 py-4 text-base font-mono tracking-widest outline-none transition"
            />
            <p className="text-xs text-gray-400 mt-1 text-right">{manualInput.length}/17</p>
          </div>
          <button
            onClick={() => manualInput.length === 17 && lookupVIN(manualInput)}
            disabled={manualInput.length !== 17}
            className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-200 disabled:text-gray-400 text-white font-bold py-4 rounded-2xl text-base transition">
            {txt.lookupBtn}
          </button>
          <button onClick={reset}
            className="w-full border-2 border-gray-200 text-gray-700 font-semibold py-3 rounded-2xl hover:bg-gray-50 transition">
            {txt.back}
          </button>
        </div>
      )}

      {/* LOADING */}
      {mode === "loading" && (
        <div className="flex flex-col items-center justify-center gap-4 py-20">
          <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500 font-medium">{txt.loading}</p>
          <p className="font-mono text-sm text-gray-400">{vin}</p>
        </div>
      )}

      {/* RESULT */}
      {mode === "result" && decoded && (
        <div className="flex flex-col gap-4">
          {/* VIN badge */}
          <div className="rounded-2xl bg-gray-50 border border-gray-200 px-4 py-3 flex items-center justify-between">
            <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider">VIN</span>
            <span className="font-mono text-sm text-gray-700">{vin}</span>
          </div>

          {/* Vehicle title */}
          <div>
            <h2 className="text-2xl font-extrabold text-gray-900">
              {decoded.year} {decoded.make} {decoded.model}
            </h2>
            {decoded.trim && <p className="text-gray-500 text-sm mt-0.5">{decoded.trim}</p>}
          </div>

          {/* Inventory match */}
          {inventoryMatch ? (
            <div className="rounded-2xl bg-green-50 border-2 border-green-400 p-4">
              <p className="font-bold text-green-700 text-sm mb-2">{txt.inInventory}</p>
              <p className="text-green-800 font-extrabold text-xl">
                {inventoryMatch.price ? `$${inventoryMatch.price.toLocaleString()}` : "Call for price"}
              </p>
              {inventoryMatch.down && (
                <p className="text-green-600 text-sm">Down: ${inventoryMatch.down.toLocaleString()}</p>
              )}
              <Link href={`/inventory/${inventoryMatch.id}`}
                className="mt-3 inline-flex items-center justify-center w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl transition">
                {txt.viewListing}
              </Link>
            </div>
          ) : (
            <div className="rounded-2xl bg-gray-50 border border-gray-200 px-4 py-3 text-sm text-gray-500">
              {txt.notInventory}
            </div>
          )}

          {/* Specs table */}
          <div className="rounded-2xl border border-gray-200 overflow-hidden">
            {rows.map((row, i) => (
              <div key={row.label} className={`flex justify-between px-4 py-3 text-sm ${i % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>
                <span className="text-gray-500 font-medium">{row.label}</span>
                <span className="text-gray-900 font-semibold text-right max-w-[55%]">{row.value}</span>
              </div>
            ))}
          </div>

          <button onClick={reset}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-2xl transition">
            {txt.tryAnother}
          </button>
        </div>
      )}

      {/* ERROR */}
      {mode === "error" && (
        <div className="flex flex-col gap-4">
          <div className="rounded-2xl bg-red-50 border border-red-200 p-5 text-center">
            <p className="text-2xl mb-2">⚠️</p>
            <p className="font-bold text-red-700">{txt.errorTitle}</p>
            <p className="text-sm text-red-500 mt-1">{errorMsg}</p>
          </div>
          <button onClick={reset}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-2xl transition">
            {txt.tryAnother}
          </button>
          <button onClick={() => { setErrorMsg(""); setMode("manual"); }}
            className="w-full border-2 border-gray-200 text-gray-700 font-semibold py-3 rounded-2xl hover:bg-gray-50 transition">
            {txt.manualBtn}
          </button>
        </div>
      )}
    </main>
  );
}