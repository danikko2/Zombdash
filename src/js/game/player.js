//# game/player.js — Player input (keyboard, mouse, touch, controller) and player update
function inp(p){let mx=0,my=0,fire=false;
if(p.inp=='km'||p.inp=='any'){if(L){mx=L.x-L.ox;my=L.y-L.oy}if(keys.a)mx-=50;if(keys.d)mx+=50;if(keys.w)my-=50;if(keys.s)my+=50;
if(R){const dx=R.x-R.ox,dy=R.y-R.oy;if(Math.hypot(dx,dy)>10){p.a=Math.atan2(dy,dx);fire=true}}
else if(mouse.d||MSE.on){const v=MPn&&p.vp||{x:0,y:0,z:tutZ()},c=MPn&&p.cam||cam;p.a=Math.atan2((mouse.y-v.y)/v.z+c.y-p.y,(mouse.x-v.x)/v.z+c.x-p.x);if(mouse.d)fire=true}}
for(const q of GP){if(p.inp!='any'&&q.i!==p.inp)continue;const g=q.g,ax=g.axes[0]||0,ay=g.axes[1]||0,am=Math.hypot(ax,ay);
if(am>.22){const k=Math.min(1,(am-.22)/.68)*50/am;mx+=ax*k;my+=ay*k}if(q.b[12])my-=50;if(q.b[13])my+=50;if(q.b[14])mx-=50;if(q.b[15])mx+=50;
const rx=g.axes[2]||0,ry=g.axes[3]||0,rm=Math.hypot(rx,ry);if(rm>.3){p.a=Math.atan2(ry,rx);const tD=70+120*Math.min(1,(rm-.3)/.6);p.rtD=p.rtD?p.rtD+(tD-p.rtD)*.25:tD;p.rtW=performance.now();MSE.on=0}if(q.b[7]){fire=true;p.rtW=performance.now();MSE.on=0}
if(q.jp(2))amRel(p);if(q.jp(4)||q.jp(5)||q.jp(3)){const o=p.own.slice(),j=o.indexOf(p.cur);p.cur=o[(j+(q.jp(4)?-1:1)+o.length)%o.length];sfx('click')}}
if(p.root>0){mx=0;my=0}return{mx,my,fire}}
function updP(dt){if(P.dead)return 0;
if(P.dn){P.rt-=dt;let hel=null;for(const q of PL)if(q!==P&&alive(q)&&Math.hypot(q.x-P.x,q.y-P.y)<40){hel=q;break}P.rh=hel;
if(hel){P.rv+=dt/2.5;if(P.rv>=1){P.dn=0;P.rv=0;P.hp=Math.max(1,Math.ceil(P.mx*.34));P.inv=2;sfx('heal');FT.push({x:P.x,y:P.y-34,t:'REVIVED!',c:'#9be860',l:1.6})}}else P.rv=Math.max(0,P.rv-dt*.4);
if(P.dn&&P.rt<=0){P.dn=0;P.dead=1;sfx('splat',P.x,P.y);FT.push({x:P.x,y:P.y-34,t:pnm(P)+' IS OUT',c:'#ff5a4a',l:2.2})}return 0}
const I=inp(P);let mx=I.mx,my=I.my;
const m=Math.hypot(mx,my);P.mv=m>6;if(P.mv){P.st=(P.st??0)-dt;if(P.st<=0){P.st=.32/P.sp;sfx(surf(),null,null,MPn?.45:.9)}}else P.st=.08;if(m>0){const k=Math.min(m,50)/50/m;mx*=k;my*=k}
const sbk=P.sb>0?1.3:1;P.x=cl(P.x+mx*115*P.sp*sbk*dt,10,WW-10);P.y=cl(P.y+my*115*P.sp*sbk*dt,10,WH-10);push(P,9);
const fire=I.fire;
amTick(P,dt);for(let k=0;k<P.cds.length;k++)P.cds[k]-=dt;P.inv-=dt;P.sb=(P.sb||0)-dt;P.fk=(P.fk||0)-dt;P.dd=Math.max(0,(P.dd||0)-dt);
if(fire&&P.cds[P.cur]<=0&&ckOK(P)&&amUse(P)){const w=WP[P.cur],v=w.bv||(w.rk?300:w.lz?900:480),mz=muzzle();P.cds[P.cur]=w.r*(1-.03*rk('rof'))*wlR(P,P.cur)*(sPk(P,2)&&P.cur==CH[2].w?1/1.5:1)*(sPk(P,12)&&P.cur==1?.87:1)*(CH[P.ci||0].dw&&P.cur==0?.5:1);P.dwk=!P.dwk;P.fk=.07;sfx(CLV()&&P.cur<2?['laser','lminigun'][P.cur]:FSN[P.cur],null,null,(P.cur==1||P.cur==8||P.cur==10?.8:1)*.5*(MPn?.7:1),P.cur==8||P.cur==10?.055:0);if(P.eat&&P.eat.hp>0&&!w.ck&&!w.zl&&!w.lh)KG=P.cur,hurt(P.eat,w.d*(P.dd>0?2:1),0,0);if(w.ck)ckFire(P,mz,P.a);else if(w.zl)drFire(P,mz,P.a);else if(w.lh)lsFire(P,mz,P.a);else for(let i=0;i<w.p+(sPk(P,9)&&P.cur==2?2:0);i++){const a=P.a+(Math.random()-.5)*w.sp*2*(w.p==1?1-.08*rk('stb'):1),cr=Math.random()<.03*rk('crt')||(sPk(P,8)&&P.cur==0&&Math.random()<.15);bs.push({px:P.x,py:P.y-8,x:mz.x,y:mz.y,vx:Math.cos(a)*v,vy:Math.sin(a)*v,l:w.bl||(w.rk?1.5:w.lz?.5:.7),d:w.d*wlD(P,P.cur)*(P.dd>0?2:1)*(cr?1.5+.25*rk('cdm'):1),cr,rk:w.rk,lz:w.lz,ab:w.ab,lv:CLV(),dd:P.dd>0,o:P,g:P.cur,pc:sPk(P,6)&&(w.lz||CLV())?1:0})}}
let on=0;for(const q of pd){if(((P.x-q.x)/24)**2+((P.y+8-q.y)/15)**2<1)on=1}
if(on){P.pt=(P.pt??0)-dt;if(P.pt<=0){P.pt=1.5*(1+.1*rk('haz'));P.hp-=arm(S.df?2:1);if(P.hp<=0&&ded())return 1}}else P.pt=0;
if(P.dn)return 0;
let onF=0;for(const q of fr){if(((P.x-q.x)/24)**2+((P.y+8-q.y)/15)**2<1)onF=1}
if(onF){if(!(P.bn>0))P.bt=0;P.bn=3}else if(P.bn>0)P.bn-=dt;
if(P.bn>0){P.bt=(P.bt??0)-dt;if(P.bt<=0){P.bt=1.5*(1+.1*rk('haz'));P.hp-=arm(S.df?2:1);if(P.hp<=0&&ded())return 1}}
if(P.eat&&(P.eat.hp<=0||!zs.includes(P.eat)))P.eat=null;
return 0}
