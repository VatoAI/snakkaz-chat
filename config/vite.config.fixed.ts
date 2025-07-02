// React State Fix for use-sync-external-store-shim
// This file ensures proper React state synchronization

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { snakkazCspPlugin } from './src/plugins/snakkazCspPlugin'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    react({
      // Fix React state synchronization issues
      babel: {
        plugins: []
      }
    }),
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
  define: {
    // Ensure React is properly defined in production
    'process.env.NODE_ENV': JSON.stringify(mode === 'production' ? 'production' : 'development'),
  },
  server: {
    port: 8080,
    host: "::"
  },
  build: {
    chunkSizeWarningLimit: 120,
    cssCodeSplit: true,
    sourcemap: true,
    assetsInlineLimit: 2048,
    
    rollupOptions: {
      output: {
        // Improved chunking to fix React state issues
        manualChunks: (id) => {
          // Core React - keep together to prevent state issues
          if (id.includes('react') || id.includes('react-dom') || id.includes('use-sync-external-store')) {
            return 'vendor-react';
          }
          
          if (id.includes('react-router')) {
            return 'vendor-router';
          }
          
          if (id.includes('@radix-ui')) {
            return 'vendor-ui';
          }
          
          if (id.includes('@supabase') || id.includes('supabase')) {
            return 'vendor-supabase';
          }
          
          if (id.includes('recharts') || id.includes('chart')) {
            return 'vendor-charts';
          }
          
          if (id.includes('@uppy') || id.includes('uppy') || id.includes('media')) {
            return 'vendor-media';
          }
          
          if (id.includes('react-hook-form') || id.includes('zod') || id.includes('@hookform')) {
            return 'vendor-forms';
          }
          
          if (id.includes('crypto') || id.includes('tweetnacl') || id.includes('security')) {
            return 'vendor-security';
          }
          
          if (id.includes('date-fns') || id.includes('moment')) {
            return 'vendor-date';
          }
          
          if (id.includes('lucide-react') || id.includes('icons')) {
            return 'vendor-icons';
          }
          
          if (id.includes('tailwind') || id.includes('clsx') || id.includes('class-variance')) {
            return 'vendor-styles';
          }
          
          if (id.includes('node_modules')) {
            return 'vendor-misc';
          }
        },
        
        // Ensure proper global definitions
        globals: {
          'react': 'React',
          'react-dom': 'ReactDOM'
        }
      }
    },
    
    // Optimize dependencies to prevent state conflicts
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'use-sync-external-store'
      ],
      exclude: []
    }
  },
  
  // Prevent dev mode issues
  esbuild: {
    logOverride: { 'this-is-undefined-in-esm': 'silent' }
  }
}))
