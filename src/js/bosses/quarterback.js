//# bosses/quarterback.js — Buck, Zombville Stadium's quarterback (18): the charge with a ghost football team, and the minigun
// ---------- Buck (18): navy helmet, the home team's red #7 jersey, white pants; a football in his hand ----------
// Two attacks, taken in turn (whichever the distance allows):
// * The charge: "HUT! HUT! HIKE!": a ghost football team appears in a line beside him and he and they crouch for a moment
//   (their lanes show on the ground), then the whole team charges straight at where you were. Each runner that reaches you
//   hits for 2 and knocks you back. The lanes have gaps a player can step into; a wall stops Buck and dissolves a ghost.
// * The minigun: "AIR RAID!": he pulls out a minigun (it spins up while a red line shows where it points), then sprays a
//   stream of bullets that turns toward you only slowly, so you can run round it or get behind something, then puts it away.
// At half health it is the TWO-MINUTE WARNING: two more ghosts in the charge, longer minigun bursts, shorter breaks.
// SVS[18]: cv/cl = charge speed and length (px/s, px), gn = ghost teammates, cw = seconds the team crouches before the snap,
// ca = seconds between attacks, mr = seconds between minigun shots, mt = seconds a burst lasts, mtr = how fast the minigun
// turns toward you (radians a second), mv/ml/ms = bullet speed, life and spread. All are in the GAME BALANCE menu.
var QBG=[];
function qbClear(){QBG=[]}
// where each ghost teammate lines up, in the order they join: [to the side, ahead (negative: behind)] in px from Buck
const QBF=[[70,0],[-70,0],[140,8],[-140,8],[70,-56],[-70,-56],[210,16],[-210,16],[140,-48],[-140,-48]],QBR=20;
// the end of the minigun's barrels (PS[18].gun[8]: 70,1 px from the shoulder)
function qbMz(z,a){const s=SVK/1.6,fl=Math.cos(z.fa)<0?-1:1,L=70*s,q=1*s,hy=z.y-10.2*s;return{x:z.x+Math.cos(a)*L-fl*q*Math.sin(a),y:hy+Math.sin(a)*L+fl*q*Math.cos(a)}}
function svQB(z,Q,d,sg,aim,dt,can){const D=SVS[18];z.mf=Math.max(0,(z.mf||0)-dt);
const gap=()=>(D.ca??2)*(z.oc?.7:1)*(.8+Math.random()*.4);
// half health: the two-minute warning
if(!z.oc&&z.hp<=z.mh*.5){z.oc=1;z.bn=CH[18].n.toUpperCase()+' · TWO-MINUTE WARNING';z.iv=Math.max(z.iv||0,.5);sfx('qbwhistle',z.x,z.y);FT.push({x:z.x,y:z.y-70,t:'TWO-MINUTE WARNING!',c:'#ffcf40',l:2.2})}
// --- the charge: crouch (the ghosts line up), run, catch his breath ---
if(z.qs==1){z.qt-=dt;if(z.qt<=0){z.qs=2;z.qt=(D.cl??430)/(D.cv||430);for(const g of QBG)if(g.o===z&&g.st==0)g.st=1;sfx('qbstomp',z.x,z.y);shk=Math.max(shk,.15)}return[0,0,0]}
if(z.qs==2){z.qt-=dt;qbTackle(z.x,z.y,z.qa);if(z.qt<=0||z.wallHit){z.qs=3;z.qt=.7;if(z.wallHit){shk=Math.max(shk,.25);sfx('club',z.x,z.y)}}return[z.qa,D.cv||430,0]}
if(z.qs==3){z.qt-=dt;if(z.qt<=0){z.qs=0;z.lk=0;z.ab=gap()}return[0,0,0]}
// --- the minigun: spin up, fire, put it away; it turns toward you slowly while it fires ---
if(z.mg){const df=Math.atan2(Math.sin(aim-z.fa),Math.cos(aim-z.fa)),tr=(D.mtr??.45)*(z.mg==1?4:1);z.fa+=cl(df,-tr*dt,tr*dt);z.mt-=dt;
 if(z.mg==1){if(z.mt<=0){z.mg=2;z.mt=(D.mt??2)*(z.oc?1.3:1);z.mb=0}return[0,0,0]}
 if(z.mg==2){z.mb-=dt;while(z.mb<=0){z.mb+=Math.max(.02,D.mr??.07);const m=qbMz(z,z.fa),b=z.fa+(Math.random()-.5)*2*(D.ms??.1),v=D.mv??360;ep.push({x:m.x,y:m.y,vx:Math.cos(b)*v,vy:Math.sin(b)*v,l:D.ml??1.25,k:5,c:'#ffe27a'});z.mf=.06}
  sfx('minigun',z.x,z.y,.5,.05);if(z.mt<=0){z.mg=3;z.mt=.45}const[a,m]=svKite(z,Q,d,sg,dt);return[a,D.sp*m*.3,0]}
 if(z.mt<=0){z.mg=0;z.lk=0;z.ab=gap()}return[0,0,0]}
const[a,m]=svKite(z,Q,d,sg,dt);
// pick the next play: they take turns, but only one the distance allows
if(z.ab<=0&&alive(Q)&&sg){const okC=d>110&&d<620,okM=d<500;let p=z.nx||(Math.random()<.5?'c':'m');if(p=='c'&&!okC)p='m';if(p=='m'&&!okM)p='c';
 if(p=='c'&&okC){qbCharge(z,Q);z.nx='m';return[0,0,0]}if(p=='m'&&okM){z.mg=1;z.mt=.75;z.lk=1;z.nx='c';sfx('qbspin',z.x,z.y);FT.push({x:z.x,y:z.y-70,t:'AIR RAID!',c:'#ff8a5a',l:1.3});return[0,0,0]}}
return[a,D.sp*m,0]}
// the snap count: the ghost team lines up beside him, facing where the player is
function qbCharge(z,Q){const D=SVS[18],a=Math.atan2(Q.y-z.y,Q.x-z.x),c=Math.cos(a),s=Math.sin(a),n=Math.max(0,Math.min(QBF.length,Math.round((D.gn??6)+(z.oc?2:0)))),T=(D.cl??430)/(D.cv||430);
z.qs=1;z.qt=D.cw??.85;z.qa=a;z.fa=a;z.lk=1;
for(let i=0;i<n;i++){const[o,f]=QBF[i],x=z.x+c*f-s*o,y=z.y+s*f+c*o;if(!svOK(x,y))continue;QBG.push({o:z,x,y,a,st:0,t:0,r:0,l:0,T,v:D.cv||430,ph:Math.random()*9});qbPuff(x,y)}
sfx('qbhike',z.x,z.y);FT.push({x:z.x,y:z.y-70,t:'HUT! HUT! HIKE!',c:'#ffcf40',l:1.4})}
// anyone a runner (Buck or a ghost) reaches is tackled: 2 damage and knocked back the way the team is running
function qbTackle(x,y,a){for(const q of PL)if(alive(q)&&q.inv<=0&&Math.hypot(q.x-x,q.y-y)<QBR){hitP(q,2,a);FT.push({x:q.x,y:q.y-40,t:'TACKLED!',c:'#ff8a5a',l:.8});sfx('club',q.x,q.y,.8)}}
function qbPuff(x,y){for(let i=0;i<10;i++){const b=Math.random()*6.283,v=30+Math.random()*90;pt.push({x,y:y-14,vx:Math.cos(b)*v,vy:Math.sin(b)*v-20,l:.45,c:i%2?'#dff0ff':'#9ac8ff'})}}
// the ghosts: they wait while Buck calls the snap, run with him, and fade at the end of the run or when they reach a wall
function svTick7(dt){if(!QBG.length)return;for(const g of QBG){g.t+=dt;
 if(g.st==1){g.r+=dt;const nx=g.x+Math.cos(g.a)*g.v*dt,ny=g.y+Math.sin(g.a)*g.v*dt;if(nx<10||ny<10||nx>WW-10||ny>WH-10||knInW(nx,ny)){g.st=2;g.l=.35;qbPuff(g.x,g.y)}
  else{g.x=nx;g.y=ny;qbTackle(g.x,g.y,g.a);if(g.r>=g.T){g.st=2;g.l=.35}}}
 else if(g.st==2)g.l-=dt;
 else if(!g.o||g.o.hp<=0||!zs.includes(g.o)||g.o.qs!=1){g.st=2;g.l=.35}}
QBG=QBG.filter(g=>g.st!=2||g.l>0)}
// ----- drawing -----
// the lanes the team will run, shown on the ground while they crouch (under everything that walks)
// on a map with time-of-day lighting they are drawn after the light instead (qbLit), so they show at night
function qbDrawS(){if(cmLtOn())return;qbLanes()}
function qbLanes(){if(!QBG.length&&!zs.some(z=>z.ci==18&&z.qs==1))return;const t=performance.now()/1000,L=SVS[18].cl??430;
for(const z of zs){if(z.ci!=18||z.qs!=1||z.hp<=0)continue;const R=[{x:z.x,y:z.y}].concat(QBG.filter(g=>g.o===z&&g.st==0));
 X.globalAlpha=.16+.1*Math.sin(t*14);X.strokeStyle='#ff4a3a';X.lineWidth=QBR*2;X.lineCap='round';X.beginPath();for(const r of R){X.moveTo(r.x,r.y+8);X.lineTo(r.x+Math.cos(z.qa)*L,r.y+8+Math.sin(z.qa)*L)}X.stroke();
 X.globalAlpha=.5;X.strokeStyle='#ffd0c0';X.lineWidth=1.5;X.setLineDash([8,10]);X.beginPath();for(const r of R){X.moveTo(r.x,r.y+8);X.lineTo(r.x+Math.cos(z.qa)*L,r.y+8+Math.sin(z.qa)*L)}X.stroke();X.setLineDash([]);X.lineCap='butt'}
X.globalAlpha=1}
// a ghostly copy of Buck's walking and standing frames, made once (pale blue, see-through when drawn)
let QBGI=null;
function qbGhostImg(){if(QBGI)return QBGI;if(typeof document=='undefined'||!document.createElement||!PIMG.naturalWidth||!PS[18])return null;
try{const F=PS[18].walk.concat(PS[18].idle),cv=document.createElement('canvas');cv.width=F.length*48;cv.height=64;const g=cv.getContext('2d');F.forEach((f,i)=>g.drawImage(PIMG,f[0],f[1],f[2],f[3],i*48,0,48,64));
 g.globalCompositeOperation='source-atop';g.fillStyle='rgba(200,230,255,.72)';g.fillRect(0,0,cv.width,64);g.globalCompositeOperation='source-over';return QBGI=cv}catch(e){return null}}
