import { Buffer } from 'buffer';

declare global {
  interface Window {
    Buffer: typeof Buffer;
    process: any;
    global: any;
  }
}

if (typeof globalThis !== 'undefined') {
  if (!globalThis.Buffer) {
    globalThis.Buffer = Buffer;
  }
  if (typeof window !== 'undefined') {
    window.Buffer = globalThis.Buffer;
    window.global = globalThis;
    if (!window.process) {
      window.process = { env: {} };
    }
  }
}

export {};