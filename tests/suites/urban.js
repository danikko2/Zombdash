// Urban Outskirts (map 11) as a map file, at the owner's request: sunrise, a neighborhood run down before the outbreak and
// worse now, a lot of detail; with the places the owner chose: a strip of shops, a motel and an apartment block, a freeway
// overpass with a camp under it, a rail line and a salvage yard, an abandoned gas station, overgrown lots; the houses are
// holdouts that didn't make it; bigger. Reach, the Mechanic, waves, Free Play, the Workshop copy, the new pieces.
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
const PW=3584,PH=2688;
// ---------- the map file loads ----------
const D=(()=>{const r=cmRead(JSON.stringify(BIMF[11]));ok(r.doc&&!r.errors.length&&!r.warnings.length,'urban.json loads with no errors or warnings '+(r.errors||[]).concat(r.warnings||[]).slice(0,3).join('; '));return r.doc})();
{const L=cmLint(D).filter(p=>p.lv=='err'||p.lv=='warn');ok(!L.length,'nothing in the Problems list '+L.map(p=>p.m).slice(0,2).join('; '));
 ok(D.w==112&&D.h==84&&D.id=='builtin-urban'&&D.name=='Urban Outskirts','112×84 tiles (3584×2688 px, up from 2600×2200): grown to fit the new places');
 ok(D.obj.filter(o=>!o.dc&&!o.fx&&!o.veh&&!o.f).every(o=>cmOB(o.k)),'every prop is a real kit prop');ok(!cmDoorBlocks(D).length,'no prop stands in a doorway')}
const K=k=>D.obj.filter(o=>o.k==k),FX=k=>D.obj.filter(o=>o.fx==k),DC=k=>D.obj.filter(o=>o.dc==k),V=k=>D.obj.filter(o=>o.veh==k),PA=k=>D.paths.filter(p=>p.p==k),AR=k=>D.areas.filter(a=>a.a==k),VA=()=>D.obj.filter(o=>o.veh);
const WL=s=>D.walls.filter(w=>w.s==s);
// ---------- sunrise ----------
{ok(D.lt&&D.lt.t=='sunrise'&&D.lt.a==.6,'sunrise light');const S_=AR('skyline')[0];ok(S_&&S_.y==0&&S_.w==PW&&S_.o.dawn==1&&CMAI.skyline.opts.some(o=>o[0]=='dawn'),'the skyline at sunrise, the sun coming up behind the towers');
 let err='',lit=0;const g=new Proxy({},{get:(t,k)=>k=='arc'?()=>{lit++}:(k in t?t[k]:()=>{}),set:(t,k,v)=>{t[k]=v;return true}});try{CMAI.skyline.f(g,S_)}catch(e){err=e.message}ok(!err&&lit>=2,'the dawn sky draws, with its sun '+err);
 ok(AR('sunshadow').length>=15,'long morning shadows west of the buildings');ok(K('cobra').length>=4&&K('cobraf').length>=3&&K('cobrax').length>=3,'street lights still burning at dawn, some failing, some dead')}
// ---------- run down before ----------
{ok(VA().filter(v=>v.rust).length>=25,VA().filter(v=>v.rust).length+' rusty cars');ok(AR('weeds').length>=20&&PA('dirtpatch').length>=40,'weeds, dead lawns, worn ground');
 ok(DC('crack_grass').length+DC('crack').length>=60&&DC('pothole').length>=5,'cracked, potholed streets with weeds in the cracks');ok(PA('road').every(p=>p.o.s=='worn'&&p.o.fade==1),'worn roads with faded paint');
 ok(K('tpole').length>=12&&PA('powerline').length==2,'telephone poles and sagging wires');ok(K('mattress').length>=6&&K('fridgex').length>=4&&K('tirestack').length>=6,'dumped mattresses, appliances, tires')}
