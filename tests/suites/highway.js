// Deadway Highway (map 8) converted to a map file (src/maps/highway.json) at the owner's request: the same jammed interstate at dusk
// with more lighting (headlights, sirens, hazards, flares, fires), effects, vehicle variety and roadside detail, plus the approved extras:
// tall median light poles (H1), sign gantries over the lanes (H4) and the army roadblock on the right (H2). Reach, campaign, Officer Ray,
// Free Play, the Workshop copy.
const ST={};global.LOG=[];const LOG=global.LOG;
const fs=require('fs');const html=fs.readFileSync(process.argv[2],'utf8');
const code=html.slice(html.lastIndexOf('<script>')+8,html.lastIndexOf('</script>'));
global.ImageData=class{constructor(d,w,h){this.data=d}};
const ctx=new Proxy(ST,{get:(t,k)=>k=='getImageData'?(x,y,w,h)=>({data:new Uint8ClampedArray(Math.max(1,w*h*4)).fill(120)}):k=='createImageData'?(w,h)=>({data:new Uint8ClampedArray(w*h*4)}):k=='measureText'?()=>({width:30}):(k=='createRadialGradient'||k=='createLinearGradient'||k=='createPattern')?()=>({addColorStop(){}}):k=='drawImage'?()=>{LOG.push(['drawImage',t.globalCompositeOperation||'source-over'])}:k=='rotate'?a=>{LOG.push(['rotate',a])}:(k in t&&typeof t[k]!='function')?t[k]:()=>{},set:(t,k,v)=>{t[k]=v;return true}});
const mkEl=()=>({style:{setProperty(){}},dataset:{},innerHTML:'',className:'',classList:{add(){},remove(){},toggle(){},contains(){return false}},getContext:()=>ctx,addEventListener(){},remove(){},querySelector(){return null},querySelectorAll(){return[]},width:0,height:0});
const els={};const docL={};global.document={hidden:false,getElementById:id=>els[id]||(els[id]=mkEl()),createElement:()=>mkEl(),addEventListener(e,f){(docL[e]=docL[e]||[]).push(f)},body:mkEl()};
global.innerWidth=1280;global.innerHeight=800;global.addEventListener=()=>{};global.localStorage={};global.requestAnimationFrame=()=>{};
global.Image=class{constructor(){this.complete=true;this.naturalWidth=1}addEventListener(){}};global.NOW_=0;global.performance={now:()=>global.NOW_};
const P_=()=>({value:0,setValueAtTime(){},linearRampToValueAtTime(){},exponentialRampToValueAtTime(){},setTargetAtTime(){}});
const node=()=>({connect(){},disconnect(){},start(){},stop(){},frequency:P_(),gain:P_(),detune:P_(),Q:P_(),pan:P_(),threshold:P_(),ratio:P_(),type:'',setPeriodicWave(){},buffer:null,loop:false});
global.AT_=0;global.AudioContext=class{constructor(){this.state='running';this.sampleRate=8000;this.destination={}}get currentTime(){return global.AT_}createGain(){return node()}createOscillator(){return node()}createBiquadFilter(){return node()}createBufferSource(){return node()}createStereoPanner(){return node()}createDynamicsCompressor(){return node()}createPeriodicWave(){return{}}createBuffer(c,n){return{getChannelData:()=>new Float32Array(n)}}resume(){}};
const ivs=[];global.setInterval=f=>{ivs.push(f)};global.TQ=[];global.setTimeout=(f,ms)=>{TQ.push([global.AT_+(ms||0)/1000,f]);return TQ.length};global.clearTimeout=()=>{};
global.REQ=require;
const test=`;S.ac.name='Tester';S.ac.cp=8;
docL.pointerdown[0]();endIntro();
{ // in a block, so these names never clash with the game's
const tick=n=>{for(let i=0;i<n;i++){AT_+=.016;NOW_+=16;for(const f of ivs)f();for(let q=TQ.length-1;q>=0;q--)if(TQ[q][0]<=AT_){const g=TQ[q][1];TQ.splice(q,1);g()}loop(NOW_)}};
let fails=0,n=0;const ok=(c,m)=>{n++;if(c)console.log('PASS '+m);else{fails++;console.log('FAIL '+m)}};
const inR=(o,x0,y0,x1,y1)=>o.x>x0&&o.x<x1&&o.y>y0&&o.y<y1;

// ---------- the map file loads ----------
const D=(()=>{const r=cmRead(JSON.stringify(BIMF[8]));ok(r.doc&&!r.errors.length&&!r.warnings.length,'highway.json loads with no errors or warnings '+(r.errors||[]).concat(r.warnings||[]).slice(0,3).join('; '));return r.doc})();
{const L=cmLint(D).filter(p=>p.lv=='err'||p.lv=='warn');ok(!L.length,'nothing in the Problems list '+L.map(p=>p.m).slice(0,2).join('; '));
 ok(D.w==88&&D.h==57&&D.ground=='grass_hwy'&&D.lt&&D.lt.t=='dusk'&&!D.lt.st,'88×57 tiles on the highway verge, at dusk');
 ok(D.obj.filter(o=>!o.dc&&!o.fx&&!o.veh).every(o=>cmOB(o.k)),'every prop is a real kit prop')}
const K=k=>D.obj.filter(o=>o.k==k),V=k=>D.obj.filter(o=>o.veh==k),FX=k=>D.obj.filter(o=>o.fx==k),DC=k=>D.obj.filter(o=>o.dc==k),PA=k=>D.paths.filter(p=>p.p==k);
// ---------- what the owner asked for: the same highway at dusk, more lighting, effects, vehicles and roadside detail ----------
ok(D.obj.filter(o=>o.veh).length>=90&&PA('highway').length==3&&V('trailer').length==1&&V('cab').length==1&&V('fire').length==1&&V('amb').length>=2&&V('hmv').length>=2&&V('mtruck').length>=2,'the jam is still there: the queue, the jackknifed semi, the fire crew and ambulances, the army convoy');
ok(FX('headlights').length>=20&&FX('siren').length>=6&&FX('hazard').length>=20&&FX('flare').length>=6&&FX('fire').length>=1&&FX('smoke').length>=2,'lighting and effects: headlights left on, sirens, hazard blinkers, road flares, the burning car and smoke');
ok(['taxi','hatch','ftruck','limo','bus','semi','van','pickup','suv'].every(k=>V(k).length)&&V('pickup').some(o=>o.ov),'vehicle variety: taxis, hatchbacks, food trucks and the rest, a pickup on its roof');
ok(K('foak').length+K('fpine').length>=80&&K('reflpost').length>=20&&K('milemkr').length==2&&K('callbox').length==2&&K('bbwest').length==1&&K('bbarmy').length==1&&PA('guardrail').length>=10,'surroundings: tree lines, reflector posts, mile markers, call boxes, the two billboards, guard rails');
// ---------- wide outside shoulders (owner's request): more than a semi's width beyond the rumble strip ----------
{const H_=PA('highway').filter(p=>p.o&&p.o.lanes==4);ok(H_.length==2&&H_.every(p=>p.o.shr>=80&&p.o.sh==40&&p.w==364)&&PA('guardrail').filter(p=>p.y==302).length>=4&&PA('guardrail').filter(p=>p.y==1058).length>=5,'the outside shoulders are 84 px (the rumble strip, then over 60 px: a semi is 48 wide), the rails moved out with them')}
// ---------- clearings in the jam to run through (owner's request) ----------
{const box=o=>{const S_=HWV(o.veh),a=(o.r||0)*Math.PI/180,c=Math.abs(Math.cos(a)),n=Math.abs(Math.sin(a));const hw=(S_[0]*c+S_[1]*n)/2,hh=(S_[0]*n+S_[1]*c)/2;return[o.x-hw,o.y-hh,o.x+hw,o.y+hh]};
 const strips=(y0,y1)=>{const B=D.obj.filter(o=>o.veh).map(box).filter(b=>b[3]>y0&&b[1]<y1),F=[];let st=null;for(let x=0;x<=2816;x+=4){const occ=B.some(b=>b[0]<x+2&&b[2]>x-2);if(!occ&&st==null)st=x;if((occ||x==2816)&&st!=null){if(x-st>=120)F.push([st,x]);st=null}}return F};
 const W_=strips(390,630),E_=strips(730,970);ok(W_.length>=4&&E_.length>=4,'clear lanes right across both carriageways, at least 120 px wide: westbound '+W_.length+', eastbound '+E_.length)}
// ---------- H1: tall median light poles, some broken or flickering ----------
{const P_=D.obj.filter(o=>/^hwlight/.test(o.k||''));ok(P_.length==6&&P_.every(o=>Math.abs(o.y-688)<4)&&K('hwlight').length&&K('hwlightf').length&&K('hwlightx').length&&K('hwpoledown').length==1,'H1 six poles on the median (lit, failing, dead) and one knocked flat');
 const L=cmLightSrc(D),near=(x,y,r)=>L.filter(s=>Math.hypot(s.x-x,s.y-y)<r);ok(K('hwlight').every(o=>near(o.x,o.y,60).length>=2)&&K('hwlightx').every(o=>!near(o.x,o.y,60).some(s=>s.r>=200))&&K('hwlightf').every(o=>near(o.x,o.y,60).some(s=>s.f=='fault')),'the lit poles light the lanes, the dead one gives none, the failing one stutters')}
// ---------- H4: sign gantries over the lanes ----------
{const G=K('gantry');ok(G.length==2&&OB.gantry.ov&&G.some(o=>/GRAVEYARD/.test(o.tx)&&/\\*QUARANTINE/.test(o.tx))&&G.some(o=>/ZOMBVILLE/.test(o.tx)&&o.vr<.3),'H4 two gantries: the Graveyard exit with a message board, a westbound one with a crooked sign');
 ok(G.every(o=>o.tx.split(/\\s+\\/\\s+/).length==2)&&G[0].tx.includes('1/2 MILE'),'each carries two signs (a slash with spaces splits them; 1/2 stays one sign)')
 ok(OB.gantry.h>=390&&G.some(o=>Math.abs(o.y-1064)<8)&&G.some(o=>Math.abs(o.y-690)<8),'they stand right across the road: each beam runs from one edge of its carriageway to the other, the signs over the lanes')}
// ---------- H2: the army roadblock on the right side ----------
{const R=o=>o.x>2650;ok(PA('sandbags').filter(p=>p.x>2700).length>=6&&PA('wire').filter(p=>p.x>2700).length>=4&&K('sweeplight').filter(R).length==1&&K('floodlight').filter(R).length==1&&K('rcbarr').length==2&&V('hmv').some(R)&&K('mflag').filter(R).length&&DC('deadz').filter(R).length>=4,'H2 the roadblock across the far right: sandbags, wire, a sweeping searchlight, a flood light, a humvee, the flag, ROAD CLOSED barricades, the dead piled in front');
 ok(D.obj.filter(o=>o.veh&&o.x+60>2640&&o.y<672&&o.y>346).length==0,'the westbound jam stops short of it')}
// ---------- the game builds it ----------
mapId=8;S.mp=8;setGM('f');build();
ok(HS.CM==='builtin-highway'&&WW==2816&&WH==1824&&BG.width==WW,'map 8 builds from highway.json through the custom-map loader');
ok(MP[8].n=='Deadway Highway'&&MUN[8]===9,'map number 8 keeps its name and Officer Ray');
{const T=HS.LT;ok(T&&T.t=='dusk'&&T.L.filter(s=>s.cw).length>=40,'dusk lighting with headlight and flood-light beams');
 const sw=T.L.find(s=>s.f=='sweep');let a0=0,a1=0;if(sw){cmLtNow(sw,0,0);a0=sw.ca;cmLtNow(sw,3,0);a1=sw.ca}ok(sw&&Math.abs(a1-a0)>.1&&Math.abs(sw.ca-sw.ca0)<=sw.sa+1e-9,'the searchlight beam sweeps back and forth')}
start();{const C=HS.CX;ok(C&&C.O.filter(q=>q.o.k=='gantry').length==2,'the gantries hang over people (top layer, see-through while someone is under)')}
// ---------- reach ----------
{const F=new Int16Array(gw*gh);bfs(F,HS.px,HS.py);
const RCH=(x,y)=>{const i0=Math.floor(x/gs),j0=Math.floor(y/gs);for(let r=0;r<=2;r++)for(let j=j0-r;j<=j0+r;j++)for(let i=i0-r;i<=i0+r;i++){const k=j*gw+i;if(k>=0&&k<gw*gh&&!bl[k])return F[k]>=0}return false};
const EDGE=()=>{let e=0,er=0;for(let i=0;i<gw;i++)for(const j of[0,gh-1]){const k=j*gw+i;if(!bl[k]){e++;if(F[k]>=0)er++}}for(let j=0;j<gh;j++)for(const i of[0,gw-1]){const k=j*gw+i;if(!bl[k]){e++;if(F[k]>=0)er++}}return[e,er]};
 const pl={'eastbound lanes':[1475,760],'westbound lanes':[1400,560],'north verge':[1400,200],'south verge west':[600,1400],'south verge east':[2600,1500],'exit ramp':[2420,1700],'behind the roadblock':[2790,440],'the crash gap':[1222,680]};
 const no=Object.keys(pl).filter(k=>!RCH(...pl[k]));ok(!no.length,'every part of the highway can be reached: '+(no.length?'not '+no.join(', '):'both carriageways, both verges, the ramp, the roadblock'));
 const[e,er]=EDGE();ok(e>200&&er>=e*.95,'zombies can walk to the player from the open edges ('+er+' of '+e+')')}
// ---------- playtest: campaign waves and Officer Ray ----------
const A=S.ac;const RNG=new Set([11,19]);
const play=(w0,w1,lim)=>{const R={spawned:0,reached:0,stuck:0,waves:0,err:'',sk:{}};try{for(let w=w0;w<=w1;w++){if(mode!='play')nextWave();let t=0;const seen=new Map();
 while(mode=='play'&&t<lim){for(const p of PL){p.mx=Math.max(p.mx,20);p.hp=p.mx}tick(1);t++;for(const z of zs){if(ZT[z.t].sv)continue;if(!seen.has(z)){seen.set(z,t);R.spawned++}
  const dz=Math.hypot(z.x-P.x,z.y-P.y);if(z.hp>0&&(dz<80||dz<400&&RNG.has(z.t))){R.reached++;hurt(z,z.hp+1,0,0)}else if(z.hp>0&&t-seen.get(z)>5000){R.stuck++;const k=z.t+'@'+Math.round(dz)+'('+Math.round(z.x)+','+Math.round(z.y)+')';R.sk[k]=(R.sk[k]||0)+1;hurt(z,z.hp+1,0,0)}}}
 if(mode=='play'){toSp=0;for(let q=0;q<4000&&mode=='play';q++){for(const z of zs.slice())if(z.hp>0)hurt(z,z.hp+1,0,0);toSp=0;tick(1)}}R.waves++}}catch(e){R.err=e.stack||e.message}return R};
A.un=[0,MUN[0],MUN[3],MUN[1],MUN[14],MUN[15]];A.cp=5;A.tut=1;delete A.bm;S.lm='off';setGM('c');mapId=8;S.mp=8;sel=0;start();ok(mapId===8&&HS.CM==='builtin-highway','a campaign run starts on Deadway Highway');
{let R=play(1,3,5000);const R1=R;wave=18;zs=[];toSp=0;mode='shop';const R2=play(19,19,5000);R={spawned:R1.spawned+R2.spawned,reached:R1.reached+R2.reached,stuck:R1.stuck+R2.stuck,waves:R1.waves+R2.waves,err:R1.err||R2.err,sk:Object.assign(R1.sk,R2.sk)};
 ok(!R.err&&R.waves==4&&wave==19,'campaign waves 1–3 and 19 play through on the highway '+R.err);
 ok(R.spawned>60&&R.stuck<=Math.max(2,R.spawned*.02),'zombies reach the player ('+R.reached+' of '+R.spawned+' reached; '+R.stuck+' slow ones '+JSON.stringify(R.sk)+')')}
{if(mode!='play')nextWave();const b=zs.find(q=>ZT[q.t].sv);ok(wave==20&&b&&b.ci==9,'wave 20: Officer Ray');
 let near_=0;for(let f=0;f<3000&&b&&b.hp>0&&!near_;f++){P.mx=Math.max(P.mx,20);P.hp=P.mx;tick(1);if(Math.hypot(b.x-P.x,b.y-P.y)<300)near_=1}ok(near_,'Officer Ray finds the player through the jam');
 b.ph=2;hurt(b,1e9,0,0);tick(Math.ceil(6/.016));ok(bBt(A,DIF(),8)&&A.un.includes(9),'beating him keeps campaign progress: he joins and the highway counts as beaten')}
// ---------- free play, the Workshop, the old code ----------
setGM('f');mapId=8;S.mp=8;start();{const R=play(1,1,4000);ok(!R.err&&wave>=1,'a Free Play run plays '+R.err);if(mode!='play')nextWave();const row=olRow();ok(row&&row.map===8&&row.mode=='f','the leaderboard board is still map 8');over(1)}
{const h=wsBuiltins();ok(h.includes('wsBuiltin(8,1)')&&h.includes('Deadway Highway'),'the Workshop lists Deadway Highway under Built-in maps')}
await wsBuiltin(8,0);{const e=CML.find(q=>q.doc&&q.doc.name=='Deadway Highway (my copy)'),D2=bimDoc(8);ok(e&&e.doc.obj.length==D2.obj.length&&e.doc.paths.length==D2.paths.length,'EDIT A COPY makes your own copy with every piece')}
{const NK=['hwlight','hwlightf','hwlightx','hwpoledown','gantry','rcbarr','sweeplight','bbwest','bbarmy','milemkr','callbox','reflpost'];ok(NK.every(k=>OB[k]&&EDPN[k])&&CMTI.grass_hwy&&cmFx('headlights'),'the highway pieces are all in the editor');
 ok(typeof mapHighway=='undefined'&&typeof hwAnim=='undefined'&&typeof hwBill=='undefined'&&typeof hwDraw=='function'&&typeof HWV=='function'&&typeof hwCol=='function','the old highway map code is gone; the shared vehicle drawing stays')}
mapId=8;build();ok(HS.CM==='builtin-highway','map 8 is still the built-in Deadway Highway');
console.log('TOTAL fails '+fails+' of '+n);
}
`;
const AF=Object.getPrototypeOf(async function(){}).constructor;
new AF('docL','ivs',code+test)(docL,ivs).catch(e=>{console.log('FAIL crashed: '+(e&&e.stack||e));console.log('TOTAL fails 1');process.exitCode=1});
