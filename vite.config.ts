import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { componentTagger } from "lovable-tagger";
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';
import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill';
import rollupNodePolyFill from 'rollup-plugin-node-polyfills';

export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: 5173,
  },
  plugins: [
    react(),
    componentTagger(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      stream: 'stream-browserify',
      crypto: 'crypto-browserify',
      events: 'events',
      http: 'stream-http',
      https: 'https-browserify',
      os: 'os-browserify',
      url: 'url',
      buffer: 'buffer',
    },
  },
  define: {
    'process.env.BROWSER': true,
    'process.env.NODE_DEBUG': JSON.stringify(''),
    'process.env.REACT_APP_CLUSTER': JSON.stringify('devnet'),
    global: 'globalThis',
  },
  optimizeDeps: {
    esbuildOptions: {
      target: 'esnext',
      plugins: [
        NodeGlobalsPolyfillPlugin({
          buffer: true,
        }),
        NodeModulesPolyfillPlugin()
      ],
    },
    include: [
      '@solana/web3.js',
      '@solana/spl-token',
      'buffer',
      'crypto-browserify',
      'events',
      'stream-browserify',
      'util',
      'bn.js',
      'bigint-buffer',
    ],
  },
  build: {
    target: 'esnext',
    rollupOptions: {
      plugins: [
        // Using the plugin in a type-safe way
        rollupNodePolyFill() as any
      ]
    },
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
});