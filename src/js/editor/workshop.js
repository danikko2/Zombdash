//# editor/workshop.js — The Map Workshop screen (CREATE on the main menu): your maps with thumbnails, search, new, edit, play, rename, duplicate, export, import, delete, draft recovery
// ---------- map workshop ----------
let WSQ='',WSD=null;
function wsTouch(){try{return !!(globalThis.matchMedia&&!matchMedia('(pointer:fine)').matches)}catch(e){return 0}}
function wsAgo(t){const s=(Date.now()-Date.parse(t))/1000;if(!isFinite(s))return '';if(s<60)return 'just now';if(s<3600)return Math.floor(s/60)+' min ago';if(s<86400)return Math.floor(s/3600)+' h ago';if(s<86400*30)return Math.floor(s/86400)+' days ago';try{return new Date(t).toLocaleDateString()}catch(e){return ''}}
function wsImg(u){return typeof u=='string'&&/^data:image\/(png|jpeg);base64,[A-Za-z0-9+/=]+$/.test(u)?u:''}
async function workshop(msg){mode='menu';UIS='ws';MPn=0;music('menu');duck(1);if(!CMLOK)show(hubPage('ws','<section class="hpan wkl"><span class=cwk>YOUR MAPS</span><p class=npn>Loading your maps…</p></section>'));
try{await cmLoadAll()}catch(e){}try{WSD=await msGet('kv','draft')}catch(e){WSD=null}if(UIS!='ws'||mode!='menu')return;wsDraw(msg)}
function wsDraw(msg){wsNX(msg)}
function wsSearch(v){WSQ=v;const el=document.getElementById('wsl');if(el)el.innerHTML=wsList()}
function wsList(){const q=WSQ.trim().toLowerCase(),touch=wsTouch();if(!CML.length)return `<div class=wsemp><b>No maps yet</b><p class=note>Press NEW MAP to start one, or IMPORT a map file someone sent you.</p></div>`;
const L=CML.map((e,i)=>({e,i})).filter(({e})=>!q||String(e.meta.name||'').toLowerCase().includes(q)||String(e.meta.desc||'').toLowerCase().includes(q));if(!L.length)return `<p class=note>No map matches “${edEsc(WSQ)}”.</p>`;
return L.map(({e,i})=>wsCard(e,i,touch)).join('')}
// ----- new map -----
// the form itself is drawn by wsNewNX() in ui/workshop-forms.js (one card with a preview)
function wsNew(){WSN=null;wsNNoFocus=0;wsNewNX()}
function wsSize(w,h){const a=document.getElementById('wsw'),b=document.getElementById('wsh');if(a)a.value=w;if(b)b.value=h;sfx('click')}
function wsVal(id){const e=document.getElementById(id);return e?e.value:''}
async function wsCreate(){const N=WSN||{name:wsVal('wsn'),desc:wsVal('wsd'),w:wsVal('wsw'),h:wsVal('wsh'),g:wsVal('wsg')},w=+N.w,h=+N.h,er=document.getElementById('wserr');
if(!(w>=CMMIN[0]&&w<=CMMAX&&h>=CMMIN[1]&&h<=CMMAX)){if(er)er.textContent='Width must be '+CMMIN[0]+'–'+CMMAX+' and height '+CMMIN[1]+'–'+CMMAX+' tiles.';sfx('deny');return}
const d=cmNew({name:String(N.name||'').replace(/[<>]/g,'').trim()||'Untitled map',desc:String(N.desc||'').replace(/[<>]/g,'').trim(),w,h,ground:N.g});WSN=null;sfx('click');
try{await wsStore(d)}catch(e){if(er)er.textContent='Could not save the new map: '+(e&&e.message||e);return}edOpen(d,'saved')}
// write a map (doc) and its list entry
function wsStore(d){d.updated=new Date().toISOString();let thumb='';try{thumb=edMakeThumb(d)}catch(e){}return msWrite([['put','maps',{id:d.id,json:cmWrite(d)}],['put','meta',{id:d.id,name:d.name,desc:d.desc,w:d.w,h:d.h,created:d.created,updated:d.updated,thumb}]]).then(()=>cmLoadAll())}
// ----- the actions on a map -----
function wsEdit(i){const e=CML[i];if(!e||!e.doc)return;sfx('click');edOpen(cmClone(e.doc),'saved')}
function wsPlay(i){const e=CML[i];if(!e||!e.doc)return;setGM('f');mapId=e.key;sfx('click');play()}
function wsRename(i){const e=CML[i];if(!e||!e.doc)return;sfx('click');wsRenameNX(i)}
async function wsRenameOk(i){const e=CML[i];if(!e||!e.doc)return workshop();const v=String(wsVal('wsrn')).replace(/[<>]/g,'').trim().slice(0,40);if(!v){sfx('deny');return}
const d=cmClone(e.doc);d.name=v;try{await wsStore(d)}catch(err){return workshop('Could not rename: '+edEsc(err&&err.message||err))}workshop('Renamed to “'+edEsc(v)+'”.')}
async function wsDup(i){const e=CML[i];if(!e||!e.doc)return;const d=cmClone(e.doc);d.id=cmUid('m');d.name=(e.doc.name.slice(0,33)+' (copy)');d.created=new Date().toISOString();try{await wsStore(d)}catch(err){return workshop('Could not duplicate: '+edEsc(err&&err.message||err))}workshop('Made “'+edEsc(d.name)+'”.')}
// export the stored file exactly as it is (works even for maps that can't be opened)
async function wsExport(i){const e=CML[i];if(!e)return;let rec=null;try{rec=await msGet('maps',e.id)}catch(_){}if(!rec||!rec.json){sfx('deny');return workshop('There is no map data to export for “'+edEsc(e.meta.name)+'”.')}cmDownload(e.meta.name,rec.json);sfx('click')}
function wsDel(i){const e=CML[i];if(!e)return;sfx('click');wsDelNX(i)}
async function wsDelOk(i){const e=CML[i];if(!e)return workshop();const ops=[['del','maps',e.id],['del','meta',e.id]];if(WSD&&WSD.id===e.id)ops.push(['del','kv','draft']);try{await msWrite(ops)}catch(err){return workshop('Could not delete: '+edEsc(err&&err.message||err))}const inC=ccUnassign(e.id);sfx('click');workshop('Deleted “'+edEsc(e.meta.name)+'”.'+(inC?' It was taken out of the campaign too (what you beat on it is kept).':''))}
// a map that can't be opened can still be taken out of the campaign
function wsCampOut(i){const e=CML[i];if(!e)return workshop();ccUnassign(e.id);sfx('click');workshop('“'+edEsc(e.meta.name)+'” was taken out of the campaign.')}
// ----- import -----
function wsImport(){let f;try{f=document.createElement('input');f.type='file';f.accept='.json,application/json';f.onchange=()=>{const x=f.files&&f.files[0];if(x)wsImportFile(x)};f.click()}catch(e){}}
async function wsImportFile(file){WSIF=String(file.name||'').slice(0,80);if(file.size>40*1024*1024)return workshop('That file is too big to be a map.');let txt='';try{txt=await file.text()}catch(e){return workshop('Could not read the file.')}return wsImportText(txt)}
async function wsImportText(txt){const r=cmRead(txt);
if(!r.doc){wsImpErr(r.errors);WSIF='';sfx('deny');return null}WSIF='';
const d=r.doc,note=[];if(CML.some(e=>e.id===d.id)){d.id=cmUid('m');d.name=d.name.slice(0,29)+' (imported)';note.push('A map with the same id is already here, so this one was added as a separate map.')}
try{await wsStore(d)}catch(err){workshop('Could not save the imported map: '+edEsc(err&&err.message||err));return null}
workshop('Imported “'+edEsc(d.name)+'”.'+(note.length?' '+note.join(' '):'')+(r.warnings.length?' ⚠ '+edEsc(r.warnings.slice(0,3).join(' ')):''));return d}
// ----- crash-safe draft -----
async function wsDraft(keep){const D_=WSD;WSD=null;if(!keep||!D_){try{await msWrite([['del','kv','draft']])}catch(e){}return workshop()}
const r=cmRead(D_.json);if(!r.doc)return workshop('The unsaved changes could not be opened: '+edEsc(r.errors[0]));edOpen(r.doc,CML.some(e=>e.id===r.doc.id)?'saved':'new',1)}
