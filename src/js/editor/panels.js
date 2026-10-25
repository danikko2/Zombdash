//# editor/panels.js — Map Workshop right panel: Properties (one or many things, or the map), Layers, Problems; and what its fields change
// ---------- the right panel ----------
let EDDIS=''; // ' disabled' while everything selected is locked
function edRight(){const E=ED;if(!E||!E.root)return;const el=E.root.querySelector('#edr'),pc=E.probs.filter(p=>p.lv!='info').length;
const tabs=[['props','Properties','The selected things, or the map when nothing is selected'],['layers','Layers','Layers: draw order, hide, lock (L)'],['probs','Problems'+(pc?' <b class=edbadge>'+pc+'</b>':''),'Problems with the map: click one to go to it']];
let h=`<div class="edtabs edtabs3">${tabs.map(t=>`<button data-a="rt:${t[0]}" class="${E.rt==t[0]?'on':''}${t[0]=='probs'&&pc?' edwarnb':''}" title="${t[2]}">${t[1]}</button>`).join('')}</div><div class=edpane>`;
h+=E.rt=='layers'?edLayersHTML():E.rt=='probs'?edProbsHTML():E.sel.length?edPropsHTML():edMapHTML();el.innerHTML=h+'</div>';
for(const c of el.querySelectorAll('input[data-mixed]'))c.indeterminate=true}
// a number field; v undefined shows "mixed" (the selected things differ)
function edPNum(lb,f,v,st,tip){return `<label class=edf${tip?` title="${edEsc(tip)}"`:''}><span>${lb}</span><input type=number data-f="${f}" value="${v==null?'':Math.round(v*10)/10}"${v==null?' placeholder="mixed"':''} step="${st||1}"${EDDIS}></label>`}
function edPChk(lb,f,v,tip,dis){return `<label class=edck${tip?` title="${edEsc(tip)}"`:''}><input type=checkbox data-f=${f}${v===true?' checked':''}${v==null?' data-mixed=1':''}${dis==null?EDDIS:dis}> ${lb}</label>`}
// the value all of them share, or undefined
function edShared(L,f){if(!L.length)return undefined;const v=L.map(f);return v.every(x=>x===v[0])?v[0]:undefined}
function edPropsHTML(){const E=ED,S=E.sel,one=S.length==1?S[0]:null,T=new Set(S.map(s=>s.t)),allLk=S.every(edLockIt);EDDIS=allLk?' disabled':'';
const nonP=S.filter(s=>s.t!='p'),O=S.filter(s=>s.t=='o'),OW=S.filter(s=>s.t=='o'||s.t=='w'),only=t=>S.every(s=>s.t==t);let h='';
// header
if(one){const it=one;if(it.t=='o'){const a=edAsset(it.o),known=it.o.dc?cmDec(it.o.dc):it.o.fx?cmFx(it.o.fx):it.o.veh?cmHW(it.o.veh):cmOB(it.o.k);h+=`<h3>${{v:'Vehicle',d:'Decal',x:'Effect'}[a.t]||'Prop'}</h3><div class=edcur><img alt="" src="${known?edThumb({id:a.t+':'+a.k,t:a.t,k:a.k}):''}"><div><b>${edEsc(a.n)}</b><small>${known?'':'⚠ missing: not shown in the game'}</small></div></div>`}
else if(it.t=='a'||it.t=='l'||it.t=='f'){const T=edKitReg(it);h+=`<h3>${{a:'Area',l:'Path',f:'Special feature'}[it.t]}</h3><div class=edcur>${T&&it.t!='f'?`<img alt="" src="${it.t=='a'?edAreaThumb(T):edPathThumb(T)}">`:''}<div><b>${edEsc(T?T.n:(it.o.a||it.o.p||it.o.f))}</b><small>${T?'':'⚠ missing: not shown in the game'}</small></div></div>`}
else h+=`<h3>${{w:'Wall',s:'Spawn point',z:'Spawn zone',p:'Player start'}[it.t]}</h3>`}
else{const c={o:0,w:0,s:0,z:0,p:0,a:0,l:0,f:0};for(const s of S)c[s.t]++;const part=[c.o&&c.o+' prop'+(c.o>1?'s':'')+'/vehicle'+(c.o>1?'s':''),c.w&&c.w+' wall'+(c.w>1?'s':''),c.a&&c.a+' area'+(c.a>1?'s':''),c.l&&c.l+' path'+(c.l>1?'s':''),c.f&&c.f+' feature'+(c.f>1?'s':''),c.s&&c.s+' spawn point'+(c.s>1?'s':''),c.z&&c.z+' zone'+(c.z>1?'s':''),c.p&&'the player start'].filter(Boolean);
h+=`<h3>${S.length} selected</h3><p class=edhint>${part.join(' · ')}. Only the values they share are filled in; a change applies to all of them.</p>`}
if(allLk)h+=`<p class=edhint>🔒 ${one?'Locked':'All locked'}${S.some(edLyLocked)?' (its layer is locked)':''}: unlock to change ${one?'it':'them'}.</p>`;
else if(S.some(edLockIt))h+=`<p class=edhint>🔒 Some are locked: changes skip them.</p>`;
// position, turn, size
h+=edPNum('X','x',edShared(S,s=>s.o.x),1,'Arrow keys nudge by 1, Shift+arrows by a grid step')+edPNum('Y','y',edShared(S,s=>s.o.y));
if(only('o'))h+=edPNum('Turn','r',edShared(S,s=>Math.round(s.o.r||0)),15,'R turns 15° clockwise, Shift+R back')+`<div class=edrow><button data-a=rot- title="Shift+R"${EDDIS}>↺ 15°</button><button data-a=rot+ title="R"${EDDIS}>↻ 15°</button><button data-a=rot0 title="Straighten"${EDDIS}>0°</button></div>`;
if(S.every(s=>s.t=='w'||s.t=='z'||s.t=='a'||s.t=='f'&&!s.o.pts))h+=edPNum('Width','w',edShared(S,s=>s.o.w))+edPNum('Height','h',edShared(S,s=>s.o.h))+(one?`<p class=edhint>Drag the yellow squares to resize.</p>`:'');
if(S.length>1&&!allLk)h+=`<div class=edrow><button data-a="turng:-1" title="Turn the whole group a quarter turn to the left around its middle">↺ group 90°</button><button data-a="turng:1" title="Turn the whole group a quarter turn to the right around its middle">↻ group 90°</button></div>`;
// layer and draw order
if(nonP.length){const ly=edShared(nonP,s=>s.o.ly),ol=E.d.layers.filter(l=>l.k=='o');h+=`<label class=edf title="Move to another layer (layer order is draw order)"><span>Layer</span><select data-f=ly${EDDIS}>${ly===undefined?'<option value="" selected>— mixed —</option>':''}${ol.map(l=>`<option value="${l.id}"${l.id===ly?' selected':''}>${edEsc(l.n)}${l.lock?' 🔒':''}${l.hid?' (hidden)':''}</option>`).join('')}</select></label>`}
const OWK=S.filter(s=>s.t=='o'||s.t=='w'||s.t=='a'||s.t=='l');if(OWK.length){h+=edPNum('Draw order','z',edShared(OWK,s=>s.o.z||0),1,'Inside its layer, higher numbers are drawn on top (floors stay under rugs, rugs under decals)')+`<div class="edrow edord"><button data-a="ord:back" title="Send to back (Ctrl+Shift+[)"${EDDIS}>⤓ Back</button><button data-a="ord:-1" title="Send backward (Ctrl+[)"${EDDIS}>−</button><button data-a="ord:1" title="Bring forward (Ctrl+])"${EDDIS}>+</button><button data-a="ord:front" title="Bring to front (Ctrl+Shift+])"${EDDIS}>⤒ Front</button></div>`}
// collision
const SOL=S.filter(s=>s.t=='o'&&!s.o.dc&&!s.o.fx||s.t=='w'||s.t=='a'&&['build','struct'].includes((cmArea(s.o.a)||{}).cat)||s.t=='l'&&(cmPath(s.o.p)||{}).fl!=null||s.t=='l'&&(cmPath(s.o.p)||{}).cat=='shape');
if(SOL.length&&SOL.length==S.filter(s=>s.t!='p').length){h+=`<h4>Collision</h4>`+edPChk('Solid','sol',edShared(SOL,s=>cmSolid(s.o,s.t)),'Solid things block players, zombies and bullets (water and see-through pieces only block walking). Off: everyone walks straight through it');
if(O.length==SOL.length&&O.every(s=>cmSolid(s.o,'o'))){const t=edShared(O,s=>s.o.sh?s.o.sh.t:'a');
h+=`<label class=edf title="Auto uses the picture's base, or the vehicle's body"><span>Shape</span><select data-f=sht${EDDIS}>${t===undefined?'<option value="" selected>— mixed —</option>':''}<option value=a${t=='a'?' selected':''}>Auto</option><option value=r${t=='r'?' selected':''}>Box</option><option value=c${t=='c'?' selected':''}>Circle</option></select></label>`;
if(one&&one.o.sh){const s=one.o.sh;h+=s.t=='r'?edPNum('Box X','shx',s.x,1,'From the object\'s position')+edPNum('Box Y','shy',s.y)+edPNum('Width','shw',s.w)+edPNum('Height','shh',s.h):edPNum('Centre X','shx',s.x,1,'From the object\'s position')+edPNum('Centre Y','shy',s.y)+edPNum('Radius','shr',s.r);
h+=`<button class="edwide${E.she?' on':''}" data-a=she title="Drag the shape and its handles on the map (Esc to finish)"${EDDIS}>${E.she?'✓ Editing the shape on the map':'✎ Edit the shape on the map'}</button>`;
if(s.t=='c')h+=`<p class=edhint>The game only has boxes, so a circle becomes a stack of thin boxes. Shift+C shows exactly what collides.</p>`}
else if(one)h+=`<p class=edhint>${one.o.veh?'Auto: the vehicle\'s whole body is solid.':cmFoot(one.o)?'Auto: the base of the picture is solid.':'Auto: a strip along the bottom of the picture is solid.'} Pick Box or Circle to draw your own shape.</p>`}}
// kind-specific settings
const V=O.filter(s=>s.o.veh),CO=O.filter(s=>edPalOf(s.o));if(CO.length&&CO.length==S.length){const c=edShared(CO,s=>edColOf(s.o)),P=edPalOf(CO[0].o);
h+=`<h4>Colour</h4><div class=edcols>${P.map(([x,n])=>`<button data-a="ocol:${x}" class="${c===x?'on':''}" style="--c:${x}" title="${edEsc(n)}"${EDDIS}></button>`).join('')}</div><label class=edf title="Pick any colour"><span>Custom</span><input type=color data-f=ocol value="${c&&/^#[0-9a-f]{6}$/i.test(c)?c:P[0][0]}"${EDDIS}></label>${c===undefined?'<p class=edhint>Mixed colours: a pick colours all of them.</p>':''}`}
if(V.length&&V.length==S.length&&V.every(s=>EDSTRIPE.includes(s.o.veh))){const c2=edShared(V,s=>s.o.c2||'');h+=`<h4>Stripe</h4><div class=edcols><button data-a="ost:" class="${c2===''?'on':''}" style="--c:#555" title="Auto (picked from its place)"${EDDIS}>A</button>${PVSTRIPE.map(([x,n])=>`<button data-a="ost:${x}" class="${c2===x?'on':''}" style="--c:${x}" title="${edEsc(n)}"${EDDIS}></button>`).join('')}</div>`}
if(V.length&&V.length==S.length)h+=edPChk('Damaged','dmg',edShared(V,s=>!!s.o.dmg))+edPChk('Burnt out','burn',edShared(V,s=>!!s.o.burn));
if(only('w')){const st=edShared(S,s=>s.o.s);h+=`<label class=edf><span>Style</span><select data-f=s${EDDIS}>${st===undefined?'<option value="" selected>— mixed —</option>':''}${CMWALL.map(w=>`<option value="${w.id}"${st===w.id?' selected':''}>${edEsc(w.n)}</option>`).join('')}${st&&!CMWI[st]?`<option selected>${edEsc(st)} (missing)</option>`:''}</select></label>`}
if(S.every(s=>s.t=='s'||s.t=='z'))h+=edPChk('On','on',edShared(S,s=>s.o.on!==false),'Turned-off spawns stay on the map, but no zombies come out of them');
if(one&&one.t=='z')h+=`<p class=edhint>Each zombie picks a random free spot inside the zone.</p>`;if(one&&one.t=='p')h+=`<p class=edhint>Split-screen players start right next to this spot. Delete removes it (the run then starts in the middle of the map).</p>`;
h+=edKitPropsHTML(S);
// lock and hide
if(nonP.length)h+=`<h4>Editing</h4>`+edPChk('Locked','lk',edShared(nonP,s=>!!s.o.lk),'A locked thing can\'t be moved or changed. It can still be clicked, to unlock it','')+edPChk('Hidden (editor only)','hd',edShared(nonP,s=>!!s.o.hd),'Only hides it here: it is still in the game. The Layers panel can show hidden things again');
h+=`<div class=edrow>${nonP.length?`<button data-a=dup title="Duplicate (Ctrl+D)">Duplicate</button><button data-a=copy title="Copy (Ctrl+C), then paste at the mouse with Ctrl+V">Copy</button>`:''}<button class=red data-a=del title="Delete (Del)"${allLk?' disabled':''}>Delete</button></div>${nonP.length?`<div class=edrow><button data-a=pfsave title="Save what is selected as a prefab you can place again">Save as prefab…</button></div>`:''}`;return h}
// nothing selected: the map's own settings
function edMapHTML(){const E=ED,d=E.d,T=d.tile,pc=E.probs.filter(p=>p.lv!='info').length;EDDIS='';
return `<h3>Map</h3><label class=edf><span>Name</span><input data-f=name maxlength=40 value="${edEsc(d.name)}"></label><label class=edf><span>About</span><textarea data-f=desc maxlength=240 rows=3>${edEsc(d.desc)}</textarea></label>
<h4>Size (tiles of ${T}px)</h4><div class=edrow><input type=number data-f=nw min=${CMMIN[0]} max=${CMMAX} value="${d.w}" aria-label="Width in tiles"><span>×</span><input type=number data-f=nh min=${CMMIN[1]} max=${CMMAX} value="${d.h}" aria-label="Height in tiles"><button data-a=resize title="Change the map size">Apply</button></div><p class=edhint>${d.w*T}×${d.h*T} px. Resizing keeps the top-left corner in place.</p>
<label class=edf><span>Default ground</span><select data-f=ground>${CMTER.map(t=>`<option value="${t.id}"${d.ground==t.id?' selected':''}>${edEsc(t.n)}</option>`).join('')}${CMTI[d.ground]?'':`<option selected>${edEsc(d.ground)} (missing)</option>`}</select></label>
${edLtHTML()}
<p class=edhint>${d.obj.filter(o=>!o.dc&&!o.fx).length} props & vehicles · ${d.obj.filter(o=>o.dc).length} decals · ${d.obj.filter(o=>o.fx).length} effects · ${d.walls.length} walls · ${d.areas.length} areas · ${d.paths.length} paths · ${d.feats.length} special features · ${d.spawns.length} spawn points · ${d.zones.length} zones${d.start?'':' · no player start'}</p>
<div class=edrow><button data-a=savecopy title="Save a copy and keep editing the copy">Save as copy</button><button data-a=export title="Download this map as a JSON file">Export JSON</button></div>
<p class=edhint>${pc?`<button class=lnk data-a="rt:probs">⚠ ${pc} problem${pc>1?'s':''}: see the Problems tab</button>`:'✓ No problems found.'}</p>
<p class=edhint>Click to select, Shift+click to add, drag a box around things to select several. Ctrl+C / Ctrl+V / Ctrl+D copy, paste at the mouse and duplicate.</p>`}
// ----- layers -----
function edLayersHTML(){const E=ED,d=E.d,a=E.al&&cmLy(d,E.al),L=d.layers.slice().reverse(),sn=E.sel.filter(s=>s.t!='p').length;EDDIS='';
let h=`<p class=edhint>Top of the list is drawn on top, in the editor and in the game. Hiding and locking only affect the editor.</p><div class=edlys>`;
h+=`<div class="edly${!a||a.k=='t'?' on':''}"><button class=edlyn data-a="lysel:" title="New things go on the layer for their kind">⟳ Auto <small>each kind on its own layer</small></button></div>`;
for(const l of L){const n=l.k=='o'?edLyCount(l.id):0,pt=l.k=='t'&&(l.id=='roads')==(E.pt=='r');
h+=`<div class="edly${a&&a.id===l.id?' on':''}${l.hid?' hid':''}"><button class=edlyb data-a="lyvis:${l.id}" title="${l.hid?'Show':'Hide'} in the editor (the game still has it)">${l.hid?'◌':'👁'}</button><button class=edlyb data-a="lylock:${l.id}" title="${l.lock?'Unlock':'Lock'}: a locked layer can't be edited">${l.lock?'🔒':'🔓'}</button>`+
`<button class=edlyn data-a="lysel:${l.id}" title="${l.k=='t'?'Paint on this layer':'Put new things on this layer'}">${edEsc(l.n)} <small>${l.k=='t'?(l.id=='terrain'?'ground, blood, burns':'tiles over the ground')+(pt?' · painting here':''):n+' thing'+(n==1?'':'s')}</small></button></div>`}
h+=`</div><div class=edrow><button data-a=lyadd title="Add a layer above the picked one">+ Add layer</button>${a&&a.k=='o'&&sn?`<button data-a=lymovesel title="Move the selected things to this layer">Move ${sn} here</button>`:''}</div>`;
if(a){const hidN=d.obj.concat(d.walls,d.spawns,d.zones,d.areas,d.paths,d.feats).filter(o=>o.ly===a.id&&o.hd).length;
h+=`<h4>Layer “${edEsc(a.n)}”</h4><label class=edf><span>Name</span><input data-f=lyname maxlength=32 value="${edEsc(a.n)}"></label>`;
if(a.k=='o')h+=`<div class=edrow><button data-a=lyup title="Move up: drawn later, on top">▲ Up</button><button data-a=lydown title="Move down: drawn earlier, below">▼ Down</button><button class=red data-a=lydel title="Delete this layer (asks what to do with what is on it)">Delete</button></div>`;
else h+=`<p class=edhint>${a.id=='terrain'?'The ground under everything, with blood and burn overlays.':'Road tiles painted over the ground: erasing them shows the ground again.'} Tile layers stay at the bottom.</p>`;
if(hidN)h+=`<p class=edhint>${hidN} hidden thing${hidN>1?'s':''} here. <button class=lnk data-a=lyunhide>show them</button></p>`;
h+=`<p class=edhint>New things go on ${a.k=='o'?'this layer':'their own kind\'s layer (Auto)'}.</p>`}
else h+=`<p class=edhint>New props go on Buildings, Environmental props, Interior props or Vehicles depending on what they are; walls on Walls & collision; spawns on Zombie spawns. Pick a layer to put everything new on it instead.</p>`;
return h}
function edLyUnhide(){const E=ED,a=E.al&&cmLy(E.d,E.al);if(!a)return;const d=E.d,L=d.obj.concat(d.walls,d.spawns,d.zones,d.areas,d.paths,d.feats).filter(o=>o.ly===a.id&&o.hd);if(L.length)edMut('Show hidden things',L,()=>{for(const o of L)delete o.hd})}
// ----- problems -----
function edProbsHTML(){const E=ED;EDDIS='';const P_=E.probs;
return `<div class=edrow><b class=edval style="text-align:left;flex:1">${P_.filter(p=>p.lv!='info').length?P_.filter(p=>p.lv!='info').length+' to fix':'All clear'}</b><button class=edmini data-a=check title="Check the map again">check again</button></div>
<div class=edprobs>${P_.length?P_.map((p,i)=>`<button data-a="prob:${i}" class="edp ${p.lv}"${p.x==null?' disabled':''} title="${p.x==null?'':'Go to it'}"><b>${p.lv=='err'?'✖':p.lv=='warn'?'⚠':'ℹ'}</b><span>${edEsc(p.m)}</span></button>`).join(''):'<p class=edhint>✓ No problems found.</p>'}</div>
<p class=edhint>Checked: the player start, spawns inside walls or that zombies can't walk to the player from, things outside the map, missing props, vehicles, terrain or kit pieces, and special features that can't work.</p>`}
// jump to a problem: centre on it and select the thing it is about
function edGoProb(i){const E=ED,p=E.probs[i];if(!p||p.x==null)return;if(E.cam.z<.5)E.cam.z=1;edCenter(p.x,p.y);const r=p.ref;
if(r&&(r.t=='p'?E.d.start===r.o:(edArr(r.t)||[]).includes(r.o))){if(!edVisIt(r)){const l=edLyIt(r);edToast(r.o.hd?'It is hidden: the Layers panel can show it':'It is on the hidden layer “'+(l?l.n:'?')+'”');return}
if(edLyLocked(r)){edToast('It is on the locked layer “'+edLyIt(r).n+'”');return}E.rt='props';if(E.tool!='select')edTool('select');edSelect([{t:r.t,o:r.o}])}edToast(p.m.slice(0,90))}
// ----- fields in the right panel -----
function edPropChange(f,t){if(edKitPropChange(f,t))return;const E=ED,S=E.sel,free=edFree(),num=+t.value,ok=isFinite(num)&&t.value!=='',O=free.filter(s=>s.t=='o'),one=edOne();
const need=L=>{if(!L.length){edRight();return 0}return 1};
switch(f){
case 'x':case 'y':if(!ok||!need(free))return edRight();return edMut(edNameOf(free,'Move'),free.map(s=>s.o),()=>{for(const s of free)s.o[f]=cmR1(num)});
case 'r':{if(!ok||!need(O))return edRight();const v=((Math.round(num)%360)+360)%360;return edMut(edNameOf(O,'Turn'),O.map(s=>s.o),()=>{for(const s of O){const o=s.o,dl=v-(o.r||0);o.r=v;if(o.sh)o.sh=cmTurnShape(o.sh,dl)}})}
case 'w':case 'h':{const L=free.filter(s=>s.t=='w'||s.t=='z'||s.t=='a'||s.t=='f'&&!s.o.pts);if(!ok||!need(L))return edRight();return edMut(edNameOf(L,'Resize'),L.map(s=>s.o),()=>{for(const s of L)s.o[f]=Math.max(s.t=='z'||s.t=='f'?16:s.t=='a'?((cmArea(s.o.a)||{min:[8,8]}).min[f=='w'?0:1]||8):2,cmR1(num))})}
case 'ly':if(t.value)edLyMoveSel(t.value);else edRight();return;
case 'z':{const L=free.filter(s=>s.t=='o'||s.t=='w'||s.t=='a'||s.t=='l');if(!ok||!need(L))return edRight();return edMut('Change draw order',L.map(s=>s.o),()=>{for(const s of L){const v=Math.round(num);if(v)s.o.z=v;else delete s.o.z}})}
case 'sol':return edSetSolid(S,t.checked);
case 'sht':if(t.value)edSetShape(S,t.value);else edRight();return;
case 'shx':case 'shy':case 'shw':case 'shh':case 'shr':{if(!one||!one.o.sh||edLockIt(one)||!ok)return edRight();const o=one.o,k={shx:'x',shy:'y',shw:'w',shh:'h',shr:'r'}[f];return edMut('Change collision shape',[o],()=>{o.sh[k]=k=='x'||k=='y'?cmR1(num):Math.max(4,cmR1(num))})}
case 'lk':return edSetFlag(S,'lk',t.checked,t.checked?'Lock':'Unlock');
case 'hd':return edSetFlag(S,'hd',t.checked,t.checked?'Hide in the editor':'Show in the editor');
case 'on':{const L=free.filter(s=>s.t=='s'||s.t=='z');if(!need(L))return;return edMut(t.checked?'Turn spawn on':'Turn spawn off',L.map(s=>s.o),()=>{for(const s of L)s.o.on=t.checked})}
case 's':{const L=free.filter(s=>s.t=='w');if(!t.value||!need(L))return;return edMut('Change wall style',L.map(s=>s.o),()=>{for(const s of L)s.o.s=t.value})}
case 'dmg':case 'burn':{const L=O.filter(s=>s.o.veh);if(!need(L))return;return edMut('Change vehicle',L.map(s=>s.o),()=>{for(const s of L){if(t.checked)s.o[f]=1;else delete s.o[f]}})}
case 'ocol':{const v=String(t.value).toLowerCase();if(/^#[0-9a-f]{6}$/.test(v))edSetCol(free,v);else edRight();return}
case 'lyname':return edLyRename(E.al,t.value)}}
// vehicles with a stripe colour (color2): trailers and semis
const EDSTRIPE=['trailer','semi'],PVSTRIPE=[['#c0392b','Red'],['#2f6fd0','Blue'],['#2f8a4a','Green'],['#d68a1c','Orange'],['#6a4a9a','Purple'],['#26262c','Black']];
// colour every selected thing that takes a colour (one undo step)
function edSetCol(free,c){const L=free.filter(s=>s.t=='o'&&edPalOf(s.o));if(L.length)edMut('Change colour',L.map(s=>s.o),()=>{for(const s of L)s.o.c=c})}
// buttons in the right panel (edClick hands the ones it doesn't know to this); returns 1 when handled
function edPanelClick(a){const E=ED,free=edFree();
if(a.startsWith('rt:')){E.rt=a.slice(3);if(E.rt=='probs')E.probs=cmLint(E.d);edRight();return 1}
if(a.startsWith('lyvis:')){edLyVis(a.slice(6));return 1}if(a.startsWith('lylock:')){edLyLock(a.slice(7));return 1}
if(a.startsWith('lysel:')){const id=a.slice(6),l=id&&cmLy(E.d,id);E.al=id;if(l&&l.k=='t'){E.pt=l.id=='roads'?'r':'t';if(E.terK=='o'&&E.pt=='r')E.terK='t';if(!['brush','erase','fill','rect','pick'].includes(E.tool))edTool('brush');else edUI()}else edUI();return 1}
if(a.startsWith('ord:')){const v=a.slice(4);edOrder(v=='front'||v=='back'?v:+v);return 1}
if(a.startsWith('turng:')){edTurnGroup(+a.slice(6));return 1}
if(a.startsWith('prob:')){edGoProb(+a.slice(5));return 1}
if(a.startsWith('ocol:')){edSetCol(free,a.slice(5));return 1}if(a.startsWith('ost:')){const c=a.slice(4),L=free.filter(s=>s.o.veh&&EDSTRIPE.includes(s.o.veh));if(L.length)edMut('Change stripe',L.map(s=>s.o),()=>{for(const s of L){if(c)s.o.c2=c;else delete s.o.c2}});return 1}if(a.startsWith('kc:')){edKitSetCol('c',a.slice(3));return 1}if(a.startsWith('kc2:')){edKitSetCol('c2',a.slice(4));return 1}if(a=='graphbuild'){edGraphBuild();return 1}if(a=='pfsave'){edPfAsk();return 1}
switch(a){case 'lyadd':edLyAdd();return 1;case 'lyup':if(E.al)edLyMove(E.al,1);return 1;case 'lydown':if(E.al)edLyMove(E.al,-1);return 1;case 'lydel':if(E.al)edLyDel(E.al);return 1;
case 'lymovesel':if(E.al)edLyMoveSel(E.al);return 1;case 'lyunhide':edLyUnhide();return 1;
case 'she':E.she=E.she?0:1;E.need=1;edRight();if(E.she)edToast('Drag the shape or its handles; Esc when done');return 1;
case 'dup':edDup();return 1;case 'copy':edCopy();return 1;
case 'rot0':{const L=free.filter(s=>s.t=='o');if(L.length)edMut(edNameOf(L,'Straighten'),L.map(s=>s.o),()=>{for(const s of L){const o=s.o;if(o.sh)o.sh=cmTurnShape(o.sh,-(o.r||0));o.r=0}});return 1}}
return 0}
