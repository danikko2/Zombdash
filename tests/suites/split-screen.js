const fs=require('fs');const html=fs.readFileSync(process.argv[2],'utf8');
const code=html.slice(html.lastIndexOf('<script>')+8,html.lastIndexOf('</script>'));
global.ImageData=class{constructor(d,w,h){this.data=d}};
const ctx=new Proxy({},{get:(t,k)=>k=='getImageData'?(x,y,w,h)=>({data:new Uint8ClampedArray(w*h*4).fill(120)}):k=='measureText'?()=>({width:30}):()=>{},set:()=>true});
const mkEl=()=>({style:{setProperty(){}},dataset:{},innerHTML:'',className:'',getContext:()=>ctx,addEventListener(){},remove(){},width:0,height:0});
const els={};const docL={};global.document={hidden:false,getElementById:id=>els[id]||(els[id]=mkEl()),createElement:()=>mkEl(),addEventListener(e,f){(docL[e]=docL[e]||[]).push(f)}};
global.innerWidth=+process.argv[3]||390;global.innerHeight=+process.argv[4]||800;global.addEventListener=()=>{};global.localStorage={};global.requestAnimationFrame=()=>{};
global.Image=class{constructor(){this.complete=true;this.naturalWidth=1}addEventListener(){}};global.NOW_=0;global.performance={now:()=>global.NOW_};
// mock web audio
global.started=0;let nodes=0,errs=[];const P_=()=>({value:0,setValueAtTime(v,t){if(!isFinite(v)||!isFinite(t))errs.push('nonfinite set '+v+' '+t)},linearRampToValueAtTime(v,t){if(!isFinite(v)||!isFinite(t))errs.push('nf lin')},exponentialRampToValueAtTime(v,t){if(!(v>0)||!isFinite(t))errs.push('bad exp '+v)},setTargetAtTime(){}});
const node=()=>{nodes++;return{connect(){},disconnect(){},start(){global.started++},stop(){},frequency:P_(),gain:P_(),detune:P_(),Q:P_(),pan:P_(),threshold:P_(),ratio:P_(),type:'',setPeriodicWave(){},buffer:null,loop:false}};
global.AT_=0;global.AudioContext=class{constructor(){this.state='running';this.sampleRate=8000;this.destination={}}get currentTime(){return global.AT_}createGain(){return node()}createOscillator(){return node()}createBiquadFilter(){return node()}createBufferSource(){return node()}createStereoPanner(){return node()}createDynamicsCompressor(){return node()}createPeriodicWave(){return{}}createBuffer(c,n){return{getChannelData:()=>new Float32Array(n)}}resume(){}};
const ivs=[];global.setInterval=(f)=>{ivs.push(f)};global.TQ=[];global.setTimeout=(f,ms)=>{TQ.push([global.AT_+ms/1000,f])};
const out=code+`;S.ac.cp=8;
docL.pointerdown[0]();endIntro();if(!AU.c)throw new Error('audio not init');
const tick=(n)=>{for(let i=0;i<n;i++){AT_+=.016;NOW_+=16;for(const f of ivs)f();for(let q=TQ.length-1;q>=0;q--)if(TQ[q][0]<=AT_){const g=TQ[q][1];TQ.splice(q,1);g()}loop(NOW_)}};

const mkPad=i=>({index:i,connected:true,buttons:Array.from({length:17},()=>({pressed:false,value:0})),axes:[0,0,0,0]});
const PADS=[mkPad(0),mkPad(1),mkPad(2)];Object.defineProperty(globalThis,'navigator',{value:{getGamepads:()=>PADS},configurable:true});
const press=(p,b)=>{PADS[p].buttons[b].pressed=true;tick(1);PADS[p].buttons[b].pressed=false;tick(1)};
S.ac.name='Host';S.ac.pts=5000;S.ac.un=[0,1,2,3,4,5,6,7];sv();tick(5);
// accounts + codes
accounts(0);newProf();document.getElementById('pnm').value='Sis';mkProf();console.log('profiles',S.prof.map(a=>a.name).join());
S.ac.lv=7;S.ac.xp=55;S.ac.sp=2;S.ac.sk={spd:3,crt:1,head:5};const code=enc(S.ac);console.log('code',code,code.length);const back=dec(code);console.log('decode ok',back.name==S.ac.name&&back.lv==7&&back.sk.spd==3&&back.sk.head==5&&back.un.length==8,'bad code rejected',dec(code.replace('.7.','.8.'))===null);
CDA=back;CDA.name='Friend';impCode(-1);console.log('imported profiles',S.prof.map(a=>a.name+':'+a.lv).join());
// lobby
menu();console.log('menu has split button',ui.innerHTML.includes('SPLIT SCREEN'));
lobby();console.log('lobby slots after open',LBY.s.map(s=>s.inp).join());
press(0,0);press(1,0);press(2,9);console.log('after pad joins',LBY.s.map(s=>s.inp+':'+(s.ac=='G'?'G':s.ac.name)).join());
press(1,13);console.log('pad1 account cycle ->',LBY.s[2].ac=='G'?'G':LBY.s[2].ac.name);press(1,15);press(1,15);console.log('pad1 survivor',CH[LBY.s[2].ci].n);
press(0,5);console.log('map now',MP[mapId].n);
press(0,9);console.log('start blocked until ready, mode',mode,LBY.msg);
lobbyKey('enter');for(const p of[0,1,2])press(p,0);console.log('all ready',LBY.s.every(s=>s.rdy));press(2,9);
console.log('started mode',mode,'MPn',MPn,'players',PL.map(p=>pnm(p)+'/'+CH[p.ci].n+'/'+p.inp).join(' '));
// balance numbers
console.log('zcap',ZCAP(),'zombie hp x',ZMP().toFixed(2),'boss hp x',BMP().toFixed(2),'wave1 to spawn',toSp);
// play several waves on each map with pads moving/aiming/firing
let downs=0,revs=0,outs=0;
for(const m of[0,3,5]){if(mode!='play'){mapId=m;startMP()}else{mapId=m;build();}
for(const w of[1,5,20]){console.log('map',m,'wave',w,Date.now()%100000);wave=w-1;nextWave();for(const p of PL){p.mx=p.hp=6}
for(let f=0;f<300&&mode=='play';f++){PADS.forEach((pd,i)=>{const a=f*.05+i;pd.axes=[Math.cos(a)*.9,Math.sin(a)*.9,Math.cos(a*1.3),Math.sin(a*1.3)]});mouse.d=1;mouse.x=W/4;mouse.y=H/4;
if(f==40){PL[1].hp=1;PL[1].inv=0;const P0=P;P=PL[1];P.hp-=1;if(P.hp<=0)ded();P=P0;downs+=PL[1].dn}
if(f>=60&&f<240&&PL[1].dn){PL[0].x=PL[1].x+10;PL[0].y=PL[1].y}
if(f==240&&!PL[1].dn&&!PL[1].dead)revs++;
if(f==245){PL[2].hp=1;PL[2].inv=0;const P0=P;P=PL[2];P.hp=0;ded();P=P0;PL[2].rt=.05}
if(f==265&&PL[2].dead)outs++;
for(const p of PL)if(p.hp>0)p.hp=Math.max(p.hp,3);
tick(1)}
}}
let t1=Date.now();tick(100);console.log('mp ms/tick',(Date.now()-t1)/100,'zombies',zs.length,'mode',mode);console.log('downs',downs,'revives',revs,'bled out',outs,'mode',mode,'zombies',zs.length);
// respawn on next wave
if(mode!='play'){startMP()}PL[2].dead=1;PL[2].dn=0;nextWave();console.log('dead player back next wave',!PL[2].dead,'hp',PL[2].hp,'/',PL[2].mx);
// shop with pads
toSp=0;zs=[];tick(2);ET=0.01;tick(3);console.log('wave clear -> mode',mode);
if(mode=='shop'){PL[1].cash=5000;PL[1].own=[0];PL[1].sc=0;press(0,15);press(0,0);console.log('pad0 bought SMG',PL[1].own.includes(1),'cash',PL[1].cash);
press(0,13);press(0,13);console.log('pad0 cursor on ready',PL[1].sc);press(0,0);console.log('P2 ready',PL[1].rdy);mb(0,14);press(1,9);press(2,9);console.log('after all ready mode',mode,'wave',wave)}
// everyone down -> game over
for(const p of PL){P=p;p.hp=0;ded()}P=PL[0];tick(2);zs=[mk(0,PL[0].x+300,PL[0].y)];tick(2);console.log('all down ->',mode);
over(0);console.log('over has players',ui.innerHTML.includes('THE HORDE WON'),'pts host',S.ac.pts);
// pad menu navigation
menu();NAV.on=0;press(0,13);press(0,13);console.log('nav focus index',NAV.i,'on',NAV.on);
// single player after MP still fine
keys={};mouse.d=0;L=R=null;start();console.log('inp',JSON.stringify(inp(P)),JSON.stringify(keys));console.log('sp after mp: MPn',MPn,'PL',PL.length,'inp',P.inp);for(let f=0;f<200&&mode=='play';f++){PADS[0].axes=[1,0,1,0];tick(1)}console.log('sp pad moved',P.x>HS.px,mode,P.x,HS.px);let t0=Date.now();for(let f=0;f<100;f++){tick(1)}for(let i=0;i<60;i++)zs.push(mk(i%2,P.x+rnd(-300,300),P.y+rnd(-300,300)));P.mx=P.hp=999;t0=Date.now();for(let f=0;f<100;f++){tick(1)}console.log('sp60 ms/tick',(Date.now()-t0)/100,zs.length);console.log('sp ms/tick',(Date.now()-t0)/100,'zombies',zs.length);
console.log('TOTAL errors',errs.length,errs.slice(0,5));
`;
new Function("docL","ivs","errs","started_",out)(docL,ivs,errs);
