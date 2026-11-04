//# maps/props/kit-graveyard.js — Kit props for the Graveyard: the glowing mausoleum, sarcophagi, the fire bowl, the funeral (canopy, casket, folding chairs, a dropped umbrella), the cemetery gate (posts, arch, iron gate leaves), small headstones, bare trees, a tipped wheelbarrow, a wooden arrow sign
// ---------- the Graveyard's pieces ----------
// (pictures only, drawn once into the map's background; the shadow moving behind the mausoleum's bars, the hands coming out of the
// ground and the crows are effects in world/kit-graveyard.js)
const GY={o:'#16111c',st:'#8a8a92',sl:'#a5a5ad',sh:'#c8c8d0',sd:'#6c6c74',dk:'#4a4a52',gl:'#ffd24a',gw:'#fff2b0',wd:'#5a3a22',wl:'#7a4f2a',br:'#c8a040'};
const gyE=(q,x,y,rx,ry,c)=>{q.fillStyle=c;q.beginPath();q.ellipse(x,y,rx,ry,0,0,7);q.fill()};
Object.assign(OB,{
// gmausol: the big mausoleum whose barred door glows gold (it lights the path in front of it, pulsing; put a `doorshade` effect on its
// door, 14 px above its foot, for something moving behind the bars, and gold wisps round it)
gmausol:Object.assign(ob(264,206,[256,150],q=>{q.fillStyle=GY.o;q.beginPath();q.moveTo(2,44);q.lineTo(132,2);q.lineTo(262,44);q.closePath();q.fill();q.fillStyle=GY.dk;q.beginPath();q.moveTo(8,42);q.lineTo(132,6);q.lineTo(256,42);q.closePath();q.fill();q.fillStyle='#5b5b63';q.beginPath();q.moveTo(132,6);q.lineTo(256,42);q.lineTo(132,42);q.closePath();q.fill();
 R_(q,GY.o,2,42,260,18);R_(q,GY.sl,4,44,256,14);R_(q,GY.sh,4,44,256,3);kpText(q,'IN MEMORIAM',132,52,150,9,'#5a5a62','Georgia, serif');
 R_(q,GY.o,6,58,252,136);R_(q,GY.st,8,60,248,132);for(let y=66;y<190;y+=12)for(let x=(y/12)%2?8:20;x<252;x+=24)R_(q,'#7c7c84',x,y,1,11);for(let y=72;y<190;y+=12)R_(q,'#7c7c84',8,y,248,1);
 for(const x of[18,84,164,230]){R_(q,GY.o,x-1,60,18,134);R_(q,GY.sh,x,62,16,130);R_(q,GY.sl,x+11,62,5,130);R_(q,GY.o,x-4,60,24,6);R_(q,GY.sl,x-3,61,22,4);R_(q,GY.o,x-4,186,24,8);R_(q,GY.sl,x-3,187,22,6)}
 for(const x of[44,196]){R_(q,GY.o,x-1,98,26,46);R_(q,GY.gl,x+1,100,22,42);R_(q,GY.gw,x+6,104,12,34);R_(q,'#26262c',x+11,100,2,42);R_(q,'#26262c',x+1,119,22,2)}
 R_(q,GY.o,104,88,56,108);R_(q,'#26262c',106,90,52,106);R_(q,GY.gl,112,96,40,98);R_(q,GY.gw,120,104,24,90);R_(q,'#fffbe0',126,112,12,82);for(let i=0;i<5;i++)R_(q,'#26262c',112+i*9,96,3,98);R_(q,'#26262c',112,124,40,3);R_(q,'#26262c',112,160,40,3);
 for(let k=0;k<3;k++){R_(q,GY.o,72-k*10,192+k*5,120+k*20,6);R_(q,k%2?GY.sl:GY.st,73-k*10,193+k*5,118+k*20,4)}}),{wb:1,nr:1,lt:[{dx:0,dy:-60,r:220,i:1,f:'glow',c:'#ffd24a',gs:1.5},{dx:0,dy:-14,r:300,w:20,f:'glow',c:'#ffd27a'},{dx:-76,dy:-85,r:70,i:.7,c:'#ffd24a'},{dx:76,dy:-85,r:70,i:.7,c:'#ffd24a'}]}),
// sarco: a stone sarcophagus (var under 0.34 lid on, under 0.67 lid slid half off, above that the lid broken on the ground beside it)
sarco:ob(70,48,[62,24],(q,v)=>{const k=v<.34?0:v<.67?1:2;R_(q,GY.o,4,22,62,24);R_(q,GY.st,5,23,60,22);R_(q,GY.sd,5,38,60,7);for(const x of[14,30,46])R_(q,'#7c7c84',x,27,8,8);
 R_(q,GY.o,4,8,62,16);R_(q,'#26262c',5,9,60,14);if(k!=1)R_(q,'#3a3038',8,11,54,10);
 if(k==0){R_(q,GY.o,2,4,66,20);R_(q,GY.sl,3,5,64,18);R_(q,GY.sh,3,5,64,3);R_(q,GY.sd,3,19,64,4);R_(q,GY.o,30,8,10,12);R_(q,GY.sh,31,9,8,10);R_(q,GY.o,24,11,22,4);R_(q,GY.sh,25,12,20,2)}
 else if(k==1){R_(q,'#e6e2d3',14,13,8,4);R_(q,'#e6e2d3',24,14,12,3);q.fillStyle=GY.o;q.beginPath();q.moveTo(26,0);q.lineTo(70,6);q.lineTo(68,22);q.lineTo(24,16);q.closePath();q.fill();q.fillStyle=GY.sl;q.beginPath();q.moveTo(27,2);q.lineTo(68,8);q.lineTo(66,20);q.lineTo(25,14);q.closePath();q.fill();R_(q,GY.sh,28,3,38,2)}
 else{R_(q,'#e6e2d3',16,13,10,3);R_(q,'#e6e2d3',36,12,6,6);q.fillStyle=GY.o;q.beginPath();q.moveTo(0,30);q.lineTo(26,22);q.lineTo(30,46);q.lineTo(4,48);q.closePath();q.fill();q.fillStyle=GY.sl;q.beginPath();q.moveTo(2,31);q.lineTo(25,24);q.lineTo(28,44);q.lineTo(5,46);q.closePath();q.fill()}}),
// brazier: a stone fire bowl on a pedestal, the coals glowing (put a `fire` effect 40 px above its foot)
brazier:ob(44,54,[30,12],q=>{R_(q,GY.o,10,42,24,12);R_(q,GY.sd,11,43,22,10);R_(q,GY.o,15,22,14,22);R_(q,GY.st,16,23,12,20);R_(q,GY.sl,16,23,4,20);
 q.fillStyle=GY.o;q.beginPath();q.moveTo(2,10);q.lineTo(42,10);q.lineTo(34,26);q.lineTo(10,26);q.closePath();q.fill();q.fillStyle='#3a3a42';q.beginPath();q.moveTo(4,11);q.lineTo(40,11);q.lineTo(33,24);q.lineTo(11,24);q.closePath();q.fill();gyE(q,22,11,20,5,GY.o);gyE(q,22,11,18,4,'#c8401a');gyE(q,22,11,12,3,'#ff8a2a');gyE(q,22,10,6,2,GY.gl)}),
// ftent: a funeral canopy (hangs over people like a hanging sign; colour), a lantern on each front pole
ftent:Object.assign({w:224,h:152,c:0,ov:1,sw:210,pc:[['#2f4a36','Green'],['#5a1a22','Burgundy'],['#26262c','Black']],f:(g,x,y,v,col)=>S2(g,x,y,224,152,q=>{const K=pcK(pcCol(col,OB.ftent.pc)),c=K.b,d=K.d;
 for(const px of[24,200])R_(q,GY.o,px-2,40,4,40),R_(q,'#9aa0a8',px-1,40,2,40);
 R_(q,GY.o,6,8,212,40);R_(q,c,8,10,208,36);R_(q,K.l,8,10,208,4);for(let x=8;x<214;x+=26)R_(q,d,x,14,2,30);
 for(let x=6;x<218;x+=16){q.fillStyle=GY.o;q.beginPath();q.arc(x+8,46,9,0,Math.PI);q.fill();q.fillStyle=d;q.beginPath();q.arc(x+8,46,7.5,0,Math.PI);q.fill()}R_(q,GY.br,6,44,212,2);
 for(const px of[8,214]){R_(q,GY.o,px-3,48,6,104);R_(q,'#9aa0a8',px-2,48,4,104);R_(q,GY.o,px-6,148,12,4)}
 for(const px of[8,214]){R_(q,GY.o,px-5,76,10,14);R_(q,'#2a2a30',px-4,77,8,12);R_(q,'#ffd27a',px-3,79,6,8);R_(q,GY.o,px-1,70,2,6)}})},{nr:1,lt:[{dx:-104,dy:-69,r:90,i:.85,f:'flk',c:'#ffd27a'},{dx:102,dy:-69,r:90,i:.85,f:'flk',c:'#ffd27a'}]}),
// casket: a casket on its lowering frame over a fresh grave (var 0.5 and up: the lid stands open and it is empty)
casket:ob(100,64,[86,28],(q,v)=>{R_(q,GY.o,6,36,88,26);R_(q,'#0c0a08',8,38,84,22);R_(q,'#3a6a3a',2,34,96,4);R_(q,'#3a6a3a',2,58,96,4);R_(q,'#4a7a44',2,34,96,1);
 R_(q,GY.o,4,30,92,6);R_(q,GY.br,5,31,90,3);for(const x of[6,90])R_(q,GY.o,x-1,30,6,30),R_(q,GY.br,x,31,4,28);
 const open=v>=.5;R_(q,GY.o,14,16,72,18);R_(q,'#3a2416',15,17,70,16);R_(q,'#5a3a22',15,17,70,3);for(const x of[22,48,72])R_(q,GY.br,x,26,8,3);
 if(open){R_(q,GY.o,16,0,68,18);R_(q,'#3a2416',17,1,66,16);R_(q,'#e8e0d0',20,4,60,10);R_(q,'#c8c0b0',20,12,60,2);R_(q,'#e8e0d0',16,14,68,4)}
 else{R_(q,GY.o,12,10,76,10);R_(q,'#4a2e1c',13,11,74,8);R_(q,'#6a4428',13,11,74,2);R_(q,GY.br,46,12,8,4)}}),
// fchair: a white folding chair (var 0.5 and up: knocked over)
fchair:{w:20,h:24,c:0,f:(g,x,y,v)=>S2(g,x,y,20,24,q=>{if(v<.5){R_(q,GY.o,3,2,14,10);R_(q,'#e8e6e0',4,3,12,8);R_(q,'#c8c6c0',4,9,12,2);R_(q,GY.o,2,12,16,6);R_(q,'#f4f2ec',3,13,14,4);for(const x of[3,15])R_(q,GY.o,x,17,2,7)}
 else{R_(q,GY.o,1,12,18,8);R_(q,'#e8e6e0',2,13,16,6);R_(q,GY.o,5,6,4,8);R_(q,'#c8c6c0',6,7,2,6);R_(q,GY.o,12,4,6,10);R_(q,'#f4f2ec',13,5,4,8);R_(q,GY.o,2,20,16,2)}})},
// brolly: a black umbrella dropped open on the grass
brolly:{w:38,h:22,c:0,f:(g,x,y,v)=>S2(g,x,y,38,22,q=>{q.fillStyle=GY.o;q.beginPath();q.moveTo(2,18);q.quadraticCurveTo(10,0,30,4);q.lineTo(34,20);q.closePath();q.fill();q.fillStyle='#26262c';q.beginPath();q.moveTo(5,17);q.quadraticCurveTo(12,3,29,6);q.lineTo(32,18);q.closePath();q.fill();q.strokeStyle='#4a4a52';q.lineWidth=1;for(const[a,b]of[[12,8],[20,5],[26,6]]){q.beginPath();q.moveTo(31,17);q.lineTo(a,b);q.stroke()}R_(q,GY.o,30,16,7,3);R_(q,'#8a5a2c',31,17,5,1)})},
// irongate: one wrought-iron gate leaf hanging open (var under 0.5 the left one, else the right one)
irongate:{w:54,h:76,c:0,f:(g,x,y,v)=>S2(g,x,y,54,76,q=>{if(v>=.5){q.translate(54,0);q.scale(-1,1)}q.strokeStyle=GY.o;q.lineWidth=4;const L=(a,b,c,d)=>{q.beginPath();q.moveTo(a,b);q.lineTo(c,d);q.stroke()};
 for(const st of[GY.o,'#3a3a44']){q.strokeStyle=st;q.lineWidth=st==GY.o?4:2;L(4,74,48,52);L(4,30,48,8);for(let i=0;i<6;i++){const x=4+i*8.8,y0=74-i*4.4,y1=30-i*4.4;L(x,y0,x,y1-6)}L(4,56,48,34)}
 q.fillStyle='#3a3a44';for(let i=0;i<6;i++){const x=4+i*8.8,y1=24-i*4.4;q.beginPath();q.moveTo(x-3,y1+2);q.lineTo(x,y1-4);q.lineTo(x+3,y1+2);q.fill()}})},
// cemarch: the stone arch over a cemetery gate with a name plaque (your text); it hangs over people. Stand a `cempost` under each
// end, 76 px either side of it, 90 px below it (the arch's foot sits on the posts' caps).
cemarch:{w:220,h:124,c:0,ov:1,sw:160,txt:18,dt:'EVERGREEN REST',f:(g,x,y,v,col,t)=>S2(g,x,y,220,124,q=>{const T=(cmTxt(t,18)||'EVERGREEN REST').toUpperCase();
 q.lineCap='butt';q.strokeStyle=GY.o;q.lineWidth=40;q.beginPath();q.arc(110,124,76,Math.PI,0);q.stroke();q.strokeStyle=GY.st;q.lineWidth=34;q.stroke();q.strokeStyle=GY.sl;q.lineWidth=4;q.beginPath();q.arc(110,124,91,Math.PI*1.02,-Math.PI*.02);q.stroke();
 q.strokeStyle='#7c7c84';q.lineWidth=1;for(let a=Math.PI*1.08;a<Math.PI*1.95;a+=Math.PI/9){q.beginPath();q.moveTo(110+Math.cos(a)*60,124+Math.sin(a)*60);q.lineTo(110+Math.cos(a)*93,124+Math.sin(a)*93);q.stroke()}
 R_(q,GY.o,98,2,24,22);R_(q,GY.sl,100,4,20,18);R_(q,GY.o,108,0,4,6);R_(q,GY.o,46,22,128,24);R_(q,'#2a2a30',48,24,124,20);R_(q,GY.br,48,24,124,2);R_(q,GY.br,48,42,124,2);kpText(q,T,110,34,116,11,'#e8d8a0','Georgia, serif')})},
// cempost: a stone gate post with a lantern on its face (the lantern flickers)
cempost:Object.assign(ob(48,104,[42,22],q=>{R_(q,GY.o,0,92,48,12);R_(q,GY.sd,1,93,46,10);R_(q,GY.o,4,14,40,80);R_(q,GY.st,6,16,36,76);R_(q,GY.sl,6,16,8,76);R_(q,GY.sd,34,16,8,76);for(let y=28;y<92;y+=14)R_(q,'#7c7c84',6,y,36,1);
 R_(q,GY.o,0,6,48,12);R_(q,GY.sh,1,7,46,10);R_(q,GY.sl,1,14,46,3);R_(q,GY.o,16,0,16,8);R_(q,GY.sl,17,1,14,6);
 R_(q,GY.o,16,30,16,22);R_(q,'#26262c',17,31,14,20);R_(q,GY.gl,19,34,10,14);R_(q,GY.gw,21,37,6,8);R_(q,'#26262c',23,34,2,14);R_(q,GY.o,14,28,20,3)}),{wb:1,nr:1,lt:[{dx:0,dy:-63,r:120,i:.9,f:'flk',c:'#ffd27a'}]}),
// g_small: a small square headstone with a cross cut in it
g_small:ob(18,22,[14,10],q=>{gyE(q,9,20,9,2.5,'rgba(0,0,0,.25)');R_(q,'#222',1,2,16,18);R_(q,'#9a9aa2',2,3,14,15);R_(q,'#b4b4bc',2,3,14,2);R_(q,'#6c6c74',8,6,2,9);R_(q,'#6c6c74',5,9,8,2)}),
// baretree: a small bare tree
baretree:ob(34,46,[8,6],(q,v)=>{q.lineCap='round';const L=(a,b,c,d,w)=>{q.strokeStyle=GY.o;q.lineWidth=w+2;q.beginPath();q.moveTo(a,b);q.lineTo(c,d);q.stroke();q.strokeStyle='#3a2f28';q.lineWidth=w;q.beginPath();q.moveTo(a,b);q.lineTo(c,d);q.stroke()};const f=v>.5?-1:1;
 L(17,44,17,8,4);L(17,26,17-14*f,12,3);L(17,20,17+13*f,6,3);L(17-8*f,18,17-12*f,10,2);L(17+6*f,13,17+5*f,2,2);q.lineCap='butt'}),
// wheelbx: a wheelbarrow tipped on its side, dirt spilled
wheelbx:{w:52,h:30,c:0,f:(g,x,y,v)=>S2(g,x,y,52,30,q=>{gyE(q,16,24,16,5,'#4a3a28');gyE(q,14,22,10,3,'#5e4a34');q.fillStyle=GY.o;q.beginPath();q.moveTo(20,4);q.lineTo(44,8);q.lineTo(40,26);q.lineTo(22,22);q.closePath();q.fill();q.fillStyle='#2f6a3a';q.beginPath();q.moveTo(22,6);q.lineTo(42,10);q.lineTo(38,24);q.lineTo(24,20);q.closePath();q.fill();
 gyE(q,44,22,6,6,GY.o);gyE(q,44,22,4,4,'#3a3a40');R_(q,GY.o,8,10,14,3);R_(q,'#8a5a2c',9,11,12,1)})},
// postsign: a wooden arrow sign on a post (your text: line 1|line 2); the arrow points up the map
postsign:{w:116,h:52,c:[8,8],txt:24,dt:'MANSION|THIS WAY',f:(g,x,y,v,col,t)=>S2(g,x,y,116,52,q=>{const[a,b]=kpLines(cmTxt(t,24)||'MANSION|THIS WAY');R_(q,GY.o,0,4,9,48);R_(q,GY.wd,1,5,7,46);
 R_(q,GY.o,8,6,106,30);R_(q,'#8a6a3a',9,7,104,28);R_(q,'#6a4a28',9,20,104,2);kpText(q,a.toUpperCase(),54,14,84,10,'#e8d8a8');if(b)kpText(q,b.toUpperCase(),54,28,84,10,'#e8d8a8');
 q.fillStyle=GY.o;q.beginPath();q.moveTo(102,10);q.lineTo(110,26);q.lineTo(94,26);q.fill();q.fillStyle='#e8d8a8';q.beginPath();q.moveTo(102,12);q.lineTo(108,24);q.lineTo(96,24);q.fill();R_(q,'#e8d8a8',100,23,4,8)})}});
// the gate posts, the big mausoleum, sarcophagi and the fire bowl stand tall: walk-behind
for(const k of['sarco','brazier','casket'])OB[k].wb=1;
OB.cemarch.dk=1;OB.irongate.dk=1;OB.cempost.dk=1;
