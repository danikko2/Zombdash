//# world/kit-school.js — Building kit pieces from the School: lockers, boards and cubbies along walls, counters (plain, sinks, towel dispensers), a kitchen line, a round fountain plaza, a paver walkway, playground sand with a ragged edge; the school crest and lawn-bit decals; schoolyard grass
// ---------- the School's pieces ----------
// (functions and registries only: nothing here runs during the first map build at boot)
// Wall pieces seen from above lie along a wall: a box wider than tall runs left–right, a taller one up–down.
// lockers along a wall: one locker every 14 px, in three shades of the colour (blue: the old School's exact shades)
const PSLOCK=[['#4a6a8a','Blue'],['#7c828c','Grey'],['#a8423a','Red'],['#3f7a4a','Green'],['#c8a040','Yellow']];
function arLockers(g,o){const{x,y,w,h}=o,b=cmCol(o.c,'#4a6a8a'),vert=h>w,L=vert?h:w,D=b=='#4a6a8a'?['#2a3e54','#5a7a98']:[pcSh(b,.58),pcSh(b,1.06)];
for(let k=0;k<L;k+=14){const i=k/14|0,s=Math.min(14,L-k),c=(i*7)%5==0?D[0]:(i*3)%4==0?D[1]:b;g.fillStyle='#16111c';vert?g.fillRect(x,y+k,w,s):g.fillRect(x+k,y,s,h);g.fillStyle=c;vert?g.fillRect(x+1,y+k+1,w-2,s-2):g.fillRect(x+k+1,y+1,s-2,h-2);
 g.fillStyle='rgba(0,0,0,.3)';if(s>=8)for(let v=0;v<3;v++)vert?g.fillRect(x+3+v*2,y+k+3,1,5):g.fillRect(x+k+3,y+3+v*2,5,1)}}
// a board on a wall: chalkboard (with chalk marks), whiteboard, cork board or a poster in any colour, in a dark frame
const PSBOARD=[['#2f5a3a','Chalkboard'],['#e8ece8','Whiteboard'],['#b8864a','Cork board'],['#3fd25a','Green poster'],['#ffd84a','Yellow poster'],['#4a90e2','Blue poster'],['#e07a2a','Orange poster'],['#3a6fb5','Navy poster'],['#c0392b','Red poster']];
function arBoard(g,o){const{x,y,w,h}=o,c=cmCol(o.c,'#2f5a3a'),vert=h>w;g.fillStyle='#16111c';g.fillRect(x,y,w,h);g.fillStyle=c;g.fillRect(x+1,y+1,Math.max(0,w-2),Math.max(0,h-2));
if(ao(o,'marks',1)&&(vert?h:w)>40&&(vert?w:h)>=8){g.fillStyle=c=='#e8ece8'?'rgba(40,60,140,.55)':c=='#b8864a'?'#f4f0e0':'rgba(235,235,225,.6)';const L=vert?h:w;
 for(let i=0;i<3;i++){const a=10+cmR(o,i,3)*(L*.55),l=12+cmR(o,i,4)*Math.min(60,L*.35),t=2+Math.floor(cmR(o,i,5)*((vert?w:h)-5));if(c=='#b8864a')vert?g.fillRect(x+t,y+a,5,6):g.fillRect(x+a,y+t,6,5);else vert?g.fillRect(x+t,y+a,1,l):g.fillRect(x+a,y+t,l,1)}}}
