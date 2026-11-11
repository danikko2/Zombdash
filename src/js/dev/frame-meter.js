//# dev/frame-meter.js — Frame time readout (test mode switch "Frame time readout"): how close this device gets to the frame budget
// FM collects, for the last half second: the time between frames as the screen sees it (t), and how long the game update (u)
// and the drawing (d) took on the main thread (timed in core/main-loop.js). Every half second the panel in the bottom right
// shows frames per second, average and worst frame, update and drawing time, the share of the 16.7 ms budget (60 fps) they use,
// and what is on screen. Green: the worst frame stayed under 20 ms; yellow: under 34 ms (a dropped frame now and then); red: slower.
let FMON=false,fmEl=null,fmT0=0,fmLast=0;const FM={t:[],u:[],d:[]};
function fmFrame(t){try{FMON=DT('fps')&&mode!='splash'&&mode!='intro';if(!FMON){if(fmEl&&fmEl.style.display!='none')fmEl.style.display='none';fmLast=0;return}
 if(fmLast)FM.t.push(t-fmLast);fmLast=t;if(!fmT0)fmT0=t;if(t-fmT0<500)return;
 if(!fmEl){if(!document.body||!document.body.appendChild)return;fmEl=document.createElement('pre');fmEl.id='fmtr';fmEl.style.cssText='position:fixed;right:8px;bottom:8px;z-index:61;margin:0;padding:6px 9px;background:rgba(0,0,0,.78);color:#d8f0c8;font:12px/1.4 ui-monospace,Menlo,Consolas,monospace;border:1px solid #3a5a30;border-left-width:4px;border-radius:4px;pointer-events:none;white-space:pre'}
 if(!fmEl.parentNode)document.body.appendChild(fmEl);fmEl.style.display='block';fmEl.textContent=fmText(t-fmT0);fmEl.style.borderLeftColor=FM.col;
 fmT0=t;FM.t=[];FM.u=[];FM.d=[]}catch(e){}}
function fmText(span){const av=a=>a.length?a.reduce((x,y)=>x+y,0)/a.length:0,mx=a=>a.length?Math.max(...a):0,f=v=>v.toFixed(1).padStart(5);
 const n=FM.t.length,fps=n?n*1000/span:0,wt=mx(FM.t),ua=av(FM.u),da=av(FM.d),busy=(ua+da)/16.7*100;FM.col=wt<20?'#9be860':wt<34?'#ffcf40':'#ff5a4a';
 const dpr=typeof devicePixelRatio=='number'?devicePixelRatio:1,cv=X&&X.canvas?X.canvas.width+'×'+X.canvas.height:'?';
 const L=[`FPS   ${fps.toFixed(0).padStart(5)}    ${FM.col=='#9be860'?'smooth':FM.col=='#ffcf40'?'some dropped frames':'slow'}`,
  `frame ${f(av(FM.t))} ms  worst ${f(wt)}`,
  `logic ${f(ua)} ms  worst ${f(mx(FM.u))}`,`draw  ${f(da)} ms  worst ${f(mx(FM.d))}`,
  `budget used ${busy.toFixed(0).padStart(3)}% of 16.7 ms`];
 if(mode=='play'||mode=='pause'||mode=='shop')L.push(`zombies ${zs.length}/${ZCAP()} · players ${PL.length} · ${MP[mapId]?MP[mapId].n:'custom map'}`,`paths  ${PFW.ok?'background thread':PFW.ok===false?'main thread':'starting'}`,`spawns ground ${ZSPC.g} · points ${ZSPC.p} · old way ${ZSPC.o}`,`stuck  squeezed ${ZUNC.sq} · side-steps ${ZUNC.sd} · lifted ${ZUNC.hp}`);
 L.push(`screen ${W}×${H} · canvas ${cv} · ${dpr}x`);return L.join('\n')}
