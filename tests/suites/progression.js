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
S.ac.name='Tester';menu();ok(ui.innerHTML.includes('ARMORY')&&ui.innerHTML.includes('CHALLENGES'),'menu has armory + challenges');
mapId=0;S.sw=1;sel=0;start();const A=S.ac;ok(A.ch&&A.ch.D.length==3&&A.ch.W.length==3,'challenges generated '+A.ch.D.map(q=>q.k+':'+q.n).join(',')+' | '+A.ch.W.map(q=>q.k+':'+q.n).join(','));
ok(new Set(A.ch.D.map(q=>q.k)).size==3,'dailies distinct');
// real shooting credits the gun
P.mx=P.hp=999;zs=[];for(let i=0;i<8;i++)zs.push(mk(0,P.x+60+i*12,P.y));const k0=wpA(A)[P.cur].k,g0=P.cur;for(let f=0;f<200;f++){mouse.d=1;mouse.x=P.x+300;mouse.y=P.y;tick(1)}ok(wpA(A)[g0].k>k0,'bullet kills credited to '+WP[g0].n+': '+(wpA(A)[g0].k-k0));
// bulk kills with SMG
P.cur=1;KG=1;const pts0=A.pts;for(let i=0;i<300;i++){const z=mk(0,P.x+10,P.y);zs.push(z);hurt(z,1e9,0,0)}const w=A.wp[1];
ok(w.k==300,'smg kills '+w.k);ok(w.n==300,'close kills '+w.n);ok(w.m==100,'multi kills '+w.m);ok(camoOK(A,1,1)&&camoOK(A,1,2)&&camoOK(A,1,3)&&camoOK(A,1,4),'woodland/desert/urban/tiger unlocked');ok(!camoOK(A,1,5)&&!camoOK(A,1,7),'blood + gold still locked');
ok(w.l>1,'smg level '+w.l+' xp '+w.x);ok(P.nt.length>=4,'run log '+P.nt.length+': '+P.nt.slice(0,6).join(' | '));
wave=16;for(let i=0;i<150;i++){const z=mk(0,P.x+10,P.y);zs.push(z);hurt(z,1e9,0,0)}ok(camoOK(A,1,5),'blood after wave 15 kills');
for(let i=0;i<3;i++){const z=mk(6,P.x+10,P.y);zs.push(z);hurt(z,1e9,0,0)}ok(camoOK(A,1,6)&&camoOK(A,1,7),'toxic + gold unlocked; golds='+golds(A));ok(!camoOK(A,1,8),'diamond needs 5 golds');
for(const g of[0,2,3,4]){const q=A.wp[g];q.k=999;q.n=99;q.m=99;q.h=999;q.b=9}ok(golds(A)==5&&camoOK(A,1,8)&&!camoOK(A,1,9),'diamond at 5 golds, outbreak locked');
for(const q of A.wp){q.k=999;q.n=99;q.m=99;q.h=999;q.b=9}ok(camoOK(A,7,9),'outbreak at 11 golds');
A.wp[1].l=20;ok(Math.abs(wlD(P,1)-1.1)<1e-9&&Math.abs(wlR(P,1)-.9)<1e-9,'level 20 perks +10% dmg/+10% rate');A.wp[1].l=4;ok(wlD(P,1)==1&&wlR(P,1)==1,'no perks below level 5');A.wp[1].l=12;ok(Math.abs(wlD(P,1)-1.05)<1e-9&&Math.abs(wlR(P,1)-.95)<1e-9,'level 12 perks');
// equip + render
eqCam(1,8);ok(A.cm[1]==8&&cmOf(A,1)==8,'equip diamond');ok(camoC(0,0,1,8,3)!=null,'camo canvas builds');tick(5);
// challenge completion reward
const c=A.ch;c.D[0]={k:'kill',n:5,a:0,p:0,f:0};c.D[1]={k:'drop',n:1,a:0,p:0,f:0};c.D[2]={k:'wave',n:3,a:0,p:0,f:0};const p0=A.pts,s0=A.sp,lv0=A.lv,xp0=A.xp;
for(let i=0;i<5;i++){const z=mk(0,P.x+10,P.y);zs.push(z);hurt(z,1e9,0,0)}ok(c.D[0].f==1,'kill challenge done');chEv(P,'drop',1);wave=2;nextWave();ok(c.D[1].f&&c.D[2].f&&c.db==1,'all dailies + bonus');ok(A.pts-p0==300+150,'pts reward '+(A.pts-p0));
c.W=[{k:'boss',n:1,a:0,p:0,f:0},{k:'spend',n:100,a:0,p:0,f:0},{k:'clear',n:1,a:0,p:0,f:0}];c.wb=0;const z=mk(7,P.x,P.y);zs.push(z);hurt(z,1e9,0,0);ok(c.W[0].f,'boss weekly');P.cash=500;shop();console.log('sc0',P.sc0,mode,P.own);buy(3);console.log('after buy',P.cash,JSON.stringify(c.W));ok(c.W[2].f,'clear weekly');const sp1=A.sp,lv1=A.lv;nextWave();ok(c.W[1].f&&c.wb&&A.sp-sp1==1+(A.lv-lv1),'spend weekly + skill point bonus');
// rollover
c.d='old';c.w='old';chkC(A);ok(c.d==dKey()&&c.D.every(q=>!q.f)&&!c.db&&!c.rr,'daily rollover');reroll(0);ok(c.rr==1,'reroll once');const kk=c.D[0].k;reroll(0);ok(c.D[0].k==kk,'second reroll blocked');
// screens
armory(1);ok(ui.innerHTML.includes('Woodland')&&ui.innerHTML.includes('Outbreak')&&ui.innerHTML.includes('ARMORY'),'armory renders');eqCam(5,9);chals();ok(ui.innerHTML.includes('DAILY')&&ui.innerHTML.includes('WEEKLY'),'challenges render');
start();P.mx=P.hp=999;tick(10);pauseMenu();ok(ui.innerHTML.includes('DAILY CHALLENGES'),'pause shows dailies');quitRun();ok(ui.innerHTML.includes('RUN ENDED'),'over ok');
KG=0;P.nt=['x','y'];over(1);ok(ui.innerHTML.includes('rlog'),'over shows run log');
// codes
const code=enc(A),B=dec(code);ok(B&&JSON.stringify(B.wp)==JSON.stringify(A.wp)&&JSON.stringify(B.cm)==JSON.stringify(A.cm),'code round trip with guns, len '+code.length);
const f=code.split('.'),old=f.slice(1,8).join('.'),oc='ZD.'+old+'.'+ck(old),O=dec(oc);ok(O&&O.lv==A.lv&&!O.wp,'old-style code still works');ok(!dec(code.replace(/_/,'_9')),'tampered code rejected');
// split screen progress per profile
S.prof=[{name:'Two',xp:0,lv:1,sp:0,sk:{},pts:0,un:[0]}];
console.log('TOTAL errors',errs.length,errs.slice(0,5));
`;
new Function("docL","ivs","errs","started_",out)(docL,ivs,errs);
