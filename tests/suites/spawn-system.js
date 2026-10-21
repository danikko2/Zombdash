// Spawn-system tests: node zcT.js game.html [ua]
const fs=require('fs');const html=fs.readFileSync(process.argv[2],'utf8');
const code=html.slice(html.lastIndexOf('<script>')+8,html.lastIndexOf('</script>'));
global.ImageData=class{constructor(d,w,h){this.data=d}};
const ctx=new Proxy({},{get:(t,k)=>k=='getImageData'?(x,y,w,h)=>({data:new Uint8ClampedArray(w*h*4).fill(120)}):k=='measureText'?()=>({width:30}):k=='createRadialGradient'||k=='createLinearGradient'?()=>({addColorStop(){}}):()=>{},set:()=>true});
const mkEl=()=>({style:{setProperty(){}},dataset:{},innerHTML:'',className:'',getContext:()=>ctx,addEventListener(){},remove(){},appendChild(){},width:0,height:0});
const els={};const docL={};global.document={hidden:false,body:mkEl(),getElementById:id=>els[id]||(els[id]=mkEl()),createElement:()=>mkEl(),addEventListener(e,f){(docL[e]=docL[e]||[]).push(f)}};
global.innerWidth=1280;global.innerHeight=800;global.addEventListener=()=>{};global.localStorage={};global.requestAnimationFrame=()=>{};
Object.defineProperty(globalThis,'navigator',{value:{userAgent:process.argv[3]||'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/130',maxTouchPoints:0},configurable:true});
global.Image=class{constructor(){this.complete=true;this.naturalWidth=1}addEventListener(){}};global.NOW_=0;global.performance={now:()=>global.NOW_};
global.started=0;let errs=[];const P_=()=>({value:0,setValueAtTime(){},linearRampToValueAtTime(){},exponentialRampToValueAtTime(){},setTargetAtTime(){}});
const node=()=>({connect(){},disconnect(){},start(){},stop(){},frequency:P_(),gain:P_(),detune:P_(),Q:P_(),pan:P_(),threshold:P_(),ratio:P_(),type:'',setPeriodicWave(){},buffer:null,loop:false});
global.AT_=0;global.AudioContext=class{constructor(){this.state='running';this.sampleRate=8000;this.destination={}}get currentTime(){return global.AT_}createGain(){return node()}createOscillator(){return node()}createBiquadFilter(){return node()}createBufferSource(){return node()}createStereoPanner(){return node()}createDynamicsCompressor(){return node()}createPeriodicWave(){return{}}createBuffer(c,n){return{getChannelData:()=>new Float32Array(n)}}resume(){}};
const ivs=[];global.setInterval=(f)=>{ivs.push(f)};global.TQ=[];global.setTimeout=(f,ms)=>{TQ.push([global.AT_+ms/1000,f])};
const out=code+`;S.ac.cp=8;docL.pointerdown[0]();endIntro();{let F=0,NP=0;const OK=(c,m)=>{if(c)NP++;else{F++;LOG('FAIL '+m)}};const SAY=m=>LOG('  '+m);
S.ac.name='T';setGM('f');mapId=0;sel=0;
const T11={0:[1,'Standard',0],9:[3,'Ranged',0],11:[2,'Ranged',0],3:[2,'Fast',1],1:[1,'Fast',1],14:[3,'Fast',1],2:[1,'Strong',0],4:[2,'Strong',1],10:[1,'Explosive',0],18:[2,'Explosive',1],19:[2,'Healer',1]};
const NM={0:'Walker',9:'Bones',11:'Toxic the Spitter',3:'Dasher',1:'Runner',14:'People Eater',2:'Brute',4:'Splitter',10:'Toxic',18:'Exploder',19:'Healer'};
// ---------- 1. classification ----------
LOG('1. classification');
for(const t in T11){const c=ZC[t],[ti,ca,sp]=T11[t];OK(c&&c.tier===ti&&c.cat.includes(ca)&&!!c.sp==!!sp&&c.n==NM[t]&&(ZT[t].n==null||ZT[t].n==NM[t]),'class '+NM[t]+' '+JSON.stringify(c));OK(!!c.rg==(ca=='Ranged'),'ranged flag '+NM[t])}
OK(Object.keys(ZC).filter(t=>!(t in T11)).join()=='5,20','extra entries are the Splitling and the new Rotwood');OK(ZC[20].tier==3&&ZC[20].cat.includes('Strong')&&ZC[20].sp&&!ZC[20].rg,'Rotwood is tier 3, Strong, special');
OK(Object.keys(ZC).every(t=>!ZT[t].boss&&!ZT[t].sv&&!ZT[t].gh),'no boss / survivor / ghost is classified');
// ---------- 6, 9, 10. schedule ----------
LOG('6/9/10. schedule over 3000 runs');
let bad6=0,bad9=0,bad10=0,tierBad=0,first={};const slots=[3,6,9,12,15,18,21,24,27,31,33];
for(let r=0;r<3000;r++){plan();const v=Object.values(IW).sort((a,b)=>a-b);if(v.join()!=slots.join())bad6++;
 const er=Object.keys(IW).filter(t=>ZC[t].rg&&IW[t]<=20);if(er.length!=1||er[0]!='11')bad9++;if(!(IW[9]>20)||!slots.includes(IW[9]))bad10++;
 const byW=Object.entries(IW).sort((a,b)=>a[1]-b[1]).map(e=>+e[0]),tr=byW.map(t=>ZC[t].tier);for(let i=1;i<tr.length;i++)if(tr[i]<tr[i-1]&&!(byW[i-1]==11||byW[i]==11))tierBad++;first[byW[0]]=(first[byW[0]]||0)+1}
OK(!bad6,'intro waves are exactly '+slots+' (30 is a boss wave so it moves to 31) · bad '+bad6);
OK(!bad9,'exactly one ranged type (Spitter) introduced in waves 1-20 · bad '+bad9);
OK(!bad10,'Bones introduced after wave 20 on a schedule slot · bad '+bad10);
OK(!tierBad,'tier order respected (tier 1 → 2 → 3, Spitter may be pulled forward) · bad '+tierBad);
SAY('first type introduced (wave 3) counts: '+JSON.stringify(Object.fromEntries(Object.entries(first).map(([t,n])=>[ZC[t].n,n]))));
{const k=ZCFG.early.ranged;ZCFG.early.ranged=9;let b=0;for(let r=0;r<500;r++){plan();const er=Object.keys(IW).filter(t=>ZC[t].rg&&IW[t]<=20);if(er.join()!='9'||!(IW[11]>20))b++}ZCFG.early.ranged=k;OK(!b,'config switch: early ranged = Bones keeps Spitter locked until after 20 · bad '+b)}
{const g=GMD;setGM('c');mapId=SEC[1].m[0];const seen={};let b=0;for(let r=0;r<400;r++){plan();const er=Object.keys(IW).filter(t=>ZC[t].rg&&IW[t]<=20);if(er.length!=1)b++;else seen[er[0]]=(seen[er[0]]||0)+1}setGM(g);SAY('campaign early ranged picks: '+JSON.stringify(seen));OK(!b&&seen[9]>100&&seen[11]>100,'campaign: either Bones or the Spitter can be the one ranged type of a level (still only one)')}
{const sv=ZCFG.fixed;ZCFG.fixed=[19,18,1,2,10,3,4,11,14,9];plan();ZCFG.fixed=sv;OK(IW[19]==3&&IW[18]==6&&IW[11]<=20&&IW[9]>20,'fixed order config works: '+JSON.stringify(IW))}
// ---------- helpers for simulated play ----------
const cen=()=>zCen();
const freshRun=(d,mp)=>{S.dlf=d;start();P.hp=P.mx=1e9;NOW_=0;}
let viol={2:0,3:0,4:0,5:0},chk={rg:0,sp:0},seenLocked=[],introOther=[],maxSeen={r:0,s:0},max10={r:0,s:0,d:[0,0,0]};
const frame=(dt)=>{for(const p of PL){p.hp=1e9;p.inv=1}const C0=cen(),ids0=new Set(zs);NOW_+=dt*1000;AT_+=dt;upd(dt);const C1=cen(),d=zDi(),it=zIntro();
 for(const z of zs){if(ids0.has(z)||!ZC[z.t])continue;const ok=zUnl(z.t);if(!ok)seenLocked.push(ZC[z.t].n+'@'+wave);if(it!=null&&z.t!=it&&ZC[z.t].of!=it)introOther.push(ZC[z.t].n+'@'+wave)}
 if(it==null){const W=ZD.tw;chk.rg++;chk.sp++;if(W.r*100>ZCFG.cap.rg[d]*W.n)viol[d==2?3:2]++;if(W.s*100>zCapSp(d)*W.n)viol[d==2?5:4]++}
 if(C1.n>=10&&it==null){const k=ZCFG.cap;max10.r=Math.max(max10.r,C1.r*100/C1.n/k.rg[d]);max10.s=Math.max(max10.s,C1.s*100/C1.n/k.sp[d])}
 if(C1.n&&it==null)maxSeen.r=Math.max(maxSeen.r,C1.r/C1.n),maxSeen.s=Math.max(maxSeen.s,C1.s/C1.n)}
const killSome=(p)=>{for(const z of zs)if(z.hp>0&&(ZC[z.t]?Math.random()<p:Math.random()<p*.15)){P=PL[0];hurt(z,1e6,0,0)}}
const playWave=(w,opt={})=>{wave=w-1;zs=[];nq=[];nextWave();let t=0,stuck=0;while((toSp>0||zs.length||bossQ>=0)&&t<400){frame(1/30);t+=1/30;if(Math.random()<(opt.kp??.05))killSome(opt.ks??.25);if(opt.burst&&Math.random()<.01){for(const z of zs)if(ZC[z.t])hurt(z,1e6,0,0)}}return t}
// ---------- 2-5, 7, 11, 13. long simulated runs on every difficulty ----------
LOG('2-5/7/11/13. simulated play, every difficulty, waves 1-45');
const introN={};let waveT=[],longest=0;
for(const d of[0,1,2]){freshRun(d);plan();for(let w=1;w<=45;w++){const it=zIntro(w);const t=playWave(w,{kp:.06,ks:.3,burst:w%4==0});longest=Math.max(longest,t);if(t>=400)waveT.push(w+'/'+d)}}
OK(!viol[2],'Easy/Normal: the wave never went above 15% ranged ('+chk.rg+' frames checked over 3 difficulties)');
OK(!viol[3],'Hard: the wave never went above 20% ranged');
OK(!viol[4],'Easy/Normal: the wave never went above 35% special');
OK(!viol[5],'Hard: the wave never went above 45% special');
SAY('frames checked: '+chk.rg+' ranged, '+chk.sp+' special · with 10+ zombies alive the highest share was '+(max10.r*100).toFixed(0)+'% of the ranged cap and '+(max10.s*100).toFixed(0)+'% of the special cap');SAY('(on-screen share can now run higher after kills, by design) highest living share: ranged '+(maxSeen.r*100).toFixed(0)+'% special '+(maxSeen.s*100).toFixed(0)+'%');
OK(!introOther.length,'intro waves contained only their type (offspring allowed): '+introOther.slice(0,5));
OK(!seenLocked.length,'no locked type appeared: '+seenLocked.slice(0,5));
OK(!waveT.length,'every wave finished (no deadlock), longest '+longest.toFixed(0)+'s: '+waveT);

LOG('campaign sections');
{const g=GMD;setGM('c');const exp=[[[],[1,1,1,2,2,'r'],25],[[],[1,1,2,2,2,'r'],30],[[1],[2,2,'r',2,2,3],35],[[1,1],[2,'r',2,3,2,3],40],[[1,1,2],[2,'r',2,3,2,3],45]];
for(let si=0;si<5;si++){mapId=SEC[si].m[0];const [pre,sl,cap]=exp[si];let bad=0,rs={},fb={};for(let r=0;r<300;r++){plan();const e=Object.entries(IW).map(([t,w])=>[+t,w]);const p0=e.filter(x=>x[1]==0).map(x=>ZC[x[0]].tier).sort().join();if(p0!=pre.slice().sort().join())bad++;
 if(e.some(x=>x[1]==0&&ZC[x[0]].rg))bad++;
 const W=[3,6,9,12,15,18];W.forEach((w,i)=>{const x=e.find(q=>q[1]==w);if(!x){bad++;return}if(sl[i]=='r'){if(!ZC[x[0]].rg)bad++;else rs[x[0]]=(rs[x[0]]||0)+1}else if(ZC[x[0]].rg)bad++;else if(ZC[x[0]].tier!=sl[i])fb[w+':t'+sl[i]+'→t'+ZC[x[0]].tier]=(fb[w+':t'+sl[i]+'→t'+ZC[x[0]].tier]||0)+1});
 if(e.filter(x=>ZC[x[0]].rg&&x[1]<=20).length!=1)bad++;if(Object.values(IW).some(w=>w>0&&w%10==0))bad++}
 S.dlc=1;const c1=zCapSp(1);S.dlc=2;const c2=zCapSp(2);S.dlc=1;
 SAY(SEC[si].n+': ranged picks '+JSON.stringify(rs)+(Object.keys(fb).length?' · tier fallbacks '+JSON.stringify(fb):''));
 OK(!bad,SEC[si].n+': wave-1 unlocks, slot tiers and one ranged type match the plan · bad '+bad);OK(c1==cap&&c2==cap+10,SEC[si].n+' special cap '+c1+'% / Hard '+c2+'%');
 if(si==0)OK(!rs[9],'Hometown never gets Bones');if(si>=1)OK(rs[9]>40&&rs[11]>40,SEC[si].n+' can get either ranged type')}
// play a few campaign waves per section and check the section cap holds for the wave
let cv=0;for(let si=0;si<5;si++){mapId=SEC[si].m[0];S.dlc=si%3;start();plan();for(let w=1;w<=19;w+=2){const t=playWave(w,{kp:.06,ks:.3});const W=ZD.tw;if(zIntro(w)==null&&W.s*100>zCapSp(zDi())*W.n)cv++}}
OK(!cv,'campaign waves stay under their section special cap');
setGM(g)}
// ---------- 8. intro populations ----------
LOG('8. intro wave sizes');
for(const mp of[1,2]){freshRun(1);MPn=mp>1?mp:0;for(const t of[1,2,10,3,4,11,18,19,14,9]){IW={};IW[t]=12;wave=11;zs=[];nextWave();const nz=Math.round((4+12*3+Math.floor(144*.12))*(MPn>1?1+.6*(MPn-1):1)),k=ZC[t].sp?.6:ZC[t].rg?.4:.8,want=Math.max(1,Math.round(nz*k));OK(toSp==want,(mp>1?mp+'P ':'')+ZC[t].n+' intro wave '+toSp+' = '+nz+' × '+k*100+'%')}MPn=0}
{freshRun(1);IW={9:3};ZCFG.intro.mult.rg=.01;wave=2;nextWave();OK(toSp==1,'minimum of 1 zombie in an intro wave');ZCFG.intro.mult.rg=.4}
{freshRun(1);IW={1:2};wave=4;zs=[];nextWave();OK(toSp==Math.round(4+15+3),'non-intro wave keeps the normal count ('+toSp+')')}
// ---------- 11b. secondary spawns ----------
LOG('11. secondary spawns');
{freshRun(1);IW={1:40};wave=9;zs=[];nextWave();SAY('boss wave 10 boss: '+ZT[bossQ].n);bossQ=-1;const J=mk(6,P.x+300,P.y);J.mh=J.hp;J.s2=0;zs.push(J);for(let i=0;i<10;i++)zs.push(mk(0,P.x+200,P.y+i*5));let rn=0,wk=0;for(let i=0;i<400;i++){frame(1/30);J.hp=J.mh}for(const z of zs){if(z.t==1)rn++;if(z.t==0)wk++}OK(rn>0,'Juggernaut still summons Runners before Runners are unlocked (runners '+rn+')')}
{freshRun(1);IW={1:2};wave=9;zs=[];nextWave();bossQ=-1;const J=mk(6,P.x+300,P.y);J.mh=J.hp;J.s2=0;zs.push(J);for(let i=0;i<10;i++)zs.push(mk(0,P.x+200,P.y+i*5));let rn=0;for(let i=0;i<200;i++){frame(1/30);J.hp=J.mh}for(const z of zs)if(z.t==1)rn++;OK(rn>0,'Juggernaut summons Runners once unlocked (runners '+rn+')')}
{freshRun(1);IW={4:3};wave=8;zs=[];nextWave();toSp=0;for(let i=0;i<4;i++)zs.push(mk(0,P.x+300,P.y+i*9));const sp=[];for(let i=0;i<3;i++){const z=mk(4,P.x+300,P.y+60+i*9);zs.push(z);sp.push(z)}nq=[];P=PL[0];for(const z of sp)hurt(z,1e6,0,0);const C=zCen();OK(nq.filter(q=>q.t==5).length==9&&C.s==0&&C.n==4,'3 Splitters dying at once: all 9 pieces appear and none count toward the caps (census '+C.s+'/'+C.n+')')}
{freshRun(1);IW={4:3};wave=2;zs=[];nextWave();toSp=0;const z=mk(4,P.x+300,P.y);zs.push(z);nq=[];P=PL[0];hurt(z,1e6,0,0);OK(nq.filter(q=>q.t==5).length==3,'in the Splitter intro wave the 3 pieces always appear')}
// ---------- 12. deadlock ----------
LOG('12. deadlock');
{freshRun(1);const sw=ZC[0].w;ZC[0].w=0;ZC[2].w=0;ZC[10].w=0;IW={1:2,3:2,14:2};wave=4;zs=[];nextWave();let t=0;const n0=toSp;while((toSp>0||zs.length)&&t<200){frame(1/30);t+=1/30;if(Math.random()<.05)killSome(.3)}OK(toSp==0,'only special types unlocked and Walker weight 0: wave still finishes ('+n0+' zombies in '+t.toFixed(0)+'s, delays '+ZD.dl+')');ZC[0].w=sw;ZC[2].w=2;ZC[10].w=2}
{freshRun(1);IW={};wave=0;zs=[];nextWave();for(let i=0;i<30;i++)frame(1/30);OK(zs.every(z=>z.t==0),'waves 1-2 are Walkers only')}
// ---------- 13. removed zombies ----------
{freshRun(1);IW={1:2};wave=4;zs=[];nextWave();for(let i=0;i<300;i++)frame(1/30);const n=zCen().n;for(const z of zs)z.hp=0;OK(zCen().n==0&&n>0,'census ignores removed (hp 0) zombies');zs=zs.filter(z=>z.hp>0);for(let i=0;i<200;i++)frame(1/30);OK(zs.length>0||toSp==0,'spawning resumes after removal')}
// ---------- Exploder ----------
LOG('Exploder / Healer');
{freshRun(1);IW={18:3};wave=3;zs=[];nextWave();toSp=0;const e=mk(18,P.x+120,P.y);zs.push(e);const hp0=1e9;let fused=0,t=0;P.inv=0;const run=()=>{for(const p of PL){p.inv=Math.min(p.inv,0)}NOW_+=33;AT_+=.033;upd(1/30)};
 P.hp=50;P.mx=60;while(zs.includes(e)&&t<6){P.hp=Math.max(P.hp,20);P.inv=0;const h=P.hp;run();t+=1/30;if(e.fu>0)fused=1}
 OK(fused&&!zs.includes(e),'Exploder walks up, lights its fuse and bursts ('+t.toFixed(2)+'s)');OK(kills==0,'self-destruct is not a kill');
 const sp=ZT[18].sp;OK(sp<ZT[1].sp&&sp>ZT[0].sp,'Exploder speed '+sp+' is a bit slower than the Runner ('+ZT[1].sp+')')}
{freshRun(1);IW={18:3};wave=3;zs=[];nextWave();toSp=0;const e=mk(18,P.x+40,P.y);zs.push(e);P.hp=30;P.inv=0;e.fu=.01;NOW_+=33;upd(1/30);OK(P.hp==28,'burst does 2 damage on Normal (hp '+P.hp+')')}
{freshRun(2);IW={18:3};wave=3;zs=[];nextWave();toSp=0;const e=mk(18,P.x+40,P.y);zs.push(e);P.hp=30;P.inv=0;e.fu=.01;NOW_+=33;upd(1/30);OK(P.hp==26,'burst does 4 damage on Hard (hp '+P.hp+')')}
{freshRun(1);IW={18:3};wave=3;zs=[];nextWave();toSp=0;const e=mk(18,P.x+300,P.y),w=mk(0,P.x+310,P.y);w.hp=1;zs.push(e,w);P.hp=30;P=PL[0];hurt(e,99,0,0);OK(P.hp==30&&w.hp<=0,'shooting an Exploder pops it harmlessly for players but hurts zombies next to it')}
// ---------- Healer ----------
{freshRun(1);IW={19:3,2:2};wave=5;zs=[];nextWave();toSp=0;const h=mk(19,P.x+500,P.y),b=mk(2,P.x+560,P.y),far=mk(2,P.x+900,P.y),k=mk(7,P.x+520,P.y+20);k.mh=k.hp;
 b.hp=b.m0*.3;far.hp=far.m0*.3;k.hp=k.mh*.3;zs.push(h,b,far,k);h.hc=.05;const b0=b.hp,f0=far.hp,k0=k.hp;for(let i=0;i<6;i++){NOW_+=33;upd(1/30);b.x=h.x+60;b.y=h.y;far.x=h.x+400;k.x=h.x+40;k.y=h.y+20}
 OK(b.hp>b0&&Math.abs(b.hp-Math.min(b.m0,b0+b.m0*.4))<1e-6,'Healer heals a nearby zombie by 40% of its max ('+b0.toFixed(1)+' → '+b.hp.toFixed(1)+')');OK(far.hp==f0,'zombies out of range are not healed');OK(k.hp==k0,'bosses are not healed');
 OK(b.hg>2.5,'healed zombie glows yellow (hg '+b.hg.toFixed(2)+')');for(let i=0;i<100;i++){NOW_+=33;upd(1/30);b.x=h.x+60;b.y=h.y;k.hp=k0}OK(!(b.hg>0),'glow fades after a few seconds');OK(h.hc>0&&h.hc<=6,'Healer waits ~6s before healing again ('+h.hc.toFixed(1)+')')}
{const tr=t=>{freshRun(1);IW={19:3};wave=3;zs=[];nextWave();toSp=0;const h=mk(t,P.x+300,P.y);zs.push(h);const x0=h.x,y0=h.y;for(let i=0;i<60;i++){P.hp=1e9;NOW_+=33;upd(1/30)}const dx=h.x-x0,dy=h.y-y0,L=Math.hypot(dx,dy)||1;return[dx/L,dy/L,L]};const a=tr(19),b=tr(0);SAY('lone healer moved '+a[2].toFixed(0)+'px, a walker from the same spot '+b[2].toFixed(0)+'px, same direction '+(a[0]*b[0]+a[1]*b[1]).toFixed(2));OK(a[0]*b[0]+a[1]*b[1]>.9&&a[2]>b[2]*.6,'a Healer with no zombies around walks in like a normal zombie')}
{freshRun(1);IW={19:3};wave=5;zs=[];nextWave();toSp=0;const h=mk(19,P.x+120,P.y);zs.push(h);for(let i=0;i<5;i++)zs.push(mk(0,P.x+300,P.y+i*10));const d0=Math.hypot(h.x-P.x,h.y-P.y);for(let i=0;i<45;i++){P.hp=1e9;NOW_+=33;upd(1/30)}OK(Math.hypot(h.x-P.x,h.y-P.y)>d0,'a Healer with zombies around keeps its distance')}
{let c=0;for(let r=0;r<20;r++){freshRun(1);IW={19:3};wave=5;zs=[];nextWave();toSp=0;for(let i=0;i<30;i++)zs.push(mk(0,P.x+300,P.y));ZD.tw={n:100,r:0,s:0};for(let i=0;i<5;i++){const t=zSecT(19);if(t!=null)zs.push(mk(t,0,0))}c=Math.max(c,zs.filter(z=>z.t==19).length)}OK(c==3,'at most 3 Healers alive outside their intro wave ('+c+')')}

LOG('split-screen campaign map');
{setGM('c');lobby();rL();OK(ui.innerHTML.includes('clbOpen()')&&!ui.innerHTML.includes('lbMap(-1)'),'campaign lobby shows the CAMPAIGN MAP button instead of arrows');clbOpen();OK(mode=='menu'&&ui.innerHTML.includes('LOBBY')&&(ui.innerHTML.includes('CHOOSE')||ui.innerHTML.includes('WORLD MAP')),'opens the campaign map screen with LOBBY/CHOOSE');
 const m=SEC[0].m[0];cPick(m);mapGo();OK(mode=='lobby'&&mapId==m&&CMLB==0,'choosing a map returns to the lobby with it selected');
 setGM('f');rL();OK(ui.innerHTML.includes('lbMap(-1)'),'free play lobby keeps the arrows');
 const A={name:'a',bm:[0,1<<0,0],un:[]},B={name:'b',bm:[0,0,0],un:[]};const M=cMerge([A,B]);OK(bBt(M,1,0)&&!bBt(B,1,0),'team progress combines everyone in the lobby');menu()}

LOG('Rotwood');
{const b=ZS[2].walk[0],r=ZS[20].walk[0];OK(ZT[20].hp>ZT[2].hp&&ZT[20].hp<=ZT[2].hp*1.4,'Rotwood health '+ZT[20].hp+' is a little more than the Brute ('+ZT[2].hp+')');
 const hb=b[3],hr=r[3];OK(hr>hb&&hr<hb*1.45,'Rotwood sprite is a bit taller than the Brute ('+hr+' vs '+hb+' px)');OK(ZS[20].up&&ZS[20].swing,'has wind-up and swing frames')}
{freshRun(1);IW={20:3};wave=3;zs=[];nextWave();toSp=0;const z=mk(20,P.x+50,P.y);z.tc=0;zs.push(z);P.hp=30;P.inv=0;let wound=0,t=0;while(t<3){P.hp=Math.max(P.hp,10);NOW_+=33;AT_+=.033;upd(1/30);t+=1/30;if(z.ts==1)wound=1;if(P.hp<30)break}
 OK(wound&&P.hp==28,'Rotwood winds up and its branch hits for 2 on Normal (hp '+P.hp+' after '+t.toFixed(2)+'s)')}
{freshRun(1);IW={20:3};wave=3;zs=[];nextWave();toSp=0;const z=mk(20,P.x+50,P.y);zs.push(z);z.ts=1;z.tt=.01;z.ta=0;P.hp=30;P.inv=0;NOW_+=33;upd(1/30);OK(P.hp==30,'a swing aimed the other way misses')}
{freshRun(2);IW={20:3};wave=3;zs=[];nextWave();toSp=0;const z=mk(20,P.x+50,P.y);zs.push(z);z.ts=1;z.tt=.01;z.ta=Math.atan2(P.y-z.y,P.x-z.x);P.hp=30;P.inv=0;NOW_+=33;upd(1/30);OK(P.hp==26,'Hard: the branch hits for 4 (hp '+P.hp+')')}
{const g=GMD;setGM('c');let pe=0,rw=0;for(let r=0;r<200;r++){mapId=SEC[3].m[0];plan();if(IW[14]>0)pe++;if(IW[20]>0)rw++}setGM(g);OK(pe==200&&rw==200,'Countryside now fills both tier-3 slots with People Eater + Rotwood')}
// ---------- split screen cash ----------
LOG('split-screen cash');
{freshRun(1);const q=mkP(1,S.ac,'any',1);PL=[P,q];MPn=2;P.cash=q.cash=0;wave=5;const z=mk(0,P.x+100,P.y);zs=[z];P=PL[0];hurt(z,1e6,0,0);OK(PL[0].cash>0&&PL[1].cash==PL[0].cash,'2-player: both players earn the kill cash ($'+PL[0].cash+' / $'+PL[1].cash+')');q.dn=1;const z2=mk(2,0,0);zs=[z2];P=PL[0];const c0=q.cash;hurt(z2,1e6,0,0);OK(q.cash>c0,'a downed partner still earns it');MPn=0;PL=[PL[0]];P=PL[0]}
{freshRun(1);P.cash=0;const z=mk(0,P.x+100,P.y);zs=[z];hurt(z,1e6,0,0);OK(P.cash==5,'solo cash unchanged ($'+P.cash+')')}
// ---------- diagnostics ----------
LOG('diagnostics');
S.dev=1;S.zdbg=0;options();OK(ui.innerHTML.includes('Spawn diagnostics')==ZPC,'Options shows the toggle only on PC with the test code (PC='+ZPC+')');
S.dev=0;options();OK(!ui.innerHTML.includes('Spawn diagnostics'),'hidden without the test code');
S.dev=1;S.zdbg=1;freshRun(1);IW={1:3};wave=2;zs=[];nextWave();for(let i=0;i<200;i++)frame(1/30);const tx=zdText();SAY(tx.split('\\n').join(' | '));OK(/Wave 3 · INTRO: Runner/.test(tx)&&/Ranged  \\d+ \\(/.test(tx)&&/Special \\d+ \\(/.test(tx)&&/Living \\d+/.test(tx),'diagnostic text has wave, intro type, living/ranged/special');
mode='play';zdT=-1e9;zdFrame();OK(ZPC?(zdEl&&zdEl.style.display=='block'):!zdEl,'overlay shown only when allowed');S.zdbg=0;zdFrame();OK(!zdEl||zdEl.style.display=='none','overlay hidden when switched off');
LOG('PASSED '+NP+' · FAILED '+F)}`;
globalThis.LOG=m=>require("fs").writeSync(2,m+"\n");new Function("docL","ivs","errs",out)(docL,ivs,errs);
