// Zustand persist needs a localStorage; the Node test environment has none.
// Import this file before any store so the stores can be tested as they run in the browser.
const data = new Map<string, string>();

const memoryStorage: Storage = {
  get length() {
    return data.size;
  },
  clear: () => data.clear(),
  getItem: (key) => (data.has(key) ? (data.get(key) as string) : null),
  key: (index) => Array.from(data.keys())[index] ?? null,
  removeItem: (key) => {
    data.delete(key);
  },
  setItem: (key, value) => {
    data.set(key, String(value));
  },
};

Object.defineProperty(globalThis, 'localStorage', {
  value: memoryStorage,
  configurable: true,
});

// Zustand persist reads window.localStorage by default, so expose a minimal window as well.
Object.defineProperty(globalThis, 'window', {
  value: { localStorage: memoryStorage },
  configurable: true,
});
