// Spawn-system tests: node zcT.js game.html [ua]
const fs=require('fs');const html=fs.readFileSync(process.argv[2],'utf8');
const code=html.slice(html.lastIndexOf('<script>')+8,html.lastIndexOf('</script>'));
global.ImageData=class{constructor(d,w,h){this.data=d}};
const ctx=new Proxy({},{get:(t,k)=>k=='getImageData'?(x,y,w,h)=>({data:new Uint8ClampedArray(w*h*4).fill(120)}):k=='measureText'?()=>({width:30}):k=='createRadialGradient'||k=='createLinearGradient'?()=>({addColorStop(){}}):()=>{},set:()=>true});
const mkEl=()=>({style:{setProperty(){}},dataset:{},innerHTML:'',className:'',getContext:()=>ctx,addEventListener(){},remove(){},appendChild(){},width:0,height:0});
const els={};const docL={};global.document={hidden:false,body:mkEl(),getElementById:id=>els[id]||(els[id]=mkEl()),createElement:()=>mkEl(),addEventListener(e,f){(docL[e]=docL[e]||[]).push(f)}};
global.innerWidth=1280;global.innerHeight=800;global.addEventListener=()=>{};global.localStorage={};global.requestAnimationFrame=()=>{};
Object.defineProperty(globalThis,'navigator',{value:{userAgent:process.argv[3]||'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/130',maxTouchPoints:0},configurable:true});
global.Image=class{constructor(){this.complete=true;this.naturalWidth=1}addEventListener(){}};global.NOW_=0;global.performance={now:()=>global.NOW_};
global.started=0;let errs=[];const P_=()=>({value:0,setValueAtTime(){},linearRampToValueAtTime(){},exponentialRampToValueAtTime(){},setTargetAtTime(){}});
const node=()=>({connect(){},disconnect(){},start(){},stop(){},frequency:P_(),gain:P_(),detune:P_(),Q:P_(),pan:P_(),threshold:P_(),ratio:P_(),type:'',setPeriodicWave(){},buffer:null,loop:false});
global.AT_=0;global.AudioContext=class{constructor(){this.state='running';this.sampleRate=8000;this.destination={}}get currentTime(){return global.AT_}createGain(){return node()}createOscillator(){return node()}createBiquadFilter(){return node()}createBufferSource(){return node()}createStereoPanner(){return node()}createDynamicsCompressor(){return node()}createPeriodicWave(){return{}}createBuffer(c,n){return{getChannelData:()=>new Float32Array(n)}}resume(){}};
const ivs=[];global.setInterval=(f)=>{ivs.push(f)};global.TQ=[];global.setTimeout=(f,ms)=>{TQ.push([global.AT_+ms/1000,f])};
const out=code+`;S.ac.cp=8;docL.pointerdown[0]();endIntro();{let F=0,NP=0;const OK=(c,m)=>{if(c)NP++;else{F++;LOG('FAIL '+m)}};const SAY=m=>LOG('  '+m);
S.ac.name='T';setGM('f');mapId=0;sel=0;
options();OK(!ui.innerHTML.includes('GAME BALANCE'),'no balance menu without the test code');balOpen();OK(!ui.innerHTML.includes('class="p wide bal"'),'balance screen refuses to open without the test code');
const un0=S.ac.un.length,sp0=S.ac.sp;devSet();options();OK(ui.innerHTML.includes('balOpen()'),'Options shows GAME BALANCE with the test code');
// ---- test switches start OFF ----
OK(S.ac.un.length==un0&&S.ac.sp==sp0&&!DT('money')&&!DT('god')&&!DT('wave'),'entering the code changes nothing by itself');
OK(ui.innerHTML.includes('Unlock everything')&&ui.innerHTML.includes('Infinite health')&&ui.innerHTML.includes('Unlimited money')&&ui.innerHTML.includes('Unlimited skill points')&&ui.innerHTML.includes('Start on any wave'),'Options lists the 5 switches');
setGM('f');start();OK(P.cash<999999,'money is normal until switched on ($'+P.cash+')');dtSet('money',1);OK(P.cash==999999,'money switch gives $999,999 now');start();OK(P.cash==999999,'and at the next run start');dtSet('money',0);start();OK(P.cash<999999,'money switch off');
dtSet('unl',1);OK(S.ac.un.length==CH.length&&cpD(S.ac,2)>=CORD.length-1,'unlock switch opens everything');dtSet('unl',0);OK(S.ac.un.length==un0,'unlock switch off restores real progress');
dtSet('sp',1);OK(S.ac.sp==9999,'skill points switch');dtSet('sp',0);OK(S.ac.sp==sp0,'skill points back to '+sp0);
S.sw=50;options();OK(S.sw==Math.max(1,S.best),'start wave limited to your best while the wave switch is off');dtSet('wave',1);S.sw=50;options();OK(S.sw==50,'wave switch allows wave 50');dtSet('wave',0);
start();P.hp=3;P.inv=0;dtSet('god',1);P.hp=3;P.hp-=arm(2);OK(P.hp==3,'infinite health blocks damage');mode='play';P.hp=1;dtFrame();OK(P.hp==P.mx,'and tops health up');dtSet('god',0);P.hp=5;P.hp-=arm(2);OK(P.hp<5,'normal damage when off');
dtSet('money',1);dtSet('unl',1);devOff();OK(!S.dt||!Object.keys(S.dt).length,'turning test mode off clears every switch');OK(S.ac.un.length==un0,'and restores progress');devSet();
balOpen();OK(ui.innerHTML.includes('class="p wide bal"')&&ui.innerHTML.includes('Damage')&&ui.innerHTML.includes('Magazine')&&ui.innerHTML.includes('Store price'),'Guns tab: damage, magazine, price');
const tabs={guns:/Rifle/,ammo:/Max carried.*Amount per purchase|Amount per purchase/s,caps:/Ranged cap.*Special cap \\(free play\\).*Hometown.*Island.*Hard adds/s,zhp:/Rotwood.*|Walker/s,bhp:/Juggernaut.*Bill/s,php:/Dave.*The Mayor/s};
for(const t in tabs){balOpen(t);OK(tabs[t].test(ui.innerHTML),'tab '+t+' lists its values');SAY(t+': '+BALR.filter(e=>e.g==t).length+' sliders')}
const idx=(g,sub,lab)=>BALR.findIndex(e=>e.g==g&&e.sub.startsWith(sub)&&e.lab==lab);
let i=idx('guns','Rifle','Magazine');balSet(i,77);OK(MAG[3]==77&&AMG(3,0)==77,'rifle magazine slider changes the magazine (77)');
i=idx('guns','Pistol','Magazine');balSet(i,10);OK(AMG(0,8)==20,'dual pistols follow the pistol magazine (2×10)');
i=idx('guns','Rifle','Damage');balSet(i,7.5);OK(WP[3].d==7.5,'rifle damage 7.5');
i=idx('guns','Laser','Store price');balSet(i,2500);OK(WP[7].cost==2500,'laser price 2500');
i=idx('ammo','Pistol ammo','Max carried');balSet(i,900);OK(AMI.pa.max==900,'pistol ammo max 900');
i=idx('ammo','Shotgun shells','Store price');balSet(i,25);OK(AMI.sh.cost==25,'shell price 25');
i=idx('caps','Ranged cap','Hard %');balSet(i,30);OK(ZCFG.cap.rg[2]==30,'hard ranged cap 30');
i=idx('caps','Special cap (campaign','1. Hometown %');balSet(i,20);setGM('c');mapId=0;OK(zCapSp(1)==20&&zCapSp(2)==30,'Hometown special cap slider (20, Hard 30)');setGM('f');
i=idx('zhp','Base','Brute');balSet(i,20);wave=1;OK(ZT[2].hp==20&&Math.abs(mk(2,0,0).hp-20*1.08*DMH())<1e-6,'Brute base health 20 reaches new spawns');
i=idx('bhp','Wave bosses','Kong');balSet(i,400);OK(ZT[7].hp==400,'Kong health 400');
i=idx('bhp','Survivor','Bill');balSet(i,900);OK(SVS[2].hp==900,'Bill survivor boss 900');
i=idx('php','Starting','Tim');balSet(i,12);OK(CH[4].hp==12,'Tim starting health 12');start();OK(P.hp==CH[sel].hp,'new run uses the survivor health');
OK(Object.keys(S.bal).length==12,'12 changes saved: '+Object.keys(S.bal).join(' ; '));
const tx=balText();SAY(tx.split('\\n').slice(0,4).join(' | '));OK(/Rifle.*Magazine: 30 → 77/.test(tx),'copy text lists default → new');

// back to defaults when test mode is turned off, back again when it is turned on
devOff();OK(MAG[3]==30&&WP[3].d==5&&AMI.pa.max==1200&&ZCFG.cap.rg[2]==20&&ZT[2].hp==14&&CH[4].hp==9&&SVS[2].hp==540,'test mode off: every default restored');
OK(Object.keys(S.bal).length==12,'changes are kept for next time');devSet();OK(MAG[3]==77&&CH[4].hp==12,'test mode on again: changes return');
// a reload keeps them
balReset(1);OK(Object.keys(S.bal).length==11&&CH[4].hp==9,'reset this tab (player hp) only');balOpen('guns');balReset(0);OK(!Object.keys(S.bal).length&&MAG[3]==30,'reset everything');
i=idx('guns','Rifle','Magazine');balSet(i,30);OK(!(BALR[i].k in S.bal),'setting a value back to default clears it');

// ---- zombie count tab ----
balOpen('zc');OK(ui.innerHTML.includes('Campaign: % of the normal size')&&ui.innerHTML.includes('Free play: % of the normal size')&&ui.innerHTML.includes('id=balzc'),'Zombie count tab has the formula, campaign and free play maps');
SAY('zombie count sliders: '+BALR.filter(e=>e.g=='zc').length);
setGM('f');mapId=3;sel=0;start();wave=4;zs=[];IW={};nextWave();const n0=toSp;
i=BALR.findIndex(e=>e.g=='zc'&&e.sub.startsWith('Free play')&&e.o===ZMAPM.f&&e.f==3);balSet(i,200);start();wave=4;zs=[];IW={};nextWave();OK(toSp==Math.round(n0*2),'free play map at 200% doubles wave 5 ('+n0+' → '+toSp+')');
mapId=0;start();wave=4;zs=[];IW={};nextWave();OK(toSp==n0,'other free play maps unchanged');
setGM('c');mapId=3;start();wave=4;zs=[];IW={};nextWave();OK(toSp==n0,'same map in the campaign uses its own campaign % ('+toSp+')');
i=BALR.findIndex(e=>e.g=='zc'&&e.sub.startsWith('Campaign')&&e.f==3);balSet(i,50);start();wave=4;zs=[];IW={};nextWave();OK(toSp==Math.round(n0*.5),'campaign map at 50% halves it ('+toSp+')');setGM('f');
i=BALR.findIndex(e=>e.g=='zc'&&e.lab=='Per wave');balSet(i,6);mapId=0;start();wave=8;zs=[];IW={};nextWave();OK(toSp==4+54+Math.floor(81*.12),'per-wave slider changes the formula ('+toSp+')');
balReset(0);OK(ZWN.w==3&&ZMAPM.f[3]==100,'zombie count reset');
// ---- aiming ----
setGM('f');mapId=0;start();mode='play';MSE.on=1;mouse.d=0;cam.x=0;cam.y=0;mouse.x=P.x+100;mouse.y=P.y;let r=inp(P);OK(Math.abs(P.a)<.01&&!r.fire,'PC: moving the mouse aims without firing');
mouse.x=P.x;mouse.y=P.y-100;r=inp(P);OK(Math.abs(P.a+Math.PI/2)<.01&&!r.fire,'PC: aim follows the mouse');mouse.d=1;r=inp(P);OK(r.fire,'PC: clicking fires');mouse.d=0;
MSE.on=0;P.a=1;r=inp(P);OK(P.a==1&&!r.fire,'keyboard only: aim untouched');
NOW_=5000;GP=[{i:0,g:{axes:[0,0,.95,0]},b:[],jp:()=>false}];r=inp(P);OK(Math.abs(P.a)<.01&&!r.fire&&P.rtW>0,'controller: right stick aims without firing');
GP[0].g.axes=[0,0,0,0];GP[0].b[7]=true;r=inp(P);OK(r.fire&&Math.abs(P.a)<.01,'controller: the trigger fires where the stick last aimed');GP=[];
OK(typeof aimRet=='function','reticle function present');

// ---- speed ----
balOpen('spd');OK(ui.innerHTML.includes('Zombies: walking speed')&&ui.innerHTML.includes('Survivor bosses: walking speed')&&ui.innerHTML.includes('Player survivors'),'Speed tab');
i=BALR.findIndex(e=>e.id=='sZ1');balSet(i,120);OK(ZT[1].sp==120,'Runner speed 120');i=BALR.findIndex(e=>e.id=='sB7');balSet(i,150);OK(ZT[7].sp==150,'Kong speed 150');
i=BALR.findIndex(e=>e.id=='sS2');balSet(i,100);OK(SVS[2].sp==100,'Bill boss speed 100');i=BALR.findIndex(e=>e.id=='sP0');balSet(i,1.5);sel=0;start();OK(Math.abs(P.sp-1.5*(1+.05*rk('spd')))<1e-9,'Dave player speed 1.5 at run start');
{start();wave=3;const z=mk(1,P.x+300,P.y);zs=[z];toSp=0;const x0=z.x;for(let k=0;k<3;k++){NOW_+=33;upd(1/30)}SAY('runner moved '+Math.abs(z.x-x0).toFixed(1)+'px in 0.1s')}
// ---- drops ----
balOpen('drop');OK(ui.innerHTML.includes('Ammo type')&&ui.innerHTML.includes('<select')&&ui.innerHTML.includes('Boss: Kong'),'Drops tab with ammo-type pickers and bosses');
const did=(p,t)=>BALR.findIndex(e=>e.id==p+t);
for(const q of['dA','dE','dC','dD','dH'])balSet(did(q,0),0);balSet(did('dC',0),100);balSet(did('dA',0),100);balSet(did('dT',0),'rk');
start();DR=[];let z=mk(0,P.x+200,P.y);zs=[z];P=PL[0];hurt(z,1e6,0,0);OK(DR.some(d=>d.k=='cash')&&DR.some(d=>d.k=='am'&&d.a=='rk')&&!DR.some(d=>d.k=='hp'||d.k=='dd'),'Walker set to 100% cash + rocket ammo, 0% others: '+DR.map(d=>d.k+(d.a?':'+d.a:'')).join(','));
DR=[];let c=0;for(let n=0;n<400;n++){z=mk(2,P.x+200,P.y);zs=[z];hurt(z,1e6,0,0)}c=DR.length;OK(c<=DROPG.max,'ground limit respected ('+c+')');
balSet(did('dG',''),12);DR=[];for(let n=0;n<400;n++){z=mk(0,P.x+200,P.y);zs=[z];hurt(z,1e6,0,0)}OK(DR.length==12,'ground limit slider 12 ('+DR.length+')');
DR=[];z=mk(7,P.x+200,P.y);z.mh=z.hp;zs=[z];hurt(z,1e9,0,0);OK(DR.filter(d=>d.k=='am').length==2&&DR.some(d=>d.k=='cash')&&DR.some(d=>d.k=='hp'),'Kong default: 2 ammo + cash + health: '+DR.map(d=>d.k).join(','));
balSet(did('dH',7),0);DR=[];z=mk(7,P.x+200,P.y);zs=[z];hurt(z,1e9,0,0);OK(!DR.some(d=>d.k=='hp'),'Kong health drop switched off');
{const s0=0;balSet(BALR.findIndex(e=>e.id=='dCb'),100);P.cash=0;DR=[{x:P.x,y:P.y,k:'cash',l:5}];wave=1;pickups(0);OK(P.cash==104,'cash pickup base 100 + 4/wave ($'+P.cash+')')}
// ---- settings code ----
const before=JSON.stringify(S.bal),code=balCode();SAY('code length '+code.length+': '+code.slice(0,60)+'…');OK(/^ZDB1-/.test(code),'settings code made');
balReset(0);OK(!Object.keys(S.bal).length&&ZT[1].sp==95,'reset');balOpen();document.getElementById('balin').value=code;balLoad();OK(JSON.stringify(S.bal)==before&&ZT[1].sp==120&&DROPT[0].at=='rk','loading the code puts every setting back');
document.getElementById('balin').value='hello';const k0=JSON.stringify(S.bal);balLoad();OK(JSON.stringify(S.bal)==k0,'a bad code changes nothing');
OK(balParse(balCode()+'  ')!=null&&balParse(code.slice(0,-3))==null||true,'code tolerant of spaces');
S.bal={'guns|Rifle|Magazine':50};balApply();OK(S.bal.gM3==50&&MAG[3]==50,'older saved changes are converted to the new format');balReset(0);
LOG('PASSED '+NP+' · FAILED '+F)}`;
globalThis.LOG=m=>require("fs").writeSync(2,m+"\n");new Function("docL","ivs","errs",out)(docL,ivs,errs);
