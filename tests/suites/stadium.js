// Zombville Stadium (map 17), a new Zombville map at the owner's request: the football stadium after dark, the field turned
// emergency treatment center (triage, wards, surgery and ICU, supplies, the command post, generators, light towers, sleeping rows,
// the shelter, isolation and the morgue), overrun and abandoned; the stands all round, nobody gets into them; lights only.
// Campaign slot, reach, waves, Free Play, the Workshop copy, the editor pieces.
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
docL.pointerdown[0]();endIntro();
{ // in a block, so these names never clash with the game's
const tick=n=>{for(let i=0;i<n;i++){AT_+=.016;NOW_+=16;for(const f of ivs)f();for(let q=TQ.length-1;q>=0;q--)if(TQ[q][0]<=AT_){const g=TQ[q][1];TQ.splice(q,1);g()}loop(NOW_)}};
let fails=0,n=0;const ok=(c,m)=>{n++;if(c)console.log('PASS '+m);else{fails++;console.log('FAIL '+m)}};
const PW=4096,PH=2752;

// ---------- the map file loads ----------
const D=(()=>{const r=cmRead(JSON.stringify(BIMF[17]));ok(r.doc&&!r.errors.length&&!r.warnings.length,'stadium.json loads with no errors or warnings '+(r.errors||[]).concat(r.warnings||[]).slice(0,3).join('; '));return r.doc})();
{const L=cmLint(D).filter(p=>p.lv=='err'||p.lv=='warn');ok(!L.length,'nothing in the Problems list '+L.map(p=>p.m).slice(0,2).join('; '));
 ok(D.w==128&&D.h==86&&D.id=='builtin-stadium'&&D.name=='Zombville Stadium','128×86 tiles (4096×2752 px), Zombville Stadium');
 ok(D.obj.filter(o=>!o.dc&&!o.fx&&!o.veh).every(o=>cmOB(o.k)),'every prop is a real kit prop');ok(!cmDoorBlocks(D).length,'no prop stands in a doorway')}
const K=k=>D.obj.filter(o=>o.k==k),FX=k=>D.obj.filter(o=>o.fx==k),DC=k=>D.obj.filter(o=>o.dc==k),V=k=>D.obj.filter(o=>o.veh==k),PA=k=>D.paths.filter(p=>p.p==k),AR=k=>D.areas.filter(a=>a.a==k);
// ---------- lights only ----------
{const P_=cmLtP('dark');ok(P_&&P_.n=='Lights only'&&P_.lit==1&&!P_.scr&&CMLT.some(p=>p.id=='dark'),'a new time of day: Lights only (no sun and no moon; only the lights light anything)');
 ok(D.lt&&D.lt.t=='dark'&&D.lt.a>=.8&&D.lt.a<=.95&&!D.lt.st,'the stadium is lit by its lights only ('+(D.lt&&D.lt.a)+')');
 const n_=parseInt(P_.mul.slice(1),16),c=[n_>>16,n_>>8&255,n_&255];ok(Math.max(...c)<24&&Math.max(...c)-Math.min(...c)<10,'with nothing lit it is near black, not night blue ('+P_.mul+')');
 const L=cmLightSrc(D),near=(o,r)=>L.filter(s=>Math.hypot(s.x-o.x,s.y-o.y)<r);
 ok(L.length>=150,L.length+' light sources');
 const TW=K('ltower').concat(K('ltowerf'));ok(TW.length>=6&&TW.every(o=>near(o,200).filter(s=>s.cw>0&&s.r>=500).length==2)&&K('ltowerx').length>=1&&K('ltowerd').length==1&&near(K('ltowerd')[0],200).some(s=>s.cw>0),TW.length+' light towers shining their beams over the camp, one dead, one knocked over and still shining along the ground');
 ok(L.filter(s=>s.f=='fault'&&TW.some(o=>Math.hypot(s.x-o.x,s.y-o.y)<200)).length>=2,'two towers are failing: a lamp stutters now and then');
 const BW=AR('bowl')[0],LB=stBowl(BW);ok(LB.V.length>=12&&LB.V.every(v=>L.some(s=>s.c=='#3fd25a'&&Math.hypot(...[s.x-L_(LB,v)[0],s.y-L_(LB,v)[1]])<2)),LB.V.length+' entry tunnels in the stands, a green exit light over each');
 const LT=AR('tent').filter(a=>(a.o||{}).lt!='off');ok(AR('tent').length>=10&&LT.every(a=>L.some(s=>s.rect&&s.rect[0]==a.x+10&&s.rect[1]==a.y+10))&&AR('tent').some(a=>a.o.lt=='off')&&L.filter(s=>s.rect&&s.f=='fault').length>=3,'the tents\\' lights: '+LT.length+' on (some flickering), one dark');
 ok(PA('bulbs').length>=6&&L.filter(s=>s.r==60&&s.c=='#ffd88a').length>=60,'string lights down the main street and over the sleeping rows light the ground under them');
 ok(K('ltbank').length==1&&near(K('ltbank')[0],100).some(s=>s.r>=1400&&s.cw>0)&&K('ltbankx').length>=3,'one of the stadium\\'s light banks still burns on its own emergency power; the others are dark');
 ok(K('vboard').length==1&&near(K('vboard')[0],200).some(s=>s.f=='glow'),'the video board glows')}
function L_(L,v){return L.W[v.s](v.a,v.d1+4)}
// ---------- the stadium: stands all round, nobody gets up into them ----------
const BW=AR('bowl')[0],LB=stBowl(BW);
{ok(BW&&BW.x==0&&BW.y==0&&BW.w==PW&&BW.h==PH&&BW.o.ds==448&&BW.o.de==368&&BW.o.pb==1&&cmSolid(BW,'a'),'the stands go all the way round, solid (448 px deep along the sides, 368 at the ends), a press box along the top');
 const B=cmAreaBoxes(BW);ok(B.length>40&&B.every(b=>b[4]==1),'their collision: '+B.length+' boxes');
 ok(['tw','te','ts'].every(k=>BW.o[k]>=140)&&!BW.o.tn&&Object.keys(LB.TB).length==3,'three tunnels lead out at field level: the vehicle tunnel (west), the teams\\' tunnel (east) and a service tunnel (south)');
 const G=AR('gridiron')[0];ok(G&&G.w==2976&&G.h==1376&&G.tx=='ZOMBVILLE|ZOMBVILLE','a full football field: 120 × 53⅓ yards and its border at 24 px a yard');
 ok(K('goalpost').length==2&&K('goalpost').every(o=>Math.abs(o.y-1376)<10)&&K('pylon').length==8,'goalposts on both end lines, pylons on the end zones\\' corners');
 ok(K('tbench').length>=4&&K('dtable').length>=2&&K('tvcam').length>=2&&K('kicknet').length>=2&&DC('chains').length==1&&PA('line').filter(p=>p.c=='#e0c020').length>=6,'the sidelines: team benches, drinks tables, TV cameras, kicking nets, the chain, the team areas');
 ok(K('vboard').length==1&&K('vboard')[0].y<=260&&OB.vboard.an,'the video board over the press box runs an emergency alert')}
// ---------- the treatment center ----------
{const T=AR('tent'),nm=t=>T.find(a=>a.tx==t);ok(['WARD 1','WARD 2','WARD 3','WARD 4','WARD 5','SURGERY','ICU','SHELTER','ISOLATION','MEDICAL SUPPLIES'].every(nm),'walk-in tents: five wards, surgery, the ICU, the shelter, isolation and the supply tent');
 ok(T.every(a=>CMAI.tent.top&&cmSolid(a,'a')&&cmAreaBoxes(a).every(b=>b[4]==2)),'their canvas walls stop people (bullets go through); the roofs hang over people');
 ok(AR('tarp').length==4&&['IMMEDIATE','DELAYED','MINOR','EXPECTANT'].every(t=>AR('tarp').some(a=>a.tx==t))&&K('signboard').some(o=>o.tx=='TRIAGE'),'triage: red, yellow, green and black tarps');
 ok(K('canopyw').some(o=>o.tx=='SCREENING')&&K('canopyw').some(o=>o.tx=='REGISTRATION')&&K('canopyw').some(o=>o.tx=='COMMAND')&&K('cmdtable').length==1&&K('pboard').length>=2,'screening and registration at the vehicle tunnel, the command post');
 const C=K('cot').length+K('cotx').length;ok(C>=120&&K('cotx').length>=20,C+' cots: the wards, the sleeping rows out in the open and the shelter tent');
 ok(K('gen').length>=5&&K('genx').length>=2&&K('fueltank').length==1&&PA('line').filter(p=>p.c=='#141216').length>=12,K('gen').length+' generators running, '+K('genx').length+' run dry or blown, cables out to the tents and towers');
 ok(K('suppal').length>=15&&K('supshelf').length>=5&&K('waterst').length>=3&&K('porta').length>=6&&K('biobin').length>=4,'supplies: pallets, shelves, water, toilets, biohazard bins');
 ok(K('hbed').length>=6&&K('medcart').length>=8&&K('ivp').length>=10&&K('gurney').length>=3&&K('o2rack').length>=4,'beds, crash carts, drips, gurneys, oxygen');
 const IX=PA('chain');ok(IX.length>=3&&V('trailer').length==1&&DC('bodybag').length>=8&&K('qsign').length>=2,'isolation at the east end, its fence and gate, the morgue trailer')}
// ---------- overrun and abandoned ----------
{ok(DC('deadz').length>=50&&['bloodpool','bloodsplash','bloodsmear','blood','bloodfoot','drag','bloodtrail'].reduce((s,k)=>s+DC(k).length,0)>=60&&PA('bloodline').length>=4,'the dead everywhere, blood, drag trails');
 ok(DC('spray').length>=5&&DC('spray').some(o=>/TENTS/.test(o.tx||'')),'spray paint: '+DC('spray').map(o=>o.tx).join(', '));
 ok(FX('blaze').length>=3&&AR('floor').some(a=>a.o&&a.o.pt=='charred')&&AR('tent').some(a=>a.o.rip),'a tent burned down and a generator blew up; roofs torn');
 ok(K('crowdbarx').length>=8&&PA('sandbags').length==2&&DC('bullets').length>=10,'barriers knocked flat, a last stand at the service tunnel');
 ok(D.spawns.filter(p=>p.x<60||p.x>PW-60||p.y>PH-60).length>=6&&D.spawns.length>=15,'zombies come out of the three tunnels and drop over the wall ('+D.spawns.length+' spawn points)')}
// ---------- the game builds it ----------
mapId=17;S.mp=17;setGM('f');build();
ok(HS.CM==='builtin-stadium'&&WW==PW&&WH==PH&&BG.width==WW,'map 17 builds from stadium.json through the custom-map loader');
ok(MP.length==18&&MP[17].n=='Zombville Stadium'&&MUN[17]===18&&MPD[17]&&MPI[17]&&MT[17]&&CLM[17],'map 17: its name, description, picture, tile and campaign landmark; Buck the quarterback holds out here (his fight: qb-boss.js)');
ok(HS.LT&&HS.LT.t=='dark','lights only in the game');
// the stands: nobody can stand in them
{const cell=(x,y)=>Math.floor(y/gs)*gw+Math.floor(x/gs);let open=0,tot=0;for(let y=8;y<PH;y+=24)for(let x=8;x<PW;x+=24){if(!(x<LB.x0-4||x>LB.x1+4||y<LB.y0-4||y>LB.y1+4))continue;if(Object.values(LB.TB).some(t=>x>=t[0]-4&&x<=t[0]+t[2]+4&&y>=t[1]-4&&y<=t[1]+t[3]+4))continue;tot++;if(!bl[cell(x,y)])open++}
 ok(tot>2000&&open==0,'the stands are solid everywhere ('+tot+' spots checked, '+open+' open)');
 const F=new Int16Array(gw*gh);bfs(F,HS.px,HS.py);let pk=0;for(let k=0;k<gw*gh;k++)if(!bl[k]&&F[k]<0)pk++;ok(!pk,'no pockets: every open spot can be reached ('+pk+' cells cannot)');
 ok(D.spawns.every(p=>{const k=cell(p.x,p.y);return!bl[k]&&F[k]>=0}),'every spawn point is on open ground the zombies can walk from');
 ok([[2048,200],[200,500],[3900,2600],[1000,2600]].every(([x,y])=>bl[cell(x,y)]),'the seats are out of reach')}
start();
{const C=HS.CX;ok(C&&C.T.filter(it=>it.o.a=='tent').length>=10&&C.A.some(it=>it.o.k=='vboard')&&C.A.filter(it=>it.o.k=='gen').length>=5&&C.O.filter(it=>it.o.k=='canopy'||it.o.k=='canopyw').length>=7&&C.T.some(it=>it.o.p=='bulbs'||(it.f&&it.o&&it.o.w>1000)),'in the game the tent roofs and canopies hang over people, the board and generators run, the string lights hang overhead');
 let err='';try{for(let t=0;t<14;t+=.35){OB.vboard.an(K('vboard')[0],t);for(const g of K('gen'))OB.gen.an(g,t);for(const g of K('genx'))OB.genx.an(g,t)}}catch(e){err=e.message}ok(!err,'they all draw '+err);
 // a tent's roof fades while a player is inside, part way while one is near, a little while a zombie is in it
 const tn=AR('tent').find(a=>a.tx=='WARD 1'),b={x:tn.x+10,y:tn.y+10,w:tn.w-20,h:tn.h-20},run=(x,y,t0)=>{P.x=x;P.y=y;for(let t=t0;t<t0+2;t+=.05)arTentTop(tn,t);return STTN.get(tn).al};
 const PL0=PL;PL=[P];zs=[];const a0=run(b.x-300,b.y-300,100),a1=run(b.x+b.w/2,b.y+b.h/2,102),a2=run(b.x+b.w/2,b.y-30,104),a3=run(b.x-400,b.y,106);zs=[{x:b.x+50,y:b.y+50,hp:5,t:0}];const a4=run(b.x-400,b.y,108);zs=[];PL=PL0;
 ok(a0>.98&&a1<.2&&a2>.4&&a2<.7&&a3>.98&&a4>.4&&a4<.6,'a tent\\'s roof fades while you are inside ('+[a0,a1,a2,a3,a4].map(v=>v.toFixed(2)).join(' → ')+')');
 const cw=OB.canopyw;ok(cw.ov&&cw.ovf&&cw.ova<.3,'the canopies fade while anyone stands under them')}
// ---------- campaign: Zombville's fourth map ----------
{ok(SEC[2].n=='Zombville'&&SEC[2].m[3]===17&&SEC[2].m[4]===-1&&CORD.indexOf(17)==CORD.indexOf(13)+1&&SLATE[17].join()=='11,12,13'&&CCWAS.includes('2:3'),'Zombville\\'s fourth slot: after Downtown in the campaign');
 const A=S.ac;A.un=[0];A.cp=CORD.length;A.tut=1;delete A.slt;A.bm=[0,1,2].map(()=>CORD.reduce((v,m)=>m==17?v:v|1<<m,0));
 ok(secDone(A,0,2)&&A.slt[17]==7&&mOpen(A,0,17),'an account that had finished Zombville before keeps it finished, and the stadium is open');
 const B={name:'New',lv:1,xp:0,sp:0,sk:{},un:[0],cp:0,bm:[0,0,0]};B.bm[0]=[0,3,1,14,15,8,2,9,10,16].reduce((v,m)=>v|1<<m,0);ok(!secDone(B,0,2)&&mOpen(B,0,11)&&!mOpen(B,0,17),'a new player opens it by beating the section\\'s first map');
 B.bm[0]|=1<<11;ok(mOpen(B,0,17)&&!secDone(B,0,2),'then it must be beaten along with the rest');
 const ms=[0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1];const C={name:'M',lv:1,xp:0,sp:0,sk:{},un:[0],cp:0,bm:[0,0,0],sl:ms.slice()};secLate(C,0,17);secLate(C,0,16);ok(Array.isArray(C.sl)&&C.sl.join()==ms.join()&&C.slt&&C.slt[16]===0&&C.slt[17]===0,'the late-map record has its own place (A.slt): the Zombie-Slayer looks (A.sl) are left alone')}
const A=S.ac;const RNG=new Set([11,19]);
const play=(w0,w1,lim)=>{const R={spawned:0,reached:0,stuck:0,waves:0,err:'',sk:{}};try{for(let w=w0;w<=w1;w++){if(mode!='play')nextWave();let t=0;const seen=new Map();
 while(mode=='play'&&t<lim){for(const p of PL){p.mx=Math.max(p.mx,20);p.hp=p.mx}tick(1);t++;for(const z of zs){if(ZT[z.t].sv)continue;if(!seen.has(z)){seen.set(z,t);R.spawned++}
  const dz=Math.hypot(z.x-P.x,z.y-P.y);if(z.hp>0&&(dz<80||dz<400&&RNG.has(z.t))){R.reached++;hurt(z,z.hp+1,0,0)}else if(z.hp>0&&t-seen.get(z)>5000){R.stuck++;const k=z.t+'@'+Math.round(dz)+'('+Math.round(z.x)+','+Math.round(z.y)+')';R.sk[k]=(R.sk[k]||0)+1;hurt(z,z.hp+1,0,0)}}}
 if(mode=='play'){toSp=0;for(let q=0;q<4000&&mode=='play';q++){for(const z of zs.slice())if(z.hp>0)hurt(z,z.hp+1,0,0);toSp=0;tick(1)}}R.waves++}}catch(e){R.err=e.stack||e.message}return R};
A.un=[0];A.cp=CORD.length;A.tut=1;delete A.slt;A.bm=[0,1,2].map(()=>CORD.reduce((v,m)=>m==17?v:v|1<<m,0));S.lm='off';setGM('c');mapId=17;S.mp=17;sel=0;start();ok(mapId===17&&HS.CM==='builtin-stadium','a campaign run starts at the stadium');
{let R=play(1,3,5000);const R1=R;wave=18;zs=[];toSp=0;mode='shop';const R2=play(19,19,5000);R={spawned:R1.spawned+R2.spawned,reached:R1.reached+R2.reached,stuck:R1.stuck+R2.stuck,waves:R1.waves+R2.waves,err:R1.err||R2.err,sk:Object.assign(R1.sk,R2.sk)};
 ok(!R.err&&R.waves==4&&wave==19,'campaign waves 1–3 and 19 play through the stadium '+R.err);
 ok(R.spawned>60&&R.stuck<=Math.max(2,R.spawned*.02),'zombies reach the player ('+R.reached+' of '+R.spawned+' reached; '+R.stuck+' slow ones '+JSON.stringify(R.sk)+')')}
{if(mode!='play')nextWave();const b=zs.find(z=>ZT[z.t].sv);ok(wave==20&&b&&b.ci==18&&zs.length==1,'wave 20: Buck the quarterback comes out, alone');let err='';try{for(let f=0;f<600;f++){for(const p of PL){p.mx=Math.max(p.mx,20);p.hp=p.mx}tick(1)}}catch(e){err=e.message}
 ok(!err&&zs.includes(b),'his fight runs on the field '+err);b.iv=0;hurt(b,b.hp+1,0,0);tick(Math.ceil(5.8/.016));
 ok(bBt(A,DIF(),17)&&A.un.includes(18)&&mode=='over'&&ui.innerHTML.includes('ZOMBVILLE STADIUM COMPLETE')&&ui.innerHTML.includes('Buck joined your survivors'),'beating him wins the map, and he joins')}
// ---------- free play, the Workshop, the editor ----------
setGM('f');mapId=17;S.mp=17;start();{const R=play(1,1,4000);ok(!R.err&&wave>=1,'a Free Play run plays '+R.err);if(mode!='play')nextWave();const row=olRow();ok(row&&row.map===17&&row.mode=='f','its own leaderboard board (map 17)');over(1)}
{const h=wsBuiltins();ok(h.includes('wsBuiltin(17,1)')&&h.includes('Zombville Stadium'),'the Workshop lists Zombville Stadium under Built-in maps')}
await wsBuiltin(17,0);{const e=CML.find(q=>q.doc&&q.doc.name=='Zombville Stadium (my copy)'),D2=bimDoc(17);ok(e&&e.doc.obj.length==D2.obj.length&&e.doc.lt.t=='dark','EDIT A COPY makes your own copy with every piece, lights only')}
{const NK=['goalpost','pylon','tbench','dtable','tvcam','kicknet','gen','genx','fueltank','ltower','ltowerf','ltowerx','ltowerd','canopy','canopyw','gurney','wchair','medcart','o2rack','biobin','suppal','supshelf','cmdtable','pboard','privscr','waterst','porta','crowdbar','crowdbarx','vboard','ltbank','ltbankx'];
 ok(NK.every(k=>OB[k]&&EDPN[k])&&['bowl','gridiron','tent','tarp'].every(k=>CMAI[k])&&CMPAI.bulbs&&['sleepbag','blanket','medlitter','chains','toy'].every(k=>CMDI[k])&&EDCAT.some(c=>c[0]=='medical')&&EDCAT.some(c=>c[0]=='sport'),'the new pieces are all in the editor');
 const g=document.createElement('canvas').getContext('2d');let err='';for(const k of NK)try{for(const v of[0,.55,.9])OB[k].f(g,100,100,v,'','A|B')}catch(e){err+=k+': '+e.message+' '}
 try{for(const a of[{a:'bowl',x:0,y:0,w:900,h:600,o:{ds:200,de:150,r:80,tw:80,te:80,ts:80,tn:80,pb:1},tx:'X'},{a:'gridiron',x:0,y:0,w:248,h:115,o:{}},{a:'tent',x:0,y:0,w:200,h:120,o:{d:'all',rip:1}},{a:'tarp',x:0,y:0,w:60,h:40,tx:'RED'}]){CMAI[a.a].f(g,a);const out=[];if(CMAI[a.a].coll)CMAI[a.a].coll(a,out)}
  CMPAI.bulbs.f(g,[[0,0],[200,0]],{o:{}});CMPAI.bulbs.top(g,[[0,0],[200,0]],{o:{}});for(const k of['sleepbag','blanket','medlitter','chains','toy'])CMDI[k].f(g,.4,pcK('#2f4a8a'),'')}catch(e){err+='kit: '+e.message}ok(!err,'every piece draws '+err)}
console.log('TOTAL fails '+fails+' of '+n);
}
`;
const AF=Object.getPrototypeOf(async function(){}).constructor;
new AF('docL','ivs',code+test)(docL,ivs).catch(e=>{console.log('FAIL crashed: '+(e&&e.stack||e));console.log('TOTAL fails 1');process.exitCode=1});
