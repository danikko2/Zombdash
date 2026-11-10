//# crafting/blueprints.js — Workbench & Blueprints: the tunable numbers, weapon tiers, each account's blueprints and bench level, Zombie Pts earning
// ---------- the numbers (Game Balance → Blueprints edits every one of them in test mode) ----------
// price[t]  Zombie Pts for each blueprint in tier t (tier 0 = Start, owned by everyone)
// up[L]     Zombie Pts to upgrade the bench to level L (level 1 is free)
// mul[s]    Zombie Pts multiplier of campaign section s (Free Play uses the section a map belongs to; maps in none: ×1)
// rep       % of the full reward a replay or a losing run pays; a first clear pays 100%, shown as a "first clear bonus"
// hard      extra Zombie Pts multiplier on Hard
// brk       break between waves, seconds · ct base ammo craft time (bench level 1) · cs seconds saved per bench level
// zw / zk  Zombie Pts per wave survived / per kill; zc a flat bonus for beating a level (campaign wave 20), before the multipliers
var BPG={price:[0,500,1000,1500,2000,2500],up:[0,0,2500,4000,5500,7000],mul:[1,1.25,1.5,1.75,2],rep:50,hard:1.5,zw:8,zk:1,zc:0,brk:120,ct:10,cs:1.5};
const BPMAX=5;
// ---------- tiers ----------
// every campaign section is a tier: tier t (1..5) = section t-1. A weapon's tier is the tr field of its WP entry (data/tables.js);
// a new weapon only needs that field to get its tier's price. A tier needs bench level max(1,t).
function bpTier(i){const w=WP[i];return w&&w.tr>0?w.tr:0}
function bpTn(t){return t?SEC[t-1]?SEC[t-1].n:'Tier '+t:'Start'}
function bpTL(t){return Math.max(1,t|0)}
function bpGuns(t){return WP.map((_,i)=>i).filter(i=>bpTier(i)==t)}
function bpPrice(i){return Math.max(0,Math.round(BPG.price[bpTier(i)]||0))}
function bpUpC(L){return Math.max(0,Math.round(BPG.up[L]||0))}
function bpNT(){let n=SEC.length;for(const w of WP)n=Math.max(n,w.tr||0);return n}
// seconds to craft one ammo purchase at a bench of level L
function bpCraftT(L){return Math.max(.5,BPG.ct-BPG.cs*(cl(L||1,1,BPMAX)-1))}
// ---------- the account's blueprints ----------
// A.bp = weapons with a bought blueprint (Start-tier guns are always owned), A.bl = bench level 1–5.
// Guests in split screen borrow the main account's, like they borrow its survivors. Accounts that played before blueprints
// existed (no A.bpv) get the tiers of every section they had already cleared: its blueprints and the bench level it needs.
function bpAcc(A){A=A||S.ac;return A&&A.g?S.ac:A}
function bpInit(A){if(!A||A.g)return A;if(!Array.isArray(A.bp))A.bp=[];A.bp=A.bp.filter((i,k,a)=>WP[i]&&bpTier(i)>0&&a.indexOf(i)==k);A.bl=cl(A.bl|0||1,1,BPMAX);
 if(A.bpv!==1){A.bpv=1;try{bpGrant(A)}catch(e){}}return A}
function bpGrant(A){for(let s=0;s<SEC.length;s++){if(!secDone(A,0,s))continue;const t=s+1;A.bl=Math.max(A.bl,Math.min(BPMAX,bpTL(t)));for(const i of bpGuns(t))if(!A.bp.includes(i))A.bp.push(i)}}
function bpLv(A){if(DT('unl'))return BPMAX;A=bpInit(bpAcc(A));return A?A.bl:1}
function bpHas(A,i){if(!WP[i])return false;if(bpTier(i)==0||DT('unl'))return true;A=bpInit(bpAcc(A));return!!A&&A.bp.includes(i)}
// a bench level also needs its section opened in the campaign (on any difficulty), so a pile of Zombie Pts can't skip ahead
function bpSecOK(A,L){return L<=1||!!(SEC[L-1]&&secOpen(A,0,L-1))}
// what stops the next bench upgrade, or '' when it can be bought
function bpUpWhy(A){const L=A.bl+1;if(L>BPMAX)return 'max';if(!bpSecOK(A,L))return 'sec';if((A.pts||0)<bpUpC(L))return 'pts';return ''}
function bpBuyWhy(A,i){const t=bpTier(i);if(!t||A.bp.includes(i))return 'own';if(A.bl<bpTL(t))return 'lvl';if((A.pts||0)<bpPrice(i))return 'pts';return ''}
// ---------- account codes: blueprints as a bitmask, then bench level and version ----------
function bpEnc(A){A=bpInit(A)||{bp:[],bl:1,bpv:1};return[A.bp.reduce((m,i)=>m+2**i,0).toString(36),A.bl,A.bpv||0].join('_')}
function bpDec(s,R){const q=String(s||'').split('_');if(q.length!=3)return 0;const m=parseInt(q[0],36),L=+q[1],v=+q[2];if(isNaN(m)||!(L>=1&&L<=BPMAX))return 0;
 R.bp=WP.map((_,i)=>i).filter(i=>bpTier(i)>0&&Math.floor(m/2**i)%2);R.bl=L;if(v)R.bpv=v;return 1}
