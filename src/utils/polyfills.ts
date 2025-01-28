declare global {
  interface Window {
    process: any;
    global: typeof globalThis;
  }
}

if (typeof window !== 'undefined') {
  window.global = window;
  window.process = { env: {} };
}

export {};