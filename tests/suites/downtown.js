// Downtown Zombville (map 13) redone as a map file (src/maps/downtown.json) at the owner's request: bigger, a big city at sunrise
// (glints on the towers' glass, sunlight through shop windows, long shadows), two skyscrapers on superblocks, the front of a real-size
// stadium turned field hospital, the front of Zombville General and its quarantine zone, checkpoints at the edges, wrecks, blood,
// smashed windows, signs to the hospital and the stadium; the owner's picks D1–D10, D12. Reach, the Fire Chief, Free Play, the
// Workshop copy, the editor pieces.
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
const IN=(o,r)=>o.x>r[0]&&o.x<r[2]&&o.y>r[1]&&o.y<r[3],PW=4096,PH=3840;

// ---------- the map file loads ----------
const D=(()=>{const r=cmRead(JSON.stringify(BIMF[13]));ok(r.doc&&!r.errors.length&&!r.warnings.length,'downtown.json loads with no errors or warnings '+(r.errors||[]).concat(r.warnings||[]).slice(0,3).join('; '));return r.doc})();
{const L=cmLint(D).filter(p=>p.lv=='err'||p.lv=='warn');ok(!L.length,'nothing in the Problems list '+L.map(p=>p.m).slice(0,2).join('; '));
 ok(D.w==128&&D.h==120&&D.w*D.h*1024>=2*2900*2400,'bigger: 128×120 tiles (4096×3840 px), more than twice the old 2900×2400');
 ok(D.obj.filter(o=>!o.dc&&!o.fx&&!o.veh).every(o=>cmOB(o.k)),'every prop is a real kit prop');
 ok(!cmDoorBlocks(D).length,'no prop stands in a doorway')}
