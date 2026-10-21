//# maps/suburb-details.js — Suburb forests, crash lane, detailed houses
// ---------- Suburb: forests, crash lane, more detailed houses (all functions: they run during the first map build) ----------
function subH(i,k){const v=Math.sin(i*12.9898+k*78.233)*43758.5453;return v-Math.floor(v)}
function subZones(o){const{yT,ry,hx,hy,TG}=o,Z={};
Z.top=x=>yT-30+9*Math.sin(x/53)+6*Math.sin(x/23+1);
Z.bot=x=>ry+64+26+8*Math.sin(x/47+2)+5*Math.sin(x/19);
const pth=(f,y0,y1)=>{const P=[];for(let y=y0;y<=y1;y+=16)P.push([f(y),y]);return P};
const cr=(C)=>{const P=[];for(let k=0;k<C.length-1;k++){const p0=C[Math.max(0,k-1)],p1=C[k],p2=C[k+1],p3=C[Math.min(C.length-1,k+2)];const n=Math.max(2,Math.ceil(Math.hypot(p2[0]-p1[0],p2[1]-p1[1])/12));for(let j=0;j<n;j++){const t=j/n,t2=t*t,t3=t2*t;P.push([0,1].map(d=>.5*(2*p1[d]+(-p0[d]+p2[d])*t+(2*p0[d]-5*p1[d]+4*p2[d]-p3[d])*t2+(-p0[d]+3*p1[d]-3*p2[d]+p3[d])*t3)))}}P.push(C[C.length-1]);return P};
const yr=ry+40,tY=yT*.5;Z.paths=[cr([[640,yr],[620,1290],[570,1400],[470,1480],[330,1525]]),cr([[330,1525],[520,1560],[760,1575],[940,1600],[1110,1600]]),cr([[1110,1600],[1260,1560],[1400,1470],[1470,1330],[1470,yr]]),cr([[1420,1450],[1580,1430],[1700,1380],[1780,1410]]),
...TG.map((t,i)=>cr([[t,yT+6],[t+20*(i-1),yT-110],[t,tY]])),cr([[TG[0]-120,tY+30],[TG[0],tY],[(TG[0]+TG[1])/2,tY-40],[TG[1],tY],[(TG[1]+TG[2])/2,tY+35],[TG[2],tY],[TG[2]+140,tY-30]])];
Z.clr=[[330,1525,175,95],[1110,1600,195,105]];
const a=.6;Z.ry=ry;Z.hx=hx;Z.hy=hy;Z.la=a;Z.l0=[hx-Math.cos(a)*600,hy-Math.sin(a)*600];
return Z}
function subSegD(px,py,ax,ay,bx,by){const vx=bx-ax,vy=by-ay,L=vx*vx+vy*vy||1,u=Math.max(0,Math.min(1,((px-ax)*vx+(py-ay)*vy)/L));return[Math.hypot(px-ax-vx*u,py-ay-vy*u),u]}
function subPathD(Z,x,y){let d=1e9;for(const P of Z.paths)for(let i=1;i<P.length;i++){const q=subSegD(x,y,P[i-1][0],P[i-1][1],P[i][0],P[i][1])[0];if(q<d)d=q}return d}
function subClr(Z,x,y,k){for(const[cx,cy,rx,ry]of Z.clr){const e=((x-cx)/(rx*k))**2+((y-cy)/(ry*k))**2;if(e<1)return 1}return 0}
function subLane(Z,x,y){return subSegD(x,y,Z.l0[0],Z.l0[1],Z.hx,Z.hy)}
function subZone(Z,x,y){return y<Z.top(x)?'t':y>Z.bot(x)?'b':''}
// trees for both forests (only some trunks collide, flagged 2 so bullets fly through the woods)
function subForest(o){const Z=subZones(o);HS.Z=Z;const T=[];let n=0;
for(let gy=8;gy<WH;gy+=38)for(let gx=8;gx<WW;gx+=38){n++;const x=gx+(subH(n,1)-.5)*26,y=gy+(subH(n,2)-.5)*26,z=subZone(Z,x,y);if(!z)continue;
if(z=='t'&&y>Z.top(x)-14)continue;if(z=='b'&&y<Z.bot(x)+16)continue;
if(subPathD(Z,x,y)<46)continue;if(z=='b'&&subClr(Z,x,y,1.08))continue;const L=subLane(Z,x,y);if(z=="b"&&L[0]<96&&L[1]>-.04&&L[1]<1.05)continue;if(Math.hypot(x-Z.hx,y-Z.hy)<120)continue;
const pine=subH(n,3)<(z=='t'?.45:.3),r=pine?13+subH(n,4)*5:16+subH(n,4)*8;T.push({x,y,r,pine,v:subH(n,5)});
WL.push([x-6,y-6,12,12,2])}
// lone trees in the clearings
for(const[cx,cy,rx,ry]of Z.clr){T.push({x:cx+rx*.35,y:cy-ry*.2,r:22,pine:0,v:.3});WL.push([cx+rx*.35-5,cy-ry*.2-5,10,10,2])}
// drop the old random trees that landed on a path, clearing or the crash lane
for(let i=TR.length-1;i>=0;i--){const[x,y]=TR[i],L=subLane(Z,x,y);if(subPathD(Z,x,y)<40||subClr(Z,x,y,1.1)||L[0]<60&&L[1]>0&&L[1]<1.05){TR.splice(i,1);const k=WL.findIndex(w=>w[0]==x-6&&w[1]==y-6&&w[2]==12&&!w[4]);if(k>=0)WL.splice(k,1)}}
T.sort((a,b)=>a.y-b.y);HS.FT=T;WL.push([2062,o.ry-28,6,14]);
// spawn points: along the trails, in the clearings and on open grass, so zombies come walking out of the woods
const SP=[],free=(x,y)=>x>20&&y>20&&x<WW-20&&y<WH-20&&!WL.some(w=>x>w[0]-16&&x<w[0]+w[2]+16&&y>w[1]-16&&y<w[1]+w[3]+16);
for(const Pp of Z.paths)for(let i=0;i<Pp.length;i+=5){const[x,y]=Pp[i];if(free(x,y))SP.push([x,y])}
for(const[cx,cy,rx,ry]of Z.clr)for(const[dx,dy]of[[0,0],[-.5,0],[.5,0],[0,.4]]){const x=cx+dx*rx,y=cy+dy*ry;if(free(x,y))SP.push([x,y])}
for(let x=60;x<WW-40;x+=110)for(let y=Z.top(x)+40;y<o.ry-30;y+=110){if(x>o.fL-30&&x<o.fR+30&&y>o.yT-30)continue;if(free(x,y))SP.push([x,y])}
HS.sp=SP}
// forest floor: dirt, leaf litter, worn trails, grassy clearings, the churned crash lane
function subGround(g,o){const Z=HS.Z||subZones(o);
for(let y=0;y<WH;y+=8)for(let x=0;x<WW;x+=8){const cx=x+4,cy=y+4,z=subZone(Z,cx,cy);if(!z)continue;
if(z=='b'&&subClr(Z,cx,cy,1+.08*Math.sin(cx/17+cy/13)))continue;const h=subH(x*.37+y*1.7,7),pd=subPathD(Z,cx,cy);
let c=h<.33?'#5e4830':h<.66?'#6b5236':'#654d33';if(pd<25+3*Math.sin(cy/11))c=h<.5?'#8a7252':'#93795a';else if(pd<30)c='#7a6244';
if(z=='b'){const L=subLane(Z,cx,cy);if(L[1]>0&&L[1]<1.1&&L[0]<62+10*Math.sin(cy/9))c=h<.5?'#4e3c28':'#57432c'}
g.fillStyle=c;g.fillRect(x,y,8,8)}
// edge fringe so the woods don't start on a ruler line
for(let x=0;x<WW;x+=6){const t=Z.top(x),b=Z.bot(x);g.fillStyle='#5e4830';g.fillRect(x,t,6,3+subH(x,8)*5);g.fillRect(x,b-3-subH(x,9)*5,6,4+subH(x,9)*5);g.fillStyle='#3a8a38';if(subH(x,10)<.4)g.fillRect(x+1,t+4,2,4);if(subH(x,11)<.4)g.fillRect(x+2,b-9,2,4)}
// leaf litter, twigs, moss, small rocks, mushrooms
for(let i=0;i<5200;i++){const x=subH(i,12)*WW,y=subH(i,13)*WH,z=subZone(Z,x,y);if(!z||z=='b'&&subClr(Z,x,y,1))continue;if(subPathD(Z,x,y)<24)continue;const k=subH(i,14);
if(k<.45){g.fillStyle=['#8a6a3a','#a0743a','#7a4a2a','#b08a4a'][i%4];g.fillRect(x,y,3,2)}else if(k<.6){g.fillStyle='#3e2e1e';g.fillRect(x,y,7,1)}else if(k<.75){g.fillStyle='#4f6a30';g.fillRect(x,y,4,3)}else if(k<.82){g.fillStyle='#16111c';g.fillRect(x-1,y-1,6,5);g.fillStyle='#8a8a84';g.fillRect(x,y,4,3)}
else if(k<.84){g.fillStyle='#e8e0d0';g.fillRect(x,y+2,2,3);g.fillStyle='#c0392b';g.fillRect(x-1,y,4,2)}else if(k<.9){g.fillStyle='#3a8a38';g.fillRect(x,y,2,4);g.fillRect(x+3,y+1,2,3)}}
// clearing grass gets a few wildflowers
for(const[cx,cy,rx,ry]of Z.clr)for(let i=0;i<40;i++){const a=subH(i+cx,15)*6.283,r=Math.sqrt(subH(i+cy,16));g.fillStyle=['#ffe27a','#f4f1e6','#d86ad0'][i%3];g.fillRect(cx+Math.cos(a)*rx*.85*r,cy+Math.sin(a)*ry*.85*r,3,3)}
// scorch around the crash
for(let r=150;r>10;r-=14){g.fillStyle='rgba(20,14,10,.07)';g.beginPath();g.arc(Z.hx,Z.hy,r,0,7);g.fill()}}
function subLog(g,x,y,a,L,v){g.save();g.translate(x,y);g.rotate(a);
g.fillStyle='rgba(0,0,0,.25)';g.fillRect(-2,4,L,8);g.fillStyle='#16111c';g.fillRect(-1,-6,L+2,12);g.fillStyle='#6b4a2a';g.fillRect(0,-5,L,10);g.fillStyle='#8a6038';g.fillRect(0,-5,L,3);g.fillStyle='#4a3020';for(let i=8;i<L-4;i+=11)g.fillRect(i,-3,6,1),g.fillRect(i+4,1,5,1);
g.fillStyle='#d8b07a';g.fillRect(-1,-4,3,8);g.fillStyle='#a8804a';g.fillRect(0,-1,1,2);
for(let i=0;i<5;i++){const bx=L-6+i*7+(v*13+i*5)%6,by=-12+((i*11+v*7)%24);g.fillStyle='#16111c';g.beginPath();g.ellipse(bx,by,11,7,0,0,7);g.fill();g.fillStyle=i%2?'#2f6d2e':'#3c8a3a';g.beginPath();g.ellipse(bx,by-1,10,6,0,0,7);g.fill()}
g.fillStyle='#5a3a22';g.fillRect(L*.4,-9,3,4);g.fillRect(L*.65,5,3,5);g.restore()}
function subStump(g,x,y,s){g.fillStyle='rgba(0,0,0,.25)';g.beginPath();g.ellipse(x+2,y+3,8,4,0,0,7);g.fill();g.fillStyle='#16111c';g.fillRect(x-7,y-6,14,11);g.fillStyle='#6b4a2a';g.fillRect(x-6,y-5,12,9);g.fillStyle='#e0bc84';g.fillRect(x-5,y-5,10,4);
if(s){g.fillStyle='#e0bc84';g.fillRect(x-4,y-10,3,6);g.fillRect(x+1,y-12,2,8);g.fillRect(x+3,y-8,2,4)}g.fillStyle='#a8804a';g.fillRect(x-1,y-4,2,2)}
// standing trees, sorted so lower ones overlap the ones behind
function subTrees(g){const Z=HS.Z;if(!Z||!HS.FT)return;
// knocked-down lane: fallen trunks pointing the way the chopper was going, splintered stumps along the edges
const a=Z.la,ux=Math.cos(a),uy=Math.sin(a),px=-uy,py=ux;
for(let i=0;i<9;i++){const t=.06+i*.1,cx=Z.l0[0]+(Z.hx-Z.l0[0])*t,cy=Z.l0[1]+(Z.hy-Z.l0[1])*t;if(t>.86)break;const sd=i%2?1:-1,off=sd*(16+subH(i,20)*14);
subStump(g,cx+px*(off+sd*18)-ux*10,cy+py*(off+sd*18)-uy*10,1);subLog(g,cx+px*off,cy+py*off,a+sd*(.12+subH(i,21)*.22),58+subH(i,22)*22,i)}
for(let i=0;i<14;i++){const t=subH(i,23)*.9,s=(subH(i,24)-.5)*90,x=Z.l0[0]+(Z.hx-Z.l0[0])*t+px*s,y=Z.l0[1]+(Z.hy-Z.l0[1])*t+py*s;g.save();g.translate(x,y);g.rotate(subH(i,25)*6);g.fillStyle='#5a3a22';g.fillRect(-8,-1,16,2);g.fillRect(-2,-4,2,4);g.restore()}
for(const t of HS.FT){const{x,y,r}=t;g.fillStyle='rgba(0,0,0,.28)';g.beginPath();g.ellipse(x+4,y+2,r*.9,r*.45,0,0,7);g.fill();g.fillStyle='#16111c';g.fillRect(x-4,y-6,8,9);g.fillStyle='#5a3a22';g.fillRect(x-3,y-6,6,8)}
const C=50,cw=Math.ceil(WW/C)+1,ch=Math.ceil(WH/C)+1,cells=new Array(cw*ch);for(const t of HS.FT){const k=Math.floor(t.y/C)*cw+Math.floor(t.x/C);(cells[k]||(cells[k]=[])).push(t)}HS.FC={C,cw,ch,cells};subSign(g,HS.Z.ry)}
function subSpr(pine,r,v){const key=(pine?'p':'o')+r+'_'+Math.floor(v*3),K=subSpr.K||(subSpr.K={});if(K[key])return K[key];const R=r+2,cv=document.createElement('canvas');cv.width=R*2+2;cv.height=pine?Math.ceil(r*2.4)+4:R*2+2;const g=cv.getContext('2d'),x=R+1;
if(pine){const y=cv.height-2;for(let k=0;k<3;k++){const w=r*(1-k*.25),yy=y-k*r*.45;g.fillStyle='#16111c';g.beginPath();g.moveTo(x-w-1,yy+1);g.lineTo(x,yy-r*.9-1);g.lineTo(x+w+1,yy+1);g.fill();g.fillStyle=k==2?'#2c6a34':v<.5?'#1f4f2a':'#245a2e';g.beginPath();g.moveTo(x-w,yy);g.lineTo(x,yy-r*.85);g.lineTo(x+w,yy);g.fill()}}
else{const cy=R+1,c1=v<.33?'#2f6d2e':v<.66?'#356f2c':'#2b6436',c2=v<.33?'#3f8a3a':v<.66?'#4a8a36':'#3a7e44';g.fillStyle='#16111c';g.beginPath();g.arc(x,cy,r+1,0,7);g.fill();g.fillStyle=c1;g.beginPath();g.arc(x,cy,r,0,7);g.fill();g.fillStyle=c2;g.beginPath();g.arc(x-r*.3,cy-r*.3,r*.55,0,7);g.fill();g.beginPath();g.arc(x+r*.35,cy-r*.05,r*.4,0,7);g.fill();g.fillStyle='rgba(255,255,255,.12)';g.beginPath();g.arc(x-r*.4,cy-r*.45,r*.25,0,7);g.fill()}
return K[key]=cv}
// draw the visible tree tops after players and zombies, so anyone behind a tree is hidden by it
function subCan(){const F=HS.FC;if(mapId!==0||!F||typeof document=='undefined'||!document.createElement)return;const x0=cam.x-60,y0=cam.y-20,x1=cam.x+W+60,y1=cam.y+H+90;
const a=Math.max(0,Math.floor(x0/F.C)),b=Math.min(F.cw-1,Math.floor(x1/F.C)),c=Math.max(0,Math.floor(y0/F.C)),d=Math.min(F.ch-1,Math.floor(y1/F.C));
for(let j=c;j<=d;j++)for(let i=a;i<=b;i++){const L=F.cells[j*F.cw+i];if(!L)continue;for(const t of L){const r=Math.round(t.r),sp=subSpr(t.pine,r,t.v);if(t.pine)X.drawImage(sp,Math.round(t.x-sp.width/2),Math.round(t.y-10-sp.height+2));else X.drawImage(sp,Math.round(t.x-sp.width/2),Math.round(t.y-r*.7-sp.height/2))}}
}
// ----- houses: more furniture and detail; the middle house's living room is the one from the opening video -----
function subHouses(g,L){for(const P of L)if(P){g.save();if(P.mir){g.translate(2*P.xm,0);g.scale(-1,1)}subHouse(g,P);g.restore()}}
function subHouse(g,P){const{x0,y0,x1,y1,yA,yB,v1,v2,kx,cx,gx,hh}=P,R=(c,x,y,w,h)=>{g.fillStyle=c;g.fillRect(x,y,w,h)},O=(c,x,y,w,h)=>{R('#16111c',x-1,y-1,w+2,h+2);R(c,x,y,w,h)};
// kitchen: sink, fridge, chairs, a cabinet line
R('#a8804a',x0+6,y0+17,v1-x0-12,2);O('#9aa4ae',x0+44,y0+7,18,9);R('#6e7880',x0+46,y0+9,14,5);R('#c8d0d8',x0+52,y0+7,2,3);O('#e8ecef',v1-28,y0+6,20,24);R('#c8ccd0',v1-28,y0+18,20,1);R('#8a9096',v1-12,y0+9,2,6);
const ty=y0+hh*.14;for(const[cx2,cy2]of[[kx-22,ty+7],[kx+14,ty+7],[kx-4,ty-10],[kx-4,ty+24]])O('#6b4426',cx2,cy2,8,8);R('#c8995a',kx-10,ty+6,8,8);
// bedrooms: blanket fold, nightstand + lamp, dresser, rug
[[v1,v2],[v2,x1]].forEach(([a,b],i)=>{R(i?'#c4a0b8':'#a8b8d8',a+10,y0+34,32,6);R(i?'#b090a8':'#98a8c8',a+10,y0+40,32,18);O('#7a5030',a+46,y0+14,12,12);R('#ffe08a',a+50,y0+18,4,4);
O('#8a5a34',b-36,yA-22,28,14);R('#a8744a',b-36,yA-22,28,3);R('#c8995a',b-24,yA-15,4,2);const rw=Math.min(40,b-a-60);if(rw>14){R(i?'#7a5a8a':'#5a7a8a',a+18,yA-34,rw,16);R('rgba(255,255,255,.18)',a+20,yA-32,rw-4,2)}});
// hallway runner and a plant
R('#6a3434',x0+34,(yA+yB)/2-6,x1-x0-68,12);R('#8a4a4a',x0+38,(yA+yB)/2-4,x1-x0-76,8);for(let x=x0+44;x<x1-44;x+=14)R('#c8a060',x,(yA+yB)/2-1,6,2);
g.fillStyle='#16111c';g.beginPath();g.arc(x1-16,yA+14,8,0,7);g.fill();R('#8a5a34',x1-20,yA+12,8,8);g.fillStyle='#3f8a3a';g.beginPath();g.arc(x1-16,yA+11,7,0,7);g.fill();
// garage: shelves with boxes, tires, workbench, oil stain
O('#7a6a58',x1+8,yA+12,10,46);for(let j=0;j<3;j++)R(['#c8995a','#a8804a','#6a8aa8'][j],x1+9,yA+15+j*14,8,9);
for(let j=0;j<3;j++){g.fillStyle='#16111c';g.beginPath();g.arc(x1+30,y1-22-j*3,9,0,7);g.fill();g.fillStyle='#2c2c30';g.beginPath();g.arc(x1+30,y1-22-j*3,7,0,7);g.fill();g.fillStyle='#55555c';g.beginPath();g.arc(x1+30,y1-22-j*3,3,0,7);g.fill()}
g.fillStyle='rgba(10,10,10,.35)';g.beginPath();g.ellipse(gx-32,y1-14,14,6,0,0,7);g.fill();
if(P.mid)subDave(g,P);else{
// living room: coffee table, bookshelf, plants, lamp
const ry0=yB+(y1-yB)*.4;O('#7a5030',cx-18,ry0+9,36,18);R('#a8744a',cx-18,ry0+9,36,3);R('#e8e4d8',cx-10,ry0+14,10,7);
O('#6b4426',x0+6,yB+26,12,60);for(let j=0;j<8;j++)R(['#c0392b','#2f6fd0','#e8c53a','#5ae05a'][j%4],x0+8,yB+29+j*7,8,4);
for(const[px2,py2]of[[x0+16,y1-14],[x1-16,yB+16]]){g.fillStyle='#16111c';g.beginPath();g.arc(px2,py2,9,0,7);g.fill();R('#8a5a34',px2-4,py2-2,8,8);g.fillStyle='#3f8a3a';g.beginPath();g.arc(px2,py2-3,8,0,7);g.fill();g.fillStyle='#5aaa4a';g.beginPath();g.arc(px2-3,py2-6,3,0,7);g.fill()}
g.fillStyle='rgba(255,230,140,.18)';g.beginPath();g.arc(x0+96,y1-30,18,0,7);g.fill();O('#e8c060',x0+92,y1-34,8,8)}
// front flower beds
for(const[a,b]of[[x0+8,cx-30],[cx+30,x1-8]]){R('#16111c',a-1,y1+7,b-a+2,10);R('#6b4a2a',a,y1+8,b-a,8);for(let x=a+3;x<b-3;x+=7){R('#3f8a3a',x,y1+9,4,5);R(['#ff6a8a','#ffe27a','#f4f1e6','#d86ad0'][(x>>3)%4],x+1,y1+9,2,2)}}}
// the living room from the intro: plank floor, purple striped wallpaper, TV on a wooden stand, couch, coffee table with snacks, floor lamp, red-curtained window
function subDave(g,P){const{x0,x1,y1,yB}=P,R=(c,x,y,w,h)=>{g.fillStyle=c;g.fillRect(x,y,w,h)},O=(c,x,y,w,h)=>{R('#16111c',x-1,y-1,w+2,h+2);R(c,x,y,w,h)},W=x1-x0,H=y1-yB;
for(let y=yB;y<y1;y+=8){const off=((y-yB)/8%2)*24;R(((y-yB)/8)%2?'#5a3a24':'#61402a',x0,y,W,8);R('#3e2818',x0,y+7,W,1);for(let x=x0-off;x<x1;x+=48)R('#3e2818',Math.max(x0,x),y,1,7)}
for(let i=0;i<W;i+=6)R(i%12?'#3a2a48':'#4a3858',x0+i,yB+3,6,5);for(let i=0;i<W;i+=6)R(i%12?'#3a2a48':'#4a3858',x0+i,y1-8,6,5);for(let j=0;j<H;j+=6){R(j%12?'#3a2a48':'#4a3858',x0+3,yB+j,5,6);R(j%12?'#3a2a48':'#4a3858',x1-8,yB+j,5,6)}
const tx=x0+40,ty=yB+12;g.fillStyle='rgba(120,220,120,.12)';g.beginPath();g.moveTo(tx+18,ty+14);g.lineTo(tx+82,ty+14);g.lineTo(tx+120,ty+110);g.lineTo(tx-20,ty+110);g.fill();
O('#6b4426',tx,ty,100,20);R('#8a5a34',tx,ty,100,3);R('#4a2c18',tx+48,ty+4,2,14);O('#16111c',tx+12,ty+2,76,6);R('#5aa04a',tx+14,ty+3,72,3);R('#e8e8e0',tx+49,ty+3,1,3);
R('#7a2a2a',tx+10,ty+52,82,32);R('#9a3a3a',tx+13,ty+55,76,26);O('#7a5030',tx+22,ty+58,56,18);R('#a8744a',tx+22,ty+58,56,3);O('#e8d8a8',tx+30,ty+63,14,8);R('#e8c53a',tx+31,ty+64,12,3);O('#c0392b',tx+56,ty+63,6,6);R('#e8e4d8',tx+57,ty+63,4,1);
const cy=ty+94;O('#4a4460',tx-6,cy,112,30);R('#6a6080',tx-2,cy+2,104,14);R('#857aa0',tx,cy+3,32,11);R('#857aa0',tx+34,cy+3,32,11);R('#857aa0',tx+68,cy+3,32,11);R('#3a3450',tx-6,cy,8,30);R('#3a3450',tx+98,cy,8,30);
const lx=tx+122,ly=cy+10;g.fillStyle='rgba(255,230,140,.2)';g.beginPath();g.arc(lx,ly,26,0,7);g.fill();O('#e8c060',lx-7,ly-7,14,14);R('#f8e0a0',lx-5,ly-5,10,4);
O('#5a3a6a',x1-74,yB+26,30,30);R('#7a5a8a',x1-70,yB+30,22,22);O('#6b4426',x1-36,yB+14,18,70);for(let j=0;j<9;j++)R(['#c0392b','#2f6fd0','#e8c53a','#5ae05a'][j%4],x1-34,yB+17+j*7,14,4)}
// windows go on top of the walls
function subWins(g,L){for(const P of L)if(P){g.save();if(P.mir){g.translate(2*P.xm,0);g.scale(-1,1)}const{x0,y0,x1,y1,yA,yB,v1,v2}=P,win=(x,y,w,h)=>{g.fillStyle='#16111c';g.fillRect(x-1,y-1,w+2,h+2);g.fillStyle='#9fd3f0';g.fillRect(x,y,w,h);g.fillStyle='#dff2fb';g.fillRect(x,y,w,1);g.fillStyle='#16111c';w>h?g.fillRect(x+w/2,y,1,h):g.fillRect(x,y+h/2,w,1)};
win((v1+v2)/2-6,y0-2,24,4);win((v2+x1)/2-4,y0-2,24,4);win(x0+14,y0-2,22,4);win(x0-2,yB+30,4,26);win(x0-2,y0+30,4,24);win(x1-60,y1-2,30,4);
win(x0+60,y1-2,40,4);if(P.mid){g.fillStyle='#8a2a3a';g.fillRect(x0+52,y1-9,10,7);g.fillRect(x0+98,y1-9,10,7);g.fillStyle='#16111c';g.fillRect(x0+52,y1-10,56,1);g.fillStyle='#a83a4a';g.fillRect(x0+53,y1-8,3,5);g.fillRect(x0+99,y1-8,3,5)}g.restore()}}
