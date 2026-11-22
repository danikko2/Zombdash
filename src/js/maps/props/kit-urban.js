//# maps/props/kit-urban.js — Kit props for Urban Outskirts: junk (a stained mattress, a fridge on its back, a washer or dryer, a shopping cart full of someone's things, a pile of tires, an overflowing dumpster), holdouts (plywood with spray paint, a furniture barricade, a yard sign), homes (a window AC unit, a satellite dish, a kiddie pool, a clothesline), the underpass camp (a tarp lean-to), the street (cobra-head street lights, lit, failing or dead; a payphone; an electrical cabinet), the motel's pole sign with its flickering VACANCY, the gas station (an overhead canopy, a pump island), and the salvage yard (crushed cars, a stack of them, a grapple loader, the office trailer)
// ---------- Urban Outskirts' pieces ----------
const UBP={o:'#16111c',st:'#c8ccd4',std:'#8a8f96',sk:'#5a5e68',ir:'#2e2e36',w:'#e8e4dc',wd:'#9a7448',wdl:'#b08a58',wdd:'#6a4a2a',rs:'#8a4a22',rsl:'#a8642e',cn:'#a8a49a',cnl:'#c4c0b4',cnd:'#86827a'};
const UBCAR=[['#8a2a22','Red'],['#2f4a7a','Blue'],['#3a5a3a','Green'],['#8a8f96','Silver'],['#c8b48a','Tan'],['#26262c','Black']];
const UBTARP=[['#2f5aa8','Blue'],['#4a6a3a','Green'],['#7a5a3a','Brown'],['#a8742e','Orange']];
const UBSIGN=[['#c0392b','Red'],['#2f6a9a','Blue'],['#3a8a5a','Green'],['#d8a030','Gold'],['#8a3a8a','Purple']];
const UBDUMP=[['#3f6a3a','Green'],['#2f4a7a','Blue'],['#6a4a2a','Brown'],['#5a5e66','Grey']];
const UBCAN=[['#c0392b','Red'],['#2f6fd0','Blue'],['#3f9a4a','Green'],['#e0b030','Yellow']];
function ubSpray(q,t,x,y,max,px,c){q.save();kpFit(q,t,max,px);q.textAlign='center';q.textBaseline='middle';q.fillStyle='rgba(0,0,0,.25)';q.fillText(t,x+1,y+1);q.fillStyle=c;q.fillText(t,x,y);q.globalAlpha=.5;q.fillRect(x-2,y+px*.5,1,4);q.fillRect(x+max*.3,y+px*.5,1,3);q.restore()}
function ubBag(q,x,y,s,c){kpCirc(q,UBP.o,x,y,6*s);kpCirc(q,c||'#2a2a30',x,y-.5,5*s);q.fillStyle='rgba(255,255,255,.2)';q.fillRect(x-3*s,y-3*s,3*s,1);q.fillStyle=UBP.o;q.fillRect(x-1,y-6*s,2,2)}
function ubTire(q,x,y,r){q.fillStyle=UBP.o;q.beginPath();q.ellipse(x,y,r+1,r*.62+1,0,0,7);q.fill();q.fillStyle='#2a2a30';q.beginPath();q.ellipse(x,y,r,r*.62,0,0,7);q.fill();q.fillStyle='#3e3e46';q.beginPath();q.ellipse(x,y-1,r*.8,r*.46,0,3.4,6);q.fill();q.fillStyle='#121216';q.beginPath();q.ellipse(x,y,r*.42,r*.24,0,0,7);q.fill()}
// ----- junk -----
function ubMatt(q,v){R_(q,'rgba(0,0,0,.25)',6,12,64,30);R_(q,UBP.o,3,5,66,36);R_(q,'#a8a090',4,33,64,7);for(let x=6;x<68;x+=6)R_(q,'#8a8274',x,34,1,5);R_(q,'#e2dccc',4,6,64,27);for(let x=8;x<68;x+=8)R_(q,'#c4ccd8',x,6,2,27);
 for(let y=10;y<32;y+=7)for(let x=10;x<66;x+=10)R_(q,'#c8c0ae',x,y,2,2);q.fillStyle='rgba(150,110,48,.42)';q.beginPath();q.ellipse(26,18,13,7,.3,0,7);q.fill();q.beginPath();q.ellipse(52,26,8,5,0,0,7);q.fill();q.fillStyle='rgba(120,70,40,.35)';q.beginPath();q.ellipse(48,12,6,3,0,0,7);q.fill();
 if(v>=.5){q.fillStyle='#4a4038';q.beginPath();q.ellipse(36,20,11,6,0,0,7);q.fill();q.strokeStyle='#9aa0a8';q.lineWidth=1;for(let k=0;k<4;k++){q.beginPath();q.arc(29+k*5,20,2.5,0,7);q.stroke()}q.fillStyle='#e8e2d4';q.beginPath();q.moveTo(58,6);q.lineTo(68,6);q.lineTo(68,16);q.closePath();q.fill();R_(q,'#b8b0a0',60,7,7,1)}}
function ubFridge(q,v){R_(q,'rgba(0,0,0,.25)',6,12,54,24);R_(q,UBP.o,3,3,56,30);R_(q,'#b8b8b0',4,26,54,6);R_(q,'#e8e8e0',4,4,54,22);R_(q,'#f8f8f0',4,4,54,3);R_(q,'#c8c8c0',20,4,2,22);R_(q,'#8a8f96',8,12,10,3);R_(q,'#8a8f96',26,12,26,3);
 q.fillStyle='rgba(140,80,40,.45)';for(let k=0;k<6;k++)q.fillRect(6+cmH(k,v*9,1)*48,6+cmH(k,v*9,2)*18,2+k%3,2);q.fillStyle='rgba(0,0,0,.12)';q.beginPath();q.ellipse(40,18,7,4,0,0,7);q.fill();if(v>.5)ubTag(q,30,22,'#3aa8e8',2,1)}
