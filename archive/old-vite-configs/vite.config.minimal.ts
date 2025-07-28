import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// EMERGENCY CLEAN VITE CONFIG - Norwegian Aurora Focus
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true,
    strictPort: false,
    fs: {
      strict: false
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'lucide-react']
  },
  css: {
    devSourcemap: false
  },
  clearScreen: false,
  logLevel: 'info'
})
