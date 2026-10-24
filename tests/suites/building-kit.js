// Building kit (map format v3): decals, effects, areas, paths and special features; their drawing, collision and game systems;
// the editor's Room, Opening, Area, Path, point-editing and Feature tools; prefabs (save, place, the starter set);
// the map checker (tools/check-map.js); the demo map shipped as a Workshop sample; the asset browser covering every built-in prop.
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
global.REQ=require;
const test=`;S.ac.name='Tester';S.ac.cp=8;
docL.pointerdown[0]();endIntro();
{ // everything in a block, so these names never clash with the game's
const tick=n=>{for(let i=0;i<n;i++){AT_+=.016;NOW_+=16;for(const f of ivs)f();for(let q=TQ.length-1;q>=0;q--)if(TQ[q][0]<=AT_){const g=TQ[q][1];TQ.splice(q,1);g()}loop(NOW_)}};
let fails=0,n=0;const ok=(c,m)=>{n++;if(c)console.log('PASS '+m);else{fails++;console.log('FAIL '+m)}};
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const OWN=(o,k)=>Object.prototype.hasOwnProperty.call(o,k);
const inBox=(b,x,y)=>x>=b[0]&&x<=b[0]+b[2]&&y>=b[1]&&y<=b[1]+b[3];
const HIT=(B,x,y)=>B.filter(b=>inBox(b,x,y));
const LY=(k,o)=>{o.ly=cmKindLy(k,o);return o};
const KEY=k=>edKey({key:k,target:{},preventDefault(){}});
const SX=(x,y,alt)=>({button:0,clientX:(x-ED.cam.x)*ED.cam.z,clientY:(y-ED.cam.y)*ED.cam.z,pointerId:1,altKey:!!alt});
const CLK=(x,y)=>{edDown(SX(x,y));edUp(SX(x,y))};
const DRG=(a,b,c,d)=>{edDown(SX(a,b));edMove(SX((a+c)/2,(b+d)/2));edMove(SX(c,d));edUp(SX(c,d))};
const LAST=()=>EDH.u[EDH.u.length-1];
const openEd=d=>{edOpen(d,'saved');ED.cam.x=0;ED.cam.y=0;ED.cam.z=1;ED.snap=1;ED.step=16};
const FS=REQ('fs'),PATH=REQ('path'),OS=REQ('os'),CP=REQ('child_process');
const ROOT=PATH.join(PATH.dirname(PATH.resolve(process.argv[2]))),CHECK=PATH.join(ROOT,'tools','check-map.js');

// ---------- the file format: version 3 and its new sections ----------
const d0=cmNew({name:'Kit format',w:40,h:30,ground:'grass'});
d0.obj.push(LY('o',{id:'d1',dc:'oil',x:100,y:120,r:30,sc:1.5,op:.6,vr:.3}),LY('o',{id:'d2',dc:'text',x:200,y:120,r:0,c:'#ffffff',tx:'SLOW'}),
LY('o',{id:'x1',fx:'fountain',x:300,y:300}),LY('o',{id:'x2',fx:'flicker',x:400,y:300,sc:1.4,c:'#c8e0ff',o:{flame:0}}),LY('o',{id:'p1',k:'awning',x:500,y:300,r:0,c:'#2f8a4a',tx:'ELM ST MARKET'}));
d0.walls.push({id:'w1',x:64,y:60,w:200,h:6,s:'siding',c:'#8fb4d8',ly:'walls'},{id:'w2',x:264,y:60,w:40,h:6,s:'window',ly:'walls'});
d0.areas.push(LY('a',{id:'a1',a:'floor',x:64,y:64,w:256,h:192,c:'#9a6a3c',o:{pt:'wood',in:1}}),LY('a',{id:'a2',a:'parking',x:400,y:400,w:300,h:180,c:'#e8e8e0',o:{rows:'2',sw:50}}),LY('a',{id:'a3',a:'roof',x:700,y:64,w:200,h:160,tx:'HALL'}));
d0.paths.push(LY('l',{id:'l1',p:'road',x:0,y:600,pts:[[0,0],[600,0],[1200,40]],w:128}),LY('l',{id:'l2',p:'picket',x:64,y:40,pts:[[0,0],[300,0],[300,240]],w:6,sharp:false}),LY('l',{id:'l3',p:'pond',x:900,y:500,pts:[[0,0],[120,-20],[160,90],[30,120]]}));
d0.feats.push({id:'f1',f:'nospawn',x:10,y:10,w:100,h:100,ly:'features'},{id:'f2',f:'roadgraph',x:0,y:600,pts:[[0,0],[600,0],[1200,40]],e:[[0,1],[1,2]],ly:'features'});
const j0=cmWrite(d0),r0=cmRead(JSON.stringify(j0));
ok(r0.doc&&!r0.errors.length&&!r0.warnings.length,'kit pieces: write then read with no errors or warnings ('+r0.errors.concat(r0.warnings).join('; ')+')');
ok(j0.version==3&&j0.decals.length==2&&j0.effects.length==2&&j0.areas.length==3&&j0.paths.length==3&&j0.features.length==2,'the file has the new sections: decals, effects, areas, paths, features');
ok(same(j0.paths[0].points,[[0,600],[600,600],[1200,640]])&&j0.paths[1].sharp===false&&same(j0.features[1].nodes,[[0,600],[600,600],[1200,640]])&&same(j0.features[1].edges,[[0,1],[1,2]]),'paths and the road graph are written with map coordinates (points, nodes, edges)');
ok(j0.decals[0].scale==1.5&&j0.decals[0].rot==30&&j0.decals[0].opacity==.6&&j0.decals[1].text=='SLOW'&&j0.effects[1].size==1.4&&j0.effects[1].options.flame===0&&j0.areas[0].options.pt=='wood','decal size, turn, opacity and text, effect size and options, area options are kept');
const r0d=r0.doc;ok(r0d&&same(r0d.obj,d0.obj)&&same(r0d.walls,d0.walls)&&same(r0d.areas,d0.areas)&&same(r0d.paths,d0.paths)&&same(r0d.feats,d0.feats),'round trip keeps every decal, effect, coloured wall, area, path and feature exactly');
ok(same(cmWrite(r0d),j0),'writing it again gives the same file');
{const e=cmWrite(cmNew({name:'Empty',w:30,h:20}));ok(!('decals' in e)&&!('areas' in e)&&!('paths' in e)&&!('features' in e)&&!('effects' in e),'maps without kit pieces have no empty kit sections')}
// version 2 files upgrade by themselves
{const d=cmNew({name:'Old',w:30,h:20});d.obj.push({id:'c',k:'crate',x:100,y:100,r:0,ly:'env'});const j=cmWrite(d);j.version=2;j.layers=j.layers.filter(l=>!['ground','effects','features'].includes(l.id));delete j.decals;
const r=cmRead(JSON.stringify(j));ok(r.doc&&!r.errors.length&&!r.warnings.length&&same(r.doc.layers.map(l=>l.id),['terrain','roads','ground','buildings','walls','env','interior','vehicles','effects','spawns','features']),'a version 2 file loads as version 3 with the kit layers added in place');
ok(r.doc&&r.doc.obj.length==1&&r.doc.obj[0].k=='crate'&&cmWrite(r.doc).version==3,'... nothing in it changes, and it saves as version 3')}
// bad and unknown kit entries
{const bad=j=>{const r=cmRead(JSON.stringify(j));return !r.doc&&r.errors.length?r.errors[0]:''};
const J=()=>JSON.parse(JSON.stringify(j0));
{const j=J();j.areas[0].w=-5;ok(/areas\\[0\\]/.test(bad(j)),'an area with no size: refused, naming it')}
{const j=J();j.paths[0].points=[[1,2]];ok(/paths\\[0\\]/.test(bad(j)),'a path with one point: refused, naming it')}
{const j=J();j.features[1].edges=[[0,9]];ok(/features\\[1\\]/.test(bad(j)),'a road graph edge to a missing node: refused')}
{const j=J();j.decals[0].scale='big';ok(/decals\\[0\\]/.test(bad(j)),'a decal with a bad size: refused')}
{const j=J();j.decals.push({kind:'ufo_burn',x:5,y:5});j.areas.push({kind:'lava_lake',x:0,y:0,w:64,h:64});j.paths.push({kind:'monorail',points:[[0,0],[50,0]]});j.effects.push({kind:'laser',x:1,y:1});j.features.push({kind:'portal',x:0,y:0,w:20,h:20});
const r=cmRead(JSON.stringify(j));ok(r.doc&&r.warnings.length>=5,'unknown decal, area, path, effect and feature kinds: load with warnings ('+r.warnings.length+')');
const w=cmWrite(r.doc);ok(w.decals.some(p=>p.kind=='ufo_burn')&&w.areas.some(p=>p.kind=='lava_lake')&&w.paths.some(p=>p.kind=='monorail')&&w.effects.some(p=>p.kind=='laser')&&w.features.some(p=>p.kind=='portal'),'... and are written back unchanged');
let pe=0;try{const g=document.createElement('canvas').getContext('2d');for(const it of cmDrawList(r.doc,0))cmPaintIt(g,it.o,it.t);cmColl(r.doc)}catch(e){pe=e.message}ok(!pe,'missing kit pieces never break drawing or collision '+(pe||''))}}

// ---------- every piece draws, and makes the right collision ----------
{const d=cmNew({name:'All',w:60,h:50});let k=0;const errs=[],g=document.createElement('canvas').getContext('2d');
for(const t of CMDEC)d.obj.push(LY('o',{id:'d'+k++,dc:t.id,x:100+k*10,y:200,r:30,sc:1.5,tx:'HELLO'}));
for(const t of CMFX)d.obj.push(LY('o',{id:'x'+k++,fx:t.id,x:300+k*5,y:400}));
for(const t of CMAREA)d.areas.push(LY('a',{id:'a'+k++,a:t.id,x:200,y:300,w:Math.max(t.min?t.min[0]:0,320),h:Math.max(t.min?t.min[1]:0,220),tx:'TOWN',o:Object.assign({},t.def&&t.def.o)}));
for(const t of CMPA)d.paths.push(LY('l',{id:'l'+k++,p:t.id,x:400,y:500,pts:[[0,0],[200,40],[300,200],[100,260]],w:t.w,o:Object.assign({},t.def&&t.def.o)}));
for(const t of CMWALL){d.walls.push({id:'w'+k++,x:100,y:100,w:120,h:8,s:t.id,ly:'walls',c:'#8fb4d8'},{id:'w'+k++,x:100,y:100,w:8,h:120,s:t.id,ly:'walls'})}
for(const it of cmDrawList(d,0)){try{cmPaintIt(g,it.o,it.t)}catch(e){errs.push((it.o.dc||it.o.fx||it.o.a||it.o.p||it.o.s)+': '+e.message)}}
ok(!errs.length,'every decal ('+CMDEC.length+'), effect ('+CMFX.length+'), area ('+CMAREA.length+'), path ('+CMPA.length+') and wall style ('+CMWALL.length+') draws '+errs.slice(0,3).join(' | '));
let ce='';try{cmColl(d)}catch(e){ce=e.message}ok(!ce,'... and makes collision without errors '+ce);
const j=cmWrite(d),r=cmRead(JSON.stringify(j));ok(r.doc&&!r.errors.length&&!r.warnings.length&&same(cmWrite(r.doc),j),'... and survives a save and load unchanged');
ok(CMDEC.length>=40&&CMFX.length>=10&&CMAREA.length>=20&&CMPA.length>=25,'the kit has the pieces the built-in maps need (decals, effects, areas, paths)');
ok(CMDEC.every(t=>t.n&&t.cat)&&CMAREA.every(t=>t.n&&t.cat)&&CMPA.every(t=>t.n&&t.cat)&&CMFX.every(t=>t.n),'every kit piece has a name and a group')}
{const d=cmNew({name:'Coll',w:40,h:30,ground:'grass'});
d.paths.push(LY('l',{id:'f',p:'picket',x:96,y:96,pts:[[0,0],[320,0]],w:6}),LY('l',{id:'pd',p:'pond',x:600,y:600,pts:[[0,0],[240,0],[240,160],[0,160]]}));
d.areas.push(LY('a',{id:'dk',a:'dock',x:640,y:640,w:64,h:200}));
for(let tx=0;tx<40;tx++)d.ter[12*40+tx]=cmPi(d,'water');
d.areas.push(LY('a',{id:'br',a:'bridge',x:256,y:368,w:96,h:64}),LY('a',{id:'rf',a:'roof',x:900,y:100,w:200,h:160}),LY('a',{id:'rg',a:'rug',x:900,y:600,w:100,h:80}));
d.walls.push({id:'wi',x:96,y:200,w:80,h:6,s:'window',ly:'walls'},{id:'wb',x:200,y:200,w:80,h:6,s:'bars',ly:'walls'},{id:'wd',x:300,y:200,w:44,h:6,s:'door',ly:'walls'},{id:'wa',x:360,y:200,w:72,h:6,s:'autodoor',ly:'walls'},{id:'wr',x:460,y:200,w:80,h:6,s:'rollup',ly:'walls'},{id:'wg',x:560,y:200,w:72,h:6,s:'garage',ly:'walls'});
d.obj.push(LY('o',{id:'dd',dc:'oil',x:1000,y:500,r:0}),LY('o',{id:'xx',fx:'fire',x:1050,y:500}));
const C=cmColl(d);
ok(HIT(C,256,96).length&&HIT(C,120,97).length&&HIT(C,410,96).length&&!HIT(C,256,130).length,'a fence path blocks along its line, and only there');
ok(HIT(C,760,620).some(b=>b[4]==2)&&HIT(C,620,740).length,'a pond path blocks walking but lets bullets over (see-through)');
ok(!HIT(C,672,700).length&&!HIT(C,672,750).length&&HIT(C,672,630).length,'a dock on the pond can be walked on');
ok(HIT(C,100,400).some(b=>b[4]==2)&&!HIT(C,304,400).length&&!HIT(C,272,400).length,'water tiles under a bridge are dry; the rest of the river still blocks');
ok(HIT(C,136,203).some(b=>b[4]==0)&&HIT(C,240,203).some(b=>b[4]==2)&&HIT(C,596,203).some(b=>b[4]==0),'windows and closed garage doors are solid (they stop bullets, as on the built-in maps); cell bars let bullets through');
ok(!HIT(C,322,203).length&&!HIT(C,396,203).length&&!HIT(C,500,203).length,'doorways, automatic doors and open roll-up doors can be walked through');
ok(HIT(C,1000,180).length&&!HIT(C,950,640).length,'roof blocks are solid; rugs and floors are not');
ok(!HIT(C,1000,500).length&&!HIT(C,1050,500).length&&!cmSolid(d.obj[0],'o')&&!cmSolid(d.obj[1],'o'),'decals and effects are never solid')}

// ---------- the editor: Room, Openings, interior walls ----------
const de=cmNew({name:'Kit editor',w:50,h:40,ground:'grass'});openEd(de);
ok(['room','door','area','path','prefab','feat'].every(t=>EDT.some(x=>x[0]==t)),'the editor has the Room, Opening, Area, Path, Prefab and Feature tools');
edTool('room');ED.rm='room';ED.rdoor='s';ED.rpt='check';
DRG(288,288,608,512);
const fl=de.areas.find(a=>a.a=='floor');
ok(fl&&same([fl.x,fl.y,fl.w,fl.h],[288,288,320,224])&&fl.o.pt=='check'&&fl.o.in==1,'Room: dragging a rectangle makes a floor of that size (indoor)');
ok(de.walls.length==6&&de.walls.filter(w=>w.s=='door').length==1&&de.walls.every(w=>w.ly=='walls'),'Room: walls all round in the chosen style, with a doorway in the south wall');
ok(de.walls.some(w=>w.y<290&&w.w>300)&&de.walls.filter(w=>w.h>200).length==2,'Room: the walls sit on the rectangle edges');
ok(LAST().n=='Add room'&&same(ED.sel.map(s=>s.t),['a']),'Room: one undo step, the floor is selected');
edUndo();ok(!de.walls.length&&!de.areas.length,'Room: undo takes the whole room away');edRedo();ok(de.walls.length==6&&de.areas.length==1,'Room: redo puts it back');
{const n0=de.walls.length;DRG(700,700,720,716);ok(de.walls.length==n0,'Room: a tiny drag makes nothing')}
{ED.rws='brick';DRG(800,288,1024,480);const nw=de.walls.filter(w=>w.s=='brick'||w.s=='door').length;ok(de.walls.filter(w=>w.s=='brick').length==5,'Room: the wall style comes from the panel (brick)');edUndo();ED.rws='wall'}
// openings
edTool('door');ED.dk='window';ED.dw=40;const nw0=de.walls.length;CLK(416,288);
const win=de.walls.find(w=>w.s=='window');
ok(win&&win.w==40&&win.x==396&&de.walls.length==nw0+2,'Opening: clicking a wall puts a 40px window in it (the wall splits around it)');
ok(LAST().n=='Add window','Opening: one undo step');
ED.dk='door';CLK(416,288);ok(win.s=='door'&&de.walls.length==nw0+2,'Opening: clicking an opening with another kind changes it in place');
ED.dk='garage';CLK(416,288);ok(win.s=='garage','... a closed garage door');
ED.dk='gap';CLK(416,288);ok(!de.walls.includes(win)&&de.walls.length==nw0+1,'Opening: "Opening" on an opening removes it, leaving a gap');
{const n=de.walls.length;CLK(160,160);ok(de.walls.length==n,'Opening: a click away from walls does nothing')}
{ED.dk='rollup';ED.dw=80;CLK(291,400);const r=de.walls.find(w=>w.s=='rollup');ok(r&&r.h==80&&r.w==6,'Opening: works on side walls too (an 80px roll-up door)');ED.dw=44}
edUndo();edUndo();edUndo();edUndo();edUndo();ok(de.walls.length==6&&!de.walls.some(w=>['window','garage','rollup'].includes(w.s)),'Opening: undo puts the walls back as they were');
// interior wall
edTool('room');ED.rm='wall';ED.rauto=1;DRG(448,288,448,512);
{const iw=de.walls.slice(6);ok(iw.length==3&&iw.filter(w=>w.s=='door').length==1&&iw.every(w=>Math.abs(w.x+w.w/2-448)<1),'Interior wall: a straight drag inside a room makes a wall with a doorway in its middle');
ok(LAST().n=='Add interior wall with a doorway','Interior wall: one undo step')}
ED.rauto=0;DRG(288,400,448,400);ok(de.walls.length==10&&LAST().n=='Add interior wall','Interior wall: with "Auto doorway" off it is one plain wall');ED.rm='room';ED.rauto=1;

// ---------- areas, paths, point editing ----------
edTool('area');ED.ak='rug';DRG(320,320,416,400);
{const a=de.areas.find(x=>x.a=='rug');ok(a&&same([a.x,a.y,a.w,a.h],[320,320,96,80])&&a.ly==cmKindLy('a',a)&&LAST().n.startsWith('Place'),'Area: drag a box for a rug')}
{const n=de.areas.length;DRG(496,496,500,500);ok(de.areas.length==n,'Area: a box smaller than the piece needs makes nothing')}
ED.ak='parking';DRG(1024,96,1408,288);{const a=de.areas.find(x=>x.a=='parking');ok(a&&a.w==384&&a.o&&a.o.rows!=null,'Area: a parking lot gets its default options (stall rows)')}
edTool('path');ED.pk='road';CLK(64,704);CLK(400,640);CLK(704,720);KEY('Enter');
const road=de.paths.find(p=>p.p=='road');
ok(road&&road.x==64&&road.y==704&&same(road.pts,[[0,0],[336,-64],[640,16]])&&road.w==cmPath('road').w,'Path: clicking points then Enter draws a road through them');
ok(LAST().n.startsWith('Draw ')&&ED.sel.length==1&&ED.sel[0].o===road,'Path: one undo step, the new road is selected');
ED.pk='pond';CLK(1104,800);CLK(1296,784);CLK(1312,960);CLK(1104,800);
const pond=de.paths.find(p=>p.p=='pond');ok(pond&&pond.pts.length==3,'Path: clicking the first point again closes a shape (pond)');
ED.pk='picket';CLK(96,1008);KEY('Enter');ok(!de.paths.some(p=>p.p=='picket'),'Path: one point is not a path');
CLK(96,1008);CLK(304,1008);KEY('Backspace');CLK(192,1104);KEY('Enter');{const f=de.paths.find(p=>p.p=='picket');ok(f&&same(f.pts,[[0,0],[96,96]]),'Path: Backspace takes the last point back')}
ED.pk='trail';CLK(96,1200);CLK(304,1200);KEY('Escape');ok(!de.paths.some(p=>p.p=='trail')&&!ED.pd,'Path: Esc throws the path away');
// point handles
edTool('select');edSelect([{t:'l',o:road}]);
edDown(SX(400,640));edMove(SX(400,620));edMove(SX(400,592));edUp(SX(400,592));
ok(same(road.pts[1],[336,-112])&&LAST().n=='Move a point','Points: drag a handle of the selected path to move that point');
edUndo();ok(same(road.pts[1],[336,-64]),'Points: undo the move');
edDown(SX(64,704));edMove(SX(80,736));edUp(SX(80,736));ok(road.x==80&&road.y==736&&same(road.pts[1],[320,-96]),'Points: moving the first point keeps the others where they are');edUndo();
ok(edPtInsert(road,232,672)&&road.pts.length==4&&LAST().n=='Add a point','Points: double-click on the line adds a point there');
edPtDel(road,1);ok(road.pts.length==3&&LAST().n=='Remove a point','Points: Alt+click a point removes it');
{const p2=de.paths.find(p=>p.p=='picket');edPtDel(p2,0);ok(p2.pts.length==2,'Points: a path keeps at least two points')}
edDown(SX(704,720,1));edUp(SX(704,720));ok(road.pts.length==2,'Points: Alt+click on a handle with the mouse removes it');edUndo();ok(road.pts.length==3,'... and undo puts it back');
{const before=JSON.stringify(road.pts);edTurnPts(road,90);ok(JSON.stringify(road.pts)!=before&&road.pts.length==3,'Points: a path turns around its middle');edTurnPts(road,-90)}
// decals and effects
edTool('place');ED.asset={id:'d:oil',t:'d',k:'oil',n:'Oil'};ED.dsc=1;CLK(640,640);
const dcl=de.obj.find(o=>o.dc=='oil');ok(dcl&&dcl.x==640&&dcl.ly=='ground'&&LAST().n.includes('Oil'),'Decal: click to place an oil stain on the ground layer');
ED.dsc=1.5;CLK(704,640);{const o=de.obj.filter(o=>o.dc=='oil')[1];ok(o&&o.sc==1.5,'Decal: the size picked on the left (or [ and ]) is used for new ones')}ED.dsc=1;
edTool('select');edSelect([{t:'o',o:dcl}]);edKitPropChange('sc',{value:'250'});ok(dcl.sc==2.5,'Decal: change the size of a placed decal');
edKitPropChange('op',{value:'40'});ok(dcl.op==.4,'Decal: change its opacity');edRotate(15);edRotate(15);ok(dcl.r==30,'Decal: R turns it');
edKitPropChange('sc',{value:'100'});ok(!('sc' in dcl),'Decal: back to 100% removes the size from the file');
edTool('place');ED.asset={id:'x:fountain',t:'x',k:'fountain',n:'Fountain'};CLK(896,896);ok(de.obj.some(o=>o.fx=='fountain'&&o.ly=='effects'),'Effect: click to place a fountain on the effects layer');
ED.asset={id:'d:text',t:'d',k:'text',n:'Painted text'};CLK(960,320);{const o=de.obj[de.obj.length-1];edTool('select');edSelect([{t:'o',o}]);edKitPropChange('tx',{value:'BUS ONLY'});ok(o.tx=='BUS ONLY','Decal: painted text takes the words you type')}
// special features and the road graph
edTool('feat');ED.fk='nospawn';DRG(1200,1008,1440,1200);ok(de.feats.some(f=>f.f=='nospawn'&&f.w==240&&f.h==192&&f.ly=='features'),'Feature: drag a no-spawn zone');
ED.fk='store';DRG(800,288,1024,480);ok(de.feats.some(f=>f.f=='store'),'Feature: drag a store box (Penny)');
edTool('path');ED.pk='@graph';CLK(64,1248);CLK(400,1248);CLK(400,1104);KEY('Enter');
let G=de.feats.find(f=>f.f=='roadgraph');ok(G&&G.pts.length==3&&same(G.e,[[0,1],[1,2]]),'Road graph: click points to add roads and nodes');
CLK(400,1248);CLK(704,1248);KEY('Enter');ok(G.pts.length==4&&G.e.length==3&&G.e.filter(e=>e.includes(1)).length==3,'Road graph: a new road starting on a node joins it (the graph branches)');
edGraphBuild();ok(G.pts.length>=4&&G.e.length>=3&&G.e.every(e=>e[0]<G.pts.length&&e[1]<G.pts.length),'Road graph: "Build from road paths" follows the roads');
{const R=cmGraphFromRoads(de);ok(R.N.length>=2&&R.E.length>=1,'the road graph built from the roads has nodes and roads')}
{const pr=cmLint(de);ok(!pr.some(p=>p.lv=='err'),'the edited map has no errors in the Problems list')}
{const j=cmWrite(de),r=cmRead(JSON.stringify(j));ok(r.doc&&!r.errors.length&&same(cmWrite(r.doc),j),'everything made with the kit tools saves and loads unchanged')}
// the left panel tabs list every piece
{const H=(t,tool)=>{ED.tab=t;ED.tool=tool||'select';return edKitLeft(t)||''};const hb=H('build','door'),hp=H('paths','path'),hd=H('decals'),hm=H('markers','feat');edTool('select');
ok(CMDEC.every(t=>hd.includes('dc:'+t.id))&&CMFX.every(t=>hd.includes('fx:'+t.id)),'the Decals tab lists every decal and effect');
ok(CMPA.every(t=>hp.includes(edEsc(t.n))),'the Paths tab lists every road, path, fence and shape');
ok(EDOPEN.every(o=>hb.includes(edEsc(o[1])))&&EDROOMW.every(s=>CMWI[s]),'the Build tab lists every opening, and the room wall styles are real');
ok(CMFEAT.every(f=>hm.includes(edEsc(f.n))),'the Markers tab lists every special feature');
ED.tab='prefabs';const hf=edPfLeft();ok(CMPFS.every(p=>hf.includes('pf:'+p.id)),'the Prefabs tab lists every starter prefab')}

// ---------- prefabs ----------
{edSelect([]);const w0=de.walls.slice(0,6),fl0=de.areas.find(a=>a.a=='floor'),rug=de.areas.find(a=>a.a=='rug');
for(let ty=9;ty<=16;ty++)for(let tx=9;tx<=19;tx++)de.ter[ty*de.w+tx]=cmPi(de,'wood');
const sofa={id:'sofa1',k:'sofa3',x:352,y:448,r:0,c:'#4a7a4a',ly:'interior'};de.obj.push(sofa);
const S=[...w0.map(o=>({t:'w',o})),{t:'a',o:fl0},{t:'a',o:rug},{t:'o',o:sofa}];
const P=edPfFrom(S,'Test <room>','Rooms',true);
ok(P&&P.n=='Test room'&&P.cat=='Rooms'&&P.items.length==S.length,'Prefab: the selection becomes a prefab with a name and group');
ok(P.items.every(it=>it.o.x>=0&&it.o.y>=0&&it.o.x<=P.w&&it.o.y<=P.h&&!('id' in it.o)),'Prefab: things are kept from its top-left corner, without ids');
ok(P.tiles&&P.tiles.ter&&P.tiles.ter.rows.length==P.tiles.th&&P.tiles.ter.rows.some(r=>/[^.]/.test(r))&&Object.values(P.tiles.ter.legend).includes('wood'),'Prefab: with "Include the ground" it keeps the terrain under it');
{const Q=edPfFrom(S,'No ground','Nope',false);ok(Q&&!Q.tiles&&Q.cat=='Other','Prefab: without the ground no tiles are kept; an unknown group becomes Other')}
edPfAdd(P);ok(EDPF.includes(P)&&ED.tool=='prefab'&&ED.pf===P,'Prefab: saving it picks it for placing');
await edPfSave();{const r=await msGet('kv','prefabs');ok(r&&Array.isArray(r.list)&&r.list.some(p=>p.id==P.id),'Prefab: your prefabs are stored on the device')}
const nW=de.walls.length,nA=de.areas.length,nO=de.obj.length,u0=EDH.u.length;
CLK(1200,1000);
const addW=de.walls.slice(nW),addA=de.areas.slice(nA),addO=de.obj.slice(nO);
ok(addW.length==6&&addA.length==2&&addO.length==1&&EDH.u.length==u0+1&&LAST().n=='Place Test room','Prefab: a click places every piece of it, as one undo step');
ok(addW.every(w=>!w0.some(q=>q.id==w.id))&&addO[0].id!='sofa1'&&addO[0].c=='#4a7a4a'&&addO[0].k=='sofa3','Prefab: placed things are new, ordinary things with their own ids (colours kept)');
{const dx=addA.find(a=>a.a=='floor').x-fl0.x,dy=addA.find(a=>a.a=='floor').y-fl0.y;ok(dx%32==0&&dy%32==0&&addO[0].x-sofa.x==dx&&addO[0].y-sofa.y==dy,'Prefab: everything keeps its place in the prefab; prefabs with ground snap to whole tiles');
ok(de.ter[(9+dy/32)*de.w+(10+dx/32)]===cmPi(de,'wood'),'Prefab: the ground under it is painted too')}
{const px=P.items.find(it=>it.t=='o').o.x;addO[0].x+=50;addO[0].c='#c0392b';ok(P.items.find(it=>it.t=='o').o.x==px&&P.items.find(it=>it.t=='o').o.c=='#4a7a4a'&&!P.items.some(it=>it.o===addO[0]),'Prefab: changing a placed piece does not change the prefab')}
{const tw=de.ter.slice();edUndo();ok(de.walls.length==nW&&de.areas.length==nA&&de.obj.length==nO,'Prefab: undo takes the placed prefab away');ok(Array.from(de.ter).filter(v=>v===cmPi(de,'wood')).length==88,'... and the ground it painted');edRedo();ok(de.walls.length==nW+6&&same(Array.from(de.ter),Array.from(tw)),'... redo puts both back')}
// every starter prefab is real and places cleanly
ok(CMPFS.length>=20&&EDPFCAT.every(c=>c=='Other'||c=='Vehicles'||CMPFS.some(p=>p.cat==c)),'starter prefabs: '+CMPFS.length+' of them, in the Rooms, Buildings, Street, Outdoors and Spooky groups');
{const known=it=>{const o=it.o;if(it.t=='w')return !!CMWI[o.s];if(it.t=='a')return !!cmArea(o.a);if(it.t=='l')return !!cmPath(o.p);if(it.t=='f')return !!cmFeat(o.f);if(it.t=='o')return o.dc?!!cmDec(o.dc):o.fx?!!cmFx(o.fx):o.veh?!!cmHW(o.veh):!!cmOB(o.k);return it.t=='s'||it.t=='z'};
const badK=[];for(const p of CMPFS)for(const it of p.items)if(!known(it))badK.push(p.id+':'+(it.o.k||it.o.s||it.o.a||it.o.p||it.o.dc||it.o.fx||it.o.veh));
ok(!badK.length,'starter prefabs use only real pieces '+badK.slice(0,5).join(', '));
ok(CMPFS.every(p=>p.id&&p.n&&p.w>0&&p.h>0&&p.items.length&&p.items.every(it=>it.o.x>=-40&&it.o.y>=-80&&it.o.x<=p.w+40&&it.o.y<=p.h+40)),'starter prefabs have names, sizes, and their pieces inside them');
const ids=CMPFS.map(p=>p.id);ok(new Set(ids).size==ids.length&&['s_living','s_familyhouse','s_cornerstore','s_gasstation','s_carrow','s_crash','s_campsite'].every(i=>ids.includes(i)),'starter prefabs include rooms, houses, shops, a gas station, a parked car row, a crash scene and a campsite');
const bad2=[];for(const p of CMPFS){const d=cmNew({name:'PF',w:60,h:50});d.start={x:80,y:80};openEd(d);edTool('prefab',1);ED.pf=p;CLK(960,800);const all=d.walls.length+d.obj.length+d.areas.length+d.paths.length+d.feats.length+d.spawns.length+d.zones.length;
const er=cmLint(d).filter(q=>q.lv=='err'||q.lv=='warn'&&/not found|missing|unknown/i.test(q.m));if(all!=p.items.length||er.length)bad2.push(p.id+' ('+all+'/'+p.items.length+(er.length?', '+er[0].m:'')+')');
const j=cmWrite(d),r=cmRead(JSON.stringify(j));if(!r.doc||r.errors.length)bad2.push(p.id+' does not reload')}
ok(!bad2.length,'every starter prefab places all its pieces with no problems, and the result saves and loads '+bad2.slice(0,4).join('; '))}
edClose(1)}

// ---------- effects and special features in the game ----------
{const d=cmNew({name:'Systems',w:50,h:40,ground:'grass'});
d.obj.push(LY('o',{id:'e1',fx:'fountain',x:400,y:400}),LY('o',{id:'e2',fx:'fire',x:500,y:400}),LY('o',{id:'e3',fx:'smoke',x:600,y:400}),LY('o',{id:'e4',fx:'flicker',x:700,y:400}),LY('o',{id:'e5',fx:'wisp',x:800,y:400}),LY('o',{id:'e6',fx:'siren',x:900,y:400}),LY('o',{id:'e7',fx:'light',x:1000,y:400}));
d.obj.push(LY('o',{id:'g1',k:'gshelf',x:300,y:900,r:0}),LY('o',{id:'g2',k:'gshelf',x:450,y:900,r:0}),LY('o',{id:'g3',k:'gshelf',x:1300,y:900,r:0}),LY('o',{id:'c1',k:'corral',x:700,y:1100,r:0}),LY('o',{id:'t1',k:'stree',x:1200,y:300,r:0}));
d.areas.push(LY('a',{id:'fl',a:'floor',x:200,y:800,w:400,h:200,o:{pt:'wood',in:1}}),LY('a',{id:'fo',a:'floor',x:1000,y:800,w:200,h:200,o:{pt:'wood',in:0}}),LY('a',{id:'fg',a:'fog',x:0,y:0,w:400,h:300}),LY('a',{id:'dk',a:'dark',x:1300,y:900,w:200,h:200}));
d.feats.push({id:'n1',f:'nospawn',x:1300,y:100,w:200,h:200,ly:'features'},{id:'h1',f:'house',x:1300,y:600,w:150,h:120,ly:'features'},{id:'s1',f:'store',x:150,y:750,w:500,h:300,ly:'features'},{id:'ch',f:'cityhall',x:900,y:1000,w:300,h:200,ly:'features'},
{id:'rg',f:'roadgraph',x:100,y:1200,pts:[[0,0],[600,0],[600,-400],[1200,0]],e:[[0,1],[1,2],[1,3]],ly:'features'});
d.spawns.push({id:'sa',x:1400,y:200,on:true,ly:'spawns'},{id:'sb',x:100,y:100,on:true,ly:'spawns'});d.start={x:800,y:700};
openEd(d);ptStart({ci:0,w:1,dif:0});ok(mode=='play'&&mapId===CMPTK,'a map with every effect and feature plays');
const C=HS.CX,fxA=k=>C&&C.A.some(it=>it.o.fx==k);
ok(fxA('fountain')&&fxA('fire')&&fxA('flicker')&&fxA('siren')&&!fxA('light'),'animated effects (fountain, fire, flickering light, siren) are animated by the game; still lights are baked in');
ok(C.T.some(it=>it.o.fx=='wisp')&&C.A.concat(C.T).some(it=>it.a&&it.o.a=='fog'),'fog and wisps are drawn over the players');
ok(SM.length==1&&SM[0].x==600&&SM[0].y==400,'smoke effects become the game smoke (as on the built-in maps)');
ok(HS.NS&&HS.NS.length==1&&HS.nx0==1300&&HS.ny1==300&&NOGO.length==1,'No-spawn zone: the game keeps zombies from appearing in it');
{let inNS=0;for(let i=0;i<40;i++){const q=cmSpawnAt(400);if(q[0]>1300&&q[0]<1500&&q[1]>100&&q[1]<300)inNS++}ok(!inNS,'... spawn points inside it are skipped')}
ok(HS.HO&&HS.HO.length==2&&HS.HO.some(h=>h.x==1300&&h.w==150)&&HS.HO.some(h=>h.x==200&&h.w==400),'Building interiors: the features and indoor floors (not outdoor ones) are the boss "inside" boxes');
ok(same(HS.ST,[150,750,650,1050])&&HS.SHF.length==2&&HS.CRL.length==1,'Store: Penny gets the store box, the grocery shelves inside it and the cart corrals');
ok(HS.CH&&HS.CH.x==1050&&HS.CH.y==1040&&HS.CH.rw==300,'City Hall roof: the Mayor watches from the top middle');
ok(HS.RG&&HS.RG.N.length==4&&HS.RG.A[1].length==3&&same(HS.RG.N[2],[700,800]),'Boss road graph: nodes and roads for the truck bosses');
ok(HS.TRK&&HS.TRK.length==1,'street trees stop the fire hose, as on Downtown');
let er='';try{for(let f=0;f<240&&mode=='play';f++){P.hp=P.mx=99;tick(1)}}catch(e){er=e.message}ok(!er&&mode=='play','the effects animate while playing without errors '+er);
ptEnd();edClose(1)}

// ---------- the validator: node tools/check-map.js ----------
{const tmp=FS.mkdtempSync(PATH.join(OS.tmpdir(),'zdmap-')),run=(...a)=>CP.spawnSync(process.execPath,[CHECK,...a],{encoding:'utf8'});
const demo=PATH.join(ROOT,'src','maps','samples','town-block.zombdash-map.json');
let r=run(demo);ok(r.status===0&&/no problems found/.test(r.stdout),'validator: the demo map passes ('+(r.stdout||'').split('\\n')[1]+')');
const good=JSON.parse(FS.readFileSync(demo,'utf8'));
const w=(n,j)=>{const f=PATH.join(tmp,n);FS.writeFileSync(f,typeof j=='string'?j:JSON.stringify(j));return f};
{const j=JSON.parse(JSON.stringify(good));j.terrain.rows[2]=j.terrain.rows[2].slice(3);r=run(w('short.json',j));ok(r.status===1&&/error:.*rows\\[2\\]/.test(r.stdout),'validator: a broken terrain row is an error (exit code 1)')}
r=run(w('notjson.json','{oops'));ok(r.status===1&&/error/.test(r.stdout),'validator: a file that is not JSON is an error');
{const j=JSON.parse(JSON.stringify(good));j.props.push({kind:'flying_saucer',x:100,y:100});j.decals.push({kind:'oil',x:50,y:50,options:{x:1}});j.areas.push({kind:'parking',x:10,y:10,w:20,h:20,color:'red'});j.effects.push({kind:'fountain',x:10,y:10,options:{bogus:1}});j.paths.push({kind:'road',points:[[0,0],[100,0]],width:2000});
r=run(w('warn.json',j));const o=r.stdout;ok(r.status===0&&/warning:.*flying_saucer/.test(o),'validator: a missing prop is a warning (the map still loads, exit code 0)');
ok(/has no options/.test(o)&&/not a #rrggbb colour/.test(o)&&/needs at least/.test(o)&&/not an option of/.test(o)&&/width/.test(o),'validator: decal options, bad colours, too-small areas, out-of-range options and odd path widths are reported');
r=run('--strict',w('warn2.json',j));ok(r.status===1,'validator: --strict counts warnings as errors');
r=run('--json',demo,w('warn3.json',j));let J=null;try{J=JSON.parse(r.stdout)}catch(e){}ok(J&&J.length==2&&!J[0].errors.length&&J[1].warnings.length>=5&&J[0].summary.includes('64×48'),'validator: --json gives the results of every file')}
{const j=JSON.parse(JSON.stringify(good));j.version=2;j.layers=j.layers.filter(l=>!['ground','effects','features'].includes(l.id));for(const k of['decals','effects','areas','paths','features'])delete j[k];for(const s of['props','vehicles','walls'])j[s]=j[s].filter(p=>!['ground','effects','features'].includes(p.layer));
const f=PATH.join(FS.mkdtempSync(PATH.join(OS.tmpdir(),'zdmap-')),'v2.json');FS.writeFileSync(f,JSON.stringify(j));const r=CP.spawnSync(process.execPath,[CHECK,f],{encoding:'utf8'});ok(r.status===0&&/upgraded to 3 on load/.test(r.stdout),'validator: version 2 files are checked as the game upgrades them')}}

// the complete example in docs/map-format.md stays correct
{const md=FS.readFileSync(PATH.join(ROOT,'docs','map-format.md'),'utf8');const F3=String.fromCharCode(96).repeat(3),i=md.indexOf('<!-- example map: start -->'),a=md.indexOf(F3+'json\\n',i)+F3.length+5,b=md.indexOf('\\n'+F3,a);let r=null;try{r=cmRead(md.slice(a,b))}catch(e){}
ok(i>0&&r&&r.doc&&!r.errors.length&&!r.warnings.length&&!cmLint(r.doc).some(p=>p.lv!='note'),'the complete example in docs/map-format.md loads with no problems '+(r?r.errors.concat(r.warnings).slice(0,2).join('; '):''));
ok(r&&r.doc&&r.doc.areas.length&&r.doc.paths.length&&r.doc.obj.some(o=>o.dc)&&r.doc.obj.some(o=>o.fx)&&r.doc.feats.length,'... and uses every kind of kit piece')}
// ---------- the demo map (Workshop sample) ----------
ok(Array.isArray(CMSAMPLES)&&CMSAMPLES.length>=1&&CMSAMPLES[0].format=='zombdash-map','the Workshop ships the kit demo as a sample map');
const DJ=CMSAMPLES[0],DR=cmRead(JSON.stringify(DJ)),DD=DR.doc;
ok(DD&&!DR.errors.length&&!DR.warnings.length,'demo map: loads with no errors or warnings ('+DR.errors.concat(DR.warnings).slice(0,2).join('; ')+')');
ok(DD&&!cmLint(DD).some(p=>p.lv=='err'||p.lv=='warn'),'demo map: nothing in the Problems list (zombies can reach the player from every spawn) '+(DD?cmLint(DD).filter(p=>p.lv!='note').map(p=>p.m).slice(0,2).join('; '):''));
{const S_=s=>DD.walls.filter(w=>w.s==s).length,A_=a=>DD.areas.filter(x=>x.a==a).length,P_=p=>DD.paths.filter(x=>x.p==p).length,O_=k=>DD.obj.filter(o=>o.k==k).length,F_=f=>DD.obj.filter(o=>o.fx==f).length;
ok(A_('floor')>=6&&S_('door')>=3&&S_('window')>=2&&O_('sofa3')==1&&O_('bed')==1&&O_('kfridge')==1&&O_('tub')==1,'demo map: a furnished house (rooms with floors, doorways, windows, furniture)');
ok(DD.feats.some(f=>f.f=='store')&&O_('gshelf')==4&&S_('glass')>=1&&S_('autodoor')==1&&O_('awning')==1,'demo map: a shop (glass front, automatic doors, shelves, awning, store feature)');
ok(P_('road')>=2&&A_('junction')>=1&&A_('parking')>=2&&DD.feats.some(f=>f.f=='roadgraph'),'demo map: roads with an intersection, a parking lot, and a boss road graph');
ok(DD.obj.filter(o=>o.dc).length>=30&&DD.obj.filter(o=>o.fx).length>=10&&F_('fountain')>=1&&(F_('fire')+F_('smoke'))>=1,'demo map: decals and effects (fountain, fire and smoke)');
{const r=cmRead(JSON.stringify(cmWrite(DD)));ok(r.doc&&same(cmWrite(r.doc),cmWrite(DD)),'demo map: saves and loads unchanged')}}
{const h=wsSamples();ok(h.includes(edEsc(DJ.name))&&h.includes('wsSample(0'),'demo map: listed under Sample maps in the Workshop')}
await wsSample(0,0);const de2=CML.find(e=>e.doc&&e.doc.name==DD.name);
ok(de2&&de2.doc.obj.length==DD.obj.length&&de2.doc.areas.length==DD.areas.length&&de2.doc.id!=DD.id,'demo map: "Add to my maps" stores a copy you can edit and play');
setGM('f');mapId=de2.key;build();ok(WW==DD.w*32&&WH==DD.h*32&&WL.length>300&&HS.RG&&HS.SHF.length==4&&HS.CX&&SM.length>=1&&HS.HO.length>=5,'demo map: builds in Free Play with collision, the road graph, store shelves, effects and smoke');
openEd(cmClone(de2.doc));ptStart({ci:0,w:1,dif:1});
{let er='';try{for(let f=0;f<500&&mode=='play';f++){P.hp=P.mx=99;tick(1)}}catch(e){er=e.message}ok(!er&&zs.length>0,'demo map: playtest runs and zombies arrive '+er)}
{const hw=DD.walls.filter(w=>w.s=='siding'||w.s=='wall');ok(hw.length&&hw.every(w=>WL.some(b=>b[0]<=w.x+1&&b[1]<=w.y+1&&b[0]+b[2]>=w.x+w.w-1&&b[1]+b[3]>=w.y+w.h-1)),'demo map: the house walls are solid in the game')}
ptEnd();edClose(1);

// ---------- the asset browser: every prop and vehicle of the built-in maps ----------
{const L_=edAssets();
ok(Object.keys(OB).every(k=>OWN(EDPN,k)&&EDPN[k][0]&&EDCAT.some(c=>c[0]==EDPN[k][1])),'every prop in OB has a clear name and a category ('+Object.keys(OB).filter(k=>!OWN(EDPN,k)).slice(0,5).join(',')+')');
ok(L_.filter(a=>a.t=='p').length==Object.keys(OB).length&&Object.keys(EDVN).every(k=>HWV(k)&&L_.some(a=>a.id=='v:'+k)),'the asset browser lists every prop and every vehicle');
const used={},_put=put,_sc=scatter;put=function(A,k){used[k]=1;return _put.apply(this,arguments)};scatter=function(){const r=_sc.apply(this,arguments);for(const o of r||[])used[o.kn||o.k]=1;return r};
try{for(let m=0;m<MP.length;m++){mapId=m;build()}}finally{put=_put;scatter=_sc}
const miss=Object.keys(used).filter(k=>OB[k]&&!OWN(EDPN,k));ok(Object.keys(used).length>100&&!miss.length,'every prop placed on the 16 built-in maps is in the asset browser ('+Object.keys(used).length+' kinds) '+miss.join(','));
const kitP=[...FS.readFileSync(PATH.join(ROOT,'src','js','maps','props','kit-props.js'),'utf8').matchAll(/^([a-z][a-z_0-9]*):(?:Object\\.assign|ob[a-z]*\\(|\\{)/gm)].map(x=>x[1]);ok(kitP.length>=40&&kitP.every(k=>OB[k]&&OWN(EDPN,k)),'props that the built-in maps drew in their own code are now real props ('+kitP.length+')');
vehWrap();const wb=Object.keys(OB).filter(k=>OB[k].wb);ok(wb.length>=10&&wb.every(k=>OB[k].vw),'tall kit props (street lamps, signs, trees...) draw in front of players walking behind them');
mapId=0;build()}
console.log('TOTAL fails '+fails+' of '+n);
}
`;
const AF=Object.getPrototypeOf(async function(){}).constructor;
new AF('docL','ivs',code+test)(docL,ivs).catch(e=>{console.log('FAIL crashed: '+(e&&e.stack||e));console.log('TOTAL fails 1');process.exitCode=1});
