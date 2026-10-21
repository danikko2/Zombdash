//# world/map-schema.js — Custom map format v1: terrain (CMTER), overlays (CMOVL) and wall styles (CMWALL), JSON read/write/validate, collision
// ---------- custom maps: the data format ----------
// A custom map is plain data. The Map Workshop writes it, cmBuild() in world/custom-maps.js turns it into a playable map,
// and anyone (Claude included) can write one by hand: the JSON layout is in docs/ARCHITECTURE.md ("Custom map files").
// In memory a map ("doc") keeps its terrain as one byte per tile (ter, an index into pal) so painting stays fast.
// functions and registries only: nothing here runs during the first map build at boot
const CMVER=1,CMTILE=32,CMMIN=[20,15],CMMAX=128;
function cmH(a,b,k){const v=Math.sin(a*12.9898+b*78.233+k*37.719)*43758.5453;return v-Math.floor(v)}
// the four 16px cells of a tile in three shades, the same pattern the built-in maps use for their ground
function cmCells(g,x,y,a,b,c){for(let j=0;j<32;j+=16)for(let i=0;i<32;i+=16){const h=((x+i)*7+(y+j)*13)%5;g.fillStyle=h<2?a:h<4?b:c;g.fillRect(x+i,y+j,16,16)}}
// a few small marks at stable spots in the tile
function cmSpeck(g,x,y,tx,ty,n,cols,w,h,k){for(let i=0;i<n;i++){const u=cmH(tx,ty,k+i*3.1),v=cmH(ty+7,tx,k+i*5.7);g.fillStyle=cols[i%cols.length];g.fillRect(x+Math.floor(u*(32-w)),y+Math.floor(v*(32-h)),w,h)}}

