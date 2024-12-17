import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default defineConfig({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      'buffer': 'buffer/',
    },
  },
  define: {
    'process.env': {},
    'global': 'globalThis',
  },
  optimizeDeps: {
    include: [
      '@project-serum/anchor',
      '@solana/web3.js',
      '@solana/spl-token',
      'buffer',
      'assert',
      'util',
    ],
    esbuildOptions: {
      target: 'esnext',
      define: {
        global: 'globalThis'
      }
    },
  },
  build: {
    target: 'esnext',
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    rollupOptions: {
      plugins: [
        {
          name: 'inject-polyfills',
          transform(code, id) {
            if (id.includes('node_modules/@solana') || 
                id.includes('node_modules/@project-serum') || 
                id.includes('node_modules/bn.js') ||
                id.includes('node_modules/assert') ||
                id.includes('node_modules/util')) {
              const polyfills = `
                if (typeof window !== 'undefined') {
                  window.Buffer = window.Buffer || require('buffer/').Buffer;
                  window.process = window.process || { 
                    env: { NODE_ENV: 'production' },
                    version: '',
                    browser: true
                  };
                }
              `;
              return {
                code: `${polyfills}\n${code}`,
                map: null
              };
            }
          }
        }
      ]
    }
  },
});