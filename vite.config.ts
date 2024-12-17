import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  base: '/',
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "buffer": "buffer",
    },
  },
  define: {
    'process.env': {},
    'process.browser': true,
    'process.version': '"v16.0.0"',
    'global': 'globalThis',
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: 'globalThis'
      }
    },
    include: ['buffer', '@solana/web3.js', '@solana/spl-token', '@project-serum/anchor', '@solana-mobile/mobile-wallet-adapter-protocol-web3js']
  },
  build: {
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
                id.includes('node_modules/@solana-mobile')) {
              const bufferPolyfill = `
                if (typeof window !== 'undefined') {
                  window.Buffer = window.Buffer || require('buffer/').Buffer;
                }
              `;
              return {
                code: `${bufferPolyfill}\n${code}`,
                map: null
              };
            }
            return null;
          }
        }
      ]
    }
  }
}));