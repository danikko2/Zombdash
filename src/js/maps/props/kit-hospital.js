//# maps/props/kit-hospital.js — Kit props for Zombville General Hospital: the lobby (the information desk, the admissions desk, waiting seats, lounge chairs, big planters, the directory board, check-in kiosks), the surgery center (operating tables, surgical lights hanging over people, anesthesia machines, instrument tables, scrub sinks, sterile racks), patient care (beds, overbed tables, recliners, the nurse station, ventilators, vitals monitors with a live trace, linen carts), radiology (MRI, CT, light boxes), the lab, the pharmacy, the morgue (cold drawers, the autopsy table), the cafeteria (serving line, coffee bar, drinks station, tray rack), the kitchen (prep tables, the pot rack over people, the dishwasher, meal carts), the gift shop (shelves, balloons that bob, card spinner), the little things on the walls (fire extinguisher cabinets, AEDs, sanitizer, door plates), wet floor signs, quarantine signs; and on the roof the air handlers, exhaust fans, vents, the antenna with its red light, a windsock, the big rooftop sign and the military helicopter
// ---------- Zombville General's pieces ----------
const HSP={o:'#16111c',w:'#f2f2ee',wl:'#ffffff',wd:'#d4d6d8',wdd:'#a8acb2',st:'#c8ccd4',stl:'#e4e8ee',std:'#8a8f96',sk:'#5a5e68',sk2:'#3a3d46',bl:'#2f6fd0',bll:'#5a92e8',tl:'#2aa8a0',tll:'#5ad0c8',gr:'#3aa05a',rd:'#c8281e',rdl:'#e8483a',yl:'#f0c419',wo:'#b88a5a',wol:'#d4a874',wod:'#8a6038',scr:'#0a1e2a',scg:'#6aff9a',scb:'#7ad8ff'};
const HSSEAT=[['#2f6fd0','Blue'],['#2aa8a0','Teal'],['#e08a30','Orange'],['#7a7f88','Grey'],['#8a3a6a','Plum']];
const HSBLK=[['#8ab4e8','Blue'],['#e8e4dc','White'],['#9ad0b0','Mint'],['#e8b8c8','Pink'],['#e8d890','Yellow']];
function hsLine(q,c,w,P){q.strokeStyle=c;q.lineWidth=w;q.lineCap='round';q.beginPath();P.forEach((p,i)=>i?q.lineTo(p[0],p[1]):q.moveTo(p[0],p[1]));q.stroke();q.lineCap='butt'}
function hsEll(q,c,x,y,rx,ry){q.fillStyle=c;q.beginPath();q.ellipse(x,y,rx,ry,0,0,7);q.fill()}
// a red cross on white
function hsCross(q,x,y,s,c){const t=Math.max(2,Math.round(s*.32));R_(q,c||HSP.rd,x-t/2,y-s/2,t,s);R_(q,c||HSP.rd,x-s/2,y-t/2,s,t)}
// a computer monitor seen from the front, a little high: frame, screen (k: 0 dark, 1 on), stand
function hsMon(q,x,y,w,h,k){R_(q,HSP.o,x-1,y-1,w+2,h+2);R_(q,'#2a2c32',x,y,w,h);R_(q,k?'#1a3a5a':'#14161c',x+1,y+1,w-2,h-3);if(k){R_(q,'#7ad8ff',x+2,y+2,w-4,1);R_(q,'#5a9ac8',x+2,y+4,Math.max(1,w-7),1)}R_(q,HSP.sk,x+w/2-1,y+h,2,3);R_(q,HSP.sk2,x+w/2-4,y+h+2,8,2)}
// stainless steel: a box with a bright top edge and brushed streaks
function hsSteel(q,x,y,w,h){R_(q,HSP.o,x-1,y-1,w+2,h+2);R_(q,HSP.st,x,y,w,h);R_(q,HSP.stl,x,y,w,2);for(let k=x+4;k<x+w-2;k+=9)R_(q,'rgba(255,255,255,.25)',k,y+3,1,Math.max(0,h-5));R_(q,HSP.std,x,y+h-2,w,2)}
// a countertop seen from a little above: top surface (depth d), front panel (height f)
function hsCounter(q,x,y,w,d,f,top,front,edge){R_(q,HSP.o,x-1,y-1,w+2,d+f+2);R_(q,top,x,y,w,d);R_(q,'rgba(255,255,255,.35)',x,y,w,1);R_(q,front,x,y+d,w,f);R_(q,edge||'rgba(0,0,0,.25)',x,y+d,w,2)}
// ===================== the lobby =====================
// the round information desk: a curved wood front, the white top, a monitor, a bell, a brochure stand, "INFORMATION" and the ? sign
function hsInfo(q,t){q.fillStyle='rgba(0,0,0,.25)';q.beginPath();q.ellipse(75,64,72,8,0,0,7);q.fill();
 q.fillStyle=HSP.o;q.beginPath();q.moveTo(4,30);q.quadraticCurveTo(75,10,146,30);q.lineTo(146,58);q.quadraticCurveTo(75,74,4,58);q.closePath();q.fill();
 q.fillStyle=HSP.wo;q.beginPath();q.moveTo(5,36);q.quadraticCurveTo(75,20,145,36);q.lineTo(145,57);q.quadraticCurveTo(75,72,5,57);q.closePath();q.fill();
 for(let i=0;i<9;i++){const x=16+i*15;R_(q,HSP.wod,x,34-Math.sin(i/8*Math.PI)*10+8,2,24)}
 q.fillStyle=HSP.w;q.beginPath();q.moveTo(3,30);q.quadraticCurveTo(75,8,147,30);q.lineTo(147,36);q.quadraticCurveTo(75,16,3,36);q.closePath();q.fill();q.fillStyle=HSP.wdd;q.beginPath();q.moveTo(3,35);q.quadraticCurveTo(75,15,147,35);q.lineTo(147,37);q.quadraticCurveTo(75,17,3,37);q.closePath();q.fill();
 hsMon(q,36,8,22,14,1);hsMon(q,96,8,22,14,0);kpCirc(q,HSP.o,76,20,4);kpCirc(q,'#d8b04a',76,19,3);R_(q,'#e8e8e4',118,14,12,8);R_(q,'#7ab8e8',119,15,4,6);R_(q,'#e8a060',124,15,4,6);
 R_(q,HSP.o,51,44,48,11);R_(q,HSP.bl,52,45,46,9);kpText(q,(cmTxt(t,14)||'INFORMATION').toUpperCase(),75,50,44,7,'#fff');kpCirc(q,HSP.o,75,62,6);kpCirc(q,HSP.bl,75,62,5);kpText(q,'?',75,62,8,8,'#fff')}
// the admissions desk: a long counter with three stations, glass partitions, monitors, numbers, the sign along the front
function hsAdm(q,t){R_(q,'rgba(0,0,0,.25)',6,66,250,8);hsCounter(q,4,26,252,10,34,HSP.w,'#3a6a8a');R_(q,'#2f5a78',4,46,252,2);
 for(let i=0;i<3;i++){const x=12+i*84;R_(q,'rgba(160,210,240,.55)',x+70,4,3,24);R_(q,HSP.o,x+69,26,5,3);hsMon(q,x+18,10,22,14,i!=1);R_(q,'#e8e8e4',x+46,20,14,6);R_(q,HSP.o,x+4,14,12,12);R_(q,HSP.yl,x+5,15,10,10);kpText(q,''+(i+1),x+10,20,8,8,HSP.o);R_(q,'#c8a070',x+44,27,20,4)}
 R_(q,HSP.o,70,36,120,14);R_(q,'#1f4a68',71,37,118,12);kpText(q,(cmTxt(t,16)||'ADMISSIONS').toUpperCase(),130,43,112,8,'#e8f4ff')}
// a row of waiting-room seats on a steel beam (*colour*); var: one seat knocked over
function hsSeats(q,K,n,v){const w=26;R_(q,'rgba(0,0,0,.25)',4,40,n*w+4,6);R_(q,HSP.o,4,30,n*w+4,6);R_(q,HSP.std,5,31,n*w+2,4);for(const x of[10,n*w-6])R_(q,HSP.o,x,34,6,10),R_(q,HSP.sk,x+1,34,4,9);
 for(let i=0;i<n;i++){const x=6+i*w;if(v>=.5&&i==n-1)continue;R_(q,HSP.o,x,4,w-2,30);R_(q,K.d,x+1,5,w-4,14);R_(q,K.b,x+1,5,w-4,4);R_(q,K.b,x+1,20,w-4,12);R_(q,K.l,x+1,20,w-4,3);R_(q,HSP.sk,x+w-4,8,2,20)}}
