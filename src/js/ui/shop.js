//# ui/shop.js — The workbench store (one player, Night Ops look): category tabs, a list, the picked item in detail, your loadout, the break countdown
// ---------- store ----------
// shop() in game/waves-and-shop.js does the bookkeeping and calls shopNX(). Every buy, sell or heal runs shop() again, so
// this only draws what is there now. SHX remembers the open tab and what is picked on each tab.
var SHX={t:'guns',g:null,gr:'ar',am:'pa',hp:'heal',w:null};
const SHT=[['guns','GUNS'],['gear','GEAR'],['ammo','AMMO'],['hp','HEALTH']];
const SHG=[['SIDEARMS',[0,1]],['SHOTGUNS',[2,5,9]],['RIFLES',[3,6,7]],['HEAVY',[4,8,10,14]],['BOWS',[11,15,13]],['SPECIAL',[12,16,17,18]]];
const SHK=['SIDEARM','SIDEARM · RAPID FIRE','SHOTGUN · CLOSE RANGE','RIFLE · LONG RANGE','HEAVY · EXPLOSIVE','SHOTGUN · HEAVY','RIFLE · HEAVY','RIFLE · LASER BOLTS','HEAVY · HUGE FIRE RATE','SHOTGUN · LASER','HEAVY · LASER','BOW · HEAVY BOLTS','SPECIAL · ZOMBIE-EATING CHICKENS','BOW · BOLTS THAT BLOW UP','HEAVY · CHAIN LIGHTNING','BOW · SETS ZOMBIES ON FIRE','SPECIAL · HEARTS THAT HEAL','SPECIAL · POPPING BUBBLES','SPECIAL · FLAMETHROWER'];
const SHD={hl:'A light on your head that lights the way on dark maps. Switch it on or off with F (controller B). It uses an extra slot, not one of your weapon slots.'};
const SHU={pa:'rounds',ri:'rounds',sh:'shells',rk:'rockets',bl:'rounds',ar:'bolts'};
// a gun picture without the arm (see gunOnly in render/camos.js)
function gunPic(i,ci,w,h,cls,cm){if(cm==null)cm=P&&P.ac?cmOf(P.ac,i):0;return `<canvas class="gn ${cls||''}" data-gn=${i} data-ci=${ci} data-cm=${cm} data-w=${w} data-h=${h} style="width:${w}px;height:${h}px"></canvas>`}
// 1–5 bar segments
function shSeg(n,cls){return `<span class="shseg ${cls||''}">${[1,2,3,4,5].map(k=>`<i class="${k<=n?'on':''}"></i>`).join('')}</span>`}
function shStats(i,ci){const w=WP[i],dw=CH[ci]&&CH[ci].dw&&i==0,dmg=w.d*(w.p||1),rate=1/(w.r*(dw?.5:1)),mag=AMG(i,ci),t=AMT[i];
return{dmg:w.lh?'Heals, never hurts':w.p>1?w.d+' × '+w.p+' pellets':w.dx?w.d+'–'+(w.d+w.dx):w.fh?w.d+' a second':String(w.d),ds:w.lh?0:cl(Math.ceil(Math.log2(Math.max(1,dmg+(w.bx||0))/1.5)),1,5),
 rate:w.fh?'Steady stream':(Math.round(rate*10)/10)+' shots / s',rs:cl(Math.round(Math.log2(rate)+1),1,5),
 mag:mag+' '+(w.ck?'chickens':w.lh?'hearts':w.fh?'flame':w.bc?'shots':SHU[t]),ms:cl(Math.round(Math.log2(mag)/1.6),1,5)}}
