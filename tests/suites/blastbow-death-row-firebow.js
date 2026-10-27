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
// Blastbow, Death Row and Firebow: tables, sprites, store, sticky blinking bolts and their blast, chain lightning,
// burning zombies, kill credit (split screen too), GAME BALANCE rows, and that older saves, codes and checkpoints keep working
const out=code+`;S.ac.cp=8;S.tut=1;S.ac.name='Tester';docL.pointerdown[0]();endIntro();
{// (a block, so test names never clash with the game's globals)
const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+m);if(!c)errs.push(m)};
const tick=(n)=>{for(let i=0;i<n;i++){AT_+=.016;NOW_+=16;for(const f of ivs)f();for(let q=TQ.length-1;q>=0;q--)if(TQ[q][0]<=AT_){const g=TQ[q][1];TQ.splice(q,1);g()}loop(NOW_)}};
const secs=s=>tick(Math.round(s/.016));
const ix=n=>WP.findIndex(w=>w.n==n),XB=ix('Crossbow'),BB=ix('Blastbow'),DW=ix('Death Row'),FB=ix('Firebow');
const near=(a,b,e)=>Math.abs(a-b)<(e||1e-6);
// ---------- tables ----------
ok(BB==13&&DW==14&&FB==15&&WP.length>=16,'Blastbow, Death Row and Firebow are guns 14, 15 and 16 (the older guns keep their numbers)');
ok(WP[BB].cost==1800&&WP[DW].cost==2500&&WP[FB].cost==850,'prices: Blastbow $1800, Death Row $2500, Firebow $850');
ok(AMT[BB]=='ar'&&AMT[FB]=='ar'&&AMT[DW]=='rk','the Blastbow and the Firebow shoot arrows, Death Row uses rockets');
ok(MAG[DW]==1&&RLT[DW]==2.5&&WP[DW].d==10&&WP[DW].dx==3&&WP[DW].zn==15,'Death Row: one shot a magazine, 2.5 s reload, 10-13 damage, up to 15 zombies');
ok(WP[FB].d>WP[XB].d&&WP[FB].bt>0&&WP[FB].bd>0,'the Firebow hits a little harder than the Crossbow ('+WP[FB].d+' vs '+WP[XB].d+') and sets zombies on fire');
ok(WP[BB].bx>=25&&WP[BB].bs>0&&WP[BB].br>0&&WP[BB].bf>0,'the Blastbow blows up: '+WP[BB].bx+' to the zombie it sticks in, '+WP[BB].bs+' around within '+WP[BB].br);
ok([RLS,RLT,MAG,AMT,MZ,FS,FSN].every(a=>a.length==WP.length),'every per-gun table has an entry for every gun');
ok(FSN.every(n=>typeof SF[n]=='function')&&RLS.every(n=>typeof SF[n]=='function')&&['bbeep','bbstick','bbpop','fbignite'].every(n=>typeof SF[n]=='function'),'fire, reload, beep, blast and fire sounds exist');
ok(MAG.slice(0,13).join()=='18,45,6,30,1,8,30,40,100,8,120,10,3'&&WP[XB].d==4&&WP[XB].cost==500&&WP[12].cost==2000&&AMI.ar.max==500&&AMI.rk.max==36,'older guns and ammo keep their values');
// ---------- sprites ----------
ok(Object.keys(PS).every(k=>PS[k].gun.length==WP.length&&PS[k].gun.slice(13).every(f=>f[2]==80&&f[3]==32&&f[4]==6&&f[5]==14&&f[1]>=1698)),'every survivor holds the three new guns (80x32 frames below the old sheet)');
ok(JSON.stringify(PS[0].gun[0])=='[490,0,80,32,6,14]'&&JSON.stringify(PS[0].gun[11])=='[0,1599,80,32,6,14]'&&JSON.stringify(PS[16].gun[12])=='[729,1665,80,32,6,14]','older gun frames did not move');
ok(ZS.bbolt&&ZS.bbolt.fly.length==1&&ZS.fbolt&&ZS.fbolt.fly.length==2&&ZS.bbolt.fly[0][0]>=487&&JSON.stringify(ZS.bolt.fly[0])=='[456,1641,30,10]'&&JSON.stringify(ZS.chicken.fly[0])=='[0,1641,56,48]','blast bolt and burning bolt frames added next to the old ones');
// ---------- store ----------
setGM('f');mapId=0;sel=0;S.dlf=1;start();P.mx=P.hp=999;P.cash=100000;shop();
ok(/data-gun=13[^>]*><\\/canvas>Blastbow<small>\\$1800</.test(ui.innerHTML)&&/data-gun=14[^>]*><\\/canvas>Death Row<small>\\$2500</.test(ui.innerHTML)&&/data-gun=15[^>]*><\\/canvas>Firebow<small>\\$850</.test(ui.innerHTML),'the store sells all three, each with its picture');
P.am.ar=0;P.am.rk=0;let c0=P.cash;buy(BB);ok(P.own.includes(BB)&&c0-P.cash==1800&&P.mg[BB]==6&&P.am.ar==12,'Blastbow: $1800, 6 bolts loaded + 12 arrows');
c0=P.cash;buy(DW);ok(c0-P.cash==2500&&P.mg[DW]==1&&P.am.rk==2,'Death Row: $2500, 1 shot loaded + 2 rockets');
c0=P.cash;buy(FB);ok(c0-P.cash==850&&P.mg[FB]==10&&P.am.ar==32,'Firebow: $850, 10 bolts loaded + 20 arrows');
ok(ui.innerHTML.includes('6 / 32')&&ui.innerHTML.includes('1 / 2')&&ui.innerHTML.includes('10 / 32'),'the inventory shows their ammo');
// ---------- an open spot to test in ----------
nextWave();toSp=0;P.mx=P.hp=999;P.inv=1e9;
let best=null;for(let y=200;y<WH-200;y+=20)for(let x=300;x<WW-300;x+=20){if(WL.some(w=>w[4]!=2&&w[0]<x+320&&w[0]+w[2]>x-260&&w[1]<y+160&&w[1]+w[3]>y-160))continue;const d=Math.hypot(x-HS.px,y-HS.py);if(!best||d<best.d)best={x,y,d}}
ok(best,'found an open spot');const home=()=>{P.x=best.x;P.y=best.y;P.a=0;P.dd=0;P.eat=null};home();
let KP;const keep=()=>{KP=mk(0,P.x>WW/2?30:WW-30,P.y>WH/2?30:WH-30);KP.hp=1e9;KP.spm=1e-6;return KP};keep();
const clr=()=>{zs=[KP];bs=[];DR=[];ckClear();for(const p of PL)p.dd=0};
const fireOn=()=>{inp=()=>({mx:0,my:0,fire:true})},fireOff=()=>{inp=()=>({mx:0,my:0,fire:false})};
const arm=g=>{home();P.cur=g;P.rl=0;P.cds[g]=0;P.mg[g]=MAG[g];return muzzle()};
const at=(t,x,y,hp)=>{const z=mk(t,x,y);z.hp=z.m0=z.mh=hp;z.fz=1e9;zs.push(z);return z};
const shoot=()=>{fireOn();tick(1);fireOff()};
const sfx0=sfx;let beeps=[];sfx=function(n){if(n=='bbeep')beeps.push(BBC[0]?BBC[0].t:-1);return sfx0.apply(null,arguments)};
// ---------- Blastbow ----------
clr();let m=arm(BB);const T1=at(0,m.x+120,m.y,1000),N1=at(0,m.x+150,m.y-10,1000),N2=at(0,m.x+120,m.y+55,1000),F1=at(0,m.x+330,m.y,1000);beeps=[];
shoot();for(let i=0;i<40&&!BBC.length;i++)tick(1);
ok(BBC.length==1&&BBC[0].z===T1&&near(T1.hp,1000-WP[BB].d),'the bolt sticks in the zombie it hit; the hit itself only does '+WP[BB].d);
T1.x+=12;tick(1);ok(near(BBC[0].x,T1.x+BBC[0].ox),'the bolt moves with that zombie');T1.x-=12;
const h0=[N1.hp,N2.hp,F1.hp];for(let i=0;i<90&&BBC.length;i++)tick(1);
ok(!BBC.length&&near(T1.hp,1000-WP[BB].d-WP[BB].bx),'it blew up about '+WP[BB].bf+' s later: '+WP[BB].bx+' more to the zombie it was in');
ok(near(N1.hp,h0[0]-WP[BB].bs)&&near(N2.hp,h0[1]-WP[BB].bs)&&near(F1.hp,h0[2]),'zombies around it took '+WP[BB].bs+'; one 210 px away took nothing');
ok(rg.length>0&&BBX.length>0,'a blast ring and a scorch mark');
const half=WP[BB].bf/2,b1=beeps.filter(t=>t>=0&&t<half).length,b2=beeps.filter(t=>t>=half).length;ok(b2>b1&&b1>=1&&beeps.length>=6,'the red light blinks faster and faster ('+b1+' beeps in the first half, '+b2+' in the second)');
// a blast kills and the kills count for the Blastbow
clr();m=arm(BB);let k0=wpA(S.ac)[BB].k;at(0,m.x+120,m.y,1000);for(let i=0;i<3;i++)at(0,m.x+100+i*20,m.y+40,5);shoot();secs(1.4);
ok(wpA(S.ac)[BB].k-k0==3,'the blast killed the 3 zombies around it and they count for the Blastbow');
// a bolt that hits nothing sticks where it lands and still blows up
clr();m=arm(BB);shoot();for(let i=0;i<80&&!BBC.length;i++)tick(1);ok(BBC.length==1&&!BBC[0].z&&BBC[0].x>m.x+100,'a bolt that hits nothing sticks where it lands');
let L1=at(0,BBC[0].x+25,BBC[0].y,1000);secs(1.2);ok(near(L1.hp,1000-WP[BB].bs),'and still blows up, hurting a zombie next to it');
// the zombie it is stuck in dies first: the bolt drops and still blows up
clr();m=arm(BB);const T2=at(0,m.x+120,m.y,1000),N3=at(0,m.x+120,m.y+40,1000);shoot();for(let i=0;i<40&&!BBC.length;i++)tick(1);T2.hp=-1;tick(2);
ok(BBC.length==1&&!BBC[0].z,'its zombie died: the bolt stays where it was');secs(1.2);ok(near(N3.hp,1000-WP[BB].bs),'and still blows up');
// a new wave clears bolts still blinking
clr();m=arm(BB);at(0,m.x+120,m.y,1000);shoot();for(let i=0;i<40&&!BBC.length;i++)tick(1);nextWave();toSp=0;keep();ok(!BBC.length,'a new wave clears bolts still blinking');
// ---------- Death Row ----------
clr();m=arm(DW);P.am.rk=10;const C=[];for(let i=0;i<20;i++)C.push(at(0,m.x+100+i*40,m.y+(i%2?12:-12),1000));
shoot();const hit=C.filter(z=>z.hp<1000);
ok(hit.length==15&&hit.every((z,i)=>z===C[i]),'one shot chains through the 15 nearest zombies in a group (and no more)');
ok(hit.every(z=>1000-z.hp>=10-1e-9&&1000-z.hp<13),'each took 10-13 damage: '+hit.map(z=>(1000-z.hp).toFixed(1)).join(' '));
ok(LZ.length==1&&LZ[0].pts.length==16,'the lightning is drawn from the gun through all 15');
ok(P.mg[DW]==0&&P.rl>0&&near(P.rlT,2.5),'one shot empties the magazine and a 2.5 s reload starts');secs(2.4);ok(P.mg[DW]==0,'still reloading after 2.4 s');secs(.2);ok(P.mg[DW]==1&&P.am.rk==9,'loaded after 2.5 s, using 1 rocket');
// only zombies close together: a gap bigger than the jump stops the chain
clr();m=arm(DW);const G=[at(0,m.x+100,m.y,1000),at(0,m.x+180,m.y,1000),at(0,m.x+260,m.y,1000),at(0,m.x+260+WP[DW].zj+60,m.y,1000)];shoot();
ok(G.slice(0,3).every(z=>z.hp<1000)&&G[3].hp==1000,'a zombie '+(WP[DW].zj+60)+' px from the group is not hit');
// bosses get zapped too, and kills count for Death Row
clr();m=arm(DW);k0=wpA(S.ac)[DW].k;const K=at(7,m.x+110,m.y,500),W3=[0,1,2].map(i=>at(0,m.x+180+i*50,m.y,4));shoot();
ok(K.hp<500&&K.hp>=487-1e-9&&W3.every(z=>z.hp<=0)&&wpA(S.ac)[DW].k-k0==3,'a boss in the chain is zapped for 10-13 and the 3 Walkers killed count for Death Row');
// the 2x damage pickup doubles it
clr();m=arm(DW);const D2=at(0,m.x+100,m.y,1000);P.dd=5;shoot();P.dd=0;ok(1000-D2.hp>=20-1e-9&&1000-D2.hp<26,'with 2x damage a zap does 20-26: '+(1000-D2.hp).toFixed(1));
// a zombie eating the player is the first one zapped
clr();m=arm(DW);const E=at(0,P.x-20,P.y,1000);P.eat=E;shoot();P.eat=null;ok(E.hp<1000,'a zombie eating the player gets zapped first');
// a shot at nothing still fires (and uses the rocket)
clr();m=arm(DW);P.am.rk=3;shoot();ok(LZ.length==1&&LZ[0].pts.length==2&&P.mg[DW]==0,'a shot at nothing crackles out and empties the magazine');
// walls stop the lightning
{let w0=null;const dy0=(arm(DW).y-P.y);for(const w of WL){if(w[4]==2||w[2]<6||w[2]>40||w[3]<100)continue;const y=w[1]+w[3]/2,a={x:w[0]-30,y},b={x:w[0]+w[2]+30,y},p={x:w[0]-160,y};if(p.x<40)continue;if(los(p,a)&&!los(a,b)&&!WL.some(v=>v!==w&&v[4]!=2&&p.x>v[0]-30&&p.x<v[0]+v[2]+30&&p.y-dy0>v[1]-30&&p.y-dy0<v[1]+v[3]+30)){w0={w,y,a,b,p};break}}
 ok(w0,'found a wall to test with');if(w0){clr();P.cur=DW;P.rl=0;P.cds[DW]=0;P.mg[DW]=1;P.x=w0.p.x;P.y=w0.y-dy0;P.a=0;const mm=muzzle(),A=at(0,w0.a.x,mm.y,1000),B=at(0,w0.b.x,mm.y,1000);fireOn();tick(1);fireOff();
 ok(A.hp<1000&&B.hp==1000,'the lightning does not jump through a wall ('+Math.round(w0.b.x-w0.a.x)+' px apart)')}}
home();
// ---------- Firebow ----------
clr();m=arm(FB);const Z1=at(0,m.x+100,m.y,1000);shoot();for(let i=0;i<40&&bs.length;i++)tick(1);
ok(near(Z1.hp,1000-WP[FB].d)&&Z1.brn==6,'a flaming bolt hits for '+WP[FB].d+' and sets the zombie on fire');
secs(3.2);ok(near(Z1.hp,1000-WP[FB].d-WP[FB].bd*WP[FB].bt),'it burns for '+WP[FB].bt+' s: '+(WP[FB].bd*WP[FB].bt).toFixed(1)+' more damage');
secs(2);ok(near(Z1.hp,1000-WP[FB].d-WP[FB].bd*WP[FB].bt)&&!(Z1.brn>0),'then the fire goes out');
// another hit starts the fire again instead of stacking it
clr();m=arm(FB);const Z2=at(0,m.x+100,m.y,1000);shoot();for(let i=0;i<40&&bs.length;i++)tick(1);secs(1);home();Z2.x=m.x+100;Z2.y=m.y;P.cds[FB]=0;shoot();for(let i=0;i<40&&bs.length;i++)tick(1);secs(3.4);
ok(near(Z2.hp,1000-2*WP[FB].d-2*.5*WP[FB].bd-WP[FB].bd*WP[FB].bt),'a second hit restarts the fire, it does not stack ('+(1000-Z2.hp).toFixed(2)+' in all)');
// burning to death counts for the Firebow
clr();m=arm(FB);k0=wpA(S.ac)[FB].k;const Z3=at(0,m.x+100,m.y,6);shoot();for(let i=0;i<40&&bs.length;i++)tick(1);ok(Z3.hp>0,'a 6-health zombie survives the hit');secs(2);ok(Z3.hp<=0&&wpA(S.ac)[FB].k-k0==1,'and burns to death; the kill counts for the Firebow');
ok(near(WP[FB].d,5)&&WP[FB].d*1>WP[XB].d,'(the Crossbow does '+WP[XB].d+')');
// drawing everything at once
clr();m=arm(BB);for(let i=0;i<6;i++)at(0,m.x+120+i*30,m.y+(i%2)*30,1000);shoot();tick(8);P.cur=FB;P.cds[FB]=0;shoot();tick(20);P.cur=DW;P.mg[DW]=1;P.am.rk=5;P.cds[DW]=0;shoot();tick(2);
drawW();hud();ok(!ERRS.length&&BBC.length&&LZ.length&&zs.some(z=>z.brn>0),'drawing stuck bolts, lightning, burning zombies and flaming bolts works (errors: '+ERRS.join(' | ')+')');
// ---------- split screen: kills go to the player whose gun did it ----------
{const inp0=inp;LBY={s:[{ci:0,ac:S.ac,inp:'km',v:0,rdy:1},{ci:3,ac:'G',inp:0,v:0,rdy:1}]};mapId=0;startMP();toSp=0;keep();clr();
 for(const p of PL){p.mx=p.hp=999;p.inv=1e9;p.own.push(FB,DW);p.am.ar=50;p.am.rk=5}
 const Q=PL[1];Q.x=best.x;Q.y=best.y;Q.a=0;PL[0].x=best.x;PL[0].y=best.y+150;PL[0].a=Math.PI;const k=PL.map(p=>p.k||0);
 Q.cur=FB;Q.cds[FB]=0;Q.mg[FB]=10;let P0=P;P=Q;const qm=muzzle();P=P0;const Z=at(0,qm.x+100,qm.y,6);
 inp=p=>({mx:0,my:0,fire:p===Q});tick(1);inp=()=>({mx:0,my:0,fire:false});secs(2.5);
 ok(Z.hp<=0&&(Q.k||0)-k[1]==1&&(PL[0].k||0)==k[0],'player 2\\'s burning zombie counts for player 2');
 Q.cur=DW;Q.cds[DW]=0;Q.mg[DW]=1;Q.rl=0;P=Q;const qm2=muzzle();P=P0;const ZZ=[0,1,2].map(i=>at(0,qm2.x+100+i*40,qm2.y,3));inp=p=>({mx:0,my:0,fire:p===Q});tick(1);inp=inp0;
 ok(ZZ.every(z=>z.hp<=0)&&(Q.k||0)-k[1]==4,'player 2\\'s lightning kills count for player 2');
 mode='shop';shop();ok(['Blastbow','Death Row','Firebow'].every(n=>ui.innerHTML.split(n).length>=3),'the split-screen shop sells the three new guns to each player');
 ok(!ERRS.length,'no errors in split screen: '+ERRS.join(' | '))}
// ---------- GAME BALANCE ----------
devSet();balOpen('guns');ok(/Blastbow.*Blast damage to the zombie it sticks in.*Blast damage to the zombies around.*Blast radius.*Seconds before it blows up.*Death Row.*Reload seconds.*Extra random damage.*Most zombies in one chain.*How far the lightning jumps.*Firebow.*Seconds a zombie burns.*Fire damage per second/s.test(ui.innerHTML),'Guns tab: the new guns with their own rows');
const idx=(sub,lab)=>BALR.findIndex(e=>e.g=='guns'&&e.sub.startsWith(sub)&&e.lab==lab);
balSet(idx('Death Row','Most zombies in one chain'),5);balSet(idx('Death Row','Reload seconds'),1);balSet(idx('Firebow','Seconds a zombie burns'),1);balSet(idx('Blastbow','Blast radius'),200);
ok(WP[DW].zn==5&&RLT[DW]==1&&WP[FB].bt==1&&WP[BB].br==200,'sliders change the guns');
setGM('f');mapId=0;start();nextWave();toSp=0;P.mx=P.hp=999;P.inv=1e9;keep();clr();P.own.push(DW,FB);P.am.rk=5;P.am.ar=50;
m=arm(DW);const C5=[];for(let i=0;i<10;i++)C5.push(at(0,m.x+100+i*40,m.y,1000));shoot();ok(C5.filter(z=>z.hp<1000).length==5,'a chain now stops at 5');secs(1.1);ok(P.mg[DW]==1,'and reloads in 1 s');
clr();m=arm(FB);const Z5=at(0,m.x+100,m.y,1000);shoot();for(let i=0;i<40&&bs.length;i++)tick(1);secs(2);ok(near(Z5.hp,1000-WP[FB].d-WP[FB].bd),'fire now lasts 1 s');
devOff();ok(WP[DW].zn==15&&RLT[DW]==2.5&&WP[FB].bt==3&&WP[BB].br==70,'test mode off puts the defaults back');devSet();balOpen('guns');balReset(0);devOff();
// ---------- older progress keeps working ----------
{const A={name:'Old'};wpA(A);ok(A.wp.length==WP.length&&A.cm.length==WP.length,'gun progress grows to every gun');const full=gEnc(S.ac).split('_');const B={},C2={};
 ok(gDec(full.slice(0,11).join('_'),B)&&B.wp.length==WP.length&&gDec(full.slice(0,13).join('_'),C2)&&C2.wp.length==WP.length&&C2.wp[15].l==1,'account codes from before (11 and 13 guns) still load');const D={};ok(gDec(gEnc(S.ac),D)&&D.wp.length==WP.length,'new codes carry every gun')}
{const A={};wpA(A);for(let g=0;g<11;g++)Object.assign(A.wp[g],{k:999,n:99,m:99,h:999,b:9});ok(camoOK(A,BB,9)&&cProg(A,0,9)=='11/11','Outbreak camo still unlocks at 11 Gold guns')}
CPR={v:1,w:3,k:0,gm:'f',m:0,ci:0,d:1,p:{cash:10,hp:5,mx:5,ar:0,own:[0,11],cur:11,mg:[18,45,6,30,1,8,30,40,100,8,120,10,3],am:{pa:0,ri:50,sh:0,rk:0,bl:0,ar:40},paid:{}}};setGM('f');mapId=0;sel=0;start();CPR=null;
ok(P.mg.length==WP.length&&P.mg[BB]==6&&P.mg[DW]==1&&P.mg[FB]==10&&P.am.ar==40,'a checkpoint saved before these guns resumes with their magazines ready');
armory(DW);ok(['Blastbow','Death Row','Firebow'].every(n=>ui.innerHTML.includes(n)),'the armory lists them with levels and camos');
ok(!ERRS.length,'no game errors: '+ERRS.join(' | '));
}
console.log('TOTAL errors',errs.length,errs);`;
new Function("docL","ivs","errs","started_",out)(docL,ivs,errs);
