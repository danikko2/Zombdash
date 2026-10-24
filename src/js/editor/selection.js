//# editor/selection.js — Map Workshop step 2: multi-select, box select, moving / turning / deleting groups, copy / paste / duplicate, draw order, layers, collision shapes
// ---------- selection ----------
// ED.sel is a list of {t,o}: t is 'o' (prop, vehicle, decal or effect), 'w' wall, 'a' area, 'l' path, 'f' special feature, 's' spawn point,
// 'z' spawn zone or 'p' the player start; o is the object in ED.d.
// Everything here changes the map through the one history (hPush / edMut), so every step can be undone.
let EDCB=null; // the clipboard; it stays while the page is open, so things can be copied from one map into another
function edArr(t){const d=ED.d;return t=='o'?d.obj:t=='w'?d.walls:t=='s'?d.spawns:t=='z'?d.zones:t=='a'?d.areas:t=='l'?d.paths:t=='f'?d.feats:null}
function edLyIt(it){return it.t=='p'?null:cmLy(ED.d,it.o.ly)}
// shown in the editor (its layer isn't hidden, it isn't hidden itself)
function edVisIt(it){if(it.t=='p')return true;const l=edLyIt(it);return !it.o.hd&&!(l&&l.hid)}
function edLyLocked(it){const l=edLyIt(it);return !!(l&&l.lock)}
// can't be changed: its layer is locked, or it is locked itself
function edLockIt(it){return it.t!='p'&&(!!it.o.lk||edLyLocked(it))}
function edSelOf(o){return ED.sel.find(s=>s.o===o)||null}
function edOne(){return ED.sel.length==1?ED.sel[0]:null}
// the part of the selection that edits may change
function edFree(){return ED.sel.filter(s=>!edLockIt(s))}
function edItName(it){const o=it.o;if(it.t=='a'){const T=cmArea(o.a);return T?T.n.toLowerCase():'area'}if(it.t=='l'){const T=cmPath(o.p);return T?T.n.toLowerCase():'path'}if(it.t=='f'){const T=cmFeat(o.f);return T?T.n.toLowerCase():'special feature'}return it.t=='o'?edAsset(o).n:it.t=='w'?'wall':it.t=='s'?'spawn point':it.t=='z'?'spawn zone':'player start'}
function edNameOf(L,verb){return verb+' '+(L.length>1?L.length+' things':edItName(L[0]))}
function edAlive(s){const d=ED.d;if(s.t=='p')return !!d.start&&s.o===d.start;const a=edArr(s.t);return !!a&&a.includes(s.o)}
function edSelect(L){const E=ED,keep=E.she&&L.length==1&&E.sel.length==1&&L[0].o===E.sel[0].o;E.sel=L.filter(Boolean);if(!keep)E.she=0;E.need=1;edUI()}
function edSelToggle(it){const S=ED.sel.slice(),i=S.findIndex(s=>s.o===it.o);if(i>=0)S.splice(i,1);else S.push(it);edSelect(S)}
// one undo step for changes to some map objects: snapshot them, change them, snapshot again (their identity never changes)
function edClone(o){return JSON.parse(JSON.stringify(o))}
function edRestore(o,s){for(const k of Object.keys(o))if(!(k in s))delete o[k];Object.assign(o,edClone(s))}
function edMut(n,objs,fn){const B=objs.map(edClone);fn();const A=objs.map(edClone);if(JSON.stringify(A)===JSON.stringify(B)){edUI();return 0}
hPush({n,undo(){objs.forEach((o,i)=>edRestore(o,B[i]))},redo(){objs.forEach((o,i)=>edRestore(o,A[i]))}});return 1}
// draw order of walls, props and vehicles (all of them, hidden too), rebuilt after each change
function edDL(){const E=ED;if(E.dlV!==E.ver){E.dl=cmDrawList(E.d,0);E.dlV=E.ver}return E.dl}
// ----- picking -----
// what is under the mouse: the player start, spawn points, then walls / props / vehicles from the top down, then zones.
// Things on hidden or locked layers can't be picked; a locked object can (to see it and unlock it) but not changed.
function edHit(x,y){const E=ED,d=E.d,z=E.cam.z,ok=it=>edVisIt(it)&&!edLyLocked(it);
if(d.start&&Math.hypot(x-d.start.x,y-d.start.y)<14/z)return{t:'p',o:d.start};
for(let i=d.spawns.length-1;i>=0;i--){const it={t:'s',o:d.spawns[i]};if(ok(it)&&Math.hypot(x-it.o.x,y-it.o.y)<12/z)return it}
// the road graph's nodes and roads come first (they sit on top), then two passes over the draw list from the top down:
// first walls, props, vehicles, decals, effects, roofs and fences, then big ground pieces (floors, roads, ponds, zones of effect)
for(let i=d.feats.length-1;i>=0;i--){const f=d.feats[i],it={t:'f',o:f};if(!f.pts||!ok(it))continue;const N=f.pts.map(p=>[f.x+p[0],f.y+p[1]]);if(N.some(n=>Math.hypot(n[0]-x,n[1]-y)<9/z)||(f.e||[]).some(e=>N[e[0]]&&N[e[1]]&&cmPolyDist([N[e[0]],N[e[1]]],x,y)<5/z))return it}
const L=edDL(),bg=q=>q.t=='a'?((cmArea(q.o.a)||{}).cat!='struct'):q.t=='l'?((cmPath(q.o.p)||{}).cat!='barrier'):false;
for(const pass of[0,1])for(let i=L.length-1;i>=0;i--){const q=L[i];if(bg(q)!=!!pass)continue;const it={t:q.t,o:q.o};if(!ok(it))continue;
if(q.t=='w'||q.t=='a'){const m=4/z,w=q.o;if(x>=w.x-m&&x<=w.x+w.w+m&&y>=w.y-m&&y<=w.y+w.h+m)return it}else if(q.t=='l'){if(edOnPath(q.o,x,y))return it}else if(edOnObj(q.o,x,y,2/z))return it}
for(let i=d.feats.length-1;i>=0;i--){const f=d.feats[i],it={t:'f',o:f};if(f.pts||!ok(it))continue;if(x>=f.x&&x<=f.x+f.w&&y>=f.y&&y<=f.y+f.h)return it}
for(let i=d.zones.length-1;i>=0;i--){const it={t:'z',o:d.zones[i]},q=it.o;if(ok(it)&&x>=q.x&&x<=q.x+q.w&&y>=q.y&&y<=q.y+q.h)return it}return null}
// is (x,y) on a path (within its width; inside it for closed shapes)?
function edOnPath(o,x,y){const P=cmPathSm(o),T=cmPath(o.p),z=ED.cam.z;if(P.length<2)return false;if(T&&T.closed&&P.length>2&&cmPolyIn(P,x,y))return true;return cmPolyDist(T&&T.closed?P.concat([P[0]]):P,x,y)<=Math.max(5/z,(o.w||(T&&T.w)||8)/2+2/z)}
// world box around one thing / a group
function edBB(it){const o=it.o;if(it.t=='w'||it.t=='z'||it.t=='a'||it.t=='f'&&!o.pts)return{x0:o.x,y0:o.y,x1:o.x+o.w,y1:o.y+o.h};
if(it.t=='l'||it.t=='f'){const b=cmPolyBB(o.pts.map(p=>[o.x+p[0],o.y+p[1]])),m=it.t=='l'?(o.w||(cmPath(o.p)||{w:8}).w)/2:0;return{x0:b.x0-m,y0:b.y0-m,x1:b.x1+m,y1:b.y1+m}}if(it.t!='o')return{x0:o.x,y0:o.y,x1:o.x,y1:o.y};
const b=edBox(o),a=(o.r||0)*Math.PI/180,c=Math.cos(a),s=Math.sin(a);let x0=1e9,y0=1e9,x1=-1e9,y1=-1e9;for(const[px,py]of[[b.x0,b.y0],[b.x1,b.y0],[b.x0,b.y1],[b.x1,b.y1]]){const X_=o.x+px*c-py*s,Y_=o.y+px*s+py*c;x0=Math.min(x0,X_);y0=Math.min(y0,Y_);x1=Math.max(x1,X_);y1=Math.max(y1,Y_)}return{x0,y0,x1,y1}}
function edBBAll(L){let x0=1e9,y0=1e9,x1=-1e9,y1=-1e9;for(const it of L){const b=edBB(it);x0=Math.min(x0,b.x0);y0=Math.min(y0,b.y0);x1=Math.max(x1,b.x1);y1=Math.max(y1,b.y1)}return{x0,y0,x1,y1}}
// everything that could be selected, in a fixed order
function edAllItems(){const d=ED.d,L=[];if(d.start)L.push({t:'p',o:d.start});for(const o of d.spawns)L.push({t:'s',o});for(const o of d.obj)L.push({t:'o',o});for(const o of d.walls)L.push({t:'w',o});for(const o of d.areas)L.push({t:'a',o});for(const o of d.paths)L.push({t:'l',o});for(const o of d.zones)L.push({t:'z',o});for(const o of d.feats)L.push({t:'f',o});return L}
// select everything completely inside the box r (shown, not locked); add=1 keeps what was selected
function edBoxSel(r,add){const inR=b=>b.x0>=r.x&&b.y0>=r.y&&b.x1<=r.x+r.w&&b.y1<=r.y+r.h,L=edAllItems().filter(it=>edVisIt(it)&&!edLockIt(it)&&inR(edBB(it)));
if(!add)return edSelect(L);const S=ED.sel.slice();for(const it of L)if(!S.some(s=>s.o===it.o))S.push(it);edSelect(S)}
function edSelAll(){edSelect(edAllItems().filter(it=>edVisIt(it)&&!edLockIt(it)))}
// ----- changing the selection -----
function edDelete(){const E=ED,L=edFree();if(!L.length){if(E.sel.length)edToast('Locked: unlock it to delete it');return}
const d=E.d,R=[];let st=null;for(const s of L){if(s.t=='p'){st=d.start;continue}const a=edArr(s.t),i=a.indexOf(s.o);if(i>=0)R.push({a,i,o:s.o})}R.sort((x,y)=>x.i-y.i);
const apply=()=>{for(const r of R){const k=r.a.indexOf(r.o);if(k>=0)r.a.splice(k,1)}if(st)d.start=null},back=()=>{for(const r of R)r.a.splice(Math.min(r.i,r.a.length),0,r.o);if(st)d.start=st};
apply();E.sel=E.sel.filter(s=>edLockIt(s));E.hov=null;E.she=0;hPush({n:edNameOf(L,'Delete'),undo:back,redo:apply})}
// R turns every selected prop and vehicle in place (15° a press); their collision shapes turn with them
function edRotate(a){const E=ED;if(E.tool=='place'&&!E.sel.length){E.rot=((E.rot+a)%360+360)%360;E.need=1;return edLeft()}
const L=edFree().filter(s=>s.t=='o'||s.t=='l'||s.t=='f'&&s.o.pts);if(!L.length){if(E.sel.some(s=>s.t=='o'||s.t=='l'))edToast('Locked: unlock it to turn it');else if(E.sel.length)edToast('Only props, vehicles, decals, effects and paths turn (the group buttons on the right turn a whole group)');return}
edMut(edNameOf(L,'Turn'),L.map(s=>s.o),()=>{for(const s of L){const o=s.o;if(s.t!='o'){edTurnPts(o,a);continue}o.r=(((o.r||0)+a)%360+360)%360;if(o.sh)o.sh=cmTurnShape(o.sh,a)}})}
// turn the whole group a quarter turn around its middle: positions turn, walls and zones swap width and height
function edTurnGroup(dir){const L=edFree();if(!L.length)return;const B=edBBAll(L),cx=(B.x0+B.x1)/2,cy=(B.y0+B.y1)/2,a=dir*90,rot=(x,y)=>dir>0?[cx-(y-cy),cy+(x-cx)]:[cx+(y-cy),cy-(x-cx)];
edMut(edNameOf(L,'Turn'),L.map(s=>s.o),()=>{for(const s of L){const o=s.o;if(s.t=='l'||s.t=='f'&&o.pts){edTurnPts(o,a,cx,cy);continue}if(s.t=='w'||s.t=='z'||s.t=='a'||s.t=='f'){const[mx,my]=rot(o.x+o.w/2,o.y+o.h/2),w=o.h,h=o.w;o.x=cmR1(mx-w/2);o.y=cmR1(my-h/2);o.w=w;o.h=h}
else{const[nx,ny]=rot(o.x,o.y);o.x=cmR1(nx);o.y=cmR1(ny);if(s.t=='o'){o.r=(((o.r||0)+a)%360+360)%360;if(o.sh)o.sh=cmTurnShape(o.sh,a)}}}})}
function edNudge(dx,dy){const L=edFree();if(!L.length){if(ED.sel.length)edToast('Locked: unlock it to move it');return}edMut(edNameOf(L,'Move'),L.map(s=>s.o),()=>{for(const s of L){s.o.x=cmR1(s.o.x+dx);s.o.y=cmR1(s.o.y+dy)}})}
// draw order inside a layer: how = 'front', 'back', 1 (forward) or -1 (backward)
function edOrder(how){const L=edFree().filter(s=>s.t=='o'||s.t=='w'||s.t=='a'||s.t=='l');if(!L.length){if(ED.sel.length)edToast('Only walls, props, vehicles, decals, areas and paths have a draw order');return}
const n=how=='front'?'Bring to front':how=='back'?'Send to back':how>0?'Bring forward':'Send backward';
// kit pieces keep their place in the stack (floors under rugs under decals): front / back compare the order they are drawn in
edMut(n,L.map(s=>s.o),()=>{for(const s of L){const o=s.o,pr=cmPri(o,s.t),oth=edDL().filter(q=>q.o.ly===o.ly&&q.o!==o).map(q=>q.z);
if(how=='front')o.z=(oth.length?Math.max(...oth):0)+1-pr;else if(how=='back')o.z=(oth.length?Math.min(...oth):0)-1-pr;else o.z=(o.z||0)+how;if(!o.z)delete o.z}})}
// ----- copy, cut, paste, duplicate -----
function edCopy(cut){const S=ED.sel.filter(s=>s.t!='p');if(!S.length){edToast('Select something to copy');return 0}const B=edBBAll(S);
EDCB={cx:(B.x0+B.x1)/2,cy:(B.y0+B.y1)/2,items:S.map(s=>({t:s.t,o:edClone(s.o)}))};
if(cut){ED.sel=S;edDelete()}else edToast('Copied '+(S.length>1?S.length+' things':edItName(S[0]))+' (Ctrl+V pastes at the mouse)');return 1}
// paste a clipboard moved by dx,dy: copies get new ids, keep their layer when they can, and come in unlocked and shown
function edPasteItems(CB,dx,dy,verb){const E=ED,d=E.d,add=[];let skip=0;
for(const it of CB.items){const o=edClone(it.o);o.id=cmUid(it.t=='o'?(o.veh?'v':'p'):it.t);delete o.lk;delete o.hd;o.x=cmR1(o.x+dx);o.y=cmR1(o.y+dy);
let l=cmLy(d,o.ly);if(!l||l.k!='o'||l.lock||l.hid){const id=edTargetLy(it.t,o,1);l=id&&cmLy(d,id)}if(!l){skip++;continue}o.ly=l.id;add.push({t:it.t,o})}
if(!add.length){edToast('Nothing pasted: the layers are locked or hidden');return 0}
const apply=()=>{for(const a of add)edArr(a.t).push(a.o)},back=()=>{for(const a of add){const r=edArr(a.t),k=r.indexOf(a.o);if(k>=0)r.splice(k,1)}};
apply();E.sel=add.map(a=>({t:a.t,o:a.o}));E.she=0;hPush({n:edNameOf(add,verb),undo:back,redo:apply});if(skip)edToast(skip+' not pasted: no unlocked, shown layer for them');return add.length}
function edPaste(){const E=ED;if(!EDCB)return edToast('Nothing copied yet: Ctrl+C copies the selection');const m=E.mouse,x=m.in?m.wx:E.cam.x+edVW()/2/E.cam.z,y=m.in?m.wy:E.cam.y+edVH()/2/E.cam.z;
edPasteItems(EDCB,edSnap1(x-EDCB.cx),edSnap1(y-EDCB.cy),'Paste')}
function edDup(){const S=ED.sel.filter(s=>s.t!='p');if(!S.length)return edToast('Select something to duplicate');const st=ED.snap?ED.step:16,B=edBBAll(S);
edPasteItems({cx:(B.x0+B.x1)/2,cy:(B.y0+B.y1)/2,items:S.map(s=>({t:s.t,o:edClone(s.o)}))},st,st,'Duplicate')}
// a move that keeps things on the grid (pasting snaps by whole grid steps)
function edSnap1(v){const E=ED;return E.snap?Math.round(v/E.step)*E.step:Math.round(v)}
// ----- layers -----
// the layer new things of kind t go on: the layer picked in the Layers panel, or (Auto) the layer for that kind of thing
function edTargetLy(t,o,quiet){const E=ED,d=E.d,a=E.al&&cmLy(d,E.al),id=a&&a.k=='o'?a.id:cmDefLy(d,t=='o'?'o':t,o),l=id&&cmLy(d,id);
if(!l){if(!quiet)edToast('There is no object layer: add one in the Layers panel');return null}
if(l.lock){if(!quiet)edToast('The “'+l.n+'” layer is locked: unlock it in the Layers panel');return null}
if(l.hid){if(!quiet)edToast('The “'+l.n+'” layer is hidden: show it in the Layers panel');return null}return id}
// a change to the layer list as one undo step (tile layers: the cached terrain is repainted)
function edLyMut(n,fn,tiles){const d=ED.d,B=JSON.stringify(d.layers);fn();const A=JSON.stringify(d.layers);if(A===B){edUI();return 0}
const set=s=>{d.layers.splice(0,d.layers.length,...JSON.parse(s));if(tiles)edAllDirty()};if(tiles)edAllDirty();hPush({n,undo(){set(B)},redo(){set(A)}});return 1}
function edLyVis(id){const l=cmLy(ED.d,id);if(l)edLyMut((l.hid?'Show':'Hide')+' layer “'+l.n+'”',()=>{l.hid=l.hid?0:1},l.k=='t')}
function edLyLock(id){const l=cmLy(ED.d,id);if(l)edLyMut((l.lock?'Unlock':'Lock')+' layer “'+l.n+'”',()=>{l.lock=l.lock?0:1})}
function edLyRename(id,n){const l=cmLy(ED.d,id);n=String(n||'').replace(/[<>]/g,'').trim().slice(0,32);if(!l||!n||n===l.n){edUI();return}edLyMut('Rename layer',()=>{l.n=n})}
function edLyAdd(){const E=ED,d=E.d,a=E.al&&cmLy(d,E.al),id=cmUid('l');let k=1;while(d.layers.some(l=>l.n=='New layer '+k))k++;
edLyMut('Add layer',()=>{const i=a&&a.k=='o'?d.layers.indexOf(a)+1:d.layers.length;d.layers.splice(i,0,{id,n:'New layer '+k,k:'o',hid:0,lock:0})});E.al=id;edUI()}
// move an object layer up (dir 1, drawn later) or down among the object layers (the tile layers stay at the bottom)
function edLyMove(id,dir){const d=ED.d,i=d.layers.findIndex(l=>l.id===id),j=i+dir;if(i<0||d.layers[i].k!='o'||j<0||j>=d.layers.length||d.layers[j].k!='o')return;
edLyMut(dir>0?'Move layer up':'Move layer down',()=>{const t=d.layers[i];d.layers[i]=d.layers[j];d.layers[j]=t})}
function edLyCount(id){const d=ED.d;return d.obj.concat(d.walls,d.spawns,d.zones,d.areas,d.paths,d.feats).filter(o=>o.ly===id).length}
// delete an object layer: its things are moved to another layer or deleted with it (asks first when it has any)
function edLyDel(id){const E=ED,d=E.d,l=cmLy(d,id);if(!l)return;if(l.k=='t')return edToast('The Terrain and Roads layers can\'t be deleted');
const ol=d.layers.filter(q=>q.k=='o');if(ol.length<2)return edToast('A map needs at least one object layer');
const n=edLyCount(id),i=ol.indexOf(l),to=ol[i>0?i-1:i+1];if(!n)return edLyDelNow(id,null);
edModal('Delete the layer “'+l.n+'”?',`<p>It holds <b>${n} thing${n>1?'s':''}</b>. Move them to the layer “${edEsc(to.n)}”, or delete them with it? You can undo either.</p>`,[['Cancel','',()=>0],['Delete them too','red',()=>edLyDelNow(id,null)],['Move to “'+to.n+'”','go',()=>edLyDelNow(id,to.id)]])}
function edLyDelNow(id,to){const E=ED,d=E.d,B=JSON.stringify(d.layers),li=d.layers.findIndex(l=>l.id===id),lyN=d.layers[li].n,R=[],M=[];
for(const t of['o','w','s','z','a','l','f']){const a=edArr(t);a.forEach((o,i)=>{if(o.ly===id){if(to)M.push(o);else R.push({a,i,o})}})}
const apply=()=>{d.layers.splice(d.layers.findIndex(l=>l.id===id),1);for(const o of M)o.ly=to;for(let k=R.length-1;k>=0;k--){const r=R[k],x=r.a.indexOf(r.o);if(x>=0)r.a.splice(x,1)}if(E.al===id)E.al=''},
back=()=>{d.layers.splice(0,d.layers.length,...JSON.parse(B));for(const o of M)o.ly=id;for(const r of R)r.a.splice(Math.min(r.i,r.a.length),0,r.o)};
apply();hPush({n:'Delete layer “'+lyN+'”',undo:back,redo:apply})}
// put the selection on another layer
function edLyMoveSel(id){const E=ED,l=cmLy(E.d,id),L=edFree().filter(s=>s.t!='p');if(!l||l.k!='o')return;if(!L.length)return edToast(E.sel.length?'Locked: unlock it first':'Select something first');
if(l.lock)return edToast('The “'+l.n+'” layer is locked');edMut(edNameOf(L,'Move')+' to “'+l.n+'”',L.map(s=>s.o),()=>{for(const s of L)s.o.ly=id});if(l.hid)edToast('Moved to “'+l.n+'”, which is hidden')}
// ----- per-object settings: solid, lock, hide (hide is for the editor only: the game still has it) -----
function edSolidDef(it){const o=it.o;if(it.t=='w'||it.t=='a'||it.t=='l'){const q=Object.assign({},o);delete q.sol;return cmSolid(q,it.t)}return o.veh?!!cmHW(o.veh):!!(cmOB(o.k)&&cmOB(o.k).c)}
function edSetSolid(L,on){L=L.filter(s=>(s.t=='o'&&!s.o.dc&&!s.o.fx||s.t=='w'||s.t=='a'||s.t=='l')&&!edLockIt(s));if(!L.length)return;edMut(on?'Make solid':'Make not solid',L.map(s=>s.o),()=>{for(const s of L){const o=s.o;if(on===edSolidDef(s))delete o.sol;else o.sol=on;
if(on&&s.t=='o'&&!o.sh&&!cmObjBoxes(o).length)o.sh=edShapeInit(o,'r')}})}
function edSetFlag(L,k,on,n){L=L.filter(s=>s.t!='p'&&(k=='lk'||!edLockIt(s)));if(!L.length)return;edMut(n,L.map(s=>s.o),()=>{for(const s of L){if(on)s.o[k]=true;else delete s.o[k]}})}
// ----- collision shapes -----
// a shape matching the object's collision now (or the bottom of its picture): t 'r' box, 'c' circle
function edShapeInit(o,t){let B=cmObjBoxes(Object.assign({},o,{sh:null,sol:true})),x0=1e9,y0=1e9,x1=-1e9,y1=-1e9;
if(!B.length){const b=edBox(o);B=[[o.x+b.x0*.8,o.y+b.y1-Math.max(6,(b.y1-b.y0)*.4),(b.x1-b.x0)*.8,Math.max(6,(b.y1-b.y0)*.4)]]}
for(const b of B){x0=Math.min(x0,b[0]);y0=Math.min(y0,b[1]);x1=Math.max(x1,b[0]+b[2]);y1=Math.max(y1,b[1]+b[3])}
if(t=='c')return{t:'c',x:cmR1((x0+x1)/2-o.x),y:cmR1((y0+y1)/2-o.y),r:cmR1(Math.max(4,Math.max(x1-x0,y1-y0)/2))};return{t:'r',x:cmR1(x0-o.x),y:cmR1(y0-o.y),w:cmR1(Math.max(4,x1-x0)),h:cmR1(Math.max(4,y1-y0))}}
function edSetShape(L,t){L=L.filter(s=>s.t=='o'&&!edLockIt(s));if(!L.length)return;edMut(t=='a'?'Use the picture\'s collision':t=='c'?'Circle collision':'Box collision',L.map(s=>s.o),()=>{for(const s of L){const o=s.o;if(t=='a')delete o.sh;else{if(!o.sh||o.sh.t!=t)o.sh=edShapeInit(o,t);if(!cmSolid(o,'o'))o.sol=true}}});
if(t!='a'&&L.length==1&&ED.sel.length==1){ED.she=1;ED.need=1;edUI()}}
// the shape of o in world space as a box
function edShapeRect(o){const s=o.sh;return s.t=='r'?{x0:o.x+s.x,y0:o.y+s.y,x1:o.x+s.x+s.w,y1:o.y+s.y+s.h}:{x0:o.x+s.x-s.r,y0:o.y+s.y-s.r,x1:o.x+s.x+s.r,y1:o.y+s.y+s.r}}
function edShapeHandles(o){if(!o||!o.sh)return[];const r=edShapeRect(o),xm=(r.x0+r.x1)/2,ym=(r.y0+r.y1)/2;
if(o.sh.t=='c')return[['n',xm,r.y0],['e',r.x1,ym],['s',xm,r.y1],['w',r.x0,ym]];return[['nw',r.x0,r.y0],['n',xm,r.y0],['ne',r.x1,r.y0],['e',r.x1,ym],['se',r.x1,r.y1],['s',xm,r.y1],['sw',r.x0,r.y1],['w',r.x0,ym]]}
function edInShape(o,x,y){const s=o.sh;if(!s)return false;if(s.t=='c')return Math.hypot(x-(o.x+s.x),y-(o.y+s.y))<=s.r;const r=edShapeRect(o);return x>=r.x0&&x<=r.x1&&y>=r.y0&&y<=r.y1}
// the object whose shape is being edited (one selected prop or vehicle with a shape, shape editing on)
function edShapeObj(){const E=ED,s=edOne();return E.she&&s&&s.t=='o'&&s.o.sh&&!edLockIt(s)?s.o:null}
