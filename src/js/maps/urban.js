//# maps/urban.js — Urban neighborhood map
// ---------- Run-down urban neighborhood on the edge of the city ----------
function ubH(i,k){const v=Math.sin(i*12.9898+k*78.233+4.1)*43758.5453;return v-Math.floor(v)}
// one small house: front door on the street side, a back door, three rooms
function ubHouse(H,D,x,y,w,h,side,k){const fd=x+Math.round(w*.3),bd=x+Math.round(w*.75),top=side=='n',vx=x+Math.round(w*.58),hy=y+Math.round(h*.48);
hwall(y,x,x+w,[top?fd:bd]);hwall(y+h,x,x+w,[top?bd:fd]);vwall(x,y,y+h,[]);vwall(x+w,y,y+h,[]);
if(k!=2)vwall(vx,y,y+h,[top?y+Math.round(h*.25):y+Math.round(h*.75)]);
const pp=(kn,a,b)=>put(D,kn,a,b),by=top?y+h-10:y+40;
if(k==2){for(let r=0;r<3;r++)pp('shelf',x+60+r*90,y+h*.45);pp('table',x+w-50,top?y+h-30:y+40);pp('cabinet',x+w-20,top?y+h-10:y+46);pp('bags',x+30,top?y+h-14:y+40)}
else if(k==1){for(const[a,b]of[[x+34,y+34],[vx-30,y+h-24],[x+w-44,y+40],[x+52,y+h-30],[x+w-50,y+h-24]])pp('rubble',a,b);pp('bones',x+w*.3,y+h*.55)}
else{pp('couch',x+72,y+Math.round(h*.52));pp('table',x+Math.round(w*.36),top?y+Math.round(h*.8):y+Math.round(h*.3));pp('bed',x+40,top?y+h-14:y+66);pp('cabinet',vx-18,top?y+h-12:y+44);
pp('stove',vx+30,by);pp('table',vx+(w-(vx-x))/2,y+h/2+10);pp('chair',vx+(w-(vx-x))/2-24,y+h/2+6);pp('cabinet',x+w-16,top?y+40:y+h-10)}
H.push({x,y,w,h,k,side,fd,bd,vx,hy})}
function ubCar(V,k,x,y,a,o){const s=HWV(k);V.push(Object.assign({k,x,y,a,L:s[0],W:s[1],rust:1},o||{}))}
function mapUrban(){WW=2600;WH=2200;
HS={px:1320,py:615,cx:1320,cy:1100,nx0:-999,nx1:-998,ny0:-999,ny1:-998};
WL.push([0,0,WW,176,2]);
const HZ=[[560,670],[1460,1570]],VT=[[780,890],[1760,1870]],H=[],D=[];
// houses (16), one corner store, three burned out
const HD=[[60,300,260,210,'s',0],[430,290,280,220,'s',0],[950,300,250,210,'s',1],[1300,280,300,230,'s',2],[1930,300,260,210,'s',0],
[60,720,260,210,'n',0],[430,1200,260,210,'s',0],[960,720,270,210,'n',0],[1380,1190,280,220,'s',1],[1940,720,260,210,'n',0],[2280,1200,260,210,'s',0],[430,720,260,210,'n',0],[60,1200,260,210,'s',1],[2290,720,250,210,'n',0],[1940,1200,260,210,'s',0],
[60,1640,260,210,'n',0],[430,1650,280,210,'n',0],[960,1640,260,210,'n',0],[1360,1650,280,210,'n',1],[1940,1640,260,210,'n',0],[2300,1660,250,200,'n',0]];
for(const[x,y,w,h,s,k]of HD)ubHouse(H,D,x,y,w,h,s,k);HS.HO=H;
// beat-up cars along the curbs, a junk lot, a burned wreck in the empty lot
const V=[],ks=['sedan','suv','pickup','van','sedan'],cc=['#7a6a5a','#5a6a7a','#8a5a3a','#6a7a5a','#9a9a92','#5a4a4a','#3a4a5a','#8a7a4a'];let n=0;
const okX=x=>!VT.some(v=>x>v[0]-70&&x<v[1]+70),okY=y=>!HZ.some(v=>y>v[0]-70&&y<v[1]+70);
for(const[a,b]of HZ)for(const cy of[a+22,b-22])for(let x=80;x<WW-60;x+=150+ubH(n,1)*120){n++;if(!okX(x)||ubH(n,2)<.35)continue;const k=ks[n%5];ubCar(V,k,x,cy+(ubH(n,3)-.5)*6,(cy<(a+b)/2?Math.PI:0)+(ubH(n,4)-.5)*.12,{c:cc[n%8],dmg:ubH(n,5)<.3})}
for(const[a,b]of VT)for(const cx of[a+22,b-22])for(let y=260;y<WH-60;y+=150+ubH(n,6)*120){n++;if(!okY(y)||ubH(n,7)<.35)continue;const k=ks[n%5];ubCar(V,k,cx+(ubH(n,8)-.5)*6,y,(cx<(a+b)/2?Math.PI/2:-Math.PI/2)+(ubH(n,9)-.5)*.12,{c:cc[n%8],dmg:ubH(n,10)<.3})}
ubCar(V,'sedan',2320,300,.4,{c:'#7a4a2a'});ubCar(V,'pickup',2470,330,-.6,{c:'#5a6a7a',dmg:1});ubCar(V,'van',2340,450,1.2,{c:'#8a8a82'});ubCar(V,'sedan',2490,470,2.2,{c:'#6a5a4a',dmg:1});
ubCar(V,'sedan',1290,1000,.7,{burn:1});ubCar(V,'suv',1180,400,.2,{c:'#4a4a42',burn:1});ubCar(V,'sedan',840,1020,-1.3,{c:'#8a3a2a',dmg:1});ubCar(V,'pickup',1300,1515,.15,{c:'#6a6a5a',dmg:1});
for(const v of V)hwCol(v);
const pp=(k,x,y)=>put(D,k,x,y);
for(const[x,y]of[[370,540],[1260,710],[2250,700],[720,1430],[1700,1180],[400,1620],[1250,1620],[2250,1600]])pp('dumpster',x,y);
for(const[x,y]of[[1230,1020],[1330,1080],[1170,1100],[2400,380],[2330,520],[2500,260],[600,560],[1650,700]])pp('tire',x,y);
pp('couch',1200,950);pp('cart',1350,940);pp('cart',2200,640);for(const[x,y]of[[340,1450],[1180,650],[2560,660],[700,2180],[1700,1560],[2000,1450],[520,660],[1600,1460]])pp('bags',x,y);
for(const[x,y]of[[770,548],[1750,548],[900,1458],[1880,1458],[770,1586],[1880,690]])pp('hydrant',x,y);
for(const[x,y]of[[760,700],[900,540],[1740,700],[1890,540],[760,1440],[1890,1600],[760,1600],[1740,1440]])pp('lamp',x,y);
for(const[x,y]of[[2300,480],[2420,260],[2520,420]])pp('barrel',x,y);
const FN=[[390,200,540,370],[390,1590,2180,1760],[1300,1590,2180,1890],[2240,690,1180,1000],[390,690,1180,1000]];for(const[x,a,b,gp]of FN)fv(WL,x,a,b,[gp]);
const KO=[[0,0,WW,200],...HZ.map(h=>[0,h[0]-20,WW,h[1]+20]),...VT.map(v=>[v[0]-20,0,v[1]+20,WH]),...H.map(h=>[h.x-20,h.y-20,h.x+h.w+20,h.y+h.h+20]),[2240,220,2580,540],[1150,880,1380,1130]];
D.push(...scatter(11,[['tuft',5],['rock',2],['can',2],['tire',1],['dead',2],['paper',3],['bush',1]],90,KO));D.ko=KO;
HS.sp2=[[-20,800],[-20,1300],[-20,2000],[2620,800],[2620,1300],[2620,2000],[400,2220],[1300,2220],[2200,2220]];
SM=V.filter(v=>v.burn).map(v=>({x:v.x,y:v.y-8}));grid();
const g=ground('#565536','#4f4e32','#5c5b3a','#43422a');
// overgrown yards with bare dirt patches
for(let i=0;i<70;i++){g.fillStyle=i%3?'rgba(90,74,50,.45)':'rgba(60,70,40,.5)';g.beginPath();g.ellipse(ubH(i,11)*WW,200+ubH(i,12)*(WH-200),20+ubH(i,13)*50,10+ubH(i,14)*24,i,0,7);g.fill()}
// sidewalks (cracked, grass through) and worn-out streets
const side=(x,y,w,h)=>{g.fillStyle='#7e7c74';g.fillRect(x,y,w,h);g.fillStyle='#6a6862';for(let i=0;i<w;i+=26)g.fillRect(x+i,y,1,h);for(let j=0;j<h;j+=26)g.fillRect(x,y+j,w,1);for(let i=0;i<w*h/2600;i++){g.fillStyle=i%2?'#4a5a32':'#5a5850';g.fillRect(x+ubH(i,x+y)*w,y+ubH(i,x-y)*h,4,3)}};
for(const[a,b]of HZ){side(0,a-20,WW,20);side(0,b,WW,20)}for(const[a,b]of VT){side(a-20,200,20,WH-200);side(b,200,20,WH-200)}
g.fillStyle='#3e4146';for(const[a,b]of HZ)g.fillRect(0,a,WW,b-a);for(const[a,b]of VT)g.fillRect(a,176,b-a,WH-176);
for(let i=0;i<3000;i++){const hz=i%2,r=hz?HZ[i%4<2?0:1]:VT[i%4<2?0:1],x=hz?ubH(i,15)*WW:r[0]+ubH(i,15)*(r[1]-r[0]),y=hz?r[0]+ubH(i,16)*(r[1]-r[0]):200+ubH(i,16)*(WH-200);g.fillStyle=i%3?'rgba(0,0,0,.14)':'rgba(255,255,255,.05)';g.fillRect(x,y,2+i%4,2)}
g.fillStyle='#46494e';for(let i=0;i<24;i++){const hz=i%2,r=hz?HZ[i%4<2?0:1]:VT[i%4<2?0:1],x=hz?ubH(i,17)*WW:r[0]+20+ubH(i,17)*70,y=hz?r[0]+20+ubH(i,18)*70:220+ubH(i,18)*(WH-240);g.fillRect(x,y,30+ubH(i,19)*40,20+ubH(i,20)*24)}
for(let i=0;i<40;i++){const hz=i%2,r=hz?HZ[i%4<2?0:1]:VT[i%4<2?0:1],x=hz?ubH(i,21)*WW:r[0]+15+ubH(i,21)*80,y=hz?r[0]+15+ubH(i,22)*80:220+ubH(i,22)*(WH-240);crack(g,x,y,10,'rgba(10,10,10,.6)');if(i%3==0){g.fillStyle='#4a5a2a';g.fillRect(x,y,3,4);g.fillRect(x+4,y+2,2,3)}}
for(let i=0;i<16;i++){const hz=i%2,r=hz?HZ[i%4<2?0:1]:VT[i%4<2?0:1],x=hz?ubH(i,23)*WW:r[0]+30+ubH(i,23)*50,y=hz?r[0]+30+ubH(i,24)*50:240+ubH(i,24)*(WH-280),rx=10+ubH(i,25)*12;g.fillStyle='#16141a';g.beginPath();g.ellipse(x,y,rx+2,rx*.6+2,0,0,7);g.fill();g.fillStyle='#3a4038';g.beginPath();g.ellipse(x,y,rx,rx*.6,0,0,7);g.fill();g.fillStyle='rgba(120,140,150,.35)';g.fillRect(x-rx*.4,y-2,rx*.6,2)}
g.fillStyle='rgba(216,180,60,.55)';for(const[a,b]of HZ)for(let x=10;x<WW;x+=80)if(ubH(x,a)>.35&&okX(x))g.fillRect(x,(a+b)/2-2,40,4);for(const[a,b]of VT)for(let y=200;y<WH;y+=80)if(ubH(y,a)>.35&&okY(y))g.fillRect((a+b)/2-2,y,4,40);
g.fillStyle='rgba(230,230,220,.3)';for(const[a,b]of HZ)for(const[c,d]of VT)for(let i=0;i<5;i++){g.fillRect(c-18+i*0,a+12+i*20,16,10);g.fillRect(d+2,a+12+i*20,16,10)}
for(const[x,y]of[[835,615],[1815,615],[835,1515],[1815,1515],[1300,620],[400,1510]]){g.fillStyle='#16141a';g.beginPath();g.arc(x,y,11,0,7);g.fill();g.fillStyle='#4a4a4e';g.beginPath();g.arc(x,y,9,0,7);g.fill();g.fillStyle='#3a3a3e';for(let k=-6;k<=6;k+=3)g.fillRect(x-7,y+k,14,1)}
// house floors: stained carpet, scuffed boards, kitchen linoleum; the burned ones are charred
for(const h of H){const{x,y,w,h:hh,k,vx,hy}=h;if(k==1){chk(g,x,y,w,hh,'#2a2420','#221c18');for(let i=0;i<40;i++){g.fillStyle=i%2?'#14100c':'#3a2a20';g.fillRect(x+ubH(i,x)*w,y+ubH(i,y)*hh,6+i%4*3,3)}continue}
if(k==2){chk(g,x,y,w,hh,'#b8b4a8','#a8a498');continue}
chk(g,x,y,vx-x,hh,'#7a6a5a','#6e5e4e');{const ry=h.side=='n'?y+hh*.6:y;chk(g,x+4,ry+4,vx-x-8,hh*.4-8,'#5a5a6a','#52526a')}chk(g,vx,y,x+w-vx,hh,'#a8a08a','#8a8270');for(let i=0;i<10;i++){g.fillStyle='rgba(40,30,20,.35)';g.beginPath();g.ellipse(x+ubH(i,x+1)*w,y+ubH(i,y+1)*hh,8+i%3*5,5,i,0,7);g.fill()}}
// the city skyline beyond the sound wall
g.fillStyle='#1a1c26';g.fillRect(0,0,WW,176);for(let i=0;i<60;i++){const bw=40+ubH(i,26)*70,bh=40+ubH(i,27)*110,bx=ubH(i,28)*WW;g.fillStyle=i%2?'#262a36':'#2e3240';g.fillRect(bx,150-bh,bw,bh);for(let wy=150-bh+6;wy<145;wy+=9)for(let wx=bx+4;wx<bx+bw-4;wx+=8)if(ubH(wx,wy)<.18){g.fillStyle=ubH(wy,wx)<.5?'#ffd27a':'#c8d8ff';g.fillRect(wx,wy,3,4)}}
g.fillStyle='#16111c';g.fillRect(0,150,WW,28);g.fillStyle='#8a8a84';g.fillRect(0,152,WW,22);g.fillStyle='#a8a8a0';g.fillRect(0,152,WW,4);for(let x=0;x<WW;x+=60){g.fillStyle='#6e6e68';g.fillRect(x,152,2,22)}
for(let i=0;i<10;i++){const x=80+i*260+ubH(i,29)*80,c=['#c0392b','#2f6fd0','#e0b030','#8a3aaa','#2f8a4a'][i%5];g.strokeStyle=c;g.lineWidth=4;g.beginPath();g.moveTo(x,166);for(let k=0;k<6;k++)g.lineTo(x+10+k*12,158+((k*7+i)%3)*5);g.stroke()}
wl(g,'#2a2622','#8a8274');for(const[x,a,b,gp]of FN){fenceV(g,x,a,gp-28-a);fenceV(g,x,gp+28,b-gp-28)}
// boarded windows, graffiti on the walls, broken glass
const has=(x,y,w,hh)=>WL.some(q=>!q[4]&&x>=q[0]&&y>=q[1]&&x+w<=q[0]+q[2]&&y+hh<=q[1]+q[3]);
for(const h of H){for(let x=h.x+30;x<h.x+h.w-40;x+=70)for(const yy of[h.y,h.y+h.h])if(has(x,yy-3,28,6)){const b=ubH(x,yy)<.5;g.fillStyle='#16111c';g.fillRect(x-1,yy-4,30,8);g.fillStyle=b?'#8a6a3a':'#2a3a4a';g.fillRect(x,yy-3,28,6);if(b){g.fillStyle='#6a4a2a';g.fillRect(x+3,yy-4,4,8);g.fillRect(x+18,yy-4,4,8)}else{g.fillStyle='#9ab0c0';g.fillRect(x+4,yy-2,3,4);g.fillRect(x+15,yy-3,2,3)}}
const gy=h.side=='n'?h.y-14:h.y+h.h+6,gx=h.x+h.w*.55;if(ubH(h.x,h.y)<.7){g.lineWidth=3;g.strokeStyle=['#ff3a8a','#3ae8ff','#ffe03a','#8aff3a'][(h.x/10|0)%4];g.beginPath();g.moveTo(gx,gy);for(let k=0;k<5;k++)g.lineTo(gx+8+k*9,gy+((k*5)%3)*3-3);g.stroke()}}
if(true){g.fillStyle='#16111c';g.fillRect(1338,264,224,22);g.fillStyle='#c0392b';g.fillRect(1340,266,220,18);g.fillStyle='#f4f1e6';g.font='bold 13px Arial, Helvetica, sans-serif';g.textAlign='center';g.textBaseline='middle';g.fillText('C RNER M RT',1450,276);g.textAlign='left';g.textBaseline='alphabetic'}
for(const v of V){g.save();g.translate(v.x+4,v.y+5);g.rotate(v.a);g.fillStyle='rgba(0,0,0,.28)';g.fillRect(-v.L/2,-v.W/2,v.L,v.W);g.restore()}
for(const v of V){const r=Math.hypot(v.L,v.W)/2+6;vDraw(g,v.x-r,v.y-r,r*2,r*2,q=>hwDraw(q,v))}
paintDec(g,D)}

