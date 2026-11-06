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
const out=code+`;docL.pointerdown[0]();endIntro();
const ok=(c,m)=>{LOG((c?"PASS ":"FAIL ")+m);if(!c)errs.push(m)};S.ac.name="T";
const hx_=()=>ui.innerHTML;
// main menu: the Play tab
menu();ok(UIS=='hub'&&hx_().includes('hubbar')&&['PLAY','LOADOUT','SURVIVORS','PROGRESS','WORKSHOP'].every(t=>hx_().includes('>'+t)),'main menu is the tab bar with five tabs');
ok(hx_().includes('CAMPAIGN')&&hx_().includes('FREE PLAY')&&hx_().includes('hubCampGo()'),'Play tab: campaign card plays the next map straight away');
ok(hx_().includes('class="hcg go"'),'the highlighted card has the green bar (first focus for controllers)');
// other tabs show their screen under the bar
hubTab('loadout');ok(HUBX=='loadout'&&hx_().includes('hubf')&&hx_().includes('hubbar'),'Loadout tab: the old screen sits under the tab bar');
hubTab('prog');ok(hx_().includes('hubsub')&&hx_().includes('CHALLENGES')&&hx_().includes('LEADERBOARDS'),'Progress tab has its sub-tabs');
ok(nxKey('e')&&HUBX=='ws','E moves to the next tab');ok(nxKey('q')&&HUBX=='prog','Q moves back');
ok(nxKey('escape')&&UIS=='hub'&&HUBX==null,'Esc on a tab goes back to Play');
hubTab('surv');setGM('f');play();ok(HUBX==null&&!hx_().includes('hubf'),'a new-style screen never gets the old-screen frame');
// one-screen free play setup
setGM('f');mapId=0;sel=0;SV=0;play();ok(UIS=='map'&&hx_().includes('NEW GAME')&&hx_().includes('sustrip')&&hx_().includes('sugrid')&&hx_().includes('ndif')&&hx_().includes('START WAVE'),'free play setup: map, survivor, difficulty and start wave on one screen');
ok(hx_().includes('MAIN MENU')&&hx_().includes('BACK'),'setup has Back and Main Menu');
const O=ORD();NOW_+=500;mapStep(1);ok(mapId===O[1]&&UIS=='map','arrow steps to the next map and stays on setup');
const lk=O.find(k=>!mapOK(k));if(lk!=null){mapId=lk;play();ok(hx_().includes('MAP LOCKED'),'locked map: START says so');mapGo();ok(mode=='menu','locked map cannot start')}
mapId=0;suSurv(1);ok(SV==1&&sel==0&&hx_().includes('SURVIVOR LOCKED'),'picking a locked survivor shows it but keeps your survivor');mapGo();ok(mode=='menu','locked survivor cannot start');
suSurv(0);S.best=5;S.sw=1;suSW(1);suSW(1);ok(S.sw==3,'start wave stepper');for(let i=0;i<9;i++)suSW(1);ok(S.sw==5,'start wave stops at your best');S.sw=1;
ok(nxKey('escape')&&UIS=='hub','Esc on setup goes to the main menu');
setGM('f');mapId=0;sel=0;SV=0;play();mapGo();ok(mode=='play'||mode=='shop'||mode=='tut','START starts the game');
// campaign world map
menu();hubCamp();ok(UIS=='cmap'&&GMD=='c'&&hx_().includes('cwZ')&&hx_().includes('class="cwp')&&hx_().includes('Suburb'),'Campaign card opens the world map zoomed into the current section');
ok((hx_().match(/class="cwl/g)||[]).length==5,'all five sections stay on the map while zoomed');
ok(hx_().includes('PLAY SUBURB')&&hx_().includes("cGo('w')"),'zoomed panel: play the picked map, back out to the whole world');
cGo('w');ok(hx_().includes('cwW')&&hx_().includes('ZOOM IN')&&!hx_().includes('class="cwp'),'whole-world view: sections only, ZOOM IN');
const w0=CWV.ws;cwNext(1);ok(CWV.ws!==w0&&CWV.v==='w','E/RB picks the next section on the whole world');
cwSec(4);ok(CWV.v==='w'&&hx_().includes('LOCKED'),'a locked section cannot be zoomed into');
cGo(0);ok(nxKey('escape')&&CWV.v==='w','Esc zooms back out');ok(nxKey('escape')&&UIS=='hub','Esc again goes to the main menu');
menu();sel=0;hubCampGo();ok(GMD=='c'&&mapId==campFront()&&mode!='menu','PLAY on the campaign card starts the next map');
// split screen picks the campaign map from the same world map
CMLB=1;cGo(0);ok(hx_().includes('SPLIT-SCREEN LOBBY')&&hx_().includes('CHOOSE'),'lobby map pick uses the world map');CMLB=0;
console.log('TOTAL errors',errs.length,errs);`;
globalThis.LOG=m=>require("fs").writeSync(2,m+"\n");new Function("docL","ivs","errs","started_",out)(docL,ivs,errs);
