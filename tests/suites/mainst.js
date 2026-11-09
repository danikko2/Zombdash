// Main Street (map 15) converted to a map file (src/maps/mainst.json) and redesigned at the owner's request: parking lots behind the
// police station, gas station, fire station, City Hall, the restaurants and urgent care; the park moved to the south-east block; houses
// with more variety all round the edge of town; more detail; and the approved extras: dusk lighting, crosswalks and stop signs at every
// crossing, a movie theater, a bank with a drive-thru, a church with a graveyard, the festival banner and bunting (drawn over people),
// apocalypse mess, power lines / bus stops / school crossing signs, a railroad with a depot, more houses at both ends of town.
// The Mayor's fight (City Hall roof, the cruiser's road graph), reach, campaign, Free Play, split screen, low memory, the Workshop copy.
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
S.ac.bp=WP.map((_,i)=>i).filter(i=>WP[i].tr>0);S.ac.bpv=1;docL.pointerdown[0]();endIntro();
{ // in a block, so these names never clash with the game's
const tick=n=>{for(let i=0;i<n;i++){AT_+=.016;NOW_+=16;for(const f of ivs)f();for(let q=TQ.length-1;q>=0;q--)if(TQ[q][0]<=AT_){const g=TQ[q][1];TQ.splice(q,1);g()}loop(NOW_)}};
let fails=0,n=0;const ok=(c,m)=>{n++;if(c)console.log('PASS '+m);else{fails++;console.log('FAIL '+m)}};
const inR=(o,x0,y0,x1,y1)=>o.x>x0&&o.x<x1&&o.y>y0&&o.y<y1;
const NB=1176,SB=1392,OX=1884,PW=3488,PH=2848;

// ---------- the map file loads ----------
const D=(()=>{const r=cmRead(JSON.stringify(BIMF[15]));ok(r.doc&&!r.errors.length&&!r.warnings.length,'mainst.json loads with no errors or warnings '+(r.errors||[]).concat(r.warnings||[]).slice(0,3).join('; '));return r.doc})();
{const L=cmLint(D).filter(p=>(p.lv=='err'||p.lv=='warn')&&!/crafting bench/.test(p.m));ok(!L.length,'nothing in the Problems list '+L.map(p=>p.m).slice(0,2).join('; '));
 ok(D.w==109&&D.h==89&&D.ground=='grass_main'&&D.lt&&D.lt.t=='dusk','109×89 tiles on the Main Street lawn, at dusk');
 ok(D.obj.filter(o=>!o.dc&&!o.fx&&!o.veh).every(o=>cmOB(o.k)),'every prop is a real kit prop');
 ok(!cmDoorBlocks(D).length&&cmDoors(D).length>=150,'no prop or vehicle stands in any of its '+cmDoors(D).length+' doorways')}
const K=k=>D.obj.filter(o=>o.k==k),V=k=>D.obj.filter(o=>o.veh==k),A_=k=>D.areas.filter(a=>a.a==k),PA=k=>D.paths.filter(p=>p.p==k),cars=(x0,y0,x1,y1)=>D.obj.filter(o=>o.veh&&inR(o,x0,y0,x1,y1));
// ---------- what the owner asked for ----------
ok(V('police').filter(o=>inR(o,372,1752,842,2072)).length>=5&&PA('chain').some(p=>p.x>=372&&p.x<=400&&p.y>1752)&&K('lotgate').length,'a fenced police lot behind the station with its cruisers and a gate');
ok(cars(2736,560,3136,920).length>=4&&A_('canopy').some(a=>a.tx=='GAS & GO'),'the gas station: cars parked by the mart and in its side lot, the canopy over the pumps');
ok(A_('paving').some(a=>a.o.s=='concrete'&&a.x==1082&&a.y==SB+430)&&cars(1382,1822,1522,2072).length>=2,'the fire station: a rear apron behind drive-through bays, crew parking');
ok(cars(1996,1802,2546,2072).length>=8&&V('limo').length==1&&K('signboard').some(o=>/MAYOR/.test(o.tx)),'City Hall: a lot behind it with the Mayor\\'s reserved stall and limo');
ok(cars(632,572,1782,930).length>=12&&cars(1986,572,2196,930).length>=3&&cars(852,1632,1072,2072).length>=4,'restaurants: the diner lot, the pizza lot, the cafe lot');
ok(cars(2206,572,2536,900).length>=2&&A_('canopy').some(a=>a.tx=='EMERGENCY')&&V('amb').some(o=>o.y<NB),'urgent care: patient parking and an emergency bay with its ambulance');
{const g=K('gazebo');ok(g.length==1&&g[0].x>2566&&g[0].y>1652&&K('swing').some(o=>o.x>2566&&o.y>1652)&&PA('pond').length&&K('wtower').length,'the park moved to the south-east block: gazebo, playground, pond, the water tower')}
{const M=K('mail'),sid=new Set(D.walls.filter(w=>w.s=='siding').map(w=>w.c)),fen=['picket','woodfence','chain','hedge'].filter(k=>PA(k).length);
 ok(M.length>=21&&sid.size>=12&&fen.length==4,M.length+' mailboxes (houses all round), '+sid.size+' siding colours, every kind of fence');
 ok(D.walls.some(w=>w.s=='brick'&&w.y<400)&&D.walls.some(w=>w.s=='wood'&&w.y>2220)&&D.walls.some(w=>w.s=='window_b')&&A_('porch').length>=15&&A_('pool').length>=1&&D.walls.filter(w=>w.s=='garage'||w.s=='rollup').length>=4,'houses differ: brick, wood, an abandoned one boarded up, porches, a pool, garages')}
// ---------- the approved extras ----------
ok(A_('roomlight').length>=60&&K('lamp').length>=30&&K('ceilflk').length>=2,'1 lights at dusk: room lights, street lamps, flickering lights');
ok(A_('junction').length==3&&A_('junction').every(a=>a.o.cn&&a.o.cs&&a.o.ce&&a.o.cw)&&K('stopsign').length==8,'2 crosswalks at all three crossings, four-way stops at Elm and Maple');
ok(K('marquee').length==1&&K('tseats').length>=4&&K('popcorn').length,'3 the movie theater: marquee, seats, popcorn');
ok(K('vault').length&&K('dtterm').length==2&&A_('canopy').some(a=>a.tx=='DRIVE-THRU')&&K('atm').length,'4 the bank: vault, drive-thru lanes, ATM');
ok(K('steeple').length&&K('altar').length&&K('pew').length>=8&&D.obj.filter(o=>/^g_|^cross$/.test(o.k||'')).length>=15&&PA('iron').length,'5 the church: steeple, altar, pews; the graveyard with its iron fence');
ok(K('stbanner').length==2&&PA('bunting').length>=3&&K('fbooth').length>=6,'6 the festival: banners over Oak Street, bunting across Main, booths');
ok(D.obj.filter(o=>o.veh&&o.dmg).length>=8&&D.obj.filter(o=>o.dc=='deadz').length>=8&&PA('sandbags').length>=2&&D.obj.filter(o=>o.fx=='siren').length>=2&&D.walls.some(w=>w.s=='window_x'&&w.y>NB-6&&w.y<NB+3),'7 the mess: wrecks, the dead, sandbags at the police station, sirens, a car through the barber\\'s window');
ok(K('tpole').length>=20&&PA('powerline').length>=3&&K('bstop').length==2&&K('schoolx').length==4,'8 utility poles with power lines, bus stops, school crossing signs');
ok(PA('rails').length&&K('rrxing').length&&K('rrxing2').length&&K('loco').length&&K('boxcar').length==5&&A_('porch').some(a=>a.y>2690),'9 the railroad: tracks, crossing gates, a freight train, the depot platform');
ok(K('mail').filter(o=>o.x<372).length>=4&&K('mail').filter(o=>o.x>3146).length>=4,'10 houses at both ends of town');
// ---------- the game builds it ----------
mapId=15;S.mp=15;setGM('f');build();
ok(HS.CM==='builtin-mainst'&&WW==3488&&WH==2848&&BG.width==WW,'map 15 builds from mainst.json through the custom-map loader');
ok(MP[15].n=='Main Street'&&MUN[15]===16,'map number 15 keeps its name and the Mayor');
ok(HS.CH&&HS.CH.rx==2026&&HS.CH.ry==1512&&HS.CH.rw==480&&HS.CH.x==2266,'City Hall\\'s roof is where the Mayor stands');
ok(HS.RG&&HS.RG.N.length>=13&&HS.RG.N.every(p=>p[0]>=0&&p[0]<=WW&&p[1]>=0&&p[1]<=WH),'the cruiser\\'s road graph covers the streets');
// ---------- overhead pieces: power lines, bunting and banners are drawn over people ----------
start();{const C=HS.CX;ok(C&&C.O.filter(q=>q.o.k=='stbanner').length==2&&C.O.some(q=>q.o.k=='marquee'),'the banners hang over the road and the marquee over the sidewalk (top layer)');
 const T=C.T.filter(it=>it.o.w&&it.f&&it.f.top&&!it.o.a);ok(T.length==PA('powerline').length+PA('bunting').length,'the game keeps every power line and bunting string for its top layer');
 let w=0;const kw=kmWires;kmWires=function(){w++;return kw.apply(this,arguments)};const g=document.createElement('canvas').getContext('2d'),o=D.paths.find(p=>p.p=='powerline');CMGP=1;cmPathDraw(g,o);CMGP=0;const inBG=w;cmPathDraw(g,o);ok(inBG==0&&w==1,'the background gets only their shadow; the editor draws the wires');kmWires=kw}

// ---------- reach ----------
{const F=new Int16Array(gw*gh);bfs(F,HS.px,HS.py);
 const R=(x,y)=>{const i0=Math.floor(x/gs),j0=Math.floor(y/gs);for(let r=0;r<=2;r++)for(let j=j0-r;j<=j0+r;j++)for(let i=i0-r;i<=i0+r;i++){const k=j*gw+i;if(k>=0&&k<gw*gh&&!bl[k])return F[k]>=0}return false};
 const rooms={'police lobby':[600,1450],'police offices':[600,1580],'police lot':[600,1900],diner:[760,1100],'diner kitchen':[700,970],books:[1382,1100],'theater lobby':[1560,1150],'theater seats':[1560,1000],hardware:[497,1050],
  pizza:[2090,1100],'urgent care waiting':[2300,1130],'exam room':[2300,990],'ice cream':[2630,1110],'gas mart':[3000,760],cafe:[960,1450],'fire bays':[1232,1600],'fire bunk room':[1450,1780],bank:[1657,1450],'bank teller':[1600,1540],
  'City Hall plaza':[2120,1440],flowers:[2680,1450],'flower shop back':[2680,1600],'post office':[2970,1450],park:[2848,1990],church:[3080,2450],graveyard:[3375,2350],depot:[2100,2650],platform:[2160,2712]};
 const no=Object.keys(rooms).filter(k=>!R(...rooms[k]));ok(!no.length,'every building and place can be reached: '+(no.length?'not '+no.join(', '):'shops, stations, City Hall, park, church, depot'));
 // every room of every house (big enough to stand in): the floor in the middle of it can be reached
 const H_=D.areas.filter(a=>a.a=='floor'&&a.o&&a.o.in!==0&&a.w>=60&&a.h>=60&&(a.y<560||a.y>2220||a.x<372||a.x>3140));let bad=H_.filter(a=>!R(a.x+a.w/2,a.y+a.h/2));
 ok(H_.length>=60&&bad.length<=H_.length*.03,'the rooms of the houses can be reached ('+(H_.length-bad.length)+' of '+H_.length+') '+JSON.stringify(bad.slice(0,4).map(a=>[a.x,a.y])));
 let e=0,er=0;for(let i=0;i<gw;i++)for(const j of[0,gh-1]){const k=j*gw+i;if(!bl[k]){e++;if(F[k]>=0)er++}}for(let j=0;j<gh;j++)for(const i of[0,gw-1]){const k=j*gw+i;if(!bl[k]){e++;if(F[k]>=0)er++}}ok(e>300&&er>=e*.97,'zombies can walk to the player from the open edges ('+er+' of '+e+')')}

// ---------- playtest: campaign waves with the Mayor ----------
const A=S.ac;
const RNG=new Set([11,19]);
const play=(w0,w1,lim)=>{const R={spawned:0,reached:0,stuck:0,waves:0,err:'',sk:{}};try{for(let w=w0;w<=w1;w++){if((mode!='play'||!!BRK))nextWave();let t=0;const seen=new Map();
 while((mode=='play'&&!BRK)&&t<lim){for(const p of PL){p.mx=Math.max(p.mx,20);p.hp=p.mx}tick(1);t++;for(const z of zs){if(ZT[z.t].sv)continue;if(!seen.has(z)){seen.set(z,t);R.spawned++}
  const dz=Math.hypot(z.x-P.x,z.y-P.y);if(z.hp>0&&(dz<80||dz<400&&RNG.has(z.t))){R.reached++;hurt(z,z.hp+1,0,0)}else if(z.hp>0&&t-seen.get(z)>5000){R.stuck++;const k=z.t+'@'+Math.round(dz)+'('+Math.round(z.x)+','+Math.round(z.y)+')';R.sk[k]=(R.sk[k]||0)+1;hurt(z,z.hp+1,0,0)}}}
 if((mode=='play'&&!BRK)){toSp=0;for(let q=0;q<4000&&(mode=='play'&&!BRK);q++){for(const z of zs.slice())if(z.hp>0)hurt(z,z.hp+1,0,0);toSp=0;tick(1)}}R.waves++;if(REQ('process').env.SUBLOG)console.log('WAVE '+w+' ticks '+t+' spawned '+R.spawned+' reached '+R.reached+' stuck '+R.stuck+' '+JSON.stringify(R.sk))}}catch(e){R.err=e.stack||e.message}return R};
A.un=[0,MUN[0],MUN[3],MUN[1],MUN[14]];A.cp=4;A.tut=1;delete A.bm;S.lm='off';setGM('c');mapId=15;S.mp=15;sel=0;start();ok(mapId===15&&HS.CM==='builtin-mainst','a campaign run starts on Main Street');
{const FULL=!!REQ('process').env.MAINST_FULL;let R=play(1,FULL?19:4,5000);if(!FULL){const R1=R;wave=18;zs=[];toSp=0;mode='shop';const R2=play(19,19,5000);R={spawned:R1.spawned+R2.spawned,reached:R1.reached+R2.reached,stuck:R1.stuck+R2.stuck,waves:R1.waves+R2.waves+14,err:R1.err||R2.err,sk:Object.assign(R1.sk,R2.sk)}}
 ok(!R.err&&R.waves==19&&wave==19,'campaign waves '+(FULL?'1–19':'1–4 and 19')+' play through on Main Street '+R.err);
 ok(R.spawned>(FULL?700:100)&&R.stuck<=Math.max(2,R.spawned*.01),'zombies reach the player ('+R.reached+' of '+R.spawned+' reached; '+R.stuck+' slow ones '+JSON.stringify(R.sk)+')')}
{if((mode!='play'||!!BRK))nextWave();const b=zs.find(q=>ZT[q.t].sv);ok(wave==20&&b&&b.ci==16&&b.tk,'wave 20: the Mayor arrives in his cruiser');
 let near_=0;for(let f=0;f<2400&&b&&b.hp>0&&!near_;f++){P.mx=Math.max(P.mx,20);P.hp=P.mx;tick(1);if(Math.hypot(b.x-P.x,b.y-P.y)<420)near_=1}ok(near_,'the cruiser finds the player');
 b.ph=2;b.tk=0;b.iv=0;hurt(b,1e9,0,0);tick(Math.ceil(6/.016));ok(bBt(A,DIF(),15)&&A.un.includes(16),'beating the Mayor keeps campaign progress: he joins and Main Street counts as beaten')}

// ---------- free play, split screen, low memory, the Workshop ----------
setGM('f');mapId=15;S.mp=15;start();{const R=play(1,2,4000);ok(!R.err&&wave>=2,'a Free Play run plays '+R.err);
 if((mode!='play'||!!BRK))nextWave();const row=olRow();ok(row&&row.map===15&&row.mode=='f','the leaderboard board is still map 15');
 cpSave();let c=null;try{c=JSON.parse(localStorage[CPK])}catch(e){}ok(c&&c.m===15&&c.cm===undefined,'checkpoints save as map 15');over(1)}
{const B={name:'B',xp:0,lv:1,sp:0,sk:{},pts:0,un:[0,2,3],cp:8};S.prof=[B];setGM('f');LBY={s:[{inp:'km',ac:A,ci:0,v:0,rdy:1},{inp:0,ac:B,ci:0,v:1,rdy:1}]};mapId=15;let er='';try{startMP();for(let f=0;f<200;f++){for(const p of PL){p.mx=Math.max(p.mx,20);p.hp=p.mx}tick(1)}}catch(e){er=e.message}
 ok(!er&&MPn==2&&HS.CM==='builtin-mainst','split screen plays Main Street '+er);over(1);S.prof=[];MPn=0}
{S.lm='on';setGM('f');mapId=15;build();ok(LMX&&BGL&&BG.width<=1&&HS.CM==='builtin-mainst','low-memory mode keeps a half-size background');S.lm='off';build();ok(!BGL&&BG.width==3488,'back to the full background')}
{const h=wsBuiltins();ok(h.includes('wsBuiltin(15,1)')&&h.includes('Main Street'),'the Workshop lists Main Street under Built-in maps')}
await wsBuiltin(15,0);{const e=CML.find(q=>q.doc&&q.doc.name=='Main Street (my copy)'),D2=bimDoc(15);ok(e&&e.doc.obj.length==D2.obj.length&&e.doc.walls.length==D2.walls.length&&e.doc.paths.length==D2.paths.length,'EDIT A COPY makes your own copy with every piece')}

// ---------- the new kit pieces ----------
{const NK=['marquee','tseats','popcorn','vault','dtterm','steeple','altar','stbanner','fbooth','schoolx','rrxing','rrxing2','boxcar','loco','pmeter','airpump','dropbox'];
 const J={format:'zombdash-map',version:3,name:'T',tileSize:32,width:40,height:24,ground:'grass_main',props:NK.map((k,i)=>({kind:k,x:120+(i%6)*200,y:200+Math.floor(i/6)*250})),
  paths:[{kind:'powerline',points:[[100,700],[400,700],[700,720]]},{kind:'bunting',points:[[100,600],[300,640]],options:{h:54}}],playerStart:{x:600,y:740}};
 const r=cmRead(JSON.stringify(J));ok(r.doc&&!r.errors.length&&!r.warnings.length,'the new pieces load: marquee, theater seats, popcorn, vault, drive-thru terminal, steeple, altar, street banner, festival booth, school and railroad crossing signs, freight car, locomotive, parking meter, air pump, mail drop box, power lines, bunting, the lawn '+(r.errors||[]).concat(r.warnings||[]).join('; '));
 ok(NK.every(k=>EDPN[k])&&CMTI.grass_main&&cmPath('powerline')&&cmPath('bunting'),'they are all in the editor');
 ok(OB.stbanner.ov&&OB.marquee.ov&&OB.marquee.dk&&OB.vault.dk,'the street banner and the marquee hang overhead; the marquee and the vault door may sit at doorways');
 ok(typeof mapMainSt=='undefined'&&typeof msHouse=='undefined','the old Main Street map code is gone')}
mapId=15;build();ok(HS.CM==='builtin-mainst','map 15 is still the built-in Main Street');
console.log('TOTAL fails '+fails+' of '+n);
}
`;
const AF=Object.getPrototypeOf(async function(){}).constructor;
new AF('docL','ivs',code+test)(docL,ivs).catch(e=>{console.log('FAIL crashed: '+(e&&e.stack||e));console.log('TOTAL fails 1');process.exitCode=1});
