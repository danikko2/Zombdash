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
// Crossbow and Chicken Gun: tables, sprites, store, ammo, one-shot rule, fire rate, chickens eating / ballooning / popping,
// GAME BALANCE rows, and that older saves, codes and checkpoints keep working
const out=code+`;S.ac.cp=8;S.tut=1;S.ac.name='Tester';docL.pointerdown[0]();endIntro();
{// (a block, so test names never clash with the game's globals)
const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+m);if(!c)errs.push(m)};
const tick=(n)=>{for(let i=0;i<n;i++){AT_+=.016;NOW_+=16;for(const f of ivs)f();for(let q=TQ.length-1;q>=0;q--)if(TQ[q][0]<=AT_){const g=TQ[q][1];TQ.splice(q,1);g()}loop(NOW_)}};
const secs=s=>tick(Math.round(s/.016));
const XB=WP.findIndex(w=>w.n=='Crossbow'),CG=WP.findIndex(w=>w.n=='Chicken Gun');
// ---------- tables ----------
ok(XB==11&&CG==12&&WP.length==13,'Crossbow and Chicken Gun are guns 12 and 13 (the 11 older guns keep their numbers)');
ok(WP[XB].cost==500&&WP[XB].r==.75&&WP[XB].d==4&&WP[XB].p==1,'Crossbow: $500, one shot every 0.75 s, 4 damage');
ok(AMT[XB]=='ar'&&AMI.ar&&AMI.ar.buy==100&&AMI.ar.cost==40&&AMI.ar.max==500&&MAG[XB]==10,'Crossbow uses arrows: 100 for $40, carry up to 500, 10-bolt magazine');
ok(WP[CG].cost==2000&&WP[CG].ck&&AMT[CG]=='rk'&&WP[CG].apr==2&&MAG[CG]==3,'Chicken Gun: $2000, 3 chickens a magazine, each chicken uses 2 rockets');
ok(CKG.max==3&&CKG.n0==5&&CKG.n1==8&&CKG.big==8,'chickens: 3 out at once, eat 5-8, health 8 or more counts as two');
ok([RLS,RLT,MAG,AMT,MZ,FS,FSN].every(a=>a.length==WP.length),'every per-gun table has an entry for all 13 guns');
ok(FSN.every(n=>typeof SF[n]=='function')&&RLS.every(n=>typeof SF[n]=='function')&&SF.ckinflate&&SF.ckpop,'fire, reload and chicken sounds exist');
ok(MAG.slice(0,11).join()=='18,45,6,30,1,8,30,40,100,8,120'&&WP[4].d==25&&WP[7].cost==4000&&AMI.rk.max==36&&AMI.pa.buy==300,'older guns and ammo keep their values');
// ---------- sprites ----------
ok(Object.keys(PS).length==CH.length&&Object.keys(PS).every(k=>PS[k].gun.length==WP.length&&PS[k].gun.slice(11).every(f=>f[2]==80&&f[3]==32&&f[4]==6&&f[5]==14&&f[1]>=1599)),'every survivor holds a Crossbow and a Chicken Gun frame (80x32, added below the old sheet)');
ok(JSON.stringify(PS[0].gun[0])=='[490,0,80,32,6,14]'&&JSON.stringify(PS[16].gun[10])=='[729,1566,80,32,6,14]'&&JSON.stringify(PS[8].gun[10])=='[324,849,80,32,6,14]','older gun frames did not move');
ok(ZS.chicken&&ZS.chicken.fly.length==4&&ZS.chicken.eat.length==2&&ZS.chicken.puff.length==2&&ZS.bolt&&ZS.bolt.fly.length==1&&ZS.chicken.fly[0][1]>=1641&&ZS.bolt.fly[0][1]>=1641,'rubber chicken (fly, eat, balloon) and bolt frames added below the old zombie sheet');
ok(JSON.stringify(ZS[0].walk[0])=='[0,0,58,62]'&&JSON.stringify(ZS[20].walk[0])=='[0,1423,102,108]'&&JSON.stringify(ZS[14].bite[3])=='[837,1190,92,82]','older zombie frames did not move');
// ---------- store ----------
setGM('f');mapId=0;sel=0;S.dlf=1;start();P.mx=P.hp=999;P.cash=100000;shop();
ok(/data-gun=11[^>]*><\\/canvas>Crossbow<small>\\$500</.test(ui.innerHTML)&&/data-gun=12[^>]*><\\/canvas>Chicken Gun<small>\\$2000</.test(ui.innerHTML),'store sells the Crossbow ($500) and the Chicken Gun ($2000), each with its picture');
ok(ui.innerHTML.includes("amBuy('ar')")&&/Arrows<small>0\\/500 · \\+100 \\$40/.test(ui.innerHTML),'store sells arrows: +100 for $40, 500 max');
let c0=P.cash;buy(XB);ok(P.own.includes(XB)&&c0-P.cash==500&&P.cur==XB&&P.mg[XB]==10&&P.am.ar==20,'bought the Crossbow for $500: 10 bolts loaded + 20 arrows');
c0=P.cash;let a0=P.am.ar;amBuy('ar');ok(P.am.ar==a0+100&&c0-P.cash==40,'100 arrows for $40');for(let i=0;i<9;i++)amBuy('ar');c0=P.cash;amBuy('ar');ok(P.am.ar==500&&P.cash==c0,'arrows stop at 500');
ok(ui.innerHTML.includes('Crossbow')&&ui.innerHTML.includes('10 / 500'),'inventory shows the Crossbow with 10 / 500');
// ---------- the Crossbow kills a Walker in one shot up to wave 4 ----------
nextWave();toSp=0;P.mx=P.hp=999;
let KP;const keep=()=>{KP=mk(0,P.x>WW/2?30:WW-30,P.y>WH/2?30:WH-30);KP.hp=1e9;KP.spm=1e-6;return KP};keep();ok(Math.hypot(KP.x-P.x,KP.y-P.y)>CKG.rng+100,'a far-away zombie keeps each wave going during the test');
const clr=()=>{zs=[KP];bs=[];DR=[];for(const p of PL)p.dd=0;ckClear()};clr();const fireOn=()=>{inp=()=>({mx:0,my:0,fire:true})},fireOff=()=>{inp=()=>({mx:0,my:0,fire:false})};
const bolt=(w)=>{wave=w;clr();P.cur=XB;P.mg[XB]=10;P.rl=0;P.cds[XB]=0;P.a=0;P.dd=0;const m=muzzle(),z=mk(0,m.x+70,m.y);z.fz=99;zs.push(z);const h=z.hp;fireOn();tick(1);fireOff();const b=bs.slice();for(let i=0;i<40&&bs.length;i++)tick(1);return{h,b,dead:z.hp<=0,z}};
for(const w of[1,2,3,4]){const r=bolt(w);ok(r.b.length==1&&r.b[0].ab&&r.b[0].d==4&&r.dead,'wave '+w+' Walker ('+r.h.toFixed(2)+' health) dies to one bolt')}
{const r=bolt(5);ok(!r.dead&&r.z.hp<r.h&&r.h>4,'wave 5 Walker ('+r.h.toFixed(2)+' health) survives one bolt');P.cds[XB]=0;fireOn();tick(1);fireOff();for(let i=0;i<40&&bs.length;i++)tick(1);ok(r.z.hp<=0,'and dies to the second')}
// fire rate: 0.75 s between shots
wave=2;clr();P.cur=XB;P.mg[XB]=10;P.cds[XB]=0;let fired=0;fireOn();for(let i=0;i<Math.round(3/.016);i++){const n0=P.mg[XB];tick(1);if(P.mg[XB]<n0)fired++}fireOff();ok(fired==4,'holding the trigger for 3 s fires 4 bolts (one every 0.75 s): '+fired);
// reload takes arrows
P.mg[XB]=1;P.am.ar=37;P.cds[XB]=0;fireOn();tick(1);fireOff();secs(RLT[XB]+.3);ok(P.mg[XB]==10&&P.am.ar==27,'the empty magazine reloads 10 bolts from the arrows ('+P.mg[XB]+' / '+P.am.ar+')');
// ---------- Chicken Gun ----------
mode='shop';P.own=[CH[0].w];P.cash=100000;P.am.rk=0;shop();c0=P.cash;buy(CG);ok(P.own.includes(CG)&&c0-P.cash==2000&&P.mg[CG]==3&&P.am.rk==12,'bought the Chicken Gun for $2000: 3 chickens loaded + 12 rockets (6 more chickens)');
ok(amTxt(P,CG)=='3 / 6','its ammo reads in chickens: '+amTxt(P,CG));
nextWave();toSp=0;keep();clr();P.mx=P.hp=999;P.inv=1e9;
const herd=(n,t,hp)=>{const L=[];for(let i=0;i<n;i++){const z=mk(t||0,P.x+90+(i%4)*26,P.y-70+(i>>2)*34);if(hp!=null)z.hp=z.m0=hp;L.push(z)}zs.push(...L);return L};
const launch=()=>{P.cur=CG;P.cds[CG]=0;P.rl=0;fireOn();tick(1);fireOff()};
const run=(s,stop)=>{for(let i=0;i<Math.round(s/.016);i++){tick(1);if(stop&&stop())break}};
// one chicken with room for 6 Walkers eats exactly 6, then balloons and pops
let L=herd(12,0,3),k0=wpA(S.ac)[CG].k,mg0=P.mg[CG];launch();ok(CK.length==1&&P.mg[CG]==mg0-1&&CK[0].m>=5&&CK[0].m<=8,'one chicken out, it wants '+CK[0].m+' zombies (5-8)');
CK[0].m=6;let seen=new Set(),pf=0;run(25,()=>{for(const c of CK){if(c.s=='puff')pf=1}return !CK.length});
let dead=L.filter(z=>z.hp<=0).length;ok(dead==6,'a full chicken ate exactly 6 Walkers: '+dead);ok(pf&&!CK.length,'then it ballooned up and popped');ok(CKS.length>=7,'blood splatters left on the ground: '+CKS.length);
ok(wpA(S.ac)[CG].k-k0==6,'the 6 kills count for the Chicken Gun (weapon level and camos)');
// health 8 or more counts as two
clr();L=herd(8,2,8);launch();CK[0].m=6;run(25,()=>!CK.length);ok(L.filter(z=>z.hp<=0).length==3,'zombies with 8 health count as two: a 6-zombie chicken ate 3 of them');
clr();L=herd(8,0,7.9);launch();CK[0].m=6;run(25,()=>!CK.length);ok(L.filter(z=>z.hp<=0).length==6,'zombies with 7.9 health count as one: it ate 6');
// three chickens at a time, each after a different zombie; the 4th shot waits
clr();L=herd(28,0,3);P.mg[CG]=3;launch();secs(.2);launch();secs(.2);launch();ok(CK.length==3&&P.mg[CG]==0,'three chickens out');
P.mg[CG]=3;FT=[];launch();ok(CK.length==3&&P.mg[CG]==3&&FT.some(f=>f.t=='3 CHICKENS OUT'),'a 4th chicken is not fired while 3 are out (no ammo used)');
let share=0,want=CK.reduce((s,c)=>s+c.m,0);run(40,()=>{const T=CK.filter(c=>c.z&&(c.s=='seek'||c.s=='eat')).map(c=>c.z);if(new Set(T).size<T.length)share++;return !CK.length});
ok(share==0,'the chickens never went after the same zombie');dead=L.filter(z=>z.hp<=0).length;ok(dead==want,'together they ate '+dead+' zombies (their appetites add up to '+want+')');
launch();ok(CK.length==1,'with the chickens gone the gun fires again');
// a chicken bites a boss instead of swallowing it
clr();const K=mk(7,P.x+120,P.y-40);K.hp=K.mh=500;zs.push(K);launch();CK[0].m=8;run(25,()=>!CK.length);ok(K.hp>0&&Math.abs((500-K.hp)-4*WP[CG].d)<1e-6,'a boss is bitten for '+WP[CG].d+' a bite, 4 bites (each counts two) before the chicken is full: '+(500-K.hp));
// nothing to eat: it pops after CKG.idle seconds
clr();launch();secs(CKG.idle-.5);ok(CK.length==1,'a chicken with nothing to eat circles for a while');secs(2);ok(!CK.length,'then pops');
// reload: 2 rockets per chicken
ckClear();P.mg[CG]=0;P.am.rk=5;P.cur=CG;P.rl=0;amRel(P);secs(RLT[CG]+.3);ok(P.mg[CG]==2&&P.am.rk==1,'reload: 5 rockets load 2 chickens and leave 1 rocket ('+P.mg[CG]+' / '+P.am.rk+')');
P.mg[CG]=0;P.rl=0;ok(!amRel(P)&&amRes(P,CG)==0,'one rocket is not enough for a chicken');
P.mg[CG]=2;mode='shop';shop();const rk0=P.am.rk;wSell(CG);ok(P.am.rk==rk0+4&&!P.own.includes(CG),'selling the gun gives back the loaded chickens as rockets');
// drawing with bolts, chickens and splatters on screen
nextWave();toSp=0;keep();clr();P.mx=P.hp=999;P.own=[CH[0].w,XB,CG];P.mg[CG]=3;P.am.rk=20;herd(6,0,3);launch();P.cur=XB;P.cds[XB]=0;fireOn();secs(.3);fireOff();secs(1.5);drawW();P.cur=CG;hud();ok(!ERRS.length,'drawing bolts, chickens, blood and the chickens-out markers works (errors: '+ERRS.join(' | ')+')');
// ---------- split screen: each player has their own 3 chickens, and nobody's chickens share a zombie ----------
{const inp0=inp;LBY={s:[{ci:0,ac:S.ac,inp:'km',v:0,rdy:1},{ci:3,ac:'G',inp:0,v:0,rdy:1}]};mapId=0;startMP();toSp=0;keep();clr();
ok(MPn==2&&PL.length==2,'split screen with 2 players');
for(const p of PL){p.mx=p.hp=999;p.inv=1e9;p.own.push(CG);p.cur=CG;p.mg[CG]=3;p.am.rk=20;p.rl=0}
PL[1].x=PL[0].x+40;PL[1].y=PL[0].y;L=herd(48,0,3);
const shoot=who=>{for(const p of PL)p.cds[CG]=0;inp=p=>({mx:0,my:0,fire:p===who});tick(1);inp=()=>({mx:0,my:0,fire:false});secs(.2)};
const k0s=PL.map(p=>p.k||0);for(let i=0;i<3;i++){shoot(PL[0]);shoot(PL[1])}
ok(CK.length==6&&PL.every(p=>ckOut(p)==3&&p.mg[CG]==0),'each player has 3 chickens out (6 in all)');
PL[0].mg[CG]=3;shoot(PL[0]);ok(ckOut(PL[0])==3&&PL[0].mg[CG]==3,'player 1 cannot fire a 4th while their 3 are out');
let share2=0;run(45,()=>{const T=CK.filter(c=>c.z&&(c.s=='seek'||c.s=='eat')).map(c=>c.z);if(new Set(T).size<T.length)share2++;return !CK.length});
dead=L.filter(z=>z.hp<=0).length;const got=PL.map((p,i)=>(p.k||0)-k0s[i]);
ok(share2==0&&!CK.length,'six chickens from two players never went after the same zombie');
ok(got[0]>=15&&got[1]>=15&&got[0]+got[1]==dead,'each player gets the kills of their own chickens: '+got.join(' + ')+' = '+dead);
inp=inp0;mode='shop';shop();const it=shopIt(PL[1]),j=it.findIndex(x=>x.h.includes('ARROWS'));
ok(j>=0&&ui.innerHTML.split('ARROWS').length==3,'the split-screen shop sells arrows to each player');
PL[1].cash=1000;const a1=PL[1].am.ar;mb(1,j);ok(PL[1].am.ar==a1+100&&PL[1].cash==960,'player 2 buys 100 arrows for $40');
const g=it.findIndex(x=>x.h.includes('data-gun=11'));ok(g>=0&&it[g+1].h.includes('data-gun=12'),'and both new guns, with their pictures');
ok(!ERRS.length,'no errors in split screen: '+ERRS.join(' | '))}
// ---------- GAME BALANCE ----------
devSet();balOpen('guns');ok(/Crossbow.*Seconds between shots.*Bolt speed.*Chicken Gun.*Rockets per chicken.*Chickens out at once.*Fewest zombies a chicken eats.*Most zombies a chicken eats.*counts as 2 eaten/s.test(ui.innerHTML),'Guns tab: Crossbow and Chicken Gun with their own rows');
balOpen('ammo');ok(ui.innerHTML.includes('Arrows'),'Ammo tab lists arrows');
const idx=(sub,lab)=>BALR.findIndex(e=>e.g=='guns'&&e.sub.startsWith(sub)&&e.lab==lab);
balSet(idx('Chicken Gun','Fewest zombies a chicken eats'),2);balSet(idx('Chicken Gun','Most zombies a chicken eats'),2);balSet(idx('Chicken Gun','Rockets per chicken'),3);balSet(idx('Crossbow','Seconds between shots'),.5);
ok(CKG.n0==2&&CKG.n1==2&&WP[CG].apr==3&&WP[XB].r==.5,'sliders change the chickens and the Crossbow');
setGM('f');start();nextWave();toSp=0;keep();clr();P.own.push(CG);P.mg[CG]=3;launch();ok(CK[0]&&CK[0].m==2,'a chicken now eats 2');P.mg[CG]=0;P.am.rk=7;P.rl=0;amRel(P);secs(RLT[CG]+.3);ok(P.mg[CG]==2&&P.am.rk==1,'and costs 3 rockets');
devOff();ok(CKG.n0==5&&CKG.n1==8&&WP[CG].apr==2&&WP[XB].r==.75,'test mode off puts the defaults back');devSet();balOpen('guns');balReset(0);devOff();
// ---------- older progress keeps working ----------
{const A={name:'Old'};wpA(A);ok(A.wp.length==13&&A.cm.length==13,'gun progress grows to 13 guns');const c11=gEnc(S.ac).split('_').slice(0,11).join('_'),B={};ok(gDec(c11,B)&&B.wp.length==13&&B.wp[12].l==1,'an account code from before the new guns still loads');const C={};ok(gDec(gEnc(S.ac),C)&&C.wp.length==13,'new codes carry 13 guns')}
{const A={};wpA(A);for(let g=0;g<11;g++)Object.assign(A.wp[g],{k:999,n:99,m:99,h:999,b:9});ok(golds(A)==11&&camoOK(A,0,9)&&camoOK(A,CG,9)&&cProg(A,0,9)=='11/11','Outbreak camo still unlocks at 11 Gold guns, so nobody loses it')}
CPR={v:1,w:3,k:0,gm:'f',m:0,ci:0,d:1,p:{cash:10,hp:5,mx:5,ar:0,own:[0,3],cur:3,mg:[18,45,6,30,1,8,30,40,100,8,120],am:{pa:0,ri:50,sh:0,rk:0,bl:0},paid:{}}};setGM('f');mapId=0;sel=0;start();CPR=null;
ok(P.mg.length==13&&P.mg[XB]==10&&P.am.ar===0&&P.am.ri==50,'a checkpoint saved before the new guns resumes with arrows and the new magazines');P.cash=100000;amBuy('ar');ok(P.am.ar==100,'and can buy arrows');
armory(CG);ok(ui.innerHTML.includes('Chicken Gun')&&ui.innerHTML.includes('Crossbow')&&ui.innerHTML.includes('Outbreak at 11'),'armory lists the new guns with levels and camos');
ok(!ERRS.length,'no game errors: '+ERRS.join(' | '));
}
console.log('TOTAL errors',errs.length,errs);`;
new Function("docL","ivs","errs","started_",out)(docL,ivs,errs);
