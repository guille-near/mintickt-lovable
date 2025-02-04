import { Buffer } from 'buffer';

// Only set Buffer if it's not already defined in the global scope
if (typeof window !== 'undefined' && !window.Buffer) {
  window.Buffer = Buffer;
}

export {};