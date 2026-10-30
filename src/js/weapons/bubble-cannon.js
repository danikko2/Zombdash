//# weapons/bubble-cannon.js — The Bubble Cannon: a burst of bubbles that float for a moment, then pop in a water splash that hurts the zombies nearby
// Each shot blows bn0–bn1 bubbles in a spread. They glide out, slow down, wobble and drift, bounce softly off walls,
// and after about bt seconds (each a little different) pop: WP d damage to every zombie within br, like an explosion.
// Numbers on the gun in WP (data/tables.js), so GAME BALANCE can change them:
//   d = damage of each pop, bn0/bn1 = fewest/most bubbles a shot, bv = bubble speed, bt = seconds a bubble floats,
//   br = splash radius, apr = rockets per shot
var BCB=[],BCP=[];
function bcClear(){BCB=[];BCP=[]}
function bcFire(p,mz,a){const W=WP[p.cur]||{},lo=Math.max(1,Math.round(Math.min(W.bn0||4,W.bn1||6))),hi=Math.max(lo,Math.round(Math.max(W.bn0||4,W.bn1||6))),n=lo+(Math.random()*(hi-lo+1)|0),v=W.bv||340,t=W.bt||1.6;
for(let i=0;i<n;i++){const u=a+(n>1?(i/(n-1)-.5):0)*(W.sp||.6)*2+(Math.random()-.5)*.15,s=v*(.6+Math.random()*.6);
 BCB.push({x:mz.x,y:mz.y,vx:Math.cos(u)*s,vy:Math.sin(u)*s,t:0,l:t*(.8+Math.random()*.45),o:p,g:p.cur,dd:p.dd>0,ph:Math.random()*6.283,s:.55})}
for(let i=0;i<6;i++)pt.push({x:mz.x,y:mz.y,vx:Math.cos(a)*80+(Math.random()-.5)*90,vy:Math.sin(a)*80+(Math.random()-.5)*90,l:.3,c:i%2?'#bfeaff':'#ffffff'});return n}
function bcWall(x,y){if(x<3||y<3||x>WW-3||y>WH-3)return 1;return wlAt(x,y).some(w=>w[4]!=2&&x>w[0]&&x<w[0]+w[2]&&y>w[1]&&y<w[1]+w[3])}
// a pop: splash damage like an explosion, a ring of water, droplets and a wet patch on the ground
function bcPop(b){const W=WP[b.g]||{},x=b.x,y=b.y,r=W.br||55,P0=P,K0=KG,m=wlD(b.o,b.g)*(b.dd?2:1);P=b.o;KG=b.g;
for(const z of zs){if(z.hp<=0||z.alt>4)continue;const T=ZT[z.t],hit=z.tk?tkIn(z,x,y,r):Math.hypot(z.x-x,z.y-y)<r+(z.hr||T.hr||T.r);if(hit)hurt(z,(W.d||0)*m,(z.x-x)*3,(z.y-y)*3)}
P=P0;KG=K0;sfx('bcpop',x,y,.7,.02);
for(let i=0;i<18;i++){const a=Math.random()*6.283,v=50+Math.random()*170;pt.push({x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v-40,l:.3+Math.random()*.3,c:i%3==0?'#ffffff':i%3==1?'#7ad0f4':'#3aa8e0'})}
rg.push({x,y,l:.3,m:.3,r,c:'#7ad0f4'});BCP.push({x,y:y+6,l:3,s:Math.random()*1e4|0,r:Math.min(30,r*.45)});if(BCP.length>(LMX?16:40))BCP.shift()}
function bcUpd(dt){for(const b of BCB){b.t+=dt;const sp=Math.hypot(b.vx,b.vy),k=Math.max(0,1-dt*1.8);b.vx*=k;b.vy*=k;
 // a gentle wobbling drift once it has slowed down
 b.vx+=Math.cos(b.ph+b.t*2.3)*24*dt;b.vy+=(Math.sin(b.ph*1.7+b.t*1.9)*24-10)*dt;b.s=Math.min(1,b.s+dt*4);
 const nx=b.x+b.vx*dt,ny=b.y+b.vy*dt;if(bcWall(nx,ny)){if(bcWall(nx,b.y))b.vx=-b.vx*.5;if(bcWall(b.x,ny))b.vy=-b.vy*.5}else{b.x=nx;b.y=ny}
 if(b.t>=b.l||!PL.includes(b.o)){b.done=1;if(PL.includes(b.o))bcPop(b)}}
BCB=BCB.filter(b=>!b.done);for(const s of BCP)s.l-=dt;BCP=BCP.filter(s=>s.l>0)}
// wet patches under everything that walks
function bcDrawS(){if(!BCP.length)return;for(const s of BCP){const a=Math.min(1,s.l/1.5);X.globalAlpha=.35*a;X.fillStyle='#2a6a8a';X.beginPath();X.ellipse(s.x,s.y,s.r,s.r*.45,0,0,7);X.fill();X.fillStyle='#5ab0d8';
for(let i=0;i<6;i++){const u=hsh(i,s.s,1)*6.283,r=s.r*(.8+hsh(i,s.s,2)*.5),q=2;X.fillRect(Math.round(s.x+Math.cos(u)*r)-q,Math.round(s.y+Math.sin(u)*r*.45)-q,q*2,q*2)}}X.globalAlpha=1}
function bcDraw(){if(!BCB.length)return;const A=typeof ZS!='undefined'&&ZS.bubble&&ZS.bubble.fly,t=performance.now()/1000;
for(const b of BCB){const left=b.l-b.t,sw=1+.06*Math.sin(t*9+b.ph),gr=left<.25?1+(.25-left)*1.6:1,k=b.s*sw*gr,fl=left<.25&&(t*30|0)%2;
 X.fillStyle='rgba(0,0,0,.15)';X.beginPath();X.ellipse(b.x,b.y+14,5*k,2,0,0,7);X.fill();
 if(!A||!SPR.naturalWidth){X.globalAlpha=.7;X.strokeStyle='#4ab8e8';X.lineWidth=2;X.beginPath();X.arc(b.x,b.y,7*k,0,7);X.stroke();X.globalAlpha=1;continue}
 const f=A[(t*4+b.ph|0)%A.length],w=f[2]/1.4*k,h=f[3]/1.4*k;X.save();X.globalAlpha=fl?1:.85;X.imageSmoothingEnabled=false;X.drawImage(SPR,f[0],f[1],f[2],f[3],b.x-w/2,b.y-h/2,w,h);X.restore()}}
// ---------- sounds ----------
Object.assign(SF,{
// Bubble Cannon: a wet blub and a run of little bloops
bubblecannon:(t,d)=>{noise(t,.14,.3,d,'lowpass',700,150);osc('sine',180,90,t,.12,.3,d);for(let i=0;i<4;i++){const f=500+Math.random()*500;osc('sine',f,f*2.2,t+.03+i*.045,.06,.09,d,.003)}return .3},
// a bubble popping in a splash of water
bcpop:(t,d)=>{osc('sine',900,2400,t,.04,.12,d,.002);noise(t+.01,.25,.35,d,'bandpass',1400,500,1.2);noise(t+.02,.3,.2,d,'lowpass',900,200);return .32},
// Bubble Cannon reload: the rockets go in, then a gurgle as the tank fills
rlbc:(t,d)=>{const l=rlPlay('rk',t,d);for(let i=0;i<7;i++){const f=260+Math.random()*380;osc('sine',f,f*1.8,t+.4+i*.12,.07,.07,d,.004)}return l}});
