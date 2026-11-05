//# world/kit-stadium.js — Building kit pieces from Zombville Stadium: the bowl (the stands all round a field-level floor, solid: rows of seats, aisles, the entry tunnels' portals with their exit lights, the padded wall with its ad boards, tunnels out at field level, a press box), a football field, walk-in tents (canvas walls with doors, a tarp floor; the roof hangs over people and fades while someone is inside; lights on inside if you like), tarps, and string lights hung between poles
// ---------- Zombville Stadium's pieces ----------
// (functions and registries only: nothing here runs during the first map build at boot)
const STK={o:'#16111c',cn:'#5a5e66',cn2:'#52565e',cnl:'#7a7e86',cnd:'#3a3d44',rl:'#b8bcc4',yl:'#e8c020',ex:'#3fd25a'};
// ----- the bowl -----
// The box is the whole stadium; inside it, the field-level floor is a box with round corners (ds px in from the long sides, de px in
// from the ends, corner radius r). Everything round it is the stands (solid): the padded wall, then row after row of seats out to the
// edge, aisles of steps, and in every other section the portal of an entry tunnel with an exit light over it. Tunnels at field level
// (tn ts tw te: their widths, 0 = none) lead out through the stands at the middle of each side. pb: a press box along the top.
const STBW=new WeakMap(),STWT=16,STD0=24,STPR=22;
function stBowl(o){const key=[o.x,o.y,o.w,o.h,JSON.stringify(o.o||{})].join(),c=STBW.get(o);if(c&&c.k===key)return c.L;
 const ds=Math.min(cl(+ao(o,'ds',600)||0,60,1200),o.h/3),de=Math.min(cl(+ao(o,'de',360)||0,60,1200),o.w/3),x0=o.x+de,x1=o.x+o.w-de,y0=o.y+ds,y1=o.y+o.h-ds,
  r=cl(+ao(o,'r',260)||0,20,Math.min(x1-x0,y1-y0)/2),cx=(x0+x1)/2,cy=(y0+y1)/2,T={},TB={};
 for(const s of'nsew'){const v=cl(+ao(o,'t'+s,0)||0,0,400);if(v>=40)T[s]=v}
 if(T.n)TB.n=[cx-T.n/2,o.y,T.n,y0-o.y];if(T.s)TB.s=[cx-T.s/2,y1,T.s,o.y+o.h-y1];if(T.w)TB.w=[o.x,cy-T.w/2,x0-o.x,T.w];if(T.e)TB.e=[x1,cy-T.e/2,o.x+o.w-x1,T.e];
 // aisles: on the long sides about every 300 px, on the ends every 260, both from corner to corner; two in each corner
 const AX=[],AY=[];{const L=x1-x0-2*r,n=Math.max(1,Math.round(L/300));for(let i=0;i<=n;i++)AX.push(x0+r+L*i/n)}{const L=y1-y0-2*r,n=Math.max(1,Math.round(L/260));for(let i=0;i<=n;i++)AY.push(y0+r+L*i/n)}
 // band coordinates: a = along the side, d = out from the floor's edge; -> world
 const W_={n:(a,d)=>[a,y0-d],s:(a,d)=>[a,y1+d],w:(a,d)=>[x0-d,a],e:(a,d)=>[x1+d,a]},dep={n:ds,s:ds,w:de,e:de};
 // entry tunnels (vomitories): in every other section, not where a tunnel runs out; rows 5-9 on the long sides, 4-7 on the ends
 const V=[];for(const s of'nsew'){const A=s=='n'||s=='s'?AX:AY,k0=s=='n'||s=='s'?5:4,k1=k0+(s=='n'||s=='s'?4:3);if(STD0+(k1+3)*STPR>dep[s])continue;
  for(let i=0;i+1<A.length;i++){if(i%2==0)continue;const c_=(A[i]+A[i+1])/2,w=Math.min(68,A[i+1]-A[i]-60);if(w<40)continue;const t=TB[s],tc=s=='n'||s=='s'?cx:cy;if(t&&Math.abs(c_-tc)<(T[s]/2+w/2+30))continue;
   V.push({s,a:c_,w,d0:STD0+k0*STPR,d1:STD0+(k1+1)*STPR,sec:0})}}
 // section numbers: clockwise from the top left
 V.forEach((v,i)=>v.sec=(v.s=='n'||v.s=='s'?100:200)+i+1);
 const L={x0,x1,y0,y1,r,cx,cy,ds,de,T,TB,AX,AY,W:W_,dep,V};STBW.set(o,{k:key,L});return L}
// the floor's outline moved out by d (a box with round corners)
function stRR(g,L,d){const{x0,x1,y0,y1,r}=L,R=r+d;g.moveTo(x0+r,y0-d);g.lineTo(x1-r,y0-d);g.arc(x1-r,y0+r,R,-Math.PI/2,0);g.lineTo(x1+d,y1-r);g.arc(x1-r,y1-r,R,0,Math.PI/2);g.lineTo(x0+r,y1+d);g.arc(x0+r,y1-r,R,Math.PI/2,Math.PI);g.lineTo(x0-d,y0+r);g.arc(x0+r,y0+r,R,Math.PI,Math.PI*1.5);g.closePath()}
// is band point (side s, along a, out d) clear of aisles, portals and tunnels? (m: margin)
function stFree(L,s,a,d,m){const A=s=='n'||s=='s'?L.AX:L.AY;for(const x of A)if(Math.abs(a-x)<13+m)return 0;for(const v of L.V)if(v.s==s&&Math.abs(a-v.a)<v.w/2+4+m&&d>v.d0-6-m&&d<v.d1+4+m)return 0;
 const t=L.T[s];if(t){const c=s=='n'||s=='s'?L.cx:L.cy;if(Math.abs(a-c)<t/2+12+m)return 0}return 1}