function ubWasher(q,v){const dry=v>=.5;R_(q,'rgba(0,0,0,.25)',5,30,32,14);R_(q,UBP.o,2,2,34,42);R_(q,'#c8c8c0',3,16,32,27);R_(q,'#e8e8e0',3,3,32,13);R_(q,'#f8f8f0',3,3,32,2);R_(q,'#5a5e66',5,5,14,4);kpCirc(q,'#8a8f96',28,8,2.5);kpCirc(q,'#8a8f96',22,8,2);
 kpCirc(q,UBP.o,19,29,10);kpCirc(q,'#8a8f96',19,29,9);kpCirc(q,dry?'#4a4e58':'#3a5a7a',19,29,7);if(!dry){q.fillStyle='rgba(200,230,255,.4)';q.fillRect(14,25,5,2)}else{R_(q,'#3a3e48',15,27,8,4)}
 q.fillStyle='rgba(140,80,40,.5)';R_(q,'rgba(140,80,40,.5)',3,40,32,3);for(let k=0;k<5;k++)q.fillRect(4+cmH(k,v*7,3)*28,36+cmH(k,v*7,4)*5,3,2);R_(q,'#a8a8a0',3,16,32,1)}
function ubCart(q,v){if(v>=.5){q.translate(24,32);q.rotate(1.45);q.translate(-24,-32)}const C='#9aa0a8';R_(q,'rgba(0,0,0,.2)',8,36,34,8);
 for(const b of[[14,16,'#2a2a30'],[24,12,'#2f4a8a'],[32,17,'#2a2a30'],[19,9,'#7a3a3a']])ubBag(q,b[0],b[1],1,b[2]);R_(q,'#c8a46a',28,6,10,8);R_(q,'#a8844a',28,6,10,2);R_(q,'#3a6a3a',10,8,8,6);R_(q,'#e8e4dc',34,10,6,4);
 q.strokeStyle=UBP.o;q.lineWidth=3;q.strokeRect(6,14,32,20);q.strokeStyle=C;q.lineWidth=1.5;q.strokeRect(6,14,32,20);for(let x=10;x<38;x+=4){q.beginPath();q.moveTo(x,14);q.lineTo(x,34);q.stroke()}for(let y=18;y<34;y+=5){q.beginPath();q.moveTo(6,y);q.lineTo(38,y);q.stroke()}
 R_(q,UBP.o,38,10,8,4);R_(q,'#c0392b',39,11,6,2);R_(q,C,38,13,2,8);for(const x of[9,35]){kpCirc(q,UBP.o,x,39,3.5);kpCirc(q,'#5a5e66',x,39,2)}R_(q,C,8,34,30,2)}
function ubTires(q,w,h){const P=[];for(let r=0;r<5;r++){const n=6-r,y=h-14-r*13;for(let i=0;i<n;i++)P.push([(w-n*20)/2+10+i*20+(r%2)*4+cmH(i,r,1)*4,y+cmH(i,r,2)*4,10+cmH(i,r,3)*3])}
 q.fillStyle='rgba(0,0,0,.25)';q.beginPath();q.ellipse(w/2+4,h-8,w/2-6,10,0,0,7);q.fill();for(const p of P)ubTire(q,p[0],p[1],p[2]);for(let i=0;i<4;i++){q.save();q.translate(14+i*30,h-12-cmH(i,9,4)*30);q.rotate(.6+i);ubTire(q,0,0,9);q.restore()}}
function ubDump(q,K,v){R_(q,'rgba(0,0,0,.25)',6,46,74,12);R_(q,UBP.o,3,16,78,40);R_(q,K.d,4,34,76,21);R_(q,K.b,4,17,76,18);R_(q,K.l,4,17,76,2);for(let x=12;x<76;x+=16)R_(q,K.dd,x,34,2,21);R_(q,UBP.o,4,34,76,2);
 q.fillStyle='rgba(120,70,30,.5)';for(let k=0;k<8;k++)q.fillRect(6+cmH(k,v*5,1)*70,36+cmH(k,v*5,2)*16,3+k%3,2);ubTag(q,14,46,UBTAG[Math.floor(v*7)%7],1,1.2);ubTag(q,50,44,UBTAG[Math.floor(v*7+3)%7],3,1);
 // the lid flipped back and the trash heaped over the top
 R_(q,UBP.o,6,2,72,10);R_(q,'#2a2a30',7,3,70,8);R_(q,'#3a3a42',7,3,70,2);for(const b of[[14,18],[26,14],[38,17],[50,13],[62,18],[70,15],[20,22],[44,22],[58,22]])ubBag(q,b[0],b[1],1.05,['#26262c','#34343c','#2a2a30','#3e3a36'][b[0]%4]);
 R_(q,'#c8a46a',30,8,12,8);R_(q,'#a8844a',30,8,12,2);R_(q,'#e8e4dc',58,6,10,6);R_(q,'#c0392b',66,24,6,3);for(const x of[10,74]){kpCirc(q,UBP.o,x,56,3);kpCirc(q,'#5a5e66',x,56,1.6)}}
