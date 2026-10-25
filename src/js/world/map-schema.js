//# world/map-schema.js — Custom map format v2: terrain (CMTER), overlays, wall styles, layers (CMLAY), JSON read/write/validate/migrate, collision, draw order, problem checks
// ---------- custom maps: the data format ----------
// A custom map is plain data. The Map Workshop writes it, cmBuild() in world/custom-maps.js turns it into a playable map,
// and anyone (Claude included) can write one by hand: the JSON layout is in docs/ARCHITECTURE.md ("Custom map files").
// In memory a map ("doc") keeps its terrain as one byte per tile (ter, an index into pal) so painting stays fast; the
// roads layer is a second tile grid (rtr, an index into rpal, 0 = nothing) painted over it.
// Older files are upgraded on load by CMMIG (1 -> 2 added layers, 2 -> 3 the building kit's layers); nothing in them is dropped.
// Version 3 adds the building kit (world/kit-*.js): decals and effects (in obj), areas, paths and special features.
// Later additions to version 3 (optional, so no version bump): "lighting" (time of day, world/kit-lighting.js), "rot" on effects,
// "options" on decals (dead zombies).
// functions and registries only: nothing here runs during the first map build at boot
const CMVER=3,CMTILE=32,CMMIN=[20,15],CMMAX=128;
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
// the terrain that decides a tile: a road tile when there is one (and it's a known terrain), else the ground below it
function cmTopT(d,i){const r=d.rtr&&d.rtr[i];if(r){const t=CMTI[d.rpal[r]];if(t)return t}return CMTI[d.pal[d.ter[i]]]||null}
function cmWet(d,i){const t=cmTopT(d,i);return !!t&&t.walk===0}
// shoreline where liquid meets other ground (lq(tx,ty) says whether a tile shows liquid)
function cmShore(g,d,tx,ty,x,y,lq){const T=d.tile;const dry=(a,b)=>a>=0&&b>=0&&a<d.w&&b<d.h&&!lq(a,b);
// a lighter shallow band along the shore, then the dark edge and a line of foam
const S=[[dry(tx,ty-1),x,y,T,8,0],[dry(tx,ty+1),x,y+T-8,T,8,1],[dry(tx-1,ty),x,y,8,T,2],[dry(tx+1,ty),x+T-8,y,8,T,3]];
g.fillStyle='rgba(110,175,220,.28)';for(const s of S)if(s[0])g.fillRect(s[1],s[2],s[3],s[4]);
g.fillStyle='#23597d';if(S[0][0])g.fillRect(x,y,T,3);if(S[1][0])g.fillRect(x,y+T-3,T,3);if(S[2][0])g.fillRect(x,y,3,T);if(S[3][0])g.fillRect(x+T-3,y,3,T);
g.fillStyle='#a8d6f0';if(S[0][0])g.fillRect(x,y,T,1);if(S[1][0])g.fillRect(x,y+T-1,T,1);if(S[2][0])g.fillRect(x,y,1,T);if(S[3][0])g.fillRect(x+T-1,y,1,T)}
// the dry side of a shore: a band of wet sand on natural ground, a stone lip on paving and floors
function cmBank(g,d,tx,ty,x,y,lq,t){const T=d.tile,wet=(a,b)=>a>=0&&b>=0&&a<d.w&&b<d.h&&lq(a,b),nat=!t||t.cat=='ground';
const S=[[wet(tx,ty-1),x,y,T,6],[wet(tx,ty+1),x,y+T-6,T,6],[wet(tx-1,ty),x,y,6,T],[wet(tx+1,ty),x+T-6,y,6,T]];if(!S.some(s=>s[0]))return;
g.fillStyle=nat?'#c8b47a':'#d8d4c8';for(const s of S)if(s[0])g.fillRect(s[1],s[2],s[3],s[4]);g.fillStyle=nat?'#b09a62':'#a8a498';
if(S[0][0])g.fillRect(x,y,T,2);if(S[1][0])g.fillRect(x,y+T-2,T,2);if(S[2][0])g.fillRect(x,y,2,T);if(S[3][0])g.fillRect(x+T-2,y,2,T)}
// paint the ground (terrain, roads, shorelines, overlays) of tiles tx0..tx1-1, ty0..ty1-1. The game paints everything;
// the editor passes miss=1 (mark unknown terrain) and V={b,r} = which of the Terrain / Roads layers it shows (overlays go with Terrain)
function cmGround(g,d,tx0,ty0,tx1,ty1,miss,V){const T=d.tile,gd=CMTI[d.ground]||CMTER[0],vb=!V||V.b,vr=!V||V.r;
const top=i=>{const r=vr&&d.rtr&&d.rtr[i];if(r){const t=CMTI[d.rpal[r]];if(t)return t}return vb?CMTI[d.pal[d.ter[i]]]||gd:null},lq=(a,b)=>{const t=top(b*d.w+a);return !!t&&!!t.liq};
const X_=(x,y,c)=>{g.strokeStyle=c;g.lineWidth=2;g.beginPath();g.moveTo(x+4,y+4);g.lineTo(x+T-4,y+T-4);g.moveTo(x+T-4,y+4);g.lineTo(x+4,y+T-4);g.stroke()};
for(let ty=Math.max(0,ty0);ty<Math.min(d.h,ty1);ty++)for(let tx=Math.max(0,tx0);tx<Math.min(d.w,tx1);tx++){const i=ty*d.w+tx,x=tx*T,y=ty*T,t=CMTI[d.pal[d.ter[i]]];
if(vb){(t||gd).f(g,x,y,tx,ty);if(!t&&miss)X_(x,y,'#ff3a5a')}else{g.fillStyle=(tx+ty)%2?'#1a231c':'#151d17';g.fillRect(x,y,T,T)}
const ri=d.rtr?d.rtr[i]:0;if(ri&&vr){const rt=CMTI[d.rpal[ri]];if(rt)rt.f(g,x,y,tx,ty);else if(miss)X_(x,y,'#ff9a3a')}
const tp=top(i);if(tp&&tp.liq)cmShore(g,d,tx,ty,x,y,lq);else if(tp){cmBank(g,d,tx,ty,x,y,lq,tp);if(tp.curb)cmCurbs(g,d,tx,ty,x,y,top)}if(vb){const o=d.ovl[i];if(o){const q=CMOI[d.opal[o]];if(q)q.f(g,x,y,tx,ty,d)}}}}

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
const cmOwn=(T,k)=>Object.prototype.hasOwnProperty.call(T,k);

// ----- layers -----
// Bottom to top. The two tile layers are always first (Terrain, then Roads & paths); every other layer holds objects:
// props, vehicles, walls, spawn points and zones each have a layer (ly). Layer order is draw order, in the editor and in the game.
// hid and lock are editor settings (saved with the map): a hidden layer is still in the game, a locked one can't be edited.
const CMLAY=[['terrain','Terrain','t'],['roads','Roads & paths','t'],['ground','Ground detail','o'],['buildings','Buildings','o'],['walls','Walls & collision','o'],['env','Environmental props','o'],['interior','Interior props','o'],['vehicles','Vehicles','o'],['effects','Effects & lights','o'],['spawns','Zombie spawns','o'],['features','Special features','o']];
function cmLayers(){return CMLAY.map(([id,n,k])=>({id,n,k,hid:0,lock:0}))}
function cmLy(d,id){return d.layers.find(l=>l.id===id)||null}
// the layer something goes on by default; kind: 'o' prop / vehicle / decal / effect, 'w' wall, 's' spawn point, 'z' spawn zone,
// 'a' area, 'l' path, 'f' special feature
function cmKindLy(kind,o){if(kind=='w')return'walls';if(kind=='s'||kind=='z')return'spawns';if(kind=='f')return'features';
if(kind=='a'){const T=o&&cmArea(o.a);return !T?'ground':T.cat=='struct'?'buildings':T.cat=='effect'&&T.id!='shade'?'effects':'ground'}
if(kind=='l'){const T=o&&cmPath(o.p);return T&&T.cat=='barrier'?'walls':'ground'}
if(o&&o.dc)return'ground';if(o&&o.fx)return'effects';if(o&&o.veh)return'vehicles';
const c=o&&typeof EDPN!='undefined'&&cmOwn(EDPN,o.k)?EDPN[o.k][1]:'';return{buildings:'buildings',vehicles:'vehicles',furniture:'interior',store:'interior',kitchen:'interior',living:'interior',bedroom:'interior',bath:'interior',garage:'interior'}[c]||'env'}
// that layer if this map has it, else the top object layer (null when the map has none)
function cmDefLy(d,kind,o){const id=cmKindLy(kind,o),l=cmLy(d,id);if(l&&l.k=='o')return id;const ol=d.layers.filter(q=>q.k=='o');return ol.length?ol[ol.length-1].id:null}