// one seat, its front to the field (turned by f)
function stSeat(g,x,y,f,c,cd,cl_){g.save();g.translate(x,y);g.rotate(f);g.fillStyle=STK.cnd;g.fillRect(-9,-6,2,9);g.fillRect(7,-6,2,9);g.fillStyle=cd;g.fillRect(-7,-7,14,5);g.fillStyle=c;g.fillRect(-7,-2,14,7);g.fillStyle=cl_;g.fillRect(-7,-2,14,2);g.restore()}
function arBowl(g,o){const L=stBowl(o),{x0,x1,y0,y1,r,ds,de}=L,K=pcK(cmCol(o.c,'#b83a32')),K2=pcK(cmCol(o.c2,'#1f3a6a')),R=cmR;
 // the floor at field level: artificial turf in long stripes
 g.save();g.beginPath();stRR(g,L,0);g.clip();g.fillStyle='#2c5a2e';g.fillRect(o.x,o.y,o.w,o.h);g.fillStyle='#295428';for(let x=x0;x<x1;x+=96)g.fillRect(x,y0,48,y1-y0);g.restore();
 g.save();g.beginPath();g.rect(o.x,o.y,o.w,o.h);stRR(g,L,0);g.clip('evenodd');
 // concrete, then the rows' treads, back to front
 g.fillStyle=STK.cn;g.fillRect(o.x,o.y,o.w,o.h);const nR=Math.ceil((Math.max(ds,de)+r)/STPR);
 for(let k=nR;k>=0;k--){g.beginPath();stRR(g,L,STD0+k*STPR+STPR/2);g.lineWidth=STPR;g.strokeStyle=k%2?STK.cn:STK.cn2;g.stroke();g.beginPath();stRR(g,L,STD0+k*STPR+1);g.lineWidth=2;g.strokeStyle='rgba(0,0,0,.25)';g.stroke()}
 // aisles: steps with yellow nosing and a handrail down the middle (straight sides, then two in each corner)
 const step=(x,y,a,len)=>{g.save();g.translate(x,y);g.rotate(a);g.fillStyle=STK.cnl;g.fillRect(STD0-4,-12,len,24);for(let d=STD0;d<len;d+=STPR/2){g.fillStyle='rgba(0,0,0,.28)';g.fillRect(d,-12,2,24);g.fillStyle=STK.yl;g.fillRect(d,-12,2,3);g.fillRect(d,9,2,3)}g.fillStyle=STK.rl;g.fillRect(STD0,-1,len-STD0,2);g.restore()};
 for(const a of L.AX){step(a,y0,-Math.PI/2,ds+40);step(a,y1,Math.PI/2,ds+40)}for(const a of L.AY){step(x0,a,Math.PI,de+40);step(x1,a,0,de+40)}
 const CO=[[x1-r,y0+r,-Math.PI/2],[x1-r,y1-r,0],[x0+r,y1-r,Math.PI/2],[x0+r,y0+r,Math.PI]];
 for(const[ccx,ccy,a0]of CO)for(const u of[1/3,2/3]){const a=a0+u*Math.PI/2;step(ccx+Math.cos(a)*r,ccy+Math.sin(a)*r,a,Math.max(ds,de)+r)}
 // seats: the straight sides
 const sc=(i,k)=>{const h=R(o,i*7.1+k,31);return h<.012?null:h<.04?[K.dd,K.x,K.d]:k>13?[K.d,K.dd,K.b]:[K.b,K.d,K.l]};
 for(const s of'nsew'){const n_=s=='n'||s=='s',a0=n_?x0+r:y0+r,a1=n_?x1-r:y1-r,ac=(a0+a1)/2,f={n:0,s:Math.PI,w:-Math.PI/2,e:Math.PI/2}[s];
  for(let k=0;STD0+k*STPR+STPR<=L.dep[s]+STPR;k++){const d=STD0+k*STPR+10;for(let a=ac-Math.floor((ac-a0)/20)*20;a<=a1;a+=20){if(!stFree(L,s,a,d,0))continue;const C=sc(a,k);const[x,y]=L.W[s](a,d);if(!C){g.fillStyle=STK.cnd;g.fillRect(x-2,y-2,4,4);continue}stSeat(g,x,y,f,C[0],C[1],C[2])}}}
 // the corners: arcs of seats facing the middle, clear of the corner aisles
 for(const[ccx,ccy,a0]of CO)for(let k=0;k<nR;k++){const d=STD0+k*STPR+10,Rr=r+d,n=Math.floor(Rr*Math.PI/2/20);for(let i=0;i<n;i++){const u=(i+.5)/n,a=a0+u*Math.PI/2;if(Math.min(Math.abs(u-1/3),Math.abs(u-2/3))*Rr*Math.PI/2<15)continue;
  const x=ccx+Math.cos(a)*Rr,y=ccy+Math.sin(a)*Rr;if(x<o.x+4||x>o.x+o.w-4||y<o.y+4||y>o.y+o.h-4)continue;const C=sc(i+a0*50,k);if(!C)continue;stSeat(g,x,y,a+Math.PI/2,C[0],C[1],C[2])}}
 // entry tunnels: a dark mouth in the rows, low walls round it, a rail across the front, the exit light over the back, the section number
 for(const v of L.V){const ang={n:-Math.PI/2,s:Math.PI/2,w:Math.PI,e:0}[v.s],[x,y]=L.W[v.s](v.a,0);g.save();g.translate(x,y);g.rotate(ang);const w=v.w,d0=v.d0,d1=v.d1;
  g.fillStyle=STK.o;g.fillRect(d0-2,-w/2-7,d1-d0+9,w+14);g.fillStyle=STK.cnl;g.fillRect(d0-1,-w/2-6,d1-d0+7,w+12);for(let i=0;i<6;i++){const c=Math.round(38-i*6.4);g.fillStyle='rgb('+c+','+c+','+(c+6)+')';g.fillRect(d0+(d1-d0)*i/6,-w/2,(d1-d0)/6+1,w)}
  g.fillStyle='rgba(255,255,255,.08)';for(let e=d0+8;e<d1;e+=12)g.fillRect(e,-w/2,1,w);g.fillStyle=STK.rl;g.fillRect(d0-1,-w/2-1,2,w+2);for(let q=-w/2;q<=w/2;q+=w/4)g.fillRect(d0-2,q-1,4,3);
  g.fillStyle=STK.o;g.fillRect(d1+1,-9,7,18);g.fillStyle=STK.ex;g.fillRect(d1+2,-8,5,16);g.restore();
  const[tx,ty]=L.W[v.s](v.a,d1+20);g.save();g.translate(tx,ty);if(v.s=='w'||v.s=='e')g.rotate(v.s=='w'?Math.PI/2:-Math.PI/2);kpText(g,String(v.sec),0,0,30,11,'#e8e8e0',0,'rgba(0,0,0,.6)');g.restore()}
 // the padded wall all round the floor, with ad boards along the straight runs (local businesses) and the stadium's name in the middle
 g.beginPath();stRR(g,L,STWT/2);g.lineWidth=STWT;g.strokeStyle=K2.b;g.stroke();g.beginPath();stRR(g,L,STWT);g.lineWidth=3;g.strokeStyle='#9aa0a8';g.stroke();g.beginPath();stRR(g,L,1.5);g.lineWidth=3;g.strokeStyle=K2.dd;g.stroke();
 const AD=[['HOMETOWN MARKET','#2f8a4a'],['ZOMBVILLE GENERAL','#2a4a9a'],['BLACK IRON FOUNDRY','#3a3d46'],['GAS & GO','#c0392b'],['TACO LOCO','#e07a1a'],['CITY PARK','#3f8a42'],['DEADWAY MOTORS','#5a3a8a']],nm=(cmTxt(o.tx,24)||'').toUpperCase();
 for(const s of'nsew'){const n_=s=='n'||s=='s',a0=n_?x0+r:y0+r,a1=n_?x1-r:y1-r,ac=(a0+a1)/2,pw=n_?220:180,n=Math.floor((a1-a0)/(pw+20));for(let i=0;i<n;i++){const a=ac+(i-(n-1)/2)*(pw+20);if(L.T[s]&&Math.abs(a-ac)<L.T[s]/2+pw/2+4)continue;
  const mid=nm&&n_&&Math.abs(a-ac)<(pw+20)/2,t=mid?nm:AD[(i+(s=='s'?3:s=='w'?5:s=='e'?1:0))%AD.length][0],c=mid?K.b:AD[(i+(s=='s'?3:s=='w'?5:s=='e'?1:0))%AD.length][1],[x,y]=L.W[s](a,STWT/2);
  g.save();g.translate(x,y);if(!n_)g.rotate(s=='w'?-Math.PI/2:Math.PI/2);g.fillStyle=STK.o;g.fillRect(-pw/2-1,-7,pw+2,14);g.fillStyle=c;g.fillRect(-pw/2,-6,pw,12);kpText(g,t,0,.5,pw-12,10,'#f4f4f0');g.restore()}}
 // tunnels out at field level: the stands cut away over a ramp into the dark, concrete walls, beams overhead every few metres
 for(const s of Object.keys(L.TB)){const[tx,ty,tw,th]=L.TB[s],n_=s=='n'||s=='s',out=s=='n'?[0,-1]:s=='s'?[0,1]:s=='w'?[-1,0]:[1,0];
  // the floor darkens step by step into the tunnel
  const len0=n_?th:tw,N=16;for(let i=0;i<N;i++){const k=i/N,c=Math.round(k<.55?74-k/.55*46:28-(k-.55)/.45*23);g.fillStyle='rgb('+c+','+(c+2)+','+(c+6)+')';const a=len0*i/N,b=len0/N+1;
   if(s=='n')g.fillRect(tx,ty+th-a-b,tw,b);else if(s=='s')g.fillRect(tx,ty+a,tw,b);else if(s=='w')g.fillRect(tx+tw-a-b,ty,b,th);else g.fillRect(tx+a,ty,b,th)}g.fillStyle='rgba(255,255,255,.05)';if(n_)for(let x=tx+tw/2-2;x<tx+tw/2+2;x++)g.fillRect(x,ty,1,th);else g.fillRect(tx,ty+th/2-1,tw,2);
  g.fillStyle=STK.o;if(n_){g.fillRect(tx-11,ty,12,th);g.fillRect(tx+tw-1,ty,12,th)}else{g.fillRect(tx,ty-11,tw,12);g.fillRect(tx,ty+th-1,tw,12)}g.fillStyle=STK.cnl;if(n_){g.fillRect(tx-10,ty,10,th);g.fillRect(tx+tw,ty,10,th)}else{g.fillRect(tx,ty-10,tw,10);g.fillRect(tx,ty+th,tw,10)}
  const len=n_?th:tw;for(let e=40;e<len-10;e+=70){const k=e/len;g.fillStyle='rgba(22,17,28,'+(.75+.25*k).toFixed(2)+')';if(n_)g.fillRect(tx,s=='n'?ty+th-e:ty+e,tw,10);else g.fillRect(s=='w'?tx+tw-e:tx+e,ty,10,th);
   g.fillStyle='rgba(122,126,134,'+(.5*(1-k)).toFixed(2)+')';if(n_)g.fillRect(tx,s=='n'?ty+th-e:ty+e,tw,2);else g.fillRect(s=='w'?tx+tw-e:tx+e,ty,2,th)}}
 // the press box: a long band of dark glass along the top edge, a few panes broken, the upper deck's lip under it
 if(ao(o,'pb',0)){const h=74,pw=Math.min(o.w*.6,1600),px=L.cx-pw/2,py=o.y;g.fillStyle=STK.o;g.fillRect(px-2,py,pw+4,h+2);g.fillStyle='#7a7e86';g.fillRect(px,py,pw,h);g.fillStyle='#9aa0a8';g.fillRect(px,py+h-8,pw,6);
  for(let x=px+8,i=0;x<px+pw-40;x+=44,i++){g.fillStyle=STK.o;g.fillRect(x,py+18,40,40);const br=R(o,i,33)<.18;g.fillStyle=br?'#0a0a0c':'#1c2a36';g.fillRect(x+1,py+19,38,38);g.fillStyle=br?'#5a6a78':'rgba(160,200,230,.25)';if(br){g.beginPath();g.moveTo(x+4,py+20);g.lineTo(x+14,py+34);g.lineTo(x+8,py+52);g.lineTo(x+1,py+56);g.closePath();g.fill()}else g.fillRect(x+3,py+21,6,30)}
  kpText(g,'PRESS',px+pw/2,py+9,200,9,'#e8e8e0')}
 g.restore()}
