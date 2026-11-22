//# world/kit-park.js — Building kit pieces from Zombville City Park: a tennis court (lines, the net that stops people, run-off round it), a concrete skate bowl you can walk down into (coping, pool tile, a drain), and what people dropped in the park (skateboards, tennis balls, a racket, a basketball, dog toys, a leash, muddy paw prints, an abandoned picnic, an ice cream cone, a kite, chalk hopscotch and chalk drawings)
// ---------- City Park's pieces ----------
// (functions and registries only: nothing here runs during the first map build at boot)
const PKP={o:'#16111c',w:'#f4f4f0',cn:'#b8b4a8',cnl:'#cdc9bc',cnd:'#8e8a7e'};
// ----- the tennis court -----
// The box is the court and its run-off (36.6 × 18.3 m): the doubles court in the middle, its lines, the net across the middle on two
// posts (the net stops people; balls and bullets go over). A box taller than wide turns the court to run up and down.
function arTennisL(o){const v=o.h>o.w,L=v?o.h:o.w,S=v?o.w:o.h,s=Math.min(L/36.6,S/18.3),cl_=23.77*s,cw=10.97*s;return{v,s,cl:cl_,cw,cx:o.x+o.w/2,cy:o.y+o.h/2}}
function arTennis(g,o){const T=arTennisL(o),K=pcK(cmCol(o.c,'#3a7a4a')),K2=pcK(cmCol(o.c2,'#2e5e3c')),{s,cx,cy}=T,lw=Math.max(2,Math.round(s*.08));
 g.fillStyle=K2.b;g.fillRect(o.x,o.y,o.w,o.h);g.fillStyle='rgba(255,255,255,.04)';for(let i=0;i<o.w*o.h/900;i++)g.fillRect(o.x+cmR(o,i,60)*o.w,o.y+cmR(o,i,61)*o.h,2,1);
 // in court coordinates: u along the court, w across it (both from the middle)
 const R=(u0,w0,u1,w1,c)=>{g.fillStyle=c;const a=Math.min(u0,u1),b=Math.min(w0,w1),du=Math.abs(u1-u0),dw=Math.abs(w1-w0);if(T.v)g.fillRect(cx+b,cy+a,dw,du);else g.fillRect(cx+a,cy+b,du,dw)};
 const hl=T.cl/2,hw=T.cw/2,sw=8.23*s/2,sv=6.4*s;R(-hl-s*.6,-hw-s*.6,hl+s*.6,hw+s*.6,K.b);
 // wear: a darker patch behind each baseline where the players stand
 for(const e of[-1,1]){g.globalAlpha=.25;R(e*hl-s*1.2,-hw*.6,e*hl+s*1.2,hw*.6,K.d);g.globalAlpha=1}
 for(const e of[-1,1]){R(e*hl-lw/2,-hw,e*hl+lw/2,hw,PKP.w);R(-hl,e*hw-lw/2,hl,e*hw+lw/2,PKP.w);R(-hl,e*sw-lw/2,hl,e*sw+lw/2,PKP.w);R(e*sv-lw/2,-sw,e*sv+lw/2,sw,PKP.w);R(e*hl,-lw/2,e*(hl-s*.3),lw/2,PKP.w)}
 R(-sv,-lw/2,sv,lw/2,PKP.w);
 // the net: posts outside the doubles lines, the mesh and its white tape
 if(ao(o,'net',1)){const np=hw+s*.914;R(-s*.12,-np,s*.12,np,'rgba(0,0,0,.25)');R(-1.5,-np,1.5,np,'#26262c');g.globalAlpha=.6;for(let w_=-np;w_<np;w_+=4)R(-2.5,w_,2.5,w_+1,'#16111c');g.globalAlpha=1;R(-1,-np,1,np,PKP.w);for(const e of[-1,1]){R(-4,e*np-4,4,e*np+4,PKP.o);R(-3,e*np-3,3,e*np+3,'#5a5e68')}}}
