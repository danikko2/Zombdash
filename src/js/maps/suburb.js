//# maps/suburb.js — Suburb map (map 0) and shared wall helpers
function hwall(y,xa,xb,gaps,hw=26){let x=xa;for(const g of gaps){WL.push([x,y-3,g-hw-x,6]);x=g+hw}WL.push([x,y-3,xb-x,6])}
function mapSuburb(){
const hw=340,hh=380,gd=130;WW=2300;WH=1800;
const x0=(WW-hw-gd)/2,y0=(WH-hh)/2-60,x1=x0+hw,y1=y0+hh,yA=y0+hh*.32,yB=y0+hh*.5,hm=(yA+yB)/2,gx=x1+gd,ry=y1+90;
const kx=x0+hw*.2,b1=x0+hw*.55,b2=x0+hw*.85,cx=x0+hw/2,v1=x0+hw*.4,v2=x0+hw*.7;
HS={cx,px:cx,py:(yB+y1)/2,cy:(y0+y1)/2,nx0:x0-640,nx1:x1+770,ny0:y0-200,ny1:y1+15};WL=[];TR=[];const lx=Math.max(120,WW*.14),hx=WW-170,hy=WH-150;SM=[{x:lx+28,y:ry+24},{x:hx+10,y:hy}];
hwall(y0,x0,x1,[kx]);hwall(y1,x0,x1,[cx]);hwall(yA,x0,x1,[kx,b1,b2]);hwall(yB,x0,x1,[cx],45);
WL.push([x0-3,y0-3,6,hh+6],[v1-3,y0,6,yA-y0],[v2-3,y0,6,yA-y0],[x1-3,y0-3,6,hm-26-y0+3],[x1-3,hm+26,6,y1-hm-23],
[x1,yA-3,gd,6],[gx-3,yA-3,6,y1-yA+6],[x1,y1-3,15,6],[gx-15,y1-3,15,6],[gx-52,yB+25,44,80],[lx-30,ry+6,104,50,1],[hx-40,hy-16,80,32,1]);
const hwL=320,hhL=400,gdL=140,hwR=360,hhR=360,gdR=120,xlb=x0-570,xrb=gx+110;
const HL=mkHouse(xlb,y1,hwL,hhL,gdL,1,{a:.35,b:.53,v1:.36,v2:.68,c1:['#6f86a6','#6579a0'],c2:['#a68ab0','#9a7fa4'],h:['#8a7a6a','#80705f'],l:['#c4a874','#b89c68'],car:'#2c7a8a'}),
HR=mkHouse(xrb,y1,hwR,hhR,gdR,0,{a:.30,b:.48,v1:.44,v2:.74,c1:['#86a66f','#799b62'],c2:['#d0a86a','#c49c5c'],h:['#7f6a52','#755f48'],l:['#b08a5a','#a88252'],car:'#c9a02e'});
const yT=y0-180,fL=xlb-40,fM1=x0-55,fM2=gx+55,fR=xrb+hwR+gdR+40,FC=[],GT=[{x:fM1,y:yT+90,v:1},{x:fM2,y:yT+90,v:1}],EX=[cx,x1+65,HL.fx,HL.dx,HR.fx,HR.dx],TG=[(fL+fM1)/2,(fM1+fM2)/2,(fM2+fR)/2];
for(const t of TG)GT.push({x:t,y:yT,v:0});
fh(FC,yT,fL,fR,TG);fv(FC,fL,yT,HL.yA,[]);fh(FC,HL.yA,fL,HL.gx0,[]);
fv(FC,fM1,yT,y0,[yT+90]);fh(FC,HL.y0,HL.bx1,fM1,[]);fh(FC,y0,fM1,x0,[]);
fv(FC,fM2,yT,yA,[yT+90]);fh(FC,yA,gx,fM2,[]);fh(FC,HR.y0,fM2,HR.bx0,[]);
fv(FC,fR,yT,HR.yA,[]);fh(FC,HR.yA,HR.gx1,fR,[]);
WL.push(...FC);HS.H=[HL,HR];HS.F={fL,fM1,fM2,fR,yT};
for(let i=0;i<40;i++){const x=((Math.sin(i*12.98)*43758)%1+1)%1*WW,y=((Math.sin(i*78.2+3)*24634)%1+1)%1*WH;
if((x>fL-60&&x<fR+60&&y>yT-60&&y<ry+80)||(x>hx-90&&y>hy-90)||Math.abs(y-(ry+32))<60||x<30||y<30||x>WW-30||y>WH-30)continue;TR.push([x,y]);WL.push([x-6,y-6,12,12])}
const DEC=scatter(1,[['bush',3],['flower',3],['rock',2],['tuft',4],['stump',1],['log',1],['can',1]],70,[[fL-30,yT-30,fR+30,y1+60],[0,ry-40,WW,ry+90],[lx-80,ry-60,lx+140,ry+90],[hx-130,hy-110,WW,WH],[0,0,WW,yT-10],[0,ry+60,WW,WH]]);
for(let x=110;x<WW-60;x+=230)if(EX.every(e=>Math.abs(x-e)>62))put(DEC,'lamp',x,ry-14);
put(DEC,'bench',cx-110,ry-14);put(DEC,'mail',cx+46,ry-16);put(DEC,'bush',x0+22,y1+24);put(DEC,'bush',x1-22,y1+24);
for(const fx of[x0+70,x1-80,cx-70,cx+70])put(DEC,'flower',fx,y1+20);put(DEC,'can',x0+40,y0-6);
for(const[k,x,y]of[['table',fL+110,HL.y0-26],['grill',fM1-190,HL.y0-30],['bush',fL+24,yT+36],['bush',fM1-30,yT+36],['flower',fL+250,yT+50],['flower',fL+330,yT+50],
['doghouse',fM1+290,y0-40],['table',fM2-110,yT+110],['grill',fM1+190,yT+60],['bush',fM1+30,yT+36],['bush',fM2-30,yT+34],['flower',fM1+120,yT+50],['flower',fM1+200,yT+50],
['table',fM2+260,HR.y0-30],['grill',fR-50,yT+60],['doghouse',fM2+90,yT+40],['bush',fM2+30,yT+36],['bush',fR-30,yT+36],['flower',fM2+330,yT+50],['flower',fM2+410,yT+50]])put(DEC,k,x,y);
subForest({yT,ry,hx,hy,TG,fL,fR});grid();
BG.width=WW;BG.height=WH;const g=BG.getContext('2d');
for(let y=0;y<WH;y+=16)for(let x=0;x<WW;x+=16){const h=(x*7+y*13)%5;g.fillStyle=h<2?'#4fae4a':h<4?'#58b852':'#47a043';g.fillRect(x,y,16,16);
if((x*31+y*17)%7==0){g.fillStyle='#3a8a38';g.fillRect(x+4,y+6,2,5);g.fillRect(x+9,y+4,2,6)}}
subGround(g,{yT,ry,hx,hy,TG});g.fillStyle='#a8a49a';g.fillRect(0,ry-14,WW,14);g.fillStyle='#b8b4a8';g.fillRect(cx-16,y1,32,ry-y1);g.fillRect(x1+15,y1,gd-30,ry-y1);
g.fillStyle='#3d4045';g.fillRect(0,ry,WW,64);g.fillStyle='#d8d8d0';g.fillRect(0,ry,WW,3);g.fillRect(0,ry+61,WW,3);g.fillStyle='#e8c53a';for(let x=0;x<WW;x+=48)g.fillRect(x,ry+30,28,4);g.fillStyle='#e8e8e0';for(let i=0;i<6;i++)g.fillRect(cx-32+i*11,ry+8,6,48);g.fillStyle='#2c2f34';g.beginPath();g.arc(WW*.7,ry+44,9,0,7);g.fill();g.fillStyle='#41454c';g.beginPath();g.arc(WW*.7,ry+44,6,0,7);g.fill();g.fillStyle='rgba(0,0,0,.25)';for(let i=0;i<14;i++)g.fillRect((i*137+40)%WW,ry+10+(i*23)%44,18+i%3*8,2);
const fl=(x,y,w,h,a,b)=>{for(let j=0;j<h;j+=16)for(let i=0;i<w;i+=16){g.fillStyle=((i+j)/16)%2?a:b;g.fillRect(x+i,y+j,Math.min(16,w-i),Math.min(16,h-j))}};
fl(x0,y0,v1-x0,yA-y0,'#d9d9d2','#c4c4bc');fl(v1,y0,v2-v1,yA-y0,'#6a7fb5','#6076ab');fl(v2,y0,x1-v2,yA-y0,'#a56a8a','#9b6082');
fl(x0,yA,hw,yB-yA,'#8a6a4a','#80613f');fl(x0,yB,hw,y1-yB,'#b08a5a','#a88252');fl(x1,yA,gd,y1-yA,'#8d8d8d','#838383');
g.fillStyle='#7a5a3a';g.fillRect(x0+6,y0+6,v1-x0-12,12);g.fillStyle='#333';g.fillRect(x0+14,y0+8,14,8);g.fillStyle='#8b5a2b';g.fillRect(kx-14,y0+hh*.14,28,22);
[v1,v2].forEach((v,i)=>{g.fillStyle=i?'#e7d5e0':'#dfe6f5';g.fillRect(v+10,y0+14,32,44);g.fillStyle='#fff';g.fillRect(v+12,y0+16,28,10)});
g.fillStyle='#8a3a3a';g.fillRect(cx-40,yB+(y1-yB)*.4,80,36);g.fillStyle='#7a3b3b';g.fillRect(x0+12,y1-40,70,22);g.fillStyle='#222';g.fillRect(x1-62,yB+12,50,10);g.fillStyle='#59a';g.fillRect(x1-58,yB+14,42,5);
g.fillStyle='#c9a36a';g.fillRect(cx-26,y1-3,52,6);g.fillRect(kx-26,y0-3,52,6);g.fillStyle='#6b4a2a';g.fillRect(cx-16,y1+5,32,8);g.fillRect(kx-16,y0-13,32,8);
g.fillStyle='#6e6e6e';g.fillRect(x1+20,yA+60,30,18);
g.fillStyle='rgba(255,255,255,.05)';for(let x=fL;x<fR;x+=40)g.fillRect(x,yT,20,y0-yT);HL.paint(g,1);HR.paint(g,1);const PM={x0,y0,x1,y1,yA,yB,v1,v2,kx,cx,gx,hw,hh,gd,mir:0,xm:0,mid:1};subHouses(g,[PM,HL.P,HR.P]);
for(const w of WL){if(w[4])continue;g.fillStyle='#2e2420';g.fillRect(w[0],w[1],w[2],w[3]);g.fillStyle='#7a695c';g.fillRect(w[0]+1,w[1]+1,Math.max(0,w[2]-2),Math.max(0,w[3]-2))}
for(const f of FC)f[2]>f[3]?fenceH(g,f[0],f[1]+2,f[2]):fenceV(g,f[0]+2,f[1],f[3]);
for(const t of GT){g.fillStyle='#2a2c34';if(t.v){g.fillRect(t.x-4,t.y-34,8,12);g.fillRect(t.x-4,t.y+22,8,12);fenceH(g,t.x-40,t.y-26,40)}else{g.fillRect(t.x-34,t.y-4,12,8);g.fillRect(t.x+22,t.y-4,12,8);fenceV(g,t.x-26,t.y-42,40)}}
HL.paint(g,2);HR.paint(g,2);subWins(g,[PM,HL.P,HR.P]);
g.fillStyle='#b32f2f';g.fillRect(gx-52,yB+25,44,80);g.fillStyle='#8fc3e8';g.fillRect(gx-46,yB+40,32,14);g.fillRect(gx-46,yB+80,32,10);g.fillStyle='#e8e8c0';g.fillRect(gx-50,yB+101,10,4);g.fillRect(gx-20,yB+101,10,4);
const car=(x,y,a,c)=>vDraw(g,x-36,y-36,72,72,g=>{g.save();g.translate(x,y);g.rotate(a);g.fillStyle='#111';g.fillRect(-25,-10,54,26);g.fillStyle=c;g.fillRect(-27,-13,54,26);g.fillStyle='rgba(0,0,0,.25)';g.fillRect(-27,-13,54,3);g.fillRect(-27,10,54,3);g.fillStyle='#8fc3e8';g.fillRect(-9,-10,16,20);g.fillStyle='#e8e8c0';g.fillRect(23,-11,4,5);g.fillRect(23,6,4,5);g.fillStyle='#3a2216';g.fillRect(16,-9,11,18);g.restore()});
g.fillStyle='rgba(0,0,0,.35)';[14,28,40].forEach(o=>g.fillRect(lx-140,ry+o,100,3));
car(lx,ry+22,-.18,'#2f6fd0');car(lx+46,ry+34,3.14+.42,'#e0a82e');
g.fillStyle='#bfe3f5';for(let i=0;i<12;i++)g.fillRect(lx+18+(i*37%40),ry+8+(i*17%44),3,3);g.fillStyle='#555';g.fillRect(lx+60,ry+52,8,4);g.fillRect(lx-26,ry+4,6,3);
g.fillStyle='rgba(20,20,15,.5)';g.beginPath();g.ellipse(hx,hy+4,76,50,0,0,7);g.fill();
vDraw(g,hx-46,hy-46,92,92,g=>{g.save();g.translate(hx,hy);g.rotate(.6);g.fillStyle='#333';g.fillRect(-30,13,60,4);g.fillStyle='#55664a';g.fillRect(-32,-12,64,24);g.fillStyle='#7fb3cf';g.fillRect(14,-9,16,18);g.fillStyle='#2a2a24';g.fillRect(-12,-12,18,24);g.fillStyle='#e8e8c0';g.fillRect(20,-9,1,18);g.restore();});
g.save();g.translate(hx-74,hy-44);g.rotate(.5);g.fillStyle='#55664a';g.fillRect(-28,-4,56,8);g.fillRect(22,-14,6,14);g.restore();
g.save();g.translate(hx+16,hy-38);g.rotate(.9);g.fillStyle='#2b2b2b';g.fillRect(-46,-2,92,4);g.rotate(2);g.fillRect(-30,-2,60,4);g.restore();
for(const[x,y]of TR){g.fillStyle='#6b4a2a';g.fillRect(x-6,y-6,12,12);g.fillStyle='#2f7d32';g.beginPath();g.arc(x,y-12,19,0,7);g.fill();g.fillStyle='#3f9a3f';g.beginPath();g.arc(x-5,y-17,9,0,7);g.fill()}paintDec(g,DEC);subTrees(g)}
function grid(){gw=Math.ceil(WW/gs);gh=Math.ceil(WH/gs);bl=new Uint8Array(gw*gh);fd=new Int16Array(gw*gh);
for(let j=0;j<gh;j++)for(let i=0;i<gw;i++){const px=i*gs+8,py=j*gs+8;bl[j*gw+i]=wlAt(px,py).some(w=>px>w[0]-9&&px<w[0]+w[2]+9&&py>w[1]-9&&py<w[1]+w[3]+9)?1:0}}
function vwall(x,ya,yb,gaps,hw=26){let y=ya;for(const g of gaps){WL.push([x-3,y,6,g-hw-y]);y=g+hw}WL.push([x-3,y,6,yb-y])}
function ground(a,b,c,t){BG.width=WW;BG.height=WH;const g=BG.getContext('2d');for(let y=0;y<WH;y+=16)for(let x=0;x<WW;x+=16){const h=(x*7+y*13)%5;g.fillStyle=h<2?a:h<4?b:c;g.fillRect(x,y,16,16);if(t&&(x*31+y*17)%7==0){g.fillStyle=t;g.fillRect(x+4,y+6,2,5);g.fillRect(x+9,y+4,2,6)}}return g}
function chk(g,x,y,w,h,a,b){for(let j=0;j<h;j+=16)for(let i=0;i<w;i+=16){g.fillStyle=((i+j)/16)%2?a:b;g.fillRect(x+i,y+j,Math.min(16,w-i),Math.min(16,h-j))}}
function wl(g,d,l){for(const w of WL){if(w[4])continue;g.fillStyle=d;g.fillRect(w[0],w[1],w[2],w[3]);g.fillStyle=l;g.fillRect(w[0]+1,w[1]+1,Math.max(0,w[2]-2),Math.max(0,w[3]-2))}}
function trl(g,L,W,col,st){vRec(g,-L/2-1,-W/2-4,L+2,W+8,q=>trl(q,L,W,col,st));g.fillStyle='#16111c';g.fillRect(-L/2-1,-W/2-1,L+2,W+2);g.fillStyle=col;g.fillRect(-L/2,-W/2,L,W);g.fillStyle='rgba(0,0,0,.14)';for(let i=14;i<L-6;i+=14)g.fillRect(-L/2+i,-W/2,2,W);
g.fillStyle='rgba(255,255,255,.35)';g.fillRect(-L/2,-W/2,L,4);g.fillStyle=st;g.fillRect(-L/2+10,-6,L-50,12);g.fillStyle='rgba(255,255,255,.55)';g.fillRect(-L/2+16,-2,L-62,3);
g.fillStyle='#3a3d46';g.fillRect(-L/2,-W/2,7,W);g.fillStyle='#16111c';g.fillRect(-L/2+3,-W/2+4,1,W-8);g.fillRect(-L/2+5,-W/2+4,1,W-8);
g.fillStyle='#26262c';for(const sy of[-1,1])for(const wx of[-L/2+26,-L/2+44])g.fillRect(wx,sy*(W/2+1)-3,14,6);
g.fillStyle='#8a909c';for(const sy of[-1,1])g.fillRect(L/2-46,sy*(W/2-5)-2,6,5);g.fillStyle='#3a3d46';g.fillRect(L/2-6,-W/2,6,W)}
function car2(g,x,y,col){vRec(g,x-1,y-1,90,38,q=>car2(q,x,y,col));g.fillStyle='#16111c';g.fillRect(x-1,y-1,90,38);g.fillStyle=col;g.fillRect(x,y,88,36);g.fillStyle='rgba(255,255,255,.25)';g.fillRect(x,y,88,4);g.fillStyle='rgba(0,0,0,.2)';g.fillRect(x+22,y+5,40,26);g.fillStyle='#8fc3e8';g.fillRect(x+60,y+5,10,26);g.fillRect(x+14,y+5,8,26);g.fillStyle=col;g.fillRect(x+30,y+7,26,22);g.fillStyle='rgba(255,255,255,.18)';g.fillRect(x+30,y+7,26,4);
g.fillStyle='#ffe9a0';g.fillRect(x+84,y+4,4,7);g.fillRect(x+84,y+25,4,7);g.fillStyle='#c0392b';g.fillRect(x,y+4,3,7);g.fillRect(x,y+25,3,7);g.fillStyle='#26262c';for(const wx of[x+10,x+58])for(const wy of[y-2,y+31])g.fillRect(wx,wy,16,6)}
