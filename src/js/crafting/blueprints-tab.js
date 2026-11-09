//# crafting/blueprints-tab.js — Progress → Blueprints in the main menu: the workbench and its upgrade, every tier's blueprints, buying with Zombie Pts
// BPS = the picked blueprint (shown in the box at the bottom with its buy button). The page works on the account picked with
// the name button at the top (prA, like Titles), so every profile on the device can spend its own Zombie Pts.
var BPS=null;
function bpTab(){mode='menu';UIS='';HUBT=HUBX='prog';bpNX()}
function bpPick(i){BPS=i;sfx('click');bpTab()}
function bpBuy(i){i=i==null?BPS:i;const A=bpInit(prA());if(DT('unl')||bpBuyWhy(A,i)){sfx('deny');return bpTab()}A.pts-=bpPrice(i);A.bp.push(i);sv();sfx('buy');BPS=i;bpTab()}
function bpUp(){const A=bpInit(prA());if(DT('unl')||bpUpWhy(A)){sfx('deny');return bpTab()}const L=A.bl+1;A.pts-=bpUpC(L);A.bl=L;sv();sfx('power');bpTab()}
function bpNX(){const A=bpInit(prA()),un=DT('unl'),L=un?BPMAX:A.bl,pts=A.pts||0,nt=bpNT(),ci=A.lc!=null&&CH[A.lc]?A.lc:sel||0;
 const own=i=>un||bpTier(i)==0||A.bp.includes(i),nOwn=WP.filter((_,i)=>own(i)).length;
 if(BPS==null||!WP[BPS]){const O=WP.map((_,i)=>i).filter(i=>!own(i)).sort((a,b)=>bpTier(a)-bpTier(b));BPS=O.find(i=>bpTL(bpTier(i))<=L)??O[0]??0}
 // the workbench
 const nx=L+1,why=un?'max':bpUpWhy(A),pips=Array.from({length:BPMAX},(_,k)=>`<i class="${k<L?'on':''}"></i>`).join('');
 let up='';if(why=='max')up=`<div class=bpup><b>Your bench is fully upgraded.</b><span>Every tier is open. Ammo takes ${bpCraftT(L)} s to craft during a wave.</span></div>`;
 else{const c=bpUpC(nx),s=SEC[nx-1],sub=why=='sec'?`Open ${edEsc(s?s.n:'the next section')} in the campaign first`:why=='pts'?`You need ${nxN(c-pts)} more Zombie Pts`:'';
  up=`<div class=bpup><span class=cwk>NEXT · LEVEL ${nx}</span><b>Opens the ${edEsc(bpTn(nx))} blueprints</b><span>Ammo crafting gets faster: ${bpCraftT(L)} s → ${bpCraftT(nx)} s</span><button data-q=1 class="np${why?' no':' go'}" onclick="bpUp()">${why=='sec'?nxi('lock',16):''}UPGRADE · ${nxN(c)} Z${why?'':kc('U')}</button>${sub?`<small>${sub}</small>`:''}</div>`}
 const left=`<section class="hpan bpl"><div class=hph><span class=cwk>YOUR WORKBENCH</span>${hpWho('bpTab')}</div>
<div class=bpbig><canvas data-bnl=${L} width=${BNW[L]} height=${BNH[L]}></canvas></div>
<div class=bplv><span class=cwk>BENCH LEVEL</span><b class=hdt>${L}<small>/ ${BPMAX}</small></b><span class=bppp>${pips}</span></div>
<p class=bpnote>Benches on every map show your level. Between waves a bench sells everything; during a wave it only makes ammo, ${bpCraftT(L)} s a batch.</p>${up}</section>`;
 // the tiers
 let tiers='';for(let t=0;t<=nt;t++){const G=bpGuns(t);if(!G.length)continue;const s=t?SEC[t-1]:null,need=bpTL(t),open=L>=need,col=s?s.c:'#c3d0c4',pr=t?BPG.price[t]||0:0;
  tiers+=`<div class="bptr${open?'':' lk'}" style="--tc:${col}"><div class=bpth><b>${edEsc(bpTn(t)).toUpperCase()}</b><span>${t?`${nxN(pr)} Z each`:'everyone starts with these'}</span><em>${open?(t?'BENCH LV '+need+' ✓':'OWNED'):nxi('lock',13)+'NEEDS BENCH LV '+need}</em></div><div class=bpgs>${G.map(i=>{const o=own(i),can=!o&&open;
   return `<button data-q=1 class="bpg${BPS==i?' on':''}${o?' ow':''}${!o&&!open?' lk':''}" onclick="bpPick(${i})" aria-label="${edEsc(WP[i].n)}">${gunPic(i,ci,96,34)}<b>${wN(ci,i)}</b><small>${o?nxi('check',13)+'OWNED':can?nxN(bpPrice(i))+' Z':'LOCKED'}</small></button>`}).join('')}</div></div>`}
 // the picked blueprint
 const i=BPS,t=bpTier(i),o=own(i),st=shStats(i,ci),bw=un?'own':bpBuyWhy(A,i),c=bpPrice(i);
 const btn=o?`<span class=bpok>${nxi('check',18)}YOU OWN THIS BLUEPRINT</span>`:`<button data-q=1 class="np${bw?' no':' go'}" onclick="bpBuy()">BUY BLUEPRINT · ${nxN(c)} Z${bw?'':kc('ENTER')}</button>`;
 const sub=o?(t?'It shows at every workbench, in the campaign and in Free Play.':'A starting gun: every account has it.'):bw=='lvl'?`Upgrade your bench to level ${bpTL(t)} first`:bw=='pts'?`You need ${nxN(c-pts)} more Zombie Pts`:'Buy it once: it shows at every workbench, in the campaign and in Free Play.';
 const det=`<div class=bpd><div class=bpdp>${gunPic(i,ci,230,70,'big')}</div><div class=bpdi><span class=cwk>${edEsc(bpTn(t)).toUpperCase()} · ${SHK[i]||''}</span><b class=bpdt>${wN(ci,i).toUpperCase()}</b>
<span class=bpds>${st.dmg} damage · ${st.rate} · ${st.mag}</span><span class=bpds>At a workbench: ${scr(WP[i].cost)} each run</span></div><div class=bpda>${btn}<small>${sub}</small></div></div>`;
 const right=`<section class="hpan bpr"><div class=bprh><div><span class=cwk>BLUEPRINTS</span><b class=bpct>${nOwn}<small> / ${WP.length} guns</small></b></div><span class=bppt><b>${nxN(pts)}</b>ZOMBIE PTS</span></div>
<p class=bpnote>A gun shows at the workbench once you own its blueprint. Each tier is a campaign section: upgrade your bench to open it. Zombie Pts come from every run, and the first clear of a map on each difficulty pays double.</p>
<div class=bpts>${tiers}</div>${det}</section>`;
 show(hubPage('prog',left+right,hubSub('bp')));
 try{for(const cv of ui.querySelectorAll('canvas[data-bnl]')){const a=bnArt(+cv.dataset.bnl),g=cv.getContext('2d');cv.width=a.width;cv.height=a.height;g.imageSmoothingEnabled=false;g.clearRect(0,0,a.width,a.height);g.drawImage(a,0,0)}
  const e=ui.querySelector('.bpg.on');if(e&&e.scrollIntoView)e.scrollIntoView({block:'nearest'})}catch(e){}}
// keys on the page: U upgrades the bench, Enter buys the picked blueprint (controllers and arrows move between the cards as on any page)
function bpKey(k){if(UIS!==''||HUBX!='prog'||!ui.querySelector||!ui.querySelector('.bpr'))return 0;if(k=='u'){bpUp();return 1}if(k=='enter'){const A=bpInit(prA());if(DT('unl')||bpBuyWhy(A,BPS))return 0;bpBuy();return 1}return 0}
