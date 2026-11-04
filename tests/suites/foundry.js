// The Black Iron Foundry (map 16, src/maps/foundry.json), the new Wrong Turn map the owner asked for: a foggy steel fabrication shop and
// forging foundry with welding tables and lots of machinery, a big ladle of molten metal that bubbles and pops, large furnaces, bigger
// forklifts than any other map, a pull-through semi loading bay, signs of the zombie attack, a small office on one side, a gravel lot
// outside and a couple of cranes for loading steel. Its survivor slot is left open for the owner to fill, so until then clearing wave
// 20 wins the map. Reach, campaign, the no-survivor finish, old saves, custom slots, Free Play, the Workshop copy, the editor pieces.
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
const D=(()=>{const r=cmRead(JSON.stringify(BIMF[16]));ok(r.doc&&!r.errors.length&&!r.warnings.length,'foundry.json loads with no errors or warnings '+(r.errors||[]).concat(r.warnings||[]).slice(0,3).join('; '));return r.doc})();
{const L=cmLint(D).filter(p=>p.lv=='err'||p.lv=='warn');ok(!L.length,'nothing in the Problems list '+L.map(p=>p.m).slice(0,2).join('; '));
 ok(D.w==110&&D.h==75&&D.ground=='dirt'&&D.lt&&D.lt.t=='night'&&D.lt.a>=.75,'110×75 tiles, at night');
 ok(D.obj.filter(o=>!o.dc&&!o.fx&&!o.veh).every(o=>cmOB(o.k)),'every prop is a real kit prop');
 ok(!cmDoorBlocks(D).length&&cmDoors(D).length>=15,'no prop stands in any of its '+cmDoors(D).length+' doorways')}
const K=k=>D.obj.filter(o=>o.k==k),FX=k=>D.obj.filter(o=>o.fx==k),DC=k=>D.obj.filter(o=>o.dc==k),V=k=>D.obj.filter(o=>o.veh==k),A_=k=>D.areas.filter(a=>a.a==k),PA=k=>D.paths.filter(p=>p.p==k),WS=s=>D.walls.filter(w=>w.s==s);
const IN=(o,r)=>o.x>r[0]&&o.x<r[2]&&o.y>r[1]&&o.y<r[3];
const SHOP=[960,560,3080,1720],OFF=[620,860,960,1420],FAB=[960,560,1700,1720],FRG=[1700,560,2500,1720],TRK=[2500,560,3080,1720],LOT=[40,250,960,1850],YARD=[1150,40,2710,540],TX=2790;
// ---------- what the owner asked for ----------
ok(A_('fog').some(a=>a.x<=0&&a.y<=0&&a.w>=D.w*32&&a.h>=D.h*32)&&A_('fog').filter(a=>IN({x:a.x+a.w/2,y:a.y+a.h/2},SHOP)).length>=2,'foggy: fog over the whole map, thicker in the shop and the forge');
ok(K('weldtable').filter(o=>IN(o,FAB)).length>=6&&K('welder').length>=6&&K('gascyl').length>=6&&!FX('weldarc').some(o=>IN(o,FAB))&&!cmLightSrc(D).some(s=>IN(s,FAB)&&s.f=='weld'),'welding tables with welders and gas; the welders are off (no arc, no light from the tables)');
{const M=['lathe','pressbrake','drillpress','bandsaw','plasmatbl','grinder','phammer','quench','steelrack'];const have=M.filter(k=>K(k).some(o=>IN(o,SHOP)));ok(have.length==M.length&&K('steelrack').length>=4,'lots of fabrication machinery: '+have.join(', '))}
{const L_=K('ladle')[0],M_=FX('molten')[0];ok(K('ladle').length==1&&IN(L_,FRG)&&M_&&Math.abs(M_.x-L_.x)<4&&Math.abs(M_.y-(L_.y-89))<4,'a big cauldron (the ladle) of molten metal in the forge, its surface bubbling');
 ok(OB.ladle.w>=160&&A_('hazardband').filter(a=>Math.hypot(a.x+a.w/2-L_.x,a.y+a.h/2-L_.y)<200).length==4&&K('saferail').length>=2,'it is big, with a hazard band round it and rails in front');
 // the bubbles swell and pop, and each big pop makes a bloop (only while you're playing)
 const sv_=sfx;let bl=0;sfx=function(k){if(k=='blub')bl++};const m0=mode;try{mode='play';for(let t=0;t<12;t+=.016)CMFXI.molten.top(M_,t);const inPlay=bl;bl=0;mode='menu';for(let t=12;t<24;t+=.016)CMFXI.molten.top(M_,t);ok(inPlay>=6&&bl==0,'the molten metal bubbles and pops ('+inPlay+' pops with a bloop in 12 s; none behind the menu)')}finally{sfx=sv_;mode=m0}
 ok(typeof SF.blub=='function'&&typeof SF.weld=='function','the bloop and the weld crackle are real sounds')}
