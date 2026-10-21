//# core/state.js — Global game state: mode, players, zombies, bullets, wave counters, map state
let mode='menu',sel=0,P,zs=[],bs=[],pt=[],wave=0,toSp=0,spT=0,kills=0,banner=0,L=null,R=null,keys={},mouse={x:0,y:0,d:0},last=0;
let PL=[],MPn=0,ET=0,PRE=0,SKI=0;const RVT=15,PC=['#4ab0ff','#ff5a4a','#5ae05a','#ffcf40'];
const cl=(v,a,b)=>Math.max(a,Math.min(b,v));
let fr=[],shk=0,BB=[],LB=0,pd=[],rg=[],pend=0,nzn='',IW={},mapId=S.mp,ep=[],bossQ=-1,nq=[],SM=[],sk=[],sbk='',WW=W*2,WH=H*2,cam={x:0,y:0},TR=[],WL=[],HS={},BG=document.createElement('canvas'),gs=16,gw=1,gh=1,bl,fd,ft=0;
const D=[[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]];
