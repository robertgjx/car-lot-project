"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type Lang = "en" | "es";
const LanguageContext = createContext<{ lang: Lang; toggle: () => void }>({
  lang: "en",
  toggle: () => {},
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("en");
  const toggle = () => setLang((l) => (l === "en" ? "es" : "en"));
  return (
    <LanguageContext.Provider value={{ lang, toggle }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  return useContext(LanguageContext);
}

export const t = {
  // Navbar
  nav: {
    home:      { en: "Home",      es: "Inicio" },
    inventory: { en: "Inventory", es: "Inventario" },
    contact:   { en: "Contact Us",es: "Contáctenos" },
  },

  // Homepage hero
  hero: {
    badge:    { en: "Rio Grande Valley • In-house financing available", es: "Valle del Río Grande • Financiamiento propio disponible" },
    heading:  { en: "Garcia's Auto Sales RGV", es: "Garcia's Auto Sales RGV" },
    sub:      { en: "Quality vehicles, fair prices, and simple approvals. We make it easy to get on the road with in-house financing.", es: "Vehículos de calidad, precios justos y aprobaciones sencillas. Te hacemos fácil salir manejando con financiamiento propio." },
    viewInv:  { en: "View Inventory", es: "Ver Inventario" },
    contactUs:{ en: "Contact Us",     es: "Contáctenos" },
    fast:     { en: "Fast approvals", es: "Aprobaciones rápidas" },
    simple:   { en: "Simple process", es: "Proceso sencillo" },
    flexible: { en: "Flexible financing", es: "Financiamiento flexible" },
    inhouse:  { en: "In-house options",   es: "Opciones propias" },
    transparent: { en: "Transparent pricing", es: "Precios transparentes" },
    noSurprises: { en: "No surprises",       es: "Sin sorpresas" },
  },

  // Why us
  why: {
    familyTitle: { en: "Family Owned and Operated", es: "Negocio Familiar" },
    familyDesc:  { en: "Serving the city of Palmview since 1984. More than 40 years providing customers with quality vehicles.", es: "Sirviendo a la ciudad de Palmview desde 1984. Más de 40 años brindando vehículos de calidad a nuestros clientes." },
    finTitle:    { en: "In-house financing",  es: "Financiamiento Propio" },
    finDesc:     { en: "We offer financing options designed to help you get approved and move forward.", es: "Ofrecemos opciones de financiamiento diseñadas para ayudarte a obtener aprobación y seguir adelante." },
    suppTitle:   { en: "Support",             es: "Apoyo" },
    suppDesc:    { en: "Got questions? We're here to help you.", es: "¿Tienes preguntas? Estamos aquí para ayudarte." },
  },

  // How it works
  how: {
    title: { en: "How it works",                          es: "Cómo funciona" },
    sub:   { en: "A simple process from browsing to driving away.", es: "Un proceso sencillo desde buscar hasta salir manejando." },
    s1:    { en: "Step 1",         es: "Paso 1" },
    s1t:   { en: "Browse inventory", es: "Explora el inventario" },
    s1d:   { en: "Find something you like and check the details.", es: "Encuentra algo que te guste y revisa los detalles." },
    s2:    { en: "Step 2",    es: "Paso 2" },
    s2t:   { en: "Contact us", es: "Contáctanos" },
    s2d:   { en: "Ask about financing options.", es: "Pregunta sobre las opciones de financiamiento." },
    s3:    { en: "Step 3",     es: "Paso 3" },
    s3t:   { en: "Drive away", es: "Sal manejando" },
    s3d:   { en: "Get approved and leave with confidence.", es: "Obtén tu aprobación y sal con confianza." },
  },

  // Featured
  featured: {
    title:   { en: "Featured vehicles",                  es: "Vehículos destacados" },
    sub:     { en: "A few picks from our current inventory.", es: "Algunas opciones de nuestro inventario actual." },
    viewAll: { en: "View all →",           es: "Ver todo →" },
    viewAllMobile: { en: "View all inventory →", es: "Ver todo el inventario →" },
    miles:   { en: "miles",   es: "millas" },
    viewDet: { en: "View details", es: "Ver detalles" },
  },

  // Contact section
  contact: {
    title:     { en: "Contact us",  es: "Contáctanos" },
    sub:       { en: "Want to ask about financing? Reach out and we'll help you out.", es: "¿Quieres preguntar sobre financiamiento? Comunícate y te ayudamos." },
    page:      { en: "Contact page",      es: "Página de contacto" },
    browse:    { en: "Browse inventory",  es: "Ver inventario" },
    details:   { en: "Details",    es: "Detalles" },
    phone:     { en: "Phone:",     es: "Teléfono:" },
    location:  { en: "Location:",  es: "Ubicación:" },
    hours:     { en: "Hours:",     es: "Horario:" },
    hoursVal:  { en: "Mon–Fri 9AM–6PM, Sat 9AM–3PM, Sun Closed", es: "Lun–Vie 9AM–6PM, Sáb 9AM–3PM, Dom Cerrado" },
  },

  // Footer
  footer: {
    rights: { en: "All rights reserved.", es: "Todos los derechos reservados." },
  },

  // Inventory page
  inv: {
    title:       { en: "Inventory",    es: "Inventario" },
    sub:         { en: "Search and filter vehicles, then tap View Details.", es: "Busca y filtra vehículos, luego toca Ver Detalles." },
    search:      { en: "Search",       es: "Buscar" },
    searchPh:    { en: "Search year, make, model...", es: "Buscar año, marca, modelo..." },
    make:        { en: "Make",         es: "Marca" },
    all:         { en: "All",          es: "Todas" },
    minPrice:    { en: "Min Price",    es: "Precio mínimo" },
    maxPrice:    { en: "Max Price",    es: "Precio máximo" },
    reset:       { en: "Reset",        es: "Restablecer" },
    showing:     { en: "Showing",      es: "Mostrando" },
    of:          { en: "of",           es: "de" },
    miles:       { en: "Miles:",       es: "Millas:" },
    viewDet:     { en: "View Details", es: "Ver Detalles" },
    noResults:   { en: "No vehicles match your filters. Try resetting.", es: "Ningún vehículo coincide con los filtros. Intenta restablecer." },
    backHome:    { en: "← Back Home",  es: "← Inicio" },
  },

  // Vehicle details page
  det: {
    back:       { en: "← Back to Inventory", es: "← Volver al Inventario" },
    status:     { en: "Status:",      es: "Estado:" },
    vin:        { en: "VIN:",         es: "VIN:" },
    miles:      { en: "Miles:",       es: "Millas:" },
    drive:      { en: "Drive Train:", es: "Tracción:" },
    fuel:       { en: "Fuel:",        es: "Combustible:" },
    down:       { en: "Down:",        es: "Enganche:" },
    photos:     { en: "More Photos",  es: "Más Fotos" },
    notFound:   { en: "Vehicle not found.", es: "Vehículo no encontrado." },
    triedId:    { en: "Tried ID:",    es: "ID buscado:" },
  },
};