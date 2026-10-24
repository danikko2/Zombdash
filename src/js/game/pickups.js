//# game/pickups.js — Items on the ground, pickups, floating text
let DR=[],FT=[];
function drop0(z,T){if(DR.length>=6&&!T.boss)return;const add=(k,a)=>DR.push({x:z.x+rnd(-10,10),y:z.y+rnd(-6,6),k,a,l:14,ph:Math.random()*6});amDrop(z,T,add);
if(T.boss){add('cash');add('hp');return}if(Math.random()>(z.t==5?.035:.07)*(1+.08*rk('luck')))return;const r=Math.random();add(r<.48?'cash':r<.70?'dd':'hp')}
function pickups(dt){for(const d of DR){d.l-=dt;if(d.l<=0)continue;for(const p of PL){if(!alive(p))continue;P=p;if(Math.hypot(P.x-d.x,P.y-d.y)<24*(1+.15*rk('mag'))){d.l=0;chEv(P,'drop',1);
if(d.k=='cash'){const v=(DROPG.cb+wave*DROPG.cw)*(S.df?2:1);if(MPn)for(const q of PL)q.cash=(q.cash||0)+v;else P.cash+=v;FT.push({x:d.x,y:d.y-14,t:'+$'+v+(MPn>1?' EVERYONE':''),c:'#5ae05a',l:1.4});sfx('coin')}
else if(d.k=='am')amPick(d);else if(d.k=='dd'){P.dd=DROPG.dds;FT.push({x:d.x,y:d.y-14,t:'2X DAMAGE',c:'#ffd84a',l:1.2});sfx('power')}
else{const h=P.hp<P.mx;if(h)P.hp=Math.min(P.mx,P.hp+DROPG.hp);P.php=P.hp;FT.push({x:d.x,y:d.y-14,t:h?'+1 HP':'FULL HP',c:'#ff6a5c',l:1.2});sfx('heal')}break}}}DR=DR.filter(d=>d.l>0);for(const f of FT){f.l-=dt;f.y-=24*dt}FT=FT.filter(f=>f.l>0)}
function drawDrops(){const t=performance.now()/1000,PX='"Press Start 2P", ui-monospace, monospace';
for(const d of DR){if(d.l<3&&Math.floor(t*8)%2)continue;const b=Math.sin(t*3+d.ph)*3,y=d.y-14+b,c=d.k=='am'?AMI[d.a||'pa'].c:d.k=='cash'?'#5ae05a':d.k=='dd'?'#ffd84a':'#ff5a4a';
X.fillStyle='rgba(0,0,0,.3)';X.beginPath();X.ellipse(d.x,d.y+2,9-b*.6,3,0,0,7);X.fill();X.globalAlpha=.22+.12*Math.sin(t*5+d.ph);X.fillStyle=c;X.beginPath();X.arc(d.x,y,15,0,7);X.fill();X.globalAlpha=1;
if(d.k=='am')amDrawDrop(d,y);else if(d.k=='hp'){X.save();X.translate(d.x,y);X.scale(1.4,1.4);heart(-7,-6,1);X.restore()}else{X.font=(d.k=='cash'?'16px ':'12px ')+PX;X.textAlign='center';X.textBaseline='middle';X.lineWidth=4;X.strokeStyle='#070a08';const s=d.k=='cash'?'$':'2x';X.strokeText(s,d.x,y+1);X.fillStyle=c;X.fillText(s,d.x,y+1);X.textBaseline='alphabetic'}}
if(!cmLtOn())ftTexts()}
// floating texts (+1 HP, FROZEN...); on a custom map with time-of-day lighting they are drawn after the lighting, so they stay readable
function ftTexts(){X.font='18px VT323, ui-monospace, monospace';X.textAlign='center';for(const f of FT){X.globalAlpha=Math.min(1,f.l*2);X.lineWidth=4;X.strokeStyle='#070a08';X.strokeText(f.t,f.x,f.y);X.fillStyle=f.c;X.fillText(f.t,f.x,f.y)}X.globalAlpha=1}
