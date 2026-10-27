//# dev/balance-editor.js — GAME BALANCE editor and settings codes
// ---------- test mode: GAME BALANCE editor (Options → Test code → GAME BALANCE) ----------
// Every value here is the game's real variable. Changes are saved on this device in S.bal (by short id)
// and only apply while test mode is on; turning test mode off puts every default back.
var BALR=[],BALM={},BALD={},BALO={},BALT='guns',BALTO=0;
const BALG=[['guns','Guns'],['ammo','Ammo'],['caps','Caps'],['zhp','Zombie HP'],['bhp','Boss HP'],['php','Player HP'],['spd','Speed'],['drop','Drops'],['zc','Zombie count']];
const BAMO=[['pa','Pistol'],['ri','Rifle'],['sh','Shotgun'],['rk','Rockets'],['bl','Belts'],['ar','Arrows'],['rand','Random']];
function balInit(){if(BALR.length)return;
 // id = short stable name used in S.bal and in settings codes; the label key is kept so older saves still load
 const add=(id,g,sub,lab,o,f,mn,mx,st,opt)=>{const e={id,k:id,g,sub,lab,o,f,mn,mx,st,opt};BALR.push(e);BALM[id]=e;BALD[id]=o[f];BALO[g+'|'+(sub||'')+'|'+lab]=id};
 const up=(v,m,s)=>Math.max(m,Math.ceil(v/s)*s);
 WP.forEach((w,i)=>{const n=w.n+(i==0?' (Dual Pistols get 2× mag)':w.ck?' (damage = each bite on a boss; mag in chickens)':w.bb?' (damage = the bolt\'s own hit, before the blast)':w.zl?' (damage = the least each zombie takes; one shot a magazine)':w.fb?' (damage = the bolt\'s own hit, before the fire)':'');add('gD'+i,'guns',n,'Damage',w,'d',.25,up(w.d*3,10,1),.25);add('gM'+i,'guns',n,'Magazine',MAG,i,1,up(MAG[i]*4,20,10),1);add('gP'+i,'guns',n,'Store price',w,'cost',0,up(w.cost*3,1000,100),10);
  // the Crossbow and the Chicken Gun also have their fire rate and the chickens' rules here
  if(w.ab||w.ck)add('gR'+i,'guns',n,'Seconds between shots',w,'r',.05,3,.05);
  if(w.ab)add('gV'+i,'guns',n,'Bolt speed',w,'bv',200,1500,10);
  if(w.ck){add('kR','guns',n,'Rockets per chicken',w,'apr',1,10,1);add('kM','guns',n,'Chickens out at once',CKG,'max',1,10,1);add('kA','guns',n,'Fewest zombies a chicken eats',CKG,'n0',1,30,1);add('kB','guns',n,'Most zombies a chicken eats',CKG,'n1',1,30,1);
   add('kH','guns',n,'Zombie health that counts as 2 eaten',CKG,'big',1,60,.5);add('kS','guns',n,'Chicken flying speed',CKG,'sp',60,800,10);add('kI','guns',n,'Seconds with nothing to eat before it pops',CKG,'idle',1,30,.5)}
  // Blastbow, Death Row and Firebow (weapons/bows-and-lightning.js)
  if(w.bb){add('gB'+i,'guns',n,'Blast damage to the zombie it sticks in',w,'bx',0,150,1);add('gS'+i,'guns',n,'Blast damage to the zombies around',w,'bs',0,80,.5);add('gA'+i,'guns',n,'Blast radius',w,'br',10,250,5);add('gF'+i,'guns',n,'Seconds before it blows up',w,'bf',.1,5,.1)}
  if(w.zl){add('gL'+i,'guns',n,'Reload seconds',RLT,i,.2,10,.1);add('gX'+i,'guns',n,'Extra random damage (0 up to)',w,'dx',0,30,.5);add('gN'+i,'guns',n,'Most zombies in one chain',w,'zn',1,40,1);add('gJ'+i,'guns',n,'How far the lightning jumps between zombies',w,'zj',20,400,5);add('gG'+i,'guns',n,'How far the first zap reaches',w,'zr',100,1200,10)}
  if(w.fb){add('gT'+i,'guns',n,'Seconds a zombie burns',w,'bt',.5,15,.5);add('gU'+i,'guns',n,'Fire damage per second',w,'bd',0,10,.1)}});
 for(const k in AMI){const a=AMI[k];add('aX'+k,'ammo',a.n,'Max carried',a,'max',0,up(a.max*3,50,50),a.max>=200?10:1);add('aB'+k,'ammo',a.n,'Amount per purchase',a,'buy',1,up(a.buy*3,20,10),a.buy>=100?5:1);add('aC'+k,'ammo',a.n,'Store price',a,'cost',0,up(a.cost*4,200,50),5);add('aD'+k,'ammo',a.n,'Pickup size',a,'drop',0,up(a.drop*3,20,10),a.drop>=100?5:1)}
 ['Easy','Normal','Hard'].forEach((d,i)=>add('cR'+i,'caps','Ranged cap (free play + campaign)',d+' %',ZCFG.cap.rg,i,0,100,1));
 ['Easy','Normal','Hard'].forEach((d,i)=>add('cS'+i,'caps','Special cap (free play)',d+' %',ZCFG.cap.sp,i,0,100,1));
 ZCFG.camp.forEach((c,i)=>add('cC'+i,'caps','Special cap (campaign, Easy / Medium)',(i+1)+'. '+(SEC[i]?SEC[i].n:'Section '+(i+1))+' %',c,'sp',0,100,1));
 add('cH','caps','Special cap (campaign, Easy / Medium)','Hard adds (points)',ZCFG,'campHard',0,50,1);
 const BOS=[6,7,8,12,13];
 for(const k in ZC){const t=+k;add('hZ'+t,'zhp','Base health (grows with each wave)',ZC[t].n,ZT[t],'hp',.5,up(ZT[t].hp*4,10,5),.5)}
 for(const t of BOS)add('hB'+t,'bhp','Wave bosses (×1.8 on Hard, more with more players)',ZT[t].n,ZT[t],'hp',10,up(ZT[t].hp*3,100,50),5);
 for(const ci in SVS){const D=SVS[ci],n=CH[ci]?CH[ci].n:'#'+ci;add('hS'+ci,'bhp','Survivor bosses (wave 20 of the campaign)',n,D,'hp',20,up(D.hp*3,100,50),10);if(D.h1)add('hT'+ci,'bhp','Survivor bosses (wave 20 of the campaign)',n+' · '+(D.p1||'first bar'),D,'h1',20,up(D.h1*3,100,50),10)}
 CH.forEach((c,i)=>add('hP'+i,'php','Starting health of each survivor (max health still goes up to 8 above it)',c.n,c,'hp',1,20,1));
 // speeds
 for(const k in ZC){const t=+k;add('sZ'+t,'spd','Zombies: walking speed (Hard ×1.5, grows a little every 5 waves)',ZC[t].n,ZT[t],'sp',5,up(ZT[t].sp*3,150,10),1)}
 for(const t of BOS)add('sB'+t,'spd','Wave bosses: walking speed',ZT[t].n,ZT[t],'sp',5,up(ZT[t].sp*3,150,10),1);
 for(const ci in SVS){const D=SVS[ci];add('sS'+ci,'spd','Survivor bosses: walking speed (dashes, leaps and vehicles keep their own speeds)',CH[ci]?CH[ci].n:'#'+ci,D,'sp',10,up(D.sp*3,200,10),1)}
 CH.forEach((c,i)=>add('sP'+i,'spd','Player survivors: speed (1 = normal, applies from the next run)',c.n,c,'sp',.3,2.5,.05));
 // drops
 add('dG','drop','Pickups','Most items on the ground at once',DROPG,'max',1,40,1);add('dCb','drop','Pickups','Cash pickup: base $',DROPG,'cb',0,200,1);add('dCw','drop','Pickups','Cash pickup: + $ per wave',DROPG,'cw',0,40,1);add('dDs','drop','Pickups','2× damage lasts (seconds)',DROPG,'dds',1,30,.5);add('dHp','drop','Pickups','Health pickup heals',DROPG,'hp',1,10,1);
 const dn=t=>ZC[t]?ZC[t].n:ZT[t].n,dt=[...Object.keys(ZC).map(Number),...BOS];
 for(const t of dt){const D=DROPT[t];if(!D)continue;const b=!!ZT[t].boss,sub=(b?'Boss: ':'')+dn(t)+' (chance per kill, %)',mx=b?100:30;
  add('dA'+t,'drop',sub,'Ammo box',D,'am',0,100,.5);add('dT'+t,'drop',sub,'Ammo type',D,'at',0,0,0,BAMO);add('dE'+t,'drop',sub,'Extra random ammo box',D,'am2',0,100,.5);
  add('dC'+t,'drop',sub,'Cash',D,'cash',0,mx,.1);add('dD'+t,'drop',sub,'2× damage',D,'dd',0,mx,.1);add('dH'+t,'drop',sub,'Health',D,'hp',0,mx,.1)}
 // zombie count
 const zs='Every map: normal wave size = base + per wave × wave + growth × wave²';add('nB','zc',zs,'Base',ZWN,'b',0,40,1);add('nW','zc',zs,'Per wave',ZWN,'w',0,12,.25);add('nG','zc',zs,'Growth',ZWN,'g',0,1,.01);
 CORD.forEach((m,i)=>add('nC'+m,'zc','Campaign: % of the normal size on each map',(i+1)+'. '+MP[m].n,ZMAPM.c,m,10,400,5));
 MP.forEach((M,m)=>add('nF'+m,'zc','Free play: % of the normal size on each map',M.n,ZMAPM.f,m,10,400,5))}
