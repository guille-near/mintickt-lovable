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
    }
  },
  build: {
    rollupOptions: {
      plugins: [
        // Polyfill Node.js globals
        {
          name: 'polyfill-node-globals',
          transform(code, id) {
            if (id.includes('node_modules/@solana') || id.includes('node_modules/@project-serum')) {
              return {
                code: `
                  import { Buffer } from 'buffer';
                  if (typeof window !== 'undefined') {
                    window.Buffer = Buffer;
                  }
                  ${code}
                `,
                map: null
              };
            }
          }
        }
      ]
    }
  }
}));