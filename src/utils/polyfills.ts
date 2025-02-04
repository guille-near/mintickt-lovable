import { Buffer } from 'buffer';

// Polyfill Buffer for the browser environment
if (typeof window !== 'undefined') {
  window.Buffer = Buffer;
  window.global = window;
}