// ----- holdouts -----
function ubPly(q,v,t){for(const[x,a,c]of[[4,-.05,'#c8a46a'],[16,.04,'#d4b278']]){q.save();q.translate(x+16,58);q.rotate(a);R_(q,'rgba(0,0,0,.2)',-14,-4,34,6);R_(q,UBP.o,-17,-55,34,56);R_(q,c,-16,-54,32,54);R_(q,'#e0c48e',-16,-54,32,2);
  q.fillStyle='rgba(140,100,50,.3)';for(let k=0;k<6;k++)q.fillRect(-14,-50+k*8+cmH(k,x,1)*3,28,1);q.fillStyle='#6a6e76';for(const p of[[-13,-50],[11,-50],[-13,-6],[11,-6]])q.fillRect(p[0],p[1],2,2);q.restore()}
 const L=String(t||'KEEP OUT').toUpperCase().split('|');q.save();q.translate(26,30);q.rotate(-.06);ubSpray(q,L[0]||'',0,-6,34,9,v>=.5?'#16111c':'#c0392b');if(L[1])ubSpray(q,L[1],0,6,34,8,v>=.5?'#16111c':'#c0392b');q.restore()}
function ubBarr(q,w,h){q.fillStyle='rgba(0,0,0,.25)';q.beginPath();q.ellipse(w/2,h-10,w/2-4,10,0,0,7);q.fill();
 // a mattress on its edge, a door, a couch on its end, a table legs up, chairs, a dresser, planks nailed across, tires at the foot
 R_(q,UBP.o,8,18,30,52);R_(q,'#d8d2c4',9,19,28,50);for(let y=22;y<68;y+=6)R_(q,'#c4ccd8',9,y,28,1);q.fillStyle='rgba(150,110,48,.4)';q.beginPath();q.ellipse(22,40,8,10,0,0,7);q.fill();
 q.save();q.translate(52,44);q.rotate(-.35);R_(q,UBP.o,-13,-30,26,60);R_(q,'#8a5a32',-12,-29,24,58);R_(q,'#a8743e',-12,-29,24,2);R_(q,'#6a4428',-9,-24,18,20);R_(q,'#6a4428',-9,2,18,22);kpCirc(q,'#d8b050',8,0,2);q.restore();
 R_(q,UBP.o,72,10,30,58);R_(q,'#6a3a4a',73,11,28,56);R_(q,'#8a4a5e',73,11,8,56);for(let y=16;y<64;y+=16)R_(q,'#5a2e3e',81,y,20,2);
 R_(q,UBP.o,100,30,32,8);R_(q,'#9a6a3e',101,31,30,6);for(const x of[103,127])R_(q,'#7a5432',x,6,4,26);R_(q,'#b08050',100,30,32,2);
 R_(q,UBP.o,104,44,24,26);R_(q,'#7a5a3a',105,45,22,24);for(let y=50;y<68;y+=7){R_(q,'#5a4028',105,y,22,1);kpCirc(q,'#c8a050',116,y+3,1)}
 for(const c of[[40,58,.5],[90,62,-.4]]){q.save();q.translate(c[0],c[1]);q.rotate(c[2]);R_(q,UBP.o,-8,-8,16,14);R_(q,'#5a4a3a',-7,-7,14,12);R_(q,'#7a6448',-7,-7,14,3);q.restore()}
 for(const[y,a]of[[34,.08],[50,-.05]]){q.save();q.translate(w/2,y);q.rotate(a);R_(q,UBP.o,-58,-4,116,8);R_(q,UBP.wd,-57,-3,114,6);R_(q,UBP.wdl,-57,-3,114,1);for(const x of[-50,-14,24,50])R_(q,'#5a5e66',x,-1,2,2);q.restore()}
 ubTire(q,26,h-8,10);ubTire(q,116,h-6,9);ubTire(q,70,h-6,9)}
function ubYard(q,t,K){R_(q,UBP.wdd,4,6,4,38);R_(q,UBP.wd,5,6,2,38);R_(q,UBP.wdd,4,6,40,3);R_(q,UBP.wd,4,6,40,1);for(const x of[10,40])R_(q,'#5a5e66',x,9,1,3);
 R_(q,UBP.o,7,11,38,19);R_(q,UBP.w,8,12,36,17);R_(q,K.b,8,12,36,6);kpText(q,String(t||'FOR SALE').toUpperCase().split('|')[0],26,22,32,7,K.d);R_(q,'#b8b4a8',8,27,36,2);q.fillStyle='rgba(0,0,0,.2)';q.beginPath();q.ellipse(6,44,5,2,0,0,7);q.fill()}
// ----- homes -----
function ubAC(q,v){R_(q,'rgba(0,0,0,.2)',4,20,30,6);R_(q,UBP.o,2,2,32,22);R_(q,'#d8d0bc',3,3,30,20);R_(q,'#e8e2d0',3,3,30,3);for(let y=8;y<20;y+=3)R_(q,'#a8a090',5,y,18,1);R_(q,'#b8b0a0',25,7,6,12);kpCirc(q,'#8a8274',28,10,1.5);
 q.fillStyle='rgba(120,90,50,.5)';q.fillRect(10,22,3,5);q.fillRect(11,24,2,4);q.fillStyle='rgba(60,80,100,.35)';q.beginPath();q.ellipse(14,26,6,2,0,0,7);q.fill()}
function ubSat(q){R_(q,UBP.ir,16,20,4,18);R_(q,UBP.o,10,34,16,4);q.fillStyle=UBP.o;q.beginPath();q.ellipse(16,14,15,11,-.4,0,7);q.fill();q.fillStyle='#c8ccd4';q.beginPath();q.ellipse(16,14,14,10,-.4,0,7);q.fill();q.fillStyle='#a8acb4';q.beginPath();q.ellipse(17,15,10,7,-.4,0,7);q.fill();
 q.strokeStyle='#5a5e66';q.lineWidth=1.5;q.beginPath();q.moveTo(16,16);q.lineTo(28,6);q.stroke();R_(q,UBP.o,26,3,6,5);R_(q,'#3a3a42',27,4,4,3)}
