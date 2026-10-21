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
docL.pointerdown[0]();endIntro();
const tick=(n)=>{for(let i=0;i<n;i++){AT_+=.016;NOW_+=16;for(const f of ivs)f();for(let q=TQ.length-1;q>=0;q--)if(TQ[q][0]<=AT_){const g=TQ[q][1];TQ.splice(q,1);g()}loop(NOW_)}};
const ok=(c,m)=>{LOG((c?'PASS ':'FAIL ')+m);if(!c)errs.push(m)};S.ac.name='T';
let LS=0;const die=()=>{P.hp=0;P.inv=0;zs=[mk(0,P.x+3,P.y)];tick(3);if(mode=='lifeo'){LS++;const h=ui.innerHTML;if(!(h.includes('YOU WERE EATEN')&&h.includes('CONTINUE')&&h.includes('MAIN MENU')))errs.push('life screen');tick(30);if(mode!='lifeo')errs.push('life screen waits');lifeCont()}};
S.dlc=1;setGM('c');mapId=0;sel=0;start();ok(LIVES==3,'campaign starts with 3 lives');wave=6;zs=[];toSp=0;nextWave();P.own.push(3);P.cash=777;die();ok(mode=='play'&&LIVES==2&&wave==7&&P.hp==P.mx&&P.own.includes(3),'life lost: wave 7 restarts, guns kept, full hp');die();ok(LIVES==1&&mode=='play','second life lost');die();ok(mode=='over','third death = game over');ok(LS==2,'life screen shown on each lost life ('+LS+')');ok(ui.innerHTML.includes('CONTINUE · NO LIVES')&&ui.innerHTML.includes('disabled'),'final screen: continue greyed out');lifeCont();ok(mode=='over','continue does nothing with no lives');
start();wave=4;zs=[];toSp=0;nextWave();P.hp=0;P.inv=0;zs=[mk(0,P.x+3,P.y)];tick(3);ok(mode=='lifeo','life screen up');lifeMenu();ok(mode=='menu','MAIN MENU from the life screen');
S.dlc=2;start();ok(LIVES==1,'hard: 1 life');die();ok(mode=='over','hard: first death = game over');S.dlc=1;
setGM('f');start();die();ok(mode=='over','free play unchanged');
setGM('c');mapId=4;start();P.mx=10;wave=19;zs=[];toSp=0;nextWave();const b=zs.find(q=>ZT[q.t].sv);b.hp=5;die();const b2=zs.find(q=>ZT[q.t].sv);ok(LIVES==2&&wave==20&&b2&&b2.hp==b2.mh&&b2.ph==1,'boss wave: life lost, Hank back on his horse at full health');
// horse near a wall: facing flips
const w=WL.find(w=>w[2]>200&&w[3]<12)||WL[0];P.x=w[0]+w[2]/2;P.y=w[1]+90;b2.x=w[0]+w[2]/2+60;b2.y=w[1]+14;P.hp=1e6;P.mx=10;let fl=0,lst=null,pos=[];for(let f=0;f<600;f++){P.hp=1e6;tick(1);const h=b2.hf;if(lst!=null&&h!=lst)fl++;lst=h;pos.push([b2.x,b2.y])}
let jit=0;for(let i=2;i<pos.length;i++){const a=Math.atan2(pos[i][1]-pos[i-1][1],pos[i][0]-pos[i-1][0]),c=Math.atan2(pos[i-1][1]-pos[i-2][1],pos[i-1][0]-pos[i-2][0]);if(Math.abs(Math.atan2(Math.sin(a-c),Math.cos(a-c)))>2.5)jit++}
ok(fl<=12&&jit<10,'horse facing flips in 10s: '+fl+', direction reversals frame-to-frame: '+jit);
// split screen: everyone down costs a life
const B={name:'B',xp:0,lv:1,sp:0,sk:{},pts:0,un:[0],cp:8};S.prof=[B];LBY={s:[{inp:'km',ac:S.ac,ci:0,v:0,rdy:1},{inp:0,ac:B,ci:0,v:1,rdy:1}]};mapId=0;startMP();ok(LIVES==3,'split screen campaign 3 lives');for(const p of PL){p.dn=0;p.dead=1}tick(2);if(mode=='lifeo')lifeCont();ok(mode=='play'&&LIVES==2&&PL.every(p=>!p.dead&&p.hp==p.mx),'split screen wipe = life lost, everyone back');
// tuning
ok(SVS[1].hp==720&&SVS[1].sp==70&&SVS[1].cd<.5&&SVS[3].sp==177&&SVS[3].hp>300&&SVS[2].hp>380&&SVS[4].sp==78&&Math.abs(SVS[4].cd-1.7/1.5)<.01,'boss tuning');
console.log('TOTAL errors',errs.length,errs.slice(0,5));
`;
globalThis.LOG=m=>require("fs").writeSync(2,m+"\n");new Function("docL","ivs","errs","started_",out)(docL,ivs,errs);
