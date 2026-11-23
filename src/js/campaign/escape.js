//# campaign/escape.js — The roof escape: Zombville General's ending (after the wave-20 boss, ride the elevator to the roof, run for the military helicopter)
// ---------- the roof escape (Zombville General, map 18) ----------
// Campaign only (wave-20 bosses only come in the campaign). When the boss gives up, the escape elevator (an 'elev' area marked
// 'esc') opens and the players head for it; once everyone still standing is in the car, the camera closes in on it with the rest
// blacked out (as in the tutorial), the doors shut and it rides up. The roof (BIMX: a map file of its own) is built in place of the
// hospital, the doors open and the camera pulls back: the military helicopter waits on the pad, a door gunner covering it, while
// zombies climb over the parapet. Once everyone still standing has been in the doorway together for a moment (nobody down), it
// lifts off and the map is won. Split screen keeps its views: no close-up, the blackout still closes in round the car.
// Losing a life on the way restarts the escape where it is (at the elevator, or on the roof), never the boss.
var ESC=null;
function escOK(){return GMD=='c'&&!cmIs(mapId)&&typeof BIMX!='undefined'&&!!BIMX[mapId]&&!TUT}
const escElevIn=d=>(d.areas||[]).find(a=>a.a=='elev'&&po(a,'st','shut')=='esc')||null;
// take the escape car's doors and inside out of the walls (they block while it's shut)
function escUnbar(a){for(let i=WL.length-1;i>=0;i--){const w=WL[i];if(w[5]=='elev'&&w[0]>=a.x-1&&w[1]>=a.y-1&&w[0]+w[2]<=a.x+a.w+1&&w[1]+w[3]<=a.y+a.h+1)WL.splice(i,1)}}
function escInCar(p){const r=elG(ESC.el).inr;return p.x>r[0]-2&&p.x<r[0]+r[2]+2&&p.y>r[1]-2&&p.y<r[1]+r[3]+8}
// the kit's elevator asks these how far open the escape car's doors are, what its floor display says, whether its call button is lit
function escElevK(o){return ESC&&ESC.el===o?ESC.k:null}
function escElevFloor(o){return ESC&&ESC.el===o&&ESC.fl!=null?ESC.fl:null}
function escElevCall(o){return!ESC||ESC.el!==o?false:ESC.ph=='go'?(performance.now()/300)%1<.6:false}
const escEase=u=>{u=cl(u,0,1);return u*u*(3-2*u)};
// ----- start: the boss has given up -----
function escStart(){let d=null;try{d=bimDoc(mapId)}catch(e){}const el=d&&escElevIn(d);if(!el){campWin();return}
 // the kit's elevator draws from the area it was built from: find that one (same box)
 const it=HS.CX&&HS.CX.A.find(q=>q.o&&q.o.a=='elev'&&q.o.x==el.x&&q.o.y==el.y);ESC={ph:'go',t:0,el:it?it.o:el,k:0,fl:null,z:1,dk:0,fb:0,fz:0,cam:null,sp:2.5,rf:0,h:null,tr:[],gt:0,bt:0,ci:KN?KN.ci:null};for(const p of PL)if(p.dn){p.dn=0;p.rv=0;p.hp=Math.max(1,Math.ceil(p.mx*.34));p.inv=2}
 escUnbar(ESC.el);toSp=0;bossQ=-1;sfx('ding');sfx('edoor');music('boss')}
