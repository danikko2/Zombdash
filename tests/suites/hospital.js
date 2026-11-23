// Zombville General (map 18), Zombville's finale, at the owner's request: a big hospital, inside only, halls about twice real
// width; the lobby in the middle (a fountain, seating, the information desk, admissions), surgery in one wing, patient care in the
// other; the ER and ambulance bay, the cafeteria and gift shop, radiology, the lab, the pharmacy, the morgue and the chapel; backup
// power (broken, hanging, flickering lights; red fire-alarm light); locked until the rest of Zombville is beaten; Abigail standing in
// as the wave-20 boss; then the escape: the elevator to the roof at night, the helicopter, the door gunner, zombies over the parapet.
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
const PW=4096,PH=3328;
// ---------- the map files load ----------
const D=(()=>{const r=cmRead(JSON.stringify(BIMF[18]));ok(r.doc&&!r.errors.length&&!r.warnings.length,'hospital.json loads with no errors or warnings '+(r.errors||[]).concat(r.warnings||[]).slice(0,3).join('; '));return r.doc})();
const DR=(()=>{const r=cmRead(JSON.stringify(BIMX[18]));ok(r.doc&&!r.errors.length,'the roof (hospital-roof.json) loads '+(r.errors||[]).join('; '));return r.doc})();
{const L=cmLint(D).filter(p=>p.lv=='err'||p.lv=='warn');ok(!L.length,'nothing in the Problems list '+L.map(p=>p.m).slice(0,2).join('; '));
 ok(D.w==128&&D.h==104&&D.id=='builtin-hospital'&&D.name=='Zombville General','128×104 tiles (4096×3328 px): as wide as a map can be');
 ok(D.obj.filter(o=>!o.dc&&!o.fx&&!o.veh&&!o.f).every(o=>cmOB(o.k)),'every prop is a real kit prop');ok(!cmDoorBlocks(D).length,'no prop stands in a doorway');
 const out=D.walls.filter(w=>w.s=='hidden'),ins=D.areas.filter(a=>a.a=='floor');ok(out.length>=8&&ins.length>=40&&D.lt.t=='cold','inside only: floors everywhere, the strip outside closed off but for the ways in')}
