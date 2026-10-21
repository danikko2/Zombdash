//# maps/enchanted-forest.js — Enchanted Forest map
// ---------- Enchanted Forest: dense spooky woods, winding paths, an old road through the middle ----------
function fsH(i,k){const v=Math.sin(i*12.9898+k*78.233+2.9)*43758.5453;return v-Math.floor(v)}
function fsRoadY(x){return 1000+60*Math.sin(x/420)+20*Math.sin(x/160+1)}
function fsCR(P_,n){const o=[];for(let i=0;i<P_.length-1;i++){const p0=P_[Math.max(0,i-1)],p1=P_[i],p2=P_[i+1],p3=P_[Math.min(P_.length-1,i+2)];for(let k=0;k<n;k++){const t=k/n,t2=t*t,t3=t2*t;o.push([.5*(2*p1[0]+(-p0[0]+p2[0])*t+(2*p0[0]-5*p1[0]+4*p2[0]-p3[0])*t2+(-p0[0]+3*p1[0]-3*p2[0]+p3[0])*t3),.5*(2*p1[1]+(-p0[1]+p2[1])*t+(2*p0[1]-5*p1[1]+4*p2[1]-p3[1])*t2+(-p0[1]+3*p1[1]-3*p2[1]+p3[1])*t3)])}}o.push(P_[P_.length-1]);return o}
function fsZones(){if(fsZones.Z)return fsZones.Z;const ry=fsRoadY,pth=[
[[500,ry(500)],[470,760],[420,520],[430,300],[700,180],[960,0]],
[[1300,ry(1300)],[1330,1200],[1260,1380],[1250,1520],[1360,1760],[1420,2000]],
[[1900,ry(1900)],[1960,800],[2040,560],[2060,420],[2350,330],[2600,280]],
[[430,420],[760,500],[1050,620],[1320,560],[1650,480],[2060,430]],
[[820,ry(820)],[780,1200],[680,1420],[640,1560],[300,1660],[0,1720]],
[[1250,1500],[1600,1600],[1900,1560],[2200,1600],[2600,1700]],
[[1050,620],[1110,780],[1150,ry(1150)]],
[[640,1560],[900,1640],[1100,1580],[1250,1500]],
[[2150,ry(2150)],[2120,1250],[2160,1450],[2200,1610]],
[[2060,430],[2300,620],[2420,820],[2450,ry(2450)]],
[[430,420],[220,330],[0,280]],
[[200,ry(200)],[180,800],[260,600],[430,420]],
[[1600,1600],[1680,1800],[1880,1900],[2000,2000]],
[[960,0],[1180,200],[1320,560]],
[[1650,480],[1640,700],[1700,ry(1700)]]].map(p=>fsCR(p,12));
const clr=[[2430,170,170],[430,420,140],[1250,1490,150],[2050,440,140],[640,1560,120],[2200,1610,120]];return fsZones.Z={pth,clr}}
function fsPD(x,y){const Z=fsZones();let d=1e9;for(const p of Z.pth)for(let i=0;i<p.length;i+=1){const q=p[i],e=Math.hypot(q[0]-x,q[1]-y);if(e<d)d=e}return d}
function fsOpen(x,y,m){const Z=fsZones();if(Math.abs(y-fsRoadY(x))<70+m)return 1;if(fsPD(x,y)<58+m)return 1;return Z.clr.some(c=>Math.hypot(x-c[0],y-c[1])<c[2]+m)}
// canopy sprites: twisted teal / violet oaks and black pines
function fsSpr(k,r,v){const key=k+'_'+r+'_'+Math.floor(v*3),K=fsSpr.K||(fsSpr.K={});if(K[key])return K[key];const R=r+2,cv=document.createElement('canvas');cv.width=R*2+2;cv.height=k==2?Math.ceil(r*2.4)+4:R*2+2;const g=cv.getContext('2d'),x=R+1;
if(k==2){const y=cv.height-2;for(let i=0;i<3;i++){const w=r*(1-i*.25),yy=y-i*r*.45;g.fillStyle='#0c0a10';g.beginPath();g.moveTo(x-w-1,yy+1);g.lineTo(x,yy-r*.9-1);g.lineTo(x+w+1,yy+1);g.fill();g.fillStyle=i==2?'#24403a':'#18302c';g.beginPath();g.moveTo(x-w,yy);g.lineTo(x,yy-r*.85);g.lineTo(x+w,yy);g.fill()}}
else{const cy=R+1,P_=k==3?(v<.5?['#2a6a2e','#3a8a3a','#5aaa4a']:['#2f702c','#448e36','#68b04c']):k==4?(v<.5?['#3a7a2a','#5a9a32','#8ac04a']:['#2e6630','#3f8a3e','#62a85a']):k==1?['#2e2440','#3e3058','#5a4a7a']:v<.5?['#1e3a36','#2a4e48','#3e6a62']:['#203430','#2e4a40','#4a6a58'];g.fillStyle='#0c0a10';g.beginPath();g.arc(x,cy,r+1,0,7);g.fill();g.fillStyle=P_[0];g.beginPath();g.arc(x,cy,r,0,7);g.fill();g.fillStyle=P_[1];g.beginPath();g.arc(x-r*.3,cy-r*.3,r*.55,0,7);g.fill();g.beginPath();g.arc(x+r*.35,cy-r*.05,r*.42,0,7);g.fill();g.fillStyle=P_[2];g.globalAlpha=.6;g.beginPath();g.arc(x-r*.4,cy-r*.45,r*.24,0,7);g.fill();g.globalAlpha=1;
if(k<3)for(let i=0;i<4;i++){g.fillStyle='rgba(8,6,10,.5)';g.fillRect(x-r*.6+i*r*.35,cy+r*.1+(i%2)*3,2,r*.5)}}
return K[key]=cv}
function mapForest(){WW=2600;WH=2000;fsZones.Z=null;const Z=fsZones();
HS={px:1300,py:fsRoadY(1300),cx:1300,cy:1000,nx0:-999,nx1:-998,ny0:-999,ny1:-998};
// trees everywhere except the road, paths and clearings
const T=[];let n=0;for(let gy=10;gy<WH;gy+=40)for(let gx=10;gx<WW;gx+=40){n++;const x=gx+(fsH(n,1)-.5)*24,y=gy+(fsH(n,2)-.5)*24;if(fsOpen(x,y,10))continue;const k=fsH(n,3)<.22?2:fsH(n,4)<.25?1:0;T.push({x,y,k,r:Math.round(k==2?14+fsH(n,5)*5:18+fsH(n,5)*9),v:fsH(n,6)});WL.push([x-13,y-13,26,26,2])}
// a broken carriage on the roadside, a signpost, stones round the witch's circle
const DEC=[],pp=(k,x,y)=>put(DEC,k,x,y);
pp('wagon',980,fsRoadY(980)-52);
// the witch's cabin up in the far corner
const CB=[2370,70,2550,210];hwall(CB[1],CB[0],CB[2],[]);hwall(CB[3],CB[0],CB[2],[2430],22);vwall(CB[0],CB[1],CB[3],[]);vwall(CB[2],CB[1],CB[3],[]);HS.HO=[{x:CB[0],y:CB[1],w:CB[2]-CB[0],h:CB[3]-CB[1]}];
pp('cauld',2490,170);pp('bookshelf',2410,104);pp('bed',2520,110);pp('cdl',2470,110);pp('skull',2400,190);pp('jack',2350,250);pp('jack',2525,250);pp('jack',2560,230);pp('broom',2565,195);pp('scare',2330,260);WL.push([1606,fsRoadY(1600)-78,8,8,2]);
for(let i=0;i<7;i++){const a=i/7*6.283;pp('stonec',2050+Math.cos(a)*92,440+Math.sin(a)*70+20)}pp('cauld',2050,452);
for(const[x,y]of[[370,380],[480,360],[400,480],[500,470]])pp('stonec',x,y);pp('bench',430,440);
pp('scare',1250,1450);for(let i=0;i<14;i++){const a=fsH(i,7)*6.283,r=40+fsH(i,8)*90;pp('jack',1250+Math.cos(a)*r,1500+Math.sin(a)*r*.7)}
const GS=['g_cross','g_round','g_slab','g_obelisk'];for(let i=0;i<9;i++)pp(GS[i%4],590+(i%3)*50,1510+Math.floor(i/3)*44);
for(const[x,y]of[[2140,1570],[2260,1570],[2200,1660],[2130,1660]])pp('lantern',x,y);pp('log',2200,1610);
for(let x=200;x<WW;x+=360)pp('lantern',x,fsRoadY(x)-62);
// glowing mushrooms along the paths
const SH=[];for(let i=0;i<300;i++){const p=Z.pth[i%Z.pth.length],q=p[Math.floor(fsH(i,9)*p.length)],a=fsH(i,10)*6.283,x=q[0]+Math.cos(a)*68,y=q[1]+Math.sin(a)*68;if(x<20||y<20||x>WW-20||y>WH-20)continue;if(WL.some(w=>x>w[0]-8&&x<w[0]+w[2]+8&&y>w[1]-8&&y<w[1]+w[3]+8))continue;if(i%3==0){pp('shroom',x,y);SH.push([x,y-6])}}
// spawn points: along the paths and the road, so zombies come walking out of the woods
const SP=[],free=(x,y)=>x>20&&y>20&&x<WW-20&&y<WH-20&&!WL.some(w=>x>w[0]-16&&x<w[0]+w[2]+16&&y>w[1]-16&&y<w[1]+w[3]+16);
for(const p of Z.pth)for(let i=0;i<p.length;i+=4){const[x,y]=p[i];if(free(x,y))SP.push([x,y])}for(let x=40;x<WW;x+=120){const y=fsRoadY(x);if(free(x,y))SP.push([x,y])}HS.sp=SP;
DEC.ko=[[0,0,WW,WH]];SM=[{x:2050,y:430}];grid();
const g=ground('#252e22','#212a1e','#2a3426','#1a2218');
// forest floor, clearings, paths, the cobbled road
for(let y=0;y<WH;y+=8)for(let x=0;x<WW;x+=8){const cx=x+4,cy=y+4,h=fsH(x*.37+y*1.7,11);let c=null;if(Z.clr.some(k=>Math.hypot(cx-k[0],cy-k[1])<k[2]+6*Math.sin(cx/9+cy/7)))c=h<.5?'#34422c':'#3a4a30';const pd=fsPD(cx,cy);if(pd<52+3*Math.sin(cy/11))c=h<.5?'#5a4a38':'#634f3a';else if(pd<60)c='#4a3e30';if(c){g.fillStyle=c;g.fillRect(x,y,8,8)}}
for(let i=0;i<5200;i++){const x=fsH(i,12)*WW,y=fsH(i,13)*WH;if(fsOpen(x,y,-20))continue;const k=fsH(i,14);if(k<.4){g.fillStyle=['#4a2a4a','#6a3a2a','#3a4a2a','#5a4a2a'][i%4];g.fillRect(x,y,3,2)}else if(k<.55){g.fillStyle='#14100c';g.fillRect(x,y,7,1)}else if(k<.7){g.fillStyle='#2e4a34';g.fillRect(x,y,4,3)}}
for(let x=0;x<WW;x+=4){const y=fsRoadY(x+2);g.fillStyle='#3e3a30';g.fillRect(x,y-62,4,124);g.fillStyle='#55524a';g.fillRect(x,y-54,4,108)}
for(let i=0;i<2600;i++){const x=fsH(i,15)*WW,y=fsRoadY(x)+(fsH(i,16)-.5)*100;g.fillStyle=i%3?'#6a6860':'#4a4840';g.fillRect(x,y,5+i%3,3+i%2)}
for(let x=0;x<WW;x+=3){const y=fsRoadY(x);g.fillStyle='rgba(30,26,20,.5)';g.fillRect(x,y-24,3,4);g.fillRect(x,y+20,3,4)}
// signpost: MANSION ← | CITY →
{const sx=1606,sy=fsRoadY(1600)-70;g.fillStyle='#16111c';g.fillRect(sx-4,sy-62,9,72);g.fillStyle='#5a3a22';g.fillRect(sx-3,sy-61,7,70);for(const[dy,t,dir]of[[-56,'MANSION',-1],[-36,'CITY',1]]){const w=72,bx=dir<0?sx-w+4:sx-4;g.fillStyle='#16111c';g.fillRect(bx-1,sy+dy-1,w+2,16);g.fillStyle='#8a6a3a';g.fillRect(bx,sy+dy,w,14);g.fillStyle='#16111c';g.beginPath();dir<0?(g.moveTo(bx-8,sy+dy+7),g.lineTo(bx,sy+dy-1),g.lineTo(bx,sy+dy+15)):(g.moveTo(bx+w+8,sy+dy+7),g.lineTo(bx+w,sy+dy-1),g.lineTo(bx+w,sy+dy+15));g.fill();g.fillStyle='#e8d8a8';g.font='bold 10px Arial, Helvetica, sans-serif';g.textAlign='center';g.textBaseline='middle';g.fillText(t,bx+w/2,sy+dy+7.5)}g.textAlign='left';g.textBaseline='alphabetic'}
{const[a,b,c,d]=[2370,70,2550,210];g.fillStyle='#2a1e16';g.fillRect(a,b,c-a,d-b);g.fillStyle='#34261a';for(let y=b;y<d;y+=10)g.fillRect(a,y,c-a,1);g.fillStyle='rgba(120,40,140,.25)';g.beginPath();g.arc(2470,150,40,0,7);g.fill();g.strokeStyle='rgba(180,90,220,.5)';g.lineWidth=1;g.beginPath();g.arc(2470,150,32,0,7);g.stroke();
for(const w of WL){if(w[4]||w[0]<a-6||w[0]>c+6||w[1]<b-6||w[1]>d+6)continue;g.fillStyle='#120c0a';g.fillRect(w[0]-1,w[1]-1,w[2]+2,w[3]+2);g.fillStyle='#4a3424';g.fillRect(w[0],w[1],w[2],w[3]);g.fillStyle='#5e4430';if(w[2]>w[3])for(let x=w[0]+3;x<w[0]+w[2];x+=9)g.fillRect(x,w[1]+1,2,w[3]-2);else for(let y=w[1]+3;y<w[1]+w[3];y+=9)g.fillRect(w[0]+1,y,w[2]-2,2)}
g.fillStyle='#16111c';g.fillRect(2398,b-4,24,8);g.fillStyle='#e8b040';g.fillRect(2400,b-2,20,4);g.fillStyle='#16111c';g.fillRect(2498,b-4,24,8);g.fillStyle='#9a6ae0';g.fillRect(2500,b-2,20,4);
g.fillStyle='#16111c';g.fillRect(2380,d+10,104,20);g.fillStyle='#4a3424';g.fillRect(2382,d+12,100,16);g.fillStyle='#c8a8e8';g.font='bold 9px Arial, Helvetica, sans-serif';g.textAlign='center';g.textBaseline='middle';g.fillText("WITCH'S CABIN",2432,d+20.5);g.textAlign='left';g.textBaseline='alphabetic'}
// trunks, then everything placed, then canopies (baked here and redrawn over anyone behind them)
for(const t of T){g.fillStyle='rgba(0,0,0,.35)';g.beginPath();g.ellipse(t.x+4,t.y+2,t.r*.9,t.r*.45,0,0,7);g.fill();g.fillStyle='#0c0a10';g.fillRect(t.x-4,t.y-7,8,10);g.fillStyle='#2e2420';g.fillRect(t.x-3,t.y-7,6,9)}
paintDec(g,DEC);
const C=48,cw=Math.ceil(WW/C),ch=Math.ceil(WH/C),cells=new Array(cw*ch);T.sort((a,b)=>a.y-b.y);
for(const t of T){if(typeof document=='undefined'||!document.createElement)break;const sp=fsSpr(t.k,t.r,t.v),sx=Math.round(t.x-sp.width/2),sy=Math.round(t.k==2?t.y-10-sp.height+2:t.y-t.r*.7-sp.height/2);t.sp=sp;t.sx=sx;t.sy=sy;g.drawImage(sp,sx,sy);const i=Math.floor(t.x/C),j=Math.floor(t.y/C);(cells[j*cw+i]||(cells[j*cw+i]=[])).push(t)}
HS.FS={C,cw,ch,cells,SH,W:Array.from({length:22},(_,i)=>({p:i%Z.pth.length,u:fsH(i,17),s:.01+fsH(i,18)*.02,o:fsH(i,19)*6.283}))}}
// glowing mushrooms + will-o'-wisps drifting along the paths (under people)
function fsAnim(){const F=HS.FS;if(!F||!F.SH.length)return;const t=performance.now()/1000,x0=cam.x-40,y0=cam.y-40,x1=cam.x+W+40,y1=cam.y+H+40;
for(const s of F.SH){if(s[0]<x0||s[0]>x1||s[1]<y0||s[1]>y1)continue;const a=.5+.5*Math.sin(t*1.7+s[0]*.1);X.fillStyle='#8ae8ff';X.globalAlpha=.08+.08*a;X.beginPath();X.arc(s[0],s[1],16,0,7);X.fill()}X.globalAlpha=1}
// tree tops over anyone behind them, then wisps on top
function fsCan(){const F=HS.FS;if(!F||typeof document=='undefined'||!document.createElement)return;const E=fgEnts(cam.x,cam.y,cam.x+W,cam.y+H);
for(const e of E){const a=Math.max(0,Math.floor((e.x0-40)/F.C)),b=Math.min(F.cw-1,Math.floor((e.x1+40)/F.C)),c=Math.max(0,Math.floor((e.y0-20)/F.C)),d=Math.min(F.ch-1,Math.floor((e.y1+70)/F.C));
for(let j=c;j<=d;j++)for(let i=a;i<=b;i++){const L=F.cells[j*F.cw+i];if(!L)continue;for(const t of L){if(!t.sp)continue;if(t.sx>e.x1||t.sx+t.sp.width<e.x0||t.sy>e.y1||t.sy+t.sp.height<e.y0)continue;X.save();X.beginPath();X.rect(e.x0,e.y0,e.x1-e.x0,e.y1-e.y0);X.clip();X.drawImage(t.sp,t.sx,t.sy);X.restore()}}}
const Z=fsZones(),tm=performance.now()/1000;for(const w of F.W){const p=Z.pth[w.p],u=(w.u+tm*w.s)%1,f=u*(p.length-1),i=Math.floor(f),q=p[i],r=p[Math.min(p.length-1,i+1)],x=q[0]+(r[0]-q[0])*(f-i)+Math.sin(tm*1.3+w.o)*16,y=q[1]+(r[1]-q[1])*(f-i)-18+Math.cos(tm*1.7+w.o)*10;
if(x<cam.x-30||x>cam.x+W+30||y<cam.y-30||y>cam.y+H+30)continue;X.fillStyle='#9affe8';X.globalAlpha=.12;X.beginPath();X.arc(x,y,14,0,7);X.fill();X.globalAlpha=.3;X.beginPath();X.arc(x,y,6,0,7);X.fill();X.globalAlpha=1;X.fillStyle='#e8fff8';X.fillRect(Math.round(x)-1,Math.round(y)-1,3,3)}}

