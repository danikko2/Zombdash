//# maps/props/kit-stadium.js — Kit props for Zombville Stadium, the football field turned emergency treatment center: goalposts, pylons, team benches, drinks tables, TV cameras, a kicking net; generators (running: exhaust and a blinking panel; or dry), a diesel tank, mobile light towers (on, failing, dead, knocked over and still shining), pop-up canopies that hang over people, gurneys, wheelchairs, crash carts, oxygen, biohazard bins, pallets and shelves of supplies, the command table, the patient board, privacy screens, a water station, portable toilets, crowd barriers, the video board (an emergency alert on a loop) and the stadium's light banks
// ---------- Zombville Stadium's pieces ----------
const STP={o:'#16111c',y:'#f0c419',yl:'#ffe27a',yd:'#b8920e',al:'#c8ccd4',ald:'#8a8f96',ad:'#5a5e68',ak:'#3a3d46',w:'#f4f4f0',rd:'#c8281e',rdd:'#8a1a14'};
const PKTEAM=[['#b83a32','Red'],['#2f4a8a','Navy'],['#2f8a4a','Green'],['#e0b030','Gold'],['#6a3a8a','Purple'],['#26262c','Black']];
const PKCAN=[['#e8e6de','White'],['#3a6ab0','Blue'],['#6a7448','Olive'],['#c0392b','Red'],['#c8b890','Tan']];
const PKGEN=[['#e8e4d8','White'],['#e0b020','Yellow'],['#5a6a3a','Army green'],['#c0392b','Red']];
function stLine(q,c,w,P){q.strokeStyle=c;q.lineWidth=w;q.lineCap='round';q.beginPath();P.forEach((p,i)=>i?q.lineTo(p[0],p[1]):q.moveTo(p[0],p[1]));q.stroke();q.lineCap='butt'}
// a red cross on a white square (medical)
function stCross(q,x,y,s){R_(q,STP.o,x-s/2-1,y-s/2-1,s+2,s+2);R_(q,STP.w,x-s/2,y-s/2,s,s);const t=Math.max(2,Math.round(s*.28));R_(q,STP.rd,x-t/2,y-s*.38,t,s*.76);R_(q,STP.rd,x-s*.38,y-t/2,s*.76,t)}
// the generator: a box on a trailer, louvres, the control panel (dark when it has run dry), the exhaust stack
function stGen(q,K,on){R_(q,STP.ak,2,46,22,4);R_(q,STP.o,0,44,5,8);R_(q,STP.ad,14,48,3,15);R_(q,STP.ak,10,61,11,3);R_(q,K.dd,18,8,82,40);R_(q,K.b,19,9,80,38);R_(q,K.ll,19,9,80,8);R_(q,K.d,19,44,80,3);
 for(let i=0;i<6;i++)R_(q,K.d,24+i*6,22,3,15);R_(q,K.d,62,19,32,24);R_(q,'#2a2c32',64,21,28,15);for(const x of[68,77])R_(q,'#c8ccd4',x,24,6,6);R_(q,on?'#6aff7a':'#3a1a1a',86,23,3,3);R_(q,on?'#ffb030':'#2a2a2a',86,29,3,3);
 R_(q,'#f0c020',56,12,5,5);R_(q,STP.ak,88,0,6,12);R_(q,STP.o,87,0,8,2);R_(q,K.d,48,42,26,6);R_(q,STP.o,52,46,16,16);R_(q,STP.ald,57,51,6,6);if(!on){R_(q,STP.o,30,7,8,3)}}
// exhaust puffs out of a running generator's stack and its panel light blinking
function stGenAn(o,t){const x=o.x+39,y=o.y-66,ph=cmR(o,0,46)*9;for(let i=0;i<4;i++){const u=((t*.7+i/4+ph)%1),r=2+u*7;X.globalAlpha=.32*(1-u);X.fillStyle='#8a8e96';X.beginPath();X.arc(x+u*16+Math.sin(t*2+i)*2,y-u*30,r,0,7);X.fill()}X.globalAlpha=1;
 if(((t+ph)*1.6)%1<.5){X.fillStyle='#b8ffb0';X.fillRect(o.x+34,o.y-43,3,3)}}
