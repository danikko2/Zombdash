//# zombies/spawn-system.js — Zombie classes (ZC), caps and schedule (ZCFG), campaign sections, spawn manager
// =====================================================================================
// ZOMBIE CLASSES, SPAWN CAPS AND THE NEW-TYPE SCHEDULE
// Every balance knob for regular zombies lives in ZC and ZCFG below. The wave manager
// (zPick / zSecT / zQ / zPlan / zWaveN) reads only these tables.
// Bosses, survivors, their clones and ghosts are not listed, so the caps ignore them.
// =====================================================================================
// key = ZT index · tier 1 easiest … 3 hardest · cat = behavior categories (a type may have several)
// sp = counts as "special" · rg = counts as "ranged" · w = spawn weight in regular waves
// max = most of this type alive at once outside its own intro wave (optional)
// of = offspring of another type (never scheduled; unlocked together with its parent)
// free = never counted by the caps (only its parent was) and never blocked by them
var ZC={
 0:{n:'Walker',tier:1,cat:['Standard'],sp:0,rg:0,w:5},
 1:{n:'Runner',tier:1,cat:['Fast'],sp:1,rg:0,w:3},
 2:{n:'Brute',tier:1,cat:['Strong'],sp:0,rg:0,w:2},
 3:{n:'Dasher',tier:2,cat:['Fast'],sp:1,rg:0,w:2},
 4:{n:'Splitter',tier:2,cat:['Strong'],sp:1,rg:0,w:1.5},
 5:{n:'Splitling',tier:1,cat:['Fast'],sp:0,rg:0,w:0,of:4,free:1},
 9:{n:'Bones',tier:3,cat:['Ranged'],sp:0,rg:1,w:2},
 10:{n:'Toxic',tier:1,cat:['Explosive'],sp:0,rg:0,w:2},
 11:{n:'Toxic the Spitter',tier:2,cat:['Ranged'],sp:0,rg:1,w:2},
 14:{n:'People Eater',tier:3,cat:['Fast'],sp:1,rg:0,w:2},
 18:{n:'Exploder',tier:2,cat:['Explosive'],sp:1,rg:0,w:2},
 19:{n:'Healer',tier:2,cat:['Healer'],sp:1,rg:0,w:1.2,max:3},
 20:{n:'Rotwood',tier:3,cat:['Strong'],sp:1,rg:0,w:1.5}
};
var ZCFG={
 // most ranged / special zombies allowed, as % of the zombies spawned SO FAR THIS WAVE · [Easy, Normal, Hard]
 // (counting the whole wave means kills can never push a wave over its cap)
 cap:{rg:[15,15,20],sp:[35,35,45]},
 // a new type every 3 waves starting at wave 3; a boss wave pushes it to the next wave
 intro:{first:3,every:3,mult:{sp:.6,rg:.4,other:.8},min:1,max:0}, // max 0 = no upper limit
 // waves 1-20 introduce only ONE ranged type: this one (11 = Toxic the Spitter, 9 = Bones).
 // The other ranged type stays locked until after wave 20.
 early:{end:20,ranged:11,campaign:[11,9]},
 // ^ free play always uses `ranged`; campaign levels pick one of `campaign` at random (see camp below)
 // introduction order: tier 1 types first, then tier 2, then tier 3 (random order inside a tier).
 // Put ZT numbers in `fixed` (e.g. [1,10,2,...]) for an exact order instead.
 fixed:null,
 // after its intro wave a type starts at 35% of its spawn weight and reaches 100% after this many waves
 ramp:{1:0,2:3,3:6},
 filler:0, // always-unlocked type used when everything else is capped (Walker)
 bossEvery:10,
 // ---- campaign: each section (SEC order) sets its own line-up ----
 // pre   = tiers of the types already unlocked at wave 1 (random types of that tier, never ranged)
 // slots = what each new-type wave (3, 6, 9, 12, 15, 18) brings: a tier number, or 'r' for the level's ranged type
 //         (if a tier has no unused type left, the closest tier is used, easier first)
 // sp    = special cap % on Easy/Medium; Hard adds campHard
 // ranged = which ranged types this section may pick from (default early.campaign)
 camp:[
  {pre:[],      slots:[1,1,1,2,2,'r'], sp:25, ranged:[11]},  // 1 Hometown: no Bones yet
  {pre:[],      slots:[1,1,2,2,2,'r'], sp:30},               // 2 Wrong Turn
  {pre:[1],     slots:[2,2,'r',2,2,3], sp:35},               // 3 Zombville
  {pre:[1,1],   slots:[2,'r',2,3,2,3], sp:40},               // 4 Countryside
  {pre:[1,1,2], slots:[2,'r',2,3,2,3], sp:45}                // 5 Island (and anything after)
 ],
 campHard:10
};
function zCamp(){try{if(GMD!='c'||typeof secOf!='function')return null;const s=secOf(mapId);return s<0?null:ZCFG.camp[Math.min(s,ZCFG.camp.length-1)]}catch(e){return null}}
function zCapSp(d){const c=zCamp();return c?c.sp+(d==2?ZCFG.campHard:0):ZCFG.cap.sp[d]}
// campaign schedule for one level from its section's line-up
function zPlanCamp(K){const R={},used=new Set(),rg=t=>!!ZC[t].rg,pool=Object.keys(ZC).map(Number).filter(t=>ZC[t].of==null&&t!=ZCFG.filler);
 const pick=tier=>{const ks=[1,2,3].sort((a,b)=>Math.abs(a-tier)-Math.abs(b-tier)||a-b);for(const k of ks){const g=pool.filter(t=>!used.has(t)&&!rg(t)&&ZC[t].tier==k);if(g.length){const t=g[Math.random()*g.length|0];used.add(t);return t}}return null};
 for(const tr of K.pre||[]){const t=pick(tr);if(t!=null)R[t]=0}
 const rc=(K.ranged||ZCFG.early.campaign||[ZCFG.early.ranged]).filter(t=>ZC[t]&&rg(t)),er=rc.length?rc[Math.random()*rc.length|0]:null;
 const W=[],usedW=new Set();for(let i=0;i<K.slots.length;i++){let v=ZCFG.intro.first+i*ZCFG.intro.every;while(zBossW(v)||usedW.has(v))v++;usedW.add(v);W.push(v)}
 K.slots.forEach((sl,i)=>{if(sl=='r'){if(er!=null&&R[er]==null){R[er]=W[i];used.add(er)}}else{const t=pick(sl);if(t!=null)R[t]=W[i]}});
 return R}
