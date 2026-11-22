//# maps/props/kit-camp.js — Kit props for the Campground: the camp bell, split-log benches, a lifeguard chair, kayaks and a kayak rack, a rack of life jackets, the swim raft, a long table on its side (a barricade), a bear box, an outhouse, a canoe on sawhorses, a hammock, the notice board, cabin bunks (made or left mid-packing), dome tents (some collapsed), a mic stand, a picnic table with supper still on it
// ---------- the Campground's pieces ----------
const CPP={o:'#16111c',lg:'#7a5432',lgl:'#9a7046',lgd:'#5a3a22',lgdd:'#3a2414',wd:'#a07a4c',wdl:'#c09a64',wdd:'#6a4a2a',st:'#c8ccd4',sk:'#5a5e68',br:'#b8862e',brl:'#e0b85a'};
const CPCOL=[['#c0392b','Red'],['#2f6fd0','Blue'],['#3a8a5a','Green'],['#e0a030','Orange'],['#e8d830','Yellow'],['#8a3a8a','Purple']];
const CPTENT=[['#3a8a5a','Green'],['#e0a030','Orange'],['#2f6fd0','Blue'],['#c0392b','Red'],['#8a8f96','Grey']];
// a log seen from its side: bark, a lighter split top, end grain
function cpLog(q,x,y,w,h,top){R_(q,CPP.o,x-1,y-1,w+2,h+2);R_(q,CPP.lgd,x,y,w,h);R_(q,CPP.lg,x,y,w,h*.55);for(let k=x+3;k<x+w-3;k+=7+Math.floor(cmH(k,y,1)*6))R_(q,CPP.lgdd,k,y+1,1,h-2);if(top){R_(q,'#c8a070',x+3,y,w-6,Math.max(2,h*.3));R_(q,'#d8b484',x+3,y,w-6,1)}
 for(const ex of[x,x+w-5]){R_(q,'#c8a070',ex,y+1,5,h-2);q.strokeStyle='#8a6a42';q.lineWidth=1;q.strokeRect(ex+1.5,y+h/2-1.5,2,3)}}
// ----- the camp bell on its timber frame (tall) -----
function cpBell(q){R_(q,'rgba(0,0,0,.25)',8,110,58,8);for(const x of[10,52]){R_(q,CPP.o,x-1,22,10,94);R_(q,CPP.lgd,x,22,8,92);R_(q,CPP.lgl,x,22,3,92);for(let y=30;y<110;y+=14)R_(q,CPP.lgdd,x,y,8,1)}
 R_(q,CPP.o,2,14,66,12);R_(q,CPP.lg,3,15,64,10);R_(q,CPP.lgl,3,15,64,3);for(const x of[3,62])R_(q,'#c8a070',x,16,4,8);R_(q,'#8a8f96',33,24,4,6);
 // the bell
 q.fillStyle=CPP.o;q.beginPath();q.moveTo(24,48);q.quadraticCurveTo(24,28,35,28);q.quadraticCurveTo(46,28,46,48);q.lineTo(49,54);q.lineTo(21,54);q.closePath();q.fill();q.fillStyle=CPP.br;q.beginPath();q.moveTo(25,48);q.quadraticCurveTo(25,30,35,30);q.quadraticCurveTo(45,30,45,48);q.lineTo(47,52);q.lineTo(23,52);q.closePath();q.fill();
 q.fillStyle=CPP.brl;q.fillRect(28,33,3,15);q.fillStyle='#8a5a1e';q.fillRect(23,49,24,3);kpCirc(q,'#5a3a12',35,55,3);
 // the rope down, the stone base
 q.strokeStyle='#d8c8a0';q.lineWidth=2;q.beginPath();q.moveTo(35,56);q.quadraticCurveTo(40,80,38,100);q.stroke();R_(q,'#c8b890',35,98,6,8);for(const x of[6,48]){R_(q,CPP.o,x,108,16,10);R_(q,'#8a8a82',x+1,109,14,8);R_(q,'#a8a8a0',x+1,109,14,2)}}
