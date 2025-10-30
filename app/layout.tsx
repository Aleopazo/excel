import type { Metadata } from "next";
import { Inter, Playfair_Display, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });
const plex = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-ibm-plex" });

export const metadata: Metadata = {
  title: {
    default: "Serum Atelier | Ciencia aplicada a tus suplementos",
    template: "%s | Serum Atelier"
  },
  description:
    "Webapp boutique de suplementación personalizada en tres niveles con cuestionario clínico, soporte médico asincrónico y formulaciones a medida basadas en evidencia.",
  keywords: [
    "suplementos personalizados",
    "cuestionario salud",
    "Tier 1",
    "Tier 2",
    "Tier 3",
    "atención médica asincrónica",
    "Serum Atelier"
  ],
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: "https://serum-atelier.demo",
    siteName: "Serum Atelier"
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning className="bg-brand-ivory">
      <body
        className={`${inter.variable} ${playfair.variable} ${plex.variable} font-sans text-brand-midnight antialiased`}
      >
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <SiteHeader />
          {children}
          <SiteFooter />
        </ThemeProvider>
      </body>
    </html>
  );
}
