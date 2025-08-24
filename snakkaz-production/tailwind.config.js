/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#0066ff",
        secondary: "#00b4d8",
        accent: "#ff6b6b",
        success: "#51cf66",
        warning: "#ffd43b",
        error: "#ff6b6b",
        "norway-red": "#ef233c",
        "norway-blue": "#003f88",
        "norway-white": "#ffffff",
      },
      backgroundImage: {
        "gradient-primary": "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        "gradient-success": "linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)",
        "gradient-premium": "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
        "norway-accent":
          "linear-gradient(45deg, #ef233c 0%, #ffffff 50%, #003f88 100%)",
      },
      boxShadow: {
        soft: "0 4px 20px rgba(0, 0, 0, 0.1)",
        medium: "0 8px 30px rgba(0, 0, 0, 0.15)",
        hard: "0 20px 40px rgba(0, 0, 0, 0.2)",
      },
      backdropBlur: {
        20: "20px",
      },
      animation: {
        "norwegian-fade-in": "norwegianFadeIn 0.8s ease-out forwards",
        floating: "floating 6s ease-in-out infinite",
      },
      keyframes: {
        norwegianFadeIn: {
          from: {
            opacity: "0",
            transform: "translateY(20px)",
          },
          to: {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        floating: {
          "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
          "50%": { transform: "translateY(-10px) rotate(1deg)" },
        },
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui"],
      },
    },
  },
  plugins: [],
};
