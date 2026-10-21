//# maps/graveyard-details.js — Graveyard extras
// ---------- Graveyard extras: chapel parking lot, statues, family plots, mausoleums, an open grave, the north signpost ----------
var GVX={LOT:[580,120,870,480],ST:[[790,690,'bigang'],[1010,690,'bigang'],[1330,880,'reaper'],[1640,780,'bigang'],[430,640,'reaper'],[1090,1520,'bigang'],[1720,1450,'bigang'],[170,590,'bigang'],[1620,300,'reaper'],[1060,250,'bigang'],[1380,1250,'reaper']],
P1:[1130,540,1370,720],P2:[1440,980,1720,1160],MS:[[1230,1200],[560,920],[1300,1720]],SH:[1680,600],OG:[300,720],SG:[970,64]};
function grvKB(){const G=GVX,o=[[G.LOT[0]-10,G.LOT[1]-10,G.LOT[2],G.LOT[3]+20],[G.P1[0]-20,G.P1[1]-50,G.P1[2]+20,G.P1[3]+30],[G.P2[0]-20,G.P2[1]-50,G.P2[2]+20,G.P2[3]+30],[G.SH[0]-90,G.SH[1]-130,G.SH[0]+90,G.SH[1]+40],[G.OG[0]-80,G.OG[1]-60,G.OG[0]+90,G.OG[1]+60],[G.SG[0]-30,0,G.SG[0]+110,G.SG[1]+30]];
for(const[x,y]of G.ST)o.push([x-40,y-100,x+40,y+30]);for(const[x,y]of G.MS)o.push([x-70,y-110,x+70,y+40]);return o}
function grvWL(){const G=GVX,V=[],cc=['#26262c','#5a5a62','#7a2a2a','#2a3a5a','#4a4a3a','#8a8f96'];let n=0;
for(const[cy,a]of[[200,Math.PI/2],[420,-Math.PI/2]])for(let x=612;x<850;x+=52){n++;if(cy<300&&x>640&&x<750)continue;if((n*7)%5==2)continue;const k=n%3?'sedan':'suv',s=HWV(k);V.push({k,x,y:cy,a,L:s[0]*.92,W:s[1]*.92,c:cc[n%cc.length]})}
V.push({k:'limo',x:705,y:310,a:0,L:150,W:38,c:'#16141a'});for(const v of V)hwCol(v);
WL.push([G.OG[0]-30,G.OG[1]-12,60,26,2],[G.SG[0]-3,G.SG[1]-6,8,8,1]);return V}
function grvDec(D){const G=GVX,p=(k,x,y)=>put(D,k,x,y);for(const[x,y,k]of G.ST)p(k,x,y);for(const[x,y]of G.MS){p('mausol',x,y);p('wreath',x-30,y+14);p('candle',x+30,y+14)}
for(const P of[G.P1,G.P2]){const[x0,y0,x1,y1]=P,m=(x0+x1)/2;for(let x=x0+20;x<x1;x+=40){if(Math.abs(x-m)<30)continue;p('fence',x,y0+20);p('fence',x,y1)}const GS=['g_round','g_cross','g_angel','g_obelisk','g_wide'];let i=0;for(const y of[y0+80,y1-40])for(let x=x0+40;x<x1-20;x+=56){p(GS[i%5],x,y);if(i%2)p('wreath',x+14,y+12);i++}}
p('gshed',G.SH[0],G.SH[1]);p('barrel',G.SH[0]+80,G.SH[1]+6);p('shovel',G.SH[0]-78,G.SH[1]+4);p('wheelb',G.SH[0]-40,G.SH[1]+40);p('shovel',G.OG[0]+48,G.OG[1]+4);p('g_cross',G.OG[0],G.OG[1]-22);
for(const[x,y]of[[840,300],[960,300],[840,700],[960,700],[840,1250],[960,1250],[840,1600],[960,1600]])p('lamp',x,y);for(const[x,y]of[[1270,1270],[1630,1270],[1000,1460],[1180,440],[680,600]])p('bench',x,y);
for(const[x,y]of[[160,1010],[260,1010],[740,1010],[1200,1610],[1680,1700]])p('wreath',x,y)}
function grvPaint(g,V){const G=GVX,[a,b,c,d]=G.LOT;g.fillStyle='#16111c';g.fillRect(a-3,b-3,c-a+3,d-b+6);g.fillStyle='#45474d';g.fillRect(a,b,c-a,d-b);for(let i=0;i<20;i++)crack(g,a+((i*53)%(c-a)),b+((i*91)%(d-b)),5,'rgba(10,10,10,.45)');
g.fillStyle='#d8d4c0';for(let x=586;x<=846;x+=52){if(x!=690)g.fillRect(x,b+8,3,92);g.fillRect(x,d-100,3,92)}g.fillStyle='rgba(240,200,64,.7)';g.fillRect(a+10,b+(d-b)/2-2,c-a-20,4);
sign(g,(a+c)/2-30,d+6,'CHAPEL PARKING',130);
{const dx0=644,dx1=740;g.fillStyle='#16111c';g.fillRect(dx0-3,0,dx1-dx0+6,b);g.fillStyle='#45474d';g.fillRect(dx0,0,dx1-dx0,b+4);g.fillStyle='rgba(240,200,64,.75)';for(let y=6;y<b;y+=28)g.fillRect((dx0+dx1)/2-2,y,4,14);
for(const x of[dx0-14,dx1+2]){g.fillStyle='#16111c';g.fillRect(x-1,-1,14,30);g.fillStyle='#7c7c84';g.fillRect(x,0,12,28);g.fillStyle='#9a9aa2';g.fillRect(x,0,12,4);g.fillStyle='#b4b4bc';g.fillRect(x-2,26,16,4)}
g.fillStyle='#26262c';for(let i=0;i<4;i++)g.fillRect(dx0-34-i*5,8+i*1,3,22);for(let i=0;i<4;i++)g.fillRect(dx1+20+i*5,8+i*1,3,22);
g.fillStyle='#e8e4d0';g.font='bold 11px Arial, Helvetica, sans-serif';g.textAlign='center';g.save();g.translate((dx0+dx1)/2,70);g.fillText('ENTER',0,0);g.restore();g.textAlign='left'}
for(const v of V){g.save();g.translate(v.x+4,v.y+5);g.rotate(v.a);g.fillStyle='rgba(0,0,0,.28)';g.fillRect(-v.L/2,-v.W/2,v.L,v.W);g.restore()}
for(const v of V){const r=Math.hypot(v.L,v.W)/2+6;vDraw(g,v.x-r,v.y-r,r*2,r*2,q=>{hwDraw(q,v);if(v.k=='limo'){q.save();q.translate(v.x,v.y);q.fillStyle='#c8c8d0';q.fillRect(-50,-3,30,6);q.fillRect(-38,-9,6,18);q.restore()}})}
// family plots: worn gravel squares
for(const P of[G.P1,G.P2]){g.fillStyle='rgba(90,80,64,.45)';g.fillRect(P[0],P[1]+20,P[2]-P[0],P[3]-P[1]-20);g.fillStyle='rgba(60,52,40,.35)';for(let i=0;i<60;i++)g.fillRect(P[0]+((i*37)%(P[2]-P[0])),P[1]+24+((i*53)%(P[3]-P[1]-28)),3,2)}
// mausoleum steps + gravel
for(const[x,y]of G.MS){g.fillStyle='#6b5a43';g.fillRect(x-40,y,80,30);g.fillStyle='#857357';for(let i=0;i<30;i++)g.fillRect(x-38+(i*29)%76,y+2+(i*13)%26,3,2)}
// open grave with a dirt pile
{const[x,y]=G.OG;g.fillStyle='#4a3a28';g.beginPath();g.ellipse(x+52,y+4,30,16,0,0,7);g.fill();g.fillStyle='#5e4a34';g.beginPath();g.ellipse(x+48,y,22,11,0,0,7);g.fill();g.fillStyle='#16111c';g.fillRect(x-31,y-13,62,28);g.fillStyle='#0c0a08';g.fillRect(x-29,y-11,58,24);g.fillStyle='#2a1e14';g.fillRect(x-29,y-11,58,6);g.fillStyle='#5a3a22';g.fillRect(x-20,y+2,40,9);g.fillStyle='#7a4f2a';g.fillRect(x-20,y+2,40,2)}
// north signpost: MANSION THIS WAY
{const[x,y]=G.SG;g.fillStyle='#16111c';g.fillRect(x-4,y-40,9,48);g.fillStyle='#5a3a22';g.fillRect(x-3,y-39,7,46);const bx=x+8,by=y-36,w=104;g.fillStyle='#16111c';g.fillRect(bx-1,by-1,w+2,30);g.fillStyle='#8a6a3a';g.fillRect(bx,by,w,28);g.fillStyle='#6a4a28';g.fillRect(bx,by+13,w,2);g.fillStyle='#e8d8a8';g.font='bold 10px Arial, Helvetica, sans-serif';g.textAlign='center';g.textBaseline='middle';g.fillText('MANSION',bx+w/2-8,by+7.5);g.fillText('THIS WAY',bx+w/2-8,by+21);
g.fillStyle='#16111c';g.beginPath();g.moveTo(bx+w-12,by+4);g.lineTo(bx+w-4,by+20);g.lineTo(bx+w-20,by+20);g.fill();g.fillStyle='#e8d8a8';g.beginPath();g.moveTo(bx+w-12,by+6);g.lineTo(bx+w-6,by+18);g.lineTo(bx+w-18,by+18);g.fill();g.fillRect(bx+w-14,by+17,4,8);g.textAlign='left';g.textBaseline='alphabetic'}}

