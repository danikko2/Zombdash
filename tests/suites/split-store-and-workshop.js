// Night Ops stage 4: the split-screen store (a small store in each player's part of the screen), the Workshop's new map
// card and dialogs, the add-to-campaign page, and the map editor's grouped tools and library search.
// Runs the real game in Node with a fake browser (no IndexedDB here, so maps are kept in memory) and fake controllers.
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
const has=s=>ui.innerHTML.includes(s),settle=async()=>{for(let q=0;q<30;q++)await 0};
const mkPad=i=>({index:i,connected:true,buttons:Array.from({length:17},()=>({pressed:false,value:0})),axes:[0,0,0,0]});
const PADS=[mkPad(0),mkPad(1)];Object.defineProperty(globalThis,'navigator',{value:{getGamepads:()=>PADS},configurable:true});
const press=(p,b)=>{PADS[p].buttons[b].pressed=true;tick(1);PADS[p].buttons[b].pressed=false;tick(1)};
S.ac.un=[0,1,2,3];sv();tick(5);
// ---------- split-screen store: a small store in each player's part of the screen ----------
setGM('f');mapId=0;lobby();joinL(0);joinL(1);ok(LBY.s.length==3&&LBY.s[0].inp=='km','three players: keyboard & mouse and two controllers');
startMP();ok(MPn==3&&PL.length==3,'split-screen game with three players');
wave=1;shop();ok(mode=='shop'&&has('class="nx msx"')&&(ui.innerHTML.match(/<section class="msp/g)||[]).length==4,'a store panel per player, plus one for the empty quarter');
ok(['GUNS','GEAR','AMMO','HEALTH'].every(t=>has('>'+t+'</button>')),'each store has the GUNS / GEAR / AMMO / HEALTH tabs');
ok(has('data-gn=')&&!has('data-gun='),'gun pictures without the arm');
ok(has('SUPPLY STOP')&&has('shopping'),'the empty quarter says what is next and who is still shopping');
ok(has('>Q</span>')&&has('>LB</span>'),'key hints match each player: Q / E on the keyboard, LB / RB on a controller');
msTab(1,'ammo');ok(PL[1].sx.t=='ammo'&&PL[0].sx.t=='guns'&&PL[2].sx.t=='guns','every player has their own tab');msTab(1,'guns');
PL[1].cash=1000;const c1=pc(120,PL[1]);msSel(1,'g',1);msAct(1);ok(PL[1].own.includes(1)&&PL[1].cash==1000-c1&&!PL[0].own.includes(1),'player 2 buys an SMG with their own money');
msSell(1);ok(!PL[1].own.includes(1)&&PL[1].cash==1000-c1+Math.round(c1*.6),'and sells it back for 60%');
const t0=PL[1].sx.t;press(0,5);ok(PL[1].sx.t!==t0&&PL[0].sx.t=='guns','RB on pad 1: player 2 goes to the next tab');press(0,4);ok(PL[1].sx.t==t0,'LB goes back');
msSel(1,'g',0);press(0,13);ok(PL[1].sx.g==1,'down picks the next gun');press(0,0);ok(PL[1].own.includes(1),'A buys it');press(0,2);ok(!PL[1].own.includes(1),'X sells it');
msKey('e');ok(PL[0].sx.t=='gear','E: the keyboard player goes to the next tab');msKey('s');ok(PL[0].sx.gr==EXL[0],'S: next item');msKey('q');
press(0,9);ok(PL[1].rdy&&has('Waiting for P1 and P3'),'START: ready, and the panel says who it waits for');
press(0,1);ok(!PL[1].rdy,'B: back to shopping');
msReady(1,1);ok(mode=='shop','the wave waits for everyone');const w0=wave;msKey(' ');ok(PL[0].rdy==1&&mode=='shop','Space: ready (keyboard)');msReady(2,1);ok(mode=='play'&&wave==w0+1,'the next wave starts when the last player is ready');
menu();
// ---------- Workshop: new map card, dialogs ----------
await workshop();wsNew();ok(has('NEW MAP')&&has('BLANK MAP')&&has('A COPY OF A MAP')&&has('MEDIUM')&&has("WHAT YOU'LL GET")&&has('class="nx wmo'),'New map: one card over the Workshop with a preview');
ok(has('inert aria-hidden=true')&&has('hubbar'),'the Workshop stays underneath but can\\'t be reached while the card is open');
wsNSz('l');ok(WSN.w==100&&WSN.h==80&&has('100 × 80 tiles'),'LARGE sets 100 × 80 and the preview says so');
WSN.g='sand';wsNewNX();ok(has('sand')&&has('All '+CMTER.length),'ground swatches, with every ground one pick away');
WSN.from='copy';wsNewNX();ok(has('PICK A MAP TO COPY')&&has('COPY &amp; START BUILDING')&&has('Suburb'),'it can start from a copy of a map instead');WSN.from='blank';
WSN.name='Beach Bash';await wsCreate();ok(mode=='edit'&&ED&&ED.d.name=='Beach Bash'&&ED.d.w==100&&ED.d.h==80&&ED.d.ground=='sand','CREATE makes the map with that name, size and ground, and opens the editor');
ok(EDTG.flatMap(g=>g[1]).sort().join()==EDT.map(t=>t[0]).sort().join()&&EDT.every(t=>EDTN[t[0]]),'editor top bar: every tool sits in a named group with a short name');
{const r=edFindAll('car');ok(r.includes('data-a="asset:')&&r.includes('Police car')&&r.indexOf('Props &amp; vehicles')<r.indexOf('>Ground <'),'one search over the whole library, best matches first');ok(edFindAll('zzqx').includes('Nothing matches'),'and it says when nothing matches')}
edClose();await settle();
let i=CML.findIndex(e=>e.meta.name=='Beach Bash');ok(i>=0,'the new map is in the Workshop');
wsRename(i);ok(has('RENAME MAP')&&has('SAVE NAME')&&has('data-esc')&&has('16 / 40')==false&&has('10 / 40'),'rename dialog, with a letter count');
document.getElementById('wsrn').value='Sand Trap';await wsRenameOk(i);await settle();ok(CML.some(e=>e.meta.name=='Sand Trap'),'rename works');
i=CML.findIndex(e=>e.meta.name=='Sand Trap');wsDel(i);ok(has('DELETE THIS MAP?')&&has('EXPORT A BACKUP FIRST')&&has("can't be brought back")&&has('KEEP IT'),'delete asks first and offers a backup');
await workshop();WSIF='notamap.json';await wsImportText('{"format":"zombdash-map","version":1,"width":3}');ok(has("COULDN'T IMPORT IT")&&has('Nothing was changed')&&has('notamap.json')&&has('PICK ANOTHER FILE'),'import problems in plain words, with the file name');
// ---------- adding a map to the campaign ----------
await workshop();const e=CML.find(x=>x.meta.name=='Sand Trap');wcOpen(e.id,'ws');
ok(has('PICK AN EMPTY SPOT')&&has("WHO'S THE BOSS AT WAVE 20?")&&(ui.innerHTML.match(/data-ch=/g)||[]).length==14,'campaign page: an empty spot, then the boss');
ok(has('Hometown and Wrong Turn are full')&&has('Urban Outskirts')&&has('Not offered'),'full sections are named, built-in maps show in their slots');
wcSlot(4,1);ok(has('PUT IN ISLAND')&&has('Island · slot 2')&&has('id=wcgo'),'picking a spot fills in where it goes');
await wcSave();ok(ccSlot(4,1)&&ccSlot(4,1).key===cmKeyById(e.id),'PUT IN puts it in that slot');
wcOpen(e.id,'ws');document.getElementById('wcrep').value='3';wcRepAsk();ok(has('PLAY THIS INSTEAD?')&&has('class="nx wmo'),'playing it instead of a campaign map asks first, over the page');
// ---------- the last older screens: options, accounts, online, name, account codes ----------
menu();options(0);ok(has('nx npg opts')&&has('nxtop')&&has('Music')&&has('id=dvc')&&!has('class="p'),'Options: the new page look with its cards');
mode='play';pauseMenu();options(1);ok(has('nx npg opts')&&has("pauseMenu()")&&!has('nxHome()')&&!has('options(0)'),'Options from pause: back to the pause menu, no Main Menu or settings button');mode='menu';OPF=0;
accounts(0);ok(has('nx npg accs')&&has('ON THIS DEVICE'.toLowerCase().replace(/^./,c=>c.toUpperCase()))||has('On this device'),'Accounts page');ok(has('NEW PROFILE')&&has('ENTER CODE')&&has('showCode(0)'),'Accounts: profiles, codes');
newProf();ok(has('wmo npd')&&has('id=pnm')&&has('data-ent'),'new profile is a small card');showCode(0);ok(has('ACCOUNT CODE')&&has('ZD.'),'account code card');
codeIn();document.getElementById('cdi').value=enc(S.ac);chkCode();ok(has('CODE OK')&&has('UPDATE MY ACCOUNT'),'entering a code: CODE OK card');
olMenu();ok(has('nx npg olp')&&has('Leaderboards')&&!has('class="p'),'Online page');
const nm=S.ac.name;S.ac.name='';nameScreen(0);ok(has('NEW SURVIVOR')&&has('CREATE ACCOUNT')&&has('wmo npd'),'first-run name card');S.ac.name=nm;
console.log('TOTAL fails '+fails+' of '+n);
`;
const AF=Object.getPrototypeOf(async function(){}).constructor;
new AF('docL','ivs',code+test)(docL,ivs).catch(e=>{console.log('FAIL crashed: '+(e&&e.stack||e));console.log('TOTAL fails 1');process.exitCode=1});
