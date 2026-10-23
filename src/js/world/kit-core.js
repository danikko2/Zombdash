//# world/kit-core.js — Building kit core: the registries for decals, areas (floors, structures, effect zones), paths (roads, trails, fences, ponds), effects and special features; shared geometry (smoothing, polygons, boxes along a line)
// ---------- building kit: registries ----------
// The kit adds five kinds of map pieces to the custom map format (version 3):
//   decals   d.obj items with dc: flat pictures on the ground (cracks, stains, skid marks...), turned and scaled, never solid
//   effects  d.obj items with fx: animated or lit things (fountain spray, fire, smoke, flickering light, sirens...)
//   areas    d.areas: boxes with a size (x,y,w,h): room floors, rugs, porches, docks, parking stalls, roofs on solid blocks, fog / darkness zones
//   paths    d.paths: lines through points (x,y = the first point, pts relative to it): roads, trails, fences, guard rails, ponds
//   features d.feats: map systems the game reads (boss road graph, City Hall roof, store shelves, no-spawn zone, building interiors)
// Each registry entry is plain data plus drawing functions, like the terrain registry. To add one: cmAddDec / cmAddArea / cmAddPath / cmAddFx.
// functions and registries only: nothing here runs during the first map build at boot
const CMDEC=[],CMDI=Object.create(null),CMAREA=[],CMAI=Object.create(null),CMPA=[],CMPAI=Object.create(null),CMFX=[],CMFXI=Object.create(null);
function cmAddDec(t){if(!CMDI[t.id])CMDEC.push(t);CMDI[t.id]=t}
function cmAddArea(t){if(!CMAI[t.id])CMAREA.push(t);CMAI[t.id]=t}
function cmAddPath(t){if(!CMPAI[t.id])CMPA.push(t);CMPAI[t.id]=t}
function cmAddFx(t){if(!CMFXI[t.id])CMFX.push(t);CMFXI[t.id]=t}
// special features: rect ones are boxes (x,y,w,h); the road graph is nodes (pts, relative to x,y) and edges (e)
const CMFEAT=[
{id:'nospawn',n:'No-spawn zone',rect:1,col:'#ff9a3a',d:'Zombies never appear inside it (like the inside of the Haunted Mansion).'},
{id:'house',n:'Building interior',rect:1,col:'#7ad0ff',d:'Bosses that look for players inside buildings check these boxes. Indoor floors count too.'},
{id:'store',n:'Store (Penny)',rect:1,col:'#ffd84a',d:'Penny\'s fight: the store box; grocery shelves inside it get knocked over and cart corrals send carts.'},
{id:'cityhall',n:'City Hall roof (Mayor)',rect:1,col:'#c8a0ff',d:'The Mayor watches from the top middle of this roof.'},
{id:'roadgraph',n:'Boss road graph',graph:1,col:'#4ae0ff',d:'Where the ice cream truck, the fire engine and the police cruiser can drive: nodes joined by roads.'}];
const CMFEI=Object.create(null);for(const f of CMFEAT)CMFEI[f.id]=f;
// what a d.obj item is: 'p' prop, 'v' vehicle, 'd' decal, 'x' effect
function cmOK(o){return o.dc?'d':o.fx?'x':o.veh?'v':'p'}
function cmDec(k){return typeof k=='string'&&cmOwn(CMDI,k)?CMDI[k]:null}
function cmArea(k){return typeof k=='string'&&cmOwn(CMAI,k)?CMAI[k]:null}
function cmPath(k){return typeof k=='string'&&cmOwn(CMPAI,k)?CMPAI[k]:null}
function cmFx(k){return typeof k=='string'&&cmOwn(CMFXI,k)?CMFXI[k]:null}
function cmFeat(k){return typeof k=='string'&&cmOwn(CMFEI,k)?CMFEI[k]:null}
// text on signs, awnings, decals: no markup, short
function cmTxt(s,n){return String(s==null?'':s).replace(/[<>]/g,'').replace(/[\u0000-\u001f]/g,' ').slice(0,n||40)}
// a colour from a map file (#rgb or #rrggbb), else the fallback
function cmCol(c,def){return typeof c=='string'&&/^#[0-9a-f]{6}$/i.test(c)?c.toLowerCase():def}
// ----- geometry -----
// a Catmull-Rom curve through the points (closed: back to the start), seg steps per span
function cmSmooth(P,closed,seg){const n=P.length;if(n<3)return P.map(p=>[p[0],p[1]]);const o=[],L=closed?n:n-1,at=i=>closed?P[(i+n)%n]:P[Math.max(0,Math.min(n-1,i))];
for(let i=0;i<L;i++){const p0=at(i-1),p1=at(i),p2=at(i+1),p3=at(i+2),s=seg||Math.max(2,Math.min(16,Math.round(Math.hypot(p2[0]-p1[0],p2[1]-p1[1])/14)));
for(let k=0;k<s;k++){const t=k/s,t2=t*t,t3=t2*t;o.push([.5*(2*p1[0]+(-p0[0]+p2[0])*t+(2*p0[0]-5*p1[0]+4*p2[0]-p3[0])*t2+(-p0[0]+3*p1[0]-3*p2[0]+p3[0])*t3),.5*(2*p1[1]+(-p0[1]+p2[1])*t+(2*p0[1]-5*p1[1]+4*p2[1]-p3[1])*t2+(-p0[1]+3*p1[1]-3*p2[1]+p3[1])*t3)])}}
if(!closed)o.push([P[n-1][0],P[n-1][1]]);return o}
// a path's points in world space (raw, then smoothed unless the path has straight corners: fences by default, any path with sharp:true;
// sharp:false curves a fence)
function cmPathRaw(o){return(o.pts||[]).map(p=>[o.x+p[0],o.y+p[1]])}
const CMSMC=new WeakMap();
function cmPathSm(o){const R=cmPathRaw(o),T=cmPath(o.p),closed=!!(T&&T.closed),sharp=o.sharp!=null?!!o.sharp:!!(T&&T.sharp),k=JSON.stringify(R)+closed+sharp,c=CMSMC.get(o);if(c&&c.k===k)return c.P;
const P=sharp?(closed&&R.length?R.concat([R[0]]):R):cmSmooth(R,closed);CMSMC.set(o,{k,P});return P}
// point in polygon (even-odd)
function cmPolyIn(P,x,y){let c=false;for(let i=0,j=P.length-1;i<P.length;j=i++){const a=P[i],b=P[j];if((a[1]>y)!=(b[1]>y)&&x<(b[0]-a[0])*(y-a[1])/(b[1]-a[1]+1e-9)+a[0])c=!c}return c}
// distance from a point to a polyline
function cmPolyDist(P,x,y){let d=1e9;for(let i=1;i<P.length;i++){const a=P[i-1],b=P[i],dx=b[0]-a[0],dy=b[1]-a[1],L=dx*dx+dy*dy;let t=L?((x-a[0])*dx+(y-a[1])*dy)/L:0;t=Math.max(0,Math.min(1,t));d=Math.min(d,Math.hypot(a[0]+dx*t-x,a[1]+dy*t-y))}if(P.length==1)d=Math.hypot(P[0][0]-x,P[0][1]-y);return d}
function cmPolyLen(P){let L=0;for(let i=1;i<P.length;i++)L+=Math.hypot(P[i][0]-P[i-1][0],P[i][1]-P[i-1][1]);return L}
function cmPolyBB(P){let x0=1e9,y0=1e9,x1=-1e9,y1=-1e9;for(const p of P){x0=Math.min(x0,p[0]);y0=Math.min(y0,p[1]);x1=Math.max(x1,p[0]);y1=Math.max(y1,p[1])}return{x0,y0,x1,y1}}
// walk along a polyline every step px: fn(x, y, angle, distance)
function cmAlong(P,step,fn,start){let acc=start||0;for(let i=1;i<P.length;i++){const a=P[i-1],b=P[i],L=Math.hypot(b[0]-a[0],b[1]-a[1]);if(!L)continue;const an=Math.atan2(b[1]-a[1],b[0]-a[0]);let d=(step-acc%step)%step;for(;d<L;d+=step)fn(a[0]+(b[0]-a[0])*d/L,a[1]+(b[1]-a[1])*d/L,an,acc+d);acc+=L}}
// square boxes along a polyline (fences, rails, streams): size s, every step px, wall flag fl
function cmBoxesAlong(P,s,step,fl,out){cmAlong(P,step,(x,y)=>out.push([x-s/2,y-s/2,s,s,fl]));if(P.length){const q=P[P.length-1];out.push([q[0]-s/2,q[1]-s/2,s,s,fl])}}
// a filled polygon as thin horizontal blockers (the game only has boxes): rows of h px
function cmPolyBoxes(P,h,fl,out){const B=cmPolyBB(P);for(let y=Math.floor(B.y0/h)*h;y<B.y1;y+=h){const yc=y+h/2,X_=[];for(let i=0,j=P.length-1;i<P.length;j=i++){const a=P[i],b=P[j];if((a[1]>yc)!=(b[1]>yc))X_.push(a[0]+(yc-a[1])*(b[0]-a[0])/(b[1]-a[1]))}X_.sort((a,b)=>a-b);for(let k=0;k+1<X_.length;k+=2)if(X_[k+1]-X_[k]>1)out.push([X_[k],y,X_[k+1]-X_[k],h,fl])}}
// stroke a polyline
function cmLine(g,P,w,c,cap){if(P.length<2)return;g.lineCap=cap||'round';g.lineJoin='round';g.strokeStyle=c;g.lineWidth=w;g.beginPath();g.moveTo(P[0][0],P[0][1]);for(let i=1;i<P.length;i++)g.lineTo(P[i][0],P[i][1]);g.stroke();g.lineCap='butt';g.lineJoin='miter'}
function cmFillPoly(g,P,c){if(P.length<3)return;g.fillStyle=c;g.beginPath();g.moveTo(P[0][0],P[0][1]);for(let i=1;i<P.length;i++)g.lineTo(P[i][0],P[i][1]);g.closePath();g.fill()}
// a polyline moved sideways by d px (positive = to the right of the direction of travel)
function cmOffset(P,d){return P.map((p,i)=>{const a=P[Math.max(0,i-1)],b=P[Math.min(P.length-1,i+1)],dx=b[0]-a[0],dy=b[1]-a[1],L=Math.hypot(dx,dy)||1;return[p[0]-dy/L*d,p[1]+dx/L*d]})}
// dashed stroke along a polyline: dash px on, gap px off
function cmDash(g,P,w,c,dash,gap){if(P.length<2)return;g.save();g.setLineDash&&g.setLineDash([dash,gap]);cmLine(g,P,w,c,'butt');g.setLineDash&&g.setLineDash([]);g.restore()}
// shades of a colour (same as the coloured props)
function cmK(c){return pcK(cmCol(c,'#888888'))}
// a seeded random number for a piece (stable between loads)
function cmR(o,i,k){return cmH((o.x||0)*.37+i*1.7,(o.y||0)*.53+k,k*.31+i)}
