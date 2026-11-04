// The Enchanted Forest (map 10) converted to a map file (src/maps/forest.json) at the owner's request: at night, a misshapen oval
// trail as wide as the cobbled road looping round the map (the road crosses it), short detours to the landmarks, the witch's cabin
// rebuilt as a log cabin full of candles, the woods made solid (no getting stuck between trees), iron street lamps on the road,
// lanterns along the trail (some smashed or knocked over), a car crash on the road with just the cars. Then the owner's picks
// F1–F5 (a tree down across the road, a stream under a wooden bridge, a well at the ruins, fireflies, owls and howling), the cabin
// a little bigger, the road paved asphalt with faded lines. Reach, campaign and the Horseman, Free Play, the Workshop copy, the
// editor pieces; the City Park, which shared the old forest code.
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
docL.pointerdown[0]();endIntro();
{ // in a block, so these names never clash with the game's
const tick=n=>{for(let i=0;i<n;i++){AT_+=.016;NOW_+=16;for(const f of ivs)f();for(let q=TQ.length-1;q>=0;q--)if(TQ[q][0]<=AT_){const g=TQ[q][1];TQ.splice(q,1);g()}loop(NOW_)}};
let fails=0,n=0;const ok=(c,m)=>{n++;if(c)console.log('PASS '+m);else{fails++;console.log('FAIL '+m)}};
const rY=x=>1000+60*Math.sin(x/420)+20*Math.sin(x/160+1);
const IN=(o,r)=>o.x>r[0]&&o.x<r[2]&&o.y>r[1]&&o.y<r[3];
const CAB=[2240,84,2570,330],CRASH=[1900,840,2320,1060],ROADB=o=>Math.abs(o.y-rY(o.x))<90;

// ---------- the map file loads ----------
const D=(()=>{const r=cmRead(JSON.stringify(BIMF[10]));ok(r.doc&&!r.errors.length&&!r.warnings.length,'forest.json loads with no errors or warnings '+(r.errors||[]).concat(r.warnings||[]).slice(0,3).join('; '));return r.doc})();
{const L=cmLint(D).filter(p=>p.lv=='err'||p.lv=='warn');ok(!L.length,'nothing in the Problems list '+L.map(p=>p.m).slice(0,2).join('; '));
 ok(D.w==82&&D.h==63&&D.ground=='forest'&&D.lt&&D.lt.t=='night'&&D.lt.a>=.8&&D.lt.a<=.9&&!D.lt.st,'82×63 tiles of forest floor, at night');
 ok(D.obj.filter(o=>!o.dc&&!o.fx&&!o.veh).every(o=>cmOB(o.k)),'every prop is a real kit prop');
 ok(!cmDoorBlocks(D).length,'no prop stands in a doorway')}
const K=k=>D.obj.filter(o=>o.k==k),FX=k=>D.obj.filter(o=>o.fx==k),DC=k=>D.obj.filter(o=>o.dc==k),V=k=>D.obj.filter(o=>o.veh==k),PA=k=>D.paths.filter(p=>p.p==k),WS=s=>D.walls.filter(w=>w.s==s);
// ---------- the loop: a misshapen oval as wide as the road, crossing it twice ----------
const ROAD=PA('road'),TR=PA('trail'),LOOP=TR.filter(p=>p.w>=120),SPUR=TR.filter(p=>p.w<120);
{const R=ROAD[0];ok(ROAD.length==1&&R.w==120&&!PA('cobble').length,'the old road runs across the forest, 120 px wide');
 ok(R.o&&R.o.fade&&R.o.s=='worn'&&R.o.edge&&R.o.cl=='dash'&&!R.o.curb&&CMPAI.road.opts.some(q=>q[0]=='fade'),'it is paved: worn asphalt, a dashed yellow centre line and white edge lines, all faded');
 ok(LOOP.length==2&&LOOP.every(p=>p.w==R.w),'the trail is two halves of one loop, each as wide as the road ('+LOOP.map(p=>p.w).join(', ')+')');
 const E=LOOP.map(p=>{const P=cmPathRaw(p);return[P[0],P[P.length-1]]}),same=(a,b)=>Math.hypot(a[0]-b[0],a[1]-b[1])<2,onRoad=q=>Math.abs(q[1]-rY(q[0]))<4;
 ok(same(E[0][1],E[1][0])&&same(E[1][1],E[0][0])&&E.every(e=>e.every(onRoad)),'the halves meet on the road at both ends: a closed loop');
 const A=LOOP.map(cmPathSm),all=A[0].concat(A[1]),xs=all.map(q=>q[0]),ys=all.map(q=>q[1]);
 ok(Math.min(...xs)<320&&Math.max(...xs)>2300&&Math.min(...ys)<300&&Math.max(...ys)>1700,'the loop goes right round the map (x '+Math.round(Math.min(...xs))+'–'+Math.round(Math.max(...xs))+', y '+Math.round(Math.min(...ys))+'–'+Math.round(Math.max(...ys))+')');
 const north=A.find(P=>P.every(q=>q[1]<=rY(q[0])+2)),south=A.find(P=>P.every(q=>q[1]>=rY(q[0])-2));ok(north&&south,'one half loops north of the road, the other south');
 ok(TR.every(p=>p.z<0)&&ROAD.every(p=>!p.z),'the trail is drawn under the road where they cross')}
// ---------- the detours ----------
{ok(SPUR.length==6&&SPUR.every(p=>p.w>=80&&p.w<120),'six short detours off the trail and road, a little narrower ('+SPUR.map(p=>p.w).join(', ')+')');
 const LP=LOOP.map(cmPathSm),near=(q,P,d)=>P.some(r=>Math.hypot(r[0]-q[0],r[1]-q[1])<d),pl=SPUR.map(p=>cmPathRaw(p));
 ok(pl.every(P=>near(P[0],LP[0].concat(LP[1]),60)||Math.abs(P[0][1]-rY(P[0][0]))<6),'each one leaves the trail or the road');
 ok(pl.every(P=>{let s=0;for(let i=1;i<P.length;i++)s+=Math.hypot(P[i][0]-P[i-1][0],P[i][1]-P[i-1][1]);return s<320}),'and is short');
 const LM={cabin:K('logcorner').sort((a,b)=>b.y-a.y)[0],circle:K('cauld').find(o=>!IN(o,CAB)),ruins:K('bench')[0],pumpkin:K('scare').find(o=>!IN(o,[2200,0,2624,400])),grave:K('g_cross')[0],camp:K('campring')[0]};
 const miss=Object.keys(LM).filter(k=>!LM[k]||!pl.some(P=>{const q=P[P.length-1];return Math.hypot(q[0]-LM[k].x,q[1]-LM[k].y)<300}));ok(!miss.length,'each one ends at a landmark: the cabin, the stone circle, the ruins, the pumpkin patch, the graveyard, the campsite '+miss.join(','));
 ok(PA('mosspatch').length>=6,'each landmark has its clearing')}
// ---------- the woods are solid ----------
const WD=PA('woods');
{ok(WD.length>=4&&WD.every(p=>CMPAI.woods.closed&&CMPAI.woods.fl==2&&cmPathBoxes(p).length>50),'the woods are solid shapes ('+WD.length+' of them, '+WD.reduce((s,p)=>s+cmPathBoxes(p).length,0)+' blockers): nobody walks into them, bullets still pass');
 const T=D.obj.filter(o=>o.k=='eoak'||o.k=='eoakv'||o.k=='epine'),WP=WD.map(cmPathSm);
 ok(T.length>=1500,T.length+' enchanted oaks and black pines');
 ok(T.every(o=>o.sol===false),'the trees leave their trunks out (the woods stop people)');
 const out=T.filter(o=>!WP.some(P=>cmPolyIn(P,o.x,o.y)));ok(out.length<=3,'every tree stands in the woods ('+out.length+' outside)');
 ok(OB.eoak.c&&OB.eoak.cf==2&&OB.epine.c,'a tree on its own (in the editor) still blocks at its trunk')}
// ---------- the witch's log cabin ----------
{const L=WS('logs').filter(w=>IN({x:w.x+w.w/2,y:w.y+w.h/2},CAB)),DR=cmDoors(D).filter(q=>q.hz?Math.abs(q.c-92)<8||Math.abs(q.c-316)<8:Math.abs(q.c-2250)<8||Math.abs(q.c-2560)<8);
 const FLR=D.areas.find(a=>a.a=='floor'&&IN({x:a.x+a.w/2,y:a.y+a.h/2},CAB));ok(FLR&&FLR.w>=300&&FLR.h>=220,'the cabin is a little bigger: '+(FLR&&FLR.w)+'×'+(FLR&&FLR.h)+' px (it was 240×176)');
 ok(L.length>=8&&L.every(w=>Math.min(w.w,w.h)==12)&&K('logcorner').filter(o=>IN(o,CAB)).length==4,'log walls with notched log ends at the corners');
 ok(DR.length==2,'two ways in: the front door off the porch and a back door ('+DR.length+')');
 ok(WS('window').filter(w=>IN({x:w.x+w.w/2,y:w.y+w.h/2},CAB)).length>=3&&DC('lightpatch').filter(o=>IN(o,[2260,40,2600,320])).length>=3,'lit windows, their light spilling outside');
 const C=K('candle').filter(o=>IN(o,CAB)),CD=K('cdl').filter(o=>IN(o,CAB)),LT=cmLightSrc(D).filter(s=>IN(s,CAB)&&s.f=='flk');
 ok(C.length>=7&&CD.length==2&&LT.length>=9,'candles everywhere inside: '+C.length+' candles, two candlesticks, '+LT.length+' flickering lights');
 ok(K('chimney').some(o=>o.x>2560&&IN(o,[2560,90,2620,300]))&&FX('smoke').some(o=>o.x>2570&&o.y<200)&&K('fplace').some(o=>IN(o,CAB)),'a stone chimney on the east wall, smoke from it, the hearth inside');
 ok(K('cauld').some(o=>IN(o,CAB))&&DC('ritual').some(o=>IN(o,CAB))&&K('potshelf').some(o=>IN(o,CAB))&&K('bookshelf').some(o=>IN(o,CAB))&&K('bed').some(o=>IN(o,CAB)),'the cauldron on its circle, potions, books, a bed');
 ok(D.areas.some(a=>a.a=='porch'&&a.y>=270)&&D.areas.some(a=>a.a=='floor'&&a.x==2250&&a.o&&a.o.in),'a porch out front; the floor counts as indoors (for the bosses)')}
// ---------- lights: street lamps on the road, lanterns along the trail ----------
{const G=K('gaslamp').concat(K('gaslampf'));ok(G.length>=8&&G.every(o=>Math.abs(o.y-rY(o.x))<80&&Math.abs(o.y-rY(o.x))>60),'iron street lamps along both sides of the road ('+G.length+')');
 const LS=cmLightSrc(D);ok(LS.some(s=>s.f=='fault'&&Math.abs(s.y+82-rY(s.x))<90),'one of them is failing');
 const LP=LOOP.map(cmPathSm),nl=o=>LP.some(P=>P.some(q=>Math.hypot(q[0]-o.x,q[1]-o.y)<90));
 const a=K('lampost').filter(nl),b=K('lampostd').filter(nl),c=K('lampostx').filter(nl);ok(a.length>=15&&b.length>=2&&c.length>=2,'lanterns on posts along the trail: '+a.length+' lit, '+b.length+' smashed, '+c.length+' knocked over');
 ok(LS.filter(s=>s.f=='flk'&&a.some(o=>Math.hypot(o.x+9-s.x,o.y-49-s.y)<2)).length==a.length&&!OB.lampostd.lt&&!OB.lampostx.lt,'the lit ones flicker; the broken ones are dark');
 ok(c.every(o=>cmFoot(o)==null),'nobody trips over a knocked-over lantern (it lies flat)');
 const M=K('gshroom').concat(K('gshroomv'));ok(M.length>=40&&OB.gshroom.lt[0].ng&&!OB.gshroom.lt[0].f,M.length+' clusters of glowing mushrooms, each a faint steady light');
 ok(FX('wisp').length>=6,'will-o-wisps drift over the trail')}
// ---------- the crash: just the cars ----------
{const C=D.obj.filter(o=>o.veh&&IN(o,CRASH));ok(C.length==3&&C.every(o=>o.dmg)&&['sedan','pickup','hatch'].every(k=>C.some(o=>o.veh==k)),'a crash on the road: a sedan, a pickup and a hatchback, all wrecked');
 ok(!D.obj.some(o=>['police','amb','fire'].includes(o.veh))&&!FX('siren').length&&!K('cone').length,'no police, ambulance, fire truck, sirens or cones: just the cars');
 const S=C.find(o=>o.veh=='sedan');ok(S.y<rY(S.x)-30&&D.obj.some(o=>o.k=='eoak'&&Math.hypot(o.x-S.x,o.y-S.y)<60),'the sedan went off the road into a tree');
 ok(PA('skid').filter(p=>{const q=cmPathRaw(p)[0];return IN({x:q[0],y:q[1]},[1700,900,2200,1080])}).length>=2&&DC('glass').filter(o=>IN(o,CRASH)).length>=3&&DC('debris').filter(o=>IN(o,CRASH)).length>=2&&DC('oil').some(o=>IN(o,CRASH)),'skid marks, broken glass, debris, an oil slick');
 ok(FX('hazard').filter(o=>IN(o,CRASH)).length==2&&FX('headlights').filter(o=>IN(o,CRASH)).length==2&&FX('smoke').some(o=>IN(o,CRASH)),'hazards still blinking, headlights on, smoke from the hood')}
// ---------- F1: a tree down across the road ----------
{const T=K('efall')[0];ok(T&&T.y>rY(T.x)-30&&T.y<rY(T.x)&&T.x>400&&T.x<900&&OB.efall.c&&cmFoot(T)[1]<rY(T.x)-120,'F1 an oak lies across the road: its roots in the north woods, the trunk over the north lane, the crown in the middle');
 ok(WS('hidden').some(w=>Math.abs(w.x+w.w/2-T.x)<10&&w.y+w.h<=T.y+2&&w.y+w.h>=T.y-10),'its crown blocks too (a hidden wall over its spread)')}
// ---------- F2: a stream under a wooden bridge ----------
const STR=PA('stream')[0],BRG=D.areas.find(a=>a.a=='bridge');
{const LP=LOOP.map(cmPathSm),P=cmPathSm(STR),hits=LP.reduce((n,L)=>n+L.filter(q=>P.some(r=>Math.hypot(r[0]-q[0],r[1]-q[1])<20)).length,0);
 ok(STR&&STR.w>=40&&hits>0&&BRG&&LP.some(L=>L.some(q=>IN({x:q[0],y:q[1]},[BRG.x,BRG.y,BRG.x+BRG.w,BRG.y+BRG.h]))),'F2 a stream crosses the loop, a wooden bridge over it where the trail goes');
 ok(BRG.h<120&&BRG.h>=64,'the bridge is narrower than the trail ('+BRG.h+' px): a squeeze');
 ok(K('lampost').filter(o=>Math.hypot(o.x-(BRG.x+BRG.w/2),o.y-(BRG.y+BRG.h/2))<110).length==2&&FX('fireflies').filter(o=>Math.hypot(o.x-(BRG.x+BRG.w/2),o.y-(BRG.y+BRG.h/2))<130).length>=1,'a lantern at each end, fireflies over the water')}
// ---------- F4, F5: fireflies, owls, wolves ----------
{const FF=FX('fireflies'),LS=cmLightSrc(D);ok(FF.length>=7&&FF.every(o=>LS.some(s=>s.f=='glow'&&s.ng&&Math.hypot(s.x-o.x,s.y-o.y)<20)),'F4 '+FF.length+' swarms of fireflies over the clearings, each lighting them faintly');
 const OW=FX('owl'),WP=PA('woods').map(cmPathSm);ok(OW.length>=5&&OW.every(o=>WP.some(P=>cmPolyIn(P,o.x,o.y))),'F5 '+OW.length+' owls up in the trees');ok(FX('howl').length==1,'and wolves howling far off');
 const sv_=sfx,m0=mode;let h={};sfx=function(k){h[k]=(h[k]||0)+1};try{mode='play';const o=OW[0],w=FX('howl')[0];for(let t=1;t<200;t+=.1){CMFXI.owl.top(o,t);CMFXI.howl.top(w,t)}}finally{sfx=sv_;mode=m0}
 ok(h.owl>=10&&h.owl<=20&&h.howl>=2&&h.howl<=6,'an owl hoots every 10–18 s ('+h.owl+' in 200 s), the wolves howl every 35–70 s ('+h.howl+')');
 ok(typeof SF.owl=='function'&&typeof SF.howl=='function','the hoot and the howl are real sounds')}
// ---------- the rest of the landmarks ----------
{const SC=K('stonec');ok(SC.filter(o=>IN(o,[1640,520,1940,800])).length==7&&FX('glow').some(o=>IN(o,[1700,560,1880,740])),'the witch stone circle: seven stones round a bubbling cauldron');
 ok(K('jack').filter(o=>IN(o,[1040,1240,1440,1520])).length>=12&&K('scare').some(o=>IN(o,[1040,1240,1440,1520])),'the pumpkin patch and its scarecrow');
 ok(D.obj.filter(o=>/^g_/.test(o.k||'')&&IN(o,[0,1600,420,2016])).length==9&&FX('hands').length==1,'a little graveyard, a hand clawing out of a grave');
 ok(K('tent').length==2&&FX('fire').some(o=>IN(o,[2250,1650,2624,2016]))&&K('campring').length==1,'an abandoned campsite, its fire still burning');
 ok(SC.filter(o=>IN(o,[0,100,420,440])).length==4&&K('bench').length==1,'the old ruins with their bench');
 ok(K('well').some(o=>IN(o,[40,100,380,220]))&&FX('glow').some(o=>IN(o,[40,100,380,220])),'F3 the old stone well at the ruins, something glowing down it')
 ok(K('wagon').length==1&&K('xsign').some(o=>o.tx=='MANSION|CITY'&&ROADB(o)),'the old wagon by the road, the crossroads sign: MANSION one way, CITY the other')}
// ---------- the game builds it ----------
mapId=10;S.mp=10;setGM('f');build();
ok(HS.CM==='builtin-forest'&&WW==2624&&WH==2016&&BG.width==WW,'map 10 builds from forest.json through the custom-map loader');
ok(MP[10].n=='Enchanted Forest'&&MUN[10]===11&&HS.LT&&HS.LT.t=='night'&&HS.HO&&HS.HO.some(h=>h.x==2250),'map number 10 keeps its name and the Horseman; night; the cabin counts as indoors');
// ---------- reach: no pockets, the loop all the way round, round the crash ----------
{const F=new Int16Array(gw*gh);bfs(F,HS.px,HS.py);const cell=(x,y)=>Math.floor(y/gs)*gw+Math.floor(x/gs);
 let pk=0;for(let k=0;k<gw*gh;k++)if(!bl[k]&&F[k]<0)pk++;ok(!pk,'no pockets: every open spot can be reached ('+pk+' cells cannot)');
 const LP=LOOP.map(cmPathSm);let bad=0,t=0;for(const P of LP)for(const q of P){if(Math.abs(q[1]-rY(q[0]))<70)continue;t++;const k=cell(q[0],q[1]);if(bl[k]||F[k]<0)bad++}ok(t>200&&!bad,'the loop can be run all the way round ('+bad+' blocked of '+t+')');
 let tw=0,tb=0;for(const o of D.obj)if(o.k=='eoak'||o.k=='eoakv'||o.k=='epine'){if(o.x<20||o.y<20||o.x>WW-20||o.y>WH-20)continue;tw++;if(bl[cell(o.x,o.y)])tb++}ok(tb>=tw*.98,'the woods block: '+tb+' of '+tw+' tree spots are solid');
 // along the road past the crash, staying on the road
 const S0=new Uint8Array(gw*gh),q=[];for(let j=0;j<gh;j++){const k=j*gw+Math.floor(1800/gs);const y=j*gs+gs/2;if(Math.abs(y-rY(1800))<56&&!bl[k]){S0[k]=1;q.push(k)}}
 while(q.length){const k=q.pop(),i=k%gw,j=(k/gw)|0;for(const[a,b]of[[1,0],[-1,0],[0,1],[0,-1]]){const ii=i+a,jj=j+b;if(ii<0||jj<0||ii>=gw||jj>=gh)continue;const kk=jj*gw+ii,x=ii*gs+gs/2,y=jj*gs+gs/2;if(S0[kk]||bl[kk]||x<1800||x>2420||Math.abs(y-rY(x))>60)continue;S0[kk]=1;q.push(kk)}}
 let thru=0;for(let j=0;j<gh;j++)if(S0[j*gw+Math.floor(2400/gs)])thru++;ok(thru>=2,'you can get past the crash on the road ('+thru+' lanes open on the far side)');
 const road=(xa,xb)=>{const S1=new Uint8Array(gw*gh),q=[];for(let j=0;j<gh;j++){const k=j*gw+Math.floor(xa/gs),y=j*gs+gs/2;if(Math.abs(y-rY(xa))<56&&!bl[k]){S1[k]=1;q.push(k)}}
  while(q.length){const k=q.pop(),i=k%gw,j=(k/gw)|0;for(const[a,b]of[[1,0],[-1,0],[0,1],[0,-1]]){const ii=i+a,jj=j+b;if(ii<0||jj<0||ii>=gw||jj>=gh)continue;const kk=jj*gw+ii,x=ii*gs+gs/2,y=jj*gs+gs/2;if(S1[kk]||bl[kk]||x<xa||x>xb+gs||Math.abs(y-rY(x))>60)continue;S1[kk]=1;q.push(kk)}}
  let n=0,m=0;for(let j=0;j<gh;j++){const y=j*gs+gs/2,x=Math.floor(xb/gs)*gs+gs/2;if(Math.abs(y-rY(x))<56){m++;if(S1[j*gw+Math.floor(xb/gs)])n++}}return[n,m]};
 {const T=K('efall')[0],[n,m]=road(T.x-120,T.x+120);let blk=0;for(let y=rY(T.x)-56;y<rY(T.x)-8;y+=8)if(bl[cell(T.x,y)])blk++;ok(n>=2&&blk>=5,'the fallen tree blocks the north lane and you can get by in the south lane ('+n+' of '+m+' lanes through)')}
 {const B=BRG,y0=B.y+B.h/2,P=cmPathSm(STR);let wet=0,dry=0;for(const q of P){if(q[1]<B.y-60||q[1]>B.y+B.h+60)continue;const k=cell(q[0],q[1]);if(IN({x:q[0],y:q[1]},[B.x,B.y,B.x+B.w,B.y+B.h])){if(!bl[k]&&F[k]>=0)dry++}else if(bl[k])wet++}ok(dry>=3&&wet>=4,'the stream stops people except on the bridge ('+dry+' bridge spots open, '+wet+' stream spots blocked)')}
 const SP=HS.CZ&&HS.CZ.p||[];ok(SP.length>=30&&SP.every(p=>!bl[cell(p[0],p[1])]&&F[cell(p[0],p[1])]>=0),'zombies come out along the trail, the detours and the road ('+SP.length+' places, all open)')}
// ---------- campaign: waves and the Horseman ----------
const A=S.ac;const RNG=new Set([11,19]);
const play=(w0,w1,lim)=>{const R={spawned:0,reached:0,stuck:0,waves:0,err:'',sk:{}};try{for(let w=w0;w<=w1;w++){if(mode!='play')nextWave();let t=0;const seen=new Map();
 while(mode=='play'&&t<lim){for(const p of PL){p.mx=Math.max(p.mx,20);p.hp=p.mx}tick(1);t++;for(const z of zs){if(ZT[z.t].sv)continue;if(!seen.has(z)){seen.set(z,t);R.spawned++}
  const dz=Math.hypot(z.x-P.x,z.y-P.y);if(z.hp>0&&(dz<80||dz<400&&RNG.has(z.t))){R.reached++;hurt(z,z.hp+1,0,0)}else if(z.hp>0&&t-seen.get(z)>5000){R.stuck++;const k=z.t+'@'+Math.round(dz)+'('+Math.round(z.x)+','+Math.round(z.y)+')';R.sk[k]=(R.sk[k]||0)+1;hurt(z,z.hp+1,0,0)}}}
 if(mode=='play'){toSp=0;for(let q=0;q<4000&&mode=='play';q++){for(const z of zs.slice())if(z.hp>0)hurt(z,z.hp+1,0,0);toSp=0;tick(1)}}R.waves++}}catch(e){R.err=e.stack||e.message}return R};
A.un=[0,MUN[0],MUN[3],MUN[1],MUN[14],MUN[15],MUN[8],MUN[2],MUN[9]];A.tut=1;A.bm=[0,1,2].map(()=>[0,3,1,14,15,8,2,9].reduce((v,m)=>v|1<<m,0));S.lm='off';setGM('c');mapId=10;S.mp=10;sel=0;start();ok(mapId===10&&HS.CM==='builtin-forest','a campaign run starts in the Enchanted Forest');
{let R=play(1,3,5000);const R1=R;wave=18;zs=[];toSp=0;mode='shop';const R2=play(19,19,5000);R={spawned:R1.spawned+R2.spawned,reached:R1.reached+R2.reached,stuck:R1.stuck+R2.stuck,waves:R1.waves+R2.waves,err:R1.err||R2.err,sk:Object.assign(R1.sk,R2.sk)};
 ok(!R.err&&R.waves==4&&wave==19,'campaign waves 1–3 and 19 play through in the forest '+R.err);
 ok(R.spawned>60&&R.stuck<=Math.max(2,R.spawned*.02),'zombies reach the player ('+R.reached+' of '+R.spawned+' reached; '+R.stuck+' slow ones '+JSON.stringify(R.sk)+')')}
{if(mode!='play')nextWave();const b=zs.find(q=>ZT[q.t].sv);ok(wave==20&&b&&b.ci==11,'wave 20: the Headless Horseman');
 let near_=0;for(let f=0;f<4000&&b&&b.hp>0&&!near_;f++){P.mx=Math.max(P.mx,20);P.hp=P.mx;tick(1);if(Math.hypot(b.x-P.x,b.y-P.y)<420)near_=1}ok(near_,'the Horseman finds the player');
 b.ph=2;b.iv=0;hurt(b,1e9,0,0);tick(Math.ceil(6/.016));ok(bBt(A,DIF(),10)&&A.un.includes(11),'beating him keeps campaign progress: he joins and the forest counts as beaten')}
// ---------- free play, the Workshop, the editor, the old code ----------
setGM('f');mapId=10;S.mp=10;start();{const R=play(1,1,4000);ok(!R.err&&wave>=1,'a Free Play run plays '+R.err);if(mode!='play')nextWave();const row=olRow();ok(row&&row.map===10&&row.mode=='f','the leaderboard board is still map 10');over(1)}
{const h=wsBuiltins();ok(h.includes('wsBuiltin(10,1)')&&h.includes('Enchanted Forest'),'the Workshop lists the Enchanted Forest under Built-in maps')}
await wsBuiltin(10,0);{const e=CML.find(q=>q.doc&&q.doc.name=='Enchanted Forest (my copy)'),D2=bimDoc(10);ok(e&&e.doc.obj.length==D2.obj.length&&e.doc.paths.length==D2.paths.length,'EDIT A COPY makes your own copy with every piece')}
{const NK=['eoak','eoakv','epine','gshroom','gshroomv','gaslamp','gaslampf','lampost','lampostd','lampostx','xsign','chimney','potshelf','logcorner','efall'];ok(NK.every(k=>OB[k]&&EDPN[k])&&CMPAI.woods&&CMWI.logs&&CMFXI.fireflies&&CMFXI.owl&&CMFXI.howl,'the forest pieces are all in the editor: the trees, glowing mushrooms, iron lamps, lantern posts, the signpost, the cabin pieces, dense woods, log walls');
 const g=document.createElement('canvas').getContext('2d');let err='';for(const k of NK)try{for(const v of[0,.13,.29])OB[k].f(g,100,100,v,'','A|B')}catch(e){err+=k+': '+e.message+' '}
 try{CMWI.logs.f(g,0,0,100,12,'');CMWI.logs.f(g,0,0,12,100,'#5a3a22');CMPAI.woods.f(g,[[0,0],[200,0],[200,150],[0,150]],{x:0,y:0,w:0})}catch(e){err+='woods/logs: '+e.message}
 for(const k of[0,1,2,3,4])try{efSpr(k,20,.5)}catch(e){err+='tree '+k+': '+e.message}
 for(const k of['fireflies','owl'])try{CMFXI[k].top({x:100,y:100},1);CMFXI[k].ed(g,{x:100,y:100})}catch(e){err+=k+': '+e.message}
 try{CMPAI.road.f(g,[[0,50],[300,60]],{x:0,y:0,w:120,o:{fade:1,edge:1,s:'worn'}})}catch(e){err+='road: '+e.message}ok(!err,'every piece draws '+err);
 ok(typeof mapForest=='undefined'&&typeof fsCan=='undefined'&&typeof fsAnim=='undefined'&&typeof fsSpr=='undefined'&&typeof fsZones=='undefined','the old forest map code is gone')}
// ---------- the City Park (which shared the old forest code for its trees) still works ----------
mapId=12;S.mp=12;build();{let err='';try{pkAnim();pkCan()}catch(e){err=e.message}ok(!err&&HS.FS&&HS.FS.cells.some(c=>c&&c.length),'the City Park builds and draws its trees over people '+err)}
mapId=10;build();ok(HS.CM==='builtin-forest','map 10 is still the built-in Enchanted Forest');
console.log('TOTAL fails '+fails+' of '+n);
}
`;
const AF=Object.getPrototypeOf(async function(){}).constructor;
new AF('docL','ivs',code+test)(docL,ivs).catch(e=>{console.log('FAIL crashed: '+(e&&e.stack||e));console.log('TOTAL fails 1');process.exitCode=1});
