//# bosses/ice-cream-and-fire-chief.js — Ice Cream Man and Fire Chief (vehicle bosses)
// ---------- vehicle bosses: the Ice Cream Man's truck and the Fire Chief's engine drive a road graph (HS.RG) ----------
var ICB=[];
function rgAng(a){return Math.atan2(Math.sin(a),Math.cos(a))}
function tkInit(z){const G=HS.RG;z.L=z.ci==14?178:z.ci==16?96:132;z.W=z.ci==14?48:z.ci==16?42:52;z.sp=0;z.hd=0;if(!G){z.rd=null;return}
const Q=rndAlive()||PL[0],D=G.N.map(n=>Math.hypot(n[0]-Q.x,n[1]-Q.y));let c=G.N.map((_,i)=>i).filter(i=>D[i]>450&&D[i]<1000);if(!c.length)c=G.N.map((_,i)=>i).sort((a,b)=>D[b]-D[a]).slice(0,3);
const a=c[Math.floor(Math.random()*c.length)];let b=G.A[a][0],bd=1e9;for(const n of G.A[a]){const e=Math.hypot(G.N[n][0]-Q.x,G.N[n][1]-Q.y);if(e<bd){bd=e;b=n}}
z.rd={a,b,u:0};z.x=G.N[a][0];z.y=G.N[a][1];z.hd=Math.atan2(G.N[b][1]-z.y,G.N[b][0]-z.x)}
function tkDrive(z,dt,tx,ty,spd){const G=HS.RG;if(!G||!z.rd)return;const ac=spd>z.sp?240:360;z.sp+=cl(spd-z.sp,-ac*dt,ac*dt);const R=z.rd;R.u+=z.sp*dt;
let A=G.N[R.a],B=G.N[R.b],L=Math.hypot(B[0]-A[0],B[1]-A[1]);
for(let g=0;g<4&&R.u>=L;g++){R.u-=L;const nb=G.A[R.b].filter(n=>n!==R.a);let best=R.a,bs=1e9;
for(const n of nb){const s=Math.hypot(G.N[n][0]-tx,G.N[n][1]-ty)+Math.random()*140;if(s<bs){bs=s;best=n}}
if(nb.length&&Math.hypot(G.N[R.a][0]-tx,G.N[R.a][1]-ty)+300<bs)best=R.a;if(!nb.length)best=R.a;R.a=R.b;R.b=best;A=G.N[R.a];B=G.N[R.b];L=Math.hypot(B[0]-A[0],B[1]-A[1])||1}
const u=Math.min(1,R.u/L);z.x=A[0]+(B[0]-A[0])*u;z.y=A[1]+(B[1]-A[1])*u;const ea=Math.atan2(B[1]-A[1],B[0]-A[0]);z.hd+=cl(rgAng(ea-z.hd),-3.6*dt,3.6*dt);z.ga=z.hd}
// point (x,y) inside the truck's box (+p)
function tkIn(z,x,y,p){const dx=x-z.x,dy=y-z.y,c=Math.cos(z.hd),s=Math.sin(z.hd),u=dx*c+dy*s,v=-dx*s+dy*c;return Math.abs(u)<z.L/2+p&&Math.abs(v)<z.W/2+p+4}
// run over anyone in the way, shove anyone standing in it
function tkTouch(z){const c=Math.cos(z.hd),s=Math.sin(z.hd);for(const q of PL){if(!alive(q))continue;const dx=q.x-z.x,dy=q.y-z.y,u=dx*c+dy*s,v=-dx*s+dy*c;if(Math.abs(u)>z.L/2+10||Math.abs(v)>z.W/2+10)continue;
const sg=v<0?-1:1;if(z.sp>60&&q.inv<=0){hitP(q,2,z.hd+sg*Math.PI/2);sfx('club',q.x,q.y,.6);FT.push({x:q.x,y:q.y-40,t:'RUN OVER!',c:'#ff8a3a',l:.9})}
const nv=sg*(z.W/2+12),uu=cl(u,-z.L/2-8,z.L/2+8);q.x=z.x+c*uu-s*nv;q.y=z.y+s*uu+c*nv;push(q,9)}}
function tkPark(z){HS.tkp={ci:z.ci,x:z.x,y:z.y,a:z.hd,L:z.L,W:z.W}}
// --- the Ice Cream Man: cruises the park drive lobbing giant exploding scoops from the cone on his roof ---
function svIce(z,Q,d,dt){if(!z.rd)tkInit(z);z.lb=(z.lb??2)-dt;z.ss=(z.ss??9)-dt;const hurt_=z.hp<z.mh*.5;
tkDrive(z,dt,Q.x,Q.y,d>440?235:d<160?200:125);tkTouch(z);const bx=z.x-Math.cos(z.hd)*14,by=z.y-Math.sin(z.hd)*14-6;z.ca=Math.atan2(Q.y-by,Q.x-bx);
const cx=bx+Math.cos(z.ca)*36,cy=by+Math.sin(z.ca)*36;
if(z.ss<=0&&alive(Q)&&d<900){z.ss=hurt_?8.5:11;const n=hurt_?6:5;for(let i=0;i<n;i++){const a=i/n*6.283+Math.random()*.3,r=95+Math.random()*35;ICB.push({sx:cx,sy:cy,tx:Q.x+Math.cos(a)*r,ty:Q.y+Math.sin(a)*r,t:-i*.12,T:1.3,c:i%3})}ICB.push({sx:cx,sy:cy,tx:Q.x,ty:Q.y,t:-.9,T:1.3,c:1});sfx('horn',z.x,z.y,.7);FT.push({x:z.x,y:z.y-70,t:'SCOOP STORM!',c:'#ff9ad0',l:1.4});z.lb=2.4}
else if(z.lb<=0&&alive(Q)&&d<820){z.lb=hurt_?2:2.6;const n=hurt_?3:2,vx=Q.vx||0,vy=Q.vy||0;for(let i=0;i<n;i++){const T=cl(d/480,1,1.45),px=Q.x+vx*T*.6,py=Q.y+vy*T*.6,a=Math.random()*6.283,r=i?70+Math.random()*80:0;ICB.push({sx:cx,sy:cy,tx:cl(px+Math.cos(a)*r,20,WW-20),ty:cl(py+Math.sin(a)*r,20,WH-20),t:-i*.3,T,c:Math.floor(Math.random()*3)})}sfx('swoosh',z.x,z.y,.8);z.rc=.25}
z.rc=Math.max(0,(z.rc||0)-dt);return null}
// --- the Fire Chief: phase 1 drives the engine and blasts water (straight through windows if you hide indoors); phase 2 chases you with an axe ---
function svFire14(z,Q,d,sg,aim,dt){if(z.ph==1){if(!z.rd)tkInit(z);const W=z.wb;const h=svInHouse(Q);let tx=Q.x,ty=Q.y;if(h){tx=h.x+h.w/2;ty=h.y+h.h/2}
const near=d<400&&(sg||h);tkDrive(z,dt,tx,ty,W&&W.ph?0:near?60:215);tkTouch(z);
const nx=z.x+Math.cos(z.hd)*20,ny=z.y+Math.sin(z.hd)*20;
if(W){W.t+=dt;const want=Math.atan2(Q.y-6-ny,Q.x-nx);W.a+=cl(rgAng(want-W.a),-(W.ph?1.1:3)*dt,(W.ph?1.1:3)*dt);z.ca=W.a;
if(!W.ph&&W.t>=.6){W.ph=1;W.t=0;sfx('swoosh',nx,ny,.9);if(W.th&&W.wx!=null){(HS.BW=HS.BW||[]).push({x:W.wx,y:W.wy,o:W.wo});sfx('club',W.wx,W.wy,.8);shk=Math.max(shk,.2);for(let k=0;k<16;k++){const b=Math.random()*6.283;pt.push({x:W.wx,y:W.wy,vx:Math.cos(b)*140,vy:Math.sin(b)*140,l:.5,c:k%2?'#bfe8ff':'#e8f8ff'})}FT.push({x:W.wx,y:W.wy-30,t:'CRASH! THROUGH THE WINDOW!',c:'#9ad8ff',l:1.5})}}
// beam length: stops at the first wall unless it's blasting through a window
let L=480;if(!W.th){for(let s=10;s<480;s+=4){const x=nx+Math.cos(W.a)*s,y=ny+Math.sin(W.a)*s;if(wlAt(x,y).some(w=>w[4]!=2&&(!w[4]||w[2]*w[3]>1500)&&x>w[0]-2&&x<w[0]+w[2]+2&&y>w[1]-2&&y<w[1]+w[3]+2)||(HS.TRK||[]).some(t=>Math.abs(x-t[0])<11&&Math.abs(y-t[1])<9)){L=s;break}}}W.L=L;
if(W.ph){for(let k=0;k<3;k++){const s=Math.random()*L,a=W.a+(Math.random()-.5)*.1;pt.push({x:nx+Math.cos(a)*s,y:ny+Math.sin(a)*s,vx:Math.cos(a)*80+rnd(-30,30),vy:Math.sin(a)*80+rnd(-30,30),l:.3,c:k%2?'#9ad8ff':'#e8f8ff'})}
for(const q of PL){if(!alive(q))continue;const ex_=nx+Math.cos(W.a)*L,ey_=ny+Math.sin(W.a)*L;if(Math.min(svSegD(q.x,q.y-14,nx,ny,ex_,ey_),svSegD(q.x,q.y,nx,ny,ex_,ey_),Math.hypot(q.x-ex_,q.y-6-ey_)-12)<24){hitP(q,1,W.a);q.x+=Math.cos(W.a)*110*dt;q.y+=Math.sin(W.a)*110*dt;push(q,9);q.wet=.6}}
if(W.t>=1.7){z.wb=null;z.ab=1.3+Math.random()*.8}}}
else{z.ca=Math.atan2(Q.y-6-ny,Q.x-nx);if(z.ab<=0&&alive(Q)&&d<420){if(h){const r=tkWin(h,nx,ny,Q.x,Q.y);z.wb={t:0,ph:0,a:z.ca,th:1,wx:r?r.x:null,wy:r?r.y:null,wo:r?r.o:'h'};FT.push({x:z.x,y:z.y-70,t:'NOWHERE TO HIDE!',c:'#ff8a3a',l:1.2})}else if(sg)z.wb={t:0,ph:0,a:z.ca,th:0};if(z.wb)sfx('dashwarn',z.x,z.y,.7)}}
return null}
// phase 2: fire axe
if(z.sw){const S_=z.sw;S_.t+=dt;if(S_.s==1&&S_.t>=.42){S_.s=2;S_.t=0;sfx('swoosh',z.x,z.y);for(const q of PL)if(alive(q)){const e=Math.hypot(q.x-z.x,q.y-z.y),da=Math.abs(rgAng(Math.atan2(q.y-z.y,q.x-z.x)-z.fa));if(e<66&&(da<1.15||e<26))hitP(q,2,z.fa)}}
else if(S_.s==2&&S_.t>=.2){S_.s=3;S_.t=0}else if(S_.s==3&&S_.t>=.38){z.sw=null;z.lk=0}return[z.fa,S_.s==2?60:0,0]}
if(z.ch>0){z.ch-=dt;for(const q of PL)if(alive(q)&&Math.hypot(q.x-z.x,q.y-z.y)<34)hitP(q,2,z.fa);if(z.wallHit||z.ch<=0){z.ch=0;z.lk=0;z.ab=1.2}return[z.fa,410,0]}
if(z.cw>0){z.cw-=dt;if(z.cw<=0){z.ch=.5;sfx('swoosh',z.x,z.y)}return[0,0,0]}
if(d<60&&alive(Q)){z.lk=1;z.fa=aim;z.sw={s:1,t:0};sfx('dashwarn',z.x,z.y,.5);return[0,0,0]}
if(z.ab<=0&&sg&&d>130&&d<380&&alive(Q)){z.ab=4.5+Math.random()*2;z.lk=1;z.fa=aim;z.cw=.55;sfx('dashwarn',z.x,z.y);FT.push({x:z.x,y:z.y-70,t:'HERE COMES THE AXE!',c:'#ff6a3a',l:1});return[0,0,0]}
return[sg&&d<240?aim:dirTo(z),Math.min(152,90+d*.3),0]}
// where the line from the engine to someone indoors crosses the building's wall
function tkWin(h,ax,ay,bx,by){let best=null,bt=2;const S_=[[h.x,h.y,h.x+h.w,h.y,'h'],[h.x,h.y+h.h,h.x+h.w,h.y+h.h,'h'],[h.x,h.y,h.x,h.y+h.h,'v'],[h.x+h.w,h.y,h.x+h.w,h.y+h.h,'v']];
for(const[x1,y1,x2,y2,o]of S_){const dx=bx-ax,dy=by-ay,ex=x2-x1,ey=y2-y1,den=dx*ey-dy*ex;if(Math.abs(den)<1e-6)continue;const t=((x1-ax)*ey-(y1-ay)*ex)/den,u=((x1-ax)*dy-(y1-ay)*dx)/den;if(t>=0&&t<=1&&u>=0&&u<=1&&t<bt){bt=t;best={x:ax+dx*t,y:ay+dy*t,o}}}return best}
function ffOut(z){tkPark(z);z.wb=null;z.tk=0;z.hr=0;const c=Math.cos(z.hd),s=Math.sin(z.hd);for(const k of[1,-1]){const x=z.x-s*k*(z.W/2+26),y=z.y+c*k*(z.W/2+26);if(svOK(x,y)){z.x=x;z.y=y;break}}
if(!svOK(z.x,z.y)){const p=svPt(z.x,z.y,30,220)||svPt(P.x,P.y,140,320);if(p){z.x=p.x;z.y=p.y}}sfx('kong',z.x,z.y,.6);FT.push({x:z.x,y:z.y-60,t:'THE CHIEF GRABS HIS FIRE AXE!',c:'#ffcf40',l:2.2})}
function svTick4(dt){for(const b of ICB){b.t+=dt;if(b.t>=b.T&&!b.done){b.done=1;sfx('boom',b.tx,b.ty,.8);shk=Math.max(shk,.35);const C=[['#ff9ad0','#ffd0e8'],['#7a4a2a','#a8704a'],['#f4f0e0','#fff8f0']][b.c];rg.push({x:b.tx,y:b.ty,l:.45,m:.45,r:62,c:C[0]});
for(let k=0;k<26;k++){const a=Math.random()*6.283,v=50+Math.random()*200;pt.push({x:b.tx,y:b.ty-6,vx:Math.cos(a)*v,vy:Math.sin(a)*v*.7,l:.6,c:k%2?C[0]:C[1]})}
(HS.ICP=HS.ICP||[]).push({x:b.tx,y:b.ty,l:7,c:b.c});if(HS.ICP.length>24)HS.ICP.shift();for(const q of PL)if(alive(q)&&Math.hypot(q.x-b.tx,q.y-b.ty)<62)hitP(q,2,Math.atan2(q.y-b.ty,q.x-b.tx))}}ICB=ICB.filter(b=>!b.done);
if(HS.ICP){for(const p of HS.ICP)p.l-=dt;HS.ICP=HS.ICP.filter(p=>p.l>0)}for(const q of PL)if(q.wet>0)q.wet-=dt}
// ----- drawing -----
function icTruck(g,x,y,a,L,W,ca,t,mv,rc){const R=(c,x0,y0,w,h)=>{g.fillStyle=c;g.fillRect(x0,y0,w,h)},O=(x0,y0,w,h)=>R('#16111c',x0-1,y0-1,w+2,h+2),hl=-L/2,ht=-W/2;
g.save();g.translate(x,y);g.rotate(a);R('rgba(0,0,0,.28)',hl+4,ht+6,L,W);
for(const[wx,wy]of[[hl+18,ht-3],[hl+18,W/2-3],[L/2-26,ht-3],[L/2-26,W/2-3]])R('#16111c',wx,wy,16,6);
O(hl,ht,L,W);R('#f4f4f0',hl,ht,L,W);R('#d8d8d4',hl,ht,L,3);R('#d8d8d4',hl,W/2-3,L,3);
for(let i=0;i<L-34;i+=10)R(i%20?'#ff9ad0':'#7ac8f0',hl+i,ht+3,10,4);for(let i=0;i<L-34;i+=10)R(i%20?'#7ac8f0':'#ff9ad0',hl+i,W/2-7,10,4);
R('#8fc3e8',L/2-26,ht+5,10,W-10);R('rgba(255,255,255,.4)',L/2-24,ht+6,2,W-14);R('#e8e8e4',L/2-16,ht+4,13,W-8);R('#fff4c0',L/2-3,ht+3,3,6);R('#fff4c0',L/2-3,W/2-9,3,6);R('#c0392b',hl,ht+3,2,6);R('#c0392b',hl,W/2-9,2,6);
R('#e05a9a',hl+6,-3,L-46,6);g.restore();
// the giant cone on the roof (turret) aims at you
const cx=x-Math.cos(a)*14,cy=y-Math.sin(a)*14;g.save();g.translate(cx,cy);g.fillStyle='#16111c';g.beginPath();g.arc(0,0,13,0,7);g.fill();g.fillStyle='#c8ccd4';g.beginPath();g.arc(0,0,11,0,7);g.fill();g.restore();
const k=1+(rc||0)*.8;g.save();g.translate(cx,cy-6);g.rotate(ca);g.scale(k,k);g.fillStyle='#16111c';g.beginPath();g.moveTo(-6,-10);g.lineTo(34,-16);g.lineTo(34,16);g.lineTo(-6,10);g.fill();g.fillStyle='#d8a050';g.beginPath();g.moveTo(-4,-8);g.lineTo(32,-14);g.lineTo(32,14);g.lineTo(-4,8);g.fill();
g.strokeStyle='#a87030';g.lineWidth=1;for(let i=0;i<5;i++){g.beginPath();g.moveTo(i*7,-12);g.lineTo(i*7+8,12);g.moveTo(i*7+8,-12);g.lineTo(i*7,12);g.stroke()}
g.fillStyle='#16111c';g.beginPath();g.arc(36,0,17,0,7);g.fill();g.fillStyle='#ff9ad0';g.beginPath();g.arc(36,0,15,0,7);g.fill();g.fillStyle='#ffd0e8';g.beginPath();g.arc(32,-5,6,0,7);g.fill();g.fillStyle='#c0392b';g.beginPath();g.arc(44,-9,4,0,7);g.fill();g.restore()}
function fireTruck(g,x,y,a,L,W,ca,t,lights){hwDraw(g,{k:'fire',x,y,a,L,W});const c=Math.cos(a),s=Math.sin(a);
if(lights){const on=Math.floor(t*8)%2;const lx=x+c*(L/2-36),ly=y+s*(L/2-36);g.globalAlpha=.35;g.fillStyle=on?'#ff3a2a':'#ffffff';g.beginPath();g.arc(lx-s*14,ly+c*14,16,0,7);g.fill();g.fillStyle=on?'#ffffff':'#ff3a2a';g.beginPath();g.arc(lx+s*14,ly-c*14,16,0,7);g.fill();g.globalAlpha=1}
const nx=x+c*20,ny=y+s*20;g.fillStyle='#16111c';g.beginPath();g.arc(nx,ny,10,0,7);g.fill();g.fillStyle='#c8ccd4';g.beginPath();g.arc(nx,ny,8,0,7);g.fill();g.save();g.translate(nx,ny);g.rotate(ca);g.fillStyle='#16111c';g.fillRect(-2,-5,30,10);g.fillStyle='#e8c040';g.fillRect(0,-3,26,6);g.fillStyle='#c8ccd4';g.fillRect(22,-4,8,8);g.restore()}
function tkDraw(z){if(z.ci==16){mpDraw(z);return}const t=performance.now()/1000;if(z.ci==13)icTruck(X,z.x,z.y,z.hd,z.L,z.W,z.ca??z.hd,t,z.sp>5,z.rc);else fireTruck(X,z.x,z.y,z.hd,z.L,z.W,z.ca??z.hd,t,1);
// the driver, visible through the windscreen
const c=Math.cos(z.hd),s=Math.sin(z.hd),dx=z.x+c*(z.L/2-30),dy=z.y+s*(z.L/2-30);X.fillStyle='#16111c';X.beginPath();X.arc(dx,dy,6,0,7);X.fill();X.fillStyle=z.ci==13?'#f4f4f0':'#c0392b';X.beginPath();X.arc(dx,dy,5,0,7);X.fill();
if(z.iv>0||z.hf>0){}}
function axeDraw(hx,hy,a){X.save();X.translate(hx,hy);X.rotate(a);const g=(c,x0,y0,w,h)=>{X.fillStyle=c;X.fillRect(x0,y0,w,h)};g('#16111c',-4,-3,36,6);g('#8a5a32',-3,-2,34,4);g('#a8703e',-3,-2,34,1);g('#16111c',24,-12,14,17);g('#c0392b',25,-11,10,15);g('#e8e8f0',35,-11,2,15);g('#16111c',26,3,6,6);g('#3a3d46',27,4,4,4);X.restore()}
function ffDraw(z,fy,fl,t,k){const h=64*k/1.6,S_=z.sw;let a;if(S_){if(S_.s==1)a=z.fa-fl*2.4;else if(S_.s==2)a=z.fa-fl*2.4+fl*Math.min(1,S_.t/.12)*3.3;else a=z.fa+fl*.9}else if(z.cw>0||z.ch>0)a=z.fa;else a=z.fa+fl*.7;
if(S_&&S_.s==1){const pu=.5+.5*Math.sin(t*22);X.globalAlpha=.18+.15*pu;X.fillStyle='#ff3a2a';X.beginPath();X.moveTo(z.x,z.y);X.arc(z.x,z.y,66,z.fa-1.15,z.fa+1.15);X.closePath();X.fill();X.globalAlpha=1}
if(z.cw>0){X.globalAlpha=.22+.2*Math.sin(t*22);X.strokeStyle='#ff3a2a';X.lineWidth=16;X.beginPath();X.moveTo(z.x,z.y-6);X.lineTo(z.x+Math.cos(z.fa)*200,z.y-6+Math.sin(z.fa)*200);X.stroke();X.globalAlpha=1}
svBody(14,z.x,fy,fl,z.mvg,k,z.fa,{gun:false});axeDraw(z.x+fl*4,fy-h*.5,a)}
function svExtra4(){const t=performance.now()/1000;
for(const b of ICB){if(b.t<0)continue;const u=Math.min(1,b.t/b.T),pu=.5+.5*Math.sin(t*16);X.globalAlpha=.14+.12*pu;X.fillStyle='#ff6ab0';X.beginPath();X.arc(b.tx,b.ty,62,0,7);X.fill();X.globalAlpha=.85;X.strokeStyle='#ff9ad0';X.lineWidth=2;X.beginPath();X.arc(b.tx,b.ty,62*(1-u*.7),0,7);X.stroke();X.globalAlpha=1;
const bx=b.sx+(b.tx-b.sx)*u,by=b.sy+(b.ty-b.sy)*u-Math.sin(Math.PI*u)*150,C=['#ff9ad0','#7a4a2a','#f4f0e0'][b.c];X.fillStyle='rgba(0,0,0,.2)';X.beginPath();X.ellipse(b.sx+(b.tx-b.sx)*u,b.sy+30+(b.ty-b.sy-30)*u,10,4,0,0,7);X.fill();
X.fillStyle='#16111c';X.beginPath();X.arc(bx,by,13,0,7);X.fill();X.fillStyle=C;X.beginPath();X.arc(bx,by,11,0,7);X.fill();X.fillStyle='rgba(255,255,255,.55)';X.beginPath();X.arc(bx-4,by-4,4,0,7);X.fill();if(b.c==0){X.fillStyle='#3ac0e0';X.fillRect(bx+2,by-2,3,2);X.fillStyle='#ffd84a';X.fillRect(bx-5,by+3,3,2)}}
for(const z of zs){const W=z.wb;if(!W||z.hp<=0)continue;const nx=z.x+Math.cos(z.hd)*20,ny=z.y+Math.sin(z.hd)*20,L=W.L||400,ex=nx+Math.cos(W.a)*L,ey=ny+Math.sin(W.a)*L;
if(!W.ph){X.globalAlpha=.35+.25*Math.sin(t*24);X.strokeStyle='#9ad8ff';X.lineWidth=3;X.setLineDash([10,8]);X.beginPath();X.moveTo(nx,ny);X.lineTo(nx+Math.cos(W.a)*480,ny+Math.sin(W.a)*480);X.stroke();X.setLineDash([]);X.globalAlpha=1}
else{X.lineCap='round';for(const[w,c,al]of[[22,'#3a8ad8',.35],[14,'#6ab8f0',.7],[6,'#e8f8ff',.9]]){X.globalAlpha=al;X.strokeStyle=c;X.lineWidth=w+Math.sin(t*30)*2;X.beginPath();X.moveTo(nx,ny);X.lineTo(ex,ey);X.stroke()}X.globalAlpha=.5;X.fillStyle='#e8f8ff';X.beginPath();X.arc(ex,ey,16+Math.sin(t*25)*4,0,7);X.fill();X.globalAlpha=1;X.lineCap='butt'}}
for(const q of PL)if(q.wet>0&&alive(q)){X.fillStyle='#9ad8ff';for(let i=0;i<3;i++)X.fillRect(q.x-8+i*7,q.y-30+((t*60+i*9)%22),2,4)}}
// map anims (under people): leftover trucks, melted scoops, broken windows
function tkGround(){if(HS.tkp){const p=HS.tkp,t=performance.now()/1000;if(p.ci==16)mpCar(X,p.x,p.y,p.a,p.L,p.W,t,0,1);else if(p.ci==13)icTruck(X,p.x,p.y,p.a,p.L,p.W,p.a,t,0,0);else fireTruck(X,p.x,p.y,p.a,p.L,p.W,p.a,t,0)}
if(HS.ICP)for(const p of HS.ICP){const C=['#ff9ad0','#8a5a3a','#f4f0e0'][p.c];X.globalAlpha=Math.min(.85,p.l/2);X.fillStyle=C;X.beginPath();X.ellipse(p.x,p.y,30,13,0,0,7);X.fill();X.beginPath();X.ellipse(p.x+18,p.y+6,12,6,0,0,7);X.fill();X.fillStyle='rgba(255,255,255,.4)';X.beginPath();X.ellipse(p.x-8,p.y-4,9,3,0,0,7);X.fill();X.globalAlpha=1}
if(HS.BW)for(const w of HS.BW){X.fillStyle='#16111c';if(w.o=='h')X.fillRect(w.x-17,w.y-4,34,8);else X.fillRect(w.x-4,w.y-17,8,34);X.fillStyle='#bfe8ff';for(let i=0;i<5;i++){const o=(i-2)*7;w.o=='h'?X.fillRect(w.x+o,w.y-4+(i%2)*5,3,3):X.fillRect(w.x-4+(i%2)*5,w.y+o,3,3)}X.fillStyle='rgba(120,190,240,.35)';X.beginPath();X.ellipse(w.x,w.y,40,22,0,0,7);X.fill()}}

function bHitOrd(b,ox,oy){const dx=b.x-ox,dy=b.y-oy,L=dx*dx+dy*dy||1,o=[];for(const z of zs){const r=(z.tk?Math.max(z.L,z.W)/2:(z.hr||ZT[z.t].hr||ZT[z.t].r))+8;if(svSegD(z.x,z.y,ox,oy,b.x,b.y)<r)o.push([((z.x-ox)*dx+(z.y-oy)*dy)/L,z])}return o.sort((a,c)=>a[0]-c[0]).map(q=>q[1])}
