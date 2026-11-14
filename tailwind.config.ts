import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Navy blue primary
        primary: {
          50: "#f0f4ff",
          100: "#dbe4ff",
          200: "#bac8ff",
          300: "#91a7ff",
          400: "#748ffc",
          500: "#5c7cfa",
          600: "#4263eb",
          700: "#3b5bdb",
          800: "#364fc7",
          900: "#1e3a5f",
          950: "#0f1d30",
        },
        // Warm beige accent
        accent: {
          50: "#fefcf6",
          100: "#fdf6e3",
          200: "#faecc7",
          300: "#f5dda0",
          400: "#e8c872",
          500: "#d4a84b",
          600: "#b8892e",
          700: "#9a6f24",
          800: "#7d5a1e",
          900: "#5c4216",
        },
        // Keep coral for WhatsApp/CTA accents
        coral: {
          50: "#fff1f2",
          100: "#ffe4e6",
          200: "#fecdd3",
          300: "#fda4af",
          400: "#fb7185",
          500: "#f43f5e",
          600: "#e11d48",
          700: "#be123c",
          800: "#9f1239",
          900: "#881337",
        },
      },
      fontFamily: {
        sans: ["DM Sans", "system-ui", "sans-serif"],
        display: ["Sora", "sans-serif"],
      },
      fontWeight: {
        700: "700",
        800: "800",
      },
      backdropBlur: {
        xs: "2px",
      },
      borderRadius: {
        "4xl": "2rem",
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        glow: "glow 2s ease-in-out infinite alternate",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        glow: {
          "0%": { boxShadow: "0 0 20px rgba(30, 58, 95, 0.3)" },
          "100%": { boxShadow: "0 0 30px rgba(30, 58, 95, 0.6)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
