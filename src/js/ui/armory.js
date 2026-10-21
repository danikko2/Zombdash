//# ui/armory.js — Armory and challenge screens, gun progress in codes
// ----- screens -----
function prA(){const L=ACS();if(PRI>=L.length)PRI=0;return L[PRI]}
function prSw(fn){return ACS().length>1?`<button class=lnk data-q=1 onclick="PRI=(PRI+1)%ACS().length;${fn}()">${prA().name||'Survivor'} ▸ switch player</button>`:''}
function armory(gi){UIS='arm';mode='menu';if(gi!=null){if(gi!==ARG)sfx('click');ARG=gi}const A=prA();wpA(A);const ci=A===S.ac?sel:(A.un||[0]).includes(sel)?sel:0;
show(`<div class="p wide arm"><h2>ARMORY</h2><div class=prl>${prSw('armory')}<span class=note>Gold guns ${golds(A)}/${WP.length} · Diamond unlocks at 5 · Outbreak at ${WP.length}</span></div><div class=acols><div class=ag>${WP.map((w,i)=>{const p=A.wp[i];return `<button data-q=1 class="${i==ARG?'on':''}" onclick="armory(${i})"><canvas data-cg=${i} data-ci=${ci} data-cm=${cmOf(A,i)}></canvas>${w.n}<small>LV ${p.l}${c6(p)?' ★':''}</small><span class=mb><i style="width:${p.l>=WMAX?100:Math.round(p.x/wNeed(p.l)*100)}%"></i></span></button>`}).join('')}</div>
<div class=adet>${armDet(A,ARG,ci)}</div></div><div class=row><button onclick="UIS='';menu()">BACK</button></div></div>`)}
function armDet(A,g,ci){const p=wpA(A)[g],w=WP[g],eq=cmOf(A,g);
return `<div class=ahd><canvas class="big anim" data-cg=${g} data-ci=${ci} data-cm=${eq} data-w=160 data-h=64></canvas><div><b class=sn>${w.n}</b><div class=alv><span class=lv>LV ${p.l}</span><div class=xpb><i style="width:${p.l>=WMAX?100:Math.round(p.x/wNeed(p.l)*100)}%"></i></div></div><small class=note>${p.l>=WMAX?'MAX LEVEL':fmt(p.x)+'/'+fmt(wNeed(p.l))+' weapon XP'} · ${fmt(p.k)} kills</small></div></div>
<div class=pk>${WPK.map(([l,t])=>`<span class="${p.l>=l?'on':''}">${p.l>=l?'✓':'LV '+l} · ${t}</span>`).join('')}</div>
<div class=cg>${CAMO.map((c,i)=>{const ok=camoOK(A,g,i);return `<button data-q=1 class="${eq==i?'on':''} ${ok?'':'lk'}" onclick="eqCam(${g},${i})"><canvas data-cg=${g} data-ci=${ci} data-cm=${i} data-w=72 data-h=28></canvas><b>${c.n}</b><small>${ok?(eq==i?'equipped':'equip'):cProg(A,g,i)}</small></button>`}).join('')}</div>
<p class=note id=cmn>${CAMO[eq].n} equipped. Tap a locked camo to see how to unlock it.</p>`}
function eqCam(g,i){const A=prA();if(!camoOK(A,g,i)){sfx('deny');const m=document.getElementById('cmn');if(m)m.textContent=`${CAMO[i].n}: ${CAMO[i].d} Progress: ${cProg(A,g,i)}.`;return}wpA(A);A.cm[g]=i;sv();sfx('buy');armory()}
function tLeft(ms){const h=Math.floor(ms/36e5),m=Math.floor(ms%36e5/6e4);return h>=24?Math.floor(h/24)+'d '+h%24+'h':h+'h '+m+'m'}
function chals(){UIS='ch';mode='menu';const A=prA(),c=chkC(A),now=new Date(),tm=new Date(now.getFullYear(),now.getMonth(),now.getDate()+1),wk=new Date(now.getFullYear(),now.getMonth(),now.getDate()+7-(now.getDay()+6)%7);
const card=(q,i,per)=>{const R=CHR[per];return `<div class="chc ${q.f?'dn':''}"><div class=cht><b>${CHT[q.k].t(q.n,q.a)}</b><small>+${R.x} XP · +${R.z} Zombie Pts</small></div><div class=chb><span class=mb><i style="width:${Math.round(q.p/q.n*100)}%"></i></span><small>${q.f?'DONE ✓':fmt(q.p)+'/'+fmt(q.n)}</small></div>${per=='d'&&!q.f&&!c.rr?`<button data-q=1 class=rr onclick="reroll(${i})" aria-label="Swap this challenge">↻</button>`:''}</div>`};
show(`<div class="p wide chl"><h2>CHALLENGES</h2><div class=prl>${prSw('chals')}</div>
<div class=chh><b>DAILY</b><small>new in ${tLeft(tm-now)}</small></div>${c.D.map((q,i)=>card(q,i,'d')).join('')}<p class="note chbn ${c.db?'dn':''}">${c.db?'✓ ':''}All 3 dailies: +${CHR.d.bz} Zombie Pts${c.rr?'':' · ↻ swaps a challenge (once a day)'}</p>
<div class=chh><b>WEEKLY</b><small>new in ${tLeft(wk-now)}</small></div>${c.W.map((q,i)=>card(q,i,'w')).join('')}<p class="note chbn ${c.wb?'dn':''}">${c.wb?'✓ ':''}All 3 weeklies: +1 Skill Point and +${CHR.w.bz} Zombie Pts</p>
<div class=row><button onclick="UIS='';menu()">BACK</button></div></div>`)}
// ----- account codes carry gun progress -----
function gEnc(A){const W=wpA(A);return W.map((w,i)=>[w.x,w.l,w.k,w.n,w.m,w.h,w.b,A.cm[i]||0].map(v=>Math.max(0,v|0).toString(36)).join('-')).join('_')}
function gDec(s,A){const G=s.toLowerCase().split('_');if(G.length!=WP.length)return 0;const wp=[],cm=[];for(const q of G){const v=q.split('-').map(x=>/^[0-9a-z]+$/.test(x)?parseInt(x,36):NaN);if(v.length!=8||v.some(isNaN))return 0;wp.push({x:v[0],l:cl(v[1],1,WMAX),k:v[2],n:v[3],m:v[4],h:v[5],b:v[6]});cm.push(cl(v[7],0,CAMO.length-1))}A.wp=wp;A.cm=cm;return 1}

