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

/**
 * A real PL 7.0.1 printout (Ashtkoot Guna Chart and Dashkoota Guna Chart, sent
 * by the boss 2026-10-24). Only the two Moon stars are kept: groom (PL's first
 * column) Shatabhisha pada 2, Aquarius; bride Dhanishta pada 2, Capricorn.
 */
describe('PL 7.0.1 printout: Shatabhisha-2 groom, Dhanishta-2 bride', () => {
  const mid = (nak: number, pada: number) => (nak - 1) * (360 / 27) + (pada - 0.5) * (360 / 108);
  const person = (nak: number, pada: number): KootaPerson => {
    const lon = mid(nak, pada);
    return { nak, sign: Math.floor(lon / 30) + 1, lon, degInSign: lon % 30 };
  };
  const groom = person(24, 2), bride = person(23, 2);
  it('Ashtakoot rows, total 23.5, "good", Bhakoot Maha Dosha', () => {
    const a = ashtakoota(bride, groom);
    expect(a.rows.map((r) => [r.id, r.score])).toEqual([
      ['varna', 0], ['vashya', 0.5], ['tara', 3], ['yoni', 1], ['maitri', 5], ['gana', 6], ['bhakoot', 0], ['nadi', 8]]);
    expect(a.total).toBe(23.5);
    expect(a.band).toBe('good');
    expect(a.rows.filter((r) => r.dosha).map((r) => r.id)).toEqual(['bhakoot']);
    expect(a.rows.map((r) => [r.groom, r.bride])).toEqual([
      ['Shudra', 'Vaishya'], ['Manava', 'Jalachara'], ['Parama Mitra', 'Sampat'], ['Ashwa', 'Simha'],
      ['Saturn', 'Saturn'], ['Rakshasa', 'Rakshasa'], ['Aquarius', 'Capricorn'], ['Adya', 'Madhya']]);
  });
  it('Dashakoota rows and the three totals 29/44, 25/36, 23.5/36', () => {
    const d = dashakoota(bride, groom);
    expect([...d.rows, ...d.other].map((r) => [r.id, r.score, r.word])).toEqual([
      ['dina', 3, 'Auspicious'], ['gana', 6, 'Auspicious'], ['mahendra', 0, 'Inauspicious'], ['stree', 0, 'Inauspicious'],
      ['yoni', 2, 'Average'], ['rasi', 3.5, 'Average'], ['rasyadhipati', 5, 'Auspicious'], ['vasya', 2, 'Auspicious'],
      ['rajju', 4, 'Average'], ['vedha', 1, 'Average'], ['gender', 0.5, 'Average'], ['gothra', 1, 'Auspicious'], ['caste', 1, 'Auspicious']]);
    expect([d.total44, d.bvRaman36, d.ashtakoota36]).toEqual([29, 25, 23.5]);
    expect([...d.rows, ...d.other].map((r) => [r.groom, r.bride])).toEqual([
      ['Shatabhishak', 'Dhanishta'], ['Rakshasa', 'Rakshasa'], ['Shatabhishak', 'Dhanishta'], ['Shatabhishak', 'Dhanishta'],
      ['Ashwa', 'Simha'], ['Aquarius', 'Capricorn'], ['Saturn', 'Saturn'], ['Aquarius', 'Capricorn'], ['Kanta', 'Siro'],
      ['Shatabhishak', 'Dhanishta'], ['Hermaphrodite nak.', 'Female nak.'], ['Shatabhishak', 'Dhanishta'], ['Shudra', 'Vaishya']]);
  });
});
