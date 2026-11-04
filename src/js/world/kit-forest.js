//# world/kit-forest.js — Building kit pieces from the Enchanted Forest: dense woods nobody can walk into, log-cabin walls, fireflies, an owl that hoots, wolves howling far off
// ---------- the Enchanted Forest's pieces ----------
// (functions and registries only: nothing here runs during the first map build at boot)
// woods: a stretch of dense woods (a closed shape, solid like a pond: people and zombies go round it, bullets pass). Dark undergrowth
// (ferns, brambles, roots, fallen leaves) with a ragged line of bushes along its edge; stand the forest's trees in it (eoak, eoakv,
// epine), so the trees mark where you can't go and nobody gets caught between trunks.
function pthWoods(g,P,o){if(P.length<3)return;const bb=cmPolyBB(P),B=P.concat([P[0]]);cmLine(g,B,12,'rgba(8,10,8,.32)');
pthClip(g,P,()=>{for(let y=Math.floor(bb.y0/8)*8;y<bb.y1;y+=8)for(let x=Math.floor(bb.x0/8)*8;x<bb.x1;x+=8){const h=cmH(x*.37,y*1.7,17);g.fillStyle=h<.33?'#141a13':h<.66?'#171f17':'#111711';g.fillRect(x,y,8,8)}
 const A=(bb.x1-bb.x0)*(bb.y1-bb.y0);for(let i=0;i<A/420;i++){const x=Math.round(bb.x0+cmR(o,i,131)*(bb.x1-bb.x0)),y=Math.round(bb.y0+cmR(o,i,132)*(bb.y1-bb.y0)),k=cmR(o,i,133);
  if(k<.3){g.fillStyle=i%2?'#1e3a2c':'#24402a';g.fillRect(x,y,1,6);g.fillRect(x-3,y+1,3,1);g.fillRect(x+1,y+2,3,1);g.fillRect(x-3,y+3,3,1);g.fillRect(x+1,y+4,3,1)}
  else if(k<.45){g.fillStyle='#2a1a24';g.fillRect(x,y,2,2);g.fillRect(x+3,y+1,2,2);g.fillRect(x+1,y+3,2,2)}
  else if(k<.6){g.fillStyle='#0c0a0c';g.fillRect(x,y,9,1);g.fillRect(x+6,y+1,5,1)}
  else if(k<.82){g.fillStyle=['#4a2a4a','#5a3a2a','#3a4a2a','#4a3a24'][i%4];g.fillRect(x,y,3,2)}
  else if(k<.86){g.fillStyle='#e8e0c8';g.fillRect(x,y+2,1,2);g.fillStyle='#8ae8ff';g.fillRect(x-1,y,3,2)}}});
let i=0;cmAlong(B,9,(x,y)=>{i++;const h=cmH(x*.7,y*1.3,18),r=4+h*5;if(x<bb.x0+2||x>bb.x1-2||y<bb.y0+2||y>bb.y1-2)return;g.fillStyle='#0c0e0c';g.beginPath();g.arc(x,y,r+1,0,7);g.fill();g.fillStyle=h<.4?'#1c3a2c':h<.75?'#22302a':'#2e2440';g.beginPath();g.arc(x,y,r,0,7);g.fill();g.fillStyle=h<.4?'#2a5040':h<.75?'#344a3a':'#463a5a';g.beginPath();g.arc(x-r*.3,y-r*.35,r*.45,0,7);g.fill()})}
cmAddPath({id:'woods',n:'Dense woods (blocks walking)',cat:'shape',closed:1,fl:2,pri:-117,f:pthWoods,coll(P,o,out){cmPolyBoxes(P,12,cmPFl(o),out)}});
// log wall: a log cabin's wall, two round logs side by side along it (bark, knots, a lit top); put a `logcorner` on each corner
cmAddWall({id:'logs',n:'Log wall (cabin)',fl:0,pal:[['#6a4a2c','Brown'],['#5a3a22','Dark'],['#8a6a42','Pale']],f(g,x,y,w,h,c){c=c||'#6a4a2c';const hz=kwH(w,h),L=hz?w:h,T=hz?h:w,n=T>=9?2:1,lw=T/n;kwOut(g,x-1,y-1,w+2,h+2);
 for(let k=0;k<n;k++){const o=Math.round(k*lw),s=Math.round(lw);g.fillStyle=pcSh(c,.62);hz?g.fillRect(x,y+o,w,s):g.fillRect(x+o,y,s,h);g.fillStyle=c;hz?g.fillRect(x,y+o+1,w,s-2):g.fillRect(x+o+1,y,s-2,h);g.fillStyle=pcSh(c,1.35);hz?g.fillRect(x,y+o+1,w,Math.max(1,Math.round(s*.28))):g.fillRect(x+o+1,y,Math.max(1,Math.round(s*.28)),h)}
 g.fillStyle=pcSh(c,.55);for(let k=6,j=0;k<L-3;k+=13+(j*7)%9,j++){const o=Math.round((j%n)*lw+lw*.55);hz?g.fillRect(x+k,y+o,3,1):g.fillRect(x+o,y+k,1,3);if(j%3==0){hz?g.fillRect(x+k+5,y+o-1,6,1):g.fillRect(x+o-1,y+k+5,1,6)}}}});
