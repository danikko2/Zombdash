// Haunted Mansion (map 9) converted to a map file (src/maps/mansion.json) at the owner's request: night, light in the main areas but
// a dark map, more like a mansion in a scary movie, plus the approved extras: a lightning storm (M1), a hedge maze (M2), the secret room
// behind a library bookshelf (M3), the family crypt and an open grave (M4), a blood trail to a locked room (M8) and a grand ballroom.
// Reach, campaign, Abigail, Free Play, the Workshop copy.
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
const D=(()=>{const r=cmRead(JSON.stringify(BIMF[9]));ok(r.doc&&!r.errors.length&&!r.warnings.length,'mansion.json loads with no errors or warnings '+(r.errors||[]).concat(r.warnings||[]).slice(0,3).join('; '));return r.doc})();
{const L=cmLint(D).filter(p=>p.lv=='err'||p.lv=='warn');ok(!L.length,'nothing in the Problems list '+L.map(p=>p.m).slice(0,2).join('; '));
 ok(D.w==94&&D.h==70&&D.ground=='grass_dark'&&D.lt&&D.lt.t=='night'&&D.lt.a>=.85,'94×70 tiles of spooky lawn, at night');
 ok(D.obj.filter(o=>!o.dc&&!o.fx&&!o.veh).every(o=>cmOB(o.k)),'every prop is a real kit prop');
 ok(!cmDoorBlocks(D).length&&cmDoors(D).length>=25,'no prop stands in any of its '+cmDoors(D).length+' doorways')}
const K=k=>D.obj.filter(o=>o.k==k),FX=k=>D.obj.filter(o=>o.fx==k),DC=k=>D.obj.filter(o=>o.dc==k),A_=k=>D.areas.filter(a=>a.a==k),PA=k=>D.paths.filter(p=>p.p==k),WS=s=>D.walls.filter(w=>w.s==s);
const IN=(o,r)=>o.x>r[0]&&o.x<r[2]&&o.y>r[1]&&o.y<r[3];
const ROOM={foyer:[980,850,1580,1560],dining:[480,850,980,1230],gallery:[480,740,2080,850],ballroom:[2080,680,2640,1400],library:[480,360,840,740],secret:[480,360,680,590],parlor:[1580,850,2080,1230],
 study:[840,360,1120,740],nursery:[1120,360,1440,740],master:[1440,360,1780,740],bath:[1780,360,2080,740],kitchen:[480,1230,780,1560],pantry:[780,1230,980,1560],conservatory:[1580,1230,1830,1560],locked:[1830,1230,2080,1560]};
// ---------- what the owner asked for: night, light in the main areas but a dark map, a scary-movie mansion ----------
{const L=cmLightSrc(D),lit=r=>L.filter(s=>IN(s,r)&&s.r>=40&&!s.rect).length;
 const main=['foyer','dining','gallery','ballroom','library'].filter(k=>lit(ROOM[k])>=2),dark=['bath','kitchen','pantry','conservatory','locked','nursery'].filter(k=>lit(ROOM[k])<=1);
 ok(main.length==5,'the main areas are lit: '+main.join(', '));ok(dark.length==6,'the other rooms stay dark: '+dark.join(', '));
 ok(!A_('roomlight').length&&L.length<140,'no room is simply lit up ('+L.length+' small lights: candles, sconces, fireplaces, lanterns, chandeliers)');
 ok(K('sconce').length>=6&&K('cdl').length>=8&&K('fplace').length>=3&&K('hchand').length>=2&&K('lantern').length>=6&&K('lamp').length==4,'candle sconces, candelabras, fireplaces, chandeliers, lanterns and the drive lamps')}