// ----- a split-log bench -----
function cpLBench(q){R_(q,'rgba(0,0,0,.25)',6,22,100,7);for(const x of[12,88]){R_(q,CPP.o,x-1,14,14,14);R_(q,CPP.lgd,x,15,12,12);R_(q,'#c8a070',x,15,12,3)}cpLog(q,2,4,106,14,1)}
// ----- a lifeguard chair (tall): white legs, a ladder, the seat, a rescue tube hanging -----
function cpLife(q){R_(q,'rgba(0,0,0,.25)',6,110,50,8);const L=(x0,y0,x1,y1)=>{q.strokeStyle=CPP.o;q.lineWidth=6;q.beginPath();q.moveTo(x0,y0);q.lineTo(x1,y1);q.stroke();q.strokeStyle='#e8e4dc';q.lineWidth=4;q.beginPath();q.moveTo(x0,y0);q.lineTo(x1,y1);q.stroke()};
 L(12,114,20,54);L(48,114,40,54);L(14,96,46,96);L(16,76,44,76);for(let y=62;y<110;y+=10){R_(q,CPP.o,22,y,16,4);R_(q,'#d8d4c8',23,y+1,14,2)}
 R_(q,CPP.o,12,40,36,18);R_(q,'#e8e4dc',13,41,34,16);R_(q,'#c8c4b8',13,52,34,5);R_(q,CPP.o,14,20,32,22);R_(q,'#e8e4dc',15,21,30,20);R_(q,'#c0392b',22,25,16,4);R_(q,'#c0392b',28,21,4,12);
 R_(q,CPP.o,48,56,8,26);R_(q,'#d8403a',49,57,6,24);R_(q,'#f08070',49,57,6,3);q.strokeStyle='#e8e4dc';q.lineWidth=1;q.beginPath();q.moveTo(52,57);q.lineTo(46,48);q.stroke()}
// ----- a kayak (*colour*) seen from above -----
function cpKayak(q,K,x,y,w){q.fillStyle=CPP.o;q.beginPath();q.moveTo(x,y);q.quadraticCurveTo(x+w*.25,y-11,x+w/2,y-11);q.quadraticCurveTo(x+w*.75,y-11,x+w,y);q.quadraticCurveTo(x+w*.75,y+11,x+w/2,y+11);q.quadraticCurveTo(x+w*.25,y+11,x,y);q.fill();
 q.fillStyle=K.b;q.beginPath();q.moveTo(x+2,y);q.quadraticCurveTo(x+w*.25,y-10,x+w/2,y-10);q.quadraticCurveTo(x+w*.75,y-10,x+w-2,y);q.quadraticCurveTo(x+w*.75,y+10,x+w/2,y+10);q.quadraticCurveTo(x+w*.25,y+10,x+2,y);q.fill();
 q.fillStyle=K.l;q.beginPath();q.moveTo(x+6,y-1);q.quadraticCurveTo(x+w/2,y-9,x+w-6,y-1);q.lineTo(x+w-6,y-3);q.quadraticCurveTo(x+w/2,y-10,x+6,y-3);q.fill();R_(q,K.d,x+6,y+3,w-12,1);
 q.fillStyle=CPP.o;q.beginPath();q.ellipse(x+w*.5,y,11,6,0,0,7);q.fill();q.fillStyle='#2a2a30';q.beginPath();q.ellipse(x+w*.5,y,10,5,0,0,7);q.fill();q.fillStyle='#4a4a52';q.fillRect(x+w*.5-6,y-1,10,3);
 q.strokeStyle='#2a2a30';q.lineWidth=1;q.beginPath();q.moveTo(x+12,y-3);q.lineTo(x+w*.36,y+3);q.moveTo(x+12,y+3);q.lineTo(x+w*.36,y-3);q.moveTo(x+w-12,y-3);q.lineTo(x+w*.64,y+3);q.moveTo(x+w-12,y+3);q.lineTo(x+w*.64,y-3);q.stroke()}
function cpKRack(q,v){R_(q,'rgba(0,0,0,.25)',8,70,108,8);for(const x of[10,104]){R_(q,CPP.o,x-1,8,8,66);R_(q,CPP.wdd,x,8,6,64);R_(q,CPP.wd,x,8,2,64)}for(const y of[24,44,64])R_(q,CPP.o,6,y,108,5),R_(q,CPP.wd,7,y+1,106,3);
 const C=[['#e0a030'],['#2f6fd0'],['#c0392b']];for(let i=0;i<3;i++)cpKayak(q,pcK(C[(i+Math.floor(v*3))%3][0]),14,18+i*20,92)}