// ---------- Zombie Pts earned by a run ----------
// (waves × zw + kills × zk + zc when the level is beaten) × section multiplier × Hard bonus = the full reward (defaults: 8 a wave, 1 a kill, no clear bonus). Replays and losing runs pay rep %; a level's first
// clear on a difficulty pays the rest as a "first clear bonus". Free Play never clears a level, so it pays the replay share.
// p.fc0 (set when the run starts) says this map was not yet beaten on this exact difficulty by that player's account.
function zpMul(){const s=secOf(mapId);return s>=0&&BPG.mul[s]!=null?+BPG.mul[s]:1}
function zpHard(){return DIF()==2?+BPG.hard||1:1}
function zpBeat(A,d,m){if(!A||A.g)return 1;if(cmIs(m)){if(CREP&&CREP.key===m)return zpBeat(A,d,CREP.o);const id=cmIdOf(m);return id?ccBits(A,id)>>d&1:1}return m>=0&&m<MP.length?bmOf(A)[d]>>m&1:1}
function zpRun(){const cm=cCampId();for(const p of PL){p.fc0=GMD=='c'&&!PTX&&!cmPT(mapId)&&!zpBeat(p.ac,DIF(),cm)?1:0}}
function zpEarn(p,win,k){const base=wave*(+BPG.zw||0)+(k||0)*(+BPG.zk||0)+(win?+BPG.zc||0:0),m=zpMul(),h=zpHard(),full=base*m*h,run=Math.round(full*cl(BPG.rep,0,100)/100),fc=win&&p.fc0?Math.max(0,Math.round(full)-run):0;
 return{base,m,h,run,fc,tot:run+fc,s:secOf(mapId),win:!!win,nx:GMD=='c'&&!win&&!!p.fc0}}
// the end screen line under the totals
function zpNote(z){if(!z)return '';const bits=[];if(z.s>=0&&z.m!=1)bits.push(edEsc(SEC[z.s]?SEC[z.s].n:'Section')+' ×'+z.m);if(z.h!=1)bits.push('Hard ×'+z.h);
 const fc=z.fc?`<span class=zpfc>${nxi('check',14)}FIRST CLEAR BONUS <b>+${nxN(z.fc)}</b></span>`:z.nx?'<span class=zpnx>Beat this map for a first clear bonus</span>':'';
 return `<div class=zpn><span>Run <b>+${nxN(z.run)}</b>${bits.length?' · '+bits.join(' · '):''}</span>${fc}</div>`}
var ZPR=null;
// ---------- Scrap (the money inside a level; it was cash) ----------
Object.assign(NXI,{scrap:'<path fill="currentColor" stroke="none" fill-rule="evenodd" d="M7.5 3.2h9l4.5 8.8-4.5 8.8h-9L3 12zM15.3 12a3.3 3.3 0 1 0-6.6 0a3.3 3.3 0 1 0 6.6 0z"/>',
 bench:'<path d="M3 10h18"/><path d="M5 10v9M19 10v9M5 15h14"/><path d="M8 10V6l3-2 3 2v4"/>',bp:'<path d="M4 5h12l4 4v10H4z"/><path d="M16 5v4h4"/><path d="M8 13h8M8 16h5"/>'});
// a Scrap amount in menus: the nut icon comes from CSS (.scr::before), so the markup stays short
function scr(n){return `<span class=scr>${nxN(n)}</span>`}
function scrNut(x,y,r,c){X.save();X.fillStyle=c;X.beginPath();for(let k=0;k<6;k++){const a=k*Math.PI/3;X.lineTo(x+Math.cos(a)*r,y+Math.sin(a)*r*.92)}X.closePath();X.moveTo(x+r*.42,y);X.arc(x,y,r*.42,0,Math.PI*2,true);X.fill('evenodd');X.restore()}