const escCarC=()=>{const r=elG(ESC.el).inr;return{x:r[0]+r[2]/2,y:r[1]+r[3]/2}};
function escZin(){const r=elG(ESC.el).inr;return cl(Math.min(W/(r[2]+300),(H-(H<520?80:180))/(r[3]+240)),1,2.6)}
// ----- every frame while it runs (update.js calls this in place of the wave timer) -----
function escUpd(dt){const E=ESC;E.t+=dt;toSp=0;bossQ=-1;const S_=PL.filter(alive),c=escCarC();
 if(E.ph=='go'){E.k=Math.min(1,E.k+dt/1.1);E.sp-=dt;if(E.sp<=0){E.sp=2.4+Math.random();escTrickle()}
  if(S_.length&&S_.every(escInCar)){E.ph='in';E.t=0;E.fz=1;E.c0={x:P.x,y:P.y};sfx('click')}return}
 if(E.ph=='in'){const u=escEase(E.t/1.3);E.z=MPn?1:1+(escZin()-1)*u;E.dk=u;E.cam={x:E.c0.x+(c.x-E.c0.x)*u,y:E.c0.y+(c.y-E.c0.y)*u};if(E.t>.5&&!E.dc){E.dc=1;sfx('edoor');for(const z of zs)if(escInCar(z)&&!ZT[z.t].sv)z.hp=0}E.k=E.t<.5?1:Math.max(0,1-(E.t-.5)/.7);escHold(c);
  if(E.t>=1.5){E.ph='ride';E.t=0;E.fl='1';E.k=0}return}
 if(E.ph=='ride'){const F=['1','2','3','4','5','6','R'],i=Math.min(F.length-1,Math.floor(E.t/.38));if(F[i]!==E.fl){E.fl=F[i];if(i==F.length-1)sfx('ding');else sfx('click',null,null,.6)}shk=Math.max(shk,.04);escHold(c);
  if(E.t>2.6)E.fb=Math.min(1,(E.t-2.6)/.35);if(E.t>=3.05){escRoof();E.ph='arrive';E.t=0}return}
 if(E.ph=='arrive'){const c2=escCarC();E.cam=c2;E.fb=Math.max(0,1-E.t/.5);if(E.t>.35&&!E.dc2){E.dc2=1;sfx('ding')}if(E.t>.6&&!E.do2){E.do2=1;sfx('edoor')}E.k=E.t<.6?0:Math.min(1,(E.t-.6)/.7);escHold(c2);if(E.t>=1.4){E.ph='out';E.t=0}return}
 if(E.ph=='out'){const u=escEase(E.t/1.6),c2=escCarC(),Z=MPn?1:escZin();E.z=Z+(1-Z)*u;E.dk=1-u;E.cam={x:c2.x+(P.x-c2.x)*u,y:c2.y+(P.y-c2.y)*u};E.k=1;
  if(E.t>.4&&E.fz){E.fz=0}if(E.t>=1.7){E.ph='run';E.t=0;E.z=1;E.dk=0;E.cam=null;E.q=9;E.sp=.6;sfx('wave')}escHeli(dt);return}
 if(E.ph=='run'){escHeli(dt);E.gr=Math.max(0,(E.gr||0)-dt);E.sp-=dt;if(E.sp<=0&&!(E.gr>0)){const n=zs.filter(z=>z.hp>0).length;
   // a rush of them over the edges at first (E.q), then a steady stream that thickens
   if(E.q>0){E.q--;E.sp=.17}else E.sp=Math.max(.4,1-E.t*.02);if(n<46)for(let k=0;k<(E.q>0||E.t<6?1:2);k++)escClimb()}
  const inz=S_.filter(escAtDoor),dn=PL.some(p=>p.dn&&!p.dead);E.bt=S_.length&&inz.length==S_.length&&!dn?E.bt+dt:0;for(const p of inz)if(!p.dz){p.dz=1;FT.push({x:p.x,y:p.y-40,t:MPn&&S_.length>1?'IN THE DOOR':'GO GO GO!',c:'#9be860',l:1})}for(const p of PL)if(!inz.includes(p))p.dz=0;
  if(E.bt>=.5){E.ph='lift';E.t=0;for(const p of PL)if(!p.dead){p.ab=1;p.inv=1e9;p.dn=0}sfx('power');FT.push({x:E.h.x,y:E.h.y-140,t:'EVERYONE\'S IN!',c:'#9be860',l:2.5});escHeliFree()}return}
 if(E.ph=='lift'){escHeli(dt);const h=E.h;h.alt=Math.min(1,E.t/2.2);if(E.t>2.2){const u=E.t-2.2;h.v=Math.min(520,(h.v||0)+260*dt);h.x+=Math.cos(-.9)*h.v*dt;h.y+=Math.sin(-.9)*h.v*dt;h.a+=(-.9-h.a)*Math.min(1,dt*1.2)}
  PL.forEach((p,i)=>{if(p.dead)return;const s=escSeat(i);p.x=s.x;p.y=s.y});E.cam={x:h.x,y:h.y};if(E.t>=5.2&&!E.won){E.won=1;escWin()}}}