// a lobby lounge chair, modern, low (*colour*)
function hsLounge(q,K){R_(q,'rgba(0,0,0,.25)',4,48,84,6);R_(q,HSP.o,4,8,84,42);R_(q,K.d,5,9,82,16);R_(q,K.b,5,9,82,4);for(const x of[5,77])R_(q,K.d,x,12,10,36);R_(q,K.b,15,26,62,20);R_(q,K.l,15,26,62,4);R_(q,K.d,45,27,2,18);R_(q,HSP.sk2,10,48,4,4);R_(q,HSP.sk2,78,48,4,4)}
// a low coffee table with magazines
function hsCtab(q){R_(q,'rgba(0,0,0,.25)',3,26,48,5);hsCounter(q,3,6,46,14,6,'#c8a878','#8a6a48');R_(q,'#e85a5a',10,8,12,8);R_(q,'#5a9ae8',26,9,11,8);R_(q,'#fff',12,10,8,1);R_(q,HSP.o,6,26,3,4);R_(q,HSP.o,43,26,3,4)}
// a big lobby planter: a concrete box, palms and leafy plants seen a little from above
function hsPlanter(q,v){R_(q,'rgba(0,0,0,.25)',4,68,92,7);R_(q,HSP.o,4,40,92,30);R_(q,'#b8b4aa',5,41,90,8);R_(q,'#9a968c',5,49,90,20);R_(q,'#d0ccc2',5,41,90,2);R_(q,'#4a3a2a',8,43,84,5);
 const leaf=(x,y,a,l,c)=>{q.save();q.translate(x,y);q.rotate(a);q.fillStyle=HSP.o;q.beginPath();q.ellipse(l/2,0,l/2+1,5,0,0,7);q.fill();q.fillStyle=c;q.beginPath();q.ellipse(l/2,0,l/2,4,0,0,7);q.fill();q.fillStyle='rgba(255,255,255,.18)';q.fillRect(2,-1,l-4,1);q.restore()};
 const G=['#2a7a3a','#3a9a4a','#4ab05a','#2a6a32'];for(let i=0;i<14;i++){const a=-Math.PI*(.05+.9*cmH(i,v*7,2)),x=20+cmH(i,v*7,3)*60;leaf(x,44,a,22+cmH(i,v*7,4)*22,G[i%4])}
 if(v>=.5){R_(q,HSP.o,47,10,5,36);R_(q,'#8a6a3a',48,10,3,36);for(let i=0;i<7;i++)leaf(50,12,-Math.PI*(.08+i*.14),30,G[i%3+1])}}
// the directory board: department names in their colours (title: your text)
function hsDirb(q,t){R_(q,'rgba(0,0,0,.25)',14,112,62,6);R_(q,HSP.o,40,96,10,18);R_(q,HSP.sk,41,96,8,18);R_(q,HSP.o,4,4,82,94);R_(q,'#2a3a4a',5,5,80,92);R_(q,'#1a6a9a',5,5,80,16);kpText(q,(cmTxt(t,14)||'DIRECTORY').toUpperCase(),45,13,74,8,'#fff');
 const D=[['SURGERY','#5a92e8','←'],['PATIENT CARE','#5ad07a','→'],['EMERGENCY','#e85a4a','↘'],['RADIOLOGY','#c87ae8','↑'],['LAB · PHARMACY','#e8c44a','↑'],['CAFETERIA','#e89a4a','↙'],['CHAPEL','#e8e4dc','↙']];
 D.forEach(([n,c,a],i)=>{const y=26+i*10;R_(q,c,9,y,4,6);kpText(q,n,44,y+3,56,6,'#e8eef4');kpText(q,a,78,y+3,8,7,c)})}
// a check-in kiosk: a pedestal with a touch screen
function hsKiosk(q){R_(q,'rgba(0,0,0,.25)',4,56,28,5);R_(q,HSP.o,10,28,16,30);R_(q,HSP.w,11,29,14,28);R_(q,HSP.wdd,11,52,14,4);R_(q,HSP.o,3,4,30,26);R_(q,HSP.w,4,5,28,24);R_(q,'#1a3a5a',7,8,22,15);R_(q,'#7ad8ff',9,10,18,2);R_(q,'#5ad07a',9,15,8,5);R_(q,'#e8e8e4',19,15,8,5);R_(q,'#3a3d46',12,25,12,2)}
// ===================== the little things =====================
function hsWet(q){R_(q,'rgba(0,0,0,.2)',3,30,20,4);q.fillStyle=HSP.o;q.beginPath();q.moveTo(12,1);q.lineTo(23,32);q.lineTo(1,32);q.closePath();q.fill();q.fillStyle=HSP.yl;q.beginPath();q.moveTo(12,3);q.lineTo(21,31);q.lineTo(3,31);q.closePath();q.fill();
 R_(q,'#c89a0a',3,28,18,3);q.fillStyle=HSP.o;q.beginPath();q.moveTo(12,11);q.lineTo(17,21);q.lineTo(7,21);q.closePath();q.fill();R_(q,HSP.yl,11,14,2,4);R_(q,HSP.yl,11,19,2,1)}
function hsFext(q){R_(q,HSP.o,1,1,20,32);R_(q,HSP.rd,2,2,18,30);R_(q,'rgba(220,240,255,.5)',4,4,14,22);R_(q,HSP.rdl,7,8,8,17);R_(q,'#2a2a2a',9,5,4,4);R_(q,'#fff',4,27,14,3)}
function hsAed(q){R_(q,HSP.o,1,1,20,26);R_(q,'#e8e8e4',2,2,18,24);R_(q,'#2aa860',2,2,18,7);kpText(q,'AED',11,6,16,5,'#fff');q.fillStyle='#e8402a';q.beginPath();q.moveTo(11,22);q.bezierCurveTo(3,16,6,10,11,14);q.bezierCurveTo(16,10,19,16,11,22);q.fill();hsLine(q,'#fff',1,[[6,16],[9,16],[10,13],[12,19],[13,16],[16,16]])}
function hsSanit(q){R_(q,HSP.o,1,1,12,24);R_(q,'#e8e8e4',2,2,10,22);R_(q,'#7ab8e8',3,10,8,8);R_(q,'#fff',4,11,2,6);R_(q,HSP.sk,4,20,6,3)}
function hsTrash(q,v){R_(q,'rgba(0,0,0,.2)',2,30,26,4);R_(q,HSP.o,3,6,22,26);R_(q,v>=.5?'#c8281e':'#8a8f96',4,7,20,24);R_(q,v>=.5?'#e8483a':'#b8bcc4',4,7,20,3);R_(q,HSP.o,2,3,24,5);R_(q,v>=.5?'#a81e16':'#6a6e76',3,4,22,3);R_(q,HSP.sk2,10,29,8,3);if(v>=.5){R_(q,'#fff',9,14,10,9);R_(q,'#e8483a',11,16,6,5)}}
// a small door plate (your text): ROOM, OR 2, ICU...
function hsPlate(q,t){R_(q,HSP.o,0,0,46,14);R_(q,'#e8eef2',1,1,44,12);R_(q,'#2f6fd0',1,1,4,12);kpText(q,(cmTxt(t,10)||'ROOM').toUpperCase(),26,7,38,7,'#1a2a3a')}
// a quarantine sign on a stand (your text)
function hsQsign(q,t){R_(q,'rgba(0,0,0,.25)',6,72,56,5);for(const x of[12,52])R_(q,HSP.o,x,40,4,34),R_(q,HSP.sk,x+1,40,2,34);R_(q,HSP.o,2,2,64,42);R_(q,HSP.yl,3,3,62,40);for(let x=-40;x<62;x+=10){q.fillStyle=HSP.o;q.beginPath();q.moveTo(3+x,43);q.lineTo(8+x,43);q.lineTo(18+x,33);q.lineTo(13+x,33);q.fill()}
 R_(q,HSP.yl,3,33,62,1);kpCirc(q,HSP.o,34,15,8);kpCirc(q,HSP.yl,34,15,6);kpCirc(q,HSP.o,34,15,2);for(let k=0;k<3;k++){const a=k*2.094-1.57;kpCirc(q,HSP.o,34+Math.cos(a)*7,15+Math.sin(a)*7,3)}
 const T=(cmTxt(t,18)||'QUARANTINE').toUpperCase();kpText(q,T,34,28,58,7,HSP.o)}
