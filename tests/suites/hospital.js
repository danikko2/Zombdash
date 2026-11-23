// Zombville General (map 18), Zombville's finale, at the owner's request: a big hospital played on its upper floor, halls about
// twice real width. The plan the owner picked (Nov 2026): an old brick wing (surgery, pre-op and recovery, the cafeteria, the
// morgue, the chapel) and a new tower (the ICU, patient rooms, radiology, the lab, the pharmacy, the ER under it), joined by a glass
// atrium (the fountain, the elevators) and a skybridge over a courtyard; outside is the level below (lower features: parallax, the
// walls running down to it). Rooms laid out like real ones; backup power; locked until the rest of Zombville is beaten; Abigail
// standing in as the wave-20 boss; then the escape: the elevator to the roof at night, the helicopter, the door gunner.
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
const PW=4096,PH=3840;
// ---------- the map files load ----------
const D=(()=>{const r=cmRead(JSON.stringify(BIMF[18]));ok(r.doc&&!r.errors.length&&!r.warnings.length,'hospital.json loads with no errors or warnings '+(r.errors||[]).concat(r.warnings||[]).slice(0,3).join('; '));return r.doc})();
const DR=(()=>{const r=cmRead(JSON.stringify(BIMX[18]));ok(r.doc&&!r.errors.length,'the roof (hospital-roof.json) loads '+(r.errors||[]).join('; '));return r.doc})();
{const L=cmLint(D).filter(p=>p.lv=='err'||p.lv=='warn');ok(!L.length,'nothing in the Problems list '+L.map(p=>p.m).slice(0,2).join('; '));
 ok(D.w==128&&D.h==120&&D.id=='builtin-hospital'&&D.name=='Zombville General','128×120 tiles (4096×3840 px): as wide as a map can be');
 ok(D.obj.filter(o=>!o.dc&&!o.fx&&!o.veh&&!o.f).every(o=>cmOB(o.k)),'every prop is a real kit prop');ok(!cmDoorBlocks(D).length,'no prop stands in a doorway '+cmDoorBlocks(D).slice(0,2).map(b=>JSON.stringify(b).slice(0,80)).join(' '));
 ok(D.areas.filter(a=>a.a=='floor').length>=50&&D.lt.t=='cold','floors everywhere inside, the cold backup-power dark')}
const K=k=>D.obj.filter(o=>o.k==k),FX=k=>D.obj.filter(o=>o.fx==k),DC=k=>D.obj.filter(o=>o.dc==k),AR=k=>D.areas.filter(a=>a.a==k),PA=k=>D.paths.filter(p=>p.p==k),WS=s=>D.walls.filter(w=>w.s==s);
const HS_=t=>K('hsign').some(o=>o.tx==t),LO=D.feats.filter(f=>f.f=='lower'),inLo=(x,y)=>LO.some(f=>x>=f.x&&x<f.x+f.w&&y>=f.y&&y<f.y+f.h),inR=(o,a)=>o.x>=a.x&&o.x<a.x+a.w&&o.y>=a.y&&o.y<a.y+a.h;
// ---------- the plan the owner picked: an old wing and a new tower ----------
{ok(WS('brick').length>=20&&WS('concrete').length>=20,'the old wing in brick, the tower in concrete with long windows');
 const at=(x,y)=>D.areas.filter(a=>a.a=='floor'&&x>=a.x&&x<a.x+a.w&&y>=a.y&&y<a.y+a.h);ok(at(2016,512).length&&WS('glass').filter(w=>w.y>=370&&w.y<=650&&w.w>=1000).length==2,'a glass skybridge between them');
 const F=AR('hfount')[0];ok(F&&F.w>=380&&F.o.on==1&&F.x>1088&&F.x+F.w<2560&&WS('glass').some(w=>w.y>1780&&w.y<1800&&w.w>=200)&&WS('glass').some(w=>w.y>=3310&&w.y<3340&&w.w>=1400),'the glass atrium joins them at the south: the big running fountain in the middle');
 const halls=D.areas.filter(a=>a.a=='floor'&&(a.w>=1000&&a.h==256||a.h>=1000&&a.w==256));ok(halls.length>=7,'halls 256 px wide (twice a real hall and a little more, at the owner\\'s word): '+halls.length);
 ok(K('infodesk').length==1&&K('admdesk').some(o=>o.tx=='ADMISSIONS')&&K('wseat').length>=6&&K('lounge').length>=6&&K('planterb').length>=2&&K('cbar').length==1,'the atrium: the information desk, admissions with its seats, lounge chairs, the coffee bar')}
