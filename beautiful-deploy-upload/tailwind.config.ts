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
        // Modernisert fargepalett med et enklere, mer harmonisk utseende
        cyberblue: {
          50: "#e6f7ff",
          100: "#b3e0ff",
          200: "#80caff",
          300: "#4db3ff", 
          400: "#1a9dff",
          500: "#0088ff", // Primær merkevarefarge - klar blå
          600: "#0070d1",
          700: "#0058a3",
          800: "#004075",
          900: "#002847",
          950: "#001529",
        },
        // Forenklet mørkere palett
        cyberdark: {
          950: "#0a0a0a", // Nesten svart bakgrunn
          900: "#121212", // Standard bakgrunn
          800: "#1a1a1a", // Kort og komponenter
          700: "#242424", // Hover-tilstander
          600: "#2d2d2d", // Kanter og skillelinjer
          500: "#363636",
        },
        // Modernisert gull-palett - justert til å matche den nye logoen
        cybergold: {
          50: "#fdf9e9",
          100: "#f9f0c8", 
          200: "#f5e6a5",
          300: "#f0dc82",
          400: "#e9d068",
          500: "#dabc45", // Justert primær gull-farge for å matche logoen
          600: "#c9a930",
          700: "#a88d25",
          800: "#856e1c",
          900: "#624e12",
          950: "#342908",
        },
        // Forenklet rødpalett for advarsler/feil
        cyberred: {
          50: "#fff1f1",
          100: "#ffdada",
          200: "#ffbcbc",
          300: "#ff8e8e", 
          400: "#ff5f5f",
          500: "#ff3030", // Primær alarmfarge
          600: "#db2020",
          700: "#b71c1c",
          800: "#931717",
          900: "#701313",
          950: "#390a0a",
        },
      },
      boxShadow: {
        'neon-blue': '0 0 5px theme(colors.cyberblue.400), 0 0 15px theme(colors.cyberblue.500)',
        'neon-gold': '0 0 5px theme(colors.cybergold.400), 0 0 15px theme(colors.cybergold.500)',
        'neon-red': '0 0 5px theme(colors.cyberred.400), 0 0 15px theme(colors.cyberred.500)',
        'neon-dual': '0 0 8px theme(colors.cyberblue.500), 0 0 12px theme(colors.cyberred.500)',
        'neon-intense': '0 0 12px theme(colors.cyberblue.400), 0 0 18px theme(colors.cyberred.400), 0 0 24px rgba(255,255,255,0.2)',
        'subtle': '0 2px 10px rgba(0,0,0,0.1)',
        'card': '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
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
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 5px theme(colors.cyberblue.400), 0 0 15px theme(colors.cyberblue.500)' },
          '50%': { boxShadow: '0 0 10px theme(colors.cyberblue.400), 0 0 20px theme(colors.cyberblue.500)' },
        },
        'dual-glow': {
          '0%': { boxShadow: '0 0 5px theme(colors.cyberblue.400), 0 0 10px theme(colors.cyberblue.500)' },
          '50%': { boxShadow: '0 0 5px theme(colors.cyberred.400), 0 0 10px theme(colors.cyberred.500)' },
          '100%': { boxShadow: '0 0 5px theme(colors.cyberblue.400), 0 0 10px theme(colors.cyberblue.500)' },
        },
        'spin-slow': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fadeIn": "fadeIn 0.5s ease-out",
        "pulse": "pulse 2s ease-in-out infinite",
        "glow": "glow 1.5s ease-in-out infinite",
        "dual-glow": "dual-glow 3s ease-in-out infinite",
        "spin-slow": "spin-slow 3s linear infinite",
        "gradient": "gradient 3s ease infinite",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [
    function({ addVariant }) {
      addVariant('cyberpunk', '.cyberpunk &');
      addVariant('midnight', '.midnight &');
    }
  ],
};
