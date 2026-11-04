//# maps/props/kit-downtown.js — Kit props for Downtown Zombville after the outbreak: police sawhorses, infection screening tents, field-hospital tents and cots, a military watchtower, the stadium's gates and lettering, the hospital's ER canopy, monument signs, quarantine and cardboard signs, the missing-persons wall, the subway entrance, the elevated train (pillars, track, train cars), a crashed army helicopter, HELP painted on a roof, a flashing LED message trailer, dropped riot gear, suitcases
// ---------- Downtown Zombville's pieces ----------
const DTC={o:'#16111c',st:'#8a8e96',sl:'#a8acb4',sd:'#5e626a',wh:'#f4f4f0',rd:'#c0392b',bl:'#2a4a9a',ol:'#4a5a32',oll:'#5e7040',old:'#323e22',gl:'#8fc3e8'};
function dtLines(t,n){return String(t||'').split('|').slice(0,n)}
// a tent seen from the front: a white canopy on four legs (screening, triage); its banner says what it is
function dtCanopy(q,w,h,col,band){R_(q,DTC.o,4,h-46,3,46);R_(q,DTC.o,w-7,h-46,3,46);R_(q,'#c8ccd4',5,h-45,1,44);R_(q,'#c8ccd4',w-6,h-45,1,44);
 q.fillStyle=DTC.o;q.beginPath();q.moveTo(0,h-44);q.lineTo(14,6);q.lineTo(w-14,6);q.lineTo(w,h-44);q.closePath();q.fill();q.fillStyle=col;q.beginPath();q.moveTo(2,h-45);q.lineTo(15,8);q.lineTo(w-15,8);q.lineTo(w-2,h-45);q.closePath();q.fill();
 q.fillStyle='rgba(0,0,0,.12)';q.beginPath();q.moveTo(w/2,8);q.lineTo(w-15,8);q.lineTo(w-2,h-45);q.lineTo(w/2,h-45);q.closePath();q.fill();R_(q,DTC.o,0,h-48,w,14);R_(q,band,1,h-47,w-2,12)}
