// The Graveyard (map 2) converted to a map file (src/maps/graveyard.json) at the owner's request: at night, the old layout and its open
// space kept, with the owner's picks: G1 the glowing mausoleum (pulsing, wisps, something behind the bars), G2 the open-air crypt, G3
// the chapel (stained glass, altar candles, bell tower, a side door), G4 dug-up graves with hands, G5 an interrupted funeral, G6 the
// hearse, G8 the gate, G9 the groundskeeper's shed, G10 wisps and crows, G12 a lightning storm. Reach, room to move, campaign and Tim,
// Free Play, the Workshop copy, the editor pieces.
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
const inR=(o,x0,y0,x1,y1)=>o.x>x0&&o.x<x1&&o.y>y0&&o.y<y1;

// ---------- the map file loads ----------
const D=(()=>{const r=cmRead(JSON.stringify(BIMF[2]));ok(r.doc&&!r.errors.length&&!r.warnings.length,'graveyard.json loads with no errors or warnings '+(r.errors||[]).concat(r.warnings||[]).slice(0,3).join('; '));return r.doc})();
{const L=cmLint(D).filter(p=>(p.lv=='err'||p.lv=='warn')&&!/crafting bench/.test(p.m));ok(!L.length,'nothing in the Problems list '+L.map(p=>p.m).slice(0,2).join('; '));
 ok(D.w==57&&D.h==57&&D.ground=='grass_dark'&&D.lt&&D.lt.t=='night'&&D.lt.a>=.75&&D.lt.a<.9&&D.lt.st===1,'57×57 tiles of spooky lawn, at night (lighter than the mansion), with a lightning storm (G12)');
 ok(D.obj.filter(o=>!o.dc&&!o.fx&&!o.veh).every(o=>cmOB(o.k)),'every prop is a real kit prop');
 ok(!cmDoorBlocks(D).length&&cmDoors(D).length>=6,'no prop stands in any of its '+cmDoors(D).length+' doorways')}
const K=k=>D.obj.filter(o=>o.k==k),FX=k=>D.obj.filter(o=>o.fx==k),DC=k=>D.obj.filter(o=>o.dc==k),V=k=>D.obj.filter(o=>o.veh==k),A_=k=>D.areas.filter(a=>a.a==k),PA=k=>D.paths.filter(p=>p.p==k),WS=s=>D.walls.filter(w=>w.s==s);
const IN=(o,r)=>o.x>r[0]&&o.x<r[2]&&o.y>r[1]&&o.y<r[3],cx=900;
const CH=[130,130,550,460],CRY=[750,790,1050,1010],MAUS=[1230,120,1530,460],OGP=[140,640,470,880],FUN=[1440,690,1760,970],SHED=[1590,500,1800,700],GATE=[790,1520,1010,1800],LOT=[580,120,870,480];
const DR=cmDoors(D),ways=r=>DR.filter(q=>q.hz?(Math.abs(q.c-r[1])<7||Math.abs(q.c-r[3])<7)&&q.b>r[0]&&q.a<r[2]:(Math.abs(q.c-r[0])<7||Math.abs(q.c-r[2])<7)&&q.b>r[1]&&q.a<r[3]).length;
// ---------- the old map is all still there ----------
ok(K('pew').filter(o=>IN(o,CH)).length==8&&K('altar').some(o=>IN(o,CH))&&K('mausol').length==3&&K('fntn').length==1&&K('bigang').length>=5&&K('reaper').length==4&&K('lamp').length>=14&&K('bench').length==5,'the old layout: the chapel and its pews, three mausoleums, the fountain, the angels and reapers, the lamps (more now), the benches');
ok(D.obj.filter(o=>/^g_/.test(o.k||'')).length>=100&&K('fence').length>=20&&PA('line').length>=10&&K('postsign').some(o=>/MANSION/.test(o.tx)),'rows and rows of graves, the family plots\\' fences, the lot\\'s lines, the MANSION THIS WAY sign');
ok(['sedan','suv'].reduce((n,k)=>n+V(k).filter(o=>IN(o,LOT)).length,0)==6,'the six cars in the chapel lot');
// ---------- G1: the glowing mausoleum ----------
{const G=K('gmausol')[0],S_=FX('doorshade')[0],W=FX('wisp').find(o=>IN(o,MAUS));ok(G&&Math.abs(G.x-1380)<2&&Math.abs(G.y-340)<2&&S_&&Math.abs(S_.x-G.x)<3&&Math.abs(S_.y-(G.y-14))<3&&W&&/ffd/i.test(W.c||''),'G1 the glowing mausoleum where the old one stood, something on its door, gold wisps round it');
 const L=cmLightSrc(D).filter(s=>IN(s,MAUS)&&s.f=='glow');ok(L.some(s=>s.r>=200&&s.gs>1)&&L.some(s=>s.cw),'its door glows and pulses, the light spilling down the path');
 let seen=0,hid=0;for(let t=0;t<40;t+=.1){global.ELL=0;CMFXI.doorshade.anim(S_,t);if(global.ELL)seen++;else hid++}ok(seen>10&&hid>seen*2,'something crosses behind the bars now and then ('+seen+' of '+(seen+hid)+' moments)')}
