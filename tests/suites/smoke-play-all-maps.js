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
// menu music plays
tick(200);const menuStarts=started;console.log('menu music notes in 3.2s:',menuStarts,'track',AU.trk);
// every SFX callable
for(const k in SF){sfx(k)}console.log('all',Object.keys(SF).length,'sfx ran, errors',errs.length);
// start a run on each map, exercise waves incl boss + all zombie types with voices
for(const m of[0,1,2,3,4,5,6,7]){mapId=m;S.sw=1;start();P.mx=P.hp=999;for(const w of[1,4,9,14,19]){wave=w;nextWave();for(const t of[0,1,2,3,4,9,10,11,14])zs.push(mk(t,P.x+rnd(-200,200),P.y+rnd(-200,200)));
for(let f=0;f<400&&mode=='play';f++){mouse.d=1;mouse.x=P.x+40;mouse.y=P.y;keys.d=f%60<30;keys.a=!keys.d;P.cur=f%5;if(!P.own.includes(P.cur))P.own.push(P.cur);tick(1)}if(mode=='shop'){buy(4);heal();mhp()}}}
console.log('runs ok; track now',AU.trk,'errors',errs.length,'voices in flight',AU.vo);
// pause / resume / options-from-pause / quit
start();P.mx=P.hp=999;tick(30);pauseMenu();console.log('pause mode',mode,'pz display after tick');tick(2);console.log('  pz',PZ.style.display);const zx=zs.map(z=>z.x+','+z.y).join();tick(60);console.log('  frozen while paused',zx==zs.map(z=>z.x+','+z.y).join());
options(1);console.log('  options from pause keeps mode',mode,'back->',ui.innerHTML.includes('pauseMenu()'));setVol('mv',{value:30,style:{setProperty(){}}});setVol('sv',{value:0,style:{setProperty(){}}});console.log('  vols',S.mv,S.sv);sfx('boom');
setO('l');console.log('  orientation change while paused ok, mode',mode);pauseMenu();resume();console.log('  resumed',mode);tick(30);
pauseMenu();quitRun();console.log('  quit ->',mode,ui.innerHTML.includes('RUN ENDED'));S.sv=.8;
// game over path
start();P.hp=1;P.mx=5;zs=[mk(0,P.x+5,P.y)];P.inv=0;tick(80);console.log('death ->',mode,ui.innerHTML.includes('YOU WERE EATEN'));
// hidden tab auto-pause
start();tick(5);document.hidden=true;docL.visibilitychange[0]();console.log('auto-pause on hide',mode);document.hidden=false;
// footsteps
resume();tick(2);console.log('pz in play',PZ.style.display);music(null);tick(30);AU.vo=0;let st0=started;keys.d=1;mouse.d=0;zs=[];toSp=0;AU.gv=1e9;tick(60);keys.d=0;console.log('footstep nodes in 1s (music off, no zombies):',started-st0,'surface',surf());
console.log('menu html ok',(menu(),ui.innerHTML.includes('PLAY')),(play(),ui.innerHTML.includes('data-ch')),(options(0),ui.innerHTML.includes('Difficulty')));
for(let c=0;c<CH.length;c++){sel=c;mapId=c%6;S.sw=1;start();P.mx=P.hp=999;zs=[];for(let i=0;i<6;i++)zs.push(mk(0,P.x+80+i*20,P.y));let lvN=0;for(let f=0;f<120&&mode=='play';f++){mouse.d=1;mouse.x=P.x+200;mouse.y=P.y;tick(1);lvN+=bs.filter(b=>b.lv).length}console.log('char',c,CH[c].n,'start gun',WP[P.cur].n,'owns',P.own.join(),'hp',P.mx,'laser-look bullets seen',lvN>0,'frames',PS[c].walk.length,PS[c].idle.length,PS[c].gun.length)}
const reach=(m,pts)=>{mapId=m;build();bfs(fd,HS.px,HS.py);const c=(x,y)=>fd[cl(y/gs|0,0,gh-1)*gw+cl(x/gs|0,0,gw-1)];const bad=pts.filter(([n,x,y])=>c(x,y)<0).map(p=>p[0]);const sp=(HS.sp||[]).filter(p=>c(cl(p[0],8,WW-8),cl(p[1],8,WH-8))<0).length;console.log('map',MP[m].n,'unreachable:',bad.join()||'none','| spawn pts blocked',sp,'/',(HS.sp||[]).length,'| start blocked',c(HS.px,HS.py)<0)};
reach(6,[['sleepA',1800,1160],['sgt',2035,1170],['bath',2185,1150],['locker',1700,1400],['shower',1960,1350],['sleepB',2090,1330],['hangar1',400,700],['hangar2',1160,700],['runway',1000,220],['motor',600,1520],['heli',1900,580],['NE corner',2250,150],['SW',150,1800]]);
reach(7,[['cabin1',800,270],['cabin2',1050,270],['cabin3',1300,270],['cabin4',800,550],['cabin5',1050,550],['cabin6',1300,550],['shower stall',1610,230],['shower',1700,340]].slice(0,8).concat([['dockend',600-0,900],['parking',2000,1060],['arch road',1980,1800],['beach',620,1500]]));
console.log('TOTAL errors',errs.length,errs.slice(0,5));
`;
new Function("docL","ivs","errs","started_",out)(docL,ivs,errs);
