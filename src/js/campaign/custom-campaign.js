//# campaign/custom-campaign.js — Custom maps in the campaign: the free "Coming Soon" slots, the wave-20 boss each one uses, playing a custom map instead of a built-in one, and custom-map progress
// ---------- custom maps in the campaign ----------
// Which map sits in which slot (and which built-in maps are replaced) is device data, kept in IndexedDB next to the maps
// (kv record "campaign"), never in the save or online: CCS = {slots:{'section:slot':{id,b,n}}, rep:{<map number>:{id,n}}}.
// id = the custom map's own id (a string, so it can never collide with a built-in map number), b = the boss, n = the
// map's name when it was assigned (for warnings once a map is gone).
// What an account has beaten on custom maps is in A.cmc = {<map id>: bits} (bit d = beaten on difficulty d). It never
// touches the 16-bit beaten-map masks (A.bm), and removing a map from its slot keeps it.
var CCS={slots:{},rep:{}},CCW=[],CREP=null,CCLD=0;
// wave-20 bosses that work on any map, in campaign order. The other four need their own map:
const CCBOSS=[2,3,1,9,4,10,11,12,5,8,6,7];
const CCNOT={13:'drives the ice cream truck along the City Park road network',14:'drives the fire engine along the Downtown roads and blasts water into its buildings',15:'knocks stock off the Hometown Market shelves and sends carts out of its corrals',16:'watches from the City Hall roof while his police cruiser drives the Main Street roads'};
function ccSK(s,k){return s+':'+k}
function ccPK(sk){const a=String(sk).split(':');return[+a[0],+a[1]]}
// the free slots: every -1 in SEC, as [section, slot]
function ccFree(){const L=[];SEC.forEach((s,si)=>s.m.forEach((m,k)=>{if(m===-1)L.push([si,k])}));return L}
function ccIsFree(s,k){return !!SEC[s]&&SEC[s].m[k]===-1}
// a built-in map can be replaced when it is a campaign map whose own boss works on any map
function ccRepOK(m){return typeof m=='number'&&!!MP[m]&&SORD.includes(m)&&CCBOSS.includes(MUN[m])}
// ----- loading, checking and saving -----
function ccClean(r){const O={slots:{},rep:{}},seen=new Set();if(!r||typeof r!='object')return O;const nm=v=>String(v==null?'':v).replace(/[<>]/g,'').slice(0,40);
for(const sk of Object.keys(r.slots||{})){const a=r.slots[sk],[s,k]=ccPK(sk);if(!ccIsFree(s,k)||!a||typeof a.id!='string'||!a.id||seen.has(a.id))continue;seen.add(a.id);O.slots[ccSK(s,k)]={id:a.id,b:CCBOSS.includes(a.b)?a.b:CCBOSS[0],n:nm(a.n)}}
for(const mk of Object.keys(r.rep||{})){const a=r.rep[mk],m=+mk;if(!ccRepOK(m)||!a||typeof a.id!='string'||!a.id||seen.has(a.id))continue;seen.add(a.id);O.rep[m]={id:a.id,n:nm(a.n)}}return O}
// read the record once per session (after that the copy in memory is the truth and every change is written straight away)
async function ccLoad(){if(!CCLD){CCLD=1;let r=null;try{r=await msGet('kv','campaign')}catch(e){}CCS=ccClean(r)}ccCheck()}
function ccSave(){const rec={k:'campaign',slots:CCS.slots,rep:CCS.rep};try{return msWrite([['put','kv',rec]]).catch(()=>{})}catch(e){return Promise.resolve()}}
// against the maps on this device: a map that is gone is taken out of the campaign (its slot is free again); one that is
// still here but can't be opened keeps its place, and the slot shows Coming Soon until it is fixed. Both leave a warning.
function ccCheck(){if(!CMLOK)return;const W=[];let ch=0;const look=(a,where,drop)=>{const e=CML.find(x=>x.id===a.id);
if(!e){W.push('“'+(a.n||'A custom map')+'” is no longer on this device, so it was taken out of the campaign ('+where+').');drop();ch=1;return}
if(!e.doc){W.push('“'+(a.n||e.meta.name||'A custom map')+'” can\'t be opened right now, so '+where+' shows '+(where.startsWith('slot')?'Coming Soon':'the original map')+' until it is fixed.');return}
const n=String(e.doc.name||'').slice(0,40);if(a.n!==n){a.n=n;ch=1}};
for(const sk of Object.keys(CCS.slots)){const[s,k]=ccPK(sk);look(CCS.slots[sk],'slot '+(k+1)+' of '+SEC[s].n,()=>{delete CCS.slots[sk]})}
for(const mk of Object.keys(CCS.rep))look(CCS.rep[mk],MP[mk].n,()=>{delete CCS.rep[mk]});CCW=W;if(ch)ccSave();return W}
// ----- what is where -----
// the slot's map when it is loaded and playable: {s,k,id,b,key}; null for an empty slot or a map that can't be opened
function ccSlot(s,k){const a=CCS.slots[ccSK(s,k)];if(!a)return null;const key=cmKeyById(a.id);return key==null?null:{s,k,id:a.id,b:a.b,key}}
function ccSlotBad(s,k){const a=CCS.slots[ccSK(s,k)];return a&&cmKeyById(a.id)==null?a:null}
function ccAll(){const L=[];for(const sk of Object.keys(CCS.slots)){const[s,k]=ccPK(sk),e=ccSlot(s,k);if(e)L.push(e)}return L}
function ccSlotOfId(id){for(const sk of Object.keys(CCS.slots))if(CCS.slots[sk].id===id){const[s,k]=ccPK(sk);return{s,k,b:CCS.slots[sk].b}}return null}
// the slot of a running map key (playtests and maps that aren't in a slot: null)
function ccOfKey(m){if(!cmIs(m)||cmPT(m))return null;const id=cmIdOf(m);if(!id)return null;const q=ccSlotOfId(id);return q?{s:q.s,k:q.k,id,b:q.b,key:m}:null}
// the custom map that plays instead of built-in map m (only when it is loaded): {o,id,key}
function ccRep(m){const a=CCS.rep[m];if(!a)return null;const key=cmKeyById(a.id);return key==null?null:{o:m,id:a.id,key}}
function ccRepOfId(id){for(const mk of Object.keys(CCS.rep))if(CCS.rep[mk].id===id)return +mk;return null}
// ----- changing it (each change is written to the device straight away) -----
function ccNm(id){const e=CML.find(x=>x.id===id);return e?String((e.doc&&e.doc.name)||e.meta.name||'').slice(0,40):''}
// put map id in a free slot with boss b (moves it if it was in another slot; a map is in one place at a time)
function ccAssign(id,s,k,b){if(!ccIsFree(s,k)||!CCBOSS.includes(b)||!id)return 0;const o=CCS.slots[ccSK(s,k)];if(o&&o.id!==id)return 0;ccUnassign(id,1);CCS.slots[ccSK(s,k)]={id,b,n:ccNm(id)};ccSave();return 1}
function ccUnassign(id,quiet){let ch=0;for(const sk of Object.keys(CCS.slots))if(CCS.slots[sk].id===id){delete CCS.slots[sk];ch=1}for(const mk of Object.keys(CCS.rep))if(CCS.rep[mk].id===id){delete CCS.rep[mk];ch=1}if(ch&&!quiet)ccSave();return ch}
function ccSetRep(id,m){if(!ccRepOK(m)||!id)return 0;ccUnassign(id,1);CCS.rep[m]={id,n:ccNm(id)};ccSave();return 1}
function ccRestore(m){if(!CCS.rep[m])return 0;delete CCS.rep[m];ccSave();return 1}
// ----- progress on custom maps -----
function ccBits(A,id){return A&&A.cmc&&typeof A.cmc[id]=='number'?A.cmc[id]:0}
// beaten on difficulty d (a harder one counts too, as for the built-in maps)
function ccBt(A,d,id){const b=ccBits(A,id);for(let k=d;k<3;k++)if(b>>k&1)return 1;return 0}
function ccMark(A,d,id){if(!A||A.g||!id)return;A.cmc=A.cmc&&typeof A.cmc=='object'?A.cmc:{};A.cmc[id]=ccBits(A,id)|(1<<d)}
// Free Play: a map that is in a campaign slot opens once it is beaten there (on any difficulty, by any of the players);
// maps that aren't in the campaign are always open
function ccFreeOK(m,acs){const e=ccOfKey(m);if(!e)return true;return(acs||[S.ac]).some(A=>A&&ccBt(A,0,e.id))}
// ----- the run in progress -----
// a replaced map runs as the custom map (mapId = its key, so none of the built-in map's own code runs), but its progress,
// section, boss and difficulty stay those of the original map number: CREP = {o, id, key} while that run lasts
function cCampId(){return CREP&&CREP.key===mapId?CREP.o:mapId}
function ccRunBack(){if(CREP&&mapId===CREP.key)mapId=CREP.o;CREP=null}
function ccRunRep(){CREP=null;if(GMD!='c'||cmIs(mapId))return;const r=ccRep(mapId);if(r){CREP=r;mapId=r.key}}
// who waits at wave 20: the original map's survivor, or the boss picked for the custom slot
function cBossNow(){const m=cCampId();if(cmIs(m)){const e=ccOfKey(m);return e?e.b:null}return MUN[m]}
// the wave-20 boss of a campaign map (built-in or custom slot)
function ccBossOf(m){if(cmIs(m)){const e=ccOfKey(m);return e?e.b:null}return MUN[m]}
// how tough the campaign scaling is: a replaced map scales as the original, a custom slot like the last map of its section
function ccScaleIdx(){const m=cCampId();if(!cmIs(m))return Math.max(0,CORD.indexOf(m));const e=ccOfKey(m);if(!e)return 0;return Math.max(0,...SEC[e.s].m.filter(q=>q>=0).map(q=>CORD.indexOf(q)))}
// a boss's own map (where they are recruited)
function ccHome(ci){return UNM[ci]!=null&&MP[UNM[ci]]?MP[UNM[ci]].n:''}
// the boss a slot in section s starts with: one from that section when there is one
function ccBossFor(s){const B=CCBOSS.filter(ci=>SEC[s]&&SEC[s].m.includes(UNM[ci]));return B[0]!=null?B[0]:CCBOSS[0]}
