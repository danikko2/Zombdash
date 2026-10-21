//# progress/skills.js — Skills and XP
const rk=id=>((P&&P.ac)||S.ac).sk[id]||0;const SKA=()=>[S.ac,...S.prof][SKI]||S.ac,rkS=id=>SKA().sk[id]||0;
const xpNeed=lv=>100+40*(lv-1);
function xpMul(){return(S.sw>1?Math.max(.4,1-(S.sw-1)*.04):1)*(S.df?1.25:DIF()==0?.85:1)}
function gainXP(n){if(!P)return;const g=Math.max(1,Math.round(n*(P.xm||1)));P.xg=(P.xg||0)+g;const A=P.ac||S.ac;A.xp+=g;let up=0;while(A.xp>=xpNeed(A.lv)){A.xp-=xpNeed(A.lv);A.lv++;A.sp++;up=1}
if(up){FT.push({x:P.x,y:P.y-34,t:'LEVEL UP! LV '+A.lv,c:'#ffcf40',l:2.2});sfx('power');P.lu=(P.lu||0)+1;sv()}else SVD=1}
let SVD=0,SVT=0;document.addEventListener('visibilitychange',()=>{if(document.hidden&&SVD){SVD=0;sv()}});
let SKS=null;
function skills(){mode='menu';const A=SKA(),sel=SKS?SKB.flatMap(b=>b.k).find(k=>k.id==SKS):null;
show(`<div class="p wide sk"><h2>SKILL TREE</h2><div class=chips><span class=chip>LV <b>${A.lv}</b></span><span class=chip><b>${A.sp}</b> skill pts</span><span class=chip>${A.name||'Survivor'} ${SKI?'':'<button class=lnk data-q=1 onclick="nameScreen(1)">edit</button>'}${S.prof.length?'<button class=lnk data-q=1 onclick="SKI=(SKI+1)%(S.prof.length+1);SKS=null;skills()">switch</button>':''}</span></div><div class=tree>`+
SKB.map((b,bi)=>`<div class=br><h3 style="color:${b.c}">${b.n}</h3>`+b.k.map((k,ti)=>{const r=rkS(k.id),lock=ti>0&&!rkS(b.k[ti-1].id),cost=ti+1;return `${ti?'<i class=ln></i>':''}<button data-q=1 class="nd ${SKS==k.id?'on':''} ${lock?'no':''} ${r>=k.m?'mx':''}" onclick="selSk('${k.id}')"><span>${k.n}</span><small>${'◆'.repeat(r)}${'◇'.repeat(k.m-r)} · ${cost}pt</small></button>`}).join('')+`</div>`).join('')+
`</div><div class=skd>${sel?(()=>{const b=SKB.find(b=>b.k.includes(sel)),ti=b.k.indexOf(sel),r=rkS(sel.id),lock=ti>0&&!rkS(b.k[ti-1].id),cost=ti+1;return `<b>${sel.n}</b> <span class=note>${r?'Now: '+sel.d(r):'Not learned'}${r<sel.m?' → next: '+sel.d(r+1):''}</span>${lock?`<span class=note>Learn ${b.k[ti-1].n} first.</span>`:''}`})():'<span class=note>Tap a perk to see what it does. Perks further down a branch cost more points.</span>'}</div>
<div class=row><button onclick="SKS=null;menu()">BACK</button><button data-q=1 onclick="resetSk()">RESET</button>${sel?`<button data-q=1 class=go onclick="buySk()">LEARN · ${SKB.find(b=>b.k.includes(sel)).k.indexOf(sel)+1} PT</button>`:''}</div></div>`)}
function selSk(id){SKS=id;sfx('click');skills()}
function buySk(){const A=SKA();for(const b of SKB){const ti=b.k.findIndex(k=>k.id==SKS);if(ti<0)continue;const k=b.k[ti],r=rkS(k.id),cost=ti+1;if(r>=k.m||A.sp<cost||(ti>0&&!rkS(b.k[ti-1].id))){sfx('deny');return skills()}A.sp-=cost;if(DT('sp'))A.sp=9999;A.sk[k.id]=r+1;sv();sfx('buy');return skills()}}
function resetSk(){const A=SKA();let back=0;for(const b of SKB)b.k.forEach((k,ti)=>{back+=(A.sk[k.id]||0)*(ti+1)});A.sp+=back;A.sk={};sv();sfx('click');skills()}
