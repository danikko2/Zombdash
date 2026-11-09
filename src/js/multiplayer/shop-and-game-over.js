//# multiplayer/shop-and-game-over.js — Split-screen shop and game over
// ---------- per-player shop ----------
function shopIt(p){const P0=P;P=p;const AC=pc(Math.round((S.df?800:500)*(1-.1*rk('arm')))),RC=pc(Math.round(30*(1-.1*rk('arm')))),ar=p.ar||0;P=P0;
const a=WP.map((w,i)=>{const o=p.own.includes(i);return{h:`<canvas data-gun=${i} data-ci=${p.ci} data-v=${p.v||0} data-cm=${cmOf(p.ac,i)}></canvas>${wN(p.ci,i)}<small>${o?(p.cur==i?'equipped':'equip'):p.own.length>=INV?'slots full':scr(pc(w.cost,p))}</small>`,c:`${p.cur==i?'on':''} ${!o&&(p.cash<pc(w.cost,p)||p.own.length>=INV)?'no':''}`,f:()=>buy(i)}});
a.push({h:`<span class=ico>+♥</span>Heal +1<small>${scr(pc(25,p))}</small>`,c:p.cash<pc(25,p)||p.hp>=p.mx?'no':'',f:heal},{h:`<span class=ico>♥+</span>Max HP<small>${p.mx>=MXH(p)?'max '+MXH(p):scr(pc(250,p))}</small>`,c:p.mx>=MXH(p)||p.cash<pc(250,p)?'no':'',f:mhp},
{h:`<span class="ico arc">▣</span>${!ar?'Armor +6':ar<6?'Repair':'Armor'}<small>${!ar?scr(AC):ar<6?scr((6-ar)*RC):'full'}</small>`,c:!ar?(p.cash<AC?'no':''):ar>=6||p.cash<RC?'no':'',f:armor});if(!p.am)amInit(p);for(const t in AMI){const I=AMI[t],c=pc(I.cost,p);a.push({h:`<span class=aic style="background:${I.c}"></span>${I.s}<small>${p.am[t]}/${I.max} · +${I.buy} ${scr(c)}</small>`,c:p.am[t]>=I.max||p.cash<c?'no':'',f:()=>amBuy(t)})}{const i=p.cur,st=amSt(p,i);a.push({h:`<span class=ico>⬢</span>Sell ${wN(p.ci,i)}<small>${st?'starter gun':scr(wSV(p,i))} · ${p.own.length}/${INV}</small>`,c:st?'no':'',f:()=>wSell(i)})}return exShopIt(p,a)}
// the store screen itself is drawn by msNX() in ui/split-shop.js; shopIt() above is the item list mb() works on
function mshop(){msNX()}
function mb(pi,j){const p=PL[pi];if(!p)return;P=p;p.sc=j;if(j==RDY(p)){p.rdy=p.rdy?0:1;sfx(p.rdy?'buy':'click');P=PL[0];if(PL.every(q=>q.rdy))return nextWave();return shop()}const it=shopIt(p)[j];if(it)it.f();else shop()}
function shopPads(){return msPads()}
// ---------- multiplayer game over ----------
function overMP(q){for(const p of PL){p.zr=zpEarn(p,!!CWIN,p.k||0);p.ze=p.zr.tot;if(!p.ac.g)p.ac.pts=(p.ac.pts||0)+p.ze}sv();
endMP(q)}