// ---------- G2: the crypt ----------
{ok(ways(CRY)==4&&WS('stone').filter(w=>IN({x:w.x+w.w/2,y:w.y+w.h/2},[740,780,1060,1020])).length>=8,'G2 the middle is an open-air stone crypt with a way in on every side');
 const S_=K('sarco').filter(o=>IN(o,CRY));ok(K('column').filter(o=>IN(o,CRY)).length==4&&S_.length==4&&S_.filter(o=>o.vr>=.34).length>=3&&K('brazier').some(o=>IN(o,CRY))&&FX('fire').some(o=>IN(o,CRY))&&K('candle').filter(o=>IN(o,CRY)).length==8,'columns, sarcophagi with their lids pushed off, a fire bowl in a ring of candles');
 ok(D.feats.some(f=>f.f=='nospawn'&&f.x<=750&&f.x+f.w>=1050)&&IN(D.start,CRY),'you start in the crypt, and no zombie appears inside it')}
// ---------- G3: the chapel ----------
{ok(ways(CH)==2&&DR.some(q=>!q.hz&&Math.abs(q.c-130)<6),'G3 the chapel has its front door and a new side door in the west wall');
 ok(WS('stainglass').length>=9&&DC('stainedglass').filter(o=>IN(o,CH)).length>=8&&cmLightSrc(D).filter(s=>IN(s,CH)&&s.r<40&&!s.f).length>=16,'stained-glass windows throw coloured light across the floor');
 ok(K('cdl').filter(o=>IN(o,CH)).length==2&&K('steeple').some(o=>o.x>300&&o.x<380&&o.y<=130)&&K('coffin').filter(o=>IN(o,CH)).length==2,'candelabras on the altar, the bell tower over the north wall, the coffin that came up through the floor')}
