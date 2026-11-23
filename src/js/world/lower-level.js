//# world/lower-level.js — The level below: ground a floor down, seen from the floor people play on (the `lower` special feature)
// ---------- the level below ----------
// A map's `lower` boxes are ground a floor or more below the floor people play on: the courtyard, the street, the parking,
// seen from a hospital's upper floor. Nobody walks there (each box is solid; bullets fly over it). The map is painted as usual,
// but what stands in a box (props, vehicles, decals, effects, areas, paths) is painted only inside the boxes and leaves no
// walk-behind picture. Each frame the boxes are drawn again from the background, smaller around the middle of the screen, so
// the ground below slides past slower than the floor (parallax); the building's outside walls run down to it (a facade wherever a
// wall faces a box, brick, concrete or glass after the wall's style), with a shadow where they meet the ground and a haze over
// it. Its lights move with it (lowLights, called by cmLight).
// functions only: cmBuild calls lowSplit / lowMake during the first map build at boot
// how much smaller the level below is drawn: one floor down 0.9, two 0.82, three 0.75
function lowS(fl){return 1/(1+.11*cl(+fl||1,1,3))}
// the point that says which level a thing is on: a box's middle, a path's first point, anything else its x,y
function lowPt(o,t){if(t=='a')return[o.x+o.w/2,o.y+o.h/2];if(t=='l'){const p=(o.pts||[])[0]||[0,0];return[o.x+p[0],o.y+p[1]]}return[o.x,o.y]}
function lowIn(R,x,y){for(const r of R)if(x>=r[0]&&x<r[0]+r[2]&&y>=r[1]&&y<r[1]+r[3])return 1;return 0}
// the map split in two: B the floor people play on (walls and all), L what stands below; null when the map has no lower boxes
function lowSplit(d){const F=(d.feats||[]).filter(f=>f.f=='lower'&&f.w>0&&f.h>0);if(!F.length)return null;const R=F.map(f=>[f.x,f.y,f.w,f.h]),lo=(o,t)=>{const p=lowPt(o,t);return lowIn(R,p[0],p[1])};
const B=Object.assign({},d,{obj:d.obj.filter(o=>!lo(o,'o')),areas:(d.areas||[]).filter(o=>!lo(o,'a')),paths:(d.paths||[]).filter(o=>!lo(o,'l'))});
const L=Object.assign({},d,{obj:d.obj.filter(o=>lo(o,'o')),areas:(d.areas||[]).filter(o=>lo(o,'a')),paths:(d.paths||[]).filter(o=>lo(o,'l')),walls:[]});
return{B,L,R,s:lowS(F[0].o&&F[0].o.fl)}}
// paint what stands below into the background, kept inside the boxes (a tree under the skybridge is hidden by it), with no
// walk-behind pictures (nobody stands down there); then what the game keeps: the boxes, their facades, lights and animations
function lowMake(g,LS){const R=LS.R,on=vRec.on;vRec.on=0;g.save();try{g.beginPath();for(const r of R)g.rect(r[0],r[1],r[2],r[3]);g.clip();for(const it of cmDrawList(LS.L,0))cmPaintIt(g,it.o,it.t)}finally{g.restore();vRec.on=on}
const F=[],fs=w=>{const s=CMWI[w.s];return!s||!s.hid};
// a facade wherever a wall's long side faces a box: e the wall's face, a..b its length, sd the side the box is on, st the wall's style
for(const w of LS.B.walls){if(!(w.w>0&&w.h>0)||!fs(w))continue;const hz=w.w>=w.h;for(const sd of[-1,1]){if(hz){const e=sd<0?w.y:w.y+w.h;if(lowIn(R,w.x+w.w/2,e+sd*4))F.push({hz:1,a:w.x,b:w.x+w.w,e,sd,st:w.s})}
 else{const e=sd<0?w.x:w.x+w.w;if(lowIn(R,e+sd*4,w.y+w.h/2))F.push({hz:0,a:w.y,b:w.y+w.h,e,sd,st:w.s})}}}
const T=cmLightData(LS.L),C=cmFxData(LS.L);return{R,s:LS.s,F,L:T?T.L:[],A:C?C.A:[]}}
// the camera's middle: the level below shrinks towards it
function lowC(){return{x:cam.x+W/2,y:cam.y+H/2}}
// the lights below, where they show this frame (cmLight adds them to the frame's lights)
// lights below light only the level below (cr: its boxes) and no wall down there blocks them (vis 0)
function lowLights(S){const Lo=HS&&HS.LOW;if(!Lo||!Lo.L.length)return;const c=lowC(),s=Lo.s,P=(x,y)=>[c.x+(x-c.x)*s,c.y+(y-c.y)*s];
for(const q of Lo.L){const p=P(q.x,q.y),o=Object.assign({},q,{x:p[0],y:p[1],r:q.r*s,vis:0,cr:Lo.R});if(q.rect){const a=P(q.rect[0],q.rect[1]);o.rect=[a[0],a[1],q.rect[2]*s,q.rect[3]*s]}S.push(o)}}
// the facade of one wall, from its top (the wall's face) down to the ground (the same line, shrunk); only when it faces the camera
const LOWFC={brick:['#6a3424','#4a2016'],concrete:['#4e525a','#363a42'],glass:['#21384c','#142434']};
function lowFacSt(st){return st=='brick'?'brick':/^(glass|window|window_x|window_b|winbroke|autodoor|door|bars|rollup)$/.test(st||'')?'glass':'concrete'}
function lowFac(f,c,s){const P=(x,y)=>[c.x+(x-c.x)*s,c.y+(y-c.y)*s],A=f.hz?[f.a,f.e]:[f.e,f.a],B=f.hz?[f.b,f.e]:[f.e,f.b],C=P(B[0],B[1]),D=P(A[0],A[1]),dv=((f.hz?D[1]:D[0])-f.e)*f.sd;
const sh=(p,q,n,a)=>{// a shadow on the ground along p..q, n px out on the box's side
 const nx=f.hz?0:f.sd*n,ny=f.hz?f.sd*n:0,mx=(p[0]+q[0])/2,my=(p[1]+q[1])/2,G=X.createLinearGradient(mx,my,mx+nx,my+ny);G.addColorStop(0,'rgba(0,0,0,'+a+')');G.addColorStop(1,'rgba(0,0,0,0)');X.fillStyle=G;
 X.beginPath();X.moveTo(p[0],p[1]);X.lineTo(q[0],q[1]);X.lineTo(q[0]+nx,q[1]+ny);X.lineTo(p[0]+nx,p[1]+ny);X.closePath();X.fill()};
if(dv<=.5){sh(A,B,30,.42);return}// it faces away: only the shadow under the ledge
sh(D,C,44*s,.5);const k=lowFacSt(f.st),col=LOWFC[k],L=(p,q,t)=>[p[0]+(q[0]-p[0])*t,p[1]+(q[1]-p[1])*t];
X.beginPath();X.moveTo(A[0],A[1]);X.lineTo(B[0],B[1]);X.lineTo(C[0],C[1]);X.lineTo(D[0],D[1]);X.closePath();const mt=L(A,B,.5),mb=L(D,C,.5),G=X.createLinearGradient(mt[0],mt[1],mb[0],mb[1]);G.addColorStop(0,col[0]);G.addColorStop(1,col[1]);X.fillStyle=G;X.fill();
X.save();X.clip();X.lineWidth=1.5;const len=f.b-f.a,line=(t0,t1,u)=>{const p=L(L(A,D,u),L(B,C,u),t0),q=L(L(A,D,u),L(B,C,u),t1);X.moveTo(p[0],p[1]);X.lineTo(q[0],q[1])},drop=t=>{const p=L(A,B,t),q=L(D,C,t);X.moveTo(p[0],p[1]);X.lineTo(q[0],q[1])};
X.beginPath();if(k=='brick'){X.strokeStyle='rgba(28,10,6,.55)';for(let u=1;u<8;u++)line(0,1,u/8);for(let i=12;i<len;i+=24)drop(i/len)}
else if(k=='glass'){X.strokeStyle='rgba(120,140,160,.55)';for(let i=0;i<=len;i+=40)drop(i/len);line(0,1,.55);X.stroke();X.beginPath();X.strokeStyle='rgba(170,200,230,.12)';X.lineWidth=6;for(let i=20;i<len;i+=120)drop(i/len)}
else{X.strokeStyle='rgba(20,22,26,.5)';line(0,1,.5);for(let i=0;i<=len;i+=96)drop(i/len)}X.stroke();X.restore();
// the slab's edge catches a little light; the ground line is dark
X.lineWidth=2;X.strokeStyle='rgba(200,214,236,.28)';X.beginPath();X.moveTo(A[0],A[1]);X.lineTo(B[0],B[1]);X.stroke();X.strokeStyle='rgba(0,0,0,.55)';X.beginPath();X.moveTo(D[0],D[1]);X.lineTo(C[0],C[1]);X.stroke()}
// draw the level below (in world space, before anyone is drawn): the background's boxes again, shrunk around the camera's middle,
// a haze, the animations down there, then the facades and shadows
function lowDraw(){const Lo=HS&&HS.LOW;if(!Lo||!BG||!BG.width)return;const x0=cam.x,y0=cam.y,x1=cam.x+W,y1=cam.y+H,V=Lo.R.filter(r=>r[0]<x1&&r[0]+r[2]>x0&&r[1]<y1&&r[1]+r[3]>y0);if(!V.length)return;
const c=lowC(),s=Lo.s,src=BGL||BG,k=BGL?BGL.k:1;X.save();try{X.beginPath();for(const r of V)X.rect(r[0],r[1],r[2],r[3]);X.clip();X.fillStyle='#24262b';X.fillRect(x0,y0,W,H);
X.save();X.translate(c.x,c.y);X.scale(s,s);X.translate(-c.x,-c.y);
// the part of the map the screen shows, one floor down (a little wider than the screen); only what is on the map
const wx=Math.max(0,c.x-W/2/s-2),wy=Math.max(0,c.y-H/2/s-2),wx1=Math.min(WW,c.x+W/2/s+2),wy1=Math.min(WH,c.y+H/2/s+2);
if(wx1>wx&&wy1>wy){const sm=X.imageSmoothingEnabled;X.imageSmoothingEnabled=true;X.drawImage(src,wx*k,wy*k,(wx1-wx)*k,(wy1-wy)*k,wx,wy,wx1-wx,wy1-wy);X.imageSmoothingEnabled=sm}
const t=performance.now()/1000;for(const it of Lo.A){if(!it.o.r||it.a){it.f.anim(it.o,t);continue}X.save();try{fxTurn(X,it.o);it.f.anim(it.o,t)}finally{X.restore()}}
X.restore();X.fillStyle='rgba(14,22,40,.24)';X.fillRect(x0,y0,W,H);
for(const f of Lo.F)if((f.hz?f.e>y0-200&&f.e<y1+200&&f.b>x0&&f.a<x1:f.e>x0-200&&f.e<x1+200&&f.b>y0&&f.a<y1))lowFac(f,c,s)}finally{X.restore()}}
