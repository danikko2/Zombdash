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
let fails=0;const OK=(c,m)=>{LOG((c?'PASS ':'FAIL ')+m);if(!c)fails++};
for(const m of [14,15]){S.ac.name='T';setGM('f');mapId=m;sel=0;start();P.mx=10;P.hp=1e9;flow();let open=0,unr=0;const U=[];
for(let j=0;j<gh;j++)for(let i=0;i<gw;i++){if(bl[j*gw+i])continue;open++;if(fd[j*gw+i]<0){unr++;if(U.length<12)U.push([i*gs+8,j*gs+8])}}
LOG(MP[m].n+': WL '+WL.length+' open '+open+' unreachable '+unr+' '+JSON.stringify(U));OK(unr<open*.03,MP[m].n+' mostly reachable');
wave=8;zs=[];toSp=0;for(let i=0;i<40;i++)spawnZ();const fdAt=z=>{const v=fd[Math.floor(z.y/gs)*gw+Math.floor(z.x/gs)];return v>=0?v:1e9},FD0=new Map(zs.map(z=>[z,fdAt(z)]));const t0=Date.now();for(let f=0;f<2500;f++){P.hp=1e9;P.x=HS.px;P.y=HS.py;tick(1)}const ms=(Date.now()-t0)/2500;
// a zombie that is still far away counts as lost only if it has not covered half of its walk (the market's back-door route through the docks and storage is long)
const far=zs.filter(z=>Math.hypot(z.x-P.x,z.y-P.y)>500),lost=far.filter(z=>!FD0.has(z)||fdAt(z)>FD0.get(z)*.5);LOG('ms/tick '+ms.toFixed(2)+' left '+zs.length+' far '+far.length+' lost '+lost.length+' '+JSON.stringify(far.slice(0,6).map(z=>[z.x|0,z.y|0,FD0.get(z),fdAt(z)])));OK(far.length<12||lost.length<4,MP[m].n+' zombies head for the player')}
// ---- Penny ----
{setGM('c');S.dlc=1;mapId=14;sel=0;start();P.mx=10;wave=19;zs=[];nq=[];toSp=0;nextWave();const b=zs.find(z=>z.ci==15);OK(!!b,'Penny spawns on wave 20');
let sh=0,ct=0,hits=0,shots=0;const g1=gcShelf,g2=gcCarts,h0=hitP;gcShelf=(...a)=>{sh++;return g1(...a)};gcCarts=(...a)=>{ct++;return g2(...a)};hitP=(q,...a)=>{hits++;return h0(q,...a)};
P.x=1187;P.y=1400;for(let f=0;f<900;f++){P.hp=1e9;P.inv=0;P.x=1187+Math.sin(f/40)*60;P.y=1400;tick(1)}const dsts=b.ds;LOG('inside: shelf drops '+sh+' carts '+ct+' hits '+hits+' penny at '+(b.x|0)+','+(b.y|0));OK(sh>=2&&ct==0,'Penny knocks stock off shelves indoors');
sh=0;ct=0;hits=0;P.x=1300;P.y=2240;for(let f=0;f<900;f++){P.hp=1e9;P.inv=0;P.x=1300+Math.sin(f/50)*80;P.y=2240;tick(1)}LOG('outside: shelf '+sh+' carts '+ct+' hits '+hits+' GCC now '+GCC.length);OK(ct>=2&&sh==0,'Penny sends carts in the lot');hits=0;GCC=[];b.x=1000;b.y=2150;for(let f=0;f<600;f++){P.hp=1e9;P.inv=0;P.x=1000;P.y=2240;P.vx=P.vy=0;tick(1)}OK(hits>0,'a cart hits a player standing still');
OK(!isNaN(b.x)&&b.x>0&&b.x<WW&&b.y>0&&b.y<WH,'Penny stays on the map');gcShelf=g1;gcCarts=g2;hitP=h0;
b.hp=1;P=PL[0];hurt(b,99,0,0);tick(30);OK(KN&&KN.ci==15,'Penny gives up');tick(200);OK(S.ac.un.includes(15),'Penny unlocked')}
// ---- the Mayor ----
{setGM('c');mapId=15;sel=0;start();P.mx=10;wave=19;zs=[];nq=[];toSp=0;nextWave();const b=zs.find(z=>z.ci==16);OK(b&&b.tk&&b.ph==1,'Mayor phase 1 is a police cruiser');
let sh=0;const s0=svShot;svShot=(...a)=>{sh++;return s0(...a)};let moved=0,lx=b.x,ly=b.y;
for(let f=0;f<1200;f++){P.hp=1e9;P.inv=0;P.x=1300+Math.sin(f/60)*200;P.y=1210;tick(1);moved+=Math.hypot(b.x-lx,b.y-ly);lx=b.x;ly=b.y}
LOG('cruiser drove '+(moved|0)+' shots '+sh+' at '+(b.x|0)+','+(b.y|0));OK(moved>1500,'cruiser chases');OK(sh>3,'cruiser shoots');svShot=s0;
P=PL[0];hurt(b,b.hp+5,0,0);OK(b.ph==2&&!b.tk&&b.jp,'cruiser wrecked: mayor jumps off city hall');let okp=0;for(let f=0;f<120;f++){P.hp=1e9;const was=!!b.jp;tick(1);if(was&&!b.jp)okp=svOK(b.x,b.y)}OK(!b.jp&&!b.alt,'mayor lands');LOG('mayor landed at '+(b.x|0)+','+(b.y|0)+' ok '+okp);OK(okp,'landing spot is open ground');
let jumps=0;for(let f=0;f<1500;f++){P.hp=1e9;P.inv=0;P.x=1600+Math.sin(f/70)*250;P.y=1230;if(b.jp&&b.jp.t<.02)jumps++;tick(1)}LOG('jumps '+jumps+' mayor at '+(b.x|0)+','+(b.y|0));OK(jumps>=1,'mayor leaps at you');
b.hp=1;hurt(b,99,0,0);tick(30);OK(KN&&KN.ci==16,'Mayor gives up');tick(200);OK(S.ac.un.includes(16),'Mayor unlocked');
OK(bBt(S.ac,1,14)&&bBt(S.ac,1,15),'both Hometown maps marked beaten')}
{const A1={bm:[0,(1<<0)|(1<<3)|(1<<1)|(1<<8)|(1<<2),0]};OK(secOpen(A1,1,1)&&mOpen(A1,1,9)&&mOpen(A1,1,14),'old progress past Hometown keeps Wrong Turn open, new maps playable');OK(cFront(A1,1)==14,'campaign continues at the new grocery level');const A2={bm:[0,(1<<0)|(1<<3)|(1<<1),0]};OK(!secOpen(A2,1,1)&&mOpen(A2,1,14)&&mOpen(A2,1,15),'new players must beat the new Hometown maps to reach Wrong Turn');A2.bm[1]|=(1<<14)|(1<<15);OK(secOpen(A2,1,1),'beating them opens Wrong Turn')}
LOG('errs '+errs.length+' TOTAL fails '+fails);
`;
globalThis.LOG=m=>require("fs").writeSync(2,m+"\n");new Function("docL","ivs","errs","started_",out)(docL,ivs,errs);
