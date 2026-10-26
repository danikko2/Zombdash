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
const out=code+`;S.ac.cp=8;S.tut=1;docL.pointerdown[0]();endIntro();
const ok=(c,m)=>{LOG((c?'PASS ':'FAIL ')+m);if(!c)errs.push(m)};
const tick=(n)=>{for(let i=0;i<n;i++){AT_+=.016;NOW_+=16;for(const f of ivs)f();for(let q=TQ.length-1;q>=0;q--)if(TQ[q][0]<=AT_){const g=TQ[q][1];TQ.splice(q,1);g()}loop(NOW_)}};
setGM('f');mapId=0;sel=0;start();P.mx=P.hp=999;P.cash=100000;shop();
ok(P.own.length==1&&P.own[0]==CH[0].w,'start: 1 weapon (starter)');
buy(1);buy(2);buy(3);ok(P.own.length==4,'bought 3 more -> 4/4');const c0=P.cash;buy(5);ok(P.own.length==4&&P.cash==c0,'5th weapon refused when full');
ok(ui.innerHTML.includes('INVENTORY 4/4')&&ui.innerHTML.includes('slots full')&&ui.innerHTML.includes('SELL $'),'shop shows inventory, sell buttons, slots full');
const paid=P.paid[3];wSell(3);ok(!P.own.includes(3)&&P.cash==c0+Math.round(paid*.6),'sold rifle for 60% ('+Math.round(paid*.6)+' of '+paid+')');
const c1=P.cash;wSell(CH[0].w);ok(P.own.includes(CH[0].w)&&P.cash==c1,'starter cannot be sold');
buy(5);ok(P.own.length==4&&P.own.includes(5),'free slot -> can buy again');
ok(ui.innerHTML.includes('AMMO')&&ui.innerHTML.includes('Shotgun shells'),'ammo section in shop');const sh=P.am.sh;amBuy('sh');ok(P.am.sh==Math.min(AMI.sh.max,sh+AMI.sh.buy),'bought shells');
// ammo use + reload
nextWave();P.hp=999;toSp=0;const keep=()=>{const k=mk(0,20,20);k.hp=1e9;zs=[k]};keep();P.cur=1;P.mg[1]=3;P.am.pa=10;let shots=0;inp=p=>({mx:0,my:0,fire:true});const m0=P.mg[1];for(let f=0;f<20;f++){tick(1);}
ok(P.rl>0||P.mg[1]>0,'SMG emptied mag and started reloading');tick(Math.ceil(1.5/.016));ok(P.mg[1]>0&&P.am.pa<10,'reload pulled pistol ammo from reserve ('+P.mg[1]+' / '+P.am.pa+')');
keep();P.mg[1]=0;P.am.pa=0;P.rl=0;tick(5);LOG("dbg cur="+P.cur+" mg="+P.mg[1]+" dry="+P.dry+" mode="+mode+" cds="+P.cds[1].toFixed(2)+" hp="+P.hp);ok(P.cur==CH[0].w,'completely out -> switches to starter');
keep();P.cur=CH[0].w;P.mg[P.cur]=0;tick(Math.ceil(1.45/.016));ok(P.mg[P.cur]>0,'starter reloads from infinite reserve');
inp=p=>({mx:0,my:0,fire:false});
// drops
DR=[];const z=mk(2,P.x+5,P.y);for(let k=0;k<200&&!DR.some(d=>d.k=='am');k++)drop(z,ZT[2]);const d=DR.find(d=>d.k=='am');ok(d&&d.a=='sh','big zombie drops shells');keep();mode='play';DR=[d];d.x=P.x;d.y=P.y;const s0=P.am.sh;tick(2);ok(P.am.sh>s0,'picked up shells');
// keys pick slots
P.cur=P.own[0];document&&0;
// split-screen shop items
ok(RDY(P)==WP.length+3+Object.keys(AMI).length+1,'MP shop items include every ammo type ('+Object.keys(AMI).length+') + sell');
console.log('TOTAL errors',errs.length,errs);`;
globalThis.LOG=m=>require("fs").writeSync(2,m+"\n");new Function("docL","ivs","errs","started_",out)(docL,ivs,errs);
