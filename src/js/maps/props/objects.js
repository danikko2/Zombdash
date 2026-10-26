//# maps/props/objects.js — Prop library: object sprites (OB), fences, scatter, put() and paintDec()
const R_=(q,c,x,y,w,h)=>{q.fillStyle=c;q.fillRect(x,y,w,h)};
let S2C=null;function S2(g,x,y,w,h,fn){const c=S2C||(S2C=document.createElement('canvas'));c.width=w;c.height=h;const q=c.getContext('2d');fn(q);const d=q.getImageData(0,0,w,h),a=d.data,o=new Uint8ClampedArray(a);
for(let j=0;j<h;j++)for(let i=0;i<w;i++)if(a[(j*w+i)*4+3]==0)for(const[dx,dy]of[[1,0],[-1,0],[0,1],[0,-1]]){const nx=i+dx,ny=j+dy;if(nx>=0&&ny>=0&&nx<w&&ny<h&&a[(ny*w+nx)*4+3]>0){const k=(j*w+i)*4;o[k]=22;o[k+1]=17;o[k+2]=28;o[k+3]=255;break}}
q.putImageData(new ImageData(o,w,h),0,0);g.drawImage(c,Math.round(x-w/2),Math.round(y-h))}
const ob=(w,h,c,fn)=>({w,h,c,f:(g,x,y,v)=>S2(g,x,y,w,h,q=>fn(q,v))});
const OB={
bush:ob(34,24,[26,10],(q,v)=>{R_(q,'#2f6b34',3,8,28,13);R_(q,'#2f6b34',7,3,20,10);R_(q,'#3f8a42',6,6,14,6);R_(q,'#52a851',10,4,8,3);R_(q,'#255a2c',3,18,28,3);if(v>.5){R_(q,'#d8404a',9,10,2,2);R_(q,'#d8404a',20,8,2,2);R_(q,'#d8404a',25,14,2,2)}}),
flower:ob(18,14,0,(q,v)=>{const c=['#ff6a8a','#ffd84a','#ffffff','#9a7aff'];for(let i=0;i<3;i++){R_(q,'#2f6b34',3+i*5,6+i%2*2,1,6);R_(q,c[(Math.floor(v*7)+i)%4],2+i*5,3+i%2*2,3,3)}R_(q,'#2f6b34',1,11,16,2)}),
tuft:ob(18,12,0,q=>{for(let i=0;i<5;i++)R_(q,i%2?'#3f8a42':'#2f6b34',2+i*3,3+i*7%4,2,8-i*7%4)}),
rock:ob(26,18,[20,9],q=>{R_(q,'#7c8089',3,6,20,10);R_(q,'#8f949e',6,3,12,6);R_(q,'#6a6e78',3,13,20,3);R_(q,'#a8adb7',8,5,5,2)}),
lamp:ob(14,60,[6,6],q=>{R_(q,'#3a3d46',6,10,3,48);R_(q,'#3a3d46',3,6,9,5);R_(q,'#ffe9a0',4,8,7,3);R_(q,'#3a3d46',4,56,7,3)}),
bench:ob(44,22,[38,10],q=>{R_(q,'#8a5a2c',3,8,38,5);R_(q,'#a8703a',3,3,38,4);R_(q,'#3a3d46',5,13,3,7);R_(q,'#3a3d46',36,13,3,7)}),
can:ob(18,24,[12,8],q=>{R_(q,'#6b7078',3,6,12,16);R_(q,'#868b94',2,3,14,4);R_(q,'#8a9098',5,8,2,12)}),
mail:ob(14,26,[6,6],q=>{R_(q,'#6b4a2a',6,10,3,14);R_(q,'#2f5faa',3,4,10,7);R_(q,'#d83a3a',11,3,2,4)}),
cone:ob(14,18,[8,6],q=>{R_(q,'#f07a2a',4,12,6,3);R_(q,'#f07a2a',5,8,4,4);R_(q,'#f07a2a',6,4,2,4);R_(q,'#fff',5,9,4,1);R_(q,'#3a3d46',2,15,10,2)}),
tire:ob(22,18,0,q=>{R_(q,'#26262c',3,4,16,12);R_(q,'#3a3a42',6,6,10,8);R_(q,'#14141a',8,8,6,4)}),
pallet:ob(34,16,0,q=>{R_(q,'#a8793e',2,4,30,3);R_(q,'#a8793e',2,10,30,3);R_(q,'#7a5528',3,7,4,3);R_(q,'#7a5528',15,7,4,3);R_(q,'#7a5528',27,7,4,3)}),
barrel:ob(20,26,[16,12],q=>{R_(q,'#8a3a22',3,3,14,20);R_(q,'#a8492b',4,3,4,20);R_(q,'#5c2616',3,8,14,2);R_(q,'#5c2616',3,17,14,2);R_(q,'#3a3a40',3,3,14,2)}),
crate:ob(28,28,[24,18],q=>{R_(q,'#a9733a',2,2,24,24);R_(q,'#7a4f24',2,2,24,3);R_(q,'#7a4f24',2,23,24,3);R_(q,'#7a4f24',2,2,3,24);R_(q,'#7a4f24',23,2,3,24);for(let i=0;i<18;i+=2){R_(q,'#8c5d2d',5+i,5+i,2,2);R_(q,'#8c5d2d',21-i,5+i,2,2)}}),
stump:ob(20,16,[14,9],q=>{R_(q,'#6b4a2a',3,5,14,9);R_(q,'#8f6a3e',3,3,14,4);R_(q,'#6b4a2a',7,4,6,2)}),
log:ob(34,14,[28,9],q=>{R_(q,'#6b4a2a',3,4,28,8);R_(q,'#8f6a3e',3,4,4,8);R_(q,'#55391f',10,6,18,1)}),
cross:ob(14,26,[8,8],q=>{R_(q,'#6b4a2a',6,3,3,20);R_(q,'#6b4a2a',2,8,11,3);R_(q,'#4a3a2c',2,22,11,3)}),
candle:ob(10,14,0,q=>{R_(q,'#e8e0c8',3,6,4,7);R_(q,'#ffcf40',4,2,2,4);R_(q,'#ff8a2a',4,4,2,2)}),
bones:ob(22,12,0,q=>{R_(q,'#e6e2d3',3,6,16,3);R_(q,'#e6e2d3',6,3,2,4);R_(q,'#e6e2d3',14,4,2,5);R_(q,'#f1eddc',2,3,6,5);R_(q,'#222',3,5,1,1);R_(q,'#222',6,5,1,1)}),
statue:ob(20,36,[14,10],q=>{R_(q,'#9a9aa2',4,8,12,26);R_(q,'#b4b4bc',2,4,16,5);R_(q,'#7c7c84',4,20,3,3);R_(q,'#7c7c84',4,31,12,3)}),
dead:ob(26,20,0,q=>{R_(q,'#4a3a2c',12,8,3,11);R_(q,'#4a3a2c',6,6,7,2);R_(q,'#4a3a2c',14,4,8,2);R_(q,'#4a3a2c',4,3,2,4);R_(q,'#4a3a2c',20,1,2,4)}),
fence:ob(40,22,[34,6],q=>{R_(q,'#26262c',2,16,36,2);R_(q,'#26262c',2,8,36,2);for(let i=0;i<7;i++){R_(q,'#3a3a44',3+i*5,4,2,15);R_(q,'#3a3a44',3+i*5,2,2,2)}}),
table:ob(46,26,[38,12],q=>{R_(q,'#8a5a2c',3,6,40,6);R_(q,'#a8703a',3,4,40,3);R_(q,'#6b4a2a',6,12,3,10);R_(q,'#6b4a2a',37,12,3,10);R_(q,'#8a5a2c',2,18,42,3)}),
grill:ob(22,26,[16,10],q=>{R_(q,'#2b2d33',3,6,16,8);R_(q,'#54575f',4,6,14,2);R_(q,'#2b2d33',5,14,2,9);R_(q,'#2b2d33',15,14,2,9);R_(q,'#d8503a',7,8,8,1)}),
doghouse:ob(36,30,[30,14],q=>{R_(q,'#a8492b',3,4,30,5);R_(q,'#8a3a22',6,2,24,3);R_(q,'#c9b38a',5,9,26,17);R_(q,'#2a1d14',14,14,9,12);R_(q,'#7a5a3a',5,24,26,2)}),
panel:ob(24,44,0,q=>{R_(q,'#7c828c',2,2,20,38);R_(q,'#5f656f',2,2,20,3);R_(q,'#9aa0aa',4,6,16,14);R_(q,'#5f656f',11,6,1,14);R_(q,'#d8b92e',4,24,16,3);R_(q,'#222',5,24,2,3);R_(q,'#222',9,24,2,3);R_(q,'#222',13,24,2,3);R_(q,'#3fd25a',5,31,3,3);R_(q,'#e0443a',10,31,3,3);R_(q,'#e0b030',15,31,3,3)}),
shelf:ob(88,60,[84,12],q=>{R_(q,'#3a5f9a',2,4,3,54);R_(q,'#3a5f9a',83,4,3,54);for(const y of[18,36,54])R_(q,'#d8803a',2,y,84,3);const C=['#b58a52','#c9a06a','#9a7240','#a8793e'];for(let r=0;r<3;r++)for(let i=0;i<4;i++){if((i+r)%5==3)continue;R_(q,C[(i+r*2)%4],7+i*19,[6,24,42][r],15,11)}}),
conveyor:ob(150,38,[146,12],q=>{R_(q,'#3a3d46',6,26,4,10);R_(q,'#3a3d46',70,26,4,10);R_(q,'#3a3d46',138,26,4,10);R_(q,'#6a6f7a',2,16,146,10);R_(q,'#8a909c',2,16,146,2);R_(q,'#2a2c32',4,19,142,5);for(let i=0;i<14;i++)R_(q,'#d8b92e',9+i*10,20,4,3);R_(q,'#b58a52',24,6,24,11);R_(q,'#9a7240',24,6,24,2);R_(q,'#c9a06a',96,8,20,9);R_(q,'#9a7240',96,8,20,2)}),
forklift:ob(104,66,[92,24],q=>{R_(q,'#a8793e',6,50,34,3);R_(q,'#7a5528',8,53,6,3);R_(q,'#7a5528',30,53,6,3);R_(q,'#7c828c',6,56,38,3);R_(q,'#b58a52',8,34,16,16);R_(q,'#c9a06a',24,38,14,12);R_(q,'#9a7240',12,20,18,14);R_(q,'#7a5528',8,34,16,2);R_(q,'#3a3d46',42,8,4,52);R_(q,'#e0a82e',48,30,52,22);R_(q,'#c68a1c',48,46,52,6);R_(q,'#3a3d46',94,32,8,20);R_(q,'#2a2c32',58,8,3,24);R_(q,'#2a2c32',86,8,3,24);R_(q,'#2a2c32',58,8,31,3);R_(q,'#444',66,22,14,8);R_(q,'#26262c',52,50,16,14);R_(q,'#26262c',80,50,16,14);R_(q,'#7c828c',58,55,4,4);R_(q,'#7c828c',86,55,4,4)}),
pbox:ob(44,40,[38,14],q=>{R_(q,'#a8793e',2,32,38,4);R_(q,'#7a5528',4,36,6,3);R_(q,'#7a5528',32,36,6,3);R_(q,'#b58a52',4,20,16,12);R_(q,'#c9a06a',21,20,16,12);R_(q,'#9a7240',10,8,22,12);R_(q,'#7a5528',4,20,16,2)}),
box:ob(18,16,[14,8],q=>{R_(q,'#b58a52',2,3,14,11);R_(q,'#9a7240',2,3,14,2);R_(q,'#c9a06a',8,3,2,11)}),
g_round:ob(24,34,[14,8],q=>{R_(q,'#9a9aa2',4,8,16,22);R_(q,'#9a9aa2',6,5,12,3);R_(q,'#b4b4bc',8,3,8,3);R_(q,'#7c7c84',4,26,16,4);R_(q,'#6c6c74',10,12,4,8);R_(q,'#4a3a2c',2,29,20,3)}),
g_cross:ob(24,36,[14,8],q=>{R_(q,'#8f949e',10,3,5,28);R_(q,'#8f949e',5,9,15,5);R_(q,'#6a6e78',10,26,5,5);R_(q,'#7c8089',4,30,17,3);R_(q,'#4a3a2c',2,32,20,2)}),
g_obelisk:ob(22,50,[12,8],q=>{R_(q,'#9a9aa2',8,6,7,36);R_(q,'#b4b4bc',9,2,5,5);R_(q,'#7c7c84',5,40,13,4);R_(q,'#6c6c74',3,44,17,4);R_(q,'#b4b4bc',9,10,2,28)}),
g_slab:ob(30,24,[24,8],q=>{R_(q,'#8f949e',3,6,24,15);R_(q,'#a8adb7',3,6,24,3);R_(q,'#6a6e78',6,12,18,2);R_(q,'#6a6e78',6,16,12,2);R_(q,'#4a3a2c',2,20,26,2)}),
g_wide:ob(40,28,[34,8],q=>{R_(q,'#9a9aa2',3,8,34,15);R_(q,'#9a9aa2',8,5,24,4);R_(q,'#b4b4bc',12,3,16,3);R_(q,'#6c6c74',10,12,20,2);R_(q,'#6c6c74',10,17,14,2);R_(q,'#7c7c84',3,22,34,3)}),
g_angel:ob(26,44,[14,8],q=>{R_(q,'#b4b4bc',9,8,8,26);R_(q,'#b4b4bc',10,3,6,6);R_(q,'#9a9aa2',2,10,8,12);R_(q,'#9a9aa2',16,10,8,12);R_(q,'#7c7c84',5,35,16,6);R_(q,'#7c7c84',9,24,8,4)}),
pew:ob(132,30,[128,14],q=>{R_(q,'#5a3a22',2,2,128,6);R_(q,'#7a4f2a',2,8,128,5);R_(q,'#7a4f2a',2,14,128,6);R_(q,'#5a3a22',2,20,6,8);R_(q,'#5a3a22',124,20,6,8)})};
function fh(A,y,xa,xb,gaps,hw=28){let x=xa;for(const g of gaps){A.push([x,y-2,g-hw-x,4,2]);x=g+hw}A.push([x,y-2,xb-x,4,2])}
function fv(A,x,ya,yb,gaps,hw=28){let y=ya;for(const g of gaps){A.push([x-2,y,4,g-hw-y,2]);y=g+hw}A.push([x-2,y,4,yb-y,2])}
function fenceH(g,x,y,w){g.save();g.beginPath();g.rect(x,y-13,w,15);g.clip();g.strokeStyle='rgba(205,211,222,.8)';g.lineWidth=1;for(let i=-14;i<w;i+=6){g.beginPath();g.moveTo(x+i,y-13);g.lineTo(x+i+14,y+2);g.moveTo(x+i+14,y-13);g.lineTo(x+i,y+2);g.stroke()}g.restore();
g.fillStyle='#9aa1ad';g.fillRect(x,y-14,w,2);g.fillRect(x,y+1,w,2);g.fillStyle='#3a3d46';for(let px=x;px<=x+w+1;px+=44)g.fillRect(px-2,y-17,4,21)}
function fenceV(g,x,y,h){g.fillStyle='rgba(0,0,0,.18)';g.fillRect(x-1,y,5,h);g.fillStyle='#aab1bd';g.fillRect(x-2,y,3,h);g.fillStyle='rgba(215,221,232,.75)';for(let j=0;j<h;j+=4)g.fillRect(x-3+(j/4%2)*3,y+j,2,2);g.fillStyle='#3a3d46';for(let py=y;py<=y+h+1;py+=44)g.fillRect(x-3,py-3,6,6)}
function scatter(seed,kinds,n,ko){const out=[],R=(i,k)=>{const v=Math.sin(i*12.9898+k*78.233+seed*3.7)*43758.5453;return v-Math.floor(v)},tw=kinds.reduce((a,k)=>a+k[1],0);
for(let i=0;i<n*8&&out.length<n;i++){const x=40+R(i,1)*(WW-80),y=60+R(i,2)*(WH-100);
if(ko.some(k=>x>k[0]&&x<k[2]&&y>k[1]&&y<k[3]))continue;
let r=R(i,3)*tw,kn=kinds[0][0];for(const[a,w]of kinds){r-=w;if(r<=0){kn=a;break}}
if(out.some(q=>Math.abs(q.x-x)<38&&Math.abs(q.y-y)<28))continue;
if(WL.some(w=>x>w[0]-26&&x<w[0]+w[2]+26&&y>w[1]-14&&y<w[1]+w[3]+32))continue;
out.push({x,y,kn,v:R(i,4)});const c=OB[kn].c;if(c)WL.push([x-c[0]/2,y-c[1],c[0],c[1],1])}
out.ko=ko;return out}
function put(D,k,x,y){D.push({x,y,kn:k,v:(x*7)%1});const c=OB[k].c;if(c)WL.push([x-c[0]/2,y-c[1],c[0],c[1],1])}
function paintDec(g,D){const R=(i,k)=>{const v=Math.sin(i*12.9898+k*78.233+9.1)*43758.5453;return v-Math.floor(v)},ko=D.ko||[];
for(let i=0;i<460;i++){const x=20+R(i,1)*(WW-40),y=20+R(i,2)*(WH-40);if(ko.some(k=>x>k[0]&&x<k[2]&&y>k[1]&&y<k[3]))continue;const v=R(i,3);
if(mapId==2){if(v<.35){g.fillStyle='rgba(60,45,30,.5)';g.beginPath();g.ellipse(x,y,12,6,0,0,7);g.fill()}else if(v<.65){g.fillStyle='#2c4533';g.fillRect(x,y,8,3)}else{g.fillStyle='#e6e2d3';g.fillRect(x,y,4,1);g.fillRect(x+1,y-1,1,3)}}
else if(mapId==5){if(NB.some(r=>x>r[0]&&x<r[2]&&y>r[1]&&y<r[3])){if(v<.35){g.fillStyle=['#ff6a8a','#ffd84a','#fff','#9a7aff'][i%4];g.fillRect(x,y-3,3,3);g.fillStyle='#2f6b34';g.fillRect(x+1,y,1,3)}else if(v<.6){g.fillStyle='#3f8a3a';g.fillRect(x,y,2,5);g.fillRect(x+3,y+1,2,4)}}else if(v<.5){g.fillStyle='rgba(0,0,0,.28)';g.fillRect(x,y,6,2)}}
else if(mapId==6){if(v<.35){g.fillStyle='rgba(40,34,20,.35)';g.fillRect(x,y,8,3)}else if(v<.55){g.fillStyle='#c8a03a';g.fillRect(x,y,3,1)}else if(v<.8){g.fillStyle='#5f5a3a';g.fillRect(x,y,2,5);g.fillRect(x+3,y+1,2,4)}else{g.fillStyle='#8a8578';g.fillRect(x,y,4,3)}}
else if(mapId==7||mapId==12){if(v<.3){g.fillStyle=['#ff6a8a','#ffd84a','#fff','#9a7aff'][i%4];g.fillRect(x,y-3,3,3);g.fillStyle='#2f6b34';g.fillRect(x+1,y,1,3)}else if(v<.65){g.fillStyle='#3a7a32';g.fillRect(x,y,2,5);g.fillRect(x+3,y+1,2,4)}else{g.fillStyle='#7a5a32';g.fillRect(x,y,5,1);g.fillRect(x+2,y-1,1,3)}}
else{if(v<.4){g.fillStyle='#a8885a';g.fillRect(x,y,4,3)}else if(v<.7){g.fillStyle='#b8a050';g.fillRect(x,y,2,5);g.fillRect(x+3,y+1,2,4)}else{g.fillStyle='rgba(110,80,40,.35)';g.fillRect(x,y,5,3)}}}
D.sort((a,b)=>a.y-b.y);for(const o of D)OB[o.kn].f(g,o.x,o.y,o.v)}