// ----- terrain registry -----
// To add a terrain: push {id,n,ch,mc,f} with cmAddTer(). id is what map files store, n the name in the editor, ch its letter in map
// files, mc its minimap colour, f(g,x,y,tx,ty) paints one 32px tile at world pixel x,y (tx,ty = tile column/row).
// walk:0 makes it block walking (bullets still fly over it); liq:1 draws a shoreline where it meets other ground.
const CMTER=[
{id:'grass',n:'Grass',ch:'g',mc:'#52b04c',f(g,x,y){cmCells(g,x,y,'#4fae4a','#58b852','#47a043');g.fillStyle='#3a8a38';for(let j=0;j<32;j+=16)for(let i=0;i<32;i+=16)if(((x+i)*31+(y+j)*17)%7==0){g.fillRect(x+i+4,y+j+6,2,5);g.fillRect(x+i+9,y+j+4,2,6)}}},
{id:'dirt',n:'Dirt',ch:'d',mc:'#8c6c46',f(g,x,y,tx,ty){cmCells(g,x,y,'#8b6b45','#94744c','#80623f');cmSpeck(g,x,y,tx,ty,3,['#a8865a','#6e5236','#7a5c3c'],2,2,1)}},
{id:'asphalt',n:'Asphalt',ch:'a',mc:'#3e4146',f(g,x,y,tx,ty){cmCells(g,x,y,'#3d4045','#41454b','#393c41');cmSpeck(g,x,y,tx,ty,4,['#50545b','#2e3135'],1,1,2);if(cmH(tx,ty,9)<.12){g.fillStyle='rgba(0,0,0,.25)';g.fillRect(x+4+Math.floor(cmH(tx,ty,10)*10),y+8+Math.floor(cmH(tx,ty,11)*16),10+Math.floor(cmH(tx,ty,12)*8),1)}}},
{id:'concrete',n:'Concrete',ch:'c',mc:'#a6a298',f(g,x,y,tx,ty){cmCells(g,x,y,'#a8a49a','#aeaaa0','#a29e94');g.fillStyle='#928e85';g.fillRect(x,y,32,1);g.fillRect(x,y,1,32);cmSpeck(g,x,y,tx,ty,2,['#9a968c','#b8b4aa'],1,1,3);if(cmH(tx,ty,13)<.1){g.fillStyle='#86827a';const cx=x+6+Math.floor(cmH(tx,ty,14)*16),cy=y+6+Math.floor(cmH(tx,ty,15)*16);g.fillRect(cx,cy,5,1);g.fillRect(cx+4,cy+1,1,3);g.fillRect(cx+5,cy+3,4,1)}}},
{id:'sidewalk',n:'Sidewalk',ch:'s',mc:'#b8b4a8',f(g,x,y,tx,ty){g.fillStyle='#b8b4a8';g.fillRect(x,y,32,32);g.fillStyle='#c0bcb0';g.fillRect(x+1,y+1,14,2);g.fillRect(x+17,y+17,14,2);g.fillStyle='#a19d92';g.fillRect(x,y,32,1);g.fillRect(x,y,1,32);g.fillRect(x,y+16,32,1);g.fillRect(x+16,y,1,32);cmSpeck(g,x,y,tx,ty,2,['#aaa69a','#c8c4b8'],1,1,4)}},
{id:'sand',n:'Sand',ch:'n',mc:'#dcc78f',f(g,x,y,tx,ty){cmCells(g,x,y,'#dcc78f','#e2cd95','#d5c088');cmSpeck(g,x,y,tx,ty,5,['#c4ae74','#efdcaa','#cdb87e'],1,1,5);if(cmH(tx,ty,16)<.3){g.fillStyle='#cdb87e';g.fillRect(x+3+Math.floor(cmH(tx,ty,17)*18),y+5+Math.floor(cmH(tx,ty,18)*22),7,1)}}},
{id:'gravel',n:'Gravel',ch:'v',mc:'#8a857a',f(g,x,y,tx,ty){cmCells(g,x,y,'#8a857a','#918c80','#837e73');cmSpeck(g,x,y,tx,ty,10,['#6e695f','#a8a296','#5f5a52','#b8b2a6'],2,1,6)}},
{id:'mud',n:'Mud',ch:'m',mc:'#5f4a33',f(g,x,y,tx,ty){cmCells(g,x,y,'#5f4a33','#654f37','#58442e');if(cmH(tx,ty,19)<.4){const cx=x+9+cmH(tx,ty,20)*14,cy=y+9+cmH(tx,ty,21)*14;g.fillStyle='#4a3a28';g.beginPath();g.ellipse(cx,cy,5+cmH(tx,ty,22)*4,3+cmH(tx,ty,23)*2,0,0,7);g.fill();g.fillStyle='#7d6749';g.fillRect(cx-2,cy-2,3,1)}cmSpeck(g,x,y,tx,ty,2,['#4f3d29','#6e5840'],2,1,7)}},
{id:'water',n:'Water',ch:'w',mc:'#3070a0',walk:0,liq:1,f(g,x,y,tx,ty){cmCells(g,x,y,'#2e6c96','#3274a0','#2a668e');g.fillStyle='#4f93c0';for(let i=0;i<2;i++)g.fillRect(x+2+Math.floor(cmH(tx,ty,24+i)*22),y+4+Math.floor(cmH(tx,ty,26+i)*24),6,1);if(cmH(tx,ty,28)<.25){g.fillStyle='#8fc3e8';g.fillRect(x+4+Math.floor(cmH(tx,ty,29)*22),y+4+Math.floor(cmH(tx,ty,30)*22),2,1)}}},
{id:'wood',n:'Wood floor',ch:'o',mc:'#a8793e',f(g,x,y,tx,ty){for(let r=0;r<4;r++){const py=y+r*8;g.fillStyle=['#a8793e','#b0824a','#9f7339'][Math.floor(cmH(tx,ty*4+r,31)*3)];g.fillRect(x,py,32,8);g.fillStyle='#7a5528';g.fillRect(x,py+7,32,1);g.fillRect(x+((tx*11+(ty*4+r)*13)%4)*8+3,py,1,7);if(cmH(tx,ty*4+r,32)<.4){g.fillStyle='#96683a';g.fillRect(x+Math.floor(cmH(tx,ty*4+r,33)*24),py+3,5,1)}}}},
{id:'tile',n:'Tile floor',ch:'t',mc:'#cfcfc7',f(g,x,y){for(let j=0;j<32;j+=16)for(let i=0;i<32;i+=16){g.fillStyle=((x+i+y+j)/16)%2?'#d9d9d2':'#c4c4bc';g.fillRect(x+i,y+j,16,16)}}}];
const CMTI=Object.create(null);for(const t of CMTER)CMTI[t.id]=t;
function cmAddTer(t){if(!CMTI[t.id])CMTER.push(t);CMTI[t.id]=t}
// overlays are painted on top of the ground and have no effect on movement; '.' in map files means none
const CMOVL=[
{id:'blood',n:'Blood',ch:'b',mc:'#7a1414',f(g,x,y,tx,ty){const n=2+Math.floor(cmH(tx,ty,40)*2);for(let i=0;i<n;i++){const cx=x+5+cmH(tx,ty,41+i)*22,cy=y+5+cmH(tx,ty,44+i)*22,r=3+cmH(tx,ty,47+i)*5;g.fillStyle='#6e1010';g.beginPath();g.ellipse(cx,cy,r,r*.75,0,0,7);g.fill();g.fillStyle='#8c1616';g.beginPath();g.ellipse(cx-r*.25,cy-r*.2,r*.5,r*.35,0,0,7);g.fill()}cmSpeck(g,x,y,tx,ty,4,['#7a1212','#5a0c0c'],2,2,50)}},
{id:'burn',n:'Burn marks',ch:'x',mc:'#2a221c',f(g,x,y,tx,ty){g.fillStyle='rgba(22,17,13,.5)';g.fillRect(x,y,32,32);g.fillStyle='rgba(8,6,5,.45)';for(let i=0;i<2;i++){g.beginPath();g.ellipse(x+8+cmH(tx,ty,55+i)*16,y+8+cmH(tx,ty,57+i)*16,6+cmH(tx,ty,59+i)*6,4+cmH(tx,ty,61+i)*4,0,0,7);g.fill()}cmSpeck(g,x,y,tx,ty,4,['#4a4038','#6a5a4a','#1a1410'],1,1,63)}}];
const CMOI=Object.create(null);for(const t of CMOVL)CMOI[t.id]=t;
function cmAddOvl(t){if(!CMOI[t.id])CMOVL.push(t);CMOI[t.id]=t}
function cmWet(d,i){const t=CMTI[d.pal[d.ter[i]]];return !!t&&t.walk===0}
// shoreline where liquid meets other ground
function cmShore(g,d,tx,ty,x,y){const T=d.tile;const dry=(a,b)=>a>=0&&b>=0&&a<d.w&&b<d.h&&!(CMTI[d.pal[d.ter[b*d.w+a]]]||{}).liq;
g.fillStyle='#23597d';if(dry(tx,ty-1))g.fillRect(x,y,T,3);if(dry(tx,ty+1))g.fillRect(x,y+T-3,T,3);if(dry(tx-1,ty))g.fillRect(x,y,3,T);if(dry(tx+1,ty))g.fillRect(x+T-3,y,3,T);
g.fillStyle='#a8d6f0';if(dry(tx,ty-1))g.fillRect(x,y,T,1);if(dry(tx,ty+1))g.fillRect(x,y+T-1,T,1);if(dry(tx-1,ty))g.fillRect(x,y,1,T);if(dry(tx+1,ty))g.fillRect(x+T-1,y,1,T)}
// paint the ground (terrain, shorelines, overlays) of tiles tx0..tx1-1, ty0..ty1-1; miss=1 marks unknown terrain (editor)
function cmGround(g,d,tx0,ty0,tx1,ty1,miss){const T=d.tile,gd=CMTI[d.ground]||CMTER[0];
for(let ty=Math.max(0,ty0);ty<Math.min(d.h,ty1);ty++)for(let tx=Math.max(0,tx0);tx<Math.min(d.w,tx1);tx++){const i=ty*d.w+tx,x=tx*T,y=ty*T,t=CMTI[d.pal[d.ter[i]]];(t||gd).f(g,x,y,tx,ty);
if(!t&&miss){g.strokeStyle='#ff3a5a';g.lineWidth=2;g.beginPath();g.moveTo(x+4,y+4);g.lineTo(x+T-4,y+T-4);g.moveTo(x+T-4,y+4);g.lineTo(x+4,y+T-4);g.stroke()}
if(t&&t.liq)cmShore(g,d,tx,ty,x,y);const o=d.ovl[i];if(o){const q=CMOI[d.opal[o]];if(q)q.f(g,x,y,tx,ty)}}}