function ubKPool(q,v){q.fillStyle='rgba(0,0,0,.2)';q.beginPath();q.ellipse(37,27,32,17,0,0,7);q.fill();q.fillStyle=UBP.o;q.beginPath();q.ellipse(36,23,33,19,0,0,7);q.fill();q.fillStyle='#2f8ad0';q.beginPath();q.ellipse(36,23,32,18,0,0,7);q.fill();q.fillStyle='#4aa8e8';q.beginPath();q.ellipse(36,21,32,15,0,0,7);q.fill();
 q.fillStyle=v>=.5?'#8a7a5a':'#4a5e3a';q.beginPath();q.ellipse(36,23,25,12,0,0,7);q.fill();if(v<.5){q.fillStyle='#5a6e44';q.beginPath();q.ellipse(33,21,20,9,0,0,7);q.fill();q.fillStyle='rgba(220,240,200,.3)';q.fillRect(24,17,10,1)}
 for(let i=0;i<8;i++){q.fillStyle=['#8a5a2a','#a8742e','#6a4a22'][i%3];q.fillRect(16+cmH(i,v*3,1)*36,15+cmH(i,v*3,2)*16,3,2)}q.fillStyle='#f0c030';for(const p of[[14,22],[58,24],[36,38]]){q.beginPath();q.ellipse(p[0],p[1],3,2,0,0,7);q.fill()}R_(q,'#e85a3a',44,24,5,3)}
function ubLine(q,w){for(const x of[6,w-10]){R_(q,UBP.o,x-1,8,6,56);R_(q,'#7a7e86',x,8,4,56);R_(q,UBP.o,x-9,6,22,5);R_(q,'#8a8f96',x-8,7,20,3)}q.strokeStyle='#d8d4c8';q.lineWidth=1;for(const d of[-5,5]){q.beginPath();q.moveTo(8+d,10);q.quadraticCurveTo(w/2,18,w-8+d,10);q.stroke()}
 const C=['#e8e4dc','#c0392b','#2f6fd0','#e0b030','#8a8f96','#3a8a5a','#f088b8'];for(let i=0;i<7;i++){const x=22+i*(w-44)/6,y=10+8*Math.sin(Math.PI*(x-8)/(w-16)),c=C[i%C.length],tall=i%3==1;q.save();q.translate(x,y);q.rotate((cmH(i,w,1)-.5)*.2);R_(q,UBP.o,-7,-1,14,tall?24:16);R_(q,c,-6,0,12,tall?22:14);R_(q,'rgba(0,0,0,.15)',-6,(tall?22:14)-3,12,3);R_(q,'#c8a050',-5,-2,2,3);R_(q,'#c8a050',3,-2,2,3);q.restore()}}
// ----- the underpass camp -----
function ubTarp(q,K){R_(q,'rgba(0,0,0,.25)',8,64,104,16);R_(q,'#8a6a42',10,58,96,18);for(let x=12;x<104;x+=12)R_(q,'#6a4e2e',x,58,2,18);R_(q,'#a8844e',10,58,96,2);
 for(const x of[14,102]){R_(q,UBP.o,x-2,14,5,52);R_(q,'#7a5a36',x-1,14,3,52)}q.strokeStyle='#d8d0b8';q.lineWidth=1;q.beginPath();q.moveTo(14,14);q.lineTo(102,14);q.stroke();
 q.fillStyle=UBP.o;q.beginPath();q.moveTo(6,64);q.lineTo(14,12);q.lineTo(102,12);q.lineTo(112,64);q.closePath();q.fill();q.fillStyle=K.d;q.beginPath();q.moveTo(8,62);q.lineTo(15,14);q.lineTo(101,14);q.lineTo(110,62);q.closePath();q.fill();q.fillStyle=K.b;q.beginPath();q.moveTo(15,14);q.lineTo(101,14);q.lineTo(106,40);q.lineTo(11,40);q.closePath();q.fill();
 q.fillStyle=K.l;for(let x=20;x<100;x+=16)q.fillRect(x,16,8,22);R_(q,K.dd,10,40,98,2);for(let i=0;i<6;i++){kpCirc(q,'#c8ccd4',16+i*17,15,1.5)}
 // the opening: a sleeping bag, a lantern, bags
 R_(q,'#1a1620',36,44,44,18);R_(q,'#3a5a8a',40,48,36,12);R_(q,'#4a6a9a',40,48,36,3);R_(q,'#e8e4dc',40,50,8,6);ubBag(q,22,60,1,'#2a2a30');ubBag(q,94,58,1.1,'#3a3a42');R_(q,'#c8a46a',84,54,10,8);kpCirc(q,'#ffd27a',30,50,2)}
// ----- the street -----
function ubCobra(q,st){R_(q,'rgba(0,0,0,.25)',68,104,16,6);R_(q,UBP.o,69,96,14,12);R_(q,'#5a5e66',70,97,12,10);R_(q,'#7a7e86',70,97,12,2);R_(q,UBP.o,73,14,7,86);R_(q,'#7a7e86',74,14,5,86);R_(q,'#9aa0a8',74,14,2,86);
 q.strokeStyle=UBP.o;q.lineWidth=5;q.beginPath();q.moveTo(76,16);q.quadraticCurveTo(80,4,104,6);q.lineTo(126,8);q.stroke();q.strokeStyle='#8a8f96';q.lineWidth=3;q.beginPath();q.moveTo(76,16);q.quadraticCurveTo(80,4,104,6);q.lineTo(126,8);q.stroke();
 const dr=st==2;q.save();q.translate(132,9);if(dr)q.rotate(.5);q.fillStyle=UBP.o;q.beginPath();q.ellipse(0,0,13,6,0,0,7);q.fill();q.fillStyle='#5a5e66';q.beginPath();q.ellipse(0,-1,12,5,0,0,7);q.fill();q.fillStyle='#7a7e86';q.fillRect(-9,-4,14,2);
 q.fillStyle=st==2?'#3a3e46':'#fff2c0';q.beginPath();q.ellipse(2,3,8,2.5,0,0,7);q.fill();q.restore();R_(q,'#c8a030',72,70,9,6);R_(q,UBP.o,72,70,9,1)}
