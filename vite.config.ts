import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';
import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill';
import rollupNodePolyFill from 'rollup-plugin-node-polyfills';
import path from 'path';
import { componentTagger } from 'lovable-tagger';

export default defineConfig(({ mode }) => ({
  server: {
    host: '0.0.0.0',
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      stream: 'rollup-plugin-node-polyfills/polyfills/stream',
      events: 'rollup-plugin-node-polyfills/polyfills/events',
      assert: 'assert',
      crypto: 'crypto-browserify',
      util: 'util',
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
          // Disable buffer polyfill since we're handling it in polyfills.ts
          buffer: false
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
}));