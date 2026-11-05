//# extras/headlamp.js — The Headlamp: a light worn on the head that shines where the player aims; switching it, drawing it, its light and sounds
// Bought in the store ($100, one extras slot: extras/extras.js). F (keyboard), B (controller) or the LIGHT button (touch, store)
// turns it on and off (p.hlo). It is drawn on the survivor's head (strap and lamp: XS and HLA in render/sprites.js).
// On a map with lighting (world/kit-lighting.js) its beam is one of the dynamic lights (hlLights), so walls stop it and it is
// as strong as the dark is deep; on a daylight map it shows as a faint beam (hlDraw, walls stop that too).
// The numbers are on EXI.hl (r reach, i brightness, w beam width in degrees, fd fade), so GAME BALANCE can change them.
// switch the light (on: 1 / 0, or flip it); does nothing without a headlamp
function hlTog(p,on){if(!exHas(p,'hl'))return 0;p.hlo=on==null?(p.hlo?0:1):on?1:0;const P0=P;P=p;sfx(p.hlo?'hlon':'hloff',null,null,MPn?.7:1);P=P0;return 1}
// where the headlamp sits in this frame of the survivor's picture
function hlAt(ci,Q,f){const T=HLA[ci];if(!T||!Q)return null;let k=Q.walk.indexOf(f);if(k>=0)return T[0][k]||null;k=Q.idle.indexOf(f);return k>=0?T[1][k]||null:null}
// drawn by drawP (render/sprites.js) right over the body, in its transform (flipped to face the aim, sprite pixels / 1.6)
function hlHead(Q,f,w,h){const A=hlAt(P.ci||0,Q,f);if(!A)return;const[y,x0,x1]=A,s=1/1.6;X.fillStyle='#4a4856';X.fillRect(-w/2+x0*s,-h+y*s,(x1-x0)*s,2*s);
const F=XS.hl[P.hlo?'on':'off'];if(F&&PIMG.naturalWidth)X.drawImage(PIMG,F[0],F[1],F[2],F[3],-w/2+x1*s,-h+(y-2)*s,F[2]*s,F[3]*s)}
// the lens in world space (the same frame drawP picks: see pfr)
function hlPos(p){const Q=PS[p.ci||0];if(!Q)return null;const t=performance.now()/1000,an=p.mv?Q.walk:Q.idle,f=an[Math.floor(t*(p.mv?11:3))%an.length],A=hlAt(p.ci||0,Q,f);if(!A)return null;
const fl=Math.cos(p.a)<0?-1:1,w=f[2]/1.6,h=f[3]/1.6,by=p.y+h*.45;return{x:p.x+fl*(-w/2+(A[2]+5)/1.6),y:by-h+(A[0]+2)/1.6}}
// the beam of a player whose light is on: lens position, aim, reach, brightness, half-width (radians), fade
function hlBeam(p){if(!p||!p.hlo||!exHas(p,'hl')||p.dead||p.dn)return null;const I=EXI.hl,o=hlPos(p),r=Math.max(0,+I.r||0);if(!o||!(r>0))return null;
return{x:o.x,y:o.y,a:p.a||0,r,i:Math.max(0,+I.i||0),cw:Math.max(1,+I.w||0)/2*Math.PI/180,fd:Math.max(0,+I.fd||0)}}
// is the map dark enough for the lighting to draw it? (otherwise hlDraw shows the faint daylight beam)
function hlLit(){if(typeof cmLtOn!='function'||!cmLtOn())return false;const T=HS.LT,P_=cmLtP(T.t);return!!P_&&P_.lit*cl(+T.a||0,0,1)>.02}
// headlamps as lights for cmLight (world/kit-lighting.js): a cone that fades by fd (see cmLtOne) with a soft glow at the lens
function hlLights(S){for(const p of PL||[]){const B=hlBeam(p);if(B&&B.i>0)S.push({x:B.x,y:B.y,r:B.r,c:'#fff4d8',i:B.i,ca:B.a,cw:B.cw,fd:B.fd,gs:.8})}}
// how far a ray from the lens gets before a wall (daylight beam; every 3 px, so thin walls count too)
function hlRay(x,y,a,r){const c=Math.cos(a),s=Math.sin(a);for(let d=3;d<r;d+=3){const px=x+c*d,py=y+s*d;if(px<0||py<0||px>WW||py>WH)return d;if(wlAt(px,py).some(w=>w[4]!=2&&px>w[0]&&px<w[0]+w[2]&&py>w[1]&&py<w[1]+w[3]))return d}return r}
// called from drawW (render/world-and-hud.js) before the lighting: the faint beam on daylight maps, and a bright dot at the lens
function hlDraw(){if(!PL||!PL.length)return;const lit=hlLit();
for(const p of PL){const B=hlBeam(p);if(!B)continue;X.save();X.globalCompositeOperation='lighter';
 if(!lit&&B.i>0){const a=.13*Math.min(2,B.i),g=X.createRadialGradient(B.x,B.y,0,B.x,B.y,B.r);for(const u of[0,.2,.4,.6,.8,.92])g.addColorStop(u,'rgba(255,240,200,'+Math.min(1,a*Math.pow(1-u,B.fd)).toFixed(3)+')');g.addColorStop(1,'rgba(255,240,200,0)');X.fillStyle=g;
  // the beam's outline, cut short by walls: rays across it and a little past each edge (that part drawn fainter, for a soft edge)
  // (worked out once a frame: split screen draws every beam in every view)
  const C=p.hlC;let R=C&&C.k===last&&C.x===B.x&&C.y===B.y&&C.a===B.a&&C.r===B.r&&C.cw===B.cw?C.R:null;
  if(!R){const n=LMX?12:24,a0=B.a-B.cw*1.4,da=B.cw*2.8/n;R=[];for(let j=0;j<=n;j++){const u=a0+da*j;R.push([u,hlRay(B.x,B.y,u,B.r)])}
   for(const e of[-1,1])R.push([B.a+e*B.cw,hlRay(B.x,B.y,B.a+e*B.cw,B.r)]);R.sort((p,q)=>p[0]-q[0]);p.hlC={k:last,x:B.x,y:B.y,a:B.a,r:B.r,cw:B.cw,R}}
  for(const[k,al]of[[1.4,.45],[1,1]]){X.globalAlpha=al;X.beginPath();X.moveTo(B.x,B.y);for(const[u,d]of R)if(Math.abs(u-B.a)<=B.cw*k+1e-9)X.lineTo(B.x+Math.cos(u)*d,B.y+Math.sin(u)*d);X.closePath();X.fill()}X.globalAlpha=1}
 const g2=X.createRadialGradient(B.x,B.y,0,B.x,B.y,7);g2.addColorStop(0,'rgba(255,248,215,'+Math.min(.9,.5+.3*B.i).toFixed(2)+')');g2.addColorStop(1,'rgba(255,240,200,0)');X.fillStyle=g2;X.fillRect(B.x-7,B.y-7,14,14);X.restore()}}
// ---------- sounds ----------
Object.assign(SF,{
// Headlamp on: a firm click and a faint rising whine as the LED comes up
hlon:(t,d)=>{osc('square',2600,2600,t,.012,.09,d,.001);noise(t,.03,.14,d,'highpass',3000);osc('sine',1400,2100,t+.02,.07,.03,d,.005);return .1},
// Headlamp off: a lower click
hloff:(t,d)=>{osc('square',1700,1700,t,.012,.09,d,.001);noise(t,.03,.12,d,'highpass',2400);return .05}});
