// Ken, the welder of the Black Iron Foundry (map 16): his sprites, his wave-20 fight (MIG lightning that stays joined to the torch,
// half a survivor shotgun's reach, black marks where it hits, three bolts at a time from half health), recruiting him, playing
// as him, his place in the campaign and the custom campaign, and the GAME BALANCE menu.
const fs=require('fs');const html=fs.readFileSync(process.argv[2],'utf8');
const code=html.slice(html.lastIndexOf('<script>')+8,html.lastIndexOf('</script>'));
global.ImageData=class{constructor(d,w,h){this.data=d}};
const ctx=new Proxy({},{get:(t,k)=>k=='getImageData'?(x,y,w,h)=>({data:new Uint8ClampedArray(w*h*4).fill(120)}):k=='measureText'?()=>({width:30}):()=>{},set:()=>true});
const mkEl=()=>({style:{setProperty(){}},dataset:{},innerHTML:'',className:'',getContext:()=>ctx,addEventListener(){},remove(){},width:0,height:0,querySelector:()=>null,querySelectorAll:()=>[]});
const els={};const docL={};global.document={hidden:false,getElementById:id=>els[id]||(els[id]=mkEl()),createElement:()=>mkEl(),addEventListener(e,f){(docL[e]=docL[e]||[]).push(f)}};
global.innerWidth=+process.argv[3]||390;global.innerHeight=+process.argv[4]||800;global.addEventListener=()=>{};global.localStorage={};global.requestAnimationFrame=()=>{};
global.Image=class{constructor(){this.complete=true;this.naturalWidth=1}addEventListener(){}};global.NOW_=0;global.performance={now:()=>global.NOW_};
// mock web audio (records which sounds were asked for)
global.started=0;let nodes=0,errs=[];const P_=()=>({value:0,setValueAtTime(v,t){if(!isFinite(v)||!isFinite(t))errs.push('nonfinite set '+v+' '+t)},linearRampToValueAtTime(v,t){if(!isFinite(v)||!isFinite(t))errs.push('nf lin')},exponentialRampToValueAtTime(v,t){if(!(v>0)||!isFinite(t))errs.push('bad exp '+v)},setTargetAtTime(){}});
const node=()=>{nodes++;return{connect(){},disconnect(){},start(){global.started++},stop(){},frequency:P_(),gain:P_(),detune:P_(),Q:P_(),pan:P_(),threshold:P_(),ratio:P_(),type:'',setPeriodicWave(){},buffer:null,loop:false}};
global.AT_=0;global.AudioContext=class{constructor(){this.state='running';this.sampleRate=8000;this.destination={}}get currentTime(){return global.AT_}createGain(){return node()}createOscillator(){return node()}createBiquadFilter(){return node()}createBufferSource(){return node()}createStereoPanner(){return node()}createDynamicsCompressor(){return node()}createPeriodicWave(){return{}}createBuffer(c,n){return{getChannelData:()=>new Float32Array(n)}}resume(){}};
const ivs=[];global.setInterval=(f)=>{ivs.push(f)};global.TQ=[];global.setTimeout=(f,ms)=>{TQ.push([global.AT_+ms/1000,f])};
const test=`;S.tut=1;S.ac.bp=WP.map((_,i)=>i).filter(i=>WP[i].tr>0);S.ac.bpv=1;docL.pointerdown[0]();endIntro();
const tick=(n)=>{for(let i=0;i<n;i++){AT_+=.016;NOW_+=16;for(const f of ivs)f();for(let q=TQ.length-1;q>=0;q--)if(TQ[q][0]<=AT_){const g=TQ[q][1];TQ.splice(q,1);g()}loop(NOW_)}};
let n=0,fails=0;const ok=(c,m)=>{n++;if(!c)fails++;LOG((c?'PASS ':'FAIL ')+m)};
const SND=[];{const f=sfx;sfx=function(k){SND.push(k);return f.apply(this,arguments)}}
const A=S.ac;A.name='T';A.tut=1;S.df=0;
// ---------- data ----------
const K=CH[17];
ok(CH.length>=18&&K.n=='Ken'&&K.hp==8&&K.sp==.9&&K.w==2&&K.cost==0,'Ken is survivor 18: 8 health, 90% speed, a shotgun to start with');
ok(K.lv&&K.lv.includes(2)&&K.lc&&K.lc.g&&K.lc.c&&K.lc.f.length==3&&K.lzn=='electric bolts','his shotgun fires electric bolts (blue-white, like the Robot\\'s and Steve\\'s laser bolts)');
ok(CHD[17]&&/welder/.test(CHD[17])&&SPK[17]&&SPK[17].n=='Welding Leathers'&&TT[17].length==5&&SCH[17].length==5&&RCS[17],'he has a description, a mastery perk, titles, challenges and colour variants');
ok(UNM[17]===16&&MUN[16]===17&&ccBossOf(16)===17,'he holds out on the Black Iron Foundry (map 16)');
ok(CCBOSS.includes(17)&&!CCNOT[17]&&CCBOSS.indexOf(17)==CCBOSS.indexOf(11)+1,'his fight works on any map: custom campaign maps can have him (after the Horseman, in campaign order)');
ok(ccRepOK(16),'and a custom map can now stand in for the foundry in the campaign');
{const D=SVS[17],sg=(SVS[2].sv||340)*(SVS[2].sr||1.4);ok(D&&D.hp==640&&D.sp==84&&D.w=='mig'&&D.br*2==Math.round(sg)&&D.bv==520&&D.cd==1.3,'boss stats: 640 health, speed 84, bolts reach '+D.br+' px, half a survivor shotgun blast ('+Math.round(sg)+' px)')}
// ---------- sprites ----------
{const Q=PS[17];ok(Q&&Q.walk.length==6&&Q.idle.length==4&&Q.gun.length==WP.length&&Q.mig,'his frames: 6 walking, 4 standing, every gun, and his MIG welding gun');
 const all=[];for(const k in PS)for(const a of['walk','idle','gun','mig'])for(const f of(a=='mig'?(PS[k].mig?[PS[k].mig]:[]):PS[k][a]))all.push([k,a,f]);
 const kn=all.filter(e=>e[0]=='17');ok(kn.every(e=>e[2][1]>=2061&&e[2][0]+e[2][2]<=1024&&e[2][1]+e[2][3]<=2158),'they sit below the old sheet (from y 2061)');
 let ov=0;for(const a of kn)for(const b of all){if(a===b)continue;const f=a[2],g=b[2];if(f[0]<g[0]+g[2]&&g[0]<f[0]+f[2]&&f[1]<g[1]+g[3]&&g[1]<f[1]+f[3])ov++}ok(!ov,'no frame overlaps another');
 ok(JSON.stringify(PS[0].gun[0])=='[490,0,80,32,6,14]'&&JSON.stringify(PS[16].walk[0])=='[405,1501,48,64,24,24]'&&JSON.stringify(PS[0].gun[18])=='[0,1995,80,32,6,14]','older frames did not move');
 ok(Q.walk.concat(Q.idle).every((f,i)=>f[2]==48&&f[3]==64&&f[4]==24&&f[5]==PS[0][i<6?'walk':'idle'][i<6?i:i-6][5])&&Q.gun.every(f=>f[2]==80&&f[3]==32&&f[4]==6&&f[5]==14),'same size and hand positions as every other survivor')}
// ---------- the wave-20 fight ----------
A.un=[0];A.cp=CORD.length;A.bm=[0,1,2].map(()=>CORD.reduce((v,m)=>m==16?v:v|1<<m,0));setGM('c');mapId=16;S.mp=16;sel=0;start();
ok(mapId===16&&mode!='menu','a campaign run on the foundry');
P.mx=10;P.hp=1e6;wave=19;zs=[];toSp=0;ep=[];nextWave();const z=zs.find(q=>ZT[q.t].sv);const k=BMP();
ok(z&&z.ci==17&&toSp==0&&zs.length==1,'wave 20: Ken comes, alone');
ok(z&&z.bn=='KEN'&&Math.round(z.mh/k)==640,'his health bar says KEN (640 health)');
ok(/KEN WILL NOT GO DOWN EASY/.test(nzn)&&SVB==1,'"KEN WILL NOT GO DOWN EASY" on the final-wave banner');
// a clear straight line of a given length from a point
// clear along the path a bolt really takes (it leaves the gun 8.6 px above Ken's x,y), with a few px either side
const clr=(x,y,a,L)=>{for(let s=0;s<=L;s+=4)for(const o of[0,-4,-8.6,-13]){const px=x+Math.cos(a)*s,py=y+o+Math.sin(a)*s;if(px<30||py<30||px>WW-30||py>WH-30||knInW(px,py))return 0}return 1};
const spot=(need)=>{for(let i=0;i<20000;i++){const x=60+Math.random()*(WW-120),y=60+Math.random()*(WH-120),a=Math.random()*6.283;if(svOK(x,y)&&need(x,y,a))return{x,y,a}}return null};
// he walks up and zaps
{const p=spot((x,y,a)=>clr(x,y,a,420));z.x=p.x;z.y=p.y;P.x=p.x+Math.cos(p.a)*400;P.y=p.y+Math.sin(p.a)*400;z.cd=0;
 let d0=Math.hypot(P.x-z.x,P.y-z.y),zap=0,dmin=d0,warn=0,shots=0;for(let f=0;f<600&&!zap;f++){P.hp=1e6;P.inv=0;if(z.kc>0)warn=1;tick(1);dmin=Math.min(dmin,Math.hypot(P.x-z.x,P.y-z.y));if(ep.some(q=>q.lb))zap=Math.hypot(P.x-z.x,P.y-z.y)}
 ok(zap&&zap<=SVS[17].br+30&&dmin<d0-100,'he closes in before zapping (zapped from '+Math.round(zap)+' px, was '+Math.round(d0)+' px away)');
 ok(warn&&SND.includes('kcharge')&&SND.includes('kzap'),'the torch crackles first (a warning), then the zap')}
// a bolt: stays joined to the torch, flies half a shotgun's reach, leaves a black mark where it stops
{ep=[];KSC=[];const p=spot((x,y,a)=>clr(x,y,a,330));z.x=p.x;z.y=p.y;z.fa=p.a;z.cd=99;z.kc=0;P.x=p.x-Math.cos(p.a)*600;P.y=p.y-Math.sin(p.a)*600;if(!svOK(P.x,P.y)){P.x=p.x+Math.cos(p.a+1.6)*500;P.y=p.y+Math.sin(p.a+1.6)*500}
 knFire(z,p.a);const b=ep.filter(q=>q.lb);ok(b.length==1&&b[0].k==5&&b[0].o===z,'one bolt a zap before half health; it belongs to Ken (an ordinary survivor-boss bullet underneath)');
 const B=b[0],x0=B.x,y0=B.y;let joined=1,last=null,err='';for(let f=0;f<60&&ep.includes(B);f++){z.cd=99;z.kc=0;const T=knTip(z,z.fa);try{svBul(B)}catch(e){err=e.message}if(Math.hypot(B.sx-T.x,B.sy-T.y)>.01)joined=0;last={x:B.x,y:B.y};tick(1)}
 ok(!err&&joined,'while it flies it is drawn from the torch tip, wherever Ken is pointing it '+err);
 const L=Math.hypot(last.x-x0,last.y-y0);ok(!ep.includes(B)&&Math.abs(L-SVS[17].br)<14,'it stops after '+Math.round(L)+' px: half a survivor shotgun blast');
 const m=KSC[KSC.length-1];ok(KSC.length==1&&m&&Math.hypot(m.x-last.x,m.y-10-last.y)<12&&m.B.length>=20,'a black burn mark is left on the ground where it stopped');
 ok(SND.includes('khit')&&KFL.length>0,'with a snap and a flash')}
// into a wall: the mark stays on the floor in front of it
{ep=[];KSC=[];let p=null;for(let i=0;i<20000&&!p;i++){const x=60+Math.random()*(WW-120),y=60+Math.random()*(WH-120),a=Math.random()*6.283;if(!svOK(x,y))continue;let h=0;for(let s=20;s<=150;s+=4)if(knInW(x+Math.cos(a)*s,y-8.6+Math.sin(a)*s)){h=s;break}if(h>60&&clr(x,y,a,h-12))p={x,y,a,h}}
 z.x=p.x;z.y=p.y;z.fa=p.a;z.cd=99;P.x=p.x-Math.cos(p.a)*500;P.y=p.y-Math.sin(p.a)*500;knFire(z,p.a);const B=ep.find(q=>q.lb);let f=0;for(;f<60&&ep.includes(B);f++){z.cd=99;z.kc=0;tick(1)}
 const m=KSC[0];ok(m&&!knInW(m.x,m.y)&&f*.016*SVS[17].bv<p.h+30,'a bolt that hits a wall stops there ('+Math.round(p.h)+' px), its mark on the floor in front')}
// into the player
{ep=[];KSC=[];const p=spot((x,y,a)=>clr(x,y,a,200));z.x=p.x;z.y=p.y;z.fa=p.a;z.cd=99;P.x=p.x+Math.cos(p.a)*120;P.y=p.y-8.6+Math.sin(p.a)*120;P.hp=50;P.mx=50;P.inv=0;
 knFire(z,p.a);let f=0;for(;f<40&&ep.some(q=>q.lb);f++){z.cd=99;z.kc=0;z.x=p.x;z.y=p.y;tick(1)}const m=KSC[0];
 ok(P.hp==49,'a bolt that reaches the player hurts (1 health: 50 -> '+P.hp+')');ok(m&&Math.abs(m.x-P.x)<20&&m.y>P.y,'and burns a mark at their feet');ok(FT.some(t=>t.t=='ZAP!'),'"ZAP!"');P.hp=1e6}
// the whole bolt hurts, not just its head (aimed straight right, so "above" and "below" the bolt are easy to place)
{const fresh=()=>{ep=[];KSC=[];FT=[];P.hp=50;P.mx=50;P.inv=0};const p=spot((x,y,a)=>[-50,0,50].every(o=>clr(x,y+o,0,260)));const hold=a=>{z.cd=99;z.kc=0;z.x=p.x;z.y=p.y;z.fa=a};const T=knTip(z,0);
 // a player just below the bolt's path: the head flies past them; then Ken swings the torch down across them
 fresh();hold(0);P.x=p.x+90;P.y=knTip(z,0).y+30;knFire(z,0);const B=ep.find(q=>q.lb);for(let f=0;f<14;f++){hold(0);tick(1)}
 ok(P.hp==50&&ep.includes(B)&&B.x>P.x+20,'the head of a bolt flies past a player just off its path without hitting them');
 let f=0,a=0;for(;f<14&&ep.includes(B);f++){a=Math.min(.7,a+.06);hold(a);tick(1)}ok(P.hp==49&&!ep.includes(B),'when Ken swings the bolt down across them they are hit ('+f+' frames into the swing)');
 const m=KSC[KSC.length-1];ok(m&&Math.abs(m.x-P.x)<14&&m.y>P.y,'and the bolt ends at them, with its burn mark at their feet');
 // the bolt crossing the player's head, well above the old hit point at their middle
 fresh();hold(0);P.x=p.x+140;P.y=knTip(z,0).y+18;knFire(z,0);for(let f=0;f<30&&ep.some(q=>q.lb);f++){hold(0);tick(1)}ok(P.hp==49,'a bolt that crosses the player\\'s head hits (the old check only looked at a point by their middle)');
 // a near miss still misses
 fresh();hold(0);P.x=p.x+140;P.y=knTip(z,0).y+30;knFire(z,0);for(let f=0;f<40&&ep.some(q=>q.lb);f++){hold(0);tick(1)}ok(P.hp==50,'a bolt that passes clear of the player misses');
 P.hp=1e6}
// half health: overcharged, three bolts at once
{ep=[];hurt(z,z.hp-z.mh*.48,0,0);z.iv=0;tick(1);ok(z.oc==1&&z.bn=='KEN · OVERCHARGED'&&FT.some(t=>/CRANKS UP THE AMPS/.test(t.t))&&SND.includes('kover'),'at half health he is overcharged: "KEN CRANKS UP THE AMPS!", his bar says OVERCHARGED');
 ep=[];z.cd=99;knFire(z,0);const b=ep.filter(q=>q.lb),an=b.map(q=>Math.atan2(q.vy,q.vx)).sort((a,c)=>a-c);ok(b.length==3&&an[2]-an[0]>.5&&an[2]-an[0]<.7,'then every zap is three bolts at once, fanned out ('+(an[2]-an[0]).toFixed(2)+' rad)');
 ok(Math.abs(z.cd-SVS[17].cd*SVS[17].c3)<1e-9,'with a slightly longer gap between zaps');
 const p=spot((x,y,a)=>clr(x,y,a,420));z.x=p.x;z.y=p.y;P.x=p.x+Math.cos(p.a)*200;P.y=p.y+Math.sin(p.a)*200;ep=[];z.cd=0;let most=0;for(let f=0;f<500;f++){P.hp=1e6;P.inv=0;tick(1);most=Math.max(most,ep.filter(q=>q.lb).length)}ok(most>=3,'in the fight too: '+most+' bolts in the air at once')}
// the rest of the fight draws (bar, bolts, marks, charge, aura) without trouble
{let err='';try{for(let f=0;f<120;f++){P.hp=1e6;tick(1)}}catch(e){err=e.message}ok(!err&&(mode=='play'&&!BRK),'the fight runs and draws '+err)}
// beaten: he kneels, gives up and joins
{z.iv=0;hurt(z,z.hp+1,0,0);tick(2);ok(KN&&KN.ci==17&&!zs.includes(z)&&!ep.some(q=>q.lb),'beaten, Ken kneels instead of popping (his bolts go out)');
 ok(A.un.includes(17)&&bBt(A,DIF(),16),'he joins the survivors and the foundry counts as beaten');tick(Math.ceil(5.7/.016));
 ok(mode=='over'&&ui.innerHTML.includes('BLACK IRON FOUNDRY COMPLETE')&&ui.innerHTML.includes('joined your survivors'),'map-complete screen: Ken joined your survivors')}
// ---------- the campaign texts ----------
ok(/Ken/.test(cMunT(16)),'the campaign map names Ken as the foundry\\'s wave-20 boss: '+cMunT(16).replace(/<[^>]+>/g,''));
{const L0=LBY;let h='';try{LBY={s:[{inp:'km',ac:'G',ci:0,rdy:0}]};GMD='c';mapId=16;S.mp=16;rL();h=String(ui.innerHTML||'')}catch(e){h='ERR '+e.message}LBY=L0;ok(/wave 20 boss: Ken/.test(h),'the split-screen lobby says the wave 20 boss is Ken')}
// an old save that had already won the foundry (before anyone held out there) keeps it, and can still win Ken by playing it again
{const O={name:'Old',lv:1,xp:0,sp:0,sk:{},pts:0,un:[0,2,3,1,9,4,10,11],cp:CORD.length,bm:[0,1,2].map(()=>CORD.reduce((v,m)=>v|1<<m,0))};ok(bBt(O,0,16)&&mOpen(O,0,16)&&!O.un.includes(17),'an old save that cleared the foundry with no survivor there keeps it beaten; Ken waits there to be won')
 const c=dec(enc(Object.assign({},A,{un:[0,17]})));ok(c&&c.un.includes(17),'account codes keep Ken')}
// ---------- the survivor select and mastery ----------
{const A2=S.ac;A2.un=[0];let h=sDet(17);ok(/Ken/.test(h)&&/electric bolts/.test(h)&&/Welding Leathers/.test(h)&&/Black Iron Foundry/.test(h),'survivor select: Ken locked, won on the Black Iron Foundry; electric bolts; his perk');
 A2.un=[0,17];h=sAct(17);ok(/start\\(\\)/.test(h),'once he joins he can be picked');let err='';try{mastery(17)}catch(e){err=e.message}ok(!err&&/Welding Leathers/.test(ui.innerHTML)&&/Hood Down, Arc On/.test(ui.innerHTML),'his mastery page '+err)}
// ---------- playing as Ken ----------
setGM('f');mapId=16;S.mp=16;sel=17;start();
ok(P.ci==17&&P.cur==2&&P.mx==CH[17].hp,'playing as Ken: 8 health and a shotgun');
{zs=[];toSp=0;let fired=0;for(let f=0;f<90&&!fired;f++){mouse.d=1;mouse.x=P.x+200;mouse.y=P.y;tick(1);if(bs.some(b=>b.lv&&b.o===P))fired=1}mouse.d=0;
 ok(fired&&bs.filter(b=>b.lv).every(b=>b.lv===CH[17].lc),'his shotgun pellets fly as electric bolts');ok(SND.includes('kspark'),'with a crackle on every blast')}
// Welding Leathers (mastery level 3): acid and fire on the ground don't hurt him, and he doesn't catch fire
{zs=[];toSp=5;spT=1e9;msA(S.ac)[17].l=3;ok(sPk(P,17),'mastery level 3 unlocks Welding Leathers');P.mx=8;P.hp=8;P.inv=0;pd=[{x:P.x,y:P.y+8,l:9,m:9}];fr=[{x:P.x,y:P.y+8,l:9,m:9}];for(let f=0;f<180;f++){P.inv=0;spT=1e9;tick(1)}
 ok(mode=='play'&&P.hp==8&&!(P.bn>0),'standing in acid and fire for 3 s: no harm, not burning');P.hp=8;ep=[{x:P.x,y:P.y,vx:0,vy:0,l:1,k:3}];spT=1e9;tick(1);ok(!(P.bn>0),'a fireball doesn\\'t set him alight');
 msA(S.ac)[17].l=1;P.hp=8;P.inv=0;pd=[{x:P.x,y:P.y+8,l:9,m:9}];fr=[];for(let f=0;f<180;f++){P.inv=0;spT=1e9;tick(1)}ok(mode=='play'&&P.hp<8,'without the perk acid hurts him like anyone');pd=[];fr=[]}
// ---------- his fight on another map (the custom campaign can put him anywhere) ----------
{const m0=MUN[0];MUN[0]=17;setGM('c');mapId=0;S.mp=0;sel=0;start();P.mx=10;P.hp=1e6;wave=19;zs=[];toSp=0;ep=[];nextWave();const z2=zs.find(q=>ZT[q.t].sv);let zap=0,err='';
 try{for(let f=0;f<1500&&!zap;f++){P.hp=1e6;P.inv=0;P.x+=Math.sin(f/40)*1.2;tick(1);if(ep.some(q=>q.lb))zap=1}}catch(e){err=e.message}MUN[0]=m0;
 ok(z2&&z2.ci==17&&zap&&!err,'on the Suburb he finds the player and zaps too '+err);zs=[];ep=[]}
// a custom campaign slot keeps him as its boss
{const O=ccClean({slots:{'2:4':{id:'k1',b:17,n:'Welding Shop'}}});ok(O.slots['2:4']&&O.slots['2:4'].b==17,'a custom campaign slot can have Ken as its wave-20 boss')}
// ---------- split screen ----------
{const B2={name:'B',xp:0,lv:1,sp:0,sk:{},pts:0,un:[0],cp:CORD.length,bm:[0,1,2].map(()=>CORD.reduce((v,m)=>v|1<<m,0))};S.prof=[B2];setGM('c');LBY={s:[{inp:'km',ac:S.ac,ci:0,v:0,rdy:1},{inp:0,ac:B2,ci:0,v:1,rdy:1}]};mapId=16;S.mp=16;startMP();
 wave=19;zs=[];toSp=0;for(const p of PL){p.mx=10;p.hp=1e6}nextWave();const z3=zs.find(q=>ZT[q.t].sv);let zap=0,err='';try{for(let f=0;f<1500&&!zap;f++){for(const p of PL){p.hp=1e6;p.inv=0}tick(1);if(ep.some(q=>q.lb))zap=1}}catch(e){err=e.message}
 ok(MPn==2&&z3&&z3.ci==17&&zap&&!err,'split screen: Ken fights two players '+err);z3.iv=0;hurt(z3,z3.hp+1,0,0);tick(2);ok(B2.un.includes(17)&&S.ac.un.includes(17),'and joins both of them');MPn=0;S.prof=[]}
// ---------- GAME BALANCE ----------
{balInit();const id=['hS17','sS17','hP17','sP17','knR','knV','knC','knT','knW'];ok(new Set(BALR.map(e=>e.id)).size==BALR.length,'every GAME BALANCE id is still unique');ok(id.every(i=>BALM[i]),'GAME BALANCE has his boss health and speed, his health and speed as a player, and his lightning (reach, bolt speed, gap, overcharged gap, warning)');
 const D=SVS[17],o=JSON.stringify(D);S.dev=1;const i=BALR.findIndex(e=>e.id=='knR');balSet(i,300);ok(D.br==300,'changing the reach changes his bolts');balSet(i,'');ok(JSON.stringify(D)==o,'and putting it back restores 238');S.dev=0;balApply()}
console.log('TOTAL fails '+fails+' of '+n);
`;
globalThis.LOG=m=>require("fs").writeSync(2,m+"\n");new Function("docL","ivs","errs","started_",code+test)(docL,ivs,errs);
