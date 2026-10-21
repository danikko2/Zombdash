//# multiplayer/split-screen-draw.js — Split-screen viewports, minimap, HUD
// ---------- split-screen drawing ----------
function VL(n){const g=4,z=v=>cl(v/560,.6,1);if(n<=1)return[{x:0,y:0,w:W,h:H,z:Math.min(1,z(H))}].map(v=>(v.z=MPn?v.z:1,v));
if(n==2){if(W>=H){const w=(W-g)/2;return[{x:0,y:0,w,h:H,z:z(H)},{x:w+g,y:0,w,h:H,z:z(H)}]}const h=(H-g)/2;return[{x:0,y:0,w:W,h,z:z(h)},{x:0,y:h+g,w:W,h,z:z(h)}]}
const w=(W-g)/2,h=(H-g)/2;return[[0,0],[1,0],[0,1],[1,1]].map(([i,j])=>({x:i*(w+g),y:j*(h+g),w,h,z:z(h)}))}
function draw(){if(mode=='edit'){edFrame();return}if(!(MPn&&P&&PL.length&&mode!='menu'&&mode!='lobby')){drawW();return}
const W0=W,H0=H,V=VL(PL.length);X.fillStyle='#070a08';X.fillRect(0,0,W,H);
for(let i=0;i<PL.length;i++){const v=V[i];P=PL[i];P.vp=v;X.save();X.beginPath();X.rect(v.x,v.y,v.w,v.h);X.clip();X.translate(v.x,v.y);X.scale(v.z,v.z);W=v.w/v.z;H=v.h/v.z;drawW();X.restore();W=W0;H=H0;
X.strokeStyle=PC[i];X.globalAlpha=.85;X.lineWidth=3;X.strokeRect(v.x+1.5,v.y+1.5,v.w-3,v.h-3);X.globalAlpha=1}
if(V.length>PL.length&&mode!='shop')mini(V[PL.length]);P=PL[0]}
function drawPlayers(){const V=P;for(const p of PL){if(p.dead)continue;P=p;if(p.dn)drawDown();else{if(MPn)ring();if(P.inv<=0||Math.floor(P.inv*20)%2)drawP();if(P.bn>0)flames()}}P=V}
function ring(){const y=P.y+18;X.globalAlpha=.85;X.strokeStyle=PC[P.pi];X.lineWidth=2;X.beginPath();X.ellipse(P.x,y-2,12,4.5,0,0,7);X.stroke();X.globalAlpha=1;
X.font='8px "Press Start 2P", ui-monospace, monospace';X.textAlign='center';X.lineWidth=3;X.strokeStyle='#070a08';X.strokeText('P'+(P.pi+1),P.x,P.y-28);X.fillStyle=PC[P.pi];X.fillText('P'+(P.pi+1),P.x,P.y-28)}
function drawDown(){const Q=PS[P.ci||0],f=Q.idle[0],w=f[2]/1.6,h=f[3]/1.6;X.fillStyle='rgba(0,0,0,.28)';X.beginPath();X.ellipse(P.x,P.y+9,h*.45,5,0,0,7);X.fill();
if(PIMG.naturalWidth){X.save();X.translate(P.x,P.y+4);X.rotate(-Math.PI/2);X.globalAlpha=.9;X.drawImage(skinImg(P.ci,P.v),f[0],f[1],f[2],f[3],-w/2,-h/2,w,h);X.restore();X.globalAlpha=1}
const k=Math.max(0,P.rt/RVT),A0=-Math.PI/2;X.lineWidth=4;X.strokeStyle='rgba(0,0,0,.55)';X.beginPath();X.arc(P.x,P.y,25,0,7);X.stroke();X.strokeStyle=k<.3&&Math.floor(performance.now()/150)%2?'#fff':'#ff5a4a';X.beginPath();X.arc(P.x,P.y,25,A0,A0+k*6.283);X.stroke();
if(P.rv>0){X.strokeStyle='#9be860';X.lineWidth=5;X.beginPath();X.arc(P.x,P.y,31,A0,A0+P.rv*6.283);X.stroke()}
if(Math.floor(performance.now()/350)%2||P.rh){X.font='8px "Press Start 2P", ui-monospace, monospace';X.textAlign='center';X.lineWidth=3;X.strokeStyle='#070a08';const t=P.rh?'REVIVING':'HELP! P'+(P.pi+1);X.strokeText(t,P.x,P.y-36);X.fillStyle=P.rh?'#9be860':PC[P.pi];X.fillText(t,P.x,P.y-36)}}
function arrows(){for(const q of PL){if(q===P||q.dead)continue;const sx=q.x-cam.x,sy=q.y-cam.y-8;if(sx>0&&sx<W&&sy>0&&sy<H)continue;const dx=sx-W/2,dy=sy-H/2,k=Math.min((W/2-20)/Math.abs(dx||1e-6),(H/2-20)/Math.abs(dy||1e-6)),ex=W/2+dx*k,ey=H/2+dy*k,a=Math.atan2(dy,dx);
if(q.dn&&Math.floor(performance.now()/250)%2)continue;X.save();X.translate(ex,ey);X.rotate(a);X.fillStyle='#070a08';X.beginPath();X.moveTo(13,0);X.lineTo(-9,-10);X.lineTo(-9,10);X.fill();X.fillStyle=q.dn?'#ff5a4a':PC[q.pi];X.beginPath();X.moveTo(10,0);X.lineTo(-7,-7);X.lineTo(-7,7);X.fill();X.restore();
X.font='8px "Press Start 2P", ui-monospace, monospace';X.textAlign='center';X.fillStyle=q.dn?'#ff5a4a':PC[q.pi];X.fillText((q.dn?'! ':'')+'P'+(q.pi+1),cl(ex-Math.cos(a)*22,18,W-18),cl(ey-Math.sin(a)*22+3,12,H-8))}}
function mini(v){X.save();X.fillStyle='#0b120d';X.fillRect(v.x,v.y,v.w,v.h);const s=Math.min((v.w-24)/WW,(v.h-56)/WH),ox=v.x+(v.w-WW*s)/2,oy=v.y+40+(v.h-50-WH*s)/2;X.globalAlpha=.7;X.drawImage(BGL||BG,ox,oy,WW*s,WH*s);X.globalAlpha=1;
for(const z of zs){const r=ZT[z.t].boss?4:1.5;X.fillStyle=ZT[z.t].boss?'#ffcf40':'#ff4a3a';X.fillRect(ox+z.x*s-r,oy+z.y*s-r,r*2,r*2)}
PL.forEach((p,i)=>{if(p.dead)return;X.fillStyle='#070a08';X.fillRect(ox+p.x*s-5,oy+p.y*s-5,10,10);X.fillStyle=p.dn&&Math.floor(performance.now()/250)%2?'#fff':PC[i];X.fillRect(ox+p.x*s-4,oy+p.y*s-4,8,8)});
X.font='12px "Press Start 2P", ui-monospace, monospace';X.fillStyle='#ffcf40';X.textAlign='center';X.fillText('WAVE '+wave,v.x+v.w/2,v.y+24);X.font='18px VT323, ui-monospace, monospace';X.fillStyle='#9fb3a0';X.fillText('zombies left: '+(toSp+zs.length),v.x+v.w/2,v.y+v.h-8);X.restore()}
function hudMP(){const F='VT323, ui-monospace, monospace',PX='"Press Start 2P", ui-monospace, monospace';X.fillStyle=PC[P.pi];X.fillRect(10,22,W>0?5:0,52);X.textAlign='center';
if(P.dn||P.dead){X.fillStyle='rgba(70,0,0,.22)';X.fillRect(0,0,W,H);const y=H*.66,bw=Math.min(W-30,360);hpanel(W/2-bw/2,y-32,bw,P.dn?74:56);X.font='13px '+PX;X.fillStyle='#ff6a5c';X.fillText(P.dn?'YOU ARE DOWN':'OUT UNTIL NEXT WAVE',W/2,y-8);X.font='19px '+F;X.fillStyle='#e9f1e2';
X.fillText(P.dn?(P.rh?'a teammate is reviving you!':'get a teammate to stand by you · '+Math.ceil(Math.max(0,P.rt))+'s'):'watching a teammate',W/2,y+14);if(P.dn){const k=Math.max(0,P.rt/RVT);X.fillStyle='#3d1414';X.fillRect(W/2-bw/2+12,y+24,bw-24,6);X.fillStyle='#ff5a4a';X.fillRect(W/2-bw/2+12,y+24,(bw-24)*k,6);X.fillStyle='#9be860';X.fillRect(W/2-bw/2+12,y+24,(bw-24)*P.rv,6)}}
else{const d=PL.filter(q=>q!==P&&q.dn);if(d.length&&Math.floor(performance.now()/400)%2){X.font='11px '+PX;X.lineWidth=5;X.strokeStyle='#070a08';const t='REVIVE '+d.map(q=>'P'+(q.pi+1)).join(' & ')+'!';X.strokeText(t,W/2,H-70);X.fillStyle='#ff6a5c';X.fillText(t,W/2,H-70)}}}
