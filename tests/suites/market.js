// Hometown Market (map 14) converted to a map file (src/maps/market.json) and redesigned at the owner's request: the truck route
// round the building to four docks side by side, a fuller store, detailed checkouts and self-checkouts, hanging section signs (over
// people, see-through while someone is under one), the new cart corral in parking stalls, pharmacy with a drive-up window, wine &
// spirits, restrooms, customer service and ATM, the seasonal display, lights at dusk, the mess, lot islands. Penny's fight (store box,
// shelves, cart corrals), zombies reach the player, campaign, Free Play, split screen, low memory, the Workshop copy, the new kit pieces.
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
const near=(a,b,e)=>Math.abs(a-b)<=(e||.11);
const inR=(o,x0,y0,x1,y1)=>o.x>x0&&o.x<x1&&o.y>y0&&o.y<y1;
const BX0=300,BX1=2160,BY0=760,BYM=1060,BY1=2040;

// ---------- the map file loads ----------
const D=(()=>{const r=cmRead(JSON.stringify(BIMF[14]));ok(r.doc&&!r.errors.length&&!r.warnings.length,'market.json loads with no errors or warnings '+(r.errors||[]).concat(r.warnings||[]).slice(0,3).join('; '));return r.doc})();
{const L=cmLint(D).filter(p=>p.lv=='err'||p.lv=='warn');ok(!L.length,'nothing in the Problems list '+L.map(p=>p.m).slice(0,2).join('; '));
 ok(D.w==80&&D.h==97&&D.ground=='grass_market'&&D.lt&&D.lt.t=='dusk','80×97 tiles on the market lawn, lights on at dusk');
 ok(D.obj.filter(o=>!o.dc&&!o.fx&&!o.veh).every(o=>cmOB(o.k)),'every prop is a real kit prop');
 ok(!cmDoorBlocks(D).length&&cmDoors(D).length>=12,'no prop or vehicle stands in any of its '+cmDoors(D).length+' doorways')}
const K=k=>D.obj.filter(o=>o.k==k),A_=k=>D.areas.filter(a=>a.a==k);
// the truck route and the docks
{const R=D.paths.filter(p=>p.p=='road'),loop=R.find(p=>p.pts.length>10);const pts=loop?loop.pts.map(p=>[loop.x+p[0],loop.y+p[1]]):[];
 const xs=pts.map(p=>p[0]),ys=pts.map(p=>p[1]);ok(loop&&loop.w>=110&&Math.min(...xs)<BX0-60&&Math.max(...xs)>BX1+60&&Math.min(...ys)<BY0-400&&Math.max(...ys)>2880,'a truck route goes round the building: up the east side, across the back behind the docks, down the west side, both ends on the road');
 const rg=D.feats.find(f=>f.f=='roadgraph');ok(rg&&rg.pts.length>=6,'the route is also a road graph (for vehicles that drive)');
 const dk=D.walls.filter(w=>w.s=='rollup'&&near(w.y+3,BY0,1)).map(w=>w.x+w.w/2).sort((a,b)=>a-b);ok(dk.length==4&&dk.every((x,i)=>!i||near(x-dk[i-1],120,1)),'four roll-up dock doors side by side on the back wall ('+dk.join(', ')+')');
 const tr=D.obj.filter(o=>o.veh=='trailer'&&o.y<BY0&&dk.some(x=>near(o.x,x,1)));ok(tr.length==2,'semis backed up to docks 1 and 3')}