// players stay in the car while it rides (spread out a little)
function escHold(c){PL.forEach((p,i)=>{if(p.dead)return;const tx=c.x+[-14,14,-14,14][i%4],ty=c.y+[-10,-10,12,12][i%4];p.x+=(tx-p.x)*.2;p.y+=(ty-p.y)*.2})}
// a few zombies keep coming while the players make for the elevator
function escTrickle(){const n=zs.filter(z=>z.hp>0).length;if(n>16||!HS.sp||!HS.sp.length)return;const p=HS.sp[Math.floor(Math.random()*HS.sp.length)];let t=null;try{t=zPick()}catch(e){}const z=mk(t!=null&&ZT[t]&&!ZT[t].boss&&!ZT[t].sv?t:0,p[0],p[1]);zs.push(z)}
// ----- the roof -----
function escRoof(){const d=bimDocX(mapId),kn=KN;bgFree();WW=1800;WH=1800;WL=[];TR=[];SM=[];sk=[];NOGO=[];CMOB=null;vRec.on=1;vRec.L=[];vRec.busy=0;vehWrap();try{cmBuild(d)}finally{vRec.on=0}HS.VH=vRec.L;mkSurf();bgLow();BN=[];BNMC=null;zsReset();
 zs=[];nq=[];ep=[];bs=[];pd=[];fr=[];rg=[];pt=[];KN=null;RKS=[];GHH=[];GRN=[];ICB=[];GCI=[];GCC=[];FT=[];ESC.rf=1;
 const el=escElevIn(d),it=HS.CX&&HS.CX.A.find(q=>q.o&&q.o.a=='elev'&&q.o.x==el.x&&q.o.y==el.y);ESC.el=it?it.o:el;escUnbar(ESC.el);ESC.k=0;ESC.fl='R';
 const c=escCarC();PL.forEach((p,i)=>{if(p.dead)return;p.x=c.x+[-14,14,-14,14][i%4];p.y=c.y+[-10,-10,12,12][i%4];p.eat=null;p.fd=null});P=PL[0];
 // the helicopter on the pad, nose north, its door on the west side; its body is solid
 const pad=(d.areas||[]).find(a=>a.a=='hpad');const hx=pad?pad.x+pad.w/2:WW*.65,hy=pad?pad.y+pad.h/2:WH/2;ESC.h={x:hx,y:hy,a:-Math.PI/2,alt:0,rot:0,v:0};escHeliBar();
 ESC.par=d.walls.filter(w=>w.s=='parapet');ESC.sp=2;ESC.gr=0;HS.px=c.x+80;HS.py=c.y}
// the helicopter's body as walls (local: nose +x; turned by its heading)
function escHeliBoxes(){const h=ESC.h,B=[[-80,-34,205,68],[-205,-10,125,20]],ca=Math.cos(h.a),sa=Math.sin(h.a),out=[];for(const[x,y,w,l]of B){const P_=[[x,y],[x+w,y],[x,y+l],[x+w,y+l]].map(([u,v])=>[h.x+u*ca-v*sa,h.y+u*sa+v*ca]),xs=P_.map(q=>q[0]),ys=P_.map(q=>q[1]),x0=Math.min(...xs),y0=Math.min(...ys);out.push([x0,y0,Math.max(...xs)-x0,Math.max(...ys)-y0,0,'heli'])}return out}
function escHeliBar(){ESC.hb=escHeliBoxes();WL.push(...ESC.hb)}
function escHeliFree(){if(!ESC.hb)return;for(const b of ESC.hb){const i=WL.indexOf(b);if(i>=0)WL.splice(i,1)}ESC.hb=null}
// in the doorway: the zone off the helicopter's port side (local -y)
function escLoc(x,y){const h=ESC.h,dx=x-h.x,dy=y-h.y,ca=Math.cos(h.a),sa=Math.sin(h.a);return[dx*ca+dy*sa,-dx*sa+dy*ca]}
function escAtDoor(p){if(!ESC||!ESC.h)return false;const[u,v]=escLoc(p.x,p.y);return u>-52&&u<52&&v>-104&&v<-26}
function escSeat(i){const h=ESC.h,u=-24+(i%4)*16,v=-22,ca=Math.cos(h.a),sa=Math.sin(h.a);return{x:h.x+u*ca-v*sa,y:h.y+u*sa+v*ca-h.alt*40}}
// the rotor turns, the door gunner fires at the zombies nearest the helicopter (and the players)
function escHeli(dt){const E=ESC,h=E.h;if(!h)return;h.rot+=dt*(E.ph=='lift'?26:19);E.rs=(E.rs||0)-dt;if(E.rs<=0){E.rs=E.ph=='lift'?.075:.09;sfx('rotor',h.x,h.y,E.ph=='lift'?1:.7)}
 for(const r of E.tr)r.l-=dt;E.tr=E.tr.filter(r=>r.l>0);E.gt-=dt;if(E.gt>0)return;
 const g=escSeat(3),A=PL.filter(alive);let best=null,bd=1e9;for(const z of zs){if(z.hp<=0||z.ri>0||ZT[z.t].sv)continue;const d=Math.hypot(z.x-g.x,z.y-g.y);if(d>1150)continue;const dp=A.length?Math.min(...A.map(p=>Math.hypot(p.x-z.x,p.y-z.y))):1e9,s=d*.6+dp*.4;if(s<bd){bd=s;best=z}}
 if(!best){E.gt=.15;return}E.gt=.1;const a=Math.atan2(best.y-g.y,best.x-g.x),sp=(Math.random()-.5)*.08;E.tr.push({x0:g.x,y0:g.y,x1:best.x+Math.cos(a+sp)*8,y1:best.y-12+Math.sin(a+sp)*8,l:.07});E.fa=a;E.ff=.05;
 const kg=KG;KG=-1;hurt(best,(ZT[best.t].boss?4:2.6)*(1+wave*.03),Math.cos(a)*40,Math.sin(a)*40);KG=kg;sfx('minigun',g.x,g.y,.35,.05)}