function shTab(t){if(!SHT.some(q=>q[0]==t))return;SHX.t=t;sfx('click');shop()}
function shStep(d){const i=SHT.findIndex(q=>q[0]==SHX.t);shTab(SHT[(i+d+SHT.length)%SHT.length][0])}
// the items on the open tab, in list order (for the arrow keys)
// a gun shows in the store when the player owns its blueprint (or carries it already)
function shVis(p,i){return p.own.includes(i)||bpHas(p.ac,i)}
function shLock(p){return WP.filter((_,i)=>!shVis(p,i)).length}
function shItems(){const t=SHX.t;if(t=='guns')return SHG.flatMap(g=>g[1]).filter(i=>shVis(P,i));if(t=='gear')return['ar',...EXL];if(t=='ammo')return Object.keys(AMI);return['heal','max']}
const shKey_=()=>({guns:'g',gear:'gr',ammo:'am',hp:'hp'})[SHX.t];
// picking a row shows it; with a controller, pressing A on the row that is already picked buys it
function shSel(k,v){if(SHX[k]===v&&NAV.on)return shAct();SHX[k]=v;sfx('click');shop()}
// ammo rows buy straight away (no need to move to the BUY button); the row stays picked so its details show
function shAm(k){SHX.am=k;amBuy(k)}
function shMove(d){const L=shItems(),k=shKey_(),i=L.indexOf(SHX[k]);SHX[k]=L[cl((i<0?0:i)+d,0,L.length-1)];sfx('click');shop()}
// the main action for what is picked: buy / equip / repair / light / heal
function shAct(){const t=SHX.t;if(t=='guns')return buy(SHX.g);if(t=='gear')return SHX.gr=='ar'?armor():exBuy(SHX.gr);if(t=='ammo')return amBuy(SHX.am);return SHX.hp=='max'?mhp():heal()}
function shopNX(AC,RC,ar){const p=P,ci=p.ci||0,cash=p.cash,t=SHX.t;amFix(p);exFix(p);
if(SHX.w!==wave+'|'+PRE){SHX.w=wave+'|'+PRE;SHX.t='guns';SHX.g=p.cur}if(SHX.g==null||!WP[SHX.g]||!shVis(p,SHX.g))SHX.g=p.cur;if(!AMI[SHX.am])SHX.am='pa';if(SHX.gr!='ar'&&!EXI[SHX.gr])SHX.gr='ar';
const tag=(on,txt,cls)=>`<em class="shb ${cls||''}${on?' on':''}">${txt}</em>`,price=(c,ok)=>`<span class="shpr${ok?'':' no'}">${scr(c)}</span>`;
const row=(on,dim,js,pic,name,right,lab)=>`<button data-q=1 class="shrw${on?' on':''}${dim?' dim':''}" onclick="${js}"${lab?` aria-label="${lab}"`:''}><span class=shpic>${pic}</span><span class=shn>${name}</span>${right}</button>`;
let list='',cnt='',det='';
const act=(lab,js,on,sub,extra)=>`<div class=shact><button data-q=1 class="np shbuy${on?' ya':' no'}" onclick="${on?js:"sfx('deny')"}">${lab}${on?kc('ENTER'):''}</button><span class=shsub>${sub||''}</span>${extra||''}</div>`;
if(t=='guns'){const nl=shLock(p);cnt=`${WP.length-nl} GUNS<em>· ${p.own.length}/${INV} slots used</em>`;
 list=SHG.map(([n,G0])=>{const G=G0.filter(i=>shVis(p,i));return G.length?`<div class=shgh>${n}</div>`+G.map(i=>{const w=WP[i],o=p.own.includes(i),c=pc(w.cost);return row(SHX.g==i,!o&&cash<c,`shSel('g',${i})`,gunPic(i,ci,110,40),wN(ci,i),o?tag(p.cur==i,p.cur==i?'EQUIPPED':'OWNED'):price(c,cash>=c))}).join(''):''}).join('')+(nl?`<div class=shbpl>${nxi('lock',16)}<span><b>${nl} more gun${nl>1?'s':''}</b>Buy their blueprints with Zombie Pts in the main menu: Progress → Blueprints</span></div>`:'');
 const i=SHX.g,w=WP[i],o=p.own.includes(i),c=pc(w.cost),st=shStats(i,ci),cu=p.cur,cs=i!==cu?shStats(cu,ci):null,cn=wN(ci,cu),am=AMI[AMT[i]],inf=amSt(p,i);
 let a;if(o)a=act(p.cur==i?'EQUIPPED':'EQUIP',`buy(${i})`,p.cur!=i,inf?'Your starting gun: endless ammo, and it can\'t be sold':`In slot ${p.own.indexOf(i)+1} of ${INV}`,inf?'':`<button data-q=1 class=shsell onclick="wSell(${i})">SELL · ${scr(wSV(p,i))}</button>`);
 else if(p.own.length>=INV)a=act('SLOTS FULL','',0,'Sell a gun from your loadout to make room');
 else if(cash<c)a=act('BUY · '+scr(c),'',0,'You need '+scr(c-cash)+' more');
 else a=act('BUY · '+scr(c),`buy(${i})`,1,`Goes into slot ${p.own.length+1} of ${INV}`);
 const sr=(k,v,s,cv)=>`<span class=shsk>${k}</span>${shSeg(s)}<b>${v}</b><small>${cv!=null?edEsc(cn)+' '+cv:''}</small>`;
 det=`<div class=shdh><div><span class=cwk>${SHK[i]||''}</span><b class=shdt>${wN(ci,i).toUpperCase()}</b></div>${o?'':`<b class="shdp${cash>=c?'':' no'}">${scr(c)}</b>`}</div><div class=shbig>${gunPic(i,ci,420,100,'big')}</div>
 <div class=shst>${sr('DAMAGE',st.dmg,st.ds,cs&&cs.dmg)}${sr('FIRE RATE',st.rate,st.rs,cs&&cs.rate)}${sr('MAGAZINE',st.mag,st.ms,cs&&cs.mag)}<span class=shsk>AMMO</span><span class=sham style="--ac:${am.c}"><i></i>${inf?'Endless (starting gun)':`${am.n} · ${am.buy} for ${scr(pc(am.cost))} · you have ${nxN(amRes(p,i))}`}</span></div>${a}`}
else if(t=='gear'){cnt=`GEAR<em>· extras ${exUsed(p)}/${EXG.slots}</em>`;
 const arT=!ar?scr(AC):ar<6?'repair '+scr((6-ar)*RC):'FULL 6/6';
 list=`<div class=shgh>PROTECTION</div>`+row(SHX.gr=='ar',!ar&&cash<AC,"shSel('gr','ar')",`<span class=shico>▣</span>`,'Armor',ar>=6?tag(1,'FULL'):`<span class="shpr${(!ar?cash>=AC:cash>=RC)?'':' no'}">${arT}</span>`)
 +`<div class=shgh>EXTRAS · ${exUsed(p)}/${EXG.slots} SLOTS</div>`+EXL.map(id=>{const I=EXI[id],o=exHas(p,id),c=pc(I.cost,p);return row(SHX.gr==id,!o&&(cash<c||!exFits(p,id)),`shSel('gr','${id}')`,`<canvas data-ex=${id} class=shexi></canvas>`,`${I.n}<small>${o||!exFits(p,id)?exTxt(p,id):'uses '+I.sl+' extra slot'+(I.sl>1?'s':'')}</small>`,o?tag(id=='hl'&&p.hlo,id=='hl'?(p.hlo?'LIGHT ON':'OWNED'):'OWNED'):price(c,cash>=c&&exFits(p,id)))}).join('');
 if(SHX.gr=='ar'){const k=Math.min(6-ar,Math.floor(cash/RC));det=`<div class=shdh><div><span class=cwk>GEAR · TAKES HITS BEFORE YOUR HEALTH</span><b class=shdt>ARMOR</b></div>${ar?'':`<b class="shdp${cash>=AC?'':' no'}">${scr(AC)}</b>`}</div><div class="shbig shbi"><span>▣</span></div>
 <div class=shst><span class=shsk>ARMOR</span><span class="shseg s6">${[1,2,3,4,5,6].map(q=>`<i class="${q<=ar?'on':''}"></i>`).join('')}</span><b>${ar} / 6</b><small></small></div><p class=shp>Armor soaks up 6 hits before you lose any health. Lost points can be repaired for ${scr(RC)} each.</p>
 ${!ar?act('BUY ARMOR · '+scr(AC),'armor()',cash>=AC,cash>=AC?'Full armor: 6 points':'You need '+scr(AC-cash)+' more'):ar<6?act(`REPAIR +${Math.max(1,k)} · ${scr(Math.max(1,k)*RC)}`,'armor()',k>0,k>0?scr(RC)+' a point':'You need '+scr(RC)+' for a point'):act('ARMOR FULL','',0,'All 6 points')}`}
 else{const id=SHX.gr,I=EXI[id],o=exHas(p,id),c=pc(I.cost,p),fit=exFits(p,id);det=`<div class=shdh><div><span class=cwk>GEAR · USES ${I.sl} EXTRA SLOT${I.sl>1?'S':''}</span><b class=shdt>${I.n.toUpperCase()}</b></div>${o?'':`<b class="shdp${cash>=c?'':' no'}">${scr(c)}</b>`}</div><div class="shbig shbx"><canvas data-ex=${id}></canvas></div><p class=shp>${SHD[id]||''}</p>
 ${o?act(id=='hl'?(p.hlo?'TURN LIGHT OFF':'TURN LIGHT ON'):'OWNED',`exBuy('${id}')`,id=='hl','You own it',`<button data-q=1 class=shsell onclick="exSell('${id}')">SELL · ${scr(exSV(p,id))}</button>`):!fit?act('EXTRAS FULL','',0,'Sell an extra to make room'):act('BUY · '+scr(c),`exBuy('${id}')`,cash>=c,cash>=c?'Goes into an extra slot':'You need '+scr(c-cash)+' more')}`}}
else if(t=='ammo'){cnt='AMMO<em>· for the guns you carry</em>';
 list=Object.keys(AMI).map(k=>{const I=AMI[k],c=pc(I.cost),full=p.am[k]>=I.max,use=p.own.some(i=>AMT[i]==k&&!amSt(p,i));return row(SHX.am==k,!full&&cash<c,`shAm('${k}')`,`<span class=shamc style="--ac:${I.c}"></span>`,`${I.n}<small>${nxN(p.am[k])} / ${nxN(I.max)}${use?' · your guns use it':''}</small>`,full?tag(1,'FULL'):price(c,cash>=c))}).join('');
 const k=SHX.am,I=AMI[k],c=pc(I.cost),full=p.am[k]>=I.max,gs=WP.map((_,i)=>i).filter(i=>AMT[i]==k),mine=gs.filter(i=>p.own.includes(i));
 det=`<div class=shdh><div><span class=cwk>AMMO · ${I.buy} FOR ${scr(c)}</span><b class=shdt>${I.n.toUpperCase()}</b></div><b class="shdp${cash>=c?'':' no'}">${scr(c)}</b></div><div class="shbig shba" style="--ac:${I.c}">${mine.length?mine.slice(0,3).map(i=>gunPic(i,ci,150,56)).join(''):'<i></i>'}</div>
 <div class=shst><span class=shsk>CARRYING</span><span class=shbar><i style="width:${Math.round(p.am[k]/I.max*100)}%;background:${I.c}"></i></span><b>${nxN(p.am[k])} / ${nxN(I.max)}</b><small></small><span class=shsk>USED BY</span><span class=shuse>${gs.map(i=>`<span class="${p.own.includes(i)?'on':''}">${wN(ci,i)}</span>`).join('')}</span></div>
 ${full?act('FULL','',0,'You can\'t carry more'):act(`BUY +${I.buy} · ${scr(c)}`,`amBuy('${k}')`,cash>=c,cash>=c?(mine.length?'For your '+mine.map(i=>wN(ci,i)).join(', '):'None of your guns use it yet'):'You need '+scr(c-cash)+' more')}`}
else{cnt='HEALTH';const mh=MXH(p);
 list=row(SHX.hp=='heal',cash<pc(25)&&p.hp<p.mx,"shSel('hp','heal')",`<span class="shico hr">+♥</span>`,`Heal +1<small>${p.hp} / ${p.mx}</small>`,p.hp>=p.mx?tag(1,'FULL'):price(pc(25),cash>=pc(25)))+row(SHX.hp=='max',p.mx<mh&&cash<pc(250),"shSel('hp','max')",`<span class="shico hr">♥+</span>`,`Max HP +1<small>up to ${mh}</small>`,p.mx>=mh?tag(1,'MAXED'):price(pc(250),cash>=pc(250)));
 const hearts=`<div class=shhs>${Array.from({length:p.mx},(_,q)=>`<i class="${q<p.hp?'on':''}">${nxi('heart',26)}</i>`).join('')}${p.mx<mh&&SHX.hp=='max'?`<i class=nw>${nxi('heart',26)}</i>`:''}</div>`;
 det=SHX.hp=='heal'?`<div class=shdh><div><span class=cwk>HEALTH · ONE HEART</span><b class=shdt>HEAL +1</b></div><b class="shdp${cash>=pc(25)?'':' no'}">${scr(pc(25))}</b></div><div class="shbig shbh">${hearts}</div><p class=shp>Health ${p.hp} of ${p.mx}. Each heal gives back one heart.</p>${p.hp>=p.mx?act('FULL HEALTH','',0,'Nothing to heal'):act('HEAL +1 · '+scr(pc(25)),'heal()',cash>=pc(25),cash>=pc(25)?'':'You need '+scr(pc(25)-cash)+' more')}`
 :`<div class=shdh><div><span class=cwk>HEALTH · ONE MORE HEART</span><b class=shdt>MAX HP +1</b></div><b class="shdp${cash>=pc(250)?'':' no'}">${scr(pc(250))}</b></div><div class="shbig shbh">${hearts}</div><p class=shp>Raises your most health by one heart and fills it. ${CH[ci].n} can go up to ${mh}.</p>${p.mx>=mh?act('MAXED','',0,'Already at '+mh):act('MAX HP +1 · '+scr(pc(250)),'mhp()',cash>=pc(250),cash>=pc(250)?'':'You need '+scr(pc(250)-cash)+' more')}`}
const slots=Array.from({length:INV},(_,k)=>{const i=p.own[k];if(i==null)return `<div class="shsl em">Slot ${k+1} · empty</div>`;return `<button data-q=1 class="shsl${p.cur==i?' on':''}" onclick="SHX.t='guns';SHX.g=${i};buy(${i})">${gunPic(i,ci,64,26)}<span><b>${wN(ci,i)}</b><small style="color:${AMI[AMT[i]].c}">${amTxt(p,i)}</small></span></button>`}).join('');
const ex=Array.from({length:EXG.slots},(_,k)=>{const id=p.ex[k];return id&&EXI[id]?`<button data-q=1 class="shxs${id=='hl'&&p.hlo?' on':''}" onclick="SHX.t='gear';SHX.gr='${id}';sfx('click');shop()" aria-label="${EXI[id].n}"><canvas data-ex=${id}></canvas></button>`:'<div class="shxs em"></div>'}).join('');
const bl=bpLv(p.ac),top=`<div class=shtop>${BRK?`<button data-q=1 class="nb shbk" onclick="bnLeave()" aria-label="Leave the bench">${nxi('back',16)}BACK${kc('ESC')}</button>`:''}<div class=shti><span class=cwk>WORKBENCH · LEVEL ${bl}</span><b>${BRK?`<span class="brkt${BRK.t<=10?' hot':''}">${brkClock(BRK.t)}</span><small> until wave ${wave+1}</small>`:PRE?'WAVE '+(wave+1)+' NEXT':'SUPPLY STOP'}</b></div>
<nav class=shtabs aria-label="Store">${kc('Q')}${SHT.map(([k,n])=>`<button data-q=1 class="${k==t?'on':''}" onclick="shTab('${k}')">${n}</button>`).join('')}${kc('E')}</nav>
<div class=shr><span class=shhp title="Health">${nxi('heart',18)}<b>${p.hp}/${p.mx}</b>${ar?`<em>▣ ${ar}/6</em>`:''}</span><button data-q=1 class="nb shqh${cash<pc(25)||p.hp>=p.mx?' no':''}" onclick="heal()" title="Heal one heart">+1 ♥ <small>${scr(pc(25))}</small></button><b class=shc>${scr(cash)}</b>${PTX?'':`<button data-q=1 class="nb nbi" onclick="runExit()" aria-label="Leave the run">${nxi('home')}</button>`}</div></div>`;
show(nxWrap('stor',`${top}<h2 class=sr>STORE</h2><div class=shm><div class=shl><div class=shlh><span class=cwk>${cnt}</span></div><div class=shls>${list}</div></div><div class=shd>${det}</div></div>
<div class=shlo><span class=shlk>LOAD-<br>OUT</span><div class=shsls>${slots}</div><div class=shxw><span class=cwk>EXTRAS ${exUsed(p)}/${EXG.slots}</span><div>${ex}</div></div>${PTX?'<button data-q=1 class="nb shpt" onclick="ptEnd()">BACK TO EDITOR</button>':''}<button data-q=1 class="np go shgo" onclick="brkRdy(P,1)">START WAVE ${wave+1}${kc('SPACE')}</button></div>${RXC?rxDlg():''}`,'<div class="nxbg shbg"></div>'));
try{const e=ui.querySelector('.shrw.on');if(e&&e.scrollIntoView)e.scrollIntoView({block:'nearest'})}catch(e){}}
// keys in the store: Q/E tabs, ↑/↓ pick, Enter buy, Space ready (start the wave now), Esc back to the map
function shKey(k){if(RXC)return rxKey(k);if(k=='q'||k=='e'){shStep(k=='q'?-1:1);return 1}if(k=='arrowup'||k=='w'){shMove(-1);return 1}if(k=='arrowdown'||k=='s'){shMove(1);return 1}
if(k=='enter'){shAct();return 1}if(k==' '){brkRdy(P,1);return 1}if(k=='escape'){if(PTX&&!BRK)return 0;bnLeave();return 1}return 0}
// controller in the store: LB/RB tabs, X buys what's picked, Y ready (start the wave), B back to the map (the rest is normal menu navigation)
function shPads(){if(RXC)return 0;for(const q of GP){if(q.jp(4)||q.jp(5)){shStep(q.jp(4)?-1:1);return 1}if(q.jp(2)){shAct();return 1}if(q.jp(3)){brkRdy(P,1);return 1}if(q.jp(1)){bnLeave();return 1}}return 0}
