//# game/drop-table.js — Drop chances per zombie / boss (DROPT, DROPG)
// ---------- drops: every zombie and boss type has its own chances (in %) for each item ----------
// am = ammo box of type `at` ('pa','ri','sh','rk','bl' or 'rand'), am2 = an extra box of a random type,
// cash / dd (2x damage) / hp = the other pickups. Chances on regular zombies are raised by the Luck skill.
// The defaults reproduce the old rules: zombies 8.5% ammo and a 7% item split 48% cash / 22% 2x / 30% health
// (half for Splitter pieces); wave bosses always drop cash, health, their ammo and one random ammo box.
var DROPT={},DROPG={max:6,cb:20,cw:4,dds:5,hp:1};
(function(){for(let t=0;t<ZT.length;t++){const T=ZT[t];if(T.sv)continue;const at=ZAM[t]||'pa';
 if(T.boss)DROPT[t]={am:100,at,am2:100,cash:100,dd:0,hp:100};
 else{const k=t==5?.035:.07;DROPT[t]={am:8.5,at,am2:0,cash:+(k*48).toFixed(2),dd:+(k*22).toFixed(2),hp:+(k*30).toFixed(2)}}}})();
function dropAm(){return['pa','ri','sh','bl'][Math.random()*4|0]}
function drop(z,T){const D=DROPT[z.t];if(!D)return drop0(z,T);if(DR.length>=DROPG.max&&!T.boss)return;
 const add=(k,a)=>DR.push({x:z.x+rnd(-10,10),y:z.y+rnd(-6,6),k,a,l:14,ph:Math.random()*6}),L=T.boss?1:1+.08*rk('luck'),ch=p=>p>0&&Math.random()*100<p*L;
 if(ch(D.am))add('am',D.at=='rand'||!AMI[D.at]?dropAm():D.at);if(ch(D.am2))add('am',dropAm());if(ch(D.cash))add('cash');if(ch(D.dd))add('dd');if(ch(D.hp))add('hp')}

