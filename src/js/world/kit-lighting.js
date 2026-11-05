//# world/kit-lighting.js — Time-of-day lighting for custom maps: day, sunrise, morning, dusk, night or lights only (no sun or moon) with an amount (0–100%), drawn over the world every frame, with light cut out around lamps, light effects, fires, sirens, glows, lit windows, and areas and paths that give light (tents, string lights, the stadium's exit lights); the same drawing previews it in the editor and darkens map thumbnails
// ---------- time of day ----------
// A map's d.lt = {t: 'day' | 'sunrise' | 'morning' | 'dusk' | 'night' | 'dark', a: 0..1} (file: "lighting": {"time", "amount"}). The world is multiplied
// by a light map: the time's colour (mixed with white by the amount), plus light pools added around every light source.
// lit is how strongly the light sources show through at that time (none by day, fully at night).
const CMLT=[
{id:'day',n:'Day',d:'Bright midday sun; more adds warm sunlight.',mul:'#fff1d6',scr:'255,244,214',sa:.14,lit:0,def:.5},
{id:'sunrise',n:'Sunrise',d:'The sun just up: low golden light, long cool shadows, the last lamps still on.',mul:'#e8b080',scr:'255,186,96',sa:.2,lit:.4,def:.6},
{id:'morning',n:'Morning',d:'Soft, warm early light with a haze.',mul:'#e6c2ae',scr:'255,226,196',sa:.12,lit:.3,def:.6},
{id:'dusk',n:'Dusk',d:'Orange-pink evening light.',mul:'#b0645a',lit:.8,def:.7},
{id:'night',n:'Night',d:'Dark blue night.',mul:'#10173c',lit:1,def:.75},
{id:'dark',n:'Lights only',d:'No sun and no moon: only the lights light anything.',mul:'#0c0c12',lit:1,def:.85}];
const CMLTI=Object.create(null);for(const p of CMLT)CMLTI[p.id]=p;
function cmLtP(id){return typeof id=='string'&&cmOwn(CMLTI,id)?CMLTI[id]:null}
function cmLtDef(id){const p=cmLtP(id);return p?p.def:.75}
// light sources a map's things give off: props (street and lot lamps, candles, lanterns, fireplaces), light effects, lit-window decals
// {x, y, r radius, c colour, i strength, f how it moves ('flk' flicker, 'fire', 'flare', 'glow', 'blink', 'siren', 'fault', 'sweep': a
// beam turning back and forth by sa either side of ca0, 'weld': a welding arc's bursts), ph phase, gs how strong its glow (bloom)
// is (1 when left out), ng 1 = no glow at all (wide work lights whose pools would only wash each other out)}
const CMLP={lamp:[0,-6,90,'#ffe2a8',1],plight:[0,-6,130,'#f4f0ff',1],candle:[0,-8,44,'#ffb040',1,'flk'],lantern:[0,-10,62,'#ffd27a',1,'flk'],bfplace:[0,-6,70,'#ff9a3a',1,'fire'],tlight:[0,-30,22,'#9aff9a',.5],flamp:[0,-8,60,'#ffe6a0',.9],exitsign:[0,-4,40,'#3fd25a',.7],firebarrel:[0,-6,90,'#ff9a3a',1,'fire'],cdl:[0,-36,76,'#ffb040',1,'flk'],fplace:[0,-14,104,'#ff9a3a',1,'fire'],sconce:[0,-20,88,'#ffb040',1,'flk'],mtable:[-9,-40,132,'#ffb040',1,'flk']};
function cmLtTurn(o,dx,dy){if(!o.r)return[o.x+dx,o.y+dy];const a=o.r*Math.PI/180,c=Math.cos(a),s=Math.sin(a);return[o.x+dx*c-dy*s,o.y+dx*s+dy*c]}
function cmLightSrc(d){const L=[];for(const o of d.obj){const ph=cmH(o.x,o.y,9)*6.283;
if(o.fx){const s=cl(+o.sc||1,.25,4),c=cmCol(o.c,'');switch(o.fx){
case'light':L.push({x:o.x,y:o.y,r:80*s,c:c||'#ffd27a',i:1});break;
case'flicker':L.push({x:o.x,y:o.y,r:46*s,c:c||'#ffb040',i:.95,f:'flk',ph});break;
case'fire':L.push({x:o.x,y:o.y-6*s,r:95*s,c:'#ff9a3a',i:1,f:'fire',ph});break;
case'flare':L.push({x:o.x,y:o.y,r:60*s,c:'#ff4a2a',i:.9,f:'flare',ph});break;
case'glow':L.push({x:o.x,y:o.y,r:34*s,c:c||'#8ae8ff',i:.8,f:'glow',ph});break;
case'wisp':L.push({x:o.x,y:o.y,r:70*s,c:c||'#9affe8',i:.35,f:'glow',ph});break;
case'headlights':for(const k of[-1,1]){const p=cmLtTurn(o,38*s,k*11*s);L.push({x:p[0],y:p[1],r:150*s,c:'#fff2cc',i:.85,cw:22*Math.PI/180,ca:(o.r||0)*Math.PI/180});const q=cmLtTurn(o,-38*s,k*12*s);L.push({x:q[0],y:q[1],r:24*s,c:'#ff2a1a',i:.7})}break;
case'hazard':for(const dx of[-10,10]){const p=cmLtTurn(o,dx*s,0);L.push({x:p[0],y:p[1],r:34*s,c:'#ffa62a',i:.9,f:'blink',ph:cmR(o,0,64)})}break;
case'siren':{const m=po(o,'m','police'),P=m=='police'?[['#ff2a2a',0],['#3a7aff',1]]:m=='amb'?[['#ff2a2a',2],['#ff2a2a',3]]:[['#ff2a2a',0],['#ffffff',4]];for(let k=0;k<2;k++){const p=cmLtTurn(o,(k?8:-8)*s,0);L.push({x:p[0],y:p[1],r:58*s,c:P[k][0],i:1,f:'siren',sd:P[k][1],ph:cmR(o,0,63)})}break}
default:{const F=CMFXI[o.fx];if(F&&F.lts)F.lts(o,s,ph,L)}}continue}
if(o.dc){if(o.dc=='lightpatch'){const s=cl(+o.sc||1,.25,4);L.push({x:o.x,y:o.y,r:34*s,c:cmCol(o.c,'#ffd27a'),i:.75})}
if(o.dc=='sunbeam'){const s=cl(+o.sc||1,.25,4);L.push({x:o.x,y:o.y,r:52*s,c:cmCol(o.c,'#ffcf8a'),i:.7,ng:1})}
// stained-glass light: soft coloured light, two panes' worth
else if(o.dc=='stainedglass'){const s=cl(+o.sc||1,.25,4),C=['#ff5a5a','#5a8aff','#ffd84a','#5aff8a','#c85aff'],k=Math.floor((o.v||0)*5);for(const j of[0,1]){const p=cmLtTurn(o,(j?12:-12)*s,0);L.push({x:p[0],y:p[1],r:34*s,c:C[(k+j*2)%5],i:.55})}}continue}
if(o.veh)continue;const P=CMLP[o.k];if(P){const p=cmLtTurn(o,P[0],P[1]);L.push({x:p[0],y:p[1],r:P[2],c:P[3],i:P[4],f:P[5],ph});continue}
// light props (spot lights, flood lights…): each lamp head is a beam (w = half its width in degrees; 0 = all round) aimed the way the prop is turned
const B=cmOB(o.k);if(B&&B.lt){const c=cmCol(o.c,B.pc?B.pc[0][0]:'#fff2c8');for(const h of B.lt){const p=B.nr?[o.x+h.dx,o.y+h.dy]:cmLtTurn(o,h.dx,h.dy),s={x:p[0],y:p[1],r:h.r,c:h.c||c,i:h.i||1,ph};if(h.f)s.f=h.f;if(h.gs)s.gs=h.gs;if(h.ng)s.ng=1;if(h.w){s.cw=h.w*Math.PI/180;s.ca=((o.r||0)+90+(h.a||0))*Math.PI/180;if(h.sw){s.f='sweep';s.ca0=s.ca;s.sa=h.sw*Math.PI/180}}L.push(s)}}}
// room lights: an area that lights its whole box (a room with the lights on), with a soft spill past its edges
for(const a of d.areas||[]){const T_=cmArea(a.a);if(T_&&T_.lts)T_.lts(a,L);if(a.a!='roomlight')continue;const s_=cl(+((a.o||{}).s??1)||1,.3,1.5);L.push({rect:[a.x,a.y,a.w,a.h],x:a.x+a.w/2,y:a.y+a.h/2,r:Math.hypot(a.w,a.h)/2+24,c:cmCol(a.c,'#fff2c8'),i:s_,ph:0})}
// paths that give light (string lights)
for(const l of d.paths||[]){const T_=cmPath(l.p);if(T_&&T_.lts)T_.lts(l,L)}
// walls block light: each source keeps the outline of what it can see (vis), worked out once here; L.O keeps the walls for lights that move
const O=cmLtBlk(d);for(const s of L)s.vis=s.cw&&!s.sa?cmLtVis(O,s.x,s.y,s.r,s.ca-s.cw*1.45,s.ca+s.cw*1.45):cmLtVis(O,s.x,s.y,s.r);L.O=O;return L}
// ---------- walls block light ----------
// What stops light: solid walls (not windows, glass, fences, bars, hedges or invisible blockers) and solid buildings (roofs, the stadium).
// Kept in a grid of 128 px cells so a light only looks at the walls near it.
function cmLtBlk(d){const R=[];for(const w of d.walls||[]){const s=CMWI[w.s]||CMWI.wall;if(w.w>0&&w.h>0&&s.fl===0&&!s.lp&&cmSolid(w,'w'))R.push([w.x,w.y,w.w,w.h])}
for(const a of d.areas||[])if(a.a=='roof'||a.a=='stadium')for(const b of cmAreaBoxes(a))if(b[4]!==2)R.push([b[0],b[1],b[2],b[3]]);
const G=new Map(),C=128;R.forEach((r,i)=>{for(let j=Math.floor(r[1]/C);j<=Math.floor((r[1]+r[3])/C);j++)for(let k=Math.floor(r[0]/C);k<=Math.floor((r[0]+r[2])/C);k++){const q=k+','+j,a=G.get(q);if(a)a.push(i);else G.set(q,[i])}});
return{R,G,C,m:new Uint32Array(R.length),st:0}}
// The outline a light at x,y with reach r can see past the walls: rays to every wall corner near it (and just either side of it)
// and round the edge, each stopped a few pixels into the first wall it meets (so the lit face of a wall shows lit).
// a0..a1 limits it to a beam (the outline then starts at the lamp). 0 = no wall in reach (nothing to cut). A light inside a wall
// (a lamp fixed on it) isn't stopped by that wall.
function cmLtVis(O,x,y,r,a0,a1){if(!O||!O.R.length||!(r>0))return 0;const C=O.C,st=++O.st,S=[];
for(let j=Math.floor((y-r)/C);j<=Math.floor((y+r)/C);j++)for(let k=Math.floor((x-r)/C);k<=Math.floor((x+r)/C);k++){const a=O.G.get(k+','+j);if(!a)continue;
 for(const i of a){if(O.m[i]===st)continue;O.m[i]=st;const[rx,ry,rw,rh]=O.R[i];if(x>=rx&&x<=rx+rw&&y>=ry&&y<=ry+rh)continue;
  const nx=cl(x,rx,rx+rw),ny=cl(y,ry,ry+rh);if((nx-x)*(nx-x)+(ny-y)*(ny-y)>=r*r)continue;
  // only the faces turned towards the light can stop it first: [0 upright | 1 flat, line, from, to]
  if(x<rx)S.push(0,rx,ry,ry+rh);else if(x>rx+rw)S.push(0,rx+rw,ry,ry+rh);if(y<ry)S.push(1,ry,rx,rx+rw);else if(y>ry+rh)S.push(1,ry+rh,rx,rx+rw)}}
if(!S.length)return 0;const TW=6.283185307179586,full=a0==null,N=Math.max(24,Math.min(96,Math.round(r/8))),A=[];
if(full)for(let i=0;i<N;i++)A.push(i/N*TW-Math.PI);else{const n=Math.max(4,Math.ceil((a1-a0)/TW*N));for(let i=0;i<=n;i++)A.push(a0+(a1-a0)*i/n)}
const add=(px,py)=>{let a=Math.atan2(py-y,px-x);if(!full){while(a<a0)a+=TW;while(a>a0+TW)a-=TW;if(a>a1)return}for(const e of[-1e-4,0,1e-4]){const b=a+e;if(full||(b>=a0&&b<=a1))A.push(b)}};
for(let i=0;i<S.length;i+=4){if(S[i]===0){add(S[i+1],S[i+2]);add(S[i+1],S[i+3])}else{add(S[i+2],S[i+1]);add(S[i+3],S[i+1])}}
A.sort((p,q)=>p-q);const P=full?[]:[x,y];
for(const a of A){const c=Math.cos(a),s=Math.sin(a);let t=r,hit=0;
 for(let i=0;i<S.length;i+=4){const L_=S[i+1],lo=S[i+2],hi=S[i+3];let u;if(S[i]===0){if(c>-1e-9&&c<1e-9)continue;u=(L_-x)/c;if(u>0&&u<t){const w=y+s*u;if(w>=lo&&w<=hi){t=u;hit=1}}}else{if(s>-1e-9&&s<1e-9)continue;u=(L_-y)/s;if(u>0&&u<t){const w=x+c*u;if(w>=lo&&w<=hi){t=u;hit=1}}}}
 if(hit)t=Math.min(r,t+3);P.push(x+c*t,y+s*t)}
return P}
// clip q to a light's outline V (plus its room box R for room lights: their room is always lit, only the spill is cut)
function cmLtClip(q,V,R){q.beginPath();q.moveTo(V[0],V[1]);for(let i=2;i<V.length;i+=2)q.lineTo(V[i],V[i+1]);q.closePath();
if(R){q.moveTo(R[0],R[1]);q.lineTo(R[0]+R[2],R[1]);q.lineTo(R[0]+R[2],R[1]+R[3]);q.lineTo(R[0],R[1]+R[3]);q.closePath()}q.clip()}
// how bright a source is now (0..1); st=1: a still picture (editor, thumbnails) where everything is on
function cmLtNow(s,t,st){if(st)return s.f=='glow'?.85:1;switch(s.f){// fault: a failing bulb or tube: steady, then every 3.5–9 s (its own rhythm) it stutters off and on for under a second
case'fault':{const P=3.5+(s.ph/6.283)*5.5,u=(t+s.ph*7)%P;if(u>.85)return 1;return cmH(Math.floor(u*16),s.ph*100,77)<.5?.08:1}
case'sweep':s.ca=s.ca0+Math.sin(t*.5+s.ph)*s.sa;return 1;
case'flk':return .8+.2*Math.sin(t*11+s.ph)*Math.sin(t*7.3+s.ph*1.7);case'fire':return .86+.1*Math.sin(t*13+s.ph)+.04*Math.sin(t*31+s.ph);
case'flare':return .78+.22*Math.random();case'weld':return fdWeld(s.ph,t);case'glow':return .6+.4*Math.sin(t*1.7+s.ph);case'blink':return((t*1.3+s.ph)%1)<.5?1:0;
case'siren':{const k=Math.floor(t*6+s.ph*6)%4;return(s.sd==0?k<2:s.sd==1?k>=2:s.sd==2?k%2==0:s.sd==3?k%2==1:Math.floor(t*9+s.ph*9)%3==0)?1:0}default:return 1}}
function cmLtMix(c,a){const n=parseInt(c.slice(1),16),m=x=>Math.round(255-(255-x)*a);return'rgb('+m(n>>16)+','+m(n>>8&255)+','+m(n&255)+')'}
function cmLtRGB(c){const n=parseInt((cmCol(c,'#ffffff')).slice(1),16);return[n>>16,n>>8&255,n&255]}
// can this browser multiply? (all current ones can; without it the map simply shows in daylight)
let CMLTOK=null;
function cmLtOK(){if(CMLTOK===null){try{const q=document.createElement('canvas').getContext('2d');q.globalCompositeOperation='multiply';CMLTOK=q.globalCompositeOperation==='multiply'}catch(e){CMLTOK=false}}return CMLTOK}
let CMLC=null;
// draw the lighting of lt with light sources L over the world box (wx,wy,ww,wh) of G, whose transform maps the world;
// res = light-map pixels per world pixel (light is soft, so a quarter to a half is plenty); t = seconds; st = still picture
// one light source into the light map q (world transform set, adding with 'lighter'); n = how bright it is now. Returns its glow (or null)
function cmLtOne(q,s,k,n,L){const r=s.r*(s.f=='flk'||s.f=='fire'?(.9+.1*n):1),C=cmLtRGB(s.c),m=x=>Math.round(x+(255-x)*.45),al=Math.min(1,k*s.i*n*1.15),gr=q.createRadialGradient(s.x,s.y,0,s.x,s.y,r);
gr.addColorStop(0,'rgba('+m(C[0])+','+m(C[1])+','+m(C[2])+','+al+')');gr.addColorStop(.45,'rgba('+m(C[0])+','+m(C[1])+','+m(C[2])+','+al*.55+')');gr.addColorStop(1,'rgba('+C[0]+','+C[1]+','+C[2]+',0)');q.fillStyle=gr;
// walls: lights that don't move have their outline already; players' lights and fires get theirs now
const V=s.vis!==undefined?s.vis:L.O?cmLtVis(L.O,s.x,s.y,r):0;if(V){q.save();cmLtClip(q,V,s.rect)}
if(s.rect){const[rx,ry,rw,rh]=s.rect;q.fillStyle='rgba('+m(C[0])+','+m(C[1])+','+m(C[2])+',1)';for(const[pd,f]of[[22,.12],[12,.16],[5,.22],[0,1]]){q.globalAlpha=Math.min(1,al*f);q.fillRect(rx-pd,ry-pd,rw+pd*2,rh+pd*2)}q.globalAlpha=1;if(V)q.restore();return null}
if(s.cw){for(const[k2,a2]of[[1.45,.4],[1,1]]){q.globalAlpha=a2;q.beginPath();q.moveTo(s.x,s.y);q.arc(s.x,s.y,r,s.ca-s.cw*k2,s.ca+s.cw*k2);q.closePath();q.fill()}q.globalAlpha=1}else q.fillRect(s.x-r,s.y-r,r*2,r*2);if(V)q.restore();return s.pl?null:[s,C,n,s.cw?Math.min(r,60):r,V]}
// a soft coloured glow round a light (drawn over the world with 'lighter'), stronger the darker it is; only once it is fairly dark
// (light strength k over 0.5: at dusk it would be too faint to see, and it costs a full-screen blend)
function cmLtGlow(G,e,k){const[s,C,n,r,V]=e,R=r*.6,gr=G.createRadialGradient(s.x,s.y,0,s.x,s.y,R);gr.addColorStop(0,'rgba('+C[0]+','+C[1]+','+C[2]+','+Math.min(1,.2*k*s.i*n*(s.gs||1)).toFixed(3)+')');gr.addColorStop(1,'rgba('+C[0]+','+C[1]+','+C[2]+',0)');G.fillStyle=gr;if(V){G.save();cmLtClip(G,V)}G.fillRect(s.x-R,s.y-R,R*2,R*2);if(V)G.restore()}
// K (optional, the game's): the lights that never change, already drawn into pictures of the whole map (cmLtCache); L is then only the rest
function cmLightPaint(G,lt,L,wx,wy,ww,wh,res,t,st,K){const P_=lt&&cmLtP(lt.t),a=lt?cl(+lt.a||0,0,1):0;if(!P_||a<=0||!G||!cmLtOK())return 0;
const w=Math.max(1,Math.ceil(ww*res)),h=Math.max(1,Math.ceil(wh*res));if(!CMLC)CMLC=document.createElement('canvas');if(CMLC.width!==w)CMLC.width=w;if(CMLC.height!==h)CMLC.height=h;const q=CMLC.getContext('2d');if(!q)return 0;
const fl=lt.st&&!st?cmStorm(t)[0]:0;q.setTransform(1,0,0,1,0,0);q.globalCompositeOperation='source-over';q.globalAlpha=1;q.fillStyle=cmLtMix(P_.mul,a*(1-.85*fl));q.fillRect(0,0,w,h);const k=P_.lit*a,on=[];
if(k>.02){q.globalCompositeOperation='lighter';q.setTransform(res,0,0,res,-wx*res,-wy*res);if(K)q.drawImage(K.cv,wx*K.res,wy*K.res,ww*K.res,wh*K.res,wx,wy,ww,wh);
 for(const s of L){const n=cmLtNow(s,t,st);if(n<=0||s.x<wx-s.r||s.x>wx+ww+s.r||s.y<wy-s.r||s.y>wy+wh+s.r)continue;const e=cmLtOne(q,s,k,n,L);if(e)on.push(e)}}
G.save();try{G.globalCompositeOperation='multiply';G.globalAlpha=1;G.imageSmoothingEnabled=true;G.drawImage(CMLC,0,0,w,h,wx,wy,ww,wh);
if(P_.scr){G.globalCompositeOperation='screen';G.fillStyle='rgba('+P_.scr+','+(P_.sa*a*(1-fl)).toFixed(3)+')';G.fillRect(wx,wy,ww,wh)}if(fl>0){G.globalCompositeOperation='screen';G.fillStyle='rgba(200,215,255,'+(.3*fl).toFixed(3)+')';G.fillRect(wx,wy,ww,wh)}
if(k>.5){G.globalCompositeOperation='lighter';if(K&&K.gv){if(K.gr){for(const q_ of K.gr){const x0=Math.max(wx,q_[0]),y0=Math.max(wy,q_[1]),x1=Math.min(wx+ww,q_[2]),y1=Math.min(wy+wh,q_[3]);if(x1>x0&&y1>y0)G.drawImage(K.gv,x0*K.res,y0*K.res,(x1-x0)*K.res,(y1-y0)*K.res,x0,y0,x1-x0,y1-y0)}}else G.drawImage(K.gv,wx*K.res,wy*K.res,ww*K.res,wh*K.res,wx,wy,ww,wh)}for(const e of on)if(!e[0].ng)cmLtGlow(G,e,k)}}
finally{G.restore()}return 1}
// lights that never change (no flicker, blink or siren; not a player's) are drawn once, light and glow, into two pictures of the
// whole map (at most 2048 px across); each frame copies its part of them and adds only the others
function cmLtStill(s){return!s.f&&!s.pl}
function cmLtCache(T,res){const P_=cmLtP(T.t),k=P_?P_.lit*cl(+T.a||0,0,1):0;if(k<=.02||typeof document=='undefined')return null;const r=Math.min(res,2048/Math.max(WW,WH)),key=r+':'+WW+'x'+WH;if(T.K&&T.K.key===key)return T.K;
const w=Math.max(1,Math.ceil(WW*r)),h=Math.max(1,Math.ceil(WH*r)),mk=()=>{const c=document.createElement('canvas');c.width=w;c.height=h;return c},cv=mk(),gv=k>.5?mk():null,q=cv.getContext('2d'),g=gv&&gv.getContext('2d');if(!q||(gv&&!g))return null;
q.setTransform(r,0,0,r,0,0);q.globalCompositeOperation='lighter';if(g){g.setTransform(r,0,0,r,0,0);g.globalCompositeOperation='lighter'}
let gr=[];for(const s of T.L){if(!cmLtStill(s))continue;const e=cmLtOne(q,s,k,1,T.L);if(e&&g&&!s.ng){cmLtGlow(g,e,k);const R=e[3]*.6+2;gr.push([s.x-R,s.y-R,s.x+R,s.y+R])}}
// where the still glows are, as boxes that don't overlap (each frame copies just those, not the whole screen, when there are few)
for(let m=1;m;){m=0;for(let i=0;i<gr.length&&!m;i++)for(let j=i+1;j<gr.length;j++){const a=gr[i],b=gr[j];if(a[0]<b[2]&&b[0]<a[2]&&a[1]<b[3]&&b[1]<a[3]){gr[i]=[Math.min(a[0],b[0]),Math.min(a[1],b[1]),Math.max(a[2],b[2]),Math.max(a[3],b[3])];gr.splice(j,1);m=1;break}}}
if(gr.length>48)gr=null;return T.K={key,cv,gv,gr,res:r,dyn:T.L.filter(s=>!cmLtStill(s))}}
// what cmBuild keeps for the game: HS.LT = {t, a, L}
function cmLightData(d){const p=d.lt&&cmLtP(d.lt.t);if(!p||!(+d.lt.a>0))return null;const T={t:d.lt.t,a:cl(+d.lt.a,0,1),L:cmLightSrc(d)};if(d.lt.st)T.st=1;return T}
// a lightning storm (lighting.storm): every 16 s or so (a quarter of them skipped) a strike: a white flash, a flicker, a second flash
// fading over a second. Returns [how bright the flash is now 0..1, which strike, when it starts]; thunder follows 0.5–2.5 s later
function cmStorm(t){const P=16,n=Math.floor(t/P),s=n*P+cmH(n,7,101)*(P-3);if(cmH(n,8,102)<.25)return[0,n,s];const u=t-s;if(u<0||u>1.2)return[0,n,s];
return[u<.07?1:u<.16?.15:u<.26?.8:Math.max(0,.8*(1-(u-.26)/.9)),n,s]}
function cmLtOn(){return!!(HS&&HS.LT&&HS.CM&&cmLtOK())}
// the game: called from drawW in world space (after everything in the world, before the aim marker and the HUD).
// Burning ground and fireballs light up too, and so do the Fire Hose's flame and burning zombies (fhLights) and Ken's lightning (knLights). (Players carry no light of their own: the glow round them was taken out.)
function cmLight(){const T=HS.LT;if(!T||!HS.CM)return;const sx=Math.round(cam.x),sy=Math.round(cam.y),res=LMX?.25:.5,K=cmLtCache(T,res),S=(K?K.dyn:T.L).slice();S.O=T.L.O;
for(const q of fr)S.push({x:q.x,y:q.y,r:80,c:'#ff9a3a',i:1,f:'fire',ph:q.x});for(const e of ep)if(e.k==3)S.push({x:e.x,y:e.y,r:40,c:'#ff7a2a',i:1});if(typeof fhLights=='function')fhLights(S);if(typeof knLights=='function')knLights(S);
const now=performance.now()/1000;if(T.st){const[,n,s]=cmStorm(now);if(n!==T.sn&&now>=s){T.sn=n;if(cmH(n,8,102)>=.25)T.th=s+.5+cmH(n,9,103)*2}if(T.th&&now>=T.th){T.th=0;if(typeof sfx=='function')sfx('thunder',null,null,.9)}}
cmLightPaint(X,T,S,sx,sy,W,H,res,now,0,K)}
