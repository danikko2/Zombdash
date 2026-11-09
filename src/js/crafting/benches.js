//# crafting/benches.js — Workbenches on the map: where they go, how they look at each bench level, walking up to one, mid-wave ammo crafting, the minimap
// ---------- where the benches go ----------
// BN = the benches of the map being played: {x,y} is the middle of the bench's front edge, on the floor.
// Map Workshop maps place them with the Crafting Bench piece (HS.BNP, set by cmBuild); a custom map without one gets one bench
// next to the player start. Built-in maps get benches by size (bnCount): under 6.5 M px² one bench, up to 9.5 M two, bigger three.
// The first is a short walk from the player start; the others go to the middle of the other parts of the map (bnPlace splits
// the ground the player can reach into that many regions), on open ground away from walls, effects and zombie spawn points.
var BN=[],BNMB=0;const BNW=[0,64,64,96,128,128],BNH=[0,46,62,66,74,86];
function bnCount(){const a=WW*WH/1e6;return a>=9.5?3:a>=6.5?2:1}
function bnRoom(x,y,w,h){const i0=Math.floor((x-w/2-10)/gs),i1=Math.floor((x+w/2+10)/gs),j0=Math.floor((y-h)/gs),j1=Math.floor((y+30)/gs);
 if(i0<1||j0<1||i1>=gw-1||j1>=gh-1)return 0;for(let j=j0;j<=j1;j++)for(let i=i0;i<=i1;i++)if(bl[j*gw+i])return 0;return 1}
function bnClear(x,y){const sp=HS.sp||[];for(const q of sp)if(Math.hypot(q[0]-x,q[1]-y)<130)return 0;const C=HS.CX;if(C&&C.A)for(const it of C.A){const o=it.o;if(o&&o.fx!=null&&Math.hypot(o.x-x,o.y-(y-30))<80)return 0}return 1}
function bnCell(x,y){return fd[cl(Math.floor(y/gs),0,gh-1)*gw+cl(Math.floor(x/gs),0,gw-1)]}
function bnPlace(){BN=[];try{const P0=HS.BNP;if(P0&&P0.length){BN=P0.slice(0,8).map(q=>({x:q[0],y:q[1]}));return}
 const px=HS.px,py=HS.py;bfs(fd,px,py);const n=cmIs(mapId)?1:bnCount();
 // spots where the biggest bench fits, its front can be reached, and nothing else is in the way
 const C=[],st=gs;for(let y=st*3;y<WH-st*2;y+=st)for(let x=st*5;x<WW-st*5;x+=st){const d=bnCell(x,y+18);if(d<0)continue;if(!bnRoom(x,y,BNW[5],BNH[5]))continue;if(!bnClear(x,y))continue;C.push({x,y,d})}
 let L=C;if(!L.length){for(let y=st*3;y<WH-st*2;y+=st)for(let x=st*3;x<WW-st*3;x+=st){const d=bnCell(x,y+18);if(d>=0&&bnRoom(x,y,64,30))L.push({x,y,d})}}
 if(!L.length){BN=[{x:cl(px,40,WW-40),y:cl(py-40,50,WH-10)}];return}
 // the first bench: about 120 px of walking from the start, never on top of the players
 let b=null,bs=1e9;for(const c of L){if(Math.hypot(c.x-px,c.y-py)<70)continue;const s=Math.abs(c.d-8)*16+Math.hypot(c.x-px,c.y-py)*.05;if(s<bs){bs=s;b=c}}
 if(!b)b=L[0];BN.push({x:b.x,y:b.y});if(n<2)return;
 // the others: split the reachable ground into n regions (k-means, starting from the start and the spots farthest from it)
 const R=[];for(let j=0;j<gh;j+=2)for(let i=0;i<gw;i+=2)if(fd[j*gw+i]>=0)R.push([i*gs+gs/2,j*gs+gs/2]);if(R.length<n*4)return;
 const K=[[px,py]];while(K.length<n){let f=null,fdst=-1;for(const r of R){let m=1e9;for(const k of K)m=Math.min(m,Math.hypot(r[0]-k[0],r[1]-k[1]));if(m>fdst){fdst=m;f=r}}K.push([f[0],f[1]])}
 for(let it=0;it<10;it++){const sx=K.map(()=>0),sy=K.map(()=>0),sn=K.map(()=>0);for(const r of R){let bi=0,bd=1e18;for(let k=0;k<K.length;k++){const d=(r[0]-K[k][0])**2+(r[1]-K[k][1])**2;if(d<bd){bd=d;bi=k}}sx[bi]+=r[0];sy[bi]+=r[1];sn[bi]++}
  for(let k=0;k<K.length;k++)if(sn[k]){K[k][0]=sx[k]/sn[k];K[k][1]=sy[k]/sn[k]}}
 let home=0,hd=1e18;for(let k=0;k<K.length;k++){const d=Math.hypot(K[k][0]-px,K[k][1]-py);if(d<hd){hd=d;home=k}}
 const far=Math.min(WW,WH)*.28;for(let k=0;k<K.length;k++){if(k==home)continue;let c0=null,cd=1e18;for(const c of L){if(BN.some(q=>Math.hypot(q.x-c.x,q.y-c.y)<far))continue;const d=Math.hypot(c.x-K[k][0],c.y-K[k][1]);if(d<cd){cd=d;c0=c}}if(c0)BN.push({x:c0.x,y:c0.y})}
 }catch(e){if(!BN.length)BN=[{x:cl(HS.px||WW/2,40,WW-40),y:cl((HS.py||WH/2)-40,50,WH-10)}]}}
