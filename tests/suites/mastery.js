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
const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+m);if(!c)errs.push(m)};
S.ac.name='Tester';S.ac.un=[0,1,2,3,4,5,6,7];const A=S.ac;msA(A);mapId=0;S.sw=1;
const run=ci=>{sel=ci;start();P.mx=P.hp=999;return P};
const kill=(t=0,d=10)=>{const z=mk(t,P.x+d,P.y);zs.push(z);KG=P.cur;hurt(z,1e9,0,0)};
// Bill
run(2);P.cds[2]=0;mouse.d=1;mouse.x=P.x+100;mouse.y=P.y;tick(1);const cd0=P.cds[2];A.ms[2].l=3;P.cds[2]=0;tick(1);const cd1=P.cds[2];ok(Math.abs(cd0/cd1-1.5)<.05,'Bill shotgun 1.5x fire rate '+cd0.toFixed(3)+' -> '+cd1.toFixed(3));mouse.d=0;
const s2=A.ms[2],k0=s2.k,x0=s2.x;kill();ok(s2.k==k0+1&&s2.sk>=1&&s2.x>x0,'Bill mastery kill + starting-gun kill tracked');
// Dave
A.ms[0].l=1;run(0);P.cash=1000;shop();ok(ui.innerHTML.includes('$200'),'Dave base shotgun price $200');A.ms[0].l=3;shop();ok(ui.innerHTML.includes('$180')&&ui.innerHTML.includes('$23'),'Dave perk: $180 shotgun, $23 heal');buy(2);ok(P.cash==820,'Dave paid 180, cash '+P.cash);nextWave();
// Robot
A.ms[1].l=3;run(1);ok(P.shd==1,'Robot plating ready at wave start');ok(arm(2)==0&&!P.shd&&arm(2)==2,'Robot blocks first hit only');
// Susie
A.ms[3].l=3;run(3);kill();ok(P.sb>1,'Susie speed burst after kill');
// Tim
A.ms[4].l=3;run(4);ok(P.ar==6,'Tim starts with full armor');A.ms[4].l=2;run(4);ok(!P.ar,'no armor below LV 3');
// Charles
A.ms[5].l=3;run(5);P.inv=0;zs=[];const zc=mk(0,P.x+5,P.y);zs.push(zc);toSp=0;tick(1);ok(Math.abs(zc.kx)>100||Math.hypot(zc.x-P.x,zc.y-P.y)>30,'Charles shoves zombie kx '+Math.round(zc.kx));
// Steve
A.ms[6].l=3;run(6);zs=[];toSp=0;const za=mk(2,P.x+60,P.y),zb=mk(2,P.x+110,P.y);zs.push(za,zb);const ha=za.hp,hb=zb.hp;P.a=0;P.cds[P.cur]=0;mouse.d=1;mouse.x=P.x+400;mouse.y=P.y;tick(1);mouse.d=0;const b0=bs[bs.length-1];ok(b0&&b0.pc==1,'Steve bolt pierces');b0.vy=0;b0.vx=480;za.y=zb.y=b0.y;za.x=b0.x+30;zb.x=b0.x+70;for(let i=0;i<30;i++)tick(1);ok(za.hp<ha&&zb.hp<hb,'one bolt hit two zombies '+(ha-za.hp).toFixed(1)+' '+(hb-zb.hp).toFixed(1));
// John
A.ms[7].l=3;run(7);ok(P.inv>=2.9,'John invincible at wave start '+P.inv);
// survivor challenge + level ups + rewards
run(2);const pts=A.pts;s2.sk=999;kill();ok(s2.cd&1&&A.pts>=pts+200,'Bill challenge 1 done +pts '+(A.pts-pts));
msXP(P,2,1e6);ok(s2.l==10&&A.sl[2]==1,'Bill mastered, slayer on');ok(ttN(A)!=''&&bdG(A)&&bdG(A).t==3,'title '+ttN(A)+' + gold badge');
run(2);ok(P.v==9,'slayer look used in single player');P.cur=2;tick(3);
for(let i=0;i<5;i++)s2.cd|=1<<i;ok(ttOK(A,2,4),'all-challenges title unlocked');
// screens
menu();ok(ui.innerHTML.includes('MASTERY')&&ui.innerHTML.includes('class=bdg')&&ui.innerHTML.includes('class=ttl'),'menu shows mastery + badge + title');
mastery(2);ok(ui.innerHTML.includes('Quick Pump')&&ui.innerHTML.includes('Zombie-Slayer'),'mastery screen');slT(2);ok(A.sl[2]==0,'slayer toggle off');slT(2);
titles();ok(ui.innerHTML.includes('Sheriff of the Dead'),'titles screen');setTT('2-4');ok(ttN(A)=='High Noon','equip title');
survs();ok(ui.innerHTML.includes('Mastery LV'),'survivor select shows mastery');
// codes
const c=enc(A),B=dec(c);ok(B&&JSON.stringify(B.ms)==JSON.stringify(A.ms)&&B.tt==A.tt&&B.bd==A.bd&&B.sl.join()==A.sl.join(),'code round trip with mastery, len '+c.length);
const f=c.split('.'),o10=f.slice(1,9).join('.'),O=dec('ZD.'+o10+'.'+ck(o10));ok(O&&O.wp&&!O.ms,'v60 code still works');
// split screen: slayer only on base colour, guests no perks
const pA=mkP(2,A,'km',0,0),pB=mkP(2,A,'km',1,3),pG=mkP(2,{g:1,name:'',xp:0,lv:1,sp:0,sk:{},pts:0,un:[0]},'km',2,0);ok(pA.v==9&&pB.v==3&&!sPk(pG,2),'MP: slayer on base colour, colour kept, guest no perk');
console.log('TOTAL errors',errs.length,errs.slice(0,5));
`;
new Function("docL","ivs","errs","started_",out)(docL,ivs,errs);
