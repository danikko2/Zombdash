// Map Workshop step 3: custom maps in the campaign. The free "Coming Soon" slots, the wave-20 boss choice, section rules,
// progress kept apart from the built-in beaten-map masks, Free Play unlock, replacing / restoring a campaign map,
// checkpoints, leaderboards, and what happens when a map in the campaign is deleted or can't be opened.
// Runs the real game in Node with a fake browser (no IndexedDB here, so maps are kept in memory, as on browsers without it).
const fs=require('fs');const html=fs.readFileSync(process.argv[2],'utf8');
const code=html.slice(html.lastIndexOf('<script>')+8,html.lastIndexOf('</script>'));
global.ImageData=class{constructor(d,w,h){this.data=d}};
const ctx=new Proxy({},{get:(t,k)=>k=='getImageData'?(x,y,w,h)=>({data:new Uint8ClampedArray(w*h*4).fill(120)}):k=='createImageData'?(w,h)=>({data:new Uint8ClampedArray(w*h*4)}):k=='measureText'?()=>({width:30}):()=>{},set:()=>true});
const mkEl=()=>({style:{setProperty(){}},dataset:{},innerHTML:'',className:'',classList:{add(){},remove(){},toggle(){},contains(){return false}},getContext:()=>ctx,addEventListener(){},remove(){},querySelector(){return null},querySelectorAll(){return[]},width:0,height:0});
const els={};const docL={};global.document={hidden:false,getElementById:id=>els[id]||(els[id]=mkEl()),createElement:()=>mkEl(),addEventListener(e,f){(docL[e]=docL[e]||[]).push(f)},body:mkEl()};
global.innerWidth=1280;global.innerHeight=800;global.addEventListener=()=>{};global.localStorage={};global.requestAnimationFrame=()=>{};
global.Image=class{constructor(){this.complete=true;this.naturalWidth=1}addEventListener(){}};global.NOW_=0;global.performance={now:()=>global.NOW_};
const P_=()=>({value:0,setValueAtTime(){},linearRampToValueAtTime(){},exponentialRampToValueAtTime(){},setTargetAtTime(){}});
const node=()=>({connect(){},disconnect(){},start(){},stop(){},frequency:P_(),gain:P_(),detune:P_(),Q:P_(),pan:P_(),threshold:P_(),ratio:P_(),type:'',setPeriodicWave(){},buffer:null,loop:false});
global.AT_=0;global.AudioContext=class{constructor(){this.state='running';this.sampleRate=8000;this.destination={}}get currentTime(){return global.AT_}createGain(){return node()}createOscillator(){return node()}createBiquadFilter(){return node()}createBufferSource(){return node()}createStereoPanner(){return node()}createDynamicsCompressor(){return node()}createPeriodicWave(){return{}}createBuffer(c,n){return{getChannelData:()=>new Float32Array(n)}}resume(){}};
const ivs=[];global.setInterval=f=>{ivs.push(f)};global.TQ=[];global.setTimeout=(f,ms)=>{TQ.push([global.AT_+(ms||0)/1000,f]);return TQ.length};global.clearTimeout=()=>{};
const test=`;S.ac.name='Tester';delete S.ac.cp;S.dlc=1;
docL.pointerdown[0]();endIntro();
const tick=n=>{for(let i=0;i<n;i++){AT_+=.016;NOW_+=16;for(const f of ivs)f();for(let q=TQ.length-1;q>=0;q--)if(TQ[q][0]<=AT_){const g=TQ[q][1];TQ.splice(q,1);g()}loop(NOW_)}};
let fails=0,n=0;const ok=(c,m)=>{n++;if(c)console.log('PASS '+m);else{fails++;console.log('FAIL '+m)}};
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const bits=L=>L.reduce((v,m)=>v|1<<m,0);
// progress: Hometown beaten on Medium, and the first map of Wrong Turn (Deadway Highway, 8)
const A=S.ac;A.bm=[0,bits([0,3,1,14,15,8]),0];A.un=[0,2,3,1,15,16,9];const BM0=JSON.stringify(A.bm);
// three maps on the device
const mkMap=(name,w)=>{const d=cmNew({name,w:w||40,h:30});d.start={x:640,y:480};return d};
const dA=mkMap('Junkyard'),dB=mkMap('My Suburb'),dC=mkMap('Spare');
for(const d of[dA,dB,dC])await msWrite([['put','maps',{id:d.id,json:cmWrite(d)}],['put','meta',{id:d.id,name:d.name,w:d.w,h:d.h,updated:new Date().toISOString(),thumb:''}]]);
await cmLoadAll();const kA=cmKeyById(dA.id),kB=cmKeyById(dB.id),kC=cmKeyById(dC.id);
ok(kA>=1000&&kB>=1000&&kC>=1000,'the maps are loaded with their keys');
// ---------- the slots ----------
const FREE=ccFree();ok(FREE.length==9,'there are 9 free Coming Soon slots in SEC (not 7)');
ok(same(FREE,[[1,4],[2,3],[2,4],[3,3],[3,4],[4,1],[4,2],[4,3],[4,4]]),'they are: Wrong Turn 5, Zombville 4-5, Countryside 4-5, Island 2-5');
ok(SEC.every((s,i)=>s.m.length==5)&&same(SORD.length,16),'SEC itself is unchanged (16 built-in maps)');
// ---------- the boss list ----------
ok(same(CCBOSS.slice().sort((a,b)=>a-b),[1,2,3,4,5,6,7,8,9,10,11,12]),'bosses on offer: the 12 whose fights work on any map');
ok([13,14,15,16].every(ci=>!CCBOSS.includes(ci)&&CCNOT[ci]),'not on offer, each with a reason: Ice Cream Man, Fire Chief, Penny, the Mayor');
ok(same([...CCBOSS,13,14,15,16].sort((a,b)=>a-b),Object.values(MUN).sort((a,b)=>a-b)),'every survivor boss is either offered or listed as needing their own map');
ok(ccBossFor(1)==9&&ccBossFor(4)==7&&ccBossFor(2)==12,'a slot starts with a boss from its own section (Wrong Turn: Officer Ray)');
// ---------- assigning ----------
ok(!ccAssign(dA.id,0,0,2),'a built-in map spot is not a free slot');ok(!ccAssign(dA.id,1,4,13),'a boss that needs its own map is refused');
ok(ccAssign(dA.id,1,4,9)&&ccSlot(1,4).key===kA&&ccSlot(1,4).b===9,'put Junkyard in Wrong Turn slot 5 with Officer Ray');
ok(!ccAssign(dC.id,1,4,9),'a slot holds one map: another map is refused there');
ok(ccAssign(dA.id,2,3,10)&&!ccSlot(1,4)&&ccSlot(2,3).key===kA,'assigning again moves it (one place at a time)');ccAssign(dA.id,1,4,9);
{const r=await msGet('kv','campaign');ok(r&&r.slots['1:4'].id===dA.id&&r.slots['1:4'].b===9,'slots are stored on the device next to the maps (IndexedDB)');
sv();ok(!String(localStorage.deadyard).includes(dA.id)&&!('cmslots' in S),'and not in the save data')}
// ---------- campaign rules ----------
ok(secOf(kA)===1&&secOf(kC)===-1,'section: the slot decides it; a map that is not in a slot has none');
ok(mOpen(A,1,kA),'the slot is open: its section is open and the section start (Deadway Highway) is beaten');
{const keep=A.bm[1];A.bm[1]=bits([0,3,1,14,15]);ok(!mOpen(A,1,kA),'it stays locked until the section start is beaten');A.bm[1]=keep}
ok(!mOpen(A,1,kC),'a map that is not in a slot is never a campaign map');
{const keep=A.bm[1];A.bm[1]|=bits([2,9,10]);ok(secDone(A,1,1)&&secOpen(A,1,2)&&!bBt(A,1,kA),'custom slots are optional: Wrong Turn is done and Zombville opens without it');A.bm[1]=keep}
ok(cFront(A,1)===2&&campNx&&!SORD.includes(kA),'the campaign front only ever points at built-in maps');
// the map screens
setGM('c');mapId=8;CMV=1;CSEL=null;cMap();ok(ui.innerHTML.includes('cnode cu')&&ui.innerHTML.includes('Junkyard'),'section map: the custom slot shows with its name');
ok(ui.innerHTML.includes('custom 0/1'),'the section header counts custom maps separately');
cPick(kA);ok(mapId===kA&&S.mp!==kA&&ui.innerHTML.includes('Officer Ray')&&ui.innerHTML.includes('optional'),'picking it: its info names the boss; S.mp never holds a custom key');
ok(ui.innerHTML.includes('boss &amp; slot')||ui.innerHTML.includes('boss & slot'),'single player offers the boss & slot links');
{const keep=A.bm[1];A.bm[1]|=bits([2,9,10]);CMV=2;cSlotPick(2,3);ok(ui.innerHTML.includes('Coming Soon')&&ui.innerHTML.includes('ADD A MAP'),'an empty slot offers ADD A MAP');A.bm[1]=keep}
cGo('w');ok(ui.innerHTML.includes('+1 custom'),'the world map mentions the custom map');
// split-screen campaign picker
LBY={s:[{inp:'km',ac:S.ac,ci:0,v:0,rdy:1},{inp:0,ac:'G',ci:1,v:0,rdy:1}]};CMLB=1;mapId=kA;CMV=1;cMap();ok(ui.innerHTML.includes('Junkyard')&&ui.innerHTML.includes('CHOOSE')&&!ui.innerHTML.includes('boss &amp; slot')&&!ui.innerHTML.includes('boss & slot'),'split screen: the custom slot is there to choose (no management links)');
clbGo();ok(CMLB===0&&mapId===kA&&S.mp!==kA,'choosing it in the lobby keeps it picked');ok(mapOK(kA,lobAcs()),'and it is playable for the lobby');
// ---------- a run on the custom slot ----------
LBY=null;mapId=kA;sel=0;S.sw=1;start();
ok(mode=='play'&&mapId===kA&&HS.CM===dA.id,'a campaign run on the custom map');
ok(zCamp()===ZCFG.camp[1],'it uses its section\\'s zombie line-up and caps (Wrong Turn)');
ok(LIVES===3,'campaign lives (3 on Medium)');
ok(cmpI()===Math.max(...[8,2,9,10].map(m=>CORD.indexOf(m))),'difficulty scaling: as the toughest map of its section');
ok(cBossNow()===9,'the wave-20 boss is the one picked');
wave=19;nextWave();const svb=zs.find(z=>z.t==15);ok(svb&&svb.ci===9&&toSp===0,'wave 20: Officer Ray comes out, no other zombies');
for(let i=0;i<60;i++){P.hp=P.mx=99;tick(1)}ok(svb.hp>0&&mode=='play','the boss fight runs on a custom map');
{const un0=JSON.stringify(A.un);svDown(svb);ok(JSON.stringify(A.bm)===BM0,'beating the boss never touches the built-in beaten-map masks');
ok(ccBt(A,1,dA.id)&&ccBt(A,0,dA.id)&&!ccBt(A,2,dA.id)&&A.cmc[dA.id]===2,'it is recorded by the map\\'s id in A.cmc (Medium, which counts for Easy)');
ok(JSON.stringify(A.un)===un0,'the survivor does not join here (they join from their own map)');
ok(KN&&KN.cu&&bBt(A,1,kA),'the survivor gives up, and the slot shows as beaten');
campWin();ok(CWIN.m===kA&&ui.innerHTML.includes('JUNKYARD COMPLETE')&&ui.innerHTML.includes('gives up')&&ui.innerHTML.includes('Free Play'),'the normal end-of-map screen, telling what was won')}
// ---------- Free Play ----------
setGM('f');ok(mapOK(kA)&&mapOK(kC),'Free Play: the beaten custom map is open; maps never in the campaign always are');
ccAssign(dC.id,3,3,5);ok(!mapOK(kC)&&/In the campaign/.test(munT(kC)),'a map in a campaign slot is locked in Free Play until beaten there');
ok(mapOK(kC,[S.ac,{name:'P2',cmc:{[dC.id]:1}}]),'beaten by any of the players opens it (split screen)');
// ---------- removing keeps progress ----------
ccUnassign(dA.id);ok(!ccSlot(1,4)&&ccBt(A,1,dA.id),'removing a map from its slot keeps its progress');
ccAssign(dA.id,1,4,9);ok(bBt(A,1,kA),'putting it back: still beaten');
// ---------- progress isolation ----------
{const m0=JSON.stringify(A.bm);bmSet(A,2,kA);ok(JSON.stringify(A.bm)===m0&&ccBt(A,2,dA.id),'bmSet on a custom key writes the custom record, never a mask bit');
bmSet(A,1,99);bmSet(A,1,-1);ok(JSON.stringify(A.bm)===m0,'nothing outside the built-in map numbers reaches the masks');
ok(typeof dA.id=='string'&&!/^\\d+$/.test(dA.id),'custom ids are strings, so they can never collide with a map number')}
{const T=cMerge([{name:'a',bm:[0,0,0],cmc:{[dA.id]:1}},{name:'b',bm:[0,0,0],cmc:{[dC.id]:4}}]);ok(T.cmc[dA.id]===1&&T.cmc[dC.id]===4,'split screen merges custom progress too')}
// ---------- leaderboards ----------
setGM('c');mapId=kA;start();RUN0=Date.now()-60000;RUNW=1;wave=5;ok(olRow()===null,'a campaign run on a custom map posts no leaderboard score');
// ---------- checkpoints ----------
cpClear();wave=4;kills=20;nextWave();{const c=JSON.parse(localStorage[CPK]||'null');ok(c&&c.gm=='c'&&c.cm===dA.id&&c.m===-1&&c.w==4,'checkpoint on a custom campaign map (by the map\\'s id)')}
ok(cpOK()&&cpMap(cpOK())===kA,'it is offered');over(1);localStorage[CPK]=JSON.stringify(Object.assign(JSON.parse('{"v":1,"an":"Tester","gm":"c","m":-1,"ci":0,"d":1,"w":6,"k":30,"L":2,"IW":{},"BB":[],"LB":0,"p":{"cash":120,"hp":5,"mx":5,"ar":0,"own":[0],"cur":0,"mg":{},"am":{},"paid":{},"v":0}}'),{t:Date.now(),cm:dA.id}));
cpResume();ok(mode=='shop'&&mapId===kA&&wave==6&&LIVES==2&&zCamp()===ZCFG.camp[1],'resume: back on the custom campaign map, same wave and lives');
ccUnassign(dA.id);ok(!cpOK(),'once the map is out of its slot the campaign checkpoint is not offered');ccAssign(dA.id,1,4,9);cpClear();over(1);
// ---------- replacing a campaign map ----------
ok(ccRepOK(0)&&ccRepOK(8)&&!ccRepOK(12)&&!ccRepOK(13)&&!ccRepOK(14)&&!ccRepOK(15),'maps can be replaced when their own boss works anywhere (not City Park, Downtown, Market, Main Street)');
ok(!ccSetRep(dB.id,12),'replacing one of those is refused');
ok(ccSetRep(dB.id,0)&&ccRep(0).key===kB,'My Suburb plays instead of Suburb');
{const r=await msGet('kv','campaign');ok(r.rep[0].id===dB.id,'stored on the device')}
setGM('c');mapId=0;sel=0;start();
ok(mapId===kB&&HS.CM===dB.id&&CREP&&CREP.o===0,'starting Suburb in the campaign plays the custom map');
ok(secOf(mapId)===0&&cmpI()===CORD.indexOf(0)&&cBossNow()===MUN[0]&&zCamp()===ZCFG.camp[0],'section, difficulty scaling and boss stay Suburb\\'s');
ok(bBt(A,1,mapId)===bBt(A,1,0),'progress is read from Suburb');
cpClear();wave=3;nextWave();{const c=JSON.parse(localStorage[CPK]||'null');ok(c&&c.m===0&&c.cr===dB.id&&!c.cm,'checkpoint: kept on Suburb, noting which map replaced it')}
ok(cpOK()&&/My Suburb/.test(cpBanner()),'the menu offers to resume it (naming the custom map)');
cpResume();ok(mapId===kB&&CREP&&CREP.o===0&&wave===3,'resume plays the replacement again');
{const A2=JSON.parse(JSON.stringify(A));A2.bm=[0,0,0];S.prof.push(A2);const keepAc=S.ac;
wave=19;nextWave();const b=zs.find(z=>z.t==15);ok(b&&b.ci===MUN[0],'wave 20: Suburb\\'s own survivor');
A.bm[1]&=~1;const un0=A.un.slice();svDown(b);ok(bBt(A,1,0)&&!A.cmc[dB.id],'beating it marks Suburb beaten (progress tied to the original map number), not the custom map');
ok(A.un.includes(MUN[0]),'and the survivor joins, as on Suburb');campWin();ok(CWIN.m===0&&ui.innerHTML.includes('SUBURB COMPLETE'),'the end screen is Suburb\\'s');S.prof.pop()}
over(1);menu();ok(mapId===0&&!CREP,'leaving the run puts Suburb back as the picked map');
ok(olRow()===null,'no leaderboard score from a replaced map');
// one click restores the original
cMap();ok(ui.innerHTML.includes('crp')&&ui.innerHTML.includes('restore Suburb'),'the campaign map marks Suburb as replaced, with a restore link');
ccBack(0);ok(!ccRep(0)&&!CCS.rep[0],'restore: one click');
mapId=0;start();ok(mapId===0&&!CREP&&HS.CM==='builtin-suburb','Suburb plays the original again (its own map file)');over(1);
cpClear();localStorage[CPK]=JSON.stringify({v:1,t:Date.now(),an:'Tester',gm:'c',m:0,cr:dB.id,ci:0,d:1,w:6,k:0,p:{cash:0}});ok(!cpOK(),'a checkpoint from the replacement is not offered after a restore');cpClear();
// a map is in one place: a slot or a replacement
ccSetRep(dB.id,3);ccAssign(dB.id,4,1,7);ok(!ccRep(3)&&ccSlot(4,1).key===kB,'putting a replacement in a slot ends the replacement');
ccSetRep(dB.id,3);ok(!ccSlot(4,1)&&ccRep(3).key===kB,'and the other way round');ccRestore(3);
// ---------- the Workshop dialog ----------
await workshop();ok(ui.innerHTML.includes('Campaign: Wrong Turn, slot 5')&&ui.innerHTML.includes('>campaign<'),'Workshop: each map says where it is in the campaign, with a campaign link');
wcOpen(dC.id,'ws');ok(/CAMPAIGN · Spare/.test(ui.innerHTML)&&(ui.innerHTML.match(/data-ch=/g)||[]).length==12&&ui.innerHTML.includes('Not offered'),'the dialog: free slots, 12 bosses to pick from, and who is not offered');
ok(ui.innerHTML.includes('Junkyard')&&ui.innerHTML.includes(' disabled'),'a slot taken by another map is shown and can\\'t be picked');
wcSlot(2,4);wcBoss(12);await wcSave();ok(ccSlot(2,4)&&ccSlot(2,4).key===kC&&ccSlot(2,4).b===12&&!ccSlot(3,3),'pick a slot and a boss, PUT IN SLOT (it moves)');
wcOpen(dC.id,'ws');document.getElementById('wcrep').value='3';wcRepAsk();ok(ui.innerHTML.includes('PLAY THIS INSTEAD?')&&!ccRep(3),'replacing asks for confirmation first (nothing changes yet)');
wcRepOk(3);ok(ccRep(3)&&ccRep(3).key===kC&&!ccSlot(2,4),'confirmed: it plays instead of School');
await workshop();wcOpen(dC.id,'ws');ok(ui.innerHTML.includes('RESTORE SCHOOL'),'the dialog offers to restore School');wcRestore(3);ok(!ccRep(3),'restored');
// ---------- deleted maps and maps that can't be opened ----------
ccAssign(dC.id,3,4,5);await workshop();{const i=CML.findIndex(e=>e.id===dC.id);await wsDelOk(i);for(let q=0;q<20;q++)await 0}
ok(!ccSlot(3,4)&&!CCS.slots['3:4']&&/taken out of the campaign/.test(ui.innerHTML),'deleting a map in the Workshop takes it out of its slot');
// a map that disappears some other way (cleared storage): the slot goes back to Coming Soon with a warning
const dD=mkMap('Gone Soon');await msWrite([['put','maps',{id:dD.id,json:cmWrite(dD)}],['put','meta',{id:dD.id,name:dD.name,w:40,h:30,updated:new Date().toISOString(),thumb:''}]]);await cmLoadAll();
ccAssign(dD.id,4,4,6);await msWrite([['del','maps',dD.id],['del','meta',dD.id]]);await cmLoadAll();
ok(!CCS.slots['4:4']&&CCW.some(w=>/Gone Soon/.test(w)),'a map that is gone: its slot is free again, with a warning naming it');
const BMK=A.bm[1];A.bm[1]=bits(SORD.filter(m=>m!==5));let crash='';try{setGM('c');CMV=4;cMap();cSec(4)}catch(e){crash=e.message}ok(!crash&&(ui.innerHTML.match(/Coming Soon/g)||[]).length>=3,'the campaign map still draws: Coming Soon '+crash);
// a map that is still here but can't be opened keeps its place, shown as Coming Soon
const dE=mkMap('Broken Later');await msWrite([['put','maps',{id:dE.id,json:cmWrite(dE)}],['put','meta',{id:dE.id,name:dE.name,w:40,h:30,updated:new Date().toISOString(),thumb:''}]]);await cmLoadAll();
ccAssign(dE.id,4,3,6);const kE=cmKeyById(dE.id);await msWrite([['put','maps',{id:dE.id,json:{format:'zombdash-map',version:99}}]]);await cmLoadAll();
ok(CCS.slots['4:3']&&!ccSlot(4,3)&&ccSlotBad(4,3)&&CCW.some(w=>/Broken Later/.test(w)&&/Coming Soon/.test(w)),'a map that can\\'t be opened keeps its slot but shows Coming Soon, with a warning');
crash='';try{CMV=4;cSlotPick(4,3)}catch(e){crash=e.message}ok(!crash&&ui.innerHTML.includes('can\\'t be opened'),'its slot explains why '+crash);A.bm[1]=BMK;
crash='';try{mapId=kE;setGM('c');start()}catch(e){crash=e.message}ok(!crash&&!cmIs(mapId)&&mode=='play','starting it anyway falls back to a campaign map, no crash '+crash);over(1);
await workshop();ok(ui.innerHTML.includes('remove from campaign'),'the Workshop can take a broken map out of the campaign');{const i=CML.findIndex(e=>e.id===dE.id);wsCampOut(i)}ok(!CCS.slots['4:3'],'done');
// a replacement whose map is gone: the original plays
ccSetRep(dA.id,1);await msWrite([['put','maps',{id:dA.id,json:{format:'zombdash-map',version:99}}]]);await cmLoadAll();setGM('c');mapId=1;start();ok(mapId===1&&!CREP&&HS.CM===undefined,'a replacement that can\\'t be opened: the original map plays');over(1);
// ---------- reload: everything comes back ----------
await msWrite([['put','maps',{id:dA.id,json:cmWrite(dA)}]]);ccRestore(1);ccAssign(dA.id,1,4,9);CCLD=0;CCS={slots:{},rep:{}};await cmLoadAll();
ok(ccSlot(1,4)&&ccSlot(1,4).b===9,'after a reload the slots come back from the device');
ok(same(ccClean({slots:{'0:0':{id:'x',b:2},'1:4':{id:'y',b:13},'2:3':{id:'y',b:2}},rep:{12:{id:'z'},0:{id:'w'}}}),{slots:{'1:4':{id:'y',b:2,n:''}},rep:{0:{id:'w',n:''}}}),'a stored record is checked: only free slots, allowed bosses, replaceable maps, one place per map');
// ---------- split screen ----------
setGM('c');LBY={s:[{inp:'km',ac:S.ac,ci:0,v:0,rdy:1},{inp:0,ac:'G',ci:1,v:0,rdy:1}]};mapId=cmKeyById(dA.id);startMP();
ok(MPn==2&&mapId===cmKeyById(dA.id)&&zCamp()===ZCFG.camp[1]&&cBossNow()===9&&PL.length==2,'split screen plays a custom slot with its section rules and boss');
wave=19;nextWave();{const b=zs.find(z=>z.t==15);ok(b&&b.ci===9,'split screen: the boss comes at wave 20')}MPn=0;over(1);
ccSetRep(dB.id,0);mapId=0;startMP();ok(MPn==2&&mapId===cmKeyById(dB.id)&&CREP&&CREP.o===0,'split screen plays the replacement too');MPn=0;over(1);rL();ok(mapId===0&&!CREP,'back in the lobby the original map is picked');ccRestore(0);LBY=null;
// ---------- the built-in campaign is unchanged ----------
ok(JSON.stringify(A.bm[0])===JSON.stringify(JSON.parse(BM0)[0])&&(A.bm[1]&bits([0,3,1,14,15,8]))===bits([0,3,1,14,15,8]),'built-in campaign progress was never lost');
setGM('c');mapId=3;start();ok(mapId===3&&cBossNow()===MUN[3]&&secOf(3)===0&&cmpI()===CORD.indexOf(3),'a built-in campaign map plays exactly as before');over(1);
console.log('TOTAL fails '+fails+' of '+n);
`;
const AF=Object.getPrototypeOf(async function(){}).constructor;
new AF('docL','ivs',code+test)(docL,ivs).catch(e=>{console.log('FAIL crashed: '+(e&&e.stack||e));console.log('TOTAL fails 1');process.exitCode=1});
