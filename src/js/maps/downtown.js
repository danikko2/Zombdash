//# maps/downtown.js — Downtown Zombville map
// ---------- Downtown Zombville: skyscrapers with lobbies, restaurants, stores, apartment blocks and the football stadium ----------
function dtH(i,k){const v=Math.sin(i*12.9898+k*78.233+8.7)*43758.5453;return v-Math.floor(v)}
function dtSub(A,R){const o=[];if(R[1]>A[1])o.push([A[0],A[1],A[2],R[1]]);if(R[3]<A[3])o.push([A[0],R[3],A[2],A[3]]);if(R[0]>A[0])o.push([A[0],R[1],R[0],R[3]]);if(R[2]<A[2])o.push([R[2],R[1],A[2],R[3]]);return o.filter(r=>r[2]-r[0]>2&&r[3]-r[1]>2)}
// box walls around r with door gaps on the front (and a back door if bk)
function dtBox(r,fr,dg,bk){const[x0,y0,x1,y1]=r,w=x1-x0,h=y1-y0,hz=fr=='n'||fr=='s',L=hz?w:h,o=hz?x0:y0,F=dg.map(f=>o+f*L),Bk=bk?[o+L*.82]:[],DR=dtBox.D||(dtBox.D=[]);
for(const f of F)DR.push(hz?[f,fr=='n'?y0:y1]:[fr=='w'?x0:x1,f]);for(const f of Bk)DR.push(hz?[f,fr=='n'?y1:y0]:[fr=='w'?x1:x0,f]);
hwall(y0,x0,x1,fr=='n'?F:fr=='s'?Bk:[]);hwall(y1,x0,x1,fr=='s'?F:fr=='n'?Bk:[]);vwall(x0,y0,y1,fr=='w'?F:fr=='e'?Bk:[]);vwall(x1,y0,y1,fr=='e'?F:fr=='w'?Bk:[])}
function dtUV(r,fr){const[x0,y0,x1,y1]=r;return fr=='n'?(u,v)=>[x0+u,y0+v]:fr=='s'?(u,v)=>[x0+u,y1-v]:fr=='w'?(u,v)=>[x0+v,y0+u]:(u,v)=>[x1-v,y0+u]}
function mapDowntown(){WW=2900;WH=2400;const AX=[360,1100,1840,2580],SY=[980,1560,2140],RW=64,SW=40;
HS={px:1470,py:900,cx:1470,cy:900,nx0:-999,nx1:-998,ny0:-999,ny1:-998};
// streets + the fire engine's road graph
const N=[],A=[],nid=(x,y)=>{let i=N.findIndex(n=>n[0]==x&&n[1]==y);if(i<0){i=N.length;N.push([x,y]);A.push([])}return i},ed=(a,b)=>{A[a].push(b);A[b].push(a)};
for(const y of SY){const xs=[60,...AX,WW-60];for(let i=0;i<xs.length-1;i++)ed(nid(xs[i],y),nid(xs[i+1],y))}
for(const x of AX){const ys=[...(x==AX[0]||x==AX[3]?[60]:[]),...SY,WH-60];for(let i=0;i<ys.length-1;i++)ed(nid(x,ys[i]),nid(x,ys[i+1]))}HS.RG={N,A};
const RD=[...SY.map(y=>[0,y-RW,WW,2*RW]),...AX.map(x=>[x-RW,x==AX[0]||x==AX[3]?0:SY[0]-RW,2*RW,WH-(x==AX[0]||x==AX[3]?0:SY[0]-RW)])];
// ----- buildings -----
const H=[],D=[],M=[],G=[],pp=(k,x,y)=>put(D,k,x,y);dtBox.D=[];
const B=[
[12,40,248,868,'apt','e'],[472,120,660,868,'apt','w'],[2280,120,2468,868,'apt','e'],[2692,40,2890,868,'apt','w'],
[12,1092,248,1448,'apt','e'],[472,1092,988,1448,'tower','n','ZOMBVILLE TOWER'],[1212,1092,1468,1330,'diner','n',"JOE'S DINER"],[1484,1092,1728,1330,'pizza','n','PIZZA PALACE'],[1952,1092,2468,1448,'tower','s','FIRST BANK OF ZOMBVILLE'],[2692,1092,2890,1448,'apt','w'],
[12,1672,248,2028,'apt','e'],[472,1672,820,2028,'store','n','MEGA MART'],[836,1672,988,2028,'cloth','e','THREADS'],[1212,1672,1728,2028,'apt','n','ZOMBVILLE APARTMENTS'],[1952,1672,2300,2028,'tower','s','SKYLINE PLAZA'],[2316,1672,2468,2028,'burger','e','BURGER BARN'],[2692,1672,2890,2028,'apt','w'],
[12,2252,248,2392,'apt','e'],[472,2252,716,2392,'coffee','n','CORNER COFFEE'],[732,2252,988,2392,'books','n','BOOKS & MORE'],[1212,2252,1728,2392,'apt','n'],[1952,2252,2200,2392,'pharm','n','PHARMACY'],[2216,2252,2468,2392,'store','n','QUICK MART'],[2692,2252,2890,2392,'apt','w']];
for(const[x0,y0,x1,y1,ty,fr,nm]of B){const b=[x0,y0,x1,y1],w=x1-x0,h=y1-y0,hz=fr=='n'||fr=='s',Ln=hz?w:h,Dp=hz?h:w;let room=b;
if(ty=='tower'){const LD=Math.min(200,Dp*.55);room=fr=='n'?[x0,y0,x1,y0+LD]:fr=='s'?[x0,y1-LD,x1,y1]:fr=='w'?[x0,y0,x0+LD,y1]:[x1-LD,y0,x1,y1];dtBox(room,fr,[.3,.7],0)}
else if(ty=='apt'){const VW=Math.min(170,Ln-60),VD=Math.min(110,Dp*.4),c=Ln/2;room=fr=='n'?[x0+c-VW/2,y0,x0+c+VW/2,y0+VD]:fr=='s'?[x0+c-VW/2,y1-VD,x0+c+VW/2,y1]:fr=='w'?[x0,y0+c-VW/2,x0+VD,y0+c+VW/2]:[x1-VD,y0+c-VW/2,x1,y0+c+VW/2];dtBox(room,fr,[.5],0)}
else dtBox(b,fr,Ln>300?[.3,.7]:[.5],1);
const mass=room===b?[]:dtSub(b,room);for(const r of mass)WL.push([r[0],r[1],r[2]-r[0],r[3]-r[1],1]);
const RL=room[2]-room[0],RH=room[3]-room[1],rL=hz?RL:RH,rD=hz?RH:RL,uv=dtUV(room,fr),P2=(k,u,v)=>{const p=uv(u,v);pp(k,p[0],p[1])};
H.push({x:room[0],y:room[1],w:RL,h:RH,ty});G.push({b,room,mass,ty,fr,nm});
switch(ty){
case 'tower':P2('rdesk',rL/2,rD*.62);P2('plant',30,50);P2('plant',rL-30,50);P2('plant',30,rD-20);P2('plant',rL-30,rD-20);P2('couch',rL*.18,rD*.45);P2('couch',rL*.82,rD*.45);if(rL>400){P2('turn',rL*.36,rD-24);P2('turn',rL*.64,rD-24)}break;
case 'apt':if(rL>120){P2('cabinet',22,rD-12);P2('cabinet',44,rD-12);P2('plant',rL-24,rD-12)}break;
case 'diner':for(let u=60;u<rL-50;u+=84)P2('rbooth',u,92);P2('counter',rL/2,rD*.66);P2('stove',40,rD-14);P2('stove',80,rD-14);P2('fridge',rL-50,rD-12);break;
case 'pizza':case 'burger':for(let u=56;u<rL-40;u+=84)P2('table',u,86);for(let u=56;u<rL-40;u+=84)P2('table',u,146);if(rD>200){P2('counter',rL/2,rD*.74);P2('stove',40,rD-14);P2('fridge',rL-50,rD-12)}break;
case 'store':case 'pharm':for(let v=118;v<rD-60;v+=70)for(let u=70;u<rL-60;u+=140)P2('gshelf',u,v);P2('checkout',50,62);P2('checkout',rL-50,62);if(rD>200){for(let u=50;u<rL-30;u+=84)P2('fridge',u,rD-10)}if(rD<=200){P2('gshelf',rL/2,104);P2('cart',rL/2,rD-14)}break;
case 'cloth':for(let u=50;u<rL-30;u+=80)P2('rack',u,48);for(let u=90;u<rL-30;u+=80)P2('rack',u,110);P2('checkout',rL/2,rD-40);break;
case 'coffee':P2('counter',rL/2,rD-14);for(const u of[50,rL-50])for(const v of[60])P2('table',u,v);P2('plant',rL/2,40);break;
case 'books':for(let u=40;u<rL-30;u+=60)P2('bookshelf',u,rD-12);P2('couch',rL*.3,70);P2('table',rL*.7,70);break}}
HS.HO=H;
// ----- the stadium: off limits except the security checkpoint out front -----
const SC={x:1470,y:440,rx:760,ry:350},PK=[1350,610,1590,800];
for(let y=SC.y-SC.ry;y<SC.y+SC.ry;y+=16){const yc=y+8,dx=SC.rx*Math.sqrt(Math.max(0,1-((yc-SC.y)/SC.ry)**2));if(dx<4)continue;const a=SC.x-dx,b=SC.x+dx;if(yc>PK[1]){if(PK[0]>a)WL.push([a,y,PK[0]-a,16,1]);if(b>PK[2])WL.push([PK[2],y,b-PK[2],16,1])}else WL.push([a,y,b-a,16,1])}
hwall(PK[1],PK[0],PK[2],[]);vwall(PK[0],PK[1],PK[3],[]);vwall(PK[2],PK[1],PK[3],[]);H.push({x:PK[0],y:PK[1],w:PK[2]-PK[0],h:PK[3]-PK[1],ty:'gate'});
for(const x of[1395,1470,1545])pp('mdet',x,730);for(const x of[1390,1430,1510,1550])pp('turn',x,660);pp('xray',1470,790+0);
for(const[x,y]of[[1300,850],[1640,850],[1200,820],[1740,820]])pp('stanch',x,y);pp('booth',1020,840);pp('booth',1920,840);for(const x of[880,1160,1780,2060])pp('flagpole',x,820);pp('statue',1470,880);
// ----- street furniture + parked cars -----
const nearX=(x,m)=>AX.some(a=>Math.abs(x-a)<m),nearY=(y,m)=>SY.some(a=>Math.abs(y-a)<m);
const V=[],cc=['#c0392b','#2f6fd0','#d8d8d4','#26262c','#2f8a4a','#f0c020','#8a8f96','#6a4a9a','#f0c020','#3a8a8a'],ks=['sedan','suv','sedan','van','sedan','pickup'];let n=0;
for(const y of SY)for(const s of[-1,1])for(let x=40;x<WW-40;x+=96+dtH(n,1)*70){n++;if(nearX(x,150)||dtH(n,2)<.4)continue;const k=ks[n%6],z=HWV(k);V.push({k,x,y:y+s*44,a:s<0?Math.PI:0,L:z[0]*.92,W:z[1]*.9,c:cc[n%cc.length]})}
for(const x of AX)for(const s of[-1,1])for(let y=x==AX[0]||x==AX[3]?60:SY[0]+150;y<WH-40;y+=96+dtH(n,3)*70){n++;if(nearY(y,150)||dtH(n,4)<.45)continue;const k=ks[n%6],z=HWV(k);V.push({k,x:x+s*44,y,a:s<0?-Math.PI/2:Math.PI/2,L:z[0]*.92,W:z[1]*.9,c:cc[n%cc.length]})}
for(const v of V)hwCol(v);
const okSW=(x,y)=>!WL.some(w=>x>w[0]-24&&x<w[0]+w[2]+24&&y>w[1]-20&&y<w[1]+w[3]+20)&&!dtBox.D.some(d=>Math.abs(d[0]-x)<56&&Math.abs(d[1]-y)<56);
const SF=['stree','lamp','stree','hydrant','newsb','trash','stree','lamp'];n=0;
for(const y of SY)for(const s of[-1,1])for(let x=70;x<WW-50;x+=120){n++;if(nearX(x,130))continue;const yy=y+(s<0?-RW-8:RW+18),k=SF[n%SF.length];if(okSW(x,yy))pp(k,x,yy)}
for(const x of AX)for(const s of[-1,1])for(let y=x==AX[0]||x==AX[3]?120:SY[0]+140;y<WH-40;y+=120){n++;if(nearY(y,130))continue;const xx=x+s*(RW+20),k=SF[(n+3)%SF.length];if(okSW(xx,y+12))pp(k,xx,y+12)}
for(const x of AX)for(const y of SY){if(okSW(x-RW-16,y-RW-6))pp('tlight',x-RW-16,y-RW-6);if(okSW(x+RW+16,y+RW+34))pp('tlight',x+RW+16,y+RW+34)}
for(const[x,y]of[[700,SY[0]-RW-4],[2200,SY[1]-RW-4],[1450,SY[2]+RW+38]])if(okSW(x,y))pp('bstop',x,y);
for(const[x,y]of[[1240,1400],[1700,1400],[1500,1440]])pp('dumpster',x,y);for(const[x,y]of[[1300,1380],[1620,1420]])pp('bags',x,y);
const KO=[...RD.map(r=>[r[0],r[1],r[0]+r[2],r[1]+r[3]]),...B.map(b=>[b[0]-6,b[1]-6,b[2]+6,b[3]+6]),[SC.x-SC.rx-10,0,SC.x+SC.rx+10,PK[3]+10]];
D.push(...scatter(13,[['paper',5],['can',2],['bags',1],['tuft',1]],70,KO));D.ko=[[0,0,WW,WH]];
// spawns: down every street from the edges of the map
const SP=[];for(const y of SY){SP.push([20,y-20],[20,y+20],[WW-20,y-20],[WW-20,y+20])}for(const x of AX)SP.push([x-20,WH-20],[x+20,WH-20]);SP.push([AX[0],20],[AX[3],20]);HS.sp=SP;
SM=[];grid();
const g=ground('#a8a69e','#a2a098','#aeaca4','#9a9890');
// sidewalk slabs
g.fillStyle='rgba(60,60,60,.12)';for(let x=0;x<WW;x+=32)g.fillRect(x,0,1,WH);for(let y=0;y<WH;y+=32)g.fillRect(0,y,WW,1);
// streets
for(const r of RD){g.fillStyle='#8a8a84';g.fillRect(r[0]-4,r[1]-4,r[2]+8,r[3]+8)}for(const r of RD){g.fillStyle='#3e4046';g.fillRect(r[0],r[1],r[2],r[3])}
for(let i=0;i<5000;i++){const r=RD[i%RD.length],x=r[0]+dtH(i,5)*r[2],y=r[1]+dtH(i,6)*r[3];g.fillStyle=i%3?'rgba(0,0,0,.12)':'rgba(255,255,255,.05)';g.fillRect(x,y,2+i%3,2)}
for(let i=0;i<40;i++){const r=RD[i%RD.length];crack(g,r[0]+dtH(i,7)*r[2],r[1]+dtH(i,8)*r[3],8,'rgba(10,10,10,.5)')}
for(let i=0;i<30;i++){const r=RD[i%RD.length],x=r[0]+dtH(i,9)*r[2],y=r[1]+dtH(i,10)*r[3];g.fillStyle='rgba(20,20,24,.35)';g.beginPath();g.ellipse(x,y,14+dtH(i,11)*10,7,0,0,7);g.fill()}
g.fillStyle='rgba(230,190,60,.85)';for(const y of SY)for(let x=0;x<WW;x+=4)if(!nearX(x+2,RW+20)){g.fillRect(x,y-4,4,3);g.fillRect(x,y+1,4,3)}
for(const x of AX)for(let y=0;y<WH;y+=4)if(!nearY(y+2,RW+20)&&(y>SY[0]||x==AX[0]||x==AX[3])){g.fillRect(x-4,y,3,4);g.fillRect(x+1,y,3,4)}
g.fillStyle='rgba(240,240,232,.6)';for(const y of SY)for(let x=0;x<WW;x+=60)if(!nearX(x+15,RW+20)){g.fillRect(x,y-RW/2-1,30,3);g.fillRect(x,y+RW/2-1,30,3)}
g.fillStyle='rgba(245,245,238,.85)';for(const x of AX)for(const y of SY){if(x!=AX[0]&&x!=AX[3]&&y==SY[0]){}for(let k=-RW+6;k<RW-6;k+=14){g.fillRect(x-RW-30,y+k,22,8);g.fillRect(x+RW+8,y+k,22,8);if(y!=SY[0]||x==AX[0]||x==AX[3])g.fillRect(x+k,y-RW-30,8,22);g.fillRect(x+k,y+RW+8,8,22)}}
for(const[x,y]of[[700,980],[2200,1560],[1450,2140],[360,1270],[2580,1850],[1100,1270],[1840,1850]]){g.fillStyle='#16141a';g.beginPath();g.arc(x,y+30,11,0,7);g.fill();g.fillStyle='#4a4a4e';g.beginPath();g.arc(x,y+30,9,0,7);g.fill()}
// stadium
{const{x,y,rx,ry}=SC,E=(c,a,b,cy)=>{g.fillStyle=c;g.beginPath();g.ellipse(x,cy??y,a,b,0,0,7);g.fill()};E('#16111c',rx+3,ry+3);E('#8a8a90',rx,ry);E('#6a6a72',rx-14,ry-14);
for(let i=0;i<14;i++){const k=i/14;E(i%2?'#b83a32':'#c84a40',rx-22-k*240,ry-22-k*120)}g.strokeStyle='rgba(30,20,20,.5)';g.lineWidth=2;for(let a=0;a<6.283;a+=.16){g.beginPath();g.moveTo(x+Math.cos(a)*(rx-262),y+Math.sin(a)*(ry-142));g.lineTo(x+Math.cos(a)*(rx-22),y+Math.sin(a)*(ry-22));g.stroke()}
for(let i=0;i<14;i++){const k=i/14;g.strokeStyle='rgba(255,255,255,.12)';g.lineWidth=1;g.beginPath();g.ellipse(x,y,rx-22-k*240,ry-22-k*120,0,0,7);g.stroke()}
E('#3a3a40',rx-262,ry-142);g.fillStyle='#3f8a3a';g.fillRect(x-330,y-150,660,300);g.fillStyle='#4a9a44';for(let i=0;i<12;i+=2)g.fillRect(x-330+i*55,y-150,55,300);
g.fillStyle='#b83a32';g.fillRect(x-330,y-150,60,300);g.fillStyle='#2f4a8a';g.fillRect(x+270,y-150,60,300);g.fillStyle='rgba(255,255,255,.85)';for(let i=0;i<=10;i++)g.fillRect(x-270+i*54,y-150,2,300);g.fillRect(x-330,y-150,660,2);g.fillRect(x-330,y+148,660,2);
g.save();g.fillStyle='#f4f0e0';g.font='bold 30px Arial, Helvetica, sans-serif';g.textAlign='center';g.textBaseline='middle';g.translate(x-300,y);g.rotate(-Math.PI/2);g.fillText('ZOMBVILLE',0,0);g.restore();g.save();g.fillStyle='#f4f0e0';g.font='bold 30px Arial, Helvetica, sans-serif';g.textAlign='center';g.textBaseline='middle';g.translate(x+300,y);g.rotate(Math.PI/2);g.fillText('DEADHEADS',0,0);g.restore();
g.fillStyle='#f4f0e0';g.beginPath();g.arc(x,y,40,0,7);g.strokeStyle='#f4f0e0';g.lineWidth=3;g.stroke();g.font='bold 22px Arial';g.textAlign='center';g.textBaseline='middle';g.fillText('Z',x,y);g.textAlign='left';g.textBaseline='alphabetic';
g.fillStyle='#16111c';g.fillRect(x-130,y-ry+40,260,70);g.fillStyle='#2a2c32';g.fillRect(x-126,y-ry+44,252,62);g.fillStyle='#ffd84a';g.font='bold 18px ui-monospace,monospace';g.textAlign='center';g.fillText('HOME 0  AWAY 0',x,y-ry+70);g.fillStyle='#ff5a4a';g.fillText('GAME CANCELLED',x,y-ry+94);g.textAlign='left';
for(const[a,b]of[[-.62,-.55],[.62,-.55],[-.7,.48],[.7,.48]]){const lx=x+a*rx,ly=y+b*ry;g.fillStyle='#16111c';g.fillRect(lx-26,ly-14,52,28);g.fillStyle='#d8d8d4';g.fillRect(lx-24,ly-12,48,24);for(let i=0;i<4;i++)for(let j=0;j<2;j++){g.fillStyle='#fff8d0';g.fillRect(lx-21+i*12,ly-9+j*11,9,8)}}
// a closed dome roof over the whole bowl
E('#16111c',rx+2,ry+2);E('#9aa2ae',rx-2,ry-2);for(let i=0;i<9;i++){const k=i/9;E(i%2?'#b8c0ca':'#aab2bc',(rx-10)*(1-k*.92),(ry-10)*(1-k*.92),y-k*40)}
g.strokeStyle='rgba(60,66,80,.55)';g.lineWidth=2;for(let a=0;a<6.283;a+=Math.PI/12){g.beginPath();g.moveTo(x,y-40);g.lineTo(x+Math.cos(a)*(rx-4),y+Math.sin(a)*(ry-4));g.stroke()}
for(let i=1;i<9;i++){const k=i/9;g.beginPath();g.ellipse(x,y-k*40,(rx-10)*(1-k*.92),(ry-10)*(1-k*.92),0,0,7);g.stroke()}
g.fillStyle='rgba(255,255,255,.35)';g.beginPath();g.ellipse(x-rx*.28,y-ry*.38,rx*.3,ry*.16,-.15,0,7);g.fill();g.fillStyle='rgba(0,0,0,.12)';g.beginPath();g.ellipse(x+rx*.3,y+ry*.45,rx*.45,ry*.3,0,0,7);g.fill();
g.fillStyle='#16111c';g.beginPath();g.ellipse(x,y-40,60,28,0,0,7);g.fill();g.fillStyle='#c8ccd4';g.beginPath();g.ellipse(x,y-40,57,25,0,0,7);g.fill();g.fillStyle='#b83a32';g.font='bold 15px Arial, Helvetica, sans-serif';g.textAlign='center';g.textBaseline='middle';g.fillText('ZOMBVILLE',x,y-46);g.fillStyle='#2f4a8a';g.fillText('DOME',x,y-31);
g.save();g.font='bold 34px Arial, Helvetica, sans-serif';g.fillStyle='rgba(184,58,50,.75)';g.fillText('HOME OF THE DEADHEADS',x,y-ry*.66);g.restore();g.textAlign='left';g.textBaseline='alphabetic';
// checkpoint pocket + plaza
chk(g,PK[0],PK[1],PK[2]-PK[0],PK[3]-PK[1],'#c8c4b8','#bcb8ac');g.fillStyle='#16111c';g.fillRect(PK[0]+10,PK[1]-2,PK[2]-PK[0]-20,12);g.fillStyle='#6a6e78';g.fillRect(PK[0]+12,PK[1],PK[2]-PK[0]-24,8);for(let i=PK[0]+14;i<PK[2]-14;i+=6){g.fillStyle='#4a4e58';g.fillRect(i,PK[1],1,8)}
g.fillStyle='#c0392b';g.fillRect(PK[0]+60,PK[1]+12,120,16);g.fillStyle='#f4f0e0';g.font='bold 11px Arial';g.textAlign='center';g.fillText('GATE A · CLOSED',(PK[0]+PK[2])/2,PK[1]+24);g.textAlign='left';
g.fillStyle='rgba(240,200,64,.85)';for(let y2=PK[1]+40;y2<PK[3];y2+=40)g.fillRect(PK[0]+6,y2,PK[2]-PK[0]-12,3);
g.fillStyle='#16111c';g.fillRect(x-122,PK[3]-2,244,4)}
// buildings: roofs, then lobby / shop floors
for(const q of G){const[x0,y0,x1,y1]=q.b;if(q.ty=='tower'){g.fillStyle='#16111c';g.fillRect(x0-2,y0-2,x1-x0+4,y1-y0+4);g.fillStyle='#4a5a6e';g.fillRect(x0,y0,x1-x0,y1-y0);g.fillStyle='#8ab0d0';for(let x=x0+6;x<x1-6;x+=14)g.fillRect(x,y0+2,8,4),g.fillRect(x,y1-6,8,4);for(let y=y0+6;y<y1-6;y+=14)g.fillRect(x0+2,y,4,8),g.fillRect(x1-6,y,4,8);
g.fillStyle='#5e6470';g.fillRect(x0+14,y0+14,x1-x0-28,y1-y0-28);g.fillStyle='#565c68';for(let y=y0+14;y<y1-14;y+=24)g.fillRect(x0+14,y,x1-x0-28,1);for(let x=x0+14;x<x1-14;x+=24)g.fillRect(x,y0+14,1,y1-y0-28)}
else if(q.ty=='apt'){g.fillStyle='#16111c';g.fillRect(x0-2,y0-2,x1-x0+4,y1-y0+4);g.fillStyle='#8a4a3a';g.fillRect(x0,y0,x1-x0,y1-y0);g.fillStyle='#6a5a50';g.fillRect(x0+8,y0+8,x1-x0-16,y1-y0-16);for(let i=0;i<(x1-x0)*(y1-y0)/300;i++){g.fillStyle=i%2?'#5e5048':'#766458';g.fillRect(x0+8+dtH(i,x0)*(x1-x0-18),y0+8+dtH(i,y0)*(y1-y0-18),2,2)}g.fillStyle='#7a3a2c';for(let x=x0;x<x1;x+=10)g.fillRect(x,y0,5,3),g.fillRect(x,y1-3,5,3)}}
// rooftop details
for(const q of G){if(q.ty!='tower'&&q.ty!='apt')continue;for(const r of q.mass){const w=r[2]-r[0],h=r[3]-r[1];if(w<60||h<60)continue;const k=Math.floor(w*h/22000)+1;for(let i=0;i<k;i++){const ax=r[0]+20+dtH(i,r[0]+r[1])*(w-70),ay=r[1]+20+dtH(i,r[1]-r[0])*(h-60);g.fillStyle='#16111c';g.fillRect(ax-1,ay-1,32,24);g.fillStyle='#9aa0aa';g.fillRect(ax,ay,30,22);g.fillStyle='#7a808a';for(let j=0;j<5;j++)g.fillRect(ax+3+j*5,ay+3,3,16);g.fillStyle='#16111c';g.beginPath();g.arc(ax+15,ay+11,6,0,7);g.fill();g.fillStyle='#5a606a';g.beginPath();g.arc(ax+15,ay+11,5,0,7);g.fill()}
if(q.ty=='apt'&&w>100&&h>100){const tx=r[0]+w*.7,ty=r[1]+h*.3;g.fillStyle='#16111c';g.beginPath();g.arc(tx,ty,19,0,7);g.fill();g.fillStyle='#8a5a32';g.beginPath();g.arc(tx,ty,17,0,7);g.fill();g.fillStyle='#6a4022';for(let a=0;a<6.28;a+=.5)g.fillRect(tx+Math.cos(a)*12-1,ty+Math.sin(a)*12-1,2,2);g.fillStyle='#5a3a22';g.beginPath();g.arc(tx,ty,6,0,7);g.fill()}}
if(q.nm=='ZOMBVILLE TOWER'){const r=q.mass[0],hx=(r[0]+r[2])/2,hy=(r[1]+r[3])/2;g.fillStyle='#16111c';g.beginPath();g.arc(hx,hy,52,0,7);g.fill();g.fillStyle='#3a3d46';g.beginPath();g.arc(hx,hy,50,0,7);g.fill();g.strokeStyle='#ffd84a';g.lineWidth=4;g.beginPath();g.arc(hx,hy,42,0,7);g.stroke();g.fillStyle='#f4f0e0';g.font='bold 44px Arial';g.textAlign='center';g.textBaseline='middle';g.fillText('H',hx,hy+2);g.textAlign='left';g.textBaseline='alphabetic'}
if(q.ty=='tower'&&q.nm){const r=q.mass.reduce((a,b)=>(b[2]-b[0])*(b[3]-b[1])>(a[2]-a[0])*(a[3]-a[1])?b:a);g.fillStyle='rgba(240,240,240,.18)';g.font='bold 20px Arial, Helvetica, sans-serif';g.textAlign='center';g.fillText(q.nm,(r[0]+r[2])/2,q.nm=='ZOMBVILLE TOWER'?r[3]-24:(r[1]+r[3])/2+60);g.textAlign='left'}}
const FL={tower:['#e8e4dc','#dcd8d0'],apt:['#a8988a','#9a8a7c'],diner:['#f4f4f0','#26262c'],pizza:['#c8784a','#b86a3e'],burger:['#e8c070','#d8b060'],store:['#e8ecef','#dce0e4'],pharm:['#eef2f4','#e2e6e8'],cloth:['#b08a5a','#a07c50'],coffee:['#8a6040','#7a5438'],books:['#7a5232','#6e4a2c'],gate:null};
for(const q of G){const r=q.room,f=FL[q.ty];if(!f)continue;(q.ty=='store'||q.ty=='pharm'||q.ty=='diner'?tiles:chk)(g,r[0],r[1],r[2]-r[0],r[3]-r[1],f[0],f[1]);
if(q.ty=='tower'){const back=q.fr=='n'?[r[0],r[3]]:q.fr=='s'?[r[0],r[1]]:null;if(back){const L=r[2]-r[0];for(let i=0;i<4;i++){const ex=r[0]+L*(.2+i*.2)-20,ey=back[1]+(q.fr=='n'?-12:4);g.fillStyle='#16111c';g.fillRect(ex-1,ey-1,42,10);g.fillStyle='#a8b0ba';g.fillRect(ex,ey,40,8);g.fillStyle='#7a828c';g.fillRect(ex+19,ey,2,8);g.fillStyle='#ffd84a';g.fillRect(ex+44,ey+2,3,3)}}g.fillStyle='rgba(30,40,60,.25)';g.fillRect((r[0]+r[2])/2-60,(r[1]+r[3])/2-30,120,60)}}
wl(g,'#26262c','#7a7c84');
// glass storefronts + awnings with the shop names
for(const q of G){if(q.ty=='apt'&&!q.nm)continue;const r=q.room,fr=q.fr;const segs=WL.filter(w=>!w[4]&&(fr=='n'?Math.abs(w[1]+3-r[1])<1&&w[2]>w[3]:fr=='s'?Math.abs(w[1]+3-r[3])<1&&w[2]>w[3]:fr=='w'?Math.abs(w[0]+3-r[0])<1&&w[3]>w[2]:Math.abs(w[0]+3-r[2])<1&&w[3]>w[2])&&w[0]>=r[0]-4&&w[0]<=r[2]+4&&w[1]>=r[1]-4&&w[1]<=r[3]+4);
for(const w of segs){g.fillStyle='#8fc3e8';g.fillRect(w[0]+1,w[1]+1,Math.max(0,w[2]-2),Math.max(0,w[3]-2));g.fillStyle='rgba(255,255,255,.7)';if(w[2]>w[3])for(let x=w[0]+6;x<w[0]+w[2]-4;x+=22)g.fillRect(x,w[1]+2,6,2);else for(let y=w[1]+6;y<w[1]+w[3]-4;y+=22)g.fillRect(w[0]+2,y,2,6)}
if(!q.nm||q.ty=='tower')continue;const AC={diner:'#c0392b',pizza:'#2f8a4a',burger:'#e07a1a',store:'#2f6fd0',pharm:'#3f9a5a',cloth:'#8a3aaa',coffee:'#6a4022',books:'#2a4a7a',apt:'#5a3a2a'}[q.ty]||'#c0392b';
g.save();const hz=fr=='n'||fr=='s',L=hz?r[2]-r[0]:r[3]-r[1];if(hz)g.translate(r[0],fr=='n'?r[1]-20:r[3]+6);else{g.translate(fr=='w'?r[0]-6:r[2]+6,r[1]);g.rotate(Math.PI/2);if(fr=='w')g.translate(0,-14)}
const aw=Math.min(L-20,Math.max(120,q.nm.length*10+30)),ax=(L-aw)/2;g.fillStyle='#16111c';g.fillRect(ax-1,-1,aw+2,16);for(let i=0;i<aw;i+=10){g.fillStyle=(i/10)%2?AC:'#f4f0e0';g.fillRect(ax+i,0,Math.min(10,aw-i),14)}g.fillStyle='#16111c';g.fillRect(ax+aw/2-q.nm.length*4-6,1,q.nm.length*8+12,12);g.fillStyle='#ffe9a0';g.font='bold 10px ui-monospace,monospace';g.textAlign='center';g.textBaseline='middle';g.fillText(q.nm,ax+aw/2,7.5);g.restore();g.textAlign='left';g.textBaseline='alphabetic'}
// tower name plates over the lobby doors
for(const q of G){if(q.ty!='tower')continue;const r=q.room,y=q.fr=='n'?r[1]-22:r[3]+8;g.fillStyle='#16111c';g.fillRect((r[0]+r[2])/2-q.nm.length*4.5-8,y,q.nm.length*9+16,15);g.fillStyle='#c8a040';g.fillRect((r[0]+r[2])/2-q.nm.length*4.5-6,y+1,q.nm.length*9+12,13);g.fillStyle='#16111c';g.font='bold 11px Arial, Helvetica, sans-serif';g.textAlign='center';g.textBaseline='middle';g.fillText(q.nm,(r[0]+r[2])/2,y+8);g.textAlign='left';g.textBaseline='alphabetic'}
// fire escapes on the apartment blocks
for(const q of G){if(q.ty!='apt')continue;const[x0,y0,x1,y1]=q.b,fr=q.fr;const L=fr=='n'||fr=='s'?x1-x0:y1-y0;for(let s=40;s<L-40;s+=110){if(Math.abs(s-L/2)<110)continue;g.fillStyle='rgba(0,0,0,.25)';let x,y,w,h;if(fr=='e'){x=x1;y=y0+s;w=12;h=56}else if(fr=='w'){x=x0-12;y=y0+s;w=12;h=56}else if(fr=='n'){x=x0+s;y=y0-12;w=56;h=12}else{x=x0+s;y=y1;w=56;h=12}g.fillStyle='#16111c';g.fillRect(x,y,w,h);g.fillStyle='#4a4e58';g.fillRect(x+1,y+1,w-2,h-2);g.fillStyle='#2a2c32';if(w>h)for(let i=x+3;i<x+w-2;i+=4)g.fillRect(i,y+1,1,h-2);else for(let j=y+3;j<y+h-2;j+=4)g.fillRect(x+1,j,w-2,1)}}
sign(g,1470,812,'SECURITY CHECKPOINT',170);
for(const v of V){g.save();g.translate(v.x+4,v.y+5);g.rotate(v.a);g.fillStyle='rgba(0,0,0,.28)';g.fillRect(-v.L/2,-v.W/2,v.L,v.W);g.restore()}
for(const v of V){const r=Math.hypot(v.L,v.W)/2+6;vDraw(g,v.x-r,v.y-r,r*2,r*2,q=>{hwDraw(q,v);if(v.c=='#f0c020'){q.save();q.translate(v.x,v.y);q.rotate(v.a);q.fillStyle='#16111c';q.fillRect(-7,-5,14,10);q.fillStyle='#f4f0e0';q.fillRect(-6,-4,12,8);q.restore()}})}
paintDec(g,D);HS.DT={t:0};HS.TRK=D.filter(o=>o.kn=='stree').map(o=>[o.x,o.y-4])}
// blinking traffic signals (under people)
function dtAnim(){const t=performance.now()/1000,ph=Math.floor(t/3)%3;}

