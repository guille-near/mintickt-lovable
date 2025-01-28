import { Buffer } from 'buffer';

// Only declare the Buffer type if it doesn't exist
declare global {
  interface Window {
    Buffer: typeof Buffer;
  }
}

// Only set Buffer on window if it doesn't already exist
if (typeof window !== 'undefined' && !window.Buffer) {
  window.Buffer = Buffer;
}

export {};