// ----- collision: everything a custom map adds to WL -----
function cmVeh(o){const s=cmHW(o.veh);if(!s)return null;return{k:o.veh,x:o.x,y:o.y,a:(o.r||0)*Math.PI/180,L:s[0],W:s[1],c:o.c||undefined,st:o.c2||undefined,dmg:o.dmg?1:0,burn:o.burn?1:0,tx:o.tx||undefined}}
// a solid prop's footprint (OB[k].c) turned with the prop, as a box
// cf on a prop: its collision flag (2 = see-through, like the forest trees' trunks), else 1
function cmFoot(o){const B=cmOB(o.k);if(!B||!B.c)return null;const cw=B.c[0],ch=B.c[1],r=B.nr?0:(((o.r||0)%360)+360)%360,cf=B.cf||1;if(!r)return[o.x-cw/2,o.y-ch,cw,ch,cf];
const a=r*Math.PI/180,c=Math.cos(a),s=Math.sin(a);let x0=1e9,y0=1e9,x1=-1e9,y1=-1e9;for(const[px,py]of[[-cw/2,-ch],[cw/2,-ch],[-cw/2,0],[cw/2,0]]){const X_=o.x+px*c-py*s,Y_=o.y+px*s+py*c;x0=Math.min(x0,X_);y0=Math.min(y0,Y_);x1=Math.max(x1,X_);y1=Math.max(y1,Y_)}return[x0,y0,x1-x0,y1-y0,cf]}
// a vehicle's collision, built by the same code the highway maps use (hwCol)
function cmVehCol(o,out){const v=cmVeh(o);if(!v)return;const keep=WL;WL=[];try{hwCol(v)}finally{const r=WL;WL=keep;for(const w of r)out.push(w)}}
// is it solid? sol true/false is the map maker's choice; without one: walls and vehicles are, props are when the prop has a base size
function cmSolid(o,kind){if(o.dc||o.fx)return false;if(o.sol===false)return false;if(o.sol===true)return true;if(kind=='w'){const s=CMWI[o.s];return !(s&&s.walk)}
if(kind=='a'){const T=cmArea(o.a);return !!(T&&T.fl!=null)}if(kind=='l'){const T=cmPath(o.p);return !!(T&&T.fl!=null)}if(o.veh)return !!cmHW(o.veh);const B=cmOB(o.k);return !!(B&&B.c)}
// collision shapes drawn in the editor, separate from the picture. Offsets are from the object's x,y; boxes stay upright.
//   {t:'r',x,y,w,h} a box; {t:'c',x,y,r} a circle. The game only has boxes, so a circle becomes a stack of thin boxes (cmShapeBoxes).
function cmShapeBoxes(o,fl){const s=o.sh,f=fl==null?1:fl;if(!s)return[];if(s.t=='r')return[[o.x+s.x,o.y+s.y,s.w,s.h,f]];
const r=s.r,cx=o.x+s.x,cy=o.y+s.y,n=Math.max(3,Math.ceil(r/4)),hs=2*r/n,out=[];for(let i=0;i<n;i++){const y0=cy-r+i*hs,dy=y0+hs/2-cy,hw=Math.sqrt(Math.max(0,r*r-dy*dy));if(hw>.5)out.push([cx-hw,y0,hw*2,hs,f])}return out}
// a solid prop with no base size of its own (turned solid by the map maker): a strip along the bottom of its picture
function cmAutoBox(o){const B=cmOB(o.k);if(!B)return null;const w=Math.max(6,B.w*.8),h=Math.max(6,Math.min(12,B.h*.4));return[o.x-w/2,o.y-h,w,h,1]}
// the collision boxes of one prop or vehicle
function cmObjBoxes(o){if(o.dc||o.fx||!cmSolid(o,'o'))return[];if(o.sh)return cmShapeBoxes(o,o.veh?1:(cmOB(o.k)||{}).cf||1);if(o.veh){const out=[];cmVehCol(o,out);return out}const f=cmFoot(o)||cmAutoBox(o);return f?[f]:[]}
// turn a shape with its object (deg = how far the object turned): the offset turns; a box turned a quarter swaps width and height
function cmTurnShape(s,deg){if(!s)return s;const a=deg*Math.PI/180,c=Math.cos(a),sn=Math.sin(a),q=((Math.round(deg/90)%4)+4)%4,qt=Math.abs(deg/90-Math.round(deg/90))<1e-9;
if(s.t=='c'){const x=s.x*c-s.y*sn,y=s.x*sn+s.y*c;return{t:'c',x:cmR1(x),y:cmR1(y),r:s.r}}
const mx=s.x+s.w/2,my=s.y+s.h/2,nx=mx*c-my*sn,ny=mx*sn+my*c,sw=qt&&q%2==1;const w=sw?s.h:s.w,h=sw?s.w:s.h;return{t:'r',x:cmR1(nx-w/2),y:cmR1(ny-h/2),w,h}}
// a box minus some rects (what is left, as up to four boxes per rect)
function cmMinus(B,R){let L=B;for(const r of R){const n=[];for(const b of L){if(r[0]>=b[0]+b[2]||r[0]+r[2]<=b[0]||r[1]>=b[1]+b[3]||r[1]+r[3]<=b[1]){n.push(b);continue}
const y0=Math.max(b[1],r[1]),y1=Math.min(b[1]+b[3],r[1]+r[3]);for(const q of[[b[0],b[1],b[2],r[1]-b[1]],[b[0],r[1]+r[3],b[2],b[1]+b[3]-(r[1]+r[3])],[b[0],y0,r[0]-b[0],y1-y0],[r[0]+r[2],y0,b[0]+b[2]-(r[0]+r[2]),y1-y0]])if(q[2]>=1&&q[3]>=1)n.push([q[0],q[1],q[2],q[3],b[4]])}L=n}return L}
// the boxes that make water walkable (docks and bridges)
function cmWalkR(d){return(d.areas||[]).filter(a=>{const T=cmArea(a.a);return T&&T.walk&&a.w>0&&a.h>0}).map(a=>[a.x,a.y,a.w,a.h])}
function cmColl(d){const out=[],T=d.tile,WR=cmWalkR(d);
for(const w of d.walls){const s=CMWI[w.s]||CMWI.wall;if(w.w>0&&w.h>0&&cmSolid(w,'w'))out.push([w.x,w.y,w.w,w.h,s.fl])}
// water: one see-through blocker per run of wet tiles, runs that repeat on the next row are merged downwards (tiles under a dock or bridge are dry)
const dry=(tx,ty)=>{const cx=tx*T+T/2,cy=ty*T+T/2;return WR.some(r=>cx>r[0]&&cx<r[0]+r[2]&&cy>r[1]&&cy<r[1]+r[3])};
let open={};for(let ty=0;ty<=d.h;ty++){const now={};if(ty<d.h){let run=-1;for(let tx=0;tx<=d.w;tx++){const wet=tx<d.w&&cmWet(d,ty*d.w+tx)&&!(WR.length&&dry(tx,ty));if(wet&&run<0)run=tx;else if(!wet&&run>=0){const k=run+','+tx;now[k]=open[k]?(open[k][3]+=T,open[k]):[run*T,ty*T,(tx-run)*T,T,2];run=-1}}}
for(const k in open)if(!now[k])out.push(open[k]);open=now}
for(const o of d.obj)for(const b of cmObjBoxes(o))out.push(b);
for(const a of d.areas||[])for(const b of cmAreaBoxes(a))out.push(b);
for(const l of d.paths||[]){const B=cmPathBoxes(l);for(const b of WR.length?cmMinus(B,WR):B)out.push(b)}return out}