function ubPhone(q,v){const sm=v>=.5;R_(q,'rgba(0,0,0,.25)',8,58,18,5);R_(q,UBP.o,13,30,7,32);R_(q,'#8a8f96',14,30,5,32);R_(q,UBP.o,2,2,28,32);R_(q,'#2f5aa8',3,3,26,30);R_(q,'#4a7ac8',3,3,26,4);kpText(q,'PHONE',16,6,22,4,'#f4f4f0');
 R_(q,'#8a8f96',7,10,18,20);R_(q,'#5a5e66',9,12,8,10);for(let y=0;y<4;y++)for(let x=0;x<3;x++)R_(q,'#c8ccd4',18+x*2,12+y*3,1,2);if(sm){R_(q,'#2a2a30',9,12,8,10);q.strokeStyle='#c8ccd4';q.lineWidth=1;q.beginPath();q.moveTo(10,13);q.lineTo(16,20);q.moveTo(15,13);q.lineTo(11,19);q.stroke()}
 q.strokeStyle=UBP.o;q.lineWidth=1.5;q.beginPath();q.moveTo(24,26);q.quadraticCurveTo(30,40,sm?22:26,sm?52:30);q.stroke();R_(q,UBP.o,sm?18:24,sm?50:24,8,4);R_(q,'#26262c',sm?19:25,sm?51:25,6,2);if(sm)ubTag(q,6,30,'#e8c030',1,1)}
function ubUtil(q,v){R_(q,'rgba(0,0,0,.25)',4,38,32,6);R_(q,UBP.o,2,4,32,38);R_(q,'#3a5a3a',3,14,30,27);R_(q,'#4e7a4a',3,5,30,9);R_(q,'#5e8a58',3,5,30,2);R_(q,'#2e4a2e',17,14,2,27);for(const x of[12,24])R_(q,'#8a8f96',x,24,2,6);
 R_(q,'#e8c030',6,17,8,7);q.fillStyle=UBP.o;q.beginPath();q.moveTo(10,18);q.lineTo(13,23);q.lineTo(7,23);q.closePath();q.fill();R_(q,'#e8e4dc',21,32,9,5);ubTag(q,8,34,UBTAG[Math.floor(v*7)%7],2,1);q.fillStyle='rgba(140,80,40,.5)';R_(q,'rgba(140,80,40,.5)',3,38,30,3)}
// ----- the motel's pole sign (*colour*; the panel's text) -----
function ubMotel(q,K,t){for(const x of[44,74]){R_(q,UBP.o,x,60,8,118);R_(q,'#5a5e66',x+1,60,6,118);R_(q,'#7a7e86',x+1,60,2,118)}R_(q,UBP.o,40,172,40,8);R_(q,'#7a7a72',41,173,38,6);
 // the panel, faded, a corner rusted through
 R_(q,UBP.o,6,4,108,58);R_(q,K.d,7,5,106,56);R_(q,K.b,9,7,102,52);R_(q,K.l,9,7,102,3);for(let k=0;k<12;k++){q.fillStyle='rgba(255,255,255,.08)';q.fillRect(10+cmH(k,1,1)*96,8+cmH(k,2,1)*48,10,4)}
 const L=String(t||'MOTEL').toUpperCase().split('|');kpText(q,L[0]||'',60,26,94,22,'#f4f0e4',undefined,K.dd);if(L[1])kpText(q,L[1],60,47,90,9,'#f4e8a8');
 R_(q,UBP.rs,96,46,14,12);R_(q,UBP.rsl,98,48,6,4);R_(q,UBP.o,104,50,6,8);
 // the arrow with its bulbs, and the VACANCY box (lit by the game)
 q.fillStyle=UBP.o;q.beginPath();q.moveTo(4,76);q.lineTo(92,76);q.lineTo(92,68);q.lineTo(114,84);q.lineTo(92,100);q.lineTo(92,92);q.lineTo(4,92);q.closePath();q.fill();q.fillStyle='#d8a030';q.beginPath();q.moveTo(6,78);q.lineTo(94,78);q.lineTo(94,72);q.lineTo(110,84);q.lineTo(94,96);q.lineTo(94,90);q.lineTo(6,90);q.closePath();q.fill();
 for(let x=10;x<92;x+=8)kpCirc(q,cmH(x,3,2)<.3?'#5a4a2a':'#fff0c0',x,84,2);R_(q,UBP.o,20,106,80,26);R_(q,'#2a1a22',21,107,78,24);kpText(q,'VACANCY',60,119,70,11,'#5a2a2e')}
