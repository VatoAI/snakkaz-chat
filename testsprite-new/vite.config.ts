import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
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
  root: ".",
  base: "/",
  build: {
    outDir: "dist",
    sourcemap: true,
  },
  optimizeDeps: {
    include: ['react', 'react-dom'],
  },
});
