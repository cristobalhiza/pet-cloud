import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        dark: "#242325", 
        mediumGray: "#B3B3B3", 
        lightGray: "#C8C8C8", 
        beige: "#BBB891", 
        orange: "#DC965A", 
        accentPurple: "#DC965A", 
      },
    },
  },
  plugins: [],
};

export default config;
