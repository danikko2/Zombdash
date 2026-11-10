// Zombdash Blueprints: Scrap, workbenches on the maps, the break between waves, mid-wave ammo crafting, blueprints and bench
// levels, Zombie Pts earning, the split-screen bench stores, the Map Workshop's Crafting Bench and the Game Balance numbers.
// Runs the real game in Node with a fake browser and fake controllers.
const fs=require('fs');const html=fs.readFileSync(process.argv[2],'utf8');
const code=html.slice(html.lastIndexOf('<script>')+8,html.lastIndexOf('</script>'));
global.ImageData=class{constructor(d,w,h){this.data=d}};
const ctx=new Proxy({},{get:(t,k)=>k=='getImageData'?(x,y,w,h)=>({data:new Uint8ClampedArray(w*h*4).fill(120)}):k=='createImageData'?(w,h)=>({data:new Uint8ClampedArray(w*h*4)}):k=='measureText'?()=>({width:30}):()=>{},set:()=>true});
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
const has=s=>ui.innerHTML.includes(s),bx=s=>BX.innerHTML.includes(s);
const mkPad=i=>({index:i,connected:true,buttons:Array.from({length:17},()=>({pressed:false,value:0})),axes:[0,0,0,0]});
const PADS=[mkPad(0),mkPad(1)];Object.defineProperty(globalThis,'navigator',{value:{getGamepads:()=>PADS},configurable:true});
const press=(p,b)=>{PADS[p].buttons[b].pressed=true;tick(1);PADS[p].buttons[b].pressed=false;tick(1)};
const secs=s=>tick(Math.round(s/.016));
S.ac.un=[0,1,2,3];sv();tick(5);
// ---------- weapon tiers and the tunable numbers ----------
ok(WP.every(w=>w.tr>=0&&w.tr<=5),'every weapon has a tier in the weapon table');
ok([0,1,2,11].every(i=>bpTier(i)==0)&&[8,3,15].every(i=>bpTier(i)==1)&&[4,16,5].every(i=>bpTier(i)==2)&&[18,6,13,12].every(i=>bpTier(i)==3)&&[17,14].every(i=>bpTier(i)==4)&&[7,9,10].every(i=>bpTier(i)==5),'tiers match the design table');
ok(bpPrice(8)==500&&bpPrice(4)==1000&&bpPrice(6)==1500&&bpPrice(17)==2000&&bpPrice(7)==2500,'blueprint prices per tier');
ok(bpUpC(2)==2500&&bpUpC(3)==4000&&bpUpC(4)==5500&&bpUpC(5)==7000,'bench upgrade costs');
ok(bpCraftT(1)==10&&bpCraftT(2)==8.5&&bpCraftT(5)==4,'ammo craft time 10 s, 1.5 s less per level, 4 s at level 5');
ok(brkLen()==120,'the break is 2 minutes');
// ---------- benches on the built-in maps ----------
const cnt={};for(let m=0;m<MP.length;m++){mapId=m;build();cnt[m]=BN.length;const L=BN.every(b=>{const c=fd[cl(Math.floor((b.y+18)/gs),0,gh-1)*gw+cl(Math.floor(b.x/gs),0,gw-1)];bfs(fd,HS.px,HS.py);return fd[cl(Math.floor((b.y+18)/gs),0,gh-1)*gw+cl(Math.floor(b.x/gs),0,gw-1)]>=0});
 if(!L)console.log('unreachable bench on',MP[m].n,JSON.stringify(BN))}