const K=k=>D.obj.filter(o=>o.k==k),FX=k=>D.obj.filter(o=>o.fx==k),DC=k=>D.obj.filter(o=>o.dc==k),AR=k=>D.areas.filter(a=>a.a==k),PA=k=>D.paths.filter(p=>p.p==k),WS=s=>D.walls.filter(w=>w.s==s);
const HS_=t=>K('hsign').some(o=>o.tx==t);
// ---------- the asks ----------
{const halls=D.areas.filter(a=>a.a=='floor'&&(a.w>=3000&&a.h==256||a.h>=2600&&a.w==256));ok(halls.length==4,'four main halls 256 px wide (twice a real hall and a little more, at the owner\\'s word)');
 const ring=D.areas.filter(a=>a.a=='floor'&&(a.w>=3900&&a.h==224&&(a.y==64||a.y==3040)||a.h>=2700&&a.w==224&&(a.x==64||a.x==3808)));ok(ring.length==4,'a hallway all the way round the building (224 px)');
 const gap=(w,x,y)=>D.walls.some(q=>q.s=='door'&&Math.abs(q.x+q.w/2-x)<20&&Math.abs(q.y+q.h/2-y)<20);ok([[1376,288],[2720,288],[1376,3040],[2720,3040],[288,1248],[288,2208],[3808,1248],[3808,2208]].every(([x,y])=>gap(0,x,y)),'every main hall runs into the ring at both ends: no dead ends');
 const F=AR('hfount')[0];ok(F&&F.w>=380&&F.o.on==1&&F.x+F.w/2==2048,'the lobby in the middle: a big running fountain');
 ok(K('infodesk').length==1&&K('admdesk').some(o=>o.tx=='ADMISSIONS')&&K('wseat').length>=6&&K('lounge').length>=6&&K('planterb').length>=4,'its information (greeting) desk, the admissions desk, waiting seats, lounge chairs, planters');
 ok(K('ortable').length==4&&K('orlight').length>=4&&K('anesth').length==4&&K('scrubsink').length==2&&HS_('SURGERY'),'the surgery center (west wing): four operating rooms, scrub sinks, pre-op and recovery');
 ok(K('pbed').length>=14&&K('nstation').length>=4&&HS_('PATIENT CARE')&&D.obj.filter(o=>o.k=='dplate'&&/^ICU/.test(o.tx)).length==6,'patient care (east wing): the ICU, patient rooms, nurse stations');
 ok(K('mri').length==1&&K('ctscan').length==1&&K('labbench').length==2&&K('rxcounter').length==1,'radiology (MRI, CT, X-ray), the lab, the pharmacy');
 ok(K('servline').length==1&&K('ctable').length>=9&&K('giftshelf').length==2&&K('balloons').length==2,'the cafeteria and the gift shop');
 ok(K('mdrawers').length==2&&K('autopsy').length==2&&K('pew').length>=4&&K('altar').length==1,'the morgue and the chapel');
 ok(V_('amb')>=2&&WS('rollup').length>=4&&HS_('EMERGENCY'),'the ER and the ambulance bay');
 ok(FX('alarm').length>=12&&FX('hanglight').length>=6&&FX('sparks').length>=5&&FX('softlight').length>=30&&FX('softlight').some(o=>(o.o||{}).k=='flk'),'backup power: halls lit in stretches, some flickering, dark where the lights broke, lights hanging by their wires, sparks; fire alarms pulsing red');
 ok(DC('wetfloor').length>=15&&FX('light').filter(o=>/^#ff/.test(o.c||'')).length>=12&&D.lt.t=='cold'&&cmLtP('cold').mul=='#0e1a38','the look asked for after the reference pictures: a cold dark, red emergency light where the halls meet the ring, wet floors');
 {const hid=D.walls.filter(w=>w.s=='hidden'&&w.x>64&&w.y>64&&w.x<4000&&w.y<3260),bio=DC('biohaz'),tape=PA('tape');ok(hid.length>=8&&bio.length>=16&&tape.length>=16,'many small rooms sealed off: no way in, the biohazard mark, the door taped over ('+hid.length+' sealed)')}
 ok(AR('elev').length==4&&AR('elev').filter(a=>a.o.st=='esc').length==1,'four elevators, one of them the way to the roof');
 ok(D.spawns.length>=12&&WS('winbroke').length>=3,'zombies come down the stairs, in through the doors and the broken-out windows')}
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
ok(MP[18].n=='Zombville General'&&MPD[18]&&MPI[18]&&MUN[18]===10&&HS.HO&&HS.HO.length>=40,'its name, picture, Abigail standing in as its boss, '+(HS.HO?HS.HO.length:0)+' rooms');
ok(HS.BNP&&HS.BNP.length==3,'three workbenches');
const cell=(x,y)=>Math.floor(y/gs)*gw+Math.floor(x/gs);
{const F=new Int16Array(gw*gh);bfs(F,HS.px,HS.py);let pk=0,ex=[];for(let k=0;k<gw*gh;k++)if(!bl[k]&&F[k]<0){pk++;if(ex.length<4)ex.push([(k%gw)*gs,Math.floor(k/gw)*gs])}ok(!pk,'no pockets: every open spot can be reached ('+pk+' cells cannot '+JSON.stringify(ex)+')');
 const at=([x,y])=>!bl[cell(x,y)]&&F[cell(x,y)]>=0,SL=D.walls.filter(w=>w.s=='hidden'&&w.x>64&&w.y>64&&w.x<4000&&w.y<3260);const hs=HS.HO.filter(h=>h.w<1200&&!SL.some(w=>w.x>=h.x&&w.y>=h.y&&w.x<h.x+h.w&&w.y<h.y+h.h));let hb=[];for(const h of hs){let any=0;for(let y=h.y+4;y<h.y+h.h&&!any;y+=8)for(let x=h.x+4;x<h.x+h.w&&!any;x+=8)if(at([x,y]))any=1;if(!any)hb.push(h.x+','+h.y)}ok(!hb.length,'every room can be walked into ('+hb.join(' ')+')');
 ok(D.spawns.every(p=>at([p.x,p.y])),'every spawn point is on open ground that leads in')}
// few dead ends (the owner asked): every room with its own light has two ways out or more (a way out: a gap at least 24 px along
// its edge you can walk straight through, 28 px each side); the one exception is the nook in front of the elevators, open to the lobby
{const free=(x,y)=>x>0&&y>0&&x<WW&&y<WH&&!bl[cell(x,y)],ways=(x0,y0,x1,y1)=>{let n=0;const side=(hz,c,a,b)=>{let r=null;const end=()=>{if(r&&r[1]-r[0]>=24)n++;r=null};for(let u=a+8;u<b-8;u+=8){let ok_=true;for(let d=-28;d<=28;d+=8)if(!(hz?free(u,c+d):free(c+d,u))){ok_=false;break}if(ok_){if(!r)r=[u,u];r[1]=u}else end()}end()};side(1,y0,x0,x1);side(1,y1,x0,x1);side(0,x0,y0,y1);side(0,x1,y0,y1);return n};
 const RL=D.areas.filter(a=>a.a=='roomlight'),E=D.areas.find(a=>a.a=='elev'&&(a.o||{}).st=='esc'),c={x:E.x+E.w/2,y:E.y+E.h},bad=[];for(const a of RL){const x0=a.x-12,y0=a.y-12,x1=a.x+a.w+12,y1=a.y+a.h+12;if(c.x>x0&&c.x<x1&&c.y>y0-140&&c.y<y1)continue;const n=ways(x0,y0,x1,y1);if(n<2)bad.push(x0+','+y0+':'+n)}
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
