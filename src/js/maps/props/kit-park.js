//# maps/props/kit-park.js — Kit props for Zombville City Park: skate park pieces seen from above (quarter pipe, funbox, grind rail, ledge, mini ramp, kicker, stair set), the courts (basketball hoop and bleachers from above, an umpire's chair, a ball cart), the dog park's agility gear (A-frame, tunnel, weave poles, bar jump, tyre jump, a dog fountain, a bag dispenser), playground extras (spring riders, a seesaw, a tyre swing, a climbing dome, a shade sail that hangs over people), and the park's furniture (a cast-iron bench, trash and recycling bins, the map kiosk, the founder's statue, a picnic pavilion that hangs over people, a chalkboard sign, an ice cream cart, a life ring, a stroller)
// ---------- City Park's pieces ----------
const PKX={o:'#16111c',w:'#f4f4f0',st:'#c8ccd4',std:'#8a8f96',sk:'#5a5e68',ir:'#26262c',cn:'#b4b0a4',cnl:'#cac6ba',cnd:'#8e8a7e',wd:'#a8783e',wdl:'#c8985a',wdd:'#7a5428',y:'#f0c419'};
const PKBENCH=[['#a8783e','Wood'],['#3f7a46','Green'],['#5a4030','Dark wood'],['#2f5a8a','Blue']];
const PKPLAY=[['#d8403a','Red'],['#2f6fd0','Blue'],['#e0b020','Yellow'],['#3aa06a','Green'],['#8a5ab8','Purple']];
const PKSAIL=[['#e8783a','Orange'],['#3aa0c8','Teal'],['#e8c040','Yellow'],['#d8406a','Pink'],['#f4f0e4','White']];
const PKTUN=[['#2f6fd0','Blue'],['#d8403a','Red'],['#3aa06a','Green'],['#e8783a','Orange']];
const PKROOF=[['#8a3a2a','Red shingles'],['#3a5a3a','Green shingles'],['#5a4a3e','Brown shingles'],['#4a5260','Slate']];
function pkBand(q,x,y,w,h,C,vert){const n=C.length;for(let i=0;i<n;i++){q.fillStyle=C[i];if(vert)q.fillRect(x+w*i/n,y,w/n+1,h);else q.fillRect(x,y+h*i/n,w,h/n+1)}}
function pkLn(q,c,w,P){q.strokeStyle=c;q.lineWidth=w;q.lineCap='round';q.beginPath();P.forEach((p,i)=>i?q.lineTo(p[0],p[1]):q.moveTo(p[0],p[1]));q.stroke();q.lineCap='butt'}
// a little spray tag on concrete
function pkTag(q,x,y,c,v){q.strokeStyle=c;q.lineWidth=2;q.beginPath();q.moveTo(x,y);for(let k=1;k<6;k++)q.lineTo(x+k*4,y+(k%2?-4:3)*(.6+cmH(v*99,k,68)*.6));q.stroke()}
// ----- skate park (from above; turn them) -----
function pkQp(q,w,h,v){R_(q,PKX.cnd,0,0,w,14);R_(q,PKX.cnl,0,0,w,4);R_(q,PKX.sk,0,6,w,2);for(let x=6;x<w;x+=24)R_(q,PKX.sk,x,4,3,8);R_(q,PKX.o,0,13,w,5);R_(q,PKX.st,0,14,w,2);
 pkBand(q,0,18,w,h-18,['#7e7a6e','#88847a','#928e84','#9c988c','#a6a296','#b0ac9e','#b8b4a8']);R_(q,'rgba(0,0,0,.18)',0,18,3,h-18);R_(q,'rgba(0,0,0,.18)',w-3,18,3,h-18);if(v>.4)pkTag(q,w*.3+v*20,h*.62,v>.7?'#d8403a':'#2f6fd0',v)}
function pkMini(q,w,h){const dk=22;for(const L of[0,1]){const x0=L?w-dk:0;R_(q,PKX.cnd,x0,0,dk,h);R_(q,PKX.cnl,x0+(L?dk-4:0),0,4,h);R_(q,PKX.sk,x0+(L?6:dk-8),0,2,h)}
 const T=['#7e7a6e','#8a867a','#969286','#a29e92','#aeaa9e'],tw=(w-dk*2)*.34;pkBand(q,dk,0,tw,h,T,1);pkBand(q,w-dk-tw,0,tw,h,T.slice().reverse(),1);R_(q,'#b4b0a4',dk+tw,0,w-dk*2-tw*2,h);
 R_(q,PKX.o,dk-1,0,4,h);R_(q,PKX.st,dk,0,2,h);R_(q,PKX.o,w-dk-3,0,4,h);R_(q,PKX.st,w-dk-2,0,2,h);R_(q,'rgba(0,0,0,.2)',0,0,w,3);R_(q,'rgba(0,0,0,.2)',0,h-3,w,3);pkTag(q,w/2-10,h/2,'#e0b020',.4)}
