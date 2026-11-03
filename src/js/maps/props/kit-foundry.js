//# maps/props/kit-foundry.js — Kit props for the Black Iron Foundry: the molten-metal ladle, furnaces, the big forklift, welding and fabrication machines, steel stock, cranes
// ---------- the Black Iron Foundry's pieces ----------
// (pictures only: they are drawn once into each map's background; the molten metal's bubbling is the `molten` effect, the welding
// arcs the `weldarc` effect, both in world/kit-foundry.js)
const FD={o:'#16111c',st:'#6e737b',sl:'#8a9098',sh:'#b4bac2',dk:'#3a3d46',dd:'#2a2c32',yl:'#e8b02a',yd:'#c8901a',hot:'#ff8a2a',hy:'#ffd84a',hw:'#fff2b0',gr:'#4a6a5a',gd:'#3a5448',bl:'#3a5a8a',bd:'#2c4468'};
const fdE=(q,x,y,rx,ry,c,a0,a1)=>{q.fillStyle=c;q.beginPath();q.ellipse(x,y,rx,ry,0,a0||0,a1||7);q.fill()};
// an I-beam lying along x (seen from the side: flanges top and bottom, the web between) or end-on
function fdBeam(q,x,y,len,h,c){R_(q,FD.o,x-1,y-1,len+2,h+2);R_(q,c||FD.sl,x,y,len,h);R_(q,FD.sh,x,y,len,1);R_(q,hwSh(c||FD.sl,.7),x,y+2,len,h-4);R_(q,c||FD.sl,x,y+h-2,len,2);R_(q,FD.o,x+len-2,y,2,h)}
function fdEnd(q,x,y,s){R_(q,FD.o,x-1,y-1,s+2,s+2);R_(q,FD.sl,x,y,s,2);R_(q,FD.sl,x,y+s-2,s,2);R_(q,FD.sl,x+s/2-1,y,2,s)}
function fdPipe(q,x,y,len,d,c){R_(q,FD.o,x-1,y-1,len+2,d+2);R_(q,c||'#7a7f88',x,y,len,d);R_(q,'#a8aeb6',x,y+1,len,1);R_(q,'#4a4e56',x,y+d-2,len,1);fdE(q,x+len,y+d/2,2,d/2,FD.o);fdE(q,x+len,y+d/2,1.2,d/2-1,'#2a2c32')}
Object.assign(OB,{
// ladle: the big foundry crucible on its tilting stand, full of glowing metal (put the `molten` effect on its surface, 89 px above its
// foot, to make it bubble and pop). It lights the room like a fire.
ladle:Object.assign(ob(170,130,[146,40],q=>{for(const x of[10,150]){R_(q,FD.o,x-1,24,12,104);R_(q,FD.dk,x,25,10,102);R_(q,FD.st,x,25,3,102)}R_(q,FD.o,2,116,166,13);R_(q,'#4a4e56',3,117,164,11);for(let i=6;i<166;i+=14){R_(q,FD.yl,i,124,7,3);R_(q,FD.o,i+7,124,7,3)}
 fdE(q,15,60,9,9,FD.o);fdE(q,15,60,7,7,FD.sl);for(let a=0;a<6.28;a+=1.05)R_(q,FD.o,15+Math.cos(a)*5-1,60+Math.sin(a)*5-1,2,2);fdE(q,155,60,7,7,FD.o);fdE(q,155,60,5,5,FD.sl);
 q.fillStyle=FD.o;q.beginPath();q.moveTo(24,40);q.lineTo(38,112);q.quadraticCurveTo(85,130,132,112);q.lineTo(146,40);q.closePath();q.fill();
 q.fillStyle='#46414a';q.beginPath();q.moveTo(26,40);q.lineTo(39,110);q.quadraticCurveTo(85,127,131,110);q.lineTo(144,40);q.closePath();q.fill();
 q.fillStyle='rgba(120,50,30,.45)';q.beginPath();q.moveTo(26,40);q.lineTo(29,56);q.lineTo(141,56);q.lineTo(144,40);q.fill();q.fillStyle='rgba(20,20,26,.3)';q.beginPath();q.moveTo(36,96);q.lineTo(39,110);q.quadraticCurveTo(85,127,131,110);q.lineTo(134,96);q.fill();q.fillStyle='rgba(255,255,255,.12)';q.beginPath();q.moveTo(30,44);q.lineTo(42,106);q.lineTo(50,108);q.lineTo(40,44);q.fill();for(const y of[62,86]){q.strokeStyle=FD.o;q.lineWidth=3;q.beginPath();q.ellipse(85,y,58-(y-40)*.18,8,0,0,Math.PI);q.stroke();q.strokeStyle=FD.st;q.lineWidth=1.5;q.stroke()}
 R_(q,FD.o,14,57,16,7);R_(q,FD.sl,15,58,14,5);R_(q,FD.o,140,57,16,7);R_(q,FD.sl,141,58,14,5);
 q.fillStyle=FD.o;q.beginPath();q.moveTo(136,34);q.lineTo(158,26);q.lineTo(156,38);q.lineTo(138,46);q.fill();q.fillStyle=FD.sl;q.beginPath();q.moveTo(137,36);q.lineTo(155,29);q.lineTo(154,36);q.lineTo(139,43);q.fill();
 fdE(q,85,40,62,17,FD.o);fdE(q,85,40,60,15,FD.sl);fdE(q,85,39,60,13,FD.sh);fdE(q,85,41,53,12,'#c8401a');fdE(q,85,41,49,10.6,FD.hot);fdE(q,85,41,38,8.4,FD.hy);fdE(q,84,41,20,4.6,FD.hw);
 q.fillStyle='rgba(120,40,20,.55)';for(const[x,y,w]of[[48,42,10],[110,44,8],[70,47,6],[120,37,5]])q.fillRect(x,y,w,2);q.fillStyle=FD.hw;q.fillRect(149,31,5,3);q.fillStyle=FD.hot;q.fillRect(150,34,3,4)}),{wb:1,nr:1,lt:[{dx:0,dy:-90,r:280,i:1,f:'fire',c:'#ff8a3a',gs:1.6}]}),
// furnace: a forging furnace: a firebrick box in a steel frame, its door raised on chains so the fire inside shows, a flue on top
furnace:Object.assign(ob(150,172,[140,46],q=>{R_(q,FD.o,6,44,138,126);R_(q,'#5a4a44',8,46,134,122);for(let y=50;y<160;y+=8)for(let x=(y/8)%2?10:18;x<138;x+=16){R_(q,'#6a5650',x,y,14,6);R_(q,'#4a3c38',x,y+5,14,1)}
 for(const x of[8,136])R_(q,FD.dk,x,46,6,122);R_(q,FD.dk,8,46,134,6);R_(q,FD.dk,8,160,134,8);R_(q,FD.st,8,46,134,2);
 R_(q,FD.o,112,0,20,48);R_(q,FD.st,113,0,18,47);R_(q,FD.sh,114,0,3,47);R_(q,FD.o,108,40,28,8);R_(q,FD.dk,109,41,26,6);
 R_(q,FD.o,38,10,74,4);R_(q,FD.dk,39,11,72,2);for(const x of[44,104]){R_(q,FD.o,x-1,12,3,40);for(let y=14;y<50;y+=5)R_(q,'#9a9a9a',x-1,y,3,3)}
 R_(q,FD.o,34,46,82,16);R_(q,'#4a3c38',35,47,80,14);R_(q,FD.dk,35,47,80,3);
 R_(q,FD.o,34,76,82,56);R_(q,FD.hot,36,78,78,52);R_(q,'#ff6a1a',36,78,78,12);R_(q,'#ffb02e',36,90,78,10);R_(q,FD.hy,36,100,78,16);
 q.fillStyle=FD.hw;for(let i=0;i<7;i++){const x=40+i*11;q.beginPath();q.moveTo(x,130);q.lineTo(x+5,98+(i*7)%16);q.lineTo(x+10,130);q.fill()}R_(q,'#7a2a10',36,124,78,6);for(let i=0;i<6;i++)R_(q,FD.hot,42+i*12,121,7,4);
 R_(q,FD.o,10,96,22,40);R_(q,'#5a5e66',11,97,20,38);for(const[x,y,c]of[[14,101,'#3aff6a'],[22,101,'#ff3a3a']]){R_(q,FD.o,x-1,y-1,6,6);R_(q,c,x,y,4,4)}fdE(q,21,118,6,6,FD.o);fdE(q,21,118,5,5,'#e8e4d8');R_(q,FD.o,21,114,1,5);
 for(let i=8;i<142;i+=12){R_(q,FD.yl,i,163,6,4);R_(q,FD.o,i+6,163,6,4)}}),{wb:1,nr:1,lt:[{dx:0,dy:-66,r:230,i:1,c:'#ff8a3a'}]}),
// arcfurn: an electric arc furnace: a round shell with a domed lid, three graphite electrodes on arms from a mast, light leaking from
// under the lid
arcfurn:Object.assign(ob(160,170,[140,50],q=>{R_(q,FD.o,126,8,16,156);R_(q,FD.dk,127,9,14,154);R_(q,FD.st,128,9,3,154);
 q.fillStyle=FD.o;q.beginPath();q.moveTo(14,92);q.lineTo(20,156);q.quadraticCurveTo(72,172,124,156);q.lineTo(130,92);q.closePath();q.fill();q.fillStyle='#4a4e56';q.beginPath();q.moveTo(16,92);q.lineTo(22,154);q.quadraticCurveTo(72,169,122,154);q.lineTo(128,92);q.closePath();q.fill();
 for(const y of[108,128,146]){q.strokeStyle=FD.o;q.lineWidth=3;q.beginPath();q.ellipse(72,y,56,8,0,0,Math.PI);q.stroke();q.strokeStyle=FD.st;q.lineWidth=1.5;q.stroke()}
 fdE(q,72,92,60,14,FD.o);fdE(q,72,92,58,12,'#a8301a');fdE(q,72,92,50,9.5,FD.hot);fdE(q,72,92,30,5.5,FD.hw);
 fdE(q,72,84,58,14,FD.o);fdE(q,72,83,56,12,'#6e6a66');q.fillStyle=FD.o;q.beginPath();q.ellipse(72,80,44,20,0,Math.PI,0);q.fill();q.fillStyle='#7e7a76';q.beginPath();q.ellipse(72,80,42,18,0,Math.PI,0);q.fill();
 for(const[x,h]of[[50,58],[72,66],[94,58]]){R_(q,FD.o,x-6,80-h,12,h);R_(q,'#2a2a2e',x-5,80-h,10,h);R_(q,'#4a4a52',x-5,80-h,3,h);fdE(q,x,80,8,3,'#ff8a2a');R_(q,FD.o,x-2,80-h-12,4,14);R_(q,FD.o,x,80-h-14,128-x,6);R_(q,FD.sl,x+1,80-h-13,126-x,4)}
 R_(q,FD.o,124,100,26,20);R_(q,FD.yl,125,101,24,18);R_(q,FD.o,129,105,16,2);R_(q,FD.o,129,110,16,2);q.fillStyle=FD.o;q.beginPath();q.moveTo(8,118);q.lineTo(24,112);q.lineTo(24,124);q.fill();R_(q,FD.hot,9,117,10,3)}),{wb:1,nr:1,lt:[{dx:-8,dy:-80,r:220,i:.9,c:'#ffb060'}]}),
// bigfork: a heavy forklift, half again the size of the warehouse's, for steel (var under 0.34 empty forks, under 0.67 a bundle of
// I-beams, above that a steel coil); it faces left
bigfork:ob(184,112,[150,44],(q,v)=>{const ld=v<.34?0:v<.67?1:2;
 R_(q,FD.o,112,8,8,96);R_(q,FD.o,166,8,6,62);R_(q,FD.o,112,6,62,8);R_(q,FD.dk,113,7,60,6);R_(q,FD.dk,113,9,6,92);R_(q,FD.dk,167,9,4,60);
 R_(q,FD.o,104,48,78,48);R_(q,FD.yl,106,50,74,44);R_(q,'#f0c040',106,50,74,6);R_(q,FD.yd,106,82,74,12);R_(q,FD.o,150,30,30,22);R_(q,FD.yl,151,31,28,20);R_(q,'#2a2c32',156,36,18,10);
 R_(q,FD.o,122,36,28,16);R_(q,'#2a2c32',123,37,26,14);R_(q,'#1a1a1e',128,40,14,4);R_(q,FD.o,170,40,14,52);R_(q,'#4a4e56',171,41,12,50);for(let y=46;y<90;y+=8)R_(q,'#3a3d46',171,y,12,3);
 for(const[x,r]of[[124,16],[166,14]]){fdE(q,x,96,r+1,r+1,FD.o);fdE(q,x,96,r,r,'#26262c');fdE(q,x,96,r*.45,r*.45,'#6e737b');for(let a=0;a<6.28;a+=.785)R_(q,'#3a3a40',x+Math.cos(a)*(r-3)-1,96+Math.sin(a)*(r-3)-1,3,3)}
 R_(q,FD.o,94,2,12,104);R_(q,'#4a4e56',95,3,10,102);R_(q,'#6e737b',95,3,3,102);R_(q,FD.o,88,10,8,94);R_(q,'#5a5e66',89,11,6,92);
 R_(q,FD.o,6,100,90,7);R_(q,'#8a9098',7,101,88,5);R_(q,FD.o,6,86,90,4);R_(q,'#7a7f88',7,87,88,2);R_(q,'#2a2c32',84,84,6,22);
 if(ld==1){for(let i=0;i<3;i++)fdBeam(q,2,50+i*12,92,11);R_(q,FD.yl,24,48,4,40);R_(q,FD.yl,64,48,4,40)}else if(ld==2){fdE(q,46,72,30,30,FD.o);fdE(q,46,72,29,29,'#8a9098');for(let r=26;r>10;r-=4){q.strokeStyle='#6e737b';q.lineWidth=1;q.beginPath();q.arc(46,72,r,0,7);q.stroke()}fdE(q,46,72,10,10,FD.o);fdE(q,46,72,9,9,'#2a2c32');R_(q,'#c8a040',16,70,60,3)}}),
// weldtable: a heavy steel welding table (a holed top plate on thick legs) with a part clamped on it (var picks the part)
weldtable:ob(104,58,[96,18],(q,v)=>{for(const x of[6,90])R_(q,FD.o,x,24,8,32),R_(q,FD.dk,x+1,25,6,30);R_(q,FD.o,8,44,88,5);R_(q,FD.dk,9,45,86,3);
 R_(q,FD.o,2,16,100,12);R_(q,'#5a5e66',3,17,98,10);R_(q,'#7a7f88',3,17,98,3);for(let x=8;x<100;x+=9)R_(q,'#2a2c32',x,21,3,2);
 const p=Math.floor(v*3);if(p==0){fdBeam(q,16,8,58,7);fdBeam(q,24,2,8,8);fdBeam(q,62,2,8,8);R_(q,FD.hot,44,8,3,2)}else if(p==1){R_(q,FD.o,20,4,40,13);R_(q,'#7a7f88',21,5,38,11);R_(q,'#9aa0a8',21,5,38,2);R_(q,FD.o,52,0,6,6);R_(q,'#7a7f88',53,1,4,4);R_(q,'#3a3d46',40,10,12,1)}else{fdPipe(q,14,8,60,7);fdPipe(q,40,1,7,8);R_(q,FD.hot,46,8,2,2)}
 for(const x of[18,72]){R_(q,FD.o,x,6,4,12);R_(q,'#c0392b',x+1,7,2,10);R_(q,FD.o,x-3,4,10,3)}q.strokeStyle='#26262c';q.lineWidth=2;q.beginPath();q.moveTo(80,16);q.quadraticCurveTo(96,6,100,26);q.stroke()}),
// welder: a welding machine on a little cart, its leads coiled on top
welder:ob(36,44,[28,12],q=>{R_(q,FD.o,3,10,30,28);R_(q,'#2f6fd0',4,11,28,26);R_(q,'#4a8ae8',4,11,28,4);R_(q,'#1a2a4a',8,18,12,8);R_(q,'#3aff6a',9,19,3,3);fdE(q,26,22,3,3,FD.o);fdE(q,26,22,2,2,'#e8e4d8');for(const x of[8,28]){fdE(q,x,39,4,4,FD.o);fdE(q,x,39,3,3,'#3a3a40')}
 q.strokeStyle='#26262c';q.lineWidth=2;for(let i=0;i<3;i++){q.beginPath();q.ellipse(18,9-i,10,3,0,0,7);q.stroke()}R_(q,'#c0392b',14,4,8,3)}),
// lathe: a long metal lathe: headstock, bed, carriage, tailstock, a bar in the chuck
lathe:ob(144,60,[136,16],q=>{for(const x of[14,118])R_(q,FD.o,x,36,14,22),R_(q,FD.gd,x+1,37,12,20);R_(q,FD.o,6,32,132,8);R_(q,'#2a2c32',7,33,130,6);
 R_(q,FD.o,10,26,124,8);R_(q,'#8a9098',11,27,122,3);R_(q,'#6e737b',11,30,122,3);R_(q,FD.o,6,4,34,30);R_(q,FD.gr,7,5,32,28);R_(q,'#5a8a6a',7,5,32,4);for(const[x,y]of[[12,14],[22,14],[12,22]])R_(q,'#16111c',x,y,4,4);
 R_(q,FD.o,40,8,8,22);R_(q,'#8a9098',41,9,6,20);fdPipe(q,48,15,46,6,'#a8aeb6');R_(q,FD.o,62,14,24,16);R_(q,FD.gr,63,15,22,14);R_(q,'#c8c8c0',70,10,8,6);
 R_(q,FD.o,104,10,22,20);R_(q,FD.gr,105,11,20,18);R_(q,'#8a9098',96,16,10,4);R_(q,'#3a3d46',8,58,128,2)}),
// pressbrake: a press brake bending a steel plate: two tall side frames, the ram with its cylinders, the long die
pressbrake:ob(150,96,[140,22],q=>{for(const x of[4,124]){R_(q,FD.o,x,6,22,88);R_(q,FD.bl,x+1,7,20,86);R_(q,'#5a7ab0',x+1,7,20,5);R_(q,FD.bd,x+16,7,5,86)}
 for(const x of[34,104]){R_(q,FD.o,x,2,12,30);R_(q,'#9aa0a8',x+1,3,10,28);R_(q,'#c8ccd0',x+2,3,2,28)}R_(q,FD.o,24,30,102,18);R_(q,FD.bl,25,31,100,16);R_(q,'#5a7ab0',25,31,100,3);R_(q,FD.o,30,48,90,6);R_(q,'#8a9098',31,48,88,5);
 q.fillStyle=FD.o;q.beginPath();q.moveTo(14,58);q.lineTo(75,64);q.lineTo(136,58);q.lineTo(136,62);q.lineTo(75,68);q.lineTo(14,62);q.fill();q.fillStyle='#a8aeb6';q.beginPath();q.moveTo(15,59);q.lineTo(75,65);q.lineTo(135,59);q.lineTo(135,61);q.lineTo(75,67);q.lineTo(15,61);q.fill();
 R_(q,FD.o,26,66,98,26);R_(q,FD.bl,27,67,96,24);R_(q,'#2a2c32',30,66,90,4);for(let i=28;i<122;i+=10){R_(q,FD.yl,i,86,5,4);R_(q,FD.o,i+5,86,5,4)}R_(q,FD.o,128,40,18,24);R_(q,'#26262c',129,41,16,22);R_(q,'#3aa8ff',131,44,12,8)}),
// drillpress: a floor drill press
drillpress:ob(36,84,[22,12],q=>{R_(q,FD.o,14,10,8,70);R_(q,'#8a9098',15,11,6,68);R_(q,FD.o,4,4,30,22);R_(q,FD.gr,5,5,28,20);R_(q,'#5a8a6a',5,5,28,4);R_(q,FD.o,26,0,10,14);R_(q,FD.gd,27,1,8,12);R_(q,FD.o,16,26,4,12);R_(q,'#c8ccd0',17,26,2,12);
 R_(q,FD.o,6,44,26,6);R_(q,'#6e737b',7,45,24,4);R_(q,FD.o,4,76,30,8);R_(q,FD.gd,5,77,28,6);q.strokeStyle='#26262c';q.lineWidth=1.5;for(const a of[0,2.1,4.2]){q.beginPath();q.moveTo(30,18);q.lineTo(30+Math.cos(a)*6,18+Math.sin(a)*6);q.stroke()}}),
// bandsaw: a horizontal bandsaw cutting a steel bar held in its vise
bandsaw:ob(84,66,[74,20],q=>{R_(q,FD.o,6,34,66,30);R_(q,'#c8901a',7,35,64,28);R_(q,'#e8b02a',7,35,64,4);R_(q,'#2a2c32',12,42,20,10);
 q.fillStyle=FD.o;q.beginPath();q.moveTo(8,30);q.lineTo(20,8);q.lineTo(70,8);q.lineTo(72,30);q.fill();q.fillStyle='#e8b02a';q.beginPath();q.moveTo(10,29);q.lineTo(21,10);q.lineTo(68,10);q.lineTo(70,29);q.fill();R_(q,'#9aa0a8',14,28,56,3);
 fdPipe(q,0,26,84,6,'#a8aeb6');R_(q,FD.o,30,22,10,12);R_(q,'#5a5e66',31,23,8,10);R_(q,'#c8b890',2,30,4,3)}),
// plasmatbl: a CNC plasma cutting table: a slatted bed with a sheet half cut out, the gantry with the torch, the control desk
plasmatbl:ob(172,92,[160,40],q=>{R_(q,FD.o,4,34,160,52);R_(q,'#3a3d46',5,35,158,50);for(let x=8;x<162;x+=6)R_(q,'#2a2c32',x,36,2,48);
 R_(q,FD.o,16,40,108,40);R_(q,'#8a9098',17,41,106,38);R_(q,'#a8aeb6',17,41,106,2);q.fillStyle='#2a2c32';for(const[x,y,w,h]of[[24,48,18,14],[50,46,12,26],[72,52,22,12],[100,48,14,14]])q.fillRect(x,y,w,h);q.strokeStyle='#ffb060';q.lineWidth=1;q.strokeRect(100,64,14,10);
 R_(q,FD.o,2,82,164,8);R_(q,'#4a4e56',3,83,162,6);R_(q,FD.o,92,18,12,72);R_(q,FD.yl,93,19,10,70);R_(q,FD.o,86,24,24,14);R_(q,'#2a2c32',87,25,22,12);R_(q,'#c8ccd0',96,38,4,14);
 R_(q,FD.o,140,4,30,40);R_(q,'#26262c',141,5,28,38);R_(q,'#3aa8ff',144,9,22,14);R_(q,'#2a6aaa',144,20,22,3);R_(q,'#3aff6a',145,28,4,3);R_(q,'#ff3a3a',152,28,4,3)}),
// grinder: a bench grinder on a pedestal
grinder:ob(30,48,[16,10],q=>{R_(q,FD.o,13,14,6,32);R_(q,'#5a5e66',14,15,4,30);R_(q,FD.o,7,42,18,6);R_(q,'#4a4e56',8,43,16,4);R_(q,FD.o,9,6,14,12);R_(q,FD.gr,10,7,12,10);for(const x of[4,26]){fdE(q,x,11,5,6,FD.o);fdE(q,x,11,4,5,'#9a968c')}R_(q,'#3a3d46',1,4,8,4);R_(q,'#3a3d46',23,4,8,4)}),
// phammer: a power hammer for forging: the tall frame, the ram over the anvil, the motor and its belt
phammer:ob(76,116,[58,30],q=>{q.fillStyle=FD.o;q.beginPath();q.moveTo(30,2);q.lineTo(64,2);q.lineTo(70,110);q.lineTo(8,110);q.lineTo(14,70);q.lineTo(30,60);q.closePath();q.fill();q.fillStyle='#2e3a32';q.beginPath();q.moveTo(31,3);q.lineTo(63,3);q.lineTo(68,108);q.lineTo(10,108);q.lineTo(16,71);q.lineTo(31,61);q.closePath();q.fill();
 R_(q,'#3e4e44',32,4,30,10);R_(q,FD.o,18,40,18,30);R_(q,'#6e737b',19,41,16,28);R_(q,'#8a9098',19,41,4,28);R_(q,FD.o,14,72,28,18);R_(q,'#4a4e56',15,73,26,16);R_(q,'#6e737b',15,73,26,3);fdE(q,26,73,6,2,FD.hot);
 fdE(q,58,20,14,14,FD.o);fdE(q,58,20,12,12,'#3a3d46');fdE(q,58,20,4,4,'#8a9098');q.strokeStyle='#16111c';q.lineWidth=3;q.beginPath();q.moveTo(46,22);q.lineTo(42,46);q.stroke();R_(q,FD.o,6,104,66,10);R_(q,'#3a3d46',7,105,64,8)}),
// quench: a quench tank, dark oil in a steel trough
quench:ob(92,48,[84,22],q=>{R_(q,FD.o,4,12,84,34);R_(q,'#4a4e56',5,13,82,32);R_(q,'#6e737b',5,13,82,3);for(const x of[10,80])R_(q,'#3a3d46',x,16,3,28);R_(q,FD.o,6,10,80,10);R_(q,'#16141a',7,11,78,8);R_(q,'rgba(140,150,170,.4)',14,12,24,2);R_(q,'rgba(140,150,170,.3)',52,15,18,1);R_(q,FD.o,2,8,88,4);R_(q,'#8a9098',3,9,86,2)}),
// steelrack: a cantilever rack of steel stock: beams, pipe and tube on three levels of arms
steelrack:ob(164,96,[156,18],(q,v)=>{for(const x of[14,80,146]){R_(q,FD.o,x-4,2,8,92);R_(q,FD.yd,x-3,3,6,90);R_(q,FD.yl,x-3,3,2,90);R_(q,FD.o,x-10,90,20,6);R_(q,FD.yd,x-9,91,18,4)}
 for(const y of[24,52,80]){for(const x of[14,80,146]){R_(q,FD.o,x-2,y,12,4);R_(q,FD.yd,x-1,y+1,10,2)}}
 for(let i=0;i<4;i++)fdBeam(q,2,13+i*0,160,10);fdPipe(q,2,40,160,10);fdPipe(q,6,30,152,9,'#8a8f96');for(let i=0;i<3;i++){R_(q,FD.o,2,70-i*1,160,9);R_(q,i%2?'#6a6e76':'#7a7f88',3,71-i*1,158,7)}R_(q,'#a8aeb6',3,64,158,1)}),
// beams: a pile of I-beams on timber dunnage (var: beams, pipe or square tube)
beams:ob(156,44,[146,20],(q,v)=>{const k=Math.floor(v*3);for(const x of[18,74,130]){R_(q,FD.o,x,32,14,10);R_(q,'#8a6a42',x+1,33,12,8)}
 if(k==0){for(let i=0;i<3;i++)fdBeam(q,4,22-i*9,148,10);}else if(k==1){for(let r=0;r<3;r++)for(let i=0;i<3-r;i++)fdPipe(q,4+r*4,24-r*9,144,9)}else{for(let i=0;i<3;i++){R_(q,FD.o,4,22-i*9,148,10);R_(q,'#6e737b',5,23-i*9,146,8);R_(q,'#9aa0a8',5,23-i*9,146,2);R_(q,FD.o,148,23-i*9,4,8)}}}),
// plates: a stack of steel plates on dunnage
plates:ob(84,44,[76,18],q=>{for(const x of[10,62])R_(q,FD.o,x,34,12,8),R_(q,'#8a6a42',x+1,35,10,6);for(let i=0;i<6;i++){R_(q,FD.o,4+i%2,30-i*4,76,5);R_(q,i%2?'#7a7f88':'#6a6e76',5+i%2,31-i*4,74,3)}R_(q,'#a8aeb6',6,10,72,1);R_(q,'#8a4a2a',30,12,12,1)}),
// coil: a steel coil standing on its edge in a cradle
coil:ob(56,52,[44,18],q=>{R_(q,FD.o,6,42,44,9);R_(q,'#3a3d46',7,43,42,7);fdE(q,28,26,24,24,FD.o);fdE(q,28,26,23,23,'#8a9098');for(let r=20;r>8;r-=3){q.strokeStyle='#6e737b';q.lineWidth=1;q.beginPath();q.arc(28,26,r,0,7);q.stroke()}fdE(q,28,26,8,8,FD.o);fdE(q,28,26,7,7,'#2a2c32');q.strokeStyle='#a8aeb6';q.lineWidth=1.5;q.beginPath();q.arc(28,26,22,3.6,4.8);q.stroke()}),
// gascyl: a cage of welding gas cylinders, chained: oxygen, acetylene, argon
gascyl:ob(60,62,[52,14],q=>{R_(q,FD.o,2,56,56,6);R_(q,'#5a5e66',3,57,54,4);for(const[x,c,t]of[[8,'#2f8a4a','#3aa85a'],[22,'#7a1f2a','#9a2a36'],[36,'#7a7f88','#9aa0a8'],[48,'#2f8a4a','#3aa85a']]){R_(q,FD.o,x-1,10,12,48);R_(q,c,x,11,10,46);R_(q,t,x,11,3,46);fdE(q,x+5,11,5,4,c);R_(q,FD.o,x+3,2,4,8);R_(q,'#c8a040',x+4,3,2,6)}
 R_(q,FD.o,2,26,56,3);R_(q,'#c8c8c0',3,27,54,1);for(const x of[2,56])R_(q,FD.o,x,8,3,50),R_(q,'#6e737b',x,9,2,48)}),
// scrapbin: a steel hopper full of offcuts
scrapbin:ob(76,52,[68,24],q=>{q.fillStyle=FD.o;q.beginPath();q.moveTo(4,14);q.lineTo(72,14);q.lineTo(66,48);q.lineTo(10,48);q.closePath();q.fill();q.fillStyle='#4a6a8a';q.beginPath();q.moveTo(6,16);q.lineTo(70,16);q.lineTo(64,46);q.lineTo(12,46);q.closePath();q.fill();R_(q,'#5a7aa0',6,16,64,3);
 q.fillStyle='#7a7f88';for(const[x,y,w,h]of[[10,8,18,5],[26,4,8,12],[36,9,22,4],[50,2,6,12],[18,11,12,3],[58,8,10,6]])q.fillRect(x,y,w,h);q.fillStyle='#8a4a2a';q.fillRect(30,10,10,2);q.fillRect(46,6,4,6);for(const x of[14,62])R_(q,FD.o,x-2,46,6,6)}),
// saferail: a yellow pipe safety barrier
saferail:ob(64,28,[60,6],q=>{for(const x of[4,56])R_(q,FD.o,x-1,4,7,24),R_(q,FD.yl,x,5,5,22),R_(q,'#f0c040',x,5,2,22);for(const y of[6,15]){R_(q,FD.o,2,y,60,5);R_(q,FD.yl,3,y+1,58,3);R_(q,'#f0c040',3,y+1,58,1)}}),
// weldhelm: a welding helmet dropped on the floor
weldhelm:{w:22,h:16,c:0,f:(g,x,y)=>S2(g,x,y,22,16,q=>{fdE(q,11,9,9,6,'#26262c');fdE(q,11,8,8,5,'#3a3d46');R_(q,'#16111c',6,6,10,4);R_(q,'#2a6a4a',7,7,8,2);R_(q,'#c8901a',2,12,18,2)})},
// cranefoot: the wheeled foot of a yard crane's leg, sitting on its rail
cranefoot:ob(44,40,[34,24],q=>{R_(q,FD.o,4,14,36,22);R_(q,FD.yl,5,15,34,20);R_(q,'#f0c040',5,15,34,4);R_(q,FD.yd,5,30,34,5);for(const x of[10,34]){fdE(q,x,36,5,5,FD.o);fdE(q,x,36,4,4,'#3a3a40')}R_(q,FD.o,16,0,12,16);R_(q,FD.yl,17,1,10,14);R_(q,'#2a2c32',18,20,8,6)})});
// bcrane: an overhead bridge crane seen from above: the yellow box girder across the bay on its two end trucks, the trolley and hoist,
// the hook (var 0.5 and up: a bundle of beams hanging on chains), a work light under the trolley. It is drawn over people and goes
// see-through under it. 560 px span.
function fdCraneLoad(q,cx,y,beams){q.strokeStyle='#26262c';q.lineWidth=2;q.beginPath();q.moveTo(cx,y);q.lineTo(cx,y+12);q.stroke();R_(q,FD.o,cx-7,y+12,14,10);R_(q,FD.yl,cx-6,y+13,12,8);q.strokeStyle=FD.o;q.lineWidth=3;q.beginPath();q.arc(cx,y+26,5,0,Math.PI);q.stroke();
 if(beams){q.strokeStyle='#3a3a40';q.lineWidth=1.5;q.beginPath();q.moveTo(cx,y+24);q.lineTo(cx-50,y+38);q.moveTo(cx,y+24);q.lineTo(cx+50,y+38);q.stroke();for(let i=0;i<3;i++)fdBeam(q,cx-80,y+38+i*8,160,8)}}
