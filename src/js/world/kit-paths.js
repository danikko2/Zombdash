//# world/kit-paths.js — Building kit paths: lines through points, smoothed into curves: roads (centre lines, lanes, curbs, cul-de-sac ends), highway lanes and ramps, cobbled roads, trails, gravel paths, sidewalks, boardwalks, railroad, streams, painted lines, skid marks and ruts; fences, iron fences, pickets, rails, hedges, barbed wire, guard rails, medians, sandbags and walls along a line; ponds, beaches, clearings and other free-shaped patches
// ---------- paths ----------
// A path is x,y (its first point) with pts relative to it, so moving it only changes x,y. f(g,P,o) draws it through the smoothed
// world points P; o.w is its width, o.c its colour, o.o its options. Barriers (fl set) collide as a chain of small boxes along
// the line; closed shapes that block (ponds) collide as thin rows inside the outline. sharp:1 keeps straight corners (fences and painted
// lines by default; a piece's own sharp true / false wins).
const CMPCAT=[['road','Roads'],['path','Paths & tracks'],['line','Lines & marks'],['barrier','Fences, rails & walls'],['shape','Ponds & patches']];
function po(o,k,def){const v=o.o&&o.o[k];return v==null?def:v}
// scatter small marks along the line (within the width)
function pthSpeck(g,P,o,w,step,cols,sz,k){let i=0;cmAlong(P,step,(x,y,a)=>{const u=(cmR(o,i,k)-.5)*w,nx=-Math.sin(a),ny=Math.cos(a);g.fillStyle=cols[i%cols.length];g.fillRect(x+nx*u,y+ny*u,sz||2,(sz||2)-((i%2)?1:0)||1);i++})}
// draw along each segment in its own frame: fn(g, length) with x along the segment and y across it
function pthSeg(g,P,fn){for(let i=1;i<P.length;i++){const a=P[i-1],b=P[i],L=Math.hypot(b[0]-a[0],b[1]-a[1]);if(L<.5)continue;g.save();g.translate(a[0],a[1]);g.rotate(Math.atan2(b[1]-a[1],b[0]-a[0]));try{fn(g,L,i)}finally{g.restore()}}}
// cross marks (ties, planks, slab joints) every step px along the line, w wide
function pthTies(g,P,step,w,t,c){g.fillStyle=c;cmAlong(P,step,(x,y,a)=>{g.save();g.translate(x,y);g.rotate(a);g.fillRect(-t/2,-w/2,t,w);g.restore()})}
const PPROAD=[['dash','Yellow dashed'],['double','Double yellow'],['solid','Yellow line'],['white','White dashed'],['none','None']];
function pthRoad(g,P,o){const w=o.w||128,sf=po(o,'s','asphalt'),col=sf=='dark'?'#3e4046':sf=='worn'?'#42454a':'#3d4045';const ends=po(o,'ends','flat'),R=w*.9,last=P[P.length-1],first=P[0];
if(po(o,'curb',1)){cmLine(g,P,w+8,'#8a8a84','butt');if(ends!='flat'){const E=ends=='both'?[first,last]:[last];for(const q of E){g.fillStyle='#8a8a84';g.beginPath();g.arc(q[0],q[1],R+4,0,7);g.fill()}}}
cmLine(g,P,w,col,'butt');if(ends!='flat'){const E=ends=='both'?[first,last]:[last];for(const q of E){g.fillStyle=col;g.beginPath();g.arc(q[0],q[1],R,0,7);g.fill()}}
pthSpeck(g,P,o,w-6,7,['rgba(0,0,0,.14)','rgba(255,255,255,.05)','rgba(0,0,0,.1)'],2,40);if(sf=='worn'){let i=0;cmAlong(P,90,(x,y,a)=>{const u=(cmR(o,i,41)-.5)*w*.7;crack(g,x-Math.sin(a)*u,y+Math.cos(a)*u,6,'rgba(10,10,10,.5)');i++})}
const cl_=po(o,'cl','dash'),Y='rgba(230,190,60,.88)',Wt='rgba(236,235,228,.85)',ln=po(o,'lanes',1)|0;
if(cl_=='dash')cmDash(g,P,4,Y,26,24);else if(cl_=='double'){cmLine(g,cmOffset(P,-3),3,Y,'butt');cmLine(g,cmOffset(P,3),3,Y,'butt')}else if(cl_=='solid')cmLine(g,P,4,Y,'butt');else if(cl_=='white')cmDash(g,P,4,Wt,26,24);
if(ln>1){const lw=(w/2-6)/ln;for(let k=1;k<ln;k++){cmDash(g,cmOffset(P,k*lw),3,Wt,30,30);cmDash(g,cmOffset(P,-k*lw),3,Wt,30,30)}}if(po(o,'edge',0)){cmLine(g,cmOffset(P,w/2-7),3,Wt,'butt');cmLine(g,cmOffset(P,-(w/2-7)),3,Wt,'butt')}}
function pthHighway(g,P,o){const n=cl(po(o,'lanes',3)|0,1,6),lw=60,w=o.w||n*lw+24;cmLine(g,P,w,'#46494e','butt');cmLine(g,P,w-24,'#3c3f44','butt');pthSpeck(g,P,o,w-6,5,['rgba(0,0,0,.12)','rgba(255,255,255,.05)'],2,42);
const half=(w-24)/2;cmLine(g,cmOffset(P,-half),3,'#e0b030','butt');cmLine(g,cmOffset(P,half),3,'#ecebe4','butt');for(let k=1;k<n;k++)cmDash(g,cmOffset(P,-half+k*(w-24)/n),3,'rgba(236,235,228,.9)',44,56);
if(po(o,'rumble',1)){const S=cmOffset(P,half+7);g.fillStyle='rgba(0,0,0,.25)';cmAlong(S,10,(x,y,a)=>{g.save();g.translate(x,y);g.rotate(a);g.fillRect(-2,-5,4,10);g.restore()})}}
function pthTrail(g,P,o){const w=o.w||30,c=cmCol(o.c,'#9a7a4a'),K=pcK(c);cmLine(g,P,w+6,K.d);cmLine(g,P,w,K.b);cmLine(g,P,w*.66,K.l);pthSpeck(g,P,o,w,6,['rgba(120,94,58,.55)',K.d],3,43);let i=0;cmAlong(P,30,(x,y,a)=>{const s=i%2?1:-1,nx=-Math.sin(a),ny=Math.cos(a);g.fillStyle='#7a8a6a';g.fillRect(x+nx*s*(w/2+4),y+ny*s*(w/2+4),4,3);i++})}
function pthGravel(g,P,o){const w=o.w||34;cmLine(g,P,w+6,'#8a8270');cmLine(g,P,w,'#b8ae96');cmLine(g,P,w*.7,'#c8bea4');pthSpeck(g,P,o,w,5,['rgba(120,110,90,.35)','#9a907a'],2,44)}
function pthCobble(g,P,o){const w=o.w||120;cmLine(g,P,w+8,'#3e3a30','butt');cmLine(g,P,w-8,'#55524a','butt');pthSpeck(g,P,o,w-10,2,['#6a6860','#4a4840','#5e5c54'],5,45);cmLine(g,cmOffset(P,-w*.2),4,'rgba(30,26,20,.45)','butt');cmLine(g,cmOffset(P,w*.2),4,'rgba(30,26,20,.45)','butt')}
function pthWalk(g,P,o){const w=o.w||40;cmLine(g,P,w+2,'#8e8a80','butt');cmLine(g,P,w,cmCol(o.c,'#b8b4a8'),'butt');pthTies(g,P,32,w,1,'#a19d92');pthSpeck(g,P,o,w-4,9,['#aaa69a','#c8c4b8'],1,46)}
function pthBoard(g,P,o){const w=o.w||44,c=cmCol(o.c,'#8a6a44');cmLine(g,P,w+2,'#16111c','butt');cmLine(g,P,w,c,'butt');pthTies(g,P,10,w,1,pcSh(c,.7));if(po(o,'rail',0)){cmLine(g,cmOffset(P,w/2-2),3,pcSh(c,.6),'butt');cmLine(g,cmOffset(P,-(w/2-2)),3,pcSh(c,.6),'butt')}}
function pthRails(g,P,o){const w=o.w||60;cmLine(g,P,w,'#6e695f','butt');pthSpeck(g,P,o,w,3,['#8a857a','#5f5a52','#a8a296'],2,47);pthTies(g,P,16,w*.8,7,'#5a3a22');for(const s of[-1,1]){cmLine(g,cmOffset(P,s*w*.22),4,'#16111c','butt');cmLine(g,cmOffset(P,s*w*.22),2,'#a8adb5','butt')}}
function pthStream(g,P,o){const w=o.w||60;cmLine(g,P,w+14,'#6a5a3a');cmLine(g,P,w+6,'#8a7a50');cmLine(g,P,w,'#2a6a9a');cmLine(g,P,w*.55,'#245e8c');let i=0;cmAlong(P,26,(x,y,a)=>{const u=(cmR(o,i,48)-.5)*w*.6;g.fillStyle='rgba(220,240,255,.35)';g.save();g.translate(x-Math.sin(a)*u,y+Math.cos(a)*u);g.rotate(a);g.fillRect(-5,0,10,2);g.restore();i++})}
const PPLINE=[['#e8e8e0','White'],['#e3b92b','Yellow'],['#d8403a','Red'],['#2f6fd0','Blue']];
function pthLine(g,P,o){const c=cmCol(o.c,'#e8e8e0'),w=o.w||4,st=po(o,'st','solid');if(st=='dash')cmDash(g,P,w,c,24,22);else if(st=='double'){cmLine(g,cmOffset(P,-w),w*.8,c,'butt');cmLine(g,cmOffset(P,w),w*.8,c,'butt')}else cmLine(g,P,w,c,'butt')}
function pthSkid(g,P,o){const w=o.w||14;for(const s of[-1,1])cmLine(g,cmOffset(P,s*w/2),4,'rgba(16,14,12,.55)')}
function pthRuts(g,P,o){const w=o.w||40;for(const s of[-1,1]){cmLine(g,cmOffset(P,s*w/2),5,'rgba(60,46,30,.45)');cmLine(g,cmOffset(P,s*w/2+2),2,'rgba(200,180,140,.25)')}}
// ----- barriers -----
// fences stand up out of the ground: posts and pickets are drawn going up the screen, taller where the fence runs across the screen
function pthUp(a){return .35+.65*Math.abs(Math.cos(a))}
function pthChain(g,P,o){cmLine(g,cmOffset(P,3),3,'rgba(0,0,0,.18)','butt');g.strokeStyle='rgba(200,206,216,.75)';g.lineWidth=1;cmAlong(P,5,(x,y,a)=>{const h=12*pthUp(a),c=Math.cos(a),s_=Math.sin(a);g.beginPath();g.moveTo(x,y-h);g.lineTo(x+c*5,y+s_*5);g.moveTo(x+c*5,y+s_*5-h);g.lineTo(x,y);g.stroke()});
const top=P.map(p=>[p[0],p[1]-12]);cmLine(g,top,1,'#9aa0aa','butt');cmAlong(P,46,(x,y,a)=>{const h=13*pthUp(a);g.fillStyle='#16111c';g.fillRect(x-2,y-h-1,5,h+3);g.fillStyle='#b8bec8';g.fillRect(x-1,y-h,3,h+1)},23)}
function pthIron(g,P,o){cmLine(g,P,4,'#16111c','butt');const top=P.map(p=>[p[0],p[1]-11]);cmLine(g,top,2,'#16111c','butt');g.fillStyle='#16111c';cmAlong(P,9,(x,y,a)=>{const h=17*pthUp(a);g.fillRect(x,y-h,2,h);g.fillRect(x-1,y-h-3,4,3)});cmAlong(P,72,(x,y,a)=>{const h=22*pthUp(a);g.fillStyle='#16111c';g.fillRect(x-4,y-h-2,8,h+4);g.fillStyle='#4a4a52';g.fillRect(x-3,y-h-1,6,h+2)},36)}
const PPFENCE=[['#f8f6ee','White'],['#f8d8e4','Pastel pink'],['#c8e0f0','Pastel blue'],['#9a6a3e','Wood'],['#5a5d64','Grey']];
function pthPicket(g,P,o){const c=cmCol(o.c,'#f8f6ee'),K=pcK(c);cmLine(g,cmOffset(P,3),3,'rgba(0,0,0,.18)','butt');cmLine(g,P.map(p=>[p[0],p[1]-6]),2,K.d,'butt');let i=0;cmAlong(P,7,(x,y,a)=>{const h=11*pthUp(a);g.fillStyle='#16111c';g.fillRect(x-1,y-h-1,6,h+2);g.fillStyle=i%2?K.l:K.b;g.fillRect(x,y-h,4,h);g.fillRect(x+1,y-h-2,2,2);i++})}
function pthWoodF(g,P,o){const c=cmCol(o.c,'#7a5232'),K=pcK(c);cmLine(g,cmOffset(P,3),3,'rgba(0,0,0,.2)','butt');for(const[dy,cc]of[[-8,K.l],[-2,K.b]]){const Q=P.map(p=>[p[0],p[1]+dy]);cmLine(g,Q,4,'#16111c','butt');cmLine(g,Q,2,cc,'butt')}cmAlong(P,40,(x,y,a)=>{const h=13*pthUp(a);g.fillStyle='#16111c';g.fillRect(x-3,y-h-1,7,h+3);g.fillStyle=K.d;g.fillRect(x-2,y-h,5,h+1)},20)}
function pthHedge(g,P,o){const w=o.w||18,c=cmCol(o.c,'#3f8a3a'),K=pcK(c);cmLine(g,P,w+2,'#16111c');cmLine(g,P,w,K.d);let i=0;cmAlong(P,9,(x,y)=>{g.fillStyle=i%3?K.b:K.l;g.beginPath();g.arc(x+(cmR(o,i,49)-.5)*4,y-2+(cmR(o,i,50)-.5)*4,w*.36,0,7);g.fill();i++})}
function pthWire(g,P,o){cmLine(g,cmOffset(P,1),1,'rgba(20,18,16,.55)','butt');g.strokeStyle='#b8bcc4';g.lineWidth=1;cmAlong(P,7,(x,y)=>{g.beginPath();g.ellipse(x,y-5,5,6,0,0,7);g.stroke()});cmAlong(P,46,(x,y)=>{g.fillStyle='rgba(0,0,0,.3)';g.fillRect(x-1,y-4,4,8);g.fillStyle='#5a4a3a';g.fillRect(x-2,y-12,4,14);g.fillStyle='#7a6a52';g.fillRect(x-2,y-12,4,2)},23)}
function pthGuard(g,P,o){cmLine(g,P,8,'#16111c','butt');cmLine(g,P,6,'#a8adb5','butt');cmLine(g,P,2,'#d4d8de','butt');cmAlong(P,32,(x,y)=>{g.fillStyle='#16111c';g.fillRect(x-3,y+2,6,7);g.fillStyle='#6e737b';g.fillRect(x-2,y+3,4,5)})}
function pthMedian(g,P,o){const w=o.w||20;cmLine(g,cmOffset(P,4),w,'rgba(0,0,0,.25)','butt');cmLine(g,P,w,'#16111c','butt');cmLine(g,P,w-2,'#a4a097','butt');cmLine(g,P,w*.3,'#c8c4ba','butt');pthTies(g,P,40,w-2,1,'#8a867c')}
function pthSand(g,P,o){let i=0;cmAlong(P,15,(x,y,a)=>{for(let r=0;r<2;r++){g.save();g.translate(x,y-r*5);g.rotate(a);g.fillStyle='#16111c';g.fillRect(-8+r*4,-5,17,10);g.fillStyle=i%2?'#a89a6a':'#b0a272';g.fillRect(-7+r*4,-4,15,8);g.fillStyle='#c8ba8a';g.fillRect(-5+r*4,-3,8,2);g.restore()}i++})}
function pthStone(g,P,o){const w=o.w||14;cmLine(g,P,w+2,'#16111c','butt');cmLine(g,P,w,'#8a867c','butt');let i=0;cmAlong(P,9,(x,y,a)=>{g.save();g.translate(x,y);g.rotate(a);g.fillStyle=i%3?'#a8a294':'#9a958a';g.fillRect(-4,-w/2+1,8,w-2);g.fillStyle='rgba(255,255,255,.12)';g.fillRect(-4,-w/2+1,8,2);g.restore();i++})}
function pthBrick(g,P,o){const w=o.w||10;cmLine(g,P,w+2,'#2a1510','butt');cmLine(g,P,w,'#9a4632','butt');pthTies(g,P,8,w,1,'#c27a5e')}
// ----- closed shapes -----
function pthShapeFill(g,P,cols,edge){if(P.length<3)return;if(edge)cmLine(g,P.concat([P[0]]),edge,cols[0]);cmFillPoly(g,P,cols[1]||cols[0])}
function pthPond(g,P,o){const B=P.concat([P[0]]);cmLine(g,B,34,'#8a7a50');cmLine(g,B,18,'#a8946a');cmFillPoly(g,P,'#245e8c');g.save();g.beginPath();g.moveTo(P[0][0],P[0][1]);for(const p of P)g.lineTo(p[0],p[1]);g.closePath();g.clip();cmLine(g,B,90,'#2a6a9a');cmLine(g,B,40,'#2f78aa');cmLine(g,B,12,'#3a84b4');
const bb=cmPolyBB(P),A=(bb.x1-bb.x0)*(bb.y1-bb.y0);g.fillStyle='rgba(220,240,255,.3)';for(let i=0;i<A/5000;i++)g.fillRect(bb.x0+cmR(o,i,51)*(bb.x1-bb.x0),bb.y0+cmR(o,i,52)*(bb.y1-bb.y0),8+i%3*4,2);
if(po(o,'lily',1))for(let i=0;i<A/16000;i++){const x=bb.x0+cmR(o,i,53)*(bb.x1-bb.x0),y=bb.y0+cmR(o,i,54)*(bb.y1-bb.y0);if(!cmPolyIn(P,x,y)||cmPolyDist(B,x,y)<20)continue;g.fillStyle='#16111c';g.beginPath();g.arc(x,y,7,0,7);g.fill();g.fillStyle='#4a9a3a';g.beginPath();g.arc(x,y,6,.4,6.6);g.lineTo(x,y);g.fill();if(i%3==0){g.fillStyle='#ffb0d0';g.fillRect(x-1,y-2,3,3)}}g.restore();
if(po(o,'reeds',1)){let i=0;cmAlong(B,70,(x,y)=>{if(cmR(o,i,55)<.6){g.fillStyle='#3a7a32';g.fillRect(x,y-8,2,10);g.fillRect(x+4,y-11,2,13);g.fillRect(x+8,y-7,2,9);g.fillStyle='#6a4a2a';g.fillRect(x+3,y-14,4,5)}i++})}}
// draw fn clipped to the polygon P
function pthClip(g,P,fn){g.save();g.beginPath();g.moveTo(P[0][0],P[0][1]);for(const p of P)g.lineTo(p[0],p[1]);g.closePath();g.clip();try{fn()}finally{g.restore()}}
// forest floor (the Suburb's woods): 8px cells of earth, leaf litter, twigs, moss, pebbles, mushrooms and grass, a ragged edge; or churned dark earth
function pthForest(g,P,o){if(P.length<3)return;const ch=po(o,'s','floor')=='churned',bb=cmPolyBB(P),C=ch?['#4e3c28','#57432c','#57432c']:['#5e4830','#6b5236','#654d33'];
pthClip(g,P,()=>{for(let y=Math.floor(bb.y0/8)*8;y<bb.y1;y+=8)for(let x=Math.floor(bb.x0/8)*8;x<bb.x1;x+=8){const h=cmH(x*.37,y*1.7,7);g.fillStyle=h<.33?C[0]:h<.66?C[1]:C[2];g.fillRect(x,y,8,8)}
if(ch)return;const A=(bb.x1-bb.x0)*(bb.y1-bb.y0);for(let i=0;i<A/800;i++){const x=bb.x0+cmR(o,i,121)*(bb.x1-bb.x0),y=bb.y0+cmR(o,i,122)*(bb.y1-bb.y0),k=cmR(o,i,123);
if(k<.45){g.fillStyle=['#8a6a3a','#a0743a','#7a4a2a','#b08a4a'][i%4];g.fillRect(x,y,3,2)}else if(k<.6){g.fillStyle='#3e2e1e';g.fillRect(x,y,7,1)}else if(k<.75){g.fillStyle='#4f6a30';g.fillRect(x,y,4,3)}else if(k<.82){g.fillStyle='#16111c';g.fillRect(x-1,y-1,6,5);g.fillStyle='#8a8a84';g.fillRect(x,y,4,3)}
else if(k<.84){g.fillStyle='#e8e0d0';g.fillRect(x,y+2,2,3);g.fillStyle='#c0392b';g.fillRect(x-1,y,4,2)}else if(k<.9){g.fillStyle='#3a8a38';g.fillRect(x,y,2,4);g.fillRect(x+3,y+1,2,3)}}});
if(ch)return;let i=0;cmAlong(P.concat([P[0]]),6,(x,y)=>{i++;if(x<=bb.x0+1||x>=bb.x1-1||y<=bb.y0+1||y>=bb.y1-1)return;const h=cmH(x,y,8);g.fillStyle=C[0];g.fillRect(x-3,y-2-h*3,6,3+h*5);if(cmH(x,y,10)<.4){g.fillStyle='#3a8a38';g.fillRect(x-2,y+3,2,4)}})}
const PPATCH={beach:['#c8b47a','#dcc78f',['#c4ae74','#efdcaa']],clearing:['#3f8a3a','#4fae4a',['#3a8a38','#62b85a']],moss:['#2f3c28','#3a4a30',['#4a5e36','#2a3424']],dirt:['#6e5236','#8b6b45',['#a8865a','#6e5236']],gravel:['#6e695f','#8a857a',['#a8a296','#5f5a52']],asphalt:['#8a8a84','#3e4046',['rgba(0,0,0,.14)','rgba(255,255,255,.05)']],flowers:['#3a2a1a','#5a4128',['#ff6a8a','#ffd84a','#ffffff','#9a7aff']]};
function pthPatch(k){return(g,P,o)=>{const C=PPATCH[k],B=P.concat([P[0]]);if(k=='clearing'){pthClip(g,P,()=>{const bb=cmPolyBB(P),T=CMTI.grass;for(let ty=Math.floor(bb.y0/32);ty*32<bb.y1;ty++)for(let tx=Math.floor(bb.x0/32);tx*32<bb.x1;tx++)T.f(g,tx*32,ty*32,tx,ty)})}else{cmLine(g,B,k=='asphalt'&&po(o,'curb',1)?10:6,C[0]);cmFillPoly(g,P,C[1])}const bb=cmPolyBB(P),A=(bb.x1-bb.x0)*(bb.y1-bb.y0);
for(let i=0;i<A/(k=='flowers'?120:260);i++){const x=bb.x0+cmR(o,i,56)*(bb.x1-bb.x0),y=bb.y0+cmR(o,i,57)*(bb.y1-bb.y0);if(!cmPolyIn(P,x,y))continue;g.fillStyle=C[2][i%C[2].length];g.fillRect(x,y,k=='flowers'?3:2,k=='flowers'?3:2);if(k=='flowers'&&i%2){g.fillStyle='#3a7a2a';g.fillRect(x+1,y+3,1,3)}}}}
const CMPK=[
{id:'road',n:'Road',cat:'road',w:128,wr:[40,360],def:{o:{cl:'dash',curb:1,lanes:1,ends:'flat',s:'asphalt'}},opts:[['cl','Centre line',PPROAD],['lanes','Lanes each way',[1,4]],['edge','White edge lines','chk'],['curb','Curbs','chk'],['ends','Ends',[['flat','Flat'],['round','Cul-de-sac at the end'],['both','Cul-de-sac at both ends']]],['s','Surface',[['asphalt','Asphalt'],['dark','Dark asphalt'],['worn','Worn and cracked']]]],pri:-110,f:pthRoad},
{id:'highway',n:'Highway lanes / ramp',cat:'road',w:204,wr:[84,420],def:{o:{lanes:3,rumble:1}},opts:[['lanes','Lanes',[1,6]],['rumble','Rumble strip','chk']],pri:-110,f:pthHighway},
{id:'cobble',n:'Cobbled road',cat:'road',w:120,wr:[40,240],pri:-110,f:pthCobble},
{id:'trail',n:'Dirt trail',cat:'path',w:30,wr:[10,120],pal:[['#9a7a4a','Dirt'],['#a8885a','Sandy'],['#6a5a42','Dark earth'],['#8a8270','Grey']],def:{c:'#9a7a4a'},pri:-105,f:pthTrail},
{id:'gravelpath',n:'Gravel path',cat:'path',w:34,wr:[12,120],pri:-105,f:pthGravel},
{id:'walk',n:'Sidewalk / walkway',cat:'path',w:40,wr:[16,140],pal:[['#b8b4a8','Concrete'],['#c4c2ba','Light'],['#a8a69e','Grey']],def:{c:'#b8b4a8'},pri:-104,f:pthWalk},
{id:'boardwalk',n:'Boardwalk',cat:'path',w:44,wr:[16,140],pal:[['#8a6a44','Wood'],['#6b4a2a','Dark'],['#a8885a','Light']],def:{c:'#8a6a44'},opts:[['rail','Side rails','chk']],pri:-104,f:pthBoard},
{id:'rails',n:'Railroad track',cat:'path',w:60,wr:[40,90],pri:-106,f:pthRails},
{id:'stream',n:'Stream (blocks walking)',cat:'path',w:60,wr:[20,200],fl:2,pri:-108,f:pthStream,coll(P,o,out){const s=Math.max(8,(o.w||60)-6);cmBoxesAlong(P,s,s/2,cmPFl(o),out)}},
{id:'line',sharp:1,n:'Painted line',cat:'line',w:4,wr:[2,16],pal:PPLINE,def:{c:'#e8e8e0',o:{st:'solid'}},opts:[['st','Style',[['solid','Solid'],['dash','Dashed'],['double','Double']]]],pri:-20,f:pthLine},
{id:'skid',n:'Skid marks',cat:'line',w:14,wr:[6,40],pri:-20,f:pthSkid},
{id:'ruts',n:'Wheel ruts',cat:'line',w:40,wr:[16,90],pri:-20,f:pthRuts},
{id:'chain',sharp:1,n:'Chain-link fence',cat:'barrier',w:6,fl:2,pri:0,f:pthChain},
{id:'iron',sharp:1,n:'Iron fence',cat:'barrier',w:6,fl:2,pri:0,f:pthIron},
{id:'picket',sharp:1,n:'Picket fence',cat:'barrier',w:6,fl:2,pal:PPFENCE,def:{c:'#f8f6ee'},pri:0,f:pthPicket},
{id:'woodfence',sharp:1,n:'Wood rail fence',cat:'barrier',w:6,fl:2,pal:[['#7a5232','Brown'],['#9a6a3e','Light'],['#5a3a22','Dark']],def:{c:'#7a5232'},pri:0,f:pthWoodF},
{id:'hedge',sharp:1,n:'Hedge',cat:'barrier',w:18,wr:[10,40],fl:1,pal:[['#3f8a3a','Green'],['#2f6b34','Dark'],['#5a7a3a','Olive'],['#4a3a2a','Dead']],def:{c:'#3f8a3a'},pri:0,f:pthHedge},
{id:'wire',sharp:1,n:'Barbed wire',cat:'barrier',w:6,fl:2,pri:0,f:pthWire},
{id:'guardrail',n:'Guard rail',cat:'barrier',w:8,fl:2,pri:0,f:pthGuard},
{id:'median',sharp:1,n:'Concrete median',cat:'barrier',w:20,wr:[12,30],fl:2,pri:0,f:pthMedian},
{id:'sandbags',sharp:1,n:'Sandbag line',cat:'barrier',w:14,fl:1,pri:0,f:pthSand},
{id:'stonewall',sharp:1,n:'Low stone wall',cat:'barrier',w:14,wr:[8,30],fl:1,pri:0,f:pthStone},
{id:'brickwall',sharp:1,n:'Brick wall (curved)',cat:'barrier',w:10,wr:[6,30],fl:0,pri:0,f:pthBrick},
{id:'pond',n:'Pond / lake (blocks walking)',cat:'shape',closed:1,fl:2,def:{o:{lily:1,reeds:1}},opts:[['lily','Lily pads','chk'],['reeds','Reeds','chk']],pri:-112,f:pthPond,coll(P,o,out){cmPolyBoxes(P,12,cmPFl(o),out)}},
{id:'beach',n:'Sand patch',cat:'shape',closed:1,pri:-115,f:pthPatch('beach')},
{id:'clearing',n:'Grass patch',cat:'shape',closed:1,pri:-115,f:pthPatch('clearing')},
{id:'mosspatch',n:'Moss patch',cat:'shape',closed:1,pri:-115,f:pthPatch('moss')},
{id:'dirtpatch',n:'Dirt patch',cat:'shape',closed:1,pri:-115,f:pthPatch('dirt')},
{id:'gravelpatch',n:'Gravel patch',cat:'shape',closed:1,pri:-115,f:pthPatch('gravel')},
{id:'asphaltpatch',n:'Asphalt patch',cat:'shape',closed:1,def:{o:{curb:1}},opts:[['curb','Curb edge','chk']],pri:-116,f:pthPatch('asphalt')},
{id:'flowerbed',n:'Flower bed',cat:'shape',closed:1,pri:-114,f:pthPatch('flowers')},
{id:'forest',n:'Forest floor',cat:'shape',closed:1,pri:-118,def:{o:{s:'floor'}},opts:[['s','Ground',[['floor','Forest floor (leaf litter)'],['churned','Churned earth']]]],f:pthForest}];
for(const t of CMPK)cmAddPath(t);
// the wall flag of a solid path
function cmPFl(o){const T=cmPath(o.p);return T&&T.fl!=null?T.fl:1}
function cmPathDraw(g,o){const T=cmPath(o.p);if(!T)return;const P=cmPathSm(o);if(P.length<2)return;g.save();try{T.f(g,P,o)}finally{g.restore()}}
// collision: barriers are a chain of boxes along the line (about as thick as the fence), solid shapes rows inside the outline
function cmPathBoxes(o){const T=cmPath(o.p);if(!T||!cmSolid(o,'l'))return[];const P=cmPathSm(o);if(P.length<2)return[];const out=[];if(T.coll)T.coll(P,o,out);else if(T.closed)cmPolyBoxes(P,12,cmPFl(o),out);else{const s=Math.max(8,Math.min(24,(o.w||T.w||8)));cmBoxesAlong(P,s,Math.max(4,s*.8),cmPFl(o),out)}return out}
// ----- the boss road graph from the map's roads -----
// nodes every ~140px along each road (and where roads cross), joined along the roads; nodes closer than 30px are merged
function cmGraphFromRoads(d){const R=d.paths.filter(o=>{const T=cmPath(o.p);return T&&T.cat=='road'}).map(o=>{const P=cmPathSm(o),Q=[];cmAlong(P,40,(x,y)=>Q.push([x,y]));const q=P[P.length-1];if(q)Q.push([q[0],q[1]]);return Q}).filter(Q=>Q.length>1);
const X_=R.map(()=>[]);const segX=(a,b,c,e)=>{const d1=[b[0]-a[0],b[1]-a[1]],d2=[e[0]-c[0],e[1]-c[1]],den=d1[0]*d2[1]-d1[1]*d2[0];if(Math.abs(den)<1e-9)return null;const t=((c[0]-a[0])*d2[1]-(c[1]-a[1])*d2[0])/den,u=((c[0]-a[0])*d1[1]-(c[1]-a[1])*d1[0])/den;return t>=0&&t<=1&&u>=0&&u<=1?[a[0]+d1[0]*t,a[1]+d1[1]*t,t]:null};
for(let i=0;i<R.length;i++)for(let j=i+1;j<R.length;j++)for(let a=1;a<R[i].length;a++)for(let b=1;b<R[j].length;b++){const p=segX(R[i][a-1],R[i][a],R[j][b-1],R[j][b]);if(p){X_[i].push([a,p[2],p[0],p[1]]);X_[j].push([b,0,p[0],p[1]])}}
const N=[],E=[],node=(x,y)=>{for(let k=0;k<N.length;k++)if(Math.hypot(N[k][0]-x,N[k][1]-y)<30)return k;N.push([Math.round(x),Math.round(y)]);return N.length-1},edge=(a,b)=>{if(a!==b&&!E.some(e=>e[0]==a&&e[1]==b||e[0]==b&&e[1]==a))E.push([a,b])};
R.forEach((Q,i)=>{let prev=node(Q[0][0],Q[0][1]),acc=0;for(let a=1;a<Q.length;a++){acc+=Math.hypot(Q[a][0]-Q[a-1][0],Q[a][1]-Q[a-1][1]);const cr=X_[i].filter(c=>c[0]==a);for(const c of cr){const k=node(c[2],c[3]);edge(prev,k);prev=k;acc=0}if(acc>=140||a==Q.length-1){const k=node(Q[a][0],Q[a][1]);edge(prev,k);prev=k;acc=0}}});return{N,E}}
