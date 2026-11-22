// Zombville City Park (map 12) as a map file, at the owner's request: middle of the day, more detail everywhere, bigger, with a
// dog park, basketball and tennis courts and a skate park added, and a light aftermath (a park left in a hurry). Everything the
// old park had stays: the drive loop and its road graph (the Ice Cream Man drives it), the lot and the food trucks, the fountain
// plaza and restrooms, the playground and splash pad, the picnic grove, the fishing ponds, the gazebo, the skyline.
// Reach, the boss, waves, Free Play, the Workshop copy, the editor pieces.
const ST={};global.LOG=[];const LOG=global.LOG;
const fs=require('fs');const html=fs.readFileSync(process.argv[2],'utf8');
const code=html.slice(html.lastIndexOf('<script>')+8,html.lastIndexOf('</script>'));
global.ImageData=class{constructor(d,w,h){this.data=d}};
const ctx=new Proxy(ST,{get:(t,k)=>k=='getImageData'?(x,y,w,h)=>({data:new Uint8ClampedArray(Math.max(1,w*h*4)).fill(120)}):k=='createImageData'?(w,h)=>({data:new Uint8ClampedArray(w*h*4)}):k=='measureText'?()=>({width:30}):(k=='createRadialGradient'||k=='createLinearGradient'||k=='createPattern')?()=>({addColorStop(){}}):k=='drawImage'?()=>{LOG.push(['drawImage',t.globalCompositeOperation||'source-over'])}:k=='ellipse'?()=>{global.ELL=(global.ELL||0)+1}:k=='rotate'?a=>{LOG.push(['rotate',a])}:(k in t&&typeof t[k]!='function')?t[k]:()=>{},set:(t,k,v)=>{t[k]=v;return true}});
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
S.ac.bp=WP.map((_,i)=>i).filter(i=>WP[i].tr>0);S.ac.bpv=1;docL.pointerdown[0]();endIntro();
{ // in a block, so these names never clash with the game's
const tick=n=>{for(let i=0;i<n;i++){AT_+=.016;NOW_+=16;for(const f of ivs)f();for(let q=TQ.length-1;q>=0;q--)if(TQ[q][0]<=AT_){const g=TQ[q][1];TQ.splice(q,1);g()}loop(NOW_)}};
let fails=0,n=0;const ok=(c,m)=>{n++;if(c)console.log('PASS '+m);else{fails++;console.log('FAIL '+m)}};
const PW=3456,PH=2560;

// ---------- the map file loads ----------
const D=(()=>{const r=cmRead(JSON.stringify(BIMF[12]));ok(r.doc&&!r.errors.length&&!r.warnings.length,'park.json loads with no errors or warnings '+(r.errors||[]).concat(r.warnings||[]).slice(0,3).join('; '));return r.doc})();
{const L=cmLint(D).filter(p=>(p.lv=='err'||p.lv=='warn')&&!/crafting bench/.test(p.m));ok(!L.length,'nothing in the Problems list '+L.map(p=>p.m).slice(0,2).join('; '));
 ok(D.w==108&&D.h==80&&D.id=='builtin-park'&&D.name=='City Park','108×80 tiles (3456×2560 px, up from 2600×2200): grown to fit the new parts');
 ok(D.obj.filter(o=>!o.dc&&!o.fx&&!o.veh&&!o.f).every(o=>cmOB(o.k)),'every prop is a real kit prop');ok(!cmDoorBlocks(D).length,'no prop stands in a doorway')}
const K=k=>D.obj.filter(o=>o.k==k),FX=k=>D.obj.filter(o=>o.fx==k),DC=k=>D.obj.filter(o=>o.dc==k),V=k=>D.obj.filter(o=>o.veh==k),PA=k=>D.paths.filter(p=>p.p==k),AR=k=>D.areas.filter(a=>a.a==k);
const PT=p=>p.pts.map(q=>[p.x+q[0],p.y+q[1]]);
// ---------- the middle of the day ----------
{const P_=cmLtP('day');ok(P_&&/midday/.test(P_.d)&&D.lt&&D.lt.t=='day'&&D.lt.a==.5,'bright midday sun');
 const S_=AR('skyline')[0];ok(S_&&S_.y==0&&S_.w==PW&&S_.o.day==1&&S_.o.wall=='hedge'&&CMAI.skyline.opts.some(o=>o[0]=='day'),'the skyline to the north by day: blue sky, no lit windows, a hedge along its foot');
 let err='',wl=0;const g=new Proxy({},{get:(t,k)=>k=='fillRect'?(x,y,w,h)=>{if(t.fillStyle=='#5a6a4a'&&y>=140&&h>=20&&w>=1000)wl++}:(k in t?t[k]:()=>{}),set:(t,k,v)=>{t[k]=v;return true}});try{CMAI.skyline.f(g,S_)}catch(e){err=e.message}ok(!err&&wl>=1,'by day too the hedge is drawn along the skyline\\'s foot '+err)}
// ---------- the roads and the Ice Cream Man's road graph ----------
const RD=PA('road');
{ok(RD.length==3&&RD.every(p=>p.w==104&&p.o.cl=='dash'),'two-lane park roads: the drive loop, the cross drive and the south road');
 ok(AR('junction').length==3&&AR('zebra').length>=6,'stop signs where the roads meet, zebra crossings where the trails cross');
 const G=D.feats.find(o=>o.f=='roadgraph'),N=G.pts.map(p=>[G.x+p[0],G.y+p[1]]);
 const seg=(x,y)=>{let d=1e9;for(const p of RD){const Q=PT(p);for(let i=1;i<Q.length;i++){const a=Q[i-1],b=Q[i],vx=b[0]-a[0],vy=b[1]-a[1],L=vx*vx+vy*vy,u=L?Math.max(0,Math.min(1,((x-a[0])*vx+(y-a[1])*vy)/L)):0;d=Math.min(d,Math.hypot(a[0]+vx*u-x,a[1]+vy*u-y))}}return d};
 ok(N.length>=20&&N.every(([x,y])=>seg(x,y)<4)&&G.e.every(([a,b])=>{for(let t=.1;t<1;t+=.2)if(seg(N[a][0]+(N[b][0]-N[a][0])*t,N[a][1]+(N[b][1]-N[a][1])*t)>10)return false;return true}),N.length+' road graph nodes and '+G.e.length+' roads, all on the drawn roads');
 ok(D.obj.filter(o=>o.veh).every(o=>seg(o.x,o.y)>40),'no parked car stands on a road the truck drives')}
// ---------- the old park's parts, all still there ----------
{ok(V('ftruck').length==3&&['TACO LOCO','BIG BURGER','PIZZA VAN'].every(t=>V('ftruck').some(v=>v.tx==t))&&K('menuboard').length==3&&K('umb').length>=5&&PA('bulbs').length>=1,'the food trucks, each with its menu board, tables under umbrellas, string lights');
 ok(K('fntn').length==1&&FX('fountain').some(f=>f.x==K('fntn')[0].x&&f.y==K('fntn')[0].y-22)&&AR('plaza').length==1&&K('pstatue').length==1&&K('kiosk').length==1,'the plaza: the fountain, the founder\\'s statue, the park map board');
 ok(D.walls.filter(w=>w.s=='door').length==2&&K('stalls').length==2&&K('wcsign').length==2,'the restrooms, two doors');
 ok(PA('iron').length>=4&&AR('splash').length==1&&K('sptow').length==1&&K('bigjg').length==1&&K('springr').length==4&&K('seesaw').length==2&&K('tireswing').length==1&&K('climbdome').length==1&&K('shadesail').length==2,'the playground: the big climber, swings, the slide, spring riders, seesaws, a tire swing, a climbing dome, shade sails, the splash pad, a fence with three gates');
 ok(K('pavil').length==1&&K('picnic').length>=10&&K('grill').length>=3,'the picnic grove and its pavilion');
 ok(PA('pond').length==2&&AR('dock').length==3&&FX('ducks').length>=3&&K('rod').length>=3&&K('lifering').length==3&&K('gazebo').length==1,'two fishing ponds, three docks, ducks, the gazebo');
 ok(V('sedan').length+V('suv').length+V('hatch').length+V('pickup').length+V('van').length>=15&&AR('parking').length==4,'two parking lots')}
// ---------- the new parts the owner chose ----------
{const T=AR('tennis')[0];ok(T&&T.o.net==1&&cmAreaBoxes(T).length==1&&cmAreaBoxes(T)[0][4]==2&&PA('chain').length>=6&&K('umpchair').length==1&&K('ballcart').length==1,'a tennis court: its net stops people (bullets go over it), a fenced court, the umpire\\'s chair, a ball cart');
 ok(AR('court').length==1&&K('bhoop').length==2&&K('bleach').length==1,'a basketball court: two hoops, bleachers');
 const B=AR('skbowl')[0];ok(B&&B.o.sh=='kidney'&&!cmAreaBoxes(B).length&&['qpipe','funbox','grindrail','skledge','minirmp','kicker','skstairs'].every(k=>K(k).length)&&DC('skateboard').length>=3,'a skate park: a kidney bowl you walk down into, quarter pipes, a fun box, rails, ledges, a mini ramp, kickers, stairs');
 ok(['aframe','dtunnel','weave','dhurdle','tirejump','dogfount','bagdisp'].every(k=>K(k).length)&&K('signboard').some(o=>o.tx=='DOG PARK')&&K('signboard').some(o=>o.tx=='SMALL DOGS')&&DC('dogtoy').length>=9&&DC('pawprints').length>=5&&PA('dirtpatch').length>=6,'a dog park: small and large dogs, the double gate, agility pieces, water, bags, toys, worn ground')}
// ---------- the light aftermath: a park left in a hurry ----------
{ok(V('police').length==2&&FX('siren').length==2&&PA('tape').length==1&&DC('sheetbody').length==1,'two police cruisers, their lights still going; police tape round someone under a sheet');
 ok(K('stroller').filter(o=>o.vr>=.5).length>=2&&DC('picnicset').length>=4&&DC('kite').length>=2&&DC('icecone').length>=3&&K('brolly').length>=2,'dropped picnics, tipped strollers, kites and ice creams left behind');
 ok(DC('deadz').length>=6&&DC('deadz').length<=10&&DC('bullets').length>=6,'a few dead zombies at the edges of the woods, no more: a light touch');
 ok(K('cardsign').some(o=>/STADIUM/.test(o.tx||'')),'a cardboard sign points people to the stadium shelter')}
// ---------- the game builds it ----------
mapId=12;S.mp=12;setGM('f');build();
ok(HS.CM==='builtin-park'&&WW==PW&&WH==PH&&BG.width==WW,'map 12 builds from park.json through the custom-map loader');
ok(MP[12].n=='City Park'&&MUN[12]===13&&MPD[12]&&MPI[12]&&MT[12]&&HS.LT&&HS.LT.t=='day'&&HS.RG&&HS.RG.N.length>=20,'map number 12 keeps its name, its picture and the Ice Cream Man, whose road graph covers the drive');
const cell=(x,y)=>Math.floor(y/gs)*gw+Math.floor(x/gs);
{const F=new Int16Array(gw*gh);bfs(F,HS.px,HS.py);let pk=0;for(let k=0;k<gw*gh;k++)if(!bl[k]&&F[k]<0)pk++;ok(!pk,'no pockets: every open spot can be reached ('+pk+' cells cannot)');
 const at=([x,y])=>!bl[cell(x,y)]&&F[cell(x,y)]>=0,IN={'the restrooms':[1290,520],'the playground':[1580,720],'the splash pad':[2135,950],'the tennis court':[2920,520],'the small dogs\\' side':[450,2360],'the large dogs\\' side':[1000,2420],'the bowl':[2450,1420],'the dock':[700,1420]};
 const bad=Object.keys(IN).filter(k=>!at(IN[k]));ok(!bad.length,'you can walk into '+Object.keys(IN).join(', ')+(bad.length?' — not: '+bad.join(', '):''));
 ok(!at([700,1570])&&!at([1810,1580]),'the ponds are water: nobody walks in them');
 ok(D.spawns.length>=40&&D.spawns.every(p=>at([p.x,p.y])),D.spawns.length+' zombie spawn points round the edges, all on open ground you can reach')}
start();
{const C=HS.CX;ok(C&&C.O.filter(it=>it.o.k=='shadesail'||it.o.k=='pavil').length==3,'in the game the shade sails and the pavilion hang over people');
 let err='';try{for(let t=0;t<6;t+=.35){for(const f of FX('fountain'))CMFXI.fountain.anim&&CMFXI.fountain.anim(f,t);for(const f of FX('siren'))CMFXI.siren.anim(f,t)}}catch(e){err=e.message}ok(!err,'the fountain and the sirens run '+err)}
// ---------- campaign: waves and the Ice Cream Man ----------
const A=S.ac;const RNG=new Set([11,19]);
const play=(w0,w1,lim)=>{const R={spawned:0,reached:0,stuck:0,waves:0,err:'',sk:{}};try{for(let w=w0;w<=w1;w++){if((mode!='play'||!!BRK))nextWave();let t=0;const seen=new Map();
 while((mode=='play'&&!BRK)&&t<lim){for(const p of PL){p.mx=Math.max(p.mx,20);p.hp=p.mx}tick(1);t++;for(const z of zs){if(ZT[z.t].sv)continue;if(!seen.has(z)){seen.set(z,t);R.spawned++}
  const dz=Math.hypot(z.x-P.x,z.y-P.y);if(z.hp>0&&(dz<80||dz<400&&RNG.has(z.t))){R.reached++;hurt(z,z.hp+1,0,0)}else if(z.hp>0&&t-seen.get(z)>5000){R.stuck++;const k=z.t+'@'+Math.round(dz)+'('+Math.round(z.x)+','+Math.round(z.y)+')';R.sk[k]=(R.sk[k]||0)+1;hurt(z,z.hp+1,0,0)}}}
 if((mode=='play'&&!BRK)){toSp=0;for(let q=0;q<4000&&(mode=='play'&&!BRK);q++){for(const z of zs.slice())if(z.hp>0)hurt(z,z.hp+1,0,0);toSp=0;tick(1)}}R.waves++}}catch(e){R.err=e.stack||e.message}return R};
A.un=[0];A.cp=CORD.length;A.tut=1;A.bm=[0,1,2].map(()=>CORD.reduce((v,m)=>m==12?v:v|1<<m,0));S.lm='off';setGM('c');mapId=12;S.mp=12;sel=0;start();ok(mapId===12&&HS.CM==='builtin-park','a campaign run starts in the City Park');
{let R=play(1,3,5000);const R1=R;wave=18;zs=[];toSp=0;mode='shop';const R2=play(19,19,5000);R={spawned:R1.spawned+R2.spawned,reached:R1.reached+R2.reached,stuck:R1.stuck+R2.stuck,waves:R1.waves+R2.waves,err:R1.err||R2.err,sk:Object.assign(R1.sk,R2.sk)};
 ok(!R.err&&R.waves==4&&wave==19,'campaign waves 1–3 and 19 play through the park '+R.err);
 ok(R.spawned>60&&R.stuck<=Math.max(2,R.spawned*.02),'zombies reach the player ('+R.reached+' of '+R.spawned+' reached; '+R.stuck+' slow ones '+JSON.stringify(R.sk)+')')}
{if((mode!='play'||!!BRK))nextWave();const b=zs.find(q=>ZT[q.t].sv);ok(wave==20&&b&&b.ci==13,'wave 20: the Ice Cream Man');
 let near_=0,moved=0;const x0=b.x,y0=b.y;for(let f=0;f<4000&&b&&b.hp>0&&!(near_&&moved);f++){P.mx=Math.max(P.mx,20);P.hp=P.mx;tick(1);if(Math.hypot(b.x-x0,b.y-y0)>200)moved=1;if(Math.hypot(b.x-P.x,b.y-P.y)<500)near_=1}ok(b.rd&&moved&&near_,'he drives his truck round the park roads and finds the player '+[!!b.rd,moved,near_,Math.round(Math.hypot(b.x-P.x,b.y-P.y)),Math.round(b.x),Math.round(b.y)].join(' '));
 let err='';try{tkGround()}catch(e){err=e.message}ok(!err,'his truck\\'s ground layer still draws on map 12 '+err);
 b.ph=2;b.iv=0;hurt(b,1e9,0,0);tick(Math.ceil(6/.016));ok(bBt(A,DIF(),12)&&A.un.includes(13),'beating him wins the map, and he joins')}
// ---------- free play, the Workshop, the editor, the old code ----------
setGM('f');mapId=12;S.mp=12;start();{const R=play(1,1,4000);ok(!R.err&&wave>=1,'a Free Play run plays '+R.err);if((mode!='play'||!!BRK))nextWave();const row=olRow();ok(row&&row.map===12&&row.mode=='f','the leaderboard board is still map 12');over(1)}
{const h=wsBuiltins();ok(h.includes('wsBuiltin(12,1)')&&h.includes('City Park'),'the Workshop lists the City Park under Built-in maps')}
await wsBuiltin(12,0);{const e=CML.find(q=>q.doc&&q.doc.name=='City Park (my copy)'),D2=bimDoc(12);ok(e&&e.doc.obj.length==D2.obj.length&&e.doc.lt.t=='day','EDIT A COPY makes your own copy with every piece, at midday')}
{const NK=['qpipe','funbox','grindrail','skledge','minirmp','kicker','skstairs','bhoop','bleach','umpchair','ballcart','aframe','dtunnel','weave','dhurdle','tirejump','dogfount','bagdisp','springr','seesaw','tireswing','climbdome','shadesail','pbench','ptrash','kiosk','pstatue','pavil','menuboard','icart','lifering','stroller'];
 const ND=['skateboard','tballs','racket','bball','dogtoy','leash','pawprints','picnicset','icecone','kite','hopscotch','chalkart'];
 ok(NK.every(k=>OB[k]&&EDPN[k])&&CMAI.tennis&&CMAI.skbowl&&ND.every(k=>CMDI[k])&&EDCAT.some(c=>c[0]=='sport'&&/skate/i.test(c[1])),'the new pieces are all in the editor');
 const g=document.createElement('canvas').getContext('2d');let err='';for(const k of NK)try{for(const v of[0,.3,.55,.8,.95])OB[k].f(g,100,100,v,'','A|B')}catch(e){err+=k+': '+e.message+' '}
 try{for(const a of[{a:'tennis',x:0,y:0,w:300,h:620,o:{net:1}},{a:'tennis',x:0,y:0,w:620,h:300,o:{net:0}},{a:'skbowl',x:0,y:0,w:380,h:250,o:{sh:'kidney'}},{a:'skbowl',x:0,y:0,w:200,h:140,o:{sh:'oval'}},{a:'skbowl',x:0,y:0,w:200,h:200,o:{sh:'square'}}]){CMAI[a.a].f(g,a);const out=[];if(CMAI[a.a].coll)CMAI[a.a].coll(a,out)}
  for(const k of ND)for(const v of[.1,.4,.7,.95])CMDI[k].f(g,v,pcK('#c0392b'),'')}catch(e){err+='kit: '+e.message}ok(!err,'every piece draws '+err);
 ok(typeof mapPark=='undefined'&&typeof pkAnim=='undefined'&&typeof pkCan=='undefined'&&typeof ftDraw=='undefined','the old City Park map code is gone')}
console.log('TOTAL fails '+fails+' of '+n);
}
`;
const AF=Object.getPrototypeOf(async function(){}).constructor;
new AF('docL','ivs',code+test)(docL,ivs).catch(e=>{console.log('FAIL crashed: '+(e&&e.stack||e));console.log('TOTAL fails 1');process.exitCode=1});