// a cubby shelf on a wall: 12 px cubbies, each with a coloured bag in it
function arCubbies(g,o){const{x,y,w,h}=o,vert=h>w,L=vert?h:w,C=['#c84a3a','#3a6fb5','#3f8a42','#d8b92e','#7a4a8a','#e07a2a'],s=Math.floor(cmR(o,0,6)*6);
for(let k=0;k+12<=L;k+=12){const i=k/12|0,c=C[(i+s)%6];if(vert){g.fillStyle='#16111c';g.fillRect(x,y+k,w,12);g.fillStyle=c;g.fillRect(x+1,y+k+1,4,10);g.fillStyle='#8a5a34';g.fillRect(x+5,y+k+1,w-6,10)}
 else{g.fillStyle='#16111c';g.fillRect(x+k,y,12,h);g.fillStyle=c;g.fillRect(x+k+1,y+1,10,4);g.fillStyle='#8a5a34';g.fillRect(x+k+1,y+5,10,h-6)}}}
// a counter seen from above (solid): plain (with a lighter front edge when it runs left–right), sinks with blue basins, or towel dispensers
const PSCOUNT=[['#8a909c','Grey'],['#7a5232','Wood'],['#e8e8e4','White'],['#a8b0ba','Steel']];
function arCounter(g,o){const{x,y,w,h}=o,c=cmCol(o.c,'#8a909c'),st=ao(o,'st','plain'),vert=h>w,L=vert?h:w,D=vert?w:h;g.fillStyle=c;g.fillRect(x,y,w,h);
if(st=='plain'){if(!vert){g.fillStyle=c=='#8a909c'?'#b8bcc4':c=='#7a5232'?'#9a6a3c':pcSh(c,1.18);g.fillRect(x,y,w,Math.min(4,h))}return}
const sz=st=='sinks'?8:12;for(let k=8;k+sz<=L-4;k+=22){g.fillStyle=st=='sinks'?'#8fc3e8':'#fff';vert?g.fillRect(x+3,y+k,D-6,sz):g.fillRect(x+k,y+3,sz,D-6)}}
// a kitchen line: ovens and steam tables in a row (one every 60 px), every other one with a tray on top
function arKline(g,o){const{x,y,w,h}=o;for(let k=0;k+36<=w;k+=60){g.fillStyle='#3a3d46';g.fillRect(x+k,y,36,h);if((k/60)%2==0){g.fillStyle='#d8d4c8';g.fillRect(x+k+6,y+2,24,Math.min(10,h-4))}}}
// a round plaza: paver rings and spokes inside a stone border, a ring of grass round it, optional flower beds (gaps north, south, east and west)
function arPlaza(g,o){const cx=o.x+o.w/2,cy=o.y+o.h/2,R=Math.min(o.w,o.h)/2-8;if(R<20)return;const C=(c,r)=>{g.fillStyle=c;g.beginPath();g.arc(cx,cy,Math.max(1,r),0,7);g.fill()};
C('#4a7a34',R+8);C('#5a564c',R+1);C(cmCol(o.c,'#c4bcaa'),R-3);g.strokeStyle='#aaa292';g.lineWidth=1;for(let r=24;r<R-4;r+=18){g.beginPath();g.arc(cx,cy,r,0,7);g.stroke()}
const ri=Math.min(60,R*.4);for(let a=0;a<360;a+=12){const t=a*Math.PI/180;g.beginPath();g.moveTo(cx+Math.cos(t)*ri,cy+Math.sin(t)*ri);g.lineTo(cx+Math.cos(t)*(R-4),cy+Math.sin(t)*(R-4));g.stroke()}
g.strokeStyle='#8a8272';g.lineWidth=3;g.beginPath();g.arc(cx,cy,ri+2,0,7);g.stroke();g.beginPath();g.arc(cx,cy,R-24,0,7);g.stroke();
if(!ao(o,'beds',1)||R<60)return;for(const[a0,a1]of[[20,70],[110,160],[200,250],[290,340]]){const t0=a0*Math.PI/180,t1=a1*Math.PI/180;g.fillStyle='#16111c';g.beginPath();g.arc(cx,cy,R-4,t0-.02,t1+.02);g.arc(cx,cy,R-30,t1+.02,t0-.02,true);g.closePath();g.fill();
 g.fillStyle='#5a3a22';g.beginPath();g.arc(cx,cy,R-6,t0,t1);g.arc(cx,cy,R-28,t1,t0,true);g.closePath();g.fill();
 for(let k=0;k<18;k++){const t=t0+(t1-t0)*(k+.5)/18,r=R-17+(k%2?5:-5),px=cx+Math.cos(t)*r,py=cy+Math.sin(t)*r;g.fillStyle=k%3?'#2f6d2e':'#3f8a3a';g.beginPath();g.arc(px,py,5,0,7);g.fill();g.fillStyle=['#ff6a8a','#ffd84a','#fff','#9a7aff','#ff8a3a'][(k+a0)%5];g.fillRect(px-1,py-2,3,3)}}}
