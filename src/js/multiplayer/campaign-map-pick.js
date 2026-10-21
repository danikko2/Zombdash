//# multiplayer/campaign-map-pick.js — Split-screen campaign map picking
// ---------- split screen campaign: pick the map on the same campaign map screens as single player ----------
var CMLB=0;
// the lobby's combined progress: a map or section counts as open when the players' progress together opens it
function cMerge(acs){acs=(acs||[]).filter(Boolean);if(!acs.length)return S.ac;if(acs.length==1)return acs[0];const B=acs.map(bmOf);return{name:'Team',g:1,bm:[0,1,2].map(d=>B.reduce((v,b)=>v|b[d],0)),un:[...new Set(acs.flatMap(A=>A.un||[]))]}}
function cAcc(){return CMLB?cMerge(lobAcs()):S.ac}
function clbOpen(){if(GMD!='c'){sfx('deny');return}CMLB=1;CMV=null;sfx('click');cMap()}
function clbBack(){CMLB=0;CMV=null;mode='lobby';UIS='';sfx('click');rL()}
function clbGo(){if(!mOpen(cAcc(),DIF(),mapId)){sfx('deny');return}S.mp=mapId;SVD=1;clbBack()}