// ===================== the surgery center =====================
// the operating table: a padded top on a column, arm boards out to the sides, a sheet; var .5+: blood on it
function hsORt(q,v){R_(q,'rgba(0,0,0,.25)',14,90,44,8);R_(q,HSP.o,30,62,12,30);R_(q,HSP.std,31,62,10,28);R_(q,HSP.o,18,86,36,8);R_(q,HSP.sk,19,87,34,6);
 for(const y of[40]){R_(q,HSP.o,0,y,72,10);R_(q,'#2a2c34',1,y+1,70,8);R_(q,'#4a4c56',1,y+1,70,2)}
 R_(q,HSP.o,18,2,36,66);R_(q,'#2a2c34',19,3,34,64);R_(q,'#3a3d48',19,3,34,6);R_(q,'#4a6a9a',21,12,30,50);R_(q,'#6a8ab8',21,12,30,4);for(const y of[24,36,48])R_(q,'#3a5a8a',21,y,30,1);R_(q,HSP.w,23,5,26,6);
 if(v>=.5){q.fillStyle='rgba(120,10,16,.85)';q.beginPath();q.ellipse(36,36,9,6,.3,0,7);q.fill();q.beginPath();q.ellipse(44,48,4,7,0,0,7);q.fill();R_(q,'rgba(120,10,16,.85)',44,52,3,14)}}
// the surgical light: twin dome heads on jointed arms from the ceiling (overhead: drawn over people)
function hsORlight(q){R_(q,HSP.o,62,0,16,10);R_(q,HSP.std,63,1,14,8);hsLine(q,HSP.o,7,[[70,8],[38,26],[30,52]]);hsLine(q,HSP.stl,4,[[70,8],[38,26],[30,52]]);hsLine(q,HSP.o,7,[[70,8],[104,30],[112,58]]);hsLine(q,HSP.stl,4,[[70,8],[104,30],[112,58]]);
 for(const[x,y,r]of[[30,62,22],[112,66,18]]){kpCirc(q,HSP.o,x,y,r+1);kpCirc(q,'#d8dce2',x,y,r);kpCirc(q,'#eef4ff',x,y,r-4);for(let k=0;k<6;k++){const a=k*1.047;kpCirc(q,'#ffffff',x+Math.cos(a)*(r-9),y+Math.sin(a)*(r-9),3)}kpCirc(q,HSP.std,x,y,4)}}
// the anesthesia machine: a cart with monitors, flow meters, gas cylinders behind
function hsAnes(q){R_(q,'rgba(0,0,0,.25)',4,64,46,6);for(const[x,c]of[[6,'#3aa05a'],[14,'#e8e8e4'],[38,'#3a6ae8']])R_(q,HSP.o,x,6,8,40),R_(q,c,x+1,7,6,38),R_(q,'rgba(255,255,255,.3)',x+2,7,1,38);
 R_(q,HSP.o,4,22,44,44);R_(q,'#d8dce2',5,23,42,42);R_(q,'#b8bcc4',5,48,42,2);R_(q,'#b8bcc4',5,56,42,2);hsMon(q,8,4,36,20,1);for(let x=11;x<41;x+=3)R_(q,'#6aff9a',x,12+Math.round(Math.sin(x)*2),2,1);
 for(const x of[10,18,26])R_(q,HSP.o,x,27,5,16),R_(q,'#eef4ff',x+1,28,3,14),R_(q,'#3aa05a',x+1,36,3,2);R_(q,HSP.o,34,28,10,10);R_(q,'#2a2c34',35,29,8,8);R_(q,HSP.o,6,64,6,4);R_(q,HSP.o,40,64,6,4)}
// the mayo stand: a tray of instruments on a pole
function hsMayo(q,v){R_(q,'rgba(0,0,0,.2)',6,40,30,4);R_(q,HSP.o,18,14,4,28);R_(q,HSP.std,19,14,2,28);R_(q,HSP.o,8,38,26,5);hsSteel(q,3,4,34,12);R_(q,'#3a6ae8',4,5,32,3);for(let i=0;i<5;i++)R_(q,'#e8eef4',7+i*6,8,2,6);if(v>=.5)R_(q,'rgba(120,10,16,.8)',20,9,8,4)}
// the back table: blue drape, rows of instruments, basins
function hsBack(q,v){R_(q,'rgba(0,0,0,.25)',4,38,84,6);R_(q,HSP.o,6,22,4,18);R_(q,HSP.o,80,22,4,18);R_(q,HSP.o,2,2,86,26);R_(q,'#2f5ac8',3,3,84,24);R_(q,'#4a7ae8',3,3,84,3);R_(q,'#2a4aa8',3,22,84,5);
 for(let i=0;i<10;i++)R_(q,'#e8eef4',8+i*5,8,2,10);kpCirc(q,HSP.o,68,14,9);kpCirc(q,HSP.st,68,14,8);kpCirc(q,'#a8b0ba',68,14,5);if(v>=.5){R_(q,'rgba(120,10,16,.8)',30,10,12,6);kpCirc(q,'rgba(120,10,16,.7)',68,14,4)}}
// the scrub sink: a long steel trough on the wall, three taps with knee levers, the SCRUB sign
function hsScrub(q){R_(q,HSP.o,4,0,102,10);R_(q,'#e8eef2',5,1,100,8);kpText(q,'SURGICAL SCRUB',55,5,96,6,'#2a4a6a');hsSteel(q,2,12,106,18);R_(q,'#7a828c',6,15,98,10);R_(q,'#a8b0ba',6,15,98,2);
 for(const x of[22,55,88]){R_(q,HSP.o,x-2,10,4,8);R_(q,HSP.stl,x-1,10,2,7);R_(q,HSP.o,x-4,30,8,6);R_(q,HSP.sk,x-3,31,6,4)}R_(q,'rgba(0,0,0,.25)',4,38,102,5)}
// sterile supplies: a wire rack of blue-wrapped trays and peel packs
function hsSter(q,v){R_(q,'rgba(0,0,0,.25)',4,74,72,6);for(const x of[3,73])R_(q,HSP.o,x,2,4,74),R_(q,HSP.st,x+1,2,2,74);for(const y of[16,36,56,74]){R_(q,HSP.o,3,y,74,3);R_(q,HSP.stl,4,y,72,1)}
 for(let r=0;r<3;r++)for(let i=0;i<5;i++){if(cmH(r,i,v*9+1)<.2)continue;const x=8+i*13,y=4+r*20;R_(q,HSP.o,x,y,12,12);R_(q,i%2?'#3a6ae8':'#5a8ae8',x+1,y+1,10,11);R_(q,'#fff',x+3,y+5,6,2)}}
// ===================== patient care =====================
// the patient bed: rails, the raised head, a pillow, the blanket (*colour*); var: <.33 made, <.66 thrown back and empty, else a body under the sheet
function hsBed(q,K,v){R_(q,'rgba(0,0,0,.25)',6,96,52,7);R_(q,HSP.o,4,4,52,96);R_(q,'#c8ccd4',5,5,50,94);R_(q,HSP.o,4,2,52,10);R_(q,'#e8ecf0',5,3,50,8);R_(q,'#8a8f96',5,9,50,2);R_(q,HSP.o,6,92,48,8);R_(q,'#e8ecf0',7,93,46,6);
 R_(q,'#e8e8e4',8,12,44,82);R_(q,HSP.o,13,14,34,14);R_(q,'#f8f8f4',14,15,32,12);R_(q,'#d8d8d4',14,24,32,3);
 if(v<.33){R_(q,HSP.o,8,32,44,60);R_(q,K.b,9,33,42,58);R_(q,K.l,9,33,42,5);R_(q,'#f8f8f4',9,33,42,4);for(let y=44;y<90;y+=10)R_(q,K.d,9,y,42,1)}
 else if(v<.66){q.fillStyle=HSP.o;q.beginPath();q.moveTo(8,70);q.quadraticCurveTo(30,58,52,66);q.lineTo(52,92);q.lineTo(8,92);q.fill();q.fillStyle=K.b;q.beginPath();q.moveTo(9,71);q.quadraticCurveTo(30,60,51,67);q.lineTo(51,91);q.lineTo(9,91);q.fill();q.fillStyle=K.l;q.beginPath();q.moveTo(9,71);q.quadraticCurveTo(30,60,51,67);q.lineTo(51,70);q.quadraticCurveTo(30,64,9,74);q.fill();R_(q,'rgba(120,10,16,.6)',26,40,10,8)}
 else{q.fillStyle=HSP.o;q.beginPath();q.ellipse(30,22,10,9,0,0,7);q.fill();q.beginPath();q.moveTo(12,30);q.quadraticCurveTo(30,24,48,30);q.lineTo(46,88);q.lineTo(14,88);q.closePath();q.fill();q.fillStyle='#f0f0ea';q.beginPath();q.ellipse(30,22,9,8,0,0,7);q.fill();q.beginPath();q.moveTo(13,31);q.quadraticCurveTo(30,25,47,31);q.lineTo(45,87);q.lineTo(15,87);q.closePath();q.fill();R_(q,'#d8d8d2',29,32,2,54);kpCirc(q,'rgba(130,12,18,.75)',34,50,6);kpCirc(q,'rgba(130,12,18,.6)',27,66,4)}
 for(const x of[2,56])R_(q,HSP.o,x-1,30,4,40),R_(q,HSP.std,x,31,2,38);for(const[x,y]of[[6,98],[50,98]])R_(q,HSP.o,x,y,5,5)}
