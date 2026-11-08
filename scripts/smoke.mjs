import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const page = 'file://' + path.join(root, 'test', 'smoke.html');
const bins = ['chromium', 'chromium-browser', 'google-chrome'];
const args = ['--headless', '--disable-gpu', '--no-sandbox', '--window-size=360,900', '--virtual-time-budget=8000', '--dump-dom', page];

let out = '';
let lastError = null;
for (const bin of bins) {
  try {
    out = execFileSync(bin, args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
    lastError = null;
    break;
  } catch (err) {
    lastError = err;
  }
}

if (!out) {
  console.error(lastError ? String(lastError.message || lastError) : 'No Chromium binary found');
  process.exit(1);
}

if (!out.includes('SMOKE_PASS')) {
  const fail = out.match(/SMOKE_FAIL[\s\S]{0,1200}/);
  console.error(fail ? fail[0] : out.slice(-2000));
  process.exit(1);
}

console.log('smoke: PASS');