function qbGhost(g,t){const k=SVK,s=k/1.6,w=48*s,h=64*s,fl=Math.cos(g.a)<0?-1:1,run=g.st==1,al=(g.st==2?Math.max(0,g.l/.35):Math.min(1,g.t/.25))*.62,fy=g.y+h*.45,I=qbGhostImg();
X.globalAlpha=al*.5;X.fillStyle='#9ac8ff';X.beginPath();X.ellipse(g.x,fy-2,16,5,0,0,7);X.fill();X.globalAlpha=al*.25;X.beginPath();X.ellipse(g.x,fy-h*.45,18,h*.5,0,0,7);X.fill();
X.globalAlpha=al;X.save();X.translate(g.x,fy);X.scale(fl,1);if(run)X.rotate(.18);
if(I){const i=run?Math.floor(t*13+g.ph)%6:6+Math.floor(t*3+g.ph)%4;X.drawImage(I,i*48,0,48,64,-w/2,-h,w,h)}
else{X.fillStyle='#cfe6ff';X.fillRect(-w*.2,-h*.9,w*.4,h*.9)}
X.restore();X.globalAlpha=1}
// on Buck himself: the red line where the minigun points as it spins up, the muzzle flash, the crouch before the snap
function qbFx(z,t){if(z.mg==1&&!cmLtOn())qbAim(z,t);
if(z.mg==2&&z.mf>0){const m=qbMz(z,z.fa),r=6+Math.random()*5;X.fillStyle='#ffd84a';X.globalAlpha=.85;X.beginPath();X.arc(m.x+Math.cos(z.fa)*4,m.y+Math.sin(z.fa)*4,r,0,7);X.fill();X.fillStyle='#fff6c8';X.beginPath();X.arc(m.x+Math.cos(z.fa)*3,m.y+Math.sin(z.fa)*3,r*.5,0,7);X.fill();X.globalAlpha=1}}
// the ghosts are drawn over everything else of the fight (on lit maps after the light: qbLit)
function svExtra7(){if(cmLtOn())return;qbGhosts()}
function qbGhosts(){if(!QBG.length)return;const t=performance.now()/1000;for(const g of QBG.slice().sort((a,b)=>a.y-b.y))qbGhost(g,t)}
// after the light (world/kit-lighting.js) on dark maps: the ghosts glow and the lanes stay readable
function qbLit(){qbLanes();qbGhosts();const t=performance.now()/1000;for(const z of zs)if(z.ci==18&&z.mg==1&&z.hp>0)qbAim(z,t)}
// the red line where the minigun points while it spins up
function qbAim(z,t){const m=qbMz(z,z.fa);X.globalAlpha=.25+.2*Math.sin(t*22);X.strokeStyle='#ff3a2a';X.lineWidth=10;X.beginPath();X.moveTo(m.x,m.y);X.lineTo(m.x+Math.cos(z.fa)*360,m.y+Math.sin(z.fa)*360);X.stroke();X.globalAlpha=1}
// on dark maps the minigun's muzzle flash lights things up (called from cmLight)
function qbLights(S){for(const z of zs)if(z.ci==18&&z.mg==2&&z.hp>0){const m=qbMz(z,z.fa);S.push({x:m.x,y:m.y,r:z.mf>0?110:70,c:'#ffd88a',i:1})}}
// ---------- sounds ----------
Object.assign(SF,{
// the snap count: three barked HUTs
qbhike:(t,d)=>{for(let i=0;i<3;i++){const o=t+i*.2;noise(o,.08,.42,d,'bandpass',640,420,2.5,.005);osc('square',190,140,o,.09,.1,d,.005);osc('sine',150,110,o,.1,.25,d,.005)}return .62},
// a referee's whistle trill
qbwhistle:(t,d)=>{for(let i=0;i<10;i++)osc('sine',3150,3050,t+i*.034,.03,.16,d,.002);osc('square',3100,3100,t,.36,.03,d,.01);noise(t,.36,.06,d,'bandpass',3200,0,4);return .42},
// the team's stampede: heavy footfalls and a rumble
qbstomp:(t,d)=>{for(let i=0;i<12;i++)noise(t+i*.07+Math.random()*.02,.07,.3,d,'lowpass',300,90);osc('sine',62,38,t,.85,.35,d,.02);return .9},
// the minigun spinning up
qbspin:(t,d)=>{osc('sawtooth',80,620,t,.75,.08,d,.05);osc('square',55,300,t,.75,.04,d,.05);for(let i=0;i<8;i++)noise(t+i*.09,.05,.06+i*.012,d,'bandpass',900+i*300,0,2);return .78}});
