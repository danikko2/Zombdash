//# weapons/ammo-and-inventory.js — Inventory, ammo types (AMI), magazines (MAG), reloads, ammo HUD, reload sounds
// ---------- inventory (4 weapon slots) + ammo: magazines, reserves by ammo type, reloads, drops, shop ----------
var INV=4;
var AMT=['pa','pa','sh','ri','rk','sh','ri','ri','bl','sh','bl'];
function RDY(p){return shopIt(p).length}
var AMI={pa:{n:'Pistol ammo',s:'PISTOL',c:'#e8c040',buy:300,cost:30,max:1200,drop:60},ri:{n:'Rifle rounds',s:'RIFLE',c:'#d88a3a',buy:200,cost:40,max:800,drop:40},sh:{n:'Shotgun shells',s:'SHELLS',c:'#d84a3a',buy:8,cost:40,max:160,drop:6},rk:{n:'Rockets',s:'ROCKETS',c:'#8a9a6a',buy:10,cost:90,max:36,drop:5},bl:{n:'Ammo belts',s:'BELTS',c:'#c8b070',buy:300,cost:70,max:1200,drop:150}};
var MAG=[18,45,6,30,1,8,30,40,100,8,120],RLT=[1.25,1.3,1.7,1.4,2.2,1.9,1.6,1.4,2.4,1.9,2.4];
// what each enemy type tends to drop
var ZAM=['pa','pa','sh','ri','bl','pa','rk','bl','rk','sh','ri','ri','rk','sh','pa','rk','pa','ri','sh','ri','sh'];
function AMG(i,ci){return CH[ci]&&CH[ci].dw&&i==0?MAG[0]*2:MAG[i]}
function amSt(p,i){return i===CH[p.ci||0].w}
function amInit(p){try{if(AU.c)rlDecode(AU.c)}catch(e){}p.mg=WP.map((_,i)=>AMG(i,p.ci||0));p.am={pa:0,ri:0,sh:0,rk:0,bl:0};p.rl=0;p.paid={}}
function amRes(p,i){return amSt(p,i)?Infinity:(p.am?p.am[AMT[i]]:0)}
// start a reload of the equipped gun
function amRel(p,quiet){if(!p.mg)amInit(p);const i=p.cur,full=AMG(i,p.ci||0);if(p.rl>0||p.mg[i]>=full||amRes(p,i)<=0)return 0;p.rl=RLT[i]*(sPk(p,2)&&i==CH[2].w?.75:1)*(sPk(p,15)?.7:1);p.rlT=p.rl;p.rlw=i;const P0=P;P=p;sfx(RLS[i],p.x,p.y,MPn?.8:1);if(WP[i].lz)sfx('rllz',p.x,p.y,.35);P=P0;return 1}
function amTick(p,dt){if(!p.mg)amInit(p);if(p.dry>0)p.dry-=dt;if(p.rl>0){if(p.rlw!==p.cur){p.rl=0;return}p.rl-=dt;if(p.rl<=0){const i=p.rlw,full=AMG(i,p.ci||0),need=full-p.mg[i];if(amSt(p,i))p.mg[i]=full;else{const t=AMT[i],k=Math.min(need,p.am[t]);p.am[t]-=k;p.mg[i]+=k}p.rl=0}}}
// called when the trigger is pulled and the gun is ready: true = a round goes out
function amUse(p){if(!p.mg)amInit(p);const i=p.cur;if(p.rl>0)return 0;if(p.mg[i]>0){p.mg[i]--;if(p.mg[i]<=0&&amRes(p,i)>0)amRel(p);return 1}
if(amRes(p,i)>0){amRel(p);return 0}
// completely out: switch back to the starting gun
if((p.dry||0)<=0){p.dry=.5;const P0=P;P=p;sfx('deny');FT.push({x:p.x,y:p.y-36,t:'OUT OF '+AMI[AMT[i]].s,c:'#ff8a6a',l:1.2});P=P0;const w=CH[p.ci||0].w;if(p.own.includes(w))p.cur=w}return 0}
function amFill(p){if(!p.mg)amInit(p);p.rl=0;for(const i of p.own){const full=AMG(i,p.ci||0);if(amSt(p,i)){p.mg[i]=full;continue}const t=AMT[i],k=Math.min(full-p.mg[i],p.am[t]);if(k>0){p.am[t]-=k;p.mg[i]+=k}}}
// --- shop actions ---
function amBuy(t){if(!P.am)amInit(P);const I=AMI[t],c=pc(I.cost);if(P.am[t]>=I.max||P.cash<c){sfx('deny');return shop()}P.cash-=c;P.am[t]=Math.min(I.max,P.am[t]+I.buy);sfx('rlsh',null,null,.8);shop()}
function wSell(i){if(!P.own.includes(i)||amSt(P,i)){sfx('deny');return shop()}const v=wSV(P,i);P.cash+=v;P.own=P.own.filter(k=>k!==i);if(P.mg){P.am[AMT[i]]=Math.min(AMI[AMT[i]].max,P.am[AMT[i]]+P.mg[i]);P.mg[i]=0}if(P.cur==i)P.cur=CH[P.ci||0].w;sfx('coin');shop()}
function wSV(p,i){return Math.round((p.paid&&p.paid[i]!=null?p.paid[i]:pc(WP[i].cost,p))*.6)}
function amTxt(p,i){if(!p.mg)amInit(p);return p.mg[i]+' / '+(amSt(p,i)?'∞':p.am[AMT[i]])}
// shop sections for one player (single-player shop)
function invHTML(){const p=P,sl=[];for(let k=0;k<INV;k++){const i=p.own[k];if(i==null){sl.push(`<div class="isl em"><small>slot ${k+1}</small><span>empty</span></div>`);continue}
const st=amSt(p,i);sl.push(`<div class="isl ${p.cur==i?'on':''}"><small>slot ${k+1}</small><canvas data-gun=${i} data-cm=${cmOf(p.ac,i)}></canvas><b>${wN(p.ci||0,i)}</b><span class=ia style="color:${AMI[AMT[i]].c}">${amTxt(p,i)}</span>${st?'<span class=ist>starter · ∞ ammo</span>':`<button data-q=1 class=sel onclick="wSell(${i})">SELL $${wSV(p,i)}</button>`}</div>`)}
const am=Object.keys(AMI).map(t=>{const I=AMI[t],c=pc(I.cost),full=p.am[t]>=I.max;return `<button data-q=1 class="${full||p.cash<c?'no':''}" onclick="amBuy('${t}')"><span class=aic style="background:${I.c}"></span>${I.n}<small>${p.am[t]}/${I.max} · ${full?'full':'+'+I.buy+' $'+c}</small></button>`}).join('');
return `<h3 class=shh>INVENTORY ${p.own.length}/${INV}</h3><div class=sinv>${sl.join('')}</div><h3 class=shh>AMMO</h3><div class=sam>${am}</div>`}
// --- drops ---
function amDrop(z,T,add){const t=ZAM[z.t]||'pa';if(T.boss){add('am',t);add('am',['pa','ri','sh','bl'][Math.random()*4|0]);return}if(Math.random()<.085*(1+.08*rk('luck')))add('am',t)}
function amPick(d){if(!P.am)amInit(P);const t=d.a||'pa',I=AMI[t],k=Math.round(I.drop*(S.df?.8:1)*(1+.1*Math.random()));const had=P.am[t];P.am[t]=Math.min(I.max,P.am[t]+k);FT.push({x:d.x,y:d.y-14,t:P.am[t]>had?'+'+(P.am[t]-had)+' '+I.s:I.s+' FULL',c:I.c,l:1.3});sfx('rlpi',null,null,.6)}
function amDrawDrop(d,y){const I=AMI[d.a||'pa'];X.save();X.translate(d.x,y);X.fillStyle='#16111c';X.fillRect(-10,-8,20,15);X.fillStyle='#4a5a32';X.fillRect(-9,-7,18,13);X.fillStyle='#5e7040';X.fillRect(-9,-7,18,3);X.fillStyle=I.c;
if(d.a=='sh'){for(let k=0;k<3;k++)X.fillRect(-7+k*5,-4,3,7)}else if(d.a=='rk'){X.fillRect(-8,-2,14,4);X.beginPath();X.moveTo(6,-3);X.lineTo(10,0);X.lineTo(6,3);X.fill()}else if(d.a=='bl'){for(let k=0;k<5;k++)X.fillRect(-8+k*3.4,-4,2,6);X.fillStyle='#3a3a42';X.fillRect(-9,1,18,2)}else{for(let k=0;k<4;k++)X.fillRect(-7+k*4,-4,2,7)}X.restore()}
// --- HUD: magazine / reserve under the status panel, reload bar ---
function amHud(){if(!P||!P.mg||mode!='play')return;const i=P.cur,I=AMI[AMT[i]],x=10+(amHud.x||200)+10,y=22,F='VT323, ui-monospace, monospace',rl=P.rl>0,txt=rl?'RELOADING':amTxt(P,i),w=34+txt.length*11;
X.fillStyle='rgba(7,10,8,.72)';X.fillRect(x,y,w,34);X.strokeStyle='#3a4a3a';X.lineWidth=2;X.strokeRect(x,y,w,34);X.fillStyle=I.c;X.fillRect(x+8,y+9,6,16);X.fillStyle='#16111c';X.fillRect(x+8,y+9,6,3);
X.font='22px '+F;X.textAlign='left';X.fillStyle=rl?'#ffcf40':P.mg[i]<=Math.ceil(AMG(i,P.ci||0)*.25)?'#ff8a6a':'#e9f1e2';X.fillText(txt,x+22,y+24);
if(rl){const u=1-P.rl/(P.rlT||1);X.fillStyle='rgba(0,0,0,.6)';X.fillRect(x,y+36,w,7);X.fillStyle='#ffcf40';X.fillRect(x+1,y+37,(w-2)*u,5)}}
// reload sounds: rendered once into sample buffers with a little physical model —
// metal parts are a short noise strike ringing through a few damped resonant modes, slides are grainy filtered friction, seats/thuds are low knocks
var RLD={pi:1.05,sm:1.3,sh:1.8,ri:1.45,rk:2.05,bl:2.45,lz:1.1};
function rlBuild(k,sr){const n=Math.ceil(RLD[k]*sr),o=new Float32Array(n),R=Math.random;
const res=(t,a,modes,ex)=>{const i0=Math.floor(t*sr),L=Math.max(2,Math.floor((ex||.0015)*sr));for(const[f,dec,g]of modes){const r=Math.exp(-1/(dec*sr)),c=2*r*Math.cos(2*Math.PI*f/sr),r2=r*r,len=Math.min(n-i0,Math.floor(dec*sr*7));let y1=0,y2=0;const G=a*(g||1)*(1-r)*4;
for(let j=0;j<len;j++){const x=j<L?(R()*2-1)*(1-j/L):0,y=c*y1-r2*y2+x;y2=y1;y1=y;o[i0+j]+=y*G}}};
const tick=(t,a,dur)=>{const i0=Math.floor(t*sr),L=Math.floor((dur||.004)*sr);let p=0;for(let j=0;j<L&&i0+j<n;j++){const w=R()*2-1,h=w-p;p=w;o[i0+j]+=h*a*Math.exp(-j/(L*.25))}};
// small part click, heavier metal clack, plastic/steel seat knock
const clk=(t,a,b=1)=>{res(t,a*.7,[[3100*b,.006],[4700*b,.005],[6900*b,.004],[2200*b,.008,.6]]);tick(t,a*.5,.003)};
const clack=(t,a,b=1)=>{res(t,a,[[1250*b,.03],[1980*b,.024,.9],[2950*b,.018,.8],[4300*b,.012,.6],[6100*b,.008,.4]],.002);tick(t,a*.8,.006);thud(t,a*.55,150*b,.045)};
const thud=(t,a,f,dec)=>{const i0=Math.floor(t*sr),len=Math.min(n-i0,Math.floor(dec*sr*6));let ph=0;for(let j=0;j<len;j++){const tt=j/sr;ph+=2*Math.PI*f*(1-.35*Math.min(1,tt/dec))/sr;o[i0+j]+=Math.sin(ph)*a*Math.exp(-tt/dec)}};
// friction: band-limited grainy noise with a quick swell
const slide=(t,dur,a,fc,q=2.2,f1)=>{const i0=Math.floor(t*sr),len=Math.min(n-i0,Math.floor(dur*sr));let b1=0,b2=0,gr=1;for(let j=0;j<len;j++){const u=j/len,f=fc*(f1?Math.pow(f1/fc,u):1),w=2*Math.PI*f/sr,al=Math.sin(w)/(2*q),x=R()*2-1;
if(j%Math.floor(sr*.0025)==0)gr=.45+R()*.75;const y=(al*x+2*Math.cos(w)*b1-(1-al)*b2)/(1+al);b2=b1;b1=y;const env=Math.min(1,u/.18)*Math.min(1,(1-u)/.3);o[i0+j]+=y*a*env*gr*2.4}};
switch(k){
case'pi':clk(0,.55,1.1);slide(.05,.13,.35,2400,2,1500);thud(.2,.25,240,.03);clk(.2,.25,.8);slide(.4,.09,.4,1600,2,2600);clack(.5,.8,1.35);thud(.5,.4,210,.04);slide(.72,.08,.6,3000,2.5,2200);clk(.8,.6,1.2);clack(.88,1,1.15);break;
case'sm':clk(0,.6,1);slide(.05,.16,.4,2200,2,1300);thud(.22,.28,200,.035);slide(.52,.12,.45,1500,2,2400);clack(.65,.85,1.2);thud(.65,.45,180,.04);clk(.92,.5,1.3);slide(.95,.12,.6,2800,2.4,1900);clack(1.12,1,1.05);break;
case'sh':for(let i=0;i<3;i++){const u=.08+i*.33;slide(u,.08,.3,1300,1.8,2000);thud(u+.07,.6,230,.03);res(u+.07,.45,[[1700,.012],[2600,.008],[3900,.006]]);tick(u+.07,.35,.004)}
slide(1.12,.15,.7,1100,1.6,2300);clack(1.27,1,.9);thud(1.27,.6,120,.05);slide(1.4,.12,.7,2300,1.6,1200);clack(1.53,1.15,.82);thud(1.53,.75,105,.06);break;
case'ri':clk(0,.6,1);slide(.05,.18,.4,2000,2,1100);thud(.25,.3,190,.035);slide(.56,.11,.5,1300,2,2300);clack(.68,1,1.05);thud(.68,.55,150,.045);
clk(.98,.6,1.4);slide(1.02,.12,.55,3000,2.4,1800);slide(1.17,.08,.55,1800,2.4,3200);clack(1.27,1.1,1.1);break;
case'rk':clk(0,.6,.8);thud(.03,.4,110,.05);slide(.35,.8,.45,700,1.4,1600);slide(.35,.8,.2,4200,3,3000);thud(1.2,1,62,.09);res(1.2,.6,[[480,.05],[860,.04],[1350,.03]]);tick(1.2,.6,.01);clack(1.62,.8,.75);clk(1.78,.6,1);break;
case'bl':clack(0,.8,.95);for(let i=0;i<16;i++){const u=.28+i*.05+R()*.012;res(u,.22+R()*.15,[[3600+R()*1400,.004],[5200+R()*1500,.003],[2400+R()*600,.006,.6]]);tick(u,.15,.002)}slide(.28,.82,.18,3400,2,2600);
clack(1.25,1,.85);thud(1.25,.6,110,.06);{const i0=Math.floor(1.55*sr),len=Math.min(n-i0,Math.floor(.75*sr));let ph=0;for(let j=0;j<len;j++){const u=j/len,f=30+170*Math.min(1,u*1.5);ph+=2*Math.PI*f/sr;const saw=(ph/(2*Math.PI))%1*2-1;o[i0+j]+=(saw*.18+(R()*2-1)*.08)*Math.min(1,u*4)*(1-Math.max(0,u-.8)/.2)}}clk(2.33,.6,1.1);break;
case'lz':{const i0=Math.floor(.12*sr),len=Math.min(n-i0,Math.floor(.75*sr));let ph=0,ph2=0;for(let j=0;j<len;j++){const u=j/len,f=240*Math.pow(7,u);ph+=2*Math.PI*f/sr;ph2+=2*Math.PI*f*2.01/sr;o[i0+j]+=(Math.sin(ph)*.22+Math.sin(ph2)*.08)*Math.min(1,u*5)*(1-u*.3)}}clk(.9,.4,1.8);res(.9,.25,[[1600,.06]]);break}
let pk=0;for(let i=0;i<n;i++)pk=Math.max(pk,Math.abs(o[i]));const sc=pk>0?({lz:.4,rk:.75}[k]||.85)/pk:1;for(let i=0;i<n;i++)o[i]*=sc;return o}

