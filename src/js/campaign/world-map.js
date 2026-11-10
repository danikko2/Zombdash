//# campaign/world-map.js — The campaign on one world map: the whole world, and a camera that zooms into a section
// ---------- campaign world map ----------
// One painting of the whole world (cWorldArt). The camera shows all of it ('w') or zooms into one section, with the
// neighbouring sections still visible around it (their labels slide to the edge). Maps are pins on the painting and the
// panel on the right shows the section or the picked map. Picking, custom-map slots, difficulty and choosing for the
// split-screen lobby all go through the same functions as before (cGo, cPick, cSlotPick, mapGo, clbGo…).
var CWV={v:null,ws:null,cam:null,dk:''},CWIN0=0;
function cwR(){let lm=false;try{lm=lowMem()}catch(e){}return lm?1.6:2.4}
// the part of the world (x, y, w, h in world units) the camera frames
function cwBox(v){if(v==='w'||v==null)return[0,0,1000,620];let x0=1e9,y0=1e9,x1=-1e9,y1=-1e9;for(const[x,y]of CWR[v].p){x0=Math.min(x0,x);y0=Math.min(y0,y);x1=Math.max(x1,x);y1=Math.max(y1,y)}return[x0-55,y0-50,x1-x0+110,y1-y0+100]}
function cwCam(v,mw,mh){const b=cwBox(v),k=Math.min(mw/b[2],mh/b[3]),cx=b[0]+b[2]/2,cy=b[1]+b[3]/2;return{k,tx:mw/2-cx*k,ty:mh/2-cy*k}}
// put the camera on CWV.v (anim = glide there); labels of other sections stay on screen at the edges while zoomed
function cwFit(anim){if(!ui.querySelector)return;const m=ui.querySelector('#cwm'),w=ui.querySelector('#cww');if(!m||!w||!w.style)return;const mw=m.offsetWidth||1000,mh=m.offsetHeight||620,v=CWV.v,c=cwCam(v,mw,mh);
if(w.classList)w.classList.toggle('anim',!!anim);if(w.style.setProperty)w.style.setProperty('--k',String(c.k));w.style.transform=`translate(${c.tx}px,${c.ty}px) scale(${c.k})`;
// labels of sections off screen wait at the edge nearest to them, spread out so they never sit on top of each other
if(w.querySelectorAll){const L=[];for(const e of w.querySelectorAll('.cwl')){const x=+e.dataset.x,y=+e.dataset.y,wd=e.offsetWidth||200,ht=e.offsetHeight||50;let sx=c.tx+x*c.k,sy=c.ty+y*c.k,sd=null;
const b=[10+wd/2,mw-10-wd/2,10+ht/2,mh-70-ht/2];if(v!=='w'&&!(e.classList&&e.classList.contains('cur'))){const nx=Math.max(b[0],Math.min(b[1],sx)),ny=Math.max(b[2],Math.min(b[3],sy));sd=ny!==sy?(ny<sy?'b':'t'):nx!==sx?(nx<sx?'r':'l'):null;sx=nx;sy=ny}L.push({e,sx,sy,sd,wd,ht,b,rx:c.tx+x*c.k,ry:c.ty+y*c.k})}
for(const[sd,k,z,i0,i1,r]of[['t','sx','wd',0,1,'rx'],['b','sx','wd',0,1,'rx'],['l','sy','ht',2,3,'ry'],['r','sy','ht',2,3,'ry']]){const A=L.filter(q=>q.sd===sd).sort((a,b)=>a[r]-b[r]);if(A.length<2)continue;
for(let i=1;i<A.length;i++)A[i][k]=Math.max(A[i][k],A[i-1][k]+(A[i-1][z]+A[i][z])/2+8);const ov=A[A.length-1][k]-A[A.length-1].b[i1];if(ov>0)for(const q of A)q[k]-=ov;const un=A[0].b[i0]-A[0][k];if(un>0)for(const q of A)q[k]+=un}
for(const q of L){q.e.style.left=((q.sx-c.tx)/c.k)+'px';q.e.style.top=((q.sy-c.ty)/c.k)+'px';if(q.e.classList)q.e.classList.toggle('edge',!!q.sd)}}
CWV.cam=c}
// the painting plus what depends on progress: custom-map slots and fog over sections that aren't open yet
function cwPaint(A,d){const cv=document.getElementById&&document.getElementById('cwc'),g=cv&&cv.getContext&&cv.getContext('2d');if(!g||!g.drawImage)return;const R=cwR(),art=cWorldArt(R);cv.width=art.width;cv.height=art.height;g.drawImage(art,0,0);g.save();g.scale(R,R);
for(let i=0;i<5;i++)SEC[i].m.forEach((m,k)=>{if(m>=0)return;const[x,y]=cwPos(i,k);if(ccSlot(i,k)){g.save();g.translate(x,y+12);g.scale(.5,.5);cLmCustom(g,0,0);g.restore()}else{g.fillStyle='rgba(235,235,242,.6)';for(let j=0;j<4;j++){g.beginPath();g.arc(x-9+j*6,y+4+(j%2)*3,6,0,7);g.fill()}}});
const Q=AU.cmrg,lk=[0,1,2,3,4].map(i=>!secOpen(A,d,i));
if(Q&&lk.some(x=>x)){const fm=document.createElement('canvas');fm.width=Q.gw;fm.height=Q.gh;const fx=fm.getContext&&fm.getContext('2d');
if(fx&&fx.fillRect){fx.fillStyle='rgba(70,80,96,.62)';for(let j=0;j<Q.gh;j++)for(let k=0;k<Q.gw;k++){const r=Q.M[j*Q.gw+k];if(r>=0&&r<4&&lk[r])fx.fillRect(k,j,1,1)}
const f2=document.createElement('canvas');f2.width=Q.gw*6;f2.height=Q.gh*6;const f2x=f2.getContext('2d');try{f2x.filter='blur(4px)'}catch(e){}f2x.imageSmoothingEnabled=true;f2x.drawImage(fm,0,0,f2.width,f2.height);
g.save();cPoly(g,CWP);g.clip();g.imageSmoothingEnabled=true;g.drawImage(f2,0,0,Q.gw*Q.cs,Q.gh*Q.cs);g.restore()}
if(lk[4]){g.save();cPoly(g,CWR[4].p);g.fillStyle='rgba(70,80,96,.62)';g.fill();g.restore()}
for(let i=0;i<5;i++){if(!lk[i])continue;const Rn=cRng(9+i);g.fillStyle='rgba(220,228,236,.22)';for(let k=0;k<26;k++){const x=CWC[i][0]+(Rn()-.5)*260,y=CWC[i][1]+(Rn()-.5)*170,r=i==4?(cInPoly(CWR[4].p,x,y)?4:-1):Q.M[Math.floor(y/Q.cs)*Q.gw+Math.floor(x/Q.cs)];if(r!==i)continue;g.beginPath();g.arc(x,y,16+Rn()*20,0,7);g.fill()}}}
g.restore()}
// section labels (always) and map pins (only for the section the camera is on)
function cwOv(A,d,v){const front=cFront(A,d),cur=secOf(front);let h='';
for(let i=0;i<5;i++){const S_=SEC[i],op=secOpen(A,d,i),dn=op&&secDone(A,d,i),n=S_.m.filter(m=>m>=0),b=n.filter(m=>bBt(A,d,m)).length,[x,y]=CWR[i].l,nc=ccAll().filter(e=>e.s===i).length;
h+=`<button data-q=1 class="cwl${op?'':' lk'}${i===v?' cur':''}${v==='w'&&i===CWV.ws?' on':''}" data-x=${x} data-y=${y} style="left:${x}px;top:${y}px" onclick="cwSec(${i})"><span class=cwli>${i==cur&&op?'<em class=cwyou></em>':''}<b>${op?'':nxi('lock',13)}${S_.n}</b><small>${op?(dn?'✓ complete':b+' / '+n.length+' beaten'):'finish '+SEC[i-1].n}${nc?' · +'+nc+' custom':''}</small></span></button>`}
if(v==='w')return h;
const pin=(k,cls,js,nm,st,rp)=>{const[x,y]=cwPos(v,k);return `<button data-q=1 class="cwp ${cls}" style="left:${x}px;top:${y+12}px" onclick="${js}"><i class=cwr></i><span class=cwtg><b>${edEsc(nm)}</b><small>${st}</small></span>${rp?'<em class=crp title="Your custom map plays here instead">✎</em>':''}</button>`};
SEC[v].m.forEach((m,k)=>{if(m<0){const e=ccSlot(v,k);if(e){const o=mOpen(A,d,e.key),b=bBt(A,d,e.key),on=e.key===mapId&&!CSEL;h+=pin(k,`cu${o?'':' lk'}${b?' dn':''}${on?' on':''}`,`cPick(${e.key})`,mpName(e.key),b?'✓ BEATEN':o?'✎ CUSTOM':'LOCKED')}else{const bad=ccSlotBad(v,k),sl=CSEL&&CSEL[0]===v&&CSEL[1]===k;h+=pin(k,`cs${sl?' on':''}`,`cSlotPick(${v},${k})`,'Coming Soon',bad?'⚠ CAN\'T OPEN':'FREE SLOT')}return}
const o=mOpen(A,d,m),b=bBt(A,d,m),on=m===mapId&&!CSEL;h+=pin(k,`${o?'':'lk'}${b?' dn':''}${on?' on':''}${m===front&&o&&!b?' nu':''}`,`cPick(${m})`,MP[m].n,b?'✓ BEATEN':!o?'LOCKED':m===front?'NEXT UP':'OPEN',ccRep(m))});return h}
const cwBar=(a,n)=>`<span class=cwbar>${Array.from({length:Math.max(1,n)},(_,i)=>`<i class="${i<a?'on':''}"></i>`).join('')}</span>`;
// the panel: a section summary on the whole-world view, the picked map when zoomed in
function cwPanel(A,d,v){const front=cFront(A,d);
if(v==='w'){const i=CWV.ws??secOf(front),S_=SEC[i],op=secOpen(A,d,i),ms=S_.m.filter(m=>m>=0),nb=ms.filter(m=>bBt(A,d,m)).length,cus=ccAll().filter(e=>e.s===i),ncb=cus.filter(e=>bBt(A,d,e.key)).length;
return `<div class=cwph><span class=cwk>SECTION ${i+1} OF 5</span><b class=cwpt>${S_.n.toUpperCase()}</b><span class=cwps>${S_.sub}</span></div><div class=cwpb>${cwBar(nb,ms.length)}<span>${nb} / ${ms.length} beaten${cus.length?' · custom '+ncb+'/'+cus.length:''}</span></div>
<div class=cwml>${S_.m.map((m,k)=>{if(m<0){const e=ccSlot(i,k);return e?`<span class=cwmr><b>${edEsc(mpName(e.key))}</b><small>${bBt(A,d,e.key)?'✓':'✎ custom'}</small></span>`:''}const b=bBt(A,d,m),o=mOpen(A,d,m);return `<span class="cwmr${o?'':' lk'}"><b>${MP[m].n}</b><small>${b?'✓':o?(m===front?'next up':'open'):'locked'}</small></span>`}).join('')}</div>
${op?'':`<div class=cwlk>${nxi('lock',15)} Beat every map in ${SEC[i-1].n} on ${DNm(d,1)} first</div>`}
${CMLB?'':bpCall(cAcc(),'cwbp')}<div class=cwk>DIFFICULTY</div>${nxDif('cwDif()')}<p class=cwn>Each section opens with one map; beat it and the rest of that section opens in any order. Beat every map in a section to reach the next.</p>
<button data-q=1 id=mgo class="np cwgo${op?' go':' no'}" onclick="${op?`cGo(${i})`:"sfx('deny')"}">${op?'ZOOM IN':'LOCKED'}${kc('ENTER')}</button>`}
const S_=SEC[v],ms=S_.m.filter(m=>m>=0),nb=ms.filter(m=>bBt(A,d,m)).length,nx=v<4?SEC[v+1].n:null,cus=ccAll().filter(e=>e.s===v),ncb=cus.filter(e=>bBt(A,d,e.key)).length;
let h=`<div class=cwph><span class=cwk>SECTION ${v+1} OF 5</span><b class=cwpt>${S_.n.toUpperCase()}</b><span class=cwps>${S_.sub} · ${nb}/${ms.length} beaten${cus.length?' · custom '+ncb+'/'+cus.length:''}${nx?' · beat them all to reach '+nx:''}</span></div><div class=cwpb>${cwBar(nb,ms.length)}</div><div class=cwdiv></div>`;
if(CSEL&&CSEL[0]===v){const bad=ccSlotBad(v,CSEL[1]),n=cmFree().length;
return h+`<span class=cwk>SLOT ${CSEL[1]+1} OF ${S_.m.length}</span><b class=cwmt>Coming Soon</b><p class=cwd>${bad?`⚠ “${edEsc(bad.n||'A custom map')}” is in this slot but can't be opened right now, so the slot shows Coming Soon.`:`A free slot in ${S_.n}. Put one of your own maps here: it plays with this section's zombies, lives and difficulty, ends with a survivor boss you pick, and never blocks the next section.`}</p>${CMLB?'':`<button data-q=1 class="np cwgo go" onclick="${n?`wcPickMap(${v},${CSEL[1]})`:`workshop()`}">${n?'ADD A MAP':'MAP WORKSHOP'}</button>`}`}
const m=mapId,cp0=CMLB?null:cpOK(),cpc=cp0&&cp0.gm=='c'&&cpMap(cp0)===m?cp0:null,o=mOpen(A,d,m),b=bBt(A,d,m),k=S_.m.indexOf(m),cu=cmIs(m),e=cu&&ccOfKey(m),ci=cu?(e?e.b:null):MUN[m],own=ci!=null&&(A.un||[]).includes(ci);
h+=`<span class=cwk>${k>=0?'MAP '+(k+1)+' OF '+S_.m.length:'CUSTOM MAP'}${m===front&&o&&!b?' · NEXT UP':''}</span><div class=cwmi>${mpImg(m)?`<img class=cwim alt="" src="${mpImg(m)}">`:''}<span><b class=cwmt>${edEsc(mpName(m).toUpperCase())}</b><p class=cwd>${edEsc(mpDesc(m))}</p></span></div>
${ci!=null&&CH[ci]?`<div class=cwboss>${nxCh(ci,!own,'cwbc')}<span><small>WAVE 20 BOSS</small><b>${CH[ci].n.toUpperCase()}</b><em>${own?'✓ already one of your survivors':'beat them to recruit them'}</em></span></div>`:''}
<p class="cwu munl">${munT(m)}</p>${cManage(m)}${CMLB?'':bpCall(cAcc(),'cwbp')}<div class=cwk>DIFFICULTY</div>${nxDif('cwDif()')}
${CMLB?'':`<button data-q=1 class=cwsv onclick="survs()">${nxCh(sel,0,'cwsc')}<b>${CH[sel].n.toUpperCase()}</b><small>${CH[sel].hp} HP · ${wN(sel,CH[sel].w)}</small><span class=cwch>${kc('Y')}CHANGE</span></button>`}
${cpc?`<div class=cwgo><button data-q=1 id=mgo class="np go" onclick="cpResume()">CONTINUE · WAVE ${cpc.w+1}${kc('ENTER')}</button><span class=cwrs>Your run: ${edEsc(CH[cpc.ci].n)} · ${scr(cpc.p.cash)} · <button data-q=1 class=lnk onclick="mapGo()">start over from wave 1</button></span></div>`:`<button data-q=1 id=mgo class="np cwgo${o?' go':' no'}" onclick="mapGo()">${o?(CMLB?'CHOOSE':'PLAY '+edEsc(mpName(m).toUpperCase())):'🔒 LOCKED'}${kc('ENTER')}</button>`}${CCW.length&&!CMLB?`<p class=cwn style="color:#ffb86a">⚠ ${edEsc(CCW[0])}${CCW.length>1?' (+'+(CCW.length-1)+' more in the Map Workshop)':''}</p>`:''}`;
return h}
function cwTop(v){return nxTop({back:v==='w'?(CMLB?'clbBack()':'menu()'):"cGo('w')",crumbs:v==='w'?[['Campaign']]:[['Campaign',"cGo('w')"],[SEC[v].n]],right:CMLB?`<span class=cwlob>SPLIT-SCREEN LOBBY · pick a map</span>`:''})}
// draw the campaign map for v ('w' or a section); if it is already on screen only the changed parts are replaced and
// the camera glides to the new spot
function cwShow(v){const A=cAcc(),d=DIF();if(v!=='w'&&!secOpen(A,d,v))v='w';if(v!=='w')CWV.ws=v;if(CWV.ws==null||!SEC[CWV.ws])CWV.ws=secOf(cFront(A,d));
const keep=UIS=='cmap'&&CWV.v!=null&&ui.querySelector&&ui.querySelector('#cww')&&ui.querySelector('#cwp');UIS='cmap';mode='menu';MPn=0;
const dk=d+'|'+(A.name||'')+'|'+ccAll().length+'|'+[0,1,2,3,4].map(i=>secOpen(A,d,i)?1:0).join('');
const z=nxS(),cls=v==='w'?'cwW':'cwZ';
if(keep){const r=ui.querySelector('.nx.cw');if(r&&r.classList){r.classList.toggle('cwW',v==='w');r.classList.toggle('cwZ',v!=='w')}
ui.querySelector('#cwtop').innerHTML=cwTop(v);ui.querySelector('#cwov').innerHTML=cwOv(A,d,v);ui.querySelector('#cwp').innerHTML=cwPanel(A,d,v);
if(dk!==CWV.dk){CWV.dk=dk;cwPaint(A,d)}const mv=CWV.v!==v;CWV.v=v;cwFit(mv);paintUI();navNew();return}
show(nxWrap('cw '+cls,`<div id=cwtop>${cwTop(v)}</div><h2 class=sr>CAMPAIGN MAP</h2><div class=cwmain><div class=cwm id=cwm><div id=cww><canvas id=cwc width=1000 height=620></canvas><div id=cwov>${cwOv(A,d,v)}</div></div><button data-q=1 class="nb cwall" onclick="cGo('w')">${nxi('zoomout')}WHOLE WORLD</button><div class=cwkeys>${kc('Q')}${kc('E')} section</div></div><div class=cwpn id=cwp>${cwPanel(A,d,v)}</div></div>`,'<div class="nxbg cwbg"></div>'));
CWV.dk=dk;cwPaint(A,d);if(CWIN0&&v!=='w'){CWIN0=0;CWV.v='w';cwFit(0);CWV.v=v;setTimeout(()=>{if(UIS=='cmap')cwFit(1)},60)}else{CWIN0=0;CWV.v=v;cwFit(0)}}
// tapping a section label: zoom in (or over) if it is open, otherwise show what opens it
function cwSec(i){const A=cAcc(),d=DIF();if(secOpen(A,d,i))return cGo(i);sfx('deny');CWV.ws=i;if(CWV.v==='w')cwShow('w')}
// Q / E, LB / RB: the next or previous section
function cwNext(dr){const A=cAcc(),d=DIF(),c=CWV.v==='w'?CWV.ws:CWV.v;for(let s=1;s<5;s++){const i=((c??0)+dr*s+50)%5;if(CWV.v==='w'){CWV.ws=i;sfx('click');return cwShow('w')}if(secOpen(A,d,i))return cGo(i)}sfx('deny')}
function cwDif(){const v=CWV.v;if(v!=null&&v!=='w')return cGo(v);mapId=campFront();S.mp=mapId;cMap()}