function ubMotelAn(o,t){const r=cmR(o,0,77),u=(t+r*13)%9,on=!(u>6.2&&u<6.5)&&!(u>6.7&&u<6.85)&&!(u>2&&u<2.08),x=o.x,y=o.y-180+119;if(!on)return;X.save();try{X.font='bold 11px Arial, Helvetica, sans-serif';X.textAlign='center';X.textBaseline='middle';X.shadowColor='#ff3a4a';X.shadowBlur=10;X.fillStyle='#ff6a76';X.fillText('VACANCY',x,y);X.shadowBlur=0;X.fillStyle='#ffd0d4';X.fillText('VACANCY',x,y)}finally{X.restore()}}
// ----- the gas station -----
function ubCanopy(q,w,h,K,t){const fh=22,R=(c,x,y,a,b)=>{q.fillStyle=c;q.fillRect(x,y,a,b)};R(UBP.o,0,0,w,h);R('#c8c8c0',1,1,w-2,h-fh-1);for(let x=1;x<w-2;x+=30)R('#b4b4ac',x,1,1,h-fh-1);for(let y=20;y<h-fh;y+=40)R('#b4b4ac',1,y,w-2,1);
 // stains, a sagging corner, a missing panel showing the beams
 for(let i=0;i<14;i++){q.fillStyle='rgba(90,80,60,.22)';q.beginPath();q.ellipse(20+cmH(i,w,1)*(w-40),14+cmH(i,h,2)*(h-fh-28),8+i%4*6,4+i%3*3,0,0,7);q.fill()}
 const mx=w*.62,my=h*.3;R('#26262c',mx,my,60,40);for(let x=mx+8;x<mx+60;x+=14)R('#5a5e66',x,my,3,40);R('#3a3a42',mx,my+18,60,3);R(UBP.o,mx-1,my-1,62,2);R('rgba(0,0,0,.25)',mx,my+40,60,3);
 R('#8a8f96',w*.18,h*.4,26,10);R('#a8acb4',w*.18,h*.4,26,2);
 // the fascia all round, the brand stripe, the name with letters missing
 R(UBP.o,0,h-fh,w,fh);R('#e8e4dc',1,h-fh+1,w-2,fh-2);R(K.b,1,h-fh+5,w-2,8);R(K.l,1,h-fh+5,w-2,2);R(K.b,1,1,w-2,6);R(K.b,1,1,6,h-2);R(K.b,w-7,1,6,h-2);
 const s=String(t||'GAS & GO').toUpperCase();kpText(q,s,w/2,h-fh/2,w*.4,13,'#16111c');q.fillStyle='rgba(20,20,20,.3)';for(let x=10;x<w;x+=6+Math.floor(cmH(x,4,3)*10))q.fillRect(x,h-fh+1,2,4+cmH(x,5,3)*10)}
function ubIsland(q,v){const W=124;R_(q,'rgba(0,0,0,.25)',6,46,116,10);R_(q,UBP.o,3,30,118,22);R_(q,UBP.cnd,4,44,116,7);R_(q,UBP.cn,4,31,116,13);R_(q,UBP.cnl,4,31,116,2);for(const x of[4,114]){R_(q,UBP.o,x,20,6,30);R_(q,'#e0b030',x+1,21,4,28);R_(q,UBP.o,x+1,28,4,3)}
 const pump=(x,br)=>{if(br){q.save();q.translate(x+12,42);q.rotate(1.35);q.translate(-x-12,-42)}R_(q,UBP.o,x,6,24,38);R_(q,'#c0392b',x+1,7,22,36);R_(q,'#e05a4a',x+1,7,22,3);R_(q,'#e8e4dc',x+3,12,18,10);R_(q,br?'#2a2a30':'#3a4a3a',x+5,14,14,6);if(br){q.strokeStyle='#c8ccd4';q.lineWidth=1;q.beginPath();q.moveTo(x+6,15);q.lineTo(x+16,19);q.stroke()}
  for(let k=0;k<3;k++)R_(q,['#3a8a5a','#e0b030','#2f6fd0'][k],x+4+k*6,26,4,3);R_(q,UBP.o,x+22,14,4,12);R_(q,'#3a3a42',x+23,15,2,10);if(br){q.restore();q.strokeStyle=UBP.o;q.lineWidth=2;q.beginPath();q.moveTo(x+26,30);q.lineTo(x+34,44);q.stroke()}else{q.strokeStyle=UBP.o;q.lineWidth=2;q.beginPath();q.moveTo(x+24,26);q.quadraticCurveTo(x+32,36,x+26,42);q.stroke()}};
 pump(20,0);pump(70,v>=.5);R_(q,UBP.o,52,22,12,22);R_(q,'#2f5aa8',53,23,10,20);R_(q,'#4a7ac8',53,23,10,2);R_(q,'#8a8f96',55,18,2,6)}
// ----- the salvage yard -----
function ubCrush(q,K,v){R_(q,'rgba(0,0,0,.25)',6,40,56,8);R_(q,UBP.o,3,3,58,42);R_(q,K.b,4,4,56,18);R_(q,K.dd,4,22,56,22);for(let y=24;y<44;y+=4){R_(q,y%8?K.d:K.b,4,y,56,2);R_(q,'rgba(0,0,0,.3)',4+cmH(y,v*5,1)*40,y,8,2)}
 for(let i=0;i<8;i++){R_(q,i%2?'#3a5a7a':'#c8ccd4',6+cmH(i,v*3,2)*48,24+cmH(i,v*3,3)*16,4+i%3*3,2)}R_(q,K.l,4,4,56,2);for(let i=0;i<6;i++){q.fillStyle='rgba(130,70,30,.5)';q.fillRect(6+cmH(i,v*7,4)*50,6+cmH(i,v*7,5)*14,4,3)}R_(q,'#2a2a30',8,8,10,6);R_(q,'#3a5a7a',30,8,16,5)}