// what is solid: the stands, as boxes: the four bands round the floor, less the tunnels, and the round corners in thin rows
function arBowlColl(o,out){const L=stBowl(o),{x0,x1,y0,y1,r,TB}=L,fl=cmAFl(o),cut=(b,t,h)=>{if(!t){out.push([...b,fl]);return}if(h){out.push([b[0],b[1],t[0]-b[0],b[3],fl]);out.push([t[0]+t[2],b[1],b[0]+b[2]-t[0]-t[2],b[3],fl])}else{out.push([b[0],b[1],b[2],t[1]-b[1],fl]);out.push([b[0],t[1]+t[3],b[2],b[1]+b[3]-t[1]-t[3],fl])}};
 cut([o.x,o.y,o.w,y0-o.y],TB.n,1);cut([o.x,y1,o.w,o.y+o.h-y1],TB.s,1);cut([o.x,y0,x0-o.x,y1-y0],TB.w,0);cut([x1,y0,o.x+o.w-x1,y1-y0],TB.e,0);
 const H=8;for(let j=0;j<r;j+=H){const yc=j+H/2,dx=r-Math.sqrt(Math.max(0,r*r-(r-yc)*(r-yc)));if(dx<1)continue;out.push([x0,y0+j,dx,H,fl]);out.push([x1-dx,y0+j,dx,H,fl]);out.push([x0,y1-j-H,dx,H,fl]);out.push([x1-dx,y1-j-H,dx,H,fl])}}
