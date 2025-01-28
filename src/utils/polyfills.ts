// Only polyfill Buffer if it doesn't exist
if (typeof window !== 'undefined' && !window.Buffer) {
  const { Buffer } = require('buffer');
  window.Buffer = Buffer;
}

export {};