// a fuller store
ok(K('gshelf').length>=48&&K('produce').length>=16&&K('freezer').length>=8&&K('display').length>=10,'a fuller store: '+K('gshelf').length+' grocery shelves, '+K('produce').length+' produce stands, '+K('freezer').length+' freezers, '+K('display').length+' cases and displays');
ok(K('lane').length==6&&K('candy').length==6&&K('selfco').length==4,'six detailed checkout lanes with impulse racks, and four self-checkouts');
ok(K('rxshelf').length>=2&&A_('counter').some(a=>a.x<600&&a.y>1440&&a.y<1720)&&D.walls.some(w=>w.s=='window'&&near(w.x+3,BX0,1)),'a pharmacy with its counter and shelves, and a drive-up window in the west wall by the truck route');
ok(K('wineshelf').length>=4&&K('wc').length==4&&K('atm').length==1&&A_('counter').filter(a=>a.o&&a.o.st=='sinks').length==2,'wine & spirits, two restrooms, customer service and an ATM');
ok(['pumpkins','soilbags','icebox','propane','flowers'].every(k=>K(k).some(o=>o.y>BY1&&o.y<BY1+130)),'the seasonal display out front: pumpkins, soil bags, an ice freezer, a propane cage, flowers');
ok(D.walls.some(w=>w.s=='barricade'&&near(w.x+3,BX1,1))&&D.obj.some(o=>o.dc=='deadz')&&D.obj.filter(o=>o.dc&&/blood/.test(o.dc)).length>=3&&D.obj.some(o=>o.k=='display'&&o.r),'the mess: a barricaded side door, a dead zombie, blood by the doors, a knocked-over display');
ok(A_('roomlight').length>=5&&K('ceilflk').length>=2&&K('walllight').length>=8&&K('plight').length==8,'lights: room lights, flickering lights in the storage room, wall lights at the docks and doors, lot lights');
{const isl=A_('paving').filter(a=>a.o&&a.o.s=='grass'&&a.o.curb);ok(isl.length==6&&isl.every(a=>K('stree').some(t=>inR(t,a.x-1,a.y,a.x+a.w+1,a.y+a.h+20))),'six lot islands with a curb and a tree')}
// hanging signs and the corrals
ok(K('hsign').length>=14&&K('haisle').length==5,'hanging signs: '+K('hsign').length+' sections and 5 aisle signs');
{const C=K('corral');ok(C.length==4&&C.every(c=>{const f=cmFoot(c);return f&&near(f[2],44,1)&&near(f[3],86,1)}),'four cart corrals, each the size of a parking stall (44×86)');
 ok(C.filter(c=>c.r==180).length==2,'the two in stalls that open upward are turned round, so every corral opens onto the drive aisle')}
mapId=14;S.mp=14;setGM('f');build();
ok(HS.CM==='builtin-market'&&WW==2560&&WH==3104&&BG.width==WW,'map 14 builds from market.json through the custom-map loader');
ok(MP[14].n=='Hometown Market'&&CORD[3]===14&&MUN[14]===15,'map number 14 keeps its name, its campaign slot (fourth in Hometown) and Penny');
// Penny's store, shelves and corrals
ok(HS.ST&&HS.ST.join()==[BX0,BYM,BX1,BY1].join()&&HS.SHF.length>=48&&HS.CRL.length==6&&HS.CRL.every(c=>!(c[0]>BX0&&c[0]<BX1&&c[1]>BYM&&c[1]<BY1)),'Penny: the store box, '+HS.SHF.length+' shelves to knock over, 6 places carts come from (the corrals and the sidewalk cart rows, none inside)');
ok(HS.HO&&HS.HO.length==1&&!(HS.NS&&HS.NS.length),'the whole building is one interior; no extra no-spawn zones');

// ---------- hanging signs: drawn over people, see-through while someone is under one ----------
start();{const O=HS.CX&&HS.CX.O;ok(O&&O.length==K('hsign').length+K('haisle').length,'the game keeps every hanging sign for its top layer');
 let drew=0;const B=OB.hsign,f=B.f;B.f=function(){drew++;return f.apply(this,arguments)};cmProp(document.createElement('canvas').getContext('2d'),{k:'hsign',x:100,y:100,tx:'X'});B.f=f;ok(drew==0,'the ground picture gets only its shadow');
 const it=O.find(q=>q.o.k=='haisle'),s0=it.al;P.x=it.o.x;P.y=it.o.y-10;zs=[];cam.x=cl(P.x-W/2,0,WW-W);cam.y=cl(P.y-H/2,0,WH-H);for(let i=0;i<30;i++){NOW_+=16;cmOverhead(O,NOW_/1000)}const s1=it.al;
 P.y=it.o.y+300;for(let i=0;i<60;i++){NOW_+=16;cmOverhead(O,NOW_/1000)}ok(s0==1&&s1<.5&&it.al>.95,'a sign fades to see-through while the player stands under it, and comes back ('+s1.toFixed(2)+')')}