function stGenXAn(o,t){if(((t+cmR(o,0,46)*5)*.9)%1<.35){X.fillStyle='#ff3a2a';X.fillRect(o.x+34,o.y-43,3,3)}}
// the mobile light tower: a yellow trailer on its legs, the mast, four lamps on a bar (lens colour = the light's colour; k: 'on', 'off')
function stTower(q,K,k){R_(q,STP.ak,0,186,88,3);R_(q,STP.o,0,184,7,12);R_(q,STP.o,81,184,7,12);R_(q,'#c8981a',12,166,64,24);R_(q,'#e0b020',13,167,62,8);R_(q,'#a87a14',13,184,62,5);R_(q,STP.o,36,182,16,16);R_(q,STP.ald,41,187,6,6);
 R_(q,STP.ak,20,172,14,8);R_(q,'#f0c020',58,172,10,6);R_(q,STP.ald,40,30,8,138);R_(q,STP.al,41,30,3,138);R_(q,'#9aa0a8',42,12,4,20);R_(q,STP.ak,6,8,76,4);
 for(const x of[6,26,46,66]){R_(q,'#2a2c32',x,10,16,15);if(k=='off')kpLens(q,x+2,12,12,10,{b:'#3a3d46'});else kpLens(q,x+2,12,12,10,K)}}
function stCanopy(q,w,h,K,v,t){R_(q,K.dd,0,0,w,h);const cx=w/2,cy=h/2,rx=Math.max(0,w/2-h/2),tri=(c,P)=>{q.fillStyle=c;q.beginPath();P.forEach((p,i)=>i?q.lineTo(p[0],p[1]):q.moveTo(p[0],p[1]));q.closePath();q.fill()};
 tri(K.ll,[[3,3],[w-3,3],[cx+rx,cy],[cx-rx,cy]]);tri(K.b,[[3,h-3],[w-3,h-3],[cx+rx,cy],[cx-rx,cy]]);tri(K.l,[[3,3],[cx-rx,cy],[3,h-3]]);tri(K.l,[[w-3,3],[cx+rx,cy],[w-3,h-3]]);
 stLine(q,K.d,1,[[3,3],[cx-rx,cy],[3,h-3]]);stLine(q,K.d,1,[[w-3,3],[cx+rx,cy],[w-3,h-3]]);if(rx)stLine(q,K.ll,2,[[cx-rx,cy],[cx+rx,cy]]);
 R_(q,K.d,0,0,w,4);R_(q,K.d,0,h-4,w,4);R_(q,K.d,0,0,4,h);R_(q,K.d,w-4,0,4,h);for(let x=8;x<w-4;x+=10){R_(q,K.dd,x,h-2,4,2);R_(q,K.dd,x,0,4,2)}
 if(K.b=='#e8e6de')stCross(q,cx,rx?cy-h*.22:cy-h*.18,Math.min(22,h*.24));const T=(cmTxt(t,16)||'').toUpperCase();if(T)kpText(q,T,cx,h-13,w*.7,10,K.b=='#e8e6de'?STP.rd:STP.w);
 if(v>.86){q.globalCompositeOperation='destination-out';q.beginPath();q.ellipse(w*.3,h*.62,w*.1,h*.09,.5,0,7);q.fill();q.globalCompositeOperation='source-over'}}
