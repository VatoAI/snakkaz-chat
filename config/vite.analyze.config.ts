import { defineConfig } from 'vite';
import { visualizer } from 'vite-bundle-analyzer';
import { configDefaults } from './vite.config';

export default defineConfig({
  ...configDefaults,
  plugins: [
    ...(configDefaults.plugins || []),
    visualizer({
      open: true,
      filename: 'dist/stats.html',
      gzipSize: true,
      brotliSize: true,
    }),
  ],
  build: {
    ...configDefaults.build,
    sourcemap: true,
    outDir: 'dist-analyze',
  },
});