// a zombie climbs over the parapet: a spot along the parapet (most of them where the players can see), not too near anyone or the
// helicopter; it lands just inside. z.clb: the parapet spot (px,py: its middle line), the way in (nx,ny), half its thickness (ht)
function escClimb(){const E=ESC;if(!E.par||!E.par.length)return 0;const A=PL.filter(p=>!p.dead),L=E.par.map(w=>Math.max(w.w,w.h)),T_=L.reduce((a,b)=>a+b,0);let fb=null;
 for(let n=0;n<16;n++){let r=Math.random()*T_,i=0;while(i<L.length-1&&r>L[i]){r-=L[i];i++}const w=E.par[i],hz=w.w>=w.h,u=Math.random();let px,py,nx=0,ny=0,ht;
  if(hz){px=w.x+30+u*(w.w-60);py=w.y+w.h/2;ny=py<WH/2?1:-1;ht=w.h/2}else{py=w.y+30+u*(w.h-60);px=w.x+w.w/2;nx=px<WW/2?1:-1;ht=w.w/2}
  const x=px+nx*(ht+16),y=py+ny*(ht+16),dm=A.length?Math.min(...A.map(p=>Math.hypot(p.x-x,p.y-y))):999;
  if(dm<230||(E.h&&Math.hypot(E.h.x-x,E.h.y-y)<200)||zsWall(x,y,10))continue;const c={x,y,px,py,nx,ny,ht};if(dm<700){fb=c;break}if(!fb)fb=c}
 if(!fb)return 0;let t=null;try{t=zPick()}catch(e){}const z=mk(t!=null&&ZT[t]&&!ZT[t].boss&&!ZT[t].sv&&!ZT[t].gh?t:0,fb.x,fb.y);
 z.ri=z.rT=1.15+Math.random()*.35;z.sf=4;z.clb={px:fb.px,py:fb.py,nx:fb.nx,ny:fb.ny,ht:fb.ht,g:0};zs.push(z);return 1}
// spawn-near.js's crawl-out hands these the zombies that are climbing over (z.clb) instead
function escClimbUpd(z,dt){const C=z.clb;z.ri-=dt;const u=1-z.ri/z.rT;
 if(u>.08&&!C.g){C.g=1;sfx('clank',z.x,z.y,.55,.06);if(Math.random()<.5)sfx('groan',z.x,z.y,.6,.25)}
 if(u>.55&&Math.random()<dt*14)pt.push({x:C.px+(Math.random()-.5)*16,y:C.py+(Math.random()-.5)*8,vx:C.nx*rnd(20,60)+rnd(-20,20),vy:C.ny*rnd(20,60)-rnd(10,30),l:.3,c:'#8c8d94'});
 if(z.ri<=0){z.ri=0;z.clb=null;sfx('hard',z.x,z.y,.8,.05);for(let k=0;k<7;k++)pt.push({x:z.x+rnd(-10,10),y:z.y+rnd(4,12),vx:rnd(-70,70),vy:-rnd(10,50),l:.32,c:'#6a6c72'})}}
// the hands grab the coping, then it hauls itself up and over (cut off at the parapet's outer edge, as if coming up its face)
// and drops onto the deck
function escClimbDr(z){const C=z.clb,u=cl(1-z.ri/z.rT,0,1),T=ZT[z.t],hc=T.c||'#7d9f5a',nx=C.nx,ny=C.ny,tx=-ny,ty=nx,ex=C.px-nx*C.ht,ey=C.py-ny*C.ht;
 const hk=u<.04?0:Math.min(1,(u-.04)/.14),hin=u<.45?0:Math.min(1,(u-.45)/.3)*(C.ht*2+6);
 if(hk>0&&u<.86){for(const s of[-1,1]){const hx=ex+tx*s*9+nx*(hk*5+hin),hy=ey+ty*s*9+ny*(hk*5+hin);X.fillStyle='#120c10';X.fillRect(Math.round(hx-4),Math.round(hy-4),8,8);X.fillStyle=hc;X.fillRect(Math.round(hx-3),Math.round(hy-3),6,6);
   X.fillStyle='#120c10';for(const f of[-2,0,2])X.fillRect(Math.round(hx+nx*4+tx*f),Math.round(hy+ny*4+ty*f),1,1)}}
 if(u<.18)return;const e=escEase((u-.18)/.82),sx=ex-nx*10,sy=ey-ny*10,x=sx+(z.x-sx)*e,y=sy+(z.y-sy)*e-Math.sin(e*Math.PI)*(ny?6:12),k=.72+.28*e,ox=z.x,oy=z.y;
 X.save();X.beginPath();if(nx)X.rect(nx>0?ex:ex-4000,-4000,4000,9000);else X.rect(-4000,ny>0?ey:ey-4000,9000,4000);X.clip();X.globalAlpha=Math.min(1,(u-.18)*6);
 X.translate(x,y);X.scale(k,k);X.translate(-x,-y);z.x=x;z.y=y;z._rd=1;try{zDr(z)}finally{z._rd=0;z.x=ox;z.y=oy;X.restore()}}