// ----- draw order -----
// walls, props and vehicles back to front: by layer, then draw order (z), then how far down the map they stand, then age.
// vis=1 leaves out what the editor hides (hidden layers and hidden objects); the game draws everything.
function cmBase(o){if(!o.veh)return o.y;const v=cmVeh(o);if(!v)return o.y;return o.y+Math.abs(Math.sin(v.a))*v.L/2+Math.abs(Math.cos(v.a))*v.W/2}
// kit pieces of the same layer and order sit in a fixed stack (pri): floors under rugs under decals under props, darkness first
function cmPri(o,t){if(t=='a'){const T=cmArea(o.a);return T?T.pri||0:0}if(t=='l'){const T=cmPath(o.p);return T?T.pri||0:0}if(o.dc)return -10;if(o.fx)return 50;return 0}
function cmPathBase(o){let m=o.y;for(const p of o.pts||[])m=Math.max(m,o.y+p[1]);return m}
// entries: {o, t: 'w' wall | 'o' prop / vehicle / decal / effect | 'a' area | 'l' path, w (true for walls), li layer, z order, b depth, i age}
function cmDrawList(d,vis){const LI=new Map(d.layers.map((l,i)=>[l.id,i])),L=[];
const add=(o,t,i)=>{const li=LI.has(o.ly)?LI.get(o.ly):d.layers.length;if(vis&&(o.hd||li<d.layers.length&&d.layers[li].hid))return;L.push({o,t,w:t=='w',li,z:(o.z||0)+cmPri(o,t),b:t=='w'||t=='a'?o.y+o.h:t=='l'?cmPathBase(o):cmBase(o),i})};
d.walls.forEach((o,i)=>add(o,'w',i));d.obj.forEach((o,i)=>add(o,'o',1e6+i));(d.areas||[]).forEach((o,i)=>add(o,'a',2e6+i));(d.paths||[]).forEach((o,i)=>add(o,'l',3e6+i));L.sort((a,b)=>a.li-b.li||a.z-b.z||a.b-b.b||a.i-b.i);return L}
// where the run starts: the player start, or the middle of the map when there is none
function cmStart(d){return d.start||{x:Math.round(d.w*d.tile/2),y:Math.round(d.h*d.tile/2)}}

// ----- new maps, ids -----
function cmUid(p){return p+Date.now().toString(36).slice(-4)+Math.floor(Math.random()*1679616).toString(36).padStart(4,'0')}
function cmNew(o){o=o||{};const w=cl(Math.round(+o.w||72),CMMIN[0],CMMAX),h=cl(Math.round(+o.h||56),CMMIN[1],CMMAX),gd=CMTI[o.ground]?o.ground:'grass',t=new Date().toISOString();
return{v:CMVER,id:cmUid('m'),name:String(o.name||'Untitled map').replace(/[<>]/g,'').slice(0,40),desc:String(o.desc||'').replace(/[<>]/g,'').slice(0,240),tile:CMTILE,w,h,ground:gd,pal:[gd],ter:new Uint8Array(w*h),opal:[''],ovl:new Uint8Array(w*h),
rpal:[''],rtr:new Uint8Array(w*h),layers:cmLayers(),obj:[],walls:[],areas:[],paths:[],feats:[],start:{x:Math.round(w*CMTILE/2),y:Math.round(h*CMTILE/2)},spawns:[],zones:[],created:t,updated:t,extra:{}}}
// palette index for a terrain / overlay / road id (added on first use)
function cmPi(d,id){let i=d.pal.indexOf(id);if(i<0){if(d.pal.length>=255)return 0;d.pal.push(id);i=d.pal.length-1}return i}
function cmOi(d,id){if(!id)return 0;let i=d.opal.indexOf(id);if(i<0){if(d.opal.length>=255)return 0;d.opal.push(id);i=d.opal.length-1}return i}
function cmRi(d,id){if(!id)return 0;let i=d.rpal.indexOf(id);if(i<0){if(d.rpal.length>=255)return 0;d.rpal.push(id);i=d.rpal.length-1}return i}
// a deep copy (tile arrays copied too)
function cmClone(d){const c=JSON.parse(JSON.stringify(Object.assign({},d,{ter:null,ovl:null,rtr:null})));c.ter=new Uint8Array(d.ter);c.ovl=new Uint8Array(d.ovl);c.rtr=new Uint8Array(d.rtr);return c}

