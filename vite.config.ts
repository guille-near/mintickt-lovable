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
    'global.Buffer': ['buffer', 'Buffer'],
  },
  optimizeDeps: {
    include: [
      '@project-serum/anchor',
      '@solana/web3.js',
      '@solana/spl-token',
      'buffer',
      'bn.js',
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
      external: ['buffer'],
      plugins: [
        {
          name: 'inject-buffer-polyfill',
          transform(code, id) {
            if (id.includes('node_modules/@solana') || 
                id.includes('node_modules/@project-serum') || 
                id.includes('node_modules/bn.js')) {
              const polyfills = `
                import { Buffer } from 'buffer';
                if (typeof window !== 'undefined') {
                  if (!window.Buffer) window.Buffer = Buffer;
                  if (!window.global) window.global = window;
                  if (!window.process) window.process = { env: {} };
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