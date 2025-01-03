import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        dark: "#242325", // Fondo oscuro principal
        mediumGray: "#B3B3B3", // Color de las tarjetas
        lightGray: "#C8C8C8", // Texto claro
        beige: "#BBB891", // Color de acentos suaves
        orange: "#DC965A", // Color de botones principales
        accentPurple: "#DC965A", // Anillos o acentos adicionales
      },
    },
  },
  plugins: [],
};

export default config;
