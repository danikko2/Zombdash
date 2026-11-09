//# extras/extras.js — Extras: store items that aren't guns (the Headlamp), kept in their own extras slots; buying, selling, store buttons
// Every player has EXG.slots extras slots (2), apart from the INV weapon slots. An extra takes EXI[id].sl of them (the Headlamp 1).
// p.ex = the extras the player owns (ids, in the order bought), p.exp = what was paid for each (selling gives 60% back),
// p.hlo = 1 while the Headlamp's light is on. The numbers live here so GAME BALANCE (Extras tab) can change them.
var EXG={slots:2};
var EXI={hl:{n:'Headlamp',cost:100,sl:1,
 // its light (extras/headlamp.js): r = how far it reaches (px), i = brightness (1 = full light at the lamp on a night map),
 // w = how wide the beam is (degrees, edge to edge), fd = how it fades going out (0 = even all the way, 1 = steadily, 2+ = fast)
 r:300,i:1,w:50,fd:1}};
var EXL=Object.keys(EXI);
// a player from an older checkpoint (or made before extras existed) has none yet
function exFix(p){if(!p)return;if(!Array.isArray(p.ex))p.ex=[];p.ex=p.ex.filter((id,i,a)=>EXI[id]&&a.indexOf(id)==i);if(!p.exp||typeof p.exp!='object')p.exp={};p.hlo=p.hlo&&p.ex.includes('hl')?1:0}
function exHas(p,id){return!!(p&&p.ex&&p.ex.includes(id))}
function exUsed(p){let n=0;for(const id of(p&&p.ex)||[])if(EXI[id])n+=EXI[id].sl;return n}
function exFits(p,id){return exUsed(p)+EXI[id].sl<=EXG.slots}
function exSV(p,id){return Math.round((p.exp&&p.exp[id]!=null?p.exp[id]:pc(EXI[id].cost,p))*.6)}
// the store button: buys the extra; once it's owned the same button uses it (the Headlamp: light on / off)
function exBuy(id){const I=EXI[id];if(!I)return;exFix(P);
if(exHas(P,id))exUse(P,id);else if(!exFits(P,id))sfx('deny');
else{const c=pc(I.cost);if(P.cash>=c){P.cash-=c;P.exp[id]=c;P.ex.push(id);if(id=='hl')P.hlo=1;sfx('buy')}else sfx('deny')}shop()}
function exUse(p,id){if(id=='hl')hlTog(p)}
function exSell(id){exFix(P);if(!exHas(P,id)){sfx('deny');return shop()}P.cash+=exSV(P,id);P.ex=P.ex.filter(k=>k!==id);delete P.exp[id];if(id=='hl')P.hlo=0;sfx('coin');shop()}
// what the store button's small line says
function exTxt(p,id){const I=EXI[id];if(exHas(p,id))return id=='hl'?(p.hlo?'light ON':'light OFF'):'owned';return exFits(p,id)?scr(pc(I.cost,p)):'extras full'}
// single-player store: one button per extra (after Armor), and the EXTRAS slots under the weapon slots
function exBtns(p){exFix(p);return EXL.map(id=>{const o=exHas(p,id),c=pc(EXI[id].cost,p);return `<button data-q=1 class="${o&&id=='hl'&&p.hlo?'on':''} ${!o&&(p.cash<c||!exFits(p,id))?'no':''}" onclick="exBuy('${id}')"><canvas data-ex=${id}></canvas>${EXI[id].n}<small>${exTxt(p,id)}</small></button>`}).join('')}
function exInv(p){exFix(p);const sl=[];
for(const id of p.ex){const I=EXI[id];sl.push(`<div class="isl ${id=='hl'&&p.hlo?'on':''}"><small>extra ${sl.length+1}</small><canvas data-ex=${id}></canvas><b>${I.n}</b>${id=='hl'?`<button data-q=1 class=sel onclick="exBuy('hl')">LIGHT ${p.hlo?'ON':'OFF'}</button>`:''}<button data-q=1 class=sel onclick="exSell('${id}')">SELL ${scr(exSV(p,id))}</button></div>`);
 for(let j=1;j<I.sl;j++)sl.push(`<div class="isl em"><small>extra ${sl.length+1}</small><span>${I.n}</span></div>`)}
while(sl.length<EXG.slots)sl.push(`<div class="isl em"><small>extra ${sl.length+1}</small><span>empty</span></div>`);
const help=sl.length%4?`<div class="isl em xh" style="grid-column:span ${4-sl.length%4}"><span>${exHas(p,'hl')?'Light on/off: F key · controller B · LIGHT button':'Extras don\'t use a weapon slot'}</span></div>`:'';
return `<h3 class=shh>EXTRAS ${exUsed(p)}/${EXG.slots}</h3><div class=sinv>${sl.join('')}${help}</div>`}
// split-screen store: a button per extra (buy, then light on / off) and a sell button once it's owned
function exShopIt(p,a){exFix(p);for(const id of EXL){const I=EXI[id],o=exHas(p,id),c=pc(I.cost,p);
 a.push({h:`<canvas data-ex=${id}></canvas>${I.n}<small>${exTxt(p,id)}</small>`,c:`${o&&id=='hl'&&p.hlo?'on':''} ${!o&&(p.cash<c||!exFits(p,id))?'no':''}`,f:()=>exBuy(id)});
 if(o)a.push({h:`<span class=ico>⬢</span>Sell ${I.n}<small>${scr(exSV(p,id))} · extras ${exUsed(p)}/${EXG.slots}</small>`,c:'',f:()=>exSell(id)})}return a}
// the store's pictures of the extras (paintUI in ui/core-ui.js)
function exPaint(root){for(const cv of root.querySelectorAll('canvas[data-ex]')){const X_=XS[cv.dataset.ex],f=X_&&X_.ico,g=cv.getContext('2d');cv.width=64;cv.height=24;g.imageSmoothingEnabled=false;if(!f||!PIMG.naturalWidth)continue;const k=Math.min(60/f[2],22/f[3]);g.drawImage(PIMG,f[0],f[1],f[2],f[3],(64-f[2]*k)/2,(24-f[3]*k)/2,f[2]*k,f[3]*k)}}
