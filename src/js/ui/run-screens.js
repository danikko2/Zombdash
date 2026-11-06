//# ui/run-screens.js — Pause menu, leaving a run (always asks first), and the end-of-run screens, in the Night Ops look
// ---------- leaving a run ----------
// RXC = the leave dialog: 0 closed, 1 = pick where to go (from the store), 'm' main menu / 'c' campaign map / 'e' end run
// = confirm that choice (from the pause menu). Main Menu and Campaign Map keep a single-player run as a checkpoint, so it
// can be continued later (the Continue bar on the main menu, or the map's panel); End Run finishes it and shows results.
var RXC=0;
function runExit(d){RXC=d||1;sfx('click');rxBack(1)}
function rxBack(keep){if(!keep)RXC=0;if(mode=='shop')return shop();if(mode=='pause')return pauseMenu()}
// can this run be kept to continue later?
function rxCan(){if(MPn||TUT||PTX||cmPT(mapId))return 0;if(mode=='shop')return!(GMD=='c'&&wave>=20);return!!cpOK()}
function rxDlg(){const c=GMD=='c'&&!MPn,can=rxCan(),at=mode=='shop'?wave+1:Math.max(1,wave),d=RXC;
const keep=can?`Your run is kept: continue it from the main menu${c?' or the campaign map':''}, starting at wave ${at}.`:MPn?'Split-screen runs can\'t be kept, so leaving ends the run. Everyone keeps the Zombie Pts and XP they earned.':'This run can\'t be kept yet, so leaving ends it. You keep the Zombie Pts and XP you earned.';
const B=(k,lab,ic,cls)=>`<button data-q=1 class="np ${cls||''}" onclick="rxGo('${k}')">${nxi(ic,18)}${lab}</button>`;
let t,b,btn;
if(d=='e'){t='End this run?';b='You keep the Zombie Pts and XP you earned and see your results. The run can\'t be continued after this.';btn=B('e','END RUN','flag','rxr')}
else if(d=='m'){t='Go to the main menu?';b=keep;btn=B('m','MAIN MENU','home','ya')}
else if(d=='c'){t='Go to the campaign map?';b=keep;btn=B('c','CAMPAIGN MAP','map','ya')}
else{t='Leave the run?';b=keep+' End Run finishes it now and shows your results.';btn=B('m','MAIN MENU','home','ya')+(c?B('c','CAMPAIGN MAP','map','ya'):'')+B('e','END RUN','flag','rxr')}
return `<div class=nxdim><div class=nxdlg role=dialog aria-modal=true aria-label="${t}"><b class=nxdt>${t}</b><p>${b}</p><div class=nxdb><button data-q=1 class=nb onclick="rxBack()">CANCEL${kc('ESC')}</button>${btn}</div></div></div>`}
function rxKey(k){if(k=='escape'){sfx('click');rxBack();return 1}return 0}
function rxGo(d){const can=rxCan(),md=mode;RXC=0;OPF=0;sfx('click');if(d=='e')return quitRun();
L=R=null;try{mouse.d=0}catch(e){}if(md=='shop'&&can)cpSave();
if(!can||!cpOK()){LIVES=0;mode='play';over(1)}
if(d=='c'&&GMD=='c'&&!MPn){setGM('c');CMV=null;CWIN0=0;mode='menu';music('menu');duck(1);return play()}menu()}
// ---------- pause ----------
function pauseNX(){const c=GMD=='c',mp=MPn,pt=PTX;
show(nxWrap('pz',`<div class=pzm><div class=pzp><span class=cwk>${pt?'PLAYTEST':(c?'CAMPAIGN':'FREE PLAY')+(mp?' · SPLIT SCREEN':'')} · ${edEsc(mpName(mapId).toUpperCase())}</span><b class=pzt>PAUSED</b><h2 class=sr>PAUSED</h2>
<div class=ovs><span><b>${wave}</b>WAVE</span><span><b>${nxN(kills)}</b>KILLS</span>${mp?`<span><b>${mp}</b>PLAYERS</span>`:`<span><b>$${nxN(P.cash)}</b>CASH</span>`}${c&&!pt?`<span><b>${LIVES}</b>${LIVES==1?'LIFE':'LIVES'} LEFT</span>`:''}</div>
${mp?'':chMini(P.ac)}<button data-q=1 class="np go" onclick="resume()">RESUME${kc('ESC')}</button><button data-q=1 class="np pzo" onclick="options(1)">OPTIONS</button>
${pt?'<button data-q=1 class="np rxr" onclick="ptEnd()">BACK TO EDITOR<small>ends the playtest</small></button>':`<div class=pzl><span class=cwk>LEAVE THE RUN</span><div class=pzlb><button data-q=1 class=nb onclick="runExit('m')">${nxi('home')}MAIN MENU</button>${c&&!mp?`<button data-q=1 class=nb onclick="runExit('c')">${nxi('map')}CAMPAIGN MAP</button>`:''}<button data-q=1 class="nb rxr" onclick="runExit('e')">${nxi('flag')}END RUN</button></div></div>`}</div></div>${RXC?rxDlg():''}`,'<div class="nxbg pzbg"></div>'))}
// ---------- end of a run ----------
// Every end screen has the same three buttons: Main Menu, then the campaign map (or a new game / the lobby), then the
// main action (#ovgo: Next map, Try again, Continue). Enter presses the main action.
function ovBtns(mid,go){return `<div class=ovb><button data-q=1 class=nb onclick="menu()">${nxi('home')}MAIN MENU</button>${mid?`<button data-q=1 class=nb onclick="${mid[1]}">${nxi(mid[2]||'map')}${mid[0]}</button>`:''}<button data-q=1 id=ovgo class="np go" onclick="${go[1]}">${go[0]}${kc('ENTER')}</button></div>`}
function ovWrap(kick,head,body,btns){return nxWrap('ov',`<div class=ovm><div class=ovp><span class=cwk>${kick}</span>${head}${body}${btns}</div></div>`,'<div class="nxbg ovbg"></div>')}
function ovXP(p){const A=p.ac;return `<div class=ovxp><span class=hublv>${A.lv}</span><div><b>+${p.xg||0} XP${p.lu?' · LEVEL UP!':''}</b><i><em style="width:${Math.min(100,A.xp/xpNeed(A.lv)*100)}%"></em></i><small>${nxN(A.xp)} / ${nxN(xpNeed(A.lv))} XP${(p.xm||1)<1?' · '+Math.round((p.xm||1)*100)+'% XP rate (skipped waves)':''}</small></div></div>`}
// what the middle button and the main button do after a single-player or split-screen run
function ovMid(mp){if(mp)return['LOBBY','lobby()','r'];return GMD=='c'?['CAMPAIGN MAP',"setGM('c');CMV=null;play()",'map']:['NEW GAME',"setGM('f');play()",'play']}
function ovGo(mp){const C=CWIN;if(C){if(C.nx!=null)return[`NEXT: ${MP[C.nx].n.toUpperCase()}`,`campNext(${mp?1:0})`];return['CAMPAIGN MAP',"setGM('c');CMV=null;play()"]}return['TRY AGAIN',mp?'startMP()':'start()']}
function endNX(q,e){const c=GMD=='c',win=!!CWIN,nl=!q&&c&&!win,mid=win&&CWIN.nx==null?['NEW GAME',"setGM('f');play()",'play']:ovMid(0);
show(ovWrap(win?'MAP COMPLETE':(c?'CAMPAIGN':'FREE PLAY')+' · '+edEsc(mpName(mapId).toUpperCase()),win?cwH():`<h2 class="ovt${q?'':' bad'}">${q?'RUN ENDED':'YOU WERE EATEN'}</h2>`,
`<div class=ovs><span><b>${wave}</b>WAVE</span><span><b>${nxN(kills)}</b>KILLS</span><span><b>+${nxN(e)}</b>ZOMBIE PTS</span></div>${ovXP(P)}${runLog(P)}${nl?'<p class=ovn>No lives left: next time this map starts again from wave 1.</p>':''}`,ovBtns(mid,ovGo(0))))}
function endLife(left){show(ovWrap('CAMPAIGN · '+edEsc(mpName(mapId).toUpperCase()),'<h2 class="ovt bad">YOU WERE EATEN</h2>',
`<div class=ovs><span><b>${wave}</b>WAVE</span><span><b class=ovh>${'♥'.repeat(Math.max(0,left))}</b>${left==1?'LIFE LEFT':'LIVES LEFT'}</span><span><b>${nxN(kills)}</b>KILLS</span></div><p class=ovn>${left==1?'⚠ This is your last life! ':''}Continue to try wave ${wave} again with your guns and cash. Leaving now ends the run.</p>`,
`<div class=ovb><button data-q=1 class=nb onclick="lifeMenu()">${nxi('home')}MAIN MENU</button><button data-q=1 class=nb onclick="lifeMap()">${nxi('map')}CAMPAIGN MAP</button><button data-q=1 id=ovgo class="np go" onclick="lifeCont()">CONTINUE${kc('ENTER')}</button></div>`))}
function lifeMap(){if(mode!='lifeo')return;LIVES=0;mode='play';over(1);setGM('c');CMV=null;play()}
function endMP(q){const win=!!CWIN;
show(ovWrap(win?'MAP COMPLETE':(GMD=='c'?'CAMPAIGN':'FREE PLAY')+' · SPLIT SCREEN · '+edEsc(mpName(mapId).toUpperCase()),win?cwH():`<h2 class="ovt${q?'':' bad'}">${q?'RUN ENDED':'THE HORDE WON'}</h2>`,
`<div class=ovs><span><b>${wave}</b>WAVE</span><span><b>${nxN(kills)}</b>TEAM KILLS</span><span><b>${PL.length}</b>PLAYERS</span></div><div class=ovl>`+PL.map((p,i)=>`<div class=ovr style="--pc:${PC[i]}"><b class=px>P${i+1}</b><canvas data-ch=${p.ci} data-v=${p.v||0}></canvas><div class=nm><b>${pnm(p)}${p.ac.g?' · guest':bdH(p.ac)}</b>${ttH(p.ac)}<small>${p.k||0} kills · +${p.ze} Zombie Pts · +${p.xg||0} XP${p.lu?' · LEVEL UP!':''}</small>${p.nt&&p.nt.length?'<small class=unl>'+p.nt.slice(-2).join(' · ')+(p.nt.length>2?' · +'+(p.nt.length-2)+' more':'')+'</small>':''}</div><span class=lv>LV ${p.ac.lv}</span></div>`).join('')+'</div>'+(!q&&GMD=='c'&&!win?'<p class=ovn>No lives left: next time this map starts again from wave 1.</p>':''),
ovBtns(ovMid(1),ovGo(1))))}
// Enter on an end screen = its main button
function endKey(k){if(k=='enter'&&ui.querySelector){const b=ui.querySelector('#ovgo');if(b){b.click();return 1}}return 0}
