
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { VitePWA } from 'vite-plugin-pwa';
import terser from '@rollup/plugin-terser';
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [
      react(),
      mode === 'development' && componentTagger(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.ico', 'robots.txt', 'icons/*.png'],
        manifest: {
          name: 'SnakkaZ Chat',
          short_name: 'SnakkaZ',
          description: 'Den Sikreste Chatten i Verden',
          theme_color: '#0f172a',
          icons: [
            {
              src: '/icons/snakkaz-icon-192.png',
              sizes: '192x192',
              type: 'image/png'
            },
            {
              src: '/icons/snakkaz-icon-512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any maskable'
            }
          ]
        },
        workbox: {
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'google-fonts-cache',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365 // <== 365 dager
                },
                cacheableResponse: {
                  statuses: [0, 200]
                }
              }
            },
            {
              urlPattern: /\.(?:png|jpg|jpeg|svg|gif)$/,
              handler: 'CacheFirst',
              options: {
                cacheName: 'images-cache',
                expiration: {
                  maxEntries: 50,
                  maxAgeSeconds: 60 * 60 * 24 * 30 // <== 30 dager
                }
              }
            }
          ]
        }
      })
    ].filter(Boolean),
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    optimizeDeps: {
      exclude: ['argon2-browser'], // Exclude argon2-browser from optimization
    },
    build: {
      sourcemap: mode !== 'production',
      reportCompressedSize: true,
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: [
              'react', 
              'react-dom',
              'react-router-dom',
              'framer-motion'
            ],
            ui: [
              '@radix-ui/react-dialog',
              '@radix-ui/react-dropdown-menu',
              '@radix-ui/react-tooltip',
              'class-variance-authority',
              'tailwind-merge'
            ],
            encryption: [
              '@privacyresearch/libsignal-protocol-typescript',
              'crypto-js'
            ]
          }
        },
        plugins: mode === 'production' 
          ? [terser({
              format: {
                comments: false
              },
              compress: {
                drop_console: true
              }
            }) as any]
          : []
      }
    },
    server: {
      port: 8080, // Updated to match specified port
      host: "::" // Kept from the local version
    },
    // Add special handling for wasm files
    assetsInclude: ['**/*.wasm'],
    // Add WebAssembly configuration
    optimizeDeps: {
      exclude: ['argon2-browser'],
      esbuildOptions: {
        supported: {
          bigint: true, // Enable BigInt support for ESBuild
        },
      },
    },
  }
});