// ----- wall styles -----
// fl is the game's wall flag: 0 = wall (stops bullets), 1 = solid but not a building wall, 2 = see-through (bullets fly through).
const CMWALL=[
{id:'wall',n:'Wall',fl:0,f(g,x,y,w,h){g.fillStyle='#2e2420';g.fillRect(x,y,w,h);g.fillStyle='#7a695c';g.fillRect(x+1,y+1,Math.max(0,w-2),Math.max(0,h-2));g.fillStyle='#958474';g.fillRect(x+1,y+1,Math.max(0,w-2),Math.min(2,Math.max(0,h-2)))}},
{id:'brick',n:'Brick wall',fl:0,f(g,x,y,w,h){g.fillStyle='#2a1510';g.fillRect(x,y,w,h);g.fillStyle='#9a4632';g.fillRect(x+1,y+1,Math.max(0,w-2),Math.max(0,h-2));g.fillStyle='#c27a5e';if(w>=h){for(let j=y+4;j<y+h-1;j+=5)g.fillRect(x+1,j,Math.max(0,w-2),1);for(let i=x+6;i<x+w-1;i+=10)g.fillRect(i,y+1,1,Math.max(0,h-2))}else{for(let i=x+4;i<x+w-1;i+=5)g.fillRect(i,y+1,1,Math.max(0,h-2));for(let j=y+6;j<y+h-1;j+=10)g.fillRect(x+1,j,Math.max(0,w-2),1)}}},
{id:'concrete',n:'Concrete wall',fl:0,f(g,x,y,w,h){g.fillStyle='#2f3237';g.fillRect(x,y,w,h);g.fillStyle='#8c9099';g.fillRect(x+1,y+1,Math.max(0,w-2),Math.max(0,h-2));g.fillStyle='#a6aab2';g.fillRect(x+1,y+1,Math.max(0,w-2),Math.min(2,Math.max(0,h-2)));g.fillStyle='#7a7e86';if(w>=h)for(let i=x+48;i<x+w-2;i+=48)g.fillRect(i,y+1,1,Math.max(0,h-2));else for(let j=y+48;j<y+h-2;j+=48)g.fillRect(x+1,j,Math.max(0,w-2),1)}},
{id:'wood',n:'Wood wall',fl:0,f(g,x,y,w,h){g.fillStyle='#2a1d14';g.fillRect(x,y,w,h);g.fillStyle='#8a5a2c';g.fillRect(x+1,y+1,Math.max(0,w-2),Math.max(0,h-2));g.fillStyle='#6e4520';if(w>=h)for(let j=y+4;j<y+h-1;j+=4)g.fillRect(x+1,j,Math.max(0,w-2),1);else for(let i=x+4;i<x+w-1;i+=4)g.fillRect(i,y+1,1,Math.max(0,h-2));g.fillStyle='#a8703a';g.fillRect(x+1,y+1,Math.max(0,w-2),1)}},
{id:'fence',n:'Chain-link fence',fl:2,see:1,f(g,x,y,w,h){if(w>=h)fenceH(g,x,y+h/2,w);else fenceV(g,x+w/2,y,h)}},
{id:'hidden',n:'Invisible blocker',fl:1,hid:1,f(){}}];
const CMWI=Object.create(null);for(const t of CMWALL)CMWI[t.id]=t;
function cmAddWall(t){if(!CMWI[t.id])CMWALL.push(t);CMWI[t.id]=t}