function arTennisColl(o,out){if(!ao(o,'net',1))return;const T=arTennisL(o),np=T.cw/2+T.s*.914;out.push(T.v?[T.cx-np,T.cy-3,np*2,6,2]:[T.cx-3,T.cy-np,6,np*2,2])}
// ----- the skate bowl -----
// A concrete bowl sunk into the ground (you can walk down into it): steel coping round the lip, a band of pool tile, the walls
// darkening towards the flat bottom, a drain, wheel marks and a few tags. sh: kidney (two lobes), oval, or square (round corners).
function arSkL(o){const sh=String(ao(o,'sh','kidney')),{x,y,w,h}=o;if(sh=='kidney')return[{x:x+w*.36,y:y+h*.54,rx:w*.36,ry:h*.46},{x:x+w*.72,y:y+h*.42,rx:w*.28,ry:h*.4}];if(sh=='oval')return[{x:x+w/2,y:y+h/2,rx:w/2,ry:h/2}];return[{x:x+w/2,y:y+h/2,rx:w/2,ry:h/2,sq:1}]}
// how far a point is inside the bowl's lip, in px (negative outside): the deepest of the lobes
function arSkD(L,x,y){let d=-1e9;for(const e of L){let v;if(e.sq){const r=Math.min(e.rx,e.ry)*.45,qx=Math.abs(x-e.x)-(e.rx-r),qy=Math.abs(y-e.y)-(e.ry-r);v=-(Math.hypot(Math.max(qx,0),Math.max(qy,0))+Math.min(Math.max(qx,qy),0)-r)}else{const u=(x-e.x)/e.rx,w=(y-e.y)/e.ry;v=(1-Math.hypot(u,w))*Math.min(e.rx,e.ry)}if(v>d)d=v}return d}
function arSkBowl(g,o){const L=arSkL(o),D=Math.min(o.w,o.h),fb=D*.24,W=['#b4b0a4','#aca89c','#a4a094','#9c988c','#949084','#8c887c'],st=2;
 for(let y=o.y-6;y<o.y+o.h+6;y+=st)for(let x=o.x-6;x<o.x+o.w+6;x+=st){const d=arSkD(L,x+st/2,y+st/2);if(d<-6)continue;let c;
  if(d<-5)c=PKP.o;else if(d<-2)c='#c8ccd4';else if(d<0)c='#8a8f96';else if(d<3)c='#2f6f9a';else if(d<6)c='#3f88b8';else if(d<7)c=PKP.o;else if(d<fb)c=W[Math.min(W.length-1,Math.floor((d-7)/(fb-7)*W.length))];else c='#9a968a';
  g.fillStyle=c;g.fillRect(x,y,st,st)}
 // wheel marks, tags, the drain (only on the walls and the bottom)
 g.strokeStyle='rgba(40,36,30,.22)';g.lineWidth=1.5;for(let i=0;i<14;i++){const e=L[i%L.length],a=cmR(o,i,62)*6.283,r=.45+cmR(o,i,63)*.4;g.beginPath();g.ellipse(e.x,e.y,e.rx*r,e.ry*r,0,a,a+.8+cmR(o,i,64));g.stroke()}
 const TG=['#d8403a','#2f6fd0','#e0b020','#3aa06a','#8a5ab8'];for(let i=0;i<5;i++){const e=L[i%L.length],a=cmR(o,i,65)*6.283,r=.62+cmR(o,i,66)*.2,x=e.x+Math.cos(a)*e.rx*r,y=e.y+Math.sin(a)*e.ry*r;if(arSkD(L,x-12,y)<12||arSkD(L,x+14,y)<12)continue;g.strokeStyle=TG[i];g.lineWidth=2.5;g.beginPath();g.moveTo(x-12,y);for(let k=1;k<6;k++)g.lineTo(x-12+k*5,y+(k%2?-6:5)*(.6+cmR(o,i*7+k,67)*.5));g.stroke()}
 const e=L[0];kpCirc(g,PKP.o,e.x,e.y,7);kpCirc(g,'#5a5e68',e.x,e.y,6);g.fillStyle=PKP.o;for(let k=-4;k<=4;k+=2)g.fillRect(e.x+k,e.y-4,1,8)}
cmAddArea({id:'tennis',n:'Tennis court (net stops people)',cat:'ground',fl:2,pal:[['#3a7a4a','Green'],['#2f6fd0','Blue'],['#c8643a','Clay'],['#8a5ab8','Purple']],pal2:[['#2e5e3c','Dark green'],['#3a6a4a','Green'],['#b85a32','Clay'],['#5a5e68','Grey']],
 def:{c:'#3a7a4a',c2:'#2e5e3c',o:{net:1}},opts:[['net','The net','chk']],min:[110,60],pri:-55,f:arTennis,coll(o,out){if(cmSolid(o,'a'))arTennisColl(o,out)}});
