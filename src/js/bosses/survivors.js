//# bosses/survivors.js — Survivor bosses: stats (SVS), shared AI, the first survivors, drawing
// ---------- campaign wave 20: the map's survivor fights you, then joins you ----------
let KN=null,RH=null,SVB=0,CWIN=null,RKS=[];GHH=[];GRN=[];ICB=[];GCI=[];GCC=[];
// w: pi pistol · sg shotgun · smg · dp dual pistols. pd = preferred distance. h1 = first health bar (ship / horse)
const SVS={
1:{hp:720,sp:70,w:'pi',cd:.45,pd:200,lz:'#7ae8ff'},
2:{hp:540,sp:74,w:'sg',cd:1.45,pd:160,sv:340,sr:1.4},
3:{hp:440,sp:177,w:'smg',cd:1.35,pd:230},
4:{hp:520,sp:78,w:'sg',cd:1.13,pd:170},
5:{hp:560,sp:54,w:'sg',cd:1.6,pd:160},
6:{hp:260,sp:108,w:'smg',cd:1.25,pd:220,lz:'#9aff8a',h1:300,p1:"STEVE'S SHIP"},
7:{hp:735,sp:98,w:'smg',cd:1.3,pd:230,h1:420,p1:'JOHN · AIRBORNE'},
8:{hp:300,sp:84,w:'dp',cd:.3,pd:210,h1:260,p1:"HANK'S HORSE"},9:{hp:640,sp:92,w:'sg',cd:1.25,pd:170},10:{hp:420,sp:118,w:'pi',cd:.85,pd:220},11:{hp:560,sp:82,w:'sg',cd:1.35,pd:170,h1:340,p1:"THE HEADLESS HORSE"},12:{hp:760,sp:86,w:'smg',cd:1.5,pd:230},13:{hp:1250,sp:0,w:'smg',cd:2,pd:300},14:{hp:720,sp:150,w:'sg',cd:1.4,pd:150,h1:620,p1:'THE FIRE ENGINE'},15:{hp:560,sp:150,w:'pi',cd:.7,pd:220},16:{hp:700,sp:88,w:'sg',cd:1.25,pd:170,h1:560,p1:'THE POLICE CRUISER'}};
const SVL=["You're a great survivor.","I'd like to join you!"],SVL2=["You're a great survivor.","See you out there!"],SVK=1.35;
function svOK(x,y){if(x<50||y<50||x>WW-50||y>WH-50)return 0;try{if(!okPos(x,y))return 0}catch(e){}if(WL.some(w=>x>w[0]-18&&x<w[0]+w[2]+18&&y>w[1]-18&&y<w[1]+w[3]+18))return 0;if(fd&&gw&&fd.length){const c=fd[cl(y/gs|0,0,gh-1)*gw+cl(x/gs|0,0,gw-1)];if(c<0)return 0}return 1}
function svPt(cx,cy,r0,r1){for(let n=0;n<40;n++){const a=Math.random()*6.283,r=r0+Math.random()*(r1-r0),x=cx+Math.cos(a)*r,y=cy+Math.sin(a)*r;if(svOK(x,y))return{x,y}}return null}
function svSpawn(){const ci=cBossNow();if(ci==null||!SVS[ci])return;const D=SVS[ci],k=(S.df?1.8:1)*BMP(),Q=rndAlive()||PL[0];let p=svPt(Q.x,Q.y,280,420)||svPt(Q.x,Q.y,150,560);
if(!p){const s=HS.sp&&HS.sp[0];p=s?{x:s[0],y:s[1]}:{x:Q.x+220,y:Q.y}}
const z={x:p.x,y:p.y,t:15,ci,hp:(D.h1||D.hp)*k,k:0,kx:0,ky:0,spm:1,ph:D.h1?1:2,h2:D.hp*k,bn:D.h1?D.p1:CH[ci].n.toUpperCase(),fa:0,cd:1.6,ab:2.2,tr:[]};z.mh=z.hp;
if(ci==6){z.fly=1;z.hr=28}if(ci==8||ci==11)z.hr=22;if(ci==12)z.hr=20;if(ci==7)z.lift=34;if(ci==13||ci==14||ci==16){z.tk=1;z.hr=44;tkInit(z)}zs.push(z);SVB=1;nzn=CH[ci].n.toUpperCase()+' WILL NOT GO DOWN EASY';sfx('horn')}
function hitP(q,dm,a){if(!alive(q)||q.inv>0)return;const P0=P;P=q;P.hp-=arm(dm*(S.df?2:1));P.inv=.8;if(a!=null){P.x=cl(P.x+Math.cos(a)*24,10,WW-10);P.y=cl(P.y+Math.sin(a)*24,10,WH-10);push(P,9)}if(P.hp<=0&&ded())pend=1;P=P0}
function svShot(z,a,v,l){const c=SVS[z.ci].lz,lift=(z.fly?34:0)+(z.lift||0);ep.push({x:z.x+Math.cos(a)*16,y:z.y-6-lift*.5+Math.sin(a)*16,vx:Math.cos(a)*v,vy:Math.sin(a)*v,l,k:5,c:c||'#ffe27a',lz:!!c})}
function svFire(z,a){const D=SVS[z.ci],w=z.ph==1&&z.ci==6?'ship':D.w;
if(w=='sg'){for(let i=0;i<5;i++)svShot(z,a+(i-2)*.2+(Math.random()-.5)*.08,D.sv||300,D.sr||.75);sfx('shotgun',z.x,z.y,.7);z.cd=D.cd}
else if(w=='smg'){z.bq=z.ci==7?10:5;z.bt=0;z.cd=D.cd}
else if(w=='pi'){svShot(z,a,330,1.5);sfx(D.lz?'laser':'pistol',z.x,z.y,.7);z.cd=D.cd}
else if(w=='dp'){svShot(z,a+(Math.random()-.5)*.08,330,1.4);sfx('pistol',z.x,z.y,.6);z.cd=D.cd*(z.ph==1?1.15:1);z.dw=!z.dw}
else{for(let i=-1;i<=1;i++)svShot(z,a+i*.22,280,1.7);sfx('laser',z.x,z.y,.8);z.cd=1.1}}
function svKite(z,Q,d,sg,dt){const D=SVS[z.ci];z.st=(z.st??0)-dt;z.wt=(z.wt||0)-dt;if(z.st<=0||z.wallHit&&z.wt<=0){if(z.wallHit)z.wt=.9;z.st=1.2+Math.random()*1.8;z.sd=z.wallHit?-(z.sd||1):Math.random()<.5?-1:1}
const aw=Math.atan2(Q.y-z.y,Q.x-z.x);if(!sg||d>D.pd+80)return[dirTo(z),1];if(d<D.pd-70)return[aw+Math.PI+z.sd*.5,.85];return[aw+z.sd*Math.PI/2,.7]}
function svMove(z,a,v,dt,fly){const ox=z.x,oy=z.y;z.x+=Math.cos(a)*v*dt+z.kx*dt;z.y+=Math.sin(a)*v*dt+z.ky*dt;z.kx*=.85;z.ky*=.85;
if(fly){z.x=cl(z.x,40,WW-40);z.y=cl(z.y,40,WH-40)}else{push(z,13);z.x=cl(z.x,20,WW-20);z.y=cl(z.y,20,WH-20)}const ex=v*dt;z.wallHit=!fly&&ex>1.5&&Math.hypot(z.x-ox,z.y-oy)<ex*.35}
function svSegD(px,py,ax,ay,bx,by){const vx=bx-ax,vy=by-ay,L=vx*vx+vy*vy||1,u=cl(((px-ax)*vx+(py-ay)*vy)/L,0,1);return Math.hypot(px-ax-vx*u,py-ay-vy*u)}
function svUpd(z,T,dt){const Q=P,D=SVS[z.ci],t=performance.now()/1000;z.cd-=dt;z.iv=Math.max(0,(z.iv||0)-dt);z.ab-=dt;
const d=Math.hypot(Q.x-z.x,Q.y-z.y),sg=los(z,Q),aim=Math.atan2(Q.y-z.y,Q.x-z.x),can=()=>sg&&d<460&&alive(Q);if(!z.lk)z.fa=aim;let mv=null;
switch(z.ci){
case 2:{// Bill: dashes back and forth (still hittable)
if(z.ds>0){z.ds-=dt;mv=[z.da,560,0];z.tr.push({x:z.x,y:z.y,l:.22});if(z.ds<=0)z.ab=1.4+Math.random()*1.2}
else{const[a,m]=svKite(z,Q,d,sg,dt);mv=[a,D.sp*m,0];if(z.ab<=0&&d<440){z.ds=.24;z.dn=-(z.dn||1);z.da=aim+z.dn*Math.PI/2+(Math.random()-.5)*.5;sfx('swoosh',z.x,z.y)}if(z.cd<=0&&can())svFire(z,aim)}break}
case 3:{// Susie: force-field bubble, nothing gets through it
if(z.bb>0){z.bb-=dt;z.iv=Math.max(z.iv,.05)}else if(z.ab<=0&&d<520){z.bb=2.2;z.iv=2.2;z.ab=5+Math.random()*2;sfx('armor',z.x,z.y)}
const[a,m]=svKite(z,Q,d,sg,dt);mv=[a,D.sp*m,0];if(z.cd<=0&&can())svFire(z,aim);break}
case 1:{// Robot: telescoping punch
if(z.ps==1){z.pt-=dt;mv=[0,0,0];if(z.pt<=0){z.ps=2;z.pt=.2;sfx('swoosh',z.x,z.y)}}
else if(z.ps==2){z.pt-=dt;z.ext=cl(1-z.pt/.2,0,1);mv=[0,0,0];if(z.pt<=0){z.ps=3;z.pt=.4;z.ext=1;const fx=z.x+Math.cos(z.fa)*z.rch,fy=z.y-6+Math.sin(z.fa)*z.rch;sfx('club',fx,fy);shk=Math.max(shk,.2);for(const q of PL)if(alive(q)&&svSegD(q.x,q.y,z.x,z.y-6,fx,fy)<22)hitP(q,2,z.fa)}}
else if(z.ps==3){z.pt-=dt;z.ext=cl(z.pt/.4,0,1);mv=[0,0,0];if(z.pt<=0){z.ps=0;z.lk=0;z.ab=2.4+Math.random()*1.4}}
else{const[a,m]=svKite(z,Q,d,sg,dt);mv=[a,D.sp*m,0];if(z.ab<=0&&d<250&&sg){z.ps=1;z.pt=.55;z.fa=aim;z.lk=1;z.ext=0;z.rch=Math.min(270,d+40);sfx('dashwarn',z.x,z.y)}else if(z.cd<=0&&can())svFire(z,aim)}break}
case 5:{// Charles: leaps and slams down
if(z.jp){const J=z.jp;J.t+=dt;const u=Math.min(1,J.t/J.T);z.x=J.sx+(J.dx-J.sx)*u;z.y=J.sy+(J.dy-J.sy)*u;z.alt=95*Math.sin(Math.PI*u);if(u>=1){z.jp=null;z.alt=0;slam(z.x,z.y,85,2);z.ab=4.5+Math.random()*2;z.cd=.9}}
else{const[a,m]=svKite(z,Q,d,sg,dt);mv=[a,D.sp*m,0];if(z.ab<=0&&d<520){const p=svPt(Q.x,Q.y,0,36)||{x:Q.x,y:Q.y};z.jp={sx:z.x,sy:z.y,dx:p.x,dy:p.y,t:0,T:1.15};sfx('ogre',z.x,z.y)}else if(z.cd<=0&&can())svFire(z,aim)}break}
case 4:{// Tim: pulls out a great sword and charges
if(z.cs==1){z.ct-=dt;mv=[0,0,0];if(z.ct<=0){z.cs=2;z.ct=.85;sfx('swoosh',z.x,z.y)}}
else if(z.cs==2){z.ct-=dt;mv=[z.fa,440,0];for(const q of PL)if(alive(q)&&Math.hypot(q.x-z.x,q.y-z.y)<32)hitP(q,2,z.fa);if(z.ct<=0||z.wallHit){z.cs=3;z.ct=.9;if(z.wallHit){shk=Math.max(shk,.25);sfx('club',z.x,z.y)}}}
else if(z.cs==3){z.ct-=dt;mv=[0,0,0];if(z.ct<=0){z.cs=0;z.lk=0;z.ab=3.4+Math.random()*1.6}}
else{const[a,m]=svKite(z,Q,d,sg,dt);mv=[a,D.sp*m,0];if(z.ab<=0&&sg&&d<440&&d>60){z.cs=1;z.ct=.75;z.fa=aim;z.lk=1;sfx('dashwarn',z.x,z.y)}else if(z.cd<=0&&can())svFire(z,aim)}break}
case 6:{// Steve: flies his ship first, then fights on foot
if(z.ph==1){z.oa=(z.oa??Math.atan2(z.y-Q.y,z.x-Q.x))+dt*.75*(z.od||1);z.ot=(z.ot??3)-dt;if(z.ot<=0){z.ot=2.5+Math.random()*2;z.od=-(z.od||1)}
const R=200+40*Math.sin(t*.7),tx=Q.x+Math.cos(z.oa)*R,ty=Q.y+Math.sin(z.oa)*R;mv=[Math.atan2(ty-z.y,tx-z.x),Math.min(250,Math.hypot(tx-z.x,ty-z.y)*3),1];if(z.cd<=0&&d<540&&alive(Q))svFire(z,aim)}
else{const[a,m]=svKite(z,Q,d,sg,dt);mv=[a,D.sp*m,0];if(z.cd<=0&&can())svFire(z,aim)}break}
case 7:{// John phase 1: stays in the air, rips up chunks of ground and throws them
if(z.ph==1){z.gs=z.gs||0;
if(z.gs==0){z.oa=(z.oa??Math.atan2(z.y-Q.y,z.x-Q.x))+dt*.9*(z.od||1);z.ot=(z.ot??3)-dt;if(z.ot<=0){z.ot=2+Math.random()*2;z.od=-(z.od||1)}const R=230+30*Math.sin(t*.8),tx=Q.x+Math.cos(z.oa)*R,ty=Q.y+Math.sin(z.oa)*R;mv=[Math.atan2(ty-z.y,tx-z.x),Math.min(300,Math.hypot(tx-z.x,ty-z.y)*3),1];z.lift+=(34-z.lift)*Math.min(1,dt*4);if(z.ab<=0){const p=svPt(z.x,z.y,20,110);if(p){z.gs=1;z.gp=p}else z.ab=.5}}
else if(z.gs==1){const dd=Math.hypot(z.gp.x-z.x,z.gp.y-z.y);mv=[Math.atan2(z.gp.y-z.y,z.gp.x-z.x),Math.min(360,dd*5),1];z.lift+=(5-z.lift)*Math.min(1,dt*6);z.gt=(z.gt||0)+dt;if(dd<8&&z.lift<9||z.gt>2){z.gs=2;z.gt=.35;sfx('club',z.x,z.y);shk=Math.max(shk,.15);for(let i=0;i<14;i++){const a=Math.random()*6.283;pt.push({x:z.x,y:z.y+10,vx:Math.cos(a)*90,vy:Math.sin(a)*60-40,l:.45,c:i%2?'#7a6a58':'#5a4c3e'})}rg.push({x:z.x,y:z.y+12,l:.4,m:.4,r:22,c:'#7a6a58'})}}
else if(z.gs==2){z.gt-=dt;z.rk=1;if(z.gt<=0){z.gs=3;z.gt=.45}}
else{z.gt-=dt;z.lift+=(40-z.lift)*Math.min(1,dt*6);mv=[Math.atan2(z.y-Q.y,z.x-Q.x),60,1];if(z.gt<=0){if(alive(Q))svThrow(z,Q);z.rk=0;z.gs=0;z.gt=0;z.ab=1.5+Math.random()*1.1}}
break}
// phase 2: on the ground, flies around the map at high speed
if(z.fl){const F=z.fl;F.t+=dt;const u=Math.min(1,F.t/F.T);z.x=F.sx+(F.dx-F.sx)*u;z.y=F.sy+(F.dy-F.sy)*u;z.lift=26*Math.min(1,u*5,(1-u)*5);z.tr.push({x:z.x,y:z.y,l:.25,lf:z.lift});
if(u>.2&&u<.8&&z.cd<=0&&alive(Q))svFire(z,aim);if(u>=1){z.fl=null;z.lift=0;z.ab=2.4+Math.random()*1.6}}
else{const[a,m]=svKite(z,Q,d,sg,dt);mv=[a,D.sp*m,0];if(z.ab<=0){const far=Math.random()<.35,p=far?svPt(Q.x,Q.y,320,560):svPt(Q.x,Q.y,170,300);if(p){z.fl={sx:z.x,sy:z.y,dx:p.x,dy:p.y,t:0,T:Math.max(.4,Math.hypot(p.x-z.x,p.y-z.y)/620)};sfx('swoosh',z.x,z.y)}else z.ab=.8}else if(z.cd<=0&&can())svFire(z,aim)}break}
case 9:{mv=svPolUpd(z,Q,d,sg,aim,dt,can);break}
case 15:{mv=svCash(z,Q,d,sg,aim,dt,can);break}
case 16:{mv=svMayor(z,Q,d,sg,aim,dt,can);break}
case 13:{mv=svIce(z,Q,d,dt);break}
case 14:{mv=svFire14(z,Q,d,sg,aim,dt);break}
case 10:{mv=svGirl(z,Q,d,sg,aim,dt,can);break}
case 12:{mv=svMech(z,Q,d,sg,aim,dt,can);break}
case 11:svHH(z,Q,dt);
case 8:{// Hank: rides his horse (and keeps shooting), then fights on foot
if(z.ph==1){z.st=(z.st??0)-dt;z.wt=(z.wt||0)-dt;if(z.wallHit&&z.wt<=0){z.wt=1;z.st=1.8+Math.random()*2;z.sd=-(z.sd||1);z.bh=Math.atan2(z.y-z.py,z.x-z.px)+Math.PI+z.sd*1.2}else if(z.st<=0){z.st=1.8+Math.random()*2;z.sd=Math.random()<.5?-1:1}let a;if(z.wt>.4&&z.bh!=null)a=z.bh;else if(!sg||d>330)a=dirTo(z);else if(d<120)a=aim+Math.PI+z.sd*.6;else a=aim+z.sd*(Math.PI/2-.2);
z.hd=z.hd??a;{let df=Math.atan2(Math.sin(a-z.hd),Math.cos(a-z.hd));z.hd+=cl(df,-5*dt,5*dt)}z.px=z.x;z.py=z.y;mv=[z.hd,170,0];{const c=Math.cos(z.hd);if(Math.abs(c)>.3)z.hf=c<0?-1:1}z.ga=z.hd;for(const q of PL)if(alive(q)&&Math.hypot(q.x-z.x,q.y-z.y)<26)hitP(q,2,a);if(z.cd<=0&&can())svFire(z,aim)}
else{const[a,m]=svKite(z,Q,d,sg,dt);mv=[a,D.sp*m,0];if(z.cd<=0&&can())svFire(z,aim)}break}}
if(z.bq>0){z.bt-=dt;if(z.bt<=0){z.bt=.09;z.bq--;svShot(z,z.fa+(Math.random()-.5)*.16,330,1.3);sfx(D.lz?'laser':'smg',z.x,z.y,.45)}}
if(mv){svMove(z,mv[0],mv[1],dt,mv[2]);z.mvg=mv[1]>5}else{z.mvg=0;z.wallHit=0}
z.tr=z.tr.filter(q=>(q.l-=dt)>0);
if(!(z.alt>4)&&!z.fly&&!z.fl&&!z.tk&&z.ci!=8&&!(z.ci==11&&z.ph==1)&&z.ci!=12&&z.cs!=2&&!(z.ci==7&&z.ph==1))for(const q of PL)if(alive(q)&&Math.hypot(q.x-z.x,q.y-z.y)<20)hitP(q,1,Math.atan2(q.y-z.y,q.x-z.x))}
// first health bar gone: the ship explodes / the horse bolts
function svPh(z){if(z.ph!=1)return 0;if(z.ci==14)ffOut(z);if(z.ci==16)myOut(z);z.ph=2;z.hp=z.h2;z.mh=z.h2;z.bn=CH[z.ci].n.toUpperCase();z.cd=1.2;z.ab=2;z.iv=1;z.bq=0;
if(z.ci==6){z.fly=0;z.hr=0;sfx('boom',z.x,z.y);shk=.6;for(let i=0;i<44;i++){const a=Math.random()*6.283,v=60+Math.random()*260;pt.push({x:z.x,y:z.y-30,vx:Math.cos(a)*v,vy:Math.sin(a)*v,l:.7,c:i%3?'#ff9a2e':i%2?'#ffd84a':'#9aa0aa'})}rg.push({x:z.x,y:z.y,l:.6,m:.6,r:90,c:'#ff9a2e'});
if(!svOK(z.x,z.y)){const p=svPt(z.x,z.y,0,220)||svPt(P.x,P.y,140,320);if(p){z.x=p.x;z.y=p.y}}FT.push({x:z.x,y:z.y-56,t:'SHIP DESTROYED!',c:'#ffcf40',l:1.8})}
if(z.ci==7){z.lift=0;z.rk=0;z.gs=0;if(!svOK(z.x,z.y)){const p=svPt(z.x,z.y,0,220)||svPt(P.x,P.y,140,320);if(p){z.x=p.x;z.y=p.y}}slam(z.x,z.y,60,1);FT.push({x:z.x,y:z.y-56,t:'JOHN CRASH-LANDS! ROUND 2',c:'#ffcf40',l:2})}
if(z.ci==8||z.ci==11){z.hr=0;RH={x:z.x,y:z.y,a:z.ga||0,t:0,ci:z.ci};sfx('kong',z.x,z.y,.6);FT.push({x:z.x,y:z.y-56,t:z.ci==11?'THE HORSE VANISHES! THE HORSEMAN FIGHTS ON FOOT':'THE HORSE BOLTS! HANK FIGHTS ON FOOT',c:'#ffcf40',l:2.2})}
return 1}
// beaten: no pop, they kneel, ask to join, and are unlocked
function svDown(z){if(z.tk)tkPark(z);for(const q of zs)if((q.cl||ZT[q.t].gh)&&q.hp>0&&q!==z){q.hp=0;svPop(q)}GHH=[];GRN=[];const ci=z.ci,cm=cCampId(),cu=cmIs(cm),i=cu?-1:OLDC.indexOf(cm);RKS=[];GHH=[];GRN=[];ICB=[];GCI=[];GCC=[];KN={ci,x:z.x,y:z.y,t:0,fl:Math.cos(z.fa)<0?-1:1,cu};ep=[];SVB=0;sfx('power');
for(const p of PL){const A=p.ac;if(!A||A.g)continue;const dd=DIF();
// a custom slot: its own record and Free Play; the survivor is recruited on their own map, not here
if(cu){const id=cmIdOf(cm),first=!ccBt(A,0,id);ccMark(A,dd,id);if(first)(p.nt=p.nt||[]).push(mpName(cm)+' is now open in Free Play');continue}
A.un=A.un||[0];const nw=!A.un.includes(ci);if(nw)A.un.push(ci);const o0=SORD.filter(m=>mOpen(A,dd,m)),s0=secOf(cm),sd0=s0>=0&&secDone(A,dd,s0);if(i>=0)cpUp(A,dd,i+1);bmSet(A,dd,cm);
if(nw)(p.nt=p.nt||[]).push(CH[ci].n+' joined your survivors');if(s0>=0&&!sd0&&secDone(A,dd,s0)&&s0<4)(p.nt=p.nt||[]).push(SEC[s0+1].n+' is open!');for(const m of SORD)if(!o0.includes(m)&&mOpen(A,dd,m))(p.nt=p.nt||[]).push(MP[m].n+' unlocked')}
FT.push({x:z.x,y:z.y-70,t:CH[ci].n.toUpperCase()+' GIVES UP!',c:'#9be860',l:2.5});sv()}
function campWin(){CWIN={ci:KN?KN.ci:cBossNow(),m:cCampId(),nx:campNx()};over(1)}
function svThrow(z,Q){const tx=Q.x+rnd(-18,18),ty=Q.y+rnd(-18,18),d=Math.hypot(tx-z.x,ty-z.y);RKS.push({sx:z.x,sy:z.y,tx,ty,l0:z.lift+20,t:0,T:cl(d/330,.6,1.35),h:60+d*.18,s:7+Math.random()*3,sp:(Math.random()-.5)*12});sfx('swoosh',z.x,z.y)}
function svTick(dt){svTick3(dt);svTick4(dt);svTick5(dt);for(const r of RKS){r.t+=dt;if(r.t>=r.T){r.done=1;sfx('slam',r.tx,r.ty);shk=Math.max(shk,.3);rg.push({x:r.tx,y:r.ty,l:.45,m:.45,r:48,c:'#c09060'});for(let i=0;i<18;i++){const a=Math.random()*6.283,v=50+Math.random()*170;pt.push({x:r.tx,y:r.ty,vx:Math.cos(a)*v,vy:Math.sin(a)*v*.6,l:.5,c:i%2?'#7a6a58':'#a08a70'})}for(const q of PL)if(alive(q)&&Math.hypot(q.x-r.tx,q.y-r.ty)<48)hitP(q,2,Math.atan2(q.y-r.ty,q.x-r.tx))}}RKS=RKS.filter(r=>!r.done);if(RH){RH.t+=dt;let a=RH.a;const q=PL.find(alive);if(q)a=Math.atan2(RH.y-q.y,RH.x-q.x);RH.a=a;RH.x+=Math.cos(a)*230*dt;RH.y+=Math.sin(a)*230*dt;if(RH.t>2.6)RH=null}}
// ----- drawing -----
function svBody(ci,x,fy,fl,mv,k,aim,o){o=o||{};const Q=PS[ci];if(!Q||!PIMG.naturalWidth)return;const t=performance.now()/1000,an=mv?Q.walk:Q.idle,f=an[Math.floor(t*(mv?11:3))%an.length],s=k/1.6,w=f[2]*s,h=f[3]*s;
X.save();X.translate(x,fy);if(o.rot)X.rotate(o.rot);X.scale(fl,o.sq||1);if(o.a!=null)X.globalAlpha=o.a;if(o.clip){X.beginPath();X.rect(-w,-h-4,w*2,h*o.clip+4);X.clip()}
X.drawImage(PIMG,f[0],f[1],f[2],f[3],-w/2,-h,w,h);
if(o.gun!==false){const g=Q.gun[CH[ci].w];X.translate(-w/2+f[4]*s,-h+f[5]*s);X.rotate(fl>0?aim:Math.PI-aim);X.drawImage(PIMG,g[0],g[1],g[2],g[3],-g[4]*s,-g[5]*s,g[2]*s,g[3]*s)}
X.restore();X.globalAlpha=1}
function svHorse(x,fy,fl,mv,t,al,ci){const HH=ci==11;X.save();X.translate(Math.round(x),Math.round(fy));X.scale(fl,1);if(al!=null)X.globalAlpha=al;const g=(c,x0,y0,w,h)=>{X.fillStyle=c;X.fillRect(x0,y0,w,h)},ph=mv?t*15:0,lg=i=>mv?Math.round(Math.sin(ph+i*1.7)*4):0;
const B=HH?'#1a1a22':'#7a4a28',Bd=HH?'#0e0e14':'#5a321a',Bl=HH?'#30303c':'#9a643a',M=HH?'#ff6a1a':'#2a1a10',O='#16111c';
for(const[i,lx]of[[0,-20],[1,-13],[2,10],[3,17]]){const o=lg(i);g(O,lx-1+o,-19,6,19);g(i%2?Bd:B,lx+o,-18,4,15);g(M,lx+o,-3,4,3)}
g(O,-27,-37,52,21);g(B,-26,-36,50,19);g(Bl,-26,-36,50,4);g(Bd,-26,-21,50,4);
g(O,15,-52,13,22);g(B,16,-51,11,20);g(O,22,-56,17,12);g(B,23,-55,15,10);g(Bd,33,-50,5,5);g('#16111c',35,-48,2,2);g(M,15,-54,4,24);
g(O,23,-60,5,6);g(B,24,-59,3,4);g(HH?'#ff2a1a':'#101010',30,-53,2,2);
g(O,-32,-36,8,17);g(M,-31,-35,6,15+(mv?Math.round(Math.sin(ph)*2):0));
g(O,-10,-40,20,7);g('#a0302a',-9,-39,18,5);g('#e8c060',-9,-39,18,1);
X.restore();X.globalAlpha=1}
function svShip(x,y,t){X.globalAlpha=.13;X.fillStyle='#9aff8a';X.beginPath();X.moveTo(x-10,y);X.lineTo(x+10,y);X.lineTo(x+24,y+36);X.lineTo(x-24,y+36);X.fill();X.globalAlpha=1;
X.fillStyle='#16111c';X.beginPath();X.ellipse(x,y-9,16,14,0,Math.PI,0);X.fill();X.fillStyle='rgba(170,240,255,.6)';X.beginPath();X.ellipse(x,y-9,14,12,0,Math.PI,0);X.fill();
X.fillStyle='#70cc58';X.beginPath();X.ellipse(x+1,y-12,6,6.5,0,0,7);X.fill();X.fillStyle='#101418';X.fillRect(x+2,y-15,4,3);X.fillStyle='rgba(255,255,255,.55)';X.fillRect(x-9,y-17,3,4);
X.fillStyle='#16111c';X.beginPath();X.ellipse(x,y-1,36,11,0,0,7);X.fill();X.fillStyle='#9aa4b4';X.beginPath();X.ellipse(x,y-2,34,9,0,0,7);X.fill();X.fillStyle='#c8d0dc';X.beginPath();X.ellipse(x,y-5,31,4,0,0,7);X.fill();X.fillStyle='#5f6a7c';X.fillRect(x-32,y,64,3);
for(let i=0;i<6;i++){const on=(Math.floor(t*6)+i)%3==0;X.fillStyle=on?'#b4ff9a':'#3a5a3a';X.fillRect(x-26+i*10,y-3,5,3)}}
function svSword(hx,hy,a,big){X.save();X.translate(hx,hy);X.rotate(a);const g=(c,x0,y0,w,h)=>{X.fillStyle=c;X.fillRect(x0,y0,w,h)},L=big?44:38;
g('#16111c',-7,-3,9,6);g('#6a4024',-6,-2,7,4);g('#16111c',1,-8,4,16);g('#e8c060',2,-7,2,14);g('#16111c',4,-4,L+2,8);g('#d8dde6',5,-3,L,6);g('#ffffff',5,-3,L,2);g('#9aa2ae',5,2,L,1);g('#16111c',L+5,-2,4,4);g('#d8dde6',L+5,-1,3,2);X.restore()}
function svDraw(z){if(z.tk){tkDraw(z);return}const ci=z.ci,k=SVK,t=performance.now()/1000,fl=Math.cos(z.fa)<0?-1:1,h=64*k/1.6,fy=z.y+h*.45;
for(const q of z.tr){if(ci==8||ci==11||ci==12)continue;svBody(ci,q.x,q.y+h*.45-(q.lf||0),fl,1,k,z.fa,{gun:false,a:Math.min(.45,q.l*1.8)})}
if(z.jp){const J=z.jp,u=Math.min(1,J.t/J.T),pu=.5+.5*Math.sin(t*12);X.globalAlpha=.15+.12*pu;X.fillStyle='#ff4a2a';X.beginPath();X.arc(J.dx,J.dy,85,0,7);X.fill();X.globalAlpha=.75;X.strokeStyle='#ff6a3a';X.lineWidth=3;X.beginPath();X.arc(J.dx,J.dy,85*(.35+.65*u),0,7);X.stroke();X.globalAlpha=1}
if(z.cs==1||z.ps==1){const L=z.cs==1?330:z.rch;X.globalAlpha=.22+.2*Math.sin(t*22);X.strokeStyle='#ff3a2a';X.lineWidth=z.cs==1?18:12;X.beginPath();X.moveTo(z.x,z.y-6);X.lineTo(z.x+Math.cos(z.fa)*L,z.y-6+Math.sin(z.fa)*L);X.stroke();X.globalAlpha=1}
const lift=(z.alt||0)+(z.lift||0)+(z.fly?34+Math.sin(t*3)*4:0);
X.fillStyle='rgba(0,0,0,.3)';X.beginPath();X.ellipse(z.x,fy-2,(z.fly?32:(ci==8||ci==11)&&z.ph==1||ci==12?30:15)*Math.max(.45,1-lift/170),z.fly?8:5,0,0,7);X.fill();
if(ci==6&&z.ph==1){svShip(z.x,fy-lift-6,t);return}
if(ci==12){svBike(z,fy,Math.cos(z.ga??z.fa)<0?-1:1,t,k);return}if((ci==8||ci==11)&&z.ph==1){const hf=z.hf||(Math.cos(z.ga??z.fa)<0?-1:1);svHorse(z.x,fy,hf,z.mvg,t,null,ci);svBody(ci,z.x-hf*3,fy-16+(z.mvg?Math.round(Math.sin(t*15))*1:0),fl,0,k,z.fa,{clip:.6});return}
if(ci==14){ffDraw(z,fy,fl,t,k);return}const flying=lift>2&&(ci==7||ci==9);
svBody(ci,z.x,fy-lift,fl,z.mvg&&!lift,k,z.fa,{gun:!(ci==4&&z.cs)&&!(ci==9&&z.sh>0),rot:flying?fl*(ci==9?.3:.25):0});if(ci==9&&z.sh>0)svShield(z,fy-lift,h,fl,t);
if(ci==1&&z.ps){const sx=z.x+fl*2,sy=fy-lift-h*.58,L=z.ps==1?10:10+(z.rch-10)*(z.ext||0),ex=sx+Math.cos(z.fa)*L,ey=sy+Math.sin(z.fa)*L;X.lineCap='round';X.strokeStyle='#16111c';X.lineWidth=9;X.beginPath();X.moveTo(sx,sy);X.lineTo(ex,ey);X.stroke();X.strokeStyle='#9aa7b5';X.lineWidth=5;X.stroke();X.lineCap='butt';
for(let s=12;s<L-6;s+=14){X.fillStyle='#5f6a7c';X.fillRect(sx+Math.cos(z.fa)*s-2,sy+Math.sin(z.fa)*s-2,4,4)}X.fillStyle='#16111c';X.fillRect(ex-8,ey-8,16,16);X.fillStyle=z.ps==1&&Math.floor(t*14)%2?'#ff5a4a':'#c4ccd8';X.fillRect(ex-6,ey-6,12,12);X.fillStyle='#7a8496';X.fillRect(ex-6,ey+2,12,4)}
if(ci==4&&z.cs){const hx=z.x+fl*4,hy=fy-lift-h*.5;svSword(hx,hy,z.cs==1?(fl>0?-1.25:Math.PI+1.25):z.fa,1);if(z.cs==3&&Math.floor(t*6)%2){X.font='16px "Press Start 2P", monospace';X.textAlign='center';X.fillStyle='#ffcf40';X.fillText('?',z.x,fy-h-12)}}
if(ci==7&&z.rk)svRock(z.x+fl*3,fy-lift-h-8,9,0);
if(z.bb>0){const cy=fy-lift-h*.5,pu=.5+.5*Math.sin(t*10),R=h*.62;X.globalAlpha=.16+.08*pu;X.fillStyle='#7ae8ff';X.beginPath();X.arc(z.x,cy,R,0,7);X.fill();X.globalAlpha=.85;X.strokeStyle=z.bb<.6&&Math.floor(t*12)%2?'#ffffff':'#9af0ff';X.lineWidth=2.5;X.beginPath();X.arc(z.x,cy,R,0,7);X.stroke();X.globalAlpha=.6;X.strokeStyle='#ffffff';X.beginPath();X.arc(z.x,cy,R-5,3.7,4.5);X.stroke();X.globalAlpha=1}}
function svBul(p){const k=(p.lz?14:9)/Math.hypot(p.vx,p.vy);X.lineCap='round';if(p.lz){X.globalAlpha=.45;X.strokeStyle=p.c;X.lineWidth=6;X.beginPath();X.moveTo(p.x,p.y);X.lineTo(p.x-p.vx*k,p.y-p.vy*k);X.stroke();X.globalAlpha=1}
X.strokeStyle='#16111c';X.lineWidth=4;X.beginPath();X.moveTo(p.x,p.y);X.lineTo(p.x-p.vx*k,p.y-p.vy*k);X.stroke();X.strokeStyle=p.lz?'#eaffff':p.c;X.lineWidth=2.5;X.stroke();X.lineCap='butt'}
function svRock(x,y,s,a){X.save();X.translate(x,y);X.rotate(a);X.fillStyle='#16111c';X.beginPath();X.moveTo(-s-1,-2);X.lineTo(-s*.4,-s-1);X.lineTo(s*.6,-s*.8);X.lineTo(s+1,0);X.lineTo(s*.5,s+1);X.lineTo(-s*.7,s*.8);X.fill();X.fillStyle='#8a7a66';X.beginPath();X.moveTo(-s,-2);X.lineTo(-s*.4,-s);X.lineTo(s*.6,-s*.7);X.lineTo(s,0);X.lineTo(s*.5,s);X.lineTo(-s*.7,s*.7);X.fill();X.fillStyle='#a8977e';X.fillRect(-s*.4,-s*.6,s*.6,s*.4);X.fillStyle='#5f8a3e';X.fillRect(-s*.6,-s*.9,s*.9,2);X.restore()}
function svExtra(){svExtra3();svExtra4();svExtra5();const t=performance.now()/1000;
for(const r of RKS){const u=Math.min(1,r.t/r.T),gx=r.sx+(r.tx-r.sx)*u,gy=r.sy+(r.ty-r.sy)*u,hh=r.l0*(1-u)+r.h*Math.sin(Math.PI*u),pu=.5+.5*Math.sin(t*14);X.globalAlpha=.15+.12*pu;X.fillStyle='#ff4a2a';X.beginPath();X.arc(r.tx,r.ty,48,0,7);X.fill();X.globalAlpha=.7;X.strokeStyle='#ff6a3a';X.lineWidth=2;X.beginPath();X.arc(r.tx,r.ty,48*(.3+.7*u),0,7);X.stroke();X.globalAlpha=.3;X.fillStyle='#000';X.beginPath();X.ellipse(gx,gy+4,r.s,r.s*.4,0,0,7);X.fill();X.globalAlpha=1;svRock(gx,gy-hh,r.s,r.t*r.sp)}
if(RH){const a=1-Math.max(0,(RH.t-1.6)/1);svHorse(RH.x,RH.y+20,Math.cos(RH.a)<0?-1:1,1,t,Math.max(0,a),RH.ci)}
if(KN){const k=SVK,h=64*k/1.6,fy=KN.y+h*.45,ci=KN.ci;X.fillStyle='rgba(0,0,0,.3)';X.beginPath();X.ellipse(KN.x,fy-2,15,5,0,0,7);X.fill();
svBody(ci,KN.x,fy,KN.fl,0,k,0,{gun:false,sq:.78});
const gi=PS[ci]&&PS[ci].gun[CH[ci].w];if(gi&&PIMG.naturalWidth){const s=k/1.6;X.save();X.translate(KN.x+KN.fl*16,fy-3);X.rotate(KN.fl>0?.12:-.12);X.scale(KN.fl,1);X.drawImage(PIMG,gi[0]+26,gi[1],gi[2]-26,gi[3],-14,-gi[3]*s*.5,(gi[2]-26)*s,gi[3]*s);X.restore()}
if(KN.t>.7){const a=Math.min(1,(KN.t-.7)*3);X.globalAlpha=a;X.font='17px VT323, ui-monospace, monospace';const L=KN.cu?SVL2:SVL,tw=Math.max(...L.map(s=>X.measureText(s).width))+18,th=L.length*17+12,bx=Math.round(KN.x-tw/2),by=Math.round(fy-h*.78-th-16);
X.fillStyle='#16111c';X.fillRect(bx-2,by-2,tw+4,th+4);X.fillStyle='#f4f1e6';X.fillRect(bx,by,tw,th);X.fillStyle='#16111c';X.beginPath();X.moveTo(KN.x-6,by+th+1);X.lineTo(KN.x+6,by+th+1);X.lineTo(KN.x,by+th+10);X.fill();X.fillStyle='#f4f1e6';X.beginPath();X.moveTo(KN.x-4,by+th-1);X.lineTo(KN.x+4,by+th-1);X.lineTo(KN.x,by+th+6);X.fill();
X.textAlign='center';X.fillStyle='#16111c';L.forEach((s,i)=>X.fillText(s,KN.x,by+19+i*17));X.font='9px "Press Start 2P", monospace';X.fillStyle='#ffcf40';X.lineWidth=3;X.strokeStyle='#070a08';X.strokeText(CH[ci].n.toUpperCase(),KN.x,by-7);X.fillText(CH[ci].n.toUpperCase(),KN.x,by-7);X.globalAlpha=1}}}

