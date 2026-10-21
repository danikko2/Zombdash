//# progress/mastery.js — Survivor mastery, perks, titles, badges
// ---------- survivor mastery: levels, signature perks, survivor challenges, titles, badges, Zombie-Slayer look ----------
let MSI=0;
const MMAX=10,sNeed=l=>400+300*l;
const SPK=[
{n:'Bargain Hunter',d:'Everything in the shop costs 10% less.'},
{n:'Reinforced Plating',d:'Shrugs off the first hit every wave.'},
{n:'Quick Pump',d:'Starting shotgun fires 1.5× faster.'},
{n:'Adrenaline',d:'Every kill gives a short burst of extra speed.'},
{n:'Full Plate',d:'Starts every run with a full set of armor.'},
{n:'Shove',d:'Zombies that hit him get knocked back hard.'},
{n:'Phase Bolts',d:'Laser shots pierce through one extra zombie.'},
{n:'Heroic Entrance',d:'Invincible for 3 seconds when each wave starts.'},
{n:'Dead Eye',d:'Dual Pistol shots have a 15% chance to crit.'},{n:'Stopping Power',d:'Starting shotgun fires 2 extra pellets.'},{n:'Ghost Step',d:'1 in 5 hits pass right through her.'},{n:'Soul Harvest',d:'Every 25 kills restores 1 health.'},{n:'Tuned Up',d:'Starting SMG fires 15% faster.'},{n:'Brain Freeze',d:'SMG hits can freeze zombies to half speed.'},{n:'Turnout Gear',d:'Big hits (2+ damage) deal 1 less.'},{n:'Express Lane',d:'Reloads 30% faster.'},{n:'Campaign Fund',d:'+20% cash from kills.'}];
const TT=[
['Couch Potato','Weekend Warrior','Neighborhood Hero','Dave the Destroyer','Just a Regular Legend'],
['Spare Parts','Tin Guardian','Iron Sentinel','Unit Zero','No Shutdown'],
['Ranch Hand','Buckshot Bill','Desperado','Sheriff of the Dead','High Noon'],
['Fast Starter','Track Star','Speed Demon','Lightning Susie','Personal Best'],
['Squire','Shield Bearer','Knight Errant','Sir Tim the Undying','Round Table'],
['Sasquatch','Big Foot','Forest Legend','King of the Woods','Myth Confirmed'],
['Tourist','Visitor','Star Ranger','Galactic Exterminator','Phone Home'],
['Masked Rookie','Vigilante','Night Guardian','Last Hero Standing','Secret Identity'],
['Greenhorn','Drifter','Gunslinger','Fastest Gun in the West','Ghost Town Legend'],['Rookie','Patrolman','Road Warrior','Highway Legend','Officer Down? Never'],['Lost Child','Pale Wanderer','Mansion Ghost','Haunting Shadow','Never Alone'],['Restless Rider','Night Rider','Hollow Terror','Headless Legend','Lost His Head'],['Grease Monkey','Gear Head','Chrome Rider','Chrome Reaper','Full Throttle'],['Soft Serve','Scoop Slinger','Sundae Gunner','Rocky Road','Brain Freeze'],['Probie','Hose Hand','Smoke Eater','Fire Captain','Chief of Zombville'],['Bagger','Cashier','Shift Lead','Store Manager','Clean Up on Aisle Z'],['Councilman','Town Clerk','Mr. Mayor','Re-Elected','Mayor for Life']];
const TTL=[2,5,7,10],BDC=['','#cd7f32','#c9d1da','#ffcf40'],BDN=['','Bronze','Silver','Gold'];
const MRW={2:'Title',3:'Signature perk',4:'+250 Zombie Pts',5:'Title · Bronze badge',6:'+500 Zombie Pts',7:'Title · Silver badge',8:'+750 Zombie Pts',9:'+1,000 Zombie Pts',10:'Title · Gold badge · Zombie-Slayer look'},MPZ={4:250,6:500,8:750,9:1000};
const SCH=[
[['k',1500],['w',20],['b',6],['d',60],['w',30]],
[['k',1500],['n',400],['w',20],['b',8],['hw',15]],
[['sk',1000],['n',500],['m',80],['w',20],['b',6]],
[['k',1500],['m',100],['d',80],['w',20],['w',30]],
[['k',1500],['n',500],['w',25],['b',8],['hw',15]],
[['k',2000],['n',500],['b',10],['w',25],['hw',20]],
[['sk',1000],['m',100],['w',20],['b',8],['w',30]],
[['k',1500],['c',200],['w',25],['b',8],['hw',20]],
[['sk',1200],['m',100],['n',400],['w',25],['hw',20]],[['sk',1200],['n',500],['b',8],['w',25],['hw',20]],[['k',1200],['d',80],['w',20],['b',6],['hw',15]],[['sk',1200],['n',500],['b',8],['w',25],['hw',20]],[['sk',1500],['m',100],['k',2000],['w',25],['hw',20]],[['sk',1500],['m',100],['k',2000],['w',25],['hw',20]],[['sk',1200],['n',500],['b',8],['w',25],['hw',20]],[['k',1500],['m',100],['d',60],['w',25],['hw',20]],[['sk',1200],['n',500],['b',8],['w',25],['hw',20]]];
function scT(ci,q){const[k,n]=q,N=CH[ci].n;return k=='k'?`Get ${fmt(n)} kills as ${N}`:k=='w'?`Reach wave ${n} as ${N}`:k=='b'?`Defeat ${n} bosses as ${N}`:k=='d'?`Pick up ${n} power-ups as ${N}`:k=='n'?`Get ${n} close-range kills as ${N}`:k=='m'?`Get ${n} multi-kills as ${N}`:k=='c'?`Clear ${n} waves as ${N}`:k=='hw'?`Reach wave ${n} on Hard as ${N}`:`Get ${fmt(n)} kills with ${N}'s ${wN(ci,CH[ci].w)}`}
function msA(A){if(!A.ms||A.ms.length!=CH.length){const o=A.ms||[];A.ms=CH.map((_,i)=>Object.assign({x:0,l:1,k:0,w:0,b:0,n:0,m:0,c:0,d:0,hw:0,sk:0,cd:0},o[i]||{}))}if(!A.sl||A.sl.length!=CH.length){const o=A.sl||[];A.sl=CH.map((_,i)=>o[i]||0)}return A.ms}
function msL(A,ci){return A&&!A.g?msA(A)[ci].l:1}
function sPk(p,ci){return!!(p&&p.ci===ci&&p.ac&&!p.ac.g&&msA(p.ac)[ci].l>=3)}
function slOn(A,ci){return!!(A&&!A.g&&msA(A)[ci].l>=MMAX&&A.sl[ci])}
function pc(v,p){return sPk(p||P,0)?Math.round(v*.9):v}
function ttOK(A,ci,i){const s=msA(A)[ci];return i<4?s.l>=TTL[i]:s.cd==31}
function ttN(A){if(!A||A.g||!A.tt)return'';const[c,i]=A.tt.split('-').map(Number);return TT[c]&&ttOK(A,c,i)?TT[c][i]:''}
function bdT(A,ci){const l=msA(A)[ci].l;return l>=10?3:l>=7?2:l>=5?1:0}
function bdG(A){if(!A||A.g||!A.bd)return null;const[c,t]=A.bd.split('-').map(Number);return CH[c]&&t>0&&bdT(A,c)>=t?{c,t}:null}
function bdH(A){const b=bdG(A);return b?`<span class=bdg style="--bc:${BDC[b.t]}" title="${BDN[b.t]} ${CH[b.c].n} badge">★ ${CH[b.c].n.toUpperCase()}</span>`:''}
function ttH(A){const t=ttN(A);return t?`<small class=ttl>${t}</small>`:''}
function msXP(p,ci,n){const A=p.ac,s=msA(A)[ci];if(s.l>=MMAX)return;s.x+=n;while(s.l<MMAX&&s.x>=sNeed(s.l)){s.x-=sNeed(s.l);s.l++;const L=s.l,N=CH[ci].n;let t=N.toUpperCase()+' MASTERY '+L,lg=N+' reached mastery level '+L;
if(MPZ[L]){A.pts=(A.pts||0)+MPZ[L];t+=' · +'+MPZ[L]+' Z';lg+=' (+'+MPZ[L]+' Zombie Pts)'}
if(L==3){t+=' · PERK: '+SPK[ci].n.toUpperCase();lg+=' · perk unlocked: '+SPK[ci].n}
const ti=TTL.indexOf(L);if(ti>=0){lg+=' · title "'+TT[ci][ti]+'"';if(!ttN(A))A.tt=ci+'-'+ti}
const bt=bdT(A,ci);if(bt&&L==[0,5,7,10][bt]){lg+=' · '+BDN[bt]+' badge';const b=bdG(A);if(!b||b.c==ci||b.t<bt)A.bd=ci+'-'+bt}
if(L==MMAX){A.sl[ci]=1;t='ZOMBIE-SLAYER '+N.toUpperCase()+' UNLOCKED!';lg+=' · Zombie-Slayer look unlocked'}
pNote(p,t,'#ff8a5a',lg)}if(s.l>=MMAX)s.x=0;SVD=1}
function msEv(p,ty,v,x){const A=p&&p.ac;if(!A||A.g||p.ci==null)return;const ci=p.ci,s=msA(A)[ci];x=x||{};
if(ty=='kill'){s.k++;if(sPk(p,11)){p.s25=(p.s25||0)+1;if(p.s25>=25){p.s25=0;if(p.hp<p.mx){p.hp++;FT.push({x:p.x,y:p.y-34,t:'+1 SOUL',c:'#9affb0',l:1})}}}if(x.close)s.n++;if(x.multi)s.m++;if(x.g===CH[ci].w)s.sk++;msXP(p,ci,x.sp?2:1)}
else if(ty=='boss'){s.b++;msXP(p,ci,25)}else if(ty=='wave'){s.w=Math.max(s.w,v);if(S.df)s.hw=Math.max(s.hw,v)}else if(ty=='clear'){s.c++;msXP(p,ci,10+wave)}else if(ty=='drop')s.d++;else return;
SCH[ci].forEach((q,i)=>{if(s.cd>>i&1||s[q[0]]<q[1])return;s.cd|=1<<i;A.pts=(A.pts||0)+200;pNote(p,CH[ci].n.toUpperCase()+' CHALLENGE DONE · +200 Z','#ff8a5a',scT(ci,q)+' (+400 mastery XP, +200 Zombie Pts)');msXP(p,ci,400);if(s.cd==31){pNote(p,'TITLE: '+TT[ci][4].toUpperCase(),'#ffcf40','All '+CH[ci].n+' challenges done · title "'+TT[ci][4]+'"');if(!ttN(A))A.tt=ci+'-4'}sv()})}
function slAura(by,w,h){const t=performance.now()/1000,a=.28+.12*Math.sin(t*5);X.globalAlpha=a;X.fillStyle='#ff2a1a';X.beginPath();X.ellipse(P.x,by-2,w*.42,6,0,0,7);X.fill();X.globalAlpha=a*.6;X.beginPath();X.ellipse(P.x,by-2,w*.6,9,0,0,7);X.fill();X.globalAlpha=1;
if(mode=='play'&&Math.random()<.3)pt.push({x:P.x+(Math.random()-.5)*w*.6,y:by-Math.random()*h*.8,vx:(Math.random()-.5)*20,vy:-30-Math.random()*40,l:.45,c:Math.random()<.5?'#ff4a2a':'#ffb03a'})}
// ----- mastery screen -----
function mastery(ci){UIS='ms';mode='menu';if(ci!=null){if(ci!==MSI)sfx('click');MSI=ci}const A=prA();msA(A);
show(`<div class="p wide mst"><h2>SURVIVOR MASTERY</h2><div class=prl>${prSw('mastery')}<button class=lnk data-q=1 onclick="titles()">titles & badges</button></div><div class=acols><div class=mgd>${CH.map((c,i)=>{const s=A.ms[i],u=(A.un||[0]).includes(i);return `<button data-q=1 class="${i==MSI?'on':''} ${u?'':'no'}" onclick="mastery(${i})"><canvas data-ch=${i} data-v=${slOn(A,i)?9:0} data-lk=${u?0:1}></canvas>${c.n}<small>${u?'LV '+s.l+(s.l>=MMAX?' ★':''):'locked'}</small><span class=mb><i style="width:${s.l>=MMAX?100:Math.round(s.x/sNeed(s.l)*100)}%"></i></span></button>`}).join('')}</div>
<div class=adet>${msDet(A,MSI)}</div></div><div class=row><button onclick="UIS='';menu()">BACK</button></div></div>`)}
function msDet(A,ci){const s=msA(A)[ci],c=CH[ci],u=(A.un||[0]).includes(ci),mx=s.l>=MMAX;
return `<div class=shead><canvas class=big data-ch=${ci} data-v=${slOn(A,ci)?9:0} data-lk=${u?0:1}></canvas><div style="flex:1;min-width:0"><b class=sn>${c.n}</b><div class=alv><span class=lv>LV ${s.l}</span><div class="xpb ms"><i style="width:${mx?100:Math.round(s.x/sNeed(s.l)*100)}%"></i></div></div><small class=note>${mx?'MASTERED':fmt(s.x)+'/'+fmt(sNeed(s.l))+' mastery XP'}${u?'':' · unlock '+c.n+' to earn mastery'}</small></div></div>
<div class="spk ${s.l>=3?'on':''}"><b>${s.l>=3?'✓ ':'🔒 '}${SPK[ci].n}</b><small>${SPK[ci].d}${s.l>=3?'':' Unlocks at mastery LV 3.'}</small></div>
<div class=mrw>${Object.keys(MRW).map(l=>`<span class="${s.l>=l?'on':''}">${s.l>=l?'✓':'LV '+l} · ${MRW[l]}</span>`).join('')}</div>
<div class=msl><div><b>Zombie-Slayer look</b><small>${mx?'Red-black slayer gear with a burning aura.':'Unlocks at mastery LV 10.'}</small></div><button data-q=1 class="${slOn(A,ci)?'on':''} ${mx?'':'no'}" onclick="slT(${ci})">${mx?(A.sl[ci]?'ON':'OFF'):'🔒'}</button></div>
<div class=chh><b>${c.n.toUpperCase()} CHALLENGES</b><small>${[0,1,2,3,4].filter(i=>s.cd>>i&1).length}/5 · all 5: title "${TT[ci][4]}"</small></div>
${SCH[ci].map((q,i)=>{const d=s.cd>>i&1,p=Math.min(s[q[0]],q[1]);return `<div class="chc ${d?'dn':''}"><div class=cht><b>${scT(ci,q)}</b><small>+400 mastery XP · +200 Zombie Pts</small></div><div class=chb><span class=mb><i style="width:${Math.round(p/q[1]*100)}%"></i></span><small>${d?'DONE ✓':fmt(p)+'/'+fmt(q[1])}</small></div></div>`}).join('')}`}
function slT(ci){const A=prA();if(msA(A)[ci].l<MMAX){sfx('deny');return}A.sl[ci]=A.sl[ci]?0:1;sv();sfx('buy');mastery()}
function titles(){UIS='tt';mode='menu';const A=prA();msA(A);const T=[],B=[];CH.forEach((c,ci)=>{TT[ci].forEach((t,i)=>{if(ttOK(A,ci,i))T.push([ci+'-'+i,t,c.n])});for(let b=1;b<=bdT(A,ci);b++)B.push([ci+'-'+b,c,b])});
show(`<div class="p wide ttp"><h2>TITLES & BADGES</h2><div class=prl>${prSw('titles')}</div><div class="acct ttc"><span class=lv>LV ${A.lv}</span><div class=nm><b>${A.name||'Survivor'} ${bdH(A)}</b>${ttH(A)||'<small class=ttl style="color:var(--mut)">no title</small>'}</div></div>
<div class=chh><b>TITLES</b><small>${T.length}/${CH.length*5} earned</small></div><div class=tgd><button data-q=1 class="${!ttN(A)?'on':''}" onclick="setTT('')">None</button>${T.map(([id,t,n])=>`<button data-q=1 class="${A.tt==id?'on':''}" onclick="setTT('${id}')">${t}<small>${n}</small></button>`).join('')}</div>
<div class=chh><b>BADGES</b><small>Bronze LV 5 · Silver LV 7 · Gold LV 10</small></div><div class=tgd><button data-q=1 class="${!bdG(A)?'on':''}" onclick="setBD('')">None</button>${B.map(([id,c,b])=>`<button data-q=1 class="${A.bd==id?'on':''}" onclick="setBD('${id}')"><span class=bdg style="--bc:${BDC[b]}">★ ${c.n.toUpperCase()}</span><small>${BDN[b]}</small></button>`).join('')}</div>
${T.length?'':'<p class=note>Earn titles and badges by leveling up survivor mastery.</p>'}<div class=row><button onclick="mastery()">BACK</button></div></div>`)}
function setTT(id){const A=prA();A.tt=id;sv();sfx('click');titles()}
function setBD(id){const A=prA();A.bd=id;sv();sfx('click');titles()}
// ----- account codes carry mastery -----
function mEnc(A){const M=msA(A);return M.map((s,i)=>[s.x,s.l,s.k,s.w,s.b,s.n,s.m,s.c,s.d,s.hw,s.sk,s.cd,A.sl[i]||0].map(v=>Math.max(0,v|0).toString(36)).join('-')).join('_')+'_'+(A.tt||'n')+'_'+(A.bd||'n')}
function mDec(s,A){const G=s.toLowerCase().split('_'),nc=G.length-2;if(nc<8||nc>CH.length)return 0;const ms=[],sl=[];for(let i=0;i<nc;i++){const v=G[i].split('-').map(x=>/^[0-9a-z]+$/.test(x)?parseInt(x,36):NaN);if(v.length!=13||v.some(isNaN))return 0;ms.push({x:v[0],l:cl(v[1],1,MMAX),k:v[2],w:v[3],b:v[4],n:v[5],m:v[6],c:v[7],d:v[8],hw:v[9],sk:v[10],cd:v[11]&31});sl.push(v[12]?1:0)}
const ok=t=>/^\d-\d$/.test(t);A.ms=ms;A.sl=sl;A.tt=ok(G[nc])?G[nc]:'';A.bd=ok(G[nc+1])?G[nc+1]:'';return 1}

