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
S.ac.name='Host';sv();tick(3);
LBY={s:[]};joinL('km');joinL(0);LBY.s[1].ci=LBY.s[0].ci;freeV(LBY.s[1]);console.log('same survivor gets different color',LBY.s.map(s=>s.ci+'/'+s.v).join());
for(const m of[0,1,2,3,4,5]){mapId=m;startMP();toSp=0;zs=[];const a=PL[0],b=PL[1];
// put the players far apart on open ground
let best=null;for(let k=0;k<400&&!best;k++){const x=rnd(100,WW-100),y=rnd(100,WH-100),x2=rnd(100,WW-100),y2=rnd(100,WH-100);if(Math.hypot(x-x2,y-y2)>700&&!bl[cl(y/gs|0,0,gh-1)*gw+cl(x/gs|0,0,gw-1)]&&!bl[cl(y2/gs|0,0,gh-1)*gw+cl(x2/gs|0,0,gw-1)]&&okPos(x,y)&&okPos(x2,y2))best=[x,y,x2,y2]}
a.x=best[0];a.y=best[1];b.x=best[2];b.y=best[3];a.mx=a.hp=b.mx=b.hp=999;
for(let k=0;k<8;k++){const ang=k*.8;zs.push(mk(0,b.x+Math.cos(ang)*160,b.y+Math.sin(ang)*160))}
const d0=zs.reduce((q,z)=>q+Math.hypot(z.x-b.x,z.y-b.y),0)/zs.length;mouse.d=0;keys={};
for(let f=0;f<180;f++){a.x=best[0];a.y=best[1];b.x=best[2];b.y=best[3];a.inv=b.inv=9;tick(1)}
const d1=zs.reduce((q,z)=>q+Math.hypot(z.x-b.x,z.y-b.y),0)/zs.length,toB=zs.filter(z=>z.tg===b).length;
console.log('map',m,'zombies near P2: avg dist',d0.toFixed(0),'->',d1.toFixed(0),'| targeting P2',toB,'/',zs.length)}
// shared cash drop
PL[0].cash=0;PL[1].cash=0;DR=[{x:PL[1].x,y:PL[1].y,k:'cash',l:5,ph:0}];P=PL[0];pickups(.016);console.log('cash drop picked by P2 -> P1',PL[0].cash,'P2',PL[1].cash);
console.log('TOTAL errors',errs.length,errs.slice(0,5));
`;
new Function("docL","ivs","errs","started_",out)(docL,ivs,errs);