// ---------- how a bench looks: bigger, with more tools, lights and a better sign at each bench level ----------
const BNF={A:'010101111101101',B:'110101110101110',C:'011100100100011',E:'111100110100111',H:'101101111101101',K:'101101110101101',M:'101111101101101',N:'110101101101101',O:'010101101101010',P:'110101110100100',R:'110101110101101',S:'011100010001110',W:'101101101111101',Y:'101101010010010'};
function bnTxt(q,s,x,y,c){q.fillStyle=c;for(const ch of s){const f=BNF[ch];if(f)for(let k=0;k<15;k++)if(f[k]=='1')q.fillRect(x+k%3,y+(k/3|0),1,1);x+=4}}
function bnTxW(s){return s.length*4-1}
// a picture with the dark outline every prop has (S2 in maps/props/objects.js)
function bnOut(c){try{const q=c.getContext('2d'),w=c.width,h=c.height,d=q.getImageData(0,0,w,h),a=d.data,o=new Uint8ClampedArray(a);
 for(let j=0;j<h;j++)for(let i=0;i<w;i++)if(a[(j*w+i)*4+3]==0)for(const[dx,dy]of[[1,0],[-1,0],[0,1],[0,-1]]){const nx=i+dx,ny=j+dy;if(nx>=0&&ny>=0&&nx<w&&ny<h&&a[(ny*w+nx)*4+3]>0){const k=(j*w+i)*4;o[k]=22;o[k+1]=17;o[k+2]=28;o[k+3]=255;break}}
 q.putImageData(new ImageData(o,w,h),0,0)}catch(e){}return c}
