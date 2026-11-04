//# maps/props/kit-forest.js — Kit props for the Enchanted Forest: its teal and violet oaks and black pines (shared canopy pictures), lanterns on posts along the paths (lit, broken, knocked over), the crossroads signpost, a stone chimney, a shelf of glowing potions, log-cabin corners
// ---------- the Enchanted Forest's pieces ----------
// the forest's tree tops: twisted teal oaks (k 0), violet oaks (k 1) and black pines (k 2); the City Park's green oaks (k 3, 4);
// one picture per kind, size and shade
function efSpr(k,r,v){const key=k+'_'+r+'_'+Math.floor(v*3),K=efSpr.K||(efSpr.K={});if(K[key]&&K[key].width)return K[key];const R=r+2,cv=document.createElement('canvas');cv.width=R*2+2;cv.height=k==2?Math.ceil(r*2.4)+4:R*2+2;const g=cv.getContext('2d'),x=R+1;
if(k==2){const y=cv.height-2;for(let i=0;i<3;i++){const w=r*(1-i*.25),yy=y-i*r*.45;g.fillStyle='#0c0a10';g.beginPath();g.moveTo(x-w-1,yy+1);g.lineTo(x,yy-r*.9-1);g.lineTo(x+w+1,yy+1);g.fill();g.fillStyle=i==2?'#24403a':'#18302c';g.beginPath();g.moveTo(x-w,yy);g.lineTo(x,yy-r*.85);g.lineTo(x+w,yy);g.fill()}}
else{const cy=R+1,P_=k==3?(v<.5?['#2a6a2e','#3a8a3a','#5aaa4a']:['#2f702c','#448e36','#68b04c']):k==4?(v<.5?['#3a7a2a','#5a9a32','#8ac04a']:['#2e6630','#3f8a3e','#62a85a']):k==1?['#2e2440','#3e3058','#5a4a7a']:v<.5?['#1e3a36','#2a4e48','#3e6a62']:['#203430','#2e4a40','#4a6a58'];g.fillStyle='#0c0a10';g.beginPath();g.arc(x,cy,r+1,0,7);g.fill();g.fillStyle=P_[0];g.beginPath();g.arc(x,cy,r,0,7);g.fill();g.fillStyle=P_[1];g.beginPath();g.arc(x-r*.3,cy-r*.3,r*.55,0,7);g.fill();g.beginPath();g.arc(x+r*.35,cy-r*.05,r*.42,0,7);g.fill();g.fillStyle=P_[2];g.globalAlpha=.6;g.beginPath();g.arc(x-r*.4,cy-r*.45,r*.24,0,7);g.fill();g.globalAlpha=1;
 if(k<3)for(let i=0;i<4;i++){g.fillStyle='rgba(8,6,10,.5)';g.fillRect(x-r*.6+i*r*.35,cy+r*.1+(i%2)*3,2,r*.5)}}
return K[key]=cv}
// an enchanted tree: var picks the size and shade (var = (size step × 3 + shade) / 100; oaks 18–27 px canopy radius, pines 14–19).
// Its trunk blocks like the Suburb's trees; the Enchanted Forest's own trees stand in dense woods (a `woods` shape, which stops
// people) and leave their trunks out (solid off). The canopy joins the walk-behind list as one shared picture per size and shade
// (kpWB), so thousands of them cost no extra memory.
function kpETree(k){const pine=k==2,b=pine?14:18,n=pine?6:10;return{w:pine?44:60,h:pine?60:64,c:[12,12],cf:2,f(g,x,y,v){const i=Math.round(cl(+v||0,0,1)*100),s=i%3,r=b+Math.floor(i/3)%n,ty=y-6,sp=efSpr(k,r,(s+.5)/3);
 g.fillStyle='rgba(0,0,0,.35)';g.beginPath();g.ellipse(x+4,ty+2,r*.9,r*.45,0,0,7);g.fill();g.fillStyle='#0c0a10';g.fillRect(x-4,ty-7,8,10);g.fillStyle='#2e2420';g.fillRect(x-3,ty-7,6,9);
 const sx=Math.round(x-sp.width/2),sy=pine?Math.round(ty-10-sp.height+2):Math.round(ty-r*.7-sp.height/2);g.drawImage(sp,sx,sy);kpWB(g,sp,sx,sy,y,12)}}}