function balOK(e,v){if(e.opt)return e.opt.some(o=>o[0]===v)?v:null;v=+v;return isFinite(v)?Math.max(0,v):null}
function balApply(){balInit();if(S.bal)for(const k of Object.keys(S.bal))if(!BALM[k]&&BALO[k]){S.bal[BALO[k]]=S.bal[k];delete S.bal[k]}
 for(const e of BALR)e.o[e.f]=BALD[e.k];if(!S.dev||!S.bal)return;for(const k in S.bal){const e=BALM[k];if(!e)continue;const v=balOK(e,S.bal[k]);if(v!=null)e.o[e.f]=v}}
function balPct(e,v){const mx=Math.max(e.mx,v);return mx>e.mn?Math.round((v-e.mn)/(mx-e.mn)*100):0}
function balFmt(v){if(typeof v=='string'){const o=BAMO.find(q=>q[0]==v);return o?o[1]:v}v=+v;return Number.isInteger(v)?String(v):String(Math.round(v*100)/100)}
function balRow(e){const v=e.o[e.f],ch=S.bal&&e.k in S.bal,i=BALR.indexOf(e),rs=`<button class=brs data-q=1 title="Default: ${balFmt(BALD[e.k])}" onclick="balSet(${i},null)">↺</button>`;
 if(e.opt)return `<div class="brow bsel ${ch?'ch':''}" id=bal${i}><span>${e.lab}</span><select onchange="balSet(${i},this.value)">${e.opt.map(o=>`<option value=${o[0]} ${o[0]==v?'selected':''}>${o[1]}</option>`).join('')}</select>${rs}</div>`;
 return `<div class="brow ${ch?'ch':''}" id=bal${i}><span>${e.lab}</span><input type=range min=${e.mn} max=${Math.max(e.mx,v)} step=${e.st} value=${v} style="--v:${balPct(e,v)}%" oninput="balSet(${i},this.value)"><input class=bnum type=number min=0 step=${e.st} value=${balFmt(v)} onchange="balSet(${i},this.value)">${rs}</div>`}
