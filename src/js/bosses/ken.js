//# bosses/ken.js — Ken the welder, the Black Iron Foundry's survivor boss: his MIG gun's lightning and the black marks it leaves
// ---------- Ken (17): brown welding coat, jeans, red welding helmet; his MIG welding gun shoots lightning ----------
// A bolt flies out of the torch and stays joined to it until it hits something (a player, a wall, or the end of its reach,
// half as far as a survivor boss's shotgun blast), so it looks like one long crackling bolt; where it hits it leaves a black
// burn mark on the ground. From half health he is overcharged and fires three bolts at once.
// The bolts are survivor-boss bullets (ep, k:5, lb:1): update() moves them and stops them at walls. The whole bolt is
// dangerous, not just its head: anyone it crosses anywhere between the torch and the head is hit (knOn), and the bolt ends there.
// SVS[17]: br = reach of a bolt (px), bv = bolt speed (px/s), cd = seconds between zaps, c3 = how much longer that gap is once
// overcharged, ch = seconds the torch crackles before each zap (the warning). All of them are in the GAME BALANCE menu.
var KSC=[],KFL=[];
function knClear(){KSC=[];KFL=[]}
// where the welding wire sticks out of the torch (the gun picture is PS[17].mig; the wire is 57,3 px from the shoulder)
function knTip(z,a){const s=SVK/1.6,fl=Math.cos(z.fa)<0?-1:1,L=57*s,q=3*s,hy=z.y-10.2*s;return{x:z.x+Math.cos(a)*L-fl*q*Math.sin(a),y:hy+Math.sin(a)*L+fl*q*Math.cos(a)}}
function svKen(z,Q,d,sg,aim,dt,can){const D=SVS[17],R=D.br||238;z.mf=Math.max(0,(z.mf||0)-dt);
// half health: overcharged, three bolts at a time from now on
if(!z.oc&&z.hp<=z.mh*.5){z.oc=1;z.bn=CH[17].n.toUpperCase()+' · OVERCHARGED';z.kc=0;z.cd=Math.min(z.cd,.9);z.iv=Math.max(z.iv||0,.5);shk=Math.max(shk,.3);sfx('kover',z.x,z.y);
 FT.push({x:z.x,y:z.y-70,t:'KEN CRANKS UP THE AMPS!',c:'#b8c4ff',l:2.2});for(let i=0;i<26;i++){const b=Math.random()*6.283,v=60+Math.random()*200;pt.push({x:z.x,y:z.y-20,vx:Math.cos(b)*v,vy:Math.sin(b)*v,l:.45,c:i%3?'#c8d0ff':'#ffffff'})}}
const[a,m]=svKite(z,Q,d,sg,dt);
// the torch crackles for a moment (he slows down), then the bolt goes
if(z.kc>0){z.kc-=dt;if(z.kc<=0)knFire(z,aim);return[a,D.sp*m*.4,0]}
if(z.cd<=0&&sg&&alive(Q)&&d<R+20){z.kc=D.ch||.32;sfx('kcharge',z.x,z.y,.7)}
return[a,D.sp*m,0]}
function knFire(z,a){const D=SVS[17],R=D.br||238,v=D.bv||520,n=z.oc?3:1,tp=knTip(z,z.fa);
for(let i=0;i<n;i++){const b=a+(i-(n-1)/2)*.3+(Math.random()-.5)*.05;ep.push({x:z.x+Math.cos(b)*16,y:z.y-8.6+Math.sin(b)*16,vx:Math.cos(b)*v,vy:Math.sin(b)*v,l:R/v,k:5,c:'#c8d0ff',lb:1,o:z,sx:tp.x,sy:tp.y})}
z.cd=(D.cd||1.3)*(z.oc?(D.c3||1.15):1);z.mf=.12;sfx('kzap',z.x,z.y,.85);shk=Math.max(shk,.08)}
// a bolt is spent (update() calls this): a flash, sparks and a black mark on the ground under where it hit
function knInW(x,y){return wlAt(x,y).some(w=>w[4]!=2&&x>w[0]&&x<w[0]+w[2]&&y>w[1]&&y<w[1]+w[3])}
function knHit(p){const v=Math.hypot(p.vx,p.vy)||1,ux=p.vx/v,uy=p.vy/v;let x=p.x,y=p.y,mx,my;
const q=p.hq&&alive(p.hq)?p.hq:PL.find(o=>alive(o)&&Math.hypot(o.x-p.x,o.y-p.y)<14);
if(q){mx=q.x;my=q.y+14;FT.push({x:q.x,y:q.y-40,t:'ZAP!',c:'#c8d0ff',l:.7})}
else{for(let k=0;k<8&&knInW(x,y);k++){x-=ux*3;y-=uy*3}mx=x;my=y+10;for(let k=0;k<12&&knInW(mx,my);k++){mx-=ux*3;my-=uy*3}}
knMark(mx,my);KFL.push({x,y,l:.18,m:.18});sfx('khit',x,y,.6,.04);
for(let i=0;i<10;i++){const b=Math.random()*6.283,s=50+Math.random()*150;pt.push({x,y,vx:Math.cos(b)*s,vy:Math.sin(b)*s-20,l:.3,c:i%3?'#c8d0ff':i%2?'#ffffff':'#ffd84a'})}}
// the burn mark: a charred spot with branching lines burnt into the ground around it (worked out once, drawn every frame)
function knMark(x,y){const B=[],r=Math.random;const n=5+(r()*3|0);for(let i=0;i<n;i++){let a=i/n*6.283+r()*.8,px=0,py=0;const L=3+(r()*3|0);
 for(let k=0;k<L;k++){a+=(r()-.5)*1.1;const sl=4+r()*5,nx=px+Math.cos(a)*sl,ny=py+Math.sin(a)*sl*.55;B.push(px,py,nx,ny);if(r()<.35){const b=a+(r()<.5?-1:1)*(.6+r()*.5),s2=3+r()*4;B.push(nx,ny,nx+Math.cos(b)*s2,ny+Math.sin(b)*s2*.55)}px=nx;py=ny}}
KSC.push({x,y,l:14,m:14,B,r:6+r()*3});if(KSC.length>(LMX?16:40))KSC.shift()}
// on dark maps (the foundry is at night) the bolts, the torch as it charges and each hit light up (called from cmLight)
function knLights(S){for(const e of ep)if(e.lb){S.push({x:e.x,y:e.y,r:70,c:'#9fb0ff',i:1});if(e.sx!=null)S.push({x:(e.x+e.sx)/2,y:(e.y+e.sy)/2,r:60,c:'#8a9aff',i:1})}
 for(const z of zs)if(z.ci==17&&z.hp>0&&(z.kc>0||z.mf>0)){const T=knTip(z,z.fa);S.push({x:T.x,y:T.y,r:z.mf>0?90:50,c:'#c8d0ff',i:1})}
 for(const f of KFL)S.push({x:f.x,y:f.y,r:20+80*f.l/f.m,c:'#c8d0ff',i:1})}
