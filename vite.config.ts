import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';
import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill';
import rollupNodePolyFill from 'rollup-plugin-node-polyfills';
import path from 'path';
import { componentTagger } from 'lovable-tagger';

export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: 8080,
  },
  plugins: [
    react(),
    process.env.NODE_ENV === 'development' && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      // Core Node.js modules
      stream: 'rollup-plugin-node-polyfills/polyfills/stream',
      events: 'rollup-plugin-node-polyfills/polyfills/events',
      assert: 'assert',
      crypto: 'crypto-browserify',
      util: 'util',
      buffer: 'buffer',  // Use the buffer package directly
    },
  },
  define: {
    'process.env.NODE_DEBUG': JSON.stringify(''),
    global: 'globalThis',
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: 'globalThis',
      },
      plugins: [
        NodeGlobalsPolyfillPlugin({
          process: true,
          buffer: true  // Enable buffer polyfill
        }),
        NodeModulesPolyfillPlugin(),
      ],
    },
  },
  build: {
    target: 'esnext',
    rollupOptions: {
      plugins: [
        // @ts-ignore - known issue with rollup-plugin-node-polyfills
        rollupNodePolyFill(),
      ],
    },
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
});