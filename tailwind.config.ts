import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
    "./data/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Playfair Display'", "serif"],
        sans: ["'Inter'", "system-ui"],
        mono: ["'IBM Plex Mono'", "monospace"]
      },
      colors: {
        brand: {
          ivory: "#F9F6F1",
          copper: "#C47B50",
          forest: "#23312B",
          midnight: "#111411"
        }
      },
      boxShadow: {
        spotlight: "0 40px 80px -40px rgba(17, 20, 17, 0.45)"
      },
      backgroundImage: {
        "hero-gradient": "linear-gradient(135deg, rgba(35,49,43,0.85), rgba(196,123,80,0.55))"
      }
    }
  },
  plugins: []
};

export default config;
