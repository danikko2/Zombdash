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
const out=code+`;S.ac.cp=8;docL.pointerdown[0]();endIntro();
const ok=(c,m)=>{LOG((c?'PASS ':'FAIL ')+m);if(!c)errs.push(m)};S.ac.name='T';
const bRange=ci=>{ep=[];const z={x:500,y:500,ci,ph:2,cd:0};svFire(z,0);const s=ep.filter(p=>p.k==5);return s.length?Math.max(...s.map(p=>Math.hypot(p.vx,p.vy)*p.l)):0};
const sgs=Object.keys(SVS).filter(k=>SVS[k].w=='sg');ok(sgs.length>=6,'shotgun survivors found: '+sgs.join(','));for(const k of sgs){const r=bRange(+k);ok(r>=450,'shotgun survivor '+k+' reaches '+Math.round(r)+'px (was 225)')}
setGM('c');mapId=0;sel=0;start();wave=19;zs=[];toSp=0;nextWave();const z=zs.find(q=>ZT[q.t].sv);ok(z&&z.ci==2,'Bill is the Suburb boss');
P.hp=P.mx=999;{let f=0;for(let y=100;y<WH-100&&!f;y+=40)for(let x=100;x<WW-500&&!f;x+=40){const A={x,y},B={x:x+380,y};if(los(A,B)&&!wlAt(x,y).length&&!wlAt(x+380,y).length&&!fdBad(x,y)){P.x=x;P.y=y;f=1}}LOG('  open spot '+P.x+','+P.y)}z.x=P.x+380;z.y=P.y;z.cd=0;let hit=0;const h0=P.hp;for(let i=0;i<400;i++){NOW_+=16;P.inv=0;z.ab=9;upd(1/60);if(P.hp<h0)hit=1;z.x=P.x+380+Math.sin(i/9)*20;z.y=P.y}
ok(hit,'Bill can hit you from 380px away');
LOG('TOTAL errors '+errs.length+' '+JSON.stringify(errs))`;
globalThis.LOG=m=>require("fs").writeSync(2,m+"\n");new Function("docL","ivs","errs",out)(docL,ivs,errs);