Object.assign(OB,{
bcrane:{w:560,h:110,c:0,ov:1,sw:540,nr:1,lt:[{dx:-12,dy:-50,r:190,i:.75}],f:(g,x,y,v)=>S2(g,x,y,560,110,q=>{for(const ex of[2,532]){R_(q,FD.o,ex,4,26,52);R_(q,'#3a3d46',ex+1,5,24,50);R_(q,FD.yl,ex+1,5,24,6);for(const wy of[10,44]){R_(q,FD.o,ex+4,wy,18,6);R_(q,'#26262c',ex+5,wy+1,16,4)}}
 R_(q,FD.o,26,14,508,30);R_(q,FD.yl,27,15,506,28);R_(q,'#f0c040',27,15,506,4);R_(q,FD.yd,27,38,506,5);for(let x=32;x<528;x+=40)R_(q,FD.yd,x,19,2,19);for(const x0 of[27,493])for(let i=0;i<5;i++){R_(q,FD.o,x0+i*8,15,4,28)}
 R_(q,FD.o,262,4,52,52);R_(q,'#4a4e56',263,5,50,50);R_(q,'#6e737b',263,5,50,5);fdE(q,288,30,14,14,FD.o);fdE(q,288,30,12,12,'#2a2c32');for(let a=0;a<6.28;a+=.52)R_(q,'#8a9098',288+Math.cos(a)*9-1,30+Math.sin(a)*9-1,2,2);
 fdCraneLoad(q,288,56,v>=.5)})},
// ycrane: a yard gantry crane seen from above: the girder between two A-frame legs (stand a `cranefoot` under each end), trolley,
// hook and (var 0.5 and up) a bundle of beams, a work light under the trolley. Drawn over people. 600 px span.
ycrane:{w:600,h:150,c:0,ov:1,sw:580,nr:1,lt:[{dx:-28,dy:-60,r:210,i:.8}],f:(g,x,y,v)=>S2(g,x,y,600,150,q=>{for(const ex of[10,560]){q.fillStyle=FD.o;q.beginPath();q.moveTo(ex,4);q.lineTo(ex+30,4);q.lineTo(ex+24,140);q.lineTo(ex+6,140);q.closePath();q.fill();q.fillStyle=FD.yl;q.beginPath();q.moveTo(ex+2,6);q.lineTo(ex+28,6);q.lineTo(ex+22,138);q.lineTo(ex+8,138);q.closePath();q.fill();R_(q,FD.yd,ex+12,10,6,124);for(let y=20;y<130;y+=22){R_(q,FD.o,ex+6,y,18,2)}}
 R_(q,FD.o,30,40,540,34);R_(q,FD.yl,31,41,538,32);R_(q,'#f0c040',31,41,538,5);R_(q,FD.yd,31,66,538,6);q.strokeStyle=FD.yd;q.lineWidth=2;for(let x=36;x<566;x+=24){q.beginPath();q.moveTo(x,46);q.lineTo(x+12,66);q.lineTo(x+24,46);q.stroke()}
 R_(q,FD.o,240,30,64,56);R_(q,'#4a4e56',241,31,62,54);R_(q,'#6e737b',241,31,62,6);R_(q,'#2a2c32',248,42,48,10);fdCraneLoad(q,272,86,v>=.5)})}});
