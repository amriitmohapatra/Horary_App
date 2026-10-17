/**
 * EphemerisLoader — "an interface is a shared promise" (ARCHITECTURE.md §5).
 * EmbeddedLoader: base64 blobs inlined by the single-file build (file://, offline).
 * FetchLoader: files served next to the page (Vercel, Tauri asset protocol).
 * The engine never knows which one ran.
 */
import * as assets from 'virtual:ephemeris-assets';
import glueSource from '../../vendor/swisseph_glue.js?raw';
import { createSwissEph, type EphemerisBlobs, type SwissEph } from '../engine/ephem/swisseph';
import { factoryFromGlue } from './glue';

export interface EphemerisLoader {
  readonly kind: 'embedded' | 'fetch';
  load(): Promise<EphemerisBlobs>;
}

function base64ToBuffer(b64: string): ArrayBuffer {
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out.buffer;
}

export class EmbeddedLoader implements EphemerisLoader {
  readonly kind = 'embedded' as const;
  constructor(private readonly wasmB64: string, private readonly dataB64: string) {}
  async load(): Promise<EphemerisBlobs> {
    return { wasm: base64ToBuffer(this.wasmB64), data: base64ToBuffer(this.dataB64) };
  }
}

export class FetchLoader implements EphemerisLoader {
  readonly kind = 'fetch' as const;
  constructor(private readonly wasmUrl: string, private readonly dataUrl: string) {}
  async load(): Promise<EphemerisBlobs> {
    const get = async (u: string) => {
      const r = await fetch(u);
      if (!r.ok) throw new Error(`could not load ${u} (${r.status})`);
      return r.arrayBuffer();
    };
    const [wasm, data] = await Promise.all([get(this.wasmUrl), get(this.dataUrl)]);
    return { wasm, data };
  }
}

export function defaultLoader(): EphemerisLoader {
  return assets.kind === 'embedded'
    ? new EmbeddedLoader(assets.wasm, assets.data)
    : new FetchLoader(assets.wasm, assets.data);
}

export interface BootResult { swe: SwissEph; loader: EphemerisLoader['kind']; ms: number }

export async function bootEphemeris(loader: EphemerisLoader = defaultLoader()): Promise<BootResult> {
  const t0 = performance.now();
  const swe = await createSwissEph(factoryFromGlue(glueSource), await loader.load());
  return { swe, loader: loader.kind, ms: Math.round(performance.now() - t0) };
}
