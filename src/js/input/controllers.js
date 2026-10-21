//# input/controllers.js — Gamepads and controller menu navigation
// ---------- controllers ----------
let GP=[],seenPad=0;const GPV={};
function padPoll(){let l=[];try{l=typeof navigator!='undefined'&&navigator.getGamepads?navigator.getGamepads():[]}catch(e){}const a=[];
for(const g of l||[]){if(!g||g.connected===false)continue;const b=g.buttons.map(x=>!!(x&&(x.pressed||x.value>.5))),pv=GPV[g.index]||[],ax=g.axes[0]||0,ay=g.axes[1]||0;
b[100]=ay<-.6;b[101]=ay>.6;b[102]=ax<-.6;b[103]=ax>.6;a.push({i:g.index,g,b,jp:k=>!!b[k]&&!pv[k]});GPV[g.index]=b}GP=a;if(a.length&&!seenPad){seenPad=1;if(mode=='menu'&&ui.querySelector&&ui.querySelector('.title'))menu()}}
const PCM=()=>seenPad||(typeof matchMedia!='undefined'&&matchMedia('(any-pointer:fine)').matches);
function padUI(){if(!GP.length)return;const md=mode;
if(md=='splash'||md=='intro'){if(GP.some(q=>q.jp(0)||q.jp(9)))introTap();return}
if(md=='play'){if(GP.some(q=>q.jp(9)))pauseMenu();return}
if(md=='lobby')return lobbyPads();
if(md=='shop'&&MPn)return shopPads();
if(md=='pause'&&GP.some(q=>q.jp(9)))return resume();
if(uiPads())return;navPads()}
// ---------- controller navigation for normal menus ----------
const NAV={on:0,i:0,h:null,pad:null};
function navBtns(){return ui.querySelectorAll?[...ui.querySelectorAll('button,input[type=range]')].filter(b=>b.offsetParent!==null&&!b.disabled):[]}
function navMark(){if(!ui.querySelectorAll)return;ui.querySelectorAll('.pf').forEach(e=>e.classList.remove('pf'));const b=navBtns();if(!b.length)return;NAV.i=cl(NAV.i,0,b.length-1);const e=b[NAV.i];e.classList.add('pf');if(e.scrollIntoView)e.scrollIntoView({block:'nearest'})}
function navNew(){if(!ui.querySelector||mode=='lobby'||(mode=='shop'&&MPn))return;const h2=ui.querySelector('h2,.logo'),h=h2?h2.textContent:'';if(h!==NAV.h){NAV.h=h;const b=navBtns(),g=b.findIndex(e=>e.classList.contains('go'));NAV.i=g<0?0:g}if(NAV.on)navMark()}
function navMove(dx,dy){const b=navBtns();if(!b.length)return;const cur=b[cl(NAV.i,0,b.length-1)];
if(cur.type=='range'&&dx){cur.value=cl(+cur.value+dx*5,0,100);cur.dispatchEvent(new Event('input'));cur.dispatchEvent(new Event('change'));return}
const r=cur.getBoundingClientRect(),cx=r.x+r.width/2,cy=r.y+r.height/2;let best=-1,bs=1e9;
b.forEach((e,i)=>{if(e===cur)return;const q=e.getBoundingClientRect(),x=q.x+q.width/2-cx,y=q.y+q.height/2-cy,al=dx?x*dx:y*dy;if(al<=4)return;const sc=al+(dx?Math.abs(y):Math.abs(x))*2.5;if(sc<bs){bs=sc;best=i}});
if(best>=0){NAV.i=best;navMark();sfx('click')}}
function navPads(){for(const q of GP){let dx=0,dy=0;if(q.jp(12)||q.jp(100))dy=-1;if(q.jp(13)||q.jp(101))dy=1;if(q.jp(14)||q.jp(102))dx=-1;if(q.jp(15)||q.jp(103))dx=1;
if(dx||dy){if(!NAV.on){NAV.on=1;navMark()}else navMove(dx,dy);return}
if(q.jp(0)){NAV.pad=q.i;if(!NAV.on){NAV.on=1;navMark();return}const b=navBtns()[NAV.i];if(b&&b.type!='range'){NAV.on=1;b.click()}return}
if(q.jp(1)){NAV.pad=q.i;const bk=navBtns().find(e=>/^(BACK|CANCEL|RESUME|MENU)/.test(e.textContent.trim()));if(bk){NAV.on=1;bk.click()}return}}}
if(typeof document!='undefined'&&document.addEventListener)document.addEventListener('pointermove',()=>{if(NAV.on&&!(mode=='shop'&&MPn)&&mode!='lobby'){NAV.on=0;if(ui.querySelectorAll)ui.querySelectorAll('.pf').forEach(e=>e.classList.remove('pf'))}});
