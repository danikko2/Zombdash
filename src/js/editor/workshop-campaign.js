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
function wcDraw(){const e=wcEnt();if(!e||!e.doc)return wcBack();const cur=ccSlotOfId(WC.id),rp=ccRepOfId(WC.id),nm=edEsc(e.doc.name);
const secs=SEC.map((S_,si)=>({si,ks:S_.m.map((m,k)=>m===-1?k:-1).filter(k=>k>=0)})).filter(q=>q.ks.length);
const slots=secs.map(({si,ks})=>`<div class=wcsec><b>${si+1}. ${SEC[si].n}</b><span>${ks.map(k=>{const a=CCS.slots[ccSK(si,k)],mine=a&&a.id===WC.id,taken=a&&!mine;
return `<button data-q=1 class="${WC.s===si&&WC.k===k?'on':''}"${taken?' disabled':''} onclick="wcSlot(${si},${k})">Slot ${k+1}<small>${taken?'“'+edEsc(a.n||'another map')+'”':mine?'this map':'free'}</small></button>`}).join('')}</span></div>`).join('');
const boss=CCBOSS.map(ci=>`<button data-q=1 class="${WC.b===ci?'on':''}" onclick="wcBoss(${ci})"><canvas data-ch=${ci}></canvas><b>${CH[ci].n}</b><small>${ccHome(ci)}</small></button>`).join('');
const repL=CORD.filter(ccRepOK).map(m=>`<option value="${m}">${CORD.indexOf(m)+1}. ${MP[m].n}${CCS.rep[m]?' (now: “'+edEsc(CCS.rep[m].n)+'”)':''}</option>`).join('');
show(`<div class="p wide ws wcm"><h2>CAMPAIGN · ${nm}</h2>
<p class=note>${cur?`In the campaign: <b>${SEC[cur.s].n}, slot ${cur.k+1}</b>, boss <b>${CH[cur.b].n}</b>.`:rp!=null?`Plays instead of <b>${MP[rp].n}</b> in the campaign.`:'Not in the campaign yet.'} A custom map in a slot plays with that section's zombies, lives and difficulty, waves 1–20 end with the boss you pick, and it never blocks the next section.</p>
<h3>1. A free slot</h3><div class=wcsl>${slots}</div>
<h3>2. The wave-20 boss</h3><div class=wcbs>${boss}</div>
<p class=note>Not offered: ${[13,14,15,16].map(ci=>CH[ci].n).join(', ')}. Their fights need their own map (the road network for the truck, the fire engine and the cruiser, City Hall's roof, the market's shelves and cart corrals).</p>
<p class=note><b>Beating the boss</b> marks this map beaten (on that difficulty) and opens it in Free Play. The survivor gives up but doesn't join you here: everyone is recruited on their own map, so a custom map can't skip ahead in the story.</p>
<div class=row><button onclick="wcBack()">BACK</button>${cur?'<button class=red onclick="wcRemove()">REMOVE FROM CAMPAIGN</button>':''}<button class=go onclick="wcSave()"${WC.s==null||WC.b==null?' disabled':''}>${cur?'SAVE':'PUT IN SLOT'}</button></div>
<h3>Or: play it instead of a campaign map</h3>
${rp!=null?`<div class=cpb><b>Plays instead of ${MP[rp].n}</b><small>Progress, the section, the boss (${CH[MUN[rp]].n}) and the difficulty stay ${MP[rp].n}'s.</small><div class=row><button class=go onclick="wcRestore(${rp})">RESTORE ${MP[rp].n.toUpperCase()}</button></div></div>`
:`<p class=note>For a map you made from or for one of the campaign maps. Progress stays with the original map, its boss and section stay the same, and you can restore the original with one click.</p><div class=wsbar><select id=wcrep aria-label="Campaign map">${repL}</select><button onclick="wcRepAsk()">PLAY INSTEAD…</button></div><p class=note>Not offered: ${MP.map((q,m)=>m).filter(m=>SORD.includes(m)&&!ccRepOK(m)).map(m=>MP[m].n).join(', ')} (their bosses need those maps).</p>`}</div>`)}
function wcSlot(s,k){if(!WC||!ccIsFree(s,k))return;const a=CCS.slots[ccSK(s,k)];if(a&&a.id!==WC.id){sfx('deny');return}const ns=WC.s!==s;WC.s=s;WC.k=k;if(WC.b==null||ns&&!ccSlotOfId(WC.id))WC.b=ccBossFor(s);sfx('click');wcDraw()}
function wcBoss(ci){if(!WC||!CCBOSS.includes(ci))return;WC.b=ci;sfx('click');wcDraw()}
function wcSave(){if(!WC||WC.s==null||WC.b==null){sfx('deny');return}const e=wcEnt(),wasRep=ccRepOfId(WC.id);if(!e||!ccAssign(WC.id,WC.s,WC.k,WC.b)){sfx('deny');return wcDraw()}sfx('buy');
const msg=`“${edEsc(e.doc.name)}” is in ${SEC[WC.s].n}, slot ${WC.k+1}, with ${CH[WC.b].n} at wave 20.`+(wasRep!=null?` It no longer plays instead of ${MP[wasRep].n}.`:'');
if(WC.back=='cmap'){const s=WC.s,key=cmKeyById(WC.id);WC=null;setGM('c');CSEL=null;CMV=s;if(key!=null)mapId=key;return cMap()}wcBack(msg)}
function wcRemove(){if(!WC)return;const e=wcEnt();ccUnassign(WC.id);sfx('click');if(WC.back=='cmap'){WC=null;setGM('c');CSEL=null;mapId=cFront(cAcc(),DIF());return cMap()}wcBack(`“${edEsc(e?e.doc.name:'')}” was taken out of the campaign. What you beat on it is kept.`)}
// replacing a campaign map always asks first
function wcRepAsk(){if(!WC)return;const sel=document.getElementById('wcrep'),m=sel?+sel.value:NaN,e=wcEnt();if(!ccRepOK(m)||!e){sfx('deny');return}const old=CCS.rep[m],cur=ccSlotOfId(WC.id);sfx('click');
show(`<div class="p ws"><h2>PLAY THIS INSTEAD?</h2><p>In the campaign, “${edEsc(e.doc.name)}” will be played instead of <b>${MP[m].n}</b>. Your progress, the section, the boss (${CH[MUN[m]].n}) and the difficulty stay ${MP[m].n}'s, and you can restore the original with one click.${old&&old.id!==WC.id?` It takes the place of “${edEsc(old.n)}”, which plays there now.`:''}${cur?` It will be taken out of its slot in ${SEC[cur.s].n}.`:''}</p>
<div class=row><button onclick="wcDraw()">CANCEL</button><button class=go onclick="wcRepOk(${m})">PLAY INSTEAD</button></div></div>`)}
function wcRepOk(m){if(!WC)return;const e=wcEnt();if(!e||!ccSetRep(WC.id,m)){sfx('deny');return wcDraw()}sfx('buy');wcBack(`“${edEsc(e.doc.name)}” now plays instead of ${MP[m].n} in the campaign.`)}
function wcRestore(m){if(!ccRestore(m)){sfx('deny');return}sfx('click');if(WC){const back=WC.back;WC=null;if(back=='cmap'){setGM('c');return cMap()}}workshop(`${MP[m].n} is back to the original map.`)}
// from an empty campaign slot: which of your maps goes here
function wcPickMap(s,k){const L=CML.map((e,i)=>({e,i})).filter(q=>q.e.doc);if(!L.length)return workshop();sfx('click');
show(`<div class="p wide ws"><h2>${SEC[s].n.toUpperCase()} · SLOT ${k+1}</h2><p class=note>Pick one of your maps for this slot. Next you choose the survivor boss for wave 20.</p><div class=wsl>${L.map(({e,i})=>{const img=wsImg(e.meta.thumb),cs=ccSlotOfId(e.id),cr=ccRepOfId(e.id);
return `<div class=wsc>${img?`<img class=wst alt="" src="${img}">`:'<i class=wst></i>'}<div class=wsi><b>${edEsc(e.doc.name)}</b><small>${e.doc.w}×${e.doc.h} tiles${cs?' · now in '+SEC[cs.s].n+', slot '+(cs.k+1)+' (it moves here)':cr!=null?' · now plays instead of '+MP[cr].n+' (that stops)':''}</small><div class=wsa><button class=go onclick="wcOpen(CML[${i}].id,'cmap',[${s},${k}])">CHOOSE</button></div></div></div>`}).join('')}</div>
<div class=row><button onclick="setGM('c');cMap()">BACK</button></div></div>`)}
// the Workshop's line about where a map is in the campaign
function wcStatus(id){const s=ccSlotOfId(id);if(s)return `<small class=wscp>🏁 Campaign: ${SEC[s.s].n}, slot ${s.k+1} · boss ${CH[s.b].n}</small>`;const r=ccRepOfId(id);return r!=null?`<small class=wscp>🏁 Plays instead of ${MP[r].n} in the campaign</small>`:''}
