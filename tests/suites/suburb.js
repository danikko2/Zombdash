// The Suburb (map 0) converted to a map file (src/maps/suburb.json): it loads, its walls match the old map code (tests/fixtures/suburb-walls.json),
// spawns reach the player, the tutorial, the survivor boss, campaign progress, Free Play records, split screen, low memory, and the Workshop copy.
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
const FS=REQ('fs'),PATH=REQ('path');const ROOT=PATH.dirname(PATH.resolve(process.argv[2]));
const FX=JSON.parse(FS.readFileSync(PATH.join(ROOT,'tests','fixtures','suburb-walls.json'),'utf8'));
const near=(a,b,e)=>Math.abs(a-b)<=(e||.11);

// ---------- the map file loads ----------
{const r=cmRead(JSON.stringify(BIMF[0]));ok(r.doc&&!r.errors.length&&!r.warnings.length,'suburb.json loads with no errors or warnings '+(r.errors||[]).concat(r.warnings||[]).slice(0,3).join('; '));
const L=cmLint(r.doc).filter(p=>p.lv=='err'||p.lv=='warn');ok(!L.length,'nothing in the Problems list (every spawn reaches the player) '+L.map(p=>p.m).slice(0,2).join('; '));
const D=r.doc;ok(D.w==72&&D.h==57&&D.obj.filter(o=>o.k=='foak'||o.k=='fpine').length==1240&&D.walls.filter(w=>w.s=='window').length==21&&D.walls.filter(w=>w.s=='door').length==6,'the map has the Suburb\\'s size, 1240 forest trees, 21 windows and 6 door thresholds');
ok(D.obj.filter(o=>!o.dc&&!o.fx&&!o.veh).every(o=>cmOB(o.k)),'every prop is a real kit prop');
ok(['kc_range','kfridge','bed','sofa3','tvs_tv','coffeetable','bookshelf','gcab_t'].every(k=>D.obj.some(o=>o.k==k&&o.sol===false)),'house furniture are props you can move (not solid, as the painted furniture was)');}
mapId=0;S.mp=0;setGM('f');build();
ok(HS.CM==='builtin-suburb'&&WW==2304&&WH==1824&&BG.width==WW,'map 0 builds from suburb.json through the custom-map loader');
ok(MP[0].n=='Suburb'&&CORD[0]===0&&MUN[0]===2,'map number 0 keeps its name, its campaign slot (first map of Hometown) and its survivor boss');

// ---------- walls: the same places as the old map code ----------
{const W=2304,H=1824,ras=(L,e)=>{const A=new Uint8Array(W*H);for(const w of L){const f=w[4]==2?2:1,X0=w[0]-e,Y0=w[1]-e,X1=w[0]+w[2]+e,Y1=w[1]+w[3]+e;
 for(let y=Math.max(0,Math.floor(Y0));y<Math.min(H,Math.ceil(Y1));y++)for(let x=Math.max(0,Math.floor(X0));x<Math.min(W,Math.ceil(X1));x++){const cx=x+.5,cy=y+.5;if(cx<X0||cx>X1||cy<Y0||cy>Y1)continue;const k=y*W+x;if(A[k]!=1)A[k]=f}}return A};
 const O=FX.walls,a=ras(O,-.2),b=ras(WL,-.2),A2=ras(O,.2),B2=ras(WL,.2);let gone=0,added=0,flag=0;const where=[];
 // moved on purpose: three forest trunks at the left edge (onto the map), the trash can by the middle house's back door (10 px left, out of the doorway)
 const MOVED=[[925,630,965,650]],skip=(x,y)=>x<8||MOVED.some(r=>x>=r[0]&&x<r[2]&&y>=r[1]&&y<r[3]);
 for(let i=0;i<a.length;i++){const x=i%W;if(skip(x,i/W|0))continue;
  if(a[i]&&!B2[i]){gone++;if(where.length<4)where.push('gap@'+x+','+(i/W|0))}else if(b[i]&&!A2[i]){added++;if(where.length<4)where.push('new@'+x+','+(i/W|0))}else if(a[i]&&b[i]&&a[i]!=b[i]&&A2[i]==a[i]&&B2[i]==b[i])flag++}
 ok(!gone,'no wall of the old map is missing (no new gaps) '+where.join(' '));ok(!added,'no new blocks (doorways and paths stay open) '+where.join(' '));ok(flag<40,'see-through walls (fences, trunks) stay see-through, solid stay solid ('+flag+' px differ at overlaps)');
 const edge=WL.filter(w=>near(w[0],-6,.01)&&w[2]==12&&w[4]==2).length;ok(edge==3,'only the 3 trunks that stood off the left edge moved (by 2–4 px)')}
// every doorway of the three houses is walkable on the pathfinding grid
{const cell=(x,y)=>bl[Math.floor(y/gs)*gw+Math.floor(x/gs)];const D=[[1085,1030],[983,650],[505+140,1030],[1675,1030],[1574.2,670],[1085,840],[1255,805.8],[1320,1030]];
 ok(D.every(([x,y])=>!cell(x,y)),'front, back, hall, garage and house-to-garage doorways are open for zombies');
 ok(!WL.some(w=>w[4]!=2&&1085>w[0]&&1085<w[0]+w[2]&&1030>w[1]&&1030<w[1]+w[3]),'the middle house\\'s front door is not blocked')
 {const D=bimDoc(0);ok(!cmDoorBlocks(D).length&&cmDoors(D).length>=30,'no prop or piece of furniture stands in any of the '+cmDoors(D).length+' doorways (doors, garage openings, gates)')}}

// ---------- start, spawns, no-spawn area, menu camera, smoke ----------
ok(near(HS.px,FX.start[0])&&near(HS.py,FX.start[1]),'player start as before ('+HS.px+','+HS.py+')');
ok(near(HS.cx,FX.menu[0])&&near(HS.cy,FX.menu[1]),'the menu camera looks at the same spot (menu view feature)');
ok(same([HS.nx0,HS.ny0,HS.nx1,HS.ny1],FX.nospawn)&&!(HS.NS||[]).length&&!NOGO.length,'the no-spawn box only stops zombies from off-screen, as before (spawn points inside it still work, bosses may land there)');
ok(HS.CZ&&HS.CZ.p.length==FX.spawns.length&&FX.spawns.every((p,i)=>near(p[0],HS.CZ.p[i][0])&&near(p[1],HS.CZ.p[i][1]))&&HS.sp.length==106,'the same 106 zombie spawn points');
ok(SM.length==2&&FX.smoke.every((s,i)=>near(s[0],SM[i].x)&&near(s[1],SM[i].y)),'the two smoke plumes (car crash, helicopter)');
{const F=new Int16Array(gw*gh);bfs(F,HS.px,HS.py);const bad=HS.sp.filter(p=>{const i=Math.floor(p[0]/gs),j=Math.floor(p[1]/gs);for(let dj=-1;dj<=1;dj++)for(let di=-1;di<=1;di++)if(F[(j+dj)*gw+i+di]>=0)return 0;return 1});
 ok(!bad.length,'zombies can walk to the player from every spawn point ('+bad.length+' cannot)')}
// spawnZ uses the spawn points
start();{const R0=[];for(let i=0;i<40;i++){const z=spawnZ(0);if(z){R0.push(z);zs.splice(zs.indexOf(z),1)}}ok(R0.length==40&&R0.every(z=>HS.sp.some(p=>Math.hypot(p[0]-z.x,p[1]-z.y)<21)),'zombies appear at the spawn points')}

// ---------- the tutorial and the opening living room ----------
{const G=tutGeo(),wallAt=(x,y)=>WL.some(w=>w[4]!=2&&x>=w[0]&&x<=w[0]+w[2]&&y>=w[1]&&y<=w[1]+w[3]);
 ok(!wallAt(G.cx,G.y1)&&wallAt(G.cx-40,G.y1)&&wallAt(G.cx+40,G.y1)&&!wallAt(G.kx,G.y0)&&wallAt(G.kx-40,G.y0)&&!wallAt(G.x1+G.gd/2,G.y1)&&wallAt(G.x0,G.y0+60)&&wallAt(G.gx,G.yA+40),'the middle house is where the tutorial expects it (doors at tutGeo, walls around them)');
 const D=bimDoc(0);ok(D.obj.some(o=>o.k=='sofa3'&&o.c=='#6a4a8a'&&o.x>G.x0&&o.x<G.x1&&o.y>840)&&D.obj.some(o=>o.k=='tvs_tv'&&o.x>G.x0&&o.x<G.x1&&o.y>840)&&D.obj.some(o=>o.k=='curtain')&&D.areas.some(a=>a.a=='floor'&&a.o.pt=='plank'&&a.c=='#5a3a24'),'the living room from the opening video: plank floor, purple couch, TV, red curtains')}
{TUTF=1;setGM('c');mapId=0;S.mp=0;let er='';try{tutStart();tick(60)}catch(e){er=e.message}ok(!er&&TUT&&HS.CM==='builtin-suburb'&&WL.some(w=>w[4]==2&&w[2]==64),'the tutorial starts on the converted Suburb and closes its doors '+er);try{tutEnd&&tutEnd()}catch(e){}TUT=0;TUTF=0}

// ---------- playtest: campaign waves 1–20 with the survivor boss ----------
const A=S.ac;
// spitters and healers keep their distance on purpose: within 400 px they have reached the player
const RNG=new Set([11,19]);
const play=(w0,w1,lim)=>{const R={spawned:0,reached:0,stuck:0,waves:0,err:'',sk:{}};try{for(let w=w0;w<=w1;w++){if(mode!='play')nextWave();let t=0;const seen=new Map();
 while(mode=='play'&&t<lim){for(const p of PL){p.mx=Math.max(p.mx,20);p.hp=p.mx}tick(1);t++;for(const z of zs){if(ZT[z.t].sv)continue;if(!seen.has(z)){seen.set(z,t);R.spawned++}
  const dz=Math.hypot(z.x-P.x,z.y-P.y);if(z.hp>0&&(dz<80||dz<400&&RNG.has(z.t))){R.reached++;hurt(z,z.hp+1,0,0)}else if(z.hp>0&&t-seen.get(z)>2400){R.stuck++;const k=z.t+'@'+Math.round(Math.hypot(z.x-P.x,z.y-P.y))+'('+Math.round(z.x)+','+Math.round(z.y)+')';R.sk[k]=(R.sk[k]||0)+1;hurt(z,z.hp+1,0,0)}}}
 if(mode=='play'){toSp=0;for(let q=0;q<600&&mode=='play';q++){for(const z of zs.slice())if(z.hp>0)hurt(z,z.hp+1,0,0);toSp=0;tick(1)}}R.waves++;if(REQ('process').env.SUBLOG)console.log('WAVE '+w+' ticks '+t+' spawned '+R.spawned+' reached '+R.reached+' stuck '+R.stuck+' '+JSON.stringify(R.sk)+' mode '+mode+' wave '+wave)}}catch(e){R.err=e.stack||e.message}return R};
A.un=[0];A.cp=0;A.tut=1;delete A.bm;S.lm='off';setGM('c');mapId=0;S.mp=0;sel=0;start();
// the whole campaign (waves 1–19) with SUBURB_FULL=1 (about 8 minutes); by default waves 1–4 and 19 (about a minute)
{const FULL=!!REQ('process').env.SUBURB_FULL;let R=play(1,FULL?19:4,5000);if(!FULL){const R1=R;wave=18;zs=[];toSp=0;mode='shop';const R2=play(19,19,5000);R={spawned:R1.spawned+R2.spawned,reached:R1.reached+R2.reached,stuck:R1.stuck+R2.stuck,waves:R1.waves+R2.waves+14,err:R1.err||R2.err,sk:Object.assign(R1.sk,R2.sk)}}
 ok(!R.err&&R.waves==19&&wave==19,'campaign waves '+(FULL?'1–19':'1–4 and 19')+' play through on the Suburb '+R.err);
 ok(R.spawned>(FULL?700:100)&&R.stuck<=Math.max(2,R.spawned*.01),'zombies reach the player in the house ('+R.reached+' of '+R.spawned+' reached; '+R.stuck+' slow ones '+JSON.stringify(R.sk)+')')}
{if(mode!='play')nextWave();const b=zs.find(q=>ZT[q.t].sv);ok(wave==20&&b&&b.ci==MUN[0],'wave 20: the Suburb\\'s survivor boss arrives ('+(b&&ZT[b.t].n)+')');
 let near_=0;for(let f=0;f<2400&&b&&b.hp>0&&!near_;f++){P.mx=Math.max(P.mx,20);P.hp=P.mx;tick(1);if(Math.hypot(b.x-P.x,b.y-P.y)<200)near_=1}ok(near_,'the boss finds the player in the house (on the old map too it takes up to ~30 s)');
 b.ph=2;hurt(b,1e9,0,0);tick(Math.ceil(6/.016));ok(A.cp==1&&A.un.includes(MUN[0])&&mapOK(3)&&mapOK(1),'beating the boss keeps campaign progress: survivor joins, School and Warehouse open')}

// ---------- free play: best wave, leaderboard board, checkpoint ----------
setGM('f');mapId=0;S.mp=0;start();{const b0=S.best;const R=play(1,3,4000);ok(!R.err&&wave>=3,'a Free Play run plays '+R.err);
 if(mode!='play')nextWave();const row=olRow();ok(row&&row.map===0&&row.mode=='f','the leaderboard board is still map 0');
 cpSave();let c=null;try{c=JSON.parse(localStorage[CPK])}catch(e){}ok(c&&c.m===0&&c.cm===undefined&&c.w==wave,'checkpoints save as map 0');ok(S.best>=3&&S.best>=b0,'best wave kept');over(1)}

// ---------- split screen, low memory, building twice ----------
{const B={name:'B',xp:0,lv:1,sp:0,sk:{},pts:0,un:[0],cp:0};S.prof=[B];setGM('f');LBY={s:[{inp:'km',ac:A,ci:0,v:0,rdy:1},{inp:0,ac:B,ci:0,v:1,rdy:1}]};mapId=0;let er='';try{startMP();for(let f=0;f<200;f++){for(const p of PL){p.mx=Math.max(p.mx,20);p.hp=p.mx}tick(1)}}catch(e){er=e.message}
 ok(!er&&MPn==2&&HS.CM==='builtin-suburb'&&PL.every(p=>Math.hypot(p.x-HS.px,p.y-HS.py)<120),'split screen plays the Suburb '+er);over(1);S.prof=[];MPn=0}
{S.lm='on';setGM('f');mapId=0;build();ok(LMX&&BGL&&BG.width<=1,'low-memory mode keeps a half-size background');build();build();
 {const sp=subSpr(0,20,.5),own=document.createElement('canvas');sp.width=sp.width||44;own.width=50;const keep=HS.VH;HS.VH=[{cv:sp,sh:1},{cv:own}];bgFree();ok(sp.width>0&&own.width==0,'building the next map frees walk-behind pictures but keeps the shared tree pictures (sh: 1)');HS.VH=keep}
 ok(bimDoc(0).obj.filter(o=>o.k=='foak'||o.k=='fpine').every(o=>OB[o.k].c[0]==12&&OB[o.k].cf==2),'forest trees: 12 px see-through trunks');S.lm='off';build();ok(!BGL&&BG.width==2304,'back to the full background')}

// ---------- the Map Workshop: edit a copy ----------
{const h=wsBuiltins();ok(h.includes('Built-in maps')&&h.includes('wsBuiltin(0,1)')&&h.includes('EDIT A COPY'),'the Workshop lists the Suburb under Built-in maps with EDIT A COPY')}
await wsBuiltin(0,0);{const e=CML.find(q=>q.doc&&q.doc.name=='Suburb (my copy)'),D=bimDoc(0);ok(e&&e.doc.id!=D.id&&e.doc.obj.length==D.obj.length&&e.doc.walls.length==D.walls.length,'a copy with every piece goes into my maps');
 if(e){e.doc.obj.find(o=>o.k=='sofa3').x+=50;ok(!D.obj.some(o=>o.k=='sofa3'&&o.x==e.doc.obj.find(q=>q.k=='sofa3').x),'changing the copy leaves the built-in Suburb alone');setGM('f');mapId=e.key;build();ok(HS.CM===e.doc.id&&cmIs(mapId)&&WL.length>1300,'the copy plays as a custom map')}}
mapId=0;build();ok(HS.CM==='builtin-suburb','map 0 is still the built-in Suburb');
console.log('TOTAL fails '+fails+' of '+n);
}
`;
const AF=Object.getPrototypeOf(async function(){}).constructor;
new AF('docL','ivs',code+test)(docL,ivs).catch(e=>{console.log('FAIL crashed: '+(e&&e.stack||e));console.log('TOTAL fails 1');process.exitCode=1});
