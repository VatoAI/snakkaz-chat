
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { componentTagger } from "lovable-tagger"
import { snakkazCspPlugin } from './src/plugins/snakkazCspPlugin'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
    snakkazCspPlugin({
      debug: mode === 'development',
      cloudflareToken: 'c5bd7bbfe41c47c2a5ec',
      // Legg til ekstra CSP-direktiver hvis nødvendig
      additionalDirectives: {
        // For eksempel: 'img-src': ['ytterligere.domene.no']
      }
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
}))