// ----- writing a map file -----
const CMCH='ABCDEFGHIJKLMNOPQRSTUVWXYZhijklpqruyz0123456789#$%&*+-=?@^~!:;<>/|()[]{}';
function cmLeg(ids,reg,used){const L={},by={};for(const id of ids){if(id==null||by[id]!=null)continue;let c=reg[id]&&reg[id].ch;if(!c||used.has(c))c=[...CMCH].find(x=>!used.has(x));if(!c)throw new Error('too many terrain types');used.add(c);by[id]=c;L[c]=id}return{L,by}}
const cmR1=v=>Math.round(v*10)/10;
// a sparse tile grid ('.' = nothing) as {legend, rows}, or null when it is empty
function cmSparse(d,A,P,reg){const u=new Set();for(let i=0;i<A.length;i++)if(A[i])u.add(P[A[i]]);if(!u.size)return null;const O=cmLeg([...u],reg,new Set(['.'])),r=[];
for(let y=0;y<d.h;y++){let s='';for(let x=0;x<d.w;x++){const v=A[y*d.w+x];s+=v?O.by[P[v]]:'.'}r.push(s)}return{legend:O.L,rows:r}}
// the step-2 fields every object can have
function cmWObj(o,p,shape){if(o.ly)p.layer=o.ly;if(o.z)p.order=o.z;if(o.sol===true||o.sol===false)p.solid=o.sol;
if(shape&&o.sh)p.shape=o.sh.t=='c'?{type:'circle',x:cmR1(o.sh.x),y:cmR1(o.sh.y),r:cmR1(o.sh.r)}:{type:'rect',x:cmR1(o.sh.x),y:cmR1(o.sh.y),w:cmR1(o.sh.w),h:cmR1(o.sh.h)};
if(o.lk)p.locked=true;if(o.hd)p.editorHidden=true;return p}
function cmWrite(d){const used=new Set(['.']),tu=new Set([d.ground]);for(let i=0;i<d.ter.length;i++)tu.add(d.pal[d.ter[i]]);
const T=cmLeg([...tu],CMTI,used),rows=[];for(let y=0;y<d.h;y++){let s='';for(let x=0;x<d.w;x++)s+=T.by[d.pal[d.ter[y*d.w+x]]];rows.push(s)}
const out=Object.assign({},d.extra||{},{format:'zombdash-map',version:CMVER,id:d.id,name:d.name,description:d.desc||'',tileSize:d.tile,width:d.w,height:d.h,ground:d.ground,terrain:{legend:T.L,rows}});
if(d.lt&&typeof d.lt.t=='string'&&d.lt.t){out.lighting={time:d.lt.t,amount:Math.round(cl(+d.lt.a||0,0,1)*100)/100}}else delete out.lighting;
const rd=cmSparse(d,d.rtr,d.rpal,CMTI);if(rd)out.roads=rd;else delete out.roads;
const ov=cmSparse(d,d.ovl,d.opal,CMOI);if(ov)out.overlay=ov;else delete out.overlay;
out.layers=d.layers.map(l=>{const q={id:l.id,name:l.n,kind:l.k=='t'?'tiles':'objects'};if(l.hid)q.editorHidden=true;if(l.lock)q.locked=true;return q});
out.props=d.obj.filter(o=>!o.veh&&!o.dc&&!o.fx).map(o=>{const p={id:o.id,kind:o.k,x:cmR1(o.x),y:cmR1(o.y)};if(o.r)p.rot=cmR1(o.r);if(o.vr!=null)p.var=Math.round(o.vr*100)/100;if(o.c)p.color=o.c;if(o.tx)p.text=o.tx;return cmWObj(o,p,1)});
out.vehicles=d.obj.filter(o=>o.veh).map(o=>{const p={id:o.id,kind:o.veh,x:cmR1(o.x),y:cmR1(o.y),rot:cmR1(o.r||0)};if(o.c)p.color=o.c;if(o.c2)p.color2=o.c2;if(o.dmg)p.damaged=true;if(o.burn)p.burnt=true;if(o.tx)p.text=o.tx;return cmWObj(o,p,1)});
// the building kit (version 3): written only when the map has some
const kit=(nm,L)=>{if(L.length)out[nm]=L;else delete out[nm]},opt=(o,p)=>{if(o.o&&Object.keys(o.o).length)p.options=Object.assign({},o.o);return p};
kit('decals',d.obj.filter(o=>o.dc).map(o=>{const p={id:o.id,kind:o.dc,x:cmR1(o.x),y:cmR1(o.y)};if(o.r)p.rot=cmR1(o.r);if(o.sc!=null&&o.sc!==1)p.scale=Math.round(o.sc*100)/100;if(o.c)p.color=o.c;if(o.op!=null&&o.op!==1)p.opacity=Math.round(o.op*100)/100;if(o.tx)p.text=o.tx;if(o.vr!=null)p.var=Math.round(o.vr*100)/100;return cmWObj(o,opt(o,p),0)}));
kit('effects',d.obj.filter(o=>o.fx).map(o=>{const p={id:o.id,kind:o.fx,x:cmR1(o.x),y:cmR1(o.y)};if(o.r)p.rot=cmR1(o.r);if(o.sc!=null&&o.sc!==1)p.size=Math.round(o.sc*100)/100;if(o.c)p.color=o.c;return cmWObj(o,opt(o,p),0)}));
kit('areas',(d.areas||[]).map(o=>{const p={id:o.id,kind:o.a,x:cmR1(o.x),y:cmR1(o.y),w:cmR1(o.w),h:cmR1(o.h)};if(o.c)p.color=o.c;if(o.c2)p.color2=o.c2;if(o.tx)p.text=o.tx;return cmWObj(o,opt(o,p),0)}));
kit('paths',(d.paths||[]).map(o=>{const p={id:o.id,kind:o.p,points:(o.pts||[]).map(q=>[cmR1(o.x+q[0]),cmR1(o.y+q[1])])};if(o.w)p.width=cmR1(o.w);if(o.c)p.color=o.c;if(o.sharp!=null)p.sharp=!!o.sharp;return cmWObj(o,opt(o,p),0)}));
kit('features',(d.feats||[]).map(o=>{const p={id:o.id,kind:o.f};if(o.pts){p.nodes=o.pts.map(q=>[cmR1(o.x+q[0]),cmR1(o.y+q[1])]);p.edges=(o.e||[]).map(e=>[e[0],e[1]])}else{p.x=cmR1(o.x);p.y=cmR1(o.y);p.w=cmR1(o.w);p.h=cmR1(o.h)}const q=cmWObj(o,opt(o,p),0);delete q.order;delete q.solid;return q}));
out.walls=d.walls.map(w=>{const p={id:w.id,x:cmR1(w.x),y:cmR1(w.y),w:cmR1(w.w),h:cmR1(w.h),style:w.s||'wall'};if(w.c)p.color=w.c;return cmWObj(w,p,0)});
if(d.start)out.playerStart={x:cmR1(d.start.x),y:cmR1(d.start.y)};else delete out.playerStart;
out.zombieSpawns={points:d.spawns.map(s=>cmWObj(s,{id:s.id,x:cmR1(s.x),y:cmR1(s.y),enabled:s.on!==false},0)),zones:d.zones.map(z=>cmWObj(z,{id:z.id,x:cmR1(z.x),y:cmR1(z.y),w:cmR1(z.w),h:cmR1(z.h),enabled:z.on!==false},0))};
out.created=d.created;out.updated=d.updated;
// the order props and vehicles were placed in (the last tie-breaker of the draw order)
out.order=d.obj.map(o=>o.id);return out}

