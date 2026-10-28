#!/usr/bin/env node
// Runs every test suite in tests/suites against the built index.html.
//   node tests/run.js                 → all suites
//   node tests/run.js spawn ammo      → only suites whose file name contains one of the words
// Each suite loads the real game into Node with a fake browser (canvas, audio, storage) and prints
// PASS / FAIL lines plus a total. A suite passes when it prints no unexpected FAIL line and its total is clean.
const fs = require('fs'), path = require('path'), { spawnSync } = require('child_process');
const ROOT = path.join(__dirname, '..'), HTML = path.join(ROOT, 'index.html'), DIR = path.join(__dirname, 'suites');
// failures that were already there before the reorganisation and are being tracked separately
const KNOWN = {};
// random-chance checks that occasionally miss; a suite that only fails these is run again (up to 3 tries)
const FLAKY = { 'campaign.js': ['Rusty special ability used', 'Officer Ray special ability used'], 'balance-editor-and-test-switches.js': ['ground limit respected'], 'suburb.js': ['zombies reach the player in the house'] };
const want = process.argv.slice(2);
const files = fs.readdirSync(DIR).filter(f => f.endsWith('.js') && (!want.length || want.some(w => f.includes(w)))).sort();
let bad = 0; const t0 = Date.now();
function runOne(f) {
  const r = spawnSync(process.execPath, [path.join(DIR, f), HTML], { encoding: 'utf8', timeout: 20 * 60 * 1000, maxBuffer: 64 << 20 });
  const out = (r.stdout || '') + (r.stderr || ''), known = KNOWN[f] || [];
  const fails = out.split('\n').filter(l => /^FAIL\b/.test(l) && !known.some(k => l.includes(k)));
  const total = /TOTAL errors 0\b|TOTAL fails 0\b|FAILED 0\b|identical across screen sizes: (true,?)+\s*$/m.test(out) || (known.length && /TOTAL errors (\d+)/.test(out) && +RegExp.$1 <= known.length);
  return { r, out, known, fails, ok: r.status === 0 && !r.error && !fails.length && total };
}
for (const f of files) {
  const s = Date.now();let x = runOne(f), tries = 1;
  while (!x.ok && tries < 3 && x.fails.length && x.fails.every(l => (FLAKY[f] || []).some(k => l.includes(k)))) { x = runOne(f); tries++ }
  const { out, known, fails, ok } = x;
  if (!ok) bad++;
  console.log((ok ? 'ok   ' : 'FAIL ') + f.padEnd(42) + ((Date.now() - s) / 1000).toFixed(1).padStart(6) + 's' + (known.length ? '  (known: ' + known.join(', ') + ')' : '') + (tries > 1 ? '  (passed on try ' + tries + ')' : ''));
  if (!ok) { console.log(fails.slice(0, 10).map(l => '       ' + l).join('\n') || out.split('\n').slice(-8).map(l => '       ' + l).join('\n')); }
}
console.log((bad ? bad + ' suite(s) failed' : 'all ' + files.length + ' suites passed') + ' · ' + ((Date.now() - t0) / 1000).toFixed(0) + 's');
process.exit(bad ? 1 : 0);
