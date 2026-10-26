//# game/update.js — The main per-frame game update (zombies, bullets, waves)
function upd(dt){if(bossQ>=0){const P0=P;P=rndAlive();spawnZ(bossQ);if(MPn>=3){const o=[6,7,8,12,13].filter(t=>t!=bossQ);{const e=WRC&&WRC.x!=null?WRC.x:o[Math.random()*o.length|0];if(WRC)WRC.x=e;spawnZ(e)}}P=P0;bossQ=-1;sfx('horn')}
banner-=dt;ft-=dt;svTick(dt);LLB-=dt;if(ft<=0){flow();ft=.15}
for(const p of PL){P=p;if(updP(dt)){over();return}}P=PL[0];if(MPn&&!PL.some(alive)){over();return}
spT-=dt;if(toSp>0&&spT<=0&&zs.length<ZCAP()){const P0=P;P=rndAlive();const ok=spawnZ();P=P0;if(ok){spT=Math.max(.25,1.1-wave*.06)/(MPn?1+.4*(MPn-1):1);toSp--}else{spT=.3;ZD.wt+=.3}}
for(const q of pd)q.l-=dt;pd=pd.filter(q=>q.l>0);for(const q of fr)q.l-=dt;fr=fr.filter(q=>q.l>0);
for(const p of ep){if(p.k==3)pt.push({x:p.x,y:p.y,vx:0,vy:-20,l:.25,c:'#ff9a2e'});for(let k=0;k<2;k++){p.x+=p.vx*dt/2;p.y+=p.vy*dt/2;if(wlAt(p.x,p.y).some(w=>w[4]!=2&&p.x>w[0]&&p.x<w[0]+w[2]&&p.y>w[1]&&p.y<w[1]+w[3]))p.l=0}p.l-=dt;
if(p.l>0)for(const q of PL){if(!alive(q)||Math.hypot(p.x-q.x,p.y-q.y)>=(p.big?20:10))continue;P=q;p.l=0;if(P.inv<=0&&Math.random()<.05*rk('rng')){FT.push({x:P.x,y:P.y-30,t:'SHRUGGED OFF',c:'#9be860',l:.9});P.inv=.3}else{if(p.k==3){P.bn=3;P.bt=1.5*(1+.1*rk('haz'))}}if(P.inv<=0){P.hp-=arm(S.df?2:1);P.inv=.8;if(P.hp<=0&&ded()){over();return}}break}}
for(const p of ep){if(p.l<=0&&p.k==2)pd.push({x:p.x,y:p.y,l:5,m:5});else if(p.l<=0&&p.k==3)fr.push({x:p.x,y:p.y,l:5,m:5})}ep=ep.filter(p=>p.l>0);
for(const z of zs){P=tgt(z);const T=ZT[z.t];if(T.sv){svUpd(z,T,dt);continue}if(z.hg>0){z.hg-=dt;if(Math.random()<dt*5)pt.push({x:z.x+rnd(-8,8),y:z.y-6-rnd(0,14),vx:0,vy:-36,l:.5,c:'#ffe27a'})}let a=T.gh?Math.atan2(P.y-z.y,P.x-z.x):dirTo(z),m=1;z.vt=(z.vt??rnd(.5,4))-dt;if(z.vt<=0){z.vt=z.t==14?rnd(.4,.8):rnd(3,8);zvoice(z)}
if(z.t==14){z.es=z.es??0;z.ec=(z.ec??0)-dt;z.hv=7+Math.sin(performance.now()/180+(z.ph||0))*2;
if(z.es==1){m=0;z.kx=z.ky=0;z.x=P.x+Math.cos(P.a+2.4)*9;z.y=P.y-14;z.et-=dt;z.tk-=dt;
if(z.tk<=0){z.tk+=1;sfx('chomp');P.hp-=arm(S.df?2:1);pt.push({x:P.x,y:P.y-8,vx:(Math.random()-.5)*120,vy:-60,l:.4,c:'#b32f2f'});if(P.hp<=0&&ded())pend=1}
if(z.es==1&&z.et<=0){z.es=2;z.pt=1.8;z.pa=Math.atan2(z.y-P.y,z.x-P.x)+(Math.random()-.5);z.ec=3;P.eat=null}}
else if(z.es==2){a=z.pa;z.pt-=dt;if(z.pt<=0)z.es=0}
else{a=Math.atan2(P.y-z.y,P.x-z.x);if(Math.hypot(P.x-z.x,P.y-z.y)<16){if(!P.eat&&z.ec<=0){z.es=1;z.et=2;z.tk=1;P.eat=z;sfx('chomp')}else{z.es=2;z.pt=1.4;z.pa=a}}}}
if(z.t==3){z.dc=(z.dc||0)-dt;if(z.ds==1){m=0;a=Math.atan2(P.y-z.y,P.x-z.x);z.da=a;z.dt-=dt;if(z.dt<=0){z.ds=2;z.dt=.35;sfx('swoosh',z.x,z.y)}}
else if(z.ds==2){a=z.da;m=7;z.dt-=dt;if(z.dt<=0){z.ds=0;z.dc=2.2}}
else{const d=Math.hypot(P.x-z.x,P.y-z.y);if(d<170&&d>40&&z.dc<=0&&los(z,P)){z.ds=1;z.dt=.45;sfx('dashwarn',z.x,z.y)}}}
if(z.t>=9){const d=Math.hypot(P.x-z.x,P.y-z.y),sg=los(z,P);z.cd=(z.cd??(1+Math.random()*1.5))-dt;
if(z.t==9){if(sg&&d<320){if(d<120){a=Math.atan2(z.y-P.y,z.x-P.x);m=.6}else m=0;if(z.cd<=0){z.cd=2.2;shoot(z,1)}}}
else if(z.t==11){if(sg&&d<340){if(d<150){a=Math.atan2(z.y-P.y,z.x-P.x);m=.7}else m=0;if(z.cd<=0){z.cd=2.6;spit(z)}}}}
if(z.t==18||z.t==19||z.t==20){const r=zBeh(z,T,dt,a,m);a=r[0];m=r[1];if(r[2])continue}
if(T.boss){const d=Math.hypot(P.x-z.x,P.y-z.y),sg=los(z,P);z.cd=(z.cd??1.5)-dt;
if(z.t==6){z.s2=(z.s2??3)-dt;if(z.s2<=0&&zs.length+nq.length<28+12*Math.max(0,MPn-1)){z.s2=5;sfx('horn',z.x,z.y,.5);nq.push(mk(1,z.x-20,z.y+22),mk(1,z.x+20,z.y+22))}}
else if(z.t==7){z.ks=z.ks??0;z.kt=(z.kt??2.5)-dt;
if(z.ks==1){m=0;a=Math.atan2(P.y-z.y,P.x-z.x);z.da=a;if(z.kt<=0){z.ks=2;z.kt=.8}}
else if(z.ks==2){a=z.da;m=2.4;if(z.kt<=0){z.ks=3;z.kt=.9}}
else if(z.ks==3){m=0;if(z.kt<=0){z.ks=0;z.kt=4+Math.random()*3}}
else if(sg&&d<380){z.wt=(z.wt??0)-dt;if(z.wt<=0){z.wt=.8+Math.random()*1.2;z.wa=d>260?Math.atan2(P.y-z.y,P.x-z.x)+(Math.random()-.5)*1.6:Math.random()*6.283}a=z.wa;m=.8;
if(z.cd<=0){z.cd=z.hp<z.mh/2?1.1:1.7;shoot(z,0)}if(z.kt<=0&&d>90){z.ks=1;z.kt=.7;sfx('kong',z.x,z.y)}}}
else if(z.t==12){z.br=(z.br??0)-dt;z.ft=(z.ft??6)-dt;
if(z.lp){const L=z.lp;L.t+=dt;const u=Math.min(1,L.t/L.T);z.x=L.sx+(L.dx-L.sx)*u;z.y=L.sy+(L.dy-L.sy)*u;z.alt=70*Math.min(1,u*6,(1-u)*6);m=0;if(u>=1){z.lp=null;z.alt=0;slam(z.x,z.y,110,2);z.ft=7+Math.random()*4;z.cd=1}}
else{if(sg&&d<440)m=d<230?0:.5;if(d>520)z.ft=Math.min(z.ft,.4);if(z.cd<=0&&sg&&d<470){z.cd=z.hp<z.mh/2?1.8:2.5;z.br=.45;breathe(z)}if(z.ft<=0){z.ft=7+Math.random()*4;leap(z,520)}}}
else if(z.t==13){z.ot=(z.ot??0)-dt;z.jt=(z.jt??5)-dt;z.os=z.os??0;
if(z.lp){const L=z.lp;L.t+=dt;const u=Math.min(1,L.t/L.T);z.x=L.sx+(L.dx-L.sx)*u;z.y=L.sy+(L.dy-L.sy)*u;z.alt=90*Math.min(1,u*5,(1-u)*5);m=0;if(u>=1){z.lp=null;z.alt=0;slam(z.x,z.y,120,2);z.os=0;z.ot=.7;z.jt=7+Math.random()*4}}
else if(z.os==3){m=0;if(z.ot<=0){z.os=4;leap(z,380)}}
else if(z.os==1){m=0;if(z.ot<=0){z.os=2;z.ot=.35;sfx('club',z.x,z.y);for(const q of PL){if(!alive(q)||Math.hypot(q.x-z.x,q.y-z.y)>=115||q.inv>0)continue;const P0=P;P=q;P.hp-=arm(3*(S.df?2:1));P.inv=.8;if(P.hp<=0&&ded())pend=1;P=P0}}}
else if(z.os==2){m=0;if(z.ot<=0){z.os=0;z.ot=.6}}
else{z.os=0;if(d<95&&z.ot<=0){z.os=1;z.ot=.7;sfx('ogre',z.x,z.y)}else if(z.jt<=0&&d>150){z.os=3;z.ot=.5}}}
else{z.hf=(z.hf??0)-dt;z.sw=(z.sw??.5)-dt;
if(d<110){m=0;if(z.sw<=0){z.sw=1;z.hf=.25;sfx('swipe',z.x,z.y);if(d<120&&P.inv<=0){P.hp-=arm(2*(S.df?2:1));P.inv=.8;if(P.hp<=0&&ded()){over();return}}}}
else if(sg&&d<440){if(d<200){a=Math.atan2(z.y-P.y,z.x-P.x);m=.5}else m=0;if(z.cd<=0){z.cd=z.hp<z.mh/2?.8:1.13;shoot(z,1)}}}}
if(!alive(P)){m=Math.min(m,.3)}
if(z.fz>0){z.fz-=dt;m*=.5}z.x+=Math.cos(a)*T.sp*m*dt*(S.df?1.5:1)*DSP()*(z.spm||1)+z.kx*dt;z.y+=Math.sin(a)*T.sp*m*dt*(S.df?1.5:1)*DSP()*(z.spm||1)+z.ky*dt;z.kx*=.85;z.ky*=.85;z.un=Math.max(0,(z.un||0)-dt);z.sc=(z.sc||0)+dt;if(z.sc>.9){if(z.lx!=null&&Math.hypot(z.x-z.lx,z.y-z.ly)<5&&Math.hypot(P.x-z.x,P.y-z.y)>(T.cr||T.r)+40&&!z.lp&&z.ks!=1&&z.ds!=1&&!(z.os>0))z.un=.7;z.sc=0;z.lx=z.x;z.ly=z.y}if(!(z.alt>4)&&z.t!=14&&!T.gh)push(z,z.un>0?6:Math.min(T.r,22));
if(alive(P)&&Math.hypot(P.x-z.x,P.y-z.y)<(T.cr||T.r)+8&&P.inv<=0&&!(z.alt>4)&&z.t!=14){if(sPk(P,5)&&!T.boss){const a=Math.atan2(z.y-P.y,z.x-P.x);z.kx=Math.cos(a)*420;z.ky=Math.sin(a)*420;sfx('club',z.x,z.y)}P.hp-=arm((T.boss?2:1)*(S.df?2:1));P.inv=.8;if(P.hp<=0&&ded()){over();return}}}
for(const b of bs){P=b.o||PL[0];KG=b.g??-1;let hit=0;const ox=b.px??b.x,oy=b.py??b.y;b.px=b.py=undefined;for(let k=0;k<2&&!hit;k++){b.x+=b.vx*dt/2;b.y+=b.vy*dt/2;if(wlAt(b.x,b.y).some(w=>w[4]!=2&&b.x>w[0]&&b.x<w[0]+w[2]&&b.y>w[1]&&b.y<w[1]+w[3]))hit=1}b.l-=dt;
if(b.rk)pt.push({x:b.x,y:b.y,vx:0,vy:0,l:.3,c:'#999'});
if(!hit)for(const z of bHitOrd(b,ox,oy))if(z.hp>0&&z!==b.hz&&(z.tk?(tkIn(z,b.x,b.y,3)||tkIn(z,(ox+b.x)/2,(oy+b.y)/2,3)||tkIn(z,ox,oy,3)):svSegD(z.x,z.y,ox,oy,b.x,b.y)<(z.hr||ZT[z.t].hr||ZT[z.t].r)+3)&&!(z.alt>4)){hit=1;if(!b.rk){hurt(z,b.d,b.vx*.15,b.vy*.15);if(b.cr){FT.push({x:z.x,y:z.y-18,t:'CRIT',c:'#ffcf40',l:.6});for(let q=0;q<5;q++)pt.push({x:z.x,y:z.y,vx:(Math.random()-.5)*160,vy:(Math.random()-.5)*160,l:.3,c:'#ffd84a'})}if(b.pc>0){b.pc--;b.hz=z;hit=0}};break}
if(hit||(b.l<=0&&b.rk)){if(b.rk)boom(b.x,b.y,b.d);if(b.ab)xbHit(b);b.l=0}}
ckUpd(dt);KG=-1;P=PL[0];pickups(dt);P=PL[0];if(pend){pend=0;over();return}zs.push(...nq);nq=[];bs=bs.filter(b=>b.l>0);zs=zs.filter(z=>z.hp>0);
for(const p of pt){p.x+=p.vx*dt;p.y+=p.vy*dt;p.l-=dt}pt=pt.filter(p=>p.l>0);if(LMX&&pt.length>260)pt.splice(0,pt.length-260);
if(TUT)tutUpd(dt);else if(KN){KN.t+=dt;if(KN.t>=5.5&&!KN.done){KN.done=1;campWin()}}else if(toSp==0&&zs.length==0&&bossQ<0){if(!(ET>0)){ET=15;for(const d of DR)d.l=Math.max(d.l,15.5);for(const p of PL)if(p.dn){p.dn=0;p.rv=0;p.hp=Math.max(1,Math.ceil(p.mx*.34));p.inv=2}}else{ET-=dt;if(ET<=0||(S.qs&&!DR.length&&ET<13.5)){ET=0;shop()}}}}
