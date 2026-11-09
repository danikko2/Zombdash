//# crafting/break.js — The break between waves: up to two minutes with no zombies, a big countdown, readying up, the bench buttons on screen
// ---------- the break ----------
// BRK = {t seconds left, T length, k kind}: k 0 a wave was just cleared, 1 the run starts on a later wave, 2 a kept run resumed.
// The game keeps running (mode 'play'): players walk to a bench to buy. In one-player games the bench opens the full store
// (mode 'shop'), and the countdown keeps going there. Readying up skips the rest; with several players the next wave starts
// when everyone is ready or the time runs out. The length is BPG.brk (Game Balance → Blueprints).
var BRK=null,BXK='';const BX=document.getElementById('bx');
function brkLen(){return Math.max(5,Math.round(+BPG.brk||120))}
function brkLenTxt(){const s=brkLen(),m=Math.floor(s/60),r=s%60;return m?(m+' minute'+(m>1?'s':'')+(r?' '+r+' s':'')):s+' seconds'}
function brkClock(t){t=Math.max(0,Math.ceil(t));return Math.floor(t/60)+':'+String(t%60).padStart(2,'0')}
function brkStart(kind){kind=kind||0;if(DT('money'))for(const p of PL)p.cash=999999;
 if(kind==0){if(!MPn&&!CPR)setTimeout(cpSave,0);sfx('clear');for(const p of PL){P=p;gainXP(10+4*wave);chEv(p,'clear',1)}if(SVD){SVD=0;sv()}P=PL[0]}
 music('menu');duck(.85);ET=0;
 for(const p of PL){p.rdy=0;p.bo=null;p.sx=null;p.sc0=p.cash;amFill(p);if(p.dead)respawn(p);if(p.dn){p.dn=0;p.rv=0;p.hp=Math.max(1,Math.ceil(p.mx*.34));p.inv=2}}
 BRK={t:brkLen(),T:brkLen(),k:kind};for(const d of DR)d.l=Math.max(d.l,BRK.t+1);
 mode='play';L=R=null;ui.innerHTML='';bxSet('');P=PL[0]}
function brkTick(dt){if(!BRK)return;const s0=Math.ceil(BRK.t);BRK.t-=dt;const s1=Math.ceil(BRK.t);if(s1!==s0&&s1<=10&&s1>0)sfx('click');
 if(s1!==s0&&(mode=='shop'||MPn))brkDom();if(BRK.t<=0)brkEnd()}
function brkEnd(){BRK=null;for(const p of PL){p.bo=null;p.rdy=0}bxSet('');nextWave()}
// ready (v=1), not ready (v=0) or switch; one player: the wave starts now
function brkRdy(p,v){p=p||P;if(!p)return;if(!BRK){if(mode=='shop'||mode=='play'&&!MPn)return nextWave();return}const r=v==null?(p.rdy?0:1):v;if(!MPn){if(r)brkEnd();return}
 if(r==(p.rdy?1:0))return;p.rdy=r;if(r)p.bo=null;sfx(r?'buy':'click');P=PL[0];if(PL.every(q=>q.rdy))return brkEnd();shop()}
// the store's countdown (one player at a bench)
function brkDom(){for(const r of[ui,BX])try{const L=r.querySelectorAll?r.querySelectorAll('.brkt'):[];for(const e of L){e.textContent=brkClock(BRK?BRK.t:0);if(e.classList)e.classList.toggle('hot',!!BRK&&BRK.t<=10)}}catch(e){}}
// ---------- the countdown on the game screen ----------
// The clock sits in the small panel at the top right ("WAVE 4 IN 1:47", where "LEFT 23" is during a wave; world-and-hud.js).
// Under the minimap: a short hint line, and in split screen who is ready.
function brkHud(){if(!BRK||mode!='play'||!P)return;const F='VT323, ui-monospace, monospace',x=W-12;let y=(BNMB||74)+12;X.textAlign='right';X.font='17px '+F;
 const pad=bnPad(P),near=bnNear(P)>=0,t=MPn?(near?(pad?'A':'E')+' open the bench · ':'')+(pad?'VIEW':'ENTER')+' ready':bnTch()?'':(near?'E open the bench · ':'walk to a bench to shop · ')+'ENTER ready';
 const sh=s=>{X.lineWidth=3;X.strokeStyle='#070a08';X.strokeText(s,x,y);X.fillText(s,x,y)};
 if(t){X.fillStyle='#c3d0c4';sh(t);y+=18}
 if(MPn){X.fillStyle='#e9f1e2';sh(PL.map((q,i)=>'P'+(i+1)+(q.rdy?' ready':q.bo?' at bench':' not ready')).join('  '))}}
// ---------- buttons over the game (one player): READY in the break, the bench button on touch screens ----------
function bxSet(h){if(h===BXK)return;BXK=h;try{BX.innerHTML=h}catch(e){}}
function bnDom(){if(MPn)return;if(mode!='play'||!P||TUT){bxSet('');return}const near=alive(P)?bnNear(P):-1;let h='';
 if(BRK)h+=`<button data-q=1 class="bxr" style="top:${(BNMB||74)+(bnTch()?6:28)}px" onclick="brkRdy(P,1)">READY · WAVE ${wave+1}</button>`;
 if(near>=0&&bnTch()){const j=P.bj&&P.bj[near],t=BRK?'OPEN BENCH':j?(j.t>=j.T?'COLLECT':''):bnAmmo(P)?'MAKE AMMO':'';if(t)h+=`<button data-q=1 class="bxu" onclick="bnUse(P)"><b>${t}</b>${BRK?'':`<small>${j?'':pc(AMI[bnAmmo(P)].cost,P)+' Scrap'}</small>`}</button>`}
 bxSet(h)}
// ---------- keys and controllers while playing ----------
// keyboard: E uses the bench, Enter is ready; with the store of the keyboard player open in split screen its keys go there
function bnKey(k){const pi=PL.findIndex(p=>p.inp=='km'||p.inp=='any');if(pi<0)return 0;const p=PL[pi];
 if(MPn&&p.bo){if(k=='escape')bnLeave(pi);else msKey(k);return 1}
 if(k=='e')return bnUse(p)?1:0;if(k=='enter'&&BRK){brkRdy(p,MPn?null:1);return 1}return 0}
// controllers: A uses the bench, VIEW / BACK is ready; a player with their store open uses it (split screen)
function bnPads(){let used=0;for(const q of GP){const pi=PL.findIndex(p=>p.inp===q.i||p.inp=='any');if(pi<0)continue;const p=PL[pi];
 if(MPn&&p.bo){if(msPad1(pi,q))used=1;continue}
 if(q.jp(0)&&bnUse(p))used=1;else if(q.jp(8)&&BRK){brkRdy(p,MPn?null:1);used=1}}return used}
