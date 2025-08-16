import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// 🚀 ULTRA-OPTIMIZED VITE CONFIG - SPEED FOCUSED
export default defineConfig({
  plugins: [
    react({
      // Optimize React plugin
      babel: {
        plugins: [],
      },
    }),
  ],

  // Aggressive caching
  cacheDir: "node_modules/.vite",

  // Minimal defines
  define: {
    "process.env.NODE_ENV": JSON.stringify(
      process.env.NODE_ENV || "development"
    ),
    "process.env.VITE_SUPABASE_URL": JSON.stringify(
      process.env.VITE_SUPABASE_URL
    ),
    "process.env.VITE_SUPABASE_ANON_KEY": JSON.stringify(
      process.env.VITE_SUPABASE_ANON_KEY
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
    port: 3001,
    host: true,
    strictPort: false,
    open: false,
    cors: true,

    // Minimal middleware
    middlewareMode: false,

    // Fixed HMR - Match server port
    hmr: {
      port: 3001,
      host: "localhost",
      overlay: false,
    },

    // No proxy
    proxy: {},
  },

  // Aggressive build optimizations
  build: {
    target: "esnext",
    minify: "esbuild",
    sourcemap: false,
    rollupOptions: {
      external: [],
      output: {
        manualChunks: undefined,
      },
    },
    chunkSizeWarningLimit: 1000,
    reportCompressedSize: false,
  },

  // Ultra-fast dev optimizations
  optimizeDeps: {
    include: ["react", "react-dom"],
    exclude: [],
    force: false,
  },

  // Disable unnecessary features in dev
  css: {
    devSourcemap: false,
  },
});