// the overbed table on its one leg
function hsOver(q){R_(q,'rgba(0,0,0,.2)',2,36,40,4);R_(q,HSP.o,4,10,6,28);R_(q,HSP.std,5,10,4,26);R_(q,HSP.o,2,34,30,4);R_(q,HSP.sk,3,35,28,2);hsCounter(q,2,2,40,9,4,'#d8c8a8','#a8987a');R_(q,'#e8e8e4',24,3,8,6);R_(q,'#7ab8e8',8,4,5,4)}
// a recliner for visitors (*colour*)
function hsRecl(q,K){R_(q,'rgba(0,0,0,.25)',4,40,40,5);R_(q,HSP.o,4,2,40,40);R_(q,K.d,5,3,38,20);R_(q,K.b,5,3,38,4);R_(q,K.d,5,8,8,32);R_(q,K.d,35,8,8,32);R_(q,K.b,13,22,22,16);R_(q,K.l,13,22,22,3);R_(q,HSP.sk2,8,40,4,3);R_(q,HSP.sk2,36,40,4,3)}
// the nurse station: a U of counters with a raised ledge, monitors, a phone, charts, the call board; its name along the front (your text)
function hsNurse(q,t){R_(q,'rgba(0,0,0,.25)',6,74,192,7);hsCounter(q,4,30,192,12,32,HSP.w,'#5a8a9a');R_(q,'#4a7a8a',4,52,192,2);R_(q,HSP.o,4,22,192,10);R_(q,'#e8ecf0',5,23,190,8);
 for(const x of[18,64,120,164]){hsMon(q,x,4,22,15,x!=120);R_(q,'#e8e8e4',x+26,10,10,12);R_(q,'#c8a070',x+27,12,8,1);R_(q,'#c8a070',x+27,15,8,1)}R_(q,HSP.o,98,12,12,8);R_(q,'#2a2c34',99,13,10,6);
 R_(q,HSP.o,60,40,84,14);R_(q,'#2a5a6a',61,41,82,12);kpText(q,(cmTxt(t,14)||'NURSES STATION').toUpperCase(),102,47,78,7,'#e8f8ff');for(let i=0;i<8;i++)R_(q,i==2||i==5?'#ff3a2a':'#3a5a4a',14+i*5,44,3,3)}
// a ventilator: a cart with a screen and the hoses
function hsVent(q){R_(q,'rgba(0,0,0,.25)',4,56,28,5);R_(q,HSP.o,6,22,24,36);R_(q,'#e8ecf0',7,23,22,34);R_(q,'#c8ccd4',7,44,22,2);hsMon(q,4,2,28,18,1);for(let x=7;x<29;x+=2)R_(q,'#ffd84a',x,12+Math.round(Math.sin(x*.7)*3),1,1);hsLine(q,'#d8e8f8',3,[[28,30],[34,40],[30,52]]);hsLine(q,'#d8e8f8',3,[[28,34],[36,46]]);R_(q,HSP.o,8,56,5,4);R_(q,HSP.o,24,56,5,4)}
// the vitals monitor on a rolling stand: its trace moves (an)
function hsVitals(q){R_(q,'rgba(0,0,0,.2)',2,66,26,4);R_(q,HSP.o,13,22,4,44);R_(q,HSP.std,14,22,2,44);R_(q,HSP.o,4,62,22,5);R_(q,HSP.sk,5,63,20,3);R_(q,HSP.o,0,0,30,24);R_(q,'#3a3d46',1,1,28,22);R_(q,'#06120e',3,3,24,17)}
function hsVitalsAn(o,t){const x0=o.x-12,y0=o.y-67,ph=cmR(o,0,71)*7,u=(t*.8+ph)%1;X.save();X.beginPath();X.rect(x0,y0,24,17);X.clip();X.strokeStyle='#6aff9a';X.lineWidth=1;X.beginPath();
 for(let i=0;i<=24;i++){const k=((i/24)+1-u)%1,b=k>.42&&k<.5?(k<.45?-6:5):0;i?X.lineTo(x0+i,y0+9+b):X.moveTo(x0+i,y0+9+b)}X.stroke();X.fillStyle='#000';X.globalAlpha=.6;X.fillRect(x0+Math.round(u*24),y0,3,17);X.restore();X.globalAlpha=1}
// a linen cart (clean white sheets) or the hamper for the dirty ones (var .5+)
function hsLinen(q,v){R_(q,'rgba(0,0,0,.25)',3,52,40,5);R_(q,HSP.o,3,6,38,46);R_(q,HSP.st,4,7,36,44);R_(q,HSP.std,4,7,36,2);if(v<.5){for(let y=10;y<48;y+=9){R_(q,'#f8f8f4',6,y,32,7);R_(q,'#d8d8d2',6,y+6,32,1)}R_(q,'#8ab4e8',6,28,32,7)}
 else{R_(q,'#3a6a9a',5,8,34,42);R_(q,'#4a7ab0',5,8,34,4);q.fillStyle='#e8e8e2';q.beginPath();q.moveTo(8,12);q.quadraticCurveTo(22,2,36,10);q.lineTo(34,16);q.quadraticCurveTo(22,10,10,16);q.fill();kpCirc(q,'rgba(130,12,18,.6)',18,10,3)}for(const x of[5,35])R_(q,HSP.o,x,51,5,4)}
// ===================== radiology =====================
// the MRI: a big housing with the bore, the patient table sliding out (var .5+: someone left on it, under a sheet)
function hsMRI(q,v){R_(q,'rgba(0,0,0,.25)',8,140,184,8);R_(q,HSP.o,70,64,128,20);R_(q,'#c8ccd4',71,65,126,18);R_(q,'#2a6ab8',71,74,126,4);R_(q,HSP.o,148,82,30,62);R_(q,HSP.st,149,82,28,60);
 R_(q,HSP.o,4,8,124,136);R_(q,'#e8ecf0',5,9,122,134);R_(q,'#c8ccd4',5,120,122,22);R_(q,'#d8dce2',5,9,122,6);R_(q,'#2a6ab8',5,98,122,6);kpCirc(q,HSP.o,66,62,44);kpCirc(q,'#d8dce4',66,62,43);kpCirc(q,'#b8bcc4',66,62,34);kpCirc(q,HSP.o,66,62,29);kpCirc(q,'#1a1c24',66,62,28);kpCirc(q,'#2a2d38',62,58,20);
 R_(q,HSP.o,50,60,148,14);R_(q,'#e8e8e4',51,61,146,12);R_(q,'#c8c8c4',51,70,146,3);if(v>=.5){q.fillStyle=HSP.o;q.beginPath();q.ellipse(160,66,30,8,0,0,7);q.fill();q.fillStyle='#f0f0ea';q.beginPath();q.ellipse(160,66,29,7,0,0,7);q.fill();kpCirc(q,'rgba(130,12,18,.6)',170,66,4)}
 R_(q,HSP.o,18,16,30,10);R_(q,'#1a3a5a',19,17,28,8);R_(q,'#7ad8ff',21,19,10,2);R_(q,HSP.yl,92,16,26,10);kpText(q,'MAGNET',105,21,24,5,HSP.o)}
// the CT scanner: a narrower ring, its table
function hsCT(q,v){R_(q,'rgba(0,0,0,.25)',8,100,144,7);R_(q,HSP.o,56,48,100,16);R_(q,'#e8e8e4',57,49,98,14);R_(q,'#2a8a6a',57,58,98,3);R_(q,HSP.o,118,62,26,42);R_(q,HSP.st,119,62,24,40);
 R_(q,HSP.o,6,6,72,98);R_(q,'#e8ecf0',7,7,70,96);R_(q,'#2a8a6a',7,80,70,5);kpCirc(q,HSP.o,42,46,30);kpCirc(q,'#d8dce4',42,46,29);kpCirc(q,HSP.o,42,46,19);kpCirc(q,'#1a1c24',42,46,18);R_(q,'#7aff9a',38,12,8,4);if(v>=.5)R_(q,'rgba(130,12,18,.65)',80,52,22,6)}