// ----- life jackets on a rack -----
function cpPFD(q){R_(q,'rgba(0,0,0,.22)',6,56,60,7);for(const x of[6,60]){R_(q,CPP.o,x-1,6,8,54);R_(q,CPP.wdd,x,6,6,52);R_(q,CPP.wd,x,6,2,52)}R_(q,CPP.o,4,8,64,5);R_(q,CPP.wd,5,9,62,3);
 for(let i=0;i<4;i++){const x=12+i*13,c=i==2?'#e8d830':'#e86a1a';R_(q,CPP.o,x-1,13,13,30);R_(q,c,x,14,11,28);R_(q,'rgba(0,0,0,.2)',x+5,14,1,28);for(const y of[22,30,38])R_(q,'#2a2a30',x,y,11,2);R_(q,'#c8ccd4',x+4,22,3,2);R_(q,'rgba(255,255,255,.25)',x,14,2,26)}}
// ----- the swim raft: planks on barrels, a ladder, floating -----
function cpRaft(q){q.fillStyle='rgba(20,50,80,.35)';q.beginPath();q.ellipse(50,46,52,26,0,0,7);q.fill();q.strokeStyle='rgba(220,240,255,.4)';q.lineWidth=1;q.beginPath();q.ellipse(50,44,48,24,0,0,7);q.stroke();
 for(const[x,y]of[[16,52],[84,52],[16,26],[84,26]]){q.fillStyle=CPP.o;q.beginPath();q.ellipse(x,y+4,10,6,0,0,7);q.fill();q.fillStyle='#2f6fd0';q.beginPath();q.ellipse(x,y+3,9,5,0,0,7);q.fill()}
 R_(q,CPP.o,6,16,88,44);R_(q,CPP.wd,7,17,86,42);for(let y=17;y<59;y+=7){R_(q,y%14?'#946c40':'#a8804e',7,y,86,6);R_(q,'rgba(0,0,0,.25)',7,y+6,86,1)}R_(q,CPP.wdd,7,52,86,7);R_(q,'rgba(255,240,200,.15)',20,22,40,16);
 for(const x of[40,54]){R_(q,CPP.o,x,6,4,16);R_(q,'#c8ccd4',x+1,6,2,16)}for(let y=8;y<20;y+=5)R_(q,'#8a8f96',41,y,15,1);R_(q,'#d8403a',72,22,14,6);R_(q,'#f4f0e4',72,24,14,2)}
// ----- a long table on its side: a barricade -----
function cpTableX(q,v){R_(q,'rgba(0,0,0,.25)',6,42,122,8);R_(q,CPP.o,3,10,124,34);R_(q,CPP.wdd,4,11,122,32);for(let x=4;x<126;x+=12)R_(q,'#5a3c20',x,11,1,32);R_(q,CPP.wd,4,11,122,4);R_(q,'#7a5a36',4,38,122,5);
 // the legs sticking out toward the viewer, a few bullet holes and gouges
 for(const x of[14,112]){R_(q,CPP.o,x-1,0,8,14);R_(q,CPP.wdd,x,0,6,13);R_(q,CPP.o,x-3,2,12,4);R_(q,'#5a3c20',x-2,3,10,2)}for(let i=0;i<7;i++){const x=10+cmH(i,v*9,1)*110,y=16+cmH(i,v*9,2)*22;kpCirc(q,CPP.o,x,y,1.6);R_(q,'#c8a070',x-2,y+2,4,1)}
 R_(q,'rgba(120,20,20,.6)',60,30,22,8);R_(q,'rgba(120,20,20,.6)',72,24,4,10)}
// ----- a bear box: a green steel food locker -----
function cpBear(q){R_(q,'rgba(0,0,0,.25)',4,36,52,6);R_(q,CPP.o,2,4,52,36);R_(q,'#3a5a3a',3,16,50,23);R_(q,'#4e7a4a',3,5,50,11);R_(q,'#5e8a58',3,5,50,2);R_(q,'#2e4a2e',3,16,50,1);for(const x of[10,44])R_(q,'#8a8f96',x,10,3,4);
 R_(q,'#c8ccd4',22,22,12,4);R_(q,'#5a5e66',26,23,4,2);R_(q,'#e8e4dc',6,26,14,10);q.fillStyle='#2a1a10';q.beginPath();q.ellipse(13,32,4,3,0,0,7);q.fill();q.fillRect(9,29,2,2);q.fillRect(15,29,2,2);kpText(q,'BEAR',43,31,14,5,'#e8e4dc')}
