//# world/kit-lighting.js — Time-of-day lighting for custom maps: day, morning, dusk or night with an amount (0–100%), drawn over the world every frame, with light cut out around lamps, light effects, fires, sirens, glows, lit windows and the players; the same drawing previews it in the editor and darkens map thumbnails
// ---------- time of day ----------
// A map's d.lt = {t: 'day' | 'morning' | 'dusk' | 'night', a: 0..1} (file: "lighting": {"time", "amount"}). The world is multiplied
// by a light map: the time's colour (mixed with white by the amount), plus light pools added around every light source.
// lit is how strongly the light sources show through at that time (none by day, fully at night).
const CMLT=[
{id:'day',n:'Day',d:'Bright midday sun; more adds warm sunlight.',mul:'#fff1d6',scr:'255,244,214',sa:.14,lit:0,def:.5},
{id:'morning',n:'Morning',d:'Soft, warm early light with a haze.',mul:'#e6c2ae',scr:'255,226,196',sa:.12,lit:.3,def:.6},
{id:'dusk',n:'Dusk',d:'Orange-pink evening light.',mul:'#b0645a',lit:.8,def:.7},
{id:'night',n:'Night',d:'Dark blue night.',mul:'#10173c',lit:1,def:.75}];
const CMLTI=Object.create(null);for(const p of CMLT)CMLTI[p.id]=p;
function cmLtP(id){return typeof id=='string'&&cmOwn(CMLTI,id)?CMLTI[id]:null}
function cmLtDef(id){const p=cmLtP(id);return p?p.def:.75}
// light sources a map's things give off: props (street and lot lamps, candles, lanterns, fireplaces), light effects, lit-window decals
// {x, y, r radius, c colour, i strength, f how it moves ('flk' flicker, 'fire', 'flare', 'glow', 'blink', 'siren'), ph phase}
const CMLP={lamp:[0,-6,90,'#ffe2a8',1],plight:[0,-6,130,'#f4f0ff',1],candle:[0,-8,34,'#ffb040',.9,'flk'],lantern:[0,-10,52,'#ffd27a',.95,'flk'],bfplace:[0,-6,70,'#ff9a3a',1,'fire'],tlight:[0,-30,22,'#9aff9a',.5],flamp:[0,-8,60,'#ffe6a0',.9],exitsign:[0,-4,40,'#3fd25a',.7],firebarrel:[0,-6,90,'#ff9a3a',1,'fire']};
function cmLtTurn(o,dx,dy){if(!o.r)return[o.x+dx,o.y+dy];const a=o.r*Math.PI/180,c=Math.cos(a),s=Math.sin(a);return[o.x+dx*c-dy*s,o.y+dx*s+dy*c]}
function cmLightSrc(d){const L=[];for(const o of d.obj){const ph=cmH(o.x,o.y,9)*6.283;
if(o.fx){const s=cl(+o.sc||1,.25,4),c=cmCol(o.c,'');switch(o.fx){
case'light':L.push({x:o.x,y:o.y,r:80*s,c:c||'#ffd27a',i:1});break;
case'flicker':L.push({x:o.x,y:o.y,r:46*s,c:c||'#ffb040',i:.95,f:'flk',ph});break;
case'fire':L.push({x:o.x,y:o.y-6*s,r:95*s,c:'#ff9a3a',i:1,f:'fire',ph});break;
case'flare':L.push({x:o.x,y:o.y,r:60*s,c:'#ff4a2a',i:.9,f:'flare',ph});break;
case'glow':L.push({x:o.x,y:o.y,r:34*s,c:c||'#8ae8ff',i:.8,f:'glow',ph});break;
case'wisp':L.push({x:o.x,y:o.y,r:70*s,c:c||'#9affe8',i:.35,f:'glow',ph});break;
case'hazard':for(const dx of[-10,10]){const p=cmLtTurn(o,dx*s,0);L.push({x:p[0],y:p[1],r:34*s,c:'#ffa62a',i:.9,f:'blink',ph:cmR(o,0,64)})}break;
case'siren':{const m=po(o,'m','police'),P=m=='police'?[['#ff2a2a',0],['#3a7aff',1]]:m=='amb'?[['#ff2a2a',2],['#ff2a2a',3]]:[['#ff2a2a',0],['#ffffff',4]];for(let k=0;k<2;k++){const p=cmLtTurn(o,(k?8:-8)*s,0);L.push({x:p[0],y:p[1],r:58*s,c:P[k][0],i:1,f:'siren',sd:P[k][1],ph:cmR(o,0,63)})}break}}continue}
if(o.dc){if(o.dc=='lightpatch'){const s=cl(+o.sc||1,.25,4);L.push({x:o.x,y:o.y,r:34*s,c:cmCol(o.c,'#ffd27a'),i:.75})}continue}
if(o.veh)continue;const P=CMLP[o.k];if(P){const p=cmLtTurn(o,P[0],P[1]);L.push({x:p[0],y:p[1],r:P[2],c:P[3],i:P[4],f:P[5],ph});continue}
// light props (spot lights, flood lights…): each lamp head is a beam (w = half its width in degrees; 0 = all round) aimed the way the prop is turned
const B=cmOB(o.k);if(B&&B.lt){const c=cmCol(o.c,B.pc?B.pc[0][0]:'#fff2c8');for(const h of B.lt){const p=B.nr?[o.x+h.dx,o.y+h.dy]:cmLtTurn(o,h.dx,h.dy),s={x:p[0],y:p[1],r:h.r,c,i:h.i||1,ph};if(h.w){s.cw=h.w*Math.PI/180;s.ca=((o.r||0)+90+(h.a||0))*Math.PI/180}L.push(s)}}}
// room lights: an area that lights its whole box (a room with the lights on), with a soft spill past its edges
for(const a of d.areas||[]){if(a.a!='roomlight')continue;const s_=cl(+((a.o||{}).s??1)||1,.3,1.5);L.push({rect:[a.x,a.y,a.w,a.h],x:a.x+a.w/2,y:a.y+a.h/2,r:Math.hypot(a.w,a.h)/2+24,c:cmCol(a.c,'#fff2c8'),i:s_,ph:0})}
// walls block light: each source keeps the outline of what it can see (vis), worked out once here; L.O keeps the walls for lights that move
const O=cmLtBlk(d);for(const s of L)s.vis=s.cw?cmLtVis(O,s.x,s.y,s.r,s.ca-s.cw*1.45,s.ca+s.cw*1.45):cmLtVis(O,s.x,s.y,s.r);L.O=O;return L}
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
function cmLtNow(s,t,st){if(st)return s.f=='glow'?.85:1;switch(s.f){case'flk':return .8+.2*Math.sin(t*11+s.ph)*Math.sin(t*7.3+s.ph*1.7);case'fire':return .86+.1*Math.sin(t*13+s.ph)+.04*Math.sin(t*31+s.ph);
case'flare':return .78+.22*Math.random();case'glow':return .6+.4*Math.sin(t*1.7+s.ph);case'blink':return((t*1.3+s.ph)%1)<.5?1:0;
case'siren':{const k=Math.floor(t*6+s.ph*6)%4;return(s.sd==0?k<2:s.sd==1?k>=2:s.sd==2?k%2==0:s.sd==3?k%2==1:Math.floor(t*9+s.ph*9)%3==0)?1:0}default:return 1}}
function cmLtMix(c,a){const n=parseInt(c.slice(1),16),m=x=>Math.round(255-(255-x)*a);return'rgb('+m(n>>16)+','+m(n>>8&255)+','+m(n&255)+')'}
function cmLtRGB(c){const n=parseInt((cmCol(c,'#ffffff')).slice(1),16);return[n>>16,n>>8&255,n&255]}
// can this browser multiply? (all current ones can; without it the map simply shows in daylight)
let CMLTOK=null;
function cmLtOK(){if(CMLTOK===null){try{const q=document.createElement('canvas').getContext('2d');q.globalCompositeOperation='multiply';CMLTOK=q.globalCompositeOperation==='multiply'}catch(e){CMLTOK=false}}return CMLTOK}
let CMLC=null;
// draw the lighting of lt with light sources L over the world box (wx,wy,ww,wh) of G, whose transform maps the world;
// res = light-map pixels per world pixel (light is soft, so a quarter to a half is plenty); t = seconds; st = still picture
function cmLightPaint(G,lt,L,wx,wy,ww,wh,res,t,st){const P_=lt&&cmLtP(lt.t),a=lt?cl(+lt.a||0,0,1):0;if(!P_||a<=0||!G||!cmLtOK())return 0;
const w=Math.max(1,Math.ceil(ww*res)),h=Math.max(1,Math.ceil(wh*res));if(!CMLC)CMLC=document.createElement('canvas');if(CMLC.width!==w)CMLC.width=w;if(CMLC.height!==h)CMLC.height=h;const q=CMLC.getContext('2d');if(!q)return 0;
q.setTransform(1,0,0,1,0,0);q.globalCompositeOperation='source-over';q.globalAlpha=1;q.fillStyle=cmLtMix(P_.mul,a);q.fillRect(0,0,w,h);const k=P_.lit*a,on=[];
if(k>.02){q.globalCompositeOperation='lighter';q.setTransform(res,0,0,res,-wx*res,-wy*res);for(const s of L){const n=cmLtNow(s,t,st);if(n<=0||s.x<wx-s.r||s.x>wx+ww+s.r||s.y<wy-s.r||s.y>wy+wh+s.r)continue;
const r=s.r*(s.f=='flk'||s.f=='fire'?(.9+.1*n):1),C=cmLtRGB(s.c),m=x=>Math.round(x+(255-x)*.45),al=Math.min(1,k*s.i*n*1.15),gr=q.createRadialGradient(s.x,s.y,0,s.x,s.y,r);
gr.addColorStop(0,'rgba('+m(C[0])+','+m(C[1])+','+m(C[2])+','+al+')');gr.addColorStop(.45,'rgba('+m(C[0])+','+m(C[1])+','+m(C[2])+','+al*.55+')');gr.addColorStop(1,'rgba('+C[0]+','+C[1]+','+C[2]+',0)');q.fillStyle=gr;
// walls: lights that don't move have their outline already; players' lights and fires get theirs now
const V=s.vis!==undefined?s.vis:L.O?cmLtVis(L.O,s.x,s.y,r):0;if(V){q.save();cmLtClip(q,V,s.rect)}
if(s.rect){const[rx,ry,rw,rh]=s.rect;q.fillStyle='rgba('+m(C[0])+','+m(C[1])+','+m(C[2])+',1)';for(const[pd,f]of[[22,.12],[12,.16],[5,.22],[0,1]]){q.globalAlpha=Math.min(1,al*f);q.fillRect(rx-pd,ry-pd,rw+pd*2,rh+pd*2)}q.globalAlpha=1;if(V)q.restore();continue}
if(s.cw){for(const[k2,a2]of[[1.45,.4],[1,1]]){q.globalAlpha=a2;q.beginPath();q.moveTo(s.x,s.y);q.arc(s.x,s.y,r,s.ca-s.cw*k2,s.ca+s.cw*k2);q.closePath();q.fill()}q.globalAlpha=1}else q.fillRect(s.x-r,s.y-r,r*2,r*2);if(V)q.restore();if(!s.pl)on.push([s,C,n,s.cw?Math.min(r,60):r,V])}}
G.save();try{G.globalCompositeOperation='multiply';G.globalAlpha=1;G.imageSmoothingEnabled=true;G.drawImage(CMLC,0,0,w,h,wx,wy,ww,wh);
if(P_.scr){G.globalCompositeOperation='screen';G.fillStyle='rgba('+P_.scr+','+(P_.sa*a).toFixed(3)+')';G.fillRect(wx,wy,ww,wh)}
// a soft coloured glow around the lights, stronger the darker it is
if(k>.25&&on.length){G.globalCompositeOperation='lighter';for(const[s,C,n,r,V]of on){const R=r*.6,gr=G.createRadialGradient(s.x,s.y,0,s.x,s.y,R);gr.addColorStop(0,'rgba('+C[0]+','+C[1]+','+C[2]+','+(.2*k*s.i*n).toFixed(3)+')');gr.addColorStop(1,'rgba('+C[0]+','+C[1]+','+C[2]+',0)');G.fillStyle=gr;if(V){G.save();cmLtClip(G,V)}G.fillRect(s.x-R,s.y-R,R*2,R*2);if(V)G.restore()}}}
finally{G.restore()}return 1}
// what cmBuild keeps for the game: HS.LT = {t, a, L}
function cmLightData(d){const p=d.lt&&cmLtP(d.lt.t);if(!p||!(+d.lt.a>0))return null;return{t:d.lt.t,a:cl(+d.lt.a,0,1),L:cmLightSrc(d)}}
function cmLtOn(){return!!(HS&&HS.LT&&HS.CM&&cmLtOK())}
// the game: called from drawW in world space (after everything in the world, before the aim marker and the HUD).
// Every living player carries a soft light so night maps stay playable; burning ground and fireballs light up too.
function cmLight(){const T=HS.LT;if(!T||!HS.CM)return;const sx=Math.round(cam.x),sy=Math.round(cam.y),S=T.L.slice();S.O=T.L.O;const PP=typeof PL!='undefined'&&PL.length?PL:[P];
for(const p of PP)if(p&&alive(p))S.push({x:p.x,y:p.y-10,r:150,c:'#fff2dc',i:.95,pl:1});
for(const q of fr)S.push({x:q.x,y:q.y,r:80,c:'#ff9a3a',i:1,f:'fire',ph:q.x});for(const e of ep)if(e.k==3)S.push({x:e.x,y:e.y,r:40,c:'#ff7a2a',i:1});
cmLightPaint(X,T,S,sx,sy,W,H,LMX?.25:.5,performance.now()/1000,0)}
