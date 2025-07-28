import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// MINIMAL CONFIG FOR NORWEGIAN AURORA - GUARANTEED WORKING
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 3000, // DIFFERENT PORT FOR FRESH START!
    host: true,
    open: false,
    strictPort: false,
    hmr: {
      overlay: false, // Disable error overlay for cleaner experience
    },
  },
  optimizeDeps: {
    include: ["react", "react-dom"],
  },
  build: {
    sourcemap: false,
    minify: false, // DISABLE FOR NOW - easier debugging
    rollupOptions: {
      output: {
        manualChunks: undefined, // Prevent chunk splitting issues
      },
    },
  },
  // Prevent auto-opening browser
  preview: {
    open: false,
  },
});
