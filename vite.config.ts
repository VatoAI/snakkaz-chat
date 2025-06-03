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
    // Target production build size limits (more lenient for better performance)
    chunkSizeWarningLimit: 250,
    
    // Enable CSS code splitting for better performance
    cssCodeSplit: true,
    
    // Enable source maps for debugging in production
    sourcemap: true,
    
    // Optimize asset handling
    assetsInlineLimit: 4096, // Inline assets smaller than 4KB for better performance
    
    // Configure Rollup options for optimal chunking
    rollupOptions: {
      output: {
        // Advanced chunking strategy for maximum performance
        manualChunks: (id) => {
          // React Core - split more granularly to reduce the massive vendor-react chunk
          if (id.includes('react/index') || id.includes('react.production.min.js')) {
            return 'vendor-react-core';
          }
          
          if (id.includes('react-dom') && id.includes('client')) {
            return 'vendor-react-dom-client';
          }
          
          // Split react-dom further to reduce the 131kB chunk
          if (id.includes('react-dom') && !id.includes('client')) {
            // Split server rendering
            if (id.includes('server') || id.includes('static')) {
              return 'vendor-react-dom-server';
            }
            // Split react-dom events
            if (id.includes('events') || id.includes('event')) {
              return 'vendor-react-dom-events';
            }
            // Split react-dom reconciler
            if (id.includes('reconciler') || id.includes('fiber')) {
              return 'vendor-react-dom-reconciler';
            }
            // Split react-dom legacy
            if (id.includes('legacy') || id.includes('unstable')) {
              return 'vendor-react-dom-legacy';
            }
            // Split react-dom core
            return 'vendor-react-dom';
          }
          
          if (id.includes('scheduler') || id.includes('react/cjs')) {
            return 'vendor-react-scheduler';
          }
          
          if (id.includes('react') && (id.includes('jsx') || id.includes('runtime'))) {
            return 'vendor-react-jsx';
          }
          
          // Remaining React packages - split further to reduce the 141kB vendor-react-misc
          if (id.includes('react') && !id.includes('react-router')) {
            // Split React DevTools
            if (id.includes('devtools') || id.includes('react-devtools')) {
              return 'vendor-react-devtools';
            }
            // Split React utilities and hooks
            if (id.includes('use-') || id.includes('hook') || id.includes('hooks')) {
              return 'vendor-react-hooks';
            }
            // Split React internals
            if (id.includes('lib') || id.includes('shared') || id.includes('unstable')) {
              return 'vendor-react-internals';
            }
            // Split React reconciler and fiber
            if (id.includes('reconciler') || id.includes('fiber') || id.includes('profiler')) {
              return 'vendor-react-reconciler';
            }
            // Split React refresh/development
            if (id.includes('refresh') || id.includes('fast-refresh') || id.includes('hot')) {
              return 'vendor-react-refresh';
            }
            // Split React experimental features
            if (id.includes('experimental') || id.includes('concurrent')) {
              return 'vendor-react-experimental';
            }
            // Split React error boundaries
            if (id.includes('error') || id.includes('boundary')) {
              return 'vendor-react-error';
            }
            // Split React synthetic events
            if (id.includes('synthetic') || id.includes('event')) {
              return 'vendor-react-events';
            }
            // Remaining React packages (should be much smaller now)
            return 'vendor-react-misc';
          }
          
          // Router and navigation - lazy loaded
          if (id.includes('react-router')) {
            return 'vendor-router';
          }
          
          // UI component libraries - split by usage
          if (id.includes('@radix-ui')) {
            return 'vendor-radix';
          }
          
          // Supabase and database - split to reduce the 110kB chunk
          if (id.includes('@supabase/supabase-js')) {
            return 'vendor-supabase-core';
          }
          
          if (id.includes('@supabase/auth-helpers')) {
            return 'vendor-supabase-auth';
          }
          
          if (id.includes('@supabase') || id.includes('supabase') || id.includes('postgrest')) {
            return 'vendor-supabase';
          }
          
          // Animation and motion - separate chunk for better code splitting
          if (id.includes('framer-motion')) {
            return 'vendor-framer-motion';
          }
          
          if (id.includes('motion') || id.includes('popmotion') || id.includes('motion-dom')) {
            return 'vendor-motion-utils';
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
          if (id.includes('react-hook-form')) {
            return 'vendor-react-hook-form';
          }
          
          if (id.includes('zod') || id.includes('@hookform')) {
            return 'vendor-form-validation';
          }
          
          // Security and encryption - lazy loaded
          if (id.includes('crypto') || id.includes('tweetnacl') || id.includes('security') || id.includes('nanoid')) {
            return 'vendor-security';
          }
          
          // Utility libraries - split by size
          if (id.includes('date-fns') || id.includes('moment')) {
            return 'vendor-date';
          }
          
          // Icons - separate chunk for better caching
          if (id.includes('lucide-react') || id.includes('icons')) {
            return 'vendor-icons';
          }
          
          // Styling utilities - split by usage
          if (id.includes('tailwind-merge') || id.includes('tw-merge')) {
            return 'vendor-tailwind';
          }
          
          if (id.includes('clsx') || id.includes('class-variance') || id.includes('classnames')) {
            return 'vendor-classnames';
          }
          
          // QR Code generation - often lazy loaded
          if (id.includes('qrcode') || id.includes('qr-code')) {
            return 'vendor-qrcode';
          }
          
          // PDF and document handling
          if (id.includes('pdf') || id.includes('jspdf')) {
            return 'vendor-pdf';
          }
          
          // Large vendor libraries - split more granularly
          if (id.includes('node_modules')) {
            const chunks = id.split('node_modules/');
            if (chunks.length > 1) {
              const packageName = chunks[1].split('/')[0];
              
              // Group very small utilities together
              if (['clsx', 'class-variance-authority', 'tailwind-merge', 'classnames'].includes(packageName)) {
                return 'vendor-utils-small';
              }
              
              // Separate large packages that can be lazy loaded
              if (['@emotion', 'styled-components', 'emotion'].includes(packageName)) {
                return 'vendor-styling';
              }
              
              // Development tools that shouldn't be in production
              if (['rollup', 'vite', 'esbuild', '@rollup'].includes(packageName)) {
                return 'vendor-build-tools';
              }
              
              // Split remaining misc packages into smaller chunks
              if (packageName.startsWith('@')) {
                return 'vendor-scoped';
              }
            }
            return 'vendor-misc';
          }
        },
        
        // Optimize file naming for caching
        chunkFileNames: (chunkInfo) => {
          const facadeModuleId = chunkInfo.facadeModuleId ? 
            chunkInfo.facadeModuleId.split('/').pop()?.replace(/\.[^/.]+$/, '') : 'chunk';
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
        unused: true, // Remove unused code
        dead_code: true, // Remove dead code
      },
      mangle: {
        safari10: true,
      },
      format: {
        comments: false, // Remove comments for smaller bundles
      }
    },
  }
}))