// ----- an outhouse (tall): shingled roof, the moon on the door -----
function cpOuthouse(q,v){R_(q,'rgba(0,0,0,.25)',6,74,44,6);R_(q,CPP.o,6,26,40,52);R_(q,'#8a6440',7,27,38,50);for(let x=7;x<45;x+=6)R_(q,'#6a4a2a',x,27,1,50);
 q.fillStyle=CPP.o;q.beginPath();q.moveTo(2,30);q.lineTo(26,10);q.lineTo(50,30);q.closePath();q.fill();q.fillStyle='#5a5e5a';q.beginPath();q.moveTo(5,28);q.lineTo(26,12);q.lineTo(47,28);q.closePath();q.fill();for(let y=16;y<28;y+=4){R_(q,'#4a4e4a',26-(y-12)*1.3,y,(y-12)*2.6,1)}
 R_(q,CPP.o,14,38,24,40);R_(q,v>=.5?'#2a1a10':'#9a7448',15,39,22,38);if(v<.5){R_(q,'#7a5432',15,39,22,2);q.fillStyle='#2a1a10';q.beginPath();q.arc(26,46,4,0,7);q.fill();q.fillStyle='#9a7448';q.beginPath();q.arc(28,45,3.5,0,7);q.fill();kpCirc(q,'#c8a050',34,60,1.5)}else{R_(q,'#e8e4dc',22,58,8,6);R_(q,'#9a7448',38,39,8,38);R_(q,CPP.o,38,39,1,38)}}
// ----- a canoe upside down on two sawhorses (*colour*) -----
function cpCanoeUp(q,K){R_(q,'rgba(0,0,0,.25)',8,38,116,6);for(const x of[24,104]){q.strokeStyle=CPP.o;q.lineWidth=4;q.beginPath();q.moveTo(x-10,42);q.lineTo(x,24);q.lineTo(x+10,42);q.stroke();q.strokeStyle=CPP.wd;q.lineWidth=2;q.beginPath();q.moveTo(x-10,42);q.lineTo(x,24);q.lineTo(x+10,42);q.stroke()}
 q.fillStyle=CPP.o;q.beginPath();q.moveTo(2,22);q.quadraticCurveTo(20,6,65,6);q.quadraticCurveTo(110,6,128,22);q.quadraticCurveTo(110,30,65,30);q.quadraticCurveTo(20,30,2,22);q.fill();q.fillStyle=K.b;q.beginPath();q.moveTo(5,22);q.quadraticCurveTo(22,8,65,8);q.quadraticCurveTo(108,8,125,22);q.quadraticCurveTo(108,28,65,28);q.quadraticCurveTo(22,28,5,22);q.fill();
 q.fillStyle=K.l;q.beginPath();q.moveTo(12,18);q.quadraticCurveTo(40,9,65,9);q.quadraticCurveTo(90,9,118,18);q.lineTo(118,15);q.quadraticCurveTo(90,8,65,8);q.quadraticCurveTo(40,8,12,15);q.fill();R_(q,K.d,10,24,110,2);R_(q,'#e8e4dc',58,13,14,3)}
// ----- a hammock between two posts -----
function cpHammock(q,K){for(const x of[6,130]){R_(q,CPP.o,x-1,6,8,38);R_(q,CPP.lgd,x,6,6,36);R_(q,CPP.lgl,x,6,2,36)}q.strokeStyle='#d8c8a0';q.lineWidth=1;for(const[a,b]of[[12,30],[128,110]]){q.beginPath();q.moveTo(a,12);q.lineTo(b,22);q.stroke();q.beginPath();q.moveTo(a,12);q.lineTo(b,30);q.stroke()}
 q.fillStyle=CPP.o;q.beginPath();q.moveTo(30,20);q.quadraticCurveTo(70,46,110,20);q.lineTo(110,32);q.quadraticCurveTo(70,52,30,32);q.closePath();q.fill();const C=[K.b,'#f4f0e4',K.d,'#f4f0e4'];for(let i=0;i<8;i++){const t0=i/8,t1=(i+1)/8,x0=30+80*t0,x1=30+80*t1;q.fillStyle=C[i%4];q.beginPath();q.moveTo(x0,21+20*Math.sin(Math.PI*t0)*.9);q.lineTo(x1,21+20*Math.sin(Math.PI*t1)*.9);q.lineTo(x1,31+18*Math.sin(Math.PI*t1));q.lineTo(x0,31+18*Math.sin(Math.PI*t0));q.closePath();q.fill()}
 R_(q,'#e8e4dc',36,22,12,8);R_(q,'#c8c4b8',36,28,12,2)}