// the exit lights over the entry tunnels
function arBowlLts(o,L_){const L=stBowl(o);for(const v of L.V){const[x,y]=L.W[v.s](v.a,v.d1+4);L_.push({x,y,r:46,c:STK.ex,i:.75})}}
// ----- the football field -----
// The box is the field with its 2-yard white border: 124 × 57⅓ yards. Turf in 5-yard stripes, coloured end zones with your text
// (west|east), the lines, hash marks, the yard numbers with their arrows, and the logo at midfield.
function arGrid(g,o){const u=o.w/124,v=o.h/(172/3),fx=o.x+2*u,fy=o.y+2*v,FW=120*u,FH=160/3*v,K=pcK(cmCol(o.c,'#b83a32')),K2=pcK(cmCol(o.c2,'#1f3a6a')),lw=Math.max(2,Math.round(u*.17)),W_='#eef0ea';
 g.fillStyle=W_;g.fillRect(o.x,o.y,o.w,o.h);for(let i=0;i<20;i++){g.fillStyle=i%2?'#2e6e30':'#337834';g.fillRect(fx+10*u+i*5*u,fy,5*u+.5,FH)}
 const ez=ao(o,'ez',1);for(const x of[fx,fx+110*u]){g.fillStyle=ez?K.d:'#337834';g.fillRect(x,fy,10*u,FH);if(ez){g.save();g.beginPath();g.rect(x,fy,10*u,FH);g.clip();g.strokeStyle=K.b;g.lineWidth=u*.9;for(let k=-12;k<FH/u+12;k+=3){g.beginPath();g.moveTo(x-2*u,fy+k*u);g.lineTo(x+12*u,fy+(k+8)*u);g.stroke()}g.restore()}}
 // the end zones' words
 const T=(cmTxt(o.tx,30)||'ZOMBVILLE|ZOMBVILLE').toUpperCase().split('|');T.forEach((t,i)=>{if(!t)return;g.save();g.translate(fx+(i?115:5)*u,fy+FH/2);g.rotate(i?Math.PI/2:-Math.PI/2);const s=kpFit(g,t,FH*.82,Math.round(6*u),'Impact, "Arial Black", Arial, sans-serif');
  g.textAlign='center';g.textBaseline='middle';g.lineWidth=Math.max(2,u*.35);g.strokeStyle=ez?W_:K.dd;g.strokeText(t,0,0);g.fillStyle=ez?K.dd:K.b;g.fillText(t,0,0);g.restore()});
 // lines: sidelines, end lines, goal lines, every 5 yards; hash marks every yard by the sidelines and on the two hash rows
 g.fillStyle=W_;g.fillRect(fx,fy,FW,lw);g.fillRect(fx,fy+FH-lw,FW,lw);g.fillRect(fx,fy,lw,FH);g.fillRect(fx+FW-lw,fy,lw,FH);
 for(let k=0;k<=20;k++){const x=fx+10*u+k*5*u,w=k%20==0?lw*2:lw;g.fillRect(x-w/2,fy,w,FH)}
 const hy=[fy+23.58*v,fy+FH-23.58*v];for(let yd=11;yd<110;yd++){if(yd%5==0)continue;const x=fx+yd*u;g.fillRect(x-lw/2,fy+.3*v,lw,.67*v);g.fillRect(x-lw/2,fy+FH-.97*v,lw,.67*v);for(const y of hy)g.fillRect(x-lw/2,y-.33*v,lw,.67*v)}
 for(const x of[fx+12*u,fx+108*u])g.fillRect(x-lw/2,fy+FH/2-.5*v,lw,v);
 // the numbers (the near side reads up the screen, the far side upside down) and the arrows to the nearer goal
 if(ao(o,'num',1)){const fs=Math.round(2*v);for(let k=1;k<=9;k++){const yd=k*10,lab=String(k<=5?yd:100-yd),X_=fx+(10+yd)*u;
  for(const top of[0,1]){g.save();g.translate(X_,top?fy+10*v:fy+FH-10*v);if(top)g.rotate(Math.PI);g.font='bold '+fs+'px "Arial Black", Arial, sans-serif';g.textAlign='center';g.textBaseline='middle';g.fillStyle=W_;
   g.fillText(lab[0],-1.15*u,0);g.fillText(lab[1],1.15*u,0);if(k!=5){const dir=(k<5)!=!!top?-1:1,ax=dir*2.6*u;g.beginPath();g.moveTo(ax+dir*.7*u,-.55*v);g.lineTo(ax,-.85*v);g.lineTo(ax,-.25*v);g.closePath();g.fill()}g.restore()}}}
 // the logo at midfield
 if(ao(o,'logo',1)){const cx=fx+FW/2,cy=fy+FH/2,R=5.5*v;g.fillStyle=W_;g.beginPath();g.arc(cx,cy,R,0,7);g.fill();g.fillStyle=K2.b;g.beginPath();g.arc(cx,cy,R*.88,0,7);g.fill();g.fillStyle=K.b;g.beginPath();g.arc(cx,cy,R*.7,0,7);g.fill();
  g.save();g.translate(cx,cy);g.font='bold '+Math.round(R*1.1)+'px Impact, "Arial Black", Arial, sans-serif';g.textAlign='center';g.textBaseline='middle';g.lineWidth=Math.max(2,u*.4);g.strokeStyle=K2.dd;g.strokeText('Z',0,R*.04);g.fillStyle=W_;g.fillText('Z',0,R*.04);g.restore()}}
