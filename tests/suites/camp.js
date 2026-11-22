// The Campground (map 7) as a map file, at the owner's request: dusk, more detail everywhere, closer to a commercial 2D
// game; the places the owner chose: a mess hall lodge, the waterfront (a boathouse, a swim dock with a raft and a buoy line,
// a lifeguard chair), an amphitheater with a stage, a creek with a footbridge; the story: the camp was evacuated (the kids got
// out on the bus, the counselors stayed and made a last stand at the mess hall); bigger. Reach, Charles, waves, Free Play.
const ST={};global.LOG=[];const LOG=global.LOG;
const fs=require('fs');const html=fs.readFileSync(process.argv[2],'utf8');
const code=html.slice(html.lastIndexOf('<script>')+8,html.lastIndexOf('</script>'));
global.ImageData=class{constructor(d,w,h){this.data=d}};
const ctx=new Proxy(ST,{get:(t,k)=>k=='getImageData'?(x,y,w,h)=>({data:new Uint8ClampedArray(Math.max(1,w*h*4)).fill(120)}):k=='createImageData'?(w,h)=>({data:new Uint8ClampedArray(w*h*4)}):k=='measureText'?()=>({width:30}):(k=='createRadialGradient'||k=='createLinearGradient'||k=='createPattern')?()=>({addColorStop(){}}):k=='drawImage'?()=>{LOG.push(['drawImage',t.globalCompositeOperation||'source-over'])}:k=='ellipse'?()=>{global.ELL=(global.ELL||0)+1}:k=='rotate'?a=>{LOG.push(['rotate',a])}:(k in t&&typeof t[k]!='function')?t[k]:()=>{},set:(t,k,v)=>{t[k]=v;return true}});
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
const sxC=y=>Math.round(800+70*Math.sin(y/320+.6)+28*Math.sin(y/105+2));// the lake shore in camp.json
const PW=3328,PH=2560;
// ---------- the map file loads ----------
const D=(()=>{const r=cmRead(JSON.stringify(BIMF[7]));ok(r.doc&&!r.errors.length&&!r.warnings.length,'camp.json loads with no errors or warnings '+(r.errors||[]).concat(r.warnings||[]).slice(0,3).join('; '));return r.doc})();
{const L=cmLint(D).filter(p=>p.lv=='err'||p.lv=='warn');ok(!L.length,'nothing in the Problems list '+L.map(p=>p.m).slice(0,2).join('; '));
 ok(D.w==104&&D.h==80&&D.id=='builtin-camp'&&D.name=='Campground','104×80 tiles (3328×2560 px, up from 2300×1900): grown to fit the new places');
 ok(D.obj.filter(o=>!o.dc&&!o.fx&&!o.veh&&!o.f).every(o=>cmOB(o.k)),'every prop is a real kit prop');ok(!cmDoorBlocks(D).length,'no prop stands in a doorway')}
const K=k=>D.obj.filter(o=>o.k==k),FX=k=>D.obj.filter(o=>o.fx==k),DC=k=>D.obj.filter(o=>o.dc==k),V=k=>D.obj.filter(o=>o.veh==k),PA=k=>D.paths.filter(p=>p.p==k),AR=k=>D.areas.filter(a=>a.a==k),VA=()=>D.obj.filter(o=>o.veh);
const WL=s=>D.walls.filter(w=>w.s==s),SB=t=>K('signboard').some(o=>o.tx==t);
// ---------- dusk ----------
{ok(D.lt&&D.lt.t=='dusk'&&D.lt.a==.7,'dusk light');ok(FX('fire').length>=5&&K('campring').length>=6,'campfires still burning: the amphitheater, the cabin circle, the tent sites');
 ok(FX('fireflies').length>=8&&FX('owl').length>=1&&FX('ducks').length>=2,'fireflies over the grass, an owl in the woods, ducks on the lake');
 ok(K('lampost').length>=18&&AR('roomlight').length>=8&&PA('bulbs').length==2,'lantern posts along the trails, lit windows, string lights on the porch and round the amphitheater');
 ok(AR('sunshadow').length>=7&&AR('fog').length>=3,'long shadows east of the buildings (the sun is setting over the lake); mist on the water')}
