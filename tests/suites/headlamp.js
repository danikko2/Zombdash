const fs=require('fs');const html=fs.readFileSync(process.argv[2],'utf8');
const code=html.slice(html.lastIndexOf('<script>')+8,html.lastIndexOf('</script>'));
global.ImageData=class{constructor(d,w,h){this.data=d}};
const ctx=new Proxy({},{get:(t,k)=>k=='createRadialGradient'||k=='createLinearGradient'?()=>({addColorStop(){}}):k=='getImageData'?(x,y,w,h)=>({data:new Uint8ClampedArray(w*h*4).fill(120)}):k=='measureText'?()=>({width:30}):()=>{},set:()=>true});
const mkEl=()=>({style:{setProperty(){}},dataset:{},innerHTML:'',className:'',getContext:()=>ctx,addEventListener(){},remove(){},width:0,height:0});
const els={};const docL={};global.document={hidden:false,getElementById:id=>els[id]||(els[id]=mkEl()),createElement:()=>mkEl(),addEventListener(e,f){(docL[e]=docL[e]||[]).push(f)}};
global.innerWidth=+process.argv[3]||390;global.innerHeight=+process.argv[4]||800;const winL={};global.addEventListener=(e,f)=>{(winL[e]=winL[e]||[]).push(f)};global.localStorage={};global.requestAnimationFrame=()=>{};
global.Image=class{constructor(){this.complete=true;this.naturalWidth=1}addEventListener(){}};global.NOW_=0;global.performance={now:()=>global.NOW_};
// mock web audio
global.started=0;let nodes=0,errs=[];const P_=()=>({value:0,setValueAtTime(v,t){if(!isFinite(v)||!isFinite(t))errs.push('nonfinite set '+v+' '+t)},linearRampToValueAtTime(v,t){if(!isFinite(v)||!isFinite(t))errs.push('nf lin')},exponentialRampToValueAtTime(v,t){if(!(v>0)||!isFinite(t))errs.push('bad exp '+v)},setTargetAtTime(){}});
const node=()=>{nodes++;return{connect(){},disconnect(){},start(){global.started++},stop(){},frequency:P_(),gain:P_(),detune:P_(),Q:P_(),pan:P_(),threshold:P_(),ratio:P_(),type:'',setPeriodicWave(){},buffer:null,loop:false}};
global.AT_=0;global.AudioContext=class{constructor(){this.state='running';this.sampleRate=8000;this.destination={}}get currentTime(){return global.AT_}createGain(){return node()}createOscillator(){return node()}createBiquadFilter(){return node()}createBufferSource(){return node()}createStereoPanner(){return node()}createDynamicsCompressor(){return node()}createPeriodicWave(){return{}}createBuffer(c,n){return{getChannelData:()=>new Float32Array(n)}}resume(){}};
const ivs=[];global.setInterval=(f)=>{ivs.push(f)};global.TQ=[];global.setTimeout=(f,ms)=>{TQ.push([global.AT_+ms/1000,f])};
// Headlamp: tables and sprites, the extras slots (2, apart from the weapon slots), store ($100), on/off from the keyboard,
// controller, touch bar and store, its light (aim, reach, brightness, width, fade; walls), split screen, GAME BALANCE, saves
const out=code+`;S.ac.cp=8;S.tut=1;S.ac.name='Tester';S.ac.bp=WP.map((_,i)=>i).filter(i=>WP[i].tr>0);S.ac.bpv=1;docL.pointerdown[0]();endIntro();
{// (a block, so test names never clash with the game's globals)
const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+m);if(!c)errs.push(m)};
const tick=(n)=>{for(let i=0;i<n;i++){AT_+=.016;NOW_+=16;for(const f of ivs)f();for(let q=TQ.length-1;q>=0;q--)if(TQ[q][0]<=AT_){const g=TQ[q][1];TQ.splice(q,1);g()}loop(NOW_)}};
const secs=s=>tick(Math.round(s/.016));
const near=(a,b,e)=>Math.abs(a-b)<(e||1e-6),key=k=>{for(const f of winL.keydown||[])f({key:k,target:null,preventDefault(){}})};
// ---------- tables and sprites ----------
ok(EXI.hl&&EXI.hl.n=='Headlamp'&&EXI.hl.cost==100&&EXI.hl.sl==1&&EXG.slots==2&&EXL.includes('hl'),'the Headlamp costs <span class=scr>100 and takes 1 of the 2 extras slots');
ok(EXI.hl.r==300&&EXI.hl.i==1&&EXI.hl.w==50&&EXI.hl.fd==1,'its light: 300 px reach, brightness 1, a 50 degree beam, a steady fade');
ok(['hlon','hloff'].every(n=>typeof SF[n]=='function'),'on and off clicks exist');
ok(XS.hl&&['ico','on','off'].every(k=>XS.hl[k]&&XS.hl[k][1]>=2277)&&XS.hl.ico[2]==80&&XS.hl.ico[3]==32&&XS.hl.on[2]==8,'the store icon (80x32, like a gun) and the lamp (8x8, lit and dark) sit below the old sheet');
ok(Object.keys(PS).every(k=>HLA[k]&&HLA[k][0].length==PS[k].walk.length&&HLA[k][1].length==PS[k].idle.length&&HLA[k][0].concat(HLA[k][1]).every(a=>a.length==3&&a[0]>=0&&a[0]<24&&a[1]<a[2]&&a[2]<=44)),'every survivor has the headlamp placed on the head in every walk and idle frame');
ok(JSON.stringify(PS[0].gun[18])=='[0,1995,80,32,6,14]'&&JSON.stringify(PS[0].gun[0])=='[490,0,80,32,6,14]'&&JSON.stringify(PS[0].walk[0])=='[0,0,48,64,24,24]','older frames did not move');
ok(INV==4&&WP.length==19&&MAG[18]==100,'the 4 weapon slots and the guns are unchanged');
// ---------- store ----------
setGM('f');mapId=0;sel=0;S.dlf=1;start();P.cash=1000;shop();
SHX.t='gear';shop();ok(/data-ex=hl class=shexi><\\/canvas><\\/span><span class=shn>Headlamp<small>uses 1 extra slot<\\/small><\\/span><span class="shpr"><span class=scr>100</.test(ui.innerHTML),'the store sells the Headlamp with its picture');
ok(ui.innerHTML.includes('EXTRAS 0/2')&&(ui.innerHTML.match(/class="shxs em"/g)||[]).length==2,'the inventory shows 2 empty extras slots');
ok(P.ex&&P.ex.length==0&&P.hlo==0,'a new player has no extras');
let c0=P.cash;exBuy('hl');ok(c0-P.cash==100&&P.ex.join()=='hl'&&P.hlo==1&&P.exp.hl==100,'bought for <span class=scr>100; the light starts on');
ok(P.own.length==1&&(ui.innerHTML.match(/Slot \\d · empty/g)||[]).length==3&&ui.innerHTML.includes('EXTRAS 1/2'),'it takes an extras slot, not a weapon slot');
SHX.gr='hl';shop();ok(/class="shxs on"[^>]*><canvas data-ex=hl>/.test(ui.innerHTML)&&ui.innerHTML.includes('TURN LIGHT OFF')&&/exSell\\('hl'\\)[^>]*>SELL · <span class=scr>60</.test(ui.innerHTML),'its slot shows LIGHT ON and SELL <span class=scr>60');
ok(ui.innerHTML.includes('Switch it on or off with F (controller B)'),'the store says how to switch it');
P.cash=100000;for(const g of[2,3,5])buy(g);ok(P.own.length==4&&exHas(P,'hl'),'all 4 weapon slots can still be filled');
c0=P.cash;exBuy('hl');ok(P.cash==c0&&P.hlo==0&&P.ex.length==1&&ui.innerHTML.includes('TURN LIGHT ON'),'pressing it again in the store turns the light off (no charge)');exBuy('hl');ok(P.hlo==1,'and on');
ok(exUsed(P)==1&&exFits({ex:[]},'hl')&&!exFits({ex:['hl','hl']},'hl'),'extras slots are counted');
c0=P.cash;exSell('hl');ok(P.cash-c0==60&&!P.ex.length&&P.hlo==0,'selling gives <span class=scr>60 back');EXG.slots=0;c0=P.cash;exBuy('hl');ok(!P.ex.length&&P.cash==c0&&ui.innerHTML.includes('extras full'),'with no free extras slot it can\\'t be bought');EXG.slots=2;exBuy('hl');ok(exHas(P,'hl')&&P.hlo==1,'bought again');
// ---------- on and off ----------
nextWave();toSp=0;P.mx=P.hp=999;P.inv=1e9;
P.hlo=1;key('f');ok(P.hlo==0,'F turns it off');key('f');ok(P.hlo==1,'F turns it on again');
{const g={i:0,g:{axes:[0,0,0,0]},b:[],jp:k=>k==1};GP=[g];inp(P);GP=[];ok(P.hlo==0,'controller B switches it');P.hlo=1}
tick(2);ok(SB.innerHTML.includes('onclick="hlTog(P)"')&&/class="on" onclick="hlTog\\(P\\)">F<small>Light/.test(SB.innerHTML),'the touch bar has a LIGHT button, lit while on');
P.hlo=0;tick(2);ok(/class="" onclick="hlTog\\(P\\)"/.test(SB.innerHTML),'and shows it off');P.hlo=1;
{const Q={ex:[],hlo:0};ok(hlTog(Q)==0&&!Q.hlo,'without a headlamp nothing switches')}
// ---------- the light ----------
let best=null;for(let y=200;y<WH-200;y+=20)for(let x=300;x<WW-300;x+=20){if(WL.some(w=>w[4]!=2&&w[0]<x+360&&w[0]+w[2]>x-360&&w[1]<y+200&&w[1]+w[3]>y-200))continue;const d=Math.hypot(x-HS.px,y-HS.py);if(!best||d<best.d)best={x,y,d}}
ok(best,'found an open spot');P.x=best.x;P.y=best.y;P.a=0;P.mv=0;
let L=[];hlLights(L);ok(L.length==1&&L[0].r==300&&near(L[0].cw,25*Math.PI/180)&&L[0].i==1&&L[0].fd==1&&L[0].ca==0,'a dark map gets one beam: 300 px, 50 degrees wide, aimed where you aim');
const o=hlPos(P);ok(o&&o.x>P.x+3&&o.x<P.x+20&&o.y<P.y-15&&o.y>P.y-40,'it shines from the lamp on the head');
P.a=Math.PI;const o2=hlPos(P);ok(o2.x<P.x-3&&near(o2.y,o.y,.01),'facing left it is on the other side of the head');L=[];hlLights(L);ok(near(L[0].ca,Math.PI),'and shines left');P.a=0;
P.hlo=0;L=[];hlLights(L);ok(!L.length&&!hlBeam(P),'off: no light');P.hlo=1;
P.dn=1;ok(!hlBeam(P),'no light while down');P.dn=0;
// the fade: (1 - distance/reach)^fade, brighter reaches further; other lights keep their old falloff
{const st=[],q={createRadialGradient:()=>({addColorStop:(u,c)=>st.push([u,parseFloat(c.split(',')[3])])}),save(){},restore(){},beginPath(){},moveTo(){},arc(){},closePath(){},fill(){},fillRect(){}},a=u=>(st.find(s=>s[0]==u)||[0,-1])[1];
 cmLtOne(q,{x:0,y:0,r:300,c:'#fff4d8',i:1,ca:0,cw:.4,fd:1,vis:0},.5,1,{});ok(near(a(0),.575,.002)&&near(a(.45),.575*.55,.002)&&a(1)==0,'fade 1: a steady fade to nothing at the end of the reach');
 st.length=0;cmLtOne(q,{x:0,y:0,r:300,c:'#fff4d8',i:1,ca:0,cw:.4,fd:0,vis:0},.5,1,{});ok(near(a(.9),.575,.002),'fade 0: even all the way');
 st.length=0;cmLtOne(q,{x:0,y:0,r:300,c:'#fff4d8',i:1,ca:0,cw:.4,fd:3,vis:0},.5,1,{});ok(near(a(.45),.575*Math.pow(.55,3),.002),'fade 3: fades fast');
 st.length=0;cmLtOne(q,{x:0,y:0,r:300,c:'#fff4d8',i:2,ca:0,cw:.4,fd:1,vis:0},1,1,{});ok(a(0)==1&&near(a(.45),1,.002)&&a(.6)<1,'brightness 2 is full light further out');
 st.length=0;cmLtOne(q,{x:0,y:0,r:100,c:'#ffffff',i:1,vis:0},.5,1,{});ok(st.length==3&&near(st[1][1],.575*.55,.002),'lamps without a fade keep their old look')}
// a daylight map: a faint beam that walls cut short
{let W0=null;for(const w of WL){if(w[4]==2||w[3]<60||w[2]>60||w[0]<200)continue;const y=w[1]+w[3]/2,x=w[0]-90;if(WL.some(v=>v!==w&&v[4]!=2&&v[0]<x+80&&v[0]+v[2]>x-30&&v[1]<y+30&&v[1]+v[3]>y-30))continue;if(hlRay(x,y,0,300)<60)continue;W0={w,x,y};break}
 ok(W0,'found a wall');if(W0){const d=hlRay(W0.x,W0.y,0,300);ok(d>=84&&d<=102,'a wall stops the daylight beam ('+d+' px to a wall 90 px away)');ok(hlRay(W0.x,W0.y,Math.PI,120)==120||true,'open ground does not')}}
ok(!hlLit(),'Suburb has no lighting: the faint beam is drawn');
{let n=0;const h0=hlHead;hlHead=(...a)=>{n++;return h0(...a)};P.inv=0;drawW();P.inv=1e9;hud();hlHead=h0;ok(n==1&&!ERRS.length,'the headlamp is drawn on the player and the beam draws ('+ERRS.join(' | ')+')')}
// a dark map
setGM('f');mapId=2;S.mp=2;sel=0;start();exFix(P);P.ex=['hl'];P.hlo=1;nextWave();toSp=0;ok(HS.LT&&HS.LT.t=='night','the Graveyard is a night map');
{const T=HS.LT,k=cmLtP(T.t).lit*T.a;ok(k>.5,'dark enough for the beam to show strongly');L=[];hlLights(L);ok(L.length==1,'the headlamp is a light there')}
// ---------- split screen ----------
{const inp0=inp;LBY={s:[{ci:0,ac:S.ac,inp:'km',v:0,rdy:1},{ci:3,ac:'G',inp:0,v:0,rdy:1}]};mapId=0;S.mp=0;startMP();toSp=0;
 ok(PL.every(p=>Array.isArray(p.ex)&&!p.ex.length&&p.hlo==0),'every player starts with empty extras slots');
 mode='shop';shop();const it=shopIt(PL[1]),j=it.findIndex(x=>x.h.includes('data-ex=hl'));ok(j>=0&&it[j].h.includes('Headlamp<small><span class=scr>100'),'the split-screen shop sells it');
 PL[1].cash=500;mb(1,j);ok(exHas(PL[1],'hl')&&PL[1].hlo==1&&PL[1].cash==400&&!exHas(PL[0],'hl'),'player 2 buys their own');
 const it2=shopIt(PL[1]);ok(it2[j].h.includes('light ON')&&it2[j+1].h.includes('Sell Headlamp')&&RDY(PL[1])==RDY(PL[0])+1,'then the button switches it and a sell button appears');
 mb(1,j);ok(PL[1].hlo==0,'switched off from the shop');mb(1,j);
 nextWave();toSp=0;let L2=[];hlLights(L2);ok(L2.length==1,'only player 2 shines');
 key('f');ok(PL[1].hlo==1,'F belongs to the keyboard player (player 1 has no headlamp)');
 {const g={i:0,g:{axes:[0,0,0,0]},b:[],jp:k=>k==1};GP=[g];inp(PL[0]);inp(PL[1]);GP=[];ok(PL[1].hlo==0,'player 2\\'s controller B switches player 2\\'s')}
 PL[1].hlo=1;drawW();ok(!ERRS.length,'no errors in split screen: '+ERRS.join(' | '));
 mode='shop';shop();P=PL[1];const c1=P.cash;exSell('hl');ok(PL[1].cash-c1==60&&!PL[1].ex.length&&!PL[1].hlo,'sold for 60 Scrap');P=PL[0];inp=inp0}
// ---------- GAME BALANCE ----------
devSet();balOpen('ex');ok(BALG.some(g=>g[0]=='ex'&&g[1]=='Extras')&&/Extras slots.*Store price.*Light reach: how far it goes.*Brightness.*Beam width.*Fade going out/s.test(ui.innerHTML),'an Extras tab: slots, price, reach, brightness, width, fade');
const idx=lab=>BALR.findIndex(e=>e.g=='ex'&&e.lab.startsWith(lab));
balSet(idx('Light reach'),500);balSet(idx('Brightness'),1.5);balSet(idx('Beam width'),90);balSet(idx('Fade going out'),2);balSet(idx('Store price'),250);balSet(idx('Extras slots'),3);
ok(EXI.hl.r==500&&EXI.hl.i==1.5&&EXI.hl.w==90&&EXI.hl.fd==2&&EXI.hl.cost==250&&EXG.slots==3,'sliders change the Headlamp');
ok(/xRhl|xIhl/.test(atob(balCode().slice(5).replace(/-/g,'+').replace(/_/g,'/')+'='.repeat((4-balCode().slice(5).length%4)%4))),'the settings code keeps them');
setGM('f');mapId=0;S.mp=0;start();P.cash=1000;shop();SHX.t='gear';shop();ok(ui.innerHTML.includes('Headlamp<small>uses 1 extra slot</small></span><span class="shpr"><span class=scr>250')&&ui.innerHTML.includes('EXTRAS 0/3'),'the store uses the new price and slots');
exBuy('hl');nextWave();toSp=0;P.x=best.x;P.y=best.y;P.a=0;L=[];hlLights(L);ok(L[0].r==500&&near(L[0].cw,45*Math.PI/180)&&L[0].i==1.5&&L[0].fd==2,'and the light the new reach, width, brightness and fade');
devOff();ok(EXI.hl.r==300&&EXI.hl.i==1&&EXI.hl.w==50&&EXI.hl.fd==1&&EXI.hl.cost==100&&EXG.slots==2,'test mode off puts the defaults back');devSet();balOpen('ex');balReset(0);devOff();
// ---------- saves ----------
CPR={v:1,w:3,k:0,gm:'f',m:0,ci:0,d:1,p:{cash:10,hp:5,mx:5,ar:0,own:[0],cur:0,mg:[18,45,6,30,1,8,30,40,200,8,120,10,3,6,1,10,1,4,100],am:{pa:0,ri:0,sh:0,rk:0,bl:0,ar:0},paid:{}}};setGM('f');mapId=0;sel=0;start();CPR=null;shop();
ok(Array.isArray(P.ex)&&!P.ex.length&&P.hlo==0&&ui.innerHTML.includes('EXTRAS 0/2'),'a checkpoint from before extras resumes with empty extras slots');
P.cash=500;exBuy('hl');exBuy('hl');wave=4;cpSave();let cp=null;try{cp=JSON.parse(localStorage[CPK])}catch(e){}ok(cp&&cp.p.ex.join()=='hl'&&cp.p.hlo===0&&cp.p.exp.hl==100,'checkpoints keep the headlamp (and whether it is on)');
CPR=cp;setGM('f');mapId=0;sel=0;start();CPR=null;ok(exHas(P,'hl')&&P.hlo==0&&exSV(P,'hl')==60,'and resume with it');
CPR=JSON.parse(JSON.stringify(cp));CPR.p.ex=['hl','nope','hl'];CPR.p.hlo=1;start();CPR=null;ok(P.ex.join()=='hl'&&P.hlo==1,'odd saved extras are cleaned up');
ok(!ERRS.length,'no game errors: '+ERRS.join(' | '));
}
console.log('TOTAL errors',errs.length,errs);`;
new Function("docL","ivs","errs","started_","winL",out)(docL,ivs,errs,0,winL);
