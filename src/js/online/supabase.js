//# online/supabase.js — Online accounts, cloud saves, leaderboards
// ---------- online: Supabase accounts (guest or email), cloud saves, free-play leaderboards ----------
const SBU='https://tjxfnjicgbliqpdkwpus.supabase.co',SBK='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRqeGZuamljZ2JsaXFwZGt3cHVzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIxNzQ0NzIsImV4cCI6MjEwNzc1MDQ3Mn0.VdLIEjjhVyGCrbJLZY6LW-In0N9pNEja1P92Y6vVF5k';
const OLX=typeof window!='undefined'&&typeof document!='undefined'&&!!document.body&&typeof fetch=='function';
let OL={ok:null,msg:'',busy:0,cloud:null,lb:null,lbm:null,lbd:1,lbk:'',sp:null},RUN0=0,RUNW=1;
function olName(n){n=String(n||'Survivor').replace(/[^A-Za-z0-9 _-]/g,'').trim().slice(0,16);const bad=/(fuck|shit|bitch|cunt|nigg|fag|dick|pussy|slut|whore|rape)/i;return!n||bad.test(n.replace(/[ _-]/g,''))?'Survivor':n}
async function sbRaw(path,o){o=o||{};const h={'apikey':SBK,'Content-Type':'application/json','Authorization':'Bearer '+(o.tok||SBK)};if(o.prefer)h.Prefer=o.prefer;const ac=typeof AbortController!='undefined'?new AbortController():null,tm=setTimeout(()=>{try{ac&&ac.abort()}catch(e){}},9000);
try{const r=await fetch(SBU+path,{method:o.method||'GET',headers:h,body:o.body!=null?JSON.stringify(o.body):undefined,signal:ac?ac.signal:undefined});const t=await r.text();let j=null;try{j=t?JSON.parse(t):null}catch(e){}
if(!r.ok){OL.ok=1;throw olE(r.status,(j&&(j.msg||j.message||j.error_description||j.error_code||j.error))||('Server said '+r.status))}OL.ok=1;return j}
catch(e){if(e&&e.status)throw e;OL.ok=0;OL.why=String(e&&(e.message||e.name)||e);throw olE(0,"Can't reach the online server from here ("+OL.why+')')}finally{clearTimeout(tm)}}
function olE(st,m){const e=new Error(m);e.status=st;e.msg=m;return e}
function olKeep(j){if(!j||!j.access_token)return null;const u=j.user||{};S.ol=Object.assign(S.ol||{},{at:j.access_token,rt:j.refresh_token,exp:Math.floor(Date.now()/1000)+(j.expires_in||3600),uid:u.id||(S.ol&&S.ol.uid),email:u.email||(S.ol&&S.ol.email)||'',anon:u.is_anonymous??!u.email});sv();return S.ol}
let OLS=null;
// a valid session, making a guest one if needed (only when the player does something online)
function olSess(make){if(OLS)return OLS;OLS=(async()=>{const s=S.ol;if(s&&s.at&&s.exp>Date.now()/1000+60)return s;
if(s&&s.rt){try{return olKeep(await sbRaw('/auth/v1/token?grant_type=refresh_token',{method:'POST',body:{refresh_token:s.rt}}))}catch(e){if(e.status&&e.status<500){S.ol=null;sv()}else throw e}}
if(!make)return null;return olKeep(await sbRaw('/auth/v1/signup',{method:'POST',body:{data:{}}}))})();OLS.then(()=>{OLS=null},()=>{OLS=null});return OLS}
async function sbReq(path,o){o=o||{};const s=await olSess(o.make);return sbRaw(path,Object.assign({},o,{tok:s?s.at:SBK}))}
// ----- cloud save: the whole main account -----
function olData(){const A=Object.assign({},S.ac);delete A.ol;delete A.dvb;return A}
async function olUpload(force){if(!OLX||S.dev)return;const s=await olSess(true);if(!s)return;const d=olData(),h=JSON.stringify(d).length;
await sbRaw('/rest/v1/saves?on_conflict=user_id',{method:'POST',tok:s.at,prefer:'resolution=merge-duplicates,return=minimal',body:{user_id:s.uid,name:olName(S.ac.name),data:d,updated_at:new Date().toISOString()}});S.ol.up=Date.now();S.ol.lv=S.ac.lv;sv()}
async function olFetchSave(){const s=await olSess(false);if(!s)return null;const r=await sbRaw('/rest/v1/saves?select=name,data,updated_at&user_id=eq.'+s.uid,{tok:s.at});return r&&r[0]||null}
function olNewer(c){return c&&c.data&&Date.parse(c.updated_at)>(S.ol&&S.ol.up||0)+5000&&JSON.stringify(c.data)!==JSON.stringify(olData())}
function olUseCloud(){const c=OL.cloud;if(!c||!c.data||!c.data.name){sfx('deny');return}const ol=S.ol;Object.assign(S.ac,c.data);S.ol=ol;S.ol.up=Date.now();OL.cloud=null;sv();sfx('buy');olMenu('Loaded your cloud save.')}
function olKeepLocal(){OL.cloud=null;olSync(1).then(()=>olMenu('Uploaded this device\'s progress.'),e=>olMenu(e&&e.msg||String(e)))}
// sync: if the cloud has newer progress from another device, ask; otherwise upload
async function olSync(force){if(!OLX||S.dev||!S.ol)return;const c=await olFetchSave();if(c&&!force&&olNewer(c)){OL.cloud=c;return 'ask'}await olUpload();OL.msg='Saved to the cloud';return 'up'}
let OLT=0;function olAuto(){if(!OLX||!S.ol||S.olOff||OL.busy||Date.now()-OLT<60000)return;OLT=Date.now();OL.busy=1;olSync().then(r=>{if(r=='ask'&&mode=='menu'&&UIS=='')menu()},()=>{}).then(()=>{OL.busy=0})}
// ----- leaderboards -----
function olRun(){RUN0=Date.now();RUNW=wave+1}
// the score row this run would post, or null when it doesn't count (custom maps: map 63 + the map's id in cmap; playtests never count)
function olRow(){if(S.dev||MPn||TUT||cmPT(mapId)||PTX||GMD!='f'||!P||P.ac!==S.ac||wave<2)return null;const cu=cmIs(mapId);if(cu&&!cmIdOf(mapId))return null;const sc={name:olName(S.ac.name),map:cu?CMLBM:mapId,mode:'f',diff:DIF(),wave,kills,survivor:P.ci||0,start:Math.min(RUNW,wave),secs:Math.round((Date.now()-RUN0)/1000)};if(cu)sc.cmap=cmIdOf(mapId);return sc}
function olScore(){if(!OLX||S.olOff)return;const sc=olRow();if(!sc)return;
S.olq=(S.olq||[]).concat([sc]).slice(-10);sv();olFlush()}
async function olFlush(){if(!OLX||!S.olq||!S.olq.length)return;try{const s=await olSess(true);if(!s)return;while(S.olq.length){const sc=S.olq[0];try{await sbRaw('/rest/v1/scores',{method:'POST',tok:s.at,prefer:'return=minimal',body:Object.assign({user_id:s.uid},sc)})}catch(e){if(!(e.status&&e.status<500))throw e}S.olq.shift();sv()}}catch(e){}}
// m: -1 = every built-in map, a map number, or a custom map's key (its board is map 63 + its id)
async function lbLoad(m,d,mine){const q=m<0?'&map=neq.'+CMLBM:cmIs(m)?'&map=eq.'+CMLBM+'&cmap=eq.'+encodeURIComponent(cmIdOf(m)||'-'):'&map=eq.'+m;return sbRaw('/rest/v1/leaderboard?select=user_id,name,map,wave,kills,survivor,created_at&mode=eq.f&diff=eq.'+d+q+(mine?'&user_id=eq.'+mine:'')+'&order=wave.desc,kills.desc,created_at.asc&limit='+(m<0?150:50))}
function lbOpen(m,d){if(m!=null)OL.lbm=m;if(d!=null)OL.lbd=d;if(OL.lbm==null)OL.lbm=-1;UIS='lb';mode='menu';const key=OL.lbm+'_'+OL.lbd;lbDraw(OL.lbk==key?OL.lb:null);if(OL.lbk==key&&OL.lb)return;OL.lbk=key;OL.lb=null;if(!OLX){lbDraw('off');return}
lbLoad(OL.lbm,OL.lbd).then(r=>{if(OL.lbm<0&&r){const seen={};r=r.filter(x=>seen[x.user_id]?0:(seen[x.user_id]=1)).slice(0,50)}OL.lb=r||[];if(UIS=='lb'&&OL.lbk==key)lbDraw(OL.lb)},e=>{OL.lb=null;OL.lbk='';if(UIS=='lb')lbDraw({err:e.msg})})}
function lbStep(k){const L=[-1].concat(MP.map((_,i)=>i),cmFree());let i=L.indexOf(OL.lbm);if(i<0)i=0;OL.lbm=L[(i+k+L.length)%L.length];sfx('click');lbOpen()}
function lbDraw(r){const me=S.ol&&S.ol.uid,d=OL.lbd;if(cmIs(OL.lbm)&&!cmDocOf(OL.lbm))OL.lbm=-1;const m=OL.lbm,cu=cmIs(m);let body;
if(r&&r.err&&cu&&/cmap/.test(r.err))body='<p class=note>Leaderboards for custom maps aren\'t switched on on the server yet.</p>';else if(r=='off')body='<p class=note>Leaderboards need the game to be online.</p>';else if(r&&r.err)body=`<p class=note>${r.err}.</p><button data-q=1 onclick="OL.lbk='';lbOpen()">TRY AGAIN</button>`;else if(!r)body='<p class=note>Loading…</p>';
else if(!r.length)body='<p class=note>No scores yet. Be the first!</p>';
else body='<div class=lbl>'+r.map((x,i)=>`<div class="lbr${x.user_id==me?' me':''}"><b>${i+1}</b><span>${String(x.name).replace(/[<>&]/g,'')}${m<0&&MP[x.map]?`<small>${MP[x.map].n}</small>`:''}</span><span>${CH[x.survivor]?CH[x.survivor].n:''}</span><b>W${x.wave}</b><small>${x.kills} kills</small></div>`).join('')+'</div>';
show(`<div class="p wide"><h2>LEADERBOARDS</h2><p class=note>Best free-play wave per player.${cu?' Custom map: everyone with this same map file shares this board.':''}${S.ol?'':' Your scores post after your first free-play run.'}</p><div class=row><button data-q=1 onclick="lbStep(-1)">◀</button><b style="flex:2;text-align:center;align-self:center">${m<0?'ALL MAPS':edEsc(mpName(m).toUpperCase())}</b><button data-q=1 onclick="lbStep(1)">▶</button></div><div class=seg>${[0,1,2].map(k=>`<button class="${d==k?'on':''}" onclick="lbOpen(null,${k})">${DNm(k,0)}</button>`).join('')}</div>${body}<button class=go onclick="UIS='';menu()">BACK</button></div>`)}
// ----- the online screen -----
function olTag(){return!OLX?'offline':S.ol?(S.ol.anon?'guest account':S.ol.email):'not signed in'}
function olMenu(msg){UIS='ol';mode='menu';const s=S.ol,c=OL.cloud;
show(`<div class="p wide"><h2>ONLINE</h2>${msg?`<p class=note style="color:#9be860">${msg}</p>`:''}
${OL.last?`<p class=note style="color:#ff8a5a">Last problem: ${String(OL.last).replace(/[<>&]/g,'')}</p>`:''}${!OLX?'<p class=note>Online features are not available here.</p>':OL.ok===0?'<p class=note style="color:#ff8a5a">Can\'t reach the online server right now. The game still saves on this device.</p>':''}
${c?`<div class=cpb><b>Newer progress found online</b><small>${String(c.name).replace(/[<>&]/g,'')} · LV ${c.data.lv} · saved ${new Date(c.updated_at).toLocaleString()}</small><div class=row><button class=go onclick="olUseCloud()">USE ONLINE SAVE</button><button onclick="olKeepLocal()">KEEP THIS DEVICE</button></div></div>`:''}
<div class=opt><div><h3>Account</h3><p class=note>${!s?'Not signed in. Go online to back up your progress and post scores.':s.anon?'Signed in as a <b>guest</b> on this device. Add an email to use the same account on other devices.':'Signed in as <b>'+s.email+'</b>.'}${s&&s.up?'<br>Last backup: '+new Date(s.up).toLocaleString():''}</p>
${!s?'<button class=go onclick="olGo()">GO ONLINE (GUEST)</button>':'<button class=go onclick="olBackup()">BACK UP NOW</button>'}
${!s||s.anon?`<input id=ole type=email placeholder="email" autocomplete=email autocapitalize=off><input id=olp type=password placeholder="password (6+ characters)" autocomplete=current-password><div class=row>${s?'<button data-q=1 onclick="olLink()">ADD EMAIL</button>':''}<button data-q=1 onclick="olLogin()">SIGN IN</button>${s?'':'<button data-q=1 onclick="olSignup()">CREATE</button>'}</div><p class=note id=olm></p>`:''}
${s?'<button onclick="olOut()">SIGN OUT<small>this device only</small></button>':''}</div>
<div><h3>Leaderboards</h3><div class=seg><button class="${S.olOff?'':'on'}" onclick="S.olOff=0;sv();olMenu()">Post my scores</button><button class="${S.olOff?'on':''}" onclick="S.olOff=1;sv();olMenu()">Don't post</button></div><p class=note>Your best free-play wave on each map shows under your name: <b>${olName(S.ac.name)}</b>.</p><button onclick="lbOpen()">VIEW LEADERBOARDS</button></div></div>
<button class=go onclick="UIS='';menu()">BACK</button></div>`)}
function olMsg(t){const e=document.getElementById('olm');if(e)e.textContent=t}
function olBusy(p,ok){OL.busy=1;olMsg('Working…');return p.then(ok,e=>{const m=(e&&(e.msg||e.message))||String(e);OL.last=m;try{olMenu()}catch(_){}olMsg(m);sfx('deny')}).catch(e=>{olMsg(String(e&&e.message||e))}).then(()=>{OL.busy=0})}
function olGo(){olBusy(olSess(true).then(()=>olSync()),r=>olMenu(r=='ask'?'':'You\'re online. Progress backed up.'))}
function olBackup(){olBusy(olSync(),r=>olMenu(r=='ask'?'':'Backed up.'))}
function olCred(){const e=(document.getElementById('ole')||{}).value||'',p=(document.getElementById('olp')||{}).value||'';if(!/^\S+@\S+\.\S+$/.test(e)){olMsg('Enter a valid email.');return null}if(p.length<6){olMsg('Password needs 6+ characters.');return null}return{email:e.trim(),password:p}}
function olLogin(){const c=olCred();if(!c)return;olBusy(sbRaw('/auth/v1/token?grant_type=password',{method:'POST',body:c}).then(j=>{olKeep(j);S.ol.up=0;return olFetchSave()}),sv_=>{OL.cloud=sv_&&sv_.data?sv_:null;if(!OL.cloud)olSync(1).catch(()=>{});olMenu(OL.cloud?'Signed in.':'Signed in. This device\'s progress is now backed up.')})}
function olSignup(){const c=olCred();if(!c)return;olBusy(sbRaw('/auth/v1/signup',{method:'POST',body:c}).then(j=>{if(!j.access_token)throw{msg:'Check your email to confirm, then sign in'};olKeep(j);return olSync(1)}),()=>olMenu('Account created and backed up.'))}
function olLink(){const c=olCred();if(!c)return;olBusy(olSess(false).then(s=>{if(!s)throw{msg:'Not signed in'};return sbRaw('/auth/v1/user',{method:'PUT',tok:s.at,body:c})}).then(u=>{if(u&&u.email){S.ol.email=u.email;S.ol.anon=false;sv();return 'ok'}return 'conf'}),r=>olMenu(r=='ok'?'Email added. Sign in with it on your other devices.':'Check your email to confirm it, then sign in on your other devices.'))}
function olOut(){S.ol=null;OL.cloud=null;sv();sfx('click');olMenu('Signed out on this device. Your progress here is kept.')}
function olBanner(){const c=OL.cloud;return c&&c.data?`<div class=cpb><b>Newer progress found online</b><small>LV ${c.data.lv} from another device</small><div class=row><button class=go onclick="olUseCloud();menu()">USE IT</button><button onclick="olKeepLocal()">KEEP THIS DEVICE</button></div></div>`:''}
if(OLX)setTimeout(()=>{if(S.ol){OL.busy=1;olSync().then(r=>{if(r=='ask'&&mode=='menu'&&!UIS)menu()},()=>{}).then(()=>{OL.busy=0;OLT=Date.now()})}olFlush().catch(()=>{})},2500);

