//# campaign/modes.js — Campaign / free play mode, map order, campaign end screens
// ---------- campaign & free play ----------
// campaign order: Suburb → School → Warehouse → Graveyard → Old West → Campground → Military Base → Neighborhood
const CORD=[0,3,1,14,15,8,2,9,10,16,11,12,13,17,7,4,6,5];
let GMD=S.gm=='c'?'c':'f';
function cpOf(A){if(!A)return 0;if(A.cp==null){let n=0;while(n<OLDC.length&&(A.un||[]).includes(MUN[OLDC[n]]))n++;A.cp=n;A.cv=4}else{if(A.cv!==2&&A.cv!==3&&A.cv!==4){if(A.cp>=4)A.cp++;A.cv=2}if(A.cv===2){if(A.cp>=5)A.cp+=3;A.cv=3}if(A.cv===3){if(A.cp>=8)A.cp+=2;A.cv=4}}return A.cp}
function mapOKA(A,m){return mOpen(A,GMD=='c'?DIF():0,m)}
function lobAcs(){const L=typeof LBY!='undefined'&&LBY&&LBY.s?LBY.s.map(acOf).filter(Boolean):[];return L.length?L:[S.ac]}
function mapOK(m,acs){if(cmIs(m)){if(!cmDocOf(m))return false;if(GMD!='c')return ccFreeOK(m,acs);if(!ccOfKey(m))return false}return(acs||[S.ac]).some(A=>mapOKA(A,m))||!!(acs&&acs.length>1&&GMD=='c'&&mOpen(cMerge(acs),DIF(),m))}
function ORD(){return GMD=='c'?CORD:MP.map((_,i)=>i).concat(cmFree())}
function swEff(){return GMD=='c'?(DT('wave')?cl(S.sw,1,20):1):S.sw}
function setGM(g){GMD=g;S.gm=g;SVD=1}
function mapNm(m){if(cmIs(m))return mpName(m);return GMD=='c'?(CORD.indexOf(m)+1)+'. '+MP[m].n:MP[m].n}
function campFront(A){return cFront(A||S.ac,DIF())}
function mapFix(acs){if(mapOK(mapId,acs))return;const O=ORD();let m=GMD=='c'?campFront((acs||[S.ac])[0]):O.find(i=>mapOK(i,acs));if(m==null||!mapOK(m,acs))m=O.find(i=>mapOK(i,acs));if(m==null)m=0;mapId=m;if(!cmIs(m))S.mp=m}
function munT(m){const A=S.ac,ci=MUN[m],ok=mapOK(m),i=CORD.indexOf(m);
if(GMD=='c'&&(!cmIs(m)||ccOfKey(m)))return cMunT(m);if(cmIs(m))return cmMunT(m);
if(!ok)return `🔒 Unlock it in the campaign first`;const b=mBest(A,m);return `Best wave here: ${b||'—'}`}
// choosing a mode now happens on the main menu's Play tab
function modes(){CMLB=0;ccRunBack();mode='menu';MPn=0;HUBX=null;hub()}
// ----- end of a campaign map -----
function cwH(){const C=CWIN,cu=cmIs(C.m),nb=C.ci==null||!CH[C.ci],own=!nb&&(S.ac.un||[]).includes(C.ci);return `<h2 style="color:var(--tox)">${edEsc(mpName(C.m).toUpperCase())} COMPLETE!</h2><div class=cwin>${nb?'':`<canvas data-ch=${C.ci}></canvas>`}<div><b>${nb?'You survived all 20 waves!':CH[C.ci].n+' '+(cu?'gives up!':'joined your survivors!')}</b><small>${nb?'No survivor is holding out here yet. ':cu?(own?CH[C.ci].n+' is already one of your survivors. ':'Beat '+CH[C.ci].n+' on '+ccHome(C.ci)+' to recruit them. ')+'This map is now open in Free Play. ':''}${C.nx!=null?'Next up: '+MP[C.nx].n+' ('+SEC[secOf(C.nx)].n+').':cBeat(S.ac)>=SORD.length?'You beat the whole campaign. Every map is open in free play.':'Pick your next map on the campaign map.'}</small></div></div>`}
function cwBtn(mp){const C=CWIN;if(C.nx==null)return `<button class=go onclick="setGM('c');CMV=null;play()">CAMPAIGN MAP</button>`;return `<button class=go onclick="campNext(${mp?1:0})">NEXT: ${MP[C.nx].n.toUpperCase()}</button>`}
function campNext(mp){const C=CWIN;if(!C||C.nx==null)return modes();setGM('c');CREP=null;mapId=C.nx;S.mp=mapId;sv();if(mp)return startMP();if(!S.ac.un.includes(sel))return survs();SVD=1;sfx('click');start()}