// ---------- G4: the dug-up graves ----------
ok(K('opengrave').filter(o=>IN(o,OGP)).length==3&&FX('hands').filter(o=>IN(o,OGP)).length>=4&&K('coffin').filter(o=>IN(o,OGP)).length==2&&K('lantern').some(o=>IN(o,OGP))&&DC('footprints').filter(o=>o.x>400&&o.x<760&&o.y>740&&o.y<900).length>=3,'G4 dug-up graves: broken coffins, hands clawing out of the dirt, a dropped lantern, footprints heading for the middle');
{let up=0,dn=0;const o=FX('hands')[0];for(let t=0;t<30;t+=.1){global.ELL=0;CMFXI.hands.anim(o,t);if(global.ELL>2)up++;else dn++}ok(up>50&&dn>20,'the hands come up and sink back ('+up+' up, '+dn+' down)')}
// ---------- G5: the funeral ----------
{const C=K('casket').find(o=>IN(o,FUN)),T=K('ftent').find(o=>IN(o,FUN)),F=K('fchair').filter(o=>IN(o,FUN));ok(T&&OB.ftent.ov&&C&&C.vr>=.5&&F.length>=10&&F.filter(o=>o.vr>=.5).length>=4&&K('brolly').some(o=>IN(o,FUN))&&DC('wildflowers').filter(o=>IN(o,FUN)).length>=5,'G5 an interrupted funeral: a canopy over the casket, open and empty, chairs knocked over, flowers everywhere, a dropped umbrella')}
// ---------- G6: the hearse ----------
{const H_=V('hearseo')[0];ok(H_&&IN(H_,LOT)&&FX('headlights').some(o=>IN(o,LOT))&&FX('hazard').filter(o=>IN(o,LOT)).length==2&&HWV('hearseo')[0]>HWV('hearse')[0],'G6 the hearse in the lot, back open with the coffin sliding out, headlights on, hazards blinking')}
// ---------- G8: the gate ----------
{const P=K('cempost').filter(o=>IN(o,GATE)),A=K('cemarch').find(o=>IN(o,GATE));ok(P.length==2&&A&&A.tx=='EVERGREEN REST'&&OB.cemarch.ov&&K('irongate').filter(o=>IN(o,GATE)).length==2&&cmLightSrc(D).filter(s=>IN(s,GATE)&&s.f=='flk').length>=2,'G8 the gate: EVERGREEN REST over the arch, the iron gates hanging open, lanterns flickering on the posts')}
// ---------- G9: the groundskeeper's shed ----------
ok(K('gshed').some(o=>IN(o,SHED))&&DC('lightpatch').some(o=>IN(o,SHED))&&K('lantern').some(o=>IN(o,SHED))&&K('firebarrel').some(o=>IN(o,SHED))&&K('wheelbx').some(o=>IN(o,SHED)),'G9 the shed: light from its window, a lantern on a hook, a burning barrel, the wheelbarrow tipped over');
// ---------- G10: wisps and crows ----------
{ok(FX('wisp').length>=6&&FX('crows').length>=4,'G10 wisps drifting over the fields, crows in the graves');
 const o=FX('crows')[0],sv_=sfx;let caw=0;sfx=function(k){if(k=='caw')caw++};const m0=mode,PL0=PL;try{mode='play';PL=[{x:o.x+400,y:o.y,hp:1}];CMFXI.crows.top(o,1);const s0=GYST.get(o).m;PL[0].x=o.x+60;CMFXI.crows.top(o,2);const s1=GYST.get(o).m;CMFXI.crows.top(o,5);const s2=GYST.get(o).m;CMFXI.crows.top(o,10);const s3=GYST.get(o).m;PL[0].x=o.x+600;CMFXI.crows.top(o,16);const s4=GYST.get(o).m;
  ok(s0=='sit'&&s1=='fly'&&caw==1&&s2=='gone'&&s3=='gone'&&s4=='sit','the crows take off with a caw when you come near, and settle again a while after you leave ('+[s0,s1,s2,s3,s4].join(' → ')+')')}finally{sfx=sv_;mode=m0;PL=PL0}
 ok(typeof SF.caw=='function','the caw is a real sound')}
