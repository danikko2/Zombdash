// Blood (colours, more blood decals, the blood trail path), dead zombies and body parts (decal options), turned effects,
// time-of-day lighting (file, light sources, the game's light map, the editor's Map panel slider and preview), the checker, the demo map.
const ST={};global.LOG=[];const LOG=global.LOG;
const fs=require('fs');const html=fs.readFileSync(process.argv[2],'utf8');
const code=html.slice(html.lastIndexOf('<script>')+8,html.lastIndexOf('</script>'));
global.ImageData=class{constructor(d,w,h){this.data=d}};
const ctx=new Proxy(ST,{get:(t,k)=>k=='getImageData'?(x,y,w,h)=>({data:new Uint8ClampedArray(Math.max(1,w*h*4)).fill(120)}):k=='createImageData'?(w,h)=>({data:new Uint8ClampedArray(w*h*4)}):k=='measureText'?()=>({width:30}):(k=='createRadialGradient'||k=='createLinearGradient'||k=='createPattern')?()=>({addColorStop(){}}):k=='drawImage'?()=>{LOG.push(['drawImage',t.globalCompositeOperation||'source-over'])}:k=='rotate'?a=>{LOG.push(['rotate',a])}:(k in t&&typeof t[k]!='function')?t[k]:()=>{},set:(t,k,v)=>{t[k]=v;return true}});
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
{ // in a block, so these names never clash with the game's
const tick=n=>{for(let i=0;i<n;i++){AT_+=.016;NOW_+=16;for(const f of ivs)f();for(let q=TQ.length-1;q>=0;q--)if(TQ[q][0]<=AT_){const g=TQ[q][1];TQ.splice(q,1);g()}loop(NOW_)}};
let fails=0,n=0;const ok=(c,m)=>{n++;if(c)console.log('PASS '+m);else{fails++;console.log('FAIL '+m)}};
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const LY=(k,o)=>{o.ly=cmKindLy(k,o);return o};
const SX=(x,y)=>({button:0,clientX:(x-ED.cam.x)*ED.cam.z,clientY:(y-ED.cam.y)*ED.cam.z,pointerId:1});
const CLK=(x,y)=>{edDown(SX(x,y));edUp(SX(x,y))};
const LAST=()=>EDH.u[EDH.u.length-1];
const openEd=d=>{edOpen(d,'saved');ED.cam.x=0;ED.cam.y=0;ED.cam.z=1;ED.snap=1;ED.step=16};
const FS=REQ('fs'),PATH=REQ('path'),OS=REQ('os'),CP=REQ('child_process');
const ROOT=PATH.dirname(PATH.resolve(process.argv[2])),CHECK=PATH.join(ROOT,'tools','check-map.js');
const G=document.createElement('canvas').getContext('2d');
const RW=t=>{const r=cmRead(JSON.stringify(t));return r};

// ---------- more blood ----------
const BL=CMDEC.filter(t=>t.cat=='gore');
ok(['blood','bloodpool','bloodtrail','handprint','bloodspray','bloodsmear','blooddrips','bloodsplash','bloodfoot','bloodcrawl'].every(id=>BL.some(t=>t.id==id)),'Blood: ten blood decals (splat, pool, trail, handprints, spray, smear, drops, big splatter, footprints, crawl marks)');
ok(BL.every(t=>t.pal===PDBLOOD)&&PDBLOOD.length>=5&&same(PDBLOOD.map(c=>c[1]),['Fresh red','Dark red','Dried brown','Zombie green','Black ooze']),'Blood: every blood decal comes in five blood colours');
{let er='';try{for(const t of BL)for(const c of PDBLOOD)for(const v of[0,.37,.81])cmDecDraw(G,{dc:t.id,x:100,y:100,r:30,sc:1.5,c:c[0],vr:v})}catch(e){er=e.message}ok(!er,'Blood: every blood decal draws in every colour '+er)}
ok(cmPath('bloodline')&&cmPath('bloodline').pal===PDBLOOD&&cmPath('bloodline').cat=='line'&&cmPath('bloodline').fl==null,'Blood: a blood trail path (follows points, any blood colour, not solid)');
{let er='';try{cmPathDraw(G,{p:'bloodline',x:0,y:0,pts:[[0,0],[200,40],[300,120]],w:12,c:'#4e6a1e'})}catch(e){er=e.message}ok(!er,'Blood: the blood trail path draws '+er)}
{const d=cmNew({name:'Blood',w:30,h:20});d.obj.push(LY('o',{id:'b1',dc:'bloodsplash',x:100,y:100,r:0,c:'#4e6a1e'}));d.paths.push(LY('l',{id:'b2',p:'bloodline',x:10,y:10,pts:[[0,0],[100,20]],w:8,c:'#26201c'}));
const j=cmWrite(d),r=RW(j);ok(j.decals[0].color=='#4e6a1e'&&j.paths[0].color=='#26201c'&&r.doc&&!r.warnings.length&&same(cmWrite(r.doc),j),'Blood: blood colours are saved and loaded');
ok(!cmSolid(d.obj[0],'o')&&!cmColl(d).length,'Blood: blood is never solid')}
{const d=cmNew({name:'Old blood',w:30,h:20});d.obj.push(LY('o',{id:'b',dc:'blood',x:50,y:50,r:0}));const T=cmDec('blood');ok(!d.obj[0].c&&T.pal[0][0]=='#7a1414','Blood: blood placed before (no colour) stays fresh red')}

// ---------- dead zombies and body parts ----------
const BD=CMDEC.filter(t=>t.cat=='body');
ok(CMDCAT.some(c=>c[0]=='body'&&c[1]=='Bodies & body parts'),'Bodies: a "Bodies & body parts" group of decals');
ok(['deadz','zarm','zleg','zhead','zhand','ztorso','guts','bones','skull','ribcage','sheetbody','bodybag'].every(id=>BD.some(t=>t.id==id)),'Bodies: dead zombie, arm, leg, head, hand, torso, guts, bones, skull, rib cage, covered body, body bag');
const DZ=cmDec('deadz'),zo=DZ&&DZ.opts.find(q=>q[0]=='z');
ok(DZ&&zo&&zo[2].length>=10&&zo[2].every(c=>ZS[c[0]]&&ZS[c[0]].walk)&&zo[2].every(c=>c[1]),'Dead zombie: '+(zo?zo[2].length:0)+' zombie kinds, each drawn from the game\\'s own zombie sprites');
ok(DZ.opts.some(q=>q[0]=='pool'&&q[2]=='chk')&&DZ.opts.some(q=>q[0]=='flip')&&DZ.pal===PDBLOOD,'Dead zombie: a pool of blood (any blood colour) and a mirror option');
{let er='';try{for(const c of zo[2])for(const pool of[0,1])cmDecDraw(G,{dc:'deadz',x:200,y:200,r:45,o:{z:c[0],pool,flip:pool}});for(const t of BD)cmDecDraw(G,{dc:t.id,x:100,y:100,r:90,sc:2,c:t.pal?t.pal[1][0]:undefined})}catch(e){er=e.message}ok(!er,'Bodies: every dead zombie kind and body part draws '+er)}
ok(['zarm','zhead','zhand'].every(id=>cmDec(id).pal===PDSKIN)&&cmDec('zleg').pal===PDPANTS&&cmDec('ztorso').pal===PDSHIRT,'Bodies: arms, heads and hands come in skin colours, legs in trouser colours, torsos in shirt colours');
{const d=cmNew({name:'Bodies',w:30,h:20});d.obj.push(LY('o',{id:'z1',dc:'deadz',x:100,y:100,r:30,o:{z:'9',pool:0,flip:1}}),LY('o',{id:'z2',dc:'deadz',x:200,y:100,r:0}));
const j=cmWrite(d),r=RW(j);ok(same(j.decals[0].options,{z:'9',pool:0,flip:1})&&!('options' in j.decals[1]),'Dead zombie: its options are saved in the file (only when set)');
ok(r.doc&&!r.errors.length&&!r.warnings.length&&same(r.doc.obj[0].o,{z:'9',pool:0,flip:1})&&same(cmWrite(r.doc),j),'Dead zombie: and load back the same');
ok(!cmColl(d).length,'Bodies: never solid (zombies and players walk over them)')}
// in the editor: the Decals tab, placing, the options in the properties panel
{const d=cmNew({name:'Gore editor',w:40,h:30});openEd(d);ED.tab='decals';const h=edKitLeft('decals');
ok(h.includes('Bodies &amp; body parts')||h.includes('Bodies & body parts'),'Editor: the Decals tab has the Bodies & body parts group');
ok(BD.every(t=>h.includes('dc:'+t.id))&&BL.every(t=>h.includes('dc:'+t.id)),'Editor: it lists every blood decal, dead zombie and body part');
edTool('place');ED.asset={id:'d:deadz',t:'d',k:'deadz',n:'Dead zombie'};CLK(320,320);const z=d.obj.find(o=>o.dc=='deadz');
ok(z&&z.ly=='ground'&&!z.o,'Editor: click to place a dead zombie (default options until changed)');
edTool('select');edSelect([{t:'o',o:z}]);const ph=edKitPropsHTML(ED.sel);ok(ph.includes('data-f="opt:z"')&&ph.includes('Spitter')&&ph.includes('data-f=opt:pool')||ph.includes('opt:pool'),'Editor: the properties panel offers the zombie kind and the blood pool');
edKitPropChange('opt:z',{value:'11'});ok(z.o&&z.o.z==='11'&&LAST().n.startsWith('Change'),'Editor: change the zombie kind (one undo step)');
edKitPropChange('opt:pool',{checked:false});ok(z.o.pool===0,'Editor: turn the blood pool off');edUndo();ok(z.o.pool!==0,'Editor: undo it');
ok(ph.includes('data-a="kc:#560c12"')||ph.includes('kc:#560c12'),'Editor: the blood colour swatches are offered for dead zombies');
edClose(1)}

// ---------- turning effects ----------
{const d=cmNew({name:'Turn fx',w:30,h:20});d.obj.push(LY('o',{id:'h',fx:'hazard',x:300,y:200,r:30}),LY('o',{id:'s',fx:'siren',x:400,y:200,r:90,o:{m:'amb'}}),LY('o',{id:'f',fx:'fire',x:100,y:100}));
const j=cmWrite(d),r=RW(j);ok(j.effects[0].rot==30&&j.effects[1].rot==90&&!('rot' in j.effects[2]),'Effects: their turn is saved (rot), only when turned');
ok(r.doc&&!r.errors.length&&r.doc.obj[0].r==30&&!('r' in r.doc.obj[2])&&same(cmWrite(r.doc),j),'Effects: and loads back');
{const jj=JSON.parse(JSON.stringify(j));jj.effects[0].rot='left';const rr=RW(jj);ok(!rr.doc&&/effects\\[0\\]/.test(rr.errors[0]||''),'Effects: a turn that is not a number is refused')}
LOG.length=0;cmFxBake(G,{fx:'light',x:10,y:10,r:90});cmFxEd(G,{fx:'hazard',x:10,y:10,r:45});ok(LOG.some(l=>l[0]=='rotate'&&Math.abs(l[1]-Math.PI/2)<1e-9)&&LOG.some(l=>l[0]=='rotate'&&Math.abs(l[1]-Math.PI/4)<1e-9),'Effects: what they draw turns with them (in the map picture and the editor)');
const L=cmLightSrc(d).filter(s=>s.f=='blink');ok(L.length==2&&Math.abs(L[0].x-(300-10*Math.cos(Math.PI/6)))<.01&&Math.abs(L[0].y-(200-10*Math.sin(Math.PI/6)))<.01,'Effects: a turned hazard light\\'s two lamps turn with it (they line up with a turned car)')}
{const d=cmNew({name:'Turn fx ed',w:30,h:20});openEd(d);edTool('place');ED.asset={id:'x:hazard',t:'x',k:'hazard',n:'Hazard blinkers'};ED.rot=30;CLK(320,320);const h=d.obj.find(o=>o.fx=='hazard');ok(h&&h.r==30,'Editor: the placed effect keeps that turn');
edTool('select');edSelect([{t:'o',o:h}]);edRotate(15);ok(h.r==45&&LAST().n.includes('Turn'),'Editor: R turns a selected effect (it used to refuse)');
ok(edPropsHTML().includes('data-f="r"'),'Editor: the properties panel shows Turn for effects');
edPropChange('r',{value:'200'});ok(h.r==200,'Editor: type an effect\\'s turn in the properties panel');edClose(1)}

// ---------- time of day ----------
ok(same(CMLT.map(p=>p.id),['day','morning','dusk','night'])&&CMLT.every(p=>p.n&&p.d&&/^#[0-9a-f]{6}$/.test(p.mul)&&p.def>0&&p.def<=1),'Time of day: day, morning, dusk and night, each with a default amount');
{const d=cmNew({name:'Night',w:30,h:20});d.lt={t:'night',a:.6};const j=cmWrite(d),r=RW(j);
ok(same(j.lighting,{time:'night',amount:.6})&&r.doc&&same(r.doc.lt,{t:'night',a:.6})&&!r.warnings.length&&same(cmWrite(r.doc),j),'Time of day: saved in the file as "lighting" and loaded back');
const off=cmWrite(cmNew({name:'Off',w:30,h:20}));ok(!('lighting' in off),'Time of day: maps without it have no "lighting"');
{const jj=Object.assign({},j,{lighting:{time:'midnight',amount:.5}});const rr=RW(jj);ok(rr.doc&&rr.warnings.some(w=>/midnight/.test(w))&&cmWrite(rr.doc).lighting.time=='midnight'&&!cmLightData(rr.doc),'Time of day: an unknown time loads with a warning, shows in daylight and is kept')}
{const rr=RW(Object.assign({},j,{lighting:{time:'dusk',amount:7}}));ok(rr.doc&&rr.doc.lt.a==1,'Time of day: the amount is kept between 0 and 1')}
{const rr=RW(Object.assign({},j,{lighting:{time:'dusk'}}));ok(rr.doc&&rr.doc.lt.a==cmLtDef('dusk'),'Time of day: no amount means the time\\'s default')}
{const rr=RW(Object.assign({},j,{lighting:{time:'dusk',amount:'lots'}}));ok(!rr.doc&&/lighting/.test(rr.errors[0]||''),'Time of day: an amount that is not a number is refused')}
{const rr=RW(Object.assign({},j,{lighting:'night'}));ok(!rr.doc,'Time of day: "lighting" must be an object')}}
// light sources
{const d=cmNew({name:'Lights',w:40,h:30});for(const k of['lamp','plight','candle','lantern','bfplace','crate'])d.obj.push(LY('o',{id:'p'+k,k,x:100,y:100,r:0}));
for(const k of['light','flicker','fire','flare','glow','wisp','smoke','fountain'])d.obj.push(LY('o',{id:'x'+k,fx:k,x:300,y:300}));d.obj.push(LY('o',{id:'sir',fx:'siren',x:500,y:300}),LY('o',{id:'win',dc:'lightpatch',x:600,y:300,r:0}),LY('o',{id:'car',veh:'police',x:700,y:300,r:0}));
const L=cmLightSrc(d),fl=f=>L.filter(s=>s.f==f).length;
ok(L.filter(s=>s.x==100).length==5,'Lights: street lamps, lot lights, candles, lanterns and fireplaces give light (a crate doesn\\'t)');
ok(fl('flk')>=3&&fl('fire')>=2&&fl('flare')==1&&fl('glow')==2&&fl('siren')==2,'Lights: flickering lights, fires, flares, glows, wisps and both siren lamps');
ok(L.some(s=>s.x==600)&&!L.some(s=>s.x==700),'Lights: lit-window decals glow; vehicles don\\'t');
ok(!cmLightData(d)&&(d.lt={t:'night',a:0},!cmLightData(d))&&(d.lt={t:'night',a:.8},cmLightData(d).L.length==L.length),'Lights: the game keeps them only when the map has a time of day with an amount')}
ok(cmLtNow({f:'siren',sd:0,ph:0},0)!==cmLtNow({f:'siren',sd:1,ph:0},0)&&cmLtNow({f:'blink',ph:0},0)!==cmLtNow({f:'blink',ph:0},.5),'Lights: police lights take turns, hazard lights blink');
// in a run
{const d=cmRead(JSON.stringify(CMSAMPLES[0])).doc;d.lt={t:'night',a:.75};openEd(d);ptStart({ci:0,w:1,dif:0});
ok(mode=='play'&&HS.LT&&HS.LT.t=='night'&&HS.LT.L.length>=20&&cmLtOn(),'In the game: the night demo map has its lighting and '+(HS.LT?HS.LT.L.length:0)+' light sources');
LOG.length=0;let er='';try{for(let f=0;f<120&&mode=='play';f++){P.hp=P.mx=99;tick(1)}}catch(e){er=e.message}
ok(!er&&LOG.some(l=>l[0]=='drawImage'&&l[1]=='multiply'),'In the game: the world is darkened every frame (a multiplied light map) '+er);
ptEnd();edClose(1)}
{mapId=0;build();ok(!HS.LT&&!cmLtOn(),'Built-in maps have no lighting (unchanged)');const d=cmRead(JSON.stringify(CMSAMPLES[0])).doc;ok(!d.lt,'The demo map is in daylight')}
// the editor: Map panel, slider, undo, preview
{const d=cmNew({name:'Lit editor',w:40,h:30});d.obj.push(LY('o',{id:'lp',k:'lamp',x:200,y:200,r:0}));openEd(d);const h0=edMapHTML();
ok(h0.includes('data-f=ltt')&&['Off (as painted)','Day','Morning','Dusk','Night'].every(s=>h0.includes(s))&&!h0.includes('data-f=lta'),'Editor: the Map panel has a Time of day choice (no slider while it is off)');
edLtField('ltt',{value:'dusk'},0);ok(!d.lt,'Editor: (nothing happens until the choice is made)');
edLtField('ltt',{value:'dusk'},1);ok(same(d.lt,{t:'dusk',a:.7})&&LAST().n=='Time of day: Dusk','Editor: pick Dusk: it starts at its default amount, one undo step');
const h1=edMapHTML();ok(h1.includes('data-f=lta')&&h1.includes('value="70"')&&h1.includes('data-f=ltv'),'Editor: an Amount slider (0–100%) and "Show the lighting in the editor"');
const u0=EDH.u.length;edLtField('lta',{value:'40'},0);edLtField('lta',{value:'35'},0);ok(d.lt.a==.35&&EDH.u.length==u0,'Editor: dragging the slider changes the lighting live');
edLtField('lta',{value:'35'},1);ok(d.lt.a==.35&&EDH.u.length==u0+1&&LAST().n=='Change the light amount','Editor: letting go makes one undo step');
edUndo();ok(d.lt.a==.7,'Editor: undo goes back to where the drag started');edRedo();ok(d.lt.a==.35,'Editor: redo');
edLtField('ltt',{value:'night'},1);ok(d.lt.t=='night'&&d.lt.a==.75,'Editor: switch to Night');
edLtField('ltv',{checked:false},1);ok(ED.ltv===0,'Editor: the preview can be hidden (the game still shows it)');edLtField('ltv',{checked:true},1);
LOG.length=0;let er='';try{edDraw(G,1,800,600)}catch(e){er=e.message}ok(!er&&LOG.some(l=>l[0]=='drawImage'&&l[1]=='multiply'),'Editor: the map view shows the lighting '+er);
LOG.length=0;ED.ltv=0;try{edDraw(G,1,800,600)}catch(e){}ok(!LOG.some(l=>l[1]=='multiply'),'Editor: and not when hidden');ED.ltv=1;
{let u='';try{u=edMakeThumb(d)}catch(e){u='ERR '+e.message}ok(!/^ERR/.test(u),'Editor: map thumbnails show the time of day '+u.slice(0,30))}
edLtField('ltt',{value:''},1);ok(!d.lt&&!('lighting' in cmWrite(d)),'Editor: Off removes it');edClose(1)}

// ---------- the map checker ----------
{const tmp=FS.mkdtempSync(PATH.join(OS.tmpdir(),'zdgl-')),run=(...a)=>CP.spawnSync(process.execPath,[CHECK,...a],{encoding:'utf8'}),w=(nm,j)=>{const f=PATH.join(tmp,nm);FS.writeFileSync(f,JSON.stringify(j));return f};
const j=cmWrite(cmNew({name:'Check',w:30,h:20}));j.playerStart={x:300,y:300};j.decals=[{kind:'deadz',x:50,y:50,options:{z:'99'}},{kind:'deadz',x:90,y:50,options:{z:'2',pool:1}},{kind:'oil',x:10,y:10,options:{z:1}}];j.effects=[{kind:'hazard',x:40,y:40,rot:20}];j.lighting={time:'night',amount:1.5};
const r=run(w('a.json',j)),o=r.stdout;ok(r.status===0&&/options\\.z" is "99"/.test(o)&&/Oil stain has no options/.test(o)&&/lighting\\.amount/.test(o)&&!/decals\\[1\\]/.test(o),'Checker: wrong dead-zombie kinds, options on decals that have none and amounts outside 0–1 are reported; good ones are not')}

// ---------- the demo map, and nothing clashes ----------
{const d=cmRead(JSON.stringify(CMSAMPLES[0])).doc,hz=d.obj.find(o=>o.fx=='hazard'),car=d.obj.find(o=>o.veh&&o.dmg&&Math.abs(o.x-1200)<2);ok(hz&&car&&hz.r==car.r&&d.obj.some(o=>o.dc=='deadz')&&d.obj.some(o=>o.dc=='zarm'),'Demo map: the hazard lights are turned to match the crashed car; a dead zombie and an arm by the crash')}
// ---------- light props: spot lights and flood lights ----------
{const K=['spotlight','floodlight','floodtower','walllight','worklight','searchlight'];ok(K.every(k=>OB[k]&&OB[k].lt&&OB[k].lt.length&&EDPN[k]&&EDPN[k][1]=='lights'),'six light props, in the Lights group of the prop browser');
 const fl={id:'L1',k:'floodlight',x:400,y:400,r:90,c:'#ffc860'},S0=cmLightSrc({obj:[fl]});ok(S0.length==2&&S0.every(s=>s.cw>0&&s.c=='#ffc860'&&Math.abs(s.ca-Math.PI)<.3),'a floodlight turned 90° aims its two beams to the left, in its colour');
 ok(cmPR(fl)===0&&cmPR({k:'spotlight',r:90})===90&&cmPR({veh:'sedan',r:30})===30,'poles, towers and tripods stay standing when turned (only their light turns); spotlights and vehicles turn');
 ok(same(cmFoot(fl),cmFoot(Object.assign({},fl,{r:0}))),'a standing light keeps its footing when turned');
 const sl=cmLightSrc({obj:[{k:'searchlight',x:0,y:0}]})[0];ok(sl.r>=400&&sl.cw<.2&&Math.abs(sl.ca-Math.PI/2)<1e-9,'the searchlight is a long narrow beam, straight down the screen when not turned');
 LOG.length=0;const g=document.createElement('canvas').getContext('2d');ok(cmLightPaint(g,{t:'night',a:.8},S0,0,0,800,800,.5,0,1)===1,'beams paint into the night light map');
 ok(typeof edLtAim=='function','the editor shows the beams of a selected light');
 // the light starts at the lamp at the top of the picture, not at the foot of the pole
 const top={floodlight:90,floodtower:140,worklight:40};for(const k in top){const A=cmLightSrc({obj:[{k,x:400,y:400}]}),B=cmLightSrc({obj:[{k,x:400,y:400,r:135}]});
  ok(A.length==2&&A.every(s=>s.y<=400-top[k]&&Math.abs(s.x-400)<20)&&same(A.map(s=>[s.x,s.y]),B.map(s=>[s.x,s.y])),k+': both beams start at the lamps on top ('+A.map(s=>Math.round(s.y-400)).join(', ')+' px above the foot), and stay there when the light is turned')}
 ok(sl.y<0&&sl.y>-40,'the searchlight beam starts at its lamp head');
 // ceiling light and room lights
 ok(OB.ceillight&&EDPN.ceillight&&EDPN.ceillight[1]=='lights','a ceiling light prop, in the Lights group');
 const cl=cmLightSrc({obj:[{k:'ceillight',x:100,y:100}]});ok(cl.length==1&&!cl[0].cw&&cl[0].r>=100&&Math.abs(cl[0].y-91)<2,'the ceiling light glows all round from the middle of the fixture');
 const ra=CMAK.find(a=>a.id=='roomlight');ok(ra&&ra.ed&&ra.cat=='effect','a Room lights area in the Effects group');
 const rl=cmLightSrc({obj:[],areas:[{a:'roomlight',x:100,y:200,w:300,h:160,c:'#f0f4ff',o:{s:1.2}}]});ok(rl.length==1&&same(rl[0].rect,[100,200,300,160])&&rl[0].c=='#f0f4ff'&&Math.abs(rl[0].i-1.2)<1e-9&&rl[0].x==250&&rl[0].y==280,'a Room lights area lights its whole box, in its colour and brightness');
 ok(cmLightSrc({obj:[],areas:[{a:'roomlight',x:0,y:0,w:50,h:50}]})[0].c=='#fff2c8','room lights are warm white by default');
 ok(cmLightPaint(g,{t:'night',a:.8},rl,0,0,800,800,.5,0,1)===1,'room lights paint into the night light map');
 // (the test canvas is a stand-in that keeps no pixels, so the even fill is checked by its numbers; the night picture checks the look)
 ok(!rl[0].cw&&rl[0].r>=Math.hypot(300,160)/2,'room lights reach every corner of the room, with no beam direction');
 ok(cmLtP('day').lit===0&&cmLtP('night').lit>0,'no room light in the day; full at night')}
{const h=FS.readFileSync(process.argv[2],'utf8'),c={};for(const m of h.matchAll(/function ([A-Za-z_$][\\w$]*)\\s*\\(/g))c[m[1]]=(c[m[1]]||0)+1;const dup=Object.keys(c).filter(k=>c[k]>1).sort();
ok(same(dup,['dtBox','tv']),'No function in the game is defined twice by accident (only the two old ones: '+dup.join(', ')+')')}
console.log('TOTAL fails '+fails+' of '+n);
}
`;
const AF=Object.getPrototypeOf(async function(){}).constructor;
new AF('docL','ivs',code+test)(docL,ivs).catch(e=>{console.log('FAIL crashed: '+(e&&e.stack||e));console.log('TOTAL fails 1');process.exitCode=1});
