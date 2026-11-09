// Buck, the quarterback of Zombville Stadium (map 17): his sprites, his wave-20 fight (the charge with a ghost football team
// beside him, the minigun that turns toward you slowly, the two-minute warning at half health), recruiting him, playing as
// him, his place in the campaign and the custom campaign, and the GAME BALANCE menu.
const fs=require('fs');const html=fs.readFileSync(process.argv[2],'utf8');
const code=html.slice(html.lastIndexOf('<script>')+8,html.lastIndexOf('</script>'));
global.ImageData=class{constructor(d,w,h){this.data=d}};
const ctx=new Proxy({},{get:(t,k)=>k=='getImageData'?(x,y,w,h)=>({data:new Uint8ClampedArray(w*h*4).fill(120)}):k=='measureText'?()=>({width:30}):(k=='createRadialGradient'||k=='createLinearGradient'||k=='createPattern')?()=>({addColorStop(){}}):()=>{},set:()=>true});
const mkEl=()=>({style:{setProperty(){}},dataset:{},innerHTML:'',className:'',getContext:()=>ctx,addEventListener(){},remove(){},width:0,height:0,querySelector:()=>null,querySelectorAll:()=>[]});
const els={};const docL={};global.document={hidden:false,getElementById:id=>els[id]||(els[id]=mkEl()),createElement:()=>mkEl(),addEventListener(e,f){(docL[e]=docL[e]||[]).push(f)}};
global.innerWidth=+process.argv[3]||390;global.innerHeight=+process.argv[4]||800;global.addEventListener=()=>{};global.localStorage={};global.requestAnimationFrame=()=>{};
global.Image=class{constructor(){this.complete=true;this.naturalWidth=1}addEventListener(){}};global.NOW_=0;global.performance={now:()=>global.NOW_};
// mock web audio (records which sounds were asked for)
global.started=0;let nodes=0,errs=[];const P_=()=>({value:0,setValueAtTime(v,t){if(!isFinite(v)||!isFinite(t))errs.push('nonfinite set '+v+' '+t)},linearRampToValueAtTime(v,t){if(!isFinite(v)||!isFinite(t))errs.push('nf lin')},exponentialRampToValueAtTime(v,t){if(!(v>0)||!isFinite(t))errs.push('bad exp '+v)},setTargetAtTime(){}});
const node=()=>{nodes++;return{connect(){},disconnect(){},start(){global.started++},stop(){},frequency:P_(),gain:P_(),detune:P_(),Q:P_(),pan:P_(),threshold:P_(),ratio:P_(),type:'',setPeriodicWave(){},buffer:null,loop:false}};
global.AT_=0;global.AudioContext=class{constructor(){this.state='running';this.sampleRate=8000;this.destination={}}get currentTime(){return global.AT_}createGain(){return node()}createOscillator(){return node()}createBiquadFilter(){return node()}createBufferSource(){return node()}createStereoPanner(){return node()}createDynamicsCompressor(){return node()}createPeriodicWave(){return{}}createBuffer(c,n){return{getChannelData:()=>new Float32Array(n)}}resume(){}};
const ivs=[];global.setInterval=(f)=>{ivs.push(f)};global.TQ=[];global.setTimeout=(f,ms)=>{TQ.push([global.AT_+ms/1000,f])};
const test=`;S.tut=1;S.ac.bp=WP.map((_,i)=>i).filter(i=>WP[i].tr>0);S.ac.bpv=1;docL.pointerdown[0]();endIntro();
const tick=(n)=>{for(let i=0;i<n;i++){AT_+=.016;NOW_+=16;for(const f of ivs)f();for(let q=TQ.length-1;q>=0;q--)if(TQ[q][0]<=AT_){const g=TQ[q][1];TQ.splice(q,1);g()}loop(NOW_)}};
let n=0,fails=0;const ok=(c,m)=>{n++;if(!c)fails++;LOG((c?'PASS ':'FAIL ')+m)};
const SND=[];{const f=sfx;sfx=function(k){SND.push(k);return f.apply(this,arguments)}}
const A=S.ac;A.name='T';A.tut=1;S.df=0;
// ---------- data ----------
const B_=CH[18];
ok(CH.length>=19&&B_.n=='Buck'&&B_.hp==6&&B_.sp==1.2&&B_.w==1&&B_.cost==0,'Buck is survivor 19: 6 health, 120% speed, an SMG to start with');
ok(CHD[18]&&/quarterback/.test(CHD[18])&&SPK[18]&&SPK[18].n=='Field General'&&TT[18].length==5&&SCH[18].length==5&&RCS[18],'he has a description, a mastery perk, titles, challenges and colour variants');
ok(UNM[18]===17&&MUN[17]===18&&ccBossOf(17)===18,'he holds out on Zombville Stadium (map 17)');
ok(CCBOSS.includes(18)&&!CCNOT[18]&&CCBOSS.indexOf(18)==CCBOSS.indexOf(12)+1&&ccRepOK(17),'his fight works on any map: custom campaign maps can have him (after Rusty, in campaign order), and the stadium can be replaced by a custom map');
{const D=SVS[18];ok(D&&D.hp==820&&D.sp==100&&D.gn==6&&D.cv==430&&D.cl==430&&D.mt==2,'boss stats: 820 health, speed 100, 6 ghost teammates, charges 430 px at 430 px/s, 2 s minigun bursts')}
// ---------- sprites ----------
{const Q=PS[18];ok(Q&&Q.walk.length==6&&Q.idle.length==4&&Q.gun.length==WP.length&&Q.ball&&Q.mini&&Q.minid,'his frames: 6 walking, 4 standing, every gun, a football in his hand, his own minigun carried hanging at his side, and the same gun on its own (put down when he gives up)');
 ok(Q.mini[2]==100&&Q.mini[3]==52&&Q.mini[4]==20&&Q.mini[5]==14,'the side-carry frame is taller (the gun hangs at his hip), still held from the shoulder');
 ok(JSON.stringify(Q.gun[8])=='[652,2192,80,32,6,14]'&&JSON.stringify(Q.ball)=='[567,2224,80,32,6,14]','his playable minigun and football frames did not move');
 const all=[];for(const k in PS)for(const a of['walk','idle','gun','mig','ball','mini','minid'])for(const f of(a=='mig'||a=='ball'||a=='mini'||a=='minid'?(PS[k][a]?[PS[k][a]]:[]):PS[k][a]))all.push([k,a,f]);
 const qb=all.filter(e=>e[0]=='18');ok(qb.every(e=>e[2][1]>=2159&&e[2][0]+e[2][2]<=1024&&e[2][1]+e[2][3]<=2276),'they sit below the old sheet (from y 2159)');
 let ov=0;for(const a of qb)for(const b of all){if(a===b)continue;const f=a[2],g=b[2];if(f[0]<g[0]+g[2]&&g[0]<f[0]+f[2]&&f[1]<g[1]+g[3]&&g[1]<f[1]+f[3])ov++}ok(!ov,'no frame overlaps another');
 ok(JSON.stringify(PS[0].gun[0])=='[490,0,80,32,6,14]'&&JSON.stringify(PS[17].walk[0])=='[0,2061,48,64,24,24]'&&JSON.stringify(PS[17].mig)=='[567,2126,80,32,6,14]','older frames did not move (Ken\\'s included)');
 ok(Q.walk.concat(Q.idle).every((f,i)=>f[2]==48&&f[3]==64&&f[4]==24&&f[5]==PS[0][i<6?'walk':'idle'][i<6?i:i-6][5])&&Q.gun.every(f=>f[2]==80&&f[3]==32&&f[4]==6&&f[5]==14),'same size and hand positions as every other survivor')}
// ---------- the wave-20 fight ----------
A.un=[0];A.cp=CORD.length;A.bm=[0,1,2].map(()=>CORD.reduce((v,m)=>m==17?v:v|1<<m,0));setGM('c');mapId=17;S.mp=17;sel=0;start();
ok(mapId===17&&mode!='menu','a campaign run at the stadium');
P.mx=10;P.hp=1e6;wave=19;zs=[];toSp=0;ep=[];nextWave();const z=zs.find(q=>ZT[q.t].sv);const k=BMP();
ok(z&&z.ci==18&&toSp==0&&zs.length==1,'wave 20: Buck comes, alone');
ok(z&&z.bn=='BUCK'&&Math.round(z.mh/k)==820,'his health bar says BUCK (820 health)');
ok(/BUCK WILL NOT GO DOWN EASY/.test(nzn)&&SVB==1,'"BUCK WILL NOT GO DOWN EASY" on the final-wave banner');
// an open spot: Buck's whole formation fits and the run is clear (aimed straight right)
const FW=(x,y,n)=>QBF.slice(0,n).every(([o,f])=>svOK(x+f,y+o));
const clr=(x,y,L,o0,o1)=>{for(let o=o0;o<=o1;o+=10)for(let s=0;s<=L;s+=6)if(knInW(x+s,y+o))return 0;return 1};
// scanned in a grid (not at random) so it always finds one when there is one
const spot=(n,L)=>{for(let y=300;y<WH-300;y+=16)for(let x=200;x<WW-600;x+=16)if(svOK(x,y)&&FW(x,y,n)&&clr(x,y,L,-240,240))return{x,y};return null};
const p=spot(8,560);ok(!!p,'(found an open stretch of field for the plays)');
const fresh=()=>{ep=[];QBG=[];FT=[];P.hp=50;P.mx=50;P.inv=0;z.qs=0;z.mg=0;z.lk=0;z.iv=0};
const at=(dx,dy)=>{z.x=p.x;z.y=p.y;P.x=p.x+dx;P.y=p.y+dy;flow()};
// the charge: the snap count, the team lines up, then runs
{fresh();at(300,0);z.ab=0;z.nx='c';tick(1);ok(z.qs==1&&QBG.length==6&&QBG.every(g=>g.st==0),'the charge: a ghost team of 6 appears beside him ('+QBG.length+')');
 ok(FT.some(t=>t.t=='HUT! HUT! HIKE!')&&SND.includes('qbhike'),'"HUT! HUT! HIKE!"');
 const side=QBG.map(g=>Math.round(g.y-z.y)).sort((a,b)=>a-b);ok(side.join()=='-140,-70,-70,70,70,140','they line up across his path: lanes at 70 and 140 px either side of his, a second row behind ('+side.join()+')');
 const x0=z.x,g0=QBG.map(g=>[g.x,g.y]);P.x=p.x+1000;P.y=p.y-400;const xs=[];for(let f=0;f<80&&z.qs==1;f++){tick(1);xs.push(z.x)}
 ok(xs.length>=50&&xs.slice(0,-1).every(x=>Math.abs(x-x0)<2),'they crouch for a moment first (nobody moves: the warning)');ok(z.qs==2&&SND.includes('qbstomp'),'then the snap: the whole team runs');
 for(let f=0;f<8;f++)tick(1);ok(QBG.every((g,i)=>g.x-g0[i][0]>40&&Math.abs(g.y-g0[i][1])<1)&&z.x-x0>40&&Math.abs(z.y-p.y)<4,'Buck and the ghosts run side by side, straight at where the player was');
 for(let f=0;f<120&&(z.qs||QBG.length);f++)tick(1);ok(!QBG.length&&!z.qs&&Math.abs(z.x-x0-430)<30,'the run is about 430 px; then the ghosts fade and Buck catches his breath ('+Math.round(z.x-x0)+' px)')}
const charge=(dy)=>{fresh();at(300,0);z.ab=0;z.nx='c';z.cd=99;tick(1);const run=z.qs==1;for(let f=0;f<120&&(z.qs||QBG.length);f++){P.x=p.x+300;P.y=p.y+dy;tick(1)}return run};
{let r=charge(0);ok(r&&P.hp==48&&FT.some(t=>t.t=='TACKLED!'),'standing in his lane: tackled for 2 ('+P.hp+')');
 r=charge(70);ok(r&&P.hp==48,'standing in a ghost\\'s lane: the ghost tackles you for 2');
 r=charge(140);ok(r&&P.hp==48,'and the outside ghost too');
 r=charge(35);ok(r&&P.hp==50,'standing in the gap between two lanes: nobody touches you');
 r=charge(185);ok(r&&P.hp==50,'outside the line: safe')}
// a ghost that reaches a wall dissolves
{let q=null;for(let i=0;i<60000&&!q;i++){const x=200+Math.random()*(WW-800),y=300+Math.random()*(WH-600);if(!svOK(x,y)||!FW(x,y,6)||!clr(x,y,430,-10,10))continue;let h=0;for(let s=60;s<=360;s+=4)if(knInW(x+s,y+70)){h=s;break}if(h>80&&clr(x,y+70,h-20,-6,6))q={x,y,h}}
 fresh();z.x=q.x;z.y=q.y;P.x=q.x+300;P.y=q.y;z.ab=0;z.nx='c';tick(1);const g=QBG.find(g=>Math.abs(g.y-q.y-70)<1&&Math.abs(g.x-q.x)<1);let f=0;for(;f<200&&g.st!=2;f++){P.x=q.x+300;P.y=q.y;tick(1)}
 ok(g&&g.st==2&&g.x-q.x<q.h+10&&!knInW(g.x,g.y),'a ghost that runs into a wall stops there and fades ('+Math.round(g.x-q.x)+' px, the wall at '+q.h+')');for(let f=0;f<120&&(z.qs||QBG.length);f++)tick(1)}
// the minigun
{fresh();at(250,0);z.ab=0;z.nx='m';tick(1);ok(z.mg==1&&FT.some(t=>t.t=='AIR RAID!')&&SND.includes('qbspin'),'the minigun: "AIR RAID!", it spins up first');
 for(let f=0;f<60&&z.mg==1;f++){P.hp=50;tick(1)}ok(z.mg==2&&!ep.some(q=>q.k==5&&q.l<1.24),'no bullets until it has spun up (0.75 s)');
 // the player runs round him: the minigun follows only slowly
 let a0=z.fa,shots=0,b0=ep.length,maxTurn=0;for(let f=0;f<30;f++){const an=f*.04;P.x=z.x+Math.cos(an)*250;P.y=z.y+Math.sin(an)*250;const a1=z.fa;tick(1);maxTurn=Math.max(maxTurn,Math.abs(z.fa-a1));shots+=ep.filter(q=>q.k==5&&q.l>1.24-.02).length}
 ok(ep.filter(q=>q.k==5).length>=6,'then it sprays bullets ('+ep.filter(q=>q.k==5).length+' in the air after half a second)');
 ok(maxTurn<=SVS[18].mtr*.0161+1e-9&&z.fa-a0<.25,'it turns toward you only slowly ('+(z.fa-a0).toFixed(2)+' rad in half a second while you ran '+(1.2).toFixed(1)+' rad round him)');
 for(let f=0;f<200&&z.mg;f++)tick(1);ok(!z.mg&&z.ab>0,'after a 2 s burst he puts it away');
 ok(SND.includes('minigun'),'with the minigun\\'s own sound')}
// he is drawn bigger, and the gun hangs at his side: the bullets leave its muzzle down at his hip, yet still fly at the player
{fresh();z.x=p.x;z.y=p.y;z.mg=2;z.fa=0;const lv=qbMz(z);z.mg=0;ok(z.hr==18&&QBK==1.15,'Buck is drawn 15% bigger than the other survivor bosses, with a hit radius to match');
 ok(lv.y-z.y>8&&lv.x-z.x>40,'the minigun hangs at his side: aimed level, its muzzle is down at his hip ('+Math.round(lv.y-z.y)+' px below his middle, '+Math.round(lv.x-z.x)+' px ahead)');
 at(200,-230);z.ab=0;z.nx='m';for(let f=0;f<80&&z.mg!=2;f++){P.x=p.x+200;P.y=p.y-230;tick(1)}const m=qbMz(z),a=qbGa(z);tick(2);const b=ep.filter(q=>q.k==5).slice(-1)[0];
 ok(z.fa<-.75&&Math.abs(a+.5)<1e-9,'with the player high above him the heavy gun only tilts up half a radian ('+a.toFixed(2)+'; his aim '+z.fa.toFixed(2)+')');
 const ba=Math.atan2(b.vy,b.vx),ta=Math.atan2(P.y-m.y,P.x-m.x);ok(Math.abs(ba-ta)<.16,'and its bullets still fly from the muzzle at the player ('+ba.toFixed(2)+' vs '+ta.toFixed(2)+')');for(let f=0;f<200&&z.mg;f++)tick(1)}
// it hurts: standing in front of it
{fresh();at(200,0);z.ab=0;z.nx='m';for(let f=0;f<200&&(z.mg||f<2);f++){P.x=p.x+200;P.y=p.y;tick(1)}ok(P.hp<50&&P.hp>=47,'standing in front of the minigun costs a heart or more ('+(50-P.hp)+')')}
// they take turns
{fresh();at(300,0);z.ab=0;z.nx=null;const seen=[];for(let f=0;f<2400&&seen.length<4;f++){P.hp=50;P.inv=0;P.x=p.x+300;P.y=p.y;if(!z.qs&&!z.mg&&Math.hypot(z.x-p.x,z.y-p.y)>120){z.x=p.x;z.y=p.y}const q0=z.qs,m0=z.mg;tick(1);if(z.qs==1&&q0!=1)seen.push('c');if(z.mg==1&&m0!=1)seen.push('m')}
 ok(seen.length>=4&&seen.every((s,i)=>!i||s!=seen[i-1]),'he takes the two plays in turn: '+seen.join(' '))}
// half health: the two-minute warning
{fresh();at(300,0);hurt(z,z.hp-z.mh*.48,0,0);z.iv=0;tick(1);ok(z.oc==1&&z.bn=='BUCK · TWO-MINUTE WARNING'&&FT.some(t=>t.t=='TWO-MINUTE WARNING!')&&SND.includes('qbwhistle'),'at half health: the referee\\'s whistle, "TWO-MINUTE WARNING!" on his bar');
 fresh();at(300,0);z.ab=0;z.nx='c';tick(1);ok(QBG.length==8,'now the charge brings 8 ghosts ('+QBG.length+')');for(let f=0;f<120&&(z.qs||QBG.length);f++)tick(1);
 fresh();at(250,0);z.ab=0;z.nx='m';tick(1);let t=0;for(let f=0;f<400&&z.mg;f++){if(z.mg==2)t++;P.x=z.x+250;P.y=z.y;P.hp=50;tick(1)}ok(Math.abs(t*.016-2.6)<.1&&z.ab<=SVS[18].ca*.7*1.2+.02,'the minigun fires longer (2.6 s) and the breaks are shorter ('+(t*.016).toFixed(2)+' s)')}
// it all draws
{let err='';try{fresh();at(300,0);z.ab=0;z.nx='c';for(let f=0;f<60;f++)tick(1);z.ab=0;z.nx='m';for(let f=0;f<120;f++)tick(1);qbDrawS();svExtra7();svDraw(z);qbGhostImg();qbLit();z.mg=2;const L=[];qbLights(L);if(!L.length)err='no muzzle light';svDraw(z);z.mg=0;const K0=KN;KN={ci:18,x:z.x,y:z.y,t:1,fl:1};svExtra();KN=K0}catch(e){err=e.stack}ok(!err&&(mode=='play'&&!BRK),'the fight runs and draws (after the light too, on dark maps like the stadium) '+err)}
// beaten: he kneels, gives up and joins
{fresh();z.ab=0;z.nx='c';tick(1);hurt(z,z.hp+1,0,0);tick(2);ok(KN&&KN.ci==18&&!zs.includes(z)&&!QBG.length,'beaten, Buck kneels instead of popping (his ghost team vanishes)');
 ok(A.un.includes(18)&&bBt(A,DIF(),17),'he joins the survivors and the stadium counts as beaten');tick(Math.ceil(5.7/.016));
 ok(mode=='over'&&ui.innerHTML.includes('ZOMBVILLE STADIUM COMPLETE')&&ui.innerHTML.includes('joined your survivors'),'map-complete screen: Buck joined your survivors')}
// ---------- the campaign texts ----------
ok(/Buck/.test(cMunT(17)),'the campaign map names Buck: '+cMunT(17).replace(/<[^>]+>/g,''));
{const L0=LBY;let h='';try{LBY={s:[{inp:'km',ac:'G',ci:0,rdy:0}]};GMD='c';mapId=17;S.mp=17;rL();h=String(ui.innerHTML||'')}catch(e){h='ERR '+e.message}LBY=L0;ok(/wave 20 boss: Buck/.test(h),'the split-screen lobby says the wave 20 boss is Buck')}
{const O={name:'Old',lv:1,xp:0,sp:0,sk:{},pts:0,un:[0,2],cp:CORD.length,bm:[0,1,2].map(()=>CORD.reduce((v,m)=>v|1<<m,0))};ok(bBt(O,0,17)&&mOpen(O,0,17)&&!O.un.includes(18),'an old save that cleared the stadium before he came keeps it beaten; Buck waits there to be won');
 const c=dec(enc(Object.assign({},A,{un:[0,17,18]})));ok(c&&c.un.includes(18)&&c.un.includes(17),'account codes keep Buck (and Ken)')}
// ---------- the survivor select and mastery ----------
{const A2=S.ac;A2.un=[0];let h=sDet(18);ok(/Buck/.test(h)&&/SMG/.test(h)&&/Field General/.test(h)&&/Zombville Stadium/.test(h),'survivor select: Buck locked, won at Zombville Stadium; his SMG and his perk');
 A2.un=[0,18];h=sAct(18);ok(/start\\(\\)/.test(h),'once he joins he can be picked');let err='';try{mastery(18)}catch(e){err=e.message}ok(!err&&/Field General/.test(ui.innerHTML)&&/Hall of Famer/.test(ui.innerHTML),'his mastery page '+err)}
// ---------- playing as Buck ----------
setGM('f');mapId=17;S.mp=17;sel=18;start();zs=[];toSp=0;
ok(P.ci==18&&P.cur==1&&P.mx==CH[18].hp&&Math.abs(P.sp-CH[18].sp*(1+.04*rk('spd')))<.2,'playing as Buck: 6 health, an SMG, quick on his feet');
{const shoot=()=>{bs=[];P.own.includes(8)||P.own.push(8);P.cur=8;P.mg=P.mg||[];P.mg[8]=200;P.cds[8]=0;mouse.d=1;mouse.x=W/2+200;mouse.y=H/2;for(let f=0;f<30&&!bs.length;f++){P.cds[8]=Math.min(P.cds[8],0);tick(1)}mouse.d=0;const b=bs[0];return b&&b.d/(WP[8].d*wlD(P,8)*(b.cr?1.5+.25*rk('cdm'):1))};
 msA(S.ac)[18].l=1;const r0=shoot();msA(S.ac)[18].l=3;const r1=shoot();msA(S.ac)[18].l=1;ok(sPk(P,18)===false&&Math.abs(r0-1)<1e-6&&Math.abs(r1-1.15)<1e-6,'Field General (mastery level 3): his minigun shots do 15% more damage ('+r0+' → '+r1+')')}
// ---------- his fight on another map (the custom campaign can put him anywhere) ----------
{const m0=MUN[0];MUN[0]=18;setGM('c');mapId=0;S.mp=0;sel=0;start();P.mx=10;P.hp=1e6;wave=19;zs=[];toSp=0;ep=[];nextWave();const z2=zs.find(q=>ZT[q.t].sv);const seen={};let err='';
 try{for(let f=0;f<3000&&!(seen.c&&seen.m);f++){P.hp=1e6;P.inv=0;P.x+=Math.sin(f/40)*1.2;tick(1);if(z2.qs==2)seen.c=1;if(z2.mg==2)seen.m=1}}catch(e){err=e.message}MUN[0]=m0;
 ok(z2&&z2.ci==18&&seen.c&&seen.m&&!err,'on the Suburb he finds the player, charges and fires the minigun too '+err);zs=[];ep=[];QBG=[]}
{const O=ccClean({slots:{'3:3':{id:'q1',b:18,n:'Practice Field'}}});ok(O.slots['3:3']&&O.slots['3:3'].b==18,'a custom campaign slot can have Buck as its wave-20 boss')}
// ---------- split screen ----------
{const B2={name:'B',xp:0,lv:1,sp:0,sk:{},pts:0,un:[0],cp:CORD.length,bm:[0,1,2].map(()=>CORD.reduce((v,m)=>v|1<<m,0))};S.prof=[B2];setGM('c');LBY={s:[{inp:'km',ac:S.ac,ci:0,v:0,rdy:1},{inp:0,ac:B2,ci:0,v:1,rdy:1}]};mapId=17;S.mp=17;startMP();
 wave=19;zs=[];toSp=0;for(const p of PL){p.mx=10;p.hp=1e6}nextWave();const z3=zs.find(q=>ZT[q.t].sv);const seen={};let err='';try{for(let f=0;f<3000&&!(seen.c&&seen.m);f++){for(const p of PL){p.hp=1e6;p.inv=0}tick(1);if(z3.qs==2)seen.c=1;if(z3.mg==2)seen.m=1}}catch(e){err=e.message}
 ok(MPn==2&&z3&&z3.ci==18&&seen.c&&seen.m&&!err,'split screen: Buck runs both plays against two players '+err);z3.iv=0;hurt(z3,z3.hp+1,0,0);tick(2);ok(B2.un.includes(18)&&S.ac.un.includes(18),'and joins both of them');MPn=0;S.prof=[]}
// ---------- GAME BALANCE ----------
{balInit();const id=['hS18','sS18','hP18','sP18','qbV','qbL','qbN','qbW','qbC','qbR','qbT','qbA','qbB'];ok(new Set(BALR.map(e=>e.id)).size==BALR.length,'every GAME BALANCE id is still unique');ok(id.every(i=>BALM[i]),'GAME BALANCE has his boss health and speed, his health and speed as a player, and his charge and minigun');
 const D=SVS[18],o=JSON.stringify(D);S.dev=1;const i=BALR.findIndex(e=>e.id=='qbN');balSet(i,3);ok(D.gn==3,'changing the number of ghosts changes his team');balSet(i,'');ok(JSON.stringify(D)==o,'and putting it back restores 6');S.dev=0;balApply()}
console.log('TOTAL fails '+fails+' of '+n);
`;
globalThis.LOG=m=>require("fs").writeSync(2,m+"\n");new Function("docL","ivs","errs","started_",code+test)(docL,ivs,errs);
