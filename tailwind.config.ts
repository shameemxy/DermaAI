import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // DermaAI Brand Aesthetic Palette
        primaryText: "#4A3E38",      // Deep Espresso Brown
        primaryBG: "#FAF1E8",        // Creamy Off-White
        accent: "#D6A87E",           // Mid-tone Sandy Beige / Nude
        accentHover: "#C2946A",      // Darker Nude for interactive hover states
        surface: "#E6D4C3",          // Lighter Sand tone (Cards, Inputs)
        surfaceCard: "#F3E8DC",      // Soft elevation card surface
        surfaceBorder: "#D8C3B0",    // Subtle divider border
        espressoDark: "#342B27",     // Rich dark accent
        beigeLight: "#FAF5F0",       // Soft inner pill tint
      },
      fontFamily: {
        editorial: ["var(--font-silver-editorial)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "-apple-system", "sans-serif"],
      },
      boxShadow: {
        'derma': '0 4px 20px -2px rgba(74, 62, 56, 0.08)',
        'derma-lg': '0 10px 30px -4px rgba(74, 62, 56, 0.12)',
      }
    },
  },
  plugins: [],
};

export default config;
