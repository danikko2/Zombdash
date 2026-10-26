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
// how far a thing's picture turns: upright lights (nr:1) keep their picture standing, their turn only aims the light
function cmPR(o){if(!o||!o.r)return 0;if(o.veh||o.dc||o.fx)return o.r;const B=cmOB(o.k);return B&&B.nr?0:o.r}
// props marked eo (editor only: the ceiling light) are drawn in the editor only; in the game just their light shows
function cmProp(g,o){const B=cmOB(o.k);if(!B||B.eo)return;const v=o.vr!=null?o.vr:cmH(o.x,o.y,3),r=cmPR(o);if(!r){B.f(g,o.x,o.y,v,o.c,o.tx);return}
const L=vRec.L,n=L?L.length:0;g.save();g.translate(o.x,o.y);g.rotate(r*Math.PI/180);try{B.f(g,0,0,v,o.c,o.tx)}finally{g.restore()}
// a turned sprite has no straight base line, so walk-behind uses its pixels instead
if(L)for(let i=n;i<L.length;i++)delete L[i].base}
// the walk-behind box hugs the turned car (a square around any turn wasted memory on long vehicles)
function cmCar(g,o){const v=cmVeh(o);if(!v)return;const c=Math.abs(Math.cos(v.a)),s=Math.abs(Math.sin(v.a)),ex=c*v.L/2+s*v.W/2+4,ey=s*v.L/2+c*v.W/2+4;vDraw(g,v.x-ex,v.y-ey,ex*2,ey*2,q=>hwDraw(q,v))}
function cmWallDraw(g,w){const s=CMWI[w.s]||CMWI.wall;s.f(g,w.x,w.y,w.w,w.h,w.c)}
// everything is painted in layer order (hidden layers too: hiding is only for the editor)
function cmPaint(g,d){cmGround(g,d,0,0,d.w,d.h,0);for(const it of cmDrawList(d,0))cmPaintIt(g,it.o,it.t)}
// one thing of the draw list: t is 'w' wall, 'a' area, 'l' path, 'o' prop / vehicle / decal / effect
function cmPaintIt(g,o,t){if(t=='w')return cmWallDraw(g,o);if(t=='a')return cmAreaDraw(g,o);if(t=='l')return cmPathDraw(g,o);if(o.dc)return cmDecDraw(g,o);if(o.fx)return cmFxBake(g,o);if(o.veh)return cmCar(g,o);cmProp(g,o)}
// the map loader: everything a map function (mapXxx) does, from data
function cmBuild(d){const T=d.tile;WW=d.w*T;WH=d.h*T;WL=cmColl(d);
const sp=d.spawns.filter(s=>s.on!==false).map(s=>[s.x,s.y]),zn=d.zones.filter(z=>z.on!==false).map(z=>[z.x,z.y,z.w,z.h]);
const st=cmStart(d);HS={cx:cl(st.x,0,WW),cy:cl(st.y,0,WH),px:cl(st.x,8,WW-8),py:cl(st.y,8,WH-8),nx0:0,nx1:0,ny0:0,ny1:0,CM:d.id};if(sp.length||zn.length)HS.CZ={p:sp,z:zn};if(sp.length)HS.sp=sp;
cmFeatHS(d);grid();BG.width=WW;BG.height=WH;cmPaint(BG.getContext('2d'),d);HS.CX=cmFxData(d);HS.LT=cmLightData(d)}
// what the map's special features, effects and props tell the game's systems (the same HS fields the built-in maps set)
function cmFeatHS(d){const F=d.feats||[],R=f=>[f.x,f.y,f.x+f.w,f.y+f.h];
SM=d.obj.filter(o=>o.fx&&cmFx(o.fx)&&cmFx(o.fx).sm).map(o=>({x:o.x,y:o.y}));
// no-spawn zones: the first is the game's no-spawn box for zombies from off-screen; spawn points and zones inside any are skipped
// options: skip:0 keeps spawn points inside working, nogo:0 lets bosses land inside (the Suburb's box only stops zombies from off-screen)
const NS=F.filter(f=>f.f=='nospawn'&&f.w>0),on=(f,k)=>!(f.o&&(f.o[k]===0||f.o[k]===false));if(NS.length){const r=R(NS[0]);HS.nx0=r[0];HS.ny0=r[1];HS.nx1=r[2];HS.ny1=r[3];HS.NS=NS.filter(f=>on(f,'skip')).map(R);NOGO=NS.filter(f=>on(f,'nogo')).map(R)}
// the menu camera
const MV=F.find(f=>f.f=='menuview'&&f.w>0);if(MV){HS.cx=MV.x+MV.w/2;HS.cy=MV.y+MV.h/2}
// building interiors (bosses look for players inside): Building interior features and indoor floors
const HO=F.filter(f=>f.f=='house'&&f.w>0).map(f=>({x:f.x,y:f.y,w:f.w,h:f.h}));for(const a of d.areas||[])if(a.a=='floor'&&(!a.o||a.o.in!==0&&a.o.in!==false))HO.push({x:a.x,y:a.y,w:a.w,h:a.h});if(HO.length)HS.HO=HO;
// the boss road graph
const G=F.find(f=>f.f=='roadgraph'&&f.pts&&f.pts.length>1);if(G){const N=G.pts.map(p=>[G.x+p[0],G.y+p[1]]),A=N.map(()=>[]);for(const e of G.e||[]){if(!A[e[0]]||!A[e[1]]||e[0]===e[1])continue;if(!A[e[0]].includes(e[1]))A[e[0]].push(e[1]);if(!A[e[1]].includes(e[0]))A[e[1]].push(e[0])}HS.RG={N,A}}
// the Mayor's roof, Penny's store
const C=F.find(f=>f.f=='cityhall'&&f.w>0);if(C)HS.CH={x:C.x+C.w/2,y:C.y+40,rx:C.x,ry:C.y,rw:C.w,rh:C.h};
const S_=F.find(f=>f.f=='store'&&f.w>0);if(S_){HS.ST=R(S_);HS.SHF=d.obj.filter(o=>o.k=='gshelf'&&o.x>S_.x&&o.x<S_.x+S_.w&&o.y>S_.y&&o.y<S_.y+S_.h).map(o=>[o.x,o.y-24]);HS.CRL=d.obj.filter(o=>o.k=='corral'||o.k=='cartrow').map(o=>[o.x,o.y])}
// street trees stop the fire hose (as on Downtown)
const TK=d.obj.filter(o=>o.k=='stree').map(o=>[o.x,o.y-4]);if(TK.length)HS.TRK=TK}
// where the next zombie appears on a custom map with spawn points or zones (spawnZ calls this)
function cmSpawnAt(R){const Z=HS.CZ,c=[],ns=(x,y)=>(HS.NS||[]).some(r=>x>r[0]&&x<r[2]&&y>r[1]&&y<r[3]);for(const p of Z.p)if(!ns(p[0],p[1]))c.push({x:p[0],y:p[1],w:0,h:0});for(const z of Z.z)if(!ns(z[0]+z[2]/2,z[1]+z[3]/2))c.push({x:z[0],y:z[1],w:z[2],h:z[3]});if(!c.length){for(const p of Z.p)c.push({x:p[0],y:p[1],w:0,h:0});for(const z of Z.z)c.push({x:z[0],y:z[1],w:z[2],h:z[3]})}
// like the spawn points of the built-in maps: prefer spots out of the player's sight
const far=c.filter(q=>Math.hypot(q.x+q.w/2-P.x,q.y+q.h/2-P.y)>R*.75),pool=far.length?far:c,q=pool[Math.random()*pool.length|0];
if(!q.w)return[q.x+rnd(-14,14),q.y+rnd(-14,14)];
for(let n=0;n<10;n++){const x=q.x+Math.random()*q.w,y=q.y+Math.random()*q.h;if(!fdBad(x,y)&&!wlAt(x,y).some(w=>x>w[0]-12&&x<w[0]+w[2]+12&&y>w[1]-12&&y<w[1]+w[3]+12))return[x,y]}
return[q.x+q.w/2,q.y+q.h/2]}
// load the device's maps once the page is up (Free Play lists them; nothing waits for this)
// a crash checkpoint on a custom map can only be offered once the maps are loaded, so the menu is redrawn then
cmLoadAll().then(()=>{try{const c=cpGet();if(c&&(c.cm||c.cr)&&mode=='menu'&&UIS==''&&ui.querySelector&&ui.querySelector('.title'))menu();else if(mode=='menu'&&UIS=='cmap'&&ccAll().length+Object.keys(CCS.rep).length)cMap()}catch(e){}},e=>{try{console.warn('custom maps',e)}catch(_){}});
