import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// 🚀 ULTRA-OPTIMIZED VITE CONFIG - SPEED FOCUSED
export default defineConfig({
  plugins: [
    react({
      // Use classic JSX runtime for maximum compatibility
      jsxRuntime: "classic",
    }),
  ],

  // Aggressive caching
  cacheDir: "node_modules/.vite",

  // Environment variables for production
  define: {
    "process.env.NODE_ENV": JSON.stringify(
      process.env.NODE_ENV || "development"
    ),
    // Embed Supabase config directly for production
    "import.meta.env.VITE_SUPABASE_URL": JSON.stringify(
      "https://wqpoozpbceucynsojmbk.supabase.co"
    ),
    "import.meta.env.VITE_SUPABASE_ANON_KEY": JSON.stringify(
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndxcG9venBiY2V1Y3luc29qbWJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk1NjgzMDUsImV4cCI6MjA1NTE0NDMwNX0.vu1s86gQKEPXFleOZ1U2uOjW-kj4k4RAiKTbOuXPUD8"
    ),
  },

  // Simple alias only
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  // Ultra-fast server config
  server: {
    port: 3002,
    host: true,
    strictPort: false,
    open: false,
    cors: true,

    // Minimal middleware
    middlewareMode: false,

    // Fixed HMR - Match server port
    hmr: {
      port: 3002,
      host: "localhost",
      overlay: false,
    },

    // No proxy
    proxy: {},
  },

  // Production build optimizations - Simple configuration for stability
  build: {
    target: ["es2015", "chrome63", "firefox67", "safari12"],
    minify: "terser",
    sourcemap: false,
    rollupOptions: {
      output: {
        format: "iife",
      },
    },
    chunkSizeWarningLimit: 500,
    reportCompressedSize: false,
  },

  // Ultra-fast dev optimizations
  optimizeDeps: {
    include: ["react", "react-dom", "react-router-dom"],
    exclude: ["@21st-extension/toolbar-react", "@21st-extension/react"],
    force: false,
  },

  // Disable unnecessary features in dev
  css: {
    devSourcemap: false,
  },

  // Clean dev experience
  clearScreen: false,
  logLevel: "error",
});
