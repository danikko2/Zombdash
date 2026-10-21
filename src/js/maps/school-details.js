//# maps/school-details.js — School extra detail and walk-behind objects
// ---------- School: walk-behind objects, sidewalks, roads, commons, extra detail ----------
// (functions only: these run while the map is built at boot, so no top-level const/let here)
function schH(i,k){const v=Math.sin(i*12.9898+k*78.233+5.7)*43758.5453;return v-Math.floor(v)}
// outdoor + commons objects, trees and the sign post (runs before grid() so they block movement)
function schOut(D){const x0=400,y0=360,qx2=1180,hb=890,y1=1300,cxm=1120;
// commons: round tables with chairs, planters, trophy case between the bathroom doors
for(const[x,y]of[[1250,978],[1430,978],[1250,1088],[1430,1088]]){put(D,'rtable',x,y);put(D,'chair',x-27,y-4);put(D,'chair',x+27,y-4)}
put(D,'planter',qx2+22,hb+44);put(D,'planter',x0+1078,hb+44);put(D,'trophy',1340,hb+247);
put(D,'plant',qx2-104,y1-8);put(D,'plant',qx2-16,y1-8);
// hallway water fountains, cafeteria trash cans
put(D,'fount',x0+460,hb-3);put(D,'fount',x0+1160,794);put(D,'can',1230,744);put(D,'can',1790,744);
// out front: bike rack, benches, trash cans, planters
put(D,'bike',980,1352);put(D,'bench',700,1354);put(D,'bench',1500,1354);put(D,'can',652,1352);put(D,'can',1548,1352);
for(const x of[640,820,1380,1620,1780])put(D,'planter',x,1332);
// playground picnic area, lot lights, hedge row between the lot and the road
put(D,'picnic',1960,1068);put(D,'picnic',2110,1068);put(D,'can',2035,1050);
for(const[x,y]of[[466,1376],[1774,1376],[466,1698],[1774,1698]])put(D,'lamp',x,y);
for(let i=0;i<10;i++)put(D,'hedge',745+i*76,1714);
// shade trees on the lawns (solid trunks, like the suburb forest)
const T=[[100,1290,0],[300,1380,1],[150,1570,0],[1960,1250,0],[2140,1340,1],[2150,1500,0]];
HS.TR=T.map(([x,y,pn],i)=>{WL.push([x-6,y-6,12,12,2]);return{x,y,pine:pn,r:pn?20+Math.round(schH(i,1)*4):22+Math.round(schH(i,2)*6),v:schH(i,3)}});
// thick woods behind the school (solid trunks, dirt floor), with a fountain plaza behind the center doors
HS.WD=1;let n=0;for(let gy=8;gy<330;gy+=38)for(let gx=8;gx<2200;gx+=38){n++;const x=gx+(schH(n,11)-.5)*26,y=gy+(schH(n,12)-.5)*26;if(y>schWB(x)-16||Math.hypot(x-1120,y-190)<174)continue;
const pine=schH(n,13)<.4;HS.TR.push({x,y,pine:pine?1:0,r:Math.round(pine?13+schH(n,14)*5:16+schH(n,14)*8),v:schH(n,15)});WL.push([x-6,y-6,12,12,2])}
put(D,'fntn',1120,234);put(D,'bench',1120,72);put(D,'bench',986,200);put(D,'bench',1254,200);
for(const[x,y]of[[1046,128],[1194,128],[1040,272],[1200,272]])put(D,'lamp',x,y);
HS.sp2=[[-20,520],[-20,900],[-20,1300],[-20,1650],[2220,560],[2220,1000],[2220,1400],[2220,1750],[300,1820],[1100,1820],[1900,1820]];
// road sign post
WL.push([2056,1704,8,8,2]);
// cafeteria + picnic tables are fully solid: you bump into the whole table, not just its legs
for(const o of D)if(o.kn=='ctable'||o.kn=='picnic'){const b=OB[o.kn],c=b.c,w=WL.find(q=>q[4]==1&&q[0]==o.x-c[0]/2&&q[1]==o.y-c[1]&&q[2]==c[0]&&q[3]==c[1]);if(w){w[0]=o.x-b.w/2+2;w[1]=o.y-b.h-6;w[2]=b.w-4;w[3]=b.h+12}}}
// bottom edge of the woods, and whether a point is in them (zombies don't spawn in there)
function schWB(x){return 282+16*Math.sin(x/97)+11*Math.sin(x/41+1)}
function schWd(x,y){if(mapId===11)return y<230;return mapId===3&&!!HS.WD&&y<schWB(x)+20&&Math.hypot(x-1120,y-190)>165}
// playground sand with a ragged edge that thins out into the grass
function schSand(g){const x0=1890,y0=420,x1=2190,y1=980,S=['#c9b48a','#c4ae84','#cdb990'];g.save();g.beginPath();g.rect(1880,0,400,2000);g.clip();
g.fillStyle=S[0];g.fillRect(x0+14,y0+14,x1-x0-28,y1-y0-28);
const per=[];for(let x=x0;x<=x1;x+=9){per.push([x,y0]);per.push([x,y1])}for(let y=y0;y<=y1;y+=9){per.push([x0,y]);per.push([x1,y])}
per.forEach(([x,y],i)=>{const r=8+schH(i,31)*16;g.fillStyle=S[0];g.beginPath();g.ellipse(x+(schH(i,32)-.5)*20,y+(schH(i,33)-.5)*20,r,r*.8,0,0,7);g.fill()});
for(let i=0;i<9000;i++){const x=x0-46+schH(i,34)*(x1-x0+92),y=y0-46+schH(i,35)*(y1-y0+92),dx=Math.max(x0-x,0,x-x1),dy=Math.max(y0-y,0,y-y1),d=Math.hypot(dx,dy),din=Math.min(x-x0,x1-x,y-y0,y1-y),k=schH(i,36);
if(d>0){if(k<Math.pow(1-d/46,1.6)*.8){g.fillStyle=S[i%3];g.globalAlpha=.45+.5*(1-d/46);g.fillRect(x,y,2+(i%3),2+(i%2));g.globalAlpha=1}}
else if(din<26&&k<(1-din/26)*.22){g.fillStyle=i%2?'#6a7a42':'#5f6f3b';g.fillRect(x,y,2,3+(i%3))}}
g.fillStyle='#b8a47a';for(let i=0;i<90;i++)g.fillRect(x0+20+(i*53)%260,y0+20+(i*37)%520,4,2);g.restore()}
// fountain water: a little arcing spray and ripples (drawn each frame, under the zombies and players)
function schAnim(){if(mapId!==3||!HS.WD)return;const t=performance.now()/1000,x=1120,top=234-86;
X.strokeStyle='rgba(220,240,255,.55)';X.lineWidth=1;for(let i=0;i<2;i++){const p=(t*.6+i*.5)%1;X.globalAlpha=1-p;X.beginPath();X.ellipse(x,top+61,12+p*26,4+p*10,0,0,7);X.stroke()}X.globalAlpha=1;
X.fillStyle='#d8eeff';for(let i=0;i<12;i++){const p=(t*1.1+i/12)%1,s=i%2?1:-1,a=(i%6)/6,dx=s*(4+a*14)*p,dy=-16*Math.sin(p*Math.PI)+p*(14+a*8);X.fillRect(Math.round(x+dx),Math.round(top+12+dy),2,2)}}
// sidewalks and the southern road (painted under everything else)
function schWalk(g){const x0=400,y0=360,x1=1840,LY=1360,WW_=2200,ry=1716,rh=72;
const pave=(x,y,w,h)=>{g.fillStyle='#7e7b70';g.fillRect(x-2,y-2,w+4,h+4);g.fillStyle='#a6a396';g.fillRect(x,y,w,h);g.fillStyle='#928f83';for(let i=32;i<w;i+=32)g.fillRect(x+i,y,1,h);for(let j=32;j<h;j+=32)g.fillRect(x,y+j,w,1);g.fillStyle='rgba(255,255,255,.12)';g.fillRect(x,y,w,2)};
pave(x0-36,y0-36,x1-x0+72,LY-y0+36);pave(6,416,388,748);schWood(g);schPlaza(g);
// road: in from the left into the lot, and out of the lot to the right
const road=(x,w)=>{g.fillStyle='#2f3237';g.fillRect(x,ry-3,w,rh+6);g.fillStyle='#3e4147';g.fillRect(x,ry,w,rh)};
road(0,700);road(1540,WW_-1540);g.fillStyle='#3e4147';g.fillRect(560,1690,140,ry-1690+2);g.fillRect(1540,1690,140,ry-1690+2);
for(let i=0;i<30;i++){g.fillStyle='rgba(0,0,0,.18)';g.fillRect((i*137)%2200,ry+6+(i*29)%60,10+i%4*6,2)}
g.fillStyle='#8e8b7e';g.fillRect(0,ry-3,560,3);g.fillRect(1680,ry-3,WW_-1680,3);g.fillRect(0,ry+rh,700,3);g.fillRect(1540,ry+rh,WW_-1540,3);g.fillRect(700,ry-3,3,rh+6);g.fillRect(1537,ry-3,3,rh+6);
g.fillStyle='#e0b030';for(let x=8;x<560;x+=40)g.fillRect(x,ry+rh/2-2,22,3);for(let x=1690;x<WW_;x+=40)g.fillRect(x,ry+rh/2-2,22,3);
g.fillStyle='rgba(235,235,225,.75)';g.fillRect(0,ry+4,560,2);g.fillRect(0,ry+rh-6,700,2);g.fillRect(1680,ry+4,WW_-1680,2);g.fillRect(1540,ry+rh-6,WW_-1540,2);
}
// forest floor: dirt and leaf litter, a fringe at the edge so it doesn't stop on a ruler line
function schWood(g){for(let y=0;y<340;y+=8)for(let x=0;x<2200;x+=8){const cx=x+4,cy=y+4;if(cy>schWB(cx)||Math.hypot(cx-1120,cy-190)<158)continue;const h=schH(x*.37+y*1.7,7);g.fillStyle=h<.33?'#5e4830':h<.66?'#6b5236':'#654d33';g.fillRect(x,y,8,8)}
for(let x=0;x<2200;x+=6){const t=schWB(x+3);if(Math.hypot(x-1120,t-190)<160)continue;g.fillStyle='#5e4830';g.fillRect(x,t-2,6,3+schH(x,8)*6);g.fillStyle='#3a8a38';if(schH(x,10)<.4)g.fillRect(x+1,t+5,2,4)}
for(let i=0;i<2200;i++){const x=schH(i,12)*2200,y=schH(i,13)*330;if(y>schWB(x)-4||Math.hypot(x-1120,y-190)<160)continue;const k=schH(i,14);
if(k<.45){g.fillStyle=['#8a6a3a','#a0743a','#7a4a2a','#b08a4a'][i%4];g.fillRect(x,y,3,2)}else if(k<.6){g.fillStyle='#3e2e1e';g.fillRect(x,y,7,1)}else if(k<.75){g.fillStyle='#4f6a30';g.fillRect(x,y,4,3)}else if(k<.82){g.fillStyle='#16111c';g.fillRect(x-1,y-1,6,5);g.fillStyle='#8a8a84';g.fillRect(x,y,4,3)}else if(k<.84){g.fillStyle='#e8e0d0';g.fillRect(x,y+2,2,3);g.fillStyle='#c0392b';g.fillRect(x-1,y,4,2)}}}
// fountain plaza: round paver court, flower beds, a stone border; opens south onto the back doors
function schPlaza(g){const cx=1120,cy=190,R=150,C=(c,r)=>{g.fillStyle=c;g.beginPath();g.arc(cx,cy,r,0,7);g.fill()};
C('#4a7a34',R+8);C('#5a564c',R+1);C('#c4bcaa',R-3);g.strokeStyle='#aaa292';g.lineWidth=1;for(let r=24;r<R-4;r+=18){g.beginPath();g.arc(cx,cy,r,0,7);g.stroke()}
for(let a=0;a<360;a+=12){const t=a*Math.PI/180;g.beginPath();g.moveTo(cx+Math.cos(t)*60,cy+Math.sin(t)*60);g.lineTo(cx+Math.cos(t)*(R-4),cy+Math.sin(t)*(R-4));g.stroke()}
g.strokeStyle='#8a8272';g.lineWidth=3;g.beginPath();g.arc(cx,cy,62,0,7);g.stroke();g.beginPath();g.arc(cx,cy,R-24,0,7);g.stroke();
// four flower beds, gaps north/south/east/west for the paths and benches
for(const[a0,a1]of[[20,70],[110,160],[200,250],[290,340]]){const t0=a0*Math.PI/180,t1=a1*Math.PI/180;g.fillStyle='#16111c';g.beginPath();g.arc(cx,cy,R-4,t0-.02,t1+.02);g.arc(cx,cy,R-30,t1+.02,t0-.02,true);g.closePath();g.fill();
g.fillStyle='#5a3a22';g.beginPath();g.arc(cx,cy,R-6,t0,t1);g.arc(cx,cy,R-28,t1,t0,true);g.closePath();g.fill();
for(let k=0;k<18;k++){const t=t0+(t1-t0)*(k+.5)/18,r=R-17+(k%2?5:-5),x=cx+Math.cos(t)*r,y=cy+Math.sin(t)*r;g.fillStyle=k%3?'#2f6d2e':'#3f8a3a';g.beginPath();g.arc(x,y,5,0,7);g.fill();g.fillStyle=['#ff6a8a','#ffd84a','#fff','#9a7aff','#ff8a3a'][(k+a0)%5];g.fillRect(x-1,y-2,3,3)}}
// paver path down to the back doors
g.fillStyle='#5a564c';g.fillRect(cx-32,cy+R-10,64,360-cy-R+10);g.fillStyle='#c4bcaa';g.fillRect(cx-30,cy+R-12,60,360-cy-R+12);g.fillStyle='#aaa292';for(let y=cy+R;y<360;y+=12)g.fillRect(cx-30,y,60,1)}
// inside detail: windows, hall stripes, crests, rugs, cubbies, clocks, banners
function schDeco(g){const x0=400,y0=360,qx=1060,qx2=1180,ha=770,hb=890,x1=1840,y1=1300,cxm=1120,hm=830;
const R=(c,x,y,w,h)=>{g.fillStyle=c;g.fillRect(x,y,w,h)},has=(x,y,w,h)=>WL.some(q=>!q[4]&&x>=q[0]&&y>=q[1]&&x+w<=q[0]+q[2]&&y+h<=q[1]+q[3]),VX=[x0+220,x0+300,x0+440,x0+480,qx,qx2,x0+940,x0+1100],HY=[ha,hb,hb+250];
// windows along the outside walls
const win=(x,y,w,h)=>{R('#16111c',x-1,y-1,w+2,h+2);R('#7fb4d8',x,y,w,h);R('#d8f0ff',x+1,y+1,w>h?8:2,w>h?2:8)};
for(let x=x0+30;x<x1-40;x+=70){if(VX.some(v=>Math.abs(v-x-13)<30))continue;if(has(x,y0-3,26,6))win(x,y0-3,26,6);if(has(x,y1-3,26,6))win(x,y1-3,26,6)}
for(let y=y0+30;y<y1-40;y+=70){if(HY.some(v=>Math.abs(v-y-13)<30))continue;if(has(x0-3,y,6,26))win(x0-3,y,6,26);if(has(x1-3,y,6,26))win(x1-3,y,6,26)}
// school-color stripes down the halls
R('rgba(122,40,40,.5)',x0+10,hm-7,x1-x0-20,3);R('rgba(216,170,50,.5)',x0+10,hm+4,x1-x0-20,3);R('rgba(122,40,40,.5)',cxm-7,y0+10,3,y1-y0-20);R('rgba(216,170,50,.5)',cxm+4,y0+10,3,y1-y0-20);
// crest where the halls cross, and a bigger one in the commons
const crest=(x,y,r,sm)=>{g.fillStyle='#16111c';g.beginPath();g.arc(x,y,r+2,0,7);g.fill();g.fillStyle='#d8aa32';g.beginPath();g.arc(x,y,r,0,7);g.fill();g.fillStyle='#7a2828';g.beginPath();g.arc(x,y,r-6,0,7);g.fill();
g.fillStyle='#d8aa32';g.textAlign='center';g.textBaseline='middle';g.font='bold '+Math.round(r*.95)+'px Arial, Helvetica, sans-serif';g.fillText('Z',x,y+1);if(sm){g.font='bold 9px Arial, Helvetica, sans-serif';g.fillText('ZOMBDASH',x,y+r*.62)}g.textAlign='left';g.textBaseline='alphabetic'};
crest(cxm,hm,40,0);
// commons floor: terrazzo with a border, crest in the middle
R('#7a2828',qx2+8,hb+10,304,4);R('#7a2828',qx2+8,hb+236,304,4);R('#7a2828',qx2+8,hb+10,4,230);R('#7a2828',qx2+308,hb+10,4,230);
for(let i=0;i<120;i++)R(i%3?'rgba(255,255,255,.25)':'rgba(60,50,40,.2)',qx2+16+schH(i,7)*288,hb+18+schH(i,8)*214,2,2);
crest(1340,hb+138,52,1);
// entry mat
R('#16111c',cxm-38,y1-46,76,38);R('#3a3d46',cxm-36,y1-44,72,34);R('#7a2828',cxm-32,y1-40,64,26);g.fillStyle='#d8aa32';g.font='bold 9px Arial, Helvetica, sans-serif';g.textAlign='center';g.fillText('WELCOME',cxm,y1-24);g.textAlign='left';
// top classrooms: cubbies by the hall wall, a wall clock, posters
[x0,x0+220,x0+440].forEach((rx,r)=>{for(let i=0;i<6;i++){R('#16111c',rx+140+i*12,ha-16,12,12);R(['#c84a3a','#3a6fb5','#3f8a42','#d8b92e','#7a4a8a','#e07a2a'][(i+r)%6],rx+141+i*12,ha-15,10,4);R('#8a5a34',rx+141+i*12,ha-11,10,7)}
g.fillStyle='#16111c';g.beginPath();g.arc(rx+206,y0+12,6,0,7);g.fill();g.fillStyle='#f4f1e6';g.beginPath();g.arc(rx+206,y0+12,5,0,7);g.fill();R('#16111c',rx+205,y0+8,1,5);R('#16111c',rx+205,y0+12,4,1);
R('#16111c',rx+6,y0+60,5,26);R(['#3fd25a','#ffd84a','#4a90e2'][r],rx+7,y0+61,3,24);R('#16111c',rx+6,y0+140,5,20);R('#e07a2a',rx+7,y0+141,3,18)});
// bottom-left rooms: rugs
const rug=(x,y,w,h,a,b)=>{R('#16111c',x-1,y-1,w+2,h+2);R(a,x,y,w,h);R(b,x+4,y+4,w-8,2);R(b,x+4,y+h-6,w-8,2);R(b,x+4,y+4,2,h-8);R(b,x+w-6,y+4,2,h-8)};
rug(x0+30,hb+200,150,90,'#3a4a6a','#c8b878');rug(x0+500,hb+150,110,72,'#6a3a2a','#d8aa32');rug(x1-140,hb+14,120,70,'#2f5a3a','#e8e4d8');
// cafeteria banner on the south wall
R('#16111c',1361,ha-21,298,15);R('#7a2828',1362,ha-20,296,13);g.fillStyle='#d8aa32';g.font='bold 10px Arial, Helvetica, sans-serif';g.textAlign='center';g.fillText('HOME OF THE ZOMBIES',1510,ha-10);g.textAlign='left';
// lot markings: stop lines, IN / OUT arrows, crosswalk from the front doors
g.fillStyle='rgba(235,235,225,.75)';g.fillRect(566,1694,128,4);g.fillRect(1546,1694,128,4);
// driveway arrows: IN on the left, OUT on the right
g.fillRect(628,1650,4,30);g.beginPath();g.moveTo(622,1652);g.lineTo(630,1640);g.lineTo(638,1652);g.fill();
g.fillRect(1608,1650,4,30);g.beginPath();g.moveTo(1602,1678);g.lineTo(1610,1690);g.lineTo(1618,1678);g.fill();
g.font='bold 11px Arial, Helvetica, sans-serif';g.textAlign='center';g.fillText('IN',630,1636);g.fillText('OUT',1610,1646);g.textAlign='left';
// crosswalk from the front doors to the lot
g.fillStyle='rgba(235,235,225,.7)';for(let i=0;i<5;i++)g.fillRect(1094+i*12,1362,7,34)

// library posters, bathroom signs over the doors
R('#16111c',x0+330,y1-50,4,30);R('#3a6fb5',x0+331,y1-49,2,28);
for(const[x,c]of[[1280,'#4a90e2'],[1400,'#d85a9a']]){R('#16111c',x-9,hb+253,18,12);R(c,x-8,hb+254,16,10);R('#f4f1e6',x-1,hb+256,2,6)}}
// green road sign: WAREHOUSE 1 MILE →
function schSign(g,x,py){const pw=164,ph=54,bx=x-pw/2,by=py-ph-44;
g.fillStyle='rgba(0,0,0,.25)';g.fillRect(x-1,py-2,14,4);g.fillStyle='#16111c';g.fillRect(x-4,by+ph-2,8,py-by-ph+4);g.fillStyle='#8a9096';g.fillRect(x-3,by+ph,6,py-by-ph+1);g.fillStyle='#c8ccd0';g.fillRect(x-3,by+ph,2,py-by-ph+1);
g.fillStyle='#16111c';g.fillRect(bx-2,by-2,pw+4,ph+4);g.fillStyle='#1d7a3e';g.fillRect(bx,by,pw,ph);g.fillStyle='#f4f1e6';g.fillRect(bx+3,by+3,pw-6,2);g.fillRect(bx+3,by+ph-5,pw-6,2);g.fillRect(bx+3,by+3,2,ph-6);g.fillRect(bx+pw-5,by+3,2,ph-6);
g.textAlign='center';g.textBaseline='middle';g.fillStyle='#f4f1e6';g.font='bold 14px Arial, Helvetica, sans-serif';g.fillText('WAREHOUSE',x,by+17);g.font='bold 13px Arial, Helvetica, sans-serif';g.fillText('1 MILE',x-18,by+37);
const ax=x+22,ay=by+37;g.fillRect(ax,ay-2,22,5);g.beginPath();g.moveTo(ax+20,ay-8);g.lineTo(ax+32,ay+.5);g.lineTo(ax+20,ay+9);g.fill();g.textAlign='left';g.textBaseline='alphabetic';
g.fillStyle='rgba(0,0,0,.25)';g.fillRect(bx+pw-14,by+ph-10,6,3)}
// after the furniture is painted: trees + sign on top, then the list of things you can walk behind
function schTop(g,D){const FGK=['fntn','bus','bus2','ctable','sdesk','sdeskx','tdesk','bookshelf','vending','swing','jgym','slide','hoop','flagpole','cabinet','couch','rtable','plant','chair','lockerx','trophy','bike','fount','planter','lamp','picnic','bench','hedge','can','bush'];
const F=D.filter(o=>FGK.includes(o.kn)).map(o=>{const b=OB[o.kn];return{x:o.x,y:o.y,kn:o.kn,v:o.v,w:b.w,h:b.h,ch:b.c?b.c[1]:0}});
schSign(g,2060,1712);F.push({x:2060,y:1714,w:176,h:106,ch:8,dr:q=>schSign(q,2060,1712)});
for(const t of HS.TR||[]){const{x,y,r}=t;g.fillStyle='rgba(0,0,0,.28)';g.beginPath();g.ellipse(x+4,y+2,r*.9,r*.45,0,0,7);g.fill();g.fillStyle='#16111c';g.fillRect(x-4,y-6,8,9);g.fillStyle='#5a3a22';g.fillRect(x-3,y-6,6,8);
if(typeof document=='undefined'||!document.createElement)continue;const sp=subSpr(t.pine,r,t.v),sx=Math.round(x-sp.width/2),sy=Math.round(t.pine?y-10-sp.height+2:y-r*.7-sp.height/2);g.drawImage(sp,sx,sy);F.push({al:1,x:sx+sp.width/2,y:sy+sp.height,w:sp.width,h:sp.height,ch:0,cv:sp})}
F.sort((a,b)=>a.y-b.y);HS.FG=F}
function schSpr(o){if(o.cv)return o.cv;const c=document.createElement('canvas');c.width=o.w;c.height=o.h;const q=c.getContext('2d');if(o.kn)OB[o.kn].f(q,o.w/2,o.h,o.v);else{q.translate(o.w/2-o.x,o.h-o.y);o.dr(q)}return o.cv=c}
// drawn after the players: anyone standing behind a tall object gets the object painted back over them
function schFg(){const F=HS.FG;if(mapId!==3||!F||typeof document=='undefined'||!document.createElement)return;
const vx0=cam.x-30,vy0=cam.y-30,vx1=cam.x+W+30,vy1=cam.y+H+30,E=[],V=P;
for(const p of PL){if(p.dead)continue;P=p;if(p.dn)E.push({p,y:p.y,x0:p.x-26,x1:p.x+26,y0:p.y-22,y1:p.y+18});else{const o=pfr();E.push({p,y:p.y,x0:p.x-o.w/2-12,x1:p.x+o.w/2+12,y0:o.by-o.h-10,y1:o.by+5})}}P=V;
for(const z of zs){if(z.hp<=0)continue;const T=ZT[z.t];if(z.x<vx0-60||z.x>vx1+60||z.y<vy0-60||z.y>vy1+60)continue;if(T.sv){const k=typeof SVK=='number'?SVK:1;E.push({z,y:z.y,x0:z.x-26*k,x1:z.x+26*k,y0:z.y-32*k,y1:z.y+24*k})}else{const r=T.r||12;E.push({z,y:z.y,x0:z.x-r*1.9,x1:z.x+r*1.9,y0:z.y-r*2.7,y1:z.y+r*1.5})}}
const ov=(a,x0,y0,x1,y1)=>a.x1>x0&&a.x0<x1&&a.y1>y0&&a.y0<y1;
for(const o of F){const ox0=o.x-o.w/2,ox1=o.x+o.w/2,oy0=o.y-o.h,oy1=o.y;if(ox1<vx0||ox0>vx1||oy1<vy0||oy0>vy1)continue;
if(o.al){X.drawImage(o.cv,Math.round(ox0),Math.round(oy0));continue}
const by=o.y-o.ch/2;let B=null;for(const e of E)if(e.y<by&&ov(e,ox0,oy0,ox1,oy1))(B||(B=[])).push(e);if(!B)continue;
X.save();X.beginPath();for(const e of B)X.rect(e.x0,e.y0,e.x1-e.x0,e.y1-e.y0);X.clip();X.drawImage(schSpr(o),Math.round(ox0),Math.round(oy0));X.restore();
for(const e of E)if(e.y>=by&&ov(e,ox0,oy0,ox1,oy1)&&B.some(b=>ov(b,e.x0,e.y0,e.x1,e.y1)))schRe(e)}}
function schRe(e){if(e.z){zDr(e.z);return}const V=P;P=e.p;if(P.dn)drawDown();else if(P.inv<=0||Math.floor(P.inv*20)%2)drawP();P=V}

