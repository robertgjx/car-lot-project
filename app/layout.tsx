import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "./lib/LanguageContext";
import NavBar from "./lib/NavBar";

export const metadata: Metadata = {
  title: "Garcia's Auto Sales RGV | Used Trucks & Cars in Palmview, TX",
  description: "Garcia's Auto Sales RGV — family owned dealership in Palmview, TX since 1984. Browse used trucks, cars, and SUVs with in-house financing. Serving the Rio Grande Valley. | Carros usados en Palmview TX con financiamiento propio. Sirviendo el Valle del Río Grande.",
  keywords: "used trucks RGV, used cars Palmview TX, in-house financing Rio Grande Valley, buy here pay here RGV, used trucks for sale, Garcia Auto Sales, Palmview used cars, carros usados RGV, camionetas usadas Palmview TX, financiamiento propio Valle del Rio Grande, autos usados RGV, compra aqui paga aqui RGV, carros usados Palmview, camionetas usadas Rio Grande Valley",
  verification: {
    google: "beviLAImnHamLcX0ntJINoxaFVNKirU5DHrwZyLrE4A",
  },
  openGraph: {
    title: "Garcia's Auto Sales RGV | Used Trucks & Cars in Palmview, TX",
    description: "Family owned dealership in Palmview, TX. Used trucks, cars, and SUVs with in-house financing. | Carros usados con financiamiento propio en Palmview, TX.",
    url: "https://garciasautosalesrgv.com",
    siteName: "Garcia's Auto Sales RGV",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-neutral-950 text-white">
        <LanguageProvider>
          <NavBar />
          <div className="max-w-6xl mx-auto px-6 md:px-10 py-8">{children}</div>
        </LanguageProvider>
      </body>
    </html>
  );
}