// ---------- the game builds it ----------
mapId=2;S.mp=2;setGM('f');build();
ok(HS.CM==='builtin-graveyard'&&WW==1824&&WH==1824&&BG.width==WW,'map 2 builds from graveyard.json through the custom-map loader');
ok(MP[2].n=='Graveyard'&&MUN[2]===4&&HS.LT&&HS.LT.t=='night'&&HS.LT.st===1&&HS.NS&&HS.NS.length>=1,'map number 2 keeps its name and Tim; night lighting with the storm');
start();{const C=HS.CX;ok(C&&C.O.some(q=>q.o.k=='cemarch')&&C.O.some(q=>q.o.k=='ftent')&&C.A.some(q=>q.o.fx=='doorshade')&&C.A.filter(q=>q.o.fx=='hands').length>=4&&C.T.filter(q=>q.o.fx=='crows').length>=4,'the arch and the canopy hang over people; the shadow, the hands and the crows run')}
// ---------- reach and room to move ----------
{const F=new Int16Array(gw*gh);bfs(F,HS.px,HS.py);
const RCH=(x,y)=>{const i0=Math.floor(x/gs),j0=Math.floor(y/gs);for(let r=0;r<=2;r++)for(let j=j0-r;j<=j0+r;j++)for(let i=i0-r;i<=i0+r;i++){const k=j*gw+i;if(k>=0&&k<gw*gh&&!bl[k])return F[k]>=0}return false};
 const pl={chapel:[340,300],'chapel side door':[160,230],'crypt fire':[900,960],'crypt west':[770,900],'crypt east':[1030,900],'mausoleum steps':[1380,400],'dug-up graves':[280,770],funeral:[1590,900],shed:[1690,640],gate:[900,1760],fountain:[1450,1460],lot:[700,360],'grave rows':[460,1300],plots:[1250,640],'north field':[1150,120],'south-east':[1650,1700]};
 const no=Object.keys(pl).filter(k=>!RCH(...pl[k]));ok(!no.length,'every place can be reached: '+(no.length?'not '+no.join(', '):'the chapel, the crypt, the mausoleum, the graves, the funeral, the shed, the gate, the lot'));
 let cl=0;for(let y=20;y<1800;y+=8){if(y>780&&y<1020)continue;const k=Math.floor(y/gs)*gw+Math.floor(cx/gs);if(bl[k])cl++}ok(!cl,'the main path is clear from the top fence to the gate');
 let o=0,t=0;for(let k=0;k<gw*gh;k++){t++;if(!bl[k])o++}ok(o/t>=.854,'plenty of room to move: '+(o/t*100).toFixed(1)+'% of the ground is open (the old map 85.4%)');
 let e=0,er=0;for(let i=0;i<gw;i++)for(const j of[1,gh-2]){const k=j*gw+i;if(!bl[k]){e++;if(F[k]>=0)er++}}ok(e>100&&er>=e*.95,'zombies can walk in from all round the edge ('+er+' of '+e+')')}
// ---------- campaign: waves and Tim ----------
const A=S.ac;const RNG=new Set([11,19]);
const play=(w0,w1,lim)=>{const R={spawned:0,reached:0,stuck:0,waves:0,err:'',sk:{}};try{for(let w=w0;w<=w1;w++){if((mode!='play'||!!BRK))nextWave();let t=0;const seen=new Map();
 while((mode=='play'&&!BRK)&&t<lim){for(const p of PL){p.mx=Math.max(p.mx,20);p.hp=p.mx}tick(1);t++;for(const z of zs){if(ZT[z.t].sv)continue;if(!seen.has(z)){seen.set(z,t);R.spawned++}
  const dz=Math.hypot(z.x-P.x,z.y-P.y);if(z.hp>0&&(dz<80||dz<400&&RNG.has(z.t))){R.reached++;hurt(z,z.hp+1,0,0)}else if(z.hp>0&&t-seen.get(z)>5000){R.stuck++;const k=z.t+'@'+Math.round(dz)+'('+Math.round(z.x)+','+Math.round(z.y)+')';R.sk[k]=(R.sk[k]||0)+1;hurt(z,z.hp+1,0,0)}}}
 if((mode=='play'&&!BRK)){toSp=0;for(let q=0;q<4000&&(mode=='play'&&!BRK);q++){for(const z of zs.slice())if(z.hp>0)hurt(z,z.hp+1,0,0);toSp=0;tick(1)}}R.waves++}}catch(e){R.err=e.stack||e.message}return R};
