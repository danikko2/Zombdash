//# maps/haunted-mansion.js — Haunted Mansion map
// ---------- Haunted Mansion: an old, many-roomed house full of portraits, statues and candles ----------
function mnH(i,k){const v=Math.sin(i*12.9898+k*78.233+7.7)*43758.5453;return v-Math.floor(v)}
// wood plank floor
function mnPlank(g,x,y,w,h,a,b){for(let j=0;j<h;j+=12){g.fillStyle=(j/12)%2?a:b;g.fillRect(x,y+j,w,Math.min(12,h-j));g.fillStyle='rgba(0,0,0,.28)';g.fillRect(x,y+j,w,1);for(let i=((j*37)%90);i<w;i+=90)g.fillRect(x+i,y+j,1,Math.min(12,h-j))}}
// a framed painting hanging on a wall; eyes get recorded so they can follow you around
function mnPic(g,x,y,w,h,k,E){g.fillStyle='#16111c';g.fillRect(x-3,y-3,w+6,h+6);g.fillStyle='#8a6a2a';g.fillRect(x-2,y-2,w+4,h+4);g.fillStyle='#c8a040';g.fillRect(x-2,y-2,w+4,1);g.fillStyle='#1a1418';g.fillRect(x,y,w,h);
const cx=x+w/2,R=(c,a,b,ww,hh)=>{g.fillStyle=c;g.fillRect(a,b,ww,hh)};
if(k==4){R('#2a2a3a',x,y,w,h*.6);R('#c8c8b0',x+w*.7,y+3,4,4);R('#1a1a14',x,y+h*.6,w,h*.4);R('#16111c',cx-1,y+h*.3,2,h*.4);R('#16111c',cx-5,y+h*.35,4,1);R('#16111c',cx+1,y+h*.4,4,1);return}
const sk=k==3?'#a8b0a0':k==2?'#e8dcd0':'#d8c8b0',cl=k==0?'#4a1a2a':k==1?'#1a1a22':k==2?'#e8e8e4':'#2a2a2a';
R(cl,x+2,y+h*.62,w-4,h*.38);R(sk,cx-w*.2,y+h*.18,w*.4,h*.42);
if(k==0||k==2)R('#16111c',cx-w*.24,y+h*.12,w*.48,h*.14);if(k==0||k==2){R('#16111c',cx-w*.26,y+h*.2,w*.08,h*.5);R('#16111c',cx+w*.18,y+h*.2,w*.08,h*.5)}
if(k==1){R('#3a3a3a',cx-w*.22,y+h*.12,w*.44,h*.1);R('#3a2a1a',cx-w*.1,y+h*.48,w*.2,2)}
const ey=y+h*.34,ex1=cx-w*.1,ex2=cx+w*.1;R(k==3?'#16111c':'#f0ece0',ex1-1,ey-1,3,3);R(k==3?'#16111c':'#f0ece0',ex2-1,ey-1,3,3);if(k!=3)E.push({x:ex1,y:ey},{x:ex2,y:ey});
if(k==3){R('#16111c',cx-2,y+h*.5,4,2);R('#7a1010',cx-w*.18,y+h*.55,w*.36,1)}
if(k==5){g.strokeStyle='rgba(20,12,12,.9)';g.lineWidth=2;g.beginPath();g.moveTo(x+2,y+3);g.lineTo(x+w-3,y+h-3);g.moveTo(x+w*.6,y+2);g.lineTo(x+w*.2,y+h-2);g.stroke()}}
function mnWeb(g,x,y,sx,sy){g.strokeStyle='rgba(220,220,220,.35)';g.lineWidth=1;g.beginPath();for(let i=0;i<5;i++){const a=i/4*Math.PI/2;g.moveTo(x,y);g.lineTo(x+sx*Math.cos(a)*26,y+sy*Math.sin(a)*26)}for(const r of[8,15,22]){g.moveTo(x+sx*r,y);for(let i=1;i<=4;i++){const a=i/4*Math.PI/2;g.lineTo(x+sx*Math.cos(a)*r*(i%2?.92:1),y+sy*Math.sin(a)*r*(i%2?.92:1))}}g.stroke()}
// a bare, twisted dead tree
function mnTree(g,x,y,s,v){const L=(x1,y1,x2,y2,w)=>{g.lineWidth=w+2;g.strokeStyle='#16111c';g.beginPath();g.moveTo(x1,y1);g.lineTo(x2,y2);g.stroke();g.lineWidth=w;g.strokeStyle='#3a3230';g.beginPath();g.moveTo(x1,y1);g.lineTo(x2,y2);g.stroke()};g.lineCap='round';
g.fillStyle='rgba(0,0,0,.25)';g.beginPath();g.ellipse(x+6,y+2,16*s,5*s,0,0,7);g.fill();
const top=y-58*s;L(x,y,x+4*s*(v-.5),top,6*s);const br=(bx,by,a,len,w,d)=>{const ex=bx+Math.cos(a)*len,ey=by+Math.sin(a)*len;L(bx,by,ex,ey,w);if(d>0){br(ex,ey,a-.5,len*.62,Math.max(1,w-1.5),d-1);br(ex,ey,a+.45,len*.6,Math.max(1,w-1.5),d-1)}};
br(x,y-30*s,-2.3-v*.3,22*s,4*s,2);br(x,y-40*s,-.8+v*.3,24*s,4*s,2);br(x+4*s*(v-.5),top,-1.6,18*s,3*s,2);g.lineCap='butt'}
function mapMansion(){WW=2400;WH=2000;const x0=400,x1=2000,y0=300,y1=1500;
HS={px:1200,py:1300,cx:1200,cy:1000,nx0:x0-30,nx1:x1+30,ny0:y0-30,ny1:y1+30};
// walls: rooms along the top, the portrait gallery, dining / foyer / ballroom, kitchen / pantry / conservatory / storage
hwall(y0,x0,x1,[1200]);hwall(y1,x0,x1,[550,1200],34);vwall(x0,y0,y1,[480,735],30);vwall(x1,y0,y1,[735,1335],30);
hwall(680,x0,x1,[580,900,1200,1530,1850]);vwall(760,y0,680,[]);vwall(1040,y0,680,[]);vwall(1360,y0,680,[]);vwall(1700,y0,680,[]);
hwall(790,x0,x1,[650,1150,1250,1750],34);vwall(900,790,y1,[980,1330]);vwall(1500,790,y1,[980,1330]);
hwall(1170,x0,900,[550,800]);vwall(700,1170,y1,[1335]);hwall(1170,1500,x1,[1620,1880]);vwall(1750,1170,y1,[1335]);
// grand staircase arms and the fallen chandelier
WL.push([916,800,150,140,1],[1334,800,150,140,1],[1170,1062,60,36,1]);
const DEC=[],pp=(k,x,y)=>put(DEC,k,x,y);
// library
for(const x of[440,494,548,602,656,710])pp('bookshelf',x,348);for(const y of[470,580])for(const x of[470,524,646,700])pp('bookshelf',x,y);pp('rtable',690,650);pp('chair',650,648);pp('cdl',430,650);
// study
pp('tdesk',900,430);pp('chair',900,470);pp('gclock',1010,364);pp('bust',800,366);pp('cabinet',790,650);pp('safe',990,656);pp('cdl',1010,520);
// nursery
pp('crib',1110,420);pp('rhorse',1210,560);pp('bed',1310,400);pp('footlk',1300,640);for(const[x,y]of[[1150,610],[1270,600],[1080,520],[1330,520]])pp('doll',x,y);
// master bedroom
pp('mbed',1530,470);pp('wardrobe',1660,362);pp('cdl',1400,364);pp('cdl',1670,640);pp('chair',1440,600);
// bath
pp('tub',1880,410);pp('toilet',1966,364);pp('msink',1760,340);
// gallery: suits of armor against the north wall, busts on the south side
for(const x of[470,740,1040,1360,1680,1960])pp('knight',x,704);for(const x of[520,1000,1420,1900])pp('bust',x,786);
// dining hall
pp('mtable',650,1010);for(let i=0;i<5;i++){pp('chair',560+i*45,980);pp('chair',560+i*45,1046)}pp('fplace',470,844);pp('gclock',862,844);pp('cdl',440,1140);pp('wardrobe',862,1150);
// foyer
pp('g_angel',1110,1474);pp('g_angel',1290,1474);pp('cdl',940,1220);pp('cdl',1460,1220);pp('urn',990,1460);pp('urn',1410,1460);pp('knight',940,1100);pp('knight',1460,1100);
// ballroom
pp('piano',1620,900);pp('couch',1900,860);pp('cdl',1530,1150);pp('cdl',1970,1150);pp('cdl',1970,840);pp('chair',1680,1060);pp('chair',1800,1110);
for(const[x,y]of[[1700,980],[1820,1000],[1760,1080]])pp('skull',x,y);pp('bones',1880,1040);
// kitchen + pantry
pp('stove',450,1222);pp('stove',500,1222);pp('msink',580,1212);pp('wtable',600,1340);pp('cabinet',682,1214);pp('barrel',440,1466);
pp('wshelf',800,1222);pp('crate',750,1466);pp('crate',866,1466);pp('barrel',866,1300);
// conservatory + storage
for(const[x,y]of[[1540,1224],[1710,1224],[1540,1470],[1710,1470]])pp('plant',x,y);pp('statue',1625,1350);pp('bench',1625,1470);
pp('crate',1800,1236);pp('crate',1832,1270);pp('barrel',1970,1220);pp('safe',1960,1470);pp('crate',1790,1466);
// grounds: family graves, dead fountain, lamps, a dead hedge row, the iron fence
const GS=['g_round','g_cross','g_obelisk','g_slab','g_angel','g_wide'];for(let j=0;j<3;j++)for(let i=0;i<5;i++)if((i+j)%4!=3)pp(GS[(i*2+j)%6],1250+i*62,90+j*80);
for(let j=0;j<3;j++)for(let i=0;i<4;i++)if((i*3+j)%5!=1)pp(GS[(i+j*2)%6],90+i*70,1600+j*90);
pp('fntn',1200,1780);for(const[x,y]of[[1120,1580],[1280,1580],[1110,1900],[1290,1900]])pp('lamp',x,y);
for(const x of[480,640,760,880,980,1420,1540,1660,1780,1900])pp(x%3?'dead':'urn',x,1556);
const FN=[[0,1930,1130,1930],[1270,1930,2400,1930]];for(const f of FN)WL.push([f[0],f[1]-3,f[2]-f[0],6,2]);
// dead trees (solid trunks)
const TR=[[120,150],[320,80],[700,160],[1000,110],[1820,170],[150,600],[260,960],[110,1300],[2300,920],[2160,1330],[330,1820],[2120,1680],[2320,1840],[720,1800],[1700,1820],[900,1700],[1520,1690],[1320,320]].map(([x,y],i)=>({x,y,s:.85+mnH(i,1)*.5,v:mnH(i,2)}));for(const t of TR)WL.push([t.x-5,t.y-5,10,10,2]);
const FP=fsCR([[2050,470],[2140,430],[2230,330],[2320,250],[2400,200]],10),fpD=(x,y)=>Math.min(...FP.map(q=>Math.hypot(q[0]-x,q[1]-y))),FT2=[];
{let n=0;for(let gy=8;gy<620;gy+=36)for(let gx=2070;gx<WW+20;gx+=36){n++;const x=gx+(mnH(n,40)-.5)*20,y=gy+(mnH(n,41)-.5)*20,e=((x-WW)/360)**2+(y/600)**2;if(e>1+mnH(n,42)*.12||fpD(x,y)<46||x>WW-6)continue;const k=mnH(n,43)<.22?2:mnH(n,44)<.3?1:0;FT2.push({x,y,k,r:Math.round(k==2?14+mnH(n,45)*5:18+mnH(n,45)*9),v:mnH(n,46)});WL.push([x-10,y-10,20,20,2])}}
WL.push([2056,404,8,8,2]);for(let i=0;i<10;i++){const q=FP[Math.floor(mnH(i,47)*FP.length)],a=mnH(i,48)*6.283;pp('shroom',q[0]+Math.cos(a)*56,q[1]+Math.sin(a)*56)}pp('lantern',2130,470);pp('lantern',2250,390);
const KO=[[x0-40,y0-40,x1+40,y1+60],[1100,1500,1300,2000],[1040,1620,1360,1900],[1220,40,1550,320],[2060,0,WW,600],[60,1560,380,1900],[0,1910,WW,1960]];
DEC.push(...scatter(9,[['dead',3],['bones',1],['rock',2],['tuft',3],['candle',1],['cross',1],['stump',1],['skull',1]],80,KO));DEC.ko=KO;
SM=[];grid();
const g=ground('#3a4632','#34402d','#404c37','#2a3424');
// fog-damp lawn patches, the gravel drive and turnaround
for(let i=0;i<40;i++){g.fillStyle='rgba(20,24,18,.25)';g.beginPath();g.ellipse(mnH(i,3)*WW,mnH(i,4)*WH,30+mnH(i,5)*60,14+mnH(i,6)*24,0,0,7);g.fill()}
g.fillStyle='#5e5a50';g.fillRect(1140,1500,120,500);g.beginPath();g.arc(1200,1740,150,0,7);g.fill();g.fillStyle='#6e6a5e';for(let i=0;i<500;i++){const a=mnH(i,7)*6.283,r=mnH(i,8)*150;g.fillRect(1200+Math.cos(a)*r,1740+Math.sin(a)*r,2,2);g.fillRect(1142+mnH(i,9)*116,1500+mnH(i,10)*500,2,2)}
// floors
mnPlank(g,x0,y0,x1-x0,y1-y0,'#4a3626','#40301f');
const rug=(x,y,w,h,a,b)=>{g.fillStyle='#16111c';g.fillRect(x-1,y-1,w+2,h+2);g.fillStyle=a;g.fillRect(x,y,w,h);g.fillStyle=b;g.fillRect(x+4,y+4,w-8,2);g.fillRect(x+4,y+h-6,w-8,2);g.fillRect(x+4,y+4,2,h-8);g.fillRect(x+w-6,y+4,2,h-8);g.fillStyle='rgba(0,0,0,.2)';for(let i=0;i<8;i++)g.fillRect(x+mnH(i,x)*w*.8,y+mnH(i,y)*h*.8,10,6)};
rug(560,600,120,60,'#3a4a2a','#a8862e');rug(820,470,160,120,'#5a1a2a','#a8862e');chk(g,1040,y0,320,380,'#9a8888','#8a7878');rug(1440,520,180,110,'#4a1a3a','#c8a040');chk(g,1700,y0,300,380,'#8a948a','#7a847a');
g.fillStyle='#16111c';g.fillRect(x0+20,724,x1-x0-40,26);g.fillStyle='#6a1a1a';g.fillRect(x0+20,726,x1-x0-40,22);g.fillStyle='#a8862e';g.fillRect(x0+20,728,x1-x0-40,2);g.fillRect(x0+20,744,x1-x0-40,2);
rug(510,950,280,120,'#4a1a1a','#a8862e');chk(g,900,790,600,710,'#8e8a82','#2c2a32');g.fillStyle='rgba(60,50,40,.35)';for(let i=0;i<120;i++)g.fillRect(900+mnH(i,11)*600,790+mnH(i,12)*710,8,4);
g.fillStyle='#16111c';g.beginPath();g.arc(1200,1250,112,0,7);g.fill();g.fillStyle='#5a1a2a';g.beginPath();g.arc(1200,1250,108,0,7);g.fill();g.strokeStyle='#a8862e';g.lineWidth=3;g.beginPath();g.arc(1200,1250,96,0,7);g.stroke();g.beginPath();g.arc(1200,1250,40,0,7);g.stroke();
chk(g,1500,790,500,380,'#7a5230','#6a4426');g.strokeStyle='rgba(200,170,90,.35)';g.lineWidth=2;g.beginPath();g.arc(1760,1000,110,0,7);g.stroke();
chk(g,x0,1170,300,330,'#6a6458','#5a5448');mnPlank(g,700,1170,200,330,'#3e2e20','#36281c');chk(g,1500,1170,250,330,'#5a7a5a','#c8c8b8');mnPlank(g,1750,1170,250,330,'#3a2a1e','#30241a');
// cracks, stains, dust, leaves in the conservatory, chalk circle + scrawl in the nursery
for(let i=0;i<70;i++)crack(g,x0+20+mnH(i,13)*(x1-x0-40),y0+20+mnH(i,14)*(y1-y0-40),6+i%5,'rgba(10,6,4,.45)');
for(let i=0;i<30;i++){g.fillStyle=i%3?'rgba(40,20,10,.3)':'rgba(90,10,10,.25)';g.beginPath();g.ellipse(x0+mnH(i,15)*(x1-x0),y0+mnH(i,16)*(y1-y0),10+i%4*6,6+i%3*3,i,0,7);g.fill()}
for(let i=0;i<60;i++){g.fillStyle=['#7a5a2a','#5a4a1a','#8a6a3a'][i%3];g.fillRect(1510+mnH(i,17)*230,1180+mnH(i,18)*310,3,2)}
g.strokeStyle='rgba(230,230,230,.45)';g.lineWidth=2;g.beginPath();g.arc(1200,470,58,0,7);g.stroke();g.beginPath();for(let i=0;i<5;i++){const a=-Math.PI/2+i*4*Math.PI/5;i?g.lineTo(1200+Math.cos(a)*56,470+Math.sin(a)*56):g.moveTo(1200+Math.cos(a)*56,470+Math.sin(a)*56)}g.closePath();g.stroke();
g.save();g.translate(1080,600);g.rotate(-.06);g.fillStyle='rgba(150,20,20,.75)';g.font='bold 15px Arial, Helvetica, sans-serif';g.fillText('PLAY WITH ME',0,0);g.restore();
// grand staircase: two curving arms of steps with a red runner, meeting the gallery
for(const[sx,dir]of[[916,1],[1334,-1]]){g.fillStyle='#16111c';g.fillRect(sx-2,798,154,144);g.fillStyle='#4a3626';g.fillRect(sx,800,150,140);for(let j=0;j<10;j++){g.fillStyle=j%2?'#5a4230':'#4e3828';g.fillRect(sx,800+j*14,150,13);g.fillStyle='rgba(0,0,0,.4)';g.fillRect(sx,812+j*14,150,2)}
g.fillStyle='#6a1a1a';g.fillRect(sx+50,800,50,140);g.fillStyle='#a8862e';g.fillRect(sx+50,800,2,140);g.fillRect(sx+98,800,2,140);g.fillStyle='#2a1a10';g.fillRect(dir>0?sx:sx+144,796,6,148);for(let j=0;j<10;j++)g.fillRect(dir>0?sx+1:sx+145,800+j*14,4,3)}
// the fallen chandelier
g.strokeStyle='#16111c';g.lineWidth=7;g.beginPath();g.ellipse(1200,1080,34,16,0,0,7);g.stroke();g.strokeStyle='#a8862e';g.lineWidth=4;g.stroke();for(let i=0;i<10;i++){const a=i*.628;g.fillStyle='#e8f0f8';g.fillRect(1200+Math.cos(a)*34-2,1080+Math.sin(a)*16,4,6)}for(let i=0;i<40;i++){g.fillStyle=i%2?'#bfe6ff':'#e8f0f8';g.fillRect(1200+(mnH(i,19)-.5)*140,1080+(mnH(i,20)-.5)*80,2,2)}
// iron fence with the gate
for(const f of FN){g.fillStyle='#16111c';g.fillRect(f[0],f[1]-3,f[2]-f[0],5);g.fillRect(f[0],f[1]-14,f[2]-f[0],2);for(let x=f[0]+4;x<f[2];x+=9){g.fillRect(x,f[1]-20,2,20);g.fillRect(x-1,f[1]-23,4,3)}}for(const x of[1130,1270]){g.fillStyle='#16111c';g.fillRect(x-7,1890,14,46);g.fillStyle='#4a4a52';g.fillRect(x-5,1892,10,42);g.fillStyle='#6a6a72';g.fillRect(x-7,1884,14,8)}
g.fillStyle='rgba(12,6,16,.22)';g.fillRect(x0,y0,x1-x0,y1-y0);wl(g,'#1a1418','#4e4046');
// windows on the outer walls: dark glass, some broken
const has=(x,y,w,h)=>WL.some(q=>!q[4]&&x>=q[0]&&y>=q[1]&&x+w<=q[0]+q[2]&&y+h<=q[1]+q[3]);let wi=0;
for(let x=x0+40;x<x1-40;x+=90){for(const yy of[y0,y1])if(has(x,yy-3,30,6)){wi++;g.fillStyle='#16111c';g.fillRect(x-1,yy-4,32,8);g.fillStyle=wi%4==0?'#0a0a10':'#2a3a5a';g.fillRect(x,yy-3,30,6);g.fillStyle='rgba(200,220,255,.5)';g.fillRect(x+2,yy-2,8,1);if(wi%4==0){g.fillStyle='#8aa0c0';g.fillRect(x+6,yy-3,2,6);g.fillRect(x+18,yy-2,3,4)}}}
for(let y=y0+40;y<y1-40;y+=90)for(const xx of[x0,x1])if(has(xx-3,y,6,30)){wi++;g.fillStyle='#16111c';g.fillRect(xx-4,y-1,8,32);g.fillStyle=wi%4==0?'#0a0a10':'#2a3a5a';g.fillRect(xx-3,y,6,30)}
// portraits on the walls
const E=[];let pk=0;const pic=(x,y)=>{mnPic(g,x,y,22,28,pk%6,E);pk+=pk%7==3?2:1};
for(const x of[470,640,820,1000,1110,1300,1430,1610,1770,1930])pic(x-11,y0+8);
for(const x of[440,700,830,1000,1120,1290,1420,1620,1790,1910])if(![580,900,1200,1530,1850].some(d=>Math.abs(d-x)<50))pic(x-11,686);
for(const x of[460,560,780,1040,1350,1450,1580,1660,1860,1950])if(![650,1150,1250,1750].some(d=>Math.abs(d-x)<50))pic(x-11,756);
for(const x of[740,840,1560,1680,1840,1940])pic(x-11,796);pic(1190,796);
// cobwebs in the corners
for(const[x,y,sx]of[[x0+4,y0+4,1],[760-4,y0+4,-1],[1040+4,y0+4,1],[1360-4,y0+4,-1],[x1-4,y0+4,-1],[x0+4,794,1],[900-4,794,-1],[1500+4,794,1],[x1-4,794,-1],[x0+4,1174,1],[x1-4,1174,-1],[900-4,1174,-1],[1750+4,1174,1]])mnWeb(g,x,y,sx,1);
for(const[c,w]of[['#3e3428',44],['#5a4a38',36],['#634f3a',24]]){g.strokeStyle=c;g.lineWidth=w;g.lineCap='round';g.lineJoin='round';g.beginPath();g.moveTo(FP[0][0],FP[0][1]);for(const q of FP)g.lineTo(q[0],q[1]);g.stroke()}g.lineCap='butt';g.lineJoin='miter';
for(let i=0;i<400;i++){const x=2060+mnH(i,49)*(WW-2060),y=mnH(i,50)*600;if(((x-WW)/360)**2+(y/600)**2>1.05||fpD(x,y)<30)continue;g.fillStyle=['#4a2a4a','#2e4a34','#14100c','#3a4a2a'][i%4];g.fillRect(x,y,3+i%3,2)}
for(const t of FT2){g.fillStyle='rgba(0,0,0,.35)';g.beginPath();g.ellipse(t.x+4,t.y+2,t.r*.9,t.r*.45,0,0,7);g.fill();g.fillStyle='#0c0a10';g.fillRect(t.x-4,t.y-7,8,10);g.fillStyle='#2e2420';g.fillRect(t.x-3,t.y-7,6,9)}
// wooden arrow sign: ENCHANTED FOREST ->
{const sx=2060,sy=410;g.fillStyle='#16111c';g.fillRect(sx-4,sy-50,9,58);g.fillStyle='#5a3a22';g.fillRect(sx-3,sy-49,7,56);const bx=sx-30,by=sy-46,w=132;g.fillStyle='#16111c';g.fillRect(bx-1,by-1,w+2,18);g.beginPath();g.moveTo(bx+w+12,by+8);g.lineTo(bx+w,by-3);g.lineTo(bx+w,by+19);g.fill();g.fillStyle='#8a6a3a';g.fillRect(bx,by,w,16);g.beginPath();g.moveTo(bx+w+9,by+8);g.lineTo(bx+w,by);g.lineTo(bx+w,by+16);g.fill();g.fillStyle='#6a4a28';g.fillRect(bx,by+11,w,2);g.fillStyle='#e8d8a8';g.font='bold 10px Arial, Helvetica, sans-serif';g.textAlign='center';g.textBaseline='middle';g.fillText('ENCHANTED FOREST',bx+w/2,by+8.5);g.textAlign='left';g.textBaseline='alphabetic'}
paintDec(g,DEC);
{const C=48,cw=Math.ceil(WW/C),ch=Math.ceil(WH/C),cells=new Array(cw*ch);FT2.sort((a,b)=>a.y-b.y);for(const t of FT2){if(typeof document=='undefined'||!document.createElement)break;const sp=fsSpr(t.k,t.r,t.v),sx=Math.round(t.x-sp.width/2),sy=Math.round(t.k==2?t.y-10-sp.height+2:t.y-t.r*.7-sp.height/2);t.sp=sp;t.sx=sx;t.sy=sy;g.drawImage(sp,sx,sy);const i=Math.floor(t.x/C),j=Math.floor(t.y/C);(cells[j*cw+i]||(cells[j*cw+i]=[])).push(t)}HS.FS={C,cw,ch,cells,SH:FP.filter((_,i)=>i%6==3).map(q=>[q[0]+30,q[1]-10]),W:[]}}
for(const t of TR)vDraw(g,t.x-60,t.y-110,120,120,q=>mnTree(q,t.x,t.y,t.s,t.v));
// light sources + portrait eyes for the animation pass
const CL=[];for(const o of DEC){if(o.kn=='cdl')CL.push([o.x-7,o.y-36],[o.x-1,o.y-38],[o.x+5,o.y-36]);if(o.kn=='candle')CL.push([o.x,o.y-12]);if(o.kn=='fplace')CL.push([o.x,o.y-12,1]);if(o.kn=='mtable')CL.push([o.x-14,o.y-40],[o.x-9,o.y-42],[o.x-4,o.y-40]);if(o.kn=='lamp')CL.push([o.x,o.y-56,2])}
HS.MN={CL,E,FG:Array.from({length:14},(_,i)=>({x:mnH(i,21)*WW,y:mnH(i,22)*WH,r:90+mnH(i,23)*120,v:6+mnH(i,24)*10}))}}
// flickering candles, eyes that follow you, now and then a portrait's eyes glow red
function mnAnim(){const M=HS.MN;if(mapId!==9||!M)return;const t=performance.now()/1000,x0=cam.x-60,y0=cam.y-60,x1=cam.x+W+60,y1=cam.y+H+60;
for(const c of M.CL){if(c[0]<x0||c[0]>x1||c[1]<y0||c[1]>y1)continue;const f=.75+.25*Math.sin(t*11+c[0])*Math.sin(t*7.3+c[1]),r=c[2]==1?60:c[2]==2?40:22;X.fillStyle=c[2]==2?'#c8e0ff':'#ffb040';X.globalAlpha=.06*f;X.beginPath();X.arc(c[0],c[1],r*1.8,0,7);X.fill();X.globalAlpha=.13*f;X.beginPath();X.arc(c[0],c[1],r*.7,0,7);X.fill();X.globalAlpha=1;if(c[2]!=2){X.fillStyle='#ffe27a';X.fillRect(c[0]-1,c[1]-1-Math.round(f),2,3)}}X.globalAlpha=1;
const red=Math.floor(t/5)%M.E.length,rp=(t%5)<1.2;
for(let i=0;i<M.E.length;i++){const e=M.E[i];if(e.x<x0||e.x>x1||e.y<y0||e.y>y1)continue;const a=Math.atan2(P.y-e.y,P.x-e.x),px=Math.round(e.x+Math.cos(a)*.9-.5),py=Math.round(e.y+Math.sin(a)*.9-.5);
if(rp&&(i>>1)==(red>>1)){X.fillStyle='#ff2a1a';X.globalAlpha=.35;X.beginPath();X.arc(e.x,e.y,4,0,7);X.fill();X.globalAlpha=1;X.fillRect(px,py,2,2)}else{X.fillStyle='#16111c';X.fillRect(px,py,1,1)}}}
// drifting fog over the grounds (on top of everyone, but thin)
function mnFog(){const M=HS.MN;if(mapId!==9||!M)return;const t=performance.now()/1000;X.fillStyle='#c8d0d8';for(const f of M.FG){const x=((f.x+t*f.v)%(WW+400))-200,y=f.y+Math.sin(t*.2+f.x)*20;if(x>400&&x<2000&&y>300&&y<1500)continue;if(x<cam.x-f.r||x>cam.x+W+f.r||y<cam.y-f.r||y>cam.y+H+f.r)continue;X.globalAlpha=.07;X.beginPath();X.ellipse(x,y,f.r,f.r*.45,0,0,7);X.fill();X.globalAlpha=.05;X.beginPath();X.ellipse(x+f.r*.4,y-8,f.r*.6,f.r*.3,0,0,7);X.fill()}X.globalAlpha=1}

