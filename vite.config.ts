
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
    // Target production build size limits
    chunkSizeWarningLimit: 120,
    
    // Enable CSS code splitting for better performance
    cssCodeSplit: true,
    
    // Enable source maps for debugging in production
    sourcemap: true,
    
    // Optimize asset handling
    assetsInlineLimit: 2048, // Inline assets smaller than 2KB
    
    // Configure Rollup options for optimal chunking
    rollupOptions: {
      output: {
        // Advanced chunking strategy for maximum performance
        manualChunks: (id) => {
          // Core React libraries - always loaded
          if (id.includes('react') || id.includes('react-dom')) {
            return 'vendor-react';
          }
          
          // Router and navigation - lazy loaded
          if (id.includes('react-router')) {
            return 'vendor-router';
          }
          
          // UI component libraries - split by usage
          if (id.includes('@radix-ui')) {
            return 'vendor-radix';
          }
          
          // Supabase and database
          if (id.includes('@supabase') || id.includes('supabase')) {
            return 'vendor-supabase';
          }
          
          // Charts and visualization - lazy loaded
          if (id.includes('recharts') || id.includes('chart')) {
            return 'vendor-charts';
          }
          
          // Media and upload handling - lazy loaded
          if (id.includes('@uppy') || id.includes('uppy') || id.includes('media')) {
            return 'vendor-media';
          }
          
          // Form libraries - lazy loaded
          if (id.includes('react-hook-form') || id.includes('zod') || id.includes('@hookform')) {
            return 'vendor-forms';
          }
          
          // Security and encryption - lazy loaded
          if (id.includes('crypto') || id.includes('tweetnacl') || id.includes('security')) {
            return 'vendor-security';
          }
          
          // Utility libraries - split by size
          if (id.includes('date-fns') || id.includes('moment')) {
            return 'vendor-date';
          }
          
          if (id.includes('lucide-react') || id.includes('icons')) {
            return 'vendor-icons';
          }
          
          // Styling utilities
          if (id.includes('tailwind') || id.includes('clsx') || id.includes('class-variance')) {
            return 'vendor-styles';
          }
          
          // Large vendor libraries
          if (id.includes('node_modules')) {
            const chunks = id.split('node_modules/');
            if (chunks.length > 1) {
              const packageName = chunks[1].split('/')[0];
              // Group smaller packages together
              if (['clsx', 'class-variance-authority', 'tailwind-merge'].includes(packageName)) {
                return 'vendor-utils-small';
              }
            }
            return 'vendor-misc';
          }
        },
        
        // Optimize file naming for caching
        chunkFileNames: (chunkInfo) => {
          const facadeModuleId = chunkInfo.facadeModuleId ? 
            chunkInfo.facadeModuleId.split('/').pop().replace(/\.[^/.]+$/, '') : 'chunk';
          return `assets/js/[name]-[hash].js`;
        },
        
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
        
        // Optimize exports for tree shaking
        minifyInternalExports: true,
        
        // Enable modern output format
        format: 'es',
      },
      
      // External dependencies to reduce bundle size
      external: (id) => {
        // Don't externalize anything for web builds
        return false;
      }
    },
    
    // Enable minification and compression
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.log in production
        drop_debugger: true,
        pure_funcs: ['console.log'], // Remove specific function calls
      },
      mangle: {
        safari10: true,
      },
    },
  }
}))