ok(K('furnace').filter(o=>IN(o,FRG)).length>=2&&K('arcfurn').filter(o=>IN(o,FRG)).length==1&&OB.furnace.h>=160&&OB.arcfurn.h>=160&&FX('smoke').length>=3,'large industrial furnaces and an arc furnace, smoke from their flues');
ok(K('bigfork').length>=4&&OB.bigfork.w>=OB.forklift.w*1.6&&OB.bigfork.h>=OB.forklift.h*1.6&&!K('forklift').length,'forklifts bigger than on any other map ('+OB.bigfork.w+'×'+OB.bigfork.h+' against '+OB.forklift.w+'×'+OB.forklift.h+'), carrying beams and coils');
{const ru=WS('rollup'),door=y=>ru.find(w=>Math.abs(w.y+w.h/2-y)<6&&w.x<TX-80&&w.x+w.w>TX+80);ok(door(560)&&door(1720),'a pull-through truck bay: roll-up doors in the north and south walls wide enough for a semi');
 ok(V('semif').some(o=>IN(o,TRK)&&Math.abs(o.x-TX)<4&&Math.abs(((o.r||0)%180+180)%180-90)<1)&&V('semi').length+V('flatbed').length+V('trailer').length>=3,'a semi with a flatbed of steel in the lane, more trailers in the yards');
 ok(K('bcrane').some(o=>IN(o,TRK)&&Math.abs(o.x-TX)<20)&&K('ycrane').length==1&&K('cranefoot').length==2&&PA('rails').length==2,'a couple of cranes for loading steel: the bridge crane over the truck lane and the gantry crane in the steel yard on its rails')}
{const bl=['blood','bloodpool','bloodsmear','bloodspray','bloodsplash','bloodcrawl','bloodfoot','handprint'].reduce((n,k)=>n+DC(k).length,0);
 ok(bl>=15&&bl<=60&&PA('bloodline').length>=2,'occasional blood ('+bl+' splashes, pools and prints, '+PA('bloodline').length+' trails), not everywhere');
 ok(DC('sheetbody').length>=1&&DC('bodybag').length>=4&&DC('deadz').length>=4&&K('weldhelm').length==1&&DC('scrawl').length>=1,'scenes where someone was attacked: a covered body, body bags, dead zombies, a welder\\'s dropped helmet, a warning on the floor');
 ok(V('amb').length==1&&FX('siren').length==1&&FX('hazard').length==1,'an ambulance that came too late, lights still going; a car run into a lot light, hazards blinking')}
{const fl=A_('floor').filter(a=>IN({x:a.x+a.w/2,y:a.y+a.h/2},OFF)),oa=(OFF[2]-OFF[0])*(OFF[3]-OFF[1]),sa=(SHOP[2]-SHOP[0])*(SHOP[3]-SHOP[1]);
 ok(fl.length>=3&&fl.every(a=>a.o.in)&&oa*8<sa,'a small office on the west side of the building (lobby, manager\\'s office, break room, restroom)');
 ok(K('deskpc').some(o=>IN(o,OFF))&&K('rdesk').some(o=>IN(o,OFF))&&K('wc').some(o=>IN(o,OFF))&&K('vending').filter(o=>IN(o,OFF)).length>=2,'with a desk, the reception counter, vending machines and a toilet');
 const DR=cmDoors(D),toShop=DR.filter(q=>!q.hz&&Math.abs(q.c-960)<6&&q.b>860&&q.a<1420).length,front=DR.filter(q=>!q.hz&&Math.abs(q.c-620)<6).length;ok(toShop>=3&&front==1,'doors from each office room into the shop ('+toShop+') and a front door to the lot')}
{const lot=A_('paving').find(a=>a.o.s=='gravel'&&a.x<100&&a.w>800),cars=['sedan','hatch','suv','pickup','van'].reduce((n,k)=>n+V(k).filter(o=>IN(o,LOT)).length,0);
 ok(lot&&cars>=30&&K('plight').filter(o=>IN(o,LOT)).length>=6&&K('billboard').length==1,'a gravel parking lot outside with '+cars+' parked cars, lot lights and the foundry sign')}
ok(A_('paving').some(a=>a.o.s=='gravel'&&IN({x:a.x+a.w/2,y:a.y+a.h/2},YARD))&&K('beams').filter(o=>IN(o,YARD)).length>=5,'a gravel steel yard with stacks of beams under the gantry crane');
// ---------- lights: the shop's high bays, the glow of the metal, the welding flashes ----------
{const L=cmLightSrc(D),near=(x,y,r)=>L.filter(s=>Math.hypot(s.x-x,s.y-y)<r),L_=K('ladle')[0];
 ok(near(L_.x,L_.y-90,10).some(s=>s.f=='fire'&&s.r>=250&&s.gs>1),'the molten metal lights the forge (a big flickering fire light with a strong glow)');
 const hb=L.filter(s=>IN(s,SHOP)&&s.r>=200&&s.ng);ok(K('highbay').length+K('highbayf').length>=24&&hb.length>=24&&K('highbayf').length>=2,'high-bay lights over the shop ('+hb.length+'), some failing, a few dead');
 const W=L.filter(s=>s.f=='weld');let on=0,off=0;for(let t=0;t<30;t+=.05){const n=cmLtNow(W[0],t,0);if(n>0)on++;else off++}ok(W.length==1&&IN(W[0],FRG)&&on>100&&off>100,'only the arc furnace arcs, on and off ('+on+' on, '+off+' off in 30 s)');
 ok(K('floodtower').length>=4&&K('walllight').length>=10,'flood towers in the yards, lights over the doors')}
// ---------- the game builds it ----------
mapId=16;S.mp=16;setGM('f');build();
ok(HS.CM==='builtin-foundry'&&WW==3520&&WH==2400&&BG.width==WW,'map 16 builds from foundry.json through the custom-map loader');
ok(MP.length==17&&MP[16].n=='Black Iron Foundry'&&MPD[16]&&/^data:image\\/jpeg/.test(MPI[16])&&MT[16]&&typeof CLM[16]=='function','map 16 has its name, description, picture, colours and a landmark on the campaign map');
ok(HS.LT&&HS.LT.t=='night'&&HS.NS&&HS.NS.length>=2,'night lighting; no zombie appears inside the building or the office');
start();{const C=HS.CX;ok(C&&C.O.filter(q=>q.o.k=='bcrane'||q.o.k=='ycrane').length==2&&C.T.some(q=>q.o.fx=='molten')&&C.T.filter(q=>q.o.fx=='weldarc').length==1,'the cranes hang over people; the molten metal and the arc furnace\\'s arcing run')}
// ---------- reach ----------
{const F=new Int16Array(gw*gh);bfs(F,HS.px,HS.py);
const RCH=(x,y)=>{const i0=Math.floor(x/gs),j0=Math.floor(y/gs);for(let r=0;r<=2;r++)for(let j=j0-r;j<=j0+r;j++)for(let i=i0-r;i<=i0+r;i++){const k=j*gw+i;if(k>=0&&k<gw*gh&&!bl[k])return F[k]>=0}return false};
const EDGE=()=>{let e=0,er=0;for(let i=0;i<gw;i++)for(const j of[0,gh-1]){const k=j*gw+i;if(!bl[k]){e++;if(F[k]>=0)er++}}for(let j=0;j<gh;j++)for(const i of[0,gw-1]){const k=j*gw+i;if(!bl[k]){e++;if(F[k]>=0)er++}}return[e,er]};
 const pl={'manager\\'s office':[700,980],lobby:[860,1200],'break room':[700,1300],restroom:[910,1390],'welding tables':[1360,960],'machine row':[1280,1390],'by the ladle':[2100,1320],furnaces:[1900,800],'power hammers':[1860,1250],'truck lane':[TX-70,1150],'east staging':[2990,1100],lot:[320,560],'west lot':[320,1300],'steel yard':[1880,360],'scrap yard':[1950,2100],'trailer yard':[3290,1100],'county road':[1600,2316]};
 const no=Object.keys(pl).filter(k=>!RCH(...pl[k]));ok(!no.length,'every room and place can be reached: '+(no.length?'not '+no.join(', '):'the office, every bay, the lot and the yards'));
 let lane=1;for(let y=20;y<2230;y+=8){const k=Math.floor(y/gs)*gw+Math.floor((TX-78)/gs);if(bl[k]){lane=0;break}}ok(lane,'a truck could drive straight through: the lane is open from the north gate to the county road');
 const[e,er]=EDGE();ok(e>300&&er>=e*.95,'zombies can walk to the player from the open edges ('+er+' of '+e+')')}
// ---------- the campaign: slot 5 of Wrong Turn; its survivor is Ken (his fight: tests/suites/ken-boss.js) ----------
ok(SEC[1].m[4]===16&&CORD.indexOf(16)==CORD.indexOf(10)+1&&!ccFree().some(([s,k])=>s==1),'the foundry is slot 5 of Wrong Turn, after Enchanted Forest');
ok(MUN[16]===17&&ccBossOf(16)===17&&UNM[17]===16&&CH[17].n=='Ken','Ken the welder holds out here');
// how a campaign map with no survivor yet plays (the foundry had none until Ken came): checked with Ken's spot emptied for now
const KEN=MUN[16];delete MUN[16];
const A=S.ac,bits=ms=>ms.reduce((v,m)=>v|1<<m,0),HT=[0,3,1,14,15];
A.un=[0,MUN[0],MUN[3],MUN[1],MUN[14],MUN[15],MUN[8]];A.tut=1;A.bm=[0,1,2].map(()=>bits(HT.concat([8])));delete A.sl;S.lm='off';setGM('c');
ok(mOpen(A,DIF(),16)&&/Survive 20 waves to clear it · survivor coming soon/.test(cMunT(16)),'it opens with the rest of Wrong Turn; its info says to survive 20 waves, survivor coming soon');
mapId=16;S.mp=16;sel=0;start();ok(mapId===16&&HS.CM==='builtin-foundry','a campaign run starts in the foundry');
const RNG=new Set([11,19]);
const play=(w0,w1,lim)=>{const R={spawned:0,reached:0,stuck:0,waves:0,err:'',sk:{}};try{for(let w=w0;w<=w1;w++){if(mode!='play')nextWave();let t=0;const seen=new Map();
 while(mode=='play'&&t<lim){for(const p of PL){p.mx=Math.max(p.mx,20);p.hp=p.mx}tick(1);t++;for(const z of zs){if(ZT[z.t].sv)continue;if(!seen.has(z)){seen.set(z,t);R.spawned++}
  const dz=Math.hypot(z.x-P.x,z.y-P.y);if(z.hp>0&&(dz<80||dz<400&&RNG.has(z.t))){R.reached++;hurt(z,z.hp+1,0,0)}else if(z.hp>0&&t-seen.get(z)>5000){R.stuck++;const k=z.t+'@'+Math.round(dz)+'('+Math.round(z.x)+','+Math.round(z.y)+')';R.sk[k]=(R.sk[k]||0)+1;hurt(z,z.hp+1,0,0)}}}
 if(mode=='play'){toSp=0;for(let q=0;q<4000&&mode=='play';q++){for(const z of zs.slice())if(z.hp>0)hurt(z,z.hp+1,0,0);toSp=0;tick(1)}}R.waves++}}catch(e){R.err=e.stack||e.message}return R};
{let R=play(1,3,5000);const R1=R;wave=18;zs=[];toSp=0;mode='shop';const R2=play(19,19,5000);R={spawned:R1.spawned+R2.spawned,reached:R1.reached+R2.reached,stuck:R1.stuck+R2.stuck,waves:R1.waves+R2.waves,err:R1.err||R2.err,sk:Object.assign(R1.sk,R2.sk)};
 ok(!R.err&&R.waves==4&&wave==19,'campaign waves 1–3 and 19 play through in the foundry '+R.err);
 ok(R.spawned>60&&R.stuck<=Math.max(2,R.spawned*.02),'zombies reach the player ('+R.reached+' of '+R.spawned+' reached; '+R.stuck+' slow ones '+JSON.stringify(R.sk)+')')}
{if(mode!='play')nextWave();ok(wave==20&&mode=='play'&&toSp>0&&!zs.some(q=>ZT[q.t].sv),'wave 20 plays like any wave: no survivor comes');
 let sv=0;for(let f=0;f<30000&&!CLR&&mode=='play';f++){for(const p of PL){p.mx=Math.max(p.mx,20);p.hp=p.mx}for(const z of zs.slice()){if(ZT[z.t].sv)sv=1;if(z.hp>0)hurt(z,z.hp+1,0,0)}tick(1)}
 ok(CLR&&!sv&&bBt(A,DIF(),16)&&!A.un.some(i=>UNM[i]===16),'clearing wave 20 wins the map: it counts as beaten, nobody joins');
 ok(FT.some(f=>/WAVE 20 SURVIVED/.test(f.t)),'"WAVE 20 SURVIVED!"');
 tick(Math.ceil(4/.016));ok(mode=='over'&&CWIN&&CWIN.ci==null&&CWIN.m===16,'then the map-complete screen');
 let h='';try{h=cwH()}catch(e){h='ERR '+e.message}ok(/BLACK IRON FOUNDRY COMPLETE/.test(h)&&/You survived all 20 waves/.test(h)&&/No survivor is holding out here yet/.test(h)&&!/data-ch/.test(h),'it says you survived all 20 waves and that no survivor holds out here yet');
 ok(/✓ Beaten on .* · survivor coming soon/.test(cMunT(16)),'the campaign map shows it beaten, survivor coming soon')}
{const L0=LBY,m0=mode;let h='';try{LBY={s:[{inp:'km',ac:'G',ci:0,rdy:0}]};GMD='c';mapId=16;S.mp=16;rL();h=String(ui.innerHTML||'')}catch(e){h='ERR '+e.message}LBY=L0;mode=m0;ok(/survive 20 waves \\(no survivor here yet\\)/.test(h),'the split-screen lobby says to survive 20 waves, no survivor here yet '+(/ERR/.test(h)?h:''))}
MUN[16]=KEN;ok(ccBossOf(16)===17&&/defeat <b>Ken<\\/b>/.test(cMunT(16)),'with Ken back, a save that cleared the foundry before he came is told to defeat Ken there: '+cMunT(16).replace(/<[^>]+>/g,''));
// ---------- old saves: nothing that was open closes ----------
{const old={bm:[0,1,2].map(()=>bits(HT.concat([8,2,9,10])))};ok(secDone(old,0,1)&&secOpen(old,0,2)&&!bBt(old,0,16)&&mOpen(old,0,16),'a save that had already finished Wrong Turn keeps it finished (Zombville stays open) and gets the foundry to play');
 const nw={bm:[0,1,2].map(()=>bits(HT))};ok(!secDone(nw,0,1),'a newer player has Wrong Turn to do');for(const m of[8,2,9,10])for(let d=0;d<3;d++)bmSet(nw,d,m);ok(!secDone(nw,0,1)&&!secOpen(nw,0,2),'and beating the other four after the foundry came still leaves it to beat before Zombville');
 for(let d=0;d<3;d++)bmSet(nw,d,16);ok(secDone(nw,0,1)&&secOpen(nw,0,2),'beating the foundry finishes the section');
 const T=cMerge([{bm:[0,1,2].map(()=>bits(HT.concat([8,2,9,10])))},{bm:[0,1,2].map(()=>bits(HT))}]);ok(secDone(T,0,1),'a team with an old save in it keeps Wrong Turn finished too');
 const c=dec(enc(Object.assign({},A,{bm:[bits([16]),0,0]})));ok(c&&c.bm&&(c.bm[0]>>16&1),'save codes keep the foundry\\'s beaten bit')}
// ---------- a custom map that sat in Wrong Turn's free slot moves ----------
{const O=ccClean({slots:{'1:4':{id:'y',b:2,n:'Rust Belt'}}});ok(!O.slots['1:4']&&O.slots['2:3']&&O.slots['2:3'].id=='y'&&O.mv&&/Rust Belt.*moved to slot 4 of Zombville.*Black Iron Foundry now fills slot 5 of Wrong Turn/.test(O.mv[0]),'a custom map in slot 5 of Wrong Turn moves to the first free slot after it, with a note: '+(O.mv||[''])[0]);
 const full={slots:{'1:4':{id:'y',b:2,n:'Rust Belt'}}};ccFree().forEach(([s,k],i)=>{full.slots[s+':'+k]={id:'f'+i,b:2,n:'F'+i}});const O2=ccClean(full);ok(!Object.values(O2.slots).some(a=>a.id=='y')&&Object.keys(O2.slots).length==ccFree().length&&/taken out of the campaign/.test(O2.mv[0]),'with no slot free it comes out of the campaign, with a note')}
// ---------- free play, the Workshop, the editor ----------
setGM('f');mapId=16;S.mp=16;start();{const R=play(1,1,4000);ok(!R.err&&wave>=1&&mapId===16,'a Free Play run plays '+R.err);if(mode!='play')nextWave();const row=olRow();ok(row&&row.map===16&&row.mode=='f','its leaderboard board is map 16');over(1)}
{const h=wsBuiltins();ok(h.includes('wsBuiltin(16,1)')&&h.includes('Black Iron Foundry'),'the Workshop lists the Black Iron Foundry under Built-in maps')}
await wsBuiltin(16,0);{const e=CML.find(q=>q.doc&&q.doc.name=='Black Iron Foundry (my copy)'),D2=bimDoc(16);ok(e&&e.doc.obj.length==D2.obj.length&&e.doc.walls.length==D2.walls.length,'EDIT A COPY makes your own copy with every piece')}
{const NK=['ladle','furnace','arcfurn','bigfork','weldtable','welder','lathe','pressbrake','drillpress','bandsaw','plasmatbl','grinder','phammer','quench','steelrack','beams','plates','coil','gascyl','scrapbin','saferail','weldhelm','cranefoot','bcrane','ycrane'];
 ok(NK.every(k=>OB[k]&&EDPN[k]&&EDPN[k][1]=='industry')&&EDCAT.some(c=>c[0]=='industry')&&EDPN.highbay&&EDPN.highbayf,'the foundry pieces are all in the editor, under Factory & foundry, plus the high-bay lights');
 ok(CMFXI.molten&&CMFXI.weldarc&&HWV('flatbed')&&HWV('semif')&&EDVN.flatbed&&EDVN.semif&&OB.bcrane.ov&&OB.ycrane.ov,'the molten metal and welding arc effects, the flatbed trailers, the cranes hanging over people');
 const g=document.createElement('canvas').getContext('2d');let err='';for(const k of NK.concat(['highbay','highbayf']))try{for(const v of[0,.4,.8])OB[k].f(g,100,100,v)}catch(e){err+=k+': '+e.message+' '}for(const k of['flatbed','semif'])try{hwDraw(g,{k,x:200,y:100,a:0,L:HWV(k)[0],W:HWV(k)[1]})}catch(e){err+=k+': '+e.message}ok(!err,'every piece draws '+err)}
mapId=16;build();ok(HS.CM==='builtin-foundry','map 16 is still the built-in Black Iron Foundry');
console.log('TOTAL fails '+fails+' of '+n);
}
`;
const AF=Object.getPrototypeOf(async function(){}).constructor;
new AF('docL','ivs',code+test)(docL,ivs).catch(e=>{console.log('FAIL crashed: '+(e&&e.stack||e));console.log('TOTAL fails 1');process.exitCode=1});
