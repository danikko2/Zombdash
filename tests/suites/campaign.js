const fs=require('fs');const html=fs.readFileSync(process.argv[2],'utf8');
const code=html.slice(html.lastIndexOf('<script>')+8,html.lastIndexOf('</script>'));
global.ImageData=class{constructor(d,w,h){this.data=d}};
const ctx=new Proxy({},{get:(t,k)=>k=='getImageData'?(x,y,w,h)=>({data:new Uint8ClampedArray(w*h*4).fill(120)}):k=='measureText'?()=>({width:30}):()=>{},set:()=>true});
const mkEl=()=>({style:{setProperty(){}},dataset:{},innerHTML:'',className:'',getContext:()=>ctx,addEventListener(){},remove(){},width:0,height:0});
const els={};const docL={};global.document={hidden:false,getElementById:id=>els[id]||(els[id]=mkEl()),createElement:()=>mkEl(),addEventListener(e,f){(docL[e]=docL[e]||[]).push(f)}};
global.innerWidth=+process.argv[3]||390;global.innerHeight=+process.argv[4]||800;global.addEventListener=()=>{};global.localStorage={};global.requestAnimationFrame=()=>{};
global.Image=class{constructor(){this.complete=true;this.naturalWidth=1}addEventListener(){}};global.NOW_=0;global.performance={now:()=>global.NOW_};
// mock web audio
global.started=0;let nodes=0,errs=[];const P_=()=>({value:0,setValueAtTime(v,t){if(!isFinite(v)||!isFinite(t))errs.push('nonfinite set '+v+' '+t)},linearRampToValueAtTime(v,t){if(!isFinite(v)||!isFinite(t))errs.push('nf lin')},exponentialRampToValueAtTime(v,t){if(!(v>0)||!isFinite(t))errs.push('bad exp '+v)},setTargetAtTime(){}});
const node=()=>{nodes++;return{connect(){},disconnect(){},start(){global.started++},stop(){},frequency:P_(),gain:P_(),detune:P_(),Q:P_(),pan:P_(),threshold:P_(),ratio:P_(),type:'',setPeriodicWave(){},buffer:null,loop:false}};
global.AT_=0;global.AudioContext=class{constructor(){this.state='running';this.sampleRate=8000;this.destination={}}get currentTime(){return global.AT_}createGain(){return node()}createOscillator(){return node()}createBiquadFilter(){return node()}createBufferSource(){return node()}createStereoPanner(){return node()}createDynamicsCompressor(){return node()}createPeriodicWave(){return{}}createBuffer(c,n){return{getChannelData:()=>new Float32Array(n)}}resume(){}};
const ivs=[];global.setInterval=(f)=>{ivs.push(f)};global.TQ=[];global.setTimeout=(f,ms)=>{TQ.push([global.AT_+ms/1000,f])};
const out=code+`;
LOG('start body');S.tut=1;docL.pointerdown[0]();endIntro();LOG('intro done');
const tick=(n)=>{for(let i=0;i<n;i++){AT_+=.016;NOW_+=16;for(const f of ivs)f();for(let q=TQ.length-1;q>=0;q--)if(TQ[q][0]<=AT_){const g=TQ[q][1];TQ.splice(q,1);g()}loop(NOW_)}};
const ok=(c,m)=>{LOG((c?'PASS ':'FAIL ')+m);if(!c)errs.push(m)};
S.ac.name='T';S.ac.un=[0];const A=S.ac;delete A.cp;
ok(cpOf(A)==0&&mapOK(0)&&!mapOK(3)&&!mapOK(1),'fresh account: only Suburb open');
menu();ok(ui.innerHTML.includes('modes()'),'PLAY opens mode select');modes();ok(ui.innerHTML.includes('CAMPAIGN')&&ui.innerHTML.includes('FREE PLAY'),'mode screen');
setGM('c');mapId=campFront();play();ok(UIS=='cmap'&&ui.innerHTML.includes('Suburb')&&ui.innerHTML.includes('Bill')&&ui.innerHTML.includes('HOMETOWN'),'campaign map: Hometown section, Suburb, boss Bill');ok(ORD()[1]==3&&!mapOK(3),'next in campaign order is School (locked)');mapId=3;mapGo();ok(UIS!='surv','locked map cannot be confirmed');
setGM('f');mapId=4;play();ok(mapId==0,'free play falls back to an unlocked map');
// campaign run to wave 20
setGM('c');mapId=0;sel=0;start();ok(wave==1,'campaign always starts at wave 1');P.mx=P.hp=999;wave=19;zs=[];toSp=0;nextWave();
const z=zs.find(q=>ZT[q.t].sv);ok(z&&z.ci==2&&toSp==0&&zs.length==1,'wave 20: only Bill, no zombies');ok(SVB==1,'final wave banner');
// each survivor boss: abilities + defeat flow
const seen={};const order=CORD.slice();
for(const m of order){const ci=MUN[m];A.cp=CORD.length;setGM('c');mapId=m;sel=0;start();P.mx=10;P.hp=1e6;P.inv=0;wave=19;zs=[];toSp=0;ep=[];nextWave();const b=zs.find(q=>ZT[q.t].sv);if(!b){ok(0,'no boss on '+MP[m].n);continue}
 let F={dash:0,bub:0,blk:0,arm:0,jump:0,slam:0,sword:0,fly:0,ship:b.ph==1&&ci==6,horse:b.ph==1&&ci==8,shots:0,hitP:0};const hp0=P.hp;
 for(let f=0;f<1500;f++){P.hp=Math.max(P.hp,1e5);P.x+=Math.sin(f/40)*1.2;if(b.ds>0)F.dash=1;if(b.bb>0){F.bub=1;const h=b.hp;hurt(b,5,0,0);if(b.hp==h)F.blk=1}if(b.ps==2)F.arm=1;if(b.jp)F.jump=1;if(b.cs==2)F.sword=1;if(b.fl)F.fly=1;if(RKS.length)F.rock=1;if(b.sh>0){F.sh=1;const h=b.hp;hurt(b,5,-Math.cos(b.fa)*10,-Math.sin(b.fa)*10);if(b.hp==h)F.shb=1;const h2=b.hp;hurt(b,1,Math.cos(b.fa)*10,Math.sin(b.fa)*10);if(b.hp<h2)F.back=1}if(b.vt)F.vault=1;if(ci==10){const C=zs.filter(q=>q.cl&&q.hp>0);F.clones=Math.max(F.clones||0,C.length);if(C.length&&!F.pop){const c=C[0];hurt(c,1,1,0);if(c.hp<=0)F.pop=1}if(C.length&&!F.real){const h=b.hp;hurt(b,1,1,0);if(b.hp<h)F.real=1}}if(ci==11){if(GHH.length)F.hands=1;if(zs.some(q=>ZT[q.t].gh))F.ghost=1;if(P.root>0)F.root=1;if(b.ph==1)F.horse=1}if(ci==13){if(ICB.length)F.lob=1;if(b.sp>60)F.drive=1;if(ICB.length>5)F.storm=1}if(ci==14){if(b.wb&&b.wb.ph)F.spray=1;if(HS.BW&&HS.BW.length)F.win=1;if(b.sp>60)F.drive=1}if(ci==15){if(GCI.length)F.stock=1;if(GCC.length)F.carts=1;if(f==700){P.x=1000;P.y=1640}}if(ci==16){if(b.sp>60)F.drive=1;if(b.pb>0)F.burst=1}if(ci==12||ci==14){if(b.rm>0)F.ram=1;if(GRN.length)F.gren=1;const H=ci==14?HS.HO.find(h=>h.ty=='diner'):HS.HO&&HS.HO[0];if(H&&f>900&&f<1300){P.x=H.x+H.w*.35;P.y=H.y+H.h*.5}if(f==1300){P.x=HS.px;P.y=HS.py}}F.shots=Math.max(F.shots,ep.filter(p=>p.k==5).length);tick(1);if(!zs.includes(b))break}
 F.hitP=hp0>P.hp||P.hp<1e6;
 const ph1=b.ph;if(b.ph==1){hurt(b,b.hp+1,0,0);ok(b.ph==2&&b.hp>0&&zs.includes(b),CH[ci].n+': first health bar gone -> phase 2 ('+b.bn+')');if(ci==14){P.x=b.x+150;P.y=b.y;for(let f=0;f<700;f++){P.hp=Math.max(P.hp,1e5);tick(1);if(b.sw||b.cw>0||b.ch>0)F.axe=1}ok(F.axe&&HS.tkp,'Chief Mac swings the axe, engine left parked')}}
 b.iv=0;b.bb=0;const k0=kills;hurt(b,b.hp+1,0,0);tick(2);
 ok(KN&&KN.ci==ci&&!zs.includes(b),CH[ci].n+' kneels instead of popping');ok(A.un.includes(ci),CH[ci].n+' unlocked');
 const ab={2:F.dash,3:F.bub&&F.blk,1:F.arm,5:F.jump,4:F.sword,6:F.ship,7:F.fly||F.rock,8:F.horse,9:F.sh&&F.shb&&F.back&&F.vault,10:F.clones>=9&&F.pop&&F.real,11:F.horse&&F.hands&&F.ghost,12:F.ram&&F.gren,13:F.lob&&F.drive&&F.storm,14:F.spray&&F.win&&F.drive,15:F.dash&&F.stock&&F.carts,16:F.drive&&F.burst}[ci];ok(ab,CH[ci].n+' special ability used '+JSON.stringify(F));ok(F.shots>0||F.rock||F.lob||F.spray,CH[ci].n+' shoots ('+F.shots+' bullets in the air at peak)');
 tick(Math.ceil(5.7/.016));ok(mode=='over'&&ui.innerHTML.includes('COMPLETE')&&ui.innerHTML.includes('joined your survivors'),CH[ci].n+' -> map complete screen');
 const nx=CORD[CORD.indexOf(m)+1];ok(nx==null?ui.innerHTML.includes('CAMPAIGN MAP</button>'):ui.innerHTML.includes('NEXT: '+MP[nx].n.toUpperCase()),'next button '+(nx==null?'back to campaign':MP[nx].n))}
// progress chain from scratch
A.un=[0];A.cp=0;delete A.bm;setGM('c');mapId=0;sel=0;start();P.mx=P.hp=999;wave=19;zs=[];toSp=0;nextWave();{const b=zs[0];b.ph=2;hurt(b,1e9,0,0)}ok(A.cp==1&&mapOK(3)&&mapOK(1)&&!mapOK(8)&&A.un.includes(2),'beating Bill opens the rest of Hometown (School + Warehouse), not Wrong Turn; Bill joins');
setGM('f');ok(mapOK(3)&&mapOK(1)&&!mapOK(8),'free play follows campaign unlocks');
// replay earlier map does not regress
A.cp=4;mapId=0;setGM('c');start();wave=19;zs=[];toSp=0;nextWave();zs[0].ph=2;hurt(zs[0],1e9,0,0);ok(A.cp==4,'replaying an old map keeps progress');
// free play wave 20 is normal
setGM('f');A.cp=8;mapId=0;start();wave=19;zs=[];toSp=0;nextWave();ok(!zs.some(q=>ZT[q.t].sv)&&(toSp>0||bossQ>=0),'free play wave 20 is a normal boss wave');
// split screen campaign
const B={name:'B',xp:0,lv:1,sp:0,sk:{},pts:0,un:[0],cp:0};S.prof=[B];A.cp=0;A.un=[0];setGM('c');LBY={s:[{inp:'km',ac:A,ci:0,v:0,rdy:1},{inp:0,ac:B,ci:0,v:1,rdy:1}]};mapId=0;startMP();ok(MPn==2&&wave==1,'split screen campaign starts');wave=19;zs=[];toSp=0;for(const p of PL){p.mx=p.hp=999}nextWave();const mbs=zs.find(q=>ZT[q.t].sv);ok(mbs&&mbs.ci==2,'split screen boss Bill');mbs.ph=2;hurt(mbs,1e9,0,0);ok(A.un.includes(2)&&B.un.includes(2)&&A.cp==1&&B.cp==1,'both profiles unlock Bill + School');tick(Math.ceil(5.7/.016));ok(mode=='over'&&ui.innerHTML.includes('NEXT: SCHOOL'),'split screen map complete screen');MPn=0;
lobby();rL();ok(ui.innerHTML.includes('lbMode'),'lobby has mode toggle');lbMode('f');ok(GMD=='f','lobby switch to free play');lbMap(1);ok(mapOK(mapId,lobAcs()),'lobby skips locked maps: '+MP[mapId].n);
// test mode extras
S.prof=[];A.cp=0;options(0);document.getElementById('dvc').value='2059';devTry();for(const k of['unl','sp','money','wave'])dtSet(k,1);ok(cpOf(A)==CORD.length,'test code opens every map');for(let i=0;i<60;i++)stepW(1);ok(S.sw>S.best&&S.sw>=40,'test mode start wave beyond best: '+S.sw);
setGM('f');mapId=6;sel=0;start();ok(P.cash>=999999,'unlimited money at start');buy(7);ok(P.own.includes(7)&&P.cash>=999999,'still unlimited after buying a Laser');
S.sw=20;setGM('c');mapId=6;start();ok(mode=='shop'&&wave==19,'campaign test start at wave 20 (shop first)');nextWave();ok(zs.some(q=>ZT[q.t].sv&&q.ci==6),'Steve fight right away');
devOff();ok(cpOf(A)==1||A.cp!=8,'turning test mode off restores campaign progress (cp '+A.cp+')');
// codes keep campaign progress
A.cp=5;const c=enc(A),D2=dec(c);ok(D2&&D2.cp==5,'account code keeps campaign progress');
console.log('TOTAL errors',errs.length,errs.slice(0,8));
`;
globalThis.LOG=m=>require("fs").writeSync(2,m+"\n");new Function("docL","ivs","errs","started_",out)(docL,ivs,errs);