cmAddArea({id:'skbowl',n:'Skate bowl (walk down into it)',cat:'ground',fl:null,def:{o:{sh:'kidney'}},opts:[['sh','Shape',[['kidney','Kidney'],['oval','Oval'],['square','Square (round corners)']]]],min:[80,60],pri:-45,f:arSkBowl});
// ----- decals: what people dropped -----
cmAddDec({id:'skateboard',n:'Skateboard (dropped)',cat:'misc',w:40,h:14,pal:[['#c0392b','Red'],['#2f6fd0','Blue'],['#26262c','Black'],['#e0b020','Yellow'],['#3aa06a','Green']],f(g,v,K){g.fillStyle='rgba(0,0,0,.25)';g.fillRect(-17,-3,36,9);g.fillStyle=PKP.o;g.beginPath();g.ellipse(0,0,19,6,0,0,7);g.fill();g.fillStyle=K.b;g.beginPath();g.ellipse(0,0,18,5,0,0,7);g.fill();g.fillStyle=K.l;g.fillRect(-10,-3,20,2);
 if(v>.5){g.fillStyle='#c8ccd4';g.fillRect(-12,-5,3,10);g.fillRect(9,-5,3,10);g.fillStyle='#e8e4d0';for(const[x,y]of[[-13,-6],[-13,4],[8,-6],[8,4]])g.fillRect(x,y,4,3)}else{g.fillStyle='rgba(255,255,255,.35)';g.fillRect(-6,-1,12,2)}}});
cmAddDec({id:'tballs',n:'Tennis balls',cat:'misc',w:40,h:30,f(g,v){for(let i=0;i<3+Math.floor(v*4);i++){const x=-16+dcH(v,i,70)*32,y=-12+dcH(v,i,71)*24;kpCirc(g,PKP.o,x,y,3.5);kpCirc(g,'#d8f040',x,y,2.7);g.fillStyle='#f4f8d0';g.fillRect(x-1.5,y-1,3,1)}}});
cmAddDec({id:'racket',n:'Tennis racket (dropped)',cat:'misc',w:44,h:20,pal:[['#2f6fd0','Blue'],['#c0392b','Red'],['#26262c','Black']],f(g,v,K){g.fillStyle=PKP.o;g.fillRect(-2,-2,20,5);g.fillStyle=K.b;g.fillRect(-1,-1,18,3);g.fillStyle=PKP.o;g.beginPath();g.ellipse(-10,0,11,8,0,0,7);g.fill();g.fillStyle=K.b;g.beginPath();g.ellipse(-10,0,10,7,0,0,7);g.fill();
 g.fillStyle='#e8e8e4';g.beginPath();g.ellipse(-10,0,8,5.5,0,0,7);g.fill();g.fillStyle='rgba(60,60,70,.55)';for(let k=-17;k<-3;k+=3)g.fillRect(k,-5,1,10);for(let k=-5;k<6;k+=3)g.fillRect(-18,k,16,1)}});
cmAddDec({id:'bball',n:'Basketball',cat:'misc',w:18,h:18,f(g){kpCirc(g,PKP.o,0,0,7);kpCirc(g,'#d8701c',0,0,6);g.fillStyle=PKP.o;g.fillRect(-6,0,12,1);g.fillRect(0,-6,1,12);g.strokeStyle=PKP.o;g.lineWidth=1;g.beginPath();g.arc(-6,0,5,-1.1,1.1);g.stroke();g.beginPath();g.arc(6,0,5,2,4.3);g.stroke();g.fillStyle='#f0a050';g.fillRect(-3,-4,2,2)}});
cmAddDec({id:'dogtoy',n:'Dog toy (ball, frisbee, rope, bone)',cat:'misc',w:24,h:20,f(g,v){const k=Math.floor(v*4)%4;if(k==0){kpCirc(g,PKP.o,0,0,4.5);kpCirc(g,'#d8f040',0,0,3.6)}else if(k==1){kpCirc(g,PKP.o,0,0,9);kpCirc(g,'#e8781e',0,0,8);kpCirc(g,'#f0a050',0,0,5);kpCirc(g,'#e8781e',0,0,3.5)}
 else if(k==2){g.fillStyle=PKP.o;g.fillRect(-10,-2,20,5);g.fillStyle='#c83a3a';g.fillRect(-9,-1,6,3);g.fillStyle='#f4f4f0';g.fillRect(-3,-1,6,3);g.fillStyle='#2f6fd0';g.fillRect(3,-1,6,3);kpCirc(g,PKP.o,-10,0,3.5);kpCirc(g,PKP.o,10,0,3.5);kpCirc(g,'#d8c8a0',-10,0,2.6);kpCirc(g,'#d8c8a0',10,0,2.6)}
 else{g.fillStyle=PKP.o;g.fillRect(-7,-2,14,5);g.fillStyle='#e8e0cc';g.fillRect(-6,-1,12,3);for(const[x,y]of[[-8,-2],[-8,2],[8,-2],[8,2]]){kpCirc(g,PKP.o,x,y,2.8);kpCirc(g,'#e8e0cc',x,y,2)}}}});
