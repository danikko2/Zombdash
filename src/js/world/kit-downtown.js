//# world/kit-downtown.js — Building kit pieces from Downtown Zombville: the stadium's front (a solid shape: facade and the upper stands behind it), caution tape, long morning shadows, sunlight through windows, spray-painted messages, sun glints sweeping across tower glass, pigeons that scatter, steam from the manholes, newspapers blowing down the street
// ---------- Downtown Zombville's pieces ----------
// (functions and registries only: nothing here runs during the first map build at boot)
// arena: the front of a stadium (a closed shape, solid: nobody gets in). Its outer face is the concrete facade with columns and
// glass; behind it the concourse roof, then the stands, row after row following the face, in the team's colour. Sides that lie
// along the shape's own bounding box (where the map's edge cuts the stadium off) get no facade.
function dtFaces(P){const n=P.length,bb=cmPolyBB(P),e=.5,cut=i=>{const a=P[i],b=P[(i+1)%n];return Math.abs(a[0]-b[0])<e&&(Math.abs(a[0]-bb.x0)<e||Math.abs(a[0]-bb.x1)<e)||Math.abs(a[1]-b[1])<e&&(Math.abs(a[1]-bb.y0)<e||Math.abs(a[1]-bb.y1)<e)};
 let st=-1;for(let i=0;i<n;i++)if(cut(i)){st=i;break}if(st<0)return[P.concat([P[0]])];const out=[];let cur=null;
 for(let k=1;k<=n;k++){const i=(st+k)%n;if(cut(i)){if(cur&&cur.length>1)out.push(cur);cur=null;continue}if(!cur)cur=[P[i]];cur.push(P[(i+1)%n])}if(cur&&cur.length>1)out.push(cur);return out}
function pthArena(g,P,o){if(P[0][0]==P[P.length-1][0]&&P[0][1]==P[P.length-1][1])P=P.slice(0,-1);if(P.length<3)return;const c1=cmCol(o.c,'#b83a32'),c2='#d8d4cc',F=dtFaces(P),bb=cmPolyBB(P),D=Math.min(1400,Math.max(bb.x1-bb.x0,bb.y1-bb.y0));
 pthClip(g,P,()=>{g.fillStyle='#2a2c32';g.fillRect(bb.x0,bb.y0,bb.x1-bb.x0,bb.y1-bb.y0);const S=(w,c)=>{for(const A of F)cmLine(g,A,w,c,'round')};
  // the stands, back rows first; every eighth a walkway
  for(let d=D;d>150;d-=14){const k=Math.floor((d-150)/14);S(d*2,k%8==3?'#3a3d46':k%2?c1:pcSh(c1,.86))}
  S(300,'#3a3d46');S(296,'#2a2c32');for(let d=150;d>70;d-=10)S(d*2,(d/10)%2?'#9aa0aa':'#8a9098');S(140,'#4a5a6e');
  // which way is in: test one point
  const A0=F[0],m=Math.floor(A0.length/2),q0=A0[m],q1=A0[Math.min(A0.length-1,m+1)],a0=Math.atan2(q1[1]-q0[1],q1[0]-q0[0]),sg=cmPolyIn(P,q0[0]-Math.sin(a0)*30,q0[1]+Math.cos(a0)*30)?1:-1;
  for(const A of F){let i=0;cmAlong(A,26,(x,y,a)=>{i++;g.save();g.translate(x,y);g.rotate(a);g.fillStyle=i%2?'#8ab0d0':'#a8c8e0';g.fillRect(-10,sg>0?54:-66,20,12);g.restore()})}
  S(96,'#16111c');S(92,c2);S(60,pcSh(c2,.86));for(const A of F)cmAlong(A,40,(x,y,a)=>{g.save();g.translate(x,y);g.rotate(a);const y0=sg>0?0:-46;g.fillStyle='#16111c';g.fillRect(-7,y0,14,46);g.fillStyle=pcSh(c2,1.08);g.fillRect(-6,y0+1,12,44);g.fillStyle=pcSh(c2,.72);g.fillRect(3,y0+1,3,44);g.restore()})})}
