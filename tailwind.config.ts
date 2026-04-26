import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "bg-primary": "#080B10",
        "bg-secondary": "#0D1117",
        "bg-tertiary": "#161B22",
        "accent-primary": "#E8FF47",
        "accent-secondary": "#FF3F5B",
        "accent-glow": "#00E5FF",
        "text-primary": "#F0F6FC",
        "text-secondary": "#8B949E",
        "text-muted": "#484F58",
      },
      fontFamily: {
        display: ["var(--font-bebas)", "sans-serif"],
        body: ["var(--font-dmsans)", "sans-serif"],
        mono: ["var(--font-sharetech)", "monospace"],
      },
      animation: {
        blink: "blink 1s step-end infinite",
        "bounce-gentle": "bounce-gentle 2s ease-in-out infinite",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        glitch: "glitch 0.3s steps(3) forwards",
      },
      keyframes: {
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
        "bounce-gentle": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(8px)" },
        },
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 10px rgba(232,255,71,0.3)" },
          "50%": { boxShadow: "0 0 25px rgba(232,255,71,0.6), 0 0 50px rgba(232,255,71,0.2)" },
        },
        glitch: {
          "0%": { clipPath: "inset(0 0 90% 0)", transform: "translate(-2px, 0)" },
          "33%": { clipPath: "inset(40% 0 40% 0)", transform: "translate(2px, 0)" },
          "66%": { clipPath: "inset(80% 0 10% 0)", transform: "translate(-1px, 0)" },
          "100%": { clipPath: "inset(0 0 0 0)", transform: "translate(0, 0)" },
        },
      },
      boxShadow: {
        "glow-primary": "0 0 20px rgba(232,255,71,0.3)",
        "glow-secondary": "0 0 20px rgba(255,63,91,0.3)",
        "glow-cyan": "0 0 20px rgba(0,229,255,0.3)",
        "glow-primary-lg": "0 0 40px rgba(232,255,71,0.4), 0 0 80px rgba(232,255,71,0.1)",
      },
    },
  },
  plugins: [],
};
export default config;