// ----- the courts -----
function pkHoop(q){q.fillStyle='rgba(0,0,0,.18)';q.beginPath();q.ellipse(40,22,14,8,0,0,7);q.fill();R_(q,'#2f5a9a',24,56,16,12);R_(q,'#4a7ac8',25,57,14,3);R_(q,PKX.ir,29,24,6,38);R_(q,'#5a5e68',30,24,2,38);
 R_(q,PKX.o,6,16,52,9);R_(q,PKX.w,7,17,50,7);R_(q,'#d8403a',25,18,14,5);R_(q,PKX.w,27,19,10,3);R_(q,PKX.o,29,24,6,3);
 q.strokeStyle=PKX.o;q.lineWidth=4;q.beginPath();q.arc(32,10,8,0,7);q.stroke();q.strokeStyle='#e8601c';q.lineWidth=2;q.beginPath();q.arc(32,10,8,0,7);q.stroke();
 q.strokeStyle='rgba(250,250,245,.8)';q.lineWidth=1;for(let a=0;a<6.28;a+=.7){q.beginPath();q.moveTo(32+Math.cos(a)*7,10+Math.sin(a)*7);q.lineTo(32+Math.cos(a+.5)*3,10+Math.sin(a+.5)*3);q.stroke()}}
function pkBleach(q,w,h){const n=5,rh=(h-8)/n;R_(q,PKX.sk,0,0,4,h);R_(q,PKX.sk,w-4,0,4,h);R_(q,PKX.st,0,0,w,3);
 for(let i=0;i<n;i++){const y=4+i*rh;R_(q,'#7a7e86',4,y,w-8,rh);R_(q,i<2?'#d8dce2':'#c8ccd4',4,y,w-8,rh*.55);R_(q,PKX.w,4,y,w-8,1.5);R_(q,'rgba(0,0,0,.25)',4,y+rh-2,w-8,2)}for(let x=24;x<w-10;x+=40)R_(q,'rgba(0,0,0,.2)',x,4,2,h-8)}
// ----- dog park -----
function pkTunnel(q,w,h,K){const P=(o)=>{q.beginPath();q.moveTo(8,h/2+o);q.bezierCurveTo(w*.35,h*.05+o,w*.65,h*.95+o,w-8,h/2+o);q.stroke()};q.lineCap='round';q.strokeStyle='rgba(0,0,0,.2)';q.lineWidth=h-6;P(3);q.strokeStyle=PKX.o;q.lineWidth=h-4;P(0);q.strokeStyle=K.b;q.lineWidth=h-6;P(0);q.strokeStyle=K.l;q.lineWidth=(h-6)*.35;P(-(h-6)*.22);q.lineCap='butt';
 q.strokeStyle=K.d;q.lineWidth=2;for(let i=1;i<12;i++){const t=i/12,x=(1-t)**3*8+3*(1-t)**2*t*w*.35+3*(1-t)*t*t*w*.65+t**3*(w-8),y=(1-t)**3*h/2+3*(1-t)**2*t*h*.05+3*(1-t)*t*t*h*.95+t**3*h/2;q.beginPath();q.moveTo(x-1,y-(h-8)/2);q.lineTo(x+1,y+(h-8)/2);q.stroke()}
 for(const x of[8,w-8]){q.fillStyle=PKX.o;q.beginPath();q.ellipse(x,h/2,5,(h-6)/2,0,0,7);q.fill();q.fillStyle='#0a0a0e';q.beginPath();q.ellipse(x,h/2,3.5,(h-10)/2,0,0,7);q.fill()}}
