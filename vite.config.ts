import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { snakkazCspPlugin } from './src/plugins/snakkazCspPlugin'
import { fixReactModuleOrder } from './src/vite-plugins/fix-react-order'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    fixReactModuleOrder(),
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
    chunkSizeWarningLimit: 500,
    
    // Enable CSS code splitting for better performance
    cssCodeSplit: true,
    
    // Enable source maps for debugging in production
    sourcemap: true,
    
    // Optimize asset handling
    assetsInlineLimit: 4096, // Inline assets smaller than 4KB for better performance
    
    // Configure Rollup options for optimal chunking
    rollupOptions: {
      output: {
        // Ultra-optimized chunking strategy for ~15-20 bundles
        manualChunks: (id) => {
          // Core app utilities and shared components
          if (id.includes('/src/components/ui/') || id.includes('/src/hooks/') || id.includes('/src/lib/')) {
            return 'app-utils';
          }
          
          // Consolidate ALL page components into fewer chunks (3 chunks total)
          if (id.includes('/src/pages/')) {
            // Authentication-related pages
            if (id.includes('Login') || id.includes('Register') || id.includes('ForgotPassword') || 
                id.includes('ResetPassword') || id.includes('EmailConfirmation') || id.includes('Auth')) {
              return 'pages-auth';
            }
            
            // Chat-related pages (including AI, Group, Basic chat)
            if (id.includes('Chat') || id.includes('AIChatPage') || id.includes('GroupChat') || 
                id.includes('BasicChat') || id.includes('EnhancedGroupChat')) {
              return 'pages-chat';
            }
            
            // All other pages (Dashboard, Profile, Settings, Features, Social, etc.)
            return 'pages-main';
          }
          
          // Consolidate ALL components into single chunk
          if (id.includes('/src/components/')) {
            return 'components-ui';
          }
          
          // Services consolidation
          if (id.includes('/src/services/') || id.includes('memoryService')) {
            return 'app-services';
          }
          
          // 1. React ecosystem (2 chunks)
          if (id.includes('react') && !id.includes('react-router')) {
            if (id.includes('react-dom')) {
              return 'vendor-react-dom';
            }
            return 'vendor-react-core';
          }
          
          // ALL React dependencies must be bundled with React core to ensure proper loading order
          if (id.includes('use-sync-external-store') || 
              id.includes('scheduler') || 
              id.includes('use-sync-external-store-shim') ||
              id.includes('@radix-ui') ||
              id.includes('react-error-boundary') ||
              id.includes('react-hook-form') ||
              id.includes('react-day-picker') ||
              id.includes('react-intersection-observer') ||
              id.includes('react-resizable-panels') ||
              id.includes('react-virtuoso') ||
              id.includes('framer-motion') ||
              id.includes('motion')) {
            return 'vendor-react-core';
          }
          
          // 2. Router (1 chunk)
          if (id.includes('react-router')) {
            return 'vendor-router';
          }
          
          // 3. UI Components (1 chunk) - Note: Radix UI moved to vendor-react-core above
          if (id.includes('lucide-react')) {
            return 'vendor-ui-components';
          }
          
          // 4. Animation & Motion - Removed framer-motion (moved to vendor-react-core)
          // Keeping this chunk for future animation libraries
          
          // 5. Database & Backend (1 chunk)
          if (id.includes('@supabase') || id.includes('supabase') || id.includes('postgrest')) {
            return 'vendor-database';
          }
          
          // 6. Forms & Validation - Removed react-hook-form (moved to vendor-react-core)
          if (id.includes('zod') || id.includes('@hookform')) {
            return 'vendor-forms';
          }
          
          // 7. Security & Crypto (1 chunk)
          if (id.includes('crypto') || id.includes('tweetnacl') || id.includes('security') || id.includes('@privacyresearch')) {
            return 'vendor-security';
          }
          
          // 8. Charts & Visualization (1 chunk)
          if (id.includes('recharts') || id.includes('chart')) {
            return 'vendor-charts';
          }
          
          // 9. Utilities (merged from 2 to 1 chunk)
          if (id.includes('date-fns') || id.includes('lodash') || id.includes('uuid') ||
              id.includes('tailwind-merge') || id.includes('clsx') || id.includes('class-variance') || id.includes('classnames')) {
            return 'vendor-utils';
          }
          
          // 10. Media & Special Features (1 chunk)
          if (id.includes('qrcode') || id.includes('jsqr') || id.includes('speakeasy') || id.includes('otpauth') || 
              id.includes('dompurify') || id.includes('pdf') || id.includes('@uppy') || id.includes('sharp')) {
            return 'vendor-media-special';
          }
          
          // 11. AI & External APIs (1 chunk)
          if (id.includes('@anthropic-ai')) {
            return 'vendor-ai';
          }
          
          // 12. Remaining vendor packages (1 chunk)
          if (id.includes('node_modules')) {
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
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log'],
        unused: true,
        dead_code: true,
        // FIX: Prevent single-letter variables that cause "K is undefined"
        keep_fargs: false,
        toplevel: false,
        keep_fnames: false,
      },
      mangle: {
        safari10: true,
        // Reserve important React functions to prevent mangling issues
        reserved: ['React', 'useState', 'useEffect', 'useSyncExternalStore', 'useSyncExternalStoreShim'],
      },
      format: {
        comments: false, // Remove comments for smaller bundles
      }
    },
  }
}))