function bnPeg(q,x,y,w,h,L){R_(q,'#6a4a2a',x,y,w,h);R_(q,'#8a6238',x+1,y+1,w-2,h-2);for(let j=y+3;j<y+h-2;j+=4)for(let i=x+3;i<x+w-2;i+=4)R_(q,'#5a3e22',i,j,1,1);
 // tools: wrench, hammer, saw, screwdrivers, and more of them at higher levels
 R_(q,'#a8adb7',x+5,y+4,2,12);R_(q,'#a8adb7',x+4,y+3,4,2);R_(q,'#a8adb7',x+4,y+15,4,2);
 R_(q,'#7a4a26',x+12,y+6,2,12);R_(q,'#5a5d64',x+9,y+4,8,3);
 R_(q,'#d8dce4',x+19,y+5,12,5);R_(q,'#7a4a26',x+31,y+5,4,5);for(let i=0;i<6;i++)R_(q,'#8a909c',x+20+i*2,y+10,1,1);
 if(L>=3){R_(q,'#c0392b',x+38,y+4,2,4);R_(q,'#a8adb7',x+38.5|0,y+8,1,6);R_(q,'#e8b830',x+42,y+4,2,4);R_(q,'#a8adb7',x+42,y+8,1,6);R_(q,'#3a8ad8',x+46,y+4,2,4);R_(q,'#a8adb7',x+46,y+8,1,6)}
 if(L>=4){R_(q,'#5a5d64',x+w-10,y+4,6,6);R_(q,'#8a909c',x+w-9,y+5,4,4);R_(q,'#2a2c32',x+w-8,y+6,2,2);R_(q,'#c0392b',x+w-12,y+12,8,3)}
 if(L>=5){R_(q,'#e8b830',x,y,w,1);R_(q,'#e8b830',x,y+h-1,w,1)}}
function bnSign(q,cx,y,L){const t=['','BENCH','WORKBENCH','WORKSHOP','WORKSHOP','ARMORY'][L],tw=bnTxW(t);
 if(L==1){const w=tw+6;R_(q,'#c8a46a',cx-w/2|0,y,w,9);R_(q,'#b08a52',cx-w/2|0,y+8,w,1);bnTxt(q,t,(cx-tw/2|0),y+2,'#3a2a1a');return}
 if(L==2){const w=tw+8;R_(q,'#7a5232',cx-w/2|0,y,w,10);R_(q,'#9a6a3c',cx-w/2|0,y,w,1);R_(q,'#5a3a22',(cx-w/2|0)+2,y+10,1,3);R_(q,'#5a3a22',(cx+w/2|0)-3,y+10,1,3);bnTxt(q,t,(cx-tw/2|0),y+3,'#f0d890');return}
 if(L==3){const w=tw+10;R_(q,'#3a4a5a',cx-w/2|0,y,w,11);R_(q,'#5a6e82',cx-w/2|0,y,w,1);R_(q,'#2a3440',cx-w/2|0,y+10,w,1);bnTxt(q,t,(cx-tw/2|0),y+3,'#9be860');return}
 if(L==4){const w=tw+18;R_(q,'#2a2c32',cx-w/2|0,y,w,14);R_(q,'#c0392b',(cx-w/2|0)+2,y+2,w-4,10);R_(q,'#d84a3a',(cx-w/2|0)+2,y+2,w-4,1);bnTxt(q,t,(cx-tw/2|0),y+4,'#ffe9a0');return}
 const w=tw*2+16;R_(q,'#16201a',cx-w/2|0,y,w,18);R_(q,'#2a3a2e',cx-w/2|0,y,w,1);
 // big two-pixel letters for the top sign
 q.save();q.translate((cx-tw)|0,y+4);q.scale(2,2);bnTxt(q,t,0,0,'#c8ff8a');q.restore()}
const BNA={};
function bnArt(L){L=cl(L|0||1,1,BPMAX);if(BNA[L])return BNA[L];const w=BNW[L],h=BNH[L],c=document.createElement('canvas');c.width=w;c.height=h;const q=c.getContext('2d');
 try{const bx=L>=4?64:L>=3?34:32,fy=h-1;
  if(L>=2)bnPeg(q,bx-30,L>=5?24:L>=4?18:L>=3?14:12,60,L>=3?30:28,L);
  if(L>=4&&OB.gcab_t)OB.gcab_t.f(q,17,fy,.5);
  OB.gbench&&OB.gbench.f(q,bx,fy,.5);
  if(L>=3&&OB.gchest)OB.gchest.f(q,L>=4?109:80,fy,.5);
  if(L>=3){R_(q,'#5a5d64',bx-26,fy-31,6,4);R_(q,'#3a3d46',bx-25,fy-27,4,2)}
  if(L>=3){const lx=bx-24,ly=L>=5?22:L>=4?16:12;R_(q,'#2a2c32',lx,ly-6,1,6);R_(q,'#3a3d46',lx-3,ly,7,3);R_(q,'#ffe9a0',lx-2,ly+3,5,1)}
  if(L>=4){const lx=bx+24,ly=L>=5?22:16;R_(q,'#2a2c32',lx,ly-6,1,6);R_(q,'#3a3d46',lx-3,ly,7,3);R_(q,'#ffe9a0',lx-2,ly+3,5,1)}
  if(L>=5){for(let x=2;x<w-2;x+=6){R_(q,'#2a2c32',x,20+((x/6|0)%2),6,1);R_(q,['#ff6b5e','#ffcf40','#9be860','#6fd3ff'][(x/6|0)%4],x+2,21+((x/6|0)%2),2,2)}}
  bnSign(q,bx,L==1?3:L==2?1:L==3?1:2,L);
 }catch(e){}
 return BNA[L]=bnOut(c)}
