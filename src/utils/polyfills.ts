// Only set Buffer if it's not already defined
if (typeof window !== 'undefined' && !window.Buffer) {
  window.Buffer = require('buffer').Buffer;
}

export {};