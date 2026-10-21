//# maps/city-park.js — Zombville City Park map
// ---------- Zombville City Park: a drive loop, walking trails, fishing ponds, food trucks, a big playground + splash pad ----------
function pkH(i,k){const v=Math.sin(i*12.9898+k*78.233+6.3)*43758.5453;return v-Math.floor(v)}
function pkPD(p,x,y){const u=(x-p.x)/p.rx,v=(y-p.y)/p.ry,th=Math.atan2(v,u);return Math.hypot(u,v)/(1+.07*Math.sin(3*th+p.s)+.04*Math.sin(5*th+1))}
function pkWet(PD,x,y){for(const p of PD)if(pkPD(p,x,y)<1&&!p.dk.some(d=>x>d[0]&&x<d[0]+d[2]&&y>d[1]&&y<d[1]+d[3]))return 1;return 0}
// a food truck seen from above: cab to the right, serving hatch + awning on the south side, name on the roof
function ftDraw(g,v){const{L,W}=v,R=(c,x,y,w,h)=>{g.fillStyle=c;g.fillRect(x,y,w,h)},hl=-L/2,ht=-W/2;g.save();g.translate(v.x,v.y);
R('rgba(0,0,0,.28)',hl+4,ht+6,L,W);for(const[wx,wy]of[[hl+16,ht-3],[hl+16,W/2-3],[L/2-28,ht-3],[L/2-28,W/2-3]])R('#16111c',wx,wy,16,6);
R('#16111c',hl-1,ht-1,L+2,W+2);R(v.c,hl,ht,L,W);R('rgba(255,255,255,.25)',hl,ht,L,4);R('rgba(0,0,0,.2)',hl,W/2-4,L,4);R('#8fc3e8',L/2-30,ht+5,10,W-10);R('#e8e8e4',L/2-20,ht+4,17,W-8);R('#fff4c0',L/2-3,ht+3,3,6);R('#fff4c0',L/2-3,W/2-9,3,6);
R('#16111c',hl+12,W/2-2,L-60,14);for(let i=0;i<L-62;i+=8)R(i%16?'#f4f4f0':v.s,hl+13+i,W/2-1,8,12);R('rgba(0,0,0,.25)',hl+13,W/2+9,L-62,2);
R('#16111c',hl+8,ht+8,L-50,W-22);R('#f4f0e0',hl+9,ht+9,L-52,W-24);g.fillStyle=v.s;g.font='bold 11px Arial, Helvetica, sans-serif';g.textAlign='center';g.textBaseline='middle';g.fillText(v.t,hl+9+(L-52)/2,ht+9+(W-24)/2+1);g.textAlign='left';g.textBaseline='alphabetic';g.restore()}
function mapPark(){WW=2600;WH=2200;const L0=260,R0=2340,T0=330,B0=1980,M0=1150,RW=52,cx=1300;
HS={px:1350,py:960,cx:1350,cy:900,nx0:-999,nx1:-998,ny0:-999,ny1:-998};
WL.push([0,0,WW,170,2]);
// road graph for the ice cream truck (the drive loop + the cross drive)
const N=[[L0,T0],[cx,T0],[R0,T0],[R0,M0],[R0,B0],[cx,B0],[L0,B0],[L0,M0],[cx,M0]],E=[[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7],[7,0],[7,8],[8,3]],A=N.map(()=>[]);for(const[a,b]of E){A[a].push(b);A[b].push(a)}HS.RG={N,A};
const RD=[[L0-RW,T0-RW,R0-L0+2*RW,2*RW],[L0-RW,M0-RW,R0-L0+2*RW,2*RW],[L0-RW,B0-RW,R0-L0+2*RW,2*RW],[L0-RW,T0-RW,2*RW,B0-T0+2*RW],[R0-RW,T0-RW,2*RW,B0-T0+2*RW],[0,M0-RW,L0,2*RW],[R0,M0-RW,WW-R0,2*RW],[cx-RW,B0,2*RW,WH-B0]];
const onRd=(x,y,m)=>RD.some(r=>x>r[0]-m&&x<r[0]+r[2]+m&&y>r[1]-m&&y<r[1]+r[3]+m);
// zones
const LOT=[312,382,770,800],CRT=[790,382,1170,822],PLZ=[1190,382,1510,1098],PLAY=[1540,400,2290,1090],RR=[1240,420,1460,560],GZ=[1210,1660];
const PD=[{x:700,y:1570,rx:280,ry:180,s:1.3,dk:[[682,1366,36,170]]},{x:1810,y:1580,rx:380,ry:230,s:.4,dk:[[1400,1562,200,36],[1872,1650,36,200]]}];
const inZ=(x,y,r,m)=>x>r[0]-m&&x<r[2]+m&&y>r[1]-m&&y<r[3]+m;
// walking trails
const ell=(p,ax,ay,n)=>{const o=[];for(let i=0;i<=n;i++){const a=i/n*6.283;o.push([p.x+Math.cos(a)*ax,p.y+Math.sin(a)*ay])}return o};
const TRc=[ell(PD[0],350,250,16),ell(PD[1],440,290,18),
[[1350,1098],[1330,1250],[1250,1420],[1210,1560]],[[1050,1570],[1110,1600],[1150,1640]],[[1270,1640],[1320,1600],[1370,1580]],[[1210,1700],[1240,1820],[1300,1928]],
[[700,960],[730,1100],[720,1230],[700,1320]],[[1900,1080],[1880,1200],[1830,1290]],[[330,1000],[520,940],[700,980],[950,950],[1100,990],[1200,960]],[[990,822],[980,900],[950,950]],[[2250,1580],[2300,1580]],[[350,1570],[312,1560]],
[[1510,700],[1540,700]],[[320,240],[700,260],[1100,230],[1500,250],[1900,235],[2280,250]],[[2440,400],[2460,800],[2430,1300],[2460,1800]],[[140,400],[120,900],[150,1400],[120,1900]]];
const TR=TRc.map(p=>fsCR(p,10)),trD=(x,y)=>{let d=1e9;for(const p of TR)for(const q of p){const h=Math.hypot(q[0]-x,q[1]-y);if(h<d)d=h}return d};
// ponds: water blocks walking (bullets fly over), docks cut out
for(const p of PD){const x0=p.x-p.rx*1.15,x1=p.x+p.rx*1.15;for(let y=p.y-p.ry*1.15;y<p.y+p.ry*1.15;y+=12){let s=null;for(let x=x0;x<=x1+6;x+=6){const w=x<=x1&&pkWet([p],x+3,y+6);if(w&&s==null)s=x;if(!w&&s!=null){WL.push([s,y,x-s,12,2]);s=null}}}}
NOGO=PD.map(p=>[p.x-p.rx*.9,p.y-p.ry*.9,p.x+p.rx*.9,p.y+p.ry*.9]);
// restrooms
hwall(RR[1],RR[0],RR[2],[]);hwall(RR[3],RR[0],RR[2],[1295,1405],24);vwall(RR[0],RR[1],RR[3],[]);vwall(RR[2],RR[1],RR[3],[]);vwall(1350,RR[1],RR[3],[]);HS.HO=[{x:RR[0],y:RR[1],w:110,h:140},{x:1350,y:RR[1],w:110,h:140}];
// playground fence (low, bullets pass) with gates
{const[x0,y0,x1,y1]=PLAY,F=[];const sh=(y,a,b,G)=>{let x=a;for(const g of G){F.push([x,y-2,g-30-x,4,2]);x=g+30}F.push([x,y-2,b-x,4,2])},sv=(x,a,b,G)=>{let y=a;for(const g of G){F.push([x-2,y,4,g-30-y,2]);y=g+30}F.push([x-2,y,4,b-y,2])};
sh(y0,x0,x1,[]);sh(y1,x0,x1,[1650,1900]);sv(x0,y0,y1,[700]);sv(x1,y0,y1,[]);WL.push(...F);HS.PF=F}
const DEC=[],pp=(k,x,y)=>put(DEC,k,x,y);
// parking lot cars + the food truck spots
const V=[],cc=['#c0392b','#2f6fd0','#d8d8d4','#26262c','#2f8a4a','#d68a1c','#8a8f96','#6a4a9a','#3a8a8a'],ks=['sedan','suv','sedan','van','pickup'];let n=0;
for(const[cy,a]of[[437,Math.PI/2],[745,-Math.PI/2]])for(let x=346;x<760;x+=52){n++;if(pkH(n,1)<.35)continue;const k=ks[n%5],s=HWV(k);V.push({k,x:x+(pkH(n,2)-.5)*4,y:cy,a:a+(pkH(n,3)-.5)*.06,L:s[0]*.92,W:s[1]*.92,c:cc[n%cc.length]})}
for(const v of V)hwCol(v);
const FT_=[{x:980,y:455,t:'TACO LOCO',c:'#e8a030',s:'#c0392b'},{x:980,y:600,t:'BIG BURGER',c:'#c0392b',s:'#26262c'},{x:980,y:745,t:'PIZZA VAN',c:'#3f8a4a',s:'#c0392b'}];for(const f of FT_){f.L=140;f.W=50;WL.push([f.x-70,f.y-27,140,54,1])}
for(const[x,y]of[[860,550],[1100,550],[860,695],[1100,695],[880,818],[1080,818]])pp('umb',x,y);
// plaza + restroom fixtures
pp('fntn',1350,860);for(const[x,y]of[[1250,780],[1450,780],[1250,960],[1450,960]])pp('bench',x,y);for(const[x,y]of[[1225,660],[1475,660],[1225,1060],[1475,1060]])pp('lamp',x,y);
for(const[x,y]of[[1235,600],[1465,600]])pp('planter',x,y);pp('trash',1300,1000);pp('trash',1400,1000);pp('fountd',1500,600);
for(const x of[1265,1310])pp('toilet',x,452);for(const x of[1375,1420])pp('toilet',x,452);pp('msink',1334,520);pp('msink',1444,520);
// playground
pp('bigjg',1790,640);pp('jg2',2160,560);pp('swing',1650,880);pp('swing',1770,880);pp('slide',1950,780);pp('merry',1840,1020);pp('sptow',2130,890);
for(const[x,y]of[[1600,470],[2230,470],[1570,1000],[2250,1070]])pp('bench',x,y);pp('trash',1600,1070);
// picnic grove
for(const[x,y]of[[400,900],[560,1060],[820,900],[1040,1060],[640,860]])pp('picnic',x,y);for(const[x,y]of[[450,1060],[880,1060]])pp('grill',x,y);pp('trash',760,1000);pp('trash',340,880);
// gazebo, fishing gear, signs, benches around the ponds
pp('gazebo',GZ[0],GZ[1]);
pp('rod',690,1505);pp('bucket',712,1490);pp('tackle',690,1470);pp('chair',712,1520);pp('rod',1560,1575);pp('bucket',1590,1570);pp('cooler',1385,1610);pp('rod',1890,1810);pp('tackle',1912,1790);pp('chair',1888,1770);
pp('psign',600,1365);pp('psign',1500,1360);pp('psign',2160,1830);for(const[x,y]of[[560,1360],[860,1380],[1640,1330],[2050,1340],[2220,1650],[1640,1840]])pp('bench',x,y);
for(const[x,y]of[[380,1460],[1010,1680],[1370,1450],[2260,1440],[1370,1750]])pp('lamp',x,y);
// trees everywhere else (dense at the edges)
const T=[];n=0;for(let gy=200;gy<WH;gy+=66)for(let gx=20;gx<WW;gx+=66){n++;const x=gx+(pkH(n,4)-.5)*36,y=gy+(pkH(n,5)-.5)*36,edge=x<208||x>2392||y>2032||y<280,grove=x>312&&x<1170&&y>830&&y<1100;
if(pkH(n,6)>(edge?.85:grove?.6:.5))continue;if(onRd(x,y,26)||inZ(x,y,LOT,30)||inZ(x,y,CRT,30)||inZ(x,y,PLZ,24)||inZ(x,y,PLAY,36)||Math.hypot(x-GZ[0],y-GZ[1]+40)<120||PD.some(p=>pkPD(p,x,y)<1.25)||trD(x,y)<44)continue;
if(DEC.some(o=>Math.abs(o.x-x)<46&&Math.abs(o.y-y)<40))continue;
const k=pkH(n,7)<.6?3:4;T.push({x,y,k,r:Math.round(20+pkH(n,8)*10),v:pkH(n,9)});WL.push([x-6,y-6,12,8,2])}
const KO=[...RD.map(r=>[r[0]-10,r[1]-10,r[0]+r[2]+10,r[1]+r[3]+10]),[LOT[0]-20,LOT[1]-20,CRT[2]+20,CRT[3]+20],[PLZ[0]-10,PLZ[1]-10,PLZ[2]+10,PLZ[3]+10],[PLAY[0]-20,PLAY[1]-20,PLAY[2]+20,PLAY[3]+20],...PD.map(p=>[p.x-p.rx*1.1,p.y-p.ry*1.1,p.x+p.rx*1.1,p.y+p.ry*1.1]),[0,0,WW,190]];
DEC.push(...scatter(12,[['bush',4],['flower',5],['tuft',3],['rock',1]],130,KO));DEC.ko=KO;
// spawns: zombies walk in out of the treeline along every edge
const SP=[],free=(x,y)=>!WL.some(w=>x>w[0]-16&&x<w[0]+w[2]+16&&y>w[1]-16&&y<w[1]+w[3]+16);for(let y=260;y<WH;y+=150){if(free(24,y))SP.push([24,y]);if(free(WW-24,y))SP.push([WW-24,y])}for(let x=60;x<WW;x+=160)if(free(x,WH-24))SP.push([x,WH-24]);HS.sp=SP;
SM=[];grid();
const g=ground('#4f9a3e','#56a044','#4a923a','#3f8432');
for(let y=170;y<WH;y+=64){g.fillStyle='rgba(255,255,255,.035)';g.fillRect(0,y,WW,32)}
// trails (under everything paved), the drive, lot, plaza, playground
g.lineCap='round';g.lineJoin='round';for(const[c,w]of[['#8a8270',40],['#b8ae96',34],['#c8bea4',24]]){g.strokeStyle=c;g.lineWidth=w;for(const p of TR){g.beginPath();g.moveTo(p[0][0],p[0][1]);for(const q of p)g.lineTo(q[0],q[1]);g.stroke()}}g.lineCap='butt';g.lineJoin='miter';
g.fillStyle='rgba(120,110,90,.35)';for(const p of TR)for(let i=0;i<p.length;i+=2){const q=p[i];g.fillRect(q[0]+((i*37)%17)-8,q[1]+((i*53)%13)-6,3,2)}
for(const r of RD){g.fillStyle='#9a9a92';g.fillRect(r[0]-4,r[1]-4,r[2]+8,r[3]+8)}for(const r of RD){g.fillStyle='#44464c';g.fillRect(r[0],r[1],r[2],r[3])}
for(let i=0;i<2600;i++){const r=RD[i%RD.length],x=r[0]+pkH(i,10)*r[2],y=r[1]+pkH(i,11)*r[3];g.fillStyle=i%3?'rgba(0,0,0,.12)':'rgba(255,255,255,.05)';g.fillRect(x,y,2+i%3,2)}
g.fillStyle='rgba(230,190,60,.8)';for(const y of[T0,M0,B0])for(let x=L0+60;x<R0-50;x+=56)if(Math.abs(x-cx)>70)g.fillRect(x,y-2,30,4);for(const x of[L0,R0])for(let y=T0+60;y<B0-50;y+=56)if(Math.abs(y-M0)>70)g.fillRect(x-2,y,4,30);for(let x=10;x<L0-60;x+=56)g.fillRect(x,M0-2,30,4);for(let x=R0+60;x<WW;x+=56)g.fillRect(x,M0-2,30,4);for(let y=B0+60;y<WH;y+=56)g.fillRect(cx-2,y,4,30);
// crosswalks where trails cross the drive
g.fillStyle='rgba(240,240,232,.8)';for(const p of TR)for(let i=1;i<p.length;i++){const a=p[i-1],b=p[i];for(const y of[T0,M0,B0])if((a[1]-y)*(b[1]-y)<=0&&a[0]>L0-RW&&a[0]<R0+RW&&Math.abs(b[1]-a[1])>2){for(let k=-RW+6;k<RW-6;k+=12)g.fillRect(a[0]-20,y+k,40,6)}for(const x of[L0,R0])if((a[0]-x)*(b[0]-x)<=0&&a[1]>T0&&a[1]<B0&&Math.abs(b[0]-a[0])>2){for(let k=-RW+6;k<RW-6;k+=12)g.fillRect(x+k,a[1]-20,6,40)}}
// parking lot + food truck court
g.fillStyle='#4a4c52';g.fillRect(LOT[0],LOT[1],CRT[2]-LOT[0],LOT[3]-LOT[1]);g.fillRect(CRT[0],CRT[1],CRT[2]-CRT[0],CRT[3]-CRT[1]);g.fillStyle='#9a9a92';g.fillRect(LOT[0],LOT[3],CRT[0]-LOT[0],4);g.fillRect(CRT[0],CRT[3],CRT[2]-CRT[0],4);g.fillRect(CRT[2],CRT[1],4,CRT[3]-CRT[1]+4);
for(let i=0;i<30;i++)crack(g,LOT[0]+pkH(i,12)*(CRT[2]-LOT[0]),LOT[1]+pkH(i,13)*400,6,'rgba(10,10,10,.45)');
g.fillStyle='#e8e4d0';for(let x=320;x<=762;x+=52){g.fillRect(x,392,3,92);g.fillRect(x,700,3,92)}
g.strokeStyle='#f0c840';g.lineWidth=3;for(const f of FT_)g.strokeRect(f.x-80,f.y-36,160,72);g.fillStyle='#f0c840';g.font='bold 13px Arial, Helvetica, sans-serif';g.textAlign='center';for(const f of FT_)g.fillText('FOOD TRUCKS ONLY',f.x,f.y-40+0);g.textAlign='left';
for(let i=0;i<5;i++){g.fillStyle='rgba(240,200,64,.55)';g.fillRect(CRT[0]+12,CRT[1]+10+i*86,10,50)}
// plaza
chk(g,PLZ[0],PLZ[1],PLZ[2]-PLZ[0],PLZ[3]-PLZ[1],'#c8c0ae','#bcb4a2');g.strokeStyle='rgba(120,110,90,.6)';g.lineWidth=2;g.beginPath();g.arc(1350,840,120,0,7);g.stroke();g.beginPath();g.arc(1350,840,150,0,7);g.stroke();
for(const[x,y]of[[1220,720],[1480,720],[1220,1000],[1480,1000]]){g.fillStyle='#3a6a2a';g.beginPath();g.ellipse(x,y,22,12,0,0,7);g.fill();for(let i=0;i<8;i++){g.fillStyle=['#ff6a8a','#ffd84a','#fff','#9a7aff'][i%4];g.fillRect(x-16+i*4,y-4+(i%3)*3,3,3)}}
// restrooms
tiles(g,RR[0],RR[1],RR[2]-RR[0],RR[3]-RR[1],'#d8dce0','#c8ccd0');
// playground: soft rubber, sand box, splash pad
{const[x0,y0,x1,y1]=PLAY;chk(g,x0,y0,x1-x0,y1-y0,'#3f72b8','#3a6cb0');const zz=(x,y,w,h,a,b)=>{g.fillStyle='#16111c';g.fillRect(x-2,y-2,w+4,h+4);chk(g,x,y,w,h,a,b)};zz(1660,480,260,190,'#c05a4a','#b85244');zz(2050,450,200,140,'#3f9a5a','#3a9254');zz(1600,820,240,90,'#d8a030','#d09a2a');zz(1900,720,110,110,'#8a5ab8','#8454b0')
g.fillStyle='#e0c890';g.beginPath();g.ellipse(1650,1010,80,44,0,0,7);g.fill();g.fillStyle='#7a5a32';g.lineWidth=5;g.strokeStyle='#7a5a32';g.stroke();for(let i=0;i<20;i++){g.fillStyle='#c8b070';g.fillRect(1600+pkH(i,18)*100,990+pkH(i,19)*40,3,2)}R_(g,'#c0392b',1630,1000,8,6);R_(g,'#2f7ad0',1672,1018,10,5);
g.fillStyle='#5a9ab8';g.beginPath();g.arc(2130,900,124,0,7);g.fill();g.fillStyle='#7ac0d8';g.beginPath();g.arc(2130,900,116,0,7);g.fill();for(let i=0;i<5;i++){g.strokeStyle=i%2?'#e8f8ff':'#4aa8d0';g.lineWidth=5;g.beginPath();g.arc(2130,900,100-i*18,0,7);g.stroke()}for(let i=0;i<18;i++){const a=i/18*6.283;g.fillStyle=['#ffd84a','#ff6a8a','#6ae07a'][i%3];g.beginPath();g.arc(2130+Math.cos(a)*108,900+Math.sin(a)*108,4,0,7);g.fill()}
for(const j of pkJets()){g.fillStyle='#16111c';g.beginPath();g.arc(j[0],j[1],4,0,7);g.fill();g.fillStyle='#c8ccd4';g.beginPath();g.arc(j[0],j[1],3,0,7);g.fill()}}
// ponds: muddy shore, water, lily pads + reeds, docks
for(const p of PD){for(const[m,c]of[[1.16,'#8a7a50'],[1.08,'#a8946a'],[1,'#2a6a9a'],[.86,'#2f78aa'],[.55,'#245e8c']]){g.fillStyle=c;for(let y=p.y-p.ry*1.2;y<p.y+p.ry*1.2;y+=4)for(let x=p.x-p.rx*1.2;x<p.x+p.rx*1.2;x+=4)if(pkPD(p,x+2,y+2)<m)g.fillRect(x,y,4,4)}
g.fillStyle='rgba(220,240,255,.3)';for(let i=0;i<40;i++){const a=pkH(i,p.x)*6.283,r=pkH(i,p.y)*.8;g.fillRect(p.x+Math.cos(a)*p.rx*r,p.y+Math.sin(a)*p.ry*r,8+i%3*4,2)}
for(let i=0;i<10;i++){const a=pkH(i,p.x+1)*6.283,r=.7+pkH(i,p.y+1)*.2,x=p.x+Math.cos(a)*p.rx*r,y=p.y+Math.sin(a)*p.ry*r;if(p.dk.some(d=>x>d[0]-20&&x<d[0]+d[2]+20&&y>d[1]-20&&y<d[1]+d[3]+20))continue;g.fillStyle='#16111c';g.beginPath();g.arc(x,y,7,0,7);g.fill();g.fillStyle='#4a9a3a';g.beginPath();g.arc(x,y,6,.4,6.6);g.lineTo(x,y);g.fill();if(i%3==0){g.fillStyle='#ffb0d0';g.fillRect(x-1,y-2,3,3)}}
for(let i=0;i<26;i++){const a=pkH(i,p.x+2)*6.283;let x=p.x+Math.cos(a)*p.rx*1.02,y=p.y+Math.sin(a)*p.ry*1.02;if(p.dk.some(d=>x>d[0]-24&&x<d[0]+d[2]+24&&y>d[1]-24&&y<d[1]+d[3]+24))continue;g.fillStyle='#3a7a32';g.fillRect(x,y-8,2,10);g.fillRect(x+4,y-11,2,13);g.fillRect(x+8,y-7,2,9);g.fillStyle='#6a4a2a';g.fillRect(x+3,y-14,4,5)}
for(const d of p.dk){g.fillStyle='#16111c';g.fillRect(d[0]-1,d[1]-1,d[2]+2,d[3]+2);g.fillStyle='#8a5f36';g.fillRect(d[0],d[1],d[2],d[3]);g.fillStyle='#6b4a2a';if(d[2]>d[3])for(let x=d[0];x<d[0]+d[2];x+=12)g.fillRect(x,d[1],2,d[3]);else for(let y=d[1];y<d[1]+d[3];y+=12)g.fillRect(d[0],y,d[2],2);g.fillStyle='#5a3a22';if(d[2]>d[3])for(let x=d[0]+20;x<d[0]+d[2];x+=50){g.fillRect(x,d[1]-5,7,5);g.fillRect(x,d[1]+d[3],7,5)}else for(let y=d[1]+20;y<d[1]+d[3];y+=50){g.fillRect(d[0]-5,y,5,7);g.fillRect(d[0]+d[2],y,5,7)}}}
// fences, walls
for(const w of HS.PF){g.fillStyle='#16111c';g.fillRect(w[0],w[1],w[2],w[3]);g.fillStyle='#e8c040';g.fillRect(w[0]+1,w[1]+1,Math.max(0,w[2]-2),Math.max(0,w[3]-2));g.fillStyle='#16111c';if(w[2]>w[3])for(let x=w[0];x<w[0]+w[2];x+=24)g.fillRect(x,w[1]-3,4,10);else for(let y=w[1];y<w[1]+w[3];y+=24)g.fillRect(w[0]-3,y,10,4)}
wl(g,'#4a3e34','#c8b89a');
// the city skyline beyond the north wall
g.fillStyle='#1a1c26';g.fillRect(0,0,WW,170);for(let i=0;i<60;i++){const bw=40+pkH(i,26)*80,bh=40+pkH(i,27)*110,bx=pkH(i,28)*WW;g.fillStyle=i%2?'#262a36':'#2e3240';g.fillRect(bx,150-bh,bw,bh);for(let wy=150-bh+6;wy<145;wy+=9)for(let wx=bx+4;wx<bx+bw-4;wx+=8)if(pkH(wx,wy)<.2){g.fillStyle=pkH(wy,wx)<.5?'#ffd27a':'#c8d8ff';g.fillRect(wx,wy,3,4)}}
g.fillStyle='#16111c';g.fillRect(0,146,WW,26);g.fillStyle='#5a6a4a';g.fillRect(0,148,WW,22);for(let x=0;x<WW;x+=8){g.fillStyle=x%16?'#3f6a32':'#4f7a3a';g.fillRect(x,146,6,8)}
sign(g,1350,610,'ZOMBVILLE CITY PARK',170);sign(g,560,375,'PARKING',80);sign(g,1980,392,'PLAYGROUND',100);sign(g,2130,760,'SPLASH PAD',100);sign(g,700,1355,'FISHING DOCK',110);sign(g,1500,1545,'FISHING DOCK',110);sign(g,1350,412,'RESTROOMS',96);
// tree trunks, cars and trucks, the rest, then canopies (redrawn over anyone under them)
for(const t of T){g.fillStyle='rgba(0,0,0,.3)';g.beginPath();g.ellipse(t.x+4,t.y+2,t.r*.9,t.r*.45,0,0,7);g.fill();g.fillStyle='#16111c';g.fillRect(t.x-4,t.y-9,8,12);g.fillStyle='#5a3a22';g.fillRect(t.x-3,t.y-9,6,11)}
for(const v of V){const r=Math.hypot(v.L,v.W)/2+6;vDraw(g,v.x-r,v.y-r,r*2,r*2,q=>hwDraw(q,v))}for(const f of FT_)vDraw(g,f.x-80,f.y-40,160,80,q=>ftDraw(q,f));
paintDec(g,DEC);
const C=48,cw=Math.ceil(WW/C),ch=Math.ceil(WH/C),cells=new Array(cw*ch);T.sort((a,b)=>a.y-b.y);
for(const t of T){if(typeof document=='undefined'||!document.createElement)break;const sp=fsSpr(t.k,t.r,t.v),sx=Math.round(t.x-sp.width/2),sy=Math.round(t.y-t.r*.8-sp.height/2);t.sp=sp;t.sx=sx;t.sy=sy;g.drawImage(sp,sx,sy);const i=Math.floor(t.x/C),j=Math.floor(t.y/C);(cells[j*cw+i]||(cells[j*cw+i]=[])).push(t)}
HS.FS={C,cw,ch,cells,SH:[],W:[]};HS.PK={PD,D:[0,1,2,3,4,5].map(i=>({p:i%2,o:pkH(i,30)*6.283,s:.05+pkH(i,31)*.05}))}}
function pkJets(){const o=[];for(let i=0;i<10;i++){const a=i/10*6.283;o.push([2130+Math.cos(a)*86,900+Math.sin(a)*86*.9])}for(let i=0;i<4;i++){const a=i/4*6.283+.4;o.push([2130+Math.cos(a)*44,900+Math.sin(a)*40])}return o}
// splash pad jets, ducks on the ponds, plus vehicle-boss leftovers (under people)
function pkAnim(){if(mapId===13)dtAnim();if(mapId===12||mapId===13||mapId===15)tkGround();if(mapId!==12||!HS.PK)return;const t=performance.now()/1000;
if(cam.x+W>1980&&cam.x<2280&&cam.y+H>740&&cam.y<1060){const J=pkJets();for(let i=0;i<J.length;i++){const[x,y]=J[i],h=18+14*Math.abs(Math.sin(t*1.6+i*.9));X.globalAlpha=.55;X.strokeStyle='#bfe8ff';X.lineWidth=3;X.beginPath();X.moveTo(x,y);X.quadraticCurveTo(x+(i%2?6:-6),y-h*1.6,x+(i%2?12:-12),y-2);X.stroke();X.globalAlpha=.8;X.fillStyle='#e8f8ff';for(let k=0;k<3;k++)X.fillRect(x+(i%2?1:-1)*(4+k*4)+Math.sin(t*9+k+i)*2,y-h+k*6+((t*40+i*7+k*5)%10),2,2)}X.globalAlpha=1;
const dump=(t%7)<1.1;if(dump){X.globalAlpha=.6;X.fillStyle='#bfe8ff';X.fillRect(2106,790,16,90);X.globalAlpha=.35;X.beginPath();X.ellipse(2114,884,30,10,0,0,7);X.fill();X.globalAlpha=1}}
for(const d of HS.PK.D){const p=HS.PK.PD[d.p],a=d.o+t*d.s,x=p.x+Math.cos(a)*p.rx*.55,y=p.y+Math.sin(a)*p.ry*.55;if(x<cam.x-30||x>cam.x+W+30||y<cam.y-30||y>cam.y+H+30)continue;const fl=Math.sin(a)<0?1:-1;
X.strokeStyle='rgba(220,240,255,.45)';X.lineWidth=1;X.beginPath();X.ellipse(x,y+4,12+Math.sin(t*3+d.o)*2,4,0,0,7);X.stroke();X.fillStyle='#16111c';X.fillRect(x-8,y-5,16,9);X.fillRect(x+fl*5-3,y-11,7,7);X.fillStyle='#e8e4d8';X.fillRect(x-7,y-4,14,7);X.fillStyle=d.p?'#2f8a4a':'#e8e4d8';X.fillRect(x+fl*5-2,y-10,5,5);X.fillStyle='#e8a030';X.fillRect(x+fl*9-(fl<0?2:0),y-8,3,2);X.fillStyle='#16111c';X.fillRect(x+fl*6,y-9,1,1)}}