// the video board's screen: an emergency alert on a loop (your text, two lines at a time), a ticker, static now and then
function stBoardAn(o,t){const x=Math.round(o.x-220+12),y=Math.round(o.y-200+12),w=416,h=140,ph=cmR(o,0,47)*20,u=(t+ph)%13;if(u>12.6&&u<12.8)return;
 X.save();X.beginPath();X.rect(x,y,w,h);X.clip();X.fillStyle='#08142e';X.fillRect(x,y,w,h);X.fillStyle='#0e2048';for(let j=0;j<h;j+=4)X.fillRect(x,y+j,w,1);
 const on=(t*1.5)%1<.65;X.fillStyle=on?'#c8281e':'#7a1410';X.fillRect(x,y,w,30);kpText(X,'⚠  EMERGENCY ALERT  ⚠',x+w/2,y+16,w-20,20,'#ffffff');
 const L=String(o.tx||OB.vboard.dt).toUpperCase().split('|').filter(Boolean),n=Math.max(1,Math.ceil(L.length/2)),pg=Math.floor((t+ph)/4)%n;kpText(X,L[pg*2]||'',x+w/2,y+58,w-30,26,'#f4f4f0');kpText(X,L[pg*2+1]||'',x+w/2,y+90,w-30,22,'#ffd84a');
 X.fillStyle='#16111c';X.fillRect(x,y+h-22,w,22);X.font='bold 14px Arial, Helvetica, sans-serif';X.textBaseline='middle';X.fillStyle='#ff8a2a';const tk='STAY AWAY FROM THE TUNNELS  •  DO NOT APPROACH THE INFECTED  •  EVACUATION CANCELLED  •  SHELTER IN PLACE  •  ',tw=X.measureText(tk).width||600,sx=x+w-((t*60+ph*40)%tw);X.fillText(tk,sx,y+h-11);X.fillText(tk,sx+tw,y+h-11);X.textBaseline='alphabetic';
 if(u>9.4&&u<10){for(let i=0;i<60;i++){X.fillStyle=Math.random()<.5?'rgba(255,255,255,.5)':'rgba(0,0,0,.6)';X.fillRect(x+Math.random()*w,y+Math.random()*h,8+Math.random()*60,2)}}X.restore()}
