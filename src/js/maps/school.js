//# maps/school.js — School map
function mapSchool(){WW=2200;WH=1800;
const x0=400,y0=360,qx=x0+660,qx2=qx+120,ha=770,hb=ha+120,x1=x0+1440,y1=hb+410,cxm=qx+60,caf=(qx2+x1)/2,hm=(ha+hb)/2;
HS={px:cxm,py:hm,cx:cxm,cy:900,nx0:x0-20,nx1:x1+20,ny0:y0-20,ny1:y1+20};
hwall(y0,x0,x1,[cxm,caf],30);hwall(y1,x0,x1,[x0+150,cxm],30);vwall(x0,y0,y1,[560,hm],30);vwall(x1,y0,y1,[hm,hb+250],30);
hwall(ha,x0,qx,[x0+110,x0+330,x0+550]);hwall(ha,qx2,x1,[x0+880,x0+1340]);hwall(hb,x0,qx,[x0+150,x0+390,x0+570]);WL.push([qx2,hb-3,30,6],[x0+1070,hb-3,30,6]);hwall(hb,x0+1100,x1,[x0+1270]);hwall(hb+250,qx2,x0+1100,[x0+880,x0+1000]);
vwall(qx,y0,ha,[]);vwall(qx2,y0,ha,[]);vwall(qx,hb,y1,[]);vwall(qx2,hb+250,y1,[]);
vwall(x0+220,y0,ha,[]);vwall(x0+440,y0,ha,[]);vwall(x0+300,hb,y1,[]);vwall(x0+480,hb,y1,[]);vwall(x0+940,hb+250,y1,[]);vwall(x0+1100,hb,y1,[]);
const LK=WL.filter(w=>(Math.abs(w[1]+3-ha)<1||Math.abs(w[1]+3-hb)<1)&&w[3]==6||(Math.abs(w[0]+3-qx)<1||Math.abs(w[0]+3-qx2)<1)&&w[2]==6&&(w[1]>=hb-1||w[1]+w[3]<=ha+1)).map(w=>w.slice());
const CT=[[qx2+20,y0+70,caf-40-qx2-20,16],[caf+40,y0+70,x1-20-caf-40,16]],SK=[[qx2+6,hb+262,16,50],[x0+946,hb+262,16,50],[x0+1100-22,hb+262,16,50],[x0+190,hb+120,100,14]];
for(const a of[...CT,...SK])WL.push([...a,1]);
for(const bx of[qx2,x0+940])for(const k of[40,80,120])WL.push([bx+k,y1-64,4,56,1]);
const DEC=[];
[x0,x0+220,x0+440].forEach((rx,r)=>{put(DEC,'tdesk',rx+110,y0+82);for(let j=0;j<3;j++)for(let i=0;i<3;i++){if((i*7+j*3+r)%5==0)continue;put(DEC,(i+j+r)%4==0?'sdeskx':'sdesk',rx+50+i*60,y0+190+j*72)}});
for(let j=0;j<3;j++)for(let i=0;i<4;i++){if((i*5+j)%6==1)continue;put(DEC,(i+j)%3==2?'sdeskx':'sdesk',x0+1155+i*75,hb+130+j*78)}put(DEC,'tdesk',x0+1270,y1-24);
for(const[i,y]of[[0,540],[1,540],[2,540],[0,660],[2,660]])put(DEC,'ctable',x0+890+i*220,y);put(DEC,'sdeskx',x0+1110,655);
put(DEC,'plant',x0+24,hb+40);put(DEC,'cabinet',x0+20,y1-12);put(DEC,'cabinet',x0+44,y1-12);put(DEC,'chair',x0+240,hb+170);put(DEC,'chair',x0+260,hb+200);
put(DEC,'tdesk',x0+390,hb+210);put(DEC,'bookshelf',x0+390,y1-6);put(DEC,'cabinet',x0+460,hb+90);put(DEC,'plant',x0+322,hb+46);
put(DEC,'couch',x0+570,y1-10);put(DEC,'vending',x0+638,hb+84);put(DEC,'rtable',x0+560,hb+200);put(DEC,'chair',x0+520,hb+200);
put(DEC,'lockerx',x0+250,ha+24);put(DEC,'lockerx',x0+1190,ha+24);put(DEC,'lockerx',cxm+30,600);put(DEC,'rubble',x0+40,620);put(DEC,'rubble',x1-40,hb+300);put(DEC,'rubble',x1-60,y0+140);put(DEC,'rubble',x0+600,y0+40);
for(let i=0;i<54;i++){const R=(k)=>{const v=Math.sin(i*12.9898+k*78.233+4.2)*43758.5453;return v-Math.floor(v)},x=x0+20+R(1)*(x1-x0-40),y=y0+20+R(2)*(y1-y0-40);if(WL.some(w=>x>w[0]-12&&x<w[0]+w[2]+12&&y>w[1]-6&&y<w[1]+w[3]+16))continue;put(DEC,R(3)<.5?'tile':'paper',x,y)}
const LY=y1+60,LX0=480,LX1=1760,BX=1450;
put(DEC,'bus',780,LY+250);for(const y of[LY+80,LY+180,LY+280])put(DEC,'bus2',1600,y);
put(DEC,'flagpole',cxm+90,y1+70);put(DEC,'swing',2050,560);put(DEC,'jgym',2050,750);put(DEC,'slide',2040,930);put(DEC,'hoop',200,500);put(DEC,'hoop',200,1110);
schOut(DEC);const KO=[[x0-40,y0-40,x1+40,y1+60],[LX0,LY,LX1,LY+340],[6,416,394,1164],[1890,420,2190,980],[cxm-40,y1,cxm+40,LY+10],[0,1688,WW,WH],[1960,1590,2160,1720],[0,0,WW,340]];
DEC.push(...scatter(4,[['tuft',5],['rock',2],['bush',2],['dead',2],['can',1],['tire',1],['cone',1],['paper',2],['stump',1]],90,KO));DEC.ko=KO;
SM=[{x:900,y:LY+200},{x:x0+1340,y:y0+40}];
grid();
const g=ground('#6a7a42','#64743d','#71824a','#4f5f32');
schWalk(g);g.fillStyle='#45484e';g.fillRect(LX0,LY,LX1-LX0,340);g.fillStyle='rgba(225,225,215,.45)';for(let x=520;x<BX-20;x+=70){g.fillRect(x,LY+20,3,90);g.fillRect(x,LY+240,3,90)}
for(let k=0;k<4;k++)g.fillRect(BX,LY+8+k*100,LX1-BX-10,3);g.fillRect(BX,LY+8,3,303);
g.fillStyle='#9a978c';g.fillRect(cxm-30,y1,60,60);g.fillRect(LX0,y1+40,LX1-LX0,20);
g.fillStyle='#4a4d53';g.fillRect(30,440,340,700);g.fillStyle='rgba(235,235,225,.6)';g.fillRect(40,450,320,3);g.fillRect(40,1127,320,3);g.fillRect(40,450,3,680);g.fillRect(357,450,3,680);g.fillRect(40,788,320,3);g.strokeStyle='rgba(235,235,225,.6)';g.lineWidth=3;g.beginPath();g.arc(200,790,50,0,7);g.stroke();g.beginPath();g.arc(200,450,80,0,3.14);g.stroke();g.beginPath();g.arc(200,1130,80,3.14,6.28);g.stroke();
schSand(g);
for(let i=0;i<16;i++)crack(g,520+(i*173)%1200,LY+20+(i*71)%300,9);
chk(g,x0,ha,x1-x0,hb-ha,'#bdb9a9','#b1ad9d');chk(g,qx,y0,qx2-qx,y1-y0,'#bdb9a9','#b1ad9d');
for(const rx of[x0,x0+220,x0+440])chk(g,rx,y0,220,ha-y0,'#c8b98f','#bfb085');chk(g,x0+1100,hb,340,y1-hb,'#c8b98f','#bfb085');
chk(g,qx2,y0,x1-qx2,ha-y0,'#d9d3c3','#b54a3e');chk(g,qx2,y0,x1-qx2,70,'#c8c4b8','#b8b4a8');
chk(g,x0,hb,300,y1-hb,'#5f6f86','#596880');chk(g,x0+300,hb,180,y1-hb,'#7a3b3b','#703535');chk(g,x0+480,hb,180,y1-hb,'#8a8270','#807866');
chk(g,qx2,hb,320,250,'#d6cfbf','#cbc3b1');chk(g,qx2,hb+250,160,y1-hb-250,'#cfe3ea','#bcd5de');chk(g,x0+940,hb+250,160,y1-hb-250,'#e3d5ea','#d5c4de');
for(let i=0;i<38;i++){const x=x0+30+(i*397)%(x1-x0-60),y=y0+30+(i*233)%(y1-y0-60);g.fillStyle=i%3?'rgba(70,58,36,.22)':'rgba(30,26,20,.3)';g.beginPath();g.ellipse(x,y,14+i%4*8,8+i%3*5,i,0,7);g.fill();crack(g,x,y,6+i%5)}
for(const[x,y]of[[x0+120,y0+300],[qx+60,620],[x0+1540,hb+330],[x0+1290,700],[x0+300,hm]]){g.fillStyle='#3f5a2a';for(let k=0;k<7;k++)g.fillRect(x+(k*7)%22-10,y+(k*5)%12,3,6)}
g.fillStyle='rgba(20,16,12,.65)';g.beginPath();g.ellipse(x0+1440-60,y0+250,30,16,0,0,7);g.fill();g.fillStyle='rgba(74,144,200,.35)';g.beginPath();g.ellipse(x0+840,y1-80,40,18,0,0,7);g.fill();
for(const w of LK){if(w[3]==6){const top=Math.abs(w[1]+3-ha)<1;lockers(g,w[0],top?w[1]+6:w[1]-12,w[2],12,0)}else{const lf=Math.abs(w[0]+3-qx)<1;lockers(g,lf?w[0]+6:w[0]-12,w[1],12,w[3],1)}}
for(const rx of[x0,x0+220,x0+440]){g.fillStyle='#16111c';g.fillRect(rx+28,y0+4,164,12);g.fillStyle='#2f5a3a';g.fillRect(rx+30,y0+5,160,10);g.fillStyle='rgba(235,235,225,.6)';g.fillRect(rx+50,y0+8,40,1);g.fillRect(rx+100,y0+10,60,1)}
g.fillStyle='#16111c';g.fillRect(x0+1128,y1-16,284,12);g.fillStyle='#2f5a3a';g.fillRect(x0+1130,y1-15,280,10);
g.fillStyle='#8a909c';for(const a of CT)g.fillRect(a[0],a[1],a[2],a[3]);g.fillStyle='#b8bcc4';for(const a of CT)g.fillRect(a[0],a[1],a[2],4);g.fillStyle='#3a3d46';for(let x=qx2+30;x<x1-30;x+=60)g.fillRect(x,y0+12,36,30);g.fillStyle='#d8d4c8';for(let x=qx2+36;x<x1-30;x+=120)g.fillRect(x,y0+14,24,10);
g.fillStyle='#7a5232';g.fillRect(x0+190,hb+120,100,14);g.fillStyle='#9a6a3c';g.fillRect(x0+190,hb+120,100,4);
for(const bx of[qx2,x0+940]){g.fillStyle='#e8e8e4';g.fillRect(bx+6,hb+262,16,50);g.fillStyle='#8fc3e8';g.fillRect(bx+9,hb+270,10,8);g.fillRect(bx+9,hb+292,10,8);g.fillStyle='#8a909c';for(const k of[40,80,120])g.fillRect(bx+k,y1-64,4,56);g.fillStyle='#fff';for(const k of[60,100,140]){g.fillRect(bx+k-7,y1-30,14,14);g.fillStyle='#dfe6ea';g.fillRect(bx+k-5,y1-44,10,10);g.fillStyle='#fff'}}
g.fillStyle='#8a909c';g.fillRect(x0+1100-22,hb+262,16,50);g.fillStyle='#fff';g.fillRect(x0+1100-19,hb+270,10,12);g.fillRect(x0+1100-19,hb+292,10,12);
wl(g,'#2e2a26','#a89c86');
g.fillStyle='rgba(30,24,18,.6)';for(const[x,y]of[[x0,532],[x1-6,hb+222],[x0+600,y0-3],[x1-60,y0+120]])g.fillRect(x,y,6,8);
schDeco(g);sign(g,cxm,y1+18,'ZOMBDASH SCHOOL',150);
paintDec(g,DEC);schTop(g,DEC)}
