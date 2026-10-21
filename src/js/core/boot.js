//# core/boot.js — Canvas, screen rotation/resize, the save object S and sv()

const PZ=document.getElementById('pz'),SB=document.getElementById('sb'),C=document.getElementById('c'),X=C.getContext('2d'),ui=document.getElementById('ui');
let W,H,S={};try{S=JSON.parse(localStorage.deadyard||'{}')}catch(e){}
S.pts=S.pts||0;S.un=S.un||[0];S.or=S.or||'a';if(S.dlf==null)S.dlf=S.df?2:1;if(S.dlc==null)S.dlc=1;delete S.df;Object.defineProperty(S,'df',{get(){return DIF()==2?1:0},set(v){},enumerable:false,configurable:true});S.best=S.best||1;S.sw=S.sw||1;S.mp=S.mp||0;
const GM=document.getElementById('game'),rot=()=>S.or=='l'&&innerHeight>innerWidth||S.or=='p'&&innerWidth>innerHeight;
const gp=e=>rot()?{x:e.clientY,y:innerWidth-e.clientX}:{x:e.clientX,y:e.clientY};
function rs(){const r=rot(),nw=r?innerHeight:innerWidth,nh=r?innerWidth:innerHeight;if(nw!==W||nh!==H||C.width!==nw||C.height!==nh){W=C.width=nw;H=C.height=nh}GM.style.width=W+'px';GM.style.height=H+'px';ui.className=W>H?'ls':'';GM.style.transform=r?`translateX(${innerWidth}px) rotate(90deg)`:'none'}
addEventListener('resize',rs);rs();
function sv(){try{localStorage.deadyard=JSON.stringify(S)}catch(e){}}
S.mv=S.mv??.6;S.qs=S.qs??1;S.sv=S.sv??.8;
