import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// SIMPLIFIED VITE CONFIG - NO VITEST CONFLICTS
export default defineConfig({
  plugins: [react()],
  
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  server: {
    port: 4000,
    host: true,
    strictPort: false,
    open: false,
    cors: true,
  },

  build: {
    target: 'esnext',
    minify: 'esbuild',
    sourcemap: false,
  },

  optimizeDeps: {
    include: ['react', 'react-dom'],
  },
});