function balCss(){dtCss();try{if(document.getElementById('balcss')||!document.head)return;const st=document.createElement('style');st.id='balcss';st.textContent=`.bal .bbody{padding:2px 4px 6px 2px;text-align:left}
.bal h2 small{font-size:.55em;opacity:.7;margin-left:6px}.bal .btab{flex-wrap:wrap;gap:4px;position:sticky;top:-18px;z-index:3;background:#1a2a1c;padding:6px 0;margin:0 -4px;box-shadow:0 6px 8px -6px rgba(0,0,0,.6)}.bal .btab button{flex:1 1 0;min-width:30%;width:auto;font-size:15px;padding:6px 6px;margin:0}
.bal .bsub{margin:12px 0 3px;color:#ffcf40;font-size:14px;letter-spacing:.5px;border-bottom:1px solid rgba(255,207,64,.25);padding-bottom:2px}
.bal .brow{display:grid;grid-template-columns:minmax(96px,1.2fr) 2fr 70px 32px;gap:8px;align-items:center;padding:2px 4px;border-radius:4px}
.bal .brow.bsel{grid-template-columns:minmax(96px,1.2fr) calc(2fr + 78px) 32px;grid-template-columns:minmax(96px,1.2fr) 1fr 32px}
.bal .brow select{font:16px VT323,ui-monospace,monospace;padding:3px 4px;background:#0e1510;color:#e9f1e2;border:1px solid #3a5a30;border-radius:3px;max-width:240px}
.bal .brow.ch{background:rgba(255,207,64,.14)}.bal .brow.ch span{color:#ffe27a}.bal .brow span{font-size:15px;line-height:1.1}
.bal .brow input[type=range]{width:100%;margin:0;accent-color:#9be860}
.bal .bnum{width:70px;box-sizing:border-box;font:16px VT323,ui-monospace,monospace;padding:2px 4px;background:#0e1510;color:#e9f1e2;border:1px solid #3a5a30;border-radius:3px}
.bal .brs{width:32px!important;min-width:0!important;height:28px;padding:0!important;font-size:16px!important;margin:0!important}
.bal .bft{display:flex;flex-wrap:wrap;gap:6px;justify-content:center;margin-top:8px}.bal .bft button{flex:1 1 140px;font-size:15px}
.bal .bcode{margin-top:10px;padding:8px;background:rgba(0,0,0,.2);border-radius:4px;text-align:left}.bal .bcode h4{margin:0 0 4px;color:#ffcf40;font-size:14px}
.bal .bcode textarea{width:100%;box-sizing:border-box;height:64px;font:13px ui-monospace,Menlo,Consolas,monospace;background:#0e1510;color:#e9f1e2;border:1px solid #3a5a30;border-radius:3px;padding:4px;word-break:break-all}
@media (max-width:560px){.bal .brow{grid-template-columns:1fr 70px 32px}.bal .brow input[type=range]{grid-column:1/-1;grid-row:2}.bal .brow.bsel{grid-template-columns:1fr 1fr 32px}}`;document.head.appendChild(st)}catch(e){}}
function balOpen(t){if(!S.dev)return options();balInit();if(t)BALT=t;UIS='bal';mode='menu';balCss();let h='',sub=null;
 for(const e of BALR){if(e.g!=BALT)continue;if(e.sub!==sub){sub=e.sub;h+=`<h4 class=bsub>${sub}</h4>`;if(BALT=='zc'&&e.lab=='Base')h+=`<p class=note id=balzc style="text-align:left;margin:2px 4px 6px">${balZcTxt()}</p>`}h+=balRow(e)}
 if(BALT=='drop')h=`<p class=note style="text-align:left;margin:4px">Each kill rolls every chance on its own. The Luck skill raises the chances on regular zombies. Survivor bosses don't drop items.</p>`+h;
 const n=Object.keys(S.bal||{}).length;
 show(`<div class="p wide bal"><h2>GAME BALANCE<small>test mode</small></h2><div class=row style="margin:0 0 4px"><button data-q=1 onclick="options()">◀ BACK TO OPTIONS</button></div><div class="seg btab">${BALG.map(([k,nm])=>`<button data-q=1 class="${BALT==k?'on':''}" onclick="balOpen('${k}')">${nm}${BALR.some(e=>e.g==k&&S.bal&&e.k in S.bal)?' •':''}</button>`).join('')}</div>
<div class=bbody>${h}</div><p class=note>Changes save on this device and apply right away to new spawns, the store and the next run, but only while test mode is on. Highlighted rows differ from the game's defaults (${n} changed).</p>
<div class=bft><button data-q=1 onclick="balReset(1)">Reset this tab</button><button data-q=1 class=red onclick="balReset(0)">Reset everything</button><button data-q=1 onclick="balCopy()">Copy changes as a list</button></div><p class=note id=balmsg></p>
<div class=bcode><h4>SETTINGS CODE</h4><p class=note style="text-align:left;margin:0 0 6px">Copy this code to keep your balance settings. Paste a code below and press LOAD to put those settings back (it replaces the current changes).</p>
<textarea id=balcode readonly onclick="this.select()">${balCode()}</textarea><div class=row><button data-q=1 onclick="balCodeCopy()">COPY CODE</button></div>
<textarea id=balin placeholder="Paste a settings code here"></textarea><div class=row><button data-q=1 class=go onclick="balLoad()">LOAD CODE</button></div><p class=note id=balcmsg></p></div>
<div class=row><button class=go onclick="options()">BACK</button></div></div>`)}
function balZcTxt(){return 'At 100%, one player: '+[1,3,5,9,10,15,19,20,30].map(w=>'W'+w+' '+(w%10==0?Math.floor(zWaveBase(w)*.35)+' (boss)':zWaveBase(w))).join(' · ')+'. Split screen adds 60% per extra player. New-type waves use 40–80% of this.'}
function balSet(i,v){const e=BALR[i];if(!e)return;S.bal=S.bal||{};let x=v==null||v===''?null:balOK(e,v);if(x==null)x=BALD[e.k];if(x===BALD[e.k]||(!e.opt&&+x==+BALD[e.k]))delete S.bal[e.k];else S.bal[e.k]=x;e.o[e.f]=S.dev?x:BALD[e.k];
 try{const r=document.getElementById('bal'+i);if(r){if(e.opt){const s=r.querySelector('select');if(s)s.value=x}else{const[rg,nm]=r.querySelectorAll('input');if(rg){if(+rg.value!==x){if(x>+rg.max)rg.max=x;rg.value=x}rg.style.setProperty('--v',balPct(Object.assign({},e,{mx:+rg.max}),x)+'%')}if(nm&&document.activeElement!==nm)nm.value=balFmt(x)}r.classList.toggle('ch',e.k in S.bal)}
  if(e.g=='zc'){const z=document.getElementById('balzc');if(z)z.textContent=balZcTxt()}const c=document.getElementById('balcode');if(c)c.value=balCode()}catch(q){}
 clearTimeout(BALTO);BALTO=setTimeout(()=>{try{sv()}catch(q){}},300)}
