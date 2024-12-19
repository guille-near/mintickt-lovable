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
    global: {},
  },
  optimizeDeps: {
    include: [
      '@project-serum/anchor',
      '@solana/web3.js',
      '@solana/spl-token',
      'buffer',
      'bn.js',
      'bigint-buffer',
    ],
    esbuildOptions: {
      target: 'esnext',
      define: {
        global: 'globalThis',
      },
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
                id.includes('node_modules/bn.js') ||
                id.includes('node_modules/bigint-buffer')) {
              const polyfills = `
                import { Buffer } from 'buffer';
                const __global = typeof window !== 'undefined' ? window : global;
                if (typeof window !== 'undefined') {
                  window.Buffer = window.Buffer || Buffer;
                  window.global = window;
                }
                if (!__global.Buffer) __global.Buffer = Buffer;
                if (typeof window !== 'undefined' && !window.process) {
                  window.process = { env: {} };
                }
              `;
              return { code: `${polyfills}\n${code}`, map: null };
            }
          }
        }
      ]
    }
  },
}));