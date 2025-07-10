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
    
    // Disable source maps in production for security and size
    sourcemap: true, // Enable for debugging
    
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
          
          // 1. Split React ecosystem into smaller chunks for better performance
          if (id.includes('react') && !id.includes('react-router')) {
            if (id.includes('react-dom')) {
              return 'vendor-react-dom';
            }
            // Pure React core only
            return 'vendor-react-core';
          }
          
          // 2. React state & hooks utilities (separate from core)
          if (id.includes('use-sync-external-store') || 
              id.includes('scheduler') || 
              id.includes('use-sync-external-store-shim')) {
            return 'vendor-react-hooks';
          }
          
          // 3. UI Component Libraries (split into smaller chunks)
          if (id.includes('@radix-ui')) {
            return 'vendor-radix-ui';
          }
          
          // 4. Form & Validation Libraries  
          if (id.includes('react-error-boundary') ||
              id.includes('react-hook-form') ||
              id.includes('react-day-picker')) {
            return 'vendor-react-forms';
          }
          
          // 5. Advanced React Components
          if (id.includes('react-intersection-observer') ||
              id.includes('react-resizable-panels') ||
              id.includes('react-virtuoso')) {
            return 'vendor-react-advanced';
          }
          
          // 6. Animation Libraries (separate from React core)
          if (id.includes('framer-motion') || id.includes('motion')) {
            return 'vendor-animation';
          }
          
          // 7. Router (1 chunk)
          if (id.includes('react-router')) {
            return 'vendor-router';
          }
          
          // 8. Icon Libraries
          if (id.includes('lucide-react')) {
            return 'vendor-icons';
          }
          
          // 9. Database & Backend (1 chunk)
          if (id.includes('@supabase') || id.includes('supabase') || id.includes('postgrest')) {
            return 'vendor-database';
          }
          
          // 10. Forms & Validation
          if (id.includes('zod') || id.includes('@hookform')) {
            return 'vendor-validation';
          }
          
          // 11. Security & Crypto (1 chunk)
          if (id.includes('crypto') || id.includes('tweetnacl') || id.includes('security') || id.includes('@privacyresearch')) {
            return 'vendor-security';
          }
          
          // 12. Charts & Visualization (1 chunk)
          if (id.includes('recharts') || id.includes('chart')) {
            return 'vendor-charts';
          }
          
          // 13. Utilities (split into smaller chunks)
          if (id.includes('date-fns')) {
            return 'vendor-date-utils';
          }
          
          if (id.includes('lodash') || id.includes('uuid')) {
            return 'vendor-misc-utils';
          }
          
          if (id.includes('tailwind-merge') || id.includes('clsx') || id.includes('class-variance') || id.includes('classnames')) {
            return 'vendor-style-utils';
          }
          
          // 14. Media & Special Features (1 chunk)
          if (id.includes('qrcode') || id.includes('jsqr') || id.includes('speakeasy') || id.includes('otpauth') || 
              id.includes('dompurify') || id.includes('pdf') || id.includes('@uppy') || id.includes('sharp')) {
            return 'vendor-media';
          }
          
          // 15. AI & External APIs (1 chunk)
          if (id.includes('@anthropic-ai')) {
            return 'vendor-ai';
          }
          
          // 16. Split remaining vendor packages for better error isolation
          if (id.includes('node_modules')) {
            // Network & HTTP utilities
            if (id.includes('axios') || id.includes('imapflow') || id.includes('puppeteer')) {
              return 'vendor-network';
            }
            // Image & media processing
            if (id.includes('imagemin') || id.includes('sharp') || id.includes('node-fetch')) {
              return 'vendor-media-tools';
            }
            // Default for remaining small packages
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
    
    // Enable minification and compression (TEMPORARILY DISABLED FOR DEBUGGING)
    minify: false, // Changed from 'terser' to false for debugging
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log'],
        unused: true,
        dead_code: true,
        // Fix for "K is undefined" and similar issues
        keep_fargs: false,
        keep_classnames: false,
      },
      mangle: {
        safari10: true,
        // Prevent critical mangling issues
        reserved: ['React', 'useState', 'useEffect', 'useSyncExternalStore', 'useSyncExternalStoreShim', 'require', 'exports'],
        keep_classnames: false,
        keep_fnames: false,
      },
      format: {
        comments: false, // Remove comments for smaller bundles
      }
    },
  }
}))