// is player q anywhere on the bolt, from the torch tip to the head? Tested against q's body (KNB: half-width, top and
// bottom from q.x,q.y, as the survivor sprite is drawn); where it crosses, the head moves there, so the bolt ends at q
const KNB={w:10,t:-22,b:16};
function knOn(p,q){const ax=p.sx!=null?p.sx:p.x,ay=p.sy!=null?p.sy:p.y,dx=p.x-ax,dy=p.y-ay,L=Math.hypot(dx,dy),n=Math.max(1,Math.ceil(L/3));
for(let i=0;i<=n;i++){const x=ax+dx*i/n,y=ay+dy*i/n;if(Math.abs(x-q.x)<KNB.w&&y-q.y>KNB.t&&y-q.y<KNB.b){p.x=x;p.y=y;p.hq=q;return true}}return false}
function svTick6(dt){for(const e of ep)if(e.lb&&e.o&&e.o.hp>0&&zs.includes(e.o)){const T=knTip(e.o,e.o.fa);e.sx=T.x;e.sy=T.y}
for(const s of KSC)s.l-=dt;if(KSC.length)KSC=KSC.filter(s=>s.l>0);for(const f of KFL)f.l-=dt;if(KFL.length)KFL=KFL.filter(f=>f.l>0)}
// ----- drawing -----
// burn marks, under everything that walks
function knDrawS(){if(!KSC.length)return;X.lineCap='round';for(const s of KSC){const a=Math.min(1,s.l/3),hot=Math.max(0,1-(s.m-s.l)/.8);
 X.fillStyle='#0c0a0a';X.globalAlpha=.3*a;X.beginPath();X.ellipse(s.x,s.y,s.r*1.8,s.r,0,0,7);X.fill();X.globalAlpha=.75*a;X.beginPath();X.ellipse(s.x,s.y,s.r,s.r*.55,0,0,7);X.fill();
 X.strokeStyle='#100c0a';X.lineWidth=1.6;X.globalAlpha=.8*a;X.beginPath();const B=s.B;for(let i=0;i<B.length;i+=4){X.moveTo(s.x+B[i],s.y+B[i+1]);X.lineTo(s.x+B[i+2],s.y+B[i+3])}X.stroke();
 if(hot>0){X.globalAlpha=hot*.8;X.fillStyle='#ff9a3a';X.beginPath();X.ellipse(s.x,s.y,s.r*.6,s.r*.33,0,0,7);X.fill();X.globalAlpha=hot;X.fillStyle='#ffe0a0';X.fillRect(s.x-1,s.y-1,2,2)}}
X.globalAlpha=1;X.lineCap='butt'}
// a little crackle of electricity at a point
function knArc(x,y,r){for(let i=0;i<2;i++){const a=Math.random()*6.283,q=r*(.5+Math.random()*.7);X.globalAlpha=.8;drStroke(drBolt({x,y},{x:x+Math.cos(a)*q,y:y+Math.sin(a)*q},4),i?'#ffffff':'#b8c4ff',1.3)}X.globalAlpha=1}
// a bolt: from the torch (wherever Ken is pointing it now) to its head
function knBolt(p){const z=p.o,on=!!z&&z.hp>0&&zs.includes(z);if(on){const q=knTip(z,z.fa);p.sx=q.x;p.sy=q.y}
const s={x:p.sx,y:p.sy};X.lineCap='round';X.lineJoin='round';
// the head starts inside the gun: until it is past the torch only the torch crackles
if(on&&Math.hypot(p.x-z.x,p.y-z.y+8.6)<Math.hypot(s.x-z.x,s.y-z.y+8.6)){knArc(s.x,s.y,10)}
else{const L=drBolt(s,{x:p.x,y:p.y},14);X.globalAlpha=.28;drStroke(L,'#5a4aff',9);X.globalAlpha=.9;drStroke(L,'#9fb0ff',3.5);X.globalAlpha=1;drStroke(L,'#ffffff',1.4);
 if(Math.random()<.7){const m=L[1+(Math.random()*(L.length-2)|0)],a=Math.random()*6.283,r=8+Math.random()*14;X.globalAlpha=.75;drStroke(drBolt({x:m[0],y:m[1]},{x:m[0]+Math.cos(a)*r,y:m[1]+Math.sin(a)*r},6),'#c8d0ff',1.4)}
 X.globalAlpha=.45;X.fillStyle='#8a9aff';X.beginPath();X.arc(p.x,p.y,7,0,7);X.fill();X.globalAlpha=1;X.fillStyle='#ffffff';X.beginPath();X.arc(p.x,p.y,2.5,0,7);X.fill()}
X.lineCap='butt';X.lineJoin='miter';X.globalAlpha=1}
// on Ken himself: the torch charging, the flash of a zap, the crackle round him once he is overcharged
function knFx(z,t){const T=knTip(z,z.fa);X.lineCap='round';X.lineJoin='round';
if(z.kc>0){const u=1-z.kc/(SVS[17].ch||.32);X.globalAlpha=.25+.35*u;X.fillStyle='#8a9aff';X.beginPath();X.arc(T.x,T.y,5+9*u,0,7);X.fill();X.globalAlpha=1;X.fillStyle='#ffffff';X.beginPath();X.arc(T.x,T.y,1.5+2*u,0,7);X.fill();knArc(T.x,T.y,8+10*u)}
if(z.mf>0){X.globalAlpha=Math.min(1,z.mf/.12)*.7;X.fillStyle='#dfe4ff';X.beginPath();X.arc(T.x,T.y,12,0,7);X.fill();X.globalAlpha=1}
if(z.oc&&Math.random()<.45){const h=64*SVK/1.6,fy=z.y+h*.45,x0=z.x+(Math.random()-.5)*26,y0=fy-Math.random()*h*.85,a=Math.random()*6.283;X.globalAlpha=.85;drStroke(drBolt({x:x0,y:y0},{x:x0+Math.cos(a)*12,y:y0+Math.sin(a)*12},5),Math.random()<.5?'#ffffff':'#9fb0ff',1.3)}
X.globalAlpha=1;X.lineCap='butt';X.lineJoin='miter'}
// impact flashes, over everything
function svExtra6(){for(const f of KFL){const u=f.l/f.m;X.globalAlpha=.6*u;X.fillStyle='#c8d0ff';X.beginPath();X.arc(f.x,f.y,6+14*(1-u),0,7);X.fill();X.globalAlpha=u;X.fillStyle='#ffffff';X.beginPath();X.arc(f.x,f.y,3,0,7);X.fill()}X.globalAlpha=1}
// ---------- sounds ----------
Object.assign(SF,{
// the torch charging: a rising electric whine with crackles
kcharge:(t,d)=>{osc('sawtooth',160,620,t,.34,.07,d,.02);osc('square',90,140,t,.34,.04,d,.02);for(let i=0;i<5;i++)noise(t+i*.06+Math.random()*.02,.03,.08+i*.03,d,'highpass',3000+Math.random()*2500);return .36},
// the zap: a hard crack, crackling arcs and the welder's buzz
kzap:(t,d)=>{noise(t,.06,.75,d,'highpass',2400);for(let i=0;i<7;i++)noise(t+.02+i*.045,.04,.32-.035*i,d,'bandpass',1500+Math.random()*3000,0,2);osc('sawtooth',118,96,t,.42,.16,d,.004);osc('square',1500,240,t,.14,.06,d);osc('sine',70,34,t,.3,.35,d);return .45},
// a bolt hits: a snap and a sizzle
khit:(t,d)=>{noise(t,.04,.5,d,'highpass',3200);noise(t+.02,.22,.2,d,'bandpass',900,2600,1.2,.01);osc('sine',140,50,t,.12,.25,d);return .25},
// overcharged: the hum climbs and the arcs spit
kover:(t,d)=>{osc('sawtooth',80,320,t,.7,.12,d,.05);osc('square',120,480,t,.7,.05,d,.05);for(let i=0;i<10;i++)noise(t+i*.07,.04,.15+Math.random()*.15,d,'highpass',2600+Math.random()*3000);osc('sine',55,110,t,.8,.4,d,.05);return .9},
// playable Ken: a little spark on top of each shotgun blast
kspark:(t,d)=>{for(let i=0;i<3;i++)noise(t+i*.03,.025,.12,d,'highpass',3500+Math.random()*2500);osc('sawtooth',240,120,t,.12,.04,d);return .14}});
