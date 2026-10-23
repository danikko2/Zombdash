//# world/custom-maps.js — Playing custom maps: the device's saved maps for Free Play, their map keys, cmBuild() (run by build()), zone spawning
// ---------- custom maps in the game ----------
// Custom maps never get a slot in MP. While the game runs each saved map has a key from 1000 up (CMKEY), and the editor's
// playtest map is key 900; mapId holds that key, and build() hands the map to cmBuild(). Keys are never written to S.mp.
let CML=[],CMLOK=0,CMKN=1000,CMPTD=null;const CMKEY={},CMPTK=900;
function cmIs(m){return typeof m=='number'&&m>=900}
// the editor's playtest map: nothing about it is recorded (no checkpoint, score or best wave)
function cmPT(m){return m===CMPTK}
// a custom map's own id (stable on every device that has the same map file) and back
function cmIdOf(m){const e=cmIs(m)&&cmEnt(m);return e?e.id:null}
function cmKeyById(id){const e=CML.find(x=>x.id===id&&x.doc);return e?e.key:null}
// scores on the online leaderboards use map number 63 for every custom map, with the map's id in "cmap"
const CMLBM=63;
function cmKeyOf(id){return CMKEY[id]||(CMKEY[id]=CMKN++)}
function cmEnt(m){if(m===CMPTK)return CMPTD?{id:CMPTD.id,key:CMPTK,doc:CMPTD,meta:{}}:null;return CML.find(e=>e.key===m&&e.doc)||null}
function cmDocOf(m){const e=cmEnt(m);return e?e.doc:null}
// keys of the maps Free Play can show (maps that failed to load stay in the Workshop only)
function cmFree(){return CML.filter(e=>e.doc).map(e=>e.key)}
function mpName(m){if(!cmIs(m))return MP[m]?MP[m].n:'?';const e=cmEnt(m);return e?e.doc.name||'Custom map':'Custom map'}
function mpDesc(m){if(!cmIs(m))return MPD[m]||(MP[m]?MP[m].d:'');const e=cmEnt(m);return e?e.doc.desc||'A map made in the Map Workshop.':''}
function mpImg(m){if(!cmIs(m))return MPI[m]||'';const e=cmEnt(m),u=e&&e.meta&&e.meta.thumb;return typeof u=='string'&&/^data:image\/(png|jpeg);base64,[A-Za-z0-9+/=]+$/.test(u)?u:''}
function cmMunT(m){const d=cmDocOf(m);if(!d)return '';{const e=!cmPT(m)&&ccOfKey(m);if(e&&!mapOK(m))return `🔒 In the campaign (${SEC[e.s].n}): beat it there to play it in Free Play`}const b=cmPT(m)?0:mBest(S.ac,m);return `${b?'Best wave here: '+b+' · ':''}✎ Custom map · ${d.w}×${d.h} tiles`}
// (re)load every saved map from the store; returns the list
async function cmLoadAll(){const [metas,maps]=await Promise.all([msAll('meta'),msAll('maps')]),byId={};for(const r of maps||[])byId[r.id]=r;const L=[];
for(const m of metas||[]){const rec=byId[m.id],r=rec?cmRead(rec.json):{doc:null,errors:['The map data is missing.'],warnings:[]};L.push({id:m.id,key:cmKeyOf(m.id),meta:m,doc:r.doc,errors:r.errors,warnings:r.warnings})}
L.sort((a,b)=>String(a.meta.name||'').localeCompare(String(b.meta.name||''),undefined,{sensitivity:'base'}));CML=L;CMLOK=1;try{await ccLoad()}catch(e){}return L}
// paint a whole custom map (ground, walls, props, vehicles) into g; used for the game's background and for thumbnails
function cmProp(g,o){const B=cmOB(o.k);if(!B)return;const v=o.vr!=null?o.vr:cmH(o.x,o.y,3),r=o.r||0;if(!r){B.f(g,o.x,o.y,v,o.c);return}
const L=vRec.L,n=L?L.length:0;g.save();g.translate(o.x,o.y);g.rotate(r*Math.PI/180);try{B.f(g,0,0,v,o.c)}finally{g.restore()}
// a turned sprite has no straight base line, so walk-behind uses its pixels instead
if(L)for(let i=n;i<L.length;i++)delete L[i].base}
function cmCar(g,o){const v=cmVeh(o);if(!v)return;const r=Math.hypot(v.L,v.W)/2+6;vDraw(g,v.x-r,v.y-r,r*2,r*2,q=>hwDraw(q,v))}
function cmWallDraw(g,w){const s=CMWI[w.s]||CMWI.wall;s.f(g,w.x,w.y,w.w,w.h)}
// everything is painted in layer order (hidden layers too: hiding is only for the editor)
function cmPaint(g,d){cmGround(g,d,0,0,d.w,d.h,0);for(const{o,w}of cmDrawList(d,0)){if(w)cmWallDraw(g,o);else if(o.veh)cmCar(g,o);else cmProp(g,o)}}
// the map loader: everything a map function (mapXxx) does, from data
function cmBuild(d){const T=d.tile;WW=d.w*T;WH=d.h*T;WL=cmColl(d);
const sp=d.spawns.filter(s=>s.on!==false).map(s=>[s.x,s.y]),zn=d.zones.filter(z=>z.on!==false).map(z=>[z.x,z.y,z.w,z.h]);
const st=cmStart(d);HS={cx:cl(st.x,0,WW),cy:cl(st.y,0,WH),px:cl(st.x,8,WW-8),py:cl(st.y,8,WH-8),nx0:0,nx1:0,ny0:0,ny1:0,CM:d.id};if(sp.length||zn.length)HS.CZ={p:sp,z:zn};
grid();BG.width=WW;BG.height=WH;cmPaint(BG.getContext('2d'),d)}
// where the next zombie appears on a custom map with spawn points or zones (spawnZ calls this)
function cmSpawnAt(R){const Z=HS.CZ,c=[];for(const p of Z.p)c.push({x:p[0],y:p[1],w:0,h:0});for(const z of Z.z)c.push({x:z[0],y:z[1],w:z[2],h:z[3]});
// like the spawn points of the built-in maps: prefer spots out of the player's sight
const far=c.filter(q=>Math.hypot(q.x+q.w/2-P.x,q.y+q.h/2-P.y)>R*.75),pool=far.length?far:c,q=pool[Math.random()*pool.length|0];
if(!q.w)return[q.x+rnd(-14,14),q.y+rnd(-14,14)];
for(let n=0;n<10;n++){const x=q.x+Math.random()*q.w,y=q.y+Math.random()*q.h;if(!fdBad(x,y)&&!wlAt(x,y).some(w=>x>w[0]-12&&x<w[0]+w[2]+12&&y>w[1]-12&&y<w[1]+w[3]+12))return[x,y]}
return[q.x+q.w/2,q.y+q.h/2]}
// load the device's maps once the page is up (Free Play lists them; nothing waits for this)
// a crash checkpoint on a custom map can only be offered once the maps are loaded, so the menu is redrawn then
cmLoadAll().then(()=>{try{const c=cpGet();if(c&&(c.cm||c.cr)&&mode=='menu'&&UIS==''&&ui.querySelector&&ui.querySelector('.title'))menu();else if(mode=='menu'&&UIS=='cmap'&&ccAll().length+Object.keys(CCS.rep).length)cMap()}catch(e){}},e=>{try{console.warn('custom maps',e)}catch(_){}});
