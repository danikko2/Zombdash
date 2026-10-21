//# dev/test-switches.js — Test mode on/off switches and infinite health
// ---------- test mode switches: entering the code turns test mode on with everything OFF; each cheat is its own switch ----------
const DTL=[['unl','Unlock everything','every map, survivor, camo, weapon level, mastery perk, title, badge and look'],['money','Unlimited money','$999,999 at the start of a run and in every shop'],['sp','Unlimited skill points','buy any skill; turning it off puts your real skills and points back'],['wave','Start on any wave','up to wave 99 in free play, 20 in the campaign'],['god','Infinite health','zombies, bosses and hazards can\'t hurt you']];
function DT(k){return!!(S.dev&&S.dt&&S.dt[k])}
// saves from before the switches existed: keep what that test mode was already doing
if(S.dev&&!S.dt){S.dt={unl:1,money:S.balNM?0:1,sp:1,wave:1};delete S.balNM}
function dtUnl(on){for(const A of ACS()){if(on){devMax(A);continue}if(!A.dvb)continue;let b={};try{b=JSON.parse(A.dvb)}catch(e){}for(const k of DVK){if(k in b)A[k]=b[k];else delete A[k]}delete A.dvb}}
function dtSp(on){for(const A of ACS()){if(on){if(A.dsp==null)A.dsp=JSON.stringify({sp:A.sp,sk:A.sk});A.sp=9999}else if(A.dsp!=null){try{const b=JSON.parse(A.dsp);A.sp=b.sp||0;A.sk=b.sk||{}}catch(e){}delete A.dsp}}}
function dtSet(k,on){if(!S.dev)return;S.dt=S.dt||{};on=on?1:0;if(!!S.dt[k]==!!on)return;S.dt[k]=on;
 if(k=='unl')dtUnl(on);else if(k=='sp')dtSp(on);else if(k=='money'){if(on)for(const p of PL||[])p.cash=999999}else if(k=='wave'){if(!on)S.sw=cl(S.sw,1,S.best)}else if(k=='god'){if(on)for(const p of PL||[])p.hp=Math.max(p.hp,p.mx)}
 try{sv()}catch(e){}sfx('click');if(UIS=='bal')balOpen();else options()}
function dtAllOff(){if(!S.dt)return;if(S.dt.unl)dtUnl(0);if(S.dt.sp)dtSp(0);S.dt={}}
function dtBox(){return `<div class=dts>${DTL.map(([k,n,d])=>`<div class=dtr><div><b>${n}</b><small>${d}</small></div><div class=seg><button data-q=1 class="${DT(k)?'on':''}" onclick="dtSet('${k}',1)">On</button><button data-q=1 class="${DT(k)?'':'on'}" onclick="dtSet('${k}',0)">Off</button></div></div>`).join('')}</div>`}
function dtCss(){try{if(document.getElementById('dtcss')||!document.head)return;const st=document.createElement('style');st.id='dtcss';st.textContent=`.dts{display:flex;flex-direction:column;gap:6px;margin:6px 0 8px;text-align:left}.dtr{display:grid;grid-template-columns:1fr 132px;gap:8px;align-items:center;padding:4px 6px;background:rgba(0,0,0,.18);border-radius:4px}.dtr b{display:block;font-size:17px;font-weight:normal;color:#e9f1e2}.dtr small{display:block;font-size:13px;color:var(--mut);line-height:1.15}.dtr .seg button{padding:6px 2px;font-size:16px;margin:0}`;document.head.appendChild(st)}catch(e){}}
// infinite health: no damage gets through, and health is topped up every frame
const _arm0=arm;arm=function(d){if(DT('god'))return 0;return _arm0(d)};
function dtFrame(){if(!DT('god')||mode!='play')return;for(const p of PL||[]){if(p.dead)continue;if(p.dn){p.dn=0;p.rv=0;p.inv=Math.max(p.inv||0,1)}if(p.hp<p.mx)p.hp=p.mx}}