// ----- won -----
function escWin(){for(const p of PL)p.ab=0;campRec(ESC.ci??null);CWIN={ci:null,m:cCampId(),nx:campNx(),esc:1};over(1)}
// losing a life on the way: everyone back on their feet at the elevator (the hospital or the roof), the zombies gone; never the boss again
function escLife(){const E=ESC;LIVES--;LLB=3;zs=[];nq=[];ep=[];bs=[];pd=[];fr=[];rg=[];KN=null;RKS=[];GHH=[];GRN=[];ICB=[];GCI=[];GCC=[];bossQ=-1;toSp=0;pend=0;BRK=null;
 E.fz=0;E.z=1;E.dk=0;E.fb=0;E.cam=null;E.bt=0;const c=escCarC(),o=elG(E.el).d,ox=o=='e'?110:o=='w'?-110:0,oy=o=='s'?110:o=='n'?-110:0;
 PL.forEach((p,i)=>{p.dead=0;p.dn=0;p.rv=0;p.hp=p.mx;p.inv=3;p.eat=null;p.bn=0;p.dd=0;p.ab=0;p.x=c.x+ox+[0,26,-26,0][i];p.y=c.y+oy+[0,0,0,26][i];push(p,9)});P=PL[0];
 if(E.rf){E.ph='run';E.t=0;E.gr=3;E.sp=1;if(!E.hb)escHeliBar();if(E.h){E.h.alt=0;const pad=null}}else{E.ph='go';E.t=0;E.k=1;E.sp=3}music('boss')}
