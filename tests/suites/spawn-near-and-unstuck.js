// Zombdash Blueprints: zombies appear within walking reach of a player (many crawling out of the ground), the crawl-out,
// zombies working themselves free of corners, trees and walls, the Spawning tab of Game Balance and the "Show stuck zombies" switch.
// Runs the real game in Node with a fake browser.
const fs=require('fs');const html=fs.readFileSync(process.argv[2],'utf8');
const code=html.slice(html.lastIndexOf('<script>')+8,html.lastIndexOf('</script>'));
global.ImageData=class{constructor(d,w,h){this.data=d}};
const ctx=new Proxy({},{get:(t,k)=>k=='getImageData'?(x,y,w,h)=>({data:new Uint8ClampedArray(w*h*4).fill(120)}):k=='createImageData'?(w,h)=>({data:new Uint8ClampedArray(w*h*4)}):k=='measureText'?()=>({width:30}):/Gradient|Pattern/.test(k)?()=>({addColorStop(){}}):()=>{},set:()=>true});
const mkEl=()=>({style:{setProperty(){}},dataset:{},innerHTML:'',className:'',classList:{add(){},remove(){},toggle(){},contains(){return false}},getContext:()=>ctx,addEventListener(){},remove(){},querySelector(){return null},querySelectorAll(){return[]},width:0,height:0});
const els={};const docL={};global.document={hidden:false,getElementById:id=>els[id]||(els[id]=mkEl()),createElement:()=>mkEl(),addEventListener(e,f){(docL[e]=docL[e]||[]).push(f)},body:mkEl()};
global.innerWidth=1280;global.innerHeight=800;global.addEventListener=()=>{};global.localStorage={};global.requestAnimationFrame=()=>{};
global.Image=class{constructor(){this.complete=true;this.naturalWidth=1}addEventListener(){}};global.NOW_=0;global.performance={now:()=>global.NOW_};
const P_=()=>({value:0,setValueAtTime(){},linearRampToValueAtTime(){},exponentialRampToValueAtTime(){},setTargetAtTime(){}});
const node=()=>({connect(){},disconnect(){},start(){},stop(){},frequency:P_(),gain:P_(),detune:P_(),Q:P_(),pan:P_(),threshold:P_(),ratio:P_(),type:'',setPeriodicWave(){},buffer:null,loop:false});
global.AT_=0;global.AudioContext=class{constructor(){this.state='running';this.sampleRate=8000;this.destination={}}get currentTime(){return global.AT_}createGain(){return node()}createOscillator(){return node()}createBiquadFilter(){return node()}createBufferSource(){return node()}createStereoPanner(){return node()}createDynamicsCompressor(){return node()}createPeriodicWave(){return{}}createBuffer(c,n){return{getChannelData:()=>new Float32Array(n)}}resume(){}};
const ivs=[];global.setInterval=f=>{ivs.push(f)};global.TQ=[];global.setTimeout=(f,ms)=>{TQ.push([global.AT_+(ms||0)/1000,f]);return TQ.length};global.clearTimeout=()=>{};
const test=`;S.ac.name='Tester';delete S.ac.cp;S.dlc=1;
docL.pointerdown[0]();endIntro();
const tick=n=>{for(let i=0;i<n;i++){AT_+=.016;NOW_+=16;for(const f of ivs)f();for(let q=TQ.length-1;q>=0;q--)if(TQ[q][0]<=AT_){const g=TQ[q][1];TQ.splice(q,1);g()}loop(NOW_)}};
let fails=0,n=0;const ok=(c,m)=>{n++;if(c)console.log('PASS '+m);else{fails++;console.log('FAIL '+m)}};
const has=s=>ui.innerHTML.includes(s);const secs=s=>tick(Math.round(s/.016));
const Z0=Object.assign({},ZSPN),U0=Object.assign({},ZUN);const reset=()=>{Object.assign(ZSPN,Z0);Object.assign(ZUN,U0)};
const cell=(x,y)=>cl(y/gs|0,0,gh-1)*gw+cl(x/gs|0,0,gw-1),walk=(F,z)=>{const v=F[cell(z.x,z.y)];return v<0?1e9:v*gs};
const med=a=>{const s=a.slice().sort((x,y)=>x-y);return s[s.length>>1]};
S.ac.bm=[(1<<20)-1,(1<<20)-1,(1<<20)-1];S.ac.un=[0,1,2,3];sv();tick(5);
const run=m=>{setGM('f');mapId=m;S.mp=m;sel=0;start();BRK=null;mode='play';toSp=0;zs=[];wave=6;bfs(fd,P.x,P.y)};
const many=(k,t)=>{const L=[];for(let i=0;i<k;i++){const z=spawnZ(t==null?0:t);if(!z)continue;L.push(z);zs.splice(zs.indexOf(z),1)}return L};
// ---------- where zombies appear ----------
{run(13);const L=many(200),W=L.map(z=>walk(fd,z)),G=L.filter(z=>z.ri>0&&ZSPC.g>0);
 ok(L.length==200&&med(W)<=ZSPN.far&&W.filter(w=>w>ZSPN.far*1.45).length<6,'Downtown: zombies appear within walking reach (median '+med(W)+' px along the path)');
 ok(ZSPC.g>40&&ZSPC.p>40,'some crawl out of the ground, some come from the spawn points ('+JSON.stringify(ZSPC)+')');
 ZSPN.gnd=100;const A=many(120);ok(A.every(z=>z.ri>0&&!bl[cell(z.x,z.y)]&&fd[cell(z.x,z.y)]>=0&&Math.hypot(z.x-P.x,z.y-P.y)>=ZSPN.min),'every crawl-out is on open ground the path reaches, never closer than '+ZSPN.min+' px to the player');
 ok(A.every(z=>!wlAt(z.x,z.y).some(w=>z.x>w[0]-ZT[z.t].r&&z.x<w[0]+w[2]+ZT[z.t].r&&z.y>w[1]-ZT[z.t].r&&z.y<w[1]+w[3]+ZT[z.t].r)),'and never in or against a wall');
 ZSPN.near=200;ZSPN.far=500;const B=many(120).map(z=>walk(fd,z));ok(med(B)<=500&&Math.max(...B)<=700,'a closer band in Game Balance brings them closer (max '+Math.max(...B)+' px)');
 reset();ZSPN.on='classic';const C=many(120).map(z=>walk(fd,z));ok(med(C)>med(W)+300&&ZSPC.o>=120,'Classic spawning is the old way: much farther ('+med(C)+' px)');reset();
 const g0=ZSPC.g,b=spawnZ(6);ok(b&&!(b.ri>0)&&ZSPC.g==g0,'bosses keep the old way: no crawl-out');zs=[]}
// a map without spawn points: the ground share crawls out, the rest still walk in from just off the screen
{run(1);const L=many(150);ok(ZSPC.g>30&&ZSPC.o>30&&ZSPC.p==0,'the Warehouse (no spawn points): crawl-outs and walk-ins from off the screen ('+JSON.stringify(ZSPC)+')')}
// no-spawn zones of a custom map hold for crawl-outs too
{const J={format:'zombdash-map',version:3,name:'T',tileSize:32,width:40,height:40,ground:'grass',playerStart:{x:640,y:640},features:[{kind:'nospawn',x:600,y:600,w:80,h:80,options:{skip:0,nogo:0}},{kind:'nospawn',x:0,y:0,w:1280,h:400}]};
 const r=cmRead(JSON.stringify(J));CMPTD=r.doc;mapId=CMPTK;setGM('f');start();BRK=null;mode='play';bfs(fd,P.x,P.y);ZSPN.gnd=100;let bad=0,all=0;for(let i=0;i<300;i++){const z=spawnZ(0);if(!z)continue;all++;if(z.y<400&&z.x>0&&z.x<1280)bad++}zs=[];reset();over(1);
 ok(all>250&&!bad,'crawl-outs keep out of every no-spawn zone of a custom map ('+bad+' of '+all+')')}
// split screen: each player's own path, and no crawl-out next to any player
{LBY={s:[{inp:'km',ac:S.ac,ci:0,v:0,rdy:1},{inp:0,ac:'G',ci:1,v:0,rdy:1}]};setGM('f');mapId=13;startMP();BRK=null;mode='play';toSp=0;zs=[];PL[1].x+=600;for(const p of PL){p.fd=new Int16Array(fd.length);bfs(p.fd,p.x,p.y)}ZSPN.gnd=100;
 let bad=0,k=0;for(let i=0;i<120;i++){P=PL[i%2];const z=spawnZ(0);if(!z)continue;k++;if(PL.some(p=>Math.hypot(p.x-z.x,p.y-z.y)<ZSPN.min))bad++;if(walk(P.fd,z)>ZSPN.far*1.45)bad++}P=PL[0];zs=[];reset();
 ok(k>100&&!bad,'split screen: crawl-outs are in reach of the player they are after and never next to either player ('+bad+' of '+k+')');over(1)}
// ---------- crawling out ----------
{run(0);const z=mk(0,P.x+12,P.y);zRise(z);zs=[z];const hp=P.hp,x0=z.x,y0=z.y;P.inv=0;tick(30);
 ok(z.ri>0&&z.x==x0&&z.y==y0&&P.hp==hp,'a zombie crawling out can\\'t move or bite, even right next to the player');
 draw();ok(true,'drawing a crawl-out works');secs(1.2);ok(!(z.ri>0)&&ZHL.length==1,'when it is out it leaves a hole behind');P.inv=9;secs(1);ok(Math.hypot(z.x-x0,z.y-y0)>1,'and then it moves');
 secs(3);ok(!ZHL.length,'the hole fades away');
 const q=mk(0,P.x+300,P.y);zRise(q);zs=[q];hurt(q,1e9,0,0);tick(3);ok(!zs.includes(q),'it can be shot while it crawls out');zs=[]}
// ---------- getting unstuck ----------
// the Stadium has a gap 20 px wide that a 26 px wide zombie used to stay caught in
{const free=()=>{run(17);const z=mk(2,2468,1180);zs=[z];const px=P.x,py=P.y;for(let f=0;f<60*6&&z.x>2420;f++){P.x=px;P.y=py;P.inv=9;tick(1)}return z};
 ZUN.chk=1e9;let z=free();ok(z.x>2440,'without the unstuck checks a Brute stays caught in the Stadium gap');reset();
 const s0=ZUNC.sq;z=free();ok(z.x<2420&&ZUNC.sq>0,'with them it squeezes through and carries on ('+(z.x|0)+')');zs=[]}
{run(13);let k=-1;for(let j=2;j<gh-2&&k<0;j++)for(let i=2;i<gw-2;i++){const c=j*gw+i;if(bl[c]&&fd[c]<0&&!bl[c+1]&&fd[c+1]>=0){k=c;break}}
 const z=mk(0,(k%gw)*gs+gs/2,(k/gw|0)*gs+gs/2);zs=[z];const h0=ZUNC.hp;zFree(z);const c=cell(z.x,z.y);
 ok(k>=0&&ZUNC.hp==h0+1&&!bl[c]&&fd[c]>=0,'a zombie that stays caught is lifted onto the nearest open square of its path');
 const a=0;zSide(z,a);const s1=z.usd;ok(z.ust>0,'a side-step goes for a moment');zSide(z,a);ok(z.usd==-s1,'and goes the other way the next time');
 const w=mk(0,z.x+ZT[0].r*1.5,z.y);zs=[z,w];ok(zCrowd(z,0)&&!zCrowd(z,Math.PI),'a zombie right in front holds it up (it waits its turn instead)');zs=[]}
// a player squeezed into a gap the path grid counts as wall: the zombies still find the way
{let found=null;for(const m of[13,17,15,0,3]){run(m);for(let j=3;j<gh-3&&!found;j++)for(let i=3;i<gw-3;i++){const c=j*gw+i;if(!bl[c]||!bl[c-1]||!bl[c+1]||!bl[c-gw]||!bl[c+gw])continue;let o=0;for(let b=-2;b<=2;b++)for(let a=-2;a<=2;a++)if(!bl[c+b*gw+a])o++;if(o>=3){found=[m,i*gs+8,j*gs+8];break}}if(found)break}
 if(found){run(found[0]);bfs(fd,found[1],found[2]);let r=0;for(let k=0;k<fd.length;k++)if(fd[k]>=0)r++;ok(r>200,'a player squeezed into a tight gap is still reachable ('+r+' squares)')}else ok(true,'no tight gap on these maps')}
// ---------- Game Balance and test mode ----------
{S.dev=1;balOpen('sn');ok(has('Spawning')&&has('Closest (walking px)')&&has('Zombies that crawl out of the ground')&&has('Seconds to crawl out')&&has('Side-step length'),'Game Balance has a Spawning tab with the band, the crawl-outs and the unstuck numbers');
 const i=BALR.findIndex(e=>e.id=='sN'),j=BALR.findIndex(e=>e.id=='sO');balSet(i,250);ok(ZSPN.near==250&&S.bal.sN==250,'changing the closest distance changes the game');balSet(i,null);ok(ZSPN.near==Z0.near&&!('sN' in S.bal),'reset puts it back');
 balSet(j,'classic');ok(ZSPN.on=='classic','spawning can be switched back to the old way');balSet(j,null);ok(ZSPN.on=='near','and back');
 ok(DTL.some(d=>d[0]=='stk'),'test switch: Show stuck zombies');run(0);const z=mk(0,P.x+100,P.y);z.sk=1;z.un=.5;zs=[z];S.dt={stk:1};draw();S.dt={fps:1};const t=fmText(500);ok(t.includes('spawns ground')&&t.includes('stuck  squeezed'),'the frame readout counts spawns and unsticks');S.dt={};S.dev=0;zs=[]}
// ---------- the zombie limit (Game Balance → Caps) ----------
{S.dev=1;balInit();ok(ZCAPn(1)==60&&ZCAPn(2)==85&&ZCAPn(4)==130,'the limit starts at 60 alone, 85 for two players, 130 for four');
 const iS=BALR.findIndex(e=>e.id=='zL1'),iM=BALR.findIndex(e=>e.id=='zLm'),iP=BALR.findIndex(e=>e.id=='zLp');balOpen('caps');ok(has('Zombies alive at once')&&has('One player')&&has('Split screen, at most'),'Game Balance → Caps has the zombie limit');
 balSet(iS,90);ok(ZCAPn(1)==90&&ZCAPn(2)==115&&ZCAPn(4)==130,'raising it to 90 lets 90 be alive at once (split screen still stops at its most)');
 S.dt={god:1};run(13);toSp=200;secs(60);ok(mode=='play'&&zs.length>60&&zs.length<=90,'a run keeps spawning past 60, up to the new limit ('+zs.length+' alive, '+mode+')');
 balSet(iS,30);toSp=200;secs(3);ok(zs.length>30,'lowering it leaves the zombies already out alone');zs=zs.slice(0,10);toSp=200;secs(25);ok(zs.length<=30&&zs.length>20,'and new ones only come while fewer than 30 are alive ('+zs.length+')');
 balSet(iM,40);balSet(iP,5);ok(ZCAPn(2)==35&&ZCAPn(4)==40,'each extra player and the split-screen most can be changed too');balSet(iS,500);ok(ZCAPn(3)==500,'split screen never gets fewer than one player');
 for(const i of[iS,iM,iP])balSet(i,null);ok(ZCAPn(1)==60&&ZCAPn(4)==130&&!('zL1' in S.bal),'reset puts 60 / 130 back');zs=[];toSp=0;S.dt={};S.dev=0}
// ---------- drawing cost ----------
{run(13);const fx=P.x<WW/2?WW-60:60,fy=P.y<WH/2?WH-60:60,a=mk(0,P.x+50,P.y),b=mk(0,fx,fy),c=mk(6,fx,fy);zs=[a,b,c];const D0=zDr,seen=[];zDr=z=>seen.push(z);try{draw()}finally{zDr=D0}
 ok(seen.includes(a)&&!seen.includes(b)&&seen.includes(c),'zombies off the screen are not drawn (bosses always are)');zs=[]}
{S.dev=1;S.dt={fps:1};mode='play';FM.t=[16,40,35,16];FM.u=[1];FM.d=[3];FM.f=[[16,1,3],[40,2,14],[35,1,4],[16,1,3]];const t=fmText(500);ok(t.includes('late  2 frames: 1 game work · 1 outside the game'),'the readout says which late frames were the game and which were outside it');FM.f=[];S.dt={};S.dev=0}
console.log('TOTAL fails '+fails+' of '+n);
`;
const AF=Object.getPrototypeOf(async function(){}).constructor;
new AF('docL','ivs',code+test)(docL,ivs).catch(e=>{console.log('FAIL crashed: '+(e&&e.stack||e));console.log('TOTAL fails 1');process.exitCode=1});