// ---------- the places the owner chose ----------
{ok(SB('MESS HALL')&&K('mtable').length==2&&K('bfplace').length==1&&K('kc_range').length==1&&K('kfridge').length==1&&AR('floor').filter(a=>a.x>=1460&&a.x<2160&&a.y>=380&&a.y<800).length==3,'the mess hall lodge: a dining room with long tables and a stone fireplace, a kitchen, a store room');
 ok(SB('BOATHOUSE')&&K('kayakrack').length==1&&K('pfdrack').length==1&&K('canoeup').length==1&&AR('dock').length==3&&K('canoe').length>=3&&K('kayak').length>=2&&K('canrack').length>=2,'the waterfront: a boathouse with its slip, kayaks, life jackets, canoes');
 ok(K('raft').length==1&&PA('buoys').length>=2&&K('lgchair').length==1&&SB('SWIM AREA')&&PA('beach').length==1,'the swim dock with a raft offshore, a buoy line round the swim area, the lifeguard chair on the beach');
 ok(AR('stage').length==1&&AR('stage')[0].o.bd==1&&K('micstand').length==1&&DC('guitar').length==1&&SB('TALENT NIGHT')&&K('lbench').length>=10,'the amphitheater: a stage set for talent night, rows of log benches, a campfire in front');
 const C=PA('stream')[0],B=AR('bridge')[0];let over=0;if(C&&B)for(let i=1;i<C.pts.length;i++){const a=C.pts[i-1],b=C.pts[i];for(let t=0;t<=1;t+=.02){const x=C.x+a[0]+(b[0]-a[0])*t,y=C.y+a[1]+(b[1]-a[1])*t;if(x>B.x&&x<B.x+B.w&&y>B.y&&y<B.y+B.h)over=1}}
 ok(C&&B&&over&&C.z<0,'a creek runs into the lake (under its edge), with a footbridge over it to the health lodge')}
