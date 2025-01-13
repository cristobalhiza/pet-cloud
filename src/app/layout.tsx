import type { Metadata } from "next";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import { PetProvider } from "@/context/PetContext";
import { ThemeProvider, BaseStyles } from '@primer/react'
import Footer from "@/components/Footer"; 
import { Nunito, Nunito_Sans } from 'next/font/google'

export const metadata: Metadata = {
  title: "Pet Cloud | Pet Events Dashboard",
  description:
    "Pet Cloud Pet Events Dashboard Made By Cristobal Hiza Web Developer",
};

const nunito = Nunito({
  subsets: ['latin'],
  weight: ['500', '600', '700', '800'],
  variable: '--font-nunito',
});

const nunitoSans = Nunito_Sans({
  subsets: ['latin'],
  weight: ['400','500', '600'], 
  variable: '--font-nunito-sans',
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return (

      <html lang="es" className={`${nunito.variable} ${nunitoSans.variable}`}>

        <body>
        <ThemeProvider>
        <BaseStyles>
          <PetProvider>
            <ToastContainer position="top-right" autoClose={2500} />
            {children}
            <Footer /> 
          </PetProvider>
          </BaseStyles>
          </ThemeProvider>
        </body>
      </html>

  );
}
