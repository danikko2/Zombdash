//# dev/spawn-diagnostics.js — Spawn diagnostics panel (test mode, PC)
// ---- developer diagnostics (test mode + PC only, switched on in Options) ----
const ZPC=(()=>{try{const ua=navigator.userAgent||'',tp=navigator.maxTouchPoints||0;if(/iPhone|iPad|iPod|Android|Mobile/i.test(ua))return false;if(/Macintosh/.test(ua)&&tp>1)return false;return typeof matchMedia!='function'||matchMedia('(pointer:fine)').matches}catch(e){return false}})();
function ZDON(){return!!(S.dev&&S.zdbg&&ZPC)}
function zdSet(v){S.zdbg=v?1:0;sv();sfx('click');options()}
const _devBox0=devBox;devBox=function(){return _devBox0()+(S.dev&&ZPC?`<div class=dvb><h3>Spawn diagnostics</h3><div class=seg><button class="${S.zdbg?'on':''}" onclick="zdSet(1)">On</button><button class="${S.zdbg?'':'on'}" onclick="zdSet(0)">Off</button></div><p class=note>Test mode, PC only. Shows a small panel during play: wave, new zombie type, living / ranged / special counts against the caps, and any spawn that was delayed or swapped because of a cap. Also logs to the browser console.</p></div>`:'')};
let zdEl=null,zdT=0;
function zdFrame(){try{const on=ZDON()&&(mode=='play'||mode=='pause');if(!on){if(zdEl&&zdEl.style.display!='none')zdEl.style.display='none';return}
 const n=performance.now();if(n-zdT<250&&zdEl&&zdEl.style.display!='none')return;zdT=n;
 if(!zdEl){if(!document.body||!document.body.appendChild)return;zdEl=document.createElement('pre');zdEl.id='zdbg';zdEl.style.cssText='position:fixed;left:8px;bottom:8px;z-index:60;margin:0;padding:6px 8px;background:rgba(0,0,0,.72);color:#d8f0c8;font:12px/1.35 ui-monospace,Menlo,Consolas,monospace;border:1px solid #3a5a30;border-radius:4px;pointer-events:none;white-space:pre;max-width:46vw;overflow:hidden';document.body.appendChild(zdEl)}
 zdEl.style.display='block';zdEl.textContent=zdText()}catch(e){}}
function zdText(){const C=zCen(),d=zDi(),pc=(a,b)=>b?(a*100/b).toFixed(1)+'%':'0%',it=zIntro(),ev=ZD.ev,ag=ev?((performance.now()-ev.t)/1000).toFixed(1)+'s ago':'';
 const sch=Object.entries(IW).sort((a,b)=>a[1]-b[1]).map(([t,w])=>w+':'+(ZC[t]?ZC[t].n.replace('Toxic the ','').replace('People ','P.'):t)+(w<=wave?'✓':'')).join(' ');
 return 'SPAWN DIAGNOSTICS · '+['Easy','Normal','Hard'][d]+(MPn>1?' · '+MPn+'P':'')+'\n'+
 'Wave '+wave+(it!=null?' · INTRO: '+ZC[it].n+' only ('+Math.round((ZD.k||0)*100)+'% of '+(ZD.n0||'?')+' = '+(ZD.n||'?')+')':' · regular')+'\n'+
 'Living '+C.n+' · ranged '+C.r+' ('+pc(C.r,C.n)+') · special '+C.s+' ('+pc(C.s,C.n)+')\n'+
 'This wave '+ZD.tw.n+' spawned · still to spawn '+toSp+(zCamp()?' · campaign section '+(secOf(mapId)+1):'')+'\n'+
 'Ranged  '+ZD.tw.r+' ('+pc(ZD.tw.r,ZD.tw.n)+' of wave) cap '+ZCFG.cap.rg[d]+'%\n'+
 'Special '+ZD.tw.s+' ('+pc(ZD.tw.s,ZD.tw.n)+' of wave) cap '+zCapSp(d)+'%\n'+
 'Cap hits this wave: special '+ZD.rj.special+' · ranged '+ZD.rj.ranged+' · max '+ZD.rj.max+' · delayed '+ZD.dl+'\n'+
 (ev?'Last: '+ev.m+' ('+ag+')\n':'Last: no cap events\n')+
 'Schedule '+sch}

