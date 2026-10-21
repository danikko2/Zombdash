//# maps/military-base.js — Military Base map
// ---------- MILITARY BASE ----------
function mapBase(){WW=2400;WH=2000;const F=70,FR=WW-F,FB=WH-F;
const box=(b,t=[],bo=[],l=[],r=[],hw)=>{hwall(b[1],b[0],b[2],t,hw);hwall(b[3],b[0],b[2],bo,hw);vwall(b[0],b[1],b[3],l,hw);vwall(b[2],b[1],b[3],r,hw)};
const H1=[300,440,720,780],H2=[840,440,1260,780],BR=[1640,1020,2260,1460],SY=1080,SX=1500;
// barbed wire perimeter with two checkpoints and some broken sections
const FN=[];segH(FN,F,F,FR,[[700,40],[1900,40]],2);segH(FN,FB,F,FR,[[600,40],[SX,62]],2);segV(FN,F,F,FB,[[520,40],[SY,62]],2);segV(FN,FR,F,FB,[[640,40],[1350,40]],2);WL.push(...FN);
// hangars (wide door facing the runway)
const w0=WL.length;box(H1,[510],[],[],[],150);box(H2,[1050],[],[],[],150);const w1=WL.length;
// barracks
box(BR,[],[],[1250],[1250],26);hwall(1220,1640,2260,[1800,2035,2185],22);hwall(1280,1640,2260,[1760,2085],22);vwall(1960,1020,1220,[]);vwall(2110,1020,1220,[]);vwall(1880,1280,1460,[1370],22);vwall(2060,1280,1460,[]);
const w2=WL.length;
// bathroom stalls (thin partitions)
for(let i=0;i<4;i++)WL.push([2116+i*36,1026,3,52,1]);
// planes in hangars, crashed cargo plane on the runway, helicopters
for(const cx of[510,1050])WL.push([cx-14,560,28,138,1],[cx-64,640,128,22,1],[cx-34,700,68,12,1]);
const CR=[[1520,190,210,52],[1790,214,120,60],[1660,300,150,26]];for(const c of CR)WL.push([...c,1]);
const HP=[[1760,540],[2070,540]];for(const[x,y]of HP)WL.push([x-56,y-28,112,30,1]);
SM=[{x:1600,y:200},{x:1830,y:230},{x:1700,y:296}];
const DEC=[];
// checkpoints
put(DEC,'booth',160,1030);put(DEC,'sbagw',170,1180);put(DEC,'jersey',260,1036);put(DEC,'jersey',300,1186);put(DEC,'sbagw',120,980);put(DEC,'barrel',220,1000);put(DEC,'barrel',238,1004);
put(DEC,'booth',1610,1900);put(DEC,'sbagw',1380,1880);put(DEC,'jersey',1430,1820);put(DEC,'jersey',1580,1760);put(DEC,'ammo',1650,1840);
// sleeping quarters + sergeant + bathroom + lockers + showers
for(let k=0;k<6;k++){put(DEC,'bunk',1676+k*50,1094);put(DEC,'footlk',1676+k*50,1116)}for(const x of[2150,2210]){put(DEC,'bunk',x,1356);put(DEC,'footlk',x,1380)}for(const x of[2100,2156,2212])put(DEC,'bunk',x,1446);
put(DEC,'tdesk',2035,1120);put(DEC,'chair',2035,1100);put(DEC,'cabinet',2090,1060);put(DEC,'bookshelf',2000,1056);put(DEC,'mflag',1980,1110);put(DEC,'footlk',2080,1180);
for(let k=0;k<4;k++)put(DEC,'toilet',2131+k*36,1066);put(DEC,'msink',2244,1150);put(DEC,'msink',2244,1182);
put(DEC,'bench',1760,1350);put(DEC,'bench',1760,1410);put(DEC,'bench',2025,1385);
// motor pool: troop transports
for(const[x,y]of[[330,1440],[560,1440],[790,1440],[330,1660],[560,1660],[790,1700]])put(DEC,'mtruck',x,y);
// humvees (two wrecked + smoking)
put(DEC,'hmv',420,1240);put(DEC,'hmvx',250,1300);put(DEC,'hmv',1380,620);put(DEC,'hmv',1650,1720);put(DEC,'hmvx',1560,900);put(DEC,'hmv',960,1840);put(DEC,'hmv',2180,1640);put(DEC,'hmvx',1180,1350);
SM.push({x:250,y:1270},{x:1560,y:872},{x:1180,y:1322});
// tanks (one burning)
put(DEC,'tank',440,960);put(DEC,'tank',1100,1700);put(DEC,'tankx',2120,840);SM.push({x:2100,y:800},{x:2160,y:810});
// helicopters on pads
// (drawn after the pads so they sit on top)
// supply depot, tents, debris
for(const[x,y]of[[1300,1520],[1340,1520],[1300,1560],[1380,1560]])put(DEC,'ammo',x,y);put(DEC,'fuel',1440,1600);put(DEC,'fuel',1480,1600);put(DEC,'sbagw',1340,1620);
for(const[x,y]of[[1900,1640],[2040,1640],[1900,1800],[2040,1800]])put(DEC,'mtent',x,y);
for(const[x,y]of[[1160,560],[1440,480],[2250,420],[880,1000],[700,900],[1000,1240],[2230,1560],[620,620],[160,760],[2240,1000]])put(DEC,'sbagw',x,y);
put(DEC,'flagpole',1200,980);
const KO=[[200,140,2200,440],[H1[0]-20,H1[1]-20,H2[2]+20,H2[3]+20],[BR[0]-30,BR[1]-30,BR[2]+30,BR[3]+30],[0,SY-60,SX+60,SY+60],[SX-60,440,SX+60,WH],[220,1300,960,1760],[1650,440,2200,640]];
DEC.push(...scatter(6,[['crate',2],['barrel',2],['tire',1.5],['rubble',2],['sbag',2],['crater',1.5],['ammo',1],['can',1],['box',1]],80,KO));DEC.ko=KO;
const SP=[];for(let x=120;x<WW;x+=180){SP.push([x,30],[x,WH-30])}for(let y=140;y<WH-100;y+=180){SP.push([30,y],[WW-30,y])}
HS={px:1250,py:1080,cx:1200,cy:1000,nx0:0,nx1:0,ny0:0,ny1:0,sp:SP};NOGO=[];
grid();
const g=ground('#7a7550','#73704a','#807a54','#5f5a3a');
g.fillStyle='rgba(60,50,30,.18)';for(let i=0;i<160;i++){g.beginPath();g.ellipse((i*397)%WW,(i*229)%WH,30+(i*13)%60,14+(i*7)%24,0,0,7);g.fill()}
// runway + taxiway
g.fillStyle='#4a4d52';g.fillRect(200,150,2000,150);g.fillStyle='#55585e';g.fillRect(200,300,2000,140);g.fillStyle='#3e4146';g.fillRect(200,298,2000,4);
g.fillStyle='#d8d4c0';for(let x=260;x<2160;x+=90)g.fillRect(x,222,50,6);g.fillRect(200,156,2000,4);g.fillRect(200,290,2000,4);for(let i=0;i<8;i++){g.fillRect(214,164+i*15,40,8);g.fillRect(2146,164+i*15,40,8)}
g.fillStyle='#d8b92e';g.fillRect(200,370,2000,4);
for(let i=0;i<60;i++)crack(g,220+(i*131)%1960,160+(i*47)%270,6,'rgba(20,20,20,.55)');
// skid marks + debris trail toward the crash
g.fillStyle='rgba(16,14,12,.5)';for(let x=1180;x<1520;x+=3){g.fillRect(x,212+Math.sin(x/40)*6,3,4);g.fillRect(x,248+Math.sin(x/37)*5,3,4)}scorch(g,1640,240,140);scorch(g,1820,260,90);scorch(g,1700,320,70);
// apron + hangar floors
g.fillStyle='#606369';g.fillRect(260,430,1060,370);chk(g,H1[0],H1[1],H1[2]-H1[0],H1[3]-H1[1],'#6a6d72','#64676c');chk(g,H2[0],H2[1],H2[2]-H2[0],H2[3]-H2[1],'#6a6d72','#64676c');
g.fillStyle='#d8b92e';for(const c of[510,1050])for(let y=470;y<760;y+=24)g.fillRect(c-2,y,4,12);
stain(g,560,700,30);stain(g,1000,600,22);stain(g,700,520,40);
// roads
g.fillStyle='#3e4044';g.fillRect(0,SY-40,SX+40,80);g.fillRect(SX-40,440,80,WH-440);g.fillStyle='#d8b92e';for(let x=10;x<SX-40;x+=50)g.fillRect(x,SY-2,26,4);for(let y=460;y<WH;y+=50)g.fillRect(SX-2,y,4,26);
for(let i=0;i<40;i++)crack(g,(i*173)%SX,SY-36+(i*29)%72,5,'rgba(10,10,10,.5)');for(let i=0;i<40;i++)crack(g,SX-36+(i*31)%72,460+(i*97)%1500,5,'rgba(10,10,10,.5)');
// helipads + motor pool pad + parade ground
for(const[x,y]of HP)helipad(g,x,y,92);
g.fillStyle='#62645e';g.fillRect(220,1300,740,460);g.fillStyle='#d8d4c0';for(let x=220;x<=960;x+=230){g.fillRect(x,1300,4,180);g.fillRect(x,1540,4,220)}
g.fillStyle='rgba(120,110,80,.35)';g.fillRect(1000,880,400,150);
// barracks floors
chk(g,1640,1020,320,200,'#7a7a6a','#74746a');chk(g,1960,1020,150,200,'#8a6a4a','#82634a');tiles(g,2110,1020,150,200,'#c8ccd0','#bcc0c6');
g.fillStyle='#5a5d54';g.fillRect(1640,1220,620,60);chk(g,1640,1280,240,180,'#6a6e74','#64686e');tiles(g,1880,1280,180,180,'#a8c0cc','#9cb4c0');chk(g,2060,1280,200,180,'#7a7a6a','#74746a');
lockers(g,1646,1290,86,14,0);lockers(g,1788,1290,86,14,0);lockers(g,1646,1440,120,14,0);lockers(g,1646,1300,14,140,1);
showerH(g,1886,1286,5,34,46);showerH(g,1886,1408,3,34,46);g.fillStyle='rgba(255,255,255,.15)';g.fillRect(1990,1340,60,8);
stallsH(g,2112,1024,4,36,56);
g.fillStyle='#3a5a3a';g.fillRect(1975,1026,60,26);g.fillStyle='#c8d0a0';for(let i=0;i<5;i++)g.fillRect(1980+i*11,1032,6,4);
for(let i=0;i<18;i++)crack(g,1650+(i*71)%600,1030+(i*53)%420,5,'rgba(30,24,18,.5)');
wl(g,'#2a2c26','#6a6d60');for(let i=w0;i<w1;i++){const w=WL[i];g.fillStyle='#8a8f96';g.fillRect(w[0]+1,w[1]+1,Math.max(0,w[2]-2),Math.max(0,w[3]-2))}
for(let i=w1;i<w2;i++){const w=WL[i];g.fillStyle='#b8b4a0';g.fillRect(w[0]+1,w[1]+1,Math.max(0,w[2]-2),Math.max(0,w[3]-2))}
// broken window marks on the barracks
g.fillStyle='#16111c';for(const x of[1700,1880,2000,2200])g.fillRect(x,1018,22,4);g.fillStyle='#8fc3e8';g.fillRect(1702,1019,6,2);g.fillRect(2202,1019,8,2);
// barbed wire on top of everything at ground level
for(const w of FN)bwire(g,w);
// boom gates (one snapped, one jammed open)
boom_(g,108,1128,-.35);boom_(g,1556,1930,-1.2);
sign(g,300,960,'CHECKPOINT A',110);sign(g,1640,1935,'CHECKPOINT B',110);sign(g,1950,1000,'BARRACKS',90);sign(g,510,415,'HANGAR 1',80);sign(g,1050,415,'HANGAR 2',80);sign(g,590,1290,'MOTOR POOL',100);
paintDec(g,DEC);
// aircraft are drawn last so they sit over the floor
jetTop(g,510,712,'#7a828c',0);jetTop(g,1050,712,'#6a7480',1);
vS2(g,1625,262,220,80,q=>{q.save();q.translate(110,40);q.rotate(-.12);q.fillStyle='#6a7056';q.fillRect(-100,-26,190,52);q.fillStyle='#7a8064';q.fillRect(-100,-26,190,8);q.fillStyle='#2a3a40';q.fillRect(-96,-16,16,22);for(let x=-70;x<80;x+=18)q.fillRect(x,-14,8,8);q.fillStyle='#16111c';q.fillRect(86,-28,10,56);q.fillStyle='#c8521a';q.fillRect(80,-10,12,22);q.fillStyle='#ff9a2e';q.fillRect(84,-4,6,10);q.restore()});
vS2(g,1850,286,140,90,q=>{q.save();q.translate(70,46);q.rotate(.4);q.fillStyle='#5f6650';q.fillRect(-60,-22,110,44);q.fillStyle='#16111c';q.fillRect(-66,-24,10,48);q.fillStyle='#6a7056';q.fillRect(30,-50,16,100);q.fillStyle='#5f6650';q.fillRect(36,-36,18,30);q.restore()});
vS2(g,1735,330,170,40,q=>{q.save();q.translate(85,20);q.rotate(.05);q.fillStyle='#6a7056';q.beginPath();q.moveTo(-80,-8);q.lineTo(80,-14);q.lineTo(70,12);q.lineTo(-80,10);q.fill();q.fillStyle='#4a4f3a';q.fillRect(-20,-4,30,10);q.fillStyle='#3a3d36';q.fillRect(-60,-2,16,10);q.restore()});
for(const[x,y]of HP)OB.heli.f(g,x+6,y+18,(x*7)%1);
}