function efShroom(q,C){for(const[x,y,w]of[[3,5,7],[12,2,9],[9,8,6]]){R_(q,'#e8e0c8',x+w/2-1,y+3,2,13-y-3);R_(q,C[2],x,y+2,w,2);R_(q,C[0],x,y,w,3);R_(q,C[1],x+1,y,Math.max(1,w/3),1)}}
const EF={o:'#16111c',w:'#5a3a22',wl:'#7a4f2a',ir:'#3a3a44',gl:'#ffd27a',gw:'#fff2c8'};
// an iron street lamp with a four-pane lantern on top (the road's lights); a failing one stutters and its glass is dim
function efGas(on){return Object.assign(ob(24,96,[8,8],q=>{R_(q,EF.o,5,86,14,10);R_(q,'#2e2e36',6,87,12,8);R_(q,'#44444e',6,87,12,2);R_(q,EF.o,9,22,6,66);R_(q,'#2e2e36',10,23,4,64);R_(q,'#4a4a56',10,23,1,64);
 for(const y of[40,70]){R_(q,EF.o,7,y,10,4);R_(q,'#3a3a44',8,y+1,8,2)}R_(q,EF.o,4,20,16,4);R_(q,'#3a3a44',5,21,14,2);R_(q,EF.o,5,6,14,15);R_(q,on?EF.gl:'#8a7040',6,7,12,13);R_(q,on?EF.gw:'#b8985a',8,9,8,8);R_(q,EF.o,11,7,2,13);
 R_(q,EF.o,3,3,18,4);R_(q,'#3a3a44',4,4,16,2);R_(q,EF.o,9,0,6,4);R_(q,'#3a3a44',10,1,4,2)}),{wb:1,nr:1,lt:[Object.assign({dx:0,dy:-82,r:150,i:.95,c:'#ffd9a0'},on?{}:{f:'fault'})]})}
