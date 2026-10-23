#!/usr/bin/env node
// Zombdash build: joins src/ into one self-contained index.html (no dependencies, Node 16+).
//   node tools/build.js            → writes index.html at the repo root
//   node tools/build.js --check    → only checks that index.html is up to date with src/
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..'), SRC = path.join(ROOT, 'src');
const read = p => fs.readFileSync(path.join(SRC, p), 'utf8');
// every source file ends with one newline that isn't part of the game
const body = t => t.endsWith('\n') ? t.slice(0, -1) : t;
// "//# ..." lines at the very top of a module are notes for people, not part of the game
const strip = t => { const L = t.split('\n'); let i = 0; while (i < L.length && L[i].startsWith('//#')) i++; return L.slice(i).join('\n'); };
function asset(name) {
  const p = path.join(SRC, 'assets', name);
  if (!fs.existsSync(p)) throw new Error('missing asset src/assets/' + name);
  return fs.readFileSync(p).toString('base64');
}
// a JSON file from src/ (for example src/maps/*.json), checked and written into the game as a JS value
function json(name) {
  const p = path.join(SRC, name);
  if (!fs.existsSync(p)) throw new Error('missing src/' + name);
  try { return JSON.stringify(JSON.parse(fs.readFileSync(p, 'utf8'))).replace(/<\//g, '<\\/'); } catch (e) { throw new Error('src/' + name + ' is not valid JSON: ' + e.message); }
}
function build() {
  const list = read('js/modules.txt').split('\n').map(l => l.trim()).filter(l => l && !l.startsWith('#'));
  const seen = new Set();
  const mods = list.map(f => {
    if (seen.has(f)) throw new Error('module listed twice: ' + f); seen.add(f);
    return strip(body(read('js/' + f)));
  });
  // a module on disk but missing from modules.txt is almost always a mistake
  const all = []; (function walk(d, rel) { for (const e of fs.readdirSync(d, { withFileTypes: true })) { const r = rel ? rel + '/' + e.name : e.name; if (e.isDirectory()) walk(path.join(d, e.name), r); else if (r.endsWith('.js') && r !== 'early-error-screen.js') all.push(r) } })(path.join(SRC, 'js'), '');
  const extra = all.filter(f => !seen.has(f));
  if (extra.length) throw new Error('not listed in src/js/modules.txt: ' + extra.join(', '));
  const game = mods.join('\n').replace(/\{\{asset:([^}]+)\}\}/g, (_, n) => asset(n)).replace(/\{\{json:([^}]+)\}\}/g, (_, n) => json(n));
  return read('index.html').replace('{{CSS}}', () => body(read('css/game.css')))
    .replace('{{EARLY}}', () => body(read('js/early-error-screen.js')))
    .replace('{{GAME}}', () => game);
}
const out = build(), target = path.join(ROOT, 'index.html');
if (process.argv.includes('--check')) {
  const cur = fs.existsSync(target) ? fs.readFileSync(target, 'utf8') : '';
  if (cur !== out) { console.error('index.html is NOT up to date with src/ (run: node tools/build.js)'); process.exit(1); }
  console.log('index.html is up to date'); process.exit(0);
}
fs.writeFileSync(target, out);
console.log('built index.html · ' + (out.length / 1024 / 1024).toFixed(2) + ' MB');
