//# zombies/unstuck.js — Zombies caught on a corner, a tree or a wall work themselves free, then carry on after the player (ZUN, zUnst)
// Every chk seconds a zombie that is trying to walk checks how far it got. It is caught when it covered less than need % of
// its walk with a wall close by (or next to nothing in open ground) and no other zombie right in front of it is holding it up
// (one in a queue or at the back of a crowd just waits its turn). Then, until it has
// got 40 px away from where it was caught:
//  · it squeezes: a slimmer body against walls, no pushing off other zombies, no spreading out, and it walks the path square by
//    square through the middle of each square, which always clears the walls (z.un, read by dirTo, zSep and zSpreadA)
//  · each check it is still caught next to a wall, it side-steps for side seconds to the more open side (the other side the next time)
//  · still caught after hop seconds, it is lifted onto the nearest open square it can see, preferring squares further along its
//    path (with a puff of dust where anyone can see it)
// Ghosts, survivor bosses, the Leech on a player, leaping bosses and zombies standing still on purpose (aiming, winding up) are left alone.
// Game Balance → Spawning edits the numbers (test mode); the test switch "Show stuck zombies" marks the ones doing this.
var ZUN={chk:.5,need:25,side:.6,hop:3},ZUNC={sq:0,sd:0,hp:0};
function zUnst(z,T,a,m,dt){if(z.un>0)z.un=Math.max(0,z.un-dt);if(z.uf>0)z.uf-=dt;if(T.gh||T.sv||z.t==14||z.lp||z.alt>4)return a;
 const busy=m<.25||z.ks==1||z.ks==3||z.ds==1||z.os>0||z.ri>0,ck=Math.max(.1,+ZUN.chk||.5);
 z.uw=(z.uw||0)+(busy?0:dt);z.sc=(z.sc||0)+dt;
 if(z.sc>=ck){const t0=z.sc,w=z.uw,d=z.lx==null?1e9:Math.hypot(z.x-z.lx,z.y-z.ly),ex=T.sp*(S.df?1.5:1)*DSP()*(z.spm||1)*w,
   near=Math.hypot(P.x-z.x,P.y-z.y)<(T.cr||T.r)+40,wall=!zOpen(z)||zCellBad(z);let stuck=w>=t0*.7&&!near&&d<(wall?Math.max(3,ex*(+ZUN.need||0)/100):Math.min(4,ex*.2));
  // held up by other zombies (a queue at a door, the back of a crowd), not by a wall: it waits its turn
  const crowd=(stuck||z.sk>0)&&zCrowd(z,a);if(crowd)stuck=false;
  if(z.sk){z.ue+=t0;if(near||crowd||Math.hypot(z.x-z.ax,z.y-z.ay)>40)z.sk=0;
   else{if(stuck||wall)z.un=Math.max(z.un||0,ck*1.6);if(wall&&z.ue>=(+ZUN.hop||3))zFree(z);else if(stuck&&wall){z.sk++;zSide(z,a)}}}
  else if(stuck){z.sk=1;z.ue=0;z.ax=z.x;z.ay=z.y;z.un=Math.max(z.un||0,ck*1.6);z.uk=-1;ZUNC.sq++}
  z.sc=0;z.uw=0;z.lx=z.x;z.ly=z.y}
 if(z.ust>0){z.ust-=dt;if(!busy)return z.usa}
 return a}
// another zombie right in front of it that is not caught itself (zombies caught together at one corner don't hold each other up)
function zCrowd(z,a){const ca=Math.cos(a),sa=Math.sin(a),r=Math.min(ZT[z.t].r,22);for(const w of zs){if(w===z||w.sk>0||w.ri>0||ZT[w.t].gh||w.hp<=0)continue;const dx=w.x-z.x,dy=w.y-z.y,R=r+Math.min(ZT[w.t].r,22)+6;if(dx*dx+dy*dy>R*R)continue;
 if((dx*ca+dy*sa)/(Math.hypot(dx,dy)||1)>.35)return 1}return 0}
// the zombie stands in a square the path can't use (hard against a wall, or boxed in)
function zCellBad(z){if(!bl||!gw)return 0;const i=z.x/gs|0,j=z.y/gs|0;if(i<0||j<0||i>=gw||j>=gh)return 0;const k=j*gw+i;return bl[k]||zsF()[k]<0?1:0}
// side-step: square to the way it wants to go, a little back, to whichever side has more open squares (switching sides each time)
function zSide(z,a){const op=b=>{let n=0;for(let k=1;k<=3;k++){const x=z.x+Math.cos(b)*gs*k,y=z.y+Math.sin(b)*gs*k,i=x/gs|0,j=y/gs|0;if(x<0||y<0||i>=gw||j>=gh||bl[j*gw+i])break;n++}return n};
 const L=a-Math.PI/2-.35,R=a+Math.PI/2+.35,l=op(L),r=op(R);let s=z.usd?-z.usd:l>r?-1:r>l?1:Math.random()<.5?-1:1;
 if(!op(s<0?L:R))s=-s;z.usd=s;z.usa=op(s<0?L:R)?(s<0?L:R):a+Math.PI+rnd(-.6,.6);z.ust=Math.max(.05,+ZUN.side||.6);ZUNC.sd++}
// lift it onto the nearest open square in sight, preferring ones further along its path
function zFree(z){const F=zsF(),i0=cl(z.x/gs|0,0,gw-1),j0=cl(z.y/gs|0,0,gh-1),c0=F[j0*gw+i0];let best=-1,bs=1e9;
 for(let r=1;r<=10;r++){if(best>=0&&r>3)break;for(let j=j0-r;j<=j0+r;j++)for(let i=i0-r;i<=i0+r;i++){if(Math.max(Math.abs(i-i0),Math.abs(j-j0))!=r||i<0||j<0||i>=gw||j>=gh)continue;
  const k=j*gw+i,f=F[k];if(f<0||bl[k])continue;const s=f+r*2+(c0>=0&&f>=c0?40:0)+Math.random();if(s>=bs)continue;
  const x=i*gs+gs/2,y=j*gs+gs/2;if(!los(z,{x,y}))continue;bs=s;best=k}}
 z.ue=0;z.ax=z.x;z.ay=z.y;if(best<0)return;const x=(best%gw)*gs+gs/2,y=(best/gw|0)*gs+gs/2;
 if(zsSeen(z.x,z.y))for(let k=0;k<7;k++)pt.push({x:z.x+rnd(-8,8),y:z.y+rnd(-6,6),vx:rnd(-50,50),vy:rnd(-55,10),l:.3,c:'#b9b1a1'});
 z.x=x;z.y=y;z.lx=x;z.ly=y;z.ax=x;z.ay=y;z.ust=0;z.un=.6;z.uk=-1;z.uf=.5;ZUNC.hp++}
// test switch "Show stuck zombies": yellow ring squeezing past, orange side-stepping, red just lifted free
function zStkDr(){if(!DT('stk'))return;X.lineWidth=2;X.textAlign='center';X.font='11px VT323, ui-monospace, monospace';
 for(const z of zs){if(!(z.sk>0||z.un>0||z.uf>0))continue;const r=ZT[z.t].r+6,c=z.uf>0?'#ff5a4a':z.ust>0?'#ff9a2e':'#ffcf40';
  X.strokeStyle=c;X.beginPath();X.arc(z.x,z.y,r,0,7);X.stroke();X.fillStyle=c;X.fillText(z.uf>0?'FREED':z.ust>0?'SIDE-STEP':'SQUEEZE',z.x,z.y-r-4)}}
