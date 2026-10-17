import type { SweFactory } from '../engine/ephem/swisseph';

/**
 * The vendor glue is a classic script that defines `async function Swisseph`.
 * Evaluating its source in a function scope gives the factory without
 * globals or module-system assumptions, identically in browser and Node.
 */
export function factoryFromGlue(source: string): SweFactory {
  return new Function(`${source}\nreturn Swisseph;`)() as SweFactory;
}
