import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: true,
    port: 5174, // Different port for V2
    open: true,
    strictPort: true,
  },
  build: {
    outDir: 'dist-v2',
    sourcemap: true,
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index-v2.html')
      }
    }
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom']
  }
})