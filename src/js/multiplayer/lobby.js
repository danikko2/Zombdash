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
function lbMap(d){const o=ORD(),acs=lobAcs();let i=o.indexOf(mapId);for(let n=0;n<o.length;n++){i=(i+d+o.length)%o.length;if(mapOK(o[i],acs))break}mapId=o[i];S.mp=mapId;sv();sfx('click')}
function lbMode(g){setGM(g);mapFix(lobAcs());sfx('click');rL()}
function lbA(i,k,d){const s=LBY.s[i];if(!s)return;if(k=='ch')cycCh(s,d);else if(k=='ac')cycAc(s,d);else if(k=='v'){s.v=d;s.rdy=0;sfx('click')}else if(k=='rdy'){s.rdy=s.rdy?0:1;sfx(s.rdy?'buy':'click')}else if(k=='out'){LBY.s.splice(i,1);sfx('click')}rL()}
function rL(){const kmIn=LBY.s.some(s=>s.inp=='km');mapFix(lobAcs());
show(`<div class="p wide lob"><h2>SPLIT SCREEN</h2><div class="seg lmode"><button data-q=1 class="${GMD=='c'?'on':''}" onclick="lbMode('c')">CAMPAIGN</button><button data-q=1 class="${GMD=='f'?'on':''}" onclick="lbMode('f')">FREE PLAY</button></div><div class="seg lmode">${[0,1,2].map(d=>`<button data-q=1 class="${DIF()==d?'on':''}" onclick="setDif(${d});mapFix(lobAcs());rL()">${DNm(d,GMD=='c')}</button>`).join('')}</div><div class=lmap>${GMD=='c'?'':'<button data-q=1 onclick="lbMap(-1);rL()">◀</button>'}<div><i style="background:${MT[mapId]}"></i><b>${mapNm(mapId)}</b>${GMD=='c'?`<small class=lbos>wave 20 boss: ${CH[MUN[mapId]].n}</small>`:''}</div>${GMD=='c'?'<button data-q=1 class=go style="width:auto;min-width:0;height:auto;padding:8px 14px;font-size:13px;line-height:1.2;white-space:nowrap" onclick="clbOpen()">CHOOSE MAP</button>':'<button data-q=1 onclick="lbMap(1);rL()">▶</button>'}</div><div class=lg>`+
[0,1,2,3].map(i=>{const s=LBY.s[i];if(!s)return `<div class="ls em" style="--pc:${PC[i]}"><b class=px>P${i+1}</b><p>Press <b>A</b> on a controller to join</p>${!kmIn?`<button data-q=1 onclick="joinL('km');rL()">Join with keyboard</button>`:''}</div>`;
const A=acOf(s),u=unl(A);return `<div class="ls ${s.rdy?'rd':''}" style="--pc:${PC[i]}"><div class=lh><b class=px>P${i+1}</b><small>${s.inp=='km'?'Keyboard & mouse':'Controller '+(s.inp+1)}</small></div>
<div class=lr><button data-q=1 onclick="lbA(${i},'ch',-1)">◀</button><div><canvas data-ch=${s.ci} data-v=${s.v||(slOn(A,s.ci)?9:0)}></canvas><span>${CH[s.ci].n}</span><small>♥ ${CH[s.ci].hp} · ${WP[CH[s.ci].w].n}</small></div><button data-q=1 onclick="lbA(${i},'ch',1)">▶</button></div>
<div class=lsw>${VN.map((n,v)=>`<button data-q=1 title="${n}" class="${(s.v||0)==v?'on':''}" style="--sw:${v?'rgb('+VC[v]+')':'linear-gradient(135deg,'+CH[s.ci].c+' 50%,#e9f1e2 50%)'}" onclick="lbA(${i},'v',${v})"></button>`).join('')}</div>
<div class=lr><button data-q=1 onclick="lbA(${i},'ac',-1)">◀</button><div class=la><span>${A?A.name||'Survivor':'Guest'}</span><small>${A?'LV '+A.lv+(ttN(A)?' · '+ttN(A):''):'no XP saved'}</small></div><button data-q=1 onclick="lbA(${i},'ac',1)">▶</button></div>
<button data-q=1 class="${s.rdy?'on':'go'}" onclick="lbA(${i},'rdy')">${s.rdy?'READY ✓':'READY?'}</button><button data-q=1 class=lnk onclick="lbA(${i},'out')">leave</button></div>`}).join('')+
`</div><p class=note>${LBY.msg||'Controller: ◀ ▶ survivor · X color · ▲ ▼ account · A ready · B leave · LB/RB map · Y mode · START begins'}<br>Keyboard: A/D survivor · C color · W/S account · Q/E map · M mode · Enter ready</p><div class=row><button onclick="menu()">BACK</button><button onclick="accounts(1)">ACCOUNTS</button><button class=go onclick="startMP()">START</button></div></div>`)}
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
function startMP(){const sl=LBY&&LBY.s;if(!sl||!sl.length){sfx('deny');return}WRC=WRP=null;TUT=null;livesInit();RKS=[];GHH=[];GRN=[];ICB=[];GCI=[];GCC=[];CWIN=null;KN=null;RH=null;SVB=0;mapFix(lobAcs());MPn=sl.length;plan();BB=[];build();
PL=sl.map((s,i)=>{const A=s.ac=='G'?guest():s.ac;if(!A.g)A.lc=s.ci;return mkP(s.ci,A,s.inp,i,s.v)});P=PL[0];zs=[];bs=[];pt=[];wave=swEff()-1;kills=0;ET=0;PRE=0;sv();if(swEff()>1){PRE=1;shop()}else nextWave()}
