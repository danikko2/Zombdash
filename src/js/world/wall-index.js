//# world/wall-index.js — Fast wall lookup grid
// ----- spatial index for walls: per-frame checks only look at walls near the point (rebuilt whenever WL changes) -----
function wlBuild(){const S=64,cw=Math.ceil((WW+128)/S)+1,ch=Math.ceil((WH+128)/S)+1,c=new Array(cw*ch);
for(const w of WL){const a=Math.max(0,Math.floor((w[0]-32+64)/S)),b=Math.min(cw-1,Math.floor((w[0]+w[2]+32+64)/S)),d=Math.max(0,Math.floor((w[1]-32+64)/S)),e=Math.min(ch-1,Math.floor((w[1]+w[3]+32+64)/S));for(let j=d;j<=e;j++)for(let i=a;i<=b;i++)(c[j*cw+i]||(c[j*cw+i]=[])).push(w)}
wlAt.B={src:WL,n:WL.length,c,cw,ch}}
function wlAt(x,y){const B=wlAt.B;if(!B||B.src!==WL||B.n!==WL.length)wlBuild();const Q=wlAt.B,i=Math.floor((x+64)/64),j=Math.floor((y+64)/64);if(!(i>=0&&j>=0&&i<Q.cw&&j<Q.ch))return wlAt.E||(wlAt.E=[]);return Q.c[j*Q.cw+i]||wlAt.E||(wlAt.E=[])}

// green highway sign on the right side of the road
function subSign(g,ry){const x=2065,py=ry-16,pw=164,ph=54,bx=x-pw/2,by=py-ph-44;
g.fillStyle='rgba(0,0,0,.25)';g.fillRect(x-1,py-2,14,4);g.fillStyle='#16111c';g.fillRect(x-4,by+ph-2,8,py-by-ph+4);g.fillStyle='#8a9096';g.fillRect(x-3,by+ph,6,py-by-ph+1);g.fillStyle='#c8ccd0';g.fillRect(x-3,by+ph,2,py-by-ph+1);
g.fillStyle='#16111c';g.fillRect(bx-2,by-2,pw+4,ph+4);g.fillStyle='#1d7a3e';g.fillRect(bx,by,pw,ph);g.fillStyle='#f4f1e6';g.fillRect(bx+3,by+3,pw-6,2);g.fillRect(bx+3,by+ph-5,pw-6,2);g.fillRect(bx+3,by+3,2,ph-6);g.fillRect(bx+pw-5,by+3,2,ph-6);
g.textAlign='center';g.textBaseline='middle';g.fillStyle='#f4f1e6';g.font='bold 14px Arial, Helvetica, sans-serif';g.fillText('ZOMBDASH SCHOOL',x,by+17);g.font='bold 13px Arial, Helvetica, sans-serif';g.fillText('1 MILE',x-18,by+37);
const ax=x+22,ay=by+37;g.fillRect(ax,ay-2,22,5);g.beginPath();g.moveTo(ax+20,ay-8);g.lineTo(ax+32,ay+.5);g.lineTo(ax+20,ay+9);g.fill();g.textAlign='left';g.textBaseline='alphabetic';
g.fillStyle='rgba(0,0,0,.25)';g.fillRect(bx+pw-14,by+ph-10,6,3)}
// zombies never spawn somewhere they can't walk out of (e.g. boxed in by trees)
function fdBad(x,y){if(!fd||!gw||!fd.length)return 0;const i=Math.floor(x/gs),j=Math.floor(y/gs);if(i<0||j<0||i>=gw||j>=gh)return 0;return fd[j*gw+i]<0}

function zDr(z){const T=ZT[z.t],r=T.r;if(T.gh){ghDraw(z);return}if(T.sv){svDraw(z);return}if(T.boss){boss(z,T);return}if(SPR.complete&&SPR.naturalWidth&&ZS[z.t]){zsp(z,T);return}X.fillStyle=T.c;X.fillRect(z.x-r,z.y-r,r*2,r*2);
const a=Math.atan2(P.y-z.y,P.x-z.x);X.fillRect(z.x+Math.cos(a)*r-3+Math.cos(a-1.2)*4,z.y+Math.sin(a)*r-3+Math.sin(a-1.2)*4,6,6);X.fillRect(z.x+Math.cos(a)*r-3+Math.cos(a+1.2)*4,z.y+Math.sin(a)*r-3+Math.sin(a+1.2)*4,6,6);
X.fillStyle=T.eye||'#e33';X.fillRect(z.x-r*.6,z.y-r*.4,3,3);X.fillRect(z.x+r*.6-3,z.y-r*.4,3,3);
if(z.ds==1){X.fillStyle='#3a8bff';X.fillRect(z.x-1,z.y-r-12,3,7);X.fillRect(z.x-1,z.y-r-3,3,3)}
if(z.ds==2){X.fillStyle='rgba(255,255,255,.35)';X.fillRect(z.x-Math.cos(z.da)*12-r,z.y-Math.sin(z.da)*12-r,r*2,r*2)}}