// ----- walk-in tents -----
// The box takes in the guy ropes (10 px round the tent). Canvas walls (block walking; bullets go through), doors on the sides you pick,
// a tarp floor. In the game the roof is drawn over people: while a player is inside it fades almost away, while one is close to it
// half way, and while a zombie is inside it fades a little (so nobody hides in it). lt: the lights inside (on, off, flickering).
const STTN=new WeakMap(),STTM=10;
function stTent(o){const b={x:o.x+STTM,y:o.y+STTM,w:Math.max(20,o.w-STTM*2),h:Math.max(20,o.h-STTM*2)},dw=cl(+ao(o,'dw',60)||60,30,140)/2,ds=String(ao(o,'d',o.w>=o.h?'ew':'ns')),S=ds=='all'?'nsew':ds=='none'?'':ds,D=[];
 for(const s of S)if('nsew'.includes(s))D.push([s,(s=='n'||s=='s'?b.x+b.w/2:b.y+b.h/2),Math.min(dw,(s=='n'||s=='s'?b.w:b.h)/2-8)]);return{b,D}}
function arTent(g,o){const{b,D}=stTent(o),K=pcK(cmCol(o.c,'#e8e6de')),fc=cmCol(o.c2,'#4a5248');
 // guy ropes and stakes
 g.strokeStyle='rgba(200,196,184,.8)';g.lineWidth=1;const rope=(x,y,ex,ey)=>{g.beginPath();g.moveTo(x,y);g.lineTo(ex,ey);g.stroke();g.fillStyle=STK.o;g.fillRect(ex-1.5,ey-1.5,3,3)};
 for(let x=b.x+24;x<b.x+b.w-12;x+=56){rope(x,b.y,x,o.y+2);rope(x,b.y+b.h,x,o.y+o.h-2)}for(let y=b.y+24;y<b.y+b.h-12;y+=56){rope(b.x,y,o.x+2,y);rope(b.x+b.w,y,o.x+o.w-2,y)}
 // the floor and its seams
 g.fillStyle=STK.o;g.fillRect(b.x-1,b.y-1,b.w+2,b.h+2);g.fillStyle=fc;g.fillRect(b.x,b.y,b.w,b.h);g.fillStyle='rgba(0,0,0,.12)';for(let x=b.x+64;x<b.x+b.w;x+=64)g.fillRect(x,b.y,1,b.h);for(let y=b.y+64;y<b.y+b.h;y+=64)g.fillRect(b.x,y,b.w,1);
 // the walls: canvas with a darker skirt, poles every 48 px, doors with their flaps rolled up beside them
 const wall=(s)=>{const hz=s=='n'||s=='s',a0=hz?b.x:b.y,a1=hz?b.x+b.w:b.y+b.h,p=s=='n'?b.y:s=='s'?b.y+b.h-6:s=='w'?b.x:b.x+b.w-6,G=D.filter(d=>d[0]==s).map(d=>[d[1]-d[2],d[1]+d[2]]);let a=a0;
  const seg=(u,v)=>{if(v-u<1)return;g.fillStyle=STK.o;hz?g.fillRect(u,p-1,v-u,8):g.fillRect(p-1,u,8,v-u);g.fillStyle=K.d;hz?g.fillRect(u,p,v-u,6):g.fillRect(p,u,6,v-u);g.fillStyle=K.b;hz?g.fillRect(u,p+(s=='n'?0:3),v-u,3):g.fillRect(p+(s=='w'?0:3),u,3,v-u);
   g.fillStyle=STK.cnd;for(let q=u+((48-(u-a0)%48)%48);q<v;q+=48)hz?g.fillRect(q-1,p,3,6):g.fillRect(p,q-1,6,3)};
  for(const[u,v]of G.sort((x,y)=>x[0]-y[0])){seg(a,u);for(const e of[u-5,v+1]){g.fillStyle=STK.o;hz?g.fillRect(e-1,p-3,6,12):g.fillRect(p-3,e-1,12,6);g.fillStyle=K.l;hz?g.fillRect(e,p-2,4,10):g.fillRect(p-2,e,10,4)}a=v}seg(a,a1)};for(const s of'nsew')wall(s)}
function arTentColl(o,out){const{b,D}=stTent(o),fl=cmAFl(o);for(const s of'nsew'){const hz=s=='n'||s=='s',a0=hz?b.x:b.y,a1=hz?b.x+b.w:b.y+b.h,p=s=='n'?b.y:s=='s'?b.y+b.h-6:s=='w'?b.x:b.x+b.w-6;let a=a0;
 const G=D.filter(d=>d[0]==s).map(d=>[d[1]-d[2],d[1]+d[2]]).sort((x,y)=>x[0]-y[0]);for(const[u,v]of G){if(u>a)out.push(hz?[a,p,u-a,6,fl]:[p,a,6,u-a,fl]);a=v}if(a1>a)out.push(hz?[a,p,a1-a,6,fl]:[p,a,6,a1-a,fl])}}