// ----- drawing -----
// the helicopter: a medevac Black Hawk seen from above (local: nose +x), its shadow; alt 0 on the ground .. 1 up and away
function escHeliBody(g,h,t){const s=1+h.alt*.35,sh=h.alt*70;g.save();g.translate(h.x+sh*.6,h.y+sh);g.rotate(h.a);g.scale(s,s);g.fillStyle='rgba(0,0,0,'+(.35-.15*h.alt).toFixed(3)+')';g.beginPath();g.ellipse(10,0,120,38,0,0,7);g.fill();g.fillRect(-205,-9,130,18);g.restore();
 g.save();g.translate(h.x,h.y-h.alt*40);g.rotate(h.a);g.scale(s,s);const O='#16111c',B='#4a5638',BL='#5e6c46',BD='#36402a',R_2=(c,x,y,w,l)=>{g.fillStyle=c;g.fillRect(x,y,w,l)};
 // tail boom, the fin and stabiliser, the tail rotor's blur on the starboard side
 g.fillStyle=O;g.beginPath();g.moveTo(-70,-15);g.lineTo(-198,-8);g.lineTo(-198,8);g.lineTo(-70,15);g.fill();g.fillStyle=B;g.beginPath();g.moveTo(-70,-13);g.lineTo(-196,-6);g.lineTo(-196,6);g.lineTo(-70,13);g.fill();R_2(BL,-196,-6,126,3);
 R_2(O,-196,-32,20,64);R_2(B,-195,-31,18,62);R_2(BL,-195,-31,18,4);R_2(O,-212,-8,18,16);R_2(BD,-211,-7,16,14);
 g.fillStyle='rgba(200,205,190,.28)';g.beginPath();g.ellipse(-206,18,22,6,0,0,7);g.fill();g.strokeStyle='#2a2c26';g.lineWidth=3;const tr=h.rot*2.6;g.beginPath();g.moveTo(-206+Math.cos(tr)*20,18);g.lineTo(-206-Math.cos(tr)*20,18);g.stroke();
 g.fillStyle='#e8e4dc';g.beginPath();g.arc(-140,0,7,0,7);g.fill();g.fillStyle=B;g.beginPath();g.arc(-140,0,5,0,7);g.fill();
 // the fuselage
 g.fillStyle=O;g.beginPath();g.moveTo(-82,-34);g.lineTo(78,-34);g.quadraticCurveTo(128,-30,132,0);g.quadraticCurveTo(128,30,78,34);g.lineTo(-82,34);g.quadraticCurveTo(-92,0,-82,-34);g.fill();
 g.fillStyle=B;g.beginPath();g.moveTo(-80,-32);g.lineTo(78,-32);g.quadraticCurveTo(126,-28,130,0);g.quadraticCurveTo(126,28,78,32);g.lineTo(-80,32);g.quadraticCurveTo(-90,0,-80,-32);g.fill();R_2(BL,-80,-32,158,6);R_2(BD,-80,26,158,6);
 // the cockpit glass, the engine cowling and its exhausts, the rotor mast
 g.fillStyle=O;g.beginPath();g.moveTo(74,-26);g.quadraticCurveTo(120,-22,124,0);g.quadraticCurveTo(120,22,74,26);g.closePath();g.fill();g.fillStyle='#1e3a3a';g.beginPath();g.moveTo(77,-24);g.quadraticCurveTo(118,-20,121,0);g.quadraticCurveTo(118,20,77,24);g.closePath();g.fill();
 g.fillStyle='rgba(160,220,210,.35)';g.beginPath();g.moveTo(82,-20);g.quadraticCurveTo(104,-17,110,-6);g.lineTo(96,-6);g.closePath();g.fill();R_2(O,96,-24,2,48);
 R_2(O,-46,-20,92,40);R_2(BL,-45,-19,90,38);R_2('#6e7c54',-45,-19,90,8);for(let x=-38;x<40;x+=10)R_2(BD,x,-12,2,24);for(const v of[-22,18]){R_2(O,-56,v,14,6);R_2('#2a2c26',-55,v+1,12,4)}
 // the cabin doors slid open: the dark inside, seats, a medevac cross by each door
 for(const v of[-34,28]){R_2(O,-30,v,62,6);R_2('#1a1c18',-29,v+1,60,4)}R_2('#22261e',-30,-28,62,8);R_2('#22261e',-30,20,62,8);for(let x=-24;x<30;x+=14)R_2('#5a5040',x,-26,10,5);
 for(const v of[-20,14]){R_2('#e8e4dc',40,v,12,8);R_2('#c8281e',45,v,2,8);R_2('#c8281e',42,v+3,8,2)}
 // the door gunner at the port door, the minigun turned at his target
 if(ESC&&ESC.h===h){const fa=(ESC.fa!=null?ESC.fa-h.a:-Math.PI/2);R_2(O,22,-40,14,12);R_2('#3a4630',23,-39,12,10);g.save();g.translate(29,-34);g.rotate(cl(Math.atan2(Math.sin(fa),Math.cos(fa)),-Math.PI+.4,-.4));R_2(O,0,-3,34,6);R_2('#3a3d46',1,-2,32,4);R_2('#8a8f96',28,-2,5,4);if(ESC.ff>0){g.fillStyle='#ffe27a';g.beginPath();g.arc(38,0,6,0,7);g.fill();g.fillStyle='#fff';g.beginPath();g.arc(38,0,3,0,7);g.fill()}g.restore();kpCirc(g,O,29,-34,7);kpCirc(g,'#4a5638',29,-34,6);kpCirc(g,'#2a3020',29,-35,4)}
 // navigation lights: red port, green starboard, white tail; the beacon on top blinks
 kpCirc(g,'#ff3a2a',2,-35,3);kpCirc(g,'#3aff6a',2,35,3);kpCirc(g,'#ffffff',-212,0,3);if((t*1.3)%1<.2){kpCirc(g,'rgba(255,60,40,.5)',-10,0,10);kpCirc(g,'#ff5a3a',-10,0,4)}g.restore()}
function escRotor(g,h,t){const s=1+h.alt*.35;g.save();g.translate(h.x,h.y-h.alt*40);g.scale(s,s);g.fillStyle='rgba(190,196,186,.13)';g.beginPath();g.arc(0,0,178,0,7);g.fill();g.strokeStyle='rgba(30,32,28,.18)';g.lineWidth=2;g.beginPath();g.arc(0,0,178,0,7);g.stroke();
 for(let k=0;k<4;k++){const a=h.rot+k*Math.PI/2;for(const[d,al]of[[0,.85],[-.12,.3],[-.24,.14]]){g.strokeStyle='rgba(30,32,28,'+al+')';g.lineWidth=7;g.beginPath();g.moveTo(Math.cos(a+d)*14,Math.sin(a+d)*14);g.lineTo(Math.cos(a+d)*176,Math.sin(a+d)*176);g.stroke()}}
 kpCirc(g,'#16111c',0,0,12);kpCirc(g,'#3a3d36',0,0,10);kpCirc(g,'#5a5e56',-2,-2,4);g.restore()}
