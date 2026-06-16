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
          "100": "#D8E4DC",
          "200": "#9AAD9F",
          "300": "#5C6E62",
          "350": "#364038",
          "400": "#141C18",
          "500": "#0E1512",
          "600": "#070707",
        },
        emerald: {
          "300": "#3D7358",
          "400": "#2A5540",
          "500": "#1A3829",
          "600": "#0F2219",
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
        mono: ["var(--font-anonymous-pro)", ...defaultTheme.fontFamily.mono],
      },
      boxShadow: {
        panel:
          "0 0 0 1px rgba(42, 85, 64, 0.18), 0 24px 48px -12px rgba(0, 0, 0, 0.55)",
        tile: "0 0 0 1px rgba(255, 255, 255, 0.04), 0 8px 24px -8px rgba(0, 0, 0, 0.45)",
      },
    },
  },
  plugins: [tailwindcssAnimate],
};
export default config;
