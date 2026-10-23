//# campaign/sections.js — Campaign sections (SEC) and progress
// ---------- campaign story: 5 sections, each opens with one map, then the rest in any order ----------
// -1 = a slot for a map that isn't made yet (shown as COMING SOON)
var SEC=[
{n:'Hometown',sub:'Where it all started',m:[0,3,1,14,15],c:'#8fd16a',c2:'#6cb04c',cl:'#a4855a',th:'home'},
{n:'Wrong Turn',sub:'The road out goes bad',m:[8,2,9,10,-1],c:'#7a8a74',c2:'#5e6e5a',cl:'#5a4a40',th:'spook'},
{n:'Zombville',sub:'The city has fallen',m:[11,12,13,-1,-1],c:'#9aa6b4',c2:'#7e8a98',cl:'#5e6670',th:'city'},
{n:'Countryside',sub:'Out where the roads end',m:[7,4,6,-1,-1],c:'#d8c070',c2:'#bca456',cl:'#8a6a3a',th:'farm'},
{n:'Island',sub:'The last place to run',m:[5,-1,-1,-1,-1],c:'#f0d890',c2:'#d8bc70',cl:'#a8885a',th:'isle'}];
var SORD=SEC.reduce((a,s)=>a.concat(s.m.filter(m=>m>=0)),[]);
var OLDC=[0,3,1,8,2,9,10,11,12,13,4,7,6,5];
// beaten maps: one bitmask per difficulty (0 easy · 1 medium · 2 hard); old saves are converted from their campaign progress
function bmOf(A){if(!A)return[0,0,0];if(!A.bm){const b=[0,0,0];for(let d=0;d<3;d++){const n=Math.min(cpD(A,d),OLDC.length);for(let i=0;i<n;i++)b[d]|=1<<OLDC[i]}A.bm=b}return A.bm}
function bBt(A,d,m){if(m<0)return 0;if(cmIs(m)){if(CREP&&CREP.key===m)return bBt(A,d,CREP.o);const id=cmIdOf(m);return id?ccBt(A,d,id):0}const b=bmOf(A);for(let k=d;k<3;k++)if(b[k]>>m&1)return 1;return 0}
// custom maps keep their own record (A.cmc); the masks only ever hold built-in map numbers
function bmSet(A,d,m){if(cmIs(m)){if(CREP&&CREP.key===m)return bmSet(A,d,CREP.o);return ccMark(A,d,cmIdOf(m))}if(m>=0&&m<MP.length)bmOf(A)[d]|=1<<m}
// a custom map's section is the one its slot is in (a replaced map's is the original's)
function secOf(m){if(cmIs(m)){if(CREP&&CREP.key===m)return secOf(CREP.o);const e=ccOfKey(m);return e?e.s:-1}return SEC.findIndex(s=>s.m.includes(m))}
function secDone(A,d,s){return SEC[s].m.every(m=>m<0||bBt(A,d,m))}
function secOpen(A,d,s){for(let k=0;k<s;k++)if(!secDone(A,d,k))return SEC.slice(s).some(q=>q.m.some(m=>m>=0&&bBt(A,d,m)))?1:0;return 1}
// a custom slot opens with the rest of its section (once the section's first map is beaten); it never blocks anything
function mOpen(A,d,m){if(cmIs(m)&&!(CREP&&CREP.key===m)&&!ccOfKey(m))return 0;const s=secOf(m);if(s<0||!secOpen(A,d,s))return 0;const f=SEC[s].m[0];return m==f||bBt(A,d,f)}
function cFront(A,d){A=A||S.ac;d=d??DIF();const m=SORD.find(m=>mOpen(A,d,m)&&!bBt(A,d,m));return m!=null?m:SORD[SORD.length-1]}
function cBeat(A){return SORD.filter(m=>bBt(A,0,m)).length}
// what the end screen offers next: the next open map you haven't beaten yet
function campNx(){const A=S.ac,d=DIF(),cm=cCampId(),m=SORD.find(k=>k!==cm&&mOpen(A,d,k)&&!bBt(A,d,k));return m!=null?m:null}
