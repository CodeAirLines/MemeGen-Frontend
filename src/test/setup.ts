import '@testing-library/jest-dom/vitest';
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

// Automatically cleanup DOM and localStorage after each test
afterEach(() => {
  cleanup();
  if (typeof window !== 'undefined' && window.localStorage) {
    window.localStorage.clear();
  }
});

// Polyfill commonly needed jsdom browser methods for Canvas and media
if (typeof window !== 'undefined') {
  Object.defineProperty(window, 'scrollTo', {
    value: () => {},
    writable: true,
  });

  if (typeof Element !== 'undefined') {
    if (!Element.prototype.scrollIntoView) {
      Element.prototype.scrollIntoView = () => {};
    }
    if (!Element.prototype.scrollTo) {
      Element.prototype.scrollTo = () => {};
    }
  }

  if (!window.URL.createObjectURL) {
    window.URL.createObjectURL = () => 'blob:mock-blob-url';
  }

  if (!window.URL.revokeObjectURL) {
    window.URL.revokeObjectURL = () => {};
  }
}
