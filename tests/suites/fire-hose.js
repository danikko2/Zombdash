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
// Fire Hose: tables, sprites, store, 100 rounds of flame lasting 15 s, 4 rockets a magazine (spare rounds kept), 5 damage a
// second in the flame, 2-3 s of afterburn at 2 a second, walls, kill credit (split screen too), GAME BALANCE rows, older saves
const out=code+`;S.ac.cp=8;S.tut=1;S.ac.name='Tester';docL.pointerdown[0]();endIntro();
{// (a block, so test names never clash with the game's globals)
const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+m);if(!c)errs.push(m)};
const tick=(n)=>{for(let i=0;i<n;i++){AT_+=.016;NOW_+=16;for(const f of ivs)f();for(let q=TQ.length-1;q>=0;q--)if(TQ[q][0]<=AT_){const g=TQ[q][1];TQ.splice(q,1);g()}loop(NOW_)}};
const secs=s=>tick(Math.round(s/.016));
const FH=WP.findIndex(w=>w.n=='Fire Hose'),near=(a,b,e)=>Math.abs(a-b)<(e||1e-6);
// ---------- tables ----------
ok(FH==18&&WP.length>=19,'the Fire Hose is gun 19 (the older guns keep their numbers)');
ok(WP[FH].cost==1600&&AMT[FH]=='rk'&&MAG[FH]==100&&near(MAG[FH]*WP[FH].r,15),'\\$1600, rockets, 100 rounds of flame a magazine = 15 s of fire');
ok(MAG[FH]/WP[FH].rpu==4,'a magazine is 4 rockets ('+WP[FH].rpu+' rounds each)');
ok(WP[FH].d==5&&WP[FH].fb0==2&&WP[FH].fb1==3&&WP[FH].fbd==2,'5 damage a second in the flame, then 2-3 s of fire at 2 a second');
ok([RLS,RLT,MAG,AMT,MZ,FS,FSN].every(a=>a.length==WP.length),'every per-gun table has an entry for every gun');
ok(['firehose','rlfh'].every(n=>typeof SF[n]=='function'),'fire and reload sounds exist');
ok(MAG.slice(0,18).join()=='18,45,6,30,1,8,30,40,200,8,120,10,3,6,1,10,1,4'&&WP[17].d==15&&WP[15].d==8&&AMI.rk.max==48,'older guns and ammo keep their values');
// ---------- sprites ----------
ok(Object.keys(PS).every(k=>PS[k].gun.length==WP.length&&PS[k].gun[18][2]==80&&PS[k].gun[18][1]>=1995),'every survivor holds a Fire Hose (80x32 frames below the old sheet)');
ok(JSON.stringify(PS[0].gun[17])=='[0,1929,80,32,6,14]'&&JSON.stringify(PS[0].gun[0])=='[490,0,80,32,6,14]','older gun frames did not move');
ok(ZS.flame&&JSON.stringify(ZS.flame.fly)=='[[637,1641,16,16],[654,1641,16,16],[671,1641,16,16]]'&&JSON.stringify(ZS.bubble.fly[1])=='[618,1641,18,18]','flame frames sit next to the old frames');
// ---------- store ----------
setGM('f');mapId=0;sel=0;S.dlf=1;start();P.cash=100000;P.am.rk=0;shop();
ok(/data-gun=18[^>]*><\\/canvas>Fire Hose<small>\\$1600</.test(ui.innerHTML),'the store sells the Fire Hose with its picture');
let c0=P.cash;buy(FH);ok(c0-P.cash==1600&&P.mg[FH]==100&&P.am.rk==8&&amTxt(P,FH)=='100 / 200','bought for \\$1600: 100 rounds loaded + 8 rockets (200 more rounds)');
// ---------- an open spot ----------
nextWave();toSp=0;P.mx=P.hp=999;P.inv=1e9;
let best=null;for(let y=200;y<WH-200;y+=20)for(let x=300;x<WW-300;x+=20){if(WL.some(w=>w[4]!=2&&w[0]<x+320&&w[0]+w[2]>x-260&&w[1]<y+160&&w[1]+w[3]>y-160))continue;const d=Math.hypot(x-HS.px,y-HS.py);if(!best||d<best.d)best={x,y,d}}
ok(best,'found an open spot');
let KP=mk(0,P.x>WW/2?30:WW-30,30);KP.hp=1e9;KP.spm=1e-6;
const clr=()=>{zs=[KP];bs=[];DR=[];ckClear();for(const p of PL)p.dd=0};
const home=()=>{P.x=best.x;P.y=best.y;P.a=0;P.cur=FH;P.cds[FH]=0;P.rl=0;P.eat=null};
const on=()=>{inp=()=>({mx:0,my:0,fire:true})},off=()=>{inp=()=>({mx:0,my:0,fire:false})};
const at=(t,x,y,hp)=>{const z=mk(t,x,y);z.hp=z.m0=z.mh=hp;z.fz=1e9;zs.push(z);return z};
// ---------- 15 s of flame ----------
clr();home();P.mg[FH]=100;P.am.rk=0;on();let n=0;while(P.mg[FH]>0&&n<2000){tick(1);n++}off();
ok(P.mg[FH]==0&&n*.016>14.6&&n*.016<15.3,'holding the trigger empties the 100 rounds in '+(n*.016).toFixed(2)+' s');
// ---------- reloads: 4 rockets a full magazine, spare rounds kept ----------
clr();home();P.mg[FH]=0;P.am.rk=10;P.amx={};P.rl=0;amRel(P);secs(RLT[FH]+.2);ok(P.mg[FH]==100&&P.am.rk==6,'a full reload uses 4 rockets ('+P.am.rk+' left)');
const tot=()=>P.am.rk*25+((P.amx&&P.amx[FH])||0)+P.mg[FH];let t0=tot();P.mg[FH]=60;t0-=40;P.rl=0;amRel(P);secs(RLT[FH]+.2);
ok(P.mg[FH]==100&&P.am.rk==4&&P.amx[FH]==10&&tot()==t0,'topping up 40 rounds opens 2 rockets and keeps the 10 spare');P.mg[FH]=60;P.rl=0;amRel(P);secs(RLT[FH]+.2);
ok(P.mg[FH]==100&&P.am.rk==2&&P.amx[FH]==20&&amTxt(P,FH)=='100 / 70','the next top-up uses the 10 spare first, then 2 rockets (100 / 70)');
mode='shop';shop();const rk0=P.am.rk;P.own.includes(FH)||P.own.push(FH);wSell(FH);ok(P.am.rk==rk0+4&&P.amx[FH]==20,'selling gives the loaded flame back as rockets');mode='play';P.own.push(FH);
// ---------- damage in the flame, then the afterburn ----------
clr();home();const m=muzzle(),Z=at(0,m.x+100,m.y,1000),back=at(0,P.x-90,P.y,1000),side=at(0,m.x,m.y+110,1000),far=at(0,m.x+260,m.y,1000);
P.mg[FH]=100;on();secs(2);const d2=1000-Z.hp;ok(d2>=9&&d2<=11&&Z.brn>0,'2 s in the flame: '+d2+' damage (5 a second), and it is on fire');
ok(back.hp==1000&&side.hp==1000&&far.hp==1000,'zombies behind, to the side and out of reach are not burned');
off();secs(.3);const h1=Z.hp;secs(3.6);const ab=h1-Z.hp;ok(ab>=4&&ab<=6&&!(Z.brn>0),'after the flame leaves it burns on for 2-3 s at 2 a second: '+ab+' more');
{const seen=new Set();for(let i=0;i<14;i++){clr();home();const q=at(0,m.x+100,m.y,1000);P.mg[FH]=100;on();secs(.5);off();secs(.3);const a=q.hp;secs(3.6);seen.add(a-q.hp)}
 ok([...seen].every(v=>v>=4&&v<=6)&&seen.size>=2,'the afterburn lasts 2, 2.5 or 3 s: '+[...seen].sort().join(', ')+' damage')}
// a crowd in the flame all burn, a boss too
clr();home();const C=[at(0,m.x+60,m.y-15,1000),at(0,m.x+120,m.y+20,1000),at(0,m.x+160,m.y,1000),at(7,m.x+90,m.y,1000)];P.mg[FH]=100;on();secs(1);off();ok(C.every(z=>z.hp<1000),'everything in the flame burns, a boss too');
// kills count for the Fire Hose
clr();home();let k0=wpA(S.ac)[FH].k;for(let i=0;i<3;i++)at(0,m.x+70+i*30,m.y,4);P.mg[FH]=100;on();secs(1.2);off();secs(3);ok(wpA(S.ac)[FH].k-k0==3,'the kills count for the Fire Hose');
// 2x damage
clr();home();const D=at(0,m.x+100,m.y,1000);P.dd=99;P.mg[FH]=100;on();secs(1);off();P.dd=0;ok(1000-D.hp>=9&&1000-D.hp<=11,'2x damage burns 10 a second ('+(1000-D.hp)+' in 1 s)');
// the zombie eating you always burns
clr();home();const E=at(0,P.x-25,P.y,1000);P.eat=E;P.mg[FH]=100;on();secs(.6);off();P.eat=null;ok(E.hp<1000,'the zombie eating you burns');
// walls block the flame
{let W0=null;for(const w of WL){if(w[4]==2||w[3]<80||w[0]<300||w[2]>40)continue;const y=w[1]+w[3]/2,p={x:w[0]-60,y};if(!fhLos(p,{x:w[0]-3,y}))continue;if(WL.some(v=>v!==w&&v[4]!=2&&v[0]<p.x+30&&v[0]+v[2]>p.x-30&&v[1]<p.y+30&&v[1]+v[3]>p.y-40))continue;W0={w,p};break}
 ok(W0,'found a wall');if(W0){clr();P.x=W0.p.x;P.y=W0.p.y+8;P.a=0;P.cur=FH;P.cds[FH]=0;P.mg[FH]=100;const mm=muzzle(),B=at(0,W0.w[0]+W0.w[2]+40,mm.y,1000);on();secs(1);off();ok(B.hp==1000,'a zombie behind a wall is not burned')}}
// a new wave clears the flames
clr();home();P.mg[FH]=100;on();secs(.3);off();nextWave();toSp=0;ok(!FHF.length&&!(P.fht>0),'a new wave clears the flames');
// drawing and light
clr();home();at(0,m.x+90,m.y,1000);P.mg[FH]=100;on();secs(.5);const L=[];fhLights(L);drawW();hud();off();secs(.4);drawW();
ok(!ERRS.length&&L.length>=2,'drawing the flame, burning zombies and the pilot light works; they light up dark maps (errors: '+ERRS.join(' | ')+')');
// ---------- split screen ----------
{const inp0=inp;LBY={s:[{ci:0,ac:S.ac,inp:'km',v:0,rdy:1},{ci:3,ac:'G',inp:0,v:0,rdy:1}]};mapId=0;startMP();toSp=0;clr();
 const Q=PL[1];for(const p of PL){p.inv=1e9;p.mx=p.hp=999;p.own.push(FH);p.am.rk=20}const k=PL.map(p=>p.k||0);
 Q.x=best.x;Q.y=best.y;Q.cur=FH;Q.mg[FH]=100;Q.cds[FH]=0;Q.a=0;PL[0].x=best.x;PL[0].y=best.y+220;const P0=P;P=Q;const qm=muzzle();P=P0;for(let i=0;i<3;i++)at(0,qm.x+70+i*30,qm.y,4);
 inp=p=>({mx:0,my:0,fire:p===Q});secs(1.2);inp=()=>({mx:0,my:0,fire:false});secs(3);
 ok((Q.k||0)-k[1]==3&&(PL[0].k||0)==k[0],'player 2\\'s flame kills count for player 2');
 inp=inp0;mode='shop';shop();ok(ui.innerHTML.split('Fire Hose').length>=3,'the split-screen shop sells it to each player');ok(!ERRS.length,'no errors in split screen: '+ERRS.join(' | '))}
// ---------- GAME BALANCE ----------
devSet();balOpen('guns');const sec=ui.innerHTML.slice(ui.innerHTML.indexOf('Fire Hose'));
ok(/Damage.*Magazine.*Store price.*Reload seconds.*Seconds of flame per round.*Rounds of flame from each rocket.*Flame reach.*Flame half-width.*Afterburn: fewest seconds.*Afterburn: most seconds.*Afterburn damage per second/s.test(sec),'Guns tab: Fire Hose rows');
const idx=lab=>BALR.findIndex(e=>e.g=='guns'&&e.sub.startsWith('Fire Hose')&&e.lab==lab);
balSet(idx('Flame reach'),300);balSet(idx('Afterburn: fewest seconds'),1);balSet(idx('Afterburn: most seconds'),1);balSet(idx('Rounds of flame from each rocket'),50);
ok(WP[FH].fr==300&&WP[FH].fb0==1&&WP[FH].fb1==1&&WP[FH].rpu==50,'sliders change the gun');
setGM('f');mapId=0;start();nextWave();toSp=0;P.mx=P.hp=999;P.inv=1e9;KP=mk(0,30,30);KP.hp=1e9;KP.spm=1e-6;clr();P.own.push(FH);P.am.rk=10;P.amx={};
home();const mm=muzzle(),F2=at(0,mm.x+260,mm.y,1000);P.mg[FH]=100;on();secs(1);off();secs(.3);const f1=F2.hp;secs(2);ok(F2.hp<1000&&near(f1-F2.hp,2),'the flame reaches 260 px, and burns on for 1 s (2 more)');
P.mg[FH]=0;P.rl=0;amRel(P);secs(RLT[FH]+.2);ok(P.mg[FH]==100&&P.am.rk==8,'a magazine now costs 2 rockets');
devOff();ok(WP[FH].fr==180&&WP[FH].fb0==2&&WP[FH].fb1==3&&WP[FH].rpu==25,'test mode off puts the defaults back');devSet();balOpen('guns');balReset(0);devOff();
// ---------- older progress keeps working ----------
{const A={name:'Old'};wpA(A);ok(A.wp.length==WP.length,'gun progress grows to every gun');const full=gEnc(S.ac).split('_'),B={};ok(gDec(full.slice(0,18).join('_'),B)&&B.wp.length==WP.length&&B.wp[18].l==1,'an account code from before the Fire Hose still loads')}
CPR={v:1,w:3,k:0,gm:'f',m:0,ci:0,d:1,p:{cash:10,hp:5,mx:5,ar:0,own:[0,17],cur:17,mg:[18,45,6,30,1,8,30,40,200,8,120,10,3,6,1,10,1,4],am:{pa:0,ri:0,sh:0,rk:9,bl:0,ar:0},paid:{}}};setGM('f');mapId=0;sel=0;start();CPR=null;
ok(P.mg.length==WP.length&&P.mg[FH]==100&&P.am.rk==9,'a checkpoint saved before the Fire Hose resumes with its magazine ready');
P.own.push(FH);P.amx={[FH]:15};wave=4;cpSave();let cp=null;try{cp=JSON.parse(localStorage[CPK])}catch(e){}ok(cp&&cp.p.amx&&cp.p.amx[FH]==15,'checkpoints keep the spare rounds');
armory(FH);ok(ui.innerHTML.includes('Fire Hose'),'the armory lists it with levels and camos');
ok(!ERRS.length,'no game errors: '+ERRS.join(' | '));
}
console.log('TOTAL errors',errs.length,errs);`;
new Function("docL","ivs","errs","started_",out)(docL,ivs,errs);