// what each effect is doing (when an owl hoots next, when the wolves howl next), kept by the effect
const EFST=new WeakMap();
function efSt(o){let s=EFST.get(o);if(!s){s={n:0};EFST.set(o,s)}return s}
// fireflies: a little swarm of fireflies drifting and blinking over a clearing (they light it faintly at night)
const EFFN=12;
cmAddFx({id:'fireflies',n:'Fireflies',cat:'life',r:90,
 top(o,t){const s=cl(+o.sc||1,.25,4),r=70*s;for(let i=0;i<EFFN;i++){const a=cmR(o,i,71),b=cmR(o,i,72),sp=.15+cmR(o,i,73)*.25,x=o.x+Math.sin(t*sp+a*6.283)*r*(.4+.6*b)+Math.sin(t*1.3+i)*6,y=o.y+Math.cos(t*sp*1.3+b*6.283)*r*.6*(.4+.6*a)-14+Math.cos(t*1.7+i)*5,
  k=Math.sin(t*(1.1+cmR(o,i,74)*1.4)+i*2.1);if(k<.1)continue;X.globalAlpha=Math.min(1,k);X.fillStyle='rgba(216,255,106,.35)';X.fillRect(Math.round(x)-2,Math.round(y)-2,5,5);X.fillStyle='#f0ff9a';X.fillRect(Math.round(x)-1,Math.round(y)-1,2,2)}X.globalAlpha=1},
 lts(o,s,ph,L){L.push({x:o.x,y:o.y-14,r:80*s,c:'#d8ff6a',i:.32,f:'glow',ph,ng:1})},
 ed(g,o){const s=cl(+o.sc||1,.25,4);g.fillStyle='#e8ff7a';for(let i=0;i<EFFN;i++)g.fillRect(o.x+(cmR(o,i,71)-.5)*120*s,o.y-14+(cmR(o,i,72)-.5)*70*s,2,2)}});
// owl: an owl up in the trees: two amber eyes that blink, and now and then (every 10–18 s) it hoots; you hear it when you are near
cmAddFx({id:'owl',n:'Owl (hoots now and then)',cat:'life',r:40,
 top(o,t){const s=cl(+o.sc||1,.25,4),ph=cmR(o,0,75),bl=((t+ph*9)%4.3)<.16,S=efSt(o);
  if(!bl){X.fillStyle='rgba(255,190,60,.3)';X.fillRect(Math.round(o.x-6*s)-1,Math.round(o.y)-1,4,4);X.fillRect(Math.round(o.x+3*s)-1,Math.round(o.y)-1,4,4);X.fillStyle='#ffc840';X.fillRect(Math.round(o.x-6*s),Math.round(o.y),2,2);X.fillRect(Math.round(o.x+3*s),Math.round(o.y),2,2)}
  if(typeof mode=='undefined'||mode!='play')return;if(!S.n)S.n=t+3+ph*8;if(t>=S.n){S.n=t+10+cmR(o,Math.floor(t),76)*8;if(typeof sfx=='function')sfx('owl',o.x,o.y,.55)}},
 ed(g,o){const s=cl(+o.sc||1,.25,4);g.fillStyle='#3a2a1a';g.beginPath();g.ellipse(o.x,o.y+4*s,9*s,11*s,0,0,7);g.fill();g.fillStyle='#ffc840';g.fillRect(o.x-6*s,o.y,2*s,2*s);g.fillRect(o.x+3*s,o.y,2*s,2*s)}});
// howl: wolves howling far off, now and then (every 35–70 s), wherever you are on the map (nothing to see; one is enough per map)
cmAddFx({id:'howl',n:'Wolves howling (far off)',cat:'life',r:6000,
 top(o,t){if(typeof mode=='undefined'||mode!='play')return;const S=efSt(o);if(!S.n)S.n=t+12+cmR(o,0,77)*10;if(t>=S.n){S.n=t+35+cmR(o,Math.floor(t),78)*35;if(typeof sfx=='function')sfx('howl',null,null,.3)}},
 ed(g,o){g.fillStyle='rgba(200,210,230,.7)';g.beginPath();g.moveTo(o.x-10,o.y+8);g.lineTo(o.x-4,o.y-8);g.lineTo(o.x,o.y-2);g.lineTo(o.x+4,o.y-10);g.lineTo(o.x+10,o.y+8);g.closePath();g.fill()}});
