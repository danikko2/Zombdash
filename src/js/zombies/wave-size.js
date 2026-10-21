//# zombies/wave-size.js — Wave size formula and per-map %
// ---- wave size: normal count = base + perWave×wave + floor(growth×wave²), then × the map's % (campaign / free play) ----
var ZWN={b:4,w:3,g:.12},ZMAPM={c:{},f:{}};try{MP.forEach((_,m)=>{ZMAPM.c[m]=100;ZMAPM.f[m]=100})}catch(e){}
function zWaveBase(w){return ZWN.b+w*ZWN.w+Math.floor(w*w*ZWN.g)}
function zWaveCount(w){const t=(GMD=='c'?ZMAPM.c:ZMAPM.f)[mapId],k=(t==null?100:t)/100;return Math.max(1,Math.round(zWaveBase(w)*k*(MPn>1?1+.6*(MPn-1):1)))}

