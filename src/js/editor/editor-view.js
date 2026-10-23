//# editor/editor-view.js — Drawing the Map Workshop canvas: terrain in cached chunks, walls / props / vehicles in layer order, markers, selection, collision shapes, previews, minimap, thumbnails
// ---------- editor drawing ----------
const EDCS=16; // tiles per side of a cached terrain chunk
// which tile layers the editor shows (b: Terrain, r: Roads & paths)
function edTileVis(){const d=ED.d,t=cmLy(d,'terrain'),r=cmLy(d,'roads');return{b:!(t&&t.hid),r:!(r&&r.hid)}}
function edChunk(cx,cy){const E=ED,T=E.d.tile,S_=EDCS*T,k=cx+','+cy;let c=E.ch.get(k);if(!c){c={cv:document.createElement('canvas'),dirty:1};c.cv.width=c.cv.height=S_;E.ch.set(k,c)}
if(c.dirty){const g=c.cv.getContext('2d');g.setTransform(1,0,0,1,0,0);g.clearRect(0,0,S_,S_);g.setTransform(1,0,0,1,-cx*S_,-cy*S_);cmGround(g,E.d,cx*EDCS,cy*EDCS,(cx+1)*EDCS,(cy+1)*EDCS,1,edTileVis());g.setTransform(1,0,0,1,0,0);c.dirty=0;c.lo=null}return c.cv}
// a smaller picture of a chunk (f = 1/2 or 1/4 size) with its walls, props and vehicles baked in, for zoomed-out views; rebuilt after a change
function edChunkLo(cx,cy,f){const E=ED,cv=edChunk(cx,cy),c=E.ch.get(cx+','+cy),L_=c.lo||(c.lo={});if(L_[f]&&L_[f].v===E.ver)return L_[f].c;const S_=cv.width,l=L_[f]?L_[f].c:document.createElement('canvas');l.width=l.height=S_*f;const q=l.getContext('2d');
q.setTransform(1,0,0,1,0,0);q.clearRect(0,0,l.width,l.height);q.imageSmoothingEnabled=true;try{q.imageSmoothingQuality='high'}catch(e){}q.drawImage(cv,0,0,l.width,l.height);q.setTransform(f,0,0,f,-cx*S_*f,-cy*S_*f);
const x0=cx*S_,y0=cy*S_,x1=x0+S_,y1=y0+S_,d=E.d;
if(E.loV!==E.ver){E.loL=cmDrawList(d,1).map(it=>{if(it.t=='w')return{o:it.o,t:'w'};if(it.t=='a'||it.t=='l'){const b=edKitBox(it.o,it.t);return{o:it.o,t:it.t,b}}const sp=edSprite(it.o);return{o:it.o,t:'o',r:sp?Math.max(sp.c.width,sp.c.height):30}});E.loV=E.ver}
for(const{o,t,r,b}of E.loL){if(t=='w'){if(o.x<x1&&o.x+o.w>x0&&o.y<y1&&o.y+o.h>y0)edWallLook(q,o,1)}else if(b){if(b.x0<x1&&b.x1>x0&&b.y0<y1&&b.y1>y0)edKitLook(q,o,t)}else if(o.x-r<x1&&o.x+r>x0&&o.y-r<y1&&o.y+r>y0)edKitLook(q,o,'o')}
q.setTransform(1,0,0,1,0,0);L_[f]={c:l,v:E.ver};return l}
// a changed tile repaints its chunk and its neighbours' (shorelines look across tile edges)
function edTileDirty(i){const E=ED,d=E.d,tx=i%d.w,ty=(i/d.w)|0;for(const[a,b]of[[0,0],[1,0],[-1,0],[0,1],[0,-1],[2,0],[-2,0],[0,2],[0,-2]]){const x=tx+a,y=ty+b;if(x<0||y<0||x>=d.w||y>=d.h)continue;const c=E.ch.get(Math.floor(x/EDCS)+','+Math.floor(y/EDCS));if(c)c.dirty=1}E.mmDirty=1;E.need=1}
function edAllDirty(){if(!ED)return;for(const c of ED.ch.values()){c.cv.width=0;c.cv.height=0;for(const k in c.lo||{}){c.lo[k].c.width=0;c.lo[k].c.height=0}}ED.ch.clear();ED.mmDirty=1;ED.need=1}
// local box of an object's sprite around its anchor (x,y), before turning
function edBox(o){const s=edSprite(o);if(s)return{x0:-s.ax,y0:-s.ay,x1:s.c.width-s.ax,y1:s.c.height-s.ay};return{x0:-12,y0:-24,x1:12,y1:0}}
// is world point (x,y) on object o (pad = extra margin in world px)?
function edOnObj(o,x,y,pad){const b=edBox(o),a=-(o.r||0)*Math.PI/180,dx=x-o.x,dy=y-o.y,lx=dx*Math.cos(a)-dy*Math.sin(a),ly=dx*Math.sin(a)+dy*Math.cos(a);return lx>=b.x0-pad&&lx<=b.x1+pad&&ly>=b.y0-pad&&ly<=b.y1+pad}
// collision boxes of the whole map, rebuilt only after a change
function edColl(){const E=ED;if(E.collV!==E.ver){E.collC=cmColl(E.d);E.collV=E.ver}return E.collC}
function edWallLook(g,w,a){const s=CMWI[w.s];if(!s||s.hid){g.fillStyle='rgba(170,110,255,'+(.35*a)+')';g.fillRect(w.x,w.y,w.w,w.h);g.strokeStyle='rgba(200,160,255,'+a+')';g.lineWidth=1/ED.cam.z;g.strokeRect(w.x,w.y,w.w,w.h);if(!s){g.strokeStyle='#ff3a5a';g.beginPath();g.moveTo(w.x,w.y);g.lineTo(w.x+w.w,w.y+w.h);g.stroke()}return}
g.globalAlpha=a;s.f(g,w.x,w.y,w.w,w.h);g.globalAlpha=1}
function edObjLook(g,o,a){const s=edSprite(o);g.save();g.translate(o.x,o.y);if(o.r)g.rotate(o.r*Math.PI/180);g.globalAlpha=a;
if(s)g.drawImage(s.c,-s.ax,-s.ay);else{g.fillStyle='rgba(255,40,70,.75)';g.fillRect(-12,-24,24,24);g.fillStyle='#fff';g.font='bold 16px monospace';g.textAlign='center';g.fillText('?',0,-6)}g.restore()}
// world -> screen (css px)
function edSX(x){return(x-ED.cam.x)*ED.cam.z}
function edSY(y){return(y-ED.cam.y)*ED.cam.z}
function edFrame(){const E=ED;if(!E||!E.cv||!E.vis)return;const cv=E.cv,dpr=Math.min(2,globalThis.devicePixelRatio||1),w=cv.clientWidth,h=cv.clientHeight;if(!w||!h)return;
if(cv.width!==Math.round(w*dpr)||cv.height!==Math.round(h*dpr)){cv.width=Math.round(w*dpr);cv.height=Math.round(h*dpr);E.need=1;edLay()}
if(E.need){E.need=0;edDraw(E.g,dpr,w,h)}if(E.mmNeed||E.mmDirty){E.mmNeed=0;edMini()}}
function edDraw(g,dpr,w,h){const E=ED,d=E.d,T=d.tile,z=E.cam.z,MW=d.w*T,MH=d.h*T,vx0=E.cam.x,vy0=E.cam.y,vx1=vx0+w/z,vy1=vy0+h/z,px=1/z;
g.setTransform(1,0,0,1,0,0);g.fillStyle='#0b100c';g.fillRect(0,0,g.canvas.width,g.canvas.height);
g.setTransform(dpr*z,0,0,dpr*z,-vx0*z*dpr,-vy0*z*dpr);g.imageSmoothingEnabled=z<.99;
g.fillStyle='#16211a';g.fillRect(0,0,MW,MH);
const lo=z<.5&&!(E.drag&&(E.drag.t=='move'||E.drag.t=='size'))?(z<.25?.25:.5):0;const CS=EDCS*T;for(let cy=Math.max(0,Math.floor(vy0/CS));cy<=Math.min(Math.ceil(d.h/EDCS)-1,Math.floor(vy1/CS));cy++)for(let cx=Math.max(0,Math.floor(vx0/CS));cx<=Math.min(Math.ceil(d.w/EDCS)-1,Math.floor(vx1/CS));cx++)g.drawImage(lo?edChunkLo(cx,cy,lo):edChunk(cx,cy),cx*CS,cy*CS,CS+px*.5,CS+px*.5);
g.imageSmoothingEnabled=false;
// grid
if(E.grid&&z*T>=6){const tx0=Math.max(0,Math.floor(vx0/T)),tx1=Math.min(d.w,Math.ceil(vx1/T)),ty0=Math.max(0,Math.floor(vy0/T)),ty1=Math.min(d.h,Math.ceil(vy1/T)),y0=ty0*T,y1=ty1*T,x0=tx0*T,x1=tx1*T;
for(let x=tx0;x<=tx1;x++){g.fillStyle=x%4?'rgba(0,0,0,.16)':'rgba(0,0,0,.34)';g.fillRect(x*T,y0,px,y1-y0)}for(let y=ty0;y<=ty1;y++){g.fillStyle=y%4?'rgba(0,0,0,.16)':'rgba(0,0,0,.34)';g.fillRect(x0,y*T,x1-x0,px)}}
// walls, props and vehicles in draw order (layer, draw order, depth); hidden layers and hidden things are left out
const inV=(x0,y0,x1,y1)=>x1>=vx0&&x0<=vx1&&y1>=vy0&&y0<=vy1,HL=new Set(d.layers.filter(l=>l.hid).map(l=>l.id)),vis=o=>!o.hd&&!HL.has(o.ly);
if(!lo){const k=dpr*z,ox=-vx0*k,oy=-vy0*k;for(const it of edDL()){const o=it.o;if(!vis(o))continue;if(it.w){if(inV(o.x,o.y,o.x+o.w,o.y+o.h))edWallLook(g,o,1);continue}
if(it.t=='a'||it.t=='l'){const b=edKitBox(o,it.t);if(inV(b.x0,b.y0,b.x1,b.y1))edKitLook(g,o,it.t);continue}if(o.fx){if(inV(o.x-200,o.y-200,o.x+200,o.y+200)){g.setTransform(k,0,0,k,ox,oy);edKitLook(g,o,'o')}continue}
const sp=edSprite(o),r=sp?Math.max(sp.c.width,sp.c.height):30;if(!inV(o.x-r,o.y-r,o.x+r,o.y+r))continue;if(!sp){edObjLook(g,o,1);continue}if(!o.r){g.drawImage(sp.c,o.x-sp.ax,o.y-sp.ay);continue}
const a=o.r*Math.PI/180,c=Math.cos(a)*k,s_=Math.sin(a)*k;g.setTransform(c,s_,-s_,c,ox+o.x*k,oy+o.y*k);g.drawImage(sp.c,-sp.ax,-sp.ay);g.setTransform(k,0,0,k,ox,oy)}}
// collision
if(E.coll){const C=edColl();g.lineWidth=px;for(const c of C){if(!inV(c[0],c[1],c[0]+c[2],c[1]+c[3]))continue;const col=c[4]==2?'70,160,255':c[4]==1?'255,170,40':'255,60,60';g.fillStyle='rgba('+col+',.32)';g.fillRect(c[0],c[1],c[2],c[3]);g.strokeStyle='rgba('+col+',.9)';g.strokeRect(c[0],c[1],c[2],c[3])}}
// special features (editor only) and spawn zones
for(const f of d.feats){if(vis(f))edFeatLook(g,f,px)}
for(const q of d.zones){if(!vis(q)||!inV(q.x,q.y,q.x+q.w,q.y+q.h))continue;const on=q.on!==false;g.fillStyle=on?'rgba(216,64,58,.18)':'rgba(150,150,150,.12)';g.fillRect(q.x,q.y,q.w,q.h);g.setLineDash([6*px,4*px]);g.lineWidth=2*px;g.strokeStyle=on?'#ff6a5a':'#9a9a9a';g.strokeRect(q.x,q.y,q.w,q.h);g.setLineDash([])}
// map edge
g.lineWidth=2*px;g.strokeStyle='#ffcf40';g.strokeRect(0,0,MW,MH);
// tool previews in world space
edPreview(g,px);
// the collision of the selected props and vehicles (cyan), the selection outlines (grey when locked), the hovered thing
for(const s of E.sel)if(s.t=='o')edShapeLook(g,s.o,px);
for(const s of E.sel)edOutline(g,s,edLockIt(s)?'#a0a0a0':'#ffcf40',2*px,1);const hv=E.hov;if(hv&&!edSelOf(hv.o))edOutline(g,hv,'rgba(255,255,255,.7)',px,0);
// screen space: markers and labels stay the same size at every zoom
g.setTransform(dpr,0,0,dpr,0,0);g.font='16px VT323, monospace';g.textBaseline='middle';
for(const q of d.zones){const sx=edSX(q.x),sy=edSY(q.y);if(!vis(q)||sx>w||sy>h||edSX(q.x+q.w)<0||edSY(q.y+q.h)<0)continue;g.fillStyle=q.on!==false?'#ff8a7a':'#b0b0b0';g.textAlign='left';g.fillText(q.on!==false?'SPAWN ZONE':'SPAWN ZONE (OFF)',sx+5,sy+10)}
for(const f of d.feats)if(vis(f))edFeatLabel(g,f,w,h);for(const a of d.areas){const T=cmArea(a.a);if(T&&T.ed&&vis(a)){const sx=edSX(a.x),sy=edSY(a.y);if(sx<w&&sy<h){g.fillStyle=cmCol(a.c,'#c8d0d8');g.textAlign='left';g.fillText(T.n.toUpperCase(),sx+5,sy+10)}}}
for(const q of d.spawns){const sx=edSX(q.x),sy=edSY(q.y);if(!vis(q)||sx<-20||sy<-20||sx>w+20||sy>h+20)continue;edSkull(g,sx,sy,q.on!==false)}
if(d.start){const sx=edSX(d.start.x),sy=edSY(d.start.y);g.fillStyle='rgba(0,0,0,.45)';g.beginPath();g.arc(sx,sy+2,13,0,7);g.fill();g.fillStyle='#4ab0ff';g.beginPath();g.arc(sx,sy,12,0,7);g.fill();g.strokeStyle='#0a1a2a';g.lineWidth=2;g.stroke();g.fillStyle='#fff';g.textAlign='center';g.font='13px "Press Start 2P", monospace';g.fillText('P',sx+1,sy+1)}
{const one=edOne();if(one&&!edLockIt(one))edHandles(g,one)}const so=edShapeObj();if(so)edHandles(g,null,edShapeHandles(so),'#4ae0ff');const po=edPtObj();if(po)edHandles(g,null,edPtHandles(po),'#4ae0ff')}
function edSkull(g,x,y,on){g.fillStyle='rgba(0,0,0,.45)';g.beginPath();g.arc(x,y+2,11,0,7);g.fill();g.fillStyle=on?'#d8403a':'#7a7a7a';g.beginPath();g.arc(x,y,10,0,7);g.fill();g.fillStyle=on?'#f4ead0':'#d0d0d0';g.fillRect(x-5,y-5,10,7);g.fillRect(x-3,y+2,6,3);g.fillStyle=on?'#4a0c0c':'#555';g.fillRect(x-4,y-3,3,3);g.fillRect(x+1,y-3,3,3);g.fillRect(x-1,y+2,1,2);g.fillRect(x+1,y+2,1,2)}
function edSelRect(s){const o=s.o;if(s.t=='w'||s.t=='z'||s.t=='a'||s.t=='f'&&!o.pts)return{x0:o.x,y0:o.y,x1:o.x+o.w,y1:o.y+o.h};return null}
function edOutline(g,s,col,lw,full){const o=s.o;g.strokeStyle=col;g.lineWidth=lw;
if(s.t=='o'){const b=edBox(o);g.save();g.translate(o.x,o.y);if(o.r)g.rotate(o.r*Math.PI/180);g.strokeRect(b.x0,b.y0,b.x1-b.x0,b.y1-b.y0);g.restore();if(o.fx){const T=cmFx(o.fx);if(T){g.setLineDash([4*lw,3*lw]);g.beginPath();g.arc(o.x,o.y,fxR(o,T.r||30),0,7);g.stroke();g.setLineDash([])}}return}
if(s.t=='l'||s.t=='f'&&o.pts){edPtsOutline(g,o,col,lw);return}
const r=edSelRect(s);if(r){g.strokeRect(r.x0,r.y0,r.x1-r.x0,r.y1-r.y0);return}
const z=ED.cam.z,rr=(s.t=='p'?15:13)/z;g.beginPath();g.arc(o.x,o.y,rr,0,7);g.stroke()}
// resize handles of the selected wall or zone (screen space)
function edHandleList(s){const r=s&&edSelRect(s);if(!r)return[];const xm=(r.x0+r.x1)/2,ym=(r.y0+r.y1)/2;return[['nw',r.x0,r.y0],['n',xm,r.y0],['ne',r.x1,r.y0],['e',r.x1,ym],['se',r.x1,r.y1],['s',xm,r.y1],['sw',r.x0,r.y1],['w',r.x0,ym]]}
function edHandles(g,s,L,col){for(const[,x,y]of L||edHandleList(s)){const sx=edSX(x),sy=edSY(y);g.fillStyle='#16111c';g.fillRect(sx-5,sy-5,10,10);g.fillStyle=col||'#ffcf40';g.fillRect(sx-4,sy-4,8,8)}}
// a selected prop or vehicle's collision: its real boxes in cyan, and the circle or box it was drawn as
function edShapeLook(g,o,px){const B=cmObjBoxes(o);g.fillStyle='rgba(74,224,255,.22)';g.strokeStyle='rgba(74,224,255,.85)';g.lineWidth=px;for(const b of B){g.fillRect(b[0],b[1],b[2],b[3]);g.strokeRect(b[0],b[1],b[2],b[3])}
const s=o.sh;if(s&&cmSolid(o,'o')){g.lineWidth=2*px;g.setLineDash([5*px,3*px]);g.strokeStyle='#4ae0ff';if(s.t=='c'){g.beginPath();g.arc(o.x+s.x,o.y+s.y,s.r,0,7);g.stroke()}else g.strokeRect(o.x+s.x,o.y+s.y,s.w,s.h);g.setLineDash([])}}
// what the current tool would do under the mouse
function edPreview(g,px){const E=ED,d=E.d,T=d.tile,m=E.mouse,t=E.tool,D_=E.drag;if(!m.in&&!D_&&!E.pd)return;if(edKitPreview(g,px))return;
if(t=='brush'||t=='erase'||t=='fill'||t=='pick'||(t=='rect'&&!D_)){const n=t=='brush'||t=='erase'?E.brush:1,o=Math.floor((n-1)/2),tx=Math.floor(m.wx/T)-o,ty=Math.floor(m.wy/T)-o;g.lineWidth=2*px;g.strokeStyle=t=='erase'||(D_&&D_.er)?'#ff6a5a':'#ffcf40';g.fillStyle=t=='erase'?'rgba(255,90,80,.18)':'rgba(255,207,64,.14)';g.fillRect(tx*T,ty*T,n*T,n*T);g.strokeRect(tx*T,ty*T,n*T,n*T);return}
if(D_&&D_.t=='box'){const r=D_.r;if(!r)return;g.fillStyle='rgba(255,207,64,.1)';g.fillRect(r.x,r.y,r.w,r.h);g.setLineDash([5*px,4*px]);g.lineWidth=px;g.strokeStyle='#ffcf40';g.strokeRect(r.x,r.y,r.w,r.h);g.setLineDash([]);return}
if(D_&&(D_.t=='rect'||D_.t=='wall'||D_.t=='cut'||D_.t=='zone')){const r=D_.r;if(!r)return;
if(D_.t=='rect'){g.fillStyle=D_.er?'rgba(255,90,80,.25)':'rgba(255,207,64,.22)';g.fillRect(r.x,r.y,r.w,r.h);g.lineWidth=2*px;g.strokeStyle=D_.er?'#ff6a5a':'#ffcf40';g.strokeRect(r.x,r.y,r.w,r.h)}
else if(D_.t=='wall'){edWallLook(g,{x:r.x,y:r.y,w:r.w,h:r.h,s:E.wall},.8);g.lineWidth=px;g.strokeStyle='#ffcf40';g.strokeRect(r.x,r.y,r.w,r.h)}
else if(D_.t=='cut'){g.fillStyle='rgba(255,60,60,.25)';g.fillRect(r.x,r.y,r.w,r.h);g.setLineDash([5*px,4*px]);g.lineWidth=2*px;g.strokeStyle='#ff5a4a';g.strokeRect(r.x,r.y,r.w,r.h);g.setLineDash([])}
else{g.fillStyle='rgba(216,64,58,.22)';g.fillRect(r.x,r.y,r.w,r.h);g.setLineDash([6*px,4*px]);g.lineWidth=2*px;g.strokeStyle='#ff6a5a';g.strokeRect(r.x,r.y,r.w,r.h);g.setLineDash([])}
const lab=Math.round(r.w)+' × '+Math.round(r.h);g.save();g.setTransform(1,0,0,1,0,0);const dpr=g.canvas.width/E.cv.clientWidth;g.scale(dpr,dpr);g.font='16px VT323, monospace';g.textAlign='left';g.textBaseline='bottom';const sx=edSX(r.x+r.w)+6,sy=edSY(r.y+r.h)+18;g.fillStyle='rgba(0,0,0,.6)';g.fillRect(sx-3,sy-17,g.measureText(lab).width+6,17);g.fillStyle='#ffcf40';g.fillText(lab,sx,sy);g.restore();return}
if(t=='place'&&E.asset&&!D_){const a=E.asset,p=edSnapPt(m.wx,m.wy),o=a.t=='v'?{veh:a.k,x:p.x,y:p.y,r:E.rot,c:E.vcol}:a.t=='d'?{dc:a.k,x:p.x,y:p.y,r:E.rot,sc:E.dsc,vr:Math.round(E.pvr*100)/100,c:E.pcol['d:'+a.k]}:a.t=='x'?{fx:a.k,x:p.x,y:p.y,sc:E.dsc,c:E.pcol['x:'+a.k]}:{k:a.k,x:p.x,y:p.y,r:E.rot,vr:E.pvr,c:E.pcol[a.k]};if(a.t=='x'){g.globalAlpha=.7;edKitLook(g,o,'o');g.globalAlpha=1;return}edObjLook(g,o,.6);const f=a.t=='p'&&cmFoot(o);if(f){g.lineWidth=px;g.strokeStyle='rgba(255,170,40,.9)';g.strokeRect(f[0],f[1],f[2],f[3])}return}
if((t=='wall'||t=='zone')&&!D_){const p=edSnapPt(m.wx,m.wy);g.fillStyle='#ffcf40';g.fillRect(p.x-3*px,p.y-3*px,6*px,6*px)}}
// ----- minimap -----
function edMiniTex(){const E=ED,d=E.d,c=E.mmc||(E.mmc=document.createElement('canvas'));c.width=d.w;c.height=d.h;const q=c.getContext('2d'),im=q.createImageData(d.w,d.h),px=im.data,col={};
const rgb=h=>{if(col[h])return col[h];const n=parseInt(h.slice(1),16);return col[h]=[(n>>16)&255,(n>>8)&255,n&255]};const gd=(CMTI[d.ground]||CMTER[0]).mc,V=edTileVis();
for(let i=0;i<d.w*d.h;i++){const rt=V.r&&d.rtr[i]?CMTI[d.rpal[d.rtr[i]]]:null,t=CMTI[d.pal[d.ter[i]]];let c_=rgb(rt?rt.mc:V.b?(t?t.mc:gd):'#151d17');const o=V.b&&d.ovl[i];if(o){const q_=CMOI[d.opal[o]];if(q_){const b=rgb(q_.mc);c_=[(c_[0]+b[0]*2)/3,(c_[1]+b[1]*2)/3,(c_[2]+b[2]*2)/3]}}px[i*4]=c_[0];px[i*4+1]=c_[1];px[i*4+2]=c_[2];px[i*4+3]=255}q.putImageData(im,0,0);E.mmDirty=0}
function edMini(){const E=ED,c=E.mm;if(!c||!E.vis)return;if(E.mmDirty||!E.mmc)edMiniTex();const d=E.d,T=d.tile,MW=d.w*T,MH=d.h*T,dpr=Math.min(2,globalThis.devicePixelRatio||1);
const cw=Math.round(E.mmw*dpr),ch=Math.round(E.mmh*dpr);if(c.width!==cw||c.height!==ch){c.width=cw;c.height=ch}const g=c.getContext('2d'),k=cw/MW;g.setTransform(1,0,0,1,0,0);g.imageSmoothingEnabled=false;g.drawImage(E.mmc,0,0,cw,ch);
const HL=new Set(d.layers.filter(l=>l.hid).map(l=>l.id)),vis=o=>!o.hd&&!HL.has(o.ly);edKitMini(g,d,k,vis);g.fillStyle='rgba(30,20,16,.9)';for(const w of d.walls){if(!vis(w))continue;const s=CMWI[w.s];g.fillStyle=s&&s.fl==2?'rgba(200,210,225,.9)':s&&s.hid?'rgba(170,110,255,.8)':'rgba(30,20,16,.95)';g.fillRect(w.x*k,w.y*k,Math.max(1,w.w*k),Math.max(1,w.h*k))}
g.fillStyle='#ffe27a';for(const o of d.obj)if(vis(o))g.fillRect(o.x*k-1,o.y*k-1,2,2);
for(const z_ of d.zones){if(!vis(z_))continue;g.strokeStyle=z_.on!==false?'#ff5a4a':'#999';g.lineWidth=1;g.strokeRect(z_.x*k,z_.y*k,z_.w*k,z_.h*k)}
g.fillStyle='#ff5a4a';for(const s of d.spawns)if(vis(s))g.fillRect(s.x*k-2,s.y*k-2,4,4);if(d.start){g.fillStyle='#4ab0ff';g.fillRect(d.start.x*k-3,d.start.y*k-3,6,6)}
const vw=E.cv.clientWidth/E.cam.z,vh=E.cv.clientHeight/E.cam.z;g.strokeStyle='#ffcf40';g.lineWidth=Math.max(1,dpr);g.strokeRect(E.cam.x*k,E.cam.y*k,vw*k,vh*k)}
// ----- thumbnails (Workshop list and Free Play) -----
// the real map painted small, the same way the game paints it, letterboxed into 4:3
function edMakeThumb(d){const T=d.tile,MW=d.w*T,MH=d.h*T,k=Math.min(1,960/MW,720/MH),a=document.createElement('canvas');a.width=Math.ceil(MW*k);a.height=Math.ceil(MH*k);const g=a.getContext('2d');g.scale(k,k);
try{cmGround(g,d,0,0,d.w,d.h,0);for(const{o,w,t}of cmDrawList(d,0)){if(w){cmWallDraw(g,o);continue}if(t=='a'||t=='l'||o.dc||o.fx){try{cmPaintIt(g,o,t)}catch(e){}continue}const s=edSprite(o);if(!s)continue;g.save();g.translate(o.x,o.y);if(o.r)g.rotate(o.r*Math.PI/180);g.drawImage(s.c,-s.ax,-s.ay);g.restore()}}catch(e){}
const o=document.createElement('canvas');o.width=400;o.height=300;const q=o.getContext('2d');q.fillStyle='#0a0f0b';q.fillRect(0,0,400,300);const s=Math.min(400/a.width,300/a.height),w=a.width*s,h=a.height*s;q.imageSmoothingEnabled=true;try{q.imageSmoothingQuality='high'}catch(e){}q.drawImage(a,(400-w)/2,(300-h)/2,w,h);
a.width=a.height=0;let u='';try{u=o.toDataURL('image/jpeg',.82)}catch(e){}o.width=o.height=0;return u}
