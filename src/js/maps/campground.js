//# maps/campground.js — Campground map
// ---------- CAMPGROUND ----------
function mapCamp(){WW=2300;WH=1900;
const box=(b,t=[],bo=[],l=[],r=[],hw)=>{hwall(b[1],b[0],b[2],t,hw);hwall(b[3],b[0],b[2],bo,hw);vwall(b[0],b[1],b[3],l,hw);vwall(b[2],b[1],b[3],r,hw)};
const sx=y=>520+55*Math.sin(y/260+1)+30*Math.sin(y/90),DY=900,DK=[sx(DY)-250,DY-26,sx(DY)+14,DY+26];
// lake: blocked to walking (bullets fly over it), with the dock cut out
const LK=[];for(let y=-40;y<WH+40;y+=20){const xr=Math.min(sx(y),sx(y+20))-6,r=[-60,y,xr+60,20];
if(y+20>DK[1]&&y<DK[3]){if(DK[1]>y)LK.push([-60,y,xr+60,DK[1]-y]);if(DK[3]<y+20)LK.push([-60,DK[3],xr+60,y+20-DK[3]]);LK.push([-60,Math.max(y,DK[1]),DK[0]+60,Math.min(y+20,DK[3])-Math.max(y,DK[1])])}else LK.push(r)}
for(const r of LK)WL.push([...r,2]);NOGO=[[0,0,640,WH]];
// cabins, shower house
const CB=[];for(const y0 of[170,450])for(const x0 of[760,1010,1260])CB.push([x0,y0,x0+170,y0+130]);
const w0=WL.length;for(const c of CB)box(c,[],[c[0]+85],[],[],22);const w1=WL.length;
const SHW=[1560,190,1860,390];box(SHW,[],[1800],[300],[],24);for(const x of[1640,1700,1760,1820])vwall(x,190,250,[]);const w2=WL.length;
// campfire ring
const FX=1080,FY=1080;WL.push([FX-26,FY-16,52,30,1]);
// parking: cars
const CARS=[];for(let i=0;i<5;i++)CARS.push([1790+i*82,890,i]);[1780,1860,2080,2160].forEach((x,i)=>CARS.push([x,1150,i+5]));for(const c of CARS)WL.push([c[0],c[1],38,88,1]);
// archway pillars over the entrance road
const AY=1640,AX=1980;WL.push([AX-120,AY-26,26,26,1],[AX+94,AY-26,26,26,1]);
const DEC=[];
for(const c of CB){put(DEC,'wbunk',c[0]+34,c[1]+76);put(DEC,'wbunk',c[2]-34,c[1]+76);put(DEC,'footlk',c[0]+85,c[1]+40);put(DEC,'lantern',c[0]+85,c[1]+70)}
for(let k=0;k<4;k++)put(DEC,'msink',1600+k*32,384);put(DEC,'bench',1700,330);
for(let k=0;k<8;k++){const a=k/8*6.283,x=FX+Math.cos(a)*118,y=FY+Math.sin(a)*86;put(DEC,Math.abs(Math.cos(a))>.7?'logv':'logb',x,y+(Math.abs(Math.cos(a))>.7?30:8))}
put(DEC,'canrack',sx(640)+120,640);put(DEC,'canrack',sx(760)+120,760);put(DEC,'canrack',sx(1180)+120,1180);put(DEC,'canoe',sx(1040)+70,1040);put(DEC,'canoe',sx(1300)+80,1300);
put(DEC,'rod',DK[0]+26,DY-8);put(DEC,'rod',DK[0]+70,DY+24);put(DEC,'bucket',DK[0]+48,DY+10);put(DEC,'cooler',DK[0]+110,DY+16);
for(const[x,y]of[[1380,1000],[1380,1110],[1420,1240],[820,1260],[760,1150]])put(DEC,'picnic',x,y);
for(const[x,y]of[[800,1520],[960,1600],[1120,1560],[1290,1620]])put(DEC,'tent',x,y);put(DEC,'cooler',900,1560);put(DEC,'lantern',1050,1590);
for(const[x,y]of[[940,700],[1500,700],[1500,960],[700,980],[1700,1300]])put(DEC,'lantern',x,y);put(DEC,'flagpole',1530,560);
const PINE=[[700,120],[960,110],[1220,120],[1480,110],[1950,120],[2120,160],[2240,300],[2000,420],[2200,600],[1960,640],[2250,1450],[2150,1380],[1700,1560],[1560,1760],[1380,1820],[1150,1800],[900,1800],[700,1700],[640,1450],[1620,1100],[1520,1440],[2230,1800],[1720,1840],[760,420],[1545,490],[1900,480],[2240,780],[640,820],[620,300],];
for(const[x,y]of PINE)put(DEC,'pine',x,y);
const TRL=[[[FX,FY],[930,1010],[790,925],[DK[2]+4,DY]],[[FX,FY],[1050,830],[1110,700],[1095,622]],[[790,628],[1000,642],[1220,612],[1400,630]],[[970,622],[972,470],[968,335]],[[1220,615],[1218,470],[1222,335]],
[[790,336],[1000,346],[1250,330],[1500,342]],[[1500,342],[1530,425],[1660,442],[1800,428]],[[1400,630],[1470,614],[1468,450],[1500,342]],[[FX+150,FY+10],[1330,1052],[1520,1060],[1790,1060]],[[FX,FY+120],[1060,1330],[1030,1450],[1040,1520]]],
AMP=[18,14,9,4,4,7,5,5,7,16],TP=[];
const wander=(pts,a,sd)=>{const out=[];for(let s=0;s<pts.length-1;s++){const[ax,ay]=pts[s],[bx,by]=pts[s+1],L=Math.hypot(bx-ax,by-ay)||1,n=Math.max(2,Math.round(L/18)),nx=-(by-ay)/L,ny=(bx-ax)/L;for(let i=s?1:0;i<=n;i++){const t=i/n,e=Math.sin(t*Math.PI),w=e*a*(Math.sin(t*4.1+sd+s*1.9)+.35*Math.sin(t*9.7+sd*2.1));out.push([ax+(bx-ax)*t+nx*w,ay+(by-ay)*t+ny*w])}}return out};
const TW=TRL.map((t,q)=>wander(t,AMP[q],q*2.7+1));for(const p of TW)TP.push(...p);
const KO=[[0,0,660,WH],...CB.map(c=>[c[0]-30,c[1]-30,c[2]+30,c[3]+40]),[SHW[0]-30,SHW[1]-30,SHW[2]+30,SHW[3]+40],[FX-170,FY-140,FX+170,FY+150],[1750,850,2230,1260],[AX-60,1240,AX+60,WH],[AX-140,AY-60,AX+140,AY+20],...TP.filter((_,q)=>q%2==0).map(([x,y])=>[x-44,y-24,x+44,y+90])];
DEC.push(...scatter(7,[['pine',4],['rock',2],['stump',2],['log',1.5],['bush',3],['tuft',3],['flower',2]],90,KO));DEC.ko=KO;
const SP=[];for(let x=700;x<WW;x+=160){SP.push([x,-20],[x,WH+20])}for(let y=60;y<WH;y+=160)SP.push([WW+20,y]);
HS={px:FX,py:FY+150,cx:FX+150,cy:FY-140,nx0:0,nx1:0,ny0:0,ny1:0,sp:SP};SM=[{x:FX,y:FY-10}];
grid();
const g=ground('#4f8a3e','#548f42','#4a843a','#3a6e30');
// lake + beach
g.fillStyle='#d8c48a';g.beginPath();g.moveTo(0,0);for(let y=0;y<=WH;y+=10)g.lineTo(sx(y)+42,y);g.lineTo(0,WH);g.fill();
g.fillStyle='#2a6a9a';g.beginPath();g.moveTo(0,0);for(let y=0;y<=WH;y+=10)g.lineTo(sx(y),y);g.lineTo(0,WH);g.fill();
g.fillStyle='#3a7ab0';g.beginPath();g.moveTo(0,0);for(let y=0;y<=WH;y+=10)g.lineTo(sx(y)-18,y);g.lineTo(0,WH);g.fill();
g.fillStyle='#1f5a88';g.beginPath();g.moveTo(0,0);for(let y=0;y<=WH;y+=10)g.lineTo(sx(y)-120,y);g.lineTo(0,WH);g.fill();
g.fillStyle='rgba(220,240,255,.35)';for(let i=0;i<90;i++){const y=(i*211)%WH,x=40+(i*97)%Math.max(60,sx(y)-80);g.fillRect(x,y,10+(i%3)*4,2)}
g.fillStyle='#3a8a4a';for(let i=0;i<14;i++){const y=60+(i*137)%1800,x=sx(y)-24;g.fillRect(x,y,3,9);g.fillRect(x+5,y-3,3,12);g.fillRect(x+10,y+1,3,8)}
// dock
g.fillStyle='#16111c';g.fillRect(DK[0]-1,DK[1]-1,DK[2]-DK[0]+2,DK[3]-DK[1]+2);g.fillStyle='#8a5f36';g.fillRect(DK[0],DK[1],DK[2]-DK[0],DK[3]-DK[1]);g.fillStyle='#6b4a2a';for(let x=DK[0];x<DK[2];x+=14)g.fillRect(x,DK[1],2,DK[3]-DK[1]);g.fillStyle='#5a3a22';for(let x=DK[0]+6;x<DK[2];x+=60){g.fillRect(x,DK[1]-6,8,6);g.fillRect(x,DK[3],8,6)}
// trails: wandering dirt paths that bend around the land and never cross a building
const trace=(p)=>{g.beginPath();g.moveTo(p[0][0],p[0][1]);for(let i=1;i<p.length-1;i++){const mx=(p[i][0]+p[i+1][0])/2,my=(p[i][1]+p[i+1][1])/2;g.quadraticCurveTo(p[i][0],p[i][1],mx,my)}const q=p[p.length-1];g.lineTo(q[0],q[1])};

g.lineCap='round';g.lineJoin='round';for(const[c,w]of[['#8a6a3e',36],['#9a7a4a',30],['#a8885a',20]]){g.strokeStyle=c;g.lineWidth=w;for(const p of TW){trace(p);g.stroke()}}
g.fillStyle='rgba(120,94,58,.55)';for(const p of TW)for(let i=0;i<p.length;i+=2){const q=p[i],o=((i*37)%13)-6;g.fillRect(q[0]+o,q[1]+((i*53)%11)-5,3,2)}
g.fillStyle='#7a8a6a';for(const p of TW)for(let i=1;i<p.length;i+=5){const q=p[i],s=i%2?1:-1;g.fillRect(q[0]+s*19,q[1]+((i*17)%9)-4,4,3)}
g.lineCap='butt';g.lineJoin='miter';HS.tp=TP;
// campfire clearing
g.fillStyle='#9a7a4a';g.beginPath();g.ellipse(FX,FY,175,135,0,0,7);g.fill();g.fillStyle='#a8885a';g.beginPath();g.ellipse(FX,FY,155,118,0,0,7);g.fill();
for(let k=0;k<12;k++){const a=k/12*6.283;g.fillStyle='#16111c';g.fillRect(FX+Math.cos(a)*30-7,FY+Math.sin(a)*20-5,14,11);g.fillStyle=k%2?'#8a8f96':'#a8acb4';g.fillRect(FX+Math.cos(a)*30-6,FY+Math.sin(a)*20-4,12,9)}
g.fillStyle='#2a1a10';g.beginPath();g.ellipse(FX,FY,22,13,0,0,7);g.fill();g.fillStyle='#5a3a22';g.fillRect(FX-18,FY-3,36,6);g.fillRect(FX-3,FY-12,6,22);
for(let i=0;i<9;i++){const fx=FX-16+i*4,fh=10+(i*7)%12;g.fillStyle=i%2?'#ff7a1a':'#ffb02e';g.fillRect(fx,FY-fh-4,4,fh);g.fillStyle='#ffe27a';g.fillRect(fx+1,FY-fh*.5-4,2,fh*.5)}
for(let r=120;r>20;r-=10){g.fillStyle='rgba(255,170,60,'+(.012+(120-r)/5000)+')';g.beginPath();g.arc(FX,FY-6,r,0,7);g.fill()}
// parking lot + entrance road + archway
g.fillStyle='#4a4c50';g.fillRect(1760,850,460,410);g.fillRect(AX-44,1250,88,WH-1250);g.fillStyle='#d8d4c0';for(let i=0;i<=5;i++){g.fillRect(1780+i*82,860,3,110);g.fillRect(1780+i*82,1140,3,110)}for(let y=1270;y<WH;y+=46)g.fillRect(AX-2,y,4,24);
for(let i=0;i<20;i++)crack(g,1770+(i*83)%440,860+(i*53)%380,5,'rgba(10,10,10,.5)');
const carC=['#c0392b','#2f6fd0','#2f8a4a','#d8d8d4','#26262c','#d68a1c','#6a4a9a','#8a8f96','#3a8a8a'];for(const c of CARS)carV(g,c[0],c[1],carC[c[2]%carC.length],c[1]<1000);
// cabins + shower house floors
for(const c of CB)chk(g,c[0],c[1],c[2]-c[0],c[3]-c[1],'#9a6f46','#8f6640');
tiles(g,SHW[0],SHW[1],SHW[2]-SHW[0],SHW[3]-SHW[1],'#c8d4dc','#bcc8d0');showerH(g,1580,SHW[1]+4,4,60,54,'#b8c8d4');
wl(g,'#3a2416','#8a5f36');for(let i=w0;i<w1;i++){const w=WL[i];g.fillStyle='#6b4a2a';g.fillRect(w[0]+1,w[1]+1,Math.max(0,w[2]-2),Math.max(0,w[3]-2));g.fillStyle='#8a5f36';if(w[2]>w[3])for(let x=w[0]+4;x<w[0]+w[2];x+=10)g.fillRect(x,w[1]+1,2,w[3]-2);else for(let y=w[1]+4;y<w[1]+w[3];y+=10)g.fillRect(w[0]+1,y,w[2]-2,2)}
for(let i=w1;i<w2;i++){const w=WL[i];g.fillStyle='#d8d4c8';g.fillRect(w[0]+1,w[1]+1,Math.max(0,w[2]-2),Math.max(0,w[3]-2))}
for(const c of CB){g.fillStyle='#16111c';g.fillRect(c[0]+30,c[1]-3,26,6);g.fillRect(c[2]-56,c[1]-3,26,6);g.fillStyle='#8fc3e8';g.fillRect(c[0]+31,c[1]-2,24,4);g.fillRect(c[2]-55,c[1]-2,24,4)}
sign(g,1710,400,'SHOWERS',80);const CBN=['ZEBRA HOUSE','OWL HOUSE','MOOSE HOUSE','BEAR HOUSE','IGUANA HOUSE','EAGLE HOUSE'];for(let i=0;i<CB.length;i++)sign(g,(CB[i][0]+CB[i][2])/2,CB[i][1]-27,CBN[i],104);sign(g,DK[2]+60,DY+34,'DOCK',50);sign(g,1990,830,'PARKING',80);
paintDec(g,DEC);
// grand archway (drawn last so the sign sits over the road)
for(const x of[AX-120,AX+94]){g.fillStyle='#16111c';g.fillRect(x-2,AY-118,30,120);g.fillStyle='#6b4a2a';g.fillRect(x,AY-116,26,116);g.fillStyle='#8a5f36';g.fillRect(x,AY-116,6,116);g.fillStyle='#5a3a22';for(let y=AY-100;y<AY;y+=22)g.fillRect(x,y,26,3);g.fillStyle='#16111c';g.fillRect(x-6,AY-4,38,8);g.fillStyle='#7a7d84';g.fillRect(x-5,AY-3,36,6)}
g.fillStyle='#16111c';g.fillRect(AX-142,AY-134,284,22);g.fillStyle='#5a3a22';g.fillRect(AX-140,AY-132,280,18);g.fillStyle='#8a5f36';g.fillRect(AX-140,AY-132,280,4);
g.fillStyle='#16111c';g.fillRect(AX-132,AY-112,264,54);g.fillStyle='#7a5232';g.fillRect(AX-130,AY-110,260,50);g.fillStyle='#9a6f46';g.fillRect(AX-130,AY-110,260,4);g.fillStyle='#5a3a22';g.fillRect(AX-130,AY-64,260,4);
for(const x of[AX-112,AX+112]){g.fillStyle='#3a2416';g.fillRect(x-2,AY-112,4,4)}
g.textAlign='center';g.font='16px "Press Start 2P", monospace';g.fillStyle='#2a1a10';g.fillText('ZOMBDASH',AX+2,AY-82);g.fillStyle='#ffd84a';g.fillText('ZOMBDASH',AX,AY-84);
g.font='10px "Press Start 2P", monospace';g.fillStyle='#2a1a10';g.fillText('CAMPGROUND',AX+1,AY-66);g.fillStyle='#e8e0c8';g.fillText('CAMPGROUND',AX,AY-67);g.textAlign='left';
for(const x of[AX-150,AX+150]){g.fillStyle='#5a3a22';g.fillRect(x-3,AY-100,6,8)}}