// Exploder, Healer and Rotwood tuning
var ZX={trig:46,fuse:.55,rad:72,dmg:2},ZH={every:6,r:170,pct:.4,glow:3,keep:200},
 // Rotwood: starts a swing when a player is within `reach`, winds up for `wind` s, hits everyone inside the `arc` (radians) in front
 ZR={reach:66,wind:.6,arc:2.3,dmg:2,cd:2.2};

function zBossW(v){return v%ZCFG.bossEvery==0}
function zDi(){try{return cl(DIF(),0,2)}catch(e){return 1}}
// the new-type schedule for one run: {ZT index: wave it is introduced}
function zPlan(){{const K=zCamp();if(K)return zPlanCamp(K)}const C=ZCFG,ty=Object.keys(ZC).map(Number).filter(t=>ZC[t].of==null&&t!=C.filler);let o=[];
 if(C.fixed&&C.fixed.length){o=C.fixed.filter(t=>ty.includes(t));o.push(...ty.filter(t=>!o.includes(t)))}
 else{const tr=[...new Set(ty.map(t=>ZC[t].tier))].sort((a,b)=>a-b);for(const k of tr){const g=ty.filter(t=>ZC[t].tier==k);for(let i=g.length-1;i>0;i--){const j=Math.random()*(i+1)|0;[g[i],g[j]]=[g[j],g[i]]}o.push(...g)}}
 // intro slots: first, first+every, … ; a boss wave moves that slot to the next wave
 const W=[],used=new Set();for(let i=0;i<o.length*2+4;i++){let v=C.intro.first+i*C.intro.every;while(zBossW(v)||used.has(v))v++;used.add(v);W.push(v)}
 // fill the slots in order, but only ONE ranged type may land in waves 1..early.end (the configured one);
 // the configured one is pulled forward if it would otherwise miss that window
 const E=C.early,rg=t=>!!ZC[t].rg,er0=E.ranged,er=ZC[er0]&&rg(er0)?er0:null,q=o.slice(),R={};let k=0,nr=0;
 while(q.length&&k<W.length){const v=W[k],nx=W[k+1]||1e9;k++;let i=0;
  if(v<=E.end){if(er!=null&&q.includes(er)&&nx>E.end)i=q.indexOf(er);else i=q.findIndex(t=>!rg(t)||(nr==0&&(er==null||t===er)));if(i<0)continue}
  const t=q.splice(i,1)[0];R[t]=v;if(v<=E.end&&rg(t))nr++}
 return R}
// the type being introduced this wave (or null)
function zIntro(w=wave){if(!(w>0))return null;for(const t in IW)if(IW[t]==w&&ZC[t])return +t;return null}
function zUnl(t){const c=ZC[t];if(!c)return false;if(t==ZCFG.filler)return true;if(c.of!=null)return zUnl(c.of);return IW[t]!=null&&IW[t]<=wave}
// living classified zombies, including ones queued to join this frame
function zCen(){const C={n:0,r:0,s:0,b:{}};for(const L of[zs,nq])for(const z of L){if(!(z.hp>0))continue;const c=ZC[z.t];if(!c||c.free)continue;C.n++;if(c.rg)C.r++;if(c.sp)C.s++;C.b[z.t]=(C.b[z.t]||0)+1}return C}
// does one more of type t fit under the caps? true, or the reason it doesn't. Uses this wave's totals so far,
// integer-only maths: (count+1)/(spawned+1) <= pct/100  ⇔  (count+1)*100 <= pct*(spawned+1)
function zFits(t,C){const c=ZC[t];if(!c||c.free)return true;const it=zIntro();if(it!=null&&(t==it||c.of==it))return true;const d=zDi(),W=ZD.tw,n1=W.n+1;
 if(c.rg&&(W.r+1)*100>ZCFG.cap.rg[d]*n1)return'ranged';if(c.sp&&(W.s+1)*100>zCapSp(d)*n1)return'special';if(c.max&&(C.b[t]||0)>=c.max)return'max';return true}
