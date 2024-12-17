import { Buffer } from 'buffer';

// Ensure Buffer is available globally
if (typeof window !== 'undefined') {
  window.Buffer = window.Buffer || Buffer;
}

// Declare process as any to avoid TypeScript errors with the minimal process object
declare global {
  interface Window {
    Buffer: typeof Buffer;
    process: any;
  }
}

// Create a minimal process object for browser environment
if (typeof window !== 'undefined' && !window.process) {
  window.process = { env: {} };
}

// Ensure global is defined
if (typeof window !== 'undefined') {
  (window as any).global = window;
}

export {};