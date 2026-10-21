//# maps/warehouse.js — Warehouse map
function mapWare(){
const ww=880,wh=440,x0=(WW-ww)/2,y0=(WH-wh)/2,x1=x0+ww,y1=y0+wh,cx=x0+ww/2,cy=y0+wh/2,bxa=x1-380,hy0=cy-28,hy1=cy+28;
HS={px:cx-20,py:cy-5,cx,cy,nx0:x0-30,nx1:x1+30,ny0:y0-30,ny1:y1+30};
hwall(y0,x0,x1,[cx],34);hwall(y1,x0,x1,[cx],34);vwall(x0,y0,y1,[cy],34);vwall(x1,y0,y1,[cy],28);
vwall(bxa,y0,y1,[cy],28);hwall(hy0,bxa,x1,[bxa+95,bxa+285],22);hwall(hy1,bxa,x1,[bxa+63,bxa+190,bxa+317],22);vwall(bxa+190,y0,hy0,[]);vwall(bxa+127,hy1,y1,[]);vwall(bxa+253,hy1,y1,[]);
const LX=60,LY=330,LP=66,LN=16,BX=450,BY=1470,BP=64,BN=20,TC=['#e8e8e4','#d9dde3','#c9d3e0','#e3d9cf','#dfe6dc'],SC=['#2f6fd0','#c0392b','#2f8a4a','#d68a1c','#6a4a9a'],TR2=[];
for(let i=0;i<LN;i++)if((i*7+3)%5!=0)TR2.push([70,LY+i*LP+8,210,50,0,i]);
for(let j=0;j<BN;j++)if((j*5+1)%6!=0)TR2.push([BX+j*BP+7,1540,50,210,1,j]);
const TX=740,TY=150,TN=16;for(const j of[1,2,6,9,13])TR2.push([TX+j*BP+7,TY,50,210,2,j+3]);
for(const t of TR2)WL.push([t[0],t[1],t[2],t[3],1]);
const YA=[690,740,790,960,1010,1060],CARS=[];for(const y of YA)if((y/50|0)%3!=0)CARS.push([x1+46,y+7,YA.indexOf(y)]);for(let i=0;i<8;i++)if((i*5+2)%7!=0)CARS.push([x1+196,690+i*50+7,i+7]);
for(const c of CARS)WL.push([c[0],c[1],88,36,1]);
const ct=[[cx-130,y0-90,90,28],[cx+40,y0-90,90,28],[x1-200,y0-150,90,28],[x1-100,y0-150,28,90]],bd=[[x0-45,cy-70]];
SM=bd.map(b=>({x:b[0],y:b[1]-6}));for(const a of ct)WL.push([...a,1]);for(const b of bd)WL.push([b[0]-6,b[1]-6,12,12,1]);
WL.push([450,150,96,84,1],[432,262,10,16,1]);const FC=[];fv(FC,336,0,270,[]);fv(FC,438,0,150,[]);WL.push(...FC);
const ofc=[];for(let k=0;k<2;k++)ofc.push([bxa+k*190+30,y0+30,80,28],[bxa+k*190+150,y0+10,22,40]);
for(const rx of[bxa,bxa+127])for(const dx of[40,75,110])ofc.push([rx+dx,y1-64,4,56]);
ofc.push([bxa+8,hy1+36,16,70],[bxa+253-24,hy1+36,16,70],[x1-22,hy1+16,14,110],[bxa+261,y1-26,92,18],[bxa+287,hy1+86,50,12]);
for(const a of ofc)WL.push([...a,1]);
const KO=[[20,300,350,1400],[330,0,445,1800],[440,1370,1790,1790],[430,120,700,310],[x1-10,y0-30,x1+310,y1+30],[x0-40,y0-40,x1+40,y1+40],[cx-140,y0-160,x1-60,y0-70],[x0-100,cy-150,x0,cy+60],[730,130,1790,525]];
const DEC=scatter(2,[['lamp',2],['cone',2],['barrel',1],['pallet',1],['tire',1],['can',1],['box',1],['crate',1]],40,KO);
for(const[k,x,y]of[['conveyor',x0+100,y0+105],['conveyor',x0+290,y0+105],['conveyor',x0+190,y0+175],
['shelf',x0+70,y1-18],['shelf',x0+170,y1-18],['shelf',x0+270,y1-18],['shelf',x0+70,y1-92],['shelf',x0+170,y1-92],['forklift',x0+330,y1-160],
['pbox',cx-40,cy-60],['pbox',cx+10,cy+90],['crate',bxa-30,cy+60],['barrel',x0+340,y0+58],['barrel',x0+362,y0+66],['box',x0+330,y1-24],['box',x0+352,y1-24],
['panel',x0+16,y0+70],['panel',x0+16,y0+140],['panel',x0+16,y1-44],['panel',x0+16,y1-114],['panel',x0+90,y0+48],['panel',x0+150,y0+48],['panel',x0+210,y0+48],['panel',x0+270,y0+48],
['bush',600,250],['bush',650,200],['lamp',470,250],['lamp',x1+150,y0-20],['lamp',x1+150,y1+20]])put(DEC,k,x,y);WL.push([246,1774,8,10,2]);
grid();
const g=ground('#4a4d53','#464950','#4e5158');
g.fillStyle='#3f7a3a';g.fillRect(560,0,WW-560,100);g.fillRect(546,120,150,190);g.fillStyle='#4f8f3f';for(let i=0;i<120;i++)g.fillRect(560+(i*97)%(WW-560),(i*31)%100,6,3);for(let i=0;i<30;i++)g.fillRect(550+(i*37)%140,124+(i*53)%180,6,3);
g.fillStyle='#8a8d94';g.fillRect(560,98,WW-560,4);g.fillRect(546,308,150,4);g.fillRect(694,120,4,190);
g.fillStyle='rgba(0,0,0,.16)';for(let i=0;i<22;i++){g.beginPath();g.ellipse((Math.sin(i*5.1)*.5+.5)*WW,(Math.sin(i*9.7+2)*.5+.5)*WH,18+i%4*8,10+i%3*5,0,0,7);g.fill()}
g.fillStyle='#d8d8d2';for(let y=0;y<WH;y+=48){g.fillRect(383,y,4,26)}g.fillStyle='rgba(215,218,224,.55)';g.fillRect(340,0,3,WH);g.fillRect(427,0,3,WH);
g.fillRect(430,1380,WW-430,3);g.fillRect(430,1467,WW-430,3);g.fillStyle='#d8d8d2';for(let x=440;x<WW;x+=48)g.fillRect(x,1423,26,4);
g.fillStyle='#f2f2f2';g.fillRect(340,248,90,6);g.font='bold 22px ui-monospace,monospace';g.textAlign='center';g.fillText('STOP',385,214);
g.fillStyle='#e8e8e4';for(let i=0;i<=LN;i++)g.fillRect(LX,LY+i*LP-1,275,3);g.fillRect(LX-1,LY,3,LN*LP);
g.font='bold 20px ui-monospace,monospace';for(let i=0;i<LN;i++)g.fillText(String(i+1),312,LY+i*LP+LP/2+7);
for(let j=0;j<=BN;j++)g.fillRect(BX+j*BP-1,BY,3,280);g.fillRect(BX,BY+279,BN*BP,3);
for(let j=0;j<BN;j++)g.fillText(String(LN+j+1),BX+j*BP+BP/2,BY+34);
for(let j=0;j<=TN;j++)g.fillRect(TX+j*BP-1,TY,3,280);g.fillRect(TX,TY,TN*BP,3);for(let j=0;j<TN;j++)g.fillText(String(LN+BN+j+1),TX+j*BP+BP/2,TY+246);
g.fillStyle='rgba(215,218,224,.55)';g.fillRect(430,440,WW-430,3);g.fillRect(430,520,WW-430,3);g.fillStyle='#d8d8d2';for(let x=440;x<WW;x+=48)g.fillRect(x,479,26,4);g.fillStyle='#e8e8e4';
for(const y of[690,740,790,840,960,1010,1060,1110])g.fillRect(x1+42,y-1,96,3);for(let i=0;i<=8;i++)g.fillRect(x1+190,690+i*50-1,100,3);g.fillRect(x1+289,690,3,400);
g.fillStyle='#d8b92e';for(let y=640;y<1180;y+=36)g.fillRect(x1+163,y,4,18);
g.fillStyle='rgba(0,0,0,.2)';for(const c of CARS)g.fillRect(c[0]+3,c[1]+30,88,10);
chk(g,x0,y0,ww,wh,'#8d8f94','#85878c');
chk(g,bxa,y0,190,hy0-y0,'#6f7f98','#677790');chk(g,bxa+190,y0,190,hy0-y0,'#7a6f98','#706590');chk(g,bxa,hy0,380,56,'#b9bec6','#aeb3bb');
chk(g,bxa,hy1,127,y1-hy1,'#cfe3ea','#bcd5de');chk(g,bxa+127,hy1,126,y1-hy1,'#d9d6ea','#c8c4de');chk(g,bxa+253,hy1,127,y1-hy1,'#d8d8d0','#c9c9c0');
g.fillStyle='#d8b92e';for(const ly of[y0+68,y0+138,y1-130])g.fillRect(x0+14,ly,bxa-x0-28,3);for(const lx of[x0+14,bxa-17])g.fillRect(lx,y0+68,3,y1-y0-100);
for(const[hx_,hy_,hw_,vert]of[[cx-34,y0,68,0],[cx-34,y1-6,68,0],[x0,cy-34,68,1],[x1-6,cy-28,56,1]])for(let i=0;i<hw_;i+=8){g.fillStyle=(i/8)%2?'#d8b92e':'#222';vert?g.fillRect(hx_,hy_+i,6,8):g.fillRect(hx_+i,hy_,8,6)}
for(let k=0;k<2;k++){const rx=bxa+k*190;
g.fillStyle='#7a5a3a';g.fillRect(rx+30,y0+30,80,28);g.fillStyle='#a8703a';g.fillRect(rx+30,y0+30,80,5);g.fillStyle='#222';g.fillRect(rx+58,y0+18,24,14);g.fillStyle='#59a';g.fillRect(rx+60,y0+20,20,9);
g.fillStyle='#3a3d46';g.fillRect(rx+62,y0+64,16,14);g.fillStyle='#6b7078';g.fillRect(rx+150,y0+10,22,40);g.fillStyle='#8a909c';g.fillRect(rx+152,y0+14,18,6);g.fillRect(rx+152,y0+26,18,6);g.fillRect(rx+152,y0+38,18,6);g.fillStyle='#2f7d32';g.fillRect(rx+12,y0+10,12,12);g.fillStyle='#6b4a2a';g.fillRect(rx+15,y0+22,6,6)}
for(const rx of[bxa,bxa+127]){for(const dx of[40,75,110]){g.fillStyle='#8a909c';g.fillRect(rx+dx,y1-64,4,56)}
for(const sx of[rx+57,rx+92]){g.fillStyle='#fff';g.fillRect(sx-7,y1-30,14,14);g.fillStyle='#dfe6ea';g.fillRect(sx-5,y1-44,10,10)}}
for(const sx of[bxa+8,bxa+253-24]){g.fillStyle='#8a909c';g.fillRect(sx,hy1+36,16,70);g.fillStyle='#fff';g.fillRect(sx+3,hy1+44,10,12);g.fillRect(sx+3,hy1+68,10,12);g.fillStyle='#8fc3e8';g.fillRect(sx+(sx==bxa+8?16:-2),hy1+40,2,60)}
{const rx=bxa+253;g.fillStyle='#16111c';g.fillRect(x1-23,hy1+15,16,112);for(let i=0;i<5;i++){g.fillStyle=i%2?'#6a6f7a':'#3a6fb5';g.fillRect(x1-22,hy1+16+i*22,14,20);g.fillStyle='#16111c';g.fillRect(x1-18,hy1+20+i*22,6,1);g.fillRect(x1-18,hy1+23+i*22,6,1);g.fillRect(x1-12,hy1+28+i*22,2,3)}
g.fillStyle='#16111c';g.fillRect(rx+7,y1-27,94,20);for(let i=0;i<5;i++){g.fillStyle=i%2?'#3a6fb5':'#6a6f7a';g.fillRect(rx+8+i*18,y1-26,17,18);g.fillStyle='#16111c';g.fillRect(rx+12+i*18,y1-23,8,1);g.fillRect(rx+12+i*18,y1-20,8,1)}
g.fillStyle='#a8703a';g.fillRect(rx+34,hy1+86,50,12);g.fillStyle='#7a5a3a';g.fillRect(rx+36,hy1+98,4,8);g.fillRect(rx+78,hy1+98,4,8)}
g.fillStyle='#3fd25a';g.fillRect(x1-40,hy0+6,24,8);
wl(g,'#33363b','#8a8f96');
g.fillStyle='#16111c';g.fillRect(449,149,98,86);g.fillStyle='#6c7686';g.fillRect(450,150,96,84);g.fillStyle='#8a95a8';g.fillRect(450,150,96,10);g.fillStyle='#55606f';g.fillRect(456,166,84,62);g.fillStyle='#14101a';g.fillRect(450,204,8,22);g.fillStyle='#8fc3e8';g.fillRect(450,170,6,26);g.fillRect(456,150,3,0);g.fillStyle='#3a3d46';g.fillRect(500,170,28,20);g.fillStyle='#8a909c';g.fillRect(502,172,24,4);g.fillStyle='#e8c53a';g.fillRect(470,152,56,4);
g.fillStyle='#3a3d46';g.fillRect(432,262,10,16);g.fillStyle='#8a909c';g.fillRect(434,264,6,4);g.save();g.translate(436,270);g.rotate(Math.PI);g.fillStyle='#16111c';g.fillRect(-1,-4,98,8);for(let i=0;i<8;i++){g.fillStyle=i%2?'#e8e8e4':'#d83a3a';g.fillRect(i*12,-3,12,6)}g.restore();g.fillStyle='#e0443a';g.fillRect(435,258,4,4);
for(const f of FC)fenceV(g,f[0]+2,f[1],f[3]);
const cc=['#b5483a','#3a6fb5','#4f8a4a','#c9a02e','#7a4a8a','#d07a2a'];
ct.forEach((c,i)=>{g.fillStyle='#222';g.fillRect(c[0]-1,c[1]-1,c[2]+2,c[3]+2);g.fillStyle=cc[i%6];g.fillRect(c[0],c[1],c[2],c[3]);g.fillStyle='rgba(0,0,0,.22)';if(c[2]>c[3])for(let k=6;k<c[2];k+=8)g.fillRect(c[0]+k,c[1],2,c[3]);else for(let k=6;k<c[3];k+=8)g.fillRect(c[0],c[1]+k,c[2],2)});
for(const t of TR2){const L=t[4]?t[3]:t[2],W=t[4]?t[2]:t[3],i=t[5];g.save();if(t[4]){g.translate(t[0]+W/2,t[1]+L/2);g.rotate(t[4]==2?Math.PI/2:-Math.PI/2)}else g.translate(t[0]+L/2,t[1]+W/2);trl(g,L,W,TC[(i*3+t[4])%5],SC[(i*2+1)%5]);g.restore()}
const carC=['#c0392b','#2f6fd0','#2f8a4a','#d8d8d4','#26262c','#d68a1c','#6a4a9a'];for(const c of CARS)car2(g,c[0],c[1],carC[c[2]%7]);
for(const b of bd){g.fillStyle='rgba(255,140,40,.25)';g.beginPath();g.arc(b[0],b[1],20,0,7);g.fill();g.fillStyle='#8a3a22';g.fillRect(b[0]-6,b[1]-6,12,12);g.fillStyle='#ff9a2e';g.fillRect(b[0]-4,b[1]-4,8,8)}
paintDec(g,DEC);vDraw(g,150,1680,200,110,g=>whSign(g,250,1784))}
