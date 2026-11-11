//# zombies/spawn-near.js — Zombies appear within walking reach of a player, many crawling up out of the ground (ZSPN, zsPick, the crawl-out and its holes)
// ---------- where a zombie appears ----------
// What counts is the walking distance from the player the zombie is after (along the path zombies take: 16 px a square of
// the path grid), not the straight line. A zombie appears between near and far of it:
//  · gnd % crawl out of the ground at a random open spot in that band, never closer than min px (straight line) to any
//    player, and never in a no-spawn zone, in or against a wall, in water the props keep out of, or where no path leads out
//  · the rest come from the map's spawn points that lie in the band (the nearest ones beyond it when none do); one a player
//    can see crawls out there too (when none lie in the band, the zombie crawls out of the ground instead, and only when no
//    ground spot fits either does it come from the nearest points beyond the band). Maps without spawn points keep their
//    ring just off the screen for the zombies that don't crawl out.
// Bosses, survivor bosses and ghosts keep the old way, and so does everything with on = 'classic' (far spawn points, or just
// off the screen). rise = seconds a crawl-out takes: the zombie can be shot meanwhile, but it can't move or hurt anyone.
// Game Balance → Spawning edits every number here (test mode).
var ZSPN={on:'near',near:420,far:950,gnd:55,min:300,rise:1.2},ZHL=[],ZSPC={g:0,p:0,o:0};
function zsReset(){ZHL=[];ZSPC={g:0,p:0,o:0};ZUNC={sq:0,sd:0,hp:0}}
// the walking map of the player P (split screen: their own) and the walking distance (px) from P to a spot, -1 = no way there
function zsF(){return MPn&&P&&P.fd&&P.fd.length===fd.length?P.fd:fd}
function zsW(F,x,y){const v=F[cl(y/gs|0,0,gh-1)*gw+cl(x/gs|0,0,gw-1)];return v<0?-1:v*gs}
function zsWall(x,y,r){return wlAt(x,y).some(w=>x>w[0]-r&&x<w[0]+w[2]+r&&y>w[1]-r&&y<w[1]+w[3]+r)}
// could a player see this spot (inside the map and on someone's screen)
function zsSeen(x,y){if(x<0||y<0||x>WW||y>WH)return false;return PL.some(p=>alive(p)&&Math.abs(p.x-x)<W/2+50&&Math.abs(p.y-y)<H/2+70)}
// where the next zombie of type t appears: [x, y, crawls out] or null for the old way
function zsPick(t){const T=ZT[t];if(ZSPN.on!='near'||!T||T.boss||T.sv||T.gh||!fd||!bl||!gw||!P){ZSPC.o++;return null}
 const F=zsF(),nr=Math.max(0,+ZSPN.near||0),fr=Math.max(nr+40,+ZSPN.far||0),g=Math.random()*100<(+ZSPN.gnd||0);
 // a map without spawn points: the ground share crawls out, the rest come in from just off the screen (the old ring)
 const pts=!!zsPts(),G=()=>zsGround(F,nr,fr,t),Q=k=>pts?zsPoint(F,nr,fr,k):null;
 let s=g?G()||Q(1):pts?Q(1)||G():zsRing(F,fr);if(!s)s=Q(0);
 ZSPC[!s||s[3]?'o':s[2]==2?'g':'p']++;return s}
// the old ring just off the screen, keeping to spots the path reaches within far × 1.4 (a long way round a barrier is skipped)
function zsRing(F,fr){const R=Math.hypot(W,H)/2+40;for(let n=0;n<12;n++){const a=Math.random()*6.283,x=cl(P.x+Math.cos(a)*R,-20,WW+20),y=cl(P.y+Math.sin(a)*R,-20,WH+20),w=zsW(F,x,y);
 if(w<0||w>fr*1.4||fdBad(x,y)||spBad(x,y)||(x>HS.nx0&&x<HS.nx1&&y>HS.ny0&&y<HS.ny1)||(x>0&&x<WW&&y>0&&y<WH&&zsWall(x,y,14)))continue;return[x,y,0,1]}return null}
