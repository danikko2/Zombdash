//# ui/split-shop.js — The split-screen store (Night Ops look): a small store in each player's part of the screen
// ---------- split-screen store ----------
// mshop() in multiplayer/shop-and-game-over.js calls msNX(). It works like the one-player store (ui/shop.js): tabs, a list
// and the picked item in detail, but every player keeps their own tab and pick in p.sx. Each panel is laid out at a base
// size (about 640 × 340) and scaled to fit that player's part of the screen. Buying runs the normal shop functions with P
// set to that player; they call shop() again, which redraws every panel.
// Controller: LB / RB (or ◀ ▶) tabs, ▲ ▼ pick, A buy, X sell, START or Y ready, B back to shopping.
// Keyboard & mouse player: Q / E tabs, W / S pick, Enter buy, X sell, Space ready, Esc back to shopping (or click).
function msSt(p){const w=wave+'|'+PRE;if(!p.sx||p.sx.w!==w)p.sx={t:'guns',g:p.cur,gr:'ar',am:AMT[p.cur]||'pa',hp:p.hp<p.mx?'heal':'max',w};
const x=p.sx;if(x.g==null||!WP[x.g])x.g=p.cur;if(!AMI[x.am])x.am='pa';if(x.gr!='ar'&&!EXI[x.gr])x.gr='ar';if(!SHT.some(q=>q[0]==x.t))x.t='guns';return x}
function msItems(p){const t=msSt(p).t;if(t=='guns')return SHG.flatMap(g=>g[1]);if(t=='gear')return['ar',...EXL];if(t=='ammo')return Object.keys(AMI);return['heal','max']}
const msKy=t=>({guns:'g',gear:'gr',ammo:'am',hp:'hp'})[t];
function msPad(p){return p.inp!=='km'&&p.inp!=='any'}
function msTab(pi,t){const p=PL[pi];if(!p||p.rdy||!SHT.some(q=>q[0]==t))return;msSt(p).t=t;sfx('click');shop()}
function msStep(pi,d){const p=PL[pi];if(!p||p.rdy)return;const x=msSt(p),i=SHT.findIndex(q=>q[0]==x.t);x.t=SHT[(i+d+SHT.length)%SHT.length][0];sfx('click');shop()}
function msMove(pi,d){const p=PL[pi];if(!p||p.rdy)return;const x=msSt(p),L=msItems(p),k=msKy(x.t),i=L.indexOf(x[k]),j=cl((i<0?0:i)+d,0,L.length-1);if(L[j]===x[k])return;x[k]=L[j];sfx('click');shop()}
function msSel(pi,k,v){const p=PL[pi];if(!p||p.rdy)return;msSt(p)[k]=v;sfx('click');shop()}
// the main action for what this player has picked (buy / equip / repair / light / heal), done as that player
function msAct(pi){const p=PL[pi];if(!p||p.rdy)return;const x=msSt(p),t=x.t;P=p;if(t=='guns')return buy(x.g);if(t=='gear')return x.gr=='ar'?armor():exBuy(x.gr);if(t=='ammo')return amBuy(x.am);return x.hp=='max'?mhp():heal()}
function msSell(pi){const p=PL[pi];if(!p||p.rdy)return;const x=msSt(p);P=p;if(x.t=='guns'&&p.own.includes(x.g)&&!amSt(p,x.g))return wSell(x.g);if(x.t=='gear'&&x.gr!='ar'&&exHas(p,x.gr))return exSell(x.gr);P=PL[0];sfx('deny')}
// ready (v=1), back to shopping (v=0) or switch; the wave starts when everyone is ready
function msReady(pi,v){const p=PL[pi];if(!p)return;const r=v==null?(p.rdy?0:1):v;if(r==(p.rdy?1:0))return;p.rdy=r;sfx(r?'buy':'click');P=PL[0];if(PL.every(q=>q.rdy))return nextWave();shop()}
function msFit(v){const s=Math.round(cl(Math.min(v.w/640,v.h/340),.55,3)*1000)/1000;return{s,w:Math.round(v.w/s),h:Math.round(v.h/s)}}
function msAnd(L){return L.length<2?L.join(''):L.slice(0,-1).join(', ')+' and '+L[L.length-1]}
function msNX(){const V=VL(PL.length),P0=PL[0];let h='';PL.forEach((p,pi)=>{h+=msPanel(p,pi,V[pi])});if(V.length>PL.length)h+=msInfo(V[PL.length]);P=P0;
show(`<div class="nx msx"><h2 class=sr>STORE</h2>${h}</div>`);P=P0;
try{for(const l of ui.querySelectorAll('.msli')){const e=l.querySelector('.msrw.on');if(e)l.scrollTop=Math.max(0,e.offsetTop-l.offsetTop-l.clientHeight/2+e.offsetHeight/2)}}catch(e){}}
function msPanel(p,pi,v){P=p;const f=msFit(v),x=msSt(p),t=x.t,ci=p.ci||0,cash=p.cash,ar=p.ar||0,pad=msPad(p),tall=f.h>=470;amFix(p);exFix(p);
const AC=pc(Math.round((S.df?800:500)*(1-.1*rk('arm')))),RC=pc(Math.round(30*(1-.1*rk('arm'))));
const gA=pad?'<i class=msg>A</i>':kc('ENTER'),gX=pad?'<i class="msg x">X</i>':kc('X');
const pic=(i,w,h)=>gunPic(i,ci,w,h,'',cmOf(p.ac,i));
const price=(c,ok)=>`<b class="mspr${ok?'':' no'}">$${nxN(c)}</b>`,tag=(on,s)=>`<em class="shb${on?' on':''}">${s}</em>`;
const row=(on,dim,k,val,q,name,right)=>`<button data-q=1 class="msrw${on?' on':''}${dim?' dim':''}" onclick="msSel(${pi},'${k}',${typeof val=='string'?`'${val}'`:val})"><span class=msq>${q}</span><span class=msn>${name}</span>${right}</button>`;
const btn=(lab,on)=>`<button data-q=1 class="msb${on?' ya':' no'}" onclick="${on?`msAct(${pi})`:"sfx('deny')"}">${on?gA:''}${lab}</button>`;
const sellB=v=>`<button data-q=1 class=mssl onclick="msSell(${pi})">${gX}SELL $${nxN(v)}</button>`;
const sr=(k,s,v)=>`<span class=mssk>${k}</span>${shSeg(s)}<b>${v}</b>`;
let list='',k_='',n_='',pr='',big='',body='',a='',sub='',sl='';
if(t=='guns'){list=SHG.map(([n,G])=>(tall?`<div class=msgh>${n}</div>`:'')+G.map(i=>{const w=WP[i],o=p.own.includes(i),c=pc(w.cost,p);return row(x.g==i,!o&&(cash<c||p.own.length>=INV),'g',i,pic(i,72,28),wN(ci,i),o?tag(p.cur==i,p.cur==i?'EQUIPPED':'OWNED'):price(c,cash>=c))}).join('')).join('');
 const i=x.g,w=WP[i],o=p.own.includes(i),c=pc(w.cost,p),st=shStats(i,ci),inf=amSt(p,i);k_=SHK[i]||'';n_=wN(ci,i);if(!o)pr=price(c,cash>=c);big=pic(i,tall?300:220,tall?72:52);
 body=`<div class=msst>${sr('DAMAGE',st.ds,st.dmg)}${sr('FIRE RATE',st.rs,st.rate)}${sr('MAGAZINE',st.ms,st.mag)}</div>`;
 if(o){a=btn(p.cur==i?'EQUIPPED':'EQUIP',p.cur!=i);sub=inf?'Starting gun: endless ammo':`In slot ${p.own.indexOf(i)+1} of ${INV}`;if(!inf)sl=sellB(wSV(p,i))}
 else if(p.own.length>=INV){a=btn('SLOTS FULL',0);sub='Sell a gun to make room'}
 else if(cash<c){a=btn('BUY $'+nxN(c),0);sub='You need $'+nxN(c-cash)+' more'}
 else{a=btn('BUY $'+nxN(c),1);sub=`Goes in slot ${p.own.length+1} of ${INV}`}}
else if(t=='gear'){const arT=!ar?price(AC,cash>=AC):ar<6?`<b class="mspr${cash>=RC?'':' no'}">repair $${nxN((6-ar)*RC)}</b>`:tag(1,'FULL');
 list=(tall?'<div class=msgh>PROTECTION</div>':'')+row(x.gr=='ar',!ar&&cash<AC,'gr','ar','<span class=msic>▣</span>','Armor',arT)
 +(tall?`<div class=msgh>EXTRAS · ${exUsed(p)}/${EXG.slots} SLOTS</div>`:'')+EXL.map(id=>{const I=EXI[id],o=exHas(p,id),c=pc(I.cost,p);return row(x.gr==id,!o&&(cash<c||!exFits(p,id)),'gr',id,`<canvas data-ex=${id} class=msxi></canvas>`,I.n,o?tag(id=='hl'&&p.hlo,id=='hl'?(p.hlo?'LIGHT ON':'OWNED'):'OWNED'):price(c,cash>=c&&exFits(p,id)))}).join('');
 if(x.gr=='ar'){const kk=Math.min(6-ar,Math.floor(cash/RC));k_='GEAR · TAKES HITS BEFORE YOUR HEALTH';n_='Armor';if(!ar)pr=price(AC,cash>=AC);big='<span class=msbi>▣</span>';
  body=`<div class=msst><span class=mssk>ARMOR</span><span class="shseg s6">${[1,2,3,4,5,6].map(q=>`<i class="${q<=ar?'on':''}"></i>`).join('')}</span><b>${ar} / 6</b></div>`;
  if(!ar){a=btn('BUY $'+nxN(AC),cash>=AC);sub=cash>=AC?'Soaks up 6 hits':'You need $'+nxN(AC-cash)+' more'}
  else if(ar<6){a=btn(`REPAIR +${Math.max(1,kk)} · $${nxN(Math.max(1,kk)*RC)}`,kk>0);sub='$'+RC+' a point'}
  else{a=btn('ARMOR FULL',0);sub='All 6 points'}}
 else{const id=x.gr,I=EXI[id],o=exHas(p,id),c=pc(I.cost,p),fit=exFits(p,id);k_=`GEAR · USES ${I.sl} EXTRA SLOT${I.sl>1?'S':''}`;n_=I.n;if(!o)pr=price(c,cash>=c);big=`<canvas data-ex=${id} class=msbx></canvas>`;
  body=`<p class=msp_>${id=='hl'?'Lights the way on dark maps. Turn it on or off in the game with '+(pad?'B':'F')+'.':''}</p>`;
  if(o){a=btn(id=='hl'?(p.hlo?'TURN LIGHT OFF':'TURN LIGHT ON'):'OWNED',id=='hl');sub='You own it';sl=sellB(exSV(p,id))}
  else if(!fit){a=btn('EXTRAS FULL',0);sub='Sell an extra to make room'}
  else{a=btn('BUY $'+nxN(c),cash>=c);sub=cash>=c?'Goes in an extra slot':'You need $'+nxN(c-cash)+' more'}}}
else if(t=='ammo'){list=Object.keys(AMI).map(kk=>{const I=AMI[kk],c=pc(I.cost,p),full=p.am[kk]>=I.max;return row(x.am==kk,!full&&cash<c,'am',kk,`<span class=msac style="--ac:${I.c}"></span>`,`${I.n}<small>${nxN(p.am[kk])} / ${nxN(I.max)}</small>`,full?tag(1,'FULL'):price(c,cash>=c))}).join('');
 const kk=x.am,I=AMI[kk],c=pc(I.cost,p),full=p.am[kk]>=I.max,mine=WP.map((_,i)=>i).filter(i=>AMT[i]==kk&&p.own.includes(i));k_=`AMMO · ${I.buy} FOR $${c}`;n_=I.n;pr=price(c,cash>=c);
 big=mine.length?mine.slice(0,2).map(i=>pic(i,130,44)).join(''):`<span class=msac style="--ac:${I.c}"></span>`;
 body=`<div class=msst><span class=mssk>CARRYING</span><span class=msbar><i style="width:${Math.round(p.am[kk]/I.max*100)}%;background:${I.c}"></i></span><b>${nxN(p.am[kk])} / ${nxN(I.max)}</b></div>`;
 if(full){a=btn('FULL',0);sub='You can\'t carry more'}else{a=btn(`BUY +${I.buy} · $${nxN(c)}`,cash>=c);sub=cash<c?'You need $'+nxN(c-cash)+' more':mine.length?'For your '+msAnd(mine.map(i=>wN(ci,i))):'None of your guns use it yet'}}
else{const mh=MXH(p),hc=pc(25,p),mc=pc(250,p);
 list=row(x.hp=='heal',cash<hc&&p.hp<p.mx,'hp','heal',`<span class="msic hr">+♥</span>`,`Heal +1<small>${p.hp} / ${p.mx}</small>`,p.hp>=p.mx?tag(1,'FULL'):price(hc,cash>=hc))
 +row(x.hp=='max',p.mx<mh&&cash<mc,'hp','max',`<span class="msic hr">♥+</span>`,`Max HP +1<small>up to ${mh}</small>`,p.mx>=mh?tag(1,'MAXED'):price(mc,cash>=mc));
 big=`<div class=mshs>${Array.from({length:p.mx},(_,q)=>`<i class="${q<p.hp?'on':''}">${nxi('heart',20)}</i>`).join('')}${p.mx<mh&&x.hp=='max'?`<i class=nw>${nxi('heart',20)}</i>`:''}</div>`;
 if(x.hp=='heal'){k_='HEALTH · ONE HEART';n_='Heal +1';pr=price(hc,cash>=hc);if(p.hp>=p.mx){a=btn('FULL HEALTH',0);sub='Nothing to heal'}else{a=btn('HEAL +1 · $'+hc,cash>=hc);sub=cash>=hc?`Health ${p.hp} of ${p.mx}`:'You need $'+(hc-cash)+' more'}}
 else{k_='HEALTH · ONE MORE HEART';n_='Max HP +1';pr=price(mc,cash>=mc);if(p.mx>=mh){a=btn('MAXED',0);sub='Already at '+mh}else{a=btn('MAX HP +1 · $'+mc,cash>=mc);sub=cash>=mc?`${CH[ci].n} can go up to ${mh}`:'You need $'+(mc-cash)+' more'}}}
const tabs=SHT.map(([kk,n])=>`<button data-q=1 class="${kk==t?'on':''}" onclick="msTab(${pi},'${kk}')">${n}</button>`).join('');
const slots=Array.from({length:INV},(_,q)=>{const i=p.own[q];return i==null?'<span class="msls em"></span>':`<span class="msls${p.cur==i?' on':''}" title="${wN(ci,i)}">${pic(i,50,20)}</span>`}).join('');
const wait=PL.map((q,j)=>q.rdy?'':'P'+(j+1)).filter(Boolean);
const sty=`left:${Math.round(v.x)}px;top:${Math.round(v.y)}px;width:${f.w}px;height:${f.h}px;transform:scale(${f.s});--pc:${PC[pi]}`;
return `<section class="msp${tall?' tall':''}${p.rdy?' rd':''}" style="${sty}" aria-label="Player ${pi+1} store">
<div class=msph><b class=mspx>P${pi+1}</b><span class=mspn>${edEsc(pnm(p))}</span><span class=mshp>${nxi('heart',15)}${p.hp}/${p.mx}${ar?`<em>▣ ${ar}/6</em>`:''}</span><b class=msc>$${nxN(cash)}</b></div>
<nav class=mstb aria-label="Store tabs">${kc(pad?'LB':'Q')}<div>${tabs}</div>${kc(pad?'RB':'E')}</nav>
<div class=msm><div class=msli>${list}</div><div class=msd><span class=cwk>${k_}</span><div class=msdh><b class=msdt>${n_}</b>${pr}</div><div class=msbig>${big}</div>${body}<div class=msac2>${a}${sl}</div><span class=msub>${sub}</span></div></div>
<div class=msf><span class=cwk>GUNS</span>${slots}<button data-q=1 class=msrd onclick="msReady(${pi},1)">${kc(pad?'START':'SPACE')}READY${PRE?' FOR WAVE ':' · WAVE '}${wave+1}</button></div>
${p.rdy?`<button data-q=1 class=msov onclick="msReady(${pi},0)"><span class=msok>${nxi('check',34)}</span><b>READY</b><span>${wait.length?'Waiting for '+msAnd(wait):'Starting…'}</span><small>${pad?'<i class="msg b">B</i>':kc('ESC')} keep shopping</small></button>`:''}</section>`}
// the empty quarter when three people play: what's next and who is ready
function msInfo(v){const f=msFit(v),boss=(wave+1)%10==0;
return `<section class="msp msi" style="left:${Math.round(v.x)}px;top:${Math.round(v.y)}px;width:${f.w}px;height:${f.h}px;transform:scale(${f.s})"><span class=cwk>${PRE?'GET READY':'WAVE '+wave+' CLEARED'}</span><b class=msit>${PRE?'WAVE '+(wave+1)+' NEXT':'SUPPLY STOP'}</b><span class=msin>Next: wave ${wave+1}${boss?' · BOSS':''}</span>
<div class=msil>${PL.map((p,i)=>`<span style="--pc:${PC[i]}"><i class="${p.rdy?'on':''}"></i><b>P${i+1}</b>${edEsc(pnm(p))}<em>${p.rdy?'ready':'shopping'}</em></span>`).join('')}</div>
<p class=msih>The next wave starts when everyone is ready.<br>Controller: LB / RB tabs · ▲ ▼ pick · A buy · X sell · START ready</p></section>`}
// keyboard for the player on keyboard & mouse
function msKey(k){const pi=PL.findIndex(p=>p.inp=='km'||p.inp=='any');if(pi<0)return 0;const p=PL[pi];
if(p.rdy){if(k=='escape'||k==' '||k=='enter'){msReady(pi,0);return 1}return 0}
if(k=='q'||k=='arrowleft'||k=='a'){msStep(pi,-1);return 1}if(k=='e'||k=='arrowright'||k=='d'){msStep(pi,1);return 1}
if(k=='w'||k=='arrowup'){msMove(pi,-1);return 1}if(k=='s'||k=='arrowdown'){msMove(pi,1);return 1}
if(k=='enter'){msAct(pi);return 1}if(k=='x'){msSell(pi);return 1}if(k==' '){msReady(pi,1);return 1}return 0}
// controllers: each pad drives its own player's store
// (several players can press in the same frame; stop as soon as the wave has started)
function msPads(){let n=0;for(const q of GP){if(mode!='shop')break;const pi=PL.findIndex(p=>p.inp===q.i||p.inp=='any');if(pi<0)continue;const p=PL[pi];n++;
if(p.rdy){if(q.jp(1)||q.jp(9)||q.jp(3))msReady(pi,0);continue}
if(q.jp(9)||q.jp(3))msReady(pi,1);
else if(q.jp(4)||q.jp(14)||q.jp(102))msStep(pi,-1);else if(q.jp(5)||q.jp(15)||q.jp(103))msStep(pi,1);
else if(q.jp(12)||q.jp(100))msMove(pi,-1);else if(q.jp(13)||q.jp(101))msMove(pi,1);
else if(q.jp(0))msAct(pi);else if(q.jp(2))msSell(pi);else n--}return n>0}