// ---------- the places the owner chose ----------
{ok(['CORNER MART','SUDS LAUNDROMAT','PAWN & GOLD','LIQUOR','CHECKS CASHED'].every(t=>K('deptsign').some(o=>o.tx==t))&&WL('bars').length>=1&&WL('window_b').length>=4,'the strip of shops: a corner mart, a laundromat, a pawn shop, a liquor store, a check-cashing place behind bars');
 ok(K('motelsign').length==1&&/SUNSET/.test(K('motelsign')[0].tx)&&AR('drypool').length==1&&K('bed').length>=20,'the Sunset Motor Inn: its pole sign, nine rooms, a drained pool');
 ok(K('nameplate').some(o=>o.tx=='LINCOLN ARMS'),'the Lincoln Arms apartments');
 const O_=AR('overpass')[0];ok(O_&&O_.w==PW&&O_.o.cars==1&&cmAreaBoxes(O_).length>=20&&cmAreaBoxes(O_).every(b=>b[4]==1),'the freeway overpass: a jammed deck over people, on '+(O_?cmAreaBoxes(O_).length:0)+' pillars');
 ok(K('tarpshel').length>=3&&K('tent').length>=3&&DC('cardbed').length>=4&&K('firebarrel').length>=3&&K('cartjunk').length>=8,'the camp under it: tarps, tents, cardboard beds, burn barrels, shopping carts');
 ok(PA('rails').length==1&&K('boxcar').length==2&&K('rrxing').length==3,'the rail line, two freight cars, a crossing on every street');
 ok(K('carstack').length>=3&&K('crushcar').length>=4&&K('grapple').length==1&&K('officetrl').length==1&&K('tiremtn').length==1,'Ace Salvage: stacks of crushed cars, a grapple loader, the office trailer, a mountain of tires');
 ok(K('gcanopy').length==1&&K('gpump').length==2&&K('pricesign').some(o=>/CLOSED/.test(o.tx)),'the dead gas station: its canopy, two pump islands, CLOSED');
 ok(AR('weeds').filter(a=>a.w>200&&a.h>300).length>=4,'overgrown vacant lots')}
