//# zombies/wave-size.js — Wave size formula and per-map %, and a wave's pacing (spawn gap, health and speed growth)
// ---- wave size: normal count = base + perWave×wave + floor(growth×wave²), then × the map's % (campaign / free play) ----
var ZWN={b:8,w:4,g:.25},ZMAPM={c:{},f:{}};try{MP.forEach((_,m)=>{ZMAPM.c[m]=100;ZMAPM.f[m]=100})}catch(e){}
// campaign: maps later in the campaign get bigger waves (set from the balance editor, Nov 2026)
Object.assign(ZMAPM.c,{0:75,3:80,1:85,14:90,15:95,2:105,9:110,10:110,11:115,12:125,13:130,7:135,4:145,6:160,5:160});
function zWaveBase(w){return ZWN.b+w*ZWN.w+Math.floor(w*w*ZWN.g)}
function zWaveCount(w){const t=(GMD=='c'?ZMAPM.c:ZMAPM.f)[mapId],k=(t==null?100:t)/100;return Math.max(1,Math.round(zWaveBase(w)*k*(MPn>1?1+.6*(MPn-1):1)))}

// ---- pacing (Game Balance → Zombie count → Pacing) ----
// s0 − sd × wave = seconds between spawns (never under sMin; split screen spawns faster per extra player);
// a zombie's health × (1 + hpW% × wave) × hp5 every 5 waves; its speed × sp5 every 5 waves, never above spMax ×
var ZPACE={s0:1.1,sd:.06,sMin:.25,hpW:8,hp5:1.2,sp5:1.1,spMax:2};
function zSpGap(w){return Math.max(Math.max(.02,+ZPACE.sMin||0),(+ZPACE.s0||0)-(w==null?wave:w)*(+ZPACE.sd||0))}
function zHpK(w){return(1+w*((+ZPACE.hpW||0)/100))*Math.pow(+ZPACE.hp5||1,Math.floor((w-1)/5))}
function zSpK(w){return Math.min(+ZPACE.spMax||1,Math.pow(+ZPACE.sp5||1,Math.floor((w-1)/5)))}
