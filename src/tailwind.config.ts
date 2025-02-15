
import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
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
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        cyberblue: {
          50: "#e6f7ff",
          100: "#b3e0ff",
          200: "#80caff",
          300: "#4db3ff",
          400: "#1a9dff",
          500: "#0088ff",
          600: "#006bb3",
          700: "#004d80",
          800: "#00304d",
          900: "#00121a",
        },
        cyberdark: {
          950: "#0a0a0a",
          900: "#1a1a1a",
          800: "#2b2b2b",
          700: "#3d3d3d",
          600: "#4f4f4f",
        },
        cybergold: {
          50: "#fff9e6",
          100: "#ffedb3",
          200: "#ffe180",
          300: "#ffd54d",
          400: "#ffc91a",
          500: "#e6b300",
          600: "#b38a00",
          700: "#806200",
          800: "#4d3a00",
          900: "#1a1300",
        },
      },
      boxShadow: {
        'neon-blue': '0 0 5px theme(colors.cyberblue.400), 0 0 20px theme(colors.cyberblue.500)',
        'neon-gold': '0 0 5px theme(colors.cybergold.400), 0 0 20px theme(colors.cybergold.500)',
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
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 5px theme(colors.cyberblue.400), 0 0 20px theme(colors.cyberblue.500)' },
          '50%': { boxShadow: '0 0 10px theme(colors.cyberblue.400), 0 0 30px theme(colors.cyberblue.500)' },
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        'pulse-slow': 'pulse 3s infinite',
        'glow': 'glow 2s infinite',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
