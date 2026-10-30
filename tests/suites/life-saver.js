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
// Life Saver: tables, sprites, store, 3 rockets a heart, 3 s reload, hearts bouncing off a wall back to the shooter,
// healing a friend (and reviving one who is down) in split screen, GAME BALANCE rows, older saves, codes and checkpoints
const out=code+`;S.ac.cp=8;S.tut=1;S.ac.name='Tester';docL.pointerdown[0]();endIntro();
{// (a block, so test names never clash with the game's globals)
const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+m);if(!c)errs.push(m)};
const tick=(n)=>{for(let i=0;i<n;i++){AT_+=.016;NOW_+=16;for(const f of ivs)f();for(let q=TQ.length-1;q>=0;q--)if(TQ[q][0]<=AT_){const g=TQ[q][1];TQ.splice(q,1);g()}loop(NOW_)}};
const secs=s=>tick(Math.round(s/.016));
const LS=WP.findIndex(w=>w.n=='Life Saver');
// ---------- tables ----------
ok(LS==16&&WP.length>=17,'the Life Saver is gun 17 (the older guns keep their numbers)');
ok(AMT[LS]=='rk'&&WP[LS].apr==3&&MAG[LS]==1&&RLT[LS]==3,'it uses rockets, 3 for every heart, one heart a magazine and a 3 s reload');
ok(WP[LS].cost==1200&&WP[LS].hl==2&&WP[LS].d==0,'\\$1200; each heart heals 2 and never hurts zombies');
ok([RLS,RLT,MAG,AMT,MZ,FS,FSN].every(a=>a.length==WP.length),'every per-gun table has an entry for every gun');
ok(['lifesaver','rlls','lsbounce','lsheal'].every(n=>typeof SF[n]=='function'),'fire, reload, bounce and heal sounds exist');
ok(MAG.slice(0,16).join()=='18,45,6,30,1,8,30,40,100,8,120,10,3,6,1,10'&&WP[14].cost==2500&&WP[15].d==5&&AMI.rk.max==36,'older guns and ammo keep their values');
// ---------- sprites ----------
ok(Object.keys(PS).every(k=>PS[k].gun.length==WP.length&&PS[k].gun[16][2]==80&&PS[k].gun[16][3]==32&&PS[k].gun[16][1]>=1863),'every survivor holds a Life Saver (80x32 frames below the old sheet)');
ok(JSON.stringify(PS[0].gun[13])=='[0,1698,80,32,6,14]'&&JSON.stringify(PS[0].gun[0])=='[490,0,80,32,6,14]','older gun frames did not move');
ok(ZS.heart&&JSON.stringify(ZS.heart.fly[0])=='[580,1641,18,16]'&&JSON.stringify(ZS.fbolt.fly[1])=='[549,1641,30,14]','the heart frame sits next to the old frames');
// ---------- store ----------
setGM('f');mapId=0;sel=0;S.dlf=1;start();P.cash=100000;P.am.rk=0;shop();
ok(/data-gun=16[^>]*><\\/canvas>Life Saver<small>\\$1200</.test(ui.innerHTML),'the store sells the Life Saver with its picture');
let c0=P.cash;buy(LS);ok(c0-P.cash==1200&&P.mg[LS]==1&&P.am.rk==6&&amTxt(P,LS)=='1 / 2','bought for \\$1200: 1 heart loaded + 6 rockets (2 more hearts)');
// ---------- a wall in front: the heart bounces back and heals the shooter ----------
nextWave();toSp=0;P.mx=10;P.inv=1e9;
let KP=mk(0,30,30);KP.hp=1e9;KP.spm=1e-6;
const clr=()=>{zs=[KP];bs=[];DR=[];ckClear();for(const p of PL)p.dd=0};
const fireOn=()=>{inp=()=>({mx:0,my:0,fire:true})},fireOff=()=>{inp=()=>({mx:0,my:0,fire:false})},shoot=()=>{fireOn();tick(1);fireOff()};
let W0=null;for(const w of WL){if(w[4]==2||w[3]<70||w[0]<200)continue;const y=w[1]+w[3]/2,p={x:w[0]-120,y:y+10};if(lsWall(p.x,p.y)||lsWall(p.x,p.y-10)||!los({x:p.x,y:p.y-10},{x:w[0]-3,y:p.y-10}))continue;if(WL.some(v=>v!==w&&v[4]!=2&&v[0]<p.x+20&&v[0]+v[2]>p.x-20&&v[1]<p.y+20&&v[1]+v[3]>p.y-30))continue;W0={w,p};break}
ok(W0,'found a wall to shoot at');
const face=()=>{P.x=W0.p.x;P.y=W0.p.y;P.a=0;P.cur=LS;P.cds[LS]=0;P.rl=0;P.mg[LS]=1};
clr();face();P.hp=3;let x0=wpA(S.ac)[LS].x,l0=wpA(S.ac)[LS].l;FT=[];shoot();tick(4);
ok(LSH.length==1&&P.hp==3,'the heart leaves the gun without healing the shooter');
for(let i=0;i<150&&LSH.length;i++)tick(1);
ok(P.hp==5&&FT.some(f=>f.t=='+2 ♥'),'it bounced off the wall and came back: +2 health ('+P.hp+')');
ok(wpA(S.ac)[LS].x>x0||wpA(S.ac)[LS].l>l0,'healing gives the Life Saver weapon XP');
ok(P.mg[LS]==0&&P.rl>0&&Math.abs(P.rlT-3)<1e-9,'one heart empties the magazine and a 3 s reload starts');
{const r=P.rl;secs(r-.2);ok(P.mg[LS]==0,'still reloading just before the 3 s are up');secs(.4)}ok(P.mg[LS]==1&&P.am.rk==3,'loaded after 3 s, using 3 rockets ('+P.am.rk+' left)');
// it passes through zombies and does not hurt them
clr();face();P.hp=3;const Z=mk(0,P.x+60,P.y-10);Z.hp=Z.m0=10;Z.fz=1e9;zs.push(Z);shoot();for(let i=0;i<150&&LSH.length;i++)tick(1);
ok(Z.hp==10&&P.hp==5,'it flies through a zombie without hurting it and still heals');
// full health: nothing to heal
clr();face();P.hp=P.mx;x0=wpA(S.ac)[LS].x;l0=wpA(S.ac)[LS].l;FT=[];shoot();for(let i=0;i<150&&LSH.length;i++)tick(1);
ok(P.hp==P.mx&&FT.some(f=>f.t=='FULL')&&wpA(S.ac)[LS].x==x0&&wpA(S.ac)[LS].l==l0,'at full health it shows FULL and gives no XP');
// two rockets are not enough for a heart
P.mg[LS]=0;P.am.rk=2;P.rl=0;ok(!amRel(P)&&amTxt(P,LS)=='0 / 0','2 rockets are not enough for a heart');
// a heart never flies longer than its time
clr();P.x=W0.p.x;P.y=W0.p.y;P.a=Math.PI/2;P.cur=LS;P.mg[LS]=1;P.cds[LS]=0;shoot();secs(WP[LS].ll+.1);ok(!LSH.length,'a heart is gone after '+WP[LS].ll+' s');
// drawing hearts in flight
clr();face();shoot();tick(3);drawW();hud();ok(!ERRS.length&&LSH.length,'drawing hearts works (errors: '+ERRS.join(' | ')+')');
// ---------- split screen: heal a friend, revive a friend who is down ----------
{const inp0=inp;LBY={s:[{ci:0,ac:S.ac,inp:'km',v:0,rdy:1},{ci:3,ac:'G',inp:0,v:0,rdy:1}]};mapId=0;startMP();toSp=0;clr();KP.hp=1e9;zs=[KP];
 const [A,B]=PL;for(const p of PL){p.inv=1e9;p.own.push(LS);p.am.rk=30}
 const go=(p)=>{p.cur=LS;p.cds[LS]=0;p.mg[LS]=1;p.rl=0;inp=q=>({mx:0,my:0,fire:q===p});tick(1);inp=()=>({mx:0,my:0,fire:false})};
 const line=()=>{A.x=W0.p.x-200;A.y=W0.p.y;A.a=0;B.x=A.x+100;B.y=A.y};
 line();A.hp=2;B.hp=1;x0=wpA(S.ac)[LS].x;l0=wpA(S.ac)[LS].l;go(A);for(let i=0;i<60&&LSH.length;i++)tick(1);
 ok(B.hp==3&&A.hp==2,'player 1 heals player 2 with a heart (+2)');ok(wpA(S.ac)[LS].x>x0||wpA(S.ac)[LS].l>l0,'healing a friend gives weapon XP');
 line();B.dn=1;B.hp=0;B.inv=1e9;go(A);for(let i=0;i<60&&LSH.length;i++)tick(1);
 ok(!B.dn&&B.hp>=2&&B.inv<=2,'a heart revives a friend who is down ('+B.hp+' health)');
 line();B.dead=1;const bh=B.hp;go(A);for(let i=0;i<10;i++)tick(1);ok(LSH.length==1||A.hp>2,'a heart flies past a player who is out');B.dead=0;secs(3);
 line();A.a=Math.PI;B.x=A.x-100;B.hp=1;A.hp=2;go(A);for(let i=0;i<60&&LSH.length;i++)tick(1);ok(B.hp==3,'it heals whichever friend it reaches');
 inp=inp0;mode='shop';shop();ok(ui.innerHTML.split('Life Saver').length>=3,'the split-screen shop sells the Life Saver to each player');
 ok(!ERRS.length,'no errors in split screen: '+ERRS.join(' | '))}
// ---------- GAME BALANCE ----------
devSet();balOpen('guns');const sec=ui.innerHTML.slice(ui.innerHTML.indexOf('Life Saver'));
ok(/Health each heart heals.*Reload seconds.*Rockets per heart.*Heart speed.*Most wall bounces.*Seconds a heart flies/s.test(sec)&&!/Life Saver[^<]*<\\/h4>.{0,400}>Damage</s.test(sec),'Guns tab: Life Saver rows (and no Damage row: hearts never hurt)');
const idx=lab=>BALR.findIndex(e=>e.g=='guns'&&e.sub.startsWith('Life Saver')&&e.lab==lab);
balSet(idx('Health each heart heals'),4);balSet(idx('Rockets per heart'),1);ok(WP[LS].hl==4&&WP[LS].apr==1,'sliders change the gun');
setGM('f');mapId=0;start();nextWave();toSp=0;P.mx=10;P.inv=1e9;KP=mk(0,30,30);KP.hp=1e9;KP.spm=1e-6;clr();P.own.push(LS);P.am.rk=5;
face();P.hp=2;shoot();for(let i=0;i<150&&LSH.length;i++)tick(1);ok(P.hp==6,'a heart now heals 4');ok(amRes(P,LS)==5,'and costs 1 rocket');
balSet(idx('Most wall bounces'),0);face();P.hp=2;shoot();for(let i=0;i<150&&LSH.length;i++)tick(1);ok(P.hp==2,'with no bounces the heart stops at the wall');
devOff();ok(WP[LS].hl==2&&WP[LS].apr==3&&WP[LS].lb==3,'test mode off puts the defaults back');devSet();balOpen('guns');balReset(0);devOff();
// ---------- older progress keeps working ----------
{const A={name:'Old'};wpA(A);ok(A.wp.length==WP.length,'gun progress grows to every gun');const full=gEnc(S.ac).split('_'),B={};ok(gDec(full.slice(0,16).join('_'),B)&&B.wp.length==WP.length&&B.wp[16].l==1,'an account code from before the Life Saver still loads')}
CPR={v:1,w:3,k:0,gm:'f',m:0,ci:0,d:1,p:{cash:10,hp:5,mx:5,ar:0,own:[0,14],cur:14,mg:[18,45,6,30,1,8,30,40,100,8,120,10,3,6,1,10],am:{pa:0,ri:0,sh:0,rk:9,bl:0,ar:0},paid:{}}};setGM('f');mapId=0;sel=0;start();CPR=null;
ok(P.mg.length==WP.length&&P.mg[LS]==1&&P.am.rk==9,'a checkpoint saved before the Life Saver resumes with its magazine ready');
armory(LS);ok(ui.innerHTML.includes('Life Saver'),'the armory lists it with levels and camos');
ok(!ERRS.length,'no game errors: '+ERRS.join(' | '));
}
console.log('TOTAL errors',errs.length,errs);`;
new Function("docL","ivs","errs","started_",out)(docL,ivs,errs);