cmAddDec({id:'leash',n:'Dog leash (dropped)',cat:'misc',w:44,h:24,pal:[['#c0392b','Red'],['#2f6fd0','Blue'],['#3aa06a','Green'],['#26262c','Black']],f(g,v,K){g.strokeStyle=PKP.o;g.lineWidth=4;const P=()=>{g.beginPath();g.moveTo(-18,6);g.bezierCurveTo(-8,-12,4,14,12,-2);g.stroke()};P();g.strokeStyle=K.b;g.lineWidth=2;P();g.strokeStyle=PKP.o;g.lineWidth=4;g.beginPath();g.ellipse(15,-4,5,4,0,0,7);g.stroke();g.strokeStyle=K.b;g.lineWidth=2;g.stroke();g.fillStyle='#c8ccd4';g.fillRect(-21,5,4,3)}});
cmAddDec({id:'pawprints',n:'Muddy paw prints',cat:'misc',w:90,h:20,f(g,v){g.fillStyle='rgba(70,52,30,.6)';for(let i=0;i<7;i++){const x=-40+i*13,y=(i%2?-4:4);kpCirc(g,'rgba(70,52,30,.6)',x,y,2.4);for(const[a,b]of[[-2,-3],[0,-4],[2,-3]])g.fillRect(x+a*1.3+3,y+b,1.6,1.6)}}});
cmAddDec({id:'picnicset',n:'Picnic blanket (left in a hurry)',cat:'misc',w:76,h:56,pal:[['#c0392b','Red check'],['#2f6fd0','Blue check'],['#3aa06a','Green check'],['#e0b020','Yellow check']],f(g,v,K){g.save();g.rotate((v-.5)*.3);g.fillStyle='rgba(0,0,0,.2)';g.fillRect(-32,-22,68,48);g.fillStyle='#f4f0e4';g.fillRect(-34,-24,68,48);
 g.fillStyle=K.b;for(let i=0;i<8;i++){g.globalAlpha=.55;g.fillRect(-34+i*8.5,-24,4.2,48);g.fillRect(-34,-24+i*6,68,3)}g.globalAlpha=1;g.fillStyle=K.d;g.fillRect(28,10,6,14);
 // the basket, plates, a spilled drink, a half-eaten sandwich
 g.fillStyle=PKP.o;g.fillRect(-26,-18,20,14);g.fillStyle='#b8864a';g.fillRect(-25,-17,18,12);g.fillStyle='#8a5f36';for(let k=-24;k<-8;k+=3)g.fillRect(k,-17,1,12);g.fillStyle='#8a5f36';g.fillRect(-22,-21,12,3);
 for(const[x,y]of[[4,-10],[16,4]]){kpCirc(g,PKP.o,x,y,6.5);kpCirc(g,'#f4f4f0',x,y,5.5)}g.fillStyle='#e8c070';g.fillRect(1,-12,7,4);g.fillStyle='#7ab04a';g.fillRect(1,-10,7,1);g.fillStyle='#c0392b';g.fillRect(14,2,3,3);g.fillRect(18,5,2,2);
 g.fillStyle='rgba(200,60,40,.5)';g.beginPath();g.ellipse(-8,12,9,4,.3,0,7);g.fill();g.fillStyle=PKP.o;g.fillRect(-4,8,10,5);g.fillStyle='#d8403a';g.fillRect(-3,9,8,3);g.restore()}});