Object.assign(OB,{
// pbarr: a police sawhorse barricade (POLICE on the blue board); pbarrx: one knocked flat
pbarr:ob(64,30,[60,8],q=>{for(const x of[6,52]){R_(q,DTC.o,x,8,6,22);R_(q,'#e8e8e4',x+1,9,4,20)}R_(q,DTC.o,0,4,64,13);R_(q,DTC.bl,1,5,62,11);kpText(q,'POLICE',32,10.5,56,9,'#f4f4f0');R_(q,DTC.o,2,19,60,6);for(let x=3;x<61;x+=8){R_(q,'#f4f4f0',x,20,4,4);R_(q,'#e07a1a',x+4,20,4,4)}}),
pbarrx:{w:64,h:26,c:0,f:(g,x,y,v)=>S2(g,x,y,64,26,q=>{q.save();q.translate(32,14);q.rotate(-.18);R_(q,DTC.o,-32,-6,64,13);R_(q,DTC.bl,-31,-5,62,11);kpText(q,'POLICE',0,.5,56,9,'#f4f4f0');R_(q,DTC.o,-30,8,8,4);R_(q,DTC.o,22,8,8,4);q.restore()})},
// screen: an infection screening tent: white canopy, a table with a laptop, a thermal camera on its tripod (your text on the banner)
screen:{w:150,h:110,c:[140,18],txt:24,dt:'INFECTION SCREENING',f:(g,x,y,v,col,t)=>S2(g,x,y,150,110,q=>{dtCanopy(q,150,110,'#eef0f2',DTC.rd);kpText(q,(cmTxt(t,24)||'INFECTION SCREENING').toUpperCase(),75,68,136,10,'#f4f4f0');
 R_(q,DTC.o,30,86,90,6);R_(q,'#8a8e96',31,87,88,4);R_(q,DTC.o,32,92,3,16);R_(q,DTC.o,115,92,3,16);R_(q,DTC.o,48,78,22,9);R_(q,'#3a3d46',49,79,20,7);R_(q,'#7ad0ff',51,80,16,4);R_(q,'#c8ccd4',50,86,22,2);
 R_(q,DTC.o,96,74,10,8);R_(q,'#26262c',97,75,8,6);R_(q,'#ff5a3a',99,77,3,2);R_(q,DTC.o,100,82,2,24);R_(q,DTC.o,94,104,14,2);R_(q,'#f0c040',80,82,10,4)})},
// medtent: a field-hospital tent: white with a red cross, the front open on cots (put cots outside it too)
medtent:Object.assign(ob(160,110,[150,34],q=>{q.fillStyle=DTC.o;q.beginPath();q.moveTo(0,104);q.lineTo(24,14);q.lineTo(136,14);q.lineTo(160,104);q.closePath();q.fill();q.fillStyle='#e8e8e4';q.beginPath();q.moveTo(2,103);q.lineTo(25,16);q.lineTo(135,16);q.lineTo(158,103);q.closePath();q.fill();
 q.fillStyle='#d4d4d0';q.beginPath();q.moveTo(80,16);q.lineTo(135,16);q.lineTo(158,103);q.lineTo(80,103);q.closePath();q.fill();R_(q,DTC.o,52,50,56,54);R_(q,'#3a3a40',53,51,54,53);R_(q,'#ffe8b0',58,56,44,10);
 for(const x of[58,84]){R_(q,DTC.o,x,70,20,30);R_(q,'#6a7a5a',x+1,71,18,28);R_(q,'#e8e8e4',x+3,72,14,8)}R_(q,DTC.o,62,20,36,26);R_(q,'#f4f4f0',63,21,34,24);R_(q,DTC.rd,76,23,8,20);R_(q,DTC.rd,69,29,22,8);R_(q,DTC.o,0,102,160,4);R_(q,'#a8a8a4',1,102,158,2)}),{nr:1,lt:[{dx:0,dy:-46,r:70,i:.7,c:'#ffe8b0',ng:1}]}),
// cot: a folding field cot with a blanket; var 0.5 and up: someone lies under the blanket
cot:ob(30,60,[26,52],q=>{R_(q,DTC.o,2,4,26,54);R_(q,'#5a6a4a',3,5,24,52);R_(q,'#7a8a6a',3,5,24,3);R_(q,DTC.o,2,56,4,4);R_(q,DTC.o,24,56,4,4);R_(q,'#e8e8e4',6,7,18,10);R_(q,'#8a9ab0',4,18,22,34);R_(q,'#a8b8cc',4,18,22,3)}),
cotx:ob(30,60,[26,52],q=>{R_(q,DTC.o,2,4,26,54);R_(q,'#5a6a4a',3,5,24,52);R_(q,DTC.o,2,56,4,4);R_(q,DTC.o,24,56,4,4);R_(q,DTC.o,5,6,20,52);R_(q,'#e8e8e4',6,7,18,50);R_(q,'#d8d8d4',6,7,18,3);q.fillStyle='rgba(150,20,20,.55)';q.beginPath();q.ellipse(16,30,6,9,0,0,7);q.fill();R_(q,'#c8c8c4',10,10,10,8)}),
// wtower: a military watchtower: legs, a sandbagged platform, a searchlight sweeping to and fro (turn the tower to aim it: the
// picture stays upright, the beam points down the screen at 0°)
wtower:Object.assign(ob(100,160,[84,18],q=>{for(const x of[10,86]){R_(q,DTC.o,x,60,6,100);R_(q,'#5a5e48',x+1,61,4,98)}for(const y of[90,124]){q.strokeStyle=DTC.o;q.lineWidth=4;q.beginPath();q.moveTo(13,y);q.lineTo(89,y+30);q.moveTo(89,y);q.lineTo(13,y+30);q.stroke();q.strokeStyle='#5a5e48';q.lineWidth=2;q.stroke()}
 R_(q,DTC.o,2,40,96,26);R_(q,'#6a6e58',3,41,94,24);for(let x=4;x<94;x+=15)for(let r=0;r<2;r++){R_(q,'#b8a878',x+(r%2)*7,42+r*11,14,10);R_(q,'#9a8a5e',x+(r%2)*7,50+r*11,14,2)}R_(q,DTC.o,8,6,84,36);R_(q,'#4a5a32',9,7,82,10);R_(q,'#2a2c26',12,17,76,23);
 R_(q,DTC.o,62,0,20,14);R_(q,'#8a8e96',63,1,18,12);R_(q,'#fff8d8',65,3,14,8);R_(q,DTC.o,30,22,8,14);R_(q,'#5a6a3a',31,23,6,12)}),{wb:1,nr:1,lt:[{dx:22,dy:-153,r:320,w:14,i:.85,sw:55,c:'#f8f4e0'}]}),
// stadgate: a stadium gate: concrete pylons, the shutter pulled down and chained, the gate's name lit over it (your text)
stadgate:{w:150,h:110,c:0,dk:1,txt:12,dt:'GATE A',f:(g,x,y,v,col,t)=>S2(g,x,y,150,110,q=>{for(const x of[0,130]){R_(q,DTC.o,x,0,20,110);R_(q,'#b8b4aa',x+1,1,18,108);R_(q,'#d0ccc2',x+1,1,5,108)}R_(q,DTC.o,20,0,110,26);R_(q,'#2a2c32',21,1,108,24);
 kpText(q,(cmTxt(t,12)||'GATE A').toUpperCase(),75,13.5,100,15,'#ffd84a');R_(q,DTC.o,20,26,110,84);R_(q,'#8a8e96',21,27,108,82);for(let y=30;y<108;y+=6)R_(q,'#6e727a',21,y,108,2);
 q.strokeStyle=DTC.o;q.lineWidth=3;q.beginPath();q.moveTo(24,70);q.quadraticCurveTo(75,86,126,70);q.stroke();q.strokeStyle='#c8ccd4';q.lineWidth=1.5;q.stroke();R_(q,DTC.o,68,74,14,12);R_(q,'#c8a040',69,75,12,10);
 q.save();q.translate(75,52);q.rotate(-.12);R_(q,DTC.o,-50,-9,100,18);R_(q,'#c8a878',-49,-8,98,16);kpText(q,'CLOSED',0,0,90,12,'#961414');q.restore()})},
// stadsign: big letters across the stadium's front (your text)
stadsign:{w:560,h:70,c:0,dk:1,txt:28,dt:'ZOMBVILLE STADIUM',f:(g,x,y,v,col,t)=>S2(g,x,y,560,70,q=>{R_(q,DTC.o,0,10,560,56);R_(q,'#2a2c32',1,11,558,54);R_(q,'#3a3d46',1,11,558,6);const s=(cmTxt(t,28)||'ZOMBVILLE STADIUM').toUpperCase();
 kpText(q,s,282,40,540,38,'#16111c');kpText(q,s,280,38,540,38,cmCol(col,'#e8423a'));for(const x of[40,520])R_(q,'#ffd84a',x,4,4,6)})},
// monsign: a stone monument sign on a lawn bed (your text: two lines)
monsign:{w:230,h:76,c:[220,22],txt:40,dt:'ZOMBVILLE GENERAL|HOSPITAL',f:(g,x,y,v,col,t)=>S2(g,x,y,230,76,q=>{const[a,b]=kpLines(cmTxt(t,40)||'ZOMBVILLE GENERAL|HOSPITAL');R_(q,DTC.o,0,58,230,18);R_(q,'#3f7a3a',1,59,228,16);for(let x=6;x<224;x+=14)R_(q,'#e8c040',x,62,4,4);
 R_(q,DTC.o,10,4,210,58);R_(q,'#c8c2b4',11,5,208,56);R_(q,'#dcd6c8',11,5,208,6);R_(q,'#a8a294',11,55,208,6);kpText(q,a.toUpperCase(),115,24,196,17,'#2a3a5a');if(b)kpText(q,b.toUpperCase(),115,44,196,14,'#c0392b')})},
// ercanopy: a hospital's emergency entrance canopy over the drive (hangs over people); EMERGENCY along its front
ercanopy:Object.assign({w:260,h:150,c:0,f:(g,x,y,v)=>S2(g,x,y,260,150,q=>{R_(q,DTC.o,0,0,260,150);R_(q,'#c8ccd4',1,1,258,148);R_(q,'#dce0e6',1,1,258,10);for(let y=20;y<130;y+=22)R_(q,'#b4b8c0',4,y,252,2);R_(q,DTC.o,0,124,260,26);R_(q,DTC.rd,1,125,258,24);kpText(q,'EMERGENCY',130,137.5,240,18,'#f4f4f0');
 for(const x of[12,240])R_(q,'#9aa0aa',x,112,8,10)})},{ov:1,sw:1}),
// qsign: a quarantine warning sign on a post (yellow and black; your text: two lines)
qsign:{w:76,h:72,c:[6,6],txt:30,dt:'QUARANTINE|NO ENTRY',f:(g,x,y,v,col,t)=>S2(g,x,y,76,72,q=>{const[a,b]=kpLines(cmTxt(t,30)||'QUARANTINE|NO ENTRY');R_(q,DTC.o,35,30,6,42);R_(q,'#8a8e96',36,31,4,40);R_(q,DTC.o,0,0,76,40);R_(q,'#f0c020',1,1,74,38);for(let x=1;x<75;x+=8){R_(q,DTC.o,x,1,4,4);R_(q,DTC.o,x+4,35,4,4)}
 kpText(q,a.toUpperCase(),38,14,66,11,DTC.o);if(b)kpText(q,b.toUpperCase(),38,27,66,9,'#961414')})},
// cardsign: a hand-lettered cardboard sign on a stick (your text: two lines)
cardsign:{w:74,h:64,c:[6,6],txt:30,dt:'HOSPITAL|THIS WAY →',f:(g,x,y,v,col,t)=>S2(g,x,y,74,64,q=>{const[a,b]=kpLines(cmTxt(t,30)||'HOSPITAL|THIS WAY →');R_(q,DTC.o,34,30,5,34);R_(q,'#8a6a3a',35,31,3,32);q.save();q.translate(37,18);q.rotate(((v||0)-.5)*.2);
 R_(q,DTC.o,-36,-17,72,34);R_(q,'#c8a878',-35,-16,70,32);R_(q,'#b8986a',-35,10,70,6);kpText(q,a.toUpperCase(),0,-6,64,11,'#16111c',"'Comic Sans MS', cursive");if(b)kpText(q,b.toUpperCase(),0,7,64,10,'#961414',"'Comic Sans MS', cursive");q.restore()})},
// notewall: a plywood wall covered in notes and photos of the missing, MISSING painted across the top
notewall:ob(170,82,[160,12],q=>{for(const x of[10,156]){R_(q,DTC.o,x,58,5,24);R_(q,'#6a4a2a',x+1,59,3,22)}R_(q,DTC.o,0,0,170,64);R_(q,'#c8a878',1,1,168,62);for(let x=40;x<168;x+=42)R_(q,'#b8986a',x,1,1,62);
 for(let i=0;i<34;i++){const a=(i*37)%150+4,b=14+((i*53)%40),c=i%5==0;R_(q,DTC.o,a-1,b-1,c?12:14,c?14:11);R_(q,c?'#d8d0c0':['#f4f0e0','#fff8c0','#e8f0f8','#f8e0e0'][i%4],a,b,c?10:12,c?12:9);if(c){R_(q,'#6a5a4a',a+2,b+2,6,6)}else{R_(q,'#8a8a8a',a+2,b+3,8,1);R_(q,'#8a8a8a',a+2,b+5,6,1)}}
 kpText(q,'MISSING',85,8,150,12,'#c0392b')}),
// subway: a subway entrance: steps going down between green railings, the globes either side, the gate chained across the bottom
subway:Object.assign(ob(112,130,[92,96],q=>{R_(q,DTC.o,10,26,92,100);R_(q,'#6a6e76',11,27,90,98);for(let i=0;i<9;i++){const y=30+i*10,c=Math.round(120-i*11);R_(q,'rgb('+c+','+c+','+(c+6)+')',13,y,86,8);R_(q,'rgba(0,0,0,.35)',13,y+7,86,2)}R_(q,'#0c0c10',13,116,86,8);
 q.strokeStyle=DTC.o;q.lineWidth=3;q.beginPath();q.moveTo(14,118);q.lineTo(98,118);q.moveTo(14,112);q.lineTo(98,122);q.moveTo(14,122);q.lineTo(98,112);q.stroke();q.strokeStyle='#9aa0aa';q.lineWidth=1.5;q.stroke();
 for(const x of[6,102]){R_(q,DTC.o,x,20,6,108);R_(q,'#2f6a4a',x+1,21,4,106)}R_(q,DTC.o,6,20,100,6);R_(q,'#2f6a4a',7,21,98,4);for(let y=34;y<124;y+=14){R_(q,'#2f6a4a',5,y,8,2);R_(q,'#2f6a4a',101,y,8,2)}
 for(const x of[0,104]){R_(q,DTC.o,x+2,4,4,20);R_(q,'#2f6a4a',x+3,5,2,18);q.fillStyle=DTC.o;q.beginPath();q.arc(x+4,5,6,0,7);q.fill();q.fillStyle='#8ae8a8';q.beginPath();q.arc(x+4,5,5,0,7);q.fill()}
 R_(q,DTC.o,26,8,60,16);R_(q,'#26262c',27,9,58,14);kpText(q,'SUBWAY',56,16,52,11,'#f4f4f0')}),{wb:1,nr:1,lt:[{dx:-52,dy:-125,r:60,i:.6,f:'fault',c:'#a8ffc8'}]}),
// elpillar: a riveted steel column of the elevated railway on its footing
elpillar:Object.assign(ob(34,70,[24,18],q=>{R_(q,DTC.o,0,54,34,16);R_(q,'#9a9890',1,55,32,14);R_(q,DTC.o,8,0,18,58);R_(q,'#4a5a6a',9,1,16,56);R_(q,'#5e7082',9,1,5,56);for(let y=6;y<54;y+=8){R_(q,'#2e3a46',12,y,2,2);R_(q,'#2e3a46',20,y,2,2)}}),{wb:1}),
// eldeck: 200 px of elevated railway track, seen from above (hangs over the street; fades when you are under it).
// var 0.5 and up: a train car stands on it; 0.8 and up: the front car, its cab at the right end.
eldeck:Object.assign({w:200,h:84,c:0,f:(g,x,y,v)=>S2(g,x,y,200,84,q=>{v=+v||0;R_(q,DTC.o,0,0,200,84);R_(q,'#3e4a56',1,1,198,82);R_(q,'#566474',1,1,198,6);R_(q,'#2e3842',1,77,198,6);for(let x=4;x<198;x+=12){R_(q,'#2e3842',x,3,2,2);R_(q,'#2e3842',x,79,2,2)}
 R_(q,'#5a5248',1,14,198,56);for(let x=2;x<198;x+=10)R_(q,'#6a4a2a',x,16,6,52);for(const yy of[24,58]){R_(q,DTC.o,0,yy-1,200,5);R_(q,'#a8acb4',0,yy,200,3)}
 if(v>=.5){const fr=v>=.8,L=fr?192:200,x0=fr?0:0;R_(q,DTC.o,x0,10,L,64);R_(q,'#b8bcc4',x0+1,11,L-2,62);R_(q,'#d0d4dc',x0+1,11,L-2,8);R_(q,'#9aa0aa',x0+1,65,L-2,8);R_(q,'#2f6fd0',x0+1,19,L-2,4);R_(q,'#2f6fd0',x0+1,61,L-2,4);
  for(let x=x0+14;x<x0+L-20;x+=26){R_(q,'#26303c',x,24,16,6);R_(q,'#26303c',x,54,16,6)}for(const ax of[x0+46,x0+120]){R_(q,DTC.o,ax,32,28,20);R_(q,'#8a8e96',ax+1,33,26,18);for(let i=0;i<5;i++)R_(q,'#6e727a',ax+3+i*5,35,2,14)}
  if(fr){R_(q,DTC.o,x0+L-14,14,14,56);R_(q,'#26303c',x0+L-13,16,12,52);R_(q,'#fff4c0',x0+L-3,18,3,8);R_(q,'#fff4c0',x0+L-3,58,3,8);R_(q,'#16111c',x0+L-30,36,12,12);kpText(q,'7',x0+L-24,42.5,10,9,'#ffd84a')}else{R_(q,DTC.o,x0,36,4,12);R_(q,DTC.o,x0+L-4,36,4,12)}}})},{ov:1,sw:1}),
// helix: a crashed army helicopter on its side: the cockpit smashed, the tail boom snapped, the rotor blades bent (put blaze
// effects on it)
helix:{w:250,h:140,c:[150,46],f:(g,x,y,v)=>S2(g,x,y,250,140,q=>{q.lineCap='round';for(const[w,c]of[[12,DTC.o],[8,'#3a3a34']])for(const[a,b,e,d]of[[120,60,10,20],[120,60,236,30],[120,60,100,132],[120,60,190,120]]){q.strokeStyle=c;q.lineWidth=w;q.beginPath();q.moveTo(a,b);q.quadraticCurveTo((a+e)/2+(d-b)*.15,(b+d)/2-(e-a)*.12,e,d);q.stroke()}
 q.save();q.translate(48,96);q.rotate(-.5);R_(q,DTC.o,-46,-9,80,18);R_(q,DTC.ol,-45,-8,78,16);R_(q,DTC.old,-45,4,78,4);R_(q,DTC.o,-50,-22,16,30);R_(q,DTC.ol,-49,-21,14,28);q.restore();
 q.fillStyle=DTC.o;q.beginPath();q.ellipse(140,92,74,34,-.08,0,7);q.fill();q.fillStyle=DTC.ol;q.beginPath();q.ellipse(140,92,72,32,-.08,0,7);q.fill();q.fillStyle=DTC.oll;q.beginPath();q.ellipse(136,82,62,16,-.08,0,7);q.fill();q.fillStyle=DTC.old;q.beginPath();q.ellipse(146,108,60,12,-.08,0,7);q.fill();
 q.fillStyle=DTC.o;q.beginPath();q.ellipse(200,88,22,20,0,0,7);q.fill();q.fillStyle='#1a2a36';q.beginPath();q.ellipse(200,88,20,18,0,0,7);q.fill();q.strokeStyle='#bfe6ff';q.lineWidth=1.5;q.beginPath();q.moveTo(192,78);q.lineTo(204,92);q.lineTo(196,100);q.moveTo(204,92);q.lineTo(214,86);q.stroke();
 R_(q,DTC.o,112,66,26,12);R_(q,'#2a2c26',113,67,24,10);R_(q,'#f4f4f0',128,96,26,10);kpText(q,'ARMY',141,101.5,24,8,'#16111c');for(const[a,b]of[[96,104],[118,110],[164,70],[180,104]]){R_(q,'#1a1814',a,b,8,5)}q.lineCap='butt'})},
// roofsos: HELP painted big on a flat roof, in white, dripping (your text)
roofsos:{w:240,h:90,c:0,txt:8,dt:'HELP',f:(g,x,y,v,col,t)=>S2(g,x,y,240,90,q=>{const s=(cmTxt(t,8)||'HELP').toUpperCase();q.font='bold 78px Impact, Arial Black, Arial, sans-serif';q.textAlign='center';q.textBaseline='middle';q.fillStyle='rgba(20,16,20,.35)';q.fillText(s,123,48);q.fillStyle='#f4f4ee';q.fillText(s,120,45);
 for(let i=0;i<9;i++)R_(q,'#f4f4ee',30+i*22+(i%3)*4,72,3,8+(i%4)*4);q.textAlign='left';q.textBaseline='alphabetic'})},
// ledsign: a trailer with a flashing amber LED message board: it shows your text two lines at a time ("A|B|C|D" = A B, then C D)
ledsign:{w:116,h:92,c:[104,16],txt:90,dt:'QUARANTINE|ZOMBVILLE GENERAL|MEDICAL AID|STADIUM GATE A|STAY|INDOORS',f:(g,x,y,v)=>S2(g,x,y,116,92,q=>{R_(q,DTC.o,10,72,96,12);R_(q,'#e8e8e4',11,73,94,10);for(let x=11;x<104;x+=12)R_(q,'#e07a1a',x,73,6,10);for(const x of[20,86]){R_(q,DTC.o,x,80,12,12);R_(q,'#2a2a30',x+1,81,10,10)}
 R_(q,DTC.o,0,80,12,4);R_(q,DTC.o,54,52,8,22);R_(q,'#8a8e96',55,53,6,20);R_(q,DTC.o,0,0,116,54);R_(q,'#26262c',1,1,114,52);R_(q,'#0c0c10',5,5,106,44);q.fillStyle='rgba(255,170,40,.08)';for(let y=7;y<48;y+=3)for(let x=7;x<110;x+=3)q.fillRect(x,y,1,1)}),
 an(o,t){const L=dtLines(o.tx||OB.ledsign.dt,8).map(s=>s.toUpperCase()),n=Math.max(1,Math.ceil(L.length/2)),P=2.6,u=(t+cmR(o,0,81)*9)%(P*n),pg=Math.floor(u/P),on=(u%P)>.25;if(!on)return;const a=L[pg*2]||'',b=L[pg*2+1]||'',cx=o.x,cy=o.y-92+27;
  X.save();X.fillStyle='#ffb02a';X.shadowColor='#ff9a2a';X.shadowBlur=4;for(const[s,dy]of b?[[a,-9],[b,9]]:[[a,0]]){kpFit(X,s,98,14,'ui-monospace, Menlo, Consolas, monospace');X.textAlign='center';X.textBaseline='middle';X.fillText(s,cx,cy+dy)}X.restore();X.textAlign='left';X.textBaseline='alphabetic'}},
// riot: dropped riot gear: shields, a helmet, a baton
riot:{w:60,h:30,c:0,f:(g,x,y,v)=>S2(g,x,y,60,30,q=>{q.save();q.translate(18,15);q.rotate(-.4);R_(q,DTC.o,-14,-9,28,18);R_(q,'rgba(190,220,240,.85)',-13,-8,26,16);kpText(q,'POLICE',0,0,24,6,'#16111c');q.restore();q.fillStyle=DTC.o;q.beginPath();q.arc(44,14,8,0,7);q.fill();q.fillStyle='#26262c';q.beginPath();q.arc(44,14,7,0,7);q.fill();R_(q,'rgba(190,220,240,.7)',39,14,10,4);R_(q,DTC.o,30,24,24,3)})},
// suitcase: a dropped suitcase (var picks the colour), sometimes burst open
suitcase:{w:34,h:26,c:0,f:(g,x,y,v)=>S2(g,x,y,34,26,q=>{v=+v||0;const c=['#2a4a7a','#8a2a2a','#26262c','#5a6a3a','#c8a040'][Math.floor(v*5)%5];R_(q,DTC.o,2,4,30,20);R_(q,c,3,5,28,18);R_(q,'rgba(255,255,255,.2)',3,5,28,3);R_(q,DTC.o,12,1,10,4);if(v>=.6){R_(q,'#e8e4dc',6,8,10,8);R_(q,'#c0392b',18,10,8,6);R_(q,'#7a9aba',8,16,12,4)}})}});
