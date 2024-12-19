import { Buffer } from 'buffer';

declare global {
  interface Window {
    Buffer: typeof Buffer;
    process: any; // Using any here since we only need a subset of the Node process
    global: any;
  }
}

const __global = typeof globalThis !== 'undefined' ? globalThis : (typeof window !== 'undefined' ? window : global);

if (!__global.Buffer) {
  __global.Buffer = Buffer;
}

if (typeof window !== 'undefined') {
  window.Buffer = __global.Buffer;
  window.global = __global;
}

if (!__global.process) {
  __global.process = { env: {} };
}

export {};