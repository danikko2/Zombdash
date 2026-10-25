//# maps/highway.js — Deadway Highway map
// ---------- Deadway Highway: a jammed interstate with crashes, emergency scenes and the Graveyard exit ----------
// (functions only: they run during map builds, possibly at boot)
function hwH(i,k){const v=Math.sin(i*12.9898+k*78.233+3.3)*43758.5453;return v-Math.floor(v)}
function hwSh(c,k){const n=parseInt(c.slice(1),16),f=v=>Math.max(0,Math.min(255,Math.round(v*k)));return '#'+[(n>>16)&255,(n>>8)&255,n&255].map(v=>f(v).toString(16).padStart(2,'0')).join('')}
function HWV(k){return {hatch:[88,36],sedan:[80,36],suv:[88,40],pickup:[94,40],van:[92,42],limo:[150,38],police:[84,36],amb:[106,44],fire:[178,48],bus:[206,46],semi:[292,48],cab:[66,46],trailer:[222,48],hmv:[98,48],mtruck:[170,50],taxi:[80,36],ftruck:[140,50]}[k]}
// exit ramp centerline (cubic) then straight off the bottom of the map
function hwRamp(){const P0=[1630,990],P1=[1900,1000],P2=[2250,1150],P3=[2420,1420],pts=[];for(let i=0;i<=40;i++){const t=i/40,u=1-t;pts.push([u*u*u*P0[0]+3*u*u*t*P1[0]+3*u*t*t*P2[0]+t*t*t*P3[0],u*u*u*P0[1]+3*u*u*t*P1[1]+3*u*t*t*P2[1]+t*t*t*P3[1]])}for(let i=1;i<=8;i++)pts.push([2420+i*6.5,1420+i*52]);return pts}
function hwOff(pts,d){return pts.map((p,i)=>{const a=pts[Math.max(0,i-1)],b=pts[Math.min(pts.length-1,i+1)],dx=b[0]-a[0],dy=b[1]-a[1],L=Math.hypot(dx,dy)||1;return[p[0]-dy/L*d,p[1]+dx/L*d]})}
function hwAt(pts,t){const f=t*(pts.length-1),i=Math.min(pts.length-2,Math.floor(f)),u=f-i,a=pts[i],b=pts[i+1];return{x:a[0]+(b[0]-a[0])*u,y:a[1]+(b[1]-a[1])*u,a:Math.atan2(b[1]-a[1],b[0]-a[0])}}
// the line-up of vehicles (deterministic)
function hwPlan(){const V=[],add=(k,x,y,a,o)=>{const s=HWV(k);V.push(Object.assign({k,x,y,a,L:s[0],W:s[1]},o||{}))};
const CC=['#c0392b','#2f6fd0','#d8d8d4','#26262c','#8a8f96','#2f8a4a','#d68a1c','#6a4a9a','#a8a49a','#7a1f1f','#1f4f7a','#e0c040'];
const COR=[[250,330],[850,930],[1430,1515],[2040,2125],[2690,2770]];
const RES=[[960,1320,[2,3,4,5,6]],[2130,2700,[4,5,6,7]],[1525,2035,[1]],[1900,2085,[0]],[600,820,[2]]];
const LY=[420,480,540,600,760,820,880,940];let n=0;
LY.forEach((y,li)=>{const wb=li<4;let x=20+hwH(li,1)*60;
while(x<2780){n++;const r=hwH(n,2),k=r<.3?'sedan':r<.45?'suv':r<.57?'pickup':r<.65?'van':r<.73?'semi':r<.77?'bus':r<.8?'limo':r<.84?'police':r<.86?'amb':'sedan',L=HWV(k)[0],x0=x,x1=x+L;
if(COR.some(c=>x1>c[0]&&x0<c[1])||RES.some(R=>R[2].includes(li)&&x1>R[0]&&x0<R[1])||x1>2790){x+=12;continue}
const c=CC[Math.floor(hwH(n,3)*CC.length)];add(k,x+L/2,y+(hwH(n,4)-.5)*8,(wb?Math.PI:0)+(hwH(n,5)-.5)*.1,{c,hz:k!='police'&&k!='amb'&&hwH(n,6)<.18,lt:(k=='police'||k=='amb')&&hwH(n,7)<.6});
x=x1+40+hwH(n,8)*60}});
// jackknifed semi across the median, a police car stopped behind it
{const ta=-.18,tx=1090,ty=790;add('trailer',tx,ty,ta,{c:'#e8e8e4',st:'#c0392b',dmg:1});const fx=tx+111*Math.cos(ta),fy=ty+111*Math.sin(ta),ca=-1.2;add('cab',fx+36*Math.cos(ca),fy+36*Math.sin(ca),ca,{c:'#2f6fd0',dmg:1})}
add('police',1150,600,Math.PI-.25,{lt:1});add('sedan',1010,545,Math.PI+.35,{c:'#d8d8d4',dmg:1,hz:1});add('suv',1265,880,.4,{c:'#26262c',dmg:1});
// pile-up in the eastbound lanes, one burning, one flipped
add('sedan',2190,760,.55,{c:'#c0392b',dmg:1});add('suv',2265,812,-.45,{c:'#8a8f96',dmg:1,hz:1});add('pickup',2345,868,1.2,{c:'#d68a1c',ov:1});add('sedan',2280,930,2.6,{c:'#2f6fd0',burn:1});
add('van',2410,785,.15,{c:'#d8d8d4',dmg:1});add('sedan',2430,912,-.7,{c:'#2f8a4a',dmg:1,hz:1});
// emergency scene just past it: fire truck, ambulance, two cruisers
add('fire',2590,768,-.04,{lt:1});add('amb',2560,895,.08,{lt:1});add('police',2665,880,1.35,{lt:1});add('police',2520,955,.2,{lt:0});
// military convoy stuck westbound
add('hmv',1580,480,Math.PI,{c:'#6a7056'});add('mtruck',1730,482,Math.PI+.02,{c:'#5f6650'});add('hmv',1880,478,Math.PI-.03,{c:'#6a7056',hz:1});add('mtruck',1990,420,Math.PI+.05,{c:'#5f6650',lt:0});
// the limo, hazards on
add('limo',710,540,Math.PI+.03,{c:'#16161a',hz:1});
// cars that went through the guard rails
add('sedan',728,328,Math.PI+1.05,{c:'#7a1f1f',dmg:1,hz:1});add('pickup',1992,306,Math.PI+.78,{c:'#2f6fd0',dmg:1});
add('suv',522,1052,.95,{c:'#e0c040',dmg:1});add('bus',1172,1082,.5,{dmg:1,hz:1});
// on the exit ramp
const RP=hwRamp();{const p=hwAt(RP,.5),o=hwOff(RP,16),q=hwAt(o,.5);add('sedan',q.x,q.y,p.a,{c:'#a8a49a',hz:1})}add('sedan',2610,1072,1.05,{c:'#d8d8d4',dmg:1});
return V}
// collision for one vehicle: a box when it's square to the road, otherwise a chain of squares along it
function hwCol(v){const c=Math.cos(v.a),s=Math.sin(v.a),L=v.L,W=v.W,f=1;
if(Math.abs(s)<.09){const w=W+8;WL.push([v.x-L/2,v.y-w/2,L,w,1]);return}if(Math.abs(c)<.09){const w=W+8;WL.push([v.x-w/2,v.y-L/2,w,L,1]);return}
const q=W*.84,n=Math.max(2,Math.ceil((L-q)/(q*.6))+1);for(let i=0;i<n;i++){const u=-L/2+q/2+(L-q)*i/(n-1);WL.push([v.x+c*u-q/2,v.y+s*u-q/2,q,q,1])}}
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
case 'semi':case 'cab':case 'trailer':{const cabL=66,tl=v.k=='trailer'?L:v.k=='semi'?L-cabL-4:0;
if(tl){g.save();g.translate(hl+tl/2,0);trl(g,tl,W,v.c||'#e8e8e4',v.st||['#c0392b','#2f6fd0','#2f8a4a','#d68a1c'][Math.floor((v.x*7)%4)]);g.restore()}
if(v.k=='trailer'&&v.tx){const t=String(v.tx).toUpperCase();let fs=16;g.font='bold 16px Arial, Helvetica, sans-serif';while(fs>7&&g.measureText(t).width>L-30){fs--;g.font='bold '+fs+'px Arial, Helvetica, sans-serif'}g.fillStyle=v.st||'#2f8a4a';g.textAlign='center';g.textBaseline='middle';g.fillText(t,0,0);g.textAlign='left';g.textBaseline='alphabetic'}
if(v.k!='trailer'){const x0=v.k=='cab'?hl:hr-cabL,cc=v.k=='cab'?col:(v.cc||['#c0392b','#2f6fd0','#d8d8d4','#26262c','#2f8a4a'][Math.floor((v.x*3)%5)]);O(x0,ht+1,cabL,W-2);R(cc,x0,ht+1,cabL,W-2);R(hwSh(cc,.72),x0,ht+1,cabL,3);R(hwSh(cc,.72),x0,W/2-4,cabL,3);R(hwSh(cc,1.2),x0+4,ht+6,30,W-12);R(gl,x0+cabL-22,ht+5,9,W-10);R('#2a2a30',x0+cabL-3,ht+3,3,W-8);R('#9aa0aa',x0+30,ht-2,6,3);R('#9aa0aa',x0+30,W/2-1,6,3);R('#fff4c0',x0+cabL-4,ht+4,3,6);R('#fff4c0',x0+cabL-4,W/2-10,3,6)}break}
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
// light points in world space: emergency bars, hazards
function hwLights(v,LT,i){const c=Math.cos(v.a),s=Math.sin(v.a),P_=(lx,ly,t,ph)=>LT.push({x:v.x+c*lx-s*ly,y:v.y+s*lx+c*ly,t,ph,i});const hr=v.L/2,hw=v.W/2;
if(v.lt){if(v.k=='police'){const xw=hr-30;P_(xw-11,-hw*.45,'r',i*.37);P_(xw-11,hw*.45,'b',i*.37)}
else if(v.k=='amb'){P_(hr-28,-hw*.5,'r',i*.21);P_(hr-28,hw*.5,'r',i*.21+.5);P_(-hr+3,-hw+3,'r',i*.21+.25);P_(-hr+3,hw-3,'r',i*.21+.75)}
else if(v.k=='fire'){P_(hr-36,-hw*.5,'r',i*.13);P_(hr-36,hw*.5,'w',i*.13+.5);P_(-hr+4,-hw+4,'r',i*.13+.3);P_(-hr+4,hw-4,'r',i*.13+.8)}}
if(v.hz){P_(hr-3,-hw+4,'a',i*.11);P_(hr-3,hw-4,'a',i*.11);P_(-hr+2,-hw+4,'a',i*.11);P_(-hr+2,hw-4,'a',i*.11)}}
// a run of guard rail along a polyline (steel W-beam on posts)
function hwRail(g,pts){g.lineCap='butt';g.strokeStyle='#16111c';g.lineWidth=8;g.beginPath();pts.forEach((p,i)=>i?g.lineTo(p[0],p[1]):g.moveTo(p[0],p[1]));g.stroke();g.strokeStyle='#a8adb5';g.lineWidth=6;g.stroke();g.strokeStyle='#d4d8de';g.lineWidth=2;g.stroke();
let acc=0;for(let i=1;i<pts.length;i++){const a=pts[i-1],b=pts[i],L=Math.hypot(b[0]-a[0],b[1]-a[1]);for(let d=(32-acc%32)%32;d<L;d+=32){const x=a[0]+(b[0]-a[0])*d/L,y=a[1]+(b[1]-a[1])*d/L;g.fillStyle='#16111c';g.fillRect(x-3,y+2,6,7);g.fillStyle='#6e737b';g.fillRect(x-2,y+3,4,5)}acc+=L}}
function hwRailCol(pts){for(let i=1;i<pts.length;i++){const a=pts[i-1],b=pts[i],L=Math.hypot(b[0]-a[0],b[1]-a[1]);for(let d=0;d<L;d+=7){const x=a[0]+(b[0]-a[0])*d/L,y=a[1]+(b[1]-a[1])*d/L;WL.push([x-4,y-4,8,8,2])}}}
// green highway signs
function hwSign(g,x,py,big){const pw=big?300:150,ph=big?96:58,bx=x-pw/2,by=py-ph-(big?54:40),posts=big?[x-pw/2+40,x+pw/2-40]:[x];
g.fillStyle='rgba(0,0,0,.25)';for(const px of posts)g.fillRect(px-1,py-2,14,4);for(const px of posts){g.fillStyle='#16111c';g.fillRect(px-4,by+ph-2,8,py-by-ph+4);g.fillStyle='#8a9096';g.fillRect(px-3,by+ph,6,py-by-ph+1);g.fillStyle='#c8ccd0';g.fillRect(px-3,by+ph,2,py-by-ph+1)}
const panel=(x0,y0,w,h)=>{g.fillStyle='#16111c';g.fillRect(x0-2,y0-2,w+4,h+4);g.fillStyle='#1d7a3e';g.fillRect(x0,y0,w,h);g.fillStyle='#f4f1e6';g.fillRect(x0+3,y0+3,w-6,2);g.fillRect(x0+3,y0+h-5,w-6,2);g.fillRect(x0+3,y0+3,2,h-6);g.fillRect(x0+w-5,y0+3,2,h-6)};
g.textAlign='center';g.textBaseline='middle';
if(big){panel(bx+pw-104,by-26,96,26);panel(bx,by,pw,ph);g.fillStyle='#f4f1e6';g.font='bold 13px Arial, Helvetica, sans-serif';g.fillText('EXIT 13',bx+pw-56,by-12);
g.font='bold 26px Arial, Helvetica, sans-serif';g.fillText('GRAVEYARD',x,by+30);g.font='bold 17px Arial, Helvetica, sans-serif';g.fillText('EXIT NOW',x-24,by+68);
g.save();g.translate(x+62,by+66);g.rotate(Math.PI*.25);g.fillRect(-14,-3,22,6);g.beginPath();g.moveTo(6,-10);g.lineTo(19,0);g.lineTo(6,10);g.fill();g.restore()}
else{panel(bx,by,pw,ph);g.fillStyle='#f4f1e6';g.font='bold 12px Arial, Helvetica, sans-serif';g.fillText('EXIT 13',x-14,by+16);g.font='bold 14px Arial, Helvetica, sans-serif';g.fillText('GRAVEYARD',x-14,by+38);
g.save();g.translate(x+52,by+28);g.rotate(Math.PI*.25);g.fillRect(-10,-2.5,15,5);g.beginPath();g.moveTo(4,-7);g.lineTo(13,0);g.lineTo(4,7);g.fill();g.restore()}
g.textAlign='left';g.textBaseline='alphabetic'}
function mapHighway(){WW=2800;WH=1800;
HS={px:1475,py:717,cx:1475,cy:700,nx0:-999,nx1:-998,ny0:-999,ny1:-998};
const V=hwPlan(),RP=hwRamp(),RO=hwOff(RP,52),RI=hwOff(RP,-52);
// guard rails (gaps where cars went through), the median barrier, the ramp rails
const NR=[[0,680],[775,1935],[2045,2480],[2560,2800]],SR=[[0,465],[575,1070],[1255,1625]],MB=[[0,395],[465,1180],[1265,2135],[2210,2800]];
for(const[a,b]of NR)WL.push([a,343,b-a,6,2]);for(const[a,b]of SR)WL.push([a,1011,b-a,6,2]);for(const[a,b]of MB)WL.push([a,674,b-a,12,2]);WL.push([1900,1011,650,6,2],[2660,1011,140,6,2]);
const gi=RI.findIndex(p=>p[1]>1022);hwRailCol(RO.slice(1));hwRailCol(RI.slice(Math.max(1,gi)));
for(const v of V)hwCol(v);
// sign posts
WL.push([325,292,10,10,2],[505,292,10,10,2],[725,1392,10,10,2],[905,1392,10,10,2],[1366,1120,10,10,2],[1526,1120,10,10,2],[2296,1044,10,10,2]);
// trees on the embankments (solid trunks)
const TRS=[];let n=0;const okT=(x,y)=>!TRS.some(t=>Math.hypot(t.x-x,t.y-y)<74)&&!V.some(v=>Math.hypot(v.x-x,v.y-y)<v.L/2+40)&&!RP.some(p=>Math.hypot(p[0]-x,p[1]-y)<100)&&!(x>1300&&x<1600&&y>950&&y<1200)&&!(x>2200&&x<2400&&y>920&&y<1100)&&!(x>240&&x<600&&y>60&&y<330)&&!(x>640&&x<1000&&y>1160&&y<1430);
for(let i=0;i<400&&TRS.length<54;i++){n++;const top=i%2==0,x=30+hwH(n,21)*(WW-60),y=top?30+hwH(n,22)*250:1120+hwH(n,22)*640;if(!okT(x,y))continue;const pine=hwH(n,23)<.4;TRS.push({x,y,pine:pine?1:0,r:Math.round(pine?14+hwH(n,24)*5:17+hwH(n,24)*8),v:hwH(n,25)});WL.push([x-6,y-6,12,12,2])}
const KO=[[0,320,WW,1030],[240,80,600,330],[640,1180,1000,1430],[1300,1000,1600,1200],[2200,920,2400,1100]];for(const p of RP)KO.push([p[0]-70,p[1]-70,p[0]+70,p[1]+70]);
const DEC=scatter(5,[['bush',3],['tuft',5],['rock',2],['tire',1],['can',1],['dead',1]],70,KO);
for(const[x,y]of[[2486,742],[2486,800],[2486,862],[2486,922],[2470,972],[1150,650],[1200,655],[2700,990]])put(DEC,'cone',x,y);
SM=V.filter(v=>v.burn||v.k=='cab').map(v=>({x:v.x,y:v.y-10}));
grid();
const g=ground('#5d7a3c','#587436','#62803f','#4a6630');
// embankments: mown strips by the rails, ditches
g.fillStyle='#6a8a44';g.fillRect(0,300,WW,46);g.fillRect(0,1020,WW,40);
const ditch=(y0,amp)=>{g.fillStyle='#3e5a2c';for(let x=0;x<WW;x+=4){const y=y0+amp*Math.sin(x/140)+6*Math.sin(x/37);g.fillRect(x,y-7,4,14)}g.fillStyle='#4a5a46';for(let x=0;x<WW;x+=4){const y=y0+amp*Math.sin(x/140)+6*Math.sin(x/37);g.fillRect(x,y-2,4,4)}};ditch(250,14);ditch(1230,18);
// road deck
g.fillStyle='#46494e';g.fillRect(0,350,WW,660);g.fillStyle='#3c3f44';g.fillRect(0,390,WW,240);g.fillRect(0,730,WW,240);
for(let i=0;i<2600;i++){const x=hwH(i,31)*WW,y=350+hwH(i,32)*660;g.fillStyle=i%3?'rgba(0,0,0,.12)':'rgba(255,255,255,.05)';g.fillRect(x,y,2+i%4,2)}
for(let i=0;i<40;i++)crack(g,hwH(i,33)*WW,360+hwH(i,34)*640,7,'rgba(10,10,10,.45)');
g.fillStyle='rgba(0,0,0,.18)';for(let i=0;i<26;i++){g.beginPath();g.ellipse(hwH(i,35)*WW,[420,480,540,600,760,820,880,940][i%8],22+i%3*8,7,0,0,7);g.fill()}
// lane lines
g.fillStyle='#ecebe4';g.fillRect(0,388,WW,3);g.fillRect(0,968,WW,3);g.fillStyle='#e0b030';g.fillRect(0,628,WW,3);g.fillRect(0,729,WW,3);
g.fillStyle='rgba(236,235,228,.9)';for(const y of[449,509,569,789,849,909])for(let x=(y*7)%100;x<WW;x+=100)g.fillRect(x,y,44,3);
g.fillStyle='rgba(0,0,0,.25)';for(let x=0;x<WW;x+=10){g.fillRect(x,358,4,14);g.fillRect(x,990,4,14)}
// exit ramp
const strokeP=(pts,w,c)=>{g.strokeStyle=c;g.lineWidth=w;g.lineJoin='round';g.beginPath();pts.forEach((p,i)=>i?g.lineTo(p[0],p[1]):g.moveTo(p[0],p[1]));g.stroke()};
strokeP(RP,108,'#46494e');strokeP(RP,70,'#ecebe4');strokeP(RP,64,'#3c3f44');
g.fillStyle='#46494e';g.fillRect(1600,960,320,50);g.fillStyle='#ecebe4';g.fillRect(1600,968,60,3);
// gore chevrons between the ramp and the mainline
g.save();g.beginPath();g.moveTo(1700,1009);g.lineTo(2160,1009);for(const p of hwOff(RP,-36).filter(p=>p[0]>1700&&p[0]<2160).reverse())g.lineTo(p[0],p[1]);g.closePath();g.clip();g.fillStyle='rgba(236,235,228,.85)';for(let x=1700;x<2180;x+=22){g.save();g.translate(x,1030);g.rotate(-.7);g.fillRect(-2,-40,5,80);g.restore()}g.restore();
for(let i=0;i<10;i++)crack(g,RP[i*4][0]+hwH(i,36)*20,RP[i*4][1],6,'rgba(10,10,10,.45)');
// skid marks into the crash sites
g.strokeStyle='rgba(16,14,12,.55)';g.lineWidth=3;for(const[a,b,c,d,e,f]of[[980,420,850,400,760,350],[2260,430,2120,410,2020,330],[300,940,420,960,500,1015],[900,950,1050,980,1130,1040],[880,780,960,790,1040,786],[2020,800,2120,790,2180,770],[2400,960,2520,990,2600,1050],[2060,900,2160,920,2260,925]])for(const o of[-7,7]){g.beginPath();g.moveTo(a,b+o);g.quadraticCurveTo(c,d+o,e,f+o);g.stroke()}
// median barrier with broken sections
for(const[a,b]of MB){g.fillStyle='rgba(0,0,0,.25)';g.fillRect(a,688,b-a,6);g.fillStyle='#16111c';g.fillRect(a,670,b-a,20);g.fillStyle='#a4a097';g.fillRect(a,671,b-a,18);g.fillStyle='#c8c4ba';g.fillRect(a,676,b-a,6);g.fillStyle='#8a867c';for(let x=a+40;x<b;x+=40)g.fillRect(x,671,1,18)}
for(const[x,y,r]of[[1190,660,.5],[1210,700,-.3],[1240,650,1.2],[2150,700,.8],[2190,655,-.6],[405,700,.2]]){g.save();g.translate(x,y);g.rotate(r);g.fillStyle='#16111c';g.fillRect(-13,-7,26,14);g.fillStyle='#a4a097';g.fillRect(-12,-6,24,12);g.fillStyle='#c8c4ba';g.fillRect(-12,-2,24,4);g.restore()}
for(let i=0;i<60;i++){g.fillStyle=i%2?'#8a867c':'#b4b0a6';g.fillRect(1180+hwH(i,37)*90,650+hwH(i,38)*60,3,2);g.fillRect(2130+hwH(i,39)*80,650+hwH(i,40)*60,3,2)}
// guard rails, bent where cars went through
for(const[a,b]of NR)hwRail(g,[[a,346],[b,346]]);for(const[a,b]of SR)hwRail(g,[[a,1014],[b,1014]]);hwRail(g,[[1900,1014],[2550,1014]]);hwRail(g,[[2660,1014],[2800,1014]]);hwRail(g,RO.slice(1));hwRail(g,RI.slice(Math.max(1,gi)));
for(const[x,y,a,L]of[[680,346,-.9,46],[775,346,-2.1,40],[1935,346,-.8,50],[2045,346,-2.3,38],[465,1014,.8,48],[575,1014,2.4,40],[1070,1014,.6,60],[1255,1014,2.6,50],[2550,1014,.9,44],[2660,1014,2.3,40]])hwRail(g,[[x,y],[x+Math.cos(a)*L,y+Math.sin(a)*L]]);
// glass and debris around wrecks
for(const v of V)if(v.dmg||v.burn||v.ov){for(let i=0;i<26;i++){const a=hwH(i,v.x)*6.283,r=v.W*.6+hwH(i,v.y)*v.L*.6;g.fillStyle=i%3==0?'#bfe6ff':i%3==1?'#5a5a62':'#8a8f96';g.fillRect(v.x+Math.cos(a)*r,v.y+Math.sin(a)*r,2+i%2,2)}}
for(const v of V)if(v.burn){g.fillStyle='rgba(10,8,6,.5)';g.beginPath();g.ellipse(v.x,v.y,v.L*.8,v.W*.9,v.a,0,7);g.fill()}
// shadows, then the vehicles (captured so anyone behind them gets hidden)
for(const v of V){g.save();g.translate(v.x+4,v.y+5);g.rotate(v.a);g.fillStyle='rgba(0,0,0,.28)';g.fillRect(-v.L/2,-v.W/2,v.L,v.W);g.restore()}
for(const v of V){const r=Math.hypot(v.L,v.W)/2+6;vDraw(g,v.x-r,v.y-r,r*2,r*2,q=>hwDraw(q,v))}
paintDec(g,DEC);
// trees (trunk + canopy), the signs
for(const t of TRS){const{x,y,r}=t;g.fillStyle='rgba(0,0,0,.28)';g.beginPath();g.ellipse(x+4,y+2,r*.9,r*.45,0,0,7);g.fill();g.fillStyle='#16111c';g.fillRect(x-4,y-6,8,9);g.fillStyle='#5a3a22';g.fillRect(x-3,y-6,6,8);
if(typeof document=='undefined'||!document.createElement)continue;const sp=subSpr(t.pine,r,t.v),sx=Math.round(x-sp.width/2),sy=Math.round(t.pine?y-10-sp.height+2:y-r*.7-sp.height/2);vDraw(g,sx,sy,sp.width,sp.height,q=>q.drawImage(sp,sx,sy))}
vDraw(g,1290,940,330,200,q=>hwSign(q,1450,1130,1));vDraw(g,262,80,316,226,q=>hwBill(q,420,300,'west'));vDraw(g,662,1180,316,226,q=>hwBill(q,820,1400,'army'));vDraw(g,2220,920,170,140,q=>hwSign(q,2300,1052,0));
// lights to animate
const LT=[];V.forEach((v,i)=>hwLights(v,LT,i));for(const[x,y]of[[2478,770],[2478,830],[2478,895],[2470,950],[1180,640]])LT.push({x,y,t:'f',ph:x*.01});HS.HL=LT;HS.HB=V.filter(v=>v.burn).map(v=>({x:v.x,y:v.y,L:v.L,a:v.a}))}
// flashing light bars, hazards, road flares and fires (drawn under people)
function hwAnim(){if(mapId!==8||!HS.HL)return;const t=performance.now()/1000,x0=cam.x-60,y0=cam.y-60,x1=cam.x+W+60,y1=cam.y+H+60;
for(const L of HS.HL){if(L.x<x0||L.x>x1||L.y<y0||L.y>y1)continue;let on,c,big=1;
if(L.t=='a'){on=(t*1.3+L.ph)%1<.5;c='#ffa62a';big=.6}else if(L.t=='f'){on=1;c=Math.random()<.5?'#ff3a2a':'#ff7a3a';big=.7}
else if(L.t=='w'){on=Math.floor(t*9+L.ph*9)%3==0;c='#ffffff'}else{const k=Math.floor(t*6+L.ph*6)%4;on=L.t=='b'?k>=2:k<2;c=L.t=='b'?'#3a7aff':'#ff2a2a'}
if(!on)continue;X.fillStyle=c;X.globalAlpha=.07*big;X.beginPath();X.arc(L.x,L.y,46*big,0,7);X.fill();X.globalAlpha=.16;X.beginPath();X.arc(L.x,L.y,18*big,0,7);X.fill();X.globalAlpha=.45;X.beginPath();X.arc(L.x,L.y,8*big,0,7);X.fill();X.globalAlpha=1;X.fillRect(Math.round(L.x)-2,Math.round(L.y)-2,4,4)}
for(const B of HS.HB||[]){if(B.x<x0||B.x>x1||B.y<y0||B.y>y1)continue;const c=Math.cos(B.a),s=Math.sin(B.a);for(let i=0;i<9;i++){const u=(i/8-.5)*B.L*.7,fx=B.x+c*u,fy=B.y+s*u,fh=10+(Math.sin(t*9+i*1.9)+1)*7;X.fillStyle=i%2?'#ff7a1a':'#ffb02e';X.fillRect(fx-3,fy-fh,6,fh);X.fillStyle='#ffe27a';X.fillRect(fx-1,fy-fh*.55,3,fh*.5)}}}
// roadside billboards: the Old West attraction, and the army recruiting poster
function hwBill(g,x,py,k){const bw=300,bh=124,bx=x-bw/2,by=py-70-bh,R=(c,a,b,w,h)=>{g.fillStyle=c;g.fillRect(a,b,w,h)},T=(t,a,b,f,c,al)=>{g.font=f;g.textAlign=al||'center';g.textBaseline='middle';g.fillStyle='#16111c';for(const[dx,dy]of[[2,2],[1,2],[2,1]])g.fillText(t,a+dx,b+dy);g.fillStyle=c;g.fillText(t,a,b)};
g.fillStyle='rgba(0,0,0,.25)';g.beginPath();g.ellipse(x+8,py+2,bw*.42,10,0,0,7);g.fill();
for(const px of[x-90,x+90]){R('#16111c',px-6,by+bh-2,12,py-by-bh+4);R('#6e737b',px-5,by+bh,10,py-by-bh+1);R('#9aa0aa',px-5,by+bh,3,py-by-bh+1);R('#4a4e56',px-1,by+bh,2,py-by-bh+1);for(let y=by+bh+10;y<py-6;y+=16)R('#4a4e56',px-5,y,10,2)}
R('#16111c',bx-4,by+bh+2,bw+8,8);R('#5a5e66',bx-3,by+bh+3,bw+6,6);for(let i=bx;i<bx+bw;i+=12)R('#3a3d44',i,by+bh+3,2,6);
R('#16111c',bx-3,by-3,bw+6,bh+6);R('#e8e4d8',bx-1,by-1,bw+2,bh+2);g.save();g.beginPath();g.rect(bx,by,bw,bh);g.clip();
if(k=='west'){const sky=['#ffcf6a','#ffb04a','#ff944a','#f07a4a','#d8664a'];sky.forEach((c,i)=>R(c,bx,by+i*14,bw,14));g.fillStyle='#fff2b0';g.beginPath();g.arc(bx+250,by+52,20,0,7);g.fill();
g.fillStyle='#b8784a';g.beginPath();g.moveTo(bx,by+78);g.lineTo(bx+40,by+56);g.lineTo(bx+70,by+66);g.lineTo(bx+110,by+50);g.lineTo(bx+150,by+78);g.fill();g.fillStyle='#c98a50';g.beginPath();g.moveTo(bx+150,by+78);g.lineTo(bx+200,by+60);g.lineTo(bx+240,by+72);g.lineTo(bx+300,by+58);g.lineTo(bx+300,by+80);g.fill();R('#d8a868',bx,by+78,bw,46);R('#c8945a',bx,by+90,bw,2);R('#c8945a',bx,by+106,bw,2);
// saloon front with swinging doors, a water tower and a cactus
R('#16111c',bx+186,by+44,98,62);R('#8a5a34',bx+187,by+45,96,60);R('#a8703a',bx+187,by+45,96,6);R('#6a4024',bx+187,by+72,96,3);R('#f4e0a0',bx+200,by+52,70,12);g.font='bold 10px Arial, Helvetica, sans-serif';g.textAlign='center';g.textBaseline='middle';g.fillStyle='#7a2a1a';g.fillText('SALOON',bx+235,by+58);
R('#2a1a10',bx+222,by+80,26,25);R('#c8945a',bx+223,by+84,11,14);R('#c8945a',bx+236,by+84,11,14);R('#fff4c0',bx+195,by+80,14,10);R('#fff4c0',bx+261,by+80,14,10);R('#16111c',bx+186,by+105,98,2);
R('#5a3a22',bx+150,by+60,4,46);R('#5a3a22',bx+172,by+60,4,46);R('#16111c',bx+146,by+40,34,24);R('#7a5232',bx+147,by+41,32,22);R('#6a4024',bx+147,by+48,32,2);R('#6a4024',bx+147,by+55,32,2);
const cac=(cx,cy,s)=>{R('#16111c',cx-4*s,cy-28*s,8*s,30*s);R('#3f8a42',cx-3*s,cy-27*s,6*s,28*s);R('#16111c',cx-12*s,cy-18*s,6*s,12*s);R('#3f8a42',cx-11*s,cy-17*s,4*s,10*s);R('#3f8a42',cx-11*s,cy-9*s,10*s,3*s);R('#16111c',cx+6*s,cy-22*s,6*s,10*s);R('#3f8a42',cx+7*s,cy-21*s,4*s,8*s);R('#3f8a42',cx+2*s,cy-14*s,8*s,3*s)};cac(bx+128,by+110,1);cac(bx+24,by+116,.7);
T('VISIT THE',bx+12,by+16,'bold 13px Arial, Helvetica, sans-serif','#fff4c0','left');T('OLD WEST!',bx+10,by+38,'bold 24px Arial, Helvetica, sans-serif','#7a2a1a','left');
R('rgba(122,42,26,.92)',bx,by+bh-22,bw,22);T('SHOOTOUTS AT HIGH NOON · GOLD PANNING',x,by+bh-15,'bold 10px Arial, Helvetica, sans-serif','#fff4c0');T('EXIT 21 · 30 MILES',x,by+bh-5,'bold 8px Arial, Helvetica, sans-serif','#ffcf6a')}
else{R('#4f5a3a',bx,by,bw,bh);for(let i=0;i<7;i++)R(i%2?'#f4f1e6':'#b8261e',bx,by+bh-30+i*4,bw,4);R('#1f3f7a',bx,by+bh-30,92,28);
g.fillStyle='#f4f1e6';for(let r=0;r<3;r++)for(let c=0;c<5;c++)g.fillRect(bx+8+c*17+(r%2)*8,by+bh-26+r*8,3,3);
// helmeted soldier silhouette pointing at you
g.fillStyle='#16111c';g.beginPath();g.ellipse(bx+250,by+44,30,18,0,Math.PI,0);g.fill();R('#16111c',bx+218,by+42,64,6);g.fillStyle='#6a7056';g.beginPath();g.ellipse(bx+250,by+44,28,16,0,Math.PI,0);g.fill();R('#5a6048',bx+220,by+43,60,4);R('#16111c',bx+230,by+48,40,34);R('#d8a878',bx+232,by+48,36,24);R('#16111c',bx+238,by+56,6,3);R('#16111c',bx+256,by+56,6,3);R('#a8784a',bx+242,by+66,16,2);
R('#16111c',bx+214,by+72,72,22);R('#6a7056',bx+215,by+73,70,20);R('#16111c',bx+196,by+60,26,12);R('#d8a878',bx+197,by+61,22,10);R('#d8a878',bx+192,by+62,8,4);
g.fillStyle='#e8c040';const st=(cx,cy,r)=>{g.beginPath();for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5,rr=i%2?r*.42:r;g.lineTo(cx+Math.cos(a)*rr,cy+Math.sin(a)*rr)}g.fill()};st(bx+42,by+52,9);st(bx+158,by+52,9);
T('ZOMBVILLE NEEDS YOU!',bx+100,by+18,'bold 13px Arial, Helvetica, sans-serif','#e8c040');T('JOIN THE',bx+100,by+42,'bold 15px Arial, Helvetica, sans-serif','#f4f1e6');T('ARMY',bx+100,by+66,'bold 30px Arial, Helvetica, sans-serif','#f4f1e6');
R('rgba(22,17,28,.75)',bx+96,by+bh-28,bw-96,24);T('SIGN UP AT YOUR LOCAL',bx+198,by+bh-21,'bold 10px Arial, Helvetica, sans-serif','#f4f1e6');T('MILITARY BASE',bx+198,by+bh-9,'bold 11px Arial, Helvetica, sans-serif','#e8c040')}
g.restore();g.textAlign='left';g.textBaseline='alphabetic';
// spotlights along the top
for(let i=0;i<4;i++){const lx=bx+40+i*74;R('#16111c',lx-1,by-14,3,12);R('#16111c',lx-6,by-17,12,6);R('#8a909c',lx-5,by-16,10,4);R('#fff4c0',lx-4,by-13,8,1)}}

