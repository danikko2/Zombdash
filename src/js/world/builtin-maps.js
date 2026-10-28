//# world/builtin-maps.js — Built-in maps made from map files: the Suburb (map 0) is src/maps/suburb.json, the Warehouse (map 1) src/maps/warehouse.json, the School (map 3) src/maps/school.json, Hometown Market (map 14) src/maps/market.json, built by the custom-map loader (cmBuild); the first map build at boot
// ---------- built-in maps from map files ----------
// BIMF[mapId] is the map file (embedded by tools/build.js). The map keeps its built-in number, so its campaign slot, records,
// leaderboard board, checkpoints and boss stay those of map 0. The Workshop offers a copy to edit (wsBuiltins).
const BIMF={0:{{json:maps/suburb.json}},1:{{json:maps/warehouse.json}},3:{{json:maps/school.json}},14:{{json:maps/market.json}}};
function bimIs(m){return!!(typeof BIMF!='undefined'&&BIMF[m])}
// the map's document, read fresh each time (so only the map being played is in memory; cmRead checks it, and a broken file is a build bug, so it throws)
function bimDoc(m){const r=cmRead(JSON.stringify(BIMF[m]));if(!r.doc)throw new Error('built-in map '+m+': '+(r.errors||[]).join('; '));return r.doc}
function bimBuild(m){cmBuild(bimDoc(m))}
// ---------- the Workshop's Built-in maps list ----------
// EDIT A COPY makes the player's own map from the built-in one (a new id, every piece editable); the built-in map itself
// only changes through the repo (src/maps/*.json).
function wsBuiltins(){const touch=wsTouch(),L=Object.keys(BIMF).map(Number);if(!L.length)return '';return `<h3 class=wssh>Built-in maps</h3><div class=wsl>${L.map(m=>{const j=BIMF[m],img=typeof MPI!='undefined'&&MPI[m]||'';return `<div class=wsc>${img?`<img class=wst alt="" src="${img}">`:'<i class=wst></i>'}<div class=wsi><b>${edEsc(MP[m].n)}</b><small>${j.width}×${j.height} tiles · map ${m+1} of the game</small><small>${edEsc(j.description||'')}</small><div class=wsa><button class=go onclick="wsBuiltin(${m},1)"${touch?' disabled':''}>EDIT A COPY</button><button onclick="wsBuiltin(${m},0)">ADD A COPY TO MY MAPS</button></div></div></div>`}).join('')}</div>`}
async function wsBuiltin(m,edit){if(!bimIs(m)){sfx('deny');return}const d=cmClone(bimDoc(m));d.id=cmUid('m');d.name=(MP[m].n+' (my copy)').slice(0,40);d.created=d.updated=new Date().toISOString();sfx('click');
try{await wsStore(d)}catch(err){return workshop('Could not copy the map: '+edEsc(err&&err.message||err))}if(edit)return edOpen(cmClone(d),'saved');workshop('Added “'+edEsc(d.name)+'” to your maps: PLAY or EDIT it from the list.')}
// the first map build: here, after the map file and every kit piece it uses are loaded
try{build()}catch(e){console.error(e);mapId=0;S.mp=0;build()}