function ubStack(q,v){const C=['#8a2a22','#2f4a7a','#3a5a3a','#8a8f96','#c8b48a','#26262c','#6a4a8a'];q.fillStyle='rgba(0,0,0,.28)';q.beginPath();q.ellipse(62,96,56,8,0,0,7);q.fill();
 for(let k=0;k<4;k++){const y=80-k*18,dx=(cmH(k,v*9,1)-.5)*10,c=pcK(C[Math.floor(cmH(k,v*9,2)*C.length)]),x=10+dx;R_(q,UBP.o,x-1,y-1,102,20);R_(q,c.d,x,y,100,18);R_(q,c.b,x,y,100,6);R_(q,'#2a2a30',x+20,y+7,26,5);R_(q,'#3a5a7a',x+52,y+7,22,5);for(let i=0;i<5;i++)R_(q,'rgba(120,60,30,.5)',x+cmH(i,k,3)*94,y+2+cmH(i,k,4)*14,4,2);R_(q,'#c8ccd4',x+2,y+12,6,3);R_(q,'#c8ccd4',x+92,y+12,6,3)}
 const c=pcK(C[Math.floor(v*7)%7]),x=12;R_(q,UBP.o,x-1,8,100,20);R_(q,c.b,x,9,98,18);R_(q,c.l,x,9,98,3);R_(q,'#2a3a4a',x+28,12,40,12);R_(q,'#3a5a7a',x+30,13,36,4);for(let i=0;i<6;i++)R_(q,'rgba(120,60,30,.45)',x+cmH(i,9,5)*90,10+cmH(i,9,6)*14,5,3)}
function ubGrapple(q){R_(q,'rgba(0,0,0,.28)',30,134,140,18);
 // tracks and the turntable
 for(const y of[100,136]){R_(q,UBP.o,34,y-4,132,18);R_(q,'#2a2a30',35,y-3,130,16);for(let x=38;x<164;x+=7)R_(q,'#4a4a52',x,y-3,4,16)}R_(q,'#3a3a42',50,110,100,26);
 // the cab and engine house, yellow gone to rust
 R_(q,UBP.o,52,62,96,58);R_(q,'#c8981e',53,63,94,56);R_(q,'#e0b030',53,63,94,4);for(let i=0;i<10;i++){q.fillStyle='rgba(120,60,20,.5)';q.fillRect(56+cmH(i,1,1)*84,66+cmH(i,2,1)*48,4+i%3*3,3)}
 R_(q,UBP.o,108,44,38,40);R_(q,'#c8981e',109,45,36,38);R_(q,'#2a3a4a',113,50,28,18);R_(q,'#4a6a8a',114,51,12,6);R_(q,'#3a3a42',58,70,40,12);for(let x=60;x<96;x+=5)R_(q,'#26262c',x,70,2,12);R_(q,UBP.o,100,46,4,20);R_(q,'#3a3a42',101,40,2,8);
 // the boom and stick, the grapple hanging open
 q.lineCap='round';const arm=(w,c,P)=>{q.strokeStyle=c;q.lineWidth=w;q.beginPath();q.moveTo(P[0][0],P[0][1]);for(const p of P.slice(1))q.lineTo(p[0],p[1]);q.stroke()};arm(14,UBP.o,[[86,70],[58,18],[22,30]]);arm(11,'#c8981e',[[86,70],[58,18],[22,30]]);arm(3,'#e0b030',[[84,64],[58,14]]);arm(4,'#3a3a42',[[76,52],[56,30]]);q.lineCap='butt';
 R_(q,UBP.o,16,28,12,12);R_(q,'#3a3a42',17,29,10,10);for(let k=0;k<5;k++){const a=Math.PI/2+(k-2)*.45;q.strokeStyle=UBP.o;q.lineWidth=5;q.beginPath();q.moveTo(22,40);q.quadraticCurveTo(22+Math.cos(a)*20,40+Math.sin(a)*8,22+Math.cos(a)*14,40+Math.sin(a)*24);q.stroke();q.strokeStyle='#5a5e66';q.lineWidth=3;q.stroke()}}
function ubOffice(q,w,h,t){const fh=36,rh=h-fh-8;R_(q,'rgba(0,0,0,.25)',6,h-8,w-6,8);R_(q,UBP.o,2,2,w-4,h-10);R_(q,'#d8d4c8',3,3,w-6,rh);for(let x=3;x<w-4;x+=8)R_(q,'#c4c0b4',x,3,2,rh);
 for(let i=0;i<10;i++){q.fillStyle='rgba(140,80,40,.35)';q.fillRect(8+cmH(i,w,1)*(w-20),4,3,4+cmH(i,h,2)*(rh-6))}R_(q,'#b8b4a8',w*.6,8,30,18);R_(q,'#8a8678',w*.6+2,10,26,2);R_(q,'#8a8678',w*.6+2,16,26,2);
 R_(q,UBP.o,2,rh+2,w-4,fh);R_(q,'#e8e4dc',3,rh+3,w-6,fh-2);for(let x=3;x<w-4;x+=5)R_(q,'#d0ccc0',x,rh+3,1,fh-2);R_(q,'#3a6a9a',3,rh+3,w-6,3);
 for(const x of[16,58,w-60]){R_(q,UBP.o,x,rh+9,30,16);R_(q,'#3a4a5a',x+1,rh+10,28,14);R_(q,'#5a7a9a',x+2,rh+11,10,5);R_(q,'#8a6a3a',x+1,rh+10,28,3)}R_(q,UBP.o,w/2-12,rh+7,22,fh-6);R_(q,'#8a8f96',w/2-11,rh+8,20,fh-8);kpCirc(q,'#2a2a30',w/2+5,rh+22,1.5);
 R_(q,UBP.o,w/2-20,h-12,38,6);R_(q,'#9a7448',w/2-19,h-11,36,4);R_(q,UBP.o,w/2-17,h-8,32,6);R_(q,'#b08a58',w/2-16,h-7,30,4);
 R_(q,UBP.o,w/2+20,rh+6,52,12);R_(q,'#f4f0e4',w/2+21,rh+7,50,10);kpText(q,String(t||'OFFICE').toUpperCase().split('|')[0],w/2+46,rh+12.5,46,8,'#c0392b')}
