#!/usr/bin/env node
// Zombdash map checker: reads custom map files (*.zombdash-map.json) the way the game does and reports what is wrong.
//   node tools/check-map.js map.json [more.json ...]     → a report per file; exit code 1 when a file has errors
//   node tools/check-map.js --strict map.json            → warnings count as errors too
//   node tools/check-map.js --json map.json              → the results as JSON
// It runs the real game code from the built index.html (run `node tools/build.js` after changing src/), so every terrain,
// prop, vehicle, decal, effect, area, path, wall style and special feature it knows is exactly what the game knows.
// Errors: the game refuses the file. Warnings: it loads, but something won't show up or won't work (missing assets, spawns
// zombies can't walk from, things outside the map, misspelt options...). Notes: worth a look.
const fs = require('fs'), path = require('path');
const args = process.argv.slice(2), strict = args.includes('--strict'), asJson = args.includes('--json'), files = args.filter(a => !a.startsWith('--'));
if (!files.length) { console.log('usage: node tools/check-map.js [--strict] [--json] map.json [more.json ...]'); process.exit(2); }
const HTML = path.join(__dirname, '..', 'index.html');
if (!fs.existsSync(HTML)) { console.error('index.html not found: run node tools/build.js first'); process.exit(2); }
// ----- a quiet fake browser, just enough for the game to load (no drawing, no sound) -----
const html = fs.readFileSync(HTML, 'utf8'), code = html.slice(html.lastIndexOf('<script>') + 8, html.lastIndexOf('</script>'));
global.ImageData = class { constructor(d) { this.data = d } };
const ctx = new Proxy({}, { get: (t, k) => k == 'getImageData' ? (x, y, w, h) => ({ data: new Uint8ClampedArray(Math.max(1, w * h * 4)) }) : k == 'createImageData' ? (w, h) => ({ data: new Uint8ClampedArray(w * h * 4) }) : k == 'measureText' ? t => ({ width: String(t || '').length * 7 }) : k == 'getTransform' ? () => ({ a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 }) : () => {}, set: () => true });
const mkEl = () => ({ style: { setProperty() {} }, dataset: {}, innerHTML: '', className: '', classList: { add() {}, remove() {}, toggle() {}, contains() { return false } }, getContext: () => ctx, toDataURL: () => '', addEventListener() {}, remove() {}, appendChild() {}, querySelector() { return null }, querySelectorAll() { return [] }, width: 0, height: 0 });
const els = {};
global.document = { hidden: false, getElementById: id => els[id] || (els[id] = mkEl()), createElement: () => mkEl(), addEventListener() {}, body: mkEl() };
global.innerWidth = 1280; global.innerHeight = 800; global.addEventListener = () => {}; global.localStorage = {}; global.requestAnimationFrame = () => {};
global.Image = class { constructor() { this.complete = true; this.naturalWidth = 1 } addEventListener() {} };
global.performance = { now: () => 0 };
const P_ = () => ({ value: 0, setValueAtTime() {}, linearRampToValueAtTime() {}, exponentialRampToValueAtTime() {}, setTargetAtTime() {} });
const node = () => ({ connect() {}, disconnect() {}, start() {}, stop() {}, frequency: P_(), gain: P_(), detune: P_(), Q: P_(), pan: P_(), threshold: P_(), ratio: P_(), type: '', setPeriodicWave() {}, buffer: null, loop: false });
global.AudioContext = class { constructor() { this.state = 'running'; this.sampleRate = 8000; this.destination = {} } get currentTime() { return 0 } createGain() { return node() } createOscillator() { return node() } createBiquadFilter() { return node() } createBufferSource() { return node() } createStereoPanner() { return node() } createDynamicsCompressor() { return node() } createPeriodicWave() { return {} } createBuffer(c, l) { return { getChannelData: () => new Float32Array(l) } } resume() { return Promise.resolve() } };
global.setInterval = () => 0; global.setTimeout = () => 0; global.clearTimeout = () => {}; global.clearInterval = () => {};
const quiet = console.log, qe = console.error, qw = console.warn; console.log = console.error = console.warn = () => {};
let G;
try { G = new Function(code + '\n;return {cmRead,cmLint,cmWrite,CMTI,CMOI,CMWI,OB,HWV,CMDI,CMAI,CMPAI,CMFXI,CMFEI,cmOB,cmHW,cmArea,cmPath,cmDec,cmFx,cmFeat,EDVTX}')(); }
finally { console.log = quiet; console.error = qe; console.warn = qw; }
// ----- checks beyond what the loader says -----
function extra(j, doc) {
  const W = [], N = [], own = (o, k) => Object.prototype.hasOwnProperty.call(o || {}, k);
  const ids = {}; for (const sec of ['props', 'vehicles', 'walls', 'decals', 'effects', 'areas', 'paths', 'features']) for (const p of Array.isArray(j[sec]) ? j[sec] : []) if (p && typeof p.id == 'string') ids[p.id] = (ids[p.id] || 0) + 1;
  const dup = Object.keys(ids).filter(k => ids[k] > 1); if (dup.length) W.push('Ids used more than once (the copies get new ids): ' + dup.slice(0, 8).join(', '));
  const colour = (sec, i, k, v) => { if (v != null && !(typeof v == 'string' && /^#[0-9a-f]{6}$/i.test(v))) W.push('"' + sec + '[' + i + '].' + k + '" is not a #rrggbb colour, so it is ignored.') };
  const opts = (sec, i, p, T) => { if (!p.options || !T) return; const known = (T.opts || []).map(q => q[0]); for (const k of Object.keys(p.options)) if (!known.includes(k)) W.push('"' + sec + '[' + i + '].options.' + k + '" is not an option of ' + T.n + (known.length ? ' (it has: ' + known.join(', ') + ')' : ' (it has none)') + '.');
    for (const q of T.opts || []) { const v = p.options[q[0]]; if (v == null) continue; if (Array.isArray(q[2]) && Array.isArray(q[2][0]) && !q[2].some(c => String(c[0]) === String(v))) W.push('"' + sec + '[' + i + '].options.' + q[0] + '" is "' + v + '"; ' + T.n + ' takes ' + q[2].map(c => '"' + c[0] + '"').join(', ') + '.'); else if (Array.isArray(q[2]) && !Array.isArray(q[2][0]) && (typeof v != 'number' || v < q[2][0] || v > q[2][1])) W.push('"' + sec + '[' + i + '].options.' + q[0] + '" should be a number from ' + q[2][0] + ' to ' + q[2][1] + '.') } };
  const text = (sec, i, p, max) => { if (typeof p.text != 'string') return; if (!max) W.push('"' + sec + '[' + i + '].text": ' + (p.kind || 'this') + ' shows no text.'); else if (p.text.length > max) W.push('"' + sec + '[' + i + '].text" is ' + p.text.length + ' characters; only the first ' + max + ' show.') };
  (j.props || []).forEach((p, i) => { if (!p) return; const B = G.cmOB(p.kind); colour('props', i, 'color', p.color); if (B && p.color && !B.pc) N.push('"props[' + i + ']" (' + p.kind + ') has a colour, but that prop comes in one look.'); if (B) text('props', i, p, B.txt) });
  (j.vehicles || []).forEach((p, i) => { if (!p) return; if (p.text != null) text('vehicles', i, p, G.EDVTX[p.kind] || 0) });
  (j.decals || []).forEach((p, i) => { if (!p) return; const T = G.cmDec(p.kind); colour('decals', i, 'color', p.color); if (T) { text('decals', i, p, T.txt || 0); if (p.color && !T.pal) N.push('"decals[' + i + ']" (' + p.kind + ') has a colour, but that decal comes in one look.') } if (T && T.opts) opts('decals', i, p, T); else if (p.options) W.push('"decals[' + i + '].options": ' + (T ? T.n + ' has no options.' : 'decals have no options.')); if (p.scale != null && (p.scale < .25 || p.scale > 4)) W.push('"decals[' + i + '].scale" is kept between 0.25 and 4.') });
  (j.effects || []).forEach((p, i) => { if (!p) return; const T = G.cmFx(p.kind); colour('effects', i, 'color', p.color); if (T) opts('effects', i, p, T) });
  (j.areas || []).forEach((p, i) => { if (!p) return; const T = G.cmArea(p.kind); colour('areas', i, 'color', p.color); colour('areas', i, 'color2', p.color2); if (!T) return; opts('areas', i, p, T); text('areas', i, p, T.txt || 0); if (T.min && (p.w < T.min[0] || p.h < T.min[1])) W.push('"areas[' + i + ']" (' + T.n + ') is ' + p.w + '×' + p.h + '; it needs at least ' + T.min[0] + '×' + T.min[1] + ' to look right.') });
  (j.paths || []).forEach((p, i) => { if (!p) return; const T = G.cmPath(p.kind); colour('paths', i, 'color', p.color); if (!T) return; opts('paths', i, p, T); if (p.width != null && T.wr && (p.width < T.wr[0] || p.width > T.wr[1])) W.push('"paths[' + i + '].width" is ' + p.width + '; ' + T.n + ' is usually ' + T.wr[0] + '–' + T.wr[1] + ' px.') });
  (j.walls || []).forEach((p, i) => { if (!p) return; colour('walls', i, 'color', p.color); const S = G.CMWI[p.style]; if (S && p.color && !S.pal) N.push('"walls[' + i + ']" (' + p.style + ') has a colour, but that wall style comes in one look.') });
  const lg = j.lighting; if (lg && typeof lg == 'object' && typeof lg.amount == 'number' && (lg.amount < 0 || lg.amount > 1)) W.push('"lighting.amount" is ' + lg.amount + '; it is kept between 0 and 1.');
  return { W, N };
}
const out = []; let bad = 0;
for (const f of files) {
  const r = { file: f, errors: [], warnings: [], notes: [], summary: '' };
  let txt = ''; try { txt = fs.readFileSync(f, 'utf8') } catch (e) { r.errors.push('Could not read the file: ' + e.message); out.push(r); bad++; continue }
  let j = null; try { j = JSON.parse(txt) } catch (e) { }
  const res = G.cmRead(txt); r.errors.push(...res.errors); r.warnings.push(...res.warnings);
  if (res.doc) {
    const d = res.doc;
    for (const p of G.cmLint(d)) { const m = p.m + (p.x != null ? ' (at ' + Math.round(p.x) + ', ' + Math.round(p.y) + ')' : ''); if (p.lv == 'err') r.errors.push(m); else if (p.lv == 'warn') { const q = /"([^"]+)"/.exec(p.m); if (!r.warnings.includes(p.m) && !(q && /^Missing /.test(p.m) && res.warnings.some(w => /^Unknown /.test(w) && w.includes('"' + q[1] + '"')))) r.warnings.push(m) } else r.notes.push(m) }
    r.summary = d.w + '×' + d.h + ' tiles, ' + d.obj.filter(o => !o.dc && !o.fx && !o.veh).length + ' props, ' + d.obj.filter(o => o.veh).length + ' vehicles, ' + d.obj.filter(o => o.dc).length + ' decals, ' + d.obj.filter(o => o.fx).length + ' effects, ' + d.walls.length + ' walls, ' + d.areas.length + ' areas, ' + d.paths.length + ' paths, ' + d.feats.length + ' special features, ' + d.spawns.length + ' spawn points, ' + d.zones.length + ' zones (format ' + (j && j.version) + (j && j.version < 3 ? ', upgraded to 3 on load' : '') + ')';
  }
  if (j && typeof j == 'object') { const x = extra(j, res.doc); r.warnings.push(...x.W); r.notes.push(...x.N) }
  r.warnings = [...new Set(r.warnings)];
  if (r.errors.length || strict && r.warnings.length) bad++;
  out.push(r);
}
if (asJson) console.log(JSON.stringify(out, null, 1));
else for (const r of out) {
  console.log((r.errors.length ? '✖ ' : r.warnings.length ? '⚠ ' : '✔ ') + r.file + (r.summary ? '\n  ' + r.summary : ''));
  for (const m of r.errors) console.log('  error:   ' + m);
  for (const m of r.warnings) console.log('  warning: ' + m);
  for (const m of r.notes) console.log('  note:    ' + m);
  if (!r.errors.length && !r.warnings.length) console.log('  no problems found');
}
process.exit(bad ? 1 : 0);