// on the pad it is drawn under people (they walk round it); once it lifts, over everything (tall props too)
function escDrawU(){if(!ESC||!ESC.h||!ESC.rf||ESC.h.alt>0)return;escHeliBody(X,ESC.h,performance.now()/1000)}
function escDrawT(){const E=ESC;if(!E||!E.rf||!E.h)return;const t=performance.now()/1000;
 X.lineCap='round';for(const r of E.tr){X.strokeStyle='rgba(255,226,122,'+(r.l/.07).toFixed(3)+')';X.lineWidth=2;X.beginPath();X.moveTo(r.x0,r.y0);X.lineTo(r.x1,r.y1);X.stroke()}X.lineCap='butt';E.ff=(E.ff||0)-.016;
 if(E.h.alt>0)escHeliBody(X,E.h,t);escRotor(X,E.h,t);
 // the way in: a marker over the door
 if(E.ph=='run'){const b=Math.sin(t*6)*5,d=escSeat(1),x=d.x-50,y=d.y-20+b;X.fillStyle='#ffcf40';X.strokeStyle='#070a08';X.lineWidth=3;X.beginPath();X.moveTo(x-30,y-10);X.lineTo(x-30,y+10);X.lineTo(x-14,y+10);X.lineTo(x-14,y+20);X.lineTo(x,y);X.lineTo(x-14,y-20);X.lineTo(x-14,y-10);X.closePath();X.stroke();X.fill()}}
// the helicopter's lights for the lighting (cmLight): nav lights, the beacon, the cabin, the searchlight from the nose
function escLights(S){const E=ESC;if(!E||!E.rf||!E.h)return;const h=E.h,ca=Math.cos(h.a),sa=Math.sin(h.a),W_=(u,v)=>[h.x+u*ca-v*sa,h.y+u*sa+v*ca-h.alt*40];
 const l=(u,v,r,c,i,f)=>{const p=W_(u,v);S.push({x:p[0],y:p[1],r,c,i,f,ph:0})};l(2,-36,50,'#ff3a2a',.8);l(2,36,50,'#3aff6a',.8);l(-212,0,40,'#ffffff',.6);l(-10,0,90,'#ff4a3a',.8,'blink');l(0,-30,110,'#ffe8c0',.7);
 const p=W_(130,0);S.push({x:p[0],y:p[1],r:420,c:'#f4f8ff',i:1,cw:.32,ca:h.a,ph:0})}
