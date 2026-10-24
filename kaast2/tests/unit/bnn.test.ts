/**
 * Bhrigu Nandi Nadi rules against R. G. Rao's Chart 1 (Bhrigu Nandi Nadi,
 * pp. 9–13; docs/specs/nandi_nadi.md §3.7). Sign-level: these check the rules
 * are applied as Rao applies them, not that predictions come true.
 */
import { describe, expect, it } from 'vitest';
import { activations, bnn, contactOrder, type NatalPoint } from '../../src/engine/nadi/bnn';

// Mars (R) Aries; Rahu Gemini; Sun, Venus Virgo; Saturn, Mercury Libra; Moon, Ketu Sagittarius; Jupiter Capricorn.
const at = (sign: number, deg = 15) => sign * 30 + deg;
const CHART1: NatalPoint[] = [
  { id: 'Su', lonDeg: at(5, 10), retrograde: false }, { id: 'Mo', lonDeg: at(8, 10), retrograde: false },
  { id: 'Ma', lonDeg: at(0), retrograde: true }, { id: 'Me', lonDeg: at(6, 20), retrograde: false },
  { id: 'Ju', lonDeg: at(9), retrograde: false }, { id: 'Ve', lonDeg: at(5, 20), retrograde: false },
  { id: 'Sa', lonDeg: at(6, 10), retrograde: false }, { id: 'Ra', lonDeg: at(2), retrograde: true },
  { id: 'Ke', lonDeg: at(8), retrograde: true },
];

describe('BNN on Rao Chart 1', () => {
  const m = bnn(CHART1);
  const link = (a: string, b: string, kind: string) => m.links.find((l) => l.from === a && l.to === b && l.kind === kind);
  it('X1: Mercury and Venus have exchanged signs', () => {
    expect(m.exchanges).toEqual([['Me', 'Ve']]);
  });
  it('L2: Saturn in the second to the Sun', () => { expect(link('Su', 'Sa', 'ahead')?.viaRetro).toEqual([]); });
  it('L3: Saturn aspected directly by Mars', () => { expect(link('Sa', 'Ma', 'opposite')).toBeTruthy(); });
  it('L2: the Moon behind Jupiter (elder sister)', () => { expect(link('Ju', 'Mo', 'behind')).toBeTruthy(); });
  it('R1: retrograde Mars also acts from Pisces', () => {
    expect(m.rows.find((r) => r.id === 'Ma')!.alsoFrom).toBe(11);
  });
  it('L3n: Rahu and Ketu are never "opposite" each other', () => {
    expect(link('Ra', 'Ke', 'opposite')).toBeUndefined();
  });
  it('R1 + T1: transiting Jupiter in Pisces activates natal Mars through its retrogression', () => {
    const a = activations(CHART1, { Ju: { lonDeg: at(11), retrograde: false }, Sa: { lonDeg: at(3), retrograde: false } });
    expect(a.find((x) => x.by === 'Ju' && x.natal === 'Ma' && x.kind === 'contact')).toMatchObject({ viaRetro: true });
  });
  it('T7: signs ahead of Jupiter meet Mars, Rahu, Sun+Venus, Saturn+Mercury in that order', () => {
    expect(contactOrder(CHART1, 'Ju').slice(0, 6)).toEqual(['Ma', 'Ra', 'Su', 'Ve', 'Sa', 'Me']);
  });
});
