/// <reference types="vite/client" />
declare const __APP_VERSION__: string;
declare const __BUILD_COMMIT__: string;
declare const __BUILD_MODE__: 'single' | 'site';

declare module 'virtual:ephemeris-assets' {
  /** 'embedded': wasm/data are base64 strings. 'fetch': they are URLs. */
  export const kind: 'embedded' | 'fetch';
  export const wasm: string;
  export const data: string;
}

declare module 'virtual:swisseph-glue' {
  import type { SweFactory } from './engine/ephem/swisseph';
  const Swisseph: SweFactory;
  export default Swisseph;
}
