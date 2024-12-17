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
      "buffer": "buffer",  // Add explicit buffer resolution
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
    include: ['buffer', '@solana/web3.js', '@solana/spl-token', '@project-serum/anchor']  // Include all Solana-related packages
  },
  build: {
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    rollupOptions: {
      plugins: [
        {
          name: 'polyfill-node-globals',
          transform(code, id) {
            if (id.includes('node_modules/@solana') || 
                id.includes('node_modules/@project-serum') || 
                id.includes('node_modules/@solana-mobile')) {
              // Only inject Buffer polyfill once at the start of Solana-related files
              if (!code.includes('import { Buffer }')) {
                return {
                  code: `
                    import { Buffer } from 'buffer';
                    if (typeof window !== 'undefined' && !window.Buffer) {
                      window.Buffer = Buffer;
                    }
                    ${code}
                  `,
                  map: null
                };
              }
            }
            return null;
          }
        }
      ]
    }
  }
}));