// ---------- walls and reach ----------
{const cell=(x,y)=>bl[Math.floor(y/gs)*gw+Math.floor(x/gs)];const F=new Int16Array(gw*gh);bfs(F,HS.px,HS.py);// a spot is reached if the nearest open cell to it (within 2 cells: the room's floor, not the furniture on it) is
 const R=(x,y)=>{const i0=Math.floor(x/gs),j0=Math.floor(y/gs);for(let r=0;r<=2;r++)for(let j=j0-r;j<=j0+r;j++)for(let i=i0-r;i<=i0+r;i++){const k=j*gw+i;if(!bl[k])return F[k]>=0}return false};
 const rooms={aisles:[1187,1400],produce:[2067,1700],frozen:[1790,1500],pharmacy:[470,1560],'behind the pharmacy counter':[515,1650],wine:[470,1900],'men\\'s room':[690,1990],'women\\'s room':[805,1990],'customer service':[980,2000],deli:[1880,1110],storage:[1200,1000],office:[400,840],'dock 2':[DK2=820,700],yard:[1300,300],lot:[1200,2500],'east lane':[2300,1500],'west lane':[150,1500],road:[900,2970]};var DK2;
 const no=Object.keys(rooms).filter(k=>!R(...rooms[k]));ok(!no.length,'every part of the map can be reached: '+(no.length?'not '+no.join(', '):'store, rooms, storage, docks, yard, lot, lanes, road'));
 ok(cell(BX1,900),'the barricaded side door is shut');ok(!cell(FD0=1180,BY1)&&!cell(1880,BY1)&&!cell(740,BYM)&&!cell(1660,BYM),'both automatic doors and both swing doors are open');var FD0;
 let e=0,er=0;for(let i=0;i<gw;i++)for(const j of[0,gh-1]){const k=j*gw+i;if(!bl[k]){e++;if(F[k]>=0)er++}}for(let j=0;j<gh;j++)for(const i of[0,gw-1]){const k=j*gw+i;if(!bl[k]){e++;if(F[k]>=0)er++}}ok(e>300&&er==e,'zombies can walk to the player from every open spot on the edges ('+er+' of '+e+')')}

// ---------- playtest: campaign waves with Penny ----------
const A=S.ac;
const RNG=new Set([11,19]);
const play=(w0,w1,lim)=>{const R={spawned:0,reached:0,stuck:0,waves:0,err:'',sk:{}};try{for(let w=w0;w<=w1;w++){if(mode!='play')nextWave();let t=0;const seen=new Map();
 while(mode=='play'&&t<lim){for(const p of PL){p.mx=Math.max(p.mx,20);p.hp=p.mx}tick(1);t++;for(const z of zs){if(ZT[z.t].sv)continue;if(!seen.has(z)){seen.set(z,t);R.spawned++}
  const dz=Math.hypot(z.x-P.x,z.y-P.y);if(z.hp>0&&(dz<80||dz<400&&RNG.has(z.t))){R.reached++;hurt(z,z.hp+1,0,0)}else if(z.hp>0&&t-seen.get(z)>5000){R.stuck++;const k=z.t+'@'+Math.round(dz)+'('+Math.round(z.x)+','+Math.round(z.y)+')';R.sk[k]=(R.sk[k]||0)+1;hurt(z,z.hp+1,0,0)}}}
 if(mode=='play'){toSp=0;for(let q=0;q<4000&&mode=='play';q++){for(const z of zs.slice())if(z.hp>0)hurt(z,z.hp+1,0,0);toSp=0;tick(1)}}R.waves++;if(REQ('process').env.SUBLOG)console.log('WAVE '+w+' ticks '+t+' spawned '+R.spawned+' reached '+R.reached+' stuck '+R.stuck+' '+JSON.stringify(R.sk))}}catch(e){R.err=e.stack||e.message}return R};
