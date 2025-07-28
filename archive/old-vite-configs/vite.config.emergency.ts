import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { visualizer } from "rollup-plugin-visualizer";

// 🚀 EMERGENCY VITE CONFIG - BRUTALLY SIMPLE + OPTIMIZED
export default defineConfig({
  plugins: [
    react(),
    // Bundle analyzer - only in build mode
    ...(process.env.ANALYZE
      ? [
          visualizer({
            filename: "dist/stats.html",
            open: true,
            gzipSize: true,
            brotliSize: true,
          }),
        ]
      : []),
  ],

  // Fix process.env for browser
  define: {
    "process.env.NODE_ENV": JSON.stringify(
      process.env.NODE_ENV || "development"
    ),
    "process.env.VITE_SUPABASE_URL": JSON.stringify(
      process.env.VITE_SUPABASE_URL
    ),
    "process.env.VITE_SUPABASE_ANON_KEY": JSON.stringify(
      process.env.VITE_SUPABASE_ANON_KEY
    ),
    global: "globalThis",
  },

  // Simple alias
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  }, // Ultra-simple server config
  server: {
    port: 4000,
    host: true,
    strictPort: false, // Let Vite choose if 4000 is busy
    open: false,

    // Remove ALL problematic headers
    headers: {},

    // Simple HMR
    hmr: {
      overlay: true,
    },
  },

  // Force CSS handling
  css: {
    devSourcemap: true,
    preprocessorOptions: {
      css: {
        charset: false, // Disable charset injection
      },
    },
  },

  // Emergency build settings + BUNDLE OPTIMIZATION
  build: {
    outDir: "dist",
    assetsDir: "assets",
    sourcemap: false, // Disable sourcemaps for smaller bundle
    minify: "terser",

    // Force aggressive chunk splitting to avoid large files
    rollupOptions: {
      output: {
        manualChunks: {
          // Core React
          "react-vendor": ["react", "react-dom"],

          // UI Libraries
          "ui-vendor": [
            "@radix-ui/react-dialog",
            "@radix-ui/react-dropdown-menu",
            "@radix-ui/react-slot",
            "framer-motion",
          ],

          // Chat & Communication
          "chat-vendor": ["@chatui/core", "peerjs"],

          // Supabase & Database
          "supabase-vendor": [
            "@supabase/supabase-js",
            "@supabase/postgrest-js",
          ],

          // Icons (likely large)
          "icons-vendor": ["lucide-react"],

          // Utilities
          "utils-vendor": [
            "clsx",
            "class-variance-authority",
            "tailwind-merge",
          ],
        },

        // Dynamic chunk naming for better caching
        chunkFileNames: (chunkInfo) => {
          const facadeModuleId = chunkInfo.facadeModuleId
            ? chunkInfo.facadeModuleId
                .split("/")
                .pop()
                ?.replace(/\.[^/.]+$/, "") || "chunk"
            : "chunk";
          return `js/${facadeModuleId}-[hash].js`;
        },

        // Asset naming
        assetFileNames: (assetInfo) => {
          const name = assetInfo.name || "asset";
          const info = name.split(".");
          let extType = info[info.length - 1];
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
            extType = "img";
          } else if (/woff|woff2|eot|ttf|otf/i.test(extType)) {
            extType = "fonts";
          }
          return `${extType}/[name]-[hash][extname]`;
        },
      },
    },

    // Terser options for better minification
    // Terser options for better minification
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.log in production
        drop_debugger: true,
      },
    },
  },

  // Remove all optimizations that can cause issues
  optimizeDeps: {
    include: ["react", "react-dom"],
    exclude: [],
    force: true, // Force re-bundling
  },
});
