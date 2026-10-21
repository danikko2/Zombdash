//# world/map-store.js — Where custom maps are kept on this device: IndexedDB, or memory for this visit if the browser has no IndexedDB
// ---------- custom map storage ----------
// Custom maps stay out of the save object S and out of the online saves. Database "zombdash-maps" holds three stores:
//   maps: {id, json}   the map file exactly as Export writes it (see cmWrite)
//   meta: {id, name, desc, w, h, created, updated, thumb}   what the Workshop list and Free Play need
//   kv:   {k, ...}     small records, e.g. the editor's crash-safe draft ("draft")
let CMDB=null,CMMEM=null;
function cmDb(){return CMDB||(CMDB=new Promise(res=>{let r;try{if(typeof indexedDB=='undefined'||!indexedDB||!indexedDB.open)return res(null);r=indexedDB.open('zombdash-maps',1)}catch(e){return res(null)}
r.onupgradeneeded=()=>{const db=r.result;for(const[n,k]of[['maps','id'],['meta','id'],['kv','k']])if(!db.objectStoreNames.contains(n))db.createObjectStore(n,{keyPath:k})};
r.onsuccess=()=>res(r.result);r.onerror=()=>res(null);r.onblocked=()=>res(null)}).then(db=>{if(!db)CMMEM={maps:{},meta:{},kv:{}};return db}))}
// maps live only in memory (no IndexedDB here): the Workshop says so and suggests exporting
function msMem(){return !!CMMEM}
const msReq=r=>new Promise((res,rej)=>{r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error)});
const msCopy=v=>v==null?v:JSON.parse(JSON.stringify(v));
async function msAll(st){const db=await cmDb();if(!db)return Object.values(CMMEM[st]).map(msCopy);return msReq(db.transaction(st).objectStore(st).getAll())}
async function msGet(st,k){const db=await cmDb();if(!db)return msCopy(CMMEM[st][k]);return msReq(db.transaction(st).objectStore(st).get(k))}
// several writes in one transaction: all of them happen or none do. ops: [['put',store,value] | ['del',store,key]]
async function msWrite(ops){const db=await cmDb();if(!db){for(const[o,st,v]of ops){if(o=='put')CMMEM[st][st=='kv'?v.k:v.id]=msCopy(v);else delete CMMEM[st][v]}return}
return new Promise((res,rej)=>{let t;try{t=db.transaction([...new Set(ops.map(o=>o[1]))],'readwrite');for(const[o,st,v]of ops){if(o=='put')t.objectStore(st).put(v);else t.objectStore(st).delete(v)}}catch(e){return rej(e)}
t.oncomplete=()=>res();t.onerror=()=>rej(t.error||new Error('The browser refused to save'));t.onabort=()=>rej(t.error||new Error('The save was cancelled (is the device out of space?)'))})}