cmAddPath({id:'arena',sharp:1,n:'Stadium front (solid)',cat:'shape',closed:1,fl:0,pal:[['#b83a32','Red'],['#2f4a8a','Navy'],['#2f8a4a','Green'],['#e0b030','Gold']],def:{c:'#b83a32'},pri:-60,f:pthArena,coll(P,o,out){cmPolyBoxes(P,12,cmPFl(o),out)}});
// caution tape between posts (yellow and black; red for DANGER): it doesn't stop anyone
function pthTape(g,P,o){const c=cmCol(o.c,'#f0c020');cmLine(g,P,4,'#16111c','butt');cmLine(g,P,2,c,'butt');let i=0;cmAlong(P,9,(x,y,a)=>{if(i++%2)return;g.save();g.translate(x,y);g.rotate(a);g.fillStyle='#16111c';g.fillRect(-1,-1,3,2);g.restore()});
 for(const q of[P[0],P[P.length-1]]){g.fillStyle='#16111c';g.fillRect(q[0]-3,q[1]-14,6,16);g.fillStyle='#e07a1a';g.fillRect(q[0]-2,q[1]-13,4,14);g.fillStyle='#f4f4f0';g.fillRect(q[0]-2,q[1]-9,4,3)}let n=0;cmAlong(P,90,(x,y)=>{if(!n++)return;g.fillStyle='#16111c';g.fillRect(x-2,y-12,4,14);g.fillStyle='#e07a1a';g.fillRect(x-1,y-11,2,12)})}
cmAddPath({id:'tape',sharp:1,n:'Caution tape',cat:'line',w:4,wr:[2,8],pal:[['#f0c020','Caution'],['#d8403a','Danger'],['#2f6fd0','Police']],def:{c:'#f0c020'},pri:-5,f:pthTape});
// sunshadow: a tall building's long shadow in low sun, darkest by the building (the side you pick) and fading away from it
function arSunShadow(g,o){const{x,y,w,h}=o,d=ao(o,'d','e'),a=cl(+ao(o,'s',1)||1,.2,2),n=12;for(let i=0;i<n;i++){const k=i/n,al=.034*a*(1-k*.6);g.fillStyle='rgba(18,22,52,'+al.toFixed(3)+')';
 if(d=='e')g.fillRect(x+w*k*.9,y+3*k,w*(1-k*.9),h-6*k);else if(d=='w')g.fillRect(x,y+3*k,w*(1-k*.9),h-6*k);else if(d=='n')g.fillRect(x+3*k,y,w-6*k,h*(1-k*.9));else g.fillRect(x+3*k,y+h*k*.9,w-6*k,h*(1-k*.9))}}
cmAddArea({id:'sunshadow',n:'Long shadow (low sun)',cat:'effect',fl:null,def:{o:{d:'e',s:1}},opts:[['d','Building on the',[['e','East side'],['w','West side'],['n','North side'],['s','South side']]],['s','Darkness',[.2,2]]],min:[20,20],pri:-6,f:arSunShadow});
// sunbeam: early sun falling through a window onto the floor: slanting shafts with the panes' bright patch at the far end (turn it so
// the window is at the left; it lights the room a little)
cmAddDec({id:'sunbeam',n:'Sunlight through a window',cat:'light',w:120,h:60,pal:[['#ffcf8a','Morning'],['#ffe8b8','Noon'],['#ff9a5a','Sunset']],f(g,v,K){g.fillStyle=K.b;for(let i=0;i<3;i++){g.globalAlpha=.07+.03*i;g.beginPath();g.moveTo(-58,-22+i*4);g.lineTo(-58,22-i*4);g.lineTo(40-i*6,30-i*3);g.lineTo(58-i*4,-8+i*3);g.closePath();g.fill()}
 g.globalAlpha=.32;g.fillStyle=K.ll||K.b;for(const[a,b]of[[22,-6],[40,-4],[22,10],[40,12]])g.fillRect(a,b,14,12);g.globalAlpha=1}});
// spray: a message spray-painted in a hurry, paint running (your text; → ← ↑ ↓ arrows work)
cmAddDec({id:'spray',n:'Spray-painted message',cat:'paint',w:200,h:40,pal:[['#d8403a','Red'],['#ff7a1a','Orange'],['#e8e8e0','White'],['#16161a','Black'],['#3aaa5a','Green']],txt:30,f(g,v,K,t){t=(t||'HELP').toUpperCase();const s=dcFit(g,t,192,26,'Impact, "Arial Black", Arial, sans-serif');g.textAlign='center';g.textBaseline='middle';
 g.globalAlpha*=.9;g.fillStyle=K.b;g.fillText(t,0,0);const W=Math.min(192,g.measureText(t).width);for(let i=0;i<7;i++){const x=-W/2+dcH(v,i,61)*W;g.fillRect(x,s*.3,2,4+dcH(v,i,62)*10)}g.textAlign='left';g.textBaseline='alphabetic'}});