// the map's spawn points (a custom map's spawn zones count by their middle)
function zsPts(){if(HS.CZ){const c=[];for(const p of HS.CZ.p)c.push([p[0],p[1],0,0]);for(const q of HS.CZ.z)c.push([q[0],q[1],q[2],q[3]]);return c}return HS.sp?HS.sp.map(p=>[p[0],p[1],0,0]):null}
// strict: only points in the band; otherwise the nearest ones beyond it (a map whose spawn points are all far away)
function zsPoint(F,nr,fr,strict){const C=zsPts();if(!C||!C.length)return null;const A=PL.filter(alive),inb=[],out=[];
 for(const q of C){const x=q[0]+q[2]/2,y=q[1]+q[3]/2;if(spBad(x,y))continue;const w=zsW(F,x,y);if(w<0)continue;if(A.some(p=>p!==P&&Math.hypot(p.x-x,p.y-y)<nr*.6))continue;
  if(w>=nr&&w<=fr)inb.push(q);else if(w>fr)out.push([w,q])}
 let q=inb.length?inb[Math.random()*inb.length|0]:null;
 if(!q&&!strict&&out.length){out.sort((a,b)=>a[0]-b[0]);q=out[Math.random()*Math.min(3,out.length)|0][1]}
 if(!q)return null;let x,y;
 if(q[2]){let n=0;do{x=q[0]+Math.random()*q[2];y=q[1]+Math.random()*q[3]}while(n++<10&&(fdBad(x,y)||zsWall(x,y,12)))}else{x=q[0]+rnd(-14,14);y=q[1]+rnd(-14,14)}
 return[x,y,zsSeen(x,y)?1:0]}
// a random open spot in the band, 64 px or more inside the map (its edges are where zombies walk in): the straight line from P
// picks the spot, the path checks it
function zsGround(F,nr,fr,t){const A=PL.filter(alive),mn=Math.max(0,+ZSPN.min||0),r=Math.min(ZT[t].r,22)+4,M=64,d0=Math.max(mn,nr*.7),dd=Math.max(10,fr-d0);
 for(let n=0;n<24;n++){const a=Math.random()*6.283,d=d0+Math.random()*dd,x=P.x+Math.cos(a)*d,y=P.y+Math.sin(a)*d;
  if(x<M||y<M||x>WW-M||y>WH-M)continue;const k=(y/gs|0)*gw+(x/gs|0);if(bl[k]||F[k]<0)continue;const w=F[k]*gs;if(w<nr*.8||w>fr*1.4)continue;
  if(spBad(x,y)||(x>HS.nx0&&x<HS.nx1&&y>HS.ny0&&y<HS.ny1)||NOGO.some(q=>x>q[0]&&x<q[2]&&y>q[1]&&y<q[3])||zsWall(x,y,r)||A.some(p=>Math.hypot(p.x-x,p.y-y)<mn))continue;
  return[x,y,2]}return null}
// ---------- crawling out ----------
// z.ri = seconds of the crawl-out left (of z.rT); z.sf = the ground it comes through (the footstep surfaces: grass, soft, dirt, wood, hard)
const ZDC=[['#140e08','#4a3420','#5d7a34'],['#14110d','#5b4a3a','#8a7a66'],['#170f08','#5a3d22','#8a6238'],['#120a05','#6e4826','#a0703e'],['#141416','#55565c','#8c8d94']];
function zRise(z){z.ri=z.rT=Math.max(.1,+ZSPN.rise||1.2);z.sf=zSurfAt(z.x,zFeet(z)[0]);sfx(SN[z.sf]||'dirt',z.x,z.y,1.2,.08)}
function zSurfAt(x,y){try{if(!SURF||!SGW)return 2;const i=cl(x/16|0,0,SGW-1),j=cl(y/16|0,0,Math.max(0,(SURF.length/SGW|0)-1));return SURF[j*SGW+i]|0}catch(e){return 2}}
// the zombie's feet (y), height and width as drawn
function zFeet(z){const T=ZT[z.t],A=typeof SPR!='undefined'&&SPR.complete&&SPR.naturalWidth&&ZS[z.t];if(A&&A.walk&&A.walk[0]){const f=A.walk[0],s=T.sz||1,h=f[3]/1.6*s;return[z.y+h*.42,h,f[2]/1.6*s]}return[z.y+T.r,T.r*2,T.r*2]}
function zRiseUpd(z,dt){z.ri-=dt;const T=ZT[z.t],c=ZDC[z.sf|0]||ZDC[2],u=1-z.ri/z.rT,F=zFeet(z);
 if(Math.random()<dt*(u<.3?10:16))pt.push({x:z.x+rnd(-T.r,T.r)*.8,y:F[0]+rnd(-3,2),vx:(Math.random()<.5?-1:1)*rnd(20,70),vy:-rnd(30,90),l:rnd(.2,.4),c:Math.random()<.65?c[1]:c[2]});
 if(z.ri<=0){z.ri=0;ZHL.push({x:z.x,y:F[0],w:F[2],c,l:3,L:3});if(ZHL.length>40)ZHL.shift();for(let k=0;k<8;k++)pt.push({x:z.x+rnd(-10,10),y:F[0],vx:rnd(-80,80),vy:-rnd(20,80),l:.35,c:c[1]});sfx(SN[z.sf]||'dirt',z.x,z.y,1.2,.08)}}
