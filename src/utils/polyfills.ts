// We'll use a more controlled way to initialize Buffer
if (typeof window !== 'undefined' && !window.Buffer) {
  const { Buffer } = require('buffer/');
  window.Buffer = Buffer;
}

export {};