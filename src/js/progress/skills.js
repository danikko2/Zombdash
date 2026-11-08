//# progress/skills.js — Skills and XP
const rk=id=>((P&&P.ac)||S.ac).sk[id]||0;const SKA=()=>[S.ac,...S.prof][SKI]||S.ac,rkS=id=>SKA().sk[id]||0;
const xpNeed=lv=>100+40*(lv-1);
function xpMul(){return(S.sw>1?Math.max(.4,1-(S.sw-1)*.04):1)*(S.df?1.25:DIF()==0?.85:1)}
function gainXP(n){if(!P)return;const g=Math.max(1,Math.round(n*(P.xm||1)));P.xg=(P.xg||0)+g;const A=P.ac||S.ac;A.xp+=g;let up=0;while(A.xp>=xpNeed(A.lv)){A.xp-=xpNeed(A.lv);A.lv++;A.sp++;up=1}
if(up){FT.push({x:P.x,y:P.y-34,t:'LEVEL UP! LV '+A.lv,c:'#ffcf40',l:2.2});sfx('power');P.lu=(P.lu||0)+1;sv()}else SVD=1}
let SVD=0,SVT=0;document.addEventListener('visibilitychange',()=>{if(document.hidden&&SVD){SVD=0;sv()}});
let SKS=null;
function skills(){mode='menu';UIS='';skillsNX()}
function selSk(id){SKS=id;sfx('click');skills()}
function buySk(){const A=SKA();for(const b of SKB){const ti=b.k.findIndex(k=>k.id==SKS);if(ti<0)continue;const k=b.k[ti],r=rkS(k.id),cost=ti+1;if(r>=k.m||A.sp<cost||(ti>0&&!rkS(b.k[ti-1].id))){sfx('deny');return skills()}A.sp-=cost;if(DT('sp'))A.sp=9999;A.sk[k.id]=r+1;sv();sfx('buy');return skills()}}
function resetSk(){const A=SKA();let back=0;for(const b of SKB)b.k.forEach((k,ti)=>{back+=(A.sk[k.id]||0)*(ti+1)});A.sp+=back;A.sk={};sv();sfx('click');skills()}
