import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { siteUrl } from "@/lib/site";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const title = "El Vitrola de Chile | Radio en vivo 24/7 desde la Región de O’Higgins";
const description =
  "Escucha en vivo a El Vitrola de Chile, el locutor número uno de la Región de O’Higgins: música ranchera y eventos rancheros las 24 horas, por 94.5 FM y 107.3 FM.";

export const metadata = {
  ...(siteUrl && { metadataBase: new URL(siteUrl) }),
  title: { default: title, template: "%s | El Vitrola de Chile" },
  description,
  keywords: [
    "radio en vivo",
    "música ranchera",
    "El Vitrola de Chile",
    "radio Chile",
    "Región de O'Higgins",
    "94.5 FM",
    "107.3 FM",
    "Gente Comunicaciones",
    "Radio Impacto",
  ],
  ...(siteUrl && { alternates: { canonical: "/" } }),
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  openGraph: {
    type: "website",
    locale: "es_CL",
    siteName: "El Vitrola de Chile",
    url: "/",
    title,
    description,
    images: [
      {
        url: "/logo-vitro.png",
        width: 907,
        height: 567,
        alt: "El Vitrola de Chile",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/logo-vitro.png"],
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0a0a0a",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
