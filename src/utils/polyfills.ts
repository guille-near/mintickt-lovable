import { Buffer } from 'buffer';

declare global {
  interface Window {
    Buffer: typeof Buffer;
    process: NodeJS.Process;
    global: typeof globalThis;
  }
}

if (typeof window !== 'undefined') {
  window.Buffer = Buffer;
  window.global = window;
  if (!window.process) {
    window.process = {
      env: {},
    } as NodeJS.Process;
  }
}

export {};