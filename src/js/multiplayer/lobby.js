//# multiplayer/lobby.js — Split-screen lobby
// ---------- lobby ----------
let LBY=null;
const ACS=()=>[S.ac,...S.prof];
const acOf=s=>s.ac=='G'?null:s.ac,unl=A=>((A&&A.un)||S.ac.un).slice().sort((a,b)=>a-b);
function lobby(){mode='lobby';MPn=0;music('menu');duck(1);if(!LBY)LBY={s:[]};LBY.s=LBY.s.filter(s=>s.inp=='km'||GP.some(q=>q.i===s.inp));LBY.msg='';for(const s of LBY.s){s.rdy=0;if(s.ac!='G'&&!ACS().includes(s.ac))s.ac='G'}
if(!LBY.s.length){if(NAV.on&&NAV.pad!=null&&GP.some(q=>q.i===NAV.pad))joinL(NAV.pad);else joinL('km')}rL()}
function joinL(inp){if(LBY.s.length>=4||LBY.s.some(s=>s.inp===inp))return;const ac=LBY.s.some(s=>s.ac===S.ac)?'G':S.ac,u=unl(acOf({ac})),A=acOf({ac});const ns={inp,ac,ci:A&&u.includes(A.lc)?A.lc:u[0],v:0,rdy:0};LBY.s.push(ns);freeV(ns);sfx('buy')}
function freeV(s){const tk=v=>LBY.s.some(o=>o!==s&&o.ci==s.ci&&(o.v||0)==v);if(!tk(s.v||0))return;for(let v=0;v<5;v++)if(!tk(v)){s.v=v;return}}
function cycV(s,d){s.v=((s.v||0)+d+5)%5;s.rdy=0;sfx('click')}
function cycCh(s,d){const u=unl(acOf(s)),i=u.indexOf(s.ci);s.ci=u[((i<0?0:i)+d+u.length)%u.length];s.v=0;freeV(s);s.rdy=0;sfx('click')}
function cycAc(s,d){const l=[...ACS(),'G'];let i=l.indexOf(s.ac);for(let n=0;n<l.length;n++){i=(i+d+l.length)%l.length;const c=l[i];if(c=='G'||!LBY.s.some(o=>o!==s&&o.ac===c)){s.ac=c;break}}const u=unl(acOf(s));if(!u.includes(s.ci))s.ci=u[0];s.rdy=0;sfx('click')}
function lbMap(d){const o=ORD(),acs=lobAcs();let i=o.indexOf(mapId);for(let n=0;n<o.length;n++){i=(i+d+o.length)%o.length;if(mapOK(o[i],acs))break}mapId=o[i];if(!cmIs(mapId))S.mp=mapId;sv();sfx('click')}
function lbMode(g){setGM(g);mapFix(lobAcs());sfx('click');rL()}
function lbA(i,k,d){const s=LBY.s[i];if(!s)return;if(k=='ch')cycCh(s,d);else if(k=='ac')cycAc(s,d);else if(k=='v'){s.v=d;s.rdy=0;sfx('click')}else if(k=='rdy'){s.rdy=s.rdy?0:1;sfx(s.rdy?'buy':'click')}else if(k=='out'){LBY.s.splice(i,1);sfx('click')}rL()}
function rL(){const kmIn=LBY.s.some(s=>s.inp=='km');ccRunBack();mapFix(lobAcs());
lobbyNX(kmIn)}
function lobbyPads(){let ch=0;for(const q of GP){const s=LBY.s.find(s=>s.inp===q.i);
if(!s){if(q.jp(0)||q.jp(9)){joinL(q.i);ch=1}else if(q.jp(1)&&!LBY.s.length)return menu();continue}const i=LBY.s.indexOf(s);
if(q.jp(14)||q.jp(102)){cycCh(s,-1);ch=1}if(q.jp(15)||q.jp(103)){cycCh(s,1);ch=1}if(q.jp(12)||q.jp(100)){cycAc(s,-1);ch=1}if(q.jp(13)||q.jp(101)){cycAc(s,1);ch=1}
if(q.jp(3)){setGM(GMD=='c'?'f':'c');mapFix(lobAcs());sfx('click');ch=1}if(q.jp(4)){lbMap(-1);ch=1}if(q.jp(5)){lbMap(1);ch=1}
if(q.jp(2)){cycV(s,1);ch=1}if(q.jp(0)){s.rdy=s.rdy?0:1;sfx(s.rdy?'buy':'click');ch=1}
if(q.jp(1)){if(s.rdy)s.rdy=0;else LBY.s.splice(i,1);sfx('click');ch=1}
if(q.jp(9)){if(LBY.s.every(s=>s.rdy))return startMP();LBY.msg='Everyone press A when ready, then START';sfx('deny');ch=1}}
if(ch)rL()}
function lobbyKey(k){const s=LBY.s.find(s=>s.inp=='km');
if(!s){if(k=='enter'||k==' ')joinL('km');else if(k=='escape')return menu();else return;return rL()}
if(k=='a'||k=='arrowleft')cycCh(s,-1);else if(k=='d'||k=='arrowright')cycCh(s,1);else if(k=='w'||k=='arrowup')cycAc(s,-1);else if(k=='s'||k=='arrowdown')cycAc(s,1);
else if(k=='c')cycV(s,1);else if(k=='m'){setGM(GMD=='c'?'f':'c');mapFix(lobAcs())}else if(k=='q')lbMap(-1);else if(k=='e')lbMap(1);else if(k=='enter'||k==' '){if(s.rdy&&LBY.s.every(s=>s.rdy))return startMP();s.rdy=s.rdy?0:1;sfx(s.rdy?'buy':'click')}
else if(k=='escape'){if(s.rdy)s.rdy=0;else LBY.s.splice(LBY.s.indexOf(s),1)}else return;rL()}
function startMP(){const sl=LBY&&LBY.s;if(!sl||!sl.length){sfx('deny');return}WRC=WRP=null;TUT=null;livesInit();RKS=[];GHH=[];GRN=[];ICB=[];GCI=[];GCC=[];CWIN=null;KN=null;CLR=null;RH=null;SVB=0;ccRunBack();mapFix(lobAcs());ccRunRep();MPn=sl.length;plan();BB=[];build();
PL=sl.map((s,i)=>{const A=s.ac=='G'?guest():s.ac;if(!A.g)A.lc=s.ci;return mkP(s.ci,A,s.inp,i,s.v)});P=PL[0];zs=[];bs=[];pt=[];ckClear();wave=swEff()-1;kills=0;ET=0;PRE=0;sv();if(swEff()>1){PRE=1;shop()}else nextWave()}
