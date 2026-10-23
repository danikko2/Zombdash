//# editor/prefabs.js — Map Workshop prefabs: save a selection (and the ground tiles under it) as a reusable prefab, keep your prefabs on the device, place a prefab as real, separately editable things; the Prefabs tab
// ---------- prefabs ----------
// A prefab is {id, n name, cat group, w, h, items: [{t, o}], tiles?}. Item positions are from the prefab's top-left corner;
// t is the kind of thing ('o' prop / vehicle / decal / effect, 'w' wall, 'a' area, 'l' path, 'f' feature, 's' spawn point,
// 'z' spawn zone). tiles = {tw, th, ter, roads, overlay}: tile grids in the map-file layout ('.' leaves a tile as it is),
// starting at the top-left corner (prefabs with tiles are placed on whole tiles). Placing one adds ordinary map things with
// new ids: nothing links them to the prefab afterwards. Your prefabs live in IndexedDB (kv record "prefabs"), like your maps.
let EDPF=[],EDPFLD=0;
const EDPFCAT=['Rooms','Buildings','Street','Outdoors','Vehicles','Spooky','Other'];
async function edPfLoad(){if(EDPFLD)return EDPF;EDPFLD=1;let r=null;try{r=await msGet('kv','prefabs')}catch(e){}EDPF=Array.isArray(r&&r.list)?r.list.filter(p=>p&&typeof p.n=='string'&&Array.isArray(p.items)):[];return EDPF}
function edPfSave(){try{return msWrite([['put','kv',{k:'prefabs',list:EDPF}]]).catch(()=>{})}catch(e){return Promise.resolve()}}
function edPfAll(){return(typeof CMPFS!='undefined'?CMPFS:[]).concat(EDPF)}
function edPfById(id){return edPfAll().find(p=>p.id===id)||null}
// ----- making a prefab from the selection -----
function edPfFrom(S,name,cat,withTiles){const E=ED,d=E.d,T=d.tile,L=S.filter(s=>s.t!='p');if(!L.length)return null;const B=edBBAll(L);
const ox=withTiles?Math.floor(B.x0/T)*T:Math.floor(B.x0),oy=withTiles?Math.floor(B.y0/T)*T:Math.floor(B.y0),P={id:cmUid('pf'),n:String(name||'My prefab').replace(/[<>]/g,'').slice(0,40)||'My prefab',cat:EDPFCAT.includes(cat)?cat:'Other',w:Math.ceil(B.x1-ox),h:Math.ceil(B.y1-oy),items:[]};
for(const s of L){const o=edClone(s.o);delete o.id;delete o.lk;delete o.hd;o.x=cmR1(o.x-ox);o.y=cmR1(o.y-oy);P.items.push({t:s.t,o})}
if(withTiles){const tx0=ox/T,ty0=oy/T,tw=Math.min(d.w-tx0,Math.ceil((B.x1-ox)/T)),th=Math.min(d.h-ty0,Math.ceil((B.y1-oy)/T)),gi=d.ground;
const grid=(A,pal,keep,reg)=>{const used={},rows=[];let any=0;const leg={},by={},chars=[...CMCH].filter(c=>c!='.');for(let y=0;y<th;y++){let r='';for(let x=0;x<tw;x++){const i=(ty0+y)*d.w+tx0+x,id=pal[A[i]];if(!keep(A[i],id)){r+='.';continue}if(by[id]==null){const c=chars.find(c=>!leg[c]);if(!c){r+='.';continue}leg[c]=id;by[id]=c}r+=by[id];any=1}rows.push(r)}return any?{legend:leg,rows}:null};
const ter=grid(d.ter,d.pal,(v,id)=>id!==gi),rd=grid(d.rtr,d.rpal,v=>v>0),ov=grid(d.ovl,d.opal,v=>v>0);if(ter||rd||ov){P.tiles={tw,th};if(ter)P.tiles.ter=ter;if(rd)P.tiles.roads=rd;if(ov)P.tiles.overlay=ov}}
return P}
function edPfAsk(){const E=ED,S=E.sel.filter(s=>s.t!='p');if(!S.length)return edToast('Select the things to save as a prefab first (drag a box around them)');
edModal('Save as prefab',`<p>${S.length} thing${S.length>1?'s':''} become a prefab you can place again from the Prefabs tab, on any of your maps.</p><label class=edf><span>Name</span><input id=edpfn maxlength=40 value="My prefab"></label>
<label class=edf><span>Group</span><select id=edpfc>${EDPFCAT.map(c=>`<option${c=='Other'?' selected':''}>${c}</option>`).join('')}</select></label><label class=edck><input type=checkbox id=edpft checked> Include the ground under it (terrain, roads, markings)</label>`,
[['Cancel','',()=>0],['Save prefab','go',()=>{const q=id=>E.root&&E.root.querySelector('#'+id),n=q('edpfn'),c=q('edpfc'),t=q('edpft');edPfAdd(edPfFrom(S,n?n.value:'My prefab',c?c.value:'Other',t?t.checked:true))}]])}
function edPfAdd(P){if(!P)return;EDPF.push(P);edPfSave();const E=ED;if(E){E.pf=P;E.tab='prefabs';edTool('prefab',1);edToast('Saved “'+P.n+'”: click to place it')}}
function edPfDel(id){const P=EDPF.find(p=>p.id===id);if(!P)return;edModal('Delete prefab',`<p>Delete your prefab <b>${edEsc(P.n)}</b>? Things already placed from it stay on your maps.</p>`,[['Cancel','',()=>0],['Delete','red',()=>{EDPF=EDPF.filter(p=>p!==P);edPfSave();if(ED&&ED.pf===P){ED.pf=null;edTool('select')}else edLeft()}]])}
// ----- placing -----
function edPfOrigin(P,x,y){const E=ED,T=E.d.tile,ox=x-P.w/2,oy=y-P.h/2;return P.tiles?{x:Math.round(ox/T)*T,y:Math.round(oy/T)*T}:{x:edSnap(ox),y:edSnap(oy)}}
function edPrefabPlace(P,x,y){const E=ED,d=E.d,O=edPfOrigin(P,x,y),add=[];let skip=0;
for(const it of P.items){const o=edClone(it.o);o.id=cmUid(it.t=='o'?(o.dc?'d':o.fx?'x':o.veh?'v':'p'):it.t);o.x=cmR1(o.x+O.x);o.y=cmR1(o.y+O.y);delete o.lk;delete o.hd;
const kind=it.t=='o'?'o':it.t;let l=o.ly&&cmLy(d,o.ly);if(!l||l.k!='o'||l.lock||l.hid){const id=edTargetLy(kind,o,1);l=id&&cmLy(d,id)}if(!l){skip++;continue}o.ly=l.id;add.push({t:it.t,o})}
// the ground: whole tiles from the top-left corner
let tiles=null;if(P.tiles){const T=d.tile,tx0=Math.round(O.x/T),ty0=Math.round(O.y/T),patch=[];
for(const[k,arr,pi]of[['ter','ter',cmPi],['roads','rtr',cmRi],['overlay','ovl',cmOi]]){const G=P.tiles[k];if(!G||!Array.isArray(G.rows))continue;const I=[],Bv=[],Av=[];
G.rows.forEach((r,y)=>{for(let x=0;x<r.length;x++){const c=r[x];if(c=='.'||!cmOwn(G.legend,c))continue;const tx=tx0+x,ty=ty0+y;if(tx<0||ty<0||tx>=d.w||ty>=d.h)continue;const i=ty*d.w+tx,v=pi(d,G.legend[c]);if(d[arr][i]===v)continue;I.push(i);Bv.push(d[arr][i]);Av.push(v)}});
if(I.length)patch.push({arr,i:Int32Array.from(I),b:Uint8Array.from(Bv),a:Uint8Array.from(Av)})}if(patch.length)tiles=patch}
if(!add.length&&!tiles)return edToast(skip?'Nothing placed: the layers are locked or hidden':'This prefab is empty');
edApply('Place '+P.n,[],add,tiles,add.map(q=>({t:q.t,o:q.o})));if(skip)edToast(skip+' not placed: no unlocked, shown layer for them')}
// the outline and a faint picture of the prefab under the mouse
function edPrefabGhost(g,px){const E=ED,P=E.pf,O=edPfOrigin(P,E.mouse.wx,E.mouse.wy);g.save();g.translate(O.x,O.y);g.globalAlpha=.55;try{edPfDraw(g,P,1)}catch(e){}g.restore();g.lineWidth=2*px;g.setLineDash([6*px,4*px]);g.strokeStyle='#ffcf40';g.strokeRect(O.x,O.y,P.w,P.h);g.setLineDash([])}
// draw a prefab at (0,0) (ghost and thumbnails)
function edPfDraw(g,P,ghost){const T=CMTILE;if(P.tiles&&!ghost)for(const k of['ter','roads','overlay']){const G=P.tiles[k];if(!G)continue;G.rows.forEach((r,y)=>{for(let x=0;x<r.length;x++){const id=G.legend[r[x]];if(!id)continue;const t=k=='overlay'?CMOI[id]:CMTI[id];if(t)t.f(g,x*T,y*T,x,y)}})}
const doc={walls:[],obj:[],areas:[],paths:[],layers:cmLayers()};for(const it of P.items){const o=Object.assign({},it.o);if(!o.ly)o.ly=cmKindLy(it.t,o);if(it.t=='w')doc.walls.push(o);else if(it.t=='o')doc.obj.push(o);else if(it.t=='a')doc.areas.push(o);else if(it.t=='l')doc.paths.push(o)}
for(const it of cmDrawList(doc,0)){if(it.t=='o'&&!it.o.dc&&!it.o.fx){const s=edSprite(it.o);if(s){g.save();g.translate(it.o.x,it.o.y);if(it.o.r)g.rotate(it.o.r*Math.PI/180);g.drawImage(s.c,-s.ax,-s.ay);g.restore()}continue}if(it.t=='o'&&it.o.fx){cmFxEd(g,it.o);continue}cmPaintIt(g,it.o,it.t)}}
function edPfThumb(P){const k='pf:'+P.id+':'+P.items.length;if(EDTH[k])return EDTH[k];const c=document.createElement('canvas');c.width=c.height=64;const g=c.getContext('2d');g.fillStyle='#3a5a34';g.fillRect(0,0,64,64);const s=Math.min(60/Math.max(1,P.w),60/Math.max(1,P.h));g.translate((64-P.w*s)/2,(64-P.h*s)/2);g.scale(s,s);try{edPfDraw(g,P,0)}catch(e){}let u='';try{u=c.toDataURL()}catch(e){}return EDTH[k]=u}
// ----- the Prefabs tab -----
function edPfLeft(){const E=ED,L=edPfAll(),sn=E.sel.filter(s=>s.t!='p').length;let h=`<div class=edrow><button data-a=pfsave${sn?'':' disabled'} title="Save what is selected as a prefab">Save selection as prefab…</button></div>`;
if(E.pf)h+=`<div class=edcur><img alt="" src="${edPfThumb(E.pf)}"><div><b>${edEsc(E.pf.n)}</b><small>${E.pf.items.length} things${E.pf.tiles?' + ground':''} · click to place</small></div></div>`;
for(const c of EDPFCAT){const G=L.filter(p=>p.cat==c);if(!G.length)continue;h+=`<h4>${c}</h4><div class=edag>${G.map(p=>`<button data-a="pf:${edEsc(p.id)}" class="${E.pf===p?'on':''}" title="${edEsc(p.n)}${p.d?': '+edEsc(p.d):''}"><img alt="" loading=lazy src="${edPfThumb(p)}"><span>${edEsc(p.n)}</span>${EDPF.includes(p)?`<i class=edpfx data-a="pfdel:${edEsc(p.id)}" title="Delete this prefab">×</i>`:''}</button>`).join('')}</div>`}
h+=`<p class=edhint>Placing a prefab adds ordinary things (walls, floors, props, decals…) you can then move, change or delete one by one. Select some things and save them to make your own; yours are kept on this device, for every map.</p>`;return h}
function edPfClick(a){const E=ED;if(a=='pfsave'){edPfAsk();return 1}if(a.startsWith('pfdel:')){edPfDel(a.slice(6));return 1}if(a.startsWith('pf:')){const P=edPfById(a.slice(3));if(P){E.pf=P;E.sel=[];edTool('prefab',1)}return 1}return 0}
