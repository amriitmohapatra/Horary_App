/** Boot the Swiss Ephemeris WASM in Node for engine tests (same blobs as the app). */
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { resolve } from 'node:path';
import { createSwissEph, type SwissEph } from '../../src/engine/ephem/swisseph';
import { factoryFromGlue } from '../../src/boot/glue';

const vendor = resolve(import.meta.dirname, '../../vendor');
let cached: Promise<SwissEph> | null = null;

const buf = (f: string) => {
  const b = readFileSync(resolve(vendor, f));
  return b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength) as ArrayBuffer;
};

export function bootNode(): Promise<SwissEph> {
  if (!cached) {
    const require = createRequire(import.meta.url);
    (globalThis as any).__kaast_require = require;
    const factory = factoryFromGlue(readFileSync(resolve(vendor, 'swisseph_glue.js'), 'utf8'));
    cached = createSwissEph(factory, { wasm: buf('swisseph.wasm'), data: buf('swisseph.data') });
  }
  return cached;
}