// ----- the park -----
function pkStatue(q){R_(q,'#6e6a62',4,96,48,30);R_(q,'#8a867c',4,96,48,4);R_(q,'#5a564e',4,120,48,6);R_(q,'#9a968c',8,84,40,14);R_(q,'#aeaaa0',8,84,40,3);R_(q,'#6e6a62',2,94,52,3);R_(q,'#a8803a',18,104,20,10);R_(q,'#c8a050',19,105,18,2);for(let k=0;k<3;k++)R_(q,'#7a5a22',21,108+k*2,14,1);
 // the founder in his long coat, pointing the way, a pigeon on his hat
 const B='#6a5a3a',BL='#8a7a4a',BD='#4a3e28',PT='#5a8a70';R_(q,BD,20,62,7,22);R_(q,BD,29,62,7,22);R_(q,B,17,34,22,34);R_(q,BL,18,34,5,32);R_(q,PT,33,40,4,10);R_(q,B,15,62,26,8);R_(q,BD,17,36,2,26);
 R_(q,B,37,34,5,8);q.fillStyle=B;q.beginPath();q.moveTo(39,34);q.lineTo(52,16);q.lineTo(55,19);q.lineTo(42,38);q.closePath();q.fill();R_(q,BL,52,14,4,4);R_(q,B,13,36,5,22);R_(q,BD,13,56,5,4);
 R_(q,B,22,22,12,13);R_(q,BL,23,23,3,10);R_(q,BD,22,33,12,2);R_(q,BD,19,18,18,5);R_(q,B,23,8,10,11);R_(q,BL,24,9,2,9);R_(q,PT,29,12,3,4);R_(q,PKX.w,25,3,8,6);R_(q,'#a8acb4',27,6,6,3);R_(q,'#e8781e',32,5,2,1)}
function pkPavil(q,w,h,K){R_(q,K.dd,0,0,w,h);const cx=w/2,cy=h/2,rx=w/2-h/2,tri=(c,P)=>{q.fillStyle=c;q.beginPath();P.forEach((p,i)=>i?q.lineTo(p[0],p[1]):q.moveTo(p[0],p[1]));q.closePath();q.fill()};
 tri(K.l,[[3,3],[w-3,3],[cx+rx,cy],[cx-rx,cy]]);tri(K.d,[[3,h-3],[w-3,h-3],[cx+rx,cy],[cx-rx,cy]]);tri(K.b,[[3,3],[cx-rx,cy],[3,h-3]]);tri(K.b,[[w-3,3],[cx+rx,cy],[w-3,h-3]]);
 q.save();q.beginPath();q.rect(3,3,w-6,h-6);q.clip();q.fillStyle='rgba(0,0,0,.16)';for(let y=10;y<h;y+=8)q.fillRect(3,y,w-6,1.5);for(let x=10;x<w;x+=8)q.fillRect(x,3,1,h-6);q.restore();
 pkLn(q,K.dd,2,[[3,3],[cx-rx,cy],[3,h-3]]);pkLn(q,K.dd,2,[[w-3,3],[cx+rx,cy],[w-3,h-3]]);pkLn(q,K.ll,3,[[cx-rx,cy],[cx+rx,cy]]);
 R_(q,PKX.o,cx-12,cy-12,24,24);R_(q,'#d8d4c8',cx-11,cy-11,22,22);R_(q,K.d,cx-9,cy-9,18,18);R_(q,K.ll,cx-9,cy-9,18,4);R_(q,'#c8a050',cx-1,cy-15,2,6);
 R_(q,'rgba(0,0,0,.25)',0,h-3,w,3);R_(q,'rgba(255,255,255,.15)',0,0,w,2)}
