import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      'buffer': 'buffer/',
    },
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
    },
  },
  build: {
    target: 'esnext',
    rollupOptions: {
      plugins: [
        {
          name: 'inject-buffer-polyfill',
          transform(code, id) {
            if (id.includes('node_modules/@solana') || 
                id.includes('node_modules/@project-serum') || 
                id.includes('node_modules/bn.js')) {
              const bufferPolyfill = `
                if (typeof window !== 'undefined') {
                  window.Buffer = window.Buffer || require('buffer/').Buffer;
                  window.process = window.process || { env: { NODE_ENV: 'production' } };
                }
              `;
              return {
                code: `${bufferPolyfill}\n${code}`,
                map: null
              };
            }
          }
        }
      ]
    }
  },
});