// recorded reload clips (decoded once per audio context), played instead of the synthesized version when ready
var RLREC={pi:'data:audio/mpeg;base64,{{asset:sounds/reload-pistol.mp3}}',ar:'data:audio/mpeg;base64,{{asset:sounds/reload-rifle.mp3}}',gr:'data:audio/mpeg;base64,{{asset:sounds/reload-heavy.mp3}}',sg:'data:audio/mpeg;base64,{{asset:sounds/reload-shotgun.mp3}}'},RLRU={pi:['pi',1.08,.36],sm:['pi',1.035,.36],ri:['ar',1.06,.4],sh:['sg',.95,.55],rk:['ar',.65,.47],bl:['gr',.55,.48]};
function rlDecode(c){if(!c||!c.decodeAudioData||(AU.rdc===c))return;AU.rdc=c;AU.rd={};for(const k in RLREC){try{const s=atob(RLREC[k].split(',')[1]),u=new Uint8Array(s.length);for(let i=0;i<s.length;i++)u[i]=s.charCodeAt(i);const ok=b=>{AU.rd[k]=b},p=c.decodeAudioData(u.buffer,ok,()=>{});if(p&&p.then)p.then(ok).catch(()=>{})}catch(e){}}}
function rlPlay(k,t,d){const c=AU.c;rlDecode(c);{const r=RLRU[k],b=r&&AU.rd&&AU.rdc===c&&AU.rd[r[0]];if(b){const s=c.createBufferSource(),g=c.createGain();s.buffer=b;s.playbackRate.value=r[1];g.gain.value=r[2];s.connect(g);g.connect(d);s.start(t);return b.duration/r[1]}}AU.rb=AU.rb||{};if(!AU.rb[k]||AU.rb[k].c!==c){const sr=c.sampleRate||44100,data=rlBuild(k,sr),b=c.createBuffer(1,data.length,sr);const ch=b.getChannelData(0);if(ch&&ch.set)ch.set(data);AU.rb[k]={c,b}}const s=c.createBufferSource();s.buffer=AU.rb[k].b;s.connect(d);s.start(t);return RLD[k]}
var RLS=['rlpi','rlsm','rlsh','rlri','rlrk','rlsh','rlri','rlri','rlbl','rlsh','rlbl'];
Object.assign(SF,{rlpi:(t,d)=>rlPlay('pi',t,d),rlsm:(t,d)=>rlPlay('sm',t,d),rlsh:(t,d)=>rlPlay('sh',t,d),rlri:(t,d)=>rlPlay('ri',t,d),rlrk:(t,d)=>rlPlay('rk',t,d),rlbl:(t,d)=>rlPlay('bl',t,d),rllz:(t,d)=>rlPlay('lz',t,d)});