// the roof, drawn once into its own picture: canvas with a ridge down the long way, seams, vents, a red cross if you like, your text
function stRoof(o){const c=STTN.get(o),key=[o.w,o.h,o.c,o.tx,JSON.stringify(o.o||{})].join();if(c&&c.k===key)return c;const{b}=stTent(o),w=b.w+8,h=b.h+8,cv=document.createElement('canvas');cv.width=w;cv.height=h;const q=cv.getContext('2d'),K=pcK(cmCol(o.c,'#e8e6de')),hz=b.w>=b.h;
 q.fillStyle=STK.o;q.fillRect(0,0,w,h);q.fillStyle=K.d;q.fillRect(1,1,w-2,h-2);if(hz){q.fillStyle=K.l;q.fillRect(3,3,w-6,h/2-3);q.fillStyle=K.b;q.fillRect(3,h/2,w-6,h/2-3)}else{q.fillStyle=K.l;q.fillRect(3,3,w/2-3,h-6);q.fillStyle=K.b;q.fillRect(w/2,3,w/2-3,h-6)}
 q.fillStyle='rgba(0,0,0,.1)';if(hz)for(let x=44;x<w-6;x+=44)q.fillRect(x,3,2,h-6);else for(let y=44;y<h-6;y+=44)q.fillRect(3,y,w-6,2);
 q.fillStyle=K.ll;hz?q.fillRect(3,h/2-2,w-6,3):q.fillRect(w/2-2,3,3,h-6);q.fillStyle=K.dd;for(let k=1;k<4;k++){const u=k/4;hz?q.fillRect(w*u-6,h/2-4,12,7):q.fillRect(w/2-4,h*u-6,7,12)}
 const cross=(x,y,s)=>{q.fillStyle=STK.o;q.fillRect(x-s/2-1,y-s/2-1,s+2,s+2);q.fillStyle='#f4f4f0';q.fillRect(x-s/2,y-s/2,s,s);q.fillStyle='#c8281e';const t=s*.28;q.fillRect(x-t/2,y-s*.38,t,s*.76);q.fillRect(x-s*.38,y-t/2,s*.76,t)};
 if(ao(o,'cross',1)){const s=Math.min(30,(hz?h:w)*.36);if(hz){cross(w/2,h*.27,s);if(w>260){cross(w*.18,h*.27,s*.8);cross(w*.82,h*.27,s*.8)}}else{cross(w*.27,h/2,s);if(h>260){cross(w*.27,h*.18,s*.8);cross(w*.27,h*.82,s*.8)}}}
 const t=(cmTxt(o.tx,16)||'').toUpperCase();if(t){q.save();q.translate(hz?w/2:w*.74,hz?h*.74:h/2);if(!hz)q.rotate(Math.PI/2);kpText(q,t,0,0,Math.min(hz?w:h,240)*.8,Math.min(16,(hz?h:w)*.2),'#26262c');q.restore()}
 if(ao(o,'rip',0)){q.globalCompositeOperation='destination-out';for(let i=0;i<4;i++){const x=w*(.15+.7*cmR(o,i,34)),y=h*(.15+.7*cmR(o,i,35)),rx=8+cmR(o,i,36)*18,ry=5+cmR(o,i,37)*10;q.beginPath();q.ellipse(x,y,rx,ry,cmR(o,i,38)*3,0,7);q.fill()}q.globalCompositeOperation='source-over';
  q.strokeStyle=K.dd;q.lineWidth=1.5;for(let i=0;i<4;i++){const x=w*(.15+.7*cmR(o,i,34)),y=h*(.15+.7*cmR(o,i,35)),rx=8+cmR(o,i,36)*18,ry=5+cmR(o,i,37)*10;q.beginPath();q.ellipse(x,y,rx+1,ry+1,cmR(o,i,38)*3,0,7);q.stroke()}}
 const e={k:key,cv,al:1,t:0};STTN.set(o,e);return e}
function arTentTop(o,t){const{b}=stTent(o),e=stRoof(o),dt=Math.min(.1,Math.max(0,t-(e.t||t)));e.t=t;let to=1;const inB=(x,y,m)=>x>b.x-m&&x<b.x+b.w+m&&y>b.y-m&&y<b.y+b.h+m;
 const pl=typeof PL!='undefined'&&PL.length?PL:typeof P!='undefined'&&P?[P]:[];for(const p of pl){if(!p||(typeof alive=='function'&&!alive(p)))continue;if(inB(p.x,p.y,2)){to=.12;break}if(inB(p.x,p.y,44))to=Math.min(to,.55)}
 if(to==1&&typeof zs!='undefined')for(const z of zs)if(z.hp>0&&inB(z.x,z.y,0)){to=.5;break}e.al+=(to-e.al)*Math.min(1,dt*7);X.globalAlpha=e.al;X.drawImage(e.cv,Math.round(b.x-4),Math.round(b.y-4));X.globalAlpha=1}
function arTentLts(o,L){const v=String(ao(o,'lt','on'));if(v=='off')return;const{b}=stTent(o),s={rect:[b.x,b.y,b.w,b.h],x:b.x+b.w/2,y:b.y+b.h/2,r:Math.hypot(b.w,b.h)/2+24,c:'#ffe6b8',i:.48,ph:cmR(o,0,39)*6.283};if(v=='flk')s.f='fault';L.push(s)}
// ----- tarps -----
function arTarp(g,o){const{x,y,w,h}=o,K=pcK(cmCol(o.c,'#c0392b'));g.fillStyle='rgba(0,0,0,.25)';g.fillRect(x+2,y+3,w,h);g.fillStyle=STK.o;g.fillRect(x-1,y-1,w+2,h+2);g.fillStyle=K.b;g.fillRect(x,y,w,h);
 g.save();g.beginPath();g.rect(x,y,w,h);g.clip();g.strokeStyle=K.d;g.lineWidth=2;for(let i=0;i<5;i++){const a=x+cmR(o,i,40)*w,c=y+cmR(o,i,41)*h,L=30+cmR(o,i,42)*60,an=cmR(o,i,43)*3;g.beginPath();g.moveTo(a-Math.cos(an)*L,c-Math.sin(an)*L);g.lineTo(a+Math.cos(an)*L,c+Math.sin(an)*L);g.stroke()}
 g.strokeStyle=K.l;g.lineWidth=1;for(let i=0;i<5;i++){const a=x+cmR(o,i,40)*w+2,c=y+cmR(o,i,41)*h+2,L=30+cmR(o,i,42)*60,an=cmR(o,i,43)*3;g.beginPath();g.moveTo(a-Math.cos(an)*L,c-Math.sin(an)*L);g.lineTo(a+Math.cos(an)*L,c+Math.sin(an)*L);g.stroke()}g.restore();
 g.fillStyle=K.d;g.fillRect(x,y,w,3);g.fillRect(x,y+h-3,w,3);g.fillRect(x,y,3,h);g.fillRect(x+w-3,y,3,h);g.fillStyle='#c8ccd4';for(let a=x+6;a<x+w-4;a+=32){g.fillRect(a,y+1,2,2);g.fillRect(a,y+h-3,2,2)}for(let c=y+6;c<y+h-4;c+=32){g.fillRect(x+1,c,2,2);g.fillRect(x+w-3,c,2,2)}
 const t=(cmTxt(o.tx,16)||'').toUpperCase();if(t&&w>=40){const bh=Math.min(18,h*.3);g.fillStyle=STK.o;g.fillRect(x+w*.1-1,y+5,w*.8+2,bh+2);g.fillStyle='#f4f4f0';g.fillRect(x+w*.1,y+6,w*.8,bh);kpText(g,t,x+w/2,y+6+bh/2,w*.76,Math.round(bh*.7),'#16111c')}}