// what each effect is doing (pigeons sitting, flying off or gone), kept by the effect
const DTST=new WeakMap();
function dtSt(o){let s=DTST.get(o);if(!s){s={m:'sit',t:0,ax:0,ay:0};DTST.set(o,s)}return s}
// glint: low sun catching a tower's glass: a bright sheen slides along the windows every few seconds and stars twinkle on them
// (lay it along a sunlit edge of a tower: size sets its length, 200 px at 1; turn it to follow the edge)
cmAddFx({id:'glint',n:'Sun glint on glass',cat:'light',r:120,
 anim(o,t){const s=cl(+o.sc||1,.25,4),L=200*s,ph=cmR(o,0,82),P=5+ph*4,u=((t+ph*11)%P)/P,x0=o.x-L/2;
  if(u<.35){const k=u/.35,x=x0+k*L;X.fillStyle='rgba(255,236,200,.18)';X.fillRect(Math.round(x-18),o.y-5,36,10);X.fillStyle='rgba(255,248,226,.5)';X.fillRect(Math.round(x-5),o.y-4,10,8);X.fillStyle='#fffbe8';X.fillRect(Math.round(x-1),o.y-3,2,6)}
  for(let i=0;i<4;i++){const v=Math.sin(t*(1.3+cmR(o,i,83))+i*2.3);if(v<.75)continue;const k=(v-.75)*4,x=Math.round(x0+cmR(o,i,84)*L),y=Math.round(o.y+(cmR(o,i,85)-.5)*6);X.globalAlpha=k;X.fillStyle='#fffbe8';X.fillRect(x-4,y,9,1);X.fillRect(x,y-4,1,9);X.fillRect(x-1,y-1,3,3);X.globalAlpha=1}},
 ed(g,o){const s=cl(+o.sc||1,.25,4);g.fillStyle='rgba(255,240,200,.6)';g.fillRect(o.x-100*s,o.y-2,200*s,4);g.fillStyle='#fffbe8';g.fillRect(o.x-4,o.y-4,9,9)}});
// pigeons: a flock pecking about; a player within about 110 px sends them up in a clatter of wings, and they come back later
const DTPN=8;
function dtBird(x,y,s,fr){X.fillStyle='#16111c';X.fillRect(Math.round(x-3*s),Math.round(y-2*s),Math.round(7*s)||1,Math.round(4*s)||1);X.fillStyle='#8a8e9a';X.fillRect(Math.round(x-2*s),Math.round(y-1*s),Math.round(5*s)||1,Math.round(2*s)||1);X.fillStyle='#5a6070';X.fillRect(Math.round(x+2*s),Math.round(y-3*s),Math.round(2*s)||1,Math.round(2*s)||1);
 if(fr>=0){const up=fr<.5;X.fillStyle='#b8bcc8';X.fillRect(Math.round(x-6*s),Math.round(y-(up?6:1)*s),Math.round(5*s)||1,Math.round(2*s)||1);X.fillRect(Math.round(x+2*s),Math.round(y-(up?6:1)*s),Math.round(5*s)||1,Math.round(2*s)||1)}}
