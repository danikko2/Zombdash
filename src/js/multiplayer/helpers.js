//# multiplayer/helpers.js — Split screen: player setup, respawn, camera
// ---------- multiplayer helpers ----------
const ZCAP=()=>MPn>1?Math.min(130,60+25*(MPn-1)):60,ZMP=()=>(MPn>1?1+.15*(MPn-1):1)*DMH(),BMP=()=>(MPn>=3?1+.35*(MPn-1):MPn==2?1.75:1)*DBH();
const pnm=p=>(p.ac&&!p.ac.g&&p.ac.name)||'P'+((p.pi||0)+1);
function guest(){return{name:'Guest',xp:0,lv:1,sp:0,sk:{},pts:0,un:S.ac.un.slice(),g:1}}
function mkP(ci,A,inp,pi,v){const c=CH[ci],o={ci,v:v||0,ac:A,inp,pi,x:HS.px+[0,26,-26,0][pi],y:HS.py+[0,0,0,26][pi],hp:c.hp,mx:c.hp,xg:0,lu:0,k:0,own:[c.w],cur:c.w,cds:WP.map(()=>0),inv:0,a:0,c:c.c,ar:0,cash:0};amInit(o);const P0=P;P=o;o.sp=c.sp*(1+.05*rk('spd'));o.xm=xpMul();o.cash=(swEff()-1)*50+40*rk('head');if(DT('money'))o.cash=999999;P=P0;try{o.sw0=swEff();chkC(A);if(sPk(o,4))o.ar=6;if(!o.v&&slOn(A,ci))o.v=9}catch(e){}return o}
function respawn(p){p.dead=0;p.dn=0;p.rv=0;p.hp=Math.max(1,Math.ceil(p.mx/2));p.inv=2;p.eat=null;const a=PL.find(q=>q!==p&&alive(q));if(a){p.x=a.x+rnd(-20,20);p.y=a.y+rnd(-20,20);push(p,9)}}
function camT(p){if(TUT&&!MPn)return TUT.cam;if(!p.dead)return p;let b=p,bd=1e9;for(const q of PL)if(alive(q)){const d=Math.hypot(q.x-p.x,q.y-p.y);if(d<bd){bd=d;b=q}}return b}
