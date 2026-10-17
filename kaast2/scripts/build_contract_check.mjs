/**
 * Build contract check (PLAN.md §6, the v1.02 lesson: builds can silently
 * drop code). Run after `build` and `build:single`. Checks:
 *  1. the single file embeds the WASM and ephemeris data byte-for-byte;
 *  2. it references nothing outside itself (no http(s) src/href, no fetch of URLs);
 *  3. the site build ships the same WASM and data files;
 *  4. every t('key') used in the source exists in the i18n dictionary;
 *  5. the build carries its version stamp.
 */
import { createHash } from 'node:crypto';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const sha = (b) => createHash('sha256').update(b).digest('hex');
const fails = [];
const ok = (cond, msg) => { if (!cond) fails.push(msg); else console.log(`  ok  ${msg}`); };

const vendor = Object.fromEntries(['swisseph.wasm', 'swisseph.data'].map((f) => [f, readFileSync(join(root, 'vendor', f))]));
const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));

// 1–2, 5: single file
const singlePath = join(root, 'dist-single/index.html');
ok(existsSync(singlePath), 'single-file build exists');
if (existsSync(singlePath)) {
  const html = readFileSync(singlePath, 'utf8');
  const blobs = [...html.matchAll(/"([A-Za-z0-9+/]{100000,}={0,2})"/g)].map((m) => Buffer.from(m[1], 'base64'));
  for (const [name, bytes] of Object.entries(vendor)) {
    ok(blobs.some((b) => b.length === bytes.length && sha(b) === sha(bytes)), `single file embeds ${name} (${bytes.length} bytes, sha256 ${sha(bytes).slice(0, 12)}…)`);
  }
  const external = [...html.matchAll(/\b(?:src|href)\s*=\s*["'](https?:[^"']+)/gi)].map((m) => m[1]);
  ok(external.length === 0, `no external src/href (${external.slice(0, 3).join(', ') || 'none'})`);
  ok(!/fetch\(\s*["'`]https?:/i.test(html), 'no fetch() of absolute URLs');
  ok(!/<script[^>]+src=/i.test(html) && !/<link[^>]+rel=["']stylesheet["'][^>]+href=/i.test(html), 'all scripts and styles inlined');
  ok(html.includes(`"${pkg.version}"`), `version stamp ${pkg.version} present`);
  ok(html.includes('swisseph.data') || html.includes('/sweph'), 'ephemeris glue present');
}

// 3: site build
const assets = join(root, 'dist-site/assets');
if (existsSync(assets)) {
  const files = readdirSync(assets);
  for (const [name, bytes] of Object.entries(vendor)) {
    const ext = name.split('.').pop();
    const f = files.find((x) => x.endsWith(`.${ext}`) && statSync(join(assets, x)).size === bytes.length);
    ok(f && sha(readFileSync(join(assets, f))) === sha(bytes), `site build ships ${name}`);
  }
} else {
  console.log('  --  dist-site not built; skipping site checks');
}

// 4: i18n keys
const dict = JSON.parse(readFileSync(join(root, 'src/ui/i18n/en.json'), 'utf8'));
const walk = (d) => readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(join(d, e.name)) : [join(d, e.name)]));
const used = new Set();
for (const f of walk(join(root, 'src')).filter((f) => /\.(ts|tsx)$/.test(f))) {
  for (const m of readFileSync(f, 'utf8').matchAll(/\bt\(\s*'([a-zA-Z0-9_.]+)'/g)) used.add(m[1]);
  for (const m of readFileSync(f, 'utf8').matchAll(/title="([a-z]+\.[a-zA-Z0-9_.]+)"/g)) used.add(m[1]);
}
const missing = [...used].filter((k) => !(k in dict));
ok(missing.length === 0, `all ${used.size} literal i18n keys exist${missing.length ? ` — missing: ${missing.join(', ')}` : ''}`);

if (fails.length) {
  console.error(`\nCONTRACT CHECK FAILED (${fails.length}):\n - ${fails.join('\n - ')}`);
  process.exit(1);
}
console.log('\ncontract check passed');
