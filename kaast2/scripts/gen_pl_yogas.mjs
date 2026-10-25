/**
 * docs/specs/pl_yogas.json (PL 7's "1001 Yogas", decoded) → two app data files:
 *  - src/engine/yoga/plYogaRules.json: id, name, category, polarity, the parsed
 *    condition tree (atom fields only), PL-decodable flag;
 *  - src/engine/yoga/plYogaText.json: PL's definition and first result sentence.
 * The text file is PL's own prose: keep it separate so a public release can
 * drop it (PLAN §11). Run: node scripts/gen_pl_yogas.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const src = JSON.parse(readFileSync(resolve(root, 'docs/specs/pl_yogas.json'), 'utf8'));
const KEEP = ['atom', 'neg', 'varga', 'ref', 'subj', 'rel', 'obj', 'obj_varga', 'quality', 'quality_varga', 'error'];
const slim = (n) => (n.atom !== undefined
  ? Object.fromEntries(KEEP.filter((k) => n[k] !== undefined).map((k) => [k, n[k]]))
  : { op: n.op, args: n.args.map(slim) });
const rules = src.yogas.map((y) => ({ id: y.id, name: y.name, category: y.category, polarity: y.polarity, formula: y.condition_pl, cond: slim(y.condition), decodable: y.pl_decodable }));
const text = Object.fromEntries(src.yogas.map((y) => [y.id, [y.definition ?? '', y.result_summary ?? '', y.classical_source ?? '']]));
writeFileSync(resolve(root, 'src/engine/yoga/plYogaRules.json'), JSON.stringify(rules));
writeFileSync(resolve(root, 'src/engine/yoga/plYogaText.json'), JSON.stringify(text));
console.log(`wrote ${rules.length} yogas`);
