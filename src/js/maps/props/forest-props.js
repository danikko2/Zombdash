//# maps/props/forest-props.js — Forest and farm props for custom maps: more trees (big, autumn, birch, spruce, willow, dead), long grass, ferns, reeds, crops, big rotting fallen trees
// Leaves and grass take a colour (obc in maps/props/home-props.js), so a forest can be green, autumn or enchanted purple.
const PLEAF=[['#3f8a42','Green'],['#2f6b46','Dark green'],['#7ab84a','Light green'],['#d8742a','Orange'],['#b83a2a','Red'],['#d8b42a','Yellow'],['#6a4a8a','Purple'],['#3a6a6a','Teal']];
const PAUT=[PLEAF[3],PLEAF[4],PLEAF[5],PLEAF[0],PLEAF[1],PLEAF[2],PLEAF[6],PLEAF[7]];
const PCON=[PLEAF[1],PLEAF[0],['#2a4a3e','Blue spruce'],PLEAF[3],PLEAF[7],['#e8ece8','Snowy']];
const PGRS=[['#4f9a3c','Green'],['#7aa83a','Light green'],['#b8a44a','Dry'],['#8a7a3a','Dead'],['#3f7a52','Dark green']];
const PBARK=[['#5a4a3c','Grey-brown'],['#3a302a','Dark'],['#8a8a84','Bleached'],['#6b4a2a','Brown']];
const fH=(a,b)=>{const v=Math.sin(a*12.9898+b*78.233+3.7)*43758.5453;return v-Math.floor(v)};
// a round leafy canopy from blobs [[cx,cy,r],...]: dark edge, lighter layers towards the top left, and hanging leaf strokes
function fpCan(q,B,K,seed){const lay=(c,dx,dy,k)=>{q.fillStyle=c;q.beginPath();for(const[x,y,r]of B){q.moveTo(x+dx+r*k,y+dy);q.arc(x+dx,y+dy,r*k,0,7)}q.fill()};
lay(K.x,0,0,1);lay(K.dd,-.5,-1,.93);lay(K.d,-1.5,-2.5,.78);lay(K.b,-2.5,-4.5,.56);lay(K.l,-3.5,-6,.3);
for(let i=0;i<B.length*7;i++){const[x,y,r]=B[i%B.length],a=fH(i,seed)*6.283,d=Math.sqrt(fH(seed,i))*r*.8,px=Math.round(x+Math.cos(a)*d),py=Math.round(y+Math.sin(a)*d);
if(py>y-r*.2){R_(q,K.x,px,py,1,3);R_(q,K.dd,px+1,py+1,1,2)}else R_(q,K.ll,px,py,2,1)}}
// a trunk x..x+w down to the base at y+h, with a dark side and a little root flare
function fpTrunk(q,x,y,w,h,c){c=c||['#6b4a2a','#4a3220','#8a6440'];R_(q,c[0],x,y,w,h);R_(q,c[1],x+w-Math.max(2,w>>2),y,Math.max(2,w>>2),h);R_(q,c[2],x+1,y,Math.max(1,w>>3),h);R_(q,c[0],x-2,y+h-3,w+4,3);R_(q,c[1],x-2,y+h-1,w+4,1)}
// a conifer: n tiers of branches from the top (cx,top) down to bottom, trunk below
function fpCone(q,cx,top,bot,maxw,n,K){const th=(bot-top)/((n-1)*.82+1.25);for(let k=0;k<n;k++){const y0=top+k*th*.82,hw=maxw/2*(k+1.2)/(n+.2),y1=y0+th*1.25;
q.fillStyle=K.x;q.beginPath();q.moveTo(cx,y0-1);q.lineTo(cx+hw+1,y1+1);q.lineTo(cx-hw-1,y1+1);q.fill();q.fillStyle=K.d;q.beginPath();q.moveTo(cx,y0);q.lineTo(cx+hw,y1);q.lineTo(cx-hw,y1);q.fill();
q.fillStyle=K.b;q.beginPath();q.moveTo(cx,y0+1);q.lineTo(cx-hw+2,y1-1);q.lineTo(cx-1,y1-1);q.fill();R_(q,K.dd,cx-hw+2,y1-2,hw*2-4,2);R_(q,K.l,cx-hw*.5,y0+th*.6,Math.max(2,hw*.35),1)}}
// a lying trunk from x0 to x1, top y, thickness t, bark colour set B
function fpLog(q,x0,x1,y,t,B,seed){R_(q,B[1],x0,y,x1-x0,t);R_(q,B[0],x0,y+1,x1-x0,t-4);R_(q,B[2],x0,y+1,x1-x0,3);R_(q,'#2a1e14',x0,y+t-2,x1-x0,2);
for(let x=x0+2;x<x1-2;x+=3+Math.floor(fH(x,seed)*4)){const yy=y+3+Math.floor(fH(seed,x)*(t-8)),L=2+Math.floor(fH(x,seed+1)*5);R_(q,B[1],x,yy,L,1)}}
function fpMoss(q,x,y,w){for(let i=0;i<w;i+=3){const h=1+Math.floor(fH(i,x)*3);R_(q,'#4f6e2e',x+i,y-h+1,3,h+1);R_(q,'#6e9040',x+i,y-h+1,2,1)}}
function fpFungus(q,x,y,s){R_(q,'#a88a5a',x,y+s-1,s*2,2);R_(q,'#d8c49a',x,y,s*2,s);R_(q,'#efe2c0',x+1,y,s,1)}
function fpBlades(q,x0,w,base,hmin,hmax,n,K,seed){for(let i=0;i<n;i++){const x=x0+Math.floor(fH(i,seed)*w),h=hmin+Math.floor(fH(seed,i)*(hmax-hmin)),lean=(fH(i,seed+3)-.5)*.5,c=[K.d,K.b,K.dd,K.l][i%4];
for(let t=0;t<h;t++)R_(q,t>h-3?K.ll:c,Math.round(x+lean*t*t/h),base-t,t<h*.5?2:1,1)}}
// a plain soil strip for crop rows
function fpRow(q,x,y,w){R_(q,'#4a3622',x,y,w,4);R_(q,'#6e5234',x,y,w,1)}
Object.assign(OB,{
// trees
oak:obc(66,76,[10,6],PLEAF,(q,v,K)=>{fpTrunk(q,29,48,8,26);fpCan(q,[[33,30,22],[16,38,13],[50,38,13],[22,19,13],[44,19,13],[33,44,14]],K,1)}),
oak_b:obc(106,118,[18,8],PLEAF,(q,v,K)=>{fpTrunk(q,45,70,16,46);R_(q,'#4a3220',40,112,4,4);R_(q,'#4a3220',62,112,4,4);fpCan(q,[[53,46,34],[24,58,20],[82,58,20],[30,28,20],[76,28,20],[53,22,22],[53,70,20]],K,2)}),
maple:obc(60,72,[8,6],PAUT,(q,v,K)=>{fpTrunk(q,27,50,6,20);fpCan(q,[[30,28,20],[15,34,11],[45,34,11],[30,13,12],[30,44,12]],K,3)}),
birch:obc(46,84,[8,6],[PLEAF[2],PLEAF[0],PLEAF[5],PLEAF[3],PLEAF[1]],(q,v,K)=>{R_(q,'#e8e6dc',20,26,6,56);R_(q,'#b8b6ac',24,26,2,56);for(let y=30;y<80;y+=5+((y*7)%4))R_(q,'#26262c',20+((y*3)%3),y,3,1);R_(q,'#e8e6dc',18,79,10,3);
q.strokeStyle='#d8d6cc';q.lineWidth=2;q.beginPath();q.moveTo(23,44);q.lineTo(14,34);q.moveTo(23,40);q.lineTo(32,30);q.stroke();fpCan(q,[[23,20,13],[12,27,9],[34,27,9],[23,9,9],[16,36,7],[31,35,7]],K,4)}),
spruce:obc(54,106,[12,8],PCON,(q,v,K)=>{fpTrunk(q,24,92,6,12);fpCone(q,27,2,94,50,6,K)}),
pine_g:obc(88,146,[18,10],PCON,(q,v,K)=>{fpTrunk(q,39,126,10,18);fpCone(q,44,2,128,84,8,K)}),
willow:obc(86,90,[12,8],PLEAF,(q,v,K)=>{fpTrunk(q,39,52,8,36);fpCan(q,[[43,30,26],[22,38,16],[64,38,16],[43,16,17]],K,5);for(let x=10;x<77;x+=3){if(x>34&&x<52&&(x/3)%2)continue;const top=40+Math.abs(x-43)*.12,len=12+Math.floor(fH(x,6)*18);R_(q,K.x,x,top,2,len+1);R_(q,(x/3)%2?K.d:K.b,x,top,1,len);R_(q,K.l,x,top+len-3,1,2)}}),
deadtree:obc(74,90,[12,8],PBARK,(q,v,K)=>{q.strokeStyle=K.dd;q.lineCap='round';const br=(x,y,a,L,w,d)=>{const x2=x+Math.cos(a)*L,y2=y+Math.sin(a)*L;q.lineWidth=w;q.beginPath();q.moveTo(x,y);q.lineTo(x2,y2);q.stroke();if(d>0){br(x2,y2,a-.45-fH(d,L)*.3,L*.7,Math.max(1,w*.62),d-1);br(x2,y2,a+.4+fH(L,d)*.3,L*.66,Math.max(1,w*.6),d-1)}};
br(37,86,-1.57,30,8,3);q.strokeStyle=K.b;br(36,86,-1.6,28,3,0);R_(q,K.dd,30,84,14,4);R_(q,K.x,32,60,3,2);R_(q,K.b,34,72,1,8)}),
sapling:obc(26,38,0,PLEAF,(q,v,K)=>{R_(q,'#6b4a2a',12,20,2,16);R_(q,'#4a3220',10,35,6,2);fpCan(q,[[13,14,9],[7,19,6],[19,19,6]],K,7)}),
// ground cover
tgrass:obc(30,26,0,PGRS,(q,v,K)=>fpBlades(q,3,24,24,9,22,16,K,8)),
tgrass_w:obc(68,30,0,PGRS,(q,v,K)=>fpBlades(q,3,62,28,8,24,40,K,9)),
reeds:ob(26,38,0,q=>{for(let i=0;i<6;i++){const x=4+i*3+(i%2),h=22+((i*7)%10);R_(q,i%2?'#4f8a3a':'#3f7a2a',x,36-h,1,h);if(i%2==0){R_(q,'#6a4228',x-1,36-h-1,3,8);R_(q,'#8a5a32',x-1,36-h-1,1,6);R_(q,'#4f8a3a',x,36-h-4,1,3)}}for(let i=0;i<4;i++){R_(q,'#5aa04a',3+i*6,30-i%2*6,1,7);R_(q,'#5aa04a',4+i*6,28-i%2*6,2,1)}R_(q,'#3f7a2a',2,35,22,2)}),
fern:obc(34,24,0,PGRS.concat([PLEAF[1]]),(q,v,K)=>{const L=[[-1.2,13],[-.7,15],[-.25,14],[.25,14],[.7,15],[1.2,13],[-1.5,9],[1.5,9]];L.forEach(([a,len],k)=>{for(let t=0;t<len;t++){const x=Math.round(17+Math.sin(a)*t),y=Math.round(22-Math.cos(a)*t*.8-t*t*.01);R_(q,K.d,x,y,1,1);if(t>1&&t%2==0){R_(q,k%2?K.b:K.l,x-2,y,2,1);R_(q,K.b,x+1,y,2,1)}}});R_(q,K.dd,15,21,4,2)}),
// fallen trees, rotting
bigfall:obc(160,48,[146,24],PBARK.slice(3).concat(PBARK.slice(0,3)),(q,v,K)=>{const B=[K.b,K.dd,K.l];
q.strokeStyle=K.dd;q.lineWidth=3;q.beginPath();q.moveTo(140,24);q.lineTo(152,10);q.moveTo(146,26);q.lineTo(158,22);q.moveTo(132,40);q.lineTo(142,46);q.stroke();q.lineWidth=1;q.beginPath();q.moveTo(152,10);q.lineTo(156,4);q.moveTo(150,12);q.lineTo(145,5);q.stroke();
fpLog(q,12,146,20,24,B,11);R_(q,K.dd,140,22,8,20);
q.fillStyle='#b89a6a';q.beginPath();q.moveTo(14,20);q.lineTo(6,22);q.lineTo(10,26);q.lineTo(3,30);q.lineTo(9,34);q.lineTo(4,39);q.lineTo(14,44);q.fill();q.fillStyle='#3a2a1a';q.beginPath();q.ellipse(14,32,5,9,0,0,7);q.fill();q.fillStyle='#8a6a44';q.fillRect(9,25,2,14);
for(const[x,w]of[[24,22],[60,16],[96,26]])fpMoss(q,x,21,w);for(const[x,y,rx]of[[44,30,6],[82,33,5],[118,29,4]]){q.fillStyle='#8a6a44';q.beginPath();q.ellipse(x,y,rx+1,3.5,0,0,7);q.fill();q.fillStyle='#24180e';q.beginPath();q.ellipse(x,y,rx,2.5,0,0,7);q.fill()}
for(const[x,s]of[[34,3],[38,2],[70,3],[106,2],[110,3]])fpFungus(q,x,38,s);R_(q,'#c04a3a',90,17,3,2);R_(q,'#efe2c0',91,17,1,1);R_(q,'#7a8a4a',52,42,10,2)}),
fallroot:obc(144,64,[112,22],PBARK.slice(3).concat(PBARK.slice(0,3)),(q,v,K)=>{const B=[K.b,K.dd,K.l];q.strokeStyle=K.dd;q.lineWidth=2;q.beginPath();q.moveTo(126,44);q.lineTo(138,30);q.lineTo(142,24);q.moveTo(132,50);q.lineTo(142,58);q.moveTo(134,40);q.lineTo(140,40);q.stroke();
fpLog(q,40,132,40,20,B,12);R_(q,K.dd,128,42,6,16);fpMoss(q,60,41,18);fpMoss(q,96,41,10);fpFungus(q,76,54,3);fpFungus(q,84,55,2);
q.lineCap='round';for(let i=0;i<16;i++){const a=i/16*6.283+fH(i,13)*.3,r2=26+fH(i,14)*9,b=a+(fH(i,15)-.5)*.6;q.strokeStyle=i%3?'#5a4128':'#6b4a2a';q.lineWidth=i%2?2:3;q.beginPath();q.moveTo(26+Math.cos(a)*18,34+Math.sin(a)*19);q.quadraticCurveTo(26+Math.cos(a)*(r2-4),34+Math.sin(a)*(r2-4),26+Math.cos(b)*r2,34+Math.sin(b)*r2);q.stroke()}
q.fillStyle='#33241a';q.beginPath();q.ellipse(26,34,23,25,0,0,7);q.fill();q.fillStyle='#4e3922';q.beginPath();q.ellipse(25,33,21,23,0,0,7);q.fill();
for(const[x,y,rx,ry]of[[19,25,8,6],[31,38,7,5],[22,43,6,4],[33,24,5,4]]){q.fillStyle='#6a4f32';q.beginPath();q.ellipse(x,y,rx,ry,.4,0,7);q.fill()}
q.strokeStyle='#2a1c12';q.lineWidth=1;for(let i=0;i<6;i++){const x=12+fH(i,16)*26,y=16+fH(i,17)*32;q.beginPath();q.moveTo(x,y);q.lineTo(x+3+fH(i,18)*4,y+1+fH(i,19)*3);q.stroke()}
for(const[x,y]of[[14,30],[27,17],[36,32],[24,49],[16,40]]){R_(q,'#8a6a44',x,y,3,3);R_(q,'#3e2c1a',x+1,y+1,1,1)}R_(q,'#8a8f96',30,44,4,3);R_(q,'#7c8089',17,20,3,2);R_(q,'#a8adb7',31,44,2,1)}),
rotlog:obc(78,34,[70,18],PBARK.slice(3).concat(PBARK.slice(0,3)),(q,v,K)=>{fpLog(q,8,76,10,22,[K.b,K.dd,K.l],14);R_(q,K.dd,72,12,4,18);q.fillStyle='#8a6a44';q.beginPath();q.ellipse(9,21,7,11,0,0,7);q.fill();q.fillStyle='#24180e';q.beginPath();q.ellipse(9,21,5,9,0,0,7);q.fill();q.fillStyle='#3a2a1a';q.fillRect(7,24,4,4);
fpMoss(q,20,11,20);fpMoss(q,52,11,10);fpFungus(q,30,26,3);fpFungus(q,56,27,2);R_(q,'#c04a3a',46,7,4,3);R_(q,'#efe2c0',47,7,1,1);R_(q,'#e8e0c8',47,10,2,2);R_(q,'#2a1e14',36,18,10,1);R_(q,'#2a1e14',44,18,1,4)}),
logpile:obc(54,36,[48,20],PBARK.slice(3).concat(PBARK.slice(0,3)),(q,v,K)=>{const end=(x,y,r)=>{q.fillStyle=K.dd;q.beginPath();q.arc(x,y,r+1,0,7);q.fill();q.fillStyle=K.b;q.beginPath();q.arc(x,y,r,0,7);q.fill();q.fillStyle='#c8a070';q.beginPath();q.arc(x,y,r-2,0,7);q.fill();if(r>5){q.strokeStyle='#a88050';q.lineWidth=1;q.beginPath();q.arc(x,y,r-4,0,7);q.stroke()}R_(q,'#8a6440',x-1,y-1,2,2)};
for(const x of[12,27,42])end(x,26,7);for(const x of[19.5,34.5])end(x,13,7);end(27,4,3.5)}),
// farm crops (not solid: walk through them, or turn Solid on)
corn_r:ob(68,52,0,q=>{fpRow(q,2,46,64);for(let i=0;i<5;i++){const cx=7+i*13,o=(i*7)%3,ry=48;R_(q,'#4f8a2a',cx,ry-40-o,3,40+o);R_(q,'#6aa83a',cx-6,ry-20,6,2);R_(q,'#6aa83a',cx+3,ry-27,6,2);R_(q,'#6aa83a',cx-5,ry-33,5,2);R_(q,'#3f7a2a',cx+3,ry-19,5,9);R_(q,'#f0d050',cx+4,ry-18,3,7);R_(q,'#d8b870',cx-1,ry-43-o,5,3);R_(q,'#3f7a2a',cx+1,ry-6,1,4)}}),
wheat:ob(68,34,0,q=>{for(let x=3;x<65;x+=2){const top=6+Math.floor(fH(x,15)*8),lean=Math.round((fH(15,x)-.5)*2);R_(q,x%4?'#c8a83a':'#b0902a',x,top+5,1,30-top-5);R_(q,'#e0c25a',x+lean,top,2,6);R_(q,'#a8882a',x+lean,top+1,1,1);R_(q,'#a8882a',x+lean+1,top+3,1,1)}R_(q,'#9a7a2a',2,31,64,2)}),
cabbage:ob(68,24,0,q=>{fpRow(q,2,18,64);for(let i=0;i<4;i++){const cx=10+i*16,cy=13;q.fillStyle='#3f7a32';q.beginPath();q.arc(cx,cy,8,0,7);q.fill();q.fillStyle='#5a9a4a';q.beginPath();q.arc(cx,cy-1,7,0,7);q.fill();q.fillStyle='#9ad06a';q.beginPath();q.arc(cx,cy-1,4,0,7);q.fill();R_(q,'#c0e890',cx-2,cy-3,2,2);R_(q,'#4a8a3a',cx-6,cy,4,1);R_(q,'#4a8a3a',cx+3,cy+2,4,1)}}),
pumpkin:ob(64,32,0,q=>{q.strokeStyle='#3f7a2a';q.lineWidth=2;q.beginPath();q.moveTo(3,24);q.bezierCurveTo(16,10,30,30,44,16);q.bezierCurveTo(52,10,58,20,61,14);q.stroke();for(const[x,y]of[[10,15],[26,22],[38,12],[54,12]]){q.fillStyle='#3f7a2a';q.beginPath();q.arc(x,y,5,0,7);q.fill();q.fillStyle='#5a9a3a';q.beginPath();q.arc(x-1,y-1,3,0,7);q.fill()}
for(const[x,y,r]of[[18,22,7],[44,24,5],[33,25,4]]){q.fillStyle='#c85a1a';q.beginPath();q.ellipse(x,y,r*1.3,r,0,0,7);q.fill();q.fillStyle='#e8782a';q.beginPath();q.ellipse(x-1,y-1,r*1.15,r*.85,0,0,7);q.fill();R_(q,'#c85a1a',x-1,y-r+1,1,r*2-2);R_(q,'#c85a1a',x+Math.round(r*.6),y-r+2,1,r*2-4);R_(q,'#f0a050',x-Math.round(r*.7),y-2,2,2);R_(q,'#5a7a2a',x-1,y-r-2,3,3)}}),
tomato:ob(64,40,0,q=>{fpRow(q,2,34,60);for(let i=0;i<3;i++){const cx=12+i*20;R_(q,'#8a6a42',cx,4,2,32);for(const[dx,dy,r]of[[-4,10,6],[4,14,6],[-3,20,6],[4,25,5],[0,6,4]]){q.fillStyle='#2f6b2a';q.beginPath();q.arc(cx+dx,dy,r,0,7);q.fill();q.fillStyle='#4a8a3a';q.beginPath();q.arc(cx+dx-1,dy-1,r-2,0,7);q.fill()}
for(const[dx,dy]of[[-5,13],[5,18],[-2,24],[3,9],[6,27]]){R_(q,'#b82a1a',cx+dx,dy,3,3);R_(q,'#e84a3a',cx+dx,dy,2,2);R_(q,'#ffb0a0',cx+dx,dy,1,1)}}}),
carrot_r:ob(64,22,0,q=>{fpRow(q,2,16,60);for(let cx=6;cx<60;cx+=9){R_(q,'#5aa83a',cx-3,8,2,6);R_(q,'#5aa83a',cx,4,2,10);R_(q,'#5aa83a',cx+3,8,2,6);R_(q,'#7ac04a',cx,4,2,3);R_(q,'#e8782a',cx-1,13,5,4);R_(q,'#c85a1a',cx-1,16,5,1)}}),
sunflow:ob(58,56,0,q=>{fpRow(q,2,50,54);for(const[cx,top]of[[11,10],[29,4],[47,12]]){R_(q,'#4a8a2a',cx,top+8,2,52-top-8);R_(q,'#5aa03a',cx-7,top+22,7,3);R_(q,'#5aa03a',cx+2,top+28,7,3);q.fillStyle='#f0c020';for(let k=0;k<10;k++){const a=k/10*6.283;q.beginPath();q.ellipse(cx+1+Math.cos(a)*6,top+Math.sin(a)*6,3,1.6,a,0,7);q.fill()}
q.fillStyle='#5a3a1a';q.beginPath();q.arc(cx+1,top,4.5,0,7);q.fill();R_(q,'#3a2410',cx-1,top-1,1,1);R_(q,'#3a2410',cx+2,top+1,1,1);R_(q,'#7a5a2a',cx,top-3,2,1)}})
});
