import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Neutral "operations software" palette — NOT Blue Hat branding.
        cps: {
          DEFAULT: "#1f3a5f",
          accent: "#c8552b",
        },
      },
    },
  },
  plugins: [],
};
export default config;