Object.assign(OB,{
// skate park: quarter pipe (the coping and deck at the top of the picture: turn it to face where the ramp runs out), funbox, grind
// rail, ledge, mini ramp, kicker, a stair set with its handrail (walk up and down it)
qpipe:ob(120,72,[116,68],(q,v)=>pkQp(q,120,72,+v||0)),
funbox:ob(170,96,[166,92],(q,v)=>{const T=['#7e7a6e','#8a867a','#969286','#a29e92','#aeaa9e'];pkBand(q,0,0,50,96,T,1);pkBand(q,120,0,50,96,T.slice().reverse(),1);R_(q,PKX.cnl,50,0,70,96);R_(q,'#d4d0c4',50,0,70,4);
 for(const x of[50,118]){R_(q,PKX.o,x-1,0,4,96);R_(q,PKX.st,x,0,2,96)}R_(q,PKX.o,50,4,70,4);R_(q,PKX.st,50,5,70,2);R_(q,'rgba(0,0,0,.2)',0,92,170,4);R_(q,PKX.sk,54,46,62,3);R_(q,PKX.st,54,46,62,1);pkTag(q,130,60,'#8a5ab8',+v||0)}),
grindrail:ob(140,20,[136,10],q=>{R_(q,'rgba(0,0,0,.2)',4,13,134,5);for(const x of[8,68,128]){R_(q,PKX.sk,x,8,5,10);R_(q,PKX.o,x-1,16,7,3)}R_(q,PKX.o,0,4,140,7);R_(q,'#9aa0a8',1,5,138,5);R_(q,'#e4e8ee',1,5,138,2);R_(q,'rgba(240,200,60,.5)',30,6,60,1)}),
skledge:ob(130,30,[126,26],q=>{R_(q,PKX.cnd,0,8,130,22);R_(q,PKX.cnl,0,0,130,10);R_(q,'#d8d4c8',0,0,130,3);R_(q,PKX.o,0,9,130,3);R_(q,PKX.st,0,9,130,2);R_(q,'rgba(60,50,30,.25)',20,2,40,4);R_(q,'rgba(60,50,30,.25)',80,3,28,3);R_(q,'rgba(0,0,0,.2)',0,26,130,4)}),
minirmp:ob(220,110,[216,106],q=>pkMini(q,220,110)),
kicker:ob(52,44,[48,40],q=>{pkBand(q,0,8,52,36,['#8a6a3e','#9a7a48','#aa8a52','#ba9a5e'],0);for(let x=6;x<52;x+=8)R_(q,'rgba(60,40,20,.35)',x,8,1,36);R_(q,PKX.o,0,5,52,4);R_(q,PKX.st,0,6,52,2);R_(q,PKX.sk,0,0,52,5);R_(q,'rgba(0,0,0,.2)',0,40,52,4)}),
skstairs:{w:110,h:84,c:0,f:(g,x,y)=>S2(g,x,y,110,84,q=>{R_(q,PKX.cnl,0,0,110,16);for(let i=0;i<5;i++){const y_=16+i*13;R_(q,i%2?'#a8a498':'#b0aca0',0,y_,110,13);R_(q,'#d4d0c4',0,y_,110,2);R_(q,'rgba(0,0,0,.25)',0,y_+11,110,2)}
 R_(q,PKX.o,52,6,6,78);R_(q,'#9aa0a8',53,6,4,78);R_(q,'#e4e8ee',53,6,2,78);for(const y_ of[8,46,80])R_(q,PKX.sk,52,y_,6,4)})},
// the courts: a basketball hoop from above (its foot is the pole; the rim points up the screen at 0°, so turn it 180° for the far
// end), bleachers from above (front row at the bottom; turn them), an umpire's chair, a cart of balls
bhoop:{w:64,h:70,c:[12,10],f:(g,x,y)=>S2(g,x,y,64,70,pkHoop)},
bleach:ob(170,80,[166,76],q=>pkBleach(q,170,80)),
umpchair:Object.assign(ob(34,86,[22,12],q=>{for(const x of[5,25]){R_(q,'#2e6a3e',x,30,4,56)}R_(q,'#2e6a3e',3,30,28,3);for(let y=40;y<84;y+=9)R_(q,'#3a7a4a',7,y,20,2);R_(q,'#2e6a3e',2,22,30,8);R_(q,'#4a8a5a',2,22,30,2);R_(q,'#2e6a3e',4,6,26,16);R_(q,'#3a7a4a',5,7,24,3);
 R_(q,PKX.w,8,12,18,4);R_(q,PKX.o,3,82,8,4);R_(q,PKX.o,23,82,8,4)}),{wb:1}),
ballcart:ob(30,38,[22,10],q=>{R_(q,PKX.sk,4,10,22,20);for(let i=0;i<14;i++){const x=7+(i%5)*4,y=12+Math.floor(i/5)*5;kpCirc(q,PKX.o,x+1,y+1,2.6);kpCirc(q,'#d8f040',x+1,y+1,2)}q.strokeStyle=PKX.std;q.lineWidth=1;for(let x=6;x<26;x+=4){q.beginPath();q.moveTo(x,10);q.lineTo(x,30);q.stroke()}
 R_(q,PKX.std,4,30,22,2);R_(q,PKX.o,4,32,6,6);R_(q,PKX.o,20,32,6,6);R_(q,PKX.sk,22,0,2,12);R_(q,PKX.o,18,0,10,3)}),
// the dog park: A-frame (from above: the ridge across its middle, yellow contact zones at the ends; turn it), tunnel (*colour*),
// weave poles, a bar jump, a tyre jump, a fountain with a dog bowl, a bag dispenser and bin
aframe:ob(120,44,[116,40],q=>{pkBand(q,0,4,60,40,['#8a8f96','#9aa0a8','#a8aeb6','#b4bac2'],1);pkBand(q,60,4,60,40,['#7a7e86','#6e727a','#64686e','#5a5e64'],1);R_(q,PKX.y,0,4,22,40);R_(q,'#c8a010',98,4,22,40);
 for(let x=6;x<120;x+=8)R_(q,'rgba(0,0,0,.22)',x,4,1,40);R_(q,PKX.o,58,2,4,44);R_(q,'#d8dce2',59,2,2,44);R_(q,PKX.sk,0,2,120,2);R_(q,PKX.sk,0,42,120,2)}),
dtunnel:obc(130,36,[126,30],PKTUN,(q,v,K)=>pkTunnel(q,130,36,K)),
weave:ob(160,18,[156,8],q=>{R_(q,PKX.sk,2,8,156,4);R_(q,PKX.std,2,8,156,1);for(let i=0;i<12;i++){const x=8+i*13;kpCirc(q,PKX.o,x,9,3.6);kpCirc(q,i%2?'#f4f4f0':'#2f6fd0',x,9,2.7);R_(q,'rgba(255,255,255,.5)',x-1,7,1,1)}}),
dhurdle:ob(64,34,[60,6],q=>{for(const x of[4,56]){R_(q,PKX.w,x,4,5,28);R_(q,'#c8ccd4',x+3,4,2,28);R_(q,PKX.sk,x-2,30,9,4)}for(let i=0;i<10;i++)R_(q,i%2?PKX.w:'#d8403a',9+i*4.7,14,4.7,4);R_(q,'#2f6fd0',0,8,4,16);R_(q,'#2f6fd0',60,8,4,16)}),
tirejump:ob(64,64,[60,8],q=>{R_(q,'#2f6fd0',4,2,4,60);R_(q,'#2f6fd0',56,2,4,60);R_(q,'#2f6fd0',4,2,56,4);R_(q,'#4a8ae8',4,2,56,1);R_(q,PKX.sk,0,58,12,5);R_(q,PKX.sk,52,58,12,5);pkLn(q,PKX.std,1,[[32,6],[32,16]]);pkLn(q,PKX.std,1,[[10,34],[18,34]]);pkLn(q,PKX.std,1,[[46,34],[54,34]]);
 q.strokeStyle=PKX.o;q.lineWidth=9;q.beginPath();q.arc(32,34,15,0,7);q.stroke();q.strokeStyle='#2a2a2e';q.lineWidth=7;q.stroke();q.strokeStyle='#3e3e44';q.lineWidth=2;q.beginPath();q.arc(32,34,17,3.6,5.4);q.stroke();R_(q,PKX.y,26,46,12,3)}),
dogfount:ob(36,46,[26,10],q=>{R_(q,'#3f7a46',10,14,14,26);R_(q,'#4f8a56',10,14,4,26);R_(q,'#2e5e36',6,8,24,8);R_(q,'#c8ccd4',8,8,20,4);R_(q,'#7ab8e8',10,9,16,2);R_(q,PKX.st,17,4,3,5);R_(q,'#2e5e36',6,38,26,6);R_(q,'#c8ccd4',4,36,14,6);R_(q,'#7ab8e8',6,37,10,3);R_(q,PKX.st,24,30,4,3);R_(q,'#9ad0f0',7,37,3,1)}),
bagdisp:ob(26,56,[8,6],q=>{R_(q,'#3f7a46',11,8,4,46);R_(q,'#2e5e36',3,6,20,16);R_(q,'#4f8a56',4,7,18,3);R_(q,PKX.w,6,11,14,8);kpCirc(q,'#3a3a40',11,15,2.2);kpCirc(q,'#3a3a40',15,14,1.5);R_(q,'#3a3a40',13,16,4,2);R_(q,'#2a2a30',4,30,18,16);R_(q,'#3a3a42',4,30,18,2);R_(q,PKX.o,6,46,14,2);R_(q,'#e8e8e4',9,20,8,3)}),
// playground extras: spring rider (var: horse, duck, bee or car), seesaw (*colour*), tyre swing, climbing dome (*colour*),
// a shade sail from above on its three posts (*colour*; it hangs over people and fades while anyone is under it)
springr:ob(32,42,[14,8],(q,v)=>{v=+v||0;const k=Math.floor(v*4)%4;R_(q,'#8a8f96',6,38,20,4);for(let y=26;y<38;y+=3)R_(q,y%6?'#c8ccd4':'#8a8f96',11,y,10,2);
 if(k==0){R_(q,'#c8783a',4,14,24,12);R_(q,'#e0985a',4,14,24,3);R_(q,'#c8783a',22,4,8,14);R_(q,'#7a3e1a',22,2,4,6);R_(q,PKX.o,27,8,2,2);R_(q,'#7a3e1a',2,14,4,8);R_(q,'#d8403a',14,10,3,6)}
 else if(k==1){R_(q,'#f0c419',4,14,24,12);R_(q,'#ffe07a',4,14,24,3);kpCirc(q,'#f0c419',24,10,6);R_(q,'#e8781e',28,10,5,3);R_(q,PKX.o,25,8,2,2);R_(q,'#2f6fd0',14,10,3,6)}
 else if(k==2){for(let i=0;i<4;i++)R_(q,i%2?PKX.ir:'#f0c419',4+i*6,14,6,12);kpCirc(q,PKX.ir,26,14,5);R_(q,PKX.w,8,8,8,5);R_(q,PKX.o,27,12,2,2)}
 else{R_(q,'#d8403a',2,12,28,14);R_(q,'#e85a4a',2,12,28,3);R_(q,'#9ad0f0',8,8,14,5);R_(q,PKX.o,4,24,6,5);R_(q,PKX.o,22,24,6,5);R_(q,PKX.y,13,4,6,5)}}),
seesaw:obc(120,34,[110,10],PKPLAY,(q,v,K)=>{R_(q,PKX.sk,54,20,12,12);R_(q,PKX.std,56,18,8,4);q.save();q.translate(60,20);q.rotate(-.14);R_(q,PKX.o,-58,-4,116,7);R_(q,K.b,-57,-3,114,5);R_(q,K.l,-57,-3,114,2);
 for(const e of[-1,1]){R_(q,'#26262c',e*50-6,-9,12,6);R_(q,PKX.std,e*42-1,-16,3,13);R_(q,PKX.std,e*42-5,-17,11,3)}q.restore();R_(q,'#3a3a40',2,26,10,6)}),
tireswing:ob(92,82,[84,10],q=>{pkLn(q,'#3f7a46',5,[[8,80],[46,6]]);pkLn(q,'#3f7a46',5,[[84,80],[46,6]]);pkLn(q,'#2e5e36',3,[[20,80],[46,6]]);pkLn(q,'#2e5e36',3,[[72,80],[46,6]]);R_(q,PKX.sk,38,2,16,6);
 for(const dx of[-12,0,12])pkLn(q,PKX.std,1,[[46,8],[46+dx,52]]);q.fillStyle=PKX.o;q.beginPath();q.ellipse(46,58,20,9,0,0,7);q.fill();q.fillStyle='#2a2a2e';q.beginPath();q.ellipse(46,58,18,7.5,0,0,7);q.fill();q.fillStyle='#4a4a50';q.beginPath();q.ellipse(46,56,9,3,0,0,7);q.fill();q.fillStyle='#16161a';q.beginPath();q.ellipse(46,58,9,3.5,0,0,7);q.fill()}),
climbdome:obc(96,58,[88,16],PKPLAY,(q,v,K)=>{q.strokeStyle=K.d;q.lineWidth=3;const cx=48,cy=56,R=44;for(let k=1;k<=3;k++){q.beginPath();q.ellipse(cx,cy-R*(k/3.6),R*Math.cos(Math.asin(k/3.6)),6*Math.cos(Math.asin(k/3.6)),0,Math.PI,0);q.stroke()}
 q.beginPath();q.ellipse(cx,cy,R,8,0,Math.PI,0);q.stroke();q.strokeStyle=K.b;q.lineWidth=2;for(let i=0;i<=8;i++){const a=Math.PI+i/8*Math.PI;q.beginPath();q.moveTo(cx+Math.cos(a)*R,cy+Math.sin(a)*8);q.quadraticCurveTo(cx+Math.cos(a)*R*.7,cy-R*.75,cx+Math.cos(a)*R*.1,cy-R+2);q.stroke()}
 q.strokeStyle=K.l;q.lineWidth=1;q.beginPath();q.arc(cx,cy,R,Math.PI*1.1,Math.PI*1.45);q.stroke();R_(q,PKX.sk,4,52,88,4)}),
shadesail:{w:200,h:150,c:0,ov:1,ovf:1,ova:.22,sw:190,swh:140,pc:PKSAIL,f:(g,x,y,v,col)=>S2(g,x,y,200,150,q=>{const K=pcK(pcCol(col,PKSAIL)),P=[[8,10],[192,26],[64,142]];q.fillStyle=PKX.o;q.beginPath();q.moveTo(P[0][0]-2,P[0][1]-2);q.quadraticCurveTo(100,30,P[1][0]+2,P[1][1]);q.quadraticCurveTo(110,90,P[2][0],P[2][1]+2);q.quadraticCurveTo(52,70,P[0][0]-2,P[0][1]-2);q.fill();
 q.fillStyle=K.b;q.beginPath();q.moveTo(P[0][0],P[0][1]);q.quadraticCurveTo(100,32,P[1][0],P[1][1]);q.quadraticCurveTo(108,88,P[2][0],P[2][1]);q.quadraticCurveTo(54,70,P[0][0],P[0][1]);q.fill();q.fillStyle=K.l;q.beginPath();q.moveTo(P[0][0],P[0][1]);q.quadraticCurveTo(100,32,P[1][0],P[1][1]);q.lineTo(88,60);q.closePath();q.fill();
 q.strokeStyle=K.d;q.lineWidth=1;for(const t of[.3,.55,.8]){q.beginPath();q.moveTo(P[0][0]+(P[1][0]-P[0][0])*t,P[0][1]+(P[1][1]-P[0][1])*t+8*t);q.lineTo(P[2][0]+(P[1][0]-P[2][0])*t*.6,P[2][1]+(P[1][1]-P[2][1])*t*.6);q.stroke()}
 for(const p of P){kpCirc(q,PKX.o,p[0],p[1],5);kpCirc(q,PKX.st,p[0],p[1],3.5)}})},
// the park: a cast-iron bench with wooden slats (*colour*; var 0.75 and up: a memorial plaque), trash (var 0.6 and up: recycling;
// 0.85 and up: overflowing), the park map kiosk, the founder's statue (tall), a picnic pavilion from above (*colour* = its roof;
// hangs over people and fades while anyone is under it), a chalkboard A-frame sign (24, "LINE|LINE"), an ice cream cart, a life
// ring on its post, a stroller (var 0.5 and up: tipped over; *colour*)
pbench:obc(64,36,[58,12],PKBENCH,(q,v,K)=>{for(const x of[2,56]){R_(q,PKX.ir,x,4,6,30);R_(q,'#3a3a42',x+1,4,2,30);R_(q,PKX.ir,x-1,30,8,4)}for(let i=0;i<3;i++){R_(q,K.dd,8,4+i*5,48,4);R_(q,K.b,8,4+i*5,48,3);R_(q,K.l,8,4+i*5,48,1)}
 for(let i=0;i<3;i++){R_(q,K.d,6,18+i*4,52,4);R_(q,K.l,6,18+i*4,52,2)}R_(q,PKX.ir,4,30,56,2);if((+v||0)>=.75){R_(q,'#a8803a',26,9,12,4);R_(q,'#d8b060',27,10,10,1)}}),
ptrash:ob(26,34,[20,10],(q,v)=>{v=+v||0;const rc=v>=.6,C=rc?['#2f5a9a','#3f6ab0','#24487a']:['#3f6a3a','#4f7a46','#2e5028'];R_(q,C[2],4,10,18,23);R_(q,C[0],4,10,18,21);for(let x=6;x<22;x+=4)R_(q,C[2],x,12,1,19);R_(q,C[1],4,10,3,21);
 R_(q,PKX.ir,2,4,22,8);R_(q,'#3a3a42',3,4,20,2);R_(q,'#0a0a0e',8,7,10,3);R_(q,PKX.w,8,20,10,4);if(rc){q.strokeStyle='#2f9a4a';q.lineWidth=1.5;q.beginPath();q.arc(13,22,2.5,0,5);q.stroke()}else R_(q,'#3a3a42',10,21,6,2);
 if(v>=.85){R_(q,'#2a2a30',5,0,10,8);R_(q,'#3a3a42',5,0,10,2);R_(q,PKX.w,15,1,6,5);R_(q,'#d8403a',17,2,3,3);R_(q,'#e8e0c8',2,2,5,4)}}),
kiosk:ob(80,90,[66,10],q=>{for(const x of[8,68]){R_(q,'#5a3e22',x,10,6,80);R_(q,'#7a5432',x,10,2,80)}R_(q,'#3a2a1a',2,2,76,12);R_(q,'#8a3a2a',0,0,80,8);for(let x=2;x<80;x+=6)R_(q,'#6a2a1e',x,4,3,4);R_(q,'#a84a36',0,0,80,2);
 R_(q,'#5a3e22',10,16,60,50);R_(q,'#2e5e36',12,18,56,46);R_(q,'#e8e4d0',14,20,52,8);kpText(q,'CITY PARK',40,24.5,48,7,'#2e5e36');R_(q,'#7ab04a',14,30,52,32);R_(q,'#3f88b8',18,46,12,8);R_(q,'#3f88b8',40,46,18,10);R_(q,'#8a8f96',14,38,52,3);R_(q,'#8a8f96',36,30,3,32);
 R_(q,'#c8a050',20,32,10,4);R_(q,'#3f72b8',46,33,14,8);kpCirc(q,'#d8403a',36,52,2.8);R_(q,PKX.w,30,57,14,3);R_(q,'#f4f0a8',60,20,6,8);R_(q,'#f4c8d8',62,30,5,7)}),
pstatue:Object.assign(ob(56,128,[44,20],q=>pkStatue(q)),{wb:1}),
pavil:{w:240,h:160,c:0,ov:1,ovf:1,ova:.22,sw:230,swh:150,pc:PKROOF,f:(g,x,y,v,col)=>S2(g,x,y,240,160,q=>pkPavil(q,240,160,pcK(pcCol(col,PKROOF))))},
menuboard:{w:36,h:46,c:[26,8],txt:24,dt:'TACOS|$3 TODAY',f:(g,x,y,v,c,t)=>S2(g,x,y,36,46,q=>{pkLn(q,'#7a5428',3,[[6,44],[12,4]]);pkLn(q,'#7a5428',3,[[30,44],[24,4]]);R_(q,'#7a5428',6,4,24,32);R_(q,'#1e2a22',8,6,20,28);
 const L=String(t||'TACOS|$3 TODAY').toUpperCase().split('|');kpText(q,L[0]||'',18,13,18,7,'#f4f4f0');kpText(q,L[1]||'',18,22,18,6,'#f0d070');R_(q,'#f4c8d8',11,28,4,3);R_(q,'#9ad0f0',19,29,5,2)})},
icart:Object.assign(ob(64,84,[50,16],q=>{R_(q,PKX.sk,31,6,2,46);for(let i=0;i<8;i++){q.fillStyle=i%2?'#f4f4f0':'#f088a8';q.beginPath();q.moveTo(32,2);q.lineTo(4+i*7,22);q.lineTo(11+i*7,22);q.closePath();q.fill()}R_(q,'#d86888',4,21,58,3);
 R_(q,'#f4f4f0',8,46,48,26);R_(q,'#9ad0f0',8,46,48,4);for(let i=0;i<6;i++)R_(q,i%2?'#f088a8':'#9ad0f0',8+i*8,66,8,6);kpText(q,'ICE CREAM',32,56,44,8,'#d84068');R_(q,PKX.std,8,44,48,3);
 R_(q,'#3a3a42',56,44,8,3);R_(q,'#3a3a42',60,44,3,12);for(const x of[12,44]){kpCirc(q,PKX.o,x,76,6);kpCirc(q,'#5a5e68',x,76,4.5);kpCirc(q,PKX.std,x,76,1.5)}R_(q,'#d8a050',18,36,6,8);kpCirc(q,'#f4c8d8',21,35,3.5)}),{wb:1}),
lifering:ob(28,58,[8,6],q=>{R_(q,'#7a5432',11,6,6,52);R_(q,'#9a7046',11,6,2,52);R_(q,'#6a4428',9,4,10,4);q.strokeStyle=PKX.o;q.lineWidth=8;q.beginPath();q.arc(14,24,9,0,7);q.stroke();for(let i=0;i<8;i++){q.strokeStyle=i%2?PKX.w:'#e8601c';q.lineWidth=6;q.beginPath();q.arc(14,24,9,i*Math.PI/4,(i+1)*Math.PI/4);q.stroke()}}),
stroller:obc(34,36,[22,10],PKPLAY,(q,v,K)=>{if((+v||0)>=.5){q.translate(17,26);q.rotate(1.3);q.translate(-17,-26)}pkLn(q,PKX.sk,2,[[24,10],[30,2]]);R_(q,PKX.ir,28,0,6,3);R_(q,K.dd,6,14,22,10);R_(q,K.b,6,14,22,8);
 q.fillStyle=K.d;q.beginPath();q.moveTo(4,16);q.quadraticCurveTo(6,2,20,4);q.lineTo(18,16);q.closePath();q.fill();q.fillStyle=K.l;q.beginPath();q.moveTo(6,14);q.quadraticCurveTo(8,5,18,6);q.lineTo(16,9);q.quadraticCurveTo(10,9,8,14);q.closePath();q.fill();
 pkLn(q,PKX.sk,1,[[10,24],[24,24]]);R_(q,'#3a3a40',9,26,16,3);for(const x of[9,25]){kpCirc(q,PKX.o,x,31,4);kpCirc(q,'#5a5e68',x,31,2.5)}})});
