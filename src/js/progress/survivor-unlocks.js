//# progress/survivor-unlocks.js — Survivor unlocks per map
// ---------- survivors unlock by reaching wave 20 on their map (runs started at wave 1) ----------
const UNM={2:0,1:1,4:2,3:3,8:4,7:5,6:6,5:7,9:8,10:9,11:10,12:11,13:12,14:13,15:14,16:15},MUN={};for(const c in UNM)MUN[UNM[c]]=+c;
function mBest(A,m){return(A&&A.mw&&A.mw[m])||0}
function mapUnl(p,w){const A=p&&p.ac;if(!A||A.g)return;A.mw=A.mw||[];if(w>(A.mw[mapId]||0)){A.mw[mapId]=w;SVD=1}}
function slh(cv,g){if(cv.dataset.lk!=1)return;try{const W2=cv.width,H2=cv.height,t=document.createElement('canvas');t.width=W2;t.height=H2;const q=t.getContext('2d');const tint=c=>{q.clearRect(0,0,W2,H2);q.globalCompositeOperation='source-over';q.drawImage(cv,0,0);q.globalCompositeOperation='source-atop';q.fillStyle=c;q.fillRect(0,0,W2,H2);q.globalCompositeOperation='source-over'};
tint('#8fae92');const rim=document.createElement('canvas');rim.width=W2;rim.height=H2;rim.getContext('2d').drawImage(t,0,0);tint('#050706');g.clearRect(0,0,W2,H2);for(const[dx,dy]of[[1,0],[-1,0],[0,1],[0,-1]])g.drawImage(rim,dx,dy);g.drawImage(t,0,0);t.width=rim.width=0}catch(e){}}

