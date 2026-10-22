//# world/terrain-more.js — More custom-map terrain: loop-pile carpet in seven colours, farm soil, and road markings (yellow / white lines, crosswalks)
// ---------- carpet ----------
// A berber (loop-pile) carpet: little loops in four shades, dark flecks, a faint chevron in the rows and a slow mottle,
// like a real carpet seen from above. Each colour is drawn once into a 128px square that repeats seamlessly; a tile
// shows the quarter of it that matches its position, so a room of carpet never shows a repeating 32px grid.
const CMCPC={};
function cmRGB(h){const n=parseInt(h.slice(1),16);return[(n>>16)&255,(n>>8)&255,n&255]}
// k<1 darkens, k>1 lightens towards white
function cmShadeRGB(c,k){return k<1?c.map(v=>v*k):c.map(v=>v+(255-v)*Math.min(1,(k-1)*1.4))}
function cmCarpet(hex){if(CMCPC[hex])return CMCPC[hex];const N=128,c=document.createElement('canvas');c.width=c.height=N;const q=c.getContext('2d');CMCPC[hex]=c;
const base=cmRGB(hex),im=q.createImageData(N,N),a=im.data,P=(x,y,col)=>{x=(x+N)%N;y=(y+N)%N;const k=(y*N+x)*4;a[k]=col[0];a[k+1]=col[1];a[k+2]=col[2];a[k+3]=255};
const H=(x,y,s)=>cmH(x%N,y%N,s),TAU=Math.PI*2;
// one pixel per loop, so the weave reads as a fine texture rather than clumps
for(let y=0;y<N;y++)for(let x=0;x<N;x++){
// slow mottle and a faint chevron (both repeat every 128px / 32px so the square tiles seamlessly)
const m=Math.sin(TAU*(x+y)/64)*.5+Math.sin(TAU*(2*x-y)/128)*.5,zz=((x+Math.abs((y%32)-16))%16)<8?1.02:.985;
// rows of loops: every other pixel in a row sits a touch darker, offset row by row
const w=((x+(y>>1))&1)?.975:1.015,r=H(x,y,71);let k=r<.05?.8:r<.2?.91:r<.7?1:r<.93?1.045:1.09;
P(x,y,cmShadeRGB(base,k*w*(1+m*.03)*zz))}
// darker flecks: single pixels and tiny pairs
for(let i=0;i<70;i++){const x=Math.floor(H(i,3,74)*N),y=Math.floor(H(i,5,75)*N),col=cmShadeRGB(base,.72+H(i,7,76)*.1);P(x,y,col);if(H(i,9,77)<.4)P(x+1,y+(H(i,11,78)<.5?0:1),col)}
// light loops that catch the light
for(let i=0;i<70;i++){const x=Math.floor(H(i,13,79)*N),y=Math.floor(H(i,17,80)*N);P(x,y,cmShadeRGB(base,1.14))}
q.putImageData(im,0,0);return c}
const CMCARPET=[['carpet_grey','Grey carpet','r','#8f8a84'],['carpet_dkgrey','Dark grey carpet','k','#57554f'],['carpet_tan','Tan carpet','e','#b39a76'],['carpet_black','Black carpet','q','#2c2b2b'],
['carpet_red','Red carpet','h','#8c2c2a'],['carpet_green','Green carpet','j','#3e6a46'],['carpet_blue','Blue carpet','u','#3a5a8e']];
for(const[id,n,ch,col]of CMCARPET)cmAddTer({id,n,ch,mc:col,carpet:col,f(g,x,y,tx,ty){g.drawImage(cmCarpet(col),(tx&3)*32,(ty&3)*32,32,32,x,y,32,32)}});
// ---------- farm soil ----------
// tilled rows for crops: ridges and furrows running across the map
cmAddTer({id:'soil',n:'Farm soil',ch:'f',mc:'#5a4128',f(g,x,y,tx,ty){g.fillStyle='#5a4128';g.fillRect(x,y,32,32);for(let r=0;r<4;r++){const py=y+r*8;g.fillStyle='#6e5234';g.fillRect(x,py,32,4);g.fillStyle='#7d6040';g.fillRect(x,py,32,1);g.fillStyle='#45311e';g.fillRect(x,py+6,32,2)}
cmSpeck(g,x,y,tx,ty,6,['#86694a','#3e2c1a','#6a4e32'],2,1,81);if(cmH(tx,ty,82)<.3){g.fillStyle='#4f8a3a';const sx=x+3+Math.floor(cmH(tx,ty,83)*24),sy=y+1+Math.floor(cmH(tx,ty,84)*3)*8;g.fillRect(sx,sy+1,1,2);g.fillRect(sx+2,sy,1,3)}}});
// ---------- road markings ----------
// Overlays, so they paint on top of any ground or road tile. A marking joins up with the same marking next to it: paint a
// row of tiles and you get one long line (a corner or a T where rows meet). A tile on its own looks two tiles along to
// see which way its line runs, so painting every other tile gives a line of separate stripes.
// d / i: the map and this tile's index (left out for the editor's swatches, which show a straight line).
function cmMarkDirs(id,tx,ty,d){if(!d)return{L:1,R:1,U:0,D:0,h:1,v:0,solo:0};const same=(a,b)=>{const x=tx+a,y=ty+b;if(x<0||y<0||x>=d.w||y>=d.h)return false;const o=d.ovl[y*d.w+x];return !!o&&d.opal[o]===id};
const L=same(-1,0),R=same(1,0),U=same(0,-1),D=same(0,1);let h=L||R,v=U||D,solo=0;if(!h&&!v){solo=1;const v2=same(0,-2)||same(0,2),h2=same(-2,0)||same(2,0);if(v2&&!h2)v=1;else h=1}return{L,R,U,D,h,v,solo}}
// one line: across the tile (hz) or down it, from a to b along it, at offset o (thickness t) across it
function cmMarkSeg(g,x,y,hz,a,b,o,t){if(b<=a)return;hz?g.fillRect(x+a,y+o,b-a,t):g.fillRect(x+o,y+a,t,b-a)}
function cmMarkLine(g,x,y,tx,ty,d,id,col,dk,dash,lines){const M=cmMarkDirs(id,tx,ty,d);g.fillStyle=col;
const draw=(hz,lo,hi)=>{for(const[o,t]of lines){if(dash)cmMarkSeg(g,x,y,hz,8,24,o,t);else if(M.solo)cmMarkSeg(g,x,y,hz,5,27,o,t);else cmMarkSeg(g,x,y,hz,lo?0:13,hi?32:19,o,t)}};
if(M.h)draw(1,M.L,M.R);if(M.v)draw(0,M.U,M.D);
// worn paint: a few darker pixels on the line
g.fillStyle=dk;for(let k=0;k<3;k++){const u=4+Math.floor(cmH(tx,ty,85+k)*24),w=lines[Math.floor(cmH(ty,tx,88+k)*lines.length)];if(dash&&(u<8||u>23))continue;if(M.h&&(dash||M.solo||u>=(M.L?0:13)&&u<(M.R?32:19)))g.fillRect(x+u,y+w[0]+Math.floor(cmH(tx,ty,91+k)*w[1]),1,1);else if(M.v&&!M.h)g.fillRect(x+w[0]+Math.floor(cmH(tx,ty,91+k)*w[1]),y+u,1,1)}}
const CMYEL=['#e3b92b','#a8841c'],CMWHT=['#e8e8e0','#b4b4aa'];
cmAddOvl({id:'yline',n:'Yellow line',ch:'y',mc:'#e3b92b',mk:1,f(g,x,y,tx,ty,d){cmMarkLine(g,x,y,tx,ty,d,'yline',CMYEL[0],CMYEL[1],0,[[12,2],[18,2]])}});
cmAddOvl({id:'ydash',n:'Yellow dashed line',ch:'i',mc:'#e3b92b',mk:1,f(g,x,y,tx,ty,d){cmMarkLine(g,x,y,tx,ty,d,'ydash',CMYEL[0],CMYEL[1],1,[[14,3]])}});
cmAddOvl({id:'wline',n:'White line',ch:'l',mc:'#e8e8e0',mk:1,f(g,x,y,tx,ty,d){cmMarkLine(g,x,y,tx,ty,d,'wline',CMWHT[0],CMWHT[1],0,[[14,3]])}});
cmAddOvl({id:'wdash',n:'White dashed line',ch:'e',mc:'#e8e8e0',mk:1,f(g,x,y,tx,ty,d){cmMarkLine(g,x,y,tx,ty,d,'wdash',CMWHT[0],CMWHT[1],1,[[14,3]])}});
// crosswalk: wide white bars across the direction the crossing runs (a row of tiles across a road)
cmAddOvl({id:'xwalk',n:'Crosswalk',ch:'z',mc:'#e8e8e0',mk:1,f(g,x,y,tx,ty,d){const M=cmMarkDirs('xwalk',tx,ty,d),hz=!!M.h;g.fillStyle=CMWHT[0];
for(let k=0;k<2;k++)hz?g.fillRect(x+3+k*16,y+3,10,26):g.fillRect(x+3,y+3+k*16,26,10);cmSpeck(g,x+2,y+2,tx,ty,3,[CMWHT[1]],1,1,94)}});
