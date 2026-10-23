//# editor/kit-view.js — Map Workshop drawing for the building kit: areas and paths (cached pictures), effects (still frames), fog / effect-zone overlays, special features, path points, the minimap marks
// ---------- drawing kit pieces in the editor ----------
// Areas and paths are drawn by the same code as the game, into a small cached picture per piece that is redrawn only when
// the piece changes (very big pieces are cached at a lower resolution). Fog and other runtime-only pieces get an overlay.
const EDKC=new WeakMap();
function edKitKey(o){return JSON.stringify([o.a,o.p,o.x,o.y,o.w,o.h,o.pts,o.c,o.c2,o.tx,o.o,o.sharp])}
function edKitBox(o,t){if(t=='a')return{x0:o.x-16,y0:o.y-24,x1:o.x+o.w+16,y1:o.y+o.h+16};const P=cmPathSm(o),b=cmPolyBB(P.length?P:[[o.x,o.y]]),T=cmPath(o.p),m=(o.w||(T&&T.w)||10)/2+(T&&T.closed?24:T&&T.cat=='road'?R0(o):28);return{x0:b.x0-m,y0:b.y0-m,x1:b.x1+m,y1:b.y1+m}}
function R0(o){const e=o.o&&o.o.ends;return e&&e!='flat'?(o.w||128)*.9+12:12}
function edKitImg(o,t){const k=edKitKey(o),c0=EDKC.get(o);if(c0&&c0.k===k)return c0;const b=edKitBox(o,t),bw=Math.max(1,b.x1-b.x0),bh=Math.max(1,b.y1-b.y0),s=Math.min(1,Math.sqrt(2.4e6/(bw*bh)));
const cv=c0?c0.c:document.createElement('canvas');cv.width=Math.ceil(bw*s);cv.height=Math.ceil(bh*s);const g=cv.getContext('2d');g.setTransform(s,0,0,s,-b.x0*s,-b.y0*s);g.clearRect(b.x0,b.y0,bw,bh);try{t=='a'?cmAreaDraw(g,o):cmPathDraw(g,o)}catch(e){}g.setTransform(1,0,0,1,0,0);const r={k,c:cv,x:b.x0,y:b.y0,w:bw,h:bh};EDKC.set(o,r);return r}
// one kit piece of the draw list (areas, paths, decals, effects) into the editor view
function edKitLook(g,o,t,a){if(t=='a'||t=='l'){const T=t=='a'?cmArea(o.a):cmPath(o.p);if(!T){edMissLook(g,o,t);return}if(t=='a'&&T.ed){edZoneLook(g,o,T);return}const I=edKitImg(o,t);if(a!=null&&a<1)g.globalAlpha=a;g.drawImage(I.c,I.x,I.y,I.w,I.h);g.globalAlpha=1;return}
if(o.fx){cmFxEd(g,o);const s=edSprite(o);if(s)g.drawImage(s.c,o.x-s.ax,o.y-s.ay);return}edObjLook(g,o,a==null?1:a)}
// a runtime-only area (fog): a soft overlay with its name
function edZoneLook(g,o,T){const c=cmCol(o.c,'#c8d0d8');g.fillStyle=c;g.globalAlpha=.16;g.fillRect(o.x,o.y,o.w,o.h);g.globalAlpha=.22;for(let i=0;i<Math.max(2,o.w*o.h/40000);i++){g.beginPath();g.ellipse(o.x+cmR(o,i,31)*o.w,o.y+cmR(o,i,34)*o.h,60,24,0,0,7);g.fill()}g.globalAlpha=1;
g.setLineDash([8/ED.cam.z,6/ED.cam.z]);g.lineWidth=1.5/ED.cam.z;g.strokeStyle=c;g.strokeRect(o.x,o.y,o.w,o.h);g.setLineDash([])}
function edMissLook(g,o,t){const b=t=='a'?{x0:o.x,y0:o.y,x1:o.x+o.w,y1:o.y+o.h}:cmPolyBB(cmPathRaw(o));g.fillStyle='rgba(255,40,70,.25)';g.fillRect(b.x0,b.y0,Math.max(4,b.x1-b.x0),Math.max(4,b.y1-b.y0));g.strokeStyle='#ff3a5a';g.lineWidth=2/ED.cam.z;g.strokeRect(b.x0,b.y0,Math.max(4,b.x1-b.x0),Math.max(4,b.y1-b.y0))}
// special features (never drawn in the game): tinted boxes with their name, the road graph's roads and nodes
function edFeatLook(g,f,px){const F=cmFeat(f.f),c=F?F.col:'#ff3a5a';if(f.pts){const N=f.pts.map(p=>[f.x+p[0],f.y+p[1]]);g.strokeStyle=c;g.lineWidth=3*px;g.globalAlpha=.75;g.beginPath();for(const e of f.e||[]){const a=N[e[0]],b=N[e[1]];if(a&&b){g.moveTo(a[0],a[1]);g.lineTo(b[0],b[1])}}g.stroke();g.globalAlpha=1;for(const n of N){g.fillStyle='#16111c';g.beginPath();g.arc(n[0],n[1],6*px,0,7);g.fill();g.fillStyle=c;g.beginPath();g.arc(n[0],n[1],4*px,0,7);g.fill()}return}
g.fillStyle=c;g.globalAlpha=.1;g.fillRect(f.x,f.y,f.w,f.h);g.globalAlpha=1;g.setLineDash([7*px,4*px]);g.lineWidth=2*px;g.strokeStyle=c;g.strokeRect(f.x,f.y,f.w,f.h);g.setLineDash([])}
function edFeatLabel(g,f,w,h){const F=cmFeat(f.f),c=F?F.col:'#ff3a5a',x=f.pts?f.x:f.x,y=f.pts?f.y:f.y,sx=edSX(x),sy=edSY(y);if(sx>w||sy>h||sx<-300||sy<-40)return;g.fillStyle=c;g.textAlign='left';g.fillText((F?F.n:'Missing feature "'+f.f+'"').toUpperCase(),sx+5,sy+(f.pts?-12:10))}
// the selected path's line (or a road graph's), highlighted
function edPtsOutline(g,o,col,lw){const A=o.pts.map(p=>[o.x+p[0],o.y+p[1]]),T=o.f?null:cmPath(o.p);g.strokeStyle=col;g.lineWidth=lw;g.setLineDash([6*lw/2,4*lw/2]);g.beginPath();A.forEach((p,i)=>i?g.lineTo(p[0],p[1]):g.moveTo(p[0],p[1]));if(T&&T.closed)g.closePath();g.stroke();g.setLineDash([])}
// minimap marks for areas and paths
function edKitMini(g,d,k,vis){for(const a of d.areas){if(!vis(a))continue;const T=cmArea(a.a);if(!T||T.ed)continue;g.fillStyle=T.cat=='struct'?'rgba(40,36,44,.85)':T.cat=='floor'?'rgba(170,130,90,.55)':T.cat=='effect'?'rgba(0,0,0,.25)':'rgba(140,140,130,.45)';g.fillRect(a.x*k,a.y*k,Math.max(1,a.w*k),Math.max(1,a.h*k))}
for(const l of d.paths){if(!vis(l))continue;const T=cmPath(l.p);if(!T)continue;const P=cmPathRaw(l);g.strokeStyle=T.cat=='road'?'rgba(60,62,68,.95)':T.cat=='barrier'?'rgba(220,225,235,.9)':T.p=='pond'||T.id=='pond'||T.id=='stream'?'rgba(48,112,160,.95)':'rgba(170,140,100,.85)';g.lineWidth=Math.max(1,(T.closed?2:(l.w||T.w))*k);
if(T.id=='pond'){g.fillStyle='rgba(48,112,160,.95)';g.beginPath();P.forEach((p,i)=>i?g.lineTo(p[0]*k,p[1]*k):g.moveTo(p[0]*k,p[1]*k));g.closePath();g.fill();continue}g.beginPath();P.forEach((p,i)=>i?g.lineTo(p[0]*k,p[1]*k):g.moveTo(p[0]*k,p[1]*k));if(T.closed)g.closePath();g.stroke()}}