cmAddDec({id:'icecone',n:'Dropped ice cream cone',cat:'misc',w:24,h:18,pal:[['#f4c8d8','Strawberry'],['#f4ecd0','Vanilla'],['#6a4430','Chocolate'],['#a8e0b8','Mint']],f(g,v,K){g.fillStyle='rgba(255,255,255,.35)';g.beginPath();g.ellipse(-3,0,9,6,0,0,7);g.fill();g.fillStyle=K.b;g.beginPath();g.ellipse(-3,0,7,5,0,0,7);g.fill();g.fillStyle=K.l;g.fillRect(-6,-2,3,2);
 g.fillStyle=PKP.o;g.beginPath();g.moveTo(1,-4);g.lineTo(12,0);g.lineTo(1,4);g.closePath();g.fill();g.fillStyle='#d8a050';g.beginPath();g.moveTo(2,-3);g.lineTo(10,0);g.lineTo(2,3);g.closePath();g.fill();g.fillStyle='#b8803a';g.fillRect(4,-1,1,2);g.fillRect(7,-1,1,2)}});
cmAddDec({id:'kite',n:'Kite (on the ground)',cat:'misc',w:60,h:40,pal:[['#d8403a','Red'],['#2f6fd0','Blue'],['#e0b020','Yellow'],['#8a5ab8','Purple']],f(g,v,K){g.save();g.rotate((v-.5)*.8);g.fillStyle=PKP.o;g.beginPath();g.moveTo(-20,0);g.lineTo(-6,-12);g.lineTo(8,0);g.lineTo(-6,12);g.closePath();g.fill();g.fillStyle=K.b;g.beginPath();g.moveTo(-18,0);g.lineTo(-6,-10);g.lineTo(6,0);g.lineTo(-6,10);g.closePath();g.fill();
 g.fillStyle=K.l;g.beginPath();g.moveTo(-18,0);g.lineTo(-6,-10);g.lineTo(-6,0);g.closePath();g.fill();g.fillStyle=K.d;g.beginPath();g.moveTo(6,0);g.lineTo(-6,10);g.lineTo(-6,0);g.closePath();g.fill();g.strokeStyle='#2a2620';g.lineWidth=1;g.beginPath();g.moveTo(-18,0);g.lineTo(6,0);g.moveTo(-6,-10);g.lineTo(-6,10);g.stroke();
 g.strokeStyle='#e8e4d8';g.beginPath();g.moveTo(8,0);g.bezierCurveTo(16,8,22,-6,30,4);g.stroke();const C=['#d8403a','#e0b020','#2f6fd0'];for(let i=0;i<4;i++){g.fillStyle=C[i%3];g.fillRect(10+i*5,(i%2?3:-2)+1,3,3)}g.restore()}});
cmAddDec({id:'hopscotch',n:'Chalk hopscotch',cat:'misc',w:40,h:110,f(g,v){g.strokeStyle='rgba(250,250,245,.85)';g.lineWidth=2;const B=[[0,40],[0,26],[-8,12],[8,12],[0,-2],[-8,-16],[8,-16],[0,-30],[0,-44]];B.forEach(([x,y],i)=>{g.strokeRect(x-8,y-7,16,14)});
 g.fillStyle='rgba(250,250,245,.85)';g.font='bold 8px Arial';g.textAlign='center';g.textBaseline='middle';B.forEach(([x,y],i)=>g.fillText(String(i+1),x,y+1));g.textAlign='left';g.textBaseline='alphabetic';kpCirc(g,'rgba(240,120,160,.8)',-14,46,3)}});
cmAddDec({id:'chalkart',n:'Chalk drawings',cat:'misc',w:70,h:50,f(g,v){const C=['rgba(255,140,180,.85)','rgba(120,190,255,.85)','rgba(255,220,90,.85)','rgba(140,230,140,.85)'];g.lineWidth=2;
 g.strokeStyle=C[2];g.beginPath();g.arc(-18,-8,8,0,7);g.stroke();for(let i=0;i<8;i++){const a=i/8*6.283;g.beginPath();g.moveTo(-18+Math.cos(a)*11,-8+Math.sin(a)*11);g.lineTo(-18+Math.cos(a)*15,-8+Math.sin(a)*15);g.stroke()}
 g.strokeStyle=C[0];for(let i=0;i<5;i++){const a=i/5*6.283;g.beginPath();g.ellipse(12+Math.cos(a)*5,-4+Math.sin(a)*5,4,4,0,0,7);g.stroke()}g.strokeStyle=C[3];g.beginPath();g.moveTo(12,2);g.lineTo(12,18);g.stroke();
 g.strokeStyle=C[1];g.beginPath();g.moveTo(-28,18);g.quadraticCurveTo(-10,8,8,20);g.quadraticCurveTo(20,26,30,16);g.stroke()}});
