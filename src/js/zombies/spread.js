//# zombies/spread.js — Zombies fan out in open ground and come at the player from different sides instead of following each other in a line
// ---------- spreading out ----------
// Every zombie picks a side when it first moves (z.fo, -1 = far left … +1 = far right, 0 = straight on). While it can see the
// player and the way to its side is clear, it heads for a point beside the player instead of straight at them, so a crowd
// arrives in an arc rather than single file. That side point closes in as the zombie gets near, so every zombie still reaches
// the player. Out of sight (round corners, through doors) zombies follow the normal path. Bosses, survivors and ghosts don't spread.
// ZSPR: far = how far out to the side per pixel of distance, max = the most it swings out (px), near = from this close it just goes for you
const ZSPR={far:.75,max:220,near:60,chk:.3};
function zSpreadA(z,T,a,dt){
if(T.boss||T.gh||T.sv||z.t==14||z.lp||z.alt>4||z.x<0||z.y<0||z.x>WW||z.y>WH||!alive(P))return a;
if(z.fo===undefined){const r=Math.random();z.fo=r<.15?0:(r<.575?-1:1)*(.3+Math.random()*.7)}
const dx=P.x-z.x,dy=P.y-z.y,d=Math.hypot(dx,dy);if(d<ZSPR.near||!z.fo)return a;
const o=z.fo*Math.min((d-ZSPR.near)*ZSPR.far,ZSPR.max),tx=P.x-dy/d*o,ty=P.y+dx/d*o;
// whether the wide way is clear is checked a few times a second, not every frame (line-of-sight checks cost)
// a zombie that got stuck goes back to the normal path for a few seconds
if(z.un>0)z.sno=3;if(z.sno>0){z.sno-=dt;return a}
z.sct=(z.sct??Math.random()*ZSPR.chk)-dt;if(z.sct<=0){z.sct=ZSPR.chk;z.sok=tx>10&&ty>10&&tx<WW-10&&ty<WH-10&&!fdBad(tx,ty)&&zOpen(z)&&zWide(z,P,ZT[z.t].r+6)&&zWide(z,{x:tx,y:ty},ZT[z.t].r+6)}
return z.sok?Math.atan2(ty-z.y,tx-z.x):a}
// clear line from a to b for something r wide: the middle line and both edges are free of walls
function zWide(a,b,r){const dx=b.x-a.x,dy=b.y-a.y,d=Math.hypot(dx,dy)||1,nx=-dy/d*r,ny=dx/d*r;
return los(a,b)&&los({x:a.x+nx,y:a.y+ny},{x:b.x+nx,y:b.y+ny})&&los({x:a.x-nx,y:a.y-ny},{x:b.x-nx,y:b.y-ny})}
// zombies standing on each other push apart a little (bigger ones move less), so a crowd fills out instead of stacking into one file
function zSep(dt){const C=40,G=new Map(),L=[];
for(const z of zs){const T=ZT[z.t];if(z.hp<=0||T.sv||T.gh||z.lp||z.alt>4||z.t==14)continue;const k=((z.x/C|0)+500)*4096+((z.y/C|0)+500);let b=G.get(k);if(!b)G.set(k,b=[]);z.si=L.length;b.push(z);L.push(z)}
const f=Math.min(1,dt*10);
for(const z of L){const r=Math.min(ZT[z.t].r,22),ci=z.x/C|0,cj=z.y/C|0;
for(let i=ci-1;i<=ci+1;i++)for(let j=cj-1;j<=cj+1;j++){const b=G.get((i+500)*4096+(j+500));if(!b)continue;
for(const w of b){if(w.si<=z.si||z.un>0||w.un>0)continue;const r2=Math.min(ZT[w.t].r,22),dx=w.x-z.x,dy=w.y-z.y,dd=dx*dx+dy*dy,R=(r+r2)*.8;if(dd>=R*R)continue;
const d=Math.sqrt(dd)||.01,ov=(R-d)*f*.5,ux=d>.01?dx/d:Math.random()-.5,uy=d>.01?dy/d:Math.random()-.5,mz=ZT[z.t].boss?0:r2/(r+r2),mw=ZT[w.t].boss?0:r/(r+r2);
z.x-=ux*ov*mz*2;z.y-=uy*ov*mz*2;w.x+=ux*ov*mw*2;w.y+=uy*ov*mw*2}}}
for(const z of L){push(z,Math.min(ZT[z.t].r,22))}}
// open ground round a zombie: no wall in the path grid within two cells of it (hugging a wall or in a doorway it follows the path)
function zOpen(z){if(!bl||!gw)return 1;const ci=z.x/gs|0,cj=z.y/gs|0;for(let i=ci-2;i<=ci+2;i++)for(let j=cj-2;j<=cj+2;j++){if(i<0||j<0||i>=gw||j>=gh)continue;if(bl[j*gw+i])return 0}return 1}