// a real prop / vehicle size by name, or null (map files come from anywhere: "constructor" is not a prop)
function cmOB(k){return typeof OB!='undefined'&&typeof k=='string'&&Object.prototype.hasOwnProperty.call(OB,k)&&OB[k]&&typeof OB[k].f=='function'?OB[k]:null}
function cmHW(k){if(typeof HWV!='function'||typeof k!='string')return null;const s=HWV(k);return Array.isArray(s)?s:null}
// ----- collision: everything a custom map adds to WL -----
function cmVeh(o){const s=cmHW(o.veh);if(!s)return null;return{k:o.veh,x:o.x,y:o.y,a:(o.r||0)*Math.PI/180,L:s[0],W:s[1],c:o.c||undefined,dmg:o.dmg?1:0,burn:o.burn?1:0}}
// a solid prop's footprint (OB[k].c) turned with the prop, as a box
function cmFoot(o){const B=cmOB(o.k);if(!B||!B.c)return null;const cw=B.c[0],ch=B.c[1],r=(((o.r||0)%360)+360)%360;if(!r)return[o.x-cw/2,o.y-ch,cw,ch,1];
const a=r*Math.PI/180,c=Math.cos(a),s=Math.sin(a);let x0=1e9,y0=1e9,x1=-1e9,y1=-1e9;for(const[px,py]of[[-cw/2,-ch],[cw/2,-ch],[-cw/2,0],[cw/2,0]]){const X_=o.x+px*c-py*s,Y_=o.y+px*s+py*c;x0=Math.min(x0,X_);y0=Math.min(y0,Y_);x1=Math.max(x1,X_);y1=Math.max(y1,Y_)}return[x0,y0,x1-x0,y1-y0,1]}
// a vehicle's collision, built by the same code the highway maps use (hwCol)
function cmVehCol(o,out){const v=cmVeh(o);if(!v)return;const keep=WL;WL=[];try{hwCol(v)}finally{const r=WL;WL=keep;for(const w of r)out.push(w)}}
function cmColl(d){const out=[],T=d.tile;
for(const w of d.walls){const s=CMWI[w.s]||CMWI.wall;if(w.w>0&&w.h>0)out.push([w.x,w.y,w.w,w.h,s.fl])}
// water: one see-through blocker per run of wet tiles, runs that repeat on the next row are merged downwards
let open={};for(let ty=0;ty<=d.h;ty++){const now={};if(ty<d.h){let run=-1;for(let tx=0;tx<=d.w;tx++){const wet=tx<d.w&&cmWet(d,ty*d.w+tx);if(wet&&run<0)run=tx;else if(!wet&&run>=0){const k=run+','+tx;now[k]=open[k]?(open[k][3]+=T,open[k]):[run*T,ty*T,(tx-run)*T,T,2];run=-1}}}
for(const k in open)if(!now[k])out.push(open[k]);open=now}
for(const o of d.obj){if(o.veh)cmVehCol(o,out);else{const f=cmFoot(o);if(f)out.push(f)}}return out}

