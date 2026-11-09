//# ui/hub.js — The main menu: a tab bar (Play, Loadout, Survivors, Progress, Workshop) and the Play tab
// ---------- main menu hub ----------
// HUBX is the tab whose (older) screen is showing under the tab bar; show() adds the bar while it is set.
var HUBX=null,HUBT='play';
const HUBTABS=[['play','PLAY'],['loadout','LOADOUT'],['surv','SURVIVORS'],['prog','PROGRESS'],['ws','WORKSHOP']];
const HUBSUB=[['skills','SKILLS',"UIS='';SKS=null;skills()"],['bp','BLUEPRINTS','bpTab()'],['chals','CHALLENGES','chals()'],['lb','LEADERBOARDS','lbOpen()'],['titles','TITLES & BADGES','titles()']];
function hubBar(t){const A=S.ac,np=chDue(A);
return `<div class=hubbar><div class=hublogo><b>ZOMB</b><i>DASH</i></div><nav class=hubtabs aria-label="Main menu">${kc('Q')}${HUBTABS.map(([k,n])=>`<button data-q=1 class="${k==t?'on':''}" onclick="hubTab('${k}')">${n}${k=='prog'&&np?`<span class=nbadge>${np}</span>`:''}</button>`).join('')}${kc('E')}</nav>
<div class=hubr><span class=hubpts><b>${nxN(A.pts)}</b>ZOMBIE PTS</span><button data-q=1 class=hubme onclick="HUBX=null;accounts(0)" aria-label="Accounts"><span class=hublv>${A.lv}</span><span class=hubnm><b>${edEsc(A.name||'Survivor')}${bdH(A)}</b>${ttH(A)}<i><em style="width:${Math.min(100,A.xp/xpNeed(A.lv)*100)}%"></em></i></span></button><button data-q=1 class="nb nbi" onclick="HUBX=null;olMenu()" aria-label="Online">${nxi('trophy')}</button><button data-q=1 class="nb nbi" onclick="HUBX=null;options(0)" aria-label="Settings">${nxi('gear')}</button></div></div>`}
// challenges you can still finish today (shown as a badge on Progress)
function chDue(A){try{const c=chkC(A);return c?c.D.filter(q=>!q.f).length:0}catch(e){return 0}}
function hubTab(t){sfx('click');if(t=='play'){HUBX=null;return menu()}HUBT=t;HUBX=t;
if(t=='loadout')return armory();if(t=='surv')return mastery();if(t=='prog'){UIS='';SKS=null;return skills()}if(t=='ws')return workshop()}
// older screens shown under the tab bar (until each gets its own Night Ops layout)
function hubFrame(h){const z=nxS(),sub=HUBX=='prog',top=(z.pt?128:76)+(sub?52:0);
const cur=sub?(UIS=='ch'?'chals':UIS=='lb'?'lb':UIS=='tt'?'titles':'skills'):'';
return `<div class="nx hubf${z.pt?' pt':''}${z.w<1180?' nar':''}${PCM()?'':' touch'}" style="height:calc(${top}px * var(--nxs,1))"><div class=nxs>${hubBar(HUBX)}${sub?`<div class=hubsub>${HUBSUB.map(([k,n,js])=>`<button data-q=1 class="${k==cur?'on':''}" onclick="${js}">${n}</button>`).join('')}</div>`:''}</div></div><div class=hubp style="top:calc(${top}px * var(--nxs,1))">${h}</div>`}
// ---------- the Play tab ----------
function hub(){HUBX=null;HUBT='play';UIS='hub';const A=S.ac,d=DIF(),c=cpOK();
const ca=cAcc(),dc=S.dlc==null?1:S.dlc,fr=cFront(ca,dc),si=Math.max(0,secOf(fr)),Sx=SEC[si],sm=Sx.m.filter(m=>m>=0),sb=sm.filter(m=>bBt(ca,dc,m)).length,all=cBeat(A)>=SORD.length;
const run=g=>c&&c.gm==g?`<span class=hcr>Unfinished run · ${edEsc(CH[c.ci].n)} · wave ${c.w} cleared · ${scr(c.p.cash)} <button data-q=1 class=lnk onclick="cpClear();menu()">discard</button></span>`:'';
const cbar=c&&c.gm=='c'?[`CONTINUE · ${edEsc(mpName(cpMap(c)).toUpperCase())} WAVE ${c.w+1}`,'cpResume()']:all?['CAMPAIGN COMPLETE · OPEN THE MAP',"hubCamp()"]:[`PLAY · ${MP[fr].n.toUpperCase()}`,'hubCampGo()'];
const fbar=c&&c.gm=='f'?[`CONTINUE · ${edEsc(mpName(cpMap(c)).toUpperCase())} WAVE ${c.w+1}`,'cpResume()']:['CHOOSE MAP & SURVIVOR',"setGM('f');play()"];
const fm=mapOKA(A,S.mp)?S.mp:0,nf=MP.filter((_,m)=>mapOKA(A,m)).length,sp=PCM();
const card=(cls,img,k,t,desc,prog,bar,on,face)=>`<div class="hcard ${cls}${on?' on':''}"><button data-q=1 class=hcf onclick="${face}"><span class=hci>${img}</span><span class=hcb><span class=hck>${k}</span><span class=hct>${t}</span><span class=hcd>${desc}</span>${prog}</span></button><button data-q=1 class="hcg${on?' go':''}" onclick="${bar[1]}">${bar[0]}${nxi('play',18)}</button></div>`;
const cards=card('hc-c',`<img alt="" src="${cwThumb()}">`,'STORY · 5 SECTIONS','CAMPAIGN','Survive 20 waves on each map, then beat the survivor holding out there.',
 run('c')||`<span class=hcp>${all?'Every map beaten':edEsc(Sx.n)}<i><b style="width:${all?100:Math.round(sb/sm.length*100)}%"></b></i>${all?'':sb+' / '+sm.length}</span>`,cbar,!(c&&c.gm=='f'),"hubCamp()")
+card('hc-f',`<img alt="" src="${mpImg(fm)}">`,'ENDLESS','FREE PLAY',"Endless waves on any map you've opened in the campaign. Chase your best wave.",run('f')||`<span class=hcp>Best wave ${S.best} · ${nf} / ${MP.length} maps open${cmFree().length?' · '+cmFree().length+' custom':''}</span>`,fbar,!!(c&&c.gm=='f'),"setGM('f');play()")
+(sp?card('hc-s',`<img alt="" src="${mpImg(12)||mpImg(0)}">`,'2–4 PLAYERS','SPLIT SCREEN','Couch co-op on one screen. Everyone picks their own survivor.','<span class=hcp>Plug in controllers, then press A to join</span>',['OPEN LOBBY','lobby()'],false,'lobby()'):'');
let dl='';try{const ch=chkC(prA());if(ch)dl=`<div class=hubd><span class=hubdk>DAILY</span>${ch.D.map(q=>`<span class="hubdi${q.f?' dn':''}"><span><span>${CHT[q.k].t(q.n,q.a)}</span><b>${q.f?'DONE ✓':fmt(q.p)+' / '+fmt(q.n)}</b></span><i><em style="width:${Math.min(100,Math.round(q.p/q.n*100))}%"></em></i></span>`).join('')}<button data-q=1 class=lnk onclick="sfx('click');HUBT=HUBX='prog';chals()">all challenges</button></div>`}catch(e){}
const crash=c&&CRL.length&&CRL[0].t>=c.t&&!CRL[0].seen,nt=(crash?cpBanner():'')+olBanner();
show(nxWrap('hub',`${hubBar('play')}<h2 class=sr>PLAY</h2><div class=hubm>${nt?`<div class=hubn>${nt}</div>`:''}<div class=hubc style="--n:${sp?3:2}">${cards}</div>${dl}<div class=hubk><span class=hubsv>Playing as <b>${edEsc(CH[S.ac.un.includes(sel)?sel:0].n)}</b><button data-q=1 class=lnk onclick="hubTab('surv')">change</button></span><span>${kc('Q')}${kc('E')} switch tab</span><span>${kc('ENTER')} select</span>${AU.c&&AU.c.state=='running'?'':'<span id=sndh>tap anywhere to turn on sound</span>'}</div></div>`))}
// the campaign card: its picture is the world map
function cwThumb(){AU.cma=AU.cma||{};if(AU.cma.thumb!=null)return AU.cma.thumb;let u='';try{const a=cWorldArt(.6);u=a&&a.toDataURL?a.toDataURL('image/jpeg',.8):''}catch(e){}return AU.cma.thumb=u}
function hubCamp(){setGM('c');CMLB=0;mapId=campFront();S.mp=mapId;CMV=secOf(mapId);CWIN0=1;play()}
// PLAY on the campaign card: straight into the next map with the survivor you used last
function hubCampGo(){setGM('c');CMLB=0;mapId=campFront();S.mp=mapId;SVD=1;if(!S.ac.un.includes(sel))sel=S.ac.un[0]||0;sfx('click');start()}