// ----- the camp notice board (your text, the big note): a little roof, pinned papers -----
function cpNotice(q,t){R_(q,'rgba(0,0,0,.25)',8,80,66,6);for(const x of[10,66]){R_(q,CPP.o,x-1,18,8,66);R_(q,CPP.lgd,x,18,6,64);R_(q,CPP.lgl,x,18,2,64)}
 q.fillStyle=CPP.o;q.beginPath();q.moveTo(0,16);q.lineTo(40,2);q.lineTo(80,16);q.closePath();q.fill();q.fillStyle='#6a4a2a';q.beginPath();q.moveTo(3,15);q.lineTo(40,4);q.lineTo(77,15);q.closePath();q.fill();R_(q,'#8a6440',2,14,76,3);
 R_(q,CPP.o,6,20,68,42);R_(q,'#b8884a',7,21,66,40);for(let i=0;i<14;i++)R_(q,'rgba(120,80,40,.4)',9+cmH(i,1,1)*60,23+cmH(i,2,1)*34,2,2);
 for(const[x,y,w,h,c]of[[9,23,14,16,'#f4f0e4'],[56,24,14,12,'#e8e0a0'],[10,44,12,14,'#a8d0e8'],[58,42,12,16,'#f4f0e4']]){R_(q,'rgba(0,0,0,.2)',x+1,y+1,w,h);R_(q,c,x,y,w,h);for(let k=y+3;k<y+h-2;k+=3)R_(q,'rgba(60,60,60,.5)',x+2,k,w-4,1);kpCirc(q,'#d8403a',x+w/2,y+1,1.2)}
 R_(q,'rgba(0,0,0,.2)',25,27,32,30);R_(q,'#f8f4e8',24,26,32,30);kpCirc(q,'#2f6fd0',40,27,1.5);const L=String(t||'BUS LEAVES|6 PM').toUpperCase().split('|');kpText(q,L[0]||'',40,36,28,6,'#c0392b');if(L[1])kpText(q,L[1],40,45,28,6,'#c0392b');if(L[2])kpText(q,L[2],40,53,28,5,'#2a2a30')}
// ----- a cabin bunk: log frame, mattresses, sleeping bags; var 0.5 and up: left mid-packing -----
function cpBunk(q,v){const C=['#c0392b','#2f6fd0','#3a8a5a','#e0a030','#8a3a8a'],c1=C[Math.floor(v*97)%5],c2=C[Math.floor(v*61+2)%5],mess=v>=.5;R_(q,'rgba(0,0,0,.25)',6,62,44,8);
 R_(q,CPP.o,3,3,44,64);R_(q,CPP.lgd,4,4,42,62);R_(q,CPP.lg,4,4,4,62);R_(q,CPP.lg,42,4,4,62);R_(q,'#c8a070',4,4,4,4);R_(q,'#c8a070',42,4,4,4);R_(q,'#c8a070',4,62,4,4);R_(q,'#c8a070',42,62,4,4);
 R_(q,'#d8d0bc',8,8,34,54);R_(q,'#c4bca8',8,58,34,4);R_(q,'#f4f0e4',10,10,30,10);R_(q,'#d8d4c8',10,18,30,2);
 if(!mess){const K=pcK(c1);R_(q,CPP.o,9,21,32,38);R_(q,K.b,10,22,30,36);R_(q,K.l,10,22,30,3);R_(q,K.d,24,22,2,36);R_(q,'#c8ccd4',24,24,2,2)}
 else{const K=pcK(c1),K2=pcK(c2);q.fillStyle=CPP.o;q.beginPath();q.moveTo(10,30);q.lineTo(40,24);q.lineTo(40,44);q.lineTo(12,50);q.closePath();q.fill();q.fillStyle=K.b;q.beginPath();q.moveTo(11,31);q.lineTo(39,25);q.lineTo(39,43);q.lineTo(13,49);q.closePath();q.fill();
  R_(q,CPP.o,14,40,26,18);R_(q,K2.b,15,41,24,16);R_(q,K2.d,15,47,24,2);R_(q,'#e8e4dc',18,36,8,6);R_(q,'#d8403a',30,50,8,5);R_(q,'#2f6fd0',12,54,8,5)}}
