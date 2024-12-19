import { Buffer } from 'buffer';

declare global {
  interface Window {
    Buffer: typeof Buffer;
    process: any;
    global: any;
  }
}

if (typeof window !== 'undefined') {
  if (!window.global) window.global = window;
  if (!window.Buffer) window.Buffer = Buffer;
  if (!window.process) window.process = { env: {} };
}

export {};