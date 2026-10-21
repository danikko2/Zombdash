//# maps/hometown-market.js — Hometown Market map
// ---------- Hometown Market: a small-town grocery store, back storage with two loading docks, parking lot and the road out front ----------
function grH(i,k){const v=Math.sin(i*12.9898+k*78.233+2.3)*43758.5453;return v-Math.floor(v)}
function mapGrocery(){WW=2400;WH=2480;
const SX0=300,SX1=2060,SY0=380,SM_=640,SY1=1480,D1=760,D2=1060,FD=[820,1780],RY0=2280,RY1=2420,EN=[540,1880];
HS={px:1400,py:1400,cx:1400,cy:1300,nx0:SX0,nx1:SX1,ny0:SY0,ny1:SY1};
const D=[],pp=(k,x,y)=>put(D,k,x,y),V=[];
// ----- the building shell -----
hwall(SY0,SX0,SX1,[D1,D2],40);                              // back wall: two roll-up dock doors
hwall(SM_,SX0,SX1,[640,1500]);                              // storage / sales floor wall (two swing doors)
hwall(SY1,SX0,SX1,FD,34);                                   // storefront: two sets of automatic doors
vwall(SX0,SY0,SY1,[]);vwall(SX1,SY0,SY1,[520]);              // side walls (a side door from storage onto the truck lane)
hwall(500,SX0,520,[]);vwall(520,SY0,500,[440]);                 // little manager's office in the back corner
// ----- storage room: pallet racks, pallets, a forklift -----
for(const y of[470,575])for(let x=1260;x<1980;x+=96)pp('shelf',x,y);
for(const[x,y]of[[640,470],[700,560],[860,470],[930,560],[1130,470],[1170,580]])pp('pbox',x,y);
for(const[x,y]of[[600,610],[880,610],[1000,460],[1150,620]])pp('pallet',x,y);
for(const[x,y]of[[960,620],[1040,620],[700,430]])pp('crate',x,y);
pp('forklift',1060,560);pp('cabinet',340,440);pp('cabinet',364,440);pp('tdesk',420,470);pp('chair',430,486);pp('plant',500,446);
// ----- sales floor -----
// freezer wall (frozen foods) and the dairy coolers along the back
for(let x=345;x<600;x+=72)pp('ufrz',x,706);for(let x=700;x<=940;x+=72)pp('ufrz',x,706);
for(let x=1580;x<2030;x+=72)pp('fridge',x,702);for(const x of[1100,1172,1244,1316,1388])pp('fridge',x,702);
// chest freezer islands
for(const y of[820,940,1060])for(const x of[420,590,760])pp('freezer',x,y);
// the aisles
const AR=[790,880,970,1060,1150],AL=[1040,1156,1272],AR2=[1520,1636,1752,1868],SH=[];
for(const y of AR){for(const x of AL){pp('gshelf',x,y);SH.push([x,y-24])}for(const x of AR2){pp('gshelf',x,y);SH.push([x,y-24])}}
// checkout lanes, customer service, bakery case, produce, carts by the doors
const CO=[1000,1140,1280,1420,1560,1700];for(const x of CO)pp('checkout',x,1300);
pp('counter',600,1300);pp('display',420,1300);pp('display',420,1200);
for(const[x,y]of[[1880,1250],[1980,1250],[1880,1360],[1980,1360]])pp('produce',x,y);
pp('cartrow',680,1460);pp('cartrow',960,1460);pp('cartrow',1640,1460);pp('cartrow',1940,1460);
pp('vending',360,1460);pp('vending',392,1460);pp('plant',1080,1460);pp('plant',1530,1460);
for(const[x,y]of[[1320,1080],[1100,920],[1700,1010],[600,880],[1450,1230]])pp('cart',x,y);
// ----- outside: sidewalk carts, the parking lot, light poles, corrals, cars -----
pp('cartrow',1060,1540);pp('cartrow',1560,1540);pp('trash',740,1530);pp('trash',1880,1530);pp('bench',1300,1540);pp('newsb',560,1530);pp('newsb',2000,1530);
const RA=1790,RB=2050,PL_=[[620,RA],[1080,RA],[1560,RA],[2000,RA],[620,RB],[1080,RB],[1560,RB],[2000,RB]];for(const[x,y]of PL_)pp('plight',x,y+4);
const CRL=[[840,RA+6],[1780,RB+6]];for(const[x,y]of CRL)pp('corral',x,y);
const cc=['#c0392b','#2f6fd0','#d8d8d4','#26262c','#2f8a4a','#f0c020','#8a8f96','#6a4a9a','#3a8a8a','#b8783c'],ks=['sedan','suv','sedan','pickup','van','sedan'];let n=0;
const okStall=x=>!PL_.some(p=>Math.abs(p[0]-x)<46)&&!CRL.some(p=>Math.abs(p[0]-x)<80);
for(const row of[RA,RB])for(const s of[-1,1])for(let x=380;x<2260;x+=50){n++;if(!okStall(x)||grH(n,1)<.62)continue;const k=ks[n%6],z=HWV(k);V.push({k,x,y:row+s*46,a:s<0?-Math.PI/2:Math.PI/2,L:z[0]*.9,W:z[1]*.88,c:cc[n%cc.length],dmg:grH(n,2)<.12})}
// a couple abandoned mid-lot, carts everywhere
V.push({k:'suv',x:1300,y:1650,a:.25,L:88*.9,W:40*.88,c:'#2f6fd0',dmg:1},{k:'sedan',x:2190,y:1920,a:1.5,L:80*.9,W:36*.88,c:'#d8d8d4'});
for(const[x,y]of[[700,1660],[1460,1920],[980,2170],[1900,1660],[2150,2150],[460,1930],[1250,2190]])pp('cart',x,y);
// the road out front: a few cars stopped where they were
V.push({k:'sedan',x:300,y:2315,a:0,L:72,W:32,c:'#8a8f96'},{k:'pickup',x:1180,y:2385,a:Math.PI+.1,L:85,W:35,c:'#b8783c',dmg:1},{k:'sedan',x:1270,y:2350,a:2.7,L:72,W:32,c:'#c0392b',dmg:1},{k:'van',x:2120,y:2318,a:-.05,L:83,W:37,c:'#d8d8d4'});
// ----- the truck yard: semi backed into dock 1, dock 2 empty -----
const ty=SY0-6-111;V.push({k:'trailer',x:D1,y:ty,a:-Math.PI/2,L:222,W:48,c:'#e8e8e4',st:'#2f8a4a'});V.push({k:'cab',x:D1,y:ty-111-36,a:-Math.PI/2,L:66,W:46,c:'#c0392b'});
for(const[x,y]of[[1240,300],[1310,300]])pp('dumpster',x,y);for(const[x,y]of[[1500,320],[1540,330],[1600,316]])pp('pallet',x,y);pp('pbox',1700,330);pp('barrel',1850,330);pp('barrel',1872,336);
pp('pbox',D2-70,350);pp('cone',D2-40,300);pp('cone',D2+40,300);
for(const v of V)hwCol(v);WL.push([D1-42,SY0-24,84,20,1]);
// trees + bushes on the grass strips
for(let y=200;y<2200;y+=150)pp('stree',150+grH(y,3)*60,y+grH(y,4)*40);for(let y=120;y<1500;y+=170)pp('stree',2350,y);
for(const[x,y]of[[230,1500],[230,1620],[2340,1620],[2350,1760]])pp('bush',x,y);
const KO=[[SX0-30,0,WW,SY1+120],[280,1560,WW,RY1+40],[0,RY0-30,WW,WH]];
D.push(...scatter(17,[['tuft',5],['flower',2],['rock',1],['paper',1]],70,KO));D.ko=KO;
const SP=[[20,2320],[20,2380],[WW-20,2330],[WW-20,2390],[900,20],[1500,20],[2190,20],[20,700],[20,1300],[20,1900],[WW-20,600]];HS.sp=SP;
HS.ST=[SX0,SM_,SX1,SY1];HS.SHF=SH;HS.CRL=CRL.concat([[1060,1540],[1560,1540]]);HS.HO=[{x:SX0,y:SY0,w:SX1-SX0,h:SY1-SY0}];
SM=[];grid();
// ======================= paint =======================
const g=ground('#4f8a3e','#57943f','#4a8238','#3f7a34');
const AS=(x,y,w,h)=>{g.fillStyle='#3e4046';g.fillRect(x,y,w,h);for(let i=0;i<w*h/900;i++){g.fillStyle=i%3?'rgba(0,0,0,.12)':'rgba(255,255,255,.05)';g.fillRect(x+grH(i,x)*w,y+grH(i,y+1)*h,2+i%3,2)}};
// truck yard, the east lane, the parking lot, the road
AS(SX0-20,0,SX1-SX0+40,SY0);AS(2080,0,220,RY0);AS(300,1580,2000,700);
g.fillStyle='#9a9890';g.fillRect(0,RY0-22,WW,22);g.fillStyle='#86847c';for(let x=0;x<WW;x+=32)g.fillRect(x,RY0-22,1,22);
for(const x of EN){AS(x-70,RY0-24,140,26)}
AS(0,RY0,WW,RY1-RY0);g.fillStyle='rgba(230,190,60,.85)';for(let x=0;x<WW;x+=4){g.fillRect(x,(RY0+RY1)/2-4,4,3);g.fillRect(x,(RY0+RY1)/2+1,4,3)}
g.fillStyle='rgba(240,240,232,.55)';for(let x=0;x<WW;x+=60){g.fillRect(x,RY0+6,30,3);g.fillRect(x,RY1-9,30,3)}
for(let i=0;i<24;i++)crack(g,grH(i,5)*WW,1600+grH(i,6)*800,8,'rgba(10,10,10,.45)');
for(let i=0;i<20;i++){g.fillStyle='rgba(20,20,24,.3)';g.beginPath();g.ellipse(320+grH(i,7)*1950,1620+grH(i,8)*640,10+grH(i,9)*14,6,0,0,7);g.fill()}
// stall lines + arrows
g.fillStyle='rgba(245,245,238,.85)';for(const row of[RA,RB]){for(let x=355;x<2290;x+=50){g.fillRect(x,row-92,3,88);g.fillRect(x,row+4,3,88)}g.fillRect(355,row-2,1935,4)}
g.fillStyle='rgba(245,245,238,.6)';for(const[y,d]of[[1640,1],[1915,-1],[2190,1]])for(let x=500;x<2200;x+=380){g.fillRect(x,y-2,40,4);g.beginPath();g.moveTo(x+(d>0?40:0),y-9);g.lineTo(x+(d>0?54:-14),y);g.lineTo(x+(d>0?40:0),y+9);g.fill()}
// handicap stalls by the door
for(const x of[780,830,1730,1780]){g.fillStyle='rgba(47,111,208,.75)';g.fillRect(x+4,RA-90,44,86);g.fillStyle='#f4f4f0';g.beginPath();g.arc(x+26,RA-46,7,0,7);g.fill()}
// the sidewalk across the front of the store
g.fillStyle='#b4b2aa';g.fillRect(SX0-20,SY1,SX1-SX0+40,100);g.fillStyle='#a2a098';for(let x=SX0-20;x<SX1+20;x+=32)g.fillRect(x,SY1,1,100);for(let y=SY1;y<SY1+100;y+=32)g.fillRect(SX0-20,y,SX1-SX0+40,1);
g.fillStyle='#8a8880';g.fillRect(SX0-20,SY1+96,SX1-SX0+40,4);
g.fillStyle='rgba(240,200,64,.9)';for(const x of FD)for(let k=0;k<6;k++)g.fillRect(x-60,SY1+30+k*10,120,4);   // crosswalk at each door
// dock aprons: yellow bumpers + hazard stripes
for(const x of[D1,D2]){g.fillStyle='#55575e';g.fillRect(x-70,SY0-90,140,84);for(let k=0;k<7;k++){g.fillStyle=k%2?'#16111c':'#f0c020';g.save();g.beginPath();g.rect(x-70,SY0-14,140,10);g.clip();g.fillRect(x-70+k*22-10,SY0-14,22,10);g.restore()}for(const s of[-1,1]){g.fillStyle='#16111c';g.fillRect(x+s*52-6,SY0-12,12,10);g.fillStyle='#e0b030';g.fillRect(x+s*52-5,SY0-11,10,8)}}
g.fillStyle='#f4f0e0';g.font='bold 18px Arial, Helvetica, sans-serif';g.textAlign='center';g.fillText('DOCK 1',D1+110,SY0-40);g.fillText('DOCK 2',D2+110,SY0-40);g.textAlign='left';
g.fillStyle='rgba(245,245,238,.7)';for(let x=SX0+40;x<SX1;x+=120)if(Math.abs(x-D1)>90&&Math.abs(x-D2)>90)g.fillRect(x,40,4,SY0-120);
// floors
chk(g,SX0,SY0,SX1-SX0,SM_-SY0,'#9a9890','#92908a');for(let i=0;i<40;i++){g.fillStyle='rgba(30,30,30,.18)';g.beginPath();g.ellipse(560+grH(i,10)*1400,420+grH(i,11)*200,10+i%4*6,5,0,0,7);g.fill()}
chk(g,SX0,SY0,220,120,'#8a6a4a','#7e6044');
g.fillStyle='rgba(240,200,64,.85)';for(let x=560;x<1240;x+=30)g.fillRect(x,SM_-24,16,4);
tiles(g,SX0,SM_,SX1-SX0,SY1-SM_,'#eceee8','#e2e4de');
tiles(g,SX0,SM_,620,560,'#dfe9f2','#d4e0ea');                       // frozen section tiles
for(let x=SX0;x<SX1;x+=36){g.fillStyle='rgba(47,111,208,.25)';g.fillRect(x,SY1-140,18,2)}
// checkout lane floor mats
for(const x of CO){g.fillStyle='rgba(60,62,70,.35)';g.fillRect(x+42,1262,52,70);g.fillStyle='rgba(30,30,36,.25)';for(let y=1266;y<1330;y+=6)g.fillRect(x+44,y,48,2)}
wl(g,'#26262c','#c8c4b8');
// big front windows + the automatic doors
for(const w of WL){if(w[4]||Math.abs(w[1]+3-SY1)>1||w[2]<w[3])continue;g.fillStyle='#8fc3e8';g.fillRect(w[0]+1,w[1]+1,Math.max(0,w[2]-2),4);g.fillStyle='rgba(255,255,255,.75)';for(let x=w[0]+8;x<w[0]+w[2]-6;x+=26)g.fillRect(x,w[1]+2,8,2)}
for(const x of FD){g.fillStyle='#16111c';g.fillRect(x-36,SY1-5,72,10);g.fillStyle='#bfe0f0';g.fillRect(x-35,SY1-4,24,8);g.fillRect(x+11,SY1-4,24,8);g.fillStyle='#3aff7a';g.fillRect(x-3,SY1-8,6,3)}
// roll-up dock doors
for(const x of[D1,D2]){g.fillStyle='#16111c';g.fillRect(x-42,SY0-6,84,12);g.fillStyle=x==D1?'#8a8f96':'#5a5e68';g.fillRect(x-41,SY0-5,82,10);g.fillStyle='rgba(0,0,0,.3)';for(let k=x-40;k<x+40;k+=6)g.fillRect(k,SY0-5,1,10)}
// aisle signs hanging over each aisle, department signs
const AS2=[835,925,1015,1105];AS2.forEach((y,i)=>{for(const x of[1400]){g.fillStyle='#16111c';g.fillRect(x-30,y-12,60,24);g.fillStyle='#2f6fd0';g.fillRect(x-28,y-10,56,20);g.fillStyle='#f4f4f0';g.font='bold 12px Arial, Helvetica, sans-serif';g.textAlign='center';g.textBaseline='middle';g.fillText('AISLE '+(i+1),x,y);g.textAlign='left';g.textBaseline='alphabetic'}});
const dept=(x,y,t,c)=>{const w=t.length*9+20;g.fillStyle='#16111c';g.fillRect(x-w/2-2,y-2,w+4,22);g.fillStyle=c;g.fillRect(x-w/2,y,w,18);g.fillStyle='#f4f4f0';g.font='bold 12px Arial, Helvetica, sans-serif';g.textAlign='center';g.fillText(t,x,y+14);g.textAlign='left'};
dept(600,738,'FROZEN FOODS','#2f6fd0');dept(1800,732,'DAIRY','#2f8a4a');dept(1250,732,'DELI & MEAT','#c0392b');dept(1930,1194,'PRODUCE','#3f9a4a');dept(420,1146,'BAKERY','#b8783c');dept(600,1246,'SERVICE','#6a4a9a');
dept(640,SM_+4,'EMPLOYEES ONLY','#5a5e68');dept(1500,SM_+4,'EMPLOYEES ONLY','#5a5e68');dept(410,SY0+12,'OFFICE','#5a5e68');
// checkout lane numbers
CO.forEach((x,i)=>{g.fillStyle='#16111c';g.fillRect(x+44,1238,18,16);g.fillStyle=i%2?'#ffd84a':'#3aff7a';g.fillRect(x+45,1239,16,14);g.fillStyle='#16111c';g.font='bold 11px Arial';g.textAlign='center';g.fillText(String(i+1),x+53,1251);g.textAlign='left'});
// the store sign over the doors
{const x=(SX0+SX1)/2,y=SY1+8,t='HOMETOWN MARKET',w=300;g.fillStyle='#16111c';g.fillRect(x-w/2-3,y-3,w+6,34);g.fillStyle='#c0392b';g.fillRect(x-w/2,y,w,28);g.fillStyle='#ffe9a0';g.fillRect(x-w/2,y,w,3);g.fillStyle='#f4f4f0';g.font='bold 20px Arial, Helvetica, sans-serif';g.textAlign='center';g.textBaseline='middle';g.fillText(t,x,y+15);g.textAlign='left';g.textBaseline='alphabetic'}
sign(g,1880,SY1+64,'OPEN 7AM - 10PM',150);sign(g,2190,1500,'TRUCKS →',110);sign(g,EN[0],RY0-60,'ENTER',80);sign(g,EN[1],RY0-60,'ENTER',80);
// shadows + vehicles
for(const v of V){g.save();g.translate(v.x+4,v.y+5);g.rotate(v.a);g.fillStyle='rgba(0,0,0,.28)';g.fillRect(-v.L/2,-v.W/2,v.L,v.W);g.restore()}
for(const v of V){const r=Math.hypot(v.L,v.W)/2+6;vDraw(g,v.x-r,v.y-r,r*2,r*2,q=>hwDraw(q,v))}
// the trailer's name on its roof
g.save();g.translate(D1,ty);g.rotate(-Math.PI/2);g.fillStyle='#2f8a4a';g.font='bold 16px Arial, Helvetica, sans-serif';g.textAlign='center';g.textBaseline='middle';g.fillText('FRESH FOODS',0,0);g.restore();g.textAlign='left';g.textBaseline='alphabetic';
paintDec(g,D)}

