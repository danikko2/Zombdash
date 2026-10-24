//# maps/map-helpers.js — Shared helpers of the built-in maps: walls with doorways (hwall, vwall), the pathfinding grid, ground and checker floors, wall painting, trailers, parked cars, the round tree sprites (subSpr)
// (the Suburb, map 0, is a map file now: src/maps/suburb.json, built by world/builtin-maps.js)
function hwall(y,xa,xb,gaps,hw=26){let x=xa;for(const g of gaps){WL.push([x,y-3,g-hw-x,6]);x=g+hw}WL.push([x,y-3,xb-x,6])}
function grid(){gw=Math.ceil(WW/gs);gh=Math.ceil(WH/gs);bl=new Uint8Array(gw*gh);fd=new Int16Array(gw*gh);
for(let j=0;j<gh;j++)for(let i=0;i<gw;i++){const px=i*gs+8,py=j*gs+8;bl[j*gw+i]=wlAt(px,py).some(w=>px>w[0]-9&&px<w[0]+w[2]+9&&py>w[1]-9&&py<w[1]+w[3]+9)?1:0}}
function vwall(x,ya,yb,gaps,hw=26){let y=ya;for(const g of gaps){WL.push([x-3,y,6,g-hw-y]);y=g+hw}WL.push([x-3,y,6,yb-y])}
function ground(a,b,c,t){BG.width=WW;BG.height=WH;const g=BG.getContext('2d');for(let y=0;y<WH;y+=16)for(let x=0;x<WW;x+=16){const h=(x*7+y*13)%5;g.fillStyle=h<2?a:h<4?b:c;g.fillRect(x,y,16,16);if(t&&(x*31+y*17)%7==0){g.fillStyle=t;g.fillRect(x+4,y+6,2,5);g.fillRect(x+9,y+4,2,6)}}return g}
function chk(g,x,y,w,h,a,b){for(let j=0;j<h;j+=16)for(let i=0;i<w;i+=16){g.fillStyle=((i+j)/16)%2?a:b;g.fillRect(x+i,y+j,Math.min(16,w-i),Math.min(16,h-j))}}
function wl(g,d,l){for(const w of WL){if(w[4])continue;g.fillStyle=d;g.fillRect(w[0],w[1],w[2],w[3]);g.fillStyle=l;g.fillRect(w[0]+1,w[1]+1,Math.max(0,w[2]-2),Math.max(0,w[3]-2))}}
function trl(g,L,W,col,st){vRec(g,-L/2-1,-W/2-4,L+2,W+8,q=>trl(q,L,W,col,st));g.fillStyle='#16111c';g.fillRect(-L/2-1,-W/2-1,L+2,W+2);g.fillStyle=col;g.fillRect(-L/2,-W/2,L,W);g.fillStyle='rgba(0,0,0,.14)';for(let i=14;i<L-6;i+=14)g.fillRect(-L/2+i,-W/2,2,W);
g.fillStyle='rgba(255,255,255,.35)';g.fillRect(-L/2,-W/2,L,4);g.fillStyle=st;g.fillRect(-L/2+10,-6,L-50,12);g.fillStyle='rgba(255,255,255,.55)';g.fillRect(-L/2+16,-2,L-62,3);
g.fillStyle='#3a3d46';g.fillRect(-L/2,-W/2,7,W);g.fillStyle='#16111c';g.fillRect(-L/2+3,-W/2+4,1,W-8);g.fillRect(-L/2+5,-W/2+4,1,W-8);
g.fillStyle='#26262c';for(const sy of[-1,1])for(const wx of[-L/2+26,-L/2+44])g.fillRect(wx,sy*(W/2+1)-3,14,6);
g.fillStyle='#8a909c';for(const sy of[-1,1])g.fillRect(L/2-46,sy*(W/2-5)-2,6,5);g.fillStyle='#3a3d46';g.fillRect(L/2-6,-W/2,6,W)}
function car2(g,x,y,col){vRec(g,x-1,y-1,90,38,q=>car2(q,x,y,col));g.fillStyle='#16111c';g.fillRect(x-1,y-1,90,38);g.fillStyle=col;g.fillRect(x,y,88,36);g.fillStyle='rgba(255,255,255,.25)';g.fillRect(x,y,88,4);g.fillStyle='rgba(0,0,0,.2)';g.fillRect(x+22,y+5,40,26);g.fillStyle='#8fc3e8';g.fillRect(x+60,y+5,10,26);g.fillRect(x+14,y+5,8,26);g.fillStyle=col;g.fillRect(x+30,y+7,26,22);g.fillStyle='rgba(255,255,255,.18)';g.fillRect(x+30,y+7,26,4);
g.fillStyle='#ffe9a0';g.fillRect(x+84,y+4,4,7);g.fillRect(x+84,y+25,4,7);g.fillStyle='#c0392b';g.fillRect(x,y+4,3,7);g.fillRect(x,y+25,3,7);g.fillStyle='#26262c';for(const wx of[x+10,x+58])for(const wy of[y-2,y+31])g.fillRect(wx,wy,16,6)}
// round oak / pine canopy sprites (one shared canvas per size and shade): the Highway, the School and the forest trees (foak, fpine) use them
function subSpr(pine,r,v){const key=(pine?'p':'o')+r+'_'+Math.floor(v*3),K=subSpr.K||(subSpr.K={});if(K[key]&&K[key].width)return K[key];const R=r+2,cv=document.createElement('canvas');cv.width=R*2+2;cv.height=pine?Math.ceil(r*2.4)+4:R*2+2;const g=cv.getContext('2d'),x=R+1;
if(pine){const y=cv.height-2;for(let k=0;k<3;k++){const w=r*(1-k*.25),yy=y-k*r*.45;g.fillStyle='#16111c';g.beginPath();g.moveTo(x-w-1,yy+1);g.lineTo(x,yy-r*.9-1);g.lineTo(x+w+1,yy+1);g.fill();g.fillStyle=k==2?'#2c6a34':v<.5?'#1f4f2a':'#245a2e';g.beginPath();g.moveTo(x-w,yy);g.lineTo(x,yy-r*.85);g.lineTo(x+w,yy);g.fill()}}
else{const cy=R+1,c1=v<.33?'#2f6d2e':v<.66?'#356f2c':'#2b6436',c2=v<.33?'#3f8a3a':v<.66?'#4a8a36':'#3a7e44';g.fillStyle='#16111c';g.beginPath();g.arc(x,cy,r+1,0,7);g.fill();g.fillStyle=c1;g.beginPath();g.arc(x,cy,r,0,7);g.fill();g.fillStyle=c2;g.beginPath();g.arc(x-r*.3,cy-r*.3,r*.55,0,7);g.fill();g.beginPath();g.arc(x+r*.35,cy-r*.05,r*.4,0,7);g.fill();g.fillStyle='rgba(255,255,255,.12)';g.beginPath();g.arc(x-r*.4,cy-r*.45,r*.25,0,7);g.fill()}
return K[key]=cv}