// lamps and signs that glow (drawn every frame over the picture)
function bnGlow(b,L){const t=performance.now()/1000,x=Math.round(b.x),y=Math.round(b.y),w=BNW[L],h=BNH[L],ox=x-w/2,oy=y-h;if(L<3)return;
 const bx=ox+(L>=4?64:34);X.save();X.globalCompositeOperation='lighter';
 const glow=(gx,gy,r,c,a)=>{const g=X.createRadialGradient?X.createRadialGradient(gx,gy,0,gx,gy,r):null;if(!g)return;g.addColorStop(0,c.replace('A',a));g.addColorStop(1,c.replace('A',0));X.fillStyle=g;X.fillRect(gx-r,gy-r,r*2,r*2)};
 glow(bx-24,oy+(L>=5?27:L>=4?21:17),34,'rgba(255,220,140,A)',.22);if(L>=4)glow(bx+24,oy+(L>=5?27:21),34,'rgba(255,220,140,A)',.22);
 if(L>=5)glow(bx,oy+12,58,'rgba(170,255,110,A)',.18+.06*Math.sin(t*3));
 X.restore();
 if(L==4){const sw=bnTxW('WORKSHOP')+18,sx=bx-sw/2|0,sy=oy+2;for(let i=0;i<sw;i+=4){X.fillStyle=((i/4|0)+(t*4|0))%2?'#ffe9a0':'#7a5a20';X.fillRect(sx+i,sy-1,2,2);X.fillRect(sx+i,sy+14,2,2)}}}
// ---------- drawing on the map ----------
// each player sees the benches at their own bench level (in split screen too: P is the player of the part being drawn)
function bnDraw(){if(!BN.length||!P)return;const L=bpLv(P.ac),A=bnArt(L);for(const b of BN){if(b.x<cam.x-140||b.x>cam.x+W+140||b.y<cam.y-60||b.y>cam.y+H+140)continue;
 X.fillStyle='rgba(0,0,0,.28)';X.beginPath();X.ellipse(b.x,b.y-2,BNW[L]/2+2,7,0,0,7);X.fill();X.drawImage(A,Math.round(b.x-A.width/2),Math.round(b.y-A.height));bnGlow(b,L)}}