// ----- a dome tent (*colour*); var 0.5 and up: collapsed -----
function cpDome(q,K,v){const down=v>=.5;q.fillStyle='rgba(0,0,0,.25)';q.beginPath();q.ellipse(52,58,46,12,0,0,7);q.fill();
 // guy lines and stakes
 q.strokeStyle='#d8d0b8';q.lineWidth=1;for(const[a,b,c,d]of[[14,40,2,62],[90,40,100,62],[30,22,8,10],[74,22,96,10]]){q.beginPath();q.moveTo(a,b);q.lineTo(c,d);q.stroke();R_(q,'#8a8f96',c-1,d-1,3,3)}
 if(down){q.fillStyle=CPP.o;q.beginPath();q.moveTo(10,58);q.quadraticCurveTo(30,34,54,40);q.quadraticCurveTo(80,30,96,56);q.lineTo(90,64);q.lineTo(14,64);q.closePath();q.fill();q.fillStyle=K.d;q.beginPath();q.moveTo(13,58);q.quadraticCurveTo(30,37,54,42);q.quadraticCurveTo(78,33,93,56);q.lineTo(88,62);q.lineTo(16,62);q.closePath();q.fill();
  q.fillStyle=K.b;q.beginPath();q.moveTo(20,54);q.quadraticCurveTo(34,40,54,44);q.lineTo(52,56);q.closePath();q.fill();q.strokeStyle='#5a5e66';q.lineWidth=2;q.beginPath();q.moveTo(18,52);q.quadraticCurveTo(50,22,62,44);q.lineTo(70,36);q.stroke();R_(q,'#2a2a30',58,52,14,6);return}
 q.fillStyle=CPP.o;q.beginPath();q.moveTo(6,60);q.quadraticCurveTo(10,12,52,10);q.quadraticCurveTo(94,12,98,60);q.closePath();q.fill();q.fillStyle=K.d;q.beginPath();q.moveTo(9,58);q.quadraticCurveTo(13,15,52,13);q.quadraticCurveTo(91,15,95,58);q.closePath();q.fill();
 q.fillStyle=K.b;q.beginPath();q.moveTo(14,56);q.quadraticCurveTo(18,18,52,16);q.quadraticCurveTo(80,18,86,40);q.lineTo(52,56);q.closePath();q.fill();q.fillStyle=K.l;q.beginPath();q.moveTo(20,40);q.quadraticCurveTo(26,20,50,18);q.lineTo(48,24);q.quadraticCurveTo(30,26,24,42);q.closePath();q.fill();
 q.strokeStyle=K.dd;q.lineWidth=1.5;q.beginPath();q.moveTo(8,58);q.quadraticCurveTo(52,-6,96,58);q.stroke();q.beginPath();q.moveTo(52,12);q.lineTo(52,58);q.stroke();
 // the door, zipped half open, a sleeping bag inside
 q.fillStyle=CPP.o;q.beginPath();q.moveTo(38,60);q.quadraticCurveTo(40,32,52,30);q.quadraticCurveTo(64,32,66,60);q.closePath();q.fill();q.fillStyle='#1a1620';q.beginPath();q.moveTo(40,60);q.quadraticCurveTo(42,34,52,32);q.quadraticCurveTo(62,34,64,60);q.closePath();q.fill();
 R_(q,'#3a5a8a',44,50,16,10);R_(q,'#4a6a9a',44,50,16,2);q.fillStyle=K.d;q.beginPath();q.moveTo(52,32);q.quadraticCurveTo(62,34,64,60);q.lineTo(58,60);q.quadraticCurveTo(58,40,52,32);q.fill();R_(q,'#c8ccd4',52,32,1,28)}
