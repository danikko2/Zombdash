//# ui/lobby-screen.js — The split-screen lobby on one screen (Night Ops look): the map, game type and difficulty on the left, a card per player on the right
// ---------- split-screen lobby ----------
// rL() in multiplayer/lobby.js calls this; every action there (join, leave, survivor, colour, account, ready) runs rL()
// again. Controllers keep their own buttons in the lobby (lobbyPads), so the hint row lists them.
function lobbyNX(kmIn){const c=GMD=='c',si=secOf(mapId),k=si>=0?SEC[si].m.indexOf(mapId):-1,bo=c?ccBossOf(mapId):null;
const kick=c?(si>=0&&k>=0?`${SEC[si].n.toUpperCase()} · MAP ${k+1} OF ${SEC[si].m.length}`:'CAMPAIGN'):'FREE PLAY';
const md=nxSeg([['CAMPAIGN',"hubCamp()",0],['FREE PLAY',"setGM('f');play()",0],['SPLIT SCREEN',"sfx('click')",1]],'nmode');
const all=LBY.s.length&&LBY.s.every(s=>s.rdy);
const card=i=>{const s=LBY.s[i];if(!s)return `<div class="lbc em" style="--pc:${PC[i]}"><span class=lbn>PLAYER ${i+1}</span><span class=lbj>Press <b>A</b> on a controller to join</span>${!kmIn?`<button data-q=1 class=nb onclick="joinL('km');rL()">Join with keyboard & mouse</button>`:''}</div>`;
const A=acOf(s),ch=CH[s.ci];
return `<div class="lbc${s.rdy?' rd':''}" style="--pc:${PC[i]}"><div class=lbh><span class=lbn>PLAYER ${i+1}</span><small>${s.inp=='km'?'Keyboard & mouse':'Controller '+(s.inp+1)}</small><button data-q=1 class=lnk onclick="lbA(${i},'out')">leave</button></div>
<button data-q=1 class=lbac onclick="lbA(${i},'ac',1)" title="Change account"><b>${edEsc(A?A.name||'Survivor':'Guest')}</b><small>${A?'LV '+A.lv+(ttN(A)?' · '+ttN(A):''):'no XP saved'}</small>${nxi('r',14)}</button>
<div class=lbsv><button data-q=1 class="nb lbar" onclick="lbA(${i},'ch',-1)" aria-label="Previous survivor">${nxi('l')}</button><canvas class=lbch data-ch=${s.ci} data-v=${s.v||(slOn(A,s.ci)?9:0)}></canvas><button data-q=1 class="nb lbar" onclick="lbA(${i},'ch',1)" aria-label="Next survivor">${nxi('r')}</button></div>
<div class=lbsn><b>${ch.n.toUpperCase()}</b><small>${ch.hp} HP · ${wN(s.ci,ch.w)}</small></div>
<div class=lbsw>${VN.map((n,v)=>`<button data-q=1 title="${n}" aria-label="${n}" class="${(s.v||0)==v?'on':''}" style="--sw:${v?'rgb('+VC[v]+')':'linear-gradient(135deg,'+ch.c+' 50%,#e9f1e2 50%)'}" onclick="lbA(${i},'v',${v})"></button>`).join('')}</div>
<button data-q=1 class="lbrd${s.rdy?' on':''}" onclick="lbA(${i},'rdy')">${s.rdy?nxi('check',18)+'READY':'READY?'}</button></div>`};
show(nxWrap('lbx',`${nxTop({back:'menu()',crumbs:[['New game']],mid:md})}<h2 class=sr>SPLIT SCREEN</h2><div class=lbm>
<div class=lbcol><div class=lbmap><img alt="" src="${mpImg(mapId)}"><div class=lbmo><span class=cwk>${kick}</span><span class=lbmn>${c?'':`<button data-q=1 class="nb lbar" onclick="lbMap(-1);rL()" aria-label="Previous map">${nxi('l')}</button>`}<b>${edEsc(mapNm(mapId).toUpperCase())}</b>${c?'':`<button data-q=1 class="nb lbar" onclick="lbMap(1);rL()" aria-label="Next map">${nxi('r')}</button>`}</span>
${c?`<small class=lbos>${bo==null?'survive 20 waves (no survivor here yet)':'wave 20 boss: '+(CH[bo]||CH[0]).n}</small><button data-q=1 class="nb lbcm" onclick="clbOpen()">${nxi('map')}CHOOSE ON THE CAMPAIGN MAP</button>`:'<small class=lbos>Any map you\'ve opened in the campaign</small>'}</div></div>
<span class=cwk>GAME</span>${nxSeg([['CAMPAIGN',"lbMode('c')",c],['FREE PLAY',"lbMode('f')",!c]],'lbmd')}
<span class=cwk>DIFFICULTY</span>${nxSeg([0,1,2].map(d=>[DNm(d,c),`setDif(${d});mapFix(lobAcs());rL()`,DIF()==d,c?[4,3,1][d]+(d==2?' life':' lives'):'']),'ndif')}
<div class=lbbt><button data-q=1 class=nb onclick="accounts(1)">ACCOUNTS</button><button data-q=1 id=lbgo class="np${all?' go':''}" onclick="startMP()">START${kc('ENTER')}</button></div></div>
<div class=lbg>${[0,1,2,3].map(card).join('')}</div></div>
<div class=lbk>${LBY.msg?`<b>${edEsc(LBY.msg)}</b>`:''}<span>Controller: ◀ ▶ survivor · X colour · ▲ ▼ account · A ready · B leave · LB / RB map · Y game type · START begins</span><span>Keyboard: A / D survivor · C colour · W / S account · Q / E map · M game type · Enter ready</span></div>`))}
