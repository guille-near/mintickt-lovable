import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
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
          name: 'inject-buffer-polyfill',
          transform(code, id) {
            if (id.includes('node_modules/@solana') || 
                id.includes('node_modules/@project-serum') || 
                id.includes('node_modules/bn.js')) {
              const polyfills = `
                if (typeof window !== 'undefined') {
                  window.Buffer = window.Buffer || require('buffer/').Buffer;
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
}));