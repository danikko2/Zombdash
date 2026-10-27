//# weapons/life-saver.js — The Life Saver: hearts that heal a friend, bounce off walls and come back to heal you; drawing and sounds
// A heart flies straight, passes through zombies (it never hurts them) and bounces off walls and the map's edge.
// It heals the first player it touches: a friend (split screen) any time, the shooter only after it has bounced.
// A friend who is down is revived. Numbers on the gun in WP (data/tables.js), so GAME BALANCE can change them:
//   hl = health a heart heals, lv = heart speed, lb = most wall bounces, ll = seconds a heart flies, apr = rockets per heart
var LSH=[];
function lsClear(){LSH=[]}
function lsFire(p,mz,a){const W=WP[p.cur]||{};LSH.push({x:mz.x,y:mz.y,vx:Math.cos(a)*(W.lv||330),vy:Math.sin(a)*(W.lv||330),o:p,g:p.cur,b:0,l:W.ll||2.5,ph:Math.random()*6});
for(let i=0;i<8;i++)pt.push({x:mz.x,y:mz.y,vx:Math.cos(a)*70+(Math.random()-.5)*120,vy:Math.sin(a)*70+(Math.random()-.5)*120,l:.4,c:i%2?'#ff7aa8':'#ffd0dc'})}
function lsWall(x,y){if(x<3||y<3||x>WW-3||y>WH-3)return 1;return wlAt(x,y).some(w=>w[4]!=2&&x>w[0]&&x<w[0]+w[2]&&y>w[1]&&y<w[1]+w[3])}
// a heart reaching a player: revive a downed friend, otherwise heal (shows FULL when there is nothing to heal)
function lsHeal(h,p){const W=WP[h.g]||{},n=W.hl||2,o=h.o;let got=0;
if(p.dn){p.dn=0;p.rv=0;p.hp=Math.min(p.mx,Math.max(n,Math.ceil(p.mx*.34)));p.inv=2;got=p.hp;FT.push({x:p.x,y:p.y-34,t:'REVIVED!',c:'#9be860',l:1.6})}
else{const h0=p.hp;p.hp=Math.min(p.mx,p.hp+n);got=p.hp-h0;FT.push({x:p.x,y:p.y-34,t:got>0?'+'+got+' ♥':'FULL',c:'#ff7aa8',l:1.2})}
for(let i=0;i<14;i++){const a=Math.random()*6.283,v=40+Math.random()*120;pt.push({x:p.x,y:p.y-10,vx:Math.cos(a)*v,vy:Math.sin(a)*v-40,l:.6,c:i%3?'#ff7aa8':'#ffffff'})}
sfx('lsheal',p.x,p.y,.8);if(got>0&&o&&o.ac&&!o.ac.g)wXP(o,h.g,p===o?2:4);return got}
function lsUpd(dt){for(const h of LSH){const W=WP[h.g]||{};h.l-=dt;
 for(let k=0;k<2&&h.l>0;k++){const nx=h.x+h.vx*dt/2,ny=h.y+h.vy*dt/2;
  if(lsWall(nx,ny)){const bx=lsWall(nx,h.y),by=lsWall(h.x,ny);if(bx||!by)h.vx=-h.vx;if(by||!bx)h.vy=-h.vy;h.b++;sfx('lsbounce',h.x,h.y,.6,.04);
   for(let i=0;i<5;i++)pt.push({x:h.x,y:h.y,vx:(Math.random()-.5)*120,vy:(Math.random()-.5)*120,l:.3,c:'#ffd0dc'});if(h.b>(W.lb??3))h.l=0}
  else{h.x=nx;h.y=ny}
  for(const p of PL){if(p.dead||(p===h.o&&!h.b))continue;if(Math.hypot(p.x-h.x,p.y-8-h.y)<16){lsHeal(h,p);h.l=0;h.used=1;break}}}
 if(Math.random()<dt*30)pt.push({x:h.x,y:h.y,vx:(Math.random()-.5)*20,vy:-10-Math.random()*20,l:.35,c:Math.random()<.5?'#ff7aa8':'#ffd0dc'});
 if(h.l<=0&&!h.used)for(let i=0;i<8;i++)pt.push({x:h.x,y:h.y,vx:(Math.random()-.5)*90,vy:(Math.random()-.5)*90,l:.35,c:'#ff7aa8'})}
LSH=LSH.filter(h=>h.l>0)}
function lsDraw(){if(!LSH.length)return;const f=typeof ZS!='undefined'&&ZS.heart&&ZS.heart.fly[0],t=performance.now()/1000;
for(const h of LSH){const k=1+.12*Math.sin(t*14+h.ph);X.globalAlpha=.3;X.fillStyle='#ff5a8a';X.beginPath();X.arc(h.x,h.y,9*k,0,7);X.fill();X.globalAlpha=1;
 if(!f||!SPR.naturalWidth){X.fillStyle='#ff3a6a';X.fillRect(h.x-5,h.y-5,10,10);continue}
 const w=f[2]/1.2*k,hh=f[3]/1.2*k;X.save();X.imageSmoothingEnabled=false;X.drawImage(SPR,f[0],f[1],f[2],f[3],h.x-w/2,h.y-hh/2,w,hh);X.restore()}}
// ---------- sounds ----------
Object.assign(SF,{
// Life Saver: a soft pneumatic puff and a little chime
lifesaver:(t,d)=>{noise(t,.12,.35,d,'lowpass',900,200);osc('sine',140,70,t,.12,.3,d);osc('sine',880,880,t+.04,.25,.12,d,.005);osc('sine',1320,1320,t+.1,.3,.09,d,.005);return .4},
// a heart bouncing off a wall
lsbounce:(t,d)=>{osc('sine',300,720,t,.08,.18,d,.003);osc('triangle',720,360,t+.07,.1,.1,d,.003);return .17},
// a player healed: a quick rising arpeggio
lsheal:(t,d)=>{[660,880,1100,1320].forEach((f,i)=>osc('sine',f,f,t+i*.06,.18,.12,d,.005));osc('triangle',1760,1760,t+.24,.25,.05,d,.005);return .5},
// Life Saver reload: the rocket reload, then a ready chime
rlls:(t,d)=>{const l=rlPlay('rk',t,d);osc('sine',1320,1320,t+2.6,.2,.08,d,.005);osc('sine',1760,1760,t+2.7,.25,.06,d,.005);return Math.max(l||0,2.95)}});
