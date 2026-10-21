// Map Workshop: the custom map format, the loader, the editor's tools and history, saving, playtest and Free Play.
// Runs the real game in Node with a fake browser (no IndexedDB here, so maps are kept in memory, as on browsers without it).
const fs=require('fs');const html=fs.readFileSync(process.argv[2],'utf8');
const code=html.slice(html.lastIndexOf('<script>')+8,html.lastIndexOf('</script>'));
global.ImageData=class{constructor(d,w,h){this.data=d}};
const ctx=new Proxy({},{get:(t,k)=>k=='getImageData'?(x,y,w,h)=>({data:new Uint8ClampedArray(w*h*4).fill(120)}):k=='createImageData'?(w,h)=>({data:new Uint8ClampedArray(w*h*4)}):k=='measureText'?()=>({width:30}):()=>{},set:()=>true});
const mkEl=()=>({style:{setProperty(){}},dataset:{},innerHTML:'',className:'',classList:{add(){},remove(){},toggle(){},contains(){return false}},getContext:()=>ctx,addEventListener(){},remove(){},querySelector(){return null},querySelectorAll(){return[]},width:0,height:0});
const els={};const docL={};global.document={hidden:false,getElementById:id=>els[id]||(els[id]=mkEl()),createElement:()=>mkEl(),addEventListener(e,f){(docL[e]=docL[e]||[]).push(f)},body:mkEl()};
global.innerWidth=1280;global.innerHeight=800;global.addEventListener=()=>{};global.localStorage={};global.requestAnimationFrame=()=>{};
global.Image=class{constructor(){this.complete=true;this.naturalWidth=1}addEventListener(){}};global.NOW_=0;global.performance={now:()=>global.NOW_};
const P_=()=>({value:0,setValueAtTime(){},linearRampToValueAtTime(){},exponentialRampToValueAtTime(){},setTargetAtTime(){}});
const node=()=>({connect(){},disconnect(){},start(){},stop(){},frequency:P_(),gain:P_(),detune:P_(),Q:P_(),pan:P_(),threshold:P_(),ratio:P_(),type:'',setPeriodicWave(){},buffer:null,loop:false});
global.AT_=0;global.AudioContext=class{constructor(){this.state='running';this.sampleRate=8000;this.destination={}}get currentTime(){return global.AT_}createGain(){return node()}createOscillator(){return node()}createBiquadFilter(){return node()}createBufferSource(){return node()}createStereoPanner(){return node()}createDynamicsCompressor(){return node()}createPeriodicWave(){return{}}createBuffer(c,n){return{getChannelData:()=>new Float32Array(n)}}resume(){}};
const ivs=[];global.setInterval=f=>{ivs.push(f)};global.TQ=[];global.setTimeout=(f,ms)=>{TQ.push([global.AT_+(ms||0)/1000,f]);return TQ.length};global.clearTimeout=()=>{};
const test=`;S.ac.name='Tester';S.ac.cp=8;
docL.pointerdown[0]();endIntro();
const tick=n=>{for(let i=0;i<n;i++){AT_+=.016;NOW_+=16;for(const f of ivs)f();for(let q=TQ.length-1;q>=0;q--)if(TQ[q][0]<=AT_){const g=TQ[q][1];TQ.splice(q,1);g()}loop(NOW_)}};
const flush=()=>{AT_+=10;for(let q=TQ.length-1;q>=0;q--){const g=TQ[q][1];TQ.splice(q,1);try{g()}catch(e){}}};
let fails=0,n=0;const ok=(c,m)=>{n++;if(c)console.log('PASS '+m);else{fails++;console.log('FAIL '+m)}};
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const ter=d=>Array.from(d.ter).join(''),ovl=d=>Array.from(d.ovl).join('');
// ---------- the map format ----------
const d0=cmNew({name:'Round <b>Trip</b>',desc:'desc',w:30,h:22,ground:'dirt'});
ok(d0.w==30&&d0.h==22&&d0.ground=='dirt'&&d0.name=='Round bTrip/b','new map: size, ground, name without markup');
for(let i=0;i<d0.ter.length;i++){if(i%7==0)d0.ter[i]=cmPi(d0,'water');if(i%11==0)d0.ter[i]=cmPi(d0,'asphalt');if(i%13==0)d0.ovl[i]=cmOi(d0,'blood')}
d0.obj.push({id:'p1',k:'crate',x:100,y:120,r:0,vr:.4},{id:'v1',veh:'police',x:300,y:200,r:90,c:'#2f6fd0',dmg:1},{id:'p2',k:'barrel',x:150,y:330,r:45});
d0.walls.push({id:'w1',x:10,y:10,w:200,h:8,s:'brick'},{id:'w2',x:400,y:40,w:4,h:200,s:'fence'});d0.spawns.push({id:'s1',x:50,y:600,on:true},{id:'s2',x:60,y:610,on:false});d0.zones.push({id:'z1',x:700,y:500,w:160,h:120,on:true});d0.start={x:480,y:352};
const j0=cmWrite(d0),r0=cmRead(JSON.stringify(j0));
ok(r0.doc&&!r0.errors.length&&!r0.warnings.length,'write then read: no errors or warnings ('+r0.errors.concat(r0.warnings).join('; ')+')');
const d1=r0.doc;ok(d1&&same([d1.w,d1.h,d1.ground,d1.name,d1.desc,d1.start],[d0.w,d0.h,d0.ground,d0.name,d0.desc,d0.start]),'round trip keeps size, ground, name, start');
ok(d1&&d1.pal.length&&Array.from(d1.ter).every((v,i)=>d1.pal[v]===d0.pal[d0.ter[i]]),'round trip keeps every terrain tile');
ok(d1&&Array.from(d1.ovl).every((v,i)=>d1.opal[v]===d0.opal[d0.ovl[i]]),'round trip keeps every overlay tile');
ok(d1&&same(d1.obj,d0.obj)&&same(d1.walls,d0.walls)&&same(d1.spawns,d0.spawns)&&same(d1.zones,d0.zones),'round trip keeps props, vehicles, walls, spawn points and zones (with ids and order)');
ok(j0.format=='zombdash-map'&&j0.version==CMVER&&j0.terrain.rows.length==22&&j0.terrain.rows[0].length==30&&j0.terrain.legend.d=='dirt'&&j0.overlay.legend.b=='blood','file layout: format, version, rows of characters with a legend');
ok(same(cmWrite(d1),j0),'writing it again gives the same file');
// errors: the file is refused and nothing comes back
const bad=t=>{const r=cmRead(t);return !r.doc&&r.errors.length?r.errors[0]:''};
ok(bad('{nope')&&bad('[]')&&bad(JSON.stringify({format:'other'})),'not JSON / not a map: refused');
ok(/newer version/.test(bad(JSON.stringify(Object.assign({},j0,{version:CMVER+1})))),'a map from a newer game version: refused with a clear message');
ok(bad(JSON.stringify(Object.assign({},j0,{width:5}))),'too small: refused');ok(bad(JSON.stringify(Object.assign({},j0,{width:999}))),'too big: refused');
{const j=JSON.parse(JSON.stringify(j0));j.terrain.rows[3]=j.terrain.rows[3].slice(1);ok(/rows\\[3\\]/.test(bad(JSON.stringify(j))),'a short terrain row: refused, naming the row')}
{const j=JSON.parse(JSON.stringify(j0));j.terrain.rows[2]='Q'+j.terrain.rows[2].slice(1);ok(/not in the legend/.test(bad(JSON.stringify(j))),'a character missing from the legend: refused')}
{const j=JSON.parse(JSON.stringify(j0));j.props.push({kind:'crate',x:'a'});ok(/props\\[2\\]/.test(bad(JSON.stringify(j))),'a broken prop entry: refused, naming it')}
// warnings: loads, keeps what it doesn't know
{const j=JSON.parse(JSON.stringify(j0));j.props.push({id:'zz',kind:'flying_saucer',x:10,y:10});j.terrain.legend.d='lava';j.walls[0].style='glass';j.mod={keep:1};
const r=cmRead(JSON.stringify(j));ok(r.doc&&r.warnings.length>=3,'unknown prop, terrain and wall style: loads with warnings ('+r.warnings.length+')');
const w=cmWrite(r.doc);ok(w.props.some(p=>p.kind=='flying_saucer')&&Object.values(w.terrain.legend).includes('lava')&&w.walls[0].style=='glass'&&w.mod&&w.mod.keep==1,'and writes them back unchanged (nothing is thrown away)');
ok(cmLint(r.doc).some(p=>/flying_saucer/.test(p.m)),'the Problems list names the unknown prop')}
// names that are built into every JavaScript object are not props, terrain or walls
{const j=JSON.parse(JSON.stringify(j0));j.props.push({kind:'constructor',x:20,y:20},{kind:'__proto__',x:30,y:30},{kind:'toString',x:40,y:40});j.vehicles.push({kind:'hasOwnProperty',x:50,y:50});j.terrain.legend.d='toString';j.walls[0].style='valueOf';
const r=cmRead(JSON.stringify(j));ok(r.doc&&r.warnings.length>=4,'odd names like "constructor" load as unknown, with warnings');
let crash='';try{CMPTD=r.doc;mapId=CMPTK;build();cmLint(r.doc);edMakeThumb(r.doc);cmWrite(r.doc)}catch(e){crash=e.message}ok(!crash,'and nothing crashes: build, problems, thumbnail, write '+crash);CMPTD=null}
// ---------- the loader (what Free Play and playtest use) ----------
CMPTD=d1;mapId=CMPTK;build();
ok(WW==960&&WH==704&&HS.CM==d1.id,'build(): a custom map sets the world size');
ok(WL.some(w=>w[0]==10&&w[1]==10&&w[2]==200&&w[4]==0)&&WL.some(w=>w[0]==400&&w[4]==2),'walls become collision: brick stops bullets (flag 0), fence is see-through (flag 2)');
ok(WL.filter(w=>w[4]==2).length>1,'water tiles block walking (see-through blockers)');
{const c=OB.crate.c;ok(WL.some(w=>w[0]==100-c[0]/2&&w[1]==120-c[1]&&w[2]==c[0]&&w[3]==c[1]&&w[4]==1),'a solid prop adds its own collision box')}
{const keep=WL;WL=[];hwCol({k:'police',x:300,y:200,a:Math.PI/2,L:HWV('police')[0],W:HWV('police')[1]});const v=WL;WL=keep;ok(v.every(a=>WL.some(b=>same(a,b))),'vehicles collide like the highway cars (hwCol)')}
ok(HS.px==480&&HS.py==352&&same(HS.CZ,{p:[[50,600]],z:[[700,500,160,120]]}),'player start, and only the spawns that are on');
ok(bl[Math.floor(14/gs)*gw+Math.floor(100/gs)]==1,'the zombie path grid sees the walls');
{let inZ=0,nearP=0;for(let i=0;i<200;i++){P={x:480,y:352};const q=cmSpawnAt(9999);if(q[0]>=700&&q[0]<=860&&q[1]>=500&&q[1]<=620)inZ++;else if(Math.hypot(q[0]-50,q[1]-600)<=21)nearP++}ok(inZ>0&&nearP>0&&inZ+nearP==200,'spawning: every zombie comes from a spawn point or inside a zone ('+inZ+' zone, '+nearP+' point)')}
// ---------- the editor (no page here, so it runs headless) ----------
const d2=cmNew({name:'Editor test',w:40,h:30});edOpen(d2,'saved');
ok(mode=='edit'&&ED&&ED.d===d2&&!edIsDirty(),'edOpen: edit mode, clean');
const T0=ter(d2);ED.terK='t';ED.ter='asphalt';ED.brush=3;
{const S_=edStroke('Paint');edBrushAt(S_,5,5,3,0);edLineAt(S_,5,5,15,5,3,0);edStrokeEnd(S_)}
ok(d2.ter[5*40+10]===d2.pal.indexOf('asphalt')&&d2.ter[4*40+15]===d2.pal.indexOf('asphalt')&&d2.ter[8*40+10]===0,'brush: a 3-wide line of asphalt');
ok(edIsDirty()&&EDH.u.length==1,'painting is one history step and makes the map unsaved');
const T1=ter(d2);edUndo();ok(ter(d2)===T0&&!edIsDirty(),'undo restores every tile and the map is clean again');edRedo();ok(ter(d2)===T1,'redo paints it again');
ED.ter='water';edFill(30,25,0);ok(d2.ter[25*40+30]===d2.pal.indexOf('water')&&d2.ter[5*40+10]===d2.pal.indexOf('asphalt')&&d2.ter[0]===d2.pal.indexOf('water'),'fill: floods the connected grass, stops at the road');
edUndo();ok(ter(d2)===T1,'undo fill');
ED.terK='o';ED.ter='blood';{const S_=edStroke('Blood');edBrushAt(S_,2,2,1,0);edStrokeEnd(S_)}ok(d2.opal[d2.ovl[2*40+2]]=='blood','overlay brush');
{const S_=edStroke('Erase');edBrushAt(S_,2,2,1,1);edStrokeEnd(S_)}ok(d2.ovl[2*40+2]===0,'eraser with an overlay picked removes the overlay');
ED.terK='t';ED.ter='sand';{const S_=edStroke('Erase');edBrushAt(S_,10,5,1,1);edStrokeEnd(S_)}ok(d2.pal[d2.ter[5*40+10]]=='grass','eraser puts back the default ground');
edPick(12,5,0);ok(ED.terK=='t'&&ED.ter=='asphalt'&&ED.tool=='brush','eyedropper picks the ground and goes back to painting');
// props, vehicles, rotation, moving, deleting
const nObj=d2.obj.length;ED.asset=edAssets().find(a=>a.id=='p:crate');ED.rot=0;
edAdd(d2.obj,{id:cmUid('p'),k:'crate',x:320,y:320,r:0,vr:.5},'Place Crate');edAdd(d2.obj,{id:cmUid('v'),veh:'sedan',x:500,y:500,r:0,c:'#c0392b'},'Place Sedan');
ok(d2.obj.length==nObj+2,'place a prop and a vehicle');
ED.sel={t:'o',o:d2.obj[d2.obj.length-1]};edRotate(15);edRotate(15);ok(d2.obj[d2.obj.length-1].r==30,'R turns the selection 15° a time');edUndo();ok(d2.obj[d2.obj.length-1].r==15,'undo a turn');
ED.sel={t:'o',o:d2.obj[0]};edSet(d2.obj[0],{x:333,y:300},'Move');ok(d2.obj[0].x==333,'move with the inspector');
const crate=d2.obj[0];edDelete();ok(!d2.obj.includes(crate)&&!ED.sel,'delete the selection');edUndo();ok(d2.obj[0]===crate,'undo delete puts the same prop back in its place');
ok(edAssets().filter(a=>a.t=='p').length==Object.keys(OB).length&&edAssets().filter(a=>a.t=='v').every(a=>HWV(a.k)),'the asset browser lists every real prop (OB) and only real vehicles (HWV)');
ok(edAssets().every(a=>EDCAT.some(c=>c[0]==a.cat)),'every asset has a category');
{const o={k:'shed',x:600,y:400};ok(edOnObj(o,600,380,0)&&!edOnObj(o,900,380,0),'picking: a click on a prop hits it, a click beside it does not')}
// walls: draw, cut a doorway, undo
edAdd(d2.walls,{id:'wa',x:100,y:100,w:300,h:8,s:'wall'},'Draw wall');ED.wth=8;
ok(same(edWallBox(0,0,200,5),{x:0,y:-4,w:200,h:8})&&same(edWallBox(0,0,4,150),{x:-4,y:0,w:8,h:150})&&same(edWallBox(0,0,100,80),{x:0,y:0,w:100,h:80}),'wall drags: lines become walls of the chosen thickness, boxes stay boxes');
const W0=JSON.stringify(d2.walls);edCut({x:200,y:90,w:40,h:30});
ok(d2.walls.length==2&&d2.walls.some(w=>w.x==100&&w.w==100)&&d2.walls.some(w=>w.x==240&&w.w==160),'right-drag cuts a doorway: the wall splits in two');
edUndo();ok(JSON.stringify(d2.walls)===W0,'undo the cut');
// spawns
edAdd(d2.spawns,{id:'sp',x:40,y:40,on:true},'Add spawn point');edAdd(d2.zones,{id:'zn',x:900,y:700,w:200,h:150,on:true},'Add spawn zone');ED.sel={t:'s',o:d2.spawns[0]};edSet(d2.spawns[0],{on:false},'off');ok(d2.spawns[0].on===false,'turn a spawn point off');
edSet(d2.start,{x:600,y:500},'Move player start');ok(d2.start.x==600,'move the player start');
// problems
d2.walls.push({id:'box',x:560,y:460,w:80,h:80,s:'wall'});ok(cmLint(d2).some(p=>p.lv=='err'&&/player start/.test(p.m)),'Problems: the player start inside a wall');d2.walls.pop();
{d2.walls.push({id:'b1',x:880,y:680,w:240,h:8,s:'wall'},{id:'b2',x:880,y:858,w:240,h:8,s:'wall'},{id:'b3',x:880,y:680,w:8,h:186,s:'wall'},{id:'b4',x:1112,y:680,w:8,h:186,s:'wall'});ok(cmLint(d2).some(p=>/can't reach/.test(p.m)),'Problems: a walled-in spawn zone can\\'t reach the player');d2.walls.splice(-4,4)}
// resize: smaller removes what's outside (after asking), undo brings it all back
const before=JSON.stringify(cmWrite(d2));d2.obj.push({id:'far',k:'rock',x:1200,y:900,r:0});
edResize(30,20);ok(d2.w==30&&d2.h==20&&d2.ter.length==600&&!d2.obj.some(o=>o.id=='far')&&!d2.zones.length,'resize smaller: tiles and things outside are removed');
edUndo();ok(d2.w==40&&d2.h==30&&d2.obj.some(o=>o.id=='far')&&d2.zones.length==1,'undo resize brings everything back');d2.obj.pop();ok(JSON.stringify(cmWrite(d2))===before,'and the map is exactly as before');
edResize(50,35);ok(d2.w==50&&d2.ter[34*50+49]===d2.pal.indexOf(d2.ground)&&d2.ter[5*50+12]===d2.pal.indexOf('asphalt'),'resize bigger: new ground is the default, old tiles stay put');
// keys go to the editor, not the game
keys={};edKey({key:'w',target:{tagName:'CANVAS'}});ok(ED.tool=='wall'&&!keys.w,'keys: W picks the wall tool (and does not move a player)');
edKey({key:'Escape',target:{}});ok(ED.tool=='select','Esc goes back to Select');
edKey({key:'z',ctrlKey:true,target:{}});ok(d2.w==40,'Ctrl+Z undoes');edKey({key:'y',ctrlKey:true,target:{}});ok(d2.w==50,'Ctrl+Y redoes');
edKey({key:'b',target:{tagName:'INPUT'}});ok(ED.tool=='select','typing in a text box does not switch tools');
// ---------- saving, the Workshop list, export / import ----------
let saved=await edSave();ok(msMem(),'no IndexedDB in this test: maps are kept in memory');ok(saved&&!edIsDirty()&&ED.src=='saved','Save: stored, map clean');
await cmLoadAll();const e2=CML.find(e=>e.id==d2.id);ok(e2&&e2.doc&&e2.meta.name=='Editor test'&&e2.doc.w==50,'the saved map is in the list');
const stored=await msGet('maps',d2.id);ok(same(stored.json,cmWrite(d2)),'what is stored is exactly the export file');
// a draft is kept while there are unsaved changes, and dropped by a save
ED.terK='t';ED.ter='mud';{const S_=edStroke('Paint');edBrushAt(S_,1,1,1,0);edStrokeEnd(S_)}flush();await edDraft();
const dr=await msGet('kv','draft');ok(dr&&dr.id==d2.id&&cmRead(dr.json).doc.pal.includes('mud'),'unsaved changes are kept in a crash-safe draft');
// save as copy
await edSave(1);ok(ED.d.id!==d2.id&&/\\(copy\\)/.test(ED.d.name)&&!edIsDirty(),'Save as copy: a new map, now the one being edited');
ok(!(await msGet('kv','draft')),'saving clears the draft');
await cmLoadAll();ok(CML.length==2,'two maps in the list');
// import: a good file is added as its own map, a broken one changes nothing
let im=await wsImportText(JSON.stringify(j0));ok(im&&CML.some(e=>e.doc&&e.doc.name=='Round bTrip/b'),'import a map file');
const nb=CML.length;im=await wsImportText('{"format":"zombdash-map","version":1,"width":3}');ok(!im&&CML.length==nb,'a broken file is not imported and nothing changes');
im=await wsImportText(JSON.stringify(j0));ok(im&&CML.length==nb+1&&new Set(CML.map(e=>e.id)).size==CML.length,'importing the same map again adds a copy with a new id');
// rename / duplicate / delete
{const i=CML.findIndex(e=>e.doc&&e.doc.name=='Round bTrip/b');document.getElementById('wsrn').value='Renamed';await wsRenameOk(i);await cmLoadAll();ok(CML.some(e=>e.meta.name=='Renamed'&&e.doc.name=='Renamed'),'rename')}
{const n0=CML.length,i=CML.findIndex(e=>e.meta.name=='Renamed');await wsDup(i);await cmLoadAll();ok(CML.length==n0+1&&CML.some(e=>e.meta.name=='Renamed (copy)'),'duplicate')}
{const n0=CML.length,i=CML.findIndex(e=>e.meta.name=='Renamed (copy)');await wsDelOk(i);await cmLoadAll();ok(CML.length==n0-1&&!CML.some(e=>e.meta.name=='Renamed (copy)'),'delete')}
// a stored map that can't be read stays listed (with its error) and is never thrown away
await msWrite([['put','maps',{id:'broken1',json:{format:'zombdash-map',version:99}}],['put','meta',{id:'broken1',name:'Broken',w:1,h:1,updated:new Date().toISOString()}]]);await cmLoadAll();
{const b=CML.find(e=>e.id=='broken1');ok(b&&!b.doc&&/newer version/.test(b.errors[0])&&(await msGet('maps','broken1')).json.version==99,'a map that can\\'t be opened is listed with the reason and kept as it is')}
ok(!cmFree().includes(cmKeyOf('broken1')),'and it is left out of Free Play');
// ---------- playtest ----------
edClose();ok(mode=='menu'&&!ED,'close the editor');
edOpen(CML.find(e=>e.doc&&e.id==d2.id).doc,'saved');const acB=JSON.stringify(S.ac),bestB=S.best,lsB=localStorage.deadyard;
ptStart({ci:0,w:1,dif:1});ok(mode=='play'&&mapId===CMPTK&&WW==50*32&&sv.off&&ED.vis===0,'Playtest: the real game on the edited map');
for(let f=0;f<400&&mode=='play';f++){P.hp=P.mx=99;tick(1)}ok(zs.length>0,'zombies arrive in the playtest');
S.ac.xp+=500;S.ac.pts+=999;S.best=77;sv();ok(localStorage.deadyard===lsB,'nothing is saved while a playtest runs');
pauseMenu();ok(ui.innerHTML.includes('BACK TO EDITOR')&&!ui.innerHTML.includes('QUIT RUN'),'pause in a playtest offers BACK TO EDITOR');
ptEnd();ok(mode=='edit'&&ED.vis===1&&JSON.stringify(S.ac)===acB&&S.best===bestB&&!sv.off,'back in the editor; the account is exactly as before');
ptStart({ci:0,w:5,dif:2});ok(wave==4&&mode=='shop'&&DIF()==2,'playtest from wave 5 on Hard starts in the shop');over(1);ok(ui.innerHTML.includes('PLAYTEST ENDED')&&ui.innerHTML.includes('BACK TO EDITOR'),'the playtest end screen');ptAgain();ok(mode=='shop'&&mapId===CMPTK,'play again');ptEnd();ok(DIF()==1&&S.sw==1,'difficulty and start wave are put back');
edClose();ok(mode=='menu'&&!cmIs(mapId)&&MP[mapId],'closing the editor puts a built-in map back behind the menu');
// ---------- Free Play ----------
setGM('f');const key=CML.find(e=>e.id==d2.id).key;const O=ORD();ok(O.slice(0,MP.length).every((m,i)=>m===i)&&O.includes(key),'Free Play lists the built-in maps first, then the custom maps');
setGM('c');ok(!ORD().includes(key),'the campaign order is unchanged');setGM('f');
const mp0=S.mp;mapId=O[O.indexOf(key)-1];mapStep(1);ok(mapId===key&&S.mp===mp0,'stepping onto a custom map does not change the saved map choice');
ok(mapOK(key)&&mapNm(key)=='Editor test'&&mpDesc(key).length&&/Custom map/.test(munT(key)),'its name, description and info line');
play();ok(ui.innerHTML.includes('Editor test'),'the map select shows it');
localStorage[CPK]=JSON.stringify({v:1,t:1,an:S.ac.name,gm:'f',m:2,ci:0,d:1,w:3,k:0,p:{}});
sel=0;start();ok(mode=='play'&&mapId===key&&WW==50*32,'a Free Play run on the custom map');
for(let f=0;f<120;f++){P.hp=P.mx=99;tick(1)}nextWave();ok(localStorage[CPK]&&JSON.parse(localStorage[CPK]).m===2,'the crash checkpoint of another run is left alone');
ok(!(S.ac.mw||[]).some((v,i)=>i>=MP.length),'no per-map record is written for a custom map');
const q0=(S.olq||[]).length;over(1);ok((S.olq||[]).length===q0,'custom maps never go to the leaderboards');
// split screen on a custom map
LBY={s:[{inp:'km',ac:S.ac,ci:0,v:0,rdy:1},{inp:0,ac:'G',ci:1,v:0,rdy:1}]};setGM('f');mapId=key;startMP();ok(mode=='shop'||mode=='play'?MPn==2&&mapId===key&&WW==50*32&&PL.length==2:false,'split screen plays a custom map too');
for(let f=0;f<60;f++){for(const p of PL){p.hp=p.mx=99}tick(1)}ok(PL.every(p=>p.x>0&&p.y>0&&p.x<WW&&p.y<WH),'both players are on the map');MPn=0;LBY=null;
// ---------- the rest of the game ----------
menu();ok(/>PLAY<\\/button><button onclick="workshop\\(\\)">CREATE/.test(ui.innerHTML),'main menu: CREATE right under PLAY');
for(let m=0;m<MP.length;m++){mapId=m;build();if(!(WW>0&&WL.length>0&&!HS.CZ)){ok(0,'built-in map '+m+' still builds');break}}ok(1,'every built-in map still builds as before');
console.log('TOTAL fails '+fails+' of '+n);
`;
const AF=Object.getPrototypeOf(async function(){}).constructor;
new AF('docL','ivs',code+test)(docL,ivs).catch(e=>{console.log('FAIL crashed: '+(e&&e.stack||e));console.log('TOTAL fails 1');process.exitCode=1});
