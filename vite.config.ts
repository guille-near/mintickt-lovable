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
    esbuildOptions: {
      target: 'esnext',
    },
    include: [
      '@project-serum/anchor',
      '@solana/web3.js',
      '@solana/spl-token',
      'buffer',
      'bn.js',
      'bigint-buffer',
    ],
  },
  build: {
    target: 'esnext',
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    rollupOptions: {
      plugins: [
        {
          name: 'inject-process-env',
          transform(code, id) {
            if (id.includes('node_modules/@solana') || 
                id.includes('node_modules/@project-serum') || 
                id.includes('node_modules/bn.js') ||
                id.includes('node_modules/bigint-buffer')) {
              return {
                code: `
                  import { Buffer } from 'buffer';
                  if (typeof window !== 'undefined') {
                    window.Buffer = window.Buffer || Buffer;
                    window.global = window;
                    if (!window.process) window.process = { env: {} };
                  }
                  ${code}`,
                map: null
              };
            }
          }
        }
      ]
    }
  },
}));