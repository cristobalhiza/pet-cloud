import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ToastContainer } from "react-toastify";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Rincón de Kaisita",
  description:
    "Aplicación realizada por Cristobal Hiza para su querida perrita Kai",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={geistSans.className}>
    <body>
      <ToastContainer position="top-right" autoClose={3000} />
      {children}
    </body>
    </html>
  );
}
