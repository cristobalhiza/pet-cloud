import type { Metadata } from "next";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import { PetProvider } from "@/context/PetContext";
import { ThemeProvider, BaseStyles } from '@primer/react'
import Footer from "@/components/Footer"; 

export const metadata: Metadata = {
  title: "Pet Cloud | Pet Events Dashboard",
  description:
    "Pet Cloud Pet Events Dashboard Made By Cristobal Hiza Web Developer",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (

      <html lang="es">

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