function zHoleUpd(dt){if(!ZHL.length)return;for(const h of ZHL)h.l-=dt;ZHL=ZHL.filter(h=>h.l>0)}
// the hole: a dark pit with clods round it (k 0..1 how far it has opened); the lip is the front half, drawn over the zombie
function zHoleDr(g,x,y,w,k,c){const rx=Math.max(5,w*.4)*k,ry=rx*.38;g.fillStyle=c[0];g.beginPath();g.ellipse(x,y,rx,ry,0,0,7);g.fill();
 g.fillStyle=c[1];for(let i=0;i<9;i++){const a=i/9*6.283+.3,s=2+i*7%3;g.fillRect(Math.round(x+Math.cos(a)*rx*1.08-s/2),Math.round(y+Math.sin(a)*ry*1.3-s/2),s+1,s)}
 g.fillStyle=c[2];for(let i=0;i<4;i++){const a=i/4*6.283+1.1;g.fillRect(Math.round(x+Math.cos(a)*rx*1.35-1),Math.round(y+Math.sin(a)*ry*1.6-1),2,2)}}
function zHoleLip(g,x,y,w,k,c){const rx=Math.max(5,w*.4)*k,ry=rx*.38;g.fillStyle=c[1];for(let i=0;i<9;i++){const a=i/9*6.283+.3;if(Math.sin(a)<.15)continue;const s=2+i*7%3;g.fillRect(Math.round(x+Math.cos(a)*rx*1.08-s/2),Math.round(y+Math.sin(a)*ry*1.3-s/2),s+1,s)}
 g.fillRect(Math.round(x-rx*.7),Math.round(y+ry*.55),Math.round(rx*1.4),2)}
// each pit and lip is drawn once per ground and zombie size into a small picture (ZHC); every frame copies it (one drawImage a hole)
const ZHC={};
function zHoleImg(w,c,lip){const key=(lip?'l':'p')+Math.round(w)+c[1];if(key in ZHC)return ZHC[key];let e=null;
 try{const rx=Math.max(5,w*.4),cw=Math.ceil(rx*2.9)+6,ch=Math.ceil(rx*.38*3.4)+8,cv=document.createElement('canvas');cv.width=cw;cv.height=ch;const g=cv.getContext('2d');if(g){(lip?zHoleLip:zHoleDr)(g,cw/2,ch/2,w,1,c);e={cv,w:cw,h:ch}}}catch(_){e=null}
 return ZHC[key]=e}
function zHoleAt(x,y,w,k,c,lip){const e=zHoleImg(w,c,lip);if(!e||!e.cv.width){(lip?zHoleLip:zHoleDr)(X,x,y,w,k,c);return}const dw=e.w*k,dh=e.h*k;if(dw<1)return;X.drawImage(e.cv,0,0,e.w,e.h,Math.round(x-dw/2),Math.round(y-dh/2),Math.round(dw),Math.round(dh))}
// holes left behind fade out over 3 s (drawn under the zombies; only the ones on screen)
function zHoles(){if(!ZHL.length)return;const x0=cam.x-60,y0=cam.y-60,x1=cam.x+W+60,y1=cam.y+H+60;for(const h of ZHL){if(h.x<x0||h.x>x1||h.y<y0||h.y>y1)continue;X.globalAlpha=Math.min(1,h.l/h.L*1.6)*.9;zHoleAt(h.x,h.y,h.w,1,h.c)}X.globalAlpha=1}
// a zombie crawling out: the pit opens and hands come up first, then it rises out of the ground, rocking, cut off at the pit
function zRiseDr(z){const F=zFeet(z),fy=F[0],h=F[1],w=F[2],u=cl(1-z.ri/z.rT,0,1),c=ZDC[z.sf|0]||ZDC[2],k=Math.min(1,u*3.5),T=ZT[z.t];
 zHoleAt(z.x,fy,w,k,c);const e=u<.25?0:1-Math.pow(1-(u-.25)/.75,2.2);
 if(u>.06&&u<.4){const hy=fy-1-Math.min(1,(u-.06)/.2)*6,hc=T.c||'#7d9f5a';X.fillStyle=hc;for(const s of[-1,1]){const hx=Math.round(z.x+s*w*.16);X.fillRect(hx-1,Math.round(hy),3,Math.round(fy-hy));X.fillRect(hx-2,Math.round(hy)-2,1,3);X.fillRect(hx,Math.round(hy)-3,1,3);X.fillRect(hx+2,Math.round(hy)-2,1,3)}}
 if(e>0){X.save();X.beginPath();X.rect(z.x-w*1.5-20,fy-h*2-60,w*3+40,h*2+60);X.clip();X.translate(Math.sin(u*38+(z.ph||0))*(1-e)*2.4,(1-e)*h*1.05);z._rd=1;try{zDr(z)}finally{z._rd=0;X.restore()}}
 zHoleAt(z.x,fy,w,k,c,1)}
