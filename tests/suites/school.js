// The School (map 3) converted to a map file (src/maps/school.json): it loads, every old wall is still there (tests/fixtures/school-walls.json),
// the split offices and fuller classrooms, no prop blocks a doorway, zombies reach the player and never come out of the woods,
// the lights, the survivor boss, campaign progress, Free Play records, split screen, low memory, the Workshop copy, the new kit pieces.
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
const FX=JSON.parse(FS.readFileSync(PATH.join(ROOT,'tests','fixtures','school-walls.json'),'utf8'));
const near=(a,b,e)=>Math.abs(a-b)<=(e||.11);
const inR=(o,x0,y0,x1,y1)=>o.x>x0&&o.x<x1&&o.y>y0&&o.y<y1;

// ---------- the map file loads ----------
{const r=cmRead(JSON.stringify(BIMF[3]));ok(r.doc&&!r.errors.length&&!r.warnings.length,'school.json loads with no errors or warnings '+(r.errors||[]).concat(r.warnings||[]).slice(0,3).join('; '));
const L=cmLint(r.doc).filter(p=>p.lv=='err'||p.lv=='warn');ok(!L.length,'nothing in the Problems list '+L.map(p=>p.m).slice(0,2).join('; '));
const D=r.doc;ok(D.w==69&&D.h==57&&D.ground=='grass_school','the map covers the old School (2200×1800, now 69×57 tiles) on schoolyard grass');
ok(D.obj.filter(o=>!o.dc&&!o.fx&&!o.veh).every(o=>cmOB(o.k))&&['lockers','board','cubbies','counter','kline','plaza','walkway','sandlot'].every(k=>D.areas.some(a=>a.a==k)),'every prop is a real kit prop; the School\\'s new kit areas are used');
ok(!cmDoorBlocks(D).length&&cmDoors(D).length>=20,'no prop stands in any of its '+cmDoors(D).length+' doorways');
// the classrooms got more desks, with room to walk between them
const desks=(x0,y0,x1,y1)=>D.obj.filter(o=>(o.k=='sdesk'||o.k=='sdeskx')&&inR(o,x0,y0,x1,y1));
const C3=[[400,620],[620,840],[840,1060]].map(([a,b])=>desks(a,360,b,770));ok(C3.every(c=>c.length==16),'each top classroom has 16 desks (the old map had 6 or 7): '+C3.map(c=>c.length).join(', '));
ok(desks(1500,890,1840,1300).length==20,'the big classroom has 20 desks (the old map had 10)');
{let gap=1e9;for(const c of C3.concat([desks(1500,890,1840,1300)]))for(const a of c)for(const b of c)if(a!==b&&Math.abs(a.y-b.y)<1)gap=Math.min(gap,Math.abs(a.x-b.x)-22);ok(gap>=28,'desks in a row stand at least 28 px apart (an aisle a player fits through): '+gap)}
// the long offices are now smaller rooms
const fl=D.areas.filter(a=>a.a=='floor'&&a.x>=400&&a.x+a.w<=1060&&a.y>=890&&a.y+a.h<=1300);ok(fl.length>=8&&fl.every(a=>a.h<=280),'the three long offices (410 px deep) are now '+fl.length+' rooms, none deeper than 280 px');
for(const k of['reception','principal','counselor','nurse','records','lounge','closet']);
ok(['deskpc','hbed','ivp','bookshelf','vending','shelf','broom'].every(k=>D.obj.some(o=>o.k==k&&inR(o,400,890,1060,1300))),'reception, offices, nurse, records room, lounge and janitor\\'s closet are furnished');
// lights: inside and out, at dusk
ok(D.lt&&D.lt.t=='dusk'&&D.lt.a>.3,'the School is set at dusk, so its lights show');
ok(D.obj.filter(o=>o.k=='ceillight').length>=30&&D.areas.filter(a=>a.a=='roomlight').length>=18,'ceiling lights and room lights in every room and hall');
ok(['walllight','floodlight','plight','lamp','exitsign'].every(k=>D.obj.some(o=>o.k==k)),'wall lights at the outside doors, flood lights on the court, lot lights, lamps, exit lights')}
mapId=3;S.mp=3;setGM('f');build();
ok(HS.CM==='builtin-school'&&WW==2208&&WH==1824&&BG.width==WW,'map 3 builds from school.json through the custom-map loader');
ok(MP[3].n=='School'&&CORD[1]===3&&MUN[3]!=null,'map number 3 keeps its name, its campaign slot (second in Hometown) and its survivor boss');
ok(HS.LT&&HS.LT.t=='dusk'&&HS.LT.L.length>80,'the game lights it ('+(HS.LT&&HS.LT.L.length)+' lights)');

// ---------- walls: every wall of the old map is still there ----------
{const W=2208,H=1824,ras=(L,e,f)=>{const A=new Uint8Array(W*H);for(const w of L){if(f&&!f(w))continue;const X0=w[0]-e,Y0=w[1]-e,X1=w[0]+w[2]+e,Y1=w[1]+w[3]+e;
 for(let y=Math.max(0,Math.floor(Y0));y<Math.min(H,Math.ceil(Y1));y++)for(let x=Math.max(0,Math.floor(X0));x<Math.min(W,Math.ceil(X1));x++){const cx=x+.5,cy=y+.5;if(cx<X0||cx>X1||cy<Y0||cy>Y1)continue;A[y*W+x]=w[4]==2?2:1}}return A};
 const a=ras(FX.walls,-.2,w=>!w[4]),B2=ras(WL,.2,w=>w[4]!=2);let gone=0;const where=[];for(let i=0;i<a.length;i++)if(a[i]&&!B2[i]){gone++;if(where.length<4)where.push((i%W)+','+(i/W|0))}
 ok(!gone,'every wall of the old map is still there (windows are part of the walls) '+where.join(' '));
 const t=ras(FX.walls,-.2,w=>w[4]==2&&w[2]==12),T2=ras(WL,.2,w=>w[4]==2);let lost=0;for(let i=0;i<t.length;i++)if(t[i]&&!T2[i])lost++;ok(!lost,'every tree trunk is where it was and still see-through ('+lost+' px off)')}
{const cell=(x,y)=>bl[Math.floor(y/gs)*gw+Math.floor(x/gs)];
 const D=[[400,560],[400,830],[1840,830],[1840,1140],[1120,360],[1510,360],[550,1300],[1120,1300],[510,770],[730,770],[950,770],[1280,770],[1740,770],[550,890],[790,890],[970,890],[1670,890],[1280,1140],[1400,1140],[550,1130],[520,1250],[580,1250],[790,1100],[1020,1170]];
 const shut=D.filter(([x,y])=>cell(x,y));ok(!shut.length,'all '+D.length+' doorways are open for zombies (outside doors, classrooms, cafeteria, offices, restrooms, and the new office doors) '+JSON.stringify(shut))}

// ---------- start, spawning, no-spawn zones, menu camera, smoke ----------
ok(near(HS.px,FX.start[0])&&near(HS.py,FX.start[1])&&near(HS.cx,FX.menu[0])&&near(HS.cy,FX.menu[1]),'player start and menu camera as before');
ok(same([HS.nx0,HS.ny0,HS.nx1,HS.ny1],FX.nospawn)&&!HS.CZ&&!NOGO.length,'zombies still come from off-screen, never inside the building (the same no-spawn box)');
ok(SM.length==2&&FX.smoke.every(s=>SM.some(q=>near(q.x,s[0])&&near(q.y,s[1]))),'the two smoke plumes (the bus, the kitchen)');
{setGM('f');mapId=3;S.mp=3;start();let bad=0,ok_=0;for(const[px,py]of[[1120,500],[600,420],[1700,420],[1120,830]]){P.x=px;P.y=py;for(let i=0;i<150;i++){const z=spawnZ(0);if(!z)continue;ok_++;const x=z.x,y=z.y;if(y<schoolWB(x)+20&&Math.hypot(x-1120,y-190)>165&&x>0&&x<WW)bad++}zs=[]}
 ok(ok_>500&&!bad,'zombies never come out of the woods behind the school ('+bad+' of '+ok_+'), as on the old map');over(1)}
function schoolWB(x){return 282+16*Math.sin(x/97)+11*Math.sin(x/41+1)}
mapId=3;build();
{const F=new Int16Array(gw*gh);bfs(F,HS.px,HS.py);let e=0,er=0;for(let i=0;i<gw;i++)for(const j of[0,gh-1]){const k=j*gw+i;if(!bl[k]){e++;if(F[k]>=0)er++}}for(let j=0;j<gh;j++)for(const i of[0,gw-1]){const k=j*gw+i;if(!bl[k]){e++;if(F[k]>=0)er++}}
 ok(e>300&&er>=e-30,'zombies can walk to the player from the map\\'s edges ('+er+' of '+e+'; the rest are inside the woods, as before)');
 const rooms=[[510,600],[730,600],[950,600],[1510,600],[1670,1100],[1340,950],[1260,1200],[1420,1200],[550,950],[460,1240],[640,1240],[790,990],[790,1250],[970,1000],[970,1240]];
 ok(rooms.every(([x,y])=>F[Math.floor(y/gs)*gw+Math.floor(x/gs)]>=0),'every room can be reached from the halls')}

// ---------- playtest: campaign waves with the survivor boss ----------
const A=S.ac;
const RNG=new Set([11,19]);
const play=(w0,w1,lim)=>{const R={spawned:0,reached:0,stuck:0,waves:0,err:'',sk:{}};try{for(let w=w0;w<=w1;w++){if(mode!='play')nextWave();let t=0;const seen=new Map();
 while(mode=='play'&&t<lim){for(const p of PL){p.mx=Math.max(p.mx,20);p.hp=p.mx}tick(1);t++;for(const z of zs){if(ZT[z.t].sv)continue;if(!seen.has(z)){seen.set(z,t);R.spawned++}
  const dz=Math.hypot(z.x-P.x,z.y-P.y);if(z.hp>0&&(dz<80||dz<400&&RNG.has(z.t))){R.reached++;hurt(z,z.hp+1,0,0)}else if(z.hp>0&&t-seen.get(z)>2400){R.stuck++;const k=z.t+'@'+Math.round(dz)+'('+Math.round(z.x)+','+Math.round(z.y)+')';R.sk[k]=(R.sk[k]||0)+1;hurt(z,z.hp+1,0,0)}}}
 if(mode=='play'){toSp=0;for(let q=0;q<600&&mode=='play';q++){for(const z of zs.slice())if(z.hp>0)hurt(z,z.hp+1,0,0);toSp=0;tick(1)}}R.waves++;if(REQ('process').env.SUBLOG)console.log('WAVE '+w+' ticks '+t+' spawned '+R.spawned+' reached '+R.reached+' stuck '+R.stuck+' '+JSON.stringify(R.sk))}}catch(e){R.err=e.stack||e.message}return R};
A.un=[0,MUN[0]];A.cp=1;A.tut=1;delete A.bm;S.lm='off';setGM('c');mapId=3;S.mp=3;sel=0;start();ok(mapId===3&&HS.CM==='builtin-school','a campaign run starts on the School');
// the whole campaign (waves 1–19) with SCHOOL_FULL=1; by default waves 1–4 and 19
{const FULL=!!REQ('process').env.SCHOOL_FULL;let R=play(1,FULL?19:4,5000);if(!FULL){const R1=R;wave=18;zs=[];toSp=0;mode='shop';const R2=play(19,19,5000);R={spawned:R1.spawned+R2.spawned,reached:R1.reached+R2.reached,stuck:R1.stuck+R2.stuck,waves:R1.waves+R2.waves+14,err:R1.err||R2.err,sk:Object.assign(R1.sk,R2.sk)}}
 ok(!R.err&&R.waves==19&&wave==19,'campaign waves '+(FULL?'1–19':'1–4 and 19')+' play through on the School '+R.err);
 ok(R.spawned>(FULL?700:100)&&R.stuck<=Math.max(2,R.spawned*.01),'zombies reach the player in the school ('+R.reached+' of '+R.spawned+' reached; '+R.stuck+' slow ones '+JSON.stringify(R.sk)+')')}
{if(mode!='play')nextWave();const b=zs.find(q=>ZT[q.t].sv);ok(wave==20&&b&&b.ci==MUN[3],'wave 20: the School\\'s survivor boss arrives');
 let near_=0;for(let f=0;f<2400&&b&&b.hp>0&&!near_;f++){P.mx=Math.max(P.mx,20);P.hp=P.mx;tick(1);if(Math.hypot(b.x-P.x,b.y-P.y)<300&&los(b,P))near_=1}ok(near_,'the boss finds the player');
 b.ph=2;b.iv=0;hurt(b,1e9,0,0);tick(Math.ceil(6/.016));ok(A.cp==2&&A.un.includes(MUN[3]),'beating the boss keeps campaign progress: the survivor joins and the next map opens'+(A.cp==2?'':' (cp '+A.cp+', joined '+JSON.stringify(A.un)+', mode '+mode+', wave '+wave+', boss hp '+(b&&Math.round(b.hp))+', player hp '+Math.round(P.hp)+')'))}

// ---------- free play: best wave, leaderboard board, checkpoint ----------
setGM('f');mapId=3;S.mp=3;start();{const R=play(1,3,4000);ok(!R.err&&wave>=3,'a Free Play run plays '+R.err);
 if(mode!='play')nextWave();const row=olRow();ok(row&&row.map===3&&row.mode=='f','the leaderboard board is still map 3');
 cpSave();let c=null;try{c=JSON.parse(localStorage[CPK])}catch(e){}ok(c&&c.m===3&&c.cm===undefined&&c.w==wave,'checkpoints save as map 3');over(1)}

// ---------- split screen, low memory ----------
{const B={name:'B',xp:0,lv:1,sp:0,sk:{},pts:0,un:[0,2,3],cp:8};S.prof=[B];setGM('f');LBY={s:[{inp:'km',ac:A,ci:0,v:0,rdy:1},{inp:0,ac:B,ci:0,v:1,rdy:1}]};mapId=3;let er='';try{startMP();for(let f=0;f<200;f++){for(const p of PL){p.mx=Math.max(p.mx,20);p.hp=p.mx}tick(1)}}catch(e){er=e.message}
 ok(!er&&MPn==2&&HS.CM==='builtin-school','split screen plays the School '+er);over(1);S.prof=[];MPn=0}
{S.lm='on';setGM('f');mapId=3;build();ok(LMX&&BGL&&BG.width<=1&&HS.CM==='builtin-school','low-memory mode keeps a half-size background');S.lm='off';build();ok(!BGL&&BG.width==2208,'back to the full background')}

// ---------- the Map Workshop ----------
{const h=wsBuiltins();ok(h.includes('wsBuiltin(3,1)')&&h.includes('School'),'the Workshop lists the School under Built-in maps')}
await wsBuiltin(3,0);{const e=CML.find(q=>q.doc&&q.doc.name=='School (my copy)'),D=bimDoc(3);ok(e&&e.doc.id!=D.id&&e.doc.obj.length==D.obj.length&&e.doc.walls.length==D.walls.length&&e.doc.lt&&e.doc.lt.t=='dusk','EDIT A COPY / ADD A COPY makes your own copy with every piece and its lighting')}

// ---------- kit pieces added for it ----------
{const J={format:'zombdash-map',version:3,name:'T',tileSize:32,width:30,height:20,ground:'grass_school',
 areas:[{kind:'lockers',x:20,y:20,w:200,h:12,color:'#a8423a'},{kind:'board',x:20,y:40,w:160,h:12},{kind:'cubbies',x:20,y:60,w:72,h:12},{kind:'counter',x:300,y:20,w:120,h:16,options:{st:'sinks'}},{kind:'kline',x:300,y:60,w:200,h:30},
  {kind:'plaza',x:20,y:200,w:300,h:300},{kind:'walkway',x:140,y:500,w:64,h:40},{kind:'sandlot',x:500,y:200,w:300,h:300}],
 props:[{kind:'stall',x:600,y:100},{kind:'stall',x:650,y:100,rot:90},{kind:'banner',x:300,y:150,text:'GO TEAM'},{kind:'wcsign',x:500,y:150,color:'#d85a9a'},{kind:'sclock',x:550,y:150}],
 decals:[{kind:'crest',x:700,y:500,text:'Q',options:{sm:1}},{kind:'lawnbit',x:800,y:500,var:.5}],playerStart:{x:400,y:550}};
 const r=cmRead(JSON.stringify(J)),d=r.doc;ok(d&&!r.errors.length&&!r.warnings.length,'the School\\'s new pieces load: lockers, boards, cubbies, counters, kitchen line, plaza, walkway, playground sand, stall dividers, banner, restroom sign, small clock, crest, lawn bits, schoolyard grass '+(r.errors||[]).concat(r.warnings||[]).join('; '));
 const ar=k=>d.areas.find(a=>a.a==k);ok(cmAreaBoxes(ar('counter')).length==1&&!cmAreaBoxes(ar('lockers')).length&&!cmAreaBoxes(ar('board')).length&&!cmAreaBoxes(ar('plaza')).length,'counters are solid; lockers, boards and the plaza are not');
 const st=d.obj.filter(o=>o.k=='stall'),f1=cmFoot(st[0]),f2=cmFoot(st[1]);ok(f1&&f2&&near(f1[2],4)&&near(f1[3],56)&&near(f2[2],56)&&near(f2[3],4),'a stall divider is a solid 4×56 strip, turned 90° it runs left–right');
 ok(cmWrite(d).props.find(p=>p.kind=='banner').text=='GO TEAM'&&cmWrite(d).decals.find(q=>q.kind=='crest').text=='Q','the banner and the crest keep their words');
 ok(['stall','banner','wcsign','sclock'].every(k=>EDPN[k])&&['lockers','board','cubbies','counter','kline','plaza','walkway','sandlot'].every(k=>CMAI[k])&&CMDI.crest&&CMDI.lawnbit&&CMTI.grass_school,'they are all in the editor');
 ok(typeof mapSchool=='undefined'&&typeof schOut=='undefined'&&typeof schFg=='undefined','the old School map code is gone')}
// random spawns keep out of every no-spawn zone of a custom map (not only the first)
{const J={format:'zombdash-map',version:3,name:'T',tileSize:32,width:40,height:40,ground:'grass',playerStart:{x:640,y:640},features:[{kind:'nospawn',x:600,y:600,w:80,h:80,options:{skip:0,nogo:0}},{kind:'nospawn',x:0,y:0,w:1280,h:400}]};
 const r=cmRead(JSON.stringify(J));CMPTD=r.doc;mapId=CMPTK;setGM('f');start();let bad=0,all=0;for(let i=0;i<300;i++){const z=spawnZ(0);if(!z)continue;all++;if(z.y<400&&z.x>0&&z.x<1280)bad++}zs=[];over(1);
 ok(all>250&&!bad,'random spawns keep out of every no-spawn zone of a custom map ('+bad+' of '+all+')')}
mapId=3;build();ok(HS.CM==='builtin-school','map 3 is still the built-in School');
console.log('TOTAL fails '+fails+' of '+n);
}
`;
const AF=Object.getPrototypeOf(async function(){}).constructor;
new AF('docL','ivs',code+test)(docL,ivs).catch(e=>{console.log('FAIL crashed: '+(e&&e.stack||e));console.log('TOTAL fails 1');process.exitCode=1});