Object.assign(OB,{
// goalpost: the yellow goalpost on the end line (its foot is the padded base): the crossbar runs away from you, the uprights rise from its ends
goalpost:{w:72,h:316,c:[14,10],wb:1,f:(g,x,y)=>S2(g,x,y,72,316,q=>{R_(q,STP.ak,24,306,24,8);R_(q,'#1f3a6a',29,252,14,58);R_(q,'#2f4a8a',29,252,5,58);R_(q,STP.w,29,268,14,4);R_(q,STP.w,29,290,14,4);
 R_(q,STP.y,33,168,6,86);R_(q,STP.yl,33,168,2,86);stLine(q,STP.y,6,[[12,207],[61,130]]);stLine(q,STP.yl,2,[[12,205],[60,128]]);R_(q,STP.y,10,52,5,156);R_(q,STP.yl,10,52,2,156);R_(q,STP.y,58,4,5,128);R_(q,STP.yl,58,4,2,128);
 R_(q,'#e83a2a',15,52,9,3);R_(q,'#e83a2a',63,4,9,3)})},
// pylon: the orange marker at a corner of an end zone
pylon:ob(12,18,[8,6],q=>{R_(q,'#e8641e',2,3,8,14);R_(q,'#ff8a3a',2,3,8,3);R_(q,'#b84a14',7,6,3,11);R_(q,STP.w,3,9,6,2)}),
// tbench: a team bench on the sideline (the back in the team's colour)
tbench:{w:170,h:40,c:[166,16],pc:PKTEAM,f:(g,x,y,v,col)=>S2(g,x,y,170,40,q=>{const K=pcK(pcCol(col,PKTEAM));R_(q,K.dd,2,4,166,16);R_(q,K.b,3,5,164,13);R_(q,K.l,3,5,164,3);kpText(q,'ZOMBVILLE',85,12.5,120,9,STP.w);
 R_(q,STP.ald,0,20,170,10);R_(q,STP.al,0,20,170,4);R_(q,'#a8acb4',0,25,170,2);for(const a of[8,60,108,158])R_(q,STP.ad,a,30,4,9)})},
// dtable: the drinks table: three orange coolers and a sleeve of cups
dtable:ob(64,44,[60,14],q=>{R_(q,'#e8e8e4',2,24,60,7);R_(q,'#c8c8c4',2,29,60,2);R_(q,STP.ad,6,31,3,12);R_(q,STP.ad,55,31,3,12);for(const a of[5,23,41]){R_(q,'#e8781e',a,8,15,17);R_(q,'#ff9a4a',a+2,8,3,17);R_(q,'#c85a10',a,16,15,2);R_(q,STP.w,a+1,4,13,5);R_(q,STP.o,a+6,21,3,3)}R_(q,STP.w,57,12,4,13)}),
// tvcam: a TV camera on its dolly by the sideline
tvcam:ob(44,58,[24,10],q=>{R_(q,STP.ak,6,50,32,4);for(const a of[4,19,34])R_(q,STP.o,a,52,6,6);R_(q,STP.ad,20,26,4,25);R_(q,'#2a2c32',6,14,24,14);R_(q,'#4a4e58',6,14,24,3);R_(q,'#e8e8e4',30,16,12,9);R_(q,'#c8c8c4',30,22,12,3);R_(q,STP.o,41,17,2,7);R_(q,STP.o,3,8,8,7);R_(q,'#3a3d46',4,9,6,5);R_(q,STP.rd,24,12,3,2);R_(q,STP.o,0,26,10,2)}),
// kicknet: a kicking net on its frame
kicknet:ob(66,60,[60,8],q=>{R_(q,STP.ak,3,4,60,3);R_(q,STP.ak,3,4,3,54);R_(q,STP.ak,60,4,3,54);R_(q,STP.ak,0,56,12,3);R_(q,STP.ak,54,56,12,3);q.fillStyle='rgba(200,204,212,.55)';for(let a=9;a<60;a+=5)q.fillRect(a,7,1,48);for(let b=10;b<56;b+=5)q.fillRect(6,b,54,1);R_(q,'#e8c020',24,20,18,14);R_(q,STP.o,30,25,6,4)}),
// gen: a towable diesel generator, running (exhaust out of the stack, the panel light blinking); genx: the same, run dry
gen:{w:104,h:66,c:[96,18],wb:1,pc:PKGEN,f:(g,x,y,v,col)=>S2(g,x,y,104,66,q=>stGen(q,pcK(pcCol(col,PKGEN)),1)),an:stGenAn,lt:[{dx:36,dy:-41,r:24,c:'#8aff7a',i:.4}]},
genx:{w:104,h:66,c:[96,18],wb:1,pc:PKGEN,f:(g,x,y,v,col)=>S2(g,x,y,104,66,q=>stGen(q,pcK(pcCol(col,PKGEN)),0)),an:stGenXAn},
// fueltank: a diesel tank on its skid, the pump and hose
fueltank:ob(92,50,[88,22],q=>{R_(q,STP.ak,2,42,88,6);R_(q,'#2e5a2e',4,14,84,28);R_(q,'#4a8a4a',4,6,84,9);R_(q,'#5aa05a',4,6,84,2);kpText(q,'DIESEL',30,28,40,9,'#f0c020');R_(q,'#c8c8c4',64,18,14,16);R_(q,STP.ak,66,20,10,5);R_(q,STP.o,20,7,8,4);q.strokeStyle=STP.o;q.lineWidth=2;q.beginPath();q.arc(74,38,6,0,7);q.stroke();q.beginPath();q.arc(74,38,3,0,7);q.stroke()}),
// ltower: a mobile light tower: four lamps on a mast over a trailer (turn it to aim the light: the tower stays upright, the beams point
// down the screen at 0°); ltowerf: one with a failing lamp; ltowerx: dead, dark
ltower:Object.assign(obc(88,204,[64,16],PKLT,(q,v,K)=>stTower(q,K,'on')),{nr:1,wb:1,lt:[{dx:-18,dy:-186,r:600,w:32,a:-9},{dx:18,dy:-186,r:600,w:32,a:9}]}),
ltowerf:Object.assign(obc(88,204,[64,16],PKLT,(q,v,K)=>{stTower(q,K,'on');R_(q,'rgba(40,40,52,.6)',46,12,14,10)}),{nr:1,wb:1,lt:[{dx:-18,dy:-186,r:600,w:32,a:-9},{dx:18,dy:-186,r:600,w:32,a:9,f:'fault'}]}),
ltowerx:Object.assign(obc(88,204,[64,16],PKLT,(q,v,K)=>stTower(q,K,'off')),{nr:1,wb:1}),
// ltowerd: a light tower knocked over: the trailer on its side, the mast along the ground, one lamp still shining along it (turn it)
ltowerd:Object.assign(obc(212,76,[60,24],PKLT,(q,v,K)=>{R_(q,'#c8981a',4,30,30,40);R_(q,'#e0b020',5,31,8,38);R_(q,STP.o,30,22,14,14);R_(q,STP.ald,34,26,6,6);R_(q,STP.ak,0,66,50,4);
 R_(q,STP.ald,34,52,140,8);R_(q,STP.al,34,52,140,3);R_(q,'#9aa0a8',172,53,18,5);R_(q,STP.ak,190,30,5,44);for(const[b,on]of[[32,1],[52,0]]){R_(q,'#2a2c32',195,b,14,16);kpLens(q,197,b+2,10,12,on?K:{b:'#3a3d46'})}R_(q,'#2a2c32',182,64,14,10)}),{lt:[{dx:97,dy:-36,r:460,w:20,a:-90,gs:1.4}]}),
// canopy / canopyw: pop-up canopies seen from above (white ones carry a red cross; the wide one takes your text on its front edge).
// They hang over people in the game and fade while someone is under one.
canopy:{w:96,h:96,c:0,ov:1,ovf:1,ova:.18,sw:88,swh:88,pc:PKCAN,f:(g,x,y,v,col,t)=>S2(g,x,y,96,96,q=>stCanopy(q,96,96,pcK(pcCol(col,PKCAN)),+v||0,''))},
canopyw:{w:192,h:96,c:0,ov:1,ovf:1,ova:.18,sw:184,swh:88,pc:PKCAN,txt:16,f:(g,x,y,v,col,t)=>S2(g,x,y,192,96,q=>stCanopy(q,192,96,pcK(pcCol(col,PKCAN)),+v||0,t))},
// gurney: a stretcher on wheels from above (var: under 0.4 made up, under 0.7 bloodied, else a body under the sheet)
gurney:ob(32,68,[26,60],(q,v)=>{v=+v||0;R_(q,STP.ald,3,4,26,60);for(const[a,b]of[[1,2],[27,2],[1,62],[27,62]])R_(q,STP.o,a,b,4,4);R_(q,'#e8e8e4',5,8,22,52);R_(q,STP.ad,6,63,20,3);
 if(v<.4){R_(q,STP.w,7,9,18,8);R_(q,'#7a9ac8',5,30,22,14);R_(q,'#9ab8e0',5,30,22,3)}else if(v<.7){R_(q,STP.w,7,9,18,8);q.fillStyle='rgba(138,20,20,.8)';q.beginPath();q.ellipse(15,30,8,10,.3,0,7);q.ellipse(20,44,5,4,0,0,7);q.fill()}
 else{R_(q,'#d8d8d4',5,8,22,52);R_(q,'#c8c8c4',8,10,16,10);R_(q,'#c8c8c4',7,22,18,32);q.fillStyle='rgba(138,20,20,.6)';q.beginPath();q.ellipse(16,32,5,7,0,0,7);q.fill()}}),
// wchair: a wheelchair (var 0.5 and up: tipped over)
wchair:ob(30,34,[22,10],(q,v)=>{if((+v||0)>=.5){q.translate(15,24);q.rotate(-1.35);q.translate(-15,-24)}q.strokeStyle=STP.o;q.lineWidth=3;q.beginPath();q.arc(12,22,10,0,7);q.stroke();q.strokeStyle=STP.al;q.lineWidth=1;q.beginPath();q.arc(12,22,9,0,7);q.stroke();q.beginPath();q.moveTo(12,13);q.lineTo(12,31);q.moveTo(3,22);q.lineTo(21,22);q.stroke();
 R_(q,'#2a2c32',8,13,16,6);R_(q,'#2a2c32',19,2,5,14);R_(q,STP.ad,21,0,6,3);R_(q,STP.ad,22,18,3,12);R_(q,STP.ak,22,29,7,3);R_(q,STP.o,25,30,4,4)}),
// medcart: a red crash cart, the defibrillator and monitor on top
medcart:ob(32,42,[28,12],q=>{R_(q,STP.rd,4,12,24,26);R_(q,'#e0483a',4,12,24,3);for(const b of[19,26,33])R_(q,STP.rdd,5,b,22,1);for(const b of[16,23,30])R_(q,STP.al,13,b,6,2);R_(q,'#e8c020',5,5,12,8);R_(q,STP.o,7,7,8,4);R_(q,'#2a2c32',17,1,11,11);R_(q,'#0a2a14',18,2,9,7);R_(q,'#6aff7a',18,5,9,1);for(const a of[4,24])R_(q,STP.o,a,38,4,4)}),
// o2rack: oxygen cylinders on a cart
o2rack:ob(36,46,[30,10],q=>{for(let i=0;i<4;i++){const a=4+i*7;R_(q,'#2e7a3a',a,10,6,30);R_(q,'#3a9a4a',a,10,2,30);R_(q,STP.w,a,6,6,5);R_(q,STP.ald,a+2,2,2,4)}R_(q,STP.ad,2,24,32,2);R_(q,STP.ak,2,40,32,3);R_(q,STP.o,3,42,4,4);R_(q,STP.o,29,42,4,4)}),
// biobin: a red biohazard bin
biobin:ob(24,30,[20,10],q=>{R_(q,STP.rd,3,8,18,20);R_(q,'#e0483a',3,8,3,20);R_(q,STP.rdd,2,5,20,4);for(const[a,b]of[[12,14],[9,19],[15,19]])kpCirc(q,STP.o,a,b,2.6);kpCirc(q,STP.rd,12,17.5,1.6)}),
// suppal: relief supplies shrink-wrapped on a pallet (var: water, boxes, blankets, IV fluids)
suppal:ob(46,48,[42,16],(q,v)=>{v=+v||0;R_(q,'#8a6a3a',2,40,42,7);R_(q,'#a8804a',2,40,42,3);R_(q,STP.o,6,44,6,3);R_(q,STP.o,20,44,6,3);R_(q,STP.o,34,44,6,3);const k=Math.floor(v*4)%4;
 if(k==0){R_(q,'#6aa8d8',4,8,38,32);for(let j=0;j<4;j++)for(let i=0;i<6;i++)R_(q,'#2f6fd0',6+i*6,10+j*8,3,2);R_(q,'#9ac8f0',4,8,38,5)}
 else if(k==1){for(const[a,b]of[[4,8],[23,8],[4,24],[23,24]]){R_(q,'#b88a58',a,b,19,16);R_(q,'#c8a070',a,b,19,3);stCross(q,a+9.5,b+9.5,7)}}
 else if(k==2){const C=['#6a7480','#4a5a7a','#7a6a5a','#5a6a4a'];for(let j=0;j<5;j++){R_(q,C[j%4],4,8+j*6.4,38,6);R_(q,'rgba(255,255,255,.18)',4,8+j*6.4,38,1)}}
 else{for(const[a,b]of[[4,8],[23,8],[4,24],[23,24]]){R_(q,'#e8e8e4',a,b,19,16);R_(q,'#2f6fd0',a+3,b+6,13,4)}}q.fillStyle='rgba(255,255,255,.16)';q.fillRect(4,8,38,2);q.fillRect(4,8,2,32)}),
// supshelf: a wire shelf of medical supplies
supshelf:ob(72,80,[68,12],(q,v)=>{v=+v||0;R_(q,'#a8acb4',2,4,3,74);R_(q,'#a8acb4',67,4,3,74);const C=['#e8e8e4','#7a5ab8','#2f6fd0','#e8e8e4','#3aa0a0','#c8a070'];
 for(const[b,j]of[[18,0],[38,1],[58,2],[76,3]]){let a=6;for(let i=0;a<64;i++){const w=8+Math.floor(cmH(i,j,v*97+48)*8),h=8+Math.floor(cmH(i,j,v*97+49)*6),c=C[Math.floor(cmH(i,j,v*97+50)*C.length)];if(a+w>66)break;if(cmH(i,j,v*97+51)<.82){R_(q,c,a,b-h,w,h);R_(q,'rgba(255,255,255,.25)',a,b-h,w,2);if(c=='#e8e8e4')R_(q,STP.rd,a+2,b-h+3,3,3)}a+=w+2}R_(q,'#c8ccd4',2,b,68,3)}}),
// cmdtable: the command post's table: a radio, a laptop (its screen glows), a map, a coffee
cmdtable:Object.assign(ob(80,46,[76,14],q=>{R_(q,'#c8c8c4',2,24,76,7);R_(q,'#a8a8a4',2,29,76,2);R_(q,STP.ad,6,31,3,14);R_(q,STP.ad,71,31,3,14);R_(q,'#26262c',6,14,16,11);R_(q,'#3a3d46',7,15,14,3);R_(q,STP.o,18,2,2,13);R_(q,'#e8c020',9,20,4,3);
 R_(q,'#2a2c32',30,6,22,15);R_(q,'#7ac8ff',32,8,18,10);R_(q,'#c8e8ff',33,9,8,1);R_(q,'#3a3d46',28,21,26,4);R_(q,'#e8e0c8',56,18,20,7);R_(q,'#c0392b',60,20,3,2);R_(q,'#2f6fd0',68,21,4,2);R_(q,'#e8e8e4',22,18,5,7);R_(q,'#5a3a22',23,19,3,2)}),{lt:[{dx:1,dy:-31,r:42,c:'#8ac8ff',i:.45}]}),
// pboard: the patient board on its easel (names crossed out)
pboard:ob(52,74,[40,8],q=>{stLine(q,STP.ak,3,[[10,36],[4,72]]);stLine(q,STP.ak,3,[[42,36],[48,72]]);stLine(q,STP.ak,3,[[26,36],[26,70]]);R_(q,STP.ad,2,2,48,36);R_(q,STP.w,4,4,44,32);kpText(q,'PATIENTS',26,9,40,6,'#2f6fd0');
 for(let j=0;j<5;j++){R_(q,'#3a3d46',8,14+j*4,20+((j*7)%12),1);if(j%2)stLine(q,STP.rd,1,[[7,13+j*4],[34,16+j*4]])}stLine(q,STP.rd,2,[[30,30],[44,26]]);R_(q,STP.ak,4,36,44,2)}),
// privscr: a privacy screen: three blue panels on a frame with wheels
privscr:ob(76,48,[72,8],q=>{for(let i=0;i<3;i++){const a=3+i*24;R_(q,STP.ad,a,4,2,40);R_(q,'#4a7ab8',a+2,6,21,32);R_(q,'#5a8ac8',a+2,6,21,3);R_(q,'rgba(0,0,0,.14)',a+12,6,1,32)}R_(q,STP.ad,74,4,2,40);R_(q,STP.al,2,4,74,2);for(const a of[2,26,50,72])R_(q,STP.o,a,44,4,4)}),
// waterst: a water station: big jugs on a folding table
waterst:ob(70,44,[66,14],q=>{R_(q,'#c8c8c4',2,24,66,7);R_(q,'#a8a8a4',2,29,66,2);R_(q,STP.ad,6,31,3,12);R_(q,STP.ad,61,31,3,12);for(const a of[4,20,36,52]){R_(q,'#7ab8e8',a,6,13,18);R_(q,'#a8d8ff',a+2,7,3,16);R_(q,'#5a98c8',a,15,13,2);R_(q,'#2f6fd0',a+4,3,5,4)}}),
// porta: a portable toilet (var 0.6 and up: the door hanging open)
porta:ob(38,62,[34,16],(q,v)=>{R_(q,'#2f6fd0',2,6,34,54);R_(q,'#4a8ae8',2,6,4,54);R_(q,'#e8e8e4',0,1,38,7);R_(q,'#2a5ab8',8,14,22,44);for(let a=10;a<28;a+=4)R_(q,'#1f4a98',a,16,2,6);if((+v||0)>=.6){R_(q,'#0a0a0e',9,15,20,42);R_(q,'#2a5ab8',28,14,8,44)}else R_(q,STP.rd,24,30,4,3)}),
// crowdbar: a steel crowd barrier; crowdbarx: one knocked flat
crowdbar:ob(82,34,[80,8],q=>{R_(q,'#a8acb4',2,4,78,3);R_(q,'#a8acb4',2,24,78,3);for(let a=6;a<78;a+=6)R_(q,STP.ald,a,7,2,17);R_(q,STP.ad,2,4,2,24);R_(q,STP.ad,78,4,2,24);R_(q,STP.ak,0,28,14,3);R_(q,STP.ak,68,28,14,3)}),
crowdbarx:{w:84,h:22,c:0,f:(g,x,y)=>S2(g,x,y,84,22,q=>{q.translate(42,12);q.rotate(.08);R_(q,'#a8acb4',-40,-8,78,3);R_(q,'#a8acb4',-40,4,78,3);for(let a=-36;a<36;a+=6)R_(q,STP.ald,a,-5,2,9);R_(q,STP.ak,-42,6,14,3);R_(q,STP.ak,26,6,14,3)})},
// vboard: the stadium's video board: an emergency alert on a loop, your text two lines at a time ("A|B|C|D" = A B, then C D), a ticker
// along the bottom, static now and then; it lights the stands in front of it
vboard:{w:440,h:200,c:0,txt:90,dt:'SHELTER IN PLACE|STAY INDOORS|MEDICAL AID|CLOSED|THIS IS NOT|A DRILL',f:(g,x,y)=>S2(g,x,y,440,200,q=>{for(const a of[120,300]){R_(q,STP.ak,a,160,20,40);stLine(q,STP.ad,2,[[a,164],[a+20,196]]);stLine(q,STP.ad,2,[[a+20,164],[a,196]])}
 R_(q,STP.o,0,0,440,166);R_(q,'#2a2c32',3,3,434,160);R_(q,'#05070c',12,12,416,140);R_(q,STP.o,12,154,416,7);R_(q,'#3a3d46',3,3,434,2)}),an:stBoardAn,lt:[{dx:0,dy:-110,r:440,c:'#9ab8ff',i:.8,f:'glow'}]},
// ltbank: one of the stadium's light banks on the rim, fifteen lamps on a frame (turn it to aim the beam); ltbankx: the same, dark
ltbank:Object.assign(obc(160,120,0,PKLT,(q,v,K)=>{R_(q,STP.ak,74,92,12,28);R_(q,STP.o,0,0,160,92);R_(q,'#3a3d46',2,2,156,88);for(let j=0;j<3;j++)for(let i=0;i<5;i++){R_(q,'#2a2c32',6+i*30,6+j*28,26,24);kpLens(q,9+i*30,9+j*28,20,18,K)}R_(q,STP.ad,0,90,160,4)}),{nr:1,lt:[{dx:0,dy:-60,r:1500,w:24,a:0,gs:1.3}]}),
ltbankx:obc(160,120,0,PKLT,(q,v,K)=>{R_(q,STP.ak,74,92,12,28);R_(q,STP.o,0,0,160,92);R_(q,'#3a3d46',2,2,156,88);for(let j=0;j<3;j++)for(let i=0;i<5;i++){R_(q,'#2a2c32',6+i*30,6+j*28,26,24);kpLens(q,9+i*30,9+j*28,20,18,{b:'#30333a'})}R_(q,STP.ad,0,90,160,4)})});
