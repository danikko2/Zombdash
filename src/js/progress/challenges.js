//# progress/challenges.js — Daily and weekly challenges
// ----- challenges -----
const CHT={
kill:{d:[150,250],w:[1500,2000],t:n=>`Kill ${fmt(n)} zombies`},
gun:{d:[50,100],w:[300,450],t:(n,a)=>`Get ${fmt(n)} kills with the ${WP[a].n}`},
map:{d:[120,200],w:[800,1100],t:(n,a)=>`Kill ${fmt(n)} zombies on ${MP[a].n}`},
surv:{d:[100,160],w:[700,1000],t:(n,a)=>`Kill ${fmt(n)} zombies as ${CH[a].n}`},
sp:{d:[25,45],w:[250,350],t:n=>`Kill ${fmt(n)} special zombies`},
close:{d:[40,70],w:[300,450],t:n=>`Get ${fmt(n)} close-range kills`},
multi:{d:[10,18],w:[80,120],t:n=>`Get ${fmt(n)} multi-kills`},
boss:{d:[1,2],w:[6,10],t:n=>`Defeat ${n} boss${n>1?'es':''}`},
wave:{d:[10,14],w:[22,28],t:n=>`Reach wave ${n} in one run`,mx:1},
clear:{d:[15,25],w:[120,160],t:n=>`Clear ${fmt(n)} waves`},
drop:{d:[8,14],w:[60,90],t:n=>`Pick up ${fmt(n)} power-ups`},
spend:{d:[2500,4000],w:[25000,35000],t:n=>`Spend $${fmt(n)} in the shop`},
hard:{w:[12,16],t:n=>`Reach wave ${n} on Hard`,mx:1}};
const CHR={d:{x:150,z:100,bz:150},w:{x:600,z:400,bz:500,bs:1}};
function rng(s){let h=1779033703^s.length;for(let i=0;i<s.length;i++){h=Math.imul(h^s.charCodeAt(i),3432918353);h=h<<13|h>>>19}return()=>{h=Math.imul(h^h>>>16,2246822507);h=Math.imul(h^h>>>13,3266489909);return((h^=h>>>16)>>>0)/4294967296}}
function dKey(d){d=d||new Date();return d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate()}
function wKey(){const d=new Date();d.setDate(d.getDate()-(d.getDay()+6)%7);return dKey(d)}
function mkCh(A,per,R,ex){const pool=Object.keys(CHT).filter(k=>CHT[k][per]&&!ex.includes(k)),k=pool[R()*pool.length|0],[a,b]=CHT[k][per];let n=a+R()*(b-a);const r=n>=10000?1000:n>=1000?100:n>=100?10:n>=20?5:1;n=Math.max(1,Math.round(n/r)*r);let x=0;
if(k=='gun'){const L=per=='d'?[0,1,2,3,8]:[3,4,5,6,8];x=L[R()*L.length|0]}if(k=='map'){let L=[];try{L=MP.map((_,i)=>i).filter(m=>mapOKA(A,m))}catch(e){}if(!L.length)L=[0];x=L[R()*L.length|0]}if(k=='surv'){const u=A.un||[0];x=u[R()*u.length|0]}return{k,n,a:x,p:0,f:0}}
function chkC(A){if(!A||A.g)return null;const c=A.ch=A.ch||{},d=dKey(),w=wKey(),nm=(A.name||'')+'|';
if(c.d!==d||!c.D){const R=rng(nm+'d'+d),L=[];for(let i=0;i<3;i++)L.push(mkCh(A,'d',R,L.map(q=>q.k)));c.d=d;c.D=L;c.db=0;c.rr=0}
if(c.w!==w||!c.W){const R=rng(nm+'w'+w),L=[];for(let i=0;i<3;i++)L.push(mkCh(A,'w',R,L.map(q=>q.k)));c.w=w;c.W=L;c.wb=0}return c}
function chEv(p,ty,v,x){const A=p&&p.ac;if(!A||A.g)return;try{msEv(p,ty,v,x)}catch(e){}const c=A.ch;if(!c||!c.D)return;x=x||{};
for(const[L,per]of[[c.D,'d'],[c.W,'w']])for(const q of L){if(q.f)continue;let m=0;
switch(q.k){case'kill':m=ty=='kill';break;case'gun':m=ty=='kill'&&x.g===q.a;break;case'map':m=ty=='kill'&&mapId===q.a;break;case'surv':m=ty=='kill'&&p.ci===q.a;break;case'sp':m=ty=='kill'&&x.sp;break;case'close':m=ty=='kill'&&x.close;break;case'multi':m=ty=='kill'&&x.multi;break;case'hard':m=ty=='wave'&&S.df;break;default:m=ty==q.k}
if(!m)continue;if(CHT[q.k].mx)q.p=Math.max(q.p,v);else q.p+=v;
if(q.p>=q.n){q.p=q.n;q.f=1;const R=CHR[per];acXP(A,R.x);A.pts=(A.pts||0)+R.z;pNote(p,(per=='d'?'DAILY':'WEEKLY')+' CHALLENGE DONE · +'+R.z+' Z','#9be860','Challenge done: '+CHT[q.k].t(q.n,q.a)+' (+'+R.x+' XP, +'+R.z+' Zombie Pts)');
if(L.every(z=>z.f)&&!c[per+'b']){c[per+'b']=1;A.pts+=R.bz;if(R.bs)A.sp++;pNote(p,per=='d'?'ALL DAILIES DONE · +'+R.bz+' Z':'ALL WEEKLIES DONE · +1 SKILL POINT','#ffcf40',per=='d'?'All daily challenges done (+'+R.bz+' Zombie Pts)':'All weekly challenges done (+1 Skill Point, +'+R.bz+' Zombie Pts)')}sv()}}SVD=1}
function chN(A){try{const c=chkC(A);return c?c.D.concat(c.W).filter(q=>q.f).length:0}catch(e){return 0}}
function reroll(i){const A=prA(),c=chkC(A);if(!c||c.rr||c.D[i].f){sfx('deny');return}c.D[i]=mkCh(A,'d',Math.random,c.D.map(q=>q.k));c.rr=1;sv();sfx('click');chals()}
function chMini(A){const c=chkC(A);if(!c)return'';return `<div class=chm><small>DAILY CHALLENGES</small>${c.D.map(q=>`<div class="${q.f?'dn':''}"><span>${CHT[q.k].t(q.n,q.a)}</span><b>${q.f?'✓':fmt(q.p)+'/'+fmt(q.n)}</b></div>`).join('')}</div>`}
function runLog(p){const L=p.nt||[];if(!L.length)return'';return `<div class=rlog>${L.slice(0,6).map(t=>`<div>${t}</div>`).join('')}${L.length>6?`<div>+${L.length-6} more</div>`:''}</div>`}
