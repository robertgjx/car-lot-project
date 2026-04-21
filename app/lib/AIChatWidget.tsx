"use client";

import { useState, useRef, useEffect } from "react";
import { vehicles } from "@/app/lib/vehicles";
import { useLang } from "@/app/lib/LanguageContext";
import Link from "next/link";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const FAQS: Record<string, { en: string; es: string }> = {
  hours: {
    en: "Our hours are Monday–Saturday 9AM–7PM and Sunday 10AM–5PM.",
    es: "Nuestro horario es lunes a sábado de 9AM a 7PM y domingos de 10AM a 5PM.",
  },
  location: {
    en: "We have two locations in Palmview, TX: 1801 W Palma Vista Dr and 1800 W Veterans Blvd. Call us at (956) 581-0455.",
    es: "Tenemos dos ubicaciones en Palmview, TX: 1801 W Palma Vista Dr y 1800 W Veterans Blvd. Llámanos al (956) 581-0455.",
  },
  credit: {
    en: "Yes! We are a Buy Here Pay Here dealership. No credit? No problem! We work with all credit situations.",
    es: "¡Sí! Somos un concesionario Buy Here Pay Here. ¿Sin crédito? ¡No hay problema! Trabajamos con todo tipo de crédito.",
  },
  tradein: {
    en: "Yes, we do accept trade-ins! Bring your vehicle in and we'll give you an offer.",
    es: "¡Sí aceptamos trade-ins! Trae tu vehículo y te haremos una oferta.",
  },
  financing: {
    en: "We offer in-house financing with flexible down payments and terms. No bank needed!",
    es: "Ofrecemos financiamiento interno con enganches flexibles. ¡No necesitas banco!",
  },
  phone: {
    en: "You can reach us at (956) 581-0455 or our associate Caesar at (956) 478-9359.",
    es: "Puedes contactarnos al (956) 581-0455 o con nuestro asociado Caesar al (956) 478-9359.",
  },
};

function buildSystemPrompt(lang: string) {
  const inventoryList = vehicles
    .map((v) => {
      const status = v.status === "sold" ? "SOLD" : "AVAILABLE";
      return `- ${v.year} ${v.make} ${v.model}${v.trim ? " " + v.trim : ""} | Price: $${v.price?.toLocaleString() ?? "N/A"} | Down: $${v.down?.toLocaleString() ?? "N/A"} | Miles: ${v.miles?.toLocaleString() ?? "N/A"} | Status: ${status} | ID: ${v.id}`;
    })
    .join("\n");

  const faqText = Object.entries(FAQS)
    .map(([, val]) => (lang === "en" ? val.en : val.es))
    .join("\n");

  return `You are a friendly and helpful AI assistant for Garcia's Auto Sales RGV, a Buy Here Pay Here dealership in Palmview, TX. You help customers find vehicles, compare options, and answer questions about the dealership.

IMPORTANT RULES:
- Always be warm, friendly, and helpful
- Respond in ${lang === "en" ? "English" : "Spanish"} only
- When recommending vehicles, always mention the price, down payment, and link using this format: [VIEW LISTING:/inventory/VEHICLE_ID]
- Only recommend AVAILABLE vehicles unless the customer specifically asks about sold ones
- Keep responses concise and easy to read
- If asked to compare vehicles, compare price, down payment, miles, and any other relevant specs
- Never make up information not in the inventory

DEALERSHIP FAQ:
${faqText}

CURRENT INVENTORY:
${inventoryList}`;
}

export default function AIChatWidget() {
  const { lang } = useLang();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const greeting = lang === "en"
    ? "Hi! 👋 I'm Garcia's AI assistant. I can help you find a vehicle, compare options, or answer any questions. What are you looking for?"
    : "¡Hola! 👋 Soy el asistente de IA de García's. Puedo ayudarte a encontrar un vehículo, comparar opciones o responder preguntas. ¿Qué estás buscando?";

  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([{ role: "assistant", content: greeting }]);
    }
  }, [open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100);
  }, [open]);

  async function sendMessage() {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    setLoading(true);

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: buildSystemPrompt(lang),
          messages: [
            ...messages.filter((m) => m.role !== "assistant" || messages.indexOf(m) !== 0),
            { role: "user", content: userMsg },
          ],
        }),
      });

      const data = await response.json();
      const text = data.content?.[0]?.text ?? (lang === "en" ? "Sorry, I couldn't get a response. Please try again." : "Lo siento, no pude obtener una respuesta. Por favor intenta de nuevo.");
      setMessages((prev) => [...prev, { role: "assistant", content: text }]);
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: lang === "en" ? "Connection error. Please try again." : "Error de conexión. Por favor intenta de nuevo." }]);
    } finally {
      setLoading(false);
    }
  }

  function renderMessage(content: string) {
    const parts = content.split(/(\[VIEW LISTING:[^\]]+\])/g);
    return parts.map((part, i) => {
      const match = part.match(/\[VIEW LISTING:([^\]]+)\]/);
      if (match) {
        return (
          <Link key={i} href={match[1]}
            className="inline-flex items-center gap-1.5 mt-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-3 py-2 rounded-xl transition">
            {lang === "en" ? "View Listing →" : "Ver Listado →"}
          </Link>
        );
      }
      return <span key={i}>{part}</span>;
    });
  }

  return (
    <>
      {/* Chat Window */}
      {open && (
        <div className="fixed bottom-24 right-4 z-50 w-[92vw] max-w-sm bg-white rounded-3xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden"
          style={{ height: "520px" }}>

          {/* Header */}
          <div className="bg-red-600 px-5 py-4 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-lg">🚗</div>
              <div>
                <p className="text-white font-bold text-sm leading-tight">Garcia's AI Assistant</p>
                <p className="text-red-200 text-xs">{lang === "en" ? "Ask me anything!" : "¡Pregúntame lo que sea!"}</p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="text-white/70 hover:text-white transition">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-gray-50">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-red-600 text-white rounded-br-sm"
                    : "bg-white border border-gray-200 text-gray-800 rounded-bl-sm shadow-sm"
                }`}>
                  {renderMessage(msg.content)}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
                  <div className="flex gap-1.5 items-center h-4">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="px-4 py-3 border-t border-gray-200 bg-white shrink-0">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder={lang === "en" ? "Ask about a vehicle..." : "Pregunta sobre un vehículo..."}
                className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-red-400 transition"
              />
              <button onClick={sendMessage} disabled={!input.trim() || loading}
                className="bg-red-600 hover:bg-red-700 disabled:bg-gray-200 disabled:text-gray-400 text-white p-2.5 rounded-xl transition">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Chat Bubble Button */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-5 right-4 z-50 w-14 h-14 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-lg flex items-center justify-center transition hover:scale-105 active:scale-95">
        {open ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        ) : (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
        )}
      </button>
    </>
  );
}