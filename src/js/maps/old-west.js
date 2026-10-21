//# maps/old-west.js — Old West map
function mapWest(){WW=2200;WH=1800;
const box=(b,t=[],bo=[],l=[],r=[],hw)=>{hwall(b[1],b[0],b[2],t,hw);hwall(b[3],b[0],b[2],bo,hw);vwall(b[0],b[1],b[3],l,hw);vwall(b[2],b[1],b[3],r,hw)};
const CHU=[120,360,440,780],ST=[520,520,780,780],TV=[860,440,1300,780],SH=[1380,520,1640,780],BK=[1720,540,2000,780],HA=[140,1040,440,1320],SB=[540,1040,1000,1360],BS=[1080,1040,1340,1260],DR=[1420,1040,1640,1260],HB=[1720,1040,2020,1320];
HS={px:1080,py:910,cx:1080,cy:860,nx0:0,nx1:0,ny0:0,ny1:0};
const w0=WL.length;box(CHU,[],[280],[],[470],30);const w1=WL.length;
box(ST,[],[650]);box(TV,[1240],[1080],[],[],32);vwall(1160,440,600,[]);hwall(600,1160,1300,[1230]);
box(SH,[],[1460]);hwall(650,1530,1640,[]);box(BK,[],[1860]);
box(HA,[290],[220]);vwall(300,1040,1320,[1180]);box(SB,[770],[770],[],[],40);box(BS,[1210],[],[],[],70);box(DR,[1530],[]);box(HB,[1870],[],[],[1250]);hwall(1180,1720,2020,[1800]);
const BAR=[];fv(BAR,1530,520,780,[585,715],24);WL.push(...BAR);
const SOL=[[240,400,100,24],[880,494,240,16],[560,600,120,14],[1730,640,90,14],[1890,640,100,14],[240,300,80,60]];for(const a of SOL)WL.push([...a,1]);
for(const x of[600,660,720,820,880,940])WL.push([x,1262,6,96,1]);
const DEC=[];
for(let k=0;k<5;k++){put(DEC,'pew',190,520+k*50);put(DEC,'pew',370,520+k*50)}put(DEC,'candle',220,440);put(DEC,'candle',340,440);
for(const[x,y]of[[150,180],[210,230],[270,170],[360,240],[420,190],[180,300],[400,310]])put(DEC,'cross',x,y);
put(DEC,'wshelf',590,560);put(DEC,'wshelf',700,560);put(DEC,'barrel',545,740);put(DEC,'barrel',567,750);put(DEC,'crate',750,740);put(DEC,'crate',600,700);
for(const[x,y]of[[950,620],[1060,690],[1190,690],[940,730],[1120,620]])put(DEC,'rtable',x,y);for(const x of[900,940,980,1020,1060,1100])put(DEC,'stool',x,530);put(DEC,'piano',1240,764);
put(DEC,'crate',1190,500);put(DEC,'crate',1270,520);put(DEC,'barrel',1200,580);put(DEC,'barrel',1280,585);
put(DEC,'wtable',1450,620);put(DEC,'cabinet',1400,580);put(DEC,'stool',1450,650);put(DEC,'bed',1590,630);put(DEC,'bed',1590,770);
put(DEC,'safe',1950,590);put(DEC,'wtable',1800,740);put(DEC,'cabinet',1750,590);
put(DEC,'stove',190,1100);put(DEC,'wtable',220,1220);put(DEC,'bed',380,1170);put(DEC,'barrel',170,1300);
for(const[x,y]of[[580,1120],[580,1160],[612,1140],[960,1110],[960,1150],[650,1330],[850,1330],[950,1330]])put(DEC,'hay',x,y);put(DEC,'trough',690,1200);put(DEC,'trough',870,1200);
put(DEC,'forge',1150,1120);put(DEC,'anvil',1240,1160);put(DEC,'barrel',1310,1230);put(DEC,'crate',1110,1240);
put(DEC,'bed',1460,1140);put(DEC,'bed',1460,1240);put(DEC,'cabinet',1620,1080);put(DEC,'wtable',1590,1220);
put(DEC,'wtable',1800,1120);put(DEC,'stove',1990,1100);put(DEC,'bed',1760,1290);put(DEC,'bed',1980,1290);
for(const x of[640,1000,1180,1500])put(DEC,'hitch',x,846);for(const x of[300,880,1530])put(DEC,'hitch',x,996);put(DEC,'trough',820,846);put(DEC,'trough',1200,996);
put(DEC,'wagon',1300,968);put(DEC,'well',700,380);put(DEC,'wtower',1860,470);
for(const[x,y]of[[1040,380],[1120,370],[540,450],[2080,900],[60,900]])put(DEC,'barrel',x,y);
const KO=[[100,140,2040,815],[100,1000,2040,1380],[0,815,WW,1005],[0,1580,WW,1680]];
DEC.push(...scatter(5,[['cactus',3],['tumble',2],['rock',3],['skull',1],['barrel',1],['crate',1],['wfence',2],['dead',1]],70,KO));DEC.ko=KO;
for(const x of[60,2120])for(let y=200;y<1500;y+=260)put(DEC,'cactus',x,y);
SM=[{x:1158,y:1080},{x:200,y:1060},{x:1990,y:1058}];
grid();
const g=ground('#c9a46a','#c29d63','#cfab72');
g.fillStyle='#b08856';g.fillRect(0,815,WW,190);g.fillStyle='rgba(90,60,30,.25)';g.fillRect(0,870,WW,6);g.fillRect(0,940,WW,6);for(let i=0;i<90;i++){g.fillStyle='rgba(90,60,30,.25)';g.fillRect((i*97)%WW,830+(i*37)%160,5,3)}
for(const[y,h]of[[780,35],[1005,35]]){g.fillStyle='#9a6a3c';g.fillRect(100,y,1940,h);g.fillStyle='#7a5232';for(let x=100;x<2040;x+=18)g.fillRect(x,y,2,h);g.fillStyle='#5a3a22';g.fillRect(100,y+(y<900?h-3:0),1940,3)}
g.fillStyle='#6a5a4a';g.fillRect(0,1600,WW,40);g.fillStyle='#5a3a22';for(let x=0;x<WW;x+=22)g.fillRect(x,1596,10,48);g.fillStyle='#8a909c';g.fillRect(0,1606,WW,4);g.fillRect(0,1630,WW,4);
for(const b of[CHU,ST,TV,SH,BK,HA,SB,BS,DR,HB])chk(g,b[0],b[1],b[2]-b[0],b[3]-b[1],'#8a5a32','#7d5230');
g.fillStyle='#8a2a2a';g.fillRect(256,430,48,350);g.fillStyle='#a8863a';g.fillRect(256,430,2,350);g.fillRect(302,430,2,350);
g.fillStyle='#e8e0c8';g.fillRect(240,400,100,24);g.fillStyle='#c8b070';g.fillRect(240,400,100,4);g.fillStyle='#a8863a';g.fillRect(287,368,6,26);g.fillRect(280,374,20,5);
g.fillStyle='#6a4a2a';g.fillRect(240,300,80,60);g.fillStyle='#4a3218';g.fillRect(240,300,80,8);g.fillStyle='#16111c';g.fillRect(266,316,28,30);g.fillStyle='#c8a03a';g.fillRect(270,322,20,18);g.fillStyle='#8a6a2a';g.fillRect(278,340,4,4);
g.fillStyle='#5a3a22';g.fillRect(880,446,240,14);g.fillStyle='#3a6a3a';for(let x=886;x<1116;x+=10)g.fillRect(x,447,3,8);g.fillStyle='#a8863a';for(let x=890;x<1116;x+=22)g.fillRect(x,448,3,6);
g.fillStyle='#6b4a2a';g.fillRect(880,494,240,16);g.fillStyle='#8a5f36';g.fillRect(880,494,240,4);
g.fillStyle='#6b4a2a';g.fillRect(560,600,120,14);g.fillRect(1730,640,90,14);g.fillRect(1890,640,100,14);g.fillStyle='#8a5f36';g.fillRect(560,600,120,4);g.fillRect(1730,640,90,4);g.fillRect(1890,640,100,4);
g.fillStyle='#3a3d46';for(let x=1734;x<1990;x+=8)if(x<1820||x>1890)g.fillRect(x,628,2,12);
for(const x of[600,660,720,820,880,940]){g.fillStyle='#5a3a22';g.fillRect(x,1262,6,96);g.fillStyle='#7a5232';g.fillRect(x,1262,6,4)}
g.fillStyle='rgba(216,176,74,.5)';for(let i=0;i<70;i++)g.fillRect(560+(i*67)%420,1270+(i*29)%80,5,2);
g.fillStyle='rgba(20,16,12,.3)';g.fillRect(1090,1050,240,8);g.fillStyle='#8a909c';for(const x of[1100,1120,1140])g.fillRect(x,1052,3,10);
for(let i=0;i<24;i++){const b=[CHU,ST,TV,SH,BK,HA,SB,BS,DR,HB][i%10];crack(g,b[0]+20+(i*53)%(b[2]-b[0]-40),b[1]+20+(i*31)%(b[3]-b[1]-40),5,'rgba(40,24,12,.5)')}
wl(g,'#2a1a10','#7a5232');for(let i=w0;i<w1;i++){const w=WL[i];g.fillStyle='#d8d0bc';g.fillRect(w[0]+1,w[1]+1,Math.max(0,w[2]-2),Math.max(0,w[3]-2))}
for(const f of BAR){g.fillStyle='#3a3d46';if(f[3]>f[2])for(let y=f[1];y<f[1]+f[3];y+=6)g.fillRect(f[0],y,4,3);}g.fillStyle='#2a2c32';for(const f of BAR)g.fillRect(f[0]+1,f[1],2,f[3]);
sign(g,280,788,'CHURCH',70);sign(g,650,788,'GENERAL STORE',120);sign(g,1080,788,'SALOON',80);sign(g,1510,788,'SHERIFF',80);sign(g,1860,788,'BANK',60);
sign(g,290,1012,'HOME',50);sign(g,770,1012,'STABLES',80);sign(g,1210,1012,'SMITHY',70);sign(g,1530,1012,'DOCTOR',70);sign(g,1870,1012,'HOUSE',60);
paintDec(g,DEC)}
Object.assign(OB,{
cbus:ob(256,90,[236,44],q=>{R_(q,'#e8e8e4',4,12,246,60);R_(q,'#f6f6f2',4,12,246,8);R_(q,'#2f6fd0',4,48,246,8);R_(q,'#1f4f9a',4,56,246,2);for(let i=0;i<9;i++){R_(q,'#2a3a4a',22+i*24,26,18,16);R_(q,'#5a7a92',23+i*24,27,6,5)}R_(q,'#2a3a4a',6,26,12,30);R_(q,'#16111c',236,26,12,26);R_(q,'#e8e8c0',242,58,6,6);R_(q,'#d83a3a',4,58,4,6);R_(q,'#8a4a22',120,20,18,6);R_(q,'#16111c',34,68,28,18);R_(q,'#16111c',190,68,28,18);R_(q,'#6a6f7a',41,72,14,9);R_(q,'#6a6f7a',197,72,14,9)}),
truck:ob(164,80,[150,36],q=>{R_(q,'#e8e8e4',4,6,110,56);R_(q,'#c8ccd4',4,6,110,6);R_(q,'#c8ccd4',4,56,110,4);for(let x=20;x<110;x+=22)R_(q,'#d8dce4',x,12,2,44);R_(q,'#c0392b',116,22,40,40);R_(q,'#a82a2a',116,22,40,6);R_(q,'#8fc3e8',136,28,16,14);R_(q,'#3a3d46',114,60,44,4);R_(q,'#e8e8c0',154,50,4,6);R_(q,'#16111c',16,60,26,16);R_(q,'#16111c',76,60,26,16);R_(q,'#16111c',126,60,26,16);R_(q,'#6a6f7a',23,64,12,8);R_(q,'#6a6f7a',83,64,12,8);R_(q,'#6a6f7a',133,64,12,8)}),
shed:ob(96,70,[88,40],q=>{R_(q,'#e8e4d8',6,26,84,40);R_(q,'#c8c4b8',6,62,84,4);q.fillStyle='#7a5a4a';q.beginPath();q.moveTo(2,28);q.lineTo(48,4);q.lineTo(94,28);q.fill();R_(q,'#5a3a2a',2,26,92,4);R_(q,'#6b4a2a',38,40,20,26);R_(q,'#e0b030',53,52,3,3);R_(q,'#8fc3e8',14,36,14,12);R_(q,'#8fc3e8',68,36,14,12)}),
tramp:ob(96,60,[14,6],q=>{q.fillStyle='#3a3d46';q.beginPath();q.ellipse(48,22,44,18,0,0,7);q.fill();q.fillStyle='#26262c';q.beginPath();q.ellipse(48,22,36,13,0,0,7);q.fill();q.strokeStyle='#2f6fd0';q.lineWidth=3;q.beginPath();q.ellipse(48,22,42,16,0,0,7);q.stroke();for(const x of[10,30,66,86])R_(q,'#6a6f7a',x,32,3,24)}),
hedge:ob(70,26,[64,12],q=>{R_(q,'#2f6b34',3,6,64,18);R_(q,'#3f8a42',5,4,60,8);for(let x=8;x<64;x+=10)R_(q,'#52a851',x,5,4,3);R_(q,'#255a2c',3,20,64,4)})});
Object.assign(OB,{
fbed:ob(88,30,[80,12],q=>{R_(q,'#6b4a2a',3,6,82,20);R_(q,'#3a2416',6,9,76,14);const C=['#ff6a8a','#ffd84a','#ffffff','#9a7aff','#ff8a3a'];for(let i=0;i<13;i++){const x=9+i*6,y=10+(i*5)%9;R_(q,'#3f8a3a',x+1,y+2,1,4);R_(q,C[i%5],x,y,3,3)}R_(q,'#8a5f36',3,6,82,3)}),
sbag:ob(46,24,[40,12],q=>{for(let r=0;r<2;r++)for(let i=0;i<3-r;i++){R_(q,'#b8a77a',5+i*13+r*6,12-r*7,13,8);R_(q,'#9a8a62',5+i*13+r*6,18-r*7,13,2)}})});
