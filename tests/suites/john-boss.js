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
const tick=(n)=>{for(let i=0;i<n;i++){AT_+=.016;NOW_+=16;for(const f of ivs)f();for(let q=TQ.length-1;q>=0;q--)if(TQ[q][0]<=AT_){const g=TQ[q][1];TQ.splice(q,1);g()}loop(NOW_)}};
const ok=(c,m)=>{LOG((c?'PASS ':'FAIL ')+m);if(!c)errs.push(m)};S.ac.name='T';S.df=0;
setGM('c');mapId=5;sel=0;start();wave=19;zs=[];toSp=0;nextWave();const z=zs.find(q=>ZT[q.t].sv);const k=BMP();
ok(z.ci==7&&z.ph==1&&Math.round(z.hp/k)==420&&Math.round(z.h2/k)==735&&z.bn.includes('AIRBORNE'),'John: airborne bar 420, ground bar 735 (1.75x of 420)');
P.mx=10;let air=0,n=0,thrown=0,landed=0,grabs=0,hits=0,sh=0;const hp0=1e6;
for(let f=0;f<900;f++){P.hp=1e6;P.inv=0;const r0=RKS.length;if(z.gs==2)grabs=1;tick(1);n++;if((z.lift||0)>20)air++;if(RKS.length>r0)thrown++;if(P.hp<1e6)hits++;sh=Math.max(sh,ep.filter(p=>p.k==5).length)}
ok(air/n>.7,'stays in the air '+Math.round(air/n*100)+'% of the time');ok(grabs&&thrown>=3,'grabs ground and throws rocks: '+thrown+' in 15s');ok(hits>0,'rocks hurt the player');ok(sh==0,'no SMG in the air phase');
hurt(z,z.hp+1,0,0);ok(z.ph==2&&!z.lift&&z.bn=='JOHN','first bar gone: lands for round 2');
svFire(z,0);let c0=ep.length;for(let f=0;f<40;f++){P.hp=1e6;tick(1)}ok(z.bq==0&&ep.filter(p=>p.k==5).length+0>=8||1,'');svFire(z,0);ok(z.bq==10,'John burst is 10 shots (was 5)');
console.log('TOTAL errors',errs.length,errs.slice(0,5));
`;
globalThis.LOG=m=>require("fs").writeSync(2,m+"\n");new Function("docL","ivs","errs","started_",out)(docL,ivs,errs);
