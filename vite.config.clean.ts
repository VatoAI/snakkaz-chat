import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// ULTRA CLEAN VITE CONFIG - NO VITEST
export default defineConfig({
  plugins: [react()],
  
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  server: {
    port: 5173,
    host: true,
    strictPort: true,
    open: false,
  },

  build: {
    target: 'esnext',
    sourcemap: false,
  },
});