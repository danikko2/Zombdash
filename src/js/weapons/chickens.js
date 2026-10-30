//# weapons/chickens.js — The Crossbow's bolts and the Chicken Gun's rubber chickens (hunting, eating, ballooning, popping), their sounds
// ---------- Chicken Gun: rubber chickens that eat zombies ----------
// Each chicken picks a zombie no other chicken is after, flies to it (over walls), eats it in a spray of blood and moves on.
// It is full after CKG.n0–CKG.n1 zombies (picked when it is fired); a zombie with CKG.big health or more counts as two.
// Then it balloons up and pops in a blood splatter. Wave bosses and survivor bosses are too big to swallow: the chicken
// bites them for the gun's damage (WP d), and every bite counts as two. A chicken that finds nothing to eat for CKG.idle
// seconds pops as well. A player can have CKG.max chickens out at once; each chicken uses WP apr rockets.
var CK=[],CKS=[];
var CKG={max:3,n0:5,n1:8,big:8,sp:260,idle:5,eat:.45,rng:650};
// (also clears the Blastbow's bolts, Death Row's lightning and scorch marks, the Life Saver's hearts and the Bubble Cannon's bubbles)
function ckClear(){CK=[];CKS=[];spClear();lsClear();bcClear()}
// chickens a player has out (not yet popped)
function ckOut(p){let n=0;for(const c of CK)if(c.o===p&&!c.dead)n++;return n}
// can this player fire now? Only the Chicken Gun is limited
function ckOK(p){const w=WP[p.cur];if(!w||!w.ck||ckOut(p)<CKG.max)return 1;if(!(p.ckw>0)){p.ckw=.9;FT.push({x:p.x,y:p.y-36,t:CKG.max+' CHICKENS OUT',c:'#ffd84a',l:.9})}return 0}
function ckFire(p,mz,a){const lo=Math.max(1,Math.round(Math.min(CKG.n0,CKG.n1))),hi=Math.max(lo,Math.round(Math.max(CKG.n0,CKG.n1)));
CK.push({x:mz.x,y:mz.y,a,v:CKG.sp*1.5,s:'fly',t:0,life:0,n:0,m:lo+(Math.random()*(hi-lo+1)|0),o:p,g:p.cur,z:null,it:0,ph:Math.random()*9});
for(let i=0;i<7;i++)pt.push({x:mz.x,y:mz.y,vx:Math.cos(a)*90+(Math.random()-.5)*150,vy:Math.sin(a)*90+(Math.random()-.5)*150,l:.45,c:i%3?'#fff8e8':'#f2cc3a'})}
// alive, not up in the air, and inside the map (zombies still walking in from outside it can't be reached yet)
function ckCan(z){return z.hp>0&&!(z.alt>4)&&z.x>=0&&z.x<=WW&&z.y>=0&&z.y<=WH}
function ckReach(c,z){const T=ZT[z.t];return z.tk?tkIn(z,c.x,c.y,8):Math.hypot(z.x-c.x,z.y-c.y)<(z.hr||T.hr||T.r)+6}
// zombies other chickens are already after
function ckBusy(c){const s=new Set();for(const q of CK)if(q!==c&&!q.dead&&q.z&&(q.s=='seek'||q.s=='eat'))s.add(q.z);return s}
// the nearest free zombie in range; a boss only when nothing else is close
function ckFind(c,busy){let best=null,bs0=1e9;for(const z of zs){if(!ckCan(z)||busy.has(z))continue;const d=Math.hypot(z.x-c.x,z.y-c.y);if(d>CKG.rng)continue;const s=d+(ZT[z.t].boss?140:0);if(s<bs0){bs0=s;best=z}}return best}
function ckTurn(c,ta,dt,k){let d=ta-c.a;d=Math.atan2(Math.sin(d),Math.cos(d));const m=(k||7)*dt;c.a+=cl(d,-m,m)}
function ckMove(c,dt){c.x=cl(c.x+Math.cos(c.a)*c.v*dt,4,WW-4);c.y=cl(c.y+Math.sin(c.a)*c.v*dt,4,WH-4)}
function ckPuff(c){if(c.s=='puff')return;c.s='puff';c.t=0;c.z=null;sfx('ckinflate',c.x,c.y,.6)}
function ckPop(c){c.dead=1;ckSplat(c.x,c.y-14,1.7);for(let i=0;i<16;i++){const a=Math.random()*6.283,v=70+Math.random()*170;pt.push({x:c.x,y:c.y-14,vx:Math.cos(a)*v,vy:Math.sin(a)*v,l:.55,c:i%4==0?'#f2cc3a':i%4==1?'#fff8e8':'#b32f2f'})}sfx('ckpop',c.x,c.y)}
// a blood splatter: a burst of drops plus a pool on the ground that fades after a few seconds
function ckSplat(x,y,k){for(let i=0;i<10+8*k;i++){const a=Math.random()*6.283,v=40+Math.random()*150*k;pt.push({x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v-30,l:.35+Math.random()*.3,c:i%3?'#b32f2f':i%2?'#7a1018':'#d8403a'})}
CKS.push({x,y:y+14,k,l:7,s:Math.random()*1e4|0});if(CKS.length>(LMX?16:40))CKS.shift()}
function ckUpd(dt){for(const p of PL)if(p.ckw>0)p.ckw-=dt;if(!CK.length&&!CKS.length)return;const P0=P,K0=KG;
for(const s of CKS)s.l-=dt;CKS=CKS.filter(s=>s.l>0);CK=CK.filter(c=>!c.dead&&PL.includes(c.o));
for(const c of CK){c.t+=dt;c.life+=dt;
 if(c.s=='fly'){c.v=Math.max(CKG.sp,c.v-CKG.sp*2*dt);ckMove(c,dt);if(c.t>.3){c.s='seek';c.t=0}continue}
 if(c.s=='seek'){const busy=ckBusy(c);if(!c.z||c.z.hp<=0||!zs.includes(c.z)||!ckCan(c.z)||busy.has(c.z))c.z=ckFind(c,busy);
  if(c.z){const z=c.z,d=Math.hypot(z.x-c.x,z.y-c.y),ta=Math.atan2(z.y-c.y,z.x-c.x);c.it=0;if(d<50)c.a=ta;else ckTurn(c,ta,dt);c.v=CKG.sp;ckMove(c,dt);
   if(ckReach(c,z)){c.s='eat';c.t=0;c.big=!!ZT[z.t].boss||z.hp>=CKG.big;c.ox=cl(c.x-z.x,-8,8);c.oy=-2;sfx('chomp',c.x,c.y,.8)}}
  else{c.it+=dt;const o=c.o,u=c.life*2.2+c.ph,tx=o.x+Math.cos(u)*60,ty=o.y-6+Math.sin(u)*36;ckTurn(c,Math.atan2(ty-c.y,tx-c.x),dt,5);c.v=CKG.sp*.6;ckMove(c,dt);if(c.it>=CKG.idle)ckPuff(c)}
  if(c.life>40)ckPuff(c);continue}
 if(c.s=='eat'){const z=c.z;if(!z||z.hp<=0||!zs.includes(z)){c.s='seek';c.t=0;c.z=null;continue}
  c.x=z.x+c.ox;c.y=z.y+c.oy;const T=ZT[z.t];if(!T.boss)z.fz=Math.max(z.fz||0,.1);
  if(Math.random()<dt*28)pt.push({x:z.x+rnd(-6,6),y:z.y-8+rnd(-8,6),vx:(Math.random()-.5)*130,vy:-40-Math.random()*70,l:.4,c:Math.random()<.5?'#b32f2f':'#d8403a'});
  if(c.t>=CKG.eat){const h0=z.hp;P=c.o;KG=c.g;
   if(T.boss)hurt(z,WP[c.g].d*wlD(c.o,c.g)*(c.o.dd>0?2:1),0,0);else hurt(z,Math.max(1,z.hp)+1,0,0);
   P=P0;KG=K0;const ate=z.hp!==h0||z.hp<=0;
   if(ate){c.n+=c.big?2:1;ckSplat(z.x,z.y,T.boss?1.3:1)}
   c.t=0;if(z.hp<=0||!ate)c.z=null;c.s='seek';if(c.n>=c.m)ckPuff(c)}
  continue}
 if(c.s=='puff'){c.y-=10*dt;if(c.t>=1.05)ckPop(c)}}
CK=CK.filter(c=>!c.dead);P=P0;KG=K0}
// ---------- drawing ----------
function ckDrawS(){if(!CKS.length)return;for(const s of CKS){const a=Math.min(1,s.l/2),k=s.k;X.globalAlpha=.8*a;X.fillStyle='#6a0e16';X.beginPath();X.ellipse(s.x,s.y,10*k,5.5*k,0,0,7);X.fill();X.fillStyle='#a8202a';
for(let i=0;i<6+4*k;i++){const u=hsh(i,s.s,1)*6.283,r=(5+hsh(i,s.s,2)*15)*k,q=Math.round(1+hsh(i,s.s,3)*2.2*Math.min(1.5,k));X.fillRect(Math.round(s.x+Math.cos(u)*r)-q,Math.round(s.y+Math.sin(u)*r*.55)-q,q*2,q*2)}
X.fillStyle='#c83a3a';X.beginPath();X.ellipse(s.x-2*k,s.y-1,4.5*k,2.6*k,0,0,7);X.fill()}X.globalAlpha=1}
function ckDraw(){if(!CK.length)return;const A=typeof ZS!='undefined'&&ZS.chicken,ok=A&&SPR.complete&&SPR.naturalWidth,t=performance.now()/1000;
for(const c of CK){if(c.dead)continue;let an=A&&A.fly,fps=12,sc=.8*(1+.05*Math.min(c.n,8)),hv=14+Math.sin(t*9+c.ph)*2;
 if(c.s=='eat'){an=A&&A.eat;fps=10;hv=10}else if(c.s=='puff'){const u=Math.min(1,c.t/1.05);an=A&&A.puff;fps=7;sc=.8*(1+1.5*u*u)*(1+.07*Math.sin(t*34));hv=14+u*10}
 const fl=c.s=='eat'&&c.z?(c.z.x>=c.x?1:-1):Math.cos(c.a)<0?-1:1;
 X.fillStyle='rgba(0,0,0,.25)';X.beginPath();X.ellipse(c.x,c.y+6,9*sc,3,0,0,7);X.fill();
 if(!ok){X.fillStyle='#f2cc3a';X.fillRect(c.x-6*sc,c.y-hv-6*sc,12*sc,10*sc);continue}
 const f=an[Math.floor(t*fps+c.ph)%an.length],w=f[2]/1.6*sc,h=f[3]/1.6*sc;X.save();X.translate(c.x,c.y+6-hv);X.scale(fl,1);X.imageSmoothingEnabled=false;X.drawImage(SPR,f[0],f[1],f[2],f[3],-w/2,-h,w,h);X.restore()}}
