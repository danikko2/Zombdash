//# ui/workshop-forms.js — The Workshop's small forms in the Night Ops look: new map (one card with a preview), rename, delete, import problems, and putting a map in the campaign
// ---------- dialogs over the Workshop tab ----------
// The Workshop tab stays drawn underneath (and can't be reached with a controller or Tab while a dialog is open).
// Esc presses the button marked data-esc, Enter the one marked data-ent (see wmKey).
function wmWrap(inner,lab,cls){return nxWrap('wmo',`<div class="wmd ${cls||''}" role=dialog aria-modal=true aria-label="${edEsc(lab)}">${inner}</div>`,'<div class=wmbg></div>')}
function wmUnder(h){return h.replace('<div class=nxs>','<div class=nxs inert aria-hidden=true>')}
function wsMod(inner,lab,cls){show(wmUnder(wsPage(''))+wmWrap(inner,lab,cls))}
function wmKey(k){if(!ui.querySelector)return 0;const m=ui.querySelector('.wmo');if(!m)return 0;if(k=='escape'||k=='enter'){const b=m.querySelector(k=='escape'?'[data-esc]':'[data-ent]');if(b&&!b.disabled)b.click();return 1}return 1}
function wmBtns(no,noJs,yes,yesJs,cls,on){return `<div class=wmbt><button data-q=1 data-esc=1 class="nb wmno" onclick="${noJs}">${no}${kc('ESC')}</button><button data-q=1 data-ent=1 class="np ${cls||'go'} wmyes" onclick="${yesJs}"${on===false?' disabled':''}>${yes}${kc('ENTER')}</button></div>`}
const wmEnter=js=>`onkeydown="if(event.key=='Enter'){${js}}else if(event.key=='Escape'){workshop()}"`;
// ----- new map -----
// WSN keeps what is picked while the card is open: name, about, blank or a copy, size, ground
var WSN=null;
const WSNS=[['s','SMALL',48,36,'Quick, close fights'],['m','MEDIUM',72,56,'About the Suburb'],['l','LARGE',100,80,'Room to explore'],['h','HUGE',128,128,'Takes a while to fill']];
const WSNG=['grass','dirt','sand','gravel','forest','asphalt','concrete'];
function wsNewNX(){if(!WSN)WSN={name:'My map',desc:'',from:'blank',cm:null,sz:'m',w:72,h:56,g:'grass',ex:0};const N=WSN,copy=N.from=='copy',T=CMTER.find(t=>t.id==N.g)||CMTER[0];
const sz=WSNS.find(q=>q[0]==N.sz),cps=wsNCopies();if(copy&&!cps.some(c=>c.k==N.cm))N.cm=cps.length?cps[0].k:null;const cp=cps.find(c=>c.k==N.cm);
const sw=WSNG.map(id=>CMTER.find(t=>t.id==id||t.n.toLowerCase()==id||t.n.toLowerCase()==id+' floor')).filter(Boolean),inSw=sw.includes(T);
const left=copy?`<div class=wnf><span class=cwk>PICK A MAP TO COPY</span><div class=wncg>${cps.map(c=>`<button data-q=1 class="wncp${c.k==N.cm?' on':''}" onclick="WSN.cm='${c.k}';sfx('click');wsNewNX()">${c.img?`<img alt="" src="${c.img}">`:'<i></i>'}<b>${edEsc(c.n)}</b><small>${c.sub}</small></button>`).join('')}</div></div>`
:`<label class=wnf><span class=cwk>NAME</span><span class=wnin><input id=wsn maxlength=40 value="${edEsc(N.name)}" autocomplete=off oninput="WSN.name=this.value;wsNPv()" ${wmEnter('wsCreate()')}><small id=wsnc>${N.name.length} / 40</small></span></label>
<div class=wnf><span class=wnfh><span class=cwk>SIZE</span><button data-q=1 class=lnk onclick="WSN.ex=WSN.ex?0:1;wsNewNX()">${N.ex?'Hide exact size':'Exact size…'}</button></span><div class=wnsz>${WSNS.map(([k,n,w,h,d])=>{const s=36/128;return `<button data-q=1 class="wnsc${N.sz==k?' on':''}" onclick="wsNSz('${k}')" title="${d}"><span class=wnsi><i></i><i class=f style="width:${Math.round(w*s)}px;height:${Math.round(h*s)}px"></i></span><span><b>${n}</b><small>${w} × ${h}</small></span></button>`}).join('')}</div>
${N.ex?`<div class=wnex><label>Width<input type=number id=wsw min=${CMMIN[0]} max=${CMMAX} value=${N.w} oninput="WSN.w=+this.value;WSN.sz='c';wsNPv()"></label><span>×</span><label>Height<input type=number id=wsh min=${CMMIN[1]} max=${CMMAX} value=${N.h} oninput="WSN.h=+this.value;WSN.sz='c';wsNPv()"></label><small>tiles of ${CMTILE}px · ${CMMIN[0]}–${CMMAX} wide, ${CMMIN[1]}–${CMMAX} high</small></div>`:''}</div>
<div class=wnf><span class=cwk>GROUND</span><div class=wngr>${sw.map(t=>`<button data-q=1 class="wngs${t.id==N.g?' on':''}" onclick="WSN.g='${t.id}';sfx('click');wsNewNX()" title="${edEsc(t.n)}"><img alt="" src="${edTerSw(t)}"><small>${edEsc(t.n.replace(/ floor$/,''))}</small></button>`).join('')}<label class=wnall><span class=sr>Other ground</span><select id=wsg onchange="if(this.value){WSN.g=this.value;wsNewNX()}"><option value=""${inSw?' selected':''} disabled>All ${CMTER.length}…</option>${CMTCAT.map(([c,cn])=>`<optgroup label="${cn}">${CMTER.filter(t=>t.cat==c).map(t=>`<option value="${t.id}"${!inSw&&t.id==N.g?' selected':''}>${edEsc(t.n)}</option>`).join('')}</optgroup>`).join('')}</select></label></div></div>
<label class=wnf><span class=cwk>ABOUT <em>(optional)</em></span><input id=wsd class=wnab maxlength=240 value="${edEsc(N.desc)}" autocomplete=off placeholder="What happens on this map? Players see it in Free Play." oninput="WSN.desc=this.value"></label>`;
const pv=copy?(cp&&cp.img?`<img class=wnpi alt="" src="${cp.img}">`:'<i class=wnpi></i>'):`<div class=wnpm id=wnpm style="${wsNBox(N.w,N.h)};background-image:url(${edTerSw(T)})"><b>P</b></div>`;
const inner=`<div class=wnl><b class=wmt>NEW MAP</b><div class=wnf><span class=cwk>START FROM</span><div class=wnfr>
<button data-q=1 class="wnfrom${copy?'':' on'}" onclick="WSN.from='blank';sfx('click');wsNewNX()"><i>${nxi('plus',20)}</i><span><b>BLANK MAP</b><small>Bare ground, you build the rest</small></span></button>
<button data-q=1 class="wnfrom${copy?' on':''}" onclick="WSN.from='copy';sfx('click');wsNewNX()"><i>${nxi('map',20)}</i><span><b>A COPY OF A MAP</b><small>Tweak a campaign or sample map</small></span></button></div></div>${left}</div>
<div class=wnr><span class=cwk>WHAT YOU'LL GET</span><div class=wnpv>${pv}</div><b class=wnpt id=wnpt>${edEsc(copy?(cp?cp.n+' (my copy)':''):(N.name.trim()||'Untitled map'))}</b><span class=wnps id=wnps>${copy?(cp?cp.sub:''):wsNSum()}</span>
<p class=wnpn>${copy?'A copy goes into your maps. The original stays as it is.':'You start in the middle. Name, size and ground can all be changed later in Map settings.'}</p><p class=wnerr id=wserr></p>
<button data-q=1 data-ent=1 class="np go wngo" onclick="${copy?'wsNCopy()':'wsCreate()'}"${copy&&!cp?' disabled':''}>${copy?'COPY &amp; START BUILDING':'CREATE &amp; START BUILDING'}${kc('ENTER')}</button><button data-q=1 data-esc=1 class="nb wmno wncx" onclick="workshop()">CANCEL${kc('ESC')}</button></div>`;
wsMod(inner,'New map','wnd');try{const n=document.getElementById('wsn');if(n&&n.select&&!wsNNoFocus){n.focus();n.select()}}catch(e){}wsNNoFocus=1}
var wsNNoFocus=0;
function wsNBox(w,h){const s=Math.min(280/Math.max(1,w),210/Math.max(1,h));return `width:${Math.max(12,Math.round(w*s))}px;height:${Math.max(10,Math.round(h*s))}px`}
function wsNSum(){const N=WSN,s=WSNS.find(q=>q[0]==N.sz),T=CMTER.find(t=>t.id==N.g);return `${s?s[1][0]+s[1].slice(1).toLowerCase()+' · ':''}${N.w} × ${N.h} tiles · ${T?T.n.toLowerCase():''}`}
function wsNSz(k){const s=WSNS.find(q=>q[0]==k);if(!s||!WSN)return;WSN.sz=k;WSN.w=s[2];WSN.h=s[3];sfx('click');wsNewNX()}
// refresh the preview without drawing the card again (so typing isn't interrupted)
function wsNPv(){try{const N=WSN,t=document.getElementById('wnpt'),s=document.getElementById('wnps'),m=document.getElementById('wnpm'),c=document.getElementById('wsnc');if(t)t.textContent=N.name.trim()||'Untitled map';if(c)c.textContent=N.name.length+' / 40';if(s)s.textContent=wsNSum();
if(m&&N.w>0&&N.h>0){const b=wsNBox(N.w,N.h).match(/\d+/g);m.style.width=b[0]+'px';m.style.height=b[1]+'px'}}catch(e){}}
// the maps you can start from a copy of: the samples and the campaign maps
function wsNCopies(){const L=CMSAMPLES.map((j,i)=>({k:'s'+i,n:j.name,sub:'Sample map · '+j.width+' × '+j.height,img:wsImg(wsSampleThumb(i))}));
for(const m of Object.keys(typeof BIMF=='object'?BIMF:{}).map(Number))L.push({k:'b'+m,n:MP[m].n,sub:'Campaign map · '+BIMF[m].width+' × '+BIMF[m].height,img:typeof MPI!='undefined'&&MPI[m]||''});return L}
function wsNCopy(){const k=WSN&&WSN.cm;if(!k){sfx('deny');return}WSN=null;if(k[0]=='s')return wsSample(+k.slice(1),1);return wsBuiltin(+k.slice(1),1)}
// ----- rename / delete / import problems -----
function wsRenameNX(i){const e=CML[i];wsMod(`<b class=wmt>RENAME MAP</b><label class=wnf><span class=cwk>NAME</span><span class=wnin><input id=wsrn maxlength=40 value="${edEsc(e.doc.name)}" autocomplete=off oninput="const c=document.getElementById('wsrc');if(c)c.textContent=this.value.length+' / 40'" ${wmEnter(`wsRenameOk(${i})`)}><small id=wsrc>${e.doc.name.length} / 40</small></span></label>
<p class=wmp>This is the name everyone sees in Free Play and the campaign.</p>${wmBtns('CANCEL','workshop()','SAVE NAME',`wsRenameOk(${i})`)}`,'Rename map','wmsm');try{const n=document.getElementById('wsrn');n.focus();n.select()}catch(_){}}
function wsDelNX(i){const e=CML[i],m=e.meta,img=wsImg(m.thumb),inC=ccSlotOfId(e.id)||ccRepOfId(e.id)!=null;
wsMod(`<b class=wmt>DELETE THIS MAP?</b><div class=wmmap>${img?`<img alt="" src="${img}">`:'<i></i>'}<span><b>${edEsc(m.name||'Untitled map')}</b><small>${m.w} × ${m.h} tiles · edited ${wsAgo(m.updated)}</small></span></div>
<p class=wmp>It's removed from this device and <b>can't be brought back</b>.${inC?' It\'s also taken out of the campaign (what you beat on it is kept).':''}</p>
<button data-q=1 class=wmexp onclick="wsExport(${i})">${nxi('up',20)}<span><b>EXPORT A BACKUP FIRST</b><small>Saves a file you can import again later</small></span></button>${wmBtns('KEEP IT','workshop()','DELETE',`wsDelOk(${i})`,'red')}`,'Delete map','wmsm wmdel')}
var WSIF='';
function wsImpErr(errs){wsMod(`<b class=wmt><svg class=wmwarn width=26 height=26 viewBox="0 0 24 24" fill=none stroke=currentColor stroke-width=2 stroke-linejoin=round aria-hidden=true><path d="M12 3l10 18H2z"/><path d="M12 10v5M12 18h.01" stroke-linecap=round/></svg>COULDN'T IMPORT IT</b><p class=wmp>Nothing was changed. Here's what was wrong${WSIF?' with <b>'+edEsc(WSIF)+'</b>':''}:</p><ul class=wmul>${errs.slice(0,6).map(x=>`<li>${edEsc(x)}</li>`).join('')}</ul>
<p class=wmp2>Map files come from <b>EXPORT</b> on a map in the Workshop.</p><div class=wmbt><button data-q=1 class="nb wmno" onclick="wsImport()">PICK ANOTHER FILE</button><button data-q=1 data-esc=1 data-ent=1 class="np go wmyes" onclick="workshop()">OK${kc('ENTER')}</button></div>`,"Couldn't import",'wmsm wmimp')}
// ---------- putting a map in the campaign ----------
// one page: pick an empty spot (sections with one), then the wave-20 boss; or play it instead of a campaign map
function wcPage(){const e=wcEnt(),nm=edEsc(e.doc.name),cur=ccSlotOfId(WC.id),rp=ccRepOfId(WC.id),img=wsImg(e.meta&&e.meta.thumb);
const full=[],rows=SEC.map((S_,si)=>{if(!S_.m.includes(-1)){full.push(S_.n);return ''}const fr=S_.m.filter(m=>m===-1).length;
return `<div class=wcr><span class=wcrn><b>${S_.n.toUpperCase()}</b><small>Section ${si+1} · ${fr} empty</small></span>${S_.m.map((m,k)=>{if(m!==-1)return `<span class="wcs bi"><small>SLOT ${k+1}</small><b>${edEsc(MP[m]?MP[m].n:'')}</b></span>`;
const a=CCS.slots[ccSK(si,k)],mine=a&&a.id===WC.id,taken=a&&!mine,on=WC.s===si&&WC.k===k;
return `<button data-q=1 class="wcs${on?' on':''}${taken?' tk':''}"${taken?' disabled':''} onclick="wcSlot(${si},${k})"${on&&img?` style="--wi:url(${img})"`:''}><small>SLOT ${k+1}${on?' · THIS MAP':''}</small><b>${taken?'“'+edEsc(a.n||'another map')+'”':on?nm:mine?'This map now':'Empty'}</b></button>`}).join('')}</div>`}).join('');
const boss=CCBOSS.map(ci=>`<button data-q=1 class="wcb${WC.b===ci?' on':''}" onclick="wcBoss(${ci})"><canvas data-ch=${ci}></canvas><b>${CH[ci].n}</b><small>${ccHome(ci)}</small></button>`).join('');
const repL=CORD.filter(ccRepOK).map(m=>`<option value="${m}">${CORD.indexOf(m)+1}. ${MP[m].n}${CCS.rep[m]?' (now: “'+edEsc(CCS.rep[m].n)+'”)':''}</option>`).join('');
const ok=WC.s!=null&&WC.b!=null,where=WC.s!=null?`${SEC[WC.s].n} · slot ${WC.k+1}`:'pick a spot',bn=WC.b!=null?CH[WC.b].n:'pick a boss';
const now=cur?`In ${SEC[cur.s].n}, slot ${cur.k+1}`:rp!=null?`Plays instead of ${MP[rp].n}`:'Not in the campaign yet';
const sum=`<div class="hpan wcsum">${img?`<img class=wcth alt="" src="${img}">`:'<i class=wcth></i>'}<b class=wcnm>${nm}</b>
<div class=wcrows><span><em>NOW</em><b>${now}</b></span><span><em>GOES IN</em><b>${where}</b></span><span><em>BOSS AT WAVE 20</em><b>${bn}</b></span></div>
<ul class=wcul><li>Plays with ${WC.s!=null?SEC[WC.s].n+'\'s':'that section\'s'} zombies, lives and difficulty.</li><li>Beat ${WC.b!=null?CH[WC.b].n:'the boss'} to mark it beaten and open it in Free Play.</li><li>It never blocks the next section.</li></ul>
<button data-q=1 id=wcgo class="np go wcgo" onclick="wcSave()"${ok?'':' disabled'}>${cur?'SAVE':WC.s!=null?'PUT IN '+SEC[WC.s].n.toUpperCase():'PUT IN SLOT'}${kc('ENTER')}</button>${cur?'<button data-q=1 class="nb wcrm" onclick="wcRemove()">REMOVE FROM CAMPAIGN</button>':''}
<div class=wcor><i></i>OR<i></i></div>
${rp!=null?`<div class=wcrp><b>Plays instead of ${MP[rp].n}</b><small>Progress, the section, the boss (${CH[MUN[rp]].n}) and the difficulty stay ${MP[rp].n}'s.</small><button data-q=1 class=nb onclick="wcRestore(${rp})">RESTORE ${MP[rp].n.toUpperCase()}</button></div>`
:`<div class=wcrp><b>Play it instead of a campaign map</b><small>For a map made from or for one of them. Progress stays with the original, and you can restore it any time.</small><span class=wcrs><select id=wcrep aria-label="Campaign map">${repL}</select><button data-q=1 class=nb onclick="wcRepAsk()">PLAY INSTEAD…</button></span></div>`}</div>`;
const nb=[13,14,15,16].map(ci=>CH[ci].n);
return nxWrap('wcx',`${nxTop({back:'wcBack()',crumbs:[[WC.back=='cmap'?'Campaign':'Workshop','wcBack()'],['Add to the campaign']]})}<h2 class=sr>CAMPAIGN · ${nm}</h2><div class=wcmn><div class=wcl>
<div class=wch><i>1</i><b>PICK AN EMPTY SPOT</b><span>Each section has five maps. Yours can fill a gap.</span></div><div class=wcrs2>${rows}</div>${full.length?`<small class=wcfull>${msAnd(full)} ${full.length>1?'are':'is'} full.</small>`:''}
<div class=wch><i>2</i><b>WHO'S THE BOSS AT WAVE 20?</b><span>Beat them to finish the map.</span></div><div class=wcbg>${boss}</div>
<small class=wcfull>Not offered: ${msAnd(nb)}. Their fights need their own map.</small></div>${sum}</div>`)}
function wcDrawNX(){show(wcPage())}
function wcRepAskNX(m){const e=wcEnt(),old=CCS.rep[m],cur=ccSlotOfId(WC.id);
show(wmUnder(wcPage())+wmWrap(`<b class=wmt>PLAY THIS INSTEAD?</b><p class=wmp>In the campaign, “${edEsc(e.doc.name)}” will be played instead of <b>${MP[m].n}</b>. Your progress, the section, the boss (${CH[MUN[m]].n}) and the difficulty stay ${MP[m].n}'s, and you can restore the original with one click.${old&&old.id!==WC.id?` It takes the place of “${edEsc(old.n)}”, which plays there now.`:''}${cur?` It will be taken out of its slot in ${SEC[cur.s].n}.`:''}</p>${wmBtns('CANCEL','wcDraw()','PLAY INSTEAD',`wcRepOk(${m})`)}`,'Play this instead?','wmsm'))}
// from an empty campaign slot on the world map: which of your maps goes here
function wcPickNX(s,k,L){show(nxWrap('wcx',`${nxTop({back:"setGM('c');cMap()",crumbs:[['Campaign',"setGM('c');cMap()"],[SEC[s].n+' · slot '+(k+1)]]})}<h2 class=sr>${SEC[s].n.toUpperCase()} · SLOT ${k+1}</h2><div class=wcpk>
<div class=wch><i>1</i><b>PICK ONE OF YOUR MAPS</b><span>Next you choose the survivor boss for wave 20.</span></div><div class=wcpg>${L.map(({e,i})=>{const img=wsImg(e.meta.thumb),cs=ccSlotOfId(e.id),cr=ccRepOfId(e.id);
return `<button data-q=1 class=wcpc onclick="wcOpen(CML[${i}].id,'cmap',[${s},${k}])">${img?`<img alt="" src="${img}">`:'<i></i>'}<b>${edEsc(e.doc.name)}</b><small>${e.doc.w} × ${e.doc.h} tiles${cs?' · now in '+SEC[cs.s].n+', slot '+(cs.k+1)+' (it moves here)':cr!=null?' · now plays instead of '+MP[cr].n+' (that stops)':''}</small></button>`}).join('')}</div></div>`))}
