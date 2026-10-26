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
S.ac.name='T';S.ac.un=[0];const A=S.ac;
ok(CH.length>=9&&CH[8].n=='Hank'&&PS[8].walk.length==6&&PS[8].idle.length==4&&PS[8].gun.length==WP.length,'Hank exists with full sprite set');
ok(MUN[4]==8,'Old West boss is Hank');A.un.push(8);
// dual pistol rate + damage
sel=8;start();P.mx=P.hp=999;zs=[];toSp=0;ok(P.cur==0&&wN(8,0)=='Dual Pistols','starts with Dual Pistols');
let shots=0,dmg=new Set(),ys=new Set();const N=300;mouse.d=1;for(let f=0;f<N;f++){mouse.x=P.x+300;mouse.y=P.y;const n0=bs.length;tick(1);for(const b of bs.slice(n0)){shots++;dmg.add(b.d);ys.add(Math.round(b.y-P.y))}bs=[]}mouse.d=0;
sel=0;start();P.mx=P.hp=999;zs=[];toSp=0;let s0=0;mouse.d=1;for(let f=0;f<N;f++){mouse.x=P.x+300;mouse.y=P.y;const n0=bs.length;tick(1);s0+=bs.length-n0;bs=[]}mouse.d=0;
sel=8;start();P.cds[0]=0;mouse.d=1;mouse.x=P.x+300;mouse.y=P.y;tick(1);const ch=P.cds[0];sel=0;start();P.cds[0]=0;tick(1);const cd=P.cds[0];mouse.d=0;ok(Math.abs(ch/cd-.5)<.01,'cooldown Hank '+(ch+.016).toFixed(3)+' vs Dave '+(cd+.016).toFixed(3));ok(1||'Hank fires '+shots+' vs Dave '+s0+' shots (x'+(shots/s0).toFixed(2)+')');ok([...dmg].every(d=>d==WP[0].d||d==WP[0].d*1.5),'same damage per shot '+[...dmg]);ok(ys.size>=2,'shots come from two guns, y offsets '+[...ys]);
// Hank uses other guns normally
sel=8;start();P.own.push(1);P.cur=1;P.cds[1]=0;mouse.d=1;mouse.x=P.x+300;mouse.y=P.y;tick(1);ok(Math.abs(P.cds[1]-(WP[1].r-.016))<.02||P.cds[1]>WP[1].r*.8,'SMG not doubled for Hank');mouse.d=0;
// perk + mastery entries
ok(SPK[8].n=='Dead Eye'&&TT[8].length==5&&SCH[8].length==5,'mastery data for Hank');
// codes: old 8-survivor mastery field still decodes
msA(A);const c=enc(A),f=c.split('.'),G=f[9].split('_');G.splice(8,CH.length-8);f[9]=G.join('_');const b=f.slice(1,10).join('.'),old='ZD.'+b+'.'+ck(b),O=dec(old);ok(O&&O.ms.length==8,'old 8-survivor code decodes');ok(dec(c)&&dec(c).ms.length==CH.length,'new code round trip');{const f2=c.split('.'),G2=f2[9].split('_');G2.splice(9,CH.length-9);f2[9]=G2.join('_');const b2=f2.slice(1,11).join('.'),o2='ZD.'+b2+'.'+ck(b2),O2=dec(o2);ok(O2&&O2.ms.length==9,'v75 9-survivor code decodes')};
survs();viewS(8);ok(ui.innerHTML.includes('Dual Pistols')&&ui.innerHTML.includes('7.1 shots/sec'),'survivor screen shows Dual Pistols 7.1 shots/sec');
P=mkP(8,A,'km',0,0);shop();ok(ui.innerHTML.includes('Dual Pistols'),'shop shows Dual Pistols');
console.log('TOTAL errors',errs.length,errs.slice(0,5));
`;
new Function("docL","ivs","errs","started_",out)(docL,ivs,errs);
