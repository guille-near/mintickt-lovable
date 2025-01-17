import { Buffer } from 'buffer';

declare global {
  interface Window {
    Buffer: typeof Buffer;
    process: any;
    global: typeof globalThis;
  }
}

if (typeof window !== 'undefined') {
  window.global = window;
  window.Buffer = Buffer;
  window.process = { env: {} };
}

export {};