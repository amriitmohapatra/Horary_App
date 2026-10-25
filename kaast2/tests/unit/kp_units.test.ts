/** The 249 KP units and the horary number (B6 pp. 108–113, 239–241; KP6-001…009). */
import { describe, expect, it } from 'vitest';
import { KP_UNITS, horaryUnit } from '../../src/engine/kp/subs';
import { lordChain } from '../../src/engine/kp/lords';

/** Horary number → printed ascendant (arcsec), from B6's worked charts (b6_examples.json; nos. 90 and 237 left out: misprinted). */
const PRINTED: Record<string, number> = {"48": 247200, "74": 377600, "9": 41200, "246": 1272000, "72": 367600, "78": 401600, "29": 144000, "63": 324000, "21": 102400, "114": 582800, "188": 969200, "217": 1132000, "37": 189600, "171": 881200, "175": 905200, "247": 1274800, "100": 518400, "245": 1268000, "3": 10800, "139": 720000, "108": 550800, "156": 802400, "20": 98400, "132": 685600, "1": 0, "43": 222800, "57": 294400, "87": 445200, "147": 758000, "127": 657600, "203": 1053600, "47": 240000, "109": 558400, "71": 363600, "125": 648000, "5": 17200, "248": 1282000, "184": 957200, "144": 751600, "49": 253600, "17": 86400, "69": 353200, "249": 1288400, "19": 96000, "208": 1080000};

describe('KP units', () => {
  it('249 units, contiguous, covering the zodiac', () => {
    expect(KP_UNITS).toHaveLength(249);
    for (let i = 1; i < 249; i++) expect(KP_UNITS[i]!.start).toBe(KP_UNITS[i - 1]!.end);
    expect(KP_UNITS[0]!.start).toBe(0);
    expect(KP_UNITS[248]!.end).toBe(1_296_000);
  });
  it('each unit agrees with the app’s star/sub lords', () => {
    for (const u of KP_UNITS) {
      const mid = Math.floor((u.start + u.end) / 2);
      expect(lordChain(mid, 2)).toEqual([u.star, u.sub]);
      expect(Math.floor(u.start / 108000)).toBe(u.sign);
    }
  });
  it('horary numbers reproduce the ascendants printed in B6 (within 1′ of the printed rounding)', () => {
    for (const [n, asc] of Object.entries(PRINTED)) expect(Math.abs(horaryUnit(+n).start - asc), `no. ${n}`).toBeLessThanOrEqual(60);
  });
  it('B6’s text slips: no. 69 is a Venus sub; no. 184 starts at Sag 25°53′20″', () => {
    expect(horaryUnit(69).sub).toBe('Ve');
    expect(horaryUnit(184).start).toBe(8 * 108000 + 25 * 3600 + 53 * 60 + 20);
  });
});
