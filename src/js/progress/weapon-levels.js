//# progress/weapon-levels.js — Weapon levels and camos
// ---------- progression: weapon levels, weapon camos, daily & weekly challenges ----------
let KG=-1,PRI=0,ARG=0,ARF=0;
const WMAX=20,wNeed=l=>30+15*l;
const CAMO=[
{n:'Factory',d:'The standard finish.'},
{n:'Woodland',k:'k',g:100,d:'Get 100 kills with this gun.'},
{n:'Desert',k:'k',g:250,d:'Get 250 kills with this gun.'},
{n:'Urban',k:'n',g:60,d:'Get 60 close-range kills with this gun.'},
{n:'Tiger',k:'m',g:30,d:'Get 30 multi-kills with this gun (3 kills in quick succession).'},
{n:'Blood',k:'h',g:150,d:'Get 150 kills with this gun on wave 15 or later.'},
{n:'Toxic',k:'b',g:3,d:'Land the final hit on 3 bosses with this gun.'},
{n:'Gold',d:'Unlock all 6 camos above on this gun.',an:1},
{n:'Diamond',d:'Get Gold on this gun, and Gold on 5 guns in total.',an:1},
{n:'Outbreak',d:'Get Gold on all 11 guns.',an:1}];
const WPK=[[5,'+5% damage'],[10,'+5% fire rate'],[15,'+10% damage total'],[20,'+10% fire rate total · MASTER']];
const fmt=n=>String(n).replace(/\B(?=(\d{3})+(?!\d))/g,',');
function wpA(A){if(!A.wp||A.wp.length!=WP.length){const o=A.wp||[];A.wp=WP.map((_,i)=>Object.assign({x:0,l:1,k:0,n:0,m:0,h:0,b:0},o[i]||{}))}if(!A.cm||A.cm.length!=WP.length){const o=A.cm||[];A.cm=WP.map((_,i)=>o[i]||0)}return A.wp}
function wLv(A,g){return A&&!A.g?wpA(A)[g].l:1}
function wlD(p,g){const l=p?wLv(p.ac,g):1;return 1+.05*((l>=5)+(l>=15))}
function wlR(p,g){const l=p?wLv(p.ac,g):1;return 1-.05*((l>=10)+(l>=20))}
function c6(w){for(let c=1;c<=6;c++)if(w[CAMO[c].k]<CAMO[c].g)return 0;return 1}
function golds(A){let n=0;for(const w of wpA(A))if(c6(w))n++;return n}
function camoOK(A,g,c){const w=wpA(A)[g];if(c==0)return 1;if(c<=6)return w[CAMO[c].k]>=CAMO[c].g;if(c==7)return c6(w);const n=golds(A);if(c==8)return c6(w)&&n>=5;return n>=WP.length}
function cmOf(A,g){if(!A||A.g)return 0;wpA(A);const c=A.cm[g]||0;return c&&camoOK(A,g,c)?c:0}
function cProg(A,g,c){const w=wpA(A)[g];if(c>=1&&c<=6){const C=CAMO[c];return fmt(Math.min(w[C.k],C.g))+'/'+fmt(C.g)}if(c==7){let n=0;for(let i=1;i<=6;i++)if(camoOK(A,g,i))n++;return n+'/6'}const n=golds(A);return c==8?(c6(w)?n+'/5':'Gold 1st'):n+'/'+WP.length}
function acXP(A,n){A.xp+=n;while(A.xp>=xpNeed(A.lv)){A.xp-=xpNeed(A.lv);A.lv++;A.sp++}}
function pNote(p,t,c,log){const k=FT.filter(f=>f.nt&&f.l>1.6).length;FT.push({x:p.x,y:p.y-46-k*18,t,c:c||'#ffcf40',l:2.6,nt:1});sfx('power');if(log)(p.nt=p.nt||[]).push(log)}
function wXP(p,g,n){const A=p.ac,w=wpA(A)[g];if(w.l>=WMAX)return;w.x+=n;while(w.l<WMAX&&w.x>=wNeed(w.l)){w.x-=wNeed(w.l);w.l++;acXP(A,20);const pk=WPK.find(q=>q[0]==w.l);pNote(p,WP[g].n.toUpperCase()+' LEVEL '+w.l+(pk?' · '+pk[1].toUpperCase():''),'#9fe8ff',WP[g].n+' reached level '+w.l+(pk?' ('+pk[1]+')':''))}if(w.l>=WMAX)w.x=0}
function pKill(z,T){const p=P,A=p&&p.ac;if(!A||A.g)return;if(sPk(p,3))p.sb=1.2;const g=KG,boss=!!T.boss,sp=!boss&&z.t!=0&&z.t!=5,close=Math.hypot(z.x-p.x,z.y-p.y)<72,t=performance.now()/1000;
p.mq=(p.mq||[]).filter(q=>t-q<1.2);p.mq.push(t);let multi=0;if(p.mq.length>=3){multi=1;p.mq=[]}
if(g>=0&&g<WP.length){const w=wpA(A)[g],was=c6(w),inc={k:1,n:close,m:multi,h:wave>=15,b:boss};for(const q in inc)if(inc[q])w[q]++;
for(let c=1;c<=6;c++){const C=CAMO[c];if(inc[C.k]&&w[C.k]===C.g)pNote(p,C.n.toUpperCase()+' CAMO · '+WP[g].n.toUpperCase(),'#ffcf40',C.n+' camo unlocked for the '+WP[g].n)}
if(!was&&c6(w)){pNote(p,'GOLD CAMO · '+WP[g].n.toUpperCase(),'#ffd84a','Gold camo unlocked for the '+WP[g].n);const n=golds(A);if(n==5)pNote(p,'DIAMOND CAMO UNLOCKED','#9fe8ff','Diamond camo unlocked (5 Gold guns)');if(n==WP.length)pNote(p,'OUTBREAK CAMO UNLOCKED','#7cff4a','Outbreak camo unlocked (every gun is Gold)')}
wXP(p,g,boss?30:sp?2:1)}
chEv(p,'kill',1,{g,sp,close,multi});if(boss)for(const q of PL)if(q===p||alive(q))chEv(q,'boss',1);SVD=1}
