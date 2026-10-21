//# editor/playtest.js — Playtest: runs the map being edited with the real game (start(), build(), zombies, combat), keeps nothing the run earns, returns to the editor
// ---------- playtest ----------
// The editor's map is copied to CMPTD and played as map key CMPTK in Free Play. While it runs, sv() is switched off; at the end
// the account (S.ac), best wave and settings the playtest changed are put back exactly as they were, then saved.
let PTX=null;
function ptStart(o){const E=ED;if(!E||PTX)return;
PTX={o,ac:JSON.stringify(S.ac),best:S.best,pts:S.pts,un:JSON.stringify(S.un||[0]),tut:S.tut,gm:GMD,sw:S.sw,dlf:S.dlf,sel};
sv.off=1;CMPTD=cmClone(E.d);edHide();GMD='f';S.sw=o.w;S.dlf=o.dif;sel=o.ci;mapId=CMPTK;keys={};mouse.d=0;
try{start()}catch(err){ptEnd();edModal('The playtest could not start',`<p>${edEsc(err&&err.message||err)}</p>`,[['OK','go',()=>0]])}}
function ptAgain(){if(!PTX)return;const o=PTX.o;S.sw=o.w;S.dlf=o.dif;sel=o.ci;mapId=CMPTK;start()}
// back to the editor, with everything put back
function ptEnd(){if(!PTX)return;const X_=PTX;PTX=null;
const A=S.ac;for(const k of Object.keys(A))delete A[k];Object.assign(A,JSON.parse(X_.ac));S.best=X_.best;S.pts=X_.pts;S.un=JSON.parse(X_.un);if(X_.tut===undefined)delete S.tut;else S.tut=X_.tut;
GMD=X_.gm;S.sw=X_.sw;S.dlf=X_.dlf;sel=X_.sel;sv.off=0;sv();SVD=0;
mode='edit';ui.innerHTML='';L=R=null;mouse.d=0;keys={};zs=[];bs=[];pt=[];ep=[];CMPTD=null;music('menu');duck(1);edShow()}
// the end-of-run screen during a playtest (over() hands over to this)
function ptOver(q){const o=PTX.o;show(`<div class=p><h2 style="color:${q?'var(--ac)':'var(--blood)'}">${q?'PLAYTEST ENDED':'YOU WERE EATEN'}</h2><div class=sum><div><b>${wave}</b><small>Wave</small></div><div><b>${kills}</b><small>Kills</small></div><div><b>${o.w}</b><small>Started at</small></div></div><p class=note>This was a playtest: nothing earned is kept.</p><div class=row><button onclick="ptEnd()">BACK TO EDITOR</button><button class=go onclick="ptAgain()">PLAY AGAIN</button></div></div>`)}
