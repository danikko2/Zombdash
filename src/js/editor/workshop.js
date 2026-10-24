//# editor/workshop.js — The Map Workshop screen (CREATE on the main menu): your maps with thumbnails, search, new, edit, play, rename, duplicate, export, import, delete, draft recovery
// ---------- map workshop ----------
let WSQ='',WSD=null;
function wsTouch(){try{return !!(globalThis.matchMedia&&!matchMedia('(pointer:fine)').matches)}catch(e){return 0}}
function wsAgo(t){const s=(Date.now()-Date.parse(t))/1000;if(!isFinite(s))return '';if(s<60)return 'just now';if(s<3600)return Math.floor(s/60)+' min ago';if(s<86400)return Math.floor(s/3600)+' h ago';if(s<86400*30)return Math.floor(s/86400)+' days ago';try{return new Date(t).toLocaleDateString()}catch(e){return ''}}
function wsImg(u){return typeof u=='string'&&/^data:image\/(png|jpeg);base64,[A-Za-z0-9+/=]+$/.test(u)?u:''}
async function workshop(msg){mode='menu';UIS='ws';MPn=0;music('menu');duck(1);if(!CMLOK)show(`<div class="p wide ws"><h2>MAP WORKSHOP</h2><p class=note>Loading your maps…</p></div>`);
try{await cmLoadAll()}catch(e){}try{WSD=await msGet('kv','draft')}catch(e){WSD=null}if(UIS!='ws'||mode!='menu')return;wsDraw(msg)}
function wsDraw(msg){const touch=wsTouch(),D_=WSD&&WSD.json?WSD:null;
show(`<div class="p wide ws"><h2>MAP WORKSHOP</h2>${msg?`<p class=wsmsg>${msg}</p>`:''}
${D_?`<div class=cpb><b>Unsaved changes found</b><small>Your changes to “${edEsc(D_.name)}” from ${wsAgo(new Date(D_.t).toISOString())} were never saved.</small><div class=row><button onclick="wsDraft(0)">DISCARD</button><button class=go onclick="wsDraft(1)"${touch?' disabled':''}>RECOVER</button></div></div>`:''}
${CCW.length?`<div class=cpb><b>Campaign</b><small>${CCW.map(edEsc).join('<br>')}</small></div>`:''}${msMem()?'<div class=cpb><b>This browser can\'t store maps</b><small>Maps made now last until the page is closed. Use EXPORT to keep a map as a file.</small></div>':''}
${touch?'<p class=note>Making and editing maps needs a mouse and keyboard. You can still play, import, export and delete maps here.</p>':''}
<div class=wsbar><input type=search id=wsq placeholder="Search your maps" value="${edEsc(WSQ)}" oninput="wsSearch(this.value)" autocomplete=off><button class=go onclick="wsNew()"${touch?' disabled':''}>NEW MAP</button><button onclick="wsImport()">IMPORT</button></div>
<div class=wsl id=wsl>${wsList()}</div>${wsSamples()}${wsBuiltins()}<div class=row><button onclick="UIS='';menu()">BACK</button></div></div>`)}
function wsSearch(v){WSQ=v;const el=document.getElementById('wsl');if(el)el.innerHTML=wsList()}
function wsList(){const q=WSQ.trim().toLowerCase(),touch=wsTouch();if(!CML.length)return `<div class=wsemp><b>No maps yet</b><p class=note>Press NEW MAP to start one, or IMPORT a map file someone sent you.</p></div>`;
const L=CML.map((e,i)=>({e,i})).filter(({e})=>!q||String(e.meta.name||'').toLowerCase().includes(q)||String(e.meta.desc||'').toLowerCase().includes(q));if(!L.length)return `<p class=note>No map matches “${edEsc(WSQ)}”.</p>`;
return L.map(({e,i})=>{const m=e.meta,ok=!!e.doc,img=wsImg(m.thumb),pr=ok?e.warnings.length:0;
return `<div class="wsc${ok?'':' bad'}">${img?`<img class=wst alt="" src="${img}">`:'<i class=wst></i>'}<div class=wsi><b>${edEsc(m.name||'Untitled map')}</b><small>${m.w}×${m.h} tiles · edited ${wsAgo(m.updated)}</small>${wcStatus(e.id)}${ok?(pr?`<small class=wsw>⚠ ${edEsc(e.warnings[0])}</small>`:`<small>${edEsc(m.desc||'')}</small>`):`<small class=wsw>✖ Can't open: ${edEsc(e.errors[0]||'unknown problem')}</small>`}
<div class=wsa>${ok?`<button class=go onclick="wsEdit(${i})"${touch?' disabled':''}>EDIT</button><button onclick="wsPlay(${i})">PLAY</button>`:''}<span class=wslk>${ok?`<button class=lnk onclick="wsRename(${i})">rename</button><button class=lnk onclick="wsDup(${i})">duplicate</button>`:''}${ok?`<button class=lnk onclick="wcOpen(CML[${i}].id,'ws')">campaign</button>`:ccSlotOfId(e.id)||ccRepOfId(e.id)!=null?`<button class=lnk onclick="wsCampOut(${i})">remove from campaign</button>`:''}<button class=lnk onclick="wsExport(${i})">export</button><button class=lnk onclick="wsDel(${i})">delete</button></span></div></div></div>`}).join('')}
// ----- new map -----
function wsNew(){const g=CMTER.map(t=>`<option value="${t.id}"${t.id=='grass'?' selected':''}>${edEsc(t.n)}</option>`).join('');
show(`<div class="p wide ws wsn"><h2>NEW MAP</h2><label class=wsf><span>Name</span><input id=wsn maxlength=40 value="My map" autocomplete=off></label><label class=wsf><span>About (optional)</span><input id=wsd maxlength=240 autocomplete=off placeholder="What happens on this map?"></label>
<div class=wsrow><label class=wsf><span>Width (tiles)</span><input type=number id=wsw min=${CMMIN[0]} max=${CMMAX} value=72></label><label class=wsf><span>Height (tiles)</span><input type=number id=wsh min=${CMMIN[1]} max=${CMMAX} value=56></label></div>
<div class="seg wsps">${[['SMALL',48,36],['MEDIUM',72,56],['LARGE',100,80],['HUGE',128,128]].map(p=>`<button data-q=1 onclick="wsSize(${p[1]},${p[2]})">${p[0]}<small>${p[1]}×${p[2]}</small></button>`).join('')}</div>
<p class=note>Each tile is ${CMTILE}px. MEDIUM is about the size of the Suburb; you can change the size later.</p>
<label class=wsf><span>Ground</span><select id=wsg>${g}</select></label><p class=note id=wserr></p>
<div class=row><button onclick="workshop()">CANCEL</button><button class=go onclick="wsCreate()">CREATE</button></div></div>`);try{const n=document.getElementById('wsn');if(n&&n.select){n.focus();n.select()}}catch(e){}}
function wsSize(w,h){const a=document.getElementById('wsw'),b=document.getElementById('wsh');if(a)a.value=w;if(b)b.value=h;sfx('click')}
function wsVal(id){const e=document.getElementById(id);return e?e.value:''}
async function wsCreate(){const w=+wsVal('wsw'),h=+wsVal('wsh'),er=document.getElementById('wserr');
if(!(w>=CMMIN[0]&&w<=CMMAX&&h>=CMMIN[1]&&h<=CMMAX)){if(er)er.textContent='Width must be '+CMMIN[0]+'–'+CMMAX+' and height '+CMMIN[1]+'–'+CMMAX+' tiles.';sfx('deny');return}
const d=cmNew({name:String(wsVal('wsn')).replace(/[<>]/g,'').trim()||'Untitled map',desc:String(wsVal('wsd')).replace(/[<>]/g,'').trim(),w,h,ground:wsVal('wsg')});sfx('click');
try{await wsStore(d)}catch(e){if(er)er.textContent='Could not save the new map: '+(e&&e.message||e);return}edOpen(d,'saved')}
// write a map (doc) and its list entry
function wsStore(d){d.updated=new Date().toISOString();let thumb='';try{thumb=edMakeThumb(d)}catch(e){}return msWrite([['put','maps',{id:d.id,json:cmWrite(d)}],['put','meta',{id:d.id,name:d.name,desc:d.desc,w:d.w,h:d.h,created:d.created,updated:d.updated,thumb}]]).then(()=>cmLoadAll())}
// ----- the actions on a map -----
function wsEdit(i){const e=CML[i];if(!e||!e.doc)return;sfx('click');edOpen(cmClone(e.doc),'saved')}
function wsPlay(i){const e=CML[i];if(!e||!e.doc)return;setGM('f');mapId=e.key;sfx('click');play()}
function wsRename(i){const e=CML[i];if(!e||!e.doc)return;show(`<div class="p ws"><h2>RENAME MAP</h2><label class=wsf><span>Name</span><input id=wsrn maxlength=40 value="${edEsc(e.doc.name)}" autocomplete=off></label><div class=row><button onclick="workshop()">CANCEL</button><button class=go onclick="wsRenameOk(${i})">RENAME</button></div></div>`);try{const n=document.getElementById('wsrn');n.focus();n.select()}catch(_){}}
async function wsRenameOk(i){const e=CML[i];if(!e||!e.doc)return workshop();const v=String(wsVal('wsrn')).replace(/[<>]/g,'').trim().slice(0,40);if(!v){sfx('deny');return}
const d=cmClone(e.doc);d.name=v;try{await wsStore(d)}catch(err){return workshop('Could not rename: '+edEsc(err&&err.message||err))}workshop('Renamed to “'+edEsc(v)+'”.')}
async function wsDup(i){const e=CML[i];if(!e||!e.doc)return;const d=cmClone(e.doc);d.id=cmUid('m');d.name=(e.doc.name.slice(0,33)+' (copy)');d.created=new Date().toISOString();try{await wsStore(d)}catch(err){return workshop('Could not duplicate: '+edEsc(err&&err.message||err))}workshop('Made “'+edEsc(d.name)+'”.')}
// export the stored file exactly as it is (works even for maps that can't be opened)
async function wsExport(i){const e=CML[i];if(!e)return;let rec=null;try{rec=await msGet('maps',e.id)}catch(_){}if(!rec||!rec.json){sfx('deny');return workshop('There is no map data to export for “'+edEsc(e.meta.name)+'”.')}cmDownload(e.meta.name,rec.json);sfx('click')}
function wsDel(i){const e=CML[i];if(!e)return;show(`<div class="p ws"><h2>DELETE MAP?</h2><p>“${edEsc(e.meta.name)}” will be deleted from this device. This can't be undone. EXPORT it first if you might want it back.</p><div class=row><button onclick="workshop()">CANCEL</button><button class=red onclick="wsDelOk(${i})">DELETE</button></div></div>`)}
async function wsDelOk(i){const e=CML[i];if(!e)return workshop();const ops=[['del','maps',e.id],['del','meta',e.id]];if(WSD&&WSD.id===e.id)ops.push(['del','kv','draft']);try{await msWrite(ops)}catch(err){return workshop('Could not delete: '+edEsc(err&&err.message||err))}const inC=ccUnassign(e.id);sfx('click');workshop('Deleted “'+edEsc(e.meta.name)+'”.'+(inC?' It was taken out of the campaign too (what you beat on it is kept).':''))}
// a map that can't be opened can still be taken out of the campaign
function wsCampOut(i){const e=CML[i];if(!e)return workshop();ccUnassign(e.id);sfx('click');workshop('“'+edEsc(e.meta.name)+'” was taken out of the campaign.')}
// ----- import -----
function wsImport(){let f;try{f=document.createElement('input');f.type='file';f.accept='.json,application/json';f.onchange=()=>{const x=f.files&&f.files[0];if(x)wsImportFile(x)};f.click()}catch(e){}}
async function wsImportFile(file){if(file.size>40*1024*1024)return workshop('That file is too big to be a map.');let txt='';try{txt=await file.text()}catch(e){return workshop('Could not read the file.')}return wsImportText(txt)}
async function wsImportText(txt){const r=cmRead(txt);
if(!r.doc){show(`<div class="p wide ws"><h2>CAN'T IMPORT</h2><p>The file was not imported, and nothing was changed:</p><ul class=wsul>${r.errors.slice(0,8).map(x=>`<li>${edEsc(x)}</li>`).join('')}</ul><div class=row><button class=go onclick="workshop()">OK</button></div></div>`);sfx('deny');return null}
const d=r.doc,note=[];if(CML.some(e=>e.id===d.id)){d.id=cmUid('m');d.name=d.name.slice(0,29)+' (imported)';note.push('A map with the same id is already here, so this one was added as a separate map.')}
try{await wsStore(d)}catch(err){workshop('Could not save the imported map: '+edEsc(err&&err.message||err));return null}
workshop('Imported “'+edEsc(d.name)+'”.'+(note.length?' '+note.join(' '):'')+(r.warnings.length?' ⚠ '+edEsc(r.warnings.slice(0,3).join(' ')):''));return d}
// ----- crash-safe draft -----
async function wsDraft(keep){const D_=WSD;WSD=null;if(!keep||!D_){try{await msWrite([['del','kv','draft']])}catch(e){}return workshop()}
const r=cmRead(D_.json);if(!r.doc)return workshop('The unsaved changes could not be opened: '+edEsc(r.errors[0]));edOpen(r.doc,CML.some(e=>e.id===r.doc.id)?'saved':'new',1)}
