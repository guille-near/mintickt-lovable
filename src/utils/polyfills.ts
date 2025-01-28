// Check if we're in a browser environment
if (typeof window !== 'undefined') {
  // Only set Buffer if it's not already defined
  if (!window.Buffer) {
    window.Buffer = require('buffer/').Buffer;
  }
}

export {};