// the light box on the wall with X-ray films (c0; it glows)
function hsXbox(q){R_(q,HSP.o,0,0,80,40);R_(q,'#c8ccd4',1,1,78,38);for(let i=0;i<3;i++){const x=4+i*25;R_(q,'#eaf4ff',x,4,22,32);R_(q,'#1a2230',x+2,6,18,28);q.strokeStyle='#c8d8e8';q.fillStyle='#c8d8e8';q.lineWidth=1;
 if(i==0){R_(q,'#c8d8e8',x+10,8,2,24);for(let k=0;k<5;k++){q.beginPath();q.moveTo(x+10,10+k*4);q.quadraticCurveTo(x+4,9+k*4,x+4,13+k*4);q.moveTo(x+12,10+k*4);q.quadraticCurveTo(x+18,9+k*4,x+18,13+k*4);q.stroke()}}
 else if(i==1){q.beginPath();q.ellipse(x+11,16,7,8,0,0,7);q.stroke();q.beginPath();q.moveTo(x+6,22);q.quadraticCurveTo(x+11,32,x+16,22);q.stroke();R_(q,'#1a2230',x+7,14,3,3);R_(q,'#1a2230',x+12,14,3,3)}
 else{R_(q,'#c8d8e8',x+7,24,9,7);for(let k=0;k<4;k++)R_(q,'#c8d8e8',x+7+k*2.5,10+(k%2)*2,1.5,14-(k%2)*2);R_(q,'#c8d8e8',x+15,18,4,1.5)}}}
// ===================== the lab and the pharmacy =====================
// a lab bench: microscope, centrifuge, racks of tubes, a sink, the shelf above
function hsLab(q,v){R_(q,'rgba(0,0,0,.25)',4,54,136,6);R_(q,HSP.o,4,0,136,8);R_(q,'#d8dce2',5,1,134,6);for(let i=0;i<14;i++)R_(q,['#e8e8e4','#c8a060','#7ab8e8','#e8c45a'][i%4],8+i*9,1,5,6);
 hsCounter(q,2,18,140,14,26,'#2a3a40','#d8dce2');R_(q,'#b8bcc4',2,40,140,2);R_(q,HSP.o,60,44,3,10);
 R_(q,HSP.o,14,4,12,20);R_(q,'#e8ecf0',15,5,10,18);R_(q,HSP.o,13,8,16,4);R_(q,'#2a2c34',17,1,4,8);kpCirc(q,HSP.o,46,14,9);kpCirc(q,'#e8ecf0',46,14,8);kpCirc(q,'#8a8f96',46,14,4);
 for(let i=0;i<8;i++){R_(q,HSP.o,64+i*5,8,4,12);R_(q,i%3==0?'#c82a2a':i%3==1?'#7a2a8a':'#e8c45a',65+i*5,12,2,7)}R_(q,HSP.o,106,16,26,6);R_(q,'#7a828c',107,17,24,4);R_(q,HSP.o,118,6,3,12);if(v>=.5){R_(q,'rgba(130,12,18,.7)',40,20,30,5)}}
// a lab fridge with a glass door, racks of samples, its light on
function hsLabFrz(q){R_(q,'rgba(0,0,0,.25)',3,86,50,5);R_(q,HSP.o,3,2,48,86);R_(q,'#e8ecf0',4,3,46,84);R_(q,HSP.o,8,8,38,66);R_(q,'#bfe8ff',9,9,36,64);for(const y of[22,38,54])R_(q,'#8ab0c8',9,y,36,2);
 for(let r=0;r<4;r++)for(let i=0;i<5;i++)R_(q,['#c82a2a','#e8c45a','#7a2a8a','#3a8ae8'][(r+i)%4],11+i*7,12+r*16,4,8);R_(q,'#2a2c34',44,30,3,16);R_(q,'#2a2c34',10,78,20,4);R_(q,'#6aff7a',38,79,4,2)}
// a fume hood: the sash, the glow inside
function hsHood(q){R_(q,'rgba(0,0,0,.25)',4,88,86,6);R_(q,HSP.o,2,2,90,88);R_(q,'#d8dce2',3,3,88,86);R_(q,'#c8ccd4',3,3,88,14);R_(q,HSP.o,10,20,74,40);R_(q,'#8ab8d0',11,21,72,38);R_(q,'#bfe0f0',11,21,72,4);R_(q,'#7a828c',11,48,72,11);R_(q,HSP.o,8,60,78,4);R_(q,'#3a3d46',3,64,88,24);R_(q,'#e8c45a',30,6,34,6)}
// the pharmacy counter: the pick-up window, the PHARMACY sign (your text), a bell, bags of prescriptions
function hsRx(q,t){R_(q,'rgba(0,0,0,.25)',6,62,172,7);R_(q,HSP.o,4,0,176,14);R_(q,'#2aa860',5,1,174,12);kpText(q,(cmTxt(t,14)||'PHARMACY').toUpperCase(),92,7,160,9,'#fff');hsCross(q,14,7,8,'#fff');
 hsCounter(q,4,22,176,12,30,'#e8e8e4','#6a8a7a');R_(q,'rgba(160,210,240,.45)',40,14,96,10);R_(q,HSP.o,86,14,2,10);for(const x of[20,48,140]){R_(q,'#e8dcc0',x,24,12,9);R_(q,'#c8b890',x,30,12,3);R_(q,'#fff',x+3,26,6,3)}kpCirc(q,'#d8b04a',112,28,3);R_(q,HSP.o,64,40,56,10);R_(q,'#1a3a2a',65,41,54,8);kpText(q,'PICK UP',92,45,50,6,'#9affb0')}
// ===================== the morgue =====================
// the cold chamber: two rows of steel doors; var picks one pulled out with someone on the tray
function hsDrawers(q,v){R_(q,'rgba(0,0,0,.25)',4,104,144,7);R_(q,HSP.o,2,2,146,104);R_(q,'#9aa0a8',3,3,144,102);R_(q,'#b8bcc4',3,3,144,4);const open=Math.floor(v*6)%6;
 for(let r=0;r<2;r++)for(let i=0;i<3;i++){const x=8+i*47,y=10+r*46,k=r*3+i;R_(q,HSP.o,x,y,42,40);R_(q,k==open?'#1a1c22':'#d4d8de',x+1,y+1,40,38);if(k!=open){R_(q,'#e8ecf0',x+1,y+1,40,3);R_(q,HSP.o,x+30,y+16,8,4);R_(q,'#7a828c',x+31,y+17,6,2);R_(q,'#fff',x+5,y+6,12,6);R_(q,'#8a8f96',x+6,y+8,10,1)}}
 const ox=8+(open%3)*47,oy=10+Math.floor(open/3)*46;R_(q,HSP.o,ox-2,oy+26,46,24);R_(q,HSP.st,ox-1,oy+27,44,22);q.fillStyle=HSP.o;q.beginPath();q.ellipse(ox+21,oy+36,19,8,0,0,7);q.fill();q.fillStyle='#e8e8e2';q.beginPath();q.ellipse(ox+21,oy+36,18,7,0,0,7);q.fill();R_(q,'#c8a070',ox+34,oy+38,7,4)}
// the autopsy table: steel, the drain, the sink at its head, a hanging scale
function hsAut(q,v){R_(q,'rgba(0,0,0,.25)',8,100,48,8);R_(q,HSP.o,24,70,16,32);R_(q,HSP.std,25,70,14,30);hsSteel(q,8,10,48,64);R_(q,'#7a828c',12,14,40,56);R_(q,'#9aa0a8',12,14,40,2);for(let y=20;y<66;y+=6)R_(q,'#6a6e76',14,y,36,1);kpCirc(q,HSP.o,32,64,3);
 hsSteel(q,14,0,36,12);R_(q,'#5a5e68',18,3,28,6);R_(q,HSP.o,30,0,4,4);if(v>=.5){q.fillStyle=HSP.o;q.beginPath();q.ellipse(32,40,12,26,0,0,7);q.fill();q.fillStyle='#e8e8e2';q.beginPath();q.ellipse(32,40,11,25,0,0,7);q.fill();R_(q,'#d4d4cc',31,18,2,44);kpCirc(q,'rgba(130,12,18,.55)',36,46,5)}else R_(q,'rgba(130,12,18,.55)',20,30,10,4)}