cmAddArea({id:'bowl',n:'Stadium stands (all round a field)',cat:'ground',fl:1,pal:[['#b83a32','Red'],['#2f4a8a','Navy'],['#2f8a4a','Green'],['#e0b030','Gold'],['#6a3a8a','Purple'],['#d8d8d4','Grey']],pal2:[['#1f3a6a','Navy'],['#16161a','Black'],['#7a1a1a','Maroon'],['#2a4a2a','Dark green']],txt:24,
 def:{c:'#b83a32',c2:'#1f3a6a',o:{ds:600,de:360,r:260,tn:0,ts:0,tw:0,te:0,pb:0}},opts:[['ds','Stands along the long sides (depth)',[60,1200]],['de','Stands at the ends (depth)',[60,1200]],['r','Corner roundness',[20,600]],['tn','Tunnel at the top (width, 0 = none)',[0,400]],['ts','Tunnel at the bottom (width)',[0,400]],['tw','Tunnel at the left end (width)',[0,400]],['te','Tunnel at the right end (width)',[0,400]],['pb','Press box along the top','chk']],
 min:[400,300],pri:-70,f:arBowl,coll(o,out){if(cmSolid(o,'a'))arBowlColl(o,out)},lts:arBowlLts});
cmAddArea({id:'gridiron',n:'Football field',cat:'ground',fl:null,pal:[['#b83a32','Red'],['#2f4a8a','Navy'],['#2f8a4a','Green'],['#e0b030','Gold'],['#6a3a8a','Purple'],['#e07a1a','Orange']],pal2:[['#1f3a6a','Navy'],['#16161a','Black'],['#7a1a1a','Maroon'],['#e0b030','Gold']],txt:30,
 def:{c:'#b83a32',c2:'#1f3a6a',o:{ez:1,num:1,logo:1}},opts:[['ez','Coloured end zones','chk'],['num','Yard numbers','chk'],['logo','Logo at midfield','chk']],min:[248,115],pri:-60,f:arGrid});
cmAddArea({id:'tent',n:'Walk-in tent (roof over people)',cat:'build',fl:2,pal:[['#e8e6de','White'],['#6a7448','Olive'],['#c8b890','Tan'],['#3a6ab0','Blue'],['#9aa0a8','Grey']],pal2:[['#4a5248','Green tarp'],['#3a4a6a','Blue tarp'],['#5a5a5a','Grey tarp'],['#6a5a42','Brown tarp']],txt:16,
 def:{c:'#e8e6de',c2:'#4a5248',o:{d:'ew',dw:60,lt:'on',cross:1,rip:0}},opts:[['d','Doors',[['ew','Both ends (left, right)'],['ns','Top and bottom'],['w','Left end'],['e','Right end'],['n','Top'],['s','Bottom'],['all','All four sides'],['none','None']]],['dw','Door width',[30,140]],['lt','Lights inside',[['on','On'],['flk','Flickering'],['off','Off']]],['cross','Red cross on the roof','chk'],['rip','Torn roof','chk']],
 min:[80,80],pri:-30,f:arTent,coll(o,out){if(cmSolid(o,'a'))arTentColl(o,out)},top:arTentTop,lts:arTentLts});
cmAddArea({id:'tarp',n:'Tarp (triage colours)',cat:'ground',fl:null,pal:[['#c0392b','Red'],['#e0b020','Yellow'],['#3a8a3a','Green'],['#26262c','Black'],['#2f6fd0','Blue'],['#8a8f96','Grey'],['#e07a1a','Orange']],txt:16,def:{c:'#c0392b'},min:[24,24],pri:-40,f:arTarp});
// ----- string lights -----
// Bulbs on a wire hung between poles (the points are the poles' feet): drawn over people in the game, like the bunting; each stretch
// lights the ground under it. h: how high; flk: some bulbs flicker on a weak generator; poles: draw the poles.
function stBulbs(g,P,o){const h=po(o,'h',46),c=cmCol(o.c,'#ffd88a');g.strokeStyle='#2a2a2e';g.lineWidth=1;for(let i=1;i<P.length;i++){const a=[P[i-1][0],P[i-1][1]-h],b=[P[i][0],P[i][1]-h],s=kmSpan(a,b);kmSag(g,a,b,s);
 const L=Math.hypot(b[0]-a[0],b[1]-a[1]),n=Math.max(2,Math.floor(L/18));for(let k=1;k<n;k++){const u=k/n,x=a[0]+(b[0]-a[0])*u,y=a[1]+(b[1]-a[1])*u+s*4*u*(1-u),dead=cmH(x,y,44)<.12;
  g.fillStyle=STK.o;g.fillRect(Math.round(x)-2,Math.round(y),4,5);g.fillStyle=dead?'#4a4a44':c;g.fillRect(Math.round(x)-1,Math.round(y)+1,2,3);if(!dead){g.fillStyle='rgba(255,220,150,.28)';g.fillRect(Math.round(x)-3,Math.round(y)-1,6,7)}}}}
function stBulbPoles(g,P,o){if(!po(o,'poles',1))return;const h=po(o,'h',46);for(const p of P){g.fillStyle=STK.o;g.fillRect(p[0]-2,p[1]-h-2,4,h+3);g.fillStyle='#6a6e78';g.fillRect(p[0]-1,p[1]-h-1,2,h+1)}}
cmAddPath({id:'bulbs',sharp:1,n:'String lights (between poles)',cat:'line',w:2,wr:[1,4],pal:[['#ffd88a','Warm'],['#f4f4ff','Cool white'],['#ffb0a0','Red'],['#a8e8ff','Blue']],def:{c:'#ffd88a',o:{h:46,flk:0,poles:1}},opts:[['h','Height',[20,140]],['flk','Flickering (weak generator)','chk'],['poles','Poles','chk']],pri:30,
 f(g,P,o){kmShadow(g,P);stBulbPoles(g,P,o);if(!CMGP)stBulbs(g,P,o)},top:stBulbs,
 lts(o,L){const P=cmPathSm(o),c=cmCol(o.c,'#ffd88a'),f=po(o,'flk',0);let i=0;cmAlong(P,64,(x,y)=>{const s={x,y,r:60,c,i:.62,ph:cmR(o,i++,45)*6.283};if(f&&i%2)s.f='fault';L.push(s)},32)}});
