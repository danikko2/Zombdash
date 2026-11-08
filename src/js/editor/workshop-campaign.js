//# editor/workshop-campaign.js — Putting a custom map in the campaign (from the Workshop or a Coming Soon slot): pick a free slot and its wave-20 boss, or play it instead of a built-in map
// ---------- the campaign dialog ----------
// WC = {id, back:'ws'|'cmap', s, k, b}: the map being placed, where to go afterwards, the slot and boss picked so far
let WC=null;
function wcEnt(){return WC&&CML.find(e=>e.id===WC.id)||null}
// open the dialog for map id; pre = [section, slot] when it was opened from an empty slot
function wcOpen(id,back,pre){const e=CML.find(x=>x.id===id);if(!e||!e.doc){sfx('deny');return}const cur=ccSlotOfId(id);
WC={id,back:back||'ws',s:null,k:null,b:null};if(pre){WC.s=pre[0];WC.k=pre[1]}else if(cur){WC.s=cur.s;WC.k=cur.k}
WC.b=cur?cur.b:WC.s!=null?ccBossFor(WC.s):null;sfx('click');wcDraw()}
function wcBack(msg){const b=WC&&WC.back;WC=null;if(b=='cmap'){setGM('c');return cMap()}workshop(msg)}
// the page itself is drawn by wcPage() in ui/workshop-forms.js
function wcDraw(){const e=wcEnt();if(!e||!e.doc)return wcBack();wcDrawNX()}
function wcSlot(s,k){if(!WC||!ccIsFree(s,k))return;const a=CCS.slots[ccSK(s,k)];if(a&&a.id!==WC.id){sfx('deny');return}const ns=WC.s!==s;WC.s=s;WC.k=k;if(WC.b==null||ns&&!ccSlotOfId(WC.id))WC.b=ccBossFor(s);sfx('click');wcDraw()}
function wcBoss(ci){if(!WC||!CCBOSS.includes(ci))return;WC.b=ci;sfx('click');wcDraw()}
function wcSave(){if(!WC||WC.s==null||WC.b==null){sfx('deny');return}const e=wcEnt(),wasRep=ccRepOfId(WC.id);if(!e||!ccAssign(WC.id,WC.s,WC.k,WC.b)){sfx('deny');return wcDraw()}sfx('buy');
const msg=`“${edEsc(e.doc.name)}” is in ${SEC[WC.s].n}, slot ${WC.k+1}, with ${CH[WC.b].n} at wave 20.`+(wasRep!=null?` It no longer plays instead of ${MP[wasRep].n}.`:'');
if(WC.back=='cmap'){const s=WC.s,key=cmKeyById(WC.id);WC=null;setGM('c');CSEL=null;CMV=s;if(key!=null)mapId=key;return cMap()}wcBack(msg)}
function wcRemove(){if(!WC)return;const e=wcEnt();ccUnassign(WC.id);sfx('click');if(WC.back=='cmap'){WC=null;setGM('c');CSEL=null;mapId=cFront(cAcc(),DIF());return cMap()}wcBack(`“${edEsc(e?e.doc.name:'')}” was taken out of the campaign. What you beat on it is kept.`)}
// replacing a campaign map always asks first
function wcRepAsk(){if(!WC)return;const sel=document.getElementById('wcrep'),m=sel?+sel.value:NaN,e=wcEnt();if(!ccRepOK(m)||!e){sfx('deny');return}sfx('click');wcRepAskNX(m)}
function wcRepOk(m){if(!WC)return;const e=wcEnt();if(!e||!ccSetRep(WC.id,m)){sfx('deny');return wcDraw()}sfx('buy');wcBack(`“${edEsc(e.doc.name)}” now plays instead of ${MP[m].n} in the campaign.`)}
function wcRestore(m){if(!ccRestore(m)){sfx('deny');return}sfx('click');if(WC){const back=WC.back;WC=null;if(back=='cmap'){setGM('c');return cMap()}}workshop(`${MP[m].n} is back to the original map.`)}
// from an empty campaign slot: which of your maps goes here
function wcPickMap(s,k){const L=CML.map((e,i)=>({e,i})).filter(q=>q.e.doc);if(!L.length)return workshop();sfx('click');wcPickNX(s,k,L)}
// the Workshop's line about where a map is in the campaign
function wcStatus(id){const s=ccSlotOfId(id);if(s)return `<small class=wscp>🏁 Campaign: ${SEC[s.s].n}, slot ${s.k+1} · boss ${CH[s.b].n}</small>`;const r=ccRepOfId(id);return r!=null?`<small class=wscp>🏁 Plays instead of ${MP[r].n} in the campaign</small>`:''}
