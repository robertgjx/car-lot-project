import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "./lib/LanguageContext";
import NavBar from "./lib/NavBar";

export const metadata: Metadata = {
  title: "Garcia's Auto Sales",
  description: "Vehicle inventory and in-house financing",
  verification: {
    google: "beviLAImnHamLcX0ntJINoxaFVNKirU5DHrwZyLrE4A",
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