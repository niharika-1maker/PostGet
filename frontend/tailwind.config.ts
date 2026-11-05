import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        border: "var(--border)",
        card: "var(--card)",
        "card-foreground": "var(--card-foreground)",
        primary: {
          DEFAULT: "#38bdf8",
          foreground: "#0f172a",
        },
        accent: {
          DEFAULT: "#818cf8",
          foreground: "#ffffff",
        },
      },
      backgroundImage: {
        "spatial-radial": "radial-gradient(circle at 50% 0%, rgba(56, 189, 248, 0.12) 0%, transparent 60%)",
        "card-glass": "linear-gradient(135deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.8) 100%)",
      },
    },
  },
  plugins: [],
};
export default config;