A.un=[0,MUN[0],MUN[3],MUN[1],MUN[14],MUN[15],MUN[8]];A.tut=1;A.bm=[0,1,2].map(()=>[0,3,1,14,15,8].reduce((v,m)=>v|1<<m,0));S.lm='off';setGM('c');mapId=2;S.mp=2;sel=0;start();ok(mapId===2&&HS.CM==='builtin-graveyard','a campaign run starts in the Graveyard');
{let R=play(1,3,5000);const R1=R;wave=18;zs=[];toSp=0;mode='shop';const R2=play(19,19,5000);R={spawned:R1.spawned+R2.spawned,reached:R1.reached+R2.reached,stuck:R1.stuck+R2.stuck,waves:R1.waves+R2.waves,err:R1.err||R2.err,sk:Object.assign(R1.sk,R2.sk)};
 ok(!R.err&&R.waves==4&&wave==19,'campaign waves 1–3 and 19 play through in the Graveyard '+R.err);
 ok(R.spawned>60&&R.stuck<=Math.max(2,R.spawned*.02),'zombies reach the player ('+R.reached+' of '+R.spawned+' reached; '+R.stuck+' slow ones '+JSON.stringify(R.sk)+')')}
{if((mode!='play'||!!BRK))nextWave();const b=zs.find(q=>ZT[q.t].sv);ok(wave==20&&b&&b.ci==4,'wave 20: Tim');
 let near_=0;for(let f=0;f<3000&&b&&b.hp>0&&!near_;f++){P.mx=Math.max(P.mx,20);P.hp=P.mx;tick(1);if(Math.hypot(b.x-P.x,b.y-P.y)<420)near_=1}ok(near_,'Tim finds the player');
 b.ph=2;b.iv=0;hurt(b,1e9,0,0);tick(Math.ceil(6/.016));ok(bBt(A,DIF(),2)&&A.un.includes(4),'beating him keeps campaign progress: he joins and the Graveyard counts as beaten')}
// ---------- free play, the Workshop, the editor, the old code ----------
setGM('f');mapId=2;S.mp=2;start();{const R=play(1,1,4000);ok(!R.err&&wave>=1,'a Free Play run plays '+R.err);if((mode!='play'||!!BRK))nextWave();const row=olRow();ok(row&&row.map===2&&row.mode=='f','the leaderboard board is still map 2');over(1)}
{const h=wsBuiltins();ok(h.includes('wsBuiltin(2,1)')&&h.includes('Graveyard'),'the Workshop lists the Graveyard under Built-in maps')}
await wsBuiltin(2,0);{const e=CML.find(q=>q.doc&&q.doc.name=='Graveyard (my copy)'),D2=bimDoc(2);ok(e&&e.doc.obj.length==D2.obj.length&&e.doc.walls.length==D2.walls.length&&e.doc.lt.st===1,'EDIT A COPY makes your own copy with every piece and the storm')}
{const NK=['gmausol','sarco','brazier','ftent','casket','fchair','brolly','irongate','cemarch','cempost','g_small','baretree','wheelbx','postsign'];ok(NK.every(k=>OB[k]&&EDPN[k])&&CMFXI.doorshade&&CMFXI.hands&&CMFXI.crows&&CMWI.stainglass&&EDVN.hearse&&EDVN.hearseo,'the graveyard pieces are all in the editor: the mausoleum, sarcophagi, the fire bowl, the funeral, the gate, the hearses, the stained glass, the effects');
 const g=document.createElement('canvas').getContext('2d');let err='';for(const k of NK)try{for(const v of[0,.4,.8])OB[k].f(g,100,100,v)}catch(e){err+=k+': '+e.message+' '}for(const k of['hearse','hearseo'])try{hwDraw(g,{k,x:200,y:100,a:0,L:HWV(k)[0],W:HWV(k)[1]})}catch(e){err+=k+': '+e.message}ok(!err,'every piece draws '+err);
 ok(typeof mapGrave=='undefined'&&typeof GVX=='undefined'&&typeof grvPaint=='undefined','the old graveyard map code is gone')}
mapId=2;build();ok(HS.CM==='builtin-graveyard','map 2 is still the built-in Graveyard');
console.log('TOTAL fails '+fails+' of '+n);
}
`;
const AF=Object.getPrototypeOf(async function(){}).constructor;
new AF('docL','ivs',code+test)(docL,ivs).catch(e=>{console.log('FAIL crashed: '+(e&&e.stack||e));console.log('TOTAL fails 1');process.exitCode=1});
