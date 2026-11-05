//# world/kit-effects.js — Building kit effects: animated and lit points (fountain spray, fire, big fire (blaze), smoke, flickering light, light pools, sirens, hazard blinkers, road flares, glowing things, will-o'-wisps, water glints, ducks) plus portrait eyes; how a custom map runs them every frame (cmFxAnim under people, cmFxTop over people)
// ---------- effects ----------
// An effect is a point (x,y) with a size (sc, 0.25–4), a turn (r, degrees; fxTurn turns everything it draws) and sometimes a colour. bake(g,o) paints its still part into the map picture
// (light pools), anim(o,t) draws it under people each frame, top(o,t) over people, sm:1 makes it a smoke point (the game's SM
// list), lts(o,s,ph,L) adds its light sources to L (for effects added outside the switch in cmLightSrc). ed(g,o) is how the editor shows it (a still frame). Everything runs only while the effect is on screen.
const CMXCAT=[['water','Water'],['fire','Fire & smoke'],['light','Lights'],['spooky','Spooky'],['life','Wildlife']];
const PXLIGHT=[['#ffb040','Candle'],['#ffd27a','Warm lamp'],['#c8e0ff','Cool lamp'],['#b6ffd8','Ghost green'],['#ff5a5a','Red'],['#8ae8ff','Cyan']];
function fxR(o,b){return b*cl(+o.sc||1,.25,4)}
function fxOn(x,y,r){return x>cam.x-r&&x<cam.x+W+r&&y>cam.y-r&&y<cam.y+H+r}
function fxGlow(G,x,y,r,c,a){G.fillStyle=c;G.globalAlpha=a*.45;G.beginPath();G.arc(x,y,r,0,7);G.fill();G.globalAlpha=a;G.beginPath();G.arc(x,y,r*.45,0,7);G.fill();G.globalAlpha=1}
// a big fire (blaze): tongues of flame with a dark red edge, orange, yellow and a white-hot heart, each layer drawn across all the
// tongues so they merge into one fire; they flicker, sway and lean with the wind, licks of flame break off the tips and sparks
// rise. Its black smoke (fxBlazeSmoke) rolls up and drifts east, drawn over everyone. Everything comes from the time; only the smoke's
// picture is kept between frames (FXBS).
function fxTongue(G,x,y,w,h,sw){const r=w/2,b=w*.3;G.beginPath();G.moveTo(x-r,y);G.bezierCurveTo(x-r,y-h*.42,x+sw*.35-r*.45,y-h*.72,x+sw,y-h);
G.bezierCurveTo(x+sw*.35+r*.45,y-h*.72,x+r,y-h*.42,x+r,y);G.quadraticCurveTo(x+r,y+b,x,y+b);G.quadraticCurveTo(x-r,y+b,x-r,y);G.fill()}
const FXBZ=[['#b8281a',1,1,1],['#ff6a14',.76,.8,.82],['#ffb52a',.52,.58,.62],['#fff2b0',.27,.32,.38]];
// one flickering tongue (fire point i of thing o): its base x,y, width w and the tallest it gets hm; it leans downwind (east)
function fxTk(o,i,t,x,y,w,hm,lean=.14){const hx=cmR(o,i,71),f=.7+.18*Math.sin(t*7.3+i*2.1+hx*6)+.12*Math.sin(t*13.7+i*4.3),h=hm*f*(.78+.3*cmR(o,i,73)),
sw=(Math.sin(t*3.1+i*1.7)*.5+Math.sin(t*5.3+i*.9)*.25)*w*.55+lean*h;return[x,y,w,h,sw]}
// draw tongues [x,y,w,h,sway] as one fire: each colour across all of them, so they merge
function fxBurn(G,T){for(const[c,kw,kh,ks]of FXBZ){G.fillStyle=c;for(const[x,y,w,h,sw]of T)fxTongue(G,x,y,w*kw,h*kh,sw*ks)}}
// licks of flame breaking off the tips of a fire W wide and Hm tall at x,y, and sparks rising from it (n of each, scaled by s)
function fxLicks(G,o,t,x,y,W,Hm,s,n=5,lean=.14){for(let k=0;k<n;k++){const p=(t*1.25+cmR(o,k,74))%1,lx=x+(cmR(o,k,75)-.5)*W*.6+Math.sin(t*4+k)*5*s+lean*p*Hm*.6,ly=y-Hm*(.5+p*.65),z=(1-p)*11*s;if(z<1.5)continue;
G.fillStyle=p<.35?'#ffb52a':p<.7?'#ff6a14':'#b8281a';G.globalAlpha=1-p*.6;fxTongue(G,lx,ly,z,z*1.9,Math.sin(t*6+k)*z*.4)}
for(let k=0;k<n*2+2;k++){const p=(t*.55+cmR(o,k,76))%1,ex=x+(cmR(o,k,77)-.5)*W+Math.sin(t*2.3+k*3)*10*s*p+p*36*s,ey=y-Hm*.35-p*150*s;G.globalAlpha=1-p;G.fillStyle=p<.45?'#ffe27a':'#ff6a2a';G.fillRect(Math.round(ex),Math.round(ey),p<.3?3:2,p<.3?3:2)}G.globalAlpha=1}
function fxBlaze(G,o,t){if(!po(o,'fl',1))return;const s=cl(+o.sc||1,.25,4),x=o.x,y=o.y,W=56*s,Hm=72*s,n=7,T=[];
if(po(o,'glow',1)){G.save();G.globalCompositeOperation='lighter';G.fillStyle='#ff7a2a';for(const[k,a]of[[1.1,.07],[.55,.1]]){G.globalAlpha=a*(.85+.15*Math.sin(t*11+x));G.beginPath();G.ellipse(x,y-Hm*.35,W*k,Hm*.8*k,0,0,7);G.fill()}G.restore()}
for(let i=0;i<n;i++){const u=i/(n-1)-.5;T.push(fxTk(o,i,t,x+u*W+(cmR(o,i,71)-.5)*W*.12,y,W*.36*(.8+.4*cmR(o,i,72)),Hm*(1-u*u*2.2)))}
fxBurn(G,T);fxLicks(G,o,t,x,y,W,Hm,s)}
// the smoke is drawn solid into its own picture (so the puffs merge into one plume instead of see-through circles), lit on the
// sunward side, then faded in above the flames and out as it rises, and laid over the map. The picture is half size and redrawn
// about 24 times a second (smoke drifts slowly): drawing it in full every frame cost two milliseconds.
const FXBS=new WeakMap();
function fxBlazeSmoke(G,o,t){const s=cl(+o.sc||1,.25,4),x=o.x,y=o.y-60*s,w=Math.ceil(340*s),h=Math.ceil(340*s),ox=x-90*s,oy=y-300*s,N=14;
let K=FXBS.get(o);if(!K){K={c:document.createElement('canvas'),t:-9};K.c.width=Math.ceil(w/2);K.c.height=Math.ceil(h/2);FXBS.set(o,K)}const C=K.c;
if(Math.abs(t-K.t)>=1/24){K.t=t;const q=C.getContext('2d');q.setTransform(1,0,0,1,0,0);q.clearRect(0,0,C.width,C.height);q.setTransform(.5,0,0,.5,-ox*.5,-oy*.5);
const B=[];for(let k=0;k<N;k++){const p=(t*.13+k/N+cmR(o,k,78)*.04)%1,v=.75+.5*cmR(o,k,80);B.push([x+(cmR(o,k,79)-.5)*26*s+p*p*160*s+Math.sin(t*.6+k*1.3)*8*s*p,y-p*250*s,(12+p*48)*s*v])}
q.fillStyle='#231d19';for(const[px,py,r]of B){q.beginPath();q.arc(px,py,r,0,7);q.fill()}q.fillStyle='#3a322c';for(const[px,py,r]of B){q.beginPath();q.arc(px+r*.32,py-r*.3,r*.52,0,7);q.fill()}
q.globalCompositeOperation='destination-in';const g=q.createLinearGradient(0,y+14*s,0,oy);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(.12,'rgba(0,0,0,1)');g.addColorStop(.45,'rgba(0,0,0,.85)');g.addColorStop(1,'rgba(0,0,0,0)');q.fillStyle=g;q.fillRect(ox,oy,w,h);q.globalCompositeOperation='source-over'}
G.globalAlpha=.8;G.drawImage(C,0,0,C.width,C.height,ox,oy,w,h);G.globalAlpha=1}
function fxFlames(G,x,y,w,n,t,k){for(let i=0;i<n;i++){const fx=x-w/2+i*w/(n-1||1),fh=(10+(Math.sin(t*9+i*1.9+k)+1)*7)*w/40;G.fillStyle=i%2?'#ff7a1a':'#ffb02e';G.fillRect(fx-2,y-fh,4,fh);G.fillStyle='#ffe27a';G.fillRect(fx-1,y-fh*.55,2,fh*.5)}}
const CMXK=[
{id:'fountain',n:'Fountain spray',cat:'water',r:30,anim(o,t){const s=cl(+o.sc||1,.25,4),x=o.x,y=o.y;X.strokeStyle='rgba(220,240,255,.55)';X.lineWidth=1;for(let i=0;i<2;i++){const p=(t*.6+i*.5)%1;X.globalAlpha=1-p;X.beginPath();X.ellipse(x,y+49*s,(12+p*26)*s,(4+p*10)*s,0,0,7);X.stroke()}X.globalAlpha=1;
X.fillStyle='#d8eeff';for(let i=0;i<14;i++){const p=(t*1.1+i/14)%1,sg=i%2?1:-1,a=(i%7)/7,dx=sg*(4+a*14)*p*s,dy=(-16*Math.sin(p*Math.PI)+p*(14+a*8))*s;X.fillRect(Math.round(x+dx),Math.round(y+dy),2,2)}},
ed(g,o){const s=cl(+o.sc||1,.25,4);g.fillStyle='#d8eeff';for(let i=0;i<10;i++){const p=(i/10),sg=i%2?1:-1,a=(i%5)/5;g.fillRect(o.x+sg*(4+a*14)*p*s,o.y+(-16*Math.sin(p*Math.PI)+p*(14+a*8))*s,2,2)}g.strokeStyle='rgba(220,240,255,.6)';g.lineWidth=1;g.beginPath();g.ellipse(o.x,o.y+49*s,22*s,8*s,0,0,7);g.stroke()}},
{id:'water',n:'Water glints',cat:'water',r:60,anim(o,t){const r=fxR(o,60);X.fillStyle='#e8f8ff';for(let i=0;i<10;i++){const p=(t*.5+cmR(o,i,60))%1;if(p>.5)continue;const a=cmR(o,i,61)*6.283,d=Math.sqrt(cmR(o,i,62))*r;X.globalAlpha=Math.sin(p*2*Math.PI)*.8;X.fillRect(o.x+Math.cos(a)*d,o.y+Math.sin(a)*d*.6,4+(i%3)*2,1)}X.globalAlpha=1},ed(g,o){const r=fxR(o,60);g.fillStyle='rgba(232,248,255,.7)';for(let i=0;i<6;i++){const a=cmR(o,i,61)*6.283,d=Math.sqrt(cmR(o,i,62))*r;g.fillRect(o.x+Math.cos(a)*d,o.y+Math.sin(a)*d*.6,5,1)}}},
{id:'fire',n:'Fire',cat:'fire',r:20,def:{o:{glow:1}},opts:[['glow','Warm glow on the ground','chk']],bake(g,o){if(po(o,'glow',1)){const r=fxR(o,120);for(let k=r;k>20;k-=10){g.fillStyle='rgba(255,170,60,'+(.012+(r-k)/(r*42))+')';g.beginPath();g.arc(o.x,o.y-6,k,0,7);g.fill()}}},
anim(o,t){const s=cl(+o.sc||1,.25,4);fxGlow(X,o.x,o.y-8*s,40*s,'#ff9a3a',.08+.03*Math.sin(t*13+o.x));fxFlames(X,o.x,o.y,30*s,Math.max(3,Math.round(9*Math.min(1.5,s))),t,o.x*.1)},ed(g,o){const s=cl(+o.sc||1,.25,4);for(let i=0;i<7;i++){const fx=o.x-15*s+i*5*s,fh=(10+(i*7)%12)*s;g.fillStyle=i%2?'#ff7a1a':'#ffb02e';g.fillRect(fx,o.y-fh,4*s,fh);g.fillStyle='#ffe27a';g.fillRect(fx+s,o.y-fh*.5,2*s,fh*.5)}}},
{id:'blaze',n:'Big fire (with black smoke)',cat:'fire',r:150,def:{o:{fl:1,glow:1,smoke:1}},opts:[['fl','Flames','chk'],['glow','Firelight and a warm glow on the ground','chk'],['smoke','Black smoke','chk']],bake(g,o){if(po(o,'glow',1)){const r=fxR(o,170);for(let k=r;k>24;k-=12){g.fillStyle='rgba(255,150,50,'+(.012+(r-k)/(r*36))+')';g.beginPath();g.ellipse(o.x,o.y-4,k,k*.7,0,0,7);g.fill()}}},
anim(o,t){fxBlaze(X,o,t)},top(o,t){if(po(o,'smoke',1))fxBlazeSmoke(X,o,t)},lts(o,s,ph,L){if(po(o,'glow',1))L.push({x:o.x,y:o.y-30*s,r:150*s,c:'#ff8a2a',i:1,f:'fire',ph,gs:1.4})},ed(g,o){fxBlaze(g,o,1.7);if(po(o,'smoke',1))fxBlazeSmoke(g,o,1.7)}},
{id:'smoke',n:'Smoke',cat:'fire',r:14,sm:1,ed(g,o){g.fillStyle='rgba(138,138,138,.75)';for(const[a,b,r]of[[0,0,6],[5,-8,7],[-2,-17,8],[6,-26,9]]){g.beginPath();g.arc(o.x+a,o.y+b,r,0,7);g.fill()}}},
{id:'flicker',n:'Flickering light',cat:'light',r:22,pal:PXLIGHT,def:{c:'#ffb040',o:{flame:1}},opts:[['flame','Little flame','chk']],anim(o,t){const c=cmCol(o.c,'#ffb040'),r=fxR(o,22),f=.75+.25*Math.sin(t*11+o.x)*Math.sin(t*7.3+o.y);X.fillStyle=c;X.globalAlpha=.06*f;X.beginPath();X.arc(o.x,o.y,r*1.8,0,7);X.fill();X.globalAlpha=.13*f;X.beginPath();X.arc(o.x,o.y,r*.7,0,7);X.fill();X.globalAlpha=1;if(po(o,'flame',1)){X.fillStyle='#ffe27a';X.fillRect(o.x-1,o.y-1-Math.round(f),2,3)}},
ed(g,o){const c=cmCol(o.c,'#ffb040'),r=fxR(o,22);g.fillStyle=c;g.globalAlpha=.12;g.beginPath();g.arc(o.x,o.y,r*1.8,0,7);g.fill();g.globalAlpha=.25;g.beginPath();g.arc(o.x,o.y,r*.7,0,7);g.fill();g.globalAlpha=1;g.fillStyle='#ffe27a';g.fillRect(o.x-1,o.y-2,2,3)}},
{id:'light',n:'Light pool',cat:'light',r:70,pal:PXLIGHT,def:{c:'#ffd27a'},bake(g,o){const c=cmCol(o.c,'#ffd27a'),r=fxR(o,70);g.fillStyle=c;for(let k=r;k>8;k-=r/9){g.globalAlpha=.035;g.beginPath();g.ellipse(o.x,o.y,k,k*.62,0,0,7);g.fill()}g.globalAlpha=1}},
{id:'siren',n:'Emergency lights',cat:'light',r:46,def:{o:{m:'police'}},opts:[['m','Kind',[['police','Police (red / blue)'],['amb','Ambulance (red)'],['fire','Fire truck (red / white)']]]],anim(o,t){const m=po(o,'m','police'),s=cl(+o.sc||1,.25,4),ph=cmR(o,0,63),k=Math.floor(t*6+ph*6)%4;
const L=m=='police'?[[-8,'#ff2a2a',k<2],[8,'#3a7aff',k>=2]]:m=='amb'?[[-8,'#ff2a2a',k%2==0],[8,'#ff2a2a',k%2==1]]:[[-8,'#ff2a2a',k<2],[8,'#ffffff',Math.floor(t*9+ph*9)%3==0]];for(const[dx,c,on]of L){if(!on)continue;const x=o.x+dx*s,y=o.y;X.fillStyle=c;X.globalAlpha=.07;X.beginPath();X.arc(x,y,46*s,0,7);X.fill();X.globalAlpha=.16;X.beginPath();X.arc(x,y,18*s,0,7);X.fill();X.globalAlpha=.45;X.beginPath();X.arc(x,y,8*s,0,7);X.fill();X.globalAlpha=1;X.fillRect(Math.round(x)-2,Math.round(y)-2,4,4)}},
ed(g,o){const s=cl(+o.sc||1,.25,4),m=po(o,'m','police');g.fillStyle='#ff2a2a';g.fillRect(o.x-10*s,o.y-3,8,6);g.fillStyle=m=='police'?'#3a7aff':m=='amb'?'#ff2a2a':'#ffffff';g.fillRect(o.x+2*s,o.y-3,8,6)}},
{id:'hazard',n:'Hazard blinkers',cat:'light',r:28,anim(o,t){if((t*1.3+cmR(o,0,64))%1>=.5)return;const s=cl(+o.sc||1,.25,4);for(const dx of[-10,10]){const x=o.x+dx*s;X.fillStyle='#ffa62a';X.globalAlpha=.05;X.beginPath();X.arc(x,o.y,28*s,0,7);X.fill();X.globalAlpha=.12;X.beginPath();X.arc(x,o.y,11*s,0,7);X.fill();X.globalAlpha=1;X.fillRect(Math.round(x)-2,Math.round(o.y)-2,4,4)}},ed(g,o){g.fillStyle='#ffa62a';g.fillRect(o.x-12,o.y-2,4,4);g.fillRect(o.x+8,o.y-2,4,4)}},
{id:'flare',n:'Road flare',cat:'fire',r:30,bake(g,o){g.fillStyle='#16111c';g.fillRect(o.x-6,o.y-2,12,4);g.fillStyle='#d8403a';g.fillRect(o.x-5,o.y-1,10,2)},anim(o,t){const c=Math.random()<.5?'#ff3a2a':'#ff7a3a',s=cl(+o.sc||1,.25,4);X.fillStyle=c;X.globalAlpha=.05;X.beginPath();X.arc(o.x+5,o.y,32*s,0,7);X.fill();X.globalAlpha=.12;X.beginPath();X.arc(o.x+5,o.y,13*s,0,7);X.fill();X.globalAlpha=1;X.fillRect(o.x+3,o.y-3,4,4)},ed(g,o){g.fillStyle='#ff5a2a';g.fillRect(o.x+3,o.y-3,4,4)}},
{id:'glow',n:'Glowing pulse',cat:'spooky',r:16,pal:[['#8ae8ff','Mushroom cyan'],['#b6ffd8','Ghost green'],['#d89aff','Violet'],['#ffd27a','Ember']],def:{c:'#8ae8ff'},anim(o,t){const a=.5+.5*Math.sin(t*1.7+o.x*.1);X.fillStyle=cmCol(o.c,'#8ae8ff');X.globalAlpha=.08+.08*a;X.beginPath();X.arc(o.x,o.y,fxR(o,16),0,7);X.fill();X.globalAlpha=1},ed(g,o){g.fillStyle=cmCol(o.c,'#8ae8ff');g.globalAlpha=.25;g.beginPath();g.arc(o.x,o.y,fxR(o,16),0,7);g.fill();g.globalAlpha=1}},
{id:'wisp',n:'Will-o\'-wisps',cat:'spooky',r:90,pal:[['#9affe8','Green'],['#c8e0ff','Blue'],['#ffd27a','Gold']],def:{c:'#9affe8'},top(o,t){const r=fxR(o,90),c=cmCol(o.c,'#9affe8');for(let i=0;i<3;i++){const a=t*(.2+cmR(o,i,65)*.25)+cmR(o,i,66)*6.283,x=o.x+Math.cos(a)*r*(.4+.6*cmR(o,i,67))+Math.sin(t*1.3+i)*16,y=o.y+Math.sin(a)*r*.5-18+Math.cos(t*1.7+i)*10;
if(!fxOn(x,y,30))continue;X.fillStyle=c;X.globalAlpha=.12;X.beginPath();X.arc(x,y,14,0,7);X.fill();X.globalAlpha=.3;X.beginPath();X.arc(x,y,6,0,7);X.fill();X.globalAlpha=1;X.fillStyle='#e8fff8';X.fillRect(Math.round(x)-1,Math.round(y)-1,3,3)}},ed(g,o){const c=cmCol(o.c,'#9affe8');for(let i=0;i<3;i++){const a=cmR(o,i,66)*6.283,r=fxR(o,90)*.6;g.fillStyle=c;g.globalAlpha=.35;g.beginPath();g.arc(o.x+Math.cos(a)*r,o.y+Math.sin(a)*r*.5-18,6,0,7);g.fill();g.globalAlpha=1}}},
{id:'ducks',n:'Ducks',cat:'life',r:60,anim(o,t){const r=fxR(o,60);for(let i=0;i<3;i++){const a=cmR(o,i,68)*6.283+t*(.05+cmR(o,i,69)*.05),x=o.x+Math.cos(a)*r*(.55+i*.15),y=o.y+Math.sin(a)*r*.5*(.55+i*.15);if(!fxOn(x,y,30))continue;const fl=Math.sin(a)<0?1:-1;
X.strokeStyle='rgba(220,240,255,.45)';X.lineWidth=1;X.beginPath();X.ellipse(x,y+4,12+Math.sin(t*3+i)*2,4,0,0,7);X.stroke();X.fillStyle='#16111c';X.fillRect(x-8,y-5,16,9);X.fillRect(x+fl*5-3,y-11,7,7);X.fillStyle='#e8e4d8';X.fillRect(x-7,y-4,14,7);X.fillStyle=i%2?'#2f8a4a':'#e8e4d8';X.fillRect(x+fl*5-2,y-10,5,5);X.fillStyle='#e8a030';X.fillRect(x+fl*9-(fl<0?2:0),y-8,3,2);X.fillStyle='#16111c';X.fillRect(x+fl*6,y-9,1,1)}},
ed(g,o){g.fillStyle='#16111c';g.fillRect(o.x-8,o.y-5,16,9);g.fillRect(o.x+2,o.y-11,7,7);g.fillStyle='#e8e4d8';g.fillRect(o.x-7,o.y-4,14,7);g.fillStyle='#2f8a4a';g.fillRect(o.x+3,o.y-10,5,5);g.fillStyle='#e8a030';g.fillRect(o.x+9,o.y-8,3,2)}}];
for(const t of CMXK)cmAddFx(t);
// turn what an effect draws around its own point (hazard blinkers and sirens line up with the vehicle they sit on)
function fxTurn(G,o){if(o.r){G.translate(o.x,o.y);G.rotate(o.r*Math.PI/180);G.translate(-o.x,-o.y)}}
// bake the still part of an effect into the map picture
function cmFxBake(g,o){const T=cmFx(o.fx);if(!T||!T.bake)return;g.save();try{fxTurn(g,o);T.bake(g,o)}finally{g.restore()}}
// the editor's still picture of an effect (its baked part, then a frame of the animation)
function cmFxEd(g,o){const T=cmFx(o.fx);if(!T)return;g.save();try{fxTurn(g,o);if(T.bake)T.bake(g,o);if(T.ed)T.ed(g,o)}finally{g.restore()}}
// the moving parts of a custom map, collected by cmBuild: HS.CX = {A: under people (effects, and props with an animation an(o, t),
// like the LED message sign), T: over people, E: portrait eyes}
function cmFxData(d){const A=[],T=[],E=[],O=[];for(const o of d.obj){if(o.fx){const F=cmFx(o.fx);if(!F)continue;const it={o,f:F,r:fxR(o,F.r||30)+60};if(F.anim)A.push(it);if(F.top)T.push(it)}
else if(o.k=='portrait'){const B=cmOB(o.k);if(B&&B.eyes)for(const e of B.eyes(o))E.push(e)}else if(!o.dc&&!o.veh){const B=cmOB(o.k);if(B&&B.ov)O.push({o,B,al:1});if(B&&B.an)A.push({o,f:{anim:B.an},r:Math.max(B.w,B.h)+60})}}
for(const o of d.areas){const F=cmArea(o.a);if(!F)continue;const it={o,f:F,a:1,r:Math.hypot(o.w,o.h)/2+120};if(F.anim)A.push(it);if(F.top)T.push(it)}if(typeof kmTopItems=='function')T.push(...kmTopItems(d));return A.length||T.length||E.length||O.length?{A,T,E,O}:null}
function fxVis(it){const o=it.o;if(it.a)return o.x<cam.x+W+60&&o.x+o.w>cam.x-60&&o.y<cam.y+H+60&&o.y+o.h>cam.y-60;return fxOn(o.x,o.y,it.r)}
// under people (called next to the built-in maps' animations)
function cmFxAnim(){const C=HS.CX;if(!C||!HS.CM)return;const t=performance.now()/1000;for(const it of C.A)if(fxVis(it)){if(!it.o.r||it.a){it.f.anim(it.o,t);continue}X.save();try{fxTurn(X,it.o);it.f.anim(it.o,t)}finally{X.restore()}}
// portrait eyes follow the nearest living player; now and then one pair glows red (as in the Haunted Mansion)
if(C.E.length){const Q=(typeof PL!='undefined'&&PL.find(alive))||P,red=Math.floor(t/5)%C.E.length,rp=(t%5)<1.2;for(let i=0;i<C.E.length;i++){const e=C.E[i];if(!fxOn(e.x,e.y,10))continue;const a=Math.atan2(Q.y-e.y,Q.x-e.x),px=Math.round(e.x+Math.cos(a)*.9-.5),py=Math.round(e.y+Math.sin(a)*.9-.5);
if(rp&&(i>>1)==(red>>1)){X.fillStyle='#ff2a1a';X.globalAlpha=.35;X.beginPath();X.arc(e.x,e.y,4,0,7);X.fill();X.globalAlpha=1;X.fillRect(px,py,2,2)}else{X.fillStyle='#16111c';X.fillRect(px,py,1,1)}}}}
// over people: hanging signs, then fog and wisps
function cmFxTop(){const C=HS.CX;if(!C||!HS.CM)return;const t=performance.now()/1000;if(C.O.length)cmOverhead(C.O,t);for(const it of C.T)if(it.a||fxVis(it)){if(!it.o.r||it.a){it.f.top(it.o,t);continue}X.save();try{fxTurn(X,it.o);it.f.top(it.o,t)}finally{X.restore()}}}
// hanging signs (props with ov): drawn from a picture made once, over everyone; while a player or zombie stands under one it
// fades to see-through (so nobody hides under it) and back when they've gone
function cmOverhead(O,t){const dt=Math.min(.1,Math.max(0,t-(cmOverhead.t||t)));cmOverhead.t=t;const vx0=cam.x-60,vy0=cam.y-60,vx1=cam.x+W+60,vy1=cam.y+H+120;let E=null;
for(const it of O){const o=it.o,B=it.B,x0=o.x-B.w/2,y0=o.y-B.h;if(o.x+B.w/2<vx0||x0>vx1||o.y<vy0||y0>vy1)continue;
 if(!it.cv){it.cv=document.createElement('canvas');it.cv.width=B.w;it.cv.height=B.h;try{B.f(it.cv.getContext('2d'),B.w/2,B.h,o.vr!=null?o.vr:.5,o.c,o.tx)}catch(e){}}
 if(!E){E=[];for(const p of(typeof PL!='undefined'&&PL.length?PL:[P]))if(p&&alive(p))E.push([p.x,p.y-14]);for(const z of zs)if(z.hp>0&&z.x>vx0&&z.x<vx1&&z.y>vy0&&z.y<vy1)E.push([z.x,z.y-14])}
 const under=E.some(([ex,ey])=>ex>x0+4&&ex<x0+B.w-4&&ey>y0+30&&ey<o.y+18),to=under?.35:1;it.al+=(to-it.al)*Math.min(1,dt*8);
 X.globalAlpha=it.al;X.drawImage(it.cv,Math.round(x0),Math.round(y0));X.globalAlpha=1}}
