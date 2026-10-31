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
// open ground: a column of walkers coming from one side should fan out into an arc, and all still reach the player
setGM('f');mapId=6;sel=0;start();zs=[];toSp=0;
// a cleared field: no walls anywhere, so this checks the steering itself
WL.length=0;WL.push([0,0,1,1]);WL.length=0;grid();const spot={x:WW/2-275,y:WH/2};ok(zOpen(spot)&&zOpen({x:spot.x+550,y:spot.y}),'open field ready');
function run(spread){P.x=spot.x;P.y=spot.y;P.hp=P.mx=1e6;zs=[];for(let i=0;i<12;i++){const z=mk(0,spot.x+550+i*14,spot.y);z.fo=spread?(i%2?1:-1)*(.3+.7*(i>>1)/5):0;zs.push(z)}
 let snap=null,reached=0;for(let f=0;f<60*30;f++){NOW_+=16;P.inv=9;P.x=spot.x;P.y=spot.y;upd(1/60);
  const ds=zs.map(z=>Math.hypot(z.x-P.x,z.y-P.y));if(!snap&&ds.reduce((a,b)=>a+b,0)/ds.length<220)snap=zs.map(z=>Math.atan2(z.y-P.y,z.x-P.x));
  reached=ds.filter(d=>d<40).length;if(reached==zs.length)break}
 const sd=snap?Math.sqrt(snap.reduce((a,b)=>a+b*b,0)/snap.length-Math.pow(snap.reduce((a,b)=>a+b,0)/snap.length,2)):0;return{sd,reached}}
const A=run(1),B=run(0);
LOG('  spread of approach angles: with spreading '+A.sd.toFixed(2)+' rad, without '+B.sd.toFixed(2)+' rad');
ok(A.sd>.25&&B.sd<.1,'zombies fan out instead of coming single file');
ok(A.reached==12,'every spreading zombie still reaches the player ('+A.reached+' of 12)');
// pushed apart: zombies dropped on one spot don't stay stacked
zs=[];P.x=spot.x;P.y=spot.y;for(let i=0;i<6;i++)zs.push(mk(0,spot.x+300,spot.y));for(let f=0;f<20;f++){NOW_+=16;upd(1/60)}
let mn=1e9;for(let i=0;i<zs.length;i++)for(let j=i+1;j<zs.length;j++)mn=Math.min(mn,Math.hypot(zs[i].x-zs[j].x,zs[i].y-zs[j].y));ok(mn>4,'zombies on the same spot push apart (closest pair '+mn.toFixed(1)+'px)');
// no glow round the player on lit maps
{let n=0;const k=cmLightPaint;cmLightPaint=(G,T,S)=>{n+=S.filter(s=>s.pl).length};HS.LT={t:'night',a:1,L:[]};HS.CM=1;try{cmLight()}catch(e){}cmLightPaint=k;HS.LT=null;HS.CM=0;ok(n==0,'players carry no light of their own on lit maps')}
LOG('TOTAL errors '+errs.length+' '+JSON.stringify(errs))`;
globalThis.LOG=m=>require("fs").writeSync(2,m+"\n");new Function("docL","ivs","errs",out)(docL,ivs,errs);