// ----- a mic stand -----
function cpMic(q){R_(q,'rgba(0,0,0,.25)',2,52,18,4);q.strokeStyle=CPP.o;q.lineWidth=3;q.beginPath();q.moveTo(10,54);q.lineTo(10,12);q.lineTo(16,6);q.stroke();q.strokeStyle='#5a5e68';q.lineWidth=1.5;q.beginPath();q.moveTo(10,54);q.lineTo(10,12);q.lineTo(16,6);q.stroke();for(const d of[-6,6]){q.strokeStyle=CPP.o;q.lineWidth=2;q.beginPath();q.moveTo(10,54);q.lineTo(10+d,56);q.stroke()}
 R_(q,CPP.o,14,1,6,8);R_(q,'#3a3a42',15,2,4,6);R_(q,'#8a8f96',15,2,4,2)}
// ----- a picnic table with supper still on it; var picks what was left -----
function cpPicnic(q,v){R_(q,'rgba(0,0,0,.25)',6,44,72,8);for(const y of[6,40]){R_(q,CPP.o,4,y-1,74,8);R_(q,'#8a6440',5,y,72,6);R_(q,'#a8804e',5,y,72,2)}R_(q,CPP.o,8,12,66,26);R_(q,'#946c40',9,13,64,24);for(let y=13;y<37;y+=6){R_(q,y%12?'#9a7246':'#a8804e',9,y,64,5);R_(q,'rgba(0,0,0,.25)',9,y+5,64,1)}
 for(const x of[14,62])R_(q,CPP.wdd,x,36,6,6);
 // supper: plates, cups, a pot or a lantern, a ketchup bottle
 for(let i=0;i<3+Math.floor(v*3);i++){const x=16+cmH(i,v*7,1)*48,y=17+cmH(i,v*7,2)*14;if(i%3==0){kpCirc(q,CPP.o,x,y,5);kpCirc(q,'#f4f0e4',x,y,4);kpCirc(q,'#d8a050',x,y,1.6)}else if(i%3==1){R_(q,CPP.o,x-3,y-4,6,7);R_(q,['#d8403a','#2f6fd0','#e8d830'][i%3],x-2,y-3,4,5)}else{R_(q,'#c0392b',x-1,y-5,3,8);R_(q,'#f4f0e4',x-1,y-5,3,1)}}
 if(v>.5){kpCirc(q,CPP.o,60,22,7);kpCirc(q,'#5a5e66',60,22,6);kpCirc(q,'#8a8f96',60,21,4);R_(q,CPP.o,66,20,6,2)}else{R_(q,CPP.o,56,14,10,14);R_(q,'#2a6a3a',57,15,8,12);R_(q,'#ffe8a0',58,18,6,6);R_(q,'#2a6a3a',57,15,8,2)}}
// ----- an archery target on its A-frame, arrows in it (var: how many) -----
function cpTarget(q,v){R_(q,'rgba(0,0,0,.25)',6,62,48,7);const leg=(x0,x1)=>{q.strokeStyle=CPP.o;q.lineWidth=6;q.beginPath();q.moveTo(x0,66);q.lineTo(x1,8);q.stroke();q.strokeStyle=CPP.wdd;q.lineWidth=4;q.stroke();q.strokeStyle=CPP.wd;q.lineWidth=1.5;q.stroke()};leg(10,22);leg(50,38);
 R_(q,CPP.o,7,46,46,5);R_(q,CPP.wdd,8,47,44,3);
 // the straw boss and the face: yellow gold, red, blue, black, white
 kpCirc(q,CPP.o,30,28,22);kpCirc(q,'#c8a860',30,28,21);for(let a=0;a<6.28;a+=.5){q.strokeStyle='rgba(120,90,40,.5)';q.lineWidth=1;q.beginPath();q.arc(30,28,19,a,a+.3);q.stroke()}
 for(const[r,c]of[[17,'#f0ece0'],[14,'#2a2a30'],[11,'#2f6fd0'],[8,'#d0392b'],[4.5,'#f0c830']])kpCirc(q,c,30,28,r);q.fillStyle='rgba(255,255,255,.25)';q.beginPath();q.ellipse(25,21,7,3,-.5,0,7);q.fill();
 // arrows: shafts sticking out at the viewer's angle, fletching
 for(let i=0;i<1+Math.floor(v*5);i++){const a=cmH(i,v*9,3)*6.28,r=cmH(i,v*9,4)*15,x=30+Math.cos(a)*r,y=28+Math.sin(a)*r;q.strokeStyle=CPP.o;q.lineWidth=2.5;q.beginPath();q.moveTo(x,y);q.lineTo(x+7,y+9);q.stroke();q.strokeStyle='#c8a070';q.lineWidth=1.2;q.stroke();R_(q,['#d0392b','#f0ece0','#3a8a5a'][i%3],x+6,y+8,3,3)}}
