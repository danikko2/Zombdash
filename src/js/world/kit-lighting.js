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
const CMLP={lamp:[0,-6,90,'#ffe2a8',1],plight:[0,-6,130,'#f4f0ff',1],candle:[0,-8,34,'#ffb040',.9,'flk'],lantern:[0,-10,52,'#ffd27a',.95,'flk'],bfplace:[0,-6,70,'#ff9a3a',1,'fire'],tlight:[0,-30,22,'#9aff9a',.5],flamp:[0,-8,60,'#ffe6a0',.9]};
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
if(o.veh)continue;const P=CMLP[o.k];if(P){const p=cmLtTurn(o,P[0],P[1]);L.push({x:p[0],y:p[1],r:P[2],c:P[3],i:P[4],f:P[5],ph})}}return L}
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
gr.addColorStop(0,'rgba('+m(C[0])+','+m(C[1])+','+m(C[2])+','+al+')');gr.addColorStop(.45,'rgba('+m(C[0])+','+m(C[1])+','+m(C[2])+','+al*.55+')');gr.addColorStop(1,'rgba('+C[0]+','+C[1]+','+C[2]+',0)');q.fillStyle=gr;q.fillRect(s.x-r,s.y-r,r*2,r*2);if(!s.pl)on.push([s,C,n,r])}}
G.save();try{G.globalCompositeOperation='multiply';G.globalAlpha=1;G.imageSmoothingEnabled=true;G.drawImage(CMLC,0,0,w,h,wx,wy,ww,wh);
if(P_.scr){G.globalCompositeOperation='screen';G.fillStyle='rgba('+P_.scr+','+(P_.sa*a).toFixed(3)+')';G.fillRect(wx,wy,ww,wh)}
// a soft coloured glow around the lights, stronger the darker it is
if(k>.25&&on.length){G.globalCompositeOperation='lighter';for(const[s,C,n,r]of on){const R=r*.6,gr=G.createRadialGradient(s.x,s.y,0,s.x,s.y,R);gr.addColorStop(0,'rgba('+C[0]+','+C[1]+','+C[2]+','+(.2*k*s.i*n).toFixed(3)+')');gr.addColorStop(1,'rgba('+C[0]+','+C[1]+','+C[2]+',0)');G.fillStyle=gr;G.fillRect(s.x-R,s.y-R,R*2,R*2)}}}
finally{G.restore()}return 1}
// what cmBuild keeps for the game: HS.LT = {t, a, L}
function cmLightData(d){const p=d.lt&&cmLtP(d.lt.t);if(!p||!(+d.lt.a>0))return null;return{t:d.lt.t,a:cl(+d.lt.a,0,1),L:cmLightSrc(d)}}
function cmLtOn(){return!!(HS&&HS.LT&&HS.CM&&cmLtOK())}
// the game: called from drawW in world space (after everything in the world, before the aim marker and the HUD).
// Every living player carries a soft light so night maps stay playable; burning ground and fireballs light up too.
function cmLight(){const T=HS.LT;if(!T||!HS.CM)return;const sx=Math.round(cam.x),sy=Math.round(cam.y),S=T.L.slice(),PP=typeof PL!='undefined'&&PL.length?PL:[P];
for(const p of PP)if(p&&alive(p))S.push({x:p.x,y:p.y-10,r:150,c:'#fff2dc',i:.95,pl:1});
for(const q of fr)S.push({x:q.x,y:q.y,r:80,c:'#ff9a3a',i:1,f:'fire',ph:q.x});for(const e of ep)if(e.k==3)S.push({x:e.x,y:e.y,r:40,c:'#ff7a2a',i:1});
cmLightPaint(X,T,S,sx,sy,W,H,LMX?.25:.5,performance.now()/1000,0)}
