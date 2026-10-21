//# maps/neighborhood.js — Neighborhood map
function mapNeighborhood(){WW=1700;WH=2400;
const cx=790,cy=1200,cr=200,SW=24;
NB=[[420,120,1180,1300],[360,920,420,1300],[300,1150,360,1300],[1180,1100,1400,1300],[380,1300,1160,2260]];
const f0=WL.length;
hwall(120,420,1180,[800],30);vwall(1180,120,1100,[560],30);hwall(1100,1180,1400,[]);vwall(1400,1100,1300,[1200],35);hwall(1300,1160,1400,[]);
vwall(1160,1300,2260,[1900],30);hwall(2260,380,1160,[960],30);vwall(380,1300,2260,[1820],30);hwall(1300,300,380,[]);vwall(300,1150,1300,[1225],35);hwall(1150,300,360,[]);vwall(360,920,1150,[]);hwall(920,360,420,[]);vwall(420,120,920,[400],30);
const f1=WL.length;
const PK=[{x:800,y:120,o:'h',d:-1},{x:1180,y:560,o:'v',d:1},{x:1400,y:1200,o:'v',d:1,w:150},{x:1160,y:1900,o:'v',d:1},{x:960,y:2260,o:'h',d:1},{x:380,y:1820,o:'v',d:-1},{x:300,y:1225,o:'v',d:-1,w:130},{x:420,y:400,o:'v',d:-1}],SP=[],PR=[];
const ln=(ax,ay,bx,by)=>WL.push([Math.min(ax,bx)-3,Math.min(ay,by)-3,Math.abs(bx-ax)+6,Math.abs(by-ay)+6]);
for(const p of PK){const w=p.w||110,D=105;if(p.o=='h'){const e=p.y+p.d*D;ln(p.x-w/2,p.y,p.x-w/2,e);ln(p.x+w/2,p.y,p.x+w/2,e);ln(p.x-w/2,e,p.x+w/2,e);SP.push([p.x,p.y+p.d*(D-35)]);PR.push([p.x-w/2,Math.min(p.y,e),p.x+w/2,Math.max(p.y,e)])}
else{const e=p.x+p.d*D;ln(p.x,p.y-w/2,e,p.y-w/2);ln(p.x,p.y+w/2,e,p.y+w/2);ln(e,p.y-w/2,e,p.y+w/2);SP.push([p.x+p.d*(D-35),p.y]);PR.push([Math.min(p.x,e),p.y-w/2,Math.max(p.x,e),p.y+w/2])}}
const f2=WL.length;
HS={px:cx,py:cy-80,cx,cy,nx0:0,nx1:0,ny0:0,ny1:0,sp:SP};
hwall(330,760,1000,[880]);vwall(760,330,500,[]);vwall(1000,330,820,[420]);hwall(500,560,1000,[860]);vwall(560,500,700,[]);vwall(720,500,640,[580]);vwall(720,640,820,[]);hwall(640,720,1000,[860]);hwall(700,560,720,[640],46);hwall(820,720,1000,[860]);
hwall(1560,600,860,[730],60);hwall(1560,860,1000,[]);hwall(2040,600,1000,[930]);vwall(600,1560,2040,[1790]);vwall(1000,1560,2040,[]);vwall(860,1560,2040,[1670,1800,1960]);hwall(1720,860,1000,[]);hwall(1880,860,1000,[]);hwall(1720,600,860,[730]);hwall(1860,600,860,[730]);
const K1=[890,506,104,18],K2=[976,524,18,110],F1=[726,506,30,28],C1=[620,598,38,90],S1=[566,506,90,16],S2=[566,526,16,64],L1=[736,668,26,128],L2=[736,790,84,26],A1=[900,652,34,32],T1=[822,716,50,28],TV1=[982,690,12,80],
C2=[711,1572,38,90],S3=[836,1580,18,44],S4=[606,1600,18,90],W1=[766,1700,84,14],F2=[606,1726,30,28],K3=[760,1726,94,18],K4=[790,1836,64,18],FP=[606,1890,16,50],TV2=[680,2024,80,12],L3=[650,1932,120,26],L4=[650,1958,26,44],T2=[700,1975,50,24],A2=[800,1990,34,32],CAR=[420,1235,88,36];
for(const a of[K1,K2,F1,C1,S1,S2,L1,L2,A1,T1,TV1,C2,S3,S4,W1,F2,K3,K4,FP,TV2,L3,L4,T2,A2,CAR])WL.push([...a,1]);
const TRE=[[1110,700],[470,640],[1100,2100],[470,1500],[1090,1450]];for(const[x,y]of TRE)WL.push([x-6,y-6,12,12,1]);
const DEC=[];
put(DEC,'bed',800,480);put(DEC,'bookshelf',960,372);put(DEC,'plant',790,360);put(DEC,'rtable',800,600);put(DEC,'chair',770,602);put(DEC,'chair',830,602);put(DEC,'plant',985,800);put(DEC,'tire',690,520);
put(DEC,'chair',780,1800);put(DEC,'chair',810,1800);put(DEC,'bed',962,1640);put(DEC,'cabinet',890,1600);put(DEC,'bed',962,1800);put(DEC,'bookshelf',940,1870);put(DEC,'bed',962,1960);put(DEC,'cabinet',890,1910);put(DEC,'plant',985,2020);put(DEC,'plant',880,1580);
put(DEC,'tramp',1080,250);put(DEC,'grill',1110,440);put(DEC,'table',1110,350);put(DEC,'hedge',520,880);put(DEC,'hedge',1110,880);put(DEC,'bush',450,320);put(DEC,'flower',470,250);put(DEC,'flower',520,260);
put(DEC,'bush',400,1000);put(DEC,'flower',450,1100);put(DEC,'mail',560,1150);put(DEC,'lamp',1020,1100);put(DEC,'lamp',560,1400);put(DEC,'bench',1250,1098);put(DEC,'hedge',1300,1296);
put(DEC,'table',960,2180);put(DEC,'grill',1060,2160);put(DEC,'hedge',520,1330);put(DEC,'hedge',1100,1330);put(DEC,'flower',450,1700);put(DEC,'flower',1110,1760);put(DEC,'doghouse',1100,1640);
for(const[k,x,y]of[['sbag',742,142],['sbag',858,142],['crate',1140,520],['barrel',1140,610],['sbag',1350,1160],['sbag',1350,1250],['tire',1120,1860],['crate',1120,1950],['sbag',900,2230],['barrel',420,1780],['crate',420,1870],['sbag',345,1200],['barrel',460,360],['crate',460,450]])put(DEC,k,x,y);
put(DEC,'cbus',cx+20,cy+50);put(DEC,'truck',1240,1286);
SM=[{x:470,y:1236},{x:cx+140,y:cy}];
grid();
const g=ground('#56964a','#5c9c50','#529044','#3f7a3a');
const ST=[[30,0,150,WH],[1560,0,1680,WH]];g.fillStyle='#a8a49a';for(const s of ST)g.fillRect(s[0]-14,s[1],s[2]-s[0]+28,s[3]-s[1]);g.fillStyle='#4a4d53';for(const s of ST)g.fillRect(s[0],s[1],s[2]-s[0],s[3]-s[1]);g.fillStyle='rgba(225,200,60,.6)';for(const s of ST)for(let y=10;y<WH;y+=48)g.fillRect((s[0]+s[2])/2-2,y,4,24);
g.fillStyle='#4a4d53';g.fillRect(150,1165,40,120);g.fillRect(1530,1110,40,180);
const block=[...NB.map(r=>[r[0]-40,r[1]-40,r[2]+40,r[3]+40]),...PR.map(r=>[r[0]-30,r[1]-30,r[2]+30,r[3]+30]),...ST.map(s=>[s[0]-20,s[1],s[2]+20,s[3]]),[140,1150,200,1300],[1520,1100,1580,1300]];
const hit=(a)=>block.some(b=>a[0]<b[2]&&a[2]>b[0]&&a[1]<b[3]&&a[3]>b[1]);const RC=['#7a3b3b','#4a5a7a','#5a5d64','#7a5a3a','#3a5a4a','#6a4a6a','#8a6a4a'];let k=0;
for(let gy=0;gy<WH;gy+=190)for(let gx=0;gx<WW;gx+=200){for(const[w,h]of[[170,140],[120,100],[86,74]]){const x=gx+(200-w)/2,y=gy+(190-h)/2;if(hit([x-6,y-6,x+w+6,y+h+6]))continue;g.fillStyle='#8a5a32';g.fillRect(gx+4,gy+2,192,3);g.fillRect(gx+4,gy+2,3,186);roof(g,x,y,w,h,RC[k%7],k);k++;
if(k%4==1)car2(g,x+w/2-44,y+h+12,['#c0392b','#2f6fd0','#d8d8d4','#26262c'][k%4]);break}}
for(const r of NB){g.fillStyle='rgba(0,0,0,.35)';g.fillRect(r[0]-10,r[1]-10,r[2]-r[0]+20,r[3]-r[1]+20)}for(const r of NB)grassFill(g,r);
for(const r of PR){g.fillStyle='#7a6a52';g.fillRect(r[0],r[1],r[2]-r[0],r[3]-r[1]);g.fillStyle='#6a5a44';for(let i=0;i<24;i++)g.fillRect(r[0]+(i*37)%(r[2]-r[0]-4),r[1]+(i*23)%(r[3]-r[1]-4),4,3)}
g.fillStyle='#4a4d53';g.fillRect(1400,1125,130,150);g.fillRect(195,1160,105,130);
g.fillStyle='#c9b48a';g.fillRect(440,230,130,110);g.fillStyle='rgba(120,100,60,.3)';for(let i=0;i<30;i++)g.fillRect(445+(i*37)%120,235+(i*23)%100,4,2);
const CON='#b8b4aa';g.fillStyle=CON;g.beginPath();g.arc(cx,cy,cr+SW,0,7);g.fill();g.fillRect(cx,1100,1400-cx,200);g.fillRect(300,1155,cx-300,140);
g.fillRect(566,700,148,470);g.fillRect(845,820,30,180);
g.fillRect(664,1370,132,190);
g.fillStyle='rgba(0,0,0,.08)';for(let y=740;y<1150;y+=40)g.fillRect(566,y,148,2);for(let y=1400;y<1560;y+=40)g.fillRect(664,y,132,2);
g.fillStyle='#55585e';g.beginPath();g.arc(cx,cy,cr,0,7);g.fill();g.fillRect(cx,1110+SW-14,1400-cx,180-2*(SW-14));g.fillRect(300,1165+SW-14,cx-300,120-2*(SW-14));g.fillStyle='#4f8f3f';g.fillRect(1020,1286,360,10);
g.fillStyle='rgba(225,225,215,.5)';for(let x=cx+cr+20;x<1390;x+=46)g.fillRect(x,1198,24,4);for(let i=0;i<8;i++)crack(g,cx-150+(i*61)%300,cy-150+(i*97)%300,8);
chk(g,760,330,240,170,'#9a6a3c','#8f6136');chk(g,720,500,280,140,'#e8e8e4','#2a2c32');chk(g,560,500,160,200,'#9a9d94','#93968d');chk(g,720,640,280,180,'#d8b84a','#ccac40');
chk(g,600,1560,260,160,'#9a9d94','#93968d');chk(g,600,1720,260,140,'#e8e8e4','#2a2c32');chk(g,600,1860,260,180,'#a8987a','#9e8e70');chk(g,860,1560,140,160,'#8fa8c8','#86a0c0');chk(g,860,1720,140,160,'#c8a0b4','#bf96aa');chk(g,860,1880,140,160,'#9ac0a4','#90b69a');corn(g,590,152,170,156);corn(g,850,152,160,156);carrots(g,420,2072,200,160);broccoli(g,650,2072,200,160);
g.fillStyle='#8a3a3a';g.fillRect(780,690,120,90);g.fillStyle='#a84a4a';g.fillRect(784,694,112,82);g.fillStyle='#5a4a7a';g.fillRect(690,1930,140,90);g.fillStyle='#6a5a8a';g.fillRect(694,1934,132,82);
ctop(g,K1,-1);ctop(g,K2,-1);stove(g,920,506);sink(g,968,506);micro(g,900,508);g.fillStyle='#8a929e';g.fillRect(978,580,16,22);fridge(g,F1);
ctop(g,K3,-1);ctop(g,K4,1);stove(g,800,1726);sink(g,826,1838);micro(g,764,1728);fridge(g,F2);
sofa(g,L1,'l');sofa(g,L2,'b');chairT(g,A1,'t');ctable(g,T1);tv(g,TV1);
sofa(g,L3,'t');sofa(g,L4,'l');chairT(g,A2,'r');ctable(g,T2);tv(g,TV2);
g.fillStyle='#6a5a4a';g.fillRect(606,1890,16,50);g.fillStyle='#ff7a1a';g.fillRect(610,1902,8,26);g.fillStyle='#ffd84a';g.fillRect(612,1908,4,14);
gshelf(g,S1);gshelf(g,S2);gshelf(g,S3);gshelf(g,S4);bench(g,W1);
g.fillStyle='rgba(0,0,0,.25)';g.fillRect(616,600,46,92);g.fillRect(707,1574,46,92);carV(g,C1[0],C1[1],'#2f8a4a',1);carV(g,C2[0],C2[1],'#26262c',0);
g.fillStyle='#5a5d64';g.fillRect(594,697,92,6);g.fillRect(670,1557,120,6);
car2(g,CAR[0],CAR[1],'#c0392b');g.fillStyle='rgba(20,16,12,.55)';g.beginPath();g.ellipse(464,1252,52,26,0,0,7);g.fill();
wl(g,'#2e2a26','#e8e4d8');
for(let i=f1;i<f2;i++){const w=WL[i];g.fillStyle='#3a2416';g.fillRect(w[0]-1,w[1]-1,w[2]+2,w[3]+2);g.fillStyle='#7a5232';g.fillRect(w[0],w[1],w[2],w[3]);g.fillStyle='#9a6a3c';if(w[2]>w[3])for(let x=w[0];x<w[0]+w[2];x+=9)g.fillRect(x,w[1],4,w[3]);else for(let y=w[1];y<w[1]+w[3];y+=9)g.fillRect(w[0],y,w[2],4)}
for(let i=f0;i<f1;i++)barricade(g,WL[i],i);
for(const p of PK){const n=6;for(let j=0;j<n;j++){const a=j*1.1+p.x,ox=p.o=='h'?(j-2.5)*14:p.d*(10+j*9),oy=p.o=='h'?p.d*(8+j*8):(j-2.5)*14;g.save();g.translate(p.x+ox,p.y+oy);g.rotate(a);g.fillStyle='#16111c';g.fillRect(-12,-3,24,6);g.fillStyle='#8a5a32';g.fillRect(-11,-2,22,4);g.restore()}}
for(const[x,y]of TRE){g.fillStyle='#6b4a2a';g.fillRect(x-6,y-6,12,12);g.fillStyle='#2f7d32';g.beginPath();g.arc(x,y-12,22,0,7);g.fill();g.fillStyle='#3f9a3f';g.beginPath();g.arc(x-6,y-18,10,0,7);g.fill()}
paintDec(g,DEC)}