// a paver walkway: a stone edge and pavers in rows across it
function arWalkway(g,o){const{x,y,w,h}=o,vert=h>=w;g.fillStyle='#5a564c';g.fillRect(x,y,w,h);g.fillStyle=cmCol(o.c,'#c4bcaa');vert?g.fillRect(x+2,y,w-4,h):g.fillRect(x,y+2,w,h-4);g.fillStyle='#aaa292';if(vert)for(let k=12;k<h;k+=12)g.fillRect(x+2,y+k,w-4,1);else for(let k=12;k<w;k+=12)g.fillRect(x+k,y+2,1,h-4)}
// playground sand: a sandy box whose edge breaks up into the grass round it (up to 46 px outside the box), a few grass tufts inside the edge
function arSandlot(g,o){const x0=o.x,y0=o.y,x1=o.x+o.w,y1=o.y+o.h,S=['#c9b48a','#c4ae84','#cdb990'],sd=5.7+((o.x*.013+o.y*.007)%1),H=(i,k)=>{const v=Math.sin(i*12.9898+k*78.233+sd)*43758.5453;return v-Math.floor(v)};g.fillStyle=S[0];g.fillRect(x0+14,y0+14,o.w-28,o.h-28);
const per=[];for(let x=x0;x<=x1;x+=9){per.push([x,y0]);per.push([x,y1])}for(let y=y0;y<=y1;y+=9){per.push([x0,y]);per.push([x1,y])}
per.forEach(([x,y],i)=>{const r=8+H(i,31)*16;g.fillStyle=S[0];g.beginPath();g.ellipse(x+(H(i,32)-.5)*20,y+(H(i,33)-.5)*20,r,r*.8,0,0,7);g.fill()});
const n=Math.round(9000*o.w*o.h/168000),gt=ao(o,'tufts',1);for(let i=0;i<n;i++){const x=x0-46+H(i,34)*(o.w+92),y=y0-46+H(i,35)*(o.h+92),dx=Math.max(x0-x,0,x-x1),dy=Math.max(y0-y,0,y-y1),d=Math.hypot(dx,dy),din=Math.min(x-x0,x1-x,y-y0,y1-y),k=H(i,36);
 if(d>0){if(d<46&&k<Math.pow(1-d/46,1.6)*.8){g.fillStyle=S[i%3];g.globalAlpha=.45+.5*(1-d/46);g.fillRect(x,y,2+(i%3),2+(i%2));g.globalAlpha=1}}else if(gt&&din<26&&k<(1-din/26)*.22){g.fillStyle=i%2?'#6a7a42':'#5f6f3b';g.fillRect(x,y,2,3+(i%3))}}
g.fillStyle='#b8a47a';const m=Math.round(90*o.w*o.h/168000);for(let i=0;i<m;i++)g.fillRect(x0+20+H(i,37)*Math.max(1,o.w-40),y0+20+H(i,38)*Math.max(1,o.h-40),4,2)}
const CMSCH=[
{id:'lockers',n:'Lockers along a wall',cat:'build',fl:null,pal:PSLOCK,def:{c:'#4a6a8a'},min:[12,12],pri:-20,f:arLockers},
{id:'board',n:'Board / poster on a wall',cat:'build',fl:null,pal:PSBOARD,def:{c:'#2f5a3a',o:{marks:1}},opts:[['marks','Writing on it','chk']],min:[4,4],pri:-18,f:arBoard},
{id:'cubbies',n:'Cubby shelf on a wall',cat:'build',fl:null,min:[12,12],pri:-20,f:arCubbies},
{id:'counter',n:'Counter (seen from above)',cat:'build',fl:1,pal:PSCOUNT,def:{c:'#8a909c',o:{st:'plain'}},opts:[['st','Top',[['plain','Plain'],['sinks','Sinks'],['towels','Towel dispensers']]]],min:[6,6],pri:-15,f:arCounter},
{id:'kline',n:'Kitchen line (ovens, steam tables)',cat:'build',fl:null,min:[36,12],pri:-20,f:arKline},
{id:'plaza',n:'Round plaza',cat:'ground',fl:null,pal:[['#c4bcaa','Pavers'],['#b4aea0','Grey stone'],['#c8a880','Brick sand']],def:{c:'#c4bcaa',o:{beds:1}},opts:[['beds','Flower beds','chk']],min:[80,80],pri:-110,f:arPlaza},
{id:'walkway',n:'Paver walkway',cat:'ground',fl:null,pal:[['#c4bcaa','Pavers'],['#b4aea0','Grey stone']],def:{c:'#c4bcaa'},min:[12,12],pri:-108,f:arWalkway},
{id:'sandlot',n:'Playground sand (ragged edge)',cat:'ground',fl:null,def:{o:{tufts:1}},opts:[['tufts','Grass tufts near the edge','chk']],min:[60,60],pri:-125,f:arSandlot}];
for(const t of CMSCH)cmAddArea(t);
// the school crest (a letter in a gold ring; optionally ZOMBDASH under it): r 40 at scale 1
cmAddDec({id:'crest',n:'School crest',cat:'paint',w:84,h:84,txt:2,opts:[['sm','School name under the letter','chk']],def:{o:{sm:0}},f(g,v,K,t,O){const r=40,C=(c,rr)=>{g.fillStyle=c;g.beginPath();g.arc(0,0,rr,0,7);g.fill()};C('#16111c',r+2);C('#d8aa32',r);C('#7a2828',r-6);
g.fillStyle='#d8aa32';g.textAlign='center';g.textBaseline='middle';g.font='bold '+Math.round(r*.95)+'px Arial, Helvetica, sans-serif';g.fillText((t||'Z').toUpperCase(),0,1);if(O&&+O.sm){g.font='bold 9px Arial, Helvetica, sans-serif';g.fillText('ZOMBDASH',0,r*.62)}g.textAlign='left';g.textBaseline='alphabetic'}});
// a bit on the lawn (the School's): var < 0.4 a tuft, < 0.7 a scrap of paper, else a twig
cmAddDec({id:'lawnbit',n:'Lawn bit (tuft, scrap or twig)',cat:'nature',w:10,h:8,f(g,v){if(v<.4){g.fillStyle='#4f5f32';g.fillRect(0,0,2,5);g.fillRect(3,1,2,4)}else if(v<.7){g.fillStyle='#d8d4c8';g.fillRect(0,0,4,3)}else{g.fillStyle='#8a7a4a';g.fillRect(0,0,6,2)}}});
// schoolyard grass: the old School's olive lawn with its tufts
cmAddTer({id:'grass_school',n:'Schoolyard grass',cat:'ground',mc:'#6a7a42',f(g,x,y){cmCells(g,x,y,'#6a7a42','#64743d','#71824a');g.fillStyle='#4f5f32';for(let j=0;j<32;j+=16)for(let i=0;i<32;i+=16)if(((x+i)*31+(y+j)*17)%7==0){g.fillRect(x+i+4,y+j+6,2,5);g.fillRect(x+i+9,y+j+4,2,6)}}});
