import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { snakkazCspPlugin } from './src/plugins/snakkazCspPlugin'

// Plugin to fix React module loading order
const fixReactLoadingOrder = () => {
  return {
    name: 'fix-react-loading-order',
    generateBundle(_options: unknown, bundle: Record<string, unknown>) {
      // Find the HTML file and fix modulepreload order
      Object.keys(bundle).forEach(fileName => {
        const file = bundle[fileName] as { type?: string; source?: string };
        if (fileName.endsWith('.html') && file.type === 'asset' && file.source) {
          let html = file.source as string;
          
          // Extract all modulepreload links
          const modulePreloadRegex = /<link rel="modulepreload"[^>]*>/g;
          const modulePreloads = html.match(modulePreloadRegex) || [];
          
          // Sort them in the correct order: React Core -> React DOM -> vendor-misc -> others
          const sortedPreloads = modulePreloads.sort((a, b) => {
            if (a.includes('vendor-react-core')) return -3;
            if (a.includes('vendor-react-dom')) return -2;
            if (a.includes('vendor-misc')) return -1;
            return 0;
          });
          
          // Remove all existing modulepreload links
          html = html.replace(modulePreloadRegex, '');
          
          // Insert sorted modulepreload links before the main script
          const scriptIndex = html.indexOf('<script type="module"');
          if (scriptIndex !== -1) {
            const sortedPreloadsStr = sortedPreloads.join('\n    ');
            html = html.slice(0, scriptIndex) + sortedPreloadsStr + '\n    ' + html.slice(scriptIndex);
          }
          
          file.source = html;
        }
      });
    }
  };
};

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    fixReactLoadingOrder(),
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
        // Ultra-optimized chunking strategy for ~20 bundles
        manualChunks: (id) => {
          // Core app utilities and shared components
          if (id.includes('/src/components/ui/') || id.includes('/src/hooks/') || id.includes('/src/lib/')) {
            return 'app-utils';
          }
          
          // Page-level consolidation (5 chunks for all pages)
          if (id.includes('/src/pages/')) {
            // Authentication pages
            if (id.includes('Login') || id.includes('Register') || id.includes('ForgotPassword') || 
                id.includes('ResetPassword') || id.includes('EmailConfirmation')) {
              return 'pages-auth';
            }
            
            // Main application pages
            if (id.includes('Dashboard') || id.includes('Profile') || id.includes('Settings')) {
              return 'pages-main';
            }
            
            // Social features pages  
            if (id.includes('Friends') || id.includes('FindFriends') || id.includes('Mail')) {
              return 'pages-social';
            }
            
            // Chat-related pages
            if (id.includes('Chat') || id.includes('BasicChat') || id.includes('GroupChat') || 
                id.includes('AIChatPage') || id.includes('EnhancedGroupChat')) {
              return 'pages-chat';
            }
            
            // Feature pages (Memory, MCP, Subscription, etc.)
            return 'pages-features';
          }
          
          // Component consolidation (2 chunks for all components)
          if (id.includes('/src/components/')) {
            // Dynamic components
            if (id.includes('Dynamic')) {
              return 'components-dynamic';
            }
            
            // All other components (navigation, layout, etc.)
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
          
          // React dependencies that need React to be available
          if (id.includes('use-sync-external-store') || id.includes('scheduler')) {
            return 'vendor-react-core';
          }
          
          // 2. Router (1 chunk)
          if (id.includes('react-router')) {
            return 'vendor-router';
          }
          
          // 3. UI Components (1 chunk)
          if (id.includes('@radix-ui') || id.includes('lucide-react')) {
            return 'vendor-ui-components';
          }
          
          // 4. Animation & Motion (1 chunk)
          if (id.includes('framer-motion') || id.includes('motion')) {
            return 'vendor-animation';
          }
          
          // 5. Database & Backend (1 chunk)
          if (id.includes('@supabase') || id.includes('supabase') || id.includes('postgrest')) {
            return 'vendor-database';
          }
          
          // 6. Forms & Validation (1 chunk)
          if (id.includes('react-hook-form') || id.includes('zod') || id.includes('@hookform')) {
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
          
          // 9. Utilities (2 chunks)
          if (id.includes('date-fns') || id.includes('lodash') || id.includes('uuid')) {
            return 'vendor-utils-data';
          }
          
          if (id.includes('tailwind-merge') || id.includes('clsx') || id.includes('class-variance') || id.includes('classnames')) {
            return 'vendor-utils-style';
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
