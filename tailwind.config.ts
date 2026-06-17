import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";
import defaultTheme from "tailwindcss/defaultTheme";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        gray: {
          "100": "#F6F5EC",
          "200": "#D8DED2",
          "300": "#899486",
          "350": "#465246",
          "400": "#20291F",
          "500": "#111711",
          "600": "#070907",
        },
        rose: {
          "300": "#FFA38F",
          "400": "#F07763",
          "500": "#D8564C",
          "600": "#9D3939",
        },
        moss: {
          "300": "#B9DCA7",
          "400": "#86BE74",
          "500": "#558E56",
          "600": "#345F3E",
        },
        honey: {
          "300": "#F5D386",
          "400": "#DCA94A",
          "500": "#A9752B",
        },
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", ...defaultTheme.fontFamily.sans],
        mono: ["var(--font-geist-mono)", ...defaultTheme.fontFamily.mono],
      },
      boxShadow: {
        panel:
          "0 0 0 1px rgba(246, 245, 236, 0.08), 0 24px 80px -24px rgba(0, 0, 0, 0.75)",
        tile: "0 0 0 1px rgba(246, 245, 236, 0.06), 0 14px 34px -18px rgba(0, 0, 0, 0.65)",
      },
    },
  },
  plugins: [tailwindcssAnimate],
};
export default config;