// ----- new maps, ids -----
function cmUid(p){return p+Date.now().toString(36).slice(-4)+Math.floor(Math.random()*1679616).toString(36).padStart(4,'0')}
function cmNew(o){o=o||{};const w=cl(Math.round(+o.w||72),CMMIN[0],CMMAX),h=cl(Math.round(+o.h||56),CMMIN[1],CMMAX),gd=CMTI[o.ground]?o.ground:'grass',t=new Date().toISOString();
return{v:CMVER,id:cmUid('m'),name:String(o.name||'Untitled map').replace(/[<>]/g,'').slice(0,40),desc:String(o.desc||'').replace(/[<>]/g,'').slice(0,240),tile:CMTILE,w,h,ground:gd,pal:[gd],ter:new Uint8Array(w*h),opal:[''],ovl:new Uint8Array(w*h),
obj:[],walls:[],start:{x:Math.round(w*CMTILE/2),y:Math.round(h*CMTILE/2)},spawns:[],zones:[],created:t,updated:t,extra:{}}}
// palette index for a terrain / overlay id (added on first use)
function cmPi(d,id){let i=d.pal.indexOf(id);if(i<0){if(d.pal.length>=255)return 0;d.pal.push(id);i=d.pal.length-1}return i}
function cmOi(d,id){if(!id)return 0;let i=d.opal.indexOf(id);if(i<0){if(d.opal.length>=255)return 0;d.opal.push(id);i=d.opal.length-1}return i}
// a deep copy (terrain arrays copied too)
function cmClone(d){const c=JSON.parse(JSON.stringify(Object.assign({},d,{ter:null,ovl:null})));c.ter=new Uint8Array(d.ter);c.ovl=new Uint8Array(d.ovl);return c}

// ----- writing a map file -----
const CMCH='ABCDEFGHIJKLMNOPQRSTUVWXYZhijklpqruyz0123456789#$%&*+-=?@^~!:;<>/|()[]{}';
function cmLeg(ids,reg,used){const L={},by={};for(const id of ids){if(id==null||by[id]!=null)continue;let c=reg[id]&&reg[id].ch;if(!c||used.has(c))c=[...CMCH].find(x=>!used.has(x));if(!c)throw new Error('too many terrain types');used.add(c);by[id]=c;L[c]=id}return{L,by}}
const cmR1=v=>Math.round(v*10)/10;
function cmWrite(d){const used=new Set(['.']),tu=new Set([d.ground]);for(let i=0;i<d.ter.length;i++)tu.add(d.pal[d.ter[i]]);
const T=cmLeg([...tu],CMTI,used),rows=[];for(let y=0;y<d.h;y++){let s='';for(let x=0;x<d.w;x++)s+=T.by[d.pal[d.ter[y*d.w+x]]];rows.push(s)}
const out=Object.assign({},d.extra||{},{format:'zombdash-map',version:CMVER,id:d.id,name:d.name,description:d.desc||'',tileSize:d.tile,width:d.w,height:d.h,ground:d.ground,terrain:{legend:T.L,rows}});
const ou=new Set();for(let i=0;i<d.ovl.length;i++)if(d.ovl[i])ou.add(d.opal[d.ovl[i]]);
if(ou.size){const O=cmLeg([...ou],CMOI,new Set(['.'])),r=[];for(let y=0;y<d.h;y++){let s='';for(let x=0;x<d.w;x++){const o=d.ovl[y*d.w+x];s+=o?O.by[d.opal[o]]:'.'}r.push(s)}out.overlay={legend:O.L,rows:r}}else delete out.overlay;
out.props=d.obj.filter(o=>!o.veh).map(o=>{const p={id:o.id,kind:o.k,x:cmR1(o.x),y:cmR1(o.y)};if(o.r)p.rot=cmR1(o.r);if(o.vr!=null)p.var=Math.round(o.vr*100)/100;return p});
out.vehicles=d.obj.filter(o=>o.veh).map(o=>{const p={id:o.id,kind:o.veh,x:cmR1(o.x),y:cmR1(o.y),rot:cmR1(o.r||0)};if(o.c)p.color=o.c;if(o.dmg)p.damaged=true;if(o.burn)p.burnt=true;return p});
out.walls=d.walls.map(w=>({id:w.id,x:cmR1(w.x),y:cmR1(w.y),w:cmR1(w.w),h:cmR1(w.h),style:w.s||'wall'}));
out.playerStart={x:cmR1(d.start.x),y:cmR1(d.start.y)};
out.zombieSpawns={points:d.spawns.map(s=>({id:s.id,x:cmR1(s.x),y:cmR1(s.y),enabled:s.on!==false})),zones:d.zones.map(z=>({id:z.id,x:cmR1(z.x),y:cmR1(z.y),w:cmR1(z.w),h:cmR1(z.h),enabled:z.on!==false}))};
out.created=d.created;out.updated=d.updated;
// draw order (props and vehicles share one list in the editor)
out.order=d.obj.map(o=>o.id);return out}