cmAddFx({id:'pigeons',n:'Pigeons (scatter when you come near)',cat:'life',r:220,
 anim(o,t){const S=dtSt(o);if(S.m!='sit')return;const s=cl(+o.sc||1,.25,4),r=46*s;for(let i=0;i<DTPN;i++){const a=cmR(o,i,86)*6.283,d=(.25+.75*cmR(o,i,87))*r,x=o.x+Math.cos(a)*d+Math.sin(t*.4+i)*3,y=o.y+Math.sin(a)*d*.55,pk=Math.sin(t*(3+cmR(o,i,88)*2)+i*3)>.6?1:0;dtBird(x,y+pk*s,s,-1)}},
 top(o,t){const S=dtSt(o),s=cl(+o.sc||1,.25,4),r=46*s,n=typeof gyNear=='function'?gyNear(o.x,o.y):null;
  if(S.m=='sit'&&n&&n.d<110*s){S.m='fly';S.t=t;S.ax=o.x-n.p.x;S.ay=o.y-n.p.y;const l=Math.hypot(S.ax,S.ay)||1;S.ax/=l;S.ay/=l;if(typeof sfx=='function')sfx('flap',o.x,o.y,.5,.5)}
  else if(S.m=='gone'&&t-S.t>8&&(!n||n.d>300*s))S.m='sit';if(S.m!='fly')return;const u=t-S.t;if(u>2.2){S.m='gone';S.t=t;return}
  X.globalAlpha=Math.max(0,1-u/2.2);for(let i=0;i<DTPN;i++){const a=cmR(o,i,86)*6.283,d=(.25+.75*cmR(o,i,87))*r,x0=o.x+Math.cos(a)*d,y0=o.y+Math.sin(a)*d*.55,sp=(120+cmR(o,i,89)*90)*s,sw=(cmR(o,i,90)-.5)*1.6,dx=S.ax*Math.cos(sw)-S.ay*Math.sin(sw),dy=S.ax*Math.sin(sw)+S.ay*Math.cos(sw);
   dtBird(x0+dx*sp*u+Math.sin(u*6+i)*10*u,y0+dy*sp*u*.6-u*u*30*s,s*1.15,(t*9+i*.29)%1)}X.globalAlpha=1},
 ed(g,o){const s=cl(+o.sc||1,.25,4);g.fillStyle='#8a8e9a';for(let i=0;i<DTPN;i++){const a=cmR(o,i,86)*6.283,d=(.25+.75*cmR(o,i,87))*46*s;g.fillRect(o.x+Math.cos(a)*d-3*s,o.y+Math.sin(a)*d*.55-2*s,6*s,3*s)}}});
// steam: steam rising out of a manhole and drifting off (put it on a manhole decal)
cmAddFx({id:'steam',n:'Steam from a manhole',cat:'fire',r:90,
 top(o,t){const s=cl(+o.sc||1,.25,4),ph=cmR(o,0,91);for(let i=0;i<7;i++){const u=((t*.32+i/7+ph)%1),x=o.x+u*u*30*s+Math.sin(t*1.1+i*1.7)*6*s,y=o.y-u*70*s,r=(6+u*22)*s;X.globalAlpha=.32*(1-u)*Math.min(1,u*6);X.fillStyle='#eef2f6';X.beginPath();X.arc(x,y,r,0,7);X.fill()}X.globalAlpha=1},
 ed(g,o){const s=cl(+o.sc||1,.25,4);g.fillStyle='rgba(238,242,246,.6)';for(const[a,b,r]of[[0,-10,8],[6,-26,12],[14,-46,16]]){g.beginPath();g.arc(o.x+a*s,o.y+b*s,r*s,0,7);g.fill()}}});
// litter: newspapers and flyers blowing down the street, tumbling and settling (they blow towards the right; turn it to aim them)
cmAddFx({id:'litter',n:'Newspapers blowing',cat:'misc',r:260,
 anim(o,t){const s=cl(+o.sc||1,.25,4),L=320*s;for(let i=0;i<3;i++){const P=6+cmR(o,i,92)*4,u=((t+cmR(o,i,93)*P)%P)/P,x=-L/2+u*L,y=(cmR(o,i,94)-.5)*60*s+Math.sin(u*9+i)*8*s,a=t*(2+i)+i,f=Math.abs(Math.sin(t*5+i*2));
  X.save();X.translate(o.x+x,o.y+y);X.rotate(a*.3);X.globalAlpha=Math.min(1,Math.min(u,1-u)*6)*.9;X.fillStyle='#16111c';X.fillRect(-6,-4*f-1,12,8*f+2);X.fillStyle=i%2?'#e8e4d8':'#d8dce4';X.fillRect(-5,-4*f,10,8*f);X.fillStyle='#9a9a9a';X.fillRect(-3,-2*f,6,1);X.restore()}X.globalAlpha=1},
 ed(g,o){const s=cl(+o.sc||1,.25,4);g.fillStyle='#e8e4d8';for(const dx of[-100,0,90]){g.fillRect(o.x+dx*s-5,o.y-4,10,8)}g.strokeStyle='rgba(232,228,216,.6)';g.beginPath();g.moveTo(o.x-150*s,o.y);g.lineTo(o.x+150*s,o.y);g.stroke()}});
