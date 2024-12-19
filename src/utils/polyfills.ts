import { Buffer } from 'buffer';

declare global {
  interface Window {
    Buffer: typeof Buffer;
    process: any;
    global: any;
  }
}

if (typeof window !== 'undefined') {
  window.Buffer = Buffer;
  window.global = window;
  
  if (!window.process) {
    window.process = { env: {} };
  }
}

export {};