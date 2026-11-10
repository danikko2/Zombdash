//# world/pathfinding-worker.js — Works out the zombies' walking-distance maps on a background thread, so it never holds up a frame
// flow() (world/map-list-and-pathfinding.js) calls pfAsk with the players who need a map. The thread gets the map's walls (bl)
// once per map and answers each request with a fresh distance map, which replaces fd (one player) or p.fd (split screen) a
// frame or two later. Until the thread has answered once, and for good if it can't start (some pages don't allow it) or stops
// answering, flow() keeps working the maps out itself, so zombies never lose their way.
const PFW={w:null,ok:null,gen:0,bl:null,pend:{}};
function pfSrc(){return 'let bl,gw,gh,q,gen=0;'+bfsCore.toString()+
 ';onmessage=function(e){const m=e.data;if(m.bl){bl=m.bl;gw=m.gw;gh=m.gh;gen=m.gen;q=new Int32Array(gw*gh);return}if(m.gen!==gen||!bl)return;const F=new Int16Array(gw*gh);bfsCore(F,q,bl,gw,gh,m.ci,m.cj);postMessage({id:m.id,gen:gen,F:F},[F.buffer])}'}
function pfW(){if(PFW.ok===false)return null;if(PFW.w)return PFW.w;
 if(typeof Worker=='undefined'||typeof Blob=='undefined'||typeof URL=='undefined'||!URL.createObjectURL){PFW.ok=false;return null}
 try{const w=new Worker(URL.createObjectURL(new Blob([pfSrc()],{type:'text/javascript'})));w.onmessage=pfGot;w.onerror=pfDead;PFW.w=w}catch(e){PFW.ok=false;return null}return PFW.w}
function pfDead(){PFW.ok=false;try{PFW.w&&PFW.w.terminate()}catch(e){}PFW.w=null;PFW.pend={}}
function pfAsk(L){const w=pfW();if(!w)return 0;try{if(PFW.bl!==bl){PFW.bl=bl;PFW.gen++;PFW.pend={};w.postMessage({bl:bl.slice(),gw,gh,gen:PFW.gen})}
 const now=performance.now();for(const p of L){const id=MPn?PL.indexOf(p):-1,k=''+id;if(PFW.pend[k]){if(now-PFW.pend[k]>1500){pfDead();return 0}continue}
  PFW.pend[k]=now;w.postMessage({id,gen:PFW.gen,ci:cl(p.x/gs|0,0,gw-1),cj:cl(p.y/gs|0,0,gh-1)})}}catch(e){pfDead();return 0}return 1}
function pfGot(e){const m=e.data||{};delete PFW.pend[''+m.id];if(m.gen!==PFW.gen||!m.F||m.F.length!==gw*gh)return;PFW.ok=true;
 if(m.id<0){if(!MPn)fd=m.F}else{const p=PL[m.id];if(MPn&&p)p.fd=m.F}}
