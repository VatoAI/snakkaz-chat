import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { splitVendorChunkPlugin } from 'vite';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: true,
    port: 5173,
  },
  plugins: [
    react(),
    splitVendorChunkPlugin(), // Splitter leverandørkode fra appkode
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  define: {
    global: 'globalThis',
  },
  build: {
    sourcemap: mode === 'development',
    chunkSizeWarningLimit: 600,  // Øker varselsgrensen litt for å redusere støy
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-components': ['@/components/ui'],
          'crypto-utils': ['@/utils/encryption', '@/utils/webrtc'],
          'lucide-icons': ['lucide-react'],
          'date-libraries': ['date-fns'],
          'supabase': ['@supabase/supabase-js']
        },
      }
    },
    // Juster byggoptimalisering
    target: 'esnext',  // Moderne nettlesere for bedre treeshaking
    minify: 'terser',  // Bruk terser for bedre minimering
    terserOptions: {
      compress: {
        drop_console: mode === 'production',  // Fjern console.log i produksjon
        drop_debugger: true
      }
    }
  }
}));
