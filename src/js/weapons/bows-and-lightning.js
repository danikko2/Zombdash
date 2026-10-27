//# weapons/bows-and-lightning.js — Blastbow (sticky bolts that blink and blow up), Death Row (chain lightning), Firebow (burning zombies): logic, drawing, sounds
// The numbers live on the guns in WP (data/tables.js), so the GAME BALANCE guns tab can change them:
//   Blastbow  bx = blast damage to the zombie the bolt is stuck in, bs = blast damage to the zombies around it,
//             br = blast radius, bf = seconds from sticking to blowing up (d = the bolt's own hit)
//   Death Row d + 0..dx = damage to each zombie in the chain, zn = most zombies in one chain,
//             zj = how far the lightning jumps from one zombie to the next, zr = how far the first zap reaches
//   Firebow   bt = seconds a zombie burns, bd = fire damage per second (d = the bolt's own hit)
var BBC=[],BBX=[],LZ=[];
function spClear(){BBC=[];BBX=[];LZ=[]}
// ---------- Blastbow ----------
// the bolt sticks in the zombie it hit (or where it stopped: a wall, the end of its flight)
function bbStick(b){const W=WP[b.g]||{},z=b.zh&&b.zh.hp>0?b.zh:null;
BBC.push({x:b.x,y:b.y,a:Math.atan2(b.vy,b.vx),z,ox:z?cl(b.x-z.x,-10,10):0,oy:z?cl(b.y-z.y,-20,6):0,t:0,ph:0,f:W.bf||1,o:b.o||PL[0],g:b.g,dd:b.dd});
for(let i=0;i<4;i++)pt.push({x:b.x,y:b.y,vx:(Math.random()-.5)*110,vy:(Math.random()-.5)*110,l:.22,c:i%2?'#c89a58':'#5e1a16'});sfx('bbstick',b.x,b.y,.7)}
function bbBlow(c){const W=WP[c.g]||{},x=c.x,y=c.y,P0=P,K0=KG,m=wlD(c.o,c.g)*(c.dd?2:1);P=c.o;KG=c.g;
if(c.z&&c.z.hp>0)hurt(c.z,(W.bx||0)*m,0,0);
for(const z of zs){if(z===c.z||z.hp<=0||z.alt>4)continue;const T=ZT[z.t],hit=z.tk?tkIn(z,x,y,W.br||0):Math.hypot(z.x-x,z.y-y)<(W.br||0)+(z.hr||T.hr||T.r);if(hit)hurt(z,(W.bs||0)*m,(z.x-x)*4,(z.y-y)*4)}
P=P0;KG=K0;sfx('boom',x,y,.85);sfx('bbpop',x,y,.6);
for(let i=0;i<34;i++){const a=Math.random()*6.283,v=70+Math.random()*230;pt.push({x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v,l:.35+Math.random()*.25,c:i%5==0?'#fff1b0':i%2?'#ff7a2e':'#ffd84a'})}
for(let i=0;i<10;i++){const a=Math.random()*6.283,v=20+Math.random()*60;pt.push({x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v-30,l:.7,c:i%2?'#5a5048':'#3a3430'})}
rg.push({x,y,l:.35,m:.35,r:W.br||60,c:'#ff8a2e'});BBX.push({x,y:y+6,l:7,m:7,r:Math.min(60,(W.br||60)*.45),s:Math.random()*1e4|0});if(BBX.length>(LMX?10:24))BBX.shift();shk=Math.max(shk||0,.18)}
// ---------- Death Row ----------
// the first zap goes to the nearest zombie in front (or the one eating the player), then jumps to the
// nearest zombie it hasn't hit within reach, up to zn zombies; walls stop it
function drR(z){const T=ZT[z.t];return z.tk?Math.max(z.L||0,z.W||0)/2:(z.hr||T.hr||T.r)}
function drChain(p,mz,a){const W=WP[p.cur]||{},R=W.zr||480,J=W.zj||110,N=Math.max(1,Math.round(W.zn||15)),ca=Math.cos(a),sa=Math.sin(a),ok=z=>z.hp>0&&!(z.alt>4);
let first=p.eat&&p.eat.hp>0?p.eat:null;
if(!first){let bd=1e9;for(const z of zs){if(!ok(z))continue;const dx=z.x-mz.x,dy=z.y-mz.y,al=dx*ca+dy*sa;if(al<-12||al>R)continue;if(Math.abs(-dx*sa+dy*ca)>drR(z)+16+al*.06)continue;if(al<bd&&los(mz,z)){bd=al;first=z}}}
const H=[];if(first){H.push(first);let cur=first;while(H.length<N){let nx=null,nd=1e9;for(const z of zs){if(!ok(z)||H.includes(z))continue;const d=Math.hypot(z.x-cur.x,z.y-cur.y)-drR(z);if(d<=J&&d<nd&&los(cur,z)){nd=d;nx=z}}if(!nx)break;H.push(nx);cur=nx}}
return H}
function drFire(p,mz,a){const W=WP[p.cur]||{},g=p.cur,H=drChain(p,mz,a),P0=P,K0=KG,m=wlD(p,g)*(p.dd>0?2:1),pts=[{x:mz.x,y:mz.y}];
if(!H.length){const R=W.zr||480;let ex=mz.x,ey=mz.y;for(let s=8;s<=R;s+=8){const x=mz.x+Math.cos(a)*s,y=mz.y+Math.sin(a)*s;if(wlAt(x,y).some(w=>w[4]!=2&&x>w[0]&&x<w[0]+w[2]&&y>w[1]&&y<w[1]+w[3]))break;ex=x;ey=y}pts.push({x:ex,y:ey,f:1})}
P=p;KG=g;for(const z of H){pts.push({x:z.x,y:z.y-4});hurt(z,((W.d||0)+Math.random()*(W.dx||0))*m,0,0);
 for(let i=0;i<6;i++)pt.push({x:z.x,y:z.y-6,vx:(Math.random()-.5)*190,vy:(Math.random()-.5)*190,l:.28,c:i%3?'#bfe8ff':'#ffffff'})}
P=P0;KG=K0;LZ.push({pts,l:.34,m:.34,n:H.length});shk=Math.max(shk||0,.1);return H}
// ---------- Firebow ----------
// a zombie hit by a flaming bolt burns for bt seconds, taking bd damage a second in half-second ticks; another hit starts it again
function fbLight(z,b){const W=WP[b.g]||{};z.brn=Math.max(1,Math.round((W.bt||3)*2));z.brk=0;z.brd=(W.bd||0)*wlD(b.o||PL[0],b.g)*(b.dd?2:1);z.bro=b.o||PL[0];z.brg=b.g;
for(let i=0;i<8;i++)pt.push({x:z.x,y:z.y-6,vx:(Math.random()-.5)*120,vy:-30-Math.random()*90,l:.35,c:i%2?'#ff9a2e':'#ffd84a'});sfx('fbignite',z.x,z.y,.6,.05)}
// ---------- update (called from update() right after the chickens) ----------
function spUpd(dt){const P0=P,K0=KG;
for(const b of bs){const W=b.ab&&WP[b.g];if(W&&W.fb&&Math.random()<dt*45)pt.push({x:b.x-b.vx*.012,y:b.y-b.vy*.012,vx:(Math.random()-.5)*30,vy:-25-Math.random()*30,l:.25,c:Math.random()<.5?'#ff9a2e':'#ffd84a'})}
for(const c of BBC){if(c.z&&(c.z.hp<=0||!zs.includes(c.z)))c.z=null;if(c.z){c.x=c.z.x+c.ox;c.y=c.z.y+c.oy}c.t+=dt;
 // the light blinks faster and faster: 2 blinks a second at first, 16 just before it blows
 const u=Math.min(1,c.t/c.f),on0=c.ph%1<.5;c.ph+=(2+14*u*u)*dt;if(c.ph%1<.5&&!on0)sfx('bbeep',c.x,c.y,.25+.35*u);if(c.t>=c.f){c.done=1;if(PL.includes(c.o))bbBlow(c)}}
BBC=BBC.filter(c=>!c.done&&PL.includes(c.o));
for(const s of BBX)s.l-=dt;BBX=BBX.filter(s=>s.l>0);for(const l of LZ)l.l-=dt;LZ=LZ.filter(l=>l.l>0);
for(const z of zs){if(!(z.brn>0)||z.hp<=0)continue;if(!PL.includes(z.bro)){z.brn=0;continue}z.brk+=dt;
 if(Math.random()<dt*16)pt.push({x:z.x+rnd(-6,6),y:z.y-8-rnd(0,12),vx:(Math.random()-.5)*24,vy:-35-Math.random()*40,l:.4,c:Math.random()<.5?'#ff9a2e':'#ffd84a'});
 if(z.brk>=.5){z.brk-=.5;z.brn--;P=z.bro;KG=z.brg;hurt(z,z.brd*.5,0,0)}}
P=P0;KG=K0}
// ---------- drawing ----------
// scorch marks under everything that walks
function spDrawS(){if(!BBX.length)return;for(const s of BBX){const a=Math.min(1,s.l/2.5);X.globalAlpha=.55*a;X.fillStyle='#1c1612';X.beginPath();X.ellipse(s.x,s.y,s.r,s.r*.5,0,0,7);X.fill();X.fillStyle='#2e241c';
for(let i=0;i<9;i++){const u=hsh(i,s.s,1)*6.283,r=s.r*(.7+hsh(i,s.s,2)*.6),q=2+Math.round(hsh(i,s.s,3)*2);X.fillRect(Math.round(s.x+Math.cos(u)*r)-q,Math.round(s.y+Math.sin(u)*r*.5)-q,q*2,q*2)}}X.globalAlpha=1}
// a jagged lightning line, new jags every frame so it crackles
function drBolt(a,b,w){const d=Math.hypot(b.x-a.x,b.y-a.y),n=Math.max(2,d/14|0),nx=-(b.y-a.y)/(d||1),ny=(b.x-a.x)/(d||1),P2=[[a.x,a.y]];
for(let i=1;i<n;i++){const k=i/n,j=(Math.random()-.5)*w;P2.push([a.x+(b.x-a.x)*k+nx*j,a.y+(b.y-a.y)*k+ny*j])}P2.push([b.x,b.y]);return P2}
function drStroke(L,c,lw){X.strokeStyle=c;X.lineWidth=lw;X.beginPath();X.moveTo(L[0][0],L[0][1]);for(let i=1;i<L.length;i++)X.lineTo(L[i][0],L[i][1]);X.stroke()}
function spDraw(){const t=performance.now()/1000;
// burning zombies: flickering pixel flames over the body
for(const z of zs){if(!(z.brn>0)||z.hp<=0)continue;const T=ZT[z.t],k=Math.min(3,(z.hr||T.hr||T.r)/8),ph=(z.ph||0)*3,q=Math.max(2,Math.round(1.5*k));X.globalAlpha=.9;
 for(let i=0;i<4;i++){const fx=z.x+(i-1.5)*5*k,fl=(10+5*Math.sin(t*17+i*2.1+ph)+3*Math.sin(t*29+i))*k,by=z.y+7*k-(i%2)*3*k;
  // each tongue: red outside, orange, a yellow core; narrower towards the tip and swaying
  for(const [c,wf,hf] of [['#e0443a',1,1],['#ff9a2e',.62,.8],['#ffd84a',.3,.5]])for(let y=0;y<fl*hf;y+=q){const u=y/(fl*hf),w=Math.max(q,Math.round(5*k*wf*Math.pow(1-u,.7))),sx=Math.sin(t*13+y*.25+i)*1.2*k*u;X.fillStyle=c;X.fillRect(Math.round(fx+sx-w/2),Math.round(by-y-q),w,q)}}
 X.globalAlpha=1}
// blast bolts stuck in zombies (or the ground), light blinking
const A=typeof ZS!='undefined'&&ZS.bbolt&&ZS.bbolt.fly[0];
for(const c of BBC){if(A&&SPR.naturalWidth){const w=A[2]/1.6,h=A[3]/1.6;X.save();X.translate(c.x,c.y);X.rotate(c.a);X.imageSmoothingEnabled=false;X.drawImage(SPR,A[0],A[1],A[2],A[3],-w+2,-h/2,w,h);X.restore()}
 const lx=c.x-Math.cos(c.a)*4,ly=c.y-Math.sin(c.a)*4-2,on=c.ph%1<.5,u=Math.min(1,c.t/c.f);
 if(on){X.globalAlpha=.3+.3*u;X.fillStyle='#ff2a1a';X.beginPath();X.arc(lx,ly,6+5*u,0,7);X.fill();X.globalAlpha=1;X.fillStyle='#ff3a2a';X.fillRect(Math.round(lx)-2,Math.round(ly)-2,4,4);X.fillStyle='#ffd0c0';X.fillRect(Math.round(lx)-1,Math.round(ly)-1,2,2)}
 else{X.fillStyle='#5e1a16';X.fillRect(Math.round(lx)-1,Math.round(ly)-1,3,3)}}
// lightning
X.lineCap='round';X.lineJoin='round';
for(const l of LZ){const k=l.l/l.m;for(let i=1;i<l.pts.length;i++){const L=drBolt(l.pts[i-1],l.pts[i],14);X.globalAlpha=.35*k;drStroke(L,'#4aa8ff',7);X.globalAlpha=.9*k;drStroke(L,'#bfe8ff',3);X.globalAlpha=k;drStroke(L,'#ffffff',1.2);
  if(Math.random()<.5){const m=L[L.length/2|0],a=Math.random()*6.283,r=10+Math.random()*14;X.globalAlpha=.7*k;drStroke(drBolt({x:m[0],y:m[1]},{x:m[0]+Math.cos(a)*r,y:m[1]+Math.sin(a)*r},6),'#bfe8ff',1.5)}}
 for(let i=1;i<l.pts.length;i++){const p=l.pts[i];if(p.f)continue;X.globalAlpha=.45*k;X.fillStyle='#bfe8ff';X.beginPath();X.arc(p.x,p.y,7+5*k,0,7);X.fill()}
 const p0=l.pts[0];X.globalAlpha=.6*k;X.fillStyle='#dff9ff';X.beginPath();X.arc(p0.x,p0.y,5+6*k,0,7);X.fill()}
X.globalAlpha=1;X.lineCap='butt';X.lineJoin='miter'}
// ---------- sounds ----------
Object.assign(SF,{
// Blastbow: a heavy twang, the limbs slapping and a little arming chirp
blastbow:(t,d)=>{osc('triangle',160,96,t,.26,.36,d,.002);osc(P12,320,190,t,.08,.1,d,.002);noise(t,.08,.45,d,'lowpass',1200,240);osc('sine',80,40,t+.01,.1,.3,d);osc('square',1700,1700,t+.13,.035,.045,d,.002);osc('square',2300,2300,t+.18,.035,.045,d,.002);return .26},
// the bolt thunking into a zombie or the ground
bbstick:(t,d)=>{noise(t,.07,.32,d,'lowpass',900,200);osc('sine',150,70,t,.07,.22,d);return .08},
// the blinking light's beep
bbeep:(t,d)=>{osc('square',2050,2050,t,.045,.06,d,.002);return .05},
// the crack on top of the explosion
bbpop:(t,d)=>{noise(t,.12,.6,d,'highpass',1800,600);osc(P25,180,60,t,.18,.15,d);return .2},
// Firebow: a twang and the whoosh of the burning bolt
firebow:(t,d)=>{osc('triangle',210,124,t,.22,.32,d,.002);noise(t,.06,.3,d,'lowpass',1500,280);noise(t+.01,.4,.22,d,'bandpass',500,2600,.9,.03);return .4},
// a zombie catching fire
fbignite:(t,d)=>{noise(t,.35,.28,d,'bandpass',350,1700,.9,.02);noise(t,.25,.12,d,'lowpass',500,0,1,.02);return .36},
// Death Row: the discharge crack, crackling arcs and a low electric buzz
deathrow:(t,d)=>{noise(t,.05,.7,d,'highpass',2500);for(let i=0;i<6;i++)noise(t+.03+i*.06,.05,.34-.04*i,d,'bandpass',1800+Math.random()*2500,0,2);osc('sawtooth',90,55,t,.5,.2,d,.005);osc('square',1200,300,t,.18,.06,d);osc('sine',62,30,t,.45,.42,d);return .55},
// Death Row reload: the rocket goes in, then the capacitor charges up with a rising whine and a ready beep
rldr:(t,d)=>{const l=rlPlay('rk',t,d);osc('sine',180,1900,t+.25,1.75,.05,d,.15);vox('sawtooth',90,150,t+.25,1.75,.03,d,1200,30,8,.2);osc('square',2400,2400,t+2.05,.06,.06,d,.002);return Math.max(l||0,2.15)}});
