import type { Metadata } from "next";
import { Montserrat, Roboto_Mono, Source_Code_Pro } from "next/font/google";
import "./globals.css";
import Menu from "./components/Menu";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin", "cyrillic"],
});

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin", "cyrillic"],
});

export const metadata: Metadata = {
  title: "Is there an outlet?",
  description: "Check public outlets nearby",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
    <head>
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
            integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
            crossOrigin=""/>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    </head>
    <body className={`${robotoMono.variable} ${montserrat.variable} antialiased`}>
    {/* eslint-disable-next-line @next/next/no-sync-scripts */}
      <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
            integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo="
            crossOrigin=""></script>
      <script src="https://unpkg.com/leaflet"></script>
      <script src="https://unpkg.com/leaflet-doubletapdrag"></script>
      <script src="https://unpkg.com/leaflet-doubletapdragzoom"></script>
    <Menu />
    {children}
    </body>
    </html>
  );
}
