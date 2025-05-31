import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#E85A2B",
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#D5CAE4",
          foreground: "#4A4A4A",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "#E1E5EB",
          foreground: "#6B7280",
        },
        accent: {
          DEFAULT: "#D5CAE4",
          foreground: "#4A4A4A",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Custom Filmz colors with brighter orange
        filmz: {
          lilac: "#D5CAE4",
          gray: "#E1E5EB",
          orange: "#E85A2B", // Brighter, more vibrant orange
          "orange-hover": "#D14A1F", // Darker orange for hover states
          "orange-light": "#FF6B3D", // Even brighter for highlights
          "bg-primary": "#F8F6FB", // Very light lilac background
          "bg-secondary": "#FEFEFE", // Almost white with slight warmth
          "card-bg": "#FFFFFF",
          "text-primary": "#2D2D3A",
          "text-secondary": "#6B7280",
          "bg-lilac": "#a46bf2",
          border: "#E5E7EB",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      backgroundImage: {
        "gradient-filmz": "linear-gradient(135deg, #F8F6FB 0%, #FEFEFE 50%, #FDF8F5 100%)",
        "gradient-hero": "linear-gradient(135deg, #E85A2B 0%, #D5CAE4 100%)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config
