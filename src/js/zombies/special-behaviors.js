//# zombies/special-behaviors.js — Exploder, Healer and Rotwood behavior and drawing, split-screen kill cash
// ---- Exploder and Healer behavior (called from the zombie update; returns [angle, speed mult, removed]) ----
function zBeh(z,T,dt,a,m){const d=Math.hypot(P.x-z.x,P.y-z.y);
 if(z.t==18){if(z.fu>0){z.fu-=dt;m=.35;if(z.fu<=0){zBlow(z);return[a,0,1]}}
  else if(alive(P)&&d<ZX.trig){z.fu=ZX.fuse;sfx('dashwarn',z.x,z.y)}return[a,m,0]}
 if(z.t==19){z.hx=Math.max(0,(z.hx||0)-dt);z.hc=(z.hc??(2+Math.random()*2))-dt;
  let al=0;for(const o of zs)if(o!==z&&o.hp>0&&o.t!=19&&ZC[o.t]&&Math.abs(o.x-z.x)<260&&Math.abs(o.y-z.y)<260){al=1;break}
  if(al&&alive(P)){if(d<ZH.keep-10){a=Math.atan2(z.y-P.y,z.x-P.x);m=.7}else if(d<ZH.keep+50&&los(z,P))m=0}
  if(z.hx>0)m=0;if(z.hc<=0)z.hc=zHeal(z)?ZH.every:1;return[a,m,0]}
 if(z.t==20){z.tc=(z.tc??1)-dt;z.ts=z.ts||0;
  if(z.ts==1){m=0;z.tt-=dt;if(z.tt<=0){z.ts=2;z.tt=.3;zSwing(z)}}
  else if(z.ts==2){m=0;z.tt-=dt;if(z.tt<=0){z.ts=3;z.tt=.45}}
  else if(z.ts==3){m=.2;z.tt-=dt;if(z.tt<=0){z.ts=0;z.tc=ZR.cd}}
  else if(alive(P)&&d<ZR.reach&&z.tc<=0){z.ts=1;z.tt=ZR.wind;z.ta=Math.atan2(P.y-z.y,P.x-z.x);sfx('roar',z.x,z.y,.6)}
  return[a,m,0]}
 return[a,m,0]}
// Rotwood's branch: hits every player inside the swing arc
function zSwing(z){sfx('club',z.x,z.y);shk=Math.max(shk,.12);let n=0;for(const q of PL){if(!alive(q))continue;const d=Math.hypot(q.x-z.x,q.y-z.y);if(d>ZR.reach+12)continue;const da=Math.abs(Math.atan2(Math.sin(Math.atan2(q.y-z.y,q.x-z.x)-z.ta),Math.cos(Math.atan2(q.y-z.y,q.x-z.x)-z.ta)));if(da>ZR.arc/2&&d>18)continue;if(q.inv>0)continue;hitP(q,ZR.dmg,Math.atan2(q.y-z.y,q.x-z.x));n++}
 for(let i=0;i<10;i++){const a=z.ta+(Math.random()-.5)*ZR.arc,v=60+Math.random()*120;pt.push({x:z.x+Math.cos(a)*ZR.reach*.7,y:z.y+Math.sin(a)*ZR.reach*.7,vx:Math.cos(a)*v,vy:Math.sin(a)*v-30,l:.5,c:i%3?'#5a8a3a':'#c8763a'})}return n}
function zHeal(h){let n=0;for(const o of zs){if(o===h||!(o.hp>0)||!ZC[o.t]||Math.hypot(o.x-h.x,o.y-h.y)>ZH.r)continue;const mx=o.m0||o.hp;if(o.hp>=mx)continue;o.hp=Math.min(mx,o.hp+mx*ZH.pct);o.hg=ZH.glow;n++}
 if(n){h.hx=.6;sfx('heal',h.x,h.y,.6);rg.push({x:h.x,y:h.y,l:.6,m:.6,r:ZH.r,c:'#ffd84a'});for(let i=0;i<10;i++){const a=Math.random()*6.283;pt.push({x:h.x,y:h.y-14,vx:Math.cos(a)*70,vy:Math.sin(a)*70-30,l:.5,c:i%2?'#ffe27a':'#fff6c0'})}}return n}
