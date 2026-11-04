//# world/kit-graveyard.js — Building kit pieces from the Graveyard: something moving behind a mausoleum's bars, hands clawing out of the ground, crows that take off when you come near, stained-glass windows
// ---------- the Graveyard's pieces ----------
// (functions and registries only: nothing here runs during the first map build at boot)
// what each effect is doing (the crows: sitting, flying off or gone; when they last called), kept by the effect
const GYST=new WeakMap();
function gySt(o){let s=GYST.get(o);if(!s){s={m:'sit',t:0,ax:0,ay:0};GYST.set(o,s)}return s}
// the nearest living player to (x, y), or null (in the game only)
function gyNear(x,y){if(typeof PL=='undefined'||mode!='play')return null;let b=null,bd=1e9;for(const p of PL){if(!p||p.dead||p.dn)continue;const d=Math.hypot(p.x-x,p.y-y);if(d<bd){bd=d;b=p}}return b?{p:b,d:bd}:null}
// doorshade: something moving behind a barred, glowing door (made for the glowing mausoleum: put it on the door's foot, 14 px above
// the mausoleum's). Every so often a dark shape crosses behind the bars; now and then two red eyes catch the light.
cmAddFx({id:'doorshade',n:'Something behind the bars',cat:'spooky',r:70,
 anim(o,t){const s=cl(+o.sc||1,.25,4),ph=cmR(o,0,40),P=8+ph*6,u=(t+ph*20)%P,D=3.2;if(u>D)return;const w=40*s,h=98*s,x0=o.x-w/2,y0=o.y-h,k=u/D,dir=Math.floor((t+ph*20)/P)%2?1:-1,sx=o.x+dir*(-w/2-14*s+k*(w+28*s));
  X.save();try{X.beginPath();X.rect(x0,y0,w,h);X.clip();X.fillStyle='rgba(18,10,14,.88)';X.beginPath();X.ellipse(sx,y0+30*s,8*s,9*s,0,0,7);X.fill();X.beginPath();X.ellipse(sx,y0+58*s,14*s,22*s,0,0,7);X.fill();X.fillRect(sx-12*s,y0+58*s,24*s,h);
   if(k>.3&&k<.7&&cmH(Math.floor((t+ph*20)/P),ph,41)<.6){X.fillStyle='#ff2a1a';X.fillRect(Math.round(sx-4*s),Math.round(y0+28*s),2,2);X.fillRect(Math.round(sx+2*s),Math.round(y0+28*s),2,2)}
   X.fillStyle='#26262c';for(let i=0;i<5;i++)X.fillRect(Math.round(x0+i*9*s),Math.round(y0),Math.max(2,Math.round(3*s)),Math.round(h));X.fillRect(Math.round(x0),Math.round(y0+28*s),Math.round(w),Math.max(2,Math.round(3*s)));X.fillRect(Math.round(x0),Math.round(y0+64*s),Math.round(w),Math.max(2,Math.round(3*s)))}finally{X.restore()}},
 ed(g,o){const s=cl(+o.sc||1,.25,4);g.strokeStyle='rgba(255,90,60,.6)';g.lineWidth=1;g.strokeRect(o.x-20*s,o.y-98*s,40*s,98*s);g.fillStyle='rgba(18,10,14,.7)';g.beginPath();g.ellipse(o.x,o.y-68*s,8*s,9*s,0,0,7);g.fill()}});
// hands: two grey hands push up out of the dirt, claw at the air and sink back (open graves, fresh dirt)
cmAddFx({id:'hands',n:'Hands from the ground',cat:'spooky',r:40,
 anim(o,t){const s=cl(+o.sc||1,.25,4);for(let i=0;i<2;i++){const ph=cmR(o,i,42),P=4.5+ph*3,u=(t+ph*9)%P,bx=o.x+(i?13:-11)*s,by=o.y+(i?4:0)*s;
  X.fillStyle='#2a1e14';X.beginPath();X.ellipse(bx,by,8*s,3*s,0,0,7);X.fill();const hh=u<1.1?u/1.1:u<3.1?1:u<3.9?1-(u-3.1)/.8:0;if(hh<=0)continue;
  const H=24*s*hh,lean=(i?.18:-.22)+Math.sin(t*2.3+i)*.08,tx=bx+Math.sin(lean)*H,ty=by-H*Math.cos(lean),fl=u>1.1&&u<3.1?(Math.sin(t*9+i*2)+1)/2:.3;
  X.strokeStyle='#16111c';X.lineCap='round';X.lineWidth=6*s;X.beginPath();X.moveTo(bx,by);X.lineTo(tx,ty);X.stroke();X.strokeStyle='#8aa07a';X.lineWidth=4*s;X.stroke();
  X.fillStyle='#16111c';X.beginPath();X.ellipse(tx,ty-2*s,5*s,4*s,0,0,7);X.fill();X.fillStyle='#8aa07a';X.beginPath();X.ellipse(tx,ty-2*s,4*s,3*s,0,0,7);X.fill();
  X.lineWidth=2*s;for(let f=0;f<4;f++){const a=-Math.PI/2+lean+(f-1.5)*.38,len=(5+f%2)*s,bend=fl*.9,x1=tx+Math.cos(a)*3*s,y1=ty-3*s+Math.sin(a)*3*s,x2=x1+Math.cos(a)*len,y2=y1+Math.sin(a)*len,x3=x2+Math.cos(a+bend*(f<2?-1:1))*3*s,y3=y2+Math.sin(a+bend*(f<2?-1:1))*3*s;
   X.strokeStyle='#16111c';X.lineWidth=3*s;X.beginPath();X.moveTo(x1,y1);X.lineTo(x2,y2);X.lineTo(x3,y3);X.stroke();X.strokeStyle='#9ab08a';X.lineWidth=1.5*s;X.stroke()}
  X.lineCap='butt';X.fillStyle='#4a3a28';for(let d=0;d<3;d++)X.fillRect(Math.round(bx-6*s+d*5*s),Math.round(by-1-((t*3+d+i)%1)*2*s),2,2)}},
 ed(g,o){const s=cl(+o.sc||1,.25,4);for(const dx of[-11,13]){g.fillStyle='#2a1e14';g.beginPath();g.ellipse(o.x+dx*s,o.y,8*s,3*s,0,0,7);g.fill();g.fillStyle='#8aa07a';g.fillRect(o.x+dx*s-2*s,o.y-20*s,4*s,20*s);g.fillRect(o.x+dx*s-4*s,o.y-26*s,8*s,7*s)}}});
