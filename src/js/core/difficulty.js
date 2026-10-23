//# core/difficulty.js — Difficulty levels and scaling
// ---------- difficulty: 0 easy · 1 normal (medium in the campaign) · 2 hard; free play and the campaign remember their own pick ----------
function DIF(){let c;try{c=GMD=='c'}catch(e){c=0}const v=c?S.dlc:S.dlf;return v==null?1:v}
function DNm(d,c){return['Easy',c?'Medium':'Normal','Hard'][d]}
function cmpI(){try{return GMD=='c'?ccScaleIdx():0}catch(e){return 0}}
// every campaign map is a little tougher than the one before it
function DMH(){return(DIF()==0?.8:1)*(1+.03*cmpI())}
function DBH(){return(DIF()==0?.85:1)*(1+.025*cmpI())}
function DSP(){return(DIF()==0?.9:1)*(1+.01*cmpI())}
// campaign progress per difficulty (beating a map on a harder setting counts for the easier ones)
function cpD(A,d){if(!A)return 0;const m=cpOf(A),e=A.cpE||0,h=A.cpH||0;return d==2?h:d==1?Math.max(m,h):Math.max(e,m,h)}
function cpUp(A,d,n){const c0=cpD(A,d);if(d==2)A.cpH=Math.max(A.cpH||0,n);else if(d==1){cpOf(A);A.cp=Math.max(A.cp,n)}else A.cpE=Math.max(A.cpE||0,n);return cpD(A,d)>c0}
function setDif(d){if(GMD=='c')S.dlc=d;else S.dlf=d;SVD=1;try{sv()}catch(e){}sfx('click')}
function difSel(){const c=GMD=='c';return `<div class="seg dsel">${[0,1,2].map(d=>`<button data-q=1 class="${DIF()==d?'on':''}" onclick="setDif(${d});${c?'mapId=campFront();S.mp=mapId;':''}play()">${DNm(d,c)}</button>`).join('')}</div><p class=dnote>${dTxt()}</p>`}
function dTxt(){const c=GMD=='c',d=DIF();const t=['Zombies are a little slower and weaker','The standard challenge','+50% zombie speed, +80% health, 2× damage, 2× cash'][d];
return c?t+' · '+[4,3,1][d]+(d==2?' life':' lives')+' · '+SORD.filter(m=>bBt(S.ac,d,m)).length+'/'+SORD.length+' beaten on '+DNm(d,1)+'<br><small>Each map in the campaign is a little tougher than the last.</small>':t}

