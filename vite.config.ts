import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { componentTagger } from "lovable-tagger";
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';
import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill';
import rollupNodePolyFill from 'rollup-plugin-node-polyfills';

export default defineConfig({
  server: {
    port: 8080,
    host: true,
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
          process: true,
          buffer: true
        }),
        NodeModulesPolyfillPlugin()
      ],
    },
    include: [
      '@solana/web3.js',
      '@solana/spl-token',
      'buffer',
    ],
  },
  build: {
    target: 'esnext',
    rollupOptions: {
      plugins: [
        rollupNodePolyFill() as any
      ]
    },
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
});