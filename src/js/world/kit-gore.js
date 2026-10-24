//# world/kit-gore.js — Building kit gore: more blood decals (spray, smear, drops, big splatter, bloody footprints, crawl marks) in five blood colours, a blood trail path, dead zombies drawn from the game's own zombie sprites, and body parts (arms, legs, heads, hands, torsos, guts, bones, skulls, rib cages, covered bodies, body bags)
// ---------- blood, bodies and body parts ----------
// All of these are decals (flat, never solid, turned and sized freely) except the blood trail, which is a path.
// The dead zombie decal draws a real zombie sprite (render/sprites.js: SPR atlas, ZS frames) lying down, darkened, on a pool of blood.
const PDSKIN=[['#7aa85a','Zombie green'],['#a8b86a','Pale green'],['#9aa0a0','Grey'],['#c89a7a','Human'],['#7a6a9a','Bruised']];
const PDSHIRT=[['#8a8a8a','Grey'],['#a84a3a','Red'],['#3a5a8a','Blue'],['#e8e4d8','White'],['#5a6a3a','Olive']];
const PDPANTS=[['#2a3a5a','Jeans'],['#5a4a32','Brown'],['#34343a','Black'],['#7a7a5a','Khaki']];
// the zombie kinds a dead zombie can be (ZS keys), with their names
const CMDZ=[['0','Walker'],['1','Runner'],['2','Brute'],['3','Lab coat'],['4','Big blue'],['5','Little blue'],['9','Bones'],['10','Toxic'],['11','Spitter'],['18','Exploder'],['19','Healer']];
function gR(g,x,y,w,h,c){g.fillStyle=c;g.fillRect(x,y,w,h)}
// a torn, bloody end with a bit of bone (arms, legs, necks)
function gStump(g,x,y,h,bone){gR(g,x,y,3,h,'#16111c');gR(g,x+1,y+1,2,h-2,'#9a1c1c');gR(g,x+1,y+1,1,h-2,'#c83a3a');if(bone)gR(g,x-2,y+Math.floor(h/2)-1,3,3,'#e6e2d3')}
// a bone: a shaft with knobs at both ends, centred on (x,y) and turned a
function gBone(g,x,y,len,a){g.save();g.translate(x,y);g.rotate(a);gR(g,-len/2,-2,len,4,'#16111c');for(const s of[-1,1]){dcEll(g,s*len/2,-2,3.4,2.6,'#16111c');dcEll(g,s*len/2,2,3.4,2.6,'#16111c')}gR(g,-len/2,-1,len,2,'#e6e2d3');for(const s of[-1,1]){dcEll(g,s*len/2,-2,2.4,1.8,'#e6e2d3');dcEll(g,s*len/2,2,2.4,1.8,'#d6d2c3')}g.restore()}
// a pool of blood under a body part
function gPool(g,x,y,r,K,v,k){const a=K?K.dd:'#4e0d0d',b=K?K.b:'#7a1414';for(let i=0;i<6;i++){const q=i/6*6.283+dcH(v,i,k),d=r*.45*dcH(v,i,k+1);dcEll(g,x+Math.cos(q)*d,y+Math.sin(q)*d*.6,r*(.5+.25*dcH(v,i,k+2)),r*(.32+.15*dcH(v,i,k+3)),a)}
for(let i=0;i<4;i++){const q=i/4*6.283+dcH(v,i,k+4),d=r*.3*dcH(v,i,k+5);dcEll(g,x-1+Math.cos(q)*d,y-1+Math.sin(q)*d*.6,r*(.34+.15*dcH(v,i,k+6)),r*(.22+.1*dcH(v,i,k+7)),b)}dcEll(g,x-r*.3,y-r*.25,r*.22,r*.07,'rgba(255,200,200,.18)')}
// the darkened, lying-down picture of a zombie kind, made once from the sprite atlas
const CMDZC={};
function gDeadSprite(t){if(CMDZC[t])return CMDZC[t];const A=typeof ZS!='undefined'&&ZS[t];if(!A||!A.walk||typeof SPR=='undefined'||!SPR.complete||!SPR.naturalWidth)return null;const f=A.walk[0];
const c=document.createElement('canvas');c.width=f[2];c.height=f[3];const q=c.getContext('2d');if(!q)return null;q.drawImage(SPR,f[0],f[1],f[2],f[3],0,0,f[2],f[3]);
q.globalCompositeOperation='source-atop';q.fillStyle='rgba(40,24,36,.28)';q.fillRect(0,0,f[2],f[3]);return CMDZC[t]={c,w:f[2]/1.6,h:f[3]/1.6}}
const CMGK=[
// ----- more blood -----
{id:'bloodspray',n:'Blood spray',cat:'gore',w:84,h:40,pal:PDBLOOD,f(g,v,K){dcBlob(g,-30,0,8,K.d,v,81);for(let i=0;i<34;i++){const t=dcH(v,i,82),x=-30+t*70,sp=(4+t*14)*(dcH(v,i,83)-.5)*2,r=Math.max(.6,(1-t)*3.2*dcH(v,i,84)+.6);dcEll(g,x,sp,r*1.4,r,i%4?K.b:K.d)}
for(let i=0;i<4;i++){const y=(dcH(v,i,85)-.5)*16;g.globalAlpha*=.8;g.strokeStyle=K.b;g.lineWidth=1.2;g.beginPath();g.moveTo(-24,y*.3);g.lineTo(6+dcH(v,i,86)*30,y);g.stroke()}}},
{id:'bloodsmear',n:'Blood smear',cat:'gore',w:76,h:32,pal:PDBLOOD,f(g,v,K){const A=g.globalAlpha,top=[],bot=[];for(let i=0;i<=8;i++){const x=-34+i*8.5,hw=i<8?3+i*1.4:7;top.push([x,-hw+(dcH(v,i,87)-.5)*3]);bot.push([x,hw+(dcH(v,i,88)-.5)*3])}
const sh=()=>{g.beginPath();g.moveTo(top[0][0],top[0][1]);for(const p of top)g.lineTo(p[0],p[1]);for(let i=bot.length-1;i>=0;i--)g.lineTo(bot[i][0],bot[i][1]);g.closePath()};g.globalAlpha=A*.62;sh();g.fillStyle=K.b;g.fill();dcEll(g,34,0,4,8,K.b);g.globalAlpha=A*.45;g.save();g.translate(-4,0);g.scale(.8,.6);sh();g.fillStyle=K.d;g.fill();g.restore();
g.globalAlpha=A*.8;g.strokeStyle=K.d;g.lineWidth=1.2;for(let i=0;i<5;i++){const y=-9+i*4.5+(dcH(v,i,89)-.5)*2;g.beginPath();g.moveTo(-30,y*.35);g.lineTo(26+dcH(v,i,90)*10,y);g.stroke()}g.globalAlpha=A;dcBlob(g,-30,0,8,K.d,v,93);dcEll(g,-30,0,4,3,K.b)}},
{id:'blooddrips',n:'Blood drops',cat:'gore',w:54,h:40,pal:PDBLOOD,f(g,v,K){for(let i=0;i<16;i++){const x=(dcH(v,i,94)-.5)*48,y=(dcH(v,i,95)-.5)*32,r=.8+dcH(v,i,96)*2.8;dcEll(g,x,y,r,r*.8,i%3?K.b:K.d);if(r>2.6)dcEll(g,x-r*.3,y-r*.3,r*.3,r*.2,'rgba(255,200,200,.25)')}}},
{id:'bloodsplash',n:'Big blood splatter',cat:'gore',w:96,h:74,pal:PDBLOOD,f(g,v,K){g.fillStyle=K.d;for(let i=0;i<12;i++){const a=i/12*6.283+dcH(v,i,97)*.4,L=24+dcH(v,i,98)*20,w=.14+dcH(v,i,99)*.12;g.beginPath();g.moveTo(Math.cos(a-w)*14,Math.sin(a-w)*10);g.lineTo(Math.cos(a)*L,Math.sin(a)*L*.72);g.lineTo(Math.cos(a+w)*14,Math.sin(a+w)*10);g.closePath();g.fill();dcEll(g,Math.cos(a)*(L+4),Math.sin(a)*(L+4)*.72,1.6+dcH(v,i,100)*2,1.4,K.b)}
dcBlob(g,0,0,22,K.d,v,101);dcBlob(g,-2,-1,15,K.b,v,102);dcEll(g,-6,-6,6,2,'rgba(255,200,200,.2)')}},
{id:'bloodfoot',n:'Bloody footprints',cat:'gore',w:124,h:30,pal:PDBLOOD,f(g,v,K){for(let i=0;i<8;i++){const x=-54+i*15,y=i%2?5:-5,a=Math.max(.12,1-i*.12);g.globalAlpha=a;g.save();g.translate(x,y);dcEll(g,0,0,5,2.6,K.b);dcEll(g,-6,0,2.6,2.2,K.b);g.fillStyle='rgba(0,0,0,.18)';g.fillRect(-2,-1,3,2);g.restore()}g.globalAlpha=1}},
{id:'bloodcrawl',n:'Crawl marks',cat:'gore',w:124,h:40,pal:PDBLOOD,f(g,v,K){const A=g.globalAlpha;for(const s of[-5,0,5]){g.strokeStyle=s?K.d:K.b;g.globalAlpha=A*(s?.5:.35);g.lineWidth=s?1.6:5;g.beginPath();g.moveTo(-58,s);for(let x=-58;x<=50;x+=6)g.lineTo(x,s+Math.sin(x*.08+v*6)*2+(dcH(v,x,117)-.5)*.8);g.stroke()}g.globalAlpha=A;
for(let i=0;i<4;i++){const x=-44+i*28,y=i%2?-12:12;dcEll(g,x,y,4.5,3.6,K.b);g.fillStyle=K.b;for(let k=0;k<4;k++)g.fillRect(x+3+k%2,y-5+k*2.6,4,1.6)}dcBlob(g,52,0,9,K.d,v,103);g.lineCap='butt'}},
// ----- bodies and body parts -----
{id:'deadz',n:'Dead zombie',cat:'body',w:68,h:48,pal:PDBLOOD,def:{o:{z:'0',pool:1,flip:0}},opts:[['z','Zombie',CMDZ],['pool','Pool of blood','chk'],['flip','Mirror','chk']],f(g,v,K,t,O){const S=gDeadSprite(String(O.z));
if(+O.pool)gPool(g,-4,4,22,K,v,104);if(!S){gR(g,-20,-6,40,12,'#16111c');gR(g,-19,-5,38,10,'#5a7a4a');return}g.save();if(+O.flip)g.scale(-1,1);if(!+O.pool)dcEll(g,0,3,S.h*.46,S.w*.28,'rgba(0,0,0,.18)');g.rotate(-Math.PI/2);g.drawImage(S.c,-S.w/2,-S.h/2,S.w,S.h);g.restore();
if(+O.pool){dcEll(g,6,-3,2.4,1.6,K.b);dcEll(g,-10,6,1.8,1.3,K.b)}}},
{id:'zarm',n:'Severed arm',cat:'body',w:48,h:20,pal:PDSKIN,f(g,v,K){const sl=PDSHIRT[Math.floor(v*4)%4][0],L=pcK(sl);gPool(g,-17,2,9,null,v,105);
gR(g,-20,-5,14,10,'#16111c');gR(g,-19,-4,12,8,L.b);gR(g,-19,2,12,2,L.d);gR(g,-9,-6,3,2,'#16111c');gR(g,-8,4,3,2,'#16111c');
gR(g,-7,-4,19,8,'#16111c');gR(g,-6,-3,17,6,K.b);gR(g,-6,1,17,2,K.d);gR(g,-6,-3,17,1,K.l);
gR(g,11,-5,9,10,'#16111c');gR(g,12,-4,7,8,K.b);gR(g,12,2,7,2,K.d);for(const[y,l]of[[-4,4],[-1,5],[2,3]]){gR(g,19,y-1,l+1,3,'#16111c');gR(g,19,y,l,1,K.b)}gR(g,13,-7,4,3,'#16111c');gR(g,14,-6,2,1,K.b);gStump(g,-23,-3,6,1)}},
{id:'zleg',n:'Severed leg',cat:'body',w:58,h:22,pal:PDPANTS,f(g,v,K){const sk=PDSKIN[Math.floor(v*3)%3][0];gPool(g,-20,2,10,null,v,106);
gR(g,-23,-5,32,10,'#16111c');gR(g,-22,-4,30,8,K.b);gR(g,-22,2,30,2,K.d);gR(g,-22,-4,30,1,K.l);gR(g,-6,-4,1,8,K.d);gR(g,-14,-1,4,3,K.dd);
gR(g,8,-3,4,6,'#16111c');gR(g,8,-2,4,4,sk);gR(g,11,-6,15,12,'#16111c');gR(g,12,-5,13,10,'#3a2a22');gR(g,12,3,13,2,'#1e1612');gR(g,22,-5,3,10,'#4a3a2e');gR(g,13,-5,9,1,'#5a4a3a');gStump(g,-26,-3,6,1)}},
{id:'zhead',n:'Zombie head',cat:'body',w:28,h:28,pal:PDSKIN,f(g,v,K){gPool(g,0,9,10,null,v,107);gR(g,-8,-10,16,17,'#16111c');gR(g,-7,-9,14,15,K.b);gR(g,-7,2,14,4,K.d);gR(g,-7,-9,14,1,K.l);
const hair=['#2a2420','#4a3a2a','#6a5a4a','#1e1c22'][Math.floor(v*4)%4];gR(g,-7,-9,14,4,hair);gR(g,-7,-9,3,8,hair);gR(g,2,-10,3,2,'#16111c');
gR(g,1,-3,4,3,'#16111c');gR(g,2,-2,2,1,v<.5?'#d8403a':'#e8d84a');gR(g,-4,-3,3,3,'#16111c');gR(g,-2,3,8,2,'#16111c');gR(g,0,3,1,2,'#e6e2d3');gR(g,3,3,1,2,'#e6e2d3');gR(g,-6,-1,3,3,'#9a1c1c');
gR(g,-5,7,10,3,'#16111c');gR(g,-4,7,8,2,'#9a1c1c');gR(g,-1,7,3,2,'#e6e2d3')}},
{id:'zhand',n:'Severed hand',cat:'body',w:22,h:16,pal:PDSKIN,f(g,v,K){gPool(g,-6,2,5,null,v,108);gR(g,-6,-4,10,9,'#16111c');gR(g,-5,-3,8,7,K.b);gR(g,-5,2,8,2,K.d);for(const[y,l]of[[-3,4],[0,5],[3,3]]){gR(g,3,y-1,l+1,3,'#16111c');gR(g,3,y,l,1,K.b)}gR(g,-3,-6,3,3,'#16111c');gR(g,-2,-5,1,1,K.b);gStump(g,-9,-3,7,0)}},
{id:'ztorso',n:'Torso',cat:'body',w:46,h:38,pal:PDSHIRT,f(g,v,K){gPool(g,0,4,19,null,v,109);gR(g,-13,-12,26,25,'#16111c');gR(g,-12,-11,24,23,K.b);gR(g,-12,6,24,6,K.d);gR(g,-12,-11,24,1,K.l);
gR(g,-12,9,24,3,'#2a3a5a');gR(g,-7,-5,8,7,'#16111c');gR(g,-6,-4,6,5,'#9a1c1c');for(let k=0;k<3;k++)gR(g,-6,-4+k*2,5,1,'#e6e2d3');gR(g,5,1,4,3,'#9a1c1c');
gR(g,-5,-15,10,4,'#16111c');gR(g,-4,-14,8,3,'#9a1c1c');gR(g,-1,-15,3,2,'#e6e2d3');gStump(g,-16,-10,7,1);gStump(g,13,-10,7,1)}},
{id:'guts',n:'Guts',cat:'body',w:58,h:34,pal:PDBLOOD,f(g,v,K){dcBlob(g,0,2,24,K.dd,v,110);dcBlob(g,-2,0,17,K.b,v,111);const j=k=>(dcH(v,k,112)-.5)*4,P=()=>{g.beginPath();g.moveTo(-22,2+j(1));g.bezierCurveTo(-16,-11+j(2),-5,-11,-5,0);g.bezierCurveTo(-5,10+j(3),7,10,7,0);g.bezierCurveTo(7,-9+j(4),17,-9,21,2+j(5))};
g.lineCap='round';g.lineJoin='round';P();g.strokeStyle='#16111c';g.lineWidth=7.5;g.stroke();P();g.strokeStyle='#b44a58';g.lineWidth=5.5;g.stroke();g.save();g.translate(-.8,-1.2);P();g.strokeStyle='#e88a98';g.lineWidth=1.4;g.stroke();g.restore();g.lineCap='butt';g.lineJoin='miter';
dcEll(g,-20,4,4,3,'#7a2a34');dcEll(g,18,-6,3,2,'#8a3442')}},
{id:'bones',n:'Bones',cat:'body',w:58,h:36,f(g,v){gBone(g,-10,-4,26,-.35+dcH(v,0,113)*.3);gBone(g,10,6,22,.5+dcH(v,1,114)*.4);gBone(g,14,-9,14,1.3);gBone(g,-16,10,12,2.6)}},
{id:'skull',n:'Skull',cat:'body',w:22,h:22,f(g,v){dcEll(g,0,-1,8.5,8,'#16111c');gR(g,-5,4,10,6,'#16111c');dcEll(g,0,-1,7.5,7,'#e6e2d3');gR(g,-4,4,8,5,'#e6e2d3');gR(g,-4,7,8,1,'#b8b4a6');dcEll(g,-3,0,2.4,2.6,'#16111c');dcEll(g,3,0,2.4,2.6,'#16111c');gR(g,-1,3,2,2,'#16111c');for(let k=-3;k<=2;k+=2)gR(g,k,8,1,2,'#16111c');gR(g,-6,-6,3,2,'#ffffff')}},
{id:'ribcage',n:'Rib cage',cat:'body',w:38,h:30,f(g,v){gR(g,-2,-13,4,26,'#16111c');gR(g,-1,-12,2,24,'#e6e2d3');g.lineCap='round';for(let k=0;k<5;k++){const y=-10+k*5,L=13-Math.abs(k-1.5)*1.6;for(const s of[-1,1]){g.strokeStyle='#16111c';g.lineWidth=3.2;g.beginPath();g.moveTo(0,y);g.quadraticCurveTo(s*L,y-2,s*(L-2),y+4);g.stroke();g.strokeStyle='#e6e2d3';g.lineWidth=1.6;g.stroke()}}g.lineCap='butt'}},
{id:'sheetbody',n:'Covered body',cat:'body',w:70,h:30,f(g,v){g.fillStyle='rgba(0,0,0,.22)';g.beginPath();g.ellipse(2,3,32,10,0,0,7);g.fill();g.fillStyle='#16111c';g.beginPath();g.ellipse(-22,0,8,8,0,0,7);g.ellipse(4,0,24,10,0,0,7);g.fill();
g.fillStyle='#e8e6e0';g.beginPath();g.ellipse(-22,0,7,7,0,0,7);g.ellipse(4,0,23,9,0,0,7);g.fill();g.fillStyle='#c8c6c0';g.fillRect(-14,5,40,3);for(const x of[-8,6,18])g.fillRect(x,-6,1,11);
dcEll(g,24,-4,3,3,'#e8e6e0');dcEll(g,24,4,3,3,'#e8e6e0');dcBlob(g,-4,1,7,'rgba(140,20,24,.55)',v,115);dcBlob(g,-24,2,4,'rgba(140,20,24,.45)',v,116)}},
{id:'bodybag',n:'Body bag',cat:'body',w:70,h:26,f(g,v){g.fillStyle='rgba(0,0,0,.25)';g.fillRect(-30,-6,62,16);g.fillStyle='#16111c';g.beginPath();g.ellipse(0,0,32,10,0,0,7);g.fill();g.fillStyle='#2a2c30';g.beginPath();g.ellipse(0,0,31,9,0,0,7);g.fill();
g.fillStyle='#3a3c42';g.fillRect(-24,-5,48,2);g.fillStyle='#8a8f96';g.fillRect(-26,0,52,1);g.fillRect(24,-2,3,4);gR(g,-29,-2,3,4,'#16111c')}}];
for(const t of CMGK)cmAddDec(t);
// a blood trail along points (a path): a smeared line with drops along its edges
function pthBlood(g,P,o){const K=pcK(cmCol(o.c,'#7a1414')),w=o.w||10;g.globalAlpha=.55;cmLine(g,P,w,K.d);g.globalAlpha=.8;cmLine(g,P,Math.max(1,w*.45),K.b);g.globalAlpha=1;
cmAlong(P,9,(x,y,a,d)=>{const h=dcH(d*.013+(o.x||0)*.001,1,7),s=(h-.5)*w*1.6,r=.8+h*2.2*Math.min(2,w/10);dcEll(g,x-Math.sin(a)*s,y+Math.cos(a)*s,r,r*.8,h<.5?K.b:K.dd)})}
cmAddPath({id:'bloodline',n:'Blood trail',cat:'line',w:10,wr:[3,40],pal:PDBLOOD,def:{c:'#7a1414'},pri:-15,f:pthBlood});
