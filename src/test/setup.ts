import "@testing-library/jest-dom";
import { vi, beforeEach } from "vitest";

// Mock Web APIs that might not be available in JSDOM
global.fetch = fetch;
global.Request = Request;
global.Response = Response;

// Mock Web APIs for testing
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
});

// Mock crypto.subtle for encryption testing
Object.defineProperty(window, "crypto", {
  writable: true,
  value: {
    subtle: {
      encrypt: () => Promise.resolve(new ArrayBuffer(8)),
      decrypt: () => Promise.resolve(new ArrayBuffer(8)),
      generateKey: () => Promise.resolve({}),
      importKey: () => Promise.resolve({}),
      exportKey: () => Promise.resolve(new ArrayBuffer(8)),
    },
    getRandomValues: (arr: any) => {
      for (let i = 0; i < arr.length; i++) {
        arr[i] = Math.floor(Math.random() * 256);
      }
      return arr;
    },
  },
});

// Console log setup for tests
beforeEach(() => {
  console.log = vi.fn();
  console.error = vi.fn();
  console.warn = vi.fn();
});
