import type { Config } from 'tailwindcss';

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        darkBackground: "#1E1E2E",
        darkCard: "#2E2E3A",
        lightText: "#FFFFFF",
        accentPurple: "#6D5B96",
        accentPink: "#F472B6",
        grayText: "#A1A1A1",
      },
    },
  },
  plugins: [],
};

export default config;