// ---------- outside is the level below ----------
{ok(LO.length>=4&&LO.every(f=>f.o&&f.o.fl==1),'outside is a floor down: '+LO.length+' lower boxes');
 ok(inLo(2016,1200)&&inLo(1824,3600)&&inLo(3300,3700)&&inLo(20,2000),'the courtyard, the drop-off plaza, the ambulance drive and the strip round the building are all below');
 const T=['oak','oak_b','maple','willow','birch'];ok(D.obj.filter(o=>T.includes(o.k)).length>=15&&D.obj.filter(o=>T.includes(o.k)).every(o=>inLo(o.x,o.y))&&D.obj.filter(o=>o.veh).every(o=>inLo(o.x,o.y)),'the old trees, the ambulances and the cars are all down there');
 ok(AR('roomlight').filter(a=>inLo(a.x+a.w/2,a.y+a.h/2)).length>=3&&FX('light').filter(o=>inLo(o.x,o.y)&&!/^#ff1/.test(o.c||'')).length>=6,'moonlight and the orange of street lamps below');
 ok(!D.spawns.some(p=>inLo(p.x,p.y)),'no zombie starts down there')}
// ---------- rooms laid out like real ones (the owner asked) ----------
{const RL=AR('roomlight').filter(a=>!inLo(a.x+a.w/2,a.y+a.h/2)),B=K('pbed'),bad=[],two=[];for(const a of RL){const r={x:a.x-12,y:a.y-12,w:a.w+24,h:a.h+24},b=B.filter(o=>inR(o,r));if(b.length>2)bad.push(a.x+','+a.y+':'+b.length);if(b.length==2){two.push(a);if(!K('privscr').some(o=>inR(o,r)))bad.push(a.x+','+a.y+': no divider')}}
 ok(B.length>=20&&!bad.length&&two.length>=5,'every room that treats patients has one bed, or two with a divider between them ('+B.length+' beds; '+two.length+' rooms of two; '+bad.join(' ')+')');
 // the chapel: lengthways (west to east), the altar at the west end, the pews in rows across it facing the altar, an aisle down the middle
 const al=K('altar'),pw=K('pew');ok(al.length==1&&al[0].r==270&&pw.length>=16&&pw.every(p=>p.r==270&&p.x>al[0].x+150&&p.y>3328&&p.y<3776)&&new Set(pw.map(p=>p.x)).size>=8,'the chapel: lengthways, the altar at the west end, '+pw.length+' pews in rows facing it');
 {const ys=[...new Set(pw.map(p=>p.y))].sort((a,b)=>a-b);ok(ys.length==2&&ys[1]-ys[0]>=200,'two blocks of pews with the aisle between them')}
 // the ER: a waiting room with check-in and triage in front, staff doors, exam and trauma rooms behind
 ok(K('admdesk').some(o=>o.tx=='CHECK-IN')&&K('dplate').some(o=>o.tx=='TRIAGE')&&K('dplate').filter(o=>/^EXAM/.test(o.tx)).length==3&&HS_('TREATMENT')&&K('qsign').some(o=>o.tx=='STAFF ONLY')&&K('nstation').some(o=>o.tx=='EMERGENCY'),'the ER: the waiting room with check-in and triage, then staff doors to exam rooms and trauma rooms');
 ok(K('ortable').length==3&&K('anesth').length>=3&&K('scrubsink').length==3&&HS_('SURGERY')&&K('privscr').length>=8,'surgery (old wing): three operating rooms off a sterile hall with scrub sinks; pre-op and recovery');
 ok(D.obj.filter(o=>o.k=='dplate'&&/^ICU [0-9]/.test(o.tx)).length==4&&K('nstation').some(o=>o.tx=='ICU STATION')&&K('hvent').length>=3,'the ICU: glass-fronted rooms facing the ICU station');
 ok(K('mri').length==1&&K('ctscan').length==1&&K('xray').length==1&&K('labbench').length==2&&K('fumehood').length==2&&K('rxcounter').length==1,'radiology (X-ray, CT, MRI, each with its control room), the lab, the pharmacy');
 ok(K('servline').length==1&&K('ctable').length>=8&&K('mdrawers').length==2&&K('autopsy').length==1,'the cafeteria and its kitchen, the morgue');
 ok(K('giftshelf').length>=3&&K('giftshelf').every(o=>o.x<1088)&&!D.walls.some(w=>w.x>1100&&w.x<2540&&w.y>1800&&w.y<3300&&!['glass','concrete'].includes(w.s)),'the gift shop is in the old wing (its window on the atrium), not a box in the middle of it');
 ok(FX('alarm').length>=12&&FX('hanglight').length>=4&&FX('sparks').length>=4&&FX('softlight').length>=30&&FX('softlight').some(o=>(o.o||{}).k=='flk'),'backup power: halls lit in stretches, some flickering, dark where the lights broke, lights hanging by their wires, sparks; fire alarms pulsing red');
 ok(DC('wetfloor').length>=10&&FX('light').filter(o=>/^#ff1/.test(o.c||'')).length>=10&&cmLtP('cold').mul=='#0e1a38','the look after the reference pictures: a cold dark, red emergency light, wet floors');
 {const hid=WS('hidden'),bio=DC('biohaz'),tape=PA('tape');ok(hid.length>=5&&bio.length>=10&&tape.length>=10,'small rooms sealed off: no way in, the biohazard mark, the door taped over ('+hid.length+' sealed)')}
 ok(AR('elev').length==4&&AR('elev').filter(a=>a.o.st=='esc').length==1,'four elevators, one of them the way to the roof');
 ok(D.spawns.length==5&&AR('steps').length>=10,'zombies come up the stairs: four stairwells and the main stairs from the street')}
function V_(k){return D.obj.filter(o=>o.veh==k).length}
// ---------- the roof ----------
{const ok2=(c,m)=>ok(c,'roof: '+m);ok2(DR.lt&&DR.lt.t=='night'&&DR.areas.some(a=>a.a=='hpad')&&DR.areas.some(a=>a.a=='elev'&&a.o.st=='esc'),'night, the helipad, the elevator up');
 ok2(DR.walls.filter(w=>w.s=='parapet').length==4&&DR.areas.filter(a=>a.a=='below').length==4,'the parapet all round, the city far below');
 ok2(DR.obj.filter(o=>o.k=='sweeplight').length==4&&DR.obj.some(o=>o.k=='rsign')&&DR.obj.some(o=>o.k=='mast')&&DR.obj.some(o=>o.k=='windsock'),'searchlights, the big sign, the antenna, a windsock')}
// ---------- locked until the rest of Zombville is beaten ----------
{const A={un:[0],bm:[0,0,0]};for(const m of[0,3,1,14,15,8,2,9,10,16,11,12,13])A.bm[0]|=1<<m;ok(secOf(18)==2&&SEC[2].m[4]==18&&!mOpen(A,0,18),'Zombville General is Zombville\\'s fifth map, and it stays shut while Zombville Stadium isn\\'t beaten');
 A.bm[0]|=1<<17;ok(mOpen(A,0,18)&&cFront(A,0)==18,'beat the other four and it opens: the campaign goes there next');
 const B={un:[0],bm:[0,0,0]};for(const m of[0,3,1,14,15,8,2,9,10,16,11,12,13,17])B.bm[0]|=1<<m;ok(secDone(B,0,2),'an account that finished Zombville before keeps it finished')}
// ---------- the game builds it ----------
const A=S.ac;A.un=[0,1,2,3,4,5,6,7,8,9];A.cp=CORD.length;A.tut=1;A.bm=[0,1,2].map(()=>CORD.reduce((v,m)=>m==18?v:v|1<<m,0));A.slt={};S.lm='off';
mapId=18;S.mp=18;setGM('f');build();
ok(HS.CM==='builtin-hospital'&&WW==PW&&WH==PH&&BG.width==WW&&HS.LT&&HS.LT.t=='cold','map 18 builds from hospital.json');
ok(MP[18].n=='Zombville General'&&MPD[18]&&MPI[18]&&MUN[18]===10&&HS.HO&&HS.HO.length>=50,'its name, picture, Abigail standing in as its boss, '+(HS.HO?HS.HO.length:0)+' rooms');
ok(HS.BNP&&HS.BNP.length==3,'three workbenches');
// ---------- the level below, in the game (world/lower-level.js) ----------
{const Lo=HS.LOW,R=LO.map(f=>[f.x,f.y,f.w,f.h]);ok(Lo&&Lo.R.length==LO.length&&Lo.s>.85&&Lo.s<.95,'the game keeps the level below: '+(Lo?Lo.R.length:0)+' boxes, drawn '+(Lo?Lo.s.toFixed(2):'?')+'× around the screen\\'s middle');
 ok(R.every(r=>WL.some(w=>w[0]==r[0]&&w[1]==r[1]&&w[2]==r[2]&&w[3]==r[3]&&w[4]==2))&&R.every(r=>NOGO.some(n=>n[0]==r[0]&&n[1]==r[1])),'nobody walks down there (bullets fly over it) and no boss lands there');
 const fs=Lo.F.map(f=>lowFacSt(f.st));ok(fs.includes('brick')&&fs.includes('glass')&&fs.includes('concrete')&&Lo.F.length>=40,'the building\\'s walls run down to it: '+Lo.F.length+' facades, brick, concrete and glass after the walls');
 ok(!HS.LT.L.some(q=>inLo(q.x,q.y))&&Lo.L.length>=6&&(HS.VH||[]).every(v=>!inLo(v.x+v.w/2,v.y+v.h/2)),'its lights are its own and nothing down there is a walk-behind picture');
 const S0=[];cam.x=2016-W/2;cam.y=1900-H/2;lowLights(S0);const q=S0.find(o=>Math.abs(o.r-Lo.L[0].r*Lo.s)<1e-6);ok(S0.length==Lo.L.length&&S0.every(o=>o.cr===Lo.R&&o.vis===0)&&q,'its lights move with it and light only the level below');
 const n0=LOG.length;let err='';try{lowDraw()}catch(e){err=e.message}ok(!err&&LOG.slice(n0).some(e=>e[0]=='drawImage'),'it draws '+err)}
const cell=(x,y)=>Math.floor(y/gs)*gw+Math.floor(x/gs);
{const F=new Int16Array(gw*gh);bfs(F,HS.px,HS.py);let pk=0,ex=[];for(let k=0;k<gw*gh;k++)if(!bl[k]&&F[k]<0){pk++;if(ex.length<4)ex.push([(k%gw)*gs,Math.floor(k/gw)*gs])}ok(!pk,'no pockets: every open spot can be reached ('+pk+' cells cannot '+JSON.stringify(ex)+')');
 const at=([x,y])=>!bl[cell(x,y)]&&F[cell(x,y)]>=0,SL=D.walls.filter(w=>w.s=='hidden');const hs=HS.HO.filter(h=>h.w<1200&&!SL.some(w=>w.x>=h.x&&w.y>=h.y&&w.x<h.x+h.w&&w.y<h.y+h.h));let hb=[];for(const h of hs){let any=0;for(let y=h.y+4;y<h.y+h.h&&!any;y+=8)for(let x=h.x+4;x<h.x+h.w&&!any;x+=8)if(at([x,y]))any=1;if(!any)hb.push(h.x+','+h.y)}ok(!hb.length,'every room can be walked into ('+hb.join(' ')+')');
 ok(D.spawns.every(p=>at([p.x,p.y])),'every spawn point is on open ground that leads in')}
// few dead ends (the owner asked): every room with its own light has two ways out or more (a way out: a gap at least 24 px along
// its edge you can walk straight through, 28 px each side); the one exception is the nook in front of the elevators, open to the lobby
{const free=(x,y)=>x>0&&y>0&&x<WW&&y<WH&&!bl[cell(x,y)],ways=(x0,y0,x1,y1)=>{let n=0;const side=(hz,c,a,b)=>{let r=null;const end=()=>{if(r&&r[1]-r[0]>=24)n++;r=null};for(let u=a+8;u<b-8;u+=8){let ok_=true;for(let d=-28;d<=28;d+=8)if(!(hz?free(u,c+d):free(c+d,u))){ok_=false;break}if(ok_){if(!r)r=[u,u];r[1]=u}else end()}end()};side(1,y0,x0,x1);side(1,y1,x0,x1);side(0,x0,y0,y1);side(0,x1,y0,y1);return n};
 const RL=D.areas.filter(a=>a.a=='roomlight'&&!inLo(a.x+a.w/2,a.y+a.h/2)),E=D.areas.find(a=>a.a=='elev'&&(a.o||{}).st=='esc'),c={x:E.x+E.w/2,y:E.y+E.h},bad=[];for(const a of RL){const x0=a.x-12,y0=a.y-12,x1=a.x+a.w+12,y1=a.y+a.h+12;if(c.x>x0&&c.x<x1&&c.y>y0-140&&c.y<y1)continue;const n=ways(x0,y0,x1,y1);if(n<2)bad.push(x0+','+y0+':'+n)}
 ok(RL.length>=28&&!bad.length,'few dead ends: every lit room ('+RL.length+') has two ways out or more ('+bad.join(' ')+')')}
// ---------- campaign: Abigail, then the escape ----------
const RNG=new Set([11,19]);
const play=(w0,w1,lim)=>{const R={spawned:0,reached:0,stuck:0,waves:0,err:'',sk:{}};try{for(let w=w0;w<=w1;w++){if((mode!='play'||!!BRK))nextWave();let t=0;const seen=new Map();
 while((mode=='play'&&!BRK)&&t<lim){for(const p of PL){p.mx=Math.max(p.mx,20);p.hp=p.mx}tick(1);t++;for(const z of zs){if(ZT[z.t].sv)continue;if(!seen.has(z)){seen.set(z,t);R.spawned++}
  const dz=Math.hypot(z.x-P.x,z.y-P.y);if(z.hp>0&&(dz<80||dz<400&&RNG.has(z.t))){R.reached++;hurt(z,z.hp+1,0,0)}else if(z.hp>0&&t-seen.get(z)>5000){R.stuck++;const k=z.t+'@'+Math.round(dz);R.sk[k]=(R.sk[k]||0)+1;hurt(z,z.hp+1,0,0)}}}
 if((mode=='play'&&!BRK)){toSp=0;for(let q=0;q<4000&&(mode=='play'&&!BRK);q++){for(const z of zs.slice())if(z.hp>0)hurt(z,z.hp+1,0,0);toSp=0;tick(1)}}R.waves++}}catch(e){R.err=e.stack||e.message}return R};
setGM('c');mapId=18;S.mp=18;sel=0;start();ok(mapId===18&&HS.CM==='builtin-hospital','a campaign run starts in Zombville General');
{const R=play(1,2,5000);ok(!R.err&&R.waves==2,'campaign waves 1–2 play '+R.err);ok(R.spawned>20&&R.stuck<=Math.max(2,R.spawned*.03),'zombies find the player through the halls ('+R.reached+' of '+R.spawned+'; '+R.stuck+' slow '+JSON.stringify(R.sk)+')')}
wave=19;zs=[];toSp=0;mode='shop';BRK=null;const un0=(A.un||[]).slice();
{if((mode!='play'||!!BRK))nextWave();let b=null;for(let i=0;i<600&&!b;i++){for(const p of PL){p.hp=p.mx}tick(1);b=zs.find(q=>ZT[q.t].sv)}ok(wave==20&&b&&b.ci==10,'wave 20: Abigail (standing in)');
 {const o=HS.CX.A.map(q=>q.o).find(o=>o&&o.a=='elev'&&(o.o||{}).st=='esc'),lt=[];arElevLts(o,lt);const solid=WL.filter(w=>w[5]=='elev').length;
  ok(o&&!ESC&&elOpenK(o)==0&&!elEsc(o)&&escElevCall(o)===false&&cmLtNow(lt[0],1,0)==0&&solid>=2,'wave 20, the boss still up: the escape elevator is shut, dark and solid')
  globalThis._EO=[o,lt[0]]}
 b.ph=2;b.iv=0;hurt(b,1e9,0,0);for(let i=0;i<Math.ceil(6.2/.016)&&!ESC;i++){for(const p of PL)p.hp=p.mx;tick(1)}
 ok(ESC&&ESC.ph=='go'&&mode=='play'&&!bBt(A,DIF(),18),'she gives up: the escape starts (the map isn\\'t won yet)');
 {const[o,l]=globalThis._EO;ok(elEsc(o)&&cmLtNow(l,1,0)==1,'once she gives up, its lights come on and its doors open')}
 ok(KN&&KN.sd&&SVL3.join(' ').includes('roof'),'standing in, she doesn\\'t ask to join: she sends the players to the roof');
 for(let i=0;i<80;i++){for(const p of PL)p.hp=p.mx;tick(1)}const e=ESC.el,G=elG(e);ok(ESC.k>=1&&!WL.some(w=>w[5]=='elev'&&w[0]>=e.x-1&&w[0]<e.x+e.w&&w[1]>=e.y-1&&w[1]<e.y+e.h),'the escape elevator\\'s doors open');
 const c=escCarC();P.x=c.x;P.y=c.y;let ph=[];for(let i=0;i<Math.ceil(5/.016)&&!ESC.rf;i++){for(const p of PL)p.hp=p.mx;tick(1);if(ph[ph.length-1]!=ESC.ph)ph.push(ESC.ph)}
 ok(ph.join(',')=='go,in,ride,arrive'||ph.join(',')=='in,ride,arrive','in the car: the close-up, the doors shut, the ride up ('+ph.join(',')+')');ok(ESC.rf&&HS.CM=='builtin-hospital-roof'&&WW==2048&&HS.LT&&HS.LT.t=='night'&&escInCar(P),'the roof is built in its place, at night, the player in the car');
 for(let i=0;i<Math.ceil(3.4/.016);i++){for(const p of PL)p.hp=p.mx;tick(1)}ok(ESC.ph=='run'&&!ESC.fz&&ESC.z==1&&ESC.h,'the doors open, the camera pulls back: run for the helicopter');
 const z0=zs.length;let climbed=0,shot=0,over=0,max=0;for(let i=0;i<Math.ceil(8/.016);i++){for(const p of PL){p.hp=p.mx;p.inv=1}tick(1);climbed=Math.max(climbed,zs.filter(z=>z.ri>0&&z.clb).length);for(const z of zs)if(!z.clb&&z.hp>0&&!z._ov){z._ov=1;over++}max=Math.max(max,zs.filter(z=>z.hp>0).length);if(ESC.tr.length)shot++}
 ok(climbed>0&&over>=8&&max>=6,'a rush of zombies climbs over the parapet ('+over+' over, '+max+' at once)');ok(shot>0,'the door gunner fires');
 const h=ESC.h,dx=0,dy=-60,ca=Math.cos(h.a),sa=Math.sin(h.a);P.x=h.x+dx*ca-dy*sa;P.y=h.y+dx*sa+dy*ca;ok(escAtDoor(P),'the door: off the helicopter\\'s side');
 for(let i=0;i<Math.ceil(1/.016)&&ESC.ph!='lift';i++){for(const p of PL){p.hp=p.mx;p.x=h.x+dx*ca-dy*sa;p.y=h.y+dx*sa+dy*ca}tick(1)}ok(ESC.ph=='lift','in the door: it lifts off');
 for(let i=0;i<Math.ceil(6/.016)&&mode=='play';i++)tick(1);ok(mode=='over'&&CWIN&&CWIN.esc&&bBt(A,DIF(),18),'it flies off: the map is won');
 ok(JSON.stringify(A.un)==JSON.stringify(un0),'a stand-in boss recruits no one');ok(/GOT OUT OF ZOMBVILLE/.test(cwH()),'the end screen: you got out of Zombville')}
// ---------- dying on the roof starts the run for the helicopter again ----------
setGM('c');mapId=18;S.mp=18;start();wave=20;zs=[];toSp=0;KN={ci:10,x:P.x,y:P.y,t:6,fl:1,done:1};escStart();{const c=escCarC();P.x=c.x;P.y=c.y;for(let i=0;i<Math.ceil(9/.016)&&!(ESC.ph=='run');i++){for(const p of PL)p.hp=p.mx;tick(1)}
 const L0=LIVES;P.hp=0;P.inv=0;over();ok(mode=='lifeo','killed on the roof: you were eaten');lifeCont();ok(mode=='play'&&ESC&&ESC.ph=='run'&&ESC.rf&&LIVES==L0-1&&HS.CM=='builtin-hospital-roof'&&Math.hypot(P.x-escCarC().x,P.y-escCarC().y)<160,'continue: back at the roof elevator, a life gone, the boss not again')}
// ---------- free play, the Workshop, the pieces ----------
setGM('f');mapId=18;S.mp=18;start();{const R=play(1,1,4000);ok(!R.err&&wave>=1&&!ESC,'a Free Play run plays (no escape there) '+R.err)}
{const h=wsBuiltins();ok(h.includes('wsBuiltin(18,1)')&&h.includes('Zombville General'),'the Workshop lists Zombville General under Built-in maps')}
{const NK=['infodesk','admdesk','wseat','wseat2','lounge','hctab','planterb','dirboard','hkiosk','wetsign','fext','aed','sanit','htrash','dplate','qsign','ortable','orlight','anesth','mayo','backtab','scrubsink','stershelf','pbed','obtable','recl','nstation','hvent','vitals','linen','mri','ctscan','xbox','labbench','labfrz','fumehood','rxcounter','mdrawers','autopsy','servline','cbar','drinkst','trayrack','giftshelf','balloons','cardrack','ahu','exfan','rpipes','mast','windsock','rsign'];
 const ND=['pills','gauze','xfilm','syringe','ivbag','clipb','wetfloor','biohaz'];ok(NK.every(k=>OB[k]&&EDPN[k])&&EDCAT.some(c=>c[0]=='hosp')&&EDCAT.some(c=>c[0]=='roof')&&ND.every(k=>CMDI[k])&&['hfount','elev','rdeck','hpad','skyl','below'].every(k=>CMAI[k])&&CMFXI.alarm&&CMFXI.hanglight&&CMFXI.ftube&&CMFXI.softlight&&CMFXI.sparks&&CMWI.hwall&&CMWI.winbroke&&CMWI.parapet,'the new pieces are all in the editor (new groups: Hospital, Rooftop)');
 const g=document.createElement('canvas').getContext('2d');let err='';for(const k of NK)try{for(const v of[0,.3,.55,.8,.95])OB[k].f(g,100,100,v,'#2f6fd0','A|B|C')}catch(e){err+=k+': '+e.message+' '}
 try{for(const k of['hfount','elev','rdeck','hpad','skyl','below']){const T=CMAI[k],o={a:k,x:0,y:0,w:300,h:240,o:Object.assign({},T.def&&T.def.o||{}),c:T.def&&T.def.c,c2:T.def&&T.def.c2};T.f(g,o);if(T.anim)T.anim(o,1.3);const L=[];if(T.lts)T.lts(o,L);const out=[];if(T.coll)T.coll(o,out)}
  for(const st of['shut','pried','open','esc'])for(const d of['s','n','e','w']){const o={a:'elev',x:0,y:0,w:96,h:112,o:{d,st}};CMAI.elev.f(g,o);CMAI.elev.anim(o,1)}
  for(const k of ND)for(const v of[.1,.6])CMDI[k].f(g,v,pcK('#e8a040'),'');CMFXI.alarm.anim({x:10,y:10},1);CMFXI.hanglight.top({x:10,y:10},1.2);for(const s of['hwall','winbroke','parapet']){CMWI[s].f(g,0,0,100,12,'#5aa0c8');CMWI[s].f(g,0,0,12,100)}}catch(e){err+='kit: '+e.stack}ok(!err,'every piece draws '+err)}
console.log('TOTAL fails '+fails+' of '+n);
}
`;
const AF=Object.getPrototypeOf(async function(){}).constructor;
new AF('docL','ivs',code+test)(docL,ivs).catch(e=>{console.log('FAIL crashed: '+(e&&e.stack||e));console.log('TOTAL fails 1');process.exitCode=1});