ok(K('portrait').length>=25&&D.obj.filter(o=>/^dsheet_/.test(o.k||'')).length>=10&&DC('cobweb').length>=20&&DC('scrawl').length>=8&&WS('manor').length>=30&&A_('fog').length>=5,'scary-movie detail: portraits whose eyes follow you, dust sheets, cobwebs, writing, papered walls, fog');
ok(WS('window_x').length>=4&&WS('window_b').length>=2&&DC('lightpatch').length>=15&&K('knight').length>=6&&K('chandelier').length==1,'broken and boarded windows, moonlight on the floors, suits of armour, the fallen chandelier');
// ---------- M1: lightning and thunder ----------
{ok(D.lt.st===1&&(w=>(typeof w=='string'?JSON.parse(w):w).lighting.storm===true)(cmWrite(D)),'M1 the map has a lightning storm, and it saves');
 let fl=0,lo=0,n0=0;for(let t=0;t<200;t+=.02){const f=cmStorm(t)[0];if(f>.9)fl++;if(f==0)lo++}for(let k=0;k<12;k++)if(cmH(k,8,102)>=.25)n0++;ok(fl>5&&lo>9500&&n0>=6,'lightning flashes now and then ('+n0+' strikes in 200 s) and is dark between');
 const T={t:'night',a:.9,L:[],st:1};HS.LT=T;HS.CM='x';const sv=sfx;let th=0;sfx=function(k){if(k=='thunder')th++};const pn=global.NOW_;for(let t=0;t<200;t+=.1){global.NOW_=t*1000;cmLight()}global.NOW_=pn;sfx=sv;let ex=0;for(let k=0;k*16<200;k++){if(cmH(k,8,102)<.25)continue;if(k*16+cmH(k,7,101)*13+.5+cmH(k,9,103)*2<199.8)ex++}ok(ex>=6&&th==ex,'thunder follows each strike ('+th+' of '+ex+' in 200 s)');
 ok(typeof SF.thunder=='function','the thunder sound exists')}
// ---------- M2: the hedge maze with a statue ----------
{const MZ=[60,1640,890,2120];const H=PA('hedge').filter(p=>IN(p,MZ));ok(H.length>=40&&K('bigang').some(o=>IN(o,MZ))&&K('bench').filter(o=>IN(o,MZ)).length==2&&K('lantern').some(o=>IN(o,MZ))&&A_('fog').some(a=>a.x<200&&a.y>1600),'M2 a hedge maze in the south-west, a weeping angel in the middle with benches, candles and a lantern, fog')}
// ---------- M3: the secret room behind a library bookshelf ----------
{const S_=ROOM.secret;ok(DC('ritual').some(o=>IN(o,S_))&&K('candle').filter(o=>IN(o,S_)).length>=6&&K('altar').some(o=>IN(o,S_))&&K('bookshelf').some(o=>o.r&&Math.abs(o.x-700)<30&&Math.abs(o.y-480)<60),'M3 a ritual circle ringed with candles and an altar, behind the bookshelf swung aside');
 ok(!D.walls.some(w=>/^window/.test(w.s)&&w.x<690&&w.y<600&&(w.x<486||w.y<366)),'the secret room has no windows')}
// ---------- M4: the family crypt with its door ajar, the open grave ----------
{const C=[1470,30,1730,210];ok(WS('stone').filter(w=>IN({x:w.x+w.w/2,y:w.y+w.h/2},C)).length>=5&&K('cryptdoor').length==1&&K('coffin').filter(o=>IN(o,C)).length==3&&A_('steps').some(a=>IN(a,C))&&DC('text').some(o=>o.tx=='BLACKWOOD'),'M4 the Blackwood crypt: stone walls, the door standing ajar, coffins, steps down');
 ok(K('opengrave').length==1&&K('shovel').length==1&&K('dirtpile').length==1&&DC('footprints').length>=8&&D.obj.filter(o=>/^g_/.test(o.k||'')).length>=15&&WS('ironfence').length>=4,'the open grave with its shovel and dirt, footprints to the back door, the family plot inside an iron fence')}
// ---------- M8: the blood trail to the locked room ----------
{const B=PA('bloodline').find(p=>p.pts&&p.pts.length>5),q=B&&B.pts[B.pts.length-1],end=q&&[B.x+q[0],B.y+q[1]];ok(B&&end&&Math.abs(end[0]-1960)<20&&Math.abs(end[1]-1218)<20&&WS('barricade').length==2,'M8 a blood trail across the foyer and the parlor to the boarded-up door');
 ok(DC('scrawl').filter(o=>o.tx=='GET OUT').length>=4&&DC('handprint').filter(o=>Math.abs(o.x-1960)<40).length>=2,'GET OUT in blood by the door and all over the locked room, handprints on the boards')}