// blacking out all but the car (world coordinates; inside the zoom)
function escDark(){const E=ESC;if(!E||!(E.dk>0)||!E.el)return;const r=elG(E.el).inr,m=14;X.save();X.translate(-Math.round(cam.x),-Math.round(cam.y));X.fillStyle='rgba(4,6,5,'+E.dk.toFixed(3)+')';X.beginPath();X.rect(cam.x-60,cam.y-60,W+120,H+120);X.rect(r[0]-m,r[1]-m,r[2]+m*2,r[3]+m*2);X.fill('evenodd');X.restore()}
// the prompts, the arrow to where to go, the fade to black between the floors
function escHud(){const E=ESC;if(!E||mode!='play')return;const PX='"Press Start 2P", ui-monospace, monospace',t=performance.now()/1000;X.save();X.globalAlpha=1;
 if(E.fb>0){X.fillStyle='rgba(0,0,0,'+E.fb.toFixed(3)+')';X.fillRect(0,0,W,H)}
 const card=(a,b,ct)=>{if(ct>5){X.font=(H<520?9:10)+'px '+PX;const tw=X.measureText(a).width+34,bx=Math.round(W/2-tw/2),by=H<520?24:28;X.globalAlpha=Math.min(1,(ct-5)*4);X.fillStyle='rgba(7,10,8,.78)';X.fillRect(bx,by,tw,22);X.fillStyle='rgba(255,207,64,.7)';X.fillRect(bx,by+20,tw,2);X.textAlign='center';X.textBaseline='middle';X.fillStyle='#ffcf40';X.fillText(a,W/2,by+11);X.globalAlpha=1;return}
  X.globalAlpha=ct>4.6?Math.max(0,1-(ct-4.6)/.4):1;X.font=(H<520?10:13)+'px '+PX;const tw=Math.min(W-24,Math.max(X.measureText(a).width,X.measureText(b).width*.8)+60),th=H<520?44:58,bx=Math.round(W/2-tw/2),by=H<520?64:Math.round(Math.max(76,H*.13));X.fillStyle='rgba(7,10,8,.82)';X.fillRect(bx,by,tw,th);X.fillStyle='rgba(255,207,64,.7)';X.fillRect(bx,by,tw,3);
  X.textAlign='center';X.textBaseline='middle';X.fillStyle=Math.sin(t*5)>-.3?'#ffcf40':'#ffe9a8';X.fillText(a,W/2,by+(H<520?15:20));X.font=(H<520?15:19)+'px VT323, ui-monospace, monospace';X.fillStyle='#e9f1e2';X.fillText(b,W/2,by+th-(H<520?12:15));X.globalAlpha=1};
 const arrow=(tx,ty,lab)=>{const sx=tx-cam.x,sy=ty-cam.y,on=sx>40&&sx<W-40&&sy>60&&sy<H-40;if(on){const b=Math.sin(t*6)*6,f=sy<(H<520?200:270)?-1:1;// near the top (under the prompt) it points up from below instead
   X.fillStyle='#ffcf40';X.strokeStyle='#070a08';X.lineWidth=3;X.beginPath();X.moveTo(sx-12,sy-f*(70+b));X.lineTo(sx+12,sy-f*(70+b));X.lineTo(sx+12,sy-f*(54+b));X.lineTo(sx+22,sy-f*(54+b));X.lineTo(sx,sy-f*(34+b));X.lineTo(sx-22,sy-f*(54+b));X.lineTo(sx-12,sy-f*(54+b));X.closePath();X.stroke();X.fill();X.font='10px '+PX;X.lineWidth=4;X.strokeText(lab,sx,sy-f*(82+b));X.fillText(lab,sx,sy-f*(82+b));return}
  const a=Math.atan2(sy-H/2,sx-W/2),ex=W/2+Math.cos(a)*(W/2-36),ey=H/2+Math.sin(a)*(H/2-36),qx=cl(ex,30,W-30),qy=cl(ey,70,H-30);X.save();X.translate(qx,qy);X.rotate(a);X.fillStyle='#ffcf40';X.strokeStyle='#070a08';X.lineWidth=3;X.beginPath();X.moveTo(18,0);X.lineTo(-10,-14);X.lineTo(-4,0);X.lineTo(-10,14);X.closePath();X.stroke();X.fill();X.restore()};
 if(E.ph=='go'){const c=escCarC();card('HEAD TO THE ELEVATOR','The military is taking survivors off the roof'+(MPn?' · everyone in the car':''),E.t);arrow(c.x,c.y,'ELEVATOR')}
 // riding up: the car's floor display, big, under it
 else if(E.ph=='ride'){const bw=H<520?120:150,bh=H<520?50:62,bx=Math.round(W/2-bw/2),by=Math.round(H-(H<520?92:140)),cy=by+bh/2;X.fillStyle='rgba(7,10,8,.9)';X.fillRect(bx,by,bw,bh);X.strokeStyle='#4a4232';X.lineWidth=2;X.strokeRect(bx+1,by+1,bw-2,bh-2);
  const ax=bx+(H<520?30:36),au=(t*2.2)%1;X.fillStyle=au<.65?'#ffcf40':'#6a5020';X.beginPath();X.moveTo(ax,cy-12);X.lineTo(ax+11,cy+4);X.lineTo(ax-11,cy+4);X.closePath();X.fill();X.fillRect(ax-4,cy+4,8,8);
  X.textAlign='center';X.textBaseline='middle';X.font=(H<520?20:26)+'px '+PX;X.fillStyle='#ffcf40';X.fillText(E.fl,bx+bw/2+20,cy+2);
  X.font='9px '+PX;X.fillStyle='#bfae80';X.fillText(E.fl=='R'?'ROOF':'GOING UP',W/2,by+bh+16)}
 else if(E.ph=='run'&&E.h){card('GET TO THE HELICOPTER',MPn?'Everyone in the door together and it lifts off':'Get in the door and it lifts off',E.t);const d=escSeat(1);arrow(d.x-40,d.y,'HELI')}
 X.restore();X.textAlign='left';X.textBaseline='alphabetic'}
// the end screen after the helicopter got away
function escCwH(){const C=CWIN;return `<h2 style="color:var(--tox)">YOU GOT OUT OF ZOMBVILLE!</h2><div class=cwin><div><b>The helicopter made it off the roof of ${edEsc(mpName(C.m))}.</b><small>Zombville is behind you. ${C.nx!=null?'Next up: '+MP[C.nx].n+' ('+SEC[secOf(C.nx)].n+').':cBeat(S.ac)>=SORD.length?'You beat the whole campaign. Every map is open in free play.':'Pick your next map on the campaign map.'}</small></div></div>`}
