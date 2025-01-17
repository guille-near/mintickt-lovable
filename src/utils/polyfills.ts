// Import Buffer from the 'buffer' package correctly
import { Buffer as BufferPolyfill } from 'buffer';

declare global {
  interface Window {
    Buffer: typeof BufferPolyfill;
    process: any;
    global: typeof globalThis;
  }
}

// Only set these globals if they don't already exist
if (typeof window !== 'undefined') {
  if (!window.Buffer) window.Buffer = BufferPolyfill;
  if (!window.global) window.global = window;
  if (!window.process) window.process = { env: {} };
}

export {};