A.un=[0,MUN[0],MUN[3],MUN[1]];A.cp=3;A.tut=1;delete A.bm;S.lm='off';setGM('c');mapId=14;S.mp=14;sel=0;start();ok(mapId===14&&HS.CM==='builtin-market','a campaign run starts on Hometown Market');
// the whole campaign (waves 1–19) with MARKET_FULL=1; by default waves 1–4 and 19
{const FULL=!!REQ('process').env.MARKET_FULL;let R=play(1,FULL?19:4,5000);if(!FULL){const R1=R;wave=18;zs=[];toSp=0;mode='shop';const R2=play(19,19,5000);R={spawned:R1.spawned+R2.spawned,reached:R1.reached+R2.reached,stuck:R1.stuck+R2.stuck,waves:R1.waves+R2.waves+14,err:R1.err||R2.err,sk:Object.assign(R1.sk,R2.sk)}}
 ok(!R.err&&R.waves==19&&wave==19,'campaign waves '+(FULL?'1–19':'1–4 and 19')+' play through on the market '+R.err);
 ok(R.spawned>(FULL?700:100)&&R.stuck<=Math.max(2,R.spawned*.01),'zombies reach the player ('+R.reached+' of '+R.spawned+' reached; '+R.stuck+' slow ones '+JSON.stringify(R.sk)+')')}
{if(mode!='play')nextWave();const b=zs.find(q=>ZT[q.t].sv);ok(wave==20&&b&&b.ci==15,'wave 20: Penny arrives');
 // inside the store she knocks stock off the shelves; out in the lot she sends carts from the corrals
 P.x=1187;P.y=1400;GCI.length=0;b.sk=0;gcShelf(b,P,0);ok(GCI.length>=3&&GCI.every(c=>HS.SHF.some(s=>Math.abs(s[0]-c.sx)<=41&&s[1]==c.sy)),'in the aisles Penny dumps the nearest shelves\\' stock on you ('+GCI.length+')');
 P.x=900;P.y=2500;GCC.length=0;b.x=1200;b.y=2300;gcCarts(b,P,0);ok(GCC.length>=3&&GCC.some(c=>HS.CRL.some(q=>Math.hypot(c.x-q[0],c.y-q[1]+14)<60)),'in the lot she sends carts out of the corrals');GCI.length=0;GCC.length=0;
 let near_=0;for(let f=0;f<2400&&b&&b.hp>0&&!near_;f++){P.mx=Math.max(P.mx,20);P.hp=P.mx;tick(1);if(Math.hypot(b.x-P.x,b.y-P.y)<320)near_=1}ok(near_,'Penny finds the player');
 b.ph=2;b.iv=0;hurt(b,1e9,0,0);tick(Math.ceil(6/.016));ok(bBt(A,DIF(),14)&&A.un.includes(15),'beating Penny keeps campaign progress: she joins and the market counts as beaten')}

// ---------- free play, split screen, low memory, the Workshop ----------
setGM('f');mapId=14;S.mp=14;start();{const R=play(1,2,4000);ok(!R.err&&wave>=2,'a Free Play run plays '+R.err);
 if(mode!='play')nextWave();const row=olRow();ok(row&&row.map===14&&row.mode=='f','the leaderboard board is still map 14');
 cpSave();let c=null;try{c=JSON.parse(localStorage[CPK])}catch(e){}ok(c&&c.m===14&&c.cm===undefined,'checkpoints save as map 14');over(1)}
{const B={name:'B',xp:0,lv:1,sp:0,sk:{},pts:0,un:[0,2,3],cp:8};S.prof=[B];setGM('f');LBY={s:[{inp:'km',ac:A,ci:0,v:0,rdy:1},{inp:0,ac:B,ci:0,v:1,rdy:1}]};mapId=14;let er='';try{startMP();for(let f=0;f<200;f++){for(const p of PL){p.mx=Math.max(p.mx,20);p.hp=p.mx}tick(1)}}catch(e){er=e.message}
 ok(!er&&MPn==2&&HS.CM==='builtin-market','split screen plays the market '+er);over(1);S.prof=[];MPn=0}
{S.lm='on';setGM('f');mapId=14;build();ok(LMX&&BGL&&BG.width<=1&&HS.CM==='builtin-market','low-memory mode keeps a half-size background');S.lm='off';build();ok(!BGL&&BG.width==2560,'back to the full background')}
{const h=wsBuiltins();ok(h.includes('wsBuiltin(14,1)')&&h.includes('Hometown Market'),'the Workshop lists the market under Built-in maps')}
await wsBuiltin(14,0);{const e=CML.find(q=>q.doc&&q.doc.name=='Hometown Market (my copy)'),D2=bimDoc(14);ok(e&&e.doc.obj.length==D2.obj.length&&e.doc.walls.length==D2.walls.length,'EDIT A COPY makes your own copy with every piece')}

// ---------- the new kit pieces ----------
{const J={format:'zombdash-map',version:3,name:'T',tileSize:32,width:30,height:20,ground:'grass_market',
 props:['hsign','haisle','lane','candy','corral','wineshelf','rxshelf','selfco','atm','icebox','propane','pumpkins','soilbags','flowers'].map((k,i)=>({kind:k,x:60+(i%7)*130,y:200+Math.floor(i/7)*250})),playerStart:{x:400,y:600}};
 const r=cmRead(JSON.stringify(J));ok(r.doc&&!r.errors.length&&!r.warnings.length,'the new pieces load: hanging signs, checkout lane, impulse rack, corral, wine and pharmacy shelves, self-checkout, ATM, ice freezer, propane cage, pumpkin bin, soil bags, flower stand, market lawn '+(r.errors||[]).concat(r.warnings||[]).join('; '));
 ok(['hsign','haisle','lane','candy','wineshelf','rxshelf','selfco','atm','icebox','propane','pumpkins','soilbags','flowers','corral'].every(k=>EDPN[k])&&CMTI.grass_market,'they are all in the editor');
 ok(OB.hsign.ov&&OB.haisle.ov&&OB.hsign.dk&&OB.deptsign.dk,'hanging signs are overhead and may hang over doorways');
 ok(typeof mapGrocery=='undefined','the old market map code is gone')}
mapId=14;build();ok(HS.CM==='builtin-market','map 14 is still the built-in market');
console.log('TOTAL fails '+fails+' of '+n);
}
`;
const AF=Object.getPrototypeOf(async function(){}).constructor;
new AF('docL','ivs',code+test)(docL,ivs).catch(e=>{console.log('FAIL crashed: '+(e&&e.stack||e));console.log('TOTAL fails 1');process.exitCode=1});
