import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5175,
    open: true,
    strictPort: true
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
})