const K=k=>D.obj.filter(o=>o.k==k),FX=k=>D.obj.filter(o=>o.fx==k),DC=k=>D.obj.filter(o=>o.dc==k),V=k=>D.obj.filter(o=>o.veh==k),PA=k=>D.paths.filter(p=>p.p==k),WS=s=>D.walls.filter(w=>w.s==s),AR=k=>D.areas.filter(a=>a.a==k);
const ROOF=AR('roof'),TOW=ROOF.filter(a=>a.o&&a.o.s=='tower'&&a.x<3700);const TOW0=TOW.filter(a=>!a.z);
// ---------- sunrise ----------
{ok(D.lt&&D.lt.t=='sunrise'&&cmLtP('sunrise')&&CMLT.some(p=>p.id=='sunrise'&&p.n=='Sunrise')&&D.lt.a>=.5&&D.lt.a<=.7,'it takes place at sunrise (a new lighting: low golden light)');
 ok(FX('glint').length>=12&&FX('glint').every(o=>ROOF.some(a=>Math.abs(o.x-(a.x+a.w))<8||Math.abs(o.x-a.x)<8||Math.abs(o.y-(a.y+a.h))<8)),FX('glint').length+' sun glints sliding along the towers\\' sunny glass');
 const FL=AR('floor').filter(a=>a.o&&a.o.in);ok(DC('sunbeam').length>=25&&DC('sunbeam').every(o=>FL.some(a=>o.x>=a.x&&o.x<=a.x+a.w&&o.y>=a.y&&o.y<=a.y+a.h)),DC('sunbeam').length+' beams of sunlight falling through shop and lobby windows');
 ok(cmLightSrc(D).filter(s=>s.ng&&DC('sunbeam').some(o=>o.x==s.x&&o.y==s.y)).length==DC('sunbeam').length,'the sunbeams light the floors (a steady light each)');
 ok(AR('sunshadow').length>=20&&AR('sunshadow').every(a=>a.o.d=='e'||a.o.d=='s'),AR('sunshadow').length+' long shadows stretching west (the sun is in the east)')}
// ---------- a big city: two skyscrapers on superblocks ----------
{ok(TOW0.length>=2&&TOW0.filter(a=>a.w>=700&&a.h>=700).length==2,'two skyscrapers, each on a superblock four blocks big ('+TOW0.map(a=>a.w+'×'+a.h).join(', ')+')');
 const RD=PA('road').map(cmPathSm),SBX=TOW0.filter(a=>a.w>=700).map(a=>[a.x-100,a.y-100,a.x+a.w+100,a.y+a.h+100]);ok(!RD.some(P=>P.some(q=>SBX.some(b=>IN({x:q[0],y:q[1]},b)))),'no street runs through them: the streets between the four blocks were closed for the plaza');
 ok(PA('road').filter(p=>p.w>=160).length>=2&&PA('road').length>=10&&AR('junction').length>=20,'wide four-lane avenues and boulevards, '+AR('junction').length+' intersections');
 ok(TOW.some(a=>a.tx=='ZOMBVILLE TOWER')&&TOW.some(a=>/FIRST BANK/.test(a.tx||''))&&TOW.filter(a=>a.z>0).length>=4&&TOW.some(a=>a.z>0&&a.o.pad),'Zombville Tower and the First Bank tower, their tops stepping up in setbacks (a helipad on top)');
 const SH=AR('floor').filter(a=>a.o&&a.o.in).length;ok(SH>=35&&K('awning').length>=30,SH+' shops, restaurants and lobbies you can walk into')}
// ---------- the stadium: real size, only its front ----------
const AN=PA('arena')[0];
{const P=cmPathSm(AN),xs=P.map(q=>q[0]),ys=P.map(q=>q[1]);ok(AN&&CMPAI.arena.fl===0&&cmPathBoxes(AN).length>20,'the stadium is a solid shape');
 ok(Math.max(...xs)-Math.min(...xs)>=3000&&Math.max(...ys)<=520&&Math.min(...ys)<0,'only its front shows: '+Math.round(Math.max(...xs)-Math.min(...xs))+' px of curved facade across the top, coming at most '+Math.round(Math.max(...ys))+' px into the map');
 // the curve says how big the whole thing is: fit a circle through three points of the front
 const fr=P.filter(q=>q[1]>0).sort((a,b)=>a[0]-b[0]),a=fr[0],b=fr[Math.floor(fr.length/2)],c=fr[fr.length-1],d=2*(a[0]*(b[1]-c[1])+b[0]*(c[1]-a[1])+c[0]*(a[1]-b[1])),
  ux=((a[0]**2+a[1]**2)*(b[1]-c[1])+(b[0]**2+b[1]**2)*(c[1]-a[1])+(c[0]**2+c[1]**2)*(a[1]-b[1]))/d,uy=((a[0]**2+a[1]**2)*(c[0]-b[0])+(b[0]**2+b[1]**2)*(a[0]-c[0])+(c[0]**2+c[1]**2)*(b[0]-a[0]))/d,r=Math.hypot(a[0]-ux,a[1]-uy);
 ok(r*2>=4500,'at the scale of the cars (a sedan is '+HWV('sedan')[0]+' px) the whole stadium would be '+Math.round(r*2)+' px across, a real stadium');
 ok(K('stadgate').length>=4&&K('stadgate').every(o=>Math.abs(o.y-cmPathSm(AN).reduce((m,q)=>Math.abs(q[0]-o.x)<Math.abs(m[0]-o.x)?q:m)[1])<20),'its gates stand on the facade, shut');
 ok(K('stadsign').length==1&&K('medtent').filter(o=>o.y<800).length>=5&&K('cot').concat(K('cotx')).filter(o=>o.y<800).length>=8&&K('screen').some(o=>/TRIAGE/.test(o.tx||'')),'a field hospital in its plaza: tents, cots, triage');
 ok(K('monsign').some(o=>/MEDICAL OPERATIONS/.test(o.tx||''))&&K('ledsign').some(o=>/STADIUM GATE A/.test(o.tx||'')&&o.y<800),'signs tell the injured to come to the stadium')}
// ---------- the hospital: only its front, along the east side ----------
{const HR=ROOF.filter(a=>a.x>=3700&&a.x+a.w>=PW);const x0=Math.min(...HR.map(a=>a.x)),y0=Math.min(...HR.map(a=>a.y)),y1=Math.max(...HR.map(a=>a.y+a.h));
 ok(HR.length>=3&&PW-x0<=320&&y1-y0>=3000,'Zombville General along the east edge: only its front shows ('+(PW-x0)+' px deep, '+(y1-y0)+' px long)');
 const DR=D.walls.filter(w=>w.s=='autodoor'&&w.x>=3700);ok(DR.length>=3&&K('ercanopy').length==1&&V('amb').filter(o=>o.x>3450).length>=3,'its main entrance, the ER under its canopy, quarantine intake; ambulances');
 ok(PA('chain').some(p=>cmPathRaw(p).some(q=>q[0]>3500&&q[1]>2300))&&K('qsign').some(o=>/QUARANTINE/.test(o.tx||'')&&o.x>3450)&&K('screen').some(o=>/QUARANTINE/.test(o.tx||'')),'the quarantine zone: fenced, taped, screening tents');
 ok(D.spawns.filter(p=>p.x>3700&&p.y>1000).length>=3,'zombies come out of its doors')}
// ---------- the outbreak ----------
{const W=K('sbag').filter(o=>o.x<200),G=K('guardbooth'),SC=K('screen').filter(o=>o.x<300);ok(W.length>=20&&G.length>=5&&SC.length>=5&&SC.every(o=>/INFECTION SCREENING/.test(o.tx||'')),'military checkpoints on every street out west: sandbags, guard booths, infection screening tents');
 ok(K('wtower').length>=2&&V('hmv').length>=5&&PA('wire').length>=3&&PA('chain').filter(p=>cmPathRaw(p).every(q=>q[0]<60)).length>=3,'watchtowers, Humvees, a razor-wire fence along the edge');
 const SL=K('jersey').concat(K('pbarr')).filter(o=>o.y>PH-60);ok(SL.length>=12&&V('police').filter(o=>o.y>PH-300).length>=6,'police lines across every avenue at the south edge');
 const BX=K('jersey').concat(K('sbag')).concat(K('pbarr')),CR=D.obj.filter(o=>o.veh&&o.dmg&&BX.some(b=>Math.hypot(b.x-o.x,b.y-o.y)<130));ok(CR.length>=4,CR.length+' cars crashed into the barricades');
 ok(['bloodpool','bloodsmear','bloodtrail','drag','bloodsplash','bloodfoot','deadz'].reduce((s,k)=>s+DC(k).length,0)>=60&&DC('sheetbody').length>=6,'blood in the streets, the dead under sheets');
 const g=WS('glass').length,x=WS('window_x').length;ok(x>=45&&x/(g+x)>=.4&&x/(g+x)<=.8&&DC('glass').length>=80,'smashed windows in most shops: '+x+' of '+(g+x)+' panes, glass on the sidewalks');
 const SP=DC('spray').map(o=>o.tx||'');ok(SP.some(t=>/HOSPITAL/.test(t))&&SP.some(t=>/STADIUM/.test(t))&&D.obj.filter(o=>(o.k=='dirsign'||o.k=='cardsign')&&/HOSPITAL|STADIUM/.test(o.tx||'')).length>=4,'signs and spray paint send survivors to the hospital and the stadium');
 ok(!V('fire').some(o=>o.dmg)&&V('police').length>=10&&V('amb').length>=4,'police cars and ambulances where they make sense')}
// ---------- the owner's picks ----------
{const S1=K('subway')[0];ok(S1&&D.spawns.some(p=>Math.hypot(p.x-S1.x,p.y-S1.y)<80),'D1 a subway entrance, zombies coming up out of it');
 const DK=K('eldeck'),TR=DK.filter(o=>o.vr>=.5);ok(DK.length>=15&&OB.eldeck.ov&&TR.length==3&&TR.filter(o=>o.vr>=.8).length==1&&K('elpillar').length>=10,'D2 the elevated railway along El Street, a stopped train on it, its pillars in the street');
 ok(K('fntn').length==1&&K('statue').length==1&&K('notewall').length==1&&K('bench').length>=4,'D3 the central plaza: fountain, statue, the missing-persons wall, benches');
 ok(K('storesign').some(o=>o.tx=='FIRE STATION 1')&&V('fire').length>=1&&WS('rollup').length>=2&&K('awning').some(o=>o.tx=='ZOMBVILLE POLICE')&&K('riot').length>=4,'D4 Fire Station 1 (bay doors open) and police headquarters (riot gear dropped)');
 const HX_=K('helix')[0],BZ=FX('blaze').filter(o=>Math.hypot(o.x-HX_.x,o.y-HX_.y)<150);ok(HX_&&BZ.length>=2&&BZ.filter(o=>!(o.o&&o.o.smoke===0)).length==1,'D5 an army helicopter down in an intersection, burning (big fires, one of them with black smoke)');
 ok(!K('dirsign').concat(K('cardsign')).some(o=>Math.hypot(o.x-HX_.x,o.y-HX_.y)<160)&&!FX('steam').some(o=>Math.hypot(o.x-HX_.x,o.y-HX_.y)<250),'no signpost stuck through the helicopter, no manhole steam mixing into its smoke');
 {const F=cmFx('blaze'),L_=[];F.lts(BZ[0],1,0,L_);F.lts(BZ[1],1,0,L_);let e=null;try{F.ed(document.createElement('canvas').getContext('2d'),{fx:'blaze',x:200,y:300,sc:1,o:{}});for(const t of[0,1.3,7.9])F.anim(BZ[0],t),F.top(BZ[0],t)}catch(er){e=er}
  ok(F.anim&&F.top&&F.ed&&L_.length==1&&L_[0].f=='fire'&&!e,'the big fire draws flames under people and smoke over them, in the editor too, and lights the street '+(e||''))}
 const B=V('citybus')[0],SF=V('sedan').find(o=>o.dmg&&D.walls.every(w=>!(o.x>w.x-30&&o.x<w.x+w.w+30&&Math.abs(w.y+w.h/2-(o.y-8))<6))&&D.areas.some(a=>a.a=='floor'&&o.x>a.x&&o.x<a.x+a.w&&Math.abs(o.y-8-a.y)<4));
 ok(B&&B.dmg&&B.r>30&&B.r<70&&SF,'D6 a city bus jackknifed across Zombville Ave, a car through the diner window');
 const TK=V('tanker')[0];ok(TK&&TK.dmg&&FX('fire').filter(o=>Math.hypot(o.x-TK.x,o.y-TK.y)<200).length>=3&&AR('canopy').length==1,'D7 a fuel tanker crashed into the gas station, burning');
 const SO=K('roofsos')[0];ok(SO&&SO.z>0&&ROOF.some(a=>IN(SO,[a.x,a.y,a.x+a.w,a.y+a.h]))&&FX('smoke').some(o=>Math.hypot(o.x-SO.x,o.y-SO.y)<200),'D8 HELP painted on a roof, a signal fire smoking beside it');
 ok(K('ledsign').length>=10&&typeof OB.ledsign.an=='function'&&HS!=null,'D9 '+K('ledsign').length+' flashing LED message signs');
 ok(FX('pigeons').length>=5,'D10 '+FX('pigeons').length+' flocks of pigeons');ok(FX('steam').length>=8&&FX('litter').length>=6,'D12 steam from the manholes, newspapers blowing down the streets')}
// ---------- the game builds it ----------
mapId=13;S.mp=13;setGM('f');build();
ok(HS.CM==='builtin-downtown'&&WW==4096&&WH==3840&&BG.width==WW,'map 13 builds from downtown.json through the custom-map loader');
ok(MP[13].n=='Downtown Zombville'&&MUN[13]===14&&HS.LT&&HS.LT.t=='sunrise'&&HS.RG&&HS.RG.N.length>=20&&HS.TRK&&HS.TRK.length>=10,'map number 13 keeps its name and the Fire Chief, whose road graph covers the streets ('+(HS.RG&&HS.RG.N.length)+' crossings)');
start();{const C=HS.CX,BZ=D.obj.filter(o=>o.fx=='blaze');ok(C&&BZ.length==3&&BZ.every(b=>C.A.some(it=>it.o.id===b.id)&&C.T.some(it=>it.o.id===b.id)),'every big fire burns in the game (flames under people, smoke over them where it has smoke)')}
{const C=HS.CX;ok(C&&C.A.some(q=>q.o.k=='ledsign')&&C.O.some(q=>q.o.k=='eldeck')&&C.T.some(q=>q.o.fx=='pigeons')&&C.T.some(q=>q.o.fx=='steam'),'the signs flash, the elevated track hangs over people, the pigeons and the steam run');
 let err='';try{const o=K('ledsign')[0];for(let t=0;t<12;t+=.4)OB.ledsign.an(o,t);for(const k of['glint','litter','pigeons'])CMFXI[k].anim(FX(k)[0],3);for(const k of['steam','pigeons'])CMFXI[k].top(FX(k)[0],3)}catch(e){err=e.message}ok(!err,'they all draw '+err);
 const o=FX('pigeons')[0],sv_=sfx;let fl=0;sfx=function(k){if(k=='flap')fl++};const m0=mode,PL0=PL;try{mode='play';PL=[{x:o.x+400,y:o.y,hp:1}];CMFXI.pigeons.top(o,1);const s0=DTST.get(o).m;PL[0].x=o.x+60;CMFXI.pigeons.top(o,2);const s1=DTST.get(o).m;CMFXI.pigeons.top(o,5);const s2=DTST.get(o).m;PL[0].x=o.x+700;CMFXI.pigeons.top(o,14);const s3=DTST.get(o).m;
  ok(s0=='sit'&&s1=='fly'&&fl==1&&s2=='gone'&&s3=='sit'&&typeof SF.flap=='function','the pigeons scatter in a clatter of wings when you come near, and come back ('+[s0,s1,s2,s3].join(' → ')+')')}finally{sfx=sv_;mode=m0;PL=PL0}}
// ---------- reach ----------
{const F=new Int16Array(gw*gh);bfs(F,HS.px,HS.py);const cell=(x,y)=>Math.floor(y/gs)*gw+Math.floor(x/gs);let pk=0;for(let k=0;k<gw*gh;k++)if(!bl[k]&&F[k]<0)pk++;ok(!pk,'no pockets: every open spot can be reached ('+pk+' cells cannot)');
 const J=AR('junction').map(a=>[a.x+a.w/2,a.y+a.h/2]),bad=J.filter(([x,y])=>{for(let r=0;r<=48;r+=16)for(const[dx,dy]of[[0,0],[r,0],[-r,0],[0,r],[0,-r]]){const k=cell(x+dx,y+dy);if(!bl[k]&&F[k]>=0)return false}return true});ok(!bad.length,'every intersection can be reached '+JSON.stringify(bad.slice(0,3)));
 ok(D.spawns.every(p=>{const k=cell(p.x,p.y);return!bl[k]&&F[k]>=0}),D.spawns.length+' zombie spawn points, all on open ground you can reach')}
// ---------- campaign: waves and the Fire Chief ----------
const A=S.ac;const RNG=new Set([11,19]);
const play=(w0,w1,lim)=>{const R={spawned:0,reached:0,stuck:0,waves:0,err:'',sk:{}};try{for(let w=w0;w<=w1;w++){if(mode!='play')nextWave();let t=0;const seen=new Map();
 while(mode=='play'&&t<lim){for(const p of PL){p.mx=Math.max(p.mx,20);p.hp=p.mx}tick(1);t++;for(const z of zs){if(ZT[z.t].sv)continue;if(!seen.has(z)){seen.set(z,t);R.spawned++}
  const dz=Math.hypot(z.x-P.x,z.y-P.y);if(z.hp>0&&(dz<80||dz<400&&RNG.has(z.t))){R.reached++;hurt(z,z.hp+1,0,0)}else if(z.hp>0&&t-seen.get(z)>5000){R.stuck++;const k=z.t+'@'+Math.round(dz)+'('+Math.round(z.x)+','+Math.round(z.y)+')';R.sk[k]=(R.sk[k]||0)+1;hurt(z,z.hp+1,0,0)}}}
 if(mode=='play'){toSp=0;for(let q=0;q<4000&&mode=='play';q++){for(const z of zs.slice())if(z.hp>0)hurt(z,z.hp+1,0,0);toSp=0;tick(1)}}R.waves++}}catch(e){R.err=e.stack||e.message}return R};
A.un=[0];A.cp=CORD.length;A.tut=1;A.bm=[0,1,2].map(()=>CORD.reduce((v,m)=>m==13?v:v|1<<m,0));S.lm='off';setGM('c');mapId=13;S.mp=13;sel=0;start();ok(mapId===13&&HS.CM==='builtin-downtown','a campaign run starts Downtown');
{let R=play(1,3,5000);const R1=R;wave=18;zs=[];toSp=0;mode='shop';const R2=play(19,19,5000);R={spawned:R1.spawned+R2.spawned,reached:R1.reached+R2.reached,stuck:R1.stuck+R2.stuck,waves:R1.waves+R2.waves,err:R1.err||R2.err,sk:Object.assign(R1.sk,R2.sk)};
 ok(!R.err&&R.waves==4&&wave==19,'campaign waves 1–3 and 19 play through Downtown '+R.err);
 ok(R.spawned>60&&R.stuck<=Math.max(2,R.spawned*.02),'zombies reach the player ('+R.reached+' of '+R.spawned+' reached; '+R.stuck+' slow ones '+JSON.stringify(R.sk)+')')}
{if(mode!='play')nextWave();const b=zs.find(q=>ZT[q.t].sv);ok(wave==20&&b&&b.ci==14,'wave 20: the Fire Chief');
 let near_=0,moved=0;const x0=b.x,y0=b.y;for(let f=0;f<4000&&b&&b.hp>0&&!(near_&&moved);f++){P.mx=Math.max(P.mx,20);P.hp=P.mx;tick(1);if(Math.hypot(b.x-x0,b.y-y0)>200)moved=1;if(Math.hypot(b.x-P.x,b.y-P.y)<500)near_=1}ok(b.rd&&moved&&near_,'he drives the engine down the streets and finds the player '+[!!b.rd,moved,near_,Math.round(Math.hypot(b.x-P.x,b.y-P.y)),Math.round(P.x),Math.round(P.y),Math.round(b.x),Math.round(b.y)].join(' '));
 b.ph=2;b.iv=0;hurt(b,1e9,0,0);tick(Math.ceil(6/.016));ok(bBt(A,DIF(),13)&&A.un.includes(14),'beating him keeps campaign progress: he joins and Downtown counts as beaten')}
// ---------- free play, the Workshop, the editor, the old code ----------
setGM('f');mapId=13;S.mp=13;start();{const R=play(1,1,4000);ok(!R.err&&wave>=1,'a Free Play run plays '+R.err);if(mode!='play')nextWave();const row=olRow();ok(row&&row.map===13&&row.mode=='f','the leaderboard board is still map 13');over(1)}
{const h=wsBuiltins();ok(h.includes('wsBuiltin(13,1)')&&h.includes('Downtown Zombville'),'the Workshop lists Downtown Zombville under Built-in maps')}
await wsBuiltin(13,0);{const e=CML.find(q=>q.doc&&q.doc.name=='Downtown Zombville (my copy)'),D2=bimDoc(13);ok(e&&e.doc.obj.length==D2.obj.length&&e.doc.lt.t=='sunrise','EDIT A COPY makes your own copy with every piece, at sunrise')}
{const NK=['pbarr','pbarrx','screen','medtent','cot','cotx','wtower','stadgate','stadsign','monsign','ercanopy','qsign','cardsign','notewall','subway','elpillar','eldeck','helix','roofsos','ledsign','riot','suitcase'];
 ok(NK.every(k=>OB[k]&&EDPN[k])&&CMPAI.arena&&CMPAI.tape&&CMAI.sunshadow&&CMDI.sunbeam&&CMDI.spray&&['glint','pigeons','steam','litter'].every(k=>CMFXI[k])&&EDVN.citybus&&EDVN.tanker,'the new pieces are all in the editor');
 const g=document.createElement('canvas').getContext('2d');let err='';for(const k of NK)try{for(const v of[0,.55,.85])OB[k].f(g,100,100,v,'','A|B')}catch(e){err+=k+': '+e.message+' '}
 for(const k of['citybus','tanker'])try{hwDraw(g,{k,x:200,y:100,a:0,L:HWV(k)[0],W:HWV(k)[1],dmg:1})}catch(e){err+=k+': '+e.message}
 try{CMPAI.arena.f(g,[[0,-40],[400,-40],[380,100],[200,160],[20,100]],{x:0,y:0,w:0});CMPAI.tape.f(g,[[0,0],[200,0]],{});CMAI.sunshadow.f(g,{x:0,y:0,w:100,h:40,o:{d:'e',s:1}})}catch(e){err+='shapes: '+e.message}ok(!err,'every piece draws '+err);
 ok(typeof mapDowntown=='undefined'&&typeof dtAnim=='undefined','the old Downtown map code is gone')}
mapId=13;build();ok(HS.CM==='builtin-downtown','map 13 is still the built-in Downtown Zombville');
console.log('TOTAL fails '+fails+' of '+n);
}
`;
const AF=Object.getPrototypeOf(async function(){}).constructor;
new AF('docL','ivs',code+test)(docL,ivs).catch(e=>{console.log('FAIL crashed: '+(e&&e.stack||e));console.log('TOTAL fails 1');process.exitCode=1});
