import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // CORE CPS construction-operations palette (see task design system).
        cps: {
          navy: "#1B2A4A",
          blue: "#2563EB",
          orange: "#EA580C",
          slate: "#475569",
          gray100: "#F1F5F9",
          gray200: "#E2E8F0",
          white: "#FFFFFF",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "Segoe UI", "Roboto", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
