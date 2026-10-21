//# bosses/penny-and-mayor.js — Penny and the Mayor
// ---------- Hometown bosses: Penny the cashier (15) and the Mayor (16) ----------
var GCI=[],GCC=[];
function grIn(q){const R=HS.ST;return!!R&&q.x>R[0]&&q.x<R[2]&&q.y>R[1]&&q.y<R[3]}
// --- Penny: sprints up and down the aisles, knocks stock off the shelves onto you indoors, sends carts at you in the lot ---
function svCash(z,Q,d,sg,aim,dt,can){const D=SVS[15],hurt_=z.hp<z.mh*.5;z.sk=(z.sk??3.2)-dt;
if(z.ds>0){z.ds-=dt;z.tr.push({x:z.x,y:z.y,l:.22});if(z.wallHit&&z.ds<.3)z.ds=0;if(z.cd<=0&&can())svFire(z,aim);return[z.da,440,0]}
const[a,m]=svKite(z,Q,d,sg,dt);
if(z.ab<=0&&d<650&&alive(Q)){z.ds=.42;z.da=sg&&d>280?aim+(Math.random()-.5)*.7:aim+(Math.random()<.5?1:-1)*(Math.PI/2)+(Math.random()-.5)*.6;z.ab=(hurt_?1.5:2.1)+Math.random()*1.2;sfx('swoosh',z.x,z.y,.7)}
if(z.sk<=0&&alive(Q)){if(grIn(Q))gcShelf(z,Q,hurt_);else gcCarts(z,Q,hurt_)}
if(z.cd<=0&&can())svFire(z,aim);return[a,D.sp*m,0]}
// shelves near you dump their stock in an arc onto where you're standing
function gcShelf(z,Q,hurt_){const S_=(HS.SHF||[]).map(s=>[s,Math.hypot(s[0]-Q.x,s[1]-Q.y)]).filter(s=>s[1]<420).sort((a,b)=>a[1]-b[1]).slice(0,7);if(!S_.length){z.sk=1;return}
const n=Math.min(S_.length,hurt_?5:4),vx=Q.vx||0,vy=Q.vy||0;for(let i=0;i<n;i++){const s=S_[Math.floor(Math.random()*S_.length)][0],r=i?40+Math.random()*60:0,b=Math.random()*6.283,T=.85+i*.08;
GCI.push({sx:s[0]+rnd(-40,40),sy:s[1],tx:cl(Q.x+vx*.4+Math.cos(b)*r,20,WW-20),ty:cl(Q.y+vy*.4+Math.sin(b)*r,20,WH-20),t:-i*.14,T,k:Math.floor(Math.random()*4),sp:rnd(-9,9)})}
const ai=1+Math.floor(Math.random()*4);z.sk=hurt_?3.4:4.6;sfx('swoosh',Q.x,Q.y,.6);FT.push({x:z.x,y:z.y-66,t:'CLEAN UP ON AISLE '+ai+'!',c:'#ffd84a',l:1.5})}
// shopping carts come screaming out of the corrals (and from Penny herself) straight at you
function gcCarts(z,Q,hurt_){const src=(HS.CRL||[]).map(c=>({x:c[0],y:c[1]-14})).filter(c=>{const e=Math.hypot(c.x-Q.x,c.y-Q.y);return e>140&&e<700});src.push({x:z.x,y:z.y});
const n=hurt_?4:3,vx=Q.vx||0,vy=Q.vy||0;for(let i=0;i<n;i++){const s=src[(i+Math.floor(Math.random()*src.length))%src.length],ox=rnd(-26,26),oy=rnd(-18,18),tx=Q.x+vx*.55+rnd(-40,40),ty=Q.y+vy*.55+rnd(-30,30),a=Math.atan2(ty-(s.y+oy),tx-(s.x+ox));
GCC.push({x:s.x+ox+Math.cos(a)*24,y:s.y+oy+Math.sin(a)*24,a,v:0,t:-.55-i*.22,l:3.2,st:0,g:.3})}z.sk=hurt_?2.9:3.9;sfx('dashwarn',z.x,z.y,.7);FT.push({x:z.x,y:z.y-66,t:'CARTS COMING THROUGH!',c:'#9af0ff',l:1.3})}
// --- the Mayor: phase 1 he watches from the roof of City Hall while a police cruiser hunts you; phase 2 he jumps down himself ---
function svMayor(z,Q,d,sg,aim,dt,can){const D=SVS[16],R=HS.CH;
if(z.ph==1){if(!z.rd)tkInit(z);const hurt_=z.hp<z.mh*.5;z.gs=(z.gs??1.6)-dt;z.mt=(z.mt??2)-dt;
tkDrive(z,dt,Q.x,Q.y,d>420?255:d<140?205:165);tkTouch(z);z.lt=(z.lt||0)+dt;z.ca=Math.atan2(Q.y-z.y,Q.x-z.x);
const see=los(z,Q)&&d<560&&alive(Q);if(z.pb>0){z.pt-=dt;if(z.pt<=0){z.pt=.13;z.pb--;svShot(z,z.ca+(Math.random()-.5)*.14,340,1.5);sfx('pistol',z.x,z.y,.55);z.mf=.08}}
else if(z.gs<=0&&see){z.pb=hurt_?4:3;z.pt=0;z.gs=hurt_?1.15:1.6;if(Math.random()<.3)FT.push({x:z.x,y:z.y-50,t:'PULL OVER!',c:'#9ab8ff',l:.9})}z.mf=Math.max(0,(z.mf||0)-dt);
// from the roof: shotgun blasts at anyone who wanders up to City Hall, and a lot of talking
if(R){const rd=Math.hypot(Q.x-R.x,Q.y-R.y);z.rf=(z.rf??2)-dt;if(z.rf<=0&&rd<360&&alive(Q)){z.rf=2.1;const a=Math.atan2(Q.y-(R.y-30),Q.x-R.x);for(let i=0;i<5;i++)ep.push({x:R.x+Math.cos(a)*14,y:R.y-30,vx:Math.cos(a+(i-2)*.18)*300,vy:Math.sin(a+(i-2)*.18)*300,l:.9,k:5,c:'#ffe27a'});sfx('shotgun',R.x,R.y,.6)}
if(z.mt<=0){z.mt=4+Math.random()*3;const L=['ORDER! ORDER!','THIS IS MY TOWN!','OFFICER, ARREST THEM!','I DID NOT GET RE-ELECTED FOR THIS!','VOTE FOR ME!'];FT.push({x:R.x,y:R.y-96,t:L[Math.floor(Math.random()*L.length)],c:'#ffcf40',l:1.8})}}
return null}
// phase 2: leaps (the first one is off the roof), shotgun up close
if(z.jp){const J=z.jp;J.t+=dt;const u=Math.min(1,J.t/J.T);z.x=J.sx+(J.dx-J.sx)*u;z.y=J.sy+(J.dy-J.sy)*u;z.alt=(J.h0||0)*(1-u)+J.h*Math.sin(Math.PI*u);z.mvg=1;z.fa=Math.atan2(J.dy-J.sy,J.dx-J.sx);
if(u>=1){z.jp=null;z.alt=0;slam(z.x,z.y,85,2);z.ab=4.6+Math.random()*2;z.cd=.7}return null}
const[a,m]=svKite(z,Q,d,sg,dt);
if(z.ab<=0&&alive(Q)&&d>140&&d<520){const p=svPt(Q.x,Q.y,0,40)||svPt(Q.x,Q.y,40,120);if(p){z.jp={sx:z.x,sy:z.y,dx:p.x,dy:p.y,t:0,T:.95,h:95};sfx('swoosh',z.x,z.y);FT.push({x:z.x,y:z.y-66,t:'THE MAYOR LEAPS!',c:'#ffcf40',l:1});return null}z.ab=1}
if(z.cd<=0&&can()){svFire(z,aim);if(z.hp<z.mh*.5)z.cd*=.75}return[a,D.sp*m,0]}
// the cruiser is wrecked: he jumps off the roof
function myOut(z){tkPark(z);SM.push({x:z.x,y:z.y-6});z.tk=0;z.hr=0;z.pb=0;const R=HS.CH;if(R){z.x=R.x;z.y=R.y}
const Q=rndAlive()||PL[0];let p=null;for(let k=0;k<40&&!p;k++){const c=svPt(R?R.x+rnd(-120,120):z.x,R?R.ry-150:z.y,0,90+k*8);if(c&&(!R||c.y<R.ry-90))p=c}if(!p)p=svPt(Q.x,Q.y,120,260)||{x:Q.x+150,y:Q.y};
z.jp={sx:z.x,sy:z.y,dx:p.x,dy:p.y,t:0,T:1.15,h:110,h0:70};z.alt=70;sfx('kong',z.x,z.y,.6);FT.push({x:z.x,y:z.y-110,t:'THE MAYOR JUMPS OFF CITY HALL!',c:'#ffcf40',l:2.2})}
// ----- per-tick: falling stock + rolling carts -----
function svTick5(dt){for(const b of GCI){b.t+=dt;if(b.t>=b.T&&!b.done){b.done=1;sfx('club',b.tx,b.ty,.5);for(let k=0;k<10;k++){const a=Math.random()*6.283,v=40+Math.random()*120;pt.push({x:b.tx,y:b.ty-4,vx:Math.cos(a)*v,vy:Math.sin(a)*v*.6,l:.45,c:['#c0392b','#2f7ad0','#ffd84a','#f4f4f0'][b.k]})}
for(const q of PL)if(alive(q)&&Math.hypot(q.x-b.tx,q.y-b.ty)<34)hitP(q,1,Math.atan2(q.y-b.ty,q.x-b.tx))}}GCI=GCI.filter(b=>!b.done);
for(const c of GCC){if(c.st){c.l-=dt;continue}c.t+=dt;if(c.t<0)continue;c.v=Math.min(420,c.v+900*dt);const nx=c.x+Math.cos(c.a)*c.v*dt,ny=c.y+Math.sin(c.a)*c.v*dt;c.l-=dt;
c.g-=dt;const blk=nx<10||ny<10||nx>WW-10||ny>WH-10||c.g<=0&&wlAt(nx,ny).some(w=>nx>w[0]-6&&nx<w[0]+w[2]+6&&ny>w[1]-4&&ny<w[1]+w[3]+4);if(blk||c.l<=0){c.st=1;c.l=2.5;sfx('club',c.x,c.y,.5);for(let k=0;k<8;k++){const a=Math.random()*6.283;pt.push({x:c.x,y:c.y-6,vx:Math.cos(a)*90,vy:Math.sin(a)*60,l:.35,c:'#c8ccd4'})}continue}
c.x=nx;c.y=ny;if(Math.random()<.4)pt.push({x:c.x-Math.cos(c.a)*12,y:c.y+4,vx:0,vy:0,l:.25,c:'rgba(200,200,200,.5)'});
for(const q of PL)if(alive(q)&&q.inv<=0&&Math.hypot(q.x-c.x,q.y-c.y)<24){hitP(q,1,c.a);q.x=cl(q.x+Math.cos(c.a)*30,10,WW-10);q.y=cl(q.y+Math.sin(c.a)*30,10,WH-10);push(q,9);sfx('club',q.x,q.y,.7);FT.push({x:q.x,y:q.y-40,t:'CLEAN UP!',c:'#9af0ff',l:.7});c.st=1;c.l=2;break}}
GCC=GCC.filter(c=>!c.st||c.l>0)}
// ----- drawing -----
function gcCart(x,y,a,tip,al){X.save();X.translate(x,y);if(al!=null)X.globalAlpha=al;X.fillStyle='rgba(0,0,0,.25)';X.beginPath();X.ellipse(2,6,14,5,0,0,7);X.fill();X.rotate(tip?a+.9:0);const fl=Math.cos(a)<0?-1:1;X.scale(tip?1:fl,1);
const R=(c,x0,y0,w,h)=>{X.fillStyle=c;X.fillRect(x0,y0,w,h)};R('#16111c',-14,-16,28,16);R('#9aa0aa',-13,-15,26,14);for(let k=-11;k<12;k+=4)R('#c8ccd4',k,-15,1,14);R('#c8ccd4',-13,-15,26,2);R('#c0392b',10,-19,5,4);R('#3a3d46',-12,0,24,2);R('#16111c',-11,2,4,4);R('#16111c',8,2,4,4);X.restore();X.globalAlpha=1}
function mpCar(g,x,y,a,L,W,t,on,wreck,mf){hwDraw(g,{k:'police',x,y,a,L,W,dmg:wreck?1:0});g.save();g.translate(x,y);g.rotate(a);const ph=Math.floor(t*8)%2;
g.fillStyle='#16111c';g.fillRect(-4,-W/2+5,10,W-10);g.fillStyle=wreck?'#5a2020':on?(ph?'#ff3a3a':'#5a1a1a'):'#8a2020';g.fillRect(-3,-W/2+6,8,(W-12)/2);g.fillStyle=wreck?'#20305a':on?(ph?'#2a4aa0':'#3a8aff'):'#20408a';g.fillRect(-3,0,8,(W-12)/2);
if(on){g.globalAlpha=.25;g.fillStyle=ph?'#ff3a3a':'#3a8aff';g.beginPath();g.arc(0,0,W*.9,0,7);g.fill();g.globalAlpha=1}
g.fillStyle='#f4f4f0';g.font='bold 9px Arial, Helvetica, sans-serif';g.textAlign='center';g.textBaseline='middle';g.fillText('POLICE',-L*.22,0);g.textAlign='left';g.textBaseline='alphabetic';g.restore()}
function mpDraw(z){const t=performance.now()/1000;mpCar(X,z.x,z.y,z.hd,z.L,z.W,t,1,0);
const c=Math.cos(z.hd),s=Math.sin(z.hd),dx=z.x+c*(z.L/2-34),dy=z.y+s*(z.L/2-34);X.fillStyle='#16111c';X.beginPath();X.arc(dx-s*7,dy+c*7,5,0,7);X.fill();X.fillStyle='#5a7a4a';X.beginPath();X.arc(dx-s*7,dy+c*7,4,0,7);X.fill();X.fillStyle='#1c2a50';X.fillRect(dx-s*7-4,dy+c*7-6,8,3);
// zombie officer leaning out the window with a pistol
const ox=z.x+c*(z.L/2-40)+s*(z.W/2+2),oy=z.y+s*(z.L/2-40)-c*(z.W/2+2),a=z.ca??z.hd;X.strokeStyle='#5a7a4a';X.lineWidth=4;X.beginPath();X.moveTo(ox,oy);X.lineTo(ox+Math.cos(a)*14,oy+Math.sin(a)*14);X.stroke();X.fillStyle='#2a2c32';X.fillRect(ox+Math.cos(a)*14-3,oy+Math.sin(a)*14-3,6,6);
if(z.mf>0){X.fillStyle='#ffe27a';X.beginPath();X.arc(ox+Math.cos(a)*22,oy+Math.sin(a)*22,6,0,7);X.fill()}}
function svExtra5(){const t=performance.now()/1000;
for(const b of GCI){if(b.t<0)continue;const u=Math.min(1,b.t/b.T),pu=.5+.5*Math.sin(t*16);X.globalAlpha=.16+.12*pu;X.fillStyle='#ffcf40';X.beginPath();X.arc(b.tx,b.ty,34,0,7);X.fill();X.globalAlpha=.85;X.strokeStyle='#ffd84a';X.lineWidth=2;X.beginPath();X.arc(b.tx,b.ty,34*(1-u*.6),0,7);X.stroke();X.globalAlpha=1;
const gx=b.sx+(b.tx-b.sx)*u,gy=b.sy+(b.ty-b.sy)*u,by=gy-Math.sin(Math.PI*u)*90-(1-u)*30;X.fillStyle='rgba(0,0,0,.2)';X.beginPath();X.ellipse(gx,gy+4,8,3,0,0,7);X.fill();X.save();X.translate(gx,by);X.rotate(b.t*b.sp);
const C=[['#c0392b','#f4f4f0'],['#2f7ad0','#ffd84a'],['#e07a1a','#f4f0e0'],['#3f9a4a','#f4f4f0']][b.k];X.fillStyle='#16111c';if(b.k%2){X.fillRect(-8,-6,16,12);X.fillStyle=C[0];X.fillRect(-7,-5,14,10);X.fillStyle=C[1];X.fillRect(-4,-2,8,3)}else{X.fillRect(-5,-7,10,14);X.fillStyle=C[0];X.fillRect(-4,-6,8,12);X.fillStyle=C[1];X.fillRect(-4,-2,8,3)}X.restore()}
for(const c of GCC){if(c.t<0&&!c.st){const s=1+Math.sin(t*40)*1.5;X.globalAlpha=.35+.25*Math.sin(t*20);X.strokeStyle='#9af0ff';X.lineWidth=3;X.setLineDash([9,7]);X.beginPath();X.moveTo(c.x,c.y);X.lineTo(c.x+Math.cos(c.a)*360,c.y+Math.sin(c.a)*360);X.stroke();X.setLineDash([]);X.globalAlpha=1;gcCart(c.x+s,c.y,c.a,0);continue}
gcCart(c.x,c.y,c.a,c.st,c.st?Math.min(1,c.l):null)}
// the Mayor up on the roof of City Hall during the chase
for(const z of zs){if(z.ci!=16||z.hp<=0||z.ph!=1||!HS.CH)continue;const R=HS.CH,Q=PL.find(alive)||P,aim=Math.atan2(Q.y-(R.y-30),Q.x-R.x),fl=Math.cos(aim)<0?-1:1;X.fillStyle='rgba(0,0,0,.3)';X.beginPath();X.ellipse(R.x,R.y-2,15,5,0,0,7);X.fill();svBody(16,R.x,R.y,fl,0,SVK,aim);
X.fillStyle='#16111c';X.fillRect(R.x-fl*14-4,R.y-74,8,8);X.fillStyle='#c8ccd4';X.fillRect(R.x-fl*14-3,R.y-73,6,6)}}

function MXH(p){return((CH[(p&&p.ci)||0]||CH[0]).hp)+8}
