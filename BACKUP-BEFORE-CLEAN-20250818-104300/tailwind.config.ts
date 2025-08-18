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
        // SnakkaZ Brand Colors
        snakkaz: {
          blue: "#007AFF",
          purple: "#5856D6",
          red: "#FF3B30",
          green: "#34C759",
          orange: "#FF9500",
          "glass-blue": "rgba(0, 122, 255, 0.1)",
          "glass-purple": "rgba(88, 86, 214, 0.1)",
          "glass-dark": "rgba(0, 0, 0, 0.8)",
        },
        // Cyberpunk color scheme
        cyberdark: {
          950: "#0a0a0a",
          900: "#1a1a1a",
          800: "#2a2a2a",
          700: "#3a3a3a",
          600: "#4a4a4a",
          500: "#5a5a5a",
          400: "#6a6a6a",
          300: "#7a7a7a",
        },
        cybergold: {
          500: "#ffd700",
          400: "#ffed4e",
          300: "#fef08a",
          200: "#fefce8",
        },
        cyberblue: {
          500: "#00ffff",
          400: "#22d3ee",
          300: "#67e8f9",
        },
        // Clean slate - ready for your custom color scheme
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
      },
      fontFamily: {
        snakkaz: [
          "-apple-system",
          "BlinkMacSystemFont",
          '"SF Pro Display"',
          '"Segoe UI"',
          "Roboto",
          "sans-serif",
        ],
        "snakkaz-mono": [
          '"SF Mono"',
          "Monaco",
          '"Cascadia Code"',
          '"Roboto Mono"',
          "Consolas",
          "monospace",
        ],
      },
      animation: {
        "snakkaz-glow": "snakkaz-glow 2s ease-in-out infinite alternate",
        "snakkaz-pulse": "snakkaz-pulse 1.5s ease-in-out infinite",
      },
      keyframes: {
        "snakkaz-glow": {
          "0%": {
            boxShadow:
              "0 0 5px rgba(0, 122, 255, 0.5), 0 0 10px rgba(0, 122, 255, 0.3), 0 0 15px rgba(0, 122, 255, 0.2)",
          },
          "100%": {
            boxShadow:
              "0 0 10px rgba(0, 122, 255, 0.8), 0 0 20px rgba(0, 122, 255, 0.5), 0 0 30px rgba(0, 122, 255, 0.3)",
          },
        },
        "snakkaz-pulse": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
      },
      backdropBlur: {
        snakkaz: "20px",
      },
      backdropBrightness: {
        snakkaz: "1.1",
      },
      backdropSaturate: {
        snakkaz: "1.8",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
