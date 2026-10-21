//# editor/editor.js — The Map Workshop editor: layout, panels, tools (terrain, props, walls, spawns), mouse and keys, save, resize, problems
// ---------- the map editor ----------
// Desktop mouse and keyboard. While it is open mode=='edit': the game's loop calls edFrame() instead of drawing the world,
// and key presses come to edKey(). The map being edited is ED.d (a doc, see world/map-schema.js); every change goes through
// the one history in editor/history.js.
let ED=null;
const EDT=[ // tools: id, name, key, left panel tab, hint
['select','Select & move','V','','Click to select, drag to move. Drag empty ground to pan. R turns, Delete removes.'],
['brush','Paint','B','terrain','Drag to paint. Right-drag erases. [ and ] change the brush size.'],
['erase','Eraser','E','terrain','Drag to erase back to the default ground (or erase overlays when an overlay is picked).'],
['fill','Fill','F','terrain','Click to fill a connected area of the same ground.'],
['rect','Rectangle','U','terrain','Drag a rectangle to fill it. Right-drag erases a rectangle.'],
['pick','Eyedropper','I','terrain','Click a tile to pick its ground. Shift+click picks its overlay.'],
['place','Place prop','P','assets','Click to place the picked prop or vehicle. R turns it first. Right-click or Esc stops placing.'],
['wall','Walls','W','walls','Drag to draw a wall. Right-drag (or Alt+drag) cuts a gap in walls.'],
['start','Player start','S','spawns','Click where the player starts.'],
['spawn','Spawn point','Z','spawns','Click to add a zombie spawn point.'],
['zone','Spawn zone','X','spawns','Drag to add a zone: zombies appear anywhere inside it.']];
const EDI={ // 16px icons
select:'<path d="M3 1v13l3-3 2.5 4.5 2-1L8 10h4.5z"/>',brush:'<path d="M13.5 1L15 2.5 9 8.5 7.5 7zM6.5 8L8 9.5C8 12.5 5 15 1.5 15c1-1 1-2 1-3 0-2.2 1.6-4 4-4z"/>',
erase:'<path d="M9.5 1.5l5 5L8 13H4.5L1.5 10zM3 10.5L5 12.5h2l1.3-1.3-3.5-3.5z"/>',fill:'<path d="M7 1L1 7l6 6 6-6zM7 3.6L3.6 7h6.8z M14 9.5s-2 2.6-2 3.7a2 2 0 004 0c0-1.1-2-3.7-2-3.7z" fill-rule="evenodd"/>',
rect:'<path d="M1 3h14v10H1zm2 2v6h10V5z" fill-rule="evenodd"/>',pick:'<path d="M11.5 1a2.1 2.1 0 013 3l-2 2 1 1-1.4 1.4-1-1L5 13.5H2.5V11l6.1-6.1-1-1L9 2.5l1 1z"/>',
place:'<path d="M2 2h12v12H2zm2 2v8h8V4z M4 4h2l6 6v2h-2L4 6z" fill-rule="evenodd"/>',wall:'<path d="M1 2h6v3H1zm8 0h6v3H9zM1 7h3v3H1zm5 0h5v3H6zm7 0h2v3h-2zM1 12h6v3H1zm8 0h6v3H9z"/>',
start:'<path d="M3 1h2v14H3zm3 1h9l-2.5 3L15 8H6z"/>',spawn:'<path d="M8 1C4.5 1 2 3.6 2 7c0 1.8.8 3.2 2 4v3h8v-3c1.2-.8 2-2.2 2-4 0-3.4-2.5-6-6-6zM4.8 6h2.4v3H4.8zm4 0h2.4v3H8.8zM7 11h2v2H7z" fill-rule="evenodd"/>',
zone:'<path d="M1 1h4v2H3v2H1zm10 0h4v4h-2V3h-2zM1 11h2v2h2v2H1zm12 0h2v4h-4v-2h2zM7 1h2v2H7zM1 7h2v2H1zm12 0h2v2h-2zM7 13h2v2H7z"/>',
undo:'<path d="M6 2L1 6.5 6 11V8h4a2.5 2.5 0 010 5H7v2h3a4.5 4.5 0 000-9H6z"/>',redo:'<path d="M10 2l5 4.5-5 4.5V8H6a2.5 2.5 0 000 5h3v2H6a4.5 4.5 0 010-9h4z"/>',
grid:'<path d="M1 1h14v14H1zm2 2v3h3V3zm5 0v3h5V3zM3 8v5h3V8zm5 0v5h5V8z" fill-rule="evenodd"/>',coll:'<path d="M1 1h14v14H1zm2 2v1.6L4.6 3zm4.4 0L3 7.4v2.8L10.2 3zm5.6 1.6L4.6 13h2.8L13 7.4zm0 5.6L10.2 13H13z" fill-rule="evenodd"/>',
snap:'<path d="M2 2h4v7a2 2 0 004 0V2h4v7A6 6 0 012 9zm1 1v2h2V3zm8 0v2h2V3z" fill-rule="evenodd"/>',check:'<path d="M8 1l7.5 14H.5zM7 6v4.5h2V6zm0 6v2h2v-2z" fill-rule="evenodd"/>',
save:'<path d="M1 1h11l3 3v11H1zm3 0v4h7V1zm0 8v5h8V9z" fill-rule="evenodd"/>',play:'<path d="M3 1l12 7-12 7z"/>',back:'<path d="M10 1L3 8l7 7 1.5-1.5L6 8l5.5-5.5z"/>',
left:'<path d="M10 1L3 8l7 7V1z"/>',right:'<path d="M6 1l7 7-7 7V1z"/>'};
function edIco(k){return `<svg class=edi viewBox="0 0 16 16" aria-hidden="true">${EDI[k]||''}</svg>`}
function edEsc(s){return String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c])}
// ----- opening and closing -----
// src: 'saved' when the map is already in storage
function edOpen(d,src,dirty){if(ED)edTeardown();hReset();
ED={d,src:src||'saved',cam:{x:0,y:0,z:1},tool:'select',tab:'terrain',ter:'grass',terK:'t',brush:1,asset:null,rot:0,pvr:Math.random(),vcol:EDVC[0],wall:'wall',wth:8,
sel:null,hov:null,snap:1,step:16,grid:1,coll:0,pl:1,pr:1,drag:null,mouse:{x:0,y:0,wx:0,wy:0,in:0},ch:new Map(),ver:0,collV:-1,collC:null,mark:0,probs:cmLint(d),q:'',cat:'all',
need:1,mmDirty:1,mmNeed:1,vis:1,space:0,cvx:0,cvy:0,mmw:200,mmh:150,dt:0,tip:''};
if(dirty)ED.mark=-1;mode='edit';UIS='';ui.innerHTML='';L=R=null;mouse.d=0;keys={};
try{edDom()}catch(e){ED.cv=null;ED.root=null}edFit();edUI()}
// headless (tests) or real: remove the editor's page parts
function edTeardown(){const E=ED;if(!E)return;clearTimeout(E.dt);if(E.root&&E.root.remove)E.root.remove();for(const c of E.ch.values()){c.cv.width=0;c.cv.height=0}E.ch.clear();ED=null}
function edIsDirty(){return !!ED&&hTop()!==ED.mark}
// back to the Workshop; asks first when there are unsaved changes
function edBack(){if(!ED)return;if(edIsDirty())return edModal('Unsaved changes',`<p>Save the changes to <b>${edEsc(ED.d.name)}</b> before closing?</p>`,[['Cancel','',()=>0],['Close without saving','red',()=>edClose(1)],['Save','go',()=>edSave().then(ok=>{if(ok)edClose()})]]);edClose()}
function edClose(discard){if(!ED)return;if(discard||!edIsDirty())msWrite([['del','kv','draft']]).catch(()=>{});edTeardown();mode='menu';if(cmIs(mapId)){mapId=MP[S.mp]?S.mp:0;try{build()}catch(e){}}workshop()}
// ----- page layout -----
function edDom(){const E=ED,r=document.createElement('div');r.id='ed';r.className='ed';
r.innerHTML=`<div class=edtop id=edtop></div><div class=edmid><div class=edl id=edl></div><button class="edcol edcl" data-a=pl title="Hide or show the left panel">${edIco('left')}</button><div class=edc id=edc><canvas id=edcv></canvas><canvas id=edmm title="Minimap: click or drag to move the view"></canvas><div class=edtoast id=edtoast></div></div><button class="edcol edcr" data-a=pr title="Hide or show the right panel">${edIco('right')}</button><div class=edr id=edr></div></div><div class=edst id=edst></div><div class=edmod id=edmod></div>`;
GM.appendChild(r);E.root=r;E.cv=r.querySelector('#edcv');E.g=E.cv.getContext('2d');E.mm=r.querySelector('#edmm');
r.addEventListener('click',edClick);r.addEventListener('change',edChange);r.addEventListener('input',edInput);r.addEventListener('keydown',e=>{if(e.key=='Enter'&&e.target.tagName=='INPUT'&&e.target.blur)e.target.blur()});
const cv=E.cv;cv.addEventListener('pointerdown',edDown);cv.addEventListener('pointermove',edMove);cv.addEventListener('pointerup',edUp);cv.addEventListener('pointercancel',edUp);
cv.addEventListener('pointerleave',()=>{if(!ED)return;ED.mouse.in=0;ED.hov=null;ED.need=1;edStatus()});cv.addEventListener('wheel',edWheel,{passive:false});cv.addEventListener('contextmenu',e=>e.preventDefault());
const mm=E.mm;mm.addEventListener('pointerdown',e=>{E.mmd=1;try{mm.setPointerCapture(e.pointerId)}catch(_){}edMiniGo(e)});mm.addEventListener('pointermove',e=>{if(E.mmd)edMiniGo(e)});mm.addEventListener('pointerup',()=>{E.mmd=0});
edLay()}
// where the canvas sits inside #game (pointer positions come from gp(), which knows about screen rotation)
function edLay(){const E=ED;if(!E||!E.cv)return;let x=0,y=0,el=E.cv;while(el&&el!==GM){x+=el.offsetLeft||0;y+=el.offsetTop||0;el=el.offsetParent}E.cvx=x;E.cvy=y;
const d=E.d,MW=d.w*d.tile,MH=d.h*d.tile,mw=cl((E.cv.clientWidth||800)*.26,110,200),k=Math.min(mw/MW,mw*.75/MH);E.mmw=Math.round(MW*k);E.mmh=Math.round(MH*k);if(E.mm){E.mm.style.width=E.mmw+'px';E.mm.style.height=E.mmh+'px'}E.mmNeed=1;E.need=1}
function edLocal(e){const q=gp(e);return{x:q.x-ED.cvx,y:q.y-ED.cvy}}
function edMiniGo(e){const E=ED,q=gp(e);let ox=0,oy=0,el=E.mm;while(el&&el!==GM){ox+=el.offsetLeft||0;oy+=el.offsetTop||0;el=el.offsetParent}
const d=E.d,k=E.mmw/(d.w*d.tile),wx=(q.x-ox)/k,wy=(q.y-oy)/k;edCenter(wx,wy)}
function edVW(){return ED.cv?ED.cv.clientWidth||800:800}
function edVH(){return ED.cv?ED.cv.clientHeight||600:600}
function edCenter(x,y){const E=ED;E.cam.x=x-edVW()/2/E.cam.z;E.cam.y=y-edVH()/2/E.cam.z;E.need=1;E.mmNeed=1}
function edFit(){const E=ED,d=E.d,MW=d.w*d.tile,MH=d.h*d.tile;E.cam.z=cl(Math.min((edVW()-40)/MW,(edVH()-40)/MH),.08,4);edCenter(MW/2,MH/2)}
function edZoom(f,sx,sy){const E=ED;if(sx==null){sx=edVW()/2;sy=edVH()/2}const wx=E.cam.x+sx/E.cam.z,wy=E.cam.y+sy/E.cam.z;E.cam.z=cl(E.cam.z*f,.08,4);E.cam.x=wx-sx/E.cam.z;E.cam.y=wy-sy/E.cam.z;E.need=1;E.mmNeed=1;edStatus()}
// ----- panels -----
function edUI(){if(!ED||!ED.root)return;edTop();edLeft();edRight();edStatus();const r=ED.root;r.classList.toggle('nol',!ED.pl);r.classList.toggle('nor',!ED.pr);setTimeout(()=>{if(ED)edLay()},0)}
function edTB(a,ico,tip,on,dis,txt){return `<button data-a="${a}" class="${on?'on':''}" title="${edEsc(tip)}"${dis?' disabled':''}>${edIco(ico)}${txt?'<span>'+txt+'</span>':''}</button>`}
function edTop(){const E=ED,el=E.root.querySelector('#edtop'),dirty=edIsDirty(),pc=E.probs.filter(p=>p.lv!='info').length;
el.innerHTML=`${edTB('back','back','Back to the Map Workshop',0,0,'Workshop')}<b class=edname title="Map settings" data-a=mapset>${edEsc(E.d.name)}${dirty?' <i class=eddot title="Unsaved changes">●</i>':''}</b><span class=edsep></span>`+
EDT.map(t=>edTB('tool:'+t[0],t[0],t[1]+' ('+t[2]+')',E.tool==t[0])).join('')+`<span class=edsep></span>${edTB('undo','undo','Undo'+(EDH.u.length?': '+EDH.u[EDH.u.length-1].n:'')+' (Ctrl+Z)',0,!EDH.u.length)}${edTB('redo','redo','Redo'+(EDH.r.length?': '+EDH.r[EDH.r.length-1].n:'')+' (Ctrl+Y)',0,!EDH.r.length)}<span class=edsep></span>`+
`${edTB('grid','grid','Grid (Shift+G)',E.grid)}${edTB('coll','coll','Show collision: red stops bullets, orange is solid props, blue is see-through like fences and water (Shift+C)',E.coll)}${edTB('snap','snap','Snap to a '+E.step+'px grid (Shift+S)',E.snap)}<span class=edsep></span>`+
`${edTB('probs','check','Problems with the map',0,0,pc?String(pc):'✓')}<span class=edgrow></span>${edTB('save','save','Save (Ctrl+S)',0,0,'Save')}<button data-a=playtest class=edgo title="Play this map with the real game, then come back here">${edIco('play')}<span>Playtest</span></button>`}
function edTerSw(t,ov){const k=(ov?'o:':'t:')+t.id;if(EDTH[k])return EDTH[k];const c=document.createElement('canvas');c.width=c.height=32;const g=c.getContext('2d');if(ov){CMTI.concrete.f(g,0,0,3,5);t.f(g,0,0,3,5)}else t.f(g,0,0,3,5);let u='';try{u=c.toDataURL()}catch(e){}return EDTH[k]=u}
function edLeft(){const E=ED,el=E.root.querySelector('#edl');const tabs=[['terrain','Terrain'],['assets','Props'],['walls','Walls'],['spawns','Spawns']];
let h=`<div class=edtabs>${tabs.map(t=>`<button data-a="tab:${t[0]}" class="${E.tab==t[0]?'on':''}">${t[1]}</button>`).join('')}</div><div class=edpane>`;
if(E.tab=='terrain'){const tool=['brush','erase','fill','rect','pick'].includes(E.tool)?E.tool:'brush';
h+=`<div class=edtools>${['brush','erase','fill','rect','pick'].map(id=>{const t=EDT.find(x=>x[0]==id);return edTB('tool:'+id,id,t[1]+' ('+t[2]+')',E.tool==id,0,t[1])}).join('')}</div>`;
h+=`<h4>Ground</h4><div class=edsw>${CMTER.map(t=>`<button data-a="ter:${t.id}" class="${E.terK=='t'&&E.ter==t.id?'on':''}" title="${edEsc(t.n)}${t.walk===0?' (blocks walking)':''}"><img alt="" src="${edTerSw(t)}"><span>${edEsc(t.n)}</span></button>`).join('')}</div>`;
h+=`<h4>Overlays</h4><div class=edsw>${CMOVL.map(t=>`<button data-a="ovl:${t.id}" class="${E.terK=='o'&&E.ter==t.id?'on':''}" title="${edEsc(t.n)}"><img alt="" src="${edTerSw(t,1)}"><span>${edEsc(t.n)}</span></button>`).join('')}</div>`;
h+=`<h4>Brush size</h4><div class=edrow><button data-a=bs- title="Smaller ([)">−</button><input type=range min=1 max=9 value="${E.brush}" data-f=brush aria-label="Brush size"><button data-a=bs+ title="Bigger (])">+</button><b class=edval>${E.brush}×${E.brush}</b></div>`;
h+=`<p class=edhint>${E.tool=='erase'?(E.terK=='o'?'The eraser removes overlays.':'The eraser puts back the default ground ('+edEsc((CMTI[E.d.ground]||CMTER[0]).n)+') and removes overlays.'):'Water blocks walking. Bullets still fly over it.'}</p>`;}
else if(E.tab=='assets'){const A=edAssets(),q=E.q.trim().toLowerCase(),cats=EDCAT.filter(c=>c[0]=='all'||A.some(a=>a.cat==c[0]));
h+=`<input type=search data-f=q placeholder="Search props and vehicles" value="${edEsc(E.q)}" autocomplete=off><select data-f=cat aria-label="Category">${cats.map(c=>`<option value="${c[0]}"${E.cat==c[0]?' selected':''}>${c[1]}</option>`).join('')}</select>`;
const a=E.asset;if(a){h+=`<div class=edcur><img alt="" src="${edThumb(a)}"><div><b>${edEsc(a.n)}</b><small>Rotation ${Math.round(E.rot)}° · R / Shift+R turns</small></div></div>`;if(a.t=='v')h+=`<div class=edcols>${EDVC.map(c=>`<button data-a="vcol:${c}" class="${E.vcol==c?'on':''}" style="--c:${c}" title="${c}"></button>`).join('')}</div>`}
h+=`<div class=edag id=edag>${edGrid()}</div>`}
else if(E.tab=='walls'){h+=`<div class=edtools>${edTB('tool:wall','wall','Draw walls (W)',E.tool=='wall',0,'Draw walls')}</div><h4>Style</h4><div class=edlist>${CMWALL.map(s=>`<button data-a="wst:${s.id}" class="${E.wall==s.id?'on':''}"><i class=edws style="${edWallSw(s)}"></i><span>${edEsc(s.n)}<small>${s.fl==2?'blocks walking, bullets fly through':s.hid?'blocks walking and bullets, not drawn in the game':'blocks walking and bullets'}</small></span></button>`).join('')}</div>
<h4>Thickness</h4><div class=edrow><input type=number min=4 max=64 step=2 value="${E.wth}" data-f=wth aria-label="Wall thickness"><span class=edval>px</span></div><p class=edhint>Drag along a line for a wall of this thickness, or drag a box for a block. Right-drag (or Alt+drag) cuts a gap, for doors. Props with a solid base get their own collision automatically.</p>`}
else{h+=`<div class=edlist>${[['start','Player start','Where the run begins.'],['spawn','Spawn point','Zombies come out here.'],['zone','Spawn zone','Zombies appear anywhere inside.']].map(t=>`<button data-a="tool:${t[0]}" class="${E.tool==t[0]?'on':''}">${edIco(t[0])}<span>${t[1]} (${EDT.find(x=>x[0]==t[0])[2]})<small>${t[2]}</small></span></button>`).join('')}</div>
<p class=edhint>Zombies come from the spawn points and zones that are on, choosing ones out of the player's sight. With none, they come from off-screen around the player, like on the built-in maps.</p><p class=edhint>${E.d.spawns.length} spawn point${E.d.spawns.length==1?'':'s'} · ${E.d.zones.length} zone${E.d.zones.length==1?'':'s'}</p>`}
el.innerHTML=h+'</div>'}
function edWallSw(s){const c={wall:'#7a695c',brick:'#9a4632',concrete:'#8c9099',wood:'#8a5a2c',fence:'repeating-linear-gradient(45deg,#aab1bd 0 2px,transparent 2px 6px)',hidden:'rgba(170,110,255,.5)'}[s.id]||'#7a695c';return 'background:'+c}
function edGrid(){const E=ED,q=E.q.trim().toLowerCase(),L=edAssets().filter(a=>(E.cat=='all'||a.cat==E.cat)&&(!q||a.n.toLowerCase().includes(q)||a.k.toLowerCase().includes(q)));
if(!L.length)return `<p class=edhint>Nothing matches “${edEsc(E.q)}”.</p>`;return L.map(a=>`<button data-a="asset:${a.id}" class="${E.asset&&E.asset.id==a.id?'on':''}" title="${edEsc(a.n)}"><img alt="" loading=lazy src="${edThumb(a)}"><span>${edEsc(a.n)}</span></button>`).join('')}
function edNum(lb,f,v,st){return `<label class=edf><span>${lb}</span><input type=number data-f="${f}" value="${Math.round(v*10)/10}" step="${st||1}"></label>`}
function edRight(){const E=ED,el=E.root.querySelector('#edr'),s=E.sel,d=E.d;let h='';
if(s&&s.t=='o'){const o=s.o,a=edAsset(o),f=!o.veh&&cmFoot(o),known=o.veh?cmHW(o.veh):cmOB(o.k);
h=`<h3>${a.t=='v'?'Vehicle':'Prop'}</h3><div class=edcur><img alt="" src="${known?edThumb({id:(a.t=='v'?'v:':'p:')+a.k,t:a.t,k:a.k}):''}"><div><b>${edEsc(a.n)}</b><small>${known?'':'⚠ unknown: not shown in the game'}</small></div></div>${edNum('X','x',o.x)}${edNum('Y','y',o.y)}
<label class=edf><span>Turn</span><input type=number data-f=r value="${Math.round(o.r||0)}" step=15></label><div class=edrow><button data-a=rot- title="Shift+R">↺ 15°</button><button data-a=rot+ title="R">↻ 15°</button><button data-a=rot0>0°</button></div>`;
if(o.veh)h+=`<h4>Colour</h4><div class=edcols>${EDVC.map(c=>`<button data-a="ocol:${c}" class="${o.c==c?'on':''}" style="--c:${c}" title="${c}"></button>`).join('')}</div><label class=edck><input type=checkbox data-f=dmg${o.dmg?' checked':''}> Damaged</label><label class=edck><input type=checkbox data-f=burn${o.burn?' checked':''}> Burnt out</label><p class=edhint>Vehicles are solid along their whole body.</p>`;
else h+=`<p class=edhint>${f?'Solid: its base ('+Math.round(f[2])+'×'+Math.round(f[3])+') blocks walking and bullets.':'Not solid: players and zombies walk through it.'}</p>`;
h+=`<button class="red edwide" data-a=del>Delete (Del)</button>`}
else if(s&&s.t=='w'){const o=s.o;h=`<h3>Wall</h3>${edNum('X','x',o.x)}${edNum('Y','y',o.y)}${edNum('Width','w',o.w)}${edNum('Height','h',o.h)}<label class=edf><span>Style</span><select data-f=s>${CMWALL.map(w=>`<option value="${w.id}"${o.s==w.id?' selected':''}>${edEsc(w.n)}</option>`).join('')}${CMWI[o.s]?'':`<option selected>${edEsc(o.s)} (unknown)</option>`}</select></label><p class=edhint>Drag the yellow squares to resize.</p><button class="red edwide" data-a=del>Delete (Del)</button>`}
else if(s&&s.t=='s'){const o=s.o;h=`<h3>Spawn point</h3>${edNum('X','x',o.x)}${edNum('Y','y',o.y)}<label class=edck><input type=checkbox data-f=on${o.on!==false?' checked':''}> On</label><p class=edhint>Turned-off spawns stay on the map but no zombies come out of them.</p><button class="red edwide" data-a=del>Delete (Del)</button>`}
else if(s&&s.t=='z'){const o=s.o;h=`<h3>Spawn zone</h3>${edNum('X','x',o.x)}${edNum('Y','y',o.y)}${edNum('Width','w',o.w)}${edNum('Height','h',o.h)}<label class=edck><input type=checkbox data-f=on${o.on!==false?' checked':''}> On</label><p class=edhint>Each zombie picks a random free spot inside the zone.</p><button class="red edwide" data-a=del>Delete (Del)</button>`}
else if(s&&s.t=='p'){h=`<h3>Player start</h3>${edNum('X','x',d.start.x)}${edNum('Y','y',d.start.y)}<p class=edhint>Split-screen players start right next to this spot.</p>`}
else{const T=d.tile;h=`<h3>Map</h3><label class=edf><span>Name</span><input data-f=name maxlength=40 value="${edEsc(d.name)}"></label><label class=edf><span>About</span><textarea data-f=desc maxlength=240 rows=3>${edEsc(d.desc)}</textarea></label>
<h4>Size (tiles of ${T}px)</h4><div class=edrow><input type=number data-f=nw min=${CMMIN[0]} max=${CMMAX} value="${d.w}" aria-label="Width in tiles"><span>×</span><input type=number data-f=nh min=${CMMIN[1]} max=${CMMAX} value="${d.h}" aria-label="Height in tiles"><button data-a=resize>Apply</button></div><p class=edhint>${d.w*T}×${d.h*T} px. Resizing keeps the top-left corner in place.</p>
<label class=edf><span>Default ground</span><select data-f=ground>${CMTER.map(t=>`<option value="${t.id}"${d.ground==t.id?' selected':''}>${edEsc(t.n)}</option>`).join('')}${CMTI[d.ground]?'':`<option selected>${edEsc(d.ground)} (unknown)</option>`}</select></label>
<p class=edhint>${d.obj.length} props & vehicles · ${d.walls.length} walls · ${d.spawns.length} spawn points · ${d.zones.length} zones</p>
<div class=edrow><button data-a=savecopy title="Save a copy and keep editing the copy">Save as copy</button><button data-a=export title="Download this map as a JSON file">Export JSON</button></div>
<h4>Problems <button class=edmini data-a=check>check again</button></h4><div class=edprobs>${E.probs.length?E.probs.map((p,i)=>`<button data-a="prob:${i}" class="edp ${p.lv}"${p.x==null?' disabled':''}><b>${p.lv=='err'?'✖':p.lv=='warn'?'⚠':'ℹ'}</b><span>${edEsc(p.m)}</span></button>`).join(''):'<p class=edhint>✓ No problems found.</p>'}</div>`}
el.innerHTML=h}
function edStatus(){const E=ED;if(!E||!E.root)return;const el=E.root.querySelector('#edst'),m=E.mouse,d=E.d,T=d.tile,t=EDT.find(x=>x[0]==E.tool),dirty=edIsDirty();
el.innerHTML=`<span class=edxy>${m.in?`X ${Math.round(m.wx)} Y ${Math.round(m.wy)} · tile ${Math.floor(m.wx/T)}, ${Math.floor(m.wy/T)}`:'—'}</span><span class=edtl><b>${t[1]}</b> ${edEsc(E.tip||t[4])}</span><span>${d.w}×${d.h} tiles · ${Math.round(E.cam.z*100)}%</span><span class="${dirty?'eduns':'edok'}">${dirty?'● Unsaved changes':'✓ Saved'}</span>`}
function edToast(t){const E=ED;if(!E||!E.root)return;const el=E.root.querySelector('#edtoast');el.textContent=t;el.classList.add('on');clearTimeout(E.tt);E.tt=setTimeout(()=>{el.classList.remove('on')},1800)}
// a small dialog over the editor; buttons: [label, class, fn]
function edModal(title,body,btns){const E=ED;if(!E||!E.root){const b=btns&&btns[btns.length-1];if(b)b[2]();return}const el=E.root.querySelector('#edmod');E.mb=btns;
el.innerHTML=`<div class=edbox role=dialog aria-modal=true><h3>${edEsc(title)}</h3><div class=edbody>${body}</div><div class=edrow>${btns.map((b,i)=>`<button data-a="mb:${i}" class="${b[1]}">${edEsc(b[0])}</button>`).join('')}</div></div>`;el.classList.add('on');
const f=el.querySelector('button.go')||el.querySelector('button');if(f&&f.focus)f.focus()}
function edModalOff(){const E=ED;if(!E||!E.root)return;const el=E.root.querySelector('#edmod');el.classList.remove('on');el.innerHTML='';E.mb=null}
function edModalOn(){return !!(ED&&ED.mb)}
// ----- clicks and fields in the panels -----
function edClick(e){const b=e.target.closest&&e.target.closest('[data-a]');if(!b||b.disabled)return;const a=b.dataset.a,E=ED;if(!E)return;
if(a.startsWith('mb:')){const fn=E.mb&&E.mb[+a.slice(3)];edModalOff();if(fn)fn[2]();return}
if(a.startsWith('tool:'))return edTool(a.slice(5));
if(a.startsWith('tab:')){E.tab=a.slice(4);const def={terrain:'brush',assets:E.asset?'place':'select',walls:'wall',spawns:E.tool=='start'||E.tool=='spawn'||E.tool=='zone'?E.tool:'zone'}[E.tab];return edTool(def,1)}
if(a.startsWith('ter:')||a.startsWith('ovl:')){E.terK=a[0]=='t'?'t':'o';E.ter=a.slice(4);if(!['brush','erase','fill','rect'].includes(E.tool))E.tool='brush';return edUI()}
if(a.startsWith('asset:')){E.asset=edAssets().find(x=>x.id==a.slice(6))||null;E.pvr=Math.random();if(E.asset&&E.asset.t=='v'&&!E.vcol)E.vcol=EDVC[0];E.sel=null;return edTool('place',1)}
if(a.startsWith('vcol:')){E.vcol=a.slice(5);E.need=1;return edLeft()}
if(a.startsWith('ocol:')&&E.sel&&E.sel.t=='o'){edSet(E.sel.o,{c:a.slice(5)},'Change colour');return}
if(a.startsWith('wst:')){E.wall=a.slice(4);if(E.tool!='wall')return edTool('wall');return edLeft()}
if(a.startsWith('prob:')){const p=E.probs[+a.slice(5)];if(p&&p.x!=null){if(E.cam.z<.5)E.cam.z=1;edCenter(p.x,p.y);edPickAt(p.x,p.y);edToast(p.m.slice(0,80))}return}
switch(a){case 'back':return edBack();case 'undo':return edUndo();case 'redo':return edRedo();case 'grid':E.grid^=1;E.need=1;return edTop();case 'coll':E.coll^=1;E.need=1;return edTop();case 'snap':E.snap^=1;return edTop();
case 'probs':case 'check':E.probs=cmLint(E.d);E.sel=null;E.pr=1;edUI();return edToast(E.probs.filter(p=>p.lv!='info').length?'Problems are listed on the right':'No problems found');
case 'mapset':E.sel=null;E.pr=1;return edUI();case 'save':return edSave();case 'savecopy':return edSave(1);case 'export':return edExport();case 'playtest':return edPlaytest();
case 'pl':E.pl^=1;return edUI();case 'pr':E.pr^=1;return edUI();case 'bs-':E.brush=cl(E.brush-1,1,9);return edLeft();case 'bs+':E.brush=cl(E.brush+1,1,9);return edLeft();
case 'del':return edDelete();case 'rot-':return edRotate(-15);case 'rot+':return edRotate(15);case 'rot0':if(E.sel&&E.sel.t=='o')edSet(E.sel.o,{r:0},'Turn');return;
case 'resize':{const f=E.root.querySelector('[data-f=nw]'),g=E.root.querySelector('[data-f=nh]');return edResize(+f.value,+g.value)}}}
function edInput(e){const f=e.target.dataset&&e.target.dataset.f,E=ED;if(!f||!E)return;if(f=='q'){E.q=e.target.value;const g=E.root.querySelector('#edag');if(g)g.innerHTML=edGrid()}else if(f=='brush'){E.brush=cl(+e.target.value,1,9);const v=E.root.querySelector('.edval');if(v)v.textContent=E.brush+'×'+E.brush;E.need=1}}
function edChange(e){const t=e.target,f=t.dataset&&t.dataset.f,E=ED;if(!f||!E)return;const s=E.sel,num=+t.value,ok=isFinite(num)&&t.value!=='';
if(f=='cat'){E.cat=t.value;const g=E.root.querySelector('#edag');if(g)g.innerHTML=edGrid();return}if(f=='q'||f=='brush'||f=='nw'||f=='nh')return;
if(f=='wth'){E.wth=cl(ok?Math.round(num):8,4,64);t.value=E.wth;return}
if(f=='name'){const v=String(t.value).replace(/[<>]/g,'').trim().slice(0,40)||'Untitled map';if(v!==E.d.name)edSet(E.d,{name:v},'Rename map');return}
if(f=='desc'){const v=String(t.value).replace(/[<>]/g,'').slice(0,240);if(v!==E.d.desc)edSet(E.d,{desc:v},'Change description');return}
if(f=='ground'){if(CMTI[t.value]&&t.value!==E.d.ground)edSet(E.d,{ground:t.value},'Change default ground');return}
if(!s){return}const o=s.t=='p'?E.d.start:s.o;
if(f=='on')return edSet(o,{on:t.checked},t.checked?'Turn spawn on':'Turn spawn off');
if(f=='dmg'||f=='burn')return edSet(o,{[f]:t.checked?1:0},'Change vehicle');
if(f=='s')return edSet(o,{s:t.value},'Change wall style');
if(!ok){edRight();return}
if(f=='x'||f=='y')return edSet(o,{[f]:Math.round(num*10)/10},'Move');
if(f=='r')return edSet(o,{r:((Math.round(num)%360)+360)%360},'Turn');
if(f=='w'||f=='h')return edSet(o,{[f]:Math.max(s.t=='z'?16:2,Math.round(num*10)/10)},'Resize')}
// ----- tools -----
function edTool(id,keepTab){const E=ED,t=EDT.find(x=>x[0]==id);if(!t)return;E.tool=id;E.tip='';if(t[3])E.tab=t[3];if(id!='select'&&id!='place')E.hov=null;if(id=='place'&&!E.asset)E.tab='assets';E.drag=null;E.need=1;if(E.cv)E.cv.style.cursor=id=='select'?'default':id=='place'?'copy':'crosshair';edUI()}
function edSnap(v){const E=ED;return E.snap?Math.round(v/E.step)*E.step:Math.round(v)}
function edSnapPt(x,y){return{x:edSnap(x),y:edSnap(y)}}
// any change: redraw, refresh panels, keep a crash-safe draft
function edChanged(e){const E=ED;if(!E)return;E.ver++;E.need=1;E.mmNeed=1;if(e&&e.t)E.mmDirty=1;if(E.sel&&!edAlive(E.sel))E.sel=null;edUI();clearTimeout(E.dt);E.dt=setTimeout(edDraft,2500);clearTimeout(E.lt);E.lt=setTimeout(edRelint,500)}
function edRelint(){const E=ED;if(!E)return;const a=JSON.stringify(E.probs);E.probs=cmLint(E.d);if(JSON.stringify(E.probs)!==a){edTop();if(!E.sel)edRight()}}
function edAlive(s){const d=ED.d;return s.t=='p'||(s.t=='o'?d.obj:s.t=='w'?d.walls:s.t=='s'?d.spawns:d.zones).includes(s.o)}
function edDraft(){const E=ED;if(!E)return Promise.resolve();if(!edIsDirty())return msWrite([['del','kv','draft']]).catch(()=>{});let json;try{json=cmWrite(E.d)}catch(e){return Promise.resolve()}return msWrite([['put','kv',{k:'draft',id:E.d.id,name:E.d.name,src:E.src,t:Date.now(),json}]]).catch(()=>{})}
function edUndo(){const e=hUndo();if(e)edToast('Undo: '+e.n)}
function edRedo(){const e=hRedo();if(e)edToast('Redo: '+e.n)}
// change some fields of a map object, as one undo step
function edSet(o,ch,n){const b={};let same=1;for(const k in ch){b[k]=o[k];if(o[k]!==ch[k])same=0}if(same){edRight();return}Object.assign(o,ch);hPush({n,undo(){Object.assign(o,b)},redo(){Object.assign(o,ch)}})}
function edAdd(arr,o,n){arr.push(o);hPush({n,undo(){const k=arr.indexOf(o);if(k>=0)arr.splice(k,1)},redo(){arr.push(o)}})}
function edDelete(){const E=ED,s=E.sel;if(!s||s.t=='p')return;const d=E.d,arr=s.t=='o'?d.obj:s.t=='w'?d.walls:s.t=='s'?d.spawns:d.zones,o=s.o,i=arr.indexOf(o);if(i<0)return;arr.splice(i,1);E.sel=null;E.hov=null;
const n='Delete '+(s.t=='o'?edAsset(o).n:s.t=='w'?'wall':s.t=='s'?'spawn point':'spawn zone');hPush({n,undo(){arr.splice(Math.min(i,arr.length),0,o)},redo(){const k=arr.indexOf(o);if(k>=0)arr.splice(k,1)}})}
function edRotate(a){const E=ED,s=E.sel;if(E.tool=='place'&&!s){E.rot=((E.rot+a)%360+360)%360;E.need=1;return edLeft()}if(!s||s.t!='o')return;edSet(s.o,{r:(((s.o.r||0)+a)%360+360)%360},'Turn')}
// ----- terrain painting -----
function edStroke(n){return{n,mt:new Map(),mo:new Map()}}
function edSetT(S_,i,lay,v){const d=ED.d,a=lay=='o'?d.ovl:d.ter;if(a[i]===v)return;const m=lay=='o'?S_.mo:S_.mt;if(!m.has(i))m.set(i,a[i]);a[i]=v;edTileDirty(i)}
// what a paint at tile i writes (er = erase)
function edPaintTile(S_,i,er){const E=ED,d=E.d;if(er){if(E.terK=='o')edSetT(S_,i,'o',0);else{edSetT(S_,i,'t',cmPi(d,d.ground));edSetT(S_,i,'o',0)}return}
if(E.terK=='o')edSetT(S_,i,'o',cmOi(d,E.ter));else edSetT(S_,i,'t',cmPi(d,E.ter))}
function edBrushAt(S_,tx,ty,n,er){const d=ED.d,o=Math.floor((n-1)/2);for(let y=ty-o;y<ty-o+n;y++)for(let x=tx-o;x<tx-o+n;x++)if(x>=0&&y>=0&&x<d.w&&y<d.h)edPaintTile(S_,y*d.w+x,er)}
function edLineAt(S_,x0,y0,x1,y1,n,er){const dx=Math.abs(x1-x0),dy=Math.abs(y1-y0),sx=x0<x1?1:-1,sy=y0<y1?1:-1;let e=dx-dy,x=x0,y=y0;for(let k=0;k<4096;k++){edBrushAt(S_,x,y,n,er);if(x==x1&&y==y1)break;const e2=e*2;if(e2>-dy){e-=dy;x+=sx}if(e2<dx){e+=dx;y+=sy}}}
function edStrokeEnd(S_){if(!S_.mt.size&&!S_.mo.size)return;const d=ED.d,pack=(m,arr)=>{const i=Int32Array.from(m.keys()),b=Uint8Array.from(m.values()),a=new Uint8Array(i.length);for(let k=0;k<i.length;k++)a[k]=d[arr][i[k]];return{i,b,a,arr}},P_=[pack(S_.mt,'ter'),pack(S_.mo,'ovl')];
const put=w=>{const D_=ED.d;for(const p of P_){const A=D_[p.arr];for(let k=0;k<p.i.length;k++){A[p.i[k]]=p[w][k];edTileDirty(p.i[k])}}};hPush({n:S_.n,t:1,undo(){put('b')},redo(){put('a')}})}
function edFill(tx,ty,er){const E=ED,d=E.d;if(tx<0||ty<0||tx>=d.w||ty>=d.h)return;const lay=E.terK=='o'?'o':'t',a=lay=='o'?d.ovl:d.ter,i0=ty*d.w+tx,src=a[i0],S_=edStroke(er?'Erase area':'Fill');
const seen=new Uint8Array(d.w*d.h),st=[i0];seen[i0]=1;while(st.length){const i=st.pop();edPaintTile(S_,i,er);const x=i%d.w,y=(i/d.w)|0;for(const[nx,ny]of[[x+1,y],[x-1,y],[x,y+1],[x,y-1]]){if(nx<0||ny<0||nx>=d.w||ny>=d.h)continue;const n=ny*d.w+nx;if(seen[n]||a[n]!==src)continue;seen[n]=1;st.push(n)}}edStrokeEnd(S_)}
function edPick(tx,ty,ov){const E=ED,d=E.d;if(tx<0||ty<0||tx>=d.w||ty>=d.h)return;const i=ty*d.w+tx;if(ov){const o=d.opal[d.ovl[i]];if(!o)return edToast('No overlay on that tile');E.terK='o';E.ter=o}else{E.terK='t';E.ter=d.pal[d.ter[i]]}edToast('Picked '+(((E.terK=='o'?CMOI:CMTI)[E.ter]||{n:E.ter}).n));edTool(E.prevT&&E.prevT!='pick'?E.prevT:'brush')}
// ----- walls -----
// remove the box r from every wall it touches (walls are split into the pieces that are left)
function edCut(r){const d=ED.d,rm=[],ad=[];for(const w of d.walls){if(r.x>=w.x+w.w||r.x+r.w<=w.x||r.y>=w.y+w.h||r.y+r.h<=w.y)continue;rm.push(w);
const P_=[[w.x,w.y,w.w,r.y-w.y],[w.x,r.y+r.h,w.w,w.y+w.h-(r.y+r.h)],[w.x,Math.max(w.y,r.y),r.x-w.x,Math.min(w.y+w.h,r.y+r.h)-Math.max(w.y,r.y)],[r.x+r.w,Math.max(w.y,r.y),w.x+w.w-(r.x+r.w),Math.min(w.y+w.h,r.y+r.h)-Math.max(w.y,r.y)]];
for(const p of P_)if(p[2]>=2&&p[3]>=2)ad.push({id:cmUid('w'),x:p[0],y:p[1],w:p[2],h:p[3],s:w.s})}if(!rm.length)return 0;
const at=rm.map(w=>d.walls.indexOf(w));const apply=()=>{for(const w of rm){const k=d.walls.indexOf(w);if(k>=0)d.walls.splice(k,1)}d.walls.push(...ad)},back=()=>{for(const w of ad){const k=d.walls.indexOf(w);if(k>=0)d.walls.splice(k,1)}rm.forEach((w,j)=>d.walls.splice(Math.min(at[j],d.walls.length),0,w))};
apply();ED.sel=null;hPush({n:'Cut walls',undo:back,redo:apply});return 1}
// the box a wall drag makes: a line of the chosen thickness when it is mostly along one axis, else the box itself
function edWallBox(x0,y0,x1,y1){const E=ED,t=E.wth,dx=x1-x0,dy=y1-y0;if(Math.abs(dy)<t*1.5&&Math.abs(dx)>=Math.abs(dy))return{x:Math.min(x0,x1),y:y0-t/2,w:Math.abs(dx),h:t};if(Math.abs(dx)<t*1.5)return{x:x0-t/2,y:Math.min(y0,y1),w:t,h:Math.abs(dy)};return{x:Math.min(x0,x1),y:Math.min(y0,y1),w:Math.abs(dx),h:Math.abs(dy)}}
function edBoxOf(x0,y0,x1,y1){return{x:Math.min(x0,x1),y:Math.min(y0,y1),w:Math.abs(x1-x0),h:Math.abs(y1-y0)}}
// ----- picking things under the mouse -----
function edHit(x,y){const E=ED,d=E.d,z=E.cam.z,rp=14/z;if(Math.hypot(x-d.start.x,y-d.start.y)<rp)return{t:'p',o:d.start};
for(let i=d.spawns.length-1;i>=0;i--){const s=d.spawns[i];if(Math.hypot(x-s.x,y-s.y)<12/z)return{t:'s',o:s}}
const L=d.obj.map((o,i)=>({o,b:cmBase(o),i})).sort((a,b)=>b.b-a.b||b.i-a.i);for(const{o}of L)if(edOnObj(o,x,y,2/z))return{t:'o',o};
const m=4/z;for(let i=d.walls.length-1;i>=0;i--){const w=d.walls[i];if(x>=w.x-m&&x<=w.x+w.w+m&&y>=w.y-m&&y<=w.y+w.h+m)return{t:'w',o:w}}
for(let i=d.zones.length-1;i>=0;i--){const q=d.zones[i];if(x>=q.x&&x<=q.x+q.w&&y>=q.y&&y<=q.y+q.h)return{t:'z',o:q}}return null}
function edPickAt(x,y){const h=edHit(x,y);if(h){ED.sel=h;edTool('select')}}
function edHandleAt(sx,sy){for(const[k,x,y]of edHandleList(ED.sel))if(Math.abs(edSX(x)-sx)<=7&&Math.abs(edSY(y)-sy)<=7)return k;return null}
// ----- mouse -----
function edDown(e){const E=ED;if(!E||edModalOn())return;try{if(document.activeElement&&document.activeElement.blur&&document.activeElement!==document.body)document.activeElement.blur()}catch(_){}
try{E.cv.setPointerCapture(e.pointerId)}catch(_){}const p=edLocal(e),wx=E.cam.x+p.x/E.cam.z,wy=E.cam.y+p.y/E.cam.z,d=E.d,T=d.tile,tx=Math.floor(wx/T),ty=Math.floor(wy/T),b=e.button,t=E.tool;E.mouse={x:p.x,y:p.y,wx,wy,in:1};
const pan=()=>{E.drag={t:'pan',sx:p.x,sy:p.y,cx:E.cam.x,cy:E.cam.y};E.cv.style.cursor='grabbing'};
if(b==1||(b==0&&E.space))return pan();
if(b==2){if(t=='brush'||t=='erase'){const S_=edStroke('Erase');edBrushAt(S_,tx,ty,E.brush,1);E.drag={t:'paint',S:S_,er:1,lx:tx,ly:ty};return}
if(t=='rect'){E.drag={t:'rect',x0:tx,y0:ty,er:1,r:null};return}if(t=='wall'){const q=edSnapPt(wx,wy);E.drag={t:'cut',x0:q.x,y0:q.y,r:null};return}
if(t=='place'||t=='start'||t=='spawn'||t=='zone')return edTool('select');return pan()}
if(b!=0)return;
if(t=='select'){if(E.sel){const hk=edHandleAt(p.x,p.y);if(hk){const o=E.sel.o;E.drag={t:'size',o,k:hk,b:{x:o.x,y:o.y,w:o.w,h:o.h}};return}}
const h=edHit(wx,wy);if(h){E.sel=h;const o=h.o;E.drag={t:'move',o,s:h,dx:o.x-wx,dy:o.y-wy,b:{x:o.x,y:o.y},m:0};edUI();E.need=1;return}
if(E.sel){E.sel=null;edUI()}return pan()}
if(t=='brush'||t=='erase'){const S_=edStroke(t=='erase'?'Erase':'Paint '+(((E.terK=='o'?CMOI:CMTI)[E.ter]||{n:E.ter}).n).toLowerCase());edBrushAt(S_,tx,ty,E.brush,t=='erase');E.drag={t:'paint',S:S_,er:t=='erase',lx:tx,ly:ty};return}
if(t=='fill')return edFill(tx,ty,0);if(t=='rect'){E.drag={t:'rect',x0:tx,y0:ty,er:0,r:null};return}if(t=='pick')return edPick(tx,ty,e.shiftKey);
if(t=='place'){const a=E.asset;if(!a)return edToast('Pick a prop or vehicle on the left first');const q=edSnapPt(wx,wy);const o=a.t=='v'?{id:cmUid('v'),veh:a.k,x:q.x,y:q.y,r:E.rot,c:E.vcol}:{id:cmUid('p'),k:a.k,x:q.x,y:q.y,r:E.rot,vr:Math.round(E.pvr*100)/100};E.pvr=Math.random();edAdd(d.obj,o,'Place '+a.n);return}
if(t=='wall'){const q=edSnapPt(wx,wy);E.drag={t:e.altKey?'cut':'wall',x0:q.x,y0:q.y,r:null};return}
if(t=='start'){const q=edSnapPt(wx,wy);return edSet(d.start,{x:q.x,y:q.y},'Move player start')}
if(t=='spawn'){const q=edSnapPt(wx,wy),o={id:cmUid('s'),x:q.x,y:q.y,on:true};edAdd(d.spawns,o,'Add spawn point');return}
if(t=='zone'){const q=edSnapPt(wx,wy);E.drag={t:'zone',x0:q.x,y0:q.y,r:null};return}}
function edMove(e){const E=ED;if(!E)return;const p=edLocal(e),wx=E.cam.x+p.x/E.cam.z,wy=E.cam.y+p.y/E.cam.z,T=E.d.tile,D_=E.drag;E.mouse={x:p.x,y:p.y,wx,wy,in:1};E.need=1;
if(D_){if(D_.t=='pan'){E.cam.x=D_.cx-(p.x-D_.sx)/E.cam.z;E.cam.y=D_.cy-(p.y-D_.sy)/E.cam.z;E.mmNeed=1}
else if(D_.t=='paint'){const tx=Math.floor(wx/T),ty=Math.floor(wy/T);if(tx!=D_.lx||ty!=D_.ly){edLineAt(D_.S,D_.lx,D_.ly,tx,ty,E.brush,D_.er);D_.lx=tx;D_.ly=ty}}
else if(D_.t=='rect'){const tx=Math.floor(wx/T),ty=Math.floor(wy/T);D_.r={x:Math.min(tx,D_.x0)*T,y:Math.min(ty,D_.y0)*T,w:(Math.abs(tx-D_.x0)+1)*T,h:(Math.abs(ty-D_.y0)+1)*T}}
else if(D_.t=='wall'){const q=edSnapPt(wx,wy);D_.r=edWallBox(D_.x0,D_.y0,q.x,q.y)}
else if(D_.t=='cut'||D_.t=='zone'){const q=edSnapPt(wx,wy);D_.r=edBoxOf(D_.x0,D_.y0,q.x,q.y)}
else if(D_.t=='move'){const o=D_.o,nx=edSnap(wx+D_.dx),ny=edSnap(wy+D_.dy);if(nx!==o.x||ny!==o.y){o.x=nx;o.y=ny;D_.m=1;E.mmNeed=1}}
else if(D_.t=='size'){const o=D_.o,b=D_.b,k=D_.k,q=edSnapPt(wx,wy),mn=D_.o.on!==undefined&&ED.sel&&ED.sel.t=='z'?16:2;let x0=b.x,y0=b.y,x1=b.x+b.w,y1=b.y+b.h;if(k.includes('w'))x0=Math.min(q.x,x1-mn);if(k.includes('e'))x1=Math.max(q.x,x0+mn);if(k.includes('n'))y0=Math.min(q.y,y1-mn);if(k.includes('s'))y1=Math.max(q.y,y0+mn);o.x=x0;o.y=y0;o.w=x1-x0;o.h=y1-y0;D_.m=1}}
else if(E.tool=='select'){const h=E.sel&&edHandleAt(p.x,p.y);E.cv.style.cursor=h?(h=='n'||h=='s'?'ns-resize':h=='e'||h=='w'?'ew-resize':h=='nw'||h=='se'?'nwse-resize':'nesw-resize'):'default';const hv=h?null:edHit(wx,wy);if((hv&&hv.o)!==(E.hov&&E.hov.o))E.hov=hv;if(!h&&hv)E.cv.style.cursor='move'}
edStatus()}
function edUp(e){const E=ED;if(!E)return;const D_=E.drag;E.drag=null;if(!D_)return;const d=E.d,T=d.tile;
if(D_.t=='pan'){if(E.cv)E.cv.style.cursor=E.tool=='select'?'default':E.tool=='place'?'copy':'crosshair';return}
if(D_.t=='paint')return edStrokeEnd(D_.S);
if(D_.t=='rect'){const r=D_.r||{x:D_.x0*T,y:D_.y0*T,w:T,h:T},S_=edStroke(D_.er?'Erase rectangle':'Fill rectangle');for(let y=r.y/T;y<(r.y+r.h)/T;y++)for(let x=r.x/T;x<(r.x+r.w)/T;x++)if(x>=0&&y>=0&&x<d.w&&y<d.h)edPaintTile(S_,y*d.w+x,D_.er);return edStrokeEnd(S_)}
if(D_.t=='wall'){const r=D_.r;if(!r||r.w<2||r.h<2)return edToast('Drag to draw a wall');const w={id:cmUid('w'),x:r.x,y:r.y,w:r.w,h:r.h,s:E.wall};edAdd(d.walls,w,'Draw wall');return}
if(D_.t=='cut'){const r=D_.r;if(!r||r.w<1||r.h<1)return;if(!edCut(r))edToast('No wall there to cut');return}
if(D_.t=='zone'){const r=D_.r;if(!r||r.w<16||r.h<16)return edToast('Drag a bigger box to make a spawn zone');const z={id:cmUid('z'),x:r.x,y:r.y,w:r.w,h:r.h,on:true};edAdd(d.zones,z,'Add spawn zone');E.sel={t:'z',o:z};return edUI()}
if(D_.t=='move'){if(!D_.m)return;const o=D_.o,a={x:o.x,y:o.y},b=D_.b;hPush({n:'Move '+(D_.s.t=='o'?edAsset(o).n:D_.s.t=='w'?'wall':D_.s.t=='s'?'spawn point':D_.s.t=='z'?'spawn zone':'player start'),undo(){Object.assign(o,b)},redo(){Object.assign(o,a)}});return}
if(D_.t=='size'){if(!D_.m)return;const o=D_.o,a={x:o.x,y:o.y,w:o.w,h:o.h},b=D_.b;hPush({n:'Resize',undo(){Object.assign(o,b)},redo(){Object.assign(o,a)}})}}
function edWheel(e){if(!ED||edModalOn())return;e.preventDefault();const p=edLocal(e),k=e.ctrlKey?.01:.0015;edZoom(Math.exp(-cl(e.deltaY,-300,300)*k),p.x,p.y)}
// ----- keys (the game's keydown listener sends everything here while the editor is open) -----
function edKey(e){const E=ED;if(!E)return;const k=e.key,kl=k.toLowerCase(),c=e.ctrlKey||e.metaKey,tg=e.target&&e.target.tagName,typing=tg=='INPUT'||tg=='TEXTAREA'||tg=='SELECT';
const stop=()=>{if(e.preventDefault)e.preventDefault()};
if(edModalOn()){if(k=='Escape'){stop();const b=E.mb&&E.mb[0];edModalOff();if(b&&b[0]=='Cancel')b[2]()}return}
if(c&&kl=='s'){stop();if(typing&&e.target.blur)e.target.blur();return edSave()}
if(typing){if(k=='Escape'&&e.target.blur)e.target.blur();return}
if(c&&kl=='z'){stop();return e.shiftKey?edRedo():edUndo()}if(c&&kl=='y'){stop();return edRedo()}if(c)return;
if(k==' '){stop();E.space=1;if(E.cv)E.cv.style.cursor='grab';return}
if(k=='Escape'){if(E.drag){const D_=E.drag;E.drag=null;if(D_.t=='move')Object.assign(D_.o,D_.b);if(D_.t=='size')Object.assign(D_.o,D_.b);if(D_.t=='paint')edStrokeEnd(D_.S);E.need=1;return}if(E.tool!='select')return edTool('select');if(E.sel){E.sel=null;edUI()}return}
if(k=='Delete'||k=='Backspace'){stop();return edDelete()}
if(e.shiftKey&&kl=='g'){E.grid^=1;E.need=1;return edTop()}if(e.shiftKey&&kl=='c'){E.coll^=1;E.need=1;return edTop()}if(e.shiftKey&&kl=='s'){E.snap^=1;edToast(E.snap?'Snap on':'Snap off');return edTop()}
if(kl=='r'){stop();return edRotate(e.shiftKey?-15:15)}
if(k=='['||k==']'){E.brush=cl(E.brush+(k==']'?1:-1),1,9);E.need=1;return edLeft()}
if(k=='+'||k=='='){return edZoom(1.25)}if(k=='-'||k=='_'){return edZoom(1/1.25)}if(k=='0'){return edFit()}
if(k.startsWith('Arrow')){stop();const dx=k=='ArrowLeft'?-1:k=='ArrowRight'?1:0,dy=k=='ArrowUp'?-1:k=='ArrowDown'?1:0,s=E.sel;
if(s){const o=s.t=='p'?E.d.start:s.o,st=e.shiftKey?E.step:1;return edSet(o,{x:o.x+dx*st,y:o.y+dy*st},'Nudge')}E.cam.x+=dx*80/E.cam.z;E.cam.y+=dy*80/E.cam.z;E.need=1;E.mmNeed=1;return}
if(!e.shiftKey&&!e.altKey){const t=EDT.find(x=>x[2].toLowerCase()==kl);if(t){if(t[0]=='pick')E.prevT=E.tool;return edTool(t[0])}}}
function edKeyUp(e){if(!ED)return;if(e.key==' '){ED.space=0;if(ED.cv&&!ED.drag)ED.cv.style.cursor=ED.tool=='select'?'default':ED.tool=='place'?'copy':'crosshair'}}
// ----- map size -----
function edResize(nw,nh){const E=ED,d=E.d,T=d.tile;nw=cl(Math.round(nw)||d.w,CMMIN[0],CMMAX);nh=cl(Math.round(nh)||d.h,CMMIN[1],CMMAX);if(nw==d.w&&nh==d.h){edRight();return}
const MW=nw*T,MH=nh*T,gone={obj:d.obj.filter(o=>o.x>MW||o.y>MH),walls:d.walls.filter(w=>w.x>=MW||w.y>=MH),spawns:d.spawns.filter(s=>s.x>MW||s.y>MH),zones:d.zones.filter(z=>z.x>=MW||z.y>=MH)};
const n=gone.obj.length+gone.walls.length+gone.spawns.length+gone.zones.length,cut=d.w*d.h-Math.min(d.w,nw)*Math.min(d.h,nh)>0&&(nw<d.w||nh<d.h);
const go=()=>edResizeNow(nw,nh,gone);if(!n&&!cut)return go();
const parts=[];if(gone.obj.length)parts.push(gone.obj.length+' prop'+(gone.obj.length>1?'s':''));if(gone.walls.length)parts.push(gone.walls.length+' wall'+(gone.walls.length>1?'s':''));if(gone.spawns.length)parts.push(gone.spawns.length+' spawn point'+(gone.spawns.length>1?'s':''));if(gone.zones.length)parts.push(gone.zones.length+' spawn zone'+(gone.zones.length>1?'s':''));
edModal('Make the map smaller?',`<p>The map becomes ${nw}×${nh} tiles. Ground painted beyond that is cut off${parts.length?', and these are removed: <b>'+parts.join(', ')+'</b>':''}.</p><p>You can undo this.</p>`,[['Cancel','',()=>{edRight()}],['Resize','red',go]])}
function edResizeNow(nw,nh,gone){const E=ED,d=E.d,T=d.tile,MW=nw*T,MH=nh*T,b={w:d.w,h:d.h,ter:d.ter,ovl:d.ovl,start:{x:d.start.x,y:d.start.y}},gi=d.pal.indexOf(d.ground)>=0?d.pal.indexOf(d.ground):cmPi(d,d.ground);
const nt=new Uint8Array(nw*nh).fill(gi),no=new Uint8Array(nw*nh);for(let y=0;y<Math.min(d.h,nh);y++)for(let x=0;x<Math.min(d.w,nw);x++){nt[y*nw+x]=d.ter[y*d.w+x];no[y*nw+x]=d.ovl[y*d.w+x]}
const rem=[];for(const k of['obj','walls','spawns','zones'])for(const o of gone[k])rem.push({k,o,i:d[k].indexOf(o)});rem.sort((a,c)=>a.i-c.i);
const clips=[];for(const w of d.walls.concat(d.zones))if(!rem.some(r=>r.o===w)&&(w.x+w.w>MW||w.y+w.h>MH))clips.push({o:w,b:{w:w.w,h:w.h},a:{w:Math.min(w.w,MW-w.x),h:Math.min(w.h,MH-w.y)}});
const a={w:nw,h:nh,ter:nt,ovl:no,start:{x:cl(d.start.x,8,MW-8),y:cl(d.start.y,8,MH-8)}};
const apply=s=>{d.w=s.w;d.h=s.h;d.ter=s.ter;d.ovl=s.ovl;d.start.x=s.start.x;d.start.y=s.start.y};
const redo=()=>{apply(a);for(let j=rem.length-1;j>=0;j--){const r=rem[j],k=d[r.k].indexOf(r.o);if(k>=0)d[r.k].splice(k,1)}for(const c of clips)Object.assign(c.o,c.a);ED.sel=null;edAllDirty();edLay()},
undo=()=>{apply(b);for(const r of rem)d[r.k].splice(Math.min(r.i,d[r.k].length),0,r.o);for(const c of clips)Object.assign(c.o,c.b);edAllDirty();edLay()};
redo();hPush({n:'Resize map',t:1,undo,redo});edFit()}
// ----- saving -----
async function edSave(copy){const E=ED;if(!E||E.saving)return 0;E.saving=1;edToast('Saving…');let ok=0;
try{let d=E.d;if(copy){d=cmClone(E.d);d.id=cmUid('m');d.name=(E.d.name.slice(0,33)+' (copy)');d.created=new Date().toISOString()}d.updated=new Date().toISOString();
const json=cmWrite(d),thumb=edMakeThumb(d);await msWrite([['put','maps',{id:d.id,json}],['put','meta',{id:d.id,name:d.name,desc:d.desc,w:d.w,h:d.h,created:d.created,updated:d.updated,thumb}],['del','kv','draft']]);
if(!ED)return 1;if(copy){hReset();E.d=d;edAllDirty()}E.mark=hTop();E.src='saved';E.probs=cmLint(E.d);ok=1;cmLoadAll().catch(()=>{});edToast(copy?'Saved a copy: you are now editing it':msMem()?'Saved for this visit only (export to keep it)':'Saved')}
catch(err){edModal('Could not save',`<p>${edEsc(err&&err.message||err)}</p><p>Your changes are still here. Use Export JSON to keep a copy on your computer.</p>`,[['OK','',()=>0],['Export JSON','go',edExport]])}
finally{if(ED){ED.saving=0;edUI()}}return ok}
function edExport(){const E=ED;if(!E)return;cmDownload(E.d.name,cmWrite(E.d)).then(ok=>edToast(ok?'Exported':'Export cancelled'))}
// download a map file
// inside the Claude artifact viewer files go through its save prompt (the "downloads" capability); everywhere else, a normal download.
// Resolves 1 when the file was handed over, 0 when the viewer said no.
function cmDownload(name,json){const fn=(String(name||'map').replace(/[^\w\- ]+/g,'').trim().replace(/\s+/g,'-')||'map')+'.zombdash-map.json',txt=JSON.stringify(json,null,1);
const plain=()=>{try{const b=new Blob([txt],{type:'application/json'}),u=URL.createObjectURL(b),a=document.createElement('a');a.href=u;a.download=fn;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),4000)}catch(e){}return 1};
let cu=null;try{const C=globalThis.claude;if(C&&typeof C.use=='function')cu=C.use('downloads')}catch(e){}if(!cu)return Promise.resolve(plain());
return Promise.resolve(cu).then(dl=>dl?dl.save({filename:fn,data:txt}).then(()=>1,e=>e&&e.code=='declined'?0:plain()):plain(),()=>plain())}
// ----- playtest -----
function edPlaytest(){const E=ED,u=(S.ac.un||[0]).filter(i=>CH[i]).sort((a,b)=>a-b),ci=u.includes(E.ptc!=null?E.ptc:sel)?(E.ptc!=null?E.ptc:sel):u[0],pr=E.probs.filter(p=>p.lv=='err');
edModal('Playtest',`<p>Plays this map in the real game. Nothing you earn is kept, and Esc → Back to editor returns here with everything as you left it.</p>${pr.length?`<p class=edwarn>⚠ ${edEsc(pr[0].m)}</p>`:''}
<label class=edf><span>Survivor</span><select id=edptc>${u.map(i=>`<option value=${i}${i==ci?' selected':''}>${edEsc(CH[i].n)}</option>`).join('')}</select></label>
<label class=edf><span>Start at wave</span><select id=edptw>${[1,5,9,10,15,19,20].map(w=>`<option${w==(E.ptw||1)?' selected':''}>${w}</option>`).join('')}</select></label>
<label class=edf><span>Difficulty</span><select id=edptd>${[0,1,2].map(i=>`<option value=${i}${i==(E.ptd!=null?E.ptd:S.dlf)?' selected':''}>${DNm(i,0)}</option>`).join('')}</select></label>`,
[['Cancel','',()=>0],['Start','go',()=>{const q=id=>{const el=E.root&&E.root.querySelector('#'+id);return el?+el.value:null};E.ptc=q('edptc')??ci;E.ptw=q('edptw')||1;E.ptd=q('edptd')??S.dlf;edModalOff();ptStart({ci:E.ptc,w:E.ptw,dif:E.ptd})}]])}
function edHide(){const E=ED;if(!E)return;E.vis=0;if(E.root)E.root.style.display='none'}
function edShow(){const E=ED;if(!E)return;E.vis=1;mode='edit';if(E.root)E.root.style.display='';E.need=1;E.mmNeed=1;edUI()}
// leaving the page with unsaved changes: the browser asks first (and the draft is kept)
addEventListener('beforeunload',e=>{if(ED&&edIsDirty()){edDraft();e.preventDefault();e.returnValue=''}});