// ----- a tetherball pole, the ball wound part way round it -----
function cpTether(q){R_(q,'rgba(0,0,0,.25)',4,104,24,6);kpCirc(q,'rgba(0,0,0,.25)',14,106,9);R_(q,CPP.o,11,4,8,104);R_(q,'#8a8f96',12,4,6,102);R_(q,'#c8ccd4',12,4,2,102);R_(q,'#5a5e68',16,4,2,102);
 R_(q,CPP.o,9,4,12,4);R_(q,'#d8dce4',10,5,10,2);q.strokeStyle='#e8e0c8';q.lineWidth=1.2;for(let y=8;y<20;y+=3){q.beginPath();q.moveTo(12,y);q.lineTo(18,y+2);q.stroke()}
 q.beginPath();q.moveTo(17,20);q.quadraticCurveTo(24,36,22,48);q.stroke();kpCirc(q,CPP.o,22,54,8);kpCirc(q,'#e8c830',22,54,7);kpCirc(q,'#f8e878',20,52,3);q.strokeStyle='rgba(120,90,20,.6)';q.lineWidth=1;q.beginPath();q.arc(22,54,7,.3,1.4);q.stroke()}
Object.assign(OB,{
// the camp bell on its timber frame (tall), split-log benches, a lifeguard chair (tall)
campbell:Object.assign(ob(70,120,[60,12],q=>cpBell(q)),{wb:1}),
lbench:ob(110,30,[104,12],q=>cpLBench(q)),
lgchair:Object.assign(ob(60,120,[44,14],q=>cpLife(q)),{wb:1}),
// the waterfront: a kayak (*colour*), a kayak rack, life jackets on a rack, the swim raft (on the water), a canoe on sawhorses (*colour*)
kayak:obc(100,26,[92,12],CPCOL,(q,v,K)=>cpKayak(q,K,4,13,92)),
kayakrack:ob(120,80,[112,18],(q,v)=>cpKRack(q,+v||0)),
pfdrack:ob(72,64,[64,10],q=>cpPFD(q)),
raft:ob(100,80,0,q=>cpRaft(q)),
canoeup:obc(130,46,[118,14],CPCOL,(q,v,K)=>cpCanoeUp(q,K)),
// the last stand: a long table on its side
tablex:ob(130,50,[124,20],(q,v)=>cpTableX(q,+v||0)),
// camp life: a bear box, an outhouse (tall; var 0.5 and up: door open), a hammock (*colour*), the notice board (18, "LINE|LINE|LINE")
bearbox:ob(56,42,[52,18],q=>cpBear(q)),
outhouse:Object.assign(ob(52,80,[44,22],(q,v)=>cpOuthouse(q,+v||0)),{wb:1}),
hammock:obc(140,50,0,CPCOL,(q,v,K)=>cpHammock(q,K)),
noticeb:{w:80,h:86,c:[64,8],txt:18,dt:'BUS LEAVES|6 PM',wb:1,f:(g,x,y,v,c,t)=>S2(g,x,y,80,86,q=>cpNotice(q,t))},
// cabins and campsites: a bunk (var 0.5 and up: left mid-packing), a dome tent (*colour*; var 0.5 and up: collapsed), a mic stand, a picnic table with supper on it
campbunk:ob(50,70,[44,54],(q,v)=>cpBunk(q,+v||0)),
dtent:obc(104,68,[88,26],CPTENT,(q,v,K)=>cpDome(q,K,+v||0)),
micstand:ob(22,58,[6,6],q=>cpMic(q)),
cpicnic:ob(82,54,[72,18],(q,v)=>cpPicnic(q,+v||0)),
// games on the green: an archery target (var: arrows in it), a tetherball pole (tall)
archtgt:ob(60,72,[48,12],(q,v)=>cpTarget(q,+v||0)),
tether:Object.assign(ob(30,112,[10,8],q=>cpTether(q)),{wb:1})});
