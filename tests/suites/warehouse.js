// The Warehouse (map 1) converted to a map file (src/maps/warehouse.json): it loads, its walls match the old map code (tests/fixtures/warehouse-walls.json),
// no prop blocks a doorway, zombies reach the player, the survivor boss, campaign progress, Free Play records, split screen, low memory, the Workshop copy.
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
const FX=JSON.parse(FS.readFileSync(PATH.join(ROOT,'tests','fixtures','warehouse-walls.json'),'utf8'));
const near=(a,b,e)=>Math.abs(a-b)<=(e||.11);

// ---------- the map file loads ----------
{const r=cmRead(JSON.stringify(BIMF[1]));ok(r.doc&&!r.errors.length&&!r.warnings.length,'warehouse.json loads with no errors or warnings '+(r.errors||[]).concat(r.warnings||[]).slice(0,3).join('; '));
const L=cmLint(r.doc).filter(p=>p.lv=='err'||p.lv=='warn');ok(!L.length,'nothing in the Problems list '+L.map(p=>p.m).slice(0,2).join('; '));
const D=r.doc;ok(D.w==57&&D.h==57&&D.ground=='lot'&&D.obj.filter(o=>o.veh=='trailer').length==34&&D.obj.filter(o=>o.veh=='hatch').length==11,'the map has the Warehouse\\'s size, its 34 trailers and 11 parked cars');
ok(D.obj.filter(o=>!o.dc&&!o.fx&&!o.veh).every(o=>cmOB(o.k))&&['wcont','guardbooth','lotgate','deskpc','fcab','sinkrow','wc','lockstrip','exitsign','dirsign2','firebarrel','btable'].every(k=>D.obj.some(o=>o.k==k)),'every prop is a real kit prop, including the new Warehouse pieces');
ok(D.obj.filter(o=>o.veh=='trailer').every(o=>o.c2=='none')&&cmVeh(D.obj.find(o=>o.veh=='trailer')).st=='none','the trailers are plain, with no stripe (color2 "none")');
ok(!cmDoorBlocks(D).length&&cmDoors(D).length>=10,'no prop stands in any of its '+cmDoors(D).length+' doorways');}
mapId=1;S.mp=1;setGM('f');build();
ok(HS.CM==='builtin-warehouse'&&WW==1824&&WH==1824&&BG.width==WW,'map 1 builds from warehouse.json through the custom-map loader');
ok(MP[1].n=='Warehouse'&&CORD[2]===1&&MUN[1]===1,'map number 1 keeps its name, its campaign slot (third in Hometown) and its survivor boss');

// ---------- walls: the same places as the old map code ----------
{const W=1824,H=1824,ras=(L,e)=>{const A=new Uint8Array(W*H);for(const w of L){const f=w[4]==2?2:1,X0=w[0]-e,Y0=w[1]-e,X1=w[0]+w[2]+e,Y1=w[1]+w[3]+e;
 for(let y=Math.max(0,Math.floor(Y0));y<Math.min(H,Math.ceil(Y1));y++)for(let x=Math.max(0,Math.floor(X0));x<Math.min(W,Math.ceil(X1));x++){const cx=x+.5,cy=y+.5;if(cx<X0||cx>X1||cy<Y0||cy>Y1)continue;const k=y*W+x;if(A[k]!=1)A[k]=f}}return A};
 const O=FX.walls,a=ras(O,-.2),b=ras(WL,-.2),A2=ras(O,.2),B2=ras(WL,.2);let gone=0,added=0,flag=0;const where=[];
 for(let i=0;i<a.length;i++){const x=i%W;if(a[i]&&!B2[i]){gone++;if(where.length<4)where.push('gap@'+x+','+(i/W|0))}else if(b[i]&&!A2[i]){added++;if(where.length<4)where.push('new@'+x+','+(i/W|0))}else if(a[i]&&b[i]&&a[i]!=b[i]&&A2[i]==a[i]&&B2[i]==b[i])flag++}
 ok(!gone,'no wall or solid thing of the old map is missing (no new gaps) '+where.join(' '));ok(!added,'no new blocks (doorways and lanes stay open) '+where.join(' '));ok(!flag,'fences and the sign post stay see-through, everything else solid')}
{const cell=(x,y)=>bl[Math.floor(y/gs)*gw+Math.floor(x/gs)];const D=[[900,680],[900,1120],[460,900],[1340,900],[960,900],[1055,872],[1245,872],[1023,928],[1150,928],[1277,928]];
 ok(D.every(([x,y])=>!cell(x,y)),'the four ways in, the office door and the six office doors are open for zombies')}

// ---------- start, spawning, no-spawn box, menu camera, smoke ----------
ok(near(HS.px,FX.start[0])&&near(HS.py,FX.start[1])&&near(HS.cx,FX.menu[0])&&near(HS.cy,FX.menu[1]),'player start and menu camera as before');
ok(same([HS.nx0,HS.ny0,HS.nx1,HS.ny1],FX.nospawn)&&!HS.CZ&&!NOGO.length,'zombies still come from off-screen, never inside the building (the same no-spawn box)');
ok(SM.length==1&&near(SM[0].x,FX.smoke[0][0])&&near(SM[0].y,FX.smoke[0][1]),'the burning barrel\\'s smoke');
{const F=new Int16Array(gw*gh);bfs(F,HS.px,HS.py);let e=0,er=0;for(let i=0;i<gw;i++)for(const j of[0,gh-1]){const k=j*gw+i;if(!bl[k]){e++;if(F[k]>=0)er++}}for(let j=0;j<gh;j++)for(const i of[0,gw-1]){const k=j*gw+i;if(!bl[k]){e++;if(F[k]>=0)er++}}
 ok(e>400&&er==e,'zombies can walk to the player from every open spot on the map\\'s edges ('+er+' of '+e+')')}

// ---------- playtest: campaign waves with the survivor boss ----------
const A=S.ac;
const RNG=new Set([11,19]);
const play=(w0,w1,lim)=>{const R={spawned:0,reached:0,stuck:0,waves:0,err:'',sk:{}};try{for(let w=w0;w<=w1;w++){if(mode!='play')nextWave();let t=0;const seen=new Map();
 while(mode=='play'&&t<lim){for(const p of PL){p.mx=Math.max(p.mx,20);p.hp=p.mx}tick(1);t++;for(const z of zs){if(ZT[z.t].sv)continue;if(!seen.has(z)){seen.set(z,t);R.spawned++}
  const dz=Math.hypot(z.x-P.x,z.y-P.y);if(z.hp>0&&(dz<80||dz<400&&RNG.has(z.t))){R.reached++;hurt(z,z.hp+1,0,0)}else if(z.hp>0&&t-seen.get(z)>2400){R.stuck++;const k=z.t+'@'+Math.round(dz)+'('+Math.round(z.x)+','+Math.round(z.y)+')';R.sk[k]=(R.sk[k]||0)+1;hurt(z,z.hp+1,0,0)}}}
 if(mode=='play'){toSp=0;for(let q=0;q<600&&mode=='play';q++){for(const z of zs.slice())if(z.hp>0)hurt(z,z.hp+1,0,0);toSp=0;tick(1)}}R.waves++;if(REQ('process').env.SUBLOG)console.log('WAVE '+w+' ticks '+t+' spawned '+R.spawned+' reached '+R.reached+' stuck '+R.stuck+' '+JSON.stringify(R.sk))}}catch(e){R.err=e.stack||e.message}return R};
A.un=[0,2,3];A.cp=2;A.tut=1;delete A.bm;S.lm='off';setGM('c');mapId=1;S.mp=1;sel=0;start();ok(mapId===1&&HS.CM==='builtin-warehouse','a campaign run starts on the Warehouse');
// the whole campaign (waves 1–19) with WAREHOUSE_FULL=1; by default waves 1–4 and 19
{const FULL=!!REQ('process').env.WAREHOUSE_FULL;let R=play(1,FULL?19:4,5000);if(!FULL){const R1=R;wave=18;zs=[];toSp=0;mode='shop';const R2=play(19,19,5000);R={spawned:R1.spawned+R2.spawned,reached:R1.reached+R2.reached,stuck:R1.stuck+R2.stuck,waves:R1.waves+R2.waves+14,err:R1.err||R2.err,sk:Object.assign(R1.sk,R2.sk)}}
 ok(!R.err&&R.waves==19&&wave==19,'campaign waves '+(FULL?'1–19':'1–4 and 19')+' play through on the Warehouse '+R.err);
 ok(R.spawned>(FULL?700:100)&&R.stuck<=Math.max(2,R.spawned*.01),'zombies reach the player in the warehouse ('+R.reached+' of '+R.spawned+' reached; '+R.stuck+' slow ones '+JSON.stringify(R.sk)+')')}
{if(mode!='play')nextWave();const b=zs.find(q=>ZT[q.t].sv);ok(wave==20&&b&&b.ci==MUN[1],'wave 20: the Warehouse\\'s survivor boss arrives');
 let near_=0;for(let f=0;f<2400&&b&&b.hp>0&&!near_;f++){P.mx=Math.max(P.mx,20);P.hp=P.mx;tick(1);if(Math.hypot(b.x-P.x,b.y-P.y)<300&&los(b,P))near_=1}ok(near_,'the boss finds the player (it fights from about 250 px once it can see the player, on the old map too)');
 b.ph=2;hurt(b,1e9,0,0);tick(Math.ceil(6/.016));ok(A.cp==3&&A.un.includes(MUN[1]),'beating the boss keeps campaign progress: the survivor joins and the next map opens')}

// ---------- free play: best wave, leaderboard board, checkpoint ----------
setGM('f');mapId=1;S.mp=1;start();{const R=play(1,3,4000);ok(!R.err&&wave>=3,'a Free Play run plays '+R.err);
 if(mode!='play')nextWave();const row=olRow();ok(row&&row.map===1&&row.mode=='f','the leaderboard board is still map 1');
 cpSave();let c=null;try{c=JSON.parse(localStorage[CPK])}catch(e){}ok(c&&c.m===1&&c.cm===undefined&&c.w==wave,'checkpoints save as map 1');over(1)}

// ---------- split screen, low memory ----------
{const B={name:'B',xp:0,lv:1,sp:0,sk:{},pts:0,un:[0,2,3],cp:8};S.prof=[B];setGM('f');LBY={s:[{inp:'km',ac:A,ci:0,v:0,rdy:1},{inp:0,ac:B,ci:0,v:1,rdy:1}]};mapId=1;let er='';try{startMP();for(let f=0;f<200;f++){for(const p of PL){p.mx=Math.max(p.mx,20);p.hp=p.mx}tick(1)}}catch(e){er=e.message}
 ok(!er&&MPn==2&&HS.CM==='builtin-warehouse','split screen plays the Warehouse '+er);over(1);S.prof=[];MPn=0}
{S.lm='on';setGM('f');mapId=1;build();ok(LMX&&BGL&&BG.width<=1&&HS.CM==='builtin-warehouse','low-memory mode keeps a half-size background');S.lm='off';build();ok(!BGL&&BG.width==1824,'back to the full background')}

// ---------- the Map Workshop ----------
{const h=wsBuiltins();ok(h.includes('wsBuiltin(1,1)')&&h.includes('Warehouse'),'the Workshop lists the Warehouse under Built-in maps')}
await wsBuiltin(1,0);{const e=CML.find(q=>q.doc&&q.doc.name=='Warehouse (my copy)'),D=bimDoc(1);ok(e&&e.doc.id!=D.id&&e.doc.obj.length==D.obj.length&&e.doc.walls.length==D.walls.length,'EDIT A COPY / ADD A COPY makes your own copy with every piece')}

// ---------- kit pieces added for it ----------
{const J={format:'zombdash-map',version:3,name:'T',tileSize:32,width:30,height:20,ground:'lot',
 walls:[{x:100,y:197,w:100,h:6,style:'concrete'},{x:252,y:197,w:100,h:6,style:'concrete'},{x:352,y:197,w:108,h:6,style:'concrete'},{x:460,y:197,w:44,h:6,style:'door'},{x:504,y:197,w:60,h:6,style:'concrete'}],
 props:[{kind:'kfridge',x:226,y:230},{kind:'exitsign',x:482,y:215}],vehicles:[{kind:'trailer',x:300,y:400,rot:0,color:'#e8e8e4',color2:'#6a4a9a'},{kind:'hatch',x:600,y:400,rot:90,color:'#2f6fd0'}],
 areas:[{kind:'hazardband',x:200,y:194,w:52,h:6,options:{st:'blocks'}},{kind:'paving',x:600,y:100,w:100,h:60,options:{s:'turf'}}],decals:[{kind:'lotspeck',x:50,y:50,var:.2}],playerStart:{x:300,y:300}};
 const r=cmRead(JSON.stringify(J)),d=r.doc;ok(d&&!r.errors.length&&!r.warnings.length,'the new pieces load: lot terrain, dark lawn, hazard blocks, lot bits, hatchback, trailer stripe '+(r.errors||[]).concat(r.warnings||[]).join('; '));
 const D=cmDoors(d);ok(D.length==2&&D.some(q=>q.hz&&near(q.a,200)&&near(q.b,252))&&D.some(q=>near(q.a,460)&&near(q.b,504)),'doorways are found: a gap between walls and a doorway piece');
 const B=cmDoorBlocks(d);ok(B.length==1&&B[0].o.k=='kfridge','a fridge in front of a gap is reported; an exit light by a door is not');ok(cmLint(d).some(p=>/stands in a doorway/.test(p.m)),'the Problems list says so');
 const out=cmWrite(d);ok(out.vehicles.find(v=>v.kind=='trailer').color2=='#6a4a9a'&&cmVeh(d.obj.find(o=>o.veh=='trailer')).st=='#6a4a9a','a trailer keeps its stripe colour (color2) when saved, and draws with it');
 {const r2=cmRead(JSON.stringify(Object.assign({},J,{vehicles:[{kind:'trailer',x:300,y:400,rot:0,color2:'none'}]})));ok(r2.doc.obj.find(o=>o.veh).c2=='none'&&cmWrite(r2.doc).vehicles[0].color2=='none','"none" (no stripe) loads and saves too')}
 ok(HWV('hatch')&&EDVN.hatch&&CMTI.lot&&EDPN.wcont&&EDPN.dirsign2,'the hatchback, the lot terrain and the new props are in the editor')}
mapId=1;build();ok(HS.CM==='builtin-warehouse','map 1 is still the built-in Warehouse');
console.log('TOTAL fails '+fails+' of '+n);
}
`;
const AF=Object.getPrototypeOf(async function(){}).constructor;
new AF('docL','ivs',code+test)(docL,ivs).catch(e=>{console.log('FAIL crashed: '+(e&&e.stack||e));console.log('TOTAL fails 1');process.exitCode=1});