// over the lighting: what the bench is doing for this player, and what pressing the button would do
function bnTop(){if(!BN.length||!P||mode=='menu'||mode=='lobby')return;const near=bnNear(P),L=bpLv(P.ac),PX='"Press Start 2P", ui-monospace, monospace',now=performance.now()/1000;
 BN.forEach((b,i)=>{const j=P.bj&&P.bj[i],top=b.y-BNH[L]-14;
  if(j){const k=Math.min(1,j.t/j.T),c=AMI[j.k]?AMI[j.k].c:'#9be860';X.lineWidth=5;X.strokeStyle='rgba(7,10,8,.8)';X.beginPath();X.arc(b.x,top,13,0,7);X.stroke();X.lineWidth=3;X.strokeStyle=c;X.beginPath();X.arc(b.x,top,13,-Math.PI/2,-Math.PI/2+k*6.283);X.stroke();
   if(k>=1){X.fillStyle=c;X.globalAlpha=.55+.45*Math.sin(now*6);X.beginPath();X.arc(b.x,top,8,0,7);X.fill();X.globalAlpha=1}
   X.font='8px '+PX;X.textAlign='center';X.lineWidth=3;X.strokeStyle='#070a08';const t=k>=1?'READY':Math.ceil(j.T-j.t)+'s';X.strokeText(t,b.x,top+3);X.fillStyle='#e9f1e2';X.fillText(t,b.x,top+3)}
  // other players' jobs: a small dot in their colour
  if(MPn)PL.forEach((q,pi)=>{if(q===P||!q.bj||!q.bj[i])return;const k=Math.min(1,q.bj[i].t/q.bj[i].T);X.fillStyle='#070a08';X.fillRect(b.x-30+pi*10,b.y+6,8,5);X.fillStyle=PC[pi];X.fillRect(b.x-29+pi*10,b.y+7,6*k,3)});
  if(i==near&&alive(P)&&!P.bo&&mode=='play'){const t=bnHint(P,i);if(!t)return;X.font='9px '+PX;X.textAlign='center';const y=j?top-22:top-2,tw=X.measureText(t).width+14;X.fillStyle='rgba(7,10,8,.82)';X.fillRect(b.x-tw/2,y-12,tw,17);X.fillStyle='#9be860';X.fillRect(b.x-tw/2,y+4,tw,1);X.fillStyle='#e9f1e2';X.fillText(t,b.x,y)}});
 bnArrow()}
// during the break, an arrow at the edge of the screen to the nearest bench when none is on screen
function bnArrow(){if(!BRK||!P||!alive(P)||P.bo)return;let b=null,bd=1e9;for(const q of BN){const sx=q.x-cam.x,sy=q.y-20-cam.y;if(sx>-20&&sx<W+20&&sy>-20&&sy<H+20)return;const d=Math.hypot(q.x-P.x,q.y-P.y);if(d<bd){bd=d;b=q}}if(!b)return;
 const sx=b.x-cam.x,sy=b.y-20-cam.y,dx=sx-W/2,dy=sy-H/2,k=Math.min((W/2-34)/Math.abs(dx||1e-6),(H/2-34)/Math.abs(dy||1e-6)),ex=cam.x+W/2+dx*k,ey=cam.y+H/2+dy*k,a=Math.atan2(dy,dx);
 X.save();X.translate(ex,ey);X.rotate(a);X.fillStyle='#070a08';X.beginPath();X.moveTo(15,0);X.lineTo(-9,-11);X.lineTo(-9,11);X.fill();X.fillStyle='#9be860';X.beginPath();X.moveTo(11,0);X.lineTo(-6,-7);X.lineTo(-6,7);X.fill();X.restore();
 X.font='8px "Press Start 2P", ui-monospace, monospace';X.textAlign='center';X.lineWidth=3;X.strokeStyle='#070a08';const lx=ex-Math.cos(a)*26,ly=ey-Math.sin(a)*26+3;X.strokeText('BENCH',lx,ly);X.fillStyle='#9be860';X.fillText('BENCH',lx,ly)}