// ---------- the grand ballroom ----------
{const B=ROOM.ballroom,b=o=>IN(o,B);ok(K('hchand').some(b)&&K('hchandx').some(b)&&K('column').filter(b).length==4&&K('piano').some(b)&&K('mtable').some(b)&&A_('floor').some(a=>a.o.pt=='marble'&&IN({x:a.x+1,y:a.y+1},B))&&A_('porch').some(a=>IN({x:a.x+1,y:a.y+1},B)),'a grand ballroom in a new east wing: chandeliers, columns, the stage and piano, a marble dance floor, the banquet table');
 ok(DC('ribcage').filter(b).length>=6&&D.obj.filter(o=>/^dsheet_/.test(o.k||'')&&b(o)).length>=5&&D.walls.filter(w=>w.s=='door'&&Math.abs(w.x+3-2080)<8).length==2,'skeletons still dancing, dust-sheeted chairs, doors from the gallery and the parlor')}
// ---------- the game builds it ----------
mapId=9;S.mp=9;setGM('f');build();
ok(HS.CM==='builtin-mansion'&&WW==3008&&WH==2240&&BG.width==WW,'map 9 builds from mansion.json through the custom-map loader');
ok(MP[9].n=='Haunted Mansion'&&MUN[9]===10,'map number 9 keeps its name and Abigail');
ok(HS.LT&&HS.LT.t=='night'&&HS.LT.st===1&&HS.NS&&HS.NS.length>=3,'night lighting with the storm; no zombie appears inside the house, the ballroom or the crypt');
start();{const C=HS.CX;ok(C&&C.O.filter(q=>/^hchand/.test(q.o.k)).length==3&&C.E&&C.E.length>=40,'the chandeliers hang over people; the portraits watch')}
// ---------- reach ----------
{const F=new Int16Array(gw*gh);bfs(F,HS.px,HS.py);
const RCH=(x,y)=>{const i0=Math.floor(x/gs),j0=Math.floor(y/gs);for(let r=0;r<=2;r++)for(let j=j0-r;j<=j0+r;j++)for(let i=i0-r;i<=i0+r;i++){const k=j*gw+i;if(k>=0&&k<gw*gh&&!bl[k])return F[k]>=0}return false};
const EDGE=()=>{let e=0,er=0;for(let i=0;i<gw;i++)for(const j of[0,gh-1]){const k=j*gw+i;if(!bl[k]){e++;if(F[k]>=0)er++}}for(let j=0;j<gh;j++)for(const i of[0,gw-1]){const k=j*gw+i;if(!bl[k]){e++;if(F[k]>=0)er++}}return[e,er]};
 const pl={foyer:[1280,1400],dining:[700,1150],library:[760,650],'secret room':[580,450],study:[980,600],nursery:[1280,640],master:[1610,600],bath:[1930,560],gallery:[1280,800],parlor:[1800,1150],kitchen:[620,1450],pantry:[880,1400],conservatory:[1705,1350],ballroom:[2360,1100],terrace:[2360,1450],crypt:[1600,150],'open grave':[1250,280],'maze centre':[476,1880],forest:[2900,300],drive:[1280,2100]};
 const no=Object.keys(pl).filter(k=>!RCH(...pl[k]));ok(!no.length,'every room and place can be reached: '+(no.length?'not '+no.join(', '):'all of the house, the ballroom, the crypt, the maze, the forest'));
 ok(!RCH(1955,1330),'the locked room cannot be entered');
 const[e,er]=EDGE();ok(e>250&&er>=e*.95,'zombies can walk to the player from the open edges ('+er+' of '+e+')')}
// ---------- playtest: campaign waves and Abigail ----------
const A=S.ac;const RNG=new Set([11,19]);
const play=(w0,w1,lim)=>{const R={spawned:0,reached:0,stuck:0,waves:0,err:'',sk:{}};try{for(let w=w0;w<=w1;w++){if(mode!='play')nextWave();let t=0;const seen=new Map();
 while(mode=='play'&&t<lim){for(const p of PL){p.mx=Math.max(p.mx,20);p.hp=p.mx}tick(1);t++;for(const z of zs){if(ZT[z.t].sv)continue;if(!seen.has(z)){seen.set(z,t);R.spawned++}
  const dz=Math.hypot(z.x-P.x,z.y-P.y);if(z.hp>0&&(dz<80||dz<400&&RNG.has(z.t))){R.reached++;hurt(z,z.hp+1,0,0)}else if(z.hp>0&&t-seen.get(z)>5000){R.stuck++;const k=z.t+'@'+Math.round(dz)+'('+Math.round(z.x)+','+Math.round(z.y)+')';R.sk[k]=(R.sk[k]||0)+1;hurt(z,z.hp+1,0,0)}}}
 if(mode=='play'){toSp=0;for(let q=0;q<4000&&mode=='play';q++){for(const z of zs.slice())if(z.hp>0)hurt(z,z.hp+1,0,0);toSp=0;tick(1)}}R.waves++}}catch(e){R.err=e.stack||e.message}return R};
