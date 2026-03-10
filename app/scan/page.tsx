"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { vehicles } from "@/app/lib/vehicles";
import { useLang } from "@/app/lib/LanguageContext";

interface NHTSAResult { Variable: string; Value: string | null; }
interface DecodedVehicle {
  year: string; make: string; model: string; trim: string;
  engine: string; bodyStyle: string; driveType: string;
  transmission: string; doors: string; fuel: string;
}

function parseNHTSA(results: NHTSAResult[]): DecodedVehicle {
  const get = (label: string) => results.find((r) => r.Variable === label)?.Value || "";
  return {
    year: get("Model Year"), make: get("Make"), model: get("Model"), trim: get("Trim"),
    engine: [get("Displacement (L)") && `${get("Displacement (L)")}L`, get("Engine Number of Cylinders") && `${get("Engine Number of Cylinders")} cyl`].filter(Boolean).join(" "),
    bodyStyle: get("Body Class"), driveType: get("Drive Type"),
    transmission: get("Transmission Style"), doors: get("Doors"), fuel: get("Fuel Type - Primary"),
  };
}

function extractVIN(text: string): string | null {
  // VINs are 17 chars, only A-H, J-N, P-Z, 0-9 (no I, O, Q)
  const cleaned = text.toUpperCase().replace(/[^A-HJ-NPR-Z0-9]/g, " ");
  const matches = cleaned.match(/[A-HJ-NPR-Z0-9]{17}/g);
  if (matches && matches.length > 0) return matches[0];
  return null;
}