// ===================== the cafeteria and the coffee bar =====================
// the serving line: a steel counter, the sneeze guard, pans of food, the tray slide
function hsServe(q){R_(q,'rgba(0,0,0,.25)',6,64,232,7);R_(q,HSP.o,4,0,232,8);R_(q,'#bfe0f0',5,1,230,5);R_(q,'rgba(190,225,245,.5)',5,6,230,12);for(const x of[6,118,232])R_(q,HSP.o,x,0,3,22);
 hsCounter(q,4,22,232,16,26,HSP.st,'#8a8f96');for(let i=0;i<8;i++){const x=10+i*28;R_(q,HSP.o,x,24,24,12);R_(q,HSP.std,x+1,25,22,10);R_(q,['#c8742a','#e8d870','#3a8a3a','#c83a2a','#e8e0c8','#8a5a2a','#e8a840','#5a9a3a'][i],x+2,26,20,8);R_(q,'rgba(255,255,255,.3)',x+2,26,20,2)}
 R_(q,HSP.o,4,48,232,6);R_(q,HSP.stl,5,49,230,2);R_(q,HSP.std,5,51,230,2);for(const x of[20,216])R_(q,HSP.o,x,54,6,10)}
// the coffee bar: a counter with the espresso machine, cups, the pastry case, its sign (your text)
function hsCbar(q,t){R_(q,'rgba(0,0,0,.25)',6,60,152,6);R_(q,HSP.o,4,0,152,12);R_(q,'#3a2416',5,1,150,10);kpText(q,(cmTxt(t,14)||'COFFEE').toUpperCase(),80,6,140,8,'#f0d8a0');
 hsCounter(q,4,24,152,12,26,'#2a2a2a','#6a4228');R_(q,'#5a3a22',4,44,152,2);R_(q,HSP.o,16,10,34,18);R_(q,HSP.st,17,11,32,16);R_(q,'#c82a2a',17,11,32,4);R_(q,HSP.o,22,24,6,5);R_(q,HSP.o,38,24,6,5);
 R_(q,HSP.o,96,8,50,20);R_(q,'rgba(220,240,255,.6)',97,9,48,18);for(let i=0;i<5;i++){kpCirc(q,'#c88a3a',102+i*9,22,4);kpCirc(q,'#e8b860',102+i*9,21,2)}for(let i=0;i<4;i++)R_(q,'#f8f8f4',58+i*8,18,6,7),R_(q,'#8a5a2a',58+i*8,18,6,2)}
// the drinks station: soda fountain, ice, cups
function hsDrinks(q){R_(q,'rgba(0,0,0,.25)',4,64,64,6);hsCounter(q,2,34,68,10,22,HSP.st,'#8a8f96');R_(q,HSP.o,8,2,56,34);R_(q,'#2a2c34',9,3,54,32);for(let i=0;i<4;i++){R_(q,['#c82a2a','#2a5ac8','#e8c42a','#3a9a3a'][i],12+i*13,6,10,10);R_(q,HSP.st,14+i*13,24,6,8)}
 for(let i=0;i<3;i++)R_(q,'#f8f8f4',14+i*8,36,6,6),R_(q,'#d8d8d2',14+i*8,40,6,2);R_(q,HSP.o,56,56,6,10)}
// the tray rack (trays left in it)
function hsTrays(q){R_(q,'rgba(0,0,0,.25)',3,76,56,5);for(const x of[3,55])R_(q,HSP.o,x,2,4,76),R_(q,HSP.st,x+1,2,2,76);for(let y=8;y<72;y+=8){R_(q,HSP.o,6,y,50,4);R_(q,y%16?'#c8742a':'#5a8a5a',7,y+1,48,2)}}
// ===================== the kitchen =====================
// a stainless prep table: a cutting board and knife, a bowl, a stockpot, the shelf under it (v: something bloody left on it)
function hsPrep(q,v){R_(q,'rgba(0,0,0,.25)',4,54,124,6);for(const x of[6,118])R_(q,HSP.o,x,36,5,20),R_(q,HSP.std,x+1,36,3,20);R_(q,HSP.o,6,46,118,4);R_(q,HSP.std,7,47,116,2);for(let i=0;i<3;i++)R_(q,HSP.o,24+i*30,40,22,6),R_(q,['#c8ccd4','#e8e4dc','#a8acb2'][i],25+i*30,41,20,4);
 R_(q,HSP.o,2,10,124,28);R_(q,HSP.st,3,11,122,26);R_(q,HSP.stl,3,11,122,3);R_(q,HSP.std,3,34,122,3);R_(q,HSP.o,12,15,34,18);R_(q,'#d8b884',13,16,32,16);R_(q,'#c8a874',13,30,32,2);R_(q,HSP.o,17,21,22,3);R_(q,'#e8e8ec',17,22,15,1);R_(q,'#3a2416',32,21,7,3);
 kpCirc(q,HSP.o,64,22,10);kpCirc(q,'#d8dce2',64,22,9);kpCirc(q,v>.5?'#8a1414':'#e8c45a',64,22,6);R_(q,HSP.o,86,6,28,26);R_(q,'#a8acb2',87,7,26,24);R_(q,'#c8ccd4',87,7,26,4);hsEll(q,'#3a3d46',100,9,12,3);R_(q,HSP.o,82,14,5,3);R_(q,HSP.o,113,14,5,3);
 if(v>.5){kpCirc(q,'rgba(120,20,20,.85)',50,32,5);R_(q,'#8a1414',38,27,9,2);R_(q,'#8a1414',74,30,2,8)}}
// the pot rack hanging over the prep tables (over people): the steel frame, pots, pans, ladles on hooks
function hsPotRack(q){R_(q,HSP.o,4,4,128,30);R_(q,'#8a8f96',6,6,124,26);R_(q,'#3a3d46',10,10,116,18);for(const x of[2,130])hsLine(q,HSP.o,2,[[x+2,0],[x+2,6]]);
 const P=[[18,'pan'],[36,'pot'],[56,'lad'],[70,'pan'],[90,'pot'],[110,'lad'],[120,'pan']];for(const[x,k]of P){R_(q,HSP.o,x-1,10,3,6);
  if(k=='pan'){kpCirc(q,HSP.o,x,26,9);kpCirc(q,'#2a2c32',x,26,8);kpCirc(q,'#4a4e56',x-2,24,4);R_(q,HSP.o,x-1,14,3,6)}
  else if(k=='pot'){R_(q,HSP.o,x-9,16,18,18);R_(q,'#b8bcc4',x-8,17,16,16);R_(q,'#d8dce2',x-8,17,16,3);R_(q,'#8a8f96',x-8,30,16,3)}
  else{R_(q,HSP.o,x-1,14,3,18);R_(q,'#c8ccd4',x,14,1,18);kpCirc(q,HSP.o,x,33,5);kpCirc(q,'#c8ccd4',x,33,4)}}}
// the dishwasher: the hood, a rack of plates going in, the steel tables either side
function hsDish(q){R_(q,'rgba(0,0,0,.25)',4,76,112,6);for(const x of[4,74])R_(q,HSP.o,x,44,38,34),R_(q,HSP.st,x+1,45,36,32),R_(q,HSP.stl,x+1,45,36,3);
 R_(q,HSP.o,36,6,44,72);R_(q,'#a8acb2',37,7,42,70);R_(q,'#c8ccd4',37,7,42,8);R_(q,'#7a7f88',37,40,42,2);R_(q,HSP.o,42,24,32,10);R_(q,'#1e2a30',43,25,30,8);kpCirc(q,'#5aff7a',72,16,2);R_(q,HSP.o,50,62,16,4);
 R_(q,HSP.o,8,50,32,20);R_(q,'#5a5e68',9,51,30,18);for(let i=0;i<6;i++){kpCirc(q,HSP.o,13+i*5,56,4);kpCirc(q,'#f2f2ee',13+i*5,56,3)}R_(q,HSP.o,82,52,28,6);R_(q,'#e8e4dc',83,53,26,4)}
// the meal cart: the tall enclosed trolley the trays went round the wards in, a door hanging open, trays inside
function hsMealCart(q,v){R_(q,'rgba(0,0,0,.25)',4,66,52,6);R_(q,HSP.o,4,2,48,62);R_(q,HSP.st,5,3,46,60);R_(q,HSP.stl,5,3,46,4);R_(q,HSP.o,2,10,4,24);R_(q,HSP.o,50,10,4,24);
 R_(q,HSP.o,10,10,36,48);R_(q,'#3a3d46',11,11,34,46);for(let y=14;y<54;y+=8){R_(q,'#16111c',11,y,34,2);if(v>.4&&y>40)continue;R_(q,['#e8c45a','#5a9ae8','#e8e4dc','#c86a5a','#7ac87a'][(y/8|0)%5],13,y-5,30,4)}
 if(v>.4){R_(q,HSP.o,44,12,10,46);R_(q,HSP.std,45,13,8,44)}for(const x of[8,44]){kpCirc(q,HSP.o,x,64,4);kpCirc(q,'#3a3d46',x,64,3)}}
