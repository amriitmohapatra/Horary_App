/**
 * Copy the single-file build to dist/KAAST 2 v<major.minor>.html.
 * Shipped files are never overwritten (invariant 11): bump package.json
 * "version" to ship a new file. Pass --force only to rebuild an UNSHIPPED
 * version during the same slice.
 */
import { copyFileSync, existsSync, readFileSync, statSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const { version } = JSON.parse(readFileSync(resolve(root, 'package.json'), 'utf8'));
const short = version.split('.').slice(0, 2).join('.');
const src = resolve(root, 'dist-single/index.html');
const dst = resolve(root, `dist/KAAST 2 v${short}.html`);
const force = process.argv.includes('--force');

if (existsSync(dst) && !force) {
  console.error(`refusing to overwrite shipped file: ${dst}\nbump "version" in package.json for a new release`);
  process.exit(1);
}
copyFileSync(src, dst);
console.log(`built ${dst} (${Math.round(statSync(dst).size / 1024)} KB)`);
