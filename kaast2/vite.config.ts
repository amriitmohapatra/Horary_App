/// <reference types="vitest/config" />
import { defineConfig, type Plugin } from 'vite';
import preact from '@preact/preset-vite';
import { viteSingleFile } from 'vite-plugin-singlefile';
import { readFileSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { resolve } from 'node:path';

const root = import.meta.dirname;
const pkg = JSON.parse(readFileSync(resolve(root, 'package.json'), 'utf8'));

/**
 * `virtual:ephemeris-assets` — the one place that knows how the Swiss
 * Ephemeris WASM and data reach the browser (ARCHITECTURE.md §5).
 *   single : base64 strings inlined into the HTML (offline, file://)
 *   site/dev: URLs of files emitted next to the page (Vercel, Tauri)
 */
function ephemerisAssets(mode: string): Plugin {
  const id = 'virtual:ephemeris-assets';
  const rid = '\0' + id;
  const vendor = resolve(root, 'vendor');
  return {
    name: 'kaast2-ephemeris-assets',
    resolveId: (s) => (s === id ? rid : undefined),
    load(i) {
      if (i !== rid) return;
      if (mode === 'single') {
        const b64 = (f: string) => JSON.stringify(readFileSync(resolve(vendor, f)).toString('base64'));
        return `export const kind = 'embedded';
export const wasm = ${b64('swisseph.wasm')};
export const data = ${b64('swisseph.data')};`;
      }
      return `import wasmUrl from '/vendor/swisseph.wasm?url';
import dataUrl from '/vendor/swisseph.data?url';
export const kind = 'fetch';
export const wasm = wasmUrl;
export const data = dataUrl;`;
    },
  };
}

function gitCommit(): string {
  try { return execSync('git rev-parse --short HEAD', { cwd: root }).toString().trim(); }
  catch { return 'unknown'; }
}

export default defineConfig(({ mode }) => ({
  plugins: [preact(), ephemerisAssets(mode), ...(mode === 'single' ? [viteSingleFile()] : [])],
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version),
    __BUILD_COMMIT__: JSON.stringify(gitCommit()),
    __BUILD_MODE__: JSON.stringify(mode === 'single' ? 'single' : 'site'),
  },
  build: {
    outDir: mode === 'single' ? 'dist-single' : 'dist-site',
    emptyOutDir: true,
    target: 'es2020',
    assetsInlineLimit: mode === 'single' ? Number.MAX_SAFE_INTEGER : 4096,
  },
  test: {
    include: ['tests/unit/**/*.test.ts', 'tests/engine/**/*.test.ts'],
    environment: 'node',
    testTimeout: 60_000,
  },
}));
