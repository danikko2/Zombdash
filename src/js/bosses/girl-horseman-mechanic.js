//# bosses/girl-horseman-mechanic.js — Abigail, the Headless Horseman, the Mechanic
// ---------- the Girl (Mansion), the Headless Horseman (Forest), the Mechanic (Urban) as wave-20 bosses ----------
var GHH=[],GRN=[];
// --- the girl: splits into 10-20 copies; only the real one can be hurt, a copy pops with one hit ---
function svGirl(z,Q,d,sg,aim,dt,can){const D=SVS[10];
const[a,m]=svKite(z,Q,d,sg,dt);
if(z.cl){z.cd-=0;if(z.cd<=0&&can()){svFire(z,aim);z.cd=2.2+Math.random()*2.4}return[a,D.sp*m*.95,0]}
const nc=zs.filter(q=>q.cl&&q.hp>0).length;
if(z.ab<=0&&nc<4){const N=10+Math.floor(Math.random()*11),pts=[{x:z.x,y:z.y}];for(let i=0;i<N*3&&pts.length<N;i++){const p=svPt(z.x,z.y,60,300);if(p&&!pts.some(o=>Math.hypot(o.x-p.x,o.y-p.y)<34))pts.push(p)}
const me=Math.floor(Math.random()*pts.length);for(let i=0;i<pts.length;i++){const p=pts[i];for(let k=0;k<10;k++){const b=Math.random()*6.283,v=40+Math.random()*120;pt.push({x:p.x,y:p.y-20,vx:Math.cos(b)*v,vy:Math.sin(b)*v,l:.45,c:k%2?'#e8e8f4':'#9a9ab0'})}if(i==me){z.x=p.x;z.y=p.y;continue}
zs.push({x:p.x,y:p.y,t:16,ci:10,cl:1,hp:1,mh:1,k:0,kx:0,ky:0,spm:1,ph:2,fa:z.fa,cd:1.2+Math.random()*3.2,ab:99,tr:[],sd:Math.random()<.5?-1:1})}
z.ab=11+Math.random()*4;sfx('power',z.x,z.y,.6);FT.push({x:z.x,y:z.y-70,t:'WHICH ONE IS REAL?',c:'#e8e8ff',l:1.8})}
if(z.cd<=0&&can()){svFire(z,aim);z.cd=D.cd+Math.random()*.6}return[a,D.sp*m,0]}
function svPop(z){sfx('splat',z.x,z.y,.7,.03);for(let k=0;k<14;k++){const b=Math.random()*6.283,v=50+Math.random()*150;pt.push({x:z.x,y:z.y-18,vx:Math.cos(b)*v,vy:Math.sin(b)*v,l:.5,c:k%3?'#f0f0f8':'#8a8aa0'})}}
// --- the headless horseman: summons ghosts, and hands burst from the ground (with a warning) ---
function svHH(z,Q,dt){z.gt=(z.gt??4)-dt;z.ht=(z.ht??3)-dt;
if(z.gt<=0){z.gt=7+Math.random()*3;const ng=zs.filter(q=>ZT[q.t].gh&&q.hp>0).length;if(ng<7){for(let i=0;i<3;i++){const p=svPt(z.x,z.y,30,140)||{x:z.x,y:z.y};const g=mk(17,p.x,p.y);g.hp=ZT[17].hp;g.mh=g.hp;g.bob=Math.random()*6;zs.push(g)}sfx('newz',z.x,z.y,.7);FT.push({x:z.x,y:z.y-70,t:'RISE, SPIRITS!',c:'#9affb0',l:1.4})}}
if(z.ht<=0&&alive(Q)){z.ht=4.6+Math.random()*1.6;const S_=[{x:Q.x,y:Q.y}];for(let i=0;i<3;i++){const a=Math.random()*6.283,r=50+Math.random()*80;S_.push({x:Q.x+Math.cos(a)*r,y:Q.y+Math.sin(a)*r})}for(const s of S_)GHH.push({x:s.x,y:s.y,t:0,W:1.05,B:.7});sfx('dashwarn',Q.x,Q.y,.6)}}
// --- the mechanic: on his Harley the whole fight: circles and sprays, tries to run you down, grenades anyone hiding indoors ---
function svInHouse(q){const H=HS.HO;if(!H)return null;for(const h of H)if(q.x>h.x+4&&q.x<h.x+h.w-4&&q.y>h.y+4&&q.y<h.y+h.h-4)return h;return null}
function svMech(z,Q,d,sg,aim,dt,can){const D=SVS[12];z.rt=(z.rt??2.5)-dt;z.gn=(z.gn??1.5)-dt;
if(z.st>0){z.st-=dt;return[0,0,0]}
if(z.rm>0){z.rm-=dt;for(const q of PL)if(alive(q)&&Math.hypot(q.x-z.x,q.y-z.y)<30)hitP(q,2,z.ra);if(Math.random()<.6)pt.push({x:z.x-Math.cos(z.ra)*22,y:z.y+12,vx:rnd(-30,30),vy:rnd(-30,0),l:.35,c:'#8a8a8a'});
if(z.wallHit){z.rm=0;z.st=.8;shk=Math.max(shk,.3);sfx('club',z.x,z.y);for(let k=0;k<16;k++){const b=Math.random()*6.283;pt.push({x:z.x,y:z.y,vx:Math.cos(b)*160,vy:Math.sin(b)*160,l:.3,c:'#ffd84a'})}}return[z.ra,430,0]}
// grenades for anyone inside a house
if(z.gn<=0){z.gn=2.4;for(const q of PL){if(!alive(q))continue;const h=svInHouse(q);if(h&&Math.hypot(q.x-z.x,q.y-z.y)<620){const tx=cl(q.x+rnd(-26,26),h.x+12,h.x+h.w-12),ty=cl(q.y+rnd(-26,26),h.y+12,h.y+h.h-12);GRN.push({sx:z.x,sy:z.y,tx,ty,t:0,T:.75,f:1.1});sfx('swoosh',z.x,z.y);if(Math.random()<.5)FT.push({x:z.x,y:z.y-70,t:'GET OUT OF THERE!',c:'#ffcf40',l:1.2});break}}}
// run-over charge
if(z.rt<=0&&(sg||d<260)&&d<520&&d>80&&alive(Q)){z.rt=3.6+Math.random()*2;z.rm=1.05;z.ra=Math.atan2(Q.y+(Q.vy||0)*.2-z.y,Q.x-z.x);z.fa=z.ra;sfx('dashwarn',z.x,z.y);FT.push({x:z.x,y:z.y-70,t:'VROOOM!',c:'#ff8a3a',l:.9});return[z.ra,430,0]}
// otherwise circle the player and spray the SMG
z.oa=(z.oa??Math.atan2(z.y-Q.y,z.x-Q.x))+dt*.8*(z.od||1);z.ot=(z.ot??3)-dt;if(z.ot<=0||z.wallHit){z.ot=2+Math.random()*2.5;z.od=-(z.od||1)}
const R=230,tx=Q.x+Math.cos(z.oa)*R,ty=Q.y+Math.sin(z.oa)*R;let a=Math.atan2(ty-z.y,tx-z.x);if(!sg&&d>300)a=dirTo(z);
z.hd=z.hd??a;{const df=Math.atan2(Math.sin(a-z.hd),Math.cos(a-z.hd));z.hd+=cl(df,-4.5*dt,4.5*dt)}z.ga=z.hd;if(z.cd<=0&&can())svFire(z,aim);return[z.hd,Math.min(250,Math.hypot(tx-z.x,ty-z.y)*2.2+60),0]}
// hands, grenades, roots (ticked every frame)
function svTick3(dt){for(const h of GHH){h.t+=dt;if(!h.hit&&h.t>=h.W){h.hit=1;sfx('slam',h.x,h.y,.5);for(let k=0;k<10;k++){const b=Math.random()*6.283;pt.push({x:h.x,y:h.y,vx:Math.cos(b)*90,vy:Math.sin(b)*60-40,l:.45,c:k%2?'#5a4a38':'#7a6a50'})}for(const q of PL)if(alive(q)&&Math.hypot(q.x-h.x,q.y-h.y)<34){hitP(q,1,null);q.root=Math.max(q.root||0,1.3);FT.push({x:q.x,y:q.y-40,t:'GRABBED!',c:'#9affb0',l:1})}}}GHH=GHH.filter(h=>h.t<h.W+h.B);
for(const g of GRN){g.t+=dt;if(g.t>=g.T+g.f&&!g.done){g.done=1;sfx('boom',g.tx,g.ty);shk=Math.max(shk,.5);rg.push({x:g.tx,y:g.ty,l:.5,m:.5,r:70,c:'#ff9a2e'});for(let k=0;k<30;k++){const b=Math.random()*6.283,v=60+Math.random()*220;pt.push({x:g.tx,y:g.ty,vx:Math.cos(b)*v,vy:Math.sin(b)*v,l:.6,c:k%3?'#ff9a2e':k%2?'#ffd84a':'#7a7a7a'})}for(const q of PL)if(alive(q)&&Math.hypot(q.x-g.tx,q.y-g.ty)<70)hitP(q,2,Math.atan2(q.y-g.ty,q.x-g.tx))}}GRN=GRN.filter(g=>!g.done);
for(const q of PL)if(q.root>0)q.root-=dt}
// ----- drawing -----
function ghDraw(z){const t=performance.now()/1000,b=Math.sin(t*3+(z.bob||0))*4,x=Math.round(z.x),y=Math.round(z.y-14+b),fl=Math.cos(Math.atan2(P.y-z.y,P.x-z.x))<0?-1:1;
X.fillStyle='rgba(0,0,0,.18)';X.beginPath();X.ellipse(z.x,z.y+8,9,3,0,0,7);X.fill();X.globalAlpha=.78;X.fillStyle='#16111c';X.beginPath();X.arc(x,y-6,12,Math.PI,0);X.lineTo(x+12,y+12);for(let i=0;i<4;i++)X.lineTo(x+12-i*8-4,y+(i%2?8:14)+Math.sin(t*6+i)*2);X.lineTo(x-12,y+12);X.closePath();X.fill();
X.fillStyle='#e8f0f4';X.beginPath();X.arc(x,y-6,10,Math.PI,0);X.lineTo(x+10,y+10);for(let i=0;i<4;i++)X.lineTo(x+10-i*6.7-3.3,y+(i%2?6:12)+Math.sin(t*6+i)*2);X.lineTo(x-10,y+10);X.closePath();X.fill();X.globalAlpha=1;
X.fillStyle='#16111c';X.fillRect(x+fl*2-4,y-9,3,5);X.fillRect(x+fl*2+2,y-9,3,5);X.fillRect(x+fl*2-2,y-1,4,4)}
function svBike(z,fy,fl,t,k){const x=Math.round(z.x),y=Math.round(fy),mv=z.mvg||z.rm>0,g=(c,x0,y0,w,h)=>{X.fillStyle=c;X.fillRect(x+fl*x0-(fl<0?w:0),y+y0,w,h)};
const wheel=cx=>{X.fillStyle='#16111c';X.beginPath();X.arc(x+fl*cx,y-9,10,0,7);X.fill();X.fillStyle='#3a3a42';X.beginPath();X.arc(x+fl*cx,y-9,7,0,7);X.fill();X.fillStyle='#c8ccd4';X.beginPath();X.arc(x+fl*cx,y-9,3,0,7);X.fill();if(mv){X.fillStyle='#8a8a92';const a=t*20;X.fillRect(x+fl*cx+Math.cos(a)*5-1,y-9+Math.sin(a)*5-1,2,2)}};
wheel(-22);wheel(24);g('#16111c',-24,-22,52,8);g('#26262c',-20,-20,44,5);g('#c8ccd4',-6,-16,16,8);g('#9aa0aa',-4,-14,12,4);g('#16111c',-26,-12,10,3);g('#c8ccd4',-32,-11,14,3);
g('#16111c',2,-30,22,10);g('#e07a1a',3,-29,20,8);g('#ffb02e',5,-28,8,2);g('#c0392b',14,-27,6,4);g('#16111c',-14,-28,18,6);g('#3a2a1a',-13,-27,16,4);
g('#16111c',22,-38,3,18);g('#c8ccd4',20,-40,8,3);g('#fff4c0',27,-28,4,4);if(z.rm>0){X.globalAlpha=.25;X.fillStyle='#fff4c0';X.beginPath();X.moveTo(x+fl*30,y-27);X.lineTo(x+fl*80,y-40);X.lineTo(x+fl*80,y-12);X.fill();X.globalAlpha=1}
svBody(12,x-fl*4,y-6+(mv?Math.round(Math.sin(t*20)):0),fl,0,k,z.fa,{clip:.6})}
function svExtra3(){const t=performance.now()/1000;
for(const h of GHH){if(h.t<h.W){const u=h.t/h.W,pu=.5+.5*Math.sin(t*16);X.globalAlpha=.16+.12*pu;X.fillStyle='#7aff9a';X.beginPath();X.arc(h.x,h.y,34,0,7);X.fill();X.globalAlpha=.8;X.strokeStyle='#9affb0';X.lineWidth=2;X.beginPath();X.arc(h.x,h.y,34*(.3+.7*u),0,7);X.stroke();X.globalAlpha=1;X.fillStyle='#3a2a1a';for(let i=0;i<5;i++)X.fillRect(h.x-12+i*6,h.y-1+Math.sin(i*2.1)*3,4,2)}
else{const u=Math.min(1,(h.t-h.W)/.18),f=1-Math.max(0,(h.t-h.W-h.B+.25)/.25);X.globalAlpha=Math.max(0,f);for(const[dx,s]of[[-10,1],[8,-1]]){const hx=h.x+dx,hy=h.y,L=26*u;X.fillStyle='#16111c';X.fillRect(hx-4,hy-L,8,L);X.fillStyle='#c8e8c8';X.fillRect(hx-3,hy-L,6,L);for(let k=0;k<4;k++){X.fillStyle='#16111c';X.fillRect(hx-5+k*3,hy-L-8,3,9);X.fillStyle='#c8e8c8';X.fillRect(hx-4+k*3,hy-L-7,2,8)}X.fillStyle='#16111c';X.fillRect(hx+s*4,hy-L-2,4,3)}X.globalAlpha=1;X.fillStyle='#3a2a1a';X.beginPath();X.ellipse(h.x,h.y,22,7,0,0,7);X.fill()}}
for(const q of PL)if(q.root>0&&alive(q)){const fy=q.y+16;for(const dx of[-8,7]){X.fillStyle='#16111c';X.fillRect(q.x+dx-3,fy-12,7,12);X.fillStyle='#c8e8c8';X.fillRect(q.x+dx-2,fy-11,5,11)}}
for(const g of GRN){const u=Math.min(1,g.t/g.T),gx=g.sx+(g.tx-g.sx)*u,gy=g.sy+(g.ty-g.sy)*u-Math.sin(Math.PI*u)*70;if(u>=1){const pu=.5+.5*Math.sin(t*18),k=(g.t-g.T)/g.f;X.globalAlpha=.15+.15*pu;X.fillStyle='#ff4a2a';X.beginPath();X.arc(g.tx,g.ty,70,0,7);X.fill();X.globalAlpha=.8;X.strokeStyle='#ff6a3a';X.lineWidth=2;X.beginPath();X.arc(g.tx,g.ty,70*(1-k*.7),0,7);X.stroke();X.globalAlpha=1}
X.fillStyle='#16111c';X.fillRect(gx-5,gy-6,10,11);X.fillStyle='#4a5a32';X.fillRect(gx-4,gy-5,8,9);X.fillStyle='#8a8a92';X.fillRect(gx-2,gy-8,4,3);if(u>=1&&Math.floor(t*10)%2){X.fillStyle='#ff4a2a';X.fillRect(gx-1,gy-10,2,2)}}}

