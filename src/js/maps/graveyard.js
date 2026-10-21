//# maps/graveyard.js — Graveyard map
function mapGrave(){
const mw=300,mh=220,x0=(WW-mw)/2,y0=(WH-mh)/2,x1=x0+mw,y1=y0+mh,cx=x0+mw/2,cy=y0+mh/2;
HS={px:cx,py:cy,cx,cy,nx0:x0-15,nx1:x1+15,ny0:y0-15,ny1:y1+15};
hwall(y0,x0,x1,[cx],30);hwall(y1,x0,x1,[cx],30);vwall(x0,y0,y1,[]);vwall(x1,y0,y1,[]);
const sc=[[x0+14,cy-16,40,32],[x1-54,cy-16,40,32]];for(const a of sc)WL.push([...a,1]);
const cl=130,ct=130,cw=420,ch=330,cr=cl+cw,cb=ct+ch,ccx=cl+cw/2;
hwall(ct,cl,cr,[]);hwall(cb,cl,cr,[ccx],34);vwall(cl,ct,cb,[]);vwall(cr,ct,cb,[]);
const mx=1250,my=150,mx2=260,my2=190;WL.push([mx,my,mx2,my2]);
const fx=1450,fy=1380;WL.push([fx-50,fy-26,100,52,1],[fx-26,fy-50,52,100,1]);
const ay=1740;WL.push([cx-96,ay-70,40,70,1],[cx+56,ay-70,40,70,1]);
const alt=[ccx-45,ct+14,90,30],csk=[ccx+40,ct+78,64,34];WL.push([...alt,1],[...csk,1]);
const PR=[[cx-30,0,60,WH],[ccx-22,cb,44,100],[ccx-22,cb+78,cx-ccx+22,44],[cx,398,mx+mx2/2-cx+22,44],[mx+mx2/2-22,my+my2,44,100],[cx,fy-22,fx-cx,44]];
const KB=[[x0-80,y0-80,x1+80,y1+80],[cl-40,ct-40,cr+40,cb+60],[mx-40,my-40,mx+mx2+40,my+my2+110],[fx-150,fy-150,fx+150,fy+150],[cx-120,ay-170,cx+120,WH],[90,980,790,1760],...PR.map(r=>[r[0]-30,r[1]-30,r[0]+r[2]+30,r[1]+r[3]+30])];
KB.push(...grvKB());const GR=[],DT=[],inK=(x,y)=>KB.some(k=>x>k[0]&&x<k[2]&&y>k[1]&&y<k[3]);
for(let j=0;j<8;j++)for(let i=0;i<10;i++){const gx=WW*(.06+i*.098)+Math.sin(i*7.3+j*3.1)*14,gy=WH*(.06+j*.125)+Math.cos(i*4.1+j*2.3)*14;if(inK(gx,gy)||(i*3+j*5)%4==0)continue;GR.push([gx,gy]);WL.push([gx-7,gy-9,14,16,1])}
for(let i=0;i<18;i++){const x=((Math.sin(i*12.98+1)*43758)%1+1)%1*WW,y=((Math.sin(i*78.2+5)*24634)%1+1)%1*WH;if(inK(x,y)||x<30||y<40||x>WW-30||y>WH-30)continue;DT.push([x,y]);WL.push([x-5,y-3,10,8,1])}
const GV=grvWL();const DEC=scatter(3,[['cross',3],['candle',2],['bones',2],['statue',1],['dead',3],['rock',2],['tuft',3],['fence',1.5],['stump',1],['log',1],['bush',1]],115,KB);
const GS=['g_round','g_cross','g_obelisk','g_slab','g_wide','g_angel'];
for(let j=0;j<7;j++)for(let i=0;i<10;i++){if((i+j*5)%11==0)continue;put(DEC,GS[(i*2+j*3)%6],140+i*64+Math.sin(i+j)*5,1060+j*92)}
for(let k=0;k<4;k++){put(DEC,'pew',cl+26+64,ct+160+k*50);put(DEC,'pew',cr-26-64,ct+160+k*50)}
put(DEC,'candle',ccx-60,ct+70);put(DEC,'candle',ccx+60,ct+60);put(DEC,'candle',cl+30,ct+50);put(DEC,'candle',cr-30,ct+50);put(DEC,'bones',ccx+30,ct+135);
grvDec(DEC);put(DEC,'statue',ccx-140,cb-14);put(DEC,'statue',ccx+140,cb-14);put(DEC,'candle',cx-70,ay+6);put(DEC,'candle',cx+70,ay+6);
grid();
const g=ground('#3b5a43','#35523d','#406147','#2c4533');
g.fillStyle='#6b5a43';for(const r of PR)g.fillRect(r[0],r[1],r[2],r[3]);
g.beginPath();g.arc(fx,fy,128,0,7);g.fill();g.fillStyle='#857357';for(let i=0;i<150;i++)g.fillRect(cx-28+(i*37)%56,(i*97)%WH,3,2);
g.fillStyle='#7c7468';g.beginPath();g.arc(fx,fy,88,0,7);g.fill();g.fillStyle='#8f8a7e';for(let i=0;i<60;i++){const a=i*2.4,r=58+(i*7)%28;g.fillRect(fx+Math.cos(a)*r,fy+Math.sin(a)*r,5,3)}
g.fillStyle='#1b1b1b';for(let x=0;x<WW;x+=12){g.fillRect(x,0,3,14);if(Math.abs(x-cx)>66)g.fillRect(x,WH-14,3,14)}for(let y=0;y<WH;y+=12){g.fillRect(0,y,14,3);g.fillRect(WW-14,y,14,3)}g.fillRect(0,5,WW,3);g.fillRect(0,WH-8,cx-66,3);g.fillRect(cx+66,WH-8,WW-cx-66,3);
chk(g,x0,y0,mw,mh,'#5b5b63','#53535b');chk(g,cl,ct,cw,ch,'#6b4e34','#62472f');
g.fillStyle='#7a2a2a';g.fillRect(ccx-26,ct+44,52,ch-44);g.fillStyle='#a8863a';g.fillRect(ccx-26,ct+44,3,ch-44);g.fillRect(ccx+23,ct+44,3,ch-44);
g.fillStyle='#8a8a92';g.fillRect(alt[0],alt[1],alt[2],alt[3]);g.fillStyle='#a5a5ad';g.fillRect(alt[0]+3,alt[1]+3,alt[2]-6,alt[3]-6);g.fillStyle='#e8d8a0';g.fillRect(ccx-2,alt[1]+6,4,18);g.fillRect(ccx-8,alt[1]+11,16,4);
for(const a of sc){g.fillStyle='#8a8a92';g.fillRect(a[0],a[1],a[2],a[3]);g.fillStyle='#a5a5ad';g.fillRect(a[0]+3,a[1]+3,a[2]-6,a[3]-6)}
g.fillStyle='rgba(20,12,8,.5)';for(let i=0;i<14;i++)g.fillRect(ccx+66-i*5+(i%3)*2,ct+118+i*13,6+i%3*2,4);g.beginPath();g.ellipse(ccx+70,ct+96,52,26,0,0,7);g.fill();
wl(g,'#2b2b30','#8a8a92');
for(let k=0;k<3;k++){const wx=ccx-120+k*120,wc=['#c0392b','#2e86c1','#f1c40f'][k];g.fillStyle='rgba(255,255,255,.08)';g.fillRect(wx-10,ct+4,20,70);g.fillStyle=wc;g.fillRect(wx-7,ct-3,14,10);g.globalAlpha=.16;g.fillRect(wx-10,ct+8,20,60);g.globalAlpha=1}
for(const wy of[ct+90,ct+190]){g.fillStyle='#2e86c1';g.fillRect(cl-3,wy,8,18);g.fillStyle='#c0392b';g.fillRect(cr-5,wy,8,18)}
g.fillStyle='#c9a36a';g.fillRect(ccx-34,cb-3,68,6);
g.save();g.translate(ccx+70,ct+96);g.rotate(.5);g.fillStyle='#16111c';g.fillRect(-35,-15,70,30);g.fillStyle='#5a3a22';g.fillRect(-32,-12,64,24);g.fillStyle='#7a4f2a';g.fillRect(-32,-12,64,4);g.fillStyle='#e8e4d8';g.fillRect(-26,-6,52,12);g.fillStyle='#3a2a1c';g.fillRect(-26,-6,10,12);g.restore();
g.save();g.translate(ccx-20,ct+128);g.rotate(-.45);g.fillStyle='#16111c';g.fillRect(-32,-12,64,24);g.fillStyle='#6b4a2a';g.fillRect(-30,-10,60,20);g.fillStyle='#8a5a2c';g.fillRect(-30,-10,60,4);g.fillStyle='#d8c070';g.fillRect(-3,-8,6,16);g.restore();
for(let i=0;i<5;i++){g.fillStyle='rgba(15,10,8,.6)';g.fillRect(ccx+40+i*3,ct+112+i*2,2,12)}
g.fillStyle='#5b5b63';g.fillRect(mx,my,mx2,34);g.fillStyle='#6c6c74';g.fillRect(mx+6,my+34,mx2-12,6);
for(let i=0;i<4;i++){g.fillStyle='#b4b4bc';g.fillRect(mx+14+i*78,my+62,16,mx2>0?my2-62:0);g.fillStyle='#8a8a92';g.fillRect(mx+14+i*78,my+62,4,my2-62)}
g.fillStyle='#14101a';g.fillRect(mx+mx2/2-26,my+84,52,my2-84);g.fillStyle='#ffd24a';g.fillRect(mx+mx2/2-20,my+92,40,my2-92);g.fillStyle='#fff2b0';g.fillRect(mx+mx2/2-12,my+102,24,my2-102);
g.fillStyle='#26262c';for(let i=0;i<5;i++)g.fillRect(mx+mx2/2-20+i*9,my+92,3,my2-92);g.fillRect(mx+mx2/2-26,my+120,52,3);
for(const wx of[mx+36,mx+mx2-56]){g.fillStyle='#14101a';g.fillRect(wx-2,my+78,24,42);g.fillStyle='#ffd24a';g.fillRect(wx,my+80,20,38);g.fillStyle='#26262c';g.fillRect(wx+9,my+80,2,38)}
const gl=mx+mx2/2,gy=my+my2;for(let r=190;r>20;r-=12){g.fillStyle='rgba(255,210,70,'+(.016+(190-r)/9000)+')';g.beginPath();g.arc(gl,gy-30,r,0,7);g.fill()}
for(let k=0;k<3;k++){g.fillStyle='rgba(255,215,90,'+(.1+k*.05)+')';g.beginPath();g.moveTo(gl-24+k*5,gy);g.lineTo(gl+24-k*5,gy);g.lineTo(gl+70-k*14,gy+150);g.lineTo(gl-70+k*14,gy+150);g.fill()}
const ring=(r,c)=>{g.fillStyle=c;g.beginPath();g.arc(fx,fy,r,0,7);g.fill()};
ring(54,'#16111c');ring(50,'#9a9aa2');ring(43,'#7c7c84');ring(37,'#4a90c8');g.fillStyle='#7ab8e8';for(let i=0;i<5;i++){g.beginPath();g.arc(fx,fy+2,10+i*6,.2+i,1.4+i);g.lineTo(fx,fy+2);g.fill()}
g.fillStyle='#16111c';g.fillRect(fx-10,fy-26,20,26);g.fillStyle='#9a9aa2';g.fillRect(fx-8,fy-24,16,22);g.fillStyle='#b4b4bc';g.fillRect(fx-15,fy-30,30,8);g.fillStyle='#4a90c8';g.fillRect(fx-12,fy-28,24,4);g.fillStyle='#bfe3f5';for(const[dx,dy]of[[0,-40],[-5,-36],[5,-37],[-8,-32],[8,-31]])g.fillRect(fx+dx-1,fy+dy,3,4);
const px1=cx-96,px2=cx+56,pw=40,ph=70,ab=ay-ph;
g.strokeStyle='#16111c';g.lineWidth=46;g.beginPath();g.arc(cx,ab,76,Math.PI,0);g.stroke();g.strokeStyle='#8a8a92';g.lineWidth=40;g.beginPath();g.arc(cx,ab,76,Math.PI,0);g.stroke();g.strokeStyle='#a5a5ad';g.lineWidth=6;g.beginPath();g.arc(cx,ab,88,Math.PI,0);g.stroke();
for(const px of[px1,px2]){g.fillStyle='#16111c';g.fillRect(px-2,ab-2,pw+4,ph+4);g.fillStyle='#8a8a92';g.fillRect(px,ab,pw,ph);g.fillStyle='#a5a5ad';g.fillRect(px,ab,8,ph);g.fillStyle='#6c6c74';g.fillRect(px+pw-8,ab,8,ph);g.fillStyle='#b4b4bc';g.fillRect(px-4,ab-6,pw+8,10);g.fillStyle='#6c6c74';g.fillRect(px-4,ay-8,pw+8,8);g.fillStyle='#ffd24a';g.fillRect(px+pw/2-6,ab+16,12,16);g.fillStyle='#16111c';g.fillRect(px+pw/2-1,ab+16,2,16)}
g.fillStyle='#b4b4bc';g.fillRect(cx-9,ab-100,18,28);g.fillStyle='#6c6c74';g.fillRect(cx-9,ab-76,18,4);g.fillStyle='#16111c';g.fillRect(cx-26,ab-94,52,16);g.fillStyle='#d8c070';g.fillRect(cx-23,ab-91,46,10);
for(const side of[-1,1]){const gx2=cx+side*56;g.fillStyle='#26262c';for(let i=0;i<5;i++)g.fillRect(gx2-(side>0?(i*5+4):(i*5+4)*-1)-(side>0?0:0),ay-64+i*0,0,0);g.fillRect(gx2-(side>0?4:22),ab+12,4,52);g.fillRect(gx2-(side>0?14:12),ab+12,4,52);g.fillRect(gx2-(side>0?24:2),ab+12,4,52)}
for(const lx of[px1+pw/2,px2+pw/2]){for(let r=60;r>6;r-=9){g.fillStyle='rgba(255,210,70,'+(.02+(60-r)/1800)+')';g.beginPath();g.arc(lx,ab+24,r,0,7);g.fill()}}
for(const[x,y]of GR){g.fillStyle='rgba(0,0,0,.25)';g.fillRect(x-8,y+7,16,6);g.fillStyle='#222';g.fillRect(x-8,y-10,16,18);g.fillStyle='#9a9aa2';g.fillRect(x-7,y-9,14,15);g.fillStyle='#6c6c74';g.fillRect(x-1,y-6,2,9);g.fillRect(x-4,y-3,8,2)}
for(const[x,y]of DT){g.strokeStyle='#3a2f28';g.lineWidth=4;g.beginPath();g.moveTo(x,y+4);g.lineTo(x,y-34);g.moveTo(x,y-18);g.lineTo(x-14,y-32);g.moveTo(x,y-24);g.lineTo(x+13,y-38);g.stroke()}
grvPaint(g,GV);paintDec(g,DEC)}
