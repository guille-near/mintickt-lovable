import { Buffer } from 'buffer';

declare global {
  interface Window {
    Buffer: typeof Buffer;
    process: any;
    global: typeof globalThis;
  }
}

if (typeof window !== 'undefined') {
  if (!window.Buffer) window.Buffer = Buffer;
  if (!window.global) window.global = window;
  if (!window.process) window.process = { env: {} };
}

export {};