// ---------- walking up to a bench ----------
function bnFoot(b,L){const w=BNW[L]/2-2;return[b.x-w,b.y-16,b.x+w,b.y]}
function bnNear(p){if(!p||!BN.length)return -1;const L=bpLv(p.ac);let bi=-1,bd=1e9;BN.forEach((b,i)=>{const f=bnFoot(b,L),dx=Math.max(f[0]-p.x,0,p.x-f[2]),dy=Math.max(f[1]-p.y,0,p.y-f[3]);if(dx<24&&dy<26){const d=Math.hypot(dx,dy);if(d<bd){bd=d;bi=i}}});return bi}
// the bench stands on the floor: players walk round it (zombies climb over)
function bnPush(p){const L=bpLv(p.ac);for(const b of BN){const f=bnFoot(b,L),r=8;if(p.x<f[0]-r||p.x>f[2]+r||p.y<f[1]-r||p.y>f[3]+r)continue;const o=[[p.x-(f[0]-r),-1,0],[(f[2]+r)-p.x,1,0],[p.y-(f[1]-r),0,-1],[(f[3]+r)-p.y,0,1]].sort((a,b)=>a[0]-b[0])[0];p.x+=o[1]*o[0];p.y+=o[2]*o[0]}}
// which key to show (E on a keyboard, A on a controller, nothing on a touch screen: it has a button)
function bnPad(p){return p.inp!=='km'&&(p.inp!=='any'||(GP.length>0&&!MSE.on&&!mouse.d))}
function bnTch(){return!PCM()}
function bnHint(p,i){const k=bnTch()&&!MPn?'':bnPad(p)?'A · ':'E · ';if(BRK)return k+'OPEN BENCH';const j=p.bj&&p.bj[i];if(j)return j.t>=j.T?k+'COLLECT':'';const a=bnAmmo(p);if(!a)return p.own.some(i=>!amSt(p,i))?'AMMO FULL':'NO AMMO NEEDED';return k+'MAKE '+bnAN(a)+' · '+pc(AMI[a].cost,p)+' SCRAP'}
function bnAN(k){return AMI[k].s+(k=='pa'||k=='ri'?' AMMO':'')}
// the button: between waves it opens the bench (everything); during a wave it only makes ammo
function bnUse(p){if(!p||!alive(p)||mode!='play'||TUT)return 0;const i=bnNear(p);if(i<0)return 0;if(BRK){bnOpen(p,i);return 1}bnCraft(p,i);return 1}
function bnOpen(p,i){p.bo={i};sfx('click');if(!MPn){P=p;return shop()}p.sx=null;P=PL[0];shop()}
function bnLeave(pi){const p=pi==null?P:PL[pi];if(MPn){if(p){p.bo=null;p.rdy=0}P=PL[0];sfx('click');return shop()}if(mode!='shop')return;if(p)p.bo=null;mode='play';L=R=null;ui.innerHTML='';sfx('click');music('menu')}
// ---------- mid-wave ammo crafting ----------
// what the bench makes for this player: ammo for the gun in hand, else for the first carried gun that can take more
// (starting guns have endless ammo, so they never need any)
function bnAmmo(p){const G=[p.cur,...p.own.filter(i=>i!==p.cur)];for(const i of G){if(!WP[i]||amSt(p,i))continue;const k=AMT[i];if(k&&AMI[k]&&(p.am[k]||0)<AMI[k].max)return k}return null}
function bnCraft(p,i){const J=p.bj||(p.bj={}),j=J[i],b=BN[i];
 if(j){if(j.t>=j.T)return bnTake(p,i,1);FT.push({x:b.x,y:b.y-60,t:'CRAFTING · '+Math.ceil(j.T-j.t)+'s',c:'#e9f1e2',l:.9});sfx('deny');return}
 const k=bnAmmo(p);if(!k){FT.push({x:b.x,y:b.y-60,t:p.own.some(i=>!amSt(p,i))?'AMMO FULL':'YOUR GUN NEEDS NO AMMO',c:'#e9f1e2',l:1.2});sfx('deny');return}
 const I=AMI[k],c=pc(I.cost,p);if(p.cash<c){FT.push({x:b.x,y:b.y-60,t:'NEED '+c+' SCRAP',c:'#ff6a5c',l:1.2});sfx('deny');return}
 p.cash-=c;try{chEv(p,'spend',c)}catch(e){}J[i]={k,t:0,T:bpCraftT(bpLv(p.ac)),c};sfx('click');FT.push({x:b.x,y:b.y-60,t:'MAKING '+bnAN(k),c:I.c,l:1.2})}