// ===================== the gift shop =====================
// shelves of gifts: teddy bears, mugs, cards, vases
function hsGifts(q,v){R_(q,'rgba(0,0,0,.25)',4,66,86,6);R_(q,HSP.o,2,2,90,64);R_(q,'#e8e0d0',3,3,88,62);for(const y of[22,42,62])R_(q,'#b8a890',3,y,88,3);
 for(let i=0;i<5;i++){const x=8+i*17;kpCirc(q,HSP.o,x+6,14,6);kpCirc(q,['#c88a4a','#e8e4dc','#c86a8a','#a8743a','#e8c8a8'][i],x+6,14,5);kpCirc(q,'#16111c',x+4,13,1);kpCirc(q,'#16111c',x+8,13,1);kpCirc(q,HSP.o,x+6,20,4);kpCirc(q,['#c88a4a','#e8e4dc','#c86a8a','#a8743a','#e8c8a8'][i],x+6,20,3)}
 for(let i=0;i<7;i++)R_(q,HSP.o,7+i*12,30,9,11),R_(q,['#fff','#e85a5a','#5a9ae8','#fff','#e8c45a','#7ac87a','#fff'][i],8+i*12,31,7,9);for(let i=0;i<6;i++)R_(q,HSP.o,8+i*14,48,10,13),R_(q,['#e8a0c0','#a0c8e8','#f0e0a0'][i%3],9+i*14,49,8,11)}
// a bunch of balloons on weights (they bob: an)
function hsBalloonsAn(o,t){const B=[[-14,-82,'#e85a8a','♥'],[6,-92,'#c8ccd8','GET'],[18,-74,'#5a9ae8','★'],[-4,-68,'#e8c42a',''],[-20,-62,'#7ac87a','']],ph=cmR(o,0,77)*7;
 X.save();for(const[dx,dy,c,s]of B){const k=Math.sin(t*1.3+ph+dx*.1)*3,x=o.x+dx+k,y=o.y+dy+Math.cos(t*1.1+ph+dy)*2;X.strokeStyle='#e8e8e8';X.lineWidth=1;X.beginPath();X.moveTo(o.x,o.y-6);X.quadraticCurveTo(o.x+dx*.3,y+30,x,y+11);X.stroke();
  X.fillStyle='#16111c';X.beginPath();X.ellipse(x,y,10,12,0,0,7);X.fill();X.fillStyle=c;X.beginPath();X.ellipse(x,y,9,11,0,0,7);X.fill();X.fillStyle='rgba(255,255,255,.55)';X.fillRect(x-5,y-7,3,4);if(s){X.font='bold 7px sans-serif';X.textAlign='center';X.textBaseline='middle';X.fillStyle='#fff';X.fillText(s,x,y+1)}}
 X.restore();X.textAlign='left';X.textBaseline='alphabetic'}
function hsBalloons(q){R_(q,'rgba(0,0,0,.2)',2,12,18,4);R_(q,HSP.o,4,6,14,8);R_(q,'#c82a2a',5,7,12,6);R_(q,'#e85a4a',5,7,12,2)}
// a greeting card spinner
function hsCards(q){R_(q,'rgba(0,0,0,.2)',4,62,24,4);R_(q,HSP.o,14,52,4,12);R_(q,HSP.o,6,62,20,4);R_(q,HSP.o,3,2,26,52);R_(q,'#c8ccd4',4,3,24,50);for(let r=0;r<4;r++)for(let i=0;i<3;i++)R_(q,['#e8a0c0','#fff','#a0d8a0','#e8d890','#a0c8e8'][(r*3+i)%5],5+i*8,5+r*12,7,10)}
// ===================== the roof =====================
// a big air handler: louvres, the fan grille on top, pipes
function hsAHU(q,v){R_(q,'rgba(0,0,0,.3)',8,96,154,8);R_(q,HSP.o,4,20,152,78);R_(q,'#a8acb2',5,21,150,76);R_(q,'#c8ccd4',5,21,150,22);R_(q,'#8a8f96',5,90,150,7);for(let x=12;x<150;x+=6)R_(q,'#8a8f96',x,48,3,36);
 for(const x of[44,112]){kpCirc(q,HSP.o,x,22,22);kpCirc(q,'#5a5e68',x,22,21);for(let k=0;k<8;k++){const a=k*.785+v*3;hsLine(q,'#8a8f96',2,[[x,22],[x+Math.cos(a)*19,22+Math.sin(a)*19]])}kpCirc(q,'#3a3d46',x,22,5)}R_(q,HSP.o,0,64,8,8);R_(q,'#7a5a3a',150,70,10,26)}
// a mushroom exhaust fan
function hsExFan(q){R_(q,'rgba(0,0,0,.3)',4,34,34,6);R_(q,HSP.o,12,18,18,20);R_(q,'#8a8f96',13,19,16,18);hsEll(q,HSP.o,21,14,19,10);hsEll(q,'#b8bcc4',21,13,18,9);hsEll(q,'#d8dce2',21,11,14,5);for(let k=-12;k<14;k+=4)R_(q,'#7a7f88',21+k,18,2,4)}
// vent pipes and a gooseneck
function hsVentP(q){R_(q,'rgba(0,0,0,.3)',4,26,26,5);for(const[x,h]of[[6,18],[16,24],[24,14]]){R_(q,HSP.o,x-1,28-h,9,h+2);R_(q,'#9aa0a8',x,29-h,7,h);R_(q,'#c8ccd4',x,29-h,2,h);hsEll(q,'#3a3d46',x+3.5,29-h,3.5,1.5)}}
// the antenna mast (tall): its red light blinks (an)
function hsMast(q){R_(q,'rgba(0,0,0,.3)',2,154,26,6);R_(q,HSP.o,4,148,22,10);R_(q,'#7a7f88',5,149,20,8);hsLine(q,HSP.o,3,[[15,150],[15,10]]);hsLine(q,'#c8ccd4',1.5,[[15,150],[15,10]]);for(let y=20;y<148;y+=16){hsLine(q,'#8a8f96',1,[[9,y],[21,y+8],[9,y+16]])}
 hsLine(q,'#c8ccd4',1,[[9,150],[9,20]]);hsLine(q,'#c8ccd4',1,[[21,150],[21,20]]);for(const y of[40,90])R_(q,HSP.o,4,y,22,6),R_(q,'#d8dce2',5,y+1,20,4);kpCirc(q,HSP.o,15,8,5);kpCirc(q,'#5a1410',15,8,4)}
function hsMastAn(o,t){const on=((t+cmR(o,0,83)*3)*.9)%1<.45;if(!on)return;X.fillStyle='rgba(255,60,40,.35)';X.beginPath();X.arc(o.x,o.y-152,9,0,7);X.fill();X.fillStyle='#ff4a3a';X.beginPath();X.arc(o.x,o.y-152,4,0,7);X.fill()}
// a windsock on its pole (the sock waves: an)
function hsSockPole(q){R_(q,'rgba(0,0,0,.3)',2,84,20,5);R_(q,HSP.o,10,6,4,82);R_(q,'#d8dce2',11,6,2,82);R_(q,HSP.o,6,84,12,5);kpCirc(q,HSP.o,12,6,4);kpCirc(q,'#ff4a3a',12,6,3)}
function hsSockAn(o,t){const x=o.x+2,y=o.y-80,ph=cmR(o,0,79)*5;X.save();for(let i=0;i<5;i++){const s=i/5,wv=Math.sin(t*4+ph-i*.9)*3*s,x0=x+i*10,y0=y+wv+i*2.2,h=8-i*.9;X.fillStyle='#16111c';X.fillRect(x0,y0-h/2-1,11,h+2);X.fillStyle=i%2?'#f4f4f0':'#ff6a1a';X.fillRect(x0+1,y0-h/2,9,h)}X.restore()}
// the rooftop sign: the big letters on their steel frame along the roof edge, lit
function hsRsign(q,t){const T=(cmTxt(t,20)||'ZOMBVILLE GENERAL').toUpperCase();R_(q,'rgba(0,0,0,.3)',6,66,388,6);for(let x=14;x<390;x+=46){hsLine(q,HSP.o,4,[[x,70],[x+8,10]]);hsLine(q,'#7a7f88',2,[[x,70],[x+8,10]])}R_(q,HSP.o,4,60,392,6);R_(q,'#6a6e76',5,61,390,4);
 R_(q,HSP.o,4,4,392,52);R_(q,'#2a2c34',5,5,390,50);kpCirc(q,HSP.o,30,30,21);kpCirc(q,'#e8e8e4',30,30,20);hsCross(q,30,30,22,'#d82a1e');q.font='bold 30px "Barlow Condensed", Impact, sans-serif';q.textAlign='center';q.textBaseline='middle';
 const mw=330,w=q.measureText(T).width,s=Math.min(1,mw/w);q.save();q.translate(220,31);q.scale(s,1);q.fillStyle='#ff5a3a';q.fillText(T,0,0);q.fillStyle='rgba(255,220,200,.65)';q.fillText(T,0,-1);q.restore();q.textAlign='left';q.textBaseline='alphabetic';for(let x=60;x<392;x+=14)R_(q,'#ffd8a0',x,7,2,2)}