// ---------- the evacuation ----------
{ok(K('noticeb').some(o=>/BUS LEAVES/.test(o.tx))&&K('cardsign').some(o=>/BUS/.test(o.tx)),'the notice board: BUS LEAVES 6 PM; a sign at the pickup: BUS LEFT');
 ok(SB('BUS PICKUP')&&PA('ruts').length==1&&DC('duffel').length+DC('backpack').length+DC('teddy').length>=20&&DC('footprints').length>=30,'the bus is gone: its tracks, the bags and teddies the kids dropped running for it, their footprints down the trails');
 ok(K('campbunk').length>=20&&K('campbunk').filter(o=>o.vr>=.5).length>=8&&DC('clothes').length+DC('campshirt').length>=15,'six camper cabins of bunks, some left mid-packing, clothes everywhere');
 ok(['BEAR','OWL','MOOSE','EAGLE','FOX','WOLF'].every(n=>SB(n+' CABIN'))&&SB('HEALTH LODGE')&&K('cot').length==3,'cabins with their names, and the health lodge with its cots');
 ok(K('tablex').length==3&&WL('window_b').length>=3&&K('cardsign').some(o=>/WE STAYED/.test(o.tx))&&DC('bullets').length>=20&&DC('deadz').length>=10&&DC('sheetbody').length==2,'the counselors\\' last stand: tables on their sides, boarded windows, WE STAYED, the shells, the dead');
 ok(K('archway').some(o=>o.tx=='ZOMBDASH|CAMPGROUND')&&VA().length==4,'the log arch over the road in, the counselors\\' cars')}
// ---------- more of camp ----------
{ok(K('archtgt').length==4&&SB('ARCHERY')&&K('tether').length==2&&AR('garden').length==1&&PA('picket').length==1&&K('scare').length==1,'an archery range, tetherball on the green, the kitchen garden with a scarecrow');
 ok(AR('tent').length==1&&AR('tent')[0].tx=='ARTS & CRAFTS'&&SB('TRADING POST')&&SB('SHOWERS')&&K('dtent').length>=5&&K('bearbox').length>=5,'the arts & crafts tent, the trading post, the shower house, the tent sites with bear boxes');
 ok(PA('woods').length>=6&&PA('pond').length==1&&K('pine').length+K('spruce').length+K('fpine').length+K('pine_g').length>=150,'dense woods all round, the lake to the west, pines everywhere')}
// ---------- the game builds it ----------
mapId=7;S.mp=7;setGM('f');build();
ok(HS.CM==='builtin-camp'&&WW==PW&&WH==PH&&BG.width==WW,'map 7 builds from camp.json through the custom-map loader');
ok(MP[7].n=='Campground'&&MUN[7]===5&&MPD[7]&&MPI[7]&&MT[7]&&HS.LT&&HS.LT.t=='dusk'&&HS.HO&&HS.HO.length>=12,'map number 7 keeps its name, its picture and Charles, and knows its '+(HS.HO?HS.HO.length:0)+' rooms');
ok(HS.BNP&&HS.BNP.length==3,'three workbenches: by the mess hall, by the boathouse, by the trading post');
const cell=(x,y)=>Math.floor(y/gs)*gw+Math.floor(x/gs);
{const F=new Int16Array(gw*gh);bfs(F,HS.px,HS.py);let pk=0,ex=[];for(let k=0;k<gw*gh;k++)if(!bl[k]&&F[k]<0){pk++;if(ex.length<4)ex.push([(k%gw)*gs,Math.floor(k/gw)*gs])}ok(!pk,'no pockets: every open spot can be reached ('+pk+' cells cannot '+JSON.stringify(ex)+')');
 const at=([x,y])=>!bl[cell(x,y)]&&F[cell(x,y)]>=0,IN={'the mess hall':[1500,560],'its kitchen':[1960,560],'its store room':[2040,740],'the health lodge (over the footbridge)':[1010,330],'the footbridge':[1240,513],'the boathouse':[850,1010],'the end of the swim dock':[sxC(1200)-275,1200],'the stage':[1620,1640],'the shower house':[2540,1340],'the trading post':[2160,1960],'the arts & crafts tent':[1395,1420],'the bus loop':[2560,1980]};
 const bad=Object.keys(IN).filter(k=>!at(IN[k]));ok(!bad.length,'you can walk to '+Object.keys(IN).join(', ')+(bad.length?' — not: '+bad.join(', '):''));
 const hs=HS.HO.filter(h=>h.w<400);let hb=0;for(const h of hs){let any=0;for(let y=h.y+4;y<h.y+h.h&&!any;y+=8)for(let x=h.x+4;x<h.x+h.w&&!any;x+=8)if(at([x,y]))any=1;if(!any)hb++}ok(!hb,'every room can be walked into ('+hb+' cannot)');
 ok(!at([300,1200])&&!at([600,700])&&!at([2700,40])&&!at([3340,900]),'the lake and the woods can\\'t be walked into');
 ok(D.spawns.length>=8&&D.spawns.every(p=>at([p.x,p.y])),D.spawns.length+' zombie spawn points where the trails and the road come out of the woods, all on open ground you can reach')}
start();
{let err='';try{const T_=AR('tent')[0];P.x=1390;P.y=1380;cam.x=P.x-W/2;cam.y=P.y-H/2;for(let t=0;t<2;t+=.1)CMAI.tent.top(T_,t);for(const f of FX('fire'))CMFXI.fire&&CMFXI.fire.anim&&CMFXI.fire.anim(f,1);for(const f of FX('fireflies'))CMFXI.fireflies.top(f,1.5)}catch(e){err=e.message}ok(!err,'the arts & crafts tent\\'s roof, the fires and the fireflies run '+err)}
// ---------- campaign: waves and Charles ----------
const A=S.ac;const RNG=new Set([11,19]);
const play=(w0,w1,lim)=>{const R={spawned:0,reached:0,stuck:0,waves:0,err:'',sk:{}};try{for(let w=w0;w<=w1;w++){if((mode!='play'||!!BRK))nextWave();let t=0;const seen=new Map();
 while((mode=='play'&&!BRK)&&t<lim){for(const p of PL){p.mx=Math.max(p.mx,20);p.hp=p.mx}tick(1);t++;for(const z of zs){if(ZT[z.t].sv)continue;if(!seen.has(z)){seen.set(z,t);R.spawned++}
  const dz=Math.hypot(z.x-P.x,z.y-P.y);if(z.hp>0&&(dz<80||dz<400&&RNG.has(z.t))){R.reached++;hurt(z,z.hp+1,0,0)}else if(z.hp>0&&t-seen.get(z)>5000){R.stuck++;const k=z.t+'@'+Math.round(dz)+'('+Math.round(z.x)+','+Math.round(z.y)+')';R.sk[k]=(R.sk[k]||0)+1;hurt(z,z.hp+1,0,0)}}}
 if((mode=='play'&&!BRK)){toSp=0;for(let q=0;q<4000&&(mode=='play'&&!BRK);q++){for(const z of zs.slice())if(z.hp>0)hurt(z,z.hp+1,0,0);toSp=0;tick(1)}}R.waves++}}catch(e){R.err=e.stack||e.message}return R};
A.un=[0];A.cp=CORD.length;A.tut=1;A.bm=[0,1,2].map(()=>CORD.reduce((v,m)=>m==7?v:v|1<<m,0));S.lm='off';setGM('c');mapId=7;S.mp=7;sel=0;start();ok(mapId===7&&HS.CM==='builtin-camp','a campaign run starts in the Campground');
{let R=play(1,3,5000);const R1=R;wave=18;zs=[];toSp=0;mode='shop';const R2=play(19,19,5000);R={spawned:R1.spawned+R2.spawned,reached:R1.reached+R2.reached,stuck:R1.stuck+R2.stuck,waves:R1.waves+R2.waves,err:R1.err||R2.err,sk:Object.assign(R1.sk,R2.sk)};
 ok(!R.err&&R.waves==4&&wave==19,'campaign waves 1–3 and 19 play through the camp '+R.err);
 ok(R.spawned>60&&R.stuck<=Math.max(2,R.spawned*.02),'zombies reach the player ('+R.reached+' of '+R.spawned+' reached; '+R.stuck+' slow ones '+JSON.stringify(R.sk)+')')}
{if((mode!='play'||!!BRK))nextWave();const b=zs.find(q=>ZT[q.t].sv);ok(wave==20&&b&&b.ci==5,'wave 20: Charles');
 let err='',near_=0;try{for(let f=0;f<3000&&b.hp>0&&!near_;f++){for(const p of PL){p.mx=Math.max(p.mx,20);p.hp=p.mx}tick(1);if(Math.hypot(b.x-P.x,b.y-P.y)<300)near_=1}}catch(e){err=e.message}ok(!err&&near_,'he finds the player across the camp '+err);
 b.ph=2;b.iv=0;hurt(b,1e9,0,0);tick(Math.ceil(6/.016));ok(bBt(A,DIF(),7)&&A.un.includes(5),'beating him wins the map, and he joins')}
// ---------- free play, the Workshop, the editor, the old code ----------
setGM('f');mapId=7;S.mp=7;start();{const R=play(1,1,4000);ok(!R.err&&wave>=1,'a Free Play run plays '+R.err);if((mode!='play'||!!BRK))nextWave();const row=olRow();ok(row&&row.map===7&&row.mode=='f','the leaderboard board is still map 7');over(1)}
{const h=wsBuiltins();ok(h.includes('wsBuiltin(7,1)')&&h.includes('Campground'),'the Workshop lists the Campground under Built-in maps')}
await wsBuiltin(7,0);{const e=CML.find(q=>q.doc&&q.doc.name=='Campground (my copy)'),D2=bimDoc(7);ok(e&&e.doc.obj.length==D2.obj.length&&e.doc.lt.t=='dusk','EDIT A COPY makes your own copy with every piece, at dusk')}
{const NK=['campbell','lbench','lgchair','kayak','kayakrack','pfdrack','raft','canoeup','tablex','bearbox','outhouse','hammock','noticeb','campbunk','dtent','micstand','cpicnic','archtgt','tether'];
 const ND=['backpack','duffel','clothes','teddy','smores','guitar','flashlight','paddle','campshirt'];
 ok(NK.every(k=>OB[k]&&EDPN[k])&&EDCAT.some(c=>c[0]=='camp')&&CMAI.stage&&CMPAI.buoys&&ND.every(k=>CMDI[k]),'the new pieces are all in the editor (a new group: Summer camp & waterfront)');
 const g=document.createElement('canvas').getContext('2d');let err='';for(const k of NK)try{for(const v of[0,.3,.55,.8,.95])OB[k].f(g,100,100,v,'#c0392b','A|B|C')}catch(e){err+=k+': '+e.message+' '}
 try{for(const a of[{a:'stage',x:0,y:0,w:300,h:70,o:{bd:1}},{a:'stage',x:0,y:0,w:90,h:200,o:{bd:0}}])CMAI[a.a].f(g,a);CMPAI.buoys.f(g,[[0,0],[100,20],[180,90]],{w:10});
  for(const k of ND)for(const v of[.1,.4,.7,.95])CMDI[k].f(g,v,pcK('#c0392b'),'')}catch(e){err+='kit: '+e.message}ok(!err,'every piece draws '+err);
 ok(typeof mapCamp=='undefined','the old Campground map code is gone')}
console.log('TOTAL fails '+fails+' of '+n);
}
`;
const AF=Object.getPrototypeOf(async function(){}).constructor;
new AF('docL','ivs',code+test)(docL,ivs).catch(e=>{console.log('FAIL crashed: '+(e&&e.stack||e));console.log('TOTAL fails 1');process.exitCode=1});