// the Exploder reached a player: it bursts and hurts every player close by
function zBlow(z){z.hp=0;z.bl=1;sfx('boom',z.x,z.y);shk=Math.max(shk,.25);rg.push({x:z.x,y:z.y,l:.4,m:.4,r:ZX.rad,c:'#ff7a2a'});
 for(let i=0;i<30;i++){const a=Math.random()*6.283,v=60+Math.random()*220;pt.push({x:z.x,y:z.y,vx:Math.cos(a)*v,vy:Math.sin(a)*v,l:.5,c:i%3?'#ff9a2e':i%2?'#ffd84a':'#c8553a'})}
 const P0=P;for(const q of PL){if(!alive(q)||Math.hypot(q.x-z.x,q.y-z.y)>=ZX.rad||q.inv>0)continue;P=q;P.hp-=arm(ZX.dmg*(S.df?2:1));P.inv=.8;if(P.hp<=0&&ded())pend=1}P=P0}
// shot before it reached anyone: a smaller pop that only hurts other zombies
function zPop(z){if(z.bl)return;z.bl=1;boom(z.x,z.y,2)}
// ---- split-screen: every player earns the cash for every kill ----
function zCash(T){const P0=P,v=T.v*(S.df?2:1);if(MPn>1){for(const q of PL){P=q;P.cash+=Math.round(v*(1+.05*rk('cash'))*(sPk(P,16)?1.2:1))}P=P0}else P.cash+=Math.round(v*(1+.05*rk('cash'))*(sPk(P,16)?1.2:1))}

// ---- drawing: healed zombies glow yellow, a lit Exploder flashes ----
const _zDr0=zDr;zDr=function(z){_zDr0(z);const T=ZT[z.t];if(!T||T.boss||T.sv||T.gh)return;const t=performance.now()/1000;
 if(z.hg>0){const k=Math.min(1,z.hg)*(.75+.25*Math.sin(t*8+(z.ph||0))),r=Math.max(18,T.r*2.6),cy=z.y-4-(z.hv||0)-(z.alt||0);X.save();X.globalCompositeOperation='lighter';const g=X.createRadialGradient(z.x,cy,0,z.x,cy,r);g.addColorStop(0,'rgba(255,226,90,'+(.6*k)+')');g.addColorStop(.6,'rgba(255,210,60,'+(.25*k)+')');g.addColorStop(1,'rgba(255,200,40,0)');X.fillStyle=g;X.beginPath();X.arc(z.x,cy,r,0,7);X.fill();X.restore()}
 if(z.t==20&&z.ts==1){const u=1-z.tt/ZR.wind;X.save();X.globalAlpha=.12+.3*u;X.fillStyle='#ff7a2a';X.beginPath();X.moveTo(z.x,z.y);X.arc(z.x,z.y,ZR.reach,z.ta-ZR.arc/2,z.ta+ZR.arc/2);X.closePath();X.fill();X.globalAlpha=.5+.4*u;X.strokeStyle='#ffb070';X.lineWidth=2;X.beginPath();X.arc(z.x,z.y,ZR.reach,z.ta-ZR.arc/2,z.ta+ZR.arc/2);X.stroke();X.restore()}
 if(z.t==18&&z.fu>0){const u=1-z.fu/ZX.fuse,b=Math.floor(t*(10+u*16))%2;X.save();X.globalCompositeOperation='lighter';X.globalAlpha=b?.6:.25;X.fillStyle=b?'#fff0c0':'#ff5a2a';X.beginPath();X.arc(z.x,z.y-4,12+u*7,0,7);X.fill();X.restore();X.save();X.globalAlpha=.25+.35*u;X.strokeStyle='#ff7a2a';X.lineWidth=2;X.setLineDash&&X.setLineDash([6,5]);X.beginPath();X.arc(z.x,z.y,ZX.rad,0,7);X.stroke();X.restore()}}

