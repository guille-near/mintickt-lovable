import { Buffer } from 'buffer';

declare global {
  interface Window {
    Buffer: typeof Buffer;
    process: any;
    global: any;
  }
}

const __global = typeof window !== 'undefined' ? window : global;

if (typeof window !== 'undefined') {
  window.Buffer = window.Buffer || Buffer;
  window.global = window;
  
  if (!window.process) {
    window.process = { env: {} };
  }
}

if (!__global.Buffer) {
  __global.Buffer = Buffer;
}

export {};