A.un=[0,MUN[0],MUN[3],MUN[1],MUN[14],MUN[15],MUN[8]];A.cp=6;A.tut=1;delete A.bm;S.lm='off';setGM('c');mapId=9;S.mp=9;sel=0;start();ok(mapId===9&&HS.CM==='builtin-mansion','a campaign run starts in the Haunted Mansion');
{let R=play(1,3,5000);const R1=R;wave=18;zs=[];toSp=0;mode='shop';const R2=play(19,19,5000);R={spawned:R1.spawned+R2.spawned,reached:R1.reached+R2.reached,stuck:R1.stuck+R2.stuck,waves:R1.waves+R2.waves,err:R1.err||R2.err,sk:Object.assign(R1.sk,R2.sk)};
 ok(!R.err&&R.waves==4&&wave==19,'campaign waves 1–3 and 19 play through in the mansion '+R.err);
 ok(R.spawned>60&&R.stuck<=Math.max(2,R.spawned*.02),'zombies reach the player ('+R.reached+' of '+R.spawned+' reached; '+R.stuck+' slow ones '+JSON.stringify(R.sk)+')')}
{if(mode!='play')nextWave();const b=zs.find(q=>ZT[q.t].sv);ok(wave==20&&b&&b.ci==10,'wave 20: Abigail');
 let near_=0;for(let f=0;f<3000&&b&&b.hp>0&&!near_;f++){P.mx=Math.max(P.mx,20);P.hp=P.mx;tick(1);if(Math.hypot(b.x-P.x,b.y-P.y)<420)near_=1}ok(near_,'Abigail finds the player');
 b.ph=2;hurt(b,1e9,0,0);tick(Math.ceil(6/.016));ok(bBt(A,DIF(),9)&&A.un.includes(10),'beating her keeps campaign progress: she joins and the mansion counts as beaten')}
// ---------- free play, the Workshop, the editor, the old code ----------
setGM('f');mapId=9;S.mp=9;start();{const R=play(1,1,4000);ok(!R.err&&wave>=1,'a Free Play run plays '+R.err);if(mode!='play')nextWave();const row=olRow();ok(row&&row.map===9&&row.mode=='f','the leaderboard board is still map 9');over(1)}
{const h=wsBuiltins();ok(h.includes('wsBuiltin(9,1)')&&h.includes('Haunted Mansion'),'the Workshop lists the Haunted Mansion under Built-in maps')}
await wsBuiltin(9,0);{const e=CML.find(q=>q.doc&&q.doc.name=='Haunted Mansion (my copy)'),D2=bimDoc(9);ok(e&&e.doc.obj.length==D2.obj.length&&e.doc.walls.length==D2.walls.length&&e.doc.lt.st===1,'EDIT A COPY makes your own copy with every piece and the storm')}
{const NK=['dsheet_c','dsheet_s','dsheet_t','sconce','hchand','hchandx','cryptdoor'];ok(NK.every(k=>OB[k]&&EDPN[k])&&cmDec('ritual')&&CMWI.manor&&OB.hchand.ov&&OB.cryptdoor.dk&&OB.sconce.dk,'the mansion pieces are all in the editor: dust sheets, sconces, chandeliers, the crypt door, the ritual circle, the papered wall');
 ok(typeof mapMansion=='undefined'&&typeof mnAnim=='undefined'&&typeof mnFog=='undefined','the old mansion map code is gone')}
mapId=9;build();ok(HS.CM==='builtin-mansion','map 9 is still the built-in Haunted Mansion');
console.log('TOTAL fails '+fails+' of '+n);
}
`;
const AF=Object.getPrototypeOf(async function(){}).constructor;
new AF('docL','ivs',code+test)(docL,ivs).catch(e=>{console.log('FAIL crashed: '+(e&&e.stack||e));console.log('TOTAL fails 1');process.exitCode=1});
