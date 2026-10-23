//# system/phones-checkpoints-crashlog.js — Low-memory mode, checkpoints, crash log
// ---------- phones: low-memory mode, wave checkpoints you can resume after a crash, and a crash log ----------
var BGL=null,LMX=false,CPR=null;
function lowMem(){const o=S.lm||'a';if(o=='on')return true;if(o=='off')return false;try{const ua=navigator.userAgent||'',tp=navigator.maxTouchPoints||0,ios=/iPhone|iPad|iPod/.test(ua)||(/Macintosh/.test(ua)&&tp>1),ph=tp>0&&Math.min(screen.width,screen.height)<=900;return!!(ios||ph)}catch(e){return false}}
LMX=lowMem();
function setLM(v){S.lm=v;sv();LMX=lowMem();options(OPF)}
// release the old map's canvases right away (iOS is slow to free canvas memory on its own)
function bgFree(){try{for(const v of(HS&&HS.VH)||[]){if(v.cv){v.cv.width=0;v.cv.height=0;v.cv=null}v.al=null}if(BGL){BGL.width=0;BGL.height=0;BGL=null}}catch(e){}}
// low-memory: keep the map background at half size (drawn back up with crisp pixels) and free the full-size one
function bgLow(){LMX=lowMem();if(!LMX||typeof document=='undefined'||!document.createElement)return;try{const k=.5,c=document.createElement('canvas');c.width=Math.ceil(WW*k);c.height=Math.ceil(WH*k);const q=c.getContext('2d');if(!q||!q.drawImage)return;q.imageSmoothingEnabled=true;try{q.imageSmoothingQuality='high'}catch(e){}q.drawImage(BG,0,0,WW,WH,0,0,c.width,c.height);c.k=k;BGL=c;BG.width=1;BG.height=1}catch(e){BGL=null}}
function bgDraw(x0,y0,w,h,dx,dy){if(BGL){const k=BGL.k,sm=X.imageSmoothingEnabled;X.imageSmoothingEnabled=false;X.drawImage(BGL,x0*k,y0*k,w*k,h*k,dx,dy,w,h);X.imageSmoothingEnabled=sm}else X.drawImage(BG,x0,y0,w,h,dx,dy,w,h)}
// free menu-only pictures once a run starts
function lmRun(){if(!LMX)return;try{for(const k in MPV){if(MPV[k])MPV[k].src='';delete MPV[k]}if(AU.cma){for(const k in AU.cma){const c=AU.cma[k];if(c&&c.width){c.width=0;c.height=0}}AU.cma={}}}catch(e){}}
// rough canvas memory in use, for the crash log
function memMB(){let b=BGL?BGL.width*BGL.height*4:(BG&&BG.width>1?WW*WH*4:0);for(const v of(HS&&HS.VH)||[])if(v.cv)b+=v.w*v.h*4+(v.al?v.w*v.h:0);try{b+=Object.keys(SKC).length*PIMG.naturalWidth*PIMG.naturalHeight*4}catch(e){}return Math.round(b/1e5)/10}
// ----- checkpoints: saved every time a wave is cleared (solo runs) -----
const CPK='zd_cp';
function cpGet(){try{const c=JSON.parse(localStorage[CPK]||'null');return c&&c.v==1?c:null}catch(e){return null}}
function cpClear(){try{delete localStorage[CPK]}catch(e){}}
function cpSave(){if(MPn||TUT||!P||cmPT(mapId)||GMD=='c'&&wave>=20)return;try{const p=P,rp=CREP&&CREP.key===mapId,cu=cmIs(mapId)&&!rp;if(cu&&!cmIdOf(mapId))return;localStorage[CPK]=JSON.stringify({v:1,t:Date.now(),an:S.ac.name,gm:GMD,m:rp?CREP.o:cu?-1:mapId,cm:cu?cmIdOf(mapId):undefined,cr:rp?CREP.id:undefined,ci:p.ci||0,d:DIF(),w:wave,k:kills,L:LIVES,IW,BB,LB,
p:{cash:p.cash,hp:p.hp,mx:p.mx,ar:p.ar||0,own:p.own,cur:p.cur,mg:p.mg,am:p.am,paid:p.paid,v:p.v||0}})}catch(e){}}
// a run on a custom map keeps the map's id (cm): it resumes once that map is loaded on this device
function cpMap(c){return c.cm?cmKeyById(c.cm):MP[c.m]?c.m:null}
// a campaign run on a custom map is only offered while that map is still in its slot (or still replaces the same map)
function cpOK(){const c=cpGet();if(!(c&&c.an==S.ac.name&&cpMap(c)!=null&&CH[c.ci]))return null;if(c.gm=='c'){if(c.cm&&!ccOfKey(cpMap(c)))return null;if(c.cr){const r=ccRep(c.m);if(!r||r.id!==c.cr)return null}}return c}
function cpResume(){const c=cpOK();if(!c){sfx('deny');return menu()}sfx('click');setGM(c.gm);if(c.gm=='c')S.dlc=c.d;else S.dlf=c.d;mapId=cpMap(c);if(!c.cm)S.mp=c.m;sel=c.ci;CPR=c;try{start()}finally{CPR=null}}
function cpApply(){const c=CPR;wave=c.w;kills=c.k||0;if(c.gm=='c')LIVES=c.L||LIVES;if(c.IW)IW=c.IW;if(c.BB)BB=c.BB;LB=c.LB||0;Object.assign(P,c.p);if(!P.own.includes(P.cur))P.cur=P.own[0];P.hp=Math.max(1,Math.min(P.hp,P.mx));lmRun();mode='shop';PRE=0;shop();FT.push({x:P.x,y:P.y-40,t:'RUN RESUMED',c:'#9be860',l:2})}
function cpBanner(){const c=cpOK();if(!c)return'';const crash=CRL.length&&CRL[0].t>=c.t&&!CRL[0].seen;return `<div class=cpb><b>${crash?'The game stopped unexpectedly.':'Unfinished run'}</b><small>${edEsc(c.cr&&ccRep(c.m)?mpName(ccRep(c.m).key)+' (instead of '+MP[c.m].n+')':mpName(cpMap(c)))} · ${CH[c.ci].n} · wave ${c.w} cleared · $${c.p.cash}</small><div class=row><button class=go onclick="cpResume()">RESUME AT WAVE ${c.w+1}</button><button onclick="cpClear();menu()">DISCARD</button></div></div>`}
// ----- crash log: a heartbeat every few seconds; if the next load finds it wasn't closed cleanly, it's logged -----
const CLK='zd_crash',HBK='zd_hb';let CRL=[],HB0=0,FPS={n:0,t:0,v:0},UP0=Date.now();
try{CRL=JSON.parse(localStorage[CLK]||'[]')||[]}catch(e){CRL=[]}
try{const h=JSON.parse(localStorage[HBK]||'null');if(h&&!h.clean){const kind=h.vis===0?'Closed by the phone while in the background':h.run?'Stopped during play':'Stopped in the menus';CRL.unshift(Object.assign({kind},h));CRL=CRL.slice(0,10);localStorage[CLK]=JSON.stringify(CRL)}}catch(e){}
function clFrame(t){FPS.n++;if(!FPS.t)FPS.t=t;if(t-FPS.t>=2000){FPS.v=Math.round(FPS.n*1000/(t-FPS.t));FPS.n=0;FPS.t=t}const n=Date.now();if(n-HB0>=3000){HB0=n;clBeat(0)}}
function clBeat(clean){try{const run=mode=='play'||mode=='pause'||mode=='shop'||mode=='lifeo';localStorage[HBK]=JSON.stringify({t:Date.now(),clean:clean?1:0,vis:typeof document!='undefined'&&document.hidden?0:1,run:run?1:0,mode,map:MP[mapId]?MP[mapId].n:'?',wave,zs:zs.length,pt:pt.length,bs:bs.length,ep:ep.length,fps:FPS.v,lm:LMX?1:0,mb:memMB(),up:Math.round((Date.now()-UP0)/1000),mp:MPn||0,err:(ERRS||[]).slice(-2),dev:(typeof navigator!='undefined'&&navigator.userAgent||'').slice(0,140),sc:typeof screen!='undefined'?screen.width+'x'+screen.height:''})}catch(e){}}
if(typeof addEventListener!='undefined'){addEventListener('pagehide',()=>clBeat(1));}
if(typeof document!='undefined'&&document.addEventListener)document.addEventListener('visibilitychange',()=>clBeat(0));
function clErr(m){try{CRL.unshift({kind:'Script error',t:Date.now(),map:MP[mapId]?MP[mapId].n:'?',wave,mode,err:[String(m).slice(0,200)],lm:LMX?1:0,mb:memMB(),fps:FPS.v,zs:zs.length});CRL=CRL.slice(0,10);localStorage[CLK]=JSON.stringify(CRL)}catch(e){}}
function clLine(e){const d=new Date(e.t),tm=d.toLocaleDateString(undefined,{month:'short',day:'numeric'})+' '+d.toLocaleTimeString(undefined,{hour:'numeric',minute:'2-digit'});return `${tm} · ${e.kind} · ${e.map||'?'}${e.run||e.kind=='Script error'?' wave '+e.wave:''} · ${e.zs??'?'} zombies · ${e.fps||'?'} fps · ~${e.mb??'?'}MB pictures · low-memory ${e.lm?'on':'off'}${e.up?' · ran '+Math.round(e.up/60)+' min':''}${e.err&&e.err.length?' · error: '+e.err.join(' | '):''}`}
function clText(){return 'Zombdash crash log\n'+(CRL.length?CRL.map(clLine).join('\n'):'(empty)')+'\nDevice: '+((typeof navigator!='undefined'&&navigator.userAgent)||'?')+(typeof screen!='undefined'?' · screen '+screen.width+'x'+screen.height:'')+' · low-memory '+(LMX?'on':'off')}
function clCopy(){const t=clText();try{navigator.clipboard.writeText(t).then(()=>{sfx('buy');const e=document.getElementById('clmsg');if(e)e.textContent='Copied! Paste it into the chat.'},()=>clShowT(t))}catch(e){clShowT(t)}}
function clShowT(t){const e=document.getElementById('clmsg');if(e)e.innerHTML='<textarea readonly style="width:100%;height:120px;font-size:11px">'+t.replace(/</g,'&lt;')+'</textarea>'}
function clClear(){CRL=[];try{localStorage[CLK]='[]'}catch(e){}options(OPF)}
function clBox(){CRL.forEach(e=>e.seen=1);try{localStorage[CLK]=JSON.stringify(CRL)}catch(e){}
return `<div><h3>Phone performance</h3><div class=seg>${[['a','Auto'],['on','Low memory'],['off','Full']].map(o=>`<button class="${(S.lm||'a')==o[0]?'on':''}" onclick="setLM('${o[0]}')">${o[1]}</button>`).join('')}</div><p class=note>Low-memory mode is ${LMX?'<b>on</b>':'off'}${(S.lm||'a')=='a'?' (Auto turns it on for phones)':''}. It keeps map pictures at half size and limits effects so big maps don't crash. Applies from the next map you load.</p>
<h3>Crash log</h3><p class=note>${CRL.length?CRL.length+' entr'+(CRL.length>1?'ies':'y')+'. Newest first:':'Nothing logged yet.'}</p>${CRL.slice(0,4).map(e=>`<p class=note style="font-size:12px;opacity:.85">• ${clLine(e)}</p>`).join('')}<div class=row><button data-q=1 onclick="clCopy()">Copy log</button>${CRL.length?'<button data-q=1 onclick="clClear()">Clear</button>':''}</div><p class=note id=clmsg></p></div>`}