OB.bcrane.dk=1;OB.ycrane.dk=1;OB.weldhelm.dk=1;
// highbay: a high-bay shop light hanging from the roof trusses: like the ceiling light, only its light shows in the game (a wide pool);
// highbayf is one with a failing lamp that stutters now and then
OB.highbay=Object.assign(obc(30,30,0,PKLT,(q,v,K)=>{fdE(q,15,15,14,14,FD.o);fdE(q,15,15,13,13,'#6e737b');fdE(q,15,15,9,9,'#3a3d46');fdE(q,15,15,7,7,K.b);R_(q,'#ffffff',11,11,4,2)}),{eo:1,lt:[{dx:0,dy:-15,r:220,w:0,ng:1}]});
OB.highbayf=Object.assign({},OB.highbay,{lt:OB.highbay.lt.map(h=>Object.assign({},h,{f:'fault'})),f(g,x,y,...a){OB.highbay.f.call(this,g,x,y,...a);g.fillStyle='rgba(40,40,52,.6)';g.beginPath();g.arc(x,y-15,7,Math.PI/2,Math.PI*1.5);g.closePath();g.fill()}});
// everything that stands up off the floor is walk-behind (drawn in front of someone who walks behind it)
for(const k of['bigfork','weldtable','welder','lathe','pressbrake','drillpress','bandsaw','plasmatbl','grinder','phammer','quench','steelrack','beams','plates','coil','gascyl','scrapbin','saferail','cranefoot'])OB[k].wb=1;