// ---------- holdouts that didn't make it ----------
{ok(K('plywood').filter(o=>/ALIVE|HELP|INSIDE|ROOM|OUT/.test(o.tx||'')).length>=6&&DC('spray').length>=8,'boarded-up houses: plywood and spray paint (WE\\'RE ALIVE, 3 INSIDE, NO MORE ROOM)');
 ok(WL('barricade').length>=5&&WL('window_b').length>=20,'front doors barricaded, windows boarded');ok(K('furnpile').length==1&&PA('sandbags').length==2&&DC('deadz').length>=25,'a barricaded street that was overrun');
 ok(AR('floor').filter(a=>a.o.in).length>=60,'every house, motel room and apartment is indoors (the Mechanic knows when you\\'re inside)')}
// ---------- the game builds it ----------
mapId=11;S.mp=11;setGM('f');build();
ok(HS.CM==='builtin-urban'&&WW==PW&&WH==PH&&BG.width==WW,'map 11 builds from urban.json through the custom-map loader');
ok(MP[11].n=='Urban Outskirts'&&MUN[11]===12&&MPD[11]&&MPI[11]&&MT[11]&&HS.LT&&HS.LT.t=='sunrise'&&HS.HO&&HS.HO.length>=50,'map number 11 keeps its name, its picture and the Mechanic, and knows its '+(HS.HO?HS.HO.length:0)+' rooms');
ok(HS.BNP&&HS.BNP.length==3,'three workbenches: the strip mall lot, the motel, the salvage yard');
const cell=(x,y)=>Math.floor(y/gs)*gw+Math.floor(x/gs);
{const F=new Int16Array(gw*gh);bfs(F,HS.px,HS.py);let pk=0,ex=[];for(let k=0;k<gw*gh;k++)if(!bl[k]&&F[k]<0){pk++;if(ex.length<4)ex.push([(k%gw)*gs,Math.floor(k/gw)*gs])}ok(!pk,'no pockets: every open spot can be reached ('+pk+' cells cannot '+JSON.stringify(ex)+')');
 const at=([x,y])=>!bl[cell(x,y)]&&F[cell(x,y)]>=0,IN={'the corner mart':[1000,770],'the laundromat':[1120,760],'the gas station shop':[400,720],'a motel room':[2300,720],'the motel office':[2700,1050],'an apartment':[3080,760],'the salvage yard':[3330,2200],'under the overpass':[1500,320],'the drained pool':[2350,930]};
 const bad=Object.keys(IN).filter(k=>!at(IN[k]));ok(!bad.length,'you can walk into '+Object.keys(IN).join(', ')+(bad.length?' — not: '+bad.join(', '):''));
 const hs=HS.HO.filter(h=>h.w<400);let hb=0;for(const h of hs){let any=0;for(let y=h.y+4;y<h.y+h.h&&!any;y+=8)for(let x=h.x+4;x<h.x+h.w&&!any;x+=8)if(at([x,y]))any=1;if(!any)hb++}ok(!hb,'every room can be walked into ('+hb+' cannot)');
 ok(D.spawns.length>=25&&D.spawns.every(p=>at([p.x,p.y])),D.spawns.length+' zombie spawn points round the edges, all on open ground you can reach')}
start();
{const C=HS.CX;ok(C&&C.O.some(it=>it.o.k=='gcanopy'),'in the game the gas station canopy hangs over people');
 let err='';try{const o=AR('overpass')[0];P.x=1500;P.y=320;cam.x=1500-W/2;cam.y=320-H/2;for(let t=0;t<3;t+=.1)CMAI.overpass.top(o,t);const e=UBOV.get(o)||[...[]];const i=Math.floor(1500/48);ok(e&&e.A[i]<.5&&e.A[Math.floor(400/48)]>.9,'the overpass opens up over a player under it, and stays closed further along');
  for(const f of FX('smoke'))CMFXI.smoke&&CMFXI.smoke.anim&&CMFXI.smoke.anim(f,1);ubMotelAn(K('motelsign')[0],1.2)}catch(e){err=e.message}ok(!err,'the overpass, the smoke and the motel\\'s VACANCY sign run '+err)}
// ---------- campaign: waves and the Mechanic ----------
const A=S.ac;const RNG=new Set([11,19]);
const play=(w0,w1,lim)=>{const R={spawned:0,reached:0,stuck:0,waves:0,err:'',sk:{}};try{for(let w=w0;w<=w1;w++){if((mode!='play'||!!BRK))nextWave();let t=0;const seen=new Map();
 while((mode=='play'&&!BRK)&&t<lim){for(const p of PL){p.mx=Math.max(p.mx,20);p.hp=p.mx}tick(1);t++;for(const z of zs){if(ZT[z.t].sv)continue;if(!seen.has(z)){seen.set(z,t);R.spawned++}
  const dz=Math.hypot(z.x-P.x,z.y-P.y);if(z.hp>0&&(dz<80||dz<400&&RNG.has(z.t))){R.reached++;hurt(z,z.hp+1,0,0)}else if(z.hp>0&&t-seen.get(z)>5000){R.stuck++;const k=z.t+'@'+Math.round(dz)+'('+Math.round(z.x)+','+Math.round(z.y)+')';R.sk[k]=(R.sk[k]||0)+1;hurt(z,z.hp+1,0,0)}}}
 if((mode=='play'&&!BRK)){toSp=0;for(let q=0;q<4000&&(mode=='play'&&!BRK);q++){for(const z of zs.slice())if(z.hp>0)hurt(z,z.hp+1,0,0);toSp=0;tick(1)}}R.waves++}}catch(e){R.err=e.stack||e.message}return R};
A.un=[0];A.cp=CORD.length;A.tut=1;A.bm=[0,1,2].map(()=>CORD.reduce((v,m)=>m==11?v:v|1<<m,0));S.lm='off';setGM('c');mapId=11;S.mp=11;sel=0;start();ok(mapId===11&&HS.CM==='builtin-urban','a campaign run starts in Urban Outskirts');
{let R=play(1,3,5000);const R1=R;wave=18;zs=[];toSp=0;mode='shop';const R2=play(19,19,5000);R={spawned:R1.spawned+R2.spawned,reached:R1.reached+R2.reached,stuck:R1.stuck+R2.stuck,waves:R1.waves+R2.waves,err:R1.err||R2.err,sk:Object.assign(R1.sk,R2.sk)};
 ok(!R.err&&R.waves==4&&wave==19,'campaign waves 1–3 and 19 play through the outskirts '+R.err);
 ok(R.spawned>60&&R.stuck<=Math.max(2,R.spawned*.02),'zombies reach the player ('+R.reached+' of '+R.spawned+' reached; '+R.stuck+' slow ones '+JSON.stringify(R.sk)+')')}
{if((mode!='play'||!!BRK))nextWave();const b=zs.find(q=>ZT[q.t].sv);ok(wave==20&&b&&b.ci==12,'wave 20: the Mechanic');
 let err='';const hx=HS.HO.find(h=>h.w<400);try{P.x=hx.x+hx.w/2;P.y=hx.y+hx.h/2;ok(svInHouse(P),'standing in a house counts as inside for the Mechanic');for(let f=0;f<900;f++){for(const p of PL){p.mx=Math.max(p.mx,20);p.hp=p.mx}tick(1)}}catch(e){err=e.message}ok(!err,'he fights through the outskirts '+err);
 b.ph=2;b.iv=0;hurt(b,1e9,0,0);tick(Math.ceil(6/.016));ok(bBt(A,DIF(),11)&&A.un.includes(12),'beating him wins the map, and he joins')}
// ---------- free play, the Workshop, the editor, the old code ----------
setGM('f');mapId=11;S.mp=11;start();{const R=play(1,1,4000);ok(!R.err&&wave>=1,'a Free Play run plays '+R.err);if((mode!='play'||!!BRK))nextWave();const row=olRow();ok(row&&row.map===11&&row.mode=='f','the leaderboard board is still map 11');over(1)}
{const h=wsBuiltins();ok(h.includes('wsBuiltin(11,1)')&&h.includes('Urban Outskirts'),'the Workshop lists Urban Outskirts under Built-in maps')}
await wsBuiltin(11,0);{const e=CML.find(q=>q.doc&&q.doc.name=='Urban Outskirts (my copy)'),D2=bimDoc(11);ok(e&&e.doc.obj.length==D2.obj.length&&e.doc.lt.t=='sunrise','EDIT A COPY makes your own copy with every piece, at sunrise')}
{const r=cmRead(JSON.stringify(cmWrite(D)));ok(r.doc&&r.doc.obj.filter(o=>o.veh&&o.rust).length==VA().filter(v=>v.rust).length,'rusty cars save and load (the new "rusty" flag)')}
{const NK=['mattress','fridgex','washer','cartjunk','tiremtn','dumpo','plywood','furnpile','yardsign','acwin','satdish','kpool','clothesl','tarpshel','cobra','cobraf','cobrax','payphone','utilbox','motelsign','gcanopy','gpump','crushcar','carstack','grapple','officetrl'];
 const ND=['trashpile','oilsheen','cardbed','boards','hubcap','cans'];
 ok(NK.every(k=>OB[k]&&EDPN[k])&&CMAI.overpass&&CMAI.drypool&&CMAI.weeds&&ND.every(k=>CMDI[k]),'the new pieces are all in the editor');
 const g=document.createElement('canvas').getContext('2d');let err='';for(const k of NK)try{for(const v of[0,.3,.55,.8,.95])OB[k].f(g,100,100,v,'','A|B')}catch(e){err+=k+': '+e.message+' '}
 try{for(const a of[{a:'overpass',x:0,y:0,w:900,h:200,o:{pil:320,lanes:2,cars:1}},{a:'overpass',x:0,y:0,w:200,h:900,o:{pil:300,lanes:1,cars:0}},{a:'drypool',x:0,y:0,w:240,h:140,o:{water:1}},{a:'drypool',x:0,y:0,w:120,h:200,o:{water:0}},{a:'weeds',x:0,y:0,w:300,h:200,o:{d:1.5,lit:1}}]){CMAI[a.a].f(g,a);const out=[];if(CMAI[a.a].coll)CMAI[a.a].coll(a,out)}
  for(const k of ND)for(const v of[.1,.4,.7,.95])CMDI[k].f(g,v,pcK('#c0392b'),'')}catch(e){err+='kit: '+e.message}ok(!err,'every piece draws '+err);
 ok(typeof mapUrban=='undefined'&&!/mapId===11/.test(String(spBad)),'the old Urban Outskirts map code is gone')}
console.log('TOTAL fails '+fails+' of '+n);
}
`;
const AF=Object.getPrototypeOf(async function(){}).constructor;
new AF('docL','ivs',code+test)(docL,ivs).catch(e=>{console.log('FAIL crashed: '+(e&&e.stack||e));console.log('TOTAL fails 1');process.exitCode=1});