function zOK(t,C,nl){if(!nl&&!zUnl(t))return'locked';const it=zIntro();if(it!=null&&t!=it&&ZC[t].of!=it)return'intro';return zFits(t,C)}
function zW(t){const c=ZC[t],r=(ZCFG.ramp||{})[c.tier]||0;if(!r||IW[t]==null||IW[t]<=0)return c.w;return c.w*Math.min(1,.35+.65*Math.max(0,wave-IW[t])/r)}
function zPool(){const A=[];for(const k in ZC){const t=+k,c=ZC[t];if(c.of!=null||!(c.w>0)||!zUnl(t))continue;A.push([t,zW(t)])}return A}
function zRoll(A){let r=Math.random()*A.reduce((q,w)=>q+w[1],0);for(const[i,w]of A){r-=w;if(r<=0)return i}return A.length?A[A.length-1][0]:null}
// ---- diagnostics state ----
var ZD={w:0,it:null,rj:{special:0,ranged:0,max:0,locked:0,intro:0},dl:0,ev:null,wt:0,log:[],tw:{n:0,r:0,s:0}};
function zTally(t){const c=ZC[t];if(!c||c.free)return;const W=ZD.tw;W.n++;if(c.rg)W.r++;if(c.sp)W.s++}
function zEv(m){ZD.ev={m,t:performance.now()};if(ZDON()){ZD.log.unshift(m);ZD.log.length=Math.min(ZD.log.length,4);try{console.log('[spawn] wave '+wave+': '+m)}catch(e){}}}
// pick the next regular wave zombie (null = wait, nothing fits right now)
function zPick(){const C=zCen(),it=zIntro();
 if(it!=null){if(WRC&&!(WRC.rp&&WRC.i<WRC.t.length)){WRC.t.push(it);WRC.i=WRC.t.length}else if(WRC)WRC.i++;ZD.wt=0;zTally(it);return it}
 if(WRC&&WRC.rp&&WRC.i<WRC.t.length){const t=WRC.t[WRC.i++],f=zOK(t,C);if(f===true){ZD.wt=0;zTally(t);return t}zEv('replayed '+(ZC[t]?ZC[t].n:t)+' skipped ('+f+')')}
 const A=zPool();let t=zRoll(A);const f=t==null?'none':zFits(t,C);
 if(f!==true){if(ZD.rj[f]!=null)ZD.rj[f]++;const B=A.filter(([u])=>zFits(u,C)===true),u=B.length?zRoll(B):null;
  if(u!=null){zEv((t!=null?ZC[t].n:'?')+' rejected ('+f+' cap) → spawned '+ZC[u].n);t=u}
  else if(ZD.tw.n==0||ZD.wt>4){t=ZCFG.filler;zEv('everything capped for '+ZD.wt.toFixed(1)+'s → '+ZC[t].n)}
  else{ZD.dl++;zEv('spawn delayed: '+(t!=null?ZC[t].n:'?')+' ('+f+' cap), nothing else fits');return null}}
 ZD.wt=0;zTally(t);if(WRC){WRC.t.push(t);WRC.i=WRC.t.length}return t}
// secondary spawns (splits, summons): the type to use, or the fallback, or null when neither may appear
// nl = ignore whether t is unlocked yet (Juggernaut's Runners)
function zSecT(t,fb,nl){const C=zCen(),f=zOK(t,C,nl);if(f===true)return t;if(ZD.rj[f]!=null)ZD.rj[f]++;
 if(fb!=null&&fb!==t&&zOK(fb,C)===true){zEv((ZC[t]?ZC[t].n:t)+' summon '+f+' → '+ZC[fb].n);return fb}zEv((ZC[t]?ZC[t].n:t)+' summon/split blocked ('+f+')');return null}
// queue an already-built zombie object if it is allowed to appear
function zQ(o){if(zSecT(o.t)==null)return null;o.m0=o.m0||o.hp;nq.push(o);return o}
// how many zombies this wave sends (n = the normal count, already scaled for players/difficulty)
function zWaveN(n){const it=zIntro(),I=ZCFG.intro;ZD={w:wave,it,rj:{special:0,ranged:0,max:0,locked:0,intro:0},dl:0,ev:null,wt:0,log:ZD.log||[],tw:{n:0,r:0,s:0}};if(it==null)return n;const c=ZC[it],k=c.sp?I.mult.sp:c.rg?I.mult.rg:I.mult.other;let v=Math.max(I.min,Math.round(n*k));if(I.max>0)v=Math.min(v,I.max);ZD.n0=n;ZD.k=k;ZD.n=v;
 if(ZDON())try{console.log('[spawn] wave '+wave+' introduces '+c.n+': '+v+' of them (normal '+n+' × '+Math.round(k*100)+'%)')}catch(e){}return v}