// ----- decals: what the camp left on the ground -----
cmAddDec({id:'sleepbag',n:'Sleeping bag',cat:'misc',w:30,h:64,pal:[['#2f4a8a','Blue'],['#8a2a2a','Red'],['#3a6a3a','Green'],['#5a3a6a','Purple'],['#c8781e','Orange']],f(g,v,K){g.fillStyle='rgba(0,0,0,.25)';g.fillRect(-12,-28,26,60);g.fillStyle=STK.o;g.fillRect(-13,-31,26,62);g.fillStyle=K.b;g.fillRect(-12,-30,24,60);g.fillStyle=K.l;g.fillRect(-12,-30,24,12);
 g.fillStyle=K.d;for(let y=-14;y<30;y+=9)g.fillRect(-12,y,24,1);g.fillStyle='#c8ccd4';g.fillRect(9,-18,1,46);if(v>.5){g.fillStyle=K.dd;g.beginPath();g.moveTo(-12,-18);g.lineTo(12,-18);g.lineTo(12,4);g.closePath();g.fill();g.fillStyle='#d8d0c0';g.fillRect(-10,-16,8,10)}}});
cmAddDec({id:'blanket',n:'Blanket (dropped)',cat:'misc',w:50,h:40,pal:[['#5a6a7a','Grey'],['#7a4a3a','Brown'],['#4a5a3a','Army green'],['#2f4a8a','Blue'],['#8a2a2a','Red']],f(g,v,K){const P=[];for(let i=0;i<9;i++){const a=i/9*6.283,r=1-.25*dcH(v,i,51);P.push([Math.cos(a)*22*r,Math.sin(a)*16*r])}
 g.fillStyle=STK.o;g.beginPath();P.forEach((p,i)=>i?g.lineTo(p[0]*1.06,p[1]*1.08):g.moveTo(p[0]*1.06,p[1]*1.08));g.closePath();g.fill();g.fillStyle=K.b;g.beginPath();P.forEach((p,i)=>i?g.lineTo(p[0],p[1]):g.moveTo(p[0],p[1]));g.closePath();g.fill();
 g.strokeStyle=K.d;g.lineWidth=2;for(let i=0;i<3;i++){g.beginPath();g.moveTo(-16+dcH(v,i,52)*8,-10+i*8);g.quadraticCurveTo(0,-14+i*9,14-dcH(v,i,53)*6,-6+i*8);g.stroke()}g.strokeStyle=K.l;g.lineWidth=1;g.beginPath();g.moveTo(-14,-4);g.quadraticCurveTo(0,-9,12,-2);g.stroke()}});
cmAddDec({id:'medlitter',n:'Medical litter (gloves, masks, gauze)',cat:'misc',w:60,h:40,f(g,v){for(let i=0;i<9;i++){const x=-26+dcH(v,i,54)*52,y=-16+dcH(v,i,55)*32,k=Math.floor(dcH(v,i,56)*5);g.save();g.translate(x,y);g.rotate(dcH(v,i,57)*6.283);
 if(k==0){g.fillStyle='#4a7ac8';g.fillRect(-4,-2,6,4);g.fillRect(2,-3,2,1);g.fillRect(2,-1,3,1);g.fillRect(2,1,2,1)}else if(k==1){g.fillStyle='#e8eef4';g.fillRect(-4,-2,8,5);g.fillStyle='#9ab8d8';g.fillRect(-4,-1,8,1)}
 else if(k==2){g.fillStyle='#f4f4f0';g.fillRect(-6,-1,12,2);g.fillStyle='rgba(160,30,30,.6)';g.fillRect(-2,-1,3,2)}else if(k==3){g.fillStyle='#e8781e';g.fillRect(-2,-3,4,6);g.fillStyle='#f4f4f0';g.fillRect(-2,-4,4,2)}else{g.fillStyle='#f4f4f0';g.fillRect(-1,-1,2,2);g.fillRect(2,1,2,2)}g.restore()}}});
cmAddDec({id:'chains',n:'Down markers and chain',cat:'misc',w:240,h:30,f(g){g.strokeStyle='#c8ccd4';g.lineWidth=1;g.setLineDash&&g.setLineDash([2,2]);g.beginPath();g.moveTo(-104,4);g.quadraticCurveTo(0,10,104,2);g.stroke();g.setLineDash&&g.setLineDash([]);
 for(const[x,a]of[[-110,.06],[110,-.05]]){g.save();g.translate(x,0);g.rotate(a);g.fillStyle=STK.o;g.fillRect(-36,-3,72,6);g.fillStyle='#e8641e';g.fillRect(-35,-2,70,4);g.fillStyle='#f4f4f0';g.fillRect(28,-4,8,8);g.restore()}
 g.save();g.translate(-20,-10);g.rotate(.1);g.fillStyle=STK.o;g.fillRect(-30,-2,60,4);g.fillStyle='#e8641e';g.fillRect(-29,-1,58,2);g.fillStyle=STK.o;g.fillRect(24,-7,16,14);g.fillStyle='#f4f4f0';g.fillRect(25,-6,14,12);g.fillStyle=STK.o;g.font='bold 9px Arial';g.fillText('3',29,4);g.restore()}});
cmAddDec({id:'toy',n:'Teddy bear (dropped)',cat:'misc',w:24,h:24,f(g){g.fillStyle=STK.o;g.beginPath();g.arc(0,-5,7,0,7);g.arc(0,5,8,0,7);g.arc(-6,-11,3.5,0,7);g.arc(6,-11,3.5,0,7);g.fill();g.fillStyle='#a8784a';g.beginPath();g.arc(0,-5,6,0,7);g.arc(0,5,7,0,7);g.fill();
 g.beginPath();g.arc(-6,-11,2.5,0,7);g.arc(6,-11,2.5,0,7);g.arc(-8,4,3,0,7);g.arc(8,4,3,0,7);g.fill();g.fillStyle='#d8b07a';g.beginPath();g.arc(0,-3,2.5,0,7);g.arc(0,6,3.5,0,7);g.fill();g.fillStyle=STK.o;g.fillRect(-3,-7,1,1);g.fillRect(2,-7,1,1);g.fillRect(-1,-4,2,1)}});