Object.assign(OB,{
// junk: a stained mattress (var 0.5 and up: torn, springs showing), a fridge on its back, a washer (var 0.5 and up: a dryer),
// a shopping cart full of someone's things (var 0.5 and up: tipped over), a pile of tires, an overflowing dumpster (*colour*)
mattress:ob(72,44,0,(q,v)=>ubMatt(q,+v||0)),
fridgex:ob(62,36,[56,24],(q,v)=>ubFridge(q,+v||0)),
washer:ob(38,46,[34,22],(q,v)=>ubWasher(q,+v||0)),
cartjunk:ob(48,46,[38,20],(q,v)=>ubCart(q,+v||0)),
tiremtn:Object.assign(ob(130,90,[118,52],q=>ubTires(q,130,90)),{wb:1}),
dumpo:obc(84,60,[78,30],UBDUMP,(q,v,K)=>ubDump(q,K,+v||0)),
// holdouts: plywood sheets with spray paint (12, "LINE|LINE"; var 0.5 and up: black paint), a furniture barricade, a yard sign (16; *colour*)
plywood:{w:52,h:62,c:[46,10],txt:16,dt:"WE'RE|ALIVE",f:(g,x,y,v,c,t)=>S2(g,x,y,52,62,q=>ubPly(q,+v||0,t))},
furnpile:Object.assign(ob(140,80,[132,40],q=>ubBarr(q,140,80)),{wb:1}),
yardsign:{w:48,h:46,c:[8,6],txt:14,dt:'FOR SALE',pc:UBSIGN,f:(g,x,y,v,c,t)=>S2(g,x,y,48,46,q=>ubYard(q,t,pcK(pcCol(c,UBSIGN))))},
// homes: a window AC unit, a satellite dish, a kiddie pool (var 0.5 and up: dried out), a clothesline with washing
acwin:ob(36,28,[32,10],(q,v)=>ubAC(q,+v||0)),
satdish:ob(36,40,[12,8],q=>ubSat(q)),
kpool:ob(72,46,0,(q,v)=>ubKPool(q,+v||0)),
clothesl:ob(150,70,0,q=>ubLine(q,150)),
// the underpass camp: a tarp lean-to (*colour*)
tarpshel:obc(116,84,[104,40],UBTARP,(q,v,K)=>ubTarp(q,K)),
// the street: cobra-head street lights (lit, failing, dead; the arm reaches right), a payphone (var 0.5 and up: smashed), an electrical cabinet
cobra:Object.assign(ob(150,112,[12,10],q=>ubCobra(q,0)),{wb:1,nr:1,lt:[{dx:58,dy:-100,r:160,i:.95,c:'#ffe2b0'}]}),
cobraf:Object.assign(ob(150,112,[12,10],q=>ubCobra(q,1)),{wb:1,nr:1,lt:[{dx:58,dy:-100,r:160,i:.95,c:'#ffe2b0',f:'fault'}]}),
cobrax:Object.assign(ob(150,112,[12,10],q=>ubCobra(q,2)),{wb:1,nr:1}),
payphone:Object.assign(ob(32,64,[16,10],(q,v)=>ubPhone(q,+v||0)),{wb:1}),
utilbox:ob(36,44,[32,18],(q,v)=>ubUtil(q,+v||0)),
// the motel's pole sign (16, "MOTEL|LINE"; *colour*), its VACANCY flickering in red neon (tall)
motelsign:{w:120,h:180,c:[44,14],txt:16,dt:'MOTEL',pc:UBSIGN,wb:1,nr:1,f:(g,x,y,v,c,t)=>S2(g,x,y,120,180,q=>ubMotel(q,pcK(pcCol(c,UBSIGN)),t)),an:ubMotelAn,lt:[{dx:0,dy:-61,r:90,i:.8,c:'#ff4a5a',f:'fault'}]},
// the gas station: the canopy over the pumps (16, its name; *colour*; hangs over people and fades under it), a pump island (var 0.5 and up: one pump knocked down)
gcanopy:{w:330,h:210,c:0,ov:1,ovf:1,ova:.22,sw:320,swh:200,txt:16,dt:'GAS & GO',pc:UBCAN,f:(g,x,y,v,c,t)=>S2(g,x,y,330,210,q=>ubCanopy(q,330,210,pcK(pcCol(c,UBCAN)),t))},
gpump:ob(124,56,[118,26],(q,v)=>ubIsland(q,+v||0)),
// the salvage yard: a crushed car (*colour*), a stack of crushed cars (tall), a grapple loader (tall), the office trailer (16, its sign)
crushcar:obc(64,48,[58,30],UBCAR,(q,v,K)=>ubCrush(q,K,+v||0)),
carstack:Object.assign(ob(124,104,[112,52],(q,v)=>ubStack(q,+v||0)),{wb:1}),
grapple:Object.assign(ob(190,160,[134,58],q=>ubGrapple(q)),{wb:1}),
officetrl:{w:210,h:110,c:[204,66],txt:16,dt:'OFFICE',f:(g,x,y,v,c,t)=>S2(g,x,y,210,110,q=>ubOffice(q,210,110,t))}});
