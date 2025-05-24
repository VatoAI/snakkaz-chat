
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { snakkazCspPlugin } from './src/plugins/snakkazCspPlugin'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    snakkazCspPlugin({
      debug: mode === 'development',
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
  build: {
    // Increase chunk size warning limit to prevent unnecessary warnings
    chunkSizeWarningLimit: 800,
    
    // Enable CSS code splitting
    cssCodeSplit: true,
    
    // Configure Rollup options to improve chunking
    rollupOptions: {
      output: {
        // Manually define chunks for better code splitting
        manualChunks: {
          // Core React libraries
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          
          // UI component libraries
          'vendor-ui': [
            '@radix-ui/react-alert-dialog',
            '@radix-ui/react-avatar',
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-label',
            '@radix-ui/react-popover',
            '@radix-ui/react-select',
            '@radix-ui/react-slot',
            '@radix-ui/react-tabs',
            '@radix-ui/react-toast',
            '@radix-ui/react-tooltip'
          ],
          
          // Supabase and related libs
          'vendor-supabase': ['@supabase/supabase-js'],
          
          // Utility libraries
          'vendor-utils': [
            'date-fns', 
            'class-variance-authority', 
            'clsx', 
            'lucide-react', 
            'tailwind-merge'
          ],
          
          // Form libraries
          'vendor-forms': ['react-hook-form', 'zod', '@hookform/resolvers'],
          
          // Chart libraries - isolated for code splitting
          'vendor-charts': ['recharts'],
          
          // Image processing and media
          'vendor-media': ['@uppy/core', '@uppy/react', '@uppy/dashboard'],
          
          // Encryption and security
          'vendor-security': ['crypto-js', 'tweetnacl', 'tweetnacl-util'],
        },
        // Ensure CSS files are minimized
        minifyInternalExports: true
      }
    }
  }
}))
