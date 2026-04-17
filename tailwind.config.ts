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
        arc: {
          bg:      "#080808",
          surface: "#0f0f0f",
          card:    "#141414",
          border:  "#1f1f1f",
          hover:   "#1a1a1a",
          green:   "#22c55e",
          "green-dim": "#16a34a",
          "green-glow": "rgba(34,197,94,0.12)",
          white:   "#f5f5f5",
          muted:   "#6b7280",
          dim:     "#374151",
          error:   "#ef4444",
          warning: "#f59e0b",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      boxShadow: {
        "green": "0 0 20px rgba(34,197,94,0.18)",
        "card":  "0 1px 3px rgba(0,0,0,0.5)",
      },
      animation: {
        "fade-in":  "fade-in 0.2s ease-out",
        "slide-up": "slide-up 0.2s ease-out",
        "pulse-green": "pulse-green 2s ease-in-out infinite",
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0" },
          to:   { opacity: "1" },
        },
        "slide-up": {
          from: { opacity: "0", transform: "translateY(8px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        "pulse-green": {
          "0%,100%": { opacity: "1" },
          "50%":     { opacity: "0.4" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
