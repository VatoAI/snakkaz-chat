import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { snakkazCspPlugin } from './src/plugins/snakkazCspPlugin'

// 🚨 EMERGENCY CONFIG - INGEN CHUNK SPLITTING FOR REACT
export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    snakkazCspPlugin({
      debug: mode === 'development',
      additionalDirectives: {}
    })
  ].filter(Boolean),
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 8080,
    host: "::"
  },
  build: {
    chunkSizeWarningLimit: 1000,
    cssCodeSplit: true,
    sourcemap: true,
    assetsInlineLimit: 4096,
    
    // 🎯 EMERGENCY: MINIMAL CHUNKING - HOLDER REACT SAMMEN
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // IKKE del React i separate chunks - hold alt sammen!
          if (id.includes('node_modules')) {
            // Kun ett vendor chunk for alt
            return 'vendor';
          }
          
          // App kode i ett chunk
          if (id.includes('/src/')) {
            return 'app';
          }
        }
      }
    }
  },
  define: {
    __DEV__: mode === 'development'
  }
}))