ok([0,1,2,3,4,5,6,7,8,10,11,12].every(m=>cnt[m]==1),'small maps have 1 bench');
ok([9,14,16].every(m=>cnt[m]==2)&&[13,15,17].every(m=>cnt[m]==3),'large maps have 2 (Mansion, Market, Foundry) or 3 (Downtown, Main Street, Stadium)');
{let reach=1,far=1;for(let m=0;m<MP.length;m++){mapId=m;build();bfs(fd,HS.px,HS.py);for(const b of BN){if(fd[cl(Math.floor((b.y+18)/gs),0,gh-1)*gw+cl(Math.floor(b.x/gs),0,gw-1)]<0)reach=0}for(let a=0;a<BN.length;a++)for(let c=a+1;c<BN.length;c++)if(Math.hypot(BN[a].x-BN[c].x,BN[a].y-BN[c].y)<400)far=0}
 ok(reach,'every bench can be walked to from the player start');ok(far,'benches on the same map are far apart')}
{mapId=13;build();const a=JSON.stringify(BN);innerWidth=700;innerHeight=500;rs();build();ok(JSON.stringify(BN)===a,'bench spots don\\'t depend on the screen size');innerWidth=1280;innerHeight=800;rs()}
{mapId=0;build();const b=BN[0];ok(Math.hypot(b.x-HS.px,b.y-HS.py)<320,'the first bench is a short walk from the player start')}
// ---------- Scrap ----------
setGM('f');mapId=0;sel=0;start();P.mx=P.hp=999;
ok(mode=='play'&&wave==1&&!BRK,'a run starts on wave 1 with no break');
P.cash=777;shop();ok(has('class=scr')&&has('777')&&!/\\$\\d/.test(ui.innerHTML),'the store shows Scrap, never $');mode='play';ui.innerHTML='';
{const v0=P.cash;DR.push({x:P.x,y:P.y,k:'cash',l:9,ph:0});tick(2);ok(P.cash>v0&&FT.some(f=>/SCRAP/.test(f.t)),'a Scrap pickup says SCRAP');DR=[]}
ok(SKB.some(b=>b.k.some(k=>k.id=='cash'&&/Scrap/.test(k.d(1))))&&SKB.some(b=>b.k.some(k=>k.id=='head'&&/Scrap/.test(k.d(1)))),'Pocket Change and Head Start talk about Scrap');
// ---------- the break between waves ----------
zs=[];toSp=0;tick(3);ok(mode=='play'&&BRK&&BRK.k==0&&Math.abs(BRK.t-120)<1,'clearing a wave starts a 2-minute break and the game keeps running');
ok(toSp==0,'no zombies come during the break');
{const t0=BRK.t;secs(5);ok(BRK&&Math.abs(t0-BRK.t-5)<.2&&zs.length==0,'the clock counts down, still no zombies')}
// walk to the bench and open it
{const b=BN[0];P.x=b.x;P.y=b.y+18;tick(2);ok(bnNear(P)==0,'standing in front of the bench');keys.e=0;
 bnKey('e');ok(mode=='shop'&&has('WORKBENCH · LEVEL 1')&&has('class="brkt'),'E opens the bench: the store, with the countdown');
 const t0=BRK.t;secs(2);ok(t0-BRK.t>1.8,'the countdown keeps going at the bench');
 ok(['GUNS','GEAR','AMMO','HEALTH'].every(t=>has('>'+t+'</button>')),'the same four tabs');
 shKey('escape');ok(mode=='play'&&BRK,'Esc leaves the bench, still in the break');}
// ready skips the rest
{const w=wave;bnKey('enter');ok(mode=='play'&&!BRK&&wave==w+1,'Enter (ready) starts the next wave now')}
// the timer running out starts the wave
zs=[];toSp=0;tick(2);{const w=wave;ok(BRK,'break after wave 2');secs(121);ok(!BRK&&wave==w+1,'when the clock runs out the next wave starts')}
// a player going down is back up for the break
zs=[];toSp=0;P.dn=1;P.rt=10;tick(2);ok(BRK&&!P.dn&&P.hp>0,'a downed player gets up when the break starts');brkRdy(P,1);
// ---------- mid-wave ammo crafting ----------
{const b=BN[0];P.x=b.x;P.y=b.y+18;P.own=[0,3];P.cur=3;P.am.ri=100;P.cash=500;tick(1);
 ok(/RIFLE AMMO/.test(bnHint(P,0)),'during a wave the bench offers ammo for the gun in hand');
 bnKey('e');ok(mode=='play'&&P.bj&&P.bj[0]&&P.bj[0].k=='ri'&&P.bj[0].T==10&&P.cash==460,'E starts a 10-second rifle ammo job and takes its Scrap');
 bnKey('e');ok(Object.keys(P.bj).length==1&&P.cash==460,'one job per player per bench');
 P.x=b.x+500;secs(10.3);ok(P.bj[0]&&P.bj[0].t>=P.bj[0].T&&P.am.ri==100,'the job finishes while the player is away and waits on the bench');
 P.x=b.x;P.y=b.y+18;tick(2);ok(!P.bj[0]&&P.am.ri==300,'coming back collects it');
 P.own=[0];P.cur=0;tick(1);ok(bnAmmo(P)==null&&/AMMO FULL|NEEDS NO AMMO/.test((bnCraft(P,0),FT[FT.length-1].t)),'starting guns have endless ammo, so there is nothing to make')}
{S.ac.bl=3;P.own=[0,2];P.cur=2;P.am.sh=0;P.cash=500;bnKey('e');ok(P.bj[0]&&P.bj[0].T==7,'bench level 3 crafts in 7 s');P.bj={};S.ac.bl=1}
// ---------- blueprints gate the store ----------
mode='shop';P.own=[0];P.cash=99999;SHX.t='guns';shop();ok(has('15 more guns')&&!has('>Rocket<')&&has('>SMG<')&&has('>Crossbow<'),'the Guns tab only lists guns with a blueprint');
buy(4);ok(!P.own.includes(4),'a gun without its blueprint can\\'t be bought');
S.ac.bp.push(4);shop();ok(has('>Rocket<')&&has('14 more guns'),'a bought blueprint shows in the store');buy(4);ok(P.own.includes(4),'and the gun can be bought');
S.ac.bp=[];mode='play';ui.innerHTML='';
{P.own=[0,3];P.cur=3;P.am.ri=0;P.cash=500;SHX.t='ammo';SHX.am='pa';shop();ok(has('onclick="shAm(\\'ri\\')"'),'ammo rows buy when clicked');
 const c=pc(AMI.ri.cost);shAm('ri');ok(P.am.ri==AMI.ri.buy&&P.cash==500-c&&SHX.am=='ri'&&mode=='shop','clicking the rifle ammo row buys it right away (and picks it)');
 shAm('ri');ok(P.am.ri==AMI.ri.buy*2,'each click buys another batch');SHX.t='guns';mode='play';ui.innerHTML=''}
// ---------- the Blueprints tab ----------
mode='menu';{const A=S.ac;A.pts=600;A.bl=1;A.bp=[];A.bpv=1;A.bm=[0,0,0];bpTab();ok(has('BLUEPRINTS')&&has('YOUR WORKBENCH')&&has('BENCH LEVEL')&&has('class=hubsub'),'Progress → Blueprints page');
 ok(HUBSUB.findIndex(q=>q[0]=='bp')==HUBSUB.findIndex(q=>q[0]=='skills')+1,'the Blueprints tab sits next to Skills');
 bpBuy(8);ok(A.bp.includes(8)&&A.pts==100,'buy the Minigun blueprint for 500 Z');
 bpBuy(4);ok(!A.bp.includes(4)&&A.pts==100,'Wrong Turn blueprints need bench level 2');
 A.pts=9000;bpUp();ok(A.bl==1&&has('Open Wrong Turn in the campaign first'),'a bench upgrade needs its section opened in the campaign');
 A.bm=[1<<0|1<<3|1<<1|1<<14|1<<15,0,0];bpUp();ok(A.bl==2&&A.pts==6500,'with Hometown cleared, level 2 costs 2,500 Z');
 bpBuy(4);ok(A.bp.includes(4)&&A.pts==5500,'then a Wrong Turn blueprint for 1,000 Z');
 bpUp();ok(A.bl==2,'level 3 waits for Zombville')}
// existing accounts get the tiers of sections they cleared
{const A={name:'Old',xp:0,lv:3,sp:0,sk:{},pts:4000,un:[0],bm:[1<<0|1<<3|1<<1|1<<14|1<<15|1<<8|1<<2|1<<9|1<<10|1<<16,0,0]};bpInit(A);
 ok(A.bpv==1&&A.bl==2&&[8,3,15,4,16,5].every(i=>A.bp.includes(i))&&!A.bp.includes(6)&&A.pts==4000,'an account from before blueprints gets Hometown and Wrong Turn (cleared): their blueprints and bench level 2, free')}
{const A={name:'New',xp:0,lv:1,sp:0,sk:{},pts:0,un:[0]};bpInit(A);ok(A.bl==1&&A.bp.length==0,'a new account starts with the Start tier only')}
// account codes keep them; codes from the original game grant cleared tiers
{const A=S.ac;A.bp=[8,4];A.bl=2;const c=enc(A),R=dec(c);ok(R&&R.bl==2&&R.bp.join()=='4,8'&&R.bpv==1,'account codes carry blueprints and bench level');
 const f=c.split('.');f.splice(13,1);const b=f.slice(1,f.length-1).join('.');f[f.length-1]=ck(b);const R2=dec(f.join('.'));ok(R2&&R2.bpv===0&&R2.bp===undefined,'a code from the original game is read and marked for the free grant')}
// ---------- Zombie Pts ----------
{const H=1<<0|1<<3|1<<1|1<<14|1<<15;S.ac.bm=[H,H,0]}S.dlc=1;setGM('c');mapId=8;sel=0;start();P.mx=P.hp=999;ok(mapId==8,'campaign run on Deadway Highway (Wrong Turn)');
{wave=20;const z=zpEarn(P,1,930);ok(P.fc0==1&&z.m==1.25&&z.tot==Math.round((160+930)*1.25)&&z.fc>0&&z.run+z.fc==z.tot,'first clear of a Wrong Turn map: (waves × 8 + kills) × 1.25, the extra half shown as a first clear bonus')}
{const z=zpEarn(P,0,930);ok(z.tot==Math.round((160+930)*1.25*.5)&&z.fc==0&&z.nx,'a lost run pays 50% and says a first clear pays more')}
{bmSet(S.ac,1,8);zpRun();ok(P.fc0==0,'a map already beaten on this difficulty has no first clear bonus');S.dlc=2;zpRun();ok(P.fc0==1,'first clears count per difficulty');
 const z=zpEarn(P,1,930);ok(z.h==1.5&&z.tot==Math.round((160+930)*1.25*1.5),'Hard adds ×1.5');S.dlc=1}
{const pts=S.ac.pts;over(1);ok(S.ac.pts>pts&&ZPR&&has('class=zpn'),'the end screen shows where the Zombie Pts came from');menu()}
// ---------- the Blueprints shop between levels ----------
{setGM('c');mapId=0;sel=0;start();S.ac.pts=3000;S.ac.bp=[];S.ac.bl=1;wave=20;kills=900;CWIN={nx:9};over(1);ok(mode=='over'&&has('class="ovbp rdy"')&&has('ready to buy'),'after beating a map the end screen offers the Blueprints shop');
 const p0=S.ac.pts;bpShop('end');ok(mode=='menu'&&has('BLUEPRINTS')&&has('bpBack()')&&has('NEXT: '+MP[9].n.toUpperCase())&&!has('class=hubtabs'),'it opens the Blueprints page with Back and a button straight to the next map');
 bpBuy(8);ok(S.ac.bp.includes(8)&&S.ac.pts==p0-500,'a blueprint bought there uses the points just earned');
 bpBack();ok(mode=='over'&&has('MAP COMPLETE')&&!BPF,'Back returns to the end screen');
 bpShop('end');bpGo();ok(!BPF&&mapId==9&&(mode=='play'||mode=='shop'||!!BRK),'the next-map button starts the next map');menu()}
{CWIN=null;mode='menu';setGM('c');play();cwShow(0);ok(has('class="cwbp')&&has('Zombie Pts'),'the campaign map panel has a Blueprints button');
 bpShop('map');ok(has('bpBack()')&&!has('bpGo()')&&has('Campaign'),'from the campaign map: Back, no next-map button');bpBack();ok(UIS=='cmap'&&mode=='menu','Back returns to the campaign map');menu()}
setGM('f');mapId=0;start();{wave=10;const z=zpEarn(P,0,100);ok(z.tot==Math.round(180*.5)&&!z.fc,'Free Play pays the replay rate');}
// ---------- split screen: each player's bench store, ready-up, own jobs ----------
LBY={s:[{inp:'km',ac:S.ac,ci:0,v:0,rdy:1},{inp:0,ac:'G',ci:1,v:0,rdy:1}]};setGM('f');mapId=0;startMP();for(const p of PL){p.mx=p.hp=999}
ok(MPn==2&&mode=='play','two-player split screen');
zs=[];toSp=0;tick(3);ok(BRK&&mode=='play','the break, game running');
{const b=BN[0];PL[1].x=b.x;PL[1].y=b.y+18;tick(1);press(0,0);ok(PL[1].bo&&bx('Player 2 store')&&!bx('Player 1 store')&&mode=='play','P2 presses A at the bench: only P2 gets a store, over their part of the screen');
 const x0=PL[0].x;keys.d=1;tick(10);keys.d=0;ok(PL[0].x>x0,'P1 keeps walking around meanwhile');
 PL[1].cash=500;press(0,13);press(0,13);press(0,0);ok(PL[1].own.length==2,'P2 buys with the controller');
 press(0,9);ok(PL[1].rdy&&!PL[1].bo&&BRK,'START: P2 is ready, their store closes, the wave waits for P1');
 bnKey('enter');ok(!BRK&&mode=='play','P1 ready too: the next wave starts')}
{const b=BN[0];for(const p of PL){p.x=b.x+(p.pi?16:-16);p.y=b.y+18;p.own=[0,3];p.cur=3;p.am.ri=0;p.cash=500}tick(1);bnUse(PL[0]);bnUse(PL[1]);ok(PL[0].bj[0]&&PL[1].bj[0]&&PL[0].cash==460&&PL[1].cash==460,'each player has their own ammo job on the same bench')}
// ---------- Map Workshop: the Crafting Bench piece ----------
ok(OB.craftbench&&EDPN.craftbench&&OB.craftbench.c===0,'the Workshop has a Crafting Bench piece');
{const d=cmNew({name:'Bench test',w:40,h:30});if(d){d.start={x:600,y:500};const r0=cmLint(d);ok(r0.some(r=>/No crafting bench/.test(r.m)),'the map checker warns when a map has no bench');
 d.obj.push({k:'craftbench',x:800,y:400,ly:'interior'});const r1=cmLint(d);ok(!r1.some(r=>/No crafting bench/.test(r.m)),'and not once there is one');
 cmBuild(d);bnPlace();ok(BN.length==1&&BN[0].x==800&&BN[0].y==400,'a placed bench is a working bench');
 d.obj=d.obj.filter(o=>o.k!='craftbench');cmBuild(d);HS.BNP=null;mapId=-1;bnPlace();ok(BN.length==1&&Math.hypot(BN[0].x-600,BN[0].y-500)<300,'a map with none gets one next to the player start')}else ok(0,'cmNew missing')}
// ---------- Game Balance and the cloud ----------
S.dev=1;balInit();ok(BALG.some(g=>g[0]=='bp')&&['bP1','bU2','bM0','bR','bH','bB','bC','bS'].every(k=>BALM[k]),'Game Balance has a Blueprints tab with every number');
ok(['bW','bK','bL','cDz','cDb','cWz','cWb'].every(k=>BALM[k]),'Game Balance also has Zombie Pts per wave, per kill, a clear bonus and the daily / weekly challenge rewards');
{const W=wave;wave=10;P.fc0=0;const z0=zpEarn(P,0,100).tot;balSet(BALR.indexOf(BALM.bW),20);balSet(BALR.indexOf(BALM.bK),2);const z1=zpEarn(P,0,100);ok(BPG.zw==20&&BPG.zk==2&&z1.base==10*20+100*2&&z1.tot>z0,'per-wave and per-kill Zombie Pts change what a run pays');
 balSet(BALR.indexOf(BALM.bL),400);ok(zpEarn(P,1,100).base==10*20+100*2+400&&zpEarn(P,0,100).base==10*20+100*2,'the clear bonus is only paid for beating the level');wave=W}
balSet(BALR.indexOf(BALM.cDz),250);balSet(BALR.indexOf(BALM.cWb),900);ok(CHR.d.z==250&&CHR.w.bz==900,'daily and weekly challenge rewards follow Game Balance');
mode='menu';chals();ok(has('+250 Zombie Pts')&&has('+900 Zombie Pts'),'the Challenges page shows the new rewards');
balSet(BALR.indexOf(BALM.bB),60);ok(BPG.brk==60&&brkLen()==60,'the break length is a Game Balance setting');balReset(0);S.dev=0;balApply();ok(BPG.brk==120&&BPG.zw==8&&BPG.zk==1&&BPG.zc==0&&CHR.d.z==100&&CHR.w.bz==500,'and everything goes back to the defaults');
ok(ZBX===1&&SAVK=='zombdash_bp','this build keeps its own save');
// ---------- test mode: frame time readout ----------
ok(DTL.some(d=>d[0]=='fps'),'test mode has a Frame time readout switch');
{const S0=S.dt;S.dev=1;S.dt={fps:1};mode='play';FM.t=[16,17,40];FM.u=[1,2];FM.d=[3,5];const t=fmText(500);ok(/FPS +6 /.test(t)&&t.includes('worst  40.0')&&/logic +1.5 ms/.test(t)&&/draw +4.0 ms/.test(t)&&/budget used/.test(t)&&FM.col=='#ff5a4a','the readout shows FPS, frame, logic and draw times, and turns red after a 40 ms frame');S.dt=S0;S.dev=0}
console.log('TOTAL fails '+fails+' of '+n);
`;
const AF=Object.getPrototypeOf(async function(){}).constructor;
new AF('docL','ivs',code+test)(docL,ivs).catch(e=>{console.log('FAIL crashed: '+(e&&e.stack||e));console.log('TOTAL fails 1');process.exitCode=1});