export default function ScanPage() {
  const { lang } = useLang();
  const [mode, setMode] = useState<"idle" | "camera" | "photo" | "ocr" | "manual" | "loading" | "result" | "error">("idle");
  const [vin, setVin] = useState("");
  const [manualInput, setManualInput] = useState("");
  const [decoded, setDecoded] = useState<DecodedVehicle | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [ocrProgress, setOcrProgress] = useState(0);
  const [ocrStatus, setOcrStatus] = useState("");
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const photoVideoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const photoStreamRef = useRef<MediaStream | null>(null);
  const scanningRef = useRef(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const txt = {
    title: lang === "en" ? "VIN Scanner" : "Escáner de VIN",
    subtitle: lang === "en" ? "Scan a barcode, snap a photo, or type the VIN." : "Escanea un código, toma una foto o escribe el VIN.",
    scanBtn: lang === "en" ? "Scan Barcode" : "Escanear Código de Barras",
    photoBtn: lang === "en" ? "Snap VIN Photo" : "Tomar Foto del VIN",
    manualBtn: lang === "en" ? "Enter VIN Manually" : "Ingresar VIN Manual",
    placeholder: lang === "en" ? "Enter 17-character VIN..." : "Ingresa el VIN de 17 caracteres...",
    lookupBtn: lang === "en" ? "Look Up Vehicle" : "Buscar Vehículo",
    inInventory: lang === "en" ? "✅ We have this vehicle in stock!" : "✅ ¡Tenemos este vehículo en inventario!",
    notInventory: lang === "en" ? "This vehicle is not currently in our inventory." : "Este vehículo no está en nuestro inventario actualmente.",
    viewListing: lang === "en" ? "View Our Listing →" : "Ver Nuestro Listado →",
    tryAnother: lang === "en" ? "Scan Another" : "Escanear Otro",
    back: lang === "en" ? "← Back" : "← Regresar",
    scanning: lang === "en" ? "Point camera at the VIN barcode" : "Apunta la cámara al código de barras del VIN",
    photoPrompt: lang === "en" ? "Point camera at the VIN number and tap Capture" : "Apunta la cámara al número VIN y toca Capturar",
    captureBtn: lang === "en" ? "📸 Capture" : "📸 Capturar",
    loading: lang === "en" ? "Looking up vehicle..." : "Buscando vehículo...",
    cancel: lang === "en" ? "Cancel" : "Cancelar",
    readingVin: lang === "en" ? "Reading VIN from photo..." : "Leyendo VIN de la foto...",
    tip: lang === "en" ? "Tip" : "Consejo",
    tipText: lang === "en"
      ? "VIN barcode is on the driver's door jamb sticker or bottom of the windshield."
      : "El código de barras VIN está en la pegatina del pilar de la puerta del conductor.",
  };

  const stopCamera = useCallback(() => {
    scanningRef.current = false;
    if (streamRef.current) { streamRef.current.getTracks().forEach((t) => t.stop()); streamRef.current = null; }
    if (videoRef.current) videoRef.current.srcObject = null;
  }, []);

  const stopPhotoCamera = useCallback(() => {
    if (photoStreamRef.current) { photoStreamRef.current.getTracks().forEach((t) => t.stop()); photoStreamRef.current = null; }
    if (photoVideoRef.current) photoVideoRef.current.srcObject = null;
  }, []);

  useEffect(() => () => { stopCamera(); stopPhotoCamera(); }, [stopCamera, stopPhotoCamera]);

  // --- BARCODE SCANNER ---
  async function startCamera() {
    setMode("camera");
    setErrorMsg("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" }, width: { ideal: 1280 } }, audio: false,
      });
      streamRef.current = stream;
      if (!videoRef.current) throw new Error("No video element");
      videoRef.current.srcObject = stream;
      videoRef.current.setAttribute("playsinline", "true");
      await videoRef.current.play();

      try {
        const { BrowserMultiFormatReader } = await import("@zxing/browser") as any;
        const reader = new BrowserMultiFormatReader();
        scanningRef.current = true;
        const tick = () => {
          if (!scanningRef.current || !videoRef.current || !canvasRef.current) return;
          const video = videoRef.current;
          const canvas = canvasRef.current;
          if (video.readyState < 2) { requestAnimationFrame(tick); return; }
          canvas.width = video.videoWidth; canvas.height = video.videoHeight;
          const ctx = canvas.getContext("2d");
          if (!ctx) return;
          ctx.drawImage(video, 0, 0);
          reader.decodeFromCanvas(canvas)
            .then((result: any) => {
              if (!scanningRef.current) return;
              const extracted = result.getText().replace(/^I/, "").trim().toUpperCase();
              if (extracted.length === 17) { stopCamera(); lookupVIN(extracted); }
              else requestAnimationFrame(tick);
            })
            .catch(() => { if (scanningRef.current) requestAnimationFrame(tick); });
        };
        requestAnimationFrame(tick);
      } catch {
        stopCamera();
        setMode("manual");
        setErrorMsg(lang === "en" ? "Barcode scanning unavailable. Enter VIN manually." : "Escaneo no disponible. Ingresa el VIN manualmente.");
      }
    } catch (e: any) {
      stopCamera();
      setErrorMsg(lang === "en"
        ? "Camera access denied. Go to Settings → Safari → Camera → Allow."
        : "Acceso denegado. Ve a Configuración → Safari → Cámara → Permitir.");
      setMode("error");
    }
  }

  // --- PHOTO / OCR ---
  async function startPhotoCamera() {
    setMode("photo");
    setCapturedImage(null);
    setErrorMsg("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" }, width: { ideal: 1920 } }, audio: false,
      });
      photoStreamRef.current = stream;
      if (!photoVideoRef.current) throw new Error("No video element");
      photoVideoRef.current.srcObject = stream;
      photoVideoRef.current.setAttribute("playsinline", "true");
      await photoVideoRef.current.play();
    } catch {
      stopPhotoCamera();
      setErrorMsg(lang === "en" ? "Camera access denied." : "Acceso a cámara denegado.");
      setMode("error");
    }
  }

  async function captureAndOCR() {
    if (!photoVideoRef.current) return;
    const video = photoVideoRef.current;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.95);
    setCapturedImage(dataUrl);
    stopPhotoCamera();
    setMode("ocr");
    setOcrProgress(0);
    setOcrStatus(lang === "en" ? "Loading text reader..." : "Cargando lector de texto...");

    try {
      const Tesseract = await import("tesseract.js");
      const worker = await Tesseract.createWorker("eng", 1, {
        logger: (m: any) => {
          if (m.status === "recognizing text") {
            setOcrProgress(Math.round(m.progress * 100));
            setOcrStatus(lang === "en" ? "Reading VIN from photo..." : "Leyendo VIN de la foto...");
          } else if (m.status === "loading tesseract core") {
            setOcrStatus(lang === "en" ? "Loading engine..." : "Cargando motor...");
            setOcrProgress(10);
          } else if (m.status === "initializing api") {
            setOcrStatus(lang === "en" ? "Initializing..." : "Inicializando...");
            setOcrProgress(30);
          }
        },
      });

      setOcrStatus(lang === "en" ? "Scanning for VIN..." : "Buscando VIN...");
      const { data: { text } } = await worker.recognize(dataUrl);
      await worker.terminate();

      const found = extractVIN(text);
      if (found) {
        lookupVIN(found);
      } else {
        // VIN not found — show manual with pre-notice
        setMode("manual");
        setErrorMsg(lang === "en"
          ? "Couldn't read a VIN from the photo. Try again with better lighting or enter manually."
          : "No se encontró un VIN en la foto. Intenta con mejor iluminación o ingrésalo manualmente.");
      }
    } catch {
      setMode("manual");
      setErrorMsg(lang === "en" ? "OCR failed. Please enter the VIN manually." : "Error al leer. Ingresa el VIN manualmente.");
    }
  }

  async function lookupVIN(v: string) {
    setVin(v);
    setMode("loading");
    try {
      const res = await fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/decodevin/${v}?format=json`);
      const data = await res.json();
      const parsed = parseNHTSA(data.Results);
      if (!parsed.make || !parsed.year) {
        setErrorMsg(lang === "en" ? "Invalid VIN or vehicle not found." : "VIN inválido o vehículo no encontrado.");
        setMode("error"); return;
      }
      setDecoded(parsed);
      setMode("result");
    } catch {
      setErrorMsg(lang === "en" ? "Network error. Check your connection." : "Error de red. Verifica tu conexión.");
      setMode("error");
    }
  }

  function reset() {
    stopCamera(); stopPhotoCamera();
    setMode("idle"); setVin(""); setManualInput(""); setDecoded(null);
    setErrorMsg(""); setOcrProgress(0); setOcrStatus(""); setCapturedImage(null);
  }

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
      <canvas ref={canvasRef} className="hidden" />

      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link href="/" className="text-gray-400 hover:text-gray-700 transition">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
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
        <div className="flex flex-col gap-3">
          <button onClick={startCamera}
            className="w-full flex items-center justify-center gap-3 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-bold py-5 rounded-2xl text-lg transition shadow-md">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/>
              <path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/>
              <line x1="7" y1="8" x2="7" y2="16"/><line x1="10" y1="8" x2="10" y2="16"/>
              <line x1="13" y1="8" x2="13" y2="16"/><line x1="16" y1="8" x2="16" y2="16"/>
            </svg>
            {txt.scanBtn}
          </button>
          <button onClick={startPhotoCamera}
            className="w-full flex items-center justify-center gap-3 bg-gray-900 hover:bg-gray-800 active:bg-gray-700 text-white font-bold py-5 rounded-2xl text-lg transition shadow-md">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
              <circle cx="12" cy="13" r="4"/>
            </svg>
            {txt.photoBtn}
          </button>
          <button onClick={() => setMode("manual")}
            className="w-full flex items-center justify-center gap-3 border-2 border-gray-200 hover:border-red-400 active:bg-gray-50 text-gray-800 font-bold py-4 rounded-2xl text-base transition">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
            {txt.manualBtn}
          </button>
          <div className="mt-1 rounded-2xl bg-gray-50 border border-gray-200 p-4 text-sm text-gray-500">
            <p className="font-semibold text-gray-700 mb-1">💡 {txt.tip}</p>
            <p>{txt.tipText}</p>
          </div>
        </div>
      )}

      {/* BARCODE CAMERA */}
      {mode === "camera" && (
        <div className="flex flex-col gap-4">
          <div className="relative rounded-2xl overflow-hidden bg-black w-full" style={{ aspectRatio: "4/3" }}>
            <video ref={videoRef} className="w-full h-full object-cover" playsInline muted autoPlay />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-72 h-24 relative">
                <div className="absolute top-0 left-0 w-5 h-5 border-t-4 border-l-4 border-red-500 rounded-tl-md" />
                <div className="absolute top-0 right-0 w-5 h-5 border-t-4 border-r-4 border-red-500 rounded-tr-md" />
                <div className="absolute bottom-0 left-0 w-5 h-5 border-b-4 border-l-4 border-red-500 rounded-bl-md" />
                <div className="absolute bottom-0 right-0 w-5 h-5 border-b-4 border-r-4 border-red-500 rounded-br-md" />
                <div className="absolute inset-x-4 top-1/2 h-0.5 bg-red-500/70 animate-pulse" />
              </div>
            </div>
          </div>
          <p className="text-center text-sm text-gray-500">{txt.scanning}</p>
          <button onClick={() => { stopCamera(); reset(); }}
            className="w-full border-2 border-gray-200 text-gray-700 font-semibold py-3 rounded-2xl hover:bg-gray-50 transition">
            {txt.cancel}
          </button>
        </div>
      )}

      {/* PHOTO CAMERA */}
      {mode === "photo" && (
        <div className="flex flex-col gap-4">
          <div className="relative rounded-2xl overflow-hidden bg-black w-full" style={{ aspectRatio: "4/3" }}>
            <video ref={photoVideoRef} className="w-full h-full object-cover" playsInline muted autoPlay />
            {/* Corner guides */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-64 h-16 relative">
                <div className="absolute top-0 left-0 w-5 h-5 border-t-4 border-l-4 border-white rounded-tl-md" />
                <div className="absolute top-0 right-0 w-5 h-5 border-t-4 border-r-4 border-white rounded-tr-md" />
                <div className="absolute bottom-0 left-0 w-5 h-5 border-b-4 border-l-4 border-white rounded-bl-md" />
                <div className="absolute bottom-0 right-0 w-5 h-5 border-b-4 border-r-4 border-white rounded-br-md" />
              </div>
            </div>
          </div>
          <p className="text-center text-sm text-gray-500">{txt.photoPrompt}</p>
          <button onClick={captureAndOCR}
            className="w-full bg-gray-900 hover:bg-gray-800 text-white font-bold py-4 rounded-2xl text-lg transition">
            {txt.captureBtn}
          </button>
          <button onClick={() => { stopPhotoCamera(); reset(); }}
            className="w-full border-2 border-gray-200 text-gray-700 font-semibold py-3 rounded-2xl hover:bg-gray-50 transition">
            {txt.cancel}
          </button>
        </div>
      )}

      {/* OCR PROCESSING */}
      {mode === "ocr" && (
        <div className="flex flex-col gap-6 py-8">
          {capturedImage && (
            <div className="rounded-2xl overflow-hidden border border-gray-200">
              <img src={capturedImage} alt="Captured" className="w-full object-cover opacity-60" style={{ maxHeight: "180px" }} />
            </div>
          )}
          <div className="flex flex-col items-center gap-4">
            {/* Animated scanner effect */}
            <div className="relative w-20 h-20">
              <div className="absolute inset-0 rounded-full border-4 border-red-100" />
              <div className="absolute inset-0 rounded-full border-4 border-red-600 border-t-transparent animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center text-2xl">🔍</div>
            </div>
            <div className="w-full">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600 font-medium">{ocrStatus}</span>
                <span className="text-red-600 font-bold">{ocrProgress}%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-red-600 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${ocrProgress}%` }}
                />
              </div>
            </div>
            <p className="text-xs text-gray-400 text-center">
              {lang === "en" ? "This may take a few seconds on first use" : "Esto puede tardar unos segundos la primera vez"}
            </p>
          </div>
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
              type="text" maxLength={17} value={manualInput}
              onChange={(e) => setManualInput(e.target.value.toUpperCase().replace(/[^A-HJ-NPR-Z0-9]/g, ""))}
              placeholder={txt.placeholder}
              className="w-full border-2 border-gray-200 focus:border-red-500 rounded-2xl px-4 py-4 text-base font-mono tracking-widest outline-none transition"
              autoCapitalize="characters" autoCorrect="off"
            />
            <p className="text-xs text-gray-400 mt-1 text-right">{manualInput.length}/17</p>
          </div>
          <button onClick={() => manualInput.length === 17 && lookupVIN(manualInput)}
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
          <div className="rounded-2xl bg-gray-50 border border-gray-200 px-4 py-3 flex items-center justify-between">
            <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider">VIN</span>
            <span className="font-mono text-sm text-gray-700">{vin}</span>
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-gray-900">{decoded.year} {decoded.make} {decoded.model}</h2>
            {decoded.trim && <p className="text-gray-500 text-sm mt-0.5">{decoded.trim}</p>}
          </div>
          {inventoryMatch ? (
            <div className="rounded-2xl bg-green-50 border-2 border-green-400 p-4">
              <p className="font-bold text-green-700 text-sm mb-2">{txt.inInventory}</p>
              <p className="text-green-800 font-extrabold text-xl">
                {inventoryMatch.price ? `$${inventoryMatch.price.toLocaleString()}` : "Call for price"}
              </p>
              {inventoryMatch.down && <p className="text-green-600 text-sm">Down: ${inventoryMatch.down.toLocaleString()}</p>}
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
          <div className="rounded-2xl border border-gray-200 overflow-hidden">
            {rows.map((row, i) => (
              <div key={row.label} className={`flex justify-between px-4 py-3 text-sm ${i % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>
                <span className="text-gray-500 font-medium">{row.label}</span>
                <span className="text-gray-900 font-semibold text-right max-w-[55%]">{row.value}</span>
              </div>
            ))}
          </div>
          <button onClick={reset} className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-2xl transition">
            {txt.tryAnother}
          </button>
        </div>
      )}

      {/* ERROR */}
      {mode === "error" && (
        <div className="flex flex-col gap-4">
          <div className="rounded-2xl bg-red-50 border border-red-200 p-5 text-center">
            <p className="text-3xl mb-2">⚠️</p>
            <p className="font-bold text-red-700">{lang === "en" ? "Something went wrong" : "Algo salió mal"}</p>
            <p className="text-sm text-red-500 mt-1">{errorMsg}</p>
          </div>
          <button onClick={reset} className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-2xl transition">
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