//# maps/highway.js — vehicles drawn and blocked the Deadway Highway way
// ---------- Top-down vehicles shared by the map file builder, the editor, other maps and bosses ----------
// (Deadway Highway itself is now a map file: maps/highway.json. Functions only: they run during map builds, possibly at boot)
function hwSh(c,k){const n=parseInt(c.slice(1),16),f=v=>Math.max(0,Math.min(255,Math.round(v*k)));return '#'+[(n>>16)&255,(n>>8)&255,n&255].map(v=>f(v).toString(16).padStart(2,'0')).join('')}
function HWV(k){return {hatch:[88,36],sedan:[80,36],suv:[88,40],pickup:[94,40],van:[92,42],limo:[150,38],police:[84,36],amb:[106,44],fire:[178,48],bus:[206,46],semi:[292,48],cab:[66,46],trailer:[222,48],flatbed:[222,48],semif:[292,48],hearse:[150,40],hearseo:[184,40],hmv:[98,48],mtruck:[170,50],taxi:[80,36],ftruck:[140,50]}[k]}
// collision for one vehicle: a box when it's square to the road, otherwise a chain of squares along it
function hwCol(v){const c=Math.cos(v.a),s=Math.sin(v.a),L=v.L,W=v.W,f=1;
if(Math.abs(s)<.09){const w=W+8;WL.push([v.x-L/2,v.y-w/2,L,w,1]);return}if(Math.abs(c)<.09){const w=W+8;WL.push([v.x-w/2,v.y-L/2,w,L,1]);return}
const q=W*.84,n=Math.max(2,Math.ceil((L-q)/(q*.6))+1);for(let i=0;i<n;i++){const u=-L/2+q/2+(L-q)*i/(n-1);WL.push([v.x+c*u-q/2,v.y+s*u-q/2,q,q,1])}}
// a flatbed trailer (top-down, centred, front toward +x) loaded with steel strapped down on timber: I-beams, plates or coils (which
// one comes from where the trailer sits, so a row of them varies)
function hwFlat(g,L,W,v){const R=(c,x,y,w,h)=>{g.fillStyle=c;g.fillRect(x,y,w,h)},hl=-L/2,ht=-W/2,k=Math.floor(((v.x||0)*7+(v.y||0)*3)/11)%3;
R('#16111c',hl-1,ht-1,L+2,W+2);R('#2a2c32',hl,ht,L,W);R('#6a4a32',hl+2,ht+3,L-10,W-6);for(let y=ht+7;y<W/2-4;y+=6)R('#5a3e2a',hl+2,y,L-10,1);R(v.c||'#3a3d46',hl,ht,L,3);R(v.c||'#3a3d46',hl,W/2-3,L,3);R('#16111c',L/2-8,ht,8,W);R('#4a4e56',L/2-7,ht+1,6,W-2);
if(v.burn){R('rgba(20,16,12,.55)',hl+2,ht+3,L-10,W-6);return}
for(const x of[hl+24,hl+L*.45,L/2-40])R('#8a6a42',x,ht+3,10,W-6);
if(k==0){for(let i=0;i<4;i++){const y=ht+7+i*9;R('#16111c',hl+8,y-1,L-28,9);R('#7a7f88',hl+9,y,L-30,7);R('#a8aeb6',hl+9,y,L-30,1);R('#5a5e66',hl+9,y+3,L-30,1)}}
else if(k==1){for(let i=0;i<3;i++){const x=hl+10+i*((L-30)/3);R('#16111c',x-1,ht+5,(L-30)/3-4,W-10);R(i%2?'#6a6e76':'#7a7f88',x,ht+6,(L-30)/3-6,W-12);R('#9aa0a8',x,ht+6,(L-30)/3-6,2);R('#8a4a2a',x+12,ht+14,10,2)}}
else{for(let i=0;i<3;i++){const x=hl+22+i*58;R('#16111c',x-1,ht+5,42,W-10);R('#8a9098',x,ht+6,40,W-12);for(let j=4;j<40;j+=4)R('#6e737b',x+j,ht+6,1,W-12);R('#2a2c32',x+17,ht+6,6,W-12)}}
for(let x=hl+16;x<L/2-14;x+=38)R('#e8a020',x,ht,3,W);}
// draw one vehicle (top-down, front toward +x before rotation)
function hwDraw(g,v){const{L,W}=v,R=(c,x,y,w,h)=>{g.fillStyle=c;g.fillRect(x,y,w,h)},O=(x,y,w,h)=>R('#16111c',x-1,y-1,w+2,h+2),hl=-L/2,hr=L/2,ht=-W/2;
g.save();g.translate(v.x,v.y);g.rotate(v.a);
const burn=v.burn,col=burn?'#3a3430':v.c||'#8a8f96',dk=hwSh(col,.72),lt=hwSh(col,1.22),gl=burn?'#1a1614':'#8fc3e8',gld=burn?'#141010':'#6a9ab8';
const car=(hood,ws,roof,rw)=>{O(hl,ht,L,W);R(col,hl,ht,L,W);R(dk,hl,ht,L,3);R(dk,hl,W/2-3,L,3);R('#2a2a30',hr-3,ht+3,3,W-6);R('#2a2a30',hl,ht+3,2,W-6);
const xw=hr-hood-ws;R(gl,xw,ht+4,ws,W-8);R('rgba(255,255,255,.3)',xw+2,ht+5,2,W-12);R(lt,xw-roof,ht+5,roof,W-10);R(gld,xw-roof-rw,ht+5,rw,W-10);
R('#16111c',xw+ws-3,ht-2,4,2);R('#16111c',xw+ws-3,W/2,4,2);R('#fff4c0',hr-4,ht+3,3,6);R('#fff4c0',hr-4,W/2-9,3,6);R('#c0392b',hl,ht+3,2,6);R('#c0392b',hl,W/2-9,2,6);return xw};
switch(v.k){
case 'hatch':car2(g,hl,ht,col);if(v.dmg){R('rgba(20,16,12,.35)',hl+52,ht+6,18,10);R('#bfe3f5',hl+60,ht+14,3,3)}break;
case 'sedan':case 'suv':case 'van':{const xw=v.k=='van'?car(12,10,52,4):v.k=='suv'?car(18,10,40,6):car(20,10,28,8);if(v.k=='suv'){R(dk,xw-36,ht+6,30,2);R(dk,xw-36,W/2-8,30,2)}if(v.k=='van'){R(dk,hl+8,-1,44,2)}break}
case 'police':{const xw=car(20,10,28,8);R('#f4f4f0',xw-24,ht,22,W);R('#f4f4f0',hr-10,ht,8,W);R('#16111c',xw-26,ht,1,W);R('#d8d8d4',xw-22,ht+5,18,W-10);
O(xw-14,ht+5,6,W-10);R('#c0392b',xw-14,ht+5,6,(W-10)/2);R('#2f6fd0',xw-14,0,6,(W-10)/2);R('#e8c040',xw-30,-2,4,4);break}
case 'limo':{const xw=car(22,10,98,8);for(let i=0;i<6;i++){R('#1a2a36',xw-90+i*15,ht+5,9,3);R('#1a2a36',xw-90+i*15,W/2-8,9,3)}R('#2a2a30',xw-60,-5,20,10);R('#c8ccd0',hr-2,-6,2,12);break}
case 'pickup':{O(hl,ht,L,W);R(col,hl,ht,L,W);R(dk,hl,ht,L,3);R(dk,hl,W/2-3,L,3);const xw=hr-20-10;R(gl,xw,ht+4,10,W-8);R(lt,xw-18,ht+5,18,W-10);R(gld,xw-22,ht+5,4,W-10);
R('#2a2a30',hl+3,ht+4,40,W-8);for(let i=0;i<5;i++)R('#3a3a42',hl+6+i*8,ht+5,2,W-10);R('#2a2a30',hr-3,ht+3,3,W-6);R('#fff4c0',hr-4,ht+3,3,6);R('#fff4c0',hr-4,W/2-9,3,6);R('#c0392b',hl,ht+3,2,6);R('#c0392b',hl,W/2-9,2,6);R('#16111c',xw+7,ht-2,4,2);R('#16111c',xw+7,W/2,4,2);break}
case 'amb':{O(hl,ht,L,W);R('#f4f4f0',hl,ht,L,W);R('#d8d8d4',hl,ht,L,3);R('#d8d8d4',hl,W/2-3,L,3);R(gl,hr-22,ht+5,9,W-10);R('#e8e8e4',hl+2,ht+3,L-30,W-6);R('#c0392b',hl,ht+3,L-28,4);R('#c0392b',hl,W/2-7,L-28,4);
R('#c0392b',hl+28,-2,16,4);R('#c0392b',hl+34,-8,4,16);O(hr-30,ht+5,5,W-10);R('#c0392b',hr-30,ht+5,5,W-10);R('#f4f4f0',hr-30,-3,5,6);R('#fff4c0',hr-3,ht+3,3,6);R('#fff4c0',hr-3,W/2-9,3,6);break}
case 'fire':{O(hl,ht,L,W);R('#b8261e',hl,ht,L,W);R('#8a1a14',hl,ht,L,3);R('#8a1a14',hl,W/2-3,L,3);R(gl,hr-24,ht+5,10,W-10);R('#c83a2e',hr-40,ht+5,16,W-10);O(hr-38,ht+6,5,W-12);R('#c0392b',hr-38,ht+6,5,(W-12)/2);R('#f4f4f0',hr-38,0,5,(W-12)/2);
R('#9aa0aa',hl+8,ht+8,L-56,4);R('#9aa0aa',hl+8,W/2-12,L-56,4);for(let x=hl+12;x<hr-50;x+=10)R('#c8ccd0',x,ht+12,2,W-24);R('#d8d8d4',hl+2,ht+2,6,W-4);R('#e8c040',hl,ht+3,L-44,1);R('#e8c040',hl,W/2-4,L-44,1);R('#fff4c0',hr-3,ht+3,3,6);R('#fff4c0',hr-3,W/2-9,3,6);break}
case 'bus':{O(hl,ht,L,W);R('#e3b22a',hl,ht,L,W);R('#c8961e',hl,ht,L,4);R('#c8961e',hl,W/2-4,L,4);R('#f0c84a',hl+4,ht+6,L-8,W-12);for(let x=hl+10;x<hr-30;x+=26)R('#c8961e',x,ht+6,2,W-12);R('#e8e8e4',hl+40,-6,14,12);R('#e8e8e4',hl+120,-6,14,12);R('#16111c',hr-3,ht,3,W);R('#16111c',hl,ht,3,W);R(gl,hr-14,ht+5,8,W-10);R('#fff4c0',hr-4,ht+3,2,6);R('#fff4c0',hr-4,W/2-9,2,6);break}
case 'semi':case 'cab':case 'trailer':case 'flatbed':case 'semif':{const cabL=66,fb=v.k=='flatbed'||v.k=='semif',tl=v.k=='trailer'||v.k=='flatbed'?L:v.k=='semi'||v.k=='semif'?L-cabL-4:0;
if(tl&&fb){g.save();g.translate(hl+tl/2,0);hwFlat(g,tl,W,v);g.restore()}else if(tl){g.save();g.translate(hl+tl/2,0);trl(g,tl,W,v.c||'#e8e8e4',v.st||['#c0392b','#2f6fd0','#2f8a4a','#d68a1c'][Math.floor((v.x*7)%4)]);g.restore()}
if(v.k=='trailer'&&v.tx){const t=String(v.tx).toUpperCase();let fs=16;g.font='bold 16px Arial, Helvetica, sans-serif';while(fs>7&&g.measureText(t).width>L-30){fs--;g.font='bold '+fs+'px Arial, Helvetica, sans-serif'}g.fillStyle=v.st||'#2f8a4a';g.textAlign='center';g.textBaseline='middle';g.fillText(t,0,0);g.textAlign='left';g.textBaseline='alphabetic'}
if(v.k!='trailer'&&v.k!='flatbed'){const x0=v.k=='cab'?hl:hr-cabL,cc=v.k=='cab'?col:(v.cc||['#c0392b','#2f6fd0','#d8d8d4','#26262c','#2f8a4a'][Math.floor((v.x*3)%5)]);O(x0,ht+1,cabL,W-2);R(cc,x0,ht+1,cabL,W-2);R(hwSh(cc,.72),x0,ht+1,cabL,3);R(hwSh(cc,.72),x0,W/2-4,cabL,3);R(hwSh(cc,1.2),x0+4,ht+6,30,W-12);R(gl,x0+cabL-22,ht+5,9,W-10);R('#2a2a30',x0+cabL-3,ht+3,3,W-8);R('#9aa0aa',x0+30,ht-2,6,3);R('#9aa0aa',x0+30,W/2-1,6,3);R('#fff4c0',x0+cabL-4,ht+4,3,6);R('#fff4c0',x0+cabL-4,W/2-10,3,6)}break}
case 'hearse':case 'hearseo':{const op=v.k=='hearseo',b0=op?hl+34:hl,BL=hr-b0,bc=burn?col:v.c||'#16141a',bd=hwSh(bc=='#16141a'?'#2a2830':bc,.8);
if(op){g.save();g.translate(b0+2,ht+2);g.rotate(-1.1);R('#16111c',-2,-30,6,32);R(bc,-1,-29,4,30);g.restore();R('#16111c',hl+3,-10,72,20);R('#5a3a22',hl+4,-9,70,18);R('#7a4f2a',hl+4,-9,70,3);R('#c8a040',hl+14,-10,4,2);R('#c8a040',hl+40,-10,4,2);R('#c8a040',hl+14,8,4,2);R('#c8a040',hl+40,8,4,2);R('#16111c',hl+4,-1,70,1)}
O(b0,ht,BL,W);R(bc,b0,ht,BL,W);R(bd,b0,ht,BL,3);R(bd,b0,W/2-3,BL,3);R('#2a2830',b0+4,ht+5,BL-44,W-10);R('#c8ccd0',b0+6,ht+4,BL-48,1);R('#c8ccd0',b0+6,W/2-5,BL-48,1);
for(const s of[-1,1]){g.strokeStyle='#c8ccd0';g.lineWidth=1.5;g.beginPath();g.moveTo(b0+24,s*(W/2-6));g.quadraticCurveTo(b0+34,s*(W/2-11),b0+44,s*(W/2-6));g.stroke()}
R(gl,hr-30,ht+5,9,W-10);R(lt,hr-50,ht+5,20,W-10);R('#c8ccd0',hr-3,ht+3,3,W-6);R('#fff4c0',hr-4,ht+3,3,6);R('#fff4c0',hr-4,W/2-9,3,6);if(!op){R('#c8ccd0',b0,ht+4,2,W-8);R('#c0392b',b0,ht+3,2,5);R('#c0392b',b0,W/2-8,2,5)}else R('#0c0a08',b0,ht+4,4,W-8);break}
case 'taxi':{const xw=car(20,10,28,8);R('#16111c',xw-22,-5,14,10);R('#f4f0e0',xw-21,-4,12,8);R('#16111c',xw-19,-2,8,1);for(let i=0;i<6;i++)R(i%2?'#16111c':'#f4f0e0',hl+6+i*6,W/2-5,6,2);break}
case 'ftruck':{const s=v.c?hwSh(col,.6):'#c0392b';R('rgba(0,0,0,.18)',hl+4,ht+6,L,W);for(const[wx,wy]of[[hl+16,ht-3],[hl+16,W/2-3],[L/2-28,ht-3],[L/2-28,W/2-3]])R('#16111c',wx,wy,16,6);O(hl,ht,L,W);R(col,hl,ht,L,W);R('rgba(255,255,255,.25)',hl,ht,L,4);R('rgba(0,0,0,.2)',hl,W/2-4,L,4);R(gl,L/2-30,ht+5,10,W-10);R('#e8e8e4',L/2-20,ht+4,17,W-8);R('#fff4c0',L/2-3,ht+3,3,6);R('#fff4c0',L/2-3,W/2-9,3,6);
R('#16111c',hl+12,W/2-2,L-60,14);for(let i=0;i<L-62;i+=8)R(i%16?'#f4f4f0':s,hl+13+i,W/2-1,8,12);R('#16111c',hl+8,ht+8,L-50,W-22);R('#f4f0e0',hl+9,ht+9,L-52,W-24);const t=String(v.tx||'TACO LOCO').toUpperCase();let fs=11;g.font='bold 11px Arial, Helvetica, sans-serif';while(fs>6&&g.measureText(t).width>L-58){fs--;g.font='bold '+fs+'px Arial, Helvetica, sans-serif'}g.fillStyle=s;g.textAlign='center';g.textBaseline='middle';g.fillText(t,hl+9+(L-52)/2,ht+9+(W-24)/2+1);g.textAlign='left';g.textBaseline='alphabetic';break}
case 'hmv':{O(hl,ht,L,W);R(col,hl,ht,L,W);R(dk,hl,ht,L,4);R(dk,hl,W/2-4,L,4);R(lt,hl+6,ht+7,L-40,W-14);R(gl,hr-36,ht+6,8,W-12);R(dk,hr-26,ht+6,22,W-12);g.fillStyle='#16111c';g.beginPath();g.arc(hl+30,0,9,0,7);g.fill();g.fillStyle=dk;g.beginPath();g.arc(hl+30,0,7,0,7);g.fill();R('#2a2a30',hl+30,-1,20,3);R('#3a3a30',hr-3,ht+2,3,W-4);R('#e0c040',hr-6,ht+3,3,4);R('#e0c040',hr-6,W/2-7,3,4);break}
case 'mtruck':{O(hl,ht,L,W);R(col,hl,ht,L,W);const cl=44;R(hwSh(col,1.15),hl,ht+2,L-cl-4,W-4);for(let x=hl+8;x<hr-cl-8;x+=16)R(dk,x,ht+2,3,W-4);R(dk,hr-cl,ht,cl,W);R(gl,hr-24,ht+6,8,W-12);R(lt,hr-cl+4,ht+6,16,W-12);R('#3a3a30',hr-3,ht+2,3,W-4);break}}
if(v.ov){R('#3a3a40',hl,ht,L,W);R('#2a2a30',hl+6,-2,L-12,4);for(const[x,y]of[[hr-20,ht-2],[hr-20,W/2-8],[hl+10,ht-2],[hl+10,W/2-8]]){O(x,y,14,10);R('#1a1a1e',x,y,14,10);R('#4a4a52',x+5,y+3,4,4)}R('#5a5a62',hl+16,-6,L-36,2);R('#5a5a62',hl+16,4,L-36,2);R('#7a6a5a',hl+L*.6,ht+4,10,W-8)}
if(v.dmg&&!v.ov){g.fillStyle='#16111c';g.beginPath();g.moveTo(hr+1,ht-1);g.lineTo(hr-10,ht+W*.25);g.lineTo(hr-3,0);g.lineTo(hr-12,W*.3);g.lineTo(hr+1,W/2+1);g.fill();g.fillStyle=dk;g.beginPath();g.moveTo(hr-2,ht+3);g.lineTo(hr-8,ht+W*.25);g.lineTo(hr-4,-2);g.lineTo(hr-9,W*.28);g.lineTo(hr-2,W/2-3);g.fill();
g.strokeStyle='rgba(255,255,255,.7)';g.lineWidth=1;g.beginPath();const cx=hr-26;g.moveTo(cx,-W*.2);g.lineTo(cx-4,0);g.lineTo(cx+3,W*.25);g.moveTo(cx-4,0);g.lineTo(cx-8,-W*.15);g.stroke();g.fillStyle='rgba(20,16,12,.25)';g.beginPath();g.ellipse(hr-16,-4,12,8,0,0,7);g.fill()}
if(burn){g.fillStyle='rgba(10,8,6,.5)';g.beginPath();g.ellipse(0,0,L*.45,W*.42,0,0,7);g.fill()}
if(v.rust){const h=(i,k)=>{const q=Math.sin(i*12.9898+k*78.233+v.x*.13+v.y*.07)*43758.5453;return q-Math.floor(q)};for(let i=0;i<14;i++){g.fillStyle=i%3?'#7a4a2a':'#8a5a32';g.fillRect(hl+h(i,1)*(L-8),ht+h(i,2)*(W-6),3+h(i,3)*6,2+h(i,4)*4)}g.fillStyle='#8a8a82';g.fillRect(hl+L*.38,ht+1,L*.18,4);g.strokeStyle='rgba(255,255,255,.55)';g.lineWidth=1;g.beginPath();g.moveTo(hr-24,-W*.2);g.lineTo(hr-28,2);g.lineTo(hr-22,W*.22);g.stroke();g.fillStyle='#16111c';g.fillRect(hr-26,W/2-1,12,3)}
g.restore()}