function balReset(tab){if(!S.bal)S.bal={};for(const e of BALR)if(!tab||e.g==BALT)delete S.bal[e.k];balApply();try{sv()}catch(x){}sfx('click');balOpen()}
function balText(){const L=[];for(const e of BALR)if(S.bal&&e.k in S.bal)L.push(BALG.find(g=>g[0]==e.g)[1]+' · '+e.sub+' · '+e.lab+': '+balFmt(BALD[e.k])+' → '+balFmt(S.bal[e.k]));return L.length?'Zombdash balance changes:\n'+L.join('\n'):'No changes from the defaults.'}
function balClip(t,ok,fb){try{navigator.clipboard.writeText(t).then(ok,fb)}catch(x){fb()}}
function balCopy(){const t=balText(),m=document.getElementById('balmsg');balClip(t,()=>{sfx('buy');if(m)m.textContent='Copied '+(t.split('\n').length-1)+' change(s). Paste them into the chat.'},()=>{if(m)m.innerHTML='<textarea readonly style="width:100%;height:140px;font-size:12px">'+t.replace(/</g,'&lt;')+'</textarea>'})}
// ---- settings code: "ZDB1-" + base64 of the changed values {id: value} ----
function balCode(){const b=S.bal||{};if(!Object.keys(b).length)return 'ZDB1-e30';let j=JSON.stringify(b);return 'ZDB1-'+btoa(unescape(encodeURIComponent(j))).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'')}
function balParse(c){c=String(c||'').replace(/\s+/g,'');const m=/^ZDB1-([A-Za-z0-9_-]+)$/.exec(c);if(!m)return null;try{let s=m[1].replace(/-/g,'+').replace(/_/g,'/');while(s.length%4)s+='=';const o=JSON.parse(decodeURIComponent(escape(atob(s))));return o&&typeof o=='object'&&!Array.isArray(o)?o:null}catch(e){return null}}
function balCodeCopy(){const t=balCode(),m=document.getElementById('balcmsg'),el=document.getElementById('balcode');balClip(t,()=>{sfx('buy');if(m)m.textContent='Code copied. Keep it somewhere safe (notes app, chat, email).'},()=>{if(el){el.focus();el.select()}if(m)m.textContent='Select the code above and copy it.'})}
function balLoad(){const el=document.getElementById('balin'),m=document.getElementById('balcmsg'),o=balParse(el&&el.value);if(!o){sfx('deny');if(m)m.textContent='That isn\'t a valid settings code. It should start with ZDB1-';return}
 balInit();const nb={};let ok=0,skip=0;for(const k in o){const id=BALM[k]?k:BALO[k];const e=id&&BALM[id];const v=e?balOK(e,o[k]):null;if(v==null){skip++;continue}if(v!==BALD[id]&&!(!e.opt&&+v==+BALD[id])){nb[id]=v;ok++}}
 S.bal=nb;balApply();try{sv()}catch(x){}sfx('buy');balOpen();const m2=document.getElementById('balcmsg');if(m2)m2.textContent='Loaded '+ok+' setting(s)'+(skip?' · '+skip+' unknown value(s) skipped':'')+'.'}
// entry in Options (test mode only), and keep the values in step with test mode
const _devBox1=devBox;devBox=function(){return _devBox1()+(S.dev?`<div class=dvb><h3>Game balance</h3><button data-q=1 class=go onclick="balOpen()">GAME BALANCE<small>guns · ammo · caps · health · speed · drops · zombie count</small></button><p class=note>${Object.keys(S.bal||{}).length?Object.keys(S.bal).length+' value(s) changed from the defaults.':'Everything is at the defaults.'}</p></div>`:'')};
const _devSet1=devSet;devSet=function(){_devSet1();balApply()};
const _devOff1=devOff;devOff=function(){S.dev=0;balApply();_devOff1()};
balApply();

