//# ui/setup.js — Starting a Free Play game on one screen: map, survivor, difficulty and start wave together
// ---------- new game setup ----------
// Replaces the old map screen → survivor screen walk. The mode tabs at the top switch to the campaign map or the
// split-screen lobby. Everything you pick is remembered for next time (S.mp, sel, S.dlf, S.sw).
function setupF(){if(UIS!='map'||!ORD().includes(mapId))mapFix();UIS='map';mode='menu';MPn=0;const A=S.ac,O=ORD(),m=mapId,ok=mapOK(m);if(SV==null||!CH[SV])SV=sel;S.sw=cl(S.sw,1,DT('wave')?99:S.best);
const c=CH[SV],u=A.un.includes(SV),best=mBest(A,m);
const strip=O.map(k=>{const o=mapOK(k);return `<button data-q=1 class="sut${k==m?' on':''}${o?'':' lk'}" onclick="suMap(${k})" aria-label="${edEsc(mpName(k))}${o?'':', locked'}"><img alt="" src="${mpImg(k)}"><b>${edEsc(mpName(k))}</b>${o?'':`<span class=sulk>${nxi('lock',16)}</span>`}${cmIs(k)?'<em class=sucu>✎</em>':''}</button>`}).join('');
const grid=CH.map((q,i)=>{const uu=A.un.includes(i);return `<button data-q=1 class="sug${i==SV?' on':''}${uu?'':' lk'}" onclick="suSurv(${i})" aria-label="${q.n}${uu?'':', locked'}">${nxCh(i,!uu)}${uu?'':`<span class=sulk2>${nxi('lock',12)}</span>`}</button>`}).join('');
const md=nxSeg([['CAMPAIGN',"hubCamp()",0],['FREE PLAY',"sfx('click')",1]].concat(PCM()?[['SPLIT SCREEN','lobby()',0]]:[]),'nmode');
show(nxWrap('su',`${nxTop({back:'menu()',crumbs:[['New game']],mid:md})}<h2 class=sr>NEW GAME</h2><div class=sux>
<div class=sul><div class="supv${ok?'':' lk'}"><img alt="" src="${mpImg(m)}"><div class=supo><span class=cwk>${cmIs(m)?'CUSTOM MAP':'FREE PLAY'}</span><b>${edEsc(mpName(m).toUpperCase())}</b><span>${edEsc(mpDesc(m))}</span><em>${ok?(best?'Best wave here: '+best:'Not played here yet'):munT(m)}</em></div></div>
<div class=sustrip><button data-q=1 class="nb suar" onclick="mapStep(-1)" aria-label="Previous map">${nxi('l')}</button><div class=sus>${strip}</div><button data-q=1 class="nb suar" onclick="mapStep(1)" aria-label="Next map">${nxi('r')}</button></div></div>
<div class=sur><span class=cwk>SURVIVOR</span><div class=sugrid>${grid}</div><div class=sud><b>${c.n.toUpperCase()}</b><span>${c.hp} HP · ${Math.round(c.sp*100)}% speed · ${wN(SV,c.w)}</span></div>${u?'':`<div class=sunote>${nxi('lock',14)} Beat ${c.n} in the campaign: the wave 20 boss on ${UNM[SV]!=null?MP[UNM[SV]].n:'a campaign map'}.</div>`}
<span class=cwk>DIFFICULTY</span>${nxDif('play()')}<span class=sunote2>${dTxt()}</span>
<div class=suw><span class=cwk>START WAVE</span><button data-q=1 class="nb sust" onclick="suSW(-1)" aria-label="Lower start wave">−</button><b>${S.sw}</b><button data-q=1 class="nb sust" onclick="suSW(1)" aria-label="Raise start wave">+</button><small>${DT('wave')?'Test mode: any wave':'Best reached: '+S.best} · $50 per skipped wave</small></div>
<button data-q=1 id=mgo class="np sugo${ok&&u?' go':' no'}" onclick="mapGo()">${!ok?'🔒 MAP LOCKED':!u?'🔒 SURVIVOR LOCKED':'START'}${kc('ENTER')}</button></div></div>`,`<div class="nxbg subg"><img alt="" src="${mpImg(m)}"></div>`));
try{const e=ui.querySelector('.sut.on');if(e&&e.scrollIntoView)e.scrollIntoView({block:'nearest',inline:'center'})}catch(e){}}
function suMap(k){mapId=k;if(!cmIs(k))S.mp=k;SVD=1;sfx('click');play()}
function suSurv(i){SV=i;if(S.ac.un.includes(i)){sel=i;sfx('click')}else sfx('deny');play()}
function suSW(d){S.sw=cl(S.sw+d,1,DT('wave')?99:S.best);try{sv()}catch(e){}sfx('click');play()}
// keys and controller buttons for the new screens (the rest goes to normal menu navigation)
function nxKey(k){if(mode!='menu')return 0;if(wmKey(k))return 1;if(k=='enter'&&ui.querySelector&&ui.querySelector('.wcx')){const b=ui.querySelector('#wcgo');if(b&&!b.disabled){b.click();return 1}}
if(UIS=='map'){if(k=='arrowleft'||k=='a'){mapStep(-1);return 1}if(k=='arrowright'||k=='d'){mapStep(1);return 1}if(k=='enter'){mapGo();return 1}if(k=='escape'){menu();return 1}if(k=='q'){hubCamp();return 1}if(k=='e'&&PCM()){lobby();return 1}}
if(UIS=='cmap'){if(k=='escape'){if(CWV.v==='w'){CMLB?clbBack():menu()}else cGo('w');return 1}if(k=='q'||k=='e'){cwNext(k=='q'?-1:1);return 1}if(k=='enter'){if(CWV.v==='w')cwSec(CWV.ws);else{const b=ui.querySelector&&ui.querySelector('#mgo');b?b.click():mapGo()}return 1}if(k=='y'&&!CMLB){survs();return 1}}
if(UIS=='hub'||HUBX){if(k=='q'||k=='e'){hubStep(k=='q'?-1:1);return 1}if(k=='enter'&&HUBX&&ui.querySelector){const b=ui.querySelector('.htm .np.go');if(b){b.click();return 1}}if(k=='escape'&&HUBX){menu();return 1}}
return 0}
function nxPads(){if(mode=='shop'&&!MPn)return shPads();if(mode!='menu')return 0;for(const q of GP){const lb=q.jp(4),rb=q.jp(5);if(!lb&&!rb)continue;const dr=lb?-1:1;
if(UIS=='map'){mapStep(dr);return 1}if(UIS=='cmap'){cwNext(dr);return 1}if(UIS=='hub'||HUBX){hubStep(dr);return 1}}return 0}
function hubStep(dr){const t=HUBX||'play',i=HUBTABS.findIndex(q=>q[0]==t);hubTab(HUBTABS[(i+dr+HUBTABS.length)%HUBTABS.length][0])}
