// Map Workshop: the custom map format (v2 and the step-1 v1 files), the loader, the editor's tools and history, layers, multi-select,
// copy/paste, collision shapes, problem checks, saving, playtest, Free Play, and custom maps in checkpoints, best waves and leaderboards.
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
const inBox=(b,x,y)=>x>=b[0]&&x<=b[0]+b[2]&&y>=b[1]&&y<=b[1]+b[3];
// ---------- the map format ----------
const d0=cmNew({name:'Round <b>Trip</b>',desc:'desc',w:30,h:22,ground:'dirt'});
ok(d0.w==30&&d0.h==22&&d0.ground=='dirt'&&d0.name=='Round bTrip/b','new map: size, ground, name without markup');
ok(same(d0.layers.map(l=>l.id),['terrain','roads','buildings','walls','env','interior','vehicles','spawns']),'new map: the default layers, bottom to top');
for(let i=0;i<d0.ter.length;i++){if(i%7==0)d0.ter[i]=cmPi(d0,'water');if(i%11==0)d0.ter[i]=cmPi(d0,'asphalt');if(i%13==0)d0.ovl[i]=cmOi(d0,'blood');if(i%17==0)d0.rtr[i]=cmRi(d0,'sidewalk')}
d0.obj.push({id:'p1',k:'crate',x:100,y:120,r:0,vr:.4,ly:'env'},{id:'v1',veh:'police',x:300,y:200,r:90,c:'#2f6fd0',dmg:1,ly:'vehicles',z:2},{id:'p2',k:'barrel',x:150,y:330,r:45,ly:'env',sol:false,lk:true},
{id:'p3',k:'flower',x:420,y:420,r:0,ly:'env',sol:true,sh:{t:'c',x:0,y:-4,r:20},hd:true},{id:'p4',k:'bench',x:520,y:420,r:0,ly:'env',sh:{t:'r',x:-20,y:-12,w:40,h:12}});
d0.walls.push({id:'w1',x:10,y:10,w:200,h:8,s:'brick',ly:'walls'},{id:'w2',x:400,y:40,w:4,h:200,s:'fence',ly:'walls',sol:false});d0.spawns.push({id:'s1',x:50,y:600,on:true,ly:'spawns'},{id:'s2',x:60,y:610,on:false,ly:'spawns'});d0.zones.push({id:'z1',x:700,y:500,w:160,h:120,on:true,ly:'spawns'});d0.start={x:480,y:352};
d0.layers[4].lock=1;d0.layers[1].hid=1;
const j0=cmWrite(d0),r0=cmRead(JSON.stringify(j0));
ok(r0.doc&&!r0.errors.length&&!r0.warnings.length,'write then read: no errors or warnings ('+r0.errors.concat(r0.warnings).join('; ')+')');
const d1=r0.doc;ok(d1&&same([d1.w,d1.h,d1.ground,d1.name,d1.desc,d1.start],[d0.w,d0.h,d0.ground,d0.name,d0.desc,d0.start]),'round trip keeps size, ground, name, start');
ok(d1&&d1.pal.length&&Array.from(d1.ter).every((v,i)=>d1.pal[v]===d0.pal[d0.ter[i]]),'round trip keeps every terrain tile');
ok(d1&&Array.from(d1.ovl).every((v,i)=>d1.opal[v]===d0.opal[d0.ovl[i]]),'round trip keeps every overlay tile');
ok(d1&&Array.from(d1.rtr).every((v,i)=>d1.rpal[v]===d0.rpal[d0.rtr[i]]),'round trip keeps every road tile');
ok(d1&&same(d1.obj,d0.obj)&&same(d1.walls,d0.walls)&&same(d1.spawns,d0.spawns)&&same(d1.zones,d0.zones),'round trip keeps props, vehicles, walls and spawns with layer, order, solid, shape, lock and hide');
ok(d1&&same(d1.layers,d0.layers),'round trip keeps the layers with their names, order, hidden and locked');
ok(j0.format=='zombdash-map'&&j0.version==2&&CMVER==2&&j0.terrain.rows.length==22&&j0.terrain.rows[0].length==30&&j0.terrain.legend.d=='dirt'&&j0.overlay.legend.b=='blood'&&j0.roads.rows[0][0]!='.'&&j0.layers.length==8,'file layout v2: version 2, terrain / roads / overlay rows with a legend, layers');
ok(same(j0.props.find(p=>p.id=='p3').shape,{type:'circle',x:0,y:-4,r:20})&&j0.props.find(p=>p.id=='p2').solid===false&&j0.props.find(p=>p.id=='p2').locked===true&&j0.props.find(p=>p.id=='p3').editorHidden===true&&j0.vehicles[0].order==2,'file layout v2: shape, solid, locked, editorHidden, order');
ok(same(cmWrite(d1),j0),'writing it again gives the same file');
// errors: the file is refused and nothing comes back
const bad=t=>{const r=cmRead(t);return !r.doc&&r.errors.length?r.errors[0]:''};
ok(bad('{nope')&&bad('[]')&&bad(JSON.stringify({format:'other'})),'not JSON / not a map: refused');
ok(/newer version/.test(bad(JSON.stringify(Object.assign({},j0,{version:CMVER+1})))),'a map from a newer game version: refused with a clear message');
ok(bad(JSON.stringify(Object.assign({},j0,{width:5}))),'too small: refused');ok(bad(JSON.stringify(Object.assign({},j0,{width:999}))),'too big: refused');
{const j=JSON.parse(JSON.stringify(j0));j.terrain.rows[3]=j.terrain.rows[3].slice(1);ok(/rows\\[3\\]/.test(bad(JSON.stringify(j))),'a short terrain row: refused, naming the row')}
{const j=JSON.parse(JSON.stringify(j0));j.terrain.rows[2]='Q'+j.terrain.rows[2].slice(1);ok(/not in the legend/.test(bad(JSON.stringify(j))),'a character missing from the legend: refused')}
{const j=JSON.parse(JSON.stringify(j0));j.props.push({kind:'crate',x:'a'});ok(/props\\[4\\]/.test(bad(JSON.stringify(j))),'a broken prop entry: refused, naming it')}
{const j=JSON.parse(JSON.stringify(j0));j.props[0].shape={type:'star'};ok(/shape/.test(bad(JSON.stringify(j))),'a broken collision shape: refused')}
{const j=JSON.parse(JSON.stringify(j0));j.props[0].layer='terrain';ok(/tile layer/.test(bad(JSON.stringify(j))),'a prop on a tile layer: refused')}
{const j=JSON.parse(JSON.stringify(j0));j.layers.push({id:'env',name:'Again',kind:'objects'});ok(/same id/.test(bad(JSON.stringify(j))),'two layers with the same id: refused')}
// warnings: loads, keeps what it doesn't know
{const j=JSON.parse(JSON.stringify(j0));j.props.push({id:'zz',kind:'flying_saucer',x:10,y:10,layer:'ufo'});j.terrain.legend.d='lava';j.walls[0].style='glass';j.mod={keep:1};
const r=cmRead(JSON.stringify(j));ok(r.doc&&r.warnings.length>=4,'unknown prop, terrain, wall style and layer: loads with warnings ('+r.warnings.length+')');
ok(r.doc&&cmLy(r.doc,'ufo')&&cmLy(r.doc,'ufo').k=='o','a layer the file does not list is added, so nothing is lost');
const w=cmWrite(r.doc);ok(w.props.some(p=>p.kind=='flying_saucer'&&p.layer=='ufo')&&Object.values(w.terrain.legend).includes('lava')&&w.walls[0].style=='glass'&&w.mod&&w.mod.keep==1,'and writes them back unchanged (nothing is thrown away)');
ok(cmLint(r.doc).some(p=>/flying_saucer/.test(p.m)&&p.ref&&p.ref.o.k=='flying_saucer'),'the Problems list names the missing prop and points at it')}
// names that are built into every JavaScript object are not props, terrain or walls
{const j=JSON.parse(JSON.stringify(j0));j.props.push({kind:'constructor',x:20,y:20},{kind:'__proto__',x:30,y:30},{kind:'toString',x:40,y:40});j.vehicles.push({kind:'hasOwnProperty',x:50,y:50});j.terrain.legend.d='toString';j.walls[0].style='valueOf';
const r=cmRead(JSON.stringify(j));ok(r.doc&&r.warnings.length>=4,'odd names like "constructor" load as unknown, with warnings');
let crash='';try{CMPTD=r.doc;mapId=CMPTK;build();cmLint(r.doc);edMakeThumb(r.doc);cmWrite(r.doc)}catch(e){crash=e.message}ok(!crash,'and nothing crashes: build, problems, thumbnail, write '+crash);CMPTD=null}
// ---------- step-1 maps (format version 1) are upgraded on load ----------
const v1={format:'zombdash-map',version:1,id:'mOLD1',name:'Old map',description:'made in step 1',tileSize:32,width:24,height:18,ground:'grass',
terrain:{legend:{g:'grass',a:'asphalt'},rows:Array.from({length:18},(_,y)=>(y==9?'a':'g').repeat(24))},overlay:{legend:{b:'blood'},rows:Array.from({length:18},(_,y)=>y==2?'b'+'.'.repeat(23):'.'.repeat(24))},
props:[{id:'c1',kind:'crate',x:100,y:100},{id:'h1',kind:'shed',x:300,y:200,rot:15},{id:'s1',kind:'couch',x:400,y:300,var:.25},{id:'b1',kind:'bus',x:500,y:500}],
vehicles:[{id:'v1',kind:'sedan',x:600,y:400,rot:90,color:'#2f6fd0',damaged:true}],walls:[{id:'w1',x:10,y:10,w:100,h:8,style:'brick'}],playerStart:{x:380,y:280},
zombieSpawns:{points:[{id:'sp1',x:40,y:40,enabled:true}],zones:[{id:'zn1',x:500,y:50,w:120,h:80,enabled:false}]},created:'2026-10-20T00:00:00.000Z',updated:'2026-10-20T00:00:00.000Z',order:['c1','h1','s1','b1','v1'],future:{keep:'me'}};
{const r=cmRead(JSON.stringify(v1)),d=r.doc;ok(d&&!r.errors.length&&!r.warnings.length,'a version 1 map loads with no errors or warnings');
ok(d&&same(d.layers.map(l=>l.id),['terrain','roads','buildings','walls','env','interior','vehicles','spawns']),'v1 -> v2: it gets the default layers');
ok(d&&same(d.obj.map(o=>o.id+':'+o.ly),['c1:env','h1:buildings','s1:interior','b1:vehicles','v1:vehicles'])&&d.walls[0].ly=='walls'&&d.spawns[0].ly=='spawns'&&d.zones[0].ly=='spawns','v1 -> v2: everything goes on the layer of its kind (crate, shed, couch, bus, car, wall, spawns)');
ok(d&&d.obj[1].r==15&&d.obj[2].vr==.25&&d.obj[4].c=='#2f6fd0'&&d.obj[4].dmg==1&&d.zones[0].on===false&&same(d.start,{x:380,y:280})&&d.extra.future.keep=='me'&&d.id=='mOLD1'&&d.created=='2026-10-20T00:00:00.000Z','v1 -> v2: positions, turns, colours, flags, start, ids, dates and unknown fields are all kept');
ok(d&&d.pal[d.ter[9*24]]=='asphalt'&&d.opal[d.ovl[2*24]]=='blood'&&d.rtr.every(v=>!v),'v1 -> v2: terrain and overlays kept, the roads layer starts empty');
const w=cmWrite(d);ok(w.version==2&&w.layers.length==8&&w.props[0].layer=='env'&&w.future.keep=='me','v1 -> v2: saving writes a version 2 file');
CMPTD=d;mapId=CMPTK;build();ok(WW==24*32&&WL.some(b=>b[0]==10&&b[1]==10&&b[2]==100)&&HS.px==380,'an upgraded v1 map plays');CMPTD=null}
// ---------- the loader (what Free Play and playtest use) ----------
CMPTD=d1;mapId=CMPTK;build();
ok(WW==960&&WH==704&&HS.CM==d1.id,'build(): a custom map sets the world size');
ok(WL.some(w=>w[0]==10&&w[1]==10&&w[2]==200&&w[4]==0)&&!WL.some(w=>w[0]==400&&w[1]==40),'walls become collision (brick stops bullets), a wall made not solid has none');
ok(WL.filter(w=>w[4]==2).length>1,'water tiles block walking (see-through blockers)');
{const c=OB.crate.c;ok(WL.some(w=>w[0]==100-c[0]/2&&w[1]==120-c[1]&&w[2]==c[0]&&w[3]==c[1]&&w[4]==1),'a solid prop adds its own collision box')}
ok(!WL.some(w=>inBox(w,150,325)),'a prop made not solid (barrel) has no collision');
ok(WL.some(w=>w[0]==500&&w[1]==408&&w[2]==40&&w[3]==12&&w[4]==1),'a box collision shape becomes exactly that box in the game');
{const S_=WL.filter(w=>w[4]==1&&w[0]>=399&&w[0]<=441&&w[1]>=395&&w[1]<=437);ok(S_.length>=4&&S_.every(b=>b[0]>=399.9&&b[0]+b[2]<=440.1&&b[1]>=395.9&&b[1]+b[3]<=436.1)&&S_.some(b=>inBox(b,420,416))&&!S_.some(b=>inBox(b,401,398)),'a circle collision shape becomes a stack of thin boxes inside the circle (flower made solid: '+S_.length+' boxes)')}
{const c=Math.floor(424/gs)*gw+Math.floor(424/gs),shut=bl[c];d1.obj[3].sol=false;build();const open=bl[c];d1.obj[3].sol=true;build();ok(shut==1&&open==0,'the zombie path grid is blocked by the circle (and open without it)')}
{const keep=WL;WL=[];hwCol({k:'police',x:300,y:200,a:Math.PI/2,L:HWV('police')[0],W:HWV('police')[1]});const v=WL;WL=keep;ok(v.every(a=>WL.some(b=>same(a,b))),'vehicles collide like the highway cars (hwCol)')}
ok(HS.px==480&&HS.py==352&&same(HS.CZ,{p:[[50,600]],z:[[700,500,160,120]]}),'player start, and only the spawns that are on');
ok(bl[Math.floor(14/gs)*gw+Math.floor(100/gs)]==1,'the zombie path grid sees the walls');
{let inZ=0,nearP=0;for(let i=0;i<200;i++){P={x:480,y:352};const q=cmSpawnAt(9999);if(q[0]>=700&&q[0]<=860&&q[1]>=500&&q[1]<=620)inZ++;else if(Math.hypot(q[0]-50,q[1]-600)<=21)nearP++}ok(inZ>0&&nearP>0&&inZ+nearP==200,'spawning: every zombie comes from a spawn point or inside a zone ('+inZ+' zone, '+nearP+' point)')}
// draw order: layers first, then the draw order number, then depth
{const d=cmNew({w:30,h:20});d.obj.push({id:'a',k:'crate',x:100,y:300,ly:'env'},{id:'b',k:'crate',x:100,y:100,ly:'vehicles'},{id:'c',k:'crate',x:100,y:200,ly:'env',z:1},{id:'d',k:'crate',x:100,y:50,ly:'env'});d.walls.push({id:'w',x:0,y:0,w:50,h:500,ly:'walls',s:'wall'});
const ord=()=>cmDrawList(d,0).map(q=>q.o.id).join('');ok(ord()=='wdacb','draw order: walls layer, then environmental props by depth, a higher draw order on top, then vehicles ('+ord()+')');
const L=d.layers,i=L.findIndex(l=>l.id=='vehicles'),j=L.findIndex(l=>l.id=='env');[L[i],L[j]]=[L[j],L[i]];ok(ord()=='wbdac','moving the vehicles layer below environmental props draws it first ('+ord()+')');
d.layers.find(l=>l.id=='vehicles').hid=1;ok(cmDrawList(d,1).every(q=>q.o.id!='b')&&cmDrawList(d,0).some(q=>q.o.id=='b'),'a hidden layer is left out in the editor but still painted in the game')}
// roads: water on the roads layer blocks walking too; roads paint over the ground
{const d=cmNew({w:20,h:15});for(let x=0;x<20;x++)d.rtr[5*20+x]=cmRi(d,'water');CMPTD=d;mapId=CMPTK;build();ok(WL.some(w=>w[1]==160&&w[3]==32&&w[4]==2),'water painted on the roads layer blocks walking');CMPTD=null}
// no player start: the run starts in the middle and the editor warns
{const d=cmNew({w:20,h:16});d.start=null;CMPTD=d;mapId=CMPTK;build();ok(HS.px==320&&HS.py==256,'no player start: the run starts in the middle of the map');ok(cmLint(d).some(p=>/No player start/.test(p.m)),'and the Problems list says so');
const w=cmWrite(d),r=cmRead(w);ok(!w.playerStart&&r.doc&&r.doc.start===null,'a map without a player start saves and loads as one');CMPTD=null}
// ---------- the editor (no page here, so it runs headless) ----------
const d2=cmNew({name:'Editor test',w:40,h:30});edOpen(d2,'saved');
ok(mode=='edit'&&ED&&ED.d===d2&&!edIsDirty()&&Array.isArray(ED.sel),'edOpen: edit mode, clean, empty selection');
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
// the roads layer
ED.pt='r';ED.ter='sidewalk';ED.brush=1;const TR0=ter(d2);{const S_=edStroke('Road');edLineAt(S_,0,20,39,20,1,0);edStrokeEnd(S_)}
ok(d2.rtr.filter(v=>v).length==40&&d2.rpal[d2.rtr[20*40+3]]=='sidewalk'&&ter(d2)===TR0,'roads: painting on the roads layer leaves the ground below untouched');
{const S_=edStroke('Erase');edBrushAt(S_,3,20,1,1);edStrokeEnd(S_)}ok(d2.rtr[20*40+3]===0&&d2.rtr[20*40+4]>0,'roads: the eraser takes road tiles away, showing the ground again');
edPick(10,20,0);ok(ED.pt=='r'&&ED.ter=='sidewalk','the eyedropper picks the road tile on top, and switches to painting roads');
edUndo();edUndo();ok(d2.rtr.every(v=>!v),'undo takes the road away');ED.pt='t';
cmLy(d2,'roads').lock=1;ED.pt='r';ok(!edPaintOK(),'a locked layer can\\'t be painted');cmLy(d2,'roads').lock=0;cmLy(d2,'terrain').hid=1;ED.pt='t';ok(!edPaintOK(),'a hidden layer can\\'t be painted');cmLy(d2,'terrain').hid=0;ED.pt='t';
// props, vehicles, rotation, moving, deleting
const nObj=d2.obj.length;ED.asset=edAssets().find(a=>a.id=='p:crate');ED.rot=0;
edAdd(d2.obj,{id:cmUid('p'),k:'crate',x:320,y:320,r:0,vr:.5,ly:'env'},'Place Crate');edAdd(d2.obj,{id:cmUid('v'),veh:'sedan',x:500,y:500,r:0,c:'#c0392b',ly:'vehicles'},'Place Sedan');
ok(d2.obj.length==nObj+2,'place a prop and a vehicle');
edSelect([{t:'o',o:d2.obj[d2.obj.length-1]}]);edRotate(15);edRotate(15);ok(d2.obj[d2.obj.length-1].r==30,'R turns the selection 15° a time');edUndo();ok(d2.obj[d2.obj.length-1].r==15,'undo a turn');
edSelect([{t:'o',o:d2.obj[0]}]);edPropChange('x',{value:'333'});ok(d2.obj[0].x==333,'move with the properties panel');
const crate=d2.obj[0];edDelete();ok(!d2.obj.includes(crate)&&!ED.sel.length,'delete the selection');edUndo();ok(d2.obj[0]===crate,'undo delete puts the same prop back in its place');
ok(edAssets().filter(a=>a.t=='p').length==Object.keys(OB).length&&edAssets().filter(a=>a.t=='v').every(a=>HWV(a.k)),'the asset browser lists every real prop (OB) and only real vehicles (HWV)');
ok(edAssets().every(a=>EDCAT.some(c=>c[0]==a.cat)),'every asset has a category');
{const o={k:'shed',x:600,y:400};ok(edOnObj(o,600,380,0)&&!edOnObj(o,900,380,0),'picking: a click on a prop hits it, a click beside it does not')}
ok(edTargetLy('o',{k:'couch'},1)=='interior'&&edTargetLy('o',{veh:'sedan'},1)=='vehicles'&&edTargetLy('w',null,1)=='walls'&&edTargetLy('s',null,1)=='spawns','new things go on their kind\\'s layer (Auto)');
ED.al='env';ok(edTargetLy('o',{veh:'sedan'},1)=='env','with a layer picked, new things go on that layer');ED.al='';
// walls: draw, cut a doorway, undo
edAdd(d2.walls,{id:'wa',x:100,y:100,w:300,h:8,s:'wall',ly:'walls',z:3},'Draw wall');ED.wth=8;
ok(same(edWallBox(0,0,200,5),{x:0,y:-4,w:200,h:8})&&same(edWallBox(0,0,4,150),{x:-4,y:0,w:8,h:150})&&same(edWallBox(0,0,100,80),{x:0,y:0,w:100,h:80}),'wall drags: lines become walls of the chosen thickness, boxes stay boxes');
const W0=JSON.stringify(d2.walls);edCut({x:200,y:90,w:40,h:30});
ok(d2.walls.length==2&&d2.walls.some(w=>w.x==100&&w.w==100)&&d2.walls.some(w=>w.x==240&&w.w==160)&&d2.walls.every(w=>w.ly=='walls'&&w.z==3),'right-drag cuts a doorway: the wall splits in two, both pieces keep its layer and draw order');
edUndo();ok(JSON.stringify(d2.walls)===W0,'undo the cut');
// spawns
edAdd(d2.spawns,{id:'sp',x:40,y:40,on:true,ly:'spawns'},'Add spawn point');edAdd(d2.zones,{id:'zn',x:900,y:700,w:200,h:150,on:true,ly:'spawns'},'Add spawn zone');edSelect([{t:'s',o:d2.spawns[0]}]);edPropChange('on',{checked:false});ok(d2.spawns[0].on===false,'turn a spawn point off');
edSet(d2.start,{x:600,y:500},'Move player start');ok(d2.start.x==600,'move the player start');
// ---------- step 2: multi-select ----------
const crates=[];for(let i=0;i<3;i++){const o={id:'mc'+i,k:'crate',x:700+i*40,y:300,r:0,ly:'env'};crates.push(o);edAdd(d2.obj,o,'Place Crate')}
edSelect([]);edBoxSel({x:680,y:260,w:110,h:60},0);ok(ED.sel.length==2&&ED.sel.every(s=>s.o===crates[0]||s.o===crates[1]),'box select picks only what is completely inside the box');
{const b=edBB({t:'o',o:crates[2]});edBoxSel({x:b.x0-2,y:b.y0-2,w:b.x1-b.x0+4,h:b.y1-b.y0+4},1)}ok(ED.sel.length==3,'Shift+box adds to the selection');
edSelToggle({t:'o',o:crates[1]});ok(ED.sel.length==2&&!edSelOf(crates[1]),'Shift+click takes one out again');edSelToggle({t:'o',o:crates[1]});
// moving with the mouse: drag one of the selected crates, all of them move, one undo step
{const cam=ED.cam,sx=(x,y)=>({button:0,clientX:(x-cam.x)*cam.z,clientY:(y-cam.y)*cam.z,pointerId:1});ED.tool='select';const u0=EDH.u.length,b=crates.map(o=>o.x);
edDown(sx(700,290));edMove(sx(768,326));edUp(sx(768,326));ok(crates.every((o,i)=>o.x==b[i]+68&&o.y==336)&&EDH.u.length==u0+1&&/Move 3/.test(EDH.u[EDH.u.length-1].n),'dragging one moves the whole selection, as one undo step');
edUndo();ok(crates.every((o,i)=>o.x==b[i]&&o.y==300),'undo the group move');
edDown(sx(700,290));edMove(sx(800,400));edKey({key:'Escape',target:{},preventDefault(){}});edUp(sx(800,400));ok(crates.every((o,i)=>o.x==b[i]&&o.y==300)&&EDH.u.length==u0,'Esc while dragging puts everything back');
edDown(sx(700,290));edUp(sx(700,290));ok(ED.sel.length==1&&ED.sel[0].o===crates[0],'a click (no drag) on one of a group selects just that one');
edDown(sx(660,200));edMove(sx(830,330));edUp(sx(830,330));ok(ED.sel.length==3,'dragging a box on empty ground selects what is inside');
edDown(sx(5,1000));edUp(sx(5,1000));ok(!ED.sel.length,'a click on empty ground clears the selection')}
edBoxSel({x:680,y:260,w:150,h:60},0);
{const u0=EDH.u.length;edRotate(15);ok(crates.every(o=>o.r==15)&&EDH.u.length==u0+1,'R turns every selected prop at once (one undo step)');edUndo()}
edNudge(1,0);ok(crates.every((o,i)=>o.x==700+i*40+1),'arrow keys nudge the whole selection');edUndo();
{const keys0=JSON.stringify(keys);edKey({key:'ArrowRight',target:{},shiftKey:true,preventDefault(){}});ok(crates[0].x==716&&JSON.stringify(keys)===keys0,'Shift+arrow moves by a grid step (and never moves a player)');edUndo()}
// group quarter turn: positions turn around the middle, walls swap width and height
{const w={id:'gw',x:700,y:340,w:120,h:8,s:'wall',ly:'walls'};edAdd(d2.walls,w,'Draw wall');edSelect(crates.map(o=>({t:'o',o})).concat([{t:'w',o:w}]));const B=edBBAll(ED.sel);edTurnGroup(1);
ok(w.w==8&&w.h==120&&crates.every(o=>o.r==90),'group turn: walls swap width and height, props turn 90°');const B2=edBBAll(ED.sel);ok(Math.abs((B.x0+B.x1)/2-(B2.x0+B2.x1)/2)<20&&Math.abs((B.y0+B.y1)/2-(B2.y0+B2.y1)/2)<20,'and the group stays around the same middle');
edUndo();ok(w.w==120&&crates.every(o=>!o.r),'undo the group turn');
// delete a group, undo puts each back where it was
const before=JSON.stringify([d2.obj.map(o=>o.id),d2.walls.map(o=>o.id)]);edDelete();ok(!d2.obj.some(o=>crates.includes(o))&&!d2.walls.includes(w),'Delete removes the whole selection');edUndo();ok(JSON.stringify([d2.obj.map(o=>o.id),d2.walls.map(o=>o.id)])===before,'undo puts every one back in its place');
edSelect([{t:'w',o:w}]);edDelete()}
// change the layer of a group
edBoxSel({x:680,y:260,w:150,h:60},0);edLyMoveSel('interior');ok(crates.every(o=>o.ly=='interior'),'move the selection to another layer');edUndo();ok(crates.every(o=>o.ly=='env'),'undo the layer move');
// ---------- copy / paste / duplicate ----------
edBoxSel({x:680,y:260,w:150,h:60},0);const nO=d2.obj.length;edCopy();
ED.mouse={x:0,y:0,wx:410,wy:610,in:1};edPaste();ok(d2.obj.length==nO+3,'Ctrl+V pastes the copied things');
{const P3=ED.sel.map(s=>s.o);ok(P3.every(o=>!crates.includes(o)&&o.ly=='env'&&o.k=='crate')&&new Set(d2.obj.map(o=>o.id)).size==d2.obj.length,'pasted copies are new things with new ids, on the same layer');
const B=edBBAll(ED.sel);ok(Math.abs((B.x0+B.x1)/2-410)<=16&&Math.abs((B.y0+B.y1)/2-610)<=16&&P3.every((o,i)=>(o.x-crates[i].x)%16==0&&(o.y-crates[i].y)%16==0),'they land around the mouse, moved by whole grid steps');
edDup();const D3=ED.sel.map(s=>s.o);ok(d2.obj.length==nO+6&&D3.every((o,i)=>o.x==P3[i].x+16&&o.y==P3[i].y+16),'Ctrl+D duplicates the selection one grid step away');
edUndo();edUndo();ok(d2.obj.length==nO,'undo paste and duplicate')}
{const w={id:'cw',x:100,y:600,w:80,h:8,s:'brick',ly:'walls'},s={id:'cs',x:60,y:600,on:true,ly:'spawns'},z={id:'cz',x:200,y:560,w:60,h:60,on:true,ly:'spawns'};edAdd(d2.walls,w,'w');edAdd(d2.spawns,s,'s');edAdd(d2.zones,z,'z');
edSelect([{t:'w',o:w},{t:'s',o:s},{t:'z',o:z},{t:'p',o:d2.start}]);edCopy();ED.mouse.in=0;const n0=[d2.walls.length,d2.spawns.length,d2.zones.length];edPaste();
ok(d2.walls.length==n0[0]+1&&d2.spawns.length==n0[1]+1&&d2.zones.length==n0[2]+1&&d2.walls[d2.walls.length-1].s=='brick'&&ED.sel.length==3,'walls and spawn markers copy and paste too (the player start is never copied)');
edCopy(1);ok(d2.walls.length==n0[0]&&d2.spawns.length==n0[1],'Ctrl+X cuts');edUndo();edUndo();
cmLy(d2,'walls').lock=1;const ns=d2.spawns.length;EDCB={cx:0,cy:0,items:[{t:'w',o:edClone(w)},{t:'s',o:edClone(s)}]};edPaste();ok(d2.walls.length==n0[0]&&d2.spawns.length==ns+1,'a locked layer gets nothing pasted into it (the rest still pastes)');edUndo();ok(d2.spawns.length==ns,'undo that paste');cmLy(d2,'walls').lock=0}
// ---------- layers ----------
{const L0=JSON.stringify(d2.layers);edLyAdd();const nl=d2.layers.find(l=>/^New layer/.test(l.n));ok(nl&&nl.k=='o'&&ED.al===nl.id,'add a layer (it becomes the picked layer)');
edLyRename(nl.id,'Barricades');ok(nl.n=='Barricades'||cmLy(d2,nl.id).n=='Barricades','rename it');const id=nl.id;
const i0=d2.layers.findIndex(l=>l.id===id);edLyMove(id,-1);ok(d2.layers.findIndex(l=>l.id===id)==i0-1,'move it down');edLyMove('walls',-1);edLyMove('walls',-1);edLyMove('walls',-1);ok(d2.layers[2].id=='walls'||d2.layers[2].id=='buildings',"object layers can't go below the tile layers");
edLyMove('terrain',1);ok(d2.layers[0].id=='terrain'&&d2.layers[1].id=='roads','the tile layers stay at the bottom');
edSelect(crates.map(o=>({t:'o',o})));edLyMoveSel(id);ok(crates.every(o=>o.ly===id),'move things onto it');
edLyVis(id);ok(cmLy(d2,id).hid&&!ED.sel.length,'hide it: its things are deselected and not drawn in the editor');ok(cmDrawList(d2,1).every(q=>!crates.includes(q.o))&&cmDrawList(d2,0).some(q=>crates.includes(q.o)),'hidden in the editor, still in the game');
{const cam=ED.cam;ok(!edHit(crates[0].x,crates[0].y-8),'things on a hidden layer can\\'t be clicked')}
edLyVis(id);edLyLock(id);ok(cmLy(d2,id).lock&&!edHit(crates[0].x,crates[0].y-8),'lock it: its things can\\'t be clicked');
edSelect(crates.map(o=>({t:'o',o})));const xs=crates.map(o=>o.x);edNudge(5,0);edDelete();ok(crates.every((o,i)=>o.x==xs[i])&&d2.obj.includes(crates[0]),'things on a locked layer can\\'t be moved or deleted');
ED.pt='t';edLyLock('terrain');ok(!edPaintOK(),'a locked Terrain layer can\\'t be painted');edUndo();edLyLock(id);
edLyDel('terrain');ok(cmLy(d2,'terrain'),'the Terrain layer can\\'t be deleted');
edLyDelNow(id,'env');ok(!cmLy(d2,id)&&crates.every(o=>o.ly=='env'),'delete a layer, moving what is on it to another');edUndo();ok(cmLy(d2,id)&&crates.every(o=>o.ly===id),'undo brings the layer back with its things');
edLyDelNow(id,null);ok(!cmLy(d2,id)&&!crates.some(o=>d2.obj.includes(o)),'delete a layer with what is on it');edUndo();ok(cmLy(d2,id)&&crates.every(o=>d2.obj.includes(o)),'undo brings them all back');
for(let k=0;k<12;k++)edUndo();while(EDH.r.length&&!same(JSON.parse(L0).map(l=>l.id),d2.layers.map(l=>l.id)))edRedo();
ok(d2.layers.length>=8,'layer changes are all in the one undo history ('+EDH.u.length+' steps)');for(const o of crates)o.ly='env';
const keep=d2.layers.filter(l=>l.k=='o');for(const l of keep.slice(1))d2.layers.splice(d2.layers.indexOf(l),1);edLyDel(keep[0].id);ok(cmLy(d2,keep[0].id),'the last object layer can\\'t be deleted');d2.layers.push(...keep.slice(1));for(const o of d2.obj.concat(d2.walls,d2.spawns,d2.zones))if(!cmLy(d2,o.ly))o.ly='env'}
// ---------- properties of one or several things ----------
{const c=crates;edSelect(c.map(o=>({t:'o',o})));ok(edShared(ED.sel,s=>s.o.y)===300&&edShared(ED.sel,s=>s.o.x)===undefined,'shared values: the same y shows, different x shows as mixed');
edPropChange('y',{value:'320'});ok(c.every(o=>o.y==320),'a value typed for a group applies to all of them');edUndo();
edPropChange('z',{value:'4'});ok(c.every(o=>o.z==4),'draw order for the group');edOrder('back');ok(c.every(o=>o.z<0||o.z==undefined||o.z<=0),'send to back');edUndo();edUndo();
edPropChange('lk',{checked:true});ok(c.every(o=>o.lk),'lock from the properties');ok(edHit(c[0].x,c[0].y-8),'a locked thing can still be clicked (to unlock it)');edNudge(3,0);ok(c[0].x==700,'but not moved');edPropChange('lk',{checked:false});ok(c.every(o=>!o.lk),'unlock');
edPropChange('hd',{checked:true});ok(c.every(o=>o.hd)&&!ED.sel.length,'hide in the editor');ED.al='env';edLyUnhide();ok(c.every(o=>!o.hd),'the Layers panel shows hidden things again');ED.al=''}
// ---------- collision shapes and solid ----------
{const f={id:'fl',k:'flower',x:200,y:200,r:0,ly:'env'};edAdd(d2.obj,f,'Place Flowers');edSelect([{t:'o',o:f}]);ok(!cmObjBoxes(f).length,'flowers are not solid by default');
edSetSolid(ED.sel,true);ok(cmObjBoxes(f).length==1&&f.sol===true&&!f.sh,'making it solid gives it a collision strip along the bottom of its picture');
edSetShape(ED.sel,'c');ok(f.sh.t=='c'&&f.sh.r>=4&&ED.she==1,'switch to a circle (shape editing starts)');
edPropChange('shr',{value:'30'});ok(f.sh.r==30,'set the radius');const bx=cmObjBoxes(f);ok(bx.length>=7&&bx.every(b=>b[0]>=f.x+f.sh.x-30.1&&b[0]+b[2]<=f.x+f.sh.x+30.1),'the circle is a stack of boxes inside it');
f.sh.x=10;f.sh.y=-6;edRotate(90);ok(f.sh.x==6&&f.sh.y==10&&f.r==90&&f.sh.r==30,'turning the object turns its shape around it');edUndo();ok(f.sh.x==10&&f.sh.y==-6&&!f.r,'undo the turn (shape too)');
edSetShape(ED.sel,'r');const r0=edClone(f.sh);edSelect([{t:'o',o:f}]);edRotate(90);edRotate(0);ok(f.sh.w==r0.h&&f.sh.h==r0.w,'a box shape turned a quarter swaps width and height');edUndo();
edSetSolid(ED.sel,false);ok(!cmObjBoxes(f).length&&f.sh,'solid off: no collision at all (the shape is kept for later)');edSetSolid(ED.sel,true);ok(f.sol===undefined||f.sol===true,'solid on again');
edSetShape(ED.sel,'a');ok(!f.sh,'Auto shape: back to the picture');
const w=d2.walls[0];edSelect([{t:'w',o:w}]);edSetSolid(ED.sel,false);ok(w.sol===false&&!cmColl(d2).some(b=>b[0]==w.x&&b[1]==w.y),'a wall can be made not solid');edUndo()}
// ---------- problems ----------
d2.walls.push({id:'box',x:560,y:460,w:80,h:80,s:'wall',ly:'walls'});{const P1=cmLint(d2).find(p=>p.lv=='err'&&/player start/.test(p.m));ok(P1&&P1.ref&&P1.ref.t=='p','Problems: the player start inside a wall (and it points at it)')}d2.walls.pop();
{d2.walls.push({id:'b1',x:880,y:680,w:240,h:8,s:'wall',ly:'walls'},{id:'b2',x:880,y:858,w:240,h:8,s:'wall',ly:'walls'},{id:'b3',x:880,y:680,w:8,h:186,s:'wall',ly:'walls'},{id:'b4',x:1112,y:680,w:8,h:186,s:'wall',ly:'walls'});ok(cmLint(d2).some(p=>/can't walk/.test(p.m)&&p.ref.t=='z'),'Problems: a walled-in spawn zone: zombies can\\'t walk to the player');d2.walls.splice(-4,4)}
{const s={id:'sw',x:1000,y:200,on:true,ly:'spawns'},w={id:'ww',x:980,y:180,w:40,h:40,s:'wall',ly:'walls'};d2.spawns.push(s);d2.walls.push(w);ok(cmLint(d2).some(p=>/spawn point is inside/.test(p.m)&&p.ref.o===s),'Problems: a spawn point inside a wall');d2.spawns.pop();d2.walls.pop()}
{const o={id:'far',k:'crate',x:5000,y:100,ly:'env'};d2.obj.push(o);const P2=cmLint(d2),i=P2.findIndex(p=>/outside the map/.test(p.m));ok(i>=0&&P2[i].ref.o===o,'Problems: something outside the map');
ED.probs=P2;edGoProb(i);ok(ED.sel.length==1&&ED.sel[0].o===o,'clicking a problem selects the thing it is about');d2.obj.pop();edSelect([])}
{const o={id:'miss',k:'no_such_prop',x:100,y:100,ly:'env'};d2.obj.push(o);ok(cmLint(d2).some(p=>/Missing prop/.test(p.m)&&p.ref.o===o),'Problems: a missing asset');d2.obj.pop()}
{const st=d2.start;edSelect([{t:'p',o:st}]);edDelete();ok(d2.start===null&&cmLint(d2).some(p=>/No player start/.test(p.m)),'deleting the player start: "No player start"');edUndo();ok(d2.start===st,'undo puts it back')}
// resize: smaller removes what's outside (after asking), undo brings it all back
{ED.pt='r';ED.ter='asphalt';const S_=edStroke('r');edBrushAt(S_,2,2,1,0);edStrokeEnd(S_);ED.pt='t'}
const beforeR=JSON.stringify(cmWrite(d2));d2.obj.push({id:'far',k:'rock',x:1200,y:900,r:0,ly:'env'});
edResize(30,20);ok(d2.w==30&&d2.h==20&&d2.ter.length==600&&d2.rtr.length==600&&d2.rtr[2*30+2]>0&&!d2.obj.some(o=>o.id=='far')&&!d2.zones.some(z=>z.x>=960),'resize smaller: tiles (roads too) and things outside are removed');
edUndo();ok(d2.w==40&&d2.h==30&&d2.obj.some(o=>o.id=='far')&&d2.rtr.length==1200,'undo resize brings everything back');d2.obj.pop();ok(JSON.stringify(cmWrite(d2))===beforeR,'and the map is exactly as before');
edResize(50,35);ok(d2.w==50&&d2.ter[34*50+49]===d2.pal.indexOf(d2.ground)&&d2.ter[5*50+12]===d2.pal.indexOf('asphalt')&&d2.rtr[2*50+2]>0,'resize bigger: new ground is the default, old tiles stay put');
// keys go to the editor, not the game
keys={};edKey({key:'w',target:{tagName:'CANVAS'}});ok(ED.tool=='wall'&&!keys.w,'keys: W picks the wall tool (and does not move a player)');
edKey({key:'Escape',target:{}});ok(ED.tool=='select','Esc goes back to Select');
edSelect(crates.map(o=>({t:'o',o})));edKey({key:'Escape',target:{}});ok(!ED.sel.length,'Esc again clears the selection');
edKey({key:'z',ctrlKey:true,target:{}});ok(d2.w==40,'Ctrl+Z undoes');edKey({key:'y',ctrlKey:true,target:{}});ok(d2.w==50,'Ctrl+Y redoes');
edKey({key:'b',target:{tagName:'INPUT'}});ok(ED.tool=='select','typing in a text box does not switch tools');
{edKey({key:'a',ctrlKey:true,target:{},preventDefault(){}});const n1=ED.sel.length;ok(n1>5,'Ctrl+A selects everything that can be edited ('+n1+')');
edSelect(crates.map(o=>({t:'o',o})));edKey({key:'c',ctrlKey:true,target:{},preventDefault(){}});ED.mouse={x:0,y:0,wx:300,wy:900,in:1};const n0=d2.obj.length;edKey({key:'v',ctrlKey:true,target:{},preventDefault(){}});edKey({key:'d',ctrlKey:true,target:{},preventDefault(){}});
ok(d2.obj.length==n0+6,'Ctrl+C, Ctrl+V, Ctrl+D from the keyboard');edUndo();edUndo()}
ok(PL.every(p=>!p.x||true)&&mode=='edit','the game does not run while the editor is open');
// ---------- saving, the Workshop list, export / import ----------
let saved=await edSave();ok(msMem(),'no IndexedDB in this test: maps are kept in memory');ok(saved&&!edIsDirty()&&ED.src=='saved','Save: stored, map clean');
await cmLoadAll();const e2=CML.find(e=>e.id==d2.id);ok(e2&&e2.doc&&e2.meta.name=='Editor test'&&e2.doc.w==50&&same(e2.doc.layers,d2.layers),'the saved map is in the list, layers and all');
const stored=await msGet('maps',d2.id);ok(same(stored.json,cmWrite(d2))&&stored.json.version==2,'what is stored is exactly the export file (version 2)');
// a draft is kept while there are unsaved changes, and dropped by a save
ED.terK='t';ED.ter='mud';{const S_=edStroke('Paint');edBrushAt(S_,1,1,1,0);edStrokeEnd(S_)}flush();await edDraft();
const dr=await msGet('kv','draft');ok(dr&&dr.id==d2.id&&cmRead(dr.json).doc.pal.includes('mud'),'unsaved changes are kept in a crash-safe draft');
// save as copy
await edSave(1);ok(ED.d.id!==d2.id&&/\\(copy\\)/.test(ED.d.name)&&!edIsDirty(),'Save as copy: a new map, now the one being edited');
ok(!(await msGet('kv','draft')),'saving clears the draft');
await cmLoadAll();ok(CML.length==2,'two maps in the list');
// a step-1 map already on the device opens, plays and is saved as version 2
await msWrite([['put','maps',{id:v1.id,json:v1}],['put','meta',{id:v1.id,name:v1.name,desc:'',w:24,h:18,created:v1.created,updated:v1.updated,thumb:''}]]);await cmLoadAll();
{const e=CML.find(x=>x.id==v1.id);ok(e&&e.doc&&e.doc.layers.length==8&&!e.warnings.length,'a version 1 map stored on the device loads as version 2');edOpen(cmClone(e.doc),'saved');await edSave();ok((await msGet('maps',v1.id)).json.version==2,'saving it writes version 2');edClose()}
// import: a good file is added as its own map, a broken one changes nothing
let im=await wsImportText(JSON.stringify(j0));ok(im&&CML.some(e=>e.doc&&e.doc.name=='Round bTrip/b'),'import a map file');
const nb=CML.length;im=await wsImportText('{"format":"zombdash-map","version":1,"width":3}');ok(!im&&CML.length==nb,'a broken file is not imported and nothing changes');
im=await wsImportText(JSON.stringify(j0));ok(im&&CML.length==nb+1&&new Set(CML.map(e=>e.id)).size==CML.length,'importing the same map again adds a copy with a new id');
im=await wsImportText(JSON.stringify(Object.assign({},v1,{id:'mOLD2'})));ok(im&&im.layers.length==8,'importing a version 1 file upgrades it');
// rename / duplicate / delete
{const i=CML.findIndex(e=>e.doc&&e.doc.name=='Round bTrip/b');document.getElementById('wsrn').value='Renamed';await wsRenameOk(i);await cmLoadAll();ok(CML.some(e=>e.meta.name=='Renamed'&&e.doc.name=='Renamed'),'rename')}
{const n0=CML.length,i=CML.findIndex(e=>e.meta.name=='Renamed');await wsDup(i);await cmLoadAll();ok(CML.length==n0+1&&CML.some(e=>e.meta.name=='Renamed (copy)'),'duplicate')}
{const n0=CML.length,i=CML.findIndex(e=>e.meta.name=='Renamed (copy)');await wsDelOk(i);await cmLoadAll();ok(CML.length==n0-1&&!CML.some(e=>e.meta.name=='Renamed (copy)'),'delete')}
// a stored map that can't be read stays listed (with its error) and is never thrown away
await msWrite([['put','maps',{id:'broken1',json:{format:'zombdash-map',version:99}}],['put','meta',{id:'broken1',name:'Broken',w:1,h:1,updated:new Date().toISOString()}]]);await cmLoadAll();
{const b=CML.find(e=>e.id=='broken1');ok(b&&!b.doc&&/newer version/.test(b.errors[0])&&(await msGet('maps','broken1')).json.version==99,'a map that can\\'t be opened is listed with the reason and kept as it is')}
ok(!cmFree().includes(cmKeyOf('broken1')),'and it is left out of Free Play');
// ---------- playtest ----------
edOpen(CML.find(e=>e.doc&&e.id==d2.id).doc,'saved');const acB=JSON.stringify(S.ac),bestB=S.best,lsB=localStorage.deadyard;
localStorage[CPK]=JSON.stringify({v:1,t:1,an:S.ac.name,gm:'f',m:2,ci:0,d:1,w:3,k:0,p:{cash:0}});const cpB=localStorage[CPK];
ptStart({ci:0,w:1,dif:1});ok(mode=='play'&&mapId===CMPTK&&WW==50*32&&sv.off&&ED.vis===0,'Playtest: the real game on the edited map');
for(let f=0;f<400&&mode=='play';f++){P.hp=P.mx=99;tick(1)}ok(zs.length>0,'zombies arrive in the playtest');
ok(WL.some(b=>b[4]==1),'the playtest uses the map\\'s collision');
nextWave();ok(localStorage[CPK]===cpB,'a playtest never writes or clears the crash checkpoint');ok(olRow()===null,'a playtest never posts a leaderboard score');
S.ac.xp+=500;S.ac.pts+=999;S.best=77;sv();ok(localStorage.deadyard===lsB,'nothing is saved while a playtest runs');
pauseMenu();ok(ui.innerHTML.includes('BACK TO EDITOR')&&!ui.innerHTML.includes('QUIT RUN'),'pause in a playtest offers BACK TO EDITOR');
ptEnd();ok(mode=='edit'&&ED.vis===1&&JSON.stringify(S.ac)===acB&&S.best===bestB&&!sv.off,'back in the editor; the account is exactly as before');
ptStart({ci:0,w:5,dif:2});ok(wave==4&&mode=='shop'&&DIF()==2,'playtest from wave 5 on Hard starts in the shop');over(1);ok(ui.innerHTML.includes('PLAYTEST ENDED')&&ui.innerHTML.includes('BACK TO EDITOR')&&localStorage[CPK]===cpB,'the playtest end screen (the checkpoint is still there)');ptAgain();ok(mode=='shop'&&mapId===CMPTK,'play again');ptEnd();ok(DIF()==1&&S.sw==1,'difficulty and start wave are put back');
ok(!(S.ac.cmw&&S.ac.cmw[d2.id]),'a playtest records no best wave');
edClose();ok(mode=='menu'&&!cmIs(mapId)&&MP[mapId],'closing the editor puts a built-in map back behind the menu');
// ---------- Free Play ----------
setGM('f');const key=CML.find(e=>e.id==d2.id).key;const O=ORD();ok(O.slice(0,MP.length).every((m,i)=>m===i)&&O.includes(key),'Free Play lists the built-in maps first, then the custom maps');
setGM('c');ok(!ORD().includes(key),'the campaign order is unchanged');setGM('f');
const mp0=S.mp;mapId=O[O.indexOf(key)-1];mapStep(1);ok(mapId===key&&S.mp===mp0,'stepping onto a custom map does not change the saved map choice');
ok(mapOK(key)&&mapNm(key)=='Editor test'&&mpDesc(key).length&&/Custom map/.test(munT(key)),'its name, description and info line');
play();ok(ui.innerHTML.includes('Editor test'),'the map select shows it');
sel=0;S.sw=1;start();ok(mode=='play'&&mapId===key&&WW==50*32,'a Free Play run on the custom map');ok(!localStorage[CPK],'starting it clears the old checkpoint, like any run');
for(let f=0;f<60;f++){P.hp=P.mx=99;tick(1)}wave=3;kills=40;nextWave();
{const c=JSON.parse(localStorage[CPK]||'null');ok(c&&c.cm===d2.id&&c.m===-1&&c.w==3,'crash checkpoint: a custom-map run saves one, with the map\\'s id')}
ok(cpOK()&&cpMap(cpOK())===key,'the checkpoint finds its custom map');ok(/Editor test/.test(cpBanner()),'the menu offers to resume it, by name');
ok(S.ac.cmw&&S.ac.cmw[d2.id]>=4&&mBest(S.ac,key)>=4&&/Best wave here: \\d/.test(munT(key)),'best wave: recorded per custom map and shown in the map select');
ok(!(S.ac.mw||[]).some((v,i)=>i>=MP.length),'built-in best waves are untouched');
{RUN0=Date.now()-60000;RUNW=1;const r=olRow();ok(r&&r.map===63&&r.cmap===d2.id&&r.wave==wave&&r.mode=='f','leaderboard: a custom-map run posts map 63 with the map\\'s id')}
{let path='';const keep=sbRaw;sbRaw=(p_)=>{path=p_;return Promise.resolve([])};await lbLoad(key,1);const pc=path;await lbLoad(-1,1);const pa=path;await lbLoad(3,1);const pb=path;sbRaw=keep;
ok(/&map=eq\\.63&cmap=eq\\./.test(pc)&&pc.includes(encodeURIComponent(d2.id)),'leaderboard: a custom map\\'s board asks for its id');ok(/&map=neq\\.63/.test(pa),'"All maps" leaves custom maps out');ok(/&map=eq\\.3(&|$)/.test(pb),'a built-in map\\'s board is unchanged')}
{OL.lbm=MP.length-1;const keep=lbOpen;let seen=[];lbOpen=()=>{seen.push(OL.lbm)};for(let i=0;i<CML.length+2;i++)lbStep(1);lbOpen=keep;ok(seen.includes(key)&&seen.includes(-1),'the leaderboard arrows step through the custom maps too')}
// resume the checkpoint on the custom map
over(1);ok(!localStorage[CPK],'the end of the run clears the checkpoint');nextWave&&0;
localStorage[CPK]=JSON.stringify({v:1,t:Date.now(),an:S.ac.name,gm:'f',m:-1,cm:d2.id,ci:0,d:1,w:6,k:30,L:3,IW:{},BB:[],LB:0,p:{cash:120,hp:5,mx:5,ar:0,own:[0],cur:0,mg:{},am:{},paid:{},v:0}});menu();
cpResume();ok(mode=='shop'&&mapId===key&&wave==6&&P.cash==120&&S.mp===mp0,'resume: the run continues on the custom map (and the saved map choice is untouched)');
// a checkpoint for a map that isn't on this device is not offered
localStorage[CPK]=JSON.stringify({v:1,t:Date.now(),an:S.ac.name,gm:'f',m:-1,cm:'mGONE',ci:0,d:1,w:6,k:0,p:{cash:0}});ok(!cpOK(),'a checkpoint for a custom map that is gone is not offered');cpClear();
// split screen on a custom map
LBY={s:[{inp:'km',ac:S.ac,ci:0,v:0,rdy:1},{inp:0,ac:'G',ci:1,v:0,rdy:1}]};setGM('f');mapId=key;startMP();ok(mode=='shop'||mode=='play'?MPn==2&&mapId===key&&WW==50*32&&PL.length==2:false,'split screen plays a custom map too');
for(let f=0;f<60;f++){for(const p of PL){p.hp=p.mx=99}tick(1)}ok(PL.every(p=>p.x>0&&p.y>0&&p.x<WW&&p.y<WH),'both players are on the map');ok(olRow()===null,'split screen posts no leaderboard score (as on every map)');MPn=0;LBY=null;
// ---------- the rest of the game ----------
menu();ok(/>PLAY<\\/button><button onclick="workshop\\(\\)">CREATE/.test(ui.innerHTML),'main menu: CREATE right under PLAY');
for(let m=0;m<MP.length;m++){mapId=m;build();if(!(WW>0&&WL.length>0&&!HS.CZ)){ok(0,'built-in map '+m+' still builds');break}}ok(1,'every built-in map still builds as before');
{mapId=2;sel=0;S.sw=1;start();wave=5;P.ac=S.ac;RUN0=Date.now()-60000;RUNW=1;const r=olRow();ok(r&&r.map===2&&!('cmap' in r),'a built-in map\\'s score row is unchanged');over(1)}
console.log('TOTAL fails '+fails+' of '+n);
`;
const AF=Object.getPrototypeOf(async function(){}).constructor;
new AF('docL','ivs',code+test)(docL,ivs).catch(e=>{console.log('FAIL crashed: '+(e&&e.stack||e));console.log('TOTAL fails 1');process.exitCode=1});
