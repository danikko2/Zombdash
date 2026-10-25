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
const tick=(n)=>{for(let i=0;i<n;i++){AT_+=.016;NOW_+=16;for(const f of ivs)f();for(let q=TQ.length-1;q>=0;q--)if(TQ[q][0]<=AT_){const g=TQ[q][1];TQ.splice(q,1);g()}loop(NOW_)}};
const ok=(c,m)=>{LOG((c?'PASS ':'FAIL ')+m);if(!c)errs.push(m)};
S.ac.name='T';S.ac.un=[0];delete S.ac.cp;S.ac.lv=1;
// ---- tutorial ----
setGM('c');mapId=0;sel=0;start();ok(TUT&&TUT.ph==0&&wave==0&&mode=='play','new player: campaign on Suburb starts in the tutorial');
const GG=TUT.G;ok(P.x>GG.x0&&P.x<GG.x1&&P.y>GG.y0&&P.y<GG.y1,'player starts inside the house');// the tutorial zooms in only as far as the whole house fits; on a phone (landscape, about 390 px tall) it already fills the view
const FITZ=Math.min(W/(GG.gx-GG.x0+90),(H-(H<520?80:200))/(GG.y1-GG.y0+60));if(FITZ>1)ok(tutZ()>1,'camera zoomed in ('+tutZ().toFixed(2)+'x)');else ok(tutZ()==1,'small screen: the house already fills the view, so no zoom ('+W+'×'+H+')');
// try to walk out of the front door straight away: blocked
for(let f=0;f<200;f++){keys.s=1;tick(1)}keys.s=0;ok(P.y<GG.y1+2,'front door blocked during the lesson (y '+(P.y|0)+')');
for(let f=0;f<120;f++){keys.a=f<60;keys.d=f>=60;tick(1)}keys.a=keys.d=0;tick(80);ok(TUT.ph>=1,'moving advances to aim+shoot ('+TUT.ph+')');
mouse.x=W/2+100;mouse.y=H/2;mouse.d=1;tick(150);mouse.d=0;ok(TUT.ph==2&&zs.length==1,'shooting spawns one zombie');
const z=zs[0];ok(z.x>GG.x0&&z.x<GG.x1&&z.y>GG.y0&&z.y<GG.y1,'zombie is inside the house');
let ff=0;for(;ff<900&&zs.length;ff++){mouse.d=1;const zz=zs[0];if(zz){const c=cam,v=tutZ();mouse.x=(zz.x-c.x)*v;mouse.y=(zz.y-c.y)*v}tick(1)}mouse.d=0;ok(!zs.length,'player kills the zombie by aiming at it ('+ff+' frames)');
tick(60);ok(TUT.ph==3,'ready message: walk through the front door');ok(P.hp==P.mx,'can not get hurt in the tutorial');
P.x=GG.cx;P.y=GG.y1-30;for(let i=0;i<120&&TUT&&TUT.ph<4;i++){keys.s=1;tick(1)}keys.s=0;ok(TUT&&TUT.ph==4,'walking out the front door starts the zoom out');
const z1=tutZ();tick(40);if(z1>1)ok(TUT&&tutZ()<z1,'camera zooming out');else ok(TUT&&tutZ()==1,'small screen: the camera stays at normal zoom while the tutorial ends');tick(120);ok(!TUT&&wave==1&&mode=='play'&&tutZ()==1,'wave 1 starts at normal zoom');ok(S.ac.tut==1,'tutorial marked done');
setGM('c');mapId=0;start();ok(!TUT&&wave==1,'second time: no tutorial');
TUTF=1;start();ok(TUT&&TUT.ph==0,'replay tutorial option works');
S.ac.cp=8;setGM('f');mapId=0;start();ok(!TUT,'free play: no tutorial');
// on a desktop screen the tutorial zooms in on the house and back out when the player walks out of the front door
{const w0=innerWidth,h0=innerHeight;global.innerWidth=1280;global.innerHeight=800;rs();TUTF=1;setGM('c');mapId=0;start();const G2=TUT&&TUT.G;ok(TUT&&W==1280&&tutZ()>1,'desktop: camera zoomed in ('+tutZ().toFixed(2)+'x)');
 for(let f=0;f<120;f++){keys.a=f<60;keys.d=f>=60;tick(1)}keys.a=keys.d=0;tick(80);mouse.x=W/2+100;mouse.y=H/2;mouse.d=1;tick(150);mouse.d=0;
 for(let f=0;f<900&&zs.length;f++){mouse.d=1;const zz=zs[0];if(zz){const v=tutZ();mouse.x=(zz.x-cam.x)*v;mouse.y=(zz.y-cam.y)*v}tick(1)}mouse.d=0;tick(60);ok(TUT&&TUT.ph==3,'desktop: the lesson plays through to the front door');P.x=G2.cx;P.y=G2.y1-30;for(let i=0;i<120&&TUT&&TUT.ph<4;i++){keys.s=1;tick(1)}keys.s=0;const zd=tutZ();tick(40);ok(TUT&&TUT.ph==4&&tutZ()<zd,'desktop: camera zooming out');tick(120);ok(!TUT&&tutZ()==1,'desktop: back to normal zoom for wave 1');
 global.innerWidth=w0;global.innerHeight=h0;rs()}
// ---- a lost life replays the same wave ----
setGM('c');S.ac.cp=8;mapId=1;sel=0;start();P.mx=5;P.hp=5;
wave=9;zs=[];toSp=0;nextWave();for(let i=0;i<300&&(toSp>0||bossQ>=0);i++){P.hp=P.mx;P.inv=1;tick(1)}
const TY_=WRC.t.slice(),BO_=WRC.b;tick(30);P.hp=0;P.inv=0;over();lifeCont();ok(wave==10&&LIVES==2,'life lost restarts wave 10');
ok(WRC.rp==1&&WRC.b==BO_&&bossQ==BO_,'same BO_ after a lost life: '+ZT[BO_].n);
for(let i=0;i<600&&(toSp>0||bossQ>=0);i++){P.hp=P.mx;P.inv=1;tick(1)}ok(JSON.stringify(WRC.t.slice(0,TY_.length))==JSON.stringify(TY_)&&WRC.i>=TY_.length,'same zombies in the same order ('+TY_.length+') i='+WRC.i+' rec='+JSON.stringify(WRC.t)+' first='+JSON.stringify(TY_));
// second death in the same wave: still the same
P.hp=0;P.inv=0;over();lifeCont();ok(WRC.b==BO_&&WRC.rp&&JSON.stringify(WRC.t.slice(0,TY_.length))==JSON.stringify(TY_),'second lost life: still the same wave');
// a new wave after clearing is fresh
zs=[];toSp=0;bossQ=-1;nextWave();ok(!WRC.rp&&wave==11,'next wave is recorded fresh');
LOG('TOTAL errors '+errs.length+' '+JSON.stringify(errs));`;
globalThis.LOG=m=>require("fs").writeSync(2,m+"\n");new Function("docL","ivs","errs","started_",out)(docL,ivs,errs);