// crows: a few crows pecking on the ground; a player coming within about 130 px sends them flapping off with a caw, and they come
// back a while after everyone has gone
const GYCN=5;
function gyCrow(x,y,s,fr,fl){X.fillStyle='#0c0a10';X.fillRect(Math.round(x-3*s*fl),Math.round(y-3*s),Math.round(6*s)||1,Math.round(3*s)||1);X.fillRect(Math.round(x+(fl>0?2:-4)*s),Math.round(y-5*s),Math.round(2*s)||1,Math.round(2*s)||1);X.fillStyle='#e8b02a';X.fillRect(Math.round(x+(fl>0?4:-5)*s),Math.round(y-4*s),1,1);
 if(fr>=0){X.fillStyle='#16141c';const up=fr<.5;X.fillRect(Math.round(x-5*s),Math.round(y-(up?7:2)*s),Math.round(4*s)||1,Math.round(3*s)||1);X.fillRect(Math.round(x+1*s),Math.round(y-(up?7:2)*s),Math.round(4*s)||1,Math.round(3*s)||1)}}
cmAddFx({id:'crows',n:'Crows (fly off when you come near)',cat:'life',r:220,
 anim(o,t){const S=gySt(o);if(S.m!='sit')return;const s=cl(+o.sc||1,.25,4),r=40*s;for(let i=0;i<GYCN;i++){const a=cmR(o,i,43)*6.283,d=(.3+.7*cmR(o,i,44))*r,x=o.x+Math.cos(a)*d,y=o.y+Math.sin(a)*d*.6,pk=Math.sin(t*(2+cmR(o,i,45)*2)+i*3)>.7?1:0,fl=Math.sin(t*.3+i*2)>0?1:-1;gyCrow(x,y+pk*s,s,-1,fl)}},
 top(o,t){const S=gySt(o),s=cl(+o.sc||1,.25,4),r=40*s,n=gyNear(o.x,o.y);
  if(S.m=='sit'&&n&&n.d<130*s){S.m='fly';S.t=t;S.ax=o.x-n.p.x;S.ay=o.y-n.p.y;const l=Math.hypot(S.ax,S.ay)||1;S.ax/=l;S.ay/=l;if(typeof sfx=='function')sfx('caw',o.x,o.y,.6,.6)}
  else if(S.m=='gone'&&t-S.t>9&&(!n||n.d>320*s)){S.m='sit'}
  if(S.m!='fly')return;const u=t-S.t;if(u>2.4){S.m='gone';S.t=t;return}
  X.globalAlpha=Math.max(0,1-u/2.4);for(let i=0;i<GYCN;i++){const a=cmR(o,i,43)*6.283,d=(.3+.7*cmR(o,i,44))*r,x0=o.x+Math.cos(a)*d,y0=o.y+Math.sin(a)*d*.6,sp=(110+cmR(o,i,46)*80)*s,sw=(cmR(o,i,47)-.5)*1.2,dx=S.ax*Math.cos(sw)-S.ay*Math.sin(sw),dy=S.ax*Math.sin(sw)+S.ay*Math.cos(sw);
   gyCrow(x0+dx*sp*u,y0+dy*sp*u*.6-u*u*28*s,s*1.2,(t*8+i*.37)%1,dx>=0?1:-1)}X.globalAlpha=1},
 ed(g,o){const s=cl(+o.sc||1,.25,4),r=40*s;g.fillStyle='#0c0a10';for(let i=0;i<GYCN;i++){const a=cmR(o,i,43)*6.283,d=(.3+.7*cmR(o,i,44))*r;g.fillRect(o.x+Math.cos(a)*d-3*s,o.y+Math.sin(a)*d*.6-3*s,6*s,3*s)}}});
// stained-glass window: coloured panes in lead lines; light passes through it like a window's
cmAddWall({id:'stainglass',n:'Stained-glass window',fl:0,lp:1,f(g,x,y,w,h){kwOut(g,x,y,w,h);const hz=kwH(w,h),L=hz?w:h,C=['#c0392b','#2e86c1','#f1c40f','#27ae60','#8e44ad'];for(let k=0;k<L-2;k+=6){g.fillStyle=C[Math.floor(k/6+x+y)%5];hz?g.fillRect(x+1+k,y+1,Math.min(5,w-2-k),Math.max(1,h-2)):g.fillRect(x+1,y+1+k,Math.max(1,w-2),Math.min(5,h-2-k))}}});
