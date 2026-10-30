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
// Bubble Cannon: tables, sprites, store, 4-6 bubbles a shot, 2 rockets a shot, 4 shots a magazine, floating and popping
// for 15 splash damage, walls, kill credit (split screen too), GAME BALANCE rows, older saves, codes and checkpoints
const out=code+`;S.ac.cp=8;S.tut=1;S.ac.name='Tester';docL.pointerdown[0]();endIntro();
{// (a block, so test names never clash with the game's globals)
const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+m);if(!c)errs.push(m)};
const tick=(n)=>{for(let i=0;i<n;i++){AT_+=.016;NOW_+=16;for(const f of ivs)f();for(let q=TQ.length-1;q>=0;q--)if(TQ[q][0]<=AT_){const g=TQ[q][1];TQ.splice(q,1);g()}loop(NOW_)}};
const secs=s=>tick(Math.round(s/.016));
const BC=WP.findIndex(w=>w.n=='Bubble Cannon'),near=(a,b)=>Math.abs(a-b)<1e-6;
// ---------- tables ----------
ok(BC==17&&WP.length>=18,'the Bubble Cannon is gun 18 (the older guns keep their numbers)');
ok(WP[BC].cost==2250&&AMT[BC]=='rk'&&WP[BC].apr==2&&MAG[BC]==4,'\\$2250, rockets: 2 a shot, 4 shots a magazine');
ok(WP[BC].d==15&&WP[BC].bn0==4&&WP[BC].bn1==6,'4-6 bubbles a shot, each pop does 15');
ok([RLS,RLT,MAG,AMT,MZ,FS,FSN].every(a=>a.length==WP.length),'every per-gun table has an entry for every gun');
ok(['bubblecannon','rlbc','bcpop'].every(n=>typeof SF[n]=='function'),'fire, reload and pop sounds exist');
ok(MAG.slice(0,17).join()=='18,45,6,30,1,8,30,40,100,8,120,10,3,6,1,10,1'&&WP[16].hl==2&&WP[14].zn==15&&AMI.rk.max==36,'older guns and ammo keep their values');
// ---------- sprites ----------
ok(Object.keys(PS).every(k=>PS[k].gun.length==WP.length&&PS[k].gun[17][2]==80&&PS[k].gun[17][1]>=1929),'every survivor holds a Bubble Cannon (80x32 frames below the old sheet)');
ok(JSON.stringify(PS[0].gun[16])=='[0,1863,80,32,6,14]'&&JSON.stringify(PS[0].gun[0])=='[490,0,80,32,6,14]','older gun frames did not move');
ok(ZS.bubble&&JSON.stringify(ZS.bubble.fly)=='[[599,1641,18,18],[618,1641,18,18]]'&&JSON.stringify(ZS.heart.fly[0])=='[580,1641,18,16]','bubble frames sit next to the old frames');
// ---------- store ----------
setGM('f');mapId=0;sel=0;S.dlf=1;start();P.cash=100000;P.am.rk=0;shop();
ok(/data-gun=17[^>]*><\\/canvas>Bubble Cannon<small>\\$2250</.test(ui.innerHTML),'the store sells the Bubble Cannon with its picture');
let c0=P.cash;buy(BC);ok(c0-P.cash==2250&&P.mg[BC]==4&&P.am.rk==16&&amTxt(P,BC)=='4 / 8','bought for \\$2250: 4 shots loaded + 16 rockets (8 more shots)');
// ---------- an open spot ----------
nextWave();toSp=0;P.mx=P.hp=999;P.inv=1e9;
let best=null;for(let y=200;y<WH-200;y+=20)for(let x=300;x<WW-300;x+=20){if(WL.some(w=>w[4]!=2&&w[0]<x+320&&w[0]+w[2]>x-260&&w[1]<y+160&&w[1]+w[3]>y-160))continue;const d=Math.hypot(x-HS.px,y-HS.py);if(!best||d<best.d)best={x,y,d}}
ok(best,'found an open spot');
let KP=mk(0,P.x>WW/2?30:WW-30,30);KP.hp=1e9;KP.spm=1e-6;
const clr=()=>{zs=[KP];bs=[];DR=[];ckClear();for(const p of PL)p.dd=0};
const home=()=>{P.x=best.x;P.y=best.y;P.a=0;P.cur=BC;P.cds[BC]=0;P.rl=0;P.eat=null};
const shoot=()=>{inp=()=>({mx:0,my:0,fire:true});tick(1);inp=()=>({mx:0,my:0,fire:false})};
const at=(t,x,y,hp)=>{const z=mk(t,x,y);z.hp=z.m0=z.mh=hp;z.fz=1e9;zs.push(z);return z};
const bub=(x,y,l)=>{const b={x,y,vx:0,vy:0,t:0,l:l||.05,o:P,g:BC,dd:P.dd>0,ph:0,s:1};BCB.push(b);return b};
// ---------- a shot ----------
clr();home();P.mg[BC]=4;shoot();const n1=BCB.length;ok(n1>=4&&n1<=6&&P.mg[BC]==3,'one shot blows '+n1+' bubbles and uses one of 4 shots');
const v0=BCB.map(b=>Math.hypot(b.vx,b.vy));secs(.6);ok(BCB.length==n1&&BCB.every((b,i)=>Math.hypot(b.vx,b.vy)<v0[i])&&BCB.every(b=>b.x>P.x),'they float out in front, slowing down');
secs(WP[BC].bt*1.3);ok(!BCB.length&&BCP.length==n1,'after about '+WP[BC].bt+' s they all pop, each leaving a wet patch');
{const seen=new Set();for(let i=0;i<40;i++){clr();home();P.mg[BC]=4;shoot();seen.add(BCB.length)}ok([...seen].every(n=>n>=4&&n<=6)&&seen.has(4)&&seen.has(6),'over 40 shots: '+[...seen].sort().join(', ')+' bubbles')}
// ---------- the pop ----------
clr();home();const bx=P.x+150,by=P.y,A=at(0,bx+20,by,1000),B=at(0,bx-30,by+25,1000),C=at(0,bx+130,by,1000),K=at(7,bx,by-40,1000);rg=[];bub(bx,by);tick(6);
ok(near(A.hp,985)&&near(B.hp,985)&&near(K.hp,985),'a pop does 15 to every zombie nearby (a boss too)');ok(C.hp==1000,'one 130 px away takes nothing');ok(rg.length>0,'with a ring of water');
clr();home();let k0=wpA(S.ac)[BC].k;for(let i=0;i<3;i++)at(0,bx+i*15,by,5);bub(bx,by);tick(6);ok(wpA(S.ac)[BC].k-k0==3,'the kills count for the Bubble Cannon');
clr();home();const D=at(0,bx,by,1000);P.dd=5;bub(bx,by);P.dd=0;tick(6);ok(near(D.hp,970),'with 2x damage a pop does 30');
// a real shot into a crowd
clr();home();const crowd=[];for(let i=0;i<12;i++)crowd.push(at(0,P.x+110+(i%4)*35,P.y-40+(i>>2)*40,1000));P.mg[BC]=4;shoot();secs(WP[BC].bt*1.3);
const dm=crowd.map(z=>1000-z.hp);ok(dm.some(d=>d>0)&&dm.every(d=>Math.abs(d/15-Math.round(d/15))<1e-6),'a shot into a crowd: damage in steps of 15 ('+dm.filter(d=>d>0).length+' of 12 hit)');
// ---------- magazine and reload ----------
clr();home();P.mg[BC]=4;P.am.rk=10;for(let i=0;i<4;i++){P.cds[BC]=0;shoot()}ok(P.mg[BC]==0&&P.rl>0&&near(P.rlT,RLT[BC]),'4 shots empty the magazine and a reload starts');
secs(RLT[BC]+.2);ok(P.mg[BC]==4&&P.am.rk==2,'the reload loads 4 shots for 8 rockets');P.mg[BC]=0;P.am.rk=1;P.rl=0;ok(!amRel(P)&&amTxt(P,BC)=='0 / 0','1 rocket is not enough for a shot');
// ---------- walls ----------
{let W0=null;for(const w of WL){if(w[4]==2||w[3]<70||w[0]<200||w[2]<6)continue;const y=w[1]+w[3]/2;if(bcWall(w[0]-20,y))continue;W0={w,y};break}
 ok(W0,'found a wall');clr();home();const b=bub(W0.w[0]-12,W0.y,2);b.vx=300;secs(.4);ok(b.x<W0.w[0],'a bubble does not float through a wall')}
// a new wave clears bubbles
clr();home();P.mg[BC]=4;shoot();nextWave();toSp=0;ok(!BCB.length,'a new wave clears the bubbles');
// drawing
clr();home();P.mg[BC]=4;shoot();secs(.3);P.cds[BC]=0;shoot();tick(2);drawW();hud();ok(!ERRS.length&&BCB.length,'drawing bubbles and splashes works (errors: '+ERRS.join(' | ')+')');
// ---------- split screen ----------
{const inp0=inp;LBY={s:[{ci:0,ac:S.ac,inp:'km',v:0,rdy:1},{ci:3,ac:'G',inp:0,v:0,rdy:1}]};mapId=0;startMP();toSp=0;clr();
 const Q=PL[1];for(const p of PL){p.inv=1e9;p.mx=p.hp=999;p.own.push(BC);p.am.rk=20}const k=PL.map(p=>p.k||0);
 Q.x=best.x;Q.y=best.y;Q.cur=BC;Q.mg[BC]=4;Q.cds[BC]=0;Q.a=0;PL[0].x=best.x;PL[0].y=best.y+200;
 inp=p=>({mx:0,my:0,fire:p===Q});tick(1);inp=()=>({mx:0,my:0,fire:false});const own=BCB.every(b=>b.o===Q);
 for(const b of BCB)for(let i=0;i<2;i++)at(0,b.x+60+i*10,b.y,3);secs(WP[BC].bt*1.3);
 ok(own&&(Q.k||0)>k[1]&&(PL[0].k||0)==k[0],'player 2\\'s bubbles count their kills for player 2 ('+((Q.k||0)-k[1])+')');
 inp=inp0;mode='shop';shop();ok(ui.innerHTML.split('Bubble Cannon').length>=3,'the split-screen shop sells it to each player');ok(!ERRS.length,'no errors in split screen: '+ERRS.join(' | '))}
// ---------- GAME BALANCE ----------
devSet();balOpen('guns');const sec=ui.innerHTML.slice(ui.innerHTML.indexOf('Bubble Cannon'));
ok(/Damage.*Seconds between shots.*Reload seconds.*Rockets per shot.*Fewest bubbles a shot.*Most bubbles a shot.*Splash radius.*Seconds a bubble floats.*Bubble speed/s.test(sec),'Guns tab: Bubble Cannon rows');
const idx=lab=>BALR.findIndex(e=>e.g=='guns'&&e.sub.startsWith('Bubble Cannon')&&e.lab==lab);
balSet(idx('Fewest bubbles a shot'),2);balSet(idx('Most bubbles a shot'),2);balSet(idx('Splash radius'),150);ok(WP[BC].bn0==2&&WP[BC].bn1==2&&WP[BC].br==150,'sliders change the gun');
setGM('f');mapId=0;start();nextWave();toSp=0;P.mx=P.hp=999;P.inv=1e9;KP=mk(0,30,30);KP.hp=1e9;KP.spm=1e-6;clr();P.own.push(BC);P.am.rk=10;
home();P.mg[BC]=4;shoot();ok(BCB.length==2,'a shot now blows 2 bubbles');clr();home();const F=at(0,bx+130,by,1000);bub(bx,by);tick(6);ok(near(F.hp,985),'a wider splash reaches 130 px');
devOff();ok(WP[BC].bn0==4&&WP[BC].bn1==6&&WP[BC].br==55,'test mode off puts the defaults back');devSet();balOpen('guns');balReset(0);devOff();
// ---------- older progress keeps working ----------
{const A={name:'Old'};wpA(A);ok(A.wp.length==WP.length,'gun progress grows to every gun');const full=gEnc(S.ac).split('_'),B={};ok(gDec(full.slice(0,17).join('_'),B)&&B.wp.length==WP.length&&B.wp[17].l==1,'an account code from before the Bubble Cannon still loads')}
CPR={v:1,w:3,k:0,gm:'f',m:0,ci:0,d:1,p:{cash:10,hp:5,mx:5,ar:0,own:[0,16],cur:16,mg:[18,45,6,30,1,8,30,40,100,8,120,10,3,6,1,10,1],am:{pa:0,ri:0,sh:0,rk:9,bl:0,ar:0},paid:{}}};setGM('f');mapId=0;sel=0;start();CPR=null;
ok(P.mg.length==WP.length&&P.mg[BC]==4&&P.am.rk==9,'a checkpoint saved before the Bubble Cannon resumes with its magazine ready');
armory(BC);ok(ui.innerHTML.includes('Bubble Cannon'),'the armory lists it with levels and camos');
ok(!ERRS.length,'no game errors: '+ERRS.join(' | '));
}
console.log('TOTAL errors',errs.length,errs);`;
new Function("docL","ivs","errs","started_",out)(docL,ivs,errs);