// ----- reading a map file -----
// cmRead(json or text) -> {doc, errors, warnings}. Errors mean the file can't be used as it is (nothing is changed or thrown away);
// warnings mean it loads but something in it won't show up in the game.
const CMMIG={}; // CMMIG[n](json) upgrades a version n file to version n+1
function cmRead(src){const E=[],Wn=[],res={doc:null,errors:E,warnings:Wn};let j=src;
if(typeof j=='string'){try{j=JSON.parse(j)}catch(e){E.push('This file is not valid JSON ('+e.message+').');return res}}
if(!j||typeof j!='object'||Array.isArray(j)){E.push('This file does not contain a map.');return res}
if(j.format!=='zombdash-map'){E.push('This is not a Zombdash map file (it needs "format": "zombdash-map").');return res}
let v=j.version;if(!Number.isInteger(v)||v<1){E.push('The map file has no valid "version".');return res}
if(v>CMVER){E.push('This map was made with a newer version of Zombdash (map format '+v+'). Update the game to open it.');return res}
try{j=JSON.parse(JSON.stringify(j));while(v<CMVER){j=CMMIG[v](j);v++;j.version=v}}catch(e){E.push('The map could not be upgraded to the current format: '+e.message);return res}
const num=x=>typeof x=='number'&&isFinite(x),int=x=>Number.isInteger(x);
const ts=j.tileSize==null?CMTILE:j.tileSize;if(ts!==CMTILE)E.push('"tileSize" must be '+CMTILE+'.');
const w=j.width,h=j.height;if(!int(w)||!int(h)||w<CMMIN[0]||h<CMMIN[1]||w>CMMAX||h>CMMAX)E.push('"width" and "height" must be whole numbers of tiles, from '+CMMIN[0]+'×'+CMMIN[1]+' up to '+CMMAX+'×'+CMMAX+'.');
if(E.length)return res;
const d={v:CMVER,id:typeof j.id=='string'&&j.id?j.id.slice(0,40):cmUid('m'),name:String(j.name==null?'Untitled map':j.name).replace(/[<>]/g,'').slice(0,40)||'Untitled map',desc:String(j.description||'').replace(/[<>]/g,'').slice(0,240),tile:CMTILE,w,h,ground:'grass',pal:[],ter:new Uint8Array(w*h),opal:[''],ovl:new Uint8Array(w*h),obj:[],walls:[],start:{x:w*CMTILE/2,y:h*CMTILE/2},spawns:[],zones:[],created:typeof j.created=='string'?j.created:new Date().toISOString(),updated:typeof j.updated=='string'?j.updated:new Date().toISOString(),extra:{}};
if(typeof j.ground=='string'&&j.ground)d.ground=j.ground;else if(j.ground!=null)E.push('"ground" must be a terrain name.');
if(!CMTI[d.ground])Wn.push('Unknown default ground "'+d.ground+'": grass is shown instead.');
d.pal.push(d.ground);
// terrain grid
const grid=(G,nm,leg,cb)=>{if(!G||typeof G!='object'||!G.legend||typeof G.legend!='object'||!Array.isArray(G.rows)){E.push('"'+nm+'" needs a "legend" and "rows".');return}
for(const c in G.legend)if(c.length!==1||typeof G.legend[c]!='string'){E.push('"'+nm+'.legend" keys must be single characters naming a type.');return}
if(G.rows.length!==h){E.push('"'+nm+'.rows" has '+G.rows.length+' rows, the map is '+h+' tiles tall.');return}
for(let y=0;y<h;y++){const r=G.rows[y];if(typeof r!='string'||r.length!==w){E.push('"'+nm+'.rows['+y+']" must be a string of '+w+' characters.');return}
for(let x=0;x<w;x++){const c=r[x];if(leg&&c==='.')continue;const id=G.legend[c];if(id==null){E.push('"'+nm+'.rows['+y+']" uses "'+c+'", which is not in the legend.');return}cb(y*w+x,id)}}};
if(j.terrain==null){/* all ground */}else grid(j.terrain,'terrain',0,(i,id)=>{d.ter[i]=cmPi(d,id)});
if(j.overlay!=null)grid(j.overlay,'overlay',1,(i,id)=>{d.ovl[i]=cmOi(d,id)});
for(const id of d.pal)if(id!==d.ground&&!CMTI[id])Wn.push('Unknown terrain "'+id+'": '+(CMTI[d.ground]?CMTI[d.ground].n:'grass').toLowerCase()+' is shown instead.');
for(const id of d.opal)if(id&&!CMOI[id])Wn.push('Unknown overlay "'+id+'": it is not shown.');
const ids=new Set(),uid=(x,p)=>{let s=typeof x=='string'&&x?x.slice(0,24):cmUid(p);while(ids.has(s))s=cmUid(p);ids.add(s);return s};
const list=(a,nm)=>{if(a==null)return[];if(!Array.isArray(a)){E.push('"'+nm+'" must be a list.');return[]}return a};
const bad=(nm,i,why)=>E.push('"'+nm+'['+i+']" '+why);
const unk=Object.create(null);
list(j.props,'props').forEach((p,i)=>{if(!p||typeof p.kind!='string'||!num(p.x)||!num(p.y))return bad('props',i,'needs "kind", "x" and "y".');if(p.rot!=null&&!num(p.rot))return bad('props',i,'has a "rot" that is not a number.');
const o={id:uid(p.id,'p'),k:p.kind,x:p.x,y:p.y,r:p.rot||0};if(num(p.var))o.vr=cl(p.var,0,1);d.obj.push(o);if(!cmOB(p.kind))unk[p.kind]=(unk[p.kind]||0)+1});
list(j.vehicles,'vehicles').forEach((p,i)=>{if(!p||typeof p.kind!='string'||!num(p.x)||!num(p.y))return bad('vehicles',i,'needs "kind", "x" and "y".');if(p.rot!=null&&!num(p.rot))return bad('vehicles',i,'has a "rot" that is not a number.');
const o={id:uid(p.id,'v'),veh:p.kind,x:p.x,y:p.y,r:p.rot||0};if(typeof p.color=='string'&&/^#[0-9a-f]{3,8}$/i.test(p.color))o.c=p.color;if(p.damaged)o.dmg=1;if(p.burnt)o.burn=1;d.obj.push(o);if(!cmHW(p.kind))unk[p.kind+' (vehicle)']=(unk[p.kind+' (vehicle)']||0)+1});
for(const k in unk)Wn.push('Unknown '+(k.endsWith(' (vehicle)')?'vehicle "'+k.slice(0,-10)+'"':'prop "'+k+'"')+' ('+unk[k]+' placed): it is kept in the file but not shown in the game.');
if(Array.isArray(j.order)){const pos={};j.order.forEach((id,i)=>{if(typeof id=='string')pos[id]=i});d.obj.forEach((o,i)=>o._o=pos[o.id]!=null?pos[o.id]:1e6+i);d.obj.sort((a,b)=>a._o-b._o);for(const o of d.obj)delete o._o}
list(j.walls,'walls').forEach((q,i)=>{if(!q||!num(q.x)||!num(q.y)||!num(q.w)||!num(q.h)||q.w<=0||q.h<=0)return bad('walls',i,'needs "x", "y" and a positive "w" and "h".');const s=typeof q.style=='string'?q.style:'wall';if(!CMWI[s])Wn.push('Unknown wall style "'+s+'": drawn as a plain wall.');d.walls.push({id:uid(q.id,'w'),x:q.x,y:q.y,w:q.w,h:q.h,s})});
const ps=j.playerStart;if(ps==null)Wn.push('No "playerStart": the player starts in the middle of the map.');else if(!num(ps.x)||!num(ps.y))E.push('"playerStart" needs "x" and "y".');else d.start={x:ps.x,y:ps.y};
const zs_=j.zombieSpawns;if(zs_!=null&&typeof zs_!='object')E.push('"zombieSpawns" must be an object with "points" and "zones".');else if(zs_){
list(zs_.points,'zombieSpawns.points').forEach((p,i)=>{if(!p||!num(p.x)||!num(p.y))return bad('zombieSpawns.points',i,'needs "x" and "y".');d.spawns.push({id:uid(p.id,'s'),x:p.x,y:p.y,on:p.enabled!==false})});
list(zs_.zones,'zombieSpawns.zones').forEach((p,i)=>{if(!p||!num(p.x)||!num(p.y)||!num(p.w)||!num(p.h)||p.w<=0||p.h<=0)return bad('zombieSpawns.zones',i,'needs "x", "y" and a positive "w" and "h".');d.zones.push({id:uid(p.id,'z'),x:p.x,y:p.y,w:p.w,h:p.h,on:p.enabled!==false})})}
// fields this version doesn't know are kept and written back unchanged
const known=new Set(['format','version','id','name','description','tileSize','width','height','ground','terrain','overlay','props','vehicles','walls','playerStart','zombieSpawns','created','updated','order']);
for(const k in j)if(!known.has(k))d.extra[k]=j[k];
const W_=w*CMTILE,H_=h*CMTILE,out=d.obj.filter(o=>o.x<0||o.y<0||o.x>W_||o.y>H_).length;if(out)Wn.push(out+' prop'+(out>1?'s are':' is')+' outside the map edges.');
if(d.start.x<0||d.start.y<0||d.start.x>W_||d.start.y>H_)Wn.push('The player start is outside the map.');
if(!E.length)res.doc=d;return res}

// ----- checks shown in the editor's Problems list -----
// a walk grid like grid() builds in the game (16px cells, walls grown by 9px), then who can reach the player start
function cmWalk(d,C){const g=16,W_=d.w*d.tile,H_=d.h*d.tile,gw_=Math.ceil(W_/g),gh_=Math.ceil(H_/g),b=new Uint8Array(gw_*gh_);
for(const w of C){const i0=Math.max(0,Math.ceil((w[0]-9-8)/g)),i1=Math.min(gw_-1,Math.floor((w[0]+w[2]+9-8)/g)),j0=Math.max(0,Math.ceil((w[1]-9-8)/g)),j1=Math.min(gh_-1,Math.floor((w[1]+w[3]+9-8)/g));
for(let j=j0;j<=j1;j++)for(let i=i0;i<=i1;i++){const px=i*g+8,py=j*g+8;if(px>w[0]-9&&px<w[0]+w[2]+9&&py>w[1]-9&&py<w[1]+w[3]+9)b[j*gw_+i]=1}}
const F=new Int32Array(gw_*gh_).fill(-1),si=cl(Math.floor(d.start.x/g),0,gw_-1),sj=cl(Math.floor(d.start.y/g),0,gh_-1),q=[sj*gw_+si];
if(!b[q[0]]){F[q[0]]=0;for(let k=0;k<q.length;k++){const c=q[k],i=c%gw_,j=(c/gw_)|0;for(const[di,dj]of D){const a=i+di,e=j+dj;if(a<0||e<0||a>=gw_||e>=gh_)continue;const n=e*gw_+a;if(F[n]>=0||b[n])continue;if(di&&dj&&(b[j*gw_+a]||b[e*gw_+i]))continue;F[n]=F[c]+1;q.push(n)}}}
return{g,gw:gw_,gh:gh_,b,F,at(x,y){const i=cl(Math.floor(x/g),0,gw_-1),j=cl(Math.floor(y/g),0,gh_-1);return j*gw_+i}}}
// -> [{lv:'err'|'warn'|'info', m:text, x, y}]
function cmLint(d){const R=[],C=cmColl(d),M=cmWalk(d,C),W_=d.w*d.tile,H_=d.h*d.tile;
if(d.start.x<0||d.start.y<0||d.start.x>W_||d.start.y>H_)R.push({lv:'err',m:'The player start is outside the map.',x:d.start.x,y:d.start.y});
else if(M.b[M.at(d.start.x,d.start.y)])R.push({lv:'err',m:'The player start is inside a wall, water or a solid prop.',x:d.start.x,y:d.start.y});
const sp=d.spawns.filter(s=>s.on!==false),zn=d.zones.filter(z=>z.on!==false);
for(const s of sp){const c=M.at(s.x,s.y);if(s.x<0||s.y<0||s.x>W_||s.y>H_)R.push({lv:'warn',m:'A zombie spawn point is outside the map.',x:s.x,y:s.y});else if(M.b[c])R.push({lv:'warn',m:'A zombie spawn point is inside a wall or water: zombies would get stuck.',x:s.x,y:s.y});else if(M.F[c]<0&&!M.b[M.at(d.start.x,d.start.y)])R.push({lv:'warn',m:'A zombie spawn point can\'t reach the player start.',x:s.x,y:s.y})}
for(const z of zn){let any=0,reach=0;for(let y=z.y+8;y<z.y+z.h;y+=16)for(let x=z.x+8;x<z.x+z.w;x+=16){if(x<0||y<0||x>W_||y>H_)continue;const c=M.at(x,y);if(!M.b[c]){any=1;if(M.F[c]>=0)reach=1}}
if(!any)R.push({lv:'warn',m:'A spawn zone is completely blocked: no zombie can appear in it.',x:z.x+z.w/2,y:z.y+z.h/2});else if(!reach&&!M.b[M.at(d.start.x,d.start.y)])R.push({lv:'warn',m:'Zombies from a spawn zone can\'t reach the player start.',x:z.x+z.w/2,y:z.y+z.h/2})}
if(!sp.length&&!zn.length)R.push({lv:'info',m:(d.spawns.length||d.zones.length?'Every zombie spawn is turned off':'No zombie spawns yet')+': zombies come from off-screen around the player, like on the built-in maps.'});
const unk=Object.create(null);for(const o of d.obj){const ok=o.veh?cmHW(o.veh):cmOB(o.k);if(!ok){const k=o.veh||o.k;if(!unk[k])unk[k]={n:0,o};unk[k].n++}}
for(const k in unk)R.push({lv:'warn',m:'Unknown '+(unk[k].o.veh?'vehicle':'prop')+' "'+k+'" ('+unk[k].n+'): kept, but not shown in the game.',x:unk[k].o.x,y:unk[k].o.y});
for(const id of d.pal)if(!CMTI[id]&&(id!==d.ground||d.ter.some(v=>v===0)))R.push({lv:'warn',m:'Unknown terrain "'+id+'": shown as '+((CMTI[d.ground]||CMTER[0]).n.toLowerCase())+'.'});
for(const w of d.walls)if(!CMWI[w.s]){R.push({lv:'warn',m:'Unknown wall style "'+w.s+'": drawn as a plain wall.',x:w.x,y:w.y});break}
return R}
