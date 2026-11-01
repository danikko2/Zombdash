//# zombies/wave-size.js — Wave size formula and per-map %
// ---- wave size: normal count = base + perWave×wave + floor(growth×wave²), then × the map's % (campaign / free play) ----
var ZWN={b:8,w:4,g:.25},ZMAPM={c:{},f:{}};try{MP.forEach((_,m)=>{ZMAPM.c[m]=100;ZMAPM.f[m]=100})}catch(e){}
// campaign: maps later in the campaign get bigger waves (set from the balance editor, Nov 2026)
Object.assign(ZMAPM.c,{0:75,3:80,1:85,14:90,15:95,2:105,9:110,10:110,11:115,12:125,13:130,7:135,4:145,6:160,5:160});
function zWaveBase(w){return ZWN.b+w*ZWN.w+Math.floor(w*w*ZWN.g)}
function zWaveCount(w){const t=(GMD=='c'?ZMAPM.c:ZMAPM.f)[mapId],k=(t==null?100:t)/100;return Math.max(1,Math.round(zWaveBase(w)*k*(MPn>1?1+.6*(MPn-1):1)))}

