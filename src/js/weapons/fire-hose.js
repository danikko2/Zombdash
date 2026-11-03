//# weapons/fire-hose.js — The Fire Hose: a flamethrower stream that burns zombies while it touches them and leaves them on fire; drawing, light and sounds
// While the trigger is held the hose throws a cone of flame (reach WP fr, half-width WP fw degrees) from its nozzle.
// Every zombie in the flame (walls block it; the zombie eating the player always counts) takes WP d damage a second.
// When the flame leaves a zombie it keeps burning for WP fb0–fb1 seconds at WP fbd damage a second (the Firebow's
// burning in weapons/bows-and-lightning.js does the ticks and the flames on the zombie).
// A magazine is MAG rounds of flame (one round every WP r seconds, kept exact by carrying the leftover time in game/player.js);
// every rocket makes WP rpu rounds (RPU in ammo-and-inventory.js).
var FHF=[];
function fhClear(){FHF=[];for(const p of PL||[])p.fht=0}
// a round of flame keeps the stream on for a moment and throws flame puffs out of the nozzle (spread over the round, so the stream is continuous)
function fhFire(p,mz,a){const W=WP[p.cur]||{},R=W.fr||180,hw=(W.fw||22)*Math.PI/180;p.fht=.22;p.fhm={x:mz.x,y:mz.y,a};
for(let i=0;i<9;i++){const u=a+(Math.random()-.5)*hw*1.5,v=R/.42*(.75+Math.random()*.35),l=.42*(.8+Math.random()*.4);FHF.push({x:mz.x,y:mz.y,vx:Math.cos(u)*v,vy:Math.sin(u)*v,t:-Math.random()*(W.r||.15),l,ph:Math.random()*6})}
const n=LMX?160:420;if(FHF.length>n)FHF.splice(0,FHF.length-n)}
// is this zombie inside the flame of nozzle m?
function fhIn(m,z,R,tn){const T=ZT[z.t],rad=z.tk?Math.max(z.L||0,z.W||0)/2:(z.hr||T.hr||T.r),ca=Math.cos(m.a),sa=Math.sin(m.a),dx=z.x-m.x,dy=z.y-m.y,al=dx*ca+dy*sa;
if(al<-rad||al>R+rad)return 0;if(Math.abs(-dx*sa+dy*ca)>Math.max(8,al*tn)+rad)return 0;return fhLos(m,z)}
// walls stop the flame (checked every 3 px, so thin walls count too)
function fhLos(a,b){const d=Math.hypot(b.x-a.x,b.y-a.y),n=Math.ceil(d/3);for(let i=1;i<n;i++){const x=a.x+(b.x-a.x)*i/n,y=a.y+(b.y-a.y)*i/n;if(wlAt(x,y).some(w=>w[4]!=2&&x>w[0]&&x<w[0]+w[2]&&y>w[1]&&y<w[1]+w[3]))return 0}return 1}
function fhUpd(dt){const P0=P,K0=KG;
for(const p of PL){if(!(p.fht>0))continue;p.fht-=dt;const W=WP[p.cur];if(!W||!W.fh||!alive(p)||!p.fhm){p.fht=0;continue}
 const m=p.fhm,g=p.cur,R=W.fr||180,tn=Math.tan((W.fw||22)*Math.PI/180),mul=wlD(p,g)*(p.dd>0?2:1),b0=W.fb0??2,b1=Math.max(b0,W.fb1??3);P=p;KG=g;
 for(const z of zs){if(z.hp<=0||z.alt>4)continue;if(!(z===p.eat||fhIn(m,z,R,tn)))continue;
  // in the flame: W.d damage a second (dealt in fifths of a second); the afterburn is set up but waits (brk held at 0) until it leaves
  z.fha=(z.fha||0)+dt;z.brn=Math.max(1,Math.round((b0+Math.random()*(b1-b0))*2));z.brk=0;z.brd=(W.fbd??2)*mul;z.bro=p;z.brg=g;
  while(z.fha>=.2&&z.hp>0){z.fha-=.2;hurt(z,(W.d||0)*.2*mul,0,0)}}}
P=P0;KG=K0;
for(const f of FHF){f.t+=dt;if(f.t<0)continue;const k=Math.max(0,1-dt*1.6);f.vx*=k;f.vy*=k;const nx=f.x+f.vx*dt,ny=f.y+f.vy*dt;
 if(wlAt(nx,ny).some(w=>w[4]!=2&&nx>w[0]&&nx<w[0]+w[2]&&ny>w[1]&&ny<w[1]+w[3])){f.vx*=-.15;f.vy*=-.15}else{f.x=nx;f.y=ny}
 if(f.t>f.l*.7&&Math.random()<dt*6)pt.push({x:f.x,y:f.y,vx:(Math.random()-.5)*20,vy:-30-Math.random()*20,l:.5,c:Math.random()<.5?'#4a3a34':'#3a302c'})}
FHF=FHF.filter(f=>f.t<f.l)}
// burning zombies and live streams light up dark maps (called from cmLight in world/kit-lighting.js)
function fhLights(S){for(const p of PL||[])if(p.fht>0&&p.fhm){const R=(WP[p.cur]&&WP[p.cur].fr)||180;S.push({x:p.fhm.x+Math.cos(p.fhm.a)*R*.45,y:p.fhm.y+Math.sin(p.fhm.a)*R*.45,r:R*.9,c:'#ff9a3a',i:1,f:'fire',ph:p.x})}
let n=0;for(const z of zs){if(!(z.brn>0)||z.hp<=0)continue;S.push({x:z.x,y:z.y,r:55,c:'#ff8a2a',i:1,f:'fire',ph:z.x});if(++n>=8)break}}
function fhDraw(){const A=typeof ZS!='undefined'&&ZS.flame&&ZS.flame.fly,ok=A&&SPR.naturalWidth,t=performance.now()/1000;
// a little pilot flame at the nozzle while the Fire Hose is held and not firing
for(const p of PL){const W=WP[p.cur];if(!W||!W.fh||!alive(p)||p.fht>0||mode!='play')continue;const P0=P;P=p;let m;try{m=muzzle()}catch(e){m=null}P=P0;if(!m)continue;
 const k=1+.25*Math.sin(t*23+p.x);X.fillStyle='#5ab0ff';X.fillRect(Math.round(m.x)-1,Math.round(m.y)-1,3,3);X.fillStyle='#ffd84a';X.fillRect(Math.round(m.x+Math.cos(p.a)*2)-1,Math.round(m.y+Math.sin(p.a)*2-2*k),2,Math.round(2*k))}
// a soft glow over the whole cone of flame while it is on
for(const p of PL){const W=WP[p.cur];if(!(p.fht>0)||!p.fhm||!W||!W.fh)continue;const m=p.fhm,R=(W.fr||180)*.95,hw=(W.fw||22)*Math.PI/180,k=Math.min(1,p.fht/.1);X.globalAlpha=.16*k;X.fillStyle='#ff9a2e';X.beginPath();X.moveTo(m.x,m.y);X.arc(m.x,m.y,R,m.a-hw,m.a+hw);X.closePath();X.fill();X.globalAlpha=.12*k;X.fillStyle='#ffd84a';X.beginPath();X.moveTo(m.x,m.y);X.arc(m.x,m.y,R*.6,m.a-hw*.6,m.a+hw*.6);X.closePath();X.fill()}X.globalAlpha=1;
if(!FHF.length)return;X.save();X.imageSmoothingEnabled=false;
for(const f of FHF){if(f.t<0)continue;const u=f.t/f.l,fr=u<.3?0:u<.65?1:2,sc=.9+2.6*u+.15*Math.sin(t*20+f.ph),a=u>.75?Math.max(0,1-(u-.75)/.25):1;
 if(!ok){X.globalAlpha=.8*a;X.fillStyle=fr==0?'#ffd84a':fr==1?'#ff9a2e':'#e0443a';const q=4*sc;X.fillRect(f.x-q,f.y-q,q*2,q*2);continue}
 const F=A[fr],w=F[2]/1.6*sc,h=F[3]/1.6*sc;X.globalAlpha=.92*a;X.drawImage(SPR,F[0],F[1],F[2],F[3],f.x-w/2,f.y-h/2,w,h)}
X.restore();X.globalAlpha=1}
// ---------- sounds ----------
Object.assign(SF,{
// Fire Hose: a gassy roar for every round of flame (they overlap into one long rush while the trigger is held)
firehose:(t,d)=>{noise(t,.24,.32,d,'bandpass',420+Math.random()*120,900,.7,.03);noise(t,.22,.18,d,'lowpass',260,0,1,.03);noise(t,.16,.06,d,'highpass',2600);return .24},
// Fire Hose reload: the rockets go in, a hiss of gas and the click of the pilot light catching
rlfh:(t,d)=>{const l=rlPlay('rk',t,d);noise(t+.5,1.1,.12,d,'highpass',1800,3200,.7,.2);osc('square',1800,1800,t+2.05,.03,.08,d,.002);noise(t+2.08,.35,.15,d,'bandpass',500,900,.8,.05);return Math.max(l||0,2.45)}});
