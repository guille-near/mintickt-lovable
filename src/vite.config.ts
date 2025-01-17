import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';
import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill';
import rollupNodePolyFill from 'rollup-plugin-node-polyfills';
import { componentTagger } from 'lovable-tagger';

export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: 8080,
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
      zlib: 'browserify-zlib',
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