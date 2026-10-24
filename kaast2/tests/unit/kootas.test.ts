/**
 * PL 7 compatibility (docs/specs/compatibility.md) on 80 synthetic Moon-star
 * pairs: the TypeScript port must equal the spec's Python restatement
 * (`pl_model`) case for case; PyJHora 4.8.7 is the independent check, and
 * the kootas where PL and PyJHora use the same rule (Bhakoot, Nadi,
 * Mahendra) must agree with it exactly. Every other difference is listed
 * in the spec, §9.
 */
import { describe, expect, it } from 'vitest';
import fixture from '../fixtures/compat_pyjhora.json';
import { ashtakoota, dashakoota, Koota, type KootaPerson } from '../../src/engine/match/kootas';

interface P { nak: number; sign: number; lon: number; deg_in_sign: number }
const kp = (p: P): KootaPerson => ({ nak: p.nak, sign: p.sign, lon: p.lon, degInSign: p.deg_in_sign });

describe('PL 7 compatibility on the 80 fixture pairs', () => {
  for (const c of fixture.cases) {
    it(`${c.id}: Ashtakoota, Dashakoota and BV Raman totals`, () => {
      const bride = kp(c.girl), groom = kp(c.boy);
      const a = ashtakoota(bride, groom);
      const by = Object.fromEntries(a.rows.map((r) => [r.id === 'maitri' ? 'graha_maitri' : r.id, r.score]));
      const want = c.pl_model.ashtakoota;
      expect({ ...by, total: a.total }).toEqual({ varna: want.varna, vashya: want.vashya, tara: want.tara, yoni: want.yoni, graha_maitri: want.graha_maitri, gana: want.gana, bhakoot: want.bhakoot, nadi: want.nadi, total: want.total });
      const d = dashakoota(bride, groom);
      const dk = c.pl_model.dashakoota;
      const s = Object.fromEntries([...d.rows, ...d.other].map((r) => [r.id, r.score]));
      expect(s).toEqual({ dina: dk.dina, gana: dk.gana, mahendra: dk.mahendra, stree: dk.stree_deergha, yoni: dk.yoni, rasi: dk.rasi,
        rasyadhipati: dk.rasyadhipati, vasya: dk.vasya, rajju: dk.rajju, vedha: dk.vedha, gender: dk.gender, gothra: dk.gothra, caste: dk.caste });
      expect(new Koota(bride, groom).dina(1)[1]).toBe(dk.dina_text_code);
      expect(d.total44).toBeCloseTo(dk.total_kalaprakasika_of_44, 9);
      expect(d.bvRaman36).toBeCloseTo(c.pl_model.total_bv_raman_of_36, 9);
      // Same rule in PL and PyJHora: must agree.
      expect(by.bhakoot).toBe(c.pyjhora.north.bhakoot);
      expect(by.nadi).toBe(c.pyjhora.north.nadi);
      expect(d.rows.find((r) => r.id === 'mahendra')!.score > 0).toBe(c.pyjhora.north.mahendra);
      expect(d.rows.find((r) => r.id === 'stree')!.score > 0).toBe(c.pyjhora.north.sthree_dheerga);
    });
  }
});