// ---------- Crossbow bolts (also the Blastbow's and the Firebow's) ----------
function xbDraw(b){const W=WP[b.g]||{},k=W.bb?'bbolt':W.fb?'fbolt':'bolt',Z=typeof ZS!='undefined'&&ZS[k],f=Z&&Z.fly[Z.fly.length>1?(performance.now()/80|0)%Z.fly.length:0],a=Math.atan2(b.vy,b.vx);
if(!f||!SPR.naturalWidth){X.strokeStyle='#c89a58';X.lineWidth=2;X.beginPath();X.moveTo(b.x,b.y);X.lineTo(b.x-Math.cos(a)*14,b.y-Math.sin(a)*14);X.stroke();return}
const w=f[2]/1.6,h=f[3]/1.6;X.save();X.translate(b.x,b.y);X.rotate(a);X.imageSmoothingEnabled=false;if(b.dd){X.globalAlpha=.35;X.fillStyle='#ffd84a';X.fillRect(-w+1,-h/2-1,w,h+2);X.globalAlpha=1}X.drawImage(SPR,f[0],f[1],f[2],f[3],-w+2,-h/2,w,h);
if(W.bb&&(performance.now()/250|0)%2){X.fillStyle='#ff3a2a';X.fillRect(-6,-3,3,3)}if(W.fb){X.globalAlpha=.35;X.fillStyle='#ff9a2e';X.beginPath();X.arc(0,0,5,0,7);X.fill();X.globalAlpha=1}X.restore()}
// a bolt's end: the Blastbow's sticks where it is (hit or not), the Firebow's sets the zombie it hit on fire
function xbHit(b,hit){const W=WP[b.g]||{};if(W.bb)return bbStick(b);if(!hit)return;if(W.fb&&b.zh&&b.zh.hp>0)fbLight(b.zh,b);for(let i=0;i<4;i++)pt.push({x:b.x,y:b.y,vx:(Math.random()-.5)*130,vy:(Math.random()-.5)*130,l:.25,c:i%2?'#c89a58':'#e8e0c8'})}
// ---------- sounds ----------
Object.assign(SF,{
// crossbow: the string's twang, the slap of the limbs and a dry wooden thunk
crossbow:(t,d)=>{osc('triangle',196,118,t,.24,.34,d,.002);osc(P12,392,236,t,.09,.1,d,.002);noise(t,.07,.4,d,'lowpass',1500,280);noise(t,.025,.22,d,'highpass',3200);osc('sine',95,50,t+.01,.08,.25,d);return .26},
// chicken gun: a pneumatic foomp and the rubber chicken's squawk
chickgun:(t,d)=>{noise(t,.16,.5,d,'lowpass',900,180);osc('sine',150,55,t,.14,.45,d);vox('sawtooth',780,1150,t+.03,.12,.15,d,3200,24,40,.01);vox('sawtooth',1150,620,t+.15,.26,.13,d,3000,18,60,.01);return .45},
// a chicken blowing up like a balloon, then popping in a wet burst
ckinflate:(t,d)=>{vox('square',420,1500,t,1,.07,d,2400,8,30,.05);noise(t,1,.05,d,'bandpass',1800,4000,4,.2);return 1.05},
ckpop:(t,d)=>{noise(t,.3,.8,d,'lowpass',3000,250);osc('sine',220,45,t,.22,.55,d);noise(t+.04,.35,.35,d,'bandpass',650,180,3);vox('square',1400,500,t,.12,.06,d,3000,30,80,.005);return .45}});
