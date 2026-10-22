//# maps/props/home-props.js — House props for custom maps: kitchen, living room, bedroom, bathroom and garage furniture, each in a choice of colours
// ---------- props with a colour ----------
// obc() is ob() for a prop that takes a colour: pal is its list of [hex, name] (the first is the default), and the
// drawing gets K = the chosen colour in five shades (b base, l light, ll lighter, d dark, dd darker, x darkest).
// The editor shows pal as swatches and also takes any other colour; a map stores it as the prop's "color".
const PKC={},PCOK=/^#[0-9a-f]{6}$/i;
function pcHex(c){return'#'+c.map(v=>Math.max(0,Math.min(255,Math.round(v))).toString(16).padStart(2,'0')).join('')}
function pcSh(h,k){const n=parseInt(h.slice(1),16),c=[(n>>16)&255,(n>>8)&255,n&255];return pcHex(k<1?c.map(v=>v*k):c.map(v=>v+(255-v)*Math.min(1,(k-1)*1.4)))}
function pcK(h){return PKC[h]||(PKC[h]={b:h,l:pcSh(h,1.1),ll:pcSh(h,1.24),d:pcSh(h,.8),dd:pcSh(h,.64),x:pcSh(h,.46)})}
function pcCol(col,pal){return typeof col=='string'&&PCOK.test(col)?col.toLowerCase():pal[0][0]}
const obc=(w,h,c,pal,fn)=>({w,h,c,pc:pal,f:(g,x,y,v,col)=>S2(g,x,y,w,h,q=>fn(q,v,pcK(pcCol(col,pal))))});
// colour choices
const PCAB=[['#a8774a','Oak'],['#e8e4da','White'],['#d8cfb4','Cream'],['#c49a62','Light wood'],['#7a5232','Walnut'],['#4a3324','Espresso'],['#8a8f96','Grey'],['#3a4a6a','Navy'],['#7f9a7a','Sage'],['#2c2c30','Black'],['#a8342c','Red'],['#5a8aa8','Blue']];
const PFAB=[['#7a7a82','Grey'],['#4a4a52','Charcoal'],['#c8b48e','Beige'],['#7a5236','Brown'],['#3a4a7a','Navy'],['#4a6ab0','Blue'],['#4a7a4a','Green'],['#a83a32','Red'],['#6a4a8a','Purple'],['#c89a2a','Mustard'],['#e0dcd2','White'],['#2a2a2e','Black']];
const PAPP=[['#eceae4','White'],['#b8bcc2','Stainless'],['#2e3036','Black'],['#e2d6b8','Almond'],['#c0392b','Red'],['#9ad0b8','Mint'],['#4a7ab8','Blue']];
const PMET=[['#b8322a','Red'],['#7c828c','Grey'],['#2e3036','Black'],['#2f5faa','Blue'],['#3a7a4a','Green'],['#d8a82a','Yellow'],['#d86a2a','Orange']];
const PTIL=[['#e6e6e0','White'],['#a8acb0','Grey'],['#7aa8c8','Blue'],['#8ab89a','Green'],['#d8cbb0','Beige'],['#3a3a40','Black'],['#d8a8b0','Pink']];
const PBRK=[['#9a4a32','Red brick'],['#7a4a32','Brown brick'],['#8a8a8a','Grey stone'],['#d8d4cc','White brick'],['#b08a62','Tan stone'],['#4a4a4e','Dark stone']];
// ---------- shared pieces ----------
const PSTEEL='#cfd3da',PCTOP=['#d9d3c7','#ebe6dc','#b8b1a3','#c4bdaf','#e6e1d6'];
// a stone countertop x,y,w,h with a front lip
function pcTop(q,x,y,w,h){R_(q,PCTOP[0],x,y,w,h);R_(q,PCTOP[1],x,y,w,2);R_(q,PCTOP[2],x,y+h-2,w,2);for(let i=0;i<w/3;i++)R_(q,PCTOP[3+i%2],x+1+(i*13+5)%(w-2),y+2+(i*7)%Math.max(1,h-4),1,1)}
// a wooden / painted top x,y,w,h in colour K
function pcWood(q,x,y,w,h,K){R_(q,K.b,x,y,w,h);R_(q,K.l,x,y,w,1);R_(q,K.d,x,y+h-1,w,1);if(w>14)R_(q,K.d,x+3,y+2+(w%3),Math.min(w-8,10),1)}
// a cabinet front: n doors (or drawers when dr) across x..x+w, y..y+h
function pcDoors(q,x,y,w,h,n,K,dr){R_(q,K.b,x,y,w,h);const dw=w/n;for(let k=0;k<n;k++){const dx=x+Math.round(k*dw),ww=Math.round((k+1)*dw)-Math.round(k*dw);if(k)R_(q,K.dd,dx,y,1,h);R_(q,K.l,dx+(k?1:0),y,ww-(k?1:0),1);
if(dr)R_(q,PSTEEL,dx+Math.floor(ww/2)-2,y+Math.floor(h/2),4,1);else R_(q,PSTEEL,dx+(k%2?2:ww-3),y+2,1,Math.max(1,Math.min(3,h-4)))}}
// a counter piece W wide (sprite 26 high): stone top, a cabinet front, a dark kick at the floor
function pcCounter(q,W,K,n){pcTop(q,1,1,W-2,16);pcDoors(q,1,17,W-2,6,n||Math.max(1,Math.round((W-2)/16)),K);R_(q,K.x,1,23,W-2,2)}
// drawers in rows (rows x cols) filling x..x+w, y..y+h
function pcDrawers(q,x,y,w,h,rows,cols,K){R_(q,K.b,x,y,w,h);const rh=h/rows,cw=w/cols;for(let r=0;r<rows;r++)for(let c=0;c<cols;c++){const dx=x+Math.round(c*cw),dy=y+Math.round(r*rh),ww=Math.round((c+1)*cw)-Math.round(c*cw),hh=Math.round((r+1)*rh)-Math.round(r*rh);
R_(q,K.l,dx+1,dy+1,ww-2,1);R_(q,K.dd,dx,dy+hh-1,ww,1);if(c)R_(q,K.dd,dx,dy,1,hh);R_(q,PSTEEL,dx+Math.floor(ww/2)-1,dy+Math.floor(hh/2),3,1)}}
// a dining chair seen from above at x,y (8x9), back on side s ('t','b','l','r')
function pcChair(q,x,y,s,K){R_(q,K.b,x,y,8,8);R_(q,K.l,x+1,y+1,6,2);s=='t'?R_(q,K.dd,x,y,8,2):s=='b'?R_(q,K.dd,x,y+6,8,2):s=='l'?R_(q,K.dd,x,y,2,8):R_(q,K.dd,x+6,y,2,8)}
// sofa seen from above: x,y,w,h, back along the top, arms at both ends, n seat cushions
function pcSofa(q,x,y,w,h,n,K){R_(q,K.d,x,y,w,h);R_(q,K.dd,x,y,w,7);R_(q,K.b,x+1,y+1,w-2,4);R_(q,K.dd,x,y,6,h);R_(q,K.dd,x+w-6,y,6,h);R_(q,K.b,x+1,y+2,4,h-3);R_(q,K.b,x+w-5,y+2,4,h-3);
const sw=(w-12)/n;for(let k=0;k<n;k++){const sx=x+6+Math.round(k*sw),ww=Math.round((k+1)*sw)-Math.round(k*sw);R_(q,K.b,sx+1,y+8,ww-2,h-10);R_(q,K.l,sx+1,y+8,ww-2,2);R_(q,K.d,sx+1,y+h-3,ww-2,1)}}
// a flat TV screen x,y,w,h (front view) with a glare streak
function pcScreen(q,x,y,w,h){R_(q,'#16171c',x,y,w,h);R_(q,'#26303e',x+1,y+1,w-2,h-2);R_(q,'#3a4a62',x+2,y+2,w-4,Math.max(1,h-6));for(let i=0;i<Math.min(w,h)-4;i+=2)R_(q,'#55688a',x+w-6-i-Math.floor(w/5),y+2+i,2,2);R_(q,'#7ab0e8',x+w-3,y+h-2,1,1)}
// brick courses over x,y,w,h in colour K (mortar lighter or darker than the brick)
function pcBricks(q,x,y,w,h,K){const light=K.b==='#d8d4cc',m=light?'#a8a49c':'#c9bfb2';R_(q,m,x,y,w,h);for(let r=0,yy=y;yy<y+h;r++,yy+=4)for(let xx=x-(r%2?5:0);xx<x+w;xx+=10){const a=Math.max(x,xx),b=Math.min(x+w,xx+9);if(b>a){R_(q,(r*3+xx)%7==0?K.d:(r+xx)%5==0?K.l:K.b,a,yy,b-a,Math.min(3,y+h-yy))}}}
// ---------- the props ----------
Object.assign(OB,{
// kitchen
kc_base:obc(34,26,[32,22],PCAB,(q,v,K)=>pcCounter(q,34,K,2)),
kc_long:obc(66,26,[64,22],PCAB,(q,v,K)=>{pcCounter(q,66,K,4);R_(q,K.dd,33,17,1,6)}),
kc_corner:obc(34,34,[32,30],PCAB,(q,v,K)=>{pcTop(q,1,1,32,24);R_(q,PCTOP[2],1,23,32,2);pcDoors(q,1,25,32,6,2,K);R_(q,K.x,1,31,32,2);R_(q,PCTOP[3],27,3,4,18)}),
kc_sink:obc(50,26,[48,22],PCAB,(q,v,K)=>{pcCounter(q,50,K,3);for(const bx of[8,26]){R_(q,'#9aa1aa',bx,3,15,11);R_(q,'#6f7782',bx+1,4,13,9);R_(q,'#87909b',bx+1,4,13,2);R_(q,'#3a3f46',bx+6,9,2,2)}R_(q,PSTEEL,23,2,3,6);R_(q,'#9aa1aa',22,2,5,2);R_(q,'#e8eef4',24,3,1,1)}),
kc_range:obc(30,28,[28,22],PAPP,(q,v,K)=>{R_(q,K.b,1,1,28,5);R_(q,K.l,1,1,28,1);for(let i=0;i<4;i++)R_(q,'#2a2c32',4+i*6,3,3,2);R_(q,'#26272b',1,6,28,12);q.strokeStyle='#5a5d64';q.lineWidth=1.5;for(const[a,b]of[[8,9],[21,9],[8,15],[21,15]]){q.beginPath();q.arc(a,b,2.6,0,7);q.stroke()}
R_(q,K.b,1,18,28,8);R_(q,K.l,1,18,28,1);R_(q,PSTEEL,4,19,22,1);R_(q,'#2a2c32',5,21,20,4);R_(q,'#4a3a32',6,22,18,2);R_(q,K.x,1,26,28,1);if(v>.6)R_(q,'#ff6a2a',20,15,3,1)}),
kfridge:obc(30,36,[28,28],PAPP,(q,v,K)=>{R_(q,K.l,1,1,28,13);R_(q,K.ll,1,1,28,2);R_(q,K.d,1,12,28,2);R_(q,K.b,1,14,28,20);R_(q,K.l,1,14,28,1);R_(q,K.dd,1,21,28,1);R_(q,K.d,24,16,2,4);R_(q,K.d,24,23,2,9);R_(q,K.x,1,33,28,2);
if(v>.5){R_(q,'#e8c040',6,17,3,3);R_(q,'#d84a4a',11,25,3,3);R_(q,'#fff',7,26,4,5)}}),
kfridge2:obc(40,36,[38,28],PAPP,(q,v,K)=>{R_(q,K.l,1,1,38,13);R_(q,K.ll,1,1,38,2);R_(q,K.d,1,12,38,2);R_(q,K.b,1,14,38,20);R_(q,K.l,1,14,38,1);R_(q,K.dd,20,14,1,13);R_(q,K.dd,1,27,38,1);R_(q,K.d,17,16,2,9);R_(q,K.d,22,16,2,9);R_(q,K.d,12,29,16,1);
R_(q,'#2a2c32',5,17,7,7);R_(q,'#4a4e58',6,18,5,2);R_(q,'#7ab0e8',8,22,1,1);R_(q,K.x,1,33,38,2)}),
kcab_s:obc(20,24,[18,14],PCAB,(q,v,K)=>{pcWood(q,1,1,18,8,K);pcDoors(q,1,9,18,13,1,K);R_(q,K.x,1,22,18,1)}),
kcab_m:obc(34,24,[32,14],PCAB,(q,v,K)=>{pcWood(q,1,1,32,8,K);pcDoors(q,1,9,32,13,2,K);R_(q,K.x,1,22,32,1)}),
kcab_w:obc(52,24,[50,14],PCAB,(q,v,K)=>{pcWood(q,1,1,50,8,K);pcDoors(q,1,9,32,13,2,K);pcDrawers(q,33,9,18,13,3,1,K);R_(q,K.dd,33,9,1,13);R_(q,K.x,1,22,50,1)}),
kpantry:obc(28,40,[26,14],PCAB,(q,v,K)=>{pcWood(q,1,1,26,8,K);pcDoors(q,1,9,26,29,2,K);R_(q,K.dd,1,23,26,1);R_(q,PSTEEL,11,26,1,3);R_(q,PSTEEL,16,26,1,3);R_(q,K.x,1,38,26,1)}),
kisland:obc(56,36,[54,28],PCAB,(q,v,K)=>{pcTop(q,1,1,54,24);pcDoors(q,4,25,48,8,3,K);R_(q,K.x,4,33,48,2);if(v>.5){R_(q,'#f0e8d8',8,6,10,7);R_(q,'#c0392b',30,8,5,5);R_(q,'#e8a030',37,9,4,4)}}),
kisland_b:obc(76,48,[74,28],PCAB,(q,v,K)=>{for(const sx of[12,32,52]){R_(q,'#3a3d46',sx+3,7,2,6);R_(q,K.dd,sx,1,10,8);R_(q,K.d,sx+1,2,8,5)}pcTop(q,1,12,74,26);R_(q,PCTOP[4],1,12,74,4);pcDoors(q,4,38,68,7,4,K);R_(q,K.x,4,45,68,2);
R_(q,'#9aa1aa',44,20,16,10);R_(q,'#6f7782',45,21,14,8);R_(q,PSTEEL,51,17,3,5);if(v>.4){R_(q,'#f0e8d8',10,20,12,8);R_(q,'#3f8a42',26,22,4,4)}}),
ktable_s:obc(42,30,[26,20],PCAB,(q,v,K)=>{pcChair(q,1,10,'l',K);pcChair(q,33,10,'r',K);q.fillStyle=K.d;q.beginPath();q.arc(21,15,12,0,7);q.fill();q.fillStyle=K.b;q.beginPath();q.arc(21,14,11,0,7);q.fill();q.fillStyle=K.l;q.beginPath();q.arc(18,11,4,0,7);q.fill();if(v>.5){R_(q,'#f0ece2',16,13,6,5);R_(q,'#c0392b',24,10,3,3)}}),
ktable:obc(50,46,[34,26],PCAB,(q,v,K)=>{pcChair(q,21,1,'t',K);pcChair(q,21,37,'b',K);pcChair(q,1,19,'l',K);pcChair(q,41,19,'r',K);pcWood(q,9,9,32,28,K);R_(q,K.dd,9,36,32,1);R_(q,K.l,10,10,30,2);if(v>.4){R_(q,'#f0ece2',13,14,7,6);R_(q,'#f0ece2',30,26,7,6);R_(q,'#3f8a42',23,20,4,4)}}),
ktable_l:obc(78,46,[60,26],PCAB,(q,v,K)=>{for(const cx of[15,35,55]){pcChair(q,cx,1,'t',K);pcChair(q,cx,37,'b',K)}pcChair(q,1,19,'l',K);pcChair(q,69,19,'r',K);pcWood(q,9,9,60,28,K);R_(q,K.dd,9,36,60,1);R_(q,K.l,10,10,58,2);if(v>.4){for(const cx of[16,36,56]){R_(q,'#f0ece2',cx,12,7,5);R_(q,'#f0ece2',cx,28,7,5)}R_(q,'#e8c040',37,21,4,4)}}),
// living room
sofa2:obc(46,28,[44,22],PFAB,(q,v,K)=>pcSofa(q,1,1,44,25,2,K)),
sofa3:obc(68,28,[66,22],PFAB,(q,v,K)=>pcSofa(q,1,1,66,25,3,K)),
sofa_l:obc(68,56,[66,52],PFAB,(q,v,K)=>{pcSofa(q,1,1,66,25,3,K);R_(q,K.d,1,20,24,34);R_(q,K.dd,1,20,6,34);R_(q,K.b,2,22,4,30);R_(q,K.b,8,22,16,30);R_(q,K.l,8,22,16,2);R_(q,K.d,8,51,16,2);R_(q,K.dd,1,52,24,2);R_(q,K.d,7,20,18,2);R_(q,K.dd,24,26,1,28)}),
armch:obc(30,30,[28,24],PFAB,(q,v,K)=>{R_(q,K.d,1,1,28,27);R_(q,K.dd,1,1,28,8);R_(q,K.b,2,2,26,4);R_(q,K.dd,1,1,6,27);R_(q,K.dd,23,1,6,27);R_(q,K.b,2,3,4,23);R_(q,K.b,24,3,4,23);R_(q,K.b,8,9,14,17);R_(q,K.l,8,9,14,2);R_(q,K.d,8,25,14,1)}),
recl:obc(30,40,[28,34],PFAB,(q,v,K)=>{R_(q,K.d,1,1,28,27);R_(q,K.dd,1,1,28,10);R_(q,K.b,2,2,26,6);R_(q,K.l,3,2,24,2);R_(q,K.dd,1,1,6,27);R_(q,K.dd,23,1,6,27);R_(q,K.b,2,3,4,23);R_(q,K.b,24,3,4,23);R_(q,K.b,8,11,14,17);R_(q,K.l,8,11,14,2);
R_(q,K.dd,7,28,16,10);R_(q,K.b,8,29,14,7);R_(q,K.l,8,29,14,1);R_(q,K.x,28,16,1,6)}),
tvs_s:obc(44,22,[42,14],PCAB,(q,v,K)=>{pcWood(q,1,1,42,8,K);R_(q,K.b,1,9,42,11);R_(q,K.x,4,11,16,7);R_(q,'#2a2c32',6,14,12,3);R_(q,'#3aff7a',16,15,1,1);pcDoors(q,22,10,20,9,1,K);R_(q,K.dd,1,19,42,1)}),
tvs_w:obc(68,22,[66,14],PCAB,(q,v,K)=>{pcWood(q,1,1,66,8,K);pcDoors(q,1,9,20,11,1,K);R_(q,K.b,21,9,26,11);R_(q,K.dd,21,9,1,11);R_(q,K.dd,46,9,1,11);R_(q,K.x,23,10,22,9);R_(q,K.b,23,14,22,1);R_(q,'#2a2c32',25,11,12,3);R_(q,'#16171c',27,16,16,2);R_(q,'#3a8ad8',35,12,1,1);pcDoors(q,47,9,20,11,1,K);R_(q,K.x,1,20,66,1)}),
tvs_tv:obc(68,36,[66,14],PCAB,(q,v,K)=>{R_(q,'#2a2c32',30,18,8,4);pcScreen(q,9,1,50,18);pcWood(q,1,21,66,6,K);pcDoors(q,1,27,20,7,1,K);R_(q,K.b,21,27,26,7);R_(q,K.x,23,28,22,5);R_(q,'#2a2c32',25,29,12,2);pcDoors(q,47,27,20,7,1,K);R_(q,K.x,1,34,66,1)}),
tv_flat:ob(46,28,[22,6],(q,v)=>{pcScreen(q,1,1,44,22);R_(q,'#2a2c32',20,23,6,2);R_(q,'#2a2c32',13,25,20,2)}),
tv_big:ob(66,40,[34,6],(q,v)=>{pcScreen(q,1,1,64,34);R_(q,'#2a2c32',29,35,8,2);R_(q,'#2a2c32',17,37,32,2)}),
tv_crt:obc(30,30,[26,12],[['#6a6e78','Grey'],['#7a5232','Wood'],['#2e3036','Black'],['#d8d0bc','Beige']],(q,v,K)=>{q.strokeStyle='#8a8f96';q.lineWidth=1;q.beginPath();q.moveTo(13,6);q.lineTo(7,1);q.moveTo(17,6);q.lineTo(24,1);q.stroke();R_(q,K.dd,2,6,26,22);R_(q,K.b,2,6,26,21);R_(q,K.l,2,6,26,1);
R_(q,'#16171c',4,8,17,15);R_(q,'#2e4a3a',5,9,15,13);R_(q,'#4a7a5a',6,10,5,3);R_(q,'#3a5a46',5,9,15,1);R_(q,K.d,22,9,4,13);R_(q,'#2a2c32',23,10,2,2);R_(q,'#2a2c32',23,14,2,2);R_(q,K.x,3,27,24,1)}),
bfplace:obc(72,58,[68,16],PBRK,(q,v,K)=>{pcBricks(q,6,1,60,44,K);R_(q,'#5a3a22',2,15,68,4);R_(q,'#7a5232',2,15,68,1);R_(q,'#3a2416',2,19,68,1);R_(q,'#e8e0c8',10,10,3,5);R_(q,'#ffcf40',11,8,1,2);R_(q,'#3a2a1e',54,8,8,7);R_(q,'#e8e0c8',56,10,4,3);
q.fillStyle=K.dd;q.beginPath();q.moveTo(22,45);q.lineTo(22,30);q.arc(36,30,14,Math.PI,0);q.lineTo(50,45);q.fill();q.fillStyle='#16111c';q.beginPath();q.moveTo(24,45);q.lineTo(24,31);q.arc(36,31,12,Math.PI,0);q.lineTo(48,45);q.fill();
R_(q,'#5a3a22',27,41,18,3);R_(q,'#7a5232',29,39,14,2);q.fillStyle='#e85a1a';q.beginPath();q.moveTo(28,40);q.lineTo(31,28);q.lineTo(34,35);q.lineTo(37,25);q.lineTo(40,34);q.lineTo(43,29);q.lineTo(44,40);q.fill();q.fillStyle='#ffb02a';q.beginPath();q.moveTo(31,40);q.lineTo(34,32);q.lineTo(37,36);q.lineTo(39,31);q.lineTo(41,40);q.fill();R_(q,'#fff2a0',35,37,3,2);
R_(q,'#8a8a86',2,45,68,11);R_(q,'#a8a8a2',2,45,68,2);R_(q,'#6a6a66',2,54,68,2);for(let i=8;i<66;i+=12)R_(q,'#7a7a76',i,47,1,7)}),
// bedroom
nstand:obc(22,24,[20,12],PCAB,(q,v,K)=>{pcWood(q,1,1,20,9,K);R_(q,'#c8b88e',7,1,8,2);R_(q,'#efe4c4',5,2,12,6);R_(q,'#fff6d8',6,3,6,2);R_(q,'#c8b88e',5,7,12,1);pcDrawers(q,1,10,20,11,2,1,K);R_(q,K.x,1,21,20,1)}),
nstand2:obc(22,24,[20,12],PCAB,(q,v,K)=>{pcWood(q,1,1,20,9,K);R_(q,'#2a2c32',3,3,7,5);R_(q,'#ff4a3a',4,5,5,1);R_(q,'#3a6fb5',12,3,7,5);R_(q,'#e8e4d8',12,4,7,1);pcDrawers(q,1,10,20,11,1,1,K);R_(q,K.x,1,21,20,1)}),
dress_s:obc(36,26,[34,14],PCAB,(q,v,K)=>{pcWood(q,1,1,34,8,K);if(v>.4){R_(q,'#6a3a5a',4,3,7,4);R_(q,'#e8d070',5,3,5,1)}R_(q,'#3f8a42',26,2,4,4);pcDrawers(q,1,9,34,15,3,1,K);R_(q,K.x,1,24,34,1)}),
dress_w:obc(60,26,[58,14],PCAB,(q,v,K)=>{pcWood(q,1,1,58,8,K);if(v>.4){R_(q,'#e8e4d8',6,3,8,4);R_(q,'#c8a050',44,2,6,5)}pcDrawers(q,1,9,58,15,3,2,K);R_(q,K.x,1,24,58,1)}),
dress_m:obc(60,44,[58,14],PCAB,(q,v,K)=>{R_(q,K.dd,14,1,32,20);R_(q,K.b,15,2,30,18);R_(q,'#a8c8d8',17,4,26,14);R_(q,'#d0e4ee',19,5,6,10);R_(q,'#8ab0c4',35,12,6,5);pcWood(q,1,19,58,8,K);pcDrawers(q,1,27,58,15,3,2,K);R_(q,K.x,1,42,58,1)}),
dress_t:obc(30,40,[28,14],PCAB,(q,v,K)=>{pcWood(q,1,1,28,8,K);pcDrawers(q,1,9,28,29,5,1,K);R_(q,K.x,1,38,28,1)}),
// bathroom
shower:obc(38,40,[36,36],PTIL,(q,v,K)=>{R_(q,K.d,1,1,36,38);for(let y=5;y<35;y+=6)for(let x=5;x<33;x+=6){R_(q,K.b,x,y,5,5);R_(q,K.l,x,y,5,1)}R_(q,K.dd,1,1,36,4);R_(q,K.dd,1,1,3,38);R_(q,K.dd,34,1,3,38);R_(q,K.l,1,1,36,1);
R_(q,'#8a909a',17,5,4,4);R_(q,PSTEEL,18,6,2,2);R_(q,'#5a6068',18,20,3,3);R_(q,'#2a2e34',19,21,1,1);R_(q,'#a8d4ea',4,35,30,3);R_(q,'#d8f0fa',6,35,10,1);R_(q,PSTEEL,26,34,1,4);R_(q,'#7aa8c0',4,38,30,1)}),
shower_w:obc(58,40,[56,36],PTIL,(q,v,K)=>{R_(q,K.d,1,1,56,38);for(let y=5;y<37;y+=6)for(let x=4;x<54;x+=6){R_(q,K.b,x,y,5,5);R_(q,K.l,x,y,5,1)}R_(q,K.dd,1,1,56,4);R_(q,K.dd,1,1,3,38);R_(q,K.dd,54,1,3,38);R_(q,K.l,1,1,56,1);
R_(q,K.dd,40,5,14,9);R_(q,K.b,41,6,12,6);for(const sx of[12,28]){R_(q,'#8a909a',sx,5,4,4);R_(q,PSTEEL,sx+1,6,2,2)}R_(q,'#5a6068',27,26,4,2);R_(q,'#2a2e34',28,26,2,1);R_(q,'#a8d4ea',4,35,30,3);R_(q,'#d8f0fa',6,35,12,1);R_(q,'#7aa8c0',4,38,30,1)}),
// garage
gcab_t:obc(34,42,[32,14],PMET,(q,v,K)=>{R_(q,K.l,1,1,32,6);R_(q,K.ll,1,1,32,1);R_(q,K.b,1,7,32,32);R_(q,K.dd,16,7,1,32);R_(q,K.l,1,7,32,1);R_(q,PSTEEL,13,18,2,9);R_(q,PSTEEL,18,18,2,9);for(let i=0;i<4;i++){R_(q,K.d,4,10+i*2,8,1);R_(q,K.d,21,10+i*2,8,1)}R_(q,'#2a2c32',1,39,32,2)}),
gcab_w:obc(68,42,[66,14],PMET,(q,v,K)=>{R_(q,K.l,1,1,16,6);R_(q,K.b,1,7,16,32);R_(q,PSTEEL,13,18,2,9);R_(q,K.l,51,1,16,6);R_(q,K.b,51,7,16,32);R_(q,PSTEEL,53,18,2,9);
R_(q,K.b,18,1,32,12);R_(q,K.l,18,1,32,1);R_(q,K.dd,34,1,1,12);R_(q,PSTEEL,31,8,2,3);R_(q,PSTEEL,36,8,2,3);R_(q,'#7a5232',17,20,34,4);R_(q,'#9a6a3c',17,20,34,1);
if(v>.3){R_(q,'#3a3d46',21,16,10,4);R_(q,'#c0392b',36,17,8,3)}pcDrawers(q,18,24,32,15,3,2,K);R_(q,'#2a2c32',1,39,66,2)}),
gbench:obc(60,34,[58,14],PMET,(q,v,K)=>{R_(q,'#b08a5a',3,1,54,12);for(let y=3;y<12;y+=3)for(let x=5;x<56;x+=4)R_(q,'#8a6a42',x,y,1,1);R_(q,'#5a5d64',8,3,2,7);R_(q,'#8a5a32',7,9,4,2);R_(q,'#c0392b',20,3,3,8);R_(q,'#3a3d46',30,3,9,2);R_(q,'#3a3d46',34,3,2,7);R_(q,'#e8b830',46,4,6,6);
R_(q,'#9a6a3c',1,13,58,5);R_(q,'#b8844a',1,13,58,1);R_(q,'#6a6e78',42,10,8,4);R_(q,'#4a4e58',44,12,4,2);pcDrawers(q,2,18,18,13,3,1,K);R_(q,'#3a3d46',54,18,3,13);R_(q,'#3a3d46',22,28,32,2);R_(q,'#2a2c32',1,31,58,1)}),
gchest:obc(28,32,[26,12],PMET,(q,v,K)=>{R_(q,K.l,2,1,24,4);R_(q,K.ll,2,1,24,1);pcDrawers(q,2,5,24,22,6,1,K);for(let i=0;i<6;i++)R_(q,PSTEEL,5,7+i*3.6|0,18,1);R_(q,'#2a2c32',3,27,4,4);R_(q,'#2a2c32',21,27,4,4);R_(q,K.dd,2,26,24,1)})
});