function bnTake(p,i,manual){const j=p.bj&&p.bj[i];if(!j)return;const I=AMI[j.k];if(!manual&&(p.am[j.k]||0)>=I.max)return;p.am[j.k]=Math.min(I.max,(p.am[j.k]||0)+I.buy);delete p.bj[i];sfx('rlsh',null,null,.9);const b=BN[i];FT.push({x:b.x,y:b.y-60,t:'+'+I.buy+' '+bnAN(j.k),c:I.c,l:1.3})}
// every frame of play: the jobs run (whether or not the player stays), finished ammo waits until its player comes back for it
function bnUpd(dt){if(!BN.length)return;for(const p of PL){if(!p.dead)bnPush(p);const J=p.bj;if(!J)continue;const near=alive(p)?bnNear(p):-1;for(const i in J){const j=J[i];if(j.t<j.T){j.t+=dt;if(j.t>=j.T){j.t=j.T;const b=BN[i];if(b){FT.push({x:b.x,y:b.y-70,t:'AMMO READY',c:AMI[j.k].c,l:1.4});if(p===P||!MPn)sfx('buy',b.x,b.y,.6)}}}else if(+i===near)bnTake(p,+i,0)}}}
// ---------- the minimap (top right): the map, benches with this player's job, players and zombies ----------
function bnMini(y0){if(!P||!WW||!WH||mode=='menu'||mode=='lobby')return;const mw=Math.round(cl(Math.min(W,H)*.24,96,150)),s=Math.min(mw/WW,mw*.9/WH),w=Math.round(WW*s),h=Math.round(WH*s),x=Math.round(W-10-w),y=Math.round(y0);
 X.save();X.fillStyle='rgba(7,10,8,.78)';X.fillRect(x-4,y-4,w+8,h+8);X.globalAlpha=.75;try{X.drawImage(BGL||BG,x,y,w,h)}catch(e){}X.globalAlpha=1;X.strokeStyle='rgba(155,232,96,.35)';X.lineWidth=1;X.strokeRect(x-3.5,y-3.5,w+7,h+7);
 X.strokeStyle='rgba(236,243,230,.5)';X.strokeRect(x+cam.x*s,y+cam.y*s,Math.min(w,W*s),Math.min(h,H*s));
 for(const z of zs){const b=ZT[z.t].boss;X.fillStyle=b?'#ffcf40':'#ff4a3a';const r=b?2.5:1;X.fillRect(x+z.x*s-r,y+z.y*s-r,r*2,r*2)}
 const now=performance.now()/1000;BN.forEach((b,i)=>{const bx=x+b.x*s,by=y+(b.y-10)*s,j=P.bj&&P.bj[i];X.fillStyle='#070a08';X.fillRect(bx-5,by-4,10,8);X.fillStyle=BRK&&Math.sin(now*5)>0?'#c8ff8a':'#9be860';X.fillRect(bx-4,by-3,8,6);
  if(j){const k=Math.min(1,j.t/j.T);X.lineWidth=2;X.strokeStyle='rgba(7,10,8,.9)';X.beginPath();X.arc(bx,by,8,0,7);X.stroke();X.strokeStyle=AMI[j.k].c;X.beginPath();X.arc(bx,by,8,-Math.PI/2,-Math.PI/2+k*6.283);X.stroke()}});
 PL.forEach((p,i)=>{if(p.dead)return;X.fillStyle='#070a08';X.fillRect(x+p.x*s-3,y+p.y*s-3,6,6);X.fillStyle=MPn?PC[i]:'#ecf3e6';X.fillRect(x+p.x*s-2,y+p.y*s-2,4,4)});X.restore();BNMB=y+h+10;return BNMB}
// ---------- the Map Workshop piece ----------
// A Crafting Bench placed in the Map Workshop is a working bench (cmFeatHS puts it in HS.BNP). gm: the game draws it, so the
// map's background leaves it out; the editor and thumbnails show the level 1 bench. It blocks nothing for zombies.
OB.craftbench={w:64,h:46,c:0,gm:1,f:(g,x,y)=>{const a=bnArt(1);g.drawImage(a,Math.round(x-a.width/2),Math.round(y-a.height))}};
