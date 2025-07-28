import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  root: "./", // Sett rot til kun denne mappen
  server: {
    port: 4000,
    host: "0.0.0.0",
    strictPort: true, // FAIL hvis port er opptatt
    open: true, // Åpne browser automatisk
    cors: true,
    hmr: {
      protocol: 'ws',
      host: 'localhost',
      port: 4000,
    },
  },
  preview: {
    port: 4000,
    strictPort: true,
    host: "0.0.0.0",
    open: true,
  },
  build: {
    outDir: "dist",
    sourcemap: true,
    rollupOptions: {
      input: "./index.html", // Eksplisitt input
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom'],
  },
  // Ekskluder andre HTML filer utenfor dette prosjektet
  define: {
    'process.env.NODE_ENV': '"development"'
  }
});
