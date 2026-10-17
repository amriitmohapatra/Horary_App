/**
 * Typed adapter over the Swiss Ephemeris 2.10.03 WASM module (the patched
 * classic-script glue from Advanced_Setup). How the module is loaded is the
 * boot layer's business (ARCHITECTURE.md §5); the engine only sees this class.
 */

export interface SweModule {
  ccall(name: string, ret: 'number' | 'string' | null, argTypes: string[], args: unknown[]): any;
  _malloc(bytes: number): number;
  HEAPF64: Float64Array;
}

export type SweFactory = (opts: {
  wasmBinary: ArrayBuffer;
  getPreloadedPackage: () => ArrayBuffer;
  locateFile: (f: string) => string;
}) => Promise<SweModule>;

export interface EphemerisBlobs { wasm: ArrayBuffer; data: ArrayBuffer }

export const SE = {
  SUN: 0, MOON: 1, MERCURY: 2, VENUS: 3, MARS: 4, JUPITER: 5, SATURN: 6,
  MEAN_NODE: 10, TRUE_NODE: 11,
  FLG_SWIEPH: 2, FLG_SPEED: 256, FLG_NONUT: 64, FLG_SIDEREAL: 65536,
  SIDM_LAHIRI: 1, SIDM_USER: 255,
} as const;

export interface BodyRaw { lon: number; lat: number; dist: number; lonSpeed: number }
export interface HousesRaw { cusps: number[]; asc: number; mc: number; armc: number }

export class SwissEph {
  private readonly xx: number;
  private readonly serr: number;
  private readonly cuspBuf: number;
  private readonly ascmcBuf: number;

  constructor(private readonly m: SweModule) {
    m.ccall('swe_set_ephe_path', null, ['string'], ['/sweph']);
    this.xx = m._malloc(6 * 8);
    this.serr = m._malloc(256);
    this.cuspBuf = m._malloc(13 * 8);
    this.ascmcBuf = m._malloc(10 * 8);
  }

  version(): string {
    return this.m.ccall('swe_version', 'string', ['number'], [this.serr]);
  }

  /** Delta-T in seconds (Swiss modern model). */
  deltaTsec(jdUT: number): number {
    return this.m.ccall('swe_deltat', 'number', ['number'], [jdUT]) * 86400;
  }

  calc(jdTT: number, body: number, flags: number): BodyRaw {
    const rc = this.m.ccall('swe_calc', 'number', ['number', 'number', 'number', 'number', 'number'],
      [jdTT, body, flags, this.xx, this.serr]);
    if (rc < 0) throw new Error(`swe_calc(${body}) failed: ${this.errText()}`);
    const h = this.m.HEAPF64, o = this.xx / 8;
    return { lon: h[o]!, lat: h[o + 1]!, dist: h[o + 2]!, lonSpeed: h[o + 3]! };
  }

  setSidMode(mode: number, t0 = 0, ayanT0 = 0): void {
    this.m.ccall('swe_set_sid_mode', null, ['number', 'number', 'number'], [mode, t0, ayanT0]);
  }

  /** Ayanamsa of the current sidereal mode (mean equinox), degrees. */
  ayanamsa(jdTT: number): number {
    return this.m.ccall('swe_get_ayanamsa', 'number', ['number'], [jdTT]);
  }

  houses(jdUT: number, flags: number, latDeg: number, lonDeg: number, hsys: string): HousesRaw {
    const rc = this.m.ccall('swe_houses_ex', 'number',
      ['number', 'number', 'number', 'number', 'number', 'number', 'number'],
      [jdUT, flags, latDeg, lonDeg, hsys.charCodeAt(0), this.cuspBuf, this.ascmcBuf]);
    if (rc < 0) throw new Error(`swe_houses_ex failed (latitude ${latDeg})`);
    const h = this.m.HEAPF64, c = this.cuspBuf / 8, a = this.ascmcBuf / 8;
    const cusps: number[] = [];
    for (let i = 1; i <= 12; i++) cusps.push(h[c + i]!);
    return { cusps, asc: h[a]!, mc: h[a + 1]!, armc: h[a + 2]! };
  }

  private errText(): string {
    const h = new Uint8Array((this.m.HEAPF64 as Float64Array).buffer, this.serr, 256);
    let s = '';
    for (const b of h) { if (!b) break; s += String.fromCharCode(b); }
    return s;
  }
}

/** Boot the WASM module from raw bytes with a given glue factory. */
export async function createSwissEph(factory: SweFactory, blobs: EphemerisBlobs): Promise<SwissEph> {
  const module = await factory({
    wasmBinary: blobs.wasm,
    getPreloadedPackage: () => blobs.data,
    locateFile: (f) => f,
  });
  return new SwissEph(module);
}