Object.assign(OB,{eoak:kpETree(0),eoakv:kpETree(1),epine:kpETree(2),gaslamp:efGas(1),gaslampf:efGas(0),
// lampost: a lantern hanging from a wooden post along a path (it flickers); lampostd: the same with its glass smashed, dark;
// lampostx: one knocked flat, the lantern broken on the ground
lampost:Object.assign(ob(34,76,[8,8],q=>{R_(q,EF.o,8,10,8,66);R_(q,EF.w,9,11,6,64);R_(q,EF.wl,9,11,2,64);R_(q,EF.o,6,70,12,6);R_(q,'#3a2a1a',7,71,10,4);R_(q,EF.o,8,10,22,4);R_(q,EF.ir,9,11,20,2);R_(q,EF.o,25,12,2,6);
 R_(q,EF.o,20,18,12,18);R_(q,'#26262c',21,19,10,16);R_(q,EF.gl,22,21,8,12);R_(q,EF.gw,24,23,4,8);R_(q,EF.o,19,17,14,3);R_(q,EF.o,21,35,10,2)}),{wb:1,nr:1,lt:[{dx:9,dy:-49,r:120,i:.9,f:'flk',c:'#ffc870'}]}),
lampostd:Object.assign(ob(34,76,[8,8],q=>{R_(q,EF.o,8,10,8,66);R_(q,EF.w,9,11,6,64);R_(q,EF.wl,9,11,2,64);R_(q,EF.o,6,70,12,6);R_(q,'#3a2a1a',7,71,10,4);R_(q,EF.o,8,10,22,4);R_(q,EF.ir,9,11,20,2);R_(q,EF.o,25,12,2,6);
 q.save();q.translate(26,19);q.rotate(.35);R_(q,EF.o,-6,0,12,18);R_(q,'#26262c',-5,1,10,16);R_(q,'#1a1a20',-4,3,8,12);R_(q,'#8ab0c8',-4,4,2,3);R_(q,'#8ab0c8',2,9,2,2);q.restore();R_(q,'#c8d8e8',18,72,2,1);R_(q,'#c8d8e8',24,73,1,1)}),{wb:1}),
lampostx:{w:76,h:30,c:0,f:(g,x,y,v)=>S2(g,x,y,76,30,q=>{q.save();q.translate(8,22);q.rotate(-.12);R_(q,EF.o,0,-4,62,9);R_(q,EF.w,1,-3,60,7);R_(q,EF.wl,1,-3,60,2);R_(q,EF.o,58,-8,4,16);R_(q,EF.ir,59,-7,2,14);q.restore();
 R_(q,EF.o,62,14,12,12);R_(q,'#26262c',63,15,10,10);R_(q,'#3a3020',64,17,8,6);for(const[a,b]of[[56,24],[70,10],[50,20],[66,27]])R_(q,'#c8d8e8',a,b,2,1);R_(q,'#2a2016',2,24,8,4)})},
// xsign: an old crossroads signpost, one board pointing left and one right (your text: left|right)
xsign:{w:156,h:78,c:[8,8],txt:24,dt:'MANSION|CITY',f:(g,x,y,v,col,t)=>S2(g,x,y,156,78,q=>{const[a,b]=kpLines(cmTxt(t,24)||'MANSION|CITY');R_(q,EF.o,74,4,9,74);R_(q,EF.w,75,5,7,72);
 for(const[dy,s,dir]of[[10,a,-1],[32,b,1]]){if(!s)continue;const w=72,bx=dir<0?6:78;R_(q,EF.o,bx-1,dy-1,w+2,18);R_(q,'#8a6a3a',bx,dy,w,16);R_(q,'#6a4a28',bx,dy+12,w,2);q.fillStyle=EF.o;q.beginPath();dir<0?(q.moveTo(bx-6,dy+8),q.lineTo(bx,dy-1),q.lineTo(bx,dy+17)):(q.moveTo(bx+w+6,dy+8),q.lineTo(bx+w,dy-1),q.lineTo(bx+w,dy+17));q.fill();kpText(q,s.toUpperCase(),bx+w/2,dy+7.5,w-8,10,'#e8d8a8')}})},
// chimney: a fieldstone chimney (smoke goes on top: put a `smoke` effect 92 px above its foot)
chimney:Object.assign(ob(40,96,[32,20],q=>{R_(q,EF.o,4,8,32,88);R_(q,'#6a6258',5,9,30,86);for(let y=12;y<92;y+=8)for(let x=(y/8)%2?5:11;x<33;x+=12){R_(q,'#7e766a',x,y,10,6);R_(q,'#4a443c',x,y+6,10,1)}R_(q,EF.o,0,2,40,10);R_(q,'#5a544a',1,3,38,8);R_(q,'#1a1614',10,4,20,4)}),{wb:1}),
// potshelf: a shelf of potion bottles glowing green, violet and amber (they light the room a little)
potshelf:Object.assign(ob(64,48,[60,12],q=>{R_(q,EF.o,2,2,60,46);R_(q,'#4a3424',3,3,58,44);for(const y of[16,30,44])R_(q,'#2a1e16',3,y,58,3);const C=['#7aff8a','#b48aff','#ffc850','#ff6a8a','#6ae8ff'];
 for(let r=0;r<3;r++)for(let i=0;i<5;i++){const x=7+i*11+(r%2)*3,y=r*14+4,c=C[(i+r*2)%5];R_(q,EF.o,x-1,y+2,8,11);R_(q,c,x,y+3,6,9);R_(q,'rgba(255,255,255,.5)',x+1,y+4,1,4);R_(q,'#8a6a3a',x+2,y,2,3)}}),{wb:1,nr:1,lt:[{dx:0,dy:-24,r:64,i:.6,c:'#b48aff'}]}),
// gshroom: a cluster of glowing mushrooms giving off a faint steady light (cyan; gshroomv violet). Walk over them.
gshroom:Object.assign(ob(22,14,0,q=>efShroom(q,['#6ae8c8','#b8fff0','#2a8a8a'])),{nr:1,lt:[{dx:0,dy:-6,r:42,i:.75,c:'#8ae8ff',ng:1}]}),
gshroomv:Object.assign(ob(22,14,0,q=>efShroom(q,['#b48aff','#e8d8ff','#5a3a9a'])),{nr:1,lt:[{dx:0,dy:-6,r:42,i:.75,c:'#c89aff',ng:1}]}),
// logcorner: the notched log ends at a log cabin's corner (put one on each corner of `logs` walls)
logcorner:{w:20,h:20,c:0,dk:1,f:(g,x,y,v)=>S2(g,x,y,20,20,q=>{for(const[a,b]of[[2,4],[2,12]]){R_(q,EF.o,a-2,b-1,22,7);R_(q,'#6a4a2c',a-1,b,20,5);R_(q,'#8a5f36',a-1,b,20,1)}for(const[a,b]of[[3,6],[11,6]]){q.fillStyle=EF.o;q.beginPath();q.arc(a+3,b+7,4,0,7);q.fill();q.fillStyle='#b88a58';q.beginPath();q.arc(a+3,b+7,3,0,7);q.fill();q.fillStyle='#8a5f36';q.fillRect(a+2,b+6,2,2)}})}});