// the military helicopter, parked (the escape draws its own, flying): see campaign/escape.js
Object.assign(OB,{
// the lobby
infodesk:{w:152,h:74,c:[140,30],txt:14,dt:'INFORMATION',f:(g,x,y,v,c,t)=>S2(g,x,y,152,74,q=>hsInfo(q,t))},
admdesk:{w:262,h:76,c:[252,30],txt:16,dt:'ADMISSIONS',f:(g,x,y,v,c,t)=>S2(g,x,y,262,76,q=>hsAdm(q,t))},
wseat:obc(118,48,[110,16],HSSEAT,(q,v,K)=>hsSeats(q,K,4,+v||0)),
wseat2:obc(66,48,[58,16],HSSEAT,(q,v,K)=>hsSeats(q,K,2,0)),
lounge:obc(92,56,[84,22],HSSEAT,(q,v,K)=>hsLounge(q,K)),
hctab:ob(54,32,[46,10],q=>hsCtab(q)),
planterb:ob(100,76,[92,24],(q,v)=>hsPlanter(q,+v||0)),
dirboard:{w:90,h:120,c:[44,10],txt:14,dt:'DIRECTORY',f:(g,x,y,v,c,t)=>S2(g,x,y,90,120,q=>hsDirb(q,t))},
hkiosk:ob(36,62,[24,10],q=>hsKiosk(q)),
// the little things
wetsign:ob(26,36,[14,6],q=>hsWet(q)),
fext:{w:22,h:34,c:0,f:(g,x,y)=>S2(g,x,y,22,34,q=>hsFext(q))},
aed:{w:22,h:28,c:0,f:(g,x,y)=>S2(g,x,y,22,28,q=>hsAed(q))},
sanit:{w:14,h:26,c:0,f:(g,x,y)=>S2(g,x,y,14,26,q=>hsSanit(q))},
htrash:ob(28,34,[20,8],(q,v)=>hsTrash(q,+v||0)),
dplate:{w:46,h:14,c:0,txt:10,dt:'ROOM',f:(g,x,y,v,c,t)=>S2(g,x,y,46,14,q=>hsPlate(q,t))},
qsign:{w:68,h:78,c:[56,6],txt:18,dt:'QUARANTINE',f:(g,x,y,v,c,t)=>S2(g,x,y,68,78,q=>hsQsign(q,t))},
// the surgery center
ortable:ob(72,100,[40,40],(q,v)=>hsORt(q,+v||0)),
orlight:{w:142,h:92,c:0,ov:1,ova:.3,sw:110,lt:[{dx:-41,dy:-30,r:130,c:'#f4f8ff',i:.9},{dx:41,dy:-26,r:110,c:'#f4f8ff',i:.8,f:'fault'}],f:(g,x,y)=>S2(g,x,y,142,92,q=>hsORlight(q))},
anesth:ob(52,70,[44,14],q=>hsAnes(q)),
mayo:ob(40,46,[26,8],(q,v)=>hsMayo(q,+v||0)),
backtab:ob(90,46,[84,14],(q,v)=>hsBack(q,+v||0)),
scrubsink:{w:110,h:44,c:[106,12],f:(g,x,y)=>S2(g,x,y,110,44,q=>hsScrub(q))},
stershelf:ob(80,80,[76,12],(q,v)=>hsSter(q,+v||0)),
// patient care
pbed:obc(60,104,[52,72],HSBLK,(q,v,K)=>hsBed(q,K,+v||0)),
obtable:ob(44,40,[10,8],q=>hsOver(q)),
recl:obc(48,46,[40,16],HSSEAT,(q,v,K)=>hsRecl(q,K)),
nstation:{w:200,h:82,c:[192,34],txt:14,dt:'NURSES STATION',f:(g,x,y,v,c,t)=>S2(g,x,y,200,82,q=>hsNurse(q,t))},
hvent:ob(38,62,[28,10],q=>hsVent(q)),
vitals:Object.assign(ob(30,70,[14,8],q=>hsVitals(q)),{an:hsVitalsAn}),
linen:ob(46,58,[40,12],(q,v)=>hsLinen(q,+v||0)),
// radiology
mri:ob(200,150,[190,74],(q,v)=>hsMRI(q,+v||0)),
ctscan:ob(156,108,[146,50],(q,v)=>hsCT(q,+v||0)),
xbox:{w:80,h:40,c:0,lt:[{dx:0,dy:-20,r:60,c:'#d8ecff',i:.7,w:0}],f:(g,x,y)=>S2(g,x,y,80,40,q=>hsXbox(q))},
// the lab, the pharmacy
labbench:ob(144,60,[140,28],(q,v)=>hsLab(q,+v||0)),
labfrz:Object.assign(ob(54,92,[48,14],q=>hsLabFrz(q)),{lt:[{dx:0,dy:-44,r:54,c:'#bfe8ff',i:.55,w:0}]}),
fumehood:ob(94,94,[90,16],q=>hsHood(q)),
rxcounter:{w:184,h:70,c:[176,26],txt:14,dt:'PHARMACY',f:(g,x,y,v,c,t)=>S2(g,x,y,184,70,q=>hsRx(q,t))},
// the morgue
mdrawers:ob(150,112,[146,22],(q,v)=>hsDrawers(q,+v||0)),
autopsy:ob(64,104,[46,64],(q,v)=>hsAut(q,+v||0)),
// the cafeteria, the coffee bar
servline:ob(240,70,[236,30],q=>hsServe(q)),
cbar:{w:160,h:66,c:[154,28],txt:14,dt:'COFFEE',f:(g,x,y,v,c,t)=>S2(g,x,y,160,66,q=>hsCbar(q,t))},
drinkst:ob(72,70,[68,18],q=>hsDrinks(q)),
trayrack:ob(62,80,[56,12],q=>hsTrays(q)),
// the kitchen
kprep:ob(128,58,[124,26],(q,v)=>hsPrep(q,+v||0)),
potrack:{w:134,h:40,c:0,ov:1,ova:.35,f:(g,x,y)=>S2(g,x,y,134,40,q=>hsPotRack(q))},
dishmach:ob(116,80,[110,32],q=>hsDish(q)),
mtrolley:ob(56,70,[50,16],(q,v)=>hsMealCart(q,+v||0)),
// the gift shop
giftshelf:ob(94,72,[90,14],(q,v)=>hsGifts(q,+v||0)),
balloons:Object.assign(ob(22,16,[12,6],q=>hsBalloons(q)),{an:hsBalloonsAn,wb:1}),
cardrack:ob(32,66,[20,8],q=>hsCards(q)),
// the roof
ahu:ob(162,104,[156,68],(q,v)=>hsAHU(q,+v||0)),
exfan:ob(42,40,[32,18],q=>hsExFan(q)),
rpipes:ob(34,30,[26,12],q=>hsVentP(q)),
mast:Object.assign(ob(30,160,[18,10],q=>hsMast(q)),{an:hsMastAn,wb:1,lt:[{dx:0,dy:-152,r:46,c:'#ff3a2a',i:.9,f:'blink',w:0}]}),
windsock:Object.assign(ob(24,90,[8,6],q=>hsSockPole(q)),{an:hsSockAn,wb:1}),
rsign:{w:400,h:74,c:[392,14],wb:1,txt:20,dt:'ZOMBVILLE GENERAL',lt:[{dx:-180,dy:-40,r:90,c:'#ff5a3a',i:.7,w:0},{dx:20,dy:-40,r:150,c:'#ff5a3a',i:.75,w:0},{dx:150,dy:-40,r:90,c:'#ff5a3a',i:.6,f:'fault',w:0}],f:(g,x,y,v,c,t)=>S2(g,x,y,400,74,q=>hsRsign(q,t))}});
