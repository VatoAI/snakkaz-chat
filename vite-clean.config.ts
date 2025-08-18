import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// 🚀 SNAKKAZ 2025 - ULTRA-OPTIMIZED VITE CONFIG
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [],
      },
    }),
  ],

  // Clean server config for port 3001
  server: {
    port: 3001,
    host: true,
    strictPort: true,
    open: false,
    cors: true,
    hmr: {
      port: 3001,
      host: "localhost",
      overlay: false,
    },
  },

  // Path aliases
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@components": path.resolve(__dirname, "./src/components"),
      "@pages": path.resolve(__dirname, "./src/pages"),
      "@services": path.resolve(__dirname, "./src/services"),
      "@utils": path.resolve(__dirname, "./src/utils"),
      "@hooks": path.resolve(__dirname, "./src/hooks"),
      "@store": path.resolve(__dirname, "./src/store"),
      "@crypto": path.resolve(__dirname, "./src/crypto"),
      "@styles": path.resolve(__dirname, "./src/styles"),
    },
  },

  // Optimized build
  build: {
    target: "esnext",
    minify: "esbuild",
    sourcemap: false,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          router: ["react-router-dom"],
          crypto: ["crypto-js"],
          ui: ["lucide-react"],
        },
      },
    },
  },

  // Fast dev optimizations
  optimizeDeps: {
    include: ["react", "react-dom", "react-router-dom", "lucide-react"],
    exclude: [],
  },

  css: {
    devSourcemap: false,
  },

  clearScreen: false,
  logLevel: "warn",
});
