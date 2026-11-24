// Map 0, Dave's House (src/maps/suburb.json; once the Suburb): it loads, its doors are open, spawns reach the player, the tutorial in
// Dave's house, the survivor boss, campaign progress, Free Play records, split screen, low memory, and the Workshop copy.
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
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const FS=REQ('fs'),PATH=REQ('path');const ROOT=PATH.dirname(PATH.resolve(process.argv[2]));
const near=(a,b,e)=>Math.abs(a-b)<=(e||.11);

// ---------- the map file loads ----------
{const r=cmRead(JSON.stringify(BIMF[0]));ok(r.doc&&!r.errors.length&&!r.warnings.length,'suburb.json loads with no errors or warnings '+(r.errors||[]).concat(r.warnings||[]).slice(0,3).join('; '));
const L=cmLint(r.doc).filter(p=>p.lv=='err'||p.lv=='warn');ok(!L.length,'nothing in the Problems list (every spawn reaches the player, the bench is reachable) '+L.map(p=>p.m).slice(0,2).join('; '));
const D=r.doc;ok(D.w==115&&D.h==65&&D.name=="Dave's House"&&D.lt&&D.lt.t=='sunset'&&near(D.lt.a,.6),'Dave\\'s House: 115×65 tiles, early sunset light ('+(D.lt&&D.lt.t)+' '+(D.lt&&D.lt.a)+')');
const T=D.obj.filter(o=>o.k=='foak'||o.k=='fpine');ok(T.length>2000&&T.every(o=>/^#[0-9a-f]{6}$/i.test(o.c||'')),'the woods: '+T.length+' forest trees, every one with a dark canopy colour');
ok(D.obj.filter(o=>!o.dc&&!o.fx&&!o.veh).every(o=>cmOB(o.k)),'every prop is a real kit prop');
ok(['kc_range','kfridge','mbed','bed','sofa3','tvs_tv','coffeetable','wardrobe','toilet','washer'].every(k=>D.obj.some(o=>o.k==k&&o.sol===false)),'house furniture can be walked over (as on the old Suburb)');
const B=D.obj.filter(o=>o.k=='craftbench');ok(B.length==1&&B[0].x>759&&B[0].x<935&&B[0].y>780&&B[0].y<905,'one crafting bench, at the back of Dave\\'s garage');
{const V=D.obj.filter(o=>o.veh);ok(V.length==4&&V.some(v=>v.veh=='van'&&v.x>759&&v.x<935&&v.y>905&&v.y<1058),'four vehicles, the van parked in Dave\\'s garage')}}
mapId=0;S.mp=0;setGM('f');build();
ok(HS.CM==='builtin-suburb'&&WW==3680&&WH==2080&&BG.width==WW,'map 0 builds from suburb.json through the custom-map loader');
ok(MP[0].n=="Dave's House"&&CORD[0]===0&&MUN[0]===2,'map number 0 is Dave\\'s House and keeps its campaign slot (first map of Hometown) and its survivor boss');
ok(HS.LT&&HS.LT.t=='sunset'&&cmLtP('sunset')&&HS.LT.L.some(s=>s.rect)&&HS.LT.L.some(s=>s.c=='#78dc78'),'the light: early sunset, Dave\\'s rooms lit, the TV\\'s glow');

// ---------- the houses: doorways open, nothing standing in them ----------
{const cell=(x,y)=>bl[Math.floor(y/gs)*gw+Math.floor(x/gs)];
 // Dave's: front door, patio doors, the garage's side door, the hall into the living room, both wing bedrooms, the master bath, the garage door from the living room
 // next door: front door, back door onto the deck, side door, the garage's side door
 const D=[[676,1058],[668,780],[935,872],[600,1020],[476,1058],[556,1058],[450,960],[759,934],[2587,894],[2548,590],[2812,752],[2931,567]];
 ok(D.every(([x,y])=>!cell(x,y)),'every outside door and the doors between rooms are open for zombies '+D.filter(([x,y])=>cell(x,y)).map(p=>p.join(',')).join(' '));
 {const Q=bimDoc(0);ok(!cmDoorBlocks(Q).length&&cmDoors(Q).length>=20,'no prop or piece of furniture stands in any of the '+cmDoors(Q).length+' doorways '+cmDoorBlocks(Q).slice(0,2).map(b=>JSON.stringify(b)).join(' '))}}

// ---------- start, spawns, no-spawn area, menu camera ----------
ok(near(HS.px,680)&&near(HS.py,1000),'the player starts in Dave\\'s living room ('+HS.px+','+HS.py+')');
ok(near(HS.cx,680)&&near(HS.cy,960),'the menu camera looks at the living room (menu view feature)');
ok(HS.nx0==240&&HS.ny0==440&&HS.nx1==1250&&HS.ny1==1500&&!NOGO.length,'the no-spawn box round Dave\\'s yard only stops zombies from off-screen (spawn points still work, bosses may land there)');
ok(HS.CZ&&HS.sp.length==bimDoc(0).spawns.length&&HS.sp.length>=40,'zombie spawn points along the trail, at the edge of the woods and at the west end of the road ('+HS.sp.length+')');
ok(!SM.length,'no smoke (no crash on this map)');
{const F=new Int16Array(gw*gh);bfs(F,HS.px,HS.py);const bad=HS.sp.filter(p=>{const i=Math.floor(p[0]/gs),j=Math.floor(p[1]/gs);for(let dj=-1;dj<=1;dj++)for(let di=-1;di<=1;di++)if(F[(j+dj)*gw+i+di]>=0)return 0;return 1});
 ok(!bad.length,'zombies can walk to the player from every spawn point ('+bad.length+' cannot '+bad.slice(0,3).map(p=>p.map(Math.round).join(',')).join(' ')+')')}
start();{ZSPN.on='classic';const R0=[];for(let i=0;i<40;i++){const z=spawnZ(0);if(z){R0.push(z);zs.splice(zs.indexOf(z),1)}}ZSPN.on='near';ok(R0.length==40&&R0.every(z=>HS.sp.some(p=>Math.hypot(p[0]-z.x,p[1]-z.y)<21)),'zombies appear at the spawn points')}

// ---------- the tutorial and the living room ----------
{const G=tutGeo(),wallAt=(x,y)=>WL.some(w=>w[4]!=2&&x>=w[0]&&x<=w[0]+w[2]&&y>=w[1]&&y<=w[1]+w[3]);
 ok(!wallAt(G.cx,G.y1)&&wallAt(G.cx-28,G.y1)&&wallAt(G.cx+30,G.y1)&&!wallAt(G.kx,G.y0)&&wallAt(G.x0,G.y0+60)&&wallAt(G.x1,G.y0+30)&&G.X.every(b=>!wallAt(b[0]+b[2]/2,b[1]+b[3]/2)),'Dave\\'s house is where the tutorial expects it (front and patio doors at tutGeo, walls beside them, the doors it shuts are doorways)');
 const D=bimDoc(0),inR=o=>o.x>G.x0+220&&o.x<G.x0+380&&o.y>905&&o.y<1060;ok(D.obj.some(o=>o.k=='sofa3'&&o.c=='#6a4a8a'&&inR(o))&&D.obj.some(o=>o.k=='tvs_tv'&&inR(o))&&D.obj.some(o=>o.k=='curtain'&&inR(o))&&D.obj.some(o=>o.k=='flamp'&&inR(o))&&D.obj.some(o=>o.fx=='light'&&o.c=='#78dc78'&&inR(o))&&D.areas.some(a=>a.a=='floor'&&a.o.pt=='plank'&&a.c=='#5a3a24'&&a.x==600),'the living room as on the old Suburb and in the opening video: dark planks, purple couch, TV and its green glow, floor lamp, red curtains');
 ok(D.areas.filter(a=>a.a=='roomlight'&&a.x>=G.x0&&a.x<G.x1).length==9,'every room of Dave\\'s house has its lights on')}
{TUTF=1;setGM('c');mapId=0;S.mp=0;let er='';try{tutStart();tick(60)}catch(e){er=e.message}ok(!er&&TUT&&HS.CM==='builtin-suburb'&&WL.filter(w=>w[4]==2&&(w[2]==64||w[3]==8||w[2]==8)).length>=5,'the tutorial starts in Dave\\'s house and shuts its doors '+er);try{tutEnd&&tutEnd()}catch(e){}TUT=0;TUTF=0}

// ---------- playtest: campaign waves 1–20 with the survivor boss ----------
const A=S.ac;
// spitters and healers keep their distance on purpose: within 400 px they have reached the player
const RNG=new Set([11,19]);
const play=(w0,w1,lim)=>{const R={spawned:0,reached:0,stuck:0,waves:0,err:'',sk:{}};try{for(let w=w0;w<=w1;w++){if((mode!='play'||!!BRK))nextWave();let t=0;const seen=new Map();
 while((mode=='play'&&!BRK)&&t<lim){for(const p of PL){p.mx=Math.max(p.mx,20);p.hp=p.mx}tick(1);t++;for(const z of zs){if(ZT[z.t].sv)continue;if(!seen.has(z)){seen.set(z,t);R.spawned++}
  const dz=Math.hypot(z.x-P.x,z.y-P.y);if(z.hp>0&&(dz<80||dz<400&&RNG.has(z.t))){R.reached++;hurt(z,z.hp+1,0,0)}else if(z.hp>0&&t-seen.get(z)>2400){R.stuck++;const k=z.t+'@'+Math.round(Math.hypot(z.x-P.x,z.y-P.y))+'('+Math.round(z.x)+','+Math.round(z.y)+')';R.sk[k]=(R.sk[k]||0)+1;hurt(z,z.hp+1,0,0)}}}
 if((mode=='play'&&!BRK)){toSp=0;for(let q=0;q<600&&(mode=='play'&&!BRK);q++){for(const z of zs.slice())if(z.hp>0)hurt(z,z.hp+1,0,0);toSp=0;tick(1)}}R.waves++;if(REQ('process').env.SUBLOG)console.log('WAVE '+w+' ticks '+t+' spawned '+R.spawned+' reached '+R.reached+' stuck '+R.stuck+' '+JSON.stringify(R.sk)+' mode '+mode+' wave '+wave)}}catch(e){R.err=e.stack||e.message}return R};
A.un=[0];A.cp=0;A.tut=1;delete A.bm;S.lm='off';setGM('c');mapId=0;S.mp=0;sel=0;start();
// the whole campaign (waves 1–19) with SUBURB_FULL=1 (about 8 minutes); by default waves 1–4 and 19 (about a minute)
{const FULL=!!REQ('process').env.SUBURB_FULL;let R=play(1,FULL?19:4,5000);if(!FULL){const R1=R;wave=18;zs=[];toSp=0;mode='shop';const R2=play(19,19,5000);R={spawned:R1.spawned+R2.spawned,reached:R1.reached+R2.reached,stuck:R1.stuck+R2.stuck,waves:R1.waves+R2.waves+14,err:R1.err||R2.err,sk:Object.assign(R1.sk,R2.sk)}}
 ok(!R.err&&R.waves==19&&wave==19,'campaign waves '+(FULL?'1–19':'1–4 and 19')+' play through on Dave\\'s House '+R.err);
 ok(R.spawned>(FULL?700:100)&&R.stuck<=Math.max(2,R.spawned*.01),'zombies reach the player in the house ('+R.reached+' of '+R.spawned+' reached; '+R.stuck+' slow ones '+JSON.stringify(R.sk)+')')}
{if((mode!='play'||!!BRK))nextWave();const b=zs.find(q=>ZT[q.t].sv);ok(wave==20&&b&&b.ci==MUN[0],'wave 20: the map\\'s survivor boss arrives ('+(b&&ZT[b.t].n)+')');
 let near_=0;for(let f=0;f<2400&&b&&b.hp>0&&!near_;f++){P.mx=Math.max(P.mx,20);P.hp=P.mx;tick(1);const db=Math.hypot(b.x-P.x,b.y-P.y);if(db<200||los(b,P)&&db<SVS[b.ci].pd+100)near_=1}ok(near_,'the boss finds the player in the house: close by, or in sight within his shooting distance (on the old map too it took up to ~30 s)');
 b.ph=2;hurt(b,1e9,0,0);tick(Math.ceil(6/.016));ok(A.cp==1&&A.un.includes(MUN[0])&&mapOK(3)&&mapOK(1),'beating the boss keeps campaign progress: survivor joins, School and Warehouse open')}

// ---------- free play: best wave, leaderboard board, checkpoint ----------
setGM('f');mapId=0;S.mp=0;start();{const b0=S.best;const R=play(1,3,4000);ok(!R.err&&wave>=3,'a Free Play run plays '+R.err);
 if((mode!='play'||!!BRK))nextWave();const row=olRow();ok(row&&row.map===0&&row.mode=='f','the leaderboard board is still map 0');
 cpSave();let c=null;try{c=JSON.parse(localStorage[CPK])}catch(e){}ok(c&&c.m===0&&c.cm===undefined&&c.w==wave,'checkpoints save as map 0');ok(S.best>=3&&S.best>=b0,'best wave kept');over(1)}

// ---------- split screen, low memory, building twice ----------
{const B={name:'B',xp:0,lv:1,sp:0,sk:{},pts:0,un:[0],cp:0};S.prof=[B];setGM('f');LBY={s:[{inp:'km',ac:A,ci:0,v:0,rdy:1},{inp:0,ac:B,ci:0,v:1,rdy:1}]};mapId=0;let er='';try{startMP();for(let f=0;f<200;f++){for(const p of PL){p.mx=Math.max(p.mx,20);p.hp=p.mx}tick(1)}}catch(e){er=e.message}
 ok(!er&&MPn==2&&HS.CM==='builtin-suburb'&&PL.every(p=>Math.hypot(p.x-HS.px,p.y-HS.py)<120),'split screen plays Dave\\'s House '+er);over(1);S.prof=[];MPn=0}
{S.lm='on';setGM('f');mapId=0;build();ok(LMX&&BGL&&BG.width<=1,'low-memory mode keeps a half-size background');build();build();
 {const sp=subSpr(0,20,.5),own=document.createElement('canvas');sp.width=sp.width||44;own.width=50;const keep=HS.VH;HS.VH=[{cv:sp,sh:1},{cv:own}];bgFree();ok(sp.width>0&&own.width==0,'building the next map frees walk-behind pictures but keeps the shared tree pictures (sh: 1)');HS.VH=keep}
 ok(bimDoc(0).obj.filter(o=>o.k=='foak'||o.k=='fpine').every(o=>OB[o.k].c[0]==12&&OB[o.k].cf==2),'forest trees: 12 px see-through trunks');S.lm='off';build();ok(!BGL&&BG.width==3680,'back to the full background')}

// ---------- the Map Workshop: edit a copy ----------
{const h=wsBuiltins();ok(h.includes('Built-in maps')&&h.includes('wsBuiltin(0,1)')&&h.includes('EDIT A COPY'),'the Workshop lists Dave\\'s House under Built-in maps with EDIT A COPY')}
await wsBuiltin(0,0);{const e=CML.find(q=>q.doc&&q.doc.name=="Dave's House (my copy)"),D=bimDoc(0);ok(e&&e.doc.id!=D.id&&e.doc.obj.length==D.obj.length&&e.doc.walls.length==D.walls.length,'a copy with every piece goes into my maps');
 if(e){e.doc.obj.find(o=>o.k=='sofa3').x+=50;ok(!D.obj.some(o=>o.k=='sofa3'&&o.x==e.doc.obj.find(q=>q.k=='sofa3').x),'changing the copy leaves the built-in map alone');setGM('f');mapId=e.key;build();ok(HS.CM===e.doc.id&&cmIs(mapId)&&WL.length>1300,'the copy plays as a custom map')}}
mapId=0;build();ok(HS.CM==='builtin-suburb','map 0 is still the built-in Dave\\'s House');
console.log('TOTAL fails '+fails+' of '+n);
}
`;
const AF=Object.getPrototypeOf(async function(){}).constructor;
new AF('docL','ivs',code+test)(docL,ivs).catch(e=>{console.log('FAIL crashed: '+(e&&e.stack||e));console.log('TOTAL fails 1');process.exitCode=1});