// ----- reading a map file -----
// cmRead(json or text) -> {doc, errors, warnings}. Errors mean the file can't be used as it is (nothing is changed or thrown away);
// warnings mean it loads but something in it won't show up in the game.
// CMMIG[n](json) upgrades a version n file to version n+1 (the stored file itself is only rewritten when the map is saved)
const CMMIG={
// 1 -> 2: layers. Every object goes on the layer of its kind; everything else stays exactly as it was.
1(j){j.layers=CMLAY.map(([id,name,k])=>({id,name,kind:k=='t'?'tiles':'objects'}));
const each=(a,f)=>{if(Array.isArray(a))for(const p of a)if(p&&typeof p=='object'&&p.layer==null)f(p)};
each(j.props,p=>{p.layer=cmKindLy('o',{k:p.kind})});each(j.vehicles,p=>{p.layer='vehicles'});each(j.walls,p=>{p.layer='walls'});
if(j.zombieSpawns&&typeof j.zombieSpawns=='object'){each(j.zombieSpawns.points,p=>{p.layer='spawns'});each(j.zombieSpawns.zones,p=>{p.layer='spawns'})}return j},
// 2 -> 3: the building kit. Its three layers are added (Ground detail just above the tile layers, Effects & lights and Special
// features on top) unless the file already has layers with those ids; everything else stays exactly as it was.
2(j){if(!Array.isArray(j.layers))return j;const has=id=>j.layers.some(l=>l&&l.id===id),add=(at,id)=>{const z=CMLAY.find(q=>q[0]==id);j.layers.splice(at,0,{id,name:z[1],kind:'objects'})};
if(!has('ground')){let k=0;while(k<j.layers.length&&j.layers[k]&&j.layers[k].kind=='tiles')k++;add(k,'ground')}if(!has('effects')){const k=j.layers.findIndex(l=>l&&l.id=='spawns');add(k<0?j.layers.length:k,'effects')}if(!has('features'))add(j.layers.length,'features');return j}};
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
const d={v:CMVER,id:typeof j.id=='string'&&j.id?j.id.slice(0,40):cmUid('m'),name:String(j.name==null?'Untitled map':j.name).replace(/[<>]/g,'').slice(0,40)||'Untitled map',desc:String(j.description||'').replace(/[<>]/g,'').slice(0,240),tile:CMTILE,w,h,ground:'grass',pal:[],ter:new Uint8Array(w*h),opal:[''],ovl:new Uint8Array(w*h),rpal:[''],rtr:new Uint8Array(w*h),layers:[],obj:[],walls:[],areas:[],paths:[],feats:[],start:null,spawns:[],zones:[],created:typeof j.created=='string'?j.created:new Date().toISOString(),updated:typeof j.updated=='string'?j.updated:new Date().toISOString(),extra:{}};
if(typeof j.ground=='string'&&j.ground)d.ground=j.ground;else if(j.ground!=null)E.push('"ground" must be a terrain name.');
if(!CMTI[d.ground])Wn.push('Unknown default ground "'+d.ground+'": grass is shown instead.');
d.pal.push(d.ground);
// tile grids
const grid=(G,nm,leg,cb)=>{if(!G||typeof G!='object'||!G.legend||typeof G.legend!='object'||!Array.isArray(G.rows)){E.push('"'+nm+'" needs a "legend" and "rows".');return}
for(const c in G.legend)if(c.length!==1||typeof G.legend[c]!='string'){E.push('"'+nm+'.legend" keys must be single characters naming a type.');return}
if(G.rows.length!==h){E.push('"'+nm+'.rows" has '+G.rows.length+' rows, the map is '+h+' tiles tall.');return}
for(let y=0;y<h;y++){const r=G.rows[y];if(typeof r!='string'||r.length!==w){E.push('"'+nm+'.rows['+y+']" must be a string of '+w+' characters.');return}
for(let x=0;x<w;x++){const c=r[x];if(leg&&c==='.')continue;const id=cmOwn(G.legend,c)?G.legend[c]:null;if(id==null){E.push('"'+nm+'.rows['+y+']" uses "'+c+'", which is not in the legend.');return}cb(y*w+x,id)}}};
if(j.terrain==null){/* all ground */}else grid(j.terrain,'terrain',0,(i,id)=>{d.ter[i]=cmPi(d,id)});
if(j.roads!=null)grid(j.roads,'roads',1,(i,id)=>{d.rtr[i]=cmRi(d,id)});
if(j.overlay!=null)grid(j.overlay,'overlay',1,(i,id)=>{d.ovl[i]=cmOi(d,id)});
for(const id of d.pal)if(id!==d.ground&&!CMTI[id])Wn.push('Unknown terrain "'+id+'": '+(CMTI[d.ground]?CMTI[d.ground].n:'grass').toLowerCase()+' is shown instead.');
for(const id of d.rpal)if(id&&!CMTI[id])Wn.push('Unknown road terrain "'+id+'": the ground below it is shown instead.');
for(const id of d.opal)if(id&&!CMOI[id])Wn.push('Unknown overlay "'+id+'": it is not shown.');
// layers: the two tile layers always first, then the object layers in the file's order
const list=(a,nm)=>{if(a==null)return[];if(!Array.isArray(a)){E.push('"'+nm+'" must be a list.');return[]}return a};
const bad=(nm,i,why)=>E.push('"'+nm+'['+i+']" '+why);
// no "layers" at all: the default layers (a file that lists them keeps its own)
const LY=[];list(j.layers==null?CMLAY.map(([id,name,k])=>({id,name,kind:k=='t'?'tiles':'objects'})):j.layers,'layers').forEach((l,i)=>{if(!l||typeof l.id!='string'||!/^[\w-]{1,24}$/.test(l.id))return bad('layers',i,'needs an "id" of letters, numbers, - or _ (up to 24).');
if(l.kind!=='tiles'&&l.kind!=='objects')return bad('layers',i,'needs "kind": "tiles" or "objects".');if(l.kind=='tiles'&&l.id!=='terrain'&&l.id!=='roads')return bad('layers',i,'is a tile layer, but only "terrain" and "roads" can be.');
if(l.kind=='objects'&&(l.id=='terrain'||l.id=='roads'))return bad('layers',i,'can\'t use the id "'+l.id+'" for an object layer.');
if(LY.some(q=>q.id===l.id))return bad('layers',i,'has the same id as another layer ("'+l.id+'").');LY.push({id:l.id,n:String(l.name==null?l.id:l.name).replace(/[<>]/g,'').slice(0,32)||l.id,k:l.kind=='tiles'?'t':'o',hid:l.editorHidden?1:0,lock:l.locked?1:0})});
for(const id of['roads','terrain'])if(!LY.some(q=>q.id===id)){const z=CMLAY.find(q=>q[0]==id);LY.unshift({id,n:z[1],k:'t',hid:0,lock:0})}
d.layers=LY.filter(q=>q.id=='terrain').concat(LY.filter(q=>q.id=='roads'),LY.filter(q=>q.k=='o'));
const ids=new Set(),uid=(x,p)=>{let s=typeof x=='string'&&x?x.slice(0,24):cmUid(p);while(ids.has(s))s=cmUid(p);ids.add(s);return s};
const unk=Object.create(null),newLy=new Set();
// the step-2 fields every object can have (layer, order, solid, shape, locked, editorHidden)
const obj=(p,o,nm,i,kind,shape)=>{let ly=p.layer;if(ly==null)ly=cmKindLy(kind,o);if(typeof ly!='string'||!/^[\w-]{1,24}$/.test(ly)){bad(nm,i,'has a "layer" that is not a layer id.');return 0}
const L_=cmLy(d,ly);if(L_&&L_.k=='t'){bad(nm,i,'is on the tile layer "'+ly+'": objects go on object layers.');return 0}if(!L_){d.layers.push({id:ly,n:ly,k:'o',hid:0,lock:0});newLy.add(ly)}o.ly=ly;
if(p.order!=null){if(!num(p.order)){bad(nm,i,'has an "order" that is not a number.');return 0}if(Math.round(p.order))o.z=Math.round(p.order)}
if(p.solid!=null){if(typeof p.solid!='boolean'){bad(nm,i,'has a "solid" that is not true or false.');return 0}o.sol=p.solid}
if(p.shape!=null){const s=p.shape;if(!shape){bad(nm,i,'can\'t have a "shape".');return 0}
if(s&&s.type=='rect'&&num(s.x)&&num(s.y)&&num(s.w)&&num(s.h)&&s.w>0&&s.h>0)o.sh={t:'r',x:s.x,y:s.y,w:s.w,h:s.h};
else if(s&&s.type=='circle'&&num(s.x)&&num(s.y)&&num(s.r)&&s.r>0)o.sh={t:'c',x:s.x,y:s.y,r:s.r};else{bad(nm,i,'has a "shape" that is not {"type":"rect","x","y","w","h"} or {"type":"circle","x","y","r"}.');return 0}}
if(p.locked)o.lk=true;if(p.editorHidden)o.hd=true;return 1};
list(j.props,'props').forEach((p,i)=>{if(!p||typeof p.kind!='string'||!num(p.x)||!num(p.y))return bad('props',i,'needs "kind", "x" and "y".');if(p.rot!=null&&!num(p.rot))return bad('props',i,'has a "rot" that is not a number.');
const o={id:uid(p.id,'p'),k:p.kind,x:p.x,y:p.y,r:p.rot||0};if(num(p.var))o.vr=cl(p.var,0,1);if(typeof p.color=='string'&&/^#[0-9a-f]{6}$/i.test(p.color))o.c=p.color.toLowerCase();if(typeof p.text=='string'&&p.text)o.tx=cmTxt(p.text,40);if(!obj(p,o,'props',i,'o',1))return;d.obj.push(o);if(!cmOB(p.kind))unk[p.kind]=(unk[p.kind]||0)+1});
list(j.vehicles,'vehicles').forEach((p,i)=>{if(!p||typeof p.kind!='string'||!num(p.x)||!num(p.y))return bad('vehicles',i,'needs "kind", "x" and "y".');if(p.rot!=null&&!num(p.rot))return bad('vehicles',i,'has a "rot" that is not a number.');
const o={id:uid(p.id,'v'),veh:p.kind,x:p.x,y:p.y,r:p.rot||0};if(typeof p.color=='string'&&/^#[0-9a-f]{3,8}$/i.test(p.color))o.c=p.color;if(typeof p.color2=='string'&&/^#[0-9a-f]{3,8}$/i.test(p.color2))o.c2=p.color2;if(p.damaged)o.dmg=1;if(p.burnt)o.burn=1;if(typeof p.text=='string'&&p.text)o.tx=cmTxt(p.text,40);if(!obj(p,o,'vehicles',i,'o',1))return;d.obj.push(o);if(!cmHW(p.kind))unk[p.kind+' (vehicle)']=(unk[p.kind+' (vehicle)']||0)+1});
// ----- the building kit (version 3) -----
const col=c=>typeof c=='string'&&/^#[0-9a-f]{6}$/i.test(c)?c.toLowerCase():null,pts=a=>Array.isArray(a)&&a.every(q=>Array.isArray(q)&&q.length==2&&num(q[0])&&num(q[1]))?a:null;
const opts=(p,o,nm,i)=>{if(p.options==null)return 1;const v=p.options;if(!v||typeof v!='object'||Array.isArray(v)){bad(nm,i,'has "options" that are not an object.');return 0}const r={};let n=0;
for(const k of Object.keys(v)){if(n>=16||!/^[a-zA-Z]\w{0,15}$/.test(k))continue;const x=v[k];if(typeof x=='number'&&isFinite(x)||typeof x=='boolean')r[k]=x;else if(typeof x=='string')r[k]=x.replace(/[<>]/g,'').slice(0,24);else continue;n++}if(n)o.o=r;return 1};
const ukit={};const ku=(t,k)=>{ukit[t+' "'+k+'"']=(ukit[t+' "'+k+'"']||0)+1};
list(j.decals,'decals').forEach((p,i)=>{if(!p||typeof p.kind!='string'||!p.kind||!num(p.x)||!num(p.y))return bad('decals',i,'needs "kind", "x" and "y".');if(p.rot!=null&&!num(p.rot))return bad('decals',i,'has a "rot" that is not a number.');if(p.scale!=null&&!(num(p.scale)&&p.scale>0))return bad('decals',i,'has a "scale" that is not a positive number.');
const o={id:uid(p.id,'d'),dc:p.kind,x:p.x,y:p.y,r:p.rot||0};if(p.scale!=null&&p.scale!==1)o.sc=cl(p.scale,.25,4);if(col(p.color))o.c=col(p.color);if(num(p.opacity)&&p.opacity!==1)o.op=cl(p.opacity,.05,1);if(typeof p.text=='string'&&p.text)o.tx=cmTxt(p.text,40);if(num(p.var))o.vr=cl(p.var,0,1);if(!opts(p,o,'decals',i)||!obj(p,o,'decals',i,'o',0))return;d.obj.push(o);if(!cmDec(p.kind))ku('decal',p.kind)});
list(j.effects,'effects').forEach((p,i)=>{if(!p||typeof p.kind!='string'||!p.kind||!num(p.x)||!num(p.y))return bad('effects',i,'needs "kind", "x" and "y".');if(p.size!=null&&!(num(p.size)&&p.size>0))return bad('effects',i,'has a "size" that is not a positive number.');if(p.rot!=null&&!num(p.rot))return bad('effects',i,'has a "rot" that is not a number.');
const o={id:uid(p.id,'x'),fx:p.kind,x:p.x,y:p.y};if(p.rot)o.r=p.rot;if(p.size!=null&&p.size!==1)o.sc=cl(p.size,.25,4);if(col(p.color))o.c=col(p.color);if(!opts(p,o,'effects',i)||!obj(p,o,'effects',i,'o',0))return;d.obj.push(o);if(!cmFx(p.kind))ku('effect',p.kind)});
list(j.areas,'areas').forEach((p,i)=>{if(!p||typeof p.kind!='string'||!p.kind||!num(p.x)||!num(p.y)||!num(p.w)||!num(p.h)||p.w<=0||p.h<=0)return bad('areas',i,'needs "kind", "x", "y" and a positive "w" and "h".');
const o={id:uid(p.id,'a'),a:p.kind,x:p.x,y:p.y,w:p.w,h:p.h};if(col(p.color))o.c=col(p.color);if(col(p.color2))o.c2=col(p.color2);if(typeof p.text=='string'&&p.text)o.tx=cmTxt(p.text,40);if(!opts(p,o,'areas',i)||!obj(p,o,'areas',i,'a',0))return;d.areas.push(o);if(!cmArea(p.kind))ku('area',p.kind)});
list(j.paths,'paths').forEach((p,i)=>{const P=p&&pts(p.points);if(!p||typeof p.kind!='string'||!p.kind||!P||P.length<2)return bad('paths',i,'needs "kind" and "points": a list of at least two [x, y].');if(P.length>400)return bad('paths',i,'has more than 400 points.');if(p.width!=null&&!(num(p.width)&&p.width>0))return bad('paths',i,'has a "width" that is not a positive number.');
const o={id:uid(p.id,'l'),p:p.kind,x:P[0][0],y:P[0][1],pts:P.map(q=>[q[0]-P[0][0],q[1]-P[0][1]])};if(p.width!=null)o.w=p.width;if(col(p.color))o.c=col(p.color);if(typeof p.sharp=='boolean')o.sharp=p.sharp;if(!opts(p,o,'paths',i)||!obj(p,o,'paths',i,'l',0))return;d.paths.push(o);if(!cmPath(p.kind))ku('path',p.kind)});
list(j.features,'features').forEach((p,i)=>{if(!p||typeof p.kind!='string'||!p.kind)return bad('features',i,'needs a "kind".');let o;
if(p.nodes!=null){const N=pts(p.nodes);if(!N||!N.length)return bad('features',i,'has "nodes" that are not a list of [x, y].');const E=Array.isArray(p.edges)?p.edges:[];if(!E.every(e=>Array.isArray(e)&&e.length==2&&int(e[0])&&int(e[1])&&e[0]>=0&&e[1]>=0&&e[0]<N.length&&e[1]<N.length))return bad('features',i,'has "edges" that are not pairs of node numbers.');
o={id:uid(p.id,'f'),f:p.kind,x:N[0][0],y:N[0][1],pts:N.map(q=>[q[0]-N[0][0],q[1]-N[0][1]]),e:E.map(e=>[e[0],e[1]])}}
else{if(!num(p.x)||!num(p.y)||!num(p.w)||!num(p.h)||p.w<=0||p.h<=0)return bad('features',i,'needs "x", "y" and a positive "w" and "h" (or "nodes" and "edges" for a road graph).');o={id:uid(p.id,'f'),f:p.kind,x:p.x,y:p.y,w:p.w,h:p.h}}
if(!opts(p,o,'features',i)||!obj(p,o,'features',i,'f',0))return;d.feats.push(o);if(!cmFeat(p.kind))ku('special feature',p.kind)});
for(const k in ukit)Wn.push('Unknown '+k+' ('+ukit[k]+' placed): it is kept in the file but not shown in the game.');
for(const k in unk)Wn.push('Unknown '+(k.endsWith(' (vehicle)')?'vehicle "'+k.slice(0,-10)+'"':'prop "'+k+'"')+' ('+unk[k]+' placed): it is kept in the file but not shown in the game.');
if(Array.isArray(j.order)){const pos={};j.order.forEach((id,i)=>{if(typeof id=='string')pos[id]=i});d.obj.forEach((o,i)=>o._o=pos[o.id]!=null?pos[o.id]:1e6+i);d.obj.sort((a,b)=>a._o-b._o);for(const o of d.obj)delete o._o}
list(j.walls,'walls').forEach((q,i)=>{if(!q||!num(q.x)||!num(q.y)||!num(q.w)||!num(q.h)||q.w<=0||q.h<=0)return bad('walls',i,'needs "x", "y" and a positive "w" and "h".');const s=typeof q.style=='string'?q.style:'wall';if(!CMWI[s])Wn.push('Unknown wall style "'+s+'": drawn as a plain wall.');
const o={id:uid(q.id,'w'),x:q.x,y:q.y,w:q.w,h:q.h,s};if(typeof q.color=='string'&&/^#[0-9a-f]{6}$/i.test(q.color))o.c=q.color.toLowerCase();if(!obj(q,o,'walls',i,'w',0))return;d.walls.push(o)});
// time of day (world/kit-lighting.js): {"time": "day" | "morning" | "dusk" | "night", "amount": 0–1}
const lg=j.lighting;if(lg!=null){if(typeof lg!='object'||Array.isArray(lg))E.push('"lighting" must be an object with "time" and "amount".');else if(lg.amount!=null&&!num(lg.amount))E.push('"lighting.amount" must be a number from 0 to 1.');else{const tm=typeof lg.time=='string'&&lg.time?lg.time.replace(/[<>]/g,'').slice(0,16):'day';if(!cmLtP(tm))Wn.push('Unknown time of day "'+tm+'": the map shows in plain daylight.');d.lt={t:tm,a:num(lg.amount)?cl(lg.amount,0,1):cmLtDef(tm)}}}
const ps=j.playerStart;if(ps==null)Wn.push('No "playerStart": the player starts in the middle of the map.');else if(!num(ps.x)||!num(ps.y))E.push('"playerStart" needs "x" and "y".');else d.start={x:ps.x,y:ps.y};
const zs_=j.zombieSpawns;if(zs_!=null&&typeof zs_!='object')E.push('"zombieSpawns" must be an object with "points" and "zones".');else if(zs_){
list(zs_.points,'zombieSpawns.points').forEach((p,i)=>{if(!p||!num(p.x)||!num(p.y))return bad('zombieSpawns.points',i,'needs "x" and "y".');const o={id:uid(p.id,'s'),x:p.x,y:p.y,on:p.enabled!==false};if(!obj(p,o,'zombieSpawns.points',i,'s',0))return;d.spawns.push(o)});
list(zs_.zones,'zombieSpawns.zones').forEach((p,i)=>{if(!p||!num(p.x)||!num(p.y)||!num(p.w)||!num(p.h)||p.w<=0||p.h<=0)return bad('zombieSpawns.zones',i,'needs "x", "y" and a positive "w" and "h".');const o={id:uid(p.id,'z'),x:p.x,y:p.y,w:p.w,h:p.h,on:p.enabled!==false};if(!obj(p,o,'zombieSpawns.zones',i,'z',0))return;d.zones.push(o)})}
for(const id of newLy)Wn.push('Something is on a layer "'+id+'" that the file doesn\'t list: that layer was added.');
// fields this version doesn't know are kept and written back unchanged
const known=new Set(['format','version','id','name','description','tileSize','width','height','ground','terrain','roads','overlay','layers','props','vehicles','walls','playerStart','zombieSpawns','created','updated','order','decals','effects','areas','paths','features','lighting']);
for(const k in j)if(!known.has(k))d.extra[k]=j[k];
const W_=w*CMTILE,H_=h*CMTILE,out=d.obj.filter(o=>o.x<0||o.y<0||o.x>W_||o.y>H_).length;if(out)Wn.push(out+' prop'+(out>1?'s are':' is')+' outside the map edges.');
if(d.start&&(d.start.x<0||d.start.y<0||d.start.x>W_||d.start.y>H_))Wn.push('The player start is outside the map.');
if(!E.length)res.doc=d;return res}

// ----- checks shown in the editor's Problems list -----
// a walk grid like grid() builds in the game (16px cells, walls grown by 9px), then who can reach where the run starts
function cmWalk(d,C){const g=16,W_=d.w*d.tile,H_=d.h*d.tile,gw_=Math.ceil(W_/g),gh_=Math.ceil(H_/g),b=new Uint8Array(gw_*gh_),st=cmStart(d);
for(const w of C){const i0=Math.max(0,Math.ceil((w[0]-9-8)/g)),i1=Math.min(gw_-1,Math.floor((w[0]+w[2]+9-8)/g)),j0=Math.max(0,Math.ceil((w[1]-9-8)/g)),j1=Math.min(gh_-1,Math.floor((w[1]+w[3]+9-8)/g));
for(let j=j0;j<=j1;j++)for(let i=i0;i<=i1;i++){const px=i*g+8,py=j*g+8;if(px>w[0]-9&&px<w[0]+w[2]+9&&py>w[1]-9&&py<w[1]+w[3]+9)b[j*gw_+i]=1}}
const F=new Int32Array(gw_*gh_).fill(-1),si=cl(Math.floor(st.x/g),0,gw_-1),sj=cl(Math.floor(st.y/g),0,gh_-1),q=[sj*gw_+si];
if(!b[q[0]]){F[q[0]]=0;for(let k=0;k<q.length;k++){const c=q[k],i=c%gw_,j=(c/gw_)|0;for(const[di,dj]of D){const a=i+di,e=j+dj;if(a<0||e<0||a>=gw_||e>=gh_)continue;const n=e*gw_+a;if(F[n]>=0||b[n])continue;if(di&&dj&&(b[j*gw_+a]||b[e*gw_+i]))continue;F[n]=F[c]+1;q.push(n)}}}
return{g,gw:gw_,gh:gh_,b,F,at(x,y){const i=cl(Math.floor(x/g),0,gw_-1),j=cl(Math.floor(y/g),0,gh_-1);return j*gw_+i}}}
// -> [{lv:'err'|'warn'|'info', m:text, x, y, ref:{t,o}}]; ref is what the editor selects when the problem is clicked
// doorways: openings in solid walls (gaps 20–140 px between pieces in line, and walk-through pieces such as doorways)
// {hz: the wall runs left–right, c: its middle line, a..b: the opening}
function cmDoors(d){const D=[],H=[],V=[];for(const w of d.walls){if(Math.min(w.w,w.h)>14)continue;const walk=CMWI[w.s]&&CMWI[w.s].walk&&w.sol!==true;if(!walk&&!cmSolid(w,'w'))continue;(w.w>=w.h?H:V).push(w)}
const scan=(L,hz)=>{const G=[];for(const w of L){const k=hz?w.y+w.h/2:w.x+w.w/2;let g=G.find(q=>Math.abs(q.k-k)<=2);if(!g)G.push(g={k,L:[]});g.L.push(w)}
 for(const g of G){g.L.sort((a,b)=>hz?a.x-b.x:a.y-b.y);const walks=[];let end=null;for(const w of g.L){const s=hz?w.x:w.y,e=s+(hz?w.w:w.h);if(CMWI[w.s]&&CMWI[w.s].walk&&w.sol!==true){walks.push([s,e]);D.push({hz,c:g.k,a:s,b:e});continue}
  if(end!=null&&s-end>=20&&s-end<=140&&!walks.some(q=>q[0]<s&&q[1]>end))D.push({hz,c:g.k,a:end,b:s});end=end==null?e:Math.max(end,e)}}};
scan(H,1);scan(V,0);return D}
// props and vehicles standing in a doorway (within 24 px of the opening, either side): solid ones by their collision,
// the others by their base, so furniture that only looks in the way counts too. Props made for doorways (dk:1: awnings,
// wall lights, exit lights, curtains) are left out.
function cmDoorBlocks(d){const D=cmDoors(d),out=[],hit=(b,r)=>b[0]<r[2]&&b[0]+b[2]>r[0]&&b[1]<r[3]&&b[1]+b[3]>r[1];
const R=D.map(q=>q.hz?[q.a+2,q.c-24,q.b-2,q.c+24]:[q.c-24,q.a+2,q.c+24,q.b-2]);
for(const o of d.obj){if(o.dc||o.fx||(cmOB(o.k)||{}).dk)continue;let B=cmObjBoxes(o);if(!B.length&&!o.veh){const f=cmFoot(o);B=f?[f]:[[o.x-6,o.y-6,12,6]]}
 const i=R.findIndex(r=>B.some(b=>hit(b,r)));if(i>=0)out.push({o,door:D[i]})}return out}
function cmLint(d){const R=[],C=cmColl(d),M=cmWalk(d,C),W_=d.w*d.tile,H_=d.h*d.tile,st=cmStart(d),stOK=!M.b[M.at(st.x,st.y)];
const outM=(x0,y0,x1,y1)=>x1<0||y1<0||x0>W_||y0>H_;
if(!d.start){R.push({lv:'warn',m:'No player start: the player starts in the middle of the map. Use the Player start tool (S) to place one.',x:st.x,y:st.y});if(!stOK)R.push({lv:'err',m:'The middle of the map, where the run starts without a player start, is inside something solid.',x:st.x,y:st.y})}
else if(outM(d.start.x,d.start.y,d.start.x,d.start.y))R.push({lv:'err',m:'The player start is outside the map.',x:d.start.x,y:d.start.y,ref:{t:'p',o:d.start}});
else if(!stOK)R.push({lv:'err',m:'The player start is inside a wall, water or something solid.',x:d.start.x,y:d.start.y,ref:{t:'p',o:d.start}});
const sp=d.spawns.filter(s=>s.on!==false),zn=d.zones.filter(z=>z.on!==false);
for(const s of sp){const c=M.at(s.x,s.y),ref={t:'s',o:s};if(outM(s.x,s.y,s.x,s.y))R.push({lv:'warn',m:'A zombie spawn point is outside the map.',x:s.x,y:s.y,ref});else if(M.b[c])R.push({lv:'warn',m:'A zombie spawn point is inside a wall, water or something solid: zombies would get stuck.',x:s.x,y:s.y,ref});else if(M.F[c]<0&&stOK)R.push({lv:'warn',m:'Zombies from a spawn point can\'t walk to the player.',x:s.x,y:s.y,ref})}
for(const z of zn){let any=0,reach=0;for(let y=z.y+8;y<z.y+z.h;y+=16)for(let x=z.x+8;x<z.x+z.w;x+=16){if(x<0||y<0||x>W_||y>H_)continue;const c=M.at(x,y);if(!M.b[c]){any=1;if(M.F[c]>=0)reach=1}}const ref={t:'z',o:z};
if(outM(z.x,z.y,z.x+z.w,z.y+z.h))R.push({lv:'warn',m:'A spawn zone is outside the map.',x:z.x+z.w/2,y:z.y+z.h/2,ref});
else if(!any)R.push({lv:'warn',m:'A spawn zone is completely blocked: no zombie can appear in it.',x:z.x+z.w/2,y:z.y+z.h/2,ref});else if(!reach&&stOK)R.push({lv:'warn',m:'Zombies from a spawn zone can\'t walk to the player.',x:z.x+z.w/2,y:z.y+z.h/2,ref})}
if(!sp.length&&!zn.length)R.push({lv:'info',m:(d.spawns.length||d.zones.length?'Every zombie spawn is turned off':'No zombie spawns yet')+': zombies come from off-screen around the player, like on the built-in maps.'});
// outside the map (one line each, up to 12)
const OUT=[];for(const o of d.obj)if(outM(o.x,o.y,o.x,o.y))OUT.push({m:(o.veh?'A vehicle':'A prop')+' is outside the map.',ref:{t:'o',o},x:o.x,y:o.y});
for(const w of d.walls)if(outM(w.x,w.y,w.x+w.w,w.y+w.h))OUT.push({m:'A wall is outside the map.',ref:{t:'w',o:w},x:w.x+w.w/2,y:w.y+w.h/2});
for(const a of d.areas||[])if(outM(a.x,a.y,a.x+a.w,a.y+a.h))OUT.push({m:'An area ('+((cmArea(a.a)||{n:a.a}).n)+') is outside the map.',ref:{t:'a',o:a},x:a.x+a.w/2,y:a.y+a.h/2});
for(const l of d.paths||[]){const b=cmPolyBB(cmPathRaw(l));if(outM(b.x0,b.y0,b.x1,b.y1))OUT.push({m:'A path ('+((cmPath(l.p)||{n:l.p}).n)+') is outside the map.',ref:{t:'l',o:l},x:l.x,y:l.y})}
OUT.slice(0,12).forEach(p=>R.push(Object.assign({lv:'warn'},p)));if(OUT.length>12)R.push({lv:'warn',m:(OUT.length-12)+' more things are outside the map.',x:OUT[12].x,y:OUT[12].y,ref:OUT[12].ref});
// props in doorways
{const DB=cmDoorBlocks(d);DB.slice(0,12).forEach(q=>R.push({lv:'warn',m:(q.o.veh?'A vehicle':'A prop ('+((typeof EDPN!='undefined'&&EDPN[q.o.k]||[q.o.k])[0])+')')+' stands in a doorway: move it so the way is clear.',x:q.o.x,y:q.o.y,ref:{t:'o',o:q.o}}));if(DB.length>12)R.push({lv:'warn',m:(DB.length-12)+' more props stand in doorways.',x:DB[12].o.x,y:DB[12].o.y,ref:{t:'o',o:DB[12].o}})}
// missing assets
const unk=Object.create(null),miss=(t,nm,kind,o,ref)=>{const k=t+':'+kind;if(!unk[k])unk[k]={n:0,o,nm,kind,ref};unk[k].n++};
for(const o of d.obj){if(o.dc){if(!cmDec(o.dc))miss('d','decal',o.dc,o,'o')}else if(o.fx){if(!cmFx(o.fx))miss('x','effect',o.fx,o,'o')}else if(o.veh){if(!cmHW(o.veh))miss('v','vehicle',o.veh,o,'o')}else if(!cmOB(o.k))miss('p','prop',o.k,o,'o')}
for(const a of d.areas||[])if(!cmArea(a.a))miss('a','area',a.a,a,'a');for(const l of d.paths||[])if(!cmPath(l.p))miss('l','path',l.p,l,'l');for(const f of d.feats||[])if(!cmFeat(f.f))miss('f','special feature',f.f,f,'f');
for(const k in unk){const u=unk[k];R.push({lv:'warn',m:'Missing '+u.nm+' "'+u.kind+'" ('+u.n+'): this game has no such '+u.nm+', so it is kept in the file but not shown.',x:u.o.x,y:u.o.y,ref:{t:u.ref,o:u.o}})}
// special features that can't work as they are
for(const f of d.feats||[]){const ref={t:'f',o:f};if(f.f=='roadgraph'){if(!f.pts||f.pts.length<2||!(f.e||[]).length)R.push({lv:'warn',m:'The boss road graph needs at least two nodes joined by a road (use "Build from road paths" or draw it).',x:f.x,y:f.y,ref})}
else if(f.f=='store'&&!d.obj.some(o=>o.k=='gshelf'&&o.x>f.x&&o.x<f.x+f.w&&o.y>f.y&&o.y<f.y+f.h))R.push({lv:'info',m:'The store has no grocery shelves inside it: Penny has nothing to knock over.',x:f.x+f.w/2,y:f.y+f.h/2,ref})}
{const C=(d.feats||[]).filter(f=>f.f=='cityhall');if(C.length>1)R.push({lv:'warn',m:'There are '+C.length+' City Hall roofs: the Mayor only uses the first one.',x:C[1].x,y:C[1].y,ref:{t:'f',o:C[1]}})}
for(const l of d.paths||[]){const T=cmPath(l.p);if(T&&T.closed&&(l.pts||[]).length<3)R.push({lv:'warn',m:'A '+T.n.toLowerCase()+' needs at least three points to have an inside.',x:l.x,y:l.y,ref:{t:'l',o:l}})}
for(const id of d.pal)if(!CMTI[id]&&(id!==d.ground||d.ter.some(v=>v===0)))R.push({lv:'warn',m:'Missing terrain "'+id+'": shown as '+((CMTI[d.ground]||CMTER[0]).n.toLowerCase())+'.'});
for(const id of d.rpal)if(id&&!CMTI[id])R.push({lv:'warn',m:'Missing road terrain "'+id+'": the ground below it shows.'});
for(const id of d.opal)if(id&&!CMOI[id])R.push({lv:'warn',m:'Missing overlay "'+id+'": not shown.'});
{const w=d.walls.find(w=>!CMWI[w.s]);if(w)R.push({lv:'warn',m:'Missing wall style "'+w.s+'": drawn as a plain wall.',x:w.x,y:w.y,ref:{t:'w